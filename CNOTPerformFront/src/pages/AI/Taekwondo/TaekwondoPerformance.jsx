import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
import Select from 'react-select';
import { useFormik } from 'formik';
import predictionIcon from "../../../assets/images/icon/prediction.png";
import axios from 'axios'; // Import axios for making API requests
import { taekwondoPerformPrediction } from '../../../service/aiService';
import { data } from 'autoprefixer';
import ReactApexChart from "react-apexcharts";
import { addPrediction, getPredictionByCin, getPredictionByCnotid } from '../../../service/predictionHistoryService';
import HistoriqueModal from '../HistoriqueModal';

function TaekwondoPerformance() {
    const { id } = useParams();
    const navigate = useNavigate();
    const predictionType = "Prédiction du performance pour la discipline taekwondo";
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
    const enumInjuryHistory = { Non: '2', Mineure: '0', Modérée: '1', Grave: '3' };

    const customSelectStyles = {
        control: (base) => ({
            ...base,
            height: 'calc(1.5em + 0.75rem + 2px)',
            minHeight: 'calc(1.5em + 0.75rem + 2px)',
        })
    };
    const createOptions = (enumObj) => Object.keys(enumObj).map(key => ({ label: key, value: enumObj[key] }));
    const injuryHistoryOptions = createOptions(enumInjuryHistory);
    const handleSelectChange = (field, option) => {
        validation.setFieldValue(field, option ? option.value : '');
    };
    
    // Initial values for the form
    const initialValues = {
        Sex: '',
        Age: '',
        Height: '',
        Weight: '',
        weightClass: '',
        pointsScored: '',
        techniquePoints: '',
        nutritionQualityScore: '',
        sleepHours: '',
        injuryHistory: ''
    };

    // Form validation using Yup
    const validation = useFormik({
        initialValues: initialValues,
        validationSchema: Yup.object().shape({
            Sex: Yup.string().required('Le sexe est obligatoire'),
            Age: Yup.number().required('L\'âge est obligatoire').positive().integer(),
            Height: Yup.number().required('La taille est obligatoire').positive(),
            Weight: Yup.number().required('Le poids est obligatoire').positive(),
            weightClass: Yup.string().required('La catégorie de poids est obligatoire'),
            pointsScored: Yup.number().required('Les points marqués sont obligatoires').positive().integer(),
            techniquePoints: Yup.number().required('Les points techniques sont obligatoires').positive().integer(),
            nutritionQualityScore: Yup.number().required('Le score de qualité nutritionnelle est obligatoire').min(1).max(10),
            sleepHours: Yup.number().required('Les heures de sommeil sont obligatoires').positive(),
            injuryHistory: Yup.number().required('L\'historique des blessures est obligatoire').oneOf([0, 1], 'Doit être 0 ou 1')
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                const data ={
                    Sex : values.Sex,
                    Age : values.Age,
                    Weight: values.Weight,
                    Height : values.Height,
                    "Weight Class": values.weightClass,
                    "Points Scored": values.pointsScored,
                    "Technique Points": values.techniquePoints,
                    "Nutrition Quality Score": values.nutritionQualityScore,
                    "Sleep Hours": values.sleepHours,
                    "Injury History": values.injuryHistory
                }
                const response = await taekwondoPerformPrediction(data);
                setResult(response.data.prediction); // Assuming prediction returns a numerical value
                const feature = response.data.important_features;
                // Define a mapping between the feature names and their French equivalents
                const featureMapping = {
                    "Sex": "Sexe",
                    "Age": "Âge",
                    "Height": "Taille (en mètres)",
                    "Weight": "Poids (en kg)",
                    "Weight Class": "Catégorie de Poids",
                    "Points Scored": "Points Marqués",
                    "Technique Points": "Points Techniques",
                    "Nutrition Quality Score": "Score de Qualité Nutritionnelle",
                    "Sleep Hours": "Heures de Sommeil",
                    "Injury History": "Antécédents de blessures"
                };

                // Initialize the importance object
                const importance = {};

                // Iterate through the features array and populate the importance object
                feature.forEach((featureObj) => {
                    const key = featureMapping[featureObj.feature]; // Get the French name
                    if (key) {
                        importance[key] = featureObj.contribution_percentage; // Add the entire feature object
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
                alert('Erreur lors de la soumission des données.');
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
                                                <h5 className="text-primary">Taekwondo</h5>
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
                                            <div className="mb-3">
                                                <Label className="form-label">Sexe</Label>
                                                <Input
                                                    name="Sex"
                                                    type="select"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.Sex || ""}
                                                    invalid={validation.touched.Sex && validation.errors.Sex}
                                                >
                                                    <option value="">Sélectionnez</option>
                                                    <option value="Male">Masculin</option>
                                                    <option value="Female">Féminin</option>
                                                </Input>
                                                <FormFeedback>{validation.errors.Sex}</FormFeedback>
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label">Âge</Label>
                                                <Input
                                                    name="Age"
                                                    className="form-control"
                                                    placeholder="Entrer l'âge"
                                                    type="number"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.Age || ""}
                                                    invalid={validation.touched.Age && validation.errors.Age ? true : false}
                                                />
                                                {validation.touched.Age && validation.errors.Age ? (
                                                    <FormFeedback type="invalid">{validation.errors.Age}</FormFeedback>
                                                ) : null}
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label">Taille (en mètres)</Label>
                                                <Input
                                                    name="Height"
                                                    className="form-control"
                                                    placeholder="Entrer la taille"
                                                    type="number"
                                                    step="0.01"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.Height || ""}
                                                    invalid={validation.touched.Height && validation.errors.Height ? true : false}
                                                />
                                                {validation.touched.Height && validation.errors.Height ? (
                                                    <FormFeedback type="invalid">{validation.errors.Height}</FormFeedback>
                                                ) : null}
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label">Poids (en kg)</Label>
                                                <Input
                                                    name="Weight"
                                                    className="form-control"
                                                    placeholder="Entrer le poids"
                                                    type="number"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.Weight || ""}
                                                    invalid={validation.touched.Weight && validation.errors.Weight ? true : false}
                                                />
                                                {validation.touched.Weight && validation.errors.Weight ? (
                                                    <FormFeedback type="invalid">{validation.errors.Weight}</FormFeedback>
                                                ) : null}
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label">Catégorie de Poids</Label>
                                                <Input
                                                    name="weightClass"
                                                    className="form-control"
                                                    placeholder="Entrer la catégorie de poids"
                                                    type="select"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.weightClass || ""}
                                                    invalid={validation.touched.weightClass && validation.errors.weightClass ? true : false}
                                                >
                                                    <option value="">Sélectionnez</option>
                                                    <option value="Flyweight">Poids mouche</option>
                                                    <option value="Featherweight">Poids plume</option>
                                                    <option value="Welterweight">Poids welter</option>
                                                    <option value="Middleweight">Poids moyen</option>
                                                    <option value="Heavyweight">Poids lourd</option>
                                                    <option value="Lightweight">Poids léger</option>
                                                    <option value="Super Heavyweight">Super poids lourd</option>
                                                    <option value="Super Lightweight">Super poids léger</option>
                                                    <option value="Cruiserweight">Poids lourd-léger</option>
                                                </Input>
                                                {validation.touched.weightClass && validation.errors.weightClass ? (
                                                    <FormFeedback type="invalid">{validation.errors.weightClass}</FormFeedback>
                                                ) : null}
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label">Points Marqués</Label>
                                                <Input
                                                    name="pointsScored"
                                                    className="form-control"
                                                    placeholder="Entrer les points marqués"
                                                    type="number"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.pointsScored || ""}
                                                    invalid={validation.touched.pointsScored && validation.errors.pointsScored ? true : false}
                                                />
                                                {validation.touched.pointsScored && validation.errors.pointsScored ? (
                                                    <FormFeedback type="invalid">{validation.errors.pointsScored}</FormFeedback>
                                                ) : null}
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label">Points Techniques</Label>
                                                <Input
                                                    name="techniquePoints"
                                                    className="form-control"
                                                    placeholder="Entrer les points techniques"
                                                    type="number"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.techniquePoints || ""}
                                                    invalid={validation.touched.techniquePoints && validation.errors.techniquePoints ? true : false}
                                                />
                                                {validation.touched.techniquePoints && validation.errors.techniquePoints ? (
                                                    <FormFeedback type="invalid">{validation.errors.techniquePoints}</FormFeedback>
                                                ) : null}
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label">Score de Qualité Nutritionnelle (1-10)</Label>
                                                <Input
                                                    name="nutritionQualityScore"
                                                    className="form-control"
                                                    placeholder="Entrer le score de qualité nutritionnelle"
                                                    type="number"
                                                    min="1"
                                                    max="10"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.nutritionQualityScore || ""}
                                                    invalid={validation.touched.nutritionQualityScore && validation.errors.nutritionQualityScore ? true : false}
                                                />
                                                {validation.touched.nutritionQualityScore && validation.errors.nutritionQualityScore ? (
                                                    <FormFeedback type="invalid">{validation.errors.nutritionQualityScore}</FormFeedback>
                                                ) : null}
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label">Antécédents de blessures</Label>
                                                <Select
                                                    name="injuryHistory"
                                                    options={injuryHistoryOptions}
                                                    styles={customSelectStyles}
                                                    className='text-dark'
                                                    onChange={(option) => handleSelectChange('injuryHistory', option)}
                                                    value={injuryHistoryOptions.find(option => option.value === validation.values.injuryHistory)}
                                                    isClearable
                                                />
                                                {validation.errors.injuryHistory && validation.touched.injuryHistory ? (
                                                    <FormFeedback type="invalid" className="d-block">
                                                        {validation.errors.injuryHistory}
                                                    </FormFeedback>
                                                ) : null}
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label">Heures de Sommeil</Label>
                                                <Input
                                                    name="sleepHours"
                                                    className="form-control"
                                                    placeholder="Entrer les heures de sommeil"
                                                    type="number"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.sleepHours || ""}
                                                    invalid={validation.touched.sleepHours && validation.errors.sleepHours ? true : false}
                                                />
                                                {validation.touched.sleepHours && validation.errors.sleepHours ? (
                                                    <FormFeedback type="invalid">{validation.errors.sleepHours}</FormFeedback>
                                                ) : null}
                                            </div>



                                            <div className="mt-4 d-grid">
                                                <button
                                                    className="btn btn-primary btn-block"
                                                    type="submit"
                                                >
                                                    Prédire
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

export default TaekwondoPerformance;
