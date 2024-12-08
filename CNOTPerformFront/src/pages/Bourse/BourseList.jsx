import React, { useEffect, useState } from 'react'
import Breadcrumbs from "/src/components/Common/Breadcrumb";
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Table, Container, Row, Col, PaginationItem, PaginationLink, Label, Input, } from 'reactstrap';
import { acceptee, deleteBourse, getBourses, refusee } from '../../service/bourseService';
import BourseCard from './BourseCard';
import ModalMontantAccorde from './modalMontantAccorde';
import { getRoleFName } from '../../service/apiUser';
import io from 'socket.io-client';

function BourseList() {
    const [bourses, setBourses] = useState([]);
    const [federationsList, setFederationsList] = useState([]);
    const [federationFilter, setFederationFilter] = useState(null);
    const [domaineFilter, setDomaineFilter] = useState(null);
    const [groupeFilter, setGroupeFilter] = useState(null);
    const [statusFilter, setStatusFilter] = useState(null);
    const url = process.env.REACT_APP_BACKEND_URL;
    const [page, setPage] = useState(1);

    const fetchBourses = async (page) =>{
      
      const response = await getBourses(page);
      
      setBourses(response.data);
    };

    const filterBourses = async (page, groupe, domaine, federation, status) =>{
      
      const response = await getBourses(page, groupe, domaine, federation, status);
      
      setBourses(response.data);
    };

    const fetchFederations = async () => {
      const response = await getRoleFName();
      const list = response.users.map(federation => ({
          label: federation.name,
          value: federation._id,
      })); 
      
      setFederationsList(list);     
  }

    useEffect(() =>{
        fetchBourses(page);
        fetchFederations();
    },[])

   useEffect(() =>{
    if(groupeFilter === 'Groupe'){
      setGroupeFilter(null)
    }
    if(domaineFilter === 'Domaine'){
      setDomaineFilter(null)
    }
    if(federationFilter === 'Federation'){
      
      setFederationFilter(null)
    }
    if(statusFilter === 'Status'){
      setStatusFilter(null)
    }
    filterBourses(page, groupeFilter, domaineFilter, federationFilter, statusFilter);
   },[federationFilter, groupeFilter, domaineFilter, statusFilter]);

   useEffect(() =>{
    fetchBourses(page)
    },[page])

    useEffect(() => {
      const token = JSON.parse(localStorage.getItem('authUser'))?.token;
      if (token) {
        const socket = io(`${url}`, {
          auth: { token },
          transports: ['websocket', 'polling']
        });
      // Handle new bourses
      socket.on('newBourse', (newBourse) => {
        setBourses((prevBourses) => [newBourse, ...prevBourses]);
      });
      socket.on('bourseAccepted', (bourse) => {
        fetchBourses(page);
      });
      socket.on('bourseRefused', (bourse) => {
        fetchBourses(page);
      });
  
      // Cleanup on unmount
      return () => {
        socket.off('newBourse');
        socket.off('bourseAccepted');
        socket.off('bourseRefused');
      };
    }}, []);

  return (
    <div className="page-content">

      <Container fluid>
        {/* Render Breadcrumbs */}
        <Breadcrumbs
          title="Bourses"
          breadcrumbItem="Liste des bourses"
        />

        <Row>
        <Col className="col-3">
        <div className="mb-3">
                <Input
                        name="federation"
                        type="select"
                        onChange={(event) => {
                          setFederationFilter(event.target.value);
                        }}
                      >
                        <option>Federation</option>
                        {federationsList?.map((federation, index) => (
                          <option key={index} value={federation.value}>{federation.label}</option>
                        ))}
                      </Input>
                    </div>
        </Col>
        <Col className="col-3">
        <div className="mb-3">
                <Input
                        name="status"
                        type="select"
                        onChange={(event) => {
                          setStatusFilter(event.target.value);
                        }}
                      >
                        <option>Status</option>
                        <option>attente</option>
                        <option>acceptee</option>
                        <option>refusee</option>
                      </Input>
                    </div>
        </Col>
        <Col className="col-3">
        <div className="mb-3">
                <Input
                        name="groupe"
                        type="select"
                        onChange={(event) => {
                          setGroupeFilter(event.target.value);
                        }}
                      >
                        <option>Groupe</option>
                        <option>Universalité des jeux Olympiques</option>
                        <option>Entourage</option>
                        <option>Développement du sport</option>
                        <option>Valeurs Olympiques</option>
                        <option>Gestion des CNO et partage de connaissances</option>
                      </Input>
                    </div>
        </Col>
        <Col className="col-3">
        <div className="mb-3">
                  <Input
                        name="domaine"
                        type="select"
                        onChange={(event) => {
                          setDomaineFilter(event.target.value);
                        }}
                      >
                        <option>Domaine</option>
                        <option>Athlètes et développement du Sport</option>
                        <option>Valeurs</option>
                        <option>Développement des capacités et administration</option>
                      </Input>
                    </div>
        </Col>
        </Row>
        <Row>
          {/* Import Cards */}
          {bourses?.length == 0 && (
            <h3 className=" text-center">Aucune bourse trouvé</h3>
          )}
          <BourseCard bourses={bourses} refresh={fetchBourses} page={page} />
        </Row>

        <Row>
          <Col lg="12">
            <ul className="pagination pagination-rounded justify-content-center mb-5 mt-2">
              <PaginationItem disabled={page === 1}>
                <PaginationLink
                  previous
                  href="#"
                  onClick={() => {
                    const step = page - 1;
                    fetchBourses(step);
                    setPage(step);                        
                    }}                />
              </PaginationItem>
                <PaginationItem active={page + 1 === page}>
                  <PaginationLink
                    href="#"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              <PaginationItem >
                <PaginationLink
                  next
                  href="#"
                  onClick={() => {
                    const step = page +1;
                    fetchBourses(step);
                    setPage(step);                        
                    }}                />
              </PaginationItem>
            </ul>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default BourseList