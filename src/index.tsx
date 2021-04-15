import React from "react";
import ReactDOM from "react-dom";
import GraphEditorPage from "@/GraphEditorPage";
import reportWebVitals from "./reportWebVitals";
import "semantic-ui-css/semantic.css"

ReactDOM.render(
  <React.StrictMode>
    <GraphEditorPage />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
