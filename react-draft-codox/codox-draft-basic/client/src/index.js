import React from "react";
import ReactDOM from "react-dom";
import Helmet from "react-helmet";
import App from "./components/App";

// styles 
import "./index.css";

// draft specific styles 
import "draft-js/dist/Draft.css";

ReactDOM.render(
  <>
    <Helmet>
      <title>DraftJS Demo</title>
    </Helmet>

    <App />
  </>,
  document.getElementById("root")
);
