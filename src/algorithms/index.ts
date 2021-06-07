import codeMap from "./codeMap";

import { GridBFS } from "@/algorithms/Grid/GridBFS";

import { NewGraphAlgorithm } from "@/GraphAlgorithm";
import { Dijkstra } from "@/algorithms/SSSP/Dijkstra";
import { Ford } from "@/algorithms/SSSP/Ford";

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
  new GridBFS(),
  new Dijkstra(),
  new Ford(),
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
