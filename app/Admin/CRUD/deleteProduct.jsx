import React from "react";
import { Modal, Button } from "react-bootstrap";

const DeleteProduct = ({
  showDeleteModal,
  setShowDeleteModal,
  currentProduct,
  handleDeleteProduct,
}) => {
  // Guard clause for when currentProduct is not defined
  if (!currentProduct) return null;

  return (
    <div>
      {/* Delete Product Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the product with barcode{" "}
          <strong>{currentProduct.barcode}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              handleDeleteProduct(currentProduct.barcode);
              setShowDeleteModal(false);
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DeleteProduct;
