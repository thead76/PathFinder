import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const InternshipsJobs = () => {
  const [locations, setLocations] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [description, setDescription] = useState("");
  const [recognition, setRecognition] = useState(null);

  // ✅ Load JSON from public folder
  useEffect(() => {
    fetch("/data/locations.json")
      .then((res) => res.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : [data];
        setLocations(arr);
      });

    // 🎙️ Setup Speech Recognition
    if ("webkitSpeechRecognition" in window) {
      const recog = new window.webkitSpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = "en-US";
      recog.onresult = (event) => {
        setDescription((prev) => prev + (prev ? " " : "") + event.results[0][0].transcript);
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

  // Find states + cities based on selection
  const states =
    locations.find((c) => c.name === selectedCountry)?.states || [];

  const cities =
    states.find((s) => s.name === selectedState)?.cities || [];

  return (
    <motion.div
      className="bg-[#0f0425] min-h-screen px-6 md:px-12 py-16 flex flex-col items-center text-white"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-4xl md:text-5xl font-bold mb-8">
        Internship & Job Screener
      </h1>

      <div className="bg-[#1a103d] p-8 rounded-xl shadow-lg max-w-3xl w-full space-y-6">
        {/* Job Description */}
        <div>
          <label className="block mb-2 font-semibold">Job Description</label>
          <div className="flex gap-2">
            <textarea
              id="description"
              className="w-full p-3 rounded-lg bg-[#0f0425] border border-gray-600 text-white focus:outline-none focus:border-pink-500"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the role..."
            />
            {recognition && (
              <button
                id="micBtn"
                onClick={handleMicClick}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-lg font-semibold hover:scale-105 transition-transform"
              >
                🎤
              </button>
            )}
          </div>
        </div>

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

        {/* Date Posted */}
        <div>
          <label className="block mb-2 font-semibold">Date Posted</label>
          <select
            className="w-full p-3 rounded-lg bg-[#0f0425] border border-gray-600 text-white focus:outline-none focus:border-pink-500"
          >
            <option value="all">All</option>
            <option value="24hrs">Past 24 Hours</option>
            <option value="week">Past Week</option>
            <option value="month">Past Month</option>
          </select>
        </div>

        {/* Submit Button */}
        <button className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold w-full transition-transform duration-300 hover:scale-105">
          Find Opportunities
        </button>
      </div>
    </motion.div>
  );
};

export default InternshipsJobs;
