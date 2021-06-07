import { NewGraphAlgorithm, ParameterDescriptor, parseRangedInt, Step } from "@/GraphAlgorithm";
import { GraphRenderer } from "@/ui/render/GraphRenderer";
import { Graph, GridGraph } from "@/GraphStructure";
import GridGraphInput from "@/ui/input/GridGraphInput";
import GridGraphRenderer from "@/ui/render/GridGraphRenderer";
import { Queue } from "@/utils/DataStructure";

const step = (grids: number[][]) => new Step(new GridGraph(grids));
const positionParameter: (name: string) => ParameterDescriptor = name => (
  {
    name,
    parser: (text, graph: GridGraph) => {
      const parts = text.split(/\s+/);
      if (parts.length !== 2) {
        throw new Error(".input.error.bad_format");
      }
      const x = parseRangedInt(parts[0], 0, graph.width);
      const y = parseRangedInt(parts[1], 0, graph.height);
      if (graph.grids[y][x] !== 0) {
        throw new Error(".input.error.invalid_position");
      }
      return [x, y];
    }
  }
);

export class GridBFS implements NewGraphAlgorithm {
  category: string = "Grid";
  description: string = "BFS";
  graphInputComponent: JSX.Element = <GridGraphInput />;
  graphRenderer: GraphRenderer = new GridGraphRenderer(new Map(
    [[-1, "#000000"], // Border
      [0, "#FFFFFF"], // Space
      [1, "#8ef82e"], // Visited
      [2, "#fff545"], // In queue
      [3, "#2c5fee"], // Start point
      [4, "#cd11e2"], // End point
      [5, "#FF0000"]] // Path
  ));
  name: string = "BFS";
  parameters: ParameterDescriptor[] = [
    positionParameter("start"),
    positionParameter("end")
  ];

  * run(graph: Graph, [startX, startY]: [number, number], [endX, endY]: [number, number]): Generator<Step> {
    if (!(graph instanceof GridGraph)) {
      throw new Error("Unsupported Graph");
    }
    const dx = [0, 0, -1, 1], dy = [-1, 1, 0, 0];
    let grids = graph.grids;
    let pre = Array.from({ length: grids.length }, () => Array.from({ length: grids[0].length }, () => -1));
    let q = new Queue<[number, number]>();
    grids[startY][startX] = 3;
    grids[endY][endX] = 4;
    yield step(grids);

    q.push([startY, startX]);
    grids[startY][startX] = 2;
    yield step(grids);

    let found: boolean = false;
    while (!q.empty() && !found) {
      const [y, x] = q.front();
      q.pop();
      grids[y][x] = 1;
      for (let i = 0; i < 4; i++) {
        const [ny, nx] = [y + dy[i], x + dx[i]];
        if (ny < 0 || nx < 0 || ny >= grids.length || nx >= grids[0].length) {
          continue;
        }
        if (grids[ny][nx] === 0) {
          grids[ny][nx] = 2;
          pre[ny][nx] = i;
          q.push([ny, nx]);
        } else if (grids[ny][nx] === 4) {
          found = true;
          pre[ny][nx] = i;
          break;
        }
      }
      grids[startY][startX] = 3;
      yield step(grids);
    }

    let [y, x] = [endY, endX];
    for (; ;) {
      let predir = pre[y][x];
      [y, x] = [y - dy[predir], x - dx[predir]];
      if (x === startX && y === startY) {
        break;
      }
      grids[y][x] = 5;
    }
    yield step(grids);
  }
}