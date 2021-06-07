import { Force, SimulationLinkDatum, SimulationNodeDatum } from "d3-force";
import { Edge, Graph, Node } from "@/GraphStructure";
import * as d3 from "d3";
import { AbstractGraphRenderer, GraphRenderer } from "@/ui/render/GraphRenderer";
import cloneDeep from "lodash.clonedeep";

export interface GraphRenderType {
  directed: boolean;
  bipartite: boolean;
  dmp: boolean;
}

export interface GeneralRenderHint {
  nodeRadius: number;
  textColor: string;
  backgroundColor: string;
  simulationForceManyBodyStrength: number;
}

export interface NodeRenderHint {
  borderThickness: (node: Node) => number;
  borderColor: (node: Node) => string;
  fillingColor: (node: Node) => string;
  floatingData: (node: Node) => string;
  popupData: (node: Node) => [string, string][];
}

export interface EdgeRenderHint {
  thickness: (edge: Edge) => number;
  color: (edge: Edge) => string;
  floatingData: (edge: Edge) => string;
}

interface D3SimulationNode extends SimulationNodeDatum {
  graphNode: Node;
}

// Should we deep copy data?
function toD3NodeDatum(node: Node): D3SimulationNode {
  return { index: node.id, graphNode: cloneDeep(node) };
}

interface D3SimulationEdge extends SimulationLinkDatum<any> {
  graphEdge: Edge;
}

function toD3EdgeDatum(edge: Edge): D3SimulationEdge {
  return { source: edge.source, target: edge.target, graphEdge: cloneDeep(edge) };
}

type DeepPartial<T> = {
  [P in keyof T]?: Partial<T[P]>;
};

interface RenderHints {
  general: GeneralRenderHint;
  node: NodeRenderHint;
  edge: EdgeRenderHint;
}

const cssProp = (key: string) => getComputedStyle(document.body).getPropertyValue(key);
const defaultRenderHints: RenderHints = {
  general: {
    nodeRadius: 20,
    textColor: "#000000",
    backgroundColor: "#FFFFFF",
    simulationForceManyBodyStrength: -500
  },
  edge: {
    thickness: () => 4,
    color: () => "#585858",
    floatingData: edge => String(edge.datum?.weight ?? "")
  },
  node: {
    borderThickness: () => 2,
    borderColor: () => "#343434",
    fillingColor: () => "#FFFFFF",
    floatingData: node => String(node.id),
    popupData: () => []
  }
};

class NetworkGraphRenderer extends AbstractGraphRenderer implements GraphRenderer {
  public nodes: D3SimulationNode[];
  public edges: D3SimulationEdge[];
  public canvas: HTMLCanvasElement;
  public simulation: d3.Simulation<D3SimulationNode, D3SimulationEdge>;
  public patcher: DeepPartial<RenderHints>;
  public directed: boolean;
  public renderType: "generic" | "bipartite";
  public size: {
    width: number;
    height: number;
  };

  constructor(directed: boolean, renderType: "generic" | "bipartite", patcher: DeepPartial<RenderHints>) {
    super();
    this.directed = directed;
    this.renderType = renderType;
    this.patcher = patcher;
  }

  hint(category: string, name: string, ...args: any[]) {
    if (defaultRenderHints[category]?.[name] == null) {
      console.log(`WARNING: Render hint not found [${category},${name}]`);
      return undefined;
    }
    let renderHint = this.patcher?.[category]?.[name] || defaultRenderHints[category][name];
    if (typeof renderHint === "function") {
      return renderHint(...args) || defaultRenderHints[category][name](...args);
    } else {
      return renderHint;
    }
  }

  // update function
  // modify information and try to start/restart simulation and rendering
  onGraphUpdated(graph: Graph) {
    const nodes = graph.nodes().map(toD3NodeDatum);
    const edges = graph.edges().map(toD3EdgeDatum);
    if (this.simulation == null) {
      this.nodes = nodes;
      this.edges = edges;
      this.simulation = d3
        .forceSimulation(this.nodes)
        .force("link", d3.forceLink(this.edges).distance(edge => 100)) // default id implement may work
        .force("charge", d3.forceManyBody().strength(this.hint("general", "simulationForceManyBodyStrength")))
        .force("box", this.boxConstraint());
      if (this.renderType === "generic") {
        this.simulation.force("center", d3.forceCenter(this.size.width / 2, this.size.height / 2).strength(0.05));
      } else if (this.renderType === "bipartite") {
        this.simulation.force("bipartite", this.bipartiteConstraint());
      }
      const drag = d3
        .drag<HTMLCanvasElement, SimulationNodeDatum | undefined>()
        .subject(event => this.simulation.find(event.x, event.y))
        .on("start", event => {
          if (!event.active) this.simulation.alphaTarget(0.3).restart();
          if (this.renderType === "generic") event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        })
        .on("drag", event => {
          if (this.renderType === "generic") event.subject.fx = this.xInRange(event.x);
          event.subject.fy = this.yInRange(event.y);
        })
        .on("end", event => {
          if (!event.active) this.simulation.alphaTarget(0);
          if (this.renderType === "generic") event.subject.fx = null;
          event.subject.fy = null;
        });
      d3.select<HTMLCanvasElement, any>(this.canvas).call(drag);
      this.simulation
        .on("tick", () => this.render())
        .restart();
    } else {
      // fix position of nodes and copy edges
      this.simulation.stop();
      for (let i = 0; i < nodes.length; i++) {
        // only copy datum and keep information of location and velocity
        this.nodes[i].graphNode.datum = nodes[i].graphNode.datum;
      }
      // should we deep copy?
      this.edges = edges;
      // reset link force
      this.simulation.force("link", d3.forceLink(this.edges).distance(edge => 100));
      // restart behaviour?
      this.simulation.restart();
    }
  }

