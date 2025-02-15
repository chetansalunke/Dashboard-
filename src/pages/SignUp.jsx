import { useState } from "react";

import { useNavigate } from "react-router-dom";

// Create a mock function to simulate saving user data (you can change this to save to an actual file or API)
const saveUserData = (data) => {
  // This is just a mock, in a real-world app you would use an API or local storage.
  console.log("User Data saved: ", data);
  // Example: Save in local storage (or replace with actual storage logic)
  localStorage.setItem("user", JSON.stringify(data));
};

const SignUp = () => {
  console.log("Sign Component Loaded ");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Handle input change dynamically
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Validation logic
  const validateForm = () => {
    const newErrors = {};

    if (!userData.name) newErrors.name = "Name is required";
    if (!userData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(userData.email))
      newErrors.email = "Email is invalid";

    if (!userData.password) newErrors.password = "Password is required";
    else if (userData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // If no errors, return true
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form before saving
    if (validateForm()) {
      // Call saveUserData function to simulate saving user data
      saveUserData(userData);
      // Redirect to SignIn page or Dashboard
      navigate("/"); // Change the route as per your setup
    }
  };

  return (
    <div>
      <div className="flex items-center min-h-screen p-6 bg-gray-50 light:bg-gray-900">
        <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl light:bg-gray-800">
          <div className="flex flex-col overflow-y-auto md:flex-row">
            <div className="h-32 md:h-auto md:w-1/2">
              <img
                aria-hidden="true"
                className="object-cover w-full h-full light:hidden"
                src="../assets/img/create-account-office.jpeg"
                alt="Office"
              />
              <img
                aria-hidden="true"
                className="hidden object-cover w-full h-full light:block"
                src="../assets/img/create-account-office-light.jpeg"
                alt="Office"
              />
            </div>
            <div className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
              <div className="w-full">
                <h1 className="mb-4 text-xl font-semibold text-gray-700 light:text-gray-200">
                  Create account
                </h1>

                <form onSubmit={handleSubmit}>
                  {/* Name input */}
                  <label className="block text-sm">
                    <span className="text-gray-700 light:text-gray-400">
                      Name
                    </span>
                    <input
                      type="text"
                      name="name"
                      value={userData.name}
                      onChange={handleInputChange}
                      className="block w-full mt-1 text-sm light:border-gray-600 light:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
                      placeholder="Enter Your Name"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                  </label>

                  {/* Email input */}
                  <label className="block text-sm">
                    <span className="text-gray-700 light:text-gray-400">
                      Email
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={userData.email}
                      onChange={handleInputChange}
                      className="block w-full mt-1 text-sm light:border-gray-600 light:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
                      placeholder="Enter Your Email"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
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
                      <p className="text-sm text-red-500">{errors.password}</p>
                    )}
                  </label>

                  {/* Submit button */}
                  <button
                    type="submit"
                    className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                  >
                    Create account
                  </button>
                </form>

                <hr className="my-8" />

                <p className="mt-4">
                  <a
                    className="text-sm font-medium text-purple-600 light:text-purple-400 hover:underline"
                    href="/"
                  >
                    Already have an account? Login
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
