import React, { useContext } from "react";
import Header from "../components/Header";

export default function Dashboard() {
  return (
    <div className="bg-gray-100 mx-8">
      <Header />
      <main className="h-full overflow-y-auto ">
        <div className="container px-6 mx-auto grid">
          <div className="flex justify-between">
            <h2 className="my-6 text-2xl font-semibold text-gray-700 light:text-gray-200">
              Welcome Client
            </h2>
            <h5 className="my-6 text-2l font-semibold text-gray-700 light:text-gray-200">
              Total Project Running 4
            </h5>
          </div>

          <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-2 ">
            <div className="flex items-center p-4 bg-white rounded-lg shadow-xs light:bg-gray-800">
              <div className="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full light:text-blue-100 light:bg-blue-500">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                </svg>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-gray-600 light:text-gray-400">
                  Submitted frawings waiting for approval
                </p>
                <p className="text-lg font-semibold text-gray-700 light:text-gray-200">
                  376
                </p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-white rounded-lg shadow-xs light:bg-gray-800">
              <div className="p-3 mr-4 text-teal-500 bg-teal-100 rounded-full light:text-teal-100 light:bg-teal-500">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-gray-600 light:text-gray-400">
                  Pending RFI
                </p>
                <p className="text-lg font-semibold text-gray-700 light:text-gray-200">
                  35
                </p>
              </div>
            </div>
          </div>

          <div className="w-full overflow-hidden rounded-lg shadow-xs">
            <div className="w-full overflow-x-auto">
              <table className="w-full whitespace-no-wrap">
                <thead>
                  <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b light:border-gray-700 bg-gray-50 light:text-gray-400 light:bg-gray-800">
                    <th className="px-4 py-3">Project Name</th>
                    <th className="px-4 py-3">Timeline</th>
                    <th className="px-4 py-3">Progress</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y light:divide-gray-700 light:bg-gray-800">
                  <tr className="text-gray-700 light:text-gray-400">
                    <td className="px-4 py-3">
                      <div className="flex items-center text-sm">
                        <div className="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                          <img
                            className="object-cover w-full h-full rounded-full"
                            src="https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ"
                            alt=""
                            loading="lazy"
                          />
                          <div
                            className="absolute inset-0 rounded-full shadow-inner"
                            aria-hidden="true"
                          ></div>
                        </div>
                        <div>
                          <p className="font-semibold">Enclave IT Park </p>
                          {/* <p className="text-xs text-gray-600 light:text-gray-400">
                            10x Developer
                          </p> */}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">2 years</td>
                    <td className="px-4 py-3 text-xs">
                      <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full light:bg-green-700 light:text-green-100">
                        Approved
                      </span>
                    </td>
                  </tr>

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
                          <div
                            className="absolute inset-0 rounded-full shadow-inner"
                            aria-hidden="true"
                          ></div>
                        </div>
                        <div>
                          <p className="font-semibold">The Enclave </p>
                          {/* <p className="text-xs text-gray-600 light:text-gray-400">
                            Unemployed
                          </p> */}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">5 years</td>
                    <td className="px-4 py-3 text-xs">
                      <span className="px-2 py-1 font-semibold leading-tight text-orange-700 bg-orange-100 rounded-full light:text-white light:bg-orange-600">
                        Pending
                      </span>
                    </td>
                  </tr>

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
                          <div
                            className="absolute inset-0 rounded-full shadow-inner"
                            aria-hidden="true"
                          ></div>
                        </div>
                        <div>
                          <p className="font-semibold">
                            Enclave Residences Q1{" "}
                          </p>
                          {/* <p className="text-xs text-gray-600 light:text-gray-400">
                            Designer
                          </p> */}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">1 years</td>
                    <td className="px-4 py-3 text-xs">
                      <span className="px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-full light:text-red-100 light:bg-red-700">
                        Denied
                      </span>
                    </td>
                  </tr>

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
                          <div
                            className="absolute inset-0 rounded-full shadow-inner"
                            aria-hidden="true"
                          ></div>
                        </div>
                        <div>
                          <p className="font-semibold">Enclave Residences Q1</p>
                          {/* <p className="text-xs text-gray-600 light:text-gray-400">
                            Actress
                          </p> */}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">3 years</td>
                    <td className="px-4 py-3 text-xs">
                      <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full light:bg-green-700 light:text-green-100">
                        Approved
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="container px-6 mx-auto grid">
          <h5 className="my-6 text-2l font-semibold text-gray-700 light:text-gray-200">
            Latest submissions
          </h5>

          <div className="w-full overflow-hidden rounded-lg shadow-xs">
            <div className="w-full overflow-x-auto">
              <table className="w-full whitespace-no-wrap">
                <thead>
                  <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b light:border-gray-700 bg-gray-50 light:text-gray-400 light:bg-gray-800">
                    <th className="px-4 py-3">Project Name</th>
                    <th className="px-4 py-3">Submission</th>
                    <th className="px-4 py-3">status</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Submitted by</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y light:divide-gray-700 light:bg-gray-800">
                  <tr className="text-gray-700 light:text-gray-400">
                    <td className="px-4 py-3">
                      <div className="flex items-center text-sm">
                        <div className="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                          <img
                            className="object-cover w-full h-full rounded-full"
                            src="https://images.unsplash.com/photo-1566411520896-01e7ca4726af?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ"
                            alt=""
                            loading="lazy"
                          />
                          <div
                            className="absolute inset-0 rounded-full shadow-inner"
                            aria-hidden="true"
                          ></div>
                        </div>
                        <div>
                          <p className="font-semibold">Hitney Wouston</p>
                          <p className="text-xs text-gray-600 light:text-gray-400">
                            Singer
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">Forth floor plan</td>
                    <td className="px-4 py-3 text-xs">
                      <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full light:bg-green-700 light:text-green-100">
                        Approved
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">6/10/2020</td>
                    <td className="px-4 py-3 text-sm">Ram Sharma</td>
                  </tr>

                  <tr className="text-gray-700 light:text-gray-400">
                    <td className="px-4 py-3">
                      <div className="flex items-center text-sm">
                        <div className="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                          <img
                            className="object-cover w-full h-full rounded-full"
                            src="https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ"
                            alt=""
                            loading="lazy"
                          />
                          <div
                            className="absolute inset-0 rounded-full shadow-inner"
                            aria-hidden="true"
                          ></div>
                        </div>
                        <div>
                          <p className="font-semibold">Hans Burger</p>
                          <p className="text-xs text-gray-600 light:text-gray-400">
                            10x Developer
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">Third floor plan</td>
                    <td className="px-4 py-3 text-xs">
                      <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full light:bg-green-700 light:text-green-100">
                        Approved
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">6/10/2020</td>
                    <td className="px-4 py-3 text-sm">Karan Patil</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="container px-6 mx-auto grid">
          <h5 className="my-6 text-2l font-semibold text-gray-700 light:text-gray-200">
            Upcoming milestones
          </h5>
          <div className="w-full overflow-hidden rounded-lg shadow-xs">
            <div className="w-full overflow-x-auto">
              <table className="w-full whitespace-no-wrap">
                <thead>
                  <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b light:border-gray-700 bg-gray-50 light:text-gray-400 light:bg-gray-800">
                    <th className="px-4 py-3">Milestone</th>
                    <th className="px-4 py-3">Project name</th>

                    <th className="px-4 py-3">Due Date</th>
                    <th className="px-4 py-3">Responsible person</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y light:divide-gray-700 light:bg-gray-800">
                  <tr className="text-gray-700 light:text-gray-400">
                    <td className="px-4 py-3">
                      <div className="flex items-center text-sm">
                        15-12-2024
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">Forth floor plan</td>

                    <td className="px-4 py-3 text-sm">6/10/2020</td>
                    <td className="px-4 py-3 text-sm">Abhay Sharma</td>
                    <td className="px-4 py-3 text-xs">
                      <span className="px-2 py-1 font-semibold leading-tight text-orange-700 bg-orange-100 rounded-full light:text-white light:bg-orange-600">
                        Pending
                      </span>
                    </td>
                  </tr>

                  <tr className="text-gray-700 light:text-gray-400">
                    <td className="px-4 py-3">
                      <div className="flex items-center text-sm">
                        15-12-2024
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">Forth floor plan</td>
                    <td className="px-4 py-3 text-sm">6/10/2020</td>
                    <td className="px-4 py-3 text-sm">Omkar Sharma</td>
                    <td className="px-4 py-3 text-xs">
                      <span className="px-2 py-1 font-semibold leading-tight text-orange-700 bg-orange-100 rounded-full light:text-white light:bg-orange-600">
                        Pending
                      </span>
                    </td>
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
