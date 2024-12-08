import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Card,
} from "reactstrap"

// Import Editor

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

//Import images
import avatar2 from "../../assets/images/users/avatar-2.jpg"
import avatar3 from "../../assets/images/users/avatar-3.jpg"
import avatar4 from "../../assets/images/users/avatar-4.jpg"
import avatar6 from "../../assets/images/users/avatar-6.jpg"
import { send } from "../../service/mailService";

const EmailSideBar = ({ mailaccount, password }) => {
  const [modal, setmodal] = useState(false)
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  return (
    <React.Fragment>
      <Card className="email-leftbar">
        <Button
          type="button"
          color="danger"
          
          onClick={() => {
            setmodal(!modal)
          }}
          block
        >
          Compose
        </Button>
        <div className="mail-list mt-4">
          <Link to="/email-inbox" className="active">
            <i className="mdi mdi-email-outline me-2"></i> Inbox{" "}
            <span className="ml-1 float-end">(18)</span>
          </Link>
          <Link to="/email-inbox" filter="SHOW_COMPLETED">
            <i className="mdi mdi-star-outline me-2"></i>Starred
          </Link>
          <Link to="/email-inbox">
            <i className="mdi mdi-diamond-stone me-2"></i>Important
          </Link>
          <Link to="/email-inbox">
            <i className="mdi mdi-file-outline me-2"></i>Draft
          </Link>
          <Link to="/email-inbox">
            <i className="mdi mdi-email-check-outline me-2"></i>Sent Mail
          </Link>
          <Link to="/email-inbox">
            <i className="mdi mdi-trash-can-outline me-2"></i>Trash
          </Link>
        </div>
      </Card>

      <Modal
        isOpen={modal}
        role="dialog"
        autoFocus={true}
        centered={true}
        className="exampleModal"
        tabIndex="-1"
        toggle={() => {
          setmodal(!modal)
        }}
      >
        <div className="modal-content">
          <ModalHeader
            toggle={() => {
              setmodal(!modal)
            }}
          >
            Nouveau mail
          </ModalHeader>
          <ModalBody>
            <form>
              <div className="mb-3">
                <Input type="email" 
                className="form-control" 
                placeholder="To"           
                onChange={() =>{
                  setTo(event.target.value);
          }}/>
              </div>

              <div className="mb-3">
                <Input
                  type="text"
                  className="form-control"
                  placeholder="Subject"
                  onChange={() =>{
                    setSubject(event.target.value);
                  }}
                />
              </div>
              {/* <Editor
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
              /> */}
              <CKEditor
                      editor={ClassicEditor}
                      data="<p>Bonjour!</p>"
                      onReady={editor => {
                        // You can store the "editor" and use when it is needed.
                        console.log('Editor is ready to use!', editor);
                      }}
                      onChange={(event, editor) => {
                        setBody(editor.getData());
                        
                      }}
                    />
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              type="button"
              color="secondary"
              onClick={() => {
                setmodal(!modal)
              }}
            >
              Close
            </Button>
            <Button type="button" color="primary" 
            onClick={async () => {
              const response =await send(mailaccount, password, to, subject, body)
              if(response.status == 200){
                setmodal(false);
              }
                } 
                }>
              Send <i className="fab fa-telegram-plane ms-1"></i>
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </React.Fragment>
  )
}

export default EmailSideBar
