import { Graph } from "@/GraphStructure";

/* Invoke Order:
 * 1. Constructor
 * 2. updateGraph(initialGraph)
 * 3. bindCanvas
 * 4. updateGraph
 * 5. more update...
 * 6. finish
 */

export interface GraphRenderer {
  updateGraph: (g: Graph) => void;
  bindCanvas: (canvas: HTMLCanvasElement) => void;
  finish: () => void;
}