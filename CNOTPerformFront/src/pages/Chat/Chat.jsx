import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  Container,
  Input,
  Row,
  UncontrolledTooltip,
} from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import Breadcrumbs from "/src/components/Common/Breadcrumb";
import images from "/src/assets/images";
import { io } from "socket.io-client";
import { getUserProfile, uploadFile } from "../../service/apiUser";
import moment from "moment";
import 'moment/locale/fr';

moment.locale('fr');

const Chat = () => {
  const url = process.env.REACT_APP_BACKEND_URL;
  document.title = "Chat | Skote - Vite React Admin & Dashboard Template";

  const [messageBox, setMessageBox] = useState(null);
  const [currentUser, setCurrentUser] = useState({
    name: "Henry Wells",
    isActive: true,
    image: images.avatar1,
    _id: '',
  });
  const [curMessage, setcurMessage] = useState("");
  const [recentChats, setRecentChats] = useState([]);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [receiverId, setReceiverId] = useState(null);
  const [Chat_Box_Username, setChat_Box_Username] = useState("");
  const navigate = useNavigate();
  const messageBoxRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserProfile();
        setCurrentUser({
          ...currentUser,
          name: userData.user.name || "Henry Wells",
          image: userData.user.image ? `${url}/${userData.user.image}` : images.avatar1,
          _id: userData.user._id,
        });

        const response = await fetch(`${url}/api/contacts/${userData.user._id}`);
        const contactsData = await response.json();
        const sortedContacts = contactsData.sort((a, b) => {
          if (a.lastMessageTimeDiff === "Aucun message") return 1;
          if (b.lastMessageTimeDiff === "Aucun message") return -1;
          return new Date(b.lastMessageTimeDiff) - new Date(a.lastMessageTimeDiff);
        });
        setContacts(sortedContacts);

        if (sortedContacts.length > 0) {
          const firstContact = sortedContacts[0];
          setChat_Box_Username(firstContact.name);
          setReceiverId(firstContact._id);
          fetchMessages(userData.user._id, firstContact._id);
        }
      } catch (error) {
        console.error("Error fetching user data or contacts:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('authUser'))?.token;
    if (token) {
      const newSocket = io(`${url}`, {
        auth: { token },
        transports: ['websocket', 'polling'],
      });

      setSocket(newSocket);

      newSocket.on('connect', () => console.log('Connected to server'));
      newSocket.on('disconnect', () => console.log('Disconnected from server'));
      newSocket.on('receiveMessage', (message) => {
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, message];
          updateRecentChats(updatedMessages);
          return updatedMessages;
        });
        updateContacts();
      });

      return () => {
        newSocket.off('connect');
        newSocket.off('disconnect');
        newSocket.off('receiveMessage');
        newSocket.close();
      };
    }
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async (userId, contactId) => {
    try {
      const response = await fetch(`${url}/api/messages/${userId}/${contactId}`);
      const data = await response.json();
      setMessages(data);
      updateRecentChats(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const updateContacts = async () => {
    try {
      const response = await fetch(`${url}/api/contacts/${currentUser._id}`);
      const contactsData = await response.json();
      const sortedContacts = contactsData.sort((a, b) => {
        if (a.lastMessageTimeDiff === "Aucun message") return 1;
        if (b.lastMessageTimeDiff === "Aucun message") return -1;
        return new Date(b.lastMessageTimeDiff) - new Date(a.lastMessageTimeDiff);
      });
      setContacts(sortedContacts);
    } catch (error) {
      console.error("Error updating contacts:", error);
    }
  };

  const updateRecentChats = (messages) => {
    const recentChatsMap = messages.reduce((acc, message) => {
      const contactId = message.sender === currentUser._id ? message.receiver : message.sender;
      const contactName = message.sender === currentUser._id ? message.receiverName : message.senderName;
      acc[contactId] = { id: contactId, name: contactName, lastMessage: message.message, time: message.timestamp, image: `${url}/${message.image}` };
      return acc;
    }, {});
    setRecentChats(Object.values(recentChatsMap).sort((a, b) => new Date(b.time) - new Date(a.time)));
  };

  const scrollToBottom = () => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  };

  const userChatOpen = (id, name) => {
    setChat_Box_Username(name);
    setReceiverId(id);
    fetchMessages(currentUser._id, id);
    navigate(`/chat/${id}`);
  };

  const addMessage = () => {
    if (curMessage && socket && currentUser._id && receiverId) {
      const messageData = {
        sender: currentUser._id,
        senderName: currentUser.name,
        receiver: receiverId,
        receiverName: Chat_Box_Username,
        message: curMessage,
        timestamp: new Date().toISOString(),
      };
      socket.emit('sendMessage', messageData);
      setcurMessage('');
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, messageData];
        updateRecentChats(updatedMessages);
        return updatedMessages;
      });
      updateContacts();
    }
  };

  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      addMessage();
    }
  };

  const searchUsers = () => {
    const input = document.getElementById("search-user").value.toUpperCase();
    const ul = document.getElementById("recent-list");
    const li = ul.getElementsByTagName("li");
    for (let i = 0; i < li.length; i++) {
      const a = li[i].getElementsByTagName("a")[0];
      const txtValue = a.textContent || a.innerText;
      li[i].style.display = txtValue.toUpperCase().indexOf(input) > -1 ? "" : "none";
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const result = await uploadFile(file);

        if (socket && currentUser._id && receiverId) {
          const messageData = {
            sender: currentUser._id,
            senderName: currentUser.name,
            receiver: receiverId,
            receiverName: Chat_Box_Username,
            message: `File: ${result.message}`,
            timestamp: new Date().toISOString(),
          };
          socket.emit('sendMessage', messageData);
          setMessages((prevMessages) => [...prevMessages, messageData]);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Skote" breadcrumbItem="Chat" />
          <Row>
            <Col lg="12">
              <div className="d-lg-flex">
                <div className="chat-leftsidebar me-lg-4">
                  <div className="py-4 border-bottom">
                    <div className="d-flex">
                      <div className="align-self-center me-3">
                        <img src={currentUser.image} className="avatar-xs rounded-circle" alt="" />
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="font-size-15 mt-0 mb-1">{currentUser.name}</h5>
                        <p className="text-muted mb-0">
                          <i className="mdi mdi-circle text-success align-middle me-2" /> En ligne
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="search-box chat-search-box py-4">
                    <div className="position-relative">
                      <Input
                        onKeyUp={searchUsers}
                        id="search-user"
                        type="text"
                        className="form-control"
                        placeholder="Recherche..."
                      />
                      <i className="bx bx-search-alt search-icon" />
                    </div>
                  </div>
                  <div className="chat-leftsidebar-nav">
                    <h5 className="font-size-14 mb-3">Contacts</h5>
                    <div>
                      <PerfectScrollbar style={{ height: "410px" }}>
                        {contacts.map((contact) => (
                          <div key={contact._id}>
                            <ul className="list-unstyled chat-list" id="recent-list">
                              <li key={contact._id}>
                                <Link to="#" onClick={() => userChatOpen(contact._id, contact.name)}>
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                      <div className="avatar-xs me-3">
                                        <span className="rounded-circle bg-primary bg-soft text-primary">
                                          <img src={`${url}/${contact.image}`} alt={contact.name} />
                                        </span>
                                      </div>
                                      <div style={{ maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        <h5 className="font-size-14 mb-0">{contact.name}</h5>
                                        <p className="text-muted mb-0">
                                          {contact.lastMessageText?.startsWith("File:") ? (
                                            "Fichier"
                                          ) : (
                                            contact.lastMessageText
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                    <p className="text-muted mb-0">{contact.lastMessageTimeDiff}</p>
                                  </div>
                                </Link>
                              </li>
                            </ul>
                          </div>
                        ))}
                      </PerfectScrollbar>
                    </div>
                  </div>
                </div>
                <div className="w-100 user-chat">
                  <Card>
                    <div className="p-4 border-bottom">
                      <Row>
                        <Col md="4" xs="9">
                          <h5 className="font-size-15 mb-1">{Chat_Box_Username}</h5>
                        </Col>
                      </Row>
                    </div>
                    <div>
                      <div className="chat-conversation p-3">
                        <ul className="list-unstyled">
                          <PerfectScrollbar style={{ height: "470px" }} containerRef={(ref) => (messageBoxRef.current = ref)}>
                            {messages.map((message, index) => (
                              <li key={`msg-${index}`} className={message.sender === currentUser._id ? "right" : ""}>
                                <div className="conversation-list">
                                  <div className="ctext-wrap">
                                    <div className="conversation-name">{message.senderName}</div>
                                    {message.message.startsWith('File:') ? (
                                      <div className="file-message">
                                        <i className="mdi mdi-file-document-outline file-icon"></i>
                                        <a
                                          href={message.message.replace('File: ', '')}
                                          download
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {decodeURIComponent(message.message.split('/').pop().split('?')[0])}
                                        </a>
                                      </div>
                                    ) : (
                                      <p>{message.message}</p>
                                    )}
                                    <p className="chat-time mb-0">{moment(message.timestamp).format("LT")}</p>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </PerfectScrollbar>
                        </ul>
                      </div>
                      <div className="p-3 chat-input-section">
                        <Row>
                          <Col>
                            <div className="position-relative">
                              <input
                                type="text"
                                value={curMessage}
                                onKeyPress={onKeyPress}
                                onChange={(e) => setcurMessage(e.target.value)}
                                className="form-control chat-input"
                                placeholder="Enter Message..."
                              />
                              <div className="chat-input-links">
                                <ul className="list-inline mb-0">
                                  <li className="list-inline-item">
                                    <Link to="#" onClick={() => document.getElementById('fileInput').click()}>
                                      <i className="mdi mdi-file-document-outline" id="Filetooltip" />
                                      <UncontrolledTooltip placement="top" target="Filetooltip">                                   Fichiers/Images
                                      </UncontrolledTooltip>
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <input
                              type="file"
                              id="fileInput"
                              style={{ display: 'none' }}
                              onChange={handleFileUpload}
                            />
                          </Col>
                          <Col className="col-auto">
                            <Button type="button" color="primary" onClick={addMessage} className="btn btn-primary btn-rounded chat-send w-md">
                              <span className="d-none d-sm-inline-block me-2"></span>
                              <i className="mdi mdi-send" />
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Chat;
