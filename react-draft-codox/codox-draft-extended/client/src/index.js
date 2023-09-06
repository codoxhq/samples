import React from "react";
import ReactDOM from "react-dom";
import Helmet from "react-helmet";
import App from "./components/App";

// styles
import "./index.css";
// draft styles
import "draft-js/dist/Draft.css";
// plugins styles
import "@draft-js-plugins/linkify/lib/plugin.css";
import "@draft-js-plugins/image/lib/plugin.css";
import "@draft-js-plugins/mention/lib/plugin.css";
import "@draft-js-plugins/undo/lib/plugin.css";

ReactDOM.render(
  <>
    <Helmet>
      <title>DraftJS Demo</title>
    </Helmet>

    <App />
  </>,
  document.getElementById("root")
);
