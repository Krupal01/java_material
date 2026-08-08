window.CT_ARRAYS_B = [
  {
    id: 93,
    title: "Subarray divisible by K",
    tip: "Prefix sum modulo K: if (prefixSum % K) repeats, the subarray between those indices is divisible by K",
    iteration: {
      hint: "Track prefix sum mod K in a map; count matches",
      snippet: `Map<Integer,Integer> map = new HashMap<>();
map.put(0, 1); int sum = 0, count = 0;
for (int n : nums) {
    sum = ((sum + n) % k + k) % k;
    count += map.getOrDefault(sum, 0);
    map.merge(sum, 1, Integer::sum);
}`,
    },
    recursion: {
      hint: "Recursive prefix sum accumulation with memoized mod counts",
      snippet: `int count(int[] a, int k, int i, int mod, Map<Integer,Integer> m) {
    if (i == a.length) return 0;
    mod = ((mod + a[i]) % k + k) % k;
    int c = m.getOrDefault(mod, 0);
    m.merge(mod, 1, Integer::sum);
    return c + count(a, k, i + 1, mod, m);
}`,
    },
    stream: {
      hint: "Streams don't carry running state naturally; use iterative prefix sum",
      snippet: `// Use iteration — streams don't naturally carry running state
// Prefix sums via: IntStream.of(nums).reduce with running total`,
    },
  },
  {
    id: 94,
    title: "Continuous subarray sum (multiple of K)",
    tip: "Prefix sum mod K: if same remainder seen before with gap >= 2, a valid subarray exists",
    iteration: {
      hint: "Store (mod -> first index) in map; check gap >= 2",
      snippet: `Map<Integer,Integer> map = new HashMap<>();
map.put(0, -1); int sum = 0;
for (int i = 0; i < nums.length; i++) {
    sum = (sum + nums[i]) % k;
    if (map.containsKey(sum) && i - map.get(sum) >= 2) return true;
    map.putIfAbsent(sum, i);
} return false;`,
    },
    recursion: {
      hint: "Recurse through array tracking prefix mod; check gap on revisit",
      snippet: `boolean check(int[] a, int k, int i, int mod, Map<Integer,Integer> seen) {
    if (i == a.length) return false;
    mod = (mod + a[i]) % k;
    if (seen.containsKey(mod) && i - seen.get(mod) >= 2) return true;
    seen.putIfAbsent(mod, i);
    return check(a, k, i + 1, mod, seen);
}`,
    },
    stream: {
      hint: "State-dependent; iterative prefix sum map is clearest",
      snippet: `// Streams can't easily track running mod + index gap
// Stick with the HashMap + loop approach`,
    },
  },
  {
    id: 95,
    title: "Maximum sum circular subarray",
    tip: "Answer is max(Kadane normal, total sum - Kadane on negated array); handle all-negative edge case",
    iteration: {
      hint: "Run Kadane normally and on negated values; compare vs total",
      snippet: `int maxNormal = kadane(nums);
int total = Arrays.stream(nums).sum();
int[] neg = Arrays.stream(nums).map(x -> -x).toArray();
int maxCircular = total + kadane(neg);
return (maxCircular == 0) ? maxNormal : Math.max(maxNormal, maxCircular);`,
    },
    recursion: {
      hint: "Recursive Kadane: carry current max ending here; return global max",
      snippet: `int kadane(int[] a, int i, int cur, int[] best) {
    if (i == a.length) return best[0];
    cur = Math.max(a[i], cur + a[i]);
    best[0] = Math.max(best[0], cur);
    return kadane(a, i + 1, cur, best);
}`,
    },
    stream: {
      hint: "Use IntStream for total; Kadane loop for max subarray",
      snippet: `int total = IntStream.of(nums).sum();
// Run standard Kadane for maxNormal, then compare with total - minSubarraySum`,
    },
  },
  {
    id: 96,
    title: "Duplicate zeros in place",
    tip: "Count zeros to find shift amount, then copy from back to avoid overwriting unprocessed elements",
    iteration: {
      hint: "Count zeros, then iterate from end placing each element at shifted position",
      snippet: `int zeros = 0, n = arr.length;
for (int x : arr) if (x == 0) zeros++;
for (int i = n - 1, j = n + zeros - 1; i >= 0; i--, j--) {
    if (j < n) arr[j] = arr[i];
    if (arr[i] == 0 && --j < n) arr[j] = 0;
}`,
    },
    recursion: {
      hint: "Recursively find shift, then place from back",
      snippet: `void dup(int[] a, int i, int j) {
    if (i < 0) return;
    if (j < a.length) a[j] = a[i];
    if (a[i] == 0 && j - 1 < a.length) a[j - 1] = 0;
    dup(a, i - 1, j - (a[i] == 0 ? 2 : 1));
}`,
    },
    stream: {
      hint: "In-place shift not stream-friendly; use FlatMap to build then copy back",
      snippet: `int[] res = Arrays.stream(arr).flatMap(x -> x==0
    ? IntStream.of(0,0) : IntStream.of(x))
    .limit(arr.length).toArray();
System.arraycopy(res, 0, arr, 0, arr.length);`,
    },
  },
  {
    id: 97,
    title: "Minimum operations to make array elements equal",
    tip: "Sort + prefix sums: cost to make all elements equal to median is minimized; compute with prefix sums",
    iteration: {
      hint: "Sort, compute prefix sums, query each element as target",
      snippet: `Arrays.sort(nums);
long[] pre = new long[nums.length + 1];
for (int i = 0; i < nums.length; i++) pre[i+1] = pre[i] + nums[i];
long best = Long.MAX_VALUE;
for (int i = 0; i < nums.length; i++) {
    long cost = (long)nums[i]*(i+1) - pre[i+1] + (pre[n]-pre[i+1]) - (long)nums[i]*(n-i-1);
    best = Math.min(best, cost);
} return best;`,
    },
    recursion: {
      hint: "Recursively compute prefix sums, then evaluate median",
      snippet: `// Sort then use the median as optimal target
// Cost = sum |a[i] - median| for each element`,
    },
    stream: {
      hint: "Sort then compute total absolute diff from median with IntStream",
      snippet: `Arrays.sort(nums);
int median = nums[nums.length / 2];
long ops = IntStream.of(nums).mapToLong(x -> Math.abs(x - median)).sum();`,
    },
  },
  {
    id: 98,
    title: "Array partition to maximize sum of mins",
    tip: "Sort the array; pick every other element starting at index 0 — those are the mins of each pair",
    iteration: {
      hint: "Sort, then sum elements at even indices",
      snippet: `Arrays.sort(nums);
int sum = 0;
for (int i = 0; i < nums.length; i += 2) sum += nums[i];
return sum;`,
    },
    recursion: {
      hint: "Recurse through sorted array, adding every other element",
      snippet: `int sum(int[] a, int i) {
    if (i >= a.length) return 0;
    return a[i] + sum(a, i + 2);
}
// Call: Arrays.sort(nums); sum(nums, 0);`,
    },
    stream: {
      hint: "Sort then filter even indices using IntStream range",
      snippet: `Arrays.sort(nums);
return IntStream.range(0, nums.length / 2).map(i -> nums[i * 2]).sum();`,
    },
  },
  {
    id: 99,
    title: "Largest rectangle in histogram",
    tip: "Monotonic stack: maintain increasing heights; pop when a shorter bar is found and calculate area",
    iteration: {
      hint: "Push indices onto stack; pop and compute area when height decreases",
      snippet: `Deque<Integer> stack = new ArrayDeque<>();
int max = 0;
for (int i = 0; i <= h.length; i++) {
    int cur = (i == h.length) ? 0 : h[i];
    while (!stack.isEmpty() && h[stack.peek()] > cur) {
        int ht = h[stack.pop()];
        int w = stack.isEmpty() ? i : i - stack.peek() - 1;
        max = Math.max(max, ht * w);
    } stack.push(i);
} return max;`,
    },
    recursion: {
      hint: "Divide and conquer: find min in range, compute area, recurse on left and right",
      snippet: `int maxArea(int[] h, int l, int r) {
    if (l > r) return 0;
    int m = IntStream.range(l, r+1).reduce(l, (a,b) -> h[a]<h[b]?a:b);
    return Math.max(h[m]*(r-l+1),
        Math.max(maxArea(h,l,m-1), maxArea(h,m+1,r)));
}`,
    },
    stream: {
      hint: "Stack logic not stream-friendly; use iteration with monotonic stack",
      snippet: `// Stream API cannot maintain a monotonic stack across elements
// Use the iterative Deque-based approach`,
    },
  },
  {
    id: 100,
    title: "Matrix rotation (90 degrees in place)",
    tip: "Transpose the matrix, then reverse each row — two steps give 90-degree clockwise rotation",
    iteration: {
      hint: "Transpose then reverse each row in place",
      snippet: `// Transpose
for (int i = 0; i < n; i++)
    for (int j = i+1; j < n; j++) { int t=m[i][j]; m[i][j]=m[j][i]; m[j][i]=t; }
// Reverse rows
for (int[] row : m) { int l=0,r=row.length-1; while(l<r){int t=row[l];row[l++]=row[r];row[r--]=t;} }`,
    },
    recursion: {
      hint: "Recursively transpose then reverse; base case n<=1",
      snippet: `void rotate(int[][] m, int n) {
    if (n <= 1) return;
    for (int i = 0; i < n; i++) for (int j = i+1; j < n; j++) { int t=m[i][j];m[i][j]=m[j][i];m[j][i]=t; }
    for (int[] row : m) reverse(row);
}`,
    },
    stream: {
      hint: "In-place 2D swap; use nested IntStream for transpose",
      snippet: `IntStream.range(0, n).forEach(i ->
    IntStream.range(i+1, n).forEach(j -> { int t=m[i][j];m[i][j]=m[j][i];m[j][i]=t; }));
for (int[] row : m) { int l=0,r=n-1; while(l<r){int t=row[l];row[l++]=row[r];row[r--]=t;} }`,
    },
  },
  {
    id: 101,
    title: "Diagonal traversal of a matrix",
    tip: "Direction alternates each diagonal; use d flag for up/down; total diagonals = m+n-1",
    iteration: {
      hint: "Iterate diagonals, alternate direction, collect elements",
      snippet: `int[] res = new int[m*n]; int idx=0;
for (int d=0; d<m+n-1; d++) {
    int rS=d<n?0:d-n+1, rE=d<m?d:m-1;
    if (d%2==0) for(int r=rS;r<=rE;r++) res[idx++]=mat[r][d-r];
    else         for(int r=rE;r>=rS;r--) res[idx++]=mat[r][d-r];
} return res;`,
    },
    recursion: {
      hint: "Recurse over each diagonal index; flip direction each time",
      snippet: `void diag(int[][] mat, int d, int[] res, int[] idx) {
    if (d >= mat.length + mat[0].length - 1) return;
    int rS=d<mat[0].length?0:d-mat[0].length+1, rE=d<mat.length?d:mat.length-1;
    if (d%2==0) for(int r=rS;r<=rE;r++) res[idx[0]++]=mat[r][d-r];
    else         for(int r=rE;r>=rS;r--) res[idx[0]++]=mat[r][d-r];
    diag(mat, d+1, res, idx);
}`,
    },
    stream: {
      hint: "Use IntStream over diagonal indices; collect with direction logic",
      snippet: `// IntStream over d=0..m+n-2; for each d build a stream of row indices
// Reverse stream when d is odd using Collections.reverse on a list`,
    },
  },
  {
    id: 102,
    title: "Pascal's triangle",
    tip: "Each element is sum of two elements above it; build row by row using previous row",
    iteration: {
      hint: "Iteratively build each row from the previous",
      snippet: `List<List<Integer>> tri = new ArrayList<>();
for (int i = 0; i < numRows; i++) {
    List<Integer> row = new ArrayList<>(Collections.nCopies(i+1, 1));
    for (int j = 1; j < i; j++) row.set(j, tri.get(i-1).get(j-1) + tri.get(i-1).get(j));
    tri.add(row);
} return tri;`,
    },
    recursion: {
      hint: "Recursively build up to row n from row n-1",
      snippet: `List<List<Integer>> pascal(int n) {
    if (n == 1) return new ArrayList<>(List.of(List.of(1)));
    List<List<Integer>> prev = pascal(n - 1);
    List<Integer> last = prev.get(n-2), row = new ArrayList<>(List.of(1));
    for (int j = 1; j < n-1; j++) row.add(last.get(j-1)+last.get(j));
    if (n > 1) row.add(1); prev.add(row); return prev;
}`,
    },
    stream: {
      hint: "Use Stream.iterate to generate each row from previous",
      snippet: `Stream.iterate(List.of(1), row -> {
    List<Integer> next = new ArrayList<>(List.of(1));
    IntStream.range(1, row.size()).forEach(i -> next.add(row.get(i-1)+row.get(i)));
    next.add(1); return next;
}).limit(numRows).collect(Collectors.toList());`,
    },
  },
  {
    id: 103,
    title: "Pascal's triangle — single row",
    tip: "Use C(n,k) = C(n,k-1) * (n-k+1) / k to build one row in O(n) time without full triangle",
    iteration: {
      hint: "Compute binomial coefficients iteratively using the recurrence",
      snippet: `List<Integer> row = new ArrayList<>(); row.add(1);
for (int k = 1; k <= rowIndex; k++)
    row.add((int)((long)row.get(k-1) * (rowIndex - k + 1) / k));
return row;`,
    },
    recursion: {
      hint: "Recursively build list using C(n,k) = C(n,k-1)*(n-k+1)/k",
      snippet: `List<Integer> build(int n, int k, List<Integer> row) {
    if (k > n) return row;
    row.add((int)((long)row.get(k-1)*(n-k+1)/k));
    return build(n, k+1, row);
}
// Call: build(rowIndex, 1, new ArrayList<>(List.of(1)));`,
    },
    stream: {
      hint: "Use Stream.iterate over k to compute each coefficient",
      snippet: `long[] prev = {1};
return IntStream.rangeClosed(0, rowIndex).mapToObj(k -> {
    int val = (int) prev[0];
    prev[0] = prev[0] * (rowIndex - k) / (k + 1);
    return val;
}).collect(Collectors.toList());`,
    },
  },
  {
    id: 104,
    title: "Shuffle an array (Fisher-Yates)",
    tip: "From end to start, swap each element with a random element at or before it — gives unbiased shuffle",
    iteration: {
      hint: "Loop from last index down; swap with random index 0..i",
      snippet: `Random rng = new Random();
int[] a = nums.clone();
for (int i = a.length - 1; i > 0; i--) {
    int j = rng.nextInt(i + 1);
    int t = a[i]; a[i] = a[j]; a[j] = t;
} return a;`,
    },
    recursion: {
      hint: "Recurse from last index to 0; swap each with random position",
      snippet: `void shuffle(int[] a, int i, Random r) {
    if (i <= 0) return;
    int j = r.nextInt(i + 1);
    int t = a[i]; a[i] = a[j]; a[j] = t;
    shuffle(a, i - 1, r);
}`,
    },
    stream: {
      hint: "Collect to list, shuffle with Collections.shuffle, convert back",
      snippet: `List<Integer> list = IntStream.of(nums).boxed().collect(Collectors.toList());
Collections.shuffle(list);
return list.stream().mapToInt(Integer::intValue).toArray();`,
    },
  },
  {
    id: 105,
    title: "Wiggle sort",
    tip: "One pass: if index is odd and nums[i] < nums[i-1], swap; if even and nums[i] > nums[i-1], swap",
    iteration: {
      hint: "Traverse with swap condition alternating at each index",
      snippet: `for (int i = 1; i < nums.length; i++) {
    if ((i % 2 == 1 && nums[i] < nums[i-1]) ||
        (i % 2 == 0 && nums[i] > nums[i-1])) {
        int t = nums[i]; nums[i] = nums[i-1]; nums[i-1] = t;
    }
}`,
    },
    recursion: {
      hint: "Recurse through indices, applying swap condition at each step",
      snippet: `void wiggle(int[] a, int i) {
    if (i >= a.length) return;
    if ((i%2==1 && a[i]<a[i-1]) || (i%2==0 && a[i]>a[i-1])) {
        int t=a[i]; a[i]=a[i-1]; a[i-1]=t;
    }
    wiggle(a, i + 1);
}`,
    },
    stream: {
      hint: "In-place swap not stream-friendly; use IntStream.range with index check",
      snippet: `IntStream.range(1, nums.length).forEach(i -> {
    if ((i%2==1&&nums[i]<nums[i-1])||(i%2==0&&nums[i]>nums[i-1])) {
        int t=nums[i]; nums[i]=nums[i-1]; nums[i-1]=t;
    }
});`,
    },
  },
  {
    id: 106,
    title: "Relative sort array",
    tip: "Use a custom comparator: elements in arr2 come first in order; remaining elements sorted numerically",
    iteration: {
      hint: "Map arr2 elements to their rank; sort with custom comparator",
      snippet: `Map<Integer,Integer> rank = new HashMap<>();
for (int i = 0; i < arr2.length; i++) rank.put(arr2[i], i);
Integer[] a = Arrays.stream(arr1).boxed().toArray(Integer[]::new);
Arrays.sort(a, (x,y) -> rank.containsKey(x) && rank.containsKey(y)
    ? rank.get(x) - rank.get(y)
    : rank.containsKey(x) ? -1 : rank.containsKey(y) ? 1 : x - y);
return Arrays.stream(a).mapToInt(Integer::intValue).toArray();`,
    },
    recursion: {
      hint: "Recursively build result: first elements matching arr2 order, then sorted rest",
      snippet: `// Base: separate arr1 into "in arr2" and "not in arr2" lists
// Place in arr2 order first, then sort and append the rest`,
    },
    stream: {
      hint: "Use Comparator with rank map in sorted() stream pipeline",
      snippet: `Map<Integer,Integer> r = new HashMap<>();
IntStream.range(0,arr2.length).forEach(i->r.put(arr2[i],i));
return Arrays.stream(arr1).boxed()
    .sorted((x,y)->r.containsKey(x)&&r.containsKey(y)?r.get(x)-r.get(y):r.containsKey(x)?-1:r.containsKey(y)?1:x-y)
    .mapToInt(Integer::intValue).toArray();`,
    },
  },
  {
    id: 107,
    title: "Sorted squares of a sorted array",
    tip: "Two pointers from both ends: largest square comes from either end; fill result array from back",
    iteration: {
      hint: "Two pointers l and r; compare squares, insert from right of result",
      snippet: `int n = nums.length, l = 0, r = n - 1;
int[] res = new int[n];
for (int i = n - 1; i >= 0; i--) {
    if (Math.abs(nums[l]) > Math.abs(nums[r])) res[i] = nums[l]*nums[l++];
    else res[i] = nums[r]*nums[r--];
} return res;`,
    },
    recursion: {
      hint: "Recurse with l and r pointers filling result from back",
      snippet: `void fill(int[] a, int l, int r, int[] res, int i) {
    if (l > r) return;
    if (Math.abs(a[l]) > Math.abs(a[r])) { res[i]=a[l]*a[l]; fill(a,l+1,r,res,i-1); }
    else { res[i]=a[r]*a[r]; fill(a,l,r-1,res,i-1); }
}`,
    },
    stream: {
      hint: "Square each element, then sort — O(n log n) but concise",
      snippet: `return Arrays.stream(nums).map(x -> x*x).sorted().toArray();`,
    },
  },
  {
    id: 108,
    title: "Number of islands (grid)",
    tip: "DFS/BFS from each unvisited '1'; mark visited cells as '0' (sink them); count DFS calls",
    iteration: {
      hint: "BFS with queue: enqueue '1' cell, flood-fill neighbors",
      snippet: `int count = 0;
for (int i=0;i<grid.length;i++) for (int j=0;j<grid[0].length;j++)
  if (grid[i][j]=='1') { count++;
    Queue<int[]> q=new LinkedList<>(); q.add(new int[]{i,j}); grid[i][j]='0';
    while(!q.isEmpty()){int[]c=q.poll(); for(int[]d:new int[][]{{1,0},{-1,0},{0,1},{0,-1}})
      {int ni=c[0]+d[0],nj=c[1]+d[1]; if(ni>=0&&ni<grid.length&&nj>=0&&nj<grid[0].length&&grid[ni][nj]=='1'){grid[ni][nj]='0';q.add(new int[]{ni,nj});}}}
  } return count;`,
    },
    recursion: {
      hint: "DFS: mark cell visited, recurse on 4 neighbors",
      snippet: `void dfs(char[][] g, int i, int j) {
    if (i<0||i>=g.length||j<0||j>=g[0].length||g[i][j]!='1') return;
    g[i][j]='0';
    dfs(g,i+1,j); dfs(g,i-1,j); dfs(g,i,j+1); dfs(g,i,j-1);
}
// Count: for each '1' cell, call dfs and increment counter`,
    },
    stream: {
      hint: "Grid mutation not stream-friendly; use DFS/BFS iteratively",
      snippet: `// Streams over 2D grids with mutable state require index tricks
// Use the recursive DFS — it's clean and short`,
    },
  },
  {
    id: 109,
    title: "Word search (grid)",
    tip: "DFS with backtracking: mark cell visited, try all 4 directions, unmark on backtrack",
    iteration: {
      hint: "Iterative DFS with explicit stack tracking position and word index",
      snippet: `// Iterative backtracking is complex here; recursive DFS is standard
// Each cell: check char match, mark visited, recurse 4-dirs, unmark`,
    },
    recursion: {
      hint: "Recurse through word characters; mark cell '#' and restore on backtrack",
      snippet: `boolean dfs(char[][] b, String w, int i, int j, int k) {
    if (k==w.length()) return true;
    if (i<0||i>=b.length||j<0||j>=b[0].length||b[i][j]!=w.charAt(k)) return false;
    char tmp=b[i][j]; b[i][j]='#';
    boolean found=dfs(b,w,i+1,j,k+1)||dfs(b,w,i-1,j,k+1)||dfs(b,w,i,j+1,k+1)||dfs(b,w,i,j-1,k+1);
    b[i][j]=tmp; return found;
}`,
    },
    stream: {
      hint: "Start DFS from each cell using anyMatch on stream of positions",
      snippet: `return IntStream.range(0,board.length).anyMatch(i ->
    IntStream.range(0,board[0].length).anyMatch(j ->
        dfs(board, word, i, j, 0)));`,
    },
  },
  {
    id: 110,
    title: "Max area of island",
    tip: "DFS from each '1' cell; count cells in each island; return the maximum count seen",
    iteration: {
      hint: "BFS from each land cell; count cells per island, track max",
      snippet: `int max = 0;
for (int i=0;i<grid.length;i++) for (int j=0;j<grid[0].length;j++)
  if (grid[i][j]==1) {
    Queue<int[]> q=new LinkedList<>(); q.add(new int[]{i,j}); grid[i][j]=0; int area=0;
    while(!q.isEmpty()){q.poll(); area++; /* enqueue unvisited neighbors */ }
    max=Math.max(max,area);
} return max;`,
    },
    recursion: {
      hint: "DFS returns count of connected land cells",
      snippet: `int dfs(int[][] g, int i, int j) {
    if (i<0||i>=g.length||j<0||j>=g[0].length||g[i][j]==0) return 0;
    g[i][j]=0;
    return 1+dfs(g,i+1,j)+dfs(g,i-1,j)+dfs(g,i,j+1)+dfs(g,i,j-1);
}
// max = max over all cells of dfs(grid, i, j)`,
    },
    stream: {
      hint: "Use stream of positions; call DFS from each, collect max",
      snippet: `return IntStream.range(0,grid.length).flatMap(i->IntStream.range(0,grid[0].length)
    .map(j->dfs(grid,i,j))).max().orElse(0);`,
    },
  },
  {
    id: 111,
    title: "Flood fill",
    tip: "DFS/BFS from source pixel; replace old color with new color; don't revisit already-new-color cells",
    iteration: {
      hint: "BFS queue flood fill; skip if old color equals new color",
      snippet: `int old = image[sr][sc];
if (old == color) return image;
Queue<int[]> q = new LinkedList<>(); q.add(new int[]{sr,sc}); image[sr][sc]=color;
int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
while (!q.isEmpty()) { int[]c=q.poll();
  for (int[]d:dirs){int ni=c[0]+d[0],nj=c[1]+d[1];
    if(ni>=0&&ni<image.length&&nj>=0&&nj<image[0].length&&image[ni][nj]==old){image[ni][nj]=color;q.add(new int[]{ni,nj});}}}
return image;`,
    },
    recursion: {
      hint: "DFS: if cell matches old color, paint it and recurse on 4 neighbors",
      snippet: `void fill(int[][] im, int r, int c, int old, int col) {
    if (r<0||r>=im.length||c<0||c>=im[0].length||im[r][c]!=old) return;
    im[r][c]=col;
    fill(im,r+1,c,old,col); fill(im,r-1,c,old,col);
    fill(im,r,c+1,old,col); fill(im,r,c-1,old,col);
}`,
    },
    stream: {
      hint: "Grid mutation with DFS not stream-friendly; use recursive fill",
      snippet: `// Streams can't handle the stateful neighbor traversal here
// Use recursive DFS — clean, concise, and standard`,
    },
  },
  {
    id: 112,
    title: "Game of life",
    tip: "Use encoded states (2=was dead now alive, -1=was alive now dead) to update in-place without extra space",
    iteration: {
      hint: "Two passes: encode transitions, then decode final state",
      snippet: `int[][] dirs={{1,0},{-1,0},{0,1},{0,-1},{1,1},{1,-1},{-1,1},{-1,-1}};
for (int i=0;i<board.length;i++) for (int j=0;j<board[0].length;j++) {
    int live=(int)Arrays.stream(dirs).filter(d->{int ni=i+d[0],nj=j+d[1]; return ni>=0&&ni<board.length&&nj>=0&&nj<board[0].length&&Math.abs(board[ni][nj])==1;}).count();
    if(board[i][j]==1&&(live<2||live>3)) board[i][j]=-1;
    if(board[i][j]==0&&live==3) board[i][j]=2;
}
for(int[]row:board) for(int j=0;j<row.length;j++) row[j]=row[j]>0?1:0;`,
    },
    recursion: {
      hint: "Compute next state recursively cell by cell using encoded values",
      snippet: `// Game of Life requires global state; true recursion isn't natural
// Use the two-pass encoding approach for in-place O(1) space`,
    },
    stream: {
      hint: "Stream over cells to count live neighbors; still needs two-pass encoding",
      snippet: `// Count live neighbors per cell using stream over directions
// Then apply Game of Life rules in a second pass`,
    },
  },
  {
    id: 113,
    title: "Matrix reshape",
    tip: "Map flat index i = r*c + col to new (i/c2, i%c2); only possible if total elements match",
    iteration: {
      hint: "Flatten matrix then fill new shape using index arithmetic",
      snippet: `if (nums.length*nums[0].length != r*c) return nums;
int[][] res = new int[r][c]; int k=0;
for (int[] row : nums) for (int v : row) res[k/c][k++%c]=v;
return res;`,
    },
    recursion: {
      hint: "Recursively place each element at its new (k/c, k%c) position",
      snippet: `void fill(int[][] src, int[][] dst, int k, int cols) {
    if (k >= src.length*src[0].length) return;
    dst[k/cols][k%cols] = src[k/src[0].length][k%src[0].length];
    fill(src, dst, k+1, cols);
}`,
    },
    stream: {
      hint: "Flatten with flatMap, then collect by chunks into rows",
      snippet: `int[] flat = Arrays.stream(nums).flatMapToInt(Arrays::stream).toArray();
return IntStream.range(0,r).mapToObj(i->Arrays.copyOfRange(flat,i*c,(i+1)*c)).toArray(int[][]::new);`,
    },
  },
  {
    id: 114,
    title: "Toeplitz matrix check",
    tip: "Every element (except first row/col) must equal the element one step up-left: matrix[i][j] == matrix[i-1][j-1]",
    iteration: {
      hint: "Iterate from (1,1) checking each element against its upper-left neighbor",
      snippet: `for (int i=1;i<matrix.length;i++)
    for (int j=1;j<matrix[0].length;j++)
        if (matrix[i][j] != matrix[i-1][j-1]) return false;
return true;`,
    },
    recursion: {
      hint: "Recurse over all (i,j) with i>=1,j>=1; check diagonal condition",
      snippet: `boolean check(int[][] m, int i, int j) {
    if (i >= m.length) return true;
    if (j >= m[0].length) return check(m, i+1, 1);
    return m[i][j]==m[i-1][j-1] && check(m, i, j+1);
}`,
    },
    stream: {
      hint: "Use IntStream range over rows and cols; check all with allMatch",
      snippet: `return IntStream.range(1,matrix.length).allMatch(i->
    IntStream.range(1,matrix[0].length).allMatch(j->
        matrix[i][j]==matrix[i-1][j-1]));`,
    },
  },
  {
    id: 115,
    title: "Transpose matrix",
    tip: "Swap matrix[i][j] with matrix[j][i] for all i < j (square); for rectangular, create new matrix with swapped dims",
    iteration: {
      hint: "For rectangular: create new int[cols][rows] and copy with swapped indices",
      snippet: `int m=matrix.length, n=matrix[0].length;
int[][] res = new int[n][m];
for (int i=0;i<m;i++) for (int j=0;j<n;j++) res[j][i]=matrix[i][j];
return res;`,
    },
    recursion: {
      hint: "Recursively fill each (j,i) in result from (i,j) in source",
      snippet: `void fill(int[][] src, int[][] dst, int i, int j) {
    if (i>=src.length) return;
    if (j>=src[0].length) { fill(src,dst,i+1,0); return; }
    dst[j][i]=src[i][j]; fill(src,dst,i,j+1);
}`,
    },
    stream: {
      hint: "Use IntStream to build each row of the transposed matrix",
      snippet: `return IntStream.range(0,matrix[0].length)
    .mapToObj(j->IntStream.range(0,matrix.length).map(i->matrix[i][j]).toArray())
    .toArray(int[][]::new);`,
    },
  },
  {
    id: 116,
    title: "Find the equilibrium index of an array",
    tip: "Total sum minus prefix sum at each index: if leftSum == rightSum (total - leftSum - arr[i]), it's equilibrium",
    iteration: {
      hint: "Compute total sum; scan left accumulating prefix; check balance",
      snippet: `int total = 0; for (int x : arr) total += x;
int left = 0;
for (int i = 0; i < arr.length; i++) {
    if (left == total - left - arr[i]) return i;
    left += arr[i];
} return -1;`,
    },
    recursion: {
      hint: "Recurse through indices with running left sum and total",
      snippet: `int equil(int[] a, int i, int left, int total) {
    if (i == a.length) return -1;
    if (left == total - left - a[i]) return i;
    return equil(a, i+1, left+a[i], total);
}`,
    },
    stream: {
      hint: "Compute total with stream; find first index where condition holds",
      snippet: `int total = IntStream.of(arr).sum();
int[] left = {0};
return IntStream.range(0,arr.length).filter(i -> {
    boolean eq = left[0] == total - left[0] - arr[i];
    left[0] += arr[i]; return eq;
}).findFirst().orElse(-1);`,
    },
  },
  {
    id: 117,
    title: "Merge two sorted arrays in-place (no extra space)",
    tip: "Start filling from the end of the combined length; use two pointers from the ends of each array",
    iteration: {
      hint: "Pointer from end of nums1 content and end of nums2; fill from back of nums1",
      snippet: `int i=m-1, j=n-1, k=m+n-1;
while (i>=0 && j>=0)
    nums1[k--] = nums1[i]>=nums2[j] ? nums1[i--] : nums2[j--];
while (j>=0) nums1[k--]=nums2[j--];`,
    },
    recursion: {
      hint: "Recurse from the last merged position; pick larger of i/j pointers",
      snippet: `void merge(int[] a, int[] b, int i, int j, int k) {
    if (j < 0) return;
    if (i >= 0 && a[i] >= b[j]) { a[k]=a[i]; merge(a,b,i-1,j,k-1); }
    else { a[k]=b[j]; merge(a,b,i,j-1,k-1); }
}`,
    },
    stream: {
      hint: "Merge not stream-friendly in-place; use two-pointer loop for O(m+n) time",
      snippet: `// In-place merge from the back is the canonical O(m+n) O(1) solution
// Streams would need extra space — use the two-pointer approach`,
    },
  },
  {
    id: 118,
    title: "Find all pairs with a given difference",
    tip: "Sort + two pointers, or use a HashSet: for each element check if (element + diff) exists in the set",
    iteration: {
      hint: "Add all to set; for each x check if x+diff is in set",
      snippet: `Set<Integer> set = new HashSet<>();
for (int x : arr) set.add(x);
List<int[]> res = new ArrayList<>();
for (int x : arr) if (set.contains(x + diff)) res.add(new int[]{x, x+diff});
return res;`,
    },
    recursion: {
      hint: "Recurse through sorted array with two pointers l and r",
      snippet: `void find(int[] a, int l, int r, int d, List<int[]> res) {
    if (r >= a.length) return;
    int cur = a[r] - a[l];
    if (cur == d) { res.add(new int[]{a[l],a[r]}); find(a,l+1,r+1,d,res); }
    else if (cur < d) find(a,l,r+1,d,res);
    else find(a,l+1,r,d,res);
}`,
    },
    stream: {
      hint: "Build set, then stream array filtering elements where x+diff is in set",
      snippet: `Set<Integer> s = IntStream.of(arr).boxed().collect(Collectors.toSet());
return IntStream.of(arr).filter(x->s.contains(x+diff))
    .mapToObj(x->new int[]{x,x+diff}).collect(Collectors.toList());`,
    },
  },
  {
    id: 119,
    title: "Maximum subarray sum with at most K elements removed",
    tip: "DP with state (index, removals left): max sum ending here with j removals used; use memoization",
    iteration: {
      hint: "DP table dp[i][j] = max sum of subarray ending at i with j removals",
      snippet: `int n=nums.length; int[][] dp=new int[n][k+1]; int res=Integer.MIN_VALUE;
for (int i=0;i<n;i++) for (int j=0;j<=k;j++) {
    dp[i][j]=nums[i];
    if (i>0) dp[i][j]=Math.max(dp[i][j], dp[i-1][j]+nums[i]);
    if (i>0&&j>0) dp[i][j]=Math.max(dp[i][j], dp[i-1][j-1]);
    res=Math.max(res,dp[i][j]);
} return res;`,
    },
    recursion: {
      hint: "Memoized recursion: at each index decide include or skip (if removals left)",
      snippet: `int solve(int[] a, int i, int j, int[][] memo) {
    if (i < 0) return 0;
    if (memo[i][j] != 0) return memo[i][j];
    int take = a[i] + solve(a,i-1,j,memo);
    int skip = j>0 ? solve(a,i-1,j-1,memo) : Integer.MIN_VALUE;
    return memo[i][j] = Math.max(take, skip);
}`,
    },
    stream: {
      hint: "DP with state requires iteration; streams can't carry 2D state",
      snippet: `// 2D DP table needed; use nested loops
// No natural stream formulation for this problem`,
    },
  },
  {
    id: 120,
    title: "Find the smallest positive number missing from an unsorted array",
    tip: "Place each number x in index x-1 if 1 <= x <= n; then scan for first position where arr[i] != i+1",
    iteration: {
      hint: "Cycle-sort-like swap to place values in correct positions, then scan",
      snippet: `int n = nums.length;
for (int i=0;i<n;i++)
    while(nums[i]>0&&nums[i]<=n&&nums[nums[i]-1]!=nums[i]) {
        int t=nums[nums[i]-1]; nums[nums[i]-1]=nums[i]; nums[i]=t; }
for (int i=0;i<n;i++) if (nums[i]!=i+1) return i+1;
return n+1;`,
    },
    recursion: {
      hint: "Recursively scan after placing; return first mismatch index+1",
      snippet: `int find(int[] a, int i) {
    if (i >= a.length) return a.length+1;
    if (a[i]!=i+1) return i+1;
    return find(a, i+1);
}
// After the index-placement swap loop, call find(nums, 0)`,
    },
    stream: {
      hint: "After in-place placement, use IntStream to find first mismatch",
      snippet: `// Do the swap loop first, then:
return IntStream.range(0,nums.length)
    .filter(i->nums[i]!=i+1).map(i->i+1).findFirst().orElse(nums.length+1);`,
    },
  },
  {
    id: 121,
    title: "Rearrange array in alternating positive/negative order",
    tip: "Separate positives and negatives, then interleave starting with positive (or use 2-pointer with extra array)",
    iteration: {
      hint: "Collect positives and negatives; merge alternately into result",
      snippet: `List<Integer> pos=new ArrayList<>(), neg=new ArrayList<>();
for (int x:arr) (x>=0?pos:neg).add(x);
int[] res=new int[arr.length]; int i=0,p=0,n=0;
while(p<pos.size()&&n<neg.size()){res[i++]=pos.get(p++);res[i++]=neg.get(n++);}
while(p<pos.size()) res[i++]=pos.get(p++);
while(n<neg.size()) res[i++]=neg.get(n++);
return res;`,
    },
    recursion: {
      hint: "Recursively interleave from two lists of positives and negatives",
      snippet: `void interleave(List<Integer> pos,List<Integer> neg,int[] res,int i,int p,int n){
    if(p>=pos.size()&&n>=neg.size()) return;
    if(p<pos.size()) res[i++]=pos.get(p++);
    if(n<neg.size()) res[i++]=neg.get(n++);
    interleave(pos,neg,res,i,p,n);
}`,
    },
    stream: {
      hint: "Partition with Collectors.partitioningBy, then interleave streams",
      snippet: `Map<Boolean,List<Integer>> m=Arrays.stream(arr).boxed()
    .collect(Collectors.partitioningBy(x->x>=0));
// Then interleave m.get(true) and m.get(false)`,
    },
  },
  {
    id: 122,
    title: "Find the leaders in an array",
    tip: "Scan from right to left: track running max from right; any element >= that max is a leader",
    iteration: {
      hint: "Traverse from right, update max; collect elements >= current right max",
      snippet: `List<Integer> leaders = new ArrayList<>();
int maxRight = Integer.MIN_VALUE;
for (int i = arr.length-1; i >= 0; i--) {
    if (arr[i] >= maxRight) { leaders.add(arr[i]); maxRight = arr[i]; }
}
Collections.reverse(leaders); return leaders;`,
    },
    recursion: {
      hint: "Recurse to end, pass back max-from-right; collect leaders on way up",
      snippet: `int leaders(int[] a, int i, List<Integer> res) {
    if (i == a.length-1) { res.add(a[i]); return a[i]; }
    int rightMax = leaders(a, i+1, res);
    if (a[i] >= rightMax) { res.add(0, a[i]); return a[i]; }
    return rightMax;
}`,
    },
    stream: {
      hint: "Compute suffix max array with stream; filter where arr[i] >= suffixMax[i]",
      snippet: `int[] suf = new int[arr.length]; suf[arr.length-1]=arr[arr.length-1];
for(int i=arr.length-2;i>=0;i--) suf[i]=Math.max(arr[i],suf[i+1]);
return IntStream.range(0,arr.length).filter(i->arr[i]>=suf[i]).mapToObj(i->arr[i]).collect(Collectors.toList());`,
    },
  },
  {
    id: 123,
    title: "Minimum number of platforms needed (interval scheduling)",
    tip: "Sort arrivals and departures separately; two-pointer scan to count overlapping intervals",
    iteration: {
      hint: "Sort both arrays; advance departure pointer when train departs before next arrives",
      snippet: `Arrays.sort(arr); Arrays.sort(dep);
int platforms=1, max=1, i=1, j=0;
while (i<arr.length && j<arr.length) {
    if (arr[i]<=dep[j]) { platforms++; i++; }
    else { platforms--; j++; }
    max=Math.max(max,platforms);
} return max;`,
    },
    recursion: {
      hint: "Recursive two-pointer scan after sorting; track current platforms and max",
      snippet: `int scan(int[] a, int[] d, int i, int j, int cur, int max) {
    if (i>=a.length) return max;
    if (a[i]<=d[j]) return scan(a,d,i+1,j,cur+1,Math.max(max,cur+1));
    else return scan(a,d,i,j+1,cur-1,max);
}`,
    },
    stream: {
      hint: "Create events (+1 arrive, -1 depart), sort, scan prefix sums for max",
      snippet: `// Create events: (time, +1) for arrive, (time, -1) for depart; sort
// Scan prefix sum of event values; max prefix sum = min platforms needed`,
    },
  },
  {
    id: 124,
    title: "Maximum sum of non-adjacent elements (House Robber)",
    tip: "DP: at each house choose max(include current + dp[i-2], skip and take dp[i-1])",
    iteration: {
      hint: "Track two previous dp values; roll forward without full array",
      snippet: `int prev2=0, prev1=0;
for (int x : nums) {
    int cur = Math.max(prev1, prev2+x);
    prev2=prev1; prev1=cur;
} return prev1;`,
    },
    recursion: {
      hint: "Memoized recursion: rob(i) = max(nums[i]+rob(i-2), rob(i-1))",
      snippet: `int rob(int[] n, int i, int[] memo) {
    if (i < 0) return 0;
    if (memo[i] >= 0) return memo[i];
    return memo[i] = Math.max(rob(n,i-1,memo), n[i]+rob(n,i-2,memo));
}`,
    },
    stream: {
      hint: "Use reduce with a pair state (prev2, prev1) accumulated over stream",
      snippet: `int[] dp = {0, 0};
IntStream.of(nums).forEach(x -> {
    int cur=Math.max(dp[1], dp[0]+x); dp[0]=dp[1]; dp[1]=cur; });
return dp[1];`,
    },
  },
  {
    id: 125,
    title:
      "Majority element appearing more than N/3 times (Boyer-Moore variant)",
    tip: "At most 2 candidates can appear > n/3 times; maintain two candidate/count pairs, then verify both",
    iteration: {
      hint: "Two-pass Boyer-Moore: find two candidates, then count their occurrences",
      snippet: `int c1=0,c2=0,cnt1=0,cnt2=0;
for (int x:nums) {
    if(x==c1) cnt1++; else if(x==c2) cnt2++;
    else if(cnt1==0){c1=x;cnt1=1;} else if(cnt2==0){c2=x;cnt2=1;}
    else{cnt1--;cnt2--;}
}
cnt1=cnt2=0; for(int x:nums){if(x==c1)cnt1++;else if(x==c2)cnt2++;}
List<Integer> res=new ArrayList<>();
if(cnt1>nums.length/3)res.add(c1); if(cnt2>nums.length/3)res.add(c2); return res;`,
    },
    recursion: {
      hint: "Recurse through array updating two candidate/count pairs",
      snippet: `void bm(int[]a,int i,int[]cands,int[]cnts){
    if(i==a.length) return;
    if(a[i]==cands[0]) cnts[0]++;
    else if(a[i]==cands[1]) cnts[1]++;
    else if(cnts[0]==0){cands[0]=a[i];cnts[0]=1;}
    else if(cnts[1]==0){cands[1]=a[i];cnts[1]=1;}
    else{cnts[0]--;cnts[1]--;}
    bm(a,i+1,cands,cnts);
}`,
    },
    stream: {
      hint: "Group by frequency with stream; filter where count > n/3",
      snippet: `long n=nums.length;
return Arrays.stream(nums).boxed()
    .collect(Collectors.groupingBy(x->x,Collectors.counting()))
    .entrySet().stream().filter(e->e.getValue()>n/3)
    .map(Map.Entry::getKey).collect(Collectors.toList());`,
    },
  },
  {
    id: 126,
    title: "Chocolate distribution problem",
    tip: "Sort chocolates; sliding window of size m — minimum difference is min(arr[i+m-1] - arr[i]) over all windows",
    iteration: {
      hint: "Sort, then scan window of size m finding minimum range",
      snippet: `Arrays.sort(arr);
int min = Integer.MAX_VALUE;
for (int i = 0; i + m - 1 < arr.length; i++)
    min = Math.min(min, arr[i + m - 1] - arr[i]);
return min;`,
    },
    recursion: {
      hint: "Recurse through window start positions; return min difference found",
      snippet: `int minDiff(int[] a, int i, int m) {
    if (i + m - 1 >= a.length) return Integer.MAX_VALUE;
    return Math.min(a[i+m-1]-a[i], minDiff(a, i+1, m));
}
// Call: Arrays.sort(arr); minDiff(arr, 0, m);`,
    },
    stream: {
      hint: "Sort then use IntStream range to compute min window difference",
      snippet: `Arrays.sort(arr);
return IntStream.range(0, arr.length - m + 1)
    .map(i -> arr[i + m - 1] - arr[i]).min().orElse(0);`,
    },
  },
  {
    id: 127,
    title: "Find the smallest subarray with sum greater than a given value",
    tip: "Sliding window: expand right until sum > target, then shrink from left and track min length",
    iteration: {
      hint: "Two pointer window: grow right, shrink left when sum > target",
      snippet: `int l=0, sum=0, minLen=Integer.MAX_VALUE;
for (int r=0; r<arr.length; r++) {
    sum += arr[r];
    while (sum > x) {
        minLen = Math.min(minLen, r-l+1);
        sum -= arr[l++];
    }
} return minLen==Integer.MAX_VALUE ? 0 : minLen;`,
    },
    recursion: {
      hint: "Recursively advance r; shrink l when sum exceeds target",
      snippet: `int min(int[]a,int l,int r,int sum,int x,int best){
    if(r==a.length) return best;
    sum+=a[r];
    while(sum>x){best=Math.min(best,r-l+1);sum-=a[l++];}
    return min(a,l,r+1,sum,x,best);
}`,
    },
    stream: {
      hint: "Sliding window requires stateful tracking; use loop for O(n) solution",
      snippet: `// Stream prefix sums then binary search for each start — O(n log n)
// Or use the two-pointer sliding window loop for O(n)`,
    },
  },
  {
    id: 128,
    title: "Count inversions in an array (merge-sort based)",
    tip: "During merge sort, when right element < left element, all remaining left elements form inversions",
    iteration: {
      hint: "Merge sort counting: add (mid - l + 1) inversions for each right-before-left placement",
      snippet: `long mergeCount(int[] a, int[] tmp, int l, int r) {
    if (l >= r) return 0;
    int m=(l+r)/2; long inv=mergeCount(a,tmp,l,m)+mergeCount(a,tmp,m+1,r);
    int i=l,j=m+1,k=l;
    while(i<=m&&j<=r){if(a[i]<=a[j])tmp[k++]=a[i++];else{inv+=m-i+1;tmp[k++]=a[j++];}}
    while(i<=m)tmp[k++]=a[i++]; while(j<=r)tmp[k++]=a[j++];
    System.arraycopy(tmp,l,a,l,r-l+1); return inv;
}`,
    },
    recursion: {
      hint: "Recursive merge sort naturally counts inversions during merge step",
      snippet: `// The mergeCount method above IS recursive (calls itself for left/right halves)
// Base case: l>=r returns 0; count inversions during merge`,
    },
    stream: {
      hint: "Merge-sort inversion count is inherently recursive; no stream shortcut",
      snippet: `// O(n^2) brute force with streams:
long inv=IntStream.range(0,a.length).asLongStream().flatMap(i->
    IntStream.range((int)i+1,a.length).filter(j->a[(int)i]>a[j]).asLongStream()).count();`,
    },
  },
  {
    id: 129,
    title: "Find the pair with the maximum product in an array",
    tip: "Sort the array — max product is either last two (largest positives) or first two (most negative × most negative)",
    iteration: {
      hint: "Sort, then compare product of first two vs product of last two",
      snippet: `Arrays.sort(arr);
int n = arr.length;
long opt1 = (long)arr[n-1]*arr[n-2];
long opt2 = (long)arr[0]*arr[1];
long max = Math.max(opt1, opt2);
return new int[]{ max==opt1?arr[n-2]:arr[0], max==opt1?arr[n-1]:arr[1] };`,
    },
    recursion: {
      hint: "Track top two and bottom two values recursively",
      snippet: `void scan(int[]a,int i,int[]mins,int[]maxs){
    if(i==a.length) return;
    if(a[i]<mins[0]){mins[1]=mins[0];mins[0]=a[i];}else if(a[i]<mins[1])mins[1]=a[i];
    if(a[i]>maxs[0]){maxs[1]=maxs[0];maxs[0]=a[i];}else if(a[i]>maxs[1])maxs[1]=a[i];
    scan(a,i+1,mins,maxs);
}`,
    },
    stream: {
      hint: "Sort with stream; compare last two and first two products",
      snippet: `int[] s = IntStream.of(arr).sorted().toArray();
int n=s.length;
return Math.max((long)s[n-1]*s[n-2], (long)s[0]*s[1]) == (long)s[n-1]*s[n-2]
    ? new int[]{s[n-2],s[n-1]} : new int[]{s[0],s[1]};`,
    },
  },
  {
    id: 130,
    title:
      "Rotate a matrix 90 degrees without extra space (in-place, layer by layer)",
    tip: "Process each layer from outside in; four-way swap of top/right/bottom/left positions simultaneously",
    iteration: {
      hint: "For each layer, rotate four elements at a time using temp variable",
      snippet: `for (int layer=0; layer<n/2; layer++) {
    int last=n-1-layer;
    for (int i=layer; i<last; i++) {
        int off=i-layer, tmp=m[layer][i];
        m[layer][i]=m[last-off][layer];
        m[last-off][layer]=m[last][last-off];
        m[last][last-off]=m[i][last];
        m[i][last]=tmp;
    }
}`,
    },
    recursion: {
      hint: "Recurse through each layer, performing the 4-way swap for each cell in the layer",
      snippet: `void rotateLayer(int[][] m, int n, int layer) {
    if (layer >= n/2) return;
    int last=n-1-layer;
    for(int i=layer;i<last;i++){int off=i-layer,t=m[layer][i];m[layer][i]=m[last-off][layer];m[last-off][layer]=m[last][last-off];m[last][last-off]=m[i][last];m[i][last]=t;}
    rotateLayer(m, n, layer+1);
}`,
    },
    stream: {
      hint: "Layer-by-layer swap is inherently imperative; streams don't help here",
      snippet: `// Transpose + row-reverse is equivalent and uses the same two loops
// IntStream.range(0,n/2) can drive the outer layer loop if desired`,
    },
  },
];
