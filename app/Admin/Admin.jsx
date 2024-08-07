"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Form, Modal, Col, Row } from "react-bootstrap";
import EditProducts from "./CRUD/EditProducts"; // Adjust the path as necessary
import AddProduct from "./CRUD/AddProduct"; // Adjust path as necessary
import DeleteProduct from "./CRUD/deleteProduct"; // Adjust path as necessary
import { ScrollArea } from "@/components/ui/scroll-area";

import "bootstrap/dist/css/bootstrap.min.css";

const AdminDashboard = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [currentProduct, setCurrentProduct] = useState({
    barcode: "",
    name: "",
    price: 0,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost/pos/products.php");
        const data = response.data;
        setProducts(
          Object.entries(data.products).map(([barcode, { name, price }]) => ({
            barcode,
            name,
            price,
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

  const handleAddProduct = async () => {
    try {
      const response = await axios.post(
        "http://localhost/pos/add_product.php", // URL of your PHP script
        currentProduct,
        {
          headers: {
            "Content-Type": "application/json", // Ensure content type is JSON
          },
        }
      );
      console.log("Server response:", response.data); // Debugging line
      if (response.data.success) {
        setProducts([...products, currentProduct]); // Add new product to state
        setShowAddModal(false);
        setCurrentProduct({ barcode: "", name: "", price: 0 }); // Reset form
      } else {
        setError("Failed to add product: " + response.data.message);
      }
    } catch (error) {
      console.error("Error adding product:", error); // Debugging line
      setError("An error occurred while adding the product.");
    }
  };

  const handleEditProduct = async () => {
    try {
      console.log("Sending product update:", currentProduct); // Debugging line
      const response = await axios.put(
        `http://localhost/pos/update_product.php`,
        currentProduct
      );
      console.log("Server response:", response.data); // Debugging line
      if (response.data.success) {
        const updatedProducts = products.map((product) =>
          product.barcode === currentProduct.barcode ? currentProduct : product
        );
        setProducts(updatedProducts);
        setShowEditModal(false);
      } else {
        setError("Failed to update product.");
      }
    } catch (error) {
      console.error("Error updating product:", error); // Debugging line
      setError("An error occurred while updating the product.");
    }
  };

  const handleDeleteProduct = async (barcode) => {
    try {
      await axios.delete(
        `http://localhost/pos/delete_product.php?barcode=${barcode}`
      );
      setProducts(products.filter((product) => product.barcode !== barcode));
    } catch (error) {
      setError(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div className="container mx-auto p-5">
        <Col>
          <div className="p-10 bg-purple-500 text-white rounded shadow-lg">
            <h2 className="text-3xl font-semibold border-b-8 w-[17vw]">
              Admin Dashboard
            </h2>
          </div>
        </Col>
        <div className="my-4">
          <Button variant="dark" onClick={() => setShowAddModal(true)}>
            Add Product
          </Button>
        </div>
        <Row>
          <div className="mx-4 my-4 w-full">
            <Table striped bordered hover className="mt-3">
              <thead className="bg-purple-300 sticky top-0 z-10">
                <tr>
                  <th>Barcode</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <ScrollArea>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.barcode}>
                      <td>{product.barcode}</td>
                      <td>{product.name}</td>
                      <td>{product.price}</td>
                      <td>
                        <Button
                          variant="warning"
                          onClick={() => {
                            setCurrentProduct(product);
                            setShowEditModal(true);
                          }}
                        >
                          Edit
                        </Button>{" "}
                        <Button
                          variant="danger"
                          onClick={() => {
                            setProductToDelete(product);
                            setShowDeleteModal(true);
                          }}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </ScrollArea>
            </Table>
          </div>
        </Row>
      </div>

      {/* Include the AddProduct component */}
      <AddProduct
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        currentProduct={currentProduct}
        handleChange={handleChange}
        handleAddProduct={handleAddProduct}
      />

      {/* Include the EditProducts component */}
      <EditProducts
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        currentProduct={currentProduct}
        handleChange={handleChange}
        handleEditProduct={handleEditProduct}
      />

      {/* Include the DeleteProduct component */}
      <DeleteProduct
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        currentProduct={productToDelete}
        handleDeleteProduct={handleDeleteProduct}
      />
    </>
  );
};

export default AdminDashboard;
