import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Container, Row, Col, Card, CardBody } from "reactstrap";

// Import Image
import avatar2 from "../../assets/images/users/avatar-2.jpg";
import img3 from "../../assets/images/small/img-3.jpg";
import img4 from "../../assets/images/small/img-4.jpg";

// Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

// Import Email Sidebar
import EmailSideBar from "./email-sidebar";
import { getEmailById } from "../../service/mailService";

const EmailRead = () => {
  const { id } = useParams();
  const [mail, setMail] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  // Meta title
  useEffect(() => {
    document.title = "Read Email";
  }, []);

  const fetchEmailById = async (id) => {
    try {
      const result = await getEmailById(id);
      setMail(result.data);
    } catch (error) {
      console.log("Error fetching email:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchEmailById(id);
  }, [id]);

  if (loading) {
    return <p>Loading...</p>; // Show loading indicator while fetching email
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Email" breadcrumbItem="Read Email" />

          <Row>
            <Col xs="12">
              {/* Render Email SideBar */}
              <div className="email-rightbar mb-3">
                <Card>
                  <CardBody>
                    <div className="d-flex mb-4">
<div className="position-relative h-40 w-25 rounded-circle overflow-hidden">
  <div className="position-absolute top-50 start-50 translate-middle d-flex align-items-center justify-content-center w-25 h-100 bg-dark rounded-circle">
    <span className="font-weight-medium text-white">
      {mail.from ? mail.from.charAt(0) : ''}
    </span>
  </div>
</div>


                      <div className="flex-grow-1">
                        <h5 className="font-size-14 mt-1">
                          {mail && mail.from} {/* Check if mail is not null */}
                        </h5>
                        <small className="text-muted">
                          {mail &&
                            new Date(mail.date).toLocaleString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                        </small>
                      </div>
                    </div>

                    <h4 className="mt-0 font-size-16">
                      {mail.subject}
                    </h4>

                            <div 
                            dangerouslySetInnerHTML={{
                              __html: mail.body,
                              }}>

                            </div>
                    <hr />



                  </CardBody>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EmailRead;
