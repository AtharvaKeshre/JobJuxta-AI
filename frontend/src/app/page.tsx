"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileSearch, Sparkles, Target, ListChecks, ArrowRight } from "lucide-react";
import NavBar from "@/src/components/NavBar";
import { container, fadeUp } from "@/src/lib/motion";

const features = [
  {
    icon: Target,
    title: "Instant Match Score",
    description:
      "See at a glance how well your resume fits any job description, scored 0–100 by AI.",
  },
  {
    icon: ListChecks,
    title: "Keyword Analysis",
    description:
      "Find out which skills and keywords from the posting are present in your resume — and which are missing.",
  },
  {
    icon: Sparkles,
    title: "Actionable Feedback",
    description:
      "Get concrete strengths and tailored suggestions to sharpen your resume for each role.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar title="JobJuxta-AI" />

      {/* Hero */}
      <section className="relative overflow-hidden px-4">
        {/* glow accent */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[-10rem] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]"
        />
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative mx-auto flex max-w-3xl flex-col items-center pt-24 pb-16 text-center"
        >
          <motion.span
            variants={fadeUp}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
          >
            <Sparkles size={15} />
            AI-powered resume analysis
          </motion.span>

          <motion.h1 variants={fadeUp} className="text-4xl font-bold leading-tight sm:text-6xl">
            Land the job with{" "}
            <span className="text-primary">JobJuxta&nbsp;AI</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-6 max-w-xl text-lg text-gray-300">
            Effortlessly analyze your resume against any job description.
            Get an instant match score, your strengths, improvement tips, and
            keyword analysis to boost your job-search success.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="group inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3 font-semibold text-white transition-colors hover:bg-primary/90"
              >
                Get started free
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </motion.button>
            </Link>
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-lg border border-gray-700 px-7 py-3 font-semibold text-gray-200 transition-colors hover:border-gray-500 hover:bg-gray-900"
              >
                Log in
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-4 pb-24">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid gap-6 sm:grid-cols-3"
        >
          {features.map(({ icon: Icon, title, description }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 transition-colors hover:border-primary/40"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon size={22} />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{title}</h3>
              <p className="text-sm leading-relaxed text-gray-400">
                {description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 rounded-2xl border border-gray-800 bg-gray-900/50 p-8"
        >
          <div className="mb-8 flex items-center gap-3">
            <FileSearch className="text-primary" size={24} />
            <h2 className="text-2xl font-bold">How it works</h2>
          </div>
          <motion.ol
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="grid gap-6 sm:grid-cols-3"
          >
            {[
              ["1", "Upload your resume", "Drop in a PDF — we extract the text instantly."],
              ["2", "Paste a job description", "Add the role you're targeting."],
              ["3", "Get your analysis", "Match score, keywords, and tailored tips in seconds."],
            ].map(([step, title, desc]) => (
              <motion.li key={step} variants={fadeUp} className="flex flex-col">
                <span className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary font-bold text-white">
                  {step}
                </span>
                <h3 className="mb-1 font-semibold">{title}</h3>
                <p className="text-sm text-gray-400">{desc}</p>
              </motion.li>
            ))}
          </motion.ol>
        </motion.div>
      </section>
    </div>
  );
}
