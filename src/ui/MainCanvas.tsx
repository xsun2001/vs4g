import React, { useContext, useEffect, useRef } from "react";
import { GraphEditorContext } from "@/GraphEditorContext";

const MainCanvas: React.FC = props => {
  const { graph, displayGraph, algorithm, controlStep } = useContext(GraphEditorContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (algorithm.value != null && canvasRef.current != null) {
      algorithm.value.graphRenderer.bindCanvas(canvasRef.current);
    }
  }, [algorithm.value]);
  useEffect(() => {
    if (algorithm.value != null && canvasRef.current != null) {
      if (displayGraph.value != null) {
        algorithm.value.graphRenderer.updateGraph(displayGraph.value);
      } else if (graph.value != null) {
        algorithm.value.graphRenderer.updateGraph(graph.value);
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
    if (algorithm.value && controlStep.value !== 3) {
      algorithm.value.graphRenderer.finish();
    }
  }, [controlStep.value]);

  return (
    <canvas style={{
      position: "absolute",
      width: "100%",
      height: "100%",
      margin: 0,
      padding: 0
    }} ref={canvasRef} draggable={true} />
  );
};

export default MainCanvas;
