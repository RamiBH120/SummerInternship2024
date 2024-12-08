import React from "react";
import { Toast, ToastBody, ToastHeader } from "reactstrap";

const Toasted = ({ title, msg }) => {
  return (
    <div className="bg-success my-2 rounded p-3">
      <Toast>
        <ToastHeader>{title}</ToastHeader>
        <ToastBody>{msg}</ToastBody>
      </Toast>
    </div>
  );
};

export default Toasted;
