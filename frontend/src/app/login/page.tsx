"use client"

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Sparkles, Target, ListChecks } from "lucide-react";
import NavBar from "@/src/components/NavBar";
import ForgotPasswordModal from "./forgot-password"; // Import the modal
import { container, fadeUp } from "@/src/lib/motion";
import axios from "axios";
import { useRouter } from "next/navigation";

const LogIn: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false); // Add modal state
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsLoading(true);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
                email,
                password,
            });
            // Store JWT token in localStorage
            if (response.data.access_token) {
                localStorage.setItem("token", response.data.access_token);
                setSuccess("Login successful!");
                router.push("/home"); // Redirect to home page
            } else {
                setError("No token received from server.");
            }
        } catch (err: any) {
            setError(
                err.response?.data?.detail ||
                err.response?.data?.message ||
                "An unexpected error occurred. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
            <NavBar title="JobJuxta-AI" />

            <div className="flex justify-center min-h-[calc(100vh-4rem)]">
                {/* Branded left panel */}
                <div className="relative hidden lg:flex lg:w-2/5 overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1494621930069-4fd4b2e24a11?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=715&q=80')" }}
                    />
                    {/* gradient overlay for legibility + brand tint */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/80 to-primary/30" />

                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="relative z-10 flex flex-col justify-end h-full p-12"
                    >
                        <motion.span
                            variants={fadeUp}
                            className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
                        >
                            <Sparkles size={15} />
                            AI-powered resume analysis
                        </motion.span>
                        <motion.h2 variants={fadeUp} className="text-4xl font-bold leading-tight">
                            Land the job with{" "}
                            <span className="text-primary">JobJuxta&nbsp;AI</span>
                        </motion.h2>
                        <motion.ul variants={fadeUp} className="mt-6 space-y-3 text-gray-300">
                            <li className="flex items-center gap-3">
                                <Target size={18} className="text-primary" />
                                Instant resume-to-job match score
                            </li>
                            <li className="flex items-center gap-3">
                                <ListChecks size={18} className="text-primary" />
                                Keyword & skills gap analysis
                            </li>
                            <li className="flex items-center gap-3">
                                <Sparkles size={18} className="text-primary" />
                                Tailored, actionable feedback
                            </li>
                        </motion.ul>
                    </motion.div>
                </div>

                {/* Form panel */}
                <div className="flex items-center w-full max-w-3xl px-4 py-10 mx-auto sm:px-8 lg:px-12 lg:w-3/5">
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="w-full max-w-md mx-auto rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 shadow-2xl backdrop-blur-sm"
                    >
                        <motion.h1 variants={fadeUp} className="text-3xl font-bold tracking-tight">
                            Welcome back
                        </motion.h1>
                        <motion.p variants={fadeUp} className="mt-2 text-gray-400">
                            Log in to access your account and continue your journey.
                        </motion.p>
                        <motion.p variants={fadeUp} className="mt-3 text-sm text-primary/90">
                            Note: the service may take 30–60 seconds to respond on the first request.
                        </motion.p>

                        <motion.form variants={fadeUp} onSubmit={handleSubmit} className="mt-8 space-y-5">
                            {/* Email */}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-200">Email address</label>
                                <div className="relative">
                                    <Mail size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        autoComplete="email"
                                        placeholder="email@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full rounded-lg border border-gray-600/60 bg-gray-900/60 py-3 pl-11 pr-4 text-white placeholder-gray-500 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-200">Password</label>
                                <div className="relative">
                                    <Lock size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full rounded-lg border border-gray-600/60 bg-gray-900/60 py-3 pl-11 pr-11 text-white placeholder-gray-500 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((s) => !s)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 transition-colors hover:text-primary focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <div className="mt-2 text-right">
                                    <button
                                        type="button"
                                        onClick={() => setShowForgotPasswordModal(true)}
                                        className="text-sm text-primary hover:underline focus:outline-none"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 text-sm text-red-300 bg-red-900/30 border border-red-500/30 rounded-lg" role="alert">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="p-3 text-sm text-green-300 bg-green-900/30 border border-green-500/30 rounded-lg" role="status">
                                    {success}
                                </div>
                            )}

                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-7 py-3 font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Logging in…
                                    </>
                                ) : (
                                    <>
                                        Log In
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </motion.button>
                        </motion.form>

                        <motion.p variants={fadeUp} className="mt-6 text-sm text-center text-gray-400">
                            Don&apos;t have an account yet?{" "}
                            <Link href="/signup" className="text-primary hover:underline">
                                Sign up
                            </Link>
                        </motion.p>
                    </motion.div>
                </div>
            </div>

            {/* Add the modal component */}
            <ForgotPasswordModal
                isOpen={showForgotPasswordModal}
                onClose={() => setShowForgotPasswordModal(false)}
            />
        </section>
    )
}

export default LogIn;
