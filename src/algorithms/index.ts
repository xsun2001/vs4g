import codeMap from "./codeMap";
import { NewGraphAlgorithm } from "@/GraphAlgorithm";
import { Dfs } from "@/algorithms/BFS&DFS/Dfs"
import { Bfs } from "@/algorithms/BFS&DFS/Bfs"
import { CriticalPath } from "@/algorithms/CriticalPath/CriticalPath"
import { EulerPath } from "@/algorithms/EulerPath/EulerPath"
import { HamiltonPath } from "@/algorithms/HamiltonPath/HamiltonPath"
import { Kruskal } from "@/algorithms/MST/Kruskal"
import { Prim } from "@/algorithms/MST/Prim"
import { Dijkstra } from "@/algorithms/SSSP/Dijkstra";
import { Ford } from "@/algorithms/SSSP/Ford";
import { TravelingSalesmanProb } from "@/algorithms/TravelingSalesmanProblem/TravelingSalesmanProb";
import { SalesmanCheaperAlgo } from "@/algorithms/TravelingSalesmanProblem/SalesmanCheaperAlgo";

import { DMP_alpha } from "@/algorithms/planargraph/NewDMP";

import { HungarianDFS } from "@/algorithms/matching/BipartiteMatching";
import { KuhnMunkres_alpha } from "@/algorithms/matching/WeightedBipartiteMatching";
import { EdmondsGabow_alpha } from "@/algorithms/matching/Matching";

import { FordFulkerson } from "@/algorithms/networkflow/FordFulkerson";
import { EdmondsKarp } from "@/algorithms/networkflow/EdmondsKarp";
import { Dinic } from "@/algorithms/networkflow/Dinic";
import { MinCostFlow } from "@/algorithms/networkflow/MinCostFlow";
import { ZkwMCF } from "@/algorithms/networkflow/ZkwMCF";

const newAlgorithms: NewGraphAlgorithm[] = [
  new Dfs(),
  new Bfs(),
  new CriticalPath(),
  new EulerPath(),
  new HamiltonPath(),
  new Kruskal(),
  new Prim(),
  new Dijkstra(),
  new Ford(),
  new TravelingSalesmanProb(),
  new SalesmanCheaperAlgo(),
  new DMP_alpha(),
  new HungarianDFS(),
  new KuhnMunkres_alpha(),
  new EdmondsGabow_alpha(),
  new FordFulkerson(),
  new EdmondsKarp(),
  new Dinic(),
  new MinCostFlow(),
  new ZkwMCF()
];

export { codeMap, newAlgorithms };
