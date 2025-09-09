import { Routes, Route } from "react-router-dom";
import NavbarMain from "./components/NavbarMain";
import Footer from "./components/Footer";
import ChatWidget from "./components/ChatWidget";

import Home from "./pages/Home";
import MockInterview from "./pages/MockInterview.jsx";
import Courses from "./pages/Courses.jsx";
import ResumeGuide from "./pages/ResumeGuide.jsx";
import InternshipsJobs from "./pages/InternshipsJobs.jsx";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <div className="bg-[#0f0425] min-h-screen flex flex-col font-inter">
        <NavbarMain />
        <main className="flex-1 font-serif">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/resume-guidance" element={<ResumeGuide />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/internships-jobs" element={<InternshipsJobs />} />
            <Route path="/mock-interview" element={<MockInterview />} />
          </Routes>
          <ChatWidget />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
