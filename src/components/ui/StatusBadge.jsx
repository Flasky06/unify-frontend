import React from "react";

const StatusBadge = ({ status, className = "" }) => {
  const colors = {
    ACTIVE: "bg-green-100 text-green-800",
    TRIAL: "bg-yellow-100 text-yellow-800",
    EXPIRED: "bg-red-100 text-red-800",
    SUSPENDED: "bg-orange-100 text-orange-800",
    CANCELLED: "bg-gray-100 text-gray-800",
    PENDING: "bg-blue-100 text-blue-800",
    PAID: "bg-green-100 text-green-800",
    PARTIALLY_PAID: "bg-yellow-100 text-yellow-800",
    UNPAID: "bg-red-100 text-red-800",
  };

  const selectedColor = colors[status] || "bg-gray-100 text-gray-800";

  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-full ${selectedColor} ${className}`}
    >
      {status?.replace(/_/g, " ")}
    </span>
  );
};

export default StatusBadge;
