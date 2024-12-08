import React, { useEffect, useState } from 'react';
import {
  Badge, Button, Card, CardBody, Col, DropdownItem,
  DropdownMenu, DropdownToggle, Modal, ModalBody, ModalFooter, ModalHeader, Nav, NavItem, NavLink, UncontrolledDropdown, UncontrolledTooltip
} from 'reactstrap';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import bourseIcon from "../../assets/images/icon/bourse.png";
import { acceptee, refusee } from '../../service/bourseService';
import ModalMontantAccorde from './modalMontantAccorde';
import univ from "../../assets/images/icon/univolymp.png";
import developpement from "../../assets/images/icon/devsport.png";
import valeur from "../../assets/images/icon/valeursolymp.png";
import admin from "../../assets/images/icon/administration.png";
import entourage from "../../assets/images/icon/entourage.png";
import cnot from "../../../public/assets/images/logo/CNOT_icon.png"
import { getUserData } from '../../service/apiUser';
import SommeModal from './SommeModal';

pdfMake.vfs = pdfFonts.pdfMake.vfs;


function BourseCard({ bourses, fetchBourses }) {
  const url = process.env.REACT_APP_BACKEND_URL;
  const descriptions = {
    "Universalité des Jeux Olympiques": "soutenir des athlètes et équipes d’élite",
    "Développement du Sport": "promotion du développement du sport, de la relève à l’élit",
    "Valeurs Olympiques": "promouvoir le sport pour tous, ainsi que les valeurs et principes fondamentaux de l’Olympisme dans le domaine du sport et de l’éducation",
    "Gestion des CNO et partage de connaissances": "développer et maintenir des structures administratives solides et durables",
    "Entourage": "bénéficier du soutien de personnes sensibilisées à des sujets clés tels que la protection des athlètes intègres et la lutte contre le dopage, la discrimination, le harcèlement et la manipulation des compétitions.",
  };

  const [modal, setModal] = useState(false);
  const [modalMontant, setModalMontant] = useState(false);
  const [modalSomme, setModalSomme] = useState(false);
  const [selectedBourse, setSelectedBourse] = useState(null);
  const [showRapportFinan, setShowRapportFinan] = useState(true);
  const [showRapportTech, setShowRapportTech] = useState(false);
  const [activeTab, setActiveTab] = useState('rapportFinan');
  const [base64Image, setBase64Image] = useState('');


  const toggle = () => {
    setModal(!modal);
  };
  const toggleMontant = () => setModalMontant(!modalMontant);
  const toggleSomme = () => setModalSomme(!modalSomme);

  function convertToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  
  useEffect(() => {
    fetch(cnot)
      .then(response => response.blob())
      .then(blob => convertToBase64(blob))
      .then(base64 => setBase64Image(base64))
      .catch(error => console.error('Error converting image:', error));
  }, []);

  const generateBoursePDF = (nature, budgetPrev, montant, federation, domaine, groupe) => {
    
    const docDefinition = {
      content: [
        {
          columns: [
            {
              image: 'comiteLogo', // placeholder for the logo, you need to load this as a base64 image
              width: 100,
              alignment: 'left'
            },
            {
              text: 'Demande de Bourse',
              style: 'header',
              alignment: 'right',
              margin: [0, 20, 0, 0] // adjust margin to align with the logo
            }
          ]
        },
        {
          text: 'Monsieur le Président,',
          style: 'subheader',
          margin: [0, 20, 0, 0]
        },
        {
          text: `Objet : Demande de Financement au titre de "${nature}" `,
          margin: [0, 20, 0, 20]
        },
        {
          text: `Dans le cadre de notre engagement continu pour le développement du sport et le soutien aux athlètes, nous, la Fédération ${federation.name}, avons l\'honneur de vous soumettre une demande de financement relative à un projet clé intitulé ${nature}. Ce projet s’inscrit dans notre objectif stratégique visant à ${descriptions[groupe]}`,
          margin: [0, 0, 0, 20]
        },
        {
          text: 'Détails du Projet :',
          style: 'subheader',
          margin: [0, 0, 0, 10]
        },
        {
          table: {
            body: [
              ['Nature du projet', nature],
              ['Domaine', domaine],
              ['Groupe', groupe],
              ['Budget Prévisionnel', `${budgetPrev} TND`],
              ['Montant de financement', `${montant} TND`],
            ]
          },
          margin: [0, 0, 0, 20]
        },
        {
          text: 'Nous tenons à vous remercier pour l\'attention que vous porterez à cette demande. Nous restons à votre entière disposition pour toute information complémentaire.',
          margin: [0, 0, 0, 20]
        },
        {
          text: 'Veuillez agréer, Monsieur le Président, l’expression de notre considération distinguée.',
          margin: [0, 0, 0, 40]
        },
        {
          text: federation.name,
          style: 'subheader',
        },
        {
          columns: [
            { text: '' }, // empty space for alignment
            { text: 'Cachet', alignment: 'right' }
          ]
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true
        },
        subheader: {
          fontSize: 14,
          bold: true
        }
      },
      images: {
        comiteLogo: base64Image, // Replace with the actual Base64 image data of the logo
      }
    };
  
    pdfMake.createPdf(docDefinition).download('demande_bourse.pdf');
  };

  return (
    <React.Fragment>
      {bourses.reverse().map((bourse, key) => (
        <Col xl="5" sm="6" key={key} className='mx-4'>
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between align-items-start">
                <div className="d-flex">
                  <div className="avatar-md me-4">
                    <span className="avatar-title rounded-circle text-danger font-size-16 bg-light">
                      <img src={bourse?.groupe === 'Universalité des jeux Olympiques' ? univ :
                         bourse?.groupe === 'Entourage' ? entourage :
                         bourse?.groupe === 'Universalité des jeux Olympiques' ? univ :
                         bourse?.groupe === 'Développement du sport' ? developpement :
                         bourse?.groupe === 'Valeurs Olympiques' ? valeur :
                         admin
                         }
                         style={{
                          backgroundColor: 
                            bourse?.groupe === 'Universalité des jeux Olympiques' ? '#0369a1' :
                            bourse?.groupe === 'Entourage' ? '#16a34a' :
                            bourse?.groupe === 'Développement du sport' ? '#fcd34d' :
                            bourse?.groupe === 'Valeurs Olympiques' ? '#dc2626' :
                            '#292524',
                          borderRadius: bourse?.groupe === 'Entourage' ? '50%' : '0',
                          padding: bourse?.groupe === 'Valeurs Olympiques' ? '10px' : '5px'
                        }}
                          alt="" />
                    </span>
                  </div>

                  <div className="flex-grow-1 overflow-hidden">
                    <h5 className="text-truncate font-size-15">
                      {bourse?.nature}
                    </h5>
                    <p className="text-muted mb-4">{bourse?.description}</p>

                    <Badge className="font-size-11 m-1" color="primary">
                      {bourse?.domaine}
                    </Badge>
                    <Badge
                      className="font-size-11 m-1"
                      color={
                        bourse.groupe === 'Universalité des jeux Olympiques' ? 'primary' :
                          bourse.groupe === 'Développement du sport' ? 'info' :
                            bourse.groupe === 'Entourage' ? 'success' :
                              bourse.groupe === 'Valeurs olympiques' ? 'danger' : 'secondary'
                      }>
                      {bourse?.groupe}
                    </Badge>
                  </div>
                </div>

                <UncontrolledDropdown className="ms-3">
                  <DropdownToggle className="card-drop" tag="a">
                    <i className="mdi mdi-dots-horizontal font-size-18" />
                  </DropdownToggle>
                  <DropdownMenu end className="dropdown-menu-end">
                    <DropdownItem onClick={() => generateBoursePDF(bourse.nature, bourse.budgetPrev, bourse.montant, bourse.Federation_Conserne, bourse.domaine, bourse.groupe)}>
                      <i className='bx bx-download font-size-16 me-1'></i> Télécharger
                    </DropdownItem>
                    <DropdownItem onClick={() => {
                      toggle();
                      setSelectedBourse(bourse);
                    }}>
                      <i className='bx bx-file-find font-size-16 me-1'></i> Afficher les rapports
                    </DropdownItem>
                    <DropdownItem onClick={() => {
                      toggleSomme();
                      setSelectedBourse(bourse);
                    }}>
                      <i className='bx bx-wallet font-size-16 me-1'></i> Sommes déja accordées
                    </DropdownItem>
                    {bourse.status === "attente" && (
                      <>
                    <DropdownItem onClick={async () => {
                      toggleMontant();
                      setSelectedBourse(bourse);
                    }}>
                      <i className='bx bx-check-circle font-size-16 me-1 text-success' ></i> Accepter
                    </DropdownItem>
                    </>)}
                    {bourse.status === "attente" && (
                      <>
                    <DropdownItem onClick={async () => await refusee(bourse._id)}>
                      <i className='bx bx-x-circle font-size-16 me-1 text-danger' ></i> Refuser
                    </DropdownItem>
                    </>)}
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
            </CardBody>

            <div className="border-top px-4 py-3">
              <ul className="list-inline mb-0">
                <li className="list-inline-item me-3">
                  <Badge
                    color={
                      bourse.status === 'attente' ? 'warning' :
                        bourse.status === 'En cours' ? 'info' :
                          bourse.status === 'acceptee' ? 'success' :
                            bourse.status === 'refusee' ? 'danger' : 'secondary'
                    }>
                    {bourse.status}
                  </Badge>
                </li>
                <li className="list-inline-item my-1 me-3" id="initDate">
                  <i className="bx bx-user me-1" /> {bourse?.Federation_Conserne.name}
                  <UncontrolledTooltip placement="top" target="initDate">
                    Fédération
                  </UncontrolledTooltip>
                </li>
                <li className="list-inline-item my-1 me-3" id="dueDate">
                  <i className="bx bx-calendar me-1" /> {bourse?.date.substring(0, 10)}
                  <UncontrolledTooltip placement="top" target="dueDate">
                    Date
                  </UncontrolledTooltip>
                </li>
                <li className="list-inline-item mt-1 me-3" id="comments">
                  <i className="bx bx-money me-1" /> {bourse.budgetPrev} TND
                  <UncontrolledTooltip placement="top" target="comments">
                    Budget Prévisionnel
                  </UncontrolledTooltip>
                </li>
              </ul>
            </div>
          </Card>
        </Col>
      ))}
      <Modal isOpen={modal} toggle={toggle} size="xl" >
        <ModalHeader toggle={toggle}>Les rapports</ModalHeader>
        <ModalBody>
        <Nav
          fill
          pills
          className='my-3'
        >
          <NavItem onClick={() => {
            setShowRapportFinan(true);
            setShowRapportTech(false);
            setActiveTab('rapportFinan');
          }}>
            <NavLink
              active={activeTab === 'rapportFinan'}
              href="#"
            >
              Rapport Financier
            </NavLink>
          </NavItem>
          <NavItem onClick={() => {
            setShowRapportFinan(false);
            setShowRapportTech(true);
            setActiveTab('rapportTech');
          }}>
            <NavLink href="#" active={activeTab === 'rapportTech'}>
              Rapport Technique
            </NavLink>
          </NavItem>
        </Nav>
        {showRapportTech &&(
          <>
          <h1 className='my-2'>Rapport Technique</h1>
          {selectedBourse?.rapportTech === "" && <h4>Le rapport n'a pas encore été déposé</h4>}
          <object data={`${url}/${selectedBourse?.rapportTech.replace(/\\/g, '/')}`} type="application/pdf" width="100%" height="400px">
          </object>
          </>
        )}
        {showRapportFinan &&(
          <>  
          <h1 className='my-2'>Rapport Financier</h1>
          {selectedBourse?.rapportFinan === "" && <h4>Le rapport n'a pas encore été déposé</h4>}
          <object data={`${url}/${selectedBourse?.rapportFinan.replace(/\\/g, '/')}`} type="application/pdf" width="100%" height="400px">
          </object>
          
          </>
        )
        }
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <ModalMontantAccorde modal={modalMontant} toggle={toggleMontant} id={selectedBourse?._id}/>
      <SommeModal modal={modalSomme} toggle={toggleSomme} federation={selectedBourse?.Federation_Conserne._id} nomFederation={selectedBourse?.Federation_Conserne.name} />
    </React.Fragment>
  );
}

export default BourseCard;
