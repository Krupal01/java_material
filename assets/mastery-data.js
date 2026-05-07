/* =========================================================
   Java Mastery — 500 tricky questions, output puzzles & coding patterns.
   Numbered globally Q1–Q500. Edit freely to add/correct entries.
   ========================================================= */
window.MASTERY_DATA = {
  parts: [
    {
      label: "PART 1 · THEORY",
      sections: [
        {
          id:"primitives", n:1, title:"Primitives & Wrappers", range:"Q1–Q60",
          questions: [
            {n:1,t:"What are the 8 primitive data types in Java? List them with sizes.",d:["theory"],a:`<p><strong>byte</strong> 8b · <strong>short</strong> 16b · <strong>int</strong> 32b · <strong>long</strong> 64b · <strong>float</strong> 32b · <strong>double</strong> 64b · <strong>char</strong> 16b unsigned · <strong>boolean</strong> ~1b (JVM-defined).</p>`},
            {n:2,t:"Default values: int, boolean, double, char, Object reference?",d:["theory"],a:`<p>Field/array defaults: int=0, boolean=false, double=0.0, char='\\u0000', references=null. <strong>Local variables have NO default.</strong></p>`},
            {n:3,t:"What is autoboxing/unboxing?",d:["theory"],a:`<p>Auto: primitive → wrapper (<code>int → Integer.valueOf</code>). Unbox: wrapper → primitive (<code>.intValue()</code>). NPE on unboxing null; surprising <code>==</code> on boxed values.</p>`},
            {n:4,t:"Integer.valueOf(127) == Integer.valueOf(127) ?",d:["tricky"],a:`<p><strong>true</strong>. Cache returns the SAME object for [-128,127].</p>`},
            {n:5,t:"Integer.valueOf(128) == Integer.valueOf(128) ?",d:["tricky"],a:`<p><strong>false</strong>. Above 127, two distinct objects. Use <code>.equals()</code>.</p>`},
            {n:6,t:"int x=5; System.out.println(x++ + ++x) ?",d:["tricky"],a:`<p><strong>12</strong>. <code>x++</code> uses 5 then x=6; <code>++x</code> sets x=7 then uses 7. 5+7=12.</p>`},
            {n:7,t:"Assigning long to int without cast?",d:["tricky"],a:`<p>Compile error: lossy conversion. Need explicit <code>(int)</code>; truncates high bits silently.</p>`},
            {n:8,t:"Result of 1/2 in Java?",d:["tricky"],a:`<p><strong>0</strong>. Integer division truncates. Use <code>1.0/2</code> for 0.5.</p>`},
            {n:9,t:"Range of byte? What if exceeded?",d:["tricky"],a:`<p>−128..127. Overflow wraps: <code>(byte)128 == −128</code>, <code>(byte)200 == −56</code>.</p>`},
            {n:10,t:"Difference between float and double literals?",d:["theory"],a:`<p><code>1.0</code> = double. Float requires suffix: <code>1.0f</code>. <code>float x=1.0;</code> = compile error.</p>`},
            {n:11,t:"System.out.println(0.1 + 0.2) ?",d:["tricky"],a:`<p><strong>0.30000000000000004</strong>. IEEE 754 binary fp can't represent 0.1 exactly. Use BigDecimal for money.</p>`},
            {n:12,t:"== for primitives vs objects?",d:["theory"],a:`<p>Primitives: value. Objects: reference identity. Use <code>.equals()</code> for content.</p>`},
            {n:13,t:"Integer x=null; int y=x; — what happens?",d:["tricky"],a:`<p><strong>NullPointerException</strong> on auto-unboxing.</p>`},
            {n:14,t:"System.out.println('a' + 1) ?",d:["tricky"],a:`<p><strong>98</strong>. char promotes to int. Use <code>(char)('a'+1)</code> for 'b'.</p>`},
            {n:15,t:"What is widening type conversion?",d:["theory"],a:`<p>Implicit smaller→larger: byte→short→int→long→float→double. char→int directly. Narrowing needs cast.</p>`},
            {n:16,t:"System.out.println(10 == 10.0) ?",d:["tricky"],a:`<p><strong>true</strong>. int promotes to double; 10 is exact in fp.</p>`},
            {n:17,t:"& vs && operators?",d:["theory","tricky"],a:`<p><code>&&</code> short-circuits. <code>&</code> always evaluates both (also bitwise on ints). <code>x!=null && x.foo()</code> — only && works.</p>`},
            {n:18,t:"Result of ~5 in Java?",d:["tricky"],a:`<p><strong>−6</strong>. <code>~n == -n - 1</code> in two's complement.</p>`},
            {n:19,t:"System.out.println(true + false) ?",d:["tricky"],a:`<p><strong>Compile error</strong>. <code>+</code> not defined for booleans (unlike C).</p>`},
            {n:20,t:"Integer.MAX_VALUE + 1 ?",d:["tricky"],a:`<p><strong>Integer.MIN_VALUE</strong>. Silent overflow. Use <code>Math.addExact()</code> to detect.</p>`},
            {n:21,t:"What is a wrapper class?",d:["theory"],a:`<p>Object form of primitives (Integer, Double…). Needed for generics, nullability, Object methods.</p>`},
            {n:22,t:"(byte)(127+1) ?",d:["tricky"],a:`<p><strong>−128</strong>. Addition is int (128); narrowing keeps low 8 bits — sign bit set.</p>`},
            {n:23,t:"int i = 'A'; — what is i?",d:["tricky"],a:`<p><strong>65</strong>. char widens to int (Unicode code point).</p>`},
            {n:24,t:"Long l=100; Integer i=100; l.equals(i) ?",d:["tricky"],a:`<p><strong>false</strong>. <code>Long.equals</code> checks type. Use <code>l.longValue() == i.longValue()</code>.</p>`},
            {n:25,t:"Why is comparing doubles with == dangerous?",d:["theory"],a:`<p>FP rounding: equal-looking values differ in last bits. Use tolerance or BigDecimal.</p>`},
            {n:26,t:"new Integer(null) — what happens?",d:["tricky"],a:`<p>Multiple constructor overloads (<code>int</code>, <code>String</code>) — unboxing <code>null</code> fails. Compile error: ambiguous; if you cast as <code>(String)null</code>, <strong>NumberFormatException</strong> at runtime. Constructor is also deprecated since Java 9.</p>`},
            {n:27,t:"Integer.parseInt(null) ?",d:["tricky"],a:`<p><strong>NumberFormatException</strong> with message <code>Cannot parse null string</code>. NOT NPE.</p>`},
            {n:28,t:"Integer.valueOf(null) ?",d:["tricky"],a:`<p><strong>NumberFormatException</strong> — same as parseInt path. <code>String</code> overload picked; null can't be parsed.</p>`},
            {n:29,t:"Integer.parseInt(\"\") ?",d:["tricky"],a:`<p><strong>NumberFormatException</strong>. Empty isn't a number. Same for whitespace-only.</p>`},
            {n:30,t:"Integer.parseInt(\" 5\") ?",d:["tricky"],a:`<p><strong>NumberFormatException</strong>. Leading whitespace not allowed. Trim first or use <code>parseInt(s.trim())</code>.</p>`},
            {n:31,t:"Integer.parseInt(\"+5\") ?",d:["tricky"],a:`<p><strong>5</strong>. Java 7+ accepts leading <code>+</code>. Earlier: NFE.</p>`},
            {n:32,t:"Integer.parseInt(\"0x10\") ?",d:["tricky"],a:`<p><strong>NumberFormatException</strong>. Use <code>parseInt(\"10\", 16)</code> or <code>Integer.decode(\"0x10\")</code>.</p>`},
            {n:33,t:"Integer.parseInt(\"123L\") ?",d:["tricky"],a:`<p><strong>NumberFormatException</strong>. No literal suffixes allowed in parseInt.</p>`},
            {n:34,t:"Integer x=1000; Integer y=1000; x==y ?",d:["tricky"],a:`<p><strong>false</strong>. Outside [-128,127] cache. Use <code>.equals()</code>.</p>`},
            {n:35,t:"Integer.valueOf(127) == 127 ?",d:["tricky"],a:`<p><strong>true</strong>. Right side <code>127</code> autoboxes via cache → same object as left.</p>`},
            {n:36,t:"Integer.valueOf(128) == 128 ?",d:["tricky"],a:`<p><strong>true</strong>. Mixed Integer/int → Integer is unboxed to int; 128==128 (primitives).</p>`},
            {n:37,t:"Integer x=100; int y=100; x.equals(y) ?",d:["tricky"],a:`<p><strong>true</strong>. <code>y</code> autoboxes to Integer; same value.</p>`},
            {n:38,t:"Integer x=100; long y=100; x.equals(y) ?",d:["tricky"],a:`<p><strong>false</strong>. <code>y</code> autoboxes to Long; <code>Integer.equals</code> rejects non-Integer.</p>`},
            {n:39,t:"int x=Integer.MAX_VALUE; x++; what is x?",d:["tricky"],a:`<p><strong>Integer.MIN_VALUE</strong> (−2147483648). Wraps silently.</p>`},
            {n:40,t:"int x=-1; x >>> 1 ?",d:["tricky"],a:`<p><strong>2147483647</strong> (MAX_VALUE). <code>>>></code> is logical shift, fills 0; <code>>></code> arithmetic preserves sign.</p>`},
            {n:41,t:"(int) null — compile?",d:["tricky"],a:`<p><strong>Compile error</strong>. Can't cast null to a primitive. Cast to wrapper first: <code>(Integer) null</code> works (then unboxing throws NPE).</p>`},
            {n:42,t:"(Integer) null — compile?",d:["tricky"],a:`<p>Compiles fine — null-to-reference cast. Calling <code>.intValue()</code> on it throws NPE.</p>`},
            {n:43,t:"Integer.MIN_VALUE / -1 ?",d:["tricky"],a:`<p><strong>Integer.MIN_VALUE</strong>. The mathematical result overflows int range; Java silently wraps. <code>Math.divideExact</code> (Java 18+) throws.</p>`},
            {n:44,t:"Integer.MIN_VALUE % -1 ?",d:["tricky"],a:`<p><strong>0</strong>. JLS defines this — avoids the C undefined behavior.</p>`},
            {n:45,t:"1 / 0 vs 1.0 / 0 ?",d:["tricky"],a:`<p><code>1/0</code> → ArithmeticException. <code>1.0/0</code> → <strong>Infinity</strong>. <code>0.0/0.0</code> → <strong>NaN</strong>.</p>`},
            {n:46,t:"Double.NaN == Double.NaN ?",d:["tricky"],a:`<p><strong>false</strong>. Per IEEE 754. Use <code>Double.isNaN(x)</code>.</p>`},
            {n:47,t:"Double.compare(NaN, NaN) ?",d:["tricky"],a:`<p><strong>0</strong>. Java's canonical compare treats NaN as equal to itself, unlike <code>==</code>.</p>`},
            {n:48,t:"Float.MIN_VALUE — what is it?",d:["tricky"],a:`<p>The smallest <em>positive</em> nonzero value (≈ 1.4e−45), NOT the most negative. For most negative use <code>-Float.MAX_VALUE</code>.</p>`},
            {n:49,t:"int[] x={1,2,3}; x[-1] ?",d:["tricky"],a:`<p><strong>ArrayIndexOutOfBoundsException</strong>. Java arrays are 0-indexed; no negative wrap.</p>`},
            {n:50,t:"Boolean b = null; if (b) ?",d:["tricky"],a:`<p><strong>NPE</strong> on auto-unboxing.</p>`},
            {n:51,t:"Boolean b = null; b == false ?",d:["tricky"],a:`<p><strong>false</strong>. <code>false</code> autoboxes to Boolean.FALSE; <code>==</code> compares references — null != FALSE.</p>`},
            {n:52,t:"Boolean.parseBoolean(null) ?",d:["tricky"],a:`<p><strong>false</strong>. Doesn't NPE. Only \"true\" (case-insens) → true; everything else → false.</p>`},
            {n:53,t:"Boolean.valueOf(null) ?",d:["tricky"],a:`<p><strong>Boolean.FALSE</strong>. Same null-safe behavior as parseBoolean.</p>`},
            {n:54,t:"Boolean.valueOf(\"True\") == Boolean.valueOf(\"true\") ?",d:["tricky"],a:`<p><strong>true</strong>. Case-insensitive parse; both return the cached <code>TRUE</code>.</p>`},
            {n:55,t:"Character.isDigit('०') ?",d:["tricky"],a:`<p><strong>true</strong> — Devanagari ZERO is a Unicode digit. Use <code>c &gt;= '0' &amp;&amp; c &lt;= '9'</code> for ASCII-only.</p>`},
            {n:56,t:"'A' + 'B' — output?",d:["tricky"],a:`<p><strong>131</strong> (int). Both chars promote to int (65+66).</p>`},
            {n:57,t:"int x = 1; double d = x; d == 1.0 ?",d:["tricky"],a:`<p><strong>true</strong>. Widening preserves exact value for small ints.</p>`},
            {n:58,t:"long L = 10000000000; — compile?",d:["tricky"],a:`<p><strong>Compile error</strong>: literal too large for int. Add <code>L</code> suffix: <code>10000000000L</code>.</p>`},
            {n:59,t:"int i = 0_1_0; — what is i?",d:["tricky"],a:`<p><strong>10</strong>. Underscores allowed in numeric literals (Java 7+) for readability; ignored by compiler.</p>`},
            {n:60,t:"-XX:AutoBoxCacheMax — what does it do?",d:["theory"],a:`<p>Extends Integer cache upper bound (default 127). E.g. <code>-XX:AutoBoxCacheMax=1024</code> caches up to 1024.</p>`}
          ]
        },
        {
          id:"strings", n:2, title:"Strings — Tricky Output", range:"Q61–Q120",
          questions: [
            {n:61,t:'"123" == "123" — output?',d:["tricky"],a:`<p><strong>true</strong>. Both literals interned to same pool object.</p>`},
            {n:62,t:'String a="hi"; a.concat(" x"); System.out.println(a);',d:["tricky"],a:`<p><strong>hi</strong>. Strings immutable — concat result discarded.</p>`},
            {n:63,t:'new String("Hello") == new String("Hello") ?',d:["tricky"],a:`<p><strong>false</strong>. <code>new</code> always creates fresh heap objects.</p>`},
            {n:64,t:"What is the String Pool?",d:["theory"],a:`<p>JVM-managed table storing string literals. Equal literals share one object — saves memory, makes hash cacheable.</p>`},
            {n:65,t:"Why is String immutable?",d:["theory"],a:`<p>Thread safety, pool dedup, hash caching, security (file paths can't change post-check).</p>`},
            {n:66,t:'String s="Hi"; s.toUpperCase(); System.out.println(s);',d:["tricky"],a:`<p><strong>Hi</strong>. Result discarded — must reassign.</p>`},
            {n:67,t:'"Hello".substring(1, 3) ?',d:["tricky"],a:`<p><strong>"el"</strong>. End exclusive.</p>`},
            {n:68,t:"String.valueOf(null) — what happens?",d:["tricky"],a:`<p>Ambiguous — picks <code>(char[])null</code> overload at compile time → <strong>NPE</strong> at runtime. <code>String.valueOf((Object)null)</code> returns "null" safely.</p>`},
            {n:69,t:"String vs StringBuilder vs StringBuffer?",d:["theory"],a:`<p>String: immutable. StringBuilder: mutable, NOT thread-safe, fast. StringBuffer: synchronized, slower.</p>`},
            {n:70,t:'"abc".equals(null) ?',d:["tricky"],a:`<p><strong>false</strong>. Safe — never NPE.</p>`},
            {n:71,t:'null.equals("abc") ?',d:["tricky"],a:`<p><strong>NPE</strong>. Method call on null. Use <code>Objects.equals(a,b)</code>.</p>`},
            {n:72,t:'"java".indexOf("a") ?',d:["tricky"],a:`<p><strong>1</strong>. First match wins.</p>`},
            {n:73,t:'"hello world".replace("l","r") ?',d:["tricky"],a:`<p><strong>"herro worrd"</strong>. Replaces ALL (literal, not regex).</p>`},
            {n:74,t:'"abc" + 1 + 2 ?',d:["tricky"],a:`<p><strong>"abc12"</strong>. Left-to-right concat.</p>`},
            {n:75,t:'1 + 2 + "abc" ?',d:["tricky"],a:`<p><strong>"3abc"</strong>. 1+2=3 first.</p>`},
            {n:76,t:'"Hello".startsWith("hell") ?',d:["tricky"],a:`<p><strong>false</strong>. Case-sensitive.</p>`},
            {n:77,t:'String s=null; "Value: "+s ?',d:["tricky"],a:`<p><strong>"Value: null"</strong>. Concat calls <code>String.valueOf</code>.</p>`},
            {n:78,t:'How many objects: String s=new String("abc") ?',d:["tricky"],a:`<p>Up to <strong>2</strong> — pooled "abc" + new heap String. If literal already pooled, only 1 new.</p>`},
            {n:79,t:'String a="hello"; b="hel"+"lo"; a==b ?',d:["tricky"],a:`<p><strong>true</strong>. <code>"hel"+"lo"</code> is constant-folded → same pool ref.</p>`},
            {n:80,t:'String x="hel"; b=x+"lo"; "hello"==b ?',d:["tricky"],a:`<p><strong>false</strong>. Runtime concat → new heap object, not pooled.</p>`},
            {n:81,t:'"abc".charAt(0) == 97 ?',d:["tricky"],a:`<p><strong>true</strong>. char widens to int; 'a'=97.</p>`},
            {n:82,t:'"abc".substring(3) ?',d:["tricky"],a:`<p><strong>""</strong>. Start can equal length. <code>substring(4)</code> → StringIndexOOB.</p>`},
            {n:83,t:'"abc".substring(-1) ?',d:["tricky"],a:`<p><strong>StringIndexOutOfBoundsException</strong>. No negative indexing.</p>`},
            {n:84,t:'"abc".indexOf("") ?',d:["tricky"],a:`<p><strong>0</strong>. Empty string matches at every position; first is 0.</p>`},
            {n:85,t:'"abc".replace("", "x") ?',d:["tricky"],a:`<p><strong>"xaxbxcx"</strong>. Empty match between every char (and at boundaries).</p>`},
            {n:86,t:'"abc".split("") ?',d:["tricky"],a:`<p><strong>["a","b","c"]</strong>. Splits between every code unit.</p>`},
            {n:87,t:'"a,,".split(",") vs split(",", -1) ?',d:["tricky"],a:`<p>Default: <code>["a"]</code> (trailing empties dropped). With -1: <code>["a","",""]</code>.</p>`},
            {n:88,t:'"5".matches("\\\\d") ?',d:["tricky"],a:`<p><strong>true</strong>. Implicitly anchored. Whole string is one digit.</p>`},
            {n:89,t:'"abcd".replaceAll(".", "X") ?',d:["tricky"],a:`<p><strong>"XXXX"</strong>. <code>.</code> matches any char in regex. Use <code>"\\\\."</code> for literal dot.</p>`},
            {n:90,t:'String.format("%d", 1.5) ?',d:["tricky"],a:`<p><strong>IllegalFormatConversionException</strong>. <code>%d</code> requires integer.</p>`},
            {n:91,t:'"abc".compareTo("abd") ?',d:["tricky"],a:`<p><strong>−1</strong>. 'c'(99) − 'd'(100).</p>`},
            {n:92,t:'" ".isEmpty() vs " ".isBlank() ?',d:["tricky"],a:`<p>isEmpty: <strong>false</strong> (has 1 char). isBlank: <strong>true</strong>. (Java 11+).</p>`},
            {n:93,t:'"Hello".chars().count() ?',d:["tricky"],a:`<p><strong>5L</strong>. Returns <code>long</code>. Counts UTF-16 code units, not code points.</p>`},
            {n:94,t:'"😀".length() ?',d:["tricky"],a:`<p><strong>2</strong>. Emoji is a surrogate pair (2 UTF-16 units). Use <code>codePointCount</code>.</p>`},
            {n:95,t:'String.join(",", (Iterable<String>)null) ?',d:["tricky"],a:`<p><strong>NPE</strong>. Iterable can't be null.</p>`},
            {n:96,t:'String.join(",", "a", null, "c") ?',d:["tricky"],a:`<p><strong>"a,null,c"</strong>. Nulls render as "null".</p>`},
            {n:97,t:"intern() — when useful?",d:["theory"],a:`<p>Force runtime string into pool. Useful for memory dedup of repeated values. Don't overuse — pool is global, hard to GC.</p>`},
            {n:98,t:'String s="a"+"b"+"c"; — how many objects?',d:["tricky"],a:`<p><strong>1</strong>. Constant folding at compile time → one pooled "abc".</p>`},
            {n:99,t:'String s = String.format("%s","a"); s == "a" ?',d:["tricky"],a:`<p><strong>false</strong>. format() builds at runtime → not interned.</p>`},
            {n:100,t:'""+1 + ""+2 ?',d:["tricky"],a:`<p><strong>"12"</strong>. Both sides become String early.</p>`},
            {n:101,t:`(""+'a').length() ?`,d:["tricky"],a:`<p><strong>1</strong>. <code>""+ char</code> stringifies the char.</p>`},
            {n:102,t:'String s; s.length(); — compile?',d:["tricky"],a:`<p><strong>Compile error</strong>: variable might not have been initialized. Locals have no default.</p>`},
            {n:103,t:`"abc".equals(new char[]{'a','b','c'}) ?`,d:["tricky"],a:`<p><strong>false</strong>. Different types. <code>String.equals</code> only works against another String.</p>`},
            {n:104,t:'new StringBuilder("a").equals(new StringBuilder("a")) ?',d:["tricky"],a:`<p><strong>false</strong>. StringBuilder doesn't override <code>equals</code> — identity only. Compare via <code>toString()</code>.</p>`},
            {n:105,t:'"abc".replaceAll("(?i)A", "X") ?',d:["tricky"],a:`<p><strong>"Xbc"</strong>. <code>(?i)</code> = case-insensitive flag.</p>`},
            {n:106,t:'"55".matches("[0-9]") ?',d:["tricky"],a:`<p><strong>false</strong>. <code>matches</code> needs WHOLE match. Use <code>"[0-9]+"</code>.</p>`},
            {n:107,t:'String.format("%5d", 1) ?',d:["tricky"],a:`<p><strong>"    1"</strong>. Width 5, right-aligned. Use <code>%-5d</code> for left.</p>`},
            {n:108,t:'"hello".getBytes() — encoding?',d:["theory","tricky"],a:`<p>Platform default — non-portable. Always specify: <code>getBytes(StandardCharsets.UTF_8)</code>.</p>`},
            {n:109,t:'"a".compareTo(null) ?',d:["tricky"],a:`<p><strong>NPE</strong>. compareTo on null is undefined.</p>`},
            {n:110,t:'String s="a"+null; s.length() ?',d:["tricky"],a:`<p><strong>5</strong>. <code>"a"+null</code> = "anull".</p>`},
            {n:111,t:'String.format(null) ?',d:["tricky"],a:`<p><strong>NPE</strong>. Format string can't be null.</p>`},
            {n:112,t:'String.format("%s", null) ?',d:["tricky"],a:`<p><strong>"null"</strong>. Argument can be null.</p>`},
            {n:113,t:'"abc".toCharArray() — modify it?',d:["tricky"],a:`<p>Returns a NEW array — modifying does NOT change the original String.</p>`},
            {n:114,t:'"\\u0041".equals("A") ?',d:["tricky"],a:`<p><strong>true</strong>. \\u0041 is 'A' at compile time.</p>`},
            {n:115,t:'"\\\\n".length() ?',d:["tricky"],a:`<p><strong>2</strong>. Escaped backslash + n. <code>"\\n"</code>.length() = 1.</p>`},
            {n:116,t:'Pattern.quote(\"a.b\") ?',d:["theory"],a:`<p>Returns <code>"\\Qa.b\\E"</code> — treats input as literal in regex.</p>`},
            {n:117,t:'Locale-sensitive toLowerCase — issue?',d:["theory","tricky"],a:`<p>Turkish locale: <code>"I".toLowerCase(Locale.forLanguageTag("tr"))</code> = "ı" (dotless). Use <code>Locale.ROOT</code> for code identifiers.</p>`},
            {n:118,t:'"a".repeat(3) ?',d:["theory"],a:`<p><strong>"aaa"</strong>. Java 11+. <code>repeat(0)</code> = "".</p>`},
            {n:119,t:'"  a  ".strip() vs trim() ?',d:["theory"],a:`<p>Same for ASCII. strip handles Unicode whitespace; trim only ≤ U+0020. Java 11+.</p>`},
            {n:120,t:'String text = """\\n  hi\\n  """; — what is it?',d:["theory"],a:`<p>Java 13+ text block. Strips common indentation; <code>\\n</code> escape preserved as actual newline.</p>`}
          ]
        },
        {
          id:"arrays", n:3, title:"Arrays — Tricky Output", range:"Q121–Q160",
          questions: [
            {n:121,t:"int[] default values?",d:["theory"],a:`<p>All <strong>0</strong>. References → null, boolean → false.</p>`},
            {n:122,t:"int[][] arr = new int[3][4]; arr.length ?",d:["tricky"],a:`<p><strong>3</strong>. <code>arr[0].length</code> = 4.</p>`},
            {n:123,t:"int[] a={1,2,3}; int[] b=a; b[0]=99; a[0] ?",d:["tricky"],a:`<p><strong>99</strong>. Same reference. Use <code>a.clone()</code>.</p>`},
            {n:124,t:"System.out.println(new int[]{1,2,3}) ?",d:["tricky"],a:`<p>Cryptic <code>[I@1b6d3586</code>. Use <code>Arrays.toString()</code>.</p>`},
            {n:125,t:"int[] arr=null; arr.length ?",d:["tricky"],a:`<p><strong>NPE</strong>. Field access on null.</p>`},
            {n:126,t:"Arrays.equals vs == for arrays?",d:["theory"],a:`<p><code>==</code> compares references. <code>Arrays.equals</code> compares elements. Nested: <code>deepEquals</code>.</p>`},
            {n:127,t:"String[] a=new String[3]; a[1] ?",d:["tricky"],a:`<p><strong>null</strong>. Reference array defaults to null.</p>`},
            {n:128,t:"for (int x : arr) x = 99; — does arr change?",d:["tricky"],a:`<p><strong>No</strong>. <code>x</code> is a copy. Use indexed loop to mutate.</p>`},
            {n:129,t:"new T[10] for generic T?",d:["theory"],a:`<p><strong>Compile error</strong>. Type erasure removes T at runtime. Workaround: <code>(T[]) new Object[10]</code>.</p>`},
            {n:130,t:"int[] a={1,2,3}; a[3]=4; ?",d:["tricky"],a:`<p><strong>ArrayIndexOutOfBoundsException</strong>. Fixed size.</p>`},
            {n:131,t:"length vs length() vs size()?",d:["theory","tricky"],a:`<p>Array: <code>arr.length</code> field. String: <code>str.length()</code>. Collection: <code>list.size()</code>.</p>`},
            {n:132,t:"int[] a={1}; int[] b=a.clone(); a==b ?",d:["tricky"],a:`<p><strong>false</strong>. Different references. <code>Arrays.equals(a,b)</code> = true.</p>`},
            {n:133,t:"Are 2D arrays contiguous?",d:["theory"],a:`<p>No. Array of array refs — rows can differ in length (jagged) and live anywhere.</p>`},
            {n:134,t:"Arrays.asList(intArr) for int[] ?",d:["tricky"],a:`<p>Returns <code>List&lt;int[]&gt;</code> of size 1 — NOT List&lt;Integer&gt;. Use <code>Arrays.stream(arr).boxed().toList()</code>.</p>`},
            {n:135,t:"Object[] o = new String[3]; o[0]=1; ?",d:["tricky"],a:`<p><strong>ArrayStoreException</strong>. Java arrays are covariant but checked at runtime.</p>`},
            {n:136,t:"int[].class.getName() ?",d:["tricky"],a:`<p><strong>"[I"</strong>. Object[]: "[Ljava.lang.Object;". Internal JVM names.</p>`},
            {n:137,t:"int[] arr={1,2,3,}; — compile?",d:["tricky"],a:`<p><strong>Compiles</strong>. Trailing comma allowed in array initializer.</p>`},
            {n:138,t:"Arrays.hashCode(null) ?",d:["tricky"],a:`<p><strong>0</strong>. Doesn't NPE.</p>`},
            {n:139,t:"Arrays.equals(null, null) ?",d:["tricky"],a:`<p><strong>true</strong>. Both null = equal.</p>`},
            {n:140,t:"int[] a={}; a.length ?",d:["tricky"],a:`<p><strong>0</strong>. Valid empty array.</p>`},
            {n:141,t:"Arrays.copyOf(arr, longerLen) ?",d:["theory"],a:`<p>Pads with default (0/null). <code>copyOfRange</code> works similarly.</p>`},
            {n:142,t:"Arrays.binarySearch unsorted?",d:["tricky"],a:`<p>Undefined behavior — any negative or positive result. Sort first.</p>`},
            {n:143,t:"Comparator.comparingInt vs comparing?",d:["theory"],a:`<p>comparingInt avoids autoboxing — faster for primitive keys.</p>`},
            {n:144,t:"Varargs: m(int... x) — type of x?",d:["theory"],a:`<p><code>int[]</code>. Caller can pass either varargs or array directly.</p>`},
            {n:145,t:"Method m(int... x) and m(int x) — ambiguous?",d:["tricky"],a:`<p>For 1-arg call <code>m(5)</code>: prefers <strong>m(int)</strong> (more specific). Varargs is fallback.</p>`},
            {n:146,t:"int[] arr; arr.length; — compile?",d:["tricky"],a:`<p>Compile error: not initialized. Local arrays need explicit assignment.</p>`},
            {n:147,t:"Arrays.stream(int[]) returns?",d:["theory"],a:`<p><strong>IntStream</strong>, not Stream&lt;Integer&gt;. Use <code>.boxed()</code> if you need Integer.</p>`},
            {n:148,t:"Arrays.parallelSort threshold?",d:["theory"],a:`<p>Parallel below ~8192 elements isn't beneficial — overhead exceeds gain. Use for large arrays.</p>`},
            {n:149,t:"Arrays.fill(arr, fromIdx, toIdx, val) ?",d:["theory"],a:`<p><code>toIdx</code> is exclusive. <code>fill(arr, 0, arr.length, 0)</code> = <code>fill(arr, 0)</code>.</p>`},
            {n:150,t:"Arrays.deepToString — when?",d:["theory"],a:`<p>For nested arrays. <code>Arrays.toString(int[][])</code> shows refs; deepToString shows structure.</p>`},
            {n:151,t:"int[] a={1,2,3}; a == a.clone() ?",d:["tricky"],a:`<p><strong>false</strong>. Different references after clone.</p>`},
            {n:152,t:"Arrays.copyOfRange(arr, -1, 5) ?",d:["tricky"],a:`<p><strong>ArrayIndexOutOfBoundsException</strong>. Negative from index disallowed.</p>`},
            {n:153,t:"Arrays.sort stability — int[] vs Object[]?",d:["theory"],a:`<p>int[]: dual-pivot quicksort, NOT stable. Object[]: TimSort, stable. Use Object[] when stability matters.</p>`},
            {n:154,t:"int[] a=new int[Integer.MAX_VALUE]; ?",d:["tricky"],a:`<p>OutOfMemoryError or arrays-too-large limit. Max practical size depends on heap; some JVMs cap below MAX_VALUE.</p>`},
            {n:155,t:"int[] a={1,2}; List<int[]> l=Arrays.asList(a); l.size() ?",d:["tricky"],a:`<p><strong>1</strong>. Treats whole int[] as single element since <code>asList</code>'s varargs sees one Object (the array).</p>`},
            {n:156,t:"int[][] m=new int[2][]; m[0].length ?",d:["tricky"],a:`<p><strong>NPE</strong>. Inner rows aren't initialized. Need <code>m[0]=new int[N]</code> first.</p>`},
            {n:157,t:"Why is Arrays.asList fixed-size?",d:["theory"],a:`<p>Backed by the supplied array — adding/removing would require resize. set() works since it doesn't change size.</p>`},
            {n:158,t:"int[] a=null; Arrays.equals(a, new int[]{}) ?",d:["tricky"],a:`<p><strong>false</strong>. null != empty.</p>`},
            {n:159,t:"int[] a={3,1,2}; Arrays.sort(a, 0, 2); — what's a?",d:["tricky"],a:`<p><strong>{1,3,2}</strong>. Sorts indices [0,2) — only first 2 elements.</p>`},
            {n:160,t:"System.arraycopy with overlapping ranges?",d:["theory","tricky"],a:`<p>Behaves correctly — implementation handles forward/backward copy. Use it instead of manual loop for speed.</p>`}
          ]
        },
        {
          id:"collections-th", n:4, title:"Collections Framework", range:"Q161–Q195",
          questions: [
            {n:161,t:"What is the Java Collections Framework?",d:["theory"],a:`<p>Unified architecture: interfaces (Collection, List, Set, Map, Queue), implementations, algorithms (Collections utility class).</p>`},
            {n:162,t:"Collection vs Collections?",d:["theory","tricky"],a:`<p><strong>Collection</strong>: root interface. <strong>Collections</strong>: utility class with static methods.</p>`},
            {n:163,t:"ArrayList vs LinkedList?",d:["theory"],a:`<p>ArrayList: array-backed, O(1) get, O(n) middle insert. LinkedList: doubly-linked, O(1) ends, O(n) get. Default ArrayList.</p>`},
            {n:164,t:"HashMap initial capacity / load factor?",d:["theory"],a:`<p>16 / 0.75. Resize doubles when <code>size &gt; capacity × loadFactor</code>.</p>`},
            {n:165,t:"HashMap collisions?",d:["theory"],a:`<p>Same bucket → linked list. Java 8+: 8+ entries → red-black tree (O(log n)).</p>`},
            {n:166,t:"list.remove(1) on List<Integer> [1,2,3] ?",d:["tricky"],a:`<p>Removes <strong>index 1</strong> (value 2). Use <code>remove(Integer.valueOf(1))</code> for value.</p>`},
            {n:167,t:"Iterate + remove safely?",d:["theory","tricky"],a:`<p><code>Iterator.remove()</code> or <code>list.removeIf()</code>. <code>list.remove()</code> in for-each → CME.</p>`},
            {n:168,t:"Fail-fast vs fail-safe?",d:["theory"],a:`<p>Fail-fast (ArrayList, HashMap): tracks modCount, throws CME. Fail-safe (CopyOnWrite, ConcurrentHashMap): snapshots, no CME.</p>`},
            {n:169,t:"Comparable vs Comparator?",d:["theory"],a:`<p>Comparable: natural order in class. Comparator: external strategy, multiple orderings.</p>`},
            {n:170,t:'List.of("a","b").add("c") ?',d:["tricky"],a:`<p><strong>UnsupportedOperationException</strong>. Immutable.</p>`},
            {n:171,t:"Mutating a HashMap key — what happens?",d:["theory","tricky"],a:`<p>hashCode changes → entry stuck in wrong bucket → get() can't find it. Never mutate keys.</p>`},
            {n:172,t:"containsKey vs contains in Map?",d:["tricky"],a:`<p>Map has containsKey + containsValue, NOT contains. <code>map.contains(x)</code> = compile error.</p>`},
            {n:173,t:"HashMap vs Hashtable?",d:["theory"],a:`<p>HashMap: not sync, allows nulls. Hashtable: sync (legacy), no nulls. Use ConcurrentHashMap.</p>`},
            {n:174,t:"How HashSet works internally?",d:["theory"],a:`<p>Backed by HashMap with PRESENT sentinel value. <code>add</code> = <code>map.put(e, PRESENT)</code>.</p>`},
            {n:175,t:"new ArrayList<>().equals(new LinkedList<>()) ?",d:["tricky"],a:`<p><strong>true</strong>. Both empty; List.equals is type-agnostic.</p>`},
            {n:176,t:"Why is CME best-effort?",d:["theory"],a:`<p>modCount isn't atomic across threads — absence of CME doesn't prove safety.</p>`},
            {n:177,t:"Iterator vs ListIterator?",d:["theory"],a:`<p>Iterator: forward, hasNext/next/remove. ListIterator: bidirectional + set/add. List-only.</p>`},
            {n:178,t:"Set.of(1, 1, 2) ?",d:["tricky"],a:`<p><strong>IllegalArgumentException</strong>: duplicate. HashSet would silently dedupe.</p>`},
            {n:179,t:"List.copyOf(list) — always copies?",d:["theory","tricky"],a:`<p>If input is already an unmodifiable List, returns same instance — optimised.</p>`},
            {n:180,t:"List<? extends Number> — can add?",d:["theory","tricky"],a:`<p>Only nulls. Compiler can't know exact subtype. Use <code>? super Number</code> to add Numbers (PECS).</p>`},
            {n:181,t:"PriorityQueue iteration order?",d:["tricky"],a:`<p>Unspecified — NOT sorted. Use <code>poll()</code> repeatedly for sorted access.</p>`},
            {n:182,t:"ArrayDeque vs LinkedList as Deque?",d:["theory"],a:`<p>ArrayDeque: array-backed, faster, no nulls. LinkedList: linked, allows null but slower.</p>`},
            {n:183,t:"CopyOnWriteArrayList — when?",d:["theory"],a:`<p>Read-heavy concurrent. Each write copies the array — expensive on writes, cheap reads.</p>`},
            {n:184,t:"Vector vs ArrayList?",d:["theory"],a:`<p>Vector: synchronized (legacy), grows by doubling. ArrayList: not sync, grows by 50%. Use ArrayList.</p>`},
            {n:185,t:"Stack class vs ArrayDeque?",d:["theory"],a:`<p>Stack extends Vector (synchronized, legacy). ArrayDeque is faster, modern.</p>`},
            {n:186,t:"Why doesn't List have a put() method?",d:["theory"],a:`<p>List uses <code>add</code>/<code>set</code> for indexed positions. <code>put</code> is Map-specific (key/value).</p>`},
            {n:187,t:"list.toArray() return type?",d:["tricky"],a:`<p><code>Object[]</code>. Use <code>list.toArray(new String[0])</code> for typed.</p>`},
            {n:188,t:"Why pass new T[0] not new T[size]?",d:["tricky"],a:`<p>JVM-optimized. Counter-intuitive but <code>new T[0]</code> is faster — JVM allocates the right size internally.</p>`},
            {n:189,t:"Collections.unmodifiableList — true copy?",d:["theory","tricky"],a:`<p><strong>No</strong> — read-only VIEW. Mutations to underlying list show through. Use <code>List.copyOf()</code> for true copy.</p>`},
            {n:190,t:"Collections.synchronizedList iteration?",d:["theory","tricky"],a:`<p>Methods sync individually but iteration needs explicit <code>synchronized(list){}</code>. Modern alternative: ConcurrentModification-tolerant types.</p>`},
            {n:191,t:"List<Integer> l = new ArrayList<>(); l.add(1); l.remove(1); ?",d:["tricky"],a:`<p>Tries <strong>remove(int index)</strong> first → IndexOutOfBoundsException since list has only 1 element at index 0.</p>`},
            {n:192,t:"List equals across implementations?",d:["theory"],a:`<p>Element-wise equality regardless of impl. <code>new ArrayList&lt;&gt;(List.of(1,2)).equals(new LinkedList&lt;&gt;(List.of(1,2)))</code> = true.</p>`},
            {n:193,t:"Set<Integer> equals to List<Integer>?",d:["tricky"],a:`<p><strong>Always false</strong>. Different contracts — Set.equals only compares with Set.</p>`},
            {n:194,t:"Why HashSet returns boolean from add?",d:["theory","tricky"],a:`<p>true if added (not present), false if duplicate. Lets you detect duplicates: <code>if(!set.add(x)) duplicate</code>.</p>`},
            {n:195,t:"Collection.removeIf — atomic?",d:["theory"],a:`<p>Logically yes for this list — but not thread-safe. For concurrent use ConcurrentHashMap or explicit lock.</p>`}
          ]
        },
        {
          id:"map-th", n:5, title:"Map — Tricky Output", range:"Q196–Q230",
          questions: [
            {n:196,t:"Main Map implementations?",d:["theory"],a:`<p>HashMap, LinkedHashMap (insertion/access order), TreeMap (sorted), ConcurrentHashMap, EnumMap, WeakHashMap, IdentityHashMap.</p>`},
            {n:197,t:"map.get when key missing?",d:["tricky"],a:`<p>Returns <strong>null</strong>. Indistinguishable from null value — use containsKey or getOrDefault.</p>`},
            {n:198,t:'map.put("a",1); put("a",2); get("a") ?',d:["tricky"],a:`<p><strong>2</strong>. put overwrites. First put returns null, second returns 1.</p>`},
            {n:199,t:"HashMap null keys/values?",d:["tricky"],a:`<p>HashMap: 1 null key, multiple null values. ConcurrentHashMap: <strong>NEITHER</strong>.</p>`},
            {n:200,t:"TreeMap with Integer keys {3,1,2} keySet?",d:["tricky"],a:`<p><strong>[1,2,3]</strong>. Sorted naturally regardless of insertion order.</p>`},
            {n:201,t:"TreeMap with null key?",d:["tricky"],a:`<p><strong>NPE</strong>. Default comparator can't compare null.</p>`},
            {n:202,t:"Map duplicate values?",d:["theory","tricky"],a:`<p>Yes — keys must be unique, values may repeat. <code>map.values()</code> is a Collection (allows dupes).</p>`},
            {n:203,t:"HashMap iteration stable?",d:["theory","tricky"],a:`<p>No — order unspecified, may change across resize/JDK versions. Use LinkedHashMap or TreeMap.</p>`},
            {n:204,t:'map.merge("k", 1, Integer::sum) when key absent?',d:["tricky"],a:`<p>Inserts <code>k → 1</code>. Merge function NOT called for absent keys.</p>`},
            {n:205,t:"computeIfAbsent vs putIfAbsent?",d:["theory"],a:`<p>putIfAbsent: takes value (always evaluated). computeIfAbsent: function (lazy — only on miss).</p>`},
            {n:206,t:"map.entrySet() — snapshot or view?",d:["theory","tricky"],a:`<p><strong>Live view</strong>. Iterator.remove() removes from map.</p>`},
            {n:207,t:"entrySet vs keySet+get speed?",d:["theory"],a:`<p>entrySet: 1 lookup per entry. keySet+get: 2 lookups (walk + each get). entrySet wins.</p>`},
            {n:208,t:'Map.of("a",1,"a",2) ?',d:["tricky"],a:`<p><strong>IllegalArgumentException</strong> — duplicate keys. HashMap.put would silently overwrite.</p>`},
            {n:209,t:"EnumMap — what's special?",d:["theory"],a:`<p>Backed by array indexed by ordinal. Very fast, iteration = enum order. Keys must be one enum type.</p>`},
            {n:210,t:"WeakHashMap — when?",d:["theory"],a:`<p>Keys held by weak refs — entries auto-removed when no strong ref. Cache by identity. Don't use String literals (always strongly reachable).</p>`},
            {n:211,t:"IdentityHashMap difference?",d:["theory","tricky"],a:`<p>Uses == not equals/hashCode. Useful for object identity tracking (e.g. cycle detection).</p>`},
            {n:212,t:"map.computeIfAbsent returning null?",d:["tricky"],a:`<p>Doesn't insert. Map remains unchanged.</p>`},
            {n:213,t:"map.compute returning null?",d:["tricky"],a:`<p>REMOVES the key (or leaves it absent if it was already missing).</p>`},
            {n:214,t:"map.computeIfPresent on missing key?",d:["tricky"],a:`<p>Returns null, doesn't insert anything.</p>`},
            {n:215,t:"Hashtable.put(null, x) ?",d:["tricky"],a:`<p><strong>NullPointerException</strong>. Hashtable forbids null keys/values.</p>`},
            {n:216,t:"LinkedHashMap insertion vs access order?",d:["theory"],a:`<p>Constructor flag <code>accessOrder=true</code> moves entry to tail on get. Foundation for LRU.</p>`},
            {n:217,t:"ConcurrentHashMap weakly consistent iterator?",d:["theory","tricky"],a:`<p>Iterator may or may not see concurrent modifications. Won't throw CME but may show stale.</p>`},
            {n:218,t:"map.put returns?",d:["tricky"],a:`<p>Previous value (or null if key was absent). For null values, can't distinguish absent from null — use containsKey.</p>`},
            {n:219,t:"map.remove(k, v) — what does it do?",d:["theory"],a:`<p>Conditional remove: removes only if current value equals v. Atomic on ConcurrentHashMap.</p>`},
            {n:220,t:"map.replace(k, oldV, newV) ?",d:["theory"],a:`<p>CAS-style replace: only if current is oldV. Returns boolean.</p>`},
            {n:221,t:"Map.entry(k, v) — mutable?",d:["theory","tricky"],a:`<p>Immutable. <code>setValue</code> throws UOE. For mutable: <code>new AbstractMap.SimpleEntry</code>.</p>`},
            {n:222,t:"map.keySet().remove(k) ?",d:["tricky"],a:`<p>Removes the entry from the map (it's a live view).</p>`},
            {n:223,t:"map.values() is Set?",d:["tricky"],a:`<p>No, it's a <strong>Collection</strong>. Values can duplicate.</p>`},
            {n:224,t:"HashMap initial capacity rounding?",d:["theory","tricky"],a:`<p>Rounded UP to nearest power of 2. <code>new HashMap&lt;&gt;(13)</code> → actual capacity 16.</p>`},
            {n:225,t:"HashMap resize cost?",d:["theory"],a:`<p>O(n) — rehash all entries to new bucket array. Pre-size if approximate count is known.</p>`},
            {n:226,t:"TreeMap headMap/tailMap/subMap?",d:["theory"],a:`<p>VIEWS into sorted ranges. Mutations propagate. Use for range queries.</p>`},
            {n:227,t:"map.equals comparison?",d:["theory"],a:`<p>Structural — same key/value mapping. Type-agnostic across Map implementations.</p>`},
            {n:228,t:"ConcurrentHashMap.compute thread safety?",d:["theory"],a:`<p>Atomic per key — holds bucket lock during function. Don't call other ops on same map inside.</p>`},
            {n:229,t:"map.forEach modify map?",d:["tricky"],a:`<p>Same restriction as iteration — CME for HashMap. ConcurrentHashMap allows but result undefined.</p>`},
            {n:230,t:"NavigableMap floor/ceiling/lower/higher?",d:["theory"],a:`<p>floor: ≤. ceiling: ≥. lower: strictly &lt;. higher: strictly &gt;. Returns key/entry or null.</p>`}
          ]
        },
        {
          id:"set-th", n:6, title:"Set — Tricky Output", range:"Q231–Q252",
          questions: [
            {n:231,t:"Main Set implementations?",d:["theory"],a:`<p>HashSet (no order), LinkedHashSet (insertion), TreeSet (sorted, NavigableSet), EnumSet (bitset), CopyOnWriteArraySet.</p>`},
            {n:232,t:"HashSet.add(1) twice — size?",d:["tricky"],a:`<p><strong>1</strong>. Second add returns false.</p>`},
            {n:233,t:"HashSet allow null?",d:["tricky"],a:`<p>Yes — exactly one. TreeSet: no (NPE on default comparator).</p>`},
            {n:234,t:"Custom object in HashSet without equals/hashCode override?",d:["theory","tricky"],a:`<p>Identity-based — equal-looking instances treated as distinct. Always override both.</p>`},
            {n:235,t:"new HashSet<>(Arrays.asList(1,2,2,3)).stream().count() ?",d:["tricky"],a:`<p><strong>3L</strong>. Set dedupes.</p>`},
            {n:236,t:"TreeSet thread-safe?",d:["theory"],a:`<p>No. Use ConcurrentSkipListSet or external sync.</p>`},
            {n:237,t:"HashSet vs LinkedHashSet iteration?",d:["theory"],a:`<p>HashSet: unspecified. LinkedHashSet: insertion order (small overhead).</p>`},
            {n:238,t:"Set contains itself — what happens?",d:["tricky"],a:`<p>Adding a Set as an element of itself → infinite recursion in <code>hashCode</code> → StackOverflowError.</p>`},
            {n:239,t:"TreeSet with custom objects requirement?",d:["theory"],a:`<p>Implement Comparable OR provide Comparator. Otherwise add throws ClassCastException.</p>`},
            {n:240,t:"removeAll vs retainAll?",d:["theory"],a:`<p>removeAll(B) = A − B. retainAll(B) = A ∩ B. Both mutate in place.</p>`},
            {n:241,t:"EnumSet — bitset details?",d:["theory"],a:`<p>RegularEnumSet: long bitset (≤64 elements). JumboEnumSet: long[] for &gt;64. Extremely fast.</p>`},
            {n:242,t:"Set.copyOf(set) ?",d:["theory"],a:`<p>Immutable snapshot. Same optimisation as List.copyOf — no copy if already unmodifiable.</p>`},
            {n:243,t:"TreeSet.first() on empty?",d:["tricky"],a:`<p><strong>NoSuchElementException</strong>. Use <code>pollFirst()</code> (returns null).</p>`},
            {n:244,t:"TreeSet.subSet bounds?",d:["theory"],a:`<p>[from, to) — inclusive from, exclusive to. <code>subSet(from, true, to, true)</code> for closed.</p>`},
            {n:245,t:"set.iterator().remove() — works?",d:["theory"],a:`<p>Yes for HashSet/TreeSet. Not on Set.of (immutable).</p>`},
            {n:246,t:"TreeSet equality with HashSet?",d:["tricky"],a:`<p>Equal if same elements — Set.equals is type-agnostic.</p>`},
            {n:247,t:"Set.of(null) ?",d:["tricky"],a:`<p><strong>NPE</strong>. Immutable factories reject null.</p>`},
            {n:248,t:"Two HashSets with same elements but different insertion order — equal?",d:["theory"],a:`<p>Yes. Set.equals doesn't care about order.</p>`},
            {n:249,t:"set.addAll(coll) returns?",d:["theory","tricky"],a:`<p>true if set changed (at least one new element). false if all were duplicates.</p>`},
            {n:250,t:"TreeSet floor/ceiling on empty?",d:["tricky"],a:`<p>Returns <strong>null</strong>. Doesn't throw.</p>`},
            {n:251,t:"TreeSet pollFirst on empty?",d:["tricky"],a:`<p>Returns <strong>null</strong> — never throws.</p>`},
            {n:252,t:"ConcurrentSkipListSet thread-safe Comparable?",d:["theory"],a:`<p>Concurrent NavigableSet. O(log n) add/remove/contains. Allows concurrent reads + writes.</p>`}
          ]
        },
        {
          id:"nulls", n:7, title:"Null Handling Tricks", range:"Q253–Q284",
          questions: [
            {n:253,t:"Optional.of(null) ?",d:["tricky"],a:`<p><strong>NPE</strong>. Use <code>ofNullable</code> for null-tolerant.</p>`},
            {n:254,t:"Optional.ofNullable(null).get() ?",d:["tricky"],a:`<p><strong>NoSuchElementException</strong>. Use orElse/orElseThrow.</p>`},
            {n:255,t:"(String) null + \"\" ?",d:["tricky"],a:`<p><strong>"null"</strong>. String concat calls <code>String.valueOf</code>.</p>`},
            {n:256,t:"null == null ?",d:["tricky"],a:`<p><strong>true</strong>. Two null references are equal.</p>`},
            {n:257,t:"null instanceof String ?",d:["tricky"],a:`<p><strong>false</strong>. instanceof is null-safe — never throws.</p>`},
            {n:258,t:"String.class.isInstance(null) ?",d:["tricky"],a:`<p><strong>false</strong>. Same as instanceof.</p>`},
            {n:259,t:"Objects.equals(null, null) ?",d:["tricky"],a:`<p><strong>true</strong>. Null-safe by design.</p>`},
            {n:260,t:"Objects.toString(null) vs Objects.toString(null, \"-\") ?",d:["tricky"],a:`<p>First: <code>"null"</code>. Second: <code>"-"</code> (custom default).</p>`},
            {n:261,t:"Objects.requireNonNull(null) ?",d:["tricky"],a:`<p><strong>NPE</strong> with message. Useful for early arg validation.</p>`},
            {n:262,t:"switch (null) — what happens?",d:["tricky"],a:`<p>Java &lt;21: <strong>NPE</strong>. Java 21+ pattern switch can match <code>case null</code>.</p>`},
            {n:263,t:"if (null) — compile?",d:["tricky"],a:`<p><strong>Compile error</strong>. <code>if</code> needs boolean.</p>`},
            {n:264,t:"System.out.println(null) ?",d:["tricky"],a:`<p>Compile error: ambiguous overload. <code>println((Object)null)</code> prints "null".</p>`},
            {n:265,t:"Map<String,Integer> m; int x = m.get(\"absent\") ?",d:["tricky"],a:`<p><strong>NPE</strong> — get returns null, unboxing throws.</p>`},
            {n:266,t:"Integer x = b ? null : 0; — when b=true?",d:["tricky"],a:`<p><strong>NPE</strong>. Ternary with mixed types unboxes to int — null can't unbox.</p>`},
            {n:267,t:"String[] a=null; for (String s:a) ?",d:["tricky"],a:`<p><strong>NPE</strong>. Enhanced for calls iterator/length on a.</p>`},
            {n:268,t:"obj.equals(null) ?",d:["theory","tricky"],a:`<p>Always <strong>false</strong> per equals contract — never NPE. Inverse <code>null.equals(obj)</code> is NPE.</p>`},
            {n:269,t:"List.of(\"a\", null) ?",d:["tricky"],a:`<p><strong>NPE</strong>. Immutable factories reject nulls.</p>`},
            {n:270,t:"new ArrayList<>(Arrays.asList(\"a\", null)) ?",d:["tricky"],a:`<p>Allowed. ArrayList accepts nulls.</p>`},
            {n:271,t:"Arrays.asList(\"a\", null).contains(null) ?",d:["tricky"],a:`<p><strong>true</strong>. AbstractList.contains handles null.</p>`},
            {n:272,t:"Optional.empty().ifPresent(x -> ...) ?",d:["tricky"],a:`<p>No-op. Lambda not invoked.</p>`},
            {n:273,t:"Optional.of(null).map(x -> ...) ?",d:["tricky"],a:`<p><strong>NPE on of(null)</strong>, never reaches map.</p>`},
            {n:274,t:"Optional.ofNullable(null).map(x -> ...) ?",d:["tricky"],a:`<p>Returns empty Optional. Map skipped.</p>`},
            {n:275,t:"Optional.ofNullable(s).orElse(\"x\") when s=\"\" ?",d:["tricky"],a:`<p><strong>""</strong>. Empty string is present (not null).</p>`},
            {n:276,t:"Stream.of(1, null, 3).filter(Objects::nonNull).count() ?",d:["tricky"],a:`<p><strong>2</strong>.</p>`},
            {n:277,t:"List.of().stream().findFirst() ?",d:["tricky"],a:`<p>Optional.empty(). No NPE on empty stream.</p>`},
            {n:278,t:"Collections.singletonList(null).contains(null) ?",d:["tricky"],a:`<p><strong>true</strong>. singletonList allows null.</p>`},
            {n:279,t:"List.of((String)null) ?",d:["tricky"],a:`<p><strong>NPE</strong>. Casting null doesn't bypass the null check.</p>`},
            {n:280,t:"map.getOrDefault(\"absent\", null) ?",d:["tricky"],a:`<p>Returns <code>null</code>. Default value can be null.</p>`},
            {n:281,t:"NPE message in Java 14+?",d:["theory"],a:`<p>Helpful NPE: pinpoints which expression was null (e.g., <code>"Cannot invoke 'String.length()' because 'a' is null"</code>).</p>`},
            {n:282,t:"Objects.requireNonNullElse(null, x) ?",d:["theory"],a:`<p>Returns x. Like Optional.orElse — null-safe default.</p>`},
            {n:283,t:"Boolean b=null; b? 1:0 ?",d:["tricky"],a:`<p><strong>NPE</strong>. Ternary condition unboxes Boolean.</p>`},
            {n:284,t:"List<String> l=null; l.size()==0 ?",d:["tricky"],a:`<p><strong>NPE</strong>. Use <code>l == null || l.isEmpty()</code>.</p>`}
          ]
        },
        {
          id:"exceptions", n:8, title:"Exceptions & Control Flow", range:"Q285–Q309",
          questions: [
            {n:285,t:"try { return 1; } finally { return 2; } ?",d:["tricky"],a:`<p><strong>2</strong>. finally overrides try's return — and silently swallows exceptions. Avoid return in finally.</p>`},
            {n:286,t:"try { throw new RE(); } finally { return 0; } ?",d:["tricky"],a:`<p><strong>0</strong>. finally's return silently SWALLOWS the exception.</p>`},
            {n:287,t:"try { return 1; } finally { x++; } — value?",d:["tricky"],a:`<p><strong>1</strong>. Return value frozen before finally runs. <code>x</code> is incremented, but the returned int doesn't change.</p>`},
            {n:288,t:"try { return 1; } catch (E) { return 2; } finally { return 3; } — when E thrown?",d:["tricky"],a:`<p><strong>3</strong>. finally's return wins over catch's.</p>`},
            {n:289,t:"finally with System.exit(0)?",d:["tricky"],a:`<p>finally is <strong>SKIPPED</strong>. JVM terminates before block executes.</p>`},
            {n:290,t:"Multi-catch: catch (A | B e) — e's type?",d:["theory"],a:`<p>Common supertype. Cannot be related (A extends B disallowed).</p>`},
            {n:291,t:"try-with-resources close order?",d:["theory"],a:`<p>REVERSE of declaration. <code>try (A a; B b) {}</code> closes b first, then a.</p>`},
            {n:292,t:"Suppressed exceptions in TWR?",d:["theory"],a:`<p>If close() throws while another exception is propagating, the close exception is added to <code>getSuppressed()</code>.</p>`},
            {n:293,t:"throw new Exception() — checked?",d:["theory"],a:`<p>Yes. Must declare or catch. RuntimeException and subclasses are unchecked.</p>`},
            {n:294,t:"NoClassDefFoundError vs ClassNotFoundException?",d:["theory","tricky"],a:`<p>NoClassDefFoundError: class was found at compile but missing at runtime. ClassNotFoundException: explicit Class.forName failed.</p>`},
            {n:295,t:"OutOfMemoryError — checked?",d:["theory"],a:`<p>No — Error subclass (unchecked). But not RuntimeException either; both Error and RE are unchecked.</p>`},
            {n:296,t:"Static init runs when?",d:["theory"],a:`<p>Once, at class initialization (first active use). Order: declaration order.</p>`},
            {n:297,t:"Instance init block vs constructor?",d:["theory"],a:`<p>Instance init block runs BEFORE constructor body, AFTER super(). Useful for shared init across constructors.</p>`},
            {n:298,t:"final field — when assignable?",d:["theory"],a:`<p>Once: at declaration, in instance init block, or constructor (definite assignment). Static final: at declaration or static init.</p>`},
            {n:299,t:"Constructor implicit super() — always?",d:["theory","tricky"],a:`<p>Yes, unless you explicitly call <code>this(...)</code> or <code>super(...)</code>. Compile error if super has no no-arg constructor.</p>`},
            {n:300,t:"break vs labeled break?",d:["theory"],a:`<p><code>break</code>: exit innermost loop/switch. <code>break label;</code>: exit the labeled outer loop.</p>`},
            {n:301,t:"switch fall-through?",d:["theory"],a:`<p>Without <code>break</code>, falls through to next case. Java 14+ arrow-switch (<code>case X -&gt;</code>) doesn't fall through.</p>`},
            {n:302,t:"Java 14+ switch expression — exhaustiveness?",d:["theory"],a:`<p>Required for sealed types — compile error if missing case. Optional <code>default</code>.</p>`},
            {n:303,t:"assert disabled by default?",d:["theory","tricky"],a:`<p>Yes. Enable with <code>-ea</code>. Don't use for input validation in production.</p>`},
            {n:304,t:"catching Throwable — bad why?",d:["theory"],a:`<p>Catches Errors (OOM, StackOverflow) which usually indicate JVM-level problems you can't recover from.</p>`},
            {n:305,t:"return inside try — finally still runs?",d:["theory"],a:`<p>YES. finally always runs except System.exit and JVM crash.</p>`},
            {n:306,t:"break inside finally — what happens?",d:["theory","tricky"],a:`<p>Compile error if break would escape an exception. Generally avoid control-flow statements in finally.</p>`},
            {n:307,t:"Empty for(;;) — infinite loop?",d:["theory"],a:`<p>Yes. Empty condition = always true. Equivalent to <code>while(true)</code>.</p>`},
            {n:308,t:"Cannot reassign final parameter — workaround?",d:["theory"],a:`<p>Use a local copy: <code>int x = param; x = newValue;</code>.</p>`},
            {n:309,t:"Exception chaining — getCause vs initCause?",d:["theory"],a:`<p>Constructor: <code>new MyEx(msg, cause)</code> sets cause. <code>initCause</code> only once. Preserves stack trace context.</p>`}
          ]
        },
        {
          id:"oop", n:9, title:"Inheritance & Polymorphism", range:"Q310–Q334",
          questions: [
            {n:310,t:"Static methods overridden?",d:["theory","tricky"],a:`<p>HIDDEN, not overridden. Compiler picks based on declared type, not runtime.</p>`},
            {n:311,t:"Field access — runtime or static type?",d:["tricky"],a:`<p>Static (declared) type. Fields aren't polymorphic. <code>Parent p = new Child(); p.x</code> uses Parent's x.</p>`},
            {n:312,t:"Methods — runtime or static type?",d:["theory"],a:`<p>Runtime (dynamic dispatch) — that's polymorphism.</p>`},
            {n:313,t:"final method — overridable?",d:["theory"],a:`<p>No. Compile error.</p>`},
            {n:314,t:"final class — extendable?",d:["theory"],a:`<p>No. <code>String</code>, <code>Integer</code> etc. are final.</p>`},
            {n:315,t:"private method — overridable?",d:["theory","tricky"],a:`<p>No — invisible to subclass. Effectively final.</p>`},
            {n:316,t:"Abstract class — constructor?",d:["theory"],a:`<p>Yes, can have one. Subclass calls via <code>super(...)</code>.</p>`},
            {n:317,t:"Interface methods Java 9+?",d:["theory"],a:`<p>public abstract (default), <code>default</code> with body, <code>static</code> with body, and <code>private</code> (Java 9+) for helper methods.</p>`},
            {n:318,t:"Default method conflict between interfaces?",d:["theory","tricky"],a:`<p>Class must override and explicitly choose: <code>InterfaceA.super.m()</code> or InterfaceB's. Otherwise compile error.</p>`},
            {n:319,t:"instanceof on null?",d:["tricky"],a:`<p><strong>false</strong>. Always.</p>`},
            {n:320,t:"Pattern matching for instanceof (Java 16+)?",d:["theory"],a:`<p><code>if (obj instanceof String s) {…}</code> — binds s if true. No cast needed.</p>`},
            {n:321,t:"Records — what's auto-generated?",d:["theory"],a:`<p>equals, hashCode, toString, accessors (componentName()), canonical constructor.</p>`},
            {n:322,t:"Records — extendable?",d:["theory","tricky"],a:`<p>No — implicitly final. Can implement interfaces.</p>`},
            {n:323,t:"Sealed types?",d:["theory"],a:`<p><code>sealed</code> + <code>permits</code> restricts subclasses. Useful with pattern switch for exhaustiveness.</p>`},
            {n:324,t:"Diamond problem with interfaces?",d:["theory"],a:`<p>Solved via explicit super qualifier: <code>InterfaceA.super.method()</code>.</p>`},
            {n:325,t:"Type erasure — what is it?",d:["theory"],a:`<p>Generics removed at compile-time → runtime sees raw types. <code>List&lt;String&gt;</code> and <code>List&lt;Integer&gt;</code> share class <code>List.class</code>.</p>`},
            {n:326,t:"Why no new T() in generic code?",d:["theory","tricky"],a:`<p>T is erased — runtime can't pick the right constructor. Workaround: pass <code>Class&lt;T&gt;</code> and use reflection.</p>`},
            {n:327,t:"PECS rule?",d:["theory"],a:`<p>Producer Extends, Consumer Super. Read-only: <code>? extends T</code>. Write-only: <code>? super T</code>.</p>`},
            {n:328,t:"Raw type vs <Object>?",d:["theory","tricky"],a:`<p>Raw: bypasses generic type checking, generates unchecked warnings. <code>List&lt;Object&gt;</code>: enforces Object as element type. Don't use raw types.</p>`},
            {n:329,t:"Method overloading vs overriding?",d:["theory"],a:`<p>Overload: same name, different params, resolved at compile time. Override: subclass replaces, runtime dispatch.</p>`},
            {n:330,t:"@Override missing — what happens?",d:["theory","tricky"],a:`<p>If method shape doesn't match parent, you've created a new method (overload). Compiler can't warn without @Override. Always annotate.</p>`},
            {n:331,t:"Object[] o = new Integer[3]; o[0] = \"a\" ?",d:["tricky"],a:`<p><strong>ArrayStoreException</strong> at runtime. Arrays are covariant but check element types.</p>`},
            {n:332,t:"List<Object> l = new ArrayList<Integer>(); ?",d:["tricky"],a:`<p>Compile error — List is INVARIANT. Use <code>List&lt;? extends Object&gt;</code>.</p>`},
            {n:333,t:"abstract method with body?",d:["theory","tricky"],a:`<p>Compile error. Abstract methods declare signature only.</p>`},
            {n:334,t:"static + abstract together?",d:["theory","tricky"],a:`<p>Forbidden in classes. Allowed in interfaces only since static methods aren't inherited.</p>`}
          ]
        },
        {
          id:"streams", n:10, title:"Streams & Lambdas", range:"Q335–Q364",
          questions: [
            {n:335,t:"Stream lazy or eager?",d:["theory"],a:`<p>Intermediate ops are lazy. Terminal op triggers execution. Enables fusion + short-circuiting.</p>`},
            {n:336,t:"Reuse a stream after terminal op?",d:["tricky"],a:`<p><strong>IllegalStateException</strong>. Streams are one-shot. Recreate from source.</p>`},
            {n:337,t:"parallelStream thread safety?",d:["theory","tricky"],a:`<p>Pipeline thread-safe IF lambdas are stateless and side-effect-free. Mutating shared state from parallel = bug.</p>`},
            {n:338,t:"forEach vs forEachOrdered on parallel stream?",d:["theory"],a:`<p>forEach: order undefined. forEachOrdered: encounter order preserved (slower).</p>`},
            {n:339,t:"filter + findFirst — full traversal?",d:["theory"],a:`<p>No — short-circuits on first match.</p>`},
            {n:340,t:"empty stream reduce(0, sum) ?",d:["tricky"],a:`<p>Returns identity <strong>0</strong>. Without identity: <code>Optional.empty()</code>.</p>`},
            {n:341,t:"Stream.iterate infinite?",d:["theory"],a:`<p>Yes. Combine with <code>limit()</code> to bound. Java 9+ has 3-arg form with predicate.</p>`},
            {n:342,t:"Collectors.toMap duplicate keys?",d:["tricky"],a:`<p>Throws <strong>IllegalStateException</strong>. Pass merge function: <code>toMap(k, v, (a,b)-&gt;a)</code>.</p>`},
            {n:343,t:"Collectors.toUnmodifiableList vs toList()?",d:["theory"],a:`<p>toUnmodifiableList: immutable. <code>stream.toList()</code> (Java 16+): also immutable. Collectors.toList(): mutable.</p>`},
            {n:344,t:"groupingBy with counting downstream?",d:["theory"],a:`<p><code>groupingBy(fn, counting())</code> → <code>Map&lt;K, Long&gt;</code>.</p>`},
            {n:345,t:"partitioningBy result type?",d:["theory"],a:`<p><code>Map&lt;Boolean, ...&gt;</code> with both true/false keys present.</p>`},
            {n:346,t:"Stream.of(arr) for Object[] vs primitive[]?",d:["tricky"],a:`<p>Object[]: <code>Stream&lt;T&gt;</code>. int[]: returns <code>Stream&lt;int[]&gt;</code> of one element! Use <code>Arrays.stream(arr)</code> for IntStream.</p>`},
            {n:347,t:"mapToInt — why use it?",d:["theory"],a:`<p>Avoids boxing. Enables primitive-stream methods (sum, average, max).</p>`},
            {n:348,t:"boxed() — what?",d:["theory"],a:`<p>IntStream → Stream&lt;Integer&gt;. Required to use Object-stream collectors.</p>`},
            {n:349,t:"Optional.stream() (Java 9+)?",d:["theory"],a:`<p>0/1-element stream — useful inside <code>flatMap</code> on Stream&lt;Optional&lt;T&gt;&gt;.</p>`},
            {n:350,t:"takeWhile vs filter?",d:["theory","tricky"],a:`<p>takeWhile: stops at FIRST non-match. filter: skips non-matches but continues. Order-sensitive!</p>`},
            {n:351,t:"peek() guaranteed to run?",d:["theory","tricky"],a:`<p>Only when downstream pulls — short-circuit ops may skip elements. Don't rely on peek for side effects.</p>`},
            {n:352,t:"sorted on infinite stream?",d:["tricky"],a:`<p>Hangs / OOM. sorted needs to buffer everything. Always limit before sorting.</p>`},
            {n:353,t:"Comparator.comparing(getter, comp) — overload?",d:["theory"],a:`<p>Yes — extracts key with getter, compares with provided Comparator. Useful for non-Comparable keys.</p>`},
            {n:354,t:"Stream.concat for many streams?",d:["theory","tricky"],a:`<p>For 2 streams it's fine. For many, deeply nested calls hit StackOverflow at runtime — use flatMap.</p>`},
            {n:355,t:"Collectors.joining with empty stream?",d:["tricky"],a:`<p>Returns <code>""</code> (or just prefix+suffix if using the 3-arg overload).</p>`},
            {n:356,t:"Stream.generate(Math::random).limit(5) ?",d:["theory"],a:`<p>5 random doubles. generate is unbounded — always limit.</p>`},
            {n:357,t:"reduce with combiner?",d:["theory"],a:`<p>3-arg form: <code>reduce(identity, accumulator, combiner)</code>. Combiner merges partial results in parallel. Must be associative.</p>`},
            {n:358,t:"Stream side effects forbidden where?",d:["theory"],a:`<p>Stateful lambdas in <code>map/filter</code> are bugs in parallel. Use Collectors instead.</p>`},
            {n:359,t:"flatMap closes inner streams?",d:["theory","tricky"],a:`<p>Each inner stream is consumed. If they hold resources, ensure they're closed (<code>onClose</code>).</p>`},
            {n:360,t:"Stream.toList immutable since which version?",d:["theory"],a:`<p>Java 16. Differs from <code>collect(toList())</code> which is mutable.</p>`},
            {n:361,t:"Collectors.toMap with TreeMap?",d:["theory"],a:`<p>Pass map supplier: <code>toMap(k, v, merger, TreeMap::new)</code>.</p>`},
            {n:362,t:"Spliterator — purpose?",d:["theory"],a:`<p>Stream's traversal primitive — supports parallel splitting. Custom Spliterator enables custom Stream sources.</p>`},
            {n:363,t:"Lambda capture — final/effectively final?",d:["theory"],a:`<p>Captured locals must not change after capture (effectively final). Mutable state needs an array or AtomicReference.</p>`},
            {n:364,t:"Method reference vs lambda — performance?",d:["theory"],a:`<p>Both compile to invokedynamic. Method ref typically slightly leaner. JIT erases the difference.</p>`}
          ]
        },
        {
          id:"concurrency-th", n:11, title:"Concurrency Tricky", range:"Q365–Q389",
          questions: [
            {n:365,t:"volatile guarantees?",d:["theory"],a:`<p>Visibility + ordering (happens-before). NOT atomicity for compound ops like <code>x++</code>.</p>`},
            {n:366,t:"AtomicInteger.incrementAndGet vs ++?",d:["theory","tricky"],a:`<p>++ is read-modify-write — race-prone. incrementAndGet is atomic CAS-based.</p>`},
            {n:367,t:"synchronized(map) safe iteration?",d:["theory","tricky"],a:`<p>No — get/put are atomic, but iteration is multi-step. Sync the whole iteration block externally.</p>`},
            {n:368,t:"wait() must be in sync block?",d:["theory"],a:`<p>Yes — calling outside throws IllegalMonitorStateException.</p>`},
            {n:369,t:"sleep vs wait — releases lock?",d:["theory","tricky"],a:`<p>sleep does NOT release. wait DOES release the monitor. Confusing this is a classic deadlock cause.</p>`},
            {n:370,t:"Thread.interrupt() stops the thread?",d:["theory","tricky"],a:`<p>No — sets a flag. Thread must check <code>interrupted()</code> or be in a method that throws InterruptedException.</p>`},
            {n:371,t:"Daemon thread?",d:["theory"],a:`<p>JVM exits when only daemons remain. Set via <code>setDaemon(true)</code> before start. Don't use for critical work.</p>`},
            {n:372,t:"ThreadLocal in pool — issue?",d:["theory","tricky"],a:`<p>Thread reuse means stale values leak across tasks. Always <code>remove()</code> in a finally block.</p>`},
            {n:373,t:"CompletableFuture.thenApply vs thenAccept?",d:["theory"],a:`<p>thenApply: takes T, returns U → CF&lt;U&gt;. thenAccept: takes T, returns void → CF&lt;Void&gt;.</p>`},
            {n:374,t:"Future.get blocks?",d:["theory"],a:`<p>Yes — until result ready. Use timeout overload to avoid hangs.</p>`},
            {n:375,t:"shutdown vs shutdownNow?",d:["theory"],a:`<p>shutdown: refuse new tasks, finish queue. shutdownNow: interrupt running, return queued tasks.</p>`},
            {n:376,t:"Callable vs Runnable?",d:["theory"],a:`<p>Callable: returns T, can throw checked exception. Runnable: void, no checked.</p>`},
            {n:377,t:"ForkJoinPool.commonPool — used by?",d:["theory","tricky"],a:`<p>parallelStream and CompletableFuture.runAsync (without explicit executor). Sized to <code>availableProcessors()-1</code>.</p>`},
            {n:378,t:"Virtual threads + synchronized?",d:["theory","tricky"],a:`<p>Pre-Java 21: pinning to carrier thread (bad for scaling). Java 24+: better pinning behavior. Use j.u.c.Lock for high-throughput.</p>`},
            {n:379,t:"Happens-before — example?",d:["theory"],a:`<p>volatile write happens-before subsequent volatile read. Thread.start happens-before run. Monitor unlock happens-before next lock.</p>`},
            {n:380,t:"Double-checked locking — needs volatile?",d:["theory","tricky"],a:`<p><strong>YES</strong>. Without volatile, partial construction can leak. Always declare the singleton field volatile.</p>`},
            {n:381,t:"synchronized on String literal — bad why?",d:["theory","tricky"],a:`<p>Pool-shared object. Other unrelated code might lock the same literal. Use a private final lock object.</p>`},
            {n:382,t:"AtomicReference.compareAndSet semantics?",d:["theory"],a:`<p>Atomic: if currentValue == expected, set to new and return true; else return false. CAS primitive.</p>`},
            {n:383,t:"ReentrantLock vs synchronized?",d:["theory"],a:`<p>Lock: tryLock, fair option, multiple Conditions. synchronized: simpler, JIT-optimized, auto-release on exception.</p>`},
            {n:384,t:"Deadlock causes?",d:["theory"],a:`<p>Multiple locks acquired in different orders by threads. Solution: consistent ordering or tryLock with timeout.</p>`},
            {n:385,t:"BlockingQueue.put on full?",d:["theory"],a:`<p>Blocks until space. <code>offer(e, time, unit)</code> for timed. <code>offer(e)</code> non-blocking, returns false.</p>`},
            {n:386,t:"CountDownLatch vs CyclicBarrier?",d:["theory"],a:`<p>Latch: one-shot, count down to 0. Barrier: reusable, all threads wait at point. Cyclical resets after release.</p>`},
            {n:387,t:"Semaphore — what is it?",d:["theory"],a:`<p>Counter-based permit pool. acquire/release. Use for resource limits (e.g., DB connections).</p>`},
            {n:388,t:"ConcurrentHashMap vs synchronizedMap?",d:["theory"],a:`<p>CHM: per-bucket lock, no full-map lock. synchronizedMap: single lock — slower under contention.</p>`},
            {n:389,t:"VarHandle vs sun.misc.Unsafe?",d:["theory"],a:`<p>VarHandle (Java 9+) is the safe public API for low-level atomic ops. Unsafe is internal, deprecated for app code.</p>`}
          ]
        },
        {
          id:"advanced", n:12, title:"Advanced & Bonus Tricky", range:"Q390–Q407",
          questions: [
            {n:390,t:"Math.round(0.5) and Math.round(-0.5) ?",d:["tricky"],a:`<p><strong>1</strong> and <strong>0</strong>. Round half toward +∞: -0.5+0.5=0.</p>`},
            {n:391,t:"Math.abs(Integer.MIN_VALUE) ?",d:["tricky"],a:`<p>Returns MIN_VALUE itself — no positive equivalent. Use <code>Math.absExact</code> (Java 15+) for safety.</p>`},
            {n:392,t:"map() vs flatMap() in Stream?",d:["theory"],a:`<p>map: 1:1 transform. flatMap: 1:N — flattens nested streams.</p>`},
            {n:393,t:"What is a functional interface?",d:["theory"],a:`<p>Interface with exactly one abstract method. Lambda-compatible. <code>@FunctionalInterface</code> enforces.</p>`},
            {n:394,t:"Predicate, Function, Consumer, Supplier?",d:["theory"],a:`<p>T→boolean, T→R, T→void, ()→T.</p>`},
            {n:395,t:"list.subList(0,2).clear() on [1,2,3] ?",d:["tricky"],a:`<p>Original becomes <strong>[3]</strong>. subList is a VIEW.</p>`},
            {n:396,t:"Java records — implicit final?",d:["theory","tricky"],a:`<p>Yes — and components are final. Compact constructor allows validation.</p>`},
            {n:397,t:"sealed types restrict?",d:["theory"],a:`<p>Subclasses via <code>permits</code>. Enables exhaustive switch without default.</p>`},
            {n:398,t:"Diamond <> in anonymous class — supported?",d:["theory","tricky"],a:`<p>Java 9+. Earlier required explicit type args.</p>`},
            {n:399,t:"static methods inherited?",d:["theory","tricky"],a:`<p>Accessible via subclass name but NOT polymorphic — picked by declared type.</p>`},
            {n:400,t:"What is a sealed class (Java 17+)?",d:["theory"],a:`<p>sealed interface Shape permits Circle, Square {}. Useful for closed type hierarchies.</p>`},
            {n:401,t:"text block vs String.format?",d:["theory"],a:`<p>Text block: multi-line literal preserving formatting. format: runtime substitution. Combine: <code>"""…""".formatted(args)</code>.</p>`},
            {n:402,t:"var keyword (Java 10) — when avoid?",d:["theory"],a:`<p>Avoid when type isn't obvious from RHS (e.g., <code>var x = service.find(id)</code>).</p>`},
            {n:403,t:"yield in switch expression?",d:["theory"],a:`<p>Returns a value from a multi-line case block. <code>case X -&gt; { … yield value; }</code>.</p>`},
            {n:404,t:"Throwable hierarchy?",d:["theory"],a:`<p>Throwable → Error (unchecked) and Exception → RuntimeException (unchecked) + checked.</p>`},
            {n:405,t:"@SafeVarargs?",d:["theory"],a:`<p>Suppresses heap pollution warning on varargs of generic type. Method must be final/static/private.</p>`},
            {n:406,t:"Why is Cloneable broken?",d:["theory","tricky"],a:`<p>Marker interface, no clone() declared. Object.clone is protected. Hard to get right; prefer copy constructors.</p>`},
            {n:407,t:"Pattern matching for switch (Java 21)?",d:["theory"],a:`<p><code>case Type t when cond -&gt; …</code> — type-bind + guard. Combined with sealed types: exhaustive without default.</p>`}
          ]
        }
      ]
    },
    {
      label: "PART 2 · CODING",
      sections: [
        {
          id:"string-coding", n:13, title:"String Methods — Coding", range:"Q408–Q417",
          questions: [
            {n:408,t:"Check if a given string is a palindrome.",d:["easy"],a:`<pre>boolean isPalindrome(String s) {
  int i=0, j=s.length()-1;
  while (i&lt;j) if (s.charAt(i++)!=s.charAt(j--)) return false;
  return true;
}</pre>`},
            {n:409,t:"Count vowels in a string.",d:["easy"],a:`<pre>long n = s.toLowerCase().chars()
  .filter(c -&gt; "aeiou".indexOf(c)&gt;=0).count();</pre>`},
            {n:410,t:"Reverse using charAt + loop.",d:["easy"],a:`<pre>StringBuilder sb = new StringBuilder(s.length());
for (int i=s.length()-1; i&gt;=0; i--) sb.append(s.charAt(i));
return sb.toString();</pre>`},
            {n:411,t:"Check anagrams.",d:["medium"],a:`<pre>if (a.length()!=b.length()) return false;
int[] cnt = new int[26];
for (int i=0; i&lt;a.length(); i++) {
  cnt[a.charAt(i)-'a']++;
  cnt[b.charAt(i)-'a']--;
}
for (int c:cnt) if (c!=0) return false;
return true;</pre>`},
            {n:412,t:"First non-repeating character.",d:["medium"],a:`<pre>int[] cnt = new int[256];
for (char c:s.toCharArray()) cnt[c]++;
for (char c:s.toCharArray()) if (cnt[c]==1) return c;
return 0;</pre>`},
            {n:413,t:"Longest substring without repeating characters.",d:["hard"],a:`<pre>int len(String s) {
  Map&lt;Character,Integer&gt; last = new HashMap&lt;&gt;();
  int best=0, start=0;
  for (int i=0; i&lt;s.length(); i++) {
    char c = s.charAt(i);
    if (last.containsKey(c) &amp;&amp; last.get(c)&gt;=start) start = last.get(c)+1;
    last.put(c, i);
    best = Math.max(best, i-start+1);
  }
  return best;
}</pre>`},
            {n:414,t:`String compression: "aaabbc" → "a3b2c1".`,d:["medium"],a:`<pre>StringBuilder sb = new StringBuilder();
for (int i=0; i&lt;s.length();) {
  char c = s.charAt(i); int j = i;
  while (j&lt;s.length() &amp;&amp; s.charAt(j)==c) j++;
  sb.append(c).append(j-i); i = j;
}
return sb.toString();</pre>`},
            {n:415,t:"All permutations of a string.",d:["hard"],a:`<pre>void perm(char[] a, int i, List&lt;String&gt; out) {
  if (i==a.length) { out.add(new String(a)); return; }
  for (int j=i; j&lt;a.length; j++) {
    char t=a[i]; a[i]=a[j]; a[j]=t;
    perm(a, i+1, out);
    t=a[i]; a[i]=a[j]; a[j]=t;
  }
}</pre>`},
            {n:416,t:"Longest palindromic substring (expand around center).",d:["hard"],a:`<pre>String longest(String s) {
  int start=0, end=0;
  for (int i=0; i&lt;s.length(); i++) {
    int a=expand(s,i,i), b=expand(s,i,i+1);
    int len = Math.max(a, b);
    if (len &gt; end-start) { start=i-(len-1)/2; end=i+len/2; }
  }
  return s.substring(start, end+1);
}
int expand(String s, int l, int r) {
  while (l&gt;=0 &amp;&amp; r&lt;s.length() &amp;&amp; s.charAt(l)==s.charAt(r)) { l--; r++; }
  return r-l-1;
}</pre>`},
            {n:417,t:"Check string is all digits without regex.",d:["easy"],a:`<pre>if (s==null || s.isEmpty()) return false;
for (int i=0; i&lt;s.length(); i++)
  if (!Character.isDigit(s.charAt(i))) return false;
return true;</pre>`}
          ]
        },
        {
          id:"sb-coding", n:14, title:"StringBuilder — Coding", range:"Q418–Q422",
          questions: [
            {n:418,t:"Reverse a string with StringBuilder.",d:["easy"],a:`<pre>String r = new StringBuilder(s).reverse().toString();</pre>`},
            {n:419,t:"Comma-join int array without trailing comma.",d:["easy"],a:`<pre>StringBuilder sb = new StringBuilder();
for (int i=0; i&lt;arr.length; i++) {
  if (i&gt;0) sb.append(',');
  sb.append(arr[i]);
}</pre>`},
            {n:420,t:`Format "1234567890" as "1,234,567,890".`,d:["medium"],a:`<pre>StringBuilder sb = new StringBuilder(s);
for (int i=sb.length()-3; i&gt;0; i-=3) sb.insert(i, ',');
return sb.toString();</pre>`},
            {n:421,t:"Palindrome check with StringBuilder.",d:["easy"],a:`<pre>return s.equals(new StringBuilder(s).reverse().toString());</pre>`},
            {n:422,t:"Build comma-list and trim trailing comma.",d:["easy"],a:`<pre>StringBuilder sb = new StringBuilder();
for (String x : items) sb.append(x).append(',');
if (sb.length()&gt;0) sb.setLength(sb.length()-1);</pre>`}
          ]
        },
        {
          id:"arrays-coding", n:15, title:"Arrays — Coding", range:"Q423–Q432",
          questions: [
            {n:423,t:"Find max and min in int[] without sorting.",d:["easy"],a:`<pre>int min=arr[0], max=arr[0];
for (int x:arr) {
  if (x&lt;min) min=x;
  if (x&gt;max) max=x;
}</pre>`},
            {n:424,t:"Check duplicate value in array.",d:["easy"],a:`<pre>Set&lt;Integer&gt; seen = new HashSet&lt;&gt;();
for (int x:arr) if (!seen.add(x)) return true;
return false;</pre>`},
            {n:425,t:"Two Sum.",d:["medium"],a:`<pre>Map&lt;Integer,Integer&gt; idx = new HashMap&lt;&gt;();
for (int i=0; i&lt;arr.length; i++) {
  Integer j = idx.get(target-arr[i]);
  if (j!=null) return new int[]{j, i};
  idx.put(arr[i], i);
}
return new int[0];</pre>`},
            {n:426,t:"Maximum subarray sum (Kadane).",d:["medium"],a:`<pre>int best=a[0], cur=a[0];
for (int i=1; i&lt;a.length; i++) {
  cur = Math.max(a[i], cur+a[i]);
  best = Math.max(best, cur);
}
return best;</pre>`},
            {n:427,t:"Trapping Rain Water.",d:["hard"],a:`<pre>int l=0, r=h.length-1, lm=0, rm=0, res=0;
while (l&lt;r) {
  if (h[l]&lt;h[r]) { lm=Math.max(lm,h[l]); res+=lm-h[l++]; }
  else { rm=Math.max(rm,h[r]); res+=rm-h[r--]; }
}
return res;</pre>`},
            {n:428,t:"Implement Merge Sort.",d:["medium"],a:`<pre>void mergeSort(int[] a, int l, int r) {
  if (l&gt;=r) return;
  int m = (l+r)&gt;&gt;&gt;1;
  mergeSort(a, l, m); mergeSort(a, m+1, r);
  merge(a, l, m, r);
}</pre><p>Stable, O(n log n).</p>`},
            {n:429,t:"Rotate array right by k in-place.",d:["medium"],a:`<pre>k %= a.length;
reverse(a, 0, a.length-1);
reverse(a, 0, k-1);
reverse(a, k, a.length-1);</pre>`},
            {n:430,t:"Find missing number in [0,n] given array of n.",d:["easy"],a:`<pre>int missing = arr.length;
for (int i=0; i&lt;arr.length; i++) missing ^= i ^ arr[i];
return missing;</pre><p>XOR: pairs cancel.</p>`},
            {n:431,t:"Move zeros to end preserving order.",d:["medium"],a:`<pre>int w=0;
for (int i=0; i&lt;a.length; i++)
  if (a[i]!=0) a[w++] = a[i];
while (w&lt;a.length) a[w++] = 0;</pre>`},
            {n:432,t:"Boyer-Moore majority element.",d:["medium"],a:`<pre>int cand=0, count=0;
for (int x:a) {
  if (count==0) cand=x;
  count += (x==cand) ? 1 : -1;
}
return cand;</pre>`}
          ]
        },
        {
          id:"list-coding", n:16, title:"ArrayList & List — Coding", range:"Q433–Q437",
          questions: [
            {n:433,t:"removeIf to remove evens.",d:["easy"],a:`<pre>list.removeIf(n -&gt; n % 2 == 0);</pre>`},
            {n:434,t:"All pairs in List summing to target.",d:["medium"],a:`<pre>Set&lt;Integer&gt; seen = new HashSet&lt;&gt;();
List&lt;int[]&gt; out = new ArrayList&lt;&gt;();
for (int x:xs) {
  if (seen.contains(target-x)) out.add(new int[]{target-x, x});
  seen.add(x);
}</pre>`},
            {n:435,t:"Merge overlapping intervals.",d:["hard"],a:`<pre>Arrays.sort(intervals, (a,b)-&gt;a[0]-b[0]);
List&lt;int[]&gt; out = new ArrayList&lt;&gt;();
int[] cur = intervals[0];
for (int i=1; i&lt;intervals.length; i++) {
  if (intervals[i][0]&lt;=cur[1]) cur[1]=Math.max(cur[1], intervals[i][1]);
  else { out.add(cur); cur = intervals[i]; }
}
out.add(cur);</pre>`},
            {n:436,t:"Detect cycle in linked list (Floyd).",d:["medium"],a:`<pre>Node slow=head, fast=head;
while (fast!=null &amp;&amp; fast.next!=null) {
  slow=slow.next; fast=fast.next.next;
  if (slow==fast) return true;
}
return false;</pre>`},
            {n:437,t:"Kth largest using min-heap.",d:["medium"],a:`<pre>PriorityQueue&lt;Integer&gt; min = new PriorityQueue&lt;&gt;(k);
for (int x:xs) {
  min.offer(x);
  if (min.size()&gt;k) min.poll();
}
return min.peek();</pre>`}
          ]
        },
        {
          id:"map-coding", n:17, title:"HashMap & Map — Coding", range:"Q438–Q445",
          questions: [
            {n:438,t:"Character frequency count.",d:["easy"],a:`<pre>Map&lt;Character,Integer&gt; freq = new HashMap&lt;&gt;();
for (char c:s.toCharArray()) freq.merge(c, 1, Integer::sum);</pre>`},
            {n:439,t:"Group anagrams.",d:["medium"],a:`<pre>Map&lt;String, List&lt;String&gt;&gt; g = new HashMap&lt;&gt;();
for (String w:words) {
  char[] k = w.toCharArray(); Arrays.sort(k);
  g.computeIfAbsent(new String(k), kk -&gt; new ArrayList&lt;&gt;()).add(w);
}
return new ArrayList&lt;&gt;(g.values());</pre>`},
            {n:440,t:"Top-K most frequent elements.",d:["medium"],a:`<pre>Map&lt;String,Long&gt; freq = words.stream()
  .collect(Collectors.groupingBy(w-&gt;w, Collectors.counting()));
return freq.entrySet().stream()
  .sorted(Map.Entry.&lt;String,Long&gt;comparingByValue().reversed())
  .limit(k).map(Map.Entry::getKey).toList();</pre>`},
            {n:441,t:"LRU cache via LinkedHashMap.",d:["hard"],a:`<pre>class LRU&lt;K,V&gt; extends LinkedHashMap&lt;K,V&gt; {
  final int max;
  LRU(int max) { super(16,0.75f,true); this.max=max; }
  protected boolean removeEldestEntry(Map.Entry&lt;K,V&gt; e) { return size()&gt;max; }
}</pre>`},
            {n:442,t:"First non-repeating char with LinkedHashMap.",d:["medium"],a:`<pre>Map&lt;Character,Integer&gt; cnt = new LinkedHashMap&lt;&gt;();
for (char c:s.toCharArray()) cnt.merge(c, 1, Integer::sum);
return cnt.entrySet().stream().filter(e-&gt;e.getValue()==1)
  .map(Map.Entry::getKey).findFirst().orElse(null);</pre>`},
            {n:443,t:"Invert Map<K,V> to Map<V,K>.",d:["easy"],a:`<pre>Map&lt;V,K&gt; inv = map.entrySet().stream()
  .collect(Collectors.toMap(Map.Entry::getValue, Map.Entry::getKey));</pre>`},
            {n:444,t:"Histogram from int stream.",d:["easy"],a:`<pre>Map&lt;Integer,Long&gt; h = ints.stream()
  .collect(Collectors.groupingBy(i-&gt;i, Collectors.counting()));</pre>`},
            {n:445,t:"Two Sum returning values.",d:["easy"],a:`<pre>Map&lt;Integer,Integer&gt; m = new HashMap&lt;&gt;();
for (int x:a) {
  if (m.containsKey(target-x)) return new int[]{target-x, x};
  m.put(x, 1);
}</pre>`}
          ]
        },
        {
          id:"set-coding", n:18, title:"HashSet & Set — Coding", range:"Q446–Q449",
          questions: [
            {n:446,t:"Remove duplicates preserving order.",d:["easy"],a:`<pre>List&lt;String&gt; u = new ArrayList&lt;&gt;(new LinkedHashSet&lt;&gt;(list));</pre>`},
            {n:447,t:"Longest consecutive sequence.",d:["medium"],a:`<pre>Set&lt;Integer&gt; s = new HashSet&lt;&gt;();
for (int x:a) s.add(x);
int best=0;
for (int x:s) {
  if (!s.contains(x-1)) {
    int y=x;
    while (s.contains(y+1)) y++;
    best = Math.max(best, y-x+1);
  }
}
return best;</pre>`},
            {n:448,t:"Intersection of two int arrays.",d:["easy"],a:`<pre>Set&lt;Integer&gt; sa = Arrays.stream(a).boxed().collect(Collectors.toSet());
Set&lt;Integer&gt; sb = Arrays.stream(b).boxed().collect(Collectors.toSet());
sa.retainAll(sb);
return sa.stream().mapToInt(Integer::intValue).toArray();</pre>`},
            {n:449,t:"Common chars between two strings.",d:["easy"],a:`<pre>Set&lt;Character&gt; cs = new HashSet&lt;&gt;();
for (char c:a.toCharArray()) cs.add(c);
for (char c:b.toCharArray()) if (cs.contains(c)) return true;
return false;</pre>`}
          ]
        },
        {
          id:"queue-coding", n:19, title:"Queue & Deque — Coding", range:"Q450–Q452",
          questions: [
            {n:450,t:"Simple queue with ArrayDeque.",d:["easy"],a:`<pre>Deque&lt;Integer&gt; q = new ArrayDeque&lt;&gt;();
q.offer(1); int x = q.poll(); int p = q.peek();</pre>`},
            {n:451,t:"Sliding window maximum.",d:["hard"],a:`<pre>Deque&lt;Integer&gt; dq = new ArrayDeque&lt;&gt;();
int[] out = new int[a.length-k+1];
for (int i=0; i&lt;a.length; i++) {
  while (!dq.isEmpty() &amp;&amp; dq.peekFirst()&lt;=i-k) dq.pollFirst();
  while (!dq.isEmpty() &amp;&amp; a[dq.peekLast()]&lt;a[i]) dq.pollLast();
  dq.offerLast(i);
  if (i&gt;=k-1) out[i-k+1] = a[dq.peekFirst()];
}</pre>`},
            {n:452,t:"Circular queue with fixed array.",d:["medium"],a:`<pre>class CQ {
  int[] a; int head=0, tail=0, size=0;
  CQ(int cap) { a = new int[cap]; }
  boolean offer(int x) {
    if (size==a.length) return false;
    a[tail] = x; tail=(tail+1)%a.length; size++;
    return true;
  }
  int poll() {
    if (size==0) throw new NoSuchElementException();
    int x = a[head]; head=(head+1)%a.length; size--;
    return x;
  }
}</pre>`}
          ]
        },
        {
          id:"stack-coding", n:20, title:"Stack — Coding", range:"Q453–Q456",
          questions: [
            {n:453,t:"Balanced parentheses.",d:["easy"],a:`<pre>Map&lt;Character,Character&gt; pair = Map.of(')','(', ']','[', '}','{');
Deque&lt;Character&gt; st = new ArrayDeque&lt;&gt;();
for (char c:s.toCharArray()) {
  if ("([{".indexOf(c)&gt;=0) st.push(c);
  else if (st.isEmpty() || st.pop()!=pair.get(c)) return false;
}
return st.isEmpty();</pre>`},
            {n:454,t:"MinStack with O(1) getMin.",d:["medium"],a:`<pre>Deque&lt;Integer&gt; st = new ArrayDeque&lt;&gt;();
Deque&lt;Integer&gt; min = new ArrayDeque&lt;&gt;();
void push(int x) {
  st.push(x);
  if (min.isEmpty() || x&lt;=min.peek()) min.push(x);
}
void pop() { if (st.pop().equals(min.peek())) min.pop(); }</pre>`},
            {n:455,t:"Reverse Polish Notation eval.",d:["medium"],a:`<pre>Deque&lt;Integer&gt; st = new ArrayDeque&lt;&gt;();
for (String t:tokens) {
  if ("+-*/".contains(t)) {
    int b=st.pop(), a=st.pop();
    st.push(switch(t) { case "+"-&gt;a+b; case "-"-&gt;a-b; case "*"-&gt;a*b; case "/"-&gt;a/b; default-&gt;0; });
  } else st.push(Integer.parseInt(t));
}
return st.pop();</pre>`},
            {n:456,t:"Next Greater Element with monotonic stack.",d:["medium"],a:`<pre>int[] res = new int[a.length];
Arrays.fill(res, -1);
Deque&lt;Integer&gt; st = new ArrayDeque&lt;&gt;();
for (int i=0; i&lt;a.length; i++) {
  while (!st.isEmpty() &amp;&amp; a[st.peek()]&lt;a[i]) res[st.pop()] = a[i];
  st.push(i);
}</pre>`}
          ]
        },
        {
          id:"collections-coding", n:21, title:"Collections Utility — Coding", range:"Q457–Q459",
          questions: [
            {n:457,t:"Count occurrences with frequency().",d:["easy"],a:`<pre>int n = Collections.frequency(list, target);</pre>`},
            {n:458,t:"Rotate left by k.",d:["easy"],a:`<pre>Collections.rotate(list, -k);</pre>`},
            {n:459,t:"Max with custom Comparator.",d:["easy"],a:`<pre>Person oldest = Collections.max(people, Comparator.comparingInt(Person::age));</pre>`}
          ]
        },
        {
          id:"stream-coding", n:22, title:"Stream API — Coding", range:"Q460–Q469",
          questions: [
            {n:460,t:"Filter even numbers.",d:["easy"],a:`<pre>List&lt;Integer&gt; evens = nums.stream()
  .filter(n -&gt; n%2==0).toList();</pre>`},
            {n:461,t:"Sum/avg/min/max via summaryStatistics.",d:["easy"],a:`<pre>IntSummaryStatistics s = nums.stream()
  .mapToInt(Integer::intValue).summaryStatistics();</pre>`},
            {n:462,t:"Group words by first letter.",d:["medium"],a:`<pre>Map&lt;Character, List&lt;String&gt;&gt; m = words.stream()
  .collect(Collectors.groupingBy(w -&gt; w.charAt(0)));</pre>`},
            {n:463,t:"flatMap nested lists and sum.",d:["medium"],a:`<pre>int total = lists.stream()
  .flatMap(List::stream)
  .mapToInt(Integer::intValue).sum();</pre>`},
            {n:464,t:"Partition primes vs non-primes.",d:["medium"],a:`<pre>Map&lt;Boolean, List&lt;Integer&gt;&gt; p = nums.stream()
  .collect(Collectors.partitioningBy(MyMath::isPrime));</pre>`},
            {n:465,t:"Word frequency sorted desc.",d:["medium"],a:`<pre>List&lt;Map.Entry&lt;String,Long&gt;&gt; r = words.stream()
  .collect(Collectors.groupingBy(w-&gt;w, Collectors.counting()))
  .entrySet().stream()
  .sorted(Map.Entry.&lt;String,Long&gt;comparingByValue().reversed())
  .toList();</pre>`},
            {n:466,t:"List<Integer> to Map<Integer,String>.",d:["easy"],a:`<pre>Map&lt;Integer,String&gt; m = nums.stream()
  .collect(Collectors.toMap(n-&gt;n, n-&gt;String.valueOf(n*n)));</pre>`},
            {n:467,t:"Second highest distinct.",d:["medium"],a:`<pre>Optional&lt;Integer&gt; sec = nums.stream()
  .distinct().sorted(Comparator.reverseOrder())
  .skip(1).findFirst();</pre>`},
            {n:468,t:"Average string length.",d:["easy"],a:`<pre>OptionalDouble avg = strs.stream().mapToInt(String::length).average();</pre>`},
            {n:469,t:"Comma-join strings.",d:["easy"],a:`<pre>String j = strs.stream().collect(Collectors.joining(", "));</pre>`}
          ]
        },
        {
          id:"math-coding", n:23, title:"Math Methods — Coding", range:"Q470–Q473",
          questions: [
            {n:470,t:"Perfect square check.",d:["easy"],a:`<pre>if (n&lt;0) return false;
long r = (long)Math.sqrt(n);
return r*r==n || (r+1)*(r+1)==n;</pre>`},
            {n:471,t:"Optimized prime check.",d:["easy"],a:`<pre>if (n&lt;2) return false;
if (n%2==0) return n==2;
for (int i=3; (long)i*i&lt;=n; i+=2) if (n%i==0) return false;
return true;</pre>`},
            {n:472,t:"Fibonacci closed form.",d:["medium"],a:`<pre>double phi = (1+Math.sqrt(5))/2;
return (long) Math.round(Math.pow(phi, n)/Math.sqrt(5));</pre><p>Accurate up to ~n=70.</p>`},
            {n:473,t:"Convert base 2 to base 16.",d:["easy"],a:`<pre>String hex = Integer.toString(Integer.parseInt("101", 2), 16);</pre>`}
          ]
        },
        {
          id:"wrapper-coding", n:24, title:"Wrapper & Type Conversion — Coding", range:"Q474–Q477",
          questions: [
            {n:474,t:"Parse CSV ints.",d:["easy"],a:`<pre>List&lt;Integer&gt; nums = Arrays.stream(csv.split(","))
  .map(String::trim).map(Integer::parseInt).toList();</pre>`},
            {n:475,t:"Int to binary/octal/hex.",d:["easy"],a:`<pre>Integer.toBinaryString(255);  // "11111111"
Integer.toOctalString(255);   // "377"
Integer.toHexString(255);     // "ff"</pre>`},
            {n:476,t:"Safe parseInt with default.",d:["easy"],a:`<pre>try { return Integer.parseInt(s.trim()); }
catch (Exception e) { return dflt; }</pre>`},
            {n:477,t:"Boolean wrapper to primitive null-safe.",d:["easy"],a:`<pre>boolean b = Boolean.TRUE.equals(wrapper);</pre>`}
          ]
        },
        {
          id:"optional-coding", n:25, title:"Optional — Coding", range:"Q478–Q481",
          questions: [
            {n:478,t:"Find by prefix returning Optional.",d:["easy"],a:`<pre>Optional&lt;String&gt; first = list.stream()
  .filter(s -&gt; s.startsWith(prefix)).findFirst();</pre>`},
            {n:479,t:"orElse vs orElseGet.",d:["medium"],a:`<pre>opt.orElse(expensive());        // always evaluated
opt.orElseGet(() -&gt; expensive()); // lazy</pre>`},
            {n:480,t:"Null-chain User → Address → City.",d:["medium"],a:`<pre>String city = Optional.ofNullable(user)
  .map(User::getAddress).map(Address::getCity)
  .orElse("Unknown");</pre>`},
            {n:481,t:"ifPresentOrElse pattern.",d:["easy"],a:`<pre>opt.ifPresentOrElse(
  v -&gt; print(v),
  () -&gt; warn("missing")
);</pre>`}
          ]
        },
        {
          id:"comparator-coding", n:26, title:"Comparable & Comparator — Coding", range:"Q482–Q485",
          questions: [
            {n:482,t:"Sort by length, tie-break alphabetical.",d:["easy"],a:`<pre>list.sort(Comparator
  .comparingInt(String::length)
  .thenComparing(Comparator.naturalOrder()));</pre>`},
            {n:483,t:"Sort by dept (asc) then salary (desc).",d:["medium"],a:`<pre>emps.sort(Comparator
  .comparing(Employee::getDept)
  .thenComparing(Comparator.comparingDouble(Employee::getSalary).reversed()));</pre>`},
            {n:484,t:"Nulls last.",d:["medium"],a:`<pre>list.sort(Comparator.nullsLast(Comparator.naturalOrder()));</pre>`},
            {n:485,t:"Top-3 by salary with PriorityQueue.",d:["medium"],a:`<pre>PriorityQueue&lt;Employee&gt; min = new PriorityQueue&lt;&gt;(
  Comparator.comparingDouble(Employee::getSalary));
for (Employee e:emps) {
  min.offer(e);
  if (min.size()&gt;3) min.poll();
}</pre>`}
          ]
        },
        {
          id:"mixed-coding", n:27, title:"Mixed / Real Interview Challenges", range:"Q486–Q500",
          questions: [
            {n:486,t:"Valid nested brackets via Stack + Map.",d:["medium","mixed"],a:`<pre>Map&lt;Character,Character&gt; m = Map.of(')','(', ']','[', '}','{');
Deque&lt;Character&gt; st = new ArrayDeque&lt;&gt;();
for (char c:s.toCharArray()) {
  if (m.containsValue(c)) st.push(c);
  else if (st.isEmpty() || st.pop()!=m.get(c)) return false;
}
return st.isEmpty();</pre>`},
            {n:487,t:"In-memory LRU with LinkedHashMap.",d:["medium","mixed"],a:`<pre>Map&lt;K,V&gt; lru = new LinkedHashMap&lt;&gt;(16, 0.75f, true) {
  protected boolean removeEldestEntry(Map.Entry&lt;K,V&gt; e) { return size()&gt;CAP; }
};</pre>`},
            {n:488,t:"Frequency-sort: most frequent first.",d:["medium","mixed"],a:`<pre>Map&lt;Integer,Long&gt; f = nums.stream()
  .collect(Collectors.groupingBy(n-&gt;n, Collectors.counting()));
nums.sort((a,b) -&gt; {
  int c = Long.compare(f.get(b), f.get(a));
  return c!=0 ? c : Integer.compare(a,b);
});</pre>`},
            {n:489,t:`Decode "2[ab3[c]]" → "abcccabccc".`,d:["hard","mixed"],a:`<pre>Deque&lt;Integer&gt; counts = new ArrayDeque&lt;&gt;();
Deque&lt;StringBuilder&gt; strs = new ArrayDeque&lt;&gt;();
StringBuilder cur = new StringBuilder(); int k=0;
for (char c:s.toCharArray()) {
  if (Character.isDigit(c)) k = k*10 + (c-'0');
  else if (c=='[') { counts.push(k); strs.push(cur); k=0; cur=new StringBuilder(); }
  else if (c==']') {
    int n = counts.pop(); StringBuilder p = strs.pop();
    for (int i=0; i&lt;n; i++) p.append(cur);
    cur = p;
  } else cur.append(c);
}</pre>`},
            {n:490,t:"Trie with HashMap nodes.",d:["hard","mixed"],a:`<pre>class Node { Map&lt;Character,Node&gt; ch = new HashMap&lt;&gt;(); boolean end; }
void insert(String w) {
  Node n = root;
  for (char c:w.toCharArray())
    n = n.ch.computeIfAbsent(c, k -&gt; new Node());
  n.end = true;
}</pre>`},
            {n:491,t:"Course schedule cycle detection (DFS).",d:["hard","mixed"],a:`<pre>boolean canFinish(int n, int[][] pre) {
  List&lt;List&lt;Integer&gt;&gt; g = new ArrayList&lt;&gt;();
  for (int i=0; i&lt;n; i++) g.add(new ArrayList&lt;&gt;());
  for (int[] e:pre) g.get(e[1]).add(e[0]);
  int[] state = new int[n];
  for (int i=0; i&lt;n; i++) if (cycle(i, g, state)) return false;
  return true;
}</pre>`},
            {n:492,t:"Twitter feed: post/follow/getNewsFeed.",d:["hard","mixed"],a:`<pre>int ts=0;
Map&lt;Integer, List&lt;int[]&gt;&gt; tweets = new HashMap&lt;&gt;();
Map&lt;Integer, Set&lt;Integer&gt;&gt; follows = new HashMap&lt;&gt;();
void post(int u, int id) {
  tweets.computeIfAbsent(u, k-&gt;new ArrayList&lt;&gt;()).add(new int[]{++ts, id});
}</pre>`},
            {n:493,t:"Producer-Consumer with BlockingQueue.",d:["medium","mixed"],a:`<pre>BlockingQueue&lt;Integer&gt; q = new ArrayBlockingQueue&lt;&gt;(10);
new Thread(() -&gt; { for (int i=0; i&lt;100; i++) q.put(i); }).start();
new Thread(() -&gt; { while(true) process(q.take()); }).start();</pre>`},
            {n:494,t:"Token Bucket rate limiter.",d:["hard","mixed"],a:`<pre>class TokenBucket {
  long capacity, refillPerSec, tokens, lastNs;
  synchronized boolean allow() {
    long now = System.nanoTime();
    long add = (now-lastNs)*refillPerSec/1_000_000_000L;
    if (add&gt;0) { tokens=Math.min(capacity, tokens+add); lastNs=now; }
    if (tokens&gt;0) { tokens--; return true; }
    return false;
  }
}</pre>`},
            {n:495,t:"Longest substring with K distinct chars.",d:["hard","mixed"],a:`<pre>Map&lt;Character,Integer&gt; cnt = new HashMap&lt;&gt;();
int best=0, l=0;
for (int r=0; r&lt;s.length(); r++) {
  cnt.merge(s.charAt(r), 1, Integer::sum);
  while (cnt.size()&gt;k) {
    char c = s.charAt(l++);
    if (cnt.merge(c, -1, Integer::sum)==0) cnt.remove(c);
  }
  best = Math.max(best, r-l+1);
}</pre>`},
            {n:496,t:"Debouncer with ScheduledExecutor.",d:["medium","mixed"],a:`<pre>final ScheduledExecutorService es = Executors.newSingleThreadScheduledExecutor();
ScheduledFuture&lt;?&gt; pending;
void debounce(Runnable r, long ms) {
  if (pending!=null) pending.cancel(false);
  pending = es.schedule(r, ms, TimeUnit.MILLISECONDS);
}</pre>`},
            {n:497,t:"Thread-safe singleton (DCL).",d:["medium","mixed"],a:`<pre>private static volatile Singleton INSTANCE;
public static Singleton get() {
  Singleton local = INSTANCE;
  if (local==null) {
    synchronized (Singleton.class) {
      local = INSTANCE;
      if (local==null) INSTANCE = local = new Singleton();
    }
  }
  return local;
}</pre>`},
            {n:498,t:"Dijkstra's shortest path.",d:["hard","mixed"],a:`<pre>int[] dist = new int[n];
Arrays.fill(dist, Integer.MAX_VALUE);
dist[src] = 0;
PriorityQueue&lt;int[]&gt; pq = new PriorityQueue&lt;&gt;((a,b)-&gt;a[1]-b[1]);
pq.offer(new int[]{src, 0});
while (!pq.isEmpty()) {
  int[] cur = pq.poll();
  if (cur[1] &gt; dist[cur[0]]) continue;
  for (int[] nbr : graph[cur[0]]) {
    int nd = dist[cur[0]] + nbr[1];
    if (nd &lt; dist[nbr[0]]) { dist[nbr[0]] = nd; pq.offer(new int[]{nbr[0], nd}); }
  }
}</pre>`},
            {n:499,t:"Word Ladder shortest transformation.",d:["hard","mixed"],a:`<pre>Set&lt;String&gt; dict = new HashSet&lt;&gt;(wordList);
if (!dict.contains(end)) return 0;
Queue&lt;String&gt; q = new ArrayDeque&lt;&gt;(); q.offer(begin);
int level = 1;
while (!q.isEmpty()) {
  for (int i = q.size(); i&gt;0; i--) {
    String w = q.poll();
    if (w.equals(end)) return level;
    char[] arr = w.toCharArray();
    for (int j = 0; j&lt;arr.length; j++) {
      char old = arr[j];
      for (char c='a'; c&lt;='z'; c++) {
        arr[j] = c; String n = new String(arr);
        if (dict.remove(n)) q.offer(n);
      }
      arr[j] = old;
    }
  }
  level++;
}
return 0;</pre>`},
            {n:500,t:"Median from data stream (two heaps).",d:["hard","mixed"],a:`<pre>PriorityQueue&lt;Integer&gt; lo = new PriorityQueue&lt;&gt;(Comparator.reverseOrder());
PriorityQueue&lt;Integer&gt; hi = new PriorityQueue&lt;&gt;();
void add(int n) {
  lo.offer(n);
  hi.offer(lo.poll());
  if (hi.size() &gt; lo.size()) lo.offer(hi.poll());
}
double median() {
  return lo.size() &gt; hi.size() ? lo.peek() : (lo.peek()+hi.peek())/2.0;
}</pre>`}
          ]
        }
      ]
    }
  ]
};
