import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const NavbarMain = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="flex justify-between items-center px-8 py-4 sticky top-0 z-50 w-full text-white backdrop-blur-sm bg-[#0f0425]/10 font-orbitron" style={{ fontFamily: "Orbitron, sans-serif" }}>
      {/* Logo */}
      <div className="text-xl md:text-2xl font-medium tracking-wider uppercase">
        PathFinder
      </div>

      {/* Hamburger (mobile) */}
      <div className="flex md:hidden cursor-pointer" onClick={toggleMenu}>
        {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </div>

      {/* Nav Links */}
      <nav
        className={`${
          menuOpen
            ? "flex flex-col items-center gap-4 py-4 absolute top-full left-0 right-0 bg-[#0f0425] md:hidden"
            : "hidden md:flex items-center gap-8"
        }`}
      >
        <NavLink
          to="/"
          onClick={closeMenu}
          className={({ isActive }) =>
            `uppercase text-sm tracking-wide transition-colors ${
              isActive
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-white hover:text-gray-300"
            }`
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/resume-guidance"
          onClick={closeMenu}
          className={({ isActive }) =>
            `uppercase text-sm tracking-wide transition-colors ${
              isActive
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-white hover:text-gray-300"
            }`
          }
        >
          Resume Guidance
        </NavLink>
<NavLink
          to="/courses"
          onClick={closeMenu}
          className={({ isActive }) =>
            `uppercase text-sm tracking-wide transition-colors ${
              isActive
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-white hover:text-gray-300"
            }`
          }
        >
          Courses
        </NavLink>
          <NavLink
          to="/mock-interview"
          onClick={closeMenu}
          className={({ isActive }) =>
            `uppercase text-sm tracking-wide transition-colors ${
              isActive
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-white hover:text-gray-300"
            }`
          }
        >
          Mock Interview
        </NavLink>

        

        <NavLink
          to="/internships-jobs"
          onClick={closeMenu}
          className={({ isActive }) =>
            `uppercase text-sm tracking-wide transition-colors ${
              isActive
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-white hover:text-gray-300"
            }`
          }
        >
          Internship/Jobs
        </NavLink>

        <button className="bg-white text-[#0f0425] px-4 py-2 rounded font-semibold text-sm hover:bg-gray-300 transition">
          Login / Signup
        </button>
      </nav>
    </header>
  );
};

export default NavbarMain;
