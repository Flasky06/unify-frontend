import React from "react";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";

export const PurchaseOrderCreate = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Create Purchase Order
        </h1>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
      <div className="bg-white p-8 rounded-lg shadow text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Coming Soon
        </h2>
        <p className="text-gray-500">
          This feature is currently under development. You can create purchase
          orders via API for now.
        </p>
      </div>
    </div>
  );
};
