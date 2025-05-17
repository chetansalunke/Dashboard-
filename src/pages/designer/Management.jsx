import React, { useState, useEffect } from "react";
import BASE_URL from "../../config";
import AssignedTasksView from "../../components/designer/AssignedTasksView";
import DrawingListView from "../../components/designer/DrawingListView";
import TeamsView from "../../components/designer/TeamsView";
import ProjectInfoView from "../../components/designer/ProjectInfoView";
import { useNavigate } from "react-router-dom";
import { List } from "lucide-react";


export default function Management() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [projectList, setProjectList] = useState([]);
  const [selectedProjectInfo, setSelectedProjectInfo] = useState([]);
  const navigate = useNavigate();

  const selectedProject = JSON.parse(
    localStorage.getItem("selectedProject") || "{}"
  );

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/projects/all`);
      if (!response.ok) throw new Error("HTTP error!");
      const data = await response.json();
      setProjectList(Array.isArray(data.projects) ? data.projects : []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjectList([]);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchSelectedProjectInfo = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      // const token =
      //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQ2NjcxNjI3LCJleHAiOjE3NDcyNzY0Mjd9.DmuXa27o5BPt2wAjxBbPUjIkIrCOY_QN_ueIQ2E3elw";
      const response = await fetch(
        `${BASE_URL}/api/projects/${selectedProject.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! ${response.status}: ${errorText}`);
      }
      const data = await response.json();
      // console.log("Fetched project data:", data);
      setSelectedProjectInfo(data.project || {});
    } catch (error) {
      console.error("Error fetching project:", error);
      setSelectedProjectInfo([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/all`);
      const data = await res.json();
      const filteredUsers = data.users?.filter((u) => u.role !== "admin") || [];
      setUsers(filteredUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchProjects();
    fetchSelectedProjectInfo();
  }, []);

  const [activeTab, setActiveTab] = useState("Project Information");

  const renderTabContent = () => {
    switch (activeTab) {
      case "Project Information":
        return (
          <ProjectInfoView
            selectedProject={selectedProjectInfo}
            users={users}
          />
        );
      case "Drawing List":
        return (
          <DrawingListView
            selectedProject={selectedProjectInfo}
            users={users}
          />
        );
      case "Assign Task":
        return (
          <AssignedTasksView
            selectedProject={selectedProjectInfo}
            users={users}
          />
        );
      case "Team":
        return <TeamsView selectedProject={selectedProjectInfo} />;
      default:
        return null;
    }
  };

  // Show additional tabs when a project is selected
  const tabs = [
    "Project Information",
    ...(selectedProject?.id ? ["Drawing List", "Assign Task", "Team"] : []),
  ];

  // return (
  //   <div className="bg-gray-100">
  //     <main className="h-full overflow-y-auto">
  //       <div className="space-y-4 m-6">
  //         <div className="flex justify-between items-center">
  //           <h1 className="text-2xl font-semibold text-gray-600">
  //             {selectedProject?.projectName || "No Project Selected"}
  //           </h1>
  //           <button
  //             onClick={() => navigate(-1)} // Go back to previous page
  //             className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded hover:bg-purple-700 transition"
  //           >
  //             Back
  //           </button>
  //         </div>

  //         <div className="bg-white rounded-lg shadow-lg mt-6 overflow-hidden">
  //           {/* Tab Navigation */}
  //           <div className="border-b border-gray-200">
  //             <nav className="flex">
  //               {tabs.map((tab) => (
  //                 <button
  //                   key={tab}
  //                   onClick={() => setActiveTab(tab)}
  //                   className={`px-5 py-4 text-sm font-medium transition-colors ${
  //                     activeTab === tab
  //                       ? "border-b-2 border-purple-600 text-purple-600"
  //                       : "text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300"
  //                   }`}
  //                 >
  //                   {tab}
  //                 </button>
  //               ))}
  //             </nav>
  //           </div>

  //           {/* Tab Content */}
  //           <div className="p-6">{renderTabContent()}</div>
  //         </div>
  //       </div>
  //     </main>
  //   </div>
  // );

  return (
    <div className="bg-gray-100">
      <main className="h-full overflow-y-auto">
        <div className="space-y-4 m-6">
          {/* <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-600">
            {selectedProject?.projectName }
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded hover:bg-purple-700 transition"
          >
            Back
          </button>
        </div> */}
          {selectedProject?.id && (
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-600">
                {selectedProject?.projectName}
              </h1>
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded hover:bg-purple-700 transition"
              >
                Back
              </button>
            </div>
          )}

          {!selectedProject?.id ? (
            <div className="">
              <div className="text-center py-8">
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                  <List size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-500 mb-4">
                  Please select a project first.
                </p>
                <button
                  onClick={() => navigate("/designer-dashboard/projects")}
                  className="px-3 py-1 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
                >
                  Go to Projects
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg mt-6 overflow-hidden">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200">
                <nav className="flex">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-5 py-4 text-sm font-medium transition-colors ${
                        activeTab === tab
                          ? "border-b-2 border-purple-600 text-purple-600"
                          : "text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">{renderTabContent()}</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
