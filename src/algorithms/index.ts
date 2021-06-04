import { GraphAlgorithm, NewGraphAlgorithm } from "@/GraphAlgorithm";
import codeMap from "./codeMap";

import { BfsFindPath } from "@/algorithms/BFS&DFS/BfsFindPath";
import { DfsFindPath } from "@/algorithms/BFS&DFS/DfsFindPath";
import { CriticalPath } from "@/algorithms/CriticalPath/CriticalPath";
import { EulerPath } from "@/algorithms/EulerPath/EulerPath";
import { HamiltonPath } from "@/algorithms/HamiltonPath/HamiltonPath";
import { Kruskal } from "@/algorithms/MST/Kruskal";
import { Prim } from "@/algorithms/MST/Prim";
import { NewDijkstra } from "@/algorithms/SSSP/Dijkstra";
import { NewFord } from "@/algorithms/SSSP/Ford";
import { SalesmanPath } from "@/algorithms/TravelingSalesmanProblem/TravelingSalesmanProb";
import { SalesmanCheaperAlgo } from "@/algorithms/TravelingSalesmanProblem/SalesmanCheaperAlgo";

import { HungarianDFS } from "@/algorithms/matching/BipartiteMatching";
import { KuhnMunkres } from "@/algorithms/matching/WeightedBipartiteMatching";
import { Gabow } from "@/algorithms/matching/Matching";
import { DMP } from "@/algorithms/planargraph/DMP";

import { NewFordFulkerson } from "@/algorithms/networkflow/FordFulkerson";
import { NewEdmondsKarp } from "@/algorithms/networkflow/EdmondsKarp";
import { NewDinic } from "@/algorithms/networkflow/Dinic";
import { NewMinCostFlow } from "@/algorithms/networkflow/MinCostFlow";
import { NewZkwMCF } from "@/algorithms/networkflow/ZkwMCF";

const newAlgorithms: NewGraphAlgorithm[] = [
  new NewDijkstra(),
  new NewFord(),
  new NewEdmondsKarp(),
  new NewFordFulkerson(),
  new NewDinic(),
  new NewMinCostFlow(),
  new NewZkwMCF()
];

const algorithms = new Map<string, () => GraphAlgorithm>([
  ["BFS", () => new BfsFindPath()],
  ["DFS", () => new DfsFindPath()],
  ["CriticalPath", () => new CriticalPath()],
  ["EulerPath", () => new EulerPath()],
  ["HamiltonPath", () => new HamiltonPath()],
  ["Kruskal", () => new Kruskal()],
  ["Prim", () => new Prim()],
  ["SalesmanProblem", () => new SalesmanPath()],
  ["SalesmanCheaperAlgorithm", () => new SalesmanCheaperAlgo()],
  ["mbm_hungarian", () => new HungarianDFS()],
  ["mwbm_km", () => new KuhnMunkres()],
  ["mm_gabow", () => new Gabow()],
  ["pt_dmp", () => new DMP()]
]);

const newAlgorithm = name => algorithms.get(name)?.();

export { algorithms, codeMap, newAlgorithm, newAlgorithms };
