import { NewGraphAlgorithm, ParameterDescriptor, parseRangedInt, Step } from "@/GraphAlgorithm";
import { Edge, Graph, Node, NodeEdgeList } from "@/GraphStructure";
import { Queue } from "@/utils/DataStructure";
import { NetworkFlowBase, _Edge, v, cm, c, noSelfLoop } from "./Common";
import CanvasGraphRenderer from "@/ui/CanvasGraphRenderer";
import { GraphRenderer } from "@/ui/GraphRenderer";
import GraphMatrixInput from "@/ui/input-methods/GraphMatrixInput";
import { NetworkFormatter } from "@/ui/input-methods/GraphFormatter";

export class NewDinic implements NewGraphAlgorithm {
  category: string = "network flow";
  name: string = "Dinic";
  description: string = "Dinic algorithm for Maximum Network Flow";

  graphInputComponent = (
    <GraphMatrixInput
      checker={noSelfLoop}
      description={"Please input a network flow graph"}
      formatters={[new NetworkFormatter(false)]}
    />
  );
  graphRenderer: GraphRenderer = new CanvasGraphRenderer(true, "generic", {
    node: {
      borderColor: node => {
        if (node.datum.cur) return cm.get(c.Red);
        if (node.datum.dep !== -1) return cm.get(c.Green);
        return cm.get(c.Grey);
      },
      fillingColor: node => {
        if (node.datum.cur) return cm.get(c.Red | c.light);
        if (node.datum.depth !== -1) return cm.get(c.Green | c.light);
        return cm.get(c.Grey | c.light);
      },
      floatingData: node => `(${node.id},${v(node.datum.depth)})`
    },
    edge: {
      thickness: edge => (edge.datum?.mark !== 0 ? 5 : 3),
      color: edge => {
        if (edge.datum.mark) return cm.get((edge.datum.mark === 1 ? c.Green : c.Red) | c.dark);
        if (edge.datum.valid) return cm.get((edge.datum.valid === 1 ? c.Green : c.Red) | c.light);
        return cm.get(c.Grey);
      },
      floatingData: edge => `(${v(edge.datum.flow)},${v(edge.datum.used)})`
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
  private delta: number = 0;
  private current: number = -1;

  private dep: number[] = [];
  private cur: number[] = [];

  clear(buf: any[], val: any = -1, cnt: number = this.n) {
    for (let _ = 0; _ < cnt; ++_) buf[_] = val;
  }

  copy(dst: any[], src: any[], cnt: number = this.n) {
    for (let _ = 0; _ < cnt; ++_) dst[_] = src[_];
  }

  _valid(pos: number, e: _Edge): boolean {
    return this.dep[e.to] >= 0 && this.dep[pos] === this.dep[e.to] + 1 && e.flow > 0;
  }

  is_valid(e: Edge, eid: number): number {
    if (this._valid(e.source, this.E.edge[eid * 2])) return 1;
    if (this._valid(e.target, this.E.edge[eid * 2 + 1])) return -1;
    return 0;
  }

  report(clearMark: boolean): Graph {
    let resV = Array.from({ length: this.n }, (_, id) => ({
      id,
      datum: { depth: this.dep[id], cur: id === this.current }
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
        ["$\\delta$", "number", this.delta],
        ["$depth$", "array", this.dep]
      ]
    };
  }

  *bfs() {
    this.copy(this.cur, this.E.head);
    this.clear(this.dep);
    this.que.clear();

    this.que.push(this.T);
    this.dep[this.T] = 0;
    while (!this.que.empty()) {
      let pos = this.que.front();
      this.que.pop();
      this.current = pos;
      yield this.getStep(1);
      if (pos === this.S) return true;
      let e: _Edge, re: _Edge;
      for (let i = this.E.head[pos]; i !== -1; i = e.next) {
        e = this.E.edge[i];
        re = this.E.edge[i ^ 1];
        if (this.dep[e.to] === -1 && re.flow > 0) {
          this.dep[e.to] = this.dep[pos] + 1;
          this.que.push(e.to);
        }
      }
    }
    return false;
  }

  *dfs(pos: number, lim: number) {
    this.current = pos;
    yield this.getStep(2);
    if (pos === this.T) {
      this.delta += lim;
      yield this.getStep(3);
      return lim;
    }
    let e: _Edge, re: _Edge;
    let res = 0;
    for (let i = this.cur[pos]; i !== -1; this.cur[pos] = i = e.next) {
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

  *run(G: Graph, Spos: number, Tpos: number): Generator<Step> {
    this.V = G.nodes();
    this.n = this.V.length;
    this.E = new NetworkFlowBase(G, this.n);
    [this.S, this.T] = [Spos, Tpos];
    this.delta = this.maxflow = 0;
    while (yield* this.bfs()) {
      this.current = -1;
      yield this.getStep(1);
      this.delta = yield* this.dfs(this.S, Infinity);
      this.current = -1;
      this.maxflow += this.delta;
      this.delta = 0;
      yield this.getStep(4);
    }
    yield this.getStep(5);
    //console.log(`algo Dinic : {flow: ${flow}}`);
    return { flow: this.maxflow };
  }
}
