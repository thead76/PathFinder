import { motion } from "framer-motion";
import heroImage from "../assets/hero.webp";

const Home = () => {
  return (
    <motion.div
      className="bg-[#0f0425] min-h-screen px-6 md:px-12 py-16 flex flex-col items-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6 }}
    >
      {/* Hero Section */}
      <div className="flex flex-wrap gap-12 justify-between max-w-6xl w-full">
        {/* Left Text */}
        <div className="flex-1 text-white min-w-[300px]">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PathFinder – <br />
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-extrabold">
              Your Mentor for Skills,
            </span>{" "}
            Jobs & Growth
          </h1>
          <p className="text-gray-300 text-lg mb-6">
            Personalized Roadmaps, Resume Help, Courses & Jobs – All in One Place...
          </p>

          <div className="flex flex-wrap gap-4">
            {/* Primary Button */}
            <button className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold transition-transform duration-300 hover:scale-105 hover:bg-transparent hover:border-2 hover:border-pink-500">
              Create Your Free Account
            </button>

            {/* Outline Button */}
            <button className="border-2 border-pink-500 text-pink-500 px-6 py-3 rounded-full font-semibold transition-transform duration-300 hover:scale-105 hover:bg-pink-500 hover:text-white">
              Request a Demo
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex-1 flex justify-center min-w-[300px]">
          <img
            src={heroImage}
            alt="Code preview"
            className="max-w-full rounded-xl"
          />
        </div>
      </div>

      {/* Middle Heading */}
      <div className="w-full mt-28 flex justify-center">
        <div className="text-white text-2xl md:text-2xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-full inline-block">
          Don’t just dream, find your path to success.
        </div>
      </div>

      {/* Feature Section */}
      <section className="w-full max-w-6xl mt-20 px-4 text-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Empower Yourself
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Your mentor in the journey of skills, interviews, and career growth.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-[#1a103d] p-8 rounded-xl text-center shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-pink-500">
            👥
            <h3 className="text-xl font-semibold mt-4 mb-2">Career Roadmaps</h3>
            <p className="text-gray-300">Step-by-step learning paths designed for every career field – Web Development, Data Science, Cloud, and more.</p>
          </div>

          <div className="bg-[#1a103d] p-8 rounded-xl text-center shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-pink-500">
            🤝
            <h3 className="text-xl font-semibold mt-4 mb-2">Best Courses & Resources</h3>
            <p className="text-gray-300">Discover top free and paid courses from trusted platforms to upskill faster.</p>
          </div>

          <div className="bg-[#1a103d] p-8 rounded-xl text-center shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-pink-500">
            🧑‍💼
            <h3 className="text-xl font-semibold mt-4 mb-2">Resume Builder & Guidance</h3>
            <p className="text-gray-300">Create ATS-friendly resumes with expert tips to stand out from the crowd.</p>
          </div>

          <div className="bg-[#1a103d] p-8 rounded-xl text-center shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-pink-500">
            📋
            <h3 className="text-xl font-semibold mt-4 mb-2">Soft Skills Training</h3>
            <p className="text-gray-300">Boost your communication, teamwork, leadership, and professional etiquette.</p>
          </div>

          <div className="bg-[#1a103d] p-8 rounded-xl text-center shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-pink-500">
            📁
            <h3 className="text-xl font-semibold mt-4 mb-2">Mock Interviews</h3>
            <p className="text-gray-300">Practice technical & HR interviews with real-time feedback to become job-ready.</p>
          </div>

          <div className="bg-[#1a103d] p-8 rounded-xl text-center shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-pink-500">
            🧩
            <h3 className="text-xl font-semibold mt-4 mb-2">Internship & Job Screener</h3>
            <p className="text-gray-300">Find personalized job and internship opportunities based on your skills.</p>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;
