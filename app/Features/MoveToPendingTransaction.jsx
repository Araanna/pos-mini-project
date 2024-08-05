import React from "react";

const MoveToPendingTransactions = ({
  show,
  onClose,
  pendingTransactions,
  onResume,
  onCancel,
}) => {
  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 ${
        show ? "block" : "hidden"
      }`}
      role="dialog"
      aria-labelledby="move-to-pending-title"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-3/4 max-w-lg overflow-y-auto"
        style={{ maxHeight: "80vh" }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 id="move-to-pending-title" className="text-xl font-semibold">
            Move to Pending Transactions
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
          {pendingTransactions.length > 0 ? (
            <ul>
              {pendingTransactions.map((transaction, index) => (
                <li key={index} className="border-b py-2">
                  <p>
                    <strong>Record:</strong> {transaction.record}
                  </p>
                  <p>
                    <strong>Date/Time:</strong> {transaction.dateTime}
                  </p>
                  <p>
                    <strong>Total Qty:</strong> {transaction.totalQty}
                  </p>
                  <p>
                    <strong>Total Amount:</strong>{" "}
                    {transaction.totalAmount.toFixed(2)}
                  </p>
                  <p>
                    <strong>Cash Tendered:</strong>{" "}
                    {transaction.cashTendered.toFixed(2)}
                  </p>
                  <p>
                    <strong>Change:</strong> {transaction.change.toFixed(2)}
                  </p>
                  <div className="flex space-x-2 mt-2">
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      onClick={() => onResume(transaction)}
                    >
                      Resume
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      onClick={() => onCancel(transaction)}
                    >
                      Cancel
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No pending transactions.</p>
          )}
        </div>
        <button
          type="button"
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default MoveToPendingTransactions;
