import React, { useCallback, useEffect, useState } from 'react';
import Navbar_Page from '../../frontoffice/landing/Navbar/Navbar';
import { Card, CardBody, Badge, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormFeedback } from 'reactstrap';
import { attente, enCours, getBourses } from '../../service/bourseService';
import Footer from "../../frontoffice/landing/Footer/footer";
import { uploadFile } from '../../service/fileService';
import moment from 'moment';
import Dropzone from "react-dropzone";
import { Link } from 'react-router-dom';
import io from 'socket.io-client';


function BourseListFront() {
  const [bourses, setBourses] = useState([]);

  const [selectedBourse, setSelectedBourse] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFileType, setSelectedFileType] = useState('');
  const [federationId, setFederationId] = useState(null);
  const [fileDropError, setFileDropError] = useState(false);
  const [modal, setModal] = useState(false);
  const url = process.env.REACT_APP_BACKEND_URL;
  
  const toggle = () => setModal(!modal);


  const fetchBourses = async (federationId) => {
    const response = await getBourses(null, null, null, federationId);
    const data = response.data;
    
    setBourses(data);
  }

  useEffect(() => {
    const userString = localStorage.getItem('authUser');
    if (userString) {
      const user = JSON.parse(userString);
      const userId = user.user._id;
      setFederationId(userId);
      fetchBourses(userId);
    }
  }, []);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('authUser'))?.token;
    if (token) {
      const socket = io(`${url}`, {
        auth: { token },
        transports: ['websocket', 'polling']
      });
    // Handle new bourses
    socket.on('bourseAccepted', (bourse) => {
      
    });

    // Cleanup on unmount
    return () => {
      socket.off('bourseAccepted');
    };
  }}, []);

  const handleAcceptedFiles = useCallback((acceptedFiles) => {
    const files = acceptedFiles;
    
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  }, []);

  const handleDeleteFile = (fileToDelete) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((file) => file !== fileToDelete)
    );
  };

  const handleUpload = async (id) => {
    setModal(false);
      const formData = new FormData();
      formData.append('file', selectedFiles[0]);
      await uploadFile(formData, id, selectedFileType);
      fetchBourses(federationId)
  }


  return (
    <section className="offer-section mt-5">
      <div className='container mt-5'>
        {bourses.length === 0 && <h1>Vous n'avez aucune demande de bourse</h1>}
        {bourses.reverse().map((bourse, index) => (
    <Card className="mb-3 border-0 shadow-sm bg-dark text-white" key={index}>
    <CardBody>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h3 className="mb-0">{bourse.nature}</h3>
        <Badge 
          color={
            bourse.status === 'attente' ? 'warning' :
            bourse.status === 'En cours' ? 'info' :
            bourse.status === 'acceptee' ? 'success' :
            bourse.status === 'refusee' ? 'danger' : 'secondary'
          } 
          pill
          className="py-1 px-2"
        >
          {bourse.status.charAt(0).toUpperCase() + bourse.status.slice(1)}
        </Badge>
      </div>
      <p className="mb-2">{bourse.description}</p>
      <Row className="mb-2">
        <Col xs="12" sm="6">
          <p className="text-muted">Domaine: {bourse.domaine}</p>
        </Col>
        <Col xs="12" sm="6">
          <p className="text-muted">Groupe: {bourse.groupe}</p>
        </Col>
      </Row>
      <Row>
        <Col xs="12" sm="6">
          <p className="text-muted">Date: {moment(bourse.date).format('DD MMM YYYY')}</p>
        </Col>
        <Col xs="12" sm="6">
          {bourse.status === 'acceptee' && <p>Montant de financement: {bourse.montant} TND</p>}
        </Col>
      </Row>
      {bourse.status === 'acceptee' && (
              <Row className="mb-2">
              <Col xs="12" sm="6">
              {bourse?.rapportFinan === "" ? (
                              <Button
                              color="primary"
                              size="sm"
                              onClick={() =>{
                                toggle();
                                setSelectedFileType('Rapport Financier');
                                setSelectedBourse(bourse);
                                
                              }
                              }
                              >
                              Déposer le rapport Financier
                              </Button>
              ) : (
                <Button
                color="primary"
                size="sm"
                disabled={true}
                >
                le rapport Financier est déja déposé
                </Button>
              )}

              </Col>
              <Col xs="12" sm="6">
                {bourse?.rapportTech === "" ? (
                                  <Button
                                  color="primary"
                                  size="sm"
                                  onClick={() =>{
                                    toggle();
                                    setSelectedFileType('Rapport Technique');
                                    setSelectedBourse(bourse);
                                  }
                                  }
                                  >
                                  Déposer le rapport Technique
                                  </Button>
                                ) : (
                                  <Button
                                  color="primary"
                                  size="sm"
                                  disabled= {true}
                                  >
                                  le rapport Technique est déja déposé
                                  </Button>
                                )}
              </Col>
            </Row>
      )}

    </CardBody>
  </Card>
        ))
      }
      </div>
      <Modal isOpen={modal} toggle={toggle} >
          <ModalHeader toggle={toggle} >{selectedFileType}</ModalHeader>
          <ModalBody >
          <Dropzone
                  onDrop={(acceptedFiles) => {
                    if(selectedFiles.length == 0 ){
                    handleAcceptedFiles(acceptedFiles);
                    setFileDropError(false);
                    } else {
                      setFileDropError(true);
                    }
                  }
                }
                >
                  {({ getRootProps, getInputProps }) => (
                    <div className="dropzone">
                      <div
                        className="dz-message needsclick"
                        {...getRootProps()}
                      >
                        <input {...getInputProps()} />
                        <div className="dz-message needsclick">
                          <div className="mb-3">
                            <i className="display-4 text-muted bx bxs-cloud-upload" />
                          </div>
                          <h4>
                            Déposer le {selectedFileType} ici.
                          </h4>
                        </div>
                      </div>
                    </div>
                  )}
                </Dropzone>
                <div className="dropzone-previews mt-3" id="file-previews">
                  {selectedFiles.map((file, index) => (
                    <Card
                      className="dz-processing dz-image-preview dz-success dz-complete mb-0 mt-1 border shadow-none"
                      key={index + "-file"}
                    >
                      <div className="p-2">
                        <Row className="align-items-center">
                          <Col>
                            <Link
                              to="#"
                              className="text-muted font-weight-bold"
                            >
                              {file.name}
                            </Link>
                          </Col>
                          <Col className="col-auto">
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() => handleDeleteFile(file)}
                            >
                              <i className="mdi mdi-trash-can font-size-16 me-1" />
                              Retirer
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    </Card>
                  ))}
                </div>
                { fileDropError ? (<FormFeedback type="invalid" className="d-block">
                  Vous pouvez déposer un seul fichier
                 </FormFeedback>) : null}
          </ModalBody>
          <ModalFooter >
            <Button color="secondary" onClick={() => {
              toggle();
              handleUpload(selectedBourse._id);
              setSelectedFiles([]);
            }
            }>
              Déposer
            </Button>
          </ModalFooter>
        </Modal>
    </section>
  );
}

export default BourseListFront;
