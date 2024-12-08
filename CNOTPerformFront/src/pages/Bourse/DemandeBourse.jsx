import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
    Badge,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import Select from 'react-select';
import bourseIcon from "../../assets/images/icon/bourse.png";
import { addBourse, editBourse, getBoursebyId } from '../../service/bourseService';
import { getRoleFName } from '../../service/apiUser';
import DatePicker from "react-datepicker";

function DemandeBourse() {
    const { id } = useParams();
    const [selectedDomaine, setSelectedDomaine] = useState('');
    const [selectedGroupe, setSelectedGroupe] = useState('');
    const [bourse, setBourse] = useState(null);
    const [bourseDate, setBourseDate] = useState(new Date());
    const [federationId, setFederationId] = useState(null);
    const [initialValues, setInitialValues] = useState({
        nature: '',
        federation: '',
        domaine: '',
        groupe: '',
        date: new Date(),
        budgetPrev: 0,
        description: ''
    })

    const enumGroupes = {
        "Universalité des jeux Olympiques": 'universalite',
        "Entourage": 'entourage',
        "Développement du sport": 'developpement',
        "Valeurs Olympiques": 'valeurs',
        "Gestion des CNO et partage de connaissances": 'capciteadministration',
    };

    const enumDomaines = {
        "Athlètes et développement du Sport": 'developpement',
        "Valeurs": 'valeurs',
        "Développement des capacités et administration": 'capciteadministration',
    };

    const navigate = useNavigate();

    const domaineOptions = Object.keys(enumDomaines).map(key => ({
        label: key,
        value: enumDomaines[key],
    }));

    const groupeOptions = Object.keys(enumGroupes).map(key => ({
        label: key,
        value: enumGroupes[key],  // Corrected from enumDomaines to enumGroupes
    }));

    const customStyles = {
        control: (base, state) => ({
            ...base,
            borderColor: state.isFocused ? '#2684FF' : state.selectProps.error ? '#dc3545' : base.borderColor,
            '&:hover': {
                borderColor: state.isFocused ? '#2684FF' : state.selectProps.error ? '#dc3545' : base.borderColor
            }
        })
    };

    const customSelectStyles = {
        control: (base) => ({
            ...base,
            height: 'calc(1.5em + 0.75rem + 2px)',
            minHeight: 'calc(1.5em + 0.75rem + 2px)',
        })
    };

    const handleDomaineChange = (selectedOption) => {
      setSelectedDomaine(selectedOption ? selectedOption.value : "");
      validation.setFieldValue("domaine", selectedOption ? selectedOption.value : "");
  };
  
    const handleGroupeChange = (selectedOption) => {
      setSelectedGroupe(selectedOption ? selectedOption.value : "");
      validation.setFieldValue("groupe", selectedOption ? selectedOption.value : "");
  };

  const onDateChange = (date) => {
    setBourseDate(date);
  };

    const validation = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            nature: Yup.string()
                .required('La nature est obligatoire')
                .min(2, 'Le nature doit comporter au moins 2 caractères'),
            budgetPrev: Yup.number()
                .required('Le budget prévisionnel est obligatoire')
                .min(1, 'Le budget prévisionnel doit être supérieur à 0'),
            domaine: Yup.string()
                .required('Le domaine est obligatoire'),
            groupe: Yup.string()
                .required('Le groupe est obligatoire'),
        }),
        onSubmit: async (values) => {
            try {              
                values.date = bourseDate;
                values.federation = federationId;

                // Submit your form data here, e.g., using an API call
                if(id){
                await editBourse(id,values)
                } else {
                await addBourse(values);
                }
                // Swal.fire('Succès!', 'La bourse est ajoutée avec succès.', 'success');
                navigate('/mybourses');
            } catch (error) {
                console.error('Submission error:', error);
            }
        }
    });

    const fetchBourseById = async (id) => {
        const response = await getBoursebyId(id);
        const bourse = response.data;
        
            setInitialValues({
                nature: bourse.nature,
                budgetPrev: bourse.budgetPrev,
                federation: bourse.Federation_Conserne,
                domaine: enumDomaines[bourse.domaine],
                groupe: enumGroupes[bourse.groupe],
                date:bourse.date,
                description: bourse.description
            });
    }

    useEffect(() => {
        if(id){
        fetchBourseById(id);
        }
        const userString = localStorage.getItem('authUser');
        if (userString) {
          const user = JSON.parse(userString);
          const userId = user.user._id;
          setFederationId(userId);
        }
    }, [id]);

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
                                                    <h5 className="text-primary">Bourse</h5>
                                                    <p>Ajouter une bourse</p>
                                                </div>
                                            </Col>
                                            <Col className="col-5 align-self-end">
                                                <img alt="" className="img-fluid" />
                                            </Col>
                                        </Row>
                                    </div>
                                    <CardBody className="pt-0">
                                        <div>
                                            <Link to="/" className="auth-logo-light">
                                                <div className="avatar-md profile-user-wid mb-4">
                                                    <span className="avatar-title rounded-circle bg-light">
                                                        <img
                                                            src={bourseIcon}
                                                            alt=""
                                                            className=""
                                                            height="35"
                                                            width="35"
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

                                                <div className="mb-3">
                                                    <Label className="form-label">Nature</Label>
                                                    <Input
                                                        name="nature"
                                                        className="form-control"
                                                        placeholder="Entrer la nature"
                                                        type="text"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.nature || ""}
                                                        invalid={
                                                            validation.touched.nature && validation.errors.nature
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                    {validation.touched.nature && validation.errors.nature ? (
                                                        <FormFeedback type="invalid">
                                                            {validation.errors.nature}
                                                        </FormFeedback>
                                                    ) : null}
                                                </div>

                                                <div className="mb-3">
                                                    <Label className="form-label">Budget prévisionnel</Label>
                                                    <Input
                                                        name="budgetPrev"
                                                        value={validation.values.budgetPrev}
                                                        type="number"
                                                        placeholder="Entrer le budget prévisionnel"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        invalid={
                                                            validation.touched.budgetPrev &&
                                                            validation.errors.budgetPrev
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                    {validation.touched.budgetPrev && validation.errors.budgetPrev ? (
                                                        <FormFeedback type="invalid">
                                                            {validation.errors.budgetPrev}
                                                        </FormFeedback>
                                                    ) : null}
                                                </div>

                                        <div className="mb-3">
                                            <Label className="form-label">Domaine</Label>
                                            <Select
                                                name="domaine"
                                                options={domaineOptions}
                                                styles={{ ...customStyles, ...customSelectStyles }}
                                                onChange={handleDomaineChange}
                                                onBlur={validation.handleBlur}
                                                className='text-dark'
                                                value={domaineOptions.find(option => option.value === validation.values.domaine)}
                                                isClearable
                                                error={validation.touched.domaine && validation.errors.domaine}
                                            />
                                            {validation.touched.domaine && validation.errors.domaine ? (
                                                <FormFeedback type="invalid" className="d-block">
                                                    {validation.errors.domaine}
                                                </FormFeedback>
                                            ) : null}
                                        </div>

                                                <div className="mb-3">
                                                    <Label className="form-label">Groupe</Label>
                                                    <Select
                                                        name="groupe"
                                                        options={groupeOptions}
                                                        styles={{ ...customStyles, ...customSelectStyles }}
                                                        onChange={handleGroupeChange}
                                                        onBlur={validation.handleBlur}
                                                        className='text-dark'
                                                        value={groupeOptions.find(option => option.value === validation.values.groupe)}
                                                        isClearable
                                                        error={validation.touched.groupe && validation.errors.groupe}
                                                    />
                                                    {validation.touched.groupe && validation.errors.groupe ? (
                                                        <FormFeedback type="invalid" className="d-block">
                                                            {validation.errors.groupe}
                                                        </FormFeedback>
                                                    ) : null}
                                                </div>

                                                <div className="mb-3">
                                                    <Label className="form-label">Date</Label>
                                                    <DatePicker
                                                        id="date"
                                                        name="date"
                                                        className="form-control"
                                                        selected={bourseDate}
                                                        onChange={onDateChange}
                                                    />
                                                    {bourseDate < new Date().setHours(0, 0, 0, 0) ? (
                                                        <FormFeedback type="invalid" className="d-block">
                                                            La date doit être une date future
                                                        </FormFeedback>
                                                    ) : null}

                                                </div>

                                                <div className="mb-3">
                                                    <Label className="form-label">Description</Label>
                                                    <Input
                                                        name="description"
                                                        type="textarea"
                                                        placeholder="Entrez la description"
                                                        rows="4"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.description || ""}
                                                        invalid={
                                                            validation.touched.description && validation.errors.description
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                    {validation.touched.description && validation.errors.description ? (
                                                        <FormFeedback type="invalid">
                                                            {validation.errors.description}
                                                        </FormFeedback>
                                                    ) : null}
                                                </div>

                                                <div className="mt-4 d-grid">
                                                    <button
                                                        className="btn btn-primary btn-block"
                                                        type="submit"
                                                    >
                                                       Envoyer 
                                                    </button>
                                                </div>
                                            </Form>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
        </Container>
        </section>
    </React.Fragment>
    );
}

export default DemandeBourse;
