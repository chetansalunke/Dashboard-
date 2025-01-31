import React from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

export default function Approval() {
  const navigate = useNavigate(); // Initialize navigate

  const handleDownloadClick = (imageUrl) => {
    navigate("/image-view", { state: { imageUrl } }); // Navigate with state
  };
  return (
    <div className="bg-gray-100 mx-8">
      <Header />
      <main className="h-full overflow-y-auto ">
        <div className="container px-6 my-6 grid">
          <div className="w-full overflow-hidden rounded-lg shadow-xs">
            <div className="w-full overflow-x-auto">
              <table className="w-full whitespace-no-wrap">
                <thead>
                  <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b light:border-gray-700 bg-gray-50 light:text-gray-400 light:bg-gray-800">
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

                <tbody className="bg-white divide-y light:divide-gray-700 light:bg-gray-800">
                  <tr className="text-gray-700 light:text-gray-400">
                    <td className="px-4 py-3 flex-1 w-32">
                      <div className="flex items-center text-sm">
                        <div className="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                          <img
                            className="object-cover w-full h-full rounded-full"
                            src="https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ"
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
                            "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ"
                          )
                        }
                        className="px-3 py-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                      >
                        Download
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm">19 Days</td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="text-gray-700 light:text-gray-400">
                    <td className="px-4 py-3">
                      <div className="flex items-center text-sm">
                        <div className="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                          <img
                            className="object-cover w-full h-full rounded-full"
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&facepad=3&fit=facearea&s=707b9c33066bf8808c934c8ab394dff6"
                            alt=""
                            loading="lazy"
                          />
                        </div>
                        <p className="font-semibold">The Enclave</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">Building Blueprint</td>
                    <td className="px-4 py-3 text-sm">25-06-2023</td>
                    <td className="px-4 py-3 text-sm">John Doe</td>
                    <td className="px-4 py-3 text-sm">High</td>
                    <td className="px-4 py-3 text-xs">
                      <span className="px-2 py-1 font-semibold leading-tight text-orange-700 bg-orange-100 rounded-full">
                        Pending
                      </span>
                    </td>
                    <td>
                      <button class="px-3 py-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple">
                        Download
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm">10 Days</td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="text-gray-700 light:text-gray-400">
                    <td className="px-4 py-3">
                      <div className="flex items-center text-sm">
                        <div className="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                          <img
                            className="object-cover w-full h-full rounded-full"
                            src="https://images.unsplash.com/photo-1551069613-1904dbdcda11?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ"
                            alt=""
                            loading="lazy"
                          />
                        </div>
                        <p className="font-semibold">Enclave Residences Q1</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">Interior Design</td>
                    <td className="px-4 py-3 text-sm">30-07-2023</td>
                    <td className="px-4 py-3 text-sm">Jane Smith</td>
                    <td className="px-4 py-3 text-sm">Medium</td>
                    <td className="px-4 py-3 text-xs">
                      <span className="px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-full">
                        Denied
                      </span>
                    </td>
                    <td>
                      <button class="px-3 py-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple">
                        Download
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm">18 Days</td>
                  </tr>

                  {/* Row 4 */}
                  <tr className="text-gray-700 light:text-gray-400">
                    <td className="px-4 py-3">
                      <div className="flex items-center text-sm">
                        <div className="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                          <img
                            className="object-cover w-full h-full rounded-full"
                            src="https://images.unsplash.com/photo-1551006917-3b4c078c47c9?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ"
                            alt=""
                            loading="lazy"
                          />
                        </div>
                        <p className="font-semibold">Enclave Residences Q2</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">Exterior Design</td>
                    <td className="px-4 py-3 text-sm">10-08-2023</td>
                    <td className="px-4 py-3 text-sm">Michael Brown</td>
                    <td className="px-4 py-3 text-sm">Low</td>
                    <td className="px-4 py-3 text-xs">
                      <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full">
                        Approved
                      </span>
                    </td>
                    <td>
                      <button class="px-3 py-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple">
                        Download
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm">11 Days</td>
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
