import { Graph } from "@/GraphStructure";

/* Invoke Order:
 * 1. Constructor
 * 2. Bind Canvas
 * 3. Update Graph
 * 5. More Update...
 * 6. Finish
 */

export interface GraphRenderer {
  onGraphUpdated: (g: Graph) => void;
  onCanvasUpdated: (canvas: HTMLCanvasElement) => void;
  onControlStepUpdated: (step: number) => void;
  bindGraphSetter: (setter: (g: Graph) => void) => void;
  cleanup: () => void;
}

export class AbstractGraphRenderer implements GraphRenderer {
  protected graphSetter: (g: Graph) => void;

  bindGraphSetter(setter: (g: Graph) => void): void {
    this.graphSetter = setter;
  }

  cleanup(): void {
  }

  onCanvasUpdated(canvas: HTMLCanvasElement): void {
  }

  onControlStepUpdated(step: number): void {
  }

  onGraphUpdated(g: Graph): void {
  }
}