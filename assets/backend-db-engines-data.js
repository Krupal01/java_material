/* =========================================================
   Backend DB Engines — SQL (Comprehensive), PostgreSQL, MongoDB, Oracle
   MAANG-level interview preparation — Beginner to Expert.
   ========================================================= */
window.BACKEND_DB_ENGINES_DATA = {
  parts: [

    /* =====================================================
       PART 1 · SQL FUNDAMENTALS
    ===================================================== */
    {
      label: "PART 1 · SQL FUNDAMENTALS",
      sections: [
        {
          id: "sql-basics", n: 1, title: "SELECT, WHERE, DISTINCT, LIMIT — Core Queries",
          desc: "Every MAANG SQL round starts with these building blocks. Master them before moving to joins or window functions.",
          questions: [
            {n:1, t:"What is a basic SELECT query and how do you filter rows?", d:["beginner"], a:`
<p>SELECT retrieves columns from a table. WHERE filters rows <em>before</em> they reach you.</p>
<pre>-- All employees
SELECT * FROM employees;

-- Only specific columns
SELECT emp_id, name, salary, department FROM employees;

-- Filter rows
SELECT name, salary FROM employees WHERE salary &gt; 80000;

-- Multiple conditions
SELECT name FROM employees
WHERE department = 'Engineering' AND salary &gt; 100000;

-- OR condition
SELECT name FROM employees
WHERE department = 'Engineering' OR department = 'Product';</pre>
<p><strong>Interview tip:</strong> Always prefer naming columns explicitly over <code>SELECT *</code> — it avoids over-fetching and breaks fewer things when tables change.</p>`},

            {n:2, t:"How does DISTINCT work and when should you use it?", d:["beginner"], a:`
<p>DISTINCT removes duplicate rows in the result set — it operates on the <em>combined output row</em>, not per column.</p>
<pre>-- Unique departments
SELECT DISTINCT department FROM employees;

-- Unique combination of department + role
SELECT DISTINCT department, role FROM employees;

-- COUNT of unique departments
SELECT COUNT(DISTINCT department) AS dept_count FROM employees;</pre>
<p><strong>Performance note:</strong> DISTINCT forces a sort or hash-deduplicate operation. On large tables consider whether a GROUP BY with no aggregation, or a covering index, gives the same result cheaper.</p>`},

            {n:3, t:"How do LIMIT, OFFSET, and pagination work in SQL?", d:["beginner","intermediate"], a:`
<p>LIMIT caps how many rows are returned. OFFSET skips rows — together they implement pagination.</p>
<pre>-- First 10 rows
SELECT * FROM employees ORDER BY emp_id LIMIT 10;

-- Page 3 (rows 21-30) — page size 10
SELECT * FROM employees ORDER BY emp_id LIMIT 10 OFFSET 20;

-- Oracle (no LIMIT keyword before 12c)
SELECT * FROM (
  SELECT e.*, ROWNUM rn FROM employees e WHERE ROWNUM &lt;= 30
) WHERE rn &gt; 20;</pre>
<p><strong>MAANG gotcha — deep pagination problem:</strong> LIMIT 10 OFFSET 10000000 still reads 10,000,010 rows and throws away the first 10M. Use keyset pagination instead:</p>
<pre>-- Keyset pagination — fast on large tables
SELECT * FROM employees WHERE emp_id &gt; :last_seen_id ORDER BY emp_id LIMIT 10;</pre>
<p>Keyset pagination uses the index directly and does not scan discarded rows.</p>`},

            {n:4, t:"How do you handle NULL in SQL — IS NULL, COALESCE, NULLIF?", d:["beginner","intermediate"], a:`
<p>NULL means <em>unknown</em>, not zero or empty string. Comparisons with NULL using = always return NULL (falsy).</p>
<pre>-- Wrong — this never matches NULLs
SELECT * FROM employees WHERE manager_id = NULL;   -- BAD

-- Correct
SELECT * FROM employees WHERE manager_id IS NULL;
SELECT * FROM employees WHERE manager_id IS NOT NULL;

-- COALESCE — returns first non-NULL value
SELECT name, COALESCE(phone, email, 'no-contact') AS contact
FROM employees;

-- NULLIF — returns NULL if both args are equal (avoids divide-by-zero)
SELECT revenue / NULLIF(visits, 0) AS revenue_per_visit
FROM traffic_stats;

-- NVL is Oracle-specific equivalent to COALESCE for 2 args
SELECT NVL(phone, 'N/A') FROM employees; -- Oracle</pre>
<p><strong>Interview tip:</strong> Aggregates (SUM, COUNT, AVG) ignore NULLs automatically. COUNT(*) counts all rows; COUNT(column) counts only non-NULL values in that column.</p>`},

            {n:5, t:"What are SQL data types and how does casting work?", d:["beginner","intermediate"], a:`
<p>Choosing the right data type saves storage, enables better indexes, and avoids implicit-cast bugs.</p>
<table>
  <tr><th>Category</th><th>Types</th><th>Notes</th></tr>
  <tr><td>Integer</td><td>SMALLINT, INT, BIGINT</td><td>Use BIGINT for IDs on large tables</td></tr>
  <tr><td>Decimal</td><td>NUMERIC(p,s), DECIMAL</td><td>Use for money — never FLOAT</td></tr>
  <tr><td>String</td><td>VARCHAR(n), TEXT, CHAR(n)</td><td>TEXT for unlimited, CHAR pads spaces</td></tr>
  <tr><td>Date/Time</td><td>DATE, TIMESTAMP, TIMESTAMPTZ</td><td>Store UTC with TIMESTAMPTZ</td></tr>
  <tr><td>Boolean</td><td>BOOLEAN</td><td>TRUE/FALSE/NULL</td></tr>
  <tr><td>JSON</td><td>JSON, JSONB (PostgreSQL)</td><td>JSONB is indexed and binary</td></tr>
</table>
<pre>-- Explicit casting (PostgreSQL)
SELECT CAST('2025-01-01' AS DATE);
SELECT '42'::INTEGER;  -- PostgreSQL shorthand

-- Avoid implicit cast mismatches on WHERE clauses
-- Bad: index not used if column is VARCHAR but you pass INT
WHERE account_id = '12345'   -- string literal matches VARCHAR type correctly</pre>`},

            {n:6, t:"How do INSERT, UPDATE, DELETE work and what safety patterns matter?", d:["beginner","intermediate"], a:`
<pre>-- INSERT single row
INSERT INTO employees (name, department, salary)
VALUES ('Alice', 'Engineering', 120000);

-- INSERT multiple rows (more efficient than multiple single inserts)
INSERT INTO employees (name, department, salary) VALUES
  ('Bob', 'Product', 95000),
  ('Carol', 'Design', 88000);

-- INSERT from SELECT
INSERT INTO archive_employees
SELECT * FROM employees WHERE termination_date &lt; CURRENT_DATE;

-- UPDATE
UPDATE employees
SET salary = salary * 1.10, updated_at = NOW()
WHERE department = 'Engineering';

-- DELETE
DELETE FROM employees WHERE termination_date &lt; '2020-01-01';

-- UPSERT (PostgreSQL — INSERT or UPDATE on conflict)
INSERT INTO employee_stats (emp_id, login_count)
VALUES (101, 1)
ON CONFLICT (emp_id) DO UPDATE SET login_count = employee_stats.login_count + 1;</pre>
<p><strong>Safety pattern:</strong> Always run a SELECT with the same WHERE before UPDATE/DELETE to verify the affected rows count. Wrap in a transaction and check before committing.</p>
<pre>BEGIN;
SELECT COUNT(*) FROM employees WHERE department = 'OldDept';  -- verify
UPDATE employees SET department = 'NewDept' WHERE department = 'OldDept';
-- ROLLBACK;  -- if count looks wrong
COMMIT;</pre>`}
          ]
        },

        /* ---- Section 2: Joins ---- */
        {
          id: "sql-joins", n: 2, title: "SQL JOINs — INNER, LEFT, RIGHT, FULL, SELF, CROSS",
          desc: "Joins are the most-tested SQL topic in MAANG interviews. Know exactly which rows each join type includes or excludes.",
          questions: [
            {n:1, t:"Explain all JOIN types with examples", d:["beginner","intermediate"], a:`
<p>Think of a Venn diagram with two circles: <strong>Left table (A)</strong> and <strong>Right table (B)</strong>.</p>
<table>
  <tr><th>Join Type</th><th>Rows Returned</th></tr>
  <tr><td>INNER JOIN</td><td>Only rows with a match in BOTH tables</td></tr>
  <tr><td>LEFT JOIN</td><td>All rows from A + matched rows from B (NULLs when no match in B)</td></tr>
  <tr><td>RIGHT JOIN</td><td>All rows from B + matched rows from A</td></tr>
  <tr><td>FULL OUTER JOIN</td><td>All rows from both; NULLs where no match</td></tr>
  <tr><td>CROSS JOIN</td><td>Cartesian product — every A row with every B row</td></tr>
  <tr><td>SELF JOIN</td><td>Join a table to itself</td></tr>
</table>
<pre>-- employees: emp_id, name, dept_id, salary, manager_id
-- departments: dept_id, dept_name, budget

-- INNER JOIN — only employees WITH a department
SELECT e.name, d.dept_name
FROM employees e
INNER JOIN departments d ON e.dept_id = d.dept_id;

-- LEFT JOIN — all employees, even those with no department
SELECT e.name, d.dept_name
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.dept_id;

-- FULL OUTER JOIN — all employees AND all departments
SELECT e.name, d.dept_name
FROM employees e
FULL OUTER JOIN departments d ON e.dept_id = d.dept_id;

-- CROSS JOIN — pair every product with every colour
SELECT p.product_name, c.colour
FROM products p CROSS JOIN colours c;</pre>`},

            {n:2, t:"What is a SELF JOIN and when do you use it?", d:["intermediate"], a:`
<p>A SELF JOIN joins a table to itself. Classic use case: employee-manager hierarchy where both are in the same table.</p>
<pre>-- employees: emp_id, name, manager_id (points to emp_id)
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.emp_id;

-- Find all employees who earn more than their manager
SELECT e.name AS employee, e.salary AS emp_salary,
       m.name AS manager, m.salary AS mgr_salary
FROM employees e
JOIN employees m ON e.manager_id = m.emp_id
WHERE e.salary &gt; m.salary;</pre>
<p><strong>Interview tip:</strong> Always alias both instances of the table (e and m). Self joins are tested often in hierarchy queries alongside recursive CTEs.</p>`},

            {n:3, t:"How do you join more than two tables?", d:["intermediate"], a:`
<pre>-- orders to order_items to products to categories
SELECT
  o.order_id,
  c.name AS customer,
  p.product_name,
  cat.category_name,
  oi.quantity,
  oi.unit_price
FROM orders o
JOIN customers c    ON o.customer_id = c.customer_id
JOIN order_items oi ON o.order_id    = oi.order_id
JOIN products p     ON oi.product_id = p.product_id
JOIN categories cat ON p.category_id = cat.category_id
WHERE o.status = 'COMPLETED'
ORDER BY o.order_id;</pre>
<p><strong>Optimizer note:</strong> The query planner decides the join <em>order</em> internally. You control the logical join; the engine picks the physical strategy (hash join, nested loop, merge join) based on statistics and indexes.</p>`},

            {n:4, t:"JOIN vs Subquery — when is each better for performance?", d:["intermediate","advanced"], a:`
<pre>-- Correlated subquery (runs per row — often slow)
SELECT name FROM employees e
WHERE salary &gt; (
  SELECT AVG(salary) FROM employees WHERE dept_id = e.dept_id
);

-- JOIN approach — derived table runs once
SELECT e.name
FROM employees e
JOIN (
  SELECT dept_id, AVG(salary) AS avg_sal
  FROM employees
  GROUP BY dept_id
) dept_avg ON e.dept_id = dept_avg.dept_id
WHERE e.salary &gt; dept_avg.avg_sal;

-- CTE approach (same plan, more readable)
WITH dept_avg AS (
  SELECT dept_id, AVG(salary) AS avg_sal
  FROM employees GROUP BY dept_id
)
SELECT e.name
FROM employees e
JOIN dept_avg da ON e.dept_id = da.dept_id
WHERE e.salary &gt; da.avg_sal;</pre>
<p><strong>Rule:</strong> Correlated subqueries run N times. Derived table / CTE runs once. Use EXPLAIN to verify the optimizer treats them the same in your DB.</p>`},

            {n:5, t:"Anti-join pattern — find rows with no match in another table", d:["intermediate","advanced"], a:`
<pre>-- Find employees with no matching department (3 equivalent ways)

-- Way 1: LEFT JOIN + IS NULL (most common)
SELECT e.name
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.dept_id
WHERE d.dept_id IS NULL;

-- Way 2: NOT EXISTS (NULL-safe, often efficient)
SELECT name FROM employees e
WHERE NOT EXISTS (
  SELECT 1 FROM departments d WHERE d.dept_id = e.dept_id
);

-- Way 3: NOT IN (careful with NULLs in subquery!)
SELECT name FROM employees
WHERE dept_id NOT IN (
  SELECT dept_id FROM departments WHERE dept_id IS NOT NULL
);</pre>
<p><strong>MAANG tip:</strong> NOT IN fails silently when subquery returns any NULL — the whole WHERE evaluates to NULL (false). Prefer NOT EXISTS or LEFT JOIN + IS NULL.</p>`}
          ]
        },

        /* ---- Section 3: Sorting & Aggregation ---- */
        {
          id: "sql-aggregation", n: 3, title: "Sorting, Aggregation, GROUP BY, HAVING",
          desc: "Aggregation collapses many rows into summary rows. GROUP BY and HAVING are among the most interview-tested clauses.",
          questions: [
            {n:1, t:"How does ORDER BY work — multi-column, expressions, NULLS FIRST/LAST?", d:["beginner"], a:`
<pre>-- Single column
SELECT name, salary FROM employees ORDER BY salary DESC;

-- Multi-column — sort by department, then salary descending within each dept
SELECT dept_id, name, salary
FROM employees
ORDER BY dept_id ASC, salary DESC;

-- Order by expression
SELECT name, salary * 12 AS annual_salary
FROM employees
ORDER BY salary * 12 DESC;

-- NULL placement (PostgreSQL / standard SQL)
SELECT name, commission
FROM employees
ORDER BY commission DESC NULLS LAST;  -- NULLs at bottom
-- or NULLS FIRST</pre>
<p><strong>Performance tip:</strong> ORDER BY is cheapest when the sort column has a supporting index — the DB reads rows in order without a sort step (shown as "Index Scan Backward" in EXPLAIN).</p>`},

            {n:2, t:"Explain all aggregate functions — COUNT, SUM, AVG, MIN, MAX", d:["beginner","intermediate"], a:`
<pre>SELECT
  COUNT(*)                            AS total_rows,
  COUNT(commission)                   AS employees_with_commission,  -- NULLs excluded
  COUNT(DISTINCT department)          AS unique_departments,
  SUM(salary)                         AS total_payroll,
  AVG(salary)                         AS avg_salary,
  ROUND(AVG(salary), 2)               AS avg_salary_rounded,
  MIN(hire_date)                      AS earliest_hire,
  MAX(salary)                         AS highest_salary,
  SUM(CASE WHEN salary &gt; 100000 THEN 1 ELSE 0 END) AS high_earners
FROM employees;

-- Aggregate per group
SELECT department, COUNT(*) AS headcount, AVG(salary) AS avg_sal
FROM employees
GROUP BY department
ORDER BY avg_sal DESC;</pre>`},

            {n:3, t:"How does GROUP BY work and what is the HAVING clause?", d:["beginner","intermediate"], a:`
<p><strong>WHERE</strong> filters individual rows <em>before</em> grouping. <strong>HAVING</strong> filters <em>group-level</em> results after aggregation.</p>
<pre>-- Departments with more than 5 employees
SELECT department, COUNT(*) AS headcount
FROM employees
GROUP BY department
HAVING COUNT(*) &gt; 5
ORDER BY headcount DESC;

-- Departments with avg salary above company average
SELECT department, AVG(salary) AS avg_sal
FROM employees
GROUP BY department
HAVING AVG(salary) &gt; (SELECT AVG(salary) FROM employees);

-- Combined WHERE + HAVING
SELECT department, AVG(salary) AS avg_sal
FROM employees
WHERE hire_date &gt;= '2020-01-01'    -- filter rows first
GROUP BY department
HAVING AVG(salary) &gt; 90000         -- then filter groups
ORDER BY avg_sal DESC;</pre>
<p><strong>SQL execution order:</strong> FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT</p>`},

            {n:4, t:"What is ROLLUP and CUBE for multi-level aggregation?", d:["advanced"], a:`
<pre>-- ROLLUP — subtotals at each level plus grand total
SELECT department, role, SUM(salary) AS total_salary
FROM employees
GROUP BY ROLLUP(department, role);
-- Result:
-- ('Engineering', 'SWE', 500000)
-- ('Engineering', 'Manager', 200000)
-- ('Engineering', NULL, 700000)   department subtotal
-- (NULL, NULL, 1200000)            grand total

-- CUBE — subtotals for ALL combinations
SELECT department, year, SUM(revenue)
FROM sales
GROUP BY CUBE(department, year);
-- Generates: (dept, year), (dept, NULL), (NULL, year), (NULL, NULL)

-- GROUPING SETS — manual control over which groupings appear
SELECT department, role, COUNT(*) AS headcount
FROM employees
GROUP BY GROUPING SETS (
  (department, role),
  (department),
  ()
);</pre>`},

            {n:5, t:"String and date functions used in SELECT and GROUP BY", d:["beginner","intermediate"], a:`
<pre>-- Date functions
SELECT
  CURRENT_DATE,
  NOW(),
  DATE_TRUNC('month', hire_date) AS hire_month,
  EXTRACT(YEAR FROM hire_date) AS hire_year,
  AGE(NOW(), hire_date) AS tenure,
  hire_date + INTERVAL '90 days' AS probation_end
FROM employees;

-- Group by month
SELECT DATE_TRUNC('month', order_date) AS month, SUM(total) AS revenue
FROM orders
GROUP BY DATE_TRUNC('month', order_date)
ORDER BY month;

-- String functions
SELECT
  UPPER(name), LOWER(name), LENGTH(name),
  TRIM(name), SUBSTRING(name FROM 1 FOR 3),
  CONCAT(first_name, ' ', last_name) AS full_name
FROM employees;</pre>`}
          ]
        }
      ]
    },

    /* =====================================================
       PART 2 · WINDOW FUNCTIONS — MAANG CRITICAL
    ===================================================== */
    {
      label: "PART 2 · WINDOW FUNCTIONS",
      sections: [
        {
          id: "window-functions", n: 4, title: "Window Functions — ROW_NUMBER, RANK, LAG, LEAD, Running Totals",
          desc: "Window functions are the #1 differentiator in MAANG SQL rounds. They compute values across a set of rows <em>without</em> collapsing them like GROUP BY does.",
          questions: [
            {n:1, t:"What is a window function and how does OVER() work?", d:["intermediate"], a:`
<p>A window function runs <em>after</em> WHERE/GROUP BY/HAVING but <em>before</em> ORDER BY. It sees a <strong>window</strong> (subset) of rows for each row it computes.</p>
<pre>-- Anatomy of OVER()
function_name() OVER (
  PARTITION BY column   -- like GROUP BY but doesn't collapse rows
  ORDER BY column       -- ordering within the window
  ROWS BETWEEN ...      -- optional frame clause
)

-- Each employee's salary AND department average in the same row
SELECT
  name,
  department,
  salary,
  ROUND(AVG(salary) OVER (PARTITION BY department), 0) AS dept_avg,
  salary - AVG(salary) OVER (PARTITION BY department) AS diff_from_avg
FROM employees;</pre>
<p>The result has all original rows — nothing is collapsed. That is the key difference from GROUP BY.</p>`},

            {n:2, t:"ROW_NUMBER vs RANK vs DENSE_RANK — differences with examples", d:["intermediate","advanced"], a:`
<pre>SELECT
  name, department, salary,
  ROW_NUMBER()   OVER (PARTITION BY department ORDER BY salary DESC) AS row_num,
  RANK()         OVER (PARTITION BY department ORDER BY salary DESC) AS rank_val,
  DENSE_RANK()   OVER (PARTITION BY department ORDER BY salary DESC) AS dense_rank_val
FROM employees;

/*
name   dept         salary  row_num  rank  dense_rank
Alice  Engineering  120000  1        1     1
Bob    Engineering  110000  2        2     2
Carol  Engineering  110000  3        2     2  (tie)
Dave   Engineering   95000  4        4     3  (rank skips 3, dense_rank does not)
*/</pre>
<table>
  <tr><th>Function</th><th>Ties</th><th>Gaps after tie</th></tr>
  <tr><td>ROW_NUMBER</td><td>Arbitrary order among ties</td><td>No (always sequential)</td></tr>
  <tr><td>RANK</td><td>Same rank</td><td>Yes (skips numbers)</td></tr>
  <tr><td>DENSE_RANK</td><td>Same rank</td><td>No (consecutive)</td></tr>
</table>
<p><strong>MAANG tip:</strong> For "find Nth highest salary" always use DENSE_RANK — it handles ties correctly. RANK would skip ranks, DENSE_RANK won't.</p>`},

            {n:3, t:"LAG and LEAD — access previous and next row values", d:["intermediate","advanced"], a:`
<pre>-- LAG: value from N rows BEFORE current row
-- LEAD: value from N rows AFTER current row

SELECT
  order_date,
  revenue,
  LAG(revenue, 1, 0)  OVER (ORDER BY order_date) AS prev_day_revenue,
  LEAD(revenue, 1, 0) OVER (ORDER BY order_date) AS next_day_revenue,
  revenue - LAG(revenue) OVER (ORDER BY order_date) AS day_over_day_change
FROM daily_sales;

-- Month-over-month growth rate
SELECT
  month, revenue,
  LAG(revenue) OVER (ORDER BY month) AS prev_month,
  ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY month))
    / NULLIF(LAG(revenue) OVER (ORDER BY month), 0), 2) AS pct_growth
FROM monthly_revenue;</pre>
<p>Third argument to LAG/LEAD is the default value when there is no previous/next row (avoids NULL in the first/last row).</p>`},

            {n:4, t:"Running totals and moving averages with frame clauses", d:["advanced"], a:`
<pre>-- Running total (cumulative sum)
SELECT
  order_date, revenue,
  SUM(revenue) OVER (
    ORDER BY order_date
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS running_total
FROM daily_sales;

-- 7-day moving average
SELECT
  order_date, revenue,
  ROUND(AVG(revenue) OVER (
    ORDER BY order_date
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ), 2) AS moving_avg_7d
FROM daily_sales;

-- Percentage of total (nested window + GROUP BY)
SELECT
  department,
  SUM(salary) AS dept_payroll,
  SUM(SUM(salary)) OVER () AS total_payroll,
  ROUND(100.0 * SUM(salary) / SUM(SUM(salary)) OVER (), 2) AS pct_of_total
FROM employees
GROUP BY department;</pre>
<p><strong>Frame types:</strong> ROWS counts physical rows; RANGE includes all rows with the same ORDER BY value as the current row (default when ORDER BY is specified without a frame clause).</p>`},

            {n:5, t:"NTILE — divide result set into N equal buckets", d:["intermediate"], a:`
<pre>-- Quartile distribution of salaries
SELECT
  name, salary,
  NTILE(4) OVER (ORDER BY salary) AS quartile
FROM employees;
-- quartile 1 = bottom 25%, 4 = top 25%

-- Performance bands
SELECT
  name, salary,
  CASE NTILE(10) OVER (ORDER BY salary)
    WHEN 10 THEN 'Top 10%'
    WHEN 9  THEN 'Top 20%'
    ELSE 'Rest'
  END AS performance_band
FROM employees;</pre>`},

            {n:6, t:"FIRST_VALUE and LAST_VALUE within a window", d:["advanced"], a:`
<pre>-- First salary in each department (ordered by hire date)
SELECT
  name, department, salary, hire_date,
  FIRST_VALUE(salary) OVER (
    PARTITION BY department ORDER BY hire_date
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
  ) AS first_hire_salary,
  LAST_VALUE(salary) OVER (
    PARTITION BY department ORDER BY hire_date
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
  ) AS last_hire_salary
FROM employees;

-- Note: LAST_VALUE requires explicit ROWS UNBOUNDED FOLLOWING frame
-- otherwise default frame stops at current row</pre>`}
          ]
        }
      ]
    },

    /* =====================================================
       PART 3 · SUBQUERIES, CTEs, RECURSIVE QUERIES
    ===================================================== */
    {
      label: "PART 3 · SUBQUERIES & CTEs",
      sections: [
        {
          id: "subqueries-ctes", n: 5, title: "Subqueries, CTEs, EXISTS vs IN, Recursive Queries",
          desc: "Subqueries and CTEs let you compose complex logic step by step. Recursive CTEs unlock hierarchical queries — a MAANG favourite.",
          questions: [
            {n:1, t:"Types of subqueries — scalar, inline view, correlated", d:["intermediate"], a:`
<pre>-- SCALAR subquery — returns single value
SELECT name, salary,
  (SELECT AVG(salary) FROM employees) AS company_avg
FROM employees;

-- INLINE VIEW (derived table) — used in FROM
SELECT dept, avg_sal
FROM (
  SELECT department AS dept, AVG(salary) AS avg_sal
  FROM employees
  GROUP BY department
) dept_stats
WHERE avg_sal &gt; 90000;

-- CORRELATED subquery — references outer query, runs per row (slow on large tables)
SELECT name, salary FROM employees e
WHERE salary &gt; (
  SELECT AVG(salary) FROM employees
  WHERE department = e.department  -- references outer row
);
-- Prefer joining to a derived table or CTE for performance</pre>`},

            {n:2, t:"EXISTS vs IN — when to use each and performance difference", d:["intermediate","advanced"], a:`
<pre>-- IN — matches if value in a set
SELECT name FROM employees
WHERE dept_id IN (SELECT dept_id FROM departments WHERE budget &gt; 1000000);

-- EXISTS — stops as soon as first match found (short-circuit)
SELECT name FROM employees e
WHERE EXISTS (
  SELECT 1 FROM departments d
  WHERE d.dept_id = e.dept_id AND d.budget &gt; 1000000
);

-- NULL trap with NOT IN:
-- If subquery returns ANY NULL, NOT IN returns false for ALL rows!
SELECT name FROM employees
WHERE dept_id NOT IN (SELECT dept_id FROM departments WHERE dept_id IS NOT NULL); -- safe

-- NOT EXISTS is NULL-safe — prefer it for anti-joins
SELECT name FROM employees e
WHERE NOT EXISTS (
  SELECT 1 FROM departments d WHERE d.dept_id = e.dept_id AND d.active = FALSE
);</pre>
<table>
  <tr><th></th><th>IN</th><th>EXISTS</th></tr>
  <tr><td>NULL handling</td><td>Dangerous with NOT IN</td><td>Safe</td></tr>
  <tr><td>Short-circuit</td><td>No</td><td>Yes</td></tr>
  <tr><td>Best for</td><td>Small static set</td><td>Large correlated subqueries</td></tr>
</table>`},

            {n:3, t:"CTEs — WITH clause syntax, multiple CTEs, readability vs performance", d:["intermediate"], a:`
<pre>-- Single CTE
WITH high_earners AS (
  SELECT emp_id, name, salary, department
  FROM employees
  WHERE salary &gt; 100000
)
SELECT h.name, d.dept_name
FROM high_earners h
JOIN departments d ON h.department = d.dept_name;

-- Multiple CTEs (chain logic step by step)
WITH
dept_stats AS (
  SELECT department, AVG(salary) AS avg_sal, COUNT(*) AS headcount
  FROM employees GROUP BY department
),
large_departments AS (
  SELECT department FROM dept_stats WHERE headcount &gt; 10
)
SELECT e.name, e.salary
FROM employees e
WHERE e.department IN (SELECT department FROM large_departments)
  AND e.salary &gt; (
    SELECT avg_sal FROM dept_stats
    WHERE dept_stats.department = e.department
  );</pre>
<p>CTEs are <strong>not always materialized</strong> — PostgreSQL may inline them. To force materialization use <code>WITH cte AS MATERIALIZED (...)</code> in PostgreSQL 12+.</p>`},

            {n:4, t:"Recursive CTEs — how to traverse a tree or hierarchy", d:["advanced","expert"], a:`
<p>Recursive CTEs solve hierarchical data: org charts, bill-of-materials, folder trees.</p>
<pre>-- employees: emp_id, name, manager_id (NULL for CEO)
WITH RECURSIVE org_tree AS (
  -- Anchor: start with CEO (no manager)
  SELECT emp_id, name, manager_id, 0 AS depth, name::TEXT AS path
  FROM employees WHERE manager_id IS NULL

  UNION ALL

  -- Recursive: join each employee to their manager row
  SELECT e.emp_id, e.name, e.manager_id, ot.depth + 1,
         ot.path || ' > ' || e.name
  FROM employees e
  JOIN org_tree ot ON e.manager_id = ot.emp_id
  WHERE ot.depth &lt; 10   -- guard against infinite loops
)
SELECT depth, path, name FROM org_tree ORDER BY path;

/*
depth  path                  name
0      Alice                 Alice (CEO)
1      Alice > Bob           Bob
2      Alice > Bob > Carol   Carol
*/</pre>
<p><strong>MAANG tip:</strong> Add a depth limit or use CYCLE detection (PostgreSQL 14+) to prevent infinite loops in graphs with cycles.</p>`},

            {n:5, t:"INTERSECT and EXCEPT — set operations", d:["intermediate"], a:`
<pre>-- INTERSECT — rows in both queries
SELECT customer_id FROM orders WHERE status = 'COMPLETED'
INTERSECT
SELECT customer_id FROM orders WHERE order_date &gt;= '2025-01-01';
-- customers who have a completed order AND ordered in 2025

-- EXCEPT (MINUS in Oracle) — rows in first but not second
SELECT customer_id FROM customers
EXCEPT
SELECT customer_id FROM orders;
-- customers who have never placed an order

-- UNION — combine two result sets (removes duplicates)
-- UNION ALL — combine without removing duplicates (faster)
SELECT name FROM employees WHERE department = 'Engineering'
UNION ALL
SELECT name FROM contractors WHERE department = 'Engineering';</pre>`}
          ]
        }
      ]
    },

    /* =====================================================
       PART 4 · INDEXING DEEP DIVE
    ===================================================== */
    {
      label: "PART 4 · INDEXING DEEP DIVE",
      sections: [
        {
          id: "sql-indexing", n: 6, title: "Indexing Internals — B-tree, Composite, Covering, Partial, EXPLAIN",
          desc: "Indexing is the single biggest lever for query performance. Every MAANG system design and SQL round touches indexing.",
          questions: [
            {n:1, t:"How does a B-tree index work internally?", d:["intermediate","advanced"], a:`
<p>A B-tree (Balanced Tree) index stores column values in sorted order in a tree structure. Lookups, range scans, and ORDER BY can all use it.</p>
<pre>-- B-tree structure (simplified)
Root:     [50 | 100]
         /     |     \\
Leaves: [10,20,30] [55,70,85] [110,130,150]
-- Each leaf holds a pointer to the actual row on disk (heap).

-- Create a B-tree index (default type)
CREATE INDEX idx_employees_salary ON employees(salary);

-- Range query uses the index (sorted, sequential access)
SELECT * FROM employees WHERE salary BETWEEN 80000 AND 120000;

-- Equality also uses index
SELECT * FROM employees WHERE salary = 100000;</pre>
<p><strong>When B-tree doesn't help:</strong></p>
<ul>
  <li>Low-cardinality columns (boolean, gender) — planner may prefer full scan</li>
  <li>Functions on indexed columns break index use</li>
</ul>
<pre>-- Bad: function wrapping prevents index use
WHERE UPPER(name) = 'ALICE'  -- index on name NOT used

-- Fix: functional index
CREATE INDEX idx_name_upper ON employees(UPPER(name));
WHERE UPPER(name) = 'ALICE'  -- now uses index</pre>`},

            {n:2, t:"Composite indexes — left-prefix rule, column order matters", d:["intermediate","advanced"], a:`
<p>A composite index on (A, B, C) is like a phone book sorted first by A, then B, then C. You can use A alone, A+B, or A+B+C — but NOT B alone or C alone.</p>
<pre>CREATE INDEX idx_emp_dept_sal ON employees(department, salary);

-- Uses index (leading column = department)
WHERE department = 'Engineering'
WHERE department = 'Engineering' AND salary &gt; 80000

-- Cannot use index (missing leading column)
WHERE salary &gt; 80000  -- no dept filter = full scan

-- Perfect use: filter by department + sort by salary (avoids extra sort step)
SELECT * FROM employees
WHERE department = 'Engineering'
ORDER BY salary DESC;  -- index handles both filter and sort</pre>
<p><strong>Column order rule:</strong> Put equality-filtered columns first, then range-filtered columns, then ORDER BY columns. Higher cardinality columns earlier prune more rows.</p>`},

            {n:3, t:"What is a covering index and why is it fastest?", d:["advanced"], a:`
<p>A covering index contains <em>all</em> columns the query needs. The DB reads only the index — no heap lookup (PostgreSQL calls this "Index Only Scan").</p>
<pre>-- Query needs: name and salary for Engineering employees
SELECT name, salary FROM employees WHERE department = 'Engineering';

-- Covering index includes all 3 columns the query touches
CREATE INDEX idx_covering ON employees(department, name, salary);
-- Query never touches the main table — reads only the index.

-- EXPLAIN confirms
EXPLAIN SELECT name, salary FROM employees WHERE department = 'Engineering';
-- "Index Only Scan using idx_covering on employees"  (ideal)</pre>
<p><strong>Trade-off:</strong> Wider indexes use more storage and slow down writes (every INSERT/UPDATE/DELETE updates the index). Use for hot read paths on large tables.</p>`},

            {n:4, t:"Partial indexes — index only a subset of rows", d:["advanced"], a:`
<pre>-- Only index active users (10M rows, 200K active)
CREATE INDEX idx_active_users ON users(email)
WHERE is_active = TRUE;

-- Only index incomplete orders
CREATE INDEX idx_pending_orders ON orders(created_at)
WHERE status = 'PENDING';

-- Query must include the same condition to use partial index
SELECT * FROM users WHERE email = 'alice@example.com' AND is_active = TRUE;
-- ✅ uses partial index

SELECT * FROM users WHERE email = 'alice@example.com';
-- does not use partial index (condition doesn't match)</pre>
<p>Partial indexes are smaller, faster to scan, and faster to update than full indexes.</p>`},

            {n:5, t:"How to read EXPLAIN ANALYZE output and identify bottlenecks", d:["advanced","expert"], a:`
<pre>EXPLAIN ANALYZE
SELECT e.name, d.dept_name
FROM employees e
JOIN departments d ON e.dept_id = d.dept_id
WHERE e.salary &gt; 100000;

/*
Hash Join  (cost=15.00..45.23 rows=50 width=32)
           (actual time=1.2..4.5 rows=48 loops=1)
  Hash Cond: (e.dept_id = d.dept_id)
  ->  Seq Scan on employees e
        Filter: (salary &gt; 100000)
        Rows Removed by Filter: 452
  ->  Hash
        ->  Seq Scan on departments d
*/</pre>
<table>
  <tr><th>Term</th><th>Meaning</th></tr>
  <tr><td>Seq Scan</td><td>Full table scan — may need an index</td></tr>
  <tr><td>Index Scan</td><td>Uses index, fetches heap for row data</td></tr>
  <tr><td>Index Only Scan</td><td>No heap fetch — covering index</td></tr>
  <tr><td>cost=X..Y</td><td>Startup cost..total cost (planner estimate)</td></tr>
  <tr><td>actual time=X..Y</td><td>Real time in ms</td></tr>
  <tr><td>loops=N</td><td>How many times this node ran (multiply time by loops)</td></tr>
</table>
<p><strong>Red flags:</strong> estimated rows ≠ actual rows (stale stats — run ANALYZE); Seq Scan on millions of rows; high loops count in nested loop joins.</p>`},

            {n:6, t:"When do indexes HURT performance? High-write tables.", d:["advanced"], a:`
<p>Every index added must be updated on every INSERT, UPDATE, DELETE. On high-write tables this can be the bottleneck.</p>
<ul>
  <li>A table with 10 indexes does 10 extra B-tree writes per INSERT.</li>
  <li>ETL/batch loading: drop indexes, load, rebuild — can be 10x faster.</li>
  <li>Hot-spot pages: monotonically increasing IDs cause B-tree right-side contention under high insert concurrency.</li>
</ul>
<pre>-- Check index usage and size in PostgreSQL
SELECT
  relname AS table_name,
  indexrelname AS index_name,
  idx_scan AS times_used,
  pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;
-- Low idx_scan + big size = candidate for removal</pre>`},

            {n:7, t:"Hash indexes, GIN, GiST, BRIN — other index types", d:["advanced"], a:`
<table>
  <tr><th>Index Type</th><th>Best For</th><th>Notes</th></tr>
  <tr><td>B-tree</td><td>Equality, range, ORDER BY</td><td>Default, most versatile</td></tr>
  <tr><td>Hash</td><td>Equality only (=)</td><td>Smaller than B-tree for equality</td></tr>
  <tr><td>GIN</td><td>Full-text search, JSONB, arrays</td><td>Handles multi-valued columns</td></tr>
  <tr><td>GiST</td><td>Geometric/geospatial, range types</td><td>Used by PostGIS</td></tr>
  <tr><td>BRIN</td><td>Very large tables with natural order (timestamps)</td><td>Tiny size, coarse granularity</td></tr>
</table>
<pre>-- GIN index for JSONB queries
CREATE INDEX idx_orders_data ON orders USING GIN(metadata);
SELECT * FROM orders WHERE metadata @&gt; '{"status": "urgent"}';

-- BRIN index for large time-series tables
CREATE INDEX idx_events_time ON events USING BRIN(created_at);
-- tiny index, only useful when physical order matches query order</pre>`}
          ]
        }
      ]
    },

    /* =====================================================
       PART 5 · TRANSACTIONS & CONCURRENCY
    ===================================================== */
    {
      label: "PART 5 · TRANSACTIONS & CONCURRENCY",
      sections: [
        {
          id: "sql-transactions", n: 7, title: "Transactions, Isolation Levels, Locking, Deadlocks",
          desc: "Understanding transactions at depth is mandatory for MAANG backend engineering rounds — especially isolation levels and locking.",
          questions: [
            {n:1, t:"What are ACID properties and how does each protect data?", d:["beginner","intermediate"], a:`
<table>
  <tr><th>Property</th><th>Meaning</th><th>Mechanism</th></tr>
  <tr><td>Atomicity</td><td>All or nothing — no partial commits</td><td>ROLLBACK undoes partial work</td></tr>
  <tr><td>Consistency</td><td>DB constraints always satisfied</td><td>Constraints, triggers, checks</td></tr>
  <tr><td>Isolation</td><td>Concurrent transactions don't interfere</td><td>MVCC + locks</td></tr>
  <tr><td>Durability</td><td>Committed data survives crashes</td><td>WAL / redo log on disk</td></tr>
</table>
<pre>BEGIN;
  UPDATE accounts SET balance = balance - 500 WHERE id = 1;
  UPDATE accounts SET balance = balance + 500 WHERE id = 2;
  -- If anything fails, ROLLBACK reverts both UPDATEs atomically
COMMIT;</pre>`},

            {n:2, t:"Explain all four isolation levels and the problems they prevent", d:["intermediate","advanced"], a:`
<table>
  <tr><th>Level</th><th>Dirty Read</th><th>Non-repeatable Read</th><th>Phantom Read</th></tr>
  <tr><td>READ UNCOMMITTED</td><td>Yes</td><td>Yes</td><td>Yes</td></tr>
  <tr><td>READ COMMITTED</td><td>No</td><td>Yes</td><td>Yes</td></tr>
  <tr><td>REPEATABLE READ</td><td>No</td><td>No</td><td>Yes (MySQL) / No (PG)</td></tr>
  <tr><td>SERIALIZABLE</td><td>No</td><td>No</td><td>No</td></tr>
</table>
<pre>SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN;
  SELECT balance FROM accounts WHERE id = 1;  -- sees 1000
  -- another txn changes balance to 800 and commits
  SELECT balance FROM accounts WHERE id = 1;  -- still sees 1000 (repeatable)
COMMIT;

-- PostgreSQL default: READ COMMITTED
-- MySQL InnoDB default: REPEATABLE READ</pre>
<p><strong>MAANG context:</strong> Most web apps use READ COMMITTED. Financial systems often use REPEATABLE READ or SERIALIZABLE. PostgreSQL REPEATABLE READ uses MVCC snapshots so it also prevents phantom reads (stronger than standard SQL defines).</p>`},

            {n:3, t:"SELECT FOR UPDATE — locking rows for concurrent operations", d:["advanced"], a:`
<pre>-- Two requests try to book the last seat on flight 123
BEGIN;
  -- Lock the row — other txns that try SELECT FOR UPDATE will wait
  SELECT seats_available FROM flights WHERE flight_id = 123 FOR UPDATE;

  -- Now safely check and update
  UPDATE flights SET seats_available = seats_available - 1
  WHERE flight_id = 123 AND seats_available &gt; 0;
COMMIT;

-- SKIP LOCKED — non-blocking, skip already-locked rows (job queue pattern)
SELECT id, payload FROM job_queue
WHERE status = 'PENDING'
ORDER BY created_at
LIMIT 1
FOR UPDATE SKIP LOCKED;</pre>
<p>SKIP LOCKED is essential for high-throughput job queues — multiple workers pull from the same table without blocking each other.</p>`},

            {n:4, t:"What causes deadlocks and how do you prevent them?", d:["advanced","expert"], a:`
<p>A deadlock occurs when Transaction A holds a lock that B needs, and B holds a lock that A needs — circular wait.</p>
<pre>-- T1: UPDATE accounts SET ... WHERE id = 1;  (locks row 1)
-- T2: UPDATE accounts SET ... WHERE id = 2;  (locks row 2)
-- T1: UPDATE accounts SET ... WHERE id = 2;  (waits for T2)
-- T2: UPDATE accounts SET ... WHERE id = 1;  (waits for T1 -- DEADLOCK)</pre>
<p><strong>Prevention strategies:</strong></p>
<ol>
  <li><strong>Consistent lock ordering</strong> — always lock rows by ID ascending</li>
  <li><strong>Short transactions</strong> — hold locks as briefly as possible</li>
  <li><strong>Single-query updates</strong> — UPDATE accounts WHERE id IN (1,2) is atomic and orders locks internally</li>
  <li><strong>Retry logic</strong> — catch deadlock exceptions (PostgreSQL error 40P01) and retry</li>
</ol>`},

            {n:5, t:"What are SAVEPOINTS and how do partial rollbacks work?", d:["intermediate"], a:`
<pre>BEGIN;
  INSERT INTO orders (customer_id, total) VALUES (1, 500);
  SAVEPOINT after_order;

  INSERT INTO order_items (order_id, product_id, qty) VALUES (1001, 5, 2);
  -- Fails: product 5 doesn't exist

  ROLLBACK TO SAVEPOINT after_order;  -- undo only the order_items insert

  -- Retry with different product
  INSERT INTO order_items (order_id, product_id, qty) VALUES (1001, 3, 2);
COMMIT;  -- order + corrected item committed</pre>
<p>SAVEPOINTs allow nested error recovery within a single transaction without losing all previous work.</p>`},

            {n:6, t:"Optimistic vs pessimistic locking — when to use each", d:["advanced"], a:`
<table>
  <tr><th>Strategy</th><th>How it works</th><th>Best for</th></tr>
  <tr><td>Pessimistic</td><td>SELECT FOR UPDATE — locks row before reading</td><td>High contention, financial transactions</td></tr>
  <tr><td>Optimistic</td><td>Read + version number, check version on write</td><td>Low contention, long business transactions</td></tr>
</table>
<pre>-- Optimistic locking (version column pattern)
-- Step 1: Read with version
SELECT id, balance, version FROM accounts WHERE id = 1;
-- returns: balance=1000, version=5

-- Step 2: Update only if version hasn't changed
UPDATE accounts
SET balance = 900, version = version + 1
WHERE id = 1 AND version = 5;
-- If rows affected = 0, someone else updated — retry the operation</pre>`}
          ]
        }
      ]
    },

    /* =====================================================
       PART 6 · MAANG SQL INTERVIEW QUESTIONS
    ===================================================== */
    {
      label: "PART 6 · MAANG SQL INTERVIEW QUESTIONS",
      sections: [
        {
          id: "maang-salary", n: 8, title: "Salary & Ranking Problems",
          desc: "The most-asked category in MAANG SQL rounds. Know all three approaches for each problem — subquery, window function, CTE.",
          questions: [
            {n:1, t:"Find the employee with the SECOND highest salary", d:["intermediate","advanced"], a:`
<p>Three valid approaches — know all three for interviews:</p>
<pre>-- Approach 1: Subquery (classic, simple)
SELECT MAX(salary) AS second_highest
FROM employees
WHERE salary &lt; (SELECT MAX(salary) FROM employees);

-- Approach 2: DENSE_RANK (handles ties correctly — MAANG preferred)
WITH ranked AS (
  SELECT name, salary,
    DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
  FROM employees
)
SELECT name, salary FROM ranked WHERE rnk = 2;

-- Approach 3: LIMIT + OFFSET (PostgreSQL/MySQL)
SELECT DISTINCT salary FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 1;
-- To also get the employee name:
SELECT name, salary FROM employees
WHERE salary = (
  SELECT DISTINCT salary FROM employees ORDER BY salary DESC LIMIT 1 OFFSET 1
);</pre>
<p><strong>Why DENSE_RANK is best:</strong> If two employees share the highest salary, DENSE_RANK correctly keeps them both at rank 1 and makes the next distinct salary rank 2. The subquery also handles this correctly. Both are valid — clarify with the interviewer whether ties collapse the rank.</p>`},

            {n:2, t:"Find the Nth highest salary (generalised for any N)", d:["intermediate","advanced"], a:`
<pre>-- Replace 3 with any N

-- DENSE_RANK approach (handles ties, works on all DBs)
WITH ranked AS (
  SELECT name, salary,
    DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
  FROM employees
)
SELECT name, salary FROM ranked WHERE rnk = 3;

-- Double subquery (ANSI compatible, any DB)
SELECT MAX(salary) FROM employees e1
WHERE 2 = (      -- N-1 values are greater
  SELECT COUNT(DISTINCT salary) FROM employees e2
  WHERE e2.salary &gt; e1.salary
);

-- LIMIT OFFSET (MySQL/PostgreSQL, fast on small tables)
SELECT DISTINCT salary FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 2;  -- OFFSET = N - 1</pre>`},

            {n:3, t:"Find the highest salary in EACH department", d:["intermediate"], a:`
<pre>-- Approach 1: GROUP BY + MAX (simplest)
SELECT department, MAX(salary) AS max_salary
FROM employees
GROUP BY department;

-- Approach 2: Window function (returns employee name + salary)
WITH ranked AS (
  SELECT name, department, salary,
    DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rnk
  FROM employees
)
SELECT name, department, salary FROM ranked WHERE rnk = 1;

-- Approach 3: Correlated subquery
SELECT name, department, salary
FROM employees e
WHERE salary = (
  SELECT MAX(salary) FROM employees
  WHERE department = e.department
);</pre>`},

            {n:4, t:"Find the top 3 earners in EACH department", d:["advanced"], a:`
<pre>WITH dept_ranked AS (
  SELECT
    name, department, salary,
    DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rnk
  FROM employees
)
SELECT name, department, salary, rnk
FROM dept_ranked
WHERE rnk &lt;= 3
ORDER BY department, rnk;

/*
name   department   salary   rnk
Alice  Engineering  120000   1
Bob    Engineering  110000   2
Carol  Engineering  110000   2  (tie at rank 2)
Dave   Engineering   95000   3
...
*/</pre>`},

            {n:5, t:"Find employees earning more than their department average", d:["intermediate","advanced"], a:`
<pre>-- Approach 1: Window function (one pass)
WITH stats AS (
  SELECT name, department, salary,
    AVG(salary) OVER (PARTITION BY department) AS dept_avg
  FROM employees
)
SELECT name, department, salary, ROUND(dept_avg, 0) AS dept_avg
FROM stats WHERE salary &gt; dept_avg;

-- Approach 2: Join to derived table
SELECT e.name, e.department, e.salary, da.avg_sal
FROM employees e
JOIN (
  SELECT department, AVG(salary) AS avg_sal
  FROM employees GROUP BY department
) da ON e.department = da.department
WHERE e.salary &gt; da.avg_sal;</pre>`},

            {n:6, t:"Find duplicate rows in a table", d:["intermediate"], a:`
<pre>-- Count duplicates by (name, department)
SELECT name, department, COUNT(*) AS cnt
FROM employees
GROUP BY name, department
HAVING COUNT(*) &gt; 1;

-- Show ALL duplicate rows (not just counts)
WITH dupes AS (
  SELECT *, COUNT(*) OVER (PARTITION BY name, department) AS cnt
  FROM employees
)
SELECT * FROM dupes WHERE cnt &gt; 1;

-- Delete duplicates keeping lowest emp_id per group (PostgreSQL)
DELETE FROM employees
WHERE emp_id NOT IN (
  SELECT MIN(emp_id) FROM employees GROUP BY name, department
);</pre>`},

            {n:7, t:"Find gaps in a sequence (missing IDs or dates)", d:["advanced"], a:`
<pre>-- Missing employee IDs (gap detection with LAG)
SELECT curr_id, prev_id, curr_id - prev_id - 1 AS gap_size
FROM (
  SELECT emp_id AS curr_id,
    LAG(emp_id) OVER (ORDER BY emp_id) AS prev_id
  FROM employees
) t
WHERE curr_id - prev_id &gt; 1;

-- Missing dates in a sales table (PostgreSQL generate_series)
SELECT d::DATE AS missing_date
FROM generate_series('2025-01-01'::DATE, '2025-01-31'::DATE, '1 day') d
WHERE d::DATE NOT IN (SELECT DISTINCT sale_date FROM daily_sales);</pre>`},

            {n:8, t:"Running total of sales — per day and cumulative", d:["intermediate","advanced"], a:`
<pre>SELECT
  sale_date, amount,
  SUM(amount) OVER (
    ORDER BY sale_date
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS running_total,
  AVG(amount) OVER (
    ORDER BY sale_date
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS rolling_7day_avg
FROM daily_sales ORDER BY sale_date;

-- Per region cumulative
SELECT region, sale_date, amount,
  SUM(amount) OVER (PARTITION BY region ORDER BY sale_date) AS region_running_total
FROM daily_sales ORDER BY region, sale_date;</pre>`},

            {n:9, t:"Find the median salary without using percentile functions", d:["advanced","expert"], a:`
<pre>-- Using ROW_NUMBER to find middle rows
WITH ordered AS (
  SELECT salary,
    ROW_NUMBER() OVER (ORDER BY salary) AS rn,
    COUNT(*) OVER () AS total
  FROM employees
)
SELECT AVG(salary) AS median
FROM ordered
WHERE rn IN (
  FLOOR((total + 1) / 2.0),
  CEIL((total + 1) / 2.0)
);

-- PostgreSQL built-in (simpler)
SELECT PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary) AS median
FROM employees;</pre>`},

            {n:10, t:"Pivot table — rows to columns (conditional aggregation)", d:["advanced"], a:`
<pre>-- sales: region, month, amount — pivot months into columns
SELECT
  region,
  SUM(CASE WHEN month = 'Jan' THEN amount ELSE 0 END) AS jan,
  SUM(CASE WHEN month = 'Feb' THEN amount ELSE 0 END) AS feb,
  SUM(CASE WHEN month = 'Mar' THEN amount ELSE 0 END) AS mar,
  SUM(amount) AS total
FROM sales
GROUP BY region;
-- This is called "conditional aggregation pivot" — works on all SQL databases</pre>`}
          ]
        },

        {
          id: "maang-hierarchy", n: 9, title: "Employee & Manager Hierarchy Problems",
          desc: "Hierarchy and manager-chain queries appear frequently in MAANG rounds. These require self-joins or recursive CTEs.",
          questions: [
            {n:1, t:"Find employees who are also managers", d:["intermediate"], a:`
<pre>-- Using subquery
SELECT emp_id, name FROM employees
WHERE emp_id IN (
  SELECT DISTINCT manager_id FROM employees WHERE manager_id IS NOT NULL
);

-- Using EXISTS
SELECT emp_id, name FROM employees m
WHERE EXISTS (
  SELECT 1 FROM employees e WHERE e.manager_id = m.emp_id
);</pre>`},

            {n:2, t:"Find the full manager chain for a given employee", d:["advanced","expert"], a:`
<pre>WITH RECURSIVE chain AS (
  -- Start from target employee
  SELECT emp_id, name, manager_id, 0 AS level
  FROM employees WHERE name = 'Carol'

  UNION ALL

  -- Walk up to manager
  SELECT e.emp_id, e.name, e.manager_id, c.level + 1
  FROM employees e
  JOIN chain c ON e.emp_id = c.manager_id
)
SELECT level, name FROM chain ORDER BY level DESC;
/*
level  name
2      Alice  (CEO)
1      Bob    (VP)
0      Carol  (target employee)
*/</pre>`},

            {n:3, t:"Find all employees reporting (directly or indirectly) to a manager", d:["advanced","expert"], a:`
<pre>WITH RECURSIVE reports AS (
  -- Anchor: the given manager
  SELECT emp_id, name, manager_id, 0 AS depth
  FROM employees WHERE name = 'Bob'

  UNION ALL

  -- Recursive: all reports of everyone in the set
  SELECT e.emp_id, e.name, e.manager_id, r.depth + 1
  FROM employees e
  JOIN reports r ON e.manager_id = r.emp_id
  WHERE r.depth &lt; 10  -- guard against cycles
)
SELECT depth, name FROM reports WHERE depth &gt; 0 ORDER BY depth, name;</pre>`},

            {n:4, t:"Find leaf employees (no subordinates)", d:["intermediate"], a:`
<pre>-- Employees whose emp_id never appears as a manager_id
SELECT name FROM employees
WHERE emp_id NOT IN (
  SELECT DISTINCT manager_id FROM employees WHERE manager_id IS NOT NULL
);

-- LEFT JOIN anti-join (more efficient on large tables)
SELECT e.name
FROM employees e
LEFT JOIN employees sub ON sub.manager_id = e.emp_id
WHERE sub.emp_id IS NULL;</pre>`}
          ]
        },

        {
          id: "maang-advanced-agg", n: 10, title: "Advanced Aggregation & Date Problems",
          desc: "Date-based queries and complex aggregations test your ability to combine SQL building blocks under time pressure.",
          questions: [
            {n:1, t:"Find users who logged in on consecutive days (streak detection)", d:["advanced","expert"], a:`
<pre>-- user_logins: user_id, login_date (one row per user per day, deduped)
WITH numbered AS (
  SELECT user_id, login_date,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date) AS rn
  FROM (SELECT DISTINCT user_id, login_date FROM user_logins) t
),
grouped AS (
  -- Subtract row number from date: constant within a streak
  SELECT user_id, login_date,
    login_date - (rn * INTERVAL '1 day') AS grp
  FROM numbered
)
SELECT user_id,
  MIN(login_date) AS streak_start,
  MAX(login_date) AS streak_end,
  COUNT(*) AS streak_length
FROM grouped
GROUP BY user_id, grp
HAVING COUNT(*) &gt;= 3  -- only streaks of 3+ days
ORDER BY streak_length DESC;</pre>`},

            {n:2, t:"Month-over-month revenue growth rate", d:["intermediate","advanced"], a:`
<pre>WITH monthly AS (
  SELECT
    DATE_TRUNC('month', sale_date) AS month,
    SUM(amount) AS revenue
  FROM sales GROUP BY DATE_TRUNC('month', sale_date)
)
SELECT
  month, revenue,
  LAG(revenue) OVER (ORDER BY month) AS prev_month_revenue,
  ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY month))
    / NULLIF(LAG(revenue) OVER (ORDER BY month), 0), 2) AS mom_growth_pct
FROM monthly ORDER BY month;</pre>`},

            {n:3, t:"Find first and last purchase date + lifetime value per customer", d:["intermediate"], a:`
<pre>SELECT
  customer_id,
  MIN(purchase_date)  AS first_purchase,
  MAX(purchase_date)  AS last_purchase,
  MAX(purchase_date) - MIN(purchase_date) AS days_as_customer,
  COUNT(*)            AS total_orders,
  SUM(amount)         AS lifetime_value,
  AVG(amount)         AS avg_order_value
FROM orders
GROUP BY customer_id
ORDER BY lifetime_value DESC;</pre>`},

            {n:4, t:"Find customers who bought product A but NOT product B (funnel)", d:["advanced"], a:`
<pre>WITH bought_a AS (
  SELECT DISTINCT o.customer_id FROM orders o
  JOIN order_items oi ON o.order_id = oi.order_id
  WHERE oi.product_id = 'A'
),
bought_b AS (
  SELECT DISTINCT o.customer_id FROM orders o
  JOIN order_items oi ON o.order_id = oi.order_id
  WHERE oi.product_id = 'B'
)
SELECT customer_id FROM bought_a
EXCEPT
SELECT customer_id FROM bought_b;

-- Equivalently with NOT EXISTS:
SELECT a.customer_id FROM bought_a a
WHERE NOT EXISTS (SELECT 1 FROM bought_b b WHERE b.customer_id = a.customer_id);</pre>`},

            {n:5, t:"Cohort retention — Day 1, Day 7, Day 30 retention rate", d:["expert"], a:`
<pre>-- user_activity: user_id, activity_date
WITH cohort AS (
  SELECT user_id, MIN(activity_date) AS cohort_date
  FROM user_activity GROUP BY user_id
),
activity_days AS (
  SELECT a.user_id, a.activity_date,
    a.activity_date - c.cohort_date AS days_since_start
  FROM user_activity a
  JOIN cohort c ON a.user_id = c.user_id
)
SELECT
  cohort_date,
  COUNT(DISTINCT user_id) AS cohort_size,
  ROUND(100.0 * COUNT(DISTINCT CASE WHEN days_since_start = 1  THEN user_id END)
    / COUNT(DISTINCT user_id), 1) AS day1_retention,
  ROUND(100.0 * COUNT(DISTINCT CASE WHEN days_since_start = 7  THEN user_id END)
    / COUNT(DISTINCT user_id), 1) AS day7_retention,
  ROUND(100.0 * COUNT(DISTINCT CASE WHEN days_since_start = 30 THEN user_id END)
    / COUNT(DISTINCT user_id), 1) AS day30_retention
FROM activity_days
GROUP BY cohort_date ORDER BY cohort_date;</pre>`},

            {n:6, t:"Find users who visited pages in a specific sequence", d:["expert"], a:`
<pre>-- user_events: user_id, page, event_time
-- Find users: /home then /product then /checkout (in order)
WITH ranked AS (
  SELECT user_id, page, event_time,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY event_time) AS step
  FROM user_events
  WHERE page IN ('/home', '/product', '/checkout')
)
SELECT DISTINCT h.user_id
FROM ranked h
JOIN ranked p ON h.user_id = p.user_id AND h.page = '/home'
              AND p.page = '/product' AND p.step &gt; h.step
JOIN ranked c ON h.user_id = c.user_id AND c.page = '/checkout'
              AND c.step &gt; p.step;</pre>`}
          ]
        },

        {
          id: "maang-strings-search", n: 11, title: "String, Search & CASE Expression Queries",
          desc: "String operations and conditional expressions appear in data engineering and analytics rounds.",
          questions: [
            {n:1, t:"SQL string functions — LIKE, SUBSTRING, REPLACE, CONCAT, TRIM", d:["beginner","intermediate"], a:`
<pre>-- Pattern matching
SELECT * FROM employees WHERE name LIKE 'A%';        -- starts with A
SELECT * FROM employees WHERE name LIKE '%son';      -- ends with son
SELECT * FROM employees WHERE name LIKE '%ar%';      -- contains ar
SELECT * FROM employees WHERE name ILIKE '%alice%';  -- case-insensitive (PostgreSQL)
SELECT * FROM employees WHERE name NOT LIKE '%Smith';-- exclude

-- String functions
SELECT
  UPPER(name), LOWER(name),
  TRIM('  Alice  '), LTRIM('  Alice'), RTRIM('Alice  '),
  LENGTH(name) AS name_length,
  SUBSTRING(name FROM 1 FOR 3) AS first_3_chars,
  POSITION('li' IN name) AS position,
  REPLACE(email, '@old.com', '@new.com') AS new_email,
  CONCAT(first_name, ' ', last_name) AS full_name
FROM employees;

-- Regex (PostgreSQL)
SELECT * FROM employees WHERE name ~ '^[A-Z][a-z]+$';  -- starts with capital letter</pre>`},

            {n:2, t:"CASE expression — conditional logic inside SQL queries", d:["beginner","intermediate"], a:`
<pre>-- Simple CASE
SELECT name, salary,
  CASE
    WHEN salary &gt;= 150000 THEN 'Principal'
    WHEN salary &gt;= 100000 THEN 'Senior'
    WHEN salary &gt;= 70000  THEN 'Mid'
    ELSE 'Junior'
  END AS level
FROM employees;

-- CASE in ORDER BY (custom sort order)
SELECT name, status FROM orders
ORDER BY
  CASE status
    WHEN 'URGENT'   THEN 1
    WHEN 'PENDING'  THEN 2
    WHEN 'COMPLETE' THEN 3
    ELSE 4
  END;

-- Conditional aggregation with CASE
SELECT department,
  COUNT(CASE WHEN salary &gt; 100000 THEN 1 END) AS senior_count,
  COUNT(CASE WHEN salary &lt;= 100000 THEN 1 END) AS junior_count,
  SUM(CASE WHEN department = 'Engineering' THEN salary ELSE 0 END) AS eng_payroll
FROM employees
GROUP BY department;</pre>`},

            {n:3, t:"Full-text search in PostgreSQL — GIN index and tsvector", d:["advanced"], a:`
<pre>-- LIKE with leading wildcard is slow — forces full scan
WHERE content LIKE '%performance%'  -- slow

-- Full-text search uses GIN index
CREATE INDEX idx_articles_fts ON articles
  USING GIN(to_tsvector('english', content));

-- Query with full-text search
SELECT title FROM articles
WHERE to_tsvector('english', content) @@ to_tsquery('english', 'database & performance');

-- Rank results by relevance
SELECT title,
  ts_rank(to_tsvector('english', content),
    to_tsquery('english', 'database')) AS rank
FROM articles
WHERE to_tsvector('english', content) @@ to_tsquery('english', 'database')
ORDER BY rank DESC LIMIT 20;</pre>
<p><strong>MAANG context:</strong> PostgreSQL FTS works well up to ~10M documents. For product search at billion scale, teams use Elasticsearch/OpenSearch alongside the primary database.</p>`}
          ]
        }
      ]
    },

    /* =====================================================
       PART 7 · ADVANCED SQL PATTERNS & OPTIMISATION
    ===================================================== */
    {
      label: "PART 7 · ADVANCED PATTERNS & OPTIMISATION",
      sections: [
        {
          id: "sql-optimisation", n: 12, title: "Query Optimisation, Slow Queries, Materialized Views",
          desc: "Knowing <em>why</em> a query is slow and how to fix it separates senior engineers from the rest.",
          questions: [
            {n:1, t:"What are the most common reasons a query is slow?", d:["intermediate","advanced"], a:`
<ol>
  <li><strong>Missing index</strong> — Seq Scan on millions of rows</li>
  <li><strong>Wrong index</strong> — function wrapping, type mismatch, low selectivity</li>
  <li><strong>N+1 query</strong> — app issues 1 query for N records, then N detail queries — fix with JOIN or eager loading</li>
  <li><strong>Correlated subquery in SELECT</strong> — runs per row</li>
  <li><strong>Deep pagination</strong> — OFFSET 1000000 scans 1M rows before returning 10</li>
  <li><strong>Implicit type cast</strong> — WHERE varchar_col = integer_param — cast breaks index</li>
  <li><strong>Stale statistics</strong> — planner picks wrong plan — run ANALYZE</li>
  <li><strong>SELECT *</strong> on wide table — fetches columns the app never uses</li>
  <li><strong>Missing join index</strong> — join column not indexed in the joined table</li>
  <li><strong>Unbounded query</strong> — no LIMIT on a table with millions of rows</li>
</ol>`},

            {n:2, t:"How to rewrite a slow correlated subquery as a JOIN or CTE", d:["intermediate","advanced"], a:`
<pre>-- SLOW: correlated subquery — runs once per row in employees
SELECT e.name, e.salary FROM employees e
WHERE e.salary = (
  SELECT MAX(salary) FROM employees
  WHERE department = e.department  -- runs N times
);

-- FAST: join to aggregated CTE — aggregation runs once
WITH dept_max AS (
  SELECT department, MAX(salary) AS max_sal
  FROM employees GROUP BY department
)
SELECT e.name, e.salary
FROM employees e
JOIN dept_max dm ON e.department = dm.department
              AND e.salary = dm.max_sal;</pre>`},

            {n:3, t:"Materialized views — precomputed results for expensive queries", d:["advanced"], a:`
<pre>-- Create a materialized view for an expensive aggregation
CREATE MATERIALIZED VIEW dept_salary_stats AS
SELECT department,
  COUNT(*) AS headcount,
  AVG(salary) AS avg_salary,
  MAX(salary) AS max_salary,
  SUM(salary) AS total_payroll
FROM employees
GROUP BY department;

-- Query is instant — reads pre-computed result from disk
SELECT * FROM dept_salary_stats WHERE avg_salary &gt; 90000;

-- Refresh when underlying data changes
REFRESH MATERIALIZED VIEW CONCURRENTLY dept_salary_stats;
-- CONCURRENTLY: refresh without locking reads (needs unique index on the view)</pre>
<p><strong>MAANG use case:</strong> Dashboards, reporting, analytics. Schedule refresh via cron or trigger. Not suitable for real-time data — use a live query or caching layer (Redis) for that.</p>`},

            {n:4, t:"Table partitioning — what it is and how it helps large tables", d:["advanced","expert"], a:`
<pre>-- RANGE partitioning by date (PostgreSQL 10+)
CREATE TABLE orders (
  order_id BIGINT,
  customer_id INT,
  amount NUMERIC,
  created_at TIMESTAMP
) PARTITION BY RANGE (created_at);

CREATE TABLE orders_2024 PARTITION OF orders
  FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
CREATE TABLE orders_2025 PARTITION OF orders
  FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

-- Query for 2025 ONLY scans orders_2025 (partition pruning)
SELECT * FROM orders WHERE created_at &gt;= '2025-06-01';

-- LIST partitioning by region
CREATE TABLE sales PARTITION BY LIST (region);
CREATE TABLE sales_us PARTITION OF sales FOR VALUES IN ('US', 'CA');
CREATE TABLE sales_eu PARTITION OF sales FOR VALUES IN ('UK', 'DE', 'FR');</pre>
<p><strong>Benefits:</strong> Smaller scans (partition pruning). Archive old data by dropping old partition. Parallel query across partitions. Best for tables &gt; 100M rows with a natural range key (date, region).</p>`}
          ]
        },

        {
          id: "sql-schema-design", n: 13, title: "Schema Design, Normalisation, Anti-patterns",
          desc: "Schema design questions come up in system design interviews. Knowing when to normalise and when to denormalise is key.",
          questions: [
            {n:1, t:"What are 1NF, 2NF, 3NF — normalisation explained simply", d:["intermediate"], a:`
<table>
  <tr><th>Normal Form</th><th>Rule</th><th>Violation Example</th></tr>
  <tr><td>1NF</td><td>Atomic values, no repeating groups</td><td>Storing "Alice,Bob" in one phone column</td></tr>
  <tr><td>2NF</td><td>No partial dependency on composite key</td><td>order_items has product_name — depends only on product_id, not full (order_id, product_id) key</td></tr>
  <tr><td>3NF</td><td>No transitive dependency</td><td>employees has zip + city — city depends on zip, not emp_id</td></tr>
</table>
<pre>-- 1NF violation: non-atomic
-- employees: emp_id | phone_numbers = "555-1234, 555-5678"

-- Fix 1NF: separate table
-- employee_phones: emp_id | phone | type

-- 3NF violation:
-- employees: emp_id | name | zip | city  (city depends on zip, not emp_id)
-- Fix: extract zip_codes: zip | city | state</pre>`},

            {n:2, t:"When should you DENORMALIZE and how to do it safely?", d:["advanced"], a:`
<p>Denormalisation trades write complexity for read performance. Common in read-heavy systems and analytics.</p>
<pre>-- Snapshot customer data into orders at order time
-- (customer may change email later; order record preserves who they were at that time)
orders: order_id | customer_id | customer_name_snapshot | total</pre>
<p><strong>Common denormalisation patterns:</strong></p>
<ul>
  <li>Counter columns: post.comment_count updated via trigger instead of COUNT(*) on every read</li>
  <li>Materialised computed totals: order.total stored, not recalculated from order_items each time</li>
  <li>Redundant columns for partition-local queries (avoid cross-shard joins)</li>
  <li>Audit/history snapshot tables</li>
</ul>`},

            {n:3, t:"Common schema anti-patterns and how to fix them", d:["intermediate","advanced"], a:`
<table>
  <tr><th>Anti-pattern</th><th>Problem</th><th>Fix</th></tr>
  <tr><td>EAV (Entity-Attribute-Value)</td><td>No type safety, can't index individual attributes, painful joins</td><td>Use JSONB or properly typed columns</td></tr>
  <tr><td>Delimited list in a column</td><td>Can't join, filter, or index individual values</td><td>Normalise into a separate table</td></tr>
  <tr><td>VARCHAR for everything</td><td>No type enforcement, bad performance for dates/numbers</td><td>Use proper types</td></tr>
  <tr><td>Missing created_at/updated_at</td><td>Can't audit, can't do incremental ETL</td><td>Add timestamp columns to every table</td></tr>
  <tr><td>INT primary key on large table</td><td>2 billion row limit hit on huge tables</td><td>Always use BIGINT for IDs</td></tr>
  <tr><td>Missing foreign keys</td><td>Orphaned records, no referential integrity</td><td>Add FK constraints — defer if needed for performance</td></tr>
</table>`}
          ]
        }
      ]
    },

    /* =====================================================
       PART 8 · DATABASE ENGINES & PRODUCTION
    ===================================================== */
    {
      label: "PART 8 · DATABASE ENGINES & PRODUCTION",
      sections: [
        {
          id: "db-internals", n: 14, title: "PostgreSQL, MongoDB, Oracle — Internals & Choice",
          desc: "Use this section to explain <strong>when and why</strong> to choose SQL, PostgreSQL, MongoDB, or Oracle in real systems.",
          questions: [
            {n:1, t:"SQL vs NoSQL — what is the real difference beyond buzzwords?", d:["beginner"], a:`
<p>SQL and NoSQL are workload trade-off choices, not old-vs-new choices.</p>
<table>
  <tr><th>Dimension</th><th>SQL (PostgreSQL/Oracle)</th><th>NoSQL (MongoDB)</th></tr>
  <tr><td>Model</td><td>Relational + joins</td><td>Document model (nested JSON)</td></tr>
  <tr><td>Schema</td><td>Strict — enforced by DB</td><td>Flexible — schema per document</td></tr>
  <tr><td>Transactions</td><td>Mature ACID across multiple tables</td><td>Single-document atomic by default; multi-doc since 4.0</td></tr>
  <tr><td>Scaling</td><td>Vertical + read replicas + partitioning</td><td>Horizontal sharding built-in</td></tr>
  <tr><td>Best fit</td><td>Financial, relational, complex queries</td><td>Product catalogs, user profiles, evolving schema</td></tr>
</table>`},

            {n:2, t:"How does PostgreSQL work internally — MVCC, WAL, Autovacuum?", d:["intermediate","advanced"], a:`
<ul>
  <li><strong>MVCC (Multi-Version Concurrency Control):</strong> Each row update creates a new version. Readers see their snapshot; writers don't block readers.</li>
  <li><strong>WAL (Write-Ahead Log):</strong> Every change is written to WAL on disk before the data page. Basis of durability and streaming replication.</li>
  <li><strong>Autovacuum:</strong> Background process that reclaims dead row versions from UPDATEs and DELETEs (table bloat prevention).</li>
  <li><strong>Query Planner:</strong> Uses pg_statistic to estimate row counts, then chooses index scan / hash join / nested loop based on cost model.</li>
</ul>
<pre>BEGIN;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
-- PostgreSQL writes WAL, commits atomically. Old row versions left behind.
-- Autovacuum later reclaims dead old versions and updates statistics.</pre>`},

            {n:3, t:"Replication — primary/replica, synchronous vs asynchronous", d:["advanced"], a:`
<pre>-- PostgreSQL streaming replication
-- Primary streams WAL to replica continuously

-- Synchronous: primary waits for replica ACK before commit
--  Pros: zero data loss on failover
--  Cons: any replica slowdown slows the primary

-- Asynchronous: primary doesn't wait (default)
--  Pros: no latency impact on writes
--  Cons: small data loss window on failover (replication lag)

-- Logical replication: replicate specific tables to another DB
CREATE PUBLICATION my_pub FOR TABLE orders, products;
-- On subscriber:
CREATE SUBSCRIPTION my_sub CONNECTION '...' PUBLICATION my_pub;</pre>
<p><strong>MAANG uses:</strong> Read replicas for analytics queries. Regional replicas for disaster recovery. Logical replication for zero-downtime major version upgrades.</p>`},

            {n:4, t:"Sharding — horizontal partitioning across multiple databases", d:["advanced","expert"], a:`
<p>Sharding splits rows across multiple database servers. Each server (shard) holds a subset of data.</p>
<pre>-- Shard by customer_id: hash(customer_id) % 4 = shard number
-- Shard 0: customers whose ID % 4 = 0
-- Shard 1: customers whose ID % 4 = 1</pre>
<table>
  <tr><th>Shard Key</th><th>Pros</th><th>Cons</th></tr>
  <tr><td>Customer ID</td><td>Customer queries hit one shard</td><td>Hot customers cause hot shards</td></tr>
  <tr><td>Geographic region</td><td>Regional data isolation</td><td>Cross-region queries scatter</td></tr>
  <tr><td>Hash of ID</td><td>Even distribution</td><td>Range queries scatter across all shards</td></tr>
</table>
<p><strong>MAANG tip:</strong> Avoid sharding as long as possible. Vertical scaling + read replicas + table partitioning can handle massive scale. Sharding adds enormous operational complexity (cross-shard joins, distributed transactions).</p>`},

            {n:5, t:"CAP theorem and how it applies to database choices", d:["advanced","expert"], a:`
<p>In a distributed system, during a network Partition, you must choose between Consistency and Availability.</p>
<table>
  <tr><th>Choice</th><th>Systems</th><th>Behaviour on Partition</th></tr>
  <tr><td>CP (Consistent + Partition-tolerant)</td><td>PostgreSQL, ZooKeeper, HBase</td><td>Reject writes to stay consistent — no stale reads</td></tr>
  <tr><td>AP (Available + Partition-tolerant)</td><td>Cassandra, DynamoDB, CouchDB</td><td>Accept writes on all nodes, resolve conflicts later</td></tr>
</table>
<p><strong>MAANG answer:</strong> "PostgreSQL is CP — in a partition the primary rejects writes rather than accepting inconsistent data. Cassandra is AP — it accepts writes everywhere and uses last-write-wins to reconcile. For financial transactions I'd choose CP. For social feed timelines I'd consider AP."</p>`},

            {n:6, t:"Zero-downtime schema migrations — how to safely alter large tables", d:["advanced","expert"], a:`
<p>ALTER TABLE with NOT NULL on a 500M row table can lock it for hours. Use the expand-contract pattern:</p>
<pre>-- Phase 1: Add column as nullable (no table lock, fast)
ALTER TABLE orders ADD COLUMN new_status VARCHAR(50);

-- Phase 2: Backfill in batches (no full table lock)
UPDATE orders SET new_status = status
WHERE id BETWEEN :batch_start AND :batch_end;
-- Repeat for each batch with a small pause between batches

-- Phase 3: Add NOT NULL + default once backfill is complete
ALTER TABLE orders ALTER COLUMN new_status SET NOT NULL;
ALTER TABLE orders ALTER COLUMN new_status SET DEFAULT 'PENDING';

-- Add index WITHOUT locking (PostgreSQL)
CREATE INDEX CONCURRENTLY idx_new_status ON orders(new_status);
-- CONCURRENTLY builds index without locking writes (takes longer but safe)</pre>`},

            {n:7, t:"Change Data Capture (CDC) and the Outbox pattern", d:["expert"], a:`
<p>CDC streams every DB change (INSERT/UPDATE/DELETE) as events. Debezium reads PostgreSQL WAL and publishes to Kafka.</p>
<pre>-- Outbox pattern: atomic write to DB + reliable event publishing
-- Problem: writing to DB and publishing to Kafka is not atomic
-- Solution: write the event INTO the same DB transaction

BEGIN;
  INSERT INTO orders (customer_id, total, status) VALUES (1, 500, 'PENDING');

  INSERT INTO outbox (aggregate_type, event_type, payload)
  VALUES ('Order', 'OrderCreated', '{"total": 500, "customer_id": 1}');
COMMIT;

-- Debezium reads PostgreSQL WAL, picks up the outbox row, publishes to Kafka
-- Kafka consumer processes OrderCreated event

-- Even if Kafka is down, the order is safely persisted.
-- When Kafka recovers, Debezium reads from WAL and publishes.</pre>`}
          ]
        }
      ]
    }

  ]
};
