import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import withRouter from "../../components/Common/withRouter";
import { Col, Container, Row, Input } from "reactstrap";
import { map } from "lodash";

// Import Breadcrumb
import Breadcrumbs from "/src/components/Common/Breadcrumb";

// Import Card
import CardContact from "./card-contact";

// API call
import { getRoleF, searchUsersByName } from "../../service/apiUser";

const ContactsGrid = () => {
  document.title = "User Grid | Skote - Vite React Admin & Dashboard Template";

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await getRoleF();
      if (response.success) {
        setUsers(response.users);
        setFilteredUsers(response.users);
      }
    } catch (error) {
      console.error("Failed to fetch users with role F:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearchChange = async (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.length > 0) {
      try {
        const response = await searchUsersByName(term);
        if (response.success) {
          setFilteredUsers(response.users);
        }
      } catch (error) {
        console.error("Failed to search users:", error);
      }
    } else {
      setFilteredUsers(users);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Contacts" breadcrumbItem="User Grid" />

          <Row className="mb-3 justify-content-center">
            <Col lg="6">
              <form className="app-search d-lg-block">
                <div className="position-relative">
                  <Input
                    type="text"
                    className="form-control"
                    placeholder="Rechercher Fédération..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <span className="bx bx-search-alt" />
                </div>
              </form>
            </Col>
          </Row>

          <Row>
            {filteredUsers.length > 0 ? (
              map(filteredUsers, (user, key) => (
                <CardContact user={user} key={user._id} />
              ))
            ) : (
              <p className="text-center">Aucun utilisateur trouvé</p>
            )}
          </Row>

          <Row>
            <Col xs="12">
              <div className="text-center my-3">
                <Link to="#" className="text-success">
                 
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(ContactsGrid);
