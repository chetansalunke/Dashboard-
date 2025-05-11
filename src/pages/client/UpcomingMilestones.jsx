const milestones = [
  {
    project: "Enclave IT Park",
    milestone: "8th floor completion",
    dueDate: "15-12-2024",
    responsible: "Siddharth Nahta",
    status: "Pending",
  },
];

const UpcomingMilestones = () => (
  <div className="bg-white rounded-2xl shadow p-4">
    <div className="text-lg font-medium mb-4 text-red-600">3. Upcoming Milestones</div>
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left font-semibold text-gray-600 border-b">
          <th className="px-4 py-3">Project Name</th>
          <th className="px-4 py-3">Milestone</th>
          <th className="px-4 py-3">Due Date</th>
          <th className="px-4 py-3">Responsible Person</th>
          <th className="px-4 py-3">Status</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y">
        {milestones.map((item, idx) => (
          <tr key={idx} className="border-b hover:bg-gray-50">
            <td className="px-4 py-3 text-sm">{item.project}</td>
            <td className="px-4 py-3 text-sm">{item.milestone}</td>
            <td className="px-4 py-3 text-sm">{item.dueDate}</td>
            <td className="px-4 py-3 text-sm">{item.responsible}</td>
            <td className="px-4 py-3 text-sm">{item.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default UpcomingMilestones;
