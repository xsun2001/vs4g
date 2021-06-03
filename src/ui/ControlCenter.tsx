import React, { useContext } from "react";
import { Segment, Step } from "semantic-ui-react";
import AlgorithmSelector from "@/ui/AlgorithmSelector";
import { GraphEditorContext } from "@/GraphEditorContext";

const ControlCenter: React.FC = prop => {
    const steps = [
      {
        key: "algorithm",
        title: "Select Algorithm",
        component: (<AlgorithmSelector />)
      },
      {
        key: "graph",
        title: "Input Graph",
        component: (<>2</>)
      },
      {
        key: "parameter",
        title: "Input Parameter",
        component: (<>3</>)
      },
      {
        key: "control",
        title: "Control Algorithm",
        component: (<>4</>)
      }
    ];
    const { controlStep } = useContext(GraphEditorContext);
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
    return (
      <>
        <Step.Group attached="top">
          {renderSteps()}
        </Step.Group>
        <Segment attached>
          {steps[controlStep.value].component}
        </Segment>
      </>
    );
  }
;

export default ControlCenter;
