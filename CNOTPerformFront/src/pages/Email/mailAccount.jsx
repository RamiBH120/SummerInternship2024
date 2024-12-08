import React from 'react'
import { useEffect, useState } from 'react';
import { 
  Container,
  Row,
  Col,
  CardBody,
  Card,
  Alert,
  Form,
  Input,
  FormFeedback,
  Label, } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/CNOT_logo.svg";
import { useFormik } from "formik";
import * as Yup from "yup";
import { setEmailAccount, verifAccountSet } from '../../service/mailService';


function MailAccount() {
  const [email, setEmail] = useState('');
  const [disable, setDisable] = useState(false);
  const [userId, setUserId] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const verif = async (id) => {
    try{
    const result = await verifAccountSet(id);
    setEmail(result.data.mailaddress);
    if(result.data.mailaddress){
      setDisable(true);
        toast.warning("you have already set an account", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
        });
    }
    return result.data;
    }catch (error) {
      console.log(error)
  }
  }

  useEffect(() => {
    const storedAuthUser = localStorage.getItem('authUser');
    if(storedAuthUser){
      const authUser = JSON.parse(storedAuthUser);
      const id = authUser?.user?._id;
      setUserId(id);
      verif(id);    
    }
  },[])

  const validation = useFormik({
    initialValues: {
      email: email,
      password: "",
      userId: userId
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Email invalide").required("Email est obligatoire"),
      password: Yup.string().required("Motde passe est obligatoire"),
    }),
    onSubmit: async (values) => {
      const response = await setEmailAccount(values);
      if(response.data.status === 'success'){
        navigate("/email-inbox")
      } else {
        setError(true);         
      }
    },
  });

  useEffect(() => {
    validation.setValues({ email: email, password: validation.values.password , userId: userId});
  }, [email]);

  return (    
  <React.Fragment>
    <div className="page-content">
      <Container fluid>
        {/* Render Breadcrumbs */}
        <Breadcrumbs title="Email" breadcrumbItem="compte email" />
        <Container>
          <Row className="justify-content-center">
            <Col md={12} lg={12} xl={12 }>
              <Card className="overflow-hidden">
                <div className="bg-primary bg-soft">
                  <Row>
                    <Col xs={7}>
                      <div className="text-primary p-4">
                        <h5 className="text-primary">Bienvenue !</h5>
                        <p>Entrer les informations de votre compte email</p>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img  alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                <div>
                    <Link to="/" className="auth-logo-light">
                    <div className="avatar-md profile-user-wid mb-4">
  <span className="avatar-title rounded-circle bg-light">
    <img
      src={logo}
      alt=""
      className=""
      height="35" // Adjust the height to make the logo smaller
      width="35"  // Adjust the width to maintain aspect ratio and make the logo smaller
    />
  </span>
</div>
                    </Link>
                  </div>
                  <div className="mt-3 d-grid">
                      {error && <Alert color="danger">Merci de vérifier les informations saisies</Alert>}
                      </div>
                  <div className="p-2">
                    <Form
                      className="form-horizontal"
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                      }}
                    >

                      <div className="mb-3">
                        <Label className="form-label">Email</Label>
                        <Input
                          name="email"
                          className="form-control"
                          placeholder="Enter email"
                          type="email"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          disabled={disable}
                          value={validation.values.email || ""}
                          invalid={
                            validation.touched.email && validation.errors.email
                              ? true
                              : false
                          }
                        />
                        {validation.touched.email && validation.errors.email ? (
                          <FormFeedback type="invalid">
                            {validation.errors.email}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">Mot de passe</Label>
                        <Input
                          name="password"
                          value={validation.values.password || ""}
                          type="password"
                          placeholder="Enter Password"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          disabled={disable}
                          invalid={
                            validation.touched.password &&
                            validation.errors.password
                              ? true
                              : false
                          }
                        />
                        {validation.touched.password && validation.errors.password ? (
                          <FormFeedback type="invalid">
                            {validation.errors.password}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="mt-3 d-grid">
                        <button
                          className="btn btn-primary btn-block"
                          type="submit"
                        >
                          Enregistrer
                        </button>
                      </div>

                      <div className="mt-4 text-center">
                        <a href="https://knowledge.workspace.google.com/kb/how-to-create-app-passwords-000009237" className="text-muted">
                          <i className="mdi mdi-key me-1" />
                          Si vous utiliser Gmail merci de créer une mot de passe d'application et l'utiliser comme mot de passe ?
                        </a>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </Container>
    </div>
  </React.Fragment>
  )
}

export default MailAccount