import { Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="bg-[#0a0215] text-gray-300 w-full mt-16"
      style={{ fontFamily: "Orbitron, sans-serif" }}
    >
      {/* Top Section */}
      <div className="w-full max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Brand & Mission */}
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"> 
            PathFinder
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            🌟 Your all-in-one mentor for skills, courses, resumes, internships, and career growth.
            Find your path to success with AI-powered guidance.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-pink-400">Explore</h3>
          <ul className="flex flex-col gap-2">
            <li>
              <a href="/" className="hover:text-pink-500 transition-colors">
                🏠 Home
              </a>
            </li>
            <li>
              <a href="/resume-guidance" className="hover:text-pink-500 transition-colors">
                📄 Resume Guidance
              </a>
            </li>
            <li>
              <a href="/courses" className="hover:text-pink-500 transition-colors">
                📚 Courses
              </a>
            </li>
            <li>
              <a href="/internships-jobs" className="hover:text-pink-500 transition-colors">
                💼 Internships & Jobs
              </a>
            </li>
            <li>
              <a href="/mock-interview" className="hover:text-pink-500 transition-colors">
                🎤 Mock Interviews
              </a>
            </li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-indigo-400">Get in Touch</h3>
          <ul className="flex flex-col gap-3">
            <li className="flex items-center gap-2">
              <Mail size={18} className="text-pink-400" />
              <a
                href="mailto:info@pathfinder.com"
                className="hover:text-pink-500 transition-colors"
              >
                info@pathfinder.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Twitter size={18} className="text-sky-400" />
              <a
                href="https://twitter.com/pathfinder"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-sky-400 transition-colors"
              >
                @PathFinder
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Linkedin size={18} className="text-blue-500" />
              <a
                href="https://linkedin.com/company/pathfinder"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors"
              >
                PathFinder
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full border-t border-gray-700"></div>

      {/* Bottom Section */}
      <div className="w-full text-center text-gray-500 text-sm py-6">
        &copy; {new Date().getFullYear()} PathFinder. All rights reserved.
      </div>
    </footer>
  );
}
