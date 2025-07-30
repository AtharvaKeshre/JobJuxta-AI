"use client";
import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';

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

  const router = useRouter();

const analyzeResumeWithAI = async () => {
  if (!jobDescription.trim() || uploadedFiles.length === 0) return;
  setAnalysisLoading(true); // Start loader
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
    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();
    setMatchPercentage(data.match_score || 0);
    setAiAnalysis(data);
  } catch (error) {
    console.error('AI analysis error:', error);
    setMatchPercentage(0);
    setAiAnalysis(null);
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
          const response = await fetch("http://localhost:8000", {
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
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  function getKeywordColor(value: any) {
    const str = String(value).toLowerCase();

    // Using `includes` for these is likely fine and allows for matching variations like "partially".
    if (str.includes('implied') || str.includes('partial')) {
      return 'text-yellow-400';
    }
    // Use word boundaries `\b` for more specific words to avoid matching them as substrings.
    // This fixes the issue with "no" in "northeastern".
    if (/\b(no|not)\b/.test(str)) {
      return 'text-red-400';
    }
    if (/\b(present|yes)\b/.test(str)) {
      return 'text-green-400';
    }
    return 'text-gray-300';
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with logout */}
      <header className="flex justify-between items-center py-6 px-10 border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-primary">जॉब जुक्सटा-AI <span className='text-white'>Dashboard</span></h1>
        </div>
        <div className='flex items-center space-x-4'>
          <div className='h-10 w-10 bg-white text-2xl rounded-full items-center justify-center flex text-black'>
            {userName?.charAt(0)}
          </div>
          {userName && (
            <span className="text-gray-300 text-base font-medium">{userName}</span>
          )}
          <button
            onClick={handleLogout}
            className="bg-primary hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto p-6">
        {/* Welcome message */}
        <div className="mb-8">
          <h2 className="text-3xl mb-4 items-center justify-center flex">Welcome to your dashboard!</h2>
          
        </div>

        {/* File upload section */}
        <div className="mb-8">
          <h3 className="text-lg mb-4 items-center justify-center flex">Upload Files</h3>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-blue-400 bg-blue-50 bg-opacity-10' 
                : 'border-gray-400 bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <input {...getInputProps()} />
            <div className="text-gray-300">
              {isDragActive ? (
                <p className="text-blue-400">Drop the files here...</p>
              ) : (
                <div>
                  <p className="mb-2">Drag & drop files here, or click to select</p>
                  <p className="text-sm text-gray-500">
                    Supported: PDF, DOC, DOCX, TXT, Images, Excel, PowerPoint (max 10MB each)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Uploaded files list */}
        {uploadedFiles.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg mb-4">Uploaded Files ({uploadedFiles.length})</h3>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-800 p-3 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type || 'Unknown type'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openFileInNewTab(file)}
                      className="bg-primary hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-400 hover:text-red-300 px-3 py-1 rounded text-sm transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Job Analysis Section */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Match Analysis Section */}
          <div className="flex-1 bg-gray-900 rounded-lg p-6 min-h-[500px]">
            <h3 className="text-lg font-semibold mb-4">Resume Match Analysis</h3>
            <div className="h-full flex flex-col">
                {uploadedFiles.length === 0 ? (
                  <div className="flex items-center justify-center flex-1">
                    <p className="text-gray-400 italic">Upload a resume to see match analysis</p>
                  </div>
                ) : !jobDescription.trim() ? (
                  <div className="flex items-center justify-center flex-1">
                    <p className="text-gray-400 italic">Add a job description to analyze match percentage</p>
                  </div>
                ) : analysisLoading ? (
                  <div className="flex items-center justify-center flex-1 min-h-[200px]">
                    <svg className="animate-spin h-10 w-10 text-primary mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    <span className="text-primary text-lg font-semibold">Analyzing...</span>
                  </div>
                ) : (
                <div className="space-y-6">
                  {/* Match Score */}
                  <div className="text-center">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          className="text-gray-700"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={`${matchPercentage * 2.51} 251`}
                          className="text-primary transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold text-white">{matchPercentage}%</span>
                      </div>
                    </div>
                    <h4 className="text-xl font-semibold mb-2">Overall Match Score</h4>
                    <p className="text-gray-400 text-sm">
                      {matchPercentage >= 80 ? 'Excellent match!' : 
                       matchPercentage >= 60 ? 'Good match' : 
                       matchPercentage >= 40 ? 'Moderate match' : 'Low match'}
                    </p>
                  </div>

                  {/* Match Details */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Match Breakdown</h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Skills Match</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(matchPercentage + 10, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-400 w-10">{Math.min(matchPercentage + 10, 100)}%</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Experience Level</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(matchPercentage - 5, 0)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-400 w-10">{Math.max(matchPercentage - 5, 0)}%</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Keywords Match</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${matchPercentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-400 w-10">{matchPercentage}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                    <h5 className="font-semibold mb-2 text-primary">Improvement Suggestions</h5>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Add more relevant keywords from the job description</li>
                      <li>• Highlight specific achievements and metrics</li>
                      <li>• Include missing technical skills mentioned in the job posting</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Job Description Section */}
          <div className="flex-1 bg-gray-900 rounded-lg p-6 min-h-[500px] flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Job Description</h3>
            <div className="flex flex-col flex-1 gap-4">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here to analyze how well your resume matches the requirements..."
                className="flex-1 bg-gray-800 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-400 resize-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all min-h-[300px]"
              />
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-2">
                <span className="text-sm text-gray-400">
                  {jobDescription.length} characters
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setJobDescription('')}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors text-sm"
                  >
                    Clear
                  </button>
                  <button
                    onClick={analyzeMatch}
                    disabled={!jobDescription.trim() || uploadedFiles.length === 0}
                    className="px-4 py-2 bg-primary hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors text-sm"
                  >
                    Analyze Match
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <section className="container mx-auto p-6 mt-10">
  <h3 className="text-lg font-semibold mb-4">Full AI Analysis</h3>
  <div className="bg-gray-900 rounded-lg p-6">
    {aiAnalysis ? (
      <div>
        {/* Match Score & Summary */}
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <span className="text-4xl font-bold text-primary">{aiAnalysis.match_score}%</span>
            <span className="text-gray-300 text-lg font-medium">Match Score</span>
          </div>
          <p className="mt-2 text-gray-200">{aiAnalysis.summary}</p>
        </div>

        {/* Strengths */}
        <div className="mb-6">
          <h4 className="text-primary font-semibold mb-2">Strengths</h4>
          <ul className="list-disc pl-6 text-gray-200 space-y-1">
            {aiAnalysis.strengths?.map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Areas for Improvement */}
        <div className="mb-6">
          <h4 className="text-yellow-400 font-semibold mb-2">Areas for Improvement</h4>
          <ul className="list-disc pl-6 text-gray-200 space-y-1">
            {aiAnalysis.areas_for_improvement?.map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Keyword Analysis */}
        <div>
          <h4 className="text-blue-400 font-semibold mb-2">Keyword Analysis</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {aiAnalysis.keyword_analysis &&
              Object.entries(aiAnalysis.keyword_analysis).map(([key, value], idx) => (
                <div key={idx} className="flex justify-between bg-gray-800 rounded px-3 py-2 text-sm">
                  <span className="text-gray-300">{key}</span>
                  <span className={`font-semibold ${getKeywordColor(value)}`}>
{typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value || '')}
                  </span>
                </div>
              ))}
          </div>  
        </div>
      </div>
    ) : (
      <p className="text-gray-400 italic">No analysis yet. Upload a resume and job description, then click Analyze Match.</p>
    )}
  </div>
</section>
      </main>
    </div>
  );
};

export default Home;