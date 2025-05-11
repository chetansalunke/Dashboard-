import { AlertCircle, CheckCircle } from "lucide-react";

const StatusCards = () => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="flex items-center justify-between bg-white rounded-xl shadow p-4 h-24">
        <div>
          <p className="text-xs text-gray-500">Pending RFI</p>
          <p className="text-2xl font-bold text-red-600 mt-1">5</p>
        </div>
        <AlertCircle className="text-red-600 w-8 h-8" />
      </div>

      <div className="flex items-center justify-between bg-white rounded-xl shadow p-4 h-24">
        <div>
          <p className="text-xs text-gray-500">Submitted drawings waiting for approval</p>
          <p className="text-2xl font-bold text-green-600 mt-1">8</p>
        </div>
        <CheckCircle className="text-green-600 w-8 h-8" />
      </div>
    </div>
  );
};

export default StatusCards;
