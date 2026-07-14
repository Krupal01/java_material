/* =========================================================
   Java Tricky Quiz — Question Bank
   ~100 questions across 10 sections.
   Loaded by quiz.html as window.QUIZ_DATA.
   Pure JSON-style data — easy to edit/extend.
   ========================================================= */
window.QUIZ_DATA = {
  title: "Java Tricky Interview Quiz",
  subtitle: "100 hand-picked output puzzles & concept traps across 10 topics.",
  sections: [
    {
      id: "arrays",
      title: "Arrays",
      icon: "📦",
      color: "#fbbf24",
      blurb:
        "Reference vs value, length field, default initialisation, multi-dimensional traps.",
      questions: [
        {
          id: "arr-1",
          title: "== between two int arrays with same content",
          code: "int[] a = {1, 2, 3};\nint[] b = {1, 2, 3};\nSystem.out.println(a == b);\nSystem.out.println(a.equals(b));\nSystem.out.println(Arrays.equals(a, b));",
          options: [
            "true, true, true",
            "false, false, true",
            "false, false, false",
            "true, false, true",
          ],
          answer: 1,
          explanation:
            "== compares references — different objects → false. Array.equals() inherits Object.equals() which is also reference equality → false. Arrays.equals() iterates and compares elements → true.",
        },
        {
          id: "arr-2",
          title: ".length is a field, not a method",
          code: "int[] arr = {10, 20, 30};\nSystem.out.println(arr.length);\nSystem.out.println(arr.length());",
          options: [
            "Both print 3",
            "First prints 3, second is a compile error",
            "Both give a compile error",
            "First gives error, second works",
          ],
          answer: 1,
          explanation:
            "Arrays expose .length as a final public field — no parentheses. .length() is a String method. Calling .length() on an array → compile error: 'cannot find symbol method length()'.",
        },
        {
          id: "arr-3",
          title: "Array of objects — default value",
          code: "Dog[] dogs = new Dog[3];\nSystem.out.println(dogs[0]);\ndogs[0].speak();",
          options: [
            "null, then NullPointerException",
            "Empty Dog object, then 'Woof'",
            "0, then compile error",
            "null, then prints nothing",
          ],
          answer: 0,
          explanation:
            "new Dog[3] allocates 3 slots, each initialised to null. dogs[0] prints null. Calling speak() on null throws NullPointerException.",
        },
        {
          id: "arr-4",
          title: "Multi-dimensional arrays — jagged shape",
          code: "int[][] m = new int[3][];\nm[0] = new int[]{1, 2};\nm[1] = new int[]{3, 4, 5};\nSystem.out.println(m[2].length);",
          options: [
            "0",
            "3",
            "NullPointerException",
            "ArrayIndexOutOfBoundsException",
          ],
          answer: 2,
          explanation:
            "new int[3][] allocates the outer array of 3 references, all null. m[2] was never assigned, so accessing .length on null → NullPointerException.",
        },
        {
          id: "arr-5",
          title: "Array covariance vs generics",
          code: "Object[] arr = new String[3];\narr[0] = 42;",
          options: [
            "Compiles and runs fine",
            "Compile error on assignment",
            "Compiles but throws ArrayStoreException",
            "Compiles but throws ClassCastException",
          ],
          answer: 2,
          explanation:
            "Arrays are covariant in Java — String[] IS-A Object[]. So the assignment compiles. At runtime, JVM checks element type and throws ArrayStoreException because Integer (boxed 42) isn't a String. This is exactly why generics are invariant.",
        },
        {
          id: "arr-6",
          title: "Arrays.asList — fixed-size view",
          code: "List<Integer> l = Arrays.asList(1, 2, 3);\nl.set(0, 99);\nl.add(4);",
          options: [
            "Both lines work",
            "set works, add throws UnsupportedOperationException",
            "Both throw exceptions",
            "set throws, add works",
          ],
          answer: 1,
          explanation:
            "Arrays.asList returns a fixed-size List backed by the array. set() works (updates the array), but add()/remove() throw UnsupportedOperationException because the underlying array can't resize.",
        },
        {
          id: "arr-7",
          title: "Array clone — deep or shallow?",
          code: "int[][] a = {{1,2},{3,4}};\nint[][] b = a.clone();\nb[0][0] = 99;\nSystem.out.println(a[0][0]);",
          options: ["1", "99", "0", "Compile error"],
          answer: 1,
          explanation:
            "Array.clone() is a SHALLOW copy. The outer array is duplicated, but inner array references are shared. Mutating b[0][0] also changes a[0][0] → prints 99.",
        },
        {
          id: "arr-8",
          title: "Arrays.toString vs deepToString",
          code: "int[][] m = {{1,2},{3,4}};\nSystem.out.println(Arrays.toString(m));",
          options: [
            "[[1, 2], [3, 4]]",
            "[1, 2, 3, 4]",
            "Something like [[I@1a2b]",
            "Compile error",
          ],
          answer: 2,
          explanation:
            "Arrays.toString prints one level only — each element is an int[] whose default toString is '[I@hashcode'. Use Arrays.deepToString() to get [[1, 2], [3, 4]].",
        },
        {
          id: "arr-9",
          title: "ArrayIndexOutOfBoundsException — when?",
          code: "int[] a = new int[5];\nSystem.out.println(a[5]);",
          options: [
            "Prints 0",
            "Prints null",
            "ArrayIndexOutOfBoundsException at runtime",
            "Compile error",
          ],
          answer: 2,
          explanation:
            "Valid indices are 0..length-1 (here 0..4). Index 5 is out of bounds — JVM throws ArrayIndexOutOfBoundsException at runtime (not compile time, since the index could be a variable).",
        },
        {
          id: "arr-10",
          title: "Negative array size",
          code: "int[] a = new int[-1];",
          options: [
            "Compile error",
            "Allocates empty array",
            "NegativeArraySizeException at runtime",
            "ArrayIndexOutOfBoundsException",
          ],
          answer: 2,
          explanation:
            "The compiler allows negative literals because the size could be a variable. At runtime, JVM throws NegativeArraySizeException.",
        },
        {
          id: "arr-11",
          title: "Default values in int[] vs Object[]",
          code: "int[] ints = new int[3];\nInteger[] boxed = new Integer[3];\nSystem.out.println(ints[0]);\nSystem.out.println(boxed[0]);",
          options: ["0, 0", "null, null", "0, null", "Compile error"],
          answer: 2,
          explanation:
            "Primitive arrays default to zero-equivalent (0, 0.0, false, '\\u0000'). Reference arrays default to null. Integer is a reference type so boxed[0] is null.",
        },
        {
          id: "arr-12",
          title: "System.arraycopy with overlapping ranges",
          code: "int[] a = {1,2,3,4,5};\nSystem.arraycopy(a, 0, a, 1, 4);\nSystem.out.println(Arrays.toString(a));",
          options: [
            "[1, 1, 2, 3, 4]",
            "[1, 1, 1, 1, 1]",
            "[1, 2, 3, 4, 5]",
            "Throws",
          ],
          answer: 0,
          explanation:
            "System.arraycopy guarantees correct behavior even on overlapping ranges (it copies as if into a temp buffer). Source [1,2,3,4] copied to positions 1-4 → [1,1,2,3,4].",
        },
        {
          id: "arr-13",
          title: "Arrays.fill on multi-dimensional",
          code: "int[][] m = new int[2][2];\nArrays.fill(m, new int[]{1,1});\nm[0][0] = 99;\nSystem.out.println(m[1][0]);",
          options: ["1", "99", "0", "Throws"],
          answer: 1,
          explanation:
            "Arrays.fill on a 2D outer array assigns the SAME reference to every slot. m[0] and m[1] are the same int[] → mutating m[0][0] also changes m[1][0] → prints 99. Use Arrays.setAll for independent rows.",
        },
        {
          id: "arr-14",
          title: "Arrays.sort on int[] vs Integer[]",
          code: "// int[] uses Dual-Pivot Quicksort (not stable)\n// Integer[] uses TimSort (stable)",
          options: [
            "Both use the same algorithm",
            "int[]: Dual-Pivot Quicksort; Integer[]: TimSort (stable)",
            "Both use TimSort",
            "Both use Quicksort",
          ],
          answer: 1,
          explanation:
            "Primitive arrays use Dual-Pivot Quicksort (fast, not stable — but stability is irrelevant for primitives). Object arrays use TimSort (stable, important when objects are equal-but-distinguishable).",
        },
        {
          id: "arr-15",
          title: "Varargs IS an array",
          code: "static void m(int... xs) { System.out.println(xs.getClass().getSimpleName()); }\nm(1, 2, 3);",
          options: ["int[]", "Integer[]", "List", "varargs"],
          answer: 0,
          explanation:
            "Varargs are syntactic sugar — at runtime, xs IS an int[]. You can pass an existing array too: m(new int[]{1,2,3}). getClass returns int[].",
        },
        {
          id: "arr-16",
          title: "List.toArray with generic type",
          code: 'List<String> l = List.of("a", "b");\nObject[] o = l.toArray();\nString[] s = l.toArray(new String[0]);',
          options: [
            "Both lines work",
            "First is compile error",
            "Second throws ArrayStoreException",
            "Both return Object[]",
          ],
          answer: 0,
          explanation:
            "toArray() returns Object[] (lossy). toArray(T[]) returns the right type. Idiom: pass new String[0] (size 0) — the JVM optimises this; passing the exact-size array is no faster in modern JVMs.",
        },
        {
          id: "arr-17",
          title: "Binary search on unsorted array",
          code: "int[] a = {3, 1, 4, 1, 5};\nint i = Arrays.binarySearch(a, 4);\nSystem.out.println(i);",
          options: [
            "2 — finds index of 4",
            "Throws — input must be sorted",
            "Undefined result — array MUST be sorted",
            "-1",
          ],
          answer: 2,
          explanation:
            "binarySearch precondition: array MUST be sorted. On unsorted input, behavior is undefined (returns some valid-looking index that may or may not be correct). No exception is thrown. Sort first.",
        },
        {
          id: "arr-18",
          title: "Binary search — element not found",
          code: "int[] a = {1, 3, 5, 7};\nint i = Arrays.binarySearch(a, 4);\nSystem.out.println(i);",
          options: ["-1", "-3", "3", "Throws"],
          answer: 1,
          explanation:
            "When not found, binarySearch returns -(insertionPoint + 1). 4 would go at index 2 → -(2+1) = -3. To get insertion point: -result - 1. Useful for 'find the position to insert' patterns.",
        },
        {
          id: "arr-19",
          title: "Stream to array",
          code: 'int[] arr = Stream.of(1, 2, 3).mapToInt(Integer::intValue).toArray();\nString[] strs = Stream.of("a", "b").toArray(String[]::new);',
          options: [
            "Both correct",
            "First compile error — no toArray on IntStream",
            "Second returns Object[]",
            "Both throw",
          ],
          answer: 0,
          explanation:
            "Stream<Integer> → IntStream via mapToInt, then toArray() returns int[]. For Object streams, toArray() returns Object[]; toArray(String[]::new) uses the IntFunction generator to return the right type.",
        },
        {
          id: "arr-20",
          title: "Array .equals on String elements",
          code: 'String[] a = {"x"};\nString[] b = {"x"};\nSystem.out.println(a.equals(b));\nSystem.out.println(Arrays.equals(a, b));',
          options: ["true, true", "false, true", "false, false", "true, false"],
          answer: 1,
          explanation:
            'a.equals(b) is Object.equals → reference comparison → false (different arrays). Arrays.equals walks elements and calls Objects.equals → "x".equals("x") → true.',
        },
        {
          id: "arr-21",
          title: "Array variable reassignment",
          code: "final int[] a = {1, 2, 3};\na[0] = 99;\na = new int[]{4, 5, 6};",
          options: [
            "Both work",
            "First works, second is compile error",
            "First fails, second works",
            "Both fail",
          ],
          answer: 1,
          explanation:
            "final on a reference means the REFERENCE can't be reassigned. The contents can still be mutated. a[0] = 99 OK; a = ... → compile error 'cannot assign final variable'.",
        },
        {
          id: "arr-22",
          title: "Object array — covariance trap",
          code: "Number[] nums = new Integer[3];\nnums[0] = 1.5;",
          options: [
            "Compiles and runs fine",
            "Compile error",
            "Runtime ArrayStoreException",
            "Implicitly truncated to 1",
          ],
          answer: 2,
          explanation:
            "Integer[] IS-A Number[] (covariant arrays). Compile OK. But the runtime store check sees Double → not Integer → ArrayStoreException. Generics avoid this by being invariant.",
        },
        {
          id: "arr-23",
          title: "Array of an interface type",
          code: 'Runnable[] tasks = new Runnable[2];\ntasks[0] = () -> System.out.println("hi");\nSystem.out.println(tasks[0] instanceof Runnable);',
          options: ["true", "false", "Compile error", "NullPointerException"],
          answer: 0,
          explanation:
            "You CAN create arrays of interface types. Elements default to null. Storing a lambda works because lambdas are Runnable instances. instanceof returns true.",
        },
        {
          id: "arr-24",
          title: "Empty array vs null array",
          code: "int[] empty = new int[0];\nint[] nul = null;\nSystem.out.println(empty.length);\nSystem.out.println(nul.length);",
          options: [
            "0, 0",
            "0, NullPointerException",
            "NullPointerException, NullPointerException",
            "Compile error",
          ],
          answer: 1,
          explanation:
            "Empty array is a valid object with length 0 — safer than null. Always prefer returning new int[0] over null. Dereferencing null → NPE. (Java offers no 'null pointer .length' grace.)",
        },
        {
          id: "arr-25",
          title: "Pass-by-value of array reference",
          code: "static void clear(int[] a) { a = new int[a.length]; }\nint[] x = {1, 2, 3};\nclear(x);\nSystem.out.println(x[0]);",
          options: ["0", "1", "Throws", "Compile error"],
          answer: 1,
          explanation:
            "Java passes the REFERENCE by VALUE. Reassigning the local parameter a doesn't affect the caller's x. If clear had done a[0] = 0 it would have worked. The reference itself is a copy.",
        },
      ],
    },

    {
      id: "strings",
      title: "Strings & String Methods",
      icon: "🔤",
      color: "#a855f7",
      blurb:
        "String pool, intern, equals vs ==, immutability, common method gotchas.",
      questions: [
        {
          id: "str-1",
          title: "String literal vs new String",
          code: 'String a = "hello";\nString b = "hello";\nString c = new String("hello");\nSystem.out.println(a == b);\nSystem.out.println(a == c);\nSystem.out.println(a.equals(c));',
          options: [
            "true, true, true",
            "true, false, true",
            "false, false, true",
            "true, true, false",
          ],
          answer: 1,
          explanation:
            "Literals are interned — a and b point to the same pool object → true. new String() always creates a new heap object → a == c is false. equals() compares content → true.",
        },
        {
          id: "str-2",
          title: "intern() effect",
          code: 'String a = new String("java").intern();\nString b = "java";\nSystem.out.println(a == b);',
          options: ["true", "false", "Compile error", "NullPointerException"],
          answer: 0,
          explanation:
            "intern() returns the canonical pool reference. After interning, a points to the same pool entry as the literal b → a == b is true.",
        },
        {
          id: "str-3",
          title: "String immutability — replace",
          code: "String s = \"abc\";\ns.replace('a', 'z');\nSystem.out.println(s);",
          options: ["zbc", "abc", "Compile error", "Throws an exception"],
          answer: 1,
          explanation:
            "Strings are immutable. replace() returns a NEW string — the original s is unchanged. To use the new value, you must assign: s = s.replace(...). Otherwise prints abc.",
        },
        {
          id: "str-4",
          title: "String concatenation with +",
          code: 'String s = "" + 1 + 2 + "-" + 1 + 2;\nSystem.out.println(s);',
          options: ["3-3", "12-12", "12-3", "3-12"],
          answer: 1,
          explanation:
            '+ is left-associative. "" + 1 → "1" (string mode); "1" + 2 → "12"; + "-" → "12-"; "12-" + 1 → "12-1"; + 2 → "12-12". Once a String is in the chain, everything to the right is string-concat.',
        },
        {
          id: "str-5",
          title: "substring — inclusive or exclusive?",
          code: 'String s = "abcdef";\nSystem.out.println(s.substring(1, 4));',
          options: ["abcd", "bcd", "bcde", "abc"],
          answer: 1,
          explanation:
            "substring(begin, end) — begin is INCLUSIVE, end is EXCLUSIVE. Indices 1, 2, 3 → 'b','c','d' → 'bcd'.",
        },
        {
          id: "str-6",
          title: "split with trailing empty strings",
          code: 'String s = "a,b,,,";\nString[] parts = s.split(",");\nSystem.out.println(parts.length);',
          options: ["5", "4", "3", "2"],
          answer: 3,
          explanation:
            "split(regex) with no limit drops TRAILING empty strings. \"a,b,,,\" would naively split into ['a','b','','',''] but trailing empties are removed → ['a','b'] → length 2. Use split(\",\", -1) to keep them.",
        },
        {
          id: "str-7",
          title: "indexOf — not found",
          code: "String s = \"hello\";\nint i = s.indexOf('z');\nSystem.out.println(i);",
          options: [
            "0",
            "-1",
            "Throws StringIndexOutOfBoundsException",
            "Throws NoSuchElementException",
          ],
          answer: 1,
          explanation:
            "indexOf returns -1 when the character/substring isn't found (never throws). The -1 sentinel is a classic source of bugs when callers forget to check it before using as an index.",
        },
        {
          id: "str-8",
          title: "equalsIgnoreCase vs equals",
          code: 'String a = "Hello";\nString b = "hello";\nSystem.out.println(a.equals(b));\nSystem.out.println(a.equalsIgnoreCase(b));',
          options: ["true, true", "false, false", "false, true", "true, false"],
          answer: 2,
          explanation:
            "equals() is case-sensitive → false. equalsIgnoreCase() folds case → true. Don't confuse with == (reference) or hash-based comparisons.",
        },
        {
          id: "str-9",
          title: "StringBuilder vs String performance",
          code: 'String s = "";\nfor (int i = 0; i < 1000; i++) s = s + i;\n// vs\nStringBuilder sb = new StringBuilder();\nfor (int i = 0; i < 1000; i++) sb.append(i);',
          options: [
            "Both equally fast — javac optimises +",
            "String loop is O(n²); StringBuilder is O(n)",
            "StringBuilder is slower because it's synchronised",
            "Both O(n²)",
          ],
          answer: 1,
          explanation:
            "Each s + i creates a new String → copies all previous chars → O(n²) total. The compiler can only optimise + within a single expression, NOT across loop iterations. StringBuilder reuses an internal char[], doubling as needed → amortised O(n).",
        },
        {
          id: "str-10",
          title: "trim() vs strip()",
          code: 'String s = "\\u2003hello\\u2003";\nSystem.out.println(s.trim().length());\nSystem.out.println(s.strip().length());',
          options: ["5, 5", "7, 7", "7, 5", "5, 7"],
          answer: 2,
          explanation:
            "trim() only removes chars with code ≤ 0x20 (ASCII whitespace). U+2003 (EM SPACE) is > 0x20 so trim leaves it → length 7. strip() (Java 11+) uses Character.isWhitespace which recognises Unicode whitespace → length 5.",
        },
        {
          id: "str-11",
          title: "String.format with %d and a long",
          code: 'long x = 5_000_000_000L;\nSystem.out.println(String.format("%d", x));',
          options: [
            "5000000000",
            "Compile error",
            "Throws IllegalFormatConversionException",
            "Prints overflowed negative number",
          ],
          answer: 0,
          explanation:
            "%d formats any integral type (byte/short/int/long/BigInteger). No suffix is needed. Prints the long as decimal. Use %f for floating point, %s for general.",
        },
        {
          id: "str-12",
          title: "switch on String — null",
          code: 'String s = null;\nswitch (s) {\n  case "a": System.out.println("A"); break;\n  default: System.out.println("D");\n}',
          options: [
            "Prints D",
            "Prints A",
            "Throws NullPointerException",
            "Compile error",
          ],
          answer: 2,
          explanation:
            "Classic switch on String calls s.hashCode() internally → NPE on null. Java 21 pattern-matching switch CAN handle null with 'case null' — but old-style switch cannot.",
        },
        {
          id: "str-13",
          title: "String.valueOf(null) vs toString",
          code: "Object o = null;\nSystem.out.println(String.valueOf(o));\nSystem.out.println(o.toString());",
          options: [
            "null, null",
            "null, NullPointerException",
            "NullPointerException, NullPointerException",
            "empty, empty",
          ],
          answer: 1,
          explanation:
            'String.valueOf(null) is NULL-SAFE — returns the literal "null". o.toString() dereferences null → NPE. valueOf is the defensive choice.',
        },
        {
          id: "str-14",
          title: "StringBuilder vs StringBuffer",
          code: "// StringBuilder: not synchronized, faster\n// StringBuffer: synchronized, thread-safe, legacy",
          options: [
            "Identical performance",
            "StringBuilder is faster (single-threaded); StringBuffer is thread-safe (synchronized methods)",
            "StringBuffer is faster",
            "Both synchronized",
          ],
          answer: 1,
          explanation:
            "StringBuffer (Java 1.0) has synchronized methods → safe across threads, slower. StringBuilder (Java 5) drops synchronization → faster. Use StringBuilder unless you really share across threads.",
        },
        {
          id: "str-15",
          title: "+ in a loop — compiler optimisation?",
          code: 'String s = "";\nfor (int i = 0; i < 1000; i++) s += i;',
          options: [
            "javac rewrites to StringBuilder internally — O(n)",
            "Each iteration creates a new StringBuilder → still O(n²)",
            "Always O(1) — JVM caches",
            "Compiler refuses to compile",
          ],
          answer: 1,
          explanation:
            "javac translates each x + y into 'new StringBuilder(x).append(y).toString()'. Inside a loop, that's a NEW StringBuilder every iteration → still O(n²). Manually use ONE StringBuilder outside the loop.",
        },
        {
          id: "str-16",
          title: "compareTo result",
          code: 'System.out.println("apple".compareTo("banana"));',
          options: [
            "-1",
            "Negative number (difference in chars)",
            "0",
            "Positive number",
          ],
          answer: 1,
          explanation:
            "compareTo returns the unicode difference of the first mismatched char, or length difference. 'a' - 'b' = -1, so the result is -1 here — but in general it's NOT clamped to {-1, 0, 1}. Don't hard-code -1/1!",
        },
        {
          id: "str-17",
          title: "replace vs replaceAll",
          code: 'String s = "a.b.c";\nSystem.out.println(s.replace(".", "-"));\nSystem.out.println(s.replaceAll(".", "-"));',
          options: [
            "a-b-c, a-b-c",
            "a-b-c, ----- (regex . matches anything)",
            "Both error",
            "a.b.c, a-b-c",
          ],
          answer: 1,
          explanation:
            "replace takes LITERAL strings — '.' replaced literally. replaceAll takes a REGEX — '.' matches any char → replaces every character. Trap when migrating between the two.",
        },
        {
          id: "str-18",
          title: "String.repeat",
          code: '// Java 11+\nString line = "-".repeat(5);\nSystem.out.println(line);',
          options: [
            "----- (5 dashes)",
            "Compile error pre Java 11",
            "Throws",
            "-",
          ],
          answer: 0,
          explanation:
            "Java 11 added String.repeat(int). repeat(5) returns '-----'. repeat(0) returns ''. Negative throws IllegalArgumentException.",
        },
        {
          id: "str-19",
          title: "isEmpty vs isBlank",
          code: 'String a = "";\nString b = "   ";\nSystem.out.println(a.isEmpty());\nSystem.out.println(b.isEmpty());\nSystem.out.println(b.isBlank());',
          options: [
            "true, true, true",
            "true, false, true",
            "false, true, false",
            "true, true, false",
          ],
          answer: 1,
          explanation:
            'isEmpty: length == 0. isBlank (Java 11): all chars are whitespace (Character.isWhitespace). "" is empty AND blank. "   " is not empty (length 3) but IS blank.',
        },
        {
          id: "str-20",
          title: "Text block — indentation",
          code: 'String s = """\n    hello\n    world\n    """;\nSystem.out.println(s);',
          options: [
            "Prints with 4 spaces of leading indent",
            "Prints with no leading indent (common indent stripped)",
            "Compile error",
            "Prints literal triple-quotes",
          ],
          answer: 1,
          explanation:
            'Text blocks (Java 15+) compute incidental whitespace from the LEAST indented line including the closing """. That common prefix is stripped from every line. Output has no leading spaces.',
        },
        {
          id: "str-21",
          title: "+ with null reference",
          code: 'String s = "x=" + null;\nSystem.out.println(s);',
          options: [
            "Throws NullPointerException",
            "x=null",
            "x=",
            "Compile error",
          ],
          answer: 1,
          explanation:
            "+ calls String.valueOf on each operand. valueOf(null) → 'null'. So 'x=null'. Defensive concatenation is built-in for this case.",
        },
        {
          id: "str-22",
          title: "Integer in concatenation",
          code: 'System.out.println("sum=" + 1 + 2);\nSystem.out.println("sum=" + (1 + 2));',
          options: [
            "sum=12, sum=3",
            "sum=3, sum=3",
            "sum=12, sum=12",
            "sum=3, sum=12",
          ],
          answer: 0,
          explanation:
            "Left-to-right: 'sum=' + 1 → 'sum=1' (string mode); + 2 → 'sum=12'. Parentheses force the int addition first → 'sum=' + 3 → 'sum=3'.",
        },
        {
          id: "str-23",
          title: "String.chars stream",
          code: 'long n = "abc".chars().filter(Character::isLetter).count();\nSystem.out.println(n);',
          options: ["3", "0", "Compile error", "Throws"],
          answer: 0,
          explanation:
            "chars() returns IntStream of UTF-16 code units. Character.isLetter accepts int code points. All three are letters → count = 3.",
        },
        {
          id: "str-24",
          title: "String.join with collection",
          code: 'System.out.println(String.join("-", List.of("a", "b", "c")));',
          options: ["a-b-c", "[a, b, c]", "abc", "Compile error"],
          answer: 0,
          explanation:
            "String.join takes a delimiter + Iterable (or varargs). Joins each element with the delimiter between them. Output: a-b-c.",
        },
        {
          id: "str-25",
          title: "String hashCode caching",
          code: "// String stores its hashCode in a private int field after first computation",
          options: [
            "Recomputed on every call",
            "Cached after first call — repeated hashCode is O(1)",
            "Computed lazily, never cached",
            "Not implemented",
          ],
          answer: 1,
          explanation:
            "String.hashCode caches the result in a private int (initially 0; recomputed if it actually equals 0). This is why immutability is so valuable for hashmap keys — content can't drift after the hash is cached.",
        },
        {
          id: "str-26",
          title: "matches vs contains",
          code: 'String s = "hello world";\nSystem.out.println(s.contains("world"));\nSystem.out.println(s.matches("world"));',
          options: ["true, true", "true, false", "false, false", "false, true"],
          answer: 1,
          explanation:
            "contains: literal substring → true. matches: regex against the ENTIRE string (implicit ^...$) → 'world' does not match the full 'hello world' → false. Use s.matches(\".*world.*\") to match anywhere.",
        },
        {
          id: "str-27",
          title: "charAt out of bounds",
          code: 'String s = "abc";\nSystem.out.println(s.charAt(5));',
          options: [
            "StringIndexOutOfBoundsException",
            "ArrayIndexOutOfBoundsException",
            "Returns '\\u0000'",
            "Throws NullPointerException",
          ],
          answer: 0,
          explanation:
            "charAt validates the index and throws StringIndexOutOfBoundsException (extends IndexOutOfBoundsException) for invalid positions.",
        },
        {
          id: "str-28",
          title: "Locale-dependent case conversion",
          code: '// Turkish locale\n"TITLE".toLowerCase(Locale.forLanguageTag("tr"));',
          options: [
            "title",
            "tıtle (dotless i — Turkish I)",
            "Throws",
            "TITLE unchanged",
          ],
          answer: 1,
          explanation:
            "In Turkish, uppercase 'I' lowercases to dotless 'ı' (U+0131), not 'i'. Always pass an explicit Locale (or Locale.ROOT for stable behavior) when case-converting identifiers/SQL/protocol strings.",
        },
        {
          id: "str-29",
          title: "String.format misuse",
          code: 'System.out.println(String.format("%d", "42"));',
          options: [
            "42",
            "IllegalFormatConversionException",
            "Compile error",
            "Prints the address",
          ],
          answer: 1,
          explanation:
            "%d expects an integral type; passing a String throws IllegalFormatConversionException at runtime. Use %s for strings or parse first.",
        },
        {
          id: "str-30",
          title: "Why String is final",
          code: "// String is declared final — why?",
          options: [
            "Performance only",
            "Security (immutable for class loaders, security checks), hash caching, string pool integrity, thread safety",
            "Just historical",
            "To prevent inheritance bugs only",
          ],
          answer: 1,
          explanation:
            "Immutability + final ensures: (1) security-sensitive APIs (file paths, ClassLoader, SecurityManager) cannot be subverted by a malicious subclass; (2) hashCode can be cached; (3) string pool wouldn't work if Strings could change; (4) instances are safely shared across threads.",
        },
      ],
    },

    {
      id: "oop",
      title: "OOP & Inheritance",
      icon: "🧩",
      color: "#22c55e",
      blurb:
        "Method dispatch, constructor chaining, hiding vs overriding, casting traps.",
      questions: [
        {
          id: "oop-1",
          title: "Parent reference holds child — what's accessible?",
          code: 'class Animal { void speak() { System.out.println("..."); } }\nclass Dog extends Animal {\n  void speak() { System.out.println("Woof"); }\n  void fetch() { System.out.println("Fetch"); }\n}\nAnimal a = new Dog();\na.speak();\na.fetch();',
          options: [
            "Woof, Fetch",
            "..., Fetch",
            "Woof, compile error",
            "..., compile error",
          ],
          answer: 2,
          explanation:
            "Reference type (Animal) decides what's accessible at compile time → fetch() is unknown → error. Object type (Dog) decides which override runs → speak prints 'Woof'. Compile-time vs runtime resolution.",
        },
        {
          id: "oop-2",
          title: "Constructor chaining",
          code: 'class A { A() { System.out.println("A"); } }\nclass B extends A { B() { System.out.println("B"); } }\nclass C extends B { C() { System.out.println("C"); } }\nnew C();',
          options: ["C", "C, B, A", "A, B, C", "A, C"],
          answer: 2,
          explanation:
            "Every constructor implicitly calls super() first. Chain walks UP to Object, then unwinds DOWN executing each constructor body → A, B, C.",
        },
        {
          id: "oop-3",
          title: "Static method 'overriding' — hiding!",
          code: 'class P { static void hello() { System.out.println("P"); } }\nclass C extends P { static void hello() { System.out.println("C"); } }\nP p = new C();\np.hello();',
          options: ["C", "P", "Compile error", "Runtime error"],
          answer: 1,
          explanation:
            "Static methods are NOT polymorphic — they are HIDDEN, not overridden. Resolution uses the reference type (P) at compile time → prints P. Always call statics via the class name to avoid confusion.",
        },
        {
          id: "oop-4",
          title: "instanceof and downcasting",
          code: "Animal a = new Dog();\nif (a instanceof Dog) {\n  Dog d = (Dog) a;\n  d.fetch();\n}\nCat c = (Cat) a;",
          options: [
            "fetch works, Cat cast works",
            "fetch works, Cat cast throws ClassCastException",
            "Both throw ClassCastException",
            "fetch compile error",
          ],
          answer: 1,
          explanation:
            "a holds a Dog. instanceof passes → safe downcast → fetch() runs. Casting Dog → Cat is invalid (sibling types). Compiles because both extend Animal, but throws ClassCastException at runtime.",
        },
        {
          id: "oop-5",
          title: "Field 'overriding' — also hiding",
          code: 'class P { String name = "parent"; }\nclass C extends P { String name = "child"; }\nP p = new C();\nSystem.out.println(p.name);',
          options: ["parent", "child", "Compile error", "null"],
          answer: 0,
          explanation:
            "Fields are NEVER polymorphic. They are resolved by the REFERENCE type (P), not the object type. So p.name → P's field → 'parent'. Methods override; fields hide.",
        },
        {
          id: "oop-6",
          title: "Calling overridden method from constructor",
          code: 'class P {\n  P() { init(); }\n  void init() { System.out.println("P.init"); }\n}\nclass C extends P {\n  String name = "child";\n  void init() { System.out.println("C.init: " + name); }\n}\nnew C();',
          options: [
            "P.init",
            "C.init: child",
            "C.init: null",
            "NullPointerException",
          ],
          answer: 2,
          explanation:
            "P() runs FIRST, before C's field initialisers. Virtual dispatch goes to C.init(), but C.name hasn't been assigned yet → still null → prints 'C.init: null'. Effective Java Item 19: never call overridable methods from constructors.",
        },
        {
          id: "oop-7",
          title: "Abstract class with constructor",
          code: 'abstract class Shape {\n  Shape() { System.out.println("Shape ctor"); }\n}\nclass Circle extends Shape {\n  Circle() { System.out.println("Circle ctor"); }\n}\nnew Circle();',
          options: [
            "Compile error — abstract class cannot have constructor",
            "Circle ctor",
            "Shape ctor, Circle ctor",
            "Runtime error",
          ],
          answer: 2,
          explanation:
            "Abstract classes CAN have constructors (and usually do). They run when a concrete subclass is instantiated. You cannot 'new' an abstract class directly, but its constructor chain still executes via super().",
        },
        {
          id: "oop-8",
          title: "Interface default method conflict",
          code: 'interface A { default void m() { System.out.println("A"); } }\ninterface B { default void m() { System.out.println("B"); } }\nclass C implements A, B {}',
          options: [
            "Compiles — prefers A",
            "Compiles — prefers B",
            "Compile error — must override m() in C",
            "Runtime AmbiguousMethodException",
          ],
          answer: 2,
          explanation:
            "Diamond problem with default methods → compile error. C must explicitly override m() (and can call A.super.m() or B.super.m() inside to delegate).",
        },
        {
          id: "oop-9",
          title: "Private method 'override'?",
          code: 'class P { private void hi() { System.out.println("P"); } void go() { hi(); } }\nclass C extends P { private void hi() { System.out.println("C"); } }\nnew C().go();',
          options: ["P", "C", "Compile error", "Runtime error"],
          answer: 0,
          explanation:
            "Private methods are NOT inherited and cannot be overridden — they're invisible to subclasses. go() inherited from P always calls P's hi(). C's hi() is an unrelated private method.",
        },
        {
          id: "oop-10",
          title: "final class — extension",
          code: "final class Util { }\nclass MyUtil extends Util { }",
          options: [
            "Compiles fine",
            "Compile error — cannot extend final class",
            "Runtime error",
            "Compiles with warning",
          ],
          answer: 1,
          explanation:
            "final class cannot be subclassed. Compile error: 'cannot inherit from final class'. final on a class is the strongest form of 'closed for extension'.",
        },
        {
          id: "oop-11",
          title: "Method overloading — autoboxing vs varargs",
          code: 'void m(int x)        { System.out.println("int"); }\nvoid m(Integer x)    { System.out.println("Integer"); }\nvoid m(int... x)     { System.out.println("varargs"); }\nm(5);',
          options: ["int", "Integer", "varargs", "Ambiguous — compile error"],
          answer: 0,
          explanation:
            "Overload resolution preference: exact match > widening > autoboxing > varargs. m(int) is the exact match → wins. Without it, Integer would beat varargs (autobox > varargs).",
        },
        {
          id: "oop-12",
          title: "Composition over inheritance — why?",
          code: "// Stack extends Vector  // tightly coupled, exposes Vector methods\n// vs\n// class Stack { private Deque<E> d; ... }  // composes",
          options: [
            "Inheritance is faster",
            "Composition gives flexibility, hides internals, avoids fragile-base-class problems",
            "They are equivalent",
            "Composition uses less memory",
          ],
          answer: 1,
          explanation:
            "Inheritance leaks parent API and tightly couples behaviour — changes to the base class break subclasses (fragile base class). Composition delegates, exposes only what you choose, and supports swapping implementations. Java's Stack-extends-Vector is a classic anti-example.",
        },
        {
          id: "oop-13",
          title: "Initialization order",
          code: 'class X {\n  static { System.out.print("sblock "); }\n  static int s = init("sf");\n  { System.out.print("iblock "); }\n  int i = init("if");\n  X() { System.out.print("ctor "); }\n  static int init(String t) { System.out.print(t + " "); return 0; }\n}\nnew X();',
          options: [
            "sblock sf iblock if ctor",
            "sf sblock if iblock ctor",
            "ctor iblock if sblock sf",
            "Order depends on JVM",
          ],
          answer: 0,
          explanation:
            "Order: static blocks + static fields IN SOURCE ORDER (once, on class load), then for each instance: instance blocks + instance fields IN SOURCE ORDER, then constructor body. Output: 'sblock sf iblock if ctor'.",
        },
        {
          id: "oop-14",
          title: "this() and super() — first statement rule",
          code: 'class A { A(int x) {} }\nclass B extends A {\n  B() { System.out.println("hi"); super(5); }\n}',
          options: [
            "Compiles fine",
            "Compile error — super()/this() must be the FIRST statement",
            "Runtime error",
            "Compiles with warning",
          ],
          answer: 1,
          explanation:
            "super() or this() (if used) MUST be the first statement of a constructor. Java 22 relaxes this for 'flexible constructor bodies' (statements before super are allowed if they don't touch 'this'), but in older versions this is a hard rule.",
        },
        {
          id: "oop-15",
          title: "Interface vs abstract class",
          code: "// interface: multiple inheritance of TYPE, no state (only constants)\n// abstract class: state + constructors + single inheritance",
          options: [
            "Identical",
            "Interface = pure contract + default methods; abstract class = partial impl with state and constructors; only ONE abstract superclass allowed",
            "Abstract class only for legacy code",
            "Interface cannot have implementation",
          ],
          answer: 1,
          explanation:
            "Interfaces: multiple inheritance, default/static/private methods (Java 8/9+), no instance state. Abstract classes: have state + constructors, single inheritance. Prefer interface for capability ('Sortable'); abstract class for a partial template with shared state.",
        },
        {
          id: "oop-16",
          title: "Static method on interface",
          code: "interface Calc {\n  static Calc create() { return new Calc(){}; }\n  default int zero() { return 0; }\n}",
          options: [
            "Compile error — interfaces can't have statics",
            "Java 8+ — interfaces can declare static methods (not inherited by impls)",
            "Java 11+",
            "Static methods are inherited like default methods",
          ],
          answer: 1,
          explanation:
            "Java 8+ supports static methods on interfaces. They're NOT inherited by implementing classes — you call them via the interface name (Calc.create()). Useful for static factories.",
        },
        {
          id: "oop-17",
          title: "Private method on interface",
          code: 'interface Logger {\n  default void info(String m) { write("[I] " + m); }\n  default void warn(String m) { write("[W] " + m); }\n  private void write(String s) { System.out.println(s); }\n}',
          options: [
            "Compile error always",
            "Compile error pre Java 9; allowed in Java 9+",
            "Allowed since Java 8",
            "Never allowed",
          ],
          answer: 1,
          explanation:
            "Java 9+ allows private methods on interfaces — used to share code between default methods without exposing helpers. Pre-Java 9, you'd duplicate logic across defaults.",
        },
        {
          id: "oop-18",
          title: "Anonymous class capturing local variable",
          code: "void m() {\n  int x = 5;\n  Runnable r = new Runnable() {\n    public void run() { System.out.println(x); }\n  };\n  x = 10;\n}",
          options: [
            "Compiles, prints 10 when run",
            "Compile error — x must be final or effectively final, and reassignment in m() breaks that",
            "Compiles, prints 5",
            "Runtime exception",
          ],
          answer: 1,
          explanation:
            "Anonymous classes (and lambdas) capture local variables by VALUE, but the variable must be final or effectively final. Reassigning x = 10 destroys 'effectively final' → compile error.",
        },
        {
          id: "oop-19",
          title: "enum can implement interfaces",
          code: 'interface Greeter { String greet(); }\nenum Lang implements Greeter {\n  EN { public String greet(){ return "Hi"; } },\n  FR { public String greet(){ return "Salut"; } };\n}',
          options: [
            "Compile error",
            "Allowed — each enum constant can override methods",
            "Allowed but only with default methods",
            "Only one constant can override",
          ],
          answer: 1,
          explanation:
            "Enums can implement interfaces. Each constant can act as an anonymous subclass and override abstract methods. Powerful for strategy-like polymorphism with a fixed set of variants.",
        },
        {
          id: "oop-20",
          title: "equals/hashCode contract",
          code: "// a.equals(b) == true  ⇒  a.hashCode() == b.hashCode()\n// Reverse NOT required",
          options: [
            "Equal hashCodes imply equal objects",
            "Equal objects MUST have equal hashCodes; equal hashCodes do NOT imply equal objects",
            "Both directions required",
            "Neither direction required",
          ],
          answer: 1,
          explanation:
            "ONE direction only. Two objects with equal hashCodes may be unequal (collisions are expected). But equal objects MUST have equal hashCodes — violating this breaks HashMap/HashSet.",
        },
        {
          id: "oop-21",
          title: "Object.clone — Cloneable check",
          code: "class P { } // does NOT implement Cloneable\nP p = new P();\np.clone(); // protected — accessed inside P\n// but inside P: super.clone() ...",
          options: [
            "Returns a shallow copy",
            "CloneNotSupportedException unless Cloneable is implemented",
            "Compile error always",
            "Returns null",
          ],
          answer: 1,
          explanation:
            "Object.clone() checks Cloneable (a marker interface). If not implemented → CloneNotSupportedException. The whole clone mechanism is awkward; modern code prefers copy constructors or static factories.",
        },
        {
          id: "oop-22",
          title: "covariant return types",
          code: 'class A { Object get() { return "a"; } }\nclass B extends A { @Override String get() { return "b"; } }',
          options: [
            "Compile error — must return Object",
            "Allowed since Java 5 — override may narrow the return type (covariant)",
            "Only allowed with @Override",
            "Allowed but breaks polymorphism",
          ],
          answer: 1,
          explanation:
            "Since Java 5, an override can return a SUBTYPE of the original return. Common with clone() returning the concrete type. Method signatures still match by parameters; only the return is allowed to narrow.",
        },
        {
          id: "oop-23",
          title: "@Override on a non-overriding method",
          code: "class P { void m() {} }\nclass C extends P {\n  @Override void M() {}\n}",
          options: [
            "Compiles — annotation is suggestion",
            "Compile error — @Override must actually override",
            "Runtime error",
            "Adds a new method silently",
          ],
          answer: 1,
          explanation:
            "@Override is checked by the compiler. If you misspell the method, change the signature, or there's no parent method to override → compile error. Use @Override aggressively — it catches refactoring slips.",
        },
        {
          id: "oop-24",
          title: "Inner vs static nested class",
          code: "class Outer {\n  class Inner {}        // needs Outer instance\n  static class Nested {}// independent\n}",
          options: [
            "Both need an Outer instance",
            "Inner needs an outer instance; Nested (static) does not",
            "Neither needs an outer instance",
            "Inner can be instantiated as new Outer.Inner()",
          ],
          answer: 1,
          explanation:
            "Inner (non-static) classes carry an implicit reference to the enclosing instance — creating one requires 'outer.new Inner()'. Static nested classes have no such link. Prefer static nested unless you really need the outer 'this'.",
        },
        {
          id: "oop-25",
          title: "Diamond / multiple inheritance via interfaces",
          code: "interface A { default int v() { return 1; } }\ninterface B extends A { default int v() { return 2; } }\nclass C implements A, B {}\nnew C().v();",
          options: [
            "Throws AmbiguousMethodException",
            "Returns 1",
            "Returns 2 — most specific (B) wins",
            "Compile error",
          ],
          answer: 2,
          explanation:
            "Rule for default-method conflicts: MORE-SPECIFIC interface wins. B extends A and overrides v(), so B's v() is more specific → returns 2. (When neither overrides the other, you must override explicitly.)",
        },
        {
          id: "oop-26",
          title: "Final method override",
          code: "class P { final void run() {} }\nclass C extends P { void run() {} }",
          options: [
            "Compiles fine",
            "Compile error — cannot override final method",
            "Allowed with @Override",
            "Allowed but warned",
          ],
          answer: 1,
          explanation:
            "final on a method means subclasses cannot override it. Combined with private, the JVM can devirtualize and often inline. Compile error: 'cannot override the final method from P'.",
        },
        {
          id: "oop-27",
          title: "protected access",
          code: "// package p1: class A { protected void m() {} }\n// package p2: class B extends A {\n//   void test() { A a = new A(); a.m(); }\n// }",
          options: [
            "Allowed — B is a subclass",
            "Compile error — protected access to A from another package needs the access to go through B's own type",
            "Compile error — protected has no cross-package meaning",
            "Runtime error",
          ],
          answer: 1,
          explanation:
            "Across packages, protected is accessible only through references of the SUBCLASS's own type. B can call new B().m() but not new A().m() from outside A's package. A famous interview gotcha.",
        },
        {
          id: "oop-28",
          title: "Encapsulation — what really matters",
          code: "// public getters/setters on every field\n// vs\n// behavior-oriented methods (Tell-Don't-Ask)",
          options: [
            "Getters/setters are encapsulation",
            "Encapsulation is hiding STATE and exposing BEHAVIOR; getters/setters are usually a leakage",
            "Encapsulation means private fields, full stop",
            "Encapsulation is unrelated to access modifiers",
          ],
          answer: 1,
          explanation:
            "Encapsulation isn't 'use private' — it's hiding implementation and exposing intent. Class with 20 getters/setters is essentially a struct. Prefer methods that DO things (transfer, addItem) over exposing mutable state.",
        },
        {
          id: "oop-29",
          title: "Polymorphism via interface",
          code: "List<Shape> shapes = List.of(new Circle(), new Square());\nshapes.forEach(s -> s.draw());",
          options: [
            "Static dispatch — Shape.draw runs",
            "Dynamic dispatch — concrete class's draw runs at runtime",
            "Compile error",
            "Throws — Shape has no draw",
          ],
          answer: 1,
          explanation:
            "Method calls on interface/abstract references resolve at RUNTIME via the actual class's vtable (or itable for interfaces). Each element's concrete draw() runs. This is runtime polymorphism (a.k.a. dynamic dispatch).",
        },
        {
          id: "oop-30",
          title: "Object class default toString",
          code: "class X {}\nSystem.out.println(new X());",
          options: [
            "Empty string",
            "Class name @ hex hashCode (e.g., X@1a2b)",
            "null",
            "Throws",
          ],
          answer: 1,
          explanation:
            "Object.toString returns 'ClassName@' + Integer.toHexString(hashCode()). Override toString for meaningful output. Many logging issues trace back to forgetting to override toString.",
        },
        {
          id: "oop-31",
          title: "Liskov Substitution Principle",
          code: "// Square extends Rectangle and overrides setWidth/setHeight\n// to also update the other dimension. Rectangle test:\n// setWidth(5); setHeight(10); assert area == 50;\n// On Square subclass: fails!",
          options: [
            "LSP holds — Square IS-A Rectangle",
            "LSP is violated — Square breaks Rectangle's behavioral contract",
            "Just a coding bug — not a principle issue",
            "Java enforces LSP at compile time",
          ],
          answer: 1,
          explanation:
            "Liskov: subtypes must be substitutable. Square breaks Rectangle's setWidth/setHeight contract (independent dimensions). Type checker is silent; behavior is broken. Mathematical IS-A doesn't always make a valid SUBTYPE.",
        },
        {
          id: "oop-32",
          title: "Interface Segregation Principle",
          code: "// Fat interface forces clients to implement methods they don't use:\n// interface Worker { work(); eat(); sleep(); }\n// Robot implements Worker → eat()/sleep() awkward",
          options: [
            "Always use one big interface",
            "Split fat interfaces into role-specific ones (Workable, Eatable, Sleepable)",
            "Use default methods for everything",
            "Use inheritance instead",
          ],
          answer: 1,
          explanation:
            "ISP: clients shouldn't depend on methods they don't use. Prefer many small role interfaces over one mega-interface. Composability + cleaner mocks for tests.",
        },
        {
          id: "oop-33",
          title: "Dependency Inversion Principle",
          code: "// Bad:  class Service { MySQLRepo repo = new MySQLRepo(); }\n// Good: class Service { Repo repo; Service(Repo r){ this.repo = r; } }",
          options: [
            "Same thing",
            "Depend on ABSTRACTIONS (interface Repo) injected from outside — testable and swappable",
            "Use static methods",
            "Use singletons",
          ],
          answer: 1,
          explanation:
            "DIP + Inversion of Control. Concrete dependencies are injected via constructor. Easy to test (pass a mock), easy to swap (Mongo, Postgres). Spring's DI container makes this trivial.",
        },
        {
          id: "oop-34",
          title: "Single Responsibility Principle",
          code: "// class Report {\n//   load(); compute(); formatPDF(); sendEmail();\n// } — many reasons to change",
          options: [
            "One class can do many things — that's efficient",
            "SRP: a class should have ONE reason to change; split into Loader, Calculator, PdfRenderer, EmailSender",
            "Only for big projects",
            "SRP means one method",
          ],
          answer: 1,
          explanation:
            "SRP: one reason to change. PDF format change shouldn't touch SMTP code. Splitting yields focused tests, fewer merge conflicts, reusable pieces. The 'S' in SOLID.",
        },
        {
          id: "oop-35",
          title: "Marker interface (Serializable)",
          code: "// Serializable, Cloneable — no methods, just a 'tag'",
          options: [
            "Useless",
            "Marker interfaces: zero methods, used as a type tag for runtime/library checks",
            "Same as abstract class",
            "Same as annotation",
          ],
          answer: 1,
          explanation:
            "Marker interfaces are runtime type tags (instanceof Serializable). Annotations have largely replaced this idiom in modern code (e.g., @FunctionalInterface, @Override) — but Serializable remains the canonical marker.",
        },
      ],
    },

    {
      id: "collections",
      title: "Collections — List, Set, Map",
      icon: "🗂️",
      color: "#06b6d4",
      blurb:
        "Iteration order, ConcurrentModification, equals/hashCode contracts, Map quirks.",
      questions: [
        {
          id: "col-1",
          title: "ArrayList remove during for-each",
          code: "List<Integer> l = new ArrayList<>(List.of(1,2,3,4));\nfor (Integer x : l) {\n  if (x == 2) l.remove(x);\n}",
          options: [
            "Removes 2 cleanly",
            "ConcurrentModificationException",
            "Removes all evens",
            "Compile error",
          ],
          answer: 1,
          explanation:
            "Iterator detects structural modification via modCount and throws CME on next() call. Safe patterns: Iterator.remove(), removeIf(), or collect-then-remove.",
        },
        {
          id: "col-2",
          title: "HashMap with null key",
          code: "Map<String, Integer> m = new HashMap<>();\nm.put(null, 1);\nm.put(null, 2);\nSystem.out.println(m.size());\nSystem.out.println(m.get(null));",
          options: [
            "Throws NullPointerException on put",
            "2, 2",
            "1, 2",
            "1, 1",
          ],
          answer: 2,
          explanation:
            "HashMap permits ONE null key (stored at bucket 0). Putting null twice replaces the value. Size 1, value 2. HashTable & ConcurrentHashMap reject nulls; TreeMap rejects null because compareTo on null fails.",
        },
        {
          id: "col-3",
          title: "HashSet uses what?",
          code: "class Point { int x, y;\n  public boolean equals(Object o) { /* compares x,y */ return true; }\n  // hashCode not overridden\n}\nSet<Point> s = new HashSet<>();\ns.add(new Point()); s.add(new Point());\nSystem.out.println(s.size());",
          options: ["1", "2", "Throws", "0"],
          answer: 1,
          explanation:
            "HashSet uses hashCode() to find the bucket, then equals() within it. Two different Point instances have different default hashCodes → land in different buckets → equals never called → both 'added' → size 2. Always override equals AND hashCode together.",
        },
        {
          id: "col-4",
          title: "TreeMap with non-Comparable key",
          code: "Map<Object, Integer> m = new TreeMap<>();\nm.put(new Object(), 1);",
          options: [
            "Works fine",
            "Compile error",
            "ClassCastException at runtime",
            "Stores via System.identityHashCode order",
          ],
          answer: 2,
          explanation:
            "TreeMap sorts keys; without a Comparator it requires keys implement Comparable. Object doesn't → ClassCastException: 'Object cannot be cast to Comparable' at runtime.",
        },
        {
          id: "col-5",
          title: "LinkedHashMap iteration order",
          code: 'Map<String, Integer> m = new LinkedHashMap<>();\nm.put("b", 2); m.put("a", 1); m.put("c", 3);\nm.put("b", 99);\nm.keySet().forEach(System.out::println);',
          options: [
            "a, b, c",
            "b, a, c",
            "c, a, b",
            "b, a, c (b moved to end)",
          ],
          answer: 1,
          explanation:
            "LinkedHashMap preserves INSERTION order by default. Re-putting an existing key updates the value but does NOT change position. So order is still b, a, c. (Constructor flag accessOrder=true makes it LRU-like.)",
        },
        {
          id: "col-6",
          title: "List.of immutability",
          code: "List<Integer> l = List.of(1, 2, 3);\nl.add(4);",
          options: [
            "Works — adds 4",
            "UnsupportedOperationException",
            "Compile error",
            "NullPointerException",
          ],
          answer: 1,
          explanation:
            "List.of/Set.of/Map.of (Java 9+) return IMMUTABLE collections. Any mutator (add/remove/set) throws UnsupportedOperationException. Also rejects null elements with NPE.",
        },
        {
          id: "col-7",
          title: "ArrayList vs LinkedList — middle insertion",
          code: "// 1 million insertions at index 0 in:\n// (a) ArrayList    (b) LinkedList",
          options: [
            "Both O(n) per insert",
            "ArrayList faster — array cache locality",
            "LinkedList faster — O(1) prepend",
            "Both O(1) amortised",
          ],
          answer: 2,
          explanation:
            "ArrayList.add(0, x) shifts all elements → O(n) per insert → O(n²) total. LinkedList prepend is O(1) (adjusts head pointer). But for iteration or random access, ArrayList beats LinkedList — measure your workload!",
        },
        {
          id: "col-8",
          title: "Iterator.remove() vs Collection.remove()",
          code: "List<Integer> l = new ArrayList<>(List.of(1,2,3));\nIterator<Integer> it = l.iterator();\nwhile (it.hasNext()) {\n  if (it.next() == 2) it.remove();\n}",
          options: [
            "ConcurrentModificationException",
            "Removes 2 successfully",
            "Compile error",
            "UnsupportedOperationException",
          ],
          answer: 1,
          explanation:
            "Iterator.remove() updates its expectedModCount in sync with the list — no CME. This is the ONLY safe way to remove during iteration with the classic iterator API. Or use removeIf for a cleaner alternative.",
        },
        {
          id: "col-9",
          title: "ConcurrentHashMap.computeIfAbsent",
          code: 'ConcurrentMap<String, AtomicInteger> m = new ConcurrentHashMap<>();\nm.computeIfAbsent("k", k -> new AtomicInteger()).incrementAndGet();',
          options: [
            "Race condition — two threads create two AtomicIntegers",
            "Atomic: exactly one AtomicInteger created per key",
            "Throws on concurrent access",
            "Slower than synchronized HashMap",
          ],
          answer: 1,
          explanation:
            "computeIfAbsent on ConcurrentHashMap atomically checks-and-inserts under a per-bin lock. Exactly one instance is created per key, even under contention. Common pattern for thread-safe lazy initialisation per key.",
        },
        {
          id: "col-10",
          title: "Map.Entry.setValue during stream",
          code: 'Map<String, Integer> m = new HashMap<>();\nm.put("a", 1); m.put("b", 2);\nm.entrySet().stream().forEach(e -> e.setValue(e.getValue() * 10));',
          options: [
            "Mutates the map — values become 10, 20",
            "Throws ConcurrentModificationException",
            "Compile error — Entry is immutable",
            "Stream doesn't process — no terminal effect",
          ],
          answer: 0,
          explanation:
            "Entry.setValue() is part of the Map.Entry contract for live entries (not snapshots). It updates the map directly. Since we change VALUE, not structure, no CME. Changing keys would require remove+put.",
        },
        {
          id: "col-11",
          title: "PriorityQueue iteration order",
          code: 'PriorityQueue<Integer> pq = new PriorityQueue<>();\npq.offer(3); pq.offer(1); pq.offer(2);\nfor (int x : pq) System.out.print(x + " ");',
          options: [
            "1 2 3",
            "3 2 1",
            "Heap order — not guaranteed sorted",
            "3 1 2 (insertion order)",
          ],
          answer: 2,
          explanation:
            "PriorityQueue's iterator does NOT honour ordering. It returns elements in internal heap (array) order. Only poll() returns them in priority order. Use repeated poll() or sort a copy to traverse in order.",
        },
        {
          id: "col-12",
          title: "Collections.unmodifiableList — defensive view",
          code: "List<Integer> src = new ArrayList<>(List.of(1,2,3));\nList<Integer> view = Collections.unmodifiableList(src);\nsrc.add(4);\nSystem.out.println(view.size());",
          options: [
            "3 — view is a snapshot",
            "4 — view reflects underlying list",
            "Throws on add(4)",
            "Compile error",
          ],
          answer: 1,
          explanation:
            "unmodifiableList returns a VIEW, not a copy. The view rejects mutations through itself, but changes to the underlying list ARE visible. For true immutability, copy first: List.copyOf(src).",
        },
        {
          id: "col-13",
          title: "Set contains with mutated element",
          code: "Set<List<Integer>> s = new HashSet<>();\nList<Integer> l = new ArrayList<>(List.of(1, 2));\ns.add(l);\nl.add(3);\nSystem.out.println(s.contains(l));",
          options: [
            "true",
            "false",
            "Throws CME",
            "Throws NullPointerException",
          ],
          answer: 1,
          explanation:
            "After mutation, l's hashCode changed → contains() looks in the WRONG bucket → false. Element is still 'in' the set but unreachable — a classic 'poisoned set' bug. Never mutate hash-relevant fields after insertion.",
        },
        {
          id: "col-14",
          title: "Stream.toList — mutable?",
          code: "List<Integer> l = Stream.of(1, 2, 3).toList();\nl.add(4);",
          options: [
            "Adds 4",
            "UnsupportedOperationException",
            "Compile error",
            "Returns null",
          ],
          answer: 1,
          explanation:
            "Stream.toList() (Java 16+) returns an UNMODIFIABLE list. Different from collect(Collectors.toList()) which returns ArrayList (mutable). Prefer toList() when you don't need mutation.",
        },
        {
          id: "col-15",
          title: "HashMap internals — load factor",
          code: "Map<K,V> m = new HashMap<>(16, 0.75f);",
          options: [
            "Capacity 16, resize when size > 12",
            "Capacity 0.75",
            "Never resizes",
            "16 entries fixed",
          ],
          answer: 0,
          explanation:
            "Initial capacity 16, load factor 0.75. When size > capacity * loadFactor (12), HashMap doubles capacity and rehashes. Lower load factor → more memory, fewer collisions. Default 0.75 is a good time/space balance.",
        },
        {
          id: "col-16",
          title: "HashMap treeify threshold",
          code: "// Since Java 8: bucket converts from linked list to red-black tree when chain length ≥ ?",
          options: [
            "5",
            "8 (TREEIFY_THRESHOLD); reverts to list at 6 (UNTREEIFY_THRESHOLD)",
            "16",
            "Never converts",
          ],
          answer: 1,
          explanation:
            "Java 8+ HashMap upgrades a bucket from linked list to red-black tree when chain ≥ 8 entries AND table size ≥ 64 (else it just resizes). This caps worst-case lookup to O(log n) under adversarial hashCode collisions.",
        },
        {
          id: "col-17",
          title: "ConcurrentHashMap nulls",
          code: 'ConcurrentHashMap<String, String> m = new ConcurrentHashMap<>();\nm.put("k", null);',
          options: [
            "Works fine",
            "NullPointerException — CHM forbids null keys AND null values",
            "Stores null",
            "Throws ConcurrentModificationException",
          ],
          answer: 1,
          explanation:
            "ConcurrentHashMap rejects null keys and null values (NPE). Reason: 'no value' is ambiguous with 'absent' under concurrent reads. HashMap allows nulls; CHM does not — common porting trap.",
        },
        {
          id: "col-18",
          title: "LinkedHashMap LRU mode",
          code: "Map<K,V> m = new LinkedHashMap<>(16, 0.75f, true);\n// access-order = true",
          options: [
            "Insertion-ordered",
            "Access-ordered — recently used moved to tail; override removeEldestEntry for fixed-size LRU cache",
            "Random order",
            "Sorted by key",
          ],
          answer: 1,
          explanation:
            "accessOrder=true reorders entries to the tail on get/put. Combined with overriding removeEldestEntry(Entry e) returning size() > MAX, you get a textbook LRU cache in ~10 lines.",
        },
        {
          id: "col-19",
          title: "WeakHashMap",
          code: "Map<Key, Value> m = new WeakHashMap<>();",
          options: [
            "Same as HashMap",
            "Keys are held via WeakReference — entry is removed when GC reclaims the key",
            "Values are weak",
            "Both keys and values are weak",
          ],
          answer: 1,
          explanation:
            "WeakHashMap holds KEYS weakly. If no strong reference to the key exists outside the map, GC can collect it and the entry vanishes. Used for caches keyed by class/identity. Values must NOT strongly reference their key.",
        },
        {
          id: "col-20",
          title: "EnumMap / EnumSet",
          code: "EnumMap<Day, Integer> hours = new EnumMap<>(Day.class);\nEnumSet<Day> weekdays = EnumSet.range(Day.MON, Day.FRI);",
          options: [
            "Slower than HashMap",
            "Specialised: backed by an ordinal-indexed array — extremely fast and compact for enum keys",
            "Same as HashMap",
            "Only for small enums",
          ],
          answer: 1,
          explanation:
            "EnumMap/EnumSet are backed by arrays indexed by enum.ordinal(). O(1), very compact, no hashing. Iteration in declaration order. Best choice when keys are enum constants — much faster than HashMap<EnumKey, ...>.",
        },
        {
          id: "col-21",
          title: "ArrayDeque vs Stack vs LinkedList",
          code: "// Stack — legacy, synchronized\n// LinkedList — node per element, cache-unfriendly\n// ArrayDeque — circular array, fast, no nulls",
          options: [
            "Stack",
            "ArrayDeque — fastest non-thread-safe LIFO/FIFO; no nulls",
            "LinkedList",
            "Vector",
          ],
          answer: 1,
          explanation:
            "ArrayDeque is the modern choice for both stack and queue usage in single-threaded code. Faster than LinkedList (locality), than Stack (no sync, not legacy). Restriction: rejects null elements.",
        },
        {
          id: "col-22",
          title: "Iterator vs ListIterator",
          code: "// Iterator: next, hasNext, remove\n// ListIterator: + previous, hasPrevious, set, add, nextIndex",
          options: [
            "Identical",
            "ListIterator can traverse BIDIRECTIONALLY and modify in-place; only available on List",
            "ListIterator is faster",
            "ListIterator is read-only",
          ],
          answer: 1,
          explanation:
            "ListIterator extends Iterator with previous/hasPrevious and set/add. Useful for in-place edits while walking. Returned by List.listIterator().",
        },
        {
          id: "col-23",
          title: "PriorityQueue with custom comparator",
          code: "PriorityQueue<int[]> pq = new PriorityQueue<>((a,b) -> a[1] - b[1]);",
          options: [
            "Sorts by first element",
            "Sorts by second element ascending; risk of overflow for large values",
            "Compile error",
            "Throws",
          ],
          answer: 1,
          explanation:
            "Comparator orders by a[1] - b[1] ascending. Subtraction can overflow for large ints (Integer.MAX - Integer.MIN). Safer: Integer.compare(a[1], b[1]).",
        },
        {
          id: "col-24",
          title: "Collections.synchronizedList iteration",
          code: "List<Integer> l = Collections.synchronizedList(new ArrayList<>());\n// later in some thread:\nfor (int x : l) { ... }",
          options: [
            "Always thread-safe",
            "Individual ops synchronized, but COMPOUND ops (iteration, check-then-act) require external synchronized(l) {...}",
            "Faster than CopyOnWriteArrayList",
            "Iterator is automatically safe",
          ],
          answer: 1,
          explanation:
            "synchronizedList synchronizes single calls. Iteration is a compound action — wrap in synchronized(l) { for (...) } to avoid CME. CopyOnWriteArrayList sidesteps this by snapshotting on iteration (expensive writes).",
        },
        {
          id: "col-25",
          title: "Map.merge for counting",
          code: "Map<String, Integer> count = new HashMap<>();\nfor (String w : words) count.merge(w, 1, Integer::sum);",
          options: [
            "Throws NPE on first put",
            "Idiomatic: if absent, value = 1; if present, value = old + 1",
            "Same as count.put(w, 1)",
            "Doesn't compile",
          ],
          answer: 1,
          explanation:
            "merge(key, value, remappingFunction): absent → put value; present → put remapping(old, value). Cleaner than getOrDefault + put. If the remap returns null, the entry is removed.",
        },
        {
          id: "col-26",
          title: "Map.compute vs computeIfAbsent",
          code: 'map.computeIfAbsent("k", k -> heavy());\nmap.compute("k", (k, v) -> v == null ? 1 : v + 1);',
          options: [
            "Identical",
            "computeIfAbsent runs only when key is missing; compute always runs (sees current value)",
            "compute is read-only",
            "computeIfAbsent removes the key",
          ],
          answer: 1,
          explanation:
            "computeIfAbsent: only invoked when key is missing — perfect for lazy-init. compute: always invoked. computeIfPresent: only when present. Each is atomic on ConcurrentHashMap.",
        },
        {
          id: "col-27",
          title: "Queue.add vs Queue.offer",
          code: "Queue<Integer> q = new ArrayBlockingQueue<>(2);\nq.add(1); q.add(2); q.add(3);\nq.offer(1); q.offer(2); q.offer(3);",
          options: [
            "Both throw on overflow",
            "add throws IllegalStateException on bounded full queue; offer returns false",
            "offer throws; add returns false",
            "Both return false",
          ],
          answer: 1,
          explanation:
            "Capacity-restricted queues: add throws on full; offer returns boolean. Similarly remove vs poll: remove throws on empty; poll returns null. Pick the API that matches your control flow.",
        },
        {
          id: "col-28",
          title: "Comparator.comparing chain",
          code: "people.sort(\n  Comparator.comparing(Person::lastName)\n    .thenComparing(Person::firstName)\n    .thenComparingInt(Person::age));",
          options: [
            "Compile error",
            "Sorts by lastName, ties by firstName, ties by age — composable",
            "Only sorts by age",
            "Reverses order",
          ],
          answer: 1,
          explanation:
            "Comparator.comparing + thenComparing builds multi-key sorts declaratively. thenComparingInt avoids boxing. Composable, readable, idiomatic Java 8+.",
        },
        {
          id: "col-29",
          title: "Sorting null with Comparator",
          code: "Comparator<String> c = Comparator.nullsFirst(Comparator.naturalOrder());",
          options: [
            "Throws on null",
            "Pulls nulls to the front; naturalOrder used for non-nulls",
            "Compile error",
            "Treats null as empty",
          ],
          answer: 1,
          explanation:
            "Comparator.nullsFirst / nullsLast wraps a base comparator with null-safety. Useful when natural order would NPE on null. Java 8+.",
        },
        {
          id: "col-30",
          title: "Map.values is a view",
          code: 'Map<String, Integer> m = new HashMap<>();\nm.put("a", 1); m.put("b", 2);\nCollection<Integer> v = m.values();\nm.put("c", 3);\nSystem.out.println(v.size());',
          options: [
            "2",
            "3 — values is a live view of the map",
            "Throws ConcurrentModificationException",
            "Compile error",
          ],
          answer: 1,
          explanation:
            "keySet, values, entrySet are LIVE views backed by the map. Mutations show through. To snapshot, copy: new ArrayList<>(m.values()).",
        },
        {
          id: "col-31",
          title: "TreeMap.firstKey on empty",
          code: "TreeMap<String, Integer> t = new TreeMap<>();\nt.firstKey();",
          options: [
            "null",
            "NoSuchElementException",
            "Empty string",
            "Throws NullPointerException",
          ],
          answer: 1,
          explanation:
            "firstKey/lastKey on empty TreeMap throws NoSuchElementException. Defensive variant: firstEntry/lastEntry returns null instead. Or check isEmpty() first.",
        },
        {
          id: "col-32",
          title: "Set.add return value",
          code: "Set<Integer> s = new HashSet<>();\nSystem.out.println(s.add(1));\nSystem.out.println(s.add(1));",
          options: [
            "true, true",
            "true, false",
            "false, false",
            "true, throws",
          ],
          answer: 1,
          explanation:
            "Set.add returns true if the set was MODIFIED (new element added), false if it was already present. Handy for first-time-only logic without a separate contains() call.",
        },
        {
          id: "col-33",
          title: "Collections.frequency",
          code: "List<Integer> l = List.of(1,2,2,3,2);\nSystem.out.println(Collections.frequency(l, 2));",
          options: ["1", "2", "3", "5"],
          answer: 2,
          explanation:
            "Collections.frequency counts occurrences of an element via equals. Three 2s → 3. Useful one-liner instead of a manual stream count.",
        },
        {
          id: "col-34",
          title: "Iterator fail-fast vs weakly consistent",
          code: "// ArrayList iterator: fail-fast → CME on structural mod\n// ConcurrentHashMap iterator: weakly consistent",
          options: [
            "Both fail-fast",
            "ArrayList: fail-fast (throws CME); CHM: weakly consistent (no CME, may or may not see updates)",
            "Both weakly consistent",
            "CHM is fail-fast",
          ],
          answer: 1,
          explanation:
            "Fail-fast iterators detect concurrent mods via modCount and throw CME. Weakly consistent iterators (CHM, ConcurrentLinkedQueue) reflect SOME state during iteration, never throw CME — better suited to concurrent collections.",
        },
        {
          id: "col-35",
          title: "Collections.emptyList vs new ArrayList",
          code: "List<String> a = Collections.emptyList();\nList<String> b = new ArrayList<>();",
          options: [
            "Identical",
            "emptyList is a singleton immutable instance; new ArrayList is a fresh mutable list",
            "Both are mutable",
            "Both throw on add",
          ],
          answer: 1,
          explanation:
            "Collections.emptyList() returns a shared, immutable singleton. add() throws UOE. Use when you want to RETURN 'no items' without allocating; use new ArrayList when you'll later mutate.",
        },
        {
          id: "col-36",
          title: "Map.copyOf — defensive copy",
          code: "Map<String, Integer> view = Map.copyOf(originalMap);",
          options: [
            "Returns the original",
            "Returns an unmodifiable copy snapshot (Java 10+)",
            "Returns a live view",
            "Throws",
          ],
          answer: 1,
          explanation:
            "Map.copyOf (and List.copyOf, Set.copyOf since Java 10) returns an immutable SNAPSHOT — independent of subsequent mutations to the source. Differs from unmodifiableMap which is a live view.",
        },
        {
          id: "col-37",
          title: "HashMap iteration order",
          code: 'Map<String, Integer> m = new HashMap<>();\nm.put("a", 1); m.put("b", 2); m.put("c", 3);',
          options: [
            "Insertion order",
            "Sorted order",
            "Unspecified — depends on hash and capacity; do NOT rely on it",
            "Reverse insertion order",
          ],
          answer: 2,
          explanation:
            "HashMap iteration order is unspecified and can change across JVM versions or when the map resizes. If you need order: LinkedHashMap (insertion) or TreeMap (sorted).",
        },
        {
          id: "col-38",
          title: "Spliterator characteristics",
          code: "List<Integer> l = List.of(1,2,3);\nSpliterator<Integer> s = l.spliterator();\n// characteristics: ORDERED, SIZED, IMMUTABLE",
          options: [
            "Spliterator is for splitting only",
            "Characteristics like ORDERED/SIZED/DISTINCT/SORTED inform parallel stream optimisation",
            "Same as Iterator",
            "Only HashMap has Spliterators",
          ],
          answer: 1,
          explanation:
            "Spliterator drives parallel streams. trySplit splits work; characteristics flags (ORDERED, SIZED, DISTINCT, SORTED, IMMUTABLE, CONCURRENT) tell the pipeline what optimisations are safe.",
        },
        {
          id: "col-39",
          title: "CopyOnWriteArrayList cost model",
          code: "// Reads: lock-free, snapshot\n// Writes: copy the entire array — O(n)",
          options: [
            "Always faster than ArrayList",
            "Reads cheap and lock-free; writes are O(n) — only suitable when reads VASTLY outnumber writes",
            "Reads and writes equally fast",
            "Writes are O(1)",
          ],
          answer: 1,
          explanation:
            "COWAL: each write clones the underlying array. Excellent for listener lists (read often, write rarely). Terrible for write-heavy workloads. Iterators see a fixed snapshot — never throw CME.",
        },
        {
          id: "col-40",
          title: "LinkedList — when?",
          code: "// Almost never. LinkedList loses to ArrayDeque/ArrayList in practice.",
          options: [
            "Always use LinkedList for queues",
            "Rarely the right choice — ArrayList beats it at iteration, ArrayDeque beats it as queue/deque; only edge case is heavy mid-list insert via iterator",
            "Faster than ArrayList for everything",
            "Only choice for queues",
          ],
          answer: 1,
          explanation:
            "Pointer-chasing kills cache performance. Even 'O(1) insert in the middle' is theoretical — you'd still spend O(n) finding the spot. Modern advice: default to ArrayList; use ArrayDeque for queue/stack/deque.",
        },
      ],
    },

    {
      id: "generics",
      title: "Generics — extends, super, wildcards",
      icon: "🧬",
      color: "#ec4899",
      blurb: "PECS, invariance, type erasure, raw types, bounded wildcards.",
      questions: [
        {
          id: "gen-1",
          title: "List<Dog> assigned to List<Animal>?",
          code: "List<Dog> dogs = new ArrayList<>();\nList<Animal> animals = dogs;",
          options: [
            "Compiles — covariance",
            "Compile error — generics are invariant",
            "Runtime ClassCastException",
            "Warning only",
          ],
          answer: 1,
          explanation:
            "Generics are INVARIANT. List<Dog> is NOT a subtype of List<Animal>, even though Dog IS-A Animal. Without invariance, you could put a Cat into a List<Animal> that secretly holds Dogs. Use List<? extends Animal> for read-covariant access.",
        },
        {
          id: "gen-2",
          title: "PECS — Producer Extends",
          code: "void copy(List<? extends Number> src, List<? super Number> dst) {\n  for (Number n : src) dst.add(n);\n}",
          options: [
            "Wrong direction — should be reversed",
            "Correct — src produces, dst consumes",
            "Generics — should use raw types",
            "Should use List<Number> for both",
          ],
          answer: 1,
          explanation:
            "PECS = Producer Extends, Consumer Super. src PRODUCES numbers → ? extends Number (read-only). dst CONSUMES → ? super Number (write-only with type-safe upper bound). This is Effective Java Item 31.",
        },
        {
          id: "gen-3",
          title: "Can you add to List<? extends Number>?",
          code: "List<? extends Number> l = new ArrayList<Integer>();\nl.add(5);\nl.add(null);",
          options: [
            "Both work",
            "Add 5 fails compile; add null works",
            "Both fail compile",
            "Both throw at runtime",
          ],
          answer: 1,
          explanation:
            "List<? extends Number> means 'some unknown subtype of Number'. The compiler can't verify Integer is safe to add (the list could be List<Double>). null is the only thing safely assignable to any reference type, so add(null) compiles.",
        },
        {
          id: "gen-4",
          title: "Type erasure — runtime check",
          code: "List<String> ls = new ArrayList<>();\nList<Integer> li = new ArrayList<>();\nSystem.out.println(ls.getClass() == li.getClass());",
          options: ["true", "false", "Compile error", "Throws"],
          answer: 0,
          explanation:
            "At runtime, generic parameters are ERASED. Both are ArrayList.class — generic type info is gone. This is why you cannot do 'new T()' or 'x instanceof List<String>' at runtime.",
        },
        {
          id: "gen-5",
          title: "Raw type — unchecked warning",
          code: "List l = new ArrayList<String>();\nl.add(42);\nString s = (String) l.get(0);",
          options: [
            "Compile error",
            "Compiles with warnings; runtime ClassCastException",
            "Runs fine — autoboxing converts",
            "NullPointerException",
          ],
          answer: 1,
          explanation:
            "Using raw type bypasses generic checks → compiler warns but allows it. Integer ends up in a list that 'is' List<String>. The cast to String at get() throws ClassCastException at runtime. Heap pollution!",
        },
        {
          id: "gen-6",
          title: "Generic method type inference",
          code: 'static <T> T first(List<T> l) { return l.get(0); }\nObject o = first(List.of("hi"));\nString s = first(List.of("hi"));',
          options: [
            "Both compile",
            "Only first compiles",
            "Only second compiles",
            "Neither compiles",
          ],
          answer: 0,
          explanation:
            "Type inference uses the assignment context. First: T inferred as Object (returns Object). Second: T inferred as String. Both compile. The Java compiler uses 'target type inference' for the call site.",
        },
        {
          id: "gen-7",
          title: "Array of generic type",
          code: "List<String>[] arr = new List<String>[10];",
          options: [
            "Compiles fine",
            "Compile error — generic array creation",
            "Compiles with warning, runs fine",
            "Runtime ArrayStoreException",
          ],
          answer: 1,
          explanation:
            "Java forbids creating generic arrays. Because arrays are covariant + reified but generics are erased, you'd be able to put a List<Integer> into a 'List<String>[]' without compile error → unsafe. Workaround: List<List<String>> or @SuppressWarnings with raw arrays.",
        },
        {
          id: "gen-8",
          title: "Bounded type parameter",
          code: "static <T extends Comparable<T>> T max(List<T> l) {\n  T best = l.get(0);\n  for (T x : l) if (x.compareTo(best) > 0) best = x;\n  return best;\n}",
          options: [
            "Correct — bounds enable compareTo",
            "Should be Comparable<? super T>",
            "Doesn't compile",
            "Should drop the bound",
          ],
          answer: 1,
          explanation:
            "Better form: <T extends Comparable<? super T>>. If T = Manager extends Employee, and Employee implements Comparable<Employee>, then Manager isn't 'Comparable<Manager>' but IS comparable via supertype. The super bound makes it more flexible. Both compile, but ? super T is the canonical advice (Effective Java).",
        },
        {
          id: "gen-9",
          title: "Multiple bounds",
          code: "<T extends Number & Comparable<T>> T m(T x, T y) { ... }",
          options: [
            "Compile error — only single bound allowed",
            "Multiple bounds allowed; first must be a class (or none), rest interfaces",
            "Need to use ',' instead of '&'",
            "Allowed only for interfaces",
          ],
          answer: 1,
          explanation:
            "Multiple bounds use '&'. At most ONE class bound, and it must come first (e.g. <T extends Number & Comparable<T>>). All others must be interfaces. Erasure uses the first bound.",
        },
        {
          id: "gen-10",
          title: "Generic constructor",
          code: "class Box {\n  <T> Box(T item) { System.out.println(item.getClass()); }\n}\nnew Box(42);\nnew <Integer>Box(42);",
          options: [
            "Both work",
            "Only first works — explicit type args on constructor uncommon and require special syntax",
            "Both throw",
            "Compile error on first",
          ],
          answer: 0,
          explanation:
            "Constructors can be generic independently of the class. Type is usually inferred; explicit syntax 'new <Integer>Box(42)' is rarely used but legal.",
        },
        {
          id: "gen-11",
          title: "Class<T> token",
          code: "<T> T parse(String json, Class<T> type) { ... }\nUser u = parse(s, User.class);",
          options: [
            "Useless",
            "Common idiom — passes the Class literal to recover type info lost to erasure",
            "Compile error",
            "Use TypeVariable<T>",
          ],
          answer: 1,
          explanation:
            "Since generic type info is erased, libraries pass Class<T> tokens (Class.cast / Class.newInstance) to recover runtime type. For parameterised types (List<User>), use TypeReference / TypeToken (Guava, Jackson).",
        },
        {
          id: "gen-12",
          title: "Generic exception class",
          code: "class MyEx<T> extends Exception { T data; }",
          options: [
            "Allowed",
            "Compile error — generic types cannot directly or indirectly extend Throwable",
            "Allowed only for RuntimeException",
            "Allowed with @SuppressWarnings",
          ],
          answer: 1,
          explanation:
            "JLS forbids generic Throwable subclasses. Why? catch clauses are reified at runtime; generic types are erased — you can't distinguish 'catch (MyEx<Integer> e)' from 'catch (MyEx<String> e)'. So Java just bans it.",
        },
        {
          id: "gen-13",
          title: "Heap pollution",
          code: "List<String> ls = new ArrayList<>();\nList<Integer> li = (List<Integer>) (Object) ls;\nli.add(1);\nString s = ls.get(0); // BOOM",
          options: [
            "Compile error",
            "Compiles with unchecked cast; runtime ClassCastException on read — heap pollution",
            "Runs fine — autoboxing",
            "ls.add(1) fails",
          ],
          answer: 1,
          explanation:
            "Through unchecked casts you can put a value of the wrong type into a generic collection — heap pollution. The error surfaces only when you read it back with the static type. Avoid unchecked casts.",
        },
        {
          id: "gen-14",
          title: "@SafeVarargs",
          code: "static <T> List<T> wrap(T... items) { return Arrays.asList(items); }",
          options: [
            "Always safe",
            "Compiler warns about unsafe varargs of generic type; @SafeVarargs suppresses the warning when you guarantee no heap pollution",
            "Required by JLS",
            "Only for final methods",
          ],
          answer: 1,
          explanation:
            "Generic varargs create a T[] (impossible to type-check at call site → warning). @SafeVarargs (on final/static/private methods or constructors since Java 9) declares the method doesn't store/leak the array — suppresses the warning.",
        },
        {
          id: "gen-15",
          title: "Diamond operator inference",
          code: "Map<String, List<Integer>> m = new HashMap<>();",
          options: [
            "Compile error — must repeat the args",
            "Diamond (Java 7+) infers from the left-hand declared type",
            "Only for collections",
            "Throws at runtime",
          ],
          answer: 1,
          explanation:
            "Java 7+ diamond <> instructs the compiler to infer type arguments from context (typically the assignment target or method signature). Eliminates noisy repetition.",
        },
        {
          id: "gen-16",
          title: "<? super T> — Consumer Super",
          code: "void addAllInts(List<? super Integer> dst) {\n  dst.add(1); dst.add(2);\n}",
          options: [
            "Can only add Integer or its subtype",
            "Can add Integer; reading yields Object (upper bound is unknown)",
            "Can read as Integer",
            "Compile error",
          ],
          answer: 1,
          explanation:
            "<? super Integer> means 'some unknown supertype of Integer'. We KNOW Integer is safely assignable into it, so we can ADD. We don't know the exact type, so READS only give Object.",
        },
        {
          id: "gen-17",
          title: "<? extends T> — Producer Extends",
          code: "double sum(List<? extends Number> l) {\n  double s = 0; for (Number n : l) s += n.doubleValue(); return s;\n}",
          options: [
            "Compile error — should be List<Number>",
            "Works; we can READ as Number but cannot ADD (except null)",
            "Can add Number",
            "Only ints allowed",
          ],
          answer: 1,
          explanation:
            "<? extends Number> is read-friendly. We can iterate and treat elements as Number. We can't safely add (could be List<Double>, List<BigDecimal>...).",
        },
        {
          id: "gen-18",
          title: "Wildcard capture",
          code: "void swap(List<?> l, int i, int j) {\n  // l.set(i, l.get(j));  // compile error\n  swapHelper(l, i, j);\n}\nstatic <T> void swapHelper(List<T> l, int i, int j) {\n  T tmp = l.get(i); l.set(i, l.get(j)); l.set(j, tmp);\n}",
          options: [
            "Pointless",
            "Capture conversion: route through a generic helper to give the wildcard a 'name' (T)",
            "Use raw types",
            "Compile error always",
          ],
          answer: 1,
          explanation:
            "You can't set() into List<?> because the compiler doesn't know the element type. Delegating to a generic helper CAPTURES the wildcard as a fresh type variable T, enabling safe in-place edits.",
        },
        {
          id: "gen-19",
          title: "Generic method vs generic class",
          code: "// (a) class Box<T> { T get(); }\n// (b) static <T> T identity(T x) { return x; }",
          options: [
            "Same thing",
            "(a) parameterises the CLASS; (b) parameterises a single METHOD — independent scopes",
            "Both define class-level T",
            "Both define method-level T",
          ],
          answer: 1,
          explanation:
            "Class-level T is shared across all methods of an instance. Method-level T (declared in <>) is fresh per call and has no relation to any other type variable. A method T can shadow a class T (warning, but allowed).",
        },
        {
          id: "gen-20",
          title: "Recursive generic bound",
          code: "enum Direction implements Comparable<Direction> { N, E, S, W }\n// Comparable<T extends Comparable<T>>",
          options: [
            "Strange and never used",
            "Common idiom: a type that compares to itself — like enum order, BigDecimal, String",
            "Compile error in Java",
            "Only for numeric types",
          ],
          answer: 1,
          explanation:
            "Recursive bounds enable APIs like 'sort a List of things that compare to themselves' without losing the concrete type. Enum<E extends Enum<E>> is the canonical example.",
        },
        {
          id: "gen-21",
          title: "Bridge methods (erasure quirk)",
          code: "interface Comparable<T> { int compareTo(T o); }\nclass Money implements Comparable<Money> { public int compareTo(Money m) { ... } }\n// compiler also synthesizes:\n// public int compareTo(Object o) { return compareTo((Money) o); }",
          options: [
            "Compiler bug",
            "Bridge methods preserve compatibility between generic source and erased bytecode",
            "Programmer must write them",
            "Only used in proxies",
          ],
          answer: 1,
          explanation:
            "Erasure replaces T with its bound (Object here). The compiler synthesises 'bridge' methods so virtual dispatch from old code still works. Visible via reflection (Method.isBridge()).",
        },
        {
          id: "gen-22",
          title: "Raw type behaviour",
          code: "List l = new ArrayList<String>();\nList<Object> lo = l;",
          options: [
            "Compile error",
            "Compiles with unchecked-conversion warning; raw types escape generic checks",
            "Not a warning, full error",
            "Throws at runtime",
          ],
          answer: 1,
          explanation:
            "Raw types exist only for backward compatibility with pre-generics code. They opt OUT of type checks. The compiler issues unchecked warnings; use raw types only when truly necessary.",
        },
        {
          id: "gen-23",
          title: "Cannot use new T()",
          code: "<T> T create() { return new T(); }",
          options: [
            "Compiles fine",
            "Compile error — type T is erased; the compiler doesn't know which class to instantiate",
            "Returns null",
            "Allowed only for primitives",
          ],
          answer: 1,
          explanation:
            "Erasure means T is gone at runtime. You can't 'new T()'. Workarounds: pass Class<T> and use type.getDeclaredConstructor().newInstance(), or pass a Supplier<T>.",
        },
        {
          id: "gen-24",
          title: "instanceof with generic type",
          code: "if (x instanceof List<String>) { ... }",
          options: [
            "Compiles fine",
            "Compile error — cannot test parameterised type at runtime due to erasure; use 'List<?>' or check elements separately",
            "Allowed since Java 21",
            "Throws at runtime",
          ],
          answer: 1,
          explanation:
            "Generic type arguments are erased — runtime can't tell List<String> from List<Integer>. Use 'instanceof List<?>' or 'instanceof List' (raw). For elements, you must check each one or use a stream filter.",
        },
        {
          id: "gen-25",
          title: "Generic and overloading — erasure clash",
          code: "class X {\n  void m(List<String> l) {}\n  void m(List<Integer> l) {}\n}",
          options: [
            "Both signatures coexist",
            "Compile error — both erase to m(List), the same signature",
            "Compiles but ambiguous at runtime",
            "Allowed since Java 11",
          ],
          answer: 1,
          explanation:
            "After erasure both methods have the same descriptor 'void m(List)'. JLS rejects overloads that erase to the same signature. Use distinct method names instead.",
        },
      ],
    },

    {
      id: "patterns",
      title: "Design Patterns",
      icon: "🏛️",
      color: "#f59e0b",
      blurb:
        "Singleton, Factory, Builder, Prototype, Observer, Strategy, Decorator.",
      questions: [
        {
          id: "pat-1",
          title: "Identify the pattern (and the bug)",
          code: "class Config {\n  private static Config instance;\n  private Config() {}\n  public static Config get() {\n    if (instance == null) instance = new Config();\n    return instance;\n  }\n}",
          options: [
            "Factory — fine",
            "Singleton — thread-safe",
            "Singleton — BROKEN under threads, two instances possible",
            "Prototype — clones each call",
          ],
          answer: 2,
          explanation:
            "Singleton, lazy init. Two threads can both see null → both create instances. Fixes: synchronized method (slow), double-checked locking with volatile, holder-class idiom (Initialization-on-demand), or enum Singleton (best — also serialization-safe).",
        },
        {
          id: "pat-2",
          title: "Enum Singleton — why?",
          code: "public enum Config {\n  INSTANCE;\n  public void doStuff() { ... }\n}",
          options: [
            "Just stylistic — equivalent to class Singleton",
            "Thread-safe, serialization-safe, reflection-resistant — best Java idiom",
            "Slower than static field",
            "Cannot have methods",
          ],
          answer: 1,
          explanation:
            "Enum constants are lazily initialised by JVM in a thread-safe way. enum serialization preserves singleton-ness automatically. Reflection cannot instantiate enums via newInstance (throws IllegalArgumentException). Effective Java Item 3.",
        },
        {
          id: "pat-3",
          title: "Prototype pattern",
          code: "interface Shape { Shape clone(); }\nclass Circle implements Shape {\n  int r;\n  public Circle clone() { return new Circle(this.r); }\n}",
          options: [
            "Factory",
            "Prototype — create-by-copying",
            "Builder",
            "Adapter",
          ],
          answer: 1,
          explanation:
            "Prototype creates new objects by cloning an existing instance. Useful when construction is expensive or the type is known only at runtime. Java's Cloneable / Object.clone() is the classic (flawed) hook.",
        },
        {
          id: "pat-4",
          title: "Builder pattern — what's the point?",
          code: 'Pizza p = new Pizza.Builder()\n  .size("large")\n  .addTopping("olives")\n  .addTopping("cheese")\n  .build();',
          options: [
            "Slower than constructor",
            "Readable construction with many optional params; immutable result",
            "Same as setters — no benefit",
            "Required for any non-trivial object",
          ],
          answer: 1,
          explanation:
            "Builder solves the 'telescoping constructor' anti-pattern (5 overloads with optional args). Named, fluent, validates in build(), and the final object can be immutable. Use when you have ≥4 params or many optional fields.",
        },
        {
          id: "pat-5",
          title: "Observer order of notification",
          code: 'EventBus bus = new EventBus();\nbus.subscribe(m -> System.out.println("A: " + m));\nbus.subscribe(m -> System.out.println("B: " + m));\nbus.publish("hi");',
          options: [
            "B: hi, A: hi",
            "A: hi, B: hi",
            "Random",
            "Only one subscriber receives",
          ],
          answer: 1,
          explanation:
            "Observer/Pub-Sub. With an ArrayList of listeners, notification order is subscription order: A before B.",
        },
        {
          id: "pat-6",
          title: "Strategy pattern",
          code: "interface SortStrategy { void sort(int[] a); }\nclass QuickSort implements SortStrategy { ... }\nclass MergeSort implements SortStrategy { ... }\nclass Sorter { SortStrategy s; void run(int[] a){ s.sort(a); } }",
          options: [
            "State pattern",
            "Strategy pattern — runtime swap of algorithm",
            "Visitor pattern",
            "Command pattern",
          ],
          answer: 1,
          explanation:
            "Strategy encapsulates an algorithm behind an interface, lets you swap implementations at runtime. State looks similar but represents internal mode (transitions between states); Strategy is externally chosen behaviour.",
        },
        {
          id: "pat-7",
          title: "Decorator vs Inheritance",
          code: 'BufferedReader br = new BufferedReader(new FileReader("f.txt"));',
          options: [
            "Inheritance — BufferedReader extends FileReader",
            "Decorator — BufferedReader wraps any Reader",
            "Composite",
            "Adapter",
          ],
          answer: 1,
          explanation:
            "Java's I/O streams are the textbook Decorator. BufferedReader is-a Reader (composition) and adds buffering on top of any underlying Reader (FileReader, StringReader, etc.). Adds behaviour at runtime without subclass explosion.",
        },
        {
          id: "pat-8",
          title: "Factory Method vs Abstract Factory",
          code: '// (1)  Document d = DocumentFactory.create("pdf");\n// (2)  GuiFactory gui = new MacGuiFactory();\n//      Button b = gui.button(); Menu m = gui.menu();',
          options: [
            "Both identical",
            "(1) Factory Method — one product; (2) Abstract Factory — family of products",
            "(1) Abstract Factory; (2) Factory Method",
            "Both are Builder",
          ],
          answer: 1,
          explanation:
            "Factory Method: ONE method creates ONE product (often via subclassing). Abstract Factory: an interface with MULTIPLE related products (a 'family') — swap the factory and get a consistent set of related objects.",
        },
        {
          id: "pat-9",
          title: "Adapter pattern",
          code: "// New code expects MediaPlayer.play()\n// Legacy library exposes OldAudio.start()\n// class AudioAdapter implements MediaPlayer { OldAudio o; void play(){ o.start(); } }",
          options: [
            "Bridge",
            "Adapter — bridges incompatible interfaces",
            "Facade",
            "Proxy",
          ],
          answer: 1,
          explanation:
            "Adapter translates one interface into another. Compare with Facade (simplified API over complex subsystem) and Proxy (same interface, controlled access).",
        },
        {
          id: "pat-10",
          title: "Open/Closed via Strategy",
          code: "// Bad:  if (type == PDF) ... else if (type == DOCX) ...\n// Good: Map<String, Exporter> exporters; exporters.get(type).export();",
          options: [
            "Both equivalent",
            "Map version is Open/Closed — add new Exporter without modifying caller",
            "Map version slower — avoid",
            "Both violate OCP",
          ],
          answer: 1,
          explanation:
            "Open/Closed: open for extension, closed for modification. A registry/Strategy lookup means adding new types doesn't touch existing code — just register a new Exporter. The if-chain forces editing every time.",
        },
        {
          id: "pat-11",
          title: "Chain of Responsibility",
          code: "// Each handler decides: handle or forward.\n// Servlet Filters, Spring Security filter chain, log4j appenders.",
          options: [
            "Command",
            "Chain of Responsibility — request flows along a chain until handled",
            "Observer",
            "Mediator",
          ],
          answer: 1,
          explanation:
            "CoR decouples sender from receiver: each handler in the chain can process or pass along. Examples: Servlet filter, Spring's HandlerInterceptor, exception handler stacks.",
        },
        {
          id: "pat-12",
          title: "Command pattern",
          code: "interface Command { void execute(); void undo(); }\nclass DeleteFile implements Command { ... }\n// Caller pushes commands onto a queue / history for undo",
          options: [
            "State",
            "Command — encapsulates a request as an object; enables undo/redo, queues, logging",
            "Strategy",
            "Visitor",
          ],
          answer: 1,
          explanation:
            "Command turns an action into a first-class object. Enables: undo stacks, transactional batches, deferred execution, macros. Used in Swing actions and the Java executor framework (Runnable IS a command).",
        },
        {
          id: "pat-13",
          title: "State pattern",
          code: "interface OrderState { void next(); }\nclass NewOrder implements OrderState { ... }\nclass Paid implements OrderState { ... }\nclass Order { OrderState state; void next(){ state.next(); } }",
          options: [
            "Strategy",
            "State — object's behaviour changes with its INTERNAL state (state transitions)",
            "Command",
            "Observer",
          ],
          answer: 1,
          explanation:
            "State and Strategy look alike (an object with pluggable behaviour). Difference: State models transitions INTERNAL to the object (NewOrder → Paid → Shipped); Strategy is EXTERNALLY chosen behaviour.",
        },
        {
          id: "pat-14",
          title: "Template Method",
          code: "abstract class Report {\n  public final void run() { load(); compute(); render(); }\n  protected abstract void compute();\n}",
          options: [
            "Strategy",
            "Template Method — fixed skeleton in the base class, steps customised by subclasses",
            "Decorator",
            "Bridge",
          ],
          answer: 1,
          explanation:
            "Template Method fixes the algorithm's STEPS in the superclass (often final) and lets subclasses customise individual steps via abstract or hook methods. Common in frameworks (HttpServlet.service).",
        },
        {
          id: "pat-15",
          title: "Visitor pattern",
          code: "interface Visitor { void visit(Circle c); void visit(Square s); }\ninterface Shape { void accept(Visitor v); }\n// Add new operations without modifying Shape hierarchy",
          options: [
            "Strategy",
            "Visitor — separates ALGORITHMS from the object hierarchy; double dispatch",
            "Iterator",
            "Mediator",
          ],
          answer: 1,
          explanation:
            "Visitor uses double dispatch (accept(this) then visit(this)) to apply new operations to a fixed type hierarchy without modifying it. Trade-off: easy to add operations, hard to add new types.",
        },
        {
          id: "pat-16",
          title: "Flyweight",
          code: "// Integer.valueOf cache (-128..127), String pool",
          options: [
            "Singleton",
            "Flyweight — share immutable instances to reduce memory for many similar objects",
            "Prototype",
            "Proxy",
          ],
          answer: 1,
          explanation:
            "Flyweight stores immutable shared state externally and reuses instances. Integer cache, String pool, Java enums are flyweights. The shared state must be immutable to be safely shared.",
        },
        {
          id: "pat-17",
          title: "Proxy pattern",
          code: "interface Service { void op(); }\nclass RealService implements Service { ... }\nclass LoggingProxy implements Service {\n  Service real;\n  public void op() { log(); real.op(); }\n}",
          options: [
            "Adapter",
            "Proxy — controls access to a target (lazy load, security, logging, remoting)",
            "Decorator (identical)",
            "Facade",
          ],
          answer: 1,
          explanation:
            "Proxy SAME interface, controlled access. Decorator SAME interface, ADDS behaviour. Adapter DIFFERENT interface bridged. Spring AOP, JPA lazy-loading, RMI all use proxies.",
        },
        {
          id: "pat-18",
          title: "Facade pattern",
          code: "class VideoConverter {\n  void convert(String in, String out) {\n    // hides Codec, Bitrate, Container, ... details\n  }\n}",
          options: [
            "Adapter",
            "Facade — single high-level entry point hiding complex subsystem",
            "Decorator",
            "Proxy",
          ],
          answer: 1,
          explanation:
            "Facade simplifies access to a subsystem with one cohesive API. Doesn't add behaviour; just hides complexity. Spring's JdbcTemplate is a facade over JDBC.",
        },
        {
          id: "pat-19",
          title: "Composite pattern",
          code: "interface Component { int size(); }\nclass File implements Component { ... }\nclass Folder implements Component { List<Component> children; ... }",
          options: [
            "Decorator",
            "Composite — uniformly treat leaves and containers as the same interface (tree structure)",
            "Visitor",
            "Bridge",
          ],
          answer: 1,
          explanation:
            "Composite represents part-whole hierarchies. Clients treat single items and groups identically. File systems, UI containers (Swing JComponent), AST nodes — all composites.",
        },
        {
          id: "pat-20",
          title: "Mediator pattern",
          code: "// Instead of N services calling each other (N²),\n// they all talk to a Mediator that orchestrates",
          options: [
            "Observer",
            "Mediator — central hub coordinates collaborators, reducing direct coupling",
            "Facade",
            "Adapter",
          ],
          answer: 1,
          explanation:
            "Mediator replaces many-to-many connections with a single coordinator. Trade-off: simpler edges but the mediator can grow into a god-object. Often seen in workflow engines / message brokers.",
        },
        {
          id: "pat-21",
          title: "Memento pattern",
          code: "class Editor { String text; Snapshot save() { return new Snapshot(text); } void restore(Snapshot s) { text = s.text; } }",
          options: [
            "Prototype",
            "Memento — capture/restore internal state without exposing it (undo)",
            "Command",
            "Snapshot is not a pattern",
          ],
          answer: 1,
          explanation:
            "Memento externalises a snapshot of object state for later restore — without violating encapsulation (the memento is opaque to outsiders). Foundation of undo/redo.",
        },
        {
          id: "pat-22",
          title: "Bridge pattern",
          code: "// Split abstraction (Shape) from implementation (Renderer)\n// so they can vary independently:\n// Circle/Square × CanvasRenderer/SvgRenderer",
          options: [
            "Adapter",
            "Bridge — decouple abstraction from implementation; both vary independently",
            "Strategy",
            "Composite",
          ],
          answer: 1,
          explanation:
            "Bridge prevents class explosion when two dimensions vary (Shape × Renderer). Abstraction holds a reference to Implementor; subclasses on each side can be combined. Differs from Strategy in scope: structural vs behavioural.",
        },
        {
          id: "pat-23",
          title: "Object Pool",
          code: "// Reuse expensive objects (DB connections, threads) from a pool\n// HikariCP, ThreadPoolExecutor",
          options: [
            "Singleton",
            "Object Pool — reuse a bounded set of expensive resources",
            "Prototype",
            "Flyweight",
          ],
          answer: 1,
          explanation:
            "Pool keeps a fixed/bounded set of pre-created objects (connections, threads). Borrow → use → return. Reduces allocation cost and bounds resource usage. Hikari (JDBC), ExecutorService (threads).",
        },
        {
          id: "pat-24",
          title: "Null Object pattern",
          code: "interface Logger { void log(String m); }\nclass NullLogger implements Logger { public void log(String m) {} }",
          options: [
            "Singleton",
            "Null Object — avoids null checks by providing a 'do nothing' default",
            "Proxy",
            "Adapter",
          ],
          answer: 1,
          explanation:
            "Instead of returning null and forcing every caller to check, return a no-op implementation. Avoids NPE and litters of 'if (x != null)'. Java's Optional.empty is a structural variant.",
        },
        {
          id: "pat-25",
          title: "DAO (Data Access Object)",
          code: "interface UserDao { Optional<User> findById(long id); void save(User u); }",
          options: [
            "Service Locator",
            "DAO — abstracts persistence, allowing swap of DB technology behind an interface",
            "Repository (identical)",
            "Adapter",
          ],
          answer: 1,
          explanation:
            "DAO isolates persistence concerns behind an interface. Repository (DDD) is similar but more domain-oriented. Spring Data Repositories combine both: behaviour-rich DAO with domain language.",
        },
      ],
    },

    {
      id: "sysdesign",
      title: "System Design Patterns",
      icon: "🏗️",
      color: "#0ea5e9",
      blurb: "Event-driven, pub-sub, interrupt-driven, polling, request-reply.",
      questions: [
        {
          id: "sd-1",
          title: "Polling vs Interrupt-driven",
          code: "// (A) while (true) { if (sensor.ready()) read(); }\n// (B) sensor.onReady(this::read);",
          options: [
            "A is interrupt-driven, B is polling",
            "Both are polling",
            "A is polling (busy wait), B is interrupt/event-driven (push)",
            "B is slower — avoid",
          ],
          answer: 2,
          explanation:
            "Polling = consumer repeatedly asks 'are we there yet?' (wastes CPU). Interrupt/event-driven = producer notifies consumer when ready (efficient). Event loops, ISRs, OS interrupts, and reactive streams all use the push model.",
        },
        {
          id: "sd-2",
          title: "Pub-Sub vs Point-to-Point queue",
          code: "// Pub-Sub:  one publish → all subscribers get a copy\n// Queue:    one publish → ONE consumer gets it",
          options: [
            "Identical",
            "Pub-Sub is fan-out (broadcast); Queue is load-balancing (single consumer)",
            "Pub-Sub guarantees order, Queue doesn't",
            "Queue is faster always",
          ],
          answer: 1,
          explanation:
            "Topic/Pub-Sub: every subscriber gets every message — used for notifications, cache invalidation, event sourcing. Queue: one message → one consumer — used for work distribution, load balancing across worker pool. Kafka topics + consumer groups give you both.",
        },
        {
          id: "sd-3",
          title: "Synchronous vs Asynchronous",
          code: "// Sync:  result = service.call();   // blocks\n// Async: future = service.callAsync();\n//        future.thenAccept(this::handle);",
          options: [
            "Sync is always slower",
            "Async returns immediately; result delivered later via callback/future",
            "Async ignores results",
            "They're identical — JIT optimises",
          ],
          answer: 1,
          explanation:
            "Async releases the calling thread immediately. Result is delivered later (callback, Future, Promise, Observable). Crucial for high-throughput servers — avoids blocking limited threads on slow I/O.",
        },
        {
          id: "sd-4",
          title: "Event sourcing",
          code: "// Instead of storing current account balance,\n// store sequence of events: Deposit(100), Withdraw(20), Deposit(50)\n// Balance = fold(events)",
          options: [
            "Wasteful — just store the balance",
            "Provides audit trail, time-travel, rebuildable state — but more complex",
            "Same as CRUD",
            "Only works for finance",
          ],
          answer: 1,
          explanation:
            "Event sourcing keeps the full history. Benefits: audit log built-in, replay to fix bugs, derive multiple views (CQRS read models). Trade-offs: events are immutable (schema evolution hard), snapshots needed for performance.",
        },
        {
          id: "sd-5",
          title: "Reactive Streams — backpressure",
          code: "publisher.subscribe(subscriber);\n// subscriber.request(n) signals how much it can handle",
          options: [
            "Push as fast as possible — let consumer crash",
            "Pull-based; consumer requests demand; producer respects it (backpressure)",
            "Polling-based",
            "Only for UI",
          ],
          answer: 1,
          explanation:
            "Reactive Streams (java.util.concurrent.Flow) standardises async streaming WITH backpressure: subscriber.request(n) tells the publisher how much it can handle. Prevents overwhelming slow consumers. Used by Reactor, RxJava, Akka Streams.",
        },
        {
          id: "sd-6",
          title: "Circuit breaker",
          code: "// After N failures, OPEN the circuit → fail fast for X seconds\n// Then half-open: try one call → success closes, failure re-opens",
          options: [
            "Useless overhead",
            "Prevents cascading failure by short-circuiting calls to a failing dependency",
            "Same as a retry loop",
            "Only for security",
          ],
          answer: 1,
          explanation:
            "Pattern from Michael Nygard / Hystrix / Resilience4j. Stops piling load onto a broken downstream — fails fast, gives it time to recover, and gradually probes. Three states: CLOSED, OPEN, HALF_OPEN.",
        },
        {
          id: "sd-7",
          title: "At-most-once vs At-least-once vs Exactly-once",
          code: "// Producer publishes, consumer crashes after processing but before ack:\n// At-most-once:  message LOST  (ack first, process later)\n// At-least-once: message DUPLICATED (process first, ack later)\n// Exactly-once:  needs idempotency + transactional outbox",
          options: [
            "Exactly-once is free — just enable it",
            "At-least-once + idempotent consumer is the pragmatic 'exactly-once'",
            "All three are equivalent",
            "At-most-once is safest",
          ],
          answer: 1,
          explanation:
            "True exactly-once in distributed systems is impossible without coordination. Standard pattern: at-least-once delivery + idempotent processing (or dedupe by message ID) gives effectively-exactly-once semantics. Kafka's 'exactly-once' uses idempotent producers + transactions.",
        },
        {
          id: "sd-8",
          title: "CAP theorem — Network Partition",
          code: "// During a network partition, you must choose:\n// (a) Consistency  — reject some reads/writes\n// (b) Availability — serve possibly stale data",
          options: [
            "You can have all three always",
            "Network partitions are rare — ignore them",
            "Under a partition, you must trade Consistency vs Availability — there's no escaping",
            "Pick all three with enough hardware",
          ],
          answer: 2,
          explanation:
            "CAP: under a network Partition, choose Consistency OR Availability. Partitions WILL happen in real distributed systems — your design picks which way you fail. CP: ZooKeeper, etcd. AP: DynamoDB (defaults), Cassandra. Note PACELC extends CAP for the no-partition case.",
        },
        {
          id: "sd-9",
          title: "Microservices vs Monolith",
          code: "// Monolith: one deployable, easy to start, hard to scale teams\n// Microservices: independent deploys, polyglot, but operational complexity",
          options: [
            "Microservices always better",
            "Trade-offs: monolith → simple ops; microservices → independent scaling/team autonomy with significant operational cost",
            "Monolith always better",
            "They are the same architecture",
          ],
          answer: 1,
          explanation:
            "Microservices aren't free: distributed tracing, network failure, consistency, deploys, observability all become harder. Often start as a well-modularised monolith and extract services when team/scale pressure justifies.",
        },
        {
          id: "sd-10",
          title: "API Gateway role",
          code: "// All client traffic hits one gateway: auth, rate-limit, routing, aggregation",
          options: [
            "Service registry",
            "Gateway: single ingress that does auth, rate-limit, routing, request shaping",
            "Load balancer (identical)",
            "Service mesh (identical)",
          ],
          answer: 1,
          explanation:
            "API Gateway is the cross-cutting edge: TLS termination, AuthN/Z, throttling, request transformation, BFF aggregation. Examples: Spring Cloud Gateway, Kong, AWS API Gateway.",
        },
        {
          id: "sd-11",
          title: "Service discovery",
          code: "// Service A wants to call Service B. How to find B's address?",
          options: [
            "Hard-code IPs",
            "Registry (Eureka, Consul, k8s DNS) — services register and discover by name",
            "DNS only",
            "Manual config files",
          ],
          answer: 1,
          explanation:
            "Dynamic environments (k8s, autoscaling) make IPs ephemeral. Service registry holds 'who am I, where can I be reached'. Clients look up by logical name. Kubernetes uses DNS + Endpoints for this.",
        },
        {
          id: "sd-12",
          title: "Saga pattern",
          code: "// Long-running distributed transaction split into local txns,\n// each with a compensating action on failure",
          options: [
            "Two-phase commit (identical)",
            "Saga — sequence of local transactions; on failure run COMPENSATING actions (eventual consistency)",
            "Distributed lock",
            "Outbox",
          ],
          answer: 1,
          explanation:
            "Cross-service ACID is impractical. Saga breaks a business transaction into local steps with compensations (cancel-payment, restock-inventory, ...). Two flavours: choreography (event-driven) and orchestration (central coordinator).",
        },
        {
          id: "sd-13",
          title: "Outbox pattern",
          code: "// Save business state AND outgoing event in the SAME DB tx,\n// then a separate poller publishes the event to Kafka",
          options: [
            "Pointless overhead",
            "Avoids dual-write inconsistency between DB and message broker; atomic via single DB tx",
            "Only for high-throughput systems",
            "Same as 2PC",
          ],
          answer: 1,
          explanation:
            "Without outbox: write DB then publish event — broker write can fail → state diverges. With outbox: DB write of both is atomic; a relay process publishes the event reliably. CDC (Debezium) streams the outbox table.",
        },
        {
          id: "sd-14",
          title: "Sharding",
          code: "// Partition data across nodes by a shard key (user_id % N)",
          options: [
            "Replication (identical)",
            "Sharding — horizontal partition: each shard holds a SUBSET. Scales writes/storage; reshard pain",
            "Sharding stores all data on every node",
            "Sharding is read-only",
          ],
          answer: 1,
          explanation:
            "Sharding splits data across nodes to scale write throughput and storage. Trade-off: cross-shard queries are expensive; choosing a key that avoids hot spots is hard; resharding is operationally painful.",
        },
        {
          id: "sd-15",
          title: "Consistent hashing",
          code: "// Map keys to nodes on a ring; adding a node moves only K/N keys",
          options: [
            "Same as modulo hashing",
            "Consistent hashing minimises key movement when the cluster size changes — used in distributed caches, DHTs",
            "Always uses MD5",
            "Only for partitioning",
          ],
          answer: 1,
          explanation:
            "Plain hash(key) % N reshuffles ~ALL keys when N changes. Consistent hashing places nodes and keys on a ring; adding a node moves only ~K/N keys. Used by Memcached clients, Dynamo, Cassandra.",
        },
        {
          id: "sd-16",
          title: "Idempotency key",
          code: "POST /payments  X-Idempotency-Key: 4f9a-... \n// Server stores key → result and replays the same response on retry",
          options: [
            "Authentication mechanism",
            "Avoids duplicate side-effects on retry: server caches the result for the same key",
            "Same as request ID",
            "Used for caching only",
          ],
          answer: 1,
          explanation:
            "Networks retry. Without idempotency, a retried POST can charge twice. The client sends a UUID; the server stores 'key → committed response' and replays it for subsequent attempts. Stripe, AWS APIs use this.",
        },
        {
          id: "sd-17",
          title: "Rate limiting algorithms",
          code: "// Token bucket, leaky bucket, fixed window, sliding window",
          options: [
            "All identical",
            "Different trade-offs: token bucket allows bursts; sliding window smooths; fixed window is simplest but has edge spikes",
            "Only one algorithm exists",
            "Sliding window is least accurate",
          ],
          answer: 1,
          explanation:
            "Token bucket: tokens refill at rate R, capacity B → tolerates bursts up to B. Fixed window: count per window, simple but can spike at window edges. Sliding window: more accurate but more state.",
        },
        {
          id: "sd-18",
          title: "Bulkhead pattern",
          code: "// Isolate resources (thread pools, connection pools) per dependency\n// so failure in one doesn't drown the whole app",
          options: [
            "Caching pattern",
            "Bulkhead — partition resources so one failing dependency cannot exhaust ALL threads/connections",
            "Same as circuit breaker",
            "Connection pool only",
          ],
          answer: 1,
          explanation:
            "Named after ship bulkheads. If service B is slow and you share one thread pool, threads pile up waiting on B and starve everything else. Separate pools per downstream isolate failures.",
        },
        {
          id: "sd-19",
          title: "Cache strategies",
          code: "// Cache-aside: app reads cache, on miss loads DB and populates cache\n// Read-through: cache loads from DB on miss internally\n// Write-through: write to cache + DB synchronously\n// Write-behind: write to cache; DB flushed async",
          options: [
            "All identical",
            "Each strategy has different consistency / latency / failure trade-offs",
            "Cache-aside is always best",
            "Write-behind is safest",
          ],
          answer: 1,
          explanation:
            "Cache-aside = simplest, app controls. Read-through = encapsulated. Write-through = consistent but slow writes. Write-behind = fast writes but durability risk. Pick by consistency need.",
        },
        {
          id: "sd-20",
          title: "WAL (Write-Ahead Log)",
          code: "// Append to a log BEFORE updating data pages\n// Enables crash recovery and replication",
          options: [
            "Just for auditing",
            "Foundation for durability and replication: changes appended to log first, then applied; replay on crash",
            "Replaces backups",
            "Slows writes only",
          ],
          answer: 1,
          explanation:
            "WAL is the bedrock of durable storage. Postgres WAL, MySQL redo log, Kafka commit log, etcd RAFT log — all guarantee: a committed change has been fsynced to the log even if pages aren't flushed yet.",
        },
      ],
    },

    {
      id: "math",
      title: "Math & Numeric Edge Cases",
      icon: "🔢",
      color: "#ef4444",
      blurb:
        "Integer overflow, NaN, infinity, autoboxing identity, /0, BigDecimal.",
      questions: [
        {
          id: "math-1",
          title: "Integer division by zero",
          code: "int x = 10 / 0;",
          options: [
            "Compile error",
            "Returns 0",
            "Returns Integer.MAX_VALUE",
            "Throws ArithmeticException at runtime",
          ],
          answer: 3,
          explanation:
            "Integer (byte/short/int/long) division by zero throws ArithmeticException: '/ by zero' at runtime. The compiler allows it because the divisor could be a variable.",
        },
        {
          id: "math-2",
          title: "Floating-point division by zero",
          code: "System.out.println(10.0 / 0.0);\nSystem.out.println(-10.0 / 0.0);\nSystem.out.println(0.0 / 0.0);",
          options: [
            "All throw ArithmeticException",
            "Infinity, -Infinity, NaN",
            "0.0, 0.0, 0.0",
            "Infinity, Infinity, 0.0",
          ],
          answer: 1,
          explanation:
            "IEEE 754 floats have +Infinity, -Infinity, and NaN. Positive/0.0 → +Infinity. Negative/0.0 → -Infinity. 0.0/0.0 is indeterminate → NaN. Doubles NEVER throw on / 0.",
        },
        {
          id: "math-3",
          title: "NaN comparison",
          code: "double n = 0.0 / 0.0;\nSystem.out.println(n == n);\nSystem.out.println(Double.isNaN(n));",
          options: ["true, true", "true, false", "false, true", "false, false"],
          answer: 2,
          explanation:
            "NaN is the only value where x == x is FALSE (by IEEE 754). Use Double.isNaN(x) or Double.compare. This is why sorted collections of doubles can behave oddly if NaN is present.",
        },
        {
          id: "math-4",
          title: "Integer overflow",
          code: "int x = Integer.MAX_VALUE + 1;\nSystem.out.println(x);",
          options: [
            "Throws ArithmeticException",
            "Integer.MAX_VALUE (saturates)",
            "Integer.MIN_VALUE (wraps)",
            "0",
          ],
          answer: 2,
          explanation:
            "Integer arithmetic in Java SILENTLY wraps two's-complement. MAX_VALUE + 1 = MIN_VALUE (negative). Use Math.addExact / subtractExact / multiplyExact to throw on overflow, or use long/BigInteger.",
        },
        {
          id: "math-5",
          title: "Float precision",
          code: "System.out.println(0.1 + 0.2 == 0.3);\nSystem.out.println(0.1 + 0.2);",
          options: [
            "true, 0.3",
            "false, 0.30000000000000004",
            "true, 0.30000000000000004",
            "false, 0.3",
          ],
          answer: 1,
          explanation:
            "0.1 and 0.2 are not exactly representable in binary float. Their sum is slightly above 0.3 → comparison fails. Use BigDecimal for exact decimal math (money!), or compare with epsilon: Math.abs(a-b) < 1e-9.",
        },
        {
          id: "math-6",
          title: "BigDecimal vs new BigDecimal(double)",
          code: 'BigDecimal a = new BigDecimal(0.1);\nBigDecimal b = new BigDecimal("0.1");\nSystem.out.println(a);\nSystem.out.println(b);',
          options: [
            "0.1, 0.1",
            "0.1000... (long binary expansion), 0.1",
            "0.1, 0.1000... (long binary expansion)",
            "Both throw",
          ],
          answer: 1,
          explanation:
            "new BigDecimal(double) captures the IEEE 754 binary value EXACTLY → e.g. 0.1000000000000000055511151231257827021181583404541015625. Always use the String constructor or BigDecimal.valueOf(double) for clean values.",
        },
        {
          id: "math-7",
          title: "Integer cache (autoboxing identity)",
          code: "Integer a = 127, b = 127;\nInteger c = 128, d = 128;\nSystem.out.println(a == b);\nSystem.out.println(c == d);",
          options: ["true, true", "true, false", "false, false", "false, true"],
          answer: 1,
          explanation:
            "Integer.valueOf caches boxed values in range -128..127. So a==b (same cached object) → true. 128 is outside the cache → new objects → c==d false. NEVER compare boxed numerics with == in production code; use .equals().",
        },
        {
          id: "math-8",
          title: "Math.abs(Integer.MIN_VALUE)",
          code: "System.out.println(Math.abs(Integer.MIN_VALUE));",
          options: [
            "Integer.MAX_VALUE",
            "Integer.MIN_VALUE (-2147483648)",
            "0",
            "Throws",
          ],
          answer: 1,
          explanation:
            "|MIN_VALUE| = 2147483648, which doesn't fit in int (MAX = 2147483647). Math.abs silently returns MIN_VALUE unchanged. Use Math.absExact (Java 15+) to throw, or work in long.",
        },
        {
          id: "math-9",
          title: "Modulus with negative numbers",
          code: "System.out.println(-7 % 3);\nSystem.out.println(Math.floorMod(-7, 3));",
          options: ["-1, 2", "2, 2", "-1, -1", "1, 2"],
          answer: 0,
          explanation:
            "Java's % takes the sign of the DIVIDEND: -7 % 3 = -1 (truncated division). Math.floorMod returns a result with the divisor's sign → 2. Use floorMod for cyclic indexing (e.g. circular buffers).",
        },
        {
          id: "math-10",
          title: "int overflow in expressions",
          code: "long ms = 24 * 60 * 60 * 1000 * 365;",
          options: [
            "31_536_000_000",
            "Compile error",
            "Overflows silently — wrong value stored in long",
            "Throws",
          ],
          answer: 2,
          explanation:
            "Right-hand side is computed in INT first (all operands are int literals). 365 days in ms exceeds Integer.MAX_VALUE → wraps. Then the wrong int is widened to long. Fix: 24L * 60 * 60 * 1000 * 365 — force long arithmetic with one long operand.",
        },
        {
          id: "math-11",
          title: "byte overflow",
          code: "byte b = 127;\nb++;\nSystem.out.println(b);",
          options: ["128", "-128", "Compile error", "Throws"],
          answer: 1,
          explanation:
            "byte is signed 8-bit (-128..127). 127 + 1 wraps to -128 (two's complement). Compound assignment (++/+=) does an implicit narrowing cast back to byte, so this compiles.",
        },
        {
          id: "math-12",
          title: "byte + byte → ?",
          code: "byte a = 1, b = 2;\nbyte c = a + b;",
          options: [
            "Works",
            "Compile error — a+b promoted to int, narrowing to byte requires cast",
            "Runtime error",
            "Implicit truncation",
          ],
          answer: 1,
          explanation:
            "Binary numeric promotion widens both operands to at least int. The result is int; assignment to byte needs a cast. (byte)(a+b) compiles. Exception: 'final byte a=1, b=2; byte c = a+b;' compiles because the result is a compile-time constant.",
        },
        {
          id: "math-13",
          title: "Long literal without suffix",
          code: "long big = 3000000000;",
          options: [
            "Works fine",
            "Compile error — 3_000_000_000 is too big for int; need L suffix",
            "Silently overflows",
            "Works since Java 7",
          ],
          answer: 1,
          explanation:
            "Integer literals default to int. 3 billion exceeds Integer.MAX_VALUE → compile error 'integer number too large'. Add the L suffix: 3000000000L.",
        },
        {
          id: "math-14",
          title: "Integer.parseInt overflow",
          code: 'Integer.parseInt("3000000000");',
          options: [
            "Returns 3 billion",
            "Returns Integer.MAX_VALUE",
            "NumberFormatException at runtime",
            "Returns 0",
          ],
          answer: 2,
          explanation:
            "parseInt validates that the value fits in int. Anything above MAX_VALUE → NumberFormatException. Use Long.parseLong or BigInteger for larger ranges.",
        },
        {
          id: "math-15",
          title: "Math.round behaviour",
          code: "System.out.println(Math.round(-0.5));\nSystem.out.println(Math.round(0.5));\nSystem.out.println(Math.round(-1.5));",
          options: ["0, 1, -1", "-1, 1, -2", "0, 0, -2", "-1, 0, -1"],
          answer: 0,
          explanation:
            "Math.round = floor(x + 0.5). So -0.5 → 0, 0.5 → 1, -1.5 → -1. NOT classic banker's rounding; not symmetric around 0. For halfway negatives, you may want Math.floor or BigDecimal.HALF_EVEN.",
        },
        {
          id: "math-16",
          title: "float vs double precision",
          code: "float f = 0.1f + 0.2f;\ndouble d = 0.1 + 0.2;\nSystem.out.println(f);\nSystem.out.println(d);",
          options: [
            "Both 0.3",
            "0.3 (or close), 0.30000000000000004 — both imprecise; float shows fewer digits",
            "Both NaN",
            "0.30000000000000004, 0.30000000000000004",
          ],
          answer: 1,
          explanation:
            "float has ~7 significant decimal digits; double has ~15. Both are binary IEEE-754; both are imprecise for decimals — float just hides it with fewer digits printed.",
        },
        {
          id: "math-17",
          title: "Math.pow returns?",
          code: "long n = Math.pow(2, 10);",
          options: [
            "1024",
            "Compile error — Math.pow returns double",
            "Runtime exception",
            "Truncates to 0",
          ],
          answer: 1,
          explanation:
            "Math.pow(double, double) returns double. Assigning to long needs a cast: (long) Math.pow(2,10). Beware: pow uses floating-point — exact integer powers can have precision quirks at scale; for small integer powers, manual multiplication is safer.",
        },
        {
          id: "math-18",
          title: "Bitwise vs logical AND",
          code: "boolean a = false, b = true;\nSystem.out.println(a & expensive(b));\nSystem.out.println(a && expensive(b));",
          options: [
            "Both short-circuit",
            "& evaluates BOTH sides; && short-circuits (skips RHS if LHS is false)",
            "Both evaluate fully",
            "Both short-circuit on true",
          ],
          answer: 1,
          explanation:
            "& and | are bitwise (or non-short-circuit boolean). && and || short-circuit. Side-effecting RHS expressions behave differently — pick by intent.",
        },
        {
          id: "math-19",
          title: "Unsigned right shift",
          code: "System.out.println(-1 >> 1);\nSystem.out.println(-1 >>> 1);",
          options: [
            "Both -1",
            "-1 (arithmetic, sign-extended), 2147483647 (logical, zero-filled)",
            "0, 0",
            "Throws",
          ],
          answer: 1,
          explanation:
            ">> arithmetic shift preserves sign — -1 stays -1. >>> logical shift fills with zeros → -1 becomes Integer.MAX_VALUE. Use >>> when treating ints as unsigned.",
        },
        {
          id: "math-20",
          title: "Integer.bitCount",
          code: "System.out.println(Integer.bitCount(7));\nSystem.out.println(Integer.bitCount(-1));",
          options: ["3, 1", "3, 32", "1, 1", "Throws on -1"],
          answer: 1,
          explanation:
            "bitCount counts set bits (Hamming weight). 7 = 0b111 → 3. -1 in two's complement = all bits set → 32 for int.",
        },
        {
          id: "math-21",
          title: "Random.nextInt(bound)",
          code: "new Random().nextInt(10);",
          options: [
            "Returns 0..10 inclusive",
            "Returns 0..9 (bound is EXCLUSIVE)",
            "Returns 1..10",
            "Throws",
          ],
          answer: 1,
          explanation:
            "nextInt(n) returns a value in [0, n). The bound is exclusive. For [a, b], use ThreadLocalRandom.current().nextInt(a, b+1) or a + random.nextInt(b - a + 1).",
        },
        {
          id: "math-22",
          title: "BigDecimal equals vs compareTo",
          code: 'BigDecimal a = new BigDecimal("1.0");\nBigDecimal b = new BigDecimal("1.00");\nSystem.out.println(a.equals(b));\nSystem.out.println(a.compareTo(b) == 0);',
          options: ["true, true", "false, true", "true, false", "false, false"],
          answer: 1,
          explanation:
            "BigDecimal.equals compares VALUE + SCALE — 1.0 ≠ 1.00 (different scales). compareTo compares just numeric value → 0 (equal). For monetary comparisons, use compareTo or normalise with stripTrailingZeros.",
        },
        {
          id: "math-23",
          title: "Integer division truncation",
          code: "System.out.println(7 / 2);\nSystem.out.println(-7 / 2);",
          options: [
            "3, -3 (truncate toward zero)",
            "3, -4 (floor)",
            "4, -3",
            "3.5, -3.5",
          ],
          answer: 0,
          explanation:
            "Integer division truncates TOWARD ZERO (not floor). 7/2 = 3, -7/2 = -3. Use Math.floorDiv for math-style floor division: floorDiv(-7, 2) = -4.",
        },
        {
          id: "math-24",
          title: "Casting double to int",
          code: "System.out.println((int) 3.99);\nSystem.out.println((int) -3.99);\nSystem.out.println((int) Double.NaN);",
          options: [
            "4, -4, NaN",
            "3, -3, 0 (NaN cast is 0)",
            "3, -4, throws",
            "4, -3, MAX_VALUE",
          ],
          answer: 1,
          explanation:
            "(int) double TRUNCATES toward zero. Casting NaN to int returns 0 by JLS. Casting +/-Infinity returns Integer.MAX_VALUE / MIN_VALUE.",
        },
        {
          id: "math-25",
          title: "Comparing floats safely",
          code: "boolean almostEqual(double a, double b) {\n  return Math.abs(a - b) < 1e-9;\n}",
          options: [
            "Just use ==",
            "Use an epsilon (relative or absolute) — direct == is unsafe due to representation",
            "Always cast to int",
            "Use Double.compare which is exact",
          ],
          answer: 1,
          explanation:
            "Use an epsilon (absolute for small values, relative for large), or stick to BigDecimal for exact decimal math. Double.compare gives consistent ordering (handles NaN/-0.0) but doesn't fix imprecision.",
        },
      ],
    },

    {
      id: "exceptions",
      title: "Exceptions & Control Flow",
      icon: "⚠️",
      color: "#ff6b35",
      blurb:
        "Checked vs unchecked, try-with-resources, finally vs return, suppressed exceptions.",
      questions: [
        {
          id: "exc-1",
          title: "finally vs return",
          code: "static int m() {\n  try { return 1; }\n  finally { return 2; }\n}",
          options: ["1", "2", "Compile error", "0"],
          answer: 1,
          explanation:
            "finally ALWAYS runs and a return in finally OVERRIDES the try return. m() returns 2. Worse: return in finally also swallows exceptions from try. Treat 'return in finally' as a code smell.",
        },
        {
          id: "exc-2",
          title: "Checked vs unchecked",
          code: "// IOException, SQLException, ClassNotFoundException — checked\n// NullPointerException, IllegalArgumentException — unchecked\n// Error, OutOfMemoryError — Error",
          options: [
            "All exceptions are checked",
            "Checked = must declare or catch; Unchecked = subclasses of RuntimeException; Errors = serious JVM problems",
            "All exceptions are unchecked",
            "Errors must be caught",
          ],
          answer: 1,
          explanation:
            "Throwable → Error (don't catch) and Exception. Exception → RuntimeException (unchecked) and others (checked, must declare or catch). Lambdas can't throw checked exceptions cleanly — common API friction.",
        },
        {
          id: "exc-3",
          title: "try-with-resources order",
          code: "try (A a = new A(); B b = new B()) { ... }",
          options: [
            "Closed in order A, B",
            "Closed in REVERSE order: B then A",
            "Closed in arbitrary order",
            "Only the first is closed",
          ],
          answer: 1,
          explanation:
            "Resources are closed in REVERSE order of declaration (B first, then A) — mirrors stack semantics. Each close() is called even if an earlier close() throws (subsequent exceptions become 'suppressed').",
        },
        {
          id: "exc-4",
          title: "Suppressed exceptions",
          code: 'try (Auto r = new Auto()) {\n  throw new IOException("primary");\n}\n// r.close() also throws IllegalStateException',
          options: [
            "Caller sees only IOException",
            "Caller sees IllegalStateException; IOException is lost",
            "Caller sees IOException; IllegalStateException is attached as suppressed via getSuppressed()",
            "Both rethrown together",
          ],
          answer: 2,
          explanation:
            "Java preserves the primary (try body) exception and attaches the close() exception via Throwable.addSuppressed(). Retrieve via getSuppressed(). Pre-Java 7 you'd lose the original — that's why try-with-resources is preferred over manual try/finally close.",
        },
        {
          id: "exc-5",
          title: "Catching Exception swallows what?",
          code: "try { dangerous(); }\ncatch (Exception e) { /* ignore */ }",
          options: [
            "Only checked exceptions",
            "Both checked AND unchecked (anything below Exception) — including NPE, IAE",
            "Only RuntimeException",
            "Nothing",
          ],
          answer: 1,
          explanation:
            "Exception is the parent of RuntimeException, so catch(Exception) silently swallows ALL non-Error throwables. Catching broadly + ignoring is a top-10 source of unfindable bugs.",
        },
        {
          id: "exc-6",
          title: "Order of catch blocks",
          code: "try { ... }\ncatch (Exception e) { ... }\ncatch (IOException e) { ... }",
          options: [
            "Catches Exception, falls through to IOException",
            "Compile error — IOException unreachable",
            "Catches IOException first, then Exception",
            "Compiles, runs fine",
          ],
          answer: 1,
          explanation:
            "Catch blocks are matched top-down. The first one (Exception) catches everything, so the more specific IOException becomes UNREACHABLE → compile error 'exception has already been caught'. Always order most-specific FIRST.",
        },
        {
          id: "exc-7",
          title: "Exception in static initializer",
          code: 'class X {\n  static { throw new RuntimeException("boom"); }\n}\n// First use of X.class',
          options: [
            "Class is loaded; runtime exception caller sees",
            "ExceptionInInitializerError on first class load — class becomes unusable",
            "Compile error",
            "Silently swallowed",
          ],
          answer: 1,
          explanation:
            "Any exception in a static initializer is wrapped as ExceptionInInitializerError. The class enters an ERRONEOUS state — every subsequent access throws NoClassDefFoundError. Avoid heavy/throwing work in static blocks.",
        },
        {
          id: "exc-8",
          title: "Multi-catch with common supertype",
          code: "try { ... }\ncatch (IOException | SQLException e) { e.someMethod(); }",
          options: [
            "Can only call methods from the lowest common supertype",
            "Can call any method from either type",
            "Compile error — multi-catch invalid",
            "Java 21 only",
          ],
          answer: 0,
          explanation:
            "Java 7+ multi-catch: e is implicitly the common supertype (here Exception/Throwable). You can only call methods declared on that supertype. Multi-catch also makes e effectively final.",
        },
        {
          id: "exc-9",
          title: "Throwable hierarchy",
          code: "// Throwable\n//   ├── Error          (don't catch)\n//   └── Exception\n//        ├── RuntimeException  (unchecked)\n//        └── (other)           (checked)",
          options: [
            "Error is recoverable",
            "Error = serious JVM problem (don't catch); Exception → checked (must declare/catch) and RuntimeException (unchecked)",
            "All extend Exception",
            "RuntimeException is checked",
          ],
          answer: 1,
          explanation:
            "Errors (OutOfMemoryError, StackOverflowError) signal JVM/system problems — code generally can't recover. Exceptions are the recoverable family. Don't catch Throwable broadly.",
        },
        {
          id: "exc-10",
          title: "Catching OutOfMemoryError",
          code: "try { while(true) list.add(new int[1_000_000]); }\ncatch (OutOfMemoryError e) { ... }",
          options: [
            "Compile error — Errors uncatchable",
            "Compiles and catches, but the JVM may be in an unstable state — risky",
            "Always safe",
            "Throws",
          ],
          answer: 1,
          explanation:
            "Errors ARE catchable syntactically. OOME may leave the JVM unable to allocate even the StackTrace. Generally avoid catching — recover by failing fast/restarting. Only handle in last-resort wrappers (e.g., server frameworks).",
        },
        {
          id: "exc-11",
          title: "Checked exception in lambda",
          code: 'List<URL> urls = List.of("http://x").stream()\n    .map(s -> new URL(s))  // MalformedURLException is checked\n    .collect(Collectors.toList());',
          options: [
            "Compiles fine",
            "Compile error — Function.apply doesn't declare checked exceptions; wrap or use a checked-lambda helper",
            "Runtime error",
            "Allowed since Java 11",
          ],
          answer: 1,
          explanation:
            "Standard functional interfaces (Function, Consumer, ...) don't declare checked exceptions. You must catch inside the lambda or use a 'sneaky throw' / custom checked-functional-interface helper.",
        },
        {
          id: "exc-12",
          title: "Helpful NullPointerException (Java 14+)",
          code: '// Pre-14: NullPointerException at MyClass.java:42\n// Java 14+: Cannot invoke "User.getName()" because "user" is null',
          options: [
            "No change",
            "JEP 358: NPE message points to which expression was null",
            "Removed in Java 21",
            "Only when -ea is set",
          ],
          answer: 1,
          explanation:
            "Java 14+ Helpful NPE (on by default in 15+) names the variable/expression that was null. Massive debugging win for chained access like a.b.c.d. Enabled with -XX:+ShowCodeDetailsInExceptionMessages.",
        },
        {
          id: "exc-13",
          title: "assert keyword",
          code: 'assert x > 0 : "x must be positive";',
          options: [
            "Always runs",
            "Runs only when assertions are enabled (-ea); silently skipped otherwise",
            "Compile error",
            "Replaces if-check at runtime",
          ],
          answer: 1,
          explanation:
            "Assertions are off by default. Enable with -ea (java -ea ...). Use for invariants and 'should never happen' checks in development/tests. Don't use assert for input validation in production code — use proper exceptions.",
        },
        {
          id: "exc-14",
          title: "Custom unchecked exception",
          code: 'class UserNotFoundException extends RuntimeException {\n  public UserNotFoundException(long id) { super("User " + id + " not found"); }\n}',
          options: [
            "Anti-pattern",
            "Idiomatic: extend RuntimeException for unchecked errors; provide a useful message and chain causes via super(msg, cause)",
            "Must extend Exception",
            "Must extend Error",
          ],
          answer: 1,
          explanation:
            "Extend RuntimeException for typical business errors (don't force callers to declare). Extend Exception when callers MUST handle the failure as part of their contract. Always chain causes for debugging.",
        },
        {
          id: "exc-15",
          title: "Exception chaining",
          code: 'try { lowLevel(); }\ncatch (SQLException e) { throw new ServiceException("failed", e); }',
          options: [
            "Loses the original",
            "Chains the cause via super(msg, cause); preserves original stack via getCause()",
            "Allowed since Java 17",
            "Causes are ignored",
          ],
          answer: 1,
          explanation:
            "Pass the original as the second constructor arg — printed in the stack trace under 'Caused by:'. Never log-and-rethrow OR swallow without chaining.",
        },
        {
          id: "exc-16",
          title: "Rethrow with more precise type (Java 7+)",
          code: "void m() throws IOException {\n  try { ... }\n  catch (Exception e) { throw e; }\n}",
          options: [
            "Must declare 'throws Exception'",
            "Java 7+: compiler infers actual throwable types thrown in the try block — only those must be declared",
            "Compile error",
            "Always Exception",
          ],
          answer: 1,
          explanation:
            "Improved type inference for rethrow (Java 7). If only IOException is thrown in the try, 'throw e' is treated as throwing IOException. Lets you catch broadly and still declare narrowly.",
        },
        {
          id: "exc-17",
          title: "Optional.orElseThrow",
          code: "User u = repo.findById(id).orElseThrow(() -> new UserNotFoundException(id));",
          options: [
            "Always returns null on empty",
            "Idiomatic: convert Optional.empty to a domain exception via a Supplier",
            "Throws NoSuchElementException",
            "Optional doesn't have orElseThrow",
          ],
          answer: 1,
          explanation:
            "orElseThrow(supplier) gets the value or throws what the supplier provides. orElseThrow() with no-arg (Java 10+) throws NoSuchElementException. Cleaner than 'if (opt.isEmpty()) throw...'.",
        },
        {
          id: "exc-18",
          title: "finally vs Runtime.halt",
          code: 'try { Runtime.getRuntime().halt(0); }\nfinally { System.out.println("cleanup"); }',
          options: [
            "Cleanup runs",
            "Runtime.halt terminates JVM IMMEDIATELY without running finally or shutdown hooks",
            "Throws first",
            "Same as System.exit",
          ],
          answer: 1,
          explanation:
            "Runtime.halt() forcibly exits. Unlike System.exit (which runs shutdown hooks), halt skips EVERYTHING — finally blocks, shutdown hooks. Use only for emergency abort.",
        },
        {
          id: "exc-19",
          title: "Exception in catch block",
          code: "try { throwA(); }\ncatch (Exception e) { throwB(); }\nfinally { ... }",
          options: [
            "Caller sees A",
            "Caller sees B; A is lost (unless chained)",
            "Both thrown",
            "Neither thrown",
          ],
          answer: 1,
          explanation:
            "When the catch block itself throws, the original is REPLACED unless you chain it (throw new ServiceException(msg, e)). finally still runs, and if finally throws, ITS exception further replaces the catch's.",
        },
        {
          id: "exc-20",
          title: "Spring vs Java exception philosophy",
          code: "// Spring: most exceptions are unchecked (DataAccessException tree)\n// JDBC SQLException is checked → Spring translates to unchecked",
          options: [
            "Identical",
            "Spring favours unchecked exceptions — avoids forcing 'throws' on every layer; translates checked DB exceptions",
            "Spring wraps everything in Error",
            "Spring uses checked for all",
          ],
          answer: 1,
          explanation:
            "Modern Java consensus (Spring, Hibernate) leans on unchecked exceptions: less ceremony, less leaky exception specs in the API. Spring's @Repository plus its translation layer convert SQLException/HibernateException → unchecked DataAccessException hierarchy.",
        },
      ],
    },

    {
      id: "concurrency",
      title: "Concurrency Basics",
      icon: "⚡",
      color: "#14b8a6",
      blurb:
        "synchronized, volatile, race conditions, atomic ops, thread visibility.",
      questions: [
        {
          id: "con-1",
          title: "++ on shared int",
          code: "// Thread A and B each run count++ 1,000,000 times\nint count = 0;",
          options: [
            "Result is always 2,000,000",
            "Result is between 1 and 2,000,000 — race",
            "Throws",
            "Compile error",
          ],
          answer: 1,
          explanation:
            "++ is read-modify-write — 3 steps, not atomic. Threads interleave reads and lose updates. Final count is anywhere from ~1,000,000 to 2,000,000. Fix: AtomicInteger, synchronized, or LongAdder for high contention.",
        },
        {
          id: "con-2",
          title: "volatile guarantees",
          code: "volatile int flag = 0;",
          options: [
            "Makes ++ atomic",
            "Guarantees visibility + ordering across threads, but NOT atomic compound operations",
            "Same as synchronized",
            "Slows code dramatically",
          ],
          answer: 1,
          explanation:
            "volatile = (1) writes are visible to other threads immediately; (2) prevents reordering across the volatile access. Does NOT make ++ atomic. For atomic counters, use Atomic* classes.",
        },
        {
          id: "con-3",
          title: "synchronized on different objects",
          code: "Object a = new Object();\nObject b = new Object();\nsynchronized(a) { synchronized(b) { ... } }\n// Other thread: synchronized(b) { synchronized(a) { ... } }",
          options: [
            "Always safe",
            "Risk of deadlock — locks acquired in different orders",
            "Threads share state automatically",
            "Compile error",
          ],
          answer: 1,
          explanation:
            "Classic two-lock deadlock. Always acquire locks in a CONSISTENT GLOBAL ORDER (e.g., by hashCode or by some ranking) to avoid this. Or use tryLock with timeout.",
        },
        {
          id: "con-4",
          title: "Thread.sleep vs wait",
          code: "// Thread.sleep(100)\n// obj.wait(100)",
          options: [
            "Identical",
            "sleep doesn't release locks; wait MUST hold the monitor and RELEASES it during the wait",
            "wait is faster",
            "sleep releases all locks",
          ],
          answer: 1,
          explanation:
            "Thread.sleep just pauses the thread, holding any locks. obj.wait() must be called inside synchronized(obj), and ATOMICALLY releases the monitor + parks the thread until notify/notifyAll. Crucial difference.",
        },
        {
          id: "con-5",
          title: "ExecutorService.submit returns",
          code: "Future<String> f = exec.submit(() -> doWork());\nf.get();",
          options: [
            "void — fire and forget",
            "Future — get() blocks until done; rethrows exceptions wrapped in ExecutionException",
            "Returns null",
            "Returns the worker thread",
          ],
          answer: 1,
          explanation:
            "submit returns a Future. get() blocks the calling thread until the task completes. If the task threw, get() throws ExecutionException whose cause is the original exception. Forgetting to call get() means exceptions vanish silently!",
        },
        {
          id: "con-6",
          title: "ConcurrentHashMap.size() consistency",
          code: "// While other threads insert/remove,\n// you call map.size()",
          options: [
            "Locks the whole map — slow",
            "Approximate value — may not reflect concurrent updates",
            "Throws ConcurrentModificationException",
            "Always exact and atomic",
          ],
          answer: 1,
          explanation:
            "ConcurrentHashMap.size() (and entrySet iteration) are WEAKLY CONSISTENT — they don't lock the entire map; they reflect SOME state during the call. Don't rely on size() for correctness under concurrent updates.",
        },
        {
          id: "con-7",
          title: "double-checked locking — why volatile?",
          code: "private static volatile Singleton instance;\npublic static Singleton get() {\n  if (instance == null) {\n    synchronized(Singleton.class) {\n      if (instance == null) instance = new Singleton();\n    }\n  }\n  return instance;\n}",
          options: [
            "Volatile makes it faster",
            "Without volatile, another thread can see a half-constructed object due to reordering",
            "Volatile is decorative — works without it",
            "Volatile prevents nulls",
          ],
          answer: 1,
          explanation:
            "Constructor execution and reference assignment can be reordered by the JIT. Without volatile, another thread can see the non-null reference BEFORE the constructor finished → uses a half-initialised object. volatile establishes a happens-before edge that prevents this.",
        },
        {
          id: "con-8",
          title: "Virtual threads — Project Loom",
          code: "Thread.startVirtualThread(() -> doIO());",
          options: [
            "Same as platform threads",
            "Lightweight threads scheduled by JVM, M:N mapped to platform threads; cheap for blocking I/O",
            "Reactive only — no blocking allowed",
            "Removed in Java 21",
          ],
          answer: 1,
          explanation:
            "Virtual threads (Java 21+) are scheduled by the JVM on a small pool of platform carrier threads. You can spawn millions. When code blocks on I/O, the virtual thread unmounts and the carrier serves another. Same blocking-style code, fiber-style scalability.",
        },
        {
          id: "con-9",
          title: "ReentrantLock vs synchronized",
          code: "Lock l = new ReentrantLock();\nl.lock();\ntry { ... } finally { l.unlock(); }",
          options: [
            "Identical",
            "ReentrantLock adds: tryLock(timeout), interruptible lock, fairness, Condition objects — but you MUST unlock in finally",
            "ReentrantLock is faster always",
            "synchronized supports fairness",
          ],
          answer: 1,
          explanation:
            "ReentrantLock = explicit lock with extra capabilities. synchronized = implicit, simpler, JIT-optimized. Use synchronized by default; switch to Lock when you need tryLock/timeout/fairness/interruptible/Conditions.",
        },
        {
          id: "con-10",
          title: "ReadWriteLock",
          code: "ReadWriteLock rw = new ReentrantReadWriteLock();\nrw.readLock().lock();   // many readers\nrw.writeLock().lock();  // one writer, exclusive",
          options: [
            "Same as ReentrantLock",
            "Many concurrent readers OR one exclusive writer; useful when reads vastly outnumber writes",
            "No writer needed",
            "Always faster than synchronized",
          ],
          answer: 1,
          explanation:
            "Multiple readers can hold the read lock concurrently. Writers are exclusive — they wait for readers to release, then block new readers. StampedLock (Java 8+) adds optimistic reads for even better throughput.",
        },
        {
          id: "con-11",
          title: "Semaphore",
          code: "Semaphore permits = new Semaphore(3);\npermits.acquire(); // blocks if no permits\n// ... critical section ...\npermits.release();",
          options: [
            "Same as Lock",
            "Counts N permits — allows up to N threads concurrently; for bounded resource pools, rate limiting",
            "Only binary (0/1)",
            "Always fair",
          ],
          answer: 1,
          explanation:
            "Semaphore controls access to a bounded resource. N=1 ≈ a non-reentrant mutex. Use for: connection limits, rate limiting, bounded concurrent calls.",
        },
        {
          id: "con-12",
          title: "CountDownLatch",
          code: "CountDownLatch start = new CountDownLatch(1);\nworkers.forEach(w -> exec.submit(() -> { start.await(); w.run(); }));\nstart.countDown(); // release all",
          options: [
            "Reusable",
            "ONE-SHOT countdown gate: threads await(), then countDown() releases them all; cannot be reset",
            "Same as CyclicBarrier",
            "Counts up",
          ],
          answer: 1,
          explanation:
            "CountDownLatch is single-use. Initialise to N; await() blocks until count reaches 0; countDown() decrements. For repeatable barriers, use CyclicBarrier instead.",
        },
        {
          id: "con-13",
          title: "CyclicBarrier",
          code: "CyclicBarrier b = new CyclicBarrier(4, () -> mergeResults());\n// 4 threads call b.await(); 4th triggers the merge",
          options: [
            "Same as CountDownLatch",
            "Reusable barrier — N threads wait at the barrier, all released together; optional barrier action",
            "Async future",
            "Rate limiter",
          ],
          answer: 1,
          explanation:
            "Cyclic — can be reused for the next round once the previous round's threads have crossed. Optional Runnable runs ONCE per cycle when the barrier trips. Good for staged parallel algorithms.",
        },
        {
          id: "con-14",
          title: "CompletableFuture chaining",
          code: "CompletableFuture.supplyAsync(this::fetch)\n  .thenApply(this::parse)\n  .thenAccept(this::store);",
          options: [
            "Blocks each step",
            "Non-blocking pipeline; each stage runs when the previous completes",
            "Sequential, blocking",
            "Only on one thread",
          ],
          answer: 1,
          explanation:
            "supplyAsync runs on the common ForkJoinPool. thenApply transforms; thenAccept consumes; thenCompose flattens (like flatMap). Always handle exceptions with exceptionally/handle — silent failures are easy.",
        },
        {
          id: "con-15",
          title: "CompletableFuture.allOf vs anyOf",
          code: "CompletableFuture.allOf(a, b, c).join();\nCompletableFuture.anyOf(a, b, c).join();",
          options: [
            "Identical",
            "allOf: completes when ALL complete; anyOf: completes when the FIRST completes",
            "anyOf only for failures",
            "Throws",
          ],
          answer: 1,
          explanation:
            "allOf returns CompletableFuture<Void> (you collect results separately). anyOf returns CompletableFuture<Object> with the first result. Useful for fan-out parallel calls (allOf) or first-to-respond (anyOf).",
        },
        {
          id: "con-16",
          title: "ForkJoinPool common pool",
          code: "// parallel streams + CompletableFuture defaults use ForkJoinPool.commonPool()",
          options: [
            "Per-thread pool",
            "Single JVM-wide pool with parallelism = Runtime.availableProcessors() - 1; sharing causes interference",
            "Always one thread",
            "Created per task",
          ],
          answer: 1,
          explanation:
            "Common pool is shared across the JVM. If your parallel stream uses it for CPU work AND another component blocks on I/O in it → starvation. For I/O or long tasks, supply your own Executor.",
        },
        {
          id: "con-17",
          title: "ThreadLocal cleanup",
          code: "static ThreadLocal<User> CURRENT = new ThreadLocal<>();",
          options: [
            "Cleans up automatically",
            "Holds value per-thread; in a thread pool, value LEAKS across requests unless you remove() it",
            "Same as static field",
            "Only usable with virtual threads",
          ],
          answer: 1,
          explanation:
            "ThreadLocal entry sticks to the thread. With a pool, the next task on that thread inherits stale data → security/privacy bugs and memory leaks. Always remove() at request end (Spring's request scope does this for you).",
        },
        {
          id: "con-18",
          title: "ThreadLocal vs virtual threads",
          code: "// With millions of virtual threads, each ThreadLocal copy can dominate memory",
          options: [
            "No issue",
            "ThreadLocal scales badly with virtual threads; ScopedValue (Java 21+) is the modern alternative",
            "ThreadLocal becomes faster",
            "ScopedValue is identical",
          ],
          answer: 1,
          explanation:
            "Virtual threads encourage millions of threads. ThreadLocal allocates per-thread and may not be cleared → memory blow-up. ScopedValue is immutable and scoped to a callable — no per-thread storage, dynamic-scope semantics.",
        },
        {
          id: "con-19",
          title: "Happens-before relationship",
          code: "// volatile, synchronized, Thread.start, Thread.join — all establish happens-before",
          options: [
            "JVM internal",
            "Defines memory visibility ordering: if A happens-before B, A's effects are visible to B",
            "Just for performance",
            "Only with synchronized",
          ],
          answer: 1,
          explanation:
            "JMM uses happens-before to specify what writes are visible to what reads. volatile write → subsequent volatile read; monitor exit → next monitor enter; thread.start → first action in started thread. Without HB, the JVM may reorder freely.",
        },
        {
          id: "con-20",
          title: "newCachedThreadPool dangers",
          code: "Executors.newCachedThreadPool();",
          options: [
            "Safe default",
            "Unbounded thread creation under load — can exhaust memory and OS thread limits; prefer a bounded pool",
            "Always single-threaded",
            "Same as fixed pool",
          ],
          answer: 1,
          explanation:
            "newCachedThreadPool grows without bound under pressure. Under high concurrency or stuck downstream → thousands of threads, OOM. Use Executors.newFixedThreadPool or construct ThreadPoolExecutor with bounded queue + RejectedExecutionHandler.",
        },
        {
          id: "con-21",
          title: "ScheduledExecutorService",
          code: "exec.scheduleAtFixedRate(task, 0, 5, TimeUnit.SECONDS);",
          options: [
            "Same as scheduleWithFixedDelay",
            "Fixed RATE schedules next start every 5s regardless of task duration; fixed DELAY waits 5s AFTER task ends",
            "Runs once",
            "Cancels other tasks",
          ],
          answer: 1,
          explanation:
            "Fixed rate: ticks at 0, 5, 10, ... — if a task takes longer, subsequent runs queue up. Fixed delay: 5s GAP between end and next start — naturally throttles slow tasks. Choose by whether you want cadence or spacing.",
        },
        {
          id: "con-22",
          title: "Callable vs Runnable",
          code: 'Runnable r = () -> {};\nCallable<String> c = () -> "x";',
          options: [
            "Identical",
            "Runnable: no return, no checked exception; Callable<V>: returns V, can throw checked",
            "Callable can't be submitted",
            "Runnable can throw checked",
          ],
          answer: 1,
          explanation:
            "Runnable.run returns void and throws nothing checked. Callable<V>.call returns V and can throw Exception. ExecutorService.submit returns a Future<V> for Callable; Future<?> for Runnable (value is null).",
        },
        {
          id: "con-23",
          title: "Thread.interrupt and InterruptedException",
          code: "while (!Thread.currentThread().isInterrupted()) { ... }\n// or restore: Thread.currentThread().interrupt();",
          options: [
            "Interrupt instantly stops the thread",
            "Interrupt sets a flag; blocking calls throw InterruptedException which CLEARS the flag — restore it or it gets swallowed",
            "Interrupt is a hard kill",
            "Interrupts are ignored",
          ],
          answer: 1,
          explanation:
            "Interruption is cooperative. Catching InterruptedException clears the interrupted flag. If you can't handle it fully, RESTORE: Thread.currentThread().interrupt(). Never swallow IE silently.",
        },
        {
          id: "con-24",
          title: "LiveLock vs Deadlock",
          code: "// Deadlock: threads frozen waiting on each other\n// LiveLock: threads keep moving but make no progress (constantly reacting to each other)",
          options: [
            "Same thing",
            "Deadlock = no motion; livelock = motion without progress; starvation = thread never gets a chance",
            "Livelock is a deadlock variant",
            "Both are CPU bugs",
          ],
          answer: 1,
          explanation:
            "Deadlock: each waits on the other → all stuck. Livelock: politely yielding to each other → no progress. Starvation: scheduler/lock never picks a thread. Diagnose with thread dumps; fix with lock ordering, fairness, or timeouts.",
        },
        {
          id: "con-25",
          title: "Optimistic vs Pessimistic locking",
          code: "// Optimistic: version check at commit (@Version JPA)\n// Pessimistic: SELECT ... FOR UPDATE — lock rows now",
          options: [
            "Identical",
            "Optimistic = no DB lock, version check at commit; pessimistic = explicit DB lock — pick by contention",
            "Optimistic is always slower",
            "Pessimistic is always safer",
          ],
          answer: 1,
          explanation:
            "Optimistic: cheaper under low contention but throws on conflict (you retry). Pessimistic: avoids retries under high contention but can deadlock and reduces throughput. Default to optimistic; switch to pessimistic for hot rows.",
        },
        {
          id: "con-26",
          title: "AtomicReference compareAndSet",
          code: "AtomicReference<Node> head = new AtomicReference<>();\nhead.compareAndSet(expected, newNode);",
          options: [
            "Same as get + set",
            "Atomic CAS: succeeds only if current == expected; foundational primitive for lock-free algorithms",
            "Locks the entire reference",
            "Always succeeds",
          ],
          answer: 1,
          explanation:
            "compareAndSet uses CPU CAS (e.g. cmpxchg). Returns boolean success. Building block for lock-free queues, stacks, counters. Classic pattern: load → compute → CAS → retry.",
        },
        {
          id: "con-27",
          title: "LongAdder vs AtomicLong",
          code: "LongAdder counter = new LongAdder();\ncounter.increment();\nlong total = counter.sum();",
          options: [
            "AtomicLong always faster",
            "LongAdder shards updates across cells to reduce contention; sum() aggregates — great for hot counters",
            "Identical",
            "LongAdder is single-threaded",
          ],
          answer: 1,
          explanation:
            "AtomicLong has all threads CAS on the same field → cache-line ping-pong. LongAdder shards updates into multiple cells, summed on read. Faster under high write contention; sum is approximate during concurrent updates.",
        },
        {
          id: "con-28",
          title: "Lock fairness",
          code: "Lock l = new ReentrantLock(true); // fair",
          options: [
            "No difference",
            "Fair lock: FIFO order — predictable but slower; non-fair (default) can let an arriving thread barge in",
            "Always faster",
            "Only for read locks",
          ],
          answer: 1,
          explanation:
            "Fair = FIFO ordering (predictable wait times, prevents starvation). Non-fair (default) = barging allowed → higher throughput. Use fairness only when you've measured starvation.",
        },
        {
          id: "con-29",
          title: "BlockingQueue producer-consumer",
          code: "BlockingQueue<Task> q = new LinkedBlockingQueue<>(100);\n// producer: q.put(t);\n// consumer: q.take();",
          options: [
            "Throws when full/empty",
            "put/take BLOCK when bounded queue is full/empty; offer/poll variants return false/null; safe & idiomatic",
            "Same as ConcurrentLinkedQueue",
            "Doesn't block",
          ],
          answer: 1,
          explanation:
            "BlockingQueue blocks producers on full and consumers on empty — perfect for producer-consumer pipelines. ConcurrentLinkedQueue is non-blocking unbounded. ArrayBlockingQueue (bounded, ring-buffer). LinkedBlockingQueue (linked nodes, optionally bounded).",
        },
        {
          id: "con-30",
          title: "synchronized on String literal — bad idea",
          code: 'synchronized("LOCK") { ... }',
          options: [
            "Safe",
            "String literals are interned and SHARED across the JVM — anyone else syncing on the same literal contends with you",
            "Faster than Object",
            "Lock is per-class",
          ],
          answer: 1,
          explanation:
            "Sync on shared interned strings or Class<?> objects causes accidental cross-component contention. Always sync on a private final Object owned by your class. (And modern practice: avoid synchronized blocks at all in favour of Lock objects.)",
        },
      ],
    },

    {
      id: "streams",
      title: "Streams, Lambdas & Functional",
      icon: "🌊",
      color: "#10b981",
      blurb:
        "map/filter/reduce, collectors, parallel, optional, functional interfaces.",
      questions: [
        {
          id: "stm-1",
          title: "map vs flatMap",
          code: "List<List<Integer>> xs = List.of(List.of(1,2), List.of(3,4));\nxs.stream().flatMap(List::stream).forEach(System.out::print);",
          options: [
            "Prints [[1,2],[3,4]]",
            "Prints 1234 — flatMap concatenates streams",
            "Compile error",
            "Throws",
          ],
          answer: 1,
          explanation:
            "map transforms 1→1. flatMap transforms 1→stream, then flattens. Use flatMap when each element produces multiple results (e.g., orders → items).",
        },
        {
          id: "stm-2",
          title: "filter with side-effect",
          code: "Stream.of(1,2,3).filter(x -> { System.out.println(x); return x > 1; }).count();",
          options: [
            "Prints 1, 2, 3",
            "Prints 1, 2, 3 — filter visits each but only matches survive",
            "Prints nothing",
            "Prints 2, 3",
          ],
          answer: 1,
          explanation:
            "filter visits every element. count() is a terminal that may use SIZED optimisations, but with a predicate it walks all. Don't rely on side effects in filter — stream operations should be pure.",
        },
        {
          id: "stm-3",
          title: "Streams are not reusable",
          code: "Stream<Integer> s = Stream.of(1, 2, 3);\ns.forEach(System.out::print);\ns.count();",
          options: [
            "Prints 123, then prints 3",
            "IllegalStateException — stream has already been operated upon or closed",
            "Prints twice",
            "Compile error",
          ],
          answer: 1,
          explanation:
            "Once a terminal operation runs (forEach), the stream is consumed. Calling another terminal/intermediate op throws IllegalStateException. Re-create the stream or collect to a list first.",
        },
        {
          id: "stm-4",
          title: "Collectors.toMap with duplicate keys",
          code: 'Map<String, Integer> m = Stream.of("a", "a", "b")\n  .collect(Collectors.toMap(s -> s, String::length));',
          options: [
            "Returns {a=1, b=1}",
            "IllegalStateException: Duplicate key",
            "Returns {a=2, b=1}",
            "Returns null",
          ],
          answer: 1,
          explanation:
            "The 2-arg toMap throws on duplicate keys. Use the 3-arg form with a merge function: toMap(k, v, (a,b) -> a) to keep first; (a,b) -> b for last; Integer::sum for accumulate.",
        },
        {
          id: "stm-5",
          title: "Collectors.groupingBy",
          code: 'Map<Integer, List<String>> byLen = Stream.of("a", "bb", "cc")\n  .collect(Collectors.groupingBy(String::length));',
          options: ["{1=[a], 2=[bb,cc]}", "{1=[a]}", "Throws", "Empty"],
          answer: 0,
          explanation:
            "groupingBy(classifier) returns Map<K, List<T>>. Add a downstream collector: groupingBy(classifier, counting()), or toSet(), or summingInt(...). Composable analytics one-liners.",
        },
        {
          id: "stm-6",
          title: "Collectors.partitioningBy",
          code: "Map<Boolean, List<Integer>> p = Stream.of(1,2,3,4)\n  .collect(Collectors.partitioningBy(x -> x % 2 == 0));",
          options: [
            "Same as groupingBy with Boolean key",
            "Specialised for boolean — both keys (true/false) are ALWAYS present (even if empty list); EnumMap-like under the hood",
            "Throws if one partition is empty",
            "Only allows Boolean values",
          ],
          answer: 1,
          explanation:
            "partitioningBy always has both true and false keys (empty lists when no matches) — unlike groupingBy(predicate) which omits empty groups.",
        },
        {
          id: "stm-7",
          title: "Reduce with identity",
          code: "int sum = Stream.of(1,2,3).reduce(0, Integer::sum);",
          options: [
            "Throws on empty",
            "Identity (0) is also the result for empty stream — never returns Optional",
            "Returns Optional",
            "Returns 6 but throws on empty",
          ],
          answer: 1,
          explanation:
            "reduce(identity, accumulator) returns T (not Optional). Identity is the no-op value (0 for sum, 1 for product, '' for concat). Three-arg reduce adds a combiner for parallelism.",
        },
        {
          id: "stm-8",
          title: "Parallel stream pitfall",
          code: "List<Integer> sink = new ArrayList<>();\nIntStream.range(0, 10000).parallel().forEach(sink::add);",
          options: [
            "Safe — adds all",
            "Race condition — ArrayList not thread-safe; may corrupt, throw, or lose elements",
            "Adds 10000 in order",
            "Compile error",
          ],
          answer: 1,
          explanation:
            "ArrayList.add isn't thread-safe. Parallel forEach races on the same list. Use collect (parallel-safe), or a thread-safe sink (synchronizedList, ConcurrentLinkedQueue).",
        },
        {
          id: "stm-9",
          title: "forEach vs forEachOrdered",
          code: "Stream.of(1,2,3,4).parallel().forEach(System.out::print);\nStream.of(1,2,3,4).parallel().forEachOrdered(System.out::print);",
          options: [
            "Both print 1234",
            "forEach: any order (parallel); forEachOrdered: preserves encounter order (loses parallel benefit)",
            "Both unordered",
            "Both ordered",
          ],
          answer: 1,
          explanation:
            "forEach lets the runtime choose order — fastest for parallel. forEachOrdered guarantees encounter order — often serialises the tail of the pipeline.",
        },
        {
          id: "stm-10",
          title: "Infinite stream + limit",
          code: "Stream.iterate(0, i -> i + 1).limit(5).forEach(System.out::print);",
          options: [
            "Hangs forever",
            "Prints 01234 — limit short-circuits the infinite stream",
            "OOM",
            "Compile error",
          ],
          answer: 1,
          explanation:
            "Streams are LAZY. iterate generates on demand. limit is a short-circuiting intermediate op — only pulls 5 elements then terminates. Use Stream.iterate(seed, hasNext, next) (Java 9+) for built-in stopping condition.",
        },
        {
          id: "stm-11",
          title: "peek for debugging",
          code: "Stream.of(1,2,3).peek(System.out::println).map(x -> x * 2).count();",
          options: [
            "Prints 1, 2, 3",
            "May print nothing — peek may be skipped if the pipeline can satisfy the terminal op without consuming elements",
            "Prints 2, 4, 6",
            "Throws",
          ],
          answer: 1,
          explanation:
            "peek is for debugging, not side-effects. count() on a SIZED source can avoid traversing → peek may not run at all. Don't rely on it for production behaviour.",
        },
        {
          id: "stm-12",
          title: "Closure over local variable",
          code: "int x = 5;\nRunnable r = () -> System.out.println(x);\nx = 10;",
          options: [
            "Prints 10",
            "Compile error — x must be effectively final; reassignment breaks that",
            "Prints 5",
            "Runtime error",
          ],
          answer: 1,
          explanation:
            "Lambdas (and anonymous classes) capture locals by VALUE, but the variable must be final or effectively final. Reassignment after the lambda creation disqualifies it.",
        },
        {
          id: "stm-13",
          title: "Lambda 'this' binding",
          code: "class Outer {\n  Runnable r = () -> System.out.println(this);\n  Runnable r2 = new Runnable() { public void run() { System.out.println(this); } };\n}",
          options: [
            "Both print Outer",
            "Lambda: 'this' is the enclosing Outer; anonymous class: 'this' is the anonymous instance",
            "Both print null",
            "Both print the anonymous class",
          ],
          answer: 1,
          explanation:
            "Lambdas DO NOT introduce a new 'this' scope — 'this' refers to the enclosing instance. Anonymous classes have their own 'this'. Subtle when overriding context-sensitive methods.",
        },
        {
          id: "stm-14",
          title: "Function.compose vs andThen",
          code: "Function<Integer, Integer> a = x -> x + 1;\nFunction<Integer, Integer> b = x -> x * 2;\nSystem.out.println(a.andThen(b).apply(3));\nSystem.out.println(a.compose(b).apply(3));",
          options: [
            "Both print 8",
            "andThen: (3+1)*2 = 8; compose: (3*2)+1 = 7",
            "Both print 7",
            "Compile error",
          ],
          answer: 1,
          explanation:
            "andThen: apply THIS first, then the argument. compose: apply the ARGUMENT first, then this. Reading left-to-right works for andThen; compose mirrors mathematical f ∘ g.",
        },
        {
          id: "stm-15",
          title: "Predicate.and/or/negate",
          code: "Predicate<Integer> even = i -> i % 2 == 0;\nPredicate<Integer> positive = i -> i > 0;\nPredicate<Integer> p = even.and(positive).negate();",
          options: [
            "Compile error",
            "p matches: NOT (even AND positive)",
            "Always true",
            "Same as Predicate.isEqual",
          ],
          answer: 1,
          explanation:
            "Predicate has default methods and/or/negate for composition. Cleaner than nested if-elses. Equivalent: p.test(x) ≡ !(even.test(x) && positive.test(x)).",
        },
        {
          id: "stm-16",
          title: "Method reference types",
          code: "// String::length          — bound? unbound?\n// Math::random            — static\n// System.out::println     — bound (to System.out)\n// String::new             — constructor",
          options: [
            "All static",
            "Four kinds: static (Math::random), bound (System.out::println), unbound instance (String::length), constructor (String::new)",
            "All instance",
            "All constructors",
          ],
          answer: 1,
          explanation:
            "Static (Class::staticMethod). Bound (instance::method). Unbound (Class::instanceMethod — first arg is the receiver). Constructor (Class::new). All are syntactic sugar for lambdas.",
        },
        {
          id: "stm-17",
          title: "@FunctionalInterface",
          code: "@FunctionalInterface\ninterface Two {\n  void a(); void b();\n}",
          options: [
            "Compiles",
            "Compile error — @FunctionalInterface requires EXACTLY ONE abstract method (SAM)",
            "Treated as marker only",
            "Runtime error",
          ],
          answer: 1,
          explanation:
            "@FunctionalInterface is enforced by the compiler — exactly one abstract method allowed (default/static/private methods don't count). Optional annotation; lambda-targetability needs SAM regardless.",
        },
        {
          id: "stm-18",
          title: "Optional.map vs flatMap",
          code: "Optional<User> u = ...;\nOptional<String> name1 = u.map(User::getName);\nOptional<String> name2 = u.flatMap(User::findName); // findName returns Optional<String>",
          options: [
            "Identical",
            "map wraps the result; flatMap takes a function that already returns Optional (prevents Optional<Optional<T>>)",
            "Always use map",
            "flatMap returns null",
          ],
          answer: 1,
          explanation:
            "If your function returns T, use map. If it already returns Optional<T>, use flatMap to avoid nesting. Same distinction as Stream.map vs flatMap.",
        },
        {
          id: "stm-19",
          title: "Optional.get on empty",
          code: "Optional<String> o = Optional.empty();\nSystem.out.println(o.get());",
          options: [
            "null",
            "NoSuchElementException",
            "empty string",
            "Compile error",
          ],
          answer: 1,
          explanation:
            "Optional.get on empty throws NoSuchElementException. Java 10+ added orElseThrow() (no-arg) as the same thing with a clearer intent. Avoid get; prefer orElse/orElseThrow/ifPresent.",
        },
        {
          id: "stm-20",
          title: "Optional as a field — anti-pattern?",
          code: "class User { private Optional<String> nickname; }",
          options: [
            "Idiomatic",
            "Anti-pattern — Optional was designed for return values; as a field it's serialisation-unfriendly and adds overhead. Use nullable + null-safe getter",
            "Compile error",
            "Slower at read",
          ],
          answer: 1,
          explanation:
            "Java's intent (per its designers) is Optional as a return-type hint. Field/parameter use brings serialization issues and a per-instance wrapper. Prefer a nullable field + getter that returns Optional.",
        },
        {
          id: "stm-21",
          title: "Stream.iterate (3-arg) Java 9+",
          code: "Stream.iterate(0, i -> i < 10, i -> i + 2).forEach(System.out::print);",
          options: [
            "Hangs",
            "Prints 02468 — built-in stopping predicate; cleaner than iterate+limit",
            "Throws",
            "Compile error pre Java 17",
          ],
          answer: 1,
          explanation:
            "Three-arg iterate (Java 9+) takes seed, hasNext, next — like a classic for loop. Bounded by predicate. Cleaner than iterate(seed, fn).limit(N) when the bound isn't a fixed count.",
        },
        {
          id: "stm-22",
          title: "IntStream summary",
          code: "IntSummaryStatistics st = IntStream.of(1,2,3,4).summaryStatistics();\nSystem.out.println(st.getAverage());",
          options: ["2.5", "Throws", "0", "10"],
          answer: 0,
          explanation:
            "IntSummaryStatistics computes count, sum, min, max, average in one pass. (1+2+3+4)/4 = 2.5. Equivalent for Long/Double streams.",
        },
        {
          id: "stm-23",
          title: "boxed()",
          code: "List<Integer> l = IntStream.rangeClosed(1, 3).boxed().toList();",
          options: [
            "Compile error",
            "boxed() converts IntStream → Stream<Integer>; required because primitive streams have no .collect(Collectors)",
            "Slower than no boxed",
            "Unboxes",
          ],
          answer: 1,
          explanation:
            "Primitive streams (IntStream/LongStream/DoubleStream) have a leaner API (no Collectors). boxed() converts to Stream<Integer> so you can collect/toList/etc.",
        },
        {
          id: "stm-24",
          title: "Collectors.joining",
          code: 'String csv = Stream.of("a", "b", "c")\n  .collect(Collectors.joining(", ", "[", "]"));',
          options: ["[a, b, c]", "a,b,c", "[a][b][c]", "[]"],
          answer: 0,
          explanation:
            "joining(delimiter, prefix, suffix) → '[a, b, c]'. Variants: joining() and joining(delimiter). Cleaner than manual StringBuilder.",
        },
        {
          id: "stm-25",
          title: "Stream.generate",
          code: "Stream.generate(Math::random).limit(3).forEach(System.out::println);",
          options: [
            "Compile error",
            "Generates an INFINITE stream from the Supplier; bounded with limit",
            "Throws",
            "Prints once",
          ],
          answer: 1,
          explanation:
            "Stream.generate(Supplier) makes an unbounded stream; each request invokes the supplier. Unlike iterate, no dependency on previous value — good for random/UUIDs.",
        },
        {
          id: "stm-26",
          title: "Short-circuit operations",
          code: "boolean has = Stream.of(1,2,3,4,5).anyMatch(x -> x > 3);",
          options: [
            "Walks all elements",
            "Stops at the first matching element — anyMatch / allMatch / noneMatch / findFirst are short-circuit",
            "Throws",
            "Always false",
          ],
          answer: 1,
          explanation:
            "Short-circuiting terminals stop as soon as the answer is determined. findFirst, findAny, anyMatch, allMatch, noneMatch all bail early. Critical for performance on infinite/large streams.",
        },
        {
          id: "stm-27",
          title: "Stream.takeWhile / dropWhile",
          code: "// Java 9+\nStream.of(1,2,3,4,1,2).takeWhile(i -> i < 3).forEach(System.out::print);",
          options: [
            "Prints 1212",
            "Prints 12 — takeWhile STOPS at first element where predicate fails",
            "Prints 1234",
            "Throws",
          ],
          answer: 1,
          explanation:
            "takeWhile/dropWhile are PREFIX/SUFFIX ops (Java 9+). Different from filter (which checks each element independently). Useful for ordered streams (sorted by date, etc.).",
        },
        {
          id: "stm-28",
          title: "Collectors.reducing",
          code: "Optional<Integer> max = Stream.of(3,1,4,1,5).collect(Collectors.reducing(Integer::max));",
          options: [
            "Compile error",
            "Same as Stream.reduce, but composes with groupingBy as a downstream collector",
            "Always returns 5",
            "Throws",
          ],
          answer: 1,
          explanation:
            "Collectors.reducing is the collector form of reduce. Useful as a downstream of groupingBy (group then reduce per group).",
        },
        {
          id: "stm-29",
          title: "Stream.sorted is stateful",
          code: "Stream.of(3,1,2).sorted().forEach(System.out::print);",
          options: [
            "O(1)",
            "STATEFUL intermediate op — must see all elements before emitting (O(n log n) sort)",
            "Streaming op",
            "Throws",
          ],
          answer: 1,
          explanation:
            "Stateful intermediate ops (sorted, distinct, limit, skip on unordered) buffer or sort the stream. Beware on infinite streams — sorted will never produce.",
        },
        {
          id: "stm-30",
          title: "Collectors.toUnmodifiableList",
          code: "List<Integer> l = Stream.of(1,2,3).collect(Collectors.toUnmodifiableList());",
          options: [
            "Same as toList",
            "Returns an unmodifiable list (Java 10+); newer toList() (Java 16+) does the same",
            "Returns null",
            "Throws",
          ],
          answer: 1,
          explanation:
            "Java 10 added toUnmodifiableList/Set/Map. Java 16 added Stream.toList() (returns unmodifiable). Use Stream.toList() in modern code; use Collectors.toUnmodifiableList in chain after groupingBy etc.",
        },
        {
          id: "stm-31",
          title: "Collectors.mapping",
          code: 'Map<Integer, List<Character>> byLen = Stream.of("a", "bb", "ccc")\n  .collect(Collectors.groupingBy(String::length, Collectors.mapping(s -> s.charAt(0), Collectors.toList())));',
          options: [
            "Compile error",
            "groupingBy + mapping transforms each grouped element with a downstream collector — composable",
            "mapping is for Map only",
            "Throws",
          ],
          answer: 1,
          explanation:
            "Collectors.mapping is the downstream-form of Stream.map. Lets you compose 'group → transform → collect'. Powerful with groupingBy/partitioningBy.",
        },
        {
          id: "stm-32",
          title: "Function composition order",
          code: "Function<Integer, Integer> f = ((Function<Integer, Integer>)(x -> x + 1)).andThen(x -> x * 2);\nSystem.out.println(f.apply(3));",
          options: ["7", "8", "6", "Compile error"],
          answer: 1,
          explanation:
            "andThen runs left then right: (3 + 1) * 2 = 8. Common in pipelines: validate.andThen(transform).andThen(persist).",
        },
        {
          id: "stm-33",
          title: "BiFunction",
          code: "BiFunction<Integer, Integer, Integer> add = Integer::sum;\nint r = add.apply(2, 3);",
          options: ["5", "Compile error", "23", "Throws"],
          answer: 0,
          explanation:
            "BiFunction<T,U,R> takes two args, returns R. Integer::sum matches BiFunction<Integer, Integer, Integer>. Other 2-arg functional interfaces: BiConsumer, BiPredicate, BinaryOperator.",
        },
        {
          id: "stm-34",
          title: "Lazy evaluation",
          code: 'Stream.of(1,2,3)\n  .peek(x -> System.out.println("p" + x))\n  .map(x -> x * 2)\n  .findFirst();',
          options: [
            "Prints p1 p2 p3",
            "Prints only p1 — streams are LAZY and findFirst short-circuits",
            "Prints nothing",
            "Throws",
          ],
          answer: 1,
          explanation:
            "Intermediate ops don't run until a terminal op pulls. Pipeline processes one element at a time (when possible). findFirst pulls just 1 → only p1.",
        },
        {
          id: "stm-35",
          title: "Why Optional.ifPresentOrElse",
          code: "// Java 9+\nopt.ifPresentOrElse(v -> handle(v), () -> handleEmpty());",
          options: [
            "Same as ifPresent",
            "Two-branch handler: action on present, runnable on empty — replaces if/else around isPresent",
            "Throws on empty",
            "Only logs",
          ],
          answer: 1,
          explanation:
            "Java 9 added ifPresentOrElse. Replaces the common if(opt.isPresent()) { ... } else { ... } anti-pattern with a fluent API. Don't unwrap; consume.",
        },
      ],
    },

    {
      id: "jvm",
      title: "JVM Internals & Memory",
      icon: "⚙️",
      color: "#8b5cf6",
      blurb: "Heap, GC, class loading, JIT, references, profiling.",
      questions: [
        {
          id: "jvm-1",
          title: "JVM memory areas",
          code: "// Heap | Stack (per-thread) | Metaspace | Code cache | Native memory",
          options: [
            "Only heap exists",
            "Heap (objects), Stack (frames per thread), Metaspace (class metadata), Code cache (JIT), direct/native memory",
            "Heap and stack only",
            "All in one pool",
          ],
          answer: 1,
          explanation:
            "Heap: objects (shared). Stack: per-thread frames (locals, operand stack). Metaspace: class metadata (replaced PermGen in Java 8). Code cache: compiled JIT code. Native: direct ByteBuffers, JNI.",
        },
        {
          id: "jvm-2",
          title: "Young vs Old generation",
          code: "// Young: Eden + Survivor 0 + Survivor 1 (minor GC, fast)\n// Old: tenured (major GC, slower)",
          options: [
            "Same speed",
            "Generational hypothesis: most objects die young. Minor GCs (young gen) are frequent + fast; majors (old gen) are rarer + heavier",
            "Old gen first",
            "Only Z and Shenandoah differ",
          ],
          answer: 1,
          explanation:
            "Young gen uses copying GC (cheap if most are dead). Survivors that survive enough rounds are promoted to old. Tuning generation sizes is the bread-and-butter of GC tuning.",
        },
        {
          id: "jvm-3",
          title: "PermGen vs Metaspace",
          code: "// Java 7-: PermGen (fixed size)\n// Java 8+: Metaspace (native memory, auto-grows)",
          options: [
            "Identical",
            "Java 8 replaced PermGen with Metaspace — class metadata moved off heap; no more PermGen OOM",
            "Metaspace is on heap",
            "PermGen was native memory",
          ],
          answer: 1,
          explanation:
            "PermGen was a fixed area in the heap → OOM under many classes (e.g., dynamic class generation). Metaspace lives in native memory and grows by default. Cap with -XX:MaxMetaspaceSize to avoid memory blowups.",
        },
        {
          id: "jvm-4",
          title: "G1 vs ZGC vs Shenandoah",
          code: "// G1: region-based, generational, default since Java 9\n// ZGC: ultra-low pause (<1ms), large heaps\n// Shenandoah: low pause, similar goals",
          options: [
            "Same algorithm",
            "G1: default, region-based, generational. ZGC/Shenandoah: ultra-low-pause concurrent collectors for very large heaps",
            "Only Serial works in prod",
            "Parallel always best",
          ],
          answer: 1,
          explanation:
            "G1 is the safe default. ZGC/Shenandoah target sub-ms pauses on huge heaps (tens of GB+) via concurrent moves. CMS is gone. Parallel GC still good for batch jobs prioritizing throughput.",
        },
        {
          id: "jvm-5",
          title: "Class loading order",
          code: "// Bootstrap → Platform (ext) → Application/System",
          options: [
            "Application first",
            "Bootstrap → Platform → Application. Delegation model: child asks parent first",
            "All loaded at startup",
            "Single loader",
          ],
          answer: 1,
          explanation:
            "Parent-first delegation prevents user code from overriding java.* classes. To load a class, an AppClassLoader asks PlatformClassLoader, which asks Bootstrap — only loads itself if parents fail.",
        },
        {
          id: "jvm-6",
          title: "JIT — C1 vs C2",
          code: "// Tiered compilation: C1 (fast compile, less optimised) → C2 (slow compile, highly optimised)",
          options: [
            "Interpreter only",
            "Tiered: interpret → C1 → C2. Hot methods graduate; cold ones stay interpreted",
            "C2 always",
            "C1 only",
          ],
          answer: 1,
          explanation:
            "JVM starts interpreted. Profiles execution; hot methods get C1 (client) then C2 (server) compiled. C2 does aggressive inlining, escape analysis, vectorization. Hotspot monitors and can deoptimise.",
        },
        {
          id: "jvm-7",
          title: "Escape analysis",
          code: 'void m() {\n  StringBuilder sb = new StringBuilder();\n  sb.append("hi"); // sb never escapes — JIT may stack-allocate or scalar-replace\n}',
          options: [
            "No effect",
            "JIT may eliminate heap allocation when an object proves to never escape its scope",
            "Only at startup",
            "Disables GC",
          ],
          answer: 1,
          explanation:
            "Escape analysis lets the JIT optimise away short-lived allocations: scalar replacement, stack allocation, lock elision. Big perf win — but only when objects don't escape (no published reference, no thread crossing).",
        },
        {
          id: "jvm-8",
          title: "Compressed OOPs",
          code: "// Object pointers compressed to 32-bit on heaps up to 32GB",
          options: [
            "Always 64-bit",
            "Up to ~32GB heap, JVM uses 32-bit compressed pointers (shifted by 3) — saves memory, improves cache",
            "Compresses object DATA",
            "Disabled by default",
          ],
          answer: 1,
          explanation:
            "Compressed OOPs (Ordinary Object Pointers) shift 64-bit addresses down 3 bits, fitting in 32 bits up to ~32GB heap. Doubles cache density for pointer-heavy data. Disabled automatically for larger heaps.",
        },
        {
          id: "jvm-9",
          title: "WeakReference vs SoftReference vs PhantomReference",
          code: "WeakReference<X> w = new WeakReference<>(obj);\nSoftReference<X> s = new SoftReference<>(obj);\nPhantomReference<X> p = new PhantomReference<>(obj, queue);",
          options: [
            "All identical",
            "Strength: strong > soft > weak > phantom. Soft cleared under memory pressure; weak cleared at next GC; phantom for cleanup notifications only",
            "All cleared at same time",
            "PhantomReference returns the referent",
          ],
          answer: 1,
          explanation:
            "Soft: cache-like (kept until memory pressure). Weak: WeakHashMap, caches. Phantom: replaces finalize for resource cleanup — referent is never returned, just signals via ReferenceQueue.",
        },
        {
          id: "jvm-10",
          title: "finalize is deprecated",
          code: "@Override protected void finalize() { /* cleanup */ }",
          options: [
            "Recommended for cleanup",
            "Deprecated since Java 9; removed in newer versions; use try-with-resources, AutoCloseable, or Cleaner",
            "Always runs",
            "Replaces close()",
          ],
          answer: 1,
          explanation:
            "finalize was unreliable (timing, can resurrect objects, perf cost). Java 9 deprecated it; java.lang.ref.Cleaner is the replacement for resource cleanup. Best practice: AutoCloseable + try-with-resources.",
        },
        {
          id: "jvm-11",
          title: "-Xmx vs -Xms",
          code: "java -Xms2g -Xmx2g -jar app.jar",
          options: [
            "Both max heap",
            "-Xms initial heap, -Xmx max heap; same value prevents costly resize and reduces GC variability",
            "-Xms is metaspace",
            "Cannot be equal",
          ],
          answer: 1,
          explanation:
            "-Xms: initial heap. -Xmx: max heap. Setting them equal in containers/servers avoids growth pauses and OS overcommit surprises. Modern JVMs also auto-detect cgroup limits.",
        },
        {
          id: "jvm-12",
          title: "JVM bytecode invoke* family",
          code: "// invokevirtual: instance method, dynamic dispatch\n// invokestatic:  static method\n// invokespecial: constructor / private / super\n// invokeinterface: interface call (slightly slower lookup)\n// invokedynamic: bootstrapped, lambdas/strconcat",
          options: [
            "One invoke instruction",
            "Five invoke instructions — JVM picks based on call site semantics; invokedynamic powers lambdas",
            "Only invokestatic exists",
            "All identical at runtime",
          ],
          answer: 1,
          explanation:
            "Each has different dispatch semantics. invokedynamic (Java 7+) is bootstrapped per call site — lambdas, indy-based string concat (Java 9+), pattern matching switch all use it for flexibility + performance.",
        },
        {
          id: "jvm-13",
          title: "StackOverflowError",
          code: "void recur() { recur(); }",
          options: [
            "OOM",
            "StackOverflowError when frame stack exceeds -Xss (default ~512KB-1MB)",
            "Heap OOM",
            "Hangs",
          ],
          answer: 1,
          explanation:
            "Each thread has a fixed stack. Deep/infinite recursion overflows → StackOverflowError. Tune with -Xss; or refactor to iteration / trampolining.",
        },
        {
          id: "jvm-14",
          title: "OOM types",
          code: "java.lang.OutOfMemoryError: Java heap space\njava.lang.OutOfMemoryError: Metaspace\njava.lang.OutOfMemoryError: Direct buffer memory\njava.lang.OutOfMemoryError: unable to create native thread",
          options: [
            "All same",
            "Different sources: heap (objects), Metaspace (classes), direct buffers (off-heap), threads (native memory / OS limits)",
            "Heap only",
            "Always means heap",
          ],
          answer: 1,
          explanation:
            "The OOM message tells you WHERE. Heap → bigger -Xmx or fix leak. Metaspace → class leaks (deploy storms, lots of classloaders). Direct buffer → unflushed NIO. Native thread → -Xss too high or OS ulimit.",
        },
        {
          id: "jvm-15",
          title: "Object header size",
          code: "// Mark word (8B) + Klass pointer (4B compressed / 8B uncompressed)",
          options: [
            "0 bytes",
            "12-16 bytes header + body; padded to 8-byte boundary — smallest object is 16 bytes",
            "1 byte",
            "Identical across JVMs",
          ],
          answer: 1,
          explanation:
            "Every Java object has a header (mark word + klass pointer). On 64-bit HotSpot with compressed OOPs: 12 bytes header + body, padded to 8B → minimum 16B. Why 'new Object()' costs more than you'd think.",
        },
        {
          id: "jvm-16",
          title: "JFR — Java Flight Recorder",
          code: "jcmd <pid> JFR.start name=profile duration=60s filename=p.jfr",
          options: [
            "External tool",
            "Built into the JVM (free since Java 11) — low-overhead profiling, allocation, GC, lock contention",
            "Removed in Java 17",
            "Same as jstack",
          ],
          answer: 1,
          explanation:
            "JFR records JVM-level events with very low overhead. Pair with JDK Mission Control (JMC) to visualise. Production-grade profiling without a real profiler attached.",
        },
        {
          id: "jvm-17",
          title: "Reflection cost",
          code: 'Method m = obj.getClass().getMethod("foo");\nm.invoke(obj);',
          options: [
            "Free",
            "Reflective calls are slower than direct calls (lookup + access checks + boxing args). MethodHandles / invokedynamic are faster alternatives",
            "Same speed",
            "Faster than direct call",
          ],
          answer: 1,
          explanation:
            "Reflection has runtime overhead: lookup, access checks, argument array boxing. JIT optimises hot reflection sites somewhat. For frameworks needing fast dispatch (Spring, Jackson), MethodHandle and code-gen (LambdaMetafactory) are preferred.",
        },
        {
          id: "jvm-18",
          title: "Class loading delegation hierarchy",
          code: "ClassLoader.findClass(name); // override\nClassLoader.loadClass(name); // delegates first",
          options: [
            "Same method",
            "loadClass(): delegate to parent FIRST, then findClass. findClass: where you actually load. Override findClass when writing a custom loader",
            "findClass delegates",
            "loadClass never used",
          ],
          answer: 1,
          explanation:
            "loadClass implements the parent-first delegation. When writing a custom ClassLoader, override findClass for the actual loading — let loadClass handle delegation. (Servlet containers reverse this to give webapps priority.)",
        },
        {
          id: "jvm-19",
          title: "Direct ByteBuffer",
          code: "ByteBuffer buf = ByteBuffer.allocateDirect(1024);",
          options: [
            "Heap-allocated",
            "Off-heap (native) memory — useful for zero-copy I/O; freed via Cleaner not GC",
            "Always faster",
            "Removed in Java 21",
          ],
          answer: 1,
          explanation:
            "Direct buffers live OUTSIDE the Java heap. Faster for native I/O (no copy), but allocation is expensive and cleanup happens via PhantomRef/Cleaner — leaks if held forever. Counts toward -XX:MaxDirectMemorySize.",
        },
        {
          id: "jvm-20",
          title: "JIT inlining",
          code: "// Small hot methods may be inlined at the call site",
          options: [
            "Compile-time inlining only",
            "JIT inlines hot small methods at runtime — eliminates call overhead and unlocks further optimisations",
            "Inlining never happens",
            "Only for static methods",
          ],
          answer: 1,
          explanation:
            "Inlining is the JIT's most important optimisation. Replaces a call with the callee's body — eliminates call overhead and exposes the merged code to constant folding, dead-code elimination, escape analysis. Why micro-benchmarks need JMH to be meaningful.",
        },
      ],
    },

    {
      id: "modern-java",
      title: "Modern Java 8 → 21",
      icon: "🚀",
      color: "#22c55e",
      blurb:
        "var, records, sealed, pattern matching, switch, virtual threads, text blocks.",
      questions: [
        {
          id: "mj-1",
          title: "var keyword",
          code: "var list = new ArrayList<String>();\nvar x = 5;",
          options: [
            "Dynamic typing",
            "Local-variable type inference (Java 10+) — static type, inferred from initializer; no method params/fields",
            "Like JavaScript var",
            "Becomes Object",
          ],
          answer: 1,
          explanation:
            "var is COMPILE-TIME inference. Type is the initializer's static type. Not allowed for fields, method params, or null without explicit cast. Use to shorten obvious types — don't use to obscure intent.",
        },
        {
          id: "mj-2",
          title: "Record basics",
          code: "record Point(int x, int y) {}",
          options: [
            "Mutable",
            "Immutable carrier: auto-generates constructor, accessors x()/y(), equals/hashCode/toString",
            "Just a class with @Data",
            "Cannot have methods",
          ],
          answer: 1,
          explanation:
            "Records (Java 16+) are concise immutable data carriers. Components are final fields. Compiler synthesises canonical constructor, getters (no get-prefix: x() not getX()), equals/hashCode/toString. Can have methods and static helpers.",
        },
        {
          id: "mj-3",
          title: "Record compact constructor",
          code: "record Range(int lo, int hi) {\n  Range {\n    if (lo > hi) throw new IllegalArgumentException();\n  }\n}",
          options: [
            "Compile error",
            "Compact constructor validates / normalises BEFORE field assignment; no parameter list, no explicit assignments",
            "Replaces canonical constructor",
            "Required for every record",
          ],
          answer: 1,
          explanation:
            "Compact constructor lets you add validation/normalisation without re-listing parameters. Body runs; then compiler assigns parameters to fields. Cannot reassign 'this.x = ...' in compact form.",
        },
        {
          id: "mj-4",
          title: "Sealed classes",
          code: "sealed interface Shape permits Circle, Square {}\nfinal class Circle implements Shape {}\nfinal class Square implements Shape {}",
          options: [
            "Same as abstract",
            "Sealed (Java 17+) restricts which types may extend/implement — enables exhaustive switch",
            "Cannot be final",
            "Subclasses unrestricted",
          ],
          answer: 1,
          explanation:
            "Sealed lists EXACT allowed subtypes — closed hierarchies for ADTs. Subtypes must be final, sealed, or non-sealed. Combined with pattern matching switch, the compiler verifies exhaustiveness.",
        },
        {
          id: "mj-5",
          title: "Pattern matching for instanceof",
          code: "if (obj instanceof String s) {\n  System.out.println(s.length());\n}",
          options: [
            "Compile error",
            "Java 16+: instanceof binds the value to a variable in the scope where it's true — eliminates cast",
            "Same as old instanceof",
            "Only in switch",
          ],
          answer: 1,
          explanation:
            "Pattern instanceof binds 's' to the narrowed type within the conditional branch. Cleaner, type-safe, no cast. Scope follows the truth of the expression.",
        },
        {
          id: "mj-6",
          title: "Switch expression (Java 14+)",
          code: 'String name = switch (day) {\n  case MONDAY, FRIDAY -> "L";\n  case SATURDAY, SUNDAY -> "W";\n  default -> "D";\n};',
          options: [
            "Same as switch statement",
            "Returns a value, no fall-through (arrow form), compiler checks exhaustiveness",
            "Throws on default",
            "Cannot return value",
          ],
          answer: 1,
          explanation:
            "Switch expression returns a value; arrow case doesn't fall through; default required unless cases cover all enum constants / sealed permits. Multi-label cases ('MONDAY, FRIDAY') replace stacked cases.",
        },
        {
          id: "mj-7",
          title: "yield in switch",
          code: "int x = switch (y) {\n  case 1 -> 100;\n  case 2 -> { var t = compute(); yield t * 2; }\n  default -> 0;\n};",
          options: [
            "Compile error",
            "yield returns a value from a switch BLOCK (vs single-expression arrow case)",
            "Same as break",
            "Same as return",
          ],
          answer: 1,
          explanation:
            "yield emits a value from a multi-statement switch arm. Used when you need to do computation before producing the result. Cannot be used with old statement-style switch.",
        },
        {
          id: "mj-8",
          title: "Pattern matching switch (Java 21)",
          code: 'String describe(Object o) {\n  return switch (o) {\n    case Integer i -> "int " + i;\n    case String s  -> "str " + s;\n    case null      -> "null";\n    default        -> "other";\n  };\n}',
          options: [
            "Compile error in any version",
            "Java 21+: type patterns, null handling, exhaustiveness on sealed types — powerful ADT-style dispatch",
            "Same as old switch",
            "Doesn't compile with sealed",
          ],
          answer: 1,
          explanation:
            "Pattern matching switch (final in Java 21) supports type patterns, deconstruction (records), guards (when), and null. Combined with sealed types, makes Java ADT-friendly.",
        },
        {
          id: "mj-9",
          title: "Text blocks",
          code: 'String json = """\n  {\n    "key": "value"\n  }\n  """;',
          options: [
            "Compile error",
            "Multi-line literal; incidental whitespace stripped; preserves newlines",
            "Just a single line",
            "Java 21 only",
          ],
          answer: 1,
          explanation:
            'Text blocks (Java 15+) make multi-line literals readable. Common leading whitespace is stripped (controlled by indent of closing """). Embed " without escaping. Supports \\s (preserve trailing space) and \\<newline> (line continuation).',
        },
        {
          id: "mj-10",
          title: "Virtual threads (Java 21)",
          code: "try (var exec = Executors.newVirtualThreadPerTaskExecutor()) {\n  exec.submit(() -> doIO());\n}",
          options: [
            "Same as platform threads",
            "Lightweight, M:N scheduled by JVM, mount/unmount carriers on block — cheap to spawn millions",
            "Reactive only",
            "Removed",
          ],
          answer: 1,
          explanation:
            "Virtual threads (Project Loom, GA in Java 21) make 'thread per request' viable at very high concurrency. Existing blocking code (JDBC, HTTP) is now scalable. Avoid pooling them — just spawn fresh.",
        },
        {
          id: "mj-11",
          title: "Scoped values (Preview)",
          code: "ScopedValue<User> CURRENT = ScopedValue.newInstance();\nScopedValue.where(CURRENT, user).run(this::handle);",
          options: [
            "Same as ThreadLocal",
            "Immutable, dynamically-scoped values — better for virtual threads than ThreadLocal",
            "Java 8 only",
            "Replaces records",
          ],
          answer: 1,
          explanation:
            "ScopedValue binds an immutable value for the duration of a callback. No per-thread storage → fits millions of virtual threads. Replaces inheritable ThreadLocal for context propagation.",
        },
        {
          id: "mj-12",
          title: "Structured concurrency (Preview)",
          code: "try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {\n  var f1 = scope.fork(this::fetchUser);\n  var f2 = scope.fork(this::fetchOrders);\n  scope.join().throwIfFailed();\n}",
          options: [
            "Same as ExecutorService",
            "Treats concurrent subtasks as a single unit — failure of one cancels siblings; lifetime tied to scope",
            "Replaces threads",
            "Synchronous",
          ],
          answer: 1,
          explanation:
            "Structured concurrency (preview/incubator) brings 'lifetime' discipline to concurrency: when a method returns, its subtasks are done. Easier to reason about cancellation, errors, observability than naked Futures.",
        },
        {
          id: "mj-13",
          title: "HttpClient (Java 11)",
          code: "HttpClient client = HttpClient.newHttpClient();\nHttpRequest req = HttpRequest.newBuilder(URI.create(url)).build();\nHttpResponse<String> res = client.send(req, BodyHandlers.ofString());",
          options: [
            "Need a 3rd-party lib",
            "Built-in (Java 11+): sync + async (sendAsync), HTTP/2, WebSocket, no Apache HttpClient needed",
            "Java 17 only",
            "Removed",
          ],
          answer: 1,
          explanation:
            "java.net.http.HttpClient is part of the JDK since Java 11. Replaces the awful HttpURLConnection. Supports HTTP/2, WebSocket, async APIs (CompletableFuture). Use it for new code.",
        },
        {
          id: "mj-14",
          title: "Files.readString (Java 11)",
          code: 'String s = Files.readString(Path.of("file.txt"));',
          options: [
            "Need readAllBytes + new String",
            "One-liner read of small text files (UTF-8 default)",
            "Removed",
            "Throws",
          ],
          answer: 1,
          explanation:
            "Java 11 added readString / writeString — no more wrapping in InputStreamReader/BufferedReader/scanner. UTF-8 by default. For large files, still stream lines.",
        },
        {
          id: "mj-15",
          title: "String.formatted (Java 15)",
          code: 'String s = "hi %s".formatted(name);',
          options: [
            "Same as static format but slower",
            "Instance form of String.format — fluent, often more readable",
            "Removed",
            "Throws",
          ],
          answer: 1,
          explanation:
            '"%s".formatted(x) reads naturally vs String.format("%s", x). Same semantics. Plus String.join, repeat, lines — Java 11-15 added a lot of small QoL methods.',
        },
        {
          id: "mj-16",
          title: "Records and inheritance",
          code: "record A() {}\nclass B extends A {}",
          options: [
            "Allowed",
            "Compile error — records are implicitly final and cannot be extended",
            "Records can extend classes",
            "Allowed with @Inheritable",
          ],
          answer: 1,
          explanation:
            "Records are implicitly final (cannot be extended). They cannot extend other classes (they implicitly extend Record). They CAN implement interfaces.",
        },
        {
          id: "mj-17",
          title: "Modules (Java 9)",
          code: "// module-info.java\nmodule com.acme.app {\n  requires java.net.http;\n  exports com.acme.app.api;\n}",
          options: [
            "Same as packages",
            "JPMS — strong encapsulation, explicit dependency graph; affects public API surface and run-time access",
            "Removed in Java 17",
            "Replaces JARs",
          ],
          answer: 1,
          explanation:
            "JPMS (Project Jigsaw, Java 9) adds modules as a unit of encapsulation. Public != accessible outside the module unless exported. Adoption has been slow in app code; common in the JDK itself.",
        },
        {
          id: "mj-18",
          title: "jshell",
          code: "$ jshell\njshell> 2 + 2",
          options: [
            "External tool",
            "Java 9+ built-in REPL — quick experimentation, prototyping, learning",
            "Pre-Java 9 only",
            "Same as javac",
          ],
          answer: 1,
          explanation:
            "jshell is a REPL bundled with the JDK since Java 9. Snippets, no main needed, auto-imports common packages. Excellent for trying APIs / teaching.",
        },
        {
          id: "mj-19",
          title: "Stream.toList vs Collectors.toList",
          code: "List<Integer> a = Stream.of(1,2).toList();\nList<Integer> b = Stream.of(1,2).collect(Collectors.toList());",
          options: [
            "Identical",
            "Stream.toList (Java 16+) returns UNMODIFIABLE; Collectors.toList returns ArrayList (mutable)",
            "Both immutable",
            "Both mutable",
          ],
          answer: 1,
          explanation:
            "Stream.toList is the modern, succinct, unmodifiable result. Use Collectors.toList only when you actually need to mutate.",
        },
        {
          id: "mj-20",
          title: "Optional.stream (Java 9)",
          code: "users.stream()\n  .flatMap(u -> u.email().stream())\n  .forEach(System.out::println);",
          options: [
            "Compile error",
            "Optional<T>.stream() yields a 0/1-element Stream<T> — clean way to filter+unwrap in a pipeline",
            "Always emits empty",
            "Replaces map",
          ],
          answer: 1,
          explanation:
            "Optional.stream (Java 9+) makes Optional play nicely with stream pipelines: empty → empty stream; present → stream of one. flatMap over them drops the empties.",
        },
        {
          id: "mj-21",
          title: "List.copyOf (Java 10)",
          code: "List<Integer> snap = List.copyOf(mutable);",
          options: [
            "Same as unmodifiableList",
            "Snapshot COPY — independent of source mutations; result is unmodifiable",
            "Returns the source",
            "Throws on null",
          ],
          answer: 1,
          explanation:
            "List.copyOf, Set.copyOf, Map.copyOf (Java 10+) defensive-copy and freeze. Differs from Collections.unmodifiableList which is a LIVE view. Throws NPE on null elements.",
        },
        {
          id: "mj-22",
          title: "Pattern matching deconstruction (Java 21)",
          code: "if (obj instanceof Point(int x, int y) p) {\n  // x, y, p all bound\n}",
          options: [
            "Compile error",
            "Record patterns deconstruct components inline — type-safe destructuring",
            "Works only with sealed",
            "Java 17",
          ],
          answer: 1,
          explanation:
            "Record patterns (Java 21) let you destructure a record's components inline. Combine with switch for ML-style ADT dispatch.",
        },
        {
          id: "mj-23",
          title: "Enhanced random (Java 17)",
          code: 'RandomGenerator gen = RandomGeneratorFactory.of("L64X128MixRandom").create();',
          options: [
            "Identical to java.util.Random",
            "Java 17 introduced multiple PRNG algorithms via RandomGenerator API — better statistical quality + jumpable streams",
            "Removed",
            "Cryptographic",
          ],
          answer: 1,
          explanation:
            "java.util.Random uses an old linear-congruential generator. Java 17 added several modern PRNGs (LXM, Xoshiro) via RandomGenerator. For crypto, still use SecureRandom.",
        },
        {
          id: "mj-24",
          title: "Multi-line string indent control",
          code: 'String s = """\n      hello\n    world\n  """;',
          options: [
            "Random indent",
            'Common leading whitespace = indent of closing """ — here 2 spaces; output: \'    hello\\n  world\\n\'',
            "Always preserves all leading whitespace",
            "Strips all leading",
          ],
          answer: 1,
          explanation:
            'Text block strips the MINIMUM leading whitespace across all lines including the closing delimiter. Move closing """ to control how much indent is stripped.',
        },
        {
          id: "mj-25",
          title: "Records implement equals/hashCode/toString",
          code: "record Point(int x, int y) {}\nPoint a = new Point(1,2);\nPoint b = new Point(1,2);\nSystem.out.println(a.equals(b));",
          options: [
            "false",
            "true — record equals compares all components by value",
            "Throws",
            "Compile error",
          ],
          answer: 1,
          explanation:
            "Records auto-generate equals (compares all components), hashCode, toString. You can override them, but typically you shouldn't. Equality is value-based out of the box.",
        },
      ],
    },

    {
      id: "spring-core",
      title: "Spring Core — IoC, DI, AOP",
      icon: "🌱",
      color: "#16a34a",
      blurb:
        "ApplicationContext, bean lifecycle, scopes, DI types, @Transactional, AOP.",
      questions: [
        {
          id: "sc-1",
          title: "Inversion of Control (IoC)",
          code: "// You don't create dependencies — the container provides them",
          options: [
            "You always 'new' your services",
            "Container creates and wires objects; your code receives ('inverts') the responsibility for instantiation",
            "Only for tests",
            "Same as DI factories",
          ],
          answer: 1,
          explanation:
            "IoC is the principle: 'don't call us, we'll call you'. Container owns construction & lifecycle. Dependency Injection is the COMMON IMPLEMENTATION of IoC. Result: testable, swappable, decoupled code.",
        },
        {
          id: "sc-2",
          title: "DI types — which is preferred?",
          code: "// Constructor   — recommended (immutable, required deps)\n// Setter        — optional deps\n// Field         — convenient but harder to test, no immutability",
          options: [
            "Field injection",
            "Constructor injection — immutable, explicit required deps, easy to test without Spring",
            "Setter only",
            "Whichever — they're equivalent",
          ],
          answer: 1,
          explanation:
            "Modern Spring recommends CONSTRUCTOR injection. Fields can be final; deps are explicit; testable without a container. Field injection trapped many teams (hidden deps, can't be final, needs reflection).",
        },
        {
          id: "sc-3",
          title: "Bean scopes",
          code: "// singleton (default), prototype, request, session, application, websocket",
          options: [
            "Only singleton",
            "singleton (1 per container), prototype (new each get), web scopes for HTTP request/session lifecycle",
            "prototype default",
            "session default",
          ],
          answer: 1,
          explanation:
            "singleton: one shared instance. prototype: new instance per injection/lookup. request/session/application: web-tier lifecycle bound to HTTP. WebSocket scope for STOMP/WS sessions.",
        },
        {
          id: "sc-4",
          title: "@Component vs @Service/@Repository/@Controller",
          code: "@Component @Service @Repository @Controller @RestController",
          options: [
            "Identical at runtime",
            "All are @Component specialisations — same scanning; semantic intent + extras (Repository: SQLException translation; Controller: web binding)",
            "Only @Service is detected",
            "Cannot mix",
          ],
          answer: 1,
          explanation:
            "All extend @Component for scanning. Stereotypes carry semantic intent and can pick up specific behaviour: @Repository enables exception translation; @Controller/@RestController register web handlers.",
        },
        {
          id: "sc-5",
          title: "@Autowired modes",
          code: "@Autowired(required = false)\nprivate Service maybe;",
          options: [
            "Always required",
            "Default is required=true → fails fast if missing; set false to allow null; Optional<T> also supported",
            "Only constructor",
            "Same as @Inject always",
          ],
          answer: 1,
          explanation:
            "@Autowired fails if no matching bean (required=true). Set required=false (or use Optional<Service>) for genuinely optional deps. On the only constructor, @Autowired is optional since Spring 4.3.",
        },
        {
          id: "sc-6",
          title: "@Qualifier and @Primary",
          code: '@Bean @Primary Repo a() { ... }\n@Bean Repo b() { ... }\n@Autowired @Qualifier("b") Repo r;',
          options: [
            "Ambiguous",
            "@Primary chooses default when multiple match; @Qualifier names a specific bean",
            "Both throw",
            "Only one allowed",
          ],
          answer: 1,
          explanation:
            "When multiple beans satisfy a type, @Primary picks the default. @Qualifier overrides per injection point with a name. Custom qualifier annotations are also supported.",
        },
        {
          id: "sc-7",
          title: "@Configuration vs @Component",
          code: "@Configuration class C { @Bean Service s() { return new Service(); } }\n@Component   class K { @Bean Service s() { return new Service(); } }",
          options: [
            "Identical",
            "@Configuration: CGLIB-proxied so @Bean methods enforce singleton (calling s() twice returns same bean). @Component @Bean methods: do NOT proxy, each call returns new instance",
            "Same proxying",
            "@Component proxied",
          ],
          answer: 1,
          explanation:
            "@Configuration uses CGLIB to intercept @Bean methods so cross-references stay singleton. @Component @Bean methods are 'lite mode' — no proxying; method calls don't go through the container.",
        },
        {
          id: "sc-8",
          title: "ApplicationContext vs BeanFactory",
          code: "BeanFactory bf = ...;\nApplicationContext ctx = ...;",
          options: [
            "Identical",
            "ApplicationContext extends BeanFactory with: eager singleton init, event publication, MessageSource, AOP, web support",
            "BeanFactory richer",
            "ApplicationContext slower",
          ],
          answer: 1,
          explanation:
            "ApplicationContext is the superset most apps use. BeanFactory is the low-level core (lazy, minimal). 99% of Spring apps use ApplicationContext.",
        },
        {
          id: "sc-9",
          title: "Bean lifecycle hooks",
          code: "@PostConstruct void init() {}\n@PreDestroy void shutdown() {}",
          options: [
            "Useless",
            "@PostConstruct runs after deps injected; @PreDestroy runs at container shutdown (for singletons)",
            "Run anytime",
            "Same as @Bean",
          ],
          answer: 1,
          explanation:
            "Lifecycle hooks (JSR-250 annotations) replace InitializingBean.afterPropertiesSet / DisposableBean.destroy. Note: prototype-scoped beans don't get @PreDestroy (container doesn't track them after handing out).",
        },
        {
          id: "sc-10",
          title: "BeanPostProcessor",
          code: "class MyBpp implements BeanPostProcessor {\n  Object postProcessBeforeInitialization(Object b, String name) { ... }\n  Object postProcessAfterInitialization(Object b, String name) { ... }\n}",
          options: [
            "Runs once at app start",
            "Hook to intercept EVERY bean before/after init — used internally for AOP proxying, @Autowired wiring, etc.",
            "Same as @PostConstruct",
            "Only for prototypes",
          ],
          answer: 1,
          explanation:
            "BeanPostProcessor lets you transform every bean. Spring uses this for proxying (AOP, @Transactional), wiring annotation processors, etc. Powerful, but rarely needed in app code.",
        },
        {
          id: "sc-11",
          title: "Circular dependency",
          code: "// A needs B; B needs A — via constructor injection",
          options: [
            "Spring handles it transparently",
            "Constructor injection: cycle is UNRESOLVABLE → BeanCurrentlyInCreationException; setter/field injection can break the cycle but indicates design smell",
            "Always fails",
            "Spring uses reflection",
          ],
          answer: 1,
          explanation:
            "Constructor cycles can't be resolved (need each constructor result before the other). Setter/field injection breaks the cycle since beans are constructed first. Better fix: refactor — extract a shared component or use events.",
        },
        {
          id: "sc-12",
          title: "@Lazy",
          code: "@Bean @Lazy ExpensiveService svc() { ... }",
          options: [
            "Always loaded",
            "Bean created on FIRST access — defers init for expensive deps and can break circular dep at injection points",
            "Same as prototype",
            "Disables bean",
          ],
          answer: 1,
          explanation:
            "@Lazy delays instantiation until first use. Useful for heavy beans or to break startup cycles at the injection site. On a singleton, the container still holds one instance — just creates it later.",
        },
        {
          id: "sc-13",
          title: "@Profile",
          code: '@Component @Profile("prod")\nclass ProdMailer {}',
          options: [
            "Loaded always",
            "Bean loaded only when the 'prod' profile is active (spring.profiles.active=prod)",
            "Throws",
            "Activates the profile",
          ],
          answer: 1,
          explanation:
            "@Profile gates bean registration on active profile(s). Combined with environment-specific properties, lets a single jar behave differently in dev/test/prod. Java's nature: choose at startup, not runtime.",
        },
        {
          id: "sc-14",
          title: "@Conditional",
          code: "@Conditional(MyCondition.class) @Bean Foo foo() { ... }",
          options: [
            "Always registered",
            "Registers the bean only when the Condition.matches() returns true — powerful for auto-config",
            "Removed",
            "Same as @Profile",
          ],
          answer: 1,
          explanation:
            "@Conditional and its derivatives (@ConditionalOnClass, OnProperty, OnMissingBean, OnBean) are the engine of Spring Boot auto-configuration: load THIS bean only if THAT condition holds.",
        },
        {
          id: "sc-15",
          title: "@Value injection",
          code: '@Value("${app.url:http://default}") String url;',
          options: [
            "Only literals",
            "Reads from Environment (properties); colon provides a DEFAULT; supports SpEL too",
            "Doesn't support defaults",
            "Only for @Bean methods",
          ],
          answer: 1,
          explanation:
            '@Value pulls from PropertySources. Default after colon. SpEL: @Value("#{T(java.lang.Math).PI}"). For typed config groups, prefer @ConfigurationProperties (cleaner, validates).',
        },
        {
          id: "sc-16",
          title: "Spring AOP — @Aspect basics",
          code: '@Aspect @Component class LoggingAspect {\n  @Around("execution(* com.acme..*Service.*(..))")\n  Object log(ProceedingJoinPoint pjp) throws Throwable { ... }\n}',
          options: [
            "Compile-time weaving only",
            "Runtime weaving via proxies — JDK dynamic proxy if target has interface; CGLIB subclass otherwise",
            "AspectJ bytecode",
            "Only for @Transactional",
          ],
          answer: 1,
          explanation:
            "Spring AOP is PROXY-based (JDK or CGLIB). Limitations: only public methods, no self-invocation, no static/final. For full AspectJ semantics (compile-time/load-time weaving), use AspectJ directly.",
        },
        {
          id: "sc-17",
          title: "AOP self-invocation",
          code: "class S {\n  @Transactional void outer() { inner(); }\n  @Transactional void inner() { ... }\n}",
          options: [
            "Both transactions active",
            "inner() invoked via 'this' SKIPS the proxy — its @Transactional is NOT applied",
            "Throws",
            "Outer's @Transactional skipped",
          ],
          answer: 1,
          explanation:
            "Spring proxies wrap the bean instance. Calling another method via this.x() bypasses the proxy and its advice (e.g. transactions, security). Fix: inject the bean into itself or split into two beans.",
        },
        {
          id: "sc-18",
          title: "@Transactional default propagation",
          code: "@Transactional void m() { ... }",
          options: [
            "REQUIRES_NEW",
            "REQUIRED — join existing tx if any; start a new one otherwise",
            "NEVER",
            "MANDATORY",
          ],
          answer: 1,
          explanation:
            "REQUIRED is the default. Common variants: REQUIRES_NEW (suspend existing, start fresh — used to commit pieces independently), SUPPORTS, MANDATORY (must already be in a tx), NEVER, NESTED (savepoint).",
        },
        {
          id: "sc-19",
          title: "@Transactional rollback on checked exceptions",
          code: "@Transactional void m() throws IOException { ... }",
          options: [
            "Always rolls back",
            "By default rolls back ONLY for RuntimeException/Error; checked exceptions COMMIT unless rollbackFor is specified",
            "Never rolls back",
            "Only DB exceptions",
          ],
          answer: 1,
          explanation:
            "Spring's default rollback is for unchecked exceptions. Checked exceptions complete the transaction unless rollbackFor=IOException.class is added. Common bug — your IOException 'just went through' and stuff committed.",
        },
        {
          id: "sc-20",
          title: "@Transactional isolation",
          code: "@Transactional(isolation = Isolation.READ_COMMITTED)",
          options: [
            "All same",
            "READ_UNCOMMITTED, READ_COMMITTED, REPEATABLE_READ, SERIALIZABLE — increasing protection, decreasing concurrency",
            "Only one level",
            "Database-only setting",
          ],
          answer: 1,
          explanation:
            "JDBC/JTA isolation levels. Default is DB default (often READ_COMMITTED). Higher levels prevent more anomalies (dirty/non-repeatable/phantom reads) but reduce concurrency.",
        },
        {
          id: "sc-21",
          title: "@Transactional on private method",
          code: "class S {\n  @Transactional private void m() {}\n}",
          options: [
            "Tx applied",
            "Spring proxies CAN'T intercept private methods (proxy is a subclass/wrapper) — no transaction",
            "Throws at startup",
            "Always public",
          ],
          answer: 1,
          explanation:
            "Proxy-based AOP can only advise overridable methods → private (and static, final) are skipped silently. Make method package-private or public, OR use AspectJ load-time weaving.",
        },
        {
          id: "sc-22",
          title: "@Async basics",
          code: "@EnableAsync @Configuration class C {}\n@Async void send() { ... }",
          options: [
            "Same thread",
            "Method runs on a different thread (TaskExecutor) via a proxy; return void or CompletableFuture<T>",
            "Blocks caller",
            "Only with virtual threads",
          ],
          answer: 1,
          explanation:
            "@Async needs @EnableAsync. Caller returns immediately; the body runs on a TaskExecutor. Same proxy caveats as @Transactional (no self-invocation, no private). Return CompletableFuture for results/errors.",
        },
        {
          id: "sc-23",
          title: "@Scheduled",
          code: "@EnableScheduling @Configuration class C {}\n@Scheduled(fixedDelay = 60_000) void poll() { ... }",
          options: [
            "Same as @Async",
            "Runs periodically on a TaskScheduler; supports fixedRate, fixedDelay, cron",
            "Runs once",
            "Only at startup",
          ],
          answer: 1,
          explanation:
            "Requires @EnableScheduling. By default uses a single-threaded scheduler — long-running tasks delay others. Customise with a SchedulingConfigurer for a bigger pool.",
        },
        {
          id: "sc-24",
          title: "@ComponentScan vs @SpringBootApplication",
          code: "@SpringBootApplication // = @SpringBootConfiguration + @EnableAutoConfiguration + @ComponentScan",
          options: [
            "Identical",
            "@SpringBootApplication is a composite: configuration + auto-config + scan, with the scan basePackage defaulted to the annotated class's package",
            "Scan is manual",
            "Replaces @Configuration",
          ],
          answer: 1,
          explanation:
            "Composing convention. Put the main class at the package ROOT so scanning picks up all subpackages. Otherwise components in sibling packages won't be detected.",
        },
        {
          id: "sc-25",
          title: "@Import",
          code: "@Import({DbConfig.class, SecurityConfig.class})\n@Configuration class App {}",
          options: [
            "Same as @Bean",
            "Imports other @Configuration classes / ImportSelector / ImportBeanDefinitionRegistrar — modularises config",
            "Only for Bean methods",
            "Inactive at runtime",
          ],
          answer: 1,
          explanation:
            "@Import explicitly pulls in other config classes. Used by @EnableXxx annotations to bring in their infrastructure. ImportSelector enables conditional dynamic imports.",
        },
        {
          id: "sc-26",
          title: "@EnableXxx pattern",
          code: "@EnableJpaRepositories @EnableTransactionManagement @EnableAsync",
          options: [
            "Removed",
            "Convention to opt-in to a feature; under the hood usually @Import on configuration classes",
            "Only Spring Boot",
            "Same as @Component",
          ],
          answer: 1,
          explanation:
            "@EnableXxx annotations are how Spring exposes opt-in feature areas. They typically @Import a Configuration class that registers the relevant beans/BPPs. Spring Boot auto-config replaces many of these.",
        },
        {
          id: "sc-27",
          title: "ApplicationEventPublisher",
          code: "publisher.publishEvent(new UserCreated(id));\n@EventListener void on(UserCreated e) {}",
          options: [
            "External lib",
            "Built-in in-process pub/sub between beans; synchronous by default; @Async on listener makes it async",
            "Cross-JVM",
            "Replaces Kafka",
          ],
          answer: 1,
          explanation:
            "Lightweight INTRA-app pub/sub. Default: synchronous on publisher thread. For decoupling listeners, mark with @Async or use TransactionalEventListener (fires only after commit).",
        },
        {
          id: "sc-28",
          title: "@TransactionalEventListener",
          code: "@TransactionalEventListener(phase = AFTER_COMMIT)\nvoid sendEmail(UserCreated e) {}",
          options: [
            "Runs in the publishing tx",
            "Defers handler to a transaction phase (AFTER_COMMIT, AFTER_ROLLBACK, ...) — avoid side-effects if tx might rollback",
            "Same as @EventListener",
            "Synchronous always",
          ],
          answer: 1,
          explanation:
            "Common bug: publishing 'send email' inside a tx — if tx rolls back, the email already left. @TransactionalEventListener defers to AFTER_COMMIT so external side effects only happen on success.",
        },
        {
          id: "sc-29",
          title: "ObjectProvider for optional/lazy deps",
          code: "@Autowired ObjectProvider<Cache> cache;\ncache.ifAvailable(c -> c.put(k, v));",
          options: [
            "Replaces Optional",
            "Lazy, optional, and disambiguating provider — useful when bean may or may not exist or is expensive to obtain",
            "Same as Provider<T>",
            "Removed",
          ],
          answer: 1,
          explanation:
            "ObjectProvider<T> is Spring's richer alternative to Provider/Supplier: ifAvailable, ifUnique, getIfUnique, lazy, stream(). Use for optional / multiple-candidate / late-bound dependencies.",
        },
        {
          id: "sc-30",
          title: "FactoryBean",
          code: "class TomatoFactory implements FactoryBean<Tomato> {\n  public Tomato getObject() { return new Tomato(); }\n  public Class<?> getObjectType() { return Tomato.class; }\n}",
          options: [
            "Returns the FactoryBean itself",
            "Special bean: container returns getObject(); access the FactoryBean itself via '&beanName'",
            "Same as @Bean method",
            "Deprecated",
          ],
          answer: 1,
          explanation:
            "FactoryBean<T> is for complex bean creation. The container hides the FactoryBean and exposes T. To get the FactoryBean instance itself, prefix the bean name with &.",
        },
        {
          id: "sc-31",
          title: "Spring SpEL",
          code: "@Value(\"#{ systemProperties['user.name'] }\") String user;",
          options: [
            "Like @Value placeholders ${}",
            "SpEL (#{...}) — runtime expression language: arithmetic, method calls, property navigation, lookups",
            "Removed",
            "Compile-time only",
          ],
          answer: 1,
          explanation:
            "${...} is property placeholder. #{...} is SpEL — full expressions evaluated at runtime against the application context. Powerful but slower; don't use SpEL for things that can be plain config.",
        },
        {
          id: "sc-32",
          title: "Validation @Valid",
          code: '@PostMapping("/users")\nUser create(@Valid @RequestBody UserDto dto) { ... }',
          options: [
            "No effect",
            "Triggers Bean Validation (JSR-380) on the argument — violations throw MethodArgumentNotValidException (400 by default)",
            "Only at compile time",
            "Removed",
          ],
          answer: 1,
          explanation:
            "@Valid validates the bound object against jakarta.validation constraints (@NotBlank, @Size, @Email, ...). Spring MVC translates failures to a 400 response (override with @ExceptionHandler or ProblemDetail).",
        },
        {
          id: "sc-33",
          title: "@ControllerAdvice / @RestControllerAdvice",
          code: "@RestControllerAdvice\nclass GlobalErrors {\n  @ExceptionHandler(IllegalArgumentException.class)\n  ResponseEntity<?> bad(Exception e) { ... }\n}",
          options: [
            "Per-controller only",
            "Global exception handling / data binding / model attributes across all controllers",
            "Compile-time advice",
            "Replaces @Transactional",
          ],
          answer: 1,
          explanation:
            "Centralised exception handling. Spring 6 + Boot 3 lean toward returning ProblemDetail (RFC 7807) for consistent error JSON. ResponseStatusException is a quick inline alternative.",
        },
        {
          id: "sc-34",
          title: "Environment / PropertySource order",
          code: "// application.properties < application-{profile}.properties < env vars < command-line args",
          options: [
            "All same priority",
            "Multiple sources with precedence; command-line typically highest in Spring Boot",
            "Only application.properties",
            "Properties cannot be overridden",
          ],
          answer: 1,
          explanation:
            "Spring Boot has a documented precedence (devtools, env vars, cmd-line, props, defaults, etc.). Override in tests/prod without rebuilding — provided you understand the order.",
        },
        {
          id: "sc-35",
          title: "@ConfigurationProperties",
          code: '@ConfigurationProperties(prefix = "mail")\nrecord MailProps(String host, int port, String username) {}',
          options: [
            "Same as @Value",
            "Strongly-typed binding of an entire prefix to a class/record — validates with @Validated; safer than scattered @Value",
            "Only Strings",
            "Deprecated",
          ],
          answer: 1,
          explanation:
            "@ConfigurationProperties binds nested config blocks to a typed object. Use with @EnableConfigurationProperties or @ConfigurationPropertiesScan. Validation via @Validated + JSR-380 annotations. Cleaner than 20 @Value's.",
        },
        {
          id: "sc-36",
          title: "ConversionService",
          code: "// Configurable type conversion: String → Long, Date → Instant, ...",
          options: [
            "Manual cast",
            "Plug in custom Converter<S,T> beans; used by @Value, @ConfigurationProperties, @RequestParam, MVC binding",
            "Removed",
            "Only for JPA",
          ],
          answer: 1,
          explanation:
            "ConversionService unifies conversion across the framework. Register a Converter<S,T> bean and it's automatically wired. Spring Boot also auto-configures common converters.",
        },
        {
          id: "sc-37",
          title: "Bean definition override",
          code: "@Bean DataSource ds() { return new HikariDataSource(); }\n@Bean DataSource ds() { return new BasicDataSource(); } // SAME NAME",
          options: [
            "Last one wins",
            "Spring Boot 2.1+ FORBIDS override by default — throws on startup unless spring.main.allow-bean-definition-overriding=true",
            "Always allowed",
            "Only by name",
          ],
          answer: 1,
          explanation:
            "Earlier silent overrides hid bugs. Boot 2.1+ fails fast on duplicates. Solutions: rename one bean, use @Primary, use @ConditionalOnMissingBean for overridable defaults.",
        },
        {
          id: "sc-38",
          title: "@ConditionalOnMissingBean",
          code: "@Bean\n@ConditionalOnMissingBean\nObjectMapper objectMapper() { return new ObjectMapper(); }",
          options: [
            "Always registers",
            "Registers only if no other ObjectMapper bean exists — pattern for sensible defaults that users can override",
            "Throws on duplicate",
            "Removed",
          ],
          answer: 1,
          explanation:
            "Auto-config pattern: 'I'll provide a default, but step back if the user already defined one'. ObjectMapper, DataSource, RestTemplate are all auto-configured this way.",
        },
        {
          id: "sc-39",
          title: "@ConditionalOnClass",
          code: "@Configuration\n@ConditionalOnClass(HikariDataSource.class)\nclass HikariConfig {}",
          options: [
            "Runtime classpath check",
            "Auto-config kicks in only if specified class is on the classpath — enables 'just add the JAR' magic",
            "Always loads",
            "Only at compile time",
          ],
          answer: 1,
          explanation:
            "@ConditionalOnClass / OnMissingClass enable classpath-conditional configuration — the backbone of Spring Boot starters. Add a starter dependency → its auto-config activates.",
        },
        {
          id: "sc-40",
          title: "Singleton initialisation order",
          code: "// All singletons created eagerly at context startup by default",
          options: [
            "Lazy by default",
            "Eager by default; use @Lazy or context property to defer; required deps ensure correct order",
            "Random order",
            "Manual order needed",
          ],
          answer: 1,
          explanation:
            "Eager singleton init catches misconfiguration at startup, not runtime. @Lazy or spring.main.lazy-initialization=true delays — faster startup but errors surface only on first use.",
        },
        {
          id: "sc-41",
          title: "@DependsOn",
          code: '@Bean @DependsOn("flywayInitializer")\nDataSource ds() { ... }',
          options: [
            "Useless",
            "Forces a specific creation order when there is no direct dependency wire — used for side-effects (e.g. DB migration before app)",
            "Replaces @Autowired",
            "Only at runtime",
          ],
          answer: 1,
          explanation:
            "@DependsOn declares 'create this bean AFTER that bean'. Necessary when ordering is required for SIDE EFFECTS, not for direct wiring. Common with Flyway/Liquibase migrators.",
        },
        {
          id: "sc-42",
          title: "JDK dynamic proxy vs CGLIB",
          code: "// If your bean implements an interface → JDK dynamic proxy (interface-based)\n// Else → CGLIB subclass proxy",
          options: [
            "Always JDK",
            "Spring picks based on whether the target has an interface; CGLIB cannot proxy final classes/methods",
            "Always CGLIB",
            "Same proxy",
          ],
          answer: 1,
          explanation:
            "JDK proxy works against interfaces; users see the interface. CGLIB subclasses the class — cannot override final methods or proxy final classes. Use proxyTargetClass=true to force CGLIB.",
        },
        {
          id: "sc-43",
          title: "@Transactional + REQUIRES_NEW pitfall",
          code: "@Transactional void outer() {\n  audit.log(...);  // @Transactional(REQUIRES_NEW) on the same bean's method\n}",
          options: [
            "New tx as expected",
            "If 'audit' is in the same bean and self-invoked, REQUIRES_NEW DOESN'T APPLY — same proxy pitfall",
            "Compile error",
            "Always rollback",
          ],
          answer: 1,
          explanation:
            "REQUIRES_NEW only kicks in when the call goes THROUGH the proxy. Self-call within the same bean bypasses it → audit happily participates in the outer transaction (and rolls back together).",
        },
        {
          id: "sc-44",
          title: "@Autowired + Optional",
          code: "@Autowired private Optional<MetricsExporter> exporter;",
          options: [
            "Compile error",
            "Spring resolves to Optional.empty() if no candidate bean exists — clean way to express optional deps",
            "Always present",
            "Only at startup",
          ],
          answer: 1,
          explanation:
            "Optional<T>, Provider<T>, ObjectProvider<T> are all supported. Optional is the most readable for 'use if present'. ObjectProvider is richer when you might need to evaluate lazily.",
        },
        {
          id: "sc-45",
          title: "Constructor injection with multiple constructors",
          code: "class S {\n  S(A a) {}\n  S(A a, B b) {}\n}",
          options: [
            "Ambiguous",
            "Spring picks the 'greediest' satisfiable constructor automatically; mark one with @Autowired to disambiguate",
            "Throws always",
            "Picks the first",
          ],
          answer: 1,
          explanation:
            "Spring resolves the most-args constructor whose dependencies all exist as beans. For determinism, use exactly ONE constructor (recommended) or annotate the preferred one with @Autowired.",
        },
        {
          id: "sc-46",
          title: "Prototype bean into singleton",
          code: "@Service class S {\n  @Autowired private PrototypeThing p; // injected ONCE\n}",
          options: [
            "New each call",
            "Injected ONCE at construction — the same prototype is reused for the lifetime of the singleton",
            "Spring fails",
            "Always thread-local",
          ],
          answer: 1,
          explanation:
            "Classic gotcha — 'prototype' means a new bean per LOOKUP, not per use. To get a fresh prototype each call, inject ObjectProvider<T>, Provider<T>, or use method injection (@Lookup).",
        },
        {
          id: "sc-47",
          title: "@Lookup method injection",
          code: "@Component class Service {\n  @Lookup protected PrototypeThing get() { return null; }\n}",
          options: [
            "Returns null always",
            "Spring subclasses the bean and overrides @Lookup methods to return a fresh prototype each call",
            "Removed",
            "Same as @Autowired",
          ],
          answer: 1,
          explanation:
            "Method injection via @Lookup gives a fresh prototype per call from a singleton — without ObjectProvider plumbing. Spring uses CGLIB to subclass and implement the method.",
        },
        {
          id: "sc-48",
          title: "Spring @Cacheable",
          code: '@EnableCaching @Configuration class C {}\n@Cacheable("users") User find(long id) { ... }',
          options: [
            "Returns null first time",
            "First call computes and stores; subsequent calls with the same key return the cached value",
            "Same as @Async",
            "Pure annotation",
          ],
          answer: 1,
          explanation:
            "@Cacheable wraps the method with a cache lookup. Key derived from args (configurable). Subject to the same proxy caveats — no self-invocation, no private/static methods.",
        },
        {
          id: "sc-49",
          title: "Cache abstraction backends",
          code: "// ConcurrentMapCacheManager (default in-memory) — fine for dev/test\n// CaffeineCacheManager — bounded, evicting, fast\n// RedisCacheManager — distributed",
          options: [
            "Only Redis",
            "Spring's cache abstraction is provider-agnostic — swap implementations by changing the CacheManager bean",
            "Just a map",
            "Tied to Hazelcast",
          ],
          answer: 1,
          explanation:
            "The cache abstraction (@Cacheable, @CachePut, @CacheEvict) decouples your code from the provider. Choose Caffeine for in-process, Redis for shared/distributed, etc.",
        },
        {
          id: "sc-50",
          title: "Spring Retry",
          code: "@EnableRetry\n@Retryable(value = TransientException.class, maxAttempts = 3, backoff = @Backoff(delay = 200))\nvoid call() { ... }",
          options: [
            "Not part of Spring",
            "spring-retry: declarative retries with backoff; pair with @Recover for fallback after exhausted attempts",
            "Same as Hystrix",
            "Removed",
          ],
          answer: 1,
          explanation:
            "spring-retry adds declarative retry/backoff. @Recover defines the fallback method if all retries fail. Same proxy caveats. For resilience-style (circuit breaker, bulkhead, etc.), use Resilience4j.",
        },
      ],
    },

    {
      id: "spring-boot",
      title: "Spring Boot",
      icon: "🍃",
      color: "#84cc16",
      blurb:
        "Auto-config, starters, profiles, actuator, MVC, WebFlux, testing.",
      questions: [
        {
          id: "sb-1",
          title: "@SpringBootApplication composition",
          code: "// @SpringBootApplication =\n//   @SpringBootConfiguration +\n//   @EnableAutoConfiguration +\n//   @ComponentScan",
          options: [
            "Just @Configuration",
            "Composite of 3 meta-annotations: config + auto-config + scan, anchored at the annotated class's package",
            "Same as @Component",
            "Only enables tests",
          ],
          answer: 1,
          explanation:
            "Place the @SpringBootApplication class at the ROOT of your package tree — component scanning starts there and goes down. Sibling packages are missed by default.",
        },
        {
          id: "sb-2",
          title: "Auto-configuration mechanism",
          code: "// Spring Boot scans META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports",
          options: [
            "Reflection magic",
            "Imports listed in a fixed file (formerly spring.factories) — each loaded conditionally via @Conditional* annotations",
            "Runtime AOP",
            "Annotation processor at compile time",
          ],
          answer: 1,
          explanation:
            "Boot's auto-config is just @Configuration classes loaded via @EnableAutoConfiguration. Each one has @ConditionalOnClass / OnMissingBean / OnProperty etc. to activate only when appropriate.",
        },
        {
          id: "sb-3",
          title: "Starters",
          code: "// spring-boot-starter-web pulls in: Spring MVC + Jackson + Tomcat + validation + logging",
          options: [
            "One library",
            "Starters are POM aggregators bringing a curated set of compatible deps — saves you from version-hell",
            "Source generators",
            "Boot-only language",
          ],
          answer: 1,
          explanation:
            "Each starter is a tiny POM with managed transitives. Adding one dep enables a whole stack. Underneath, the BOM (spring-boot-dependencies) handles version alignment.",
        },
        {
          id: "sb-4",
          title: "Embedded server choice",
          code: "// Default: Tomcat. Swap to Jetty/Undertow by excluding Tomcat dep + adding the other starter.",
          options: [
            "External Tomcat required",
            "Spring Boot embeds a servlet container; pick Tomcat (default), Jetty, or Undertow via dependency swap",
            "WAR only",
            "JSP required",
          ],
          answer: 1,
          explanation:
            "Embedded server = one runnable JAR, no external deploy. Tomcat default. Jetty for small footprint; Undertow for non-blocking. WAR packaging still possible if needed.",
        },
        {
          id: "sb-5",
          title: "application.properties vs application.yml",
          code: "# application.yml\nserver:\n  port: 8080\n  servlet:\n    context-path: /api",
          options: [
            "Different features",
            "Same property keys; YAML allows nesting/multi-doc; properties is flat key=value — pick by team preference",
            "YAML is faster",
            "Only one allowed",
          ],
          answer: 1,
          explanation:
            "Boot parses both. YAML is nicer for nested config and supports multiple profile docs in one file (--- separators). Properties is fine and simpler. Don't mix both for the same config.",
        },
        {
          id: "sb-6",
          title: "Profiles",
          code: "spring.profiles.active=dev\n# application-dev.yml overrides defaults",
          options: [
            "Affects compilation",
            "Activates profile-specific config files and @Profile beans for the running JVM — chosen at startup",
            "Same as @Conditional",
            "Profiles affect class loading",
          ],
          answer: 1,
          explanation:
            "Profiles select bean definitions and property overrides at startup. application-{profile}.{yml,properties} is automatically merged. Activate via env var, system property, command-line.",
        },
        {
          id: "sb-7",
          title: "Property precedence",
          code: "// Common order (high→low): cmd-line args > env vars > application.yml > defaults",
          options: [
            "All same",
            "Multiple property sources; command-line / env var typically win over file config — enables env-specific override without rebuild",
            "Only the file matters",
            "Properties cannot be overridden",
          ],
          answer: 1,
          explanation:
            "Boot ships ~17 documented sources with precedence. Crucially: env vars and -D / args override files. Lets you ship the same artifact to dev/test/prod and tweak via env.",
        },
        {
          id: "sb-8",
          title: "DevTools",
          code: "// spring-boot-devtools enables automatic restart, live reload, dev-friendly defaults",
          options: [
            "Required for production",
            "Dev-only convenience: hot restart on classpath changes, disabled caching, LiveReload — excluded from prod jars",
            "Compiler plugin",
            "Production profiler",
          ],
          answer: 1,
          explanation:
            "Devtools watches the classpath and restarts the app on changes. Tests run faster. NOT for production (the docs warn). Excluded automatically in Maven/Gradle packaged jars.",
        },
        {
          id: "sb-9",
          title: "Actuator basics",
          code: "management.endpoints.web.exposure.include=health,info,metrics,env",
          options: [
            "Adds a UI",
            "Production-ready endpoints over HTTP/JMX for health, info, metrics, env, heap dump, threads, etc.",
            "Logs only",
            "Removed in 3.x",
          ],
          answer: 1,
          explanation:
            "Actuator turns the running app into an observable service. /actuator/health, /metrics, /env, /info, /loggers, /heapdump, etc. Lock down exposure + secure with Spring Security.",
        },
        {
          id: "sb-10",
          title: "/actuator/health",
          code: "// Aggregates HealthIndicator beans: DB, disk, broker, custom",
          options: [
            "Static OK",
            "Composite: each indicator contributes UP/DOWN/OUT_OF_SERVICE; overall reflects the worst",
            "Always UP",
            "Only DB",
          ],
          answer: 1,
          explanation:
            "Custom HealthIndicator beans plug in automatically. Configure detail visibility (management.endpoint.health.show-details). Use 'liveness'/'readiness' probes for Kubernetes (Boot 2.3+).",
        },
        {
          id: "sb-11",
          title: "Micrometer + /metrics",
          code: 'MeterRegistry registry;\nregistry.counter("orders.placed").increment();',
          options: [
            "Manual logging",
            "Vendor-neutral metrics facade — meters exported to Prometheus, Datadog, CloudWatch via registries",
            "Replaces logging",
            "Only JVM metrics",
          ],
          answer: 1,
          explanation:
            "Micrometer is the metrics SPI Boot uses. Add a micrometer-registry-{vendor} starter and metrics flow to your backend. Built-in JVM/HTTP/DB metrics; add your domain meters.",
        },
        {
          id: "sb-12",
          title: "ApplicationRunner vs CommandLineRunner",
          code: "@Component class Init implements ApplicationRunner {\n  public void run(ApplicationArguments args) { ... }\n}",
          options: [
            "Identical",
            "Both run AFTER context is ready; ApplicationRunner gets parsed ApplicationArguments, CommandLineRunner gets raw String[]",
            "Run before context",
            "Replaces main",
          ],
          answer: 1,
          explanation:
            "Either runs at startup once context is ready. Use ApplicationRunner for typed args, CommandLineRunner for raw. Useful for migrations, smoke checks, dev fixtures.",
        },
        {
          id: "sb-13",
          title: "main(String[] args)",
          code: "public static void main(String[] args) {\n  SpringApplication.run(MyApp.class, args);\n}",
          options: [
            "Just a convention",
            "Boots the SpringApplication; args parsed into ApplicationArguments and merged into the Environment",
            "Required name 'main'",
            "Runs synchronously forever",
          ],
          answer: 1,
          explanation:
            "SpringApplication.run does context init, banner, listeners, then keeps the JVM running while the embedded server lives. Command-line args become properties (e.g., --server.port=9090).",
        },
        {
          id: "sb-14",
          title: "@RestController vs @Controller",
          code: "@RestController = @Controller + @ResponseBody",
          options: [
            "Identical",
            "@RestController returns bodies serialized via HttpMessageConverters (JSON); @Controller returns view names by default",
            "@Controller is REST",
            "@RestController is reactive",
          ],
          answer: 1,
          explanation:
            "Use @RestController for JSON/XML APIs. Use @Controller when rendering views (Thymeleaf/JSP) — return values are view names. Mix-and-match in the same app.",
        },
        {
          id: "sb-15",
          title: "@PathVariable vs @RequestParam",
          code: '@GetMapping("/users/{id}")\nUser get(@PathVariable long id, @RequestParam(required=false) String fields) { ... }',
          options: [
            "Same thing",
            "@PathVariable extracts URI path segments; @RequestParam extracts query string parameters (or form fields)",
            "Body only",
            "Headers only",
          ],
          answer: 1,
          explanation:
            "Path → identity / resource selectors. Query params → optional filters / pagination. Both are bound + converted via ConversionService.",
        },
        {
          id: "sb-16",
          title: "@RequestBody binding",
          code: '@PostMapping("/users")\nUser create(@RequestBody UserDto dto) { ... }',
          options: [
            "Reads URL",
            "Deserializes the HTTP request body via HttpMessageConverters (Jackson by default for JSON)",
            "Reads headers",
            "Only forms",
          ],
          answer: 1,
          explanation:
            "Spring picks a converter by Content-Type and the method's parameter type. Jackson is default for JSON. For 415 errors, check the request's Content-Type matches what a converter handles.",
        },
        {
          id: "sb-17",
          title: "ResponseEntity vs @ResponseBody",
          code: "ResponseEntity<User> get(...) { return ResponseEntity.status(201).body(u); }",
          options: [
            "Identical",
            "ResponseEntity gives full control over status + headers + body; @ResponseBody returns just body with default status",
            "ResponseEntity is reactive",
            "Use both together",
          ],
          answer: 1,
          explanation:
            "Use ResponseEntity when you need to customise status, headers, conditionals. For boring 200-with-body, just return the object (implicit @ResponseBody with @RestController).",
        },
        {
          id: "sb-18",
          title: "Validation failure",
          code: "@PostMapping void create(@Valid @RequestBody UserDto dto) {}",
          options: [
            "Returns 200 with errors",
            "Throws MethodArgumentNotValidException → default 400 response (customise via @ExceptionHandler / ProblemDetail)",
            "Returns 500",
            "Silently ignores",
          ],
          answer: 1,
          explanation:
            "Spring's default error response is well-formed JSON with field errors. Boot 3 + Spring 6 offer ProblemDetail (RFC 7807) for consistent error contracts.",
        },
        {
          id: "sb-19",
          title: "ProblemDetail (RFC 7807)",
          code: 'ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Invalid input");',
          options: [
            "Random JSON shape",
            "Standardised error response format introduced in Spring 6 / Boot 3 — type, title, status, detail, instance",
            "Removed",
            "Only for SOAP",
          ],
          answer: 1,
          explanation:
            "Boot 3 supports RFC 7807 ProblemDetail out of the box. Enable with spring.mvc.problemdetails.enabled=true. Consistent error responses across services.",
        },
        {
          id: "sb-20",
          title: "WebClient vs RestTemplate",
          code: "WebClient wc = WebClient.create();\nUser u = wc.get().uri(url).retrieve().bodyToMono(User.class).block();",
          options: [
            "Same",
            "RestTemplate: blocking, maintained-only mode; WebClient: reactive (Mono/Flux), blocking-compatible, recommended for new code",
            "WebClient only reactive",
            "RestTemplate is async",
          ],
          answer: 1,
          explanation:
            "RestTemplate is in maintenance mode. WebClient (from WebFlux) is the modern API — works in blocking apps via .block() and natively in reactive ones. Boot 3.2+ also adds RestClient (synchronous, fluent).",
        },
        {
          id: "sb-21",
          title: "Filter vs HandlerInterceptor",
          code: "// Filter (servlet level, before Spring) vs HandlerInterceptor (after dispatcher, knows about handler)",
          options: [
            "Same thing",
            "Filter is at servlet level (ALL traffic); Interceptor is Spring-MVC level (after handler mapping) — finer hooks like preHandle/postHandle/afterCompletion",
            "Both deprecated",
            "Filters only for security",
          ],
          answer: 1,
          explanation:
            "Filters wrap the whole servlet container (e.g. CharacterEncodingFilter). Interceptors operate within Spring MVC and have access to the handler. Pick by which abstraction layer you need.",
        },
        {
          id: "sb-22",
          title: "DispatcherServlet",
          code: "// Front controller: routes requests to handler methods via HandlerMapping + HandlerAdapter",
          options: [
            "Just a JSP",
            "Front Controller: receives all HTTP, picks a HandlerMapping, invokes via HandlerAdapter, resolves views/converters, handles exceptions",
            "Same as Servlet",
            "Replaces Tomcat",
          ],
          answer: 1,
          explanation:
            "DispatcherServlet is Spring MVC's heart. Boot auto-configures it. Customise via WebMvcConfigurer (no @EnableWebMvc unless you want to take over completely).",
        },
        {
          id: "sb-23",
          title: "Content negotiation",
          code: "GET /api/users/1 \nAccept: application/xml",
          options: [
            "Only JSON",
            "Spring picks the HttpMessageConverter based on Accept header (and parameter / extension if configured)",
            "Always XML",
            "Server decides",
          ],
          answer: 1,
          explanation:
            "Content negotiation can be Accept-header-based (default), URL-suffix-based (deprecated), or query-param-based. Configure via ContentNegotiationConfigurer. Add jackson-dataformat-xml to also support XML.",
        },
        {
          id: "sb-24",
          title: "CORS",
          code: '@CrossOrigin(origins = "https://example.com")\n@GetMapping("/api/data") String data() { ... }',
          options: [
            "Manual headers",
            "@CrossOrigin or global config (WebMvcConfigurer.addCorsMappings) tells Spring to emit/handle preflight + CORS headers",
            "Not supported",
            "Done by browser",
          ],
          answer: 1,
          explanation:
            "Per-controller @CrossOrigin or app-wide via WebMvcConfigurer.addCorsMappings. CORS errors are notoriously confusing — start with broad config in dev, tighten for prod.",
        },
        {
          id: "sb-25",
          title: "Customising Jackson",
          code: "// application.yml\nspring:\n  jackson:\n    serialization:\n      indent_output: true\n    property-naming-strategy: SNAKE_CASE",
          options: [
            "Only @Bean",
            "Boot exposes Jackson features as properties; for richer customisation, define an ObjectMapper @Bean or Jackson2ObjectMapperBuilderCustomizer",
            "Not customisable",
            "Removed",
          ],
          answer: 1,
          explanation:
            "Most common tweaks via spring.jackson.* properties. For complex modules (Java Time, Kotlin), Boot auto-registers if dependencies are present. Override with a custom Jackson2ObjectMapperBuilderCustomizer.",
        },
        {
          id: "sb-26",
          title: "Servlet vs Reactive stack",
          code: "// spring-boot-starter-web      → MVC, blocking, Servlet\n// spring-boot-starter-webflux  → reactive, Netty (default), Mono/Flux",
          options: [
            "Identical",
            "Two parallel stacks — pick ONE per app. WebFlux gives non-blocking I/O at the cost of programming-model complexity",
            "Both compatible at runtime",
            "Reactive is faster always",
          ],
          answer: 1,
          explanation:
            "MVC is Servlet-based (blocking). WebFlux is non-blocking (Netty by default). With virtual threads (Java 21+) blocking MVC scales much better — WebFlux is now mostly for true reactive needs.",
        },
        {
          id: "sb-27",
          title: "@WebMvcTest slice",
          code: "@WebMvcTest(UserController.class)\nclass UserControllerTest { ... }",
          options: [
            "Full app start",
            "Test slice: loads ONLY MVC infrastructure + the specified controller; mock collaborators with @MockBean",
            "Random scan",
            "Same as @SpringBootTest",
          ],
          answer: 1,
          explanation:
            "@WebMvcTest is a focused slice — fast, no services/repos started. Pair with @MockBean for collaborators and MockMvc for request/response. Counterparts: @DataJpaTest, @JsonTest, @WebFluxTest.",
        },
        {
          id: "sb-28",
          title: "@SpringBootTest",
          code: "@SpringBootTest\nclass IntegrationTest { ... }",
          options: [
            "Test slice",
            "Loads the FULL application context (configurable: NONE, MOCK, RANDOM_PORT) — used for integration tests",
            "Tiny scope",
            "Removed",
          ],
          answer: 1,
          explanation:
            "@SpringBootTest spins the whole app — slow but realistic. webEnvironment=RANDOM_PORT starts an actual server for HTTP integration. Combine with Testcontainers for real DB.",
        },
        {
          id: "sb-29",
          title: "@MockBean",
          code: "@MockBean UserRepository repo;",
          options: [
            "Same as @Mock",
            "Adds/replaces the bean in the ApplicationContext with a Mockito mock — collaborators are stubbed in the running context",
            "Compile error",
            "Only in unit tests",
          ],
          answer: 1,
          explanation:
            "@MockBean works WITH the Spring context, replacing real beans with mocks. @Mock is plain Mockito (no Spring). Be aware: each @MockBean resets the context cache → slower tests.",
        },
        {
          id: "sb-30",
          title: "Testcontainers",
          code: '@Container static PostgreSQLContainer<?> pg = new PostgreSQLContainer<>("postgres:16");',
          options: [
            "External tool",
            "Library that boots real services (Postgres, Kafka, Redis) in Docker for tests — true integration without mocks",
            "Pure JVM",
            "Only for Docker users",
          ],
          answer: 1,
          explanation:
            "Testcontainers + Boot 3.1+ has first-class support (@ServiceConnection, @TestcontainersServiceConnection). Integration tests against a real DB without polluting your machine. Fast with reused containers.",
        },
        {
          id: "sb-31",
          title: "Layered jars / executable jar",
          code: "java -jar app.jar // works because of Spring Boot Loader",
          options: [
            "Standard jar",
            "Boot jars are 'fat' jars with nested BOOT-INF/lib + a custom Launcher; layered jars optimise Docker layer caching",
            "Cannot run with java -jar",
            "Same as WAR",
          ],
          answer: 1,
          explanation:
            "Boot uses a custom launcher to load nested jars (a normal Java limitation otherwise). Layered jar tooling (Boot 2.3+) splits dependencies, snapshots, classes, resources into separate Docker layers.",
        },
        {
          id: "sb-32",
          title: "Native image with GraalVM",
          code: "// Spring Boot 3 + Native: AOT-compiled binary, fast startup, low memory",
          options: [
            "Same as JVM",
            "Boot 3 supports GraalVM Native Image: AOT compiles the app to a static binary — milliseconds startup, smaller memory; some reflection restrictions",
            "Only Quarkus",
            "Removed",
          ],
          answer: 1,
          explanation:
            "Native images need ahead-of-time analysis — reflection/proxies/resources must be hinted. Boot 3 generates hints during build. Tradeoff: long build, faster startup, lower throughput than JVM.",
        },
        {
          id: "sb-33",
          title: "Jakarta vs javax (Boot 3)",
          code: "// Spring Boot 3 / Spring 6 require Java 17+ and migrated to jakarta.* packages",
          options: [
            "Identical",
            "Jakarta EE 9+ renamed javax.* → jakarta.* (Servlet, JPA, Validation, JSR-250) — Boot 3 follows; libraries needed jakarta-compatible versions",
            "Java 11 only",
            "Reverted",
          ],
          answer: 1,
          explanation:
            "The big Boot 3 migration. javax.persistence → jakarta.persistence, javax.servlet → jakarta.servlet, etc. Third-party libs and your imports all need updating.",
        },
        {
          id: "sb-34",
          title: "Spring Boot logging",
          code: "// Default backend: Logback. Logging facade: SLF4J.",
          options: [
            "java.util.logging",
            "SLF4J + Logback by default; Log4j2 swappable via excluding spring-boot-starter-logging and adding log4j2 starter",
            "Plain System.out",
            "No logging",
          ],
          answer: 1,
          explanation:
            "Boot uses SLF4J as the API and Logback as the implementation. Configure via application.properties (logging.level.*), or supply logback-spring.xml for advanced needs.",
        },
        {
          id: "sb-35",
          title: "Spring profiles in YAML",
          code: "spring:\n  config:\n    activate:\n      on-profile: dev\ndb:\n  url: jdbc:h2:mem:dev\n---\nspring:\n  config:\n    activate:\n      on-profile: prod\ndb:\n  url: jdbc:postgresql://prod",
          options: [
            "Compile error",
            "Multi-document YAML with profile-specific blocks (Boot 2.4+ uses on-profile syntax; older boot used 'spring.profiles')",
            "Always merged",
            "Always overridden",
          ],
          answer: 1,
          explanation:
            "Boot 2.4 reworked profile-specific config (config trees, on-profile, on-cloud-platform). One YAML can hold all variants — selected by active profiles.",
        },
        {
          id: "sb-36",
          title: "Externalising secrets",
          code: "// Don't store secrets in application.properties\n// Use env vars, Vault, AWS Secrets Manager, k8s secrets",
          options: [
            "Commit them",
            "Use externalised secret stores; Spring Cloud Config / Vault / AWS Secrets Manager integrations exist",
            "Hardcode them",
            "Encrypt in code",
          ],
          answer: 1,
          explanation:
            "Never commit secrets. Use environment variables (already overrides Boot props), Vault, AWS/GCP/Azure secret stores. Spring Cloud Config / Spring Cloud AWS provide bindings.",
        },
        {
          id: "sb-37",
          title: "@EntityScan vs @ComponentScan",
          code: '@EntityScan("com.acme.domain")\n@SpringBootApplication class App {}',
          options: [
            "Same",
            "@ComponentScan finds @Component beans; @EntityScan tells JPA where to find @Entity classes — useful when entities live outside the main package",
            "Replaces @SpringBootApplication",
            "Always required",
          ],
          answer: 1,
          explanation:
            "When entities aren't under your main application package, JPA won't see them. @EntityScan tells the EntityManager where to look. Same for @EnableJpaRepositories('com.acme.repo').",
        },
        {
          id: "sb-38",
          title: "SpringApplicationBuilder",
          code: 'new SpringApplicationBuilder(MyApp.class)\n  .profiles("dev")\n  .bannerMode(Banner.Mode.OFF)\n  .run(args);',
          options: [
            "Useless",
            "Fluent builder for SpringApplication — useful for parent/child contexts, customising banner/profiles before run",
            "Removed",
            "Replaces main",
          ],
          answer: 1,
          explanation:
            "SpringApplicationBuilder offers fluent customisation: profiles, banner, sources, parent contexts. Powerful for non-trivial bootstrapping.",
        },
        {
          id: "sb-39",
          title: "Failure analyzers",
          code: "// On startup failure, Boot prints a structured 'description / action' message",
          options: [
            "Generic stack trace",
            "FailureAnalyzer beans translate exceptions to human-friendly explanations + remediation — extensible",
            "Disabled by default",
            "Only for tests",
          ],
          answer: 1,
          explanation:
            "When you see 'APPLICATION FAILED TO START' with a nice description, it's a FailureAnalyzer at work. Examples: port-in-use, missing-bean, circular-dep. You can add your own.",
        },
        {
          id: "sb-40",
          title: "BootstrapContext",
          code: "// Pre-context phase (Spring Boot 2.4+) for early lookups, e.g. ConfigData",
          options: [
            "Replaces ApplicationContext",
            "Lightweight pre-init context used internally (ConfigData, encryption) before the full ApplicationContext is built",
            "User-facing API",
            "Removed",
          ],
          answer: 1,
          explanation:
            "Mostly an internal implementation detail. Allows ConfigDataLoader (cloud config, vault) to participate before normal beans. App code rarely interacts with it directly.",
        },
        {
          id: "sb-41",
          title: "@AutoConfigureBefore / @AutoConfigureAfter",
          code: "@Configuration\n@AutoConfigureAfter(DataSourceAutoConfiguration.class)\nclass MyConfig {}",
          options: [
            "No effect",
            "Hints for ordering of auto-configurations — needed when one depends on another's beans being defined first",
            "Replaces @Order",
            "Compile error",
          ],
          answer: 1,
          explanation:
            "Spring's auto-config order matters when conditional decisions depend on other configs. Don't use in app code unless you're writing a starter; use @DependsOn for direct bean ordering.",
        },
        {
          id: "sb-42",
          title: "Banner customisation",
          code: "// banner.txt in classpath replaces the default Spring banner\n// spring.banner.location=banner.txt",
          options: [
            "Cannot be changed",
            "Drop banner.txt into resources or set Banner.Mode.OFF/CONSOLE/LOG via SpringApplication",
            "Removed",
            "Image only",
          ],
          answer: 1,
          explanation:
            "Banner is cosmetic. Replace with banner.txt (supports placeholders like ${spring-boot.version}) or banner.gif/jpg/png for ASCII-art version. Disable in production for clean logs.",
        },
        {
          id: "sb-43",
          title: "Observability (Spring Boot 3)",
          code: "// Micrometer Observation API replaces Sleuth; integrates with Tracing + Metrics + Logs",
          options: [
            "Same as Sleuth",
            "Boot 3 standardised on Micrometer Observation: unified tracing (OpenTelemetry / Brave) + metrics + structured logs",
            "Removed",
            "Only for k8s",
          ],
          answer: 1,
          explanation:
            "Spring Cloud Sleuth merged into Micrometer Tracing. Add micrometer-tracing-bridge-otel for OpenTelemetry, OR -brave for Zipkin. Auto-propagation across WebClient/RestClient and async barriers.",
        },
        {
          id: "sb-44",
          title: "Properties via @ConfigurationProperties",
          code: '@ConfigurationProperties("mail") @Validated\nrecord MailProps(@NotBlank String host, int port) {}',
          options: [
            "Same as @Value",
            "Type-safe binding of grouped config; with @Validated, JSR-380 violations fail startup",
            "Only field injection",
            "Strings only",
          ],
          answer: 1,
          explanation:
            "@ConfigurationProperties on records is the clean modern style. Add to @EnableConfigurationProperties or use @ConfigurationPropertiesScan. Catches misconfig at startup (fail-fast).",
        },
        {
          id: "sb-45",
          title: "Lazy initialization mode",
          code: "spring.main.lazy-initialization=true",
          options: [
            "Default",
            "Boot 2.2+: lazily init all beans → faster startup, but errors surface only on first use",
            "Speeds tests only",
            "Removed",
          ],
          answer: 1,
          explanation:
            "Global lazy mode trades startup speed for late error detection. Great for dev/cli tools. In production, eager init catches config bugs early — generally preferred.",
        },
        {
          id: "sb-46",
          title: "Graceful shutdown",
          code: "server.shutdown=graceful\nspring.lifecycle.timeout-per-shutdown-phase=30s",
          options: [
            "Force kill",
            "Boot 2.3+: stop accepting new requests, drain in-flight, then stop — orderly shutdown for k8s rolling deploys",
            "Same as exit(0)",
            "Removed",
          ],
          answer: 1,
          explanation:
            "Graceful shutdown gives in-flight requests time to finish before the JVM exits. Combine with k8s preStop hook + readiness probe flipping to OUT_OF_SERVICE for zero-downtime rolling updates.",
        },
        {
          id: "sb-47",
          title: "Application events",
          code: "@EventListener\nvoid onReady(ApplicationReadyEvent e) {}",
          options: [
            "Custom only",
            "Boot emits lifecycle events: ApplicationStarting, ContextRefreshed, ApplicationStarted, ApplicationReady, ApplicationFailed — hook for warmup",
            "Same as @PostConstruct",
            "Removed",
          ],
          answer: 1,
          explanation:
            "Lifecycle events give you precisely-timed hooks. ApplicationReadyEvent is ideal for 'context fully built, server up' work like warm-up calls, registration.",
        },
        {
          id: "sb-48",
          title: "RestClient (Boot 3.2+)",
          code: "RestClient client = RestClient.create();\nUser u = client.get().uri(url).retrieve().body(User.class);",
          options: [
            "Same as RestTemplate",
            "Modern synchronous fluent client — succinct API similar to WebClient but blocking; preferred for new sync code in Boot 3.2+",
            "Only reactive",
            "Removed",
          ],
          answer: 1,
          explanation:
            "RestClient is the new fluent SYNC HTTP client. Replaces RestTemplate ergonomically while staying blocking. Use RestTemplate only for legacy; RestClient for new sync; WebClient when you need reactive.",
        },
        {
          id: "sb-49",
          title: "Tomcat thread pool tuning",
          code: "server.tomcat.threads.max=200\nserver.tomcat.threads.min-spare=10",
          options: [
            "Unbounded",
            "Bounded by 'max'; tune for expected concurrency. With virtual threads, set server.tomcat.threads.max=lots OR enable virtual threads",
            "Auto only",
            "Single-threaded",
          ],
          answer: 1,
          explanation:
            "Tomcat has a fixed worker pool (default ~200). For blocking I/O, that's your concurrency ceiling. Boot 3.2+ + Java 21: spring.threads.virtual.enabled=true makes Tomcat serve each request on a virtual thread.",
        },
        {
          id: "sb-50",
          title: "Virtual threads for Spring (Java 21)",
          code: "spring.threads.virtual.enabled=true",
          options: [
            "No effect",
            "Boot 3.2+: HTTP request handling, @Async, scheduling use VIRTUAL threads — high concurrency for blocking I/O",
            "Reactive only",
            "Requires WebFlux",
          ],
          answer: 1,
          explanation:
            "Single property enables virtual threads for the embedded server, @Async, and TaskScheduler. Blocking MVC scales like reactive code for I/O-bound workloads with familiar programming model.",
        },
        {
          id: "sb-51",
          title: "Spring Security default",
          code: "// Adding spring-boot-starter-security: ALL endpoints require auth by default",
          options: [
            "Public by default",
            "Auto-config locks down everything; default user (random password printed at startup) — override SecurityFilterChain",
            "Disabled",
            "Only basic auth",
          ],
          answer: 1,
          explanation:
            "Add the starter → instant 401. Define a SecurityFilterChain @Bean to customise. The 'random password' message helps in dev; replace with proper users / OAuth / JWT for real apps.",
        },
        {
          id: "sb-52",
          title: "SecurityFilterChain @Bean",
          code: '@Bean SecurityFilterChain chain(HttpSecurity http) throws Exception {\n  return http.authorizeHttpRequests(a -> a.requestMatchers("/public/**").permitAll().anyRequest().authenticated())\n    .csrf(c -> c.disable()).build();\n}',
          options: [
            "Old WebSecurityConfigurerAdapter",
            "Modern lambda-DSL SecurityFilterChain (Spring Security 5.7+) — replaces the deprecated adapter class",
            "Only XML",
            "Same as @EnableWebSecurity",
          ],
          answer: 1,
          explanation:
            "Modern config style: declare a SecurityFilterChain @Bean. Multiple chains can coexist (e.g. one for API, one for actuator). The adapter approach is deprecated.",
        },
        {
          id: "sb-53",
          title: "JWT vs Session",
          code: "// Session: server stores state, cookie has session id\n// JWT: token holds claims, signed; stateless server",
          options: [
            "Same thing",
            "Sessions = server-side state, easy revoke; JWT = stateless, scalable, but revocation is harder",
            "JWT always better",
            "Session always better",
          ],
          answer: 1,
          explanation:
            "Session: easy revoke (delete server-side), works behind sticky sessions or shared store. JWT: scales statelessly but revocation needs a deny list / short TTL + refresh. Pick by needs.",
        },
        {
          id: "sb-54",
          title: "OAuth2 Resource Server",
          code: "spring.security.oauth2.resourceserver.jwt.issuer-uri=https://idp/realm",
          options: [
            "Manual JWT parsing",
            "spring-boot-starter-oauth2-resource-server + that property — Boot validates JWTs from the issuer automatically",
            "Only for SSO",
            "Removed",
          ],
          answer: 1,
          explanation:
            "Configure issuer URI; Boot fetches JWKS, validates signatures, expirations, audiences. Map authorities via JwtAuthenticationConverter. Production-grade JWT with minimal code.",
        },
        {
          id: "sb-55",
          title: "CSRF default",
          code: "// Spring Security enables CSRF for non-GET endpoints by default",
          options: [
            "Disabled",
            "Enabled by default; disable only for stateless APIs (token in header is not CSRF-vulnerable)",
            "Required for GET",
            "JWT-only protection",
          ],
          answer: 1,
          explanation:
            "Browser-based session apps need CSRF protection. Pure JSON APIs authenticated via Authorization header don't (token isn't auto-sent by the browser). Disable thoughtfully, not by default.",
        },
        {
          id: "sb-56",
          title: "Logging level configuration",
          code: "logging.level.root=INFO\nlogging.level.com.acme=DEBUG\nlogging.level.org.hibernate.SQL=DEBUG",
          options: [
            "Recompile required",
            "Hierarchical per-package log levels via properties — no code change; runtime change via /actuator/loggers",
            "Single level only",
            "Code-only",
          ],
          answer: 1,
          explanation:
            "Boot's logging config is property-driven. /actuator/loggers endpoint lets you change levels at runtime without restart — critical for prod debugging.",
        },
        {
          id: "sb-57",
          title: "Profiles for testing",
          code: '@SpringBootTest\n@ActiveProfiles("test")\nclass MyTest {}',
          options: [
            "Removed",
            "@ActiveProfiles binds profile(s) for the test ApplicationContext; pair with application-test.properties",
            "Only main app",
            "Cannot be set",
          ],
          answer: 1,
          explanation:
            "Tests can activate a 'test' profile to swap out real services (mail, payment) with stubs. Combined with @DynamicPropertySource for Testcontainers props.",
        },
        {
          id: "sb-58",
          title: "Spring Boot Maven plugin",
          code: "<plugin>\n  <groupId>org.springframework.boot</groupId>\n  <artifactId>spring-boot-maven-plugin</artifactId>\n</plugin>",
          options: [
            "Optional decoration",
            "Repackages the JAR into Boot's executable layout; provides goals like spring-boot:run, build-image, layered jars",
            "Compiles tests",
            "Replaces Maven",
          ],
          answer: 1,
          explanation:
            "Without the plugin, java -jar wouldn't find your nested deps. Also provides build-image (Buildpacks-based Docker image), useful goals, and reproducible builds.",
        },
        {
          id: "sb-59",
          title: "@SpringBootTest webEnvironment",
          code: "@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)\nclass ApiTest { @LocalServerPort int port; }",
          options: [
            "Always 8080",
            "MOCK (default) — mock servlet; RANDOM_PORT — real server on random port; DEFINED_PORT — configured port; NONE — no web",
            "Cannot configure",
            "Always reactive",
          ],
          answer: 1,
          explanation:
            "RANDOM_PORT spins up a real HTTP server — best for HTTP integration tests + TestRestTemplate/WebTestClient. MOCK is faster and what @WebMvcTest uses under the hood.",
        },
        {
          id: "sb-60",
          title: "ApplicationContextRunner for fine-grained tests",
          code: 'new ApplicationContextRunner()\n  .withConfiguration(AutoConfigurations.of(MyAuto.class))\n  .withPropertyValues("x=y")\n  .run(ctx -> assertThat(ctx).hasSingleBean(MyBean.class));',
          options: [
            "Same as @SpringBootTest",
            "Lightweight programmatic context for testing AUTO-CONFIG conditions — fast, repeatable, ideal for starter authors",
            "Only for production",
            "Removed",
          ],
          answer: 1,
          explanation:
            "ApplicationContextRunner (and WebApplicationContextRunner) test auto-config behaviour cheaply — flipping properties / classpath conditions / beans. The right tool when writing auto-configurations / starters.",
        },
        {
          id: "sb-61",
          title: "@ConfigurationPropertiesScan",
          code: '@SpringBootApplication\n@ConfigurationPropertiesScan("com.acme.config")\nclass App {}',
          options: [
            "Same as @ComponentScan",
            "Scans for @ConfigurationProperties classes — no need to @EnableConfigurationProperties per class",
            "Removed",
            "Compile only",
          ],
          answer: 1,
          explanation:
            "Convenience for projects with many @ConfigurationProperties classes — point @ConfigurationPropertiesScan at the package and they're all picked up.",
        },
        {
          id: "sb-62",
          title: "Docker image with Buildpacks",
          code: "./mvnw spring-boot:build-image",
          options: [
            "Need a Dockerfile",
            "Spring Boot plugin can build a layered, optimised OCI image with Buildpacks — no Dockerfile needed",
            "Tomcat only",
            "Removed",
          ],
          answer: 1,
          explanation:
            "build-image uses Paketo Buildpacks to produce a runnable container image with sensible defaults, layer optimisation, and JRE base. Customise via plugin config; jib is an alternative.",
        },
        {
          id: "sb-63",
          title: "Sensitive actuator endpoints",
          code: "management.endpoints.web.exposure.include=*\nmanagement.endpoint.env.show-values=NEVER",
          options: [
            "Always exposed",
            "Expose carefully — many endpoints leak env, beans, threads; secure via Spring Security and hide sensitive values",
            "Auto secured",
            "Removed",
          ],
          answer: 1,
          explanation:
            "Be careful what you expose. /env, /heapdump, /loggers can leak secrets or be abused. Lock down via security + selective exposure + show-values=NEVER on env.",
        },
        {
          id: "sb-64",
          title: "Spring Boot startup analyzer",
          code: "spring.context.startup.enabled=true\n// + /actuator/startup",
          options: [
            "No such feature",
            "Records context startup steps (durations, dependencies) — /actuator/startup exposes them; great for diagnosing slow startup",
            "Replaces logs",
            "Only in tests",
          ],
          answer: 1,
          explanation:
            "Boot's startup tracker gives you a timeline of bean creation and refresh phases. Pinpoint which beans cost time at startup. Pairs with native-image hints discussions.",
        },
        {
          id: "sb-65",
          title: "ApplicationContextInitializer",
          code: "class Init implements ApplicationContextInitializer<ConfigurableApplicationContext> {\n  public void initialize(ConfigurableApplicationContext ctx) { /* env tweaks */ }\n}",
          options: [
            "Random hook",
            "Called BEFORE refresh — last chance to mutate Environment, add property sources, register listeners",
            "Replaces main",
            "Removed",
          ],
          answer: 1,
          explanation:
            "Initializers run before context refresh. Register via spring.factories / META-INF/spring.factories or SpringApplicationBuilder.initializers(). Useful for advanced bootstrapping — beyond what properties allow.",
        },
      ],
    },

    {
      id: "spring-data",
      title: "Spring Data & JPA",
      icon: "🗄️",
      color: "#0ea5e9",
      blurb:
        "Repositories, JPA mappings, fetch strategies, transactions, queries, locking.",
      questions: [
        {
          id: "sd2-1",
          title: "Repository hierarchy",
          code: "// Repository → CrudRepository → PagingAndSortingRepository → JpaRepository",
          options: [
            "All identical",
            "Marker → CRUD → +paging/sorting → +JPA-specific (flush, batch, getOne); pick the lowest that fits",
            "Reverse order",
            "Only one interface",
          ],
          answer: 1,
          explanation:
            "Pick the smallest interface that matches your needs. JpaRepository is most common but couples you to JPA. ListCrudRepository/ListPagingAndSortingRepository (Boot 3) return List instead of Iterable.",
        },
        {
          id: "sd2-2",
          title: "@Entity essentials",
          code: "@Entity\nclass User {\n  @Id @GeneratedValue Long id;\n  String name;\n}",
          options: [
            "Anything works",
            "Class must have @Entity + @Id; default constructor (no-args, at least package-private); typically a setter or field access for the ID",
            "Must be final",
            "ID type must be String",
          ],
          answer: 1,
          explanation:
            "JPA needs a no-args constructor (it instantiates entities reflectively) and a managed ID. Final classes / final fields cause issues. Records can be entity-LIKE projections but not @Entity (until JPA fully embraces them).",
        },
        {
          id: "sd2-3",
          title: "@Id generation strategies",
          code: "@Id @GeneratedValue(strategy = GenerationType.IDENTITY) Long id;",
          options: [
            "All identical",
            "IDENTITY (DB auto-increment, but disables JDBC batch), SEQUENCE (preferred for Postgres/Oracle, batchable), AUTO (provider chooses), TABLE (rare, slow)",
            "Only IDENTITY works",
            "SEQUENCE is for MySQL",
          ],
          answer: 1,
          explanation:
            "IDENTITY = column auto-increment; cheap but Hibernate can't batch inserts (needs the generated ID immediately). SEQUENCE = DB sequence (Postgres, Oracle) — supports allocationSize for batched ID assignment, enables JDBC batching.",
        },
        {
          id: "sd2-4",
          title: "@OneToMany — owning side",
          code: "// Bidirectional. Default cascade: NONE",
          options: [
            "Owning side has mappedBy",
            "INVERSE side has mappedBy; OWNING side has the @JoinColumn (or default FK column). Mutations to the owning side persist the relation",
            "Both sides own",
            "Always cascade",
          ],
          answer: 1,
          explanation:
            'JPA needs an owning side for the foreign key. In @OneToMany(mappedBy="user") on User, the Order side OWNS the FK. Forgetting to set both sides is a common cause of orphan records / NPEs in tests.',
        },
        {
          id: "sd2-5",
          title: "FetchType.LAZY vs EAGER",
          code: "@OneToMany(fetch = FetchType.LAZY)",
          options: [
            "Both same",
            "LAZY (default for *ToMany): load on access; EAGER (default for *ToOne): load immediately — EAGER often hurts perf (N+1)",
            "EAGER faster always",
            "LAZY always wrong",
          ],
          answer: 1,
          explanation:
            "Prefer LAZY by default — fetch what you need via JOIN FETCH / @EntityGraph. *ToOne EAGER seems harmless but adds joins to every query. Watch out for LazyInitializationException outside the session.",
        },
        {
          id: "sd2-6",
          title: "N+1 problem",
          code: "// SELECT * FROM users           -- 1 query\n// for each user: SELECT * FROM orders WHERE user_id = ?  -- N queries",
          options: [
            "Optimal",
            "Anti-pattern: 1 query returns N rows, accessing a lazy association issues N more queries. Fix: JOIN FETCH or @EntityGraph",
            "Sharding bug",
            "Index missing",
          ],
          answer: 1,
          explanation:
            "N+1 is the JPA performance killer. Detect via SQL logs. Fix with: JOIN FETCH (one-shot loading), @EntityGraph, batch-size hint, or DTO projection. Beware multi-bag fetch (MultipleBagFetchException).",
        },
        {
          id: "sd2-7",
          title: "JOIN FETCH",
          code: '@Query("SELECT u FROM User u JOIN FETCH u.orders WHERE u.id = :id")',
          options: [
            "Same as JOIN",
            "JOIN FETCH eagerly loads the association in a SINGLE query — defeats N+1 for that path",
            "Always slower",
            "Only with native SQL",
          ],
          answer: 1,
          explanation:
            "JOIN gives the join clause; JOIN FETCH ALSO populates the association. Use to selectively eager-load. Caveat: can't be combined with pagination (Hibernate warns + memory-paginates).",
        },
        {
          id: "sd2-8",
          title: "@EntityGraph",
          code: '@EntityGraph(attributePaths = {"orders", "orders.items"})\nList<User> findAll();',
          options: [
            "Removed",
            "Declarative fetch plan on the query — equivalent to JOIN FETCH but cleaner and reusable",
            "Same as @Query",
            "Slower",
          ],
          answer: 1,
          explanation:
            "@EntityGraph declares which associations to eagerly fetch. Cleaner than custom JPQL with JOIN FETCH. Supports nested paths. Apply to derived queries too.",
        },
        {
          id: "sd2-9",
          title: "Derived query method",
          code: "List<User> findByLastNameAndAgeGreaterThan(String last, int age);",
          options: [
            "Magic",
            "Spring Data parses the method name into a query at startup — fast for simple cases; use @Query for complex",
            "Reflection at runtime",
            "JDBC only",
          ],
          answer: 1,
          explanation:
            "Method-name conventions: findBy, And, Or, GreaterThan, In, Between, Like, OrderBy, ... Validated at startup (fail-fast). Beyond ~3 conditions, switch to @Query for readability.",
        },
        {
          id: "sd2-10",
          title: "Pageable + Page",
          code: "Page<User> findByName(String name, Pageable pageable);",
          options: [
            "Same as List",
            "Pageable: page+size+sort; returns Page (with totalElements). Slice avoids the extra COUNT query",
            "Doesn't paginate",
            "Sort only",
          ],
          answer: 1,
          explanation:
            "Pageable drives LIMIT/OFFSET + ORDER BY. Page runs a COUNT query for totalElements (slower but full info). Slice skips COUNT (hasNext via fetch+1). For infinite scroll, Slice is enough.",
        },
        {
          id: "sd2-11",
          title: "@Modifying queries",
          code: '@Modifying @Transactional\n@Query("UPDATE User u SET u.active = false WHERE u.lastLogin < :cutoff")\nint deactivate(@Param("cutoff") Instant cutoff);',
          options: [
            "Same as derived query",
            "Required for UPDATE/DELETE JPQL — also flushClear options to clear persistence context (else stale entities)",
            "Removed",
            "Throws",
          ],
          answer: 1,
          explanation:
            "@Modifying is required for write JPQL. Bypasses entity lifecycle (no cascades, no callbacks). Use flushAutomatically=true and clearAutomatically=true if the same context will read entities back.",
        },
        {
          id: "sd2-12",
          title: "Cascade types",
          code: "@OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)",
          options: [
            "All same",
            "PERSIST, MERGE, REMOVE, REFRESH, DETACH, ALL — what operations propagate to associations. orphanRemoval deletes children removed from collection",
            "Always ALL",
            "Disabled",
          ],
          answer: 1,
          explanation:
            "Cascade chooses what flows along the association. ALL is convenient but dangerous (e.g. cascading REMOVE through a User can delete more than intended). orphanRemoval=true cleans up children when removed from parent's collection.",
        },
        {
          id: "sd2-13",
          title: "@Version optimistic locking",
          code: "@Version Long version;",
          options: [
            "DB column for fun",
            "Each update increments version + checks via WHERE; conflict throws OptimisticLockingFailureException — retry or surface to user",
            "Required by JPA",
            "Same as @Lock",
          ],
          answer: 1,
          explanation:
            "Optimistic locking detects concurrent updates without DB locks. Hibernate adds 'WHERE version = ?' to UPDATEs; mismatch = someone changed in between. Idiomatic for low-contention domains.",
        },
        {
          id: "sd2-14",
          title: "@Lock pessimistic",
          code: '@Lock(LockModeType.PESSIMISTIC_WRITE)\n@Query("SELECT a FROM Account a WHERE a.id = :id")\nAccount lock(@Param("id") long id);',
          options: [
            "Same as @Version",
            "Acquires DB row lock (SELECT ... FOR UPDATE) — strong protection at concurrency cost; use for hot rows where retries are unacceptable",
            "Replaces @Transactional",
            "Removed",
          ],
          answer: 1,
          explanation:
            "Pessimistic locks reduce throughput but eliminate retries on hot rows. Use sparingly. Always with timeout (javax.persistence.lock.timeout) to avoid hangs.",
        },
        {
          id: "sd2-15",
          title: "Persistence Context",
          code: "// First-level cache: identity map of managed entities inside a tx/session",
          options: [
            "L2 cache",
            "First-level cache + identity map; tracks managed entities and dirty-checks them on flush",
            "Database",
            "Process-wide",
          ],
          answer: 1,
          explanation:
            "Persistence Context (a.k.a. session) is per-transaction. Dirty-checking compares current vs loaded state on flush/commit and issues UPDATEs. Detached entities lose the context — you must merge to reattach.",
        },
        {
          id: "sd2-16",
          title: "save vs persist vs merge",
          code: "// repo.save(entity)  -> persist if new, merge if detached\n// em.persist(entity) -> only for transient (no id)\n// em.merge(entity)   -> for detached; returns the managed copy",
          options: [
            "All identical",
            "Different semantics: persist for new, merge for detached; save abstracts both but can be surprising for detached",
            "save is slowest",
            "merge is for tests",
          ],
          answer: 1,
          explanation:
            "save() picks persist (if id null / @Version null) or merge (otherwise). Subtle: merge returns the managed copy; if you continue mutating the parameter, your changes are lost. Use the returned object.",
        },
        {
          id: "sd2-17",
          title: "LazyInitializationException",
          code: "User u = repo.findById(id).get();\n// outside transaction:\nu.getOrders().forEach(...); // BOOM",
          options: [
            "JPA limitation",
            "Touching a lazy association outside an active session throws LIE; fix: load it inside the session (JOIN FETCH, @EntityGraph) or use Open-Session-In-View carefully",
            "Database error",
            "Bug in Hibernate",
          ],
          answer: 1,
          explanation:
            "Lazy proxies need an active session. Default Boot enables Open-Session-In-View (spring.jpa.open-in-view=true) which hides LIE but causes other issues. Better: fetch what you need in the service layer.",
        },
        {
          id: "sd2-18",
          title: "Open-Session-In-View",
          code: "spring.jpa.open-in-view=true  # default in Spring Boot",
          options: [
            "Best practice",
            "Anti-pattern in many cases: keeps session open through the view rendering — hides LIE but causes hidden N+1 and long-held DB connections",
            "Mandatory",
            "Speeds up queries",
          ],
          answer: 1,
          explanation:
            "OSIV is convenient in tutorials but leaks session lifetime into the controller layer. In production, prefer false: design your service layer to return everything you need (DTOs) eagerly within a transaction.",
        },
        {
          id: "sd2-19",
          title: "DTO projection",
          code: "interface UserSummary { String getName(); int getOrderCount(); }\nList<UserSummary> findBy...();",
          options: [
            "Slower than entities",
            "Returns lightweight projections (interface or class) — selects fewer columns, no entity overhead, cleaner API responses",
            "Same as entity",
            "Only for native queries",
          ],
          answer: 1,
          explanation:
            "Projections avoid loading whole entities. Spring Data supports interface projections (closed = best, opened with SpEL), class projections (records!), dynamic projections via generic type parameter.",
        },
        {
          id: "sd2-20",
          title: "Native SQL",
          code: '@Query(value = "SELECT * FROM users WHERE name = :n", nativeQuery = true)\nList<User> findRaw(@Param("n") String n);',
          options: [
            "Same as JPQL",
            "Bypasses JPQL — direct DB SQL. Useful for vendor-specific features, performance tweaks; but ties you to that DB",
            "Removed",
            "Reactive only",
          ],
          answer: 1,
          explanation:
            "JPQL is portable but limited. nativeQuery lets you use ANY SQL — CTEs, window functions, vendor extensions. Cost: portability + sometimes manual mapping for non-entity results.",
        },
        {
          id: "sd2-21",
          title: "Specifications",
          code: 'Specification<User> active = (root, q, cb) -> cb.equal(root.get("active"), true);\nrepo.findAll(active.and(byCountry("IN")));',
          options: [
            "Removed",
            "Type-safe dynamic queries via Criteria API; composable predicates — good for complex search filters",
            "Same as derived",
            "Native only",
          ],
          answer: 1,
          explanation:
            "JpaSpecificationExecutor lets you build dynamic queries programmatically. Composable (and/or/not). For very dynamic UIs (multi-filter screens), preferred over building JPQL strings.",
        },
        {
          id: "sd2-22",
          title: "Second-level cache",
          code: "@Cacheable @Entity class Reference {}",
          options: [
            "Same as 1st level",
            "Process-wide (or cluster-wide) cache shared across sessions — hits the DB less; trade-off: invalidation complexity",
            "Removed",
            "Per-thread",
          ],
          answer: 1,
          explanation:
            "Second-level cache (Ehcache, Hazelcast, Infinispan) caches entity reads across sessions. Best for read-mostly reference data (Country, Currency, RoleConfig). Beware: writes from outside the JVM bypass it.",
        },
        {
          id: "sd2-23",
          title: "Auditing",
          code: "@EnableJpaAuditing\n@EntityListeners(AuditingEntityListener.class)\n@Entity class X {\n  @CreatedDate Instant created;\n  @LastModifiedDate Instant updated;\n}",
          options: [
            "Manual triggers",
            "Spring Data automatically populates created/modified timestamps + user via AuditorAware<T>",
            "Only for users",
            "Removed",
          ],
          answer: 1,
          explanation:
            "Built-in auditing via @EnableJpaAuditing + @EntityListeners(AuditingEntityListener.class). For user fields (@CreatedBy/@LastModifiedBy) supply an AuditorAware<T> bean.",
        },
        {
          id: "sd2-24",
          title: "Transactional read-only",
          code: "@Transactional(readOnly = true)\nUser findById(long id) { ... }",
          options: [
            "Doesn't matter",
            "Hint that disables dirty-checking; can route to read replicas; safer + faster for queries",
            "Required by JPA",
            "Throws on writes",
          ],
          answer: 1,
          explanation:
            "readOnly=true tells Hibernate to skip dirty-check (saves CPU) and is a signal to routing data sources (read replicas via AbstractRoutingDataSource). Best practice on read-only service methods.",
        },
        {
          id: "sd2-25",
          title: "Hibernate flush modes",
          code: "// AUTO: before queries (so they see pending changes)\n// COMMIT: only at commit time",
          options: [
            "Same",
            "AUTO is default — Hibernate flushes pending writes before queries to give consistent results; COMMIT delays flush to commit",
            "MANUAL only",
            "Reversed",
          ],
          answer: 1,
          explanation:
            "AUTO flush keeps query results consistent within the session. COMMIT delays flush, batching writes but risking inconsistent reads. Default AUTO is sane; only switch knowingly.",
        },
        {
          id: "sd2-26",
          title: "Batch inserts",
          code: "spring.jpa.properties.hibernate.jdbc.batch_size=50\nspring.jpa.properties.hibernate.order_inserts=true",
          options: [
            "On by default",
            "Hibernate doesn't batch by default — set batch_size and order_inserts/updates; IDENTITY ID strategy disables batching for inserts",
            "Always batches",
            "Property removed",
          ],
          answer: 1,
          explanation:
            "Significant insert/update speed-ups. But IDENTITY column requires per-row round-trip for the generated key → batching disabled. Use SEQUENCE with allocationSize for batched ID assignment + batched inserts.",
        },
        {
          id: "sd2-27",
          title: "@Transactional + REQUIRES_NEW for outbox writer",
          code: "@Transactional(propagation = REQUIRES_NEW)\nvoid emitEvent(...) { eventRepo.save(...); }",
          options: [
            "Wrong",
            "Each event saved in its OWN transaction independent of caller — outbox pattern variant",
            "Slower always",
            "Same as REQUIRED",
          ],
          answer: 1,
          explanation:
            "REQUIRES_NEW suspends the outer tx and commits its body independently. Useful for audit/outbox semantics where you don't want a failure later to revert the recorded event.",
        },
        {
          id: "sd2-28",
          title: "Datasource & connection pool",
          code: "// Spring Boot uses HikariCP by default since 2.0",
          options: [
            "DBCP",
            "HikariCP (high-performance pool) — auto-configured. Tune maximum-pool-size; default 10 (often too low)",
            "Tomcat JDBC",
            "Custom",
          ],
          answer: 1,
          explanation:
            "HikariCP is the modern default. Tune max-pool-size to (cores * 2 + spindles) as a starting point. Watch out for the leak-detection-threshold during dev. With virtual threads, increase pool size.",
        },
        {
          id: "sd2-29",
          title: "Flyway / Liquibase",
          code: "// Schema migration tools — keep DB schema in version control",
          options: [
            "Optional only",
            "Boot auto-runs Flyway/Liquibase on startup if classpath contains them and migrations exist — versioned, repeatable schema",
            "Replaced by JPA ddl-auto",
            "Removed",
          ],
          answer: 1,
          explanation:
            "Never rely on spring.jpa.hibernate.ddl-auto=update for production. Flyway/Liquibase let you version SQL/XML migrations, run them deterministically, and roll forward.",
        },
        {
          id: "sd2-30",
          title: "Hibernate ddl-auto values",
          code: "spring.jpa.hibernate.ddl-auto=none|validate|update|create|create-drop",
          options: [
            "Same effect",
            "none (prod default), validate (check schema matches), update (apply diffs — risky), create/create-drop (testing)",
            "Always create",
            "Removed",
          ],
          answer: 1,
          explanation:
            "For production: 'none' or 'validate' (with Flyway/Liquibase handling migrations). 'update' looks convenient but doesn't drop columns, doesn't handle constraint changes well, and can silently desync schemas.",
        },
      ],
    },
  ],
};
