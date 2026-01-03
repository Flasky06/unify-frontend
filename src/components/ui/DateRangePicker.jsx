import React from "react";
import { format } from "date-fns";

export const DateRangePicker = ({ startDate, endDate, onChange }) => {
  return (
    <div className="flex items-center gap-2 bg-gray-700 p-1 rounded-lg border border-gray-600">
      <input
        type="date"
        value={startDate ? format(startDate, "yyyy-MM-dd") : ""}
        onChange={(e) =>
          onChange(
            e.target.value ? new Date(e.target.value) : startDate,
            endDate
          )
        }
        className="bg-transparent text-white text-xs px-2 py-1 outline-none focus:bg-gray-600 rounded"
      />
      <span className="text-gray-400 font-medium">-</span>
      <input
        type="date"
        value={endDate ? format(endDate, "yyyy-MM-dd") : ""}
        onChange={(e) =>
          onChange(
            startDate,
            e.target.value ? new Date(e.target.value) : endDate
          )
        }
        className="bg-transparent text-white text-xs px-2 py-1 outline-none focus:bg-gray-600 rounded"
      />
    </div>
  );
};
