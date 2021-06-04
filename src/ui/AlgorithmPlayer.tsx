import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Button, Grid } from "semantic-ui-react";
import { GraphEditorContext } from "@/GraphEditorContext";
import { Step } from "@/GraphAlgorithm";

const AlgorithmPlayer: React.FC = props => {

  const { graph, displayGraph, algorithm, currentStep, parameters } = useContext(GraphEditorContext);
  const generator = useMemo(() => algorithm.value.run(graph.value, ...parameters.value), [algorithm.value, graph.value, parameters.value]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [autorunTimer, setAutorunTimer] = useState<number>();
  const [autorunCounter, setAutorunCounter] = useState<number>(0);

  const autorunTask = useCallback(() => {
    const newStep = currentStep.value + 1;
    if (newStep === steps.length) {
      let nxt = generator.next();
      if (nxt.done) {
        setAutorunCounter(0);
        window.clearInterval(autorunTimer);
        return;
      }
      steps.push(nxt.value);
      setSteps(Array.from(steps));
    }
    displayGraph.set(steps[newStep].graph);
    currentStep.set(newStep);
  }, [autorunTimer, currentStep, displayGraph, generator, steps]);
  useEffect(() => autorunTask(), [autorunCounter]);
  const startAutorun = () => {
    const timer = window.setInterval(() => {
      setAutorunCounter(prev => prev + 1);
    }, 500);
    setAutorunTimer(timer);
  };
  const stopAutorun = () => {
    if (autorunTimer) {
      window.clearInterval(autorunTimer);
      setAutorunTimer(null);
    }
  };
  const previousStep = () => {
    stopAutorun();
    if (currentStep.value > 0) {
      displayGraph.set(steps[currentStep.value - 1].graph);
      currentStep.set(currentStep.value - 1);
    }
  };
  const nextStep = () => {
    stopAutorun();
    if (currentStep.value === steps.length - 1) {
      let nxt = generator.next();
      if (nxt.done) {
        return;
      }
      steps.push(nxt.value);
      setSteps(Array.from(steps));
    }
    displayGraph.set(steps[currentStep.value + 1].graph);
    currentStep.set(currentStep.value + 1);
  };
  const restart = () => {
    stopAutorun();
    displayGraph.set(graph.value);
    currentStep.set(-1);
  };

  return (
    <Grid columns="equal">
      <Grid.Column>
        {
          autorunTimer ?
            (<Button fluid color="yellow" icon="pause" content="Pause" onClick={stopAutorun} />) :
            (<Button fluid color="green" icon="paper plane" content="Autorun" onClick={startAutorun} />)
        }
      </Grid.Column>
      <Grid.Column>
        <Button fluid icon="left chevron" labelPosition="left" content="Previous" onClick={previousStep} />
      </Grid.Column>
      <Grid.Column>
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          fontSize: "20px"
        }}>
          {"No." + (1 + currentStep.value) + " Step"}
        </div>
      </Grid.Column>
      <Grid.Column>
        <Button fluid icon="right chevron" labelPosition="right" content="Next" onClick={nextStep} />
      </Grid.Column>
      <Grid.Column>
        <Button fluid color="blue" icon="sync" content="Restart" onClick={restart} />
      </Grid.Column>
    </Grid>
  );
};

export default AlgorithmPlayer;