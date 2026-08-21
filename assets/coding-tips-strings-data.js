window.CT_STRINGS = {
  topic: "Strings",
  icon: "🔤",
  range: "1–55",
  questions: [
    {
      id: 1,
      title: "Reverse a string",
      problem:
        "Given a string s, return a new string with the characters in reverse order.",
      examples: [
        { input: 's = "hello"', output: '"olleh"' },
        { input: 's = "Java"', output: '"avaJ"' },
      ],
      tip: "Two-pointer swap from both ends in O(n), or StringBuilder.reverse()",
      iteration: {
        hint: "Swap chars from both ends moving inward until pointers meet",
        snippet: `char[] c = s.toCharArray();
int l = 0, r = c.length - 1;
while (l < r) { char t = c[l]; c[l++] = c[r]; c[r--] = t; }
return new String(c);`,
      },
      recursion: {
        hint: "Base: length <= 1 returns self. Recursive: reverse(tail) + head char",
        snippet: `String rev(String s) {
    if (s.length() <= 1) return s;
    return rev(s.substring(1)) + s.charAt(0);
}`,
      },
      stream: {
        hint: "Map indices in reverse order to chars, collect into string",
        snippet: `IntStream.range(0, s.length())
    .map(i -> s.charAt(s.length() - 1 - i))
    .collect(StringBuilder::new,
             (sb, c) -> sb.append((char) c), StringBuilder::append)
    .toString();`,
      },
    },
    {
      id: 2,
      title: "Palindrome check",
      problem:
        "Given a string s, return true if it reads the same forward and backward; otherwise return false.",
      examples: [
        { input: 's = "madam"', output: "true" },
        { input: 's = "hello"', output: "false" },
      ],
      tip: "Two pointers from both ends; skip non-alphanumerics for real-world input",
      iteration: {
        hint: "Compare chars at l and r, advance inward; stop if mismatch",
        snippet: `int l = 0, r = s.length() - 1;
while (l < r) {
    if (s.charAt(l++) != s.charAt(r--)) return false;
}
return true;`,
      },
      recursion: {
        hint: "Base: l >= r is true. Recurse only if end chars match",
        snippet: `boolean isPalin(String s, int l, int r) {
    if (l >= r) return true;
    if (s.charAt(l) != s.charAt(r)) return false;
    return isPalin(s, l + 1, r - 1);
}`,
      },
      stream: {
        hint: "Reverse string with StringBuilder and compare with equals",
        snippet: `String rev = new StringBuilder(s).reverse().toString();
return s.equals(rev);`,
      },
    },
    {
      id: 3,
      title: "First non-repeating character",
      problem:
        "Given a string s, return the index of the first character that appears exactly once. Return -1 if every character repeats.",
      examples: [
        { input: 's = "leetcode"', output: "0" },
        { input: 's = "aabb"', output: "-1" },
      ],
      tip: "Single pass builds frequency map; second pass finds first count-1 char",
      iteration: {
        hint: "Count frequencies, then scan again to find first char with count 1",
        snippet: `int[] freq = new int[256];
for (char c : s.toCharArray()) freq[c]++;
for (int i = 0; i < s.length(); i++)
    if (freq[s.charAt(i)] == 1) return i;
return -1;`,
      },
      recursion: {
        hint: "Build freq map, then recurse through indices to find first unique",
        snippet: `int first(String s, int[] freq, int i) {
    if (i == s.length()) return -1;
    if (freq[s.charAt(i)] == 1) return i;
    return first(s, freq, i + 1);
}`,
      },
      stream: {
        hint: "Collect to LinkedHashMap preserving order, find first value == 1",
        snippet: `s.chars()
    .mapToObj(c -> (char) c)
    .collect(java.util.LinkedHashMap::new,
             (m, c) -> m.merge(c, 1, Integer::sum), java.util.Map::putAll)
    .entrySet().stream()
    .filter(e -> e.getValue() == 1)
    .findFirst().map(e -> s.indexOf(e.getKey())).orElse(-1);`,
      },
    },
    {
      id: 4,
      title: "Check anagram",
      problem:
        "Given two strings s1 and s2, return true if they contain the same characters with the same frequencies; otherwise return false.",
      examples: [
        { input: 's1 = "listen", s2 = "silent"', output: "true" },
        { input: 's1 = "rat", s2 = "car"', output: "false" },
      ],
      tip: "Sort both strings and compare, or count char frequencies and diff",
      iteration: {
        hint: "Increment freq for s1, decrement for s2; any non-zero means not anagram",
        snippet: `if (s1.length() != s2.length()) return false;
int[] freq = new int[26];
for (int i = 0; i < s1.length(); i++) {
    freq[s1.charAt(i) - 'a']++;
    freq[s2.charAt(i) - 'a']--;
}
for (int f : freq) if (f != 0) return false;
return true;`,
      },
      recursion: {
        hint: "Sort both, then recursively compare char by char",
        snippet: `boolean anagram(char[] a, char[] b, int i) {
    if (i == a.length) return true;
    if (a[i] != b[i]) return false;
    return anagram(a, b, i + 1);
}
// call: Arrays.sort(a); Arrays.sort(b); anagram(a, b, 0);`,
      },
      stream: {
        hint: "Sort chars of each string via streams and compare resulting strings",
        snippet: `String sorted1 = s1.chars().sorted()
    .collect(StringBuilder::new, (sb,c)->sb.append((char)c), StringBuilder::append).toString();
String sorted2 = s2.chars().sorted()
    .collect(StringBuilder::new, (sb,c)->sb.append((char)c), StringBuilder::append).toString();
return sorted1.equals(sorted2);`,
      },
    },
    {
      id: 5,
      title: "Count characters",
      problem:
        "Given a string s, count how many times each character appears and return the frequency mapping.",
      examples: [
        { input: 's = "banana"', output: "{b=1, a=3, n=2}" },
        { input: 's = "abca"', output: "{a=2, b=1, c=1}" },
      ],
      tip: "Use a frequency array of size 256 (ASCII) or a HashMap for Unicode",
      iteration: {
        hint: "Traverse each char and increment its count in a map or array",
        snippet: `Map<Character, Integer> freq = new HashMap<>();
for (char c : s.toCharArray())
    freq.merge(c, 1, Integer::sum);
return freq;`,
      },
      recursion: {
        hint: "Add current char to map, recurse on rest of string",
        snippet: `void count(String s, int i, Map<Character, Integer> map) {
    if (i == s.length()) return;
    map.merge(s.charAt(i), 1, Integer::sum);
    count(s, i + 1, map);
}`,
      },
      stream: {
        hint: "Collect chars into a frequency map using Collectors.groupingBy",
        snippet: `Map<Character, Long> freq = s.chars()
    .mapToObj(c -> (char) c)
    .collect(Collectors.groupingBy(c -> c, Collectors.counting()));`,
      },
    },
    {
      id: 6,
      title: "Remove duplicate characters",
      problem:
        "Given a string s, remove duplicate characters while keeping the first occurrence order.",
      examples: [
        { input: 's = "programming"', output: '"progamin"' },
        { input: 's = "aabbcc"', output: '"abc"' },
      ],
      tip: "Track seen chars in a boolean array; append only first occurrences",
      iteration: {
        hint: "Use a visited boolean array; only append char if not seen before",
        snippet: `boolean[] seen = new boolean[256];
StringBuilder sb = new StringBuilder();
for (char c : s.toCharArray()) {
    if (!seen[c]) { seen[c] = true; sb.append(c); }
}
return sb.toString();`,
      },
      recursion: {
        hint: "Skip current char if seen set already contains it, else add and recurse",
        snippet: `String removeDup(String s, Set<Character> seen) {
    if (s.isEmpty()) return "";
    char c = s.charAt(0);
    if (seen.contains(c)) return removeDup(s.substring(1), seen);
    seen.add(c);
    return c + removeDup(s.substring(1), seen);
}`,
      },
      stream: {
        hint: "Use distinct() on IntStream of chars then collect to string",
        snippet: `s.chars()
    .distinct()
    .collect(StringBuilder::new,
             (sb, c) -> sb.append((char) c), StringBuilder::append)
    .toString();`,
      },
    },
    {
      id: 7,
      title: "Longest substring without repeating characters",
      problem:
        "Given a string s, return the length of the longest substring that contains no repeated characters.",
      examples: [
        { input: 's = "abcabcbb"', output: "3" },
        { input: 's = "bbbbb"', output: "1" },
      ],
      tip: "Sliding window with a HashSet: expand right, shrink left on duplicate",
      iteration: {
        hint: "Expand right pointer; when duplicate found shrink left until clear",
        snippet: `Set<Character> set = new HashSet<>();
int l = 0, max = 0;
for (int r = 0; r < s.length(); r++) {
    while (set.contains(s.charAt(r))) set.remove(s.charAt(l++));
    set.add(s.charAt(r));
    max = Math.max(max, r - l + 1);
}
return max;`,
      },
      recursion: {
        hint: "Recurse expanding window right; when duplicate hit, advance left",
        snippet: `int lsw(String s, int l, int r, Set<Character> set, int max) {
    if (r == s.length()) return max;
    char c = s.charAt(r);
    while (set.contains(c)) set.remove(s.charAt(l++));
    set.add(c);
    return lsw(s, l, r + 1, set, Math.max(max, r - l + 1));
}`,
      },
      stream: {
        hint: "No clean stream solution; use HashMap for O(n) last-seen index tracking",
        snippet: `Map<Character, Integer> map = new HashMap<>();
int l = 0, max = 0;
for (int r = 0; r < s.length(); r++) {
    if (map.containsKey(s.charAt(r)))
        l = Math.max(l, map.get(s.charAt(r)) + 1);
    map.put(s.charAt(r), r);
    max = Math.max(max, r - l + 1);
}
return max;`,
      },
    },
    {
      id: 8,
      title: "Longest palindrome substring",
      problem:
        "Given a string s, return the longest contiguous substring that is a palindrome.",
      examples: [
        { input: 's = "babad"', output: '"bab" or "aba"' },
        { input: 's = "cbbd"', output: '"bb"' },
      ],
      tip: "Expand around each center (2n-1 centers) in O(n^2); Manacher's is O(n)",
      iteration: {
        hint: "For each index expand outward for odd and even length palindromes",
        snippet: `int start = 0, maxLen = 1;
for (int i = 0; i < s.length(); i++) {
    for (int[] d : new int[][]{{i,i},{i,i+1}}) {
        int l = d[0], r = d[1];
        while (l >= 0 && r < s.length() && s.charAt(l)==s.charAt(r)){l--;r++;}
        if (r - l - 1 > maxLen) { maxLen = r-l-1; start = l+1; }
    }
}
return s.substring(start, start + maxLen);`,
      },
      recursion: {
        hint: "Recursively expand from center; return substring when borders mismatch",
        snippet: `String expand(String s, int l, int r) {
    if (l < 0 || r >= s.length() || s.charAt(l) != s.charAt(r))
        return s.substring(l + 1, r);
    return expand(s, l - 1, r + 1);
}
// call for each i: expand(s,i,i) and expand(s,i,i+1)`,
      },
      stream: {
        hint: "Stream over centers, expand each, pick max-length palindrome",
        snippet: `IntStream.range(0, 2 * s.length() - 1)
    .mapToObj(i -> expand(s, i/2, i/2 + i%2))
    .max(Comparator.comparingInt(String::length))
    .orElse("");`,
      },
    },
    {
      id: 9,
      title: "String compression",
      problem:
        "Given a string s, compress each run of repeated characters as character plus count, omitting the count for single characters.",
      examples: [
        { input: 's = "aaabbc"', output: '"a3b2c"' },
        { input: 's = "abcd"', output: '"abcd"' },
      ],
      tip: "Count consecutive identical chars; append char and count only if count>1",
      iteration: {
        hint: "Track count of consecutive chars; flush char+count when char changes",
        snippet: `StringBuilder sb = new StringBuilder();
int i = 0;
while (i < s.length()) {
    char c = s.charAt(i); int cnt = 0;
    while (i < s.length() && s.charAt(i) == c) { i++; cnt++; }
    sb.append(c); if (cnt > 1) sb.append(cnt);
}
return sb.toString();`,
      },
      recursion: {
        hint: "Count run length at index i, append, recurse at i+runLength",
        snippet: `void compress(String s, int i, StringBuilder sb) {
    if (i >= s.length()) return;
    char c = s.charAt(i); int cnt = 0;
    while (i + cnt < s.length() && s.charAt(i + cnt) == c) cnt++;
    sb.append(c); if (cnt > 1) sb.append(cnt);
    compress(s, i + cnt, sb);
}`,
      },
      stream: {
        hint: "Use run-length grouping via pattern matcher or manual reduce",
        snippet: `java.util.regex.Matcher m = java.util.regex.Pattern.compile("(.)\\\\1*").matcher(s);
StringBuilder sb = new StringBuilder();
while (m.find()) {
    sb.append(m.group().charAt(0));
    if (m.group().length() > 1) sb.append(m.group().length());
}
return sb.toString();`,
      },
    },
    {
      id: 10,
      title: "Check if one string is a rotation of another",
      problem:
        "Given two strings s1 and s2, return true if s2 can be obtained by rotating s1; otherwise return false.",
      examples: [
        { input: 's1 = "abcde", s2 = "cdeab"', output: "true" },
        { input: 's1 = "abcde", s2 = "abced"', output: "false" },
      ],
      tip: "Concatenate s1+s1 and check if s2 is a substring — elegant O(n) trick",
      iteration: {
        hint: "If lengths match, check if s2 appears in s1+s1 using contains",
        snippet: `if (s1.length() != s2.length()) return false;
return (s1 + s1).contains(s2);`,
      },
      recursion: {
        hint: "Try each rotation point: check if rotating at index i gives s2",
        snippet: `boolean isRotation(String s1, String s2, int i) {
    if (i == s1.length()) return false;
    if ((s1.substring(i) + s1.substring(0, i)).equals(s2)) return true;
    return isRotation(s1, s2, i + 1);
}`,
      },
      stream: {
        hint: "Stream rotation indices, map to rotated string, check if any equals s2",
        snippet: `if (s1.length() != s2.length()) return false;
return IntStream.range(0, s1.length())
    .mapToObj(i -> s1.substring(i) + s1.substring(0, i))
    .anyMatch(s2::equals);`,
      },
    },
    {
      id: 11,
      title: "Convert Roman to Integer",
      problem:
        "Given a Roman numeral string s, convert it to its integer value.",
      examples: [
        { input: 's = "III"', output: "3" },
        { input: 's = "MCMXCIV"', output: "1994" },
      ],
      tip: "If current value < next value, subtract it; otherwise add it",
      iteration: {
        hint: "Scan left to right; subtract when smaller numeral precedes larger",
        snippet: `Map<Character,Integer> map = Map.of('I',1,'V',5,'X',10,'L',50,'C',100,'D',500,'M',1000);
int result = 0;
for (int i = 0; i < s.length(); i++) {
    int cur = map.get(s.charAt(i));
    int next = i+1 < s.length() ? map.get(s.charAt(i+1)) : 0;
    result += cur < next ? -cur : cur;
}
return result;`,
      },
      recursion: {
        hint: "At index i, subtract if s[i] < s[i+1], else add; recurse on i+1",
        snippet: `int roman(String s, Map<Character,Integer> m, int i) {
    if (i >= s.length()) return 0;
    int cur = m.get(s.charAt(i));
    int nxt = i+1 < s.length() ? m.get(s.charAt(i+1)) : 0;
    return cur < nxt ? -cur + roman(s,m,i+1) : cur + roman(s,m,i+1);
}`,
      },
      stream: {
        hint: "Stream indices, map each to +/- value based on next char comparison",
        snippet: `Map<Character,Integer> m = Map.of('I',1,'V',5,'X',10,'L',50,'C',100,'D',500,'M',1000);
return IntStream.range(0, s.length())
    .map(i -> m.get(s.charAt(i)) < (i+1<s.length()?m.get(s.charAt(i+1)):0)
              ? -m.get(s.charAt(i)) : m.get(s.charAt(i)))
    .sum();`,
      },
    },
    {
      id: 12,
      title: "Integer to Roman",
      problem:
        "Given an integer num, convert it to a valid Roman numeral string.",
      examples: [
        { input: "num = 58", output: '"LVIII"' },
        { input: "num = 1994", output: '"MCMXCIV"' },
      ],
      tip: "Greedily subtract largest roman numeral values using a value-symbol table",
      iteration: {
        hint: "Keep subtracting the largest fitting value and appending its symbol",
        snippet: `int[] vals = {1000,900,500,400,100,90,50,40,10,9,5,4,1};
String[] syms = {"M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"};
StringBuilder sb = new StringBuilder();
for (int i = 0; num > 0; i++)
    while (num >= vals[i]) { sb.append(syms[i]); num -= vals[i]; }
return sb.toString();`,
      },
      recursion: {
        hint: "Find largest fitting value, append its symbol, recurse on remainder",
        snippet: `String toRoman(int num, int[] vals, String[] syms, int i) {
    if (num == 0) return "";
    if (num >= vals[i]) return syms[i] + toRoman(num - vals[i], vals, syms, i);
    return toRoman(num, vals, syms, i + 1);
}`,
      },
      stream: {
        hint: "Stream value table; for each entry repeat symbol floor(num/val) times",
        snippet: `int[] vals = {1000,900,500,400,100,90,50,40,10,9,5,4,1};
String[] syms = {"M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"};
// functional reduce over table entries
// Pure stream doesn't handle mutable num cleanly; iterative is idiomatic here`,
      },
    },
    {
      id: 13,
      title: "Implement strstr() (find needle in haystack)",
      problem:
        "Given strings haystack and needle, return the first index where needle occurs in haystack. Return -1 if it does not occur.",
      examples: [
        { input: 'haystack = "sadbutsad", needle = "sad"', output: "0" },
        { input: 'haystack = "leetcode", needle = "leeto"', output: "-1" },
      ],
      tip: "KMP achieves O(n+m) by using a failure/prefix function to avoid backtracking",
      iteration: {
        hint: "Slide a window of needle length across haystack; compare at each position",
        snippet: `for (int i = 0; i <= haystack.length() - needle.length(); i++) {
    if (haystack.substring(i, i + needle.length()).equals(needle))
        return i;
}
return -1;`,
      },
      recursion: {
        hint: "Check needle at current index; recurse to next index if no match",
        snippet: `int strstr(String h, String n, int i) {
    if (i > h.length() - n.length()) return -1;
    if (h.substring(i, i + n.length()).equals(n)) return i;
    return strstr(h, n, i + 1);
}`,
      },
      stream: {
        hint: "Stream start indices, filter those where substring matches needle",
        snippet: `return IntStream.rangeClosed(0, haystack.length() - needle.length())
    .filter(i -> haystack.startsWith(needle, i))
    .findFirst().orElse(-1);`,
      },
    },
    {
      id: 14,
      title: "Group anagrams",
      problem:
        "Given an array of words, group words that are anagrams of each other and return the groups.",
      examples: [
        {
          input: 'words = ["eat","tea","tan","ate","nat","bat"]',
          output: '[["eat","tea","ate"],["tan","nat"],["bat"]]',
        },
        { input: 'words = [""]', output: '[[""]]' },
      ],
      tip: "Sort each string as a canonical key; group all strings sharing that key",
      iteration: {
        hint: "For each word, sort its chars as key; accumulate words by key in map",
        snippet: `Map<String, List<String>> map = new HashMap<>();
for (String word : words) {
    char[] c = word.toCharArray(); Arrays.sort(c);
    map.computeIfAbsent(new String(c), k -> new ArrayList<>()).add(word);
}
return new ArrayList<>(map.values());`,
      },
      recursion: {
        hint: "Process one word at a time recursively, adding to group map",
        snippet: `void group(String[] words, int i, Map<String,List<String>> map) {
    if (i == words.length) return;
    char[] c = words[i].toCharArray(); Arrays.sort(c);
    map.computeIfAbsent(new String(c), k -> new ArrayList<>()).add(words[i]);
    group(words, i + 1, map);
}`,
      },
      stream: {
        hint: "Stream words, collect using Collectors.groupingBy with sorted key",
        snippet: `return Arrays.stream(words)
    .collect(Collectors.groupingBy(w -> {
        char[] c = w.toCharArray(); Arrays.sort(c); return new String(c);
    }))
    .values().stream().collect(Collectors.toList());`,
      },
    },
    {
      id: 15,
      title: "Minimum window substring",
      problem:
        "Given strings s and t, return the smallest substring of s that contains every character of t with required frequency. Return an empty string if no such window exists.",
      examples: [
        { input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"' },
        { input: 's = "a", t = "aa"', output: '""' },
      ],
      tip: "Sliding window with two frequency maps; shrink left when all chars covered",
      iteration: {
        hint: "Expand right until window covers t; shrink left to minimize, record min",
        snippet: `Map<Character,Integer> need = new HashMap<>(), have = new HashMap<>();
for (char c : t.toCharArray()) need.merge(c, 1, Integer::sum);
int formed=0, l=0, minLen=Integer.MAX_VALUE, start=0;
for (int r=0; r<s.length(); r++) {
    char c=s.charAt(r); have.merge(c,1,Integer::sum);
    if (need.containsKey(c) && have.get(c).equals(need.get(c))) formed++;
    while (formed==need.size()) { if(r-l+1<minLen){minLen=r-l+1;start=l;} have.merge(s.charAt(l),-1,Integer::sum); if(need.containsKey(s.charAt(l))&&have.get(s.charAt(l))<need.get(s.charAt(l)))formed--; l++; }
}
return minLen==Integer.MAX_VALUE?"":s.substring(start,start+minLen);`,
      },
      recursion: {
        hint: "Sliding window is inherently iterative; recursion mirrors the loop state",
        snippet: `// Recursion mirrors iteration; iterative sliding window is preferred
// Key insight: recurse with updated l, r, formed count as parameters
// Base: r == s.length() return best result found so far`,
      },
      stream: {
        hint: "No clean stream solution; iterative two-pointer is canonical here",
        snippet: `// Stream API doesn't model stateful two-pointer windows cleanly.
// Use the iterative sliding window approach with two frequency maps.`,
      },
    },
    {
      id: 16,
      title: "Zigzag conversion",
      problem:
        "Given a string s and numRows, write characters in a zigzag pattern and then read row by row.",
      examples: [
        {
          input: 's = "PAYPALISHIRING", numRows = 3',
          output: '"PAHNAPLSIIGYIR"',
        },
        { input: 's = "ABCD", numRows = 2', output: '"ACBD"' },
      ],
      tip: "Simulate rows with a direction flag; flip direction at top and bottom rows",
      iteration: {
        hint: "Place each char in current row, flip direction at row 0 or numRows-1",
        snippet: `List<StringBuilder> rows = new ArrayList<>();
for (int i=0;i<numRows;i++) rows.add(new StringBuilder());
int row=0, dir=-1;
for (char c : s.toCharArray()) {
    rows.get(row).append(c);
    if (row==0||row==numRows-1) dir=-dir;
    row+=dir;
}
return rows.stream().map(StringBuilder::toString).collect(Collectors.joining());`,
      },
      recursion: {
        hint: "Place each char by index, compute its row via direction, recurse",
        snippet: `void zigzag(String s, int i, int row, int dir, StringBuilder[] rows, int n) {
    if (i == s.length()) return;
    rows[row].append(s.charAt(i));
    if (row == 0 || row == n - 1) dir = -dir;
    zigzag(s, i+1, row+dir, dir, rows, n);
}`,
      },
      stream: {
        hint: "Stream indices, group by computed row number, then concat rows in order",
        snippet: `StringBuilder[] rows = new StringBuilder[numRows];
for (int i=0;i<numRows;i++) rows[i]=new StringBuilder();
// Stream approach: IntStream.range then compute row per index mathematically
return Arrays.stream(rows).map(StringBuilder::toString).collect(Collectors.joining());`,
      },
    },
    {
      id: 17,
      title: "Valid palindrome with at most 1 deletion",
      problem:
        "Given a string s, return true if it is already a palindrome or can become one by deleting at most one character.",
      examples: [
        { input: 's = "aba"', output: "true" },
        { input: 's = "abca"', output: "true" },
      ],
      tip: "Two pointers; on mismatch, try skipping either left or right char",
      iteration: {
        hint: "On first mismatch try isPalin(l+1,r) or isPalin(l,r-1); either true => valid",
        snippet: `int l=0, r=s.length()-1;
while (l<r) {
    if (s.charAt(l)!=s.charAt(r))
        return isPalin(s,l+1,r)||isPalin(s,l,r-1);
    l++; r--;
}
return true;
// isPalin: standard two-pointer check`,
      },
      recursion: {
        hint: "Recurse inward; on mismatch branch into two sub-checks",
        snippet: `boolean check(String s, int l, int r, boolean deleted) {
    if (l >= r) return true;
    if (s.charAt(l)==s.charAt(r)) return check(s,l+1,r-1,deleted);
    if (deleted) return false;
    return check(s,l+1,r,true) || check(s,l,r-1,true);
}`,
      },
      stream: {
        hint: "On mismatch, check if either shortened substring is a palindrome",
        snippet: `// Helper: check if s[l..r] is palindrome
// On first mismatch at (l,r):
return IntStream.range(0,1).anyMatch(x ->
    isPalin(s, l+1, r) || isPalin(s, l, r-1));`,
      },
    },
    {
      id: 18,
      title: "Reverse words in a sentence",
      problem:
        "Given a sentence, reverse the order of words while removing extra spaces between words.",
      examples: [
        { input: 's = "the sky is blue"', output: '"blue is sky the"' },
        { input: 's = "  hello   world  "', output: '"world hello"' },
      ],
      tip: "Split on whitespace, reverse the array, rejoin — handles multiple spaces",
      iteration: {
        hint: "Split by spaces, collect non-empty tokens, reverse list, join with space",
        snippet: `String[] words = s.trim().split("\\s+");
int l=0, r=words.length-1;
while (l<r) { String t=words[l]; words[l++]=words[r]; words[r--]=t; }
return String.join(" ", words);`,
      },
      recursion: {
        hint: "Reverse words array recursively by swapping l and r, moving inward",
        snippet: `void reverseWords(String[] w, int l, int r) {
    if (l >= r) return;
    String t = w[l]; w[l] = w[r]; w[r] = t;
    reverseWords(w, l+1, r-1);
}`,
      },
      stream: {
        hint: "Stream words array in reverse order using IntStream descending indices",
        snippet: `String[] words = s.trim().split("\\s+");
return IntStream.iterate(words.length-1, i->i-1).limit(words.length)
    .mapToObj(i -> words[i])
    .collect(Collectors.joining(" "));`,
      },
    },
    {
      id: 19,
      title: "Multiply strings",
      problem:
        "Given two non-negative integers num1 and num2 as strings, return their product as a string without converting the whole input to a built-in numeric type.",
      examples: [
        { input: 'num1 = "2", num2 = "3"', output: '"6"' },
        { input: 'num1 = "123", num2 = "456"', output: '"56088"' },
      ],
      tip: "Simulate grade-school multiplication digit-by-digit into a result array",
      iteration: {
        hint: "For each pair (i,j), product goes to positions i+j and i+j+1 in result",
        snippet: `int m=num1.length(), n=num2.length();
int[] pos = new int[m+n];
for (int i=m-1;i>=0;i--)
    for (int j=n-1;j>=0;j--) {
        int mul=(num1.charAt(i)-'0')*(num2.charAt(j)-'0');
        int p1=i+j, p2=i+j+1, sum=mul+pos[p2];
        pos[p2]=sum%10; pos[p1]+=sum/10;
    }
StringBuilder sb=new StringBuilder();
for (int d:pos) if(!(sb.length()==0&&d==0)) sb.append(d);
return sb.length()==0?"0":sb.toString();`,
      },
      recursion: {
        hint: "Multiply each digit of num2 by all of num1, shift and add results",
        snippet: `// Pure recursion is complex for grade-school multiply.
// Better: use BigInteger or iterative approach.
return new java.math.BigInteger(num1).multiply(new java.math.BigInteger(num2)).toString();`,
      },
      stream: {
        hint: "Use BigInteger for clean functional solution without manual carries",
        snippet: `return new java.math.BigInteger(num1)
    .multiply(new java.math.BigInteger(num2))
    .toString();`,
      },
    },
    {
      id: 20,
      title: "Add binary strings",
      problem:
        "Given two binary strings a and b, return their sum as a binary string.",
      examples: [
        { input: 'a = "11", b = "1"', output: '"100"' },
        { input: 'a = "1010", b = "1011"', output: '"10101"' },
      ],
      tip: "Process from right to left, track carry; prepend each sum bit",
      iteration: {
        hint: "Two pointers from end, sum bits + carry, prepend result bit",
        snippet: `int i=a.length()-1, j=b.length()-1, carry=0;
StringBuilder sb=new StringBuilder();
while (i>=0||j>=0||carry>0) {
    int sum=carry;
    if (i>=0) sum+=a.charAt(i--)-'0';
    if (j>=0) sum+=b.charAt(j--)-'0';
    sb.append(sum%2); carry=sum/2;
}
return sb.reverse().toString();`,
      },
      recursion: {
        hint: "Recurse on shorter prefix, add current bits + carry returned from recursion",
        snippet: `String addBin(String a, String b, int i, int j, int carry) {
    if (i<0 && j<0 && carry==0) return "";
    int sum=carry+(i>=0?a.charAt(i--)-'0':0)+(j>=0?b.charAt(j--)-'0':0);
    return addBin(a,b,i,j,sum/2)+(sum%2);
}`,
      },
      stream: {
        hint: "Parse as BigInteger base 2, add, return binary string",
        snippet: `return new java.math.BigInteger(a, 2)
    .add(new java.math.BigInteger(b, 2))
    .toString(2);`,
      },
    },
    {
      id: 21,
      title: "Remove adjacent duplicates",
      problem:
        "Given a string s, repeatedly remove adjacent equal character pairs until no such pair remains, then return the final string.",
      examples: [
        { input: 's = "abbaca"', output: '"ca"' },
        { input: 's = "azxxzy"', output: '"ay"' },
      ],
      tip: "Use a stack: push char if top differs, else pop (they cancel each other)",
      iteration: {
        hint: "Stack-based: push if top != current, else pop to remove pair",
        snippet: `Deque<Character> stack = new ArrayDeque<>();
for (char c : s.toCharArray()) {
    if (!stack.isEmpty() && stack.peek() == c) stack.pop();
    else stack.push(c);
}
StringBuilder sb = new StringBuilder();
stack.forEach(sb::append);
return sb.reverse().toString();`,
      },
      recursion: {
        hint: "Remove one adjacent pair, recurse until no more adjacent pairs exist",
        snippet: `String removeDup(String s) {
    for (int i=0; i<s.length()-1; i++)
        if (s.charAt(i)==s.charAt(i+1))
            return removeDup(s.substring(0,i)+s.substring(i+2));
    return s;
}`,
      },
      stream: {
        hint: "Use reduce on char stream to simulate stack accumulation",
        snippet: `return s.chars().mapToObj(c -> String.valueOf((char)c))
    .reduce("", (acc, c) ->
        !acc.isEmpty() && acc.charAt(acc.length()-1)==c.charAt(0)
        ? acc.substring(0,acc.length()-1) : acc+c);`,
      },
    },
    {
      id: 22,
      title: "Check isomorphic strings",
      problem:
        "Given strings s and t, return true if characters in s can be replaced one-to-one to form t, preserving order.",
      examples: [
        { input: 's = "egg", t = "add"', output: "true" },
        { input: 's = "foo", t = "bar"', output: "false" },
      ],
      tip: "Map each char in s to corresponding char in t, and verify no conflicts",
      iteration: {
        hint: "Maintain two maps s->t and t->s; any conflicting mapping returns false",
        snippet: `Map<Character,Character> st=new HashMap<>(), ts=new HashMap<>();
for (int i=0;i<s.length();i++) {
    char a=s.charAt(i), b=t.charAt(i);
    if ((st.containsKey(a)&&st.get(a)!=b)||(ts.containsKey(b)&&ts.get(b)!=a))
        return false;
    st.put(a,b); ts.put(b,a);
}
return true;`,
      },
      recursion: {
        hint: "Check current index mapping; recurse on i+1 if consistent",
        snippet: `boolean iso(String s, String t, int i, Map<Character,Character> st, Map<Character,Character> ts) {
    if (i==s.length()) return true;
    char a=s.charAt(i), b=t.charAt(i);
    if ((st.containsKey(a)&&st.get(a)!=b)||(ts.containsKey(b)&&ts.get(b)!=a)) return false;
    st.put(a,b); ts.put(b,a);
    return iso(s,t,i+1,st,ts);
}`,
      },
      stream: {
        hint: "Encode each string by replacing chars with their first-occurrence index",
        snippet: `// Map each char to index of its first appearance; compare encodings
IntStream.range(0,s.length()).allMatch(i ->
    s.indexOf(s.charAt(i)) == t.indexOf(t.charAt(i)));`,
      },
    },
    {
      id: 23,
      title: 'Decode string (e.g. "3[a2[b]]" => "abbabbabb")',
      problem:
        "Given an encoded string with patterns like k[encoded_string], decode it so the bracketed part repeats k times.",
      examples: [
        { input: 's = "3[a]2[bc]"', output: '"aaabcbc"' },
        { input: 's = "3[a2[c]]"', output: '"accaccacc"' },
      ],
      tip: "Use two stacks (count stack, string stack); unwind on ']'",
      iteration: {
        hint: "Push current string and count on '['; on ']' pop and repeat k times",
        snippet: `Deque<Integer> counts=new ArrayDeque<>();
Deque<StringBuilder> strs=new ArrayDeque<>();
StringBuilder cur=new StringBuilder(); int k=0;
for (char c:s.toCharArray()) {
    if (Character.isDigit(c)) k=k*10+(c-'0');
    else if (c=='[') { counts.push(k); strs.push(cur); cur=new StringBuilder(); k=0; }
    else if (c==']') { int n=counts.pop(); String rep=cur.toString(); cur=strs.pop(); for(int i=0;i<n;i++)cur.append(rep); }
    else cur.append(c);
}
return cur.toString();`,
      },
      recursion: {
        hint: "Use index array to track position; recurse into brackets, return decoded",
        snippet: `String decode(String s, int[] i) {
    StringBuilder res=new StringBuilder();
    while (i[0]<s.length()&&s.charAt(i[0])!=']') {
        if (!Character.isDigit(s.charAt(i[0]))) res.append(s.charAt(i[0]++));
        else { int k=0; while(Character.isDigit(s.charAt(i[0])))k=k*10+(s.charAt(i[0]++)-'0'); i[0]++; String inner=decode(s,i); i[0]++; res.append(inner.repeat(k)); }
    }
    return res.toString();
}`,
      },
      stream: {
        hint: "Stack-based decode; streams don't model this stateful parse well",
        snippet: `// Pattern-based: find innermost bracket, decode, replace, repeat
while (s.contains("[")) {
    s = s.replaceAll("(\\d+)\\[([a-z]*)\\]",
        m -> m.group(2).repeat(Integer.parseInt(m.group(1))));
}
return s;`,
      },
    },
    {
      id: 24,
      title: "Wildcard matching (* matches any sequence, ? matches one char)",
      problem:
        "Given a text string and a wildcard pattern, return true if the whole text matches the pattern where ? matches one character and * matches any sequence.",
      examples: [
        { input: 's = "aa", p = "a"', output: "false" },
        { input: 's = "adceb", p = "*a*b"', output: "true" },
      ],
      tip: "DP table dp[i][j] = true if pattern[0..j-1] matches string[0..i-1]",
      iteration: {
        hint: "Build DP; '*' uses dp[i-1][j] (match more) or dp[i][j-1] (match empty)",
        snippet: `boolean[][] dp=new boolean[s.length()+1][p.length()+1];
dp[0][0]=true;
for(int j=1;j<=p.length();j++) if(p.charAt(j-1)=='*') dp[0][j]=dp[0][j-1];
for(int i=1;i<=s.length();i++)
    for(int j=1;j<=p.length();j++)
        if(p.charAt(j-1)=='*') dp[i][j]=dp[i-1][j]||dp[i][j-1];
        else dp[i][j]=dp[i-1][j-1]&&(p.charAt(j-1)=='?'||p.charAt(j-1)==s.charAt(i-1));
return dp[s.length()][p.length()];`,
      },
      recursion: {
        hint: "Memoized recursion: '*' branches into skip (si,pj+1) or use (si+1,pj)",
        snippet: `boolean match(String s, String p, int si, int pi, Boolean[][] memo) {
    if (pi==p.length()) return si==s.length();
    if (memo[si][pi]!=null) return memo[si][pi];
    boolean res;
    if (p.charAt(pi)=='*') res=match(s,p,si,pi+1,memo)||(si<s.length()&&match(s,p,si+1,pi,memo));
    else res=si<s.length()&&(p.charAt(pi)=='?'||p.charAt(pi)==s.charAt(si))&&match(s,p,si+1,pi+1,memo);
    return memo[si][pi]=res;
}`,
      },
      stream: {
        hint: "DP is the canonical approach; convert regex '*' to '.*' and use matches()",
        snippet: `return s.matches(p.replace(".", "\\.").replace("?", ".").replace("*", ".*"));`,
      },
    },
    {
      id: 25,
      title:
        "Regex matching (. matches one char, * matches zero or more of preceding)",
      problem:
        "Given a text string and regex pattern, return true if the entire string matches where . matches one character and * means zero or more of the previous element.",
      examples: [
        { input: 's = "aa", p = "a*"', output: "true" },
        { input: 's = "mississippi", p = "mis*is*p*."', output: "false" },
      ],
      tip: "DP: '.*' can match empty; check both consuming and not consuming with '*'",
      iteration: {
        hint: "dp[i][j]: s[0..i-1] matches p[0..j-1]; handle '.*' carefully",
        snippet: `boolean[][] dp=new boolean[s.length()+1][p.length()+1];
dp[0][0]=true;
for(int j=2;j<=p.length();j++) if(p.charAt(j-1)=='*') dp[0][j]=dp[0][j-2];
for(int i=1;i<=s.length();i++)
    for(int j=1;j<=p.length();j++)
        if(p.charAt(j-1)=='*')
            dp[i][j]=dp[i][j-2]||(dp[i-1][j]&&(p.charAt(j-2)=='.'||p.charAt(j-2)==s.charAt(i-1)));
        else dp[i][j]=dp[i-1][j-1]&&(p.charAt(j-1)=='.'||p.charAt(j-1)==s.charAt(i-1));
return dp[s.length()][p.length()];`,
      },
      recursion: {
        hint: "If next is '*', try zero occurrences or match and advance si",
        snippet: `boolean match(String s, String p, int si, int pi) {
    if (pi==p.length()) return si==s.length();
    boolean first=si<s.length()&&(p.charAt(pi)=='.'||p.charAt(pi)==s.charAt(si));
    if (pi+1<p.length()&&p.charAt(pi+1)=='*')
        return match(s,p,si,pi+2)||(first&&match(s,p,si+1,pi));
    return first&&match(s,p,si+1,pi+1);
}`,
      },
      stream: {
        hint: "Use Java's built-in Pattern.matches for clean one-liner",
        snippet: `return java.util.regex.Pattern.matches(p, s);`,
      },
    },
    {
      id: 26,
      title: "Longest common prefix",
      problem:
        "Given an array of strings, return the longest prefix shared by every string. Return an empty string if there is no common prefix.",
      examples: [
        { input: 'strs = ["flower","flow","flight"]', output: '"fl"' },
        { input: 'strs = ["dog","racecar","car"]', output: '""' },
      ],
      tip: "Take first string as candidate; shrink it until each word starts with it",
      iteration: {
        hint: "Use first word as prefix; shorten until all strings start with it",
        snippet: `String prefix = strs[0];
for (String s : strs)
    while (!s.startsWith(prefix))
        prefix = prefix.substring(0, prefix.length() - 1);
return prefix;`,
      },
      recursion: {
        hint: "LCP(strs) = LCP(LCP(strs[0..n/2]), LCP(strs[n/2+1..n])) divide & conquer",
        snippet: `String lcp(String[] strs, int l, int r) {
    if (l==r) return strs[l];
    int mid=(l+r)/2;
    String left=lcp(strs,l,mid), right=lcp(strs,mid+1,r);
    while (!right.startsWith(left)) left=left.substring(0,left.length()-1);
    return left;
}`,
      },
      stream: {
        hint: "Reduce array with a common-prefix binary function",
        snippet: `return Arrays.stream(strs)
    .reduce((a, b) -> {
        while (!b.startsWith(a)) a = a.substring(0, a.length() - 1);
        return a;
    }).orElse("");`,
      },
    },
    {
      id: 27,
      title: "Reorganize string (no two adjacent chars same)",
      problem:
        "Given a string s, rearrange its characters so no two adjacent characters are the same. Return an empty string if impossible.",
      examples: [
        { input: 's = "aab"', output: '"aba"' },
        { input: 's = "aaab"', output: '""' },
      ],
      tip: "Max-heap by frequency; always pick most frequent char, then second most",
      iteration: {
        hint: "PriorityQueue by frequency; alternate top two chars, re-enqueue if freq>0",
        snippet: `int[] freq=new int[26];
for(char c:s.toCharArray()) freq[c-'a']++;
PriorityQueue<int[]> pq=new PriorityQueue<>((a,b)->b[0]-a[0]);
for(int i=0;i<26;i++) if(freq[i]>0) pq.offer(new int[]{freq[i],i+'a'});
StringBuilder sb=new StringBuilder();
while(pq.size()>=2){int[]a=pq.poll(),b=pq.poll();sb.append((char)a[1]);sb.append((char)b[1]);if(--a[0]>0)pq.offer(a);if(--b[0]>0)pq.offer(b);}
if(!pq.isEmpty()){if(pq.peek()[0]>1)return"";sb.append((char)pq.poll()[1]);}
return sb.toString();`,
      },
      recursion: {
        hint: "Recursion on heap state is complex; greedy heap iteration is canonical",
        snippet: `// Recursion mirrors iteration; at each step pick top two from max-heap.
// Base: heap empty => return result, size 1 => append if freq==1 else ""
// Greedy heap approach is the natural solution here`,
      },
      stream: {
        hint: "No clean stream solution; greedy max-heap is the right data structure",
        snippet: `// Stream doesn't help with the greedy interleaving logic.
// Use the PriorityQueue approach — it's the canonical algorithm.`,
      },
    },
    {
      id: 28,
      title:
        "Partition labels (partition so each char appears in at most one part)",
      problem:
        "Given a string s, split it into as many parts as possible so each character appears in at most one part, and return the part lengths.",
      examples: [
        { input: 's = "ababcbacadefegdehijhklij"', output: "[9,7,8]" },
        { input: 's = "eccbbbbdec"', output: "[10]" },
      ],
      tip: "Record last index of each char; greedily extend current partition to cover all",
      iteration: {
        hint: "Track last occurrence of each char; close partition when i == end",
        snippet: `int[] last=new int[26];
for(int i=0;i<s.length();i++) last[s.charAt(i)-'a']=i;
List<Integer> res=new ArrayList<>();
int start=0, end=0;
for(int i=0;i<s.length();i++){
    end=Math.max(end,last[s.charAt(i)-'a']);
    if(i==end){res.add(end-start+1);start=i+1;}
}
return res;`,
      },
      recursion: {
        hint: "Recursively find end of current partition, record size, continue from end+1",
        snippet: `void partition(String s, int[] last, int start, int i, List<Integer> res) {
    if (i==s.length()) return;
    int end=findEnd(s,last,start,start);
    res.add(end-start+1);
    partition(s,last,end+1,end+1,res);
}`,
      },
      stream: {
        hint: "Precompute last-index array, then stream with stateful accumulation",
        snippet: `int[] last=new int[26];
IntStream.range(0,s.length()).forEach(i->last[s.charAt(i)-'a']=i);
// Stateful partition accumulation doesn't fit pure streams well
// Use the iterative approach after building the last[] array`,
      },
    },
    {
      id: 29,
      title: "Longest repeating character replacement (with at most K swaps)",
      problem:
        "Given a string s and integer k, return the longest substring length that can be made of one repeated character by replacing at most k characters.",
      examples: [
        { input: 's = "ABAB", k = 2', output: "4" },
        { input: 's = "AABABBA", k = 1', output: "4" },
      ],
      tip: "Sliding window: window is valid if (window size - max freq) <= K",
      iteration: {
        hint: "Expand right; track max freq in window; shrink left when invalid",
        snippet: `int[] freq=new int[26]; int maxFreq=0, l=0, res=0;
for(int r=0;r<s.length();r++){
    freq[s.charAt(r)-'A']++;
    maxFreq=Math.max(maxFreq,freq[s.charAt(r)-'A']);
    if(r-l+1-maxFreq>k) freq[s.charAt(l++)-'A']--;
    res=Math.max(res,r-l+1);
}
return res;`,
      },
      recursion: {
        hint: "Sliding window is inherently iterative; recursion adds no benefit here",
        snippet: `// This problem requires tracking window state (freq array, maxFreq).
// The iterative sliding window is O(n); recursion would be O(n^2) naive.
// Stick to the iterative approach for optimal performance.`,
      },
      stream: {
        hint: "No clean stream solution; sliding window with freq array is canonical",
        snippet: `// Streams cannot efficiently maintain the sliding window frequency count.
// The iterative O(n) two-pointer approach is the right choice here.`,
      },
    },
    {
      id: 30,
      title: "Count substrings with exactly K distinct characters",
      problem:
        "Given a string s and integer k, count substrings that contain exactly k distinct characters.",
      examples: [
        { input: 's = "pqpqs", k = 2', output: "7" },
        { input: 's = "aabab", k = 3', output: "0" },
      ],
      tip: "atMost(K) - atMost(K-1) trick converts 'exactly K' to sliding window",
      iteration: {
        hint: "Use atMost helper: count(k)-count(k-1) gives exactly-k substrings",
        snippet: `int countAtMost(String s, int k) {
    Map<Character,Integer> map=new HashMap<>();
    int l=0,res=0;
    for(int r=0;r<s.length();r++){
        map.merge(s.charAt(r),1,Integer::sum);
        while(map.size()>k){map.merge(s.charAt(l),-1,Integer::sum);if(map.get(s.charAt(l))==0)map.remove(s.charAt(l));l++;}
        res+=r-l+1;
    }
    return res;
}
return countAtMost(s,k)-countAtMost(s,k-1);`,
      },
      recursion: {
        hint: "Brute-force recursion generates all substrings; count those with k distinct",
        snippet: `int count(String s, int i, int j, int k) {
    if (j==s.length()) return 0;
    long distinct=s.substring(i,j+1).chars().distinct().count();
    return (distinct==k?1:0)+count(s,i,j+1,k)+(j==s.length()-1?count(s,i+1,i+1,k):0);
}
// O(n^3) brute force; use sliding window for O(n)`,
      },
      stream: {
        hint: "Use the atMost pattern; inner sliding window is not stream-friendly",
        snippet: `// atMost helper is iterative; combine two calls for exactly-k count
// return countAtMost(s, k) - countAtMost(s, k-1);`,
      },
    },
    {
      id: 31,
      title: "Implement atoi() (string to integer)",
      problem:
        "Given a string s, parse it like atoi: ignore leading spaces, read optional sign and digits, stop at the first invalid character, and clamp overflow.",
      examples: [
        { input: 's = "42"', output: "42" },
        { input: 's = "   -42"', output: "-42" },
      ],
      tip: "Handle leading spaces, sign, digit accumulation, and int overflow carefully",
      iteration: {
        hint: "Skip spaces, read sign, accumulate digits, clamp to INT_MIN/MAX",
        snippet: `int i=0, sign=1; long result=0;
while(i<s.length()&&s.charAt(i)==' ')i++;
if(i<s.length()&&(s.charAt(i)=='+'||s.charAt(i)=='-'))sign=(s.charAt(i++)=='-')?-1:1;
while(i<s.length()&&Character.isDigit(s.charAt(i))){
    result=result*10+(s.charAt(i++)-'0');
    if(result*sign>Integer.MAX_VALUE)return Integer.MAX_VALUE;
    if(result*sign<Integer.MIN_VALUE)return Integer.MIN_VALUE;
}
return (int)(result*sign);`,
      },
      recursion: {
        hint: "Recurse digit by digit building result; return on non-digit or overflow",
        snippet: `int atoi(String s, int i, long result, int sign) {
    if(i==s.length()||!Character.isDigit(s.charAt(i)))
        return (int)Math.min(Math.max(result*sign, Integer.MIN_VALUE), Integer.MAX_VALUE);
    result=result*10+(s.charAt(i)-'0');
    if(result>Integer.MAX_VALUE) return sign>0?Integer.MAX_VALUE:Integer.MIN_VALUE;
    return atoi(s,i+1,result,sign);
}`,
      },
      stream: {
        hint: "Use regex to extract leading number, parse with bounds clamping",
        snippet: `java.util.regex.Matcher m = java.util.regex.Pattern.compile("^\\s*([+-]?\\d+)").matcher(s);
if(!m.find()) return 0;
long v = Long.parseLong(m.group(1));
return (int)Math.min(Math.max(v, Integer.MIN_VALUE), Integer.MAX_VALUE);`,
      },
    },
    {
      id: 32,
      title: "Repeated substring pattern",
      problem:
        "Given a string s, return true if it can be built by repeating one of its non-empty substrings.",
      examples: [
        { input: 's = "abab"', output: "true" },
        { input: 's = "aba"', output: "false" },
      ],
      tip: "If s is built from repeated pattern p, then (s+s) without first/last char contains s",
      iteration: {
        hint: "Check if s appears in (s+s) after removing first and last character",
        snippet: `return (s + s).substring(1, 2 * s.length() - 1).contains(s);`,
      },
      recursion: {
        hint: "Try each divisor length of s; check if repeating that prefix gives s",
        snippet: `boolean check(String s, int len, int reps) {
    if (len * reps == s.length())
        return s.substring(0, len).repeat(reps).equals(s);
    if (len * reps > s.length()) return check(s, len + 1, s.length() / (len + 1));
    return check(s, len, reps + 1);
}
// Initial call: check(s, 1, s.length())`,
      },
      stream: {
        hint: "Stream divisor lengths of s, check if any repeated prefix reconstructs s",
        snippet: `return IntStream.rangeClosed(1, s.length()/2)
    .filter(len -> s.length() % len == 0)
    .anyMatch(len -> s.substring(0, len).repeat(s.length()/len).equals(s));`,
      },
    },
    {
      id: 33,
      title: "Find all permutations of a string",
      problem:
        "Given a string s, return all possible permutations of its characters.",
      examples: [
        { input: 's = "abc"', output: '["abc","acb","bac","bca","cab","cba"]' },
        { input: 's = "ab"', output: '["ab","ba"]' },
      ],
      tip: "Backtrack: swap current index with each subsequent index, recurse, then swap back",
      iteration: {
        hint: "Iteratively generate permutations by inserting char at every position",
        snippet: `List<String> res=new ArrayList<>(); res.add("");
for(char c:s.toCharArray()){
    List<String> next=new ArrayList<>();
    for(String p:res)
        for(int i=0;i<=p.length();i++)
            next.add(p.substring(0,i)+c+p.substring(i));
    res=next;
}
return res;`,
      },
      recursion: {
        hint: "Fix each char at current position via swap, recurse, swap back",
        snippet: `void permute(char[] c, int start, List<String> res) {
    if (start==c.length) { res.add(new String(c)); return; }
    for(int i=start;i<c.length;i++){
        char t=c[start];c[start]=c[i];c[i]=t;
        permute(c,start+1,res);
        t=c[start];c[start]=c[i];c[i]=t;
    }
}`,
      },
      stream: {
        hint: "No built-in stream permutation; use recursive helper called from stream",
        snippet: `// Java streams don't have a built-in permutation combinator.
// Generate list via backtracking, then stream the result if needed:
// permutations.stream().distinct().sorted().collect(Collectors.toList());`,
      },
    },
    {
      id: 34,
      title:
        "Case-specific sort (uppercase before lowercase, relative order preserved)",
      problem:
        "Given a mixed-case string, return a string where uppercase letters appear before lowercase letters while preserving relative order inside each group.",
      examples: [
        { input: 's = "aBcDeF"', output: '"BDFace"' },
        { input: 's = "Java"', output: '"Java"' },
      ],
      tip: "Separate uppercase and lowercase, then interleave back in original positions",
      iteration: {
        hint: "Collect upper and lower chars separately; refill positions by original case",
        snippet: `Queue<Character> upper=new LinkedList<>(), lower=new LinkedList<>();
for(char c:s.toCharArray()){if(Character.isUpperCase(c))upper.add(c);else lower.add(c);}
Arrays.sort(upper.toArray()); Arrays.sort(lower.toArray());
StringBuilder sb=new StringBuilder();
for(char c:s.toCharArray()) sb.append(Character.isUpperCase(c)?upper.poll():lower.poll());
return sb.toString();`,
      },
      recursion: {
        hint: "Sort both halves via quicksort recursively, then merge back by original case",
        snippet: `// Collect, sort each group, then place recursively at original positions
// Similar to iteration but refill via recursive index traversal`,
      },
      stream: {
        hint: "Partition into upper/lower streams, sort each, recombine at original spots",
        snippet: `String upper=s.chars().filter(Character::isUpperCase).sorted()
    .collect(StringBuilder::new,(sb,c)->sb.append((char)c),StringBuilder::append).toString();
String lower=s.chars().filter(Character::isLowerCase).sorted()
    .collect(StringBuilder::new,(sb,c)->sb.append((char)c),StringBuilder::append).toString();
int ui=0,li=0; StringBuilder sb=new StringBuilder();
for(char c:s.toCharArray()) sb.append(Character.isUpperCase(c)?upper.charAt(ui++):lower.charAt(li++));
return sb.toString();`,
      },
    },
    {
      id: 35,
      title: "Check pangram (contains every letter of the alphabet)",
      problem:
        "Given a sentence, return true if it contains every English alphabet letter at least once.",
      examples: [
        { input: 's = "thequickbrownfoxjumpsoverthelazydog"', output: "true" },
        { input: 's = "leetcode"', output: "false" },
      ],
      tip: "Use a boolean[26] or Set; mark each letter present; verify all 26 are marked",
      iteration: {
        hint: "Mark each lowercase letter in a boolean array; check all 26 are true",
        snippet: `boolean[] seen=new boolean[26];
for(char c:s.toLowerCase().toCharArray())
    if(c>='a'&&c<='z') seen[c-'a']=true;
for(boolean b:seen) if(!b) return false;
return true;`,
      },
      recursion: {
        hint: "Add each char to set recursively; after full traversal check size == 26",
        snippet: `boolean pangram(String s, Set<Character> set, int i) {
    if(i==s.length()) return set.size()==26;
    char c=Character.toLowerCase(s.charAt(i));
    if(c>='a'&&c<='z') set.add(c);
    return pangram(s,set,i+1);
}`,
      },
      stream: {
        hint: "Stream chars, filter letters, map to lowercase, count distinct",
        snippet: `return s.toLowerCase().chars()
    .filter(c -> c >= 'a' && c <= 'z')
    .distinct()
    .count() == 26;`,
      },
    },
    {
      id: 36,
      title: "Reverse only vowels in a string",
      problem:
        "Given a string s, reverse only the vowels and keep all consonants in their original positions.",
      examples: [
        { input: 's = "hello"', output: '"holle"' },
        { input: 's = "leetcode"', output: '"leotcede"' },
      ],
      tip: "Two pointers: advance each until both point at vowels, then swap",
      iteration: {
        hint: "Move l forward and r backward skipping consonants, then swap vowels",
        snippet: `Set<Character> vowels=Set.of('a','e','i','o','u','A','E','I','O','U');
char[] c=s.toCharArray(); int l=0,r=c.length-1;
while(l<r){
    while(l<r&&!vowels.contains(c[l]))l++;
    while(l<r&&!vowels.contains(c[r]))r--;
    if(l<r){char t=c[l];c[l++]=c[r];c[r--]=t;}
}
return new String(c);`,
      },
      recursion: {
        hint: "Skip non-vowels, swap outermost vowels, recurse inward",
        snippet: `void revVowels(char[] c, Set<Character> v, int l, int r) {
    if(l>=r) return;
    while(l<r&&!v.contains(c[l]))l++;
    while(l<r&&!v.contains(c[r]))r--;
    if(l<r){char t=c[l];c[l]=c[r];c[r]=t;revVowels(c,v,l+1,r-1);}
}`,
      },
      stream: {
        hint: "Collect vowels in order, reverse them, then reinsert into original positions",
        snippet: `Set<Character> v=Set.of('a','e','i','o','u','A','E','I','O','U');
char[] c=s.toCharArray();
List<Character> vowels=IntStream.range(0,c.length).filter(i->v.contains(c[i]))
    .mapToObj(i->c[i]).collect(Collectors.toList());
Collections.reverse(vowels);
int vi=0;
for(int i=0;i<c.length;i++) if(v.contains(c[i])) c[i]=vowels.get(vi++);
return new String(c);`,
      },
    },
    {
      id: 37,
      title: "Valid parentheses string (with wildcards *)",
      problem:
        "Given a string containing (, ), and *, return true if * can be treated as (, ), or empty so the string is valid.",
      examples: [
        { input: 's = "(*)"', output: "true" },
        { input: 's = "(*))"', output: "true" },
      ],
      tip: "Track min and max possible open counts; '*' can be '(', ')' or ''",
      iteration: {
        hint: "Track lo/hi range of possible open counts; invalid if hi < 0",
        snippet: `int lo=0, hi=0;
for(char c:s.toCharArray()){
    if(c=='('){lo++;hi++;}
    else if(c==')'){lo--;hi--;}
    else{lo--;hi++;} // '*' case
    if(hi<0) return false;
    lo=Math.max(lo,0);
}
return lo==0;`,
      },
      recursion: {
        hint: "Try '*' as each of '(', ')', '' recursively with memoization on (i, count)",
        snippet: `boolean valid(String s, int i, int open, Boolean[][] memo) {
    if(open<0) return false;
    if(i==s.length()) return open==0;
    if(memo[i][open]!=null) return memo[i][open];
    char c=s.charAt(i);
    return memo[i][open]= c=='('?valid(s,i+1,open+1,memo)
        :c==')'?valid(s,i+1,open-1,memo)
        :valid(s,i+1,open+1,memo)||valid(s,i+1,open-1,memo)||valid(s,i+1,open,memo);
}`,
      },
      stream: {
        hint: "No clean stream approach; lo/hi range tracking is the key insight",
        snippet: `// The lo/hi greedy solution is the cleanest; streams don't model range state.
// Key: hi tracks max open, lo tracks min open; '*' expands both ends.`,
      },
    },
    {
      id: 38,
      title: "Remove minimum invalid parentheses",
      problem:
        "Given a string containing parentheses and letters, remove the minimum number of invalid parentheses to make it valid and return one valid result.",
      examples: [
        { input: 's = "lee(t(c)o)de)"', output: '"lee(t(c)o)de"' },
        { input: 's = "a)b(c)d"', output: '"ab(c)d"' },
      ],
      tip: "BFS level by level removing one parenthesis at a time; return first valid level",
      iteration: {
        hint: "BFS: try removing each '(' or ')' one at a time; stop at first valid strings",
        snippet: `Set<String> visited=new HashSet<>(); Queue<String> q=new LinkedList<>();
q.add(s); visited.add(s); boolean found=false;
List<String> res=new ArrayList<>();
while(!q.isEmpty()){
    String cur=q.poll();
    if(isValid(cur)){res.add(cur);found=true;}
    if(found) continue;
    for(int i=0;i<cur.length();i++){
        if(cur.charAt(i)!='('&&cur.charAt(i)!=')') continue;
        String next=cur.substring(0,i)+cur.substring(i+1);
        if(visited.add(next)) q.add(next);
    }
}
return res;`,
      },
      recursion: {
        hint: "DFS with memoization on (index, leftCount, rightCount, removals)",
        snippet: `void dfs(String s, int i, int l, int r, StringBuilder cur, Set<String> res) {
    if(i==s.length()){if(l==0&&r==0)res.add(cur.toString());return;}
    char c=s.charAt(i);
    if(c=='('&&l>0) dfs(s,i+1,l-1,r,cur,res); // remove
    if(c==')'&&r>0) dfs(s,i+1,l,r-1,cur,res); // remove
    cur.append(c);
    if(c!='('&&c!=')') dfs(s,i+1,l,r,cur,res);
    else if(c=='(') dfs(s,i+1,l,r+1,cur,res);
    else if(r>0) {cur.deleteCharAt(cur.length()-1);return;} else dfs(s,i+1,l,r-1,cur,res);
    cur.deleteCharAt(cur.length()-1);
}`,
      },
      stream: {
        hint: "BFS is the natural approach; no stream equivalent for level-order search",
        snippet: `// BFS is inherently stateful and level-based; streams can't replicate it cleanly.
// Use the Queue-based BFS approach for correctness and efficiency.`,
      },
    },
    {
      id: 39,
      title: "Shortest palindrome (prepend minimum chars to make palindrome)",
      problem:
        "Given a string s, add the fewest characters to the front so the whole string becomes a palindrome, and return the result.",
      examples: [
        { input: 's = "aacecaaa"', output: '"aaacecaaa"' },
        { input: 's = "abcd"', output: '"dcbabcd"' },
      ],
      tip: "Find longest palindromic prefix using KMP on s + '#' + reverse(s)",
      iteration: {
        hint: "KMP failure function on s+'#'+rev gives length of longest palindromic prefix",
        snippet: `String rev=new StringBuilder(s).reverse().toString();
String t=s+"#"+rev;
int[] kmp=new int[t.length()]; int j=0;
for(int i=1;i<t.length();i++){
    while(j>0&&t.charAt(i)!=t.charAt(j))j=kmp[j-1];
    if(t.charAt(i)==t.charAt(j))j++;
    kmp[i]=j;
}
return rev.substring(0,s.length()-kmp[t.length()-1])+s;`,
      },
      recursion: {
        hint: "Find longest palindromic prefix by expanding; prepend remaining suffix",
        snippet: `String shortestPalin(String s) {
    if(s.isEmpty()||isPalin(s)) return s;
    if(s.charAt(0)==s.charAt(s.length()-1))
        return s.charAt(0)+shortestPalin(s.substring(1,s.length()-1))+s.charAt(s.length()-1);
    String addFront=shortestPalin(s.substring(0,s.length()-1));
    String addBack=shortestPalin(s.substring(1));
    // Pick the one that needs fewer insertions
    return addFront.length()<addBack.length()?s.charAt(s.length()-1)+addFront:addBack+s.charAt(0);
}`,
      },
      stream: {
        hint: "No stream solution; KMP prefix table is the O(n) approach",
        snippet: `// KMP on concatenated string is the canonical O(n) solution.
// The reverse + '#' + original trick avoids false matches in the middle.`,
      },
    },
    {
      id: 40,
      title: "String to int with overflow handling",
      problem:
        "Given a string representation of an integer, convert it to int while handling optional sign, invalid suffixes, and 32-bit overflow.",
      examples: [
        { input: 's = "4193 with words"', output: "4193" },
        { input: 's = "91283472332"', output: "2147483647" },
      ],
      tip: "Check overflow BEFORE multiplying: if result > INT_MAX/10, it will overflow",
      iteration: {
        hint: "Build digit by digit; before each step check if result exceeds INT_MAX/10",
        snippet: `int i=0, sign=1; int result=0;
while(i<s.length()&&s.charAt(i)==' ')i++;
if(i<s.length()&&(s.charAt(i)=='+'||s.charAt(i)=='-'))sign=s.charAt(i++)=='-'?-1:1;
while(i<s.length()&&Character.isDigit(s.charAt(i))){
    int d=s.charAt(i++)-'0';
    if(result>Integer.MAX_VALUE/10||(result==Integer.MAX_VALUE/10&&d>7))
        return sign==1?Integer.MAX_VALUE:Integer.MIN_VALUE;
    result=result*10+d;
}
return sign*result;`,
      },
      recursion: {
        hint: "Recurse accumulating result; check overflow at each step before returning",
        snippet: `int parse(String s, int i, long acc, int sign) {
    if(i==s.length()||!Character.isDigit(s.charAt(i)))
        return (int)Math.min(Math.max(acc*sign,Integer.MIN_VALUE),Integer.MAX_VALUE);
    acc=acc*10+(s.charAt(i)-'0');
    if(acc>Integer.MAX_VALUE) return sign>0?Integer.MAX_VALUE:Integer.MIN_VALUE;
    return parse(s,i+1,acc,sign);
}`,
      },
      stream: {
        hint: "Use regex to extract number string, then clamp with Long.parseLong",
        snippet: `java.util.regex.Matcher m=java.util.regex.Pattern.compile("^\\s*([+-]?\\d+)").matcher(s);
if(!m.find()) return 0;
long v=Long.parseLong(m.group(1));
return (int)Math.min(Math.max(v,(long)Integer.MIN_VALUE),(long)Integer.MAX_VALUE);`,
      },
    },
    {
      id: 41,
      title: "Longest common subsequence (LCS) between two strings",
      problem:
        "Given two strings, return the length of the longest sequence of characters that appears in both strings in the same relative order.",
      examples: [
        { input: 'text1 = "abcde", text2 = "ace"', output: "3" },
        { input: 'text1 = "abc", text2 = "def"', output: "0" },
      ],
      tip: "DP table: dp[i][j] = LCS of s1[0..i-1] and s2[0..j-1]; match adds 1",
      iteration: {
        hint: "Fill DP bottom-up; on char match: dp[i][j]=dp[i-1][j-1]+1, else max of two",
        snippet: `int m=s1.length(), n=s2.length();
int[][] dp=new int[m+1][n+1];
for(int i=1;i<=m;i++)
    for(int j=1;j<=n;j++)
        dp[i][j]=s1.charAt(i-1)==s2.charAt(j-1)?dp[i-1][j-1]+1:Math.max(dp[i-1][j],dp[i][j-1]);
return dp[m][n];`,
      },
      recursion: {
        hint: "If last chars match: 1 + LCS(rest); else max of LCS with one char dropped",
        snippet: `int lcs(String a, String b, int i, int j, int[][] memo) {
    if(i==0||j==0) return 0;
    if(memo[i][j]!=-1) return memo[i][j];
    if(a.charAt(i-1)==b.charAt(j-1)) return memo[i][j]=1+lcs(a,b,i-1,j-1,memo);
    return memo[i][j]=Math.max(lcs(a,b,i-1,j,memo),lcs(a,b,i,j-1,memo));
}`,
      },
      stream: {
        hint: "No stream for LCS; DP is the canonical O(mn) solution",
        snippet: `// LCS requires a 2D DP table — inherently iterative.
// After filling dp[][], traceback to reconstruct the actual subsequence if needed.`,
      },
    },
    {
      id: 42,
      title: "Word break (can string be segmented using dictionary words)",
      problem:
        "Given a string s and a dictionary of words, return true if s can be segmented into one or more dictionary words.",
      examples: [
        { input: 's = "leetcode", dict = ["leet","code"]', output: "true" },
        {
          input: 's = "catsandog", dict = ["cats","dog","sand","and","cat"]',
          output: "false",
        },
      ],
      tip: "DP: dp[i] = true if s[0..i-1] can be segmented; check all end positions j<i",
      iteration: {
        hint: "dp[i] = any dp[j] where dp[j] is true and s[j..i] is in dict",
        snippet: `Set<String> dict=new HashSet<>(wordDict);
boolean[] dp=new boolean[s.length()+1]; dp[0]=true;
for(int i=1;i<=s.length();i++)
    for(int j=0;j<i;j++)
        if(dp[j]&&dict.contains(s.substring(j,i))){ dp[i]=true; break; }
return dp[s.length()];`,
      },
      recursion: {
        hint: "Memoized: try every prefix; if in dict recurse on suffix",
        snippet: `boolean wb(String s, Set<String> dict, int start, Boolean[] memo) {
    if(start==s.length()) return true;
    if(memo[start]!=null) return memo[start];
    for(int end=start+1;end<=s.length();end++)
        if(dict.contains(s.substring(start,end))&&wb(s,dict,end,memo))
            return memo[start]=true;
    return memo[start]=false;
}`,
      },
      stream: {
        hint: "DP array built iteratively; stream can check valid split points",
        snippet: `Set<String> dict=new HashSet<>(wordDict);
boolean[] dp=new boolean[s.length()+1]; dp[0]=true;
IntStream.rangeClosed(1,s.length()).forEach(i->
    dp[i]=IntStream.range(0,i).anyMatch(j->dp[j]&&dict.contains(s.substring(j,i))));
return dp[s.length()];`,
      },
    },
    {
      id: 43,
      title: "Longest palindromic subsequence",
      problem:
        "Given a string s, return the length of the longest subsequence that is a palindrome.",
      examples: [
        { input: 's = "bbbab"', output: "4" },
        { input: 's = "cbbd"', output: "2" },
      ],
      tip: "LPS(s) = LCS(s, reverse(s)); or DP: if ends match, add 2; else max of sides",
      iteration: {
        hint: "dp[i][j] = LPS of s[i..j]; expand from length 1 up to full string",
        snippet: `int n=s.length();
int[][] dp=new int[n][n];
for(int i=0;i<n;i++) dp[i][i]=1;
for(int len=2;len<=n;len++)
    for(int i=0;i<=n-len;i++){
        int j=i+len-1;
        dp[i][j]=s.charAt(i)==s.charAt(j)?dp[i+1][j-1]+2:Math.max(dp[i+1][j],dp[i][j-1]);
    }
return dp[0][n-1];`,
      },
      recursion: {
        hint: "Match ends: 2+lps(i+1,j-1); mismatch: max(lps(i+1,j),lps(i,j-1))",
        snippet: `int lps(String s, int i, int j, int[][] memo) {
    if(i>j) return 0;
    if(i==j) return 1;
    if(memo[i][j]!=-1) return memo[i][j];
    if(s.charAt(i)==s.charAt(j)) return memo[i][j]=2+lps(s,i+1,j-1,memo);
    return memo[i][j]=Math.max(lps(s,i+1,j,memo),lps(s,i,j-1,memo));
}`,
      },
      stream: {
        hint: "Use LCS(s, reverse(s)) which can be computed with the LCS DP solution",
        snippet: `String rev=new StringBuilder(s).reverse().toString();
// Now compute LCS(s, rev) using standard LCS DP
// return lcs(s, rev); — elegant reduction!`,
      },
    },
    {
      id: 44,
      title: "Check if two strings are k-anagrams",
      problem:
        "Given two strings and integer k, return true if they can become anagrams after changing at most k characters.",
      examples: [
        { input: 's1 = "anagram", s2 = "grammar", k = 3', output: "true" },
        { input: 's1 = "geeks", s2 = "eggkf", k = 1', output: "false" },
      ],
      tip: "Count char frequencies; if total differing chars between both is <= 2*k, they are k-anagrams",
      iteration: {
        hint: "Difference in freq counts; number of chars to change must be <= k",
        snippet: `if(s1.length()!=s2.length()) return false;
int[] freq=new int[26];
for(int i=0;i<s1.length();i++){
    freq[s1.charAt(i)-'a']++;
    freq[s2.charAt(i)-'a']--;
}
int diff=0;
for(int f:freq) if(f>0) diff+=f; // count excess chars in s1
return diff<=k;`,
      },
      recursion: {
        hint: "Build freq array recursively; count positive differences vs k",
        snippet: `void buildFreq(String s1, String s2, int[] freq, int i) {
    if(i==s1.length()) return;
    freq[s1.charAt(i)-'a']++; freq[s2.charAt(i)-'a']--;
    buildFreq(s1,s2,freq,i+1);
}
// then sum positive values and compare to k`,
      },
      stream: {
        hint: "Stream frequency differences, sum positives, compare to k",
        snippet: `int[] freq=new int[26];
s1.chars().forEach(c->freq[c-'a']++);
s2.chars().forEach(c->freq[c-'a']--);
return IntStream.of(freq).filter(f->f>0).sum()<=k;`,
      },
    },
    {
      id: 45,
      title: "Implement run-length encoding and decoding",
      problem:
        "Given a string, encode it using run-length encoding, and decode an encoded string back to the original form.",
      examples: [
        { input: 'encode("aaabb")', output: '"a3b2"' },
        { input: 'decode("a3b2")', output: '"aaabb"' },
      ],
      tip: "Encoding: count consecutive chars; decoding: parse count + char pairs",
      iteration: {
        hint: "Encode: count runs; Decode: read digit(s) then char, repeat char that many times",
        snippet: `// Encode
String encode(String s){
    StringBuilder sb=new StringBuilder(); int i=0;
    while(i<s.length()){char c=s.charAt(i);int cnt=0;while(i<s.length()&&s.charAt(i)==c){i++;cnt++;}sb.append(cnt).append(c);}
    return sb.toString();
}
// Decode
String decode(String s){
    StringBuilder sb=new StringBuilder(); int i=0;
    while(i<s.length()){int n=0;while(Character.isDigit(s.charAt(i)))n=n*10+(s.charAt(i++)-'0');char c=s.charAt(i++);sb.append(String.valueOf(c).repeat(n));}
    return sb.toString();
}`,
      },
      recursion: {
        hint: "Encode: count current run, append, recurse at i+runLen; Decode: similarly",
        snippet: `void encode(String s, int i, StringBuilder sb) {
    if(i>=s.length()) return;
    char c=s.charAt(i); int cnt=0;
    while(i+cnt<s.length()&&s.charAt(i+cnt)==c) cnt++;
    sb.append(cnt).append(c);
    encode(s,i+cnt,sb);
}`,
      },
      stream: {
        hint: "Use regex to find all runs for encoding; split on digit-char pairs for decoding",
        snippet: `// Encode via regex
java.util.regex.Matcher m=java.util.regex.Pattern.compile("(.)\\\\1*").matcher(s);
StringBuilder sb=new StringBuilder();
while(m.find()) sb.append(m.group().length()).append(m.group().charAt(0));
return sb.toString();`,
      },
    },
    {
      id: 46,
      title: "Find smallest window containing all characters of another string",
      problem:
        "Given strings s and pattern p, return the smallest substring in s containing all characters of p.",
      examples: [
        { input: 's = "timetopractice", p = "toc"', output: '"toprac"' },
        { input: 's = "zoomlazapzo", p = "oza"', output: '"apzo"' },
      ],
      tip: "Same as minimum window substring (#15): sliding window with two freq maps",
      iteration: {
        hint: "Identical to Q15; expand right until all chars covered, shrink left to minimize",
        snippet: `Map<Character,Integer> need=new HashMap<>();
for(char c:t.toCharArray()) need.merge(c,1,Integer::sum);
int l=0,matched=0,minLen=Integer.MAX_VALUE,start=0;
Map<Character,Integer> window=new HashMap<>();
for(int r=0;r<s.length();r++){
    char c=s.charAt(r); window.merge(c,1,Integer::sum);
    if(need.containsKey(c)&&window.get(c).equals(need.get(c))) matched++;
    while(matched==need.size()){if(r-l+1<minLen){minLen=r-l+1;start=l;}window.merge(s.charAt(l),-1,Integer::sum);if(need.containsKey(s.charAt(l))&&window.get(s.charAt(l))<need.get(s.charAt(l)))matched--;l++;}
}
return minLen==Integer.MAX_VALUE?"":s.substring(start,start+minLen);`,
      },
      recursion: {
        hint: "Sliding window state is hard to recurse; iterative two-pointer is canonical",
        snippet: `// This is a classic sliding window problem.
// Recursion does not improve over the O(n) two-pointer approach.`,
      },
      stream: {
        hint: "Streams can't maintain sliding window state; use iterative approach",
        snippet: `// The two-pointer sliding window (see iteration) is the right solution.
// No meaningful stream simplification exists for this problem.`,
      },
    },
    {
      id: 47,
      title: "Count and print all palindromic substrings",
      problem:
        "Given a string s, find every contiguous substring that is a palindrome and count them.",
      examples: [
        { input: 's = "aaa"', output: "6" },
        { input: 's = "abc"', output: "3" },
      ],
      tip: "Expand around each center (odd and even length); count all expansions",
      iteration: {
        hint: "For each center expand while chars match; count each valid expansion",
        snippet: `int count=0;
for(int i=0;i<s.length();i++){
    // Odd length
    for(int l=i,r=i;l>=0&&r<s.length()&&s.charAt(l)==s.charAt(r);l--,r++) count++;
    // Even length
    for(int l=i,r=i+1;l>=0&&r<s.length()&&s.charAt(l)==s.charAt(r);l--,r++) count++;
}
return count;`,
      },
      recursion: {
        hint: "Recursively expand from center; count each palindrome found",
        snippet: `int expand(String s, int l, int r) {
    if(l<0||r>=s.length()||s.charAt(l)!=s.charAt(r)) return 0;
    return 1+expand(s,l-1,r+1);
}
// Sum for all centers: expand(s,i,i)+expand(s,i,i+1)`,
      },
      stream: {
        hint: "Stream centers, expand each, sum palindrome counts",
        snippet: `return IntStream.range(0, s.length()).map(i ->
    expand(s,i,i)+expand(s,i,i+1)).sum();
// expand() defined as: count valid palindromes from center`,
      },
    },
    {
      id: 48,
      title: "Longest common substring (not subsequence)",
      problem:
        "Given two strings, return the length of the longest contiguous substring present in both strings.",
      examples: [
        { input: 's1 = "abcdxyz", s2 = "xyzabcd"', output: "4" },
        { input: 's1 = "abc", s2 = "def"', output: "0" },
      ],
      tip: "DP: dp[i][j] = length of common substring ending at s1[i-1] and s2[j-1]",
      iteration: {
        hint: "On char match: dp[i][j]=dp[i-1][j-1]+1; track running max",
        snippet: `int m=s1.length(),n=s2.length(),max=0;
int[][] dp=new int[m+1][n+1];
for(int i=1;i<=m;i++)
    for(int j=1;j<=n;j++)
        if(s1.charAt(i-1)==s2.charAt(j-1)){
            dp[i][j]=dp[i-1][j-1]+1; max=Math.max(max,dp[i][j]);
        }
return max;`,
      },
      recursion: {
        hint: "Track match length at each position; memoize (i,j,currentLen)",
        snippet: `int lcs(String a, String b, int i, int j, int cur, int[] max) {
    if(i==a.length()||j==b.length()) return max[0];
    if(a.charAt(i)==b.charAt(j)){max[0]=Math.max(max[0],cur+1);lcs(a,b,i+1,j+1,cur+1,max);}
    lcs(a,b,i+1,j,0,max); lcs(a,b,i,j+1,0,max);
    return max[0];
}`,
      },
      stream: {
        hint: "No clean stream for 2D DP; iterative bottom-up is O(mn) and clear",
        snippet: `// 2D DP table doesn't map to stream operations.
// Use the iterative DP approach — it's O(m*n) time and space.`,
      },
    },
    {
      id: 49,
      title:
        "Check if string becomes palindrome by removing exactly one character",
      problem:
        "Given a string s, return true if removing exactly one character can make it a palindrome.",
      examples: [
        { input: 's = "abca"', output: "true" },
        { input: 's = "abc"', output: "false" },
      ],
      tip: "Two pointers; on first mismatch check isPalin(l+1,r) OR isPalin(l,r-1)",
      iteration: {
        hint: "Same as Q17: on mismatch, try skipping either left or right char",
        snippet: `int l=0,r=s.length()-1;
while(l<r){
    if(s.charAt(l)!=s.charAt(r))
        return isPalin(s,l+1,r)||isPalin(s,l,r-1);
    l++;r--;
}
return true; // already palindrome, can remove any middle char`,
      },
      recursion: {
        hint: "Recurse inward; on mismatch branch into skipping left or right",
        snippet: `boolean check(String s, int l, int r, boolean used) {
    if(l>=r) return true;
    if(s.charAt(l)==s.charAt(r)) return check(s,l+1,r-1,used);
    if(used) return false;
    return check(s,l+1,r,true)||check(s,l,r-1,true);
}`,
      },
      stream: {
        hint: "On mismatch, test both shorter substrings for palindrome property",
        snippet: `// Helper: boolean isPalin(String s, int l, int r)
// On first mismatch: return isPalin(s,l+1,r) || isPalin(s,l,r-1)
// Streams don't simplify this; two-pointer is the clean approach.`,
      },
    },
    {
      id: 50,
      title: "Basic text justification (word-wrap to width W)",
      problem:
        "Given words and a maximum width W, pack words into lines so each line has length at most W and is padded or spaced as required.",
      examples: [
        {
          input: 'words = ["This","is","text"], W = 8',
          output: '["This  is", "text    "]',
        },
        {
          input: 'words = ["hello","world"], W = 5',
          output: '["hello", "world"]',
        },
      ],
      tip: "Greedily fit words per line; distribute spaces evenly, extra spaces go left",
      iteration: {
        hint: "Group words per line greedily; for each line compute space distribution",
        snippet: `List<String> result=new ArrayList<>();
int i=0;
while(i<words.length){
    int len=words[i].length(),j=i+1;
    while(j<words.length&&len+1+words[j].length()<=maxWidth) len+=1+words[j++].length();
    StringBuilder sb=new StringBuilder();
    int spaces=maxWidth-len+(j-i-1); int gaps=j-i-1;
    sb.append(words[i]);
    for(int k=i+1;k<j;k++){sb.append(" ".repeat(gaps>0?1+spaces/(gaps):1));if(k-i<=spaces%gaps)sb.append(" ");sb.append(words[k]);}
    while(sb.length()<maxWidth)sb.append(" ");
    result.add(sb.toString()); i=j;
}
return result;`,
      },
      recursion: {
        hint: "Greedy line-filling is inherently iterative; DFS explores all splits",
        snippet: `// Recursion explores all line-break choices — exponential without memoization.
// Greedy approach is the standard algorithm for text justification.`,
      },
      stream: {
        hint: "Build line groups via collect then format each line group",
        snippet: `// Line-grouping is a greedy algorithm; stream collect can group words.
// Stream each line group, apply space distribution, collect to list.`,
      },
    },
    {
      id: 51,
      title: "Minimum insertions to make a string a palindrome",
      problem:
        "Given a string s, return the minimum number of insertions needed to make it a palindrome.",
      examples: [
        { input: 's = "zzazz"', output: "0" },
        { input: 's = "mbadm"', output: "2" },
      ],
      tip: "min insertions = s.length() - LPS(s); or DP on intervals directly",
      iteration: {
        hint: "LPS = LCS(s, reverse(s)); insertions = n - LPS",
        snippet: `String rev=new StringBuilder(s).reverse().toString();
int n=s.length();
int[][] dp=new int[n+1][n+1];
for(int i=1;i<=n;i++)
    for(int j=1;j<=n;j++)
        dp[i][j]=s.charAt(i-1)==rev.charAt(j-1)?dp[i-1][j-1]+1:Math.max(dp[i-1][j],dp[i][j-1]);
return n-dp[n][n]; // n - LPS length`,
      },
      recursion: {
        hint: "On match: recurse(i+1,j-1); else 1+min(recurse skip left, skip right)",
        snippet: `int minIns(String s, int i, int j, int[][] memo) {
    if(i>=j) return 0;
    if(memo[i][j]!=-1) return memo[i][j];
    if(s.charAt(i)==s.charAt(j)) return memo[i][j]=minIns(s,i+1,j-1,memo);
    return memo[i][j]=1+Math.min(minIns(s,i+1,j,memo),minIns(s,i,j-1,memo));
}`,
      },
      stream: {
        hint: "n - LPS(s) is the key identity; LPS computed via LCS DP",
        snippet: `// Reduction: minInsertions(s) = s.length() - lcs(s, reverse(s))
// Use LCS DP, then subtract from length.`,
      },
    },
    {
      id: 52,
      title: 'Compare version numbers (e.g. "1.01" vs "1.001")',
      problem:
        "Given two version strings, compare their numeric revision parts and return -1, 0, or 1.",
      examples: [
        { input: 'version1 = "1.01", version2 = "1.001"', output: "0" },
        { input: 'version1 = "1.0", version2 = "1.0.1"', output: "-1" },
      ],
      tip: "Split on '.', parse each part as integer (drops leading zeros), compare part by part",
      iteration: {
        hint: "Split both, compare integer-parsed parts; treat missing parts as 0",
        snippet: `String[] v1=version1.split("\\\\."), v2=version2.split("\\\\.");
int n=Math.max(v1.length,v2.length);
for(int i=0;i<n;i++){
    int a=i<v1.length?Integer.parseInt(v1[i]):0;
    int b=i<v2.length?Integer.parseInt(v2[i]):0;
    if(a!=b) return Integer.compare(a,b);
}
return 0;`,
      },
      recursion: {
        hint: "Compare current segment, recurse on remaining with i+1",
        snippet: `int compare(String[] v1, String[] v2, int i, int n) {
    if(i==n) return 0;
    int a=i<v1.length?Integer.parseInt(v1[i]):0;
    int b=i<v2.length?Integer.parseInt(v2[i]):0;
    if(a!=b) return Integer.compare(a,b);
    return compare(v1,v2,i+1,n);
}`,
      },
      stream: {
        hint: "Zip version segments via IntStream, parse as int, find first difference",
        snippet: `String[] v1=version1.split("\\\\."), v2=version2.split("\\\\.");
int n=Math.max(v1.length,v2.length);
return IntStream.range(0,n)
    .map(i->Integer.compare(i<v1.length?Integer.parseInt(v1[i]):0, i<v2.length?Integer.parseInt(v2[i]):0))
    .filter(c->c!=0).findFirst().orElse(0);`,
      },
    },
    {
      id: 53,
      title:
        "Find all starting indices of anagram substrings of pattern in string",
      problem:
        "Given a string s and pattern p, return all starting indices where an anagram of p appears in s.",
      examples: [
        { input: 's = "cbaebabacd", p = "abc"', output: "[0,6]" },
        { input: 's = "abab", p = "ab"', output: "[0,1,2]" },
      ],
      tip: "Sliding window with two frequency arrays; add match indices when arrays equal",
      iteration: {
        hint: "Fixed window of size p.length(); maintain freq count; compare to pattern freq",
        snippet: `int[] pf=new int[26], wf=new int[26]; List<Integer> res=new ArrayList<>();
for(char c:p.toCharArray()) pf[c-'a']++;
for(int i=0;i<s.length();i++){
    wf[s.charAt(i)-'a']++;
    if(i>=p.length()) wf[s.charAt(i-p.length())-'a']--;
    if(Arrays.equals(pf,wf)) res.add(i-p.length()+1);
}
return res;`,
      },
      recursion: {
        hint: "Sliding window is iterative; recursion adds no benefit for fixed-size window",
        snippet: `// Fixed-size sliding window is O(n) iteratively.
// Recursion would be O(n*26) checking frequency arrays at each step.
// Stick with the iterative approach.`,
      },
      stream: {
        hint: "Stream indices; filter those where substring is an anagram of pattern",
        snippet: `int[] pf=new int[26];
for(char c:p.toCharArray()) pf[c-'a']++;
return IntStream.rangeClosed(0, s.length()-p.length())
    .filter(i->{ int[] wf=new int[26]; s.substring(i,i+p.length()).chars().forEach(c->wf[c-'a']++); return Arrays.equals(pf,wf); })
    .boxed().collect(Collectors.toList());`,
      },
    },
    {
      id: 54,
      title: "Convert a sentence to title case (handle multiple spaces)",
      problem:
        "Given a sentence, convert each word to title case while handling multiple spaces cleanly.",
      examples: [
        { input: 's = "hello world"', output: '"Hello World"' },
        { input: 's = "  java   interview "', output: '"Java Interview"' },
      ],
      tip: "Split on whitespace to handle multiple spaces, capitalize first letter of each word",
      iteration: {
        hint: "Split by \\s+ (handles multiple spaces), capitalize each word, rejoin",
        snippet: `String[] words=s.trim().split("\\s+");
StringBuilder sb=new StringBuilder();
for(String w:words){
    if(sb.length()>0) sb.append(' ');
    sb.append(Character.toUpperCase(w.charAt(0))).append(w.substring(1).toLowerCase());
}
return sb.toString();`,
      },
      recursion: {
        hint: "Capitalize current word, recurse on rest of words array",
        snippet: `String titleCase(String[] words, int i) {
    if(i==words.length) return "";
    String w=words[i];
    String cap=Character.toUpperCase(w.charAt(0))+w.substring(1).toLowerCase();
    String rest=titleCase(words,i+1);
    return rest.isEmpty()?cap:cap+" "+rest;
}`,
      },
      stream: {
        hint: "Stream words, map each to capitalized form, join with single space",
        snippet: `return Arrays.stream(s.trim().split("\\s+"))
    .map(w -> Character.toUpperCase(w.charAt(0)) + w.substring(1).toLowerCase())
    .collect(Collectors.joining(" "));`,
      },
    },
    {
      id: 55,
      title: "Implement Caesar cipher encode/decode",
      problem:
        "Given text and a shift value, encode by shifting letters forward in the alphabet and decode by shifting them back.",
      examples: [
        { input: 'text = "abc", shift = 2', output: 'encode -> "cde"' },
        { input: 'text = "cde", shift = 2', output: 'decode -> "abc"' },
      ],
      tip: "Shift each letter by key; use modulo 26 to wrap; decode by shifting by (26-key)",
      iteration: {
        hint: "For each char, if letter shift by key mod 26; preserve case and non-letters",
        snippet: `StringBuilder sb=new StringBuilder();
for(char c:text.toCharArray()){
    if(Character.isLetter(c)){
        char base=Character.isUpperCase(c)?'A':'a';
        sb.append((char)(base+(c-base+shift+26)%26));
    } else sb.append(c);
}
return sb.toString();
// Decode: call encode(text, 26-shift)`,
      },
      recursion: {
        hint: "Shift current char, recurse on rest of string",
        snippet: `String caesar(String s, int shift, int i) {
    if(i==s.length()) return "";
    char c=s.charAt(i);
    if(Character.isLetter(c)){
        char base=Character.isUpperCase(c)?'A':'a';
        c=(char)(base+(c-base+shift+26)%26);
    }
    return c+caesar(s,shift,i+1);
}`,
      },
      stream: {
        hint: "Map each char in IntStream, apply shift, collect to string",
        snippet: `return s.chars().map(c->{
    if(!Character.isLetter(c)) return c;
    int base=Character.isUpperCase(c)?'A':'a';
    return base+(c-base+shift+26)%26;
}).collect(StringBuilder::new,(sb,c)->sb.append((char)c),StringBuilder::append).toString();`,
      },
    },
  ],
};
