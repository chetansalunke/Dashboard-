// import React from "react";
// import BASE_URL from "../../../../src/config";
// export default function RfiTable({ rfis, users, userID, onResolve }) {
//   return (
//     <div className="w-full overflow-hidden rounded-lg shadow">
//       <div className="w-full overflow-x-auto">
//         <table className="w-full whitespace-no-wrap">
//           <thead>
//             <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
//               <th className="px-4 py-3">RFI</th>
//               <th className="px-4 py-3">Status</th>
//               <th className="px-4 py-3">Date Requested</th>
//               <th className="px-4 py-3">Sent To</th>
//               <th className="px-4 py-3">Document</th>
//               <th className="px-4 py-3">Created By</th>
//               <th className="px-4 py-3">Action</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y">
//             {rfis.map((rfi) => (
//               <tr key={rfi.id} className="hover:bg-gray-50 text-gray-700">
//                 <td className="px-4 py-3 text-sm">{rfi.title ?? "No Title"}</td>
//                 <td className="px-4 py-3 text-sm">
//                   <span
//                     className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
//                       rfi.status === "Resolved"
//                         ? "bg-green-100 text-green-700"
//                         : "bg-yellow-100 text-yellow-700"
//                     }`}
//                   >
//                     {rfi.status}
//                   </span>
//                 </td>
//                 <td className="px-4 py-3 text-sm">
//                   {new Date(rfi.created_at).toLocaleDateString()}
//                 </td>
//                 <td className="px-4 py-3 text-sm">
//                   {users[rfi.send_to] ?? "N/A"}
//                 </td>
//                 <td className="px-4 py-3 text-sm">
//                   {rfi.document_upload
//                     ? rfi.document_upload.split(",").map((file, index) => (
//                         <div key={index}>
//                           <a
//                             href={`${BASE_URL}/${file}`} // add leading slash if needed
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-blue-500 underline"
//                           >
//                             Document {index + 1}
//                           </a>
//                         </div>
//                       ))
//                     : "No file"}
//                 </td>

//                 <td className="px-4 py-3 text-sm">
//                   {users[rfi.created_by] ?? "N/A"}
//                 </td>
//                 <td className="px-6 py-4">
//                   {rfi.status === "Pending" && rfi.send_to === userID ? (
//                     <button
//                       onClick={() => onResolve(rfi)}
//                       className="text-sm px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
//                     >
//                       Resolve
//                     </button>
//                   ) : rfi.status === "Resolved" ? (
//                     <button
//                       onClick={() => onResolve(rfi)}
//                       className="text-sm px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 font-semibold"
//                     >
//                       View
//                     </button>
//                   ) : null}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

import React from "react";
import BASE_URL from "../../config";

export default function RfiTable({ rfis, users, userID, onResolve }) {
  return (
    <div className="w-full overflow-hidden rounded-lg shadow">
      <div className="w-full overflow-x-auto">
        <table className="w-full whitespace-no-wrap">
          <thead>
            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
              <th className="px-4 py-3">RFI</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date Requested</th>
              <th className="px-4 py-3">Sent To</th>
              <th className="px-4 py-3">Document</th>
              <th className="px-4 py-3">Created By</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          {rfis.length > 0 && (
            <tbody className="bg-white divide-y">
              {rfis.map((rfi) => (
                <tr key={rfi.id} className="hover:bg-gray-50 text-gray-700">
                  <td className="px-4 py-3 text-sm">
                    {rfi.title ?? "No Title"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        rfi.status === "Resolved"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {rfi.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(rfi.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {users[rfi.send_to] ?? "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {rfi.document_upload
                      ? rfi.document_upload.split(",").map((file, index) => (
                          <div key={index}>
                            <a
                              href={`${BASE_URL}/${file}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 underline"
                            >
                              Document {index + 1}
                            </a>
                          </div>
                        ))
                      : "No file"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {users[rfi.created_by] ?? "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    {rfi.status === "Pending" && rfi.send_to === userID ? (
                      <button
                        onClick={() => onResolve(rfi)}
                        className="text-sm px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Resolve
                      </button>
                    ) : rfi.status === "Resolved" ? (
                      <button
                        onClick={() => onResolve(rfi)}
                        className="text-sm px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 font-semibold"
                      >
                        View
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
