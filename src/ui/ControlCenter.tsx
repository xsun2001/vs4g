import React, { useContext, useEffect } from "react";
import { Segment, Step } from "semantic-ui-react";
import { GraphEditorContext } from "@/GraphEditorContext";
import AlgorithmSelector from "@/ui/AlgorithmSelector";
import ParameterInput from "@/ui/ParameterInput";
import AlgorithmPlayer from "@/ui/AlgorithmPlayer";

const ControlCenter: React.FC = prop => {
    const steps = [
      {
        key: "algorithm",
        title: "Select Algorithm"
      },
      {
        key: "graph",
        title: "Input Graph"
      },
      {
        key: "parameter",
        title: "Input Parameter"
      },
      {
        key: "control",
        title: "Control Algorithm"
      }
    ];
    const { controlStep, algorithm, displayGraph, currentStep } = useContext(GraphEditorContext);
    useEffect(() => {
      if (controlStep.value !== 3) {
        displayGraph.set(null);
        currentStep.set(-1);
      }
    }, [controlStep.value]);
    const onStepClicked = (_, { title }) => {
      for (let i = 0; i < steps.length; i++) {
        if (title === steps[i].title) {
          controlStep.set(i);
          return;
        }
      }
    };
    const renderSteps = () => {
      let stepComponents = [];
      for (let i = 0; i < steps.length; i++) {
        stepComponents.push(
          <Step
            key={steps[i].key}
            title={steps[i].title}
            active={i === controlStep.value}
            disabled={i > controlStep.value}
            link={i <= controlStep.value}
            onClick={onStepClicked}
          />
        );
      }
      return stepComponents;
    };
    const centerComponent = () => {
      switch (controlStep.value) {
        case 0:
          return <AlgorithmSelector />;
        case 1:
          return algorithm.value.graphInputComponent;
        case 2:
          return <ParameterInput />;
        case 3:
          return <AlgorithmPlayer />;
        default:
          throw new Error();
      }
    };
    return (
      <div style={{
        position: "absolute",
        width: "100%",
        // maxWidth: "800px",
        top: "0px",
        padding: "20px"
      }}>
        <Step.Group attached="top">
          {renderSteps()}
        </Step.Group>
        <Segment attached>
          {centerComponent()}
        </Segment>
      </div>
    );
  }
;

export default ControlCenter;
