export default function DisciplineTabs({ activeTab, setActiveTab }) {
  const tabs = [
    "All",
    "Architecture",
    "Interior",
    "Structural",
    "MEP",
    "Others",
  ];
  return (
    <div className="flex gap-3">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-3 py-1 rounded text-sm font-medium ${
            activeTab === tab
              ? "bg-purple-600 text-white"
              : "bg-white hover:bg-gray-300 text-gray-700"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
