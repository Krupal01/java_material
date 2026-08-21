window.CT_LINKEDLIST = {
  topic: "Linked List",
  icon: "🔗",
  range: "131–170",
  questions: [
    {
      id: 131,
      title: "Reverse a linked list",
      problem:
        "Given the head of a singly linked list, reverse the list and return the new head.",
      examples: [
        { input: "head = [1,2,3,4]", output: "[4,3,2,1]" },
        { input: "head = [1]", output: "[1]" },
      ],
      tip: "Three-pointer technique: prev=null, curr=head, next; reverse links iteratively",
      iteration: {
        hint: "Walk with prev/curr/next pointers, flip each node's next pointer",
        snippet: `ListNode prev = null, curr = head;
while (curr != null) {
    ListNode next = curr.next;
    curr.next = prev;
    prev = curr; curr = next;
}
return prev;`,
      },
      recursion: {
        hint: "Recurse to tail, then wire back: newHead = reverse(head.next); head.next.next = head; head.next = null",
        snippet: `ListNode reverse(ListNode head) {
    if (head == null || head.next == null) return head;
    ListNode newHead = reverse(head.next);
    head.next.next = head; head.next = null;
    return newHead;
}`,
      },
      stream: {
        hint: "Collect node values to a list, reverse, rebuild a new linked list",
        snippet: `List<Integer> vals = new ArrayList<>();
for (ListNode n = head; n != null; n = n.next) vals.add(n.val);
Collections.reverse(vals);
// then rebuild nodes from vals`,
      },
    },
    {
      id: 132,
      title: "Detect a cycle",
      problem:
        "Given the head of a linked list, return true if the list contains a cycle; otherwise return false.",
      examples: [
        { input: "head = [3,2,0,-4], pos = 1", output: "true" },
        { input: "head = [1,2], pos = -1", output: "false" },
      ],
      tip: "Floyd's cycle detection: slow moves 1 step, fast moves 2; they meet iff a cycle exists",
      iteration: {
        hint: "Use slow and fast pointers; if they ever point to the same node, a cycle exists",
        snippet: `ListNode slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow == fast) return true;
}
return false;`,
      },
      recursion: {
        hint: "Pass a HashSet through recursion; return true when a node is visited twice",
        snippet: `boolean hasCycle(ListNode node, Set<ListNode> seen) {
    if (node == null) return false;
    if (seen.contains(node)) return true;
    seen.add(node);
    return hasCycle(node.next, seen);
}`,
      },
      stream: {
        hint: "Insert nodes into a LinkedHashSet; add() returns false the moment a duplicate is encountered",
        snippet: `Set<ListNode> seen = new LinkedHashSet<>();
for (ListNode n = head; n != null; n = n.next)
    if (!seen.add(n)) return true;
return false;`,
      },
    },
    {
      id: 133,
      title: "Find intersection of two linked lists",
      problem:
        "Given heads of two singly linked lists, return the node where they intersect by reference, or null if they do not intersect.",
      examples: [
        {
          input: "A = [4,1,8,4,5], B = [5,6,1,8,4,5], intersect = 8",
          output: "node with value 8",
        },
        { input: "A = [2,6,4], B = [1,5], intersect = none", output: "null" },
      ],
      tip: "Two-pointer swap: redirect each pointer to the other head on reaching null; they meet at intersection",
      iteration: {
        hint: "pA and pB advance together; when one hits null it switches to the other head, equalizing total path",
        snippet: `ListNode pA = headA, pB = headB;
while (pA != pB) {
    pA = (pA == null) ? headB : pA.next;
    pB = (pB == null) ? headA : pB.next;
}
return pA;`,
      },
      recursion: {
        hint: "Compute both lengths, advance the longer list by the difference, then walk both until equal",
        snippet: `int lenA = length(headA), lenB = length(headB);
while (lenA > lenB) { headA = headA.next; lenA--; }
while (lenB > lenA) { headB = headB.next; lenB--; }
while (headA != headB) { headA = headA.next; headB = headB.next; }
return headA;`,
      },
      stream: {
        hint: "Stream all nodes of list A into a HashSet, then scan list B for the first node present in the set",
        snippet: `Set<ListNode> nodesA = new HashSet<>();
for (ListNode n = headA; n != null; n = n.next) nodesA.add(n);
for (ListNode n = headB; n != null; n = n.next)
    if (nodesA.contains(n)) return n;
return null;`,
      },
    },
    {
      id: 134,
      title: "Remove Nth node from end",
      problem:
        "Given the head of a linked list and integer n, remove the nth node from the end and return the head.",
      examples: [
        { input: "head = [1,2,3,4,5], n = 2", output: "[1,2,3,5]" },
        { input: "head = [1], n = 1", output: "[]" },
      ],
      tip: "Two-pointer gap trick: advance fast N+1 steps ahead, then move both until fast is null",
      iteration: {
        hint: "Dummy head prevents edge cases; fast is N+1 ahead so slow lands just before the target node",
        snippet: `ListNode dummy = new ListNode(0); dummy.next = head;
ListNode fast = dummy, slow = dummy;
for (int i = 0; i <= n; i++) fast = fast.next;
while (fast != null) { fast = fast.next; slow = slow.next; }
slow.next = slow.next.next;
return dummy.next;`,
      },
      recursion: {
        hint: "Recurse to the end, count back up; when position equals n, skip that node",
        snippet: `ListNode removeNth(ListNode head, int n, int[] pos) {
    if (head == null) return null;
    head.next = removeNth(head.next, n, pos);
    pos[0]++;
    return pos[0] == n ? head.next : head;
}`,
      },
      stream: {
        hint: "Collect all nodes to a list, remove the element at index (size-n), rebuild the chain",
        snippet: `List<ListNode> nodes = new ArrayList<>();
for (ListNode cur = head; cur != null; cur = cur.next) nodes.add(cur);
nodes.remove(nodes.size() - n);
// relink: for i in range set nodes[i].next = nodes[i+1]`,
      },
    },
    {
      id: 135,
      title: "Merge two sorted lists",
      problem:
        "Given two sorted linked lists, merge them into one sorted linked list and return its head.",
      examples: [
        { input: "l1 = [1,2,4], l2 = [1,3,4]", output: "[1,1,2,3,4,4]" },
        { input: "l1 = [], l2 = [0]", output: "[0]" },
      ],
      tip: "Dummy head simplifies edge cases; compare current heads, link the smaller, advance its pointer",
      iteration: {
        hint: "Use a dummy node as the result head; always attach the smaller of the two current nodes",
        snippet: `ListNode dummy = new ListNode(0), cur = dummy;
while (l1 != null && l2 != null) {
    if (l1.val <= l2.val) { cur.next = l1; l1 = l1.next; }
    else { cur.next = l2; l2 = l2.next; }
    cur = cur.next;
}
cur.next = (l1 != null) ? l1 : l2;
return dummy.next;`,
      },
      recursion: {
        hint: "Pick the smaller head node, set its next to the merged result of remaining lists",
        snippet: `ListNode merge(ListNode l1, ListNode l2) {
    if (l1 == null) return l2;
    if (l2 == null) return l1;
    if (l1.val <= l2.val) { l1.next = merge(l1.next, l2); return l1; }
    else { l2.next = merge(l1, l2.next); return l2; }
}`,
      },
      stream: {
        hint: "Collect both lists' values into one list, sort it, rebuild a linked list from sorted values",
        snippet: `List<Integer> vals = new ArrayList<>();
for (ListNode n = l1; n != null; n = n.next) vals.add(n.val);
for (ListNode n = l2; n != null; n = n.next) vals.add(n.val);
Collections.sort(vals);
// rebuild nodes from vals`,
      },
    },
    {
      id: 136,
      title: "Merge K sorted lists",
      problem:
        "Given an array of k sorted linked lists, merge all lists into one sorted linked list.",
      examples: [
        {
          input: "lists = [[1,4,5],[1,3,4],[2,6]]",
          output: "[1,1,2,3,4,4,5,6]",
        },
        { input: "lists = []", output: "[]" },
      ],
      tip: "Min-heap (PriorityQueue) always yields the global minimum; add each list's head, poll and advance",
      iteration: {
        hint: "Seed the PriorityQueue with all non-null list heads; poll min node, push its next if not null",
        snippet: `PriorityQueue<ListNode> pq = new PriorityQueue<>((a,b)->a.val-b.val);
for (ListNode l : lists) if (l != null) pq.offer(l);
ListNode dummy = new ListNode(0), cur = dummy;
while (!pq.isEmpty()) {
    cur.next = pq.poll(); cur = cur.next;
    if (cur.next != null) pq.offer(cur.next);
}
return dummy.next;`,
      },
      recursion: {
        hint: "Divide and conquer: pair-wise merge lists recursively until one list remains",
        snippet: `ListNode mergeK(ListNode[] lists, int lo, int hi) {
    if (lo == hi) return lists[lo];
    int mid = (lo + hi) / 2;
    return merge(mergeK(lists, lo, mid), mergeK(lists, mid+1, hi));
}`,
      },
      stream: {
        hint: "Flatten all node values into one stream, sort, rebuild the merged list",
        snippet: `List<Integer> vals = new ArrayList<>();
for (ListNode l : lists)
    for (ListNode n = l; n != null; n = n.next) vals.add(n.val);
Collections.sort(vals);
// rebuild nodes from vals`,
      },
    },
    {
      id: 137,
      title: "Swap nodes in pairs",
      problem:
        "Given the head of a linked list, swap every two adjacent nodes and return the modified list head.",
      examples: [
        { input: "head = [1,2,3,4]", output: "[2,1,4,3]" },
        { input: "head = [1,2,3]", output: "[2,1,3]" },
      ],
      tip: "For each pair: wire prev→second, second→first, first→rest; use dummy head to unify edge cases",
      iteration: {
        hint: "Track prev; in each loop iteration swap the next two nodes and advance prev by two",
        snippet: `ListNode dummy = new ListNode(0); dummy.next = head;
ListNode prev = dummy;
while (prev.next != null && prev.next.next != null) {
    ListNode a = prev.next, b = prev.next.next;
    prev.next = b; a.next = b.next; b.next = a;
    prev = a;
}
return dummy.next;`,
      },
      recursion: {
        hint: "Swap first two nodes, then recursively swap the rest, linking results together",
        snippet: `ListNode swapPairs(ListNode head) {
    if (head == null || head.next == null) return head;
    ListNode second = head.next;
    head.next = swapPairs(second.next);
    second.next = head;
    return second;
}`,
      },
      stream: {
        hint: "Collect values to a list, swap adjacent pairs by index, rebuild nodes",
        snippet: `List<Integer> vals = new ArrayList<>();
for (ListNode n = head; n != null; n = n.next) vals.add(n.val);
for (int i = 0; i+1 < vals.size(); i+=2)
    Collections.swap(vals, i, i+1);
// rebuild nodes from vals`,
      },
    },
    {
      id: 138,
      title: "Reverse nodes in K-group",
      problem:
        "Given the head of a linked list and integer k, reverse nodes in groups of k and leave any short final group unchanged.",
      examples: [
        { input: "head = [1,2,3,4,5], k = 2", output: "[2,1,4,3,5]" },
        { input: "head = [1,2,3,4,5], k = 3", output: "[3,2,1,4,5]" },
      ],
      tip: "Check that K nodes exist; reverse that group; link to result of recursing on the remainder",
      iteration: {
        hint: "Count K nodes ahead to confirm the group; reverse in-place; repeat for next group",
        snippet: `ListNode dummy = new ListNode(0); dummy.next = head;
ListNode prev = dummy;
while (hasKNodes(prev.next, k)) {
    ListNode tail = prev.next;
    for (int i = 1; i < k; i++) {
        ListNode tmp = tail.next;
        tail.next = tmp.next;
        tmp.next = prev.next;
        prev.next = tmp;
    }
    prev = tail;
}
return dummy.next;`,
      },
      recursion: {
        hint: "If fewer than K nodes remain, return head unchanged; else reverse K, recurse on rest",
        snippet: `ListNode reverseK(ListNode head, int k) {
    ListNode cur = head;
    for (int i = 0; i < k; i++) { if (cur == null) return head; cur = cur.next; }
    ListNode prev = null, node = head;
    for (int i = 0; i < k; i++) { ListNode nx = node.next; node.next = prev; prev = node; node = nx; }
    head.next = reverseK(node, k);
    return prev;
}`,
      },
      stream: {
        hint: "Collect values to list, reverse each K-length window, rebuild nodes",
        snippet: `List<Integer> vals = new ArrayList<>();
for (ListNode n = head; n != null; n = n.next) vals.add(n.val);
for (int i = 0; i + k <= vals.size(); i += k)
    Collections.reverse(vals.subList(i, i + k));
// rebuild nodes from vals`,
      },
    },
    {
      id: 139,
      title: "Reorder list",
      problem:
        "Given a linked list L0->L1->...->Ln, reorder it as L0->Ln->L1->Ln-1 and return the head.",
      examples: [
        { input: "head = [1,2,3,4]", output: "[1,4,2,3]" },
        { input: "head = [1,2,3,4,5]", output: "[1,5,2,4,3]" },
      ],
      tip: "Find mid with slow/fast, reverse the second half, then interleave nodes from both halves",
      iteration: {
        hint: "Three phases: find mid, reverse second half in-place, merge both halves alternately",
        snippet: `// Phase 1: find mid
ListNode slow = head, fast = head;
while (fast.next != null && fast.next.next != null) { slow = slow.next; fast = fast.next.next; }
// Phase 2: reverse second half
ListNode second = reverse(slow.next); slow.next = null;
// Phase 3: interleave
ListNode first = head;
while (second != null) { ListNode tmp1 = first.next, tmp2 = second.next; first.next = second; second.next = tmp1; first = tmp1; second = tmp2; }`,
      },
      recursion: {
        hint: "Recursively find the midpoint, then interleave front and reversed-back halves",
        snippet: `// Find mid recursively, then interleave
int len = length(head);
ListNode[] arr = new ListNode[len];
ListNode cur = head;
for (int i = 0; i < len; i++) { arr[i] = cur; cur = cur.next; }
// interleave arr[0..len/2-1] with arr[len-1..len/2] reversed`,
      },
      stream: {
        hint: "Collect all nodes into a deque, then alternately poll from front and back to rebuild",
        snippet: `Deque<ListNode> dq = new ArrayDeque<>();
for (ListNode n = head; n != null; n = n.next) dq.addLast(n);
ListNode dummy = new ListNode(0), cur = dummy;
boolean front = true;
while (!dq.isEmpty()) {
    cur.next = front ? dq.pollFirst() : dq.pollLast();
    cur = cur.next; front = !front;
}
cur.next = null;`,
      },
    },
    {
      id: 140,
      title: "Palindrome linked list check",
      problem:
        "Given the head of a linked list, return true if its values form a palindrome; otherwise return false.",
      examples: [
        { input: "head = [1,2,2,1]", output: "true" },
        { input: "head = [1,2]", output: "false" },
      ],
      tip: "Find mid with slow/fast, reverse the second half, compare both halves node by node",
      iteration: {
        hint: "Find mid, reverse second half in-place, compare from both ends toward center",
        snippet: `ListNode slow = head, fast = head;
while (fast != null && fast.next != null) { slow = slow.next; fast = fast.next.next; }
ListNode rev = reverse(slow);
ListNode l1 = head, l2 = rev;
while (l2 != null) { if (l1.val != l2.val) return false; l1 = l1.next; l2 = l2.next; }
return true;`,
      },
      recursion: {
        hint: "Use a front reference that advances while recursion unwinds from the tail",
        snippet: `ListNode front;
boolean check(ListNode back) {
    if (back == null) return true;
    if (!check(back.next)) return false;
    boolean eq = front.val == back.val;
    front = front.next;
    return eq;
}`,
      },
      stream: {
        hint: "Collect all values into a list; compare the list to its reverse with equals()",
        snippet: `List<Integer> vals = new ArrayList<>();
for (ListNode n = head; n != null; n = n.next) vals.add(n.val);
List<Integer> rev = new ArrayList<>(vals);
Collections.reverse(rev);
return vals.equals(rev);`,
      },
    },
    {
      id: 141,
      title: "Flatten a multilevel doubly linked list",
      problem:
        "Given the head of a multilevel doubly linked list with child pointers, flatten it into a single-level doubly linked list.",
      examples: [
        { input: "head = [1,2,3,null,null,7,8]", output: "[1,2,3,7,8]" },
        { input: "head = [1,null,2]", output: "[1,2]" },
      ],
      tip: "Use a stack: push deferred next pointers; when a child exists, follow it and push the next",
      iteration: {
        hint: "Traverse with a stack; on child, push curr.next then move into child; pop when next is null",
        snippet: `Deque<Node> stack = new ArrayDeque<>();
Node cur = head;
while (cur != null) {
    if (cur.child != null) {
        if (cur.next != null) stack.push(cur.next);
        cur.next = cur.child; cur.next.prev = cur; cur.child = null;
    }
    if (cur.next == null && !stack.isEmpty()) { cur.next = stack.pop(); cur.next.prev = cur; }
    cur = cur.next;
}
return head;`,
      },
      recursion: {
        hint: "Recursively flatten the child, splice it between current and current.next, return list tail",
        snippet: `Node flatten(Node head) {
    Node cur = head, tail = head;
    while (cur != null) {
        if (cur.child != null) {
            Node childTail = flatten(cur.child);
            childTail.next = cur.next;
            if (cur.next != null) cur.next.prev = childTail;
            cur.next = cur.child; cur.child.prev = cur; cur.child = null;
        }
        tail = cur; cur = cur.next;
    }
    return tail;
}`,
      },
      stream: {
        hint: "DFS-collect all nodes into a list in visit order, then relink prev/next pointers sequentially",
        snippet: `List<Node> order = new ArrayList<>();
Deque<Node> stack = new ArrayDeque<>();
if (head != null) stack.push(head);
while (!stack.isEmpty()) {
    Node n = stack.pop(); order.add(n);
    if (n.next != null) stack.push(n.next);
    if (n.child != null) stack.push(n.child);
}
// relink order[i].next = order[i+1], order[i+1].prev = order[i]`,
      },
    },
    {
      id: 142,
      title: "Copy list with random pointer",
      problem:
        "Given a linked list where each node has next and random pointers, return a deep copy of the list.",
      examples: [
        {
          input: "head = [[7,null],[13,0],[11,4]]",
          output: "deep copy with same values and random links",
        },
        { input: "head = []", output: "[]" },
      ],
      tip: "HashMap old→new: pass 1 creates all clone nodes, pass 2 wires next and random pointers",
      iteration: {
        hint: "Two-pass: first build the map, then assign next/random using the map",
        snippet: `Map<Node, Node> map = new HashMap<>();
for (Node n = head; n != null; n = n.next)
    map.put(n, new Node(n.val));
for (Node n = head; n != null; n = n.next) {
    map.get(n).next   = map.get(n.next);
    map.get(n).random = map.get(n.random);
}
return map.get(head);`,
      },
      recursion: {
        hint: "Memoized recursion: if node already cloned return it; else clone, store, recurse for next/random",
        snippet: `Map<Node, Node> memo = new HashMap<>();
Node copy(Node n) {
    if (n == null) return null;
    if (memo.containsKey(n)) return memo.get(n);
    Node clone = new Node(n.val);
    memo.put(n, clone);
    clone.next = copy(n.next); clone.random = copy(n.random);
    return clone;
}`,
      },
      stream: {
        hint: "Collect original nodes to a list, create clones in one pass, wire pointers using list index lookups",
        snippet: `List<Node> orig = new ArrayList<>();
for (Node n = head; n != null; n = n.next) orig.add(n);
List<Node> clones = orig.stream().map(n -> new Node(n.val)).collect(toList());
for (int i = 0; i < orig.size(); i++) {
    clones.get(i).next   = orig.get(i).next   == null ? null : clones.get(orig.indexOf(orig.get(i).next));
    clones.get(i).random = orig.get(i).random == null ? null : clones.get(orig.indexOf(orig.get(i).random));
}
return clones.get(0);`,
      },
    },
    {
      id: 143,
      title: "Add two numbers represented as linked lists",
      problem:
        "Given two non-empty linked lists storing digits in reverse order, add the numbers and return the sum as a linked list.",
      examples: [
        { input: "l1 = [2,4,3], l2 = [5,6,4]", output: "[7,0,8]" },
        { input: "l1 = [9,9], l2 = [1]", output: "[0,0,1]" },
      ],
      tip: "Simulate grade-school addition: traverse both lists simultaneously, propagate the carry forward",
      iteration: {
        hint: "While either list or carry is non-zero, compute digit sum, create node, advance pointers",
        snippet: `ListNode dummy = new ListNode(0), cur = dummy;
int carry = 0;
while (l1 != null || l2 != null || carry != 0) {
    int sum = carry + (l1 != null ? l1.val : 0) + (l2 != null ? l2.val : 0);
    carry = sum / 10; cur.next = new ListNode(sum % 10);
    cur = cur.next; if (l1 != null) l1 = l1.next; if (l2 != null) l2 = l2.next;
}
return dummy.next;`,
      },
      recursion: {
        hint: "Add current digits plus carry; recurse with the carry into the next pair of nodes",
        snippet: `ListNode add(ListNode l1, ListNode l2, int carry) {
    if (l1 == null && l2 == null && carry == 0) return null;
    int sum = carry + (l1 != null ? l1.val : 0) + (l2 != null ? l2.val : 0);
    ListNode node = new ListNode(sum % 10);
    node.next = add(l1 != null ? l1.next : null, l2 != null ? l2.next : null, sum / 10);
    return node;
}`,
      },
      stream: {
        hint: "Convert both lists to BigIntegers (digits are already in reverse order), add, rebuild list",
        snippet: `// Digits stored in reverse order in the list
BigInteger numA = toBigInt(l1), numB = toBigInt(l2);
BigInteger result = numA.add(numB);
// convert result digits back to new ListNodes in reverse order`,
      },
    },
    {
      id: 144,
      title: "Split linked list into parts",
      problem:
        "Given the head of a linked list and integer k, split the list into k consecutive parts with sizes as equal as possible.",
      examples: [
        { input: "head = [1,2,3], k = 5", output: "[[1],[2],[3],[],[]]" },
        {
          input: "head = [1,2,3,4,5,6,7,8,9,10], k = 3",
          output: "[[1,2,3,4],[5,6,7],[8,9,10]]",
        },
      ],
      tip: "Compute chunkSize = len/k and extra = len%k; first 'extra' parts each get one additional node",
      iteration: {
        hint: "Walk the list; for each part take chunkSize nodes (plus one extra if extra > 0), then cut",
        snippet: `int len = 0; for (ListNode n = root; n != null; n = n.next) len++;
int sz = len / k, extra = len % k;
ListNode[] res = new ListNode[k]; ListNode cur = root;
for (int i = 0; i < k && cur != null; i++) {
    res[i] = cur;
    int partLen = sz + (i < extra ? 1 : 0);
    for (int j = 1; j < partLen; j++) cur = cur.next;
    ListNode next = cur.next; cur.next = null; cur = next;
}
return res;`,
      },
      recursion: {
        hint: "Compute list length, determine current part size, cut off the head, recurse for remaining k-1 parts",
        snippet: `ListNode[] split(ListNode head, int k, int len) {
    if (k == 0) return new ListNode[0];
    int sz = len / k + (len % k > 0 ? 1 : 0);
    ListNode cur = head;
    for (int i = 1; i < sz && cur != null; i++) cur = cur.next;
    // cut and recurse ...
}`,
      },
      stream: {
        hint: "Collect all nodes to a list, use subList to slice each chunk, rebuild each part as a linked list",
        snippet: `List<ListNode> nodes = new ArrayList<>();
for (ListNode n = root; n != null; n = n.next) nodes.add(n);
int sz = nodes.size() / k, extra = nodes.size() % k, idx = 0;
ListNode[] res = new ListNode[k];
for (int i = 0; i < k; i++) {
    int end = idx + sz + (i < extra ? 1 : 0);
    // relink nodes[idx..end-1], null-terminate last, advance idx = end
}`,
      },
    },
    {
      id: 145,
      title: "Rotate a linked list",
      problem:
        "Given the head of a linked list and integer k, rotate the list to the right by k positions.",
      examples: [
        { input: "head = [1,2,3,4,5], k = 2", output: "[4,5,1,2,3]" },
        { input: "head = [0,1,2], k = 4", output: "[2,0,1]" },
      ],
      tip: "Find length and tail; make the list circular; break at position (len - k%len) to get new head",
      iteration: {
        hint: "Find tail to get length, form a ring, advance to the new tail, break the circle",
        snippet: `int len = 1; ListNode tail = head;
while (tail.next != null) { tail = tail.next; len++; }
tail.next = head; // make circular
int steps = len - k % len;
for (int i = 0; i < steps; i++) tail = tail.next;
ListNode newHead = tail.next; tail.next = null;
return newHead;`,
      },
      recursion: {
        hint: "Compute length recursively, then rotate by advancing (len - k%len) steps",
        snippet: `int len = length(head);
k = k % len;
if (k == 0) return head;
// find (len-k)-th node, cut and reattach
ListNode newTail = nodeAt(head, len - k - 1);
ListNode newHead = newTail.next;
newTail.next = null; tail(newHead).next = head;
return newHead;`,
      },
      stream: {
        hint: "Collect all nodes to a list, rotate with subList, rebuild the linked list",
        snippet: `List<ListNode> nodes = new ArrayList<>();
for (ListNode n = head; n != null; n = n.next) nodes.add(n);
int n = nodes.size(), rot = k % n;
List<ListNode> rotated = new ArrayList<>();
rotated.addAll(nodes.subList(n - rot, n));
rotated.addAll(nodes.subList(0, n - rot));
// relink rotated nodes, null-terminate last`,
      },
    },
    {
      id: 146,
      title: "Delete duplicates from a sorted list",
      problem:
        "Given a sorted linked list, delete duplicate values so each value appears once.",
      examples: [
        { input: "head = [1,1,2]", output: "[1,2]" },
        { input: "head = [1,1,2,3,3]", output: "[1,2,3]" },
      ],
      tip: "While curr.next has the same value as curr, skip curr.next; keep only the first occurrence",
      iteration: {
        hint: "Compare curr and curr.next values; skip the duplicate by advancing the next pointer",
        snippet: `ListNode cur = head;
while (cur != null && cur.next != null) {
    if (cur.val == cur.next.val) cur.next = cur.next.next;
    else cur = cur.next;
}
return head;`,
      },
      recursion: {
        hint: "If head.next has the same value, skip it and recurse; otherwise recurse on head.next",
        snippet: `ListNode deleteDups(ListNode head) {
    if (head == null || head.next == null) return head;
    if (head.val == head.next.val) return deleteDups(head.next);
    head.next = deleteDups(head.next);
    return head;
}`,
      },
      stream: {
        hint: "Collect values into a LinkedHashSet (preserves insertion order, removes dups), rebuild list",
        snippet: `List<Integer> seen = new ArrayList<>();
for (ListNode n = head; n != null; n = n.next)
    if (seen.isEmpty() || seen.get(seen.size()-1) != n.val)
        seen.add(n.val);
// rebuild nodes from seen`,
      },
    },
    {
      id: 147,
      title: "Remove elements with a given value",
      problem:
        "Given a linked list and a value val, remove every node whose value equals val and return the head.",
      examples: [
        { input: "head = [1,2,6,3,4,5,6], val = 6", output: "[1,2,3,4,5]" },
        { input: "head = [7,7,7], val = 7", output: "[]" },
      ],
      tip: "Dummy head + scan: whenever curr.next.val equals target, wire curr.next = curr.next.next",
      iteration: {
        hint: "Use a dummy head so the real head can also be removed without special-casing",
        snippet: `ListNode dummy = new ListNode(0); dummy.next = head;
ListNode cur = dummy;
while (cur.next != null) {
    if (cur.next.val == val) cur.next = cur.next.next;
    else cur = cur.next;
}
return dummy.next;`,
      },
      recursion: {
        hint: "If current node matches val, skip it and return result of recursing on next; else recurse on next",
        snippet: `ListNode removeElements(ListNode head, int val) {
    if (head == null) return null;
    head.next = removeElements(head.next, val);
    return head.val == val ? head.next : head;
}`,
      },
      stream: {
        hint: "Collect all values not equal to val, then rebuild a new linked list from that filtered list",
        snippet: `List<Integer> vals = new ArrayList<>();
for (ListNode n = head; n != null; n = n.next)
    if (n.val != val) vals.add(n.val);
// rebuild nodes from vals`,
      },
    },
    {
      id: 148,
      title: "Reverse a sublist between positions m and n",
      problem:
        "Given the head of a linked list and positions m and n, reverse the nodes from m through n in one pass.",
      examples: [
        { input: "head = [1,2,3,4,5], m = 2, n = 4", output: "[1,4,3,2,5]" },
        { input: "head = [5], m = 1, n = 1", output: "[5]" },
      ],
      tip: "Advance to node m-1 (pre), then reverse n-m+1 nodes; reconnect pre and post-reversal tails",
      iteration: {
        hint: "Find the node just before position m; reverse the m..n range using the insertion technique",
        snippet: `ListNode dummy = new ListNode(0); dummy.next = head;
ListNode pre = dummy;
for (int i = 1; i < m; i++) pre = pre.next;
ListNode cur = pre.next;
for (int i = 0; i < n - m; i++) {
    ListNode next = cur.next;
    cur.next = next.next;
    next.next = pre.next;
    pre.next = next;
}
return dummy.next;`,
      },
      recursion: {
        hint: "If m==1, reverse the first n nodes and reconnect; else recurse with m-1, n-1 on head.next",
        snippet: `ListNode reverseBetween(ListNode head, int m, int n) {
    if (m == 1) return reverseFirstN(head, n);
    head.next = reverseBetween(head.next, m - 1, n - 1);
    return head;
}`,
      },
      stream: {
        hint: "Collect all values to a list, reverse the subList(m-1, n), then rebuild nodes",
        snippet: `List<Integer> vals = new ArrayList<>();
for (ListNode cur = head; cur != null; cur = cur.next) vals.add(cur.val);
Collections.reverse(vals.subList(m - 1, n));
// rebuild nodes from vals`,
      },
    },
    {
      id: 149,
      title: "Odd-even linked list rearrangement",
      problem:
        "Given a linked list, group nodes at odd indices followed by nodes at even indices while preserving relative order.",
      examples: [
        { input: "head = [1,2,3,4,5]", output: "[1,3,5,2,4]" },
        { input: "head = [2,1,3,5,6,4,7]", output: "[2,3,6,7,1,5,4]" },
      ],
      tip: "Separate nodes at odd-index and even-index positions into two chains; join even-tail to odd-head",
      iteration: {
        hint: "Walk with odd and even pointers advancing two steps at a time; join at the end",
        snippet: `if (head == null) return head;
ListNode odd = head, even = head.next, evenHead = even;
while (even != null && even.next != null) {
    odd.next = even.next; odd = odd.next;
    even.next = odd.next; even = even.next;
}
odd.next = evenHead;
return head;`,
      },
      recursion: {
        hint: "Collect nodes by index parity recursively; join the two sublists",
        snippet: `void split(ListNode cur, int idx, List<Integer> odd, List<Integer> even) {
    if (cur == null) return;
    (idx % 2 == 1 ? odd : even).add(cur.val);
    split(cur.next, idx + 1, odd, even);
}
// rebuild: all odd-index values then all even-index values`,
      },
      stream: {
        hint: "Collect (index, value) pairs; sort by index%2 then original index; rebuild list",
        snippet: `List<Integer> vals = new ArrayList<>();
for (ListNode n = head; n != null; n = n.next) vals.add(n.val);
List<Integer> result = new ArrayList<>();
for (int i = 0; i < vals.size(); i += 2) result.add(vals.get(i));
for (int i = 1; i < vals.size(); i += 2) result.add(vals.get(i));
// rebuild nodes from result`,
      },
    },
    {
      id: 150,
      title: "Sort a linked list (merge sort on linked list)",
      problem:
        "Given the head of a linked list, sort the list in ascending order using linked-list friendly sorting.",
      examples: [
        { input: "head = [4,2,1,3]", output: "[1,2,3,4]" },
        { input: "head = [-1,5,3,4,0]", output: "[-1,0,3,4,5]" },
      ],
      tip: "Find midpoint with slow/fast, split the list, recursively sort each half, merge sorted halves",
      iteration: {
        hint: "Bottom-up merge sort: merge windows of size 1, 2, 4, ... without recursion",
        snippet: `int len = length(head);
ListNode dummy = new ListNode(0); dummy.next = head;
for (int sz = 1; sz < len; sz *= 2) {
    ListNode cur = dummy.next, tail = dummy;
    while (cur != null) {
        ListNode left = cur, right = split(cur, sz);
        cur = split(right, sz);
        ListNode[] merged = merge(left, right);
        tail.next = merged[0]; tail = merged[1];
    }
}`,
      },
      recursion: {
        hint: "Find mid with slow/fast, cut the list at mid, sort both halves, merge them",
        snippet: `ListNode sort(ListNode head) {
    if (head == null || head.next == null) return head;
    ListNode mid = getMid(head), second = mid.next; mid.next = null;
    return merge(sort(head), sort(second));
}`,
      },
      stream: {
        hint: "Collect all values into a list, sort with Collections.sort, rebuild the linked list",
        snippet: `List<Integer> vals = new ArrayList<>();
for (ListNode n = head; n != null; n = n.next) vals.add(n.val);
Collections.sort(vals);
ListNode dummy = new ListNode(0), cur = dummy;
for (int v : vals) { cur.next = new ListNode(v); cur = cur.next; }
return dummy.next;`,
      },
    },
    {
      id: 151,
      title: "Insert into a sorted linked list",
      problem:
        "Given the head of a sorted linked list and a value, insert the value so the list remains sorted.",
      examples: [
        { input: "head = [1,3,4], val = 2", output: "[1,2,3,4]" },
        { input: "head = [], val = 5", output: "[5]" },
      ],
      tip: "Traverse until curr.next.val exceeds the new value; insert the new node between curr and curr.next",
      iteration: {
        hint: "Use a dummy head; advance while next exists and next.val < val; then insert",
        snippet: `ListNode dummy = new ListNode(Integer.MIN_VALUE); dummy.next = head;
ListNode cur = dummy;
while (cur.next != null && cur.next.val < val) cur = cur.next;
ListNode node = new ListNode(val);
node.next = cur.next; cur.next = node;
return dummy.next;`,
      },
      recursion: {
        hint: "If head is null or head.val >= val, prepend the new node; otherwise recurse on head.next",
        snippet: `ListNode insert(ListNode head, int val) {
    if (head == null || head.val >= val) {
        ListNode node = new ListNode(val); node.next = head; return node;
    }
    head.next = insert(head.next, val);
    return head;
}`,
      },
      stream: {
        hint: "Collect all values to a list, add the new value, sort, rebuild the sorted linked list",
        snippet: `List<Integer> vals = new ArrayList<>();
for (ListNode n = head; n != null; n = n.next) vals.add(n.val);
vals.add(val); Collections.sort(vals);
// rebuild nodes from vals`,
      },
    },
    {
      id: 152,
      title: "Remove a loop in a linked list",
      problem:
        "Given the head of a linked list that may contain a loop, remove the loop while preserving all nodes reachable from head.",
      examples: [
        { input: "head = [1,2,3,4], pos = 1", output: "[1,2,3,4], no cycle" },
        { input: "head = [1,2], pos = -1", output: "[1,2], no cycle" },
      ],
      tip: "Floyd's to detect meeting point; reset one pointer to head, advance both by 1 to find loop entry; break loop",
      iteration: {
        hint: "Phase 1: detect meeting point; Phase 2: find loop start; Phase 3: advance to node before start and break",
        snippet: `ListNode slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next; fast = fast.next.next;
    if (slow == fast) break;
}
if (fast == null || fast.next == null) return; // no cycle
slow = head;
while (slow != fast) { slow = slow.next; fast = fast.next; }
// find the last node in the cycle (just before slow/fast)
ListNode prev = fast;
while (prev.next != slow) prev = prev.next;
prev.next = null;`,
      },
      recursion: {
        hint: "Use a HashSet to track visited nodes; when a node is seen twice, null out the pointer to it",
        snippet: `void removeCycle(ListNode prev, ListNode cur, Set<ListNode> seen) {
    if (cur == null) return;
    if (seen.contains(cur)) { prev.next = null; return; }
    seen.add(cur);
    removeCycle(cur, cur.next, seen);
}`,
      },
      stream: {
        hint: "Traverse into a LinkedHashSet; when add() returns false the cycle start is found; fix the last pointer",
        snippet: `List<ListNode> visited = new ArrayList<>();
Set<ListNode> seen = new LinkedHashSet<>();
ListNode cur = head;
while (cur != null && seen.add(cur)) { visited.add(cur); cur = cur.next; }
if (cur != null) visited.get(visited.size() - 1).next = null;`,
      },
    },
    {
      id: 153,
      title: "Merge two circular linked lists",
      problem:
        "Given two sorted circular linked lists, merge them into one sorted circular linked list.",
      examples: [
        {
          input: "list1 = [1,3,5], list2 = [2,4,6]",
          output: "[1,2,3,4,5,6] circular",
        },
        { input: "list1 = [], list2 = [7,8]", output: "[7,8] circular" },
      ],
      tip: "Find both circular tails; swap their next pointers so tail1→head2 and tail2→head1",
      iteration: {
        hint: "Traverse each list to find its tail; swap the tail.next connections to join the circles",
        snippet: `ListNode tail1 = head1;
while (tail1.next != head1) tail1 = tail1.next;
ListNode tail2 = head2;
while (tail2.next != head2) tail2 = tail2.next;
tail1.next = head2;
tail2.next = head1;
return head1;`,
      },
      recursion: {
        hint: "Recursively walk to find each circular list's tail node, then reconnect",
        snippet: `ListNode findTail(ListNode cur, ListNode head) {
    return cur.next == head ? cur : findTail(cur.next, head);
}
// usage:
ListNode t1 = findTail(head1, head1), t2 = findTail(head2, head2);
t1.next = head2; t2.next = head1;`,
      },
      stream: {
        hint: "Collect all node values from both circular lists, relink all as one circular list",
        snippet: `List<Integer> vals = new ArrayList<>();
ListNode cur = head1;
do { vals.add(cur.val); cur = cur.next; } while (cur != head1);
cur = head2;
do { vals.add(cur.val); cur = cur.next; } while (cur != head2);
// build circular list from vals`,
      },
    },
    {
      id: 154,
      title: "Clone a linked list (deep copy without random pointer)",
      problem:
        "Given the head of a singly linked list, create a deep copy containing new nodes with the same values and next order.",
      examples: [
        { input: "head = [1,2,3]", output: "[1,2,3] as new nodes" },
        { input: "head = []", output: "[]" },
      ],
      tip: "Traverse the original list and create new nodes one by one, linking each to the previous clone",
      iteration: {
        hint: "Walk with two pointers: one on original, one building the clone chain node by node",
        snippet: `if (head == null) return null;
ListNode dummy = new ListNode(0), cloneCur = dummy, cur = head;
while (cur != null) {
    cloneCur.next = new ListNode(cur.val);
    cloneCur = cloneCur.next; cur = cur.next;
}
return dummy.next;`,
      },
      recursion: {
        hint: "Clone current node, set its next to the recursive clone of head.next, return it",
        snippet: `ListNode clone(ListNode head) {
    if (head == null) return null;
    ListNode node = new ListNode(head.val);
    node.next = clone(head.next);
    return node;
}`,
      },
      stream: {
        hint: "Stream node values from the original list, map each to a new ListNode, link them in order",
        snippet: `List<Integer> vals = new ArrayList<>();
for (ListNode n = head; n != null; n = n.next) vals.add(n.val);
ListNode dummy = new ListNode(0), cur = dummy;
for (int v : vals) { cur.next = new ListNode(v); cur = cur.next; }
return dummy.next;`,
      },
    },
    {
      id: 155,
      title: "Partition list around a value x",
      problem:
        "Given a linked list and value x, partition nodes so values less than x come before values greater than or equal to x, preserving order.",
      examples: [
        { input: "head = [1,4,3,2,5,2], x = 3", output: "[1,2,2,4,3,5]" },
        { input: "head = [2,1], x = 2", output: "[1,2]" },
      ],
      tip: "Two dummy heads 'less' and 'greater'; scan all nodes appending to the right chain; join at end",
      iteration: {
        hint: "All nodes with val < x go to the 'less' chain; others to 'greater'; concatenate less then greater",
        snippet: `ListNode lessHead = new ListNode(0), greaterHead = new ListNode(0);
ListNode less = lessHead, greater = greaterHead;
for (ListNode cur = head; cur != null; cur = cur.next) {
    if (cur.val < x) { less.next = cur; less = less.next; }
    else { greater.next = cur; greater = greater.next; }
}
greater.next = null; less.next = greaterHead.next;
return lessHead.next;`,
      },
      recursion: {
        hint: "Split the list recursively into two sublists, then join them",
        snippet: `ListNode partition(ListNode head, int x, ListNode[] less, ListNode[] greater) {
    if (head == null) return null;
    partition(head.next, x, less, greater);
    if (head.val < x) { head.next = less[0]; less[0] = head; }
    else { head.next = greater[0]; greater[0] = head; }
    return less[0];
}`,
      },
      stream: {
        hint: "Use stream partition to separate nodes by value, collect two lists, rebuild combined chain",
        snippet: `List<Integer> lo = new ArrayList<>(), hi = new ArrayList<>();
for (ListNode n = head; n != null; n = n.next)
    (n.val < x ? lo : hi).add(n.val);
lo.addAll(hi);
// rebuild nodes from lo`,
      },
    },
    {
      id: 156,
      title: "Add one to a number represented as a linked list",
      problem:
        "Given a linked list representing a non-negative integer with most significant digit first, add one and return the result list.",
      examples: [
        { input: "head = [1,2,9]", output: "[1,3,0]" },
        { input: "head = [9,9,9]", output: "[1,0,0,0]" },
      ],
      tip: "Reverse the list so LSB is first, add 1 with carry propagation, reverse back; prepend 1 if carry remains",
      iteration: {
        hint: "Reverse, then walk adding carry starting at 1; reverse result, prepend extra node if needed",
        snippet: `ListNode rev = reverse(head);
ListNode cur = rev; int carry = 1;
while (cur != null && carry > 0) {
    int sum = cur.val + carry;
    cur.val = sum % 10; carry = sum / 10;
    if (cur.next == null && carry > 0) { cur.next = new ListNode(1); carry = 0; }
    cur = cur.next;
}
return reverse(rev);`,
      },
      recursion: {
        hint: "Recurse to the last node, then propagate carry back; return carry to caller",
        snippet: `int addOne(ListNode node) {
    if (node == null) return 1;
    int carry = addOne(node.next);
    int sum = node.val + carry;
    node.val = sum % 10;
    return sum / 10;
}
// if addOne(head) == 1, prepend new node with val 1`,
      },
      stream: {
        hint: "Collect digits, convert to BigInteger, add 1, rebuild list from result digits",
        snippet: `List<Integer> digits = new ArrayList<>();
for (ListNode n = head; n != null; n = n.next) digits.add(n.val);
// convert to number, add 1, extract digits back
BigInteger num = new BigInteger(digits.stream().map(String::valueOf).collect(Collectors.joining()));
String result = num.add(BigInteger.ONE).toString();
// rebuild nodes from result chars`,
      },
    },
    {
      id: 157,
      title: "Multiply two numbers represented as linked lists",
      problem:
        "Given two linked lists representing non-negative integers, multiply the numbers and return the product as an integer or string.",
      examples: [
        { input: "l1 = [1,2,3], l2 = [4,5]", output: "5535" },
        { input: "l1 = [0], l2 = [9,9]", output: "0" },
      ],
      tip: "Convert each list to a long by traversing MSB-to-LSB; multiply the two longs; convert product back to list",
      iteration: {
        hint: "Traverse each list accumulating digits (num = num*10 + node.val); multiply; rebuild result list",
        snippet: `long num1 = 0;
for (ListNode n = l1; n != null; n = n.next) num1 = num1 * 10 + n.val;
long num2 = 0;
for (ListNode n = l2; n != null; n = n.next) num2 = num2 * 10 + n.val;
long product = num1 * num2;
// convert product to linked list (insert digits at front or collect and rebuild)`,
      },
      recursion: {
        hint: "Recursively compute the numeric value of each list, multiply, rebuild result as a list",
        snippet: `long listToNum(ListNode head) {
    if (head == null) return 0;
    return head.val * (long)Math.pow(10, length(head.next)) + listToNum(head.next);
}
long product = listToNum(l1) * listToNum(l2);
// rebuild list from product digits`,
      },
      stream: {
        hint: "Use reduce to accumulate each list into a number; multiply; stream result digits to rebuild list",
        snippet: `long[] n1 = {0};
for (ListNode n = l1; n != null; n = n.next) n1[0] = n1[0]*10 + n.val;
long[] n2 = {0};
for (ListNode n = l2; n != null; n = n.next) n2[0] = n2[0]*10 + n.val;
String prod = Long.toString(n1[0] * n2[0]);
// map each char of prod to new ListNode`,
      },
    },
    {
      id: 158,
      title: "Detect the middle of a linked list",
      problem:
        "Given the head of a linked list, return the middle node; for even length, return the second middle node.",
      examples: [
        { input: "head = [1,2,3,4,5]", output: "node with value 3" },
        { input: "head = [1,2,3,4,5,6]", output: "node with value 4" },
      ],
      tip: "Slow/fast pointer: slow advances 1 step, fast advances 2; when fast reaches end, slow is at the middle",
      iteration: {
        hint: "Standard tortoise-and-hare: slow at middle when fast cannot advance two more steps",
        snippet: `ListNode slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
}
return slow;`,
      },
      recursion: {
        hint: "Count length recursively, then advance a pointer to length/2 in a second pass",
        snippet: `int len = length(head);
ListNode findMid(ListNode node, int[] count, int target) {
    if (node == null) return null;
    if (++count[0] == target) return node;
    return findMid(node.next, count, target);
}
return findMid(head, new int[]{0}, (len + 1) / 2);`,
      },
      stream: {
        hint: "Collect all nodes to a list; return the element at index list.size()/2",
        snippet: `List<ListNode> nodes = new ArrayList<>();
for (ListNode n = head; n != null; n = n.next) nodes.add(n);
return nodes.get(nodes.size() / 2);`,
      },
    },
    {
      id: 159,
      title: "Delete a node given only access to that node (no head reference)",
      problem:
        "Given only a reference to a non-tail node in a singly linked list, delete that node from the list.",
      examples: [
        { input: "list = [4,5,1,9], node = 5", output: "[4,1,9]" },
        { input: "list = [4,5,1,9], node = 1", output: "[4,5,9]" },
      ],
      tip: "Copy the next node's value into the current node, then skip the next node entirely",
      iteration: {
        hint: "Overwrite current node's value with next; bypass next by rewiring node.next = node.next.next",
        snippet: `node.val = node.next.val;
node.next = node.next.next;`,
      },
      recursion: {
        hint: "No recursion needed; the operation is a direct O(1) in-place mutation of two fields",
        snippet: `// Single operation — recursion not applicable
node.val = node.next.val;
node.next = node.next.next;`,
      },
      stream: {
        hint: "No stream alternative; this is an O(1) pointer trick that only works in-place",
        snippet: `// Cannot use streams — no reference to head
// Trick: mimic deletion by copying successor's value
node.val = node.next.val;
node.next = node.next.next;`,
      },
    },
    {
      id: 160,
      title: "Convert a sorted linked list to a balanced BST",
      problem:
        "Given the head of a sorted singly linked list, convert it to a height-balanced binary search tree.",
      examples: [
        {
          input: "head = [-10,-3,0,5,9]",
          output: "balanced BST with inorder [-10,-3,0,5,9]",
        },
        { input: "head = [1,3]", output: "balanced BST with inorder [1,3]" },
      ],
      tip: "Find the middle node as the root; recurse on the left sublist and right sublist for children",
      iteration: {
        hint: "Simulate in-order construction: use a current pointer that advances as nodes are consumed",
        snippet: `ListNode cur = head;
TreeNode build(int lo, int hi) {
    if (lo > hi) return null;
    int mid = (lo + hi) / 2;
    TreeNode left = build(lo, mid - 1);
    TreeNode node = new TreeNode(cur.val); cur = cur.next;
    node.left = left; node.right = build(mid + 1, hi);
    return node;
}
return build(0, length(head) - 1);`,
      },
      recursion: {
        hint: "Find mid node as root; split at mid; recurse on left and right halves",
        snippet: `TreeNode sortedListToBST(ListNode head) {
    if (head == null) return null;
    if (head.next == null) return new TreeNode(head.val);
    ListNode mid = getMid(head), prev = getPrev(head, mid);
    if (prev != null) prev.next = null;
    TreeNode root = new TreeNode(mid.val);
    root.left = sortedListToBST(head);
    root.right = sortedListToBST(mid.next);
    return root;
}`,
      },
      stream: {
        hint: "Collect all values to a list, then apply binary-search-based BST construction on the sorted array",
        snippet: `List<Integer> vals = new ArrayList<>();
for (ListNode n = head; n != null; n = n.next) vals.add(n.val);
TreeNode buildBST(int lo, int hi) {
    if (lo > hi) return null;
    int mid = (lo + hi) / 2;
    TreeNode node = new TreeNode(vals.get(mid));
    node.left = buildBST(lo, mid-1); node.right = buildBST(mid+1, hi);
    return node;
}
return buildBST(0, vals.size() - 1);`,
      },
    },
    {
      id: 161,
      title: "Find the length of a linked list (iterative and recursive)",
      problem:
        "Given the head of a linked list, return the number of nodes in the list.",
      examples: [
        { input: "head = [10,20,30]", output: "3" },
        { input: "head = []", output: "0" },
      ],
      tip: "Iterative: count nodes in a while loop; Recursive: base case null→0, else 1 + length(head.next)",
      iteration: {
        hint: "Simple counter loop: increment for each node until curr is null",
        snippet: `int count = 0;
ListNode cur = head;
while (cur != null) { count++; cur = cur.next; }
return count;`,
      },
      recursion: {
        hint: "Return 0 for null; otherwise return 1 plus the length of the remaining list",
        snippet: `int length(ListNode head) {
    if (head == null) return 0;
    return 1 + length(head.next);
}`,
      },
      stream: {
        hint: "Use Stream.iterate to generate nodes, count until null, or collect to a list and get its size",
        snippet: `List<ListNode> nodes = new ArrayList<>();
for (ListNode n = head; n != null; n = n.next) nodes.add(n);
return nodes.size();
// or: (int) Stream.iterate(head, n->n!=null, n->n.next).count();`,
      },
    },
    {
      id: 162,
      title: "Check if two linked lists are identical",
      problem:
        "Given heads of two linked lists, return true if both lists contain identical values in the same order.",
      examples: [
        { input: "a = [1,2,3], b = [1,2,3]", output: "true" },
        { input: "a = [1,2], b = [1,2,3]", output: "false" },
      ],
      tip: "Walk both lists in lockstep: any value mismatch or different lengths returns false",
      iteration: {
        hint: "Advance both pointers simultaneously; return false on value mismatch or one null before other",
        snippet: `while (l1 != null && l2 != null) {
    if (l1.val != l2.val) return false;
    l1 = l1.next; l2 = l2.next;
}
return l1 == null && l2 == null;`,
      },
      recursion: {
        hint: "If both null return true; if one null or values differ return false; else recurse on both nexts",
        snippet: `boolean identical(ListNode l1, ListNode l2) {
    if (l1 == null && l2 == null) return true;
    if (l1 == null || l2 == null) return false;
    return l1.val == l2.val && identical(l1.next, l2.next);
}`,
      },
      stream: {
        hint: "Collect both lists' values into lists; use List.equals() to compare",
        snippet: `List<Integer> a = new ArrayList<>(), b = new ArrayList<>();
for (ListNode n = l1; n != null; n = n.next) a.add(n.val);
for (ListNode n = l2; n != null; n = n.next) b.add(n.val);
return a.equals(b);`,
      },
    },
    {
      id: 163,
      title:
        "Find the Nth node from the beginning and end simultaneously (two-pointer)",
      problem:
        "Given the head of a linked list and n, return both the nth node from the beginning and the nth node from the end.",
      examples: [
        { input: "head = [1,2,3,4,5], n = 2", output: "begin = 2, end = 4" },
        { input: "head = [10,20,30], n = 1", output: "begin = 10, end = 30" },
      ],
      tip: "Nth from start: advance N-1 steps from head; Nth from end: two pointers N apart, advance together",
      iteration: {
        hint: "For Nth from end, place fast pointer N steps ahead; when fast hits null, slow is at target",
        snippet: `// Nth from start
ListNode fromStart = head;
for (int i = 1; i < n; i++) fromStart = fromStart.next;

// Nth from end (two-pointer)
ListNode slow = head, fast = head;
for (int i = 0; i < n; i++) fast = fast.next;
while (fast != null) { slow = slow.next; fast = fast.next; }
// slow is now Nth from end`,
      },
      recursion: {
        hint: "Count from end using recursion: increment counter on the way back up; capture node when count == n",
        snippet: `ListNode result;
void findNthFromEnd(ListNode node, int n, int[] count) {
    if (node == null) return;
    findNthFromEnd(node.next, n, count);
    if (++count[0] == n) result = node;
}`,
      },
      stream: {
        hint: "Collect all nodes to a list; access by index (n-1) for start and (size-n) for end",
        snippet: `List<ListNode> nodes = new ArrayList<>();
for (ListNode cur = head; cur != null; cur = cur.next) nodes.add(cur);
ListNode nthFromStart = nodes.get(n - 1);
ListNode nthFromEnd  = nodes.get(nodes.size() - n);`,
      },
    },
    {
      id: 164,
      title:
        "Segregate even and odd nodes in a linked list without changing node values",
      problem:
        "Given a linked list, rearrange nodes so all even-valued nodes appear before odd-valued nodes without changing values.",
      examples: [
        { input: "head = [17,15,8,12,10,5,4]", output: "[8,12,10,4,17,15,5]" },
        { input: "head = [1,3,5]", output: "[1,3,5]" },
      ],
      tip: "Two dummy heads for even-value and odd-value nodes; scan all nodes and append to the right chain",
      iteration: {
        hint: "Partition nodes by val%2 into two chains; join the even chain, then the odd chain",
        snippet: `ListNode evenHead = new ListNode(0), oddHead = new ListNode(0);
ListNode even = evenHead, odd = oddHead;
for (ListNode cur = head; cur != null; cur = cur.next) {
    if (cur.val % 2 == 0) { even.next = cur; even = even.next; }
    else { odd.next = cur; odd = odd.next; }
}
odd.next = null; even.next = oddHead.next;
return evenHead.next;`,
      },
      recursion: {
        hint: "Recurse through the list, building even and odd value sublists, then join them",
        snippet: `void split(ListNode cur, ListNode[] even, ListNode[] odd) {
    if (cur == null) return;
    split(cur.next, even, odd);
    if (cur.val % 2 == 0) { cur.next = even[0]; even[0] = cur; }
    else { cur.next = odd[0]; odd[0] = cur; }
}
// join even[0] tail → odd[0] head`,
      },
      stream: {
        hint: "Partition values by parity into two lists, concatenate even then odd, rebuild linked list",
        snippet: `List<Integer> evens = new ArrayList<>(), odds = new ArrayList<>();
for (ListNode n = head; n != null; n = n.next)
    (n.val % 2 == 0 ? evens : odds).add(n.val);
evens.addAll(odds);
// rebuild nodes from evens`,
      },
    },
    {
      id: 165,
      title: "Implement a doubly linked list with insert/delete at both ends",
      problem:
        "Design a doubly linked list that supports insertion and deletion at both the head and tail.",
      examples: [
        {
          input: "insertFirst(1), insertLast(2), deleteFirst()",
          output: "[2]",
        },
        { input: "insertLast(5), insertFirst(3), deleteLast()", output: "[3]" },
      ],
      tip: "Maintain head and tail pointers; all four boundary operations are O(1) with proper prev/next wiring",
      iteration: {
        hint: "insertFront: new node's next = head, head.prev = node, update head; deleteBack: tail = tail.prev, tail.next = null",
        snippet: `// insertFront
void insertFront(int val) {
    Node node = new Node(val);
    if (head == null) { head = tail = node; return; }
    node.next = head; head.prev = node; head = node;
}
// deleteBack
void deleteBack() {
    if (tail == null) return;
    tail = tail.prev;
    if (tail != null) tail.next = null; else head = null;
}`,
      },
      recursion: {
        hint: "Traversal operations can be recursive; insertions/deletions at ends are inherently O(1) iterative",
        snippet: `// Recursive traversal (print all)
void printAll(Node cur) {
    if (cur == null) return;
    System.out.print(cur.val + " ");
    printAll(cur.next);
}`,
      },
      stream: {
        hint: "Java's built-in LinkedList implements Deque — use addFirst/addLast/removeFirst/removeLast",
        snippet: `Deque<Integer> dll = new LinkedList<>();
dll.addFirst(1);   // insertFront
dll.addLast(2);    // insertBack
dll.removeFirst(); // deleteFront
dll.removeLast();  // deleteBack`,
      },
    },
    {
      id: 166,
      title:
        "Detect and remove a cycle, and return the starting node of the cycle",
      problem:
        "Given a linked list that may contain a cycle, return the cycle start node and remove the cycle if it exists.",
      examples: [
        {
          input: "head = [3,2,0,-4], pos = 1",
          output: "start = node 2, list has no cycle",
        },
        {
          input: "head = [1,2], pos = -1",
          output: "start = null, list has no cycle",
        },
      ],
      tip: "Floyd's phase 1 finds meeting point; phase 2 resets one pointer to head, both advance by 1 to cycle entry",
      iteration: {
        hint: "After finding cycle entry (where slow==fast after reset), walk to the node just before entry to break it",
        snippet: `ListNode slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next; fast = fast.next.next;
    if (slow == fast) {
        slow = head;
        while (slow != fast) { slow = slow.next; fast = fast.next; }
        ListNode prev = fast;
        while (prev.next != slow) prev = prev.next;
        prev.next = null; return slow;
    }
}
return null;`,
      },
      recursion: {
        hint: "Use a HashSet: when a node is seen twice, it is the cycle start; null out the previous node's next",
        snippet: `ListNode findCycleStart(ListNode prev, ListNode cur, Set<ListNode> seen) {
    if (cur == null) return null;
    if (seen.contains(cur)) { prev.next = null; return cur; }
    seen.add(cur);
    return findCycleStart(cur, cur.next, seen);
}`,
      },
      stream: {
        hint: "Track insertion order in a LinkedHashSet; add() returning false identifies the cycle start node",
        snippet: `List<ListNode> order = new ArrayList<>();
Set<ListNode> seen = new LinkedHashSet<>();
ListNode cur = head;
while (cur != null && seen.add(cur)) { order.add(cur); cur = cur.next; }
if (cur != null) order.get(order.size() - 1).next = null; // break cycle
return cur; // cycle start`,
      },
    },
    {
      id: 167,
      title:
        "Flatten a linked list where each node has a 'child' pointer to another sorted list",
      problem:
        "Given a linked list where each node has a child pointer to a sorted list, flatten it into one sorted list.",
      examples: [
        {
          input: "heads = [[5,7,8,30],[10,20],[19,22,50],[28,35,40,45]]",
          output: "[5,7,8,10,19,20,22,28,30,35,40,45,50]",
        },
        { input: "heads = [[1,3],[2,4]]", output: "[1,2,3,4]" },
      ],
      tip: "Merge each child sorted list into the main list in-place as you traverse; advance past the merged section",
      iteration: {
        hint: "When a child is found, merge child list between curr and curr.next using sorted-merge logic",
        snippet: `ListNode cur = head;
while (cur != null) {
    if (cur.child != null) {
        ListNode child = cur.child, childTail = child;
        while (childTail.next != null) childTail = childTail.next;
        childTail.next = cur.next;
        cur.next = child; cur.child = null;
    }
    cur = cur.next;
}
return head;`,
      },
      recursion: {
        hint: "Recursively flatten the child list first; splice it between current node and current.next",
        snippet: `ListNode flatten(ListNode head) {
    if (head == null) return null;
    if (head.child != null) {
        ListNode flatChild = flatten(head.child);
        ListNode tail = flatChild;
        while (tail.next != null) tail = tail.next;
        tail.next = head.next; head.next = flatChild; head.child = null;
    }
    head.next = flatten(head.next);
    return head;
}`,
      },
      stream: {
        hint: "DFS-collect all node values in traversal order into a list; sort; rebuild as a single linked list",
        snippet: `List<Integer> vals = new ArrayList<>();
void dfs(ListNode n) {
    if (n == null) return;
    vals.add(n.val); dfs(n.child); dfs(n.next);
}
dfs(head); Collections.sort(vals);
// rebuild sorted nodes from vals`,
      },
    },
    {
      id: 168,
      title:
        "Implement an LRU cache using a doubly linked list + hash map (from scratch)",
      problem:
        "Design an LRU cache using a hash map and doubly linked list with get and put operations in O(1).",
      examples: [
        {
          input: "capacity = 2, put(1,1), put(2,2), get(1), put(3,3), get(2)",
          output: "1, -1",
        },
        {
          input: "capacity = 1, put(1,1), put(2,2), get(1), get(2)",
          output: "-1, 2",
        },
      ],
      tip: "HashMap gives O(1) key lookup; DLL gives O(1) move-to-front on get and evict-oldest on put",
      iteration: {
        hint: "get: look up node in map, move to front of DLL, return val; put: insert at front, evict tail if over capacity",
        snippet: `// get(key)
if (!map.containsKey(key)) return -1;
Node node = map.get(key);
moveToFront(node); return node.val;

// put(key, val)
if (map.containsKey(key)) { Node n = map.get(key); n.val = val; moveToFront(n); return; }
Node node = new Node(key, val); addToFront(node); map.put(key, node);
if (map.size() > capacity) { Node lru = removeTail(); map.remove(lru.key); }`,
      },
      recursion: {
        hint: "LRU operations are inherently O(1) iterative; no recursion benefit here",
        snippet: `// Not recursive by nature; helper methods are O(1)
void moveToFront(Node node) {
    removeNode(node); addToFront(node);
}
void removeNode(Node n) { n.prev.next = n.next; n.next.prev = n.prev; }
void addToFront(Node n) { n.next = head.next; n.prev = head; head.next.prev = n; head.next = n; }`,
      },
      stream: {
        hint: "Use LinkedHashMap with accessOrder=true as a ready-made LRU; override removeEldestEntry",
        snippet: `Map<Integer,Integer> cache = new LinkedHashMap<>(capacity, 0.75f, true) {
    protected boolean removeEldestEntry(Map.Entry<Integer,Integer> e) {
        return size() > capacity;
    }
};`,
      },
    },
    {
      id: 169,
      title: "Find the point where two linked lists merge (Y-shaped list)",
      problem:
        "Given heads of two Y-shaped linked lists, return the merge point node where both lists begin sharing nodes.",
      examples: [
        {
          input: "A = [1,2,3,4], B = [9,3,4], merge = 3",
          output: "node with value 3",
        },
        { input: "A = [1,2], B = [3,4], merge = none", output: "null" },
      ],
      tip: "Two-pointer swap: each pointer travels both lists' lengths; they meet exactly at the merge node",
      iteration: {
        hint: "pA and pB advance together; on reaching null each is redirected to the other's head",
        snippet: `ListNode pA = headA, pB = headB;
while (pA != pB) {
    pA = (pA == null) ? headB : pA.next;
    pB = (pB == null) ? headA : pB.next;
}
return pA; // null if no intersection`,
      },
      recursion: {
        hint: "Compute both lengths; advance the longer list by the difference; compare node by node",
        snippet: `int lenA = length(headA), lenB = length(headB);
while (lenA > lenB) { headA = headA.next; lenA--; }
while (lenB > lenA) { headB = headB.next; lenB--; }
while (headA != headB) { headA = headA.next; headB = headB.next; }
return headA;`,
      },
      stream: {
        hint: "Collect all nodes of list A into a HashSet; scan list B and return the first node present in the set",
        snippet: `Set<ListNode> nodesA = new HashSet<>();
for (ListNode n = headA; n != null; n = n.next) nodesA.add(n);
for (ListNode n = headB; n != null; n = n.next)
    if (nodesA.contains(n)) return n;
return null;`,
      },
    },
    {
      id: 170,
      title: "Reverse alternate K nodes in a linked list",
      problem:
        "Given the head of a linked list and integer k, reverse each alternate group of k nodes and leave the groups between them unchanged.",
      examples: [
        {
          input: "head = [1,2,3,4,5,6,7,8], k = 2",
          output: "[2,1,3,4,6,5,7,8]",
        },
        { input: "head = [1,2,3,4,5], k = 3", output: "[3,2,1,4,5]" },
      ],
      tip: "Reverse K nodes, then skip the next K nodes unchanged, then repeat; track connections between groups",
      iteration: {
        hint: "In a loop: reverse K, advance past K, connect the reversed group to the skipped group, repeat",
        snippet: `ListNode dummy = new ListNode(0); dummy.next = head;
ListNode prev = dummy;
while (prev.next != null) {
    // reverse K nodes starting at prev.next
    ListNode tail = prev.next;
    ListNode revHead = reverseK(prev.next, k);
    prev.next = revHead; tail.next = null;
    // skip K nodes
    ListNode skip = tail;
    for (int i = 0; i < k && skip.next != null; i++) skip = skip.next;
    tail.next = skip.next != null ? skip.next : null; // connect to next reversal
    prev = skip;
}`,
      },
      recursion: {
        hint: "Reverse K nodes, skip K nodes, then recurse on the rest; link all groups together",
        snippet: `ListNode reverseAltK(ListNode head, int k) {
    // reverse K
    ListNode cur = head; int cnt = k;
    while (cur != null && cnt-- > 0) { /* reverse k */ }
    // skip K
    ListNode skip = /* tail of reversed */; cnt = k;
    while (skip.next != null && cnt-- > 0) skip = skip.next;
    // tail of reversed section.next = recurse on rest
    /* reversedTail */.next = reverseAltK(skip.next, k);
    return /* reversedHead */;
}`,
      },
      stream: {
        hint: "Collect all values into a list, reverse alternate K-size windows, rebuild nodes",
        snippet: `List<Integer> vals = new ArrayList<>();
for (ListNode n = head; n != null; n = n.next) vals.add(n.val);
for (int i = 0; i + k <= vals.size(); i += 2*k)
    Collections.reverse(vals.subList(i, Math.min(i+k, vals.size())));
// rebuild nodes from vals`,
      },
    },
  ],
};
