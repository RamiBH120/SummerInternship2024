import PropTypes from "prop-types";
import React from "react";
import { Col, Modal, ModalBody, Row } from "reactstrap";

const DeleteModal = ({ show, onDeleteClick, onCloseClick }) => {
  return (
    <Modal isOpen={show} toggle={onCloseClick} centered={true}>
      <ModalBody className="px-5 py-3">
        <Row>
          <Col lg={12}>
            <div className="text-center">
              <i
                className="mdi mdi-alert-circle-outline"
                style={{ fontSize: "9em", color: "orange" }}
              />
              <h2>Êtes-vous sûr de supprimer?</h2>
              <h4>{"Cette action est non inversible!"}</h4>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="mt-3 text-center">
              <button
                type="button"
                className="btn btn-danger btn-lg ms-2"
                onClick={onDeleteClick}
                style={{ backgroundColor: "red" }}
              >
                Confirmer
              </button>
              <button
                type="button"
                className="btn btn-primary btn-lg ms-2"
                onClick={onCloseClick}
              >
                Annuler
              </button>
            </div>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};

DeleteModal.propTypes = {
  onCloseClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  show: PropTypes.any,
};

export default DeleteModal;
