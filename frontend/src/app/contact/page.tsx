'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import NavBar from '../../components/NavBar';
import { container, fadeUp, fadeScale } from '@/src/lib/motion';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    setError(null);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.name.trim() || !formData.message.trim()) {
      setError('Please enter your name and a message.');
      return;
    }
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // No contact backend yet — open the user's mail client pre-filled.
    const subject = encodeURIComponent(formData.subject || `Message from ${formData.name}`);
    const body = encodeURIComponent(`${formData.message}\n\n— ${formData.name} (${formData.email})`);
    window.location.href = `mailto:atharvakeshre@gmail.com?subject=${subject}&body=${body}`;

    setSent(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex flex-col">
      <NavBar title="JobJuxta-AI" />
      
      <div className="flex flex-col items-center justify-center flex-1 px-4 py-12">
        <div className="max-w-6xl w-full">
          {/* Header Section */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="text-center mb-12"
          >
            <motion.h1 variants={fadeUp} className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-400 bg-clip-text text-transparent">
                Get In Touch
              </span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Feel free to reach out if you're looking to collaborate or have any questions.
            </motion.p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column - Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700/50">
                <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                  <span className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full mr-4 flex items-center justify-center">
                    📞
                  </span>
                  Contact Information
                </h2>
                
                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-center space-x-4 group">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      📧
                    </div>
                    <div>
                      <p className="text-orange-400 font-semibold mb-1">Email</p>
                      <a 
                        href="mailto:atharvakeshre@gmail.com" 
                        className="text-gray-300 hover:text-orange-400 transition-colors duration-300"
                      >
                        atharvakeshre@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* LinkedIn */}
                  <div className="flex items-center space-x-4 group">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      💼
                    </div>
                    <div>
                      <p className="text-amber-400 font-semibold mb-1">LinkedIn</p>
                      <a 
                        href="https://linkedin.com/in/atharva-keshre/" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-orange-400 transition-colors duration-300"
                      >
                        linkedin.com/in/atharva-keshre/
                      </a>
                    </div>
                  </div>

                  {/* GitHub */}
                  <div className="flex items-center space-x-4 group">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      💻
                    </div>
                    <div>
                      <p className="text-yellow-400 font-semibold mb-1">GitHub</p>
                      <a 
                        href="https://github.com/AtharvaKeshre" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-orange-400 transition-colors duration-300"
                      >
                        github.com/AtharvaKeshre
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Let's Connect Section */}
              <div className="bg-gradient-to-br from-orange-900/20 to-amber-900/20 rounded-xl border border-orange-500/20 p-6">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full mr-3 flex items-center justify-center">
                    🤝
                  </span>
                  Let's connect
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  I'm currently open to freelance opportunities and interesting projects. If you have a 
                  project that you want to get started or think you need my help with something, then get 
                  in touch.
                </p>
              </div>
            </motion.div>

            {/* Right Column - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700/50"
            >
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                <span className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full mr-4 flex items-center justify-center">
                  ✉️
                </span>
                Send Message
              </h2>

              <div className="space-y-6">
                {/* Name Field */}
                <div>
                  <div className="block text-white font-semibold mb-2">
                    Name
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-300"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <div className="block text-white font-semibold mb-2">
                    Email
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your email"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-300"
                  />
                </div>

                {/* Subject Field */}
                <div>
                  <div className="block text-white font-semibold mb-2">
                    Subject
                  </div>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-300"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <div className="block text-white font-semibold mb-2">
                    Message
                  </div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message"
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-300 resize-none"
                  />
                </div>

                {error && (
                  <div className="p-3 text-sm text-red-300 bg-red-900/30 border border-red-500/30 rounded-lg" role="alert">
                    {error}
                  </div>
                )}
                {sent && (
                  <div className="p-3 text-sm text-green-300 bg-green-900/30 border border-green-500/30 rounded-lg" role="status">
                    Thanks! Your message is ready in your email client — just hit send.
                  </div>
                )}

                {/* Submit Button with Gradient Border */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300 group-hover:duration-200 animate-pulse"></div>
                  <motion.button
                    onClick={handleSubmit}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative w-full px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center space-x-2"
                  >
                    <span>Send Message</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">📤</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Stats/Features */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
          >
            <motion.div variants={fadeUp} whileHover={{ y: -6 }} className="text-center p-6 bg-gradient-to-br from-orange-900/30 to-orange-800/30 rounded-xl border border-orange-500/20 backdrop-blur-sm">
              <div className="text-3xl mb-4">⚡</div>
              <div className="text-xl font-bold text-orange-400 mb-2">Fast Response</div>
              <div className="text-gray-300">Usually reply within 24 hours</div>
            </motion.div>
            <motion.div variants={fadeUp} whileHover={{ y: -6 }} className="text-center p-6 bg-gradient-to-br from-amber-900/30 to-amber-800/30 rounded-xl border border-amber-500/20 backdrop-blur-sm">
              <div className="text-3xl mb-4">🎯</div>
              <div className="text-xl font-bold text-amber-400 mb-2">Professional</div>
              <div className="text-gray-300">Quality work and dedication</div>
            </motion.div>
            <motion.div variants={fadeUp} whileHover={{ y: -6 }} className="text-center p-6 bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 rounded-xl border border-yellow-500/20 backdrop-blur-sm">
              <div className="text-3xl mb-4">🤝</div>
              <div className="text-xl font-bold text-yellow-400 mb-2">Collaborative</div>
              <div className="text-gray-300">Open to new opportunities</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;