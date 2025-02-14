import { useState } from "react";
import { Link } from "react-router-dom";
import {
  IoHomeOutline,
  IoDocumentTextOutline,
  IoAppsOutline,
  IoCropOutline,
} from "react-icons/io5";

const AdminSidebar = () => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isPagesMenuOpen, setIsPagesMenuOpen] = useState(false);

  return (
    <>
      {/* Overlay */}
      {isSideMenuOpen && (
        <div
          className="fixed inset-0 z-10 bg-black bg-opacity-50"
          onClick={() => setIsSideMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-white light:bg-gray-800 transform ${
          isSideMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-200 ease-in-out md:translate-x-0 md:static`}
      >
        <div className="py-4 text-gray-500 light:text-gray-400">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-6">
            <Link
              to="/"
              className="text-lg font-bold text-gray-800 light:text-gray-200"
            >
              <h1 className="text-2xl font-bold text-green-600">
                Gig<span className="text-black">factory</span>
              </h1>
              {/* Windmill */}
            </Link>
            {/* Close Button for Mobile */}
            <button
              className="text-gray-600 md:hidden"
              onClick={() => setIsSideMenuOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* Menu Items */}
          <ul className="mt-6">
            <li className="relative px-6 py-3">
              <Link
                to="/"
                className="flex items-center text-sm font-semibold text-gray-800 light:text-gray-100 hover:text-gray-600"
              >
                <IoHomeOutline className="w-5 h-5" />
                <span className="ml-4">Dashboard</span>
              </Link>
            </li>

            <li className="relative px-6 py-3">
              <Link
                to="/projects"
                className="flex items-center text-sm font-semibold text-gray-800 light:text-gray-100 hover:text-gray-600"
              >
                <IoDocumentTextOutline className="w-5 h-5" />
                <span className="ml-4">Projects</span>
              </Link>
            </li>

            <li className="relative px-6 py-3">
              <Link
                to="/users"
                className="flex items-center text-sm font-semibold text-gray-800 light:text-gray-100 hover:text-gray-600"
              >
                <IoCropOutline className="w-5 h-5" />
                <span className="ml-4">Users</span>
              </Link>
            </li>
          </ul>

          {/* CTA Button */}
          <div className="px-6 my-6">
            <button className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700">
              Create Account <span className="ml-2">+</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Toggle Button */}
      <button
        className="fixed top-4 left-4 z-30 p-2 text-white bg-gray-800 rounded-md md:hidden"
        onClick={() => setIsSideMenuOpen(!isSideMenuOpen)}
      >
        ☰
      </button>
    </>
  );
};

export default AdminSidebar;
