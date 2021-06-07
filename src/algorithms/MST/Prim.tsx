import { NewGraphAlgorithm, ParameterDescriptor, Step } from "@/GraphAlgorithm";
import CanvasGraphRenderer from "@/ui/render/NetworkGraphRenderer";
import { Graph } from "@/GraphStructure";
import { GraphRenderer } from "@/ui/render/GraphRenderer";
import GraphMatrixInput from "@/ui/input/GraphMatrixInput";
import { EdgeListFormatter } from "@/ui/input/GraphFormatter";

export class Prim implements NewGraphAlgorithm {
  category: string = "MST";
  name: string = "Prim";
  description: string = "Prim";
  graphInputComponent = (
    <GraphMatrixInput
      checker={g => g}
      description={"Please input an weighted & undirected graph, and please ensure that the graph is connected"}
      formatters={[new EdgeListFormatter(true, false)]}
    />
  );
  graphRenderer: GraphRenderer = new CanvasGraphRenderer(true, "generic", {
    node: {
      fillingColor: undefined,
      floatingData: undefined
    },
    edge: {
      color: edge => (edge.datum.chosen ? "#db70db" : undefined),
      floatingData: edge => edge.datum.weight
    }
  });
  parameters: ParameterDescriptor[] = [];

  *run(graph: Graph): Generator<Step> {
    //并查集初始化
    for (let i = 0; i < graph.nodes().length; i++) {
      graph.nodes()[i].datum = { visited: false };
    }

    for (let i = 0; i < graph.edges().length; i++) {
      graph.edges()[i].datum.chosen = 0;
    }

    //Prim
    graph.nodes()[0].datum.visited = true;
    yield {
      graph: graph,
      codePosition: new Map<string, number>([["pseudo", 0]])
    };

    for (let i = 0; i < graph.nodes().length - 1; i++) {
      let tarIdx = 0;
      let minl = Infinity;
      for (let i = 0; i < graph.edges().length; i++) {
        if (
          (graph.nodes()[graph.edges()[i].source].datum.visited ^
            graph.nodes()[graph.edges()[i].target].datum.visited) ==
            1 &&
          graph.edges()[i].datum.weight < minl
        ) {
          tarIdx = i;
          minl = graph.edges()[i].datum.weight;
        }
      }

      graph.nodes()[graph.edges()[tarIdx].source].datum.visited = true;
      graph.nodes()[graph.edges()[tarIdx].target].datum.visited = true;
      graph.edges()[tarIdx].datum.chosen = 1;

      yield {
        graph: graph,
        codePosition: new Map<string, number>([["pseudo", 1]])
      };
      yield {
        graph: graph,
        codePosition: new Map<string, number>([["pseudo", 2]])
      };
    }

    yield {
      graph: graph,
      codePosition: new Map<string, number>([["pseudo", 3]])
    };
  }
}
