"use client";

import React, { useState } from "react";
import { Button } from "@/src/components/Button";
import NavBar from "@/src/components/NavBar";
import axios from "axios";

const SignUp: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountType, setAccountType] = useState<"admin" | "user" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Reset error before new submission
    setSuccess(null); // Reset success message

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!accountType) {
      setError("Please select an account type.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/signup`, {
        firstName,
        lastName,
        phone,
        email,
        password,
        accountType,
      });
      setSuccess(response.data.message || "Signup successful!");
      console.log("Signup successful:", response.data);
      // Optionally, redirect the user or clear the form
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "An unexpected error occurred. Please try again."
      );
      console.error("Signup error:", err.response?.data || err.message);
    }
  };

  return (
    <section className="bg-black text-black dark:bg-white-900">
      <NavBar title="जॉब जुक्सटा-AI" />
      <div className="flex justify-center min-h-screen">
        <div
          className="hidden bg-cover lg:block lg:w-2/5"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1494621930069-4fd4b2e24a11?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=715&q=80')",
          }}
        ></div>

        <div className="flex items-center w-full max-w-3xl p-8 mx-auto lg:px-12 lg:w-3/5">
          <div className="w-full">
            <h1 className="text-2xl font-semibold tracking-wider text-white capitalize dark:text-white">
              Get your free account now.
            </h1>

            <p className="mt-4 text-white dark:text-white">
              Let’s get you all set up so you can verify your personal account
              and begin setting up your profile.
            </p>

            {error && (
              <div
                className="mt-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
                role="alert"
              >
                {error}
              </div>
            )}
            {success && (
              <div
                className="mt-4 p-3 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800"
                role="alert"
              >
                {success}
              </div>
            )}

            <div className="mt-6">
              <h1 className="text-white-500 text-white">
                Select type of account
              </h1>

              <div className="mt-3 md:flex md:items-center md:-mx-2">
                <Button
                  variant={accountType === "admin" ? "primary" : "secondary"}
                  size="medium"
                  onClick={() => setAccountType("admin")}
                  className="flex justify-center w-full md:w-auto md:mx-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="mx-2">admin</span>
                </Button>

                <Button
                  variant={accountType === "user" ? "primary" : "secondary"}
                  size="medium"
                  onClick={() => setAccountType("user")}
                  className="flex justify-center w-full mt-4 md:mt-0 md:w-auto md:mx-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="mx-2">user</span>
                </Button>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2"
            >
              <div>
                <label className="block mb-2 text-sm text-white dark:text-white-200">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="block w-full px-5 py-3 mt-2 text-white-700 placeholder-white-400 bg-white border border-white-200 rounded-lg dark:placeholder-white-600 dark:bg-white-900 dark:text-white-300 dark:border-white-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-white dark:text-white-200">
                  Last name
                </label>
                <input
                  type="text"
                  placeholder="Snow"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="block w-full px-5 py-3 mt-2 text-white-700 placeholder-white-400 bg-white border border-white-200 rounded-lg dark:placeholder-white-600 dark:bg-white-900 dark:text-white-300 dark:border-white-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-white dark:text-white-200">
                  Phone number
                </label>
                <input
                  type="tel"
                  placeholder="XXX-XX-XXXX-XXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full px-5 py-3 mt-2 text-white-700 placeholder-white-400 bg-white border border-white-200 rounded-lg dark:placeholder-white-600 dark:bg-white-900 dark:text-white-300 dark:border-white-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-white dark:text-white-200">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="johnsnow@example.com"
                  autoComplete="new-username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-5 py-3 mt-2 text-white-700 placeholder-white-400 bg-white border border-white-200 rounded-lg dark:placeholder-white-600 dark:bg-white-900 dark:text-white-300 dark:border-white-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-white dark:text-white-200">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  autoComplete="new-password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-5 py-3 mt-2 text-white-700 placeholder-white-400 bg-white border border-white-200 rounded-lg dark:placeholder-white-600 dark:bg-white-900 dark:text-white-300 dark:border-white-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-white dark:text-white-200">
                  Confirm password
                </label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  autoComplete="new-password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full px-5 py-3 mt-2 text-white-700 placeholder-white-400 bg-white border border-white-200 rounded-lg dark:placeholder-white-600 dark:bg-white-900 dark:text-white-300 dark:border-white-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="medium"
                className="flex items-center justify-between w-40  col-span-1 md:col-span-2 ml-[250px]" // Adjusted for full width
              >
                <span>Sign Up </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 rtl:-scale-x-100"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
