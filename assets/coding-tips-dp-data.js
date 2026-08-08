window.CT_DP = {
  topic: "Dynamic Programming",
  icon: "🧩",
  range: "317–366",
  questions: [
    {
      id: 317,
      title: "Fibonacci with memoization",
      tip: "Cache results in a map/array; bottom-up tabulation is more space-efficient",
      iteration: {
        hint: "Bottom-up: only keep prev two values for O(1) space",
        snippet: `int fib(int n) {
    if (n <= 1) return n;
    int a = 0, b = 1;
    for (int i = 2; i <= n; i++) { int c = a + b; a = b; b = c; }
    return b;
}`,
      },
      recursion: {
        hint: "Top-down: memoize in a map to avoid recomputing subproblems",
        snippet: `Map<Integer,Integer> memo = new HashMap<>();
int fib(int n) {
    if (n <= 1) return n;
    return memo.computeIfAbsent(n, k -> fib(k-1) + fib(k-2));
}`,
      },
      stream: {
        hint: "Stream.iterate generates Fibonacci pairs; limit to n+1 and take last",
        snippet: `long result = Stream.iterate(new long[]{0,1}, f -> new long[]{f[1], f[0]+f[1]})
    .limit(n + 1).map(f -> f[0]).reduce((a, b) -> b).getAsLong();`,
      },
    },
    {
      id: 318,
      title: "Climbing stairs",
      tip: "Same recurrence as Fibonacci: ways(n) = ways(n-1) + ways(n-2); only need last two values",
      iteration: {
        hint: "Rolling variables: a = ways(i-2), b = ways(i-1); update each step",
        snippet: `int climbStairs(int n) {
    if (n <= 2) return n;
    int a = 1, b = 2;
    for (int i = 3; i <= n; i++) { int c = a + b; a = b; b = c; }
    return b;
}`,
      },
      recursion: {
        hint: "Memoize: at each step you can climb 1 or 2 stairs",
        snippet: `int[] memo = new int[n + 1];
int climb(int n) {
    if (n <= 2) return n;
    if (memo[n] != 0) return memo[n];
    return memo[n] = climb(n-1) + climb(n-2);
}`,
      },
      stream: {
        hint: "Stream.iterate over {a,b} pairs, advance n-1 times, return second element",
        snippet: `int result = Stream.iterate(new int[]{1,2}, f -> new int[]{f[1], f[0]+f[1]})
    .limit(n).mapToInt(f -> f[1]).reduce((a,b) -> b).getAsInt();`,
      },
    },
    {
      id: 319,
      title: "House robber",
      tip: "dp[i] = max(dp[i-1], dp[i-2]+nums[i]); reduce to two rolling variables",
      iteration: {
        hint: "Track prev2 and prev1; at each house pick max of skip or rob",
        snippet: `int rob(int[] nums) {
    int prev2 = 0, prev1 = 0;
    for (int num : nums) {
        int curr = Math.max(prev1, prev2 + num);
        prev2 = prev1; prev1 = curr;
    }
    return prev1;
}`,
      },
      recursion: {
        hint: "Memoize: rob(i) = max(rob(i-1), nums[i] + rob(i-2))",
        snippet: `int[] memo = new int[nums.length];
int rob(int i) {
    if (i < 0) return 0;
    if (memo[i] != 0) return memo[i];
    return memo[i] = Math.max(rob(i-1), nums[i] + rob(i-2));
}`,
      },
      stream: {
        hint: "Reduce over array carrying {prev2, prev1} state pair",
        snippet: `int[] res = Arrays.stream(nums).boxed()
    .reduce(new int[]{0,0},
        (s, n) -> new int[]{s[1], Math.max(s[1], s[0]+n)},
        (a,b) -> b);
return res[1];`,
      },
    },
    {
      id: 320,
      title: "House robber II (circular arrangement)",
      tip: "Circular constraint: run linear house robber twice — once skipping first, once skipping last",
      iteration: {
        hint: "Helper runs standard rob on a subarray; call twice and take max",
        snippet: `int rob(int[] nums) {
    int n = nums.length;
    if (n == 1) return nums[0];
    return Math.max(robRange(nums, 0, n-2), robRange(nums, 1, n-1));
}
int robRange(int[] nums, int l, int r) {
    int p2 = 0, p1 = 0;
    for (int i = l; i <= r; i++) { int c = Math.max(p1, p2+nums[i]); p2=p1; p1=c; }
    return p1;
}`,
      },
      recursion: {
        hint: "Memoized helper with start/end bounds; call for [0,n-2] and [1,n-1]",
        snippet: `int rob(int[] nums) {
    int n = nums.length;
    memo = new int[n]; Arrays.fill(memo, -1);
    int a = helper(nums, 0, n-2, 0);
    Arrays.fill(memo, -1);
    return Math.max(a, helper(nums, 1, n-1, 1));
}
int helper(int[] nums, int start, int end, int i) {
    if (i > end) return 0;
    if (memo[i] != -1) return memo[i];
    return memo[i] = Math.max(helper(nums,start,end,i+1), nums[i]+helper(nums,start,end,i+2));
}`,
      },
      stream: {
        hint: "Extract two subarrays as streams, apply rob reduction on each",
        snippet: `IntStream s1 = Arrays.stream(nums, 0, nums.length-1);
IntStream s2 = Arrays.stream(nums, 1, nums.length);
return Math.max(robStream(s1), robStream(s2));
// robStream reduces with {prev2,prev1} accumulator`,
      },
    },
    {
      id: 321,
      title: "Coin change (minimum coins)",
      tip: "dp[amount] = min coins needed; for each coin update dp[j] = min(dp[j], dp[j-coin]+1)",
      iteration: {
        hint: "Fill dp[0..amount]; init to amount+1 (infinity); dp[0]=0",
        snippet: `int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);
    dp[0] = 0;
    for (int coin : coins)
        for (int j = coin; j <= amount; j++)
            dp[j] = Math.min(dp[j], dp[j - coin] + 1);
    return dp[amount] > amount ? -1 : dp[amount];
}`,
      },
      recursion: {
        hint: "Memoize: min coins for remainder; try each coin and recurse",
        snippet: `Map<Integer,Integer> memo = new HashMap<>();
int solve(int[] coins, int rem) {
    if (rem == 0) return 0;
    if (rem < 0 || memo.containsKey(rem)) return memo.getOrDefault(rem, Integer.MAX_VALUE);
    int min = Integer.MAX_VALUE;
    for (int c : coins) { int r = solve(coins, rem-c); if (r != Integer.MAX_VALUE) min = Math.min(min, r+1); }
    return memo.compute(rem, (k,v) -> min);
}`,
      },
      stream: {
        hint: "Iterate amounts 1..amount; for each, stream coins to find min",
        snippet: `int[] dp = new int[amount + 1];
Arrays.fill(dp, amount + 1); dp[0] = 0;
IntStream.rangeClosed(1, amount).forEach(j ->
    Arrays.stream(coins).filter(c -> c <= j)
        .forEach(c -> dp[j] = Math.min(dp[j], dp[j-c]+1)));
return dp[amount] > amount ? -1 : dp[amount];`,
      },
    },
    {
      id: 322,
      title: "Coin change 2 (number of ways)",
      tip: "Iterate coins in outer loop to avoid counting permutations; dp[j] += dp[j-coin]",
      iteration: {
        hint: "Outer loop over coins, inner loop over amounts — ensures combinations not permutations",
        snippet: `int change(int amount, int[] coins) {
    int[] dp = new int[amount + 1];
    dp[0] = 1;
    for (int coin : coins)
        for (int j = coin; j <= amount; j++)
            dp[j] += dp[j - coin];
    return dp[amount];
}`,
      },
      recursion: {
        hint: "Memoize on (index, remaining amount) to avoid recomputation",
        snippet: `Map<String,Integer> memo = new HashMap<>();
int ways(int[] coins, int idx, int rem) {
    if (rem == 0) return 1;
    if (rem < 0 || idx == coins.length) return 0;
    String key = idx + "," + rem;
    return memo.computeIfAbsent(key, k ->
        ways(coins, idx+1, rem) + ways(coins, idx, rem-coins[idx]));
}`,
      },
      stream: {
        hint: "Stream over coins, sequentially updating dp array per coin",
        snippet: `int[] dp = new int[amount + 1]; dp[0] = 1;
Arrays.stream(coins).forEach(coin ->
    IntStream.rangeClosed(coin, amount)
        .forEach(j -> dp[j] += dp[j - coin]));
return dp[amount];`,
      },
    },
    {
      id: 323,
      title: "Longest increasing subsequence",
      tip: "O(n log n) with patience sorting (binary search on tails[]); O(n²) dp also common",
      iteration: {
        hint: "tails[] array: binary search for position to place each element",
        snippet: `int lengthOfLIS(int[] nums) {
    int[] tails = new int[nums.length];
    int size = 0;
    for (int n : nums) {
        int lo = 0, hi = size;
        while (lo < hi) { int mid=(lo+hi)/2; if (tails[mid]<n) lo=mid+1; else hi=mid; }
        tails[lo] = n; if (lo == size) size++;
    }
    return size;
}`,
      },
      recursion: {
        hint: "Memoize on index and previous element index; try extending or skipping",
        snippet: `int[][] memo = new int[n][n+1];
int lis(int[] nums, int i, int prev) {
    if (i == nums.length) return 0;
    if (memo[i][prev+1] != 0) return memo[i][prev+1];
    int skip = lis(nums, i+1, prev);
    int take = (prev < 0 || nums[i] > nums[prev]) ? 1 + lis(nums, i+1, i) : 0;
    return memo[i][prev+1] = Math.max(skip, take);
}`,
      },
      stream: {
        hint: "Build dp[] with O(n²); stream reduce to find max",
        snippet: `int[] dp = new int[nums.length];
Arrays.fill(dp, 1);
for (int i = 1; i < nums.length; i++)
    for (int j = 0; j < i; j++)
        if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j]+1);
return Arrays.stream(dp).max().getAsInt();`,
      },
    },
    {
      id: 324,
      title: "Longest common subsequence",
      tip: "dp[i][j]: LCS of s1[0..i-1] and s2[0..j-1]; match adds 1, else take max of neighbors",
      iteration: {
        hint: "Fill 2D table row by row; can compress to two 1D arrays",
        snippet: `int lcs(String a, String b) {
    int m = a.length(), n = b.length();
    int[][] dp = new int[m+1][n+1];
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            dp[i][j] = a.charAt(i-1)==b.charAt(j-1) ? dp[i-1][j-1]+1
                      : Math.max(dp[i-1][j], dp[i][j-1]);
    return dp[m][n];
}`,
      },
      recursion: {
        hint: "Memoize on (i,j): if chars match, recurse with both decremented",
        snippet: `int[][] memo = new int[m+1][n+1];
int lcs(String a, String b, int i, int j) {
    if (i==0 || j==0) return 0;
    if (memo[i][j] != 0) return memo[i][j];
    return memo[i][j] = a.charAt(i-1)==b.charAt(j-1)
        ? 1 + lcs(a,b,i-1,j-1) : Math.max(lcs(a,b,i-1,j), lcs(a,b,i,j-1));
}`,
      },
      stream: {
        hint: "Row-by-row update; stream each row with IntStream over columns",
        snippet: `int[] prev = new int[n+1];
for (char ca : a.toCharArray()) {
    int[] curr = new int[n+1]; int j = 1;
    for (char cb : b.toCharArray())
        curr[j] = ca==cb ? prev[j-1]+1 : Math.max(prev[j], curr[j-1]);
    prev = curr;
}
return prev[n];`,
      },
    },
    {
      id: 325,
      title: "Edit distance",
      tip: "dp[i][j] = min ops to convert word1[0..i] to word2[0..j]; match=0 cost, else 1+min(insert,delete,replace)",
      iteration: {
        hint: "Standard 2D DP; compress to two rows since only prev row is needed",
        snippet: `int editDistance(String a, String b) {
    int m=a.length(), n=b.length();
    int[] dp = IntStream.rangeClosed(0,n).toArray();
    for (int i = 1; i <= m; i++) {
        int prev = dp[0]; dp[0] = i;
        for (int j = 1; j <= n; j++) {
            int tmp = dp[j];
            dp[j] = a.charAt(i-1)==b.charAt(j-1) ? prev : 1+Math.min(prev, Math.min(dp[j], dp[j-1]));
            prev = tmp;
        }
    }
    return dp[n];
}`,
      },
      recursion: {
        hint: "Memoize on (i,j): match costs 0; insert/delete/replace each cost 1",
        snippet: `int[][] memo = new int[m+1][n+1];
int ed(String a, String b, int i, int j) {
    if (i==0) return j; if (j==0) return i;
    if (memo[i][j] != 0) return memo[i][j];
    return memo[i][j] = a.charAt(i-1)==b.charAt(j-1) ? ed(a,b,i-1,j-1)
        : 1+Math.min(ed(a,b,i-1,j), Math.min(ed(a,b,i,j-1), ed(a,b,i-1,j-1)));
}`,
      },
      stream: {
        hint: "Fold over characters of word1, updating dp[] array each iteration",
        snippet: `int[] dp = IntStream.rangeClosed(0, b.length()).toArray();
for (char ca : a.toCharArray()) {
    final int[] row = new int[b.length()+1]; row[0] = dp[0]+1; int p = dp[0];
    IntStream.rangeClosed(1, b.length()).forEach(j -> {
        int tmp = dp[j]; row[j] = ca==b.charAt(j-1) ? p : 1+Math.min(p, Math.min(dp[j], row[j-1]));
    });
    System.arraycopy(row, 0, dp, 0, dp.length);
}
return dp[b.length()];`,
      },
    },
    {
      id: 326,
      title: "0/1 Knapsack",
      tip: "Traverse capacity in reverse so each item is used at most once; dp[j] = max(dp[j], dp[j-w]+v)",
      iteration: {
        hint: "Single 1D dp array; inner loop goes right-to-left to prevent reuse",
        snippet: `int knapsack(int[] w, int[] v, int W) {
    int[] dp = new int[W + 1];
    for (int i = 0; i < w.length; i++)
        for (int j = W; j >= w[i]; j--)
            dp[j] = Math.max(dp[j], dp[j - w[i]] + v[i]);
    return dp[W];
}`,
      },
      recursion: {
        hint: "Memoize on (item index, remaining capacity): pick or skip each item",
        snippet: `int[][] memo = new int[n][W+1];
int ks(int[] w, int[] v, int i, int cap) {
    if (i == w.length || cap == 0) return 0;
    if (memo[i][cap] != 0) return memo[i][cap];
    int skip = ks(w, v, i+1, cap);
    int take = cap>=w[i] ? v[i]+ks(w,v,i+1,cap-w[i]) : 0;
    return memo[i][cap] = Math.max(skip, take);
}`,
      },
      stream: {
        hint: "Stream over items; for each item reduce dp[] right-to-left",
        snippet: `int[] dp = new int[W + 1];
IntStream.range(0, w.length).forEach(i ->
    IntStream.iterate(W, j -> j >= w[i], j -> j-1)
        .forEach(j -> dp[j] = Math.max(dp[j], dp[j-w[i]] + v[i])));
return dp[W];`,
      },
    },
    {
      id: 327,
      title: "Unbounded knapsack",
      tip: "Same as 0/1 knapsack but inner loop goes left-to-right, allowing item reuse",
      iteration: {
        hint: "Forward inner loop: dp[j] = max(dp[j], dp[j-w[i]]+v[i]) with reuse allowed",
        snippet: `int unboundedKnapsack(int[] w, int[] v, int W) {
    int[] dp = new int[W + 1];
    for (int i = 0; i < w.length; i++)
        for (int j = w[i]; j <= W; j++)
            dp[j] = Math.max(dp[j], dp[j - w[i]] + v[i]);
    return dp[W];
}`,
      },
      recursion: {
        hint: "When taking item i, recurse with same i (not i+1) to allow reuse",
        snippet: `Map<Integer,Integer> memo = new HashMap<>();
int ks(int[] w, int[] v, int i, int cap) {
    if (i == w.length || cap == 0) return 0;
    String key = i+","+cap;
    return memo.computeIfAbsent(i*10001+cap, k -> {
        int skip = ks(w,v,i+1,cap);
        int take = cap>=w[i] ? v[i]+ks(w,v,i,cap-w[i]) : 0;
        return Math.max(skip, take);
    });
}`,
      },
      stream: {
        hint: "Stream over items with left-to-right capacity update",
        snippet: `int[] dp = new int[W + 1];
IntStream.range(0, w.length).forEach(i ->
    IntStream.rangeClosed(w[i], W)
        .forEach(j -> dp[j] = Math.max(dp[j], dp[j-w[i]] + v[i])));
return dp[W];`,
      },
    },
    {
      id: 328,
      title: "Subset sum",
      tip: "Boolean dp[j]: can we reach sum j? Reverse inner loop for 0/1 inclusion",
      iteration: {
        hint: "dp[0]=true; for each num reverse-traverse and set dp[j] |= dp[j-num]",
        snippet: `boolean subsetSum(int[] nums, int target) {
    boolean[] dp = new boolean[target + 1];
    dp[0] = true;
    for (int num : nums)
        for (int j = target; j >= num; j--)
            dp[j] |= dp[j - num];
    return dp[target];
}`,
      },
      recursion: {
        hint: "Memoize on (index, remaining sum): include or exclude current element",
        snippet: `Map<String,Boolean> memo = new HashMap<>();
boolean can(int[] nums, int i, int rem) {
    if (rem == 0) return true;
    if (rem < 0 || i == nums.length) return false;
    String k = i+","+rem;
    return memo.computeIfAbsent(k, x -> can(nums,i+1,rem) || can(nums,i+1,rem-nums[i]));
}`,
      },
      stream: {
        hint: "Use BitSet: shift left by each num and OR into itself",
        snippet: `boolean subsetSum(int[] nums, int target) {
    BitSet bs = new BitSet(target + 1);
    bs.set(0);
    for (int n : nums) bs.or((BitSet) bs.clone() << n); // conceptual
    return bs.get(target); // use manual BitSet shift in practice
}`,
      },
    },
    {
      id: 329,
      title: "Partition equal subset sum",
      tip: "Reduce to subset sum: target = totalSum/2; if odd sum return false immediately",
      iteration: {
        hint: "dp boolean array of size sum/2+1; reverse inner loop",
        snippet: `boolean canPartition(int[] nums) {
    int sum = Arrays.stream(nums).sum();
    if (sum % 2 != 0) return false;
    int target = sum / 2;
    boolean[] dp = new boolean[target + 1]; dp[0] = true;
    for (int n : nums)
        for (int j = target; j >= n; j--)
            dp[j] |= dp[j - n];
    return dp[target];
}`,
      },
      recursion: {
        hint: "Memoize on (index, remaining); target is sum/2",
        snippet: `boolean[][] memo = new boolean[n][target+1];
boolean solve(int[] nums, int i, int rem) {
    if (rem == 0) return true;
    if (rem < 0 || i == nums.length) return false;
    if (memo[i][rem]) return false; // visited as false
    boolean res = solve(nums,i+1,rem) || solve(nums,i+1,rem-nums[i]);
    if (!res) memo[i][rem] = true;
    return res;
}`,
      },
      stream: {
        hint: "Accumulate reachable sums using a Set; check if target is reachable",
        snippet: `Set<Integer> reachable = new HashSet<>(); reachable.add(0);
int target = Arrays.stream(nums).sum() / 2;
for (int n : nums)
    reachable.addAll(reachable.stream().map(s -> s+n)
        .filter(s -> s <= target).collect(Collectors.toSet()));
return reachable.contains(target);`,
      },
    },
    {
      id: 330,
      title: "Minimum path sum in a grid",
      tip: "dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]); can reuse grid in-place",
      iteration: {
        hint: "Update grid in-place: first row/col are prefix sums; then fill rest",
        snippet: `int minPathSum(int[][] g) {
    int m=g.length, n=g[0].length;
    for (int i=1;i<m;i++) g[i][0]+=g[i-1][0];
    for (int j=1;j<n;j++) g[0][j]+=g[0][j-1];
    for (int i=1;i<m;i++)
        for (int j=1;j<n;j++)
            g[i][j]+=Math.min(g[i-1][j],g[i][j-1]);
    return g[m-1][n-1];
}`,
      },
      recursion: {
        hint: "Memoize (i,j): cost = grid[i][j] + min(up, left)",
        snippet: `int[][] memo = new int[m][n];
int minPath(int[][] g, int i, int j) {
    if (i==0 && j==0) return g[0][0];
    if (memo[i][j] != 0) return memo[i][j];
    int up = i>0 ? minPath(g,i-1,j) : Integer.MAX_VALUE;
    int left = j>0 ? minPath(g,i,j-1) : Integer.MAX_VALUE;
    return memo[i][j] = g[i][j] + Math.min(up, left);
}`,
      },
      stream: {
        hint: "Process row by row; use IntStream to update each cell in a row",
        snippet: `int[] dp = new int[g[0].length];
for (int i=0; i<g.length; i++) {
    if (i==0) dp[0]=g[0][0]; else dp[0]+=g[i][0];
    IntStream.range(1, g[0].length).forEach(j ->
        dp[j] = g[i][j] + (i==0 ? dp[j-1] : Math.min(dp[j], dp[j-1])));
}
return dp[g[0].length-1];`,
      },
    },
    {
      id: 331,
      title: "Unique paths",
      tip: "dp[j] += dp[j-1] collapses 2D table to 1D; or use combinatorics C(m+n-2, m-1)",
      iteration: {
        hint: "1D dp: init all 1s, then for each row accumulate from left",
        snippet: `int uniquePaths(int m, int n) {
    int[] dp = new int[n];
    Arrays.fill(dp, 1);
    for (int i = 1; i < m; i++)
        for (int j = 1; j < n; j++)
            dp[j] += dp[j - 1];
    return dp[n - 1];
}`,
      },
      recursion: {
        hint: "Memoize (i,j): paths = paths(i-1,j) + paths(i,j-1)",
        snippet: `int[][] memo = new int[m][n];
int paths(int i, int j) {
    if (i==0 || j==0) return 1;
    if (memo[i][j] != 0) return memo[i][j];
    return memo[i][j] = paths(i-1,j) + paths(i,j-1);
}`,
      },
      stream: {
        hint: "Combinatorics: C(m+n-2, m-1) using stream reduction",
        snippet: `long uniquePaths(int m, int n) {
    int N = m + n - 2, r = Math.min(m-1, n-1);
    return LongStream.rangeClosed(1, r)
        .reduce(1L, (acc, i) -> acc * (N - r + i) / i);
}`,
      },
    },
    {
      id: 332,
      title: "Unique paths II (with obstacles)",
      tip: "Same as unique paths but set dp[j]=0 when obstacle is encountered",
      iteration: {
        hint: "Skip cell (set dp to 0) if grid has obstacle; else accumulate from left/above",
        snippet: `int uniquePathsWithObstacles(int[][] g) {
    int n = g[0].length;
    int[] dp = new int[n];
    dp[0] = g[0][0] == 1 ? 0 : 1;
    for (int[] row : g)
        for (int j = 0; j < n; j++)
            if (row[j] == 1) dp[j] = 0;
            else if (j > 0) dp[j] += dp[j-1];
    return dp[n-1];
}`,
      },
      recursion: {
        hint: "Memoize (i,j): return 0 if obstacle; else sum from top and left",
        snippet: `int[][] memo = new int[m][n];
int paths(int[][] g, int i, int j) {
    if (i<0||j<0||g[i][j]==1) return 0;
    if (i==0 && j==0) return 1;
    if (memo[i][j] != 0) return memo[i][j];
    return memo[i][j] = paths(g,i-1,j) + paths(g,i,j-1);
}`,
      },
      stream: {
        hint: "Stream rows, update dp[] skipping obstacle cells",
        snippet: `int[] dp = new int[g[0].length];
dp[0] = 1;
Arrays.stream(g).forEach(row -> {
    if (row[0] == 1) dp[0] = 0;
    IntStream.range(1, row.length)
        .forEach(j -> dp[j] = row[j]==1 ? 0 : dp[j]+dp[j-1]);
});
return dp[g[0].length-1];`,
      },
    },
    {
      id: 333,
      title: "Palindrome partitioning (minimum cuts)",
      tip: "Precompute isPalin[i][j]; dp[i] = min cuts for s[0..i]; dp[i]=min(dp[j-1]+1) for all j where isPalin[j][i]",
      iteration: {
        hint: "Build isPalin table with expand-around-center, then fill cuts[] array",
        snippet: `int minCut(String s) {
    int n=s.length(); boolean[][] p=new boolean[n][n]; int[] dp=new int[n];
    for(int i=0;i<n;i++) { dp[i]=i;
        for(int j=0;j<=i;j++)
            if(s.charAt(j)==s.charAt(i)&&(i-j<=2||p[j+1][i-1])){
                p[j][i]=true; dp[i]=j==0?0:Math.min(dp[i],dp[j-1]+1); } }
    return dp[n-1];
}`,
      },
      recursion: {
        hint: "Memoize minCuts(i): try all palindrome prefixes starting at i",
        snippet: `int[] memo = new int[n];
boolean[][] isPalin = precompute(s);
int minCut(String s, int i) {
    if (i == s.length()) return -1;
    if (memo[i] != 0) return memo[i];
    int min = Integer.MAX_VALUE;
    for (int j=i; j<s.length(); j++)
        if (isPalin[i][j]) min=Math.min(min, 1+minCut(s,j+1));
    return memo[i] = min;
}`,
      },
      stream: {
        hint: "Stream positions; for each, check all palindromic prefixes via filter",
        snippet: `int[] dp = new int[n]; Arrays.fill(dp, Integer.MAX_VALUE); dp[0]=0;
IntStream.range(1,n).forEach(i ->
    dp[i] = 1 + IntStream.rangeClosed(0, i)
        .filter(j -> isPalin[j][i])
        .map(j -> j==0 ? -1 : dp[j-1]).min().getAsInt());
return dp[n-1];`,
      },
    },
    {
      id: 334,
      title: "Word break",
      tip: "dp[i]=true if s[0..i-1] can be segmented; check all j where dp[j] && dict contains s[j..i-1]",
      iteration: {
        hint: "Boolean dp[]; for each end i, try all split points j where dp[j] is true",
        snippet: `boolean wordBreak(String s, List<String> dict) {
    Set<String> set = new HashSet<>(dict);
    boolean[] dp = new boolean[s.length() + 1]; dp[0] = true;
    for (int i = 1; i <= s.length(); i++)
        for (int j = 0; j < i; j++)
            if (dp[j] && set.contains(s.substring(j, i))) { dp[i]=true; break; }
    return dp[s.length()];
}`,
      },
      recursion: {
        hint: "Memoize can-break(i): try each word from dict starting at i",
        snippet: `Boolean[] memo = new Boolean[s.length()];
boolean solve(String s, Set<String> dict, int i) {
    if (i == s.length()) return true;
    if (memo[i] != null) return memo[i];
    for (int j=i+1; j<=s.length(); j++)
        if (dict.contains(s.substring(i,j)) && solve(s,dict,j)) return memo[i]=true;
    return memo[i] = false;
}`,
      },
      stream: {
        hint: "Stream end positions; use anyMatch to find valid split with dict lookup",
        snippet: `boolean[] dp = new boolean[s.length()+1]; dp[0]=true;
Set<String> set = new HashSet<>(dict);
IntStream.rangeClosed(1, s.length()).forEach(i ->
    dp[i] = IntStream.range(0,i)
        .anyMatch(j -> dp[j] && set.contains(s.substring(j,i))));
return dp[s.length()];`,
      },
    },
    {
      id: 335,
      title: "Decode ways",
      tip: "dp[i] = ways to decode s[0..i-1]; valid single digit or valid two-digit both contribute",
      iteration: {
        hint: "dp[0]=1 (empty), dp[1] depends on s[0] != '0'; add dp[i-1] and dp[i-2] when valid",
        snippet: `int numDecodings(String s) {
    int n=s.length(); int[] dp=new int[n+1]; dp[0]=1;
    dp[1] = s.charAt(0)=='0' ? 0 : 1;
    for (int i=2; i<=n; i++) {
        if (s.charAt(i-1)!='0') dp[i]+=dp[i-1];
        int two=Integer.parseInt(s.substring(i-2,i));
        if (two>=10&&two<=26) dp[i]+=dp[i-2];
    }
    return dp[n];
}`,
      },
      recursion: {
        hint: "Memoize decode(i): count ways from position i to end",
        snippet: `int[] memo = new int[s.length()+1];
int decode(String s, int i) {
    if (i == s.length()) return 1;
    if (s.charAt(i) == '0' || memo[i] != 0) return memo[i];
    int ways = decode(s, i+1);
    if (i+1<s.length()) { int two=Integer.parseInt(s.substring(i,i+2)); if(two<=26) ways+=decode(s,i+2); }
    return memo[i] = ways;
}`,
      },
      stream: {
        hint: "Reduce over characters, maintaining {dp_i_minus_2, dp_i_minus_1} pair",
        snippet: `// O(1) space rolling with explicit tracking
int a=1, b=s.charAt(0)!='0'?1:0;
for (int i=2; i<=s.length(); i++) {
    int c=0; if(s.charAt(i-1)!='0') c+=b;
    int t=Integer.parseInt(s.substring(i-2,i)); if(t>=10&&t<=26) c+=a;
    a=b; b=c;
}
return b;`,
      },
    },
    {
      id: 336,
      title: "Maximal square (largest square of 1s in a matrix)",
      tip: "dp[i][j] = side of largest square ending at (i,j); = min(left, top, diag) + 1 if cell is '1'",
      iteration: {
        hint: "Reuse matrix or 1D rolling array; track global max side",
        snippet: `int maximalSquare(char[][] m) {
    int rows=m.length, cols=m[0].length, max=0;
    int[] dp = new int[cols+1];
    for (char[] row : m) {
        int prev=0;
        for (int j=1; j<=cols; j++) {
            int tmp=dp[j];
            dp[j]=row[j-1]=='1'?Math.min(prev,Math.min(dp[j],dp[j-1]))+1:0;
            max=Math.max(max,dp[j]); prev=tmp;
        }
    }
    return max*max;
}`,
      },
      recursion: {
        hint: "Memoize (i,j): if '1', take min of three neighbors + 1",
        snippet: `int[][] memo = new int[m.length][m[0].length];
int sq(char[][] m, int i, int j) {
    if (i<0||j<0||m[i][j]=='0') return 0;
    if (memo[i][j] != 0) return memo[i][j];
    return memo[i][j] = Math.min(sq(m,i-1,j), Math.min(sq(m,i,j-1), sq(m,i-1,j-1))) + 1;
}`,
      },
      stream: {
        hint: "Process each row as a stream, accumulate dp and track max",
        snippet: `int[] dp = new int[m[0].length+1]; int[] max = {0};
for (char[] row : m) {
    int[] next = new int[dp.length]; int[] prev = {0};
    IntStream.range(1, dp.length).forEach(j -> {
        next[j] = row[j-1]=='1'?Math.min(prev[0],Math.min(dp[j],dp[j-1]))+1:0;
        max[0]=Math.max(max[0],next[j]); prev[0]=dp[j];
    });
    System.arraycopy(next,0,dp,0,dp.length);
}
return max[0]*max[0];`,
      },
    },
    {
      id: 337,
      title: "Maximal rectangle",
      tip: "Extend maximal square: build histogram row by row, then apply largest-rectangle-in-histogram using stack",
      iteration: {
        hint: "Heights array updated per row; for each row run largest-rect-in-histogram with stack",
        snippet: `int maximalRectangle(char[][] m) {
    int n=m[0].length, max=0; int[] h=new int[n];
    for (char[] row : m) {
        for (int j=0;j<n;j++) h[j]=row[j]=='1'?h[j]+1:0;
        max=Math.max(max, largestRect(h));
    }
    return max;
}
int largestRect(int[] h) {
    Deque<Integer> st=new ArrayDeque<>(); int max=0;
    for (int i=0;i<=h.length;i++) {
        int cur=i==h.length?0:h[i];
        while(!st.isEmpty()&&h[st.peek()]>cur){int idx=st.pop();max=Math.max(max,h[idx]*(st.isEmpty()?i:i-st.peek()-1));}
        st.push(i);
    }
    return max;
}`,
      },
      recursion: {
        hint: "Recursively compute LIS-style dp for each row's histogram heights",
        snippet: `// DP-based: for each row, dp[j][k] = max rect of height k ending at col j
// Standard approach uses heights[] + monotonic stack per row (no pure recursion)
// Use iteration with largestRect helper (see iteration tab)`,
      },
      stream: {
        hint: "Stream rows to update heights, then apply histogram max on each",
        snippet: `int[] h = new int[m[0].length];
return Arrays.stream(m).mapToInt(row -> {
    IntStream.range(0, h.length).forEach(j -> h[j] = row[j]=='1' ? h[j]+1 : 0);
    return largestRect(h.clone());
}).max().getAsInt();`,
      },
    },
    {
      id: 338,
      title: "Burst balloons",
      tip: "Interval DP: dp[i][j] = max coins for balloons (i..j); pick k last to burst in interval",
      iteration: {
        hint: "Fill by increasing interval length; add padding 1s at both ends",
        snippet: `int maxCoins(int[] nums) {
    int n=nums.length; int[] a=new int[n+2]; a[0]=a[n+1]=1;
    for(int i=0;i<n;i++) a[i+1]=nums[i];
    int[][] dp=new int[n+2][n+2];
    for(int len=1;len<=n;len++)
        for(int i=1;i<=n-len+1;i++) { int j=i+len-1;
            for(int k=i;k<=j;k++)
                dp[i][j]=Math.max(dp[i][j],a[i-1]*a[k]*a[j+1]+dp[i][k-1]+dp[k+1][j]); }
    return dp[1][n];
}`,
      },
      recursion: {
        hint: "Memoize (i,j): try each k as the last balloon in [i..j]",
        snippet: `int[][] memo = new int[n+2][n+2];
int burst(int[] a, int i, int j) {
    if (i > j) return 0;
    if (memo[i][j] != 0) return memo[i][j];
    for (int k=i; k<=j; k++)
        memo[i][j]=Math.max(memo[i][j], a[i-1]*a[k]*a[j+1]+burst(a,i,k-1)+burst(a,k+1,j));
    return memo[i][j];
}`,
      },
      stream: {
        hint: "Interval DP — not naturally streaming; use same table but compute lengths via stream",
        snippet: `IntStream.rangeClosed(1, n).forEach(len ->
    IntStream.rangeClosed(1, n-len+1).forEach(i -> {
        int j=i+len-1;
        IntStream.rangeClosed(i,j).forEach(k ->
            dp[i][j]=Math.max(dp[i][j], a[i-1]*a[k]*a[j+1]+dp[i][k-1]+dp[k+1][j]));
    }));
return dp[1][n];`,
      },
    },
    {
      id: 339,
      title: "Matrix chain multiplication",
      tip: "Interval DP: dp[i][j] = min multiplications; try each split k in [i..j-1]",
      iteration: {
        hint: "Fill diagonally by chain length; dp[i][j]=min(dp[i][k]+dp[k+1][j]+p[i-1]*p[k]*p[j])",
        snippet: `int matrixChain(int[] p) {
    int n=p.length-1; int[][] dp=new int[n+1][n+1];
    for(int len=2;len<=n;len++)
        for(int i=1;i<=n-len+1;i++) { int j=i+len-1; dp[i][j]=Integer.MAX_VALUE;
            for(int k=i;k<j;k++)
                dp[i][j]=Math.min(dp[i][j],dp[i][k]+dp[k+1][j]+p[i-1]*p[k]*p[j]); }
    return dp[1][n];
}`,
      },
      recursion: {
        hint: "Memoize (i,j): try all split points k; base case i==j returns 0",
        snippet: `int[][] memo = new int[n+1][n+1];
int mcm(int[] p, int i, int j) {
    if (i==j) return 0;
    if (memo[i][j] != 0) return memo[i][j];
    memo[i][j]=Integer.MAX_VALUE;
    for (int k=i;k<j;k++)
        memo[i][j]=Math.min(memo[i][j],mcm(p,i,k)+mcm(p,k+1,j)+p[i-1]*p[k]*p[j]);
    return memo[i][j];
}`,
      },
      stream: {
        hint: "Stream over chain lengths and start positions to fill dp table",
        snippet: `IntStream.rangeClosed(2, n).forEach(len ->
    IntStream.rangeClosed(1, n-len+1).forEach(i -> {
        int j=i+len-1; dp[i][j]=Integer.MAX_VALUE;
        IntStream.range(i,j).forEach(k ->
            dp[i][j]=Math.min(dp[i][j], dp[i][k]+dp[k+1][j]+p[i-1]*p[k]*p[j]));
    }));
return dp[1][n];`,
      },
    },
    {
      id: 340,
      title: "Rod cutting problem",
      tip: "Unbounded knapsack: dp[j] = max revenue for rod of length j; try all cut lengths",
      iteration: {
        hint: "dp[j] = max over all cut lengths i of (price[i] + dp[j-i])",
        snippet: `int cutRod(int[] price, int n) {
    int[] dp = new int[n + 1];
    for (int j = 1; j <= n; j++)
        for (int i = 1; i <= j; i++)
            dp[j] = Math.max(dp[j], price[i-1] + dp[j-i]);
    return dp[n];
}`,
      },
      recursion: {
        hint: "Memoize cut(n): try each cut length from 1 to n",
        snippet: `int[] memo = new int[n+1];
int cut(int[] p, int n) {
    if (n==0) return 0;
    if (memo[n]!=0) return memo[n];
    int max=0;
    for (int i=1;i<=n;i++) max=Math.max(max, p[i-1]+cut(p,n-i));
    return memo[n]=max;
}`,
      },
      stream: {
        hint: "Stream over lengths; for each length, stream cuts to find max revenue",
        snippet: `int[] dp = new int[n+1];
IntStream.rangeClosed(1, n).forEach(j ->
    dp[j] = IntStream.rangeClosed(1, j)
        .map(i -> price[i-1] + dp[j-i])
        .max().getAsInt());
return dp[n];`,
      },
    },
    {
      id: 341,
      title: "Egg dropping problem",
      tip: "dp[e][f]=min trials; or reverse: with e eggs and t trials, max floors checkable = dp[t-1][e-1]+dp[t-1][e]+1",
      iteration: {
        hint: "Reverse DP: dp[t][e]=floors checkable with t trials and e eggs; find min t where dp[t][E]>=N",
        snippet: `int eggDrop(int eggs, int floors) {
    int[][] dp = new int[floors+1][eggs+1];
    int t = 0;
    while (dp[t][eggs] < floors) {
        t++;
        for (int e=1; e<=eggs; e++)
            dp[t][e] = dp[t-1][e-1] + dp[t-1][e] + 1;
    }
    return t;
}`,
      },
      recursion: {
        hint: "Memoize (e,f): min of (1 + max(drop breaks, drop survives)) over all floors",
        snippet: `int[][] memo = new int[eggs+1][floors+1];
int drop(int e, int f) {
    if (e==1||f<=1) return f;
    if (memo[e][f]!=0) return memo[e][f];
    int min=Integer.MAX_VALUE;
    for (int x=1;x<=f;x++) min=Math.min(min,1+Math.max(drop(e-1,x-1),drop(e,f-x)));
    return memo[e][f]=min;
}`,
      },
      stream: {
        hint: "Binary search optimization in loop: use IntStream for trial counting",
        snippet: `// With binary search on floors per trial:
int[] dp = new int[eggs+1]; int t=0;
while (dp[eggs] < floors) {
    t++;
    for (int e=eggs; e>1; e--) dp[e]+=dp[e-1]+1;
    dp[1]++;
}
return t;`,
      },
    },
    {
      id: 342,
      title: "Paint house",
      tip: "dp[i][c] = min cost to paint house i with color c; can't use same color as previous house",
      iteration: {
        hint: "Three colors: for each house, take min of the two other colors from previous house",
        snippet: `int minCost(int[][] costs) {
    int r=costs[0][0], g=costs[0][1], b=costs[0][2];
    for (int i=1; i<costs.length; i++) {
        int nr=costs[i][0]+Math.min(g,b);
        int ng=costs[i][1]+Math.min(r,b);
        int nb=costs[i][2]+Math.min(r,g);
        r=nr; g=ng; b=nb;
    }
    return Math.min(r,Math.min(g,b));
}`,
      },
      recursion: {
        hint: "Memoize (house, color): cost[i][c] + min of the other two colors from i+1",
        snippet: `int[][] memo = new int[n][3];
int paint(int[][] costs, int i, int c) {
    if (i==costs.length) return 0;
    if (memo[i][c]!=0) return memo[i][c];
    int next=IntStream.range(0,3).filter(x->x!=c).map(x->paint(costs,i+1,x)).min().getAsInt();
    return memo[i][c]=costs[i][c]+next;
}`,
      },
      stream: {
        hint: "Reduce over houses; each step maps {r,g,b} to new minimums",
        snippet: `int[] res = Arrays.stream(costs).reduce(new int[]{0,0,0},
    (prev, c) -> new int[]{
        c[0]+Math.min(prev[1],prev[2]),
        c[1]+Math.min(prev[0],prev[2]),
        c[2]+Math.min(prev[0],prev[1])});
return Math.min(res[0],Math.min(res[1],res[2]));`,
      },
    },
    {
      id: 343,
      title: "Paint fence",
      tip: "Track same=ways ending with two same colors, diff=ways ending with different; update each step",
      iteration: {
        hint: "same = prev_diff; diff = (same+diff)*(k-1) at each post beyond the first",
        snippet: `int numWays(int n, int k) {
    if (n==0) return 0; if (n==1) return k;
    int same=k, diff=k*(k-1);
    for (int i=3; i<=n; i++) {
        int newSame=diff;
        int newDiff=(same+diff)*(k-1);
        same=newSame; diff=newDiff;
    }
    return same+diff;
}`,
      },
      recursion: {
        hint: "Memoize ways(i, lastTwo): branch on same or different color from previous",
        snippet: `// Simplify: f(n)=(k-1)*(f(n-1)+f(n-2)); memoize by n
int[] memo = new int[n+1];
int ways(int n, int k) {
    if (n<=2) return n==1?k:k*k;
    if (memo[n]!=0) return memo[n];
    return memo[n]=(k-1)*(ways(n-1,k)+ways(n-2,k));
}`,
      },
      stream: {
        hint: "Stream.iterate over {same,diff} pairs, advance n-2 times",
        snippet: `long[] res = Stream.iterate(new long[]{k, (long)k*(k-1)},
    p -> new long[]{p[1], (p[0]+p[1])*(k-1)})
    .limit(n-1).reduce((a,b)->b).get();
return (int)(res[0]+res[1]);`,
      },
    },
    {
      id: 344,
      title: "Dungeon game",
      tip: "Fill dp from bottom-right to top-left; dp[i][j]=health needed entering (i,j) to survive",
      iteration: {
        hint: "dp[i][j]=max(1, min(right,down)-dungeon[i][j]); base case bottom-right",
        snippet: `int calculateMinimumHP(int[][] d) {
    int m=d.length, n=d[0].length;
    int[][] dp=new int[m+1][n+1];
    for(int[] row:dp) Arrays.fill(row,Integer.MAX_VALUE);
    dp[m][n-1]=dp[m-1][n]=1;
    for(int i=m-1;i>=0;i--)
        for(int j=n-1;j>=0;j--)
            dp[i][j]=Math.max(1,Math.min(dp[i+1][j],dp[i][j+1])-d[i][j]);
    return dp[0][0];
}`,
      },
      recursion: {
        hint: "Memoize min health needed at (i,j); go right or down, take min",
        snippet: `int[][] memo = new int[m][n];
int minHP(int[][] d, int i, int j) {
    if (i==m||j==n) return Integer.MAX_VALUE;
    if (i==m-1&&j==n-1) return Math.max(1, 1-d[i][j]);
    if (memo[i][j]!=0) return memo[i][j];
    int need=Math.min(minHP(d,i+1,j),minHP(d,i,j+1))-d[i][j];
    return memo[i][j]=Math.max(1,need);
}`,
      },
      stream: {
        hint: "Process rows bottom-up; use IntStream to fill each row right-to-left",
        snippet: `int[] dp = new int[n+1]; Arrays.fill(dp, Integer.MAX_VALUE); dp[n-1]=1;
IntStream.iterate(m-1, i->i>=0, i->i-1).forEach(i ->
    IntStream.iterate(n-1, j->j>=0, j->j-1).forEach(j ->
        dp[j] = Math.max(1, Math.min(j+1<n?dp[j+1]:Integer.MAX_VALUE, dp[j])-d[i][j])));
return dp[0];`,
      },
    },
    {
      id: 345,
      title: "Distinct subsequences",
      tip: "dp[i][j] = number of ways s[0..i-1] contains t[0..j-1] as subsequence",
      iteration: {
        hint: "If chars match: dp[i][j]=dp[i-1][j-1]+dp[i-1][j]; else dp[i][j]=dp[i-1][j]",
        snippet: `int numDistinct(String s, String t) {
    int m=s.length(), n=t.length();
    long[] dp=new long[n+1]; dp[0]=1;
    for (char cs:s.toCharArray()) {
        for (int j=n; j>=1; j--)
            if (cs==t.charAt(j-1)) dp[j]+=dp[j-1];
    }
    return (int)dp[n];
}`,
      },
      recursion: {
        hint: "Memoize (i,j): if s[i]==t[j] can match or skip; else must skip s[i]",
        snippet: `long[][] memo = new long[m+1][n+1];
long count(String s, String t, int i, int j) {
    if (j==0) return 1; if (i==0) return 0;
    if (memo[i][j]!=0) return memo[i][j];
    long res=count(s,t,i-1,j);
    if (s.charAt(i-1)==t.charAt(j-1)) res+=count(s,t,i-1,j-1);
    return memo[i][j]=res;
}`,
      },
      stream: {
        hint: "Fold over chars of s, updating 1D dp array in reverse each iteration",
        snippet: `long[] dp = new long[t.length()+1]; dp[0]=1;
s.chars().forEach(cs ->
    IntStream.iterate(t.length(), j->j>=1, j->j-1)
        .filter(j -> t.charAt(j-1)==cs)
        .forEach(j -> dp[j]+=dp[j-1]));
return (int)dp[t.length()];`,
      },
    },
    {
      id: 346,
      title: "Scramble string",
      tip: "Memoized recursion with 3D cache on (s1,s2) or (i,j,len); try all split points",
      iteration: {
        hint: "3D DP dp[len][i][j]: can s1[i..i+len-1] be scramble of s2[j..j+len-1]",
        snippet: `boolean isScramble(String s1, String s2) {
    int n=s1.length(); boolean[][][] dp=new boolean[n+1][n][n];
    for(int i=0;i<n;i++) for(int j=0;j<n;j++) dp[1][i][j]=s1.charAt(i)==s2.charAt(j);
    for(int len=2;len<=n;len++) for(int i=0;i<=n-len;i++) for(int j=0;j<=n-len;j++)
        for(int k=1;k<len&&!dp[len][i][j];k++)
            dp[len][i][j]=(dp[k][i][j]&&dp[len-k][i+k][j+k])||(dp[k][i][j+len-k]&&dp[len-k][i+k][j]);
    return dp[n][0][0];
}`,
      },
      recursion: {
        hint: "Memoize on (s1,s2) string pair; check char frequency first to prune",
        snippet: `Map<String,Boolean> memo = new HashMap<>();
boolean scramble(String s1, String s2) {
    if (s1.equals(s2)) return true;
    String key=s1+","+s2; if(memo.containsKey(key)) return memo.get(key);
    int n=s1.length(); boolean res=false;
    for(int k=1;k<n&&!res;k++)
        res=(scramble(s1.substring(0,k),s2.substring(0,k))&&scramble(s1.substring(k),s2.substring(k)))||
            (scramble(s1.substring(0,k),s2.substring(n-k))&&scramble(s1.substring(k),s2.substring(0,n-k)));
    return memo.compute(key,(a,b)->res);
}`,
      },
      stream: {
        hint: "Frequency check shortcut via stream before costly recursion",
        snippet: `boolean sameChars = IntStream.range(0, s1.length())
    .mapToObj(i -> s1.charAt(i))
    .collect(Collectors.groupingBy(c->c, Collectors.counting()))
    .equals(s2.chars().boxed()
    .collect(Collectors.groupingBy(c->(char)(int)c, Collectors.counting())));
// Use sameChars as early prune in recursion above`,
      },
    },
    {
      id: 347,
      title: "Interleaving string",
      tip: "dp[i][j]=true if s3[0..i+j-1] is interleaving of s1[0..i-1] and s2[0..j-1]",
      iteration: {
        hint: "1D dp array: dp[j] tracks if s3[0..i+j-1] interleaves s1[0..i-1] and s2[0..j-1]",
        snippet: `boolean isInterleave(String s1, String s2, String s3) {
    int m=s1.length(), n=s2.length();
    if (m+n!=s3.length()) return false;
    boolean[] dp=new boolean[n+1]; dp[0]=true;
    for (int j=1;j<=n;j++) dp[j]=dp[j-1]&&s2.charAt(j-1)==s3.charAt(j-1);
    for (int i=1;i<=m;i++) {
        dp[0]=dp[0]&&s1.charAt(i-1)==s3.charAt(i-1);
        for (int j=1;j<=n;j++)
            dp[j]=(dp[j]&&s1.charAt(i-1)==s3.charAt(i+j-1))||(dp[j-1]&&s2.charAt(j-1)==s3.charAt(i+j-1));
    }
    return dp[n];
}`,
      },
      recursion: {
        hint: "Memoize (i,j): try matching s3[i+j] with s1[i] or s2[j]",
        snippet: `Boolean[][] memo = new Boolean[m+1][n+1];
boolean interleave(String s1,String s2,String s3,int i,int j) {
    if(i+j==s3.length()) return true;
    if(memo[i][j]!=null) return memo[i][j];
    boolean r=(i<m&&s1.charAt(i)==s3.charAt(i+j)&&interleave(s1,s2,s3,i+1,j))||
              (j<n&&s2.charAt(j)==s3.charAt(i+j)&&interleave(s1,s2,s3,i,j+1));
    return memo[i][j]=r;
}`,
      },
      stream: {
        hint: "Stream over rows, updating dp[] boolean array per row",
        snippet: `boolean[] dp = new boolean[n+1]; dp[0]=true;
IntStream.rangeClosed(1,n).forEach(j->dp[j]=dp[j-1]&&s2.charAt(j-1)==s3.charAt(j-1));
IntStream.rangeClosed(1,m).forEach(i->{
    dp[0]=dp[0]&&s1.charAt(i-1)==s3.charAt(i-1);
    IntStream.rangeClosed(1,n).forEach(j->
        dp[j]=(dp[j]&&s1.charAt(i-1)==s3.charAt(i+j-1))||(dp[j-1]&&s2.charAt(j-1)==s3.charAt(i+j-1)));
});
return dp[n];`,
      },
    },
    {
      id: 348,
      title: "Target sum (assign +/- to reach a target)",
      tip: "Reduce to subset sum: P - N = target, P + N = sum → P = (sum+target)/2; count subsets with that sum",
      iteration: {
        hint: "dp[j] = count of subsets summing to j; reverse iterate for 0/1 selection",
        snippet: `int findTargetSumWays(int[] nums, int target) {
    int sum = Arrays.stream(nums).sum();
    if ((sum+target)%2!=0||(sum+target)<0) return 0;
    int T=(sum+target)/2; int[] dp=new int[T+1]; dp[0]=1;
    for (int n:nums) for (int j=T;j>=n;j--) dp[j]+=dp[j-n];
    return dp[T];
}`,
      },
      recursion: {
        hint: "Memoize (index, currentSum): branch on + and - for each number",
        snippet: `Map<String,Integer> memo = new HashMap<>();
int ways(int[] nums, int i, int curr, int target) {
    if(i==nums.length) return curr==target?1:0;
    String k=i+","+curr;
    return memo.computeIfAbsent(k, x ->
        ways(nums,i+1,curr+nums[i],target)+ways(nums,i+1,curr-nums[i],target));
}`,
      },
      stream: {
        hint: "Reduce over nums carrying a Map of {sum -> count}",
        snippet: `Map<Integer,Long> ways = new HashMap<>(); ways.put(0,1L);
for (int n : nums) {
    Map<Integer,Long> next = new HashMap<>();
    ways.forEach((s,c)->{next.merge(s+n,c,Long::sum); next.merge(s-n,c,Long::sum);});
    ways=next;
}
return ways.getOrDefault(target,0L).intValue();`,
      },
    },
    {
      id: 349,
      title: "Partition into K equal sum subsets",
      tip: "Bitmask DP or backtracking; target = totalSum/K; greedily fill each bucket",
      iteration: {
        hint: "Bitmask DP: dp[mask]=remainder in current bucket for each assignment",
        snippet: `boolean canPartitionKSubsets(int[] nums, int k) {
    int sum=Arrays.stream(nums).sum(); if(sum%k!=0) return false;
    int t=sum/k, n=nums.length; int[] dp=new int[1<<n]; Arrays.fill(dp,-1); dp[0]=0;
    Arrays.sort(nums);
    for(int mask=0;mask<(1<<n);mask++) { if(dp[mask]<0) continue;
        for(int i=0;i<n;i++) if((mask&(1<<i))==0&&dp[mask]%t+nums[i]<=t)
            dp[mask|(1<<i)]=dp[mask]+nums[i]; }
    return dp[(1<<n)-1]==sum%k*k/k; // i.e. dp[full]==0 mod t check
}`,
      },
      recursion: {
        hint: "Backtracking: fill each bucket to target; skip duplicates in same bucket",
        snippet: `boolean search(int[] nums, int[] buckets, int idx, int k, int t) {
    if(idx==nums.length) return true;
    Set<Integer> tried=new HashSet<>();
    for(int i=0;i<k;i++) {
        if(!tried.add(buckets[i])||buckets[i]+nums[idx]>t) continue;
        buckets[i]+=nums[idx];
        if(search(nums,buckets,idx+1,k,t)) return true;
        buckets[i]-=nums[idx];
    }
    return false;
}`,
      },
      stream: {
        hint: "Sort descending first; use stream to validate feasibility before backtrack",
        snippet: `boolean canPartition(int[] nums, int k) {
    int sum=Arrays.stream(nums).sum(); if(sum%k!=0) return false;
    int[] sorted=IntStream.of(nums).boxed()
        .sorted(Comparator.reverseOrder()).mapToInt(Integer::intValue).toArray();
    return search(sorted, new int[k], 0, k, sum/k);
}`,
      },
    },
    {
      id: 350,
      title: "Minimum cost for tickets",
      tip: "dp[i] = min cost to travel through day i; only update on travel days",
      iteration: {
        hint: "dp array over 365 days; on non-travel days carry forward; on travel days try 1/7/30-day passes",
        snippet: `int mincostTickets(int[] days, int[] costs) {
    boolean[] travel=new boolean[366];
    for(int d:days) travel[d]=true;
    int[] dp=new int[366];
    for(int i=1;i<=365;i++) {
        if(!travel[i]){dp[i]=dp[i-1];continue;}
        dp[i]=Math.min(dp[i-1]+costs[0],
               Math.min(dp[Math.max(0,i-7)]+costs[1], dp[Math.max(0,i-30)]+costs[2]));
    }
    return dp[365];
}`,
      },
      recursion: {
        hint: "Memoize by day index in days[]; try each pass duration",
        snippet: `int[] memo = new int[days.length];
int solve(int[] days, int[] costs, int i) {
    if(i==days.length) return 0;
    if(memo[i]!=0) return memo[i];
    int[] dur={1,7,30}; int min=Integer.MAX_VALUE;
    for(int d=0,j=i;d<3;d++) {
        while(j<days.length&&days[j]<days[i]+dur[d]) j++;
        min=Math.min(min,costs[d]+solve(days,costs,j)); j=i;
    }
    return memo[i]=min;
}`,
      },
      stream: {
        hint: "Stream over days array using IntStream; reuse tabulation via lambda",
        snippet: `boolean[] travel=new boolean[366]; for(int d:days) travel[d]=true;
int[] dp=new int[366];
IntStream.rangeClosed(1,365).forEach(i->{
    if(!travel[i]) dp[i]=dp[i-1];
    else dp[i]=Math.min(dp[i-1]+costs[0],
        Math.min(dp[Math.max(0,i-7)]+costs[1], dp[Math.max(0,i-30)]+costs[2]));
});
return dp[365];`,
      },
    },
    {
      id: 351,
      title: "Regular expression matching (DP version)",
      tip: "dp[i][j]=whether s[0..i-1] matches p[0..j-1]; handle '*' by zero or more of preceding char",
      iteration: {
        hint: "'*' can mean zero (dp[i][j-2]) or one+ match (dp[i-1][j] when chars match)",
        snippet: `boolean isMatch(String s, String p) {
    int m=s.length(),n=p.length(); boolean[][] dp=new boolean[m+1][n+1]; dp[0][0]=true;
    for(int j=2;j<=n;j+=2) dp[0][j]=p.charAt(j-1)=='*'&&dp[0][j-2];
    for(int i=1;i<=m;i++) for(int j=1;j<=n;j++) {
        if(p.charAt(j-1)=='*') dp[i][j]=dp[i][j-2]||(j>1&&dp[i-1][j]&&(p.charAt(j-2)=='.'||p.charAt(j-2)==s.charAt(i-1)));
        else dp[i][j]=dp[i-1][j-1]&&(p.charAt(j-1)=='.'||p.charAt(j-1)==s.charAt(i-1));
    }
    return dp[m][n];
}`,
      },
      recursion: {
        hint: "Memoize (i,j): handle '*' by zero or one+ occurrences of p[j-1]",
        snippet: `Boolean[][] memo = new Boolean[m+1][n+1];
boolean match(String s, String p, int i, int j) {
    if(j==p.length()) return i==s.length();
    if(memo[i][j]!=null) return memo[i][j];
    boolean cur=(i<s.length())&&(p.charAt(j)=='.'||p.charAt(j)==s.charAt(i));
    boolean res; if(j+1<p.length()&&p.charAt(j+1)=='*')
        res=match(s,p,i,j+2)||(cur&&match(s,p,i+1,j));
    else res=cur&&match(s,p,i+1,j+1);
    return memo[i][j]=res;
}`,
      },
      stream: {
        hint: "Row-by-row tabulation using streams for column updates",
        snippet: `boolean[] dp = new boolean[n+1]; dp[0]=true;
IntStream.rangeClosed(2,n).filter(j->p.charAt(j-1)=='*').forEach(j->dp[j]=dp[j-2]);
for(int i=1;i<=m;i++) { boolean[] next=new boolean[n+1];
    IntStream.rangeClosed(1,n).forEach(j->{
        if(p.charAt(j-1)=='*') next[j]=next[j-2]||(j>1&&dp[j]&&(p.charAt(j-2)=='.'||p.charAt(j-2)==s.charAt(i-1)));
        else next[j]=dp[j-1]&&(p.charAt(j-1)=='.'||p.charAt(j-1)==s.charAt(i-1));
    }); dp=next; }
return dp[n];`,
      },
    },
    {
      id: 352,
      title: "Wildcard matching (DP version)",
      tip: "Similar to regex but '*' matches any sequence (including empty); no preceding char constraint",
      iteration: {
        hint: "dp[i][j]: '*' matches empty (dp[i][j-1]) or one+ chars (dp[i-1][j])",
        snippet: `boolean isMatch(String s, String p) {
    int m=s.length(),n=p.length(); boolean[][] dp=new boolean[m+1][n+1]; dp[0][0]=true;
    for(int j=1;j<=n;j++) dp[0][j]=p.charAt(j-1)=='*'&&dp[0][j-1];
    for(int i=1;i<=m;i++) for(int j=1;j<=n;j++)
        dp[i][j]=p.charAt(j-1)=='*'?dp[i][j-1]||dp[i-1][j]:
                 dp[i-1][j-1]&&(p.charAt(j-1)=='?'||p.charAt(j-1)==s.charAt(i-1));
    return dp[m][n];
}`,
      },
      recursion: {
        hint: "Memoize (i,j): '*' can skip or consume one char from s",
        snippet: `Boolean[][] memo = new Boolean[m+1][n+1];
boolean wc(String s, String p, int i, int j) {
    if(j==p.length()) return i==s.length();
    if(memo[i][j]!=null) return memo[i][j];
    boolean res=p.charAt(j)=='*'?wc(s,p,i,j+1)||(i<s.length()&&wc(s,p,i+1,j)):
        i<s.length()&&(p.charAt(j)=='?'||p.charAt(j)==s.charAt(i))&&wc(s,p,i+1,j+1);
    return memo[i][j]=res;
}`,
      },
      stream: {
        hint: "1D dp rolling update; stream column indices per row",
        snippet: `boolean[] dp = new boolean[n+1]; dp[0]=true;
IntStream.rangeClosed(1,n).forEach(j->dp[j]=p.charAt(j-1)=='*'&&dp[j-1]);
for(int i=1;i<=m;i++) { boolean prev=dp[0]; dp[0]=false;
    for(int j=1;j<=n;j++){boolean tmp=dp[j];
        dp[j]=p.charAt(j-1)=='*'?dp[j-1]||dp[j]:prev&&(p.charAt(j-1)=='?'||p.charAt(j-1)==s.charAt(i-1));
        prev=tmp;} }
return dp[n];`,
      },
    },
    {
      id: 353,
      title: "Arithmetic slices (count subarrays forming arithmetic sequences)",
      tip: "dp[i] = number of arithmetic slices ending at i; if diff matches, dp[i]=dp[i-1]+1",
      iteration: {
        hint: "dp[i]=dp[i-1]+1 when nums[i]-nums[i-1]==nums[i-1]-nums[i-2]; accumulate total",
        snippet: `int numberOfArithmeticSlices(int[] nums) {
    int dp=0, total=0;
    for (int i=2; i<nums.length; i++) {
        if (nums[i]-nums[i-1]==nums[i-1]-nums[i-2]) dp++;
        else dp=0;
        total+=dp;
    }
    return total;
}`,
      },
      recursion: {
        hint: "Memoize count(i): returns how many slices end at i (extends from i-1 if arithmetic)",
        snippet: `int[] memo = new int[nums.length]; int[] total = {0};
int count(int[] nums, int i) {
    if(i<2) return 0;
    if(memo[i]!=0) return memo[i];
    int c=nums[i]-nums[i-1]==nums[i-1]-nums[i-2]?count(nums,i-1)+1:0;
    total[0]+=c; return memo[i]=c;
}`,
      },
      stream: {
        hint: "Stream.reduce over index pairs, accumulating dp and total in a state array",
        snippet: `int[] state={0,0}; // state[0]=dp, state[1]=total
IntStream.range(2,nums.length).forEach(i->{
    state[0]=nums[i]-nums[i-1]==nums[i-1]-nums[i-2]?state[0]+1:0;
    state[1]+=state[0];
});
return state[1];`,
      },
    },
    {
      id: 354,
      title: "Predict the winner (game theory DP)",
      tip: "dp[i][j] = max score difference player1 can achieve over player2 on nums[i..j]",
      iteration: {
        hint: "Fill diagonal-by-diagonal; dp[i][j]=max(nums[i]-dp[i+1][j], nums[j]-dp[i][j-1])",
        snippet: `boolean predictTheWinner(int[] nums) {
    int n=nums.length; int[] dp=Arrays.copyOf(nums,n);
    for(int len=2;len<=n;len++)
        for(int i=0;i<=n-len;i++) {
            int j=i+len-1;
            dp[i]=Math.max(nums[i]-dp[i+1], nums[j]-dp[i]);
        }
    return dp[0]>=0;
}`,
      },
      recursion: {
        hint: "Memoize (i,j): current player picks max of left or right minus opponent's best",
        snippet: `int[][] memo = new int[n][n];
int score(int[] nums, int i, int j) {
    if(i==j) return nums[i];
    if(memo[i][j]!=0) return memo[i][j];
    return memo[i][j]=Math.max(nums[i]-score(nums,i+1,j), nums[j]-score(nums,i,j-1));
}`,
      },
      stream: {
        hint: "Process each diagonal length using IntStream; fill dp[] in place",
        snippet: `int[] dp=Arrays.copyOf(nums,nums.length);
IntStream.rangeClosed(2,nums.length).forEach(len->
    IntStream.rangeClosed(0,nums.length-len).forEach(i->{
        int j=i+len-1;
        dp[i]=Math.max(nums[i]-dp[i+1],nums[j]-dp[i]);
    }));
return dp[0]>=0;`,
      },
    },
    {
      id: 355,
      title: "Delete and earn",
      tip: "Transform to house robber: buckets[v] = v * count(v); can't take v-1 and v+1",
      iteration: {
        hint: "Build earn[] where earn[v]=v*freq[v]; run house robber on earn[]",
        snippet: `int deleteAndEarn(int[] nums) {
    int max=Arrays.stream(nums).max().getAsInt();
    int[] earn=new int[max+1];
    for(int n:nums) earn[n]+=n;
    int prev2=0,prev1=0;
    for(int e:earn){int cur=Math.max(prev1,prev2+e); prev2=prev1; prev1=cur;}
    return prev1;
}`,
      },
      recursion: {
        hint: "Memoize rob(i) on earn[] array after transformation",
        snippet: `int[] earn=new int[maxVal+1];
for(int n:nums) earn[n]+=n;
int[] memo=new int[earn.length];
int rob(int i) {
    if(i<0) return 0;
    if(memo[i]!=0) return memo[i];
    return memo[i]=Math.max(rob(i-1), earn[i]+rob(i-2));
}`,
      },
      stream: {
        hint: "Build earn with groupingBy, then reduce as house robber",
        snippet: `int max=Arrays.stream(nums).max().getAsInt();
int[] earn=new int[max+1];
Arrays.stream(nums).forEach(n->earn[n]+=n);
int[] res=Arrays.stream(earn).boxed()
    .reduce(new int[]{0,0},(s,e)->new int[]{s[1],Math.max(s[1],s[0]+e)},(a,b)->b);
return res[1];`,
      },
    },
    {
      id: 356,
      title: "Best time to buy/sell stock with cooldown",
      tip: "Three states: held, sold (cooldown), rest; transitions: held=max(held,rest-price), sold=held+price, rest=max(rest,sold)",
      iteration: {
        hint: "Track held, sold, rest states; update each day from previous values",
        snippet: `int maxProfit(int[] prices) {
    int held=Integer.MIN_VALUE, sold=0, rest=0;
    for(int p:prices) {
        int prevSold=sold;
        sold=held+p;
        held=Math.max(held,rest-p);
        rest=Math.max(rest,prevSold);
    }
    return Math.max(sold,rest);
}`,
      },
      recursion: {
        hint: "Memoize (day, state): state 0=can buy, 1=can sell, 2=cooldown",
        snippet: `int[][] memo=new int[n][3];
int dp(int[] p, int i, int state) {
    if(i>=p.length) return 0;
    if(memo[i][state]!=0) return memo[i][state];
    int skip=dp(p,i+1,state);
    int act=state==0?dp(p,i+1,1)-p[i]:state==1?dp(p,i+1,2)+p[i]:0;
    return memo[i][state]=Math.max(skip,state==2?dp(p,i+1,0):act);
}`,
      },
      stream: {
        hint: "Reduce over prices, carrying {held, sold, rest} triple",
        snippet: `int[] res=Arrays.stream(prices).boxed().reduce(
    new int[]{Integer.MIN_VALUE,0,0},
    (s,p)->new int[]{Math.max(s[0],s[2]-p), s[0]+p, Math.max(s[2],s[1])},
    (a,b)->b);
return Math.max(res[1],res[2]);`,
      },
    },
    {
      id: 357,
      title: "Longest bitonic subsequence",
      tip: "Compute LIS from left (inc[]) and LDS from right (dec[]); answer = max(inc[i]+dec[i]-1)",
      iteration: {
        hint: "Two O(n²) passes: LIS forward, LDS backward; combine at each index",
        snippet: `int longestBitonicSubsequence(int[] nums) {
    int n=nums.length; int[] inc=new int[n], dec=new int[n]; Arrays.fill(inc,1); Arrays.fill(dec,1);
    for(int i=1;i<n;i++) for(int j=0;j<i;j++) if(nums[j]<nums[i]) inc[i]=Math.max(inc[i],inc[j]+1);
    for(int i=n-2;i>=0;i--) for(int j=i+1;j<n;j++) if(nums[j]<nums[i]) dec[i]=Math.max(dec[i],dec[j]+1);
    int max=0; for(int i=0;i<n;i++) if(inc[i]>1&&dec[i]>1) max=Math.max(max,inc[i]+dec[i]-1);
    return max;
}`,
      },
      recursion: {
        hint: "Memoize LIS and LDS separately; combine to get max bitonic length",
        snippet: `int[] lisDP=new int[n], ldsDP=new int[n];
int lis(int i){if(lisDP[i]!=0)return lisDP[i]; lisDP[i]=1;
    for(int j=0;j<i;j++) if(nums[j]<nums[i]) lisDP[i]=Math.max(lisDP[i],lis(j)+1); return lisDP[i];}
int lds(int i){if(ldsDP[i]!=0)return ldsDP[i]; ldsDP[i]=1;
    for(int j=i+1;j<n;j++) if(nums[j]<nums[i]) ldsDP[i]=Math.max(ldsDP[i],lds(j)+1); return ldsDP[i];}
// max of lis(i)+lds(i)-1 over all i`,
      },
      stream: {
        hint: "Stream over indices after computing inc[] and dec[] arrays",
        snippet: `// Compute inc[], dec[] arrays (see iteration tab), then:
return IntStream.range(0,nums.length)
    .filter(i->inc[i]>1&&dec[i]>1)
    .map(i->inc[i]+dec[i]-1)
    .max().orElse(0);`,
      },
    },
    {
      id: 358,
      title: "Minimum number of jumps to reach the end",
      tip: "Greedy is O(n): track current reach and max reach; increment jumps when boundary crossed",
      iteration: {
        hint: "Greedy: at each step extend farthest; when curr boundary reached, jump++",
        snippet: `int jump(int[] nums) {
    int jumps=0, currEnd=0, farthest=0;
    for(int i=0;i<nums.length-1;i++){
        farthest=Math.max(farthest,i+nums[i]);
        if(i==currEnd){jumps++; currEnd=farthest;}
    }
    return jumps;
}`,
      },
      recursion: {
        hint: "Memoize minJumps(i): try all jump lengths from i; return 1 + min of reachable",
        snippet: `int[] memo=new int[nums.length]; Arrays.fill(memo,Integer.MAX_VALUE); memo[0]=0;
int jump(int[] nums, int i) {
    if(i>=nums.length-1) return 0;
    if(memo[i]!=Integer.MAX_VALUE) return memo[i];
    for(int j=1;j<=nums[i];j++) { int sub=jump(nums,i+j); if(sub!=Integer.MAX_VALUE) memo[i]=Math.min(memo[i],sub+1); }
    return memo[i];
}`,
      },
      stream: {
        hint: "DP version: stream positions, update farthest and count jump boundaries",
        snippet: `int[] state={0,0,0}; // jumps, currEnd, farthest
IntStream.range(0,nums.length-1).forEach(i->{
    state[2]=Math.max(state[2],i+nums[i]);
    if(i==state[1]){state[0]++; state[1]=state[2];}
});
return state[0];`,
      },
    },
    {
      id: 359,
      title: "Maximum sum increasing subsequence",
      tip: "Like LIS but dp[i] = max sum of increasing subseq ending at i; dp[i]=max(dp[j]+nums[i]) where nums[j]<nums[i]",
      iteration: {
        hint: "dp[i] starts as nums[i]; update from all j<i where nums[j]<nums[i]",
        snippet: `int maxSumIS(int[] nums) {
    int n=nums.length; int[] dp=Arrays.copyOf(nums,n); int max=0;
    for(int i=1;i<n;i++){
        for(int j=0;j<i;j++) if(nums[j]<nums[i]) dp[i]=Math.max(dp[i],dp[j]+nums[i]);
        max=Math.max(max,dp[i]);
    }
    return max;
}`,
      },
      recursion: {
        hint: "Memoize maxSum(i): try extending all previous elements smaller than nums[i]",
        snippet: `int[] memo=new int[n];
int maxSum(int[] nums, int i) {
    if(memo[i]!=0) return memo[i];
    memo[i]=nums[i];
    for(int j=0;j<i;j++)
        if(nums[j]<nums[i]) memo[i]=Math.max(memo[i], maxSum(nums,j)+nums[i]);
    return memo[i];
}`,
      },
      stream: {
        hint: "Stream over indices, accumulating dp[] and extracting max",
        snippet: `int[] dp=Arrays.copyOf(nums,nums.length);
IntStream.range(1,nums.length).forEach(i->
    IntStream.range(0,i).filter(j->nums[j]<nums[i])
        .forEach(j->dp[i]=Math.max(dp[i],dp[j]+nums[i])));
return Arrays.stream(dp).max().getAsInt();`,
      },
    },
    {
      id: 360,
      title: "Count number of ways to tile a 2×N board with 1×2 tiles",
      tip: "Fibonacci pattern: dp[n]=dp[n-1]+dp[n-2]; one vertical tile or two horizontal tiles",
      iteration: {
        hint: "Same recurrence as Fibonacci; rolling two variables suffice",
        snippet: `int tilingWays(int n) {
    if(n<=1) return 1;
    int a=1,b=1;
    for(int i=2;i<=n;i++){int c=a+b;a=b;b=c;}
    return b;
}`,
      },
      recursion: {
        hint: "Memoize tile(n): place vertical tile or two horizontal tiles",
        snippet: `int[] memo=new int[n+1];
int tile(int n) {
    if(n<=1) return 1;
    if(memo[n]!=0) return memo[n];
    return memo[n]=tile(n-1)+tile(n-2);
}`,
      },
      stream: {
        hint: "Stream.iterate over {a,b} Fibonacci pairs, advance n-1 steps",
        snippet: `return Stream.iterate(new int[]{1,1}, p->new int[]{p[1],p[0]+p[1]})
    .limit(n).reduce((a,b)->b).get()[1];`,
      },
    },
    {
      id: 361,
      title: "Longest palindromic subsequence (DP version)",
      tip: "dp[i][j]=LPS of s[i..j]; if s[i]==s[j], dp[i][j]=dp[i+1][j-1]+2; else max of neighbors",
      iteration: {
        hint: "Fill by increasing length; use 1D array with careful prev-cell tracking",
        snippet: `int longestPalindromeSubseq(String s) {
    int n=s.length(); int[] dp=new int[n];
    for(int i=n-1;i>=0;i--){
        int[] tmp=new int[n]; tmp[i]=1;
        for(int j=i+1;j<n;j++)
            tmp[j]=s.charAt(i)==s.charAt(j)?dp[j-1]+2:Math.max(dp[j],tmp[j-1]);
        dp=tmp;
    }
    return dp[n-1];
}`,
      },
      recursion: {
        hint: "Memoize (i,j): match outer chars add 2; else max of shrink left or right",
        snippet: `int[][] memo=new int[n][n];
int lps(String s, int i, int j) {
    if(i>j) return 0; if(i==j) return 1;
    if(memo[i][j]!=0) return memo[i][j];
    return memo[i][j]=s.charAt(i)==s.charAt(j)?lps(s,i+1,j-1)+2:Math.max(lps(s,i+1,j),lps(s,i,j-1));
}`,
      },
      stream: {
        hint: "Equivalent to LCS of s and reverse(s); compute via stream row updates",
        snippet: `String rev=new StringBuilder(s).reverse().toString(); int n=s.length();
int[] dp=new int[n+1];
s.chars().forEach(ci->{ int[] next=new int[n+1];
    IntStream.rangeClosed(1,n).forEach(j->
        next[j]=ci==rev.charAt(j-1)?dp[j-1]+1:Math.max(dp[j],next[j-1]));
    System.arraycopy(next,0,dp,0,dp.length);});
return dp[n];`,
      },
    },
    {
      id: 362,
      title: "Boolean parenthesization problem",
      tip: "dp[i][j][true/false] = ways to parenthesize expr[i..j] to get true/false; split at each operator",
      iteration: {
        hint: "Fill by length; for each split k compute ways based on operator and subcounts",
        snippet: `int countWays(String symbols, String operators) {
    int n=symbols.length(); int[][][] dp=new int[n][n][2];
    for(int i=0;i<n;i++) dp[i][i][symbols.charAt(i)=='T'?1:0]=1;
    for(int len=2;len<=n;len++) for(int i=0;i<=n-len;i++) { int j=i+len-1;
        for(int k=i;k<j;k++) { char op=operators.charAt(k);
            int lt=dp[i][k][1],lf=dp[i][k][0],rt=dp[k+1][j][1],rf=dp[k+1][j][0];
            if(op=='&'){dp[i][j][1]+=lt*rt;dp[i][j][0]+=lf*rt+lf*rf+lt*rf;}
            else if(op=='|'){dp[i][j][1]+=lt*rt+lt*rf+lf*rt;dp[i][j][0]+=lf*rf;}
            else{dp[i][j][1]+=lt*rf+lf*rt;dp[i][j][0]+=lt*rt+lf*rf;} } }
    return dp[0][n-1][1];
}`,
      },
      recursion: {
        hint: "Memoize (i,j,isTrue): split at each operator and combine subcounts",
        snippet: `Map<String,Integer> memo=new HashMap<>();
int ways(String sym, String ops, int i, int j, boolean isTrue) {
    if(i==j) return (sym.charAt(i)=='T')==isTrue?1:0;
    String k=i+","+j+","+isTrue; if(memo.containsKey(k)) return memo.get(k);
    int res=0;
    for(int m=i;m<j;m++){char op=ops.charAt(m);
        int lt=ways(sym,ops,i,m,true),lf=ways(sym,ops,i,m,false),rt=ways(sym,ops,m+1,j,true),rf=ways(sym,ops,m+1,j,false);
        if(op=='&') res+=isTrue?lt*rt:(lf*rt+lf*rf+lt*rf);
        else if(op=='|') res+=isTrue?(lt*rt+lt*rf+lf*rt):lf*rf;
        else res+=isTrue?(lt*rf+lf*rt):(lt*rt+lf*rf);}
    return memo.compute(k,(x,v)->res);
}`,
      },
      stream: {
        hint: "Stream over splits per interval length; accumulate into dp table",
        snippet: `IntStream.rangeClosed(2,n).forEach(len->
    IntStream.range(0,n-len+1).forEach(i->{ int j=i+len-1;
        IntStream.range(i,j).forEach(k->{ char op=operators.charAt(k);
            int lt=dp[i][k][1],lf=dp[i][k][0],rt=dp[k+1][j][1],rf=dp[k+1][j][0];
            if(op=='&'){dp[i][j][1]+=lt*rt;dp[i][j][0]+=lf*rt+lf*rf+lt*rf;}
            else if(op=='|'){dp[i][j][1]+=lt*rt+lt*rf+lf*rt;dp[i][j][0]+=lf*rf;}
            else{dp[i][j][1]+=lt*rf+lf*rt;dp[i][j][0]+=lt*rt+lf*rf;} });}));`,
      },
    },
    {
      id: 363,
      title: "Word break II (return all possible sentence segmentations)",
      tip: "Memoize start index to list of suffix sentences; work backwards or with DFS to build sentences",
      iteration: {
        hint: "Bottom-up: sentences[i] = list of sentences for s[i..end]; combine with word at s[i..j]",
        snippet: `List<String> wordBreak(String s, List<String> dict) {
    Set<String> set=new HashSet<>(dict); int n=s.length();
    List<List<String>> dp=new ArrayList<>(); for(int i=0;i<=n;i++) dp.add(new ArrayList<>());
    dp.get(n).add("");
    for(int i=n-1;i>=0;i--) for(int j=i+1;j<=n;j++) {
        String w=s.substring(i,j); if(set.contains(w))
            for(String rest:dp.get(j)) dp.get(i).add(w+(rest.isEmpty()?"":" "+rest)); }
    return dp.get(0);
}`,
      },
      recursion: {
        hint: "Memoize (start): DFS tries each valid word prefix, combines results",
        snippet: `Map<Integer,List<String>> memo=new HashMap<>();
List<String> solve(String s, Set<String> dict, int start) {
    if(memo.containsKey(start)) return memo.get(start);
    List<String> res=new ArrayList<>(); if(start==s.length()) res.add("");
    for(int end=start+1;end<=s.length();end++){
        String w=s.substring(start,end); if(dict.contains(w))
            for(String rest:solve(s,dict,end)) res.add(w+(rest.isEmpty()?"":" "+rest)); }
    return memo.compute(start,(k,v)->res);
}`,
      },
      stream: {
        hint: "Stream valid word prefixes at each position, flatMap with recursive solutions",
        snippet: `Map<Integer,List<String>> memo=new HashMap<>();
List<String> solve(String s, Set<String> dict, int i) {
    return memo.computeIfAbsent(i, start ->
        IntStream.rangeClosed(start+1,s.length())
            .filter(e->dict.contains(s.substring(start,e)))
            .boxed().flatMap(e->solve(s,dict,e).stream()
                .map(r->s.substring(start,e)+(r.isEmpty()?"":" "+r)))
            .collect(Collectors.toList()));
}`,
      },
    },
    {
      id: 364,
      title: "Minimum insertions/deletions to convert one string to another",
      tip: "Find LCS(s1,s2); deletions = len(s1)-LCS, insertions = len(s2)-LCS",
      iteration: {
        hint: "Compute LCS with standard 2D DP; answer is (m-lcs)+(n-lcs)",
        snippet: `int minOperations(String s1, String s2) {
    int m=s1.length(), n=s2.length();
    int[] dp=new int[n+1];
    for(char c:s1.toCharArray()){
        int prev=0;
        for(int j=1;j<=n;j++){int tmp=dp[j]; dp[j]=c==s2.charAt(j-1)?prev+1:Math.max(dp[j],dp[j-1]); prev=tmp;}
    }
    int lcs=dp[n];
    return (m-lcs)+(n-lcs);
}`,
      },
      recursion: {
        hint: "Memoized LCS then derive insertions and deletions",
        snippet: `int[][] memo=new int[m+1][n+1];
int lcs(String a, String b, int i, int j) {
    if(i==0||j==0) return 0;
    if(memo[i][j]!=0) return memo[i][j];
    return memo[i][j]=a.charAt(i-1)==b.charAt(j-1)?lcs(a,b,i-1,j-1)+1:Math.max(lcs(a,b,i-1,j),lcs(a,b,i,j-1));
}
// result = (m-lcs(s1,s2,m,n)) + (n-lcs(s1,s2,m,n))`,
      },
      stream: {
        hint: "LCS via stream row updates; derive answer from LCS length",
        snippet: `int[] dp=new int[s2.length()+1];
s1.chars().forEach(ci->{ int[] next=new int[dp.length];
    IntStream.rangeClosed(1,s2.length()).forEach(j->
        next[j]=(char)ci==s2.charAt(j-1)?dp[j-1]+1:Math.max(dp[j],next[j-1]));
    System.arraycopy(next,0,dp,0,dp.length); });
int lcs=dp[s2.length()];
return (s1.length()-lcs)+(s2.length()-lcs);`,
      },
    },
    {
      id: 365,
      title: "Maximum profit with at most K stock transactions",
      tip: "dp[k][i]=max profit using at most k transactions up to day i; or use space-optimized arrays",
      iteration: {
        hint: "For each transaction count t, maintain maxSoFar=max(dp[t-1][j]-prices[j]); update dp[t][i]",
        snippet: `int maxProfit(int k, int[] prices) {
    int n=prices.length; if(k>=n/2) return quickSolve(prices);
    int[][] dp=new int[k+1][n];
    for(int t=1;t<=k;t++){int best=Integer.MIN_VALUE;
        for(int i=1;i<n;i++){best=Math.max(best,dp[t-1][i-1]-prices[i-1]);dp[t][i]=Math.max(dp[t][i-1],best+prices[i]);}}
    return dp[k][n-1];
}`,
      },
      recursion: {
        hint: "Memoize (day, transLeft, holding): branch on buy/sell/skip",
        snippet: `int[][][] memo=new int[n][k+1][2];
int dp(int[] p, int i, int t, int held) {
    if(i==p.length||t==0) return 0;
    if(memo[i][t][held]!=0) return memo[i][t][held];
    int skip=dp(p,i+1,t,held);
    int act=held==1?dp(p,i+1,t-1,0)+p[i]:dp(p,i+1,t,1)-p[i];
    return memo[i][t][held]=Math.max(skip,act);
}`,
      },
      stream: {
        hint: "For each transaction limit, stream days updating best buy and profit",
        snippet: `int[] dp=new int[n];
IntStream.rangeClosed(1,k).forEach(t->{
    int[] next=new int[n]; int best=Integer.MIN_VALUE;
    IntStream.range(1,n).forEach(i->{
        best=Math.max(best,dp[i-1]-prices[i-1]);
        next[i]=Math.max(next[i-1],best+prices[i]);});
    System.arraycopy(next,0,dp,0,n);});
return dp[n-1];`,
      },
    },
    {
      id: 366,
      title: "Number of distinct islands (DP/backtracking hybrid)",
      tip: "DFS from each '1'; encode path shape as string relative to start; use a Set to count unique shapes",
      iteration: {
        hint: "BFS per island, encode each cell as offset (row-startRow, col-startCol); add to Set",
        snippet: `int numDistinctIslands(int[][] grid) {
    Set<String> shapes=new HashSet<>();
    for(int i=0;i<grid.length;i++) for(int j=0;j<grid[0].length;j++)
        if(grid[i][j]==1) { StringBuilder sb=new StringBuilder(); dfs(grid,i,j,i,j,sb); shapes.add(sb.toString()); }
    return shapes.size();
}
void dfs(int[][] g,int i,int j,int r,int c,StringBuilder sb){
    if(i<0||i>=g.length||j<0||j>=g[0].length||g[i][j]!=1) return;
    g[i][j]=0; sb.append((i-r)+","+(j-c)+";");
    dfs(g,i+1,j,r,c,sb); dfs(g,i-1,j,r,c,sb); dfs(g,i,j+1,r,c,sb); dfs(g,i,j-1,r,c,sb);
}`,
      },
      recursion: {
        hint: "DFS encodes the traversal path with direction markers and backtrack marks",
        snippet: `Set<String> shapes=new HashSet<>();
void dfs(int[][] g,int i,int j,StringBuilder path,char dir){
    if(i<0||i>=g.length||j<0||j>=g[0].length||g[i][j]!=1) return;
    g[i][j]=0; path.append(dir);
    dfs(g,i+1,j,path,'D'); dfs(g,i-1,j,path,'U'); dfs(g,i,j+1,path,'R'); dfs(g,i,j-1,path,'L');
    path.append('B'); // backtrack marker ensures unique encoding
}`,
      },
      stream: {
        hint: "Stream over all cells, triggering DFS and collecting shape strings into a Set",
        snippet: `Set<String> shapes=new HashSet<>();
IntStream.range(0,grid.length).forEach(i->
    IntStream.range(0,grid[0].length).forEach(j->{
        if(grid[i][j]==1){StringBuilder sb=new StringBuilder(); dfs(grid,i,j,i,j,sb); shapes.add(sb.toString());}
    }));
return shapes.size();`,
      },
    },
  ],
};
