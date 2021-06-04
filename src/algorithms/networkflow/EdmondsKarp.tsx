import { NewGraphAlgorithm, ParameterDescriptor, parseRangedInt, Step } from "@/GraphAlgorithm";
import { Graph, Node, NodeEdgeList } from "@/GraphStructure";
import { Queue } from "@/utils/DataStructure";
import { NetworkFlowBase, _Edge, v, cm, c, noSelfLoop } from "./Common";
import CanvasGraphRenderer from "@/ui/CanvasGraphRenderer";
import { GraphRenderer } from "@/ui/GraphRenderer";
import GraphMatrixInput from "@/ui/input-methods/GraphMatrixInput";
import { NetworkFormatter } from "@/ui/input-methods/GraphFormatter";

export class NewEdmondsKarp implements NewGraphAlgorithm {
  category: string = "network flow";
  name: string = "Edmonds-Karp";
  description: string = "Edmonds-Karp algorithm for Maximum Network Flow";

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
          case 1: // in queue
            return cm.get(c.Blue | c.light);
          case 2: // checking
            return cm.get(c.Yellow | c.light);
          case 3: // checked
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
  private que: Queue<number> = new Queue<number>();

  private E: NetworkFlowBase;
  private V: Node[] = [];
  private n: number = 0;
  private S: number;
  private T: number;
  private delta: number = 0;
  private maxflow: number = 0;

  private pre: number[] = [];
  private eid: number[] = [];
  private flw: number[] = [];
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

  mark() {
    this.E.clearEdgeMark();
    for (let pos = this.T; pos !== this.S; pos = this.pre[pos]) this.E.edge[this.eid[pos]].mark = true;
  }

  flip() {
    for (let pos = this.T; pos !== this.S; pos = this.pre[pos]) {
      this.E.edge[this.eid[pos]].flow -= this.delta;
      this.E.edge[this.eid[pos] ^ 1].flow += this.delta;
    }
  }

  *bfs() {
    this.que.clear();
    this.clear(this.eid);
    this.clear(this.pre);
    this.clear(this.flw, Infinity);
    this.clear(this.tag, 0);

    this.que.push(this.S);
    this.tag[this.S] = 1;
    this.pre[this.S] = 0;
    yield this.getStep(1);

    while (!this.que.empty()) {
      let pos = this.que.front();
      this.tag[pos] = 2;
      this.que.pop();
      yield this.getStep(1);

      if (pos === this.T) {
        this.clear(this.tag, 0);
        this.mark();
        yield this.getStep(1);
        return true;
      }
      let e: _Edge;
      for (let i = this.E.head[pos]; i !== -1; i = e.next) {
        e = this.E.edge[i];
        if (this.pre[e.to] === -1 && e.flow > 0) {
          e.mark = true;
          this.que.push(e.to);
          this.tag[e.to] = 1;
          this.pre[e.to] = pos;
          this.eid[e.to] = i;
          this.flw[e.to] = Math.min(this.flw[pos], e.flow);
          yield this.getStep(1);
        }
      }

      this.tag[pos] = 3;
      yield this.getStep(1);
    }

    return false;
  }

  *run(G: Graph, Spos: number, Tpos: number): Generator<Step> {
    this.V = G.nodes();
    this.n = this.V.length;
    this.E = new NetworkFlowBase(G, this.n);
    [this.S, this.T] = [Spos, Tpos];
    this.delta = this.maxflow = 0;
    while (yield* this.bfs()) {
      this.delta = this.flw[this.T];
      this.maxflow += this.delta;
      yield this.getStep(2);
      this.flip();
      yield this.getStep(3, true);
      this.delta = 0;
    }
    yield this.getStep(4, true);
    //console.log(`algo EdmondsKarp : {flow: ${flow}}`);
    return { flow: this.maxflow };
  }
}
