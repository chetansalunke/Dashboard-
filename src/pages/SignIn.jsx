import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const SignIn = () => {
  const { user, signIn } = useContext(AuthContext);
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
    if (user && user.role) {
      localStorage.setItem("user", JSON.stringify(user));

      // Delay navigation to ensure state is updated
      setTimeout(() => {
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
            navigate("/login");
        }
      }, 0);
    }
  }, [user, navigate]);

  const [userData, setUserData] = useState({
    email: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value || "", // Ensure it's never undefined
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
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
        }),
      });

      const data = await response.json();
      console.log("Login Response:", data); // Debugging

      if (response.ok && data.user && data.user.role) {
        setUserData((prev) => ({
          ...prev,
          email: userData.email || userData.email,
          username: data.user.username || prev.username,
          role: data.user.role || prev.role,
          token: data.accessToken || prev.accessToken,
        }));

        localStorage.setItem(
          "user",
          JSON.stringify({
            email: userData.email || "",
            username: data.user.username || "",
            role: data.user.role || "",
            token: data.accessToken || "",
          })
        );

        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser && storedUser.token) {
          console.log("User Token:", storedUser.token);
          console.log("User role:", storedUser.role);
          console.log("Username: ",storedUser.username);
        }

        navigate(`/${data.user.role}-dashboard`);
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          apiError: "Invalid login credentials",
        }));
      }
    } catch (error) {
      console.error("Login Error:", error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        apiError: "Something went wrong. Please try again.",
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

              {/* Email input */}
              <label className="block text-sm">
                <span className="text-gray-700">Email</span>
                <input
                  type="email"
                  name="email"
                  value={userData.email || ""} // Ensures it’s never undefined
                  onChange={handleInputChange}
                  className="block w-full mt-1 text-sm form-input"
                  placeholder="Enter Your Email"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email}</p>
                )}
              </label>

              {/* Password input */}
              <label className="block mt-4 text-sm">
                <span className="text-gray-700">Password</span>
                <input
                  type="password"
                  name="password"
                  value={userData.password || ""} // Ensures it’s never undefined
                  onChange={handleInputChange}
                  className="block w-full mt-1 text-sm form-input"
                  placeholder="***************"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs">{errors.password}</p>
                )}
              </label>

              {/* API Error message */}
              {errors.apiError && (
                <p className="text-red-500 text-xs mt-2">{errors.apiError}</p>
              )}

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
