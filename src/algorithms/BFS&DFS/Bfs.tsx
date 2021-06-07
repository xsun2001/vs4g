import { NewGraphAlgorithm, ParameterDescriptor, rangedIntParser, Step } from "@/GraphAlgorithm";
import CanvasGraphRenderer from "@/ui/render/NetworkGraphRenderer";
import { AdjacencyMatrix, Graph } from "@/GraphStructure";
import { GraphRenderer } from "@/ui/render/GraphRenderer";
import GraphMatrixInput from "@/ui/input/GraphMatrixInput";
import { EdgeListFormatter } from "@/ui/input/GraphFormatter";

export class Bfs implements NewGraphAlgorithm {
  category: string = "BFS&DFS";
  name: string = "Bfs";
  description: string = "Bfs";
  graphInputComponent = (
    <GraphMatrixInput
      checker={g => g}
      description={"Please input an unweighted & directed graph"}
      formatters={[new EdgeListFormatter(false, true)]}
    />
  );
  graphRenderer: GraphRenderer = new CanvasGraphRenderer(true, "generic", {
    node: {
      fillingColor: node => {
        if (node.datum.visited == 1) {
          return "#87ceeb";
        } else if (node.datum.visited == 2) {
          return "#ffff00";
        } else if (node.datum.visited == 3) {
          return "#adff2f";
        } else {
          return undefined;
        }
      },
      floatingData: node =>
        node.datum.dist == -1 || node.datum.dist == undefined ? `(${node.id},?)` : `(${node.id},${node.datum.dist})`
    },
    edge: {
      color: undefined,
      floatingData: undefined
    }
  });
  parameters: ParameterDescriptor[] = [
    {
      name: "start_point",
      parser: rangedIntParser(0, (_: string, graph: Graph) => graph.nodes().length)
    }
  ];

  * run(graph: Graph, start_point: number): Generator<Step> {
    graph = AdjacencyMatrix.from(graph, true);
    graph.nodes().forEach(n => ((n.datum.visited = 0), (n.datum.dist = -1)));

    let que = [start_point],
      fr = 0,
      bk = 1;
    Object.assign(graph.nodes()[start_point].datum, { visited: 1, dist: 0 });
    yield {
      graph: graph,
      codePosition: new Map<string, number>([["pseudo", 0]])
    };
    while (fr != bk) {
      yield {
        graph: graph,
        codePosition: new Map<string, number>([["pseudo", 1]])
      };
      let cur_node = que[fr++],
        cur_data = graph.nodes()[cur_node].datum;
      graph.nodes()[cur_node].datum.visited = 2;
      yield {
        graph: graph,
        codePosition: new Map<string, number>([["pseudo", 2]])
      };
      for (let i = 0; i < graph.nodes().length; i++) {
        let i_data = graph.nodes()[i].datum;
        if (i_data.visited == false && (graph as AdjacencyMatrix).get(cur_node, i)) {
          Object.assign(i_data, { visited: 1, dist: cur_data.dist + 1 });
          que[bk++] = i;
        }
      }
      yield {
        graph: graph,
        codePosition: new Map<string, number>([["pseudo", 3]])
      };
      graph.nodes()[cur_node].datum.visited = 3;
    }

    yield {
      graph: graph,
      codePosition: new Map<string, number>([["pseudo", 4]])
    };
  }
}
