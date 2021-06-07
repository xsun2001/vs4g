import { AbstractGraphRenderer, GraphRenderer } from "@/ui/render/GraphRenderer";
import { Graph, GridGraph } from "@/GraphStructure";

class GridGraphRenderer extends AbstractGraphRenderer implements GraphRenderer {
  private canvas: HTMLCanvasElement;
  private a: number;
  private b: number;
  private startX: number;
  private startY: number;
  private controlStep: number;
  private mouseDown: boolean;
  private graph: GridGraph;
  private graphChanged: boolean;

  constructor(private readonly colorMap: Map<number, string>) {
    super();
  }

  flipGrid(x: number, y: number) {
    const i = (x - this.startX) / this.a, j = (y - this.startY) / this.a;
    if (i < this.graph.width && j < this.graph.height) {
      if (this.graph.grids[j][i] === 0) {
        this.graph.grids[j][i] = -1;
        this.graphChanged = true;
      }
      if (this.graph.grids[j][i] === -1) {
        this.graph.grids[j][i] = 0;
        this.graphChanged = true;
      }
    }
  };

  mousedown(ev: MouseEvent) {
    this.mouseDown = true;
    this.flipGrid(ev.offsetX, ev.offsetY);
  }

  mousemove(ev: MouseEvent) {
    if (this.mouseDown) {
      this.flipGrid(ev.offsetX, ev.offsetY);
    }
  }

  mouseup(ev: MouseEvent) {
    this.mouseDown = false;
    if (this.graphChanged) {
      this.graphSetter(this.graph);
    }
  }

  onCanvasUpdated(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.canvas.addEventListener("mousedown", this.mousedown);
    this.canvas.addEventListener("mousemove", this.mousemove);
    this.canvas.addEventListener("mouseup", this.mouseup);
  }

  onControlStepUpdated(step: number) {
    this.controlStep = step;
  }

  cleanup(): void {
    this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvas.removeEventListener("mousedown", this.mousedown);
    this.canvas.removeEventListener("mousemove", this.mousemove);
    this.canvas.removeEventListener("mouseup", this.mouseup);
    this.mouseDown = false;
  }

  onGraphUpdated(g: Graph): void {
    if (!(g instanceof GridGraph)) {
      // TODO: Universal error handling
      throw new Error("Unsupported Graph");
    }

    this.repaint(g);
    this.graph = g;
  }

  private repaint(g: GridGraph) {
    const width = this.canvas.width, height = this.canvas.height;
    const ctx = this.canvas.getContext("2d");
    this.a = Math.min(width * 0.8 / g.width, height * 0.5 / g.height);
    this.b = this.a * 0.1;
    this.startX = (width - g.width * this.a) / 2;
    this.startY = (height - g.height * this.a) / 2;

    const a = this.a, startX = this.startX, startY = this.startY;
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = this.b;
    for (let i = 0; i < g.height; i++) {
      for (let j = 0; j < g.width; j++) {
        ctx.fillStyle = this.colorMap.get(g.grids[i][j]) ?? "#FFFFFF";
        ctx.fillRect(startX + j * a, startY + i * a, a, a);
        ctx.strokeRect(startX + j * a, startY + i * a, a, a);
      }
    }
  }
}

export default GridGraphRenderer;