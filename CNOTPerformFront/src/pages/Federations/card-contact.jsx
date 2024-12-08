import PropTypes from 'prop-types';
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardFooter,
  Col,
  UncontrolledTooltip,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  FormFeedback,
  Input,
  Form,
  Button,
  Alert
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { updateUser, blockUser, unBlockUser, updatePassword } from "../../service/apiUser";

const CardContact = ({ user }) => {
  const [modal, setModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [userData, setUserData] = useState(user);
  const [isBlocked, setIsBlocked] = useState(user.blocked);
  const [action, setAction] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const baseUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000"; // Adjust the URL based on your environment
  const defaultImage = `${baseUrl}/public/images/userImage.png`;

  const userName = userData?.name ?? "Unknown";
  const userColor = user?.color ?? "primary";
  const userImage = userData?.image
    ? `${baseUrl}/${userData.image}`
    : defaultImage;
  const userEmail = userData?.email ?? "No Email";
  const userTel = userData?.tel ?? "No Phone";

  const infoValidation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: userName,
      email: userEmail,
      tel: userTel,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Nom est obligatoire"),
      email: Yup.string().email("Email invalide").required("Email est obligatoire"),
      tel: Yup.string().required("Numéro est obligatoire"),
    }),
    onSubmit: async (values) => {
      try {
        const updatedUser = await updateUser(userData._id, values);
        setUserData(updatedUser);
        toggle();
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
      }
    },
  });

  const passwordValidation = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required("Ancien mot de passe est obligatoire"),
      newPassword: Yup.string().min(6, "Le mot de passe doit contenir au moins 6 caractères").required("Nouveau mot de passe est obligatoire"),
      confirmPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], "Les mots de passe ne correspondent pas").required("Confirmation du mot de passe est obligatoire"),
    }),
    onSubmit: async (values) => {
      try {
        await updatePassword(userData._id, values.oldPassword, values.newPassword);
        setPasswordSuccess(true);
        setPasswordError("");
        setTimeout(() => {
          setPasswordSuccess(false);
          togglePasswordModal();
        }, 3000);
      } catch (error) {
        setPasswordError(error.message || "Erreur lors de la mise à jour du mot de passe");
        console.error("Erreur lors de la mise à jour du mot de passe:", error);
      }
    },
  });

  const toggle = () => {
    setModal(!modal);
  };

  const togglePasswordModal = () => {
    setPasswordModal(!passwordModal);
    setPasswordError("");
  };

  const toggleConfirmationModal = () => {
    setConfirmationModal(!confirmationModal);
  };

  const handleUserClick = () => {
    setIsEdit(true);
    toggle();
  };

  const handlePasswordClick = () => {
    togglePasswordModal();
  };

  const handleBlockUser = async () => {
    try {
      if (isBlocked) {
        await unBlockUser(userData._id);
      } else {
        await blockUser(userData._id);
      }
      setIsBlocked(!isBlocked);
      toggleConfirmationModal();
    } catch (error) {
      console.error("Erreur lors du blocage/déblocage de l'utilisateur:", error);
    }
  };

  const confirmAction = (actionType) => {
    setAction(actionType);
    toggleConfirmationModal();
  };

  return (
    <Col xl="3" sm="6">
      <Card className="text-center">
        <CardBody>
          {userImage === defaultImage ? (
            <div className="avatar-sm mx-auto mb-4">
              <span
                className={`avatar-title rounded-circle bg-soft bg-${userColor} text-${userColor} font-size-16`}
              >
                {userName.charAt(0)}
              </span>
            </div>
          ) : (
            <div className="mb-4">
              <img
                className="rounded-circle avatar-sm"
                src={userImage}
                alt={userName}
                style={{ width: "50px", height: "50px" }}
              />
            </div>
          )}

          <h5 className="font-size-15 mb-1">
            <Link to="#" className="text-dark">
              {userName}
            </Link>
          </h5>
          <p className="text-muted">{userEmail}</p>
          <div className="d-flex align-items-center justify-content-center">
            <i className="bx bx-phone me-2"></i>
            <p className="text-muted mb-0">{userTel}</p>
          </div>
        </CardBody>
        <CardFooter className="bg-transparent border-top">
          <div className="contact-links d-flex font-size-20">
            <div className="flex-fill">
              <Link to="#" id={`message${user.id}`}>
                <i className="bx bx-message-square-dots" />
                <UncontrolledTooltip placement="top" target={`message${user.id}`}>
                  Message
                </UncontrolledTooltip>
              </Link>
            </div>
            <div className="flex-fill">
              <Link
                to="#"
                className="text-success"
                onClick={handleUserClick}
              >
                <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
                <UncontrolledTooltip placement="top" target="edittooltip">
                  Edit
                </UncontrolledTooltip>
              </Link>
            </div>
            <div className="flex-fill">
              <Link
                to="#"
                className="text-danger"
                onClick={handlePasswordClick}
              >
                <i className="mdi mdi-lock-reset font-size-18" id="passwordtooltip" />
                <UncontrolledTooltip placement="top" target="passwordtooltip">
                  Changer mot de passe
                </UncontrolledTooltip>
              </Link>
            </div>
            <div className="flex-fill">
              <Link
                to="#"
                className={`text-${isBlocked ? 'danger' : 'secondary'}`}
                onClick={() => confirmAction(isBlocked ? 'unblock' : 'block')}
              >
                <i className={`mdi ${isBlocked ? 'mdi-account-off' : 'mdi-account-check'} font-size-18`} id="blocktooltip" />
                <UncontrolledTooltip placement="top" target="blocktooltip">
                  {isBlocked ? 'Débloquer' : 'Bloquer'}
                </UncontrolledTooltip>
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Modal for editing user */}
      <Modal isOpen={modal} toggle={toggle} className="modal-dialog-centered">
        <ModalHeader toggle={toggle} tag="h4">
          {isEdit ? "Edit User" : "Add User"}
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              infoValidation.handleSubmit();
              return false;
            }}
          >
            <div className="mb-3">
              <Label className="form-label">Nom</Label>
              <Input
                name="name"
                type="text"
                placeholder="Nom"
                onChange={infoValidation.handleChange}
                onBlur={infoValidation.handleBlur}
                value={infoValidation.values.name || ""}
                invalid={
                  infoValidation.touched.name && infoValidation.errors.name
                    ? true
                    : false
                }
              />
              {infoValidation.touched.name && infoValidation.errors.name ? (
                <FormFeedback type="invalid">
                  {infoValidation.errors.name}
                </FormFeedback>
              ) : null}
            </div>
            <div className="mb-3">
              <Label className="form-label">Email</Label>
              <Input
                name="email"
                type="email"
                placeholder="Email"
                onChange={infoValidation.handleChange}
                onBlur={infoValidation.handleBlur}
                value={infoValidation.values.email || ""}
                invalid={
                  infoValidation.touched.email && infoValidation.errors.email
                    ? true
                    : false
                }
              />
              {infoValidation.touched.email && infoValidation.errors.email ? (
                <FormFeedback type="invalid">
                  {infoValidation.errors.email}
                </FormFeedback>
              ) : null}
            </div>
            <div className="mb-3">
              <Label className="form-label">Numéro de télephone</Label>
              <Input
                name="tel"
                type="text"
                placeholder="Numéro de télephone"
                onChange={infoValidation.handleChange}
                onBlur={infoValidation.handleBlur}
                value={infoValidation.values.tel || ""}
                invalid={
                  infoValidation.touched.tel && infoValidation.errors.tel
                    ? true
                    : false
                }
              />
              {infoValidation.touched.tel && infoValidation.errors.tel ? (
                <FormFeedback type="invalid">
                  {infoValidation.errors.tel}
                </FormFeedback>
              ) : null}
            </div>
            <div className="text-end">
              <button type="submit" className="btn btn-success">
                Modifier
              </button>
            </div>
          </Form>
        </ModalBody>
      </Modal>

      {/* Modal for password change */}
      <Modal isOpen={passwordModal} toggle={togglePasswordModal} className="modal-dialog-centered">
        <ModalHeader toggle={togglePasswordModal} tag="h4">
          Changer mot de passe
        </ModalHeader>
        <ModalBody>
          {passwordSuccess && (
            <Alert color="success">
              Mot de passe changé avec succès !
            </Alert>
          )}
          {passwordError && (
            <Alert color="danger">
              {passwordError}
            </Alert>
          )}
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              passwordValidation.handleSubmit();
              return false;
            }}
          >
            <div className="mb-3">
              <Label className="form-label">Ancien mot de passe</Label>
              <Input
                name="oldPassword"
                type="password"
                placeholder="Ancien mot de passe"
                onChange={passwordValidation.handleChange}
                onBlur={passwordValidation.handleBlur}
                value={passwordValidation.values.oldPassword}
                invalid={
                  passwordValidation.touched.oldPassword && passwordValidation.errors.oldPassword
                    ? true
                    : false
                }
              />
              {passwordValidation.touched.oldPassword && passwordValidation.errors.oldPassword ? (
                <FormFeedback type="invalid">
                  {passwordValidation.errors.oldPassword}
                </FormFeedback>
              ) : null}
            </div>
            <div className="mb-3">
              <Label className="form-label">Nouveau mot de passe</Label>
              <Input
                name="newPassword"
                type="password"
                placeholder="Nouveau mot de passe"
                onChange={passwordValidation.handleChange}
                onBlur={passwordValidation.handleBlur}
                value={passwordValidation.values.newPassword}
                invalid={
                  passwordValidation.touched.newPassword && passwordValidation.errors.newPassword
                    ? true
                    : false
                }
              />
              {passwordValidation.touched.newPassword && passwordValidation.errors.newPassword ? (
                <FormFeedback type="invalid">
                  {passwordValidation.errors.newPassword}
                </FormFeedback>
              ) : null}
            </div>
            <div className="mb-3">
              <Label className="form-label">Confirmer mot de passe</Label>
              <Input
                name="confirmPassword"
                type="password"
                placeholder="Confirmer mot de passe"
                onChange={passwordValidation.handleChange}
                onBlur={passwordValidation.handleBlur}
                value={passwordValidation.values.confirmPassword}
                invalid={
                  passwordValidation.touched.confirmPassword && passwordValidation.errors.confirmPassword
                    ? true
                    : false
                }
              />
              {passwordValidation.touched.confirmPassword && passwordValidation.errors.confirmPassword ? (
                <FormFeedback type="invalid">
                  {passwordValidation.errors.confirmPassword}
                </FormFeedback>
              ) : null}
            </div>
            <div className="text-end">
              <button type="submit" className="btn btn-danger">
                Changer mot de passe
              </button>
            </div>
          </Form>
        </ModalBody>
      </Modal>

      {/* Modal for block/unblock confirmation */}
      <Modal isOpen={confirmationModal} toggle={toggleConfirmationModal} className="modal-dialog-centered">
        <ModalHeader toggle={toggleConfirmationModal}>
          Confirmation
        </ModalHeader>
        <ModalBody>
          Êtes-vous sûr de vouloir {action === 'block' ? 'bloquer' : 'débloquer'} cet utilisateur ?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleBlockUser}>
            Oui
          </Button>
          <Button color="secondary" onClick={toggleConfirmationModal}>
            Non
          </Button>
        </ModalFooter>
      </Modal>
    </Col>
  );
};

CardContact.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    email: PropTypes.string,
    image: PropTypes.string,
    tel: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    blocked: PropTypes.bool,
  }).isRequired,
};

export default CardContact;
