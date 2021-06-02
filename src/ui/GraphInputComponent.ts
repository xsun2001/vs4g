import { Graph } from "@/GraphStructure";
import React from "react";


export interface GraphInputComponent extends React.FC<{
  defaultGraph: Graph,
  onGraphUpdated: (graph: Graph) => void;
}> {
}