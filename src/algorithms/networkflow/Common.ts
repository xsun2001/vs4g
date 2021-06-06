import { Edge, Graph, hasSelfLoop } from "@/GraphStructure";
import CanvasGraphRenderer from "@/ui/CanvasGraphRenderer";

let v = x => x ?? "?";
let iv = x => (x === Infinity ? "∞" : v(x));
export { v, iv };

export enum c {
  Red = 1,
  Green = 2,
  Blue = 4,
  Yellow = 3,
  Grey = 8,
  light = 16,
  dark = 32
}

export const cm: Map<number, string> = new Map([
  [c.Red | c.light, "#ffbbbb"],
  [c.Red, "#ff7777"],
  [c.Red | c.dark, "#ff3333"],
  [c.Green | c.light, "#bbffbb"],
  [c.Green, "#77ff77"],
  [c.Green | c.dark, "#33ff33"],
  [c.Blue | c.light, "#bbbbff"],
  [c.Blue, "#7777ff"],
  [c.Blue | c.dark, "#3333ff"],
  [c.Grey | c.light, "#dddddd"],
  [c.Grey, "#bbbbbb"],
  [c.Yellow | c.light, "#eeee77"],
  [c.Yellow, "#eeee33"]
]);

export function noSelfLoop(g: Graph): Graph {
  if (hasSelfLoop(g)) throw new Error(".input.error.self_loop");
  return g;
}

export class _Edge {
  public mark: boolean = false;

  constructor(public to: number, public next: number, public flow: number, public cost?: number) {
  }
}

export class NetworkFlowBase {
  head: number[] = [];
  edge: _Edge[] = [];
  _edges: Edge[] = [];

  addedge(to: number, next: number, flow: number, cost?: number): number {
    return this.edge.push(new _Edge(to, next, flow, cost)) - 1;
  }

  constructor(G: Graph, n: number) {
    if (hasSelfLoop(G)) throw new Error("algo networkflow : self loop");
    for (let i = 0; i < n; ++i) this.head[i] = -1;
    this._edges = G.edges();
    this._edges.forEach(({ source: s, target: t, datum: d }) => {
      this.head[s] = this.addedge(t, this.head[s], d.flow, d.cost);
      this.head[t] = this.addedge(s, this.head[t], 0, -d.cost);
    });
  }

  clearEdgeMark() {
    this.edge.forEach(e => (e.mark = false));
  }

  edges(clearMark: boolean = true): Edge[] {
    this._edges.forEach((e, i) =>
      Object.assign(e.datum, {
        used: this.edge[i * 2 + 1].flow,
        mark: this.edge[i * 2].mark ? 1 : this.edge[i * 2 + 1].mark ? -1 : 0
      })
    );
    if (clearMark) this.clearEdgeMark();
    return this._edges;
  }
}

export class MaxFlowGraphRenderer extends CanvasGraphRenderer {
  constructor() {
    super(true, "generic", {
      node: {
        fillingColor: node => {
          switch (node.datum.tag) {
            case 1:
              return cm.get(c.Blue | c.light);
            case 2:
              return cm.get(c.Yellow | c.light);
            case 3:
              return cm.get(c.Green | c.light);
          }
          return cm.get(c.Grey | c.light);
        },
        floatingData: node => node.id.toString()
      },
      edge: {
        thickness: edge => (edge.datum.mark !== 0 ? 5 : 3),
        color: edge => {
          if (edge.datum.mark === 1) return cm.get(c.Green | c.dark);
          if (edge.datum.mark === -1) return cm.get(c.Red | c.dark);
          return cm.get(c.Grey);
        },
        floatingData: edge => `(${v(edge.datum.flow)},${v(edge.datum.used)})`
      }
    });
  }
}