import React, { useState } from "react";
import DrawingRow from "./DrawingRow";

export default function DrawingTable({ drawings = [], showActionDropdown, setShowActionDropdown }) {
  const [dropdownDirectionMap, setDropdownDirectionMap] = useState({});
  const isArrayWithItems = drawings.length > 0;

  return (
    <div className="w-full overflow-hidden rounded-lg shadow">
      <div className="w-full overflow-x-auto">
        <table className="w-full whitespace-no-wrap">
          <thead>
            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
              <th className="px-4 py-3">Document</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Latest Version</th>
              <th className="px-4 py-3">Discipline</th>
              <th className="px-4 py-3">Last Updated</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Sent By</th>
              <th className="px-4 py-3">Previous Versions</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y">
            {!isArrayWithItems ? (
              <tr>
                <td colSpan="9" className="px-6 py-4 text-center text-gray-400">
                  No drawings found.
                </td>
              </tr>
            ) : (
              drawings.map((drawing, index) => (
                <DrawingRow
                  key={drawing._id || index}
                  drawing={drawing}
                  showActionDropdown={showActionDropdown}
                  setShowActionDropdown={setShowActionDropdown}
                  dropdownDirection={dropdownDirectionMap[drawing._id]}
                  setDropdownDirection={(direction) =>
                    setDropdownDirectionMap((prev) => ({
                      ...prev,
                      [drawing._id]: direction,
                    }))
                  }
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

