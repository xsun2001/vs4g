import { BipartiteGraph, Edge } from "@/GraphStructure";

export class Int_AdjacencyList {
  public adjList: Edge[][];
  constructor(nodeCount: number, public edges: Edge[], undirected: number = 0) {
    this.adjList = [];
    for (let i = 0; i < nodeCount; ++i) this.adjList[i] = [];
    edges.forEach(({ source, target, datum }, id) => {
      this.adjList[source].push({ source, target, datum: Object.assign(datum, { id }) });
      if (undirected)
        this.adjList[target].push({
          source: target,
          target: source,
          datum: Object.assign(datum, { id: id * undirected })
        });
    });
  }

  static from(g: BipartiteGraph) {
    let lc = g.leftSide.length;
    let tmpE = g.edges().map(e => (e.source < lc ? e : { source: e.target, target: e.source, datum: e.datum }));
    return new Int_AdjacencyList(lc, tmpE);
  }
}
