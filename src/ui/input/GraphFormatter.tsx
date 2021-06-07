import { BipartiteGraph, BipartiteMatrix, Edge, EdgeList, Graph } from "@/GraphStructure";

export interface GraphFormatter {
  name: string;
  toMatrix: (g: Graph) => number[][];
  fromMatrix: (m: number[][]) => Graph;
}

export class EdgeListFormatter implements GraphFormatter {
  name: string = "EdgeList";

  constructor(public readonly weighted: boolean, public readonly directed: boolean) {}

  fromMatrix(mat: number[][]): Graph {
    const [n, m] = mat[0];
    if (mat.length !== m + 1) {
      throw new Error(".input.error.edge_count_incorrect");
    }
    let edges: Edge[] = [];
    for (let i = 1; i <= m; i++) {
      if (this.weighted) {
        if (mat[i].length !== 3) {
          throw new Error(".input.error.edge_format_incorrect");
        }
        edges.push({ source: mat[i][0], target: mat[i][1], datum: { weight: mat[i][2] } });
      } else {
        if (mat[i].length !== 2) {
          throw new Error(".input.error.edge_format_incorrect");
        }
        edges.push({ source: mat[i][0], target: mat[i][1], datum: {} });
      }
    }
    return new EdgeList(n, edges);
  }

  toMatrix(g: Graph): number[][] {
    if (g == null) {
      return [];
    }
    let res: number[][] = [[g.nodes().length, g.edges().length]];
    EdgeList.from(g)
      .edges()
      .forEach(edge => {
        if (this.weighted) {
          if (edge.datum.weight == null) {
            throw new Error(".input.error.no_weight");
          }
          res.push([edge.source, edge.target, edge.datum.weight]);
        } else {
          res.push([edge.source, edge.target]);
        }
      });
    return res;
  }
}

export class NetworkFormatter implements GraphFormatter {
  name: string = "Network";

  constructor(public readonly have_cost: boolean) {}

  fromMatrix(mat: number[][]): Graph {
    const [n, m] = mat[0];
    if (mat.length !== m + 1) throw new Error(".input.error.edge_count_incorrect");
    let edges: Edge[] = [];
    for (let i = 1; i <= m; ++i) {
      if (this.have_cost) {
        if (mat[i].length !== 4) throw new Error(".input.error.edge_format_incorrect");
        edges.push({ source: mat[i][0], target: mat[i][1], datum: { flow: mat[i][2], cost: mat[i][3] } });
      } else {
        if (mat[i].length !== 3) throw new Error(".input.error.edge_format_incorrect");
        edges.push({ source: mat[i][0], target: mat[i][1], datum: { flow: mat[i][2] } });
      }
    }
    return new EdgeList(n, edges);
  }

  toMatrix(g: Graph): number[][] {
    if (g == null) {
      return [];
    }
    let res: number[][] = [[g.nodes().length, g.edges().length]];
    EdgeList.from(g)
      .edges()
      .forEach(edge => {
        if (edge.datum.flow == null) throw new Error(".input.error.network.no_flow");
        if (this.have_cost) {
          if (edge.datum.cost == null) throw new Error(".input.error.network.no_cost");
          res.push([edge.source, edge.target, edge.datum.flow, edge.datum.cost]);
        } else {
          res.push([edge.source, edge.target, edge.datum.flow]);
        }
      });
    return res;
  }
}

export class BipartiteListFormatter implements GraphFormatter {
  name: string = "BipartiteList";

  constructor(public readonly weighted: boolean) {}

  fromMatrix(mat: number[][]): Graph {
    const [nl, nr, m] = mat[0];
    if (mat.length !== m + 1) throw new Error(".input.error.edge_count_incorrect");
    let edges: Edge[] = [];
    for (let i = 1; i <= m; ++i) {
      if (this.weighted) {
        if (mat[i].length !== 3) throw new Error(".input.error.edge_format_incorrect");
        edges.push({ source: mat[i][0], target: mat[i][1], datum: { weight: mat[i][2] } });
      } else {
        if (mat[i].length !== 2) throw new Error(".input.error.edge_format_incorrect");
        edges.push({ source: mat[i][0], target: mat[i][1], datum: {} });
      }
    }
    return new BipartiteGraph(nl, nr, edges);
  }

  toMatrix(g: Graph): number[][] {
    if (g == null || !(g instanceof BipartiteGraph)) return [];
    let res: number[][] = [[g.leftSide.length, g.rightSide.length, g.edges().length]];
    g.edges().forEach(edge => {
      if (this.weighted) {
        if (edge.datum.weight == null) throw new Error(".input.error.no_weight");
        res.push([edge.source, edge.target, edge.datum.weight]);
      } else {
        res.push([edge.source, edge.target]);
      }
    });
    return res;
  }
}

export class BipartiteMatrixFormatter implements GraphFormatter {
  name: string = "BipartiteMatrix";

  constructor(public readonly weighted: boolean) {}

  fromMatrix(mat: number[][]): Graph {
    if (mat.length === 0) throw new Error(".input.error.empty");
    const [nl, nr] = [mat.length, mat[0].length];
    if (mat.some(line => line.length !== nr)) throw new Error(".input.error.not_matrix");
    if (this.weighted) return new BipartiteMatrix(mat.map(line => line.map(weight => ({ weight }))));
    let edges: Edge[] = [];
    mat.forEach((line, l) =>
      line.forEach((v, r) => {
        if (v !== 0) edges.push({ source: l, target: r + nl, datum: {} });
      })
    );
    return new BipartiteGraph(nl, nr, edges);
  }

  toMatrix(g: Graph): number[][] {
    if (g == null || !(g instanceof BipartiteGraph)) return [];
    if (this.weighted) {
      if (!(g instanceof BipartiteMatrix)) return [];
      return g.mat.map(line => line.map(({ weight }) => weight));
    }
    let [nl, nr] = [g.leftSide.length, g.rightSide.length];
    let res: number[][] = Array.from({ length: nl }, () => Array.from({ length: nr }, () => 0));
    g.edges().forEach(({ source, target }) => (res[source][target - nl] = 1));
    return res;
  }
}
