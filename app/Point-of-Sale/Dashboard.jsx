import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Col, Row } from "react-bootstrap";
import Receipt from "./Reciept"; // Ensure the import path is correct
import DeleteProduct from "../Features/Void_DeleteProduct"; // Update the path as needed
import SalesReport from "./SalesReport";
import CancelTransactionModal from "../Features/CancelTransaction";
import PendingTransaction from "../Features/PendingTransaction"; // Example path adjustment
import MoveToPendingTransactions from "../Features/MoveToPendingTransaction"; // Import the new component
import { useSalesData } from "../Point-of-Sale/useSalesData"; // Adjust the path as needed

const POS = ({ user, setUser }) => {
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [barcode, setBarcode] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cashTendered, setCashTendered] = useState(0);
  const [change, setChange] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customerNumber, setCustomerNumber] = useState(1);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showDeleteProductModal, setShowDeleteProductModal] = useState(false);
  const [showSalesReport, setShowSalesReport] = useState(false);
  const [showCancelTransactionModal, setShowCancelTransactionModal] =
    useState(false);
  const [showPendingTransaction, setShowPendingTransaction] = useState(false);
  const [heldTransaction, setHeldTransaction] = useState(null);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [showMoveToPendingTransactions, setShowMoveToPendingTransactions] =
    useState(false); // New state for the MoveToPendingTransactions component
  const [isModalOpen, setIsModalOpen] = useState(true); // Change to false to hide initially
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const quantityRef = useRef(null);
  const barcodeRef = useRef(null);

  const { totalRevenue, totalOrders, updateSalesData } = useSalesData();

  // Products Feature
  const handleDeleteProduct = async (itemNo, quantity) => {
    // Perform your delete logic here
    const index = items.findIndex((item) => item.barcode === itemNo);
    if (index > -1) {
      const item = items[index];
      const newItems = [...items];
      if (item.qty > quantity) {
        newItems[index] = {
          ...item,
          qty: item.qty - quantity,
          amount: (item.qty - quantity) * item.price,
        };
      } else {
        newItems.splice(index, 1);
      }
      setItems(newItems);
      return Promise.resolve();
    } else {
      return Promise.reject(new Error("Item not found"));
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost/API/index.php");
        const data = response.data;
        setProducts(
          Object.entries(data.products).map(([barcode, { name, price }]) => ({
            barcode,
            name,
            price,
            amount: price,
          }))
        );
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    barcodeRef.current.focus(); // Focus on barcode input when the component mounts
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent default behavior for certain keys if needed
      if (e.defaultPrevented) return;

      if (e.key === "q") {
        // Ensure the quantity is a valid number
        setQuantity((prevQuantity) => {
          const newQuantity = Number(prevQuantity);
          return isNaN(newQuantity) ? 1 : newQuantity; // Set to 1 if NaN
        });
        if (quantityRef.current) {
          quantityRef.current.focus(); // Focus on quantity input when 'q' is pressed
        }
      } else if (e.key === "v") {
        setShowDeleteProductModal(true);
      } else if (e.key === "r") {
        setShowSalesReport(true);
      } else if (e.key === "t") {
        setShowCancelTransactionModal(true);
      } else if (e.key === "p") {
        if (items.length > 0) {
          const newTransaction = {
            record: customerNumber,
            totalQty: items.reduce((sum, item) => sum + item.qty, 0),
            totalAmount: items.reduce((sum, item) => sum + item.amount, 0),
            cashTendered,
            change,
            items,
            dateTime: new Date().toLocaleString(),
          };
          setPendingTransactions([...pendingTransactions, newTransaction]);
          setItems([]);
          setCashTendered(0);
          setChange(0);
          setShowPendingTransaction(true);
          setHeldTransaction(newTransaction);
        }
      } else if (e.key === "m") {
        setShowMoveToPendingTransactions(true); // Show the move to pending transactions modal when 'm' is pressed
      } else if (e.key === "d") {
        saveTransactionToSalesReport(); // Save the transaction when 'd' is pressed
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    items,
    cashTendered,
    change,
    customerNumber,
    pendingTransactions,
    quantity,
  ]);

  // FOR RECORD NUMBER INCREMENT
  //Increment the record Number
  const incrementRecordNumber = () => {
    setCustomerNumber((prevNumber) => prevNumber + 1);
  };

  const handleTransactionComplete = () => {
    incrementRecordNumber(); // Increment the record number after transaction
    // Other logic for completing the transaction
  };

  const closeSalesReport = () => {
    // Perform logout logic here
    console.log("Logged out after closing sales report");
    setUser(null); // Set user to null to trigger logout
    setShowSalesReport(false);
  };
  // Add this function to save the transaction to sales data
  const saveTransactionToSalesReport = () => {
    const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

    updateSalesData(totalAmount, 1); // Update the sales data with new revenue and orders

    // You can also save additional details if needed
    console.log("Transaction saved to sales report");

    // Clear the transaction data
    setItems([]);
    setCashTendered(0);
    setChange(0);
    setShowReceiptModal(false);
  };

  //Cancel Transaction
  const cancelTransaction = () => {
    setItems([]);
    setBarcode("");
    setQuantity(1);
    setCashTendered(0);
    setChange(0);
    setShowCancelTransactionModal(false);
  };

  //Pending Transaction
  // Resume a pending transaction
  const resumePendingTransaction = (transaction) => {
    if (transaction) {
      setItems(transaction.items);
      setBarcode("");
      setQuantity(1);
      setCashTendered(transaction.cashTendered);
      setChange(transaction.change);
      setHeldTransaction(null);
      setShowPendingTransaction(false);
    }
  };

  // Suspend the current transaction
  const suspendPendingTransaction = (transaction) => {
    if (transaction) {
      setPendingTransactions([...pendingTransactions, transaction]);
      setHeldTransaction(null);
      setItems([]);
      setCashTendered(0);
      setChange(0);
      setShowPendingTransaction(false);
    }
  };

  // Close the pending transaction modal
  const closePendingTransaction = (transaction) => {
    if (transaction) {
      setPendingTransactions(
        pendingTransactions.filter((pt) => pt !== transaction)
      );
      setShowPendingTransaction(false);
    }
  };

  //MoveToPendingTransaction

  const cancelPendingTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setShowCancelTransactionModal(true);
  };

  const handleBarcodeInput = () => {
    const product = products.find((p) => p.barcode === barcode);
    if (product) {
      addItem(product);
    } else {
      alert("Invalid barcode");
    }
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    // Ensure the value is a number or empty string
    setQuantity(
      value === "" ? "" : !isNaN(Number(value)) ? Number(value) : quantity
    );
  };

  const handleCashChange = (amount) => {
    setCashTendered(amount);
    const total = items.reduce((sum, item) => sum + item.qty * item.price, 0);
    setChange(amount - total);
  };

  const closeReceiptModal = () => setShowReceiptModal(false);
  const handleClose = () => {
    console.log("Closing modal");
    setIsModalOpen(false); // This should hide the modal
  };

  // Handle key press for "Enter" key
  const handleEnterKeyPress = (e) => {
    if (e.key === "Enter") {
      if (e.target.name === "cashTendered") {
        const total = items.reduce(
          (sum, item) => sum + item.qty * item.price,
          0
        );
        if (cashTendered >= total) {
          setChange(cashTendered - total);
          setShowReceiptModal(true);
        } else {
          alert("Insufficient amount paid");
        }
      } else if (e.target.name === "quantity") {
        const product = products.find((p) => p.barcode === barcode);
        if (product) {
          addItem(product);
        }
      }
    }
  };

  // Add item to the transaction
  const addItem = (item) => {
    const existingItemIndex = items.findIndex(
      (i) => i.barcode === item.barcode
    );
    if (existingItemIndex > -1) {
      const newItems = [...items];
      newItems[existingItemIndex].qty += quantity;
      newItems[existingItemIndex].amount =
        newItems[existingItemIndex].price * newItems[existingItemIndex].qty;
      setItems(newItems);
    } else {
      setItems([
        ...items,
        { ...item, qty: quantity, amount: item.price * quantity },
      ]);
    }
    setBarcode("");
    setQuantity(1);
    barcodeRef.current.focus();
  };

  // Data for the receipt
  const receiptData = {
    cashier: user.fullname,
    record: customerNumber,
    totalQty: items.reduce((sum, item) => sum + item.qty, 0),
    totalAmount: items.reduce((sum, item) => sum + item.amount, 0),
    cashTendered,
    change,
    items,
  };

  return (
    <>
      <Col>
        <div className="mt-6 mb-8 p-2">
          <div class="fixed top-0 left-0 right-0 p-10 bg-purple-300  text-card-foreground flex justify-between items-center mb-30 ">
            <span>
              Press <span class="text-primary">q</span> - Quantity
            </span>
            <span>
              Press <span class="text-primary">v</span> - DeleteProduct
            </span>
            <span>
              Press <span class="text-primary">r</span> - SalesReport
            </span>
            <span>
              Press <span class="text-primary">t</span> - CancelTransactionModal
            </span>
            <span>
              Press <span class="text-primary">p</span> - PendingTransaction
            </span>
            <span>
              Press <span class="text-primary">m</span> -
              MoveToPendingTransactions
            </span>
            <span>
              Press <span class="text-primary">d</span> - Save to SalesReport
            </span>
          </div>
        </div>
      </Col>
      <Row className="relative top-20">
        {" "}
        <div class="bg-purple-900 p-10 rounded-t-lg shadow-md m-4">
          <div class="flex items-center justify-between">
            <span class="text-4xl font-bold text-white">P</span>
            <span class="text-4xl font-bold text-white">
              {items.reduce((sum, item) => sum + item.qty * item.price, 0)}
            </span>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 p-4 rounded-lg shadow-md">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border-b">No.</th>
                  <th className="p-2 border-b">Item Name</th>
                  <th className="p-2 border-b">Qty</th>
                  <th className="p-2 border-b">Price</th>
                  <th className="p-2 border-b">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{item.qty}</td>
                    <td className="p-2">{item.price}</td>
                    <td className="p-2">{item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 rounded-lg shadow-md w-full lg:w-1/3">
            <div className="mb-4">
              <label className="block text-gray-700">Quantity:</label>
              <input
                type="text"
                name="quantity"
                value={quantity}
                ref={quantityRef}
                onChange={handleQuantityChange}
                onKeyPress={handleEnterKeyPress}
                className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onBlur={() => barcodeRef.current.focus()}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Barcode:</label>
              <input
                type="text"
                name="barcode"
                value={barcode}
                ref={barcodeRef}
                onChange={(e) => setBarcode(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleBarcodeInput();
                  }
                }}
                className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Cash Tendered:</label>
              <input
                type="text"
                name="cashTendered"
                value={cashTendered}
                onChange={(e) => handleCashChange(Number(e.target.value))}
                onKeyPress={handleEnterKeyPress}
                className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <p className="text-lg font-semibold">
                Total:{" "}
                <span className="font-normal">
                  {items.reduce((sum, item) => sum + item.qty * item.price, 0)}
                </span>
              </p>
              <p className="text-lg font-semibold">
                Change: <span className="font-normal">{change}</span>
              </p>
            </div>
          </div>
        </div>
        <Col>
          <div className="mt-6 mb-8 p-2 ">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <label className="block text-gray-700">Cashier:</label>
                <input
                  type="text"
                  placeholder="Cashier"
                  className="w-full p-2 border rounded-lg mt-1"
                  value={user.fullname}
                  disabled
                />
              </div>
              <div className="flex-1">
                <label className="block text-gray-700">Record:</label>
                <input
                  type="text"
                  placeholder="Record"
                  className="w-full p-2 border rounded-lg mt-1"
                  disabled
                  value={customerNumber} //can you fix the logic here it must increment after tran
                />
              </div>
              <div className="flex-1">
                <label className="block text-gray-700">Total Qty:</label>
                <input
                  type="text"
                  placeholder="Total Qty"
                  className="w-full p-2 border rounded-lg mt-1"
                  disabled
                  value={items.reduce((sum, item) => sum + item.qty, 0)}
                />
              </div>
              <div className="flex-1">
                <label className="block text-gray-700">Date/Time:</label>
                <input
                  type="text"
                  placeholder="Date/Time"
                  className="w-full p-2 border rounded-lg mt-1"
                  disabled
                  value={new Date().toLocaleString()}
                />
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Receipt Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
          <Receipt
            receiptData={receiptData}
            onClose={() => setShowReceiptModal(false)}
          />
        </div>
      )}

      {/* Delete/Void Product */}
      {showDeleteProductModal && (
        <DeleteProduct
          onClose={() => setShowDeleteProductModal(false)}
          onDelete={handleDeleteProduct}
        />
      )}

      {/* Sales Report */}
      {showSalesReport && (
        <SalesReport
          reportData={{
            shiftIn: new Date().toLocaleString(), // Placeholder, adjust according to actual shift in time
            shiftOut: new Date().toLocaleString(), // Placeholder, adjust according to actual shift out time
            totalRevenue,
            totalOrders,
          }}
          onClose={closeSalesReport}
        />
      )}

      {/* Cancel Transaction */}
      {showCancelTransactionModal && (
        <CancelTransactionModal
          onConfirm={cancelTransaction} // Pass cancelTransaction to onConfirm
          onClose={() => {
            setShowCancelTransactionModal(false);
            setSelectedTransaction(null); // Clear selected transaction
          }}
        />
      )}

      {/* Pending Transaction */}
      <PendingTransaction
        show={showPendingTransaction}
        onClose={closePendingTransaction}
        heldTransaction={heldTransaction}
        onResume={resumePendingTransaction}
        onSuspend={suspendPendingTransaction}
      />
      {showMoveToPendingTransactions && (
        <MoveToPendingTransactions
          show={showMoveToPendingTransactions}
          onClose={() => setShowMoveToPendingTransactions(false)}
          pendingTransactions={pendingTransactions}
          onResume={resumePendingTransaction}
          onCancel={cancelPendingTransaction}
        />
      )}
    </>
  );
};

export default POS;
