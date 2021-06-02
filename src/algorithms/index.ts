import { GraphAlgorithm, NewGraphAlgorithm } from "@/GraphAlgorithm";
import codeMap from "./codeMap";

import { BfsFindPath } from "@/algorithms/BFS&DFS/BfsFindPath";
import { DfsFindPath } from "@/algorithms/BFS&DFS/DfsFindPath";
import { CriticalPath } from "@/algorithms/CriticalPath/CriticalPath";
import { EulerPath } from "@/algorithms/EulerPath/EulerPath";
import { HamiltonPath } from "@/algorithms/HamiltonPath/HamiltonPath";
import { Kruskal } from "@/algorithms/MST/Kruskal";
import { Prim } from "@/algorithms/MST/Prim";
import { Dijkstra, NewDijkstra } from "@/algorithms/SSSP/Dijkstra";
import { Ford } from "@/algorithms/SSSP/Ford";
import { SalesmanPath } from "@/algorithms/TravelingSalesmanProblem/TravelingSalesmanProb";
import { SalesmanCheaperAlgo } from "@/algorithms/TravelingSalesmanProblem/SalesmanCheaperAlgo";

import { FordFulkerson } from "@/algorithms/networkflow/FordFulkerson";
import { EdmondsKarp } from "@/algorithms/networkflow/EdmondsKarp";
import { Dinic } from "@/algorithms/networkflow/Dinic";
import { MinCostFlow } from "@/algorithms/networkflow/MinCostFlow";
import { ZkwMCF } from "@/algorithms/networkflow/ZkwMCF";
import { HungarianDFS } from "@/algorithms/matching/BipartiteMatching";
import { KuhnMunkres } from "@/algorithms/matching/WeightedBipartiteMatching";
import { Gabow } from "@/algorithms/matching/Matching";
import { DMP } from "@/algorithms/planargraph/DMP";

const newAlgorithms: NewGraphAlgorithm[] = [new NewDijkstra()];

const algorithms = new Map<string, () => GraphAlgorithm>([
  ["BFS", () => new BfsFindPath()],
  ["DFS", () => new DfsFindPath()],
  ["CriticalPath", () => new CriticalPath()],
  ["EulerPath", () => new EulerPath()],
  ["HamiltonPath", () => new HamiltonPath()],
  ["Kruskal", () => new Kruskal()],
  ["Prim", () => new Prim()],
  ["Dijkstra", () => new Dijkstra()],
  ["Ford", () => new Ford()],
  ["SalesmanProblem", () => new SalesmanPath()],
  ["SalesmanCheaperAlgorithm", () => new SalesmanCheaperAlgo()],
  ["mf_ff", () => new FordFulkerson()],
  ["mf_ek", () => new EdmondsKarp()],
  ["mf_dinic", () => new Dinic()],
  ["mcf_classic", () => new MinCostFlow()],
  ["mcf_zkw", () => new ZkwMCF()],
  ["mbm_hungarian", () => new HungarianDFS()],
  ["mwbm_km", () => new KuhnMunkres()],
  ["mm_gabow", () => new Gabow()],
  ["pt_dmp", () => new DMP()]
]);

const newAlgorithm = name => algorithms.get(name)?.();

export { algorithms, codeMap, newAlgorithm, newAlgorithms };
