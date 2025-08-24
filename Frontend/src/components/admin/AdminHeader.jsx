import { FaSignOutAlt } from "react-icons/fa";
import { logout } from "../../utils/auth";

function AdminHeader() {
  return (
    <header className="relative bg-red-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
      {/* Logo & Title Center */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="bg-white text-red-900 font-extrabold text-lg px-3 py-1 rounded-md shadow-md">
            GT
          </div>
          <h1 className="text-xl font-bold tracking-wide">GoodTeacher | Admin Panel</h1>
        </div>
      </div>

      {/* Logout Button Right */}
      <button
        onClick={logout}
        className="ml-auto flex items-center gap-2 bg-white text-red-900 px-4 py-2 rounded-md shadow hover:bg-gray-100 transform hover:scale-105 transition duration-300 z-10"
      >
        <FaSignOutAlt /> Logout
      </button>
    </header>
  );
}

export default AdminHeader;
