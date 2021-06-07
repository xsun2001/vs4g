import React, { useContext, useEffect, useRef } from "react";
import { GraphEditorContext } from "@/GraphEditorContext";
import cloneDeep from "lodash.clonedeep";

const MainCanvas: React.FC = props => {
  const { graph, displayGraph, algorithm, controlStep } = useContext(GraphEditorContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (algorithm.value != null && canvasRef.current != null) {
      algorithm.value.graphRenderer.onCanvasUpdated(canvasRef.current);
      algorithm.value.graphRenderer.bindGraphSetter(g => graph.set(g));
    }
  }, [algorithm.value]);
  useEffect(() => {
    if (algorithm.value != null && canvasRef.current != null) {
      if (displayGraph.value != null) {
        algorithm.value.graphRenderer.onGraphUpdated(cloneDeep(displayGraph.value));
      } else if (graph.value != null) {
        algorithm.value.graphRenderer.onGraphUpdated(cloneDeep(graph.value));
      }
    }
  }, [displayGraph.value, graph.value]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas.height !== canvas.clientHeight) {
      canvas.height = canvas.clientHeight;
    }
    if (canvas.width !== canvas.clientWidth) {
      canvas.width = canvas.clientWidth;
    }
  });
  useEffect(() => {
    if (algorithm.value) {
      algorithm.value.graphRenderer.onControlStepUpdated(controlStep.value);
      if (controlStep.value !== 3) {
        algorithm.value.graphRenderer.cleanup();
      }
    }
  }, [controlStep.value]);

  return (
    <canvas style={{
      position: "absolute",
      width: "100%",
      height: "100%",
      margin: 0,
      padding: 0
    }} ref={canvasRef} />
  );
};

export default MainCanvas;
