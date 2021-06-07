import { NewGraphAlgorithm, ParameterDescriptor, rangedIntParser, Step } from "@/GraphAlgorithm";
import CanvasGraphRenderer from "@/ui/render/NetworkGraphRenderer";
import { AdjacencyMatrix, Graph } from "@/GraphStructure";
import { GraphRenderer } from "@/ui/render/GraphRenderer";
import GraphMatrixInput from "@/ui/input/GraphMatrixInput";
import { EdgeListFormatter } from "@/ui/input/GraphFormatter";

export class Dfs implements NewGraphAlgorithm {
  category: string = "BfsDfs";
  name: string = "Dfs";
  description: string = "Dfs";
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
        node.datum.sequence == -1 || node.datum.sequence == undefined
          ? `(${node.id},?)`
          : `(${node.id},${node.datum.sequence})`
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

  dfn: number;

  *dfs(graph: AdjacencyMatrix, this_node: number): Generator<Step> {
    for (let i = 0; i < graph.nodes().length; i++) {
      if (graph.nodes()[i].datum.visited == 2 || graph.nodes()[i].datum.visited == 3) {
        graph.nodes()[i].datum.visited = 1;
      }
    }
    Object.assign(graph.nodes()[this_node].datum, { visited: 2, sequence: this.dfn });
    if (this.dfn == 0) {
      yield {
        graph: graph,
        codePosition: new Map<string, number>([["pseudo", 0]])
      };
    } else {
      yield {
        graph: graph,
        codePosition: new Map<string, number>([["pseudo", 2]])
      };
    }
    yield {
      graph: graph,
      codePosition: new Map<string, number>([["pseudo", 1]])
    };
    this.dfn++;
    for (let i = 0; i < graph.mat.length; i++) {
      if (!graph.nodes()[i].datum.visited && graph.get(this_node, i)) {
        yield* this.dfs(graph, i);
        for (let i = 0; i < graph.nodes().length; i++) {
          if (graph.nodes()[i].datum.visited == 2 || graph.nodes()[i].datum.visited == 3) {
            graph.nodes()[i].datum.visited = 1;
          }
        }
        graph.nodes()[this_node].datum.visited = 3;
        yield {
          graph: graph,
          codePosition: new Map<string, number>([["pseudo", 3]])
        };
        yield {
          graph: graph,
          codePosition: new Map<string, number>([["pseudo", 1]])
        };
      }
    }
  }

  *run(graph: Graph, start_point: number): Generator<Step> {
    this.dfn = 0;
    graph.nodes().forEach(n => ((n.datum.visited = 0), (n.datum.sequence = -1)));
    yield* this.dfs(AdjacencyMatrix.from(graph, true), start_point);
    for (let i = 0; i < graph.nodes().length; i++) {
      if (graph.nodes()[i].datum.visited == 2 || graph.nodes()[i].datum.visited == 3) {
        graph.nodes()[i].datum.visited = 1;
      }
    }
    yield {
      graph: graph,
      codePosition: new Map<string, number>([["pseudo", 4]])
    };
  }
}
