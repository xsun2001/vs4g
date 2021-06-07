module.exports = {
  mf_ff:
    '<font color="#dddddd">灰色</font>点 $\\color{#dddddd}\\bullet$：[DFS] 未访问；  \n' +
    '<font color="#3333ff">蓝色</font>点 $\\color{#3333ff}\\bullet$：[DFS] 已访问，不在栈中；  \n' +
    '<font color="#dddd00">黄色</font>点 $\\color{#dddd00}\\bullet$：[DFS] 当前节点；  \n' +
    '<font color="#33ff33">绿色</font>点 $\\color{#33ff33}\\bullet$：[DFS] 已访问，在栈中；  \n' +
    "**加粗**边：在增广路中；  \n" +
    '<font color="#33ff33">绿色</font>边 $\\color{#33ff33}\\rightarrow$：**正向**出现在增广路中；  \n' +
    '<font color="#ff3333">红色</font>边 $\\color{#ff3333}\\rightarrow$：**反向**出现在增广路中；  \n' +
    '<font color="#dddddd">灰色</font>边 $\\color{#dddddd}\\rightarrow$：不在增广路中；  \n' +
    "边数据 $(c,f)$：$c$ 为容量，$f$ 为流量。",
  mf_ek:
    '<font color="#dddddd">灰色</font>点 $\\color{#dddddd}\\bullet$：[BFS] 未访问节点；  \n' +
    '<font color="#3333ff">蓝色</font>点 $\\color{#3333ff}\\bullet$：[BFS] 已访问，在队中；  \n' +
    '<font color="#dddd00">黄色</font>点 $\\color{#dddd00}\\bullet$：[BFS] 队首节点；  \n' +
    '<font color="#33ff33">绿色</font>点 $\\color{#33ff33}\\bullet$：[BFS] 已出队；  \n' +
    "**加粗**边：在增广路中；  \n" +
    '<font color="#33ff33">绿色</font>边 $\\color{#33ff33}\\rightarrow$：**正向**出现在增广路中；  \n' +
    '<font color="#ff3333">红色</font>边 $\\color{#ff3333}\\rightarrow$：**反向**出现在增广路中；  \n' +
    '<font color="#dddddd">灰色</font>边 $\\color{#dddddd}\\rightarrow$：不在增广路中；  \n' +
    "边数据 $(x,y)$：$x$ 为容量，$y$ 为流量。",
  mf_dinic:
    '<font color="#bbbbbb">灰色</font>点 $\\color{#bbbbbb}\\bullet$：不在分层图中；  \n' +
    '<font color="#77ff77">绿色</font>点 $\\color{#77ff77}\\bullet$：在分层图中；  \n' +
    '<font color="#ff7777">红色</font>点 $\\color{#ff7777}\\bullet$：[BFS/DFS] 当前节点；  \n' +
    "点数据 $(id,dep)$：$id$ 为编号，$dep$ 为深度；  \n" +
    "**加粗**边：在增广路中；  \n" +
    '<font color="#33ff33">深绿色</font>边 $\\color{#33ff33}\\rightarrow$：**正向**出现在增广路中；  \n' +
    '<font color="#ff3333">深红色</font>边 $\\color{#ff3333}\\rightarrow$：**反向**出现在增广路中；  \n' +
    '<font color="#bbffbb">浅绿色</font>边 $\\color{#bbffbb}\\rightarrow$：**正向**出现在分层图中；  \n' +
    '<font color="#ffbbbb">浅红色</font>边 $\\color{#ffbbbb}\\rightarrow$：**反向**出现在分层图中；  \n' +
    '<font color="#dddddd">灰色</font>边 $\\color{#dddddd}\\rightarrow$： 不在分层图中；  \n' +
    "边数据 $(c,f)$：$c$ 为容量，$f$ 为流量。\n",
  mcf_classic:
    '<font color="#bbbbbb">灰色</font>点 $\\color{#bbbbbb}\\bullet$：不在最小费用图中；  \n' +
    '<font color="#77ff77">绿色</font>点 $\\color{#77ff77}\\bullet$：在最小费用图中；  \n' +
    '<font color="#ff7777">红色</font>点 $\\color{#ff7777}\\bullet$：[SPFA] 当前节点；  \n' +
    "点数据 $(id,d)$：$id$ 为编号，$d$ 为最短距离；  \n" +
    "**加粗**边：在增广路中；  \n" +
    '<font color="#33ff33">深绿色</font>边 $\\color{#33ff33}\\rightarrow$：**正向**出现在增广路中；  \n' +
    '<font color="#ff3333">深红色</font>边 $\\color{#ff3333}\\rightarrow$：**反向**出现在增广路中；  \n' +
    '<font color="#bbffbb">浅绿色</font>边 $\\color{#bbffbb}\\rightarrow$：在最小费用图中；  \n' +
    '<font color="#dddddd">灰色</font>边 $\\color{#dddddd}\\rightarrow$： 不在最小费用图中；  \n' +
    "边数据 $(c_a,f,c_o)$：$c_a$ 为容量，$f$ 为流量，$c_o$ 为费用。",
  mcf_zkw:
    '<font color="#bbbbbb">灰色</font>点 $\\color{#bbbbbb}\\bullet$：不在最小费用图中；   \n' +
    '<font color="#77ff77">绿色</font>点 $\\color{#77ff77}\\bullet$：在最小费用图中；   \n' +
    '<font color="#ff7777">红色</font>点 $\\color{#ff7777}\\bullet$：[SPFA/DFS] 当前节点；   \n' +
    "点数据 $(id,d)$：$id$ 为编号，$d$ 为最短距离；   \n" +
    "**加粗**边：在增广路中；  \n" +
    '<font color="#33ff33">深绿色</font>边 $\\color{#33ff33}\\rightarrow$：**正向**出现在增广路中；  \n' +
    '<font color="#ff3333">深红色</font>边 $\\color{#ff3333}\\rightarrow$：**反向**出现在增广路中；  \n' +
    '<font color="#bbffbb">浅绿色</font>边 $\\color{#bbffbb}\\rightarrow$：在最小费用图中；   \n' +
    '<font color="#dddddd">灰色</font>边 $\\color{#dddddd}\\rightarrow$： 不在最小费用图中；   \n' +
    "边数据 $(c_a,f,c_o)$：$c_a$ 为容量，$f$ 为流量，$c_o$ 为费用。",
  mbm_hungarian:
    '<font color="#eeeeee">灰色</font>点 $\\color{#eeeeee}\\bullet$：未检查的左侧点，未访问的右侧节点；  \n' +
    '<font color="#ffcccc">红色</font>点 $\\color{#ffcccc}\\circ$：已检查、未匹配的左侧节点，已访问的右侧节点；  \n' +
    '<font color="#ccffcc">绿色</font>点 $\\color{#ccffcc}\\bullet$：已匹配点；  \n' +
    '<font color="#cccccc">灰色</font>边 $\\color{#cccccc}\\leftrightarrow$：未匹配边；  \n' +
    '<font color="#33ff33">绿色</font>边 $\\color{#33ff33}\\leftrightarrow$：已匹配边；  \n' +
    '<font color="#ff3333">红色</font>边 $\\color{#ff3333}\\leftrightarrow$：增广路中的非匹配边。  ',
  mwbm_km: "",
  mm_gabow: "",

  pt_dmp: "",

  Dfs:
    "灰色点：尚未被访问  \n\
蓝色点：已被访问  \n\
黄色点：当前正被访问的点，且当前正在前进寻找未被访问的点  \n\
绿色点：当前正被访问的点，且当前由于无法前进正在后退",
  Bfs:
    "灰色点：尚未被访问  \n\
蓝色点：已被访问并入队  \n\
黄色点：点在队首，正在进行遍历其所有后继节点的操作  \n\
绿色点：已出队，不会被再次访问",
  CriticalPath:
    "灰色点：尚未进行拓扑排序  \n\
蓝色点：已进行拓扑排序  \n\
黄色点：已计算出到该节点的最长路径  \n\n\
蓝色边：未被访问  \n\
粉色边：已被访问",
  EulerPath: "灰色点：当前未被访问  \n\
蓝色点：当前正在被访问  \n\n\
蓝色边：未被访问  \n\
粉色边：已被访问",
  HamiltonPath:
    "灰色点：点不在当前的搜索路径上  \n\
蓝色点：点在当前的搜索路径上  \n\
黄色点：该点当前正在被访问  \n\n\
蓝色边：边不再当前的搜索路径上  \n\
粉色边：边在当前的搜索路径上",
  Dijkstra:
    "灰色点：点未被访问  \n\
蓝色点：该点为所有未被访问的点中dist值最小的点，当前正被访问  \n\
黄色点：该点为当前被访问的点的后继  \n\
绿色点：该点为当前被访问的点的后继且dist值已更新  \n\
淡粉色点：点已被访问  \n\n\
蓝色边：未被访问  \n\
粉色边：已被访问",
  Ford:
    "灰色点：当前未被访问  \n\
黄色点：当前与该点相连接的一条边正在被访问  \n\n\
蓝色边：当前未被访问  \n\
粉色边：当前正在被访问",
  Kruskal:
    "蓝色边：未被访问  \n\
黄色边：正在被访问  \n\
粉色边：已被访问且是最小生成树中的边  \n\
绿色边：已被访问且不是最小生成树中的边",
  Prim: "蓝色边：未被访问  \n\
粉色边：已被访问且是最小生成树中的边",
  TravelingSalesmanProb: "蓝色边：当前未被选择  \n\
粉色边：根据分支限界法思路，当前被选择的边",
  SalesmanCheaperAlgo: "蓝色边：当前未被选择  \n\
粉色边：当前回路中的边"
};
