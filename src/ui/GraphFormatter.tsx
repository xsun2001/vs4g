import { Edge, EdgeList, Graph } from "@/GraphStructure";

export interface GraphFormatter {
  name: string;
  toMatrix: (g: Graph) => number[][];
  fromMatrix: (m: number[][]) => Graph;
}

export class EdgeListFormatter implements GraphFormatter {
  name: string = "EdgeList";

  constructor(
    public readonly weighted: boolean,
    public readonly directed: boolean) {
  }

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
    EdgeList.from(g).edges().forEach(edge => {
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