import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { IoChevronUpOutline, IoChevronDownOutline } from "react-icons/io5";

import {
  IoHomeOutline,
  IoDocumentTextOutline,
  IoPeopleOutline,
  IoChatbubbleEllipsesOutline,
  IoBrushOutline,
} from "react-icons/io5";
import { IoChatbubbleOutline } from "react-icons/io5";
import { IoCheckmarkDoneOutline } from "react-icons/io5";

const Sidebar = ({ role }) => {
  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = useState({});

  // Toggle submenu
  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  // Define different menu items based on user role
  const menuItems = {
    admin: [
      {
        name: "Dashboard",
        icon: <IoHomeOutline className="w-5 h-5" />,
        path: "/admin-dashboard",
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
      {
        name: "Design",
        icon: <IoBrushOutline className="w-5 h-5" />,
        path: "/admin-dashboard/design",
      },
      {
        name: "Communication",
        icon: <IoChatbubbleEllipsesOutline className="w-5 h-5" />,
        subItems: [
          {
            name: "RFI",
            path: "/admin-dashboard/communication/rfi",
          },
        ],
      },
      {
        name: "Change Order",
        icon: <IoBrushOutline className="w-5 h-5" />,
        path: "/admin-dashboard/change-order",
      },
    ],
    designer: [
      {
        name: "Home",
        icon: <IoHomeOutline className="w-5 h-5" />,
        path: "/designer-dashboard",
      },
      {
        name: "Projects",
        icon: <IoDocumentTextOutline className="w-5 h-5" />,
        path: "/designer-dashboard/projects",
        subItems: [
          {
            name: "Design",
            path: "/designer-dashboard/projects/design",
          },

          {
            name: "Management",
            path: "/designer-dashboard/management",
          },
        ],
      },
      {
        name: "Communication",
        icon: <IoChatbubbleEllipsesOutline className="w-5 h-5" />,
        subItems: [
          {
            name: "RFI",
            path: "/designer-dashboard/communication/rfi",
          },
        ],
      },
      {
        name: "Change Order",
        icon: <IoBrushOutline className="w-5 h-5" />,
        path: "/designer-dashboard/change-order",
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
      {
        name: "Change Order",
        icon: <IoBrushOutline className="w-5 h-5" />,
        path: "/expert-change-order",
      },
    ],
    client: [
      {
        name: "Home",
        icon: <IoHomeOutline className="w-5 h-5" />,
        path: "/client-dashboard",
      },
      {
        name: "Approvals",
        icon: <IoCheckmarkDoneOutline className="w-5 h-5" />,
        path: "/client-aprovels",
      },
      {
        name: "RFI",
        icon: <IoChatbubbleOutline className="w-5 h-5" />,
        path: "/client-rif",
      },
      {
        name: "Change Order",
        icon: <IoBrushOutline className="w-5 h-5" />,
        path: "/client-change-order",
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
            <li key={index} className="px-6 py-2">
              {item.subItems ? (
                <>
                  {/* Parent Menu Item */}
                  <button
                    onClick={() => {
                      if (item.path) navigate(item.path);
                      toggleMenu(item.name);
                    }}
                    className="flex items-center justify-between w-full text-sm font-semibold text-gray-800 hover:text-gray-600 transition-all duration-150 focus:outline-none"
                  >
                    <div className="flex items-center">
                      {item.icon}
                      <span className="ml-4">{item.name}</span>
                    </div>
                    {openMenus[item.name] ? (
                      <IoChevronUpOutline className="w-4 h-4 text-gray-600" />
                    ) : (
                      <IoChevronDownOutline className="w-4 h-4 text-gray-600" />
                    )}
                  </button>

                  {/* Submenu Items */}
                  {openMenus[item.name] && (
                    <ul className="ml-6 mt-2 space-y-1">
                      {item.subItems.map((subItem, subIndex) => (
                        <li key={subIndex} className="px-4 py-2">
                          {subItem.subItems ? (
                            <>
                              {/* Expandable Submenu (e.g., Communication) */}
                              <button
                                onClick={() => toggleMenu(subItem.name)}
                                className="flex items-center justify-between w-full text-sm font-semibold text-gray-800 hover:text-gray-600 transition-all duration-150 focus:outline-none"
                              >
                                <span>{subItem.name}</span>
                                {openMenus[subItem.name] ? (
                                  <IoChevronUpOutline className="w-4 h-4" />
                                ) : (
                                  <IoChevronDownOutline className="w-4 h-4" />
                                )}
                              </button>

                              {/* Sub-submenu */}
                              {openMenus[subItem.name] && (
                                <ul className="ml-4 mt-2 space-y-1">
                                  {subItem.subItems.map(
                                    (nestedItem, nestedIndex) => (
                                      <li
                                        key={nestedIndex}
                                        className="px-4 py-1"
                                      >
                                        <button
                                          onClick={() =>
                                            navigate(nestedItem.path)
                                          }
                                          className="flex items-center justify-between w-full text-sm font-semibold text-gray-800 hover:text-gray-600 transition-all duration-150 focus:outline-none"
                                        >
                                          {nestedItem.name}
                                        </button>
                                      </li>
                                    )
                                  )}
                                </ul>
                              )}
                            </>
                          ) : (
                            // Regular Submenu Item
                            <button
                              onClick={() => navigate(subItem.path)}
                              className="flex items-center justify-between w-full text-sm font-semibold text-gray-800 hover:text-gray-600 transition-all duration-150 focus:outline-none"
                            >
                              {subItem.name}
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                // Non-collapsible Menu Item
                <button
                  onClick={() => navigate(item.path)}
                  className="flex items-center text-sm font-semibold text-gray-800 hover:text-gray-600 transition-all duration-150 focus:outline-none"
                >
                  {item.icon}
                  <span className="ml-4">{item.name}</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
