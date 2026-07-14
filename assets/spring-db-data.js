/* =========================================================
   Spring DB, Messaging & Architecture — Deeply Explained
   JPA internals, transactions, Kafka, resilience, deployment.
   ========================================================= */
window.SPRING_DB_DATA = {
  parts: [
    {
      label: "PART 1 · JPA & HIBERNATE INTERNALS",
      sections: [
        {
          id: "jpa-internals",
          n: 1,
          title: "JPA Persistence Context — The Core You Must Understand",
          desc: "The <strong>Persistence Context is the heart of JPA</strong>. Every surprising JPA behavior — dirty checking, lazy loading, entity states, the N+1 problem — traces back to how the Persistence Context works.",
          questions: [
            {
              n: 1,
              t: "What is the JPA Persistence Context and how does it work internally?",
              d: ["intermediate", "advanced"],
              a: `
<p>The Persistence Context is the most important concept in JPA. If you fully understand it, you'll understand all the weird behaviors JPA exhibits.</p>

<h4>What Is a Persistence Context?</h4>
<pre>
The Persistence Context is a first-level cache + identity map + change tracker.
It lives for the duration of a @Transactional method (by default).

Think of it like a "working set" — a snapshot of entities you've loaded
from the database in the current transaction.
</pre>

<h4>Entity States — The Four States of a JPA Entity</h4>
<pre>// State 1: TRANSIENT (New) — not managed by JPA, not in DB
Order order = new Order();  // just a plain Java object
order.setCustomerId("cust-1");
// No ID, not in DB, not in persistence context — JPA ignores it

// State 2: MANAGED — in persistence context, changes tracked
em.persist(order);  // or: orderRepo.save(order) when new
// OR loaded from DB:
Order managed = em.find(Order.class, 42L);
// Changes to 'managed' are tracked — will be synced to DB on flush

// State 3: DETACHED — was managed, but persistence context closed
// This happens when:
// a) Transaction ended (most common — every @Transactional method ends)
// b) em.detach(entity) called explicitly
// c) em.clear() called (detaches everything)
// Detached entities: have an ID, have data, but changes NOT tracked
Order detached = loadOrder();  // managed in old transaction
// transaction ended → now detached
detached.setStatus(SHIPPED);  // NOT tracked, NOT saved to DB!

// State 4: REMOVED — scheduled for deletion
em.remove(managedOrder);
// On flush: DELETE FROM orders WHERE id = ?
// After flush: entity is REMOVED state (can re-persist to go back to MANAGED)</pre>

<h4>Dirty Checking — How JPA Knows What Changed</h4>
<pre>// This is magic: you never call update() in JPA!
@Transactional
public void updateOrderStatus(Long orderId, OrderStatus newStatus) {
    // Step 1: Load entity → it enters MANAGED state
    Order order = orderRepo.findById(orderId).get();
    // JPA takes a SNAPSHOT of the entity's state at this point

    // Step 2: Modify it (no save/update call needed!)
    order.setStatus(newStatus);
    order.setUpdatedAt(Instant.now());

    // Step 3: Transaction commits → JPA performs DIRTY CHECKING:
    // Compare current state vs snapshot
    // Found difference in 'status' and 'updatedAt' fields
    // → Generates: UPDATE orders SET status=?, updated_at=? WHERE id=?

    // NO NEED for orderRepo.save(order) — JPA does it automatically!
}

// ⚠️ Where dirty checking hurts performance:
@Transactional
public void processBatch() {
    List&lt;Order&gt; orders = orderRepo.findAll();  // Load 10,000 orders
    // JPA now holds 10,000 snapshots in memory!

    orders.get(0).setStatus(SHIPPED);  // modify just ONE

    // On commit: JPA checks ALL 10,000 snapshots vs current state
    // 9,999 have no changes → no SQL generated
    // 1 has changes → UPDATE generated
    // But the overhead of checking 10,000 objects is real!
}
// Fix for large batches: use @Modifying JPQL update instead</pre>

<h4>Flushing — When Does SQL Actually Execute?</h4>
<pre>// Flush = sync persistence context to DB (write pending SQL)
// Flush does NOT commit the transaction

// FlushMode.AUTO (default): Spring/Hibernate decides when to flush:
// 1. Before a query that might see the pending changes
// 2. Before transaction commit

// Example of auto-flush:
@Transactional
public void example() {
    Order order = new Order("customer-1");  // transient
    em.persist(order);                       // managed, INSERT pending

    // JPA auto-flushes HERE because the findAll query might need to see the new order
    List&lt;Order&gt; orders = orderRepo.findAll();  // triggers flush! INSERT executes
    // orders includes the new order

    order.setStatus(CONFIRMED);              // dirty

    // On commit: flush again → UPDATE executes, then COMMIT
}

// Explicit flush:
em.flush();  // forces all pending SQL to execute NOW (within transaction)
em.clear();  // detaches all entities (clears first-level cache)
// Common pattern for batch processing:</pre>

<h4>Identity Map — Same Object Returned for Same ID</h4>
<pre>@Transactional
public void identityMapDemo() {
    // Both calls hit DB? NO!
    Order a = orderRepo.findById(42L).get();  // DB query: SELECT ... WHERE id=42
    Order b = orderRepo.findById(42L).get();  // Cache hit: returns SAME object!

    System.out.println(a == b);  // TRUE — they ARE the same object in memory!

    // This is the identity map: within one persistence context (transaction),
    // the same entity ID always returns the same Java object.
    // Prevents inconsistency and reduces DB queries.

    // But:
    a.setStatus(SHIPPED);
    System.out.println(b.getStatus());  // SHIPPED — because a == b!
}

// ⚠️ Across transactions: identity map is reset
@Transactional
public Order loadOrder() { return orderRepo.findById(42L).get(); }

Order first = loadOrder();   // transaction 1: SELECT
Order second = loadOrder();  // transaction 2: SELECT again!
// first != second (different objects), but same data from DB</pre>`,
            },

            {
              n: 2,
              t: "The N+1 problem — what causes it, how to detect it, and every way to fix it.",
              d: ["intermediate", "advanced"],
              a: `
<p>N+1 is one of the most common performance killers in JPA applications. Every Java interview asks about it.</p>

<h4>What Is N+1?</h4>
<pre>// You load N parent entities, then JPA issues 1 extra query per parent
// to load related (lazy) entities = 1 + N database queries total

// Setup:
@Entity
class Order {
    @Id Long id;
    String customerId;

    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY)
    List&lt;OrderItem&gt; items;  // LAZY — not loaded until accessed
}

// The N+1 scenario:
@Transactional
public void processOrders() {
    List&lt;Order&gt; orders = orderRepo.findAll();  // Query 1: SELECT * FROM orders (100 rows)

    for (Order order : orders) {
        // ❌ THIS LINE TRIGGERS A QUERY FOR EACH ORDER:
        System.out.println(order.getItems().size());
        // Query 2:  SELECT * FROM order_items WHERE order_id = 1
        // Query 3:  SELECT * FROM order_items WHERE order_id = 2
        // Query 4:  SELECT * FROM order_items WHERE order_id = 3
        // ...
        // Query 101: SELECT * FROM order_items WHERE order_id = 100
    }
}
// Total: 101 queries! (1 + 100)
// With 1000 orders: 1001 queries. With 10000: 10001 queries.
// Each query has overhead: network latency + DB parse + result transfer</pre>

<h4>How to Detect N+1</h4>
<pre># application.properties — show SQL and count queries
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Better: use Hibernate statistics (shows query count per session)
spring.jpa.properties.hibernate.generate_statistics=true
logging.level.org.hibernate.stat=debug

# Even better: use datasource-proxy or p6spy to count queries in tests:
# Add to test: assertThat(queryCounter.getCount()).isLessThanOrEqualTo(2);</pre>

<h4>Fix 1 — JOIN FETCH in JPQL (Most Explicit)</h4>
<pre>// Define a custom query that eagerly fetches items in ONE query:
@Repository
public interface OrderRepository extends JpaRepository&lt;Order, Long&gt; {

    // Single query with JOIN:
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items WHERE o.customerId = :customerId")
    List&lt;Order&gt; findByCustomerIdWithItems(@Param("customerId") String customerId);

    // For findAll with items:
    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.items")
    List&lt;Order&gt; findAllWithItems();
    // DISTINCT needed because JOIN creates duplicate rows when items &gt; 1 per order
}

// SQL generated: SELECT * FROM orders o LEFT JOIN order_items i ON o.id = i.order_id
// 1 query instead of 101 ✅</pre>

<h4>Fix 2 — @EntityGraph (Clean, No JPQL)</h4>
<pre>@Repository
public interface OrderRepository extends JpaRepository&lt;Order, Long&gt; {

    // Specify which associations to eagerly load for THIS method only:
    @EntityGraph(attributePaths = {"items", "items.product", "customer"})
    List&lt;Order&gt; findByCustomerId(String customerId);
    // ↑ Fetches: orders + items + each item's product + customer
    // In one JOIN query — no N+1 for any of these!

    // Works with Spring Data's findBy* methods:
    @EntityGraph(attributePaths = {"items"})
    Optional&lt;Order&gt; findById(Long id);  // overrides the default Optional&lt;T&gt; findById
}

// Or define named entity graphs on the entity:
@Entity
@NamedEntityGraph(
    name = "Order.withItems",
    attributeNodes = @NamedAttributeNode(value = "items",
        subgraph = "items.product"),
    subgraphs = @NamedSubgraph(name = "items.product",
        attributeNodes = @NamedAttributeNode("product"))
)
class Order { ... }

// Use in repository:
@EntityGraph("Order.withItems")
List&lt;Order&gt; findAll();</pre>

<h4>Fix 3 — @BatchSize (Reduce N to N/BatchSize)</h4>
<pre>@Entity
class Order {
    @OneToMany(fetch = FetchType.LAZY)
    @BatchSize(size = 50)  // load 50 orders' items in one query instead of 1
    List&lt;OrderItem&gt; items;
}

// When accessing items for 100 orders:
// Before BatchSize: 100 queries
// After BatchSize(50): 2 queries (100/50 = 2)
// ✅ Not perfect, but much better than N+1</pre>

<h4>Fix 4 — DTO Projection (Best Performance for Read-Only)</h4>
<pre>// Load ONLY the columns you need — no entity overhead, no lazy loading issues
public record OrderSummary(Long id, String customerId, BigDecimal total, int itemCount) {}

@Query("""
    SELECT new com.app.dto.OrderSummary(
        o.id, o.customerId, o.total, SIZE(o.items)
    )
    FROM Order o
    WHERE o.status = :status
""")
List&lt;OrderSummary&gt; findSummariesByStatus(@Param("status") OrderStatus status);
// Single query, no N+1, no entity tracking overhead, minimal data transfer

// Interface projection (Spring Data does the mapping automatically):
interface OrderSummaryProjection {
    Long getId();
    String getCustomerId();
    BigDecimal getTotal();
    // Spring creates a proxy that implements this interface
}
List&lt;OrderSummaryProjection&gt; findByStatus(OrderStatus status);
// Spring generates: SELECT o.id, o.customer_id, o.total FROM orders WHERE status=?</pre>

<h4>Choosing the Right Fix</h4>
<table>
  <tr><th>Scenario</th><th>Best Fix</th><th>Why</th></tr>
  <tr><td>Reading data, no entity modifications needed</td><td>DTO Projection</td><td>Minimal data, no ORM overhead</td></tr>
  <tr><td>Need to modify loaded entities</td><td>JOIN FETCH or @EntityGraph</td><td>Loads managed entities in one query</td></tr>
  <tr><td>Can't change query, gradual improvement</td><td>@BatchSize</td><td>Low-risk partial improvement</td></tr>
  <tr><td>Global fix for known association</td><td>Change to EAGER on entity</td><td>Always fetched — use cautiously!</td></tr>
</table>`,
            },

            {
              n: 3,
              t: "@Transactional — propagation, isolation, self-invocation, and common mistakes.",
              d: ["intermediate", "advanced"],
              a: `
<p>@Transactional is Spring's most used annotation and the source of many production bugs. Deep understanding prevents these bugs before they happen.</p>

<h4>Propagation Levels — What Happens When a Transactional Method Calls Another</h4>
<pre>@Service
class OrderService {

    // REQUIRED (default): join existing transaction, or create new one
    // Most common case: ensures the code runs in SOME transaction
    @Transactional  // = @Transactional(propagation = Propagation.REQUIRED)
    public void placeOrder(OrderRequest req) {
        // Either joins the caller's transaction,
        // or starts a new one if none exists
    }

    // REQUIRES_NEW: always starts a NEW transaction, suspends existing one
    // Use case: audit logging that must be committed EVEN IF the main tx rolls back
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logAudit(AuditEvent event) {
        auditRepo.save(event);
        // Committed independently of the caller's transaction
        // Even if caller rolls back, this audit log is saved!
    }

    // NESTED: savepoint within the outer transaction (Postgres supports this)
    // If nested tx rolls back: only rolls back to savepoint, outer tx continues
    // If outer tx rolls back: nested tx rolls back too
    @Transactional(propagation = Propagation.NESTED)
    public void optionalStep() {
        try { riskyOperation(); }
        catch (Exception e) { /* rolled back to savepoint, outer tx continues */ }
    }

    // SUPPORTS: join if exists, run non-transactionally if not
    // Use for read methods that WORK in or out of a transaction
    @Transactional(propagation = Propagation.SUPPORTS)
    public List&lt;Order&gt; findOrders() { return orderRepo.findAll(); }

    // NEVER: throw if called within a transaction
    @Transactional(propagation = Propagation.NEVER)
    public void nonTransactionalOperation() {
        // Throws IllegalTransactionStateException if called from @Transactional code
        // Use to enforce that this should never be in a tx (long batch op etc.)
    }

    // MANDATORY: must be called from within an existing transaction
    @Transactional(propagation = Propagation.MANDATORY)
    public void requiresTransaction() {
        // Throws if no transaction exists — enforces callers manage the tx
    }
}</pre>

<h4>Isolation Levels — Concurrency Problems and Fixes</h4>
<pre>// The Concurrency Problems:
//
// Dirty Read:           Read uncommitted data from another transaction
// Non-Repeatable Read:  Same query returns different data within one transaction
// Phantom Read:         New rows appear between two identical queries

@Service
class ReportService {

    // READ_UNCOMMITTED — fastest, but dirty reads possible
    // Rarely used in practice — almost never the right choice
    @Transactional(isolation = Isolation.READ_UNCOMMITTED)
    public SalesStats getApproximateStats() { ... }

    // READ_COMMITTED (default for most databases — PostgreSQL, SQL Server):
    // No dirty reads, but non-repeatable reads possible
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public Order processPayment(Long orderId) {
        Order order = orderRepo.findById(orderId).get();  // reads version 1
        // ... time passes, another transaction updates order ...
        order = orderRepo.findById(orderId).get();  // might read version 2!
        // This is non-repeatable read
    }

    // REPEATABLE_READ (default for MySQL InnoDB):
    // Same query returns same data within transaction
    // But phantom reads possible (new rows can be inserted)
    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public InventoryCheck checkInventory() {
        int count1 = inventoryRepo.countByStatus(AVAILABLE);  // 100
        // another transaction inserts 5 rows
        int count2 = inventoryRepo.countByStatus(AVAILABLE);  // might be 100 (snapshot)
        // count1 == count2 guaranteed (non-repeatable reads prevented)
        // But phantom rows: countAllIds() might return 105 rows...
    }

    // SERIALIZABLE — strictest, no concurrent anomalies, but slowest
    // Transactions execute as if sequentially
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public TransferResult transferFunds(Long fromId, Long toId, BigDecimal amount) {
        // Financial operations often need this level
        // Any concurrent modification causes a transaction to fail and retry
    }
}</pre>

<h4>readOnly = true — What It Actually Does</h4>
<pre>// @Transactional(readOnly = true) is a hint with real effects:

@Transactional(readOnly = true)
public List&lt;OrderDto&gt; getOrderHistory(String customerId) {
    // Effect 1: Hibernate SKIPS dirty checking on flush
    //   - No snapshot taken of loaded entities
    //   - Saves memory + CPU for read-heavy queries
    //   - For 10,000 loaded entities: significant performance gain

    // Effect 2: Some databases/setups route to READ REPLICA
    //   - Your read replica handles these queries
    //   - Primary DB relieved of read load

    // Effect 3: Documents intent — other devs see this won't modify anything
    return orderRepo.findByCustomerId(customerId)
        .stream().map(OrderDto::from).toList();
}

// Common pattern: separate read and write methods
@Service
class OrderService {
    @Transactional(readOnly = true)   // for reads
    public OrderDto findById(Long id) { ... }

    @Transactional(readOnly = true)
    public List&lt;OrderDto&gt; findAll() { ... }

    @Transactional                     // for writes (readOnly = false by default)
    public OrderDto create(CreateOrderRequest req) { ... }

    @Transactional
    public OrderDto update(Long id, UpdateOrderRequest req) { ... }
}</pre>

<h4>The Self-Invocation Problem — Most Common Transactional Bug</h4>
<pre>@Service
class OrderService {

    @Transactional
    public void processOrder(Long orderId) {
        Order order = orderRepo.findById(orderId).orElseThrow();
        updateInventory(order);   // ❌ @Transactional(REQUIRES_NEW) is IGNORED here!
        sendNotification(order);  // ❌ @Async is also IGNORED here!
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void updateInventory(Order order) {
        // This should run in its OWN transaction
        // But since called via this.updateInventory(), the proxy is bypassed!
        // It runs in the SAME transaction as processOrder
    }

    @Async
    public void sendNotification(Order order) {
        // Should run async, but called from same class → runs synchronously!
    }
}

// WHY: Spring creates a proxy around OrderService.
// External calls: client → PROXY → processOrder() → proxy handles @Transactional
// Internal calls: processOrder() → this.updateInventory() → bypasses PROXY
//                                                          → @Transactional ignored!

// ✅ Fix 1: Extract to separate bean (cleanest)
@Service class InventoryService {
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void update(Order order) { ... }  // now called via proxy
}

// ✅ Fix 2: Self-injection (inject the proxy of itself)
@Service class OrderService {
    @Autowired @Lazy
    private OrderService self;  // THIS is the proxy, not 'this'

    public void processOrder(Long orderId) {
        ...
        self.updateInventory(order);  // calls through proxy → @Transactional works!
    }
}</pre>`,
            },
          ],
        },
      ],
    },
    {
      label: "PART 2 · SPRING DATA — REPOSITORIES & QUERIES",
      sections: [
        {
          id: "spring-data",
          n: 2,
          title: "Spring Data — Repositories, Custom Queries & Pagination",
          desc: "Spring Data eliminates boilerplate data access code. Here's how it works <strong>under the hood</strong> and how to use it effectively.",
          questions: [
            {
              n: 4,
              t: "How does Spring Data generate repository implementations? What is the repository hierarchy?",
              d: ["intermediate"],
              a: `
<p>Spring Data's magic of "I define an interface, Spring creates the implementation" is one of the biggest productivity wins in the Java ecosystem.</p>

<h4>Repository Hierarchy</h4>
<pre>
Repository&lt;T, ID&gt;                   ← Marker only, no methods
 └── CrudRepository&lt;T, ID&gt;          ← save, findById, findAll, count, delete, exists
      └── PagingAndSortingRepository  ← findAll(Sort), findAll(Pageable)
           └── JpaRepository&lt;T, ID&gt;  ← flush, saveAndFlush, getReferenceById,
                                         deleteAllInBatch, findAll + Pageable/Sort
</pre>

<h4>What JpaRepository Adds Over CrudRepository</h4>
<pre>public interface JpaRepository&lt;T, ID&gt; extends PagingAndSortingRepository&lt;T, ID&gt; {

    // findAll with sorts and pages:
    List&lt;T&gt; findAll(Sort sort);
    Page&lt;T&gt; findAll(Pageable pageable);

    // Flush methods — force SQL to DB within the transaction:
    void flush();
    &lt;S extends T&gt; S saveAndFlush(S entity);
    &lt;S extends T&gt; List&lt;S&gt; saveAllAndFlush(Iterable&lt;S&gt; entities);

    // Batch operations (more efficient than one-by-one):
    void deleteAllInBatch(Iterable&lt;T&gt; entities);  // one DELETE with IN clause
    void deleteAllByIdInBatch(Iterable&lt;ID&gt; ids);

    // Lazy proxy — doesn't actually load until you access fields:
    T getReferenceById(ID id);  // throws EntityNotFoundException on access if not found
    // vs findById which returns Optional and loads eagerly
}</pre>

<h4>How Spring Data Generates Implementation at Runtime</h4>
<pre>// You define:
public interface OrderRepository extends JpaRepository&lt;Order, Long&gt; { }

// Spring Data does at startup:
// 1. Detects interface extends Repository (or sub-interface)
// 2. Creates a JDK dynamic proxy (SimpleJpaRepository by default)
// 3. Registers it as a Spring bean named "orderRepository"

// The proxy delegates to SimpleJpaRepository which uses EntityManager:
class SimpleJpaRepository&lt;T, ID&gt; implements JpaRepository&lt;T, ID&gt; {

    private final EntityManager em;
    private final JpaEntityInformation&lt;T, ?&gt; entityInfo;

    @Override
    @Transactional  // ← SimpleJpaRepository adds @Transactional on write methods
    public &lt;S extends T&gt; S save(S entity) {
        if (entityInfo.isNew(entity)) {
            em.persist(entity);
            return entity;
        } else {
            return em.merge(entity);
        }
    }

    @Override
    @Transactional(readOnly = true)  // ← reads are readOnly
    public Optional&lt;T&gt; findById(ID id) {
        return Optional.ofNullable(em.find(entityInfo.getJavaType(), id));
    }
}</pre>

<h4>Derived Query Methods — How Spring Parses Method Names</h4>
<pre>public interface OrderRepository extends JpaRepository&lt;Order, Long&gt; {

    // Spring parses the method name into JPQL automatically:

    // "findBy" = SELECT FROM Order WHERE...
    // "ByCustomerId" = WHERE customerId = ?1
    List&lt;Order&gt; findByCustomerId(String customerId);
    // → SELECT o FROM Order o WHERE o.customerId = ?1

    // Multiple conditions joined with AND/OR:
    List&lt;Order&gt; findByCustomerIdAndStatus(String customerId, OrderStatus status);
    List&lt;Order&gt; findByStatusOrTotal(OrderStatus status, BigDecimal total);

    // Comparison operators:
    List&lt;Order&gt; findByTotalGreaterThan(BigDecimal minTotal);
    List&lt;Order&gt; findByCreatedAtBetween(Instant start, Instant end);
    List&lt;Order&gt; findByCustomerIdIn(Collection&lt;String&gt; customerIds);
    List&lt;Order&gt; findByNotesContaining(String keyword);
    List&lt;Order&gt; findByStatusNotIn(List&lt;OrderStatus&gt; excludedStatuses);
    List&lt;Order&gt; findByDeliveryDateIsNull();
    List&lt;Order&gt; findByDeliveryDateIsNotNull();

    // Limiting results:
    List&lt;Order&gt; findTop5ByCustomerIdOrderByCreatedAtDesc(String customerId);
    Optional&lt;Order&gt; findFirstByCustomerIdOrderByTotalDesc(String customerId);

    // Existence and counting:
    boolean existsByCustomerIdAndStatus(String customerId, OrderStatus status);
    long countByStatus(OrderStatus status);

    // Delete:
    @Modifying
    long deleteByCreatedAtBefore(Instant cutoff);

    // Sort parameter:
    List&lt;Order&gt; findByCustomerId(String customerId, Sort sort);
    // Call: repo.findByCustomerId("cust-1", Sort.by("createdAt").descending())

    // Pageable:
    Page&lt;Order&gt; findByStatus(OrderStatus status, Pageable pageable);
    // Call: repo.findByStatus(PENDING, PageRequest.of(0, 20, Sort.by("total")))
    // Page has: content, totalElements, totalPages, pageNumber, hasNext(), hasPrevious()
}

// ⚠️ Method names get long and unreadable for complex queries:
// findByCustomerIdAndStatusAndTotalGreaterThanAndCreatedAtBetween(...)
// → Use @Query for complex cases!</pre>

<h4>@Query — JPQL and Native Queries</h4>
<pre>public interface OrderRepository extends JpaRepository&lt;Order, Long&gt; {

    // JPQL (references Entity class and field names, not table/column):
    @Query("SELECT o FROM Order o WHERE o.customerId = :customerId AND o.total &gt;= :minTotal")
    List&lt;Order&gt; findHighValueOrders(
        @Param("customerId") String customerId,
        @Param("minTotal") BigDecimal minTotal
    );

    // Native SQL (references actual table/column names):
    @Query(value = """
        SELECT o.*, c.name AS customer_name
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
        WHERE o.status = :status
        AND o.created_at &gt; NOW() - INTERVAL '30 days'
        ORDER BY o.created_at DESC
        LIMIT :limit
        """,
        nativeQuery = true)
    List&lt;Object[]&gt; findRecentOrdersRaw(
        @Param("status") String status,
        @Param("limit") int limit
    );

    // @Modifying — required for UPDATE/DELETE queries:
    @Modifying
    @Transactional
    @Query("UPDATE Order o SET o.status = :newStatus WHERE o.status = :oldStatus AND o.createdAt &lt; :before")
    int bulkUpdateStatus(
        @Param("oldStatus") OrderStatus oldStatus,
        @Param("newStatus") OrderStatus newStatus,
        @Param("before") Instant before
    );
    // Returns number of rows affected

    // JPQL with JOIN FETCH (prevents N+1):
    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.items WHERE o.customerId = :customerId")
    List&lt;Order&gt; findByCustomerIdWithItems(@Param("customerId") String customerId);
}</pre>`,
            },
          ],
        },
      ],
    },
    {
      label: "PART 3 · KAFKA & MESSAGING",
      sections: [
        {
          id: "kafka-deep",
          n: 3,
          title: "Kafka — Producers, Consumers & Reliability Patterns",
          desc: "Kafka's <strong>core concepts, delivery guarantees, consumer groups, and fault-tolerance patterns</strong> — explained from first principles for Spring developers.",
          questions: [
            {
              n: 5,
              t: "Kafka fundamentals — topics, partitions, offsets, and consumer groups explained.",
              d: ["intermediate"],
              a: `
<p>Understanding Kafka's data model is prerequisite to understanding everything else about Kafka.</p>

<h4>The Core Data Model</h4>
<pre>
TOPIC: "orders"
  │
  ├── PARTITION 0  ──── [Record 0] [Record 1] [Record 2] [Record 3]
  │                                                        ↑ offset 3
  │
  ├── PARTITION 1  ──── [Record 0] [Record 1] [Record 2]
  │                                              ↑ offset 2
  │
  └── PARTITION 2  ──── [Record 0] [Record 1]
                                    ↑ offset 1

Records within a PARTITION are STRICTLY ordered by offset.
Records across DIFFERENT partitions have NO ordering guarantees.

CONSUMER GROUP "billing-service":
  ├── Consumer Instance A → reads PARTITION 0
  ├── Consumer Instance B → reads PARTITION 1
  └── Consumer Instance C → reads PARTITION 2
  Each partition assigned to EXACTLY ONE consumer in the group.
</pre>

<h4>Partitions — The Unit of Parallelism</h4>
<pre>// Number of partitions = max parallelism for one consumer group
// 10 partitions: max 10 consumer instances working in parallel
// 3 partitions + 5 consumers: 2 consumers are idle (no partition to read)

// Partition assignment by key:
// - Key present: hash(key) % numPartitions = partition number
// - Same key = same partition = ordered delivery for that key
// - Example: key = orderId → all events for one order go to same partition

// Configure partitions when creating topic:
// bin/kafka-topics.sh --create --topic orders --partitions 12 --replication-factor 3

// In Spring Boot config:
@Bean
NewTopic ordersTopic() {
    return TopicBuilder.name("orders")
        .partitions(12)       // 12 partitions = up to 12 consumers in parallel
        .replicas(3)          // 3 replicas = survives 2 broker failures
        .build();
}</pre>

<h4>Producing Messages</h4>
<pre>@Service
public class OrderEventProducer {

    private final KafkaTemplate&lt;String, OrderEvent&gt; kafkaTemplate;

    // Simple send:
    public void publishOrderCreated(Order order) {
        OrderEvent event = new OrderEvent(order.getId(), "CREATED", Instant.now());
        kafkaTemplate.send("orders", order.getId().toString(), event);
        //                  topic    key (ensures ordering by orderId)  value
    }

    // Send with explicit partition and timestamp:
    public void publishWithMetadata(Order order) {
        ProducerRecord&lt;String, OrderEvent&gt; record = new ProducerRecord&lt;&gt;(
            "orders",                           // topic
            null,                               // partition (null = use key)
            Instant.now().toEpochMilli(),       // timestamp
            order.getId().toString(),           // key
            new OrderEvent(order.getId(), ...)  // value
        );
        record.headers().add("source", "order-service".getBytes());
        record.headers().add("version", "2".getBytes());
        kafkaTemplate.send(record);
    }

    // Send and wait for confirmation:
    public void publishWithAck(Order order) throws Exception {
        OrderEvent event = new OrderEvent(order.getId(), "CREATED", Instant.now());
        SendResult&lt;String, OrderEvent&gt; result = kafkaTemplate
            .send("orders", order.getId().toString(), event)
            .get(5, TimeUnit.SECONDS);  // blocks, throws if not delivered in 5s
        log.info("Delivered to partition {} at offset {}",
            result.getRecordMetadata().partition(),
            result.getRecordMetadata().offset());
    }

    // Async with callback:
    public void publishAsync(Order order) {
        OrderEvent event = new OrderEvent(order.getId(), "CREATED", Instant.now());
        kafkaTemplate.send("orders", order.getId().toString(), event)
            .whenComplete((result, ex) -&gt; {
                if (ex == null) {
                    log.info("Published order {}", order.getId());
                } else {
                    log.error("Failed to publish order {}", order.getId(), ex);
                    // Handle failure: retry, dead-letter, alert
                }
            });
    }
}</pre>

<h4>Consuming Messages</h4>
<pre>@Component
public class OrderEventConsumer {

    // Simple consumer:
    @KafkaListener(topics = "orders", groupId = "billing-service")
    public void handleOrder(OrderEvent event) {
        billingService.processOrder(event);
        // Offset committed automatically after this method returns
    }

    // With full record metadata:
    @KafkaListener(topics = "orders", groupId = "inventory-service")
    public void handleOrderWithMetadata(
            @Payload OrderEvent event,
            @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
            @Header(KafkaHeaders.OFFSET) long offset,
            @Header(KafkaHeaders.RECEIVED_KEY) String key) {

        log.info("Processing order {} from partition {} at offset {}", key, partition, offset);
        inventoryService.updateStock(event);
    }

    // Batch consumption (process multiple records at once):
    @KafkaListener(topics = "orders", groupId = "analytics-service",
                   containerFactory = "batchKafkaListenerContainerFactory")
    public void handleBatch(List&lt;OrderEvent&gt; events,
                             @Header(KafkaHeaders.BATCH_CONVERTED_HEADERS) List&lt;MessageHeaders&gt; headers) {
        log.info("Processing batch of {} orders", events.size());
        analyticsService.recordBatch(events);
    }

    // Manual offset control:
    @KafkaListener(topics = "orders", groupId = "audit-service")
    public void handleWithManualAck(OrderEvent event, Acknowledgment ack) {
        try {
            auditService.log(event);
            ack.acknowledge();  // commit offset AFTER successful processing
        } catch (Exception e) {
            log.error("Failed to process, not committing offset", e);
            // Offset NOT committed → message will be redelivered after restart!
        }
    }
}</pre>

<h4>Consumer Groups — How They Enable Scale</h4>
<pre>// Scenario: "orders" topic has 6 partitions
// Consumer group "billing" has 3 instances

// Kafka assigns:
// billing-instance-1 → partitions 0, 1
// billing-instance-2 → partitions 2, 3
// billing-instance-3 → partitions 4, 5

// Each partition's messages go to exactly ONE consumer in the group.
// Adding more instances (up to 6) increases parallelism.
// Adding more than 6 instances: extra instances idle (no partition available).

// Different consumer groups are INDEPENDENT:
// "billing" and "inventory" both read ALL messages from "orders" independently
// Each maintains its own offset tracking

// In @KafkaListener: groupId determines the consumer group
@KafkaListener(topics = "orders", groupId = "billing-service")    // billing group
@KafkaListener(topics = "orders", groupId = "inventory-service")  // inventory group
// Both receive the same messages, independently
</pre>`,
            },

            {
              n: 6,
              t: "Kafka delivery guarantees — at-most-once, at-least-once, exactly-once, and idempotency.",
              d: ["advanced"],
              a: `
<p>Delivery guarantees are the hardest part of distributed messaging. Getting this wrong causes data loss or duplicate processing — both are production nightmares.</p>

<h4>The Three Delivery Guarantees</h4>
<pre>
AT-MOST-ONCE:  Messages may be lost, but never duplicated.
               Producer: doesn't retry
               Consumer: commits offset BEFORE processing
               ✅ Good for: metrics, analytics (some loss acceptable)
               ❌ Bad for: financial transactions, orders

AT-LEAST-ONCE: Messages may be duplicated, but never lost.
               Producer: retries on failure
               Consumer: commits offset AFTER processing
               ✅ Good for: most use cases with idempotent consumers
               ⚠️ Requires: idempotent consumer implementation

EXACTLY-ONCE:  Messages processed exactly once, no loss, no duplicates.
               Producer: idempotent producer + transactions
               Consumer: read-committed isolation
               ✅ Good for: financial, inventory, critical state machines
               ⚠️ Slower, more complex, requires Kafka transaction support
</pre>

<h4>At-Least-Once (Default in Spring Kafka)</h4>
<pre># application.yml — default settings give at-least-once:
spring:
  kafka:
    producer:
      acks: all          # wait for all replicas to acknowledge
      retries: 3         # retry on transient failures
    consumer:
      enable-auto-commit: false   # manual commit for safety
    listener:
      ack-mode: record            # commit after each record processed

@KafkaListener(topics = "orders")
public void process(OrderEvent event) {
    orderService.process(event);  // process THEN commit
    // If app crashes AFTER process but BEFORE commit → message redelivered
    // Consumer MUST be idempotent to handle redelivery correctly
}</pre>

<h4>Making Your Consumer Idempotent (Critical for At-Least-Once)</h4>
<pre>// Idempotent: processing the same message multiple times = same result as processing once

// Strategy 1: Unique constraint + upsert
@KafkaListener(topics = "payments")
public void processPayment(PaymentEvent event) {
    // If payment already exists (duplicate), upsert does nothing harmful
    paymentRepo.upsertByIdempotencyKey(event.getIdempotencyKey(), event.getAmount());
    // In SQL: INSERT INTO payments ... ON CONFLICT (idempotency_key) DO NOTHING
}

// Strategy 2: Track processed message IDs
@Entity
class ProcessedMessage {
    @Id String messageId;
    Instant processedAt;
}

@KafkaListener(topics = "orders")
@Transactional
public void processOrder(OrderEvent event, @Header(KafkaHeaders.RECORD_METADATA) RecordMetadata metadata) {
    String messageId = metadata.topic() + "-" + metadata.partition() + "-" + metadata.offset();

    // Check if already processed (atomically with processing via transaction)
    if (processedMessageRepo.existsById(messageId)) {
        log.info("Duplicate message {}, skipping", messageId);
        return;
    }

    orderService.process(event);  // business logic
    processedMessageRepo.save(new ProcessedMessage(messageId));  // mark as done
    // Both in same transaction → atomic!
}

// Strategy 3: Set-based deduplication (for bounded time windows)
// If duplicates only occur within a time window (e.g., Kafka's max.poll.interval.ms):
@KafkaListener(topics = "events")
public void process(Event event) {
    if (redisTemplate.opsForSet().add("processed:events", event.getId()) == 0) {
        return;  // already in set = duplicate
    }
    redisTemplate.expire("processed:events:" + event.getId(), Duration.ofHours(24));
    businessLogic(event);
}</pre>

<h4>Dead Letter Queue (DLQ) — Handle Poison Messages</h4>
<pre>// A "poison message" causes the consumer to always throw an exception.
// Without DLQ: the consumer retries forever, blocking all other messages in the partition!

@Configuration
class KafkaConfig {

    @Bean
    DefaultErrorHandler errorHandler(KafkaTemplate&lt;String, Object&gt; kafkaTemplate) {
        // Send to DLT (Dead Letter Topic) after 3 retries with 1s backoff:
        DeadLetterPublishingRecoverer recoverer = new DeadLetterPublishingRecoverer(
            kafkaTemplate,
            (record, ex) -&gt; {
                // DLT naming convention: original.topic + ".DLT"
                log.error("Sending to DLT after failed processing", ex);
                return new TopicPartition(record.topic() + ".DLT", record.partition());
            }
        );

        return new DefaultErrorHandler(
            recoverer,
            new ExponentialBackOffWithMaxRetries(3)  // retry 3 times with exponential backoff
                .apply(new ExponentialBackOff(1000, 2))  // 1s, 2s, 4s delays
        );
    }
}

// Monitor the DLT — reprocess or alert:
@KafkaListener(topics = "orders.DLT", groupId = "dlt-handler")
public void handleDeadLetter(byte[] rawMessage,
                              @Header(KafkaHeaders.EXCEPTION_MESSAGE) String exMessage,
                              @Header(KafkaHeaders.EXCEPTION_STACKTRACE) String stackTrace) {
    log.error("Dead letter received. Cause: {}", exMessage);
    alertService.notifyTeam("Message in DLT", exMessage);
    // Optionally: save to DB for manual review and reprocessing
}</pre>`,
            },
          ],
        },
      ],
    },
    {
      label: "PART 4 · RESILIENCE & DEPLOYMENT",
      sections: [
        {
          id: "resilience-deep",
          n: 4,
          title: "Resilience4j — Circuit Breaker, Retry, Bulkhead in Depth",
          desc: "Building <strong>fault-tolerant microservices</strong> with Resilience4j — patterns, configurations, and how to combine them correctly.",
          questions: [
            {
              n: 7,
              t: "Circuit Breaker pattern — states, transitions, and Resilience4j configuration.",
              d: ["intermediate", "advanced"],
              a: `
<p>The circuit breaker pattern protects your application from cascading failures when downstream services are struggling. Understanding the state machine is key to configuring it correctly.</p>

<h4>The Three States — The Circuit Breaker State Machine</h4>
<pre>
CLOSED state (normal operation):
  ├── Requests go through to downstream service
  ├── Track failures in a sliding window
  └── If failure rate &gt;= threshold → transition to OPEN

OPEN state (fail fast):
  ├── Reject ALL calls immediately (no downstream contact)
  ├── Throw CallNotPermittedException (immediate fail)
  ├── Wait for waitDurationInOpenState (e.g., 30 seconds)
  └── After wait → transition to HALF_OPEN

HALF_OPEN state (testing recovery):
  ├── Allow N test calls through (permittedNumberOfCallsInHalfOpenState)
  ├── If test calls succeed → transition to CLOSED (recovery!)
  └── If test calls fail → transition back to OPEN (still broken)

Key insight: OPEN state PROTECTS downstream — during an outage,
flood of failed requests makes recovery harder.
Circuit breaker gives the downstream time to recover.
</pre>

<h4>Resilience4j Configuration</h4>
<pre># application.yml
resilience4j:
  circuitbreaker:
    instances:
      payment-service:
        # When to open the circuit:
        failure-rate-threshold: 50          # open if 50%+ of calls fail
        slow-call-rate-threshold: 80        # also open if 80%+ are slow
        slow-call-duration-threshold: 2s    # "slow" = &gt; 2 seconds

        # Sliding window (what to measure):
        sliding-window-type: COUNT_BASED    # or TIME_BASED (last N seconds)
        sliding-window-size: 10             # last 10 calls measured
        minimum-number-of-calls: 5         # need at least 5 calls before evaluating

        # OPEN state:
        wait-duration-in-open-state: 30s    # stay OPEN for 30 seconds
        automatic-transition-from-open-to-half-open-enabled: true

        # HALF_OPEN state:
        permitted-number-of-calls-in-half-open-state: 3  # 3 test calls allowed

        # What counts as failure:
        record-exceptions:
          - java.io.IOException
          - java.util.concurrent.TimeoutException
          - feign.FeignException.ServiceUnavailable
        ignore-exceptions:
          - com.app.BusinessException  # business errors shouldn't trip circuit breaker</pre>

<h4>Using @CircuitBreaker with Fallback</h4>
<pre>@Service
public class PaymentClient {

    // Stack decorators (all from outside-in):
    // Bulkhead → CircuitBreaker → Retry → TimeLimiter → actual call

    @CircuitBreaker(name = "payment-service", fallbackMethod = "paymentFallback")
    @Retry(name = "payment-service")
    @TimeLimiter(name = "payment-service")
    public CompletableFuture&lt;PaymentResult&gt; processPayment(PaymentRequest request) {
        return CompletableFuture.supplyAsync(() -&gt; {
            // Call payment service
            return restClient.post()
                .uri("/payments")
                .body(request)
                .retrieve()
                .body(PaymentResult.class);
        });
    }

    // Fallback method — must have same params + Throwable at the end
    // Called when circuit is open OR retries exhausted OR timeout:
    public CompletableFuture&lt;PaymentResult&gt; paymentFallback(PaymentRequest request, Throwable t) {
        log.warn("Payment service unavailable, using fallback. Cause: {}", t.getMessage());

        if (t instanceof CallNotPermittedException) {
            // Circuit is OPEN — return cached/default response
            return CompletableFuture.completedFuture(PaymentResult.queued(request));
        }

        if (t instanceof TimeoutException) {
            // Timed out — maybe retry async later
            paymentQueue.enqueue(request);  // queue for later processing
            return CompletableFuture.completedFuture(PaymentResult.pending(request));
        }

        // Service error — propagate
        return CompletableFuture.failedFuture(new PaymentException("Payment unavailable", t));
    }
}

// Fallback for different exception types (overloading):
public CompletableFuture&lt;PaymentResult&gt; paymentFallback(PaymentRequest req, CallNotPermittedException e) {
    return CompletableFuture.completedFuture(PaymentResult.circuitOpen());
}

public CompletableFuture&lt;PaymentResult&gt; paymentFallback(PaymentRequest req, TimeoutException e) {
    return CompletableFuture.completedFuture(PaymentResult.timeout());
}

public CompletableFuture&lt;PaymentResult&gt; paymentFallback(PaymentRequest req, Throwable t) {
    return CompletableFuture.completedFuture(PaymentResult.error());
}</pre>

<h4>Retry Configuration</h4>
<pre>resilience4j:
  retry:
    instances:
      payment-service:
        max-attempts: 3                # total attempts (including first)
        wait-duration: 500ms           # wait between retries
        enable-exponential-backoff: true
        exponential-backoff-multiplier: 2    # 500ms, 1s, 2s
        randomized-wait-factor: 0.3         # add randomness to avoid thundering herd
        retry-exceptions:
          - java.io.IOException           # retry on network errors
          - org.springframework.web.client.ResourceAccessException
        ignore-exceptions:
          - com.app.BusinessException     # DON'T retry on business logic errors (400s)
          - org.springframework.web.client.HttpClientErrorException.BadRequest</pre>

<h4>Bulkhead — Isolating Failures</h4>
<pre># Two types: semaphore (limits concurrent calls) or thread pool
resilience4j:
  bulkhead:
    instances:
      payment-service:
        max-concurrent-calls: 10        # max 10 concurrent payment calls
        max-wait-duration: 0            # don't wait, fail immediately if at capacity

# When max-concurrent-calls reached, BulkheadFullException thrown
# This prevents the payment service slowness from exhausting ALL threads

@Bulkhead(name = "payment-service", type = Bulkhead.Type.SEMAPHORE,
          fallbackMethod = "bulkheadFallback")
public PaymentResult processPayment(PaymentRequest request) { ... }

// Thread pool bulkhead (better isolation — uses separate thread pool):
resilience4j:
  thread-pool-bulkhead:
    instances:
      payment-service:
        max-thread-pool-size: 10
        core-thread-pool-size: 5
        queue-capacity: 20

@Bulkhead(name = "payment-service", type = Bulkhead.Type.THREADPOOL)
public CompletableFuture&lt;PaymentResult&gt; processPayment(PaymentRequest request) { ... }
// Runs in a DEDICATED thread pool — completely isolated from main request threads</pre>`,
            },

            {
              n: 8,
              t: "Deployment strategies — zero-downtime deploys, graceful shutdown, and Kubernetes integration.",
              d: ["advanced"],
              a: `
<p>Modern production deployments must be zero-downtime. Spring Boot has built-in support, but you need to configure Kubernetes correctly too.</p>

<h4>Graceful Shutdown — Complete Flow</h4>
<pre># Step 1: Configure Spring Boot:
server.shutdown=graceful
spring.lifecycle.timeout-per-shutdown-phase=30s
# This means: after receiving shutdown signal, wait up to 30s for in-flight requests to complete

# Step 2: Configure JVM shutdown hook (Boot does this automatically):
# SIGTERM → Spring's ShutdownHook → starts graceful shutdown

# Step 3: Configure Kubernetes:
# spec:
#   template:
#     spec:
#       terminationGracePeriodSeconds: 60  # must be > Spring's timeout!
#       containers:
#       - lifecycle:
#           preStop:
#             exec:
#               command: ["sleep", "5"]    # wait for iptables to route traffic away

# WHY preStop sleep?
# When K8s sends SIGTERM, it simultaneously removes pod from service endpoints.
# But iptables updates take ~1-5 seconds to propagate.
# During this time, new requests may still arrive.
# preStop sleep = wait for iptables update before Spring starts shutting down.</pre>

<h4>Health Probes — Liveness vs Readiness</h4>
<pre># application.yml:
management:
  endpoint:
    health:
      probes:
        enabled: true     # enables /actuator/health/liveness and /actuator/health/readiness
  health:
    livenessState:
      enabled: true
    readinessState:
      enabled: true

# Kubernetes deployment:
livenessProbe:
  httpGet:
    path: /actuator/health/liveness
    port: 8080
  initialDelaySeconds: 30      # allow JVM warmup before first check
  periodSeconds: 10
  failureThreshold: 3          # fail 3 times → restart pod
  timeoutSeconds: 5

readinessProbe:
  httpGet:
    path: /actuator/health/readiness
    port: 8080
  initialDelaySeconds: 10
  periodSeconds: 5
  failureThreshold: 3          # fail 3 times → remove from load balancer

startupProbe:                  # for slow-starting apps (JVM warmup, large apps)
  httpGet:
    path: /actuator/health/liveness
    port: 8080
  failureThreshold: 30         # allow 30 failures = 30 * 10s = 5 min to start
  periodSeconds: 10

# ⭐ Liveness vs Readiness — critical difference:
# Liveness failure → RESTART the pod (use for deadlocks, OOM, stuck state)
# Readiness failure → STOP TRAFFIC to pod (use for startup, temp overload)

# ❌ Don't include external dependency health in LIVENESS:
# If payment service is down, that shouldn't restart YOUR pod!
# Include payment in READINESS — pod won't receive traffic during outage</pre>

<h4>Custom Health Indicators</h4>
<pre>// Add to readiness — if Kafka is down, pod shouldn't receive new orders:
@Component
class KafkaHealthIndicator implements HealthIndicator {

    private final KafkaAdmin kafkaAdmin;

    @Override
    public Health health() {
        try {
            Map&lt;String, Object&gt; details = kafkaAdmin.describeTopics("orders");
            return Health.up()
                .withDetail("topics", details.keySet())
                .build();
        } catch (Exception e) {
            return Health.down()
                .withDetail("error", e.getMessage())
                .withException(e)
                .build();
        }
    }
}

// Add to readiness indicator:
@Component
class ExternalServiceHealthIndicator extends AbstractHealthIndicator {
    @Override
    protected void doHealthCheck(Health.Builder builder) {
        // slow check — use cache to avoid checking every 5 seconds
        if (externalService.isHealthy()) {
            builder.up().withDetail("external", "reachable");
        } else {
            builder.down().withDetail("external", "unreachable");
        }
    }
}</pre>

<h4>Blue-Green Deployment — Handling Database Migrations</h4>
<pre>// The hardest part of blue-green: BOTH versions run against the same DB briefly

// ❌ WRONG approach (single migration):
// V5__rename_customer_name_to_full_name.sql:
ALTER TABLE customers RENAME COLUMN customer_name TO full_name;
// Deploy blue → green switch
// Problem: Blue code expects 'customer_name', Green code expects 'full_name'
// During switchover: one version is broken!

// ✅ RIGHT approach (multi-step migration):

// Release N: expand migration
// V5__add_full_name_column.sql:
ALTER TABLE customers ADD COLUMN full_name VARCHAR(255);
// UPDATE customers SET full_name = customer_name;  // copy data

// Deploy Release N code: writes to BOTH customer_name AND full_name

// Release N+1: code reads from new column only (full_name)
// No migration needed yet

// Release N+2: contract migration — drop old column
// V6__drop_customer_name.sql:
ALTER TABLE customers DROP COLUMN customer_name;
// (only after ALL old-version code is gone)

// This multi-step approach means:
// 1. Both Blue (old) and Green (new) can run simultaneously
// 2. No breaking change during switchover
// 3. Takes more releases but is zero-risk</pre>

<h4>Kubernetes Rolling Update — Optimal Configuration</h4>
<pre>spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # allow 1 extra pod above desired count (capacity buffer)
      maxUnavailable: 0  # never allow a pod to go down before replacement is ready
                         # ensures at least 3 pods always serving traffic
  minReadySeconds: 15    # pod must be healthy 15s before considered stable
                         # prevents "flapping" — pod starts, fails, replaced too fast
  progressDeadlineSeconds: 300  # fail rollout if not complete in 5 min

# Combined with:
# - readinessProbe: pod only receives traffic when truly ready
# - terminationGracePeriodSeconds: 60: enough time for graceful shutdown
# - preStop sleep: ensures routing tables updated before SIGTERM

# Result: ZERO downtime rolling update
# Old pods: serve traffic → graceful shutdown → terminate
# New pods: start → readinessProbe passes → receive traffic
# At no point are 0 pods serving traffic</pre>`,
            },
          ],
        },
      ],
    },
    {
      label: "PART 5 · DB ENGINES — SQL, POSTGRESQL, MONGODB, ORACLE",
      sections: [
        {
          id: "db-engines-comparison",
          n: 5,
          title: "How Different Databases Work and When to Use Them",
          desc: "Interview-ready comparison of <strong>SQL engines and document databases</strong> with practical backend decision-making.",
          questions: [
            {
              n: 9,
              t: "SQL vs NoSQL — when should backend engineers choose each?",
              d: ["beginner", "intermediate"],
              a: `
<p>Pick by consistency, query patterns, and data model evolution.</p>
<ul>
  <li><strong>SQL (PostgreSQL/Oracle):</strong> complex joins, strict constraints, strong ACID behavior, transactional correctness.</li>
  <li><strong>NoSQL (MongoDB):</strong> flexible schema, document-centric workloads, horizontal scale with denormalized reads.</li>
</ul>
<p>Interview maturity: explain tradeoff, not preference.</p>`,
            },

            {
              n: 10,
              t: "How does PostgreSQL work internally in high-scale systems?",
              d: ["intermediate", "advanced"],
              a: `
<ul>
  <li><strong>MVCC:</strong> row versions allow high read/write concurrency.</li>
  <li><strong>WAL:</strong> durability via log-first write path.</li>
  <li><strong>Autovacuum:</strong> garbage collection of dead tuples created by updates/deletes.</li>
  <li><strong>Planner/optimizer:</strong> chooses optimal join and index plans.</li>
</ul>
<pre>BEGIN;
UPDATE accounts SET balance = balance - 50 WHERE id = 1;
UPDATE accounts SET balance = balance + 50 WHERE id = 2;
COMMIT;
// WAL ensures committed data survives crashes.</pre>`,
            },

            {
              n: 11,
              t: "How does MongoDB work, and where is it a better fit than relational DBs?",
              d: ["intermediate", "advanced"],
              a: `
<ul>
  <li><strong>Document model:</strong> BSON objects with nested structures.</li>
  <li><strong>Replica set:</strong> primary-secondary replication with failover.</li>
  <li><strong>Sharding:</strong> scale-out by shard key.</li>
  <li><strong>Indexes:</strong> single, compound, TTL, text indexes.</li>
</ul>
<p>MongoDB is useful when entity shape changes frequently and read patterns map naturally to document aggregation.</p>`,
            },

            {
              n: 12,
              t: "Why do some enterprises still choose Oracle for critical systems?",
              d: ["advanced"],
              a: `
<ul>
  <li>Strong enterprise-grade HA/recovery capabilities and operational tooling.</li>
  <li>Mature optimizer behavior for complex mixed workloads.</li>
  <li>Partitioning and large-scale governance features common in regulated sectors.</li>
  <li>Deep legacy ecosystem and operational expertise in large organizations.</li>
</ul>
<p>Interview answer: Oracle is often an ecosystem and risk-management decision, not only performance choice.</p>`,
            },

            {
              n: 13,
              t: "How do you decide DB technology in MAANG-level backend interviews?",
              d: ["advanced", "expert"],
              a: `
<ol>
  <li>List invariants: money, inventory, ordering guarantees, compliance.</li>
  <li>List access patterns: point lookup, joins, aggregates, full-text, analytics.</li>
  <li>Estimate scale: QPS, write amplification, storage growth.</li>
  <li>Choose default durable OLTP store (often PostgreSQL) and add specialized stores only when justified.</li>
  <li>Describe migration plan and operability before introducing extra databases.</li>
</ol>
<p>Strong answer includes reliability and ops cost, not just throughput claims.</p>`,
            },
          ],
        },
      ],
    },
  ],
};
