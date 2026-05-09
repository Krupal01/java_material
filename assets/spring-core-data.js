/* =========================================================
   Spring Core & Annotations — Deeply Explained
   Beginner-friendly with experienced-developer depth.
   20 questions across 5 sections.
   ========================================================= */
window.SPRING_CORE_DATA = {
  parts: [
    {
      label: "PART 1 · IoC, DI & THE SPRING CONTAINER",
      sections: [
        {
          id: "ioc-di", n: 1, title: "Inversion of Control & Dependency Injection",
          desc: "The <strong>foundation of Spring</strong>. Every feature — security, transactions, caching — is built on top of IoC and DI. Master these and the rest falls into place.",
          questions: [
            {n:1, t:"What is Inversion of Control (IoC)? Explain with a real-world analogy.", d:["beginner"], a:`
<p><strong>Short answer:</strong> Instead of your code creating and controlling its own dependencies, you hand that control over to a framework (the Spring container). The container creates objects, wires them together, and manages their lifecycle.</p>

<h4>Analogy — The Restaurant vs Home Cooking</h4>
<p><strong>Without IoC (home cooking):</strong> You go to the grocery store, buy every ingredient, bring them home, cook the meal yourself. You control every step — but you're tightly coupled to each store and ingredient. If the store closes, you're stuck.</p>
<p><strong>With IoC (ordering delivery):</strong> You say "I want pasta". The delivery service figures out where to buy pasta, who makes it, how to deliver it. You just consume what arrives. You have no idea (and don't care) about the supply chain.</p>

<h4>Code — Without IoC (Tight Coupling)</h4>
<pre>class OrderService {
    private PaymentService paymentService;
    private EmailService emailService;

    public OrderService() {
        // ❌ YOU are responsible for creating dependencies
        // OrderService must know HOW to build PaymentService
        DatabaseConnection db = new DatabaseConnection(
            "jdbc:postgresql://prod-db:5432/shop", "user", "secret"
        );
        EmailClient emailClient = new EmailClient("smtp.gmail.com", 587);
        this.paymentService = new PaymentService(db);
        this.emailService = new EmailService(emailClient);
        // Problem 1: Hard-coded config — can't test with different settings
        // Problem 2: Change PaymentService constructor? Must change OrderService too
        // Problem 3: Can't swap to a MockPaymentService in tests
    }
}</pre>

<h4>Code — With IoC (Spring manages everything)</h4>
<pre>@Service
class OrderService {
    private final PaymentService paymentService;
    private final EmailService emailService;

    // ✅ Spring reads this and says: "I need to provide a PaymentService
    //    and EmailService. Let me create them and inject them here."
    public OrderService(PaymentService paymentService, EmailService emailService) {
        this.paymentService = paymentService;
        this.emailService = emailService;
    }
    // OrderService has ZERO knowledge of how these are built.
    // In tests: inject MockPaymentService — no real DB needed.
    // In prod: inject real PaymentService — no code change.
}</pre>

<h4>What the Spring IoC Container Actually Does</h4>
<ol>
  <li><strong>Scans</strong> your codebase for beans (<code>@Component</code>, <code>@Service</code>, <code>@Repository</code>, etc.)</li>
  <li><strong>Reads the dependency graph</strong>: "OrderService needs PaymentService; PaymentService needs DatabaseConnection..."</li>
  <li><strong>Resolves the order</strong>: creates DatabaseConnection first, then PaymentService, then OrderService</li>
  <li><strong>Injects dependencies</strong> via constructor, setter, or field</li>
  <li><strong>Manages lifecycle</strong>: runs <code>@PostConstruct</code>, keeps beans alive, runs <code>@PreDestroy</code> on shutdown</li>
</ol>

<h4>Key Insight for Interviews</h4>
<p><strong>IoC</strong> is the <em>principle</em>: "don't call us, we'll call you." <strong>Dependency Injection</strong> is the <em>mechanism</em> Spring uses to implement IoC. Many people use the terms interchangeably — but knowing the distinction signals real depth.</p>
<p>The Spring container (specifically <code>ApplicationContext</code>) is the "box" that holds all your beans and performs IoC. When you call <code>SpringApplication.run()</code>, it boots the container, scans for beans, and wires everything together before serving any requests.</p>`},

            {n:2, t:"What are the 3 types of Dependency Injection? Which one should you use and why?", d:["beginner","intermediate"], a:`
<p>Spring supports three ways to inject dependencies. Each has trade-offs. Knowing <em>why</em> one is preferred over others is what interviewers want to hear.</p>

<h4>1. Constructor Injection (✅ Preferred)</h4>
<pre>@Service
public class OrderService {
    private final PaymentService paymentService;  // final = immutable!
    private final InventoryService inventoryService;

    // Spring sees this constructor and injects both dependencies
    public OrderService(PaymentService paymentService,
                        InventoryService inventoryService) {
        this.paymentService = paymentService;
        this.inventoryService = inventoryService;
    }
}</pre>
<p><strong>Why this is best:</strong></p>
<ul>
  <li><strong>Immutability:</strong> fields can be <code>final</code> — the object is fully initialized and never partially configured</li>
  <li><strong>Testability:</strong> <code>new OrderService(mockPayment, mockInventory)</code> — no Spring context needed in unit tests</li>
  <li><strong>Fails fast:</strong> missing bean = immediate startup error, not a NullPointerException at runtime</li>
  <li><strong>Visible dependencies:</strong> a constructor with 8 params is a code smell that tells you the class does too much</li>
  <li><strong>No @Autowired needed</strong> in Spring 4.3+: single constructor is auto-detected</li>
</ul>

<h4>2. Setter Injection (for optional dependencies)</h4>
<pre>@Service
public class ReportService {
    private EmailService emailService;  // optional — reports work without email

    @Autowired(required = false)  // won't fail if EmailService bean is missing
    public void setEmailService(EmailService emailService) {
        this.emailService = emailService;
    }

    public void generateReport() {
        // ... generate report ...
        if (emailService != null) {
            emailService.send("report ready");
        }
    }
}</pre>
<p><strong>Use setter injection for:</strong> optional dependencies that have defaults, or for plugin-style extensibility. Rarely needed in modern Spring.</p>

<h4>3. Field Injection (❌ Avoid)</h4>
<pre>@Service
public class OrderService {
    @Autowired
    private PaymentService paymentService;  // ❌ injected via reflection

    @Autowired
    private InventoryService inventoryService;
}

// Problems:
// 1. Can't test without Spring context — new OrderService() leaves fields null
// 2. Can't be final — object is partially initialized between construction and injection
// 3. Hides dependencies — you don't see them in the constructor
// 4. Breaks encapsulation — Spring must use reflection to set private fields</pre>

<h4>Decision Table</h4>
<table>
  <tr><th>Type</th><th>Best For</th><th>Supports final?</th><th>Test without Spring?</th></tr>
  <tr><td>Constructor</td><td>Required, core dependencies</td><td>✅ Yes</td><td>✅ Yes</td></tr>
  <tr><td>Setter</td><td>Optional dependencies</td><td>❌ No</td><td>✅ Yes (call setter)</td></tr>
  <tr><td>Field</td><td>Quick scripts, demos</td><td>❌ No</td><td>❌ No</td></tr>
</table>

<h4>Circular Dependency Gotcha with Constructor Injection</h4>
<pre>// ❌ This causes immediate startup failure with constructor injection
@Service class A {
    A(B b) { ... }  // A needs B
}
@Service class B {
    B(A a) { ... }  // B needs A — impossible to create either!
}
// Spring 6.1 throws: The dependencies of some of the beans form a cycle:
//   a -> b -> a
// FIX: Redesign (usually right answer), or use @Lazy on one side</pre>`},

            {n:3, t:"BeanFactory vs ApplicationContext — what's the difference and which to use?", d:["intermediate"], a:`
<p>Both are Spring IoC containers, but <code>ApplicationContext</code> is a significant superset of <code>BeanFactory</code>. In modern Spring, you never use BeanFactory directly.</p>

<h4>BeanFactory — The Minimal Container</h4>
<pre>// Low-level container — rarely used directly
BeanFactory factory = new XmlBeanFactory(new FileSystemResource("beans.xml"));
MyService service = factory.getBean("myService", MyService.class);
// Beans created LAZILY — only when first requested via getBean()
// No AOP, no events, no i18n, no auto-wiring by annotation</pre>

<h4>ApplicationContext — The Full Container</h4>
<p>ApplicationContext extends BeanFactory and adds:</p>
<table>
  <tr><th>Feature</th><th>BeanFactory</th><th>ApplicationContext</th></tr>
  <tr><td>Bean instantiation</td><td>Lazy (on demand)</td><td>Eager (all singletons at startup)</td></tr>
  <tr><td>AOP integration</td><td>❌</td><td>✅ (@Transactional, @Async, etc.)</td></tr>
  <tr><td>ApplicationEvents</td><td>❌</td><td>✅ (publish/listen to events)</td></tr>
  <tr><td>i18n / MessageSource</td><td>❌</td><td>✅</td></tr>
  <tr><td>BeanPostProcessors</td><td>Manual registration</td><td>✅ Auto-registered</td></tr>
  <tr><td>@Autowired scanning</td><td>❌</td><td>✅</td></tr>
  <tr><td>Profiles</td><td>❌</td><td>✅</td></tr>
</table>

<h4>What ApplicationContext You Actually Use in Spring Boot</h4>
<pre>// When you call:
SpringApplication.run(MyApp.class, args);

// Spring Boot creates:
// - AnnotationConfigServletWebServerApplicationContext  (for web apps with Tomcat/Jetty)
// - AnnotationConfigReactiveWebServerApplicationContext (for WebFlux/Netty)
// - AnnotationConfigApplicationContext                 (for non-web apps)

// You access it via injection:
@Component
class MyBean implements ApplicationContextAware {
    private ApplicationContext context;

    @Override
    public void setApplicationContext(ApplicationContext ctx) {
        this.context = ctx;
    }
}
// Or directly inject:
@Autowired
private ApplicationContext context;</pre>

<h4>Eager vs Lazy — Why It Matters</h4>
<p>ApplicationContext creates all singleton beans at startup. This means:</p>
<ul>
  <li><strong>✅ Startup validation:</strong> missing beans, misconfigured dependencies fail immediately — not when a user hits an endpoint</li>
  <li><strong>✅ First request is fast:</strong> no bean creation delay on the first call</li>
  <li><strong>⚠️ Slower startup:</strong> large apps with many beans take longer to start (mitigated with <code>@Lazy</code> or Spring AOT)</li>
</ul>`},

            {n:4, t:"Explain the complete Spring Bean Lifecycle, step by step.", d:["intermediate","advanced"], a:`
<p>This is one of the most common senior interview questions. Understanding the lifecycle means understanding exactly when your code runs and why AOP/transactions/caching work the way they do.</p>

<h4>Full Bean Lifecycle</h4>
<pre>
Step 1: BeanDefinition Loading
   Spring reads @Component, @Bean, XML definitions
   Creates BeanDefinition objects (metadata about the bean)

Step 2: BeanFactoryPostProcessor runs
   Modifies BeanDefinitions BEFORE any beans are created
   Example: PropertySourcesPlaceholderConfigurer resolves \${...} placeholders

Step 3: Bean Instantiation
   Spring calls the constructor (or factory method)
   Bean exists but dependencies are NOT yet injected

Step 4: Property Population (Dependency Injection)
   Spring injects @Autowired fields, setters, @Value, etc.

Step 5: Awareness Interfaces (in this order)
   - setBeanName()        ← if implements BeanNameAware
   - setBeanFactory()     ← if implements BeanFactoryAware
   - setApplicationContext() ← if implements ApplicationContextAware

Step 6: BeanPostProcessor.postProcessBeforeInitialization()
   Runs for EVERY bean before init callbacks
   Example: @Validated processing, @Required checks

Step 7: Initialization Callbacks (in this order)
   a) @PostConstruct method (recommended)
   b) InitializingBean.afterPropertiesSet() (Spring-coupled)
   c) init-method specified in @Bean(initMethod="start")

Step 8: BeanPostProcessor.postProcessAfterInitialization()
   ⭐ THIS IS WHERE AOP PROXIES ARE CREATED
   @Transactional, @Cacheable, @Async beans get wrapped in proxies HERE

Step 9: Bean is Ready for Use
   Added to ApplicationContext. Injected into other beans.

Step 10: Destruction (on context shutdown)
   a) @PreDestroy method (recommended)
   b) DisposableBean.destroy() (Spring-coupled)
   c) destroy-method specified in @Bean(destroyMethod="stop")
</pre>

<h4>Concrete Example — Tracing the Lifecycle</h4>
<pre>@Component
public class DatabaseConnectionPool implements InitializingBean, DisposableBean,
                                               BeanNameAware, ApplicationContextAware {

    @Autowired
    private DataSourceProperties properties;  // Step 4: injected here

    private String beanName;
    private HikariDataSource pool;

    @Override
    public void setBeanName(String name) {  // Step 5a
        this.beanName = name;
        System.out.println("Step 5a: My bean name is: " + name);
    }

    @Override
    public void setApplicationContext(ApplicationContext ctx) {  // Step 5c
        System.out.println("Step 5c: ApplicationContext set");
    }

    @PostConstruct
    public void init() {  // Step 7a — runs AFTER DI, BEFORE bean is ready
        System.out.println("Step 7a @PostConstruct: Creating connection pool");
        pool = new HikariDataSource(properties.toHikariConfig());
        // Safe to use 'properties' here — DI already happened in Step 4
    }

    @Override
    public void afterPropertiesSet() {  // Step 7b — rarely needed
        System.out.println("Step 7b afterPropertiesSet: Validating pool");
        if (pool == null) throw new IllegalStateException("Pool not initialized!");
    }

    @PreDestroy
    public void cleanup() {  // Step 10a
        System.out.println("Step 10a @PreDestroy: Closing connection pool");
        pool.close();
    }
}

// OUTPUT ORDER:
// Step 4: @Autowired properties injected
// Step 5a: My bean name is: databaseConnectionPool
// Step 5c: ApplicationContext set
// BeanPostProcessor.before...  (Step 6)
// Step 7a @PostConstruct: Creating connection pool
// Step 7b afterPropertiesSet: Validating pool
// BeanPostProcessor.after...  (Step 8) — AOP proxy created HERE
// [Bean is now ready and used]
// Step 10a @PreDestroy: Closing connection pool</pre>

<h4>The Crucial Step 8 — Why AOP Works</h4>
<p>When you annotate a service with <code>@Transactional</code>, Spring doesn't modify your class directly. Instead, at <strong>Step 8</strong>, a <code>BeanPostProcessor</code> (specifically <code>AbstractAdvisingBeanPostProcessor</code>) wraps your bean in a <strong>CGLIB proxy</strong> or <strong>JDK dynamic proxy</strong>. The proxy intercepts method calls, starts a transaction, calls your real method, then commits or rolls back. This is why <code>@Transactional</code> on a private method doesn't work — the proxy can't intercept it.</p>

<h4>@PostConstruct vs @Bean(initMethod) vs InitializingBean</h4>
<table>
  <tr><th></th><th>@PostConstruct</th><th>InitializingBean</th><th>@Bean(initMethod)</th></tr>
  <tr><td>Spring coupling</td><td>None (JSR-250)</td><td>Yes (Spring interface)</td><td>None</td></tr>
  <tr><td>Best for</td><td>Your own classes</td><td>Legacy code</td><td>Third-party classes you can't modify</td></tr>
  <tr><td>Recommendation</td><td>✅ Prefer</td><td>Avoid in new code</td><td>Use for third-party</td></tr>
</table>`},

            {n:5, t:"What are Bean Scopes? Which ones are web-specific and why?", d:["intermediate"], a:`
<p>Bean scope defines how many instances of a bean Spring creates and how they are shared. Choosing the wrong scope is a common source of concurrency bugs.</p>

<h4>Singleton (Default) — One Per Container</h4>
<pre>@Service  // default scope = singleton
// OR explicitly:
@Service @Scope("singleton")
class OrderService {
    // ⭐ One instance shared across ALL requests and ALL threads
    // ✅ Efficient — created once, reused
    // ❌ MUST be stateless — no mutable instance fields accessed by multiple threads!

    // ✅ This is fine — stateless field
    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    // ❌ DANGER — shared mutable state across threads!
    private Order currentOrder;  // Don't do this in a singleton!
}</pre>

<h4>Prototype — New Instance Every Time</h4>
<pre>@Component @Scope("prototype")
class ReportBuilder {
    private final List&lt;ReportRow&gt; rows = new ArrayList&lt;&gt;();  // stateful = ok!

    public void addRow(ReportRow row) { rows.add(row); }
    public Report build() { return new Report(rows); }
}

// Each injection / getBean() call creates a NEW instance
@Service class ReportService {
    @Autowired
    private ApplicationContext ctx;

    public Report generate() {
        ReportBuilder builder = ctx.getBean(ReportBuilder.class); // fresh instance
        builder.addRow(...);
        return builder.build();
    }
}

// ⚠️ Gotcha: @Autowired ReportBuilder into a Singleton only injects ONCE
// The singleton holds ONE prototype instance — not fresh per call!
// Use ApplicationContext.getBean(), ObjectProvider, or @Lookup to get fresh instances.</pre>

<h4>Request Scope — One Per HTTP Request (Web Only)</h4>
<pre>@Component @RequestScope
// OR: @Scope(value = "request", proxyMode = ScopedProxyMode.TARGET_CLASS)
class RequestContext {
    private String requestId = UUID.randomUUID().toString();
    private String userId;

    // Fresh instance created for EACH incoming HTTP request
    // Destroyed when HTTP response is sent
    // ✅ Great for: per-request data (user context, trace IDs, cart items)
}</pre>

<h4>Session Scope — One Per HTTP Session (Web Only)</h4>
<pre>@Component @SessionScope
class ShoppingCart {
    private List&lt;CartItem&gt; items = new ArrayList&lt;&gt;();

    // Lives as long as the user's HTTP session
    // Typically 30 minutes of inactivity (configurable)
    // ✅ Great for: shopping carts, user preferences, multi-step forms
}

// ⚠️ Don't inject session-scoped into singleton directly without proxyMode
// Spring creates a proxy that delegates to the current session's instance</pre>

<h4>Application Scope — One Per ServletContext</h4>
<pre>@Component @ApplicationScope
class GlobalConfiguration {
    private Map&lt;String, String&gt; settings = new ConcurrentHashMap&lt;&gt;();
    // Basically like singleton but tied to the ServletContext lifecycle
    // Useful when you have multiple Spring contexts in one JVM
}</pre>

<h4>The Singleton-in-Prototype Injection Problem</h4>
<pre>@Service  // singleton
class OrderService {
    @Autowired
    private ReportBuilder builder;  // prototype — but injected ONCE at startup!

    public Report generateReport() {
        // builder is ALWAYS the same instance — stateful data accumulates!
        builder.addRow(new ReportRow("data"));
        return builder.build();
    }
}

// ✅ Fix 1: Use ObjectProvider (Spring's lazy factory)
@Autowired
private ObjectProvider&lt;ReportBuilder&gt; builderProvider;
// In method: ReportBuilder fresh = builderProvider.getObject();

// ✅ Fix 2: @Lookup method injection
@Lookup
protected ReportBuilder createBuilder() { return null; } // Spring overrides
// In method: ReportBuilder fresh = createBuilder();</pre>`}
          ]
        },
        {
          id: "annotations", n: 2, title: "Core Spring Annotations — Deeply Explained",
          desc: "Every annotation Spring provides, explained with <strong>what it does, why it exists, and how Spring processes it</strong> under the hood.",
          questions: [
            {n:6, t:"@Component, @Service, @Repository, @Controller — what's the real difference?", d:["beginner","intermediate"], a:`
<p>All four are <strong>stereotype annotations</strong> — they all make a class a Spring bean (picked up by component scanning). The difference is semantic (clarity) and one real functional difference with <code>@Repository</code>.</p>

<h4>The Hierarchy</h4>
<pre>@Component             ← base stereotype annotation
 ├── @Service          ← for business logic layer
 ├── @Repository       ← for data access layer (+ exception translation!)
 └── @Controller       ← for web/MVC layer
      └── @RestController ← @Controller + @ResponseBody</pre>

<h4>@Component — Generic Bean</h4>
<pre>@Component
public class JwtTokenParser {
    // Utility class — not clearly "service" or "repo" or "controller"
    // Use @Component for cross-cutting utilities, helpers, factories
    public Claims parse(String token) { ... }
}
// Spring picks this up during @ComponentScan</pre>

<h4>@Service — Business Logic Layer</h4>
<pre>@Service  // = @Component + communicates "this is a service"
public class OrderService {
    // NO functional difference from @Component in Spring's eyes
    // But communicates INTENT to other developers
    // Usually where your business rules, transactions, and orchestration live
    @Transactional
    public Order placeOrder(OrderRequest req) {
        inventoryService.reserve(req.getItems());
        paymentService.charge(req.getPayment());
        return orderRepo.save(new Order(req));
    }
}</pre>

<h4>@Repository — Data Access Layer (Real Functional Difference!)</h4>
<pre>@Repository  // = @Component + EXCEPTION TRANSLATION
public class OrderRepository {
    @PersistenceContext
    private EntityManager em;

    public Order findById(Long id) {
        return em.find(Order.class, id);
    }
}

// ⭐ The real difference: Spring wraps @Repository classes with a proxy
// that TRANSLATES technology-specific exceptions into Spring's unified
// DataAccessException hierarchy.
//
// Without @Repository:
//   JDBC throws: java.sql.SQLException (JDBC-specific, checked)
//   JPA throws:  javax.persistence.EntityNotFoundException (JPA-specific)
//
// With @Repository:
//   JDBC throws: org.springframework.dao.DataAccessException (Spring, unchecked)
//   JPA throws:  org.springframework.dao.EmptyResultDataAccessException
//
// Benefit: Your service layer catches ONE exception type regardless of whether
// you're using JDBC, JPA, MongoDB, or anything else.
// Switching from JDBC to JPA? Service code doesn't change.

// ✅ Spring Data's JpaRepository already handles this — you only need
// @Repository if writing your own data access class.</pre>

<h4>@Controller vs @RestController</h4>
<pre>// @Controller — returns VIEW NAMES (for Thymeleaf, JSP templates)
@Controller
public class WebController {
    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        model.addAttribute("orders", orderService.getAll());
        return "dashboard";  // ← view name, NOT JSON! Thymeleaf renders dashboard.html
    }
}

// @RestController — returns DATA (JSON/XML) directly to response body
@RestController  // = @Controller + @ResponseBody on every method
public class ApiController {
    @GetMapping("/api/orders")
    public List&lt;Order&gt; getOrders() {
        return orderService.getAll();  // ← automatically serialized to JSON
        // No need for @ResponseBody on each method
    }
}

// You can mix by adding @ResponseBody to specific methods in @Controller:
@Controller
public class MixedController {
    @GetMapping("/page")
    public String renderPage(Model model) { return "page"; }  // view

    @GetMapping("/api/data")
    @ResponseBody  // ← this method returns JSON
    public Data fetchData() { return new Data(); }
}</pre>

<h4>Interview Summary</h4>
<p>When asked the difference, most candidates say "just semantic". Level up your answer: <strong>@Repository also activates persistence exception translation</strong>, which abstracts your service layer from the underlying data technology.</p>`},

            {n:7, t:"How does @Autowired resolve beans? What happens when there are multiple candidates?", d:["intermediate"], a:`
<p>Understanding the resolution order is essential for debugging <code>NoUniqueBeanDefinitionException</code> and designing flexible configurations.</p>

<h4>@Autowired Resolution Order</h4>
<pre>
Step 1: By TYPE
   Spring looks for beans of the exact type (or assignable type)
   If exactly ONE match → inject it, done.

Step 2: If MULTIPLE matches → By NAME
   Spring checks if the field/parameter name matches a bean name
   (bean name = class name with lowercase first letter by default)

Step 3: If still ambiguous → check @Primary
   The bean marked @Primary wins

Step 4: If still ambiguous → check @Qualifier
   The @Qualifier annotation specifies exact bean name

Step 5: If STILL ambiguous → NoUniqueBeanDefinitionException
</pre>

<h4>Example — Multiple Implementations</h4>
<pre>interface PaymentService {
    Receipt process(Payment payment);
}

@Service("stripePayment")
class StripePaymentService implements PaymentService { ... }

@Service("paypalPayment")
@Primary  // this is the default when no @Qualifier given
class PayPalPaymentService implements PaymentService { ... }

// Injection scenarios:
@Service
class OrderService {

    // Step 1: Type = PaymentService → 2 matches
    // Step 2: Field name "paymentService" → no exact match (neither bean is named "paymentService")
    // Step 3: @Primary → PayPalPaymentService wins ✅
    @Autowired
    private PaymentService paymentService;  // gets PayPal

    // Step 3: @Primary ignored because @Qualifier is explicit
    @Autowired
    @Qualifier("stripePayment")
    private PaymentService stripeService;  // gets Stripe ✅

    // Step 2: Name "stripePayment" matches bean name → Stripe wins ✅
    @Autowired
    private PaymentService stripePayment;  // gets Stripe (name match)
}</pre>

<h4>Constructor Injection with Multiple Candidates</h4>
<pre>@Service
class CheckoutService {
    private final PaymentService paymentService;

    // With @Qualifier on constructor parameter:
    public CheckoutService(@Qualifier("stripePayment") PaymentService paymentService) {
        this.paymentService = paymentService;
    }
}

// In Spring 6+: use @Qualifier directly in @Bean methods too:
@Configuration
class PaymentConfig {
    @Bean
    @Qualifier("stripe")
    PaymentService stripeService() { return new StripePaymentService(); }
}</pre>

<h4>@Primary — Setting the Default</h4>
<pre>@Service
@Primary  // "When someone asks for PaymentService without specifying, give them me"
class DefaultPaymentService implements PaymentService {
    // Used everywhere that doesn't specify @Qualifier
}

// Override the default in tests:
@TestConfiguration
class TestConfig {
    @Bean @Primary  // overrides the real one during tests
    PaymentService mockPaymentService() {
        return mock(PaymentService.class);
    }
}</pre>

<h4>Optional Dependencies</h4>
<pre>// If EmailService might not be in the context:
@Autowired(required = false)
private EmailService emailService;  // null if no bean found — check before use

// Better approach with Optional:
@Autowired
private Optional&lt;EmailService&gt; emailService;
emailService.ifPresent(s -&gt; s.send("hello"));

// Or with ObjectProvider (most flexible):
@Autowired
private ObjectProvider&lt;EmailService&gt; emailProvider;
emailProvider.ifAvailable(s -&gt; s.send("hello"));</pre>`},

            {n:8, t:"@Configuration vs @Component on a config class — what's the subtle but critical difference?", d:["intermediate","advanced"], a:`
<p>This is a common gotcha that causes subtle bugs. The difference comes down to whether Spring uses CGLIB to proxy the class.</p>

<h4>@Configuration — CGLIB Proxied (Singleton Guarantee)</h4>
<pre>@Configuration  // Spring creates a CGLIB subclass proxy of this class
public class DataSourceConfig {

    @Bean
    public DataSource dataSource() {
        HikariDataSource ds = new HikariDataSource();
        ds.setJdbcUrl("jdbc:postgresql://localhost/mydb");
        return ds;
    }

    @Bean
    public TransactionManager transactionManager() {
        // Calls dataSource() — but NOT your actual method!
        // Spring intercepts this call via CGLIB proxy
        // Returns the SAME singleton DataSource bean from the container
        return new DataSourceTransactionManager(dataSource());
    }

    @Bean
    public JdbcTemplate jdbcTemplate() {
        // Also calls dataSource() — still gets the SAME singleton!
        return new JdbcTemplate(dataSource());
    }
}

// transactionManager and jdbcTemplate share the SAME DataSource instance ✅
// Even though dataSource() looks like it creates a new object each time,
// the CGLIB proxy intercepts the call and returns the cached singleton.</pre>

<h4>@Component — No Proxy (Each Call Creates New Instance)</h4>
<pre>@Component  // NOT CGLIB proxied — just a regular class
public class DataSourceConfig {

    @Bean
    public DataSource dataSource() {
        HikariDataSource ds = new HikariDataSource();
        ds.setJdbcUrl("jdbc:postgresql://localhost/mydb");
        return ds;  // creates a new object each time this method is called!
    }

    @Bean
    public TransactionManager transactionManager() {
        return new DataSourceTransactionManager(dataSource());  // new DataSource! ❌
    }

    @Bean
    public JdbcTemplate jdbcTemplate() {
        return new JdbcTemplate(dataSource());  // another new DataSource! ❌
    }
}

// transactionManager and jdbcTemplate have DIFFERENT DataSource instances!
// Result: transactions and queries go to different connection pools — data corruption risk!</pre>

<h4>When to Use Each</h4>
<table>
  <tr><th>Annotation</th><th>Use When</th><th>Proxy?</th></tr>
  <tr><td>@Configuration</td><td>Defining beans that reference each other</td><td>✅ CGLIB</td></tr>
  <tr><td>@Component</td><td>Regular Spring-managed components (services, repos)</td><td>❌ None</td></tr>
  <tr><td>@Component + @Bean</td><td>Mix of component + bean definitions (no inter-bean calls)</td><td>❌ None — DANGEROUS if @Bean methods call each other</td></tr>
</table>

<h4>proxyBeanMethods = false (Spring Boot Optimization)</h4>
<pre>// Spring Boot's auto-configurations often use:
@Configuration(proxyBeanMethods = false)
class CacheAutoConfiguration {
    // Faster startup: no CGLIB proxy created
    // Safe ONLY when @Bean methods don't call each other
    @Bean
    CacheManager cacheManager() { return new ConcurrentMapCacheManager(); }
    // If you called cacheManager() from another @Bean here, you'd get new instances
}</pre>

<h4>Key Interview Point</h4>
<p>The question "why use @Configuration over @Component for config?" is specifically looking for the CGLIB proxy / singleton guarantee answer. Saying "it's just for readability" misses the most important technical difference.</p>`},

            {n:9, t:"Circular dependencies — what causes them, how to detect, and what's the RIGHT fix?", d:["advanced"], a:`
<p>Circular dependencies are a symptom of a design problem. Understanding how to diagnose and properly fix them is a senior-level skill.</p>

<h4>What Is a Circular Dependency?</h4>
<pre>// A depends on B; B depends on A — impossible to create either first
@Service
class OrderService {
    private final PaymentService paymentService;
    public OrderService(PaymentService ps) { this.paymentService = ps; }
    public void placeOrder() { paymentService.charge(); }
}

@Service
class PaymentService {
    private final OrderService orderService;
    public PaymentService(OrderService os) { this.orderService = os; }
    public void charge() { orderService.updateStatus(); }  // Needs OrderService!
}

// Spring fails at startup:
// The dependencies of some of the beans in the application context form a cycle:
//   orderService → paymentService → orderService</pre>

<h4>Why Constructor Injection Fails Fast (Good!)</h4>
<p>With constructor injection, Spring detects the cycle immediately at startup and throws. This is <strong>good</strong> — it surfaces the design problem during development, not in production.</p>

<h4>Fix 1: Redesign (Best — Addresses Root Cause)</h4>
<pre>// The real problem: OrderService and PaymentService are too tightly coupled
// They probably both need something from each other because responsibilities overlap

// Solution: Extract the shared responsibility into a third class
@Service
class OrderStatusService {
    private final OrderRepository orderRepo;
    void updateStatus(Long orderId, Status status) { ... }
}

@Service
class OrderService {
    private final PaymentService paymentService;
    private final OrderStatusService orderStatusService;
    // OrderService no longer needs PaymentService to know about orders
}

@Service
class PaymentService {
    private final OrderStatusService orderStatusService;
    // PaymentService calls OrderStatusService, not OrderService
    public void charge(Order order) {
        // ... charge logic ...
        orderStatusService.updateStatus(order.getId(), Status.PAID);
    }
}</pre>

<h4>Fix 2: @Lazy — Break the Cycle (Not Ideal)</h4>
<pre>@Service
class OrderService {
    // @Lazy creates a proxy that initializes PaymentService only when first used
    // Delays the problem rather than solving the design issue
    @Lazy
    private final PaymentService paymentService;

    public OrderService(@Lazy PaymentService paymentService) {
        this.paymentService = paymentService;
    }
}
// ⚠️ @Lazy = "we have a design smell but we're hiding it"
// Use only as a temporary fix while you redesign</pre>

<h4>Fix 3: Setter Injection (Breaks the Constructor Cycle)</h4>
<pre>@Service
class PaymentService {
    private OrderService orderService;  // no final

    // Spring can create PaymentService without OrderService
    // then set it via this setter after both are created
    @Autowired
    public void setOrderService(OrderService orderService) {
        this.orderService = orderService;
    }
}
// ⚠️ Same caveat — masks the design problem
// The class is now partially constructed between constructor and setter call</pre>

<h4>How to Identify Circular Dependency Root Causes</h4>
<p>Ask these questions about your design:</p>
<ul>
  <li><strong>Does A really need B AND B really need A?</strong> Usually not — one direction is a stretch. Remove it.</li>
  <li><strong>Can the dependency be event-based?</strong> Instead of A calling B directly, A publishes an event that B listens to. No circular reference needed.</li>
  <li><strong>Is there hidden shared state?</strong> Extract it into a third class (common pattern: both need a "repository" or "context" class).</li>
  <li><strong>Are A and B too large?</strong> Circular deps often appear in God classes. Split them by single responsibility.</li>
</ul>`}
          ]
        }
      ]
    },
    {
      label: "PART 2 · SPRING BOOT INTERNALS",
      sections: [
        {
          id: "boot-internals", n: 3, title: "Spring Boot Auto-Configuration Deep Dive",
          desc: "How Spring Boot goes from an empty <code>main()</code> to a fully configured running application — the magic explained.",
          questions: [
            {n:10, t:"How does Spring Boot auto-configuration actually work? Walk through it step by step.", d:["intermediate","advanced"], a:`
<p>Auto-configuration is what makes Spring Boot "just work". Understanding the mechanism is essential for debugging when it doesn't work as expected.</p>

<h4>Step 1 — @SpringBootApplication Unpacked</h4>
<pre>// @SpringBootApplication is a shortcut for three annotations:
@SpringBootConfiguration  // = @Configuration (this is a config class)
@EnableAutoConfiguration  // ← THE KEY ANNOTATION
@ComponentScan(basePackageClasses = {App.class})  // scan from App's package
public class App {
    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }
}

// @EnableAutoConfiguration imports AutoConfigurationImportSelector,
// which does the heavy lifting</pre>

<h4>Step 2 — AutoConfigurationImportSelector Reads the Classpath</h4>
<pre>// AutoConfigurationImportSelector reads this file from EVERY JAR on the classpath:
// META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports

// Example (from spring-boot-autoconfigure.jar):
org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration
org.springframework.boot.autoconfigure.data.jpa.JpaRepositoriesAutoConfiguration
org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration
org.springframework.boot.autoconfigure.cache.CacheAutoConfiguration
// ... 150+ more entries

// These are ALL the candidate auto-configurations.
// But not all of them activate! That's controlled by @Conditional annotations.</pre>

<h4>Step 3 — @Conditional Annotations Gate Each Auto-Configuration</h4>
<pre>// Let's look at DataSourceAutoConfiguration (simplified):
@AutoConfiguration
@ConditionalOnClass({ DataSource.class, EmbeddedDatabaseType.class })
// ↑ Only activates if DataSource class is on the classpath
//   (i.e., spring-boot-starter-data-jpa or spring-boot-starter-jdbc is present)

@ConditionalOnMissingBean(DataSourceInitializationSpecification.class)
// ↑ If YOU defined a DataSource bean, this entire auto-config backs off

@EnableConfigurationProperties(DataSourceProperties.class)
// ↑ Binds spring.datasource.* properties to DataSourceProperties POJO
public class DataSourceAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean
    // ↑ Only creates DataSource if YOU haven't defined one
    public DataSource dataSource(DataSourceProperties properties) {
        return properties.initializeDataSourceBuilder().build();
        // Reads: spring.datasource.url, .username, .password, .driver-class-name
    }
}</pre>

<h4>Step 4 — The Conditional Hierarchy</h4>
<table>
  <tr><th>Annotation</th><th>Activates When</th><th>Common Use</th></tr>
  <tr><td>@ConditionalOnClass</td><td>Class is on classpath</td><td>Starter dependency present</td></tr>
  <tr><td>@ConditionalOnMissingClass</td><td>Class is NOT on classpath</td><td>Fallback implementation</td></tr>
  <tr><td>@ConditionalOnBean</td><td>Bean of type exists</td><td>Another bean is configured first</td></tr>
  <tr><td>@ConditionalOnMissingBean</td><td>No bean of type exists</td><td>Let user override</td></tr>
  <tr><td>@ConditionalOnProperty</td><td>Property has specific value</td><td>Feature flags</td></tr>
  <tr><td>@ConditionalOnWebApplication</td><td>Is a web application</td><td>Web-specific beans</td></tr>
  <tr><td>@ConditionalOnExpression</td><td>SpEL expression is true</td><td>Complex conditions</td></tr>
</table>

<h4>Full Flow — From main() to Ready State</h4>
<pre>
1. SpringApplication.run(App.class, args)
   ↓
2. Creates appropriate ApplicationContext type
   (AnnotationConfigServletWebServerApplicationContext for web apps)
   ↓
3. Loads bean definitions from:
   - @ComponentScan (your classes with @Component, @Service, etc.)
   - @SpringBootApplication's @Configuration class
   - Auto-configuration candidates (from .imports files)
   ↓
4. Filters auto-config candidates using @Conditional annotations
   - Checks classpath for classes
   - Checks existing bean definitions
   - Checks application.properties values
   ↓
5. Orders the remaining configs (respecting @AutoConfigureBefore/After)
   ↓
6. Creates all beans (your beans first, then auto-configured beans)
   ↓
7. Runs ApplicationRunner / CommandLineRunner beans
   ↓
8. Starts embedded server (Tomcat/Jetty/Undertow)
   ↓
9. App is ready for traffic
</pre>

<h4>How to Override Auto-Configuration</h4>
<pre>// You define your own bean → @ConditionalOnMissingBean backs off auto-config
@Configuration
class MyConfig {
    @Bean
    DataSource myCustomDataSource() {
        // Auto-configuration's DataSource is NOT created — yours wins
        HikariDataSource ds = new HikariDataSource();
        ds.setJdbcUrl("jdbc:postgresql://custom-host/mydb");
        ds.setMaximumPoolSize(50);
        return ds;
    }
}

// To see which auto-configs are active/inactive:
// Add this property and check startup logs:
logging.level.org.springframework.boot.autoconfigure=DEBUG
// Or access: GET /actuator/conditions (shows all conditions evaluated)</pre>

<h4>Debugging Auto-Configuration Issues</h4>
<pre>// Problem: "Why isn't my DataSource being auto-configured?"
// Solution 1: Check conditions report
//   Add: spring.main.log-startup-info=true  (shows key auto-configs)
//   Or: java -jar app.jar --debug  (full conditions evaluation report)

// Problem: "My auto-configured bean is overriding mine"
// Solution: Ensure your @Bean is loaded BEFORE the auto-config
//   Use @AutoConfigureBefore in your auto-config class
//   Or ensure @Configuration is properly scanned</pre>`},

            {n:11, t:"What is a Spring Boot Starter and how does it work internally?", d:["beginner","intermediate"], a:`
<p>Starters are one of Spring Boot's most developer-friendly features. Understanding how they work helps you create your own and debug dependency issues.</p>

<h4>The Problem Starters Solve</h4>
<pre>// Before starters — setting up a web app required:
// 1. Find Spring MVC artifact
// 2. Find compatible Jackson version
// 3. Find compatible Hibernate Validator version
// 4. Find compatible Tomcat version
// 5. Find compatible SLF4J/Logback version
// 6. Verify none of these conflict with each other
// This could take hours. Version conflicts were common.

// With spring-boot-starter-web:
&lt;dependency&gt;
    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
    &lt;artifactId&gt;spring-boot-starter-web&lt;/artifactId&gt;
    // ↑ This one dependency pulls in ALL of the above at compatible versions
    // No version specified — Spring Boot's BOM manages it
&lt;/dependency&gt;</pre>

<h4>What a Starter Actually Is</h4>
<pre>// A starter is just a POM file with curated dependencies.
// spring-boot-starter-web/pom.xml:
&lt;dependencies&gt;
    &lt;dependency&gt;spring-boot-starter&lt;/dependency&gt;           // Core Spring Boot
    &lt;dependency&gt;spring-boot-starter-json&lt;/dependency&gt;     // Jackson
    &lt;dependency&gt;spring-boot-starter-tomcat&lt;/dependency&gt;   // Embedded Tomcat
    &lt;dependency&gt;spring-web&lt;/dependency&gt;                   // Spring MVC core
    &lt;dependency&gt;spring-webmvc&lt;/dependency&gt;                // Spring MVC impl
&lt;/dependencies&gt;
// That's it. A starter is a dependency aggregator, not code.
// The actual auto-configuration lives in spring-boot-autoconfigure.jar</pre>

<h4>Common Starters and What They Provide</h4>
<table>
  <tr><th>Starter</th><th>Provides</th></tr>
  <tr><td>spring-boot-starter-web</td><td>Spring MVC + embedded Tomcat + Jackson</td></tr>
  <tr><td>spring-boot-starter-data-jpa</td><td>Spring Data + Hibernate + JDBC pool (HikariCP)</td></tr>
  <tr><td>spring-boot-starter-security</td><td>Spring Security with sensible defaults</td></tr>
  <tr><td>spring-boot-starter-test</td><td>JUnit 5 + Mockito + Spring Test + Testcontainers support</td></tr>
  <tr><td>spring-boot-starter-cache</td><td>Spring Cache abstraction</td></tr>
  <tr><td>spring-boot-starter-validation</td><td>Hibernate Validator (Bean Validation)</td></tr>
  <tr><td>spring-boot-starter-actuator</td><td>Production monitoring endpoints</td></tr>
  <tr><td>spring-boot-starter-data-redis</td><td>Lettuce Redis client + Spring Data Redis</td></tr>
</table>

<h4>Switching Embedded Servers</h4>
<pre>// spring-boot-starter-web uses Tomcat by default
// To use Undertow (lighter, often faster for high concurrency):
&lt;dependency&gt;
    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
    &lt;artifactId&gt;spring-boot-starter-web&lt;/artifactId&gt;
    &lt;exclusions&gt;
        &lt;exclusion&gt;
            &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
            &lt;artifactId&gt;spring-boot-starter-tomcat&lt;/artifactId&gt;
        &lt;/exclusion&gt;
    &lt;/exclusions&gt;
&lt;/dependency&gt;
&lt;dependency&gt;
    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
    &lt;artifactId&gt;spring-boot-starter-undertow&lt;/artifactId&gt;
&lt;/dependency&gt;
// Spring Boot auto-detects Undertow and configures it automatically</pre>

<h4>Creating Your Own Starter (for Company-Wide Libraries)</h4>
<pre>// Structure of a custom starter:
my-company-starter/
├── my-company-autoconfigure/       ← auto-configuration module
│   ├── src/main/java/
│   │   └── MyCompanyAutoConfiguration.java
│   └── src/main/resources/
│       └── META-INF/spring/
│           └── org.springframework.boot.autoconfigure.AutoConfiguration.imports
│               ← Contains: com.mycompany.MyCompanyAutoConfiguration
└── my-company-starter/             ← starter module (just a POM)
    └── pom.xml                     ← depends on autoconfigure + curated deps

// MyCompanyAutoConfiguration.java:
@AutoConfiguration
@ConditionalOnClass(MyCompanyClient.class)
@ConditionalOnProperty(prefix = "mycompany", name = "enabled", havingValue = "true")
public class MyCompanyAutoConfiguration {
    @Bean
    @ConditionalOnMissingBean
    MyCompanyClient myCompanyClient(MyCompanyProperties props) {
        return new MyCompanyClient(props.getApiKey(), props.getBaseUrl());
    }
}</pre>`}
          ]
        },
        {
          id: "config-profiles-deep", n: 4, title: "Profiles & Externalized Configuration",
          desc: "How to manage environment-specific behavior <strong>without rebuilding</strong> your application — the right way.",
          questions: [
            {n:12, t:"@Value vs @ConfigurationProperties — when to use each, and how does type binding work?", d:["intermediate","advanced"], a:`
<p>Both inject external configuration, but they serve different purposes and have very different capabilities.</p>

<h4>@Value — Simple, One-Off Property Injection</h4>
<pre>@Service
class ApiClient {
    @Value("\${api.base-url}")
    private String baseUrl;

    @Value("\${api.timeout:5000}")  // default 5000 if property missing
    private int timeoutMs;

    @Value("\${api.enabled:true}")  // default true
    private boolean enabled;

    // SpEL expressions (powerful but can get complex):
    @Value("#{systemEnvironment['HOME']}")
    private String homeDir;

    @Value("#{T(java.time.Duration).parse('\${api.max-duration:PT30S}')}")
    private Duration maxDuration;

    // List injection:
    @Value("\${api.allowed-ips}")  // api.allowed-ips=192.168.1.1,10.0.0.1
    private List&lt;String&gt; allowedIps;  // Spring splits on comma
}

// application.properties:
// api.base-url=https://payment.example.com
// api.timeout=10000</pre>

<h4>@ConfigurationProperties — Type-Safe, Structured Binding (Preferred)</h4>
<pre>// application.yml:
// payment:
//   gateway:
//     base-url: https://stripe.com
//     api-key: sk_test_abc123
//     timeout-ms: 10000
//     retry:
//       max-attempts: 3
//       backoff-ms: 500
//     supported-currencies:
//       - USD
//       - EUR
//       - GBP

@ConfigurationProperties(prefix = "payment.gateway")
@Validated  // enables @NotBlank, @Min etc. on fields
public record PaymentGatewayConfig(
    @NotBlank String baseUrl,
    @NotBlank String apiKey,
    @Positive int timeoutMs,
    RetryConfig retry,
    List&lt;String&gt; supportedCurrencies
) {
    public record RetryConfig(
        @Min(1) @Max(10) int maxAttempts,
        @Positive long backoffMs
    ) {}
}

// Register it:
@SpringBootApplication
@ConfigurationPropertiesScan  // auto-scans all @ConfigurationProperties
public class App { ... }

// OR explicitly:
@EnableConfigurationProperties(PaymentGatewayConfig.class)
@Configuration
class AppConfig { ... }</pre>

<h4>Using @ConfigurationProperties</h4>
<pre>@Service
class PaymentService {
    private final PaymentGatewayConfig config;

    public PaymentService(PaymentGatewayConfig config) {
        this.config = config;
    }

    public Receipt charge(Payment payment) {
        if (!config.supportedCurrencies().contains(payment.currency())) {
            throw new UnsupportedCurrencyException(payment.currency());
        }
        // config.baseUrl(), config.apiKey(), config.timeoutMs() all available
        // config.retry().maxAttempts(), config.retry().backoffMs() for retry logic
    }
}</pre>

<h4>Comparison Table</h4>
<table>
  <tr><th>Feature</th><th>@Value</th><th>@ConfigurationProperties</th></tr>
  <tr><td>Best for</td><td>1-2 properties, simple types</td><td>Groups of related properties</td></tr>
  <tr><td>Type safety</td><td>Basic</td><td>✅ Full (records, nested POJOs, generics)</td></tr>
  <tr><td>Validation</td><td>No</td><td>✅ @Validated + Bean Validation annotations</td></tr>
  <tr><td>IDE support</td><td>Limited</td><td>✅ Autocomplete in IDE (with spring-configuration-processor)</td></tr>
  <tr><td>SpEL expressions</td><td>✅ Yes</td><td>❌ No</td></tr>
  <tr><td>Relaxed binding</td><td>Exact key only</td><td>✅ Kebab, camel, snake, uppercase</td></tr>
  <tr><td>Collections</td><td>Limited (CSV)</td><td>✅ Full (List, Map, nested)</td></tr>
</table>

<h4>Relaxed Binding in @ConfigurationProperties</h4>
<pre>// All of these map to "payment.gateway.base-url" in @ConfigurationProperties:
// payment.gateway.base-url=...        (kebab-case — recommended)
// payment.gateway.baseUrl=...         (camelCase)
// payment.gateway.base_url=...        (snake_case)
// PAYMENT_GATEWAY_BASE_URL=...        (env var / uppercase)
// payment.gateway.BASE-URL=...        (mixed)

// This makes @ConfigurationProperties ideal for Kubernetes/Docker:
// - ConfigMap: PAYMENT_GATEWAY_BASE_URL=https://stripe.com
// - Mapped to: payment.gateway.base-url property
// - Bound to: PaymentGatewayConfig.baseUrl field</pre>

<h4>Validating Config at Startup</h4>
<pre>@ConfigurationProperties("payment.gateway")
@Validated
public record PaymentGatewayConfig(
    @NotBlank(message = "Payment gateway URL must not be empty")
    String baseUrl,

    @NotBlank(message = "API key required — set PAYMENT_GATEWAY_API_KEY env var")
    String apiKey,

    @Min(value = 100, message = "Timeout must be at least 100ms")
    @Max(value = 60000, message = "Timeout must be less than 60 seconds")
    int timeoutMs
) {}

// If any validation fails, app REFUSES to start with clear error:
// APPLICATION FAILED TO START
// Description:
//   Binding to target PaymentGatewayConfig failed:
//     Property: payment.gateway.api-key
//     Value: ""
//     Reason: API key required — set PAYMENT_GATEWAY_API_KEY env var</pre>`},

            {n:13, t:"Spring Profiles — how to use them properly for multi-environment setups?", d:["beginner","intermediate"], a:`
<p>Profiles are how you make one codebase work differently in dev, test, staging, and production without code changes — only configuration changes.</p>

<h4>The Profile Concept</h4>
<pre>// Without profiles: you'd hardcode environment-specific config
// With profiles: each environment has its own config subset

// Activate a profile (multiple ways):
// 1. Command line:        java -jar app.jar --spring.profiles.active=prod
// 2. Environment var:     SPRING_PROFILES_ACTIVE=prod
// 3. Property file:       spring.profiles.active=prod
// 4. In tests:            @ActiveProfiles("test")
// 5. Programmatically:    new SpringApplicationBuilder().profiles("prod")

// Multiple profiles:
// --spring.profiles.active=prod,monitoring,eu-region</pre>

<h4>Profile-Specific Property Files</h4>
<pre>src/main/resources/
├── application.yml          ← Base config (ALL profiles)
├── application-dev.yml      ← DEV overrides
├── application-test.yml     ← TEST overrides
├── application-prod.yml     ← PROD overrides (no secrets here!)
└── application-local.yml    ← Local dev (gitignored!)

# application.yml (base):
spring:
  application:
    name: order-service
  datasource:
    hikari:
      maximum-pool-size: 10  # sensible default

logging:
  level:
    root: INFO

# application-dev.yml:
spring:
  datasource:
    url: jdbc:h2:mem:devdb  # H2 in dev — no real DB needed
    hikari:
      maximum-pool-size: 2  # dev machine has limited resources
logging:
  level:
    com.myapp: DEBUG  # verbose in dev

# application-prod.yml:
spring:
  datasource:
    url: \${DB_URL}  # env var in production — NEVER hardcode prod credentials
    username: \${DB_USER}
    password: \${DB_PASSWORD}
    hikari:
      maximum-pool-size: 50  # production needs more connections
logging:
  level:
    com.myapp: WARN  # only warnings in prod</pre>

<h4>Profile-Specific Beans</h4>
<pre>// Different bean implementations per environment
interface EmailService {
    void send(String to, String subject, String body);
}

@Service
@Profile("prod")  // Only in production
class SmtpEmailService implements EmailService {
    public void send(String to, String subject, String body) {
        // Actually sends emails via SMTP
        smtpClient.send(new Email(to, subject, body));
    }
}

@Service
@Profile({"dev", "test"})  // In dev and test
class MockEmailService implements EmailService {
    private final List&lt;Email&gt; sentEmails = new ArrayList&lt;&gt;();

    public void send(String to, String subject, String body) {
        sentEmails.add(new Email(to, subject, body));
        log.info("MOCK EMAIL to {}: {}", to, subject);  // just log, don't send
    }

    public List&lt;Email&gt; getSentEmails() { return sentEmails; }  // for assertions in tests
}

@Service
@Profile("!prod")  // Any profile that's NOT prod
class LocalFileStorageService implements StorageService { ... }

@Service
@Profile("prod")
class S3StorageService implements StorageService { ... }

// Profile logic operators (Spring 5.1+):
@Profile("prod & us-east")      // BOTH prod AND us-east
@Profile("dev | local")         // dev OR local
@Profile("!prod & !staging")    // NOT prod AND NOT staging</pre>

<h4>Profile-Specific YAML in One File</h4>
<pre>---
# Shared across all profiles
spring:
  application:
    name: order-service

---
spring:
  config:
    activate:
      on-profile: dev
  datasource:
    url: jdbc:h2:mem:devdb
server:
  port: 8080

---
spring:
  config:
    activate:
      on-profile: prod
  datasource:
    url: \${DB_URL}
server:
  port: 80</pre>

<h4>Common Mistake — Default Profile</h4>
<pre>// If NO profile is active, the "default" profile applies
// This catches people off guard:
@Component
@Profile("default")  // ONLY active when no other profile is set
class DevDataLoader implements ApplicationRunner { ... }

// Better: explicit profile names
@Component
@Profile("dev")  // Only in dev — clear intent</pre>`}
          ]
        }
      ]
    },
    {
      label: "PART 3 · REST API & WEB LAYER",
      sections: [
        {
          id: "rest-deep", n: 5, title: "REST API — Controllers, Validation & Exception Handling",
          desc: "Building production-quality REST APIs: request/response mapping, input validation, and structured error handling.",
          questions: [
            {n:14, t:"How does Spring MVC process an HTTP request? (Dispatcher Servlet flow)", d:["intermediate","advanced"], a:`
<p>Every HTTP request in a Spring Boot web app goes through the same pipeline. Understanding this makes debugging much easier.</p>

<h4>The DispatcherServlet — Central Coordinator</h4>
<pre>
HTTP Request
    │
    ▼
┌─────────────────────────────────────────────────┐
│           Filter Chain (Servlet Filters)         │
│  SecurityFilter → LoggingFilter → CorsFilter...  │
└─────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────┐
│              DispatcherServlet                   │
│  (Spring's "Front Controller" — one for all)    │
└─────────────────────────────────────────────────┘
    │
    ├─ Step 1: HandlerMapping
    │  "Which @Controller method handles GET /orders/42?"
    │  → RequestMappingHandlerMapping: scans @RequestMapping, @GetMapping, etc.
    │  → Returns HandlerExecutionChain (handler + interceptors)
    │
    ├─ Step 2: HandlerInterceptors (preHandle)
    │  Logging interceptors, authentication checks, rate limiting
    │  Can abort the request (return false from preHandle)
    │
    ├─ Step 3: HandlerAdapter
    │  "How do I call this handler (controller method)?"
    │  → RequestMappingHandlerAdapter handles @Controller methods
    │  → Resolves method arguments: @PathVariable, @RequestBody, @RequestParam...
    │  → Calls the method
    │
    ├─ Step 4: Method Argument Resolution
    │  @PathVariable → extract from URI
    │  @RequestBody  → deserialize JSON body via Jackson
    │  @RequestParam → query string or form fields
    │  @Valid        → trigger Bean Validation
    │  Authentication → from SecurityContext
    │
    ├─ Step 5: Method Execution
    │  Your actual @GetMapping method runs here
    │
    ├─ Step 6: Return Value Handling
    │  Returns an object → serialize to JSON via Jackson
    │  Returns ResponseEntity → control status code and headers
    │  Returns a view name → ViewResolver picks the template
    │
    ├─ Step 7: HandlerInterceptors (postHandle + afterCompletion)
    │
    └─ Step 8: Send HTTP Response
</pre>

<h4>A Concrete Example</h4>
<pre>// This is what happens for: GET /orders/42?include-items=true
@RestController
@RequestMapping("/orders")
class OrderController {

    @GetMapping("/{id}")
    public OrderDto getOrder(
            @PathVariable Long id,           // Step 4: extracted from URI path
            @RequestParam(defaultValue = "false") boolean includeItems,  // Step 4: query param
            @AuthenticationPrincipal UserDetails user) {  // Step 4: from SecurityContext

        // Step 5: This actually runs
        return orderService.findById(id, includeItems, user.getUsername());
        // Step 6: OrderDto serialized to JSON by Jackson
        // HTTP 200 with {"id":42,"total":99.99,...}
    }
}

// Under the hood for @PathVariable:
// URI template: /orders/{id}  matches  /orders/42
// HandlerAdapter extracts "42" as String, converts to Long via ConversionService
// Spring's ConversionService has converters for all primitive types + common types</pre>

<h4>@ExceptionHandler and @ControllerAdvice</h4>
<pre>// Without @ControllerAdvice:
// Unhandled exceptions → Spring returns ugly 500 error page or plain JSON error

// ✅ Centralized exception handling:
@RestControllerAdvice  // = @ControllerAdvice + @ResponseBody
public class GlobalExceptionHandler {

    // Handles validation failures from @Valid
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiError handleValidationError(MethodArgumentNotValidException ex,
                                           HttpServletRequest request) {
        List&lt;String&gt; errors = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(e -&gt; e.getField() + ": " + e.getDefaultMessage())
            .toList();

        return new ApiError(
            Instant.now(),
            400,
            "Validation Failed",
            errors,
            request.getRequestURI()
        );
    }

    // Handles business exceptions
    @ExceptionHandler(OrderNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiError handleNotFound(OrderNotFoundException ex) {
        return new ApiError(Instant.now(), 404, "Not Found",
            List.of(ex.getMessage()), null);
    }

    // Catch-all for unexpected errors
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiError handleGeneric(Exception ex) {
        log.error("Unexpected error", ex);  // Log full stack trace
        // Don't expose internal details to client!
        return new ApiError(Instant.now(), 500, "Internal Server Error",
            List.of("An unexpected error occurred"), null);
    }
}

// Standard error response structure:
public record ApiError(
    Instant timestamp,
    int status,
    String error,
    List&lt;String&gt; messages,
    String path
) {}</pre>`},

            {n:15, t:"Bean Validation — how to validate requests properly at every layer?", d:["beginner","intermediate"], a:`
<p>Validation is a critical part of every API. Spring integrates Jakarta Bean Validation (formerly javax) seamlessly. Here's how to do it right at every layer.</p>

<h4>Step 1 — Add the Dependency</h4>
<pre>&lt;dependency&gt;
    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
    &lt;artifactId&gt;spring-boot-starter-validation&lt;/artifactId&gt;
&lt;/dependency&gt;
// Provides: Hibernate Validator (the implementation of Jakarta Bean Validation)</pre>

<h4>Step 2 — Define Constraints on DTOs</h4>
<pre>public record CreateOrderRequest(
    @NotBlank(message = "Customer ID is required")
    String customerId,

    @NotEmpty(message = "Order must have at least one item")
    @Size(max = 50, message = "Order cannot have more than 50 items")
    List&lt;@Valid OrderItemRequest&gt; items,  // @Valid cascades into nested objects

    @NotNull
    @Future(message = "Delivery date must be in the future")
    LocalDate deliveryDate
) {}

public record OrderItemRequest(
    @NotBlank(message = "Product ID is required")
    String productId,

    @Min(value = 1, message = "Quantity must be at least 1")
    @Max(value = 1000, message = "Quantity cannot exceed 1000")
    int quantity,

    @DecimalMin(value = "0.01", message = "Price must be positive")
    BigDecimal price
) {}</pre>

<h4>Step 3 — Trigger Validation in Controller</h4>
<pre>@RestController
@RequestMapping("/orders")
class OrderController {

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderDto createOrder(
            @Valid @RequestBody CreateOrderRequest request) {
            //  ↑ @Valid triggers validation. If fails:
            //    → MethodArgumentNotValidException is thrown
            //    → @ControllerAdvice handles it (see previous question)
        return orderService.create(request);
    }

    @GetMapping("/{id}")
    public OrderDto getOrder(
            @PathVariable @Min(1) Long id) {  // validate path variable
            // ⚠️ Requires @Validated on the CLASS level for path/query param validation
        return orderService.findById(id);
    }
}

// For path/query variable validation:
@RestController
@Validated  // ← This enables constraint processing on parameters
class OrderController {
    @GetMapping("/{id}")
    public OrderDto getOrder(@PathVariable @Min(1) Long id) { ... }
    // Throws ConstraintViolationException if id &lt; 1
}</pre>

<h4>Step 4 — Service Layer Validation</h4>
<pre>@Service
@Validated  // Enable method-level validation
class OrderService {

    public OrderDto create(@Valid CreateOrderRequest request) {
        // @Valid here validates EVEN when called from other services
        // (not just from controller)
        // Throws ConstraintViolationException (not MethodArgumentNotValidException)
        ...
    }

    public OrderDto findById(@Min(1) Long id) {
        if (id &lt; 1) throw new ConstraintViolationException(...);  // auto-thrown
        ...
    }
}</pre>

<h4>Custom Constraint Annotation</h4>
<pre>// Define the annotation:
@Target({FIELD, PARAMETER})
@Retention(RUNTIME)
@Constraint(validatedBy = ValidOrderStatusValidator.class)
@Documented
public @interface ValidOrderStatus {
    String message() default "Invalid order status";
    Class&lt;?&gt;[] groups() default {};
    Class&lt;? extends Payload&gt;[] payload() default {};
    String[] allowedValues() default {"PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"};
}

// Implement the validator:
public class ValidOrderStatusValidator
        implements ConstraintValidator&lt;ValidOrderStatus, String&gt; {

    private Set&lt;String&gt; allowedValues;

    @Override
    public void initialize(ValidOrderStatus annotation) {
        this.allowedValues = Set.of(annotation.allowedValues());
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext ctx) {
        if (value == null) return true;  // @NotNull handles null separately
        if (allowedValues.contains(value)) return true;

        // Custom violation message:
        ctx.disableDefaultConstraintViolation();
        ctx.buildConstraintViolationWithTemplate(
            "Status '" + value + "' is invalid. Allowed: " + allowedValues
        ).addConstraintViolation();
        return false;
    }
}

// Use it:
public record UpdateStatusRequest(
    @ValidOrderStatus String status
) {}</pre>

<h4>Handling Validation Errors — Proper Error Response</h4>
<pre>@RestControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ValidationErrorResponse handleValidationError(
            MethodArgumentNotValidException ex) {

        Map&lt;String, List&lt;String&gt;&gt; fieldErrors = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .collect(Collectors.groupingBy(
                FieldError::getField,
                Collectors.mapping(FieldError::getDefaultMessage, Collectors.toList())
            ));

        return new ValidationErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            "Validation failed",
            fieldErrors
        );
        // Response:
        // {
        //   "status": 400,
        //   "message": "Validation failed",
        //   "errors": {
        //     "customerId": ["Customer ID is required"],
        //     "items[0].quantity": ["Quantity must be at least 1"],
        //     "deliveryDate": ["Delivery date must be in the future"]
        //   }
        // }
    }
}</pre>`},

            {n:16, t:"BeanPostProcessor and BeanFactoryPostProcessor — what are they and when to implement them?", d:["advanced"], a:`
<p>These are Spring's most powerful extension points. Understanding them reveals how Spring's own features (AOP, caching, transactions) are actually built.</p>

<h4>BeanFactoryPostProcessor — Modify Definitions BEFORE Creation</h4>
<pre>// Runs after ALL bean definitions are loaded, but BEFORE any beans are instantiated
// Use case: modify, add, or remove bean definitions dynamically

@Component
public class CustomBeanFactoryPostProcessor implements BeanFactoryPostProcessor {

    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory factory) {
        // At this point: all bean DEFINITIONS are loaded, no beans created yet

        // Example 1: Modify a bean definition
        BeanDefinition def = factory.getBeanDefinition("orderService");
        def.setScope(BeanDefinition.SCOPE_PROTOTYPE);  // change to prototype!

        // Example 2: Register a new bean definition programmatically
        RootBeanDefinition myBeanDef = new RootBeanDefinition(MySpecialService.class);
        factory.registerBeanDefinition("mySpecialService", myBeanDef);

        // Example 3: Check what beans are defined
        String[] serviceNames = factory.getBeanNamesForType(OrderService.class);
        log.info("Found {} OrderService beans", serviceNames.length);
    }
}

// Most important built-in BeanFactoryPostProcessor:
// PropertySourcesPlaceholderConfigurer — this is what resolves \${...} placeholders!
// It runs at this phase and replaces all @Value("\${server.port}") with actual values.</pre>

<h4>BeanPostProcessor — Intercept Every Bean After Creation</h4>
<pre>// Runs for EVERY SINGLE BEAN — before and after initialization callbacks
// This is how Spring adds AOP proxies, validation, custom annotations, etc.

@Component
public class PerformanceTrackingPostProcessor implements BeanPostProcessor {

    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) {
        // Runs BEFORE @PostConstruct — bean has DI but init hasn't run yet
        // Return the bean (or a replacement!) to continue
        return bean;
    }

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) {
        // ⭐ THIS is where AOP proxies are created
        // If the bean has @Transactional, @Cacheable, @Async, etc.,
        // Spring wraps it in a proxy HERE and returns the proxy (not the original!)

        // Example: wrap all @Service beans with a timing proxy
        if (bean.getClass().isAnnotationPresent(Service.class)) {
            return Proxy.newProxyInstance(
                bean.getClass().getClassLoader(),
                bean.getClass().getInterfaces(),
                (proxy, method, args) -&gt; {
                    long start = System.nanoTime();
                    try {
                        return method.invoke(bean, args);
                    } finally {
                        long ms = (System.nanoTime() - start) / 1_000_000;
                        log.info("{}.{} took {}ms", beanName, method.getName(), ms);
                    }
                }
            );
        }
        return bean;
    }
}

// Key insight: When your @Service has @Transactional and you inject it elsewhere,
// you're actually getting a CGLIB PROXY, not your class.
// The proxy looks and behaves like your class, but intercepts calls to
// add transactional behavior.

// This is why:
// - @Transactional on private methods doesn't work (proxy can't intercept)
// - this.method() calls bypass the proxy (self-invocation)
// - You can verify: orderService.getClass() returns something like OrderService$$SpringCGLIB$$0</pre>

<h4>Real-World: Building Your Own @Retry Annotation</h4>
<pre>// Step 1: Create annotation
@Target(METHOD)
@Retention(RUNTIME)
public @interface Retry {
    int maxAttempts() default 3;
    long delayMs() default 1000;
    Class&lt;? extends Exception&gt;[] on() default {Exception.class};
}

// Step 2: Create BeanPostProcessor to wrap beans that have @Retry methods
@Component
public class RetryBeanPostProcessor implements BeanPostProcessor {
    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) {
        boolean hasRetryMethods = Arrays.stream(bean.getClass().getMethods())
            .anyMatch(m -&gt; m.isAnnotationPresent(Retry.class));

        if (!hasRetryMethods) return bean;

        // Create proxy that handles @Retry
        return Proxy.newProxyInstance(..., new RetryHandler(bean));
    }
}

// This is exactly how Resilience4j, Spring Retry, and @Transactional work!</pre>`}
          ]
        }
      ]
        },
        {
            label: "PART 4 · COMPLETE PREPARATION ROADMAP",
            sections: [
                {
                    id: "core-roadmap", n: 6, title: "Beginner to Advanced Spring Learning Path",
                    desc: "A practical <strong>end-to-end roadmap</strong> so a beginner can build strong fundamentals and progress to advanced system design level.",
                    questions: [
                        {n:1, t:"What concepts should a beginner learn first in Spring, in the correct order?", d:["beginner"], a:`
<p>Use this order. Each layer depends on the previous one.</p>

<h4>Phase 1: Java and HTTP foundations</h4>
<ul>
    <li>OOP, interfaces, exceptions, collections, streams, concurrency basics</li>
    <li>HTTP methods, status codes, headers, JSON, stateless vs stateful</li>
    <li>Maven/Gradle basics, dependency scopes, profiles</li>
</ul>

<h4>Phase 2: Core Spring fundamentals</h4>
<ul>
    <li>IoC, DI, Bean lifecycle, bean scopes</li>
    <li>@Component/@Service/@Repository/@Controller</li>
    <li>Constructor injection, @Configuration, @Bean</li>
    <li>@Value, @ConfigurationProperties, profiles, property files</li>
</ul>

<h4>Phase 3: Spring Boot and web APIs</h4>
<ul>
    <li>Auto-configuration, starters, embedded server</li>
    <li>@RestController, request/response mapping, validation</li>
    <li>Global exception handling with @ControllerAdvice</li>
</ul>

<h4>Phase 4: Data layer</h4>
<ul>
    <li>JPA entities, persistence context, transactions</li>
    <li>Spring Data repositories, paging/sorting/specifications</li>
    <li>N+1 problem and fetch strategies</li>
</ul>

<h4>Phase 5: Advanced production topics</h4>
<ul>
    <li>Security (JWT/OAuth2), method security, RBAC</li>
    <li>AOP, caching, async, events, messaging (Kafka/RabbitMQ)</li>
    <li>Resilience patterns, observability, deployment and scaling</li>
</ul>

<p><strong>Interview tip:</strong> explain not only "what" but also "why" and "when not to use it".</p>`},

                        {n:2, t:"Give a project-based roadmap to move from beginner to advanced in 12 weeks.", d:["beginner","intermediate"], a:`
<p>Build one project in stages, not many disconnected mini-projects.</p>

<h4>Weeks 1-3: Core API</h4>
<ul>
    <li>Create CRUD REST API with DTO mapping and validation</li>
    <li>Add layered architecture: controller, service, repository</li>
    <li>Write unit tests for services and controllers</li>
</ul>

<h4>Weeks 4-6: Database and transactions</h4>
<ul>
    <li>Model entities and relationships</li>
    <li>Add pagination, sorting, search filters</li>
    <li>Use @Transactional correctly for write operations</li>
    <li>Measure and fix one N+1 query issue</li>
</ul>

<h4>Weeks 7-9: Security and advanced features</h4>
<ul>
    <li>Implement JWT auth with refresh token</li>
    <li>Add role-based authorization</li>
    <li>Add caching and async email/event processing</li>
</ul>

<h4>Weeks 10-12: Production readiness</h4>
<ul>
    <li>Add logs, metrics, health checks (Actuator)</li>
    <li>Containerize with Docker and run with PostgreSQL</li>
    <li>Add integration tests with Testcontainers</li>
    <li>Prepare API docs and architecture notes</li>
</ul>

<p><strong>Result:</strong> by week 12, you have a portfolio-ready project and interview-ready explanations.</p>`},

                        {n:3, t:"What are the most common beginner mistakes in Spring, and how to avoid them?", d:["beginner","intermediate"], a:`
<h4>Top mistakes</h4>
<ul>
    <li><strong>Field injection everywhere:</strong> makes testing hard. Use constructor injection.</li>
    <li><strong>Entity exposed directly in API:</strong> creates coupling and security risks. Use DTOs.</li>
    <li><strong>Missing transaction boundaries:</strong> inconsistent writes. Define service-level @Transactional.</li>
    <li><strong>No validation:</strong> bad input reaches DB. Use @Valid and constraint annotations.</li>
    <li><strong>Ignoring exception strategy:</strong> random stack traces in API. Use global handler with consistent error format.</li>
    <li><strong>No paging:</strong> loading entire tables into memory. Use Pageable.</li>
    <li><strong>No tests:</strong> regressions during refactor. Add unit + slice + integration tests.</li>
</ul>

<h4>Simple rule</h4>
<p>If a feature touches correctness, money, or security, cover it with tests and explicit configuration.</p>`},

                        {n:4, t:"What should I revise before Spring interviews to prove advanced understanding?", d:["advanced"], a:`
<h4>Revision checklist</h4>
<ul>
    <li>Explain IoC, DI, bean lifecycle, and why proxies are needed for @Transactional/@Cacheable/@Async.</li>
    <li>Explain transaction propagation and isolation with real examples.</li>
    <li>Explain how Spring Security filter chain authenticates and authorizes requests.</li>
    <li>Explain JPA persistence context, dirty checking, lazy loading, and N+1 fixes.</li>
    <li>Explain caching strategy and invalidation trade-offs.</li>
    <li>Explain testing pyramid: unit, slice, integration, end-to-end.</li>
    <li>Explain production practices: observability, graceful shutdown, retries, circuit breakers.</li>
</ul>

<h4>How to answer in interviews</h4>
<ol>
    <li>Start with concept definition in one sentence.</li>
    <li>Give a concrete project example.</li>
    <li>Mention one pitfall and one mitigation.</li>
    <li>Conclude with trade-off.</li>
</ol>`}
                    ]
                }
            ]
        }
    ]
};
