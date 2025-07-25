import React from 'react';
import NavBar from '../../components/NavBar';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex flex-col">
      <NavBar title="JobJuxta-AI" />
      <div className="flex flex-col items-center justify-center flex-1 px-4 py-12">
        <div className="max-w-4xl w-full">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-400 bg-clip-text text-transparent mb-6">
              About JobJuxta-AI
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Your intelligent career companion, designed to help job seekers stand out in today's competitive market through the power of AI.
            </p>
          </div>

          {/* Main Content Card */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-700/50">
            <div className="grid md:grid-cols-2 gap-8 mb-10">
              {/* Left Column - Features */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full mr-3 flex items-center justify-center">
                    ✨
                  </span>
                  Key Features
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      🧠
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-orange-400 mb-2">AI-Powered Resume Analysis</h3>
                      <p className="text-gray-300">Instantly compare your resume to any job description and receive a detailed match score with precision insights.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      💡
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-amber-400 mb-2">Personalized Feedback</h3>
                      <p className="text-gray-300">Get actionable suggestions to improve your resume, highlight your strengths, and address critical gaps.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - More Features */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full mr-3 flex items-center justify-center">
                    🚀
                  </span>
                  Advanced Tools
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      🎯
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-yellow-400 mb-2">Keyword & Skills Insights</h3>
                      <p className="text-gray-300">Discover which keywords and skills from job postings are present or missing in your resume.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      🔒
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-orange-300 mb-2">Easy & Secure</h3>
                      <p className="text-gray-300">Upload your resume with complete confidence—your data is private, encrypted, and never shared.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mission Statement */}
            <div className="text-center mb-8 p-6 bg-gradient-to-r from-orange-900/20 to-amber-900/20 rounded-xl border border-orange-500/20">
              <p className="text-lg text-gray-200 leading-relaxed">
                Whether you're a recent graduate taking your first career steps or an experienced professional seeking new opportunities, 
                <span className="font-semibold text-transparent bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text"> JobJuxta-AI empowers you</span> to tailor your applications with precision and maximize your chances of landing your dream job.
              </p>
            </div>

            {/* CTA Buttons with Gradient Borders */}
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300 group-hover:duration-200 animate-pulse"></div>
                <a href="/login" className="relative px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 group-hover:scale-105">
                  <span>Get Started</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </a>
              </div>
              
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-300 group-hover:duration-200"></div>
                <a href="/signup" className="relative px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 group-hover:scale-105">
                  <span>Sign Up Free</span>
                  <span className="group-hover:rotate-12 transition-transform duration-300">✨</span>
                </a>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="text-center p-6 bg-gradient-to-br from-orange-900/30 to-orange-800/30 rounded-xl border border-orange-500/20 backdrop-blur-sm">
              <div className="text-3xl font-bold text-orange-400 mb-2">99%</div>
              <div className="text-gray-300">Match Accuracy</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-amber-900/30 to-amber-800/30 rounded-xl border border-amber-500/20 backdrop-blur-sm">
              <div className="text-3xl font-bold text-amber-400 mb-2">10K+</div>
              <div className="text-gray-300">Resumes Analyzed</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 rounded-xl border border-yellow-500/20 backdrop-blur-sm">
              <div className="text-3xl font-bold text-yellow-400 mb-2">95%</div>
              <div className="text-gray-300">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;