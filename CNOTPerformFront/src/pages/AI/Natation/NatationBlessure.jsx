import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import ReactApexChart from "react-apexcharts";
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
    Badge,
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
import Select from 'react-select';
import blessureIcon from "../../../assets/images/icon/blessure.png";
import { getRoleFName } from '../../../service/apiUser';
import DatePicker from "react-datepicker";
import { addBourse, editBourse, getBoursebyId } from '../../../service/bourseService';
import axios from 'axios';
import { natationInjuryPrediction } from '../../../service/aiService';
import { addPrediction, getPredictionByCin, getPredictionByCnotid } from '../../../service/predictionHistoryService';
import HistoriqueModal from '../HistoriqueModal';

function NatationBlessure() {
    const navigate = useNavigate();
    const predictionType = "Prédiction du blessure pour la discipline natation";
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
    // Initialisation des valeurs des champs pour les données d'entraînement
    const [initialValues, setInitialValues] = useState({
        nr_sessions: '',
        nr_rest_days: '',
        total_kms: '',
        max_km_one_day: '',
        total_km_Z3_Z4_Z5_T1_T2: '',
        nr_tough_sessions: '',
        nr_days_with_interval_session: '',
        total_km_Z3_4: '',
        max_km_Z3_4_one_day: '',
        total_km_Z5_T1_T2: '',
        max_km_Z5_T1_T2_one_day: '',
        total_hours_alternative_training: '',
        nr_strength_trainings: '',
        max_exertion: '',
        max_training_success: '',
        max_recovery: ''
    });

    // Validation avec Yup
    const validation = useFormik({
        initialValues: initialValues,

        onSubmit: async (values, { resetForm }) => {
            try {              
                                // Call the API
                                const response = await natationInjuryPrediction(values)
                                setResult(response.data.prediction); // Assuming prediction returns a numerical value
                                const feature = response.data.feature_importance;
                                const importance = {
                                    "Effort maximal": feature.max_exertion,
                                    "Maximum kilomètres en Z3 et Z4 en une journée": feature.max_km_Z3_4_one_day,
                                    "Maximum kilomètres en Z5, T1 et T2 en une journée": feature.max_km_Z5_T1_T2_one_day,
                                    "La distance maximale parcourue en une seule journée de course": feature.max_km_one_day,
                                    "Récupération maximale": feature.max_recovery,
                                    "Succès maximum de l'entraînement": feature.max_training_success,
                                    "Nombre de jours avec session d'intervalle": feature.nr_days_with_interval_session,
                                    "Nombre de jours de repos": feature.nr_rest_days,
                                    "Nombre de sessions": feature.nr_sessions,
                                    "Nombre d'entraînements de force": feature.nr_strength_trainings,
                                    "Nombre de sessions difficiles": feature.nr_tough_sessions,
                                    "Heures totales d'entraînement alternatif": feature.total_hours_alternative_training,
                                    "Kilomètres totaux en Z3 et Z4": feature.total_km_Z3_4,
                                    "Kilomètres totaux en Z3, Z4, Z5, T1, T2": feature.total_km_Z3_Z4_Z5_T1_T2,
                                    "Kilomètres totaux en Z5, T1 et T2": feature.total_km_Z5_T1_T2,
                                    "Kilomètres totaux": feature.total_kms
                                };
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
        <div className="glow-container">
          <div className="glow-circle left"></div>
          <div className="glow-circle right"></div>
        </div>
        <Container className='mt-5'>
                        <Row className="justify-content-center">
                            <Col md={12} lg={12} xl={12}>
                                <Card className="overflow-hidden">
                                    <div className="bg-primary bg-soft">
                                        <Row>
                                            <Col xs={7}>
                                                <div className="text-primary p-4">
                                                    <h5 className="text-primary">Natation</h5>
                                                    <p>Prédiction de blessure</p>
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
                                                            src={blessureIcon}
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
                                                    <Label className="form-label">Nombre de sessions</Label>
                                                    <Input
                                                        name="nr_sessions"
                                                        className="form-control"
                                                        type="number"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.nr_sessions || ""}
                                                        invalid={
                                                            validation.touched.nr_sessions && validation.errors.nr_sessions
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                    {validation.touched.nr_sessions && validation.errors.nr_sessions ? (
                                                        <FormFeedback type="invalid">
                                                            {validation.errors.nr_sessions}
                                                        </FormFeedback>
                                                    ) : null}
                                                </div>

 
                                                <div className="mb-3">
                                                    <Label className="form-label">Nombre de jours de repos</Label>
                                                    <Input
                                                        name="nr_rest_days"
                                                        className="form-control"
                                                        type="number"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.nr_rest_days || ""}
                                                        invalid={
                                                            validation.touched.nr_rest_days && validation.errors.nr_rest_days
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                    {validation.touched.nr_rest_days && validation.errors.nr_rest_days ? (
                                                        <FormFeedback type="invalid">
                                                            {validation.errors.nr_rest_days}
                                                        </FormFeedback>
                                                    ) : null}
                                                </div>

 
                                                <div className="mb-3">
                                                    <Label className="form-label">Kilomètres totaux</Label>
                                                    <Input
                                                        name="total_kms"
                                                        className="form-control"
                                                        type="number"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.total_kms || ""}
                                                        invalid={
                                                            validation.touched.total_kms && validation.errors.total_kms
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                    {validation.touched.total_kms && validation.errors.total_kms ? (
                                                        <FormFeedback type="invalid">
                                                            {validation.errors.total_kms}
                                                        </FormFeedback>
                                                    ) : null}
                                                </div>
 
                                                <div className="mb-3">
                                                    <Label className="form-label">La distance maximale parcourue en une seule journée de course</Label>
                                                    <Input
                                                        name="max_km_one_day"
                                                        className="form-control"
                                                        type="number"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.max_km_one_day || ""}
                                                        invalid={
                                                            validation.touched.max_km_one_day && validation.errors.max_km_one_day
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                    {validation.touched.max_km_one_day && validation.errors.max_km_one_day ? (
                                                        <FormFeedback type="invalid">
                                                            {validation.errors.max_km_one_day}
                                                        </FormFeedback>
                                                    ) : null}
                                                </div>

 
                                                <div className="mb-3">
                                                    <Label className="form-label">Kilomètres totaux en Z3, Z4, Z5, T1, T2</Label>
                                                    <Input
                                                        name="total_km_Z3_Z4_Z5_T1_T2"
                                                        className="form-control"
                                                        type="number"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.total_km_Z3_Z4_Z5_T1_T2 || ""}
                                                        invalid={
                                                            validation.touched.total_km_Z3_Z4_Z5_T1_T2 && validation.errors.total_km_Z3_Z4_Z5_T1_T2
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                    {validation.touched.total_km_Z3_Z4_Z5_T1_T2 && validation.errors.total_km_Z3_Z4_Z5_T1_T2 ? (
                                                        <FormFeedback type="invalid">
                                                            {validation.errors.total_km_Z3_Z4_Z5_T1_T2}
                                                        </FormFeedback>
                                                    ) : null}
                                                </div>

 
                                                <div className="mb-3">
                                                    <Label className="form-label">Nombre de sessions difficiles</Label>
                                                    <Input
                                                        name="nr_tough_sessions"
                                                        className="form-control"
                                                        type="number"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.nr_tough_sessions || ""}
                                                        invalid={
                                                            validation.touched.nr_tough_sessions && validation.errors.nr_tough_sessions
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                    {validation.touched.nr_tough_sessions && validation.errors.nr_tough_sessions ? (
                                                        <FormFeedback type="invalid">
                                                            {validation.errors.nr_tough_sessions}
                                                        </FormFeedback>
                                                    ) : null}
                                                </div>

 
                                                <div className="mb-3">
                                                    <Label className="form-label">Nombre de jours avec session d'intervalle</Label>
                                                    <Input
                                                        name="nr_days_with_interval_session"
                                                        className="form-control"
                                                        type="number"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.nr_days_with_interval_session || ""}
                                                        invalid={
                                                            validation.touched.nr_days_with_interval_session && validation.errors.nr_days_with_interval_session
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                    {validation.touched.nr_days_with_interval_session && validation.errors.nr_days_with_interval_session ? (
                                                        <FormFeedback type="invalid">
                                                            {validation.errors.nr_days_with_interval_session}
                                                        </FormFeedback>
                                                    ) : null}
                                                </div>

 
                                                <div className="mb-3">
                                                    <Label className="form-label">Kilomètres totaux en Z3 et Z4</Label>
                                                    <Input
                                                        name="total_km_Z3_4"
                                                        className="form-control"
                                                        type="number"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.total_km_Z3_4 || ""}
                                                        invalid={
                                                            validation.touched.total_km_Z3_4 && validation.errors.total_km_Z3_4
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                    {validation.touched.total_km_Z3_4 && validation.errors.total_km_Z3_4 ? (
                                                        <FormFeedback type="invalid">
                                                            {validation.errors.total_km_Z3_4}
                                                        </FormFeedback>
                                                    ) : null}
                                                </div>

 
                                                <div className="mb-3">
                                                    <Label className="form-label">Maximum kilomètres en Z3 et Z4 en une journée</Label>
                                                    <Input
                                                        name="max_km_Z3_4_one_day"
                                                        className="form-control"
                                                        type="number"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.max_km_Z3_4_one_day || ""}
                                                        invalid={
                                                            validation.touched.max_km_Z3_4_one_day && validation.errors.max_km_Z3_4_one_day
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                    {validation.touched.max_km_Z3_4_one_day && validation.errors.max_km_Z3_4_one_day ? (
                                                        <FormFeedback type="invalid">
                                                            {validation.errors.max_km_Z3_4_one_day}
                                                        </FormFeedback>
                                                    ) : null}
                                                </div>

 
                                                <div className="mb-3">
                                                    <Label className="form-label">Kilomètres totaux en Z5, T1 et T2</Label>
                                                    <Input
                                                        name="total_km_Z5_T1_T2"
                                                        className="form-control"
                                                        type="number"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.total_km_Z5_T1_T2 || ""}
                                                        invalid={
                                                            validation.touched.total_km_Z5_T1_T2 && validation.errors.total_km_Z5_T1_T2
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                    {validation.touched.total_km_Z5_T1_T2 && validation.errors.total_km_Z5_T1_T2 ? (
                                                        <FormFeedback type="invalid">
                                                            {validation.errors.total_km_Z5_T1_T2}
                                                        </FormFeedback>
                                                    ) : null}
                                                </div>

 
                                                <div className="mb-3">
                                                    <Label className="form-label">Maximum kilomètres en Z5, T1 et T2 en une journée</Label>
                                                    <Input
                                                        name="max_km_Z5_T1_T2_one_day"
                                                        className="form-control"
                                                        type="number"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.max_km_Z5_T1_T2_one_day || ""}
                                                        invalid={
                                                            validation.touched.max_km_Z5_T1_T2_one_day && validation.errors.max_km_Z5_T1_T2_one_day
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                    {validation.touched.max_km_Z5_T1_T2_one_day && validation.errors.max_km_Z5_T1_T2_one_day ? (
                                                        <FormFeedback type="invalid">
                                                            {validation.errors.max_km_Z5_T1_T2_one_day}
                                                        </FormFeedback>
                                                    ) : null}
                                                </div>

 
                                                <div className="mb-3">
                                                    <Label className="form-label">Heures totales d'entraînement alternatif</Label>
                                                    <Input
                                                        name="total_hours_alternative_training"
                                                        className="form-control"
                                                        type="number"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.total_hours_alternative_training || ""}
                                                        invalid={
                                                            validation.touched.total_hours_alternative_training && validation.errors.total_hours_alternative_training
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                    {validation.touched.total_hours_alternative_training && validation.errors.total_hours_alternative_training ? (
                                                        <FormFeedback type="invalid">
                                                            {validation.errors.total_hours_alternative_training}
                                                        </FormFeedback>
                                                    ) : null}
                                                </div>

 
                                                <div className="mb-3">
                                                    <Label className="form-label">Nombre d'entraînements de force</Label>
                                                    <Input
                                                        name="nr_strength_trainings"
                                                        className="form-control"
                                                        type="number"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.nr_strength_trainings || ""}
                                                        invalid={
                                                            validation.touched.nr_strength_trainings && validation.errors.nr_strength_trainings
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                    {validation.touched.nr_strength_trainings && validation.errors.nr_strength_trainings ? (
                                                        <FormFeedback type="invalid">
                                                            {validation.errors.nr_strength_trainings}
                                                        </FormFeedback>
                                                    ) : null}
                                                </div>

 
                                                <div className="mb-3">
                                                    <Label className="form-label">Effort maximal</Label>
                                                    <Input
                                                        name="max_exertion"
                                                        className="form-control"
                                                        type="number"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.max_exertion || ""}
                                                        invalid={
                                                            validation.touched.max_exertion && validation.errors.max_exertion
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                    {validation.touched.max_exertion && validation.errors.max_exertion ? (
                                                        <FormFeedback type="invalid">
                                                            {validation.errors.max_exertion}
                                                        </FormFeedback>
                                                    ) : null}
                                                </div>

 
                                                <div className="mb-3">
                                                    <Label className="form-label">Succès maximum de l'entraînement</Label>
                                                    <Input
                                                        name="max_training_success"
                                                        className="form-control"
                                                        type="number"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.max_training_success || ""}
                                                        invalid={
                                                            validation.touched.max_training_success && validation.errors.max_training_success
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                    {validation.touched.max_training_success && validation.errors.max_training_success ? (
                                                        <FormFeedback type="invalid">
                                                            {validation.errors.max_training_success}
                                                        </FormFeedback>
                                                    ) : null}
                                                </div>

 
                                                <div className="mb-3">
                                                    <Label className="form-label">Récupération maximale</Label>
                                                    <Input
                                                        name="max_recovery"
                                                        className="form-control"
                                                        type="number"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.max_recovery || ""}
                                                        invalid={
                                                            validation.touched.max_recovery && validation.errors.max_recovery
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                    {validation.touched.max_recovery && validation.errors.max_recovery ? (
                                                        <FormFeedback type="invalid">
                                                            {validation.errors.max_recovery}
                                                        </FormFeedback>
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
              src="https://lottie.host/embed/edac2dcd-33b9-4c08-b15a-56b68004a0d3/g6YcIsXoZ7.json" 
              className="mx-auto mb-4" 
              style={{ width: '300px', height: '300px', border: 'none' }}
              title="Animation"
            ></iframe>
            <div className="alert alert-success rounded-3 shadow-sm">
              <h4 className="alert-heading">Aucun risque de blessure détecté</h4>
              <p className="mb-0">Continuez à vous entraîner en toute sécurité.</p>
            </div>
          </div>
           ) 
          : (<div className="text-center p-4">
            <iframe 
              src="https://lottie.host/embed/2f874dbb-6e8c-4c7e-b955-9b88be39f7af/ziS3nsTvG8.json" 
              className="mx-auto mb-4" 
              style={{ width: '300px', height: '300px', border: 'none' }}
              title="Animation"
            ></iframe>
            <div className="alert alert-danger rounded-3 shadow-sm">
              <h4 className="alert-heading">Attention, une blessure est probable</h4>
              <p className="mb-0">Prenez les précautions nécessaires.</p>
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

export default NatationBlessure