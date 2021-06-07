import { NewGraphAlgorithm, ParameterDescriptor, Step } from "@/GraphAlgorithm";
import { BipartiteGraph, Edge, Graph, Node, NodeEdgeList } from "@/GraphStructure";
import NetworkGraphRenderer from "@/ui/render/NetworkGraphRenderer";
import GraphMatrixInput from "@/ui/input/GraphMatrixInput";
import { GraphRenderer } from "@/ui/render/GraphRenderer";
import { BipartiteListFormatter, BipartiteMatrixFormatter } from "@/ui/input/GraphFormatter";
import { Int_AdjacencyList } from "@/algorithms/matching/Common";

export class HungarianDFS implements NewGraphAlgorithm {
  category: string = "Matching";
  name: string = "mbm_hungarian";
  description: string = "DFS version of Hungarian algorithm for Maximum Matching in Bipartite Graph";

  graphInputComponent = (
    <GraphMatrixInput
      formatters={[new BipartiteListFormatter(false), new BipartiteMatrixFormatter(false)]}
      checker={g => g}
      description={
        "Please input a bipartite graph\n firstline: nl nr m\n following m lines: l in range [0,nl), r in range [nl,nl+nr)"
      }
    />
  );
  graphRenderer: GraphRenderer = new NetworkGraphRenderer(false, "bipartite", {
    node: {
      borderColor: node => (node.datum.cur ? "#33ff33" : node.datum.used ? "#ff3333" : undefined),
      fillingColor: node => (node.datum.match !== -1 ? "#ccffcc" : "#eeeeee")
    },
    edge: {
      thickness: edge => (edge.datum.matched || edge.datum.marked ? 5 : undefined),
      color: edge => {
        if (edge.datum.matched) return "#33ff33";
        if (edge.datum.marked) return "#ff3333";
        return "#cccccc";
      }
    }
  });
  parameters: ParameterDescriptor[] = [];

  // old code
  private matched: number = 0;
  private current: number = -1;
  private edges: Edge[] = [];
  private nodes: Node[] = [];
  private adjlist: Int_AdjacencyList;

  report(): Graph {
    let resV = this.nodes;
    let resE = this.edges;
    resV.forEach(n => (n.datum.cur = n.id === this.current));
    return new NodeEdgeList(resV, resE);
  }

  getStep(stepId: number): Step {
    return {
      graph: this.report(),
      codePosition: new Map<string, number>([["pseudo", stepId + 2]]),
      extraData: [
        ["$matched$", "number", this.matched],
        ["$current$", "number", this.current]
      ]
    };
  }

  *dfs(pos: number) {
    this.current = pos;
    yield this.getStep(2);
    let sn = this.nodes[pos],
      sd = sn.datum;
    for (let e of this.adjlist.adjList[sn.id]) {
      let tn = this.nodes[e.target],
        td = tn.datum;
      if (!td.used) {
        td.used = true;
        this.edges[e.datum.id].datum.marked = true;
        this.current = tn.id;
        yield this.getStep(3);
        if (td.match === -1 || (yield* this.dfs(td.match))) {
          td.match = sn.id;
          sd.match = tn.id;
          return true;
        }
        this.edges[e.datum.id].datum.marked = false;
        this.current = pos;
        yield this.getStep(2);
      }
    }
    return false;
  }

  *run(graph: Graph): Generator<Step> {
    if (!(graph instanceof BipartiteGraph)) throw new Error();
    this.adjlist = Int_AdjacencyList.from(graph);
    this.nodes = graph.nodes();
    this.edges = graph.edges();
    let left = graph.leftSide,
      right = graph.rightSide;
    this.nodes.forEach(node => Object.assign(node.datum, { used: false, match: -1, cur: false }));
    this.edges.map(edge =>
      this.nodes[edge.source].datum.side === "left"
        ? edge
        : {
            source: edge.target,
            target: edge.source,
            datum: edge.datum
          }
    );
    this.edges.forEach(e => Object.assign(e.datum, { marked: false, matched: false }));
    this.matched = 0;
    for (let leftnode of left) {
      right.forEach(rightnode => (this.nodes[rightnode.id].datum.used = false));
      this.current = leftnode.id;
      yield this.getStep(1);
      if (yield* this.dfs(leftnode.id)) {
        this.edges.forEach(edge => (edge.datum.matched = this.nodes[edge.source].datum.match === edge.target));
        this.edges.forEach(edge => (edge.datum.marked = false));
        ++this.matched;
        yield this.getStep(4);
      } else this.nodes[leftnode.id].datum.used = true;
    }
    //console.log(`algo HungarianDFS : {matched: ${res}}`);
    yield this.getStep(5);
    return { matched: this.matched };
  }
}
