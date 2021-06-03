import { Step, NewGraphAlgorithm, ParameterDescriptor, parseRangedInt } from "@/GraphAlgorithm";
import { Graph, Node, NodeEdgeList } from "@/GraphStructure";
import { NetworkFlowBase, _Edge, v, c, cm, noSelfLoop } from "./Common";
import CanvasGraphRenderer from "@/ui/CanvasGraphRenderer";
import { GraphRenderer } from "@/ui/GraphRenderer";
import GraphMatrixInput from "@/ui/input-methods/GraphMatrixInput";
import { NetworkFormatter } from "@/ui/input-methods/GraphFormatter";

export class NewFordFulkerson implements NewGraphAlgorithm {
  category: string = "network flow";
  name: string = "Ford-Fulkerson";
  description: string = "Ford-Fulkerson algorithm for Maximum Network Flow";

  graphInputComponent = (
    <GraphMatrixInput
      checker={noSelfLoop}
      description={"Please input a network flow graph"}
      formatters={[new NetworkFormatter(false)]}
    />
  );
  graphRenderer: GraphRenderer = new CanvasGraphRenderer(true, "generic", {
    node: {
      fillingColor: node => {
        switch (node.datum.tag) {
          case 1: // checked
            return cm.get(c.Blue | c.light);
          case 2: // checking
            return cm.get(c.Yellow | c.light);
          case 3: // in stack
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
  private E: NetworkFlowBase;
  private V: Node[] = [];
  private n: number = 0;
  private S: number;
  private T: number;
  private maxflow: number = 0;
  private delta: number = 0;

  private visit: boolean[] = [];
  private tag: number[] = [];

  clear(buf: any[], val: any = -1, cnt: number = this.n) {
    for (let _ = 0; _ < cnt; ++_) buf[_] = val;
  }

  getStep(stepId: number, clearMark: boolean = false): Step {
    return {
      graph: new NodeEdgeList(
        Array.from({ length: this.n }, (_, id) => ({ id, datum: { tag: this.tag[id] } })),
        this.E.edges(clearMark)
      ),
      codePosition: new Map<string, number>([["pseudo", stepId + 2]]),
      extraData: [
        ["$maxflow$", "number", this.maxflow],
        ["$\\delta$", "number", this.delta]
      ]
    };
  }

  *dfs(pos: number, lim: number) {
    this.visit[pos] = true;
    this.tag[pos] = 2;
    yield this.getStep(1);

    if (pos === this.T) {
      if (lim === 0) return false;
      this.delta = lim;
      this.maxflow += this.delta;
      yield this.getStep(2);
      return true;
    }
    let e: _Edge, re: _Edge;
    for (let i = this.E.head[pos]; i !== -1; i = e.next) {
      e = this.E.edge[i];
      re = this.E.edge[i ^ 1];
      if (this.visit[e.to] || e.flow === 0) continue;
      e.mark = true;
      this.tag[pos] = 3;
      if (yield* this.dfs(e.to, Math.min(lim, e.flow))) {
        e.flow -= this.delta;
        re.flow += this.delta;
        return true;
      }
      e.mark = false;
      this.tag[pos] = 2;
      yield this.getStep(1);
    }
    this.tag[pos] = 1;
    return false;
  }

  *run(G: Graph, Spos: number, Tpos: number): Generator<Step> {
    this.V = G.nodes();
    this.n = this.V.length;
    this.E = new NetworkFlowBase(G, this.n);
    [this.S, this.T] = [Spos, Tpos];
    this.delta = this.maxflow = 0;
    this.clear(this.tag, 0);
    while (true) {
      this.clear(this.visit, false);
      if (!(yield* this.dfs(this.S, Infinity))) break;
      yield this.getStep(3, true);
      this.clear(this.tag, 0);
      this.delta = 0;
    }
    yield this.getStep(4);
    //console.log(`algo FordFulkerson : {flow: ${flow}}`);
    return { flow: this.maxflow };
  }
}
