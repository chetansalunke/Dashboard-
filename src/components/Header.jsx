import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [islightMode, setIslightMode] = useState(false);
  const [isNotificationsMenuOpen, setIsNotificationsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const profileMenuRef = useRef(null);

  const toggleTheme = () => setIslightMode(!islightMode);
  const toggleNotificationsMenu = () =>
    setIsNotificationsMenuOpen(!isNotificationsMenuOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

  const handleLogout = async () => {
    try {
      // Clear user session data
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("projects");
      delete axios.defaults.headers.common["Authorization"];

      // Navigate to the login page
      navigate("/");
    } catch (error) {
      console.error("Error while logging out:", error);
    }
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="z-10 py-4 bg-white shadow-md light:bg-gray-800">
      <div className="container flex items-center justify-between h-full px-6 mx-auto text-purple-600 light:text-purple-300">
        {/* Mobile hamburger */}
        {/* <button
          className="p-1 mr-5 -ml-1 rounded-md md:hidden focus:outline-none focus:shadow-outline-purple"
          onClick={toggleSidebar}
          aria-label="Menu"
        >
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button> */}

        {/* Sidebar Toggle Button */}
      <button onClick={toggleSidebar} className="mr-4">
        <svg className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 5h14a1 1 0 100-2H3a1 1 0 000 2zm0 5h14a1 1 0 100-2H3a1 1 0 000 2zm0 5h14a1 1 0 100-2H3a1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      </button>

        {/* Search input */}
        <div className="flex justify-center flex-1 lg:mr-32">
          <div className="relative w-full max-w-xl mr-6 focus-within:text-purple-500">
            <div className="absolute inset-y-0 flex items-center pl-2">
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              className="w-full pl-8 pr-2 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 border-0 rounded-md light:placeholder-gray-500 light:focus:shadow-outline-gray light:focus:placeholder-gray-600 light:bg-gray-700 light:text-gray-200 focus:placeholder-gray-500 focus:bg-white focus:border-purple-300 focus:outline-none focus:shadow-outline-purple form-input"
              type="text"
              placeholder="Search for projects"
              aria-label="Search"
            />
          </div>
        </div>

        <ul className="flex items-center flex-shrink-0 space-x-6">
          {/* Theme toggler */}
          {/* <li className="flex">
            <button
              className="rounded-md focus:outline-none focus:shadow-outline-purple"
              onClick={toggleTheme}
              aria-label="Toggle color mode"
            >
              {!islightMode ? (
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </li> */}

          {/* Notifications menu */}
          <li className="relative">
            <button
              className="relative align-middle rounded-md focus:outline-none focus:shadow-outline-purple"
              onClick={toggleNotificationsMenu}
              aria-label="Notifications"
              aria-haspopup="true"
            >
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              <span className="absolute top-0 right-0 inline-block w-3 h-3 transform translate-x-1 -translate-y-1 bg-red-600 border-2 border-white rounded-full light:border-gray-800" />
            </button>

            {isNotificationsMenuOpen && (
              <ul
                className="absolute right-0 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md light:text-gray-300 light:border-gray-700 light:bg-gray-700"
                onBlur={() => setIsNotificationsMenuOpen(false)}
              ></ul>
            )}
          </li>

          {/* Profile menu */}
          <li className="relative" ref={profileMenuRef}>
            <button
              className="align-middle rounded-full focus:shadow-outline-purple focus:outline-none"
              onClick={toggleProfileMenu}
              aria-label="Account"
              aria-haspopup="true"
            >
              <img
                className="object-cover w-8 h-8 rounded-full"
                src="https://images.unsplash.com/photo-1502378735452-bc7d86632805?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=aa3a807e1bbdfd4364d1f449eaa96d82"
                alt="Profile"
                aria-hidden="true"
              />
            </button>

            {isProfileMenuOpen && (
              <ul className="absolute right-0 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md dark:border-gray-700 dark:text-gray-300 dark:bg-gray-700">
                <li>
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md"
                  >
                    Profile
                  </a>
                </li>
                <li>
                  <a
                    href="/settings"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md"
                  >
                    Settings
                  </a>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
