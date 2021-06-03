import { NewGraphAlgorithm, ParameterDescriptor, parseRangedInt, Step } from "@/GraphAlgorithm";
import { Edge, Graph, Node, NodeEdgeList } from "@/GraphStructure";
import { Queue } from "@/utils/DataStructure";
import { NetworkFlowBase, _Edge, v, iv, noSelfLoop, cm, c } from "./Common";
import GraphMatrixInput from "@/ui/input-methods/GraphMatrixInput";
import { NetworkFormatter } from "@/ui/input-methods/GraphFormatter";
import { GraphRenderer } from "@/ui/GraphRenderer";
import CanvasGraphRenderer from "@/ui/CanvasGraphRenderer";

export class NewMinCostFlow implements NewGraphAlgorithm {
  category: string = "network flow";
  name: string = "Classic";
  description: string = "classic algorithm for Minimum-Cost Network Flow";

  graphInputComponent = (
    <GraphMatrixInput
      checker={noSelfLoop}
      description={"Please input a network flow graph with cost"}
      formatters={[new NetworkFormatter(true)]}
    />
  );
  graphRenderer: GraphRenderer = new CanvasGraphRenderer(true, "generic", {
    node: {
      borderColor: node => {
        if (node.datum.cur) return cm.get(c.Red);
        if (node.datum.dist !== Infinity) return cm.get(c.Green);
        return cm.get(c.Grey);
      },
      fillingColor: node => {
        if (node.datum.cur) return cm.get(c.Red | c.light);
        if (node.datum.dist !== Infinity) return cm.get(c.Green | c.light);
        return cm.get(c.Grey | c.light);
      },
      floatingData: node => `(${node.id},${iv(node.datum.dist)})`
    },
    edge: {
      thickness: edge => (edge.datum.mark !== 0 ? 5 : 3),
      color: edge => {
        if (edge.datum.mark) return cm.get((edge.datum.mark === 1 ? c.Green : c.Red) | c.dark);
        if (edge.datum.valid) return cm.get(c.Green | c.light);
        return cm.get(c.Grey);
      },
      floatingData: edge => `(${v(edge.datum.flow)},${v(edge.datum.used)}),${v(edge.datum.cost)}`
    }
  });
  parameters: ParameterDescriptor[] = [
    {
      name: "source_vertex",
      parser: (text, graph) => parseRangedInt(text, 0, graph.nodes().length)
    },
    {
      name: "target_vertex",
      parser: (text, graph) => parseRangedInt(text, 0, graph.nodes().length)
    },
    {
      name: "flow_limit",
      parser: (text, _) => {
        if (text === undefined || text === "") return undefined;
        if (["inf", "infty", "infinity"].includes(text)) return Infinity;
        let res = Number(text);
        if (isNaN(res)) throw new Error(".input.error.nan");
        if (res < 0) throw new Error(".input.error.out_of_range");
        return res;
      }
    }
  ];

  // old code
  private que: Queue<number> = new Queue<number>();

  private E: NetworkFlowBase;
  private V: Node[] = [];
  private n: number = 0;
  private S: number;
  private T: number;
  private maxflow: number = 0;
  private mincost: number = 0;
  private delta: number = 0;
  private current: number = -1;

  private dis: number[] = [];
  private pre: number[] = [];
  private eid: number[] = [];
  private vis: boolean[] = [];

  clear(buf: any[], val: any = -1, cnt: number = this.n) {
    for (let _ = 0; _ < cnt; ++_) buf[_] = val;
  }

  is_valid(e: Edge, eid: number): boolean {
    return this.dis[e.source] !== Infinity && this.dis[e.source] + this.E.edge[eid * 2].cost === this.dis[e.target];
  }

  report(clearMark: boolean): Graph {
    let resV = Array.from({ length: this.n }, (_, id) => ({
      id,
      datum: { dist: this.dis[id], cur: id === this.current }
    }));
    let resE = this.E.edges(clearMark);
    resE.forEach((e, i) =>
      Object.assign(e.datum, {
        valid: this.is_valid(e, i)
      })
    );

    return new NodeEdgeList(resV, resE);
  }

  getStep(stepId: number, clearMark: boolean = false): Step {
    return {
      graph: this.report(clearMark),
      codePosition: new Map<string, number>([["pseudo", stepId + 3]]),
      extraData: [
        ["$maxflow$", "number", this.maxflow],
        ["$mincost$", "number", this.mincost],
        ["$\\delta$", "number", this.delta],
        ["$dist$", "array", this.dis.map(d => iv(d))]
      ]
    };
  }

  *spfa() {
    this.clear(this.dis, Infinity);
    this.clear(this.pre);
    this.clear(this.eid);
    this.clear(this.vis, false);
    this.que.clear();

    this.dis[this.S] = 0;
    this.vis[this.S] = true;
    this.que.push(this.S);
    while (!this.que.empty()) {
      let pos = this.que.front();
      this.current = pos;
      this.que.pop();
      this.vis[pos] = false;
      yield this.getStep(1);
      let e: _Edge, tmp: number;
      for (let i = this.E.head[pos]; i !== -1; i = e.next) {
        e = this.E.edge[i];
        tmp = this.dis[pos] + e.cost;
        if (e.flow > 0 && this.dis[e.to] > tmp) {
          this.dis[e.to] = tmp;
          this.eid[e.to] = i;
          this.pre[e.to] = pos;
          if (!this.vis[e.to]) {
            this.vis[e.to] = true;
            this.que.push(e.to);
          }
        }
      }
    }
    return this.dis[this.T] !== Infinity;
  }

  *run(G: Graph, Spos: number, Tpos: number, limit: number = Infinity): Generator<Step> {
    this.V = G.nodes();
    this.n = this.V.length;
    this.E = new NetworkFlowBase(G, this.n);
    [this.S, this.T] = [Spos, Tpos];
    this.delta = this.maxflow = this.mincost = 0;
    while (limit > 0 && (yield* this.spfa())) {
      this.current = -1;
      yield this.getStep(1);
      this.delta = limit;
      let e: _Edge;
      for (let pos = this.T; pos !== this.S; pos = this.pre[pos]) {
        e = this.E.edge[this.eid[pos]];
        this.delta = Math.min(this.delta, e.flow);
        e.mark = true;
      }
      yield this.getStep(2);
      limit -= this.delta;
      this.maxflow += this.delta;
      this.mincost += this.delta * this.dis[this.T];
      for (let pos = this.T; pos !== this.S; pos = this.pre[pos]) {
        this.E.edge[this.eid[pos]].flow -= this.delta;
        this.E.edge[this.eid[pos] ^ 1].flow += this.delta;
      }
      yield this.getStep(3, true);
      this.delta = 0;
    }
    yield this.getStep(4);
    //console.log(`algo MinCostFlow : {flow: ${flow}, cost: ${cost}`);
    return { flow: this.maxflow, cost: this.mincost };
  }
}
