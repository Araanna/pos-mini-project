import React, { useEffect } from "react";

const Receipt = ({ receiptData, onClose, onClear }) => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "d") {
        onClear(); // Call the function to clear the receipt data
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [onClose, onClear]);

  return (
    <div className="absolute flex flex-col items-center mt-6 p-8 border rounded-lg shadow-md bg-white w-300 h-auto font-sm">
      <h2 className="text-xl font-semibold mb-2 border-b pb-2">Receipt</h2>

      <div className="text-left">
        <p className="mb-1">
          <strong>Cashier:</strong> {receiptData.cashier}
        </p>
        <p className="mb-1">
          <strong>Record:</strong> {receiptData.record}
        </p>
      </div>

      <div className="mt-4 w-full">
        <table className="w-full text-left border-b">
          <thead>
            <tr>
              <th className="p-2">No.</th>
              <th className="p-2">Item Name</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Price</th>
              <th className="p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {receiptData.items.map((item, index) => (
              <tr key={index}>
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{item.name}</td>
                <td className="p-2">{item.qty}</td>
                <td className="p-2">{item.price}</td>
                <td className="p-2">{item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-left">
          <p className="mb-1">
            <strong>Total Qty:</strong> {receiptData.totalQty}
          </p>
          <p className="mb-1">
            <strong>Total Amount:</strong> {receiptData.totalAmount}
          </p>
          <p className="mb-1">
            <strong>Cash Tendered:</strong> {receiptData.cashTendered}
          </p>
          <p className="mb-1">
            <strong>Change:</strong> {receiptData.change}
          </p>
        </div>
      </div>
      <p>[Press D - Done]</p>
    </div>
  );
};

export default Receipt;
