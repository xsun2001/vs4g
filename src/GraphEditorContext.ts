import { createContext } from "react";
import { Graph } from "@/GraphStructure";
import { NewGraphAlgorithm } from "@/GraphAlgorithm";

export interface State<T> {
  value: T;
  set: (t: T) => void;
}

export function fromReactState<T>(reactState: [T, (t: T) => void]): State<T> {
  const [value, set] = reactState;
  return { value, set };
}

export interface GlobalVariable {
  graph: State<Graph>
  displayGraph: State<Graph>
  algorithm: State<NewGraphAlgorithm>
  controlStep: State<number>
  parameters: State<any[]>
  currentStep: State<number>
  codePosition: State<number>
}

export const GraphEditorContext = createContext<GlobalVariable>(null);