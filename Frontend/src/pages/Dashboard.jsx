// src/pages/Dashboard.jsx

const Dashboard = () => {
  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Welcome Card */}
      <div className="bg-[#1a1033] p-6 rounded-2xl shadow-md mb-6">
        <h2 className="text-xl font-semibold">Welcome Back 👋</h2>
        <p className="text-gray-300 mt-2">
          Here you can manage your profile, projects, and tasks.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-[#1a1033] p-6 rounded-2xl shadow-md hover:shadow-lg transition">
          <h3 className="text-lg font-semibold">My Projects</h3>
          <p className="text-gray-400 mt-2">
            View and manage all your ongoing projects.
          </p>
          <button className="mt-4 bg-cyan-500 px-4 py-2 rounded-lg font-medium hover:bg-cyan-600 transition">
            View Projects
          </button>
        </div>

        <div className="bg-[#1a1033] p-6 rounded-2xl shadow-md hover:shadow-lg transition">
          <h3 className="text-lg font-semibold">My Tasks</h3>
          <p className="text-gray-400 mt-2">
            Track your tasks and mark progress easily.
          </p>
          <button className="mt-4 bg-cyan-500 px-4 py-2 rounded-lg font-medium hover:bg-cyan-600 transition">
            View Tasks
          </button>
        </div>

        <div className="bg-[#1a1033] p-6 rounded-2xl shadow-md hover:shadow-lg transition">
          <h3 className="text-lg font-semibold">Reports</h3>
          <p className="text-gray-400 mt-2">
            Generate performance and activity reports.
          </p>
          <button className="mt-4 bg-cyan-500 px-4 py-2 rounded-lg font-medium hover:bg-cyan-600 transition">
            View Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
