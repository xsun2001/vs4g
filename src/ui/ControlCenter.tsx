import React, { useState } from "react";
import { Segment, Step } from "semantic-ui-react";
import AlgorithmSelector from "@/ui/AlgorithmSelector";

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
    const [currentStep, setCurrentStep] = useState<number>(0);
    const onStepClicked = (_, { title }) => {
      for (let i = 0; i < steps.length; i++) {
        if (title === steps[i].title) {
          setCurrentStep(i);
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
            active={i === currentStep}
            disabled={i > currentStep}
            link={i <= currentStep}
            onClick={onStepClicked}
          />
        );
      }
      return stepComponents;
    };
    const nextStep = () => {
      setCurrentStep(Math.min(currentStep + 1, steps.length - 1));
    };
    return (
      <>
        <Step.Group attached="top">
          {renderSteps()}
        </Step.Group>
        <Segment attached>
          {steps[currentStep].component}
        </Segment>
      </>
    );
  }
;

export default ControlCenter;
