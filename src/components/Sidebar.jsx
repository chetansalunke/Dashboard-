import { useState } from "react";
import { Link } from "react-router-dom";
import {
  IoHomeOutline,
  IoDocumentTextOutline,
  IoAppsOutline,
  IoCropOutline,
} from "react-icons/io5";

const Sidebar = () => {
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
              Windmill
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
                to="/apporval"
                className="flex items-center text-sm font-semibold text-gray-800 light:text-gray-100 hover:text-gray-600"
              >
                <IoDocumentTextOutline className="w-5 h-5" />
                <span className="ml-4">Approvals</span>
              </Link>
            </li>

            <li className="relative px-6 py-3">
              <Link
                to="/rfi"
                className="flex items-center text-sm font-semibold text-gray-800 light:text-gray-100 hover:text-gray-600"
              >
                <IoCropOutline className="w-5 h-5" />
                <span className="ml-4">RFI</span>
              </Link>
            </li>

            <li className="relative px-6 py-3">
              <button
                className="flex items-center justify-between w-full text-sm font-semibold text-gray-800 light:text-gray-100 hover:text-gray-600"
                onClick={() => setIsPagesMenuOpen(!isPagesMenuOpen)}
              >
                <span className="flex items-center">
                  <IoAppsOutline className="w-5 h-5" />
                  <span className="ml-4">Files</span>
                </span>
                <svg
                  className={`w-4 h-4 transform ${
                    isPagesMenuOpen ? "rotate-180" : ""
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>

              {isPagesMenuOpen && (
                <ul className="mt-2 space-y-2 text-sm text-gray-500 light:text-gray-400">
                  <li>
                    <Link
                      to="/login"
                      className="block px-4 py-2 hover:text-gray-700"
                    >
                      Received
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="block px-4 py-2 hover:text-gray-700"
                    >
                      Sent
                    </Link>
                  </li>
                </ul>
              )}
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

export default Sidebar;
