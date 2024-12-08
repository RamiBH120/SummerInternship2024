import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { Link } from "react-router-dom";
import { useFormik } from 'formik';
import blessureIcon from "../../../assets/images/icon/blessure.png";
import axios from 'axios';
import { taekwondoInjuryPrediction } from '../../../service/aiService';
import { addPrediction, getPredictionByCin, getPredictionByCnotid } from '../../../service/predictionHistoryService';
import HistoriqueModal from '../HistoriqueModal';

function TaekwondoBlessure() {
    const { id } = useParams();
    const navigate = useNavigate();
    const predictionType = "Prédiction du blessure pour la discipline taekwondo";
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

    const initialValues = {
        nr_sessions: '',
        nr_rest_days: '',
        total_hours_training: '',
        max_hours_one_day: '',
        total_hours_high_intensity: '',
        nr_tough_sessions: '',
        nr_days_with_interval_session: '',
        total_hours_moderate_intensity: '',
        max_hours_moderate_intensity_one_day: '',
        max_hours_high_intensity_one_day: '',
        total_hours_alternative_training: '',
        nr_strength_trainings: '',
        avg_exertion: '',
        min_exertion: '',
        max_exertion: '',
        avg_training_success: '',
        min_training_success: '',
        max_training_success: '',
        avg_recovery: '',
        min_recovery: '',
        max_recovery: ''
    };

    const validation = useFormik({
        initialValues: initialValues,
        validationSchema: Yup.object().shape({
            nr_sessions: Yup.number()
                .required('Number of sessions is required')
                .min(1, 'Must be at least 1'),
            nr_rest_days: Yup.number()
                .required('Number of rest days is required')
                .min(0, 'Cannot be negative'),
            total_hours_training: Yup.number()
                .required('Total hours of training is required')
                .min(0, 'Cannot be negative'),
            max_hours_one_day: Yup.number()
                .required('Max hours in one day is required')
                .min(0, 'Cannot be negative'),
            total_hours_high_intensity: Yup.number()
                .required('Total hours of high intensity training is required')
                .min(0, 'Cannot be negative'),
            nr_tough_sessions: Yup.number()
                .required('Number of tough sessions is required')
                .min(0, 'Cannot be negative'),
            nr_days_with_interval_session: Yup.number()
                .required('Days with interval sessions is required')
                .min(0, 'Cannot be negative'),
            total_hours_moderate_intensity: Yup.number()
                .required('Total hours of moderate intensity training is required')
                .min(0, 'Cannot be negative'),
            max_hours_moderate_intensity_one_day: Yup.number()
                .required('Max hours of moderate intensity in one day is required')
                .min(0, 'Cannot be negative'),
            max_hours_high_intensity_one_day: Yup.number()
                .required('Max hours of high intensity in one day is required')
                .min(0, 'Cannot be negative'),
            total_hours_alternative_training: Yup.number()
                .required('Total hours of alternative training is required')
                .min(0, 'Cannot be negative'),
            nr_strength_trainings: Yup.number()
                .required('Number of strength training sessions is required')
                .min(0, 'Cannot be negative'),
            avg_exertion: Yup.number()
                .required('Average exertion is required')
                .min(0, 'Cannot be negative'),
            min_exertion: Yup.number()
                .required('Minimum exertion is required')
                .min(0, 'Cannot be negative'),
            max_exertion: Yup.number()
                .required('Maximum exertion is required')
                .min(0, 'Cannot be negative'),
            avg_training_success: Yup.number()
                .required('Average training success is required')
                .min(0, 'Cannot be negative'),
            min_training_success: Yup.number()
                .required('Minimum training success is required')
                .min(0, 'Cannot be negative'),
            max_training_success: Yup.number()
                .required('Maximum training success is required')
                .min(0, 'Cannot be negative'),
            avg_recovery: Yup.number()
                .required('Average recovery is required')
                .min(0, 'Cannot be negative'),
            min_recovery: Yup.number()
                .required('Minimum recovery is required')
                .min(0, 'Cannot be negative'),
            max_recovery: Yup.number()
                .required('Maximum recovery is required')
                .min(0, 'Cannot be negative'),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                const response = await taekwondoInjuryPrediction(values);
                setResult(response.data.prediction); // Assuming prediction returns a numerical value
                const feature = response.data.important_features;
                const importance = {
                    "Effort Moyen": feature.avg_exertion,
                    "Récupération Moyenne": feature.avg_recovery,
                    "Effort Maximum": feature.max_exertion,
                    "Max Heures d'Intensité Élevée en Une Journée": feature.max_hours_high_intensity_one_day,
                    "Max Heures d'Intensité Modérée en Une Journée": feature.max_hours_moderate_intensity_one_day,
                    "Maximum des heures en une journée": feature.max_hours_one_day,
                    "Récupération Maximum": feature.max_recovery,
                    "Succès d'Entraînement Maximum": feature.max_training_success,
                    "Effort Minimum": feature.min_exertion,
                    "Récupération Minimum": feature.min_recovery,
                    "Succès d'Entraînement Minimum": feature.min_training_success,
                    "Nombre de jours avec Séances d'Intervalle": feature.nr_days_with_interval_session,
                    "Nombre de jours de repos": feature.nr_rest_days,
                    "Nombre de Séances Difficiles": feature.nr_tough_sessions,
                    "Heures Totales d'Entraînement Alternatif": feature.total_hours_alternative_training,
                    "Heures Totales d'Entraînement de Intensité Modérée": feature.total_hours_moderate_intensity,
                    "Total des heures d'entraînement": feature.total_hours_training
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
                toggle();// Set prediction result from API response
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
                        <Col md={12}>
                            <Card className="overflow-hidden">
                                <div className="bg-primary bg-soft">
                                    <Row>
                                        <Col xs={7}>
                                            <div className="text-primary p-4">
                                                <h5 className="text-primary">Taekwondo</h5>
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
                                                <Label className="form-label">Total des heures d'entraînement</Label>
                                                <Input
                                                    name="total_hours_training"
                                                    className="form-control"
                                                    type="number"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.total_hours_training || ""}
                                                    invalid={
                                                        validation.touched.total_hours_training && validation.errors.total_hours_training
                                                            ? true
                                                            : false
                                                    }
                                                />
                                                {validation.touched.total_hours_training && validation.errors.total_hours_training ? (
                                                    <FormFeedback type="invalid">
                                                        {validation.errors.total_hours_training}
                                                    </FormFeedback>
                                                ) : null}
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label">Maximum des heures en une journée</Label>
                                                <Input
                                                    name="max_hours_one_day"
                                                    className="form-control"
                                                    type="number"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.max_hours_one_day || ""}
                                                    invalid={
                                                        validation.touched.max_hours_one_day && validation.errors.max_hours_one_day
                                                            ? true
                                                            : false
                                                    }
                                                />
                                                {validation.touched.max_hours_one_day && validation.errors.max_hours_one_day ? (
                                                    <FormFeedback type="invalid">
                                                        {validation.errors.max_hours_one_day}
                                                    </FormFeedback>
                                                ) : null}
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label">Heures Totales d'Entraînement de Haute Intensité</Label>
                                                <Input
                                                    name="total_hours_high_intensity"
                                                    className="form-control"
                                                    type="number"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.total_hours_high_intensity || ""}
                                                    invalid={
                                                        validation.touched.total_hours_high_intensity && validation.errors.total_hours_high_intensity
                                                            ? true
                                                            : false
                                                    }
                                                />
                                                {validation.touched.total_hours_high_intensity && validation.errors.total_hours_high_intensity ? (
                                                    <FormFeedback type="invalid">
                                                        {validation.errors.total_hours_high_intensity}
                                                    </FormFeedback>
                                                ) : null}
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label">Nombre de Séances Difficiles</Label>
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
                                                <Label className="form-label">Nombre de jours avec Séances d'Intervalle</Label>
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
                                                <Label className="form-label"> Heures Totales d'Entraînement de Intensité Modérée</Label>
                                                <Input
                                                    name="total_hours_moderate_intensity"
                                                    className="form-control"
                                                    type="number"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.total_hours_moderate_intensity || ""}
                                                    invalid={
                                                        validation.touched.total_hours_moderate_intensity && validation.errors.total_hours_moderate_intensity
                                                            ? true
                                                            : false
                                                    }
                                                />
                                                {validation.touched.total_hours_moderate_intensity && validation.errors.total_hours_moderate_intensity ? (
                                                    <FormFeedback type="invalid">
                                                        {validation.errors.total_hours_moderate_intensity}
                                                    </FormFeedback>
                                                ) : null}
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label">Max Heures d'Intensité Modérée en Une Journée</Label>
                                                <Input
                                                    name="max_hours_moderate_intensity_one_day"
                                                    className="form-control"
                                                    type="number"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.max_hours_moderate_intensity_one_day || ""}
                                                    invalid={
                                                        validation.touched.max_hours_moderate_intensity_one_day && validation.errors.max_hours_moderate_intensity_one_day
                                                            ? true
                                                            : false
                                                    }
                                                />
                                                {validation.touched.max_hours_moderate_intensity_one_day && validation.errors.max_hours_moderate_intensity_one_day ? (
                                                    <FormFeedback type="invalid">
                                                        {validation.errors.max_hours_moderate_intensity_one_day}
                                                    </FormFeedback>
                                                ) : null}
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label">Max Heures d'Intensité Élevée en Une Journée</Label>
                                                <Input
                                                    name="max_hours_high_intensity_one_day"
                                                    className="form-control"
                                                    type="number"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.max_hours_high_intensity_one_day || ""}
                                                    invalid={
                                                        validation.touched.max_hours_high_intensity_one_day && validation.errors.max_hours_high_intensity_one_day
                                                            ? true
                                                            : false
                                                    }
                                                />
                                                {validation.touched.max_hours_high_intensity_one_day && validation.errors.max_hours_high_intensity_one_day ? (
                                                    <FormFeedback type="invalid">
                                                        {validation.errors.max_hours_high_intensity_one_day}
                                                    </FormFeedback>
                                                ) : null}
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label">Heures Totales d'Entraînement Alternatif</Label>
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
                                                <Label className="form-label">Nombre de Séances d'Entraînement de Force</Label>
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
                                                <Label className="form-label">Effort Moyen ( 1 - 10 )</Label>
                                                <Input
                                                    name="avg_exertion"
                                                    className="form-control"
                                                    type="number"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.avg_exertion || ""}
                                                    invalid={
                                                        validation.touched.avg_exertion && validation.errors.avg_exertion
                                                            ? true
                                                            : false
                                                    }
                                                />
                                                {validation.touched.avg_exertion && validation.errors.avg_exertion ? (
                                                    <FormFeedback type="invalid">
                                                        {validation.errors.avg_exertion}
                                                    </FormFeedback>
                                                ) : null}
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label">Effort Minimum ( 1 - 10 )</Label>
                                                <Input
                                                    name="min_exertion"
                                                    className="form-control"
                                                    type="number"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.min_exertion || ""}
                                                    invalid={
                                                        validation.touched.min_exertion && validation.errors.min_exertion
                                                            ? true
                                                            : false
                                                    }
                                                />
                                                {validation.touched.min_exertion && validation.errors.min_exertion ? (
                                                    <FormFeedback type="invalid">
                                                        {validation.errors.min_exertion}
                                                    </FormFeedback>
                                                ) : null}
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label">Effort Maximum ( 1 - 10 )</Label>
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
                                                <Label className="form-label"> Succès d'Entraînement Moyen ( 1 - 10 )</Label>
                                                <Input
                                                    name="avg_training_success"
                                                    className="form-control"
                                                    type="number"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.avg_training_success || ""}
                                                    invalid={
                                                        validation.touched.avg_training_success && validation.errors.avg_training_success
                                                            ? true
                                                            : false
                                                    }
                                                />
                                                {validation.touched.avg_training_success && validation.errors.avg_training_success ? (
                                                    <FormFeedback type="invalid">
                                                        {validation.errors.avg_training_success}
                                                    </FormFeedback>
                                                ) : null}
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label">Succès d'Entraînement Minimum ( 1 - 10 )</Label>
                                                <Input
                                                    name="min_training_success"
                                                    className="form-control"
                                                    type="number"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.min_training_success || ""}
                                                    invalid={
                                                        validation.touched.min_training_success && validation.errors.min_training_success
                                                            ? true
                                                            : false
                                                    }
                                                />
                                                {validation.touched.min_training_success && validation.errors.min_training_success ? (
                                                    <FormFeedback type="invalid">
                                                        {validation.errors.min_training_success}
                                                    </FormFeedback>
                                                ) : null}
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label">Succès d'Entraînement Maximum ( 1 - 10 )</Label>
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
                                                <Label className="form-label">Récupération Moyenne ( 1 - 10 )</Label>
                                                <Input
                                                    name="avg_recovery"
                                                    className="form-control"
                                                    type="number"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.avg_recovery || ""}
                                                    invalid={
                                                        validation.touched.avg_recovery && validation.errors.avg_recovery
                                                            ? true
                                                            : false
                                                    }
                                                />
                                                {validation.touched.avg_recovery && validation.errors.avg_recovery ? (
                                                    <FormFeedback type="invalid">
                                                        {validation.errors.avg_recovery}
                                                    </FormFeedback>
                                                ) : null}
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label">Récupération Minimum ( 1 - 10 )</Label>
                                                <Input
                                                    name="min_recovery"
                                                    className="form-control"
                                                    type="number"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.min_recovery || ""}
                                                    invalid={
                                                        validation.touched.min_recovery && validation.errors.min_recovery
                                                            ? true
                                                            : false
                                                    }
                                                />
                                                {validation.touched.min_recovery && validation.errors.min_recovery ? (
                                                    <FormFeedback type="invalid">
                                                        {validation.errors.min_recovery}
                                                    </FormFeedback>
                                                ) : null}
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label">Récupération Maximum ( 1 - 10 )</Label>
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

export default TaekwondoBlessure;
