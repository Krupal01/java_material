window.CT_ARRAYS_A = [
  {
    id: 56,
    title: "Two Sum",
    problem:
      "Given an integer array nums and an integer target, return indices of the two numbers that add up to target. Assume exactly one valid pair exists.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
    ],
    tip: "HashMap stores seen values; check if complement (target - num) exists — O(n)",
    iteration: {
      hint: "One pass: store index in map, check for complement before inserting",
      snippet: `Map<Integer,Integer> map = new HashMap<>();
for (int i = 0; i < nums.length; i++) {
    int c = target - nums[i];
    if (map.containsKey(c)) return new int[]{map.get(c), i};
    map.put(nums[i], i);
}`,
    },
    recursion: {
      hint: "Recursive scan accumulating a map; check complement at each step",
      snippet: `int[] f(int[] a, int t, int i, Map<Integer,Integer> m) {
    if (i == a.length) return null;
    if (m.containsKey(t - a[i])) return new int[]{m.get(t - a[i]), i};
    m.put(a[i], i);
    return f(a, t, i + 1, m);
}`,
    },
    stream: {
      hint: "Build index map with streams, then find the pair",
      snippet: `Map<Integer,Integer> m = IntStream.range(0, nums.length)
    .boxed().collect(Collectors.toMap(i -> nums[i], i -> i, (a, b) -> a));
// for each i: if m.containsKey(target - nums[i]) => return pair`,
    },
  },
  {
    id: 57,
    title: "Three Sum",
    problem:
      "Given an integer array nums, return all unique triplets [a,b,c] such that a + b + c = 0.",
    examples: [
      { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" },
      { input: "nums = [0,0,0]", output: "[[0,0,0]]" },
    ],
    tip: "Sort first, then fix one element and use two pointers on the rest — O(n²)",
    iteration: {
      hint: "Sort, outer loop fixes nums[i], inner two pointers find pairs summing to -nums[i]",
      snippet: `Arrays.sort(nums);
for (int i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] == nums[i-1]) continue;
    int l = i+1, r = nums.length-1;
    while (l < r) { int s = nums[i]+nums[l]+nums[r];
        if (s==0) { res.add(...); l++; r--; } else if (s<0) l++; else r--; }
}`,
    },
    recursion: {
      hint: "Recursive kSum helper: base case 2-sum via two pointers, otherwise recurse with target-nums[i]",
      snippet: `List<List<Integer>> kSum(int[] a, int t, int k, int s) {
    if (k == 2) { /* two-pointer */ return pairs; }
    for (int i = s; i < a.length-k+1; i++) {
        if (i > s && a[i]==a[i-1]) continue;
        for (List<Integer> sub : kSum(a,t-a[i],k-1,i+1)) { ... }
    } return res;
}`,
    },
    stream: {
      hint: "Sort, then stream outer index; inner two-pointer collected into results",
      snippet: `Arrays.sort(nums);
IntStream.range(0, nums.length-2)
    .filter(i -> i==0 || nums[i]!=nums[i-1])
    .forEach(i -> { /* two-pointer from i+1 to end */ });`,
    },
  },
  {
    id: 58,
    title: "Four Sum",
    problem:
      "Given an integer array nums and an integer target, return all unique quadruplets whose sum equals target.",
    examples: [
      {
        input: "nums = [1,0,-1,0,-2,2], target = 0",
        output: "[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]",
      },
      { input: "nums = [2,2,2,2,2], target = 8", output: "[[2,2,2,2]]" },
    ],
    tip: "Sort + two nested loops fixing pairs, then two pointers — O(n³)",
    iteration: {
      hint: "Sort, two outer loops fix nums[i]+nums[j], inner two pointers find the remaining pair",
      snippet: `Arrays.sort(nums);
for (int i = 0; i < n-3; i++) {
    for (int j = i+1; j < n-2; j++) {
        int l = j+1, r = n-1;
        while (l < r) { long s = (long)nums[i]+nums[j]+nums[l]+nums[r];
            if (s==target) { res.add(...); l++; r--; } else if (s<target) l++; else r--; }
    }
}`,
    },
    recursion: {
      hint: "Reuse recursive kSum: reduce 4-sum to 3-sum to 2-sum with two pointers at the base",
      snippet: `List<List<Integer>> fourSum(int[] a, int t) {
    Arrays.sort(a);
    return kSum(a, (long)t, 4, 0);
}
// kSum recurses until k==2, then uses two pointers`,
    },
    stream: {
      hint: "Sort, stream index pairs with flatMap, inner two-pointer collects results",
      snippet: `Arrays.sort(nums);
IntStream.range(0, n-3).boxed().flatMap(i ->
    IntStream.range(i+1, n-2).boxed().flatMap(j -> {
        /* two-pointer on [j+1, n-1] */
        return pairs.stream();
    })).collect(Collectors.toList());`,
    },
  },
  {
    id: 59,
    title: "Maximum Subarray (Kadane's Algorithm)",
    problem:
      "Given an integer array nums, find the maximum possible sum of a non-empty contiguous subarray.",
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6" },
      { input: "nums = [5,4,-1,7,8]", output: "23" },
    ],
    tip: "Extend or restart subarray at each element; track running max — O(n)",
    iteration: {
      hint: "Keep curSum = max(num, curSum+num); update maxSum each step",
      snippet: `int cur = nums[0], max = nums[0];
for (int i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    max = Math.max(max, cur);
}
return max;`,
    },
    recursion: {
      hint: "Return pair (maxEndingHere, maxSoFar) recursively; base is first element",
      snippet: `int[] helper(int[] a, int i) {
    if (i == 0) return new int[]{a[0], a[0]};
    int[] prev = helper(a, i-1);
    int here = Math.max(a[i], prev[0]+a[i]);
    return new int[]{here, Math.max(here, prev[1])};
}`,
    },
    stream: {
      hint: "Reduce with a running (curMax, globalMax) pair using an int array accumulator",
      snippet: `int[] res = Arrays.stream(nums).boxed()
    .reduce(new int[]{nums[0],nums[0]},
        (acc, x) -> new int[]{Math.max(x,acc[0]+x), Math.max(Math.max(x,acc[0]+x),acc[1])},
        (a, b) -> a);
return res[1];`,
    },
  },
  {
    id: 60,
    title: "Best Time to Buy and Sell Stock",
    problem:
      "Given daily stock prices, return the maximum profit from one buy and one later sell. Return 0 if no profit is possible.",
    examples: [
      { input: "prices = [7,1,5,3,6,4]", output: "5" },
      { input: "prices = [7,6,4,3,1]", output: "0" },
    ],
    tip: "Track minimum price seen so far; profit at each step is price - minPrice — O(n)",
    iteration: {
      hint: "Single pass: update minPrice each step, compare price - minPrice with maxProfit",
      snippet: `int min = Integer.MAX_VALUE, profit = 0;
for (int p : prices) {
    if (p < min) min = p;
    else profit = Math.max(profit, p - min);
}
return profit;`,
    },
    recursion: {
      hint: "Recurse carrying minPrice and maxProfit; update both at each index",
      snippet: `int f(int[] p, int i, int min, int profit) {
    if (i == p.length) return profit;
    int newMin = Math.min(min, p[i]);
    return f(p, i+1, newMin, Math.max(profit, p[i]-newMin));
}`,
    },
    stream: {
      hint: "Reduce over prices tracking [minSeen, maxProfit] in an int array",
      snippet: `int[] r = Arrays.stream(prices).boxed()
    .reduce(new int[]{Integer.MAX_VALUE, 0},
        (acc, p) -> new int[]{Math.min(acc[0],p), Math.max(acc[1],p-acc[0])},
        (a,b) -> a);
return r[1];`,
    },
  },
  {
    id: 61,
    title: "Stock II (Multiple Transactions Allowed)",
    problem:
      "Given daily stock prices, return the maximum profit when you may complete as many buy-sell transactions as you want, holding at most one share at a time.",
    examples: [
      { input: "prices = [7,1,5,3,6,4]", output: "7" },
      { input: "prices = [1,2,3,4,5]", output: "4" },
    ],
    tip: "Capture every upward price movement; sum all positive consecutive differences — O(n)",
    iteration: {
      hint: "Whenever prices[i] > prices[i-1], add the difference to profit",
      snippet: `int profit = 0;
for (int i = 1; i < prices.length; i++)
    if (prices[i] > prices[i-1])
        profit += prices[i] - prices[i-1];
return profit;`,
    },
    recursion: {
      hint: "Recurse from index 1; add positive diff and recurse, or just recurse",
      snippet: `int f(int[] p, int i) {
    if (i >= p.length) return 0;
    int gain = Math.max(0, p[i] - p[i-1]);
    return gain + f(p, i+1);
}`,
    },
    stream: {
      hint: "IntStream over consecutive pairs, sum where diff is positive",
      snippet: `return IntStream.range(1, prices.length)
    .map(i -> prices[i] - prices[i-1])
    .filter(d -> d > 0)
    .sum();`,
    },
  },
  {
    id: 62,
    title: "Missing Number",
    problem:
      "Given an array nums containing n distinct numbers from the range 0 to n, return the one number missing from the array.",
    examples: [
      { input: "nums = [3,0,1]", output: "2" },
      { input: "nums = [0,1]", output: "2" },
    ],
    tip: "XOR all indices and values — missing number is the survivor — O(n) time, O(1) space",
    iteration: {
      hint: "XOR 0..n with each element; duplicate XORs cancel, leaving the missing number",
      snippet: `int xor = nums.length;
for (int i = 0; i < nums.length; i++)
    xor ^= i ^ nums[i];
return xor;`,
    },
    recursion: {
      hint: "Recursively XOR index and value; accumulate result through the call stack",
      snippet: `int f(int[] a, int i, int acc) {
    if (i == a.length) return acc ^ i;
    return f(a, i+1, acc ^ i ^ a[i]);
}`,
    },
    stream: {
      hint: "Expected sum minus actual sum gives the missing number",
      snippet: `int n = nums.length;
int expected = n * (n + 1) / 2;
return expected - Arrays.stream(nums).sum();`,
    },
  },
  {
    id: 63,
    title: "Find Duplicate",
    problem:
      "Given an array nums containing n + 1 integers where each integer is in the range 1 to n, return the repeated number.",
    examples: [
      { input: "nums = [1,3,4,2,2]", output: "2" },
      { input: "nums = [3,1,3,4,2]", output: "3" },
    ],
    tip: "Floyd's cycle detection treats array values as next-pointers — O(n) time, O(1) space",
    iteration: {
      hint: "Phase 1: slow/fast meet inside cycle. Phase 2: reset slow to 0 to find cycle entry",
      snippet: `int slow = nums[0], fast = nums[0];
do { slow = nums[slow]; fast = nums[nums[fast]]; } while (slow != fast);
slow = nums[0];
while (slow != fast) { slow = nums[slow]; fast = nums[fast]; }
return slow;`,
    },
    recursion: {
      hint: "Recursive DFS/marking: negate visited index; duplicate found when already negative",
      snippet: `int f(int[] a, int i, Set<Integer> seen) {
    if (i == a.length) return -1;
    if (!seen.add(a[i])) return a[i];
    return f(a, i+1, seen);
}`,
    },
    stream: {
      hint: "Collect to set; first element not added to a seen-set is the duplicate",
      snippet: `Set<Integer> seen = new HashSet<>();
return Arrays.stream(nums)
    .filter(n -> !seen.add(n))
    .findFirst().getAsInt();`,
    },
  },
  {
    id: 64,
    title: "Remove Duplicates from Sorted Array",
    problem:
      "Given a sorted integer array nums, remove duplicates in-place so each unique value appears once and return the number of unique values.",
    examples: [
      { input: "nums = [1,1,2]", output: "2, nums starts [1,2]" },
      { input: "nums = [0,0,1,1,1,2]", output: "3, nums starts [0,1,2]" },
    ],
    tip: "Two-pointer: slow tracks unique position, fast scans ahead — in-place O(n)",
    iteration: {
      hint: "k points to next write slot; advance only when nums[i] != nums[k-1]",
      snippet: `int k = 1;
for (int i = 1; i < nums.length; i++)
    if (nums[i] != nums[k-1])
        nums[k++] = nums[i];
return k;`,
    },
    recursion: {
      hint: "Recurse with read and write indices; copy when value differs from last written",
      snippet: `int f(int[] a, int r, int w) {
    if (r == a.length) return w;
    if (a[r] != a[w-1]) { a[w] = a[r]; return f(a, r+1, w+1); }
    return f(a, r+1, w);
}`,
    },
    stream: {
      hint: "Collect distinct values back into the array via an index counter",
      snippet: `int[] unique = Arrays.stream(nums).distinct().toArray();
System.arraycopy(unique, 0, nums, 0, unique.length);
return unique.length;`,
    },
  },
  {
    id: 65,
    title: "Rotate Array",
    problem:
      "Given an integer array nums and a non-negative integer k, rotate the array to the right by k positions. Elements that move past the end wrap back to the front. For example, nums = [1,2,3,4,5,6,7] and k = 3 becomes [5,6,7,1,2,3,4]. Normalize k with k % n because rotating by the array length gives the same array.",
    examples: [
      { input: "nums = [1,2,3,4,5,6,7], k = 3", output: "[5,6,7,1,2,3,4]" },
      { input: "nums = [-1,-100,3,99], k = 2", output: "[3,99,-1,-100]" },
    ],
    tip: "Use the destination formula newIndex = (i + k) % n for an easy O(n) solution; use three reverses only when the problem requires O(1) extra space",
    iteration: {
      hint: "Create a copy and place each nums[i] at (i + k) % n; this is the most readable formula-based approach",
      snippet: `int n = nums.length;
k %= n;
int[] rotated = new int[n];
for (int i = 0; i < n; i++) {
    rotated[(i + k) % n] = nums[i];
}
System.arraycopy(rotated, 0, nums, 0, n);`,
    },
    recursion: {
      hint: "Recursive version applies the same destination formula, advancing one source index per call",
      snippet: `void fill(int[] nums, int[] rotated, int i, int k) {
    if (i == nums.length) return;
    rotated[(i + k) % nums.length] = nums[i];
    fill(nums, rotated, i + 1, k);
}`,
    },
    stream: {
      hint: "Concatenate suffix and prefix subarrays via IntStream then copy back",
      snippet: `int n = nums.length; k %= n;
int[] rot = IntStream.concat(
    Arrays.stream(nums, n-k, n),
    Arrays.stream(nums, 0, n-k)).toArray();
System.arraycopy(rot, 0, nums, 0, n);`,
    },
  },
  {
    id: 66,
    title: "Product of Array Except Self",
    problem:
      "Given an integer array nums, return an array answer where answer[i] is the product of every element except nums[i], without using division.",
    examples: [
      { input: "nums = [1,2,3,4]", output: "[24,12,8,6]" },
      { input: "nums = [-1,1,0,-3,3]", output: "[0,0,9,0,0]" },
    ],
    tip: "Two-pass prefix/suffix product arrays avoid division — O(n) time, O(1) extra space",
    iteration: {
      hint: "Left pass builds prefix products; right pass multiplies in suffix products in-place",
      snippet: `int n = nums.length; int[] res = new int[n];
res[0] = 1;
for (int i = 1; i < n; i++) res[i] = res[i-1] * nums[i-1];
int right = 1;
for (int i = n-1; i >= 0; i--) { res[i] *= right; right *= nums[i]; }
return res;`,
    },
    recursion: {
      hint: "Recursive right-to-left pass accumulates suffix product and multiplies into prefix array",
      snippet: `void suffixPass(int[] a, int[] res, int i, int suffix) {
    if (i < 0) return;
    res[i] *= suffix;
    suffixPass(a, res, i-1, suffix * a[i]);
}`,
    },
    stream: {
      hint: "Compute total product then divide per element; handle zeros with a special case stream",
      snippet: `long total = Arrays.stream(nums).asLongStream().reduce(1L, (a,b)->a*b);
return Arrays.stream(nums)
    .map(n -> (int)(total / n)).toArray();
// Note: divide-based; handle zeros separately`,
    },
  },
  {
    id: 67,
    title: "Majority Element",
    problem:
      "Given an array nums, return the element that appears more than n / 2 times. You may assume such an element exists.",
    examples: [
      { input: "nums = [3,2,3]", output: "3" },
      { input: "nums = [2,2,1,1,1,2,2]", output: "2" },
    ],
    tip: "Boyer-Moore voting: cancel out non-majority votes; survivor is the majority — O(n)",
    iteration: {
      hint: "candidate and count: increment when equal, decrement otherwise; reset count to 1 at 0",
      snippet: `int count = 0, candidate = 0;
for (int n : nums) {
    if (count == 0) candidate = n;
    count += (n == candidate) ? 1 : -1;
}
return candidate;`,
    },
    recursion: {
      hint: "Recursive scan maintaining candidate and vote count through parameters",
      snippet: `int f(int[] a, int i, int cand, int cnt) {
    if (i == a.length) return cand;
    if (cnt == 0) return f(a, i+1, a[i], 1);
    return f(a, i+1, cand, a[i]==cand ? cnt+1 : cnt-1);
}`,
    },
    stream: {
      hint: "Group by value and find the entry with maximum frequency",
      snippet: `return Arrays.stream(nums).boxed()
    .collect(Collectors.groupingBy(x->x, Collectors.counting()))
    .entrySet().stream()
    .max(Map.Entry.comparingByValue())
    .get().getKey();`,
    },
  },
  {
    id: 68,
    title: "Intersection of Arrays",
    problem:
      "Given two integer arrays nums1 and nums2, return their unique intersection values in any order.",
    examples: [
      { input: "nums1 = [1,2,2,1], nums2 = [2,2]", output: "[2]" },
      { input: "nums1 = [4,9,5], nums2 = [9,4,9,8,4]", output: "[4,9]" },
    ],
    tip: "HashSet for O(1) lookup; retain only elements present in both arrays — O(n+m)",
    iteration: {
      hint: "Put nums1 into a set; iterate nums2 adding to result set only if present",
      snippet: `Set<Integer> set = new HashSet<>();
for (int n : nums1) set.add(n);
Set<Integer> res = new HashSet<>();
for (int n : nums2) if (set.contains(n)) res.add(n);
return res.stream().mapToInt(Integer::intValue).toArray();`,
    },
    recursion: {
      hint: "Recursive scan of nums2; add to result set when element is in nums1 set",
      snippet: `void f(int[] a, int i, Set<Integer> s, Set<Integer> res) {
    if (i == a.length) return;
    if (s.contains(a[i])) res.add(a[i]);
    f(a, i+1, s, res);
}`,
    },
    stream: {
      hint: "Stream nums2, filter by membership in a set built from nums1, collect distinct",
      snippet: `Set<Integer> s = Arrays.stream(nums1).boxed().collect(Collectors.toSet());
return Arrays.stream(nums2).filter(s::contains).distinct().toArray();`,
    },
  },
  {
    id: 69,
    title: "Merge Intervals",
    problem:
      "Given an array of intervals, merge all overlapping intervals and return the non-overlapping result sorted by start time.",
    examples: [
      {
        input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        output: "[[1,6],[8,10],[15,18]]",
      },
      { input: "intervals = [[1,4],[4,5]]", output: "[[1,5]]" },
    ],
    tip: "Sort by start time; greedily merge overlapping intervals — O(n log n)",
    iteration: {
      hint: "Sort by start; compare each interval's start with last merged interval's end",
      snippet: `Arrays.sort(intervals, (a,b) -> a[0]-b[0]);
List<int[]> res = new ArrayList<>();
for (int[] iv : intervals) {
    if (res.isEmpty() || res.get(res.size()-1)[1] < iv[0]) res.add(iv);
    else res.get(res.size()-1)[1] = Math.max(res.get(res.size()-1)[1], iv[1]);
}`,
    },
    recursion: {
      hint: "Recursive merge: compare current interval with head of remaining list",
      snippet: `List<int[]> merge(List<int[]> list, int i, int[] last) {
    if (i == list.size()) return Collections.singletonList(last);
    int[] cur = list.get(i);
    if (cur[0] <= last[1]) { last[1] = Math.max(last[1], cur[1]); return merge(list, i+1, last); }
    List<int[]> res = new ArrayList<>(); res.add(last); res.addAll(merge(list, i+1, cur)); return res;
}`,
    },
    stream: {
      hint: "Sort, then reduce with a deque-backed accumulator merging overlapping intervals",
      snippet: `Arrays.sort(intervals, Comparator.comparingInt(a -> a[0]));
return Arrays.stream(intervals)
    .collect(() -> new ArrayDeque<int[]>(),
        (dq, iv) -> { if (!dq.isEmpty() && dq.peekLast()[1]>=iv[0]) dq.peekLast()[1]=Math.max(dq.peekLast()[1],iv[1]); else dq.add(iv); },
        (a,b) -> {}).toArray(int[][]::new);`,
    },
  },
  {
    id: 70,
    title: "Insert Interval",
    problem:
      "Given sorted non-overlapping intervals and a new interval, insert the new interval and merge if necessary.",
    examples: [
      {
        input: "intervals = [[1,3],[6,9]], newInterval = [2,5]",
        output: "[[1,5],[6,9]]",
      },
      {
        input:
          "intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]",
        output: "[[1,2],[3,10],[12,16]]",
      },
    ],
    tip: "Add all non-overlapping before, merge overlapping, add all after — O(n)",
    iteration: {
      hint: "Three phases: append intervals ending before newInterval starts; merge overlapping; append rest",
      snippet: `List<int[]> res = new ArrayList<>(); int i = 0, n = intervals.length;
while (i < n && intervals[i][1] < newInterval[0]) res.add(intervals[i++]);
while (i < n && intervals[i][0] <= newInterval[1]) {
    newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
    newInterval[1] = Math.max(newInterval[1], intervals[i++][1]);
}
res.add(newInterval);
while (i < n) res.add(intervals[i++]);`,
    },
    recursion: {
      hint: "Recursive with phase tracking: before-overlap, during-overlap, after-overlap",
      snippet: `void f(int[][] ivs, int[] nw, int i, List<int[]> res, boolean merged) {
    if (i == ivs.length) { if (!merged) res.add(nw); return; }
    if (ivs[i][1] < nw[0]) { res.add(ivs[i]); f(ivs,nw,i+1,res,merged); }
    else if (ivs[i][0] > nw[1]) { if (!merged) { res.add(nw); merged=true; } res.add(ivs[i]); f(ivs,nw,i+1,res,true); }
    else { nw[0]=Math.min(nw[0],ivs[i][0]); nw[1]=Math.max(nw[1],ivs[i][1]); f(ivs,nw,i+1,res,false); }
}`,
    },
    stream: {
      hint: "Stream all intervals plus the new one, sort by start, then merge like problem 69",
      snippet: `int[][] combined = Stream.concat(Arrays.stream(intervals), Stream.of(newInterval))
    .sorted(Comparator.comparingInt(a -> a[0])).toArray(int[][]::new);
// then apply merge-intervals logic on combined`,
    },
  },
  {
    id: 71,
    title: "Sort Colors (Dutch National Flag)",
    problem:
      "Given an array nums containing only 0, 1, and 2, sort it in-place so equal colors are adjacent in the order 0, 1, 2.",
    examples: [
      { input: "nums = [2,0,2,1,1,0]", output: "[0,0,1,1,2,2]" },
      { input: "nums = [2,0,1]", output: "[0,1,2]" },
    ],
    tip: "Three pointers: low, mid, high partition 0s, 1s, 2s in a single pass — O(n)",
    iteration: {
      hint: "low=0,mid=0,high=n-1; swap based on nums[mid]: 0→swap with low, 2→swap with high",
      snippet: `int lo = 0, mid = 0, hi = nums.length - 1;
while (mid <= hi) {
    if (nums[mid] == 0) swap(nums, lo++, mid++);
    else if (nums[mid] == 1) mid++;
    else swap(nums, mid, hi--);
}`,
    },
    recursion: {
      hint: "Recursive Dutch flag: process current mid element and recurse with updated pointers",
      snippet: `void dnf(int[] a, int lo, int mid, int hi) {
    if (mid > hi) return;
    if (a[mid]==0) { swap(a,lo,mid); dnf(a,lo+1,mid+1,hi); }
    else if (a[mid]==1) dnf(a,lo,mid+1,hi);
    else { swap(a,mid,hi); dnf(a,lo,mid,hi-1); }
}`,
    },
    stream: {
      hint: "Count 0s, 1s, 2s then fill the array in sorted order",
      snippet: `int[] cnt = new int[3];
for (int n : nums) cnt[n]++;
int i = 0;
for (int v = 0; v < 3; v++)
    for (int c = 0; c < cnt[v]; c++) nums[i++] = v;`,
    },
  },
  {
    id: 72,
    title: "Move Zeroes",
    problem:
      "Given an integer array nums, move all zeroes to the end while preserving the relative order of non-zero elements.",
    examples: [
      { input: "nums = [0,1,0,3,12]", output: "[1,3,12,0,0]" },
      { input: "nums = [0]", output: "[0]" },
    ],
    tip: "Two-pointer: copy non-zero values forward, then fill remainder with zeros — O(n)",
    iteration: {
      hint: "k tracks next write position; copy non-zeros, then fill tail with zeros",
      snippet: `int k = 0;
for (int n : nums) if (n != 0) nums[k++] = n;
while (k < nums.length) nums[k++] = 0;`,
    },
    recursion: {
      hint: "Recursive scan with read and write index; write non-zeros, fill zeros at the end",
      snippet: `void f(int[] a, int r, int w) {
    if (r == a.length) { while (w < a.length) a[w++] = 0; return; }
    if (a[r] != 0) a[w++] = a[r];
    f(a, r+1, w);
}`,
    },
    stream: {
      hint: "Partition into non-zeros and zeros, concatenate, copy back",
      snippet: `int[] res = IntStream.concat(
    Arrays.stream(nums).filter(x -> x != 0),
    Arrays.stream(nums).filter(x -> x == 0)).toArray();
System.arraycopy(res, 0, nums, 0, nums.length);`,
    },
  },
  {
    id: 73,
    title: "Subarray Sum Equals K",
    problem:
      "Given an integer array nums and an integer k, return the number of contiguous subarrays whose sum equals k.",
    examples: [
      { input: "nums = [1,1,1], k = 2", output: "2" },
      { input: "nums = [1,2,3], k = 3", output: "2" },
    ],
    tip: "Prefix sum + HashMap: count subarrays where prefixSum - k appeared before — O(n)",
    iteration: {
      hint: "Track running prefix sum; map stores frequency of each prefix sum seen",
      snippet: `Map<Integer,Integer> map = new HashMap<>();
map.put(0, 1);
int sum = 0, count = 0;
for (int n : nums) {
    sum += n;
    count += map.getOrDefault(sum - k, 0);
    map.merge(sum, 1, Integer::sum);
}`,
    },
    recursion: {
      hint: "Recursive scan accumulating prefix sum and checking map for complement",
      snippet: `int f(int[] a, int i, int sum, int k, Map<Integer,Integer> m) {
    if (i == a.length) return 0;
    sum += a[i];
    int cnt = m.getOrDefault(sum-k, 0);
    m.merge(sum, 1, Integer::sum);
    return cnt + f(a, i+1, sum, k, m);
}`,
    },
    stream: {
      hint: "Build prefix sum array with stream, then count pairs where diff equals k",
      snippet: `int[] pre = new int[nums.length+1];
IntStream.range(0, nums.length).forEach(i -> pre[i+1] = pre[i]+nums[i]);
return (int) IntStream.range(0, pre.length).boxed()
    .flatMap(i -> IntStream.range(i+1,pre.length).filter(j->pre[j]-pre[i]==k).boxed())
    .count();`,
    },
  },
  {
    id: 74,
    title: "Longest Consecutive Sequence",
    problem:
      "Given an unsorted integer array nums, return the length of the longest consecutive elements sequence.",
    examples: [
      { input: "nums = [100,4,200,1,3,2]", output: "4" },
      { input: "nums = [0,3,7,2,5,8,4,6,0,1]", output: "9" },
    ],
    tip: "HashSet: only start counting from sequence beginnings (no n-1 in set) — O(n)",
    iteration: {
      hint: "For each num where num-1 is not in set, count streak forward",
      snippet: `Set<Integer> set = new HashSet<>();
for (int n : nums) set.add(n);
int best = 0;
for (int n : set) if (!set.contains(n-1)) {
    int cur = n, len = 1;
    while (set.contains(++cur)) len++;
    best = Math.max(best, len);
}`,
    },
    recursion: {
      hint: "Recursive streak counter: increment while next consecutive number is in set",
      snippet: `int streak(Set<Integer> s, int n) {
    if (!s.contains(n)) return 0;
    return 1 + streak(s, n+1);
}
// call for each n where !s.contains(n-1)`,
    },
    stream: {
      hint: "Stream set, filter sequence starters, map to streak length, find max",
      snippet: `Set<Integer> set = new HashSet<>(Arrays.asList(
    Arrays.stream(nums).boxed().toArray(Integer[]::new)));
return set.stream().filter(n -> !set.contains(n-1))
    .mapToInt(n -> { int l=0; while(set.contains(n+l)) l++; return l; })
    .max().orElse(0);`,
    },
  },
  {
    id: 75,
    title: "Container with Most Water",
    problem:
      "Given an array height where each value is a vertical line height, return the maximum water area formed by choosing two lines.",
    examples: [
      { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49" },
      { input: "height = [1,1]", output: "1" },
    ],
    tip: "Two pointers from both ends; always move the shorter side inward — O(n)",
    iteration: {
      hint: "l=0, r=n-1; area = min(h[l],h[r])*(r-l); move the shorter pointer",
      snippet: `int l = 0, r = height.length-1, max = 0;
while (l < r) {
    max = Math.max(max, Math.min(height[l], height[r]) * (r-l));
    if (height[l] < height[r]) l++; else r--;
}
return max;`,
    },
    recursion: {
      hint: "Recursive with left and right pointers; compute area and recurse moving shorter side",
      snippet: `int f(int[] h, int l, int r) {
    if (l >= r) return 0;
    int area = Math.min(h[l],h[r]) * (r-l);
    return Math.max(area, h[l]<h[r] ? f(h,l+1,r) : f(h,l,r-1));
}`,
    },
    stream: {
      hint: "Stream all pairs (brute O(n²)); better to use the two-pointer approach above",
      snippet: `return IntStream.range(0, height.length).boxed()
    .flatMapToInt(i -> IntStream.range(i+1, height.length)
        .map(j -> Math.min(height[i],height[j])*(j-i)))
    .max().orElse(0);`,
    },
  },
  {
    id: 76,
    title: "Sliding Window Maximum",
    problem:
      "Given an integer array nums and window size k, return the maximum value in each sliding window of size k.",
    examples: [
      { input: "nums = [1,3,-1,-3,5,3,6,7], k = 3", output: "[3,3,5,5,6,7]" },
      { input: "nums = [1], k = 1", output: "[1]" },
    ],
    tip: "Monotonic deque stores indices in decreasing order; front is always the current max — O(n)",
    iteration: {
      hint: "Deque front = max index; remove out-of-window indices; remove smaller rear indices",
      snippet: `Deque<Integer> dq = new ArrayDeque<>();
int[] res = new int[nums.length - k + 1];
for (int i = 0; i < nums.length; i++) {
    if (!dq.isEmpty() && dq.peek() <= i-k) dq.poll();
    while (!dq.isEmpty() && nums[dq.peekLast()] <= nums[i]) dq.pollLast();
    dq.offer(i); if (i >= k-1) res[i-k+1] = nums[dq.peek()];
}`,
    },
    recursion: {
      hint: "Recursive window shift: maintain deque state through parameters",
      snippet: `void f(int[] a, int i, int k, Deque<Integer> dq, int[] res) {
    if (i == a.length) return;
    if (!dq.isEmpty() && dq.peek() <= i-k) dq.poll();
    while (!dq.isEmpty() && a[dq.peekLast()] <= a[i]) dq.pollLast();
    dq.offer(i); if (i>=k-1) res[i-k+1]=a[dq.peek()]; f(a,i+1,k,dq,res);
}`,
    },
    stream: {
      hint: "Stream window ranges, map each to its max — O(n*k) but simpler to express",
      snippet: `return IntStream.range(0, nums.length-k+1)
    .map(i -> Arrays.stream(nums, i, i+k).max().getAsInt())
    .toArray();`,
    },
  },
  {
    id: 77,
    title: "Kth Largest Element",
    problem:
      "Given an integer array nums and an integer k, return the kth largest element in the array.",
    examples: [
      { input: "nums = [3,2,1,5,6,4], k = 2", output: "5" },
      { input: "nums = [3,2,3,1,2,4,5,5,6], k = 4", output: "4" },
    ],
    tip: "Min-heap of size k: keep only k largest; root is the answer — O(n log k)",
    iteration: {
      hint: "PriorityQueue (min-heap) size k; poll when size > k; top is kth largest",
      snippet: `PriorityQueue<Integer> pq = new PriorityQueue<>();
for (int n : nums) {
    pq.offer(n);
    if (pq.size() > k) pq.poll();
}
return pq.peek();`,
    },
    recursion: {
      hint: "QuickSelect: partition around pivot; recurse only into the relevant side",
      snippet: `int quickSelect(int[] a, int lo, int hi, int k) {
    int p = partition(a, lo, hi);
    if (p == k) return a[p];
    return p < k ? quickSelect(a, p+1, hi, k) : quickSelect(a, lo, p-1, k);
}
// call with k = n - k (index of kth largest)`,
    },
    stream: {
      hint: "Sort descending with stream, skip k-1 elements, take first",
      snippet: `return Arrays.stream(nums).boxed()
    .sorted(Comparator.reverseOrder())
    .skip(k-1).findFirst().get();`,
    },
  },
  {
    id: 78,
    title: "Top K Frequent Elements",
    problem:
      "Given an integer array nums and an integer k, return the k most frequent elements in any order.",
    examples: [
      { input: "nums = [1,1,1,2,2,3], k = 2", output: "[1,2]" },
      { input: "nums = [1], k = 1", output: "[1]" },
    ],
    tip: "Frequency map + min-heap of size k; or bucket sort on frequency — O(n log k)",
    iteration: {
      hint: "Count frequencies, then use min-heap keyed by frequency to keep top k",
      snippet: `Map<Integer,Integer> freq = new HashMap<>();
for (int n : nums) freq.merge(n, 1, Integer::sum);
PriorityQueue<Integer> pq = new PriorityQueue<>(Comparator.comparingInt(freq::get));
for (int key : freq.keySet()) { pq.offer(key); if (pq.size() > k) pq.poll(); }
return pq.stream().mapToInt(Integer::intValue).toArray();`,
    },
    recursion: {
      hint: "Build frequency map recursively; then recursively extract k max-frequency elements",
      snippet: `void count(int[] a, int i, Map<Integer,Integer> m) {
    if (i==a.length) return;
    m.merge(a[i],1,Integer::sum); count(a,i+1,m);
}
// then use min-heap or bucket for top k`,
    },
    stream: {
      hint: "Group by counting, sort entries by value descending, take k keys",
      snippet: `return Arrays.stream(nums).boxed()
    .collect(Collectors.groupingBy(x->x, Collectors.counting()))
    .entrySet().stream()
    .sorted(Map.Entry.<Integer,Long>comparingByValue().reversed())
    .limit(k).mapToInt(Map.Entry::getKey).toArray();`,
    },
  },
  {
    id: 79,
    title: "Median of Two Sorted Arrays",
    problem:
      "Given two sorted arrays nums1 and nums2, return the median of the combined sorted values.",
    examples: [
      { input: "nums1 = [1,3], nums2 = [2]", output: "2.0" },
      { input: "nums1 = [1,2], nums2 = [3,4]", output: "2.5" },
    ],
    tip: "Binary search on the smaller array to find the correct partition — O(log(min(m,n)))",
    iteration: {
      hint: "Partition both arrays so left halves combined have (m+n)/2 elements; adjust with binary search",
      snippet: `if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);
int lo=0, hi=nums1.length, half=(nums1.length+nums2.length+1)/2;
while (lo<=hi) { int i=(lo+hi)/2, j=half-i;
    if (i<hi && nums2[j-1]>nums1[i]) lo=i+1;
    else if (i>lo && nums1[i-1]>nums2[j]) hi=i-1;
    else { int maxL=Math.max(i>0?nums1[i-1]:INT_MIN, j>0?nums2[j-1]:INT_MIN); /* compute */ break; }
}`,
    },
    recursion: {
      hint: "Recursive kth-smallest helper: discard k/2 elements from one array per call",
      snippet: `double kth(int[] a, int i, int[] b, int j, int k) {
    if (i>=a.length) return b[j+k-1];
    if (j>=b.length) return a[i+k-1];
    if (k==1) return Math.min(a[i],b[j]);
    int ma=i+k/2-1<a.length?a[i+k/2-1]:Integer.MAX_VALUE, mb=j+k/2-1<b.length?b[j+k/2-1]:Integer.MAX_VALUE;
    return ma<mb ? kth(a,i+k/2,b,j,k-k/2) : kth(a,i,b,j+k/2,k-k/2);
}`,
    },
    stream: {
      hint: "Merge both arrays into sorted stream, find middle element(s)",
      snippet: `int[] merged = IntStream.concat(Arrays.stream(nums1), Arrays.stream(nums2))
    .sorted().toArray();
int n = merged.length;
return n%2==1 ? merged[n/2] : (merged[n/2-1]+merged[n/2])/2.0;`,
    },
  },
  {
    id: 80,
    title: "Spiral Matrix Traversal",
    problem:
      "Given an m x n matrix, return all elements in spiral order starting from the top-left corner.",
    examples: [
      {
        input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
        output: "[1,2,3,6,9,8,7,4,5]",
      },
      {
        input: "matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]",
        output: "[1,2,3,4,8,12,11,10,9,5,6,7]",
      },
    ],
    tip: "Track four boundaries (top, bottom, left, right) and shrink after each direction — O(m*n)",
    iteration: {
      hint: "Loop: go right, go down, go left, go up; increment/decrement boundaries after each sweep",
      snippet: `int top=0,bot=m-1,left=0,right=n-1;
while (top<=bot && left<=right) {
    for (int i=left;i<=right;i++) res.add(mat[top][i]); top++;
    for (int i=top;i<=bot;i++) res.add(mat[i][right]); right--;
    if (top<=bot) { for (int i=right;i>=left;i--) res.add(mat[bot][i]); bot--; }
    if (left<=right) { for (int i=bot;i>=top;i--) res.add(mat[i][left]); left++; }
}`,
    },
    recursion: {
      hint: "Recursive: process outermost ring, recurse on inner submatrix",
      snippet: `void spiral(int[][] m, int t, int b, int l, int r, List<Integer> res) {
    if (t>b || l>r) return;
    for (int i=l;i<=r;i++) res.add(m[t][i]);
    for (int i=t+1;i<=b;i++) res.add(m[i][r]);
    if (t<b) for (int i=r-1;i>=l;i--) res.add(m[b][i]);
    if (l<r) for (int i=b-1;i>t;i--) res.add(m[i][l]);
    spiral(m,t+1,b-1,l+1,r-1,res);
}`,
    },
    stream: {
      hint: "Flatten layer indices using IntStream; less idiomatic but maps boundary logic to streams",
      snippet: `// Spiral order is inherently sequential; stream the boundary logic
List<Integer> res = new ArrayList<>();
// top row, right col, bottom row, left col per layer
IntStream.range(0, Math.min(m,n+1)/2).forEach(layer -> { /* add 4 sides */ });`,
    },
  },
  {
    id: 81,
    title: "Set Matrix Zeroes",
    problem:
      "Given a matrix, if an element is 0, set its entire row and column to 0 in-place.",
    examples: [
      {
        input: "matrix = [[1,1,1],[1,0,1],[1,1,1]]",
        output: "[[1,0,1],[0,0,0],[1,0,1]]",
      },
      {
        input: "matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]",
        output: "[[0,0,0,0],[0,4,5,0],[0,3,1,0]]",
      },
    ],
    tip: "Record zero positions first using first row/col as markers, then zero out — O(m*n) space O(1)",
    iteration: {
      hint: "Use first row and col as flag arrays; separate bool for first-row and first-col zero status",
      snippet: `boolean fr=false, fc=false;
for (int j=0;j<n;j++) if (mat[0][j]==0) fr=true;
for (int i=0;i<m;i++) if (mat[i][0]==0) fc=true;
for (int i=1;i<m;i++) for (int j=1;j<n;j++) if (mat[i][j]==0) { mat[i][0]=0; mat[0][j]=0; }
for (int i=1;i<m;i++) for (int j=1;j<n;j++) if (mat[i][0]==0||mat[0][j]==0) mat[i][j]=0;
if (fr) Arrays.fill(mat[0],0); if (fc) for (int i=0;i<m;i++) mat[i][0]=0;`,
    },
    recursion: {
      hint: "Collect zero positions recursively, then zero out rows and columns",
      snippet: `void findZeros(int[][] m, int i, int j, Set<Integer> rows, Set<Integer> cols) {
    if (i==m.length) return;
    if (j==m[0].length) { findZeros(m,i+1,0,rows,cols); return; }
    if (m[i][j]==0) { rows.add(i); cols.add(j); }
    findZeros(m,i,j+1,rows,cols);
}`,
    },
    stream: {
      hint: "Collect zero coordinates with streams, then zero rows and columns",
      snippet: `List<int[]> zeros = IntStream.range(0,matrix.length).boxed()
    .flatMap(i->IntStream.range(0,matrix[0].length).filter(j->matrix[i][j]==0).mapToObj(j->new int[]{i,j}))
    .collect(Collectors.toList());
zeros.forEach(p->{ Arrays.fill(matrix[p[0]],0); for(int i=0;i<matrix.length;i++) matrix[i][p[1]]=0; });`,
    },
  },
  {
    id: 82,
    title: "Search in Rotated Sorted Array",
    problem:
      "Given a sorted array rotated at an unknown pivot and an integer target, return target's index or -1 if absent.",
    examples: [
      { input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4" },
      { input: "nums = [4,5,6,7,0,1,2], target = 3", output: "-1" },
    ],
    tip: "Modified binary search: determine which half is sorted, check if target falls in it — O(log n)",
    iteration: {
      hint: "Binary search: check if left half sorted; target in sorted half → search there, else other side",
      snippet: `int lo=0, hi=nums.length-1;
while (lo<=hi) { int mid=(lo+hi)/2;
    if (nums[mid]==target) return mid;
    if (nums[lo]<=nums[mid]) {
        if (nums[lo]<=target && target<nums[mid]) hi=mid-1; else lo=mid+1;
    } else { if (nums[mid]<target && target<=nums[hi]) lo=mid+1; else hi=mid-1; }
}`,
    },
    recursion: {
      hint: "Recursive binary search: same sorted-half logic applied recursively",
      snippet: `int f(int[] a, int lo, int hi, int t) {
    if (lo>hi) return -1;
    int mid=(lo+hi)/2;
    if (a[mid]==t) return mid;
    if (a[lo]<=a[mid]) return (a[lo]<=t && t<a[mid]) ? f(a,lo,mid-1,t) : f(a,mid+1,hi,t);
    return (a[mid]<t && t<=a[hi]) ? f(a,mid+1,hi,t) : f(a,lo,mid-1,t);
}`,
    },
    stream: {
      hint: "Linear scan with stream — O(n); for O(log n) the iterative approach is necessary",
      snippet: `return IntStream.range(0, nums.length)
    .filter(i -> nums[i] == target)
    .findFirst().orElse(-1);`,
    },
  },
  {
    id: 83,
    title: "Find Peak Element",
    problem:
      "Given an array nums where adjacent values are different, return the index of any peak element greater than its neighbors.",
    examples: [
      { input: "nums = [1,2,3,1]", output: "2" },
      { input: "nums = [1,2,1,3,5,6,4]", output: "1 or 5" },
    ],
    tip: "Binary search: if mid < mid+1, peak is to the right; else to the left or at mid — O(log n)",
    iteration: {
      hint: "Binary search: move toward the larger neighbor to guarantee finding a peak",
      snippet: `int lo=0, hi=nums.length-1;
while (lo<hi) {
    int mid=(lo+hi)/2;
    if (nums[mid]<nums[mid+1]) lo=mid+1;
    else hi=mid;
}
return lo;`,
    },
    recursion: {
      hint: "Recursive binary search with same neighbor comparison logic",
      snippet: `int f(int[] a, int lo, int hi) {
    if (lo==hi) return lo;
    int mid=(lo+hi)/2;
    return a[mid]<a[mid+1] ? f(a,mid+1,hi) : f(a,lo,mid);
}`,
    },
    stream: {
      hint: "Filter indices where element exceeds both neighbors; find first (linear)",
      snippet: `return IntStream.range(0, nums.length)
    .filter(i -> (i==0||nums[i]>nums[i-1]) && (i==nums.length-1||nums[i]>nums[i+1]))
    .findFirst().orElse(-1);`,
    },
  },
  {
    id: 84,
    title: "Gas Station",
    problem:
      "Given gas and cost arrays for circular stations, return the starting station index that can complete the circuit, or -1 if impossible.",
    examples: [
      { input: "gas = [1,2,3,4,5], cost = [3,4,5,1,2]", output: "3" },
      { input: "gas = [2,3,4], cost = [3,4,3]", output: "-1" },
    ],
    tip: "If total gas >= total cost, a solution exists; greedy finds start by resetting when tank < 0 — O(n)",
    iteration: {
      hint: "Track total tank and current tank; reset start index when current tank goes negative",
      snippet: `int total=0, tank=0, start=0;
for (int i=0; i<gas.length; i++) {
    total += gas[i]-cost[i];
    tank  += gas[i]-cost[i];
    if (tank < 0) { start = i+1; tank = 0; }
}
return total >= 0 ? start : -1;`,
    },
    recursion: {
      hint: "Recursive simulation: track tank and index; try each start point recursively",
      snippet: `boolean canComplete(int[] g, int[] c, int i, int start, int tank, int n) {
    if (i-start==n) return tank>=0;
    tank += g[i%n]-c[i%n];
    if (tank<0) return false;
    return canComplete(g,c,i+1,start,tank,n);
}
// O(n²); the greedy iterative is preferred`,
    },
    stream: {
      hint: "Compute net gain per station; find starting index using prefix sum analysis",
      snippet: `int[] net = IntStream.range(0, gas.length).map(i->gas[i]-cost[i]).toArray();
int total = Arrays.stream(net).sum();
if (total < 0) return -1;
// find start where prefix never dips below 0 (use iteration above)`,
    },
  },
  {
    id: 85,
    title: "Candy Distribution",
    problem:
      "Given children's ratings, return the minimum candies needed so each child has at least one candy and higher-rated neighbors get more.",
    examples: [
      { input: "ratings = [1,0,2]", output: "5" },
      { input: "ratings = [1,2,2]", output: "4" },
    ],
    tip: "Two passes: left-to-right for ascending, right-to-left for descending — O(n)",
    iteration: {
      hint: "Initialize all to 1; pass left→right boost ascending neighbors; pass right→left boost descending",
      snippet: `int n=ratings.length; int[] candy=new int[n]; Arrays.fill(candy,1);
for (int i=1;i<n;i++) if (ratings[i]>ratings[i-1]) candy[i]=candy[i-1]+1;
for (int i=n-2;i>=0;i--) if (ratings[i]>ratings[i+1]) candy[i]=Math.max(candy[i],candy[i+1]+1);
return Arrays.stream(candy).sum();`,
    },
    recursion: {
      hint: "Build left-pass and right-pass arrays recursively, then take max per position",
      snippet: `void leftPass(int[] r, int[] c, int i) {
    if (i==r.length) return;
    if (i>0 && r[i]>r[i-1]) c[i]=c[i-1]+1;
    leftPass(r,c,i+1);
}
// similarly rightPass; then sum max(left[i],right[i])`,
    },
    stream: {
      hint: "Compute left and right arrays, then stream to sum element-wise maximums",
      snippet: `int[] l=new int[n], r=new int[n]; Arrays.fill(l,1); Arrays.fill(r,1);
for (int i=1;i<n;i++) if (ratings[i]>ratings[i-1]) l[i]=l[i-1]+1;
for (int i=n-2;i>=0;i--) if (ratings[i]>ratings[i+1]) r[i]=r[i+1]+1;
return IntStream.range(0,n).map(i->Math.max(l[i],r[i])).sum();`,
    },
  },
  {
    id: 86,
    title: "Trapping Rain Water",
    problem:
      "Given bar heights, return how much rain water can be trapped between the bars after raining.",
    examples: [
      { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" },
      { input: "height = [4,2,0,3,2,5]", output: "9" },
    ],
    tip: "Two-pointer with running maxLeft and maxRight — trapped water at i = min(maxL,maxR) - h[i] — O(n)",
    iteration: {
      hint: "l=0,r=n-1; whichever side has smaller max, compute water and advance that pointer",
      snippet: `int l=0,r=height.length-1,maxL=0,maxR=0,water=0;
while (l<r) {
    if (height[l]<height[r]) { maxL=Math.max(maxL,height[l]); water+=maxL-height[l]; l++; }
    else { maxR=Math.max(maxR,height[r]); water+=maxR-height[r]; r--; }
}
return water;`,
    },
    recursion: {
      hint: "Build prefix maxLeft and maxRight arrays recursively; compute water in another pass",
      snippet: `void buildMax(int[] h, int[] mL, int i) {
    if (i==h.length) return;
    mL[i] = i==0 ? h[0] : Math.max(mL[i-1],h[i]);
    buildMax(h,mL,i+1);
}
// similarly right max; then sum Math.min(mL[i],mR[i])-h[i]`,
    },
    stream: {
      hint: "Build prefix left-max and suffix right-max arrays, then stream to sum trapped water",
      snippet: `int n=height.length; int[] lMax=new int[n], rMax=new int[n];
for(int i=1;i<n;i++) lMax[i]=Math.max(lMax[i-1],height[i-1]);
for(int i=n-2;i>=0;i--) rMax[i]=Math.max(rMax[i+1],height[i+1]);
return IntStream.range(0,n).map(i->Math.max(0,Math.min(lMax[i],rMax[i])-height[i])).sum();`,
    },
  },
  {
    id: 87,
    title: "Next Permutation",
    problem:
      "Given an integer array representing a permutation, rearrange it into the next lexicographically greater permutation, or the lowest order if none exists.",
    examples: [
      { input: "nums = [1,2,3]", output: "[1,3,2]" },
      { input: "nums = [3,2,1]", output: "[1,2,3]" },
    ],
    tip: "Find rightmost ascent, swap with next larger from right, reverse the suffix — O(n)",
    iteration: {
      hint: "Step 1: find i where nums[i]<nums[i+1] from right. Step 2: swap with smallest nums[j]>nums[i] from right. Step 3: reverse from i+1",
      snippet: `int i=nums.length-2;
while (i>=0 && nums[i]>=nums[i+1]) i--;
if (i>=0) { int j=nums.length-1; while (nums[j]<=nums[i]) j--; swap(nums,i,j); }
reverse(nums, i+1, nums.length-1);`,
    },
    recursion: {
      hint: "Recursive reverse of suffix; find pivot and swap iteratively (reverse is the recursive part)",
      snippet: `void rev(int[] a, int l, int r) {
    if (l>=r) return;
    int t=a[l]; a[l]=a[r]; a[r]=t;
    rev(a,l+1,r-1);
}
// use iterative logic to find pivot i and swap, then call rev(nums,i+1,n-1)`,
    },
    stream: {
      hint: "Streams are stateful/sequential here; locate pivot index with IntStream, then apply swaps",
      snippet: `int n=nums.length;
int i=IntStream.iterate(n-2,x->x-1).limit(n-1).filter(x->nums[x]<nums[x+1]).findFirst().orElse(-1);
// swap nums[i] with correct j, then reverse suffix — best done with loops`,
    },
  },
  {
    id: 88,
    title: "First Missing Positive",
    problem:
      "Given an unsorted integer array nums, return the smallest missing positive integer.",
    examples: [
      { input: "nums = [1,2,0]", output: "3" },
      { input: "nums = [3,4,-1,1]", output: "2" },
    ],
    tip: "Place each number at its correct index (nums[i]-1); then scan for first index where nums[i]!=i+1 — O(n)",
    iteration: {
      hint: "Cycle sort: while nums[i] in [1,n] and not at correct position, swap to place",
      snippet: `int n=nums.length;
for (int i=0;i<n;i++)
    while (nums[i]>0 && nums[i]<=n && nums[nums[i]-1]!=nums[i])
        swap(nums, i, nums[i]-1);
for (int i=0;i<n;i++) if (nums[i]!=i+1) return i+1;
return n+1;`,
    },
    recursion: {
      hint: "Mark present positives by negating at index; recurse through array then find first positive index",
      snippet: `void mark(int[] a, int i) {
    if (i==a.length) return;
    int v=Math.abs(a[i]);
    if (v>=1 && v<=a.length && a[v-1]>0) a[v-1]=-a[v-1];
    mark(a,i+1);
}`,
    },
    stream: {
      hint: "Collect positives into a set, then stream 1..n+1 to find the first absent",
      snippet: `Set<Integer> s=Arrays.stream(nums).filter(x->x>0).boxed().collect(Collectors.toSet());
return IntStream.rangeClosed(1,nums.length+1).filter(x->!s.contains(x)).findFirst().getAsInt();`,
    },
  },
  {
    id: 89,
    title: "Jump Game",
    problem:
      "Given nums where nums[i] is the maximum jump length from index i, return true if you can reach the last index.",
    examples: [
      { input: "nums = [2,3,1,1,4]", output: "true" },
      { input: "nums = [3,2,1,0,4]", output: "false" },
    ],
    tip: "Track the farthest index reachable; if current index exceeds it, return false — O(n)",
    iteration: {
      hint: "maxReach = max(maxReach, i + nums[i]); return false if i > maxReach before end",
      snippet: `int maxReach = 0;
for (int i = 0; i < nums.length; i++) {
    if (i > maxReach) return false;
    maxReach = Math.max(maxReach, i + nums[i]);
}
return true;`,
    },
    recursion: {
      hint: "Recursive from the end: target index shrinks whenever a position can reach it",
      snippet: `boolean canJump(int[] a, int goal) {
    if (goal == 0) return true;
    for (int i=goal-1;i>=0;i--)
        if (i+a[i]>=goal) return canJump(a,i);
    return false;
}`,
    },
    stream: {
      hint: "Reduce with running max-reach; result is whether final reach >= last index",
      snippet: `int n=nums.length;
int[] reach={0};
return IntStream.range(0,n).allMatch(i -> {
    if (i>reach[0]) return false;
    reach[0]=Math.max(reach[0],i+nums[i]); return true;
});`,
    },
  },
  {
    id: 90,
    title: "Jump Game II",
    problem:
      "Given nums where nums[i] is the maximum jump length from index i, return the minimum number of jumps needed to reach the last index.",
    examples: [
      { input: "nums = [2,3,1,1,4]", output: "2" },
      { input: "nums = [2,3,0,1,4]", output: "2" },
    ],
    tip: "Greedy: at each step extend currentEnd to farthest reachable; increment jumps when reaching currentEnd — O(n)",
    iteration: {
      hint: "Track farthest and currentEnd; jump count increments when i reaches currentEnd",
      snippet: `int jumps=0, curEnd=0, farthest=0;
for (int i=0; i<nums.length-1; i++) {
    farthest = Math.max(farthest, i+nums[i]);
    if (i == curEnd) { jumps++; curEnd = farthest; }
}
return jumps;`,
    },
    recursion: {
      hint: "Recursive BFS-style: from current window [lo,hi] expand to next window in one jump",
      snippet: `int f(int[] a, int lo, int hi, int jumps) {
    if (hi >= a.length-1) return jumps;
    int nextHi=IntStream.rangeClosed(lo,hi).map(i->i+a[i]).max().getAsInt();
    return f(a, hi+1, nextHi, jumps+1);
}`,
    },
    stream: {
      hint: "Simulate BFS layers with IntStream; each layer = one jump, expand to max reach",
      snippet: `int[] state={0,0,0}; // jumps, lo, hi
while (state[2]<nums.length-1) {
    int nextHi=IntStream.rangeClosed(state[1],state[2]).map(i->i+nums[i]).max().getAsInt();
    state=new int[]{state[0]+1, state[2]+1, nextHi};
}
return state[0];`,
    },
  },
  {
    id: 91,
    title: "Split Array Largest Sum",
    problem:
      "Given nums and an integer k, split nums into k non-empty contiguous subarrays minimizing the largest subarray sum.",
    examples: [
      { input: "nums = [7,2,5,10,8], k = 2", output: "18" },
      { input: "nums = [1,2,3,4,5], k = 2", output: "9" },
    ],
    tip: "Binary search on the answer (max subarray sum); validate split count greedily — O(n log S)",
    iteration: {
      hint: "lo=max(nums), hi=sum(nums); binary search mid; check if mid allows <= m subarrays",
      snippet: `int lo=Arrays.stream(nums).max().getAsInt(), hi=Arrays.stream(nums).sum();
while (lo<hi) { int mid=(lo+hi)/2;
    int cnt=1,cur=0;
    for (int n:nums) { if (cur+n>mid){cnt++;cur=0;} cur+=n; }
    if (cnt<=k) hi=mid; else lo=mid+1;
}
return lo;`,
    },
    recursion: {
      hint: "Memoized DP: f(i,k) = min largest sum splitting nums[i..] into k parts",
      snippet: `int dp(int[] a, int i, int k, int[][] memo) {
    if (k==1) return Arrays.stream(a,i,a.length).sum();
    if (memo[i][k]!=-1) return memo[i][k];
    int cur=0,best=Integer.MAX_VALUE;
    for (int j=i;j<=a.length-k;j++) { cur+=a[j];
        best=Math.min(best,Math.max(cur,dp(a,j+1,k-1,memo))); }
    return memo[i][k]=best;
}`,
    },
    stream: {
      hint: "Build prefix sum with stream; binary search bounds from stream min/sum",
      snippet: `int[] pre=new int[nums.length+1];
IntStream.range(0,nums.length).forEach(i->pre[i+1]=pre[i]+nums[i]);
int lo=Arrays.stream(nums).max().getAsInt(), hi=pre[nums.length];
// binary search with greedy check (use iterative loop above)`,
    },
  },
  {
    id: 92,
    title: "Maximum Product Subarray",
    problem:
      "Given an integer array nums, return the maximum product of a non-empty contiguous subarray.",
    examples: [
      { input: "nums = [2,3,-2,4]", output: "6" },
      { input: "nums = [-2,0,-1]", output: "0" },
    ],
    tip: "Track both max and min products (negatives can flip); update global max each step — O(n)",
    iteration: {
      hint: "curMax and curMin reset at each element; negative multiplied by min can become new max",
      snippet: `int max=nums[0], curMax=nums[0], curMin=nums[0];
for (int i=1; i<nums.length; i++) {
    int tmp=curMax;
    curMax=Math.max(nums[i], Math.max(curMax*nums[i], curMin*nums[i]));
    curMin=Math.min(nums[i], Math.min(tmp*nums[i], curMin*nums[i]));
    max=Math.max(max, curMax);
}
return max;`,
    },
    recursion: {
      hint: "Recursive with (maxEndingHere, minEndingHere, globalMax) tuple through parameters",
      snippet: `int[] f(int[] a, int i, int curMax, int curMin, int best) {
    if (i==a.length) return new int[]{best};
    int newMax=Math.max(a[i],Math.max(curMax*a[i],curMin*a[i]));
    int newMin=Math.min(a[i],Math.min(curMax*a[i],curMin*a[i]));
    return f(a,i+1,newMax,newMin,Math.max(best,newMax));
}`,
    },
    stream: {
      hint: "Reduce with an int[] accumulator tracking [curMax, curMin, globalMax]",
      snippet: `int[] r=Arrays.stream(nums).boxed().reduce(
    new int[]{nums[0],nums[0],nums[0]},
    (acc,x)->{ int mx=Math.max(x,Math.max(acc[0]*x,acc[1]*x)), mn=Math.min(x,Math.min(acc[0]*x,acc[1]*x));
               return new int[]{mx,mn,Math.max(acc[2],mx)}; },
    (a,b)->a);
return r[2];`,
    },
  },
];
