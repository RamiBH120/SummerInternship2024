import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactApexChart from "react-apexcharts";
import * as Yup from 'yup';
import {
    Row,
    Col,
    CardBody,
    Card,
    Container,
    Form,
    Input,
    FormFeedback,
    Label,
    Button, 
    Modal, 
    ModalHeader, 
    ModalBody, 
    ModalFooter,
    Nav,
    NavItem,
    NavLink,
    Alert
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import predictionIcon from "../../../assets/images/icon/prediction.png";
import DatePicker from "react-datepicker"; // Assurez-vous que react-datepicker est installé
import "react-datepicker/dist/react-datepicker.css"; // Importez le style du datepicker
import axios from 'axios';
import { athletismePerformPrediction } from '../../../service/aiService';
import HistoriqueModal from '../HistoriqueModal';
import { addPrediction, getPredictionByCin, getPredictionByCnotid } from '../../../service/predictionHistoryService';

function AthPerformance() {
    const { id } = useParams();
    const navigate = useNavigate();
    const predictionType = "Prédiction du performance pour la discipline athlétisme";
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const [showInfoPers, setShowInfoPers] = useState(true);
    const [showIdentifiant, setShowIdentifiant] = useState(false);
    const [erreurCin, setErreurCin] = useState(false);
    const [erreurCinLength, setErreurCinLength] = useState(false);
    const [erreurIdentifiant, setErreurIdentifiant] = useState(false);
    const [activeTab, setActiveTab] = useState('InfoPers');
    const [modalHistorique, setModalHistorique] = useState(false);
    const toggleHistorique = () => setModalHistorique(!modalHistorique);
    const [result, setResult] = useState(null);
    const [fullname, setFullname] = useState('');
    const [cin, setCin] = useState('');
    const [identifiant, setIdentifiant] = useState('');
    const [email, setEmail] = useState('');
    const [formVisibility, setFormVisibility] = useState(false);
    const [featureImportance, setFeatureImportance] = useState(null);
    const [chartOptions, setChartOptions] = useState(null);
    const [series, setSeries] = useState(null);

    const [initialValues, setInitialValues] = useState({
        age: '',
        sex: '',
        height: '',
        weight: '',
        country: '',
        date_of_last_competition:new Date(),
        nutrition_quality_score: '',
        average_sleep_hours: '',
        injury_history: '',
        result_100m: '',
        result_200m: '',
        result_400m: '',
        result_long_jump: '',
        result_high_jump: '',
        result_shot_put: '',
    });

    const validation = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            age: Yup.number().required('L\'âge est obligatoire').min(1, 'L\'âge doit être supérieur à 0'),
            sex: Yup.string().required('Le sexe est obligatoire'),
            height: Yup.number().required('La taille est obligatoire').min(1, 'La taille doit être supérieure à 0'),
            weight: Yup.number().required('Le poids est obligatoire').min(1, 'Le poids doit être supérieur à 0'),
            country: Yup.string().required('Le pays est obligatoire'),
            nutrition_quality_score: Yup.number().required('Le score nutritionnel est obligatoire').min(0).max(10),
            average_sleep_hours: Yup.number().required('Le nombre d\'heures de sommeil est obligatoire').min(0),
            injury_history: Yup.number().required('L\'historique des blessures est obligatoire').oneOf([0, 1]),
            result_100m: Yup.number().required('Le résultat 100m est obligatoire'),
            result_200m: Yup.number().required('Le résultat 200m est obligatoire'),
            result_400m: Yup.number().required('Le résultat 400m est obligatoire'),
            result_long_jump: Yup.number().required('Le saut en longueur est obligatoire'),
            result_high_jump: Yup.number().required('Le saut en hauteur est obligatoire'),
            result_shot_put: Yup.number().required('Le lancer de poids est obligatoire'),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                const dateObj = new Date(values.date_of_last_competition);
                const dateInt = parseInt(
                    dateObj.getFullYear().toString() +
                    (dateObj.getMonth() + 1).toString().padStart(2, '0') +
                    dateObj.getDate().toString().padStart(2, '0')
                  );
                  values.date_of_last_competition = dateInt;
                  values.country = 1;
                  
                // API call to predict performance
                const data ={
                    "High Jump Result": values.result_high_jump,
                    "Shot Put Result": values.result_shot_put,
                    "Country": values.country,
                    "Weight": values.weight,
                    "Height": values.height,
                    "Sleep Hours": values.average_sleep_hours,
                    "Sex": values.sex,
                    "Blessure": values.injury_history,
                    "Nutrition Quality Score": values.nutrition_quality_score,
                    "Competition Date": values.date_of_last_competition,
                    "100m Dash Result": values.result_100m,
                    "200m Dash Result": values.result_200m,
                    "Age": values.age,
                    "400m Dash Result": values.result_400m,
                    "Long Jump Result": values.result_long_jump
                };
                const response = await athletismePerformPrediction(data)
                setResult(response.data.prediction); // Display the prediction message
                const feature = response.data.important_features;
                const featureMapping = {
                    "Age": "Âge",
                    "Sex": "Sexe",
                    "Height": "Taille (cm)",
                    "Weight": "Poids (kg)",
                    "Country": "Pays",
                    "Competition Date": "Date de la Dernière Compétition",
                    "Nutrition Quality Score": "Score de Qualité Nutritionnelle",
                    "Sleep Hours": "Heures de Sommeil",
                    "Blessure": "Historique des Blessures",
                    "100m Dash Result": "Résultat 100m (s)",
                    "200m Dash Result": "Résultat 200m (s)",
                    "400m Dash Result": "Résultat 400m (s)",
                    "Long Jump Result": "Résultat Saut en Longueur (m)",
                    "High Jump Result": "Résultat Saut en Hauteur (m)",
                    "Shot Put Result": "Résultat Lancer de Poids (m)"
                };
                
                const importance = {};
                
                // Fill the importance object feature by feature
                feature.forEach(item => {
                    const newKey = featureMapping[item.feature];
                    if (newKey) {
                        // Assign the value based on the feature
                        if (newKey === "date_of_last_competition") {
                            importance[newKey] = new Date(); // Assign current date for Competition Date
                        } else {
                            importance[newKey] = item.contribution_percentage;
                        }
                    }
                });
                setFeatureImportance(importance);
                const labels = Object.keys(importance);
                setSeries(Object.values(importance));
              
                setChartOptions({
                    chart: {
                        type: 'bar',
                        height: 500
                    },
                    plotOptions: {
                        bar: {
                            horizontal: false,
                            columnWidth: '75%', // Adjust the width of each bar
                        },
                    },
                    dataLabels: {
                        enabled: true, // Show values on top of each bar
                        formatter: (val) => val.toFixed(2) + '%' // Display real numbers with 2 decimal places
                    },
                    xaxis: {
                        categories: labels,
                        labels: {
                            rotate: -45, // Rotate labels
                            maxHeight: 100, // Allow more height for rotated labels
                            formatter: function (val) {
                                const maxLength = 15; // Truncate labels longer than 15 characters
                                return val.length > maxLength ? val.substring(0, maxLength) + '...' : val;
                              },
                          },
                    },
                    yaxis: {
                        title: {
                            text: 'Contribution Percentage (%)',
                            style: {
                                fontWeight: 'bold'
                            }
                        },
                        min: 0, // Ensures y-axis starts at 0
                        max: 100, // Adjust this based on your data range
                        tickAmount: 5, // Display 5 ticks on y-axis
                        labels: {
                            formatter: (val) => Math.round(val) // Display integer values in the y-axis legend
                        }
                    },
                    colors: ['#AB66FF'], // Set color for bars
                    tooltip: {
                        x: {
                            formatter: function (val) {
                              return val;
                            },
                          },
                        y: {
                            formatter: (val) => val.toFixed(2) + '%' // Show real values in tooltip
                        }
                    },
                });
                if(identifiant){
                    const importanceList = Object.keys(importance).map(key => ({
                        feature: key,
                        value: importance[key]
                      }));
                    const predictionHistoryData = {
                        "identifiantcnot":identifiant,
                        "prediction": {
                            "predictionname":predictionType,
                            "values":importanceList,
                            "result":response.data.prediction
                    }
                }
                await addPrediction(predictionHistoryData);
            }else {
                const importanceList = Object.keys(importance).map(key => ({
                    feature: key,
                    value: importance[key]
                  }));
                const predictionHistoryData = {
                    "fullname":fullname,
                    "cin":cin,
                    "email":email,
                    "predictionhistory": {
                        "predictionname":predictionType,
                        "values":importanceList,
                        "result":response.data.prediction
                }
            }
            await addPrediction(predictionHistoryData);
            setFormVisibility(false);
            setFullname('');
            setCin(0);
            setEmail('');
            }
                toggle();
                resetForm();
            } catch (error) {
                console.error('Submission error:', error);
            }
        }
    });

    return (
        <React.Fragment>
            <section className="section hero-section mt-5" id="home">
                <Container className='mt-5'>
                    <Row className="justify-content-center">
                        <Col md={12} lg={12} xl={12}>
                            <Card className="overflow-hidden">
                                <div className="bg-primary bg-soft">
                                    <Row>
                                        <Col xs={7}>
                                            <div className="text-primary p-4">
                                                <h5 className="text-primary">Athletisme</h5>
                                                <p>Prédiction de Performance</p>
                                            </div>
                                        </Col>
                                        <Col className="col-5 align-self-end">
                                            <img alt="" className="img-fluid" />
                                        </Col>
                                    </Row>
                                </div>
                                <CardBody className="pt-0">
                                    <div>
                                        <Link to="#" className="auth-logo-light">
                                            <div className="avatar-md profile-user-wid mb-4">
                                                <span className="avatar-title rounded-circle bg-light">
                                                    <img
                                                        src={predictionIcon}
                                                        alt=""
                                                        className=""
                                                        height="35"
                                                        width="35"
                                                    />
                                                </span>
                                            </div>
                                        </Link>
                                    </div>
                                    {formVisibility ? (
                                        <div className="p-2">
                                            {identifiant &&
                                            <div className="mb-6">
                                            <Label className="form-label text-center"><i className="mdi mdi-history me-2 fs-4" /><a href="#" onClick={toggleHistorique}>Consulter l'historique des Prédiction</a></Label>
                                            </div> }
                                        <Form
                                            className="form-horizontal"
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                validation.handleSubmit();
                                            }}
                                        >
                                            {/* Add input fields for each of the required parameters */}
                                            <div className="mb-3">
                                                <Label className="form-label">Âge</Label>
                                                <Input
                                                    name="age"
                                                    type="number"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.age || ""}
                                                    invalid={validation.touched.age && validation.errors.age}
                                                />
                                                <FormFeedback>{validation.errors.age}</FormFeedback>
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label">Sexe</Label>
                                                <Input
                                                    name="sex"
                                                    type="select"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.sex || ""}
                                                    invalid={validation.touched.sex && validation.errors.sex}
                                                >
                                                    <option value="">Sélectionnez</option>
                                                    <option value="0">Masculin</option>
                                                    <option value="1">Féminin</option>
                                                </Input>
                                                <FormFeedback>{validation.errors.sex}</FormFeedback>
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label">Taille (cm)</Label>
                                                <Input
                                                    name="height"
                                                    type="number"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.height || ""}
                                                    invalid={validation.touched.height && validation.errors.height}
                                                />
                                                <FormFeedback>{validation.errors.height}</FormFeedback>
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label">Poids (kg)</Label>
                                                <Input
                                                    name="weight"
                                                    type="number"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.weight || ""}
                                                    invalid={validation.touched.weight && validation.errors.weight}
                                                />
                                                <FormFeedback>{validation.errors.weight}</FormFeedback>
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label">Pays</Label>
                                                <Input
                                                    name="country"
                                                    type="text"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.country || ""}
                                                    invalid={validation.touched.country && validation.errors.country}
                                                />
                                                <FormFeedback>{validation.errors.country}</FormFeedback>
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label">Date de la Dernière Compétition</Label>
                                                <DatePicker
                                                    selected={validation.values.date_of_last_competition}
                                                    onChange={(date_of_last_competition) => validation.setFieldValue('date_of_last_competition', date_of_last_competition)}
                                                    className={`form-control ${validation.touched.date_of_last_competition && validation.errors.date_of_last_competition ? 'is-invalid' : ''}`}
                                                    onBlur={validation.handleBlur}
                                                />
                                                {validation.touched.date_of_last_competition && validation.errors.date_of_last_competition ? (
                                                    <FormFeedback>{validation.errors.date_of_last_competition}</FormFeedback>
                                                ) : null}
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label">Score de Qualité Nutritionnelle (1 - 10)</Label>
                                                <Input
                                                    name="nutrition_quality_score"
                                                    type="number"
                                                    min="0"
                                                    max="10"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.nutrition_quality_score || ""}
                                                    invalid={validation.touched.nutrition_quality_score && validation.errors.nutrition_quality_score}
                                                />
                                                <FormFeedback>{validation.errors.nutrition_quality_score}</FormFeedback>
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label">Heures de Sommeil</Label>
                                                <Input
                                                    name="average_sleep_hours"
                                                    type="number"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.average_sleep_hours || ""}
                                                    invalid={validation.touched.average_sleep_hours && validation.errors.average_sleep_hours}
                                                />
                                                <FormFeedback>{validation.errors.average_sleep_hours}</FormFeedback>
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label">Historique des Blessures</Label>
                                                <Input
                                                    name="injury_history"
                                                    type="select"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.injury_history || ""}
                                                    invalid={validation.touched.injury_history && validation.errors.injury_history}
                                                >
                                                    <option value="">Sélectionnez</option>
                                                    <option value="0">Aucun</option>
                                                    <option value="1">Oui</option>
                                                </Input>
                                                <FormFeedback>{validation.errors.injury_history}</FormFeedback>
                                            </div>

                                            {/* Add input fields for the results of different events */}
                                            <div className="mb-3">
                                                <Label className="form-label">Résultat 100m (s)</Label>
                                                <Input
                                                    name="result_100m"
                                                    type="number"
                                                    step="0.01"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.result_100m || ""}
                                                    invalid={validation.touched.result_100m && validation.errors.result_100m}
                                                />
                                                <FormFeedback>{validation.errors.result_100m}</FormFeedback>
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label">Résultat 200m (s)</Label>
                                                <Input
                                                    name="result_200m"
                                                    type="number"
                                                    step="0.01"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.result_200m || ""}
                                                    invalid={validation.touched.result_200m && validation.errors.result_200m}
                                                />
                                                <FormFeedback>{validation.errors.result_200m}</FormFeedback>
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label">Résultat 400m (s)</Label>
                                                <Input
                                                    name="result_400m"
                                                    type="number"
                                                    step="0.01"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.result_400m || ""}
                                                    invalid={validation.touched.result_400m && validation.errors.result_400m}
                                                />
                                                <FormFeedback>{validation.errors.result_400m}</FormFeedback>
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label">Résultat Saut en Longueur (m)</Label>
                                                <Input
                                                    name="result_long_jump"
                                                    type="number"
                                                    step="0.01"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.result_long_jump || ""}
                                                    invalid={validation.touched.result_long_jump && validation.errors.result_long_jump}
                                                />
                                                <FormFeedback>{validation.errors.result_long_jump}</FormFeedback>
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label">Résultat Saut en Hauteur (m)</Label>
                                                <Input
                                                    name="result_high_jump"
                                                    type="number"
                                                    step="0.01"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.result_high_jump || ""}
                                                    invalid={validation.touched.result_high_jump && validation.errors.result_high_jump}
                                                />
                                                <FormFeedback>{validation.errors.result_high_jump}</FormFeedback>
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label">Résultat Lancer de Poids (m)</Label>
                                                <Input
                                                    name="result_shot_put"
                                                    type="number"
                                                    step="0.01"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.result_shot_put || ""}
                                                    invalid={validation.touched.result_shot_put && validation.errors.result_shot_put}
                                                />
                                                <FormFeedback>{validation.errors.result_shot_put}</FormFeedback>
                                            </div>

                                            <div className="mt-4 d-grid">
                                                <button className="btn btn-primary btn-block" type="submit">
                                                    Prédire la performance
                                                </button>
                                            </div>
                                        </Form>
                                    </div>) : (
                                            <div className="p-2">
                                            <Nav
                                                fill
                                                pills
                                                className='my-3'
                                                >
                                                <NavItem onClick={() => {
                                                    setShowInfoPers(true);
                                                    setShowIdentifiant(false);
                                                    setActiveTab('InfoPers');
                                                    setIdentifiant('');
                                                }}>
                                                    <NavLink
                                                    active={activeTab === 'InfoPers'}
                                                    href="#"
                                                    >
                                                    Informations Personnelles
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem onClick={() => {
                                                    setShowInfoPers(false);
                                                    setShowIdentifiant(true);
                                                    setActiveTab('identifiant');
                                                    setFullname('');
                                                    setCin(0);
                                                    setEmail('');
                                                }}>
                                                    <NavLink href="#" active={activeTab === 'identifiant'}>
                                                    Identifiant CNOT
                                                    </NavLink>
                                                </NavItem>
                                                </Nav>
                                                {erreurCin &&
                                                <div className="mb-3">
                                                    <Alert color="danger">CIN existant veuillez utiliser votre identifiant !!</Alert>
                                                    </div>}
                                                {erreurCinLength &&
                                                <div className="mb-3">
                                                    <Alert color="danger">CIN doit être composer de 8 chiffres !!</Alert>
                                                    </div>}
                                                {showInfoPers &&
                                                <div className="mb-3">
                                                    <Label className="form-label">CIN</Label>
                                                    <Input
                                                        name="cin"
                                                        className="form-control"
                                                        type="number"
                                                        value={cin}
                                                        onChange={(event) => {
                                                            setCin(event.target.value);
                                                            if (event.target.value.length !== 8){
                                                                setErreurCinLength(true);
                                                            }
                                                            if (event.target.value.length === 8){
                                                                setErreurCinLength(false);
                                                            }
                                                          }}
                                                    />
                                                </div>}
                                                {showInfoPers &&
                                                <div className="mb-3">
                                                    <Label className="form-label">Nom et Prénom</Label>
                                                    <Input
                                                        name="fullname"
                                                        className="form-control"
                                                        type="text"
                                                        value={fullname}
                                                        onChange={(event) => {
                                                            setFullname(event.target.value);
                                                          }}
                                                    />
                                                </div>}
                                                {showInfoPers &&
                                                <div className="mb-3">
                                                    <Label className="form-label">Adresse email</Label>
                                                    <Input
                                                        name="email"
                                                        className="form-control"
                                                        type="email"
                                                        value={email}
                                                        onChange={(event) => {
                                                            setEmail(event.target.value);
                                                          }}
                                                    />
                                                </div>}
                                                {erreurIdentifiant &&
                                                <div className="mb-3">
                                                    <Alert color="danger">Identifiant inexistant utiliser vos Informations personnelles !!</Alert>
                                                    </div>}
                                                {showIdentifiant &&
                                                <div className="mb-3">
                                                    <Label className="form-label">Identifiant CNOT Perform</Label>
                                                    <Input
                                                        name="fullname"
                                                        className="form-control"
                                                        type="text"
                                                        value={identifiant}
                                                        onChange={(event) => {
                                                            setIdentifiant(event.target.value);
                                                          }}
                                                    />
                                                </div>}
                                                <div className="mt-4 d-grid">
                                                    <button
                                                        className="btn btn-primary btn-block"
                                                        type="submit"
                                                        onClick={async () => {
                                                            if(showInfoPers){
                                                                    const response = await getPredictionByCin(cin);
                                                                    const result = response.data;
                                                                    if (result.length != 0) {
                                                                      setErreurCin(true);
                                                                    } else{
                                                                        setFormVisibility(true)
                                                                    }
                                                                
                                                            }
                                                            if(showIdentifiant){
                                                                const response = await getPredictionByCnotid(identifiant);
                                                                const result = response.data;
                                                                if (result.length === 0) {
                                                                  setErreurIdentifiant(true);
                                                                } else{
                                                                    setFormVisibility(true)
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        Suivant
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>
            <Modal isOpen={modal} toggle={toggle} size="xl">
        <ModalHeader toggle={toggle}>Résultat</ModalHeader>
        <ModalBody>
          {result == 0 ? 
          (<div className="text-center p-4">
            <iframe 
              src="https://lottie.host/embed/ead1715c-f858-47bc-8bee-72f498cebb7b/0PVav4ymMc.json" 
              className="mx-auto mb-4" 
              style={{ width: '300px', height: '300px', border: 'none' }}
              title="Animation"
            ></iframe>
            <div className="alert alert-danger rounded-3 shadow-sm">
              <h4 className="alert-heading">Désolé, vous ne gagnerez pas de médaille cette fois-ci. Mais ne vous découragez pas,</h4>
              <p className="mb-0">vos efforts constants vous mèneront au succès !</p>
            </div>
          </div>
           ) 
          : (<div className="text-center p-4">
            <iframe 
              src="https://lottie.host/embed/0cdf5268-4c54-492e-b94e-d5469ab3dc4f/HGmwar7vek.json" 
              className="mx-auto mb-4" 
              style={{ width: '300px', height: '300px', border: 'none' }}
              title="Animation"
            ></iframe>
            <div className="alert alert-success rounded-3 shadow-sm">
              <h4 className="alert-heading">Félicitations ! Vous gagnerez une médaille grâce à vos performances exceptionnelles.</h4>
              <p className="mb-0">Continuez vos efforts et vous atteindrez des sommets !</p>
            </div>
          </div> )
          }
        <h4 className='my-2 text-center'>Importance des caractéristiques</h4>
        {featureImportance && <div className="text-center">
            <ReactApexChart 
                options={chartOptions} 
                series={[{ name: 'Pourcentage d\'importance', data: series }]}
                type="bar" 
                height={600} 
                className='mt-3'
            />
        </div>}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <HistoriqueModal modal={modalHistorique} toggle={toggleHistorique} id={identifiant} predictionType={predictionType}/>
        </React.Fragment>
    );
}

export default AthPerformance;
