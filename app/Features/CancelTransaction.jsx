import React, { useState, useEffect } from "react";

const CancelTransactionModal = ({ onConfirm, onClose }) => {
  const [password, setPassword] = useState("");
  const [isPasswordEntered, setIsPasswordEntered] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        if (isPasswordEntered) {
          handleConfirm();
        } else {
          handlePasswordSubmit();
        }
      } else if (e.key === "Escape" || e.key === "d") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPasswordEntered, password, onClose]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePasswordSubmit = () => {
    // Dummy password check - replace with your actual password logic
    if (password === "123") {
      setIsPasswordEntered(true);
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  const handleConfirm = () => {
    onConfirm();
    alert("Successfully Canceled transaction"); // Alert on confirmation
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        {!isPasswordEntered ? (
          <>
            <p className="text-lg font-semibold">
              Please enter your password to confirm the cancellation:
            </p>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              className="border p-2 rounded mt-2 w-full"
              placeholder="Enter password"
            />
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <div className="flex justify-end mt-4">
              <button
                onClick={onClose}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-lg font-semibold">
              Do you want to cancel this transaction?
            </p>
            <div className="flex justify-end mt-4">
              <button
                onClick={onClose}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CancelTransactionModal;
