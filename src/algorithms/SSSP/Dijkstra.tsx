import { NewGraphAlgorithm, ParameterDescriptor, rangedIntParser, Step } from "@/GraphAlgorithm";
import CanvasGraphRenderer from "@/ui/CanvasGraphRenderer";
import { AdjacencyMatrix, Graph } from "@/GraphStructure";
import { GraphRenderer } from "@/ui/GraphRenderer";
import GraphMatrixInput from "@/ui/GraphMatrixInput";
import { EdgeListFormatter } from "@/ui/GraphFormatter";

type NodeState = "relaxing" | "updating" | "updated" | "relaxed" | string;
const stateColorMap: Map<NodeState, string> = new Map([
  ["relaxing", "#87ceeb"],
  ["updating", "#ffff00"],
  ["updated", "#adff2f"],
  ["relaxed", "#fff0f5"]
]);

export class Dijkstra implements NewGraphAlgorithm {
  category: string = "SSSP";
  name: string = "Dijkstra";
  description: string = "Dijkstra";
  graphInputComponent = <GraphMatrixInput checker={g => g}
                                          description={"Please input a weighted & directed graph"}
                                          formatters={[new EdgeListFormatter(true, true)]} />;
  graphRenderer: GraphRenderer = new CanvasGraphRenderer(true, "generic",
    {
      node: {
        fillingColor: node => stateColorMap.get(node.datum.state),
        floatingData: node => {
          let distStr = "?",
            dist = node.datum.dist;
          if (dist === Infinity) {
            distStr = "∞";
          } else if (dist != null) {
            distStr = String(dist);
          }
          return `(${node.id},${distStr})`;
        }
      },
      edge: {
        color: edge => (edge.datum.visited ? "#db70db" : undefined),
        floatingData: edge => edge.datum.dist
      }
    });
  parameters: ParameterDescriptor[] = [
    {
      name: "start_point",
      parser: rangedIntParser(0, (_, graph) => graph.nodes().length)
    }
  ];

  * run(graph: Graph, startPoint: number): Generator<Step> {
    let mat = AdjacencyMatrix.from(graph, true).mat.map(line => line.map(datum => (datum ? datum.weight || 1 : 0)));
    const getState = (id: number) => graph.nodes()[id].datum.state as NodeState;
    const setState = (id: number, state: NodeState = "") => (graph.nodes()[id].datum.state = state);
    const getDist = (id: number) => graph.nodes()[id].datum.dist as number;
    const setDist = (id: number, dist: number) => (graph.nodes()[id].datum.dist = dist);

    graph.nodes().forEach(n => {
      n.datum.state = "" as NodeState;
      n.datum.dist = Infinity;
    });
    setDist(startPoint, 0);

    for (let i = 0; i < graph.nodes().length; i++) {
      let minDist = Infinity;
      let point = -1;
      for (let j = 0; j < graph.nodes().length; j++) {
        if (getState(j) != "relaxed" && getDist(j) < minDist) {
          point = j;
          minDist = getDist(j);
        }
      }
      if (point < 0) {
        return;
      }
      setState(point, "relaxing");
      yield {
        graph: graph,
        codePosition: new Map<string, number>([["pseudo", 0]])
      };

      for (let j = 0; j < graph.nodes().length; j++) {
        if (getState(j) == "relaxed") {
          continue;
        }
        if (mat[point][j]) {
          setState(j, "updating");
          yield {
            graph: graph,
            codePosition: new Map<string, number>([["pseudo", 1]])
          };
          if (getDist(point) + mat[point][j] < getDist(j)) {
            setDist(j, getDist(point) + mat[point][j]);
            setState(j, "updated");
          } else {
            setState(j);
          }
          yield {
            graph: graph,
            codePosition: new Map<string, number>([["pseudo", 2]])
          };
        }
        for (let k = 0; k < graph.edges().length; k++) {
          if (graph.edges()[k].source == point && graph.edges()[k].target == j) {
            graph.edges()[k].datum.visited = true;
          }
        }
      }
      yield {
        graph: graph,
        codePosition: new Map<string, number>([["pseudo", 1]])
      };

      for (let j = 0; j < graph.nodes().length; j++) {
        setState(j, j == point || getState(j) == "relaxed" ? "relaxed" : "");
      }
      yield {
        graph: graph,
        codePosition: new Map<string, number>([["pseudo", 3]])
      };
    }

    yield {
      graph: graph,
      codePosition: new Map<string, number>([["pseudo", 4]])
    };
  }
}