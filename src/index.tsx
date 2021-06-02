import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import "semantic-ui-css/semantic.css";
import { Container, Segment } from "semantic-ui-react";
import AlgorithmSelector from "@/ui/AlgorithmSelector";

ReactDOM.render(
  <React.StrictMode>
    <Container>
      <Segment>
        <AlgorithmSelector/>
      </Segment>
    </Container>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
