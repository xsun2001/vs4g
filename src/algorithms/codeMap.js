module.exports = {
  mf_ff: {
    pseudo: [
      "伪代码中用到的一些概念：",
      "- **残量网络**：节点与原网络流图相同；原图中一条有向边 $e=(u,v)$ 对应着参量网络中 $e_1 = (u,v),e_2=(v,u)$ 两条**残量边**，其中 $e_1$ 的**剩余容量**为 $e$ 的容量减去流量，$e_2$ 的**剩余容量**为 $e$ 的流量。",
      "- **增广路**：这里定义为残量网络中从源点到汇点的、各残量边剩余容量均 $>0$ 的路径，它也对应着一条原网络流图中的路径（允许原图中的边反向出现在此路径中）。",
      "`1` （找增广路，DFS）使用DFS在残量网络中寻找增广路，若找到了一条增广路，转步骤`2`；若无法找到，转步骤`4`；",
      "`2` （计算增广流量）对增广路上所有残量边的剩余容量求最小值，得到能够增广的最大流量 $\\delta$，将$maxflow$ 增大 $\\delta$，转步骤`3`；",
      "`3` （增广）枚举增广路中每条边，若它正向出现在增广路中则将他的流量减去 $\\delta$，若反向则增加 $\\delta$，转步骤`1`；",
      "`4` 算法结束。"
    ]
  },
  mf_ek: {
    pseudo: [
      "伪代码中用到的一些概念：",
      "- **残量网络**：节点与原网络流图相同；原图中一条有向边 $e=(u,v)$ 对应着参量网络中 $e_1 = (u,v),e_2=(v,u)$ 两条**残量边**，其中 $e_1$ 的**剩余容量**为 $e$ 的容量减去流量，$e_2$ 的**剩余容量**为 $e$ 的流量。",
      "- **增广路**：这里定义为残量网络中从源点到汇点的、各残量边剩余容量均 $>0$ 的路径，它也对应着一条原网络流图中的路径（允许原图中的边反向出现在此路径中）。",
      "`1` （找增广路）使用BFS在残量网络中寻找增广路，若找到了一条增广路，转步骤`2`；若无法找到，转步骤`4`；",
      "`2` （计算增广流量）对增广路上所有残量边的剩余容量求最小值，得到能够增广的最大流量 $\\delta$，将$maxflow$ 增大 $\\delta$，转步骤`3`；",
      "`3` （增广）枚举增广路中每条边，若它正向出现在增广路中则将他的流量减去 $\\delta$，若反向则增加 $\\delta$，转步骤`1`；",
      "`4` 算法结束。"
    ]
  },
  mf_dinic: {
    pseudo: [
      "伪代码中用到的一些概念：",
      "- **残量网络**：节点与原网络流图相同；原图中一条有向边 $e=(u,v)$ 对应着参量网络中 $e_1 = (u,v),e_2=(v,u)$ 两条**残量边**，其中 $e_1$ 的**剩余容量**为 $e$ 的容量减去流量，$e_2$ 的**剩余容量**为 $e$ 的流量。",
      "- **增广路**：这里定义为残量网络中从源点到汇点的、各残量边剩余容量均 $>0$ 的路径，它也对应着一条原网络流图中的路径（允许原图中的边反向出现在此路径中）。",
      "- **分层图**：由节点**深度**诱导的一个残量网络的子图，其边集为所有①剩余容量 $>0$ 且②从深度为 $d(\\neq -1)$ 的节点指向深度为 $d+1$ 的节点的边。",
      "`1` （构建分层图，BFS）使用BFS，从**汇点**出发，只**反向**经过剩余容量 $>0$ 的残量边，求出各节点到汇点的深度（规定无法到达的节点深度为 $-1$），若源点的深度 $\\neq -1$（图中存在增广路），转步骤`2`；否则（图中无增广路），转步骤`5`；",
      "`2` （找增广路，DFS）使用DFS在**分层图**中寻找增广路，若找到增广路，转步骤`3`；若找不到（当前分层图中已无增广路），转步骤`4`；（在DFS的回溯过程中修改边的流量，变化量为当前分层图中经过这条边的所有增广路的增广流量之和，正负由边在增广路中的正反方向决定）",
      "`3` （累加增广流量）对增广路上所有残量边的剩余容量求最小值，累加到当前分层图的增广流量 $\\delta$ 中，转步骤`2`；",
      "`4` （累加最大流）将 $maxflow$ 增大 $\\delta$，将 $\\delta$ 重置为 $0$，转步骤`1`；",
      "`5` 算法结束。"
    ]
  },
  mcf_classic: {
    pseudo: [
      "伪代码中用到的一些概念：",
      "- **残量网络**：节点与原网络流图相同；原图中一条有向边 $e=(u,v)$ 对应着参量网络中 $e_1 = (u,v),e_2=(v,u)$ 两条**残量边**，其中 $e_1$ 的**剩余容量**为 $e$ 的容量减去流量，费用为 $e$ 的费用；$e_2$ 的**剩余容量**为 $e$ 的流量，费用为 $e$ 费用的相反数。",
      "- **最小费用图**：残量网络中把费用当作边权，只考虑剩余容量 $>0$ 的残量边的**最短路图**。",
      "- **增广路**：这里定义为残量网络中从源点到汇点的、各残量边剩余容量均 $>0$ 的**最小费用**路径，它也对应着一条原网络流图中的路径（允许原图中的边反向出现在此路径中）。",
      "`1` （构建最小费用图，SPFA）使用SPFA，在残量网络中，从源点出发，把费用当作边权，只经过剩余容量 $>0$ 的残量边，求出源点到各节点到汇点的最短距离（规定无法到达的节点深度为 $\\infty$），若源点到汇点的最短距离 $d_{st}< \\infty$，任取一条增广路，转步骤`2`；否则（图中无增广路），转步骤`4`；",
      "`2` （计算增广流量）对增广路上所有残量边的剩余容量求最小值，再对流量限制取最小值后得到能够增广的最大流量 $\\delta$，将$maxflow$ 增大 $\\delta$，将 $mincost$ 增大 $\\delta\\times d_{st}$，将流量限制减小 $\\delta$，转步骤`3`；",
      "`3` （增广）枚举增广路中每条边，若它正向出现在增广路中则将他的流量减去 $\\delta$，若反向则增加 $\\delta$，转步骤`1`；",
      "`4` 算法结束。"
    ]
  },
  mcf_zkw: {
    pseudo: [
      "伪代码中用到的一些概念：",
      "- **残量网络**：节点与原网络流图相同；原图中一条有向边 $e=(u,v)$ 对应着参量网络中 $e_1 = (u,v),e_2=(v,u)$ 两条**残量边**，其中 $e_1$ 的**剩余容量**为 $e$ 的容量减去流量，$e_2$ 的**剩余容量**为 $e$ 的流量。",
      "- **最小费用图**：残量网络中把费用当作边权，只考虑剩余容量 $>0$ 的残量边的**最短路图**。",
      "- **增广路**：这里定义为残量网络中从源点到汇点的、各残量边剩余容量均 $>0$ 的路径，它也对应着一条原网络流图中的路径（允许原图中的边反向出现在此路径中）。",
      "`1` （构建最小费用图，SPFA）使用SPFA，在残量网络中，从**汇点**出发，把费用当作边权，只**反向**经过剩余容量 $>0$ 的残量边，求出汇点到各节点到汇点的最短距离（规定无法到达的节点深度为 $\\infty$），若汇点到源点的最短距离 $d_{ts}< \\infty$，转步骤`2`；否则（图中无增广路），转步骤`5`；",
      "`2` （找增广路，DFS）使用DFS在**最小费用图**中寻找增广路，若找到增广路，转步骤`3`；若找不到（当前最小费用图中已无增广路），转步骤`4`；（在DFS的回溯过程中修改边的流量，变化量为当前分层图中经过这条边的所有增广路的增广流量之和，正负由边在增广路中的正反方向决定）",
      "`3` （累加增广流量）对增广路上所有残量边的剩余容量和当前流量限制求最小值，在流量限制中减去，累加到当前最小费用图的增广流量 $\\delta$ 中，转步骤`2`；",
      "`4` （累加最大流）将 $maxflow$ 增大 $\\delta$，将 $mincost$ 增大 $\\delta\\times d_{ts}$，将 $\\delta$ 重置为 $0$，转步骤`1`；",
      "`5` 算法结束。"
    ]
  },
  mbm_hungarian: {
    pseudo: [
      "伪代码中用到的一些概念：",
      "- **增广路**：这里定义为从左侧节点出发，依次交替经过非匹配边、匹配边，在右侧节点结束的一条路径；将增广路上的所有边的匹配状态（匹配/未匹配）翻转，将使匹配数 $+1$；",
      "- **检查**与**访问**：**检查**过表示**左侧**节点曾在步骤`1`中被选为全局增广路的出发点；**访问**过表示**右侧**节点曾在本轮寻找增广路的过程中被访问过。",
      "`1` （选定出发点）选择一个未**检查**过的左侧节点 $v_l$ 作为增广路的起点，清空所有右侧节点的**访问**标记，转步骤`2`；若所有左侧节点都被**检查**过，转步骤`5`；",
      "`2` （枚举相邻点）枚举所有与当前节点 $v_l$ 相连的、未**访问**过的右侧节点 $v_r$，转步骤 `3`；若枚举结束时仍未找到增广路，则回溯到上一层循环步骤（`1`或`2`）;",
      "`3` （寻找增广路）标记当前节点 $v_r$ 为已**访问**的，若 $v_r$ 未匹配，则找到了一条增广路，转步骤`4`；若 $v_r$ 与某左侧节点 $v_l'$ 匹配，则递归地尝试寻找从 $v_l'$ 出发的增广路，转步骤`2`；",
      "`4` （增广）翻转增广路上每条边的匹配状态，将匹配数 $matched$ 增大 $1$，转步骤`1`；",
      "`5` 算法结束。"
    ]
  },
  mwbm_km: {
    pseudo: [
      "<u>**NOTE**</u>: This Pseudo Code is partially simplified and does NOT strictly correspond to internal implementation.",
      "**function** <u>KuhnMunkres</u> ($\\mathrm{G}$):",
      [
        "**comment**:",
        [
          "Kuhn-Munkres Algorithm for Maximum Weighted Bipartite Matching, **return** maximum weighted matching of $\\mathrm{G}$",
          "$\\mathrm{G}=\\left(\\mathrm{X},\\mathrm{Y},\\mathrm{E}\\right)$: *weighted bipartite graph*;  $\\mathrm{X},\\mathrm{Y}$: *set* of *vertex*;  $\\mathrm{E}=\\left\\{e_{ij}=\\left(x_i,y_j,w_{ij}\\right)\\middle|x_i\\in\\mathrm{X},y_j\\in\\mathrm{Y}\\right\\}$: *set* of *edge*;  $w_{ij}$: *weight* of $e_{ij}$;  $lx_i,ly_j$: *label* of $x_i,y_j$;  $\\mathrm{S}$: *subset* of $\\mathrm{X}$;  $\\mathrm{T}$: *subset* of $\\mathrm{Y}$;  *tight-edge* $e_{ij}$: $lx_i+ly_j=w_{ij}$;  $\\mathrm{G}_l$: *tight-edge subgraph* of $\\mathrm{G}$;  $\\mathrm{P}_l$: *augmenting path* in $\\mathrm{G}_l$."
        ],
        "**for each** $x_i\\in\\mathrm{X}$:  $lx_i:=$ **maximum** of $w_{ij}$ **for each** $y_j\\in\\mathrm{Y}$.",
        "**for each** $y_j\\in\\mathrm{Y}$:  $ly_j:=0$.  $\\color\\red{\\bullet}$",
        "**for each** $x\\in\\mathrm{X}$:",
        [
          "$\\mathrm{S}:=\\left\\{x\\right\\}$, $\\mathrm{T}:=\\emptyset$.  $\\color\\red{\\bullet}$",
          "**do**:",
          [
            "**while** $\\exists$ *tight edge* $e_{ij}$ from $\\mathrm{S}$ to $\\mathrm{Y}\\backslash\\mathrm{T}$:",
            [
              "add $y_j$ to $\\mathrm{T}$.",
              "**if** $y_j$ is *matched* with $x_k$:  add $x_k$ to $\\mathrm{S}$.  $\\color\\red{\\bullet}$",
              "**else**:  found $\\mathrm{P}_l$ from $x$ to $y_j$, **go to** <u>augment</u>."
            ],
            "$\\delta :=$ **minimum** of  $lx_i+ly_j-w_{ij}$ **for each** $e_{ij}$ from $\\mathrm{S}$ to $\\mathrm{Y}\\backslash\\mathrm{T}$.",
            "**for each** $x_i\\in\\mathrm{S}$:  $lx_i := lx_i -\\delta$.",
            "**for each** $y_j\\in\\mathrm{T}$:  $ly_j := ly_j +\\delta$.  $\\color\\red{\\bullet}$"
          ],
          "**while** $\\nexists$ $\\mathrm{P}_l$."
        ]
      ],
      "<u>augment</u>:  $\\color\\red{\\bullet}$",
      [
        [
          "**for each** $e\\in\\mathrm{P}_l$: flip *matching status* of $e$ (*matched* $\\leftrightarrow$ *unmatched*).   $\\color\\red{\\bullet}$"
        ],
        "$maxweight := $ **summation** of $lx_i$ **for each** $x_i\\in\\mathrm{X}$ $+$  **summation** of $ly_j$ **for each** $y_j\\in\\mathrm{Y}$.",
        "$\\color\\red{\\bullet}$  **return** $maxweight$."
      ]
    ]
  },
  mm_gabow: {
    pseudo: [
      "<u>**NOTE**</u>: This Pseudo Code is partially simplified and does NOT strictly correspond to internal implementation.",
      "**function** <u>Gabow</u> (G):",
      [
        "**comment**:",
        [
          "Gabow Algorithm for Maximum Matching, **return** maximum matching of $\\mathrm{G}$.",
          "$\\mathrm{G}=\\left(\\mathrm{V},\\mathrm{E}\\right)$: *general undirected graph*;  $\\mathrm{P}$: *augmenting path* in $\\mathrm{G}$."
        ],
        "**function** <u>bfsFindAugmentingPathFrom</u> ($s$):",
        [
          "**comment**:",
          [
            "find *augmenting path* using **BFS**, **return** whether $\\exists$ $\\mathrm{P}$ from $s$.",
            "$s$: *start vertex*;  $\\mathrm{Q}$: *queue* for *outer vertex*;  $\\mathrm{F}_{uv}$: *tree flower*(*odd-length circle*) derived from $u$ and $v$."
          ],
          "clear $\\mathrm{Q}$, clear all mark **for each** $v\\in\\mathrm{V}$.",
          "mark $s$ as *outer*, push $s$ into $\\mathrm{Q}$.",
          "**while** $\\mathrm{Q}$ is not *empty*:",
          [
            "$v:=$ *front* of $\\mathrm{Q}$, pop $v$ from $\\mathrm{Q}$.",
            "**for each** $\\left(v,u\\right)\\in\\mathrm{E}$:",
            [
              "**if** $u$ is not *marked*:",
              [
                "**if** $u$ is *matched* with $t$:",
                ["mark $u$ as *inner*.", "mark $t$ as *outer*, push $t$ into $\\mathrm{Q}$."],
                "**else**:  **return** **true**.    **comment**:  found $\\mathrm{P}$ from $s$ to $u$."
              ],
              "**else if** $u$ is marked as *outer*:    **comment**:  found $\\mathrm{F}_{uv}$.",
              ["**for each** *inner* $t\\in\\mathrm{F}_{uv}$:", ["mark $t$ as *outer*, push $t$ into $\\mathrm{Q}$."]]
            ]
          ],
          "**return** **false**."
        ],
        "$matched:=0$.  $\\color\\red{\\bullet}$",
        "**for each** *unchecked* unmatched $v\\in\\mathrm{V}$:",
        [
          "**if** <u>bfsFindAugmentingPathFrom</u> ($v$):  $\\color\\red{\\bullet}$",
          [
            "**for each** $e\\in\\mathrm{P}$: flip *matching status* of $e$ (*matched* $\\leftrightarrow$ *unmatched*).",
            "$matched:=matched+1$.  $\\color\\red{\\bullet}$"
          ]
        ],
        "$\\color\\red{\\bullet}$  **return** $matched$."
      ]
    ]
  },
  pt_dmp: {
    pseudo: [
      "<u>**NOTE**</u>: This Pseudo Code is GREATLY simplified and does NOT strictly correspond to internal implementation.",
      "**function** <u>DMP</u> ($\\mathrm{G}$):",
      [
        "**comment**:",
        [
          "Demoucron-Malgrange-Pertuiset Algorithm for Planar Testing, **return** *planarity* of $\\mathrm{G}$.",
          "$\\mathrm{G}=\\left(\\mathrm{V},\\mathrm{E}\\right)$: *general undirected graph*;  $\\mathrm{BC}$: *set* of *biconnected component* of $\\mathrm{G}$."
        ],
        "**function** <u>dmpTest</u> ($\\mathrm{G}$):",
        [
          "**comment**:",
          [
            "test *planarity* of *biconnected component* using **DMP**, **return** *planarity* of $\\mathrm{G}$.",
            "$\\mathrm{G}=\\left(\\mathrm{V},\\mathrm{E}\\right)$: *biconnected component*;  $\\mathrm{G}'=\\left(\\mathrm{V}',\\mathrm{E}',\\mathrm{Faces}\\right)$: *planar embedding* of $\\mathrm{G}$;  $\\mathrm{Faces}$: *set* of *face* of $\\mathrm{G}$;  $\\mathrm{ValidFaces}_{fragment}\\subset\\mathrm{Faces}$: *set* of *embeddable face* for $fragment$;  $\\mathrm{Fragments}$: *set* of *fragment* of $\\mathrm{G}$ with respect to $\\mathrm{G}'$;  $\\mathrm{P}_{u,v}$: *path* from $u$ to $v$."
          ],
          "$\\color\\red{\\bullet}$  remove *self loop* and *multiple edges* $\\in\\mathrm{E}$, *vertex* whose *degree* $\\leq 2$ $\\in\\mathrm{}V$.  $\\color\\red{\\bullet}$",
          "**if** $\\left|\\mathrm{E}\\right|<9$ **or** $\\left|\\mathrm{V}\\right|<5$:  **return** **true**.",
          "**if** $\\left|\\mathrm{E}\\right|$ > $3\\left|\\mathrm{V}\\right|-6$:  **return** **false**.",
          "select *arbitrary* $\\left(u,v\\right)\\in\\mathrm{E}$, $\\mathrm{V}':=\\left\\{u,v\\right\\}$, $\\mathrm{E}':=\\left\\{\\left(u,v\\right)\\right\\}$, $\\mathrm{Faces}:=\\left\\{\\left[u,v\\right]\\right\\}$.  $\\color\\red{\\bullet}$",
          "**repeat**:",
          [
            "**if** $\\mathrm{Fragments}=\\emptyset$:  **return** **true**.",
            "**if** $\\exists \\ fragment\\in\\mathrm{Fragments}:\\mathrm{ValidFaces}_{i,fragment}=\\emptyset$:  **return** **false**.",
            "**if** $\\exists \\ fragment\\in\\mathrm{Fragments}:\\mathrm{ValidFaces}_{i,fragment}=\\left\\{face\\right\\}$:  $f_r:=fragment$, $f_a:=face$.",
            "**else**:  $f_r:=$ *arbitrary fragment* $\\in\\mathrm{Fragments}$, $f_a:=$ *arbitrary face* $\\in\\mathrm{ValidFace}_{i,f_r}.$",
            "$\\color\\red{\\bullet}$  select *arbitrary unique* $u,v\\in f_a\\cap f_r$, $\\mathrm{P}_{u,v}:=$ *path* $\\in f_r$ from $u$ to $v$.",
            "**for each** $v\\in\\mathrm{P}_{u,v}\\cap \\mathrm{V}$:  add $v$ into $\\mathrm{V}'$.",
            "**for each** $e\\in\\mathrm{P}_{u,v}\\cap \\mathrm{E}$:  add $e$ into $\\mathrm{E}'$.",
            "split $f_a$ into $newface_1,newface_2$ by $\\mathrm{P}_{u,v}$.",
            "replace $f_a\\in\\mathrm{Faces}$ with $newface_1,newface_2$.  $\\color\\red{\\bullet}$"
          ]
        ],
        "$\\color\\red{\\bullet}$  remove *self loop* and *multiple edges* $\\in\\mathrm{E}$, *vertex* whose *degree* $\\leq 2$ $\\in\\mathrm{}V$.  $\\color\\red{\\bullet}$",
        "**if** $\\left|\\mathrm{E}\\right|<9$ **or** $\\left|\\mathrm{V}\\right|<5$:  $planarity:=$ **true**, **go to** <u>end</u>.",
        "**if** $\\left|\\mathrm{E}\\right|$ > $3\\left|\\mathrm{V}\\right|-6$:  $planarity:=$ **false**, **go to** <u>end</u>.",
        "$planarity:=$ **true**.",
        "split $\\mathrm{G}$ into $\\mathrm{BC}$.  $\\color\\red{\\bullet}$",
        "**for each** $\\mathrm{G}_i\\in\\mathrm{BC}$:",
        ["**if** not <u>dmpTest</u> ($\\mathrm{G}_i$):", ["$planarity:=$ **false**, **go to** <u>end</u>."]]
      ],
      "<u>end</u>:",
      ["$\\color\\red{\\bullet}$  **return** $planarity$."]
    ]
  },
  Dfs: {
    pseudo: [
      "(1)从给定的点开始DFS，转步骤2；",
      "(2)判断是否可以继续前进，若是转步骤3，否转步骤4，若已回退至起点转步骤5；",
      "(3)前进至该节点的后继节点，转步骤2；",
      "(4)无法前进，回退至该节点的前驱，转步骤2；",
      "(5)算法结束；"
    ]
  },
  GridBfs: {
    pseudo: [
      "(1)起始点Dist(st) = 0，并将其放入队列中，转步骤2；",
      "(2)检查队列是否为空，若不空，转步骤3，否则转步骤6：",
      "(3)取出队首元素v，并执行pop操作使v出队。若v为结束点，转步骤5，否则转步骤4；",
      "(4)对于所有e(v, u)，更新Dist(u) = Dist(v) + 1，pre(u)为到达u的反向，并将v放入队列中，转步骤2；",
      "(5)根据pre数组提供的方向信息反向回退路径，算法结束；",
      "(5)没有找到合法路径，算法结束；"
    ]
  },
  Bfs: {
    pseudo: [
      "(1)起始点Dist(st) = 0，并将其放入队列中，转步骤2；",
      "(2)检查队列是否为空，若不空，转步骤3，否则转步骤5：",
      "(3)取出队首元素v，并执行pop操作使v出队，转步骤4；",
      "(4)对于所有e(v, u)，更新Dist(u) = Dist(v) + 1，并将v放入队列中，转步骤2；",
      "(5)算法结束；"
    ]
  },
  CriticalPath: {
    pseudo: [
      "(1)寻找任一无入边或入边已被全部访问的点，记录其拓扑序，若有点仍未访问，转步骤2，否则转步骤3；",
      "(2)访问该节点的所有出边，转步骤1；",
      "(3)拓扑排序完成，令i的初始值为0，转步骤4开始计算关键路径长度；",
      "(4)若i小于点的总数，转步骤5，否则转步骤6；",
      "(5)利用拓扑序为i的点更新其出边指向的点的路径长度，i←i+1，转步骤4；",
      "(6)算法结束，最长的路径长度即为关键路径长度；",
      "**温馨提示：进行拓扑排序后所有边将统一由已访问状态变为未访问状态，并在计算最长路径的过程中再次访问。**",
      "**温馨提示：本算法的实现过程可能与课本有细节上的不同，但是大体思路是一样的。**"
    ]
  },
  EulerPath: {
    pseudo: [
      "(1)从0号点开始DFS，转步骤2；",
      "(2)判断是否可以继续前进，若是转步骤3，否转步骤4，若已回退至起点转步骤5；",
      "(3)前进至该节点的后继节点，记录欧拉回路信息，转步骤2；",
      "(4)无法前进，回退至该节点的前驱，转步骤2；",
      "(5)算法结束；",
      "**温馨提示：若算法运行完毕时产生的不是一条回路或图中仍存在某些边未被访问，则该图不存在欧拉回路，请检查你的输入是否正确。**"
    ]
  },
  HamiltonPath: {
    pseudo: [
      "(1)从0号点开始DFS，转步骤2；",
      "(2)判断当前是否已找到哈密顿回路，若是则转步骤6，否则转步骤3；",
      "(3)判断是否可以继续前进，若是转步骤4，否转步骤5，若已回退至起点转步骤6；",
      "(4)前进至该节点的后继节点，转步骤2；",
      "(5)无法前进，回退至该节点的前驱，转步骤2；",
      "(6)算法结束；",
      "**温馨提示：若算法执行完毕图恢复至初始状态，则图不存在哈密顿回路，若存在一个粉色的圈，则该圈为哈密顿回路。**"
    ]
  },
  Dijkstra: {
    pseudo: [
      "(1)选择dist值最小的节点，转步骤2；",
      "(2)依次访问该节点的所有后继，转步骤3，若访问完毕转步骤4；",
      "(3)更新该节点后继的dist值，转步骤2；",
      "(4)该节点访问完毕，此后不会再被访问，若所有点都已被访问则转步骤5，否则转步骤1；",
      "(5)算法结束；"
    ]
  },
  Ford: {
    pseudo: [
      "(1)初始时，仅起点dist值为0，转步骤2；",
      "(2)依次遍历每一条边，转步骤3，若遍历完毕转步骤4；",
      "(3)对于边e(u,v)，dist(v) = min(dist(u) + e(u,v), dist(v))，转步骤2；",
      "(4)若遍历过程中未更新任何节点的dist值，转步骤5，否则转步骤2；",
      "(5)算法结束；"
    ]
  },
  Kruskal: {
    pseudo: [
      "(1)选择当前最短的边，转步骤2，若所有点都已在同一棵生成树中，转步骤3；",
      "(2)若加入该边图中不构成环，则保留该边，否则舍弃该边，转步骤1；",
      "(3)算法结束；",
      "**温馨提示：当选足n-1条边后，本算法会停止运行而不是继续访问剩余的边，但这不影响算法的正确性。**",
      "**温馨提示：若图不连通，则该算法只能分别生成其各极大连通子图的最小生成树。**"
    ]
  },
  Prim: {
    pseudo: [
      "(1)起初，生成树中只有0号节点，转步骤2；",
      "(2)选择与现有生成树距离最近的边加入生成树，转步骤3；",
      "(3)判断是否已得到全图的一棵生成树，若是则转步骤4，否则转步骤2；",
      "(4)算法结束；"
    ]
  },
  TravelingSalesmanProb: {
    pseudo: [
      "(1)按照边的长度依次选择最短的几条边，转步骤2；",
      "(2)判断选边是否合法并更新答案，转步骤3；",
      "(3)删除最新选择的边，若栈空则转步骤4，否则转步骤1；",
      "(4)算法结束；",
      '**温馨提示：边的大小排序及选择情况列在extra data中，若该边选中则其值前加有"-"，注意这不代表这条边权值为负。**',
      "**温馨提示：本算法的实现过程可能与课本有细节上的不同，但是大体思路是一样的。**"
    ]
  },
  SalesmanCheaperAlgo: {
    pseudo: [
      "(1)开始时，回路仅包含0号点，转步骤2；",
      "(2)寻找与回路最近的点，并将其加入与其距离最近的点旁边的合适位置使得扩大后的回路尽可能小，若已形成哈密顿回路，转步骤3；",
      "(3)算法结束；"
    ]
  }
};
