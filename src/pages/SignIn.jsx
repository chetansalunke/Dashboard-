import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const SignIn = () => {
  const navigate = useNavigate();
  const { signIn, error } = useContext(AuthContext);

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value || "",
    }));
  };

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

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await signIn(userData.email, userData.password);
      navigate("/admin-dashboard"); // Redirect after successful login
    } catch (err) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        apiError: "Invalid credentials. Please try again.",
      }));
    }
  };

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full"
              src="../assets/img/login-office.jpeg"
              alt="Office"
            />
          </div>
          <div className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700">
                Login
              </h1>

              {/* Email Input */}
              <label className="block text-sm">
                <span className="text-gray-700">Email</span>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  className="block w-full mt-1 text-sm form-input"
                  placeholder="Enter Your Email"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email}</p>
                )}
              </label>

              {/* Password Input */}
              <label className="block mt-4 text-sm">
                <span className="text-gray-700">Password</span>
                <input
                  type="password"
                  name="password"
                  value={userData.password}
                  onChange={handleInputChange}
                  className="block w-full mt-1 text-sm form-input"
                  placeholder="***************"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs">{errors.password}</p>
                )}
              </label>

              {/* API Error Message */}
              {errors.apiError && (
                <p className="text-red-500 text-xs mt-2">{errors.apiError}</p>
              )}
              {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="block w-full px-4 py-2 mt-4 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
              >
                Log in
              </button>

              <hr className="my-8" />

              <p className="mt-4">
                <a
                  className="text-sm font-medium text-purple-600 hover:underline"
                  href="./forgot-password.html"
                >
                  Forgot your password?
                </a>
              </p>
              <p className="mt-1">
                <Link
                  className="text-sm font-medium text-purple-600 hover:underline"
                  to="/signup"
                >
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
