import React, { useState } from "react";
import { Col, Form, Input, Row, Container, Button } from "reactstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";


const Unblock = () => {
  const url = process.env.REACT_APP_BACKEND_URL;

  document.title = "Débloquer";

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { email, name, role } = location.state || {}; // Retrieve user's details from location state

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (/^\d$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (index < 5 && value) {
        document.getElementById(`digit-${index + 1}`).focus();
      }
    } else if (value === "") {
      const newCode = [...code];
      newCode[index] = "";
      setCode(newCode);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();

      const newCode = [...code];

      if (code[index] !== "") {
        newCode[index] = "";
      } else if (index > 0) {
        newCode[index - 1] = "";
        document.getElementById(`digit-${index - 1}`).focus();
      }

      setCode(newCode);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const unblockCode = code.join("");

    try {
      const response = await axios.post(`${url}/users/unblock`, {
        email,
        unblockCode,
      });

      if (response.data.success) {
        localStorage.setItem("authUser", JSON.stringify(response.data));
        navigate("/home");
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError(err.response ? err.response.data.error : err.message);
    }
  };

  return (
    <section className="section hero-section">
      <div className="glow-container">
        <div className="glow-circle left"></div>
        <div className="glow-circle right"></div>
      </div>
      <div className="d-flex align-items-center justify-content-center vh-100 mx-auto">
        <Container>
          <Row className="justify-content-center">
            <Col xl={5}>
              <div className="auth-full-page-content p-md-5 p-4">
                <div className="w-100">
                  <div className="d-flex flex-column h-100">
                    <div className="mb-md-5 mb-4 text-center">
                      <Link
                        to="/dashboard"
                        className="d-block auth-logo"
                      ></Link>
                    </div>
                    <div className="my-auto">
                      <div className="text-center">
                        <div className="avatar-md mx-auto">
                          <div className="avatar-title rounded-circle bg-light">
                            <i className="bx bxs-message-rounded-dots h1 mb-0 text-primary"></i>
                          </div>
                        </div>
                        <div className="mt-4 p-2">
                          <h4>Débloquer votre compte</h4>
                          <p>
                            Veuillez entrer le code à 6 chiffres envoyé par SMS
                            au Directeur{" "}
                            <span className="fw-semibold">
                              Monsieur Lakhdar Haykel
                            </span>
                          </p>
                          {error && <p className="text-danger">{error}</p>}
                          <Form onSubmit={handleSubmit}>
                            <Row className="justify-content-center">
                              {code.map((digit, index) => (
                                <Col key={index} className="col-2">
                                  <div className="mb-3">
                                    <Input
                                      type="text"
                                      id={`digit-${index}`}
                                      className="form-control text-center"
                                      maxLength="1"
                                      value={digit}
                                      onChange={(e) => handleChange(e, index)}
                                      onKeyDown={(e) => handleKeyDown(e, index)}
                                      autoComplete="off"
                                    />
                                  </div>
                                </Col>
                              ))}
                            </Row>
                            <div className="mt-4">
                              <Button type="submit" color="primary" block>
                                Confirmer
                              </Button>
                            </div>
                          </Form>
                        </div>
                      </div>
                    </div>
                    <div className="mt-md-5 mt-4 text-center">
                      <p className="mb-0">
                        © {new Date().getFullYear()} Crafted with{" "}
                        <i className="mdi mdi-heart text-danger"></i> by
                        Themesbrand
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </section>
  );
};

export default Unblock;