  onCanvasUpdated(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    let width = this.canvas.clientWidth, height = this.canvas.clientHeight;
    this.size = { width, height };
  }

  private static makeInRange(n: number, a: number, b: number): number {
    if (n < a) return a;
    if (n > b) return b;
    return n;
  }

  private xInRange(x: number): number {
    return NetworkGraphRenderer.makeInRange(
      x,
      this.hint("general", "nodeRadius"),
      this.size.width - this.hint("general", "nodeRadius")
    );
  }

  private yInRange(y: number): number {
    return NetworkGraphRenderer.makeInRange(
      y,
      this.hint("general", "nodeRadius"),
      this.size.height - this.hint("general", "nodeRadius")
    );
  }

  private boxConstraint(): Force<any, any> {
    return () => {
      this.nodes.forEach(node => {
        node.x = this.xInRange(node.x);
        node.y = this.yInRange(node.y);
      });
    };
  }

  private bipartiteConstraint(): Force<any, any> {
    return () => {
      this.nodes.forEach(node => {
        node.x = this.size.width * (node.graphNode.datum.side === "left" ? 0.333 : 0.667);
        node.y = this.yInRange(node.y);
      });
    };
  }

  render() {
    if (this.canvas == null) return;

    const ctx = this.canvas.getContext("2d");
    const backgroundColor = this.hint("general", "backgroundColor");
    const { width, height } = this.size;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    this.edges.forEach(edge => this.renderEdge(ctx, edge));
    this.nodes.forEach(node => this.renderNode(ctx, node));
  }

  renderEdge(ctx: CanvasRenderingContext2D, edge: D3SimulationEdge) {
    ctx.font = "15px monospace";
    const {
      source: { x: sx, y: sy },
      target: { x: tx, y: ty },
      graphEdge
    } = edge;
    const nodeRadius = this.hint("general", "nodeRadius");

    // Draw line
    ctx.beginPath();
    ctx.fillStyle = ctx.strokeStyle = this.hint("edge", "color", graphEdge);
    ctx.lineWidth = this.hint("edge", "thickness", graphEdge);
    ctx.moveTo(sx, sy);
    ctx.lineTo(tx, ty);
    ctx.stroke();

    // Draw arrow
    if (this.directed) {
      const dx = tx - sx,
        dy = ty - sy;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const sin = dy / distance,
        cos = dx / distance;
      const a = 10; // TODO: Configurable arrow size
      const px0 = tx - nodeRadius * cos,
        py0 = ty - nodeRadius * sin;
      const px1 = px0 - a * cos + a * sin,
        px2 = px0 - a * cos - a * sin;
      const py1 = py0 - a * sin - a * cos,
        py2 = py0 - a * sin + a * cos;

      ctx.beginPath();
      ctx.moveTo(px0, py0);
      ctx.lineTo(px1, py1);
      ctx.lineTo(px2, py2);
      ctx.fill();
    }

    // Draw floating data
    ctx.fillStyle = this.hint("general", "textColor");
    ctx.lineWidth = 1;
    ctx.fillText(this.hint("edge", "floatingData", graphEdge), (sx + tx) / 2, (sy + ty) / 2);
  }

  renderNode(ctx: CanvasRenderingContext2D, node: D3SimulationNode) {
    ctx.font = "18px monospace";
    const nodeRadius = this.hint("general", "nodeRadius");
    const { x, y, graphNode } = node;

    ctx.beginPath();

    ctx.strokeStyle = this.hint("node", "borderColor", graphNode);
    ctx.lineWidth = this.hint("node", "borderThickness", graphNode);
    ctx.moveTo(x + nodeRadius, y);
    ctx.arc(x, y, nodeRadius, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.fillStyle = this.hint("node", "fillingColor", graphNode);
    ctx.fill();

    ctx.fillStyle = this.hint("general", "textColor");
    ctx.lineWidth = 1;
    ctx.fillText(this.hint("node", "floatingData", graphNode), x, y);

    // TODO: Render popup data
  }

  cleanup(): void {
    if (this.simulation) {
      this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.simulation.stop();
      d3.select(this.canvas).on(".drag", null);
      this.simulation = null;
    }
  }
}

export default NetworkGraphRenderer;
