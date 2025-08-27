import { Routes, Route } from "react-router-dom";
import NavbarMain from "./components/NavbarMain";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import CodeReview from "./pages/CodeReview";
import CodeComments from "./pages/CodeComments.jsx";
import BugFinder from "./pages/BugFinder";
import ImproveCode from "./pages/ImproveCode";

function App() {
  return (
    <div className="bg-[#0f0425] min-h-screen flex flex-col font-inter">
      <NavbarMain />
      <main className="flex-1 font-serif" >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/code-review" element={<CodeReview />} />
          <Route path="/code-comments" element={<CodeComments />} />
          <Route path="/bug-finder" element={<BugFinder />} />
          <Route path="/improve-code" element={<ImproveCode />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
