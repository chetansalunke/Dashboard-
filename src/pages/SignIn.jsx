import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // To navigate to another page after successful login
import { AuthContext } from "../context/AuthContext";

const SignIn = () => {
  const { user, signIn, error } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from localStorage on initial load
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      signIn(parsedUser.email, parsedUser.password, parsedUser.role); // Update context
    }
  }, []);
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user)); // Store user in localStorage

      switch (user.role) {
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "client":
          navigate("/client-dashboard");
          break;
        case "designer":
          navigate("/designer-dashboard");
          break;
        case "expert":
          navigate("/expert-dashboard");
          break;
        default:
          navigate("/login"); // Fallback route
      }
    }
  }, [user, navigate]);

  const [userData, setUserData] = useState({
    email: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState({}); // To store validation errors

  // Handle input changes dynamically
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Validation function
  const validateForm = () => {
    let formErrors = {};
    if (!userData.email) {
      formErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      formErrors.email = "Email is invalid";
    }
    if (!userData.password) {
      formErrors.password = "Password is required";
    }
    if (!userData.role) {
      formErrors.role = "Role is required";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0; // Returns true if no errors
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      signIn(userData.email, userData.password, userData.role);

      if (error) {
        // If there's an error, don't navigate and show the error
        return;
      }

      console.log("Login");
      console.log(user);

      if (user) {
        if (user.role === "admin") {
          navigate("/admin-dashboard");
        } else if (user.role === "client") {
          navigate("/client-dashboard");
        } else if (user.role === "designer") {
          navigate("/designer-dashboard");
        } else if (user.role === "expert") {
          navigate("/expert-dashboard");
        }
      }
    }
  };

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 light:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl light:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full light:hidden"
              src="../assets/img/login-office.jpeg"
              alt="Office"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full light:block"
              src="../assets/img/login-office-light.jpeg"
              alt="Office"
            />
          </div>
          <div className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 light:text-gray-200">
                Login
              </h1>

              {/* Email input */}
              <label className="block text-sm">
                <span className="text-gray-700 light:text-gray-400">Email</span>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  className="block w-full mt-1 text-sm light:border-gray-600 light:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
                  placeholder="Enter Your Email"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email}</p>
                )}
              </label>

              {/* Password input */}
              <label className="block mt-4 text-sm">
                <span className="text-gray-700 light:text-gray-400">
                  Password
                </span>
                <input
                  type="password"
                  name="password"
                  value={userData.password}
                  onChange={handleInputChange}
                  className="block w-full mt-1 text-sm light:border-gray-600 light:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
                  placeholder="***************"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs">{errors.password}</p>
                )}
              </label>

              {/* Role dropdown */}
              <label className="block text-sm mt-4">
                <span className="text-gray-700 light:text-gray-400">Role</span>
                <select
                  name="role"
                  value={userData.role}
                  onChange={handleInputChange}
                  className="block w-full mt-1 text-sm light:border-gray-600 light:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-select"
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="designer">Designer</option>
                  <option value="expert">Expert</option>
                  <option value="client">Client</option>
                </select>
                {errors.role && (
                  <p className="text-red-500 text-xs">{errors.role}</p>
                )}
              </label>

              {/* Login Error message */}
              {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
              >
                Log in
              </button>

              <hr className="my-8" />

              <p className="mt-4">
                <a
                  className="text-sm font-medium text-purple-600 light:text-purple-400 hover:underline"
                  href="./forgot-password.html"
                >
                  Forgot your password?
                </a>
              </p>
              <p className="mt-1">
                <a
                  className="text-sm font-medium text-purple-600 light:text-purple-400 hover:underline"
                  href="./create-account.html"
                >
                  Create account
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
