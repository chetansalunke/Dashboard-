import React, { useRef, useEffect, useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";

export default function DrawingRow({
  drawing,
  showActionDropdown,
  setShowActionDropdown,
  dropdownDirection,
  setDropdownDirection,
}) {
  const dropdownRef = useRef();
  const buttonRef = useRef();
//   const [dropdownDirection, setDropdownDirection] = useState("down");

  useEffect(() => {
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setShowActionDropdown(null);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [setShowActionDropdown]);

  const handleDropdownToggle = () => {
    const rect = buttonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    if (spaceBelow < 200 && spaceAbove > 200) {
      setDropdownDirection("up");
    } else {
      setDropdownDirection("down");
    }

    setShowActionDropdown((prev) => (prev === drawing.id ? null : drawing.id));
  };

  return (
    <tr key={drawing.id} className="text-gray-700 text-sm">
      <td className="px-4 py-3">
        {drawing.document_path &&
          JSON.parse(drawing.document_path).map((path, i) => (
            <a
              key={i}
              href={path}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline block"
            >
              Document {i + 1}
            </a>
          ))}
      </td>
      <td className="px-4 py-3">{drawing.name}</td>
      <td className="px-4 py-3">
        {drawing.latest_version_path ? "v1.0" : "N/A"}
      </td>
      <td className="px-4 py-3">{drawing.discipline}</td>
      <td className="px-4 py-3">
        {new Date(drawing.created_date).toLocaleDateString()}
      </td>
      <td className="px-4 py-3">{drawing.status}</td>
      <td className="px-4 py-3">{drawing.sent_by || "Unassigned"}</td>
      <td className="px-4 py-3">
        {drawing.previous_versions === "NULL"
          ? "None"
          : drawing.previous_versions}
      </td>

      
      <td className="px-4 py-3 align-top">
        <div className="relative inline-block" ref={dropdownRef}>
          <button
            onClick={handleDropdownToggle}
            ref={buttonRef}
            className="p-1 rounded-full hover:bg-gray-200"
          >
            <FiMoreHorizontal className="w-5 h-5 text-gray-600" />
          </button>

          {showActionDropdown === drawing.id && (
            <div
              className={`absolute z-50 w-48 bg-white border border-gray-200 rounded shadow-lg text-sm right-0 ${
                dropdownDirection === "up"
                  ? "bottom-full mb-2"
                  : "top-full mt-2"
              }`}
            >
              <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                Submit to client
              </button>
              <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                Share
              </button>
              <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                Rename
              </button>
              <button className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100">
                Delete
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
