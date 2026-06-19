import React from "react";
import Link from "next/link";
import { PenLine, ArrowLeft } from "lucide-react";
import NavBar from "../../components/NavBar";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex flex-col">
      <NavBar title="JobJuxta-AI" />
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <PenLine size={30} />
        </div>
        <h1 className="text-4xl font-bold sm:text-5xl">The Blog is coming soon</h1>
        <p className="mt-4 max-w-xl text-lg text-gray-400">
          We're putting together career tips, resume guidance, and product updates to
          help you land your next role. Check back shortly.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-2 rounded-lg border border-gray-700 px-6 py-3 font-semibold text-gray-200 transition-colors hover:border-primary/50 hover:text-primary"
        >
          <ArrowLeft size={18} />
          Back to home
        </Link>
      </div>
    </div>
  );
}
