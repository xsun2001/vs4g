import { NewGraphAlgorithm, ParameterDescriptor, parseRangedInt, Step } from "@/GraphAlgorithm";
import { Edge, Graph, Node, NodeEdgeList } from "@/GraphStructure";
import { Queue } from "@/utils/DataStructure";
import { NetworkFlowBase, _Edge, v, iv, noSelfLoop, cm, c } from "./Common";
import GraphMatrixInput from "@/ui/input/GraphMatrixInput";
import { NetworkFormatter } from "@/ui/input/GraphFormatter";
import { GraphRenderer } from "@/ui/render/GraphRenderer";
import NetworkGraphRenderer from "@/ui/render/NetworkGraphRenderer";

export class ZkwMCF implements NewGraphAlgorithm {
  category: string = "network flow";
  name: string = "mcf_zkw";
  description: string = "Zkw's algorithm for Minimum-Cost Network Flow";

  graphInputComponent = (
    <GraphMatrixInput
      checker={noSelfLoop}
      description={"Please input a network flow graph with cost"}
      formatters={[new NetworkFormatter(true)]}
    />
  );
  graphRenderer: GraphRenderer = new NetworkGraphRenderer(true, "generic", {
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
  private vis: boolean[] = [];

  clear(buf: any[], val: any = -1, cnt: number = this.n) {
    for (let _ = 0; _ < cnt; ++_) buf[_] = val;
  }

  _valid(pos: number, e: _Edge): boolean {
    return !this.vis[e.to] && this.dis[pos] === this.dis[e.to] + e.cost && e.flow > 0;
  }

  is_valid(e: Edge): number {
    if (this.dis[e.source] === this.dis[e.target] + e.datum.cost) return 1;
    return 0;
  }

  report(clearMark: boolean): Graph {
    let resV = Array.from({ length: this.n }, (_, id) => ({
      id,
      datum: { dist: this.dis[id], cur: id === this.current }
    }));
    let resE = this.E.edges(clearMark);
    resE.forEach(e =>
      Object.assign(e.datum, {
        valid: this.is_valid(e)
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
    this.clear(this.vis, false);
    this.que.clear();

    this.dis[this.T] = 0;
    this.vis[this.T] = true;
    this.que.push(this.T);
    while (!this.que.empty()) {
      let pos = this.que.front();
      this.current = pos;
      this.que.pop();
      this.vis[pos] = false;
      yield this.getStep(1);
      let e: _Edge, re: _Edge, tmp: number;
      for (let i = this.E.head[pos]; i !== -1; i = e.next) {
        e = this.E.edge[i];
        re = this.E.edge[i ^ 1];
        tmp = this.dis[pos] + re.cost;
        if (re.flow > 0 && this.dis[e.to] > tmp) {
          this.dis[e.to] = tmp;
          if (!this.vis[e.to]) {
            this.vis[e.to] = true;
            this.que.push(e.to);
          }
        }
      }
    }

    this.current = -1;
    return this.dis[this.S] !== Infinity;
  }

  *dfs(pos: number, lim: number) {
    this.current = pos;
    yield this.getStep(2);
    if (pos === this.T) {
      this.delta += lim;
      yield this.getStep(3);
      return lim;
    }
    this.vis[pos] = true;
    let e: _Edge, re: _Edge;
    let res = 0;
    for (let i = this.E.head[pos]; i !== -1; i = e.next) {
      e = this.E.edge[i];
      re = this.E.edge[i ^ 1];
      if (this._valid(pos, e)) {
        e.mark = true;
        let tmp = yield* this.dfs(e.to, Math.min(lim, e.flow));
        e.flow -= tmp;
        re.flow += tmp;
        lim -= tmp;
        res += tmp;
        e.mark = false;
        this.current = pos;
        yield this.getStep(2);
      }
      if (!lim) break;
    }
    return res;
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
      do {
        this.clear(this.vis, false);
        yield* this.dfs(this.S, limit);
        this.current = -1;
      } while (this.vis[this.T]);
      limit -= this.delta;
      this.maxflow += this.delta;
      this.mincost += this.delta * this.dis[this.S];
      yield this.getStep(4);
    }
    yield this.getStep(5);
    //console.log(`algo ZkwMCF : {flow: ${flow}, cost: ${cost}`);
    return { flow: this.maxflow, cost: this.mincost };
  }
}
