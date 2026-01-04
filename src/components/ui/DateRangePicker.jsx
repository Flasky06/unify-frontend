import React from "react";
import { format } from "date-fns";

export const DateRangePicker = ({ startDate, endDate, onChange }) => {
  return (
    <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-300">
      <input
        type="date"
        value={startDate ? format(startDate, "yyyy-MM-dd") : ""}
        onChange={(e) =>
          onChange(
            e.target.value ? new Date(e.target.value) : startDate,
            endDate
          )
        }
        className="bg-white text-gray-900 text-sm px-2 py-1 outline-none focus:bg-gray-50 rounded border-0"
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
        className="bg-white text-gray-900 text-sm px-2 py-1 outline-none focus:bg-gray-50 rounded border-0"
      />
    </div>
  );
};
