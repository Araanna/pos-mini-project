import React, { useState, useRef, useEffect } from "react";

const DeleteProduct = ({ onClose, onDelete }) => {
  const [password, setPassword] = useState("");
  const [barcode, setBarcode] = useState("");
  const [quantity, setQuantity] = useState("");
  const [authError, setAuthError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const passwordRef = useRef(null);
  const barcodeRef = useRef(null);
  const quantityRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleDelete();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleBarcodeChange = (e) => {
    setBarcode(e.target.value);
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const handleDelete = () => {
    if (password === "123") {
      if (barcode && quantity > 0) {
        try {
          const result = onDelete(barcode, Number(quantity));
          if (result instanceof Promise) {
            result
              .then(() => {
                setSuccessMessage("Product successfully deleted.");
                setBarcode("");
                setQuantity("");
                setPassword("");
                setAuthError("");
                setDeleteError("");
              })
              .catch((error) => {
                setDeleteError(error.message || "Failed to delete product.");
              });
          } else {
            setSuccessMessage("Product successfully deleted.");
            setBarcode("");
            setQuantity("");
            setPassword("");
            setAuthError("");
            setDeleteError("");
          }
        } catch (error) {
          setDeleteError(error.message || "Failed to delete product.");
        }
      } else {
        setDeleteError("Please enter a valid barcode and quantity.");
      }
    } else {
      setAuthError("Invalid password");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-semibold mb-4">Delete or Void Product</h2>
        {successMessage && (
          <p className="text-green-500 mb-4">{successMessage}</p>
        )}
        <div className="mb-4">
          <label className="block text-gray-700">Password:</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            className="w-full p-2 border rounded-lg mt-1"
            ref={passwordRef}
          />
          {authError && <p className="text-red-500 mt-2">{authError}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">
            Enter Barcode to Delete:
          </label>
          <input
            type="text"
            value={barcode}
            onChange={handleBarcodeChange}
            className="w-full p-2 border rounded-lg mt-1"
            ref={barcodeRef}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">
            Enter Quantity to Delete:
          </label>
          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            className="w-full p-2 border rounded-lg mt-1"
            ref={quantityRef}
          />
        </div>
        {deleteError && <p className="text-red-500 mt-2">{deleteError}</p>}
        <div className="flex justify-between">
          <button
            onClick={handleDelete}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProduct;
