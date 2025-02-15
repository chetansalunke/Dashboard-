import React, { useState } from "react";
import Header from "../../components/Header";

export default function Projects() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleDownloadClick = (url) => {
    window.open(url, "_blank");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Data:", formData);
  };

  return (
    <div className="bg-gray-100 ">
      <Header />
      <main className="h-full overflow-y-auto">
        <div className="container px-6 my-6 grid">
          <div className="flex justify-end">
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
            >
              Create Project
            </button>
          </div>
          <br />
          {isFormOpen && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md light:bg-gray-800">
                <label className="block text-sm">
                  <span className="text-gray-700 light:text-gray-400">
                    Project Name
                  </span>
                  <input
                    className="block w-full mt-1 text-sm light:border-gray-600 light:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
                    placeholder="Jane Doe"
                    fdprocessedid="lalert"
                    required
                  />
                </label>

                <label className="block mt-4 text-sm">
                  <span className="text-gray-700 light:text-gray-400">
                    Description
                  </span>
                  <textarea
                    className="block w-full mt-1 text-sm light:text-gray-300 light:border-gray-600 light:bg-gray-700 form-textarea focus:border-purple-400 focus:outline-none focus:shadow-outline-purple light:focus:shadow-outline-gray"
                    rows="3"
                    placeholder="Enter some long form content."
                    required
                  ></textarea>
                </label>
                <br />
                <label className="block text-sm">
                  <span className="text-gray-700 light:text-gray-400">
                    Duration
                  </span>
                  <input
                    className="block w-full mt-1 text-sm light:border-gray-600 light:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
                    placeholder="Duration (in days)"
                    fdprocessedid="lalert"
                    type="number"
                    required
                  />
                </label>
                <br />
                <label className="block text-sm">
                  <span className="text-gray-700 light:text-gray-400">
                    Project Size
                  </span>
                  <input
                    className="block w-full mt-1 text-sm light:border-gray-600 light:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
                    placeholder="Size of the Project (MB)"
                    fdprocessedid="lalert"
                    type="number"
                    required
                  />
                </label>
                <br />
                <label className="block text-sm">
                  <span className="text-gray-700 light:text-gray-400">
                    Upload Documents/Design Documents
                  </span>

                  <input
                    type="file"
                    className="block w-full mt-1 text-sm light:border-gray-600 light:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
                    required
                  />
                </label>
                <br />
                <label className="block text-sm">
                  <span className="text-gray-700 light:text-gray-400">
                    Assigned to
                  </span>
                  <input
                    className="block w-full mt-1 text-sm light:border-gray-600 light:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
                    placeholder="Jane Doe"
                    fdprocessedid="lalert"
                    required
                  />
                </label>

                <br />
                <div className="flex justify-center">
                  <button className="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple">
                    Submit
                  </button>
                </div>
              </div>
            </form>
          )}
          <div className="w-full overflow-hidden rounded-lg shadow-xs">
            <div className="w-full overflow-x-auto">
              <table className="w-full whitespace-no-wrap">
                <thead>
                  <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
                    <th className="px-4 py-3">Project Name</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Submission Date</th>
                    <th className="px-4 py-3">Sent by</th>
                    <th className="px-4 py-3">Priority</th>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">Document</th>
                    <th className="px-4 py-3">Pending Form</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y">
                  <tr className="text-gray-700">
                    <td className="px-4 py-3 flex-1 w-32">
                      <div className="flex items-center text-sm">
                        <div className="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                          <img
                            className="object-cover w-full h-full rounded-full"
                            src="https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80"
                            alt=""
                            loading="lazy"
                          />
                        </div>
                        <p className="font-semibold">Enclave IT Park</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">Door Design</td>
                    <td className="px-4 py-3 text-sm">21-02-2023</td>
                    <td className="px-4 py-3 text-sm">Siddharth Nahta</td>
                    <td className="px-4 py-3 text-sm">Low</td>
                    <td className="px-4 py-3 text-xs">
                      <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full">
                        Approved
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() =>
                          handleDownloadClick(
                            "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80"
                          )
                        }
                        className="px-3 py-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                      >
                        Download
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm">19 Days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
