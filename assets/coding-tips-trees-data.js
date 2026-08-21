window.CT_TREES = {
  topic: "Trees & Trie",
  icon: "🌳",
  range: "211–271",
  questions: [
    {
      id: 211,
      title: "Inorder traversal",
      problem:
        "Given the root of a binary tree, return its inorder traversal as a list of node values.",
      examples: [
        { input: "root = [1,null,2,3]", output: "[1,3,2]" },
        { input: "root = [4,2,5,1,3]", output: "[1,2,3,4,5]" },
      ],
      tip: "Left→Root→Right; iterative uses an explicit stack to simulate the call stack",
      iteration: {
        hint: "Push left children, pop and visit, then go right",
        snippet: `Deque<TreeNode> st = new ArrayDeque<>(); TreeNode c = root;\nwhile (c != null || !st.isEmpty()) {\n    while (c != null) { st.push(c); c = c.left; }\n    c = st.pop(); res.add(c.val); c = c.right;\n}`,
      },
      recursion: {
        hint: "Recurse left, visit root, recurse right",
        snippet: `void inorder(TreeNode n, List<Integer> res) {\n    if (n == null) return;\n    inorder(n.left, res); res.add(n.val); inorder(n.right, res);\n}`,
      },
      stream: {
        hint: "Flatten tree to stream by concatenating left, root, right streams",
        snippet: `Stream<Integer> s(TreeNode n) {\n    if (n==null) return Stream.empty();\n    return Stream.concat(Stream.concat(s(n.left),Stream.of(n.val)),s(n.right));\n}`,
      },
    },
    {
      id: 212,
      title: "Preorder traversal",
      problem:
        "Given the root of a binary tree, return its preorder traversal as a list of node values.",
      examples: [
        { input: "root = [1,null,2,3]", output: "[1,2,3]" },
        { input: "root = [4,2,5,1,3]", output: "[4,2,1,3,5]" },
      ],
      tip: "Root→Left→Right; iterative pushes right then left so left is processed first",
      iteration: {
        hint: "Push root, pop and visit, push right then left child",
        snippet: `Deque<TreeNode> st = new ArrayDeque<>();\nst.push(root);\nwhile (!st.isEmpty()) {\n    TreeNode c = st.pop(); res.add(c.val);\n    if (c.right!=null) st.push(c.right);\n    if (c.left!=null) st.push(c.left);\n}`,
      },
      recursion: {
        hint: "Visit root, recurse left, recurse right",
        snippet: `void preorder(TreeNode n, List<Integer> res) {\n    if (n == null) return;\n    res.add(n.val);\n    preorder(n.left, res); preorder(n.right, res);\n}`,
      },
      stream: {
        hint: "Stream root first, then concatenate left and right subtree streams",
        snippet: `Stream<Integer> s(TreeNode n) {\n    if (n==null) return Stream.empty();\n    return Stream.concat(Stream.of(n.val),Stream.concat(s(n.left),s(n.right)));\n}`,
      },
    },
    {
      id: 213,
      title: "Postorder traversal",
      problem:
        "Given the root of a binary tree, return its postorder traversal as a list of node values.",
      examples: [
        { input: "root = [1,null,2,3]", output: "[3,2,1]" },
        { input: "root = [4,2,5,1,3]", output: "[1,3,2,5,4]" },
      ],
      tip: "Left→Right→Root; iterative trick: do reverse-preorder (Root→Right→Left) then reverse the list",
      iteration: {
        hint: "Collect root-right-left into a deque addFirst to reverse output",
        snippet: `Deque<TreeNode> st = new ArrayDeque<>();\nDeque<Integer> out = new ArrayDeque<>();\nst.push(root);\nwhile (!st.isEmpty()) {\n    TreeNode c = st.pop(); out.addFirst(c.val);\n    if (c.left!=null) st.push(c.left);\n    if (c.right!=null) st.push(c.right);\n}`,
      },
      recursion: {
        hint: "Recurse left, recurse right, then visit root",
        snippet: `void postorder(TreeNode n, List<Integer> res) {\n    if (n == null) return;\n    postorder(n.left, res); postorder(n.right, res);\n    res.add(n.val);\n}`,
      },
      stream: {
        hint: "Stream left and right subtrees first, then append root value",
        snippet: `Stream<Integer> s(TreeNode n) {\n    if (n==null) return Stream.empty();\n    return Stream.concat(Stream.concat(s(n.left),s(n.right)),Stream.of(n.val));\n}`,
      },
    },
    {
      id: 214,
      title: "Level order traversal",
      problem:
        "Given the root of a binary tree, return the level order traversal of its node values.",
      examples: [
        {
          input: "root = [3,9,20,null,null,15,7]",
          output: "[[3],[9,20],[15,7]]",
        },
        { input: "root = [1]", output: "[[1]]" },
      ],
      tip: "BFS with a queue; capture queue size at the start of each level to process level by level",
      iteration: {
        hint: "Poll each level's nodes by snapshotting queue size, then enqueue children",
        snippet: `Queue<TreeNode> q = new LinkedList<>(); q.offer(root);\nwhile (!q.isEmpty()) {\n    int sz = q.size(); List<Integer> row = new ArrayList<>();\n    for (int i=0;i<sz;i++) { TreeNode c=q.poll(); row.add(c.val);\n        if(c.left!=null)q.offer(c.left); if(c.right!=null)q.offer(c.right); }\n    res.add(row);\n}`,
      },
      recursion: {
        hint: "Pass depth as parameter; grow result list on first visit to each level",
        snippet: `void dfs(TreeNode n, int d, List<List<Integer>> res) {\n    if (n==null) return;\n    if (d==res.size()) res.add(new ArrayList<>());\n    res.get(d).add(n.val);\n    dfs(n.left,d+1,res); dfs(n.right,d+1,res);\n}`,
      },
      stream: {
        hint: "Group nodes by depth into a map, then stream sorted by depth",
        snippet: `Map<Integer,List<Integer>> map = new TreeMap<>();\nfill(root,0,map);\nmap.values().forEach(res::add);\n// fill: map.computeIfAbsent(d,k->new ArrayList<>()).add(n.val);`,
      },
    },
    {
      id: 215,
      title: "Zigzag level order traversal",
      problem:
        "Given the root of a binary tree, return its zigzag level order traversal, alternating direction each level.",
      examples: [
        {
          input: "root = [3,9,20,null,null,15,7]",
          output: "[[3],[20,9],[15,7]]",
        },
        { input: "root = [1,2,3,4,null,null,5]", output: "[[1],[3,2],[4,5]]" },
      ],
      tip: "BFS level order but alternate insertion direction using a flag per level",
      iteration: {
        hint: "Use a deque per level; add to front or back based on level parity",
        snippet: `Queue<TreeNode> q = new LinkedList<>(); q.offer(root); boolean left=false;\nwhile (!q.isEmpty()) {\n    int sz=q.size(); Deque<Integer> row=new ArrayDeque<>();\n    for (int i=0;i<sz;i++) { TreeNode c=q.poll();\n        if(left) row.addFirst(c.val); else row.addLast(c.val);\n        if(c.left!=null)q.offer(c.left); if(c.right!=null)q.offer(c.right); }\n    res.add(new ArrayList<>(row)); left=!left; }`,
      },
      recursion: {
        hint: "DFS with depth; reverse the level list when depth is even",
        snippet: `void dfs(TreeNode n, int d, List<List<Integer>> res) {\n    if (n==null) return;\n    if (d==res.size()) res.add(new ArrayList<>());\n    if (d%2==0) res.get(d).add(n.val); else res.get(d).add(0,n.val);\n    dfs(n.left,d+1,res); dfs(n.right,d+1,res);\n}`,
      },
      stream: {
        hint: "Collect level-order groups, then reverse odd-indexed lists via stream",
        snippet: `IntStream.range(0,res.size()).forEach(i -> {\n    if (i%2==0) Collections.reverse(res.get(i));\n});\n// (collect res via standard BFS first)`,
      },
    },
    {
      id: 216,
      title: "Maximum depth of a binary tree",
      problem: "Given the root of a binary tree, return its maximum depth.",
      examples: [
        { input: "root = [3,9,20,null,null,15,7]", output: "3" },
        { input: "root = [1,null,2]", output: "2" },
      ],
      tip: "Max depth = 1 + max(leftDepth, rightDepth); BFS counts levels",
      iteration: {
        hint: "BFS level by level, increment depth counter each time queue-level is exhausted",
        snippet: `Queue<TreeNode> q = new LinkedList<>(); q.offer(root); int depth=0;\nwhile (!q.isEmpty()) {\n    int sz=q.size(); depth++;\n    for (int i=0;i<sz;i++) { TreeNode c=q.poll();\n        if(c.left!=null)q.offer(c.left); if(c.right!=null)q.offer(c.right); }\n}\nreturn depth;`,
      },
      recursion: {
        hint: "Return 0 for null, else 1 + max of left and right depths",
        snippet: `int maxDepth(TreeNode n) {\n    if (n == null) return 0;\n    return 1 + Math.max(maxDepth(n.left), maxDepth(n.right));\n}`,
      },
      stream: {
        hint: "Stream children and map to max depth recursively",
        snippet: `int depth(TreeNode n) {\n    if (n==null) return 0;\n    return 1 + Stream.of(n.left,n.right)\n        .mapToInt(this::depth).max().orElse(0);\n}`,
      },
    },
    {
      id: 217,
      title: "Minimum depth of a binary tree",
      problem:
        "Given the root of a binary tree, return the minimum depth from the root to any leaf.",
      examples: [
        { input: "root = [3,9,20,null,null,15,7]", output: "2" },
        { input: "root = [2,null,3,null,4]", output: "3" },
      ],
      tip: "Minimum depth is to the nearest leaf; BFS is optimal since it finds the first leaf soonest",
      iteration: {
        hint: "BFS; return depth when a node with no children is dequeued",
        snippet: `Queue<TreeNode> q = new LinkedList<>(); q.offer(root); int depth=0;\nwhile (!q.isEmpty()) {\n    int sz=q.size(); depth++;\n    for (int i=0;i<sz;i++) { TreeNode c=q.poll();\n        if(c.left==null&&c.right==null) return depth;\n        if(c.left!=null)q.offer(c.left); if(c.right!=null)q.offer(c.right); }\n}\nreturn depth;`,
      },
      recursion: {
        hint: "If one child is null, recurse only on the non-null side to avoid counting internal nodes as leaves",
        snippet: `int minDepth(TreeNode n) {\n    if (n==null) return 0;\n    if (n.left==null) return 1+minDepth(n.right);\n    if (n.right==null) return 1+minDepth(n.left);\n    return 1+Math.min(minDepth(n.left),minDepth(n.right));\n}`,
      },
      stream: {
        hint: "Handle single-child case in stream by filtering non-null children only",
        snippet: `int minDepth(TreeNode n) {\n    if (n==null) return 0;\n    List<TreeNode> kids = Stream.of(n.left,n.right)\n        .filter(Objects::nonNull).collect(Collectors.toList());\n    if (kids.isEmpty()) return 1;\n    return 1+kids.stream().mapToInt(this::minDepth).min().getAsInt();\n}`,
      },
    },
    {
      id: 218,
      title: "Check if a tree is height-balanced",
      problem:
        "Given the root of a binary tree, return true if every node has left and right subtree heights differing by at most one.",
      examples: [
        { input: "root = [3,9,20,null,null,15,7]", output: "true" },
        { input: "root = [1,2,2,3,3,null,null,4,4]", output: "false" },
      ],
      tip: "A tree is balanced if every node's left/right subtree heights differ by at most 1; return -1 as sentinel for unbalanced",
      iteration: {
        hint: "Post-order iterative using two stacks to compute heights bottom-up",
        snippet: `// Use post-order stack + map to store heights\nMap<TreeNode,Integer> h = new HashMap<>();\n// post-order: h.put(n, 1+Math.max(h.getOrDefault(n.left,0),h.getOrDefault(n.right,0)))\n// check: Math.abs(h.getOrDefault(n.left,0)-h.getOrDefault(n.right,0))<=1`,
      },
      recursion: {
        hint: "Return -1 if unbalanced, otherwise return height; check both children",
        snippet: `int height(TreeNode n) {\n    if (n==null) return 0;\n    int l=height(n.left); if(l<0) return -1;\n    int r=height(n.right); if(r<0) return -1;\n    return Math.abs(l-r)>1 ? -1 : 1+Math.max(l,r);\n}`,
      },
      stream: {
        hint: "Compute height via stream; short-circuit by propagating -1 sentinel",
        snippet: `int h(TreeNode n) {\n    if (n==null) return 0;\n    int l=h(n.left), r=h(n.right);\n    return (l<0||r<0||Math.abs(l-r)>1) ? -1 : 1+Math.max(l,r);\n}`,
      },
    },
    {
      id: 219,
      title: "Diameter of a binary tree",
      problem:
        "Given the root of a binary tree, return the diameter, measured as the number of edges on the longest path between any two nodes.",
      examples: [
        { input: "root = [1,2,3,4,5]", output: "3" },
        { input: "root = [1,2]", output: "1" },
      ],
      tip: "Diameter through a node = leftHeight + rightHeight; track global max during height DFS",
      iteration: {
        hint: "Post-order iterative; compute height for each node and update diameter",
        snippet: `int[] max = {0};\n// post-order stack traversal computing heights:\n// int d = h.getOrDefault(n.left,0)+h.getOrDefault(n.right,0);\n// max[0] = Math.max(max[0], d);\n// h.put(n, 1+Math.max(h.getOrDefault(n.left,0),h.getOrDefault(n.right,0)));`,
      },
      recursion: {
        hint: "DFS returns height; update max diameter at each node as left+right heights",
        snippet: `int[] max = {0};\nint dfs(TreeNode n) {\n    if (n==null) return 0;\n    int l=dfs(n.left), r=dfs(n.right);\n    max[0]=Math.max(max[0],l+r);\n    return 1+Math.max(l,r);\n}`,
      },
      stream: {
        hint: "Combine height computation and diameter tracking in a single recursive stream call",
        snippet: `int[] ans={0};\nint h(TreeNode n){\n    if(n==null) return 0;\n    int l=h(n.left),r=h(n.right);\n    return IntStream.of(l+r).peek(d->ans[0]=Math.max(ans[0],d)).max().getAsInt()\n        +1-IntStream.of(l+r).max().getAsInt()+Math.max(l,r);\n}\n// simpler: just use recursion approach above`,
      },
    },
    {
      id: 220,
      title: "Path sum (root to leaf)",
      problem:
        "Given the root of a binary tree and targetSum, return true if any root-to-leaf path has values summing to targetSum.",
      examples: [
        {
          input:
            "root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22",
          output: "true",
        },
        { input: "root = [1,2,3], targetSum = 5", output: "false" },
      ],
      tip: "Subtract node value from target as you recurse; return true when leaf is reached and remainder is 0",
      iteration: {
        hint: "DFS with stack of (node, remaining sum) pairs; check leaf condition on pop",
        snippet: `Deque<Object[]> st = new ArrayDeque<>();\nst.push(new Object[]{root, target});\nwhile (!st.isEmpty()) {\n    Object[] cur=st.pop(); TreeNode n=(TreeNode)cur[0]; int rem=(int)cur[1];\n    if(n.left==null&&n.right==null&&rem==n.val) return true;\n    if(n.right!=null) st.push(new Object[]{n.right,rem-n.val});\n    if(n.left!=null) st.push(new Object[]{n.left,rem-n.val}); }`,
      },
      recursion: {
        hint: "At each node subtract its value; at a leaf return true if remainder equals node value",
        snippet: `boolean hasPath(TreeNode n, int target) {\n    if (n==null) return false;\n    if (n.left==null&&n.right==null) return n.val==target;\n    return hasPath(n.left,target-n.val)||hasPath(n.right,target-n.val);\n}`,
      },
      stream: {
        hint: "Stream both children's results and short-circuit with anyMatch",
        snippet: `boolean hasPath(TreeNode n, int t) {\n    if (n==null) return false;\n    if (n.left==null&&n.right==null) return n.val==t;\n    return Stream.of(n.left,n.right)\n        .filter(Objects::nonNull).anyMatch(c->hasPath(c,t-n.val));\n}`,
      },
    },
    {
      id: 221,
      title: "Path sum II (return all root-to-leaf paths)",
      problem:
        "Given the root of a binary tree and targetSum, return all root-to-leaf paths whose values sum to targetSum.",
      examples: [
        {
          input:
            "root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22",
          output: "[[5,4,11,2],[5,8,4,5]]",
        },
        { input: "root = [1,2,3], targetSum = 5", output: "[]" },
      ],
      tip: "Backtracking DFS: add node to path, recurse, remove node after returning (backtrack)",
      iteration: {
        hint: "Iterative DFS with stack storing (node, current path list) snapshots",
        snippet: `Deque<Object[]> st = new ArrayDeque<>();\nst.push(new Object[]{root, new ArrayList<>(), target});\nwhile (!st.isEmpty()) {\n    Object[] cur=st.pop(); TreeNode n=(TreeNode)cur[0];\n    List<Integer> path=new ArrayList<>((List<Integer>)cur[1]); path.add(n.val);\n    int rem=(int)cur[2]-n.val;\n    if(n.left==null&&n.right==null&&rem==0) res.add(path);\n    if(n.right!=null)st.push(new Object[]{n.right,path,rem});\n    if(n.left!=null)st.push(new Object[]{n.left,path,rem}); }`,
      },
      recursion: {
        hint: "Add to path at entry, recurse; on leaf with matching sum record path, then backtrack",
        snippet: `void dfs(TreeNode n, int rem, List<Integer> path, List<List<Integer>> res) {\n    if (n==null) return;\n    path.add(n.val);\n    if (n.left==null&&n.right==null&&rem==n.val) res.add(new ArrayList<>(path));\n    dfs(n.left,rem-n.val,path,res); dfs(n.right,rem-n.val,path,res);\n    path.remove(path.size()-1);\n}`,
      },
      stream: {
        hint: "Recursively build stream of paths; prepend current node to each child path",
        snippet: `Stream<List<Integer>> paths(TreeNode n, int rem) {\n    if (n==null) return Stream.empty();\n    if (n.left==null&&n.right==null&&rem==n.val) return Stream.of(List.of(n.val));\n    return Stream.concat(paths(n.left,rem-n.val),paths(n.right,rem-n.val))\n        .map(p->{ List<Integer> l=new ArrayList<>(); l.add(n.val); l.addAll(p); return l; });\n}`,
      },
    },
    {
      id: 222,
      title: "Lowest common ancestor (LCA)",
      problem:
        "Given the root of a binary tree and two nodes p and q, return their lowest common ancestor.",
      examples: [
        {
          input: "root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1",
          output: "3",
        },
        {
          input: "root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4",
          output: "5",
        },
      ],
      tip: "If both targets lie in different subtrees, the current node is the LCA; if one found, bubble it up",
      iteration: {
        hint: "Build a parent map via BFS, then walk ancestors of p and q to find first common",
        snippet: `Map<TreeNode,TreeNode> parent = new HashMap<>();\nparent.put(root,null); Queue<TreeNode> q=new LinkedList<>(); q.offer(root);\nwhile(!q.isEmpty()){TreeNode c=q.poll();\n    if(c.left!=null){parent.put(c.left,c);q.offer(c.left);}\n    if(c.right!=null){parent.put(c.right,c);q.offer(c.right);}}\nSet<TreeNode> anc=new HashSet<>();\nwhile(p!=null){anc.add(p);p=parent.get(p);}\nwhile(!anc.contains(q2))q2=parent.get(q2);\nreturn q2;`,
      },
      recursion: {
        hint: "Return the node itself if it matches p or q; LCA is where left and right both return non-null",
        snippet: `TreeNode lca(TreeNode n, TreeNode p, TreeNode q) {\n    if (n==null||n==p||n==q) return n;\n    TreeNode l=lca(n.left,p,q), r=lca(n.right,p,q);\n    return l==null?r:r==null?l:n;\n}`,
      },
      stream: {
        hint: "Collect ancestor sets via stream and find first intersection",
        snippet: `// build ancestor set for p via parent map, then:\nTreeNode res = q;\nwhile (!ancestors.contains(res)) res = parent.get(res);\nreturn res;`,
      },
    },
    {
      id: 223,
      title: "Validate a binary search tree",
      problem:
        "Given the root of a binary tree, return true if it is a valid binary search tree.",
      examples: [
        { input: "root = [2,1,3]", output: "true" },
        { input: "root = [5,1,4,null,null,3,6]", output: "false" },
      ],
      tip: "Pass min/max bounds down the tree; every node must satisfy min < node.val < max",
      iteration: {
        hint: "Iterative inorder traversal; check that each value is strictly greater than previous",
        snippet: `Deque<TreeNode> st=new ArrayDeque<>(); TreeNode c=root; long prev=Long.MIN_VALUE;\nwhile(c!=null||!st.isEmpty()){\n    while(c!=null){st.push(c);c=c.left;}\n    c=st.pop(); if(c.val<=prev) return false;\n    prev=c.val; c=c.right;\n}\nreturn true;`,
      },
      recursion: {
        hint: "Recurse with long min/max bounds updated at each step",
        snippet: `boolean valid(TreeNode n, long min, long max) {\n    if (n==null) return true;\n    if (n.val<=min||n.val>=max) return false;\n    return valid(n.left,min,n.val)&&valid(n.right,n.val,max);\n}`,
      },
      stream: {
        hint: "Collect inorder stream and verify it is strictly increasing",
        snippet: `List<Integer> vals = new ArrayList<>();\ninorder(root, vals); // collect inorder\nreturn IntStream.range(1,vals.size())\n    .allMatch(i->vals.get(i)>vals.get(i-1));`,
      },
    },
    {
      id: 224,
      title: "Kth smallest element in a BST",
      problem:
        "Given the root of a BST and an integer k, return the kth smallest node value.",
      examples: [
        { input: "root = [3,1,4,null,2], k = 1", output: "1" },
        { input: "root = [5,3,6,2,4,null,null,1], k = 3", output: "3" },
      ],
      tip: "Inorder traversal of BST yields sorted sequence; stop at the kth element",
      iteration: {
        hint: "Inorder iterative; decrement k on each pop and return when k reaches 0",
        snippet: `Deque<TreeNode> st=new ArrayDeque<>(); TreeNode c=root;\nwhile(c!=null||!st.isEmpty()){\n    while(c!=null){st.push(c);c=c.left;}\n    c=st.pop(); if(--k==0) return c.val;\n    c=c.right;\n}\nreturn -1;`,
      },
      recursion: {
        hint: "Inorder DFS; use a counter array to track and capture the kth node",
        snippet: `int[] cnt={k}, ans={0};\nvoid dfs(TreeNode n){\n    if(n==null||cnt[0]==0) return;\n    dfs(n.left);\n    if(--cnt[0]==0) ans[0]=n.val;\n    dfs(n.right);\n}`,
      },
      stream: {
        hint: "Stream inorder values and skip k-1 elements, return the next",
        snippet: `// inorderStream(root) produces sorted stream\nreturn inorderStream(root).skip(k-1).findFirst().getAsInt();`,
      },
    },
    {
      id: 225,
      title: "Convert sorted array to a balanced BST",
      problem:
        "Given a sorted integer array, convert it into a height-balanced binary search tree.",
      examples: [
        { input: "nums = [-10,-3,0,5,9]", output: "[0,-3,9,-10,null,5]" },
        { input: "nums = [1,3]", output: "[1,null,3]" },
      ],
      tip: "Always pick the middle element as root to ensure balance; recurse on left and right halves",
      iteration: {
        hint: "Use an explicit stack of (lo, hi, parent, isLeft) tuples to build the tree iteratively",
        snippet: `// Stack stores int[]{lo, hi} and map to track nodes\nDeque<int[]> st=new ArrayDeque<>(); st.push(new int[]{0,nums.length-1});\n// Each pop: mid=(lo+hi)/2, create node, push {lo,mid-1} and {mid+1,hi}\n// Link child to parent tracked in a separate map`,
      },
      recursion: {
        hint: "Recurse on [lo, mid-1] and [mid+1, hi] with mid-element as root",
        snippet: `TreeNode build(int[] nums, int lo, int hi) {\n    if (lo>hi) return null;\n    int mid=(lo+hi)/2;\n    TreeNode n=new TreeNode(nums[mid]);\n    n.left=build(nums,lo,mid-1);\n    n.right=build(nums,mid+1,hi);\n    return n;\n}`,
      },
      stream: {
        hint: "Use IntStream to pick mid index and recursively build subtrees",
        snippet: `TreeNode build(int[] a, int lo, int hi){\n    return lo>hi ? null : IntStream.of((lo+hi)/2).mapToObj(m->{\n        TreeNode n=new TreeNode(a[m]);\n        n.left=build(a,lo,m-1); n.right=build(a,m+1,hi); return n;\n    }).findFirst().get();\n}`,
      },
    },
    {
      id: 226,
      title: "Serialize and deserialize a binary tree",
      problem:
        "Design methods to serialize a binary tree into a string and deserialize that string back to the original tree.",
      examples: [
        {
          input: "root = [1,2,3,null,null,4,5]",
          output: "[1,2,3,null,null,4,5]",
        },
        { input: "root = []", output: "[]" },
      ],
      tip: "Preorder with null markers allows exact reconstruction; use comma-separated tokens",
      iteration: {
        hint: "BFS serialize with null markers; BFS deserialize linking children by queue index",
        snippet: `// Serialize: BFS, append val or 'null' with commas\n// Deserialize: split, BFS queue of parents, assign left/right from token array\nString[] tokens = data.split(",");\nQueue<TreeNode> q=new LinkedList<>();\nTreeNode root=new TreeNode(Integer.parseInt(tokens[0])); q.offer(root); int i=1;\nwhile(!q.isEmpty()&&i<tokens.length){\n    TreeNode c=q.poll();\n    if(!tokens[i].equals("null")){c.left=new TreeNode(Integer.parseInt(tokens[i]));q.offer(c.left);} i++;\n    if(i<tokens.length&&!tokens[i].equals("null")){c.right=new TreeNode(Integer.parseInt(tokens[i]));q.offer(c.right);} i++;}`,
      },
      recursion: {
        hint: "Preorder serialize with '#' for null; deserialize by consuming from a queue of tokens",
        snippet: `void ser(TreeNode n, StringBuilder sb){\n    if(n==null){sb.append("#,");return;}\n    sb.append(n.val).append(",");\n    ser(n.left,sb); ser(n.right,sb);\n}\nTreeNode des(Queue<String> q){\n    String s=q.poll(); if(s.equals("#")) return null;\n    TreeNode n=new TreeNode(Integer.parseInt(s));\n    n.left=des(q); n.right=des(q); return n;\n}`,
      },
      stream: {
        hint: "Collect preorder tokens to list; deserialize using an AtomicInteger index over the list",
        snippet: `TreeNode des(List<String> t, int[] i){\n    if(i[0]>=t.size()||t.get(i[0]).equals("#")){i[0]++;return null;}\n    TreeNode n=new TreeNode(Integer.parseInt(t.get(i[0]++)));\n    n.left=des(t,i); n.right=des(t,i); return n;\n}`,
      },
    },
    {
      id: 227,
      title: "Right side view of a tree",
      problem:
        "Given the root of a binary tree, return the values visible from the right side from top to bottom.",
      examples: [
        { input: "root = [1,2,3,null,5,null,4]", output: "[1,3,4]" },
        { input: "root = [1,null,3]", output: "[1,3]" },
      ],
      tip: "BFS level order; the last node in each level is visible from the right side",
      iteration: {
        hint: "BFS; record the last value dequeued in each level iteration",
        snippet: `Queue<TreeNode> q=new LinkedList<>(); q.offer(root);\nwhile(!q.isEmpty()){\n    int sz=q.size(); int val=0;\n    for(int i=0;i<sz;i++){TreeNode c=q.poll();val=c.val;\n        if(c.left!=null)q.offer(c.left);\n        if(c.right!=null)q.offer(c.right);}\n    res.add(val);\n}`,
      },
      recursion: {
        hint: "DFS right-first; add to result only when depth equals result size (first visit per level)",
        snippet: `void dfs(TreeNode n, int d, List<Integer> res){\n    if(n==null) return;\n    if(d==res.size()) res.add(n.val);\n    else res.set(d,n.val); // overwrite with rightmost\n    dfs(n.left,d+1,res); dfs(n.right,d+1,res);\n}`,
      },
      stream: {
        hint: "Collect level lists and stream map to last element of each",
        snippet: `levelOrder(root).stream() // List<List<Integer>>\n    .map(lvl->lvl.get(lvl.size()-1))\n    .collect(Collectors.toList());`,
      },
    },
    {
      id: 228,
      title: "Left side view of a tree",
      problem:
        "Given the root of a binary tree, return the values visible from the left side from top to bottom.",
      examples: [
        { input: "root = [1,2,3,null,5,null,4]", output: "[1,2,5]" },
        { input: "root = [1,null,3]", output: "[1,3]" },
      ],
      tip: "BFS level order; the first node in each level is visible from the left side",
      iteration: {
        hint: "BFS; record the first value encountered in each level",
        snippet: `Queue<TreeNode> q=new LinkedList<>(); q.offer(root);\nwhile(!q.isEmpty()){\n    int sz=q.size();\n    for(int i=0;i<sz;i++){TreeNode c=q.poll();\n        if(i==0) res.add(c.val);\n        if(c.left!=null)q.offer(c.left);\n        if(c.right!=null)q.offer(c.right);}\n}`,
      },
      recursion: {
        hint: "DFS left-first; add to result only on the first visit at each depth",
        snippet: `void dfs(TreeNode n, int d, List<Integer> res){\n    if(n==null) return;\n    if(d==res.size()) res.add(n.val);\n    dfs(n.left,d+1,res); dfs(n.right,d+1,res);\n}`,
      },
      stream: {
        hint: "Map each level list to its first element via stream",
        snippet: `levelOrder(root).stream()\n    .map(lvl->lvl.get(0))\n    .collect(Collectors.toList());`,
      },
    },
    {
      id: 229,
      title: "Boundary traversal of a tree",
      problem:
        "Given the root of a binary tree, return its boundary traversal in anti-clockwise order without duplicates.",
      examples: [
        { input: "root = [1,2,3,4,5,6,7]", output: "[1,2,4,5,6,7,3]" },
        { input: "root = [1,null,2,3,4]", output: "[1,3,4,2]" },
      ],
      tip: "Boundary = left boundary (top-down, no leaves) + all leaves + right boundary (bottom-up, no leaves)",
      iteration: {
        hint: "Iteratively collect left boundary, then leaves via DFS/BFS, then right boundary reversed",
        snippet: `// Left boundary: go left-preferring top-down excluding leaf\n// Leaves: inorder-like traversal, add if leaf\n// Right boundary: go right-preferring top-down excluding leaf, then reverse\nList<Integer> res=new ArrayList<>();\nres.add(root.val);\naddLeft(root.left,res); addLeaves(root,res); addRight(root.right,res);`,
      },
      recursion: {
        hint: "Three separate recursive passes: left boundary, leaf nodes, right boundary",
        snippet: `void leftBound(TreeNode n,List<Integer> r){\n    if(n==null||isLeaf(n)) return;\n    r.add(n.val);\n    if(n.left!=null) leftBound(n.left,r); else leftBound(n.right,r);\n}\nvoid leaves(TreeNode n,List<Integer> r){\n    if(n==null) return;\n    if(isLeaf(n)){r.add(n.val);return;}\n    leaves(n.left,r); leaves(n.right,r);\n}`,
      },
      stream: {
        hint: "Stream three concatenated parts: left path, leaves, reversed right path",
        snippet: `return Stream.of(Stream.of(root.val),\n    leftBoundStream(root.left),\n    leavesStream(root),\n    rightBoundStream(root.right))\n    .flatMap(s->s).collect(Collectors.toList());`,
      },
    },
    {
      id: 230,
      title: "Vertical order traversal",
      problem:
        "Given the root of a binary tree, return the vertical order traversal grouped by horizontal column from left to right.",
      examples: [
        {
          input: "root = [3,9,20,null,null,15,7]",
          output: "[[9],[3,15],[20],[7]]",
        },
        {
          input: "root = [1,2,3,4,5,6,7]",
          output: "[[4],[2],[1,5,6],[3],[7]]",
        },
      ],
      tip: "Assign column index (left child = col-1, right child = col+1); group by col then row, sort ties by value",
      iteration: {
        hint: "BFS carrying (node, row, col); store in TreeMap<col, TreeMap<row, PriorityQueue>>",
        snippet: `Map<Integer,Map<Integer,PriorityQueue<Integer>>> m=new TreeMap<>();\nQueue<int[]> q=new LinkedList<>(); // [node_id, row, col]\n// BFS: map each node_id to TreeNode; for each dequeued node:\n// m.computeIfAbsent(col,x->new TreeMap<>()).computeIfAbsent(row,x->new PriorityQueue<>()).add(val);\n// Then flatten map to result list`,
      },
      recursion: {
        hint: "DFS with row and col; accumulate into TreeMap structure sorted by col, row, value",
        snippet: `void dfs(TreeNode n,int r,int c,Map<Integer,Map<Integer,PriorityQueue<Integer>>> m){\n    if(n==null) return;\n    m.computeIfAbsent(c,x->new TreeMap<>())\n     .computeIfAbsent(r,x->new PriorityQueue<>()).add(n.val);\n    dfs(n.left,r+1,c-1,m); dfs(n.right,r+1,c+1,m);\n}`,
      },
      stream: {
        hint: "Collect (col,row,val) triples via DFS; sort and group using streams",
        snippet: `List<int[]> points=new ArrayList<>();\ndfs(root,0,0,points); // adds {col,row,val}\npoints.stream().sorted(Comparator.comparingInt((int[]a)->a[0])\n    .thenComparingInt(a->a[1]).thenComparingInt(a->a[2]))\n    // then group by col[0] into result`,
      },
    },
    {
      id: 231,
      title: "Top view of a binary tree",
      problem:
        "Given the root of a binary tree, return the top view of the tree from leftmost column to rightmost column.",
      examples: [
        { input: "root = [1,2,3,4,5,6,7]", output: "[4,2,1,3,7]" },
        { input: "root = [1,2,3,null,4,null,5]", output: "[2,1,3,5]" },
      ],
      tip: "First node seen at each horizontal distance (column) in BFS level order forms the top view",
      iteration: {
        hint: "BFS with (node, col) pairs; add to result map only if col is first seen",
        snippet: `Map<Integer,Integer> topMap=new TreeMap<>();\nQueue<Object[]> q=new LinkedList<>(); q.offer(new Object[]{root,0});\nwhile(!q.isEmpty()){\n    Object[] cur=q.poll(); TreeNode n=(TreeNode)cur[0]; int col=(int)cur[1];\n    topMap.putIfAbsent(col,n.val);\n    if(n.left!=null)q.offer(new Object[]{n.left,col-1});\n    if(n.right!=null)q.offer(new Object[]{n.right,col+1});\n}\nreturn new ArrayList<>(topMap.values());`,
      },
      recursion: {
        hint: "DFS with col and depth; update map only when current depth is less than stored depth",
        snippet: `void dfs(TreeNode n,int col,int d,Map<Integer,int[]> m){\n    if(n==null) return;\n    if(!m.containsKey(col)||d<m.get(col)[1]) m.put(col,new int[]{n.val,d});\n    dfs(n.left,col-1,d+1,m); dfs(n.right,col+1,d+1,m);\n}`,
      },
      stream: {
        hint: "Collect (col, depth, val) via DFS; stream to pick min-depth val per column",
        snippet: `// After collecting triples, group by col:\ntriples.stream().collect(Collectors.groupingBy(a->a[0]))\n    .entrySet().stream().sorted(Map.Entry.comparingByKey())\n    .map(e->e.getValue().stream().min(Comparator.comparingInt(a->a[1])).get()[2])`,
      },
    },
    {
      id: 232,
      title: "Bottom view of a binary tree",
      problem:
        "Given the root of a binary tree, return the bottom view of the tree from leftmost column to rightmost column.",
      examples: [
        { input: "root = [1,2,3,4,5,6,7]", output: "[4,2,6,3,7]" },
        { input: "root = [1,2,3,null,4,null,5]", output: "[2,4,3,5]" },
      ],
      tip: "Last node seen at each horizontal distance in BFS level order is the bottom view node",
      iteration: {
        hint: "BFS with (node, col); overwrite map entry at each col — last write wins",
        snippet: `Map<Integer,Integer> botMap=new TreeMap<>();\nQueue<Object[]> q=new LinkedList<>(); q.offer(new Object[]{root,0});\nwhile(!q.isEmpty()){\n    Object[] cur=q.poll(); TreeNode n=(TreeNode)cur[0]; int col=(int)cur[1];\n    botMap.put(col,n.val); // always overwrite\n    if(n.left!=null)q.offer(new Object[]{n.left,col-1});\n    if(n.right!=null)q.offer(new Object[]{n.right,col+1});\n}\nreturn new ArrayList<>(botMap.values());`,
      },
      recursion: {
        hint: "DFS with col and depth; update map when current depth is >= stored depth",
        snippet: `void dfs(TreeNode n,int col,int d,Map<Integer,int[]> m){\n    if(n==null) return;\n    if(!m.containsKey(col)||d>=m.get(col)[1]) m.put(col,new int[]{n.val,d});\n    dfs(n.left,col-1,d+1,m); dfs(n.right,col+1,d+1,m);\n}`,
      },
      stream: {
        hint: "Group by column; pick max-depth value per column via stream",
        snippet: `triples.stream().collect(Collectors.groupingBy(a->a[0]))\n    .entrySet().stream().sorted(Map.Entry.comparingByKey())\n    .map(e->e.getValue().stream().max(Comparator.comparingInt(a->a[1])).get()[2])`,
      },
    },
    {
      id: 233,
      title: "Check if a tree is symmetric",
      problem:
        "Given the root of a binary tree, return true if the tree is symmetric around its center.",
      examples: [
        { input: "root = [1,2,2,3,4,4,3]", output: "true" },
        { input: "root = [1,2,2,null,3,null,3]", output: "false" },
      ],
      tip: "A tree is symmetric if its left and right subtrees are mirrors; compare left.left with right.right and left.right with right.left",
      iteration: {
        hint: "Use a queue/stack pairing nodes that should be mirror images; check each pair",
        snippet: `Queue<TreeNode> q=new LinkedList<>();\nq.offer(root.left); q.offer(root.right);\nwhile(!q.isEmpty()){\n    TreeNode l=q.poll(),r=q.poll();\n    if(l==null&&r==null) continue;\n    if(l==null||r==null||l.val!=r.val) return false;\n    q.offer(l.left);q.offer(r.right);\n    q.offer(l.right);q.offer(r.left);\n}\nreturn true;`,
      },
      recursion: {
        hint: "Recursively check if outer pair (l.left, r.right) and inner pair (l.right, r.left) are mirrors",
        snippet: `boolean mirror(TreeNode l, TreeNode r){\n    if(l==null&&r==null) return true;\n    if(l==null||r==null||l.val!=r.val) return false;\n    return mirror(l.left,r.right)&&mirror(l.right,r.left);\n}`,
      },
      stream: {
        hint: "Serialize left subtree normally and right subtree mirrored; compare resulting streams",
        snippet: `// Compare inorder(left) with reverse-inorder(right):\nList<Integer> leftOrder=new ArrayList<>();\nList<Integer> rightOrder=new ArrayList<>();\ninorder(root.left,leftOrder); reverseInorder(root.right,rightOrder);\nreturn leftOrder.equals(rightOrder);`,
      },
    },
    {
      id: 234,
      title: "Mirror/invert a binary tree",
      problem:
        "Given the root of a binary tree, invert it by swapping every node's left and right children and return the root.",
      examples: [
        { input: "root = [4,2,7,1,3,6,9]", output: "[4,7,2,9,6,3,1]" },
        { input: "root = [2,1,3]", output: "[2,3,1]" },
      ],
      tip: "Swap left and right children at every node; works top-down or bottom-up",
      iteration: {
        hint: "BFS or DFS; for each dequeued node swap its left and right children then enqueue both",
        snippet: `Queue<TreeNode> q=new LinkedList<>(); q.offer(root);\nwhile(!q.isEmpty()){\n    TreeNode c=q.poll();\n    TreeNode tmp=c.left; c.left=c.right; c.right=tmp;\n    if(c.left!=null)q.offer(c.left);\n    if(c.right!=null)q.offer(c.right);\n}\nreturn root;`,
      },
      recursion: {
        hint: "Recurse into both children, then swap them at the current node",
        snippet: `TreeNode invert(TreeNode n){\n    if(n==null) return null;\n    TreeNode tmp=invert(n.left);\n    n.left=invert(n.right);\n    n.right=tmp;\n    return n;\n}`,
      },
      stream: {
        hint: "Map each node's children through invert and assign in swapped order",
        snippet: `TreeNode invert(TreeNode n){\n    if(n==null) return null;\n    return Stream.of(n).peek(x->{\n        TreeNode t=invert(x.left);\n        x.left=invert(x.right); x.right=t;\n    }).findFirst().get();\n}`,
      },
    },
    {
      id: 235,
      title: "Flatten a binary tree to a linked list",
      problem:
        "Given the root of a binary tree, flatten it in-place into a linked list following preorder traversal.",
      examples: [
        {
          input: "root = [1,2,5,3,4,null,6]",
          output: "[1,null,2,null,3,null,4,null,5,null,6]",
        },
        { input: "root = [0]", output: "[0]" },
      ],
      tip: "Flatten in preorder (right points to next preorder node, left is null); Morris-like traversal works in O(1) space",
      iteration: {
        hint: "For each node: find rightmost node of left subtree, attach current right there, then move left to right",
        snippet: `TreeNode c=root;\nwhile(c!=null){\n    if(c.left!=null){\n        TreeNode pre=c.left;\n        while(pre.right!=null) pre=pre.right;\n        pre.right=c.right; c.right=c.left; c.left=null;\n    }\n    c=c.right;\n}`,
      },
      recursion: {
        hint: "Post-order: flatten left and right subtrees, then stitch left→right→remaining right",
        snippet: `TreeNode prev=null;\nvoid dfs(TreeNode n){\n    if(n==null) return;\n    dfs(n.right); dfs(n.left);\n    n.right=prev; n.left=null; prev=n;\n}`,
      },
      stream: {
        hint: "Collect preorder traversal, then wire each node's right pointer to the next in list",
        snippet: `List<TreeNode> pre=new ArrayList<>();\npreorder(root,pre);\nfor(int i=0;i<pre.size()-1;i++){\n    pre.get(i).left=null;\n    pre.get(i).right=pre.get(i+1);\n}`,
      },
    },
    {
      id: 236,
      title: "Sum of root-to-leaf binary numbers",
      problem:
        "Given a binary tree where each root-to-leaf path forms a binary number, return the sum of all such numbers.",
      examples: [
        { input: "root = [1,0,1,0,1,0,1]", output: "22" },
        { input: "root = [0]", output: "0" },
      ],
      tip: "Accumulate binary number by shifting left (×2) and adding current bit; leaf contributes accumulated value to sum",
      iteration: {
        hint: "DFS stack with (node, current number); on leaf add to total sum",
        snippet: `Deque<Object[]> st=new ArrayDeque<>(); st.push(new Object[]{root,0}); int total=0;\nwhile(!st.isEmpty()){\n    Object[] cur=st.pop(); TreeNode n=(TreeNode)cur[0]; int num=(int)cur[1]*2+n.val;\n    if(n.left==null&&n.right==null){total+=num; continue;}\n    if(n.right!=null)st.push(new Object[]{n.right,num});\n    if(n.left!=null)st.push(new Object[]{n.left,num});\n}\nreturn total;`,
      },
      recursion: {
        hint: "Pass accumulated value down; at leaf add to result",
        snippet: `int dfs(TreeNode n, int cur){\n    if(n==null) return 0;\n    cur=cur*2+n.val;\n    if(n.left==null&&n.right==null) return cur;\n    return dfs(n.left,cur)+dfs(n.right,cur);\n}`,
      },
      stream: {
        hint: "Stream leaf paths, convert each binary path list to decimal, sum",
        snippet: `allPaths(root).stream() // each path is List<Integer>\n    .mapToInt(p->p.stream().reduce(0,(acc,b)->acc*2+b))\n    .sum();`,
      },
    },
    {
      id: 237,
      title: "Count total nodes in a complete binary tree",
      problem:
        "Given the root of a complete binary tree, return the total number of nodes.",
      examples: [
        { input: "root = [1,2,3,4,5,6]", output: "6" },
        { input: "root = []", output: "0" },
      ],
      tip: "Exploit the complete tree property: if left and right heights are equal, left subtree is perfect (count = 2^h - 1 + 1); else recurse",
      iteration: {
        hint: "Binary search on the last node's index; check existence by following bits of index from root",
        snippet: `int h=height(root); if(h<0) return 0;\nint lo=1<<h, hi=(1<<(h+1))-1;\nwhile(lo<hi){\n    int mid=(lo+hi+1)/2;\n    if(exists(root,mid,h)) lo=mid; else hi=mid-1;\n}\nreturn lo;\n// exists: follow bits of idx from MSB-1 down, go left on 0, right on 1`,
      },
      recursion: {
        hint: "Compare left-most and right-most depths; if equal return 2^h - 1, else recurse",
        snippet: `int count(TreeNode n){\n    int l=leftHeight(n), r=rightHeight(n);\n    if(l==r) return (1<<l)-1;\n    return 1+count(n.left)+count(n.right);\n}`,
      },
      stream: {
        hint: "Use recursive formula streaming O(log^2 n) computations",
        snippet: `// Same logic wrapped in optional stream:\nOptional.of(n).map(x->{\n    int l=leftH(x),r=rightH(x);\n    return l==r?(1<<l)-1:1+count(x.left)+count(x.right);\n}).orElse(0);`,
      },
    },
    {
      id: 238,
      title: "Check if a binary tree is a complete binary tree",
      problem:
        "Given the root of a binary tree, return true if it satisfies the complete binary tree property.",
      examples: [
        { input: "root = [1,2,3,4,5,6]", output: "true" },
        { input: "root = [1,2,3,4,5,null,7]", output: "false" },
      ],
      tip: "BFS: once a null child is seen, every subsequent node must also be null; any non-null after null means incomplete",
      iteration: {
        hint: "BFS; after dequeuing a null, check that all remaining in queue are null",
        snippet: `Queue<TreeNode> q=new LinkedList<>(); q.offer(root);\nboolean foundNull=false;\nwhile(!q.isEmpty()){\n    TreeNode c=q.poll();\n    if(c==null){foundNull=true; continue;}\n    if(foundNull) return false;\n    q.offer(c.left); q.offer(c.right);\n}\nreturn true;`,
      },
      recursion: {
        hint: "Index each node; if any index >= total node count, tree is not complete",
        snippet: `int total=countNodes(root);\nboolean check(TreeNode n,int i){\n    if(n==null) return true;\n    if(i>=total) return false;\n    return check(n.left,2*i+1)&&check(n.right,2*i+2);\n}`,
      },
      stream: {
        hint: "BFS level into list including nulls; verify no non-null follows first null",
        snippet: `List<TreeNode> lvl=bfsWithNulls(root);\nint firstNull=IntStream.range(0,lvl.size())\n    .filter(i->lvl.get(i)==null).findFirst().orElse(lvl.size());\nreturn lvl.subList(firstNull,lvl.size()).stream().allMatch(Objects::isNull);`,
      },
    },
    {
      id: 239,
      title: "Build a tree from preorder + inorder traversal",
      problem:
        "Given preorder and inorder traversal arrays of a binary tree with unique values, rebuild and return the tree.",
      examples: [
        {
          input: "preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]",
          output: "[3,9,20,null,null,15,7]",
        },
        { input: "preorder = [-1], inorder = [-1]", output: "[-1]" },
      ],
      tip: "Preorder's first element is always the root; find it in inorder to split left and right subtrees",
      iteration: {
        hint: "Use an explicit stack tracking expected inorder position to build iteratively",
        snippet: `Map<Integer,Integer> inMap=new HashMap<>();\nfor(int i=0;i<inorder.length;i++) inMap.put(inorder[i],i);\n// Recursive is natural; iterative uses stack tracking boundary\nreturn buildRec(preorder,0,preorder.length-1,inorder,0,inorder.length-1,inMap);`,
      },
      recursion: {
        hint: "Root = preorder[preStart]; split at inorder index; recurse with adjusted bounds",
        snippet: `TreeNode build(int[] pre,int ps,int pe,int[] in,int is,int ie,Map<Integer,Integer> map){\n    if(ps>pe) return null;\n    TreeNode root=new TreeNode(pre[ps]);\n    int mid=map.get(pre[ps]), leftSize=mid-is;\n    root.left=build(pre,ps+1,ps+leftSize,in,is,mid-1,map);\n    root.right=build(pre,ps+leftSize+1,pe,in,mid+1,ie,map);\n    return root;\n}`,
      },
      stream: {
        hint: "Index the inorder array, then recursively split using the root index from map",
        snippet: `// preIdx[0] advances through preorder as recursion proceeds:\nTreeNode build(int[] pre,int[] preIdx,int is,int ie,Map<Integer,Integer> m){\n    if(is>ie) return null;\n    TreeNode n=new TreeNode(pre[preIdx[0]++]);\n    int mi=m.get(n.val);\n    n.left=build(pre,preIdx,is,mi-1,m);\n    n.right=build(pre,preIdx,mi+1,ie,m);\n    return n;\n}`,
      },
    },
    {
      id: 240,
      title: "Build a tree from inorder + postorder traversal",
      problem:
        "Given inorder and postorder traversal arrays of a binary tree with unique values, rebuild and return the tree.",
      examples: [
        {
          input: "inorder = [9,3,15,20,7], postorder = [9,15,7,20,3]",
          output: "[3,9,20,null,null,15,7]",
        },
        { input: "inorder = [-1], postorder = [-1]", output: "[-1]" },
      ],
      tip: "Postorder's last element is the root; find it in inorder to partition left and right subtrees",
      iteration: {
        hint: "Process postorder from right to left; use stack to track right-then-left building order",
        snippet: `Map<Integer,Integer> inMap=new HashMap<>();\nfor(int i=0;i<inorder.length;i++) inMap.put(inorder[i],i);\nint[] postIdx={postorder.length-1};\nreturn build(postorder,postIdx,0,inorder.length-1,inMap);`,
      },
      recursion: {
        hint: "Root = postorder[postEnd]; find in inorder; recurse right subtree first then left",
        snippet: `TreeNode build(int[] post,int[] pi,int is,int ie,Map<Integer,Integer> m){\n    if(is>ie) return null;\n    TreeNode root=new TreeNode(post[pi[0]--]);\n    int mid=m.get(root.val);\n    root.right=build(post,pi,mid+1,ie,m);\n    root.left=build(post,pi,is,mid-1,m);\n    return root;\n}`,
      },
      stream: {
        hint: "Mirror of preorder+inorder approach but consume postorder from the end rightward",
        snippet: `// Collect postorder reversed to simulate preorder-right-first\n// Then use same logic as preorder+inorder but swap left/right subtree calls`,
      },
    },
    {
      id: 241,
      title: "Maximum path sum in a binary tree (any node to any node)",
      problem:
        "Given the root of a binary tree, return the maximum path sum over any non-empty path.",
      examples: [
        { input: "root = [1,2,3]", output: "6" },
        { input: "root = [-10,9,20,null,null,15,7]", output: "42" },
      ],
      tip: "For each node, max path through it = node.val + max(0, left gain) + max(0, right gain); track global max",
      iteration: {
        hint: "Post-order iterative; compute gain bottom-up using a map, update global max at each node",
        snippet: `int[] max={Integer.MIN_VALUE};\nMap<TreeNode,Integer> gain=new HashMap<>();\n// post-order: for node n:\n// int l=Math.max(0,gain.getOrDefault(n.left,0));\n// int r=Math.max(0,gain.getOrDefault(n.right,0));\n// max[0]=Math.max(max[0],n.val+l+r);\n// gain.put(n, n.val+Math.max(l,r));`,
      },
      recursion: {
        hint: "DFS returns max single-path gain; update global max with left+right+node at each step",
        snippet: `int[] max={Integer.MIN_VALUE};\nint dfs(TreeNode n){\n    if(n==null) return 0;\n    int l=Math.max(0,dfs(n.left)), r=Math.max(0,dfs(n.right));\n    max[0]=Math.max(max[0],l+r+n.val);\n    return n.val+Math.max(l,r);\n}`,
      },
      stream: {
        hint: "Collect per-node (leftGain, rightGain, val) via post-order stream, track running max",
        snippet: `// Use same recursive logic; wrap in IntStream.of() for conciseness:\nmax[0]=Math.max(max[0],n.val\n    +Math.max(0,dfs(n.left))+Math.max(0,dfs(n.right)));\nreturn n.val+Math.max(0,Math.max(dfs(n.left),dfs(n.right)));`,
      },
    },
    {
      id: 242,
      title: "Recover a BST where two nodes are swapped",
      problem:
        "Given the root of a BST where exactly two nodes were swapped by mistake, recover the tree without changing its structure.",
      examples: [
        { input: "root = [1,3,null,null,2]", output: "[3,1,null,null,2]" },
        { input: "root = [3,1,4,null,null,2]", output: "[2,1,4,null,null,3]" },
      ],
      tip: "Inorder traversal should be sorted; find the two nodes that violate the sorted order and swap their values",
      iteration: {
        hint: "Iterative inorder; track prev, first-mismatch and second-mismatch nodes",
        snippet: `TreeNode first=null,second=null,prev=null;\nDeque<TreeNode> st=new ArrayDeque<>(); TreeNode c=root;\nwhile(c!=null||!st.isEmpty()){\n    while(c!=null){st.push(c);c=c.left;}\n    c=st.pop();\n    if(prev!=null&&prev.val>c.val){\n        if(first==null)first=prev;\n        second=c;\n    }\n    prev=c; c=c.right;\n}\nint t=first.val;first.val=second.val;second.val=t;`,
      },
      recursion: {
        hint: "Inorder DFS tracking prev; identify first (prev > cur) and second (most recent cur < prev) violations",
        snippet: `TreeNode first,second,prev;\nvoid dfs(TreeNode n){\n    if(n==null) return;\n    dfs(n.left);\n    if(prev!=null&&prev.val>n.val){\n        if(first==null)first=prev;\n        second=n;\n    }\n    prev=n; dfs(n.right);\n}`,
      },
      stream: {
        hint: "Collect inorder nodes as list; identify the two out-of-place nodes by scanning adjacent pairs",
        snippet: `List<TreeNode> inord=new ArrayList<>();\ncollectInorder(root,inord);\n// scan pairs: find first where inord[i].val>inord[i+1].val\n// swap inord[firstIdx].val and inord[lastIdx].val`,
      },
    },
    {
      id: 243,
      title: "Find all nodes at distance K from a given node",
      problem:
        "Given the root of a binary tree, a target node, and integer k, return all node values at distance k from the target.",
      examples: [
        {
          input: "root = [3,5,1,6,2,0,8,null,null,7,4], target = 5, k = 2",
          output: "[7,4,1]",
        },
        { input: "root = [1], target = 1, k = 3", output: "[]" },
      ],
      tip: "Build parent pointers with BFS, then BFS from target node treating parent links as additional edges",
      iteration: {
        hint: "BFS from target node across parent/left/right edges while tracking visited nodes",
        snippet: `Map<TreeNode,TreeNode> parent=new HashMap<>();\nbuildParents(root,null,parent); // BFS to fill parent map\nSet<TreeNode> visited=new HashSet<>();\nQueue<TreeNode> q=new LinkedList<>(); q.offer(target); visited.add(target); int dist=0;\nwhile(!q.isEmpty()&&dist<k){\n    int sz=q.size(); dist++;\n    for(int i=0;i<sz;i++){TreeNode c=q.poll();\n        for(TreeNode nb:new TreeNode[]{c.left,c.right,parent.get(c)})\n            if(nb!=null&&visited.add(nb))q.offer(nb);}}\nq.forEach(n->res.add(n.val));`,
      },
      recursion: {
        hint: "DFS from root; when target found return distance, then collect nodes at distance K upward via re-DFS",
        snippet: `int dfs(TreeNode n, TreeNode t, int k, List<Integer> res){\n    if(n==null) return -1;\n    if(n==t){collect(n,k,res);return 0;}\n    int l=dfs(n.left,t,k,res),r=dfs(n.right,t,k,res);\n    if(l!=-1){if(l+1==k)res.add(n.val);else collect(n.right,k-l-2,res);return l+1;}\n    if(r!=-1){if(r+1==k)res.add(n.val);else collect(n.left,k-r-2,res);return r+1;}\n    return -1;\n}`,
      },
      stream: {
        hint: "Build graph adjacency map from tree edges + parent edges, then BFS K steps from target",
        snippet: `Map<Integer,List<Integer>> graph=new HashMap<>();\nbuildGraph(root,null,graph);\n// BFS K levels from target.val:\nSet<Integer> vis=new HashSet<>(); Queue<Integer> q=new LinkedList<>();\nq.offer(target.val); vis.add(target.val);\nfor(int d=0;d<k;d++){int sz=q.size();\n    for(int i=0;i<sz;i++) graph.getOrDefault(q.poll(),List.of())\n        .stream().filter(vis::add).forEach(q::offer);}\nreturn new ArrayList<>(q);`,
      },
    },
    {
      id: 244,
      title: "Burn the tree problem",
      problem:
        "Given the root of a binary tree and a target node, return the time needed to burn the entire tree if fire starts at the target.",
      examples: [
        { input: "root = [1,2,3,null,null,4,5], target = 3", output: "2" },
        { input: "root = [1,2,null,3], target = 3", output: "2" },
      ],
      tip: "Same as nodes at distance K: fire spreads from start node using parent pointers; count levels until all burned",
      iteration: {
        hint: "Build parent map, BFS from fire-start node, count levels (time) until queue empties",
        snippet: `Map<TreeNode,TreeNode> parent=new HashMap<>();\nbuildParents(root,null,parent);\nSet<TreeNode> burned=new HashSet<>();\nQueue<TreeNode> q=new LinkedList<>(); q.offer(start); burned.add(start); int time=0;\nwhile(!q.isEmpty()){\n    int sz=q.size(); boolean spread=false;\n    for(int i=0;i<sz;i++){TreeNode c=q.poll();\n        for(TreeNode nb:new TreeNode[]{c.left,c.right,parent.get(c)})\n            if(nb!=null&&burned.add(nb)){q.offer(nb);spread=true;}}\n    if(spread) time++;}\nreturn time;`,
      },
      recursion: {
        hint: "DFS to find start node; return depth from root; simultaneously collect burn times using parent traversal",
        snippet: `int[] ans={0};\nint dfs(TreeNode n, TreeNode start){\n    if(n==null) return -1;\n    int l=dfs(n.left,start),r=dfs(n.right,start);\n    int dist; if(n==start) dist=0;\n    else if(l>=0) dist=l+1; else if(r>=0) dist=r+1; else return -1;\n    // ans = max of dist + depth of opposite subtree\n    int opp=(n==start)?0:(l>=0?Math.max(0,r+1):Math.max(0,l+1));\n    ans[0]=Math.max(ans[0],dist+opp); return dist;\n}`,
      },
      stream: {
        hint: "Convert tree to undirected graph adjacency list, BFS from start tracking time with visited set",
        snippet: `// Convert tree → graph (same as Q243), then:\nint time=0; Queue<Integer> q=new LinkedList<>(); Set<Integer> vis=new HashSet<>();\nq.offer(startVal); vis.add(startVal);\nwhile(!q.isEmpty()){time++;\n    int sz=q.size();\n    for(int i=0;i<sz;i++) graph.get(q.poll()).stream().filter(vis::add).forEach(q::offer);}\nreturn time-1;`,
      },
    },
    {
      id: 245,
      title: "Print all nodes at a given level",
      problem:
        "Given the root of a binary tree and level k, return all node values at that level, with the root at level 0.",
      examples: [
        { input: "root = [1,2,3,4,5], k = 2", output: "[4,5]" },
        { input: "root = [1], k = 1", output: "[]" },
      ],
      tip: "Level-order BFS: process exactly the nodes in the queue at the start of each level iteration",
      iteration: {
        hint: "BFS; decrement level counter and collect when level reaches target",
        snippet: `Queue<TreeNode> q=new LinkedList<>(); q.offer(root); int cur=0;\nwhile(!q.isEmpty()){\n    int sz=q.size();\n    if(cur==level){q.forEach(n->res.add(n.val)); return;}\n    for(int i=0;i<sz;i++){TreeNode c=q.poll();\n        if(c.left!=null)q.offer(c.left);\n        if(c.right!=null)q.offer(c.right);}\n    cur++;\n}`,
      },
      recursion: {
        hint: "DFS with depth parameter; add node value when depth matches target level",
        snippet: `void dfs(TreeNode n, int d, int target, List<Integer> res){\n    if(n==null) return;\n    if(d==target){res.add(n.val); return;}\n    dfs(n.left,d+1,target,res);\n    dfs(n.right,d+1,target,res);\n}`,
      },
      stream: {
        hint: "Stream level-order groups and get the one at the target index",
        snippet: `levelOrder(root).stream() // List<List<Integer>>\n    .skip(level).findFirst()\n    .orElse(Collections.emptyList());`,
      },
    },
    {
      id: 246,
      title: "Print all ancestors of a given node",
      problem:
        "Given the root of a binary tree and a target value, return all ancestors of the target from parent up to root.",
      examples: [
        { input: "root = [1,2,3,4,5], target = 5", output: "[2,1]" },
        { input: "root = [1,2,3], target = 1", output: "[]" },
      ],
      tip: "DFS returning boolean whether target was found in subtree; add current node to ancestors list on the way back if target found",
      iteration: {
        hint: "Iterative DFS with path stack; when target is found, print all nodes in current stack",
        snippet: `Deque<TreeNode> st=new ArrayDeque<>();\nSet<TreeNode> visited=new HashSet<>();\nst.push(root);\nwhile(!st.isEmpty()){\n    TreeNode c=st.peek();\n    if(c==target){st.forEach(n->res.add(n.val)); return;}\n    if((c.left!=null&&!visited.contains(c.left)))  {st.push(c.left);continue;}\n    if((c.right!=null&&!visited.contains(c.right))){st.push(c.right);continue;}\n    visited.add(st.pop());\n}`,
      },
      recursion: {
        hint: "Return true if target found in subtree; append current node to ancestors before returning true",
        snippet: `boolean ancestors(TreeNode n, int target, List<Integer> res){\n    if(n==null) return false;\n    if(n.val==target) return true;\n    if(ancestors(n.left,target,res)||ancestors(n.right,target,res)){\n        res.add(n.val); return true;\n    }\n    return false;\n}`,
      },
      stream: {
        hint: "DFS path collection returning Optional path list; stream filter for non-empty result",
        snippet: `Optional<List<Integer>> findPath(TreeNode n, int t){\n    if(n==null) return Optional.empty();\n    if(n.val==t) return Optional.of(new ArrayList<>());\n    return Stream.of(findPath(n.left,t),findPath(n.right,t))\n        .filter(Optional::isPresent).findFirst()\n        .map(p->{p.get().add(n.val);return p.get();});\n}`,
      },
    },
    {
      id: 247,
      title: "Check the children-sum property",
      problem:
        "Given the root of a binary tree, return true if every non-leaf node equals the sum of its existing children.",
      examples: [
        { input: "root = [10,8,2,3,5,null,2]", output: "true" },
        { input: "root = [1,2,3]", output: "false" },
      ],
      tip: "Every non-leaf node's value must equal the sum of its children's values; verify recursively",
      iteration: {
        hint: "Post-order iterative; check each internal node against sum of children values stored in a map",
        snippet: `Deque<TreeNode> st=new ArrayDeque<>();\nMap<TreeNode,Integer> sumMap=new HashMap<>();\n// post-order: sumMap.put(n, n.val)\n// for internal node: check n.val == sumMap.getOrDefault(n.left,0)+sumMap.getOrDefault(n.right,0)\n// update sumMap.put(parent, parent.val) - or carry signal up`,
      },
      recursion: {
        hint: "Recursively check current node then both subtrees; return false if any violation found",
        snippet: `boolean check(TreeNode n){\n    if(n==null||n.left==null&&n.right==null) return true;\n    int sum=(n.left!=null?n.left.val:0)+(n.right!=null?n.right.val:0);\n    return n.val==sum&&check(n.left)&&check(n.right);\n}`,
      },
      stream: {
        hint: "Stream children; sum values and compare with current node's value",
        snippet: `boolean check(TreeNode n){\n    if(n==null||n.left==null&&n.right==null) return true;\n    int sum=Stream.of(n.left,n.right).filter(Objects::nonNull)\n        .mapToInt(c->c.val).sum();\n    return n.val==sum&&check(n.left)&&check(n.right);\n}`,
      },
    },
    {
      id: 248,
      title: "Convert a BST to a sorted doubly linked list",
      problem:
        "Given the root of a BST, convert it to a sorted doubly linked list in-place and return the head.",
      examples: [
        { input: "root = [4,2,5,1,3]", output: "1 <-> 2 <-> 3 <-> 4 <-> 5" },
        { input: "root = [2,1,3]", output: "1 <-> 2 <-> 3" },
      ],
      tip: "Inorder traversal visits BST nodes in sorted order; link each visited node to the previous node in-place",
      iteration: {
        hint: "Iterative inorder; maintain prev pointer, link prev.right = cur and cur.left = prev",
        snippet: `TreeNode head=null,prev=null;\nDeque<TreeNode> st=new ArrayDeque<>(); TreeNode c=root;\nwhile(c!=null||!st.isEmpty()){\n    while(c!=null){st.push(c);c=c.left;}\n    c=st.pop();\n    if(prev==null) head=c; else {prev.right=c;c.left=prev;}\n    prev=c; c=c.right;\n}\n// link head and prev (tail) for circular DLL`,
      },
      recursion: {
        hint: "Inorder DFS; on each visit stitch current node between prev and itself",
        snippet: `TreeNode head=null,prev=null;\nvoid convert(TreeNode n){\n    if(n==null) return;\n    convert(n.left);\n    if(prev==null) head=n; else{prev.right=n;n.left=prev;}\n    prev=n;\n    convert(n.right);\n}`,
      },
      stream: {
        hint: "Collect inorder list then wire right and left pointers sequentially",
        snippet: `List<TreeNode> nodes=new ArrayList<>();\ninorder(root,nodes);\nIntStream.range(0,nodes.size()-1).forEach(i->{\n    nodes.get(i).right=nodes.get(i+1);\n    nodes.get(i+1).left=nodes.get(i);\n});`,
      },
    },
    {
      id: 249,
      title: "Return all root-to-leaf paths as strings",
      problem:
        "Given the root of a binary tree, return all root-to-leaf paths formatted as strings joined by arrows.",
      examples: [
        { input: "root = [1,2,3,null,5]", output: '["1->2->5","1->3"]' },
        { input: "root = [1]", output: '["1"]' },
      ],
      tip: "DFS with running path string; append '->' and node value at each node, record on reaching a leaf",
      iteration: {
        hint: "DFS stack with (node, path string); on leaf add path to result",
        snippet: `Deque<Object[]> st=new ArrayDeque<>();\nst.push(new Object[]{root,String.valueOf(root.val)});\nwhile(!st.isEmpty()){\n    Object[] cur=st.pop(); TreeNode n=(TreeNode)cur[0]; String path=(String)cur[1];\n    if(n.left==null&&n.right==null){res.add(path);continue;}\n    if(n.right!=null)st.push(new Object[]{n.right,path+"->"+n.right.val});\n    if(n.left!=null)st.push(new Object[]{n.left,path+"->"+n.left.val});\n}`,
      },
      recursion: {
        hint: "Carry path string down; add to result at leaf",
        snippet: `void dfs(TreeNode n, String path, List<String> res){\n    if(n==null) return;\n    path+=(path.isEmpty()?"":"->")+n.val;\n    if(n.left==null&&n.right==null){res.add(path);return;}\n    dfs(n.left,path,res); dfs(n.right,path,res);\n}`,
      },
      stream: {
        hint: "Stream paths as lists, then map each list to joined string with '->'",
        snippet: `allPaths(root).stream() // List<List<Integer>>\n    .map(p->p.stream().map(String::valueOf)\n        .collect(Collectors.joining("->")))\n    .collect(Collectors.toList());`,
      },
    },
    {
      id: 250,
      title: "House robber III (max sum of non-adjacent nodes in a tree)",
      problem:
        "Given the root of a binary tree, return the maximum money that can be robbed without robbing directly-linked parent and child nodes.",
      examples: [
        { input: "root = [3,2,3,null,3,null,1]", output: "7" },
        { input: "root = [3,4,5,1,3,null,1]", output: "9" },
      ],
      tip: "At each node choose rob (node.val + grandchildren sums) or skip (children sums); return both options as a pair",
      iteration: {
        hint: "Post-order iterative; store {rob, skip} pair per node in a map",
        snippet: `Map<TreeNode,int[]> dp=new HashMap<>();\n// post-order traversal:\n// int[] l=dp.getOrDefault(n.left,new int[2]);\n// int[] r=dp.getOrDefault(n.right,new int[2]);\n// dp.put(n, new int[]{\n//   n.val+l[1]+r[1],          // rob this node\n//   Math.max(l[0],l[1])+Math.max(r[0],r[1]) // skip\n// });`,
      },
      recursion: {
        hint: "Return int[]{rob, skip} from each subtree; choose max at root",
        snippet: `int[] dfs(TreeNode n){\n    if(n==null) return new int[2];\n    int[] l=dfs(n.left), r=dfs(n.right);\n    int rob=n.val+l[1]+r[1];\n    int skip=Math.max(l[0],l[1])+Math.max(r[0],r[1]);\n    return new int[]{rob,skip};\n}`,
      },
      stream: {
        hint: "Combine child result pairs via stream; select max of rob/skip at each level",
        snippet: `// Stream children results, reduce to parent pair:\nint[] res=Stream.of(n.left,n.right)\n    .map(c->c==null?new int[2]:dfs(c))\n    .reduce(new int[]{n.val,0},(acc,c)->new int[]{\n        acc[0]+c[1], acc[1]+Math.max(c[0],c[1])});\nreturn res;`,
      },
    },
    {
      id: 251,
      title: "Implement Trie insert/search",
      problem:
        "Design a Trie that supports inserting words, exact word search, and prefix search.",
      examples: [
        {
          input: 'insert("apple"), search("apple"), startsWith("app")',
          output: "true, true",
        },
        {
          input: 'insert("apple"), search("app"), startsWith("app")',
          output: "false, true",
        },
      ],
      tip: "Each TrieNode has children[26] and isEnd flag; insert creates nodes along path, search traverses without creating",
      iteration: {
        hint: "Loop through each character; create child if absent; mark isEnd on last char",
        snippet: `// Insert:\nTrieNode cur=root;\nfor(char c:word.toCharArray()){\n    int i=c-'a';\n    if(cur.children[i]==null) cur.children[i]=new TrieNode();\n    cur=cur.children[i];\n}\ncur.isEnd=true;\n// Search: same loop without creation; return cur.isEnd`,
      },
      recursion: {
        hint: "Recursively insert/search one character at a time, passing remaining suffix",
        snippet: `void insert(TrieNode n, String w, int i){\n    if(i==w.length()){n.isEnd=true;return;}\n    int c=w.charAt(i)-'a';\n    if(n.children[c]==null) n.children[c]=new TrieNode();\n    insert(n.children[c],w,i+1);\n}`,
      },
      stream: {
        hint: "Use chars() stream to reduce over the root node, creating children along the way",
        snippet: `TrieNode cur=word.chars().mapToObj(c->c-'a')\n    .reduce(root,(node,i)->{\n        if(node.children[i]==null) node.children[i]=new TrieNode();\n        return node.children[i];\n    },(a,b)->b);\ncur.isEnd=true;`,
      },
    },
    {
      id: 252,
      title: "Design a word dictionary supporting wildcard search",
      problem:
        "Design a word dictionary that supports adding words and searching where dot matches any single character.",
      examples: [
        {
          input: 'addWord("bad"), addWord("dad"), search(".ad")',
          output: "true",
        },
        {
          input: 'addWord("bad"), search("b.."), search("pad")',
          output: "true, false",
        },
      ],
      tip: "Store words in a Trie; '.' in search matches any child, requiring DFS branching over all children",
      iteration: {
        hint: "Iterative DFS with a stack of (TrieNode, charIndex) pairs; branch for '.' across all children",
        snippet: `Deque<Object[]> st=new ArrayDeque<>();\nst.push(new Object[]{root,0});\nwhile(!st.isEmpty()){\n    Object[] cur=st.pop(); TrieNode n=(TrieNode)cur[0]; int i=(int)cur[1];\n    if(i==word.length()){if(n.isEnd)return true;continue;}\n    char c=word.charAt(i);\n    if(c=='.')  Arrays.stream(n.children).filter(Objects::nonNull).forEach(ch->st.push(new Object[]{ch,i+1}));\n    else if(n.children[c-'a']!=null) st.push(new Object[]{n.children[c-'a'],i+1});\n}\nreturn false;`,
      },
      recursion: {
        hint: "Recursively match each character; for '.' recurse into every non-null child",
        snippet: `boolean search(TrieNode n, String w, int i){\n    if(i==w.length()) return n.isEnd;\n    char c=w.charAt(i);\n    if(c!='.') return n.children[c-'a']!=null&&search(n.children[c-'a'],w,i+1);\n    return Arrays.stream(n.children).filter(Objects::nonNull)\n        .anyMatch(ch->search(ch,w,i+1));\n}`,
      },
      stream: {
        hint: "Stream characters; branch into all children on '.', filter using anyMatch",
        snippet: `// Same recursive approach using Stream.anyMatch for dot branching:\nreturn Arrays.stream(node.children)\n    .filter(Objects::nonNull)\n    .anyMatch(ch->search(ch,word,idx+1));`,
      },
    },
    {
      id: 253,
      title: "Design an autocomplete system using a Trie",
      problem:
        "Design an autocomplete system that returns the top suggestions for the current prefix after each typed character.",
      examples: [
        {
          input: 'sentences = ["i love you","island","iroman"], input = "i"',
          output: '["i love you","island","iroman"]',
        },
        {
          input: 'sentences = ["abc","abbc","a"], input = "ab"',
          output: '["abbc","abc"]',
        },
      ],
      tip: "Navigate to the prefix node in the Trie, then DFS/BFS collect all words under that node sorted by frequency",
      iteration: {
        hint: "Traverse to prefix node iteratively, then BFS from there collecting all words at isEnd nodes",
        snippet: `TrieNode cur=root;\nfor(char c:prefix.toCharArray()){\n    if(cur.children[c-'a']==null) return new ArrayList<>();\n    cur=cur.children[c-'a'];\n}\n// BFS from cur: collect words up to top-3 by frequency\nPriorityQueue<String> pq=new PriorityQueue<>(...); // by frequency\ncollectWords(cur,prefix,pq); return topK(pq,3);`,
      },
      recursion: {
        hint: "DFS from prefix endpoint; accumulate word path and collect at each isEnd node",
        snippet: `void collect(TrieNode n, StringBuilder path, PriorityQueue<String> pq){\n    if(n.isEnd) pq.offer(path.toString());\n    for(int i=0;i<26;i++) if(n.children[i]!=null){\n        path.append((char)('a'+i));\n        collect(n.children[i],path,pq);\n        path.deleteCharAt(path.length()-1);\n    }\n}`,
      },
      stream: {
        hint: "DFS collect all suffixes under prefix node; sort by frequency; return top-K via stream limit",
        snippet: `List<String> words=new ArrayList<>();\ncollect(prefixNode,new StringBuilder(prefix),words);\nreturn words.stream()\n    .sorted(Comparator.comparingInt((String w)->-freq.getOrDefault(w,0)))\n    .limit(3).collect(Collectors.toList());`,
      },
    },
    {
      id: 254,
      title: "Replace words with their shortest root word using a Trie",
      problem:
        "Given a dictionary of root words and a sentence, replace each word with the shortest root that is its prefix.",
      examples: [
        {
          input:
            'dict = ["cat","bat","rat"], sentence = "the cattle was rattled"',
          output: '"the cat was rat"',
        },
        {
          input: 'dict = ["a","aa","aaa"], sentence = "a aa aaaa"',
          output: '"a a a"',
        },
      ],
      tip: "Build a Trie of all roots; for each word in sentence, walk Trie and return earliest root found",
      iteration: {
        hint: "Insert all roots into Trie; for each sentence word traverse Trie char by char until isEnd (root found)",
        snippet: `// Build Trie with roots\nString replace(String word){\n    TrieNode cur=root;\n    for(int i=0;i<word.length();i++){\n        int c=word.charAt(i)-'a';\n        if(cur.children[c]==null) return word;\n        cur=cur.children[c];\n        if(cur.isEnd) return word.substring(0,i+1);\n    }\n    return word;\n}`,
      },
      recursion: {
        hint: "Recurse through Trie and word simultaneously; return prefix on first isEnd match",
        snippet: `String replace(TrieNode n, String w, int i){\n    if(n.isEnd||i==w.length()) return w.substring(0,i);\n    int c=w.charAt(i)-'a';\n    if(n.children[c]==null) return w;\n    return replace(n.children[c],w,i+1);\n}`,
      },
      stream: {
        hint: "Stream sentence words and map each through the replace function",
        snippet: `Arrays.stream(sentence.split(" "))\n    .map(this::replaceWord) // uses Trie\n    .collect(Collectors.joining(" "));`,
      },
    },
    {
      id: 255,
      title: "Find the longest common prefix using a Trie",
      problem:
        "Given an array of strings, return the longest common prefix using a Trie.",
      examples: [
        { input: 'words = ["flower","flow","flight"]', output: '"fl"' },
        { input: 'words = ["dog","racecar","car"]', output: '""' },
      ],
      tip: "Insert all words into a Trie; walk from root while each node has exactly one child and is not an end",
      iteration: {
        hint: "After building Trie, traverse root downward while node has single child and is not a word end",
        snippet: `// Insert all words into Trie\nStringBuilder sb=new StringBuilder();\nTrieNode cur=root;\nwhile(true){\n    long count=Arrays.stream(cur.children).filter(Objects::nonNull).count();\n    if(count!=1||cur.isEnd) break;\n    int i=IntStream.range(0,26).filter(x->cur.children[x]!=null).findFirst().getAsInt();\n    sb.append((char)('a'+i)); cur=cur.children[i];\n}\nreturn sb.toString();`,
      },
      recursion: {
        hint: "Find shortest word as upper bound, then binary-search prefix length checking Trie path",
        snippet: `// Or simply: LCP = common characters of all words character by character:\nString lcp=words[0];\nfor(String w:words) while(!w.startsWith(lcp)) lcp=lcp.substring(0,lcp.length()-1);\nreturn lcp;`,
      },
      stream: {
        hint: "Stream all words reducing by computing pairwise LCP using string startsWith",
        snippet: `return Arrays.stream(words)\n    .reduce(words[0],(lcp,w)->{\n        while(!w.startsWith(lcp)) lcp=lcp.substring(0,lcp.length()-1);\n        return lcp;\n    });`,
      },
    },
    {
      id: 256,
      title: "Count substrings/words with a given prefix using a Trie",
      problem:
        "Given a set of words and a prefix, count how many inserted words start with that prefix.",
      examples: [
        { input: 'words = ["apple","app","ape"], prefix = "ap"', output: "3" },
        { input: 'words = ["dog","deer","deal"], prefix = "de"', output: "2" },
      ],
      tip: "Store a count in each TrieNode incremented during insert; navigate to prefix node and return its count",
      iteration: {
        hint: "Augment Trie insert to increment prefixCount at every node; query by walking to prefix end",
        snippet: `// Insert: at each node cur.prefixCount++;\nint countPrefix(String prefix){\n    TrieNode cur=root;\n    for(char c:prefix.toCharArray()){\n        int i=c-'a';\n        if(cur.children[i]==null) return 0;\n        cur=cur.children[i];\n    }\n    return cur.prefixCount;\n}`,
      },
      recursion: {
        hint: "Recursively insert while updating count; recursively search prefix path and return count at endpoint",
        snippet: `void insert(TrieNode n, String w, int i){\n    n.count++;\n    if(i==w.length()) return;\n    int c=w.charAt(i)-'a';\n    if(n.children[c]==null) n.children[c]=new TrieNode();\n    insert(n.children[c],w,i+1);\n}`,
      },
      stream: {
        hint: "Stream all inserted words and count those starting with the given prefix",
        snippet: `wordList.stream()\n    .filter(w->w.startsWith(prefix))\n    .count();`,
      },
    },
    {
      id: 257,
      title: "Design Map Sum Pairs (Trie-based prefix sum)",
      problem:
        "Design a MapSum structure that stores string keys with integer values and returns the sum of values for keys with a given prefix.",
      examples: [
        { input: 'insert("apple",3), sum("ap")', output: "3" },
        { input: 'insert("apple",3), insert("app",2), sum("ap")', output: "5" },
      ],
      tip: "Each TrieNode stores a contribution value; when inserting key with val, store val at the end node and update prefix sums along the path",
      iteration: {
        hint: "On insert walk Trie, store old val at end, update each node's sum by (val - oldVal)",
        snippet: `Map<String,Integer> keyMap=new HashMap<>();\nvoid insert(String key, int val){\n    int delta=val-keyMap.getOrDefault(key,0);\n    keyMap.put(key,val);\n    TrieNode cur=root;\n    for(char c:key.toCharArray()){\n        int i=c-'a';\n        if(cur.children[i]==null) cur.children[i]=new TrieNode();\n        cur=cur.children[i]; cur.sum+=delta;\n    }\n}`,
      },
      recursion: {
        hint: "Insert recursively updating sum at each node; sum query walks to prefix node and returns its sum",
        snippet: `int sum(String prefix){\n    TrieNode cur=root;\n    for(char c:prefix.toCharArray()){\n        int i=c-'a';\n        if(cur.children[i]==null) return 0;\n        cur=cur.children[i];\n    }\n    return cur.sum;\n}`,
      },
      stream: {
        hint: "Stream all entries in keyMap; filter by prefix and sum matching values",
        snippet: `int sum(String prefix){\n    return keyMap.entrySet().stream()\n        .filter(e->e.getKey().startsWith(prefix))\n        .mapToInt(Map.Entry::getValue).sum();\n}`,
      },
    },
    {
      id: 258,
      title: "Word search II (multiple words in a grid, using a Trie)",
      problem:
        "Given a character board and a list of words, return all words that can be formed by adjacent cells using a Trie.",
      examples: [
        {
          input: 'board = [["o","a"],["e","t"]], words = ["oat","eat","tea"]',
          output: '["oat","eat"]',
        },
        {
          input: 'board = [["a","b"],["c","d"]], words = ["abcb"]',
          output: "[]",
        },
      ],
      tip: "Build a Trie of all words; DFS from each cell matching Trie children; prune when Trie node is null",
      iteration: {
        hint: "DFS from every cell using Trie traversal; backtrack by restoring cell, prune dead Trie branches",
        snippet: `// Build Trie, then:\nvoid dfs(char[][] b,int r,int c,TrieNode n,List<String> res){\n    if(r<0||r>=b.length||c<0||c>=b[0].length) return;\n    char ch=b[r][c]; if(ch=='#'||n.children[ch-'a']==null) return;\n    TrieNode next=n.children[ch-'a'];\n    if(next.word!=null){res.add(next.word);next.word=null;}\n    b[r][c]='#';\n    dfs(b,r+1,c,next,res);dfs(b,r-1,c,next,res);\n    dfs(b,r,c+1,next,res);dfs(b,r,c-1,next,res);\n    b[r][c]=ch;\n}`,
      },
      recursion: {
        hint: "Recursive DFS with backtracking; mark visited in-place with '#'; collect word on Trie isEnd",
        snippet: `for(int i=0;i<board.length;i++)\n    for(int j=0;j<board[0].length;j++)\n        dfs(board,i,j,root,res);\n// dfs: check bounds, match trie child, mark '#', recurse 4-dir, restore cell`,
      },
      stream: {
        hint: "Stream over all grid positions; for each position launch DFS; collect distinct found words",
        snippet: `IntStream.range(0,board.length).boxed()\n    .flatMap(i->IntStream.range(0,board[0].length)\n        .mapToObj(j->dfsCollect(board,i,j,root)))\n    .flatMap(List::stream).distinct()\n    .collect(Collectors.toList());`,
      },
    },
    {
      id: 259,
      title: "Implement Trie deletion",
      problem:
        "Implement deletion in a Trie so removed words are no longer found while shared prefixes remain available.",
      examples: [
        {
          input:
            'insert("app"), insert("apple"), delete("app"), search("apple")',
          output: "true",
        },
        {
          input: 'insert("car"), delete("car"), search("car")',
          output: "false",
        },
      ],
      tip: "Delete by recursing to the end node, unsetting isEnd, then removing child nodes bottom-up if they have no other children",
      iteration: {
        hint: "Walk to leaf, unset isEnd; backtrack removing nodes that have no remaining children and are not word ends",
        snippet: `// Iterative: collect path of (node, childIndex) while inserting path stack\n// After reaching end, walk stack back removing empty branches:\nArrayDeque<TrieNode[]> stack=new ArrayDeque<>(); // [parent, child index]\n// ... then: if(child has no children && !child.isEnd) parent.children[idx]=null;`,
      },
      recursion: {
        hint: "Recurse to delete deeper; return true if current node can be deleted (no children, not end)",
        snippet: `boolean delete(TrieNode n, String w, int i){\n    if(i==w.length()){if(!n.isEnd)return false; n.isEnd=false;\n        return Arrays.stream(n.children).allMatch(Objects::isNull);}\n    int c=w.charAt(i)-'a';\n    if(n.children[c]==null) return false;\n    boolean canDel=delete(n.children[c],w,i+1);\n    if(canDel){n.children[c]=null;\n        return !n.isEnd&&Arrays.stream(n.children).allMatch(Objects::isNull);}\n    return false;\n}`,
      },
      stream: {
        hint: "Collect the path nodes while searching; stream path in reverse to prune empty branches",
        snippet: `// After finding and unsetting isEnd, stream path nodes in reverse:\npathNodes.stream().sorted(Collections.reverseOrder())\n    .takeWhile(n->!n.isEnd&&Arrays.stream(n.children).allMatch(Objects::isNull))\n    .forEach(n->{/* remove from parent */});`,
      },
    },
    {
      id: 260,
      title: "Solve prefix-matching using a compressed Trie (radix tree)",
      problem:
        "Given a compressed Trie of stored words, return all words matching a prefix efficiently.",
      examples: [
        {
          input: 'words = ["bear","bell","bid"], prefix = "be"',
          output: '["bear","bell"]',
        },
        {
          input: 'words = ["romane","romanus","rubens"], prefix = "rom"',
          output: '["romane","romanus"]',
        },
      ],
      tip: "Edges store substrings, not single characters; compress chains of single-child nodes into one edge",
      iteration: {
        hint: "Iteratively find longest common prefix between remaining string and edge labels; split or extend",
        snippet: `// RadixNode stores label String and children Map<Character,RadixNode>\nvoid insert(RadixNode n, String s){\n    for(Map.Entry<Character,RadixNode> e:n.children.entrySet()){\n        String lbl=e.getValue().label;\n        int common=commonPrefixLen(s,lbl);\n        if(common>0){ /* split or extend */ return; }\n    }\n    n.children.put(s.charAt(0),new RadixNode(s,true));\n}`,
      },
      recursion: {
        hint: "Recurse on the child whose label shares a prefix; split node if partial match",
        snippet: `void insert(RadixNode n, String s){\n    if(s.isEmpty()){n.isEnd=true;return;}\n    char first=s.charAt(0);\n    RadixNode child=n.children.get(first);\n    if(child==null){n.children.put(first,new RadixNode(s,true));return;}\n    int cp=commonPrefixLen(s,child.label);\n    if(cp==child.label.length()) insert(child,s.substring(cp));\n    else splitAndInsert(n,child,s,cp);\n}`,
      },
      stream: {
        hint: "Traverse matching edges by streaming children and finding longest matching label prefix",
        snippet: `boolean search(RadixNode n, String s){\n    if(s.isEmpty()) return n.isEnd;\n    return n.children.values().stream()\n        .filter(c->s.startsWith(c.label))\n        .findFirst().map(c->search(c,s.substring(c.label.length())))\n        .orElse(false);\n}`,
      },
    },
    {
      id: 261,
      title: "Check if two binary trees are identical",
      problem:
        "Given the roots of two binary trees, return true if they have identical structure and node values.",
      examples: [
        { input: "p = [1,2,3], q = [1,2,3]", output: "true" },
        { input: "p = [1,2], q = [1,null,2]", output: "false" },
      ],
      tip: "Two trees are identical if their roots are equal and both left and right subtrees are also identical",
      iteration: {
        hint: "Paired BFS/DFS with two queues/stacks; compare corresponding nodes simultaneously",
        snippet: `Deque<TreeNode> s1=new ArrayDeque<>(),s2=new ArrayDeque<>();\ns1.push(p); s2.push(q);\nwhile(!s1.isEmpty()){\n    TreeNode a=s1.pop(),b=s2.pop();\n    if(a==null&&b==null) continue;\n    if(a==null||b==null||a.val!=b.val) return false;\n    s1.push(a.left);s2.push(b.left);\n    s1.push(a.right);s2.push(b.right);\n}\nreturn true;`,
      },
      recursion: {
        hint: "Base cases: both null = true, one null = false, values differ = false; then recurse both sides",
        snippet: `boolean same(TreeNode p, TreeNode q){\n    if(p==null&&q==null) return true;\n    if(p==null||q==null||p.val!=q.val) return false;\n    return same(p.left,q.left)&&same(p.right,q.right);\n}`,
      },
      stream: {
        hint: "Zip preorder streams of both trees and verify all corresponding values match",
        snippet: `List<Integer> pre1=new ArrayList<>(), pre2=new ArrayList<>();\npreorderWithNull(p,pre1); preorderWithNull(q,pre2);\nreturn pre1.equals(pre2);`,
      },
    },
    {
      id: 262,
      title: "Find the maximum width of a binary tree",
      problem:
        "Given the root of a binary tree, return the maximum width across all levels, counting null positions between end nodes.",
      examples: [
        { input: "root = [1,3,2,5,3,null,9]", output: "4" },
        { input: "root = [1,3,2,5]", output: "2" },
      ],
      tip: "Assign index positions (left child = 2i, right child = 2i+1) during BFS; width = lastIndex - firstIndex + 1 per level",
      iteration: {
        hint: "BFS with (node, index) pairs; normalize indices each level to prevent overflow",
        snippet: `Queue<long[]> q=new LinkedList<>(); // [nodeId, index]\nMap<Long,TreeNode> map=new HashMap<>();\nq.offer(new long[]{0,1}); map.put(0L,root);\nint maxW=0;\nwhile(!q.isEmpty()){\n    int sz=q.size(); long first=0,last=0;\n    for(int i=0;i<sz;i++){long[] cur=q.poll(); TreeNode n=map.get(cur[0]); long idx=cur[1];\n        if(i==0)first=idx; last=idx;\n        if(n.left!=null){map.put(cur[0]*2,n.left);q.offer(new long[]{cur[0]*2,idx*2});}\n        if(n.right!=null){map.put(cur[0]*2+1,n.right);q.offer(new long[]{cur[0]*2+1,idx*2+1});}}\n    maxW=(int)Math.max(maxW,last-first+1);}\nreturn maxW;`,
      },
      recursion: {
        hint: "DFS with depth and index; track min index per level to normalize; update max width",
        snippet: `int[] ans={0}; Map<Integer,Long> leftmost=new HashMap<>();\nvoid dfs(TreeNode n,int d,long idx){\n    if(n==null) return;\n    leftmost.putIfAbsent(d,idx);\n    ans[0]=(int)Math.max(ans[0],idx-leftmost.get(d)+1);\n    dfs(n.left,d+1,2*idx); dfs(n.right,d+1,2*idx+1);\n}`,
      },
      stream: {
        hint: "Collect (level, index) pairs via DFS; group by level, compute max span per level",
        snippet: `Map<Integer,LongSummaryStatistics> stats=new HashMap<>();\ndfs(root,0,1L,stats);\nreturn stats.values().stream()\n    .mapToLong(s->s.getMax()-s.getMin()+1).max().getAsLong();`,
      },
    },
    {
      id: 263,
      title: "Convert a binary tree to its sum tree",
      problem:
        "Given the root of a binary tree, convert it to a sum tree where each node stores the sum of values in its original left and right subtrees.",
      examples: [
        { input: "root = [10,-2,6,8,-4,7,5]", output: "[20,4,12,0,0,0,0]" },
        { input: "root = [1,2,3]", output: "[5,0,0]" },
      ],
      tip: "Replace each node's value with the sum of all values in its subtree; use post-order to get children sums first",
      iteration: {
        hint: "Post-order iterative; store original values, compute subtree sums bottom-up",
        snippet: `Map<TreeNode,Integer> sumMap=new HashMap<>();\n// post-order traversal:\n// int l=sumMap.getOrDefault(n.left,0);\n// int r=sumMap.getOrDefault(n.right,0);\n// sumMap.put(n,n.val+l+r);\n// n.val=sumMap.get(n);  // or n.val = l + r + originalVal`,
      },
      recursion: {
        hint: "Post-order: recurse children, update current node to sum of original + children sums",
        snippet: `int toSumTree(TreeNode n){\n    if(n==null) return 0;\n    int old=n.val;\n    n.val=toSumTree(n.left)+toSumTree(n.right);\n    return n.val+old;\n}`,
      },
      stream: {
        hint: "Post-order stream collecting subtree sums; update each node on the way back",
        snippet: `// Post-order collect, then update values:\nList<TreeNode> postOrd=new ArrayList<>();\npostOrder(root,postOrd);\npostOrd.forEach(n->n.val+=\n    (n.left!=null?n.left.val:0)+(n.right!=null?n.right.val:0));`,
      },
    },
    {
      id: 264,
      title: "Find all duplicate subtrees in a binary tree",
      problem:
        "Given the root of a binary tree, return one root node for each duplicate subtree structure and value combination.",
      examples: [
        { input: "root = [1,2,3,4,null,2,4,null,null,4]", output: "[2,4]" },
        { input: "root = [2,1,1]", output: "[1]" },
      ],
      tip: "Serialize each subtree's structure; use a frequency map to find serializations seen more than once",
      iteration: {
        hint: "Post-order iterative serialization; record in frequency map and collect duplicates when count hits 2",
        snippet: `Map<String,Integer> freq=new HashMap<>();\nList<TreeNode> res=new ArrayList<>();\n// post-order: for each node n:\n// String key=serialize(n); // recursive or stored in map\n// freq.merge(key,1,Integer::sum);\n// if(freq.get(key)==2) res.add(n);`,
      },
      recursion: {
        hint: "Post-order DFS serializing each subtree; insert serialization into map and collect when count == 2",
        snippet: `Map<String,Integer> map=new HashMap<>();\nString dfs(TreeNode n){\n    if(n==null) return "#";\n    String key=n.val+","+dfs(n.left)+","+dfs(n.right);\n    if(map.merge(key,1,Integer::sum)==2) res.add(n);\n    return key;\n}`,
      },
      stream: {
        hint: "Collect all subtree serializations; group by string; filter groups with count >= 2",
        snippet: `List<String> serials=new ArrayList<>();\ncollectSerials(root,serials);\nserials.stream().collect(Collectors.groupingBy(s->s,Collectors.counting()))\n    .entrySet().stream().filter(e->e.getValue()>=2)\n    .map(e->deserialize(e.getKey())) // or map to stored nodes\n    .collect(Collectors.toList());`,
      },
    },
    {
      id: 265,
      title: "Populate next-right pointers in each node (perfect binary tree)",
      problem:
        "Given a perfect binary tree, populate each node's next pointer to its adjacent node on the right at the same level.",
      examples: [
        {
          input: "root = [1,2,3,4,5,6,7]",
          output: "next levels: [1,#],[2,3,#],[4,5,6,7,#]",
        },
        { input: "root = []", output: "[]" },
      ],
      tip: "Use the already-populated next pointers of the current level to link the next level in O(1) space",
      iteration: {
        hint: "Traverse each level using next pointers; link children of adjacent nodes across",
        snippet: `Node leftmost=root;\nwhile(leftmost.left!=null){\n    Node cur=leftmost;\n    while(cur!=null){\n        cur.left.next=cur.right;\n        if(cur.next!=null) cur.right.next=cur.next.left;\n        cur=cur.next;\n    }\n    leftmost=leftmost.left;\n}`,
      },
      recursion: {
        hint: "Recursively connect left.next = right and right.next = node.next.left if node.next exists",
        snippet: `void connect(Node n){\n    if(n==null||n.left==null) return;\n    n.left.next=n.right;\n    if(n.next!=null) n.right.next=n.next.left;\n    connect(n.left); connect(n.right);\n}`,
      },
      stream: {
        hint: "BFS collect each level; stream pairs of adjacent nodes and set next pointers",
        snippet: `// BFS level lists, then per level:\nIntStream.range(0,level.size()-1)\n    .forEach(i->level.get(i).next=level.get(i+1));\nlevel.get(level.size()-1).next=null;`,
      },
    },
    {
      id: 266,
      title:
        "Construct a binary tree from a string with bracket representation",
      problem:
        "Given a string using bracket notation for a binary tree, construct and return the represented tree.",
      examples: [
        { input: 's = "4(2(3)(1))(6(5))"', output: "[4,2,6,3,1,5]" },
        { input: 's = "1(2)(3)"', output: "[1,2,3]" },
      ],
      tip: "Recursively parse: read root value, then content inside first parentheses = left subtree, second = right subtree",
      iteration: {
        hint: "Use a stack; create nodes from numbers, push on '(', link and pop on ')'",
        snippet: `Deque<TreeNode> st=new ArrayDeque<>(); int i=0;\nwhile(i<s.length()){\n    if(s.charAt(i)=='('){i++;}\n    else if(s.charAt(i)==')'){\n        TreeNode top=st.pop();\n        if(!st.isEmpty()){TreeNode p=st.peek();\n            if(p.left==null)p.left=top; else p.right=top;} i++;}\n    else{ int j=i; if(s.charAt(j)=='-')j++;\n        while(j<s.length()&&Character.isDigit(s.charAt(j)))j++;\n        st.push(new TreeNode(Integer.parseInt(s.substring(i,j)))); i=j;}\n}\nreturn st.isEmpty()?null:st.peek();`,
      },
      recursion: {
        hint: "Parse integer, then find matching parentheses for left and right subtrees recursively",
        snippet: `int[] idx={0};\nTreeNode parse(String s){\n    if(idx[0]>=s.length()) return null;\n    int j=idx[0]; if(s.charAt(j)=='-')j++;\n    while(j<s.length()&&Character.isDigit(s.charAt(j)))j++;\n    TreeNode n=new TreeNode(Integer.parseInt(s.substring(idx[0],j))); idx[0]=j;\n    if(idx[0]<s.length()&&s.charAt(idx[0])=='('){idx[0]++;n.left=parse(s);idx[0]++;}\n    if(idx[0]<s.length()&&s.charAt(idx[0])=='('){idx[0]++;n.right=parse(s);idx[0]++;}\n    return n;\n}`,
      },
      stream: {
        hint: "Tokenize string into numbers and brackets; stream tokens reducing to tree structure",
        snippet: `// Tokenize: numbers and '(' ')' chars\n// Then reduce over token stream using a stack:\ntokens.stream().reduce(new ArrayDeque<>(),(st,tok)->{\n    // handle each token type, return stack\n    return st;\n},(a,b)->a);`,
      },
    },
    {
      id: 267,
      title: "Find the diameter of an N-ary tree",
      problem:
        "Given the root of an N-ary tree, return its diameter measured as the number of edges in the longest path.",
      examples: [
        { input: "root = [1,[3,2,4],[5,6]]", output: "3" },
        { input: "root = [1,[2],[3],[4,[5]]]", output: "3" },
      ],
      tip: "For each node, diameter through it = sum of two longest child heights; track global max",
      iteration: {
        hint: "Post-order iterative on N-ary tree; track top-2 child heights per node",
        snippet: `int[] maxDiam={0};\nMap<Node,Integer> h=new HashMap<>();\n// post-order: for each node n:\n// List<Integer> childH = n.children.stream().map(h::get).sorted(reverseOrder).collect(...);\n// int top1=childH.size()>0?childH.get(0):0;\n// int top2=childH.size()>1?childH.get(1):0;\n// maxDiam[0]=Math.max(maxDiam[0],top1+top2);\n// h.put(n,top1+1);`,
      },
      recursion: {
        hint: "DFS returns height; at each node find top-2 child heights to compute diameter",
        snippet: `int[] ans={0};\nint dfs(Node n){\n    if(n==null) return 0;\n    int max1=0,max2=0;\n    for(Node c:n.children){\n        int h=dfs(c);\n        if(h>max1){max2=max1;max1=h;}else if(h>max2)max2=h;\n    }\n    ans[0]=Math.max(ans[0],max1+max2);\n    return max1+1;\n}`,
      },
      stream: {
        hint: "Stream child heights; collect top-2 and update diameter using IntSummaryStatistics or sorted stream",
        snippet: `int dfs(Node n){\n    if(n==null) return 0;\n    List<Integer> hs=n.children.stream().map(this::dfs)\n        .sorted(Comparator.reverseOrder()).collect(Collectors.toList());\n    ans[0]=Math.max(ans[0],(hs.size()>0?hs.get(0):0)+(hs.size()>1?hs.get(1):0));\n    return hs.isEmpty()?1:hs.get(0)+1;\n}`,
      },
    },
    {
      id: 268,
      title: "Count leaf nodes, and count nodes with exactly one child",
      problem:
        "Given the root of a binary tree, count how many nodes are leaves and how many nodes have exactly one child.",
      examples: [
        {
          input: "root = [1,2,3,4,null,null,5]",
          output: "leaves = 2, oneChild = 2",
        },
        { input: "root = [1,2,3]", output: "leaves = 2, oneChild = 0" },
      ],
      tip: "Leaf: both children null. One-child: exactly one child is non-null; iterate/recurse over all nodes",
      iteration: {
        hint: "BFS or DFS; classify each dequeued/popped node as leaf, one-child, or two-child",
        snippet: `int leaves=0,oneChild=0;\nDeque<TreeNode> st=new ArrayDeque<>(); st.push(root);\nwhile(!st.isEmpty()){\n    TreeNode c=st.pop();\n    boolean l=c.left!=null, r=c.right!=null;\n    if(!l&&!r) leaves++;\n    else if(l^r) oneChild++;\n    if(l)st.push(c.left); if(r)st.push(c.right);\n}`,
      },
      recursion: {
        hint: "Post-order DFS; check null children to classify; return counts from subtrees",
        snippet: `int[] count(TreeNode n){ // returns {leaves, oneChild}\n    if(n==null) return new int[2];\n    if(n.left==null&&n.right==null) return new int[]{1,0};\n    int[] l=count(n.left),r=count(n.right);\n    boolean one=n.left==null||n.right==null;\n    return new int[]{l[0]+r[0],(one?1:0)+l[1]+r[1]};\n}`,
      },
      stream: {
        hint: "Collect all nodes via stream; partition by leaf/one-child/two-child using Collectors.partitioningBy",
        snippet: `List<TreeNode> nodes=new ArrayList<>();\ncollectAll(root,nodes);\nlong leaves=nodes.stream().filter(n->n.left==null&&n.right==null).count();\nlong oneChild=nodes.stream().filter(n->(n.left==null)^(n.right==null)).count();`,
      },
    },
    {
      id: 269,
      title: "Find the closest leaf node to a given node",
      problem:
        "Given the root of a binary tree and a target node, return the value of the closest leaf to that target.",
      examples: [
        { input: "root = [1,2,3,null,null,4,5], target = 3", output: "4 or 5" },
        { input: "root = [1,2,null,3], target = 2", output: "3" },
      ],
      tip: "Convert tree to graph with parent links, then BFS from the target node; first leaf reached is the answer",
      iteration: {
        hint: "Build parent map, then BFS from target; return val of first leaf encountered",
        snippet: `Map<TreeNode,TreeNode> parent=new HashMap<>();\nbuildParents(root,null,parent);\nSet<TreeNode> visited=new HashSet<>();\nQueue<TreeNode> q=new LinkedList<>(); q.offer(target); visited.add(target);\nwhile(!q.isEmpty()){\n    TreeNode c=q.poll();\n    if(c.left==null&&c.right==null) return c.val;\n    for(TreeNode nb:new TreeNode[]{c.left,c.right,parent.get(c)})\n        if(nb!=null&&visited.add(nb)) q.offer(nb);\n}`,
      },
      recursion: {
        hint: "DFS find target, then BFS upward using parent pointers to find nearest leaf",
        snippet: `// Step 1: collect parents via DFS\n// Step 2: BFS from target same as iterative approach above\nvoid buildParents(TreeNode n, TreeNode p, Map<TreeNode,TreeNode> map){\n    if(n==null) return;\n    map.put(n,p);\n    buildParents(n.left,n,map); buildParents(n.right,n,map);\n}`,
      },
      stream: {
        hint: "BFS using stream of neighbors; filter visited; return first leaf's value",
        snippet: `// From BFS queue at each step:\nq.poll() // current node\n    .then check leaf, then:\nStream.of(cur.left,cur.right,parent.get(cur))\n    .filter(n->n!=null&&visited.add(n))\n    .forEach(q::offer);`,
      },
    },
    {
      id: 270,
      title:
        "Implement a segment tree for range sum queries with point updates",
      problem:
        "Design a segment tree that supports range sum queries and point updates on an integer array.",
      examples: [
        {
          input: "nums = [1,3,5], sumRange(0,2), update(1,2), sumRange(0,2)",
          output: "9, 8",
        },
        {
          input: "nums = [2,4,6], sumRange(1,2), update(2,1), sumRange(0,2)",
          output: "10, 7",
        },
      ],
      tip: "Build segment tree bottom-up; query splits range across nodes; point update propagates from leaf to root",
      iteration: {
        hint: "Store tree in array of size 4*n; build bottom-up, then query and update iteratively",
        snippet: `int[] tree=new int[4*n];\nvoid build(int[] a,int v,int lo,int hi){\n    if(lo==hi){tree[v]=a[lo];return;}\n    int mid=(lo+hi)/2;\n    build(a,2*v,lo,mid); build(a,2*v+1,mid+1,hi);\n    tree[v]=tree[2*v]+tree[2*v+1];\n}\nvoid update(int v,int lo,int hi,int pos,int val){\n    if(lo==hi){tree[v]=val;return;}\n    int mid=(lo+hi)/2;\n    if(pos<=mid)update(2*v,lo,mid,pos,val); else update(2*v+1,mid+1,hi,pos,val);\n    tree[v]=tree[2*v]+tree[2*v+1];\n}`,
      },
      recursion: {
        hint: "Recursive build/query/update with node index 2v (left) and 2v+1 (right); merge by summing children",
        snippet: `int query(int v,int lo,int hi,int l,int r){\n    if(l>hi||r<lo) return 0;\n    if(l<=lo&&hi<=r) return tree[v];\n    int mid=(lo+hi)/2;\n    return query(2*v,lo,mid,l,r)+query(2*v+1,mid+1,hi,l,r);\n}`,
      },
      stream: {
        hint: "Build tree array using IntStream; perform range query by recursively streaming range splits",
        snippet: `// Build: IntStream.range(n,2*n).forEach(i->tree[i]=a[i-n]);\n// Then bottom-up: IntStream.range(1,n).map(i->n-1-i+1)\n//     .forEach(i->tree[i]=tree[2*i]+tree[2*i+1]);\n// Query: sum by iterating over BIT-like segment boundaries`,
      },
    },
    {
      id: 271,
      title: "Implement a Fenwick tree (BIT) for prefix sum queries",
      problem:
        "Design a Fenwick tree that supports point updates and prefix or range sum queries on an integer array.",
      examples: [
        {
          input: "nums = [1,2,3,4], prefixSum(3), update(2,+2), rangeSum(2,4)",
          output: "6, 11",
        },
        {
          input: "nums = [5,1,7], rangeSum(1,3), update(1,-2), prefixSum(2)",
          output: "13, 4",
        },
      ],
      tip: "BIT stores partial sums; update propagates by adding least significant bit (i += i & -i); query sums by removing it (i -= i & -i)",
      iteration: {
        hint: "Update: loop adding LSB to index; query: loop subtracting LSB accumulating sum",
        snippet: `int[] bit=new int[n+1];\nvoid update(int i, int delta){\n    for(;i<=n;i+=i&-i) bit[i]+=delta;\n}\nint query(int i){\n    int sum=0;\n    for(;i>0;i-=i&-i) sum+=bit[i];\n    return sum;\n}\nint rangeQuery(int l, int r){ return query(r)-query(l-1); }`,
      },
      recursion: {
        hint: "Recursive update/query by adding/subtracting LSB at each step until out of bounds",
        snippet: `void update(int i, int d){\n    if(i>n) return;\n    bit[i]+=d; update(i+(i&-i),d);\n}\nint query(int i){\n    if(i==0) return 0;\n    return bit[i]+query(i-(i&-i));\n}`,
      },
      stream: {
        hint: "Prefix sums via IntStream accumulation over BIT array for batch build; individual ops still iterative",
        snippet: `// Build BIT from array in O(n):\nIntStream.range(1,n+1).forEach(i->{\n    bit[i]+=a[i-1];\n    int p=i+(i&-i);\n    if(p<=n) bit[p]+=bit[i];\n});`,
      },
    },
  ],
};
