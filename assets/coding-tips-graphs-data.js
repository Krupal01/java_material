window.CT_GRAPHS = {
  topic: "Graphs",
  icon: "🕸️",
  range: "272–316",
  questions: [
    {
      id: 272,
      title:
        "Implement graph representation using adjacency list and adjacency matrix",
      problem:
        "Given V vertices and a list of edges, build both an adjacency list and an adjacency matrix representation of the graph.",
      examples: [
        {
          input: "V = 3, edges = [[0,1],[1,2]]",
          output: "list = [[1],[2],[]], matrix[0][1] = 1",
        },
        {
          input: "V = 4, edges = [[0,2],[2,3],[3,0]]",
          output: "list = [[2],[],[3],[0]], matrix[3][0] = 1",
        },
      ],
      tip: "Adjacency list is O(V+E) space and preferred; matrix is O(V²) but O(1) edge lookup",
      iteration: {
        hint: "List: array of ArrayList; Matrix: 2D int array with 1/0 for edges",
        snippet: `List<List<Integer>> adj = new ArrayList<>();\nfor(int i=0;i<V;i++) adj.add(new ArrayList<>());\nadj.get(u).add(v);\n// Matrix:\nint[][] mat = new int[V][V]; mat[u][v] = 1;`,
      },
      recursion: {
        hint: "Recursive DFS naturally traverses the adjacency list",
        snippet: `void dfs(int u, boolean[] vis, List<List<Integer>> adj) {\n    vis[u] = true;\n    for (int v : adj.get(u)) if (!vis[v]) dfs(v, vis, adj);\n}`,
      },
      stream: {
        hint: "Build adjacency list from edge array using stream groupingBy",
        snippet: `Map<Integer,List<Integer>> adj = Arrays.stream(edges)\n    .collect(Collectors.groupingBy(e->e[0],\n        Collectors.mapping(e->e[1], Collectors.toList())));`,
      },
    },
    {
      id: 273,
      title: "BFS traversal",
      problem:
        "Given a graph adjacency list and a source node, return the BFS traversal order starting from the source.",
      examples: [
        { input: "adj = [[1,2],[3],[],[]], src = 0", output: "[0,1,2,3]" },
        { input: "adj = [[1],[2],[0,3],[]], src = 2", output: "[2,0,3,1]" },
      ],
      tip: "BFS uses a queue and visits nodes level by level — ideal for shortest path in unweighted graphs",
      iteration: {
        hint: "Use a Queue, mark visited on enqueue, process neighbors level by level",
        snippet: `Queue<Integer> q = new LinkedList<>();\nq.offer(src); visited[src] = true;\nwhile(!q.isEmpty()) {\n    int u = q.poll(); result.add(u);\n    for(int v : adj.get(u)) if(!visited[v]) { visited[v]=true; q.offer(v); }\n}`,
      },
      recursion: {
        hint: "BFS is naturally iterative but can be simulated recursively by processing level lists",
        snippet: `void bfsRec(List<Integer> level, boolean[] vis, List<List<Integer>> adj) {\n    if(level.isEmpty()) return;\n    List<Integer> next = new ArrayList<>();\n    for(int u:level) for(int v:adj.get(u)) if(!vis[v]){vis[v]=true;next.add(v);}\n    bfsRec(next, vis, adj);\n}`,
      },
      stream: {
        hint: "Collect BFS order into a list by streaming each level's neighbors",
        snippet: `// After standard BFS, stream result for processing:\nList<Integer> bfsOrder = new ArrayList<>();\n// ... BFS fills bfsOrder ...\nbfsOrder.stream().map(u -> adj.get(u))\n    .flatMap(Collection::stream).distinct().forEach(System.out::println);`,
      },
    },
    {
      id: 274,
      title: "DFS traversal (recursive and iterative)",
      problem:
        "Given a graph adjacency list and a source node, return the DFS traversal order starting from the source.",
      examples: [
        { input: "adj = [[1,2],[3],[],[]], src = 0", output: "[0,1,3,2]" },
        { input: "adj = [[1],[2],[0,3],[]], src = 2", output: "[2,0,1,3]" },
      ],
      tip: "Recursive DFS is clean but risks stack overflow on large graphs; iterative uses an explicit stack",
      iteration: {
        hint: "Use an explicit Stack, push neighbors and mark visited on pop",
        snippet: `Deque<Integer> stack = new ArrayDeque<>();\nstack.push(src); visited[src] = true;\nwhile(!stack.isEmpty()) {\n    int u = stack.pop(); result.add(u);\n    for(int v : adj.get(u)) if(!visited[v]) { visited[v]=true; stack.push(v); }\n}`,
      },
      recursion: {
        hint: "Mark node visited, recurse into each unvisited neighbor",
        snippet: `void dfs(int u, boolean[] vis, List<List<Integer>> adj, List<Integer> res) {\n    vis[u] = true; res.add(u);\n    for(int v : adj.get(u)) if(!vis[v]) dfs(v, vis, adj, res);\n}`,
      },
      stream: {
        hint: "Stream DFS post-order by collecting via recursive call then streaming the result list",
        snippet: `// Collect DFS result, then stream for processing\nList<Integer> order = new ArrayList<>();\ndfs(0, new boolean[V], adj, order);\norder.stream().filter(u -> u % 2 == 0).forEach(System.out::println);`,
      },
    },
    {
      id: 275,
      title: "Detect cycle in undirected graph",
      problem:
        "Given an undirected graph, return true if it contains at least one cycle.",
      examples: [
        { input: "V = 3, edges = [[0,1],[1,2],[2,0]]", output: "true" },
        { input: "V = 4, edges = [[0,1],[1,2],[2,3]]", output: "false" },
      ],
      tip: "In BFS/DFS, a cycle exists if you reach an already-visited node that is not the parent",
      iteration: {
        hint: "BFS with parent tracking — if visited neighbor is not parent, cycle found",
        snippet: `Queue<int[]> q = new LinkedList<>(); // {node, parent}\nq.offer(new int[]{src, -1}); vis[src] = true;\nwhile(!q.isEmpty()) {\n    int[] cur = q.poll();\n    for(int v : adj.get(cur[0])) {\n        if(!vis[v]) { vis[v]=true; q.offer(new int[]{v,cur[0]}); }\n        else if(v != cur[1]) return true;\n    }\n}`,
      },
      recursion: {
        hint: "DFS with parent param — revisiting non-parent visited node means cycle",
        snippet: `boolean dfs(int u, int par, boolean[] vis, List<List<Integer>> adj) {\n    vis[u] = true;\n    for(int v : adj.get(u)) {\n        if(!vis[v]) { if(dfs(v, u, vis, adj)) return true; }\n        else if(v != par) return true;\n    }\n    return false;\n}`,
      },
      stream: {
        hint: "Use Union-Find: for each edge, if both endpoints share root, cycle detected",
        snippet: `int[] parent = IntStream.range(0, V).toArray();\nfor(int[] e : edges) {\n    int pu = find(parent, e[0]), pv = find(parent, e[1]);\n    if(pu == pv) return true;\n    parent[pu] = pv;\n}`,
      },
    },
    {
      id: 276,
      title: "Detect cycle in directed graph",
      problem:
        "Given a directed graph, return true if it contains at least one directed cycle.",
      examples: [
        { input: "V = 3, edges = [[0,1],[1,2],[2,0]]", output: "true" },
        { input: "V = 4, edges = [[0,1],[1,2],[2,3]]", output: "false" },
      ],
      tip: "Use DFS with a recursion stack — a back edge (visiting a node in the current stack) means a cycle",
      iteration: {
        hint: "Kahn's topological sort: if all nodes not processed, a cycle exists",
        snippet: `int[] indegree = new int[V];\nfor(int u=0;u<V;u++) for(int v:adj.get(u)) indegree[v]++;\nQueue<Integer> q = new LinkedList<>();\nfor(int i=0;i<V;i++) if(indegree[i]==0) q.offer(i);\nint count = 0;\nwhile(!q.isEmpty()) { int u=q.poll(); count++; for(int v:adj.get(u)) if(--indegree[v]==0) q.offer(v); }\nreturn count != V;`,
      },
      recursion: {
        hint: "Maintain a recStack[] alongside visited[] — recStack node revisit means cycle",
        snippet: `boolean dfs(int u, boolean[] vis, boolean[] rec, List<List<Integer>> adj) {\n    vis[u] = rec[u] = true;\n    for(int v : adj.get(u))\n        if((!vis[v] && dfs(v,vis,rec,adj)) || rec[v]) return true;\n    rec[u] = false; return false;\n}`,
      },
      stream: {
        hint: "Stream-based Kahn's: collect zero-indegree nodes with a stream, then reduce",
        snippet: `long processed = IntStream.range(0,V).filter(i->indegree[i]==0)\n    .boxed().collect(Collectors.toCollection(LinkedList::new))\n    .stream().count(); // continue BFS iteratively\nreturn processed != V;`,
      },
    },
    {
      id: 277,
      title: "Topological sort — Kahn's BFS",
      problem:
        "Given a directed acyclic graph, return one topological ordering using Kahn's BFS algorithm.",
      examples: [
        {
          input: "V = 4, edges = [[0,1],[0,2],[1,3],[2,3]]",
          output: "[0,1,2,3]",
        },
        { input: "V = 3, edges = [[1,0],[2,0]]", output: "[1,2,0]" },
      ],
      tip: "Kahn's BFS processes zero-indegree nodes first — also detects cycles if not all nodes are processed",
      iteration: {
        hint: "Compute indegrees, enqueue all zero-indegree nodes, reduce neighbors on each dequeue",
        snippet: `int[] indegree = new int[V];\nfor(int u=0;u<V;u++) for(int v:adj.get(u)) indegree[v]++;\nQueue<Integer> q = new LinkedList<>();\nfor(int i=0;i<V;i++) if(indegree[i]==0) q.offer(i);\nwhile(!q.isEmpty()) {\n    int u=q.poll(); order.add(u);\n    for(int v:adj.get(u)) if(--indegree[v]==0) q.offer(v);\n}`,
      },
      recursion: {
        hint: "Recursively simulate BFS levels for topological processing",
        snippet: `void kahnRec(Queue<Integer> q, int[] indegree, List<Integer> order, List<List<Integer>> adj) {\n    if(q.isEmpty()) return;\n    int u = q.poll(); order.add(u);\n    for(int v:adj.get(u)) if(--indegree[v]==0) q.offer(v);\n    kahnRec(q, indegree, order, adj);\n}`,
      },
      stream: {
        hint: "Stream initial zero-indegree nodes into a queue to seed Kahn's algorithm",
        snippet: `Queue<Integer> q = IntStream.range(0,V)\n    .filter(i -> indegree[i]==0)\n    .boxed().collect(Collectors.toCollection(LinkedList::new));\n// continue standard BFS loop`,
      },
    },
    {
      id: 278,
      title: "Topological sort — DFS",
      problem:
        "Given a directed acyclic graph, return one topological ordering using DFS postorder.",
      examples: [
        {
          input: "V = 4, edges = [[0,1],[0,2],[1,3],[2,3]]",
          output: "[0,2,1,3]",
        },
        { input: "V = 3, edges = [[1,0],[2,0]]", output: "[2,1,0]" },
      ],
      tip: "DFS topological sort: push node to stack after all its neighbors are processed (post-order)",
      iteration: {
        hint: "Use iterative DFS with a post-order stack to simulate recursive topo sort",
        snippet: `Deque<Integer> stack = new ArrayDeque<>();\nboolean[] vis = new boolean[V], onStack = new boolean[V];\nfor(int i=0;i<V;i++) if(!vis[i]) iterDFS(i, vis, onStack, adj, stack);\nwhile(!stack.isEmpty()) result.add(stack.pop());`,
      },
      recursion: {
        hint: "After visiting all neighbors, push current node onto result stack",
        snippet: `void dfs(int u, boolean[] vis, Deque<Integer> stack, List<List<Integer>> adj) {\n    vis[u] = true;\n    for(int v : adj.get(u)) if(!vis[v]) dfs(v, vis, stack, adj);\n    stack.push(u);\n}`,
      },
      stream: {
        hint: "Collect post-order DFS result into a list and reverse-stream for topological order",
        snippet: `List<Integer> postOrder = new ArrayList<>();\nfor(int i=0;i<V;i++) if(!vis[i]) dfs(i, vis, postOrder, adj);\nCollections.reverse(postOrder);\npostOrder.stream().forEach(System.out::println);`,
      },
    },
    {
      id: 279,
      title: "Number of connected components",
      problem:
        "Given an undirected graph with V nodes, return the number of connected components.",
      examples: [
        { input: "V = 5, edges = [[0,1],[1,2],[3,4]]", output: "2" },
        { input: "V = 4, edges = []", output: "4" },
      ],
      tip: "Each unvisited node starts a new component — count DFS/BFS starts or union-find roots",
      iteration: {
        hint: "BFS from each unvisited node, increment component counter each time",
        snippet: `int components = 0;\nboolean[] vis = new boolean[V];\nfor(int i=0;i<V;i++) {\n    if(!vis[i]) { components++; bfs(i, vis, adj); }\n}\nreturn components;`,
      },
      recursion: {
        hint: "DFS from each unvisited node — each call tree is one component",
        snippet: `int count = 0;\nboolean[] vis = new boolean[V];\nfor(int i=0;i<V;i++)\n    if(!vis[i]) { dfs(i, vis, adj); count++; }\nreturn count;`,
      },
      stream: {
        hint: "Use Union-Find, then stream nodes and count distinct roots",
        snippet: `int[] parent = IntStream.range(0,V).toArray();\nfor(int[] e : edges) union(parent, e[0], e[1]);\nreturn (int) IntStream.range(0,V)\n    .map(i -> find(parent,i)).distinct().count();`,
      },
    },
    {
      id: 280,
      title: "Check if graph is bipartite",
      problem:
        "Given an undirected graph, return true if its nodes can be colored with two colors so no edge connects equal colors.",
      examples: [
        { input: "graph = [[1,3],[0,2],[1,3],[0,2]]", output: "true" },
        { input: "graph = [[1,2,3],[0,2],[0,1,3],[0,2]]", output: "false" },
      ],
      tip: "A graph is bipartite if it can be 2-colored — BFS/DFS coloring fails if adjacent nodes share color",
      iteration: {
        hint: "BFS with two colors (0/1): if a neighbor has the same color, not bipartite",
        snippet: `int[] color = new int[V]; Arrays.fill(color, -1);\nQueue<Integer> q = new LinkedList<>();\ncolor[src]=0; q.offer(src);\nwhile(!q.isEmpty()) {\n    int u=q.poll();\n    for(int v:adj.get(u)) {\n        if(color[v]==-1){color[v]=1-color[u];q.offer(v);}\n        else if(color[v]==color[u]) return false;\n    }\n}`,
      },
      recursion: {
        hint: "DFS with color array — assign opposite color to each neighbor, return false on conflict",
        snippet: `boolean dfs(int u, int c, int[] color, List<List<Integer>> adj) {\n    color[u] = c;\n    for(int v : adj.get(u)) {\n        if(color[v]==-1) { if(!dfs(v,1-c,color,adj)) return false; }\n        else if(color[v]==c) return false;\n    }\n    return true;\n}`,
      },
      stream: {
        hint: "After BFS coloring, stream edges to verify no two adjacent nodes share a color",
        snippet: `// After BFS fills color[]:\nreturn Arrays.stream(edges)\n    .allMatch(e -> color[e[0]] != color[e[1]]);`,
      },
    },
    {
      id: 281,
      title: "Shortest path in unweighted graph (BFS)",
      problem:
        "Given an unweighted graph and a source, return the shortest distance from the source to every node.",
      examples: [
        {
          input: "V = 4, edges = [[0,1],[0,2],[1,3]], src = 0",
          output: "[0,1,1,2]",
        },
        { input: "V = 3, edges = [[0,1]], src = 0", output: "[0,1,-1]" },
      ],
      tip: "BFS guarantees shortest path in unweighted graphs — distance increments by 1 each level",
      iteration: {
        hint: "BFS with a distance array — update dist[v] = dist[u] + 1 when enqueuing neighbor",
        snippet: `int[] dist = new int[V]; Arrays.fill(dist, -1);\nQueue<Integer> q = new LinkedList<>();\ndist[src]=0; q.offer(src);\nwhile(!q.isEmpty()) {\n    int u=q.poll();\n    for(int v:adj.get(u)) if(dist[v]==-1){ dist[v]=dist[u]+1; q.offer(v); }\n}`,
      },
      recursion: {
        hint: "Recursively process BFS levels, updating distance at each step",
        snippet: `void bfs(List<Integer> level, int d, int[] dist, List<List<Integer>> adj) {\n    if(level.isEmpty()) return;\n    List<Integer> next = new ArrayList<>();\n    for(int u:level) for(int v:adj.get(u))\n        if(dist[v]==-1){dist[v]=d+1;next.add(v);}\n    bfs(next, d+1, dist, adj);\n}`,
      },
      stream: {
        hint: "After BFS fills dist[], stream to find the shortest path length to target",
        snippet: `int[] dist = new int[V]; Arrays.fill(dist,-1);\n// Run BFS...\nOptionalInt shortest = IntStream.range(0,V)\n    .filter(i -> dist[i] >= 0).min();\nreturn shortest.orElse(-1);`,
      },
    },
    {
      id: 282,
      title: "Dijkstra's algorithm",
      problem:
        "Given a weighted graph with non-negative edge weights and a source, return shortest distances from the source using Dijkstra's algorithm.",
      examples: [
        {
          input: "V = 3, edges = [[0,1,4],[0,2,1],[2,1,2]], src = 0",
          output: "[0,3,1]",
        },
        {
          input: "V = 4, edges = [[0,1,5],[1,2,1]], src = 0",
          output: "[0,5,6,INF]",
        },
      ],
      tip: "Dijkstra uses a min-heap (priority queue) to greedily pick the nearest unvisited node — O((V+E) log V)",
      iteration: {
        hint: "PriorityQueue of {dist, node}, relax edges whenever shorter path is found",
        snippet: `int[] dist = new int[V]; Arrays.fill(dist, Integer.MAX_VALUE); dist[src]=0;\nPriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a->a[0]));\npq.offer(new int[]{0,src});\nwhile(!pq.isEmpty()) {\n    int[] cur=pq.poll(); int d=cur[0], u=cur[1];\n    if(d>dist[u]) continue;\n    for(int[] e:adj.get(u)) if(dist[u]+e[1]<dist[e[0]]){dist[e[0]]=dist[u]+e[1];pq.offer(new int[]{dist[e[0]],e[0]});}\n}`,
      },
      recursion: {
        hint: "Recursive Dijkstra picks min-dist node, relaxes neighbors, recurses on unvisited set",
        snippet: `void dijkRec(int u, int[] dist, boolean[] vis, List<List<int[]>> adj) {\n    vis[u] = true;\n    for(int[] e : adj.get(u))\n        if(dist[u]+e[1] < dist[e[0]]) dist[e[0]] = dist[u]+e[1];\n    // pick min unvisited and recurse (inefficient without PQ)\n}`,
      },
      stream: {
        hint: "Stream adjacency list edges to perform edge relaxation in each PQ iteration",
        snippet: `adj.get(u).stream()\n    .filter(e -> dist[u]+e[1] < dist[e[0]])\n    .forEach(e -> { dist[e[0]]=dist[u]+e[1]; pq.offer(new int[]{dist[e[0]],e[0]}); });`,
      },
    },
    {
      id: 283,
      title: "Bellman-Ford algorithm",
      problem:
        "Given a weighted directed graph and a source, return shortest distances using Bellman-Ford and detect negative cycles if present.",
      examples: [
        {
          input: "V = 3, edges = [[0,1,5],[1,2,-2],[0,2,4]], src = 0",
          output: "[0,5,3]",
        },
        {
          input: "V = 3, edges = [[0,1,1],[1,2,-1],[2,0,-1]], src = 0",
          output: "negative cycle",
        },
      ],
      tip: "Bellman-Ford relaxes all edges V-1 times — handles negative weights and detects negative cycles",
      iteration: {
        hint: "Repeat V-1 times: for each edge (u,v,w), if dist[u]+w < dist[v], update dist[v]",
        snippet: `int[] dist = new int[V]; Arrays.fill(dist, Integer.MAX_VALUE); dist[src]=0;\nfor(int i=0;i<V-1;i++)\n    for(int[] e : edges)\n        if(dist[e[0]]!=Integer.MAX_VALUE && dist[e[0]]+e[2]<dist[e[1]])\n            dist[e[1]] = dist[e[0]]+e[2];\n// Check negative cycle with one more pass`,
      },
      recursion: {
        hint: "Recursive Bellman-Ford counts passes, relaxes edges, recurses for remaining passes",
        snippet: `void bellman(int pass, int[] dist, int[][] edges, int V) {\n    if(pass == 0) return;\n    for(int[] e : edges)\n        if(dist[e[0]]!=Integer.MAX_VALUE && dist[e[0]]+e[2]<dist[e[1]])\n            dist[e[1]] = dist[e[0]]+e[2];\n    bellman(pass-1, dist, edges, V);\n}`,
      },
      stream: {
        hint: "Stream edges to perform each relaxation pass in a functional style",
        snippet: `for(int i=0;i<V-1;i++)\n    Arrays.stream(edges)\n        .filter(e -> dist[e[0]] != Integer.MAX_VALUE)\n        .forEach(e -> { if(dist[e[0]]+e[2]<dist[e[1]]) dist[e[1]]=dist[e[0]]+e[2]; });`,
      },
    },
    {
      id: 284,
      title: "Floyd-Warshall algorithm",
      problem:
        "Given a weighted graph as a distance matrix, compute shortest distances between every pair of vertices.",
      examples: [
        {
          input: "dist = [[0,5,INF],[INF,0,2],[1,INF,0]]",
          output: "[[0,5,7],[3,0,2],[1,6,0]]",
        },
        { input: "dist = [[0,3],[INF,0]]", output: "[[0,3],[INF,0]]" },
      ],
      tip: "Floyd-Warshall finds all-pairs shortest paths in O(V³) — works with negative weights but not negative cycles",
      iteration: {
        hint: "Triple nested loop: for each intermediate k, relax dist[i][j] via dist[i][k]+dist[k][j]",
        snippet: `int[][] dist = new int[V][V]; // initialize with edge weights, 0 on diagonal, INF elsewhere\nfor(int k=0;k<V;k++)\n    for(int i=0;i<V;i++)\n        for(int j=0;j<V;j++)\n            if(dist[i][k]+dist[k][j] < dist[i][j])\n                dist[i][j] = dist[i][k]+dist[k][j];`,
      },
      recursion: {
        hint: "Recursive Floyd-Warshall increments k and calls itself, relaxing at each level",
        snippet: `void fw(int k, int[][] dist, int V) {\n    if(k == V) return;\n    for(int i=0;i<V;i++) for(int j=0;j<V;j++)\n        dist[i][j] = Math.min(dist[i][j], dist[i][k]+dist[k][j]);\n    fw(k+1, dist, V);\n}`,
      },
      stream: {
        hint: "Stream over (i,j) pairs in each k-pass to apply relaxation functionally",
        snippet: `IntStream.range(0,V).forEach(k ->\n    IntStream.range(0,V).forEach(i ->\n        IntStream.range(0,V).forEach(j ->\n            dist[i][j] = Math.min(dist[i][j], dist[i][k]+dist[k][j]))));`,
      },
    },
    {
      id: 285,
      title: "Prim's algorithm (MST)",
      problem:
        "Given a connected weighted undirected graph, return the total weight of a minimum spanning tree using Prim's algorithm.",
      examples: [
        {
          input: "V = 4, edges = [[0,1,1],[0,2,4],[1,2,2],[1,3,5],[2,3,1]]",
          output: "4",
        },
        { input: "V = 3, edges = [[0,1,10],[1,2,5],[0,2,6]]", output: "11" },
      ],
      tip: "Prim's greedily picks the minimum weight edge crossing the cut — use a min-heap for O(E log V)",
      iteration: {
        hint: "PriorityQueue of {weight, node}, expand minimum edge to unvisited nodes",
        snippet: `boolean[] inMST = new boolean[V];\nPriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a->a[0]));\npq.offer(new int[]{0,0}); int total=0;\nwhile(!pq.isEmpty()) {\n    int[] cur=pq.poll();\n    if(inMST[cur[1]]) continue;\n    inMST[cur[1]]=true; total+=cur[0];\n    for(int[] e:adj.get(cur[1])) if(!inMST[e[0]]) pq.offer(new int[]{e[1],e[0]});\n}`,
      },
      recursion: {
        hint: "Recursive Prim picks next min edge, adds to MST, recurses with updated key array",
        snippet: `void prim(boolean[] inMST, int[] key, int[][] graph, int V) {\n    int u = minKey(key, inMST, V);\n    if(u == -1) return;\n    inMST[u] = true;\n    for(int v=0;v<V;v++) if(graph[u][v]!=0 && !inMST[v] && graph[u][v]<key[v]) key[v]=graph[u][v];\n    prim(inMST, key, graph, V);\n}`,
      },
      stream: {
        hint: "After MST built, stream edge weights to compute total MST cost",
        snippet: `// After Prim fills mstEdges list of weights:\nint mstCost = mstEdges.stream().mapToInt(Integer::intValue).sum();`,
      },
    },
    {
      id: 286,
      title: "Kruskal's algorithm (MST, Union-Find)",
      problem:
        "Given a connected weighted undirected graph, return the total weight of a minimum spanning tree using Kruskal's algorithm.",
      examples: [
        {
          input: "V = 4, edges = [[0,1,1],[0,2,4],[1,2,2],[1,3,5],[2,3,1]]",
          output: "4",
        },
        { input: "V = 3, edges = [[0,1,10],[1,2,5],[0,2,6]]", output: "11" },
      ],
      tip: "Kruskal's sorts all edges by weight, adds edge if it doesn't form a cycle (Union-Find) — O(E log E)",
      iteration: {
        hint: "Sort edges, iterate and union endpoints — skip if already in same component",
        snippet: `Arrays.sort(edges, Comparator.comparingInt(e->e[2]));\nint[] parent = IntStream.range(0,V).toArray();\nint total=0;\nfor(int[] e : edges) {\n    int pu=find(parent,e[0]), pv=find(parent,e[1]);\n    if(pu!=pv) { parent[pu]=pv; total+=e[2]; }\n}`,
      },
      recursion: {
        hint: "Recursively process sorted edges, applying union when no cycle is formed",
        snippet: `int kruskal(int i, int[][] edges, int[] parent, int total) {\n    if(i == edges.length) return total;\n    int pu=find(parent,edges[i][0]), pv=find(parent,edges[i][1]);\n    if(pu!=pv) { parent[pu]=pv; total+=edges[i][2]; }\n    return kruskal(i+1, edges, parent, total);\n}`,
      },
      stream: {
        hint: "Stream sorted edges and reduce with union-find to compute MST weight",
        snippet: `int[] parent = IntStream.range(0,V).toArray();\nint mstCost = Arrays.stream(edges)\n    .sorted(Comparator.comparingInt(e->e[2]))\n    .filter(e -> { int pu=find(parent,e[0]),pv=find(parent,e[1]); if(pu!=pv){parent[pu]=pv;return true;}return false;})\n    .mapToInt(e->e[2]).sum();`,
      },
    },
    {
      id: 287,
      title: "Union-Find with path compression and union by rank",
      problem:
        "Design a Union-Find data structure with find and union operations using path compression and union by rank.",
      examples: [
        { input: "union(0,1), union(1,2), find(0) == find(2)", output: "true" },
        { input: "union(0,1), find(0) == find(3)", output: "false" },
      ],
      tip: "Path compression + union by rank achieves near O(1) amortized per operation (inverse Ackermann)",
      iteration: {
        hint: "find() compresses paths; union() always attaches shorter rank tree under taller",
        snippet: `int find(int[] parent, int x) {\n    if(parent[x]!=x) parent[x]=find(parent,parent[x]);\n    return parent[x];\n}\nvoid union(int[] parent, int[] rank, int a, int b) {\n    int pa=find(parent,a), pb=find(parent,b);\n    if(rank[pa]<rank[pb]) parent[pa]=pb;\n    else if(rank[pa]>rank[pb]) parent[pb]=pa;\n    else { parent[pb]=pa; rank[pa]++; }\n}`,
      },
      recursion: {
        hint: "find() is naturally recursive with the path compression assignment",
        snippet: `int find(int[] parent, int x) {\n    return parent[x]==x ? x : (parent[x]=find(parent,parent[x]));\n}`,
      },
      stream: {
        hint: "Initialize parent array with IntStream.range and apply union for each edge",
        snippet: `int[] parent = IntStream.range(0,V).toArray();\nint[] rank = new int[V];\nArrays.stream(edges).forEach(e -> union(parent, rank, e[0], e[1]));\nlong components = IntStream.range(0,V).filter(i->find(parent,i)==i).count();`,
      },
    },
    {
      id: 288,
      title: "Number of islands (DFS/BFS)",
      problem:
        "Given a grid of 1s and 0s, return the number of islands of connected 1s using four-directional adjacency.",
      examples: [
        { input: "grid = [[1,1,0],[0,1,0],[1,0,1]]", output: "3" },
        { input: "grid = [[1,1],[1,1]]", output: "1" },
      ],
      tip: "Treat grid as graph — flood-fill each unvisited '1' cell with DFS/BFS, counting each flood-fill start",
      iteration: {
        hint: "BFS from each unvisited '1': mark all connected '1's as visited, increment count",
        snippet: `int count=0;\nfor(int i=0;i<R;i++) for(int j=0;j<C;j++)\n    if(grid[i][j]=='1') { bfs(i,j,grid); count++; }\n// bfs marks connected cells as '0'\nreturn count;`,
      },
      recursion: {
        hint: "DFS flood-fill: mark cell '0', recurse in 4 directions",
        snippet: `void dfs(char[][] grid, int i, int j) {\n    if(i<0||i>=grid.length||j<0||j>=grid[0].length||grid[i][j]!='1') return;\n    grid[i][j]='0';\n    dfs(grid,i+1,j); dfs(grid,i-1,j); dfs(grid,i,j+1); dfs(grid,i,j-1);\n}`,
      },
      stream: {
        hint: "Stream all grid positions, filter '1's, and apply flood-fill counting distinct components",
        snippet: `long count = IntStream.range(0,R).boxed()\n    .flatMap(i->IntStream.range(0,C).filter(j->grid[i][j]=='1').mapToObj(j->new int[]{i,j}))\n    .filter(p->{ if(grid[p[0]][p[1]]=='1'){dfs(grid,p[0],p[1]);return true;}return false;})\n    .count();`,
      },
    },
    {
      id: 289,
      title: "Clone a graph (deep copy)",
      problem:
        "Given a reference to a node in a connected graph, return a deep copy of the graph.",
      examples: [
        {
          input: "adjList = [[2,4],[1,3],[2,4],[1,3]]",
          output: "deep copy with same adjacency",
        },
        { input: "adjList = [[]]", output: "single copied node" },
      ],
      tip: "Use a HashMap from original to clone node — BFS/DFS to create all clones and wire neighbors",
      iteration: {
        hint: "BFS: create clone for each node, wire clone's neighbors using the map",
        snippet: `Map<Node,Node> map = new HashMap<>();\nQueue<Node> q = new LinkedList<>();\nmap.put(node, new Node(node.val)); q.offer(node);\nwhile(!q.isEmpty()) {\n    Node u=q.poll();\n    for(Node nb:u.neighbors) {\n        if(!map.containsKey(nb)){map.put(nb,new Node(nb.val));q.offer(nb);}\n        map.get(u).neighbors.add(map.get(nb));\n    }\n}`,
      },
      recursion: {
        hint: "DFS clone: if already cloned return from map, else create, recurse neighbors",
        snippet: `Node clone(Node node, Map<Node,Node> map) {\n    if(node==null) return null;\n    if(map.containsKey(node)) return map.get(node);\n    Node copy = new Node(node.val); map.put(node,copy);\n    for(Node nb:node.neighbors) copy.neighbors.add(clone(nb,map));\n    return copy;\n}`,
      },
      stream: {
        hint: "Stream neighbors to recursively clone and collect into the new node's neighbor list",
        snippet: `Node clone(Node node, Map<Node,Node> map) {\n    if(map.containsKey(node)) return map.get(node);\n    Node copy = new Node(node.val); map.put(node,copy);\n    copy.neighbors = node.neighbors.stream().map(nb->clone(nb,map)).collect(Collectors.toList());\n    return copy;\n}`,
      },
    },
    {
      id: 290,
      title: "Course schedule (cycle detection)",
      problem:
        "Given numCourses and prerequisite pairs, return true if all courses can be finished.",
      examples: [
        { input: "numCourses = 2, prerequisites = [[1,0]]", output: "true" },
        {
          input: "numCourses = 2, prerequisites = [[1,0],[0,1]]",
          output: "false",
        },
      ],
      tip: "Model courses as directed graph — if a cycle exists among prerequisites, schedule is impossible",
      iteration: {
        hint: "Kahn's BFS: if processed nodes < total courses, there's a cycle",
        snippet: `int[] indegree = new int[numCourses];\nfor(int[] p:prerequisites) indegree[p[0]]++;\nQueue<Integer> q = new LinkedList<>();\nfor(int i=0;i<numCourses;i++) if(indegree[i]==0) q.offer(i);\nint done=0;\nwhile(!q.isEmpty()) { done++; for(int v:adj.get(q.poll())) if(--indegree[v]==0) q.offer(v); }\nreturn done==numCourses;`,
      },
      recursion: {
        hint: "DFS cycle detection with recStack — cycle means schedule is impossible",
        snippet: `boolean hasCycle(int u, boolean[] vis, boolean[] rec, List<List<Integer>> adj) {\n    vis[u]=rec[u]=true;\n    for(int v:adj.get(u)) if(!vis[v]&&hasCycle(v,vis,rec,adj)||rec[v]) return true;\n    rec[u]=false; return false;\n}`,
      },
      stream: {
        hint: "Build adjacency list from prerequisites using streams, then run cycle detection",
        snippet: `List<List<Integer>> adj = IntStream.range(0,numCourses)\n    .mapToObj(i->new ArrayList<Integer>()).collect(Collectors.toList());\nArrays.stream(prerequisites).forEach(p->adj.get(p[1]).add(p[0]));\n// then run BFS/DFS cycle detection`,
      },
    },
    {
      id: 291,
      title: "Course schedule II (topological sort)",
      problem:
        "Given numCourses and prerequisite pairs, return one valid order to take all courses or an empty array if impossible.",
      examples: [
        { input: "numCourses = 2, prerequisites = [[1,0]]", output: "[0,1]" },
        {
          input: "numCourses = 2, prerequisites = [[1,0],[0,1]]",
          output: "[]",
        },
      ],
      tip: "Topological sort order gives valid course sequence — empty result means cycle (impossible)",
      iteration: {
        hint: "Kahn's BFS accumulates the topological order into result list",
        snippet: `int[] indegree = new int[N];\nfor(int[] p:prerequisites) { adj.get(p[1]).add(p[0]); indegree[p[0]]++; }\nQueue<Integer> q = new LinkedList<>();\nfor(int i=0;i<N;i++) if(indegree[i]==0) q.offer(i);\nwhile(!q.isEmpty()) {\n    int u=q.poll(); order.add(u);\n    for(int v:adj.get(u)) if(--indegree[v]==0) q.offer(v);\n}\nreturn order.size()==N ? order.stream().mapToInt(i->i).toArray() : new int[]{};`,
      },
      recursion: {
        hint: "DFS post-order push to stack gives reverse topological order",
        snippet: `void dfs(int u, boolean[] vis, Deque<Integer> stack, List<List<Integer>> adj) {\n    vis[u]=true;\n    for(int v:adj.get(u)) if(!vis[v]) dfs(v,vis,stack,adj);\n    stack.push(u);\n}`,
      },
      stream: {
        hint: "Stream prerequisites to build adjacency list and indegree, then apply Kahn's",
        snippet: `int[] indegree = new int[N];\nArrays.stream(prerequisites).forEach(p->{ adj.get(p[1]).add(p[0]); indegree[p[0]]++; });\n// then Kahn's BFS`,
      },
    },
    {
      id: 292,
      title: "Word ladder (BFS)",
      problem:
        "Given beginWord, endWord, and a word list, return the length of the shortest transformation sequence changing one letter at a time.",
      examples: [
        {
          input:
            'begin = "hit", end = "cog", words = ["hot","dot","dog","lot","log","cog"]',
          output: "5",
        },
        {
          input: 'begin = "hit", end = "cog", words = ["hot","dot","dog"]',
          output: "0",
        },
      ],
      tip: "BFS finds minimum transformation steps — generate neighbors by changing each character to a-z",
      iteration: {
        hint: "BFS with word-level queue, generate all one-char-diff valid words as neighbors",
        snippet: `Queue<String> q = new LinkedList<>(); Set<String> vis = new HashSet<>(wordList);\nq.offer(beginWord); vis.remove(beginWord); int steps=1;\nwhile(!q.isEmpty()) {\n    for(int sz=q.size();sz>0;sz--) {\n        String w=q.poll(); char[] arr=w.toCharArray();\n        for(int i=0;i<arr.length;i++) { char old=arr[i];\n            for(char c='a';c<='z';c++) { arr[i]=c; String nw=new String(arr);\n                if(nw.equals(endWord)) return steps+1;\n                if(vis.contains(nw)){vis.remove(nw);q.offer(nw);}\n            } arr[i]=old; }\n    } steps++;\n} return 0;`,
      },
      recursion: {
        hint: "Recursively process BFS levels of words, returning steps when endWord is found",
        snippet: `int bfs(Queue<String> q, Set<String> vis, String end, int steps) {\n    if(q.isEmpty()) return 0;\n    Queue<String> next = new LinkedList<>();\n    while(!q.isEmpty()) { String w=q.poll(); /* generate neighbors, return steps if end found, add to next */ }\n    return bfs(next, vis, end, steps+1);\n}`,
      },
      stream: {
        hint: "Generate neighbor words using IntStream over character positions and stream a-z chars",
        snippet: `List<String> neighbors = IntStream.range(0,w.length()).boxed()\n    .flatMap(i->IntStream.rangeClosed('a','z')\n        .mapToObj(c->{ char[] a=w.toCharArray(); a[i]=(char)c; return new String(a); }))\n    .filter(wordSet::contains).collect(Collectors.toList());`,
      },
    },
    {
      id: 293,
      title: "Word ladder II (all shortest paths)",
      problem:
        "Given beginWord, endWord, and a word list, return all shortest transformation sequences.",
      examples: [
        {
          input:
            'begin = "hit", end = "cog", words = ["hot","dot","dog","lot","log","cog"]',
          output:
            '[["hit","hot","dot","dog","cog"],["hit","hot","lot","log","cog"]]',
        },
        {
          input: 'begin = "hit", end = "cog", words = ["hot","dot","dog"]',
          output: "[]",
        },
      ],
      tip: "BFS to find min-distance layers, then DFS backtrack to collect all shortest paths",
      iteration: {
        hint: "BFS builds parent map of all predecessors on shortest paths; DFS reconstructs all paths",
        snippet: `Map<String,List<String>> parents = new HashMap<>();\nMap<String,Integer> dist = new HashMap<>();\n// BFS fills parents and dist\n// DFS backtrack from endWord to beginWord using parents map\nList<List<String>> result = new ArrayList<>();\ndfs(endWord, beginWord, parents, new LinkedList<>(), result);`,
      },
      recursion: {
        hint: "DFS from end to begin using parent map, prepend each word to build path",
        snippet: `void dfs(String word, String begin, Map<String,List<String>> parents,\n         LinkedList<String> path, List<List<String>> res) {\n    path.addFirst(word);\n    if(word.equals(begin)) { res.add(new ArrayList<>(path)); }\n    else for(String p:parents.getOrDefault(word,Collections.emptyList())) dfs(p,begin,parents,path,res);\n    path.removeFirst();\n}`,
      },
      stream: {
        hint: "Stream parent lists during DFS reconstruction to collect all shortest paths",
        snippet: `parents.getOrDefault(word, Collections.emptyList()).stream()\n    .forEach(p -> dfs(p, begin, parents, path, res));`,
      },
    },
    {
      id: 294,
      title: "Alien dictionary (topological sort)",
      problem:
        "Given a sorted alien dictionary word list, return a valid character order or an empty string if the order is invalid.",
      examples: [
        { input: 'words = ["wrt","wrf","er","ett","rftt"]', output: '"wertf"' },
        { input: 'words = ["z","x","z"]', output: '""' },
      ],
      tip: "Compare adjacent words to derive character ordering edges, then topological sort",
      iteration: {
        hint: "For each adjacent word pair, find first differing char — add directed edge, run Kahn's",
        snippet: `for(int i=0;i<words.length-1;i++) {\n    String a=words[i], b=words[i+1];\n    for(int j=0;j<Math.min(a.length(),b.length());j++)\n        if(a.charAt(j)!=b.charAt(j)) { adj.get(a.charAt(j)-'a').add(b.charAt(j)-'a'); break; }\n}\n// Run Kahn's BFS on 26-node graph`,
      },
      recursion: {
        hint: "DFS topological sort on character graph, push to stack in post-order",
        snippet: `void dfs(int u, boolean[] vis, Deque<Integer> stack, List<List<Integer>> adj) {\n    vis[u]=true;\n    for(int v:adj.get(u)) if(!vis[v]) dfs(v,vis,stack,adj);\n    stack.push(u);\n}`,
      },
      stream: {
        hint: "Stream word pairs to extract ordering edges, then topological sort with streams",
        snippet: `IntStream.range(0,words.length-1).forEach(i->{\n    String a=words[i], b=words[i+1];\n    IntStream.range(0,Math.min(a.length(),b.length()))\n        .filter(j->a.charAt(j)!=b.charAt(j)).findFirst()\n        .ifPresent(j->adj.get(a.charAt(j)-'a').add(b.charAt(j)-'a'));\n});`,
      },
    },
    {
      id: 295,
      title: "Network delay time (Dijkstra)",
      problem:
        "Given travel times as directed weighted edges, return how long it takes for all nodes to receive a signal from source k, or -1 if impossible.",
      examples: [
        {
          input: "times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2",
          output: "2",
        },
        { input: "times = [[1,2,1]], n = 2, k = 2", output: "-1" },
      ],
      tip: "Single-source shortest paths with Dijkstra — answer is max of all shortest distances from source",
      iteration: {
        hint: "Dijkstra from K, track max dist — if any node unreachable, return -1",
        snippet: `int[] dist = new int[N+1]; Arrays.fill(dist, Integer.MAX_VALUE); dist[K]=0;\nPriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a->a[0]));\npq.offer(new int[]{0,K});\nwhile(!pq.isEmpty()) {\n    int[] cur=pq.poll(); int d=cur[0],u=cur[1];\n    if(d>dist[u]) continue;\n    for(int[] e:adj.get(u)) if(dist[u]+e[1]<dist[e[0]]){dist[e[0]]=dist[u]+e[1];pq.offer(new int[]{dist[e[0]],e[0]});}\n}\nint ans=Arrays.stream(dist,1,N+1).max().getAsInt();\nreturn ans==Integer.MAX_VALUE?-1:ans;`,
      },
      recursion: {
        hint: "Recursively relax edges from min-dist node until all nodes are settled",
        snippet: `// Run standard Dijkstra iteratively (recursive variant impractical for large V)\n// Then find max dist:\nreturn IntStream.rangeClosed(1,N).map(i->dist[i]).max().getAsInt();`,
      },
      stream: {
        hint: "After Dijkstra, stream dist array to find max — if max is INF, return -1",
        snippet: `int max = Arrays.stream(dist,1,N+1).max().getAsInt();\nreturn max == Integer.MAX_VALUE ? -1 : max;`,
      },
    },
    {
      id: 296,
      title: "Cheapest flights within K stops",
      problem:
        "Given flights with prices, a source, destination, and maximum stops k, return the cheapest price within k stops or -1.",
      examples: [
        {
          input:
            "n = 4, flights = [[0,1,100],[1,2,100],[2,3,100],[0,3,500]], src = 0, dst = 3, k = 1",
          output: "500",
        },
        {
          input:
            "n = 3, flights = [[0,1,100],[1,2,100],[0,2,500]], src = 0, dst = 2, k = 1",
          output: "200",
        },
      ],
      tip: "Modified Bellman-Ford with exactly K+1 relaxation rounds, or BFS/Dijkstra with state (node, stops)",
      iteration: {
        hint: "Bellman-Ford K+1 passes on a copy of dist array to limit stops",
        snippet: `int[] dist = new int[N]; Arrays.fill(dist, Integer.MAX_VALUE); dist[src]=0;\nfor(int i=0;i<=K;i++) {\n    int[] tmp = dist.clone();\n    for(int[] e:flights)\n        if(dist[e[0]]!=Integer.MAX_VALUE && dist[e[0]]+e[2]<tmp[e[1]])\n            tmp[e[1]]=dist[e[0]]+e[2];\n    dist=tmp;\n}\nreturn dist[dst]==Integer.MAX_VALUE?-1:dist[dst];`,
      },
      recursion: {
        hint: "DFS with memoization on (node, stopsRemaining) to find minimum cost",
        snippet: `int dfs(int u, int dst, int k, int[][] memo, Map<Integer,List<int[]>> adj) {\n    if(u==dst) return 0;\n    if(k<0 || !adj.containsKey(u)) return Integer.MAX_VALUE;\n    if(memo[u][k]!=-1) return memo[u][k];\n    int res=Integer.MAX_VALUE;\n    for(int[] e:adj.get(u)) { int sub=dfs(e[0],dst,k-1,memo,adj); if(sub!=Integer.MAX_VALUE) res=Math.min(res,e[1]+sub); }\n    return memo[u][k]=res;\n}`,
      },
      stream: {
        hint: "Stream flights to perform relaxation in each Bellman-Ford pass with a temp array",
        snippet: `for(int i=0;i<=K;i++) {\n    int[] tmp = dist.clone();\n    Arrays.stream(flights).filter(e->dist[e[0]]!=Integer.MAX_VALUE)\n        .forEach(e->{ if(dist[e[0]]+e[2]<tmp[e[1]]) tmp[e[1]]=dist[e[0]]+e[2]; });\n    dist=tmp;\n}`,
      },
    },
    {
      id: 297,
      title: "Critical connections / bridges",
      problem:
        "Given an undirected connected graph, return all critical connections whose removal disconnects the graph.",
      examples: [
        {
          input: "n = 4, connections = [[0,1],[1,2],[2,0],[1,3]]",
          output: "[[1,3]]",
        },
        { input: "n = 2, connections = [[0,1]]", output: "[[0,1]]" },
      ],
      tip: "Tarjan's bridge-finding algorithm uses DFS timestamps and low values — a bridge has low[v] > disc[u]",
      iteration: {
        hint: "Iterative DFS with explicit stack tracking discovery time and low values",
        snippet: `// Iterative bridge-finding is complex; typically done recursively\n// Key: bridge edge (u,v) if low[v] > disc[u]`,
      },
      recursion: {
        hint: "DFS with disc[] and low[] arrays — update low on back edges, check bridge condition on return",
        snippet: `void dfs(int u, int par, int[] disc, int[] low, int[] timer, boolean[] vis, List<List<Integer>> adj, List<List<Integer>> bridges) {\n    vis[u]=true; disc[u]=low[u]=timer[0]++;\n    for(int v:adj.get(u)) {\n        if(!vis[v]) { dfs(v,u,disc,low,timer,vis,adj,bridges); low[u]=Math.min(low[u],low[v]); if(low[v]>disc[u]) bridges.add(Arrays.asList(u,v)); }\n        else if(v!=par) low[u]=Math.min(low[u],disc[v]);\n    }\n}`,
      },
      stream: {
        hint: "After DFS fills disc[] and low[], stream edge list to collect bridges",
        snippet: `List<List<Integer>> bridges = edges.stream()\n    .filter(e -> low[e[1]] > disc[e[0]])\n    .collect(Collectors.toList());`,
      },
    },
    {
      id: 298,
      title: "Articulation points",
      problem:
        "Given an undirected graph, return all articulation points whose removal increases the number of connected components.",
      examples: [
        {
          input: "V = 5, edges = [[0,1],[1,2],[2,0],[1,3],[3,4]]",
          output: "[1,3]",
        },
        { input: "V = 3, edges = [[0,1],[1,2],[0,2]]", output: "[]" },
      ],
      tip: "Articulation point: disc[u] <= low[v] for a child v in DFS tree (or root with 2+ children)",
      iteration: {
        hint: "Iterative DFS tracking disc/low; mark articulation when condition holds on backtrack",
        snippet: `// Typically recursive; iterative version uses explicit stack\n// Key AP condition: low[v] >= disc[u] for non-root, or root with childCount >= 2`,
      },
      recursion: {
        hint: "DFS with disc/low — if low[v] >= disc[u] (non-root), u is an articulation point",
        snippet: `void dfs(int u, int par, int[] disc, int[] low, int[] timer, boolean[] ap, List<List<Integer>> adj) {\n    disc[u]=low[u]=timer[0]++; int children=0;\n    for(int v:adj.get(u)) {\n        if(disc[v]==-1) { children++; dfs(v,u,disc,low,timer,ap,adj); low[u]=Math.min(low[u],low[v]);\n            if(par==-1&&children>1||par!=-1&&low[v]>=disc[u]) ap[u]=true; }\n        else if(v!=par) low[u]=Math.min(low[u],disc[v]);\n    }\n}`,
      },
      stream: {
        hint: "After DFS fills ap[] boolean array, stream to collect articulation point indices",
        snippet: `List<Integer> artPoints = IntStream.range(0,V)\n    .filter(i -> ap[i]).boxed().collect(Collectors.toList());`,
      },
    },
    {
      id: 299,
      title: "Strongly connected components (Kosaraju's)",
      problem:
        "Given a directed graph, return its strongly connected components using Kosaraju's algorithm.",
      examples: [
        {
          input: "V = 5, edges = [[0,2],[2,1],[1,0],[0,3],[3,4]]",
          output: "[[0,1,2],[3],[4]]",
        },
        { input: "V = 3, edges = [[0,1],[1,2]]", output: "[[0],[1],[2]]" },
      ],
      tip: "Kosaraju's: DFS on original, push finish order to stack; DFS on transposed graph in that order",
      iteration: {
        hint: "Two-pass DFS — first fills finish-order stack, second groups SCCs on reversed graph",
        snippet: `// Pass 1: iterative DFS on original graph, push to stack on finish\n// Pass 2: iterative DFS on transposed graph in reverse finish order\n// Each DFS tree in pass 2 is one SCC`,
      },
      recursion: {
        hint: "Recursive DFS fills stack post-order; second recursive DFS on transposed graph counts SCCs",
        snippet: `void dfs1(int u, boolean[] vis, Deque<Integer> stack, List<List<Integer>> adj) {\n    vis[u]=true;\n    for(int v:adj.get(u)) if(!vis[v]) dfs1(v,vis,stack,adj);\n    stack.push(u);\n}\nvoid dfs2(int u, boolean[] vis, List<List<Integer>> radj) {\n    vis[u]=true;\n    for(int v:radj.get(u)) if(!vis[v]) dfs2(v,vis,radj);\n}`,
      },
      stream: {
        hint: "Stream the finish-order stack to drive second-pass DFS on reversed graph",
        snippet: `List<Integer> finishOrder = new ArrayList<>(stack);\nCollections.reverse(finishOrder);\nfinishOrder.stream().filter(u->!vis2[u]).forEach(u->{ dfs2(u,vis2,radj); sccCount++; });`,
      },
    },
    {
      id: 300,
      title: "Strongly connected components (Tarjan's)",
      problem:
        "Given a directed graph, return its strongly connected components using Tarjan's low-link algorithm.",
      examples: [
        {
          input: "V = 5, edges = [[0,2],[2,1],[1,0],[0,3],[3,4]]",
          output: "[[0,1,2],[3],[4]]",
        },
        { input: "V = 3, edges = [[0,1],[1,2]]", output: "[[2],[1],[0]]" },
      ],
      tip: "Tarjan's uses a single DFS with disc/low and a stack — nodes popped together form one SCC",
      iteration: {
        hint: "Iterative Tarjan's is complex; manage the stack simulation carefully",
        snippet: `// Iterative Tarjan's uses explicit DFS stack with state tracking\n// Key: when low[u]==disc[u], pop stack until u to form SCC`,
      },
      recursion: {
        hint: "DFS with disc/low and an auxiliary stack — SCC found when low[u] == disc[u]",
        snippet: `void dfs(int u, int[] disc, int[] low, boolean[] onStack, Deque<Integer> stk, int[] timer, List<List<Integer>> sccs, List<List<Integer>> adj) {\n    disc[u]=low[u]=timer[0]++; stk.push(u); onStack[u]=true;\n    for(int v:adj.get(u)) {\n        if(disc[v]==-1){dfs(v,disc,low,onStack,stk,timer,sccs,adj);low[u]=Math.min(low[u],low[v]);}\n        else if(onStack[v]) low[u]=Math.min(low[u],disc[v]);\n    }\n    if(low[u]==disc[u]) { List<Integer> scc=new ArrayList<>(); while(stk.peek()!=u){int w=stk.pop();onStack[w]=false;scc.add(w);} stk.pop();onStack[u]=false;scc.add(u);sccs.add(scc); }\n}`,
      },
      stream: {
        hint: "After Tarjan's fills SCCs, stream to find the largest SCC or count",
        snippet: `int largestSCC = sccs.stream().mapToInt(List::size).max().orElse(0);\nlong sccCount = sccs.stream().count();`,
      },
    },
    {
      id: 301,
      title: "Reconstruct itinerary (Eulerian path)",
      problem:
        "Given airline tickets as from-to pairs, reconstruct the itinerary starting at JFK using all tickets once and lexical order when choices tie.",
      examples: [
        {
          input:
            'tickets = [["MUC","LHR"],["JFK","MUC"],["SFO","SJC"],["LHR","SFO"]]',
          output: '["JFK","MUC","LHR","SFO","SJC"]',
        },
        {
          input: 'tickets = [["JFK","KUL"],["JFK","NRT"],["NRT","JFK"]]',
          output: '["JFK","NRT","JFK","KUL"]',
        },
      ],
      tip: "Hierholzer's algorithm finds Eulerian path — use greedy DFS with sorted neighbors and post-order",
      iteration: {
        hint: "Iterative Hierholzer: use explicit stack, when no neighbors add to result",
        snippet: `Deque<String> stack = new ArrayDeque<>();\nstack.push(\"JFK\");\nLinkedList<String> result = new LinkedList<>();\nwhile(!stack.isEmpty()) {\n    String top=stack.peek();\n    if(!adj.containsKey(top)||adj.get(top).isEmpty()) result.addFirst(stack.pop());\n    else stack.push(adj.get(top).pollFirst());\n}`,
      },
      recursion: {
        hint: "DFS: pop next lexicographic destination, recurse, then prepend current to result",
        snippet: `void dfs(String u, Map<String,PriorityQueue<String>> adj, LinkedList<String> res) {\n    while(adj.containsKey(u)&&!adj.get(u).isEmpty())\n        dfs(adj.get(u).poll(), adj, res);\n    res.addFirst(u);\n}`,
      },
      stream: {
        hint: "Build adjacency map with sorted neighbors using stream groupingBy and sorted collector",
        snippet: `Map<String,PriorityQueue<String>> adj = Arrays.stream(tickets)\n    .collect(Collectors.groupingBy(t->t[0],\n        Collectors.mapping(t->t[1],\n            Collectors.toCollection(PriorityQueue::new))));`,
      },
    },
    {
      id: 302,
      title: "Minimum spanning tree cost",
      problem:
        "Given a weighted undirected graph, return the minimum spanning tree cost or indicate that no spanning tree exists.",
      examples: [
        {
          input: "V = 4, edges = [[0,1,1],[1,2,2],[2,3,3],[0,3,10]]",
          output: "6",
        },
        { input: "V = 4, edges = [[0,1,1],[2,3,1]]", output: "-1" },
      ],
      tip: "Use Kruskal's (sort edges + Union-Find) or Prim's (min-heap) to find MST total weight",
      iteration: {
        hint: "Kruskal's: sort edges by weight, union if not same component, accumulate cost",
        snippet: `Arrays.sort(edges, Comparator.comparingInt(e->e[2]));\nint[] parent = IntStream.range(0,V).toArray();\nint cost=0, edgesUsed=0;\nfor(int[] e:edges) {\n    if(find(parent,e[0])!=find(parent,e[1])) { union(parent,e[0],e[1]); cost+=e[2]; edgesUsed++; }\n    if(edgesUsed==V-1) break;\n}\nreturn edgesUsed==V-1?cost:-1;`,
      },
      recursion: {
        hint: "Recursive Kruskal processes sorted edges one by one and accumulates MST weight",
        snippet: `int kruskal(int i, int[] parent, int[][] edges, int cost, int used, int V) {\n    if(used==V-1 || i==edges.length) return used==V-1?cost:-1;\n    int[] e=edges[i];\n    if(find(parent,e[0])!=find(parent,e[1])){union(parent,e[0],e[1]);return kruskal(i+1,parent,edges,cost+e[2],used+1,V);}\n    return kruskal(i+1,parent,edges,cost,used,V);\n}`,
      },
      stream: {
        hint: "Stream sorted edges and filter those that union distinct components, summing weights",
        snippet: `int[] parent = IntStream.range(0,V).toArray();\nreturn Arrays.stream(edges).sorted(Comparator.comparingInt(e->e[2]))\n    .filter(e->{ if(find(parent,e[0])!=find(parent,e[1])){union(parent,e[0],e[1]);return true;}return false;})\n    .mapToInt(e->e[2]).sum();`,
      },
    },
    {
      id: 303,
      title: "Detect negative weight cycle",
      problem:
        "Given a weighted directed graph, return true if it contains a negative weight cycle reachable during relaxation.",
      examples: [
        { input: "V = 3, edges = [[0,1,1],[1,2,-1],[2,0,-1]]", output: "true" },
        { input: "V = 3, edges = [[0,1,4],[1,2,3]]", output: "false" },
      ],
      tip: "Run Bellman-Ford V-1 times; if any edge still relaxes on the V-th pass, a negative cycle exists",
      iteration: {
        hint: "After V-1 Bellman-Ford passes, do one more — if any dist still decreases, negative cycle exists",
        snippet: `// After V-1 passes of Bellman-Ford:\nfor(int[] e : edges)\n    if(dist[e[0]]!=Integer.MAX_VALUE && dist[e[0]]+e[2]<dist[e[1]])\n        return true; // negative cycle\nreturn false;`,
      },
      recursion: {
        hint: "Recursive Bellman-Ford with pass counter; check V-th pass for further relaxation",
        snippet: `boolean hasNegCycle(int pass, int[] dist, int[][] edges, int V) {\n    if(pass==0) {\n        for(int[] e:edges) if(dist[e[0]]!=Integer.MAX_VALUE&&dist[e[0]]+e[2]<dist[e[1]]) return true;\n        return false;\n    }\n    for(int[] e:edges) if(dist[e[0]]!=Integer.MAX_VALUE&&dist[e[0]]+e[2]<dist[e[1]]) dist[e[1]]=dist[e[0]]+e[2];\n    return hasNegCycle(pass-1,dist,edges,V);\n}`,
      },
      stream: {
        hint: "Stream edges on the V-th pass to check if any further relaxation is possible",
        snippet: `// After V-1 passes:\nreturn Arrays.stream(edges)\n    .anyMatch(e -> dist[e[0]]!=Integer.MAX_VALUE && dist[e[0]]+e[2]<dist[e[1]]);`,
      },
    },
    {
      id: 304,
      title: "Shortest path in binary matrix (BFS)",
      problem:
        "Given an n x n binary matrix, return the shortest clear path length from top-left to bottom-right moving in eight directions.",
      examples: [
        { input: "grid = [[0,1],[1,0]]", output: "2" },
        { input: "grid = [[0,0,0],[1,1,0],[1,1,0]]", output: "4" },
      ],
      tip: "BFS in 8-directional grid, only traversing 0-cells — each level increment is one step",
      iteration: {
        hint: "BFS from (0,0) through 0-cells in 8 directions, return steps when reaching (n-1,n-1)",
        snippet: `if(grid[0][0]==1) return -1;\nQueue<int[]> q = new LinkedList<>(); q.offer(new int[]{0,0,1}); grid[0][0]=1;\nint[][] dirs={{-1,-1},{-1,0},{-1,1},{0,-1},{0,1},{1,-1},{1,0},{1,1}};\nwhile(!q.isEmpty()) {\n    int[] cur=q.poll(); int r=cur[0],c=cur[1],d=cur[2];\n    if(r==n-1&&c==n-1) return d;\n    for(int[] dr:dirs) { int nr=r+dr[0],nc=c+dr[1]; if(nr>=0&&nr<n&&nc>=0&&nc<n&&grid[nr][nc]==0){grid[nr][nc]=1;q.offer(new int[]{nr,nc,d+1});} }\n}\nreturn -1;`,
      },
      recursion: {
        hint: "Recursive BFS by level — process each level's cells and queue next level",
        snippet: `int bfs(Queue<int[]> q, int[][] grid, int n, int d) {\n    if(q.isEmpty()) return -1;\n    Queue<int[]> next=new LinkedList<>();\n    while(!q.isEmpty()) { int[] c=q.poll(); if(c[0]==n-1&&c[1]==n-1) return d;\n        // expand 8 neighbors into next\n    } return bfs(next,grid,n,d+1);\n}`,
      },
      stream: {
        hint: "Stream 8 directions array to generate valid neighbors in each BFS step",
        snippet: `int[][] dirs={{-1,-1},{-1,0},{-1,1},{0,-1},{0,1},{1,-1},{1,0},{1,1}};\nArrays.stream(dirs)\n    .filter(d->{ int nr=r+d[0],nc=c+d[1]; return nr>=0&&nr<n&&nc>=0&&nc<n&&grid[nr][nc]==0;})\n    .forEach(d->{ int nr=r+d[0],nc=c+d[1]; grid[nr][nc]=1; q.offer(new int[]{nr,nc,dist+1}); });`,
      },
    },
    {
      id: 305,
      title: "Number of provinces (Union-Find)",
      problem:
        "Given an isConnected matrix, return the number of provinces among all cities.",
      examples: [
        { input: "isConnected = [[1,1,0],[1,1,0],[0,0,1]]", output: "2" },
        { input: "isConnected = [[1,0,0],[0,1,0],[0,0,1]]", output: "3" },
      ],
      tip: "Each connected component in the adjacency matrix is one province — count with Union-Find or DFS",
      iteration: {
        hint: "Union-Find: union connected cities, count distinct root nodes",
        snippet: `int[] parent = IntStream.range(0,N).toArray();\nfor(int i=0;i<N;i++) for(int j=i+1;j<N;j++)\n    if(isConnected[i][j]==1) union(parent,i,j);\nreturn (int)IntStream.range(0,N).filter(i->find(parent,i)==i).count();`,
      },
      recursion: {
        hint: "DFS from each unvisited city, count number of DFS initiations",
        snippet: `int count=0; boolean[] vis=new boolean[N];\nfor(int i=0;i<N;i++) if(!vis[i]) { dfs(i,vis,isConnected,N); count++; }\nreturn count;`,
      },
      stream: {
        hint: "After Union-Find, stream range and count nodes that are their own parent (roots)",
        snippet: `int[] parent = IntStream.range(0,N).toArray();\n// union all connected pairs\nreturn (int) IntStream.range(0,N)\n    .filter(i -> find(parent,i)==i).count();`,
      },
    },
    {
      id: 306,
      title: "Check if graph is connected",
      problem:
        "Given an undirected graph, return true if every vertex belongs to a single connected component.",
      examples: [
        { input: "V = 4, edges = [[0,1],[1,2],[2,3]]", output: "true" },
        { input: "V = 4, edges = [[0,1],[2,3]]", output: "false" },
      ],
      tip: "Start BFS/DFS from node 0 — if all V nodes are visited, graph is connected",
      iteration: {
        hint: "BFS from node 0, count visited nodes — connected if count equals V",
        snippet: `boolean[] vis = new boolean[V];\nQueue<Integer> q = new LinkedList<>();\nq.offer(0); vis[0]=true; int count=1;\nwhile(!q.isEmpty()) {\n    int u=q.poll();\n    for(int v:adj.get(u)) if(!vis[v]){vis[v]=true;count++;q.offer(v);}\n}\nreturn count==V;`,
      },
      recursion: {
        hint: "DFS from 0 marks all reachable nodes; check if all visited",
        snippet: `boolean[] vis = new boolean[V];\ndfs(0,vis,adj);\nreturn IntStream.range(0,V).allMatch(i->vis[i]);`,
      },
      stream: {
        hint: "After BFS/DFS, stream vis[] to check all nodes were visited",
        snippet: `// After BFS fills vis[]:\nreturn IntStream.range(0,V).allMatch(i->vis[i]);`,
      },
    },
    {
      id: 307,
      title: "Rotten oranges (multi-source BFS)",
      problem:
        "Given a grid of fresh and rotten oranges, return the minutes until all fresh oranges rot, or -1 if impossible.",
      examples: [
        { input: "grid = [[2,1,1],[1,1,0],[0,1,1]]", output: "4" },
        { input: "grid = [[2,1,1],[0,1,1],[1,0,1]]", output: "-1" },
      ],
      tip: "Multi-source BFS from all initially rotten oranges simultaneously — answer is BFS levels count",
      iteration: {
        hint: "Enqueue all rotten oranges at start, BFS spreads rot level by level",
        snippet: `Queue<int[]> q = new LinkedList<>();\nint fresh=0;\nfor(int i=0;i<R;i++) for(int j=0;j<C;j++) { if(grid[i][j]==2) q.offer(new int[]{i,j}); if(grid[i][j]==1) fresh++; }\nint time=0;\nint[][] dirs={{0,1},{0,-1},{1,0},{-1,0}};\nwhile(!q.isEmpty()&&fresh>0) {\n    time++;\n    for(int sz=q.size();sz>0;sz--) { int[] c=q.poll(); for(int[] d:dirs){int nr=c[0]+d[0],nc=c[1]+d[1]; if(nr>=0&&nr<R&&nc>=0&&nc<C&&grid[nr][nc]==1){grid[nr][nc]=2;fresh--;q.offer(new int[]{nr,nc});}} }\n}\nreturn fresh==0?time:-1;`,
      },
      recursion: {
        hint: "Recursive BFS by level — process current level's cells, recurse with next level",
        snippet: `int bfs(Queue<int[]> q, int[][] grid, int R, int C, int[] fresh, int time) {\n    if(q.isEmpty()||fresh[0]==0) return fresh[0]==0?time:-1;\n    // expand one level, update fresh\n    return bfs(nextQ, grid, R, C, fresh, time+1);\n}`,
      },
      stream: {
        hint: "Initialize BFS queue by streaming grid positions with value 2",
        snippet: `Queue<int[]> q = IntStream.range(0,R).boxed()\n    .flatMap(i->IntStream.range(0,C).filter(j->grid[i][j]==2).mapToObj(j->new int[]{i,j}))\n    .collect(Collectors.toCollection(LinkedList::new));`,
      },
    },
    {
      id: 308,
      title: "Walls and gates (multi-source BFS)",
      problem:
        "Given rooms containing gates, walls, and empty rooms, fill each empty room with distance to its nearest gate.",
      examples: [
        {
          input: "rooms = [[INF,-1,0],[INF,INF,INF]]",
          output: "[[1,-1,0],[2,2,1]]",
        },
        { input: "rooms = [[0,INF],[INF,INF]]", output: "[[0,1],[1,2]]" },
      ],
      tip: "Multi-source BFS from all gates (0-cells) simultaneously fills shortest distances to all empty rooms",
      iteration: {
        hint: "Enqueue all gates, BFS outward updating INF cells with current distance",
        snippet: `Queue<int[]> q = new LinkedList<>();\nfor(int i=0;i<R;i++) for(int j=0;j<C;j++) if(rooms[i][j]==0) q.offer(new int[]{i,j});\nint[][] dirs={{0,1},{0,-1},{1,0},{-1,0}};\nwhile(!q.isEmpty()) {\n    int[] c=q.poll();\n    for(int[] d:dirs) { int nr=c[0]+d[0],nc=c[1]+d[1];\n        if(nr>=0&&nr<R&&nc>=0&&nc<C&&rooms[nr][nc]==Integer.MAX_VALUE)\n            {rooms[nr][nc]=rooms[c[0]][c[1]]+1; q.offer(new int[]{nr,nc});} }\n}`,
      },
      recursion: {
        hint: "DFS from each gate — update room if shorter path found and recurse in 4 directions",
        snippet: `void dfs(int[][] rooms, int i, int j, int dist) {\n    if(i<0||i>=rooms.length||j<0||j>=rooms[0].length||rooms[i][j]<dist) return;\n    rooms[i][j]=dist;\n    dfs(rooms,i+1,j,dist+1); dfs(rooms,i-1,j,dist+1);\n    dfs(rooms,i,j+1,dist+1); dfs(rooms,i,j-1,dist+1);\n}`,
      },
      stream: {
        hint: "Seed BFS queue by streaming grid to collect gate positions",
        snippet: `Queue<int[]> q = IntStream.range(0,R).boxed()\n    .flatMap(i->IntStream.range(0,C).filter(j->rooms[i][j]==0).mapToObj(j->new int[]{i,j}))\n    .collect(Collectors.toCollection(LinkedList::new));`,
      },
    },
    {
      id: 309,
      title: "Redundant connection (Union-Find)",
      problem:
        "Given edges of an undirected graph that started as a tree plus one extra edge, return the redundant edge.",
      examples: [
        { input: "edges = [[1,2],[1,3],[2,3]]", output: "[2,3]" },
        { input: "edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]", output: "[1,4]" },
      ],
      tip: "Process edges in order — the first edge whose both endpoints are already connected is the redundant one",
      iteration: {
        hint: "Union-Find: first edge where find(u)==find(v) is the cycle-forming redundant edge",
        snippet: `int[] parent = IntStream.range(0,N+1).toArray();\nfor(int[] e : edges) {\n    int pu=find(parent,e[0]), pv=find(parent,e[1]);\n    if(pu==pv) return e;\n    parent[pu]=pv;\n}`,
      },
      recursion: {
        hint: "Recursive Union-Find processes edges, returns current edge when both endpoints share root",
        snippet: `int[] findRedundant(int i, int[][] edges, int[] parent) {\n    if(i==edges.length) return new int[]{};\n    int pu=find(parent,edges[i][0]), pv=find(parent,edges[i][1]);\n    if(pu==pv) return edges[i];\n    parent[pu]=pv;\n    return findRedundant(i+1,edges,parent);\n}`,
      },
      stream: {
        hint: "Stream edges and find first one where both nodes share the same root",
        snippet: `int[] parent = IntStream.range(0,N+1).toArray();\nreturn Arrays.stream(edges)\n    .filter(e->{ int pu=find(parent,e[0]),pv=find(parent,e[1]);\n        if(pu==pv) return true; parent[pu]=pv; return false;})\n    .findFirst().orElse(new int[]{});`,
      },
    },
    {
      id: 310,
      title: "Graph valid tree",
      problem:
        "Given n nodes and undirected edges, return true if the edges form exactly one valid tree.",
      examples: [
        { input: "n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]", output: "true" },
        {
          input: "n = 5, edges = [[0,1],[1,2],[2,3],[1,3],[1,4]]",
          output: "false",
        },
      ],
      tip: "A valid tree has exactly V-1 edges and is fully connected (no cycles)",
      iteration: {
        hint: "Union-Find: if any edge creates a cycle, not a tree; check all V nodes are connected",
        snippet: `if(edges.length!=n-1) return false;\nint[] parent = IntStream.range(0,n).toArray();\nfor(int[] e:edges) {\n    int pu=find(parent,e[0]),pv=find(parent,e[1]);\n    if(pu==pv) return false;\n    parent[pu]=pv;\n}\nreturn true;`,
      },
      recursion: {
        hint: "DFS to check connectivity and absence of cycles using parent tracking",
        snippet: `boolean dfs(int u, int par, boolean[] vis, List<List<Integer>> adj) {\n    vis[u]=true;\n    for(int v:adj.get(u)) {\n        if(!vis[v]){if(!dfs(v,u,vis,adj)) return false;}\n        else if(v!=par) return false;\n    }\n    return true;\n}`,
      },
      stream: {
        hint: "After Union-Find, stream to verify edge count and single component root",
        snippet: `if(edges.length!=n-1) return false;\nint[] parent = IntStream.range(0,n).toArray();\nboolean noCycle = Arrays.stream(edges)\n    .allMatch(e->{ int pu=find(parent,e[0]),pv=find(parent,e[1]); if(pu==pv)return false; parent[pu]=pv; return true;});\nreturn noCycle;`,
      },
    },
    {
      id: 311,
      title: "Minimum vertices to reach all nodes",
      problem:
        "Given a directed acyclic graph, return the smallest set of vertices from which all nodes are reachable.",
      examples: [
        {
          input: "n = 6, edges = [[0,1],[0,2],[2,5],[3,4],[4,2]]",
          output: "[0,3]",
        },
        {
          input: "n = 5, edges = [[0,1],[2,1],[3,1],[1,4],[2,4]]",
          output: "[0,2,3]",
        },
      ],
      tip: "Nodes with zero in-degree in a DAG have no predecessors — every other node is reachable from these",
      iteration: {
        hint: "Compute in-degrees; collect all nodes with in-degree 0 — these are the answer",
        snippet: `int[] indegree = new int[n];\nfor(List<Integer> e : edges) indegree[e.get(1)]++;\nList<Integer> result = new ArrayList<>();\nfor(int i=0;i<n;i++) if(indegree[i]==0) result.add(i);\nreturn result;`,
      },
      recursion: {
        hint: "Recursively build indegree array from edges, then filter zero-indegree nodes",
        snippet: `void buildIndegree(int i, List<List<Integer>> edges, int[] indegree) {\n    if(i==edges.size()) return;\n    indegree[edges.get(i).get(1)]++;\n    buildIndegree(i+1,edges,indegree);\n}`,
      },
      stream: {
        hint: "Stream edges to compute indegrees, then filter and collect zero-indegree nodes",
        snippet: `int[] indegree = new int[n];\nedges.stream().forEach(e->indegree[e.get(1)]++);\nreturn IntStream.range(0,n).filter(i->indegree[i]==0)\n    .boxed().collect(Collectors.toList());`,
      },
    },
    {
      id: 312,
      title: "Find eventual safe states",
      problem:
        "Given a directed graph, return all eventual safe nodes whose every path eventually ends at a terminal node.",
      examples: [
        {
          input: "graph = [[1,2],[2,3],[5],[0],[5],[],[]]",
          output: "[2,4,5,6]",
        },
        { input: "graph = [[1,2,3,4],[1,2],[3,4],[0,4],[]]", output: "[4]" },
      ],
      tip: "Safe nodes are those with no path to a cycle — reverse graph + topological sort, or DFS coloring",
      iteration: {
        hint: "Kahn's on reversed graph: nodes with indegree 0 in reverse are eventual safe states",
        snippet: `// Build reversed graph, compute indegrees\n// Kahn's BFS on reversed graph\nQueue<Integer> q = new LinkedList<>();\nfor(int i=0;i<N;i++) if(rindegree[i]==0) q.offer(i);\nwhile(!q.isEmpty()) { int u=q.poll(); safe.add(u); for(int v:radj.get(u)) if(--rindegree[v]==0) q.offer(v); }\nCollections.sort(safe); return safe;`,
      },
      recursion: {
        hint: "DFS coloring: unvisited=0, in-progress=1, safe=2; a node is safe if all paths lead to safe nodes",
        snippet: `int dfs(int u, int[] color, List<List<Integer>> adj) {\n    if(color[u]!=0) return color[u];\n    color[u]=1;\n    for(int v:adj.get(u)) if(dfs(v,color,adj)==1){color[u]=1;return 1;}\n    color[u]=2; return 2;\n}`,
      },
      stream: {
        hint: "After DFS coloring, stream nodes and filter those with color==2 (safe)",
        snippet: `int[] color = new int[N];\nIntStream.range(0,N).forEach(i->dfs(i,color,adj));\nreturn IntStream.range(0,N).filter(i->color[i]==2)\n    .boxed().collect(Collectors.toList());`,
      },
    },
    {
      id: 313,
      title: "Shortest bridge (BFS/DFS)",
      problem:
        "Given a binary grid with exactly two islands, return the minimum number of water cells to flip to connect them.",
      examples: [
        { input: "grid = [[0,1],[1,0]]", output: "1" },
        { input: "grid = [[0,1,0],[0,0,0],[0,0,1]]", output: "2" },
      ],
      tip: "DFS marks first island, then BFS expands outward from it until reaching second island — count BFS levels",
      iteration: {
        hint: "DFS flood-fill first island into queue, then BFS from all its cells to find second island",
        snippet: `// Step 1: DFS to find and mark first island, add to queue\n// Step 2: BFS from queue cells\nint steps=0;\nwhile(!q.isEmpty()) {\n    for(int sz=q.size();sz>0;sz--) {\n        int[] c=q.poll();\n        for(int[] d:dirs) { int nr=c[0]+d[0],nc=c[1]+d[1];\n            if(inBounds&&grid[nr][nc]==1) return steps;\n            if(inBounds&&grid[nr][nc]==0){grid[nr][nc]=-1;q.offer(new int[]{nr,nc});}\n        }\n    } steps++;\n}`,
      },
      recursion: {
        hint: "Recursive DFS marks first island cells, then BFS iteratively finds shortest bridge",
        snippet: `void dfs(int i, int j, int[][] grid, Queue<int[]> q) {\n    if(i<0||i>=grid.length||j<0||j>=grid[0].length||grid[i][j]!=1) return;\n    grid[i][j]=2; q.offer(new int[]{i,j});\n    dfs(i+1,j,grid,q); dfs(i-1,j,grid,q); dfs(i,j+1,grid,q); dfs(i,j-1,grid,q);\n}`,
      },
      stream: {
        hint: "After DFS fills queue, stream directions in BFS to expand and detect second island",
        snippet: `Arrays.stream(dirs)\n    .filter(d->{ int nr=r+d[0],nc=c+d[1]; return nr>=0&&nr<n&&nc>=0&&nc<n; })\n    .forEach(d->{ int nr=r+d[0],nc=c+d[1];\n        if(grid[nr][nc]==1) found[0]=true;\n        else if(grid[nr][nc]==0){grid[nr][nc]=-1;q.offer(new int[]{nr,nc});} });`,
      },
    },
    {
      id: 314,
      title: "Evaluate division (weighted DFS)",
      problem:
        "Given equations like a divided by b and query pairs, return each query result or -1 if it cannot be determined.",
      examples: [
        {
          input:
            'equations = [["a","b"],["b","c"]], values = [2.0,3.0], queries = [["a","c"],["b","a"]]',
          output: "[6.0,0.5]",
        },
        {
          input:
            'equations = [["a","b"]], values = [2.0], queries = [["a","e"],["x","x"]]',
          output: "[-1.0,-1.0]",
        },
      ],
      tip: "Model as weighted graph where edge a→b has weight a/b — DFS/BFS multiplies weights along path",
      iteration: {
        hint: "BFS from source variable, multiply edge weights along path to find ratio",
        snippet: `// Build adjacency map: a->{b->val, ...}\nQueue<double[]> q = new LinkedList<>(); // {node, product}\nq.offer(new double[]{src,1.0}); Set<String> vis=new HashSet<>(); vis.add(src);\nwhile(!q.isEmpty()) {\n    double[] cur=q.poll(); String u=nodeMap.get((int)cur[0]); double prod=cur[1];\n    if(u.equals(dst)) return prod;\n    for(Map.Entry<String,Double> e:adj.get(u).entrySet()) if(!vis.contains(e.getKey())){vis.add(e.getKey());q.offer(/*...*/);}\n}`,
      },
      recursion: {
        hint: "DFS with accumulated product — return product when destination found, -1 if not reachable",
        snippet: `double dfs(String u, String dst, Set<String> vis, Map<String,Map<String,Double>> adj) {\n    if(!adj.containsKey(u)||!adj.containsKey(dst)) return -1;\n    if(u.equals(dst)) return 1.0;\n    vis.add(u);\n    for(Map.Entry<String,Double> e:adj.get(u).entrySet()) {\n        if(!vis.contains(e.getKey())) { double res=dfs(e.getKey(),dst,vis,adj); if(res!=-1) return e.getValue()*res; }\n    }\n    return -1;\n}`,
      },
      stream: {
        hint: "Build weighted adjacency map from equations and values using stream operations",
        snippet: `Map<String,Map<String,Double>> adj = new HashMap<>();\nIntStream.range(0,equations.size()).forEach(i->{\n    String a=equations.get(i).get(0), b=equations.get(i).get(1); double v=values[i];\n    adj.computeIfAbsent(a,k->new HashMap<>()).put(b,v);\n    adj.computeIfAbsent(b,k->new HashMap<>()).put(a,1.0/v);\n});`,
      },
    },
    {
      id: 315,
      title: "Bus routes (BFS on routes)",
      problem:
        "Given bus routes, a source stop, and a target stop, return the minimum number of buses needed or -1 if unreachable.",
      examples: [
        {
          input: "routes = [[1,2,7],[3,6,7]], source = 1, target = 6",
          output: "2",
        },
        {
          input: "routes = [[7,12],[4,5,15],[6]], source = 15, target = 6",
          output: "-1",
        },
      ],
      tip: "Model stops as nodes sharing route edges — BFS on routes (not stops) avoids TLE on dense graphs",
      iteration: {
        hint: "BFS on routes: from each stop, find all routes through it, add unvisited stops, count bus changes",
        snippet: `Map<Integer,List<Integer>> stopToRoutes = new HashMap<>();\nfor(int i=0;i<routes.length;i++) for(int s:routes[i]) stopToRoutes.computeIfAbsent(s,k->new ArrayList<>()).add(i);\nQueue<Integer> q = new LinkedList<>(); Set<Integer> visStop=new HashSet<>(), visRoute=new HashSet<>();\nq.offer(source); visStop.add(source); int buses=0;\nwhile(!q.isEmpty()) {\n    buses++;\n    for(int sz=q.size();sz>0;sz--) { int s=q.poll(); for(int r:stopToRoutes.getOrDefault(s,Collections.emptyList())) { if(visRoute.contains(r)) continue; visRoute.add(r);\n        for(int ns:routes[r]) { if(ns==target) return buses; if(!visStop.contains(ns)){visStop.add(ns);q.offer(ns);} } } }\n}\nreturn -1;`,
      },
      recursion: {
        hint: "Recursive BFS by level on bus routes — increment bus count each level",
        snippet: `int bfs(Queue<Integer> q, Set<Integer> visStop, Set<Integer> visRoute,\n        Map<Integer,List<Integer>> stopToRoutes, int[][] routes, int target, int buses) {\n    if(q.isEmpty()) return -1;\n    // process one level, add next stops\n    return bfs(next, visStop, visRoute, stopToRoutes, routes, target, buses+1);\n}`,
      },
      stream: {
        hint: "Build stop-to-routes map using stream groupingBy for efficient BFS initialization",
        snippet: `Map<Integer,List<Integer>> stopToRoutes = IntStream.range(0,routes.length).boxed()\n    .flatMap(i->Arrays.stream(routes[i]).boxed().map(s->new int[]{s,i}))\n    .collect(Collectors.groupingBy(a->a[0], Collectors.mapping(a->a[1], Collectors.toList())));`,
      },
    },
    {
      id: 316,
      title: "Path with minimum effort (Dijkstra/binary search)",
      problem:
        "Given a grid of heights, return the minimum effort required to travel from top-left to bottom-right, where effort is the maximum edge height difference on the path.",
      examples: [
        { input: "heights = [[1,2,2],[3,8,2],[5,3,5]]", output: "2" },
        { input: "heights = [[1,2,3],[3,8,4],[5,3,5]]", output: "1" },
      ],
      tip: "Dijkstra on grid minimizing the max absolute height difference along path (effort = max diff)",
      iteration: {
        hint: "Modified Dijkstra: effort[i][j] = min over all paths of max edge diff; use min-heap",
        snippet: `int[][] effort = new int[R][C]; for(int[] row:effort) Arrays.fill(row,Integer.MAX_VALUE); effort[0][0]=0;\nPriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a->a[0]));\npq.offer(new int[]{0,0,0}); // {effort,row,col}\nwhile(!pq.isEmpty()) {\n    int[] cur=pq.poll(); int e=cur[0],r=cur[1],c=cur[2];\n    if(r==R-1&&c==C-1) return e;\n    if(e>effort[r][c]) continue;\n    for(int[] d:dirs) { int nr=r+d[0],nc=c+d[1]; if(nr>=0&&nr<R&&nc>=0&&nc<C){\n        int ne=Math.max(e,Math.abs(heights[nr][nc]-heights[r][c]));\n        if(ne<effort[nr][nc]){effort[nr][nc]=ne;pq.offer(new int[]{ne,nr,nc});} } }\n}`,
      },
      recursion: {
        hint: "Binary search on answer + BFS/DFS to check if a path exists with effort <= mid",
        snippet: `boolean canReach(int[][] heights, int mid, int R, int C) {\n    boolean[][] vis=new boolean[R][C];\n    return dfs(0,0,heights,vis,mid,R,C);\n}\nbool dfs(int r,int c,int[][] h,boolean[][] vis,int mid,int R,int C) {\n    if(r==R-1&&c==C-1) return true; vis[r][c]=true;\n    for(int[] d:dirs) { int nr=r+d[0],nc=c+d[1]; if(inBounds&&!vis[nr][nc]&&Math.abs(h[nr][nc]-h[r][c])<=mid&&dfs(nr,nc,h,vis,mid,R,C)) return true; }\n    return false;\n}`,
      },
      stream: {
        hint: "Stream directions array to generate valid neighbors in each Dijkstra expansion step",
        snippet: `Arrays.stream(dirs)\n    .filter(d->{ int nr=r+d[0],nc=c+d[1]; return nr>=0&&nr<R&&nc>=0&&nc<C; })\n    .forEach(d->{ int nr=r+d[0],nc=c+d[1];\n        int ne=Math.max(e,Math.abs(heights[nr][nc]-heights[r][c]));\n        if(ne<effort[nr][nc]){effort[nr][nc]=ne;pq.offer(new int[]{ne,nr,nc});} });`,
      },
    },
  ],
};
