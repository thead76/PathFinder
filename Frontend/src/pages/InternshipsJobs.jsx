import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const InternshipsJobs = () => {
  const [locations, setLocations] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [description, setDescription] = useState("");
  const [recognition, setRecognition] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorPopup, setErrorPopup] = useState(""); // ✅ NEW

  // ✅ Load locations.json
  useEffect(() => {
    fetch("/data/locations.json")
      .then((res) => res.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : [data];
        setLocations(arr);
      });

    // 🎙️ Speech Recognition
    if ("webkitSpeechRecognition" in window) {
      const recog = new window.webkitSpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = "en-US";
      recog.onresult = (event) => {
        setDescription(
          (prev) => prev + (prev ? " " : "") + event.results[0][0].transcript
        );
      };
      setRecognition(recog);
    }
  }, []);

  const handleMicClick = () => {
    if (!recognition) return;
    if (recognition.isRecognizing) {
      recognition.stop();
      recognition.isRecognizing = false;
    } else {
      recognition.start();
      recognition.isRecognizing = true;
    }
  };

  // ✅ Fetch jobs from backend with validation
  const handleSearch = async () => {
  if (!selectedCountry || !selectedState || !selectedCity || !description) {
    setErrorPopup(
      "⚠️ Please fill Job Description, Country, State, and City before searching!"
    );
    return;
  }

  setLoading(true);
  try {
    const res = await fetch("http://127.0.0.1:8000/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description,
        city: selectedCity,
        state: selectedState,
        country: selectedCountry,
        date_posted: "all",
      }),
    });
    const data = await res.json();

    if (!data.jobs || data.jobs.length === 0) {
      // ✅ Show popup if no results
      setErrorPopup("🚫 No opportunities found. Try refining your search filters.");
      setJobs([]); 
    } else {
      setJobs(data.jobs);
    }
  } catch (err) {
    console.error("Error fetching jobs:", err);
    setErrorPopup("Something went wrong while fetching jobs. Please try again.");
  } finally {
    setLoading(false);
  }
};


  const states = locations.find((c) => c.name === selectedCountry)?.states || [];
  const cities = states.find((s) => s.name === selectedState)?.cities || [];

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
        🌟 Internship & Job Screener
      </h1>
      <p className="text-gray-400 max-w-2xl text-center mb-12">
        Find <span className="text-pink-400">personalized internships</span> and{" "}
        <span className="text-indigo-400">job opportunities</span> tailored to
        your skills, location, and interests.
      </p>

      {/* Search Form */}
      <div className="bg-[#1a103d] p-8 rounded-2xl shadow-lg max-w-3xl w-full space-y-8 border border-gray-700">
        <h2 className="text-2xl font-semibold text-center mb-4">
          🔎 Search Filters
        </h2>
        <hr className="border-gray-700" />

        {/* Job Description */}
        <div>
          <label className="block mb-2 font-semibold">Job Description</label>
          <div className="flex gap-2">
            <textarea
              className="w-full p-3 rounded-lg bg-[#0f0425] border border-gray-600 text-white focus:outline-none focus:border-pink-500"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g. React Developer, Data Analyst, Cloud Intern..."
            />
            {recognition && (
              <button
                onClick={handleMicClick}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-lg font-semibold hover:scale-105 transition-transform"
              >
                🎤
              </button>
            )}
          </div>
        </div>

        {/* Location Filters */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Country */}
          <div>
            <label className="block mb-2 font-semibold">Country</label>
            <select
              className="w-full p-3 rounded-lg bg-[#0f0425] border border-gray-600 text-white focus:outline-none focus:border-pink-500"
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                setSelectedState("");
                setSelectedCity("");
              }}
            >
              <option value="">Select Country</option>
              {locations.map((country) => (
                <option key={country.id} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          {/* State */}
          <div>
            <label className="block mb-2 font-semibold">State</label>
            <select
              className="w-full p-3 rounded-lg bg-[#0f0425] border border-gray-600 text-white focus:outline-none focus:border-pink-500"
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedCity("");
              }}
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.id} value={state.name}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block mb-2 font-semibold">City</label>
            <select
              className="w-full p-3 rounded-lg bg-[#0f0425] border border-gray-600 text-white focus:outline-none focus:border-pink-500"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city.id} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSearch}
          className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold w-full transition-transform duration-300 hover:scale-105"
        >
          {loading ? "🔄 Searching..." : "🚀 Find Opportunities"}
        </button>
      </div>

      {/* Results */}
      <div className="mt-14 w-full max-w-6xl text-center">
  {loading ? (
    <p className="text-gray-400 text-lg">⏳ Searching opportunities...</p>
  ) : (
    jobs.length > 0 && (
      <>
        <h2 className="text-3xl font-semibold text-center mb-8">
          🎯 Matching Opportunities
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.map((job, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="bg-[#1a103d] p-6 rounded-xl shadow-lg transition-transform hover:bg-gradient-to-r hover:from-indigo-500 hover:to-pink-500"
            >
              <h3 className="text-xl font-bold">{job.job_title}</h3>
              <p className="text-sm text-gray-300 mt-1">
                {job.employer_name}
              </p>
              <p className="text-sm">
                📍 {job.job_city}, {job.job_state}
              </p>
              <p className="text-xs mt-2">
                🗓️ Posted:{" "}
                <span className="text-pink-300">{job.date_posted}</span>
              </p>
              <p className="text-xs">
                ⭐ Match Score:{" "}
                <span className="text-indigo-300">{job.match_score}%</span>
              </p>
              <a
                href={job.job_apply_link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block bg-pink-500 px-4 py-2 rounded-full text-sm font-semibold hover:bg-pink-600 transition"
              >
                Apply Now →
              </a>
            </motion.div>
          ))}
        </div>
      </>
    )
  )}
</div>


      {/* ✅ Decorated Error Popup */}
      <AnimatePresence>
        {errorPopup && (
          <motion.div
            key="popup"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={() => setErrorPopup("")} // close on backdrop click
          >
            <div
              className="bg-[#1a103d] text-white p-6 rounded-2xl shadow-2xl max-w-md w-[92%] text-center border border-pink-500"
              onClick={(e) => e.stopPropagation()} // prevent closing on content click
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
};

export default InternshipsJobs;
