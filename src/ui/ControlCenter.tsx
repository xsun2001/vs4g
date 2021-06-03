import React, { useContext } from "react";
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
    const { controlStep, algorithm } = useContext(GraphEditorContext);
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
      <>
        <Step.Group attached="top">
          {renderSteps()}
        </Step.Group>
        <Segment attached>
          {centerComponent()}
        </Segment>
      </>
    );
  }
;

export default ControlCenter;
