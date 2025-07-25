
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      <div className="max-w-xl w-full flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-4 text-primary text-center">Welcome to JobJuxta-AI</h1>
        <p className="text-lg text-gray-300 mb-8 text-center">
          Effortlessly analyze your resume against any job description using AI.<br />
          Get instant feedback, strengths, improvement tips, and keyword analysis to boost your job search success.
        </p>
        <div className="flex space-x-4">
          <Link href="/login">
            <button className="px-6 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
              Login
            </button>
          </Link>
          <Link href="/signup">
            <button className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}