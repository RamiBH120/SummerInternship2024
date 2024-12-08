import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
} from "reactstrap";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";
import withRouter from "../../components/Common/withRouter";

// Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb";

import avatar from "../../assets/images/users/avatar-1.jpg";
import "../../../public/assets/styles/UserProfile.css";
// API service
import { getUserProfile, updateUser, uploadProfilePicture, updatePassword } from "../../service/apiUser";


const UserProfile = (props) => {
  const url = process.env.REACT_APP_BACKEND_URL;

  //meta title
  document.title = "Profile | Skote - React Admin & Dashboard Template";

  const [userData, setUserData] = useState({
    username: "Admin",
    email: "admin@example.com",
    profilePicture: avatar,
    tel: "",
    userId: "",
  });

  const [profileError, setProfileError] = useState(null);
  const [profileSuccess, setProfileSuccess] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserProfile();
        setUserData({
          username: response.user.name || "Admin",
          email: response.user.email || "admin@example.com",
          profilePicture: response.user.image ? `http://localhost:3000/${response.user.image}` : avatar,
          tel: response.user.tel || "",
          userId: response.user._id || "",
        });
      } catch (error) {
        console.error("Une erreur est survenue lors de l'obtention de vos informations:", error);
        setProfileError("Une erreur est survenue lors de l'obtention de vos informations.");
      }
    };

    fetchUserData();

    if (profileSuccess) {
      setTimeout(() => {
        setProfileSuccess(null);
      }, 3000);
    }

    if (passwordSuccess) {
      setTimeout(() => {
        setPasswordSuccess(null);
      }, 3000);
    }
  }, [profileSuccess, passwordSuccess]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const response = await uploadProfilePicture(userData.userId, file);
        setUserData((prevData) => ({
          ...prevData,
          profilePicture: `${url}/${response.image}`,
        }));
        setProfileError(null);
        setProfileSuccess("Votre photo de profil a été mise à jour avec succès !");
      } catch (error) {
        console.error("Erreur lors du téléchargement de la photo de profil:", error);
        setProfileSuccess(null);
        setProfileError("Une erreur est survenue lors du téléchargement de votre photo de profil.");
      }
    }
  };

  // Formik for email and phone update
  const formikProfile = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: userData.email || "",
      tel: userData.tel || "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Format d'email invalide").required("Veuillez entrer votre email"),
      tel: Yup.string().required("Veuillez entrer votre numéro de téléphone"),
    }),
    onSubmit: async (values) => {
      try {
        const updatedUser = await updateUser(userData.userId, values);
        setUserData(updatedUser);
        setProfileError(null);
        setProfileSuccess("Votre profil a été mis à jour avec succès !");
      } catch (error) {
        console.error("Erreur lors de la mise à jour du profil utilisateur :", error);
        setProfileSuccess(null);
        setProfileError("Une erreur est survenue lors de la mise à jour de votre profil.");
      }
    },
  });

  // Formik for password update
  const formikPassword = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required("Veuillez entrer votre ancien mot de passe"),
      newPassword: Yup.string()
        .min(6, "Le mot de passe doit contenir au moins 6 caractères")
        .required("Veuillez entrer votre nouveau mot de passe"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Les mots de passe ne correspondent pas")
        .required("Veuillez confirmer votre nouveau mot de passe"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await updatePassword(userData.userId, values.oldPassword, values.newPassword);
        setPasswordError(null);
        setPasswordSuccess("Votre mot de passe a été mis à jour avec succès !");
        setTimeout(() => {
          setPasswordSuccess(null);
        }, 3000);
      } catch (error) {
        console.error("Erreur lors de la mise à jour du mot de passe :", error);
        setPasswordSuccess(null);
        setPasswordError(error.message || "Une erreur est survenue lors de la mise à jour de votre mot de passe.");
      }
    },
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Skote" breadcrumbItem="Profile" />
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <div className="d-flex position-relative">
                    <div className="profile-picture-container">
                      <img
                        src={userData.profilePicture}
                        alt=""
                        className="rounded-circle img-thumbnail"
                      />
                      <div className="profile-picture-overlay">
                        <input type="file" onChange={handleFileChange} style={{ display: "none" }} id="profilePictureUpload" />
                        <label htmlFor="profilePictureUpload" className="overlay-label">
                          <i className="mdi mdi-camera"></i>Modifier
                        </label>
                      </div>
                    </div>
                    <div className="flex-grow-1 align-self-center ms-3">
                      <div className="text-muted">
                        <h5>{userData.username}</h5>
                        <p className="mb-0">Membre Cnot</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg="6">
              <h4 className="card-title mb-4">Modifier Email & Téléphone</h4>
              <Card>
                <CardBody>
                  {profileError && <Alert color="danger">{profileError}</Alert>}
                  {profileSuccess && <Alert color="success">{profileSuccess}</Alert>}
                  <Form
                    className="form-horizontal"
                    onSubmit={(e) => {
                      e.preventDefault();
                      formikProfile.handleSubmit();
                      return false;
                    }}
                  >
                    <div className="form-group">
                      <Label className="form-label">Email</Label>
                      <Input
                        name="email"
                        className="form-control"
                        placeholder="Entrer l'email"
                        type="email"
                        onChange={formikProfile.handleChange}
                        onBlur={formikProfile.handleBlur}
                        value={formikProfile.values.email || ""}
                        invalid={
                          formikProfile.touched.email && formikProfile.errors.email ? true : false
                        }
                      />
                      {formikProfile.touched.email && formikProfile.errors.email ? (
                        <FormFeedback type="invalid">{formikProfile.errors.email}</FormFeedback>
                      ) : null}
                    </div>

                    <div className="form-group">
                      <Label className="form-label">Numéro de téléphone</Label>
                      <Input
                        name="tel"
                        className="form-control"
                        placeholder="Entrer le numéro de téléphone"
                        type="text"
                        onChange={formikProfile.handleChange}
                        onBlur={formikProfile.handleBlur}
                        value={formikProfile.values.tel || ""}
                        invalid={
                          formikProfile.touched.tel && formikProfile.errors.tel ? true : false
                        }
                      />
                      {formikProfile.touched.tel && formikProfile.errors.tel ? (
                        <FormFeedback type="invalid">{formikProfile.errors.tel}</FormFeedback>
                      ) : null}
                    </div>

                    <div className="text-center mt-4">
                      <Button type="submit" className="btn btn-primary btn-block">
                        Modifier
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>

            <Col lg="6">
              <h4 className="card-title mb-4">Changer le Mot de Passe</h4>
              <Card>
                <CardBody>
                  {passwordError && <Alert color="danger">{passwordError}</Alert>}
                  {passwordSuccess && <Alert color="success">{passwordSuccess}</Alert>}
                  <Form
                    className="form-horizontal"
                    onSubmit={(e) => {
                      e.preventDefault();
                      formikPassword.handleSubmit();
                      return false;
                    }}
                  >
                    <div className="form-group">
                      <Label className="form-label">Ancien Mot de Passe</Label>
                      <Input
                        name="oldPassword"
                        className="form-control"
                        placeholder="Entrer l'ancien mot de passe"
                        type="password"
                        onChange={formikPassword.handleChange}
                        onBlur={formikPassword.handleBlur}
                        value={formikPassword.values.oldPassword || ""}
                        invalid={
                          formikPassword.touched.oldPassword && formikPassword.errors.oldPassword ? true : false
                        }
                      />
                      {formikPassword.touched.oldPassword && formikPassword.errors.oldPassword ? (
                        <FormFeedback type="invalid">{formikPassword.errors.oldPassword}</FormFeedback>
                      ) : null}
                    </div>

                    <div className="form-group">
                      <Label className="form-label">Nouveau Mot de Passe</Label>
                      <Input
                        name="newPassword"
                        className="form-control"
                        placeholder="Entrer le nouveau mot de passe"
                        type="password"
                        onChange={formikPassword.handleChange}
                        onBlur={formikPassword.handleBlur}
                        value={formikPassword.values.newPassword || ""}
                        invalid={
                          formikPassword.touched.newPassword && formikPassword.errors.newPassword ? true : false
                        }
                      />
                      {formikPassword.touched.newPassword && formikPassword.errors.newPassword ? (
                        <FormFeedback type="invalid">{formikPassword.errors.newPassword}</FormFeedback>
                      ) : null}
                    </div>

                    <div className="form-group">
                      <Label className="form-label">Confirmer le Nouveau Mot de Passe</Label>
                      <Input
                        name="confirmPassword"
                        className="form-control"
                        placeholder="Confirmer le nouveau mot de passe"
                        type="password"
                        onChange={formikPassword.handleChange}
                        onBlur={formikPassword.handleBlur}
                        value={formikPassword.values.confirmPassword || ""}
                        invalid={
                          formikPassword.touched.confirmPassword && formikPassword.errors.confirmPassword ? true : false
                        }
                      />
                      {formikPassword.touched.confirmPassword && formikPassword.errors.confirmPassword ? (
                        <FormFeedback type="invalid">{formikPassword.errors.confirmPassword}</FormFeedback>
                      ) : null}
                    </div>

                    <div className="text-center mt-4">
                      <Button type="submit" className="btn btn-primary btn-block">
                        Changer
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(UserProfile);
