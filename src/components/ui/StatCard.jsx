import React from "react";

const StatCard = ({ title, value, icon, color = "blue", className = "" }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    indigo: "bg-indigo-50 text-indigo-600",
    purple: "bg-purple-50 text-purple-600",
    green: "bg-green-50 text-green-600",
    emerald: "bg-emerald-50 text-emerald-600",
    cyan: "bg-cyan-50 text-cyan-600",
    orange: "bg-orange-50 text-orange-600",
    amber: "bg-amber-50 text-amber-600",
    pink: "bg-pink-50 text-pink-600",
    rose: "bg-rose-50 text-rose-600",
    yellow: "bg-yellow-50 text-yellow-600",
    red: "bg-red-50 text-red-600",
  };

  const selectedColorClass = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`bg-white rounded-lg shadow p-4 md:p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p
            className={`mt-2 text-3xl font-bold ${
              !icon
                ? selectedColorClass
                    .replace("bg-", "text-")
                    .replace("-50", "-600")
                : "text-gray-900"
            }`}
          >
            {value}
          </p>
        </div>
        {icon && (
          <div className={`p-3 rounded-lg ${selectedColorClass}`}>{icon}</div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
