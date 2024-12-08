import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import withRouter from "../../components/Common/withRouter";
import {
  Button,
  Card,
  Col,
  Container,
  Input,
  Label,
  Row,
  Nav,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  NavItem,
  NavLink,
} from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

import classnames from "classnames";

import { map } from "lodash";

// Import Editor
// import { Editor } from "react-draft-wysiwyg";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { bookmarkEmail, getEmails, getMailAccount, send, verifPassword } from "../../service/mailService";
import {
  getMailsLists as onGetMailsLists,
  getSelectedMails as onGetSelectedMails,
  updateMail as onUpdateMail,
} from "/src/store/mails/actions";

//Import Email Topbar
import EmailToolbar from "./email-toolbar";

//redux
import { useSelector, useDispatch } from "react-redux";
import EmailSideBar from "./email-sidebar";

const EmailInbox = (props) => {
  //meta title
  document.title = "CnotInbox";

  const [mailslists, setMailslists] = useState([]);
  const [numberUnseen, setNumberUnseen] = useState(0);
  const [mailAccount, setMailAccount] = useState("");
  const [modal, setModal] = useState(false); // Compose modal
  const [secondModalOpen, setSecondModalOpen] = useState(true); // Second modal
  const [password, setPassword] = useState('');
  const [account, setAccount] = useState(null);
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const fetchEmails = async (account) => {
    try {
      const result = await getEmails(account);
      const data = result.data;
      setNumberUnseen(data.filter((email) => email.status === "Unseen").length);
      setMailslists(data.reverse());
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const checkPassword = async (password) =>{
    const response = await verifPassword(mailAccount,password);
    if(response.data === true){
      handleCloseSecondModal();
      setAccount({mailaddress : mailAccount, password: password});
      
      fetchEmails({mailaddress : mailAccount, password: password});
      /*toast.success("Fetching mails ...", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        });*/
      
    }
    else{
     /* toast.error('Wrong password', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
        }); */
    }
    
  }

  const fetchMailAccount = async (id) => {
    try {
      const result = await getMailAccount(id);
      setMailAccount(result.data.adress);
      return result.data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const storedAuthUser = localStorage.getItem('authUser');
    if (storedAuthUser) {
      const authUser = JSON.parse(storedAuthUser);
      const id = authUser?.user?._id;
      fetchMailAccount(id);
    }
  }, []);

  const dispatch = useDispatch();

  const { selectedmails } = useSelector((state) => ({
    mailslists: state.mails.mailslists,
    selectedmails: state.mails.selectedmails,
  }));

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    dispatch(onGetMailsLists(0));
  }, [dispatch]);

  const handleSelect = (selectedItems) => {
    dispatch(onGetSelectedMails(selectedItems));
  };

  const toggleModal = () => setModal(!modal);
  const toggleSecondModal = () => setSecondModalOpen(!secondModalOpen);

  const handleCloseSecondModal = () => setSecondModalOpen(false);


  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Email" breadcrumbItem="Inbox" />

          <Row>
            <Col xs="12">
              {/* Render Email SideBar */}
            <EmailSideBar mailaccount = {mailAccount} password={password}/>

              <Modal
                isOpen={secondModalOpen}
                toggle={handleCloseSecondModal}
                backdrop="static"
              
              >
                <ModalHeader toggle={handleCloseSecondModal}>
                  Entrer le mot de passe de compte ({mailAccount})
                </ModalHeader>
                <ModalBody>
                <input type="password" placeholder="*******" value={password} onChange={(e) => setPassword(e.target.value)} className="border-stroke dark:border-form-strokedark dark:bg-form-input focus:border-primary dark:focus:border-primary active:border-primary bg-transparent w-full rounded-lg border-[1.5px] py-3 px-5 font-medium outline-none transition disabled:cursor-default disabled:bg-whiter" />
                </ModalBody>
                <ModalFooter>
                  <Button color="secondary" onClick={handleCloseSecondModal}>
                    Close
                  </Button>
                  <Button color="primary" onClick={() => checkPassword(password)}> Envoyer </Button>
                </ModalFooter>
              </Modal>

              <div className="email-rightbar mb-3">
                <Card>
                  {mailslists.length > 0 ? (
                    <>
                      {/* Render Email Top Tool Bar */}
                      <EmailToolbar
                        selectedmails={selectedmails}
                        activeTab={activeTab}
                      />
                      <ul className="message-list">
                        {map(mailslists, (mail, key) => (
                          
                          <li key={key} className={mail.unread ? "unread" : ""}>
                          <div className="col-mail col-mail-1">
                            <div className="checkbox-wrapper-mail">
                              <Input
                                type="checkbox"
                                value={mail.id}
                                id={mail.id}
                                name="emailcheckbox"
                                onChange={(e) => console.log(e.target.value)}
                                onClick={(e) => handleSelect(e.target.value)}
                                checked={selectedmails.includes(mail._id)}
                              />
                              <Label htmlFor={mail.id} className="toggle" />
                            </div>
                            <Link to={`/email-read/${mail._id}`} className="title">
                              {mail.from}
                            </Link>
                            {mail.bookmarked ? (
                              <span
                                className="star-toggle fas fa-star text-warning"
                                style={{ cursor: "pointer" }}
                              />
                            ) : (
                              <span
                                className="star-toggle far fa-star"
                                style={{ cursor: "pointer" }}
                                onClick={async () => {
                                  await bookmarkEmail(mail._id);
                                  fetchEmails({ mailaddress: mailAccount, password: password });
                                }}
                              />
                            )}
                          </div>
                          <div className="col-mail col-mail-2">
                            <div className="subject">
                              <span>
                                {mail.subject.length > 25 ? `${mail.subject.substring(0, 30)}...` : mail.subject}
                              </span>
                            </div>
                            <div className="date w-50">
                              {new Date(mail.date).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                              })}
                            </div>
                          </div>
                        </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <div className="align-items-center text-center p-4">
                      {" "}
                      <i className="mdi mdi-email-outline me-2 display-5"></i>{" "}
                      <h4> Aucun mail trouvé </h4>
                    </div>
                  )}
                </Card>
                {mailslists.length > 0 && (
                  <Row>
                    <Col xs="7"></Col>
                    <Col xs="5">
                      <div className="btn-group float-end">
                        <Button type="button" color="success" size="sm">
                          <i className="fa fa-chevron-left" />
                        </Button>
                        <Button type="button" color="success" size="sm">
                          <i className="fa fa-chevron-right" />
                        </Button>
                      </div>
                    </Col>
                  </Row>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(EmailInbox);
