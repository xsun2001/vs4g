import { Graph } from "@/GraphStructure";

/* Invoke Order:
 * 1. Constructor
 * 2. Bind Canvas
 * 3. Update Graph
 * 5. More Update...
 * 6. Finish
 */

export interface GraphRenderer {
  updateGraph: (g: Graph) => void;
  bindCanvas: (canvas: HTMLCanvasElement) => void;
  finish: () => void;
}