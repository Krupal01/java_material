window.CT_STACKQUEUE = {
  topic: "Stack & Queue",
  icon: "📚",
  range: "171–210",
  questions: [
    {
      id: 171,
      title: "Implement a stack (array/list based)",
      tip: "Use ArrayDeque as a stack; push=addFirst, pop=removeFirst, peek=peekFirst",
      iteration: {
        hint: "Use int[] with a top pointer; push increments, pop decrements top",
        snippet: `int[] stack = new int[n];\nint top = -1;\nvoid push(int x) { stack[++top] = x; }\nint pop() { return stack[top--]; }\nint peek() { return stack[top]; }`,
      },
      recursion: {
        hint: "Recursion naturally uses the call stack; no separate data structure needed for simulation",
        snippet: `// Reverse a stack recursively\nvoid reverse(Deque<Integer> s) {\n    if (s.isEmpty()) return;\n    int top = s.pop(); reverse(s);\n    insertAtBottom(s, top);\n}`,
      },
      stream: {
        hint: "Use ArrayDeque; Java Streams can build stack state from a list",
        snippet: `Deque<Integer> stack = new ArrayDeque<>();\nList.of(1,2,3).forEach(stack::push);\nOptional<Integer> top = Optional.ofNullable(stack.peek());`,
      },
    },
    {
      id: 172,
      title: "Implement a queue",
      tip: "Use ArrayDeque as a queue; offer=addLast, poll=removeFirst, peek=peekFirst",
      iteration: {
        hint: "Use circular array with front/rear pointers to avoid shifting",
        snippet: `int[] q = new int[n];\nint front = 0, rear = 0, size = 0;\nvoid offer(int x) { q[rear++ % n] = x; size++; }\nint poll() { size--; return q[front++ % n]; }\nint peek() { return q[front % n]; }`,
      },
      recursion: {
        hint: "Use call stack to reverse queue elements then re-enqueue",
        snippet: `void reverse(Queue<Integer> q) {\n    if (q.isEmpty()) return;\n    int x = q.poll();\n    reverse(q);\n    q.offer(x);\n}`,
      },
      stream: {
        hint: "LinkedList implements Queue; collect a stream into a queue with reduce or forEach",
        snippet: `Queue<Integer> q = new ArrayDeque<>();\nIntStream.rangeClosed(1, 5).forEach(q::offer);\nList<Integer> drained = new ArrayList<>();\nwhile (!q.isEmpty()) drained.add(q.poll());`,
      },
    },
    {
      id: 173,
      title: "Implement a queue using two stacks",
      tip: "Push to stack1; on poll, if stack2 empty, pour all of stack1 into stack2",
      iteration: {
        hint: "Lazy transfer: only move stack1 -> stack2 when stack2 is empty on dequeue",
        snippet: `Deque<Integer> s1 = new ArrayDeque<>(), s2 = new ArrayDeque<>();\nvoid offer(int x) { s1.push(x); }\nint poll() {\n    if (s2.isEmpty()) while (!s1.isEmpty()) s2.push(s1.pop());\n    return s2.pop();\n}`,
      },
      recursion: {
        hint: "Recursively empty s1 into s2 via the call stack",
        snippet: `void transfer(Deque<Integer> s1, Deque<Integer> s2) {\n    if (s1.isEmpty()) return;\n    int x = s1.pop();\n    transfer(s1, s2);\n    s2.push(x);\n}`,
      },
      stream: {
        hint: "Build the transfer functionally using Stream and collect",
        snippet: `// Pour s1 into s2 preserving FIFO order\nDeque<Integer> s2 = new ArrayDeque<>();\nStream.generate(s1::pop)\n    .limit(s1.size())\n    .forEach(s2::push);`,
      },
    },
    {
      id: 174,
      title: "Implement a stack using two queues",
      tip: "On push, enqueue to q2, pour q1 into q2, then swap q1 and q2 — top is always q1.front",
      iteration: {
        hint: "Keep top element always at the front of q1 by rotating after each push",
        snippet: `Queue<Integer> q1 = new ArrayDeque<>(), q2 = new ArrayDeque<>();\nvoid push(int x) {\n    q2.offer(x);\n    while (!q1.isEmpty()) q2.offer(q1.poll());\n    Queue<Integer> tmp = q1; q1 = q2; q2 = tmp;\n}\nint pop() { return q1.poll(); }`,
      },
      recursion: {
        hint: "Recursively drain q1 into q2 leaving the last element as the 'top'",
        snippet: `int pop(Queue<Integer> q1, Queue<Integer> q2) {\n    if (q1.size() == 1) return q1.poll();\n    q2.offer(q1.poll());\n    int val = pop(q1, q2);\n    Queue<Integer> tmp = q1; q1 = q2; q2 = tmp;\n    return val;\n}`,
      },
      stream: {
        hint: "Rebuild the rotated queue using stream after inserting new element",
        snippet: `List<Integer> buf = new ArrayList<>(q1);\nbuf.add(0, x); // prepend new element\nq1.clear();\nbuf.forEach(q1::offer);`,
      },
    },
    {
      id: 175,
      title: "Min stack (O(1) getMin)",
      tip: "Maintain a parallel min-stack that tracks the current minimum at each level",
      iteration: {
        hint: "Push to minStack only when new value <= current min; pop in sync",
        snippet: `Deque<Integer> stack = new ArrayDeque<>(), minSt = new ArrayDeque<>();\nvoid push(int x) {\n    stack.push(x);\n    if (minSt.isEmpty() || x <= minSt.peek()) minSt.push(x);\n}\nvoid pop() { if (stack.pop().equals(minSt.peek())) minSt.pop(); }\nint getMin() { return minSt.peek(); }`,
      },
      recursion: {
        hint: "Carry the running min through recursive calls",
        snippet: `int minAfterPops(Deque<Integer> st, Deque<Integer> mn, int k) {\n    if (k == 0) return mn.peek();\n    int v = st.pop();\n    if (v == mn.peek()) mn.pop();\n    int res = minAfterPops(st, mn, k - 1);\n    st.push(v); if (mn.isEmpty() || v <= mn.peek()) mn.push(v);\n    return res;\n}`,
      },
      stream: {
        hint: "Use IntStream.min after collecting stack to stream for a one-shot min query",
        snippet: `Deque<Integer> stack = new ArrayDeque<>();\nList.of(3,1,2).forEach(stack::push);\nint min = stack.stream()\n    .mapToInt(Integer::intValue)\n    .min().orElseThrow();`,
      },
    },
    {
      id: 176,
      title: "Valid parentheses",
      tip: "Push opening brackets; on closing bracket, pop and check if it matches",
      iteration: {
        hint: "Use a map for closing->opening matching; stack must be empty at end",
        snippet: `Map<Character,Character> map = Map.of(')','(', ']','[', '}','{');\nDeque<Character> st = new ArrayDeque<>();\nfor (char c : s.toCharArray()) {\n    if (map.containsValue(c)) st.push(c);\n    else if (st.isEmpty() || st.pop() != map.get(c)) return false;\n}\nreturn st.isEmpty();`,
      },
      recursion: {
        hint: "Recurse through characters, threading the stack state",
        snippet: `boolean check(char[] s, int i, Deque<Character> st) {\n    if (i == s.length) return st.isEmpty();\n    if (s[i]=='(' || s[i]=='[' || s[i]=='{') { st.push(s[i]); return check(s,i+1,st); }\n    if (st.isEmpty()) return false;\n    char top = st.pop();\n    return match(top,s[i]) && check(s,i+1,st);\n}`,
      },
      stream: {
        hint: "Reduce characters into a stack using Stream.reduce (fold left)",
        snippet: `Deque<Character> st = s.chars()\n    .mapToObj(c -> (char)c)\n    .reduce(new ArrayDeque<>(), (stack, c) -> {\n        if (\"([{\".indexOf(c) >= 0) stack.push(c);\n        else if (!stack.isEmpty()) stack.pop();\n        return stack;\n    }, (a,b) -> a);\nreturn st.isEmpty();`,
      },
    },
    {
      id: 177,
      title: "Largest rectangle in histogram",
      tip: "Use a monotonic increasing stack; pop when current bar is shorter and calculate area",
      iteration: {
        hint: "Append 0 sentinel to flush remaining bars; area = height * (right - left - 1)",
        snippet: `int max = 0;\nDeque<Integer> st = new ArrayDeque<>();\nint[] h = Arrays.copyOf(heights, heights.length + 1);\nfor (int i = 0; i < h.length; i++) {\n    while (!st.isEmpty() && h[i] < h[st.peek()])\n        { int hi = h[st.pop()]; int w = st.isEmpty() ? i : i-st.peek()-1; max = Math.max(max, hi*w); }\n    st.push(i);\n}\nreturn max;`,
      },
      recursion: {
        hint: "Divide and conquer: find the minimum bar and recurse on left/right halves",
        snippet: `int solve(int[] h, int l, int r) {\n    if (l > r) return 0;\n    int minIdx = l;\n    for (int i = l+1; i <= r; i++) if (h[i] < h[minIdx]) minIdx = i;\n    return Math.max(h[minIdx] * (r-l+1),\n        Math.max(solve(h,l,minIdx-1), solve(h,minIdx+1,r)));\n}`,
      },
      stream: {
        hint: "No natural stream solution; use IntStream to find min index in subarray for divide-and-conquer",
        snippet: `// Functional style for finding min index in range\nint minIdx = IntStream.rangeClosed(l, r)\n    .boxed()\n    .min(Comparator.comparingInt(i -> h[i]))\n    .orElse(l);`,
      },
    },
    {
      id: 178,
      title: "Daily temperatures",
      tip: "Monotonic decreasing stack of indices; pop when a warmer day is found",
      iteration: {
        hint: "Store index in stack; answer[i] = current_index - popped_index",
        snippet: `int[] ans = new int[T.length];\nDeque<Integer> st = new ArrayDeque<>();\nfor (int i = 0; i < T.length; i++) {\n    while (!st.isEmpty() && T[i] > T[st.peek()])\n        { int j = st.pop(); ans[j] = i - j; }\n    st.push(i);\n}\nreturn ans;`,
      },
      recursion: {
        hint: "Use recursion to process from right to left, skipping ahead using precomputed answers",
        snippet: `void solve(int[] T, int[] ans, int i) {\n    if (i < 0) return;\n    solve(T, ans, i - 1);\n    int j = i + 1;\n    while (j < T.length && T[j] <= T[i]) j += ans[j] == 0 ? 1 : ans[j];\n    ans[i] = (j < T.length) ? j - i : 0;\n}`,
      },
      stream: {
        hint: "Use IntStream to map each index to its next warmer day index",
        snippet: `int[] ans = new int[T.length];\nIntStream.range(0, T.length).forEach(i -> {\n    int j = i + 1;\n    while (j < T.length && T[j] <= T[i]) j++;\n    ans[i] = (j < T.length) ? j - i : 0;\n});`,
      },
    },
    {
      id: 179,
      title: "Next greater element",
      tip: "Monotonic decreasing stack; pop and record next greater when a larger element is seen",
      iteration: {
        hint: "Traverse right to left or use stack to find the next greater for each element",
        snippet: `int[] res = new int[nums.length];\nArrays.fill(res, -1);\nDeque<Integer> st = new ArrayDeque<>();\nfor (int i = 0; i < nums.length; i++) {\n    while (!st.isEmpty() && nums[i] > nums[st.peek()])\n        res[st.pop()] = nums[i];\n    st.push(i);\n}\nreturn res;`,
      },
      recursion: {
        hint: "Recurse from right, using a stack passed as state to find the next greater",
        snippet: `void solve(int[] a, int[] res, int i, Deque<Integer> st) {\n    if (i < 0) return;\n    while (!st.isEmpty() && st.peek() <= a[i]) st.pop();\n    res[i] = st.isEmpty() ? -1 : st.peek();\n    st.push(a[i]);\n    solve(a, res, i-1, st);\n}`,
      },
      stream: {
        hint: "Use TreeMap or sorted structure to find next greater in a functional way",
        snippet: `int[] res = new int[nums.length];\nIntStream.range(0, nums.length).forEach(i ->\n    res[i] = IntStream.range(i+1, nums.length)\n        .map(j -> nums[j])\n        .filter(v -> v > nums[i])\n        .findFirst().orElse(-1)\n);`,
      },
    },
    {
      id: 180,
      title: "Next smaller element",
      tip: "Monotonic increasing stack; pop and record next smaller when a smaller element is seen",
      iteration: {
        hint: "Push index; pop when current element is smaller — symmetric to next greater",
        snippet: `int[] res = new int[nums.length];\nArrays.fill(res, -1);\nDeque<Integer> st = new ArrayDeque<>();\nfor (int i = 0; i < nums.length; i++) {\n    while (!st.isEmpty() && nums[i] < nums[st.peek()])\n        res[st.pop()] = nums[i];\n    st.push(i);\n}\nreturn res;`,
      },
      recursion: {
        hint: "Recurse from right maintaining a monotonic-increasing stack",
        snippet: `void solve(int[] a, int[] res, int i, Deque<Integer> st) {\n    if (i < 0) return;\n    while (!st.isEmpty() && st.peek() >= a[i]) st.pop();\n    res[i] = st.isEmpty() ? -1 : st.peek();\n    st.push(a[i]);\n    solve(a, res, i-1, st);\n}`,
      },
      stream: {
        hint: "Functionally find the first smaller element to the right using stream filter",
        snippet: `int[] res = IntStream.range(0, nums.length)\n    .map(i -> IntStream.range(i+1, nums.length)\n        .map(j -> nums[j])\n        .filter(v -> v < nums[i])\n        .findFirst().orElse(-1))\n    .toArray();`,
      },
    },
    {
      id: 181,
      title: "Sliding window maximum (deque-based)",
      tip: "Maintain a monotonic decreasing deque of indices; front is always the window maximum",
      iteration: {
        hint: "Remove indices outside window from front; remove smaller elements from back",
        snippet: `int n = nums.length, k = K;\nint[] res = new int[n - k + 1];\nDeque<Integer> dq = new ArrayDeque<>();\nfor (int i = 0; i < n; i++) {\n    if (!dq.isEmpty() && dq.peek() <= i - k) dq.poll();\n    while (!dq.isEmpty() && nums[dq.peekLast()] <= nums[i]) dq.pollLast();\n    dq.offer(i);\n    if (i >= k - 1) res[i - k + 1] = nums[dq.peek()];\n}\nreturn res;`,
      },
      recursion: {
        hint: "Recursively build the result array; deque state must be passed along",
        snippet: `void solve(int[] a, Deque<Integer> dq, int[] res, int i, int k) {\n    if (i == a.length) return;\n    if (!dq.isEmpty() && dq.peek() <= i - k) dq.poll();\n    while (!dq.isEmpty() && a[dq.peekLast()] <= a[i]) dq.pollLast();\n    dq.offer(i);\n    if (i >= k - 1) res[i - k + 1] = a[dq.peek()];\n    solve(a, dq, res, i + 1, k);\n}`,
      },
      stream: {
        hint: "Use IntStream to slide the window; Collections.max per window (O(nk) but concise)",
        snippet: `return IntStream.rangeClosed(0, nums.length - k)\n    .map(i -> IntStream.range(i, i + k)\n        .map(j -> nums[j]).max().orElse(0))\n    .toArray();`,
      },
    },
    {
      id: 182,
      title: "Evaluate postfix expression",
      tip: "Push operands; on operator pop two operands, apply, push result",
      iteration: {
        hint: "Iterate tokens; push numbers, pop and apply for +,-,*,/",
        snippet: `Deque<Integer> st = new ArrayDeque<>();\nfor (String t : tokens) {\n    if (\"+-*/\".contains(t)) {\n        int b = st.pop(), a = st.pop();\n        st.push(t.equals(\"+\")?a+b:t.equals(\"-\")?a-b:t.equals(\"*\")?a*b:a/b);\n    } else st.push(Integer.parseInt(t));\n}\nreturn st.pop();`,
      },
      recursion: {
        hint: "Process tokens right-to-left recursively, building sub-expressions",
        snippet: `int eval(String[] tokens, int[] idx) {\n    String t = tokens[idx[0]--];\n    if (\"+-*/\".contains(t)) {\n        int b = eval(tokens, idx), a = eval(tokens, idx);\n        return t.equals(\"+\")?a+b:t.equals(\"-\")?a-b:t.equals(\"*\")?a*b:a/b;\n    }\n    return Integer.parseInt(t);\n}`,
      },
      stream: {
        hint: "Reduce token stream into a stack using functional fold",
        snippet: `Deque<Integer> st = Arrays.stream(tokens).reduce(\n    new ArrayDeque<>(),\n    (stack, t) -> { /* apply operator or push */ return stack; },\n    (a, b) -> a\n);\nreturn st.pop();`,
      },
    },
    {
      id: 183,
      title: "Evaluate prefix expression",
      tip: "Traverse prefix from right to left; push operands, on operator pop two and apply",
      iteration: {
        hint: "Iterate from right; when operator, pop two operands (first popped is left operand)",
        snippet: `Deque<Integer> st = new ArrayDeque<>();\nfor (int i = tokens.length - 1; i >= 0; i--) {\n    String t = tokens[i];\n    if (\"+-*/\".contains(t)) {\n        int a = st.pop(), b = st.pop();\n        st.push(t.equals(\"+\")?a+b:t.equals(\"-\")?a-b:t.equals(\"*\")?a*b:a/b);\n    } else st.push(Integer.parseInt(t));\n}\nreturn st.pop();`,
      },
      recursion: {
        hint: "Recurse left to right; each operator consumes two recursive sub-evaluations",
        snippet: `int eval(String[] t, int[] i) {\n    String tok = t[i[0]++];\n    if (\"+-*/\".contains(tok)) {\n        int a = eval(t, i), b = eval(t, i);\n        return tok.equals(\"+\")?a+b:tok.equals(\"-\")?a-b:tok.equals(\"*\")?a*b:a/b;\n    }\n    return Integer.parseInt(tok);\n}`,
      },
      stream: {
        hint: "Collect tokens into a deque then process from left using recursive evaluation",
        snippet: `Deque<String> dq = Arrays.stream(tokens)\n    .collect(Collectors.toCollection(ArrayDeque::new));\n// Then evaluate from front using recursive helper\nint result = evalDeque(dq);`,
      },
    },
    {
      id: 184,
      title: "Design a circular queue",
      tip: "Use fixed array with head/tail pointers and size counter; full when size==capacity",
      iteration: {
        hint: "tail = (tail+1) % capacity on enqueue; head = (head+1) % capacity on dequeue",
        snippet: `int[] q; int head=0, tail=0, size=0, cap;\nCircularQueue(int k) { cap=k; q=new int[k]; }\nboolean enQueue(int v) { if(size==cap) return false; q[tail]= v; tail=(tail+1)%cap; size++; return true; }\nboolean deQueue() { if(size==0) return false; head=(head+1)%cap; size--; return true; }\nint Front() { return size==0?-1:q[head]; }\nint Rear() { return size==0?-1:q[(tail-1+cap)%cap]; }`,
      },
      recursion: {
        hint: "Recursion rarely used here; model enqueue as recursive insert at tail",
        snippet: `// Drain circular queue recursively into list\nvoid drain(int[] q, int head, int size, int cap, List<Integer> out) {\n    if (size == 0) return;\n    out.add(q[head]);\n    drain(q, (head+1)%cap, size-1, cap, out);\n}`,
      },
      stream: {
        hint: "Use IntStream to iterate over the circular buffer indices for display",
        snippet: `// Traverse circular buffer elements in order\nList<Integer> elems = IntStream.range(0, size)\n    .map(i -> q[(head + i) % cap])\n    .boxed()\n    .collect(Collectors.toList());`,
      },
    },
    {
      id: 185,
      title: "Design a deque",
      tip: "Use ArrayDeque or doubly linked list; support insertFront, insertLast, deleteFront, deleteLast in O(1)",
      iteration: {
        hint: "ArrayDeque already supports all deque ops; for array-based, use circular array with both head/tail",
        snippet: `Deque<Integer> dq = new ArrayDeque<>();\ndq.addFirst(1);   // insertFront\ndq.addLast(2);    // insertLast\ndq.removeFirst(); // deleteFront\ndq.removeLast();  // deleteLast\nint f = dq.peekFirst(), r = dq.peekLast();`,
      },
      recursion: {
        hint: "Recursively print deque elements front-to-back and back-to-front",
        snippet: `void printFwd(Deque<Integer> dq) {\n    if (dq.isEmpty()) return;\n    System.out.print(dq.peekFirst() + \" \");\n    int f = dq.pollFirst();\n    printFwd(dq);\n    dq.addFirst(f);\n}`,
      },
      stream: {
        hint: "Stream a deque to list; use LinkedList as deque to support all operations",
        snippet: `Deque<Integer> dq = new ArrayDeque<>(List.of(1,2,3,4));\nList<Integer> asList = new ArrayList<>(dq);\nList<Integer> reversed = new ArrayList<>(((ArrayDeque<Integer>)dq).descendingIterator()\n    == null ? dq : dq);`,
      },
    },
    {
      id: 186,
      title: "LRU cache",
      tip: "Use LinkedHashMap with accessOrder=true; override removeEldestEntry to evict on capacity",
      iteration: {
        hint: "LinkedHashMap maintains insertion/access order; set accessOrder=true in constructor",
        snippet: `class LRUCache extends LinkedHashMap<Integer,Integer> {\n    int cap;\n    LRUCache(int c) { super(c, 0.75f, true); cap = c; }\n    public int get(int k) { return super.getOrDefault(k, -1); }\n    public void put(int k, int v) { super.put(k, v); }\n    protected boolean removeEldestEntry(Map.Entry<Integer,Integer> e) { return size() > cap; }\n}`,
      },
      recursion: {
        hint: "Recursion not typical; use it to traverse and rebuild cache order",
        snippet: `// Evict LRU by recursively collecting keys in access order\nvoid evictIfNeeded(LinkedHashMap<Integer,Integer> cache, int cap) {\n    if (cache.size() <= cap) return;\n    cache.remove(cache.keySet().iterator().next());\n}`,
      },
      stream: {
        hint: "Use streams to inspect cache state; eviction logic still requires LinkedHashMap",
        snippet: `// Find least recently used key\nOptional<Integer> lruKey = cache.entrySet().stream()\n    .findFirst()\n    .map(Map.Entry::getKey);\nlruKey.ifPresent(cache::remove);`,
      },
    },
    {
      id: 187,
      title: "LFU cache",
      tip: "Track frequency per key and a min-frequency; use two maps (key->freq, freq->LinkedHashSet of keys)",
      iteration: {
        hint: "On access, increment frequency, move key to next frequency bucket, update minFreq",
        snippet: `Map<Integer,Integer> keyVal=new HashMap<>(), keyFreq=new HashMap<>();\nMap<Integer,LinkedHashSet<Integer>> freqKeys=new HashMap<>();\nint cap, minFreq=0;\nvoid update(int k) {\n    int f=keyFreq.merge(k,1,Integer::sum)-1;\n    freqKeys.computeIfAbsent(f,x->new LinkedHashSet<>()).remove(k);\n    if(freqKeys.get(f).isEmpty()&&f==minFreq) minFreq++;\n    freqKeys.computeIfAbsent(f+1,x->new LinkedHashSet<>()).add(k);\n}`,
      },
      recursion: {
        hint: "Recursion not natural here; use iterative bucket management",
        snippet: `// Recursively find the min-frequency bucket with entries\nint findMinFreq(Map<Integer,LinkedHashSet<Integer>> freqMap, int f) {\n    if (freqMap.containsKey(f) && !freqMap.get(f).isEmpty()) return f;\n    return findMinFreq(freqMap, f + 1);\n}`,
      },
      stream: {
        hint: "Use stream to find the least frequently used key among tied frequencies",
        snippet: `// Get all keys at minimum frequency\nSet<Integer> lfu = freqKeys.getOrDefault(minFreq, new LinkedHashSet<>());\nOptional<Integer> evict = lfu.stream().findFirst();\nevict.ifPresent(k -> { lfu.remove(k); keyVal.remove(k); keyFreq.remove(k); });`,
      },
    },
    {
      id: 188,
      title: "Stock span problem",
      tip: "Monotonic decreasing stack of (price, span) pairs; pop and accumulate span while price <= current",
      iteration: {
        hint: "Stack stores (price, span); merge spans of all smaller or equal preceding prices",
        snippet: `Deque<int[]> st = new ArrayDeque<>(); // [price, span]\nint[] next(int price) {\n    int span = 1;\n    while (!st.isEmpty() && st.peek()[0] <= price)\n        span += st.pop()[1];\n    st.push(new int[]{price, span});\n    return new int[]{price, span};\n}`,
      },
      recursion: {
        hint: "Recursively compute span by checking previous days via recursive stack traversal",
        snippet: `int span(int[] prices, int i) {\n    if (i == 0) return 1;\n    int s = 1;\n    while (i - s >= 0 && prices[i - s] <= prices[i]) s += span(prices, i - s);\n    return s;\n}`,
      },
      stream: {
        hint: "Use IntStream to compute span for each index by counting consecutive non-greater prices",
        snippet: `int[] spans = IntStream.range(0, prices.length).map(i -> {\n    int s = 1;\n    while (i - s >= 0 && prices[i - s] <= prices[i]) s++;\n    return s;\n}).toArray();`,
      },
    },
    {
      id: 189,
      title: "Balanced parentheses — variations with multiple bracket types",
      tip: "Push open brackets; match each closing bracket against stack top; reject on mismatch",
      iteration: {
        hint: "Use a map of closing->opening to support {}, [], () in one loop",
        snippet: `Map<Character,Character> m = Map.of(')','(', ']','[', '}','{');\nDeque<Character> st = new ArrayDeque<>();\nfor (char c : s.toCharArray()) {\n    if (m.containsValue(c)) st.push(c);\n    else if (st.isEmpty() || st.pop() != m.get(c)) return false;\n}\nreturn st.isEmpty();`,
      },
      recursion: {
        hint: "Recurse on each character, threading the stack as state",
        snippet: `boolean valid(String s, int i, Deque<Character> st) {\n    if (i == s.length()) return st.isEmpty();\n    char c = s.charAt(i);\n    if (\"([{\".indexOf(c) >= 0) { st.push(c); return valid(s, i+1, st); }\n    if (st.isEmpty() || !matches(st.pop(), c)) return false;\n    return valid(s, i+1, st);\n}`,
      },
      stream: {
        hint: "Reduce character stream into stack; return empty-stack check at end",
        snippet: `Deque<Character> st = s.chars().mapToObj(c -> (char)c)\n    .reduce(new ArrayDeque<Character>(), (stack, c) -> {\n        if (\"([{\".indexOf(c) >= 0) stack.push(c);\n        else if (!stack.isEmpty() && matches(stack.peek(), c)) stack.pop();\n        return stack;\n    }, (a,b) -> a);\nreturn st.isEmpty();`,
      },
    },
    {
      id: 190,
      title: "Reverse a stack (without extra space, using recursion)",
      tip: "Recursively pop all elements; insert each at the bottom using a helper that recurses to bottom",
      iteration: {
        hint: "Can't reverse a stack iteratively without extra space; use recursion or a helper stack",
        snippet: `// With a helper stack (iterative workaround)\nDeque<Integer> tmp = new ArrayDeque<>();\nwhile (!stack.isEmpty()) tmp.push(stack.pop());\nwhile (!tmp.isEmpty()) stack.push(tmp.pop());`,
      },
      recursion: {
        hint: "Pop top, recurse to reverse rest, then insert popped element at bottom",
        snippet: `void reverse(Deque<Integer> st) {\n    if (st.isEmpty()) return;\n    int top = st.pop();\n    reverse(st);\n    insertAtBottom(st, top);\n}\nvoid insertAtBottom(Deque<Integer> st, int x) {\n    if (st.isEmpty()) { st.push(x); return; }\n    int top = st.pop(); insertAtBottom(st, x); st.push(top);\n}`,
      },
      stream: {
        hint: "Collect stack to list, reverse, then push back — functional one-liner",
        snippet: `List<Integer> list = new ArrayList<>(stack);\nCollections.reverse(list);\nstack.clear();\nlist.forEach(stack::push);`,
      },
    },
    {
      id: 191,
      title: "Sort a stack (using recursion or another stack)",
      tip: "Recursively pop all, sort recursively, insert each back in sorted position",
      iteration: {
        hint: "Use a temp sorted stack; insert each popped element in correct sorted position",
        snippet: `Deque<Integer> sorted = new ArrayDeque<>();\nwhile (!st.isEmpty()) {\n    int tmp = st.pop();\n    while (!sorted.isEmpty() && sorted.peek() > tmp)\n        st.push(sorted.pop());\n    sorted.push(tmp);\n}\nreturn sorted;`,
      },
      recursion: {
        hint: "Pop one element, recursively sort the rest, then insert it in sorted position",
        snippet: `void sortStack(Deque<Integer> st) {\n    if (st.isEmpty()) return;\n    int top = st.pop();\n    sortStack(st);\n    sortedInsert(st, top);\n}\nvoid sortedInsert(Deque<Integer> st, int x) {\n    if (st.isEmpty() || st.peek() <= x) { st.push(x); return; }\n    int top = st.pop(); sortedInsert(st, x); st.push(top);\n}`,
      },
      stream: {
        hint: "Collect to list, sort, push back in order for a sorted stack",
        snippet: `List<Integer> sorted = new ArrayList<>(st);\nCollections.sort(sorted); // ascending at bottom\nst.clear();\nsorted.forEach(st::push); // largest ends up on top`,
      },
    },
    {
      id: 192,
      title: "Celebrity problem",
      tip: "Use two-pointer on stack: push all, pop two, eliminate non-celebrity, verify the last candidate",
      iteration: {
        hint: "Push all to stack; pop two, eliminate the one who knows the other; validate survivor",
        snippet: `Deque<Integer> st = new ArrayDeque<>();\nfor (int i = 0; i < n; i++) st.push(i);\nwhile (st.size() > 1) {\n    int a = st.pop(), b = st.pop();\n    if (knows(a, b)) st.push(b); else st.push(a);\n}\nint c = st.pop();\nfor (int i = 0; i < n; i++)\n    if (i != c && (knows(c,i) || !knows(i,c))) return -1;\nreturn c;`,
      },
      recursion: {
        hint: "Recursively eliminate non-celebrities until one candidate remains",
        snippet: `int findCandidate(int[] people, int n) {\n    if (n == 1) return people[0];\n    int cand = findCandidate(people, n - 1);\n    return knows(cand, people[n-1]) ? people[n-1] : cand;\n}`,
      },
      stream: {
        hint: "Use IntStream.reduce to fold over candidates and eliminate non-celebrities",
        snippet: `int candidate = IntStream.range(1, n)\n    .reduce(0, (c, i) -> knows(c, i) ? i : c);\nboolean isCeleb = IntStream.range(0, n)\n    .allMatch(i -> i == candidate || (!knows(candidate,i) && knows(i,candidate)));\nreturn isCeleb ? candidate : -1;`,
      },
    },
    {
      id: 193,
      title: "Rotten oranges (BFS with queue)",
      tip: "Multi-source BFS from all initially rotten oranges; count minutes until no fresh orange reachable",
      iteration: {
        hint: "Enqueue all rotten cells at t=0; BFS layer by layer, tracking minutes elapsed",
        snippet: `Queue<int[]> q = new LinkedList<>();\nint fresh = 0;\nfor (int i=0;i<R;i++) for (int j=0;j<C;j++)\n    { if (grid[i][j]==2) q.offer(new int[]{i,j}); if (grid[i][j]==1) fresh++; }\nint mins = 0;\nint[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}};\nwhile (!q.isEmpty() && fresh > 0) {\n    for (int s=q.size();s-->0;) { int[] c=q.poll();\n        for (int[] d:dirs) { int r=c[0]+d[0],col=c[1]+d[1];\n            if (r>=0&&r<R&&col>=0&&col<C&&grid[r][col]==1)\n                { grid[r][col]=2; fresh--; q.offer(new int[]{r,col}); } } }\n    mins++;\n}\nreturn fresh==0?mins:-1;`,
      },
      recursion: {
        hint: "DFS can simulate but multi-source BFS is the canonical approach; use DFS for single-source simulation",
        snippet: `// DFS from one rotten orange (not multi-source optimal)\nvoid dfs(int[][] g, int r, int c, int t, int[][] time) {\n    if (r<0||r>=g.length||c<0||c>=g[0].length||g[r][c]==0) return;\n    if (g[r][c]==1 || (g[r][c]==2 && t<time[r][c])) {\n        time[r][c]=t; dfs(g,r+1,c,t+1,time); dfs(g,r-1,c,t+1,time);\n        dfs(g,r,c+1,t+1,time); dfs(g,r,c-1,t+1,time);\n    }\n}`,
      },
      stream: {
        hint: "Use streams to collect initial rotten positions; BFS itself is imperative",
        snippet: `List<int[]> rotten = IntStream.range(0, R)\n    .boxed()\n    .flatMap(i -> IntStream.range(0, C)\n        .filter(j -> grid[i][j] == 2)\n        .mapToObj(j -> new int[]{i, j}))\n    .collect(Collectors.toList());\nQueue<int[]> q = new LinkedList<>(rotten);`,
      },
    },
    {
      id: 194,
      title: "First negative number in every window of size K",
      tip: "Use a deque to store indices of negative numbers; front is always the first negative in current window",
      iteration: {
        hint: "Deque holds indices of negatives; pop front when outside window, append each negative",
        snippet: `int[] res = new int[arr.length - k + 1];\nDeque<Integer> dq = new ArrayDeque<>();\nfor (int i = 0; i < arr.length; i++) {\n    if (arr[i] < 0) dq.offer(i);\n    if (i >= k - 1) {\n        if (!dq.isEmpty() && dq.peek() <= i - k) dq.poll();\n        res[i - k + 1] = dq.isEmpty() ? 0 : arr[dq.peek()];\n    }\n}\nreturn res;`,
      },
      recursion: {
        hint: "Recurse over windows; find first negative in each window via recursive scan",
        snippet: `int firstNeg(int[] a, int start, int end) {\n    if (start > end) return 0;\n    if (a[start] < 0) return a[start];\n    return firstNeg(a, start + 1, end);\n}\n// Call for each window:\nfor (int i=0;i<=arr.length-k;i++) res[i]=firstNeg(arr,i,i+k-1);`,
      },
      stream: {
        hint: "Slide window using IntStream; find first negative using stream filter in each window",
        snippet: `int[] res = IntStream.rangeClosed(0, arr.length - k)\n    .map(i -> IntStream.range(i, i + k)\n        .map(j -> arr[j])\n        .filter(v -> v < 0)\n        .findFirst().orElse(0))\n    .toArray();`,
      },
    },
    {
      id: 195,
      title: "Implement a blocking queue (producer-consumer style)",
      tip: "Use LinkedBlockingQueue or ArrayBlockingQueue; put() blocks when full, take() blocks when empty",
      iteration: {
        hint: "ArrayBlockingQueue is bounded and thread-safe; put/take handle blocking automatically",
        snippet: `BlockingQueue<Integer> bq = new ArrayBlockingQueue<>(10);\n// Producer:\nnew Thread(() -> { try { bq.put(item); } catch(InterruptedException e) {} }).start();\n// Consumer:\nnew Thread(() -> { try { int v = bq.take(); } catch(InterruptedException e) {} }).start();`,
      },
      recursion: {
        hint: "Recursion not applicable to blocking queues; use iterative producer/consumer loops",
        snippet: `// Producer loop (iterative, as is standard)\nvoid produce(BlockingQueue<Integer> q, int[] items) throws InterruptedException {\n    for (int item : items) q.put(item);\n}`,
      },
      stream: {
        hint: "Stream items into blocking queue from producer side",
        snippet: `// Offer items from a stream (non-blocking version)\nIntStream.rangeClosed(1, 100)\n    .forEach(i -> bq.offer(i));\n// Drain with stream\nList<Integer> consumed = new ArrayList<>();\nbq.drainTo(consumed);`,
      },
    },
    {
      id: 196,
      title: "Task scheduler (with cooldown, using a priority queue/heap)",
      tip: "Greedy: always schedule the highest-frequency task; cool down using a counter map and cycle of n+1 slots",
      iteration: {
        hint: "Use max-heap by frequency; each cycle of (n+1) tasks, pick top available tasks",
        snippet: `int[] freq = new int[26];\nfor (char c : tasks) freq[c-'A']++;\nPriorityQueue<Integer> pq = new PriorityQueue<>(Collections.reverseOrder());\nfor (int f : freq) if (f > 0) pq.offer(f);\nint time = 0;\nwhile (!pq.isEmpty()) {\n    List<Integer> tmp = new ArrayList<>();\n    for (int i=0;i<=n;i++) { if (!pq.isEmpty()) tmp.add(pq.poll()-1); }\n    for (int f : tmp) if (f > 0) pq.offer(f);\n    time += pq.isEmpty() ? tmp.size() : n+1;\n}\nreturn time;`,
      },
      recursion: {
        hint: "Recursion not typical; math formula gives O(1) solution",
        snippet: `// Math formula approach (O(1))\nint[] freq = new int[26];\nfor (char c : tasks) freq[c-'A']++;\nArrays.sort(freq);\nint maxFreq = freq[25], maxCount = 0;\nfor (int f : freq) if (f == maxFreq) maxCount++;\nreturn Math.max(tasks.length, (maxFreq-1)*(n+1)+maxCount);`,
      },
      stream: {
        hint: "Count frequencies with streams; priority queue logic stays iterative",
        snippet: `Map<Character,Long> freq = tasks.stream().collect(\n    Collectors.groupingBy(c -> c, Collectors.counting()));\nPriorityQueue<Long> pq = new PriorityQueue<>(Collections.reverseOrder());\npq.addAll(freq.values());`,
      },
    },
    {
      id: 197,
      title: "Print binary numbers from 1 to N using a queue",
      tip: "Enqueue '1'; for each dequeued string, print it and enqueue string+'0' and string+'1'",
      iteration: {
        hint: "BFS-style: dequeue, print, enqueue children (+'0' and +'1') until N numbers printed",
        snippet: `Queue<String> q = new LinkedList<>();\nq.offer(\"1\");\nfor (int i = 0; i < n; i++) {\n    String s = q.poll();\n    System.out.println(s);\n    q.offer(s + \"0\");\n    q.offer(s + \"1\");\n}`,
      },
      recursion: {
        hint: "Recursively build binary strings with prefix; print when desired length reached",
        snippet: `void generate(String prefix, int count, int[] printed) {\n    if (printed[0] > count) return;\n    System.out.println(prefix);\n    printed[0]++;\n    generate(prefix + \"0\", count, printed);\n    generate(prefix + \"1\", count, printed);\n}`,
      },
      stream: {
        hint: "Use IntStream and Integer.toBinaryString to generate binary representations",
        snippet: `IntStream.rangeClosed(1, n)\n    .mapToObj(Integer::toBinaryString)\n    .forEach(System.out::println);`,
      },
    },
    {
      id: 198,
      title: "Queue reconstruction by height",
      tip: "Sort by height descending, then by k ascending; insert each person at index k in result list",
      iteration: {
        hint: "Sort: taller first, same height by k ascending; insert at index k — shorter people don't affect taller",
        snippet: `Arrays.sort(people, (a,b) -> a[0]!=b[0] ? b[0]-a[0] : a[1]-b[1]);\nList<int[]> res = new LinkedList<>();\nfor (int[] p : people) res.add(p[1], p);\nreturn res.toArray(new int[0][]);`,
      },
      recursion: {
        hint: "Sort first, then recursively build result by inserting at correct position",
        snippet: `void build(List<int[]> sorted, LinkedList<int[]> res, int i) {\n    if (i == sorted.size()) return;\n    int[] p = sorted.get(i);\n    res.add(p[1], p);\n    build(sorted, res, i + 1);\n}`,
      },
      stream: {
        hint: "Sort with stream, collect to list, then insert using list operations",
        snippet: `List<int[]> sorted = Arrays.stream(people)\n    .sorted((a,b) -> a[0]!=b[0] ? b[0]-a[0] : a[1]-b[1])\n    .collect(Collectors.toList());\nLinkedList<int[]> result = new LinkedList<>();\nsorted.forEach(p -> result.add(p[1], p));`,
      },
    },
    {
      id: 199,
      title: "Implement K queues in a single array",
      tip: "Use a free-list with next[] array to track available slots; front[] and rear[] per queue",
      iteration: {
        hint: "Arrays: arr[n] for data, next[n] for chaining free/used slots, front[k] and rear[k] per queue",
        snippet: `int[] arr=new int[n], next=new int[n], front=new int[k], rear=new int[k];\nint free=0;\nArrays.fill(front,-1); Arrays.fill(rear,-1);\nfor(int i=0;i<n-1;i++) next[i]=i+1; next[n-1]=-1;\nvoid enqueue(int x, int qn) {\n    int i=free; free=next[i]; arr[i]=x;\n    if(front[qn]==-1) front[qn]=i;\n    else next[rear[qn]]=i;\n    rear[qn]=i; next[i]=-1;\n}`,
      },
      recursion: {
        hint: "Recursion not natural here; use iterative free-list management",
        snippet: `// Drain queue qn recursively\nvoid drainQueue(int qn, int node) {\n    if (node == -1) return;\n    System.out.print(arr[node] + \" \");\n    drainQueue(qn, next[node]);\n}`,
      },
      stream: {
        hint: "Use streams to collect elements of a given queue by traversing chain of next pointers",
        snippet: `// Stream elements of queue qn (via iteration)\nList<Integer> elems = new ArrayList<>();\nint node = front[qn];\nwhile (node != -1) { elems.add(arr[node]); node = next[node]; }\nStream<Integer> qStream = elems.stream();`,
      },
    },
    {
      id: 200,
      title: "Check stack permutations of a queue",
      tip: "Simulate push/pop from queue through stack; check if target permutation is achievable",
      iteration: {
        hint: "Push from queue; when stack top matches next expected output, pop; check all match",
        snippet: `Deque<Integer> st = new ArrayDeque<>();\nint j = 0;\nfor (int x : queue) {\n    st.push(x);\n    while (!st.isEmpty() && st.peek() == target[j]) { st.pop(); j++; }\n}\nreturn st.isEmpty();`,
      },
      recursion: {
        hint: "Recursively push from queue and pop when top matches target",
        snippet: `boolean check(int[] q, int qi, int[] t, int ti, Deque<Integer> st) {\n    if (ti == t.length) return true;\n    if (!st.isEmpty() && st.peek() == t[ti])\n        { st.pop(); return check(q, qi, t, ti+1, st); }\n    if (qi == q.length) return false;\n    st.push(q[qi]);\n    return check(q, qi+1, t, ti, st);\n}`,
      },
      stream: {
        hint: "Use stream to iterate queue elements; stack simulation itself is stateful/imperative",
        snippet: `// Stream-based queue traversal feeding the stack check\nDeque<Integer> st = new ArrayDeque<>();\nint[] j = {0};\nArrays.stream(queue).forEach(x -> {\n    st.push(x);\n    while (!st.isEmpty() && st.peek() == target[j[0]]) { st.pop(); j[0]++; }\n});\nreturn st.isEmpty();`,
      },
    },
    {
      id: 201,
      title: "Implement a max stack (O(1) getMax)",
      tip: "Mirror the min-stack pattern: maintain a parallel max-stack tracking max at each level",
      iteration: {
        hint: "Push to maxStack only when value >= current max; pop in sync",
        snippet: `Deque<Integer> st = new ArrayDeque<>(), maxSt = new ArrayDeque<>();\nvoid push(int x) {\n    st.push(x);\n    if (maxSt.isEmpty() || x >= maxSt.peek()) maxSt.push(x);\n}\nvoid pop() { if (st.pop().equals(maxSt.peek())) maxSt.pop(); }\nint getMax() { return maxSt.peek(); }`,
      },
      recursion: {
        hint: "Recursively rebuild max stack after series of pops/pushes",
        snippet: `int maxAfterPop(Deque<Integer> st, Deque<Integer> mx) {\n    if (st.isEmpty()) return Integer.MIN_VALUE;\n    int top = st.pop();\n    if (!mx.isEmpty() && top == mx.peek()) mx.pop();\n    int res = mx.isEmpty() ? Integer.MIN_VALUE : mx.peek();\n    st.push(top);\n    if (mx.isEmpty() || top >= mx.peek()) mx.push(top);\n    return res;\n}`,
      },
      stream: {
        hint: "Use stream to compute max without O(1) guarantee; use parallel stack for O(1)",
        snippet: `Deque<Integer> stack = new ArrayDeque<>(List.of(3,1,4,1,5));\nint max = stack.stream()\n    .mapToInt(Integer::intValue)\n    .max().orElseThrow();`,
      },
    },
    {
      id: 202,
      title:
        "Design a stack that supports increment operations on the bottom K elements",
      tip: "Use lazy increment: store increments in an inc[] array; propagate only on pop",
      iteration: {
        hint: "inc[i] stores pending increment for elements 0..i; on pop, propagate inc[i] to inc[i-1]",
        snippet: `int[] stack = new int[maxSize], inc = new int[maxSize];\nint top = -1;\nvoid push(int x) { stack[++top] = x; }\nvoid increment(int k, int val) { if (top>=0) inc[Math.min(k-1,top)] += val; }\nint pop() {\n    int val = stack[top] + inc[top];\n    if (top > 0) inc[top-1] += inc[top];\n    inc[top--] = 0;\n    return val;\n}`,
      },
      recursion: {
        hint: "Recursion not natural here; lazy-propagation is the key O(1) insight",
        snippet: `// Recursive drain demonstrating propagated increments\nvoid drain(int[] st, int[] inc, int top, List<Integer> out) {\n    if (top < 0) return;\n    out.add(st[top] + inc[top]);\n    if (top > 0) inc[top-1] += inc[top];\n    inc[top] = 0;\n    drain(st, inc, top - 1, out);\n}`,
      },
      stream: {
        hint: "Stream to collect current values with lazy increments applied",
        snippet: `// Snapshot current stack values with increments\nList<Integer> snapshot = IntStream.rangeClosed(0, top)\n    .map(i -> stack[i] + (i < top ? 0 : inc[i]))\n    .boxed()\n    .collect(Collectors.toList());`,
      },
    },
    {
      id: 203,
      title: "Simplify a Unix-style file path using a stack",
      tip: "Split path by '/'; push valid names, pop on '..', skip '.' and empty parts; rejoin with '/'",
      iteration: {
        hint: "Tokenize by '/'; use deque as stack; '..' pops, '.' and '' are ignored",
        snippet: `Deque<String> st = new ArrayDeque<>();\nfor (String part : path.split(\"/\")) {\n    if (part.equals(\"..\")) { if (!st.isEmpty()) st.pop(); }\n    else if (!part.isEmpty() && !part.equals(\".\")) st.push(part);\n}\nStringBuilder sb = new StringBuilder();\nfor (String s : st) sb.insert(0, \"/\" + s);\nreturn sb.length() == 0 ? \"/\" : sb.toString();`,
      },
      recursion: {
        hint: "Recursively process tokens and build path bottom-up",
        snippet: `String simplify(String[] parts, int i, Deque<String> st) {\n    if (i == parts.length) {\n        String res = String.join(\"/\", st);\n        return res.isEmpty() ? \"/\" : \"/\" + res;\n    }\n    if (parts[i].equals(\"..\")) { if (!st.isEmpty()) st.pollLast(); }\n    else if (!parts[i].isEmpty() && !parts[i].equals(\".\")) st.addLast(parts[i]);\n    return simplify(parts, i + 1, st);\n}`,
      },
      stream: {
        hint: "Use stream to filter and reduce path parts into simplified path",
        snippet: `Deque<String> st = Arrays.stream(path.split(\"/\"))\n    .reduce(new ArrayDeque<String>(), (stack, p) -> {\n        if (p.equals(\"..\")) { if (!stack.isEmpty()) stack.pop(); }\n        else if (!p.isEmpty() && !p.equals(\".\")) stack.push(p);\n        return stack;\n    }, (a,b) -> a);\nreturn st.isEmpty() ? \"/\" : \"/\" + String.join(\"/\", new ArrayList<>(st));`,
      },
    },
    {
      id: 204,
      title:
        "Implement an expression evaluator (infix to postfix, then evaluate)",
      tip: "Two-pass: convert infix to postfix using operator-precedence stack, then evaluate postfix",
      iteration: {
        hint: "Shunting-yard for infix->postfix; then evaluate postfix with operand stack",
        snippet: `// Shunting-yard: infix -> postfix\nDeque<Character> ops = new ArrayDeque<>();\nStringBuilder postfix = new StringBuilder();\nfor (char c : infix.toCharArray()) {\n    if (Character.isDigit(c)) postfix.append(c);\n    else if (c=='(') ops.push(c);\n    else if (c==')') { while(ops.peek()!='(') postfix.append(ops.pop()); ops.pop(); }\n    else { while (!ops.isEmpty()&&prec(ops.peek())>=prec(c)) postfix.append(ops.pop()); ops.push(c); }\n}\nwhile (!ops.isEmpty()) postfix.append(ops.pop());`,
      },
      recursion: {
        hint: "Recursive descent parser evaluates infix directly without postfix conversion",
        snippet: `int parseExpr(String s, int[] i) {\n    int val = parseTerm(s, i);\n    while (i[0] < s.length() && (s.charAt(i[0])=='+'||s.charAt(i[0])=='-')) {\n        char op = s.charAt(i[0]++); int t = parseTerm(s, i);\n        val = op=='+' ? val+t : val-t;\n    }\n    return val;\n}`,
      },
      stream: {
        hint: "Use streams to tokenize expression; evaluation still requires stack logic",
        snippet: `// Tokenize infix expression with streams\nList<String> tokens = Pattern.compile(\"(\\\\d+|[+\\\\-*/()])\").matcher(expr).results()\n    .map(MatchResult::group)\n    .collect(Collectors.toList());`,
      },
    },
    {
      id: 205,
      title: "Find the maximum of all subarrays of size K using two stacks",
      tip: "Two-stack queue: one for enqueue (back), one for dequeue (front); each tracks its running max",
      iteration: {
        hint: "Maintain two stacks, each with (value, max) pairs; front max is max of both stack maxes",
        snippet: `Deque<int[]> front = new ArrayDeque<>(), back = new ArrayDeque<>();\nvoid enqueue(int x) {\n    int m = back.isEmpty() ? x : Math.max(x, back.peek()[1]);\n    back.push(new int[]{x, m});\n}\nint dequeue() {\n    if (front.isEmpty())\n        while (!back.isEmpty()) { int[] b=back.pop(); int m=front.isEmpty()?b[0]:Math.max(b[0],front.peek()[1]); front.push(new int[]{b[0],m}); }\n    return front.pop()[0];\n}\nint getMax() { int a=front.isEmpty()?Integer.MIN_VALUE:front.peek()[1]; int b=back.isEmpty()?Integer.MIN_VALUE:back.peek()[1]; return Math.max(a,b); }`,
      },
      recursion: {
        hint: "Deque-based sliding window is preferred; recursion can iterate windows",
        snippet: `// Recursive window maximum\nint[] result(int[] a, int k, int i, int[] res) {\n    if (i > a.length - k) return res;\n    res[i] = Arrays.stream(a, i, i+k).max().orElse(0);\n    return result(a, k, i+1, res);\n}`,
      },
      stream: {
        hint: "Stream each window and compute max; O(nk) but concise for small k",
        snippet: `int[] res = IntStream.rangeClosed(0, arr.length - k)\n    .map(i -> IntStream.range(i, i+k)\n        .map(j -> arr[j]).max().orElse(0))\n    .toArray();`,
      },
    },
    {
      id: 206,
      title: "Implement a browser's forward/back navigation using two stacks",
      tip: "Back stack holds history; forward stack holds pages navigated away from; visit clears forward stack",
      iteration: {
        hint: "visit(): push to back, clear forward; back(): push current to forward, pop from back; forward: reverse",
        snippet: `Deque<String> back = new ArrayDeque<>(), fwd = new ArrayDeque<>();\nString current;\nvoid visit(String url) { back.push(current); current=url; fwd.clear(); }\nvoid goBack() { if (!back.isEmpty()) { fwd.push(current); current=back.pop(); } }\nvoid goFwd() { if (!fwd.isEmpty()) { back.push(current); current=fwd.pop(); } }`,
      },
      recursion: {
        hint: "Recursion not applicable to stateful navigation; use iterative approach",
        snippet: `// Recursively print history (back stack) without modifying\nvoid printHistory(Deque<String> back) {\n    if (back.isEmpty()) return;\n    String page = back.pop();\n    printHistory(back);\n    System.out.println(page);\n    back.push(page);\n}`,
      },
      stream: {
        hint: "Use stream to display history; navigation logic stays with the two stacks",
        snippet: `// Print back history (most recent first)\nback.stream().forEach(System.out::println);\n// Print forward history\nfwd.stream().forEach(System.out::println);`,
      },
    },
    {
      id: 207,
      title: "Check if a queue can be sorted using an auxiliary stack",
      tip: "Simulate: dequeue from queue; push to stack only if it maintains sorted order; else check queue",
      iteration: {
        hint: "Expected next = 1; pop from queue, push to stack if > stack top; pop from stack to output when equal to expected",
        snippet: `int expected = 1;\nDeque<Integer> st = new ArrayDeque<>();\nwhile (!q.isEmpty() || !st.isEmpty()) {\n    while (!st.isEmpty() && st.peek() == expected) { st.pop(); expected++; }\n    if (q.isEmpty()) break;\n    int x = q.poll();\n    if (!st.isEmpty() && x > st.peek()) return false;\n    st.push(x);\n}\nreturn expected == n + 1;`,
      },
      recursion: {
        hint: "Recursively process queue elements and check sortability via stack",
        snippet: `boolean canSort(Queue<Integer> q, Deque<Integer> st, int expected, int n) {\n    while (!st.isEmpty() && st.peek()==expected) { st.pop(); expected++; }\n    if (expected == n+1) return true;\n    if (q.isEmpty()) return false;\n    int x = q.poll();\n    if (!st.isEmpty() && x > st.peek()) return false;\n    st.push(x);\n    return canSort(q, st, expected, n);\n}`,
      },
      stream: {
        hint: "Collect queue to list, then simulate sorting check iteratively using stream-based setup",
        snippet: `List<Integer> elements = new ArrayList<>(queue);\nDeque<Integer> st = new ArrayDeque<>();\nint[] expected = {1};\nboolean sortable = elements.stream().allMatch(x -> {\n    while (!st.isEmpty() && st.peek() == expected[0]) { st.pop(); expected[0]++; }\n    if (!st.isEmpty() && x > st.peek()) return false;\n    st.push(x); return true;\n});`,
      },
    },
    {
      id: 208,
      title: "Asteroid collision problem (stack-based simulation)",
      tip: "Push positive asteroids; negative asteroids destroy smaller positives on stack top; equal-size both die",
      iteration: {
        hint: "Positive goes on stack; negative destroys top positive until stack top >= |negative| or stack empty",
        snippet: `Deque<Integer> st = new ArrayDeque<>();\nfor (int a : asteroids) {\n    boolean alive = true;\n    while (alive && a < 0 && !st.isEmpty() && st.peek() > 0) {\n        if (st.peek() < -a) st.pop();\n        else if (st.peek() == -a) { st.pop(); alive=false; }\n        else alive = false;\n    }\n    if (alive) st.push(a);\n}\nreturn st.stream().mapToInt(i->i).toArray();`,
      },
      recursion: {
        hint: "Recursively process each asteroid, maintaining stack state as parameter",
        snippet: `void collide(int[] a, int i, Deque<Integer> st) {\n    if (i == a.length) return;\n    int x = a[i]; boolean alive = true;\n    while (alive && x < 0 && !st.isEmpty() && st.peek() > 0)\n        { if (st.peek() < -x) st.pop(); else { if(st.peek()==-x) st.pop(); alive=false; } }\n    if (alive) st.push(x);\n    collide(a, i+1, st);\n}`,
      },
      stream: {
        hint: "Reduce asteroid array into stack using functional fold; result is stack contents",
        snippet: `Deque<Integer> st = Arrays.stream(asteroids).boxed()\n    .reduce(new ArrayDeque<Integer>(), (stack, a) -> {\n        // apply collision logic and return updated stack\n        boolean alive = true;\n        while (alive && a < 0 && !stack.isEmpty() && stack.peek() > 0)\n            { if(stack.peek() < -a) stack.pop(); else { if(stack.peek()==-a) stack.pop(); alive=false; } }\n        if (alive) stack.push(a);\n        return stack;\n    }, (x,y) -> x);`,
      },
    },
    {
      id: 209,
      title:
        "Remove K digits to form the smallest possible number (monotonic stack)",
      tip: "Monotonic increasing stack; pop larger digits when smaller digit arrives and k > 0; trim trailing",
      iteration: {
        hint: "Pop stack top when it's larger than current digit and k > 0; handle leading zeros",
        snippet: `Deque<Character> st = new ArrayDeque<>();\nint k = K;\nfor (char c : num.toCharArray()) {\n    while (k > 0 && !st.isEmpty() && st.peek() > c) { st.pop(); k--; }\n    st.push(c);\n}\nwhile (k-- > 0) st.pop();\nStringBuilder sb = new StringBuilder();\nboolean lead = true;\nfor (char c : st) { if (lead && c=='0') continue; lead=false; sb.append(c); }\nreturn sb.length()==0?\"0\":sb.toString();`,
      },
      recursion: {
        hint: "Recursively process digits maintaining stack state and k counter",
        snippet: `void solve(char[] num, int i, int k, Deque<Character> st) {\n    if (i == num.length) { while (k-- > 0 && !st.isEmpty()) st.pop(); return; }\n    while (k > 0 && !st.isEmpty() && st.peek() > num[i]) { st.pop(); k--; }\n    st.push(num[i]);\n    solve(num, i+1, k, st);\n}`,
      },
      stream: {
        hint: "Use chars() stream to iterate digits; stack logic remains imperative",
        snippet: `Deque<Character> st = new ArrayDeque<>();\nint[] rem = {k};\nnum.chars().mapToObj(c -> (char)c).forEach(c -> {\n    while (rem[0] > 0 && !st.isEmpty() && st.peek() > c) { st.pop(); rem[0]--; }\n    st.push(c);\n});`,
      },
    },
    {
      id: 210,
      title: "Implement a circular buffer/ring buffer",
      tip: "Fixed-size array with read/write pointers; wrap using modulo; full when (write+1)%size==read",
      iteration: {
        hint: "read and write pointers wrap with % capacity; one slot kept empty to distinguish full vs empty",
        snippet: `int[] buf = new int[capacity + 1];\nint read = 0, write = 0, cap = capacity + 1;\nboolean isFull() { return (write + 1) % cap == read; }\nboolean isEmpty() { return write == read; }\nvoid put(int x) { if (!isFull()) { buf[write] = x; write = (write+1)%cap; } }\nint get() { if (!isEmpty()) { int v=buf[read]; read=(read+1)%cap; return v; } return -1; }`,
      },
      recursion: {
        hint: "Drain circular buffer recursively by advancing read pointer",
        snippet: `void drain(int[] buf, int read, int write, int cap, List<Integer> out) {\n    if (read == write) return;\n    out.add(buf[read]);\n    drain(buf, (read+1)%cap, write, cap, out);\n}`,
      },
      stream: {
        hint: "Stream elements of ring buffer in order using IntStream over wrapped indices",
        snippet: `int size = (write - read + cap) % cap;\nList<Integer> elems = IntStream.range(0, size)\n    .map(i -> buf[(read + i) % cap])\n    .boxed()\n    .collect(Collectors.toList());`,
      },
    },
  ],
};
