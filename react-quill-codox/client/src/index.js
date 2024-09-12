import React from "react";
import ReactDOM from "react-dom";
import Helmet from "react-helmet";
import { Provider as ReduxProvider } from "react-redux";
import App from "./components/App";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
// quill styles
import "quill/dist/quill.snow.css";

ReactDOM.render(
  <>
    <Helmet>
      <title>Quill Editor Demo</title>
      {/* <link href="https://cdn.quilljs.com/1.0.0/quill.snow.css" rel="stylesheet"></link> */}
    </Helmet>

    <App />
  </>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
