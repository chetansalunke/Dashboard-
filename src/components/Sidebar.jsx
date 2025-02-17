import { useNavigate } from "react-router-dom";
import {
  IoHomeOutline,
  IoDocumentTextOutline,
  IoPeopleOutline,
} from "react-icons/io5";

const Sidebar = ({ role }) => {
  const navigate = useNavigate();

  // Define different menu items based on user role
  const menuItems = {
    admin: [
      {
        name: "Dashboard",
        icon: <IoHomeOutline className="w-5 h-5" />,
        path: "/",
      },
      {
        name: "Projects",
        icon: <IoDocumentTextOutline className="w-5 h-5" />,
        path: "/admin-dashboard/projects", // Changed to absolute path
      },
      {
        name: "Users",
        icon: <IoPeopleOutline className="w-5 h-5" />,
        path: "/admin-dashboard/users", // Changed to absolute path
      },
    ],
    designer: [
      {
        name: "Dashboard",
        icon: <IoHomeOutline className="w-5 h-5" />,
        path: "/admin-dashboard",
      },
      {
        name: "Projects",
        icon: <IoDocumentTextOutline className="w-5 h-5" />,
        path: "/projects", // Changed to absolute path
      },
    ],
    developer: [
      {
        name: "Dashboard",
        icon: <IoHomeOutline className="w-5 h-5" />,
        path: "/admin-dashboard",
      },
    ],
    expert: [
      {
        name: "Dashboard",
        icon: <IoHomeOutline className="w-5 h-5" />,
        path: "/admin-dashboard",
      },
      {
        name: "Users",
        icon: <IoPeopleOutline className="w-5 h-5" />,
        path: "/users", // Changed to absolute path
      },
    ],
  };

  return (
    <aside className="w-64 h-screen bg-white shadow-md">
      <div className="py-4 text-gray-500">
        <h1 className="text-2xl font-bold text-green-600 px-6">
          Gig<span className="text-black">Factory</span>
        </h1>
        <ul className="mt-6">
          {menuItems[role]?.map((item, index) => (
            <li key={index} className="px-6 py-3">
              <button
                onClick={() => navigate(item.path)}
                className="flex items-center text-sm font-semibold text-gray-800 hover:text-gray-600 transition-all duration-150 focus:outline-none"
              >
                {item.icon}
                <span className="ml-4">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
        {/* <ul>
          <div className="px-6 my-6">
            <button
              onClick={() => navigate("create-user")}
              className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none"
            >
              Create User <span className="ml-2">+</span>
            </button>
          </div>
          <div className="px-6 my-6">
            <button
              onClick={() => navigate("create-project")}
              className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none"
            >
              Create Projects <span className="ml-2">+</span>
            </button>
          </div>
        </ul> */}
      </div>
    </aside>
  );
};

export default Sidebar;
