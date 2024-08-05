import React, { useEffect } from "react";

const SalesReport = ({ reportData, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Sales Report</h2>
        <div className="mb-4">
          <p>
            <strong>Shift In:</strong> {reportData.shiftIn}
          </p>
          <p>
            <strong>Shift Out:</strong> {reportData.shiftOut}
          </p>
        </div>
        <div className="mb-4">
          <p>
            <strong>Total Revenue:</strong> {reportData.totalRevenue}
          </p>
          <p>
            <strong>Total Orders:</strong> {reportData.totalOrders}
          </p>
        </div>
        <button
          onClick={onClose}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SalesReport;
