"use client"

import React, { useState } from "react";
import { Button } from "@/src/components/Button";
import Link from "next/link";
import NavBar from "@/src/components/NavBar";
import ForgotPasswordModal from "./forgot-password"; // Import the modal
import axios from "axios";
import { useRouter } from "next/navigation";

const LogIn: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false); // Add modal state
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
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
        }
    };

    return (
        <section className="bg-black text-white dark:bg-white-900">
            <NavBar title="जॉब जुक्सटा-AI" />
            <div className="flex justify-center min-h-screen">
                <div className="hidden bg-cover lg:block lg:w-2/5" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1494621930069-4fd4b2e24a11?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=715&q=80')" }}>
                </div>

                <div className="flex items-center w-full max-w-3xl p-8 mx-auto lg:px-12 lg:w-3/5">
                    <div className="w-full">
                        <h1 className="text-2xl font-semibold tracking-wider text-white capitalize dark:text-white">
                            Welcome back!
                        </h1>

                        <p className="mt-4 text-white dark:text-white">
                            Log in to access your account and continue your journey.
                        </p>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-1"> 
                            <div>
                                <label className="block mb-2 text-sm text-white-600 dark:text-white-200">Email address</label>
                                <input
                                    type="email"
                                    autoComplete="new-password"
                                    placeholder="email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full px-5 py-3 mt-2 text-black placeholder-white-400 bg-white border border-white-200 rounded-lg dark:placeholder-white-600 dark:bg-white-900 dark:text-white-300 dark:border-white-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm text-black-600 dark:text-white-200">Password</label>
                                <input
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full px-5 py-3 mt-2 text-black placeholder-white-400 bg-white border border-white-200 rounded-lg dark:placeholder-white-600 dark:bg-white-900 dark:text-white-300 dark:border-white-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                                    required
                                />
                                <div className="mt-2 text-right">
                                    {/* Replace Link with button to open modal */}
                                    <button
                                        type="button"
                                        onClick={() => setShowForgotPasswordModal(true)}
                                        className="text-sm text-blue-500 hover:underline dark:text-blue-400 focus:outline-none"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="mt-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="mt-4 p-3 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800" role="alert">
                                    {success}
                                </div>
                            )}

                            <Button
                                type="submit"
                                variant="primary"
                                size="medium"
                                className="flex items-center justify-center w-full"
                            >
                                <span>Log In </span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 rtl:-scale-x-100 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                        clipRule="evenodd" />
                                </svg>
                            </Button>
                        </form>
                        <p className="mt-6 text-sm text-center text-white-400">
                            Don't have an account yet?{" "}
                            <Link href="/signup">
                                <span className="text-blue-500 hover:underline dark:text-blue-400">
                                    Sign up
                                </span>
                            </Link>
                            .
                        </p>
                    </div>
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