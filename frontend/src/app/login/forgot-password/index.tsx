"use client"

import React, { useState } from "react";
import { Button } from "@/src/components/Button";

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        // Simulate API call
        try {
            // Here you would make the actual API call to your backend
            // await axios.post("http://localhost:8000/forgot-password", { email });
            
            setIsSubmitted(true);
        } catch (err) {
            setError("Failed to send reset email. Please try again.");
        }
    };

    const handleClose = () => {
        setEmail("");
        setIsSubmitted(false);
        setError(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {isSubmitted ? "Check Your Email" : "Reset Password"}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Modal Content */}
                {!isSubmitted ? (
                    <>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    placeholder="email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">
                                    {error}
                                </div>
                            )}

                            <div className="flex space-x-3">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="medium"
                                    className="flex-1"
                                >
                                    Send Reset Link
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="medium"
                                    onClick={handleClose}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </>
                ) : (
                    <>
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-800 mb-4">
                                <svg className="h-6 w-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                We've sent a password reset link to <strong>{email}</strong>. 
                                Please check your email and follow the instructions to reset your password.
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                Didn't receive the email? Check your spam folder or try again.
                            </p>
                        </div>

                        <div className="flex space-x-3">
                            <Button
                                type="button"
                                variant="primary"
                                size="medium"
                                onClick={handleClose}
                                className="flex-1"
                            >
                                Close
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                size="medium"
                                onClick={() => {
                                    setIsSubmitted(false);
                                    setEmail("");
                                }}
                                className="flex-1"
                            >
                                Try Again
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordModal;