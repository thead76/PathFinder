 import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ResumeGuide() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorPopup, setErrorPopup] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorPopup("");
    setResult(null);

    const formData = new FormData();
    formData.append("resume", document.getElementById("resume").files[0]);
    formData.append(
      "job_description",
      document.getElementById("job_description").value
    );

    try {
      const response = await fetch(
        "https://resume-screener-dummy.onrender.com/analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        setResult(data.data);
      } else {
        setErrorPopup(data.message || "Something went wrong!");
      }
    } catch (err) {
      setErrorPopup("⚠️ Failed to connect: " + err.message);
    }
    setLoading(false);
  };

  return (
    <motion.div
      className="bg-[#0f0425] min-h-screen px-6 md:px-12 py-16 flex flex-col items-center text-white"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6 }}
    >
      {/* Title Section */}
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
        📄 AI Resume Analyzer
      </h1>
      <p className="text-gray-400 max-w-2xl text-center mb-12">
        Upload your <span className="text-pink-400">resume</span> and compare it
        with a <span className="text-indigo-400">job description</span> to get
        insights & match score.
      </p>

      {/* Form Card */}
      <div className="bg-[#1a103d] p-8 rounded-2xl shadow-lg max-w-3xl w-full space-y-8 border border-gray-700">
        <h2 className="text-2xl font-semibold text-center mb-4">
          🔎 Upload & Analyze
        </h2>
        <hr className="border-gray-700" />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Resume Upload */}
          <div>
            <label className="block mb-2 font-semibold">
              Upload Resume (PDF)
            </label>
            <input
              type="file"
              id="resume"
              accept="application/pdf"
              required
              className="w-full p-3 rounded-lg bg-[#0f0425] border border-gray-600 text-white focus:outline-none focus:border-pink-500"
            />
          </div>

          {/* Job Description */}
          <div>
            <label className="block mb-2 font-semibold">
              Paste Job Description
            </label>
            <textarea
              id="job_description"
              rows="6"
              required
              className="w-full p-3 rounded-lg bg-[#0f0425] border border-gray-600 text-white focus:outline-none focus:border-pink-500"
              placeholder="E.g. React Developer role requiring frontend skills..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold w-full transition-transform duration-300 hover:scale-105"
          >
            {loading ? "🔄 Analyzing..." : "🚀 Analyze Resume"}
          </button>
        </form>
      </div>

      {/* Results Section */}
      <div className="mt-14 w-full max-w-4xl text-left">
        {loading && (
          <p className="text-gray-400 text-lg">⏳ Analyzing resume...</p>
        )}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1a103d] p-8 rounded-2xl shadow-lg border border-gray-700 space-y-6"
          >
            {/* Match Score */}
            <h2 className="text-2xl font-bold text-pink-400">✅ Match Score</h2>
            <div className="w-full bg-gray-700 rounded-full h-5">
              <div
                className="h-5 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500"
                style={{ width: `${parseInt(result.match_score)}%` }}
              ></div>
            </div>
            <p className="text-lg font-semibold">
              {result.match_score}% Match
            </p>

            {/* Missing Skills */}
            <h3 className="text-xl font-semibold text-indigo-400">
              ❌ Missing Skills
            </h3>
            <ul className="list-disc pl-6 text-gray-300">
              {result.missing_skills.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>

            {/* Suggestions */}
            <h3 className="text-xl font-semibold text-pink-400">
              💡 Suggestions
            </h3>
            <ul className="list-disc pl-6 text-gray-300">
              {result.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>

            {/* Summary */}
            <h3 className="text-xl font-semibold text-indigo-400">📝 Summary</h3>
            <p className="text-gray-300">{result.summary}</p>
          </motion.div>
        )}
      </div>

      {/* ✅ Error Popup */}
      <AnimatePresence>
        {errorPopup && (
          <motion.div
            key="popup"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={() => setErrorPopup("")}
          >
            <div
              className="bg-[#1a103d] text-white p-6 rounded-2xl shadow-2xl max-w-md w-[92%] text-center border border-pink-500"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-pink-400 mb-3">🚫 Oops!</h2>
              <p className="text-gray-300 mb-6">{errorPopup}</p>
              <button
                onClick={() => setErrorPopup("")}
                className="bg-gradient-to-r from-pink-500 to-indigo-500 px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-transform"
              >
                Got it 👍
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}