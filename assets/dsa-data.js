window.DSA_DATA = {
  parts: [
    /* ─────────────────────────────────────────────
       PART 1 · FUNDAMENTALS
    ───────────────────────────────────────────── */
    {
      label: "PART 1 · FUNDAMENTALS",
      sections: [
        {
          id: "complexity",
          n: 1,
          title: "Space & Time Complexity — Big-O Analysis",
          desc: "Before writing any algorithm, know how to measure its efficiency. Big-O tells you how runtime/memory grows as input grows.",
          questions: [
            {
              n: 1,
              t: "What is Big-O, Big-Omega, Big-Theta?",
              d: ["beginner"],
              a: `
<p><strong>Big-O (O)</strong> = worst-case upper bound &nbsp;|&nbsp; <strong>Big-Omega (Ω)</strong> = best-case lower bound &nbsp;|&nbsp; <strong>Big-Theta (Θ)</strong> = tight bound (avg case matches worst)</p>
<pre>COMPLEXITY LADDER (fastest → slowest):

O(1)      constant   → HashMap lookup, array access by index
O(log n)  logarithmic→ binary search (halves input each step)
O(n)      linear     → single loop through array
O(n log n)           → merge sort, heap sort
O(n²)     quadratic  → nested loops (bubble sort)
O(2ⁿ)    exponential→ recursive subsets
O(n!)     factorial  → recursive permutations

For n = 1,000:
  O(1)      →            1 op
  O(log n)  →           10 ops
  O(n)      →        1,000 ops
  O(n log n)→       10,000 ops
  O(n²)     →    1,000,000 ops   ← still OK
  O(2ⁿ)     → 10^301 ops        ← impossible!</pre>
<div class="tip-box"><strong>How to identify from code:</strong><br>
Single loop → O(n) · Nested loops → O(n²) · Loop that halves → O(log n) · Recursion branching 2x → O(2ⁿ) · Sorting inside loop → O(n² log n)</div>
<pre>// O(1) — no loop, fixed work
int getFirst(int[] a) { return a[0]; }

// O(log n) — input halves each step
while (n > 1) { n /= 2; steps++; }

// O(n) — one pass
for (int x : arr) process(x);

// O(n²) — nested loops
for (int i=0;i<n;i++)
  for (int j=0;j<n;j++) work();

// O(2ⁿ) — two recursive calls
int fib(int n){ return n<=1?n:fib(n-1)+fib(n-2); }</pre>`,
            },
            {
              n: 2,
              t: "Space Complexity — Stack space, auxiliary space",
              d: ["beginner", "intermediate"],
              a: `
<p>Space complexity = <strong>extra memory</strong> your algorithm uses beyond the input. Includes: variables, call stack (recursion), auxiliary arrays.</p>
<pre>EXAMPLES:

Iterative reverse array → O(1) space (swap in-place, no extra array)
Merge Sort              → O(n) space (temp arrays for merging)
Recursive factorial(n)  → O(n) stack space (n frames on call stack)
HashMap of n entries    → O(n) space

RECURSION CALL STACK:
factorial(4)
  factorial(3)
    factorial(2)
      factorial(1)   ← deepest frame
      returns 1
    returns 2
  returns 6
returns 24

4 frames on stack simultaneously → O(n) space

SPACE vs TIME TRADE-OFF:
  Memoization (DP): use O(n) extra space to save O(2ⁿ) time
  In-place sort:    use O(1) space but may be slower
  Prefix sum array: use O(n) space to answer queries in O(1)</pre>`,
            },
          ],
        },
        {
          id: "recursion",
          n: 2,
          title: "Recursion — The Foundation of Many Algorithms",
          desc: "Recursion = a function that calls itself. Every recursive solution has a BASE CASE (stop) and a RECURSIVE CASE (reduce & call). Master this before trees, graphs, backtracking, DP.",
          questions: [
            {
              n: 3,
              t: "How does recursion work? Call stack visualization",
              d: ["beginner"],
              a: `
<p>When a function calls itself, each call is pushed onto the <strong>call stack</strong>. When the base case is reached, the stack unwinds (returns up).</p>
<pre>factorial(n) = n × factorial(n-1)
Base case:    factorial(0) = 1

CALL STACK for factorial(4):

PUSH ──▶  factorial(4)  → waits for factorial(3)
PUSH ──▶    factorial(3)  → waits for factorial(2)
PUSH ──▶      factorial(2)  → waits for factorial(1)
PUSH ──▶        factorial(1)  → waits for factorial(0)
PUSH ──▶          factorial(0) → BASE CASE → returns 1

POP  ◀──          returns 1
POP  ◀──        factorial(1) = 1×1 = 1 → returns 1
POP  ◀──      factorial(2) = 2×1 = 2 → returns 2
POP  ◀──    factorial(3) = 3×2 = 6 → returns 6
POP  ◀──  factorial(4) = 4×6 = 24 ✓

TWO PHASES:
  1. WINDING   (going down) — each call reduces the problem
  2. UNWINDING (coming up)  — results are combined on the way back</pre>
<div class="tip-box"><strong>Recursion template:</strong><br>
1. Base case — what stops the recursion?<br>
2. Recursive case — how to reduce to a smaller problem?<br>
3. Trust the recursion — assume the recursive call returns correctly</div>
<pre>int factorial(int n) {
    if (n == 0) return 1;           // BASE CASE
    return n * factorial(n - 1);    // RECURSIVE CASE
}

// Fibonacci — two recursive calls (binary recursion)
int fib(int n) {
    if (n <= 1) return n;           // base: fib(0)=0, fib(1)=1
    return fib(n-1) + fib(n-2);    // TWO calls → O(2ⁿ) without memo
}</pre>`,
            },
            {
              n: 4,
              t: "Recursion Tree — Visualizing recursive calls",
              d: ["beginner", "intermediate"],
              a: `
<p>Draw a recursion tree to count total calls and understand time complexity. Each node = one function call.</p>
<pre>fib(4) RECURSION TREE:

                    fib(4)
                   /      \\
              fib(3)       fib(2)
             /     \\       /    \\
         fib(2)  fib(1) fib(1) fib(0)
         /    \\
      fib(1) fib(0)

Total calls = 9  (for n=4)
Pattern: ~2ⁿ calls → O(2ⁿ) time, O(n) space (max depth = n)

fib(0),fib(1) computed MULTIPLE TIMES → overlapping subproblems
→ use MEMOIZATION to cache results → O(n) time

SUM OF ARRAY via recursion:
sum([1,2,3,4,5])
  = arr[0] + sum([2,3,4,5])
  = 1 + (2 + sum([3,4,5]))
  = 1 + 2 + (3 + sum([4,5]))
  = 1 + 2 + 3 + (4 + sum([5]))
  = 1 + 2 + 3 + 4 + (5 + sum([]))
  = 1 + 2 + 3 + 4 + 5 + 0 = 15 ✓</pre>
<pre>// Sum of array recursively
int sum(int[] arr, int i) {
    if (i == arr.length) return 0;    // base: empty
    return arr[i] + sum(arr, i + 1); // add current + rest
}

// Print 1 to N
void print1toN(int n) {
    if (n == 0) return;      // base case
    print1toN(n - 1);        // go down first
    System.out.println(n);  // print on way BACK UP
}

// Print N to 1
void printNto1(int n) {
    if (n == 0) return;
    System.out.println(n);  // print on way DOWN
    printNto1(n - 1);
}</pre>`,
            },
            {
              n: 5,
              t: "Recursion Patterns — Subsets, Subsequences via recursion",
              d: ["intermediate"],
              a: `
<p>Every subset/subsequence problem = at each element, make a binary choice: <strong>include</strong> or <strong>exclude</strong>. Recurse on both branches.</p>
<pre>SUBSETS of [1, 2, 3] — include/exclude pattern:

                   []
            ┌──────┴──────┐
         include 1      exclude 1
           [1]              []
          ┌─┴─┐           ┌─┴─┐
       incl 2 excl 2   incl 2 excl 2
        [1,2]  [1]     [2]    []
        ┌─┴─┐  ┌─┴─┐  ┌─┴─┐  ┌─┴─┐
       [1,2,3][1,2][1,3][1][2,3][2][3][]

All 8 subsets (2³) generated ✓

SUBSEQUENCES of "abc":
  Same pattern — include/exclude each character
  All subsequences: "", "a","b","c","ab","ac","bc","abc"
  Count = 2ⁿ where n = string length</pre>
<div class="tip-box"><strong>🔥 Problems using include/exclude recursion:</strong><br>
Subsets · Power Set · Subsequences · Combination Sum · Partition Equal Subset Sum · Target Sum</div>
<pre>// Generate all subsets
void subsets(int[] arr, int idx, List&lt;Integer&gt; current, List&lt;List&lt;Integer&gt;&gt; result) {
    if (idx == arr.length) {
        result.add(new ArrayList&lt;&gt;(current)); // base: record subset
        return;
    }
    // INCLUDE arr[idx]
    current.add(arr[idx]);
    subsets(arr, idx + 1, current, result);
    // EXCLUDE arr[idx]  (backtrack)
    current.remove(current.size() - 1);
    subsets(arr, idx + 1, current, result);
}

// Generate all subsequences of a string
void subsequences(String s, int idx, StringBuilder cur, List&lt;String&gt; res) {
    if (idx == s.length()) { res.add(cur.toString()); return; }
    cur.append(s.charAt(idx));            // include
    subsequences(s, idx+1, cur, res);
    cur.deleteCharAt(cur.length()-1);     // exclude (backtrack)
    subsequences(s, idx+1, cur, res);
}</pre>`,
            },
            {
              n: 6,
              t: "Tower of Hanoi — Classic recursion problem",
              d: ["intermediate"],
              a: `
<p>Move n disks from source peg to destination peg using a helper peg. Rule: never place a larger disk on a smaller one.</p>
<pre>TOWER OF HANOI (n=3 disks):

Initial:    A(src)      B(helper)   C(dest)
           [===]          []          []
          [=====]
         [=======]

Solution uses 2ⁿ - 1 = 7 moves for n=3

RECURSIVE INSIGHT:
  To move n disks from A to C using B:
  1. Move top (n-1) disks from A to B  (using C as helper)
  2. Move the biggest disk from A to C
  3. Move (n-1) disks from B to C      (using A as helper)

For n=3:
  hanoi(3, A, C, B):
    hanoi(2, A, B, C)  → move 2 small disks to B
    move disk 3: A→C
    hanoi(2, B, C, A)  → move 2 small disks to C

Total moves = 2³ - 1 = 7</pre>
<pre>void hanoi(int n, char src, char dest, char helper) {
    if (n == 1) {
        System.out.println("Move disk 1: " + src + " → " + dest);
        return;
    }
    hanoi(n-1, src, helper, dest);    // move n-1 to helper
    System.out.println("Move disk "+n+": "+src+" → "+dest);
    hanoi(n-1, helper, dest, src);   // move n-1 from helper to dest
}
// hanoi(3, 'A', 'C', 'B');</pre>`,
            },
          ],
        },
      ],
    },

    /* ─────────────────────────────────────────────
       PART 2 · DATA STRUCTURES
    ───────────────────────────────────────────── */
    {
      label: "PART 2 · DATA STRUCTURES",
      sections: [
        {
          id: "arrays",
          n: 3,
          title: "Arrays — Contiguous Memory, O(1) Access",
          desc: "The most fundamental data structure. Every DSA concept builds on arrays. Master prefix sum, sliding window, and two-pointer techniques here.",
          questions: [
            {
              n: 7,
              t: "Array memory layout and operations",
              d: ["beginner"],
              a: `
<pre>int[] arr = {3, 7, 1, 9, 4, 2}

INDEX :  [0]  [1]  [2]  [3]  [4]  [5]
        ┌────┬────┬────┬────┬────┬────┐
DATA  : │  3 │  7 │  1 │  9 │  4 │  2│
        └────┴────┴────┴────┴────┴────┘
ADDR  : 100  104  108  112  116  120   (int = 4 bytes)

arr[i] address = base(100) + i × 4   → O(1) access ✓</pre>
<table>
  <tr><th>Operation</th><th>Time</th><th>Reason</th></tr>
  <tr><td>Access arr[i]</td><td>O(1)</td><td>Direct address formula</td></tr>
  <tr><td>Search unsorted</td><td>O(n)</td><td>Must scan every element</td></tr>
  <tr><td>Search sorted</td><td>O(log n)</td><td>Binary search possible</td></tr>
  <tr><td>Insert at end</td><td>O(1)*</td><td>Place at next slot</td></tr>
  <tr><td>Insert at middle</td><td>O(n)</td><td>Shift right</td></tr>
  <tr><td>Delete at middle</td><td>O(n)</td><td>Shift left</td></tr>
</table>
<div class="tip-box"><strong>🔥 Key array problems:</strong> Two Sum · Max Subarray (Kadane's) · Trapping Rain Water · Next Permutation · Rotate Array · Merge Intervals · Product Except Self · Missing Number</div>
<pre>// 2D array — row-major storage
int[][] matrix = new int[rows][cols];
// matrix[i][j] at address = base + (i*cols + j)*4</pre>`,
            },
            {
              n: 8,
              t: "Prefix Sum — Range queries in O(1)",
              d: ["intermediate"],
              a: `
<pre>arr    = [2,  4,  1,  6,  3,  5]
prefix = [2,  6,  7, 13, 16, 21]  (cumulative)

Sum from index l=2 to r=4:
  = prefix[4] - prefix[1]
  = 16 - 6 = 10   (1+6+3=10) ✓</pre>
<div class="tip-box"><strong>🔥 Problems:</strong> Range Sum Query · Subarray Sum Equals K · Find Pivot Index · Count Subarrays with Given XOR · Equilibrium Index</div>
<pre>int[] prefix = new int[n];
prefix[0] = arr[0];
for (int i=1;i&lt;n;i++) prefix[i]=prefix[i-1]+arr[i];

// Query [l,r]
int rangeSum(int l, int r){ return prefix[r]-(l>0?prefix[l-1]:0); }

// Subarray sum = k  using HashMap O(n)
Map&lt;Integer,Integer&gt; map = new HashMap&lt;&gt;();
map.put(0,1); int sum=0, count=0;
for(int x:arr){ sum+=x; count+=map.getOrDefault(sum-k,0); map.merge(sum,1,Integer::sum); }</pre>`,
            },
            {
              n: 9,
              t: "Kadane's Algorithm — Maximum Subarray O(n)",
              d: ["intermediate"],
              a: `
<p>Key insight: if the running sum becomes negative, reset it — a negative prefix only hurts future sums.</p>
<pre>arr = [-2, 1,-3, 4,-1, 2, 1,-5, 4]

idx:   0   1   2   3   4   5   6   7   8
cur:  -2   1  -2   4   3   5   6   1   5
             ↑reset↑
glo:  -2   1   1   4   4   5  [6]  6   6

Answer = 6  (subarray [4,-1,2,1])</pre>
<pre>int maxSubArray(int[] nums){
    int cur=nums[0], best=nums[0];
    for(int i=1;i&lt;nums.length;i++){
        cur=Math.max(nums[i], cur+nums[i]);
        best=Math.max(best,cur);
    }
    return best;
}</pre>`,
            },
            {
              n: 10,
              t: "Cyclic Sort — Find missing/duplicate in O(n)",
              d: ["intermediate"],
              a: `
<p>For array with values in range [1..n]: value x belongs at index x-1. Swap everything to its correct place, then scan for mismatches.</p>
<pre>arr = [3,1,5,4,2]  range [1..5]
i=0: arr[0]=3→idx2, swap(0,2) → [5,1,3,4,2]
i=0: arr[0]=5→idx4, swap(0,4) → [2,1,3,4,5]
i=0: arr[0]=2→idx1, swap(0,1) → [1,2,3,4,5] ✓</pre>
<div class="tip-box"><strong>🔥 Cyclic Sort problems:</strong> Missing Number (LC 268) · Find Duplicate (LC 287) · All Missing Numbers (LC 448) · All Duplicates (LC 442) · Set Mismatch (LC 765) · First Missing Positive (LC 41)</div>
<pre>void cyclicSort(int[] nums){
    int i=0;
    while(i&lt;nums.length){
        int j=nums[i]-1;
        if(nums[i]!=nums[j]) { int t=nums[i];nums[i]=nums[j];nums[j]=t; }
        else i++;
    }
}</pre>`,
            },
          ],
        },
        {
          id: "strings",
          n: 4,
          title: "Strings — Character Arrays & Pattern Problems",
          desc: "In Java, Strings are immutable objects. Use StringBuilder for mutations. Key patterns: two pointers, sliding window, hashing on strings.",
          questions: [
            {
              n: 11,
              t: "String immutability and StringBuilder",
              d: ["beginner"],
              a: `
<pre>Java String is IMMUTABLE — every modification creates a new object:

String s = "hello";
s = s + " world";   // creates NEW String "hello world"
                     // old "hello" becomes garbage

For n concatenations in a loop → O(n²) time (copy each time)

StringBuilder (mutable):
StringBuilder sb = new StringBuilder("hello");
sb.append(" world");   // O(1) amortized — modifies in place
sb.insert(5, ",");
sb.reverse();
sb.deleteCharAt(0);
String result = sb.toString();   // O(n) to convert</pre>
<div class="tip-box"><strong>🔥 Key string problems:</strong> Valid Anagram · Longest Palindromic Substring · Longest Common Prefix · String Compression · Reverse Words · Valid Palindrome · Count and Say · Roman to Integer</div>
<pre>// Check anagram — use char frequency array O(n)
boolean isAnagram(String s, String t){
    if(s.length()!=t.length()) return false;
    int[] freq=new int[26];
    for(char c:s.toCharArray()) freq[c-'a']++;
    for(char c:t.toCharArray()) { freq[c-'a']--; if(freq[c-'a']&lt;0) return false; }
    return true;
}

// Longest palindromic substring — expand from center O(n²)
String expand(String s, int l, int r){
    while(l>=0 && r&lt;s.length() && s.charAt(l)==s.charAt(r)){l--;r++;}
    return s.substring(l+1,r);
}
// Try each center (odd and even length palindromes)</pre>`,
            },
          ],
        },
        {
          id: "ll-singly",
          n: 5,
          title: "Linked List (Singly) — Dynamic Node Chains",
          desc: "Nodes linked by pointers. No random access but O(1) insert/delete at known position. Master pointer manipulation and fast-slow pointer technique.",
          questions: [
            {
              n: 12,
              t: "Singly Linked List — structure and operations",
              d: ["beginner"],
              a: `
<pre>HEAD
 ↓
[3|•]──▶[7|•]──▶[1|•]──▶[9|•]──▶null
  node1    node2    node3    node4

class ListNode { int val; ListNode next; }

INSERT at head (O(1)):    newNode.next = head; head = newNode;
INSERT at tail (O(n)):    traverse to last, last.next = newNode;
DELETE node after p(O(1)):p.next = p.next.next;</pre>
<table>
  <tr><th>Op</th><th>Array</th><th>LinkedList</th></tr>
  <tr><td>Access[i]</td><td>O(1)</td><td>O(n)</td></tr>
  <tr><td>Insert head</td><td>O(n)</td><td>O(1)</td></tr>
  <tr><td>Insert tail</td><td>O(1)*</td><td>O(n)</td></tr>
  <tr><td>Search</td><td>O(n)</td><td>O(n)</td></tr>
</table>
<pre>// Reverse singly linked list — O(n) time O(1) space
ListNode reverse(ListNode head){
    ListNode prev=null, curr=head;
    while(curr!=null){
        ListNode nxt=curr.next;
        curr.next=prev;
        prev=curr;
        curr=nxt;
    }
    return prev;
}</pre>`,
            },
            {
              n: 13,
              t: "Fast & Slow Pointers — cycle detection, find middle",
              d: ["intermediate"],
              a: `
<pre>CYCLE DETECTION (Floyd's Algorithm):
slow moves 1 step, fast moves 2 steps.
If cycle exists → they MEET.

 1──▶2──▶3──▶4──▶5
               ↑        |
               └────────┘
Step1: slow=1,fast=1
Step2: slow=2,fast=3
Step3: slow=3,fast=5
Step4: slow=4,fast=4  ← MEET ✓

FIND MIDDLE (no cycle):
[1]→[2]→[3]→[4]→[5]→null
Step1: slow=2,fast=3
Step2: slow=3,fast=5(→null stops)
MIDDLE = slow = node(3) ✓</pre>
<div class="tip-box"><strong>🔥 Fast/Slow Problems:</strong> Linked List Cycle · Find Cycle Start · Find Middle · Happy Number · Find Duplicate (Floyd on array)</div>
<pre>boolean hasCycle(ListNode head){
    ListNode s=head,f=head;
    while(f!=null&&f.next!=null){
        s=s.next; f=f.next.next;
        if(s==f) return true;
    }
    return false;
}
ListNode findMiddle(ListNode head){
    ListNode s=head,f=head;
    while(f!=null&&f.next!=null){s=s.next;f=f.next.next;}
    return s;
}</pre>`,
            },
          ],
        },
        {
          id: "ll-doubly",
          n: 6,
          title: "Doubly & Circular Linked List",
          desc: "Doubly LL has prev+next pointers — O(1) backward traversal. Circular LL has tail pointing back to head. Used in LRU Cache, deque implementations.",
          questions: [
            {
              n: 14,
              t: "Doubly Linked List — prev and next pointers",
              d: ["beginner", "intermediate"],
              a: `
<pre>DOUBLY LINKED LIST:

null ◀──[•|3|•]⇄[•|7|•]⇄[•|1|•]⇄[•|9|•]──▶ null
HEAD                                        TAIL

class DLLNode { int val; DLLNode prev, next; }

ADVANTAGES over Singly:
  Delete a node (given pointer):  O(1)  — can fix prev link
  Traverse backward:              O(n)
  Insert before a node:           O(1)

DISADVANTAGE: 2× memory (extra prev pointer per node)

CIRCULAR LINKED LIST:
[3|•]──▶[7|•]──▶[1|•]──▶[9|•]──┐
  ↑___________________________________┘
  tail.next = head (wraps around)

USE CASES:
  Circular LL → Round-robin scheduling, music playlist loop
  Doubly LL   → Browser history (back/forward), LRU Cache</pre>
<div class="tip-box"><strong>🔥 LRU Cache (most asked interview question):</strong><br>
Combine HashMap + Doubly Linked List → O(1) get and put<br>
HashMap stores key→node pointer. DLL maintains access order (MRU at head, LRU at tail).</div>
<pre>// LRU Cache skeleton
class LRUCache {
    int cap;
    Map&lt;Integer,DLLNode&gt; map = new HashMap&lt;&gt;();
    DLLNode head = new DLLNode(0,0);  // dummy
    DLLNode tail = new DLLNode(0,0);  // dummy
    LRUCache(int cap){ this.cap=cap; head.next=tail; tail.prev=head; }

    int get(int key){
        if(!map.containsKey(key)) return -1;
        DLLNode node=map.get(key);
        remove(node); addToFront(node);  // mark as recently used
        return node.val;
    }
    void put(int key,int val){
        if(map.containsKey(key)) remove(map.get(key));
        if(map.size()==cap) { DLLNode lru=tail.prev; remove(lru); map.remove(lru.key); }
        DLLNode node=new DLLNode(key,val);
        addToFront(node); map.put(key,node);
    }
}</pre>`,
            },
          ],
        },
        {
          id: "stacks",
          n: 7,
          title: "Stacks — LIFO, Monotonic Stack",
          desc: "Stack = LIFO. Push/Pop O(1). Monotonic stack keeps elements in sorted order — solves Next Greater Element class of problems elegantly.",
          questions: [
            {
              n: 15,
              t: "Stack — LIFO structure and use cases",
              d: ["beginner"],
              a: `
<pre>STACK VISUALIZATION:
Push 1,5,3,7:        Pop:
  ┌───┐ ← TOP          ┌───┐
  │ 7 │                │ 3 │  ← 7 removed
  ├───┤                ├───┤
  │ 3 │                │ 5 │
  ├───┤                ├───┤
  │ 5 │                │ 1 │
  ├───┤                └───┘
  │ 1 │
  └───┘ ← BOTTOM

Operations: push() O(1) · pop() O(1) · peek() O(1)
Java: Deque&lt;Integer&gt; stack = new ArrayDeque&lt;&gt;();</pre>
<div class="tip-box"><strong>🔥 Stack problems:</strong> Valid Parentheses · Daily Temperatures · Next Greater Element · Min Stack · Evaluate RPN · Largest Rectangle in Histogram · Decode String · Remove K Digits</div>
<pre>// Valid Parentheses
boolean isValid(String s){
    Deque&lt;Character&gt; st=new ArrayDeque&lt;&gt;();
    for(char c:s.toCharArray()){
        if("({[".indexOf(c)>=0) st.push(c);
        else if(st.isEmpty()) return false;
        else if(c==')' && st.peek()!='(') return false;
        else if(c==']' && st.peek()!='[') return false;
        else if(c=='}' && st.peek()!='{') return false;
        else st.pop();
    }
    return st.isEmpty();
}</pre>`,
            },
            {
              n: 16,
              t: "Monotonic Stack — Next Greater Element pattern",
              d: ["intermediate"],
              a: `
<p>A monotonic stack maintains elements in sorted order (increasing or decreasing). The key insight: when a larger element arrives, it is the NGE for all smaller elements waiting in the stack.</p>
<pre>arr = [2, 1, 5, 3, 6, 4]
Goal: Next Greater Element for each index

Scan left to right. Stack stores INDICES.
Maintain DECREASING stack (top is smallest).

i=0: stack=[] → push 0          stack=[0]   (vals:[2])
i=1: arr[1]=1 < arr[top=0]=2  → push 1     stack=[0,1]
i=2: arr[2]=5 > arr[top=1]=1  → pop 1, NGE[1]=5
                              → 5>arr[0]=2 → pop 0, NGE[0]=5
                              → push 2     stack=[2]
i=3: arr[3]=3 < arr[2]=5      → push 3     stack=[2,3]
i=4: arr[4]=6 > arr[3]=3      → pop 3, NGE[3]=6
                              → 6>arr[2]=5 → pop 2, NGE[2]=6
                              → push 4     stack=[4]
i=5: arr[5]=4 < arr[4]=6      → push 5     stack=[4,5]
End: remaining in stack → NGE = -1

NGE = [5, 5, 6, 6, -1, -1]</pre>
<pre>int[] nextGreater(int[] arr){
    int n=arr.length;
    int[] nge=new int[n]; Arrays.fill(nge,-1);
    Deque&lt;Integer&gt; st=new ArrayDeque&lt;&gt;();
    for(int i=0;i&lt;n;i++){
        while(!st.isEmpty()&&arr[i]>arr[st.peek()])
            nge[st.pop()]=arr[i];
        st.push(i);
    }
    return nge;
}</pre>`,
            },
          ],
        },
        {
          id: "queues",
          n: 8,
          title: "Queues & Deques — FIFO, Circular Queue",
          desc: "Queue = FIFO. Enqueue at rear, dequeue from front. Deque (double-ended) allows O(1) at both ends. Used in BFS, sliding window max, and scheduling.",
          questions: [
            {
              n: 17,
              t: "Queue types and circular queue implementation",
              d: ["beginner", "intermediate"],
              a: `
<pre>SIMPLE QUEUE (FIFO):
Enqueue: 1,5,3,7
FRONT → [1][5][3][7] ← REAR
Dequeue → 1
FRONT → [5][3][7] ← REAR

CIRCULAR QUEUE (fixed size, no wasted space):
  rear = (rear+1) % capacity
  front = (front+1) % capacity
  Full when: (rear+1)%cap == front
  Empty when: front == rear

  [_][5][3][7][_]
      ↑F        ↑R  (capacity=5)

DEQUE (double-ended):
  addFirst / addLast
  removeFirst / removeLast
  All O(1) operations
  Java: ArrayDeque&lt;&gt;</pre>
<div class="tip-box"><strong>🔥 Queue problems:</strong> BFS (all graph/tree problems) · Rotten Oranges · Sliding Window Maximum (Deque) · First Non-Repeating Character · Design Circular Queue · Task Scheduler</div>
<pre>// Circular Queue
class MyCircularQueue {
    int[] q; int front,rear,size,cap;
    MyCircularQueue(int k){ q=new int[k];cap=k;front=rear=size=0; }
    boolean enQueue(int val){
        if(size==cap) return false;
        q[rear]=val; rear=(rear+1)%cap; size++; return true;
    }
    boolean deQueue(){
        if(size==0) return false;
        front=(front+1)%cap; size--; return true;
    }
    int Front(){ return size==0?-1:q[front]; }
    int Rear(){ return size==0?-1:q[(rear-1+cap)%cap]; }
}</pre>`,
            },
          ],
        },
        {
          id: "hashmaps",
          n: 9,
          title: "Hash Maps & Hash Sets — O(1) Average Lookup",
          desc: "HashMap: key→value with O(1) avg get/put. Understand hash function, collision chaining, load factor. Most frequent interview tool for counting and grouping.",
          questions: [
            {
              n: 18,
              t: "HashMap internals — hash function, collision, load factor",
              d: ["intermediate"],
              a: `
<pre>HashMap internals (Java):

put("apple", 5):
  hash("apple") = 3  → bucket[3]

put("grape", 2):
  hash("grape") = 3  → COLLISION! → chain at bucket[3]

BUCKET ARRAY (default capacity 16):
  [0] → null
  [3] → ["apple"→5] → ["grape"→2]  (LinkedList chain)
  [7] → ["mango"→10]
  ...

Load factor = 0.75 → resize (double) when 75% full
Java 8+: chain → Red-Black Tree when length > 8 → O(log n) worst</pre>
<div class="tip-box"><strong>🔥 HashMap problems:</strong> Two Sum · Group Anagrams · Top K Frequent · Subarray Sum=K · Longest Consecutive Sequence · Word Pattern · Isomorphic Strings · LRU Cache</div>
<pre>// Two Sum O(n)
int[] twoSum(int[] nums,int target){
    Map&lt;Integer,Integer&gt; map=new HashMap&lt;&gt;();
    for(int i=0;i&lt;nums.length;i++){
        int c=target-nums[i];
        if(map.containsKey(c)) return new int[]{map.get(c),i};
        map.put(nums[i],i);
    }
    return new int[]{};
}
// Group Anagrams: sort each word as key → group words with same key</pre>`,
            },
          ],
        },
        {
          id: "trees-binary",
          n: 10,
          title: "Trees — Binary Trees & Traversals",
          desc: "Trees are hierarchical. Binary tree: each node has ≤ 2 children. Master all 4 traversals. Height, diameter, LCA — all use post-order thinking.",
          questions: [
            {
              n: 19,
              t: "Binary Tree structure and all 4 traversals",
              d: ["beginner"],
              a: `
<pre>BINARY TREE:
               [10]          ← Root (depth 0)
              /    \\
           [5]     [15]      ← depth 1
          /   \\   /   \\
        [3]  [7][12]  [20]   ← depth 2 (leaves)

Terminology:
  Root=10 · Leaf=3,7,12,20 · Height=2 · Depth of 7=2

4 TRAVERSALS:
  InOrder   (L→Root→R): 3,5,7,10,12,15,20  ← SORTED for BST!
  PreOrder  (Root→L→R): 10,5,3,7,15,12,20
  PostOrder (L→R→Root): 3,7,5,12,20,15,10
  LevelOrder (BFS):     10,5,15,3,7,12,20</pre>
<div class="tip-box"><strong>When to use which traversal:</strong><br>
InOrder → Validate/print BST sorted · PreOrder → Serialize tree · PostOrder → Delete tree, calc height · LevelOrder → Level-by-level, right side view, zigzag</div>
<pre>void inOrder(TreeNode r){ if(r==null)return; inOrder(r.left); visit(r); inOrder(r.right); }
void preOrder(TreeNode r){ if(r==null)return; visit(r); preOrder(r.left); preOrder(r.right); }
void postOrder(TreeNode r){ if(r==null)return; postOrder(r.left); postOrder(r.right); visit(r); }

// Level order using Queue
List&lt;List&lt;Integer&gt;&gt; levelOrder(TreeNode root){
    List&lt;List&lt;Integer&gt;&gt; res=new ArrayList&lt;&gt;();
    if(root==null) return res;
    Queue&lt;TreeNode&gt; q=new LinkedList&lt;&gt;();
    q.offer(root);
    while(!q.isEmpty()){
        int sz=q.size(); List&lt;Integer&gt; lvl=new ArrayList&lt;&gt;();
        for(int i=0;i&lt;sz;i++){ TreeNode n=q.poll(); lvl.add(n.val);
            if(n.left!=null)q.offer(n.left); if(n.right!=null)q.offer(n.right); }
        res.add(lvl);
    }
    return res;
}</pre>`,
            },
            {
              n: 20,
              t: "Height, Diameter, LCA — post-order pattern",
              d: ["intermediate"],
              a: `
<pre>HEIGHT (max depth from node to leaf):
  height(null)=0
  height(node)=1+max(height(left),height(right))

DIAMETER (longest path between any 2 nodes):
  At each node: left_height + right_height = path through this node
  Track global max.

         [1]       ← left_h=2, right_h=1, local=3
        /   \\
      [2]   [3]
     /   \\
   [4]   [5]       ← leaf height=1 each

  Diameter = 3  (path: 4→2→1→3)

LCA (Lowest Common Ancestor):
  LCA(4,5) = 2    LCA(4,3) = 1
  If both p,q found in different subtrees → current node is LCA</pre>
<pre>int maxD=0;
int height(TreeNode node){
    if(node==null) return 0;
    int l=height(node.left), r=height(node.right);
    maxD=Math.max(maxD, l+r);   // diameter through this node
    return 1+Math.max(l,r);
}

TreeNode lca(TreeNode root,TreeNode p,TreeNode q){
    if(root==null||root==p||root==q) return root;
    TreeNode l=lca(root.left,p,q), r=lca(root.right,p,q);
    return (l!=null&&r!=null)?root:(l!=null?l:r);
}</pre>`,
            },
          ],
        },
        {
          id: "bst",
          n: 11,
          title: "Binary Search Tree (BST) — Ordered Binary Tree",
          desc: "BST property: left < root < right for EVERY node. Gives O(log n) search on balanced tree. InOrder traversal gives sorted sequence.",
          questions: [
            {
              n: 21,
              t: "BST search, insert, delete, validate",
              d: ["beginner", "intermediate"],
              a: `
<pre>VALID BST:              INVALID BST:
      [8]                     [8]
     /   \\                   /   \\
   [3]   [10]             [3]   [10]
  /   \\     \\            /   \\
[1]   [6]  [14]         [1]  [9]  ← 9 > 8, wrong side!
     /   \\
   [4]   [7]

SEARCH 6 in valid BST:
  8: 6<8 → go left
  3: 6>3 → go right
  6: FOUND ✓ (3 steps, O(log n))</pre>
<div class="tip-box"><strong>🔥 BST problems:</strong> Validate BST · Kth Smallest in BST · Convert Sorted Array to BST · Delete Node in BST · Range Sum of BST · Floor/Ceil in BST · BST Iterator</div>
<pre>// Validate BST — pass bounds down
boolean isValid(TreeNode n,long min,long max){
    if(n==null) return true;
    if(n.val<=min||n.val>=max) return false;
    return isValid(n.left,min,n.val)&&isValid(n.right,n.val,max);
}
// Call: isValid(root,Long.MIN_VALUE,Long.MAX_VALUE)

// Kth Smallest — inorder gives sorted, count k
int k,res;
void kthSmallest(TreeNode node){
    if(node==null) return;
    kthSmallest(node.left);
    if(--k==0){ res=node.val; return; }
    kthSmallest(node.right);
}</pre>`,
            },
          ],
        },
        {
          id: "avl",
          n: 12,
          title: "AVL Trees — Self-Balancing BST",
          desc: "BST degrades to O(n) if inputs are sorted (skewed tree). AVL tree auto-balances after every insert/delete using rotations — guarantees O(log n) always.",
          questions: [
            {
              n: 22,
              t: "Why AVL? Balance factor and rotations",
              d: ["intermediate", "advanced"],
              a: `
<pre>PROBLEM WITH PLAIN BST:
  Insert 1,2,3,4,5 in order → skewed tree:

  [1]
     \\
     [2]         Height=5, search O(n) ← BAD!
        \\
        [3]
           \\
           [4]
              \\
              [5]

AVL TREE FIX:
  Balance Factor (BF) = height(left) - height(right)
  Valid BF = {-1, 0, +1}
  If |BF| > 1 → ROTATE to restore balance

AVL ROTATIONS (4 types):

1. RIGHT ROTATION (LL case — left-left heavy):
        [3]            [2]
       /               /  \\
     [2]    →→→      [1]  [3]
    /
  [1]
  BF of 3 = 2 (too left-heavy) → Right Rotate at 3

2. LEFT ROTATION (RR case — right-right heavy):
  [1]               [2]
     \\              /  \\
     [2]  →→→     [1]  [3]
        \\
        [3]

3. LEFT-RIGHT Rotation (LR case):
        [3]         [3]         [2]
       /    Left    /    Right   / \\
     [1]   →→→   [2]   →→→  [1] [3]
       \\         /
       [2]      [1]

4. RIGHT-LEFT Rotation (RL case): mirror of LR</pre>
<pre>// Balance factor
int bf(Node n){ return height(n.left)-height(n.right); }

// Right rotation
Node rightRotate(Node y){
    Node x=y.left, T2=x.right;
    x.right=y; y.left=T2;
    y.height=1+Math.max(height(y.left),height(y.right));
    x.height=1+Math.max(height(x.left),height(x.right));
    return x; // new root
}

// After insert, check BF and rotate:
// BF>1 && key<node.left.key  → rightRotate(node)   [LL]
// BF<-1&& key>node.right.key → leftRotate(node)    [RR]
// BF>1 && key>node.left.key  → leftRotate(left),rightRotate(node) [LR]
// BF<-1&& key<node.right.key → rightRotate(right),leftRotate(node)[RL]</pre>
<table>
  <tr><th>Tree Type</th><th>Search</th><th>Insert</th><th>Delete</th><th>Guarantee</th></tr>
  <tr><td>Plain BST</td><td>O(n) worst</td><td>O(n)</td><td>O(n)</td><td>None</td></tr>
  <tr><td>AVL Tree</td><td>O(log n)</td><td>O(log n)</td><td>O(log n)</td><td>Always</td></tr>
  <tr><td>Red-Black</td><td>O(log n)</td><td>O(log n)</td><td>O(log n)</td><td>Always</td></tr>
</table>`,
            },
          ],
        },
        {
          id: "heaps",
          n: 13,
          title: "Heaps & Priority Queue — O(log n) Min/Max",
          desc: "Complete binary tree stored in array. Min-heap: parent ≤ children (min at root). Max-heap: parent ≥ children. Java PriorityQueue is min-heap by default.",
          questions: [
            {
              n: 23,
              t: "Heap structure, heapify, and operations",
              d: ["beginner", "intermediate"],
              a: `
<pre>MIN-HEAP (array representation):
           [1]          index 0
          /   \\
        [3]   [2]       index 1,2
       / \\ /  \\
      [7][6][5][4]      index 3,4,5,6

Array: [1, 3, 2, 7, 6, 5, 4]

Parent(i)     = (i-1)/2
LeftChild(i)  = 2*i+1
RightChild(i) = 2*i+2

OFFER(0) → add at end, bubble UP:
  [1,3,2,7,6,5,4,0]
  0 < parent(7)=7 → SWAP → [1,3,2,0,6,5,4,7]
  0 < parent(3)=3 → SWAP → [1,0,2,3,6,5,4,7]
  0 < parent(1)=1 → SWAP → [0,1,2,3,6,5,4,7] ✓

POLL() → remove root, put last at top, heapify DOWN:
  peek = 1 (always O(1))</pre>
<div class="tip-box"><strong>🔥 Heap problems:</strong> K Largest Elements · Kth Largest in Stream · Merge K Sorted Lists · Find Median from Data Stream (two heaps) · Top K Frequent · Task Scheduler · Reorganize String</div>
<pre>// K Largest using Min-Heap
int[] kLargest(int[] nums,int k){
    PriorityQueue&lt;Integer&gt; minH=new PriorityQueue&lt;&gt;();
    for(int n:nums){ minH.offer(n); if(minH.size()>k) minH.poll(); }
    return minH.stream().mapToInt(i->i).toArray();
}

// Median from stream — two heaps
PriorityQueue&lt;Integer&gt; lo=new PriorityQueue&lt;&gt;(Collections.reverseOrder()); // max-heap
PriorityQueue&lt;Integer&gt; hi=new PriorityQueue&lt;&gt;();                           // min-heap
void addNum(int n){
    lo.offer(n); hi.offer(lo.poll());
    if(lo.size()&lt;hi.size()) lo.offer(hi.poll());
}
double findMedian(){ return lo.size()>hi.size()?lo.peek():(lo.peek()+hi.peek())/2.0; }</pre>`,
            },
          ],
        },
        {
          id: "tries",
          n: 14,
          title: "Trie (Prefix Tree) — Character-by-Character Search",
          desc: "Trie stores strings node-by-node. O(m) search where m=word length, regardless of how many words are stored. Perfect for autocomplete and prefix matching.",
          questions: [
            {
              n: 24,
              t: "Trie structure, insert, search, startsWith",
              d: ["intermediate", "advanced"],
              a: `
<pre>TRIE storing: "cat","can","car","dog"

              (root)
             /      \\
           [c]       [d]
            |         |
           [a]        [o]
          / | \\        |
        [t][n][r]     [g]
         *  *  *       *    (* = end of word)

Search "can": root→c→a→n→isEnd=true ✓
Search "ca" : root→c→a→   isEnd=false (prefix only)
Search "cow": root→c→o? → no 'o' child → NOT FOUND</pre>
<div class="tip-box"><strong>🔥 Trie problems:</strong> Implement Trie (LC 208) · Word Search II · Design Add and Search Words · Longest Word in Dictionary · Replace Words · Index Pairs</div>
<pre>class Trie {
    TrieNode root=new TrieNode();
    static class TrieNode { TrieNode[] ch=new TrieNode[26]; boolean end; }

    void insert(String w){
        TrieNode n=root;
        for(char c:w.toCharArray()){ int i=c-'a'; if(n.ch[i]==null)n.ch[i]=new TrieNode(); n=n.ch[i]; }
        n.end=true;
    }
    boolean search(String w){
        TrieNode n=root;
        for(char c:w.toCharArray()){ int i=c-'a'; if(n.ch[i]==null)return false; n=n.ch[i]; }
        return n.end;
    }
    boolean startsWith(String p){
        TrieNode n=root;
        for(char c:p.toCharArray()){ int i=c-'a'; if(n.ch[i]==null)return false; n=n.ch[i]; }
        return true;
    }
}</pre>`,
            },
          ],
        },
      ],
    },

    /* ─────────────────────────────────────────────
       PART 3 · SEARCHING ALGORITHMS
    ───────────────────────────────────────────── */
    {
      label: "PART 3 · SEARCHING ALGORITHMS",
      sections: [
        {
          id: "linear-search",
          n: 15,
          title: "Linear Search — Sequential Scan O(n)",
          desc: "Check every element one by one. Works on any collection, sorted or not. Use when n is small or array is unsorted.",
          questions: [
            {
              n: 25,
              t: "Linear search — when to use",
              d: ["beginner"],
              a: `
<pre>Target=7, arr=[3,9,1,7,5,2]
  check 3→NO, 9→NO, 1→NO, 7→YES ✓ (index 3)

Best: O(1)  Worst: O(n)  Average: O(n/2)=O(n)</pre>
<div class="tip-box"><strong>Use when:</strong> Unsorted small array · Linked list (no random access for binary search) · Find all occurrences · First/last occurrence without sorting</div>
<pre>int linearSearch(int[] arr,int t){ for(int i=0;i&lt;arr.length;i++) if(arr[i]==t) return i; return -1; }</pre>`,
            },
          ],
        },
        {
          id: "binary-search",
          n: 16,
          title: "Binary Search — O(log n) on Sorted Arrays",
          desc: "Eliminate half the search space each step. For n=10⁹ this means only 30 comparisons. Also used to 'search on answer' for optimization problems.",
          questions: [
            {
              n: 26,
              t: "Binary Search — standard and variants",
              d: ["beginner", "intermediate"],
              a: `
<pre>arr=[1,3,5,7,9,11,13]  Search for 9:

Step1: left=0,right=6, mid=3, arr[3]=7 &lt; 9 → left=4
Step2: left=4,right=6, mid=5, arr[5]=11> 9 → right=4
Step3: left=4,right=4, mid=4, arr[4]=9 == 9 ✓

Each step halves the range → O(log n)</pre>
<div class="tip-box"><strong>🔥 Binary Search problems:</strong> Find First & Last Position · Search Rotated Array · Find Peak Element · Sqrt(x) · Koko Eating Bananas (search on answer) · Capacity to Ship · Minimum in Rotated Array · Median of Two Sorted Arrays</div>
<pre>// Standard binary search
int binarySearch(int[] arr,int t){
    int l=0,r=arr.length-1;
    while(l&lt;=r){ int m=l+(r-l)/2; if(arr[m]==t)return m; else if(arr[m]&lt;t)l=m+1; else r=m-1; }
    return -1;
}
// First occurrence: when found, result=mid, r=mid-1 (keep going left)
// Last occurrence:  when found, result=mid, l=mid+1 (keep going right)

// Search on ANSWER pattern (Koko Eating Bananas)
int minSpeed(int[] piles,int h){
    int l=1,r=Arrays.stream(piles).max().getAsInt();
    while(l&lt;r){ int m=l+(r-l)/2; if(canFinish(piles,m,h))r=m; else l=m+1; }
    return l;
}

// Search in Rotated Sorted Array
int searchRotated(int[] nums,int t){
    int l=0,r=nums.length-1;
    while(l&lt;=r){
        int m=l+(r-l)/2;
        if(nums[m]==t) return m;
        if(nums[l]&lt;=nums[m]){ // left half sorted
            if(t>=nums[l]&&t&lt;nums[m]) r=m-1; else l=m+1;
        } else {               // right half sorted
            if(t>nums[m]&&t&lt;=nums[r]) l=m+1; else r=m-1;
        }
    }
    return -1;
}</pre>`,
            },
          ],
        },
        {
          id: "cyclic-sort",
          n: 17,
          title: "Cyclic Sort — Index-Based Placement for Range Arrays",
          desc: "When array has values [1..n] or [0..n], each number belongs at a specific index. O(n) placement + O(n) scan = O(n) total to find all missing/duplicate numbers.",
          questions: [
            {
              n: 27,
              t: "Cyclic Sort template and all problems",
              d: ["intermediate"],
              a: `
<pre>RULE: value x → belongs at index (x-1)  [for range 1..n]

arr=[4,3,1,5,2]:
i=0: arr[0]=4→idx3, swap(0,3) → [5,3,1,4,2]
i=0: arr[0]=5→idx4, swap(0,4) → [2,3,1,4,5]
i=0: arr[0]=2→idx1, swap(0,1) → [1,2,3,4,5] ← sorted ✓

Now scan: arr[i]!=i+1 → anomaly found</pre>
<div class="tip-box"><strong>🔥 All Cyclic Sort problems:</strong><br>
LC 268 — Missing Number · LC 287 — Find Duplicate · LC 448 — All Missing Numbers · LC 442 — All Duplicates · LC 765 — Set Mismatch · LC 41 — First Missing Positive</div>
<pre>// Template
void cyclicSort(int[] a){
    int i=0;
    while(i&lt;a.length){
        int j=a[i]-1;  // correct index for a[i]
        if(a[i]!=a[j]) { int t=a[i];a[i]=a[j];a[j]=t; }
        else i++;
    }
}
int missingNumber(int[] a){ cyclicSort(a); for(int i=0;i&lt;a.length;i++)if(a[i]!=i+1)return i+1; return a.length; }
List&lt;Integer&gt; findDuplicates(int[] a){ cyclicSort(a); List&lt;Integer&gt; r=new ArrayList&lt;&gt;(); for(int i=0;i&lt;a.length;i++)if(a[i]!=i+1)r.add(a[i]); return r; }</pre>`,
            },
          ],
        },
      ],
    },

    /* ─────────────────────────────────────────────
       PART 4 · SORTING ALGORITHMS
    ───────────────────────────────────────────── */
    {
      label: "PART 4 · SORTING ALGORITHMS",
      sections: [
        {
          id: "basic-sorts",
          n: 18,
          title: "Bubble, Selection & Insertion Sort — O(n²)",
          desc: "Simple comparison-based sorts. Bubble: adjacent swaps. Selection: find min, place front. Insertion: build sorted left side. Insertion is adaptive — O(n) for nearly-sorted data.",
          questions: [
            {
              n: 28,
              t: "Bubble Sort — largest element bubbles to end",
              d: ["beginner"],
              a: `
<pre>arr=[5,3,8,1,4]
Pass1: compare adjacent pairs, largest moves to end
  [3,5,8,1,4]→[3,5,8,1,4]→[3,5,1,8,4]→[3,5,1,4,8] ← 8 fixed ✓
Pass2: [3,5,1,4] → [3,1,4,5] ← 5 fixed ✓
Pass3: [3,1,4] → [1,3,4] ← done

Time: O(n²)  Space: O(1)  Stable: YES</pre>
<pre>void bubbleSort(int[] a){
    for(int i=0;i&lt;a.length-1;i++){
        boolean swapped=false;
        for(int j=0;j&lt;a.length-i-1;j++)
            if(a[j]>a[j+1]){ int t=a[j];a[j]=a[j+1];a[j+1]=t; swapped=true; }
        if(!swapped) break; // already sorted
    }
}</pre>`,
            },
            {
              n: 29,
              t: "Selection Sort — find minimum, swap to front",
              d: ["beginner"],
              a: `
<pre>arr=[5,3,8,1,4]
Round1: min=1(idx3), swap idx0↔idx3 → [1,3,8,5,4]
Round2: min=3(idx1), already ok      → [1,3,8,5,4]
Round3: min=4(idx4), swap idx2↔idx4 → [1,3,4,5,8] ✓

Time: O(n²)  Space: O(1)  Stable: NO  Swaps: exactly O(n)</pre>
<pre>void selectionSort(int[] a){ for(int i=0;i&lt;a.length-1;i++){int m=i;for(int j=i+1;j&lt;a.length;j++)if(a[j]&lt;a[m])m=j;int t=a[i];a[i]=a[m];a[m]=t;} }</pre>`,
            },
            {
              n: 30,
              t: "Insertion Sort — like sorting playing cards",
              d: ["beginner", "intermediate"],
              a: `
<pre>arr=[5,3,8,1,4]  ← imagine dealing cards one by one

Step1: key=3. Shift 5 right. Insert 3 → [3,5,8,1,4]
Step2: key=8. 8>5, no shift             → [3,5,8,1,4]
Step3: key=1. Shift 8,5,3. Insert 1    → [1,3,5,8,4]
Step4: key=4. Shift 8,5. Insert 4      → [1,3,4,5,8] ✓

Best case (sorted input): O(n) — zero shifts!
Used in Java's TimSort for subarrays of size &lt; 32</pre>
<pre>void insertionSort(int[] a){
    for(int i=1;i&lt;a.length;i++){
        int key=a[i],j=i-1;
        while(j>=0&&a[j]>key){ a[j+1]=a[j]; j--; }
        a[j+1]=key;
    }
}</pre>`,
            },
          ],
        },
        {
          id: "efficient-sorts",
          n: 19,
          title: "Merge Sort, Quick Sort & Heap Sort — O(n log n)",
          desc: "Production-grade sorts. Java Arrays.sort uses Dual-Pivot QuickSort for primitives, TimSort (Merge+Insertion) for objects. Know all three deeply.",
          questions: [
            {
              n: 31,
              t: "Merge Sort — stable, guaranteed O(n log n)",
              d: ["intermediate"],
              a: `
<pre>DIVIDE & MERGE:
[38,27,43,3] → [38,27] [43,3] → [38][27] [43][3]
Merge: [27,38] [3,43] → [3,27,38,43] ✓

Merge two sorted halves:
  [1,3,5] + [2,4,6]
  Compare: 1&lt;2→take1, 3>2→take2, 3&lt;4→take3, 5>4→take4, 5&lt;6→take5, take6
  Result: [1,2,3,4,5,6] ✓

Time: O(n log n) ALL cases  Space: O(n)  Stable: YES</pre>
<div class="tip-box"><strong>🔥 Merge Sort problems:</strong> Count Inversions (when right element < left, inversions += mid-i+1) · Sort Linked List · Merge K Sorted Arrays</div>
<pre>void mergeSort(int[] a,int l,int r){
    if(l>=r) return;
    int m=l+(r-l)/2;
    mergeSort(a,l,m); mergeSort(a,m+1,r); merge(a,l,m,r);
}
void merge(int[] a,int l,int m,int r){
    int[] L=Arrays.copyOfRange(a,l,m+1), R=Arrays.copyOfRange(a,m+1,r+1);
    int i=0,j=0,k=l;
    while(i&lt;L.length&&j&lt;R.length) a[k++]=L[i]&lt;=R[j]?L[i++]:R[j++];
    while(i&lt;L.length) a[k++]=L[i++];
    while(j&lt;R.length) a[k++]=R[j++];
}</pre>`,
            },
            {
              n: 32,
              t: "Quick Sort — partition-based, O(n log n) avg",
              d: ["intermediate", "advanced"],
              a: `
<pre>LOMUTO PARTITION (pivot = last element):
arr=[3,6,8,10,1,2,1]  pivot=1

i=-1 (boundary of smaller elements)
j=0: 3>1 skip
j=1: 6>1 skip
j=2: 8>1 skip
j=3: 10>1 skip
j=4: 1≤1 → i++, swap a[0]↔a[4] → [1,6,8,10,3,2,1]
j=5: 2>1 skip
End: swap a[i+1]↔a[right] → [1,1,8,10,3,2,6]
Pivot 1 at index 1 ✓

Recurse on [1] and [8,10,3,2,6]</pre>
<div class="tip-box"><strong>🔥 Quick Sort problems:</strong> QuickSelect (Kth Largest O(n) avg) · Sort Colors (Dutch National Flag 3-way partition) · Find Kth Smallest</div>
<pre>// QuickSelect — find Kth largest O(n) avg
int findKthLargest(int[] nums,int k){ return qs(nums,0,nums.length-1,nums.length-k); }
int qs(int[] a,int l,int r,int k){
    int p=partition(a,l,r);
    if(p==k) return a[k]; return p&lt;k?qs(a,p+1,r,k):qs(a,l,p-1,k);
}
int partition(int[] a,int l,int r){
    int pivot=a[r],i=l-1;
    for(int j=l;j&lt;r;j++) if(a[j]&lt;=pivot){i++;int t=a[i];a[i]=a[j];a[j]=t;}
    int t=a[i+1];a[i+1]=a[r];a[r]=t; return i+1;
}

// Dutch National Flag (Sort Colors: 0,1,2)
void sortColors(int[] a){
    int lo=0,mid=0,hi=a.length-1;
    while(mid&lt;=hi){
        if(a[mid]==0){int t=a[lo];a[lo++]=a[mid];a[mid++]=t;}
        else if(a[mid]==2){int t=a[mid];a[mid]=a[hi];a[hi--]=t;}
        else mid++;
    }
}</pre>`,
            },
            {
              n: 33,
              t: "Heap Sort — in-place O(n log n) using max-heap",
              d: ["intermediate", "advanced"],
              a: `
<pre>arr=[4,10,3,5,1]

Phase1 — Build MAX-HEAP (heapify from n/2-1 to 0):
         [10]
        /    \\
      [5]    [3]
     /   \\
   [4]   [1]
arr=[10,5,3,4,1]

Phase2 — Extract max repeatedly:
  Swap arr[0]↔arr[4]: [1,5,3,4|10] → heapify → [5,4,3,1|10]
  Swap arr[0]↔arr[3]: [1,4,3|5,10] → heapify → [4,1,3|5,10]
  Swap arr[0]↔arr[2]: [3,1|4,5,10] → done
  Swap arr[0]↔arr[1]: [1|3,4,5,10]
Final: [1,3,4,5,10] ✓

Time: O(n log n) ALL cases  Space: O(1)  Stable: NO</pre>
<pre>void heapSort(int[] a){
    int n=a.length;
    for(int i=n/2-1;i>=0;i--) heapify(a,n,i);
    for(int i=n-1;i>0;i--){ int t=a[0];a[0]=a[i];a[i]=t; heapify(a,i,0); }
}
void heapify(int[] a,int n,int i){
    int max=i,l=2*i+1,r=2*i+2;
    if(l&lt;n&&a[l]>a[max])max=l; if(r&lt;n&&a[r]>a[max])max=r;
    if(max!=i){int t=a[i];a[i]=a[max];a[max]=t;heapify(a,n,max);}
}</pre>`,
            },
            {
              n: 34,
              t: "Counting Sort & Radix Sort — O(n+k) non-comparison",
              d: ["intermediate"],
              a: `
<pre>COUNTING SORT (integers in range [0..k]):
arr=[4,2,2,8,3,3,1]

Count: [0,1,2,2,1,0,0,0,1]  (index = value)
       [0,1,2,3,4,5,6,7,8]
Cumulative: [0,1,3,5,6,6,6,6,7]
Output (right to left for stability): [1,2,2,3,3,4,8]
Time: O(n+k)  Space: O(n+k)

RADIX SORT (sort by each digit, LSD first):
[170,45,75,90,802,24,2,66]
By ones:  [170,90,802,2|24|45,75|66] → [170,90,802,2,24,45,75,66]
By tens:  [802,2|24|45|66|170,75|90] → [802,2,24,45,66,170,75,90]
By hundreds:[2,24,45,66,75,90|170|802]→ [2,24,45,66,75,90,170,802] ✓
Time: O(d×(n+k))  Stable: YES</pre>`,
            },
          ],
        },
      ],
    },

    /* ─────────────────────────────────────────────
       PART 5 · PATTERNS & TECHNIQUES
    ───────────────────────────────────────────── */
    {
      label: "PART 5 · PATTERNS & TECHNIQUES",
      sections: [
        {
          id: "two-pointers",
          n: 20,
          title: "Two Pointers — Reduce O(n²) to O(n)",
          desc: "Two index variables that move based on conditions. Opposite-ends for pair/triplet problems on sorted arrays. Same-direction for partition and overwrite problems.",
          questions: [
            {
              n: 35,
              t: "Opposite-ends two pointers — 3Sum, Container With Most Water",
              d: ["intermediate"],
              a: `
<pre>CONTAINER WITH MOST WATER:
height=[1,8,6,2,5,4,8,3,7]
       L                 R

water=min(h[L],h[R])×(R-L)
L=0(h=1),R=8(h=7): water=1×8=8, move L (shorter)
L=1(h=8),R=8(h=7): water=7×7=49, move R
L=1(h=8),R=6(h=8): water=8×5=40, move either
...MAX = 49 ✓

WHY MOVE SHORTER SIDE: moving taller side can only decrease area.</pre>
<div class="tip-box"><strong>🔥 Opposite-ends problems:</strong> Two Sum II · 3Sum · 4Sum · Container With Most Water · Trapping Rain Water · Valid Palindrome · Squares of Sorted Array</div>
<pre>// 3Sum — sort first, then fix one + two pointers
List&lt;List&lt;Integer&gt;&gt; threeSum(int[] nums){
    Arrays.sort(nums); List&lt;List&lt;Integer&gt;&gt; res=new ArrayList&lt;&gt;();
    for(int i=0;i&lt;nums.length-2;i++){
        if(i>0&&nums[i]==nums[i-1]) continue;
        int l=i+1,r=nums.length-1;
        while(l&lt;r){
            int s=nums[i]+nums[l]+nums[r];
            if(s==0){res.add(Arrays.asList(nums[i],nums[l],nums[r]));
                while(l&lt;r&&nums[l]==nums[l+1])l++; while(l&lt;r&&nums[r]==nums[r-1])r--;
                l++;r--;}
            else if(s&lt;0)l++; else r--;
        }
    }
    return res;
}</pre>`,
            },
            {
              n: 36,
              t: "Same-direction two pointers — remove duplicates, move zeroes",
              d: ["beginner", "intermediate"],
              a: `
<pre>REMOVE DUPLICATES FROM SORTED ARRAY:
arr=[1,1,2,3,3,4,5,5]
     s(write pos)
     f(scanner)

f scans; s only advances when unique element found.
f=0:keep→write s=0, s++
f=1:dup→skip
f=2:unique→write arr[s]=2, s++
f=3:unique→write arr[s]=3, s++
f=4:dup→skip  ...

Result: [1,2,3,4,5,_,_,_]  new length=5</pre>
<pre>int removeDuplicates(int[] a){
    int s=1;
    for(int f=1;f&lt;a.length;f++) if(a[f]!=a[f-1]) a[s++]=a[f];
    return s;
}

// Move zeroes — keep relative order of non-zero elements
void moveZeroes(int[] a){
    int s=0;
    for(int f=0;f&lt;a.length;f++) if(a[f]!=0) a[s++]=a[f];
    while(s&lt;a.length) a[s++]=0;
}</pre>`,
            },
          ],
        },
        {
          id: "sliding-window",
          n: 21,
          title: "Sliding Window — Optimal Subarray & Substring",
          desc: "Maintain a range [left,right] that expands/shrinks efficiently. Avoids O(n²) recomputation. Fixed size: slide by adding new, removing old. Variable: shrink when invalid.",
          questions: [
            {
              n: 37,
              t: "Fixed window — max sum of K elements",
              d: ["beginner", "intermediate"],
              a: `
<pre>arr=[2,1,5,1,3,2]  k=3

First window: 2+1+5=8
Slide: +1-2=7, +3-1=9, +2-5=6
MAX = 9 (window [5,1,3])</pre>
<pre>int maxSum(int[] a,int k){
    int ws=0,max=0;
    for(int i=0;i&lt;k;i++) ws+=a[i]; max=ws;
    for(int i=k;i&lt;a.length;i++){ ws+=a[i]-a[i-k]; max=Math.max(max,ws); }
    return max;
}</pre>`,
            },
            {
              n: 38,
              t: "Variable window — longest substring without repeating chars",
              d: ["intermediate", "advanced"],
              a: `
<pre>s="abcabcbb"

Use Set. Expand right while unique. Shrink left when duplicate.
l=0,r=0:add'a'→{a}  len=1
l=0,r=1:add'b'→{a,b} len=2
l=0,r=2:add'c'→{a,b,c} len=3
l=0,r=3:'a'dup→remove a,l=1→{b,c},add'a'→{b,c,a} len=3
...MAX=3</pre>
<div class="tip-box"><strong>🔥 Variable window problems:</strong> Longest Substring Without Repeating · Minimum Window Substring · Longest Subarray Sum≤K · Fruit Into Baskets (≤2 distinct) · Longest Repeating Char Replacement · Permutation in String</div>
<pre>int lengthOfLongestSubstring(String s){
    Map&lt;Character,Integer&gt; map=new HashMap&lt;&gt;();
    int l=0,max=0;
    for(int r=0;r&lt;s.length();r++){
        char c=s.charAt(r);
        if(map.containsKey(c)&&map.get(c)>=l) l=map.get(c)+1;
        map.put(c,r);
        max=Math.max(max,r-l+1);
    }
    return max;
}</pre>`,
            },
          ],
        },
        {
          id: "fast-slow",
          n: 22,
          title: "Fast & Slow Pointers — Tortoise & Hare",
          desc: "Two pointers moving at different speeds. Detects cycles, finds midpoints, and can find entry points of cycles. Works on both linked lists and arrays.",
          questions: [
            {
              n: 39,
              t: "Happy Number — fast/slow on implicit linked list",
              d: ["intermediate"],
              a: `
<p>Happy number: repeatedly sum squares of digits. If reaches 1 → happy. If cycles → not happy. Fast/slow detects the cycle.</p>
<pre>19: 1²+9²=82 → 8²+2²=68 → 6²+8²=100 → 1²+0²+0²=1 → HAPPY ✓
4:  4²=16 → 1²+6²=37 → 3²+7²=58 → 5²+8²=89 → 8²+9²=145 → ...CYCLE</pre>
<pre>boolean isHappy(int n){
    int slow=n, fast=sumSq(n);
    while(fast!=1&&slow!=fast){ slow=sumSq(slow); fast=sumSq(sumSq(fast)); }
    return fast==1;
}
int sumSq(int n){ int s=0; while(n>0){int d=n%10;s+=d*d;n/=10;} return s; }</pre>`,
            },
          ],
        },
        {
          id: "subsets-subsequences",
          n: 23,
          title: "Subsets & Subsequences — Include/Exclude Pattern",
          desc: "Every subset/subsequence problem = binary choice at each element: include or exclude. Generates 2ⁿ results. Can also be solved iteratively using bit manipulation.",
          questions: [
            {
              n: 40,
              t: "Subsets — recursive and iterative (bit masking)",
              d: ["intermediate"],
              a: `
<pre>RECURSIVE (include/exclude):
[1,2,3] → 2³=8 subsets
At each index, branch: include OR exclude

ITERATIVE BIT MASKING:
For n=3, masks 0..7:
  000 → {}
  001 → {1}
  010 → {2}
  011 → {1,2}
  100 → {3}
  101 → {1,3}
  110 → {2,3}
  111 → {1,2,3}

Bit i set? → include nums[i] in subset</pre>
<div class="tip-box"><strong>🔥 Subset/Subsequence problems:</strong> Subsets I & II (with duplicates) · Combination Sum · Target Sum · Partition Equal Subset Sum · Count Distinct Subsequences · Longest Common Subsequence</div>
<pre>// Recursive subsets
void gen(int[] nums,int i,List&lt;Integer&gt; cur,List&lt;List&lt;Integer&gt;&gt; res){
    if(i==nums.length){res.add(new ArrayList&lt;&gt;(cur));return;}
    cur.add(nums[i]); gen(nums,i+1,cur,res);   // include
    cur.remove(cur.size()-1); gen(nums,i+1,cur,res); // exclude
}

// Iterative bit-mask
List&lt;List&lt;Integer&gt;&gt; subsets(int[] nums){
    int n=nums.length; List&lt;List&lt;Integer&gt;&gt; res=new ArrayList&lt;&gt;();
    for(int mask=0;mask&lt;(1&lt;&lt;n);mask++){
        List&lt;Integer&gt; sub=new ArrayList&lt;&gt;();
        for(int i=0;i&lt;n;i++) if((mask&(1&lt;&lt;i))!=0) sub.add(nums[i]);
        res.add(sub);
    }
    return res;
}</pre>`,
            },
          ],
        },
        {
          id: "backtracking",
          n: 24,
          title: "Backtracking — Explore, Choose, Unchoose",
          desc: "Try all possibilities systematically. Make a choice, recurse, undo the choice. Prune branches early to avoid unnecessary work. Think of it as DFS on a decision tree.",
          questions: [
            {
              n: 41,
              t: "Backtracking template — Permutations, Combinations, N-Queens",
              d: ["intermediate", "advanced"],
              a: `
<pre>DECISION TREE for Permutations([1,2,3]):

                 []
         /        |        \\
       [1]       [2]       [3]
      /   \\     /   \\     /   \\
  [1,2][1,3][2,1][2,3][3,1][3,2]
    |    |    |    |    |    |
[1,2,3][1,3,2]...(all 6 permutations)

N-QUEENS (4×4):
Place 1 queen per row, no two queens attack each other.
At each row, try each column. Backtrack if conflict.

Valid solutions:
  . Q . .    . . Q .
  . . . Q    Q . . .
  Q . . .    . . . Q
  . . Q .    . Q . .</pre>
<div class="tip-box"><strong>🔥 Backtracking problems:</strong> Permutations (LC 46) · Combinations (LC 77) · Subsets (LC 78) · Combination Sum (LC 39) · N-Queens (LC 51) · Sudoku Solver (LC 37) · Word Search (LC 79) · Palindrome Partitioning (LC 131)</div>
<pre>// Permutations
void permute(int[] nums,boolean[] used,List&lt;Integer&gt; cur,List&lt;List&lt;Integer&gt;&gt; res){
    if(cur.size()==nums.length){res.add(new ArrayList&lt;&gt;(cur));return;}
    for(int i=0;i&lt;nums.length;i++){
        if(used[i]) continue;
        used[i]=true; cur.add(nums[i]);          // CHOOSE
        permute(nums,used,cur,res);               // EXPLORE
        cur.remove(cur.size()-1); used[i]=false; // UNCHOOSE
    }
}

// Combination Sum (reuse allowed)
void combSum(int[] cands,int rem,int start,List&lt;Integer&gt; cur,List&lt;List&lt;Integer&gt;&gt; res){
    if(rem==0){res.add(new ArrayList&lt;&gt;(cur));return;}
    for(int i=start;i&lt;cands.length;i++){
        if(cands[i]>rem) break; // PRUNE
        cur.add(cands[i]);
        combSum(cands,rem-cands[i],i,cur,res); // i not i+1 = reuse
        cur.remove(cur.size()-1);
    }
}

// N-Queens check
boolean isSafe(char[][] board,int row,int col,int n){
    for(int i=0;i&lt;row;i++) if(board[i][col]=='Q') return false;
    for(int i=row-1,j=col-1;i>=0&&j>=0;i--,j--) if(board[i][j]=='Q') return false;
    for(int i=row-1,j=col+1;i>=0&&j&lt;n;i--,j++) if(board[i][j]=='Q') return false;
    return true;
}</pre>`,
            },
          ],
        },
        {
          id: "greedy",
          n: 25,
          title: "Greedy Algorithms — Locally Optimal Choices",
          desc: "Make the best choice at each step without looking back. Correct when the problem has the greedy-choice property — local optimum leads to global optimum.",
          questions: [
            {
              n: 42,
              t: "Greedy — Jump Game, Activity Selection, Intervals",
              d: ["intermediate", "advanced"],
              a: `
<pre>JUMP GAME:
nums=[2,3,1,1,4]
Track farthest reachable index:
i=0:reach=max(0,0+2)=2
i=1:reach=max(2,1+3)=4
i=2:reach=max(4,2+1)=4
i=4:4==last index, reach≥4 → CAN REACH ✓

ACTIVITY SELECTION (max non-overlapping):
Sort by END time. Pick if starts after last picked ends.
Activities sorted by end: [(1,4),(3,5),(0,6),(5,7),(8,11),(12,16)]
Pick(1,4)→lastEnd=4
(3,5):3&lt;4 SKIP
(0,6):0&lt;4 SKIP
Pick(5,7)→lastEnd=7
Pick(8,11)→lastEnd=11
Pick(12,16)✓   → 4 activities max</pre>
<div class="tip-box"><strong>🔥 Greedy problems:</strong> Jump Game I & II · Gas Station · Meeting Rooms II · Non-overlapping Intervals · Minimum Arrows to Burst Balloons · Assign Cookies · Partition Labels · Task Scheduler</div>
<pre>// Jump Game II — min jumps
int jump(int[] nums){
    int jumps=0,curEnd=0,far=0;
    for(int i=0;i&lt;nums.length-1;i++){
        far=Math.max(far,i+nums[i]);
        if(i==curEnd){ jumps++; curEnd=far; }
    }
    return jumps;
}

// Meeting Rooms II — min rooms needed
int minMeetingRooms(int[][] intervals){
    int[] starts=new int[intervals.length],ends=new int[intervals.length];
    for(int i=0;i&lt;intervals.length;i++){starts[i]=intervals[i][0];ends[i]=intervals[i][1];}
    Arrays.sort(starts); Arrays.sort(ends);
    int rooms=0,e=0;
    for(int s=0;s&lt;starts.length;s++){
        if(starts[s]&lt;ends[e]) rooms++; else e++;
    }
    return rooms;
}</pre>`,
            },
          ],
        },
        {
          id: "bit-manipulation",
          n: 26,
          title: "Bit Manipulation — XOR Tricks & Bitmasks",
          desc: "Work directly on binary bits. XOR is the most powerful: a^a=0, a^0=a. Essential for finding single numbers, power of 2 checks, and subset enumeration.",
          questions: [
            {
              n: 43,
              t: "Bit operators and XOR tricks",
              d: ["intermediate", "advanced"],
              a: `
<pre>BIT OPERATORS:
  &   AND:  1&1=1, 1&0=0
  |   OR:   1|0=1, 0|0=0
  ^   XOR:  1^1=0, 1^0=1  (same=0, diff=1)
  ~   NOT:  ~5 = -6
  &lt;&lt;  left shift:  1&lt;&lt;3 = 8  (multiply by 2)
  &gt;&gt;  right shift: 8&gt;&gt;1 = 4  (divide by 2)

XOR PROPERTIES:
  a ^ a = 0   (number XOR itself = 0)
  a ^ 0 = a   (number XOR 0 = number)
  XOR is commutative & associative

COMMON BIT TRICKS:
  n & (n-1)          → clears rightmost set bit (check power of 2: ==0)
  n & (-n)           → isolates rightmost set bit
  n ^ (n-1)          → sets all bits below rightmost set bit
  (n >> i) & 1       → get bit at position i
  n | (1 &lt;&lt; i)      → set bit at position i
  n & ~(1 &lt;&lt; i)     → clear bit at position i</pre>
<div class="tip-box"><strong>🔥 Bit problems:</strong> Single Number (LC 136): XOR all → duplicate cancel · Single Number II (LC 137): bit counting · Missing Number (LC 268): XOR index and value · Counting Bits · Reverse Bits · Number of 1 Bits (Hamming weight) · Power of Two</div>
<pre>// Single Number — every num appears twice except one
int singleNumber(int[] nums){ int r=0; for(int n:nums)r^=n; return r; }
// WHY: pairs cancel (a^a=0), lone survives (0^x=x)

// Power of Two
boolean isPowerOfTwo(int n){ return n>0&&(n&(n-1))==0; }

// Count set bits (Brian Kernighan's)
int countBits(int n){ int c=0; while(n>0){n&=(n-1);c++;} return c; }

// Missing number — XOR all indices and values
int missingNumber(int[] nums){
    int xor=nums.length;
    for(int i=0;i&lt;nums.length;i++) xor^=i^nums[i];
    return xor;
}

// Get/Set/Clear bit at position i
boolean getBit(int n,int i){ return (n&(1&lt;&lt;i))!=0; }
int setBit(int n,int i){ return n|(1&lt;&lt;i); }
int clearBit(int n,int i){ return n&~(1&lt;&lt;i); }</pre>`,
            },
          ],
        },
      ],
    },

    /* ─────────────────────────────────────────────
       PART 6 · GRAPH ALGORITHMS
    ───────────────────────────────────────────── */
    {
      label: "PART 6 · GRAPH ALGORITHMS",
      sections: [
        {
          id: "graph-basics-bfs-dfs",
          n: 27,
          title: "Graph Basics, BFS & DFS",
          desc: "Graph = vertices + edges. BFS (Queue) → shortest path in unweighted graph. DFS (Stack/Recursion) → cycle detection, topological sort, connected components.",
          questions: [
            {
              n: 44,
              t: "Graph representation — adjacency list vs matrix",
              d: ["beginner"],
              a: `
<pre>UNDIRECTED GRAPH (5 nodes, 5 edges):
     0──1
     |   \\
     2    3──4

ADJACENCY LIST (use for sparse graphs):
  0: [1,2]   1: [0,3]   2: [0]   3: [1,4]   4: [3]
  Space: O(V+E)

ADJACENCY MATRIX (use for dense graphs / O(1) edge lookup):
     0  1  2  3  4
  0 [0, 1, 1, 0, 0]
  1 [1, 0, 0, 1, 0]
  2 [1, 0, 0, 0, 0]
  3 [0, 1, 0, 0, 1]
  4 [0, 0, 0, 1, 0]
  Space: O(V²)</pre>
<pre>// Build adjacency list
List&lt;List&lt;Integer&gt;&gt; buildGraph(int V,int[][] edges){
    List&lt;List&lt;Integer&gt;&gt; adj=new ArrayList&lt;&gt;();
    for(int i=0;i&lt;V;i++) adj.add(new ArrayList&lt;&gt;());
    for(int[] e:edges){ adj.get(e[0]).add(e[1]); adj.get(e[1]).add(e[0]); }
    return adj;
}</pre>`,
            },
            {
              n: 45,
              t: "BFS — shortest path, level order, Number of Islands",
              d: ["intermediate"],
              a: `
<pre>BFS from 0:
Graph: 0──1──3
       |       |
       2──4──5

Queue: [0] visited={0}
Pop 0, add neighbors 1,2 → Queue:[1,2]
Pop 1, add neighbors 3   → Queue:[2,3]
Pop 2, add neighbor 4    → Queue:[3,4]
Pop 3, add neighbor 5    → Queue:[4,5]
All reached, shortest path 0→5=3 edges (0→2→4→5)</pre>
<div class="tip-box"><strong>🔥 BFS problems:</strong> Shortest Path Unweighted · Number of Islands · Rotten Oranges (multi-source BFS) · Word Ladder · 01 Matrix · Walls and Gates · Snakes and Ladders</div>
<pre>int[] bfs(List&lt;List&lt;Integer&gt;&gt; adj,int src,int V){
    int[] dist=new int[V]; Arrays.fill(dist,-1); dist[src]=0;
    Queue&lt;Integer&gt; q=new LinkedList&lt;&gt;(); q.offer(src);
    while(!q.isEmpty()){ int u=q.poll(); for(int v:adj.get(u)) if(dist[v]==-1){dist[v]=dist[u]+1;q.offer(v);} }
    return dist;
}

// Number of Islands (grid BFS)
int numIslands(char[][] g){
    int count=0;
    for(int r=0;r&lt;g.length;r++) for(int c=0;c&lt;g[0].length;c++)
        if(g[r][c]=='1'){bfsFlood(g,r,c);count++;}
    return count;
}
void bfsFlood(char[][] g,int r,int c){
    g[r][c]='0'; // mark visited
    int[][] dirs={{0,1},{0,-1},{1,0},{-1,0}};
    Queue&lt;int[]&gt; q=new LinkedList&lt;&gt;(); q.offer(new int[]{r,c});
    while(!q.isEmpty()){int[] p=q.poll();for(int[] d:dirs){int nr=p[0]+d[0],nc=p[1]+d[1];if(nr>=0&&nr&lt;g.length&&nc>=0&&nc&lt;g[0].length&&g[nr][nc]=='1'){g[nr][nc]='0';q.offer(new int[]{nr,nc});}}}
}</pre>`,
            },
            {
              n: 46,
              t: "DFS — cycle detection, topological sort, connected components",
              d: ["intermediate", "advanced"],
              a: `
<pre>DFS from 0:
Graph: 0──1──4
       |  |
       2──3

Visit 0→push neighbors→visit 2→visit 3→visit 1→visit 4
DFS order: 0,2,3,1,4

TOPOLOGICAL SORT (DAG: directed acyclic graph):
  A→C, B→C, C→D
     A  B
      \\  /
       C
       |
       D
  Valid order: A,B,C,D  or  B,A,C,D

KAHN'S ALGORITHM (BFS-based topo sort):
  Track in-degrees. Start with in-degree=0 nodes.
  Remove node, reduce neighbors' in-degrees.
  If neighbor in-degree becomes 0, add to queue.</pre>
<div class="tip-box"><strong>🔥 DFS problems:</strong> Number of Islands (DFS) · Course Schedule (cycle detection) · Clone Graph · Pacific Atlantic Water Flow · Word Search · Surrounded Regions · Number of Connected Components</div>
<pre>// Topological Sort — Kahn's Algorithm
int[] topoSort(int V,int[][] prereqs){
    int[] indeg=new int[V];
    List&lt;List&lt;Integer&gt;&gt; adj=buildGraph(V,prereqs);
    for(int[] p:prereqs) indeg[p[0]]++;
    Queue&lt;Integer&gt; q=new LinkedList&lt;&gt;();
    for(int i=0;i&lt;V;i++) if(indeg[i]==0) q.offer(i);
    int[] order=new int[V]; int idx=0;
    while(!q.isEmpty()){
        int u=q.poll(); order[idx++]=u;
        for(int v:adj.get(u)) if(--indeg[v]==0) q.offer(v);
    }
    return idx==V?order:new int[0]; // empty = cycle
}</pre>`,
            },
          ],
        },
        {
          id: "dijkstra",
          n: 28,
          title: "Dijkstra's Algorithm — Shortest Path (Non-negative Weights)",
          desc: "Greedy shortest path using min-heap. Always processes closest unvisited node. O((V+E) log V). Fails with negative weights — use Bellman-Ford instead.",
          questions: [
            {
              n: 47,
              t: "Dijkstra — step-by-step with priority queue",
              d: ["advanced"],
              a: `
<pre>WEIGHTED GRAPH:
  (0)─2─(1)─3─(3)
   |         |
   6         4
   |         |
  (2)─1─────(4)

Dijkstra from 0:
dist=[0,∞,∞,∞,∞]  heap=[(0,node0)]

Process (0,0): update 1→2, 2→6
dist=[0,2,6,∞,∞]  heap=[(2,1),(6,2)]

Process (2,1): update 3→5, 4→6
dist=[0,2,6,5,6]  heap=[(5,3),(6,2),(6,4)]

Process (5,3): no better paths

Process (6,2): try 4 via 2: 6+1=7 > 6, no update

Final dist=[0,2,6,5,6] ✓</pre>
<div class="tip-box"><strong>🔥 Dijkstra problems:</strong> Network Delay Time · Path With Minimum Effort · Cheapest Flights Within K Stops · Find the City With Smallest Neighbors · Single Source Shortest Path</div>
<pre>int[] dijkstra(List&lt;List&lt;int[]&gt;&gt; adj,int src,int V){
    int[] dist=new int[V]; Arrays.fill(dist,Integer.MAX_VALUE); dist[src]=0;
    PriorityQueue&lt;int[]&gt; pq=new PriorityQueue&lt;&gt;((a,b)->a[0]-b[0]);
    pq.offer(new int[]{0,src});
    while(!pq.isEmpty()){
        int[] cur=pq.poll(); int d=cur[0],u=cur[1];
        if(d>dist[u]) continue; // stale
        for(int[] e:adj.get(u)){
            int v=e[0],w=e[1];
            if(dist[u]+w&lt;dist[v]){ dist[v]=dist[u]+w; pq.offer(new int[]{dist[v],v}); }
        }
    }
    return dist;
}</pre>`,
            },
          ],
        },
        {
          id: "bellman-ford",
          n: 29,
          title: "Bellman-Ford — Shortest Path with Negative Weights",
          desc: "Relax all edges V-1 times. Detects negative weight cycles. Slower than Dijkstra O(VE) but handles negative weights. Used in currency arbitrage detection.",
          questions: [
            {
              n: 48,
              t: "Bellman-Ford — negative weights and cycle detection",
              d: ["advanced"],
              a: `
<pre>BELLMAN-FORD:
Relax all edges V-1 times.
Edge relaxation: if dist[u]+w &lt; dist[v] → update dist[v]

GRAPH with negative edge:
  0 ──1──▶ 1 ──(-3)──▶ 2 ──2──▶ 3
            └────────4────────────┘

dist=[0,∞,∞,∞]

Round 1 (relax all edges):
  0→1: dist[1]=0+1=1
  1→2: dist[2]=1+(-3)=-2
  2→3: dist[3]=-2+2=0
  1→3: dist[3]=min(0,1+4)=0 (no change)

Round 2: No changes (already converged)

NEGATIVE CYCLE DETECTION:
  After V-1 rounds, do ONE more round.
  If any dist still updates → NEGATIVE CYCLE exists!

TIME: O(V×E)  vs Dijkstra O((V+E)logV)
USE when: negative weights exist · detect negative cycles</pre>
<pre>int[] bellmanFord(int V,int[][] edges,int src){
    int[] dist=new int[V]; Arrays.fill(dist,Integer.MAX_VALUE); dist[src]=0;
    // Relax V-1 times
    for(int i=0;i&lt;V-1;i++)
        for(int[] e:edges) // e=[u,v,weight]
            if(dist[e[0]]!=Integer.MAX_VALUE&&dist[e[0]]+e[2]&lt;dist[e[1]])
                dist[e[1]]=dist[e[0]]+e[2];
    // Check for negative cycle
    for(int[] e:edges)
        if(dist[e[0]]!=Integer.MAX_VALUE&&dist[e[0]]+e[2]&lt;dist[e[1]])
            System.out.println("Negative cycle detected!");
    return dist;
}</pre>`,
            },
          ],
        },
        {
          id: "mst",
          n: 30,
          title: "Minimum Spanning Tree — Prim's & Kruskal's",
          desc: "MST connects all V vertices with V-1 edges of minimum total weight. Prim's grows from a node (greedy + PQ). Kruskal's picks smallest edges globally (greedy + Union-Find).",
          questions: [
            {
              n: 49,
              t: "Prim's Algorithm — grow MST from a starting node",
              d: ["advanced"],
              a: `
<pre>PRIM'S ALGORITHM:
Start from any node, greedily add cheapest edge to unvisited node.

GRAPH:
  0──4──1
  |     |
  8     2
  |     |
  2──3──3
      \\
       6──4

Start at 0:
  In MST={0}, heap=[(4,0→1),(8,0→2)]
  Pick (4,0→1): add node 1, MST={0,1}
  Update heap with 1's edges: (2,1→3)
  Pick (2,1→3): add node 3, MST={0,1,3}
  ...continue until all nodes added

Total MST weight = sum of picked edges</pre>
<pre>int primMST(List&lt;List&lt;int[]&gt;&gt; adj,int V){
    boolean[] inMST=new boolean[V];
    PriorityQueue&lt;int[]&gt; pq=new PriorityQueue&lt;&gt;((a,b)->a[0]-b[0]);
    pq.offer(new int[]{0,0}); // {weight, node}
    int totalWeight=0;
    while(!pq.isEmpty()){
        int[] cur=pq.poll(); int w=cur[0],u=cur[1];
        if(inMST[u]) continue;
        inMST[u]=true; totalWeight+=w;
        for(int[] e:adj.get(u)) if(!inMST[e[0]]) pq.offer(new int[]{e[1],e[0]});
    }
    return totalWeight;
}</pre>`,
            },
            {
              n: 50,
              t: "Kruskal's Algorithm — sort edges, Union-Find",
              d: ["advanced"],
              a: `
<pre>KRUSKAL'S ALGORITHM:
Sort all edges by weight. Add edge if it doesn't form a cycle.
Use Union-Find to detect cycles.

GRAPH edges sorted by weight:
  (1,2,w=1),(0,3,w=2),(3,4,w=3),(0,1,w=4),(2,4,w=5),(1,4,w=6)

Pick (1,2,1): find(1)≠find(2) → add, union(1,2)  MST edges: 1
Pick (0,3,2): find(0)≠find(3) → add, union(0,3)  MST edges: 2
Pick (3,4,3): find(3)≠find(4) → add, union(3,4)  MST edges: 3
Pick (0,1,4): find(0)≠find(1) → add, union(0,1)  MST edges: 4
(V-1=4 edges added, MST complete!)

Total weight = 1+2+3+4 = 10</pre>
<div class="tip-box"><strong>Prim's vs Kruskal's:</strong><br>
Prim's: better for dense graphs (many edges). Starts from a node and grows.<br>
Kruskal's: better for sparse graphs. Considers global edge list. Needs Union-Find.<br>
Both produce same MST weight (may differ in edge choice for equal weights).</div>
<pre>int kruskalMST(int V,int[][] edges){ // edges: [u,v,weight]
    Arrays.sort(edges,(a,b)->a[2]-b[2]); // sort by weight
    int[] parent=new int[V],rank=new int[V];
    for(int i=0;i&lt;V;i++) parent[i]=i;
    int totalWeight=0,edgeCount=0;
    for(int[] e:edges){
        int pu=find(parent,e[0]),pv=find(parent,e[1]);
        if(pu==pv) continue; // cycle — skip
        union(parent,rank,pu,pv); totalWeight+=e[2]; edgeCount++;
        if(edgeCount==V-1) break;
    }
    return totalWeight;
}
int find(int[] p,int x){ if(p[x]!=x)p[x]=find(p,p[x]); return p[x]; }
void union(int[] p,int[] r,int a,int b){ if(r[a]&lt;r[b]){p[a]=b;}else if(r[a]>r[b]){p[b]=a;}else{p[b]=a;r[a]++;} }</pre>`,
            },
          ],
        },
      ],
    },

    /* ─────────────────────────────────────────────
       PART 7 · DYNAMIC PROGRAMMING
    ───────────────────────────────────────────── */
    {
      label: "PART 7 · DYNAMIC PROGRAMMING",
      sections: [
        {
          id: "dp-fundamentals",
          n: 31,
          title: "DP Fundamentals — Memoization vs Tabulation",
          desc: "DP = recursion + caching. Two approaches: Top-down (memoization) adds a cache to recursion. Bottom-up (tabulation) fills a table from base cases up. No repeated work → polynomial time.",
          questions: [
            {
              n: 51,
              t: "Why DP? Overlapping subproblems and optimal substructure",
              d: ["beginner", "intermediate"],
              a: `
<pre>fib(5) WITHOUT DP — O(2ⁿ):
                fib(5)
               /      \\
          fib(4)       fib(3)
         /     \\       /    \\
     fib(3)  fib(2) fib(2) fib(1)
     /    \\
  fib(2) fib(1)
fib(3) and fib(2) computed MULTIPLE TIMES!

TOP-DOWN (Memoization) — cache in HashMap/array:
  fib(5): not in memo → recurse
    fib(4): not in memo → recurse
      fib(3): computed once → stored as memo[3]=2
    memo[4]=3
  memo[5]=5 ← each subproblem solved ONCE → O(n)

BOTTOM-UP (Tabulation) — fill table from base:
  dp[0]=0, dp[1]=1
  dp[2]=dp[1]+dp[0]=1
  dp[3]=dp[2]+dp[1]=2
  dp[4]=dp[3]+dp[2]=3
  dp[5]=dp[4]+dp[3]=5 ✓
  No recursion, no stack overflow</pre>
<div class="tip-box"><strong>When to use DP:</strong><br>
1. Overlapping subproblems (same sub-computation repeated)<br>
2. Optimal substructure (optimal solution built from optimal sub-solutions)<br>
Ask: "Can I define this as f(smaller input)?" → yes → DP candidate</div>
<pre>// Fibonacci — 3 approaches
int fibRecursive(int n){ return n&lt;=1?n:fibRecursive(n-1)+fibRecursive(n-2); } // O(2ⁿ)

int[] memo=new int[101]; Arrays.fill(memo,-1);
int fibMemo(int n){ if(n&lt;=1)return n; if(memo[n]!=-1)return memo[n]; return memo[n]=fibMemo(n-1)+fibMemo(n-2); } // O(n)

int fibDP(int n){ int a=0,b=1; for(int i=2;i&lt;=n;i++){int c=a+b;a=b;b=c;} return n==0?0:b; } // O(n) time O(1) space</pre>`,
            },
            {
              n: 52,
              t: "1D DP — Coin Change, House Robber, Climbing Stairs",
              d: ["intermediate"],
              a: `
<pre>COIN CHANGE (min coins to make amount):
coins=[1,5,6], amount=11

dp[i] = min coins to make amount i
dp[0]=0 (base)
dp[1]=min(dp[0]+1)=1              (use coin 1)
dp[5]=min(dp[4]+1,dp[0]+1)=1     (use coin 5)
dp[6]=min(dp[5]+1,dp[0]+1)=1     (use coin 6)
dp[10]=min(dp[9]+1,dp[5]+1,dp[4]+1)=2 (6+4? no, 5+5=2)
dp[11]=min(dp[10]+1,dp[6]+1,dp[5]+1)=2 (5+6=2) ✓

HOUSE ROBBER:
houses=[2,7,9,3,1]
Don't rob adjacent houses. Max loot?

dp[0]=2, dp[1]=max(2,7)=7
dp[2]=max(dp[1],dp[0]+9)=max(7,11)=11
dp[3]=max(dp[2],dp[1]+3)=max(11,10)=11
dp[4]=max(dp[3],dp[2]+1)=max(11,12)=12 ✓</pre>
<pre>// Coin Change
int coinChange(int[] coins,int amount){
    int[] dp=new int[amount+1]; Arrays.fill(dp,amount+1); dp[0]=0;
    for(int i=1;i&lt;=amount;i++)
        for(int c:coins) if(c&lt;=i) dp[i]=Math.min(dp[i],dp[i-c]+1);
    return dp[amount]>amount?-1:dp[amount];
}
// Climbing Stairs: dp[i]=dp[i-1]+dp[i-2] (same as Fibonacci)
// House Robber: dp[i]=max(dp[i-1], dp[i-2]+nums[i])</pre>`,
            },
            {
              n: 53,
              t: "2D DP — LCS, Edit Distance, Unique Paths, 0/1 Knapsack",
              d: ["intermediate", "advanced"],
              a: `
<pre>LCS (Longest Common Subsequence):
text1="ABCBDAB", text2="BDCAB"

      ""  B  D  C  A  B
   "" [0][0][0][0][0][0]
   A  [0][0][0][0][1][1]
   B  [0][1][1][1][1][2]
   C  [0][1][1][2][2][2]
   B  [0][1][1][2][2][3]
   D  [0][1][2][2][2][3]
   A  [0][1][2][2][3][3]
   B  [0][1][2][2][3][4] ← LCS=4

RULE: chars match → dp[i][j]=dp[i-1][j-1]+1
      else       → dp[i][j]=max(dp[i-1][j],dp[i][j-1])

0/1 KNAPSACK: (items with weight & value, capacity W)
  dp[i][w] = max value using first i items with capacity w
  Include item i: dp[i-1][w-weight[i]] + value[i]
  Exclude item i: dp[i-1][w]
  dp[i][w] = max of include/exclude</pre>
<pre>// LCS
int lcs(String s1,String s2){
    int m=s1.length(),n=s2.length();
    int[][] dp=new int[m+1][n+1];
    for(int i=1;i&lt;=m;i++) for(int j=1;j&lt;=n;j++)
        dp[i][j]=s1.charAt(i-1)==s2.charAt(j-1)?dp[i-1][j-1]+1:Math.max(dp[i-1][j],dp[i][j-1]);
    return dp[m][n];
}

// Unique Paths (grid m×n, move only right or down)
int uniquePaths(int m,int n){
    int[][] dp=new int[m][n];
    for(int[] r:dp) Arrays.fill(r,1); // first row/col = 1
    for(int i=1;i&lt;m;i++) for(int j=1;j&lt;n;j++) dp[i][j]=dp[i-1][j]+dp[i][j-1];
    return dp[m-1][n-1];
}

// Edit Distance (Levenshtein)
int editDistance(String w1,String w2){
    int m=w1.length(),n=w2.length();
    int[][] dp=new int[m+1][n+1];
    for(int i=0;i&lt;=m;i++) dp[i][0]=i;
    for(int j=0;j&lt;=n;j++) dp[0][j]=j;
    for(int i=1;i&lt;=m;i++) for(int j=1;j&lt;=n;j++)
        dp[i][j]=w1.charAt(i-1)==w2.charAt(j-1)?dp[i-1][j-1]:1+Math.min(dp[i-1][j-1],Math.min(dp[i-1][j],dp[i][j-1]));
    return dp[m][n];
}</pre>`,
            },
            {
              n: 54,
              t: "String DP — Palindrome, Word Break, Distinct Subsequences",
              d: ["advanced"],
              a: `
<pre>LONGEST PALINDROMIC SUBSTRING:
Two approaches:
1. Expand from center — O(n²) time O(1) space
   For each center (odd/even), expand while chars match

2. DP table — dp[i][j]=true if s[i..j] is palindrome
   dp[i][i]=true (single char)
   dp[i][j]: s[i]==s[j] && dp[i+1][j-1]

WORD BREAK:
s="leetcode", wordDict=["leet","code"]
dp[0]=true (empty string)
dp[1..3]=false
dp[4]: s[0..3]="leet" in dict && dp[0]=true → dp[4]=true
dp[8]: s[4..7]="code" in dict && dp[4]=true → dp[8]=true ✓</pre>
<pre>// Longest Palindromic Substring — expand from center
String longestPalindrome(String s){
    String res="";
    for(int i=0;i&lt;s.length();i++){
        String odd=expand(s,i,i), even=expand(s,i,i+1);
        if(odd.length()>res.length()) res=odd;
        if(even.length()>res.length()) res=even;
    }
    return res;
}
String expand(String s,int l,int r){ while(l>=0&&r&lt;s.length()&&s.charAt(l)==s.charAt(r)){l--;r++;} return s.substring(l+1,r); }

// Word Break
boolean wordBreak(String s,List&lt;String&gt; dict){
    Set&lt;String&gt; set=new HashSet&lt;&gt;(dict);
    boolean[] dp=new boolean[s.length()+1]; dp[0]=true;
    for(int i=1;i&lt;=s.length();i++)
        for(int j=0;j&lt;i;j++)
            if(dp[j]&&set.contains(s.substring(j,i))){ dp[i]=true; break; }
    return dp[s.length()];
}</pre>`,
            },
          ],
        },
      ],
    },
  ],
};
