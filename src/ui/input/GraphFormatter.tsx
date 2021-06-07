import {
  AdjacencyList,
  AdjacencyMatrix,
  BipartiteGraph,
  BipartiteMatrix,
  Edge,
  EdgeList,
  Graph,
  IncidenceMatrix
} from "@/GraphStructure";

export interface GraphFormatter {
  name: string;
  toMatrix: (g: Graph) => number[][];
  fromMatrix: (m: number[][]) => Graph;
}

function assertMatrix(mat: number[][], isSquare: boolean = false): void {
  let n = mat.length;
  if (n === 0) throw new Error(".input.error.empty");
  let m = mat[0].length;
  if (mat.some(line => line.length !== m)) throw new Error(".input.error.not_matrix");
  if (isSquare && m !== n) throw new Error(".input.error.not_square");
}
function assertSymmetry(mat: number[][]): void {
  assertMatrix(mat, true);
  if (mat.some((line, i) => line.some((value, j) => value !== mat[j][i]))) throw new Error(".input.error.asymmetric");
}
function assertInRange(v: number, lower_bound: number, upper_bound: number): void {
  if (v < lower_bound || v >= upper_bound) throw new Error(".input.erorr.out_of_range");
}

// oi style edge list
export class EdgeListFormatter implements GraphFormatter {
  name: string = "EdgeList (OI style)";

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
    edges.forEach(e => {
      assertInRange(e.source, 0, n);
      assertInRange(e.target, 0, n);
    });
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

export class AdjMatrixFormatter implements GraphFormatter {
  name: string = "AdjacencyMatrix";

  constructor(public readonly weighted: boolean, public readonly directed: boolean) {}

  fromMatrix(mat: number[][]): Graph {
    if (this.directed) assertMatrix(mat, true);
    else assertSymmetry(mat);
    return new AdjacencyMatrix(
      mat.map(line =>
        line.map(value => {
          if (this.weighted) return value !== -1 ? { weight: value } : undefined;
          return value !== 0 ? {} : undefined;
        })
      ),
      this.directed
    );
  }

  toMatrix(g: Graph): number[][] {
    if (g == null) return [];
    return AdjacencyMatrix.from(g, this.directed).mat.map(line =>
      line.map(datum => {
        if (this.weighted) return datum?.weight == undefined ? -1 : datum.weight;
        return datum == undefined ? 0 : 1;
      })
    );
  }
}

export class IncMatrixFormatter implements GraphFormatter {
  name: string = "IncidenceMatrix";

  constructor(public readonly directed: boolean) {}

  fromMatrix(mat: number[][]): Graph {
    assertMatrix(mat);
    return new IncidenceMatrix(mat, this.directed);
  }

  toMatrix(g: Graph): number[][] {
    return IncidenceMatrix.from(g).incmat;
  }
}

// textbook style edge list
export class TextbookEdgeListFormatter implements GraphFormatter {
  name: string = "EdgeList (textbook style)";

  constructor(public readonly weighted: boolean, public readonly directed: boolean) {}

  fromMatrix(mat: number[][]): Graph {
    assertMatrix(mat);
    if (mat.length !== (this.weighted ? 3 : 2)) throw new Error(".input.error.edge_count_incorrect");
    let [n, m] = [0, mat[0].length];
    let edges: Edge[] = [];
    for (let i = 0; i < m; i++) {
      n = Math.max(n, mat[0][i], mat[1][i]);
      if (this.weighted) edges.push({ source: mat[0][i], target: mat[1][i], datum: { weight: mat[2][i] } });
      else edges.push({ source: mat[0][i], target: mat[1][i], datum: {} });
    }
    edges.forEach(e => {
      assertInRange(e.source, 0, n);
      assertInRange(e.target, 0, n);
    });
    return new EdgeList(n, edges);
  }

  toMatrix(g: Graph): number[][] {
    if (g == null) return [];
    let edges: Edge[] = EdgeList.from(g).edges();
    let res: number[][] = [edges.map(e => e.source), edges.map(e => e.target)];
    if (this.weighted) res.push(edges.map(e => e.datum.weight));
    return res;
  }
}

export class ForwardListFormatter implements GraphFormatter {
  name: string = "ForwardList";

  constructor(public readonly weighted: boolean, public readonly directed: boolean) {}

  fromMatrix(mat: number[][]): Graph {
    if (mat.length !== (this.weighted ? 3 : 2)) throw new Error(".input.error.edge_count_incorrect");
    let adjlist: [number, any][][] = [];
    let [n, m] = [mat[0].length, 0];
    for (let s = 0; s < n; s++) {
      adjlist[s] = [];
      if (mat[0][s] < m) throw new Error(".input.error.non_increment");
      while (m < mat[0][s]) {
        if (mat[1][m] == null || (this.weighted && mat[2][m] == null)) throw new Error(".input.error.non_matrix");
        assertInRange(mat[1][m], 0, n);
        if (this.weighted) adjlist[s].push([mat[1][m], { weight: mat[2][m] }]);
        else adjlist[s].push([mat[1][m], {}]);
        ++m;
      }
    }
    return new AdjacencyList(adjlist);
  }

  toMatrix(g: Graph): number[][] {
    let adjlist = AdjacencyList.from(g, this.directed).adjlist;
    let [A, B, Z] = [[], [], []];
    let [n, m] = [g.nodes().length, 0];
    for (let s = 0; s < n; s++) {
      adjlist[s].forEach(([t, datum]) => {
        B[m] = t;
        if (this.weighted) Z[m] = datum.weight;
        ++m;
      });
      A[s] = m;
    }
    let res: number[][] = [A, B];
    if (this.weighted) res.push(Z);
    return res;
  }
}

export class AdjListFormatter implements GraphFormatter {
  name: string = "AdjacencyList";

  constructor(public readonly weighted: boolean, public readonly directed: boolean) {}

  fromMatrix(mat: number[][]): Graph {
    let n = mat.length;
    return new AdjacencyList(
      mat.map(line => {
        if (line.length === 0) throw new Error(".input.error.invalid_format");
        line.pop();
        if (this.weighted) {
          let m = line.length;
          let res: [number, any][] = [];
          if (m % 2 !== 0) throw new Error(".input.error.invalid_format");
          for (let i = 0; i < m; i += 2) {
            assertInRange(line[i], 0, n);
            res.push([line[i], { weight: line[i + 1] }]);
          }
          return res;
        }
        line.forEach(v => assertInRange(v, 0, n));
        return line.map(t => [t, {}]);
      })
    );
  }

  toMatrix(g: Graph): number[][] {
    return AdjacencyList.from(g, this.directed).adjlist.map(line => {
      if (this.weighted) {
        let res: number[] = [];
        line.forEach(([t, d]) => {
          res.push(t);
          res.push(d.weight);
        });
        return res.concat([-1]);
      }
      return line.map(([t, _]) => t).concat([-1]);
    });
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
    edges.forEach(e => {
      assertInRange(e.source, 0, n);
      assertInRange(e.target, 0, n);
    });
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
    edges.forEach(e => {
      assertInRange(e.source, 0, nl);
      assertInRange(e.target, nl, nl + nr);
    });
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
