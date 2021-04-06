import RandomGraphComponent from "@/ui/input-methods/RandomGraphComponent";
import AdjacencyMatrixComponent from "@/ui/input-methods/AdjacencyMatrixComponent";
import IncidenceMatrixComponent from "@/ui/input-methods/IncidenceMatrixComponent";
import EdgeListComponent from "@/ui/input-methods/EdgeListComponent";
import ForwardListComponent from "@/ui/input-methods/ForwardListComponent";
import NetworkGraphComponent from "@/ui/input-methods/NetworkGraphComponent";

const methods = new Map([
  ["random", RandomGraphComponent],
  ["adjmat", AdjacencyMatrixComponent],
  ["incmat", IncidenceMatrixComponent],
  ["edge_list", EdgeListComponent],
  ["fwd_list", ForwardListComponent],
  ["network", NetworkGraphComponent]
]);

export default methods;
