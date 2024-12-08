import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Row,
  Col,
  CardBody,
  Card,
  Alert,
  Container,
  Form,
  Input,
  FormFeedback,
  Label,
} from "reactstrap";
import Select, { components } from "react-select";
import profile from "../../../public/assets/images/4.png";
import logo from "../../assets/images/CNOT_logo.svg";
import Seclogo from "../../../public/assets/images/logo/cnotperformicon.png";

import axios from "axios";
import { getRoleMCName, getRoleFName } from "../../service/apiUser"; // Adjust the import path according to your project structure


const Login = () => {
  const url = process.env.REACT_APP_BACKEND_URL;

  document.title = "Se Connecter | CNOT PERFORM";
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [userNames, setUserNames] = useState([]);
  const navigate = useNavigate();

 /* const signin = async (user) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/users/signin",
        user
      );
      localStorage.setItem("authUser", JSON.stringify(response.data));
      if (user.role === "MC") {
        navigate("/dashboard");
      } else {
        navigate("/home");
      }
    } catch (err) {
      setError(err.response ? err.response.data.error : err.message);
    }
  };*/

  const signin = async (user) => {
    try {
      const response = await axios.post(`${url}/users/signin`, user);

      if (response.data.success) {
        localStorage.setItem('authUser', JSON.stringify(response.data));
        if (user.role === 'MC') {
          navigate('/dashboard');
        } else {
          navigate('/home');
        }
      } else {
        throw new Error(response.data.error);
      }
    } catch (err) {
      // Check if the error is related to account being blocked
      if (err.response && err.response.data.error.includes('bloqué')) {
        // Redirect to unblock page with the necessary user details
        navigate('/unblock', {
          state: {
            email: user.email,
            name: user.name,
            role: user.role,
            
          }
        });
      } else {
        setError(err.response ? err.response.data.error : err.message);
      }
    }
  };

  const validation = useFormik({
    initialValues: {
      email: "",
      password: "",
      role: "",
      name: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Email invalide")
        .required("Email est obligatoire"),
      password: Yup.string().required("Mot de passe est obligatoire"),
      role: Yup.string().required("Rôle est obligatoire"),
      name: Yup.string().when("role", {
        is: (role) => role === "F" || role === "MC",
        then: Yup.string().required("Nom est obligatoire"),
        otherwise: Yup.string(),
      }),
    }),
    onSubmit: (values) => {
      signin(values);
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let response;
        if (selectedRole === "F") {
          response = await getRoleFName();
        } else if (selectedRole === "MC") {
          response = await getRoleMCName();
        }

        if (response && Array.isArray(response.users)) {
          const users = response.users.map((user) => ({
            value: user.name,
            label: user.name,
            image: user.image
              ? `${url}/${user.image}`
              : "/path/to/default/user1.jpg",
          }));
          setUserNames(users);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (selectedRole) {
      fetchUserData();
    }
  }, [selectedRole]);

  const handleRoleChange = (selectedOption) => {
    setSelectedRole(selectedOption ? selectedOption.value : "");
    validation.setFieldValue(
      "role",
      selectedOption ? selectedOption.value : ""
    );
    if (
      !selectedOption ||
      (selectedOption.value !== "F" && selectedOption.value !== "MC")
    ) {
      validation.setFieldValue("name", "");
    }
  };

  const handleNameChange = (selectedOption) => {
    validation.setFieldValue(
      "name",
      selectedOption ? selectedOption.value : ""
    );
  };

  const customOption = (props) => {
    return (
      <components.Option {...props}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={props.data.image}
            alt={props.data.label}
            style={{ width: 20, height: 20, marginRight: 10 }}
          />
          {props.data.label}
        </div>
      </components.Option>
    );
  };

  const roleOptions = [
    { value: "F", label: "Féderation" },
    { value: "MC", label: "CNOT" },
  ];

  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused
        ? "#2684FF"
        : state.selectProps.error
        ? "#dc3545"
        : base.borderColor,
      "&:hover": {
        borderColor: state.isFocused
          ? "#2684FF"
          : state.selectProps.error
          ? "#dc3545"
          : base.borderColor,
      },
    }),
  };

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      height: "calc(1.5em + 0.75rem + 2px)",
      minHeight: "calc(1.5em + 0.75rem + 2px)",
    }),
  };

  return (
    <section className="section hero-section">
      <div className="glow-container">
        <div className="glow-circle left"></div>
        <div className="glow-circle right"></div>
      </div>
      <div className="home-btn d-none d-sm-block">
        <Link to="/home" className="text-white">
          <i className="bx bx-home h2" />
        </Link>
      </div>
      <div className="account-pages pt-sm-5 mx-auto my-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="login-card overflow-hidden">
                <div className="bg-soft bg-primary">
                  <Row>
                    <Col xs={7}>
                      <div className="p-4 text-white">
                        <h5 className="text-white">Bienvenue !</h5>
                        <p>Connectez pour continuer</p>
                      </div>
                    </Col>
                    <Col className="align-self-end col-5">
                      <img src={profile} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                <div className="auth-logo-light d-flex align-items-center">
  <Link to="/" className="auth-logo-light position-relative">
    <div className="avatar-md profile-user-wid mb-4">
      <span className="avatar-title rounded-circle bg-light">
        <img
          src={logo}
          alt=""
          className=""
          height="35"
          width="35"
        />
      </span>
    </div>
  </Link>

  {/* Second Circle, slightly overlapping the first */}
  <Link to="/" className="auth-logo-light position-relative" style={{ marginLeft: '-15px' }}> {/* Negative margin to create overlap */}
    <div className="avatar-md profile-user-wid mb-4">
      <span className="avatar-title rounded-circle bg-light">
        <img
          src={Seclogo}
          alt="Second logo"
          className=""
          height="75"
          width="75"
        />
      </span>
    </div>
  </Link>
</div>


                  <div className="p-2">
                    <Form
                      className="form-horizontal"
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                      }}
                    >
                      {error && <Alert color="danger">{error}</Alert>}

                      <div className="mb-3">
                        <Label className="form-label text-white">Email</Label>
                        <Input
                          name="email"
                          className="form-control"
                          placeholder="Enter email"
                          type="email"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email || ""}
                          invalid={
                            validation.touched.email && validation.errors.email
                              ? true
                              : false
                          }
                          style={{ height: "calc(1.5em + 0.75rem + 2px)" }}
                        />
                        {validation.touched.email && validation.errors.email ? (
                          <FormFeedback type="invalid">
                            {validation.errors.email}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label text-white">
                          Mot de passe
                        </Label>
                        <Input
                          name="password"
                          value={validation.values.password || ""}
                          type="password"
                          placeholder="Enter Password"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            validation.touched.password &&
                            validation.errors.password
                              ? true
                              : false
                          }
                          style={{ height: "calc(1.5em + 0.75rem + 2px)" }}
                        />
                        {validation.touched.password &&
                        validation.errors.password ? (
                          <FormFeedback type="invalid">
                            {validation.errors.password}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label text-white">Rôle</Label>
                        <Select
                          name="role"
                          className=" text-dark"
                          options={roleOptions}
                          styles={{ ...customStyles, ...customSelectStyles }}
                          onChange={handleRoleChange}
                          onBlur={validation.handleBlur}
                          value={roleOptions.find(
                            (option) => option.value === validation.values.role
                          )}
                          isClearable
                          error={
                            validation.touched.role && validation.errors.role
                          }
                        />
                        {validation.touched.role && validation.errors.role ? (
                          <FormFeedback type="invalid" className="d-block">
                            {validation.errors.role}
                          </FormFeedback>
                        ) : null}
                      </div>

                      {(selectedRole === "F" || selectedRole === "MC") && (
                        <div className="mb-3">
                          <Label className="form-label text-white">Nom</Label>
                          <Select
                            name="name"
                            className=" text-dark"
                            options={userNames}
                            components={{ Option: customOption }}
                            onChange={handleNameChange}
                            onBlur={validation.handleBlur}
                            value={userNames.find(
                              (option) =>
                                option.value === validation.values.name
                            )}
                            isClearable
                            styles={{ ...customStyles, ...customSelectStyles }}
                            error={
                              validation.touched.name && validation.errors.name
                            }
                          />
                          {validation.touched.name && validation.errors.name ? (
                            <FormFeedback type="invalid" className="d-block">
                              {validation.errors.name}
                            </FormFeedback>
                          ) : null}
                        </div>
                      )}

                      <div className="d-grid mt-3">
                        <button
                          className="cta-button btn-block"
                          type="submit"
                          style={{ borderRadius: "25px" }}
                        >
                          Se Connecter
                        </button>
                      </div>

                      {/* <div className="mt-4 text-center">
                        <Link to="/forgot-password" className="text-muted">
                          <i className="mdi mdi-lock me-1" />
                          Mot de passe oubliée?
                        </Link>
                      </div> */}
                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                
               
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </section>
  );
};

export default Login;
