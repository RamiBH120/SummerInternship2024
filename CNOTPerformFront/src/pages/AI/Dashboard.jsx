import React from "react";
import { Button } from "reactstrap";
import { useNavigate } from "react-router-dom";

function PowerBi() {

  return (
    <React.Fragment>
        <br />
      <section
        className="hero-section mt-10"
        id="home"
        style={{
          position: "relative",
          width: "100vw",
          height: "100vh", // Full viewport height
          display: "flex",
          alignItems: "center", // Center iframe vertically
          justifyContent: "center", // Center iframe horizontally
        }}
      >
        <div
          className="container-fluid p-0 mt-10"
          style={{ width: "100%", height: "100%" }}
        >
          <iframe
            title="PowerBI Dashboard"
              src="https://app.powerbi.com/reportEmbed?reportId=1e06cbdf-c229-4f38-a6c9-ebe14b81f40c&autoAuth=true&ctid=604f1a96-cbe8-43f8-abbf-f8eaf5d85730&filterPaneEnabled=false&navContentPaneEnabled=false"
            frameBorder="0"
            allowFullScreen={true}
            style={{
              width: "100%", // Full width
              height: "100%", // Full height
              border: "none",
            }}
          ></iframe>
        </div>
      </section>
    </React.Fragment>
  );
}

export default PowerBi;
