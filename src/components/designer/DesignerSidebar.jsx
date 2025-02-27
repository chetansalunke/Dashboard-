import { useNavigate } from "react-router-dom";
import { IoHomeOutline, IoDocumentTextOutline } from "react-icons/io5";

const DesignerSidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Home",
      icon: <IoHomeOutline className="w-5 h-5" />,
      path: "/designer-dashboard",
    },
    {
      name: "Projects",
      icon: <IoDocumentTextOutline className="w-5 h-5" />,
      path: "/designer-dashboard/projects",
    },
  ];

  return (
    <aside className="w-64 h-screen bg-white shadow-md">
      <div className="py-4 text-gray-500">
        <h1 className="text-2xl font-bold text-green-600 px-6">
          Gig<span className="text-black">Factory</span>
        </h1>
        <ul className="mt-6">
          {menuItems.map((item, index) => (
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
      </div>
    </aside>
  );
};

export default DesignerSidebar;