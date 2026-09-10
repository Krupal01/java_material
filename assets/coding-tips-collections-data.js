window.CT_COLLECTIONS = {
  topic: "Java Collections",
  icon: "📦",
  range: "397–456",
  questions: [
    {
      id: 397,
      title: "Remove duplicates from a List while preserving order",
      problem:
        "Given a List of integers, return a new List containing each value only once, keeping the first occurrence order.",
      examples: [
        { input: "list = [4, 2, 4, 3, 2, 1]", output: "[4, 2, 3, 1]" },
        { input: "list = [1, 1, 1]", output: "[1]" },
      ],
      tip: "Use a LinkedHashSet when you need uniqueness plus insertion order.",
      iteration: {
        hint: "Track seen values in a LinkedHashSet and append only first-time values.",
        snippet: `List<Integer> unique = new ArrayList<>();
Set<Integer> seen = new LinkedHashSet<>();
for (int value : list) {
    if (seen.add(value)) unique.add(value);
}
return unique;`,
      },
      recursion: {
        hint: "Carry the index, seen set, and output list through recursive calls.",
        snippet: `void dedupe(List<Integer> list, int i, Set<Integer> seen, List<Integer> out) {
    if (i == list.size()) return;
    if (seen.add(list.get(i))) out.add(list.get(i));
    dedupe(list, i + 1, seen, out);
}`,
      },
      stream: {
        hint: "Stream distinct keeps encounter order for ordered streams.",
        snippet: `return list.stream()
    .distinct()
    .collect(Collectors.toList());`,
      },
    },
    {
      id: 398,
      title: "Count element frequencies with HashMap",
      problem:
        "Given a List of values, return a Map where each key is a value and each value is its frequency count.",
      examples: [
        { input: "list = [a, b, a, c, b, a]", output: "{a=3, b=2, c=1}" },
        { input: "list = [5, 5, 6]", output: "{5=2, 6=1}" },
      ],
      tip: "Map.merge is the cleanest Java way to increment counters.",
      iteration: {
        hint: "For each element, merge 1 into the frequency map.",
        snippet: `Map<String, Integer> freq = new HashMap<>();
for (String value : list) {
    freq.merge(value, 1, Integer::sum);
}
return freq;`,
      },
      recursion: {
        hint: "Recurse over indices and update the same map.",
        snippet: `void count(List<String> list, int i, Map<String,Integer> freq) {
    if (i == list.size()) return;
    freq.merge(list.get(i), 1, Integer::sum);
    count(list, i + 1, freq);
}`,
      },
      stream: {
        hint: "Use groupingBy with counting, then convert Long if needed.",
        snippet: `Map<String, Long> freq = list.stream()
    .collect(Collectors.groupingBy(x -> x, Collectors.counting()));`,
      },
    },
    {
      id: 399,
      title: "Find first non-repeating element in a List",
      problem:
        "Given a List, return the first element whose frequency is exactly one. Return null if no such element exists.",
      examples: [
        { input: "list = [4, 5, 4, 6, 5, 7]", output: "6" },
        { input: "list = [1, 1, 2, 2]", output: "null" },
      ],
      tip: "Count with LinkedHashMap so iteration later follows original key insertion order.",
      iteration: {
        hint: "Build a LinkedHashMap frequency map, then return first entry with count 1.",
        snippet: `Map<Integer,Integer> freq = new LinkedHashMap<>();
for (int value : list) freq.merge(value, 1, Integer::sum);
for (Map.Entry<Integer,Integer> entry : freq.entrySet())
    if (entry.getValue() == 1) return entry.getKey();
return null;`,
      },
      recursion: {
        hint: "Use recursion for the final scan over the original list after counting.",
        snippet: `Integer firstUnique(List<Integer> list, int i, Map<Integer,Integer> freq) {
    if (i == list.size()) return null;
    if (freq.get(list.get(i)) == 1) return list.get(i);
    return firstUnique(list, i + 1, freq);
}`,
      },
      stream: {
        hint: "Collect into LinkedHashMap, then stream entries in encounter order.",
        snippet: `return list.stream().collect(Collectors.groupingBy(
        x -> x, LinkedHashMap::new, Collectors.counting()))
    .entrySet().stream()
    .filter(e -> e.getValue() == 1)
    .map(Map.Entry::getKey)
    .findFirst().orElse(null);`,
      },
    },
    {
      id: 400,
      title: "Sort a List of objects by multiple fields",
      problem:
        "Given a List of Student objects, sort by marks descending and then by name ascending.",
      examples: [
        {
          input: "[(Bob,80), (Ana,90), (Dan,90)]",
          output: "[(Ana,90), (Dan,90), (Bob,80)]",
        },
        { input: "[(Zed,70), (Amy,70)]", output: "[(Amy,70), (Zed,70)]" },
      ],
      tip: "Comparator chaining keeps multi-field sorting readable.",
      iteration: {
        hint: "Sort the list in place with a comparator.",
        snippet: `students.sort(
    Comparator.comparingInt(Student::marks).reversed()
        .thenComparing(Student::name)
);
return students;`,
      },
      recursion: {
        hint: "Recursive sorting is usually unnecessary; delegate comparison to the same comparator.",
        snippet: `Comparator<Student> cmp = Comparator.comparingInt(Student::marks)
    .reversed().thenComparing(Student::name);
// Use merge sort recursively if asked to implement sorting from scratch.`,
      },
      stream: {
        hint: "Return a sorted copy without mutating the original list.",
        snippet: `return students.stream()
    .sorted(Comparator.comparingInt(Student::marks).reversed()
        .thenComparing(Student::name))
    .collect(Collectors.toList());`,
      },
    },
    {
      id: 401,
      title: "Merge two Lists alternately",
      problem:
        "Given two Lists, return a new List by taking one element from the first list, then one from the second, continuing until both are exhausted.",
      examples: [
        { input: "a = [1, 2, 3], b = [9, 8]", output: "[1, 9, 2, 8, 3]" },
        { input: "a = [A], b = [x, y, z]", output: "[A, x, y, z]" },
      ],
      tip: "Loop until the larger size and guard each list access.",
      iteration: {
        hint: "Use a single index and add from each list only when the index exists.",
        snippet: `List<Integer> result = new ArrayList<>();
for (int i = 0; i < Math.max(a.size(), b.size()); i++) {
    if (i < a.size()) result.add(a.get(i));
    if (i < b.size()) result.add(b.get(i));
}
return result;`,
      },
      recursion: {
        hint: "At each index, append available values from both lists.",
        snippet: `void mergeAlt(List<Integer> a, List<Integer> b, int i, List<Integer> out) {
    if (i >= a.size() && i >= b.size()) return;
    if (i < a.size()) out.add(a.get(i));
    if (i < b.size()) out.add(b.get(i));
    mergeAlt(a, b, i + 1, out);
}`,
      },
      stream: {
        hint: "Stream indices and flatMap available values for each position.",
        snippet: `return IntStream.range(0, Math.max(a.size(), b.size()))
    .boxed()
    .flatMap(i -> Stream.concat(
        i < a.size() ? Stream.of(a.get(i)) : Stream.empty(),
        i < b.size() ? Stream.of(b.get(i)) : Stream.empty()))
    .collect(Collectors.toList());`,
      },
    },
    {
      id: 402,
      title: "Find intersection of two Lists preserving first list order",
      problem:
        "Given two Lists, return values from the first list that also appear in the second list, without duplicates and preserving first-list order.",
      examples: [
        { input: "a = [4, 2, 4, 1], b = [2, 4]", output: "[4, 2]" },
        { input: "a = [1, 3], b = [2, 4]", output: "[]" },
      ],
      tip: "Use one HashSet for membership and another for values already emitted.",
      iteration: {
        hint: "Convert the second list to a set, then scan the first list once.",
        snippet: `Set<Integer> lookup = new HashSet<>(b);
Set<Integer> emitted = new HashSet<>();
List<Integer> result = new ArrayList<>();
for (int value : a)
    if (lookup.contains(value) && emitted.add(value)) result.add(value);
return result;`,
      },
      recursion: {
        hint: "Carry lookup, emitted, and output through a recursive scan.",
        snippet: `void intersect(List<Integer> a, int i, Set<Integer> lookup,
               Set<Integer> emitted, List<Integer> out) {
    if (i == a.size()) return;
    int value = a.get(i);
    if (lookup.contains(value) && emitted.add(value)) out.add(value);
    intersect(a, i + 1, lookup, emitted, out);
}`,
      },
      stream: {
        hint: "Filter by membership and use distinct for first-list encounter order.",
        snippet: `Set<Integer> lookup = new HashSet<>(b);
return a.stream()
    .filter(lookup::contains)
    .distinct()
    .collect(Collectors.toList());`,
      },
    },
    {
      id: 403,
      title: "Find elements in List A not in List B",
      problem:
        "Given two Lists, return all values from the first list that are not present in the second list, preserving order.",
      examples: [
        { input: "a = [1, 2, 3, 4], b = [2, 4]", output: "[1, 3]" },
        { input: "a = [5, 5, 6], b = [5]", output: "[6]" },
      ],
      tip: "Convert the second list to a HashSet for O(1) contains checks.",
      iteration: {
        hint: "Scan list A and add only values not in the set from B.",
        snippet: `Set<Integer> banned = new HashSet<>(b);
List<Integer> result = new ArrayList<>();
for (int value : a)
    if (!banned.contains(value)) result.add(value);
return result;`,
      },
      recursion: {
        hint: "Recursive scan with output accumulator.",
        snippet: `void difference(List<Integer> a, int i, Set<Integer> banned, List<Integer> out) {
    if (i == a.size()) return;
    if (!banned.contains(a.get(i))) out.add(a.get(i));
    difference(a, i + 1, banned, out);
}`,
      },
      stream: {
        hint: "Filter with a prebuilt HashSet.",
        snippet: `Set<Integer> banned = new HashSet<>(b);
return a.stream()
    .filter(x -> !banned.contains(x))
    .collect(Collectors.toList());`,
      },
    },
    {
      id: 404,
      title: "Rotate an ArrayList by k positions",
      problem:
        "Given an ArrayList and integer k, rotate the list to the right by k positions and return the rotated list.",
      examples: [
        { input: "list = [1, 2, 3, 4, 5], k = 2", output: "[4, 5, 1, 2, 3]" },
        { input: "list = [A, B, C], k = 4", output: "[C, A, B]" },
      ],
      tip: "Normalize k using k % n, then join suffix + prefix.",
      iteration: {
        hint: "Use subList copies so the result is independent of the original list view.",
        snippet: `int n = list.size();
k %= n;
List<String> result = new ArrayList<>(list.subList(n - k, n));
result.addAll(list.subList(0, n - k));
return result;`,
      },
      recursion: {
        hint: "Recursive rotation by one is simple but less efficient for large k.",
        snippet: `void rotateOne(List<String> list, int times) {
    if (times == 0 || list.isEmpty()) return;
    list.add(0, list.remove(list.size() - 1));
    rotateOne(list, times - 1);
}`,
      },
      stream: {
        hint: "Map each output index to the correct original index.",
        snippet: `int n = list.size(), shift = k % n;
return IntStream.range(0, n)
    .mapToObj(i -> list.get((i - shift + n) % n))
    .collect(Collectors.toList());`,
      },
    },
    {
      id: 405,
      title: "Split a List into chunks of size k",
      problem:
        "Given a List and chunk size k, split it into consecutive sublists where each chunk has at most k elements.",
      examples: [
        { input: "list = [1,2,3,4,5], k = 2", output: "[[1,2],[3,4],[5]]" },
        { input: "list = [A,B,C], k = 5", output: "[[A,B,C]]" },
      ],
      tip: "Step the start index by k and copy each subList range.",
      iteration: {
        hint: "Use Math.min for the final partial chunk.",
        snippet: `List<List<Integer>> chunks = new ArrayList<>();
for (int start = 0; start < list.size(); start += k) {
    int end = Math.min(start + k, list.size());
    chunks.add(new ArrayList<>(list.subList(start, end)));
}
return chunks;`,
      },
      recursion: {
        hint: "Add the current chunk, then recurse at start + k.",
        snippet: `void chunk(List<Integer> list, int start, int k, List<List<Integer>> out) {
    if (start >= list.size()) return;
    out.add(new ArrayList<>(list.subList(start, Math.min(start + k, list.size()))));
    chunk(list, start + k, k, out);
}`,
      },
      stream: {
        hint: "Stream chunk indexes and map to copied subLists.",
        snippet: `return IntStream.iterate(0, i -> i < list.size(), i -> i + k)
    .mapToObj(i -> new ArrayList<>(list.subList(i, Math.min(i + k, list.size()))))
    .collect(Collectors.toList());`,
      },
    },
    {
      id: 406,
      title: "Flatten a List of Lists",
      problem:
        "Given a List of Lists, return a single List containing all elements in row order.",
      examples: [
        { input: "lists = [[1,2], [3], [4,5]]", output: "[1,2,3,4,5]" },
        { input: "lists = [[], [7,8]]", output: "[7,8]" },
      ],
      tip: "flatMap is the natural stream operation for one-level flattening.",
      iteration: {
        hint: "Loop over each inner list and addAll.",
        snippet: `List<Integer> flat = new ArrayList<>();
for (List<Integer> inner : lists) {
    flat.addAll(inner);
}
return flat;`,
      },
      recursion: {
        hint: "Recurse over the outer list index.",
        snippet: `void flatten(List<List<Integer>> lists, int i, List<Integer> out) {
    if (i == lists.size()) return;
    out.addAll(lists.get(i));
    flatten(lists, i + 1, out);
}`,
      },
      stream: {
        hint: "flatMap each inner list stream into one stream.",
        snippet: `return lists.stream()
    .flatMap(List::stream)
    .collect(Collectors.toList());`,
      },
    },
    {
      id: 407,
      title: "Group strings by first character",
      problem:
        "Given a List of strings, group them into a Map where the key is the first character and the value is the list of matching strings.",
      examples: [
        {
          input: "words = [apple, ant, bat, ball]",
          output: "{a=[apple, ant], b=[bat, ball]}",
        },
        { input: "words = [cat, dog]", output: "{c=[cat], d=[dog]}" },
      ],
      tip: "computeIfAbsent creates the list only when the key is first seen.",
      iteration: {
        hint: "For each word, compute the bucket by first char and append.",
        snippet: `Map<Character, List<String>> groups = new HashMap<>();
for (String word : words) {
    char key = word.charAt(0);
    groups.computeIfAbsent(key, k -> new ArrayList<>()).add(word);
}
return groups;`,
      },
      recursion: {
        hint: "Process one word per recursive call.",
        snippet: `void group(List<String> words, int i, Map<Character,List<String>> map) {
    if (i == words.size()) return;
    String word = words.get(i);
    map.computeIfAbsent(word.charAt(0), k -> new ArrayList<>()).add(word);
    group(words, i + 1, map);
}`,
      },
      stream: {
        hint: "groupingBy builds the Map directly.",
        snippet: `return words.stream()
    .collect(Collectors.groupingBy(word -> word.charAt(0)));`,
      },
    },
    {
      id: 408,
      title: "Group anagrams using Map",
      problem:
        "Given a List of words, group all anagrams together and return the groups.",
      examples: [
        {
          input: "words = [eat, tea, tan, ate, nat, bat]",
          output: "[[eat, tea, ate], [tan, nat], [bat]]",
        },
        { input: "words = [abc, cab, dog]", output: "[[abc, cab], [dog]]" },
      ],
      tip: "Sorted characters make a canonical Map key for anagrams.",
      iteration: {
        hint: "Sort each word's characters and group by that sorted key.",
        snippet: `Map<String, List<String>> map = new HashMap<>();
for (String word : words) {
    char[] chars = word.toCharArray();
    Arrays.sort(chars);
    map.computeIfAbsent(new String(chars), k -> new ArrayList<>()).add(word);
}
return new ArrayList<>(map.values());`,
      },
      recursion: {
        hint: "Group one word at a time recursively.",
        snippet: `void groupAnagrams(List<String> words, int i, Map<String,List<String>> map) {
    if (i == words.size()) return;
    char[] chars = words.get(i).toCharArray();
    Arrays.sort(chars);
    map.computeIfAbsent(new String(chars), k -> new ArrayList<>()).add(words.get(i));
    groupAnagrams(words, i + 1, map);
}`,
      },
      stream: {
        hint: "Use groupingBy with a sorted-key helper.",
        snippet: `return new ArrayList<>(words.stream()
    .collect(Collectors.groupingBy(word -> {
        char[] chars = word.toCharArray();
        Arrays.sort(chars);
        return new String(chars);
    })).values());`,
      },
    },
    {
      id: 409,
      title: "Top K frequent elements using Map and PriorityQueue",
      problem:
        "Given a List of integers and integer k, return the k most frequent values.",
      examples: [
        { input: "list = [1,1,1,2,2,3], k = 2", output: "[1,2]" },
        { input: "list = [4,4,5], k = 1", output: "[4]" },
      ],
      tip: "Count with Map, then keep a min-heap of size k by frequency.",
      iteration: {
        hint: "Build frequency map, then offer keys to a heap ordered by count.",
        snippet: `Map<Integer,Integer> freq = new HashMap<>();
for (int value : list) freq.merge(value, 1, Integer::sum);
PriorityQueue<Integer> heap = new PriorityQueue<>(Comparator.comparingInt(freq::get));
for (int value : freq.keySet()) {
    heap.offer(value);
    if (heap.size() > k) heap.poll();
}
return new ArrayList<>(heap);`,
      },
      recursion: {
        hint: "Recursion is useful for counting; heap selection remains iterative.",
        snippet: `void count(List<Integer> list, int i, Map<Integer,Integer> freq) {
    if (i == list.size()) return;
    freq.merge(list.get(i), 1, Integer::sum);
    count(list, i + 1, freq);
}`,
      },
      stream: {
        hint: "Sort frequency entries descending and limit to k.",
        snippet: `Map<Integer, Long> freq = list.stream()
    .collect(Collectors.groupingBy(x -> x, Collectors.counting()));
return freq.entrySet().stream()
    .sorted(Map.Entry.<Integer,Long>comparingByValue().reversed())
    .limit(k)
    .map(Map.Entry::getKey)
    .collect(Collectors.toList());`,
      },
    },
    {
      id: 410,
      title: "Build value to indices Map",
      problem:
        "Given a List, return a Map where each key maps to all indices at which that value appears.",
      examples: [
        { input: "list = [a, b, a, c]", output: "{a=[0,2], b=[1], c=[3]}" },
        { input: "list = [5, 5]", output: "{5=[0,1]}" },
      ],
      tip: "Map values can be Lists; computeIfAbsent is ideal for index buckets.",
      iteration: {
        hint: "Loop over indices rather than values so the index is available.",
        snippet: `Map<String, List<Integer>> indexMap = new HashMap<>();
for (int i = 0; i < list.size(); i++) {
    indexMap.computeIfAbsent(list.get(i), k -> new ArrayList<>()).add(i);
}
return indexMap;`,
      },
      recursion: {
        hint: "At each index, append that index to the value's bucket.",
        snippet: `void buildIndex(List<String> list, int i, Map<String,List<Integer>> map) {
    if (i == list.size()) return;
    map.computeIfAbsent(list.get(i), k -> new ArrayList<>()).add(i);
    buildIndex(list, i + 1, map);
}`,
      },
      stream: {
        hint: "Stream indices and group by list value.",
        snippet: `return IntStream.range(0, list.size()).boxed()
    .collect(Collectors.groupingBy(list::get));`,
      },
    },
    {
      id: 411,
      title: "Sort a Map by values",
      problem:
        "Given a Map of names to scores, return entries sorted by score descending.",
      examples: [
        {
          input: "{Ana=90, Bob=75, Dan=90}",
          output: "[Ana=90, Dan=90, Bob=75]",
        },
        { input: "{A=1, B=3}", output: "[B=3, A=1]" },
      ],
      tip: "Maps are not sorted by value directly; sort the entrySet.",
      iteration: {
        hint: "Copy entries to a List, then sort that list.",
        snippet: `List<Map.Entry<String,Integer>> entries = new ArrayList<>(scores.entrySet());
entries.sort(Map.Entry.<String,Integer>comparingByValue().reversed()
    .thenComparing(Map.Entry.comparingByKey()));
return entries;`,
      },
      recursion: {
        hint: "Recursive sorting is rarely needed; focus on entry comparison.",
        snippet: `Comparator<Map.Entry<String,Integer>> cmp = Map.Entry
    .<String,Integer>comparingByValue().reversed()
    .thenComparing(Map.Entry.comparingByKey);`,
      },
      stream: {
        hint: "Stream entries, sorted by value descending, collect to List.",
        snippet: `return scores.entrySet().stream()
    .sorted(Map.Entry.<String,Integer>comparingByValue().reversed()
        .thenComparing(Map.Entry.comparingByKey()))
    .collect(Collectors.toList());`,
      },
    },
    {
      id: 412,
      title: "Merge two Maps by summing values",
      problem:
        "Given two Maps with integer values, return a new Map containing all keys, summing values for keys present in both.",
      examples: [
        { input: "a = {x=2, y=3}, b = {y=4, z=5}", output: "{x=2, y=7, z=5}" },
        { input: "a = {a=1}, b = {a=9}", output: "{a=10}" },
      ],
      tip: "Put one map into the result, then merge entries from the second map.",
      iteration: {
        hint: "Use merge to add or sum each value.",
        snippet: `Map<String,Integer> result = new HashMap<>(a);
for (Map.Entry<String,Integer> entry : b.entrySet()) {
    result.merge(entry.getKey(), entry.getValue(), Integer::sum);
}
return result;`,
      },
      recursion: {
        hint: "Recurse through a copied entry list from the second map.",
        snippet: `void mergeEntries(List<Map.Entry<String,Integer>> entries, int i, Map<String,Integer> out) {
    if (i == entries.size()) return;
    Map.Entry<String,Integer> e = entries.get(i);
    out.merge(e.getKey(), e.getValue(), Integer::sum);
    mergeEntries(entries, i + 1, out);
}`,
      },
      stream: {
        hint: "Concatenate entry streams and collect with a merge function.",
        snippet: `return Stream.concat(a.entrySet().stream(), b.entrySet().stream())
    .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, Integer::sum));`,
      },
    },
    {
      id: 413,
      title: "Invert a Map into grouped values",
      problem:
        "Given a Map from employee to department, return a Map from department to all employees in that department.",
      examples: [
        {
          input: "{Ana=IT, Bob=HR, Dan=IT}",
          output: "{IT=[Ana, Dan], HR=[Bob]}",
        },
        { input: "{A=Sales}", output: "{Sales=[A]}" },
      ],
      tip: "When values are not unique, inversion needs Map<V, List<K>>.",
      iteration: {
        hint: "For each entry, bucket the original key under its value.",
        snippet: `Map<String, List<String>> byDept = new HashMap<>();
for (Map.Entry<String,String> entry : empToDept.entrySet()) {
    byDept.computeIfAbsent(entry.getValue(), k -> new ArrayList<>()).add(entry.getKey());
}
return byDept;`,
      },
      recursion: {
        hint: "Recurse through map entries copied into a list.",
        snippet: `void invert(List<Map.Entry<String,String>> entries, int i, Map<String,List<String>> out) {
    if (i == entries.size()) return;
    Map.Entry<String,String> e = entries.get(i);
    out.computeIfAbsent(e.getValue(), k -> new ArrayList<>()).add(e.getKey());
    invert(entries, i + 1, out);
}`,
      },
      stream: {
        hint: "groupingBy the old value and map old keys into the group list.",
        snippet: `return empToDept.entrySet().stream()
    .collect(Collectors.groupingBy(Map.Entry::getValue,
        Collectors.mapping(Map.Entry::getKey, Collectors.toList())));`,
      },
    },
    {
      id: 414,
      title: "Implement a MultiMap with Map and List",
      problem:
        "Design a small MultiMap where one key can store multiple values and get(key) returns all values for that key.",
      examples: [
        { input: "put(a,1), put(a,2), get(a)", output: "[1,2]" },
        { input: "get(missing)", output: "[]" },
      ],
      tip: "A MultiMap is usually Map<K, List<V>> with computeIfAbsent.",
      iteration: {
        hint: "Use computeIfAbsent on put and getOrDefault on get.",
        snippet: `class MultiMap<K,V> {
    private final Map<K, List<V>> map = new HashMap<>();
    void put(K key, V value) {
        map.computeIfAbsent(key, k -> new ArrayList<>()).add(value);
    }
    List<V> get(K key) {
        return map.getOrDefault(key, List.of());
    }
}`,
      },
      recursion: {
        hint: "Bulk insert can recurse through values for one key.",
        snippet: `void putAll(String key, List<Integer> values, int i, Map<String,List<Integer>> map) {
    if (i == values.size()) return;
    map.computeIfAbsent(key, k -> new ArrayList<>()).add(values.get(i));
    putAll(key, values, i + 1, map);
}`,
      },
      stream: {
        hint: "Build a MultiMap from pair objects with groupingBy.",
        snippet: `Map<String, List<Integer>> multi = pairs.stream()
    .collect(Collectors.groupingBy(Pair::key,
        Collectors.mapping(Pair::value, Collectors.toList())));`,
      },
    },
    {
      id: 415,
      title: "Remove items from ArrayList while iterating",
      problem:
        "Given an ArrayList and a predicate, remove all matching elements without causing ConcurrentModificationException.",
      examples: [
        { input: "list = [1,2,3,4], remove even", output: "[1,3]" },
        { input: "list = [a, , b], remove empty", output: "[a,b]" },
      ],
      tip: "Use Iterator.remove or removeIf; do not remove from the list inside a for-each loop.",
      iteration: {
        hint: "Iterator.remove is safe because the iterator updates its expected modification count.",
        snippet: `Iterator<Integer> it = list.iterator();
while (it.hasNext()) {
    if (it.next() % 2 == 0) it.remove();
}
return list;`,
      },
      recursion: {
        hint: "When removing by index recursively, move backwards to avoid shifting problems.",
        snippet: `void removeEven(List<Integer> list, int i) {
    if (i < 0) return;
    if (list.get(i) % 2 == 0) list.remove(i);
    removeEven(list, i - 1);
}`,
      },
      stream: {
        hint: "removeIf mutates the list; filter returns a new list.",
        snippet: `list.removeIf(x -> x % 2 == 0);
// or: list.stream().filter(x -> x % 2 != 0).toList();`,
      },
    },
    {
      id: 416,
      title: "Partition a List by condition",
      problem:
        "Given a List of integers, split it into two lists: even values and odd values.",
      examples: [
        { input: "list = [1,2,3,4,5]", output: "{false=[1,3,5], true=[2,4]}" },
        { input: "list = [2,4]", output: "{true=[2,4], false=[]}" },
      ],
      tip: "partitioningBy is made for two-way boolean grouping.",
      iteration: {
        hint: "Maintain two output lists and choose based on the condition.",
        snippet: `Map<Boolean, List<Integer>> parts = new HashMap<>();
parts.put(true, new ArrayList<>());
parts.put(false, new ArrayList<>());
for (int value : list) parts.get(value % 2 == 0).add(value);
return parts;`,
      },
      recursion: {
        hint: "Add each value to the correct bucket recursively.",
        snippet: `void partition(List<Integer> list, int i, Map<Boolean,List<Integer>> out) {
    if (i == list.size()) return;
    int value = list.get(i);
    out.get(value % 2 == 0).add(value);
    partition(list, i + 1, out);
}`,
      },
      stream: {
        hint: "partitioningBy returns Map<Boolean, List>.",
        snippet: `return list.stream()
    .collect(Collectors.partitioningBy(x -> x % 2 == 0));`,
      },
    },
    {
      id: 417,
      title: "Find common elements with counts using Map",
      problem:
        "Given two Lists, return their multiset intersection, meaning each common value appears min(countA, countB) times.",
      examples: [
        { input: "a = [1,2,2,3], b = [2,2,2,3]", output: "[2,2,3]" },
        { input: "a = [4,4], b = [4]", output: "[4]" },
      ],
      tip: "Count one list, then consume counts while scanning the other.",
      iteration: {
        hint: "Decrement the count only when you emit a value.",
        snippet: `Map<Integer,Integer> counts = new HashMap<>();
for (int value : a) counts.merge(value, 1, Integer::sum);
List<Integer> result = new ArrayList<>();
for (int value : b) {
    int count = counts.getOrDefault(value, 0);
    if (count > 0) {
        result.add(value);
        counts.put(value, count - 1);
    }
}
return result;`,
      },
      recursion: {
        hint: "Recursively scan list B after building counts from list A.",
        snippet: `void common(List<Integer> b, int i, Map<Integer,Integer> counts, List<Integer> out) {
    if (i == b.size()) return;
    int value = b.get(i), count = counts.getOrDefault(value, 0);
    if (count > 0) { out.add(value); counts.put(value, count - 1); }
    common(b, i + 1, counts, out);
}`,
      },
      stream: {
        hint: "Because counts mutate, a loop is clearer than a stream here.",
        snippet: `// Prefer iteration: multiset intersection needs count consumption.
// Streams with mutable maps work but are less readable in interviews.`,
      },
    },
    {
      id: 418,
      title: "Convert List of objects to Map by id",
      problem:
        "Given a List of User objects with unique ids, return a Map from id to User.",
      examples: [
        {
          input: "users = [(1,Ana), (2,Bob)]",
          output: "{1=(1,Ana), 2=(2,Bob)}",
        },
        { input: "users = []", output: "{}" },
      ],
      tip: "Collectors.toMap is concise, but decide how duplicate ids should be handled.",
      iteration: {
        hint: "Put each user by id into a HashMap.",
        snippet: `Map<Integer, User> map = new HashMap<>();
for (User user : users) {
    map.put(user.id(), user);
}
return map;`,
      },
      recursion: {
        hint: "Process one user per recursive call.",
        snippet: `void toMap(List<User> users, int i, Map<Integer,User> out) {
    if (i == users.size()) return;
    out.put(users.get(i).id(), users.get(i));
    toMap(users, i + 1, out);
}`,
      },
      stream: {
        hint: "Use a merge function if duplicate ids are possible.",
        snippet: `return users.stream()
    .collect(Collectors.toMap(User::id, Function.identity(), (first, second) -> first));`,
      },
    },
    {
      id: 419,
      title: "Detect duplicate values in a List using Set",
      problem: "Given a List, return true if any value appears more than once.",
      examples: [
        { input: "list = [1,2,3,1]", output: "true" },
        { input: "list = [1,2,3]", output: "false" },
      ],
      tip: "Set.add returns false when the value is already present.",
      iteration: {
        hint: "Return true on the first failed add.",
        snippet: `Set<Integer> seen = new HashSet<>();
for (int value : list) {
    if (!seen.add(value)) return true;
}
return false;`,
      },
      recursion: {
        hint: "Carry the seen set through recursion.",
        snippet: `boolean hasDuplicate(List<Integer> list, int i, Set<Integer> seen) {
    if (i == list.size()) return false;
    if (!seen.add(list.get(i))) return true;
    return hasDuplicate(list, i + 1, seen);
}`,
      },
      stream: {
        hint: "Compare distinct count with original size.",
        snippet: `return list.stream().distinct().count() < list.size();`,
      },
    },
    {
      id: 420,
      title: "Maintain insertion order and uniqueness",
      problem:
        "Given a sequence of events, return unique events in the order they first appeared.",
      examples: [
        {
          input: "events = [login, view, login, buy]",
          output: "[login, view, buy]",
        },
        { input: "events = [a, a, b]", output: "[a, b]" },
      ],
      tip: "LinkedHashSet is exactly uniqueness plus insertion order.",
      iteration: {
        hint: "Construct a LinkedHashSet, then convert it back to a List.",
        snippet: `Set<String> orderedUnique = new LinkedHashSet<>();
for (String event : events) orderedUnique.add(event);
return new ArrayList<>(orderedUnique);`,
      },
      recursion: {
        hint: "Add each event to the same LinkedHashSet recursively.",
        snippet: `void collect(List<String> events, int i, Set<String> out) {
    if (i == events.size()) return;
    out.add(events.get(i));
    collect(events, i + 1, out);
}`,
      },
      stream: {
        hint: "Collect directly to LinkedHashSet, then List.",
        snippet: `return new ArrayList<>(events.stream()
    .collect(Collectors.toCollection(LinkedHashSet::new)));`,
      },
    },
    {
      id: 421,
      title: "Use TreeMap for floor and ceiling lookups",
      problem:
        "Given sorted key-value data and query keys, return the floor key and ceiling key for each query.",
      examples: [
        {
          input: "keys = [10,20,30], query = 25",
          output: "floor=20, ceiling=30",
        },
        {
          input: "keys = [10,20], query = 5",
          output: "floor=null, ceiling=10",
        },
      ],
      tip: "TreeMap gives floorKey and ceilingKey in O(log n).",
      iteration: {
        hint: "Load keys into TreeMap, then query navigable methods.",
        snippet: `TreeMap<Integer,String> map = new TreeMap<>();
for (int key : keys) map.put(key, "value" + key);
Integer floor = map.floorKey(query);
Integer ceiling = map.ceilingKey(query);`,
      },
      recursion: {
        hint: "If implementing from scratch, recurse in a BST while tracking candidates.",
        snippet: `// TreeMap already implements a balanced tree.
// In a manual BST: go right for floor candidate, left for ceiling candidate.`,
      },
      stream: {
        hint: "Streams can filter keys, but TreeMap is the right data structure.",
        snippet: `Integer floor = keys.stream().filter(k -> k <= query).max(Integer::compareTo).orElse(null);
Integer ceiling = keys.stream().filter(k -> k >= query).min(Integer::compareTo).orElse(null);`,
      },
    },
    {
      id: 422,
      title: "Find missing numbers using List and Set",
      problem:
        "Given a List containing numbers from 1 to n with some missing, return all missing numbers in ascending order.",
      examples: [
        { input: "list = [1,3,3,5], n = 5", output: "[2,4]" },
        { input: "list = [1,2,3], n = 3", output: "[]" },
      ],
      tip: "A HashSet makes presence checks simple; iterate the expected range.",
      iteration: {
        hint: "Add list values to a set, then test every number from 1 to n.",
        snippet: `Set<Integer> present = new HashSet<>(list);
List<Integer> missing = new ArrayList<>();
for (int value = 1; value <= n; value++)
    if (!present.contains(value)) missing.add(value);
return missing;`,
      },
      recursion: {
        hint: "Recurse over the expected number range.",
        snippet: `void missing(int value, int n, Set<Integer> present, List<Integer> out) {
    if (value > n) return;
    if (!present.contains(value)) out.add(value);
    missing(value + 1, n, present, out);
}`,
      },
      stream: {
        hint: "Stream the expected range and filter absent values.",
        snippet: `Set<Integer> present = new HashSet<>(list);
return IntStream.rangeClosed(1, n)
    .filter(value -> !present.contains(value))
    .boxed()
    .collect(Collectors.toList());`,
      },
    },
    {
      id: 423,
      title: "Find most recent value per key",
      problem:
        "Given a List of records (key, value, timestamp), return a Map containing the value from the latest timestamp for each key.",
      examples: [
        { input: "[(a,x,1), (a,y,3), (b,z,2)]", output: "{a=y, b=z}" },
        { input: "[(u,p,5)]", output: "{u=p}" },
      ],
      tip: "Use Map.merge or compare timestamps before replacing the stored record.",
      iteration: {
        hint: "Store the latest Record per key, replacing only when timestamp is newer.",
        snippet: `Map<String, Record> latest = new HashMap<>();
for (Record record : records) {
    latest.merge(record.key(), record,
        (oldValue, newValue) -> newValue.timestamp() > oldValue.timestamp() ? newValue : oldValue);
}
return latest;`,
      },
      recursion: {
        hint: "Process records one by one and merge into the map.",
        snippet: `void latest(List<Record> records, int i, Map<String,Record> map) {
    if (i == records.size()) return;
    Record record = records.get(i);
    map.merge(record.key(), record,
        (a, b) -> b.timestamp() > a.timestamp() ? b : a);
    latest(records, i + 1, map);
}`,
      },
      stream: {
        hint: "toMap with a merge function chooses the newer record.",
        snippet: `return records.stream().collect(Collectors.toMap(
    Record::key,
    Function.identity(),
    (a, b) -> b.timestamp() > a.timestamp() ? b : a));`,
      },
    },
    {
      id: 424,
      title: "Implement LRU cache with LinkedHashMap",
      problem:
        "Design a cache with fixed capacity where get and put are O(1), and the least recently used entry is evicted when capacity is exceeded.",
      examples: [
        {
          input: "cap=2, put(1,1), put(2,2), get(1), put(3,3), get(2)",
          output: "1, -1",
        },
        {
          input: "cap=1, put(1,10), put(2,20), get(1), get(2)",
          output: "-1, 20",
        },
      ],
      tip: "LinkedHashMap access-order mode already maintains LRU order.",
      iteration: {
        hint: "Override removeEldestEntry to evict when size exceeds capacity.",
        snippet: `class LRUCache<K,V> extends LinkedHashMap<K,V> {
    private final int capacity;
    LRUCache(int capacity) {
        super(capacity, 0.75f, true);
        this.capacity = capacity;
    }
    protected boolean removeEldestEntry(Map.Entry<K,V> eldest) {
        return size() > capacity;
    }
}`,
      },
      recursion: {
        hint: "LRU cache operations are stateful and iterative; recursion is not useful here.",
        snippet: `// Use LinkedHashMap for interview clarity.
// Manual recursive traversal would make get/put O(n), losing the cache requirement.`,
      },
      stream: {
        hint: "Streams are for reading snapshots; cache mutation should use Map operations.",
        snippet: `List<K> keysInLruOrder = new ArrayList<>(cache.keySet());`,
      },
    },
    {
      id: 425,
      title: "Find longest consecutive run in List using Set",
      problem:
        "Given an unsorted List of integers, return the length of the longest consecutive sequence of values.",
      examples: [
        { input: "list = [100,4,200,1,3,2]", output: "4" },
        { input: "list = [0,3,7,2,5,8,4,6,0,1]", output: "9" },
      ],
      tip: "Only start counting from numbers that have no predecessor in the set.",
      iteration: {
        hint: "HashSet gives O(1) membership for sequence expansion.",
        snippet: `Set<Integer> set = new HashSet<>(list);
int best = 0;
for (int value : set) {
    if (!set.contains(value - 1)) {
        int cur = value;
        while (set.contains(cur)) cur++;
        best = Math.max(best, cur - value);
    }
}
return best;`,
      },
      recursion: {
        hint: "Recursive expansion can count upward from a sequence start.",
        snippet: `int lengthFrom(int value, Set<Integer> set) {
    if (!set.contains(value)) return 0;
    return 1 + lengthFrom(value + 1, set);
}`,
      },
      stream: {
        hint: "Filter starts, then expand each start; a loop is still clearer for expansion.",
        snippet: `Set<Integer> set = new HashSet<>(list);
return set.stream()
    .filter(x -> !set.contains(x - 1))
    .mapToInt(x -> { int y = x; while (set.contains(y)) y++; return y - x; })
    .max().orElse(0);`,
      },
    },
    {
      id: 426,
      title: "Compare two Maps for same key-value pairs",
      problem:
        "Given two Maps, return true if they contain exactly the same keys mapped to equal values.",
      examples: [
        { input: "a = {x=1, y=2}, b = {y=2, x=1}", output: "true" },
        { input: "a = {x=1}, b = {x=2}", output: "false" },
      ],
      tip: "Map.equals already implements key-value equality independent of iteration order.",
      iteration: {
        hint: "If writing manually, compare sizes, keys, and values with Objects.equals.",
        snippet: `if (a.size() != b.size()) return false;
for (Map.Entry<String,Integer> entry : a.entrySet()) {
    if (!Objects.equals(entry.getValue(), b.get(entry.getKey()))) return false;
}
return true;`,
      },
      recursion: {
        hint: "Recurse through an entry list after size check.",
        snippet: `boolean same(List<Map.Entry<String,Integer>> entries, int i, Map<String,Integer> b) {
    if (i == entries.size()) return true;
    Map.Entry<String,Integer> entry = entries.get(i);
    return Objects.equals(entry.getValue(), b.get(entry.getKey()))
        && same(entries, i + 1, b);
}`,
      },
      stream: {
        hint: "Use allMatch for manual comparison, or simply a.equals(b).",
        snippet: `return a.size() == b.size()
    && a.entrySet().stream()
        .allMatch(e -> Objects.equals(e.getValue(), b.get(e.getKey())));`,
      },
    },
    {
      id: 427,
      title: "Find second largest element in a List",
      problem:
        "Given a List of integers, return the second largest distinct value. Return null if fewer than two distinct values exist.",
      examples: [
        { input: "list = [5, 1, 5, 3, 9]", output: "5" },
        { input: "list = [7, 7]", output: "null" },
      ],
      tip: "Track largest and second largest distinct values in one pass.",
      iteration: {
        hint: "Update first and second only when the value is distinct from first.",
        snippet: `Integer first = null, second = null;
for (int value : list) {
    if (first == null || value > first) { second = first; first = value; }
    else if (value != first && (second == null || value > second)) second = value;
}
return second;`,
      },
      recursion: {
        hint: "Carry first and second through recursive parameters.",
        snippet: `Integer secondLargest(List<Integer> list, int i, Integer first, Integer second) {
    if (i == list.size()) return second;
    int value = list.get(i);
    if (first == null || value > first) return secondLargest(list, i + 1, value, first);
    if (value != first && (second == null || value > second)) second = value;
    return secondLargest(list, i + 1, first, second);
}`,
      },
      stream: {
        hint: "Distinct, sort descending, skip the largest, then take the next.",
        snippet: `return list.stream().distinct()
    .sorted(Comparator.reverseOrder())
    .skip(1)
    .findFirst().orElse(null);`,
      },
    },
    {
      id: 428,
      title: "Move all nulls to the end of a List",
      problem:
        "Given a List that may contain null values, return a List where non-null values keep their relative order and nulls move to the end.",
      examples: [
        {
          input: "list = [A, null, B, null, C]",
          output: "[A, B, C, null, null]",
        },
        { input: "list = [null, X]", output: "[X, null]" },
      ],
      tip: "Stable partitioning preserves the order of non-null elements.",
      iteration: {
        hint: "Write non-null values first, then append the counted nulls.",
        snippet: `List<String> result = new ArrayList<>();
int nulls = 0;
for (String value : list) {
    if (value == null) nulls++;
    else result.add(value);
}
while (nulls-- > 0) result.add(null);
return result;`,
      },
      recursion: {
        hint: "Collect non-null values and count nulls recursively.",
        snippet: `int collect(List<String> list, int i, List<String> out) {
    if (i == list.size()) return 0;
    if (list.get(i) == null) return 1 + collect(list, i + 1, out);
    out.add(list.get(i));
    return collect(list, i + 1, out);
}`,
      },
      stream: {
        hint: "Concatenate non-null stream with null stream.",
        snippet: `long nulls = list.stream().filter(Objects::isNull).count();
return Stream.concat(list.stream().filter(Objects::nonNull),
        Stream.generate(() -> (String) null).limit(nulls))
    .collect(Collectors.toList());`,
      },
    },
    {
      id: 429,
      title: "Find all pairs in a List with target sum",
      problem:
        "Given a List of integers and target, return all unique value pairs whose sum equals target.",
      examples: [
        { input: "list = [1,2,3,4,5], target = 6", output: "[[1,5],[2,4]]" },
        { input: "list = [2,2,2], target = 4", output: "[[2,2]]" },
      ],
      tip: "Use a Set for seen values and a Set of normalized pair keys to avoid duplicates.",
      iteration: {
        hint: "For each value, check whether target - value was seen earlier.",
        snippet: `Set<Integer> seen = new HashSet<>();
Set<String> keys = new HashSet<>();
List<List<Integer>> pairs = new ArrayList<>();
for (int value : list) {
    int other = target - value, a = Math.min(value, other), b = Math.max(value, other);
    if (seen.contains(other) && keys.add(a + ":" + b)) pairs.add(List.of(a, b));
    seen.add(value);
}
return pairs;`,
      },
      recursion: {
        hint: "Recurse through values while carrying seen and emitted keys.",
        snippet: `void pairs(List<Integer> list, int i, int target, Set<Integer> seen,
           Set<String> keys, List<List<Integer>> out) {
    if (i == list.size()) return;
    int value = list.get(i), other = target - value;
    int a = Math.min(value, other), b = Math.max(value, other);
    if (seen.contains(other) && keys.add(a + ":" + b)) out.add(List.of(a, b));
    seen.add(value); pairs(list, i + 1, target, seen, keys, out);
}`,
      },
      stream: {
        hint: "Pair generation is stateful; iteration is clearer for interviews.",
        snippet: `// Prefer the HashSet loop to avoid O(n^2) nested stream pairs.`,
      },
    },
    {
      id: 430,
      title: "Reverse a subList range in an ArrayList",
      problem:
        "Given an ArrayList and indexes left and right, reverse only that inclusive range in place.",
      examples: [
        {
          input: "list = [1,2,3,4,5], left = 1, right = 3",
          output: "[1,4,3,2,5]",
        },
        { input: "list = [A,B], left = 0, right = 1", output: "[B,A]" },
      ],
      tip: "Collections.reverse works directly on a subList view.",
      iteration: {
        hint: "Use two pointers and Collections.swap.",
        snippet: `while (left < right) {
    Collections.swap(list, left++, right--);
}
return list;`,
      },
      recursion: {
        hint: "Swap boundaries, then recurse inward.",
        snippet: `void reverseRange(List<Integer> list, int left, int right) {
    if (left >= right) return;
    Collections.swap(list, left, right);
    reverseRange(list, left + 1, right - 1);
}`,
      },
      stream: {
        hint: "Use the library method on the subList view.",
        snippet: `Collections.reverse(list.subList(left, right + 1));
return list;`,
      },
    },
    {
      id: 431,
      title: "Remove duplicates from sorted List allowing at most two",
      problem:
        "Given a sorted List, return a List where each distinct value appears at most two times.",
      examples: [
        { input: "list = [1,1,1,2,2,3]", output: "[1,1,2,2,3]" },
        { input: "list = [0,0,0,0]", output: "[0,0]" },
      ],
      tip: "For sorted data, compare with the element two write positions behind.",
      iteration: {
        hint: "Append if the output has fewer than two values or current differs from out[size-2].",
        snippet: `List<Integer> out = new ArrayList<>();
for (int value : list) {
    if (out.size() < 2 || value != out.get(out.size() - 2)) out.add(value);
}
return out;`,
      },
      recursion: {
        hint: "Carry the output list and apply the same two-behind rule.",
        snippet: `void keepTwo(List<Integer> list, int i, List<Integer> out) {
    if (i == list.size()) return;
    int value = list.get(i);
    if (out.size() < 2 || value != out.get(out.size() - 2)) out.add(value);
    keepTwo(list, i + 1, out);
}`,
      },
      stream: {
        hint: "Stateful duplicate limits are clearer with iteration than streams.",
        snippet: `// Use the output-list loop; stream distinct() cannot keep two copies.`,
      },
    },
    {
      id: 432,
      title: "Find longest increasing contiguous segment in List",
      problem:
        "Given a List of integers, return the longest contiguous segment where each value is greater than the previous value.",
      examples: [
        { input: "list = [1,2,3,1,2]", output: "[1,2,3]" },
        { input: "list = [5,4,3]", output: "[5]" },
      ],
      tip: "Track current segment start and best segment boundaries.",
      iteration: {
        hint: "Restart current segment when the increasing condition breaks.",
        snippet: `int start = 0, bestStart = 0, bestLen = list.isEmpty() ? 0 : 1;
for (int i = 1; i < list.size(); i++) {
    if (list.get(i) <= list.get(i - 1)) start = i;
    if (i - start + 1 > bestLen) { bestLen = i - start + 1; bestStart = start; }
}
return new ArrayList<>(list.subList(bestStart, bestStart + bestLen));`,
      },
      recursion: {
        hint: "Carry current start and best boundaries through the index.",
        snippet: `// Recursively compare list[i] with list[i-1], update current start and best length.`,
      },
      stream: {
        hint: "Contiguous state makes a loop the cleanest solution.",
        snippet: `// Streams are not ideal for longest contiguous segment problems.`,
      },
    },
    {
      id: 433,
      title: "Find median of an ArrayList",
      problem:
        "Given an ArrayList of integers, return its median value as a double.",
      examples: [
        { input: "list = [3,1,2]", output: "2.0" },
        { input: "list = [4,1,2,3]", output: "2.5" },
      ],
      tip: "Sort a copy so the original list is not mutated unless mutation is allowed.",
      iteration: {
        hint: "Sort, then handle odd and even sizes separately.",
        snippet: `List<Integer> copy = new ArrayList<>(list);
Collections.sort(copy);
int n = copy.size();
return n % 2 == 1 ? copy.get(n / 2)
    : (copy.get(n / 2 - 1) + copy.get(n / 2)) / 2.0;`,
      },
      recursion: {
        hint: "Median needs ordering; recursion does not help after sorting.",
        snippet: `// Sort first, then read middle element(s).`,
      },
      stream: {
        hint: "Create a sorted List from the stream, then read middle.",
        snippet: `List<Integer> sorted = list.stream().sorted().collect(Collectors.toList());
int n = sorted.size();
return n % 2 == 1 ? sorted.get(n / 2)
    : (sorted.get(n / 2 - 1) + sorted.get(n / 2)) / 2.0;`,
      },
    },
    {
      id: 434,
      title: "Binary search insert position in sorted List",
      problem:
        "Given a sorted List and target, return the index where target exists or should be inserted to keep the List sorted.",
      examples: [
        { input: "list = [1,3,5,6], target = 5", output: "2" },
        { input: "list = [1,3,5,6], target = 2", output: "1" },
      ],
      tip: "This is lower_bound: first index whose value is greater than or equal to target.",
      iteration: {
        hint: "Move left/right until left is the insertion point.",
        snippet: `int left = 0, right = list.size();
while (left < right) {
    int mid = left + (right - left) / 2;
    if (list.get(mid) < target) left = mid + 1;
    else right = mid;
}
return left;`,
      },
      recursion: {
        hint: "Recursive lower_bound keeps the half-open [left,right) range.",
        snippet: `int lowerBound(List<Integer> list, int target, int left, int right) {
    if (left >= right) return left;
    int mid = left + (right - left) / 2;
    return list.get(mid) < target
        ? lowerBound(list, target, mid + 1, right)
        : lowerBound(list, target, left, mid);
}`,
      },
      stream: {
        hint: "Use Collections.binarySearch and decode the negative insertion point.",
        snippet: `int pos = Collections.binarySearch(list, target);
return pos >= 0 ? pos : -pos - 1;`,
      },
    },
    {
      id: 435,
      title: "Find all duplicate values in List",
      problem:
        "Given a List, return all values that appear more than once, each duplicate value returned once in first duplicate detection order.",
      examples: [
        { input: "list = [1,2,3,2,4,1]", output: "[2,1]" },
        { input: "list = [5,6]", output: "[]" },
      ],
      tip: "Use one Set for seen values and another ordered Set for duplicates.",
      iteration: {
        hint: "When add to seen fails, add to duplicates.",
        snippet: `Set<Integer> seen = new HashSet<>();
Set<Integer> dupes = new LinkedHashSet<>();
for (int value : list)
    if (!seen.add(value)) dupes.add(value);
return new ArrayList<>(dupes);`,
      },
      recursion: {
        hint: "Carry both sets recursively.",
        snippet: `void duplicates(List<Integer> list, int i, Set<Integer> seen, Set<Integer> dupes) {
    if (i == list.size()) return;
    if (!seen.add(list.get(i))) dupes.add(list.get(i));
    duplicates(list, i + 1, seen, dupes);
}`,
      },
      stream: {
        hint: "A stateful filter with sets can be used but is less pure.",
        snippet: `Set<Integer> seen = new HashSet<>(), dupes = new LinkedHashSet<>();
list.forEach(x -> { if (!seen.add(x)) dupes.add(x); });
return new ArrayList<>(dupes);`,
      },
    },
    {
      id: 436,
      title: "Convert List to comma-separated String",
      problem:
        "Given a List of strings, return one comma-separated string, skipping null or blank values.",
      examples: [
        { input: "list = [Ana, , Bob, null]", output: "Ana,Bob" },
        { input: "list = [x, y]", output: "x,y" },
      ],
      tip: "Filter before joining; Collectors.joining handles separators cleanly.",
      iteration: {
        hint: "Append separators only after the first accepted value.",
        snippet: `StringBuilder sb = new StringBuilder();
for (String value : list) {
    if (value == null || value.isBlank()) continue;
    if (sb.length() > 0) sb.append(',');
    sb.append(value);
}
return sb.toString();`,
      },
      recursion: {
        hint: "Carry StringBuilder and append valid values recursively.",
        snippet: `void join(List<String> list, int i, StringBuilder sb) {
    if (i == list.size()) return;
    String value = list.get(i);
    if (value != null && !value.isBlank()) {
        if (sb.length() > 0) sb.append(',');
        sb.append(value);
    }
    join(list, i + 1, sb);
}`,
      },
      stream: {
        hint: "Filter null and blank values, then joining comma.",
        snippet: `return list.stream()
    .filter(Objects::nonNull)
    .filter(s -> !s.isBlank())
    .collect(Collectors.joining(","));`,
      },
    },
    {
      id: 437,
      title: "Find keys with maximum value in Map",
      problem:
        "Given a Map from key to integer value, return all keys whose value equals the maximum value.",
      examples: [
        { input: "map = {A=10, B=20, C=20}", output: "[B,C]" },
        { input: "map = {x=1}", output: "[x]" },
      ],
      tip: "Find the max value first, then collect all matching keys.",
      iteration: {
        hint: "Two passes keep the code simple and readable.",
        snippet: `int max = Collections.max(map.values());
List<String> keys = new ArrayList<>();
for (Map.Entry<String,Integer> entry : map.entrySet())
    if (entry.getValue() == max) keys.add(entry.getKey());
return keys;`,
      },
      recursion: {
        hint: "Recurse through entries after max is known.",
        snippet: `void maxKeys(List<Map.Entry<String,Integer>> entries, int i, int max, List<String> out) {
    if (i == entries.size()) return;
    if (entries.get(i).getValue() == max) out.add(entries.get(i).getKey());
    maxKeys(entries, i + 1, max, out);
}`,
      },
      stream: {
        hint: "Use max over values, then filter entries.",
        snippet: `int max = map.values().stream().mapToInt(Integer::intValue).max().orElseThrow();
return map.entrySet().stream()
    .filter(e -> e.getValue() == max)
    .map(Map.Entry::getKey)
    .collect(Collectors.toList());`,
      },
    },
    {
      id: 438,
      title: "Find missing keys between two Maps",
      problem:
        "Given two Maps, return keys present in the first Map but absent in the second Map.",
      examples: [
        { input: "a = {x=1, y=2}, b = {y=9}", output: "[x]" },
        { input: "a = {a=1}, b = {a=2}", output: "[]" },
      ],
      tip: "Operate on keySet views; no need to inspect values.",
      iteration: {
        hint: "Loop over keys from the first map and check second containsKey.",
        snippet: `List<String> missing = new ArrayList<>();
for (String key : a.keySet())
    if (!b.containsKey(key)) missing.add(key);
return missing;`,
      },
      recursion: {
        hint: "Recurse through a copied key list.",
        snippet: `void missingKeys(List<String> keys, int i, Map<String,Integer> b, List<String> out) {
    if (i == keys.size()) return;
    if (!b.containsKey(keys.get(i))) out.add(keys.get(i));
    missingKeys(keys, i + 1, b, out);
}`,
      },
      stream: {
        hint: "Filter first keySet by absence in second map.",
        snippet: `return a.keySet().stream()
    .filter(key -> !b.containsKey(key))
    .collect(Collectors.toList());`,
      },
    },
    {
      id: 439,
      title: "Filter Map by value threshold",
      problem:
        "Given a Map from name to score and a threshold, return a Map containing only entries whose score is at least the threshold.",
      examples: [
        { input: "scores = {A=90, B=60}, threshold = 70", output: "{A=90}" },
        { input: "scores = {X=10}, threshold = 5", output: "{X=10}" },
      ],
      tip: "Filter entries, then collect them back to a Map.",
      iteration: {
        hint: "Copy only matching entries into a new map.",
        snippet: `Map<String,Integer> result = new LinkedHashMap<>();
for (Map.Entry<String,Integer> entry : scores.entrySet())
    if (entry.getValue() >= threshold) result.put(entry.getKey(), entry.getValue());
return result;`,
      },
      recursion: {
        hint: "Recurse through entries and put matching entries.",
        snippet: `void filter(List<Map.Entry<String,Integer>> entries, int i, int threshold, Map<String,Integer> out) {
    if (i == entries.size()) return;
    Map.Entry<String,Integer> e = entries.get(i);
    if (e.getValue() >= threshold) out.put(e.getKey(), e.getValue());
    filter(entries, i + 1, threshold, out);
}`,
      },
      stream: {
        hint: "toMap needs key and value extractors.",
        snippet: `return scores.entrySet().stream()
    .filter(e -> e.getValue() >= threshold)
    .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue,
        (a, b) -> a, LinkedHashMap::new));`,
      },
    },
    {
      id: 440,
      title: "Count word frequency case-insensitively",
      problem:
        "Given a sentence, return a Map of lowercase words to their frequency counts, ignoring punctuation.",
      examples: [
        { input: 's = "Java java! Map"', output: "{java=2, map=1}" },
        { input: 's = "Hi, hi"', output: "{hi=2}" },
      ],
      tip: "Normalize before counting: lowercase, remove punctuation, split whitespace.",
      iteration: {
        hint: "Clean each token and merge into the map.",
        snippet: `Map<String,Integer> freq = new HashMap<>();
for (String token : s.toLowerCase().split("\\s+")) {
    String word = token.replaceAll("[^a-z0-9]", "");
    if (!word.isEmpty()) freq.merge(word, 1, Integer::sum);
}
return freq;`,
      },
      recursion: {
        hint: "Recurse through normalized tokens.",
        snippet: `void countWords(String[] words, int i, Map<String,Integer> freq) {
    if (i == words.length) return;
    if (!words[i].isBlank()) freq.merge(words[i], 1, Integer::sum);
    countWords(words, i + 1, freq);
}`,
      },
      stream: {
        hint: "Stream tokens and group by cleaned lowercase word.",
        snippet: `return Arrays.stream(s.toLowerCase().split("\\s+"))
    .map(w -> w.replaceAll("[^a-z0-9]", ""))
    .filter(w -> !w.isEmpty())
    .collect(Collectors.groupingBy(w -> w, Collectors.counting()));`,
      },
    },
    {
      id: 441,
      title: "Build nested Map grouping by two fields",
      problem:
        "Given employees with department and role, return a nested Map department -> role -> employee names.",
      examples: [
        {
          input: "[(Ana,IT,Dev), (Bob,IT,QA)]",
          output: "{IT={Dev=[Ana], QA=[Bob]}}",
        },
        { input: "[(Eve,HR,Mgr)]", output: "{HR={Mgr=[Eve]}}" },
      ],
      tip: "Nested groupingBy creates nested Maps directly.",
      iteration: {
        hint: "Use computeIfAbsent twice to create nested buckets.",
        snippet: `Map<String, Map<String, List<String>>> result = new HashMap<>();
for (Employee e : employees) {
    result.computeIfAbsent(e.dept(), d -> new HashMap<>())
        .computeIfAbsent(e.role(), r -> new ArrayList<>())
        .add(e.name());
}
return result;`,
      },
      recursion: {
        hint: "Process one employee per recursive call.",
        snippet: `// Same computeIfAbsent logic, called recursively for employees[i].`,
      },
      stream: {
        hint: "Use groupingBy inside groupingBy, mapping employee name at the leaf.",
        snippet: `return employees.stream().collect(Collectors.groupingBy(Employee::dept,
    Collectors.groupingBy(Employee::role,
        Collectors.mapping(Employee::name, Collectors.toList()))));`,
      },
    },
    {
      id: 442,
      title: "Implement getOrDefault manually",
      problem:
        "Given a Map, key, and default value, return the mapped value when key exists; otherwise return the default.",
      examples: [
        { input: "map = {a=1}, key = a, default = 0", output: "1" },
        { input: "map = {a=1}, key = b, default = 0", output: "0" },
      ],
      tip: "containsKey matters when a key exists with a null value.",
      iteration: {
        hint: "Check containsKey before get if null values are possible.",
        snippet: `return map.containsKey(key) ? map.get(key) : defaultValue;`,
      },
      recursion: {
        hint: "Map lookup is direct; recursion is unnecessary.",
        snippet: `// O(1) hash lookup is the point of Map here.`,
      },
      stream: {
        hint: "Use the built-in method in real code.",
        snippet: `return map.getOrDefault(key, defaultValue);`,
      },
    },
    {
      id: 443,
      title: "Detect conflicting values for same key",
      problem:
        "Given records with key and value, return true if the same key appears with two different values.",
      examples: [
        { input: "[(a,1), (a,1), (b,2)]", output: "false" },
        { input: "[(a,1), (a,9)]", output: "true" },
      ],
      tip: "A Map can remember the first value per key; compare later values against it.",
      iteration: {
        hint: "If key already exists and value differs, conflict is found.",
        snippet: `Map<String,String> first = new HashMap<>();
for (Record r : records) {
    if (first.containsKey(r.key()) && !Objects.equals(first.get(r.key()), r.value())) return true;
    first.putIfAbsent(r.key(), r.value());
}
return false;`,
      },
      recursion: {
        hint: "Carry the first-value map through recursion.",
        snippet: `boolean conflict(List<Record> records, int i, Map<String,String> first) {
    if (i == records.size()) return false;
    Record r = records.get(i);
    if (first.containsKey(r.key()) && !Objects.equals(first.get(r.key()), r.value())) return true;
    first.putIfAbsent(r.key(), r.value());
    return conflict(records, i + 1, first);
}`,
      },
      stream: {
        hint: "Stateful conflict detection is clearer with a loop.",
        snippet: `// Prefer Map + loop; stream collectors hide the early-exit conflict check.`,
      },
    },
    {
      id: 444,
      title: "Find first key by insertion order in LinkedHashMap",
      problem:
        "Given a LinkedHashMap, return the first inserted key, or null if the map is empty.",
      examples: [
        { input: "map = {a=1, b=2}", output: "a" },
        { input: "map = {}", output: "null" },
      ],
      tip: "LinkedHashMap preserves insertion order during keySet iteration.",
      iteration: {
        hint: "Read the first key from keySet iterator.",
        snippet: `Iterator<String> it = map.keySet().iterator();
return it.hasNext() ? it.next() : null;`,
      },
      recursion: {
        hint: "No recursion needed; the iterator already exposes the first element.",
        snippet: `// keySet().iterator().next() is O(1) for non-empty LinkedHashMap.`,
      },
      stream: {
        hint: "findFirst respects encounter order.",
        snippet: `return map.keySet().stream().findFirst().orElse(null);`,
      },
    },
    {
      id: 445,
      title: "Find last key by insertion order in LinkedHashMap",
      problem:
        "Given a LinkedHashMap, return the most recently inserted key, or null if the map is empty.",
      examples: [
        { input: "map = {a=1, b=2, c=3}", output: "c" },
        { input: "map = {}", output: "null" },
      ],
      tip: "LinkedHashMap has no direct lastKey method; iterate or keep an external last key.",
      iteration: {
        hint: "Walk keys and keep replacing last.",
        snippet: `String last = null;
for (String key : map.keySet()) last = key;
return last;`,
      },
      recursion: {
        hint: "Recurse through a key list and return the final element.",
        snippet: `String last(List<String> keys, int i) {
    if (keys.isEmpty()) return null;
    if (i == keys.size() - 1) return keys.get(i);
    return last(keys, i + 1);
}`,
      },
      stream: {
        hint: "Reduce keeps the later key each time.",
        snippet: `return map.keySet().stream().reduce((first, second) -> second).orElse(null);`,
      },
    },
    {
      id: 446,
      title: "Use TreeMap for range query",
      problem:
        "Given a TreeMap and low/high keys, return all entries whose keys are in the inclusive range.",
      examples: [
        {
          input: "map keys = [10,20,30], low=15, high=30",
          output: "{20=..., 30=...}",
        },
        { input: "map keys = [1,5], low=2, high=4", output: "{}" },
      ],
      tip: "subMap gives a live range view in O(log n + range size).",
      iteration: {
        hint: "Use NavigableMap.subMap with inclusive flags.",
        snippet: `NavigableMap<Integer,String> range = map.subMap(low, true, high, true);
return new TreeMap<>(range);`,
      },
      recursion: {
        hint: "Manual BST recursion would prune left/right by range boundaries.",
        snippet: `// TreeMap already provides the balanced-tree range operation.`,
      },
      stream: {
        hint: "Stream filtering works but loses TreeMap range efficiency.",
        snippet: `return map.entrySet().stream()
    .filter(e -> e.getKey() >= low && e.getKey() <= high)
    .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));`,
      },
    },
    {
      id: 447,
      title: "Find top scorer per department with Map merge",
      problem:
        "Given employees with department and score, return a Map from each department to the employee with the highest score.",
      examples: [
        {
          input: "[(Ana,IT,90), (Bob,IT,95), (Eve,HR,80)]",
          output: "{IT=Bob, HR=Eve}",
        },
        { input: "[(A,QA,10)]", output: "{QA=A}" },
      ],
      tip: "Map.merge can compare the existing best with the new candidate.",
      iteration: {
        hint: "Merge each employee into its department bucket.",
        snippet: `Map<String, Employee> best = new HashMap<>();
for (Employee e : employees) {
    best.merge(e.dept(), e, (a, b) -> b.score() > a.score() ? b : a);
}
return best;`,
      },
      recursion: {
        hint: "Process one employee per recursive call and merge.",
        snippet: `void bestByDept(List<Employee> employees, int i, Map<String,Employee> best) {
    if (i == employees.size()) return;
    Employee e = employees.get(i);
    best.merge(e.dept(), e, (a, b) -> b.score() > a.score() ? b : a);
    bestByDept(employees, i + 1, best);
}`,
      },
      stream: {
        hint: "toMap merge function keeps the higher score.",
        snippet: `return employees.stream().collect(Collectors.toMap(
    Employee::dept,
    Function.identity(),
    (a, b) -> b.score() > a.score() ? b : a));`,
      },
    },
    {
      id: 448,
      title: "Find duplicate keys while building a Map",
      problem:
        "Given records with ids, return the ids that appear more than once.",
      examples: [
        { input: "records = [(1,A), (2,B), (1,C)]", output: "[1]" },
        { input: "records = [(7,X)]", output: "[]" },
      ],
      tip: "Track ids seen once and ids already known to be duplicates.",
      iteration: {
        hint: "Use two sets so each duplicate id is returned once.",
        snippet: `Set<Integer> seen = new HashSet<>();
Set<Integer> duplicateIds = new LinkedHashSet<>();
for (Record r : records)
    if (!seen.add(r.id())) duplicateIds.add(r.id());
return new ArrayList<>(duplicateIds);`,
      },
      recursion: {
        hint: "Carry seen and duplicates through recursive processing.",
        snippet: `void duplicateIds(List<Record> records, int i, Set<Integer> seen, Set<Integer> dupes) {
    if (i == records.size()) return;
    if (!seen.add(records.get(i).id())) dupes.add(records.get(i).id());
    duplicateIds(records, i + 1, seen, dupes);
}`,
      },
      stream: {
        hint: "Use a stateful set filter for concise interview code.",
        snippet: `Set<Integer> seen = new HashSet<>();
return records.stream().map(Record::id)
    .filter(id -> !seen.add(id))
    .distinct()
    .collect(Collectors.toList());`,
      },
    },
    {
      id: 449,
      title: "Build bidirectional Map safely",
      problem:
        "Given unique username-userId pairs, build two maps: username to id and id to username. Reject input if either side has duplicates.",
      examples: [
        { input: "[(ana,1), (bob,2)]", output: "two maps built" },
        { input: "[(ana,1), (ana,2)]", output: "duplicate username error" },
      ],
      tip: "Bidirectional maps require uniqueness on both keys and values.",
      iteration: {
        hint: "Check both maps before inserting a pair.",
        snippet: `Map<String,Integer> nameToId = new HashMap<>();
Map<Integer,String> idToName = new HashMap<>();
for (User u : users) {
    if (nameToId.containsKey(u.name()) || idToName.containsKey(u.id()))
        throw new IllegalArgumentException("duplicate");
    nameToId.put(u.name(), u.id());
    idToName.put(u.id(), u.name());
}`,
      },
      recursion: {
        hint: "Validate and insert one user per recursive call.",
        snippet: `// Same duplicate checks, then recurse to the next user.`,
      },
      stream: {
        hint: "Streams are not ideal because you need to build two maps and validate duplicates.",
        snippet: `// Prefer explicit loop for clear validation and error handling.`,
      },
    },
    {
      id: 450,
      title: "Implement frequency stack with Map and stacks",
      problem:
        "Design a stack-like structure where pop returns the most frequent element, breaking ties by most recently pushed.",
      examples: [
        { input: "push 5,7,5,7,4,5; pop", output: "5" },
        { input: "then pop again", output: "7" },
      ],
      tip: "Keep value->frequency and frequency->stack of values; maxFreq points to the current top bucket.",
      iteration: {
        hint: "Push increments frequency and adds value to that frequency stack.",
        snippet: `Map<Integer,Integer> freq = new HashMap<>();
Map<Integer,Deque<Integer>> groups = new HashMap<>();
int maxFreq = 0;
void push(int x) {
    int f = freq.merge(x, 1, Integer::sum);
    maxFreq = Math.max(maxFreq, f);
    groups.computeIfAbsent(f, k -> new ArrayDeque<>()).push(x);
}`,
      },
      recursion: {
        hint: "This is a mutable data-structure design; recursion is not helpful.",
        snippet: `// Use maps plus stacks for O(1) push/pop.`,
      },
      stream: {
        hint: "Streams are not suitable for stack mutation semantics.",
        snippet: `// Data structure operations should be direct Map/Deque operations.`,
      },
    },
    {
      id: 451,
      title: "Find majority element using Map counts",
      problem:
        "Given a List of integers, return the value appearing more than n/2 times, or null if no majority exists.",
      examples: [
        { input: "list = [2,2,1,2]", output: "2" },
        { input: "list = [1,2,3]", output: "null" },
      ],
      tip: "Counting with Map is straightforward; Boyer-Moore is the O(1) space upgrade.",
      iteration: {
        hint: "Return as soon as a count crosses n/2.",
        snippet: `Map<Integer,Integer> counts = new HashMap<>();
for (int value : list) {
    int count = counts.merge(value, 1, Integer::sum);
    if (count > list.size() / 2) return value;
}
return null;`,
      },
      recursion: {
        hint: "Recurse while updating counts.",
        snippet: `Integer majority(List<Integer> list, int i, Map<Integer,Integer> counts) {
    if (i == list.size()) return null;
    int value = list.get(i), count = counts.merge(value, 1, Integer::sum);
    return count > list.size() / 2 ? value : majority(list, i + 1, counts);
}`,
      },
      stream: {
        hint: "Group by value and find an entry above n/2.",
        snippet: `return list.stream().collect(Collectors.groupingBy(x -> x, Collectors.counting()))
    .entrySet().stream()
    .filter(e -> e.getValue() > list.size() / 2)
    .map(Map.Entry::getKey)
    .findFirst().orElse(null);`,
      },
    },
    {
      id: 452,
      title: "Find common keys with different values",
      problem:
        "Given two Maps, return keys that exist in both maps but are mapped to different values.",
      examples: [
        { input: "a = {x=1, y=2}, b = {x=9, y=2}", output: "[x]" },
        { input: "a = {a=1}, b = {b=1}", output: "[]" },
      ],
      tip: "Check containsKey first, then compare values with Objects.equals.",
      iteration: {
        hint: "Scan the smaller keySet if optimizing.",
        snippet: `List<String> diff = new ArrayList<>();
for (String key : a.keySet())
    if (b.containsKey(key) && !Objects.equals(a.get(key), b.get(key))) diff.add(key);
return diff;`,
      },
      recursion: {
        hint: "Recurse through keys from one map.",
        snippet: `void changed(List<String> keys, int i, Map<String,Integer> a, Map<String,Integer> b, List<String> out) {
    if (i == keys.size()) return;
    String key = keys.get(i);
    if (b.containsKey(key) && !Objects.equals(a.get(key), b.get(key))) out.add(key);
    changed(keys, i + 1, a, b, out);
}`,
      },
      stream: {
        hint: "Filter common keys whose values differ.",
        snippet: `return a.keySet().stream()
    .filter(key -> b.containsKey(key))
    .filter(key -> !Objects.equals(a.get(key), b.get(key)))
    .collect(Collectors.toList());`,
      },
    },
    {
      id: 453,
      title: "Create ordered frequency report with LinkedHashMap",
      problem:
        "Given a List of values, return a LinkedHashMap of frequencies in first-seen order.",
      examples: [
        { input: "list = [b, a, b, c, a]", output: "{b=2, a=2, c=1}" },
        { input: "list = [x]", output: "{x=1}" },
      ],
      tip: "LinkedHashMap preserves first insertion order while values are updated.",
      iteration: {
        hint: "Use merge on a LinkedHashMap.",
        snippet: `Map<String,Integer> freq = new LinkedHashMap<>();
for (String value : list) freq.merge(value, 1, Integer::sum);
return freq;`,
      },
      recursion: {
        hint: "Recursive count updates the same LinkedHashMap.",
        snippet: `void orderedCount(List<String> list, int i, Map<String,Integer> freq) {
    if (i == list.size()) return;
    freq.merge(list.get(i), 1, Integer::sum);
    orderedCount(list, i + 1, freq);
}`,
      },
      stream: {
        hint: "Pass LinkedHashMap::new as the map supplier.",
        snippet: `return list.stream().collect(Collectors.groupingBy(
    x -> x, LinkedHashMap::new, Collectors.summingInt(x -> 1)));`,
      },
    },
    {
      id: 454,
      title: "Find smallest missing positive using Set",
      problem:
        "Given a List of integers, return the smallest positive integer not present in the list.",
      examples: [
        { input: "list = [1,2,0]", output: "3" },
        { input: "list = [3,4,-1,1]", output: "2" },
      ],
      tip: "Only positive values matter; check from 1 upward.",
      iteration: {
        hint: "Build a HashSet, then scan candidate positives.",
        snippet: `Set<Integer> set = new HashSet<>(list);
for (int candidate = 1; ; candidate++)
    if (!set.contains(candidate)) return candidate;`,
      },
      recursion: {
        hint: "Recurse on candidate until it is absent.",
        snippet: `int missing(int candidate, Set<Integer> set) {
    return set.contains(candidate) ? missing(candidate + 1, set) : candidate;
}`,
      },
      stream: {
        hint: "Use IntStream.iterate and findFirst.",
        snippet: `Set<Integer> set = new HashSet<>(list);
return IntStream.iterate(1, i -> i + 1)
    .filter(i -> !set.contains(i))
    .findFirst().getAsInt();`,
      },
    },
    {
      id: 455,
      title: "Map each word to its length preserving order",
      problem:
        "Given a List of words, return a LinkedHashMap from each word to its length, preserving first-seen order.",
      examples: [
        { input: "words = [java, map, java]", output: "{java=4, map=3}" },
        { input: "words = [a, abc]", output: "{a=1, abc=3}" },
      ],
      tip: "Use putIfAbsent if repeated words should keep the first entry only.",
      iteration: {
        hint: "Insert each word only if absent.",
        snippet: `Map<String,Integer> lengths = new LinkedHashMap<>();
for (String word : words) lengths.putIfAbsent(word, word.length());
return lengths;`,
      },
      recursion: {
        hint: "Process one word per recursive call.",
        snippet: `void lengths(List<String> words, int i, Map<String,Integer> out) {
    if (i == words.size()) return;
    out.putIfAbsent(words.get(i), words.get(i).length());
    lengths(words, i + 1, out);
}`,
      },
      stream: {
        hint: "Use toMap with LinkedHashMap supplier and keep first value on duplicates.",
        snippet: `return words.stream().collect(Collectors.toMap(
    Function.identity(), String::length, (a, b) -> a, LinkedHashMap::new));`,
      },
    },
    {
      id: 456,
      title: "Find least frequent values using Map",
      problem:
        "Given a List of integers, return all values with the minimum frequency, preserving first-seen order.",
      examples: [
        { input: "list = [4,5,4,6,5,7]", output: "[6,7]" },
        { input: "list = [1,1,2]", output: "[2]" },
      ],
      tip: "Use LinkedHashMap for ordered counts, then filter by the minimum count.",
      iteration: {
        hint: "Count first, compute min, then collect matching keys.",
        snippet: `Map<Integer,Integer> freq = new LinkedHashMap<>();
for (int value : list) freq.merge(value, 1, Integer::sum);
int min = Collections.min(freq.values());
List<Integer> result = new ArrayList<>();
for (Map.Entry<Integer,Integer> e : freq.entrySet())
    if (e.getValue() == min) result.add(e.getKey());
return result;`,
      },
      recursion: {
        hint: "After counting, recurse through ordered entries to collect min-frequency keys.",
        snippet: `void collectMin(List<Map.Entry<Integer,Integer>> entries, int i, int min, List<Integer> out) {
    if (i == entries.size()) return;
    if (entries.get(i).getValue() == min) out.add(entries.get(i).getKey());
    collectMin(entries, i + 1, min, out);
}`,
      },
      stream: {
        hint: "Filter entries whose value equals the minimum count.",
        snippet: `Map<Integer,Integer> freq = new LinkedHashMap<>();
list.forEach(x -> freq.merge(x, 1, Integer::sum));
int min = Collections.min(freq.values());
return freq.entrySet().stream()
    .filter(e -> e.getValue() == min)
    .map(Map.Entry::getKey)
    .collect(Collectors.toList());`,
      },
    },
  ],
};
