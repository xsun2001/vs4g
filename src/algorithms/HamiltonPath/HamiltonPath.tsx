import { NewGraphAlgorithm, ParameterDescriptor, Step } from "@/GraphAlgorithm";
import CanvasGraphRenderer from "@/ui/CanvasGraphRenderer";
import { AdjacencyMatrix, Graph } from "@/GraphStructure";
import { GraphRenderer } from "@/ui/GraphRenderer";
import GraphMatrixInput from "@/ui/GraphMatrixInput";
import { EdgeListFormatter } from "@/ui/GraphFormatter";

export class HamiltonPath implements NewGraphAlgorithm {
  category: string = "HamiltonPath";
  name: string = "HamiltonPath";
  description: string = "HamiltonPath";
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
      floatingData: undefined
    },
    edge: {
      color: edge => (edge.datum.chosen == true ? "#db70db" : undefined),
      floatingData: undefined
    }
  });
  parameters: ParameterDescriptor[] = [];

  successFlag: number;

  *dfs(graph: AdjacencyMatrix, this_node: number, nodeNum: number): Generator<Step> {
    for (let i = 0; i < graph.nodes().length; i++) {
      if (graph.nodes()[i].datum.visited == 2) {
        graph.nodes()[i].datum.visited = 1;
      }
    }
    Object.assign(graph.nodes()[this_node].datum, { visited: 2 });
    if (this_node == 0) {
      yield {
        graph: graph,
        codePosition: new Map<string, number>([["pseudo", 0]])
      };
    } else {
      yield {
        graph: graph,
        codePosition: new Map<string, number>([["pseudo", 3]])
      };
    }
    yield {
      graph: graph,
      codePosition: new Map<string, number>([["pseudo", 1]])
    };
    nodeNum++;
    if (nodeNum == graph.nodes().length && graph.get(this_node, 0)) {
      this.successFlag = 1;
      graph.nodes()[this_node].datum.visited = 1;
      for (let edge of graph.edges()) {
        if (edge.source == this_node && edge.target == 0) {
          edge.datum.chosen = true;
        }
      }
      return;
    }

    yield {
      graph: graph,
      codePosition: new Map<string, number>([["pseudo", 2]])
    };

    for (let i = 0; i < graph.mat.length; i++) {
      if (!graph.nodes()[i].datum.visited && graph.get(this_node, i)) {
        for (let edge of graph.edges()) {
          if (edge.source == this_node && edge.target == i) {
            edge.datum.chosen = true;
          }
        }
        yield* this.dfs(graph, i, nodeNum);
        if (this.successFlag == 1) {
          return;
        } else {
          for (let edge of graph.edges()) {
            if (edge.source == this_node && edge.target == i) {
              edge.datum.chosen = false;
            }
          }
        }
        for (let i = 0; i < graph.nodes().length; i++) {
          if (graph.nodes()[i].datum.visited == 2) {
            graph.nodes()[i].datum.visited = 1;
          }
        }
        graph.nodes()[this_node].datum.visited = 2;
        yield {
          graph: graph,
          codePosition: new Map<string, number>([["pseudo", 4]])
        };
      }
    }
    Object.assign(graph.nodes()[this_node].datum, { visited: 0 });
    nodeNum--;
  }

  *run(graph: Graph): Generator<Step> {
    graph.nodes().forEach(n => ((n.datum.visited = 0), (n.datum.sequence = -1)));
    graph.edges().forEach(e => (e.datum.chosen = false));
    yield* this.dfs(AdjacencyMatrix.from(graph, true), 0, 0);
    for (let i = 0; i < graph.nodes().length; i++) {
      if (graph.nodes()[i].datum.visited == 2) {
        graph.nodes()[i].datum.visited = 1;
      }
    }
    yield {
      graph: graph,
      codePosition: new Map<string, number>([["pseudo", 5]])
    };
  }
}
