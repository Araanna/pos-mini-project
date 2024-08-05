// PendingTransaction.js
import React, { useEffect } from "react";

const PendingTransaction = ({
  show,
  onClose,
  heldTransaction,
  onResume,
  onSuspend,
}) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!show || !heldTransaction) return null;

  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 ${
        show ? "block" : "hidden"
      }`}
      role="dialog"
      aria-labelledby="pending-transaction-title"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-3/4 max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 id="pending-transaction-title" className="text-xl font-semibold">
            Pending Transactions
          </h3>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="mb-4">
          <p>
            <strong>Record:</strong> {heldTransaction.record}
          </p>
          <p>
            <strong>Date/Time:</strong> {heldTransaction.dateTime}
          </p>
          <p>
            <strong>Total Qty:</strong> {heldTransaction.totalQty}
          </p>
          <p>
            <strong>Total Amount:</strong>{" "}
            {heldTransaction.totalAmount.toFixed(2)}
          </p>
          <p>
            <strong>Cash Tendered:</strong>{" "}
            {heldTransaction.cashTendered.toFixed(2)}
          </p>
          <p>
            <strong>Change:</strong> {heldTransaction.change.toFixed(2)}
          </p>
          <h4 className="mt-4 mb-2 text-lg font-semibold">Items:</h4>
          <ul>
            {heldTransaction.items.map((item, index) => (
              <li key={index}>
                {item.name} (x{item.qty}) - {item.amount.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={() => onResume(heldTransaction)}
          >
            Resume
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            onClick={() => onSuspend(heldTransaction)}
          >
            Suspend
          </button>
        </div>
      </div>
    </div>
  );
};

export default PendingTransaction;
