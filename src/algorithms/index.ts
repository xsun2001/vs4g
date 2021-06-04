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

import { NewDMP_alpha } from "@/algorithms/planargraph/NewDMP";

import { NewHungarianDFS } from "@/algorithms/matching/BipartiteMatching";
import { NewKuhnMunkres_alpha } from "@/algorithms/matching/WeightedBipartiteMatching";
import { NewEdmondsGabow_alpha } from "@/algorithms/matching/Matching";

import { NewFordFulkerson } from "@/algorithms/networkflow/FordFulkerson";
import { NewEdmondsKarp } from "@/algorithms/networkflow/EdmondsKarp";
import { NewDinic } from "@/algorithms/networkflow/Dinic";
import { NewMinCostFlow } from "@/algorithms/networkflow/MinCostFlow";
import { NewZkwMCF } from "@/algorithms/networkflow/ZkwMCF";

const newAlgorithms: NewGraphAlgorithm[] = [
  new NewDijkstra(),
  new NewFord(),
  new NewDMP_alpha(),
  new NewHungarianDFS(),
  new NewKuhnMunkres_alpha(),
  new NewEdmondsGabow_alpha(),
  new NewFordFulkerson(),
  new NewEdmondsKarp(),
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
  ["SalesmanCheaperAlgorithm", () => new SalesmanCheaperAlgo()]
]);

const newAlgorithm = name => algorithms.get(name)?.();

export { algorithms, codeMap, newAlgorithm, newAlgorithms };
