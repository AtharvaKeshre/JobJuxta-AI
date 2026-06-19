"use client";
import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import {
  Upload, FileText, ExternalLink, Trash2, LogOut, Loader2,
  Sparkles, Target, ClipboardList, CheckCircle2, AlertTriangle, Eraser, BarChart3,
} from 'lucide-react';
import { fadeUp, fadeScale } from '@/src/lib/motion';

// Helper to decode JWT
function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

const Home: React.FC = () => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [userName, setUserName] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [matchPercentage, setMatchPercentage] = useState<number>(0);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const router = useRouter();

const analyzeResumeWithAI = async () => {
  if (!jobDescription.trim() || uploadedFiles.length === 0) return;
  setAnalysisLoading(true); // Start loader
  setAnalysisError(null);
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('job_description', jobDescription);
  formData.append('resume_file', uploadedFiles[0]);
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resume/analyze`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });
    if (!response.ok) {
      // Surface the backend's detail message (e.g. quota exceeded) to the user.
      let detail = `Request failed (${response.status})`;
      try {
        const errData = await response.json();
        detail = errData.detail || detail;
      } catch {
        // non-JSON error body; keep the default message
      }
      throw new Error(detail);
    }
    const data = await response.json();
    setMatchPercentage(data.match_score || 0);
    setAiAnalysis(data);
  } catch (error: any) {
    console.error('AI analysis error:', error);
    setMatchPercentage(0);
    setAiAnalysis(null);
    setAnalysisError(error?.message || 'Something went wrong while analyzing. Please try again.');
  } finally {
    setAnalysisLoading(false); // Stop loader
  }
};

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    router.push('/login');
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log('Files dropped:', acceptedFiles);
    setUploadedFiles(prev => [...prev, ...acceptedFiles]);

    // Example: Process files here
    acceptedFiles.forEach(file => {
      console.log(`File: ${file.name}, Size: ${file.size} bytes, Type: ${file.type}`);
    });
  }, []);

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const openFileInNewTab = (file: File) => {
    const url = URL.createObjectURL(file);
    const newWindow = window.open(url, '_blank');

    // Clean up the URL after a delay to prevent memory leaks
    if (newWindow) {
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
    }
  };

const analyzeMatch = analyzeResumeWithAI;


  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check authentication
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Decode user info from token
      const payload = parseJwt(token);
      if (payload) {
        if (payload.firstName && payload.lastName) {
          setUserName(`${payload.firstName} ${payload.lastName}`);
        } else if (payload.firstName) {
          setUserName(payload.firstName);
        } else if (payload.sub) {
          setUserName(payload.sub);
        } else {
          setUserName(null);
        }
      }

      // Fetch data from API
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            if (response.status === 401) {
              // Token expired or invalid
              localStorage.removeItem('token');
              router.push('/login');
              return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          setMessage(data.message || 'Welcome to the app!');
        } catch (error) {
          console.error("Error fetching data:", error);
          setMessage('Error loading data. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [router]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/vnd.ms-powerpoint': ['.ppt']
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-300">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-lg">Loading your dashboard…</span>
        </div>
      </div>
    );
  }

  // Compute real keyword coverage from the AI's keyword_analysis object:
  // the share of listed keywords that are actually present in the resume.
  function getKeywordCoverage(): number | null {
    const ka = aiAnalysis?.keyword_analysis;
    if (!ka || typeof ka !== 'object') return null;
    const values = Object.values(ka);
    if (values.length === 0) return null;
    const present = values.filter((v) => /\b(present|yes)\b/.test(String(v).toLowerCase())).length;
    return Math.round((present / values.length) * 100);
  }

  // Normalize the AI's free-text keyword value into a labelled status with colors.
  // `badge` styles the pill (bg/text/border); `dot` is the leading status dot.
  function getKeywordStatus(value: any) {
    const str = String(value ?? '').toLowerCase();

    // Order matters: "partially present" also contains "present", and
    // "not present" also contains "present" — so check those first.
    if (str.includes('partial')) {
      return { label: 'Partially Present', badge: 'border-orange-500/30 bg-orange-500/10 text-orange-300', dot: 'bg-orange-400' };
    }
    if (str.includes('implied')) {
      return { label: 'Implied', badge: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300', dot: 'bg-yellow-400' };
    }
    // Word boundaries avoid matching "no" inside words like "northeastern".
    if (/\b(no|not|absent|missing|none|lacking)\b/.test(str)) {
      return { label: 'Absent', badge: 'border-red-500/30 bg-red-500/10 text-red-300', dot: 'bg-red-400' };
    }
    if (/\b(present|yes|found)\b/.test(str)) {
      return { label: 'Present', badge: 'border-green-500/30 bg-green-500/10 text-green-300', dot: 'bg-green-400' };
    }
    // Fallback: show the raw value if it doesn't match a known status.
    return { label: String(value ?? '—') || '—', badge: 'border-gray-600/40 bg-gray-700/40 text-gray-300', dot: 'bg-gray-400' };
  }

  const firstName = userName ? userName.split(' ')[0] : null;
  const canAnalyze = jobDescription.trim().length > 0 && uploadedFiles.length > 0 && !analysisLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-30 flex justify-between items-center py-4 px-6 sm:px-10 border-b border-gray-800 bg-black/50 backdrop-blur-md"
      >
        <h1 className="text-xl sm:text-2xl font-bold text-primary">
          JobJuxta-AI <span className="text-white font-semibold">Dashboard</span>
        </h1>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-amber-600 flex items-center justify-center font-bold text-white shadow-lg">
            {userName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          {userName && (
            <span className="hidden sm:inline text-gray-200 text-sm font-medium">{userName}</span>
          )}
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-3 py-2 text-sm font-semibold text-gray-200 transition-colors hover:border-primary/50 hover:text-primary"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </motion.button>
        </div>
      </motion.header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        {/* Greeting */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Welcome back{firstName ? `, ${firstName}` : ''} 👋
          </h2>
          <p className="mt-1 text-gray-400">
            Upload your resume, paste a job description, and let AI score your match.
          </p>
        </motion.div>

        {/* Two-column: inputs (left) + results (right) */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* LEFT — Inputs */}
          <motion.section
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 backdrop-blur-sm"
          >
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <Upload size={18} className="text-primary" />
              Your resume
            </h3>

            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`group flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed p-4 text-left transition-colors ${
                isDragActive
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-600 bg-gray-900/40 hover:border-primary/60 hover:bg-gray-900/70'
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Upload size={18} />
              </div>
              {isDragActive ? (
                <p className="text-sm font-medium text-primary">Drop the files here…</p>
              ) : (
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-200">Drag &amp; drop, or click to select</p>
                  <p className="text-xs text-gray-500">
                    Only <strong className="text-primary">PDF</strong> allowed for now. Max size: 10MB.
                  </p>
                </div>
              )}
            </div>

            {/* Uploaded files */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-400">
                  Uploaded files ({uploadedFiles.length})
                </p>
                <AnimatePresence initial={false}>
                  {uploadedFiles.map((file, index) => (
                    <motion.div
                      key={`${file.name}-${file.size}-${index}`}
                      layout
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 16 }}
                      transition={{ duration: 0.25 }}
                      className="flex items-center gap-3 rounded-lg border border-gray-700/50 bg-gray-900/60 p-3"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FileText size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{file.name}</p>
                        <p className="text-xs text-gray-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB · {file.type || 'Unknown type'}
                        </p>
                      </div>
                      <button
                        onClick={() => openFileInNewTab(file)}
                        aria-label="Open file"
                        title="Open file"
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-primary"
                      >
                        <ExternalLink size={16} />
                      </button>
                      <button
                        onClick={() => removeFile(index)}
                        aria-label="Remove file"
                        title="Remove file"
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Job description */}
            <h3 className="mb-3 mt-8 flex items-center gap-2 text-lg font-semibold">
              <ClipboardList size={18} className="text-primary" />
              Job description
            </h3>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here to analyze how well your resume matches the requirements…"
              className="min-h-[220px] w-full resize-none rounded-lg border border-gray-600/60 bg-gray-900/60 p-4 text-white placeholder-gray-500 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <div className="mt-3 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
              <span className="text-sm text-gray-500">{jobDescription.length} characters</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setJobDescription('')}
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-700 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-600"
                >
                  <Eraser size={16} />
                  Clear
                </button>
                <motion.button
                  onClick={analyzeMatch}
                  disabled={!canAnalyze}
                  whileHover={{ scale: canAnalyze ? 1.03 : 1 }}
                  whileTap={{ scale: canAnalyze ? 0.97 : 1 }}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-gray-600"
                >
                  {analysisLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Analyzing…
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Analyze Match
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.section>

          {/* RIGHT — Match analysis */}
          <motion.section
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="flex min-h-[500px] flex-col rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 backdrop-blur-sm"
          >
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <Target size={18} className="text-primary" />
              Resume match analysis
            </h3>
            <div className="flex flex-1 flex-col">
              {uploadedFiles.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center text-center">
                  <Upload size={32} className="mb-3 text-gray-600" />
                  <p className="italic text-gray-400">Upload a resume to see match analysis</p>
                </div>
              ) : !jobDescription.trim() ? (
                <div className="flex flex-1 flex-col items-center justify-center text-center">
                  <ClipboardList size={32} className="mb-3 text-gray-600" />
                  <p className="italic text-gray-400">Add a job description to analyze match percentage</p>
                </div>
              ) : analysisLoading ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center min-h-[200px]">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <span className="text-lg font-semibold text-primary">Analyzing your resume…</span>
                  <span className="text-sm text-gray-500">This can take 30–60s on the first request</span>
                </div>
              ) : analysisError ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
                  <AlertTriangle size={32} className="text-red-400" />
                  <p className="font-semibold text-red-300">Analysis failed</p>
                  <p className="max-w-sm text-sm text-gray-400">{analysisError}</p>
                  <button
                    onClick={analyzeMatch}
                    className="mt-1 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                  >
                    <Sparkles size={16} />
                    Try again
                  </button>
                </div>
              ) : !aiAnalysis ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
                  <Sparkles size={32} className="text-gray-600" />
                  <p className="italic text-gray-400">Click “Analyze Match” to see your results</p>
                </div>
              ) : (
                <motion.div variants={fadeScale} initial="hidden" animate="show" className="space-y-6">
                  {/* Match Score */}
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="relative mx-auto mb-4 h-32 w-32"
                    >
                      <svg className="h-32 w-32 -rotate-90 transform" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-700" />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          strokeLinecap="round"
                          strokeDasharray={`${matchPercentage * 2.51} 251`}
                          className="text-primary transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold text-white">{matchPercentage}%</span>
                      </div>
                    </motion.div>
                    <h4 className="mb-2 text-xl font-semibold">Overall Match Score</h4>
                    <p className="text-sm text-gray-400">
                      {matchPercentage >= 80 ? 'Excellent match!' :
                       matchPercentage >= 60 ? 'Good match' :
                       matchPercentage >= 40 ? 'Moderate match' : 'Low match'}
                    </p>
                  </div>

                  {/* Match Breakdown */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Match Breakdown</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Overall Match</span>
                        <div className="flex items-center space-x-2">
                          <div className="h-2 w-24 rounded-full bg-gray-700">
                            <div className="h-2 rounded-full bg-primary transition-all duration-500" style={{ width: `${matchPercentage}%` }} />
                          </div>
                          <span className="w-10 text-sm text-gray-400">{matchPercentage}%</span>
                        </div>
                      </div>

                      {getKeywordCoverage() !== null && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Keyword Coverage</span>
                          <div className="flex items-center space-x-2">
                            <div className="h-2 w-24 rounded-full bg-gray-700">
                              <div className="h-2 rounded-full bg-green-500 transition-all duration-500" style={{ width: `${getKeywordCoverage()}%` }} />
                            </div>
                            <span className="w-10 text-sm text-gray-400">{getKeywordCoverage()}%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Suggestions */}
                  {aiAnalysis?.areas_for_improvement?.length > 0 && (
                    <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
                      <h5 className="mb-2 flex items-center gap-2 font-semibold text-primary">
                        <Sparkles size={16} />
                        Improvement Suggestions
                      </h5>
                      <ul className="space-y-1 text-sm text-gray-300">
                        {aiAnalysis.areas_for_improvement.slice(0, 4).map((item: string, idx: number) => (
                          <li key={idx}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.section>
        </div>

        {/* Full AI Analysis */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-8 rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 backdrop-blur-sm"
        >
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <BarChart3 size={18} className="text-primary" />
            Full AI Analysis
          </h3>
          {aiAnalysis ? (
            <motion.div variants={fadeUp} initial="hidden" animate="show">
              {/* Match Score & Summary */}
              <div className="mb-6 rounded-xl border border-gray-700/50 bg-gray-900/50 p-5">
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold text-primary">{aiAnalysis.match_score}%</span>
                  <span className="text-lg font-medium text-gray-300">Match Score</span>
                </div>
                <p className="mt-2 text-gray-200">{aiAnalysis.summary}</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Strengths */}
                <div className="rounded-xl border border-gray-700/50 bg-gray-900/50 p-5">
                  <h4 className="mb-3 flex items-center gap-2 font-semibold text-green-400">
                    <CheckCircle2 size={18} />
                    Strengths
                  </h4>
                  <ul className="list-disc space-y-1 pl-6 text-gray-200">
                    {aiAnalysis.strengths?.map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Areas for Improvement */}
                <div className="rounded-xl border border-gray-700/50 bg-gray-900/50 p-5">
                  <h4 className="mb-3 flex items-center gap-2 font-semibold text-yellow-400">
                    <AlertTriangle size={18} />
                    Areas for Improvement
                  </h4>
                  <ul className="list-disc space-y-1 pl-6 text-gray-200">
                    {aiAnalysis.areas_for_improvement?.map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Keyword Analysis */}
              <div className="mt-6">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h4 className="font-semibold text-gray-200">Keyword Analysis</h4>
                  {/* Legend */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                    <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-green-400" />Present</span>
                    <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-orange-400" />Partial</span>
                    <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-yellow-400" />Implied</span>
                    <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-400" />Absent</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {aiAnalysis.keyword_analysis &&
                    Object.entries(aiAnalysis.keyword_analysis).map(([key, value], idx) => {
                      const status = getKeywordStatus(value);
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-2 rounded-lg border border-gray-700/50 bg-gray-900/60 px-3 py-2 text-sm"
                        >
                          <span className="truncate text-gray-300" title={key}>{key}</span>
                          <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${status.badge}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                            {status.label}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BarChart3 size={32} className="mb-3 text-gray-600" />
              <p className="italic text-gray-400">
                No analysis yet. Upload a resume and job description, then click Analyze Match.
              </p>
            </div>
          )}
        </motion.section>
      </main>
    </div>
  );
};

export default Home;
