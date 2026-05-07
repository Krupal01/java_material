/* =========================================================
   Spring Boot — Beginner to Advanced Guide.
   280+ Q&A across 20 collapsible sections.
   ========================================================= */
window.SPRING_DATA = {
  parts: [
    {
      label: "PART 1 · BEGINNER FOUNDATION",
      sections: [
        {
          id:"spring-core", n:1, title:"Spring Core Fundamentals",
          desc:"<strong>IoC, DI, beans</strong> — the heart of Spring. Master these and the rest follows.",
          questions: [
            {n:1,t:"What is the Spring Framework?",d:["beginner"],a:`<p>An open-source Java application framework providing <strong>Inversion of Control (IoC)</strong>, <strong>Dependency Injection (DI)</strong>, and modules for web, data, security, messaging, and more. Spring Boot builds on it for opinionated, production-ready apps.</p>`},
            {n:2,t:"What is IoC (Inversion of Control)?",d:["beginner"],a:`<p>The framework — not your code — controls object creation and wiring. You declare dependencies; Spring's container instantiates and injects them. Reduces coupling and makes testing easier.</p>`},
            {n:3,t:"What is Dependency Injection (DI)?",d:["beginner"],a:`<p>A specific form of IoC: a class doesn't create its dependencies — they're <em>injected</em> from outside (constructor, setter, or field). Spring's container performs the injection at startup.</p>`},
            {n:4,t:"What's the difference between BeanFactory and ApplicationContext?",d:["intermediate"],a:`<p><strong>BeanFactory</strong>: basic IoC container, lazy bean instantiation. <strong>ApplicationContext</strong>: extends BeanFactory + event publishing, internationalization, AOP, eager singleton init by default. Always use <code>ApplicationContext</code> in modern apps.</p>`},
            {n:5,t:"Explain the Spring bean lifecycle.",d:["intermediate"],a:`<ol><li>Container reads bean definition</li><li>Instantiate bean</li><li>Populate properties (DI)</li><li><code>BeanNameAware.setBeanName()</code> if applicable</li><li><code>BeanFactoryAware.setBeanFactory()</code></li><li><code>ApplicationContextAware.setApplicationContext()</code></li><li><code>BeanPostProcessor.postProcessBeforeInitialization()</code></li><li><code>@PostConstruct</code> / <code>InitializingBean.afterPropertiesSet()</code> / custom init-method</li><li><code>BeanPostProcessor.postProcessAfterInitialization()</code> — proxies wrap here (AOP, transactions)</li><li>Bean is ready</li><li>On shutdown: <code>@PreDestroy</code> / <code>DisposableBean.destroy()</code> / custom destroy-method</li></ol>`},
            {n:6,t:"@PostConstruct vs InitializingBean.afterPropertiesSet?",d:["intermediate"],a:`<p>Both run after DI. <code>@PostConstruct</code> (JSR-250) is preferred — annotation-based, no Spring coupling. <code>InitializingBean</code> is interface-based and ties code to Spring.</p>`},
            {n:7,t:"Bean scopes in Spring?",d:["intermediate"],a:`<ul><li><strong>singleton</strong> (default): one instance per container</li><li><strong>prototype</strong>: new instance every injection</li><li><strong>request</strong>: per HTTP request (web)</li><li><strong>session</strong>: per HTTP session</li><li><strong>application</strong>: per ServletContext</li><li><strong>websocket</strong>: per WebSocket session</li></ul>`},
            {n:8,t:"Field vs constructor vs setter injection?",d:["beginner","intermediate"],a:`<p><strong>Constructor</strong> (preferred): immutable, easy to test, fails fast on missing deps. <strong>Setter</strong>: optional dependencies, allows reconfiguration. <strong>Field</strong>: concise but discouraged — hides dependencies, hard to test, can't be final.</p>`},
            {n:9,t:"@Component vs @Service vs @Repository vs @Controller?",d:["beginner"],a:`<p>All are <code>@Component</code> specializations. <strong>@Service</strong>: business logic. <strong>@Repository</strong>: persistence + auto exception translation (DataAccessException). <strong>@Controller</strong>: web. <strong>@RestController</strong>: <code>@Controller</code> + <code>@ResponseBody</code>.</p>`},
            {n:10,t:"@Autowired — how does it resolve beans?",d:["intermediate"],a:`<p>Resolution order: 1) by <strong>type</strong>, 2) if multiple — by <strong>@Qualifier</strong> or @Primary, 3) by <strong>name</strong>. Throws <code>NoUniqueBeanDefinitionException</code> if ambiguous.</p>`},
            {n:11,t:"@Qualifier vs @Primary — when?",d:["intermediate"],a:`<p><strong>@Primary</strong>: marks one bean as default for its type. <strong>@Qualifier(\"name\")</strong>: at injection point, picks a specific bean by name. Use @Primary when one is "usually right"; @Qualifier for explicit overrides.</p>`},
            {n:12,t:"Circular dependency — what happens and how to fix?",d:["advanced"],a:`<p>Spring may throw <code>BeanCurrentlyInCreationException</code>. Fixes: 1) <strong>refactor</strong> (best — usually a design smell), 2) use <strong>setter injection</strong>, 3) <strong>@Lazy</strong> on one side, 4) <strong>ObjectProvider/Provider</strong> for lazy lookup. Constructor + circular = fatal.</p>`},
            {n:13,t:"@Configuration vs @Component for config classes?",d:["intermediate"],a:`<p><strong>@Configuration</strong>: CGLIB-proxied — calls to <code>@Bean</code> methods inside return the SAME singleton. <strong>@Component</strong> with @Bean: NOT proxied, inner @Bean calls create new instances. Always use @Configuration for bean definitions.</p>`},
            {n:14,t:"What is @Lazy and when to use it?",d:["intermediate"],a:`<p>Defers bean creation until first use. Useful for: expensive beans, breaking circular deps, or beans that may not always be needed. Default is eager singleton creation.</p>`},
            {n:15,t:"How does Spring handle prototype-scoped bean inside a singleton?",d:["advanced"],a:`<p>The prototype is injected ONCE — singleton holds the same instance. To get fresh prototypes use: <code>@Lookup</code> method, <code>ObjectFactory&lt;T&gt;</code>, <code>Provider&lt;T&gt;</code>, or <code>ApplicationContext.getBean()</code>.</p>`},
            {n:16,t:"What is BeanPostProcessor?",d:["advanced"],a:`<p>Hook to modify bean instances after instantiation. <code>postProcessBeforeInitialization</code> runs before init callbacks; <code>postProcessAfterInitialization</code> runs after — this is where AOP proxies wrap your bean for <code>@Transactional</code>, <code>@Async</code>, etc.</p>`},
            {n:17,t:"What is BeanFactoryPostProcessor?",d:["advanced"],a:`<p>Modifies bean DEFINITIONS (metadata) before any beans are instantiated. Example: <code>PropertySourcesPlaceholderConfigurer</code> resolves <code>\${...}</code> placeholders.</p>`},
            {n:18,t:"What's the @SpringBootApplication annotation composed of?",d:["beginner"],a:`<p>Three meta-annotations: <code>@SpringBootConfiguration</code> (= @Configuration), <code>@EnableAutoConfiguration</code>, <code>@ComponentScan</code>. The single annotation bootstraps a full Spring Boot app.</p>`}
          ]
        },
        {
          id:"boot-basics", n:2, title:"Spring Boot Basics",
          desc:"<strong>Auto-configuration, starters, embedded servers</strong> — what makes Boot productive.",
          questions: [
            {n:19,t:"Spring vs Spring Boot — key differences?",d:["beginner"],a:`<p>Spring: framework with manual XML/Java config, external server. Spring Boot: convention-over-config, <strong>auto-configuration</strong>, embedded server, starters, Actuator, opinionated defaults. Boot doesn't replace Spring — it builds on it.</p>`},
            {n:20,t:"How does auto-configuration work?",d:["intermediate"],a:`<p>Spring Boot scans classpath for <code>META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports</code> (or older <code>spring.factories</code>). Each imported config class uses <code>@ConditionalOnClass</code>, <code>@ConditionalOnMissingBean</code>, etc. to conditionally register beans.</p>`},
            {n:21,t:"What is a starter dependency?",d:["beginner"],a:`<p>A curated POM (<code>spring-boot-starter-web</code>, <code>-data-jpa</code>…) that pulls in coherent versions of related libraries. Avoids version conflicts and "what JAR do I need?" hunts.</p>`},
            {n:22,t:"application.properties vs application.yml?",d:["beginner"],a:`<p>Identical functionality, different syntax. YAML is more readable for nested configs but YAML pitfall: indentation matters. Boot loads either; if both exist, properties takes precedence.</p>`},
            {n:23,t:"@Value vs @ConfigurationProperties?",d:["intermediate"],a:`<p><strong>@Value(\"\${prop}\")</strong>: simple single-property injection, supports SpEL. <strong>@ConfigurationProperties(prefix=\"app\")</strong>: type-safe, structured POJO binding for groups of properties, supports validation. Prefer @ConfigurationProperties for non-trivial config.</p>`},
            {n:24,t:"Property precedence order in Spring Boot?",d:["advanced"],a:`<p>Highest → lowest: 1) command-line args, 2) <code>SPRING_APPLICATION_JSON</code>, 3) servlet init params, 4) JNDI, 5) Java system properties, 6) OS env vars, 7) profile-specific properties, 8) application.properties, 9) <code>@PropertySource</code>, 10) defaults. Later wins for the same key.</p>`},
            {n:25,t:"What is a Spring profile?",d:["beginner"],a:`<p>A named bucket of beans/config that activates conditionally. Lets you have different beans/properties per environment (dev, test, prod) in one codebase. Bean: <code>@Profile(\"prod\")</code>. Properties: <code>application-prod.yml</code>.</p>`},
            {n:26,t:"How do you activate a Spring profile?",d:["beginner"],a:`<ul><li>JVM arg: <code>-Dspring.profiles.active=prod</code></li><li>Env var: <code>SPRING_PROFILES_ACTIVE=prod</code></li><li>Property: <code>spring.profiles.active=prod</code></li><li>Programmatically: <code>SpringApplication.setAdditionalProfiles(\"prod\")</code></li></ul><p>Multiple: <code>--spring.profiles.active=prod,monitoring</code>.</p>`},
            {n:27,t:"@Profile annotation use cases?",d:["intermediate"],a:`<pre>@Bean
@Profile("prod")
DataSource prodDb() { ... }

@Bean
@Profile("!prod")  // any non-prod
DataSource devDb() { ... }</pre><p>Compose: <code>@Profile({\"prod\",\"staging\"})</code>.</p>`},
            {n:28,t:"What if I override an auto-configured bean?",d:["intermediate"],a:`<p>Auto-config uses <code>@ConditionalOnMissingBean</code>, so defining your own bean of the same type backs off the auto-config. To override defaults, just declare a <code>@Bean</code> in your <code>@Configuration</code> — Spring Boot yields.</p>`},
            {n:29,t:"What are embedded servers and why?",d:["beginner"],a:`<p>Tomcat (default), Jetty, Undertow, or Netty (reactive). Bundled inside the JAR so <code>java -jar app.jar</code> Just Works. Eliminates external server deployment and standardizes packaging.</p>`},
            {n:30,t:"How to switch from Tomcat to Undertow?",d:["intermediate"],a:`<pre>&lt;dependency&gt;
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
&lt;/dependency&gt;</pre>`},
            {n:31,t:"What is Spring Boot Actuator?",d:["intermediate"],a:`<p>Production-ready endpoints for monitoring/management: <code>/health</code>, <code>/info</code>, <code>/metrics</code>, <code>/env</code>, <code>/loggers</code>, <code>/threaddump</code>, <code>/heapdump</code>, etc. Exposed via HTTP or JMX. Secure them in production.</p>`},
            {n:32,t:"How to expose Actuator endpoints?",d:["intermediate"],a:`<pre>management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=when_authorized</pre><p>Default: only <code>/health</code> and <code>/info</code> are public.</p>`},
            {n:33,t:"What's the difference between liveness and readiness probes?",d:["advanced"],a:`<p><strong>Liveness</strong> (<code>/actuator/health/liveness</code>): is the app alive? Failing → restart pod. <strong>Readiness</strong> (<code>/actuator/health/readiness</code>): is the app ready to serve traffic? Failing → remove from load balancer. Boot 2.3+ supports both natively.</p>`},
            {n:34,t:"Custom HealthIndicator?",d:["advanced"],a:`<pre>@Component
class DbHealthIndicator implements HealthIndicator {
  public Health health() {
    try { /* check db */ return Health.up().build(); }
    catch (Exception e) { return Health.down(e).build(); }
  }
}</pre>`},
            {n:35,t:"@Conditional and its variants?",d:["advanced"],a:`<ul><li><code>@ConditionalOnClass</code> / <code>@ConditionalOnMissingClass</code></li><li><code>@ConditionalOnBean</code> / <code>@ConditionalOnMissingBean</code></li><li><code>@ConditionalOnProperty(name=\"x\", havingValue=\"y\")</code></li><li><code>@ConditionalOnExpression(\"#{...}\")</code></li><li><code>@ConditionalOnWebApplication</code> / <code>@ConditionalOnNotWebApplication</code></li></ul><p>Used heavily by auto-configurations.</p>`},
            {n:36,t:"How to write a custom auto-configuration?",d:["expert"],a:`<p>Create <code>@AutoConfiguration</code> class. Add to <code>META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports</code>. Use <code>@Conditional*</code> to gate. Order via <code>@AutoConfigureBefore/After/Order</code>. Package as a starter for sharing.</p>`},
            {n:37,t:"What is Spring Boot DevTools and what does it provide?",d:["beginner"],a:`<p><strong>Spring Boot DevTools</strong> (<code>spring-boot-devtools</code>) is a development-time module that improves the developer experience:</p><ul><li><strong>Automatic restart</strong>: Detects class changes and restarts the app quickly (uses two classloaders — base + restart). Much faster than a full cold restart.</li><li><strong>LiveReload</strong>: Triggers browser refresh on static resource changes via an embedded LiveReload server.</li><li><strong>Relaxed property defaults</strong>: Disables caching (Thymeleaf, FreeMarker) in dev so template changes are reflected immediately.</li><li><strong>H2 console</strong>: Auto-enables the H2 web console when H2 is on the classpath.</li><li><strong>Remote DevTools</strong>: Supports remote update/restart over HTTPS for remote development.</li></ul><p>DevTools is <em>automatically disabled</em> in production (if you run a fat JAR, DevTools is excluded). Add it as a <code>developmentOnly</code> dependency in Gradle or with <code>optional</code> in Maven.</p><pre>&lt;dependency&gt;
  &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
  &lt;artifactId&gt;spring-boot-devtools&lt;/artifactId&gt;
  &lt;optional&gt;true&lt;/optional&gt;
&lt;/dependency&gt;</pre>`},
            {n:38,t:"What is Spring Boot CLI and when would you use it?",d:["beginner"],a:`<p><strong>Spring Boot CLI</strong> (Command Line Interface) is a tool that lets you run Spring applications from the command line using <strong>Groovy scripts</strong> — no Maven/Gradle project setup required. It uses Groovy's concise syntax and Spring's auto-configuration to run apps with minimal boilerplate.</p><pre># Run a Groovy REST controller
spring run app.groovy

# Create a Spring Boot project via Initializr
spring init --dependencies=web,data-jpa myproject</pre><p><strong>Use cases:</strong></p><ul><li><strong>Rapid prototyping</strong>: write a working REST endpoint in a few lines of Groovy</li><li><strong>Quick script automation</strong>: leverage Spring features (DI, JPA) in scripts</li><li><strong>Project generation</strong>: <code>spring init</code> wraps <code>start.spring.io</code> for CLI-based project creation</li><li><strong>Learning</strong>: experiment with Spring features without IDE setup</li></ul><p>In most production workflows, Maven/Gradle is preferred. CLI shines for fast demos and exploration.</p>`}
          ]
        },
        {
          id:"rest", n:3, title:"REST API Fundamentals",
          desc:"<strong>Building HTTP APIs</strong> — annotations, validation, status codes, response handling.",
          questions: [
            {n:37,t:"@Controller vs @RestController?",d:["beginner"],a:`<p><strong>@Controller</strong> + <code>@ResponseBody</code> per method (or returns view names for templates). <strong>@RestController</strong> = <code>@Controller</code> + <code>@ResponseBody</code> implicit on every method. Use @RestController for JSON APIs.</p>`},
            {n:38,t:"@RequestMapping vs @GetMapping etc?",d:["beginner"],a:`<p><code>@GetMapping</code>, <code>@PostMapping</code>, <code>@PutMapping</code>, <code>@DeleteMapping</code>, <code>@PatchMapping</code> are shortcuts for <code>@RequestMapping(method=...)</code>. Prefer the specific ones — they document intent.</p>`},
            {n:39,t:"@PathVariable vs @RequestParam?",d:["beginner"],a:`<p><code>@PathVariable</code>: extracts URI segments — <code>/users/{id}</code>. <code>@RequestParam</code>: query string params — <code>?page=1&size=10</code>. Path for required identifiers; param for filters/options.</p>`},
            {n:40,t:"@RequestBody vs @ModelAttribute?",d:["intermediate"],a:`<p><strong>@RequestBody</strong>: parses request body (typically JSON) via HttpMessageConverter. <strong>@ModelAttribute</strong>: binds form/query data to an object via field-by-field setters. Use @RequestBody for JSON APIs.</p>`},
            {n:41,t:"ResponseEntity — when to use?",d:["beginner"],a:`<p>When you need full control: status code, headers, body. <code>return ResponseEntity.status(201).header(\"Location\", url).body(dto);</code> Otherwise return the body directly + <code>@ResponseStatus(HttpStatus.CREATED)</code>.</p>`},
            {n:42,t:"What HTTP status codes should you return when?",d:["intermediate"],a:`<ul><li><strong>200 OK</strong>: success with body</li><li><strong>201 Created</strong>: resource created — include Location header</li><li><strong>204 No Content</strong>: success, no body (e.g. DELETE)</li><li><strong>400 Bad Request</strong>: invalid input</li><li><strong>401 Unauthorized</strong>: not authenticated</li><li><strong>403 Forbidden</strong>: authenticated but not allowed</li><li><strong>404 Not Found</strong></li><li><strong>409 Conflict</strong>: state conflict (e.g. duplicate)</li><li><strong>422 Unprocessable Entity</strong>: validation failed</li><li><strong>429 Too Many Requests</strong>: rate-limited</li><li><strong>500 Internal Server Error</strong></li><li><strong>503 Service Unavailable</strong>: temporary outage</li></ul>`},
            {n:43,t:"How to do API versioning?",d:["intermediate"],a:`<ul><li><strong>URI</strong>: <code>/api/v1/users</code> (most common, simple)</li><li><strong>Header</strong>: <code>Accept: application/vnd.app.v2+json</code> (cleaner URLs)</li><li><strong>Query param</strong>: <code>?version=2</code> (avoid)</li><li><strong>Subdomain</strong>: <code>v2.api.example.com</code></li></ul><p>Default to URI versioning unless you have a reason not to.</p>`},
            {n:44,t:"Filter vs HandlerInterceptor vs ControllerAdvice — when each?",d:["advanced"],a:`<ul><li><strong>Filter</strong>: servlet-level, runs before/after DispatcherServlet. Use for: CORS, encoding, request logging, auth.</li><li><strong>HandlerInterceptor</strong>: Spring MVC level, runs around handler. Has access to handler info.</li><li><strong>ControllerAdvice</strong>: cross-cutting controller behavior — exception handlers, model attributes, request body advice.</li></ul>`},
            {n:45,t:"Content negotiation — how does Spring decide JSON vs XML?",d:["advanced"],a:`<p>Order: 1) Path extension <code>.json</code>/<code>.xml</code> (deprecated, off by default in Boot 2.7+), 2) <code>Accept</code> header, 3) <code>?format=json</code> param if enabled. Configure via <code>WebMvcConfigurer.configureContentNegotiation()</code>.</p>`},
            {n:46,t:"How to serve static content in Spring Boot?",d:["beginner"],a:`<p>Drop files in <code>src/main/resources/static/</code>, <code>/public/</code>, <code>/resources/</code>, or <code>/META-INF/resources/</code>. Boot serves them at root URL automatically.</p>`},
            {n:47,t:"How to handle file upload?",d:["intermediate"],a:`<pre>@PostMapping("/upload")
public String upload(@RequestParam MultipartFile file) {
  String name = file.getOriginalFilename();
  byte[] bytes = file.getBytes();
  // save bytes to storage
  return "ok";
}</pre><p>Configure <code>spring.servlet.multipart.max-file-size</code>, <code>max-request-size</code>.</p>`},
            {n:48,t:"@RequestHeader and how to inspect headers?",d:["beginner"],a:`<pre>@GetMapping("/test")
public String test(
    @RequestHeader("X-API-Key") String key,
    @RequestHeader Map&lt;String,String&gt; allHeaders) { ... }</pre>`},
            {n:49,t:"How does Spring serialize an entity to JSON?",d:["intermediate"],a:`<p>Via <strong>Jackson</strong> (auto-configured). Reflectively reads getter methods, applies <code>@JsonProperty</code>/<code>@JsonIgnore</code> annotations, and writes JSON. Customize with <code>ObjectMapper</code> bean or <code>spring.jackson.*</code> properties.</p>`},
            {n:50,t:"What is HATEOAS?",d:["advanced"],a:`<p>Hypermedia As The Engine Of Application State — REST principle that responses include links to related actions. Spring HATEOAS provides <code>EntityModel</code>, <code>RepresentationModelAssembler</code> to build HAL responses. Rare in practice but a strict-REST hallmark.</p>`},
            {n:51,t:"How to support pagination in REST?",d:["intermediate"],a:`<pre>@GetMapping("/users")
Page&lt;UserDto&gt; list(Pageable pageable) {  // ?page=0&size=20&sort=name,asc
  return repo.findAll(pageable).map(this::toDto);
}</pre><p>Spring Data wires <code>Pageable</code> from query params automatically.</p>`},
            {n:52,t:"GET vs POST for read operations — when use POST?",d:["intermediate"],a:`<p>POST when: query/filter is too large for URL, contains sensitive data, or is structurally complex (deeply nested filter). Otherwise prefer GET — cacheable, idempotent, bookmarkable.</p>`},
            {n:53,t:"Idempotency — what and how?",d:["advanced"],a:`<p>Same request multiple times has same effect. <strong>GET, PUT, DELETE</strong>: idempotent. <strong>POST</strong>: not. Make POSTs idempotent with an <strong>Idempotency-Key</strong> header — server stores key→result mapping, returns cached result on retry.</p>`},
            {n:54,t:"How to handle long-running requests?",d:["expert"],a:`<p>Don't block. Patterns: 1) <strong>Async response</strong> with <code>DeferredResult</code> or <code>CompletableFuture</code>. 2) <strong>202 Accepted</strong> + status URL — client polls. 3) <strong>Webhook</strong>: client provides callback URL. 4) <strong>SSE/WebSocket</strong> for streaming.</p>`}
          ]
        },
        {
          id:"java-context", n:4, title:"Java Concepts in Spring Context",
          desc:"<strong>Boxing, ArrayList vs LinkedList, SOLID</strong> — Java essentials interviewers test against your Spring code.",
          questions: [
            {n:55,t:"Boxing & unboxing — how does it work?",d:["beginner","intermediate"],a:`<p><strong>Boxing</strong>: primitive → wrapper object (<code>int → Integer.valueOf(x)</code>). <strong>Unboxing</strong>: wrapper → primitive (<code>.intValue()</code>). Done implicitly by compiler when types are mixed: <code>List&lt;Integer&gt; xs; xs.add(5);</code> // boxes 5.</p><p><strong>Cost</strong>: object allocation + indirection. Hot loops should use primitives or <code>IntStream</code>.</p>`},
            {n:56,t:"Hidden cost of boxing in Spring apps?",d:["advanced"],a:`<p>Common offenders: 1) JPA returns <code>List&lt;Long&gt;</code> instead of <code>long[]</code>. 2) Collectors.summingInt vs reducing with autoboxed Integer. 3) Map&lt;Integer,Integer&gt; counters — use <code>HashMap.merge(k, 1, Integer::sum)</code>. 4) Repositories returning Optional&lt;Integer&gt; for counts.</p>`},
            {n:57,t:"ArrayList vs LinkedList — internals and choice?",d:["intermediate"],a:`<table><tr><th></th><th>ArrayList</th><th>LinkedList</th></tr><tr><td>Backing</td><td>Object[]</td><td>Doubly-linked nodes</td></tr><tr><td>get(i)</td><td>O(1)</td><td>O(n)</td></tr><tr><td>add(end)</td><td>O(1) amortized</td><td>O(1)</td></tr><tr><td>add(0)</td><td>O(n) — shift</td><td>O(1)</td></tr><tr><td>Cache locality</td><td>Excellent</td><td>Poor (pointer chase)</td></tr><tr><td>Memory</td><td>Compact</td><td>~2x (next/prev pointers)</td></tr></table><p><strong>In practice ArrayList wins almost always</strong> — modern CPUs love sequential memory. LinkedList only when you need Deque ops at both ends (use ArrayDeque instead).</p>`},
            {n:58,t:"How does ArrayList grow?",d:["intermediate"],a:`<p>Default capacity 10. When full, new array allocated with <code>oldCapacity + (oldCapacity &gt;&gt; 1)</code> = 1.5×. Old elements copied via <code>Arrays.copyOf</code>. Pre-size if you know the count: <code>new ArrayList&lt;&gt;(expectedSize)</code>.</p>`},
            {n:59,t:"Why is HashMap default capacity 16, load factor 0.75?",d:["advanced"],a:`<p>16: power-of-2 enables fast modulo via bitmask <code>hash & (size-1)</code>. Load factor 0.75: empirical balance — lower wastes memory, higher increases collisions. Resize when <code>size &gt; capacity × loadFactor</code>; doubles capacity.</p>`},
            {n:60,t:"Explain SOLID with Spring examples.",d:["intermediate","advanced"],a:`<ul><li><strong>S</strong>ingle Responsibility: each <code>@Service</code> does one thing. <code>UserRegistrationService</code> ≠ <code>UserSearchService</code>.</li><li><strong>O</strong>pen/Closed: extend behavior by adding new <code>@Component</code>s implementing an interface (e.g., <code>PaymentProcessor</code>) — don't modify existing.</li><li><strong>L</strong>iskov: subclasses must not break parent's contract. A <code>RetryableHttpClient extends HttpClient</code> must still behave like an HttpClient.</li><li><strong>I</strong>nterface Segregation: many small interfaces. Split <code>UserRepository</code> from <code>UserAuditRepository</code>.</li><li><strong>D</strong>ependency Inversion: depend on interfaces (<code>NotificationSender</code>), inject concrete impls (<code>EmailNotificationSender</code>).</li></ul>`},
            {n:61,t:"How does the JVM optimize boxing?",d:["expert"],a:`<p>Integer cache for [-128, 127] (default). <code>-XX:AutoBoxCacheMax=N</code> extends. Escape analysis can eliminate boxing in some cases (scalar replacement) — JIT-only. Don't rely on it; write primitive code where it counts.</p>`},
            {n:62,t:"Why prefer immutable collections in service APIs?",d:["intermediate"],a:`<p>Defensive: callers can't mutate your internal state. Easier to reason about concurrency. <code>List.copyOf(list)</code>, <code>Map.copyOf(map)</code>, or <code>Collections.unmodifiableList(...)</code>. Java 16+ <code>stream.toList()</code> returns unmodifiable.</p>`},
            {n:63,t:"What does final mean for a method parameter?",d:["beginner","intermediate"],a:`<p>Cannot reassign within the method. Doesn't make the object immutable — only the binding. Useful in lambdas (must capture effectively final). Doesn't change bytecode but signals intent.</p>`},
            {n:64,t:"What's a record and when use it in Spring?",d:["intermediate"],a:`<p>Java 16+ immutable data class with auto-generated equals/hashCode/toString/accessors. Great for: <strong>DTOs</strong>, <strong>API request/response shapes</strong>, value objects. <code>public record UserDto(Long id, String name) {}</code></p>`},
            {n:65,t:"What is escape analysis in JVM?",d:["expert"],a:`<p>JIT optimization that detects when an object doesn't "escape" its method — then it can be allocated on the stack (or scalar-replaced into registers/locals). Eliminates GC pressure for short-lived objects. Works best with simple POJOs.</p>`},
            {n:66,t:"Common Java collection mistake in REST controllers?",d:["intermediate"],a:`<p>Returning a Map field directly: callers can mutate. Returning Collection<? extends T>: confusing for serialization. Returning unbounded lists: pagination needed for production. Returning entities: leaks JPA proxies — use DTOs.</p>`}
          ]
        }
      ]
    },
    {
      label: "PART 2 · INTERMEDIATE",
      sections: [
        {
          id:"exceptions", n:5, title:"Exception Handling",
          desc:"<strong>@ExceptionHandler, @ControllerAdvice, custom exceptions, finally without catch</strong> — patterns for clean error handling.",
          questions: [
            {n:67,t:"How do you handle exceptions globally in Spring Boot?",d:["beginner","intermediate"],a:`<pre>@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(EntityNotFoundException.class)
  public ResponseEntity&lt;ApiError&gt; notFound(EntityNotFoundException e) {
    return ResponseEntity.status(404).body(new ApiError(e.getMessage()));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity&lt;ApiError&gt; badRequest(MethodArgumentNotValidException e) {
    return ResponseEntity.badRequest().body(new ApiError("validation failed"));
  }
}</pre>`},
            {n:68,t:"@ControllerAdvice vs @RestControllerAdvice?",d:["intermediate"],a:`<p>@RestControllerAdvice = @ControllerAdvice + @ResponseBody. Use it for REST APIs so handler return values are serialized to JSON automatically.</p>`},
            {n:69,t:"How to create a custom exception?",d:["beginner"],a:`<pre>public class ResourceNotFoundException extends RuntimeException {
  public ResourceNotFoundException(String msg) { super(msg); }
}

@ResponseStatus(HttpStatus.NOT_FOUND)  // map to 404 automatically
public class ResourceNotFoundException extends RuntimeException { ... }</pre><p>Inherit from <code>RuntimeException</code> (unchecked) — checked exceptions don't trigger transaction rollback by default.</p>`},
            {n:70,t:"Try/catch with finally — semantics?",d:["beginner"],a:`<p>Finally runs <strong>always</strong> — after try, after catch, even if try/catch returns or throws. Exceptions: <code>System.exit()</code>, JVM crash, infinite loop in try.</p>`},
            {n:71,t:"Can you have try without catch?",d:["intermediate","tricky"],a:`<p><strong>Yes</strong> — <code>try {...} finally {...}</code> is valid (no catch). Useful for cleanup that must run regardless of caller's exception handling. Even better: <strong>try-with-resources</strong>.</p><pre>try (FileReader r = new FileReader(f)) {
  // use r — auto-closed
}  // no catch needed</pre>`},
            {n:72,t:"Try-with-resources — how does it work?",d:["intermediate"],a:`<p>Resources declared in try parens are <code>AutoCloseable</code>. Compiler generates a hidden finally that calls <code>close()</code>. Multiple resources: closed in <strong>reverse</strong> declaration order. Exceptions during close are <em>suppressed</em> if another exception is propagating — accessible via <code>getSuppressed()</code>.</p>`},
            {n:73,t:"return inside try with finally — what value?",d:["tricky"],a:`<pre>try { return 1; } finally { return 2; }   // returns 2 — finally overrides
try { return 1; } finally { x++; }        // returns 1 — value frozen before finally</pre>`},
            {n:74,t:"Should you catch RuntimeException?",d:["intermediate"],a:`<p>Generally no — catch <em>specific</em> unchecked exceptions you can handle (e.g., <code>NumberFormatException</code> when parsing user input). Broad <code>catch (RuntimeException e)</code> hides bugs. Let global <code>@ControllerAdvice</code> handle unexpected RE → 500.</p>`},
            {n:75,t:"How does @Transactional handle exceptions?",d:["advanced"],a:`<p>Default: rolls back on <strong>RuntimeException</strong> and <strong>Error</strong>; <strong>commits</strong> on checked exceptions. Override: <code>@Transactional(rollbackFor = Exception.class)</code> or <code>noRollbackFor = MyEx.class</code>.</p>`},
            {n:76,t:"@ResponseStatus on exception?",d:["intermediate"],a:`<pre>@ResponseStatus(HttpStatus.NOT_FOUND)
public class UserNotFoundException extends RuntimeException { ... }</pre><p>If unhandled, Spring returns the configured status. Doesn't preempt @ExceptionHandler.</p>`},
            {n:77,t:"How to return a structured error response?",d:["intermediate"],a:`<pre>public record ApiError(
    OffsetDateTime timestamp,
    int status,
    String error,
    String message,
    String path,
    List&lt;String&gt; details
) {}

@ExceptionHandler(MethodArgumentNotValidException.class)
ResponseEntity&lt;ApiError&gt; handle(MethodArgumentNotValidException e, HttpServletRequest req) {
  List&lt;String&gt; details = e.getBindingResult().getFieldErrors().stream()
      .map(f -&gt; f.getField() + ": " + f.getDefaultMessage()).toList();
  ApiError err = new ApiError(now(), 400, "Bad Request", "validation failed",
      req.getRequestURI(), details);
  return ResponseEntity.badRequest().body(err);
}</pre>`},
            {n:78,t:"Suppressed exceptions — example?",d:["advanced","tricky"],a:`<pre>try (Resource r = open()) {
  throw new RuntimeException("primary");
}  // close() throws "secondary"
// Caught: RuntimeException("primary"); secondary added to getSuppressed()</pre>`},
            {n:79,t:"Exception in @Async method — how to handle?",d:["advanced"],a:`<p>Returned <code>void</code>: lost (logged at WARN). Returned <code>Future</code>: thrown when <code>get()</code> is called. Use <code>CompletableFuture.exceptionally(...)</code>. Global handler: <code>AsyncUncaughtExceptionHandler</code> via <code>AsyncConfigurer</code>.</p>`},
            {n:80,t:"Best practice: when to throw vs return Optional?",d:["intermediate"],a:`<p>Throw for <strong>exceptional</strong> conditions (resource not found, validation failure, system error). Return Optional for <strong>expected absence</strong> (item not in cache, optional config). Don't use Optional fields/parameters.</p>`}
          ]
        },
        {
          id:"validation-cors", n:6, title:"Validation & CORS",
          desc:"<strong>Bean validation, custom constraints, CORS</strong> — request hygiene basics.",
          questions: [
            {n:81,t:"How do you validate request bodies?",d:["beginner"],a:`<pre>public record CreateUser(
    @NotBlank @Size(min=2, max=50) String name,
    @Email String email,
    @Min(18) int age
) {}

@PostMapping("/users")
public User create(@Valid @RequestBody CreateUser req) { ... }</pre><p>Add <code>spring-boot-starter-validation</code>. Failed validation → <code>MethodArgumentNotValidException</code>.</p>`},
            {n:82,t:"Common Bean Validation annotations?",d:["beginner"],a:`<ul><li><code>@NotNull</code>, <code>@NotBlank</code> (string), <code>@NotEmpty</code> (collection)</li><li><code>@Size(min, max)</code></li><li><code>@Min</code>, <code>@Max</code>, <code>@Positive</code>, <code>@Negative</code></li><li><code>@Email</code>, <code>@Pattern(regexp=...)</code></li><li><code>@Past</code>, <code>@Future</code></li><li><code>@Valid</code> for nested object validation</li></ul>`},
            {n:83,t:"How to create a custom validation?",d:["intermediate"],a:`<pre>@Target(FIELD) @Retention(RUNTIME)
@Constraint(validatedBy = StrongPasswordValidator.class)
public @interface StrongPassword {
  String message() default "weak password";
  Class&lt;?&gt;[] groups() default {};
  Class&lt;? extends Payload&gt;[] payload() default {};
}

public class StrongPasswordValidator
    implements ConstraintValidator&lt;StrongPassword, String&gt; {
  public boolean isValid(String v, ConstraintValidatorContext ctx) {
    return v != null &amp;&amp; v.length() &gt;= 8 &amp;&amp; v.matches(".*\\\\d.*");
  }
}</pre>`},
            {n:84,t:"Validate path/query parameters?",d:["intermediate"],a:`<pre>@Validated  // class-level
@RestController
public class UserController {
  @GetMapping("/users/{id}")
  public User get(@PathVariable @Min(1) Long id) { ... }
}</pre><p>Without <code>@Validated</code> on class, parameter constraints are ignored.</p>`},
            {n:85,t:"What is CORS?",d:["beginner","intermediate"],a:`<p><strong>Cross-Origin Resource Sharing</strong>: browser security mechanism. By default, JS can't call <code>api.example.com</code> from <code>app.example.com</code>. Server must send <code>Access-Control-Allow-Origin</code> response header to permit it.</p>`},
            {n:86,t:"What is a preflight request?",d:["intermediate"],a:`<p>Browser sends an <strong>OPTIONS</strong> request before "non-simple" cross-origin requests (custom headers, methods like PUT/DELETE, etc.). Server must respond with allowed origin/methods/headers; only then does the browser send the real request.</p>`},
            {n:87,t:"How to enable CORS in Spring Boot?",d:["beginner","intermediate"],a:`<pre>// Per controller
@CrossOrigin(origins = "https://myapp.com")
@RestController
public class UserController { ... }

// Global
@Configuration
class CorsConfig implements WebMvcConfigurer {
  public void addCorsMappings(CorsRegistry r) {
    r.addMapping("/api/**")
        .allowedOrigins("https://myapp.com")
        .allowedMethods("GET", "POST", "PUT", "DELETE")
        .allowedHeaders("*")
        .allowCredentials(true)
        .maxAge(3600);
  }
}</pre>`},
            {n:88,t:"CORS with Spring Security — the gotcha?",d:["advanced"],a:`<p>Security filter chain runs <em>before</em> CORS handling — preflight may be rejected as unauthorized (401). Fix: enable CORS in security config:</p><pre>http.cors(Customizer.withDefaults());
http.authorizeHttpRequests(a -&gt; a
    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
    .anyRequest().authenticated());</pre>`},
            {n:89,t:"allowCredentials with allowedOrigins(\"*\") — issue?",d:["advanced","tricky"],a:`<p>Browser <strong>rejects</strong>. CORS spec forbids credentials (cookies, auth) when allowed-origin is wildcard. Use specific origins or <code>allowedOriginPatterns</code> (Spring 5.3+) for matching.</p>`},
            {n:90,t:"Validation groups — what and why?",d:["advanced"],a:`<pre>interface OnCreate {} interface OnUpdate {}

public record User(
    @NotNull(groups = OnUpdate.class) Long id,
    @NotBlank String name
) {}

@PostMapping public User create(@Validated(OnCreate.class) @RequestBody User u) { ... }
@PutMapping  public User update(@Validated(OnUpdate.class) @RequestBody User u) { ... }</pre><p>Different validation rules for create vs update without separate DTOs.</p>`},
            {n:91,t:"Validate at service layer (not just controller)?",d:["advanced"],a:`<pre>@Service
@Validated   // enables param constraints
public class UserService {
  public User create(@Valid CreateUser req) { ... }
  public User get(@Min(1) Long id) { ... }
}</pre><p>Throws <code>ConstraintViolationException</code> on failure.</p>`}
          ]
        },
        {
          id:"config-profiles", n:7, title:"Profiles & Configuration",
          desc:"<strong>Externalized config, profiles, property override</strong> — environment-specific behavior without rebuilding.",
          questions: [
            {n:92,t:"All ways to externalize config?",d:["intermediate"],a:`<ul><li>application.properties / application.yml</li><li>Profile-specific: application-{profile}.yml</li><li>Command line: <code>--server.port=8081</code></li><li>Env vars: <code>SERVER_PORT=8081</code></li><li>JVM: <code>-Dserver.port=8081</code></li><li>External file: <code>--spring.config.location=file:/etc/app/</code></li><li>@PropertySource on @Configuration</li><li>Vault, Config Server (Spring Cloud)</li></ul>`},
            {n:93,t:"How does Spring Boot map env var APP_DB_URL to config?",d:["intermediate"],a:`<p><strong>Relaxed binding</strong>: <code>APP_DB_URL</code> matches <code>app.db.url</code>, <code>app.db-url</code>, <code>app.dbUrl</code>. Underscores → dots, kebab/camel/snake all OK. Useful for env-friendly secrets in Kubernetes.</p>`},
            {n:94,t:"Profile-specific YAML in one file?",d:["intermediate"],a:`<pre>spring:
  application:
    name: my-app
---
spring:
  config:
    activate:
      on-profile: dev
server:
  port: 8080
---
spring:
  config:
    activate:
      on-profile: prod
server:
  port: 80</pre>`},
            {n:95,t:"What is a default profile?",d:["intermediate"],a:`<p>If no profile is active, <code>default</code> profile applies. Customize with <code>spring.profiles.default=dev</code>. Beans annotated <code>@Profile(\"default\")</code> only load then.</p>`},
            {n:96,t:"How to bind nested config to a class?",d:["intermediate"],a:`<pre>@ConfigurationProperties(prefix = "app")
public record AppConfig(
    String name,
    Database database,
    List&lt;String&gt; admins
) {
  public record Database(String url, String username, String password) {}
}

@SpringBootApplication
@ConfigurationPropertiesScan
public class App { ... }</pre><pre>app:
  name: my-app
  database:
    url: jdbc:...
    username: user
  admins: [a@x.com, b@x.com]</pre>`},
            {n:97,t:"@Value vs @ConfigurationProperties — which to choose?",d:["intermediate"],a:`<p>@Value: ad-hoc single property, supports SpEL (<code>#{...}</code>). @ConfigurationProperties: type-safe, IDE-supported, validation, structured. <strong>Prefer @ConfigurationProperties</strong> for non-trivial config.</p>`},
            {n:98,t:"How to validate @ConfigurationProperties?",d:["advanced"],a:`<pre>@ConfigurationProperties("app")
@Validated
public record AppConfig(
    @NotBlank String name,
    @Min(1) int retries
) {}</pre><p>Invalid config → app fails to start with clear error message.</p>`},
            {n:99,t:"How to override config at runtime?",d:["intermediate"],a:`<p>Without restart: not directly. Options: 1) <strong>Spring Cloud Config + @RefreshScope</strong> — refresh endpoint reloads beans. 2) <strong>Actuator /env</strong> POST in dev only. 3) <strong>Externalized DB-backed config</strong> for dynamic flags. For most cases, restart is fine — k8s rolling update.</p>`},
            {n:100,t:"Inject a bean only if a property is set?",d:["advanced"],a:`<pre>@Bean
@ConditionalOnProperty(name = "app.feature.kafka.enabled", havingValue = "true")
KafkaTemplate&lt;String,String&gt; kafkaTemplate() { ... }</pre>`},
            {n:101,t:"How to use SpEL in @Value?",d:["advanced"],a:`<pre>@Value("#{systemEnvironment['HOME']}")
String home;

@Value("#{T(java.time.LocalDate).now()}")
LocalDate today;

@Value("#{ \${app.percent:50} / 100.0 }")
double percent;</pre>`},
            {n:102,t:"Profile combination — AND, OR, NOT?",d:["advanced"],a:`<pre>@Profile("prod")           // active when prod
@Profile("!prod")          // any except prod
@Profile({"dev","test"})   // dev OR test
@Profile("prod & monitoring")  // BOTH (Spring 5.1+)</pre>`},
            {n:103,t:"How to read a property with default?",d:["beginner"],a:`<pre>@Value("\${app.timeout:5000}")  // default 5000 if missing
long timeout;</pre>`},
            {n:104,t:"Encrypted/secret properties — patterns?",d:["expert"],a:`<p>1) <strong>Spring Cloud Vault</strong>: pull secrets from HashiCorp Vault. 2) <strong>K8s Secrets</strong> mounted as env vars. 3) <strong>Jasypt</strong> for encrypted properties. 4) <strong>AWS Secrets Manager</strong> via Spring Cloud AWS. Don't commit plaintext secrets — even in private repos.</p>`},
            {n:105,t:"Config Server — what is it?",d:["expert"],a:`<p>Spring Cloud Config — externalized, versioned, central config (Git-backed) for many microservices. Each service pulls its config at startup. Combined with <code>@RefreshScope</code> + bus events for hot reload.</p>`}
          ]
        },
        {
          id:"jpa", n:8, title:"JPA, Hibernate & Spring Data",
          desc:"<strong>How JPA works internally</strong> — entities, persistence context, lazy loading, N+1, locking, transactions.",
          questions: [
            {n:106,t:"How does JPA work internally? (high level)",d:["intermediate","advanced"],a:`<p>1) <strong>EntityManager</strong> manages a <strong>persistence context</strong> — a 1st-level cache of managed entities. 2) <strong>Entity states</strong>: NEW (transient) → MANAGED (in PC) → DETACHED (PC closed) → REMOVED. 3) <strong>Dirty checking</strong>: at commit, JPA compares entity state to snapshot and issues UPDATE only for changed fields. 4) <strong>Flush</strong>: writes pending SQL — at commit, before query, or on demand. 5) <strong>Hibernate</strong>: most common provider; adds 2nd-level cache, custom dialects, lazy proxies.</p>`},
            {n:107,t:"Difference between save(), persist(), and merge()?",d:["advanced"],a:`<p><strong>persist(e)</strong> (JPA): NEW → MANAGED. Throws if e has an ID set or already exists.<br><strong>merge(e)</strong> (JPA): copies state into a managed entity (or new one). Returns the managed instance — <em>e</em> stays detached.<br><strong>save(e)</strong> (Spring Data): persists if new, merges otherwise. Convenient but loses control.</p>`},
            {n:108,t:"FetchType.LAZY vs EAGER — when?",d:["intermediate"],a:`<p>Default: @ManyToOne EAGER, @OneToMany LAZY. <strong>Always prefer LAZY</strong> for collections — EAGER causes performance disasters. Use <code>JOIN FETCH</code> in JPQL or <code>@EntityGraph</code> when you need related data.</p>`},
            {n:109,t:"What is the N+1 problem?",d:["intermediate","advanced"],a:`<p>Fetching N parents and then issuing 1 query per parent for its children = 1 + N queries. Symptom: slow with large result sets.</p><pre>// 1+N
List&lt;Order&gt; orders = repo.findAll();          // 1 query
orders.forEach(o -&gt; o.getItems().size());     // N queries (lazy load)

// Fix
@Query("select o from Order o left join fetch o.items")
List&lt;Order&gt; findAllWithItems();</pre>`},
            {n:110,t:"How to prevent N+1?",d:["advanced"],a:`<ul><li><code>JOIN FETCH</code> in JPQL</li><li><code>@EntityGraph(attributePaths = {\"items\"})</code> on repository method</li><li><code>@BatchSize(size = 50)</code> on collection</li><li>DTO projection: <code>select new com.app.OrderDto(o.id, o.total) from Order o</code></li><li>Native query joining children</li></ul>`},
            {n:111,t:"Pessimistic vs optimistic locking?",d:["advanced"],a:`<p><strong>Optimistic</strong>: assume no conflict; check at commit via @Version field. Cheap, but commit may fail with <code>OptimisticLockException</code> — caller retries. <strong>Pessimistic</strong>: SELECT...FOR UPDATE locks rows. Prevents concurrent writes but reduces throughput.</p>`},
            {n:112,t:"@Version — how does optimistic locking work?",d:["advanced"],a:`<pre>@Entity
class Account {
  @Id Long id;
  @Version Long version;        // bumped on every update
  BigDecimal balance;
}

// Hibernate adds: WHERE id = ? AND version = ?
// 0 rows updated → OptimisticLockException</pre>`},
            {n:113,t:"How to do pessimistic locking?",d:["advanced"],a:`<pre>@Repository
interface AccountRepo extends JpaRepository&lt;Account, Long&gt; {
  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("select a from Account a where a.id = :id")
  Account findByIdForUpdate(@Param("id") Long id);
}</pre><p>Generates <code>SELECT ... FOR UPDATE</code>. Hold a transaction.</p>`},
            {n:114,t:"@Transactional — propagation levels?",d:["advanced"],a:`<ul><li><strong>REQUIRED</strong> (default): join existing or create new</li><li><strong>REQUIRES_NEW</strong>: always new tx — pause outer if exists</li><li><strong>SUPPORTS</strong>: join if exists, else non-tx</li><li><strong>MANDATORY</strong>: must have existing tx (else throw)</li><li><strong>NESTED</strong>: savepoint within outer tx</li><li><strong>NEVER</strong>: must NOT have tx</li><li><strong>NOT_SUPPORTED</strong>: pause outer, run non-tx</li></ul>`},
            {n:115,t:"Self-invocation problem with @Transactional?",d:["advanced","tricky"],a:`<pre>@Service
class UserService {
  public void method1() { method2(); }   // ❌ method2's @Transactional ignored
  @Transactional public void method2() { ... }
}</pre><p>AOP proxies wrap external calls only. Self-invocation bypasses the proxy. Fix: split into two beans, or inject self via <code>@Lazy</code>.</p>`},
            {n:116,t:"Transaction isolation levels?",d:["advanced"],a:`<ul><li><strong>READ_UNCOMMITTED</strong>: dirty reads possible</li><li><strong>READ_COMMITTED</strong> (most DB default): no dirty reads, but non-repeatable reads</li><li><strong>REPEATABLE_READ</strong>: same query in tx returns same data; phantom reads possible</li><li><strong>SERIALIZABLE</strong>: full isolation, slowest</li></ul>`},
            {n:117,t:"Read-only transaction — what does it do?",d:["advanced"],a:`<p><code>@Transactional(readOnly = true)</code>: 1) Hibernate skips dirty checking (perf gain). 2) Some DBs allow query routing to read replicas. 3) Documents intent. Use for query-only methods.</p>`},
            {n:118,t:"Cascade types?",d:["intermediate"],a:`<ul><li>PERSIST, MERGE, REMOVE, REFRESH, DETACH</li><li>ALL = all of the above</li></ul><p>Use carefully — <code>CascadeType.REMOVE</code> on @ManyToMany can delete shared data.</p>`},
            {n:119,t:"orphanRemoval — what does it do?",d:["advanced"],a:`<pre>@OneToMany(mappedBy = "order", cascade = ALL, orphanRemoval = true)
Set&lt;OrderItem&gt; items;</pre><p>If you remove an item from the collection, JPA issues DELETE for it. Without orphanRemoval, the FK is just nulled.</p>`},
            {n:120,t:"CrudRepository vs JpaRepository?",d:["intermediate"],a:`<p>Hierarchy: <code>Repository</code> &lt; <code>CrudRepository</code> &lt; <code>PagingAndSortingRepository</code> &lt; <code>JpaRepository</code>. JpaRepository adds: <code>findAll(Sort)</code>, <code>flush()</code>, <code>saveAndFlush()</code>, batch ops, <code>getReferenceById()</code> (lazy proxy).</p>`},
            {n:121,t:"Derived query method conventions?",d:["intermediate"],a:`<pre>List&lt;User&gt; findByLastName(String name);
List&lt;User&gt; findByAgeGreaterThanEqualOrderByAgeDesc(int age);
boolean existsByEmail(String email);
long countByStatus(Status s);
List&lt;User&gt; findTop10ByRoleOrderByCreatedAtDesc(String role);
@Modifying
int deleteByDeletedAtBefore(LocalDate cutoff);</pre>`},
            {n:122,t:"@Query — JPQL vs native?",d:["intermediate"],a:`<pre>@Query("select u from User u where u.email = ?1")            // JPQL: refers to entity
@Query(value = "SELECT * FROM users WHERE email = ?1",
       nativeQuery = true)                                     // raw SQL</pre><p>Native: DB-specific, bypasses JPA. Use when JPQL can't express it (window functions, vendor features).</p>`},
            {n:123,t:"@Modifying queries — when needed?",d:["intermediate"],a:`<pre>@Modifying
@Query("update User u set u.active = false where u.lastLogin &lt; :cutoff")
int deactivateOldUsers(@Param("cutoff") LocalDate cutoff);</pre><p>Required for UPDATE/DELETE/INSERT. Returns affected row count. Pair with <code>@Transactional</code>.</p>`},
            {n:124,t:"Pagination with Pageable?",d:["intermediate"],a:`<pre>Page&lt;User&gt; findByRole(String role, Pageable pageable);
// Caller: repo.findByRole("admin", PageRequest.of(0, 20, Sort.by("name")))
// Page → has total count (extra COUNT query)
// Slice → no total count, faster, only knows hasNext()</pre>`},
            {n:125,t:"Hibernate 1st-level vs 2nd-level cache?",d:["expert"],a:`<p><strong>L1</strong>: per-EntityManager (per-transaction). Always on. Same entity returned for same id within session.<br><strong>L2</strong>: shared across sessions, cross-application. Off by default. Configure with EhCache, Hazelcast, Infinispan. Set per-entity with <code>@Cache</code>.</p>`},
            {n:126,t:"@EntityGraph — purpose?",d:["advanced"],a:`<pre>@EntityGraph(attributePaths = {"items", "customer"})
List&lt;Order&gt; findByStatus(String status);</pre><p>Tells JPA which associations to fetch eagerly for THIS query — without changing the entity's default fetch type. Cleaner than <code>JOIN FETCH</code>.</p>`},
            {n:127,t:"DTO projection vs entity loading?",d:["advanced"],a:`<p>DTO projection: only fetches columns you need, no entity overhead. Better perf.</p><pre>@Query("select new com.app.UserSummary(u.id, u.name) from User u where u.active = true")
List&lt;UserSummary&gt; activeSummaries();

// Or interface projection
interface UserSummary { Long getId(); String getName(); }
List&lt;UserSummary&gt; findAllProjectedBy();</pre>`}
          ]
        },
        {
          id:"db", n:9, title:"Database — SQL, NoSQL & Migration",
          desc:"<strong>RDBMS, NoSQL, migrations, locks, batching, soft delete</strong> — production database concerns.",
          questions: [
            {n:128,t:"RDBMS vs NoSQL — when each?",d:["intermediate"],a:`<table><tr><th>RDBMS (Postgres, MySQL)</th><th>NoSQL</th></tr><tr><td>Strong schema</td><td>Flexible / schemaless</td></tr><tr><td>ACID transactions</td><td>BASE / eventual consistency</td></tr><tr><td>Joins, complex queries</td><td>Limited joins</td></tr><tr><td>Vertical scale (mostly)</td><td>Horizontal scale</td></tr><tr><td>Default choice</td><td>Specific use cases</td></tr></table><p>NoSQL families: <strong>Document</strong> (MongoDB), <strong>Key-Value</strong> (Redis), <strong>Wide-Column</strong> (Cassandra), <strong>Search</strong> (Elasticsearch), <strong>Graph</strong> (Neo4j).</p>`},
            {n:129,t:"What is ACID?",d:["intermediate"],a:`<ul><li><strong>Atomicity</strong>: all-or-nothing per transaction</li><li><strong>Consistency</strong>: tx moves DB from valid state to valid state</li><li><strong>Isolation</strong>: concurrent tx don't see each other's intermediates</li><li><strong>Durability</strong>: committed changes survive crash</li></ul>`},
            {n:130,t:"What is BASE?",d:["advanced"],a:`<ul><li><strong>Basically Available</strong></li><li><strong>Soft state</strong></li><li><strong>Eventual consistency</strong></li></ul><p>Trade strict consistency for availability + scale. Common in distributed NoSQL.</p>`},
            {n:131,t:"Postgres features that matter?",d:["intermediate"],a:`<ul><li>JSON/JSONB columns (NoSQL-like flexibility within SQL)</li><li>Arrays, hstore, range types</li><li>Window functions, CTEs, recursive queries</li><li>Full-text search, GIN/GiST indexes</li><li>Partitioning, parallel queries</li><li>MVCC for concurrency without read locks</li><li>Excellent extension ecosystem (PostGIS, TimescaleDB, pgvector)</li></ul>`},
            {n:132,t:"How to use Spring Data MongoDB?",d:["intermediate"],a:`<pre>@Document(collection = "users")
public class User {
  @Id String id;
  String name;
  @Indexed(unique = true) String email;
  List&lt;String&gt; roles;
}

interface UserRepo extends MongoRepository&lt;User, String&gt; {
  Optional&lt;User&gt; findByEmail(String email);
}</pre>`},
            {n:133,t:"DB migration — Flyway vs Liquibase?",d:["intermediate"],a:`<p><strong>Flyway</strong>: SQL-first, simple versioned scripts (<code>V1__init.sql</code>, <code>V2__add_email.sql</code>). Lightweight, popular default.<br><strong>Liquibase</strong>: XML/YAML/JSON/SQL changelogs with rollback metadata, conditional changesets, more enterprise features. Heavier but feature-rich. Both auto-run on Spring Boot startup.</p>`},
            {n:134,t:"How does Flyway work in Spring Boot?",d:["intermediate"],a:`<p>Add <code>flyway-core</code>. Place SQL files in <code>db/migration/</code> on classpath. Naming: <code>V&lt;version&gt;__&lt;description&gt;.sql</code>. Boot auto-applies on startup. Tracks applied migrations in <code>flyway_schema_history</code>.</p>`},
            {n:135,t:"How to handle a column rename safely in production?",d:["expert"],a:`<p><strong>Multi-step migration</strong> (zero-downtime):</p><ol><li>V1: ADD new column, copy data</li><li>Deploy app code that writes to BOTH columns</li><li>V2: backfill any missing rows</li><li>Deploy app code reading from new column only</li><li>V3: DROP old column</li></ol><p>Never rename in one step — old app instances will break during rollout.</p>`},
            {n:136,t:"hibernate.ddl-auto values — which to use?",d:["intermediate"],a:`<ul><li><strong>none</strong>: prod default — let migration tool manage</li><li><strong>validate</strong>: verify schema matches entities at startup, fail otherwise</li><li><strong>update</strong>: best-effort sync — DEV only, never prod</li><li><strong>create</strong>: drop + create at startup</li><li><strong>create-drop</strong>: create at start, drop at stop — tests</li></ul><p><strong>Production: use <code>validate</code> or <code>none</code></strong> — schema changes via migrations.</p>`},
            {n:137,t:"How does Spring Boot configure the DataSource?",d:["intermediate"],a:`<p>Auto-configures <code>HikariDataSource</code> (default) from <code>spring.datasource.*</code> properties. HikariCP is the fastest connection pool. Tune <code>maximum-pool-size</code>, <code>connection-timeout</code>, <code>max-lifetime</code>, <code>idle-timeout</code>.</p>`},
            {n:138,t:"DB row vs table vs page lock?",d:["advanced"],a:`<ul><li><strong>Row lock</strong>: single row — most granular, best concurrency. Postgres MVCC mostly avoids them.</li><li><strong>Page lock</strong>: a DB page (e.g., 8KB). Implementation detail.</li><li><strong>Table lock</strong>: whole table — DDL, some bulk ops. Blocks all DML on it.</li><li><strong>Advisory lock</strong>: app-defined named lock (Postgres). Useful for distributed mutex.</li></ul>`},
            {n:139,t:"Long transaction with many ops — issues + fix?",d:["expert"],a:`<p><strong>Problems</strong>: holds DB locks/connection for long; rollback is expensive; risks deadlock; bloats persistence context (memory).</p><p><strong>Fixes</strong>:</p><ul><li>Split into <strong>chunks</strong> with <code>REQUIRES_NEW</code> per chunk (each commits independently)</li><li>Use <strong>JDBC batch</strong>: <code>spring.jpa.properties.hibernate.jdbc.batch_size=50</code></li><li><strong>Stream</strong> with cursor or pagination instead of loading all rows</li><li>Use a <strong>job framework</strong> (Spring Batch) for big migrations</li><li><code>entityManager.clear()</code> periodically</li></ul>`},
            {n:140,t:"Bulk insert performance tips?",d:["expert"],a:`<pre>spring.jpa.properties.hibernate.jdbc.batch_size=100
spring.jpa.properties.hibernate.order_inserts=true
spring.jpa.properties.hibernate.order_updates=true</pre><p>Use <code>SequenceGenerator(allocationSize=50)</code> to reduce sequence round-trips. For huge datasets, drop to JDBC: <code>jdbcTemplate.batchUpdate(sql, args)</code>.</p>`},
            {n:141,t:"What is connection pool? Why HikariCP?",d:["intermediate"],a:`<p>Pool of pre-opened DB connections — eliminates the cost of opening a new TCP+auth handshake per query. HikariCP: lock-free, lightweight, fastest in benchmarks. Boot's default since 2.x.</p>`},
            {n:142,t:"Soft delete vs hard delete?",d:["intermediate"],a:`<p><strong>Hard delete</strong>: <code>DELETE FROM users WHERE id = ?</code> — gone forever. Simple, frees space.<br><strong>Soft delete</strong>: <code>UPDATE users SET deleted_at = NOW() WHERE id = ?</code> — preserved for audit/recovery, but every read must filter. Use soft delete for users, orders, payments — anything regulators or business may need to inspect.</p>`},
            {n:143,t:"Implement soft delete in JPA?",d:["advanced"],a:`<pre>@Entity
@SQLDelete(sql = "UPDATE users SET deleted_at = NOW() WHERE id = ?")
@Where(clause = "deleted_at IS NULL")
public class User {
  @Id Long id;
  Instant deletedAt;
}</pre><p>Hibernate intercepts <code>repo.delete()</code> with the UPDATE. <code>@Where</code> filters every query. Java 17+ Hibernate 6: use <code>@SQLRestriction</code>.</p>`},
            {n:144,t:"What is MyBatis vs JPA?",d:["intermediate"],a:`<p><strong>MyBatis</strong>: SQL-first, mappers map raw SQL → POJOs. Full SQL control, no ORM magic. Good for complex queries / DBA-driven shops.<br><strong>JPA</strong>: object-first, generates SQL. Productive for CRUD, less control. Use JPA for 80% CRUD; MyBatis or jOOQ for complex reporting.</p>`},
            {n:145,t:"jOOQ vs JPA?",d:["advanced"],a:`<p>jOOQ: type-safe SQL DSL. Code-generates classes from your DB schema. You write SQL-shaped Java; compiler catches errors. Better for complex queries, joins, window functions. Pair with JPA for CRUD; jOOQ for reports/analytics.</p>`},
            {n:146,t:"What's a database deadlock and how to detect/avoid?",d:["expert"],a:`<p>Two transactions wait on each other's locks. DB detects and aborts one (<code>DeadlockLoserDataAccessException</code>). Avoid: 1) acquire locks in <strong>consistent order</strong>. 2) Keep transactions <strong>short</strong>. 3) Use <strong>optimistic locking</strong> for low-contention. 4) Index FK columns. 5) Retry with backoff on deadlock.</p>`}
          ]
        },
        {
          id:"security", n:10, title:"Spring Security",
          desc:"<strong>Authentication, authorization, JWT, OAuth2, 401 vs 403</strong> — secure your APIs.",
          questions: [
            {n:147,t:"Authentication vs Authorization?",d:["beginner"],a:`<p><strong>Authentication</strong> (AuthN): <em>who are you?</em> Verifies identity (username/password, JWT, certificate).<br><strong>Authorization</strong> (AuthZ): <em>what are you allowed to do?</em> Checks permissions (roles, scopes, ACLs). Authn first, then authz.</p>`},
            {n:148,t:"401 Unauthorized vs 403 Forbidden — difference?",d:["beginner","intermediate"],a:`<p><strong>401</strong>: not authenticated (or token invalid/expired). Send valid creds and retry. Server should include <code>WWW-Authenticate</code> header.<br><strong>403</strong>: authenticated but lacks permission. Sending creds again won't help — different account or admin permission needed.</p>`},
            {n:149,t:"Spring Security architecture — high level?",d:["intermediate"],a:`<ol><li><code>SecurityFilterChain</code> — ordered list of filters runs per request</li><li><code>AuthenticationManager</code> ⇒ <code>ProviderManager</code> with multiple <code>AuthenticationProvider</code>s</li><li>Auth providers verify credentials (DB, LDAP, JWT, OAuth2)</li><li>On success: <code>Authentication</code> object stored in <code>SecurityContextHolder</code></li><li>Authorization filters check authorities/roles for the request</li></ol>`},
            {n:150,t:"How to configure Spring Security (Boot 3.x)?",d:["intermediate"],a:`<pre>@Configuration
@EnableWebSecurity
public class SecurityConfig {

  @Bean
  SecurityFilterChain chain(HttpSecurity http) throws Exception {
    http
      .csrf(c -&gt; c.disable())
      .authorizeHttpRequests(a -&gt; a
        .requestMatchers("/public/**", "/auth/**").permitAll()
        .requestMatchers("/admin/**").hasRole("ADMIN")
        .anyRequest().authenticated())
      .oauth2ResourceServer(o -&gt; o.jwt(Customizer.withDefaults()));
    return http.build();
  }

  @Bean
  PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(12);
  }
}</pre>`},
            {n:151,t:"What is UserDetailsService?",d:["intermediate"],a:`<pre>@Service
class DbUserDetailsService implements UserDetailsService {
  public UserDetails loadUserByUsername(String username) {
    User u = userRepo.findByEmail(username)
        .orElseThrow(() -&gt; new UsernameNotFoundException(username));
    return org.springframework.security.core.userdetails.User
        .withUsername(u.getEmail())
        .password(u.getPasswordHash())
        .roles(u.getRoles().toArray(new String[0]))
        .build();
  }
}</pre>`},
            {n:152,t:"BCryptPasswordEncoder — why?",d:["intermediate"],a:`<p>Adaptive hash with built-in salt. Slow by design (parameterized work factor) — defeats brute force. <code>new BCryptPasswordEncoder(12)</code> = ~250ms per hash. Other options: <code>Argon2</code> (modern), <code>PBKDF2</code>, <code>SCrypt</code>. NEVER store plain passwords.</p>`},
            {n:153,t:"JWT-based auth flow?",d:["intermediate","advanced"],a:`<ol><li>Client POSTs <code>/auth/login</code> with creds</li><li>Server verifies, returns signed JWT (header.payload.signature)</li><li>Client stores token (memory / httpOnly cookie)</li><li>Subsequent requests: <code>Authorization: Bearer &lt;token&gt;</code></li><li>Server's JWT filter verifies signature, expiry, claims</li><li>Populates SecurityContext with Authentication</li></ol>`},
            {n:154,t:"Stateless vs session-based auth?",d:["intermediate"],a:`<p><strong>Session</strong>: server stores session ID; cookie carries it. Easy logout (drop session). Doesn't scale across servers without shared store (Redis). Vulnerable to CSRF.<br><strong>Stateless (JWT)</strong>: server stores nothing; token carries claims. Scales horizontally. Logout is harder — need short TTL + refresh tokens or revocation list.</p>`},
            {n:155,t:"Method-level security?",d:["advanced"],a:`<pre>@EnableMethodSecurity
class Config {}

@PreAuthorize("hasRole('ADMIN')")
public void deleteUser(Long id) { ... }

@PreAuthorize("#userId == authentication.principal.id or hasRole('ADMIN')")
public User getUser(Long userId) { ... }

@PostAuthorize("returnObject.owner == authentication.name")
public Document fetch(Long id) { ... }</pre>`},
            {n:156,t:"@PreAuthorize vs @Secured vs @RolesAllowed?",d:["advanced"],a:`<p>@PreAuthorize: SpEL expressions, most powerful. @Secured: simple roles list, Spring-specific. @RolesAllowed: same but JSR-250 standard. <strong>Prefer @PreAuthorize</strong>.</p>`},
            {n:157,t:"AuthenticationEntryPoint vs AccessDeniedHandler?",d:["advanced"],a:`<p>EntryPoint: triggered on <strong>auth failure</strong> (401) — typically returns "please log in" or 401 JSON.<br>AccessDeniedHandler: triggered on <strong>authz failure</strong> (403) — user is logged in but lacks permission.</p>`},
            {n:158,t:"How to customize the login response?",d:["advanced"],a:`<pre>http.formLogin(form -&gt; form
  .loginProcessingUrl("/api/auth/login")
  .successHandler((req, res, auth) -&gt; {
    res.setStatus(200);
    res.getWriter().write("{\\"user\\":\\"" + auth.getName() + "\\"}");
  })
  .failureHandler((req, res, ex) -&gt; {
    res.setStatus(401);
    res.getWriter().write("{\\"error\\":\\"" + ex.getMessage() + "\\"}");
  }));</pre>`},
            {n:159,t:"OAuth2 / OIDC — what's the difference?",d:["advanced"],a:`<p><strong>OAuth2</strong>: authorization framework — issues access tokens for resource access. Doesn't define identity.<br><strong>OIDC</strong> (OpenID Connect): identity layer ON TOP of OAuth2 — adds <code>id_token</code>, <code>userinfo</code> endpoint. Most "Sign in with Google" flows use OIDC.</p>`},
            {n:160,t:"Spring Security as OAuth2 resource server?",d:["advanced"],a:`<pre>spring.security.oauth2.resourceserver.jwt.issuer-uri=https://my-idp.com</pre><pre>http.oauth2ResourceServer(o -&gt; o.jwt(j -&gt; j
    .jwtAuthenticationConverter(myAuthConverter)));</pre><p>Spring auto-fetches the JWKS, validates JWTs on every request.</p>`},
            {n:161,t:"CSRF — what is it and how does Spring handle it?",d:["advanced"],a:`<p><strong>Cross-Site Request Forgery</strong>: malicious site causes user's browser to send authenticated request to your site (cookie auto-included).<br><strong>Defense</strong>: Spring inserts a CSRF token (cookie + header). Stateful APIs (cookie-based auth): keep CSRF on. Stateless JWT in Authorization header: disable CSRF — JWT isn't auto-sent by browser.</p>`},
            {n:162,t:"How to handle authentication failure with proper error code?",d:["advanced"],a:`<pre>@RestControllerAdvice
class SecurityExceptionHandler {

  @ExceptionHandler(BadCredentialsException.class)
  ResponseEntity&lt;ApiError&gt; bad(BadCredentialsException e) {
    return ResponseEntity.status(401)
        .body(new ApiError("INVALID_CREDENTIALS", "Email or password incorrect"));
  }

  @ExceptionHandler(DisabledException.class)
  ResponseEntity&lt;ApiError&gt; disabled(DisabledException e) {
    return ResponseEntity.status(403)
        .body(new ApiError("ACCOUNT_DISABLED", "Account has been disabled"));
  }

  @ExceptionHandler(AccessDeniedException.class)
  ResponseEntity&lt;ApiError&gt; denied(AccessDeniedException e) {
    return ResponseEntity.status(403)
        .body(new ApiError("FORBIDDEN", "Insufficient privileges"));
  }
}</pre>`},
            {n:163,t:"How to securely store JWT in browser?",d:["expert"],a:`<p><strong>Worst</strong>: localStorage — XSS can read it.<br><strong>Better</strong>: httpOnly + Secure + SameSite=strict cookie. JS can't access; CSRF protected by SameSite. Use refresh tokens with rotation. Short access-token TTL (5–15 min).</p>`},
            {n:164,t:"What are the default credentials when Spring Security is enabled?",d:["beginner"],a:`<p>When you add <code>spring-boot-starter-security</code> without any custom configuration, Spring Boot auto-configures <strong>HTTP Basic authentication</strong> with:</p><ul><li><strong>Username</strong>: <code>user</code></li><li><strong>Password</strong>: a randomly generated UUID printed in the console on startup:<br><code>Using generated security password: 8e557245-73e2-4286-969a-ff57fe326336</code></li></ul><p>To override the defaults, set properties:</p><pre>spring.security.user.name=admin
spring.security.user.password=secret
spring.security.user.roles=ADMIN</pre><p>In production, always replace the default with a proper <code>UserDetailsService</code> backed by a database or LDAP — never rely on the generated password.</p>`},
            {n:165,t:"How to configure a custom login page in Spring Security?",d:["intermediate"],a:`<p>Override the default login page by configuring <code>formLogin</code> in your <code>SecurityFilterChain</code>:</p><pre>@Bean
SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/login", "/css/**").permitAll()
            .anyRequest().authenticated()
        )
        .formLogin(form -> form
            .loginPage("/login")              // your custom page URL
            .loginProcessingUrl("/login")      // POST target
            .defaultSuccessUrl("/dashboard")   // redirect after success
            .failureUrl("/login?error=true")   // redirect on failure
            .usernameParameter("email")        // custom field name
            .passwordParameter("pwd")
            .permitAll()
        )
        .logout(logout -> logout
            .logoutUrl("/logout")
            .logoutSuccessUrl("/login?logout")
        );
    return http.build();
}</pre><p>Your controller must serve <code>GET /login</code>, and the Thymeleaf (or other) template must POST to <code>/login</code> with <code>username</code>/<code>password</code> fields (or whatever names you configured). Spring Security handles the authentication — you never need to implement the POST handler yourself.</p>`}
          ]
        }
      ]
    },
    {
      label: "PART 3 · ADVANCED",
      sections: [
        {
          id:"caching", n:11, title:"Caching",
          desc:"<strong>Spring Cache abstraction, TTL, custom keys, multiple cache configs, distributed caching</strong>.",
          questions: [
            {n:164,t:"Spring Cache abstraction — basics?",d:["beginner","intermediate"],a:`<pre>@EnableCaching
@SpringBootApplication
class App { ... }

@Service
public class UserService {

  @Cacheable("users")            // cache by method args
  public User get(Long id) { ... }

  @CachePut("users")             // always run, update cache
  public User update(User u) { ... }

  @CacheEvict("users")           // invalidate
  public void delete(Long id) { ... }

  @CacheEvict(value = "users", allEntries = true)
  public void deleteAll() { ... }
}</pre>`},
            {n:165,t:"How does Spring's cache abstraction find a CacheManager?",d:["intermediate"],a:`<p>Auto-configured based on classpath: <code>Caffeine</code> &gt; <code>Redis</code> &gt; <code>EhCache</code> &gt; <code>JCache</code> &gt; concurrent-map (fallback). Override by defining your own <code>@Bean CacheManager</code>.</p>`},
            {n:166,t:"Caffeine vs Redis as cache?",d:["intermediate"],a:`<p><strong>Caffeine</strong>: in-memory, single-JVM. Microsecond access, no network. Best for hot reads, small data, single-instance apps.<br><strong>Redis</strong>: network cache, shared across instances. Larger capacity. Network round-trip cost. Required for multi-instance apps where cache consistency matters.</p>`},
            {n:167,t:"How to configure TTL?",d:["intermediate"],a:`<pre># Caffeine
spring.cache.cache-names=users,products
spring.cache.caffeine.spec=maximumSize=500,expireAfterWrite=10m

# Redis
spring.cache.redis.time-to-live=10m
spring.cache.redis.cache-null-values=false</pre>`},
            {n:168,t:"Per-cache custom configuration (cache vector)?",d:["advanced","expert"],a:`<p>Different TTL/size per cache name:</p><pre>@Bean
CacheManager cacheManager(RedisConnectionFactory cf) {
  RedisCacheConfiguration defaults = RedisCacheConfiguration.defaultCacheConfig()
      .entryTtl(Duration.ofMinutes(10));

  Map&lt;String, RedisCacheConfiguration&gt; configs = Map.of(
      "users",     defaults.entryTtl(Duration.ofMinutes(30)),
      "products",  defaults.entryTtl(Duration.ofHours(1)),
      "feature-flags", defaults.entryTtl(Duration.ofSeconds(30))
  );

  return RedisCacheManager.builder(cf)
      .cacheDefaults(defaults)
      .withInitialCacheConfigurations(configs)
      .build();
}</pre>`},
            {n:169,t:"Custom cache key — SpEL?",d:["advanced"],a:`<pre>@Cacheable(value = "users", key = "#id")
public User get(Long id) { ... }

// Composite key
@Cacheable(value = "byTenant", key = "#tenantId + ':' + #userId")
public User get(String tenantId, Long userId) { ... }

// SpEL on argument fields
@Cacheable(value = "report", key = "#req.from + '_' + #req.to")
public Report build(ReportRequest req) { ... }</pre>`},
            {n:170,t:"Custom KeyGenerator?",d:["expert"],a:`<pre>@Component("tenantKeyGen")
public class TenantKeyGenerator implements KeyGenerator {
  public Object generate(Object target, Method m, Object... params) {
    return TenantContext.current() + ":" + Arrays.deepHashCode(params);
  }
}

@Cacheable(value = "users", keyGenerator = "tenantKeyGen")
public User get(Long id) { ... }</pre>`},
            {n:171,t:"@Cacheable with condition / unless?",d:["advanced"],a:`<pre>@Cacheable(value = "users", condition = "#id != null", unless = "#result == null")
public User get(Long id) { ... }</pre><p><strong>condition</strong>: skip cache if false. <strong>unless</strong>: skip storing result if true. Use unless to avoid caching nulls/empty results.</p>`},
            {n:172,t:"Cache stampede — what and how to prevent?",d:["expert"],a:`<p>Cache miss for hot key under high concurrency → many threads hit DB simultaneously to recompute.</p><p><strong>Mitigations</strong>: 1) Caffeine's <code>LoadingCache</code> — single-flight per key. 2) Redis lock (SET NX) for "cache leader". 3) Probabilistic early refresh. 4) sync = true on @Cacheable: <code>@Cacheable(value=\"users\", sync=true)</code>.</p>`},
            {n:173,t:"Cache aside vs write-through vs write-behind?",d:["expert"],a:`<ul><li><strong>Cache-aside</strong>: app reads cache, on miss reads DB and populates cache (most common; @Cacheable does this).</li><li><strong>Write-through</strong>: app writes to cache, cache writes to DB synchronously.</li><li><strong>Write-behind</strong>: app writes to cache; DB write is async (risk: data loss on crash).</li></ul>`},
            {n:174,t:"Cache eviction policies?",d:["intermediate"],a:`<ul><li><strong>LRU</strong> (Least Recently Used) — most common</li><li><strong>LFU</strong> (Least Frequently Used) — Caffeine's W-TinyLFU is the modern variant</li><li><strong>FIFO</strong></li><li><strong>TTL-based</strong> — time only</li><li><strong>Size-based</strong> — max entries</li></ul>`},
            {n:175,t:"What happens when @Cacheable returns null and you cache nulls?",d:["advanced","tricky"],a:`<p>If <code>cache-null-values=true</code>, null gets stored. Subsequent calls return null directly without hitting DB — useful to suppress repeated misses but masks data appearing later. Use <code>unless = \"#result == null\"</code> if you want to revisit.</p>`},
            {n:176,t:"How to invalidate cache from another instance (Redis)?",d:["expert"],a:`<p>Single Redis = naturally shared — all instances see the eviction. For local Caffeine, use <strong>Redis pub/sub</strong> or Hazelcast's distributed events to broadcast invalidations across nodes.</p>`},
            {n:177,t:"Cache key collision — risks and fixes?",d:["expert"],a:`<p>Default <code>SimpleKeyGenerator</code> uses <code>SimpleKey(args...)</code> — equality based on all args. If args' equals/hashCode is wrong (e.g. mutable, missing override), you get wrong cache hits. Use explicit SpEL key, or ensure args are immutable + properly equal.</p>`},
            {n:178,t:"Where do I cache: service or repository?",d:["intermediate"],a:`<p>Almost always at <strong>service</strong> level. Repo-level caching may miss the dirty checks (ORMs flush before queries). Service caches let you cache transformed DTOs, not raw entities — also avoids Hibernate session leaks.</p>`}
          ]
        },
        {
          id:"aop", n:12, title:"AOP — Aspect-Oriented Programming",
          desc:"<strong>Cross-cutting concerns</strong> — logging, transactions, metrics, security via aspects.",
          questions: [
            {n:179,t:"What is AOP and what is it good for?",d:["intermediate"],a:`<p>Modularizing <strong>cross-cutting concerns</strong> — logging, security checks, transactions, metrics, audit. Without AOP these get sprinkled in every method; with AOP they're centralized in <code>@Aspect</code> classes.</p>`},
            {n:180,t:"AOP terms — Aspect, Advice, Pointcut, JoinPoint?",d:["intermediate"],a:`<ul><li><strong>JoinPoint</strong>: a point in execution (method call, field access). Spring AOP only supports method calls.</li><li><strong>Pointcut</strong>: predicate over JoinPoints — "all methods in com.app.service.*".</li><li><strong>Advice</strong>: code that runs at a JoinPoint — Before, After, Around, AfterReturning, AfterThrowing.</li><li><strong>Aspect</strong>: a class containing pointcuts + advice.</li></ul>`},
            {n:181,t:"Write a logging aspect?",d:["intermediate"],a:`<pre>@Aspect
@Component
public class LoggingAspect {

  @Around("execution(* com.app.service..*(..))")
  public Object log(ProceedingJoinPoint pjp) throws Throwable {
    long start = System.nanoTime();
    try {
      return pjp.proceed();
    } finally {
      long ms = (System.nanoTime() - start) / 1_000_000;
      log.info("{} took {}ms", pjp.getSignature().toShortString(), ms);
    }
  }
}</pre>`},
            {n:182,t:"Common pointcut expressions?",d:["advanced"],a:`<pre>execution(* com.app.service.*.*(..))         // any method in service package
within(com.app.service..*)                    // any join point in package
@annotation(org.springframework.transaction.annotation.Transactional)
@within(org.springframework.stereotype.Service)
@target(org.springframework.stereotype.Service)
args(java.lang.String, ..)                    // first arg is String
this(com.app.UserService)                     // proxy implements
target(com.app.UserService)                   // target instance is</pre>`},
            {n:183,t:"@Before vs @AfterReturning vs @AfterThrowing vs @Around?",d:["intermediate"],a:`<p><strong>@Before</strong>: pre-call. <strong>@AfterReturning</strong>: post-call success, with return value. <strong>@AfterThrowing</strong>: post-call exception. <strong>@After</strong>: finally-style. <strong>@Around</strong>: most powerful — wraps and decides if/when to call <code>proceed()</code>.</p>`},
            {n:184,t:"How does Spring create AOP proxies?",d:["expert"],a:`<p>Two options:</p><ul><li><strong>JDK dynamic proxy</strong> (default): only works for interfaces — proxy implements the interfaces; target is a separate object.</li><li><strong>CGLIB</strong>: for classes without an interface — generates a subclass at runtime. Set <code>spring.aop.proxy-target-class=true</code> to force.</li></ul>`},
            {n:185,t:"Self-invocation problem in AOP?",d:["advanced","tricky"],a:`<p>AOP proxies wrap external calls only. If <code>methodA()</code> calls <code>this.methodB()</code> internally, methodB's @Transactional/@Cacheable are <strong>bypassed</strong>. Fixes: extract methodB to another bean, or inject self via <code>@Lazy ApplicationContext</code> / <code>@Resource MyService self;</code>.</p>`},
            {n:186,t:"Custom annotation + aspect pattern?",d:["advanced"],a:`<pre>@Target(METHOD) @Retention(RUNTIME)
public @interface Audited { String action(); }

@Aspect @Component
public class AuditAspect {
  @Around("@annotation(audited)")
  public Object audit(ProceedingJoinPoint pjp, Audited audited) throws Throwable {
    auditLog.write(audited.action(), currentUser());
    return pjp.proceed();
  }
}

// Usage
@Audited(action = "DELETE_USER")
public void deleteUser(Long id) { ... }</pre>`},
            {n:187,t:"Order of multiple aspects?",d:["advanced"],a:`<p>Use <code>@Order(n)</code> — lower runs first (outermost). Spring's built-in: transactions usually outermost (so they wrap caching/security). Always make Order explicit when several aspects target the same join point.</p>`},
            {n:188,t:"AOP downsides?",d:["expert"],a:`<ul><li>Stack traces become deeper (proxy frames)</li><li>Self-invocation gotcha</li><li>Performance overhead (small for JDK proxy, larger for AspectJ load-time weaving)</li><li>Hidden behavior — easy to forget an aspect is running</li></ul><p>Use AOP for narrow, well-understood concerns (logging, metrics, security). Don't put business logic in aspects.</p>`}
          ]
        },
        {
          id:"async", n:13, title:"Sync, Async & Event-Driven",
          desc:"<strong>@Async, CompletableFuture, application events, transactional events</strong>.",
          questions: [
            {n:189,t:"Sync vs async execution?",d:["beginner"],a:`<p><strong>Sync</strong>: caller waits for completion. Easy to reason about; blocks the caller's thread.<br><strong>Async</strong>: caller continues immediately; result delivered later via callback / future / event. Better thread utilization for I/O-bound work.</p>`},
            {n:190,t:"How to make a method async?",d:["intermediate"],a:`<pre>@SpringBootApplication
@EnableAsync
class App { ... }

@Service
class NotificationService {
  @Async
  public CompletableFuture&lt;Void&gt; send(String to) {
    // runs on a different thread
    emailClient.send(to, ...);
    return CompletableFuture.completedFuture(null);
  }
}</pre><p>Caller doesn't block. Self-invocation gotcha applies (proxy-based).</p>`},
            {n:191,t:"Configure the @Async thread pool?",d:["advanced"],a:`<pre>@Configuration
@EnableAsync
public class AsyncConfig implements AsyncConfigurer {
  public Executor getAsyncExecutor() {
    ThreadPoolTaskExecutor ex = new ThreadPoolTaskExecutor();
    ex.setCorePoolSize(8);
    ex.setMaxPoolSize(32);
    ex.setQueueCapacity(1000);
    ex.setThreadNamePrefix("async-");
    ex.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
    ex.initialize();
    return ex;
  }

  public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
    return (ex, m, args) -&gt; log.error("@Async {} failed", m.getName(), ex);
  }
}</pre>`},
            {n:192,t:"@Async return types — what's allowed?",d:["intermediate"],a:`<ul><li><strong>void</strong>: fire-and-forget, exceptions logged not propagated</li><li><strong>Future&lt;T&gt;</strong>: <code>get()</code> blocks for result</li><li><strong>CompletableFuture&lt;T&gt;</strong>: composable, exceptional/thenApply/etc.</li><li><strong>ListenableFuture&lt;T&gt;</strong>: deprecated</li></ul>`},
            {n:193,t:"CompletableFuture — composition?",d:["advanced"],a:`<pre>CompletableFuture&lt;User&gt; user = userService.fetch(id);
CompletableFuture&lt;Address&gt; addr = addressService.fetch(id);
CompletableFuture.allOf(user, addr).thenAccept(v -&gt; {
  buildResponse(user.join(), addr.join());
});

// Sequential, async
userService.fetch(id)
    .thenApply(User::getEmail)
    .thenCompose(emailService::lookup)
    .exceptionally(ex -&gt; "default@example.com");</pre>`},
            {n:194,t:"Spring application events — @EventListener?",d:["intermediate"],a:`<pre>// Publish
@Service
class OrderService {
  @Autowired ApplicationEventPublisher publisher;
  void place(Order o) {
    repo.save(o);
    publisher.publishEvent(new OrderPlacedEvent(o));
  }
}

// Listen
@Component
class EmailListener {
  @EventListener
  public void on(OrderPlacedEvent e) { sendEmail(e.order()); }
}</pre><p>By default <strong>synchronous</strong> — listener runs in the publishing thread. Add <code>@Async</code> on the listener to run separately.</p>`},
            {n:195,t:"@TransactionalEventListener — why?",d:["advanced"],a:`<pre>@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
public void on(OrderPlacedEvent e) {
  emailService.send(e.order());
}</pre><p>Listener runs only AFTER the publishing transaction commits — no email sent if the order rolls back. Phases: BEFORE_COMMIT, AFTER_COMMIT, AFTER_ROLLBACK, AFTER_COMPLETION.</p>`},
            {n:196,t:"Why are events synchronous by default?",d:["intermediate"],a:`<p>Predictable behavior + transactional consistency: listeners run in the same thread + transaction. Async events lose tx context and must handle errors independently. Make explicit with <code>@Async</code> when needed.</p>`},
            {n:197,t:"Reactive (WebFlux) vs @Async?",d:["expert"],a:`<p>@Async: thread-per-task on top of servlet stack. WebFlux: end-to-end reactive (Project Reactor) — small thread pool handles many connections via event loops. WebFlux better for high-concurrency I/O; servlet+@Async fine for moderate scale and simpler debugging.</p>`}
          ]
        },
        {
          id:"kafka", n:14, title:"Kafka & Messaging",
          desc:"<strong>Producers, consumers, partitions, delivery semantics, dead-letter queues, idempotency</strong>.",
          questions: [
            {n:198,t:"What is Kafka and why use it?",d:["intermediate"],a:`<p>Distributed event streaming platform. Use cases: event-driven microservices, log aggregation, stream processing, decoupling producers from consumers. Strengths: high throughput, durability (disk-based), horizontal scale via partitions, replay capability.</p>`},
            {n:199,t:"Kafka core concepts?",d:["intermediate"],a:`<ul><li><strong>Topic</strong>: named stream of records</li><li><strong>Partition</strong>: ordered sub-log within a topic — unit of parallelism</li><li><strong>Offset</strong>: position within a partition</li><li><strong>Producer</strong>: writes records</li><li><strong>Consumer</strong>: reads records, in a <strong>consumer group</strong></li><li><strong>Broker</strong>: a Kafka server; cluster has many</li><li><strong>Replica</strong>: copy of a partition for fault tolerance</li></ul>`},
            {n:200,t:"Spring Kafka — basic producer/consumer?",d:["intermediate"],a:`<pre># application.yml
spring.kafka.bootstrap-servers: localhost:9092
spring.kafka.consumer.group-id: my-app
spring.kafka.consumer.auto-offset-reset: earliest</pre><pre>@Service
class OrderProducer {
  @Autowired KafkaTemplate&lt;String, Order&gt; kafka;
  public void publish(Order o) {
    kafka.send("orders", o.id().toString(), o);
  }
}

@Component
class OrderConsumer {
  @KafkaListener(topics = "orders", groupId = "billing")
  public void on(Order o) { process(o); }
}</pre>`},
            {n:201,t:"How does Kafka guarantee ordering?",d:["advanced"],a:`<p>Records are ordered <strong>within a partition</strong> only. Same key always goes to the same partition (default partitioner). For ordering across all messages, use 1 partition (loses scale).</p>`},
            {n:202,t:"At-least-once vs at-most-once vs exactly-once?",d:["advanced","expert"],a:`<ul><li><strong>At-most-once</strong>: producer doesn't retry; consumer commits before processing. Risk: lost messages.</li><li><strong>At-least-once</strong> (default): producer retries; consumer commits after processing. Risk: duplicates → consumer must be <strong>idempotent</strong>.</li><li><strong>Exactly-once</strong>: Kafka transactions + idempotent producer + read-committed consumer. Higher complexity / lower throughput.</li></ul>`},
            {n:203,t:"How to make a consumer idempotent?",d:["advanced"],a:`<ul><li>Store the message ID in DB on processing — skip if already seen</li><li>Use <code>UPSERT</code> instead of INSERT</li><li>Make state changes idempotent (set status = X, not increment)</li><li>Use a unique constraint on a business key + handle duplicate exception</li></ul>`},
            {n:204,t:"Consumer group — what is it?",d:["intermediate"],a:`<p>A set of consumer instances sharing the same <code>group.id</code>. Kafka assigns each partition to exactly one consumer in the group. Adding consumers = parallel processing (up to # partitions). Different groups consume independently — <strong>same data delivered to each group</strong>.</p>`},
            {n:205,t:"Auto-commit vs manual commit offsets?",d:["advanced"],a:`<p><strong>Auto-commit</strong> (default): periodic, can lose messages if consumer crashes between commit and processing.<br><strong>Manual</strong>: commit after processing successfully — safer but more code.</p><pre>spring.kafka.consumer.enable-auto-commit: false
spring.kafka.listener.ack-mode: manual</pre><pre>@KafkaListener(topics = "orders")
public void on(ConsumerRecord&lt;String,Order&gt; r, Acknowledgment ack) {
  process(r.value());
  ack.acknowledge();
}</pre>`},
            {n:206,t:"Dead Letter Queue — pattern?",d:["advanced"],a:`<p>Failed messages routed to a separate topic for investigation/replay. Spring Kafka has built-in support:</p><pre>@Bean
DefaultErrorHandler errorHandler(KafkaTemplate&lt;String,Object&gt; t) {
  DeadLetterPublishingRecoverer dlt = new DeadLetterPublishingRecoverer(t,
      (rec, ex) -&gt; new TopicPartition(rec.topic() + ".DLT", rec.partition()));
  return new DefaultErrorHandler(dlt, new FixedBackOff(1000L, 3));
}</pre>`},
            {n:207,t:"How to ensure a message is processed before app shuts down?",d:["expert"],a:`<p>Spring Boot graceful shutdown + Kafka listener container stop. Set <code>spring.lifecycle.timeout-per-shutdown-phase=30s</code> and ensure <code>spring.kafka.listener.async-acks</code> handling — pending records committed before exit.</p>`},
            {n:208,t:"Kafka vs RabbitMQ — when each?",d:["advanced"],a:`<table><tr><th></th><th>Kafka</th><th>RabbitMQ</th></tr><tr><td>Model</td><td>Distributed log</td><td>Message broker</td></tr><tr><td>Throughput</td><td>Very high</td><td>Moderate</td></tr><tr><td>Replay</td><td>Yes (offsets)</td><td>No (consumed = gone)</td></tr><tr><td>Routing</td><td>Topic + key</td><td>Exchanges + bindings (rich)</td></tr><tr><td>Best for</td><td>Event sourcing, analytics, high-volume</td><td>Task queues, RPC, complex routing</td></tr></table>`},
            {n:209,t:"Schema management with Avro / Schema Registry?",d:["expert"],a:`<p>Confluent Schema Registry stores Avro/Protobuf schemas, validates compatibility. Spring Kafka Avro: configure serializer/deserializer to register/lookup schemas. Critical for evolving topics across consumers without breakage.</p>`},
            {n:210,t:"Outbox pattern — why?",d:["expert"],a:`<p>Problem: dual writes — saving to DB and publishing to Kafka aren't atomic. If Kafka publish fails, DB has data without event.</p><p><strong>Solution</strong>: write event to an <code>outbox</code> table within the same DB transaction. A separate poller / Debezium CDC reads the outbox and publishes to Kafka. Guarantees consistency.</p>`},
            {n:211,t:"What is Kafka Streams?",d:["expert"],a:`<p>Library for building stream-processing apps on top of Kafka — joins, aggregations, windowing. Lighter than Flink/Spark for Kafka-native pipelines. Spring Kafka has <code>spring-kafka-streams</code> integration.</p>`}
          ]
        },
        {
          id:"resilience", n:15, title:"Resilience & Circuit Breaker",
          desc:"<strong>Resilience4j patterns</strong> — Circuit Breaker, Retry, Rate Limiter, Bulkhead, Timeout.",
          questions: [
            {n:212,t:"What is a circuit breaker pattern?",d:["intermediate"],a:`<p>Wraps a remote call. Tracks failures; if too many → opens the circuit, fails fast for a cooldown period without calling the downstream. Prevents cascading failures and gives the downstream time to recover.</p>`},
            {n:213,t:"Circuit breaker states?",d:["intermediate","advanced"],a:`<ul><li><strong>CLOSED</strong>: normal operation, calls go through, failures counted</li><li><strong>OPEN</strong>: failure threshold exceeded → all calls fail fast (no downstream call) for waitDurationInOpenState</li><li><strong>HALF_OPEN</strong>: after timeout, allow N test calls. If they succeed → CLOSED; if fail → OPEN again</li></ul>`},
            {n:214,t:"Resilience4j basic config?",d:["intermediate"],a:`<pre># application.yml
resilience4j.circuitbreaker.instances.payment:
  failure-rate-threshold: 50
  slow-call-rate-threshold: 50
  slow-call-duration-threshold: 2s
  permitted-number-of-calls-in-half-open-state: 3
  sliding-window-type: COUNT_BASED
  sliding-window-size: 10
  minimum-number-of-calls: 5
  wait-duration-in-open-state: 30s
  automatic-transition-from-open-to-half-open-enabled: true</pre>`},
            {n:215,t:"@CircuitBreaker annotation?",d:["intermediate"],a:`<pre>@Service
public class PaymentClient {

  @CircuitBreaker(name = "payment", fallbackMethod = "fallback")
  @Retry(name = "payment")
  @TimeLimiter(name = "payment")
  public CompletableFuture&lt;Receipt&gt; charge(Order o) {
    return CompletableFuture.supplyAsync(() -&gt; restTemplate.postForObject(...));
  }

  public CompletableFuture&lt;Receipt&gt; fallback(Order o, Throwable t) {
    return CompletableFuture.completedFuture(Receipt.queued(o));
  }
}</pre>`},
            {n:216,t:"Retry with exponential backoff?",d:["advanced"],a:`<pre>resilience4j.retry.instances.payment:
  max-attempts: 3
  wait-duration: 500ms
  enable-exponential-backoff: true
  exponential-backoff-multiplier: 2
  retry-exceptions:
    - java.io.IOException
    - org.springframework.web.client.ResourceAccessException
  ignore-exceptions:
    - com.app.BusinessException</pre><p>Don't retry on business errors (400, validation) — only transient infra failures.</p>`},
            {n:217,t:"Bulkhead pattern?",d:["advanced"],a:`<p>Isolate failures by limiting concurrent calls per dependency. Like ship bulkheads — flooding one compartment doesn't sink the ship. In code: separate thread pool / semaphore per downstream.</p><pre>resilience4j.bulkhead.instances.payment:
  max-concurrent-calls: 10
  max-wait-duration: 0</pre>`},
            {n:218,t:"Rate limiter pattern?",d:["advanced"],a:`<pre>resilience4j.ratelimiter.instances.payment:
  limit-for-period: 100
  limit-refresh-period: 1s
  timeout-duration: 0

@RateLimiter(name = "payment")
public Receipt charge(Order o) { ... }</pre><p>Throws <code>RequestNotPermitted</code> when budget exhausted. Useful for API consumers and protecting downstream.</p>`},
            {n:219,t:"TimeLimiter — what for?",d:["advanced"],a:`<p>Caps how long an async call can run; throws <code>TimeoutException</code> if exceeded. Required wrapping for CompletableFuture-based calls — without it a hung downstream blocks indefinitely.</p>`},
            {n:220,t:"Combining multiple Resilience4j decorators — order?",d:["expert"],a:`<p>Annotation order from outside-in: <strong>Bulkhead → CircuitBreaker → RateLimiter → Retry → TimeLimiter</strong>. Configure in code:</p><pre>Decorators.ofSupplier(slowCall)
  .withCircuitBreaker(cb)
  .withRetry(retry)
  .withFallback(t -&gt; fallback)
  .decorate();</pre>`},
            {n:221,t:"Resilience4j vs Hystrix?",d:["intermediate"],a:`<p>Hystrix is in maintenance — Netflix recommends Resilience4j as the modern successor. Resilience4j: lightweight, functional API, no thread pool by default, smaller dependency footprint.</p>`},
            {n:222,t:"Saga pattern for distributed transactions?",d:["expert"],a:`<p>Long-running business transaction split into local steps with compensating actions. Two flavors:</p><ul><li><strong>Choreography</strong>: services react to events (no coordinator)</li><li><strong>Orchestration</strong>: a saga manager directs steps</li></ul><p>Use when 2PC isn't feasible (microservices, NoSQL).</p>`},
            {n:223,t:"How to expose circuit-breaker metrics?",d:["expert"],a:`<p>Resilience4j integrates with Micrometer — exposes state, calls, failure rate via Actuator <code>/actuator/metrics</code>. Set <code>resilience4j.circuitbreaker.instances.X.register-health-indicator: true</code> for <code>/actuator/health</code> integration.</p>`}
          ]
        },
        {
          id:"testing", n:16, title:"Testing",
          desc:"<strong>@SpringBootTest, MockMvc, @WebMvcTest, Testcontainers</strong> — testing layers in Spring.",
          questions: [
            {n:224,t:"@SpringBootTest vs @WebMvcTest vs @DataJpaTest?",d:["intermediate"],a:`<p><strong>@SpringBootTest</strong>: full context — slowest, most realistic. Use sparingly.<br><strong>@WebMvcTest</strong>: only web layer (controllers, advice, filters). Mocks services.<br><strong>@DataJpaTest</strong>: only JPA layer with embedded DB. Repos + EntityManager.</p>`},
            {n:225,t:"MockMvc — controller test example?",d:["intermediate"],a:`<pre>@WebMvcTest(UserController.class)
class UserControllerTest {
  @Autowired MockMvc mvc;
  @MockBean UserService userService;

  @Test
  void returns404WhenMissing() throws Exception {
    when(userService.find(1L)).thenThrow(new UserNotFoundException("x"));
    mvc.perform(get("/users/1"))
       .andExpect(status().isNotFound())
       .andExpect(jsonPath("$.message").value("x"));
  }
}</pre>`},
            {n:226,t:"@MockBean vs @SpyBean?",d:["intermediate"],a:`<p>@MockBean: replaces the bean with a Mockito mock — all methods stubbed. @SpyBean: wraps the real bean — calls real methods unless stubbed. Use @SpyBean to override only specific behaviors.</p>`},
            {n:227,t:"Testcontainers — what and why?",d:["advanced"],a:`<p>Spins up real Docker containers (Postgres, Kafka, Redis) for tests. More realistic than embedded H2/Mongo. Pair with <code>@DynamicPropertySource</code> to wire JDBC URL/credentials at runtime.</p><pre>@Testcontainers
@SpringBootTest
class IntegrationTest {
  @Container
  static PostgreSQLContainer&lt;?&gt; pg = new PostgreSQLContainer&lt;&gt;("postgres:15");

  @DynamicPropertySource
  static void props(DynamicPropertyRegistry r) {
    r.add("spring.datasource.url", pg::getJdbcUrl);
    r.add("spring.datasource.username", pg::getUsername);
    r.add("spring.datasource.password", pg::getPassword);
  }
}</pre>`},
            {n:228,t:"@Transactional in tests — what does it do?",d:["intermediate"],a:`<p>Each test runs in a transaction that's <strong>rolled back</strong> at the end — keeps DB clean between tests. Use <code>@Commit</code> to override on a specific test. Beware: rollback hides issues your prod app would see.</p>`},
            {n:229,t:"How to test @Async methods?",d:["advanced"],a:`<p>Disable async in tests via a config that returns a synchronous executor:</p><pre>@TestConfiguration
class SyncAsyncConfig {
  @Bean Executor taskExecutor() { return new SyncTaskExecutor(); }
}</pre><p>Or test with Awaitility for real async behavior.</p>`},
            {n:230,t:"How to test event publishing?",d:["advanced"],a:`<pre>@SpringBootTest
class OrderServiceTest {
  @Autowired OrderService service;
  @SpyBean EmailListener listener;

  @Test
  void publishesEvent() {
    service.place(order);
    verify(listener, timeout(1000)).on(any(OrderPlacedEvent.class));
  }
}</pre>`},
            {n:231,t:"WebTestClient — when use?",d:["intermediate"],a:`<p>Reactive testing alternative to MockMvc. Works for both WebFlux and Spring MVC (since 5.0). Fluent assertions on response.</p>`},
            {n:232,t:"Test slices vs full context — guidance?",d:["intermediate"],a:`<p>Default to slices for speed. Use full <code>@SpringBootTest</code> only for end-to-end / smoke tests that touch multiple layers. Big test suites with full context become slow and flaky.</p>`},
            {n:233,t:"How to test security configuration?",d:["advanced"],a:`<pre>@WebMvcTest(UserController.class)
class SecuredTest {
  @Autowired MockMvc mvc;

  @Test @WithMockUser(roles = "USER")
  void user_cannot_access_admin() throws Exception {
    mvc.perform(get("/admin")).andExpect(status().isForbidden());
  }

  @Test @WithMockUser(roles = "ADMIN")
  void admin_can_access() throws Exception {
    mvc.perform(get("/admin")).andExpect(status().isOk());
  }
}</pre>`}
          ]
        }
      ]
    },
    {
      label: "PART 4 · PRODUCTION & MAANG",
      sections: [
        {
          id:"deployment", n:17, title:"Deployment & Containers",
          desc:"<strong>JAR/WAR, Docker, Kubernetes, layered jars, graceful shutdown</strong>.",
          questions: [
            {n:234,t:"JAR vs WAR — which for Spring Boot?",d:["intermediate"],a:`<p><strong>JAR</strong> (default): self-contained — embedded server. <code>java -jar app.jar</code>. Cloud-friendly.<br><strong>WAR</strong>: deployed to external server (Tomcat, WebLogic). Use only when you must integrate with existing app server.</p>`},
            {n:235,t:"Spring Boot Maven plugin — what does it do?",d:["intermediate"],a:`<p><code>spring-boot-maven-plugin</code> repackages the JAR into an executable "fat jar" with all deps in <code>BOOT-INF/lib/</code>. Adds a custom launcher class. Result: <code>java -jar app.jar</code> works out of the box.</p>`},
            {n:236,t:"Layered JAR — why and how?",d:["advanced"],a:`<p>Splits the fat JAR into layers (deps, snapshot deps, app classes) so Docker can cache the unchanged layers between builds. Configure in pom.xml:</p><pre>&lt;configuration&gt;
  &lt;layers&gt;&lt;enabled&gt;true&lt;/enabled&gt;&lt;/layers&gt;
&lt;/configuration&gt;</pre><p>Then in Dockerfile, copy each layer separately.</p>`},
            {n:237,t:"Multi-stage Dockerfile for Spring Boot?",d:["advanced"],a:`<pre># build stage
FROM eclipse-temurin:21-jdk AS build
WORKDIR /workspace
COPY pom.xml .
COPY src src
RUN ./mvnw -B package -DskipTests

# extract layers
FROM eclipse-temurin:21-jre AS extract
WORKDIR /app
COPY --from=build /workspace/target/*.jar app.jar
RUN java -Djarmode=layertools -jar app.jar extract

# runtime
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=extract /app/dependencies/ ./
COPY --from=extract /app/spring-boot-loader/ ./
COPY --from=extract /app/snapshot-dependencies/ ./
COPY --from=extract /app/application/ ./
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]</pre>`},
            {n:238,t:"Cloud Native Buildpacks vs Dockerfile?",d:["advanced"],a:`<p><code>./mvnw spring-boot:build-image</code> uses Paketo buildpacks — no Dockerfile needed. Auto-detects Java version, layers correctly, smaller image. Good default. Use Dockerfile when you need custom system dependencies.</p>`},
            {n:239,t:"Graceful shutdown in Spring Boot?",d:["advanced"],a:`<pre>server.shutdown=graceful
spring.lifecycle.timeout-per-shutdown-phase=30s</pre><p>On SIGTERM (Kubernetes pod stop), Boot stops accepting new requests, lets in-flight ones finish (up to timeout), then exits. Critical for zero-downtime deploys.</p>`},
            {n:240,t:"Kubernetes liveness vs readiness — wired to Boot?",d:["advanced"],a:`<pre>livenessProbe:
  httpGet:
    path: /actuator/health/liveness
    port: 8080
  initialDelaySeconds: 30
readinessProbe:
  httpGet:
    path: /actuator/health/readiness
    port: 8080
  initialDelaySeconds: 10</pre><p>Make sure <code>management.endpoint.health.probes.enabled=true</code> (default since 2.6).</p>`},
            {n:241,t:"How to externalize config in Kubernetes?",d:["advanced"],a:`<ul><li><strong>ConfigMap</strong> mounted as env vars or files</li><li><strong>Secrets</strong> for sensitive values</li><li><strong>Spring Cloud Kubernetes</strong> for native ConfigMap auto-binding</li><li>Environment variables map via Boot's relaxed binding</li></ul>`},
            {n:242,t:"What's the typical heap size strategy in containers?",d:["advanced"],a:`<p>Don't hardcode <code>-Xmx</code>. Use <code>-XX:MaxRAMPercentage=75.0</code> — JVM scales heap to container memory limit. Ensure JVM is container-aware (Java 11+ is by default).</p>`},
            {n:243,t:"Native compilation with GraalVM?",d:["expert"],a:`<p><code>./mvnw -Pnative native:compile</code> produces a native binary — fast startup (ms), low memory, no JIT warmup. Trade-offs: longer build, limited reflection (needs metadata), no class loading at runtime. Spring Native / Spring AOT (Spring 6+) supports it. Great for serverless / scale-to-zero.</p>`},
            {n:244,t:"Continuous deployment pipeline outline?",d:["expert"],a:`<ol><li>Push to main → CI runs unit + integration tests</li><li>Build JAR + image, push to registry</li><li>Run security scan (Trivy/Snyk)</li><li>Deploy to staging via GitOps (ArgoCD/Flux) or kubectl</li><li>Run smoke tests against staging</li><li>Promote to prod (canary or blue/green)</li><li>Monitor metrics + auto-rollback on regression</li></ol>`},
            {n:245,t:"How to roll out without downtime?",d:["expert"],a:`<ul><li>Stateless services + horizontal scale</li><li>Rolling update with maxSurge=1, maxUnavailable=0</li><li>Graceful shutdown configured</li><li>Backward-compatible API + DB migrations (multi-step)</li><li>Feature flags decouple deploy from release</li><li>Health probes ensure new pods are ready before old pods terminate</li></ul>`},
            {n:246,t:"How do you package a Spring Boot application as a WAR file?",d:["intermediate"],a:`<p>By default, Spring Boot creates an executable fat JAR. To deploy to an external servlet container (Tomcat, JBoss) as a WAR:</p><p><strong>1. Change packaging in pom.xml:</strong></p><pre>&lt;packaging&gt;war&lt;/packaging&gt;</pre><p><strong>2. Extend SpringBootServletInitializer:</strong></p><pre>@SpringBootApplication
public class Application extends SpringBootServletInitializer {
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(Application.class);
    }
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}</pre><p><strong>3. Mark embedded Tomcat as provided</strong> (so it's not bundled in the WAR):</p><pre>&lt;dependency&gt;
  &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
  &lt;artifactId&gt;spring-boot-starter-tomcat&lt;/artifactId&gt;
  &lt;scope&gt;provided&lt;/scope&gt;
&lt;/dependency&gt;</pre><p>The resulting WAR can still be run with <code>java -jar</code> (it's "executable WAR") <em>or</em> deployed to any servlet container. Prefer JAR + embedded server for new apps — simpler and more cloud-friendly.</p>`}
          ]
        },
        {
          id:"scaling", n:18, title:"Scaling & High Traffic",
          desc:"<strong>Horizontal scale, caching, replicas, sharding, async, rate limits</strong> — how to survive load.",
          questions: [
            {n:246,t:"Vertical vs horizontal scaling?",d:["intermediate"],a:`<p><strong>Vertical</strong>: bigger machine. Limit hits CPU/RAM ceiling. Single point of failure.<br><strong>Horizontal</strong>: more machines. Scales practically unbounded. Requires statelessness, load balancing, distributed coordination.</p>`},
            {n:247,t:"What does it mean for a service to be stateless?",d:["intermediate"],a:`<p>No request-bound state in memory between requests. Anything that must persist goes to a shared store (DB, Redis, etc.). Lets any instance handle any request → trivial horizontal scaling.</p>`},
            {n:248,t:"Database read replicas — how to use in Spring?",d:["advanced"],a:`<p>Configure two DataSources (primary + replica) and an <code>AbstractRoutingDataSource</code> that picks based on transaction type:</p><pre>@Transactional(readOnly = true) → replica
@Transactional → primary</pre><p>Spring Data JPA inspects <code>readOnly</code>; combined with custom routing it enables auto-routing.</p>`},
            {n:249,t:"Database sharding — when?",d:["expert"],a:`<p>When a single DB instance can't hold the data or handle the IOPS. Split by tenant ID, region, hash of user_id, etc. Adds complexity (cross-shard joins are hard, transactions limited). Try read replicas + caching first.</p>`},
            {n:250,t:"How to handle a sudden traffic spike?",d:["expert"],a:`<ul><li><strong>Auto-scaling</strong> on CPU / queue depth / latency</li><li><strong>Cache</strong> hot reads (Redis, CDN)</li><li><strong>Rate limiting</strong> + 429 — protect downstream</li><li><strong>Backpressure</strong>: reject early instead of buffering forever</li><li><strong>Async</strong> non-critical work into Kafka</li><li><strong>Circuit breakers</strong> on dependencies</li><li><strong>Connection pool</strong> sized realistically</li></ul>`},
            {n:251,t:"How to size HikariCP pool?",d:["advanced"],a:`<p>Rule of thumb: <code>connections = ((core_count × 2) + effective_spindle_count)</code>. Avoid huge pools — they cause DB lock contention and context switching. Often 10-30 is right. Monitor wait time + saturation.</p>`},
            {n:252,t:"How to design a rate limiter?",d:["expert"],a:`<p>Algorithms: <strong>Token Bucket</strong> (allows bursts, average rate), <strong>Leaky Bucket</strong> (smooth output), <strong>Sliding Window</strong> (precise count over time). Implement with Redis (atomic INCR + EXPIRE) for distributed limiting. Or Resilience4j RateLimiter for in-memory.</p>`},
            {n:253,t:"CDN — how it helps a Spring Boot app?",d:["intermediate"],a:`<p>Caches static assets (CSS, JS, images) at edge nodes near users. Reduces backend load and latency. Spring serves <code>/static/**</code> with cache-control headers; CDN does the rest. For dynamic JSON, pair with edge caching only when responses are public + cacheable.</p>`},
            {n:254,t:"API Gateway — what role?",d:["advanced"],a:`<p>Single entry point for clients. Responsibilities: routing, auth, rate limit, request transformation, response aggregation, logging. Tools: Spring Cloud Gateway (reactive), Kong, AWS API Gateway, Envoy.</p>`},
            {n:255,t:"Connection pool starvation — symptoms and fix?",d:["expert"],a:`<p>Symptoms: requests time out, app threads blocked on <code>HikariProxyConnection</code>, latency cliff under load. Causes: long-held DB transactions, leaked connections, undersized pool. Fix: tune pool, find slow queries, ensure tx scope is minimal, add monitoring on <code>hikaricp.connections.acquire</code>.</p>`},
            {n:256,t:"Load balancing strategies?",d:["advanced"],a:`<ul><li><strong>Round robin</strong>: simple, equal distribution</li><li><strong>Least connections</strong>: pick node with fewest active</li><li><strong>Hash-based</strong>: consistent routing for sticky sessions</li><li><strong>Geographic</strong>: nearest region</li></ul><p>K8s Services do round-robin by default.</p>`},
            {n:257,t:"How to do canary deployment?",d:["expert"],a:`<p>Route a small % of traffic to new version. Monitor errors/latency. If healthy → ramp up gradually. If issues → roll back. Tools: Istio/Linkerd traffic splitting, Argo Rollouts, GKE/EKS canary deployments.</p>`},
            {n:258,t:"Optimize JSON serialization at scale?",d:["expert"],a:`<ul><li>Use records/POJOs with minimal fields — avoid leaking entities</li><li>Configure Jackson <code>ObjectMapper</code>: <code>SerializationFeature.WRITE_DATES_AS_TIMESTAMPS=false</code></li><li>Disable unnecessary modules</li><li>For very high throughput: Protobuf or MessagePack</li><li>HTTP-level: enable gzip / Brotli compression</li></ul>`},
            {n:259,t:"How to monitor a Spring Boot app in production?",d:["advanced"],a:`<ul><li><strong>Metrics</strong>: Micrometer → Prometheus → Grafana</li><li><strong>Logs</strong>: structured JSON (Logback) → ELK / Loki</li><li><strong>Traces</strong>: Spring Cloud Sleuth / Micrometer Tracing → Jaeger / Zipkin</li><li><strong>Health</strong>: Actuator probes + alerts</li><li><strong>APM</strong>: Datadog, New Relic, AppDynamics</li></ul>`}
          ]
        },
        {
          id:"sysdesign", n:19, title:"System Design Patterns",
          desc:"<strong>Idempotency, CQRS, Event Sourcing, Saga, Outbox</strong> — patterns asked in MAANG-level interviews.",
          questions: [
            {n:260,t:"Idempotency key — how to design?",d:["expert"],a:`<p>Client sends <code>Idempotency-Key</code> header. Server stores key + result in DB/Redis with TTL.</p><pre>@PostMapping("/payments")
public Receipt charge(@RequestHeader("Idempotency-Key") String key,
                      @RequestBody Charge req) {
  Receipt cached = idempotencyStore.get(key);
  if (cached != null) return cached;
  Receipt r = processCharge(req);
  idempotencyStore.put(key, r, Duration.ofHours(24));
  return r;
}</pre>`},
            {n:261,t:"CQRS — what and why?",d:["expert"],a:`<p>Command Query Responsibility Segregation: separate models for writes (commands) vs reads (queries). Read side often denormalized for fast queries. Useful when read/write scale very differently or when reads need different views.</p>`},
            {n:262,t:"Event Sourcing — basics?",d:["expert"],a:`<p>Store the sequence of events instead of current state. Current state = replay of events. Pros: audit trail, time-travel, easy temporal queries. Cons: complex queries, schema evolution, eventual consistency.</p>`},
            {n:263,t:"Saga pattern in Spring?",d:["expert"],a:`<p>Long workflow = sequence of local transactions, each with a compensating action.</p><ul><li><strong>Choreography</strong>: services react to events (Kafka). Loosely coupled but hard to debug.</li><li><strong>Orchestration</strong>: a saga manager sends commands and listens for replies. Easier to trace.</li></ul><p>Tools: Axon, Camunda, Temporal, plain Spring + Kafka.</p>`},
            {n:264,t:"Outbox pattern — atomicity for events?",d:["expert"],a:`<p>Insert event row in <code>outbox</code> table inside the same DB transaction as your business write. A poller (or Debezium CDC) reads outbox rows and publishes to Kafka. Guarantees event is sent iff DB committed.</p>`},
            {n:265,t:"Distributed tracing — what does it give you?",d:["advanced"],a:`<p>End-to-end view of a request as it crosses services. Each span has parent/child relations. Helps find latency hot spots, failure points, dependencies. Spring + OpenTelemetry / Micrometer Tracing exports to Jaeger or Zipkin.</p>`},
            {n:266,t:"How to design a URL shortener with Spring Boot?",d:["expert"],a:`<ul><li>POST /shorten → generate code (base62 of incrementing ID, or hash + collision handling)</li><li>Store in DB: <code>(code, target_url, owner, created_at)</code></li><li>GET /{code} → 301 redirect, async increment click counter (Kafka/Redis)</li><li>Cache popular codes in Redis</li><li>Rate limit POST per user/IP</li><li>Stateless app instances behind load balancer</li><li>For huge scale: shard DB by code prefix, use Cassandra</li></ul>`},
            {n:267,t:"How to design a notification service?",d:["expert"],a:`<ul><li>Async via Kafka topic (events fan out into emails / push / SMS)</li><li>Worker per channel, each idempotent</li><li>Template engine for content</li><li>Retry with exponential backoff + DLT</li><li>Dedup window to suppress duplicates</li><li>User preferences in DB</li><li>Rate limit per user</li></ul>`},
            {n:268,t:"How to implement multi-tenancy?",d:["expert"],a:`<ul><li><strong>Database per tenant</strong>: best isolation, expensive at scale</li><li><strong>Schema per tenant</strong>: middle ground (Postgres schemas)</li><li><strong>Discriminator column</strong>: shared schema, <code>tenant_id</code> in every table — cheapest, requires careful filtering</li></ul><p>Spring: <code>AbstractRoutingDataSource</code>, Hibernate's <code>MultiTenantConnectionProvider</code>, or app-level filter that sets a <code>TenantContext</code> from JWT claim.</p>`},
            {n:269,t:"How to design idempotent Kafka consumer?",d:["expert"],a:`<p>Track processed message IDs in DB (<code>processed_messages(message_id, processed_at)</code>) within the same transaction as the business write. On consume: SELECT, if absent → process + INSERT both. Duplicate: skip. TTL on the table to prevent unbounded growth.</p>`},
            {n:270,t:"How to handle eventual consistency in UI?",d:["expert"],a:`<ul><li>Show pending state ("processing...")</li><li>Optimistic UI updates with rollback on failure</li><li>Server returns versioned/etag responses; client polls or subscribes for updates</li><li>WebSocket / SSE for push notifications</li></ul>`},
            {n:271,t:"What is a heartbeat / leader election?",d:["expert"],a:`<p>Multiple instances → one designated leader for singleton-like work (e.g., scheduled job). Patterns: Redis SETNX with TTL, ZooKeeper / Etcd, Spring Integration leader election. Without it, scheduled tasks run N times in N instances.</p>`}
          ]
        },
        {
          id:"production", n:20, title:"Production Best Practices",
          desc:"<strong>Logging, observability, secrets, security hardening, common pitfalls</strong>.",
          questions: [
            {n:272,t:"Structured logging — why and how?",d:["advanced"],a:`<pre>// logback-spring.xml
&lt;configuration&gt;
  &lt;springProfile name="prod"&gt;
    &lt;appender name="JSON" class="ch.qos.logback.core.ConsoleAppender"&gt;
      &lt;encoder class="net.logstash.logback.encoder.LogstashEncoder"/&gt;
    &lt;/appender&gt;
    &lt;root level="INFO"&gt;&lt;appender-ref ref="JSON"/&gt;&lt;/root&gt;
  &lt;/springProfile&gt;
&lt;/configuration&gt;</pre><p>JSON logs are parseable by ELK/Loki. Add MDC: <code>MDC.put(\"requestId\", id)</code> for correlation across services.</p>`},
            {n:273,t:"What should you NOT log?",d:["advanced"],a:`<ul><li>Passwords, JWTs, API keys, credit card numbers</li><li>PII unless required + masked</li><li>Full request bodies for sensitive endpoints</li><li>Stack traces at INFO/DEBUG (use ERROR)</li></ul><p>Mask sensitive fields with a Logback converter or Jackson @JsonView.</p>`},
            {n:274,t:"How to expose Prometheus metrics?",d:["advanced"],a:`<pre>&lt;dependency&gt;
  &lt;groupId&gt;io.micrometer&lt;/groupId&gt;
  &lt;artifactId&gt;micrometer-registry-prometheus&lt;/artifactId&gt;
&lt;/dependency&gt;</pre><pre>management.endpoints.web.exposure.include=prometheus,health
management.metrics.tags.application=\${spring.application.name}</pre><p>Scrape <code>/actuator/prometheus</code>.</p>`},
            {n:275,t:"Important metrics to monitor in a Spring Boot app?",d:["expert"],a:`<ul><li><code>http.server.requests</code> — RED: rate, errors, duration (p99 too)</li><li>JVM: <code>jvm.memory.used</code>, <code>jvm.gc.pause</code></li><li>HikariCP: <code>hikaricp.connections.usage</code>, <code>acquire</code></li><li>Cache: <code>cache.gets</code>, <code>cache.puts</code>, hit ratio</li><li>Kafka: consumer lag (<code>kafka.consumer.records.lag.max</code>)</li><li>Custom business metrics (orders/sec, payments/sec)</li></ul>`},
            {n:276,t:"Common Spring Boot perf pitfalls?",d:["expert"],a:`<ul><li>N+1 queries (lazy loading in loops)</li><li>Returning entities instead of DTOs (huge JSON, JPA proxies)</li><li>EAGER fetch on collections</li><li>Logging in tight loops</li><li>Synchronous remote calls without timeouts</li><li>Unbounded queries (no pagination)</li><li>Holding DB connections during external API calls</li><li>Default thread pools (small, blocking)</li></ul>`},
            {n:277,t:"Security hardening checklist?",d:["expert"],a:`<ul><li>HTTPS only (HSTS header)</li><li>Update dependencies regularly (OWASP Dependency-Check)</li><li>Disable unused Actuator endpoints in prod</li><li>Strong password hashing (BCrypt cost ≥ 12)</li><li>Validate / sanitize ALL inputs</li><li>Parameterized queries (no string concat in SQL)</li><li>CSRF on for cookie auth, off for JWT</li><li>Rate limit auth endpoints</li><li>Secrets via env vars or vault — never in repo</li><li>Security headers: X-Frame-Options, Content-Security-Policy, X-Content-Type-Options</li></ul>`},
            {n:278,t:"How to debug a memory leak?",d:["expert"],a:`<ol><li>Trigger heap dump: <code>jcmd PID GC.heap_dump /tmp/heap.hprof</code> or via Actuator <code>/actuator/heapdump</code></li><li>Open in Eclipse MAT or VisualVM</li><li>Look for "dominator tree" — biggest objects + retainer</li><li>Common culprits: ThreadLocal in pool, static collections, listener leaks, Hibernate session left open, log appenders buffering</li></ol>`},
            {n:279,t:"How to profile a slow endpoint?",d:["expert"],a:`<ul><li>Add a <code>@Timed</code> Micrometer metric</li><li>Use Spring Cloud Sleuth/Micrometer trace to see which span is slow</li><li>JFR (Java Flight Recorder) capture during load</li><li>Async profiler / JFR for CPU flame graphs</li><li>Check DB slow query log for the time period</li><li>Look at thread dumps if blocked</li></ul>`},
            {n:280,t:"Twelve-factor app — what matters most for Spring Boot?",d:["expert"],a:`<ul><li><strong>Codebase</strong>: one repo, many deploys</li><li><strong>Dependencies</strong>: explicit, isolated</li><li><strong>Config</strong>: in env, not code</li><li><strong>Backing services</strong>: treated as attached resources</li><li><strong>Build/release/run</strong>: strict separation</li><li><strong>Processes</strong>: stateless, share-nothing</li><li><strong>Port binding</strong>: self-contained (Boot does this)</li><li><strong>Concurrency</strong>: scale via process model</li><li><strong>Disposability</strong>: fast startup, graceful shutdown</li><li><strong>Dev/prod parity</strong>: similar environments</li><li><strong>Logs</strong>: stream to stdout — no log file management</li><li><strong>Admin processes</strong>: one-off scripts in same env</li></ul>`},
            {n:281,t:"What's a healthy CI pipeline for a Spring Boot project?",d:["expert"],a:`<ol><li>Compile + unit tests (fast)</li><li>Integration tests (Testcontainers)</li><li>Static analysis: SpotBugs, PMD, Checkstyle</li><li>Code coverage gate (e.g., 70%)</li><li>OWASP dependency check</li><li>Build image, push to registry</li><li>Deploy to staging, run smoke tests</li><li>Manual approval → prod</li></ol>`},
            {n:282,t:"How to design for backward compatibility?",d:["expert"],a:`<ul><li>API: never remove fields; add new ones; version when needed</li><li>DB: additive migrations; multi-step renames; never drop until all consumers upgraded</li><li>Events: schema registry with compatibility checks (Avro)</li><li>Feature flags decouple deploy from release</li><li>Run old + new versions side-by-side during rollout</li></ul>`}
          ]
        }
      ]
    },
    {
      label: "PART 5 · ADVANCED CONCURRENCY & DISTRIBUTED",
      sections: [
        {
          id:"concurrency-memory", n:21, title:"Concurrency, Memory & Thread Safety",
          desc:"<strong>JVM memory model, thread-safe collections, lock striping, object pooling, ThreadLocal</strong> — internals you'll be quizzed on at MAANG.",
          questions: [
            {n:283,t:"Stack vs heap memory in Java?",d:["intermediate"],a:`<table><tr><th></th><th>Stack</th><th>Heap</th></tr><tr><td>Scope</td><td>Per-thread</td><td>Shared by all threads</td></tr><tr><td>Stores</td><td>Method frames, locals, refs</td><td>Objects + arrays</td></tr><tr><td>Allocation</td><td>Pointer bump (very fast)</td><td>GC-managed</td></tr><tr><td>Lifetime</td><td>Until method returns</td><td>Until no refs (GC'd)</td></tr><tr><td>Error</td><td>StackOverflowError</td><td>OutOfMemoryError</td></tr><tr><td>Size</td><td>Small (~512KB-1MB), -Xss</td><td>Large, -Xmx</td></tr></table>`},
            {n:284,t:"All JVM memory areas?",d:["advanced"],a:`<ul><li><strong>Heap</strong>: Young (Eden+Survivor) + Old generation</li><li><strong>Stack</strong>: per-thread method frames</li><li><strong>Metaspace</strong>: class metadata (replaces PermGen since Java 8). Native memory.</li><li><strong>Code cache</strong>: JIT-compiled native code</li><li><strong>Native memory</strong>: direct ByteBuffers, JNI, thread stacks</li></ul>`},
            {n:285,t:"Why is HashMap not thread-safe?",d:["advanced"],a:`<p>Concurrent puts during resize can corrupt the bucket array. Pre-Java 8: linked-list reversal could form a cycle → infinite loop in <code>get()</code>. Modern: data loss / corruption. Use ConcurrentHashMap for shared maps.</p>`},
            {n:286,t:"Hashtable vs ConcurrentHashMap vs Collections.synchronizedMap?",d:["advanced"],a:`<table><tr><th></th><th>Hashtable</th><th>synchronizedMap</th><th>ConcurrentHashMap</th></tr><tr><td>Locking</td><td>Whole map</td><td>Whole map</td><td>Per-bin (fine-grained)</td></tr><tr><td>Reads block writes</td><td>Yes</td><td>Yes</td><td>No</td></tr><tr><td>Iteration</td><td>Fail-fast (CME)</td><td>Manual sync needed</td><td>Weakly consistent</td></tr><tr><td>Nulls</td><td>None</td><td>Yes</td><td>None</td></tr><tr><td>Status</td><td>Legacy</td><td>Legacy</td><td>Modern default</td></tr></table>`},
            {n:287,t:"What is lock striping?",d:["advanced"],a:`<p>Split state into N segments, each with its own lock — threads working on different segments run concurrently. ConcurrentHashMap (Java 7) used 16 segments by default. Java 8+ uses per-bin <code>synchronized</code> + CAS. Same idea, finer grain. Pattern useful for any high-contention shared structure.</p>`},
            {n:288,t:"Thread-safe Set options?",d:["advanced"],a:`<ul><li><code>Collections.synchronizedSet(set)</code> — single-lock wrapper, manual sync for iteration</li><li><code>ConcurrentHashMap.newKeySet()</code> — backed by CHM, best general-purpose</li><li><code>CopyOnWriteArraySet</code> — copy on every write; great for read-heavy with rare writes</li><li><code>ConcurrentSkipListSet</code> — sorted, O(log n)</li><li><code>Set.copyOf(s)</code> — immutable snapshot</li></ul>`},
            {n:289,t:"Collections.synchronizedSet — gotchas?",d:["advanced","tricky"],a:`<pre>Set&lt;String&gt; s = Collections.synchronizedSet(new HashSet&lt;&gt;());
// Iteration NOT thread-safe by default
synchronized (s) {                        // MUST sync externally
  for (String x : s) { ... }
}</pre><p>Atomic ops are sync'd, but multi-step iteration is your responsibility. Easy to miss → CME or stale reads.</p>`},
            {n:290,t:"CopyOnWriteArraySet/List — when?",d:["advanced"],a:`<p>Read-heavy + rare writes (listener lists, snapshot configs). Every write copies the entire backing array — expensive for large/frequent writes. Iterators see a SNAPSHOT — never throw CME, never see in-flight changes. Common Spring use: <code>ApplicationEventMulticaster</code>'s listener list.</p>`},
            {n:291,t:"What is object pooling and why does it help?",d:["intermediate"],a:`<p>Reuse expensive-to-create objects instead of new+GC each time. Reduces allocation cost + GC pressure for hot paths. Examples in Spring: <strong>HikariCP</strong> (DB connections), <strong>thread pools</strong>, Apache Commons Pool (generic), Netty <strong>ByteBuf</strong> pool. Trade-off: pool tracking overhead, possible leaks if objects aren't reset.</p>`},
            {n:292,t:"Connection pool internals — what does it do?",d:["advanced"],a:`<ul><li>Pre-creates N connections, kept open</li><li><code>borrow()</code> → use → <code>return()</code> (NOT close)</li><li>Health check (test query) periodically</li><li>idleTimeout / maxLifetime to recycle stale connections</li><li>HikariCP: lock-free for borrow/return, <code>ConcurrentBag</code> with thread-local affinity</li><li>Common metric: <code>hikaricp.connections.acquire</code> — long acquires = pool exhausted</li></ul>`},
            {n:293,t:"Thread pool internals (ThreadPoolExecutor)?",d:["advanced"],a:`<ul><li>Core threads: kept alive (or until <code>allowCoreThreadTimeOut</code>)</li><li>Max threads: created up to this on demand</li><li>Queue: holds waiting tasks (Bounded? Unbounded?)</li><li>RejectedExecutionHandler: AbortPolicy (default), CallerRunsPolicy, DiscardPolicy</li></ul><p>Spring's <code>ThreadPoolTaskExecutor</code> wraps it with naming + lifecycle.</p>`},
            {n:294,t:"Generic object pooling with Apache Commons Pool?",d:["expert"],a:`<pre>GenericObjectPool&lt;Heavy&gt; pool = new GenericObjectPool&lt;&gt;(new BasePooledObjectFactory&lt;Heavy&gt;() {
  public Heavy create() { return new Heavy(); }
  public PooledObject&lt;Heavy&gt; wrap(Heavy h) { return new DefaultPooledObject&lt;&gt;(h); }
  public void passivateObject(PooledObject&lt;Heavy&gt; po) { po.getObject().reset(); }
});

Heavy h = pool.borrowObject();
try { h.use(); } finally { pool.returnObject(h); }</pre>`},
            {n:295,t:"ThreadLocal — pitfalls in Spring?",d:["advanced"],a:`<p>Per-thread storage (used by Spring for SecurityContext, request attributes, transaction state). In thread pools, threads are reused → <strong>state leaks across requests</strong> if not cleaned. Always <code>remove()</code> in a finally. Spring auto-cleans its own ThreadLocals; YOUR custom ones are your responsibility.</p>`},
            {n:296,t:"volatile — what does it guarantee?",d:["advanced"],a:`<ul><li><strong>Visibility</strong>: writes flushed to main memory; reads always see latest</li><li><strong>Ordering</strong>: prevents reorderings around the volatile access (happens-before)</li></ul><p><strong>Does NOT</strong> guarantee atomicity for compound ops like <code>x++</code>. Use AtomicInteger for that.</p>`},
            {n:297,t:"AtomicInteger / AtomicReference?",d:["advanced"],a:`<p>CAS-based lock-free atomicity. <code>incrementAndGet</code>, <code>compareAndSet</code>, <code>updateAndGet</code>. For high-contention counters use <strong>LongAdder</strong> (better than AtomicLong — strikes per-thread to avoid CAS storm).</p>`},
            {n:298,t:"ReentrantLock vs synchronized?",d:["advanced"],a:`<p><strong>synchronized</strong>: simple, JIT-optimized, auto-released on exception. <strong>ReentrantLock</strong>: <code>tryLock(timeout)</code>, fair option (FIFO), multiple Conditions, interruptible lock. Lock when you need its features; synchronized otherwise.</p>`},
            {n:299,t:"ReadWriteLock and StampedLock?",d:["expert"],a:`<p><strong>ReentrantReadWriteLock</strong>: many readers OR one writer. Best when reads ≫ writes.<br><strong>StampedLock</strong> (Java 8): adds an <em>optimistic read</em> mode — no lock acquired, just a stamp validated after. Even faster for read-heavy. Not reentrant.</p>`},
            {n:300,t:"Race condition in Spring service — common cause?",d:["advanced","tricky"],a:`<p>Singleton service with <strong>mutable instance field</strong> accessed by many request threads. Fix: keep services <strong>stateless</strong> (no instance state), use ConcurrentHashMap for shared state, or make fields final + thread-safe types.</p>`},
            {n:301,t:"Modern GC choices in JVM?",d:["advanced"],a:`<ul><li><strong>G1</strong> (default since Java 11): low-pause, region-based, predictable</li><li><strong>ZGC</strong>: ultra-low pause (&lt;1ms) — huge heaps</li><li><strong>Shenandoah</strong>: similar to ZGC, RH-led</li><li><strong>Parallel</strong>: throughput-oriented, longer pauses — batch jobs</li><li><strong>CMS</strong>: deprecated, removed</li></ul>`},
            {n:302,t:"Memory leak vs resource leak — Spring examples?",d:["expert"],a:`<ul><li><strong>Memory leak</strong>: static caches without eviction; ThreadLocal in pool; long-lived listener holding refs; growing in-memory metric maps. Symptom: heap grows over time → OOM.</li><li><strong>Resource leak</strong>: not closing JDBC Connection, InputStream, Closeable. Always use try-with-resources. Symptom: exhausted pool / file handles → "Too many open files".</li></ul>`}
          ]
        },
        {
          id:"webflux", n:22, title:"Reactive Programming & WebFlux",
          desc:"<strong>Reactor (Mono, Flux), WebClient, backpressure, R2DBC</strong> — non-blocking Spring.",
          questions: [
            {n:303,t:"What is Spring WebFlux?",d:["intermediate"],a:`<p>Reactive web framework introduced in Spring 5. Non-blocking, event-loop based (Netty by default). Built on <strong>Project Reactor</strong> (Mono, Flux). Sibling of Spring MVC — choose one.</p>`},
            {n:304,t:"Mono vs Flux?",d:["intermediate"],a:`<p><code>Mono&lt;T&gt;</code>: 0 or 1 element (like Optional + Future). <code>Flux&lt;T&gt;</code>: 0 to N elements (stream). Both are reactive <em>Publishers</em> — nothing happens until subscribed.</p>`},
            {n:305,t:"WebFlux vs Spring MVC — when each?",d:["advanced"],a:`<p><strong>MVC</strong>: blocking, 1 thread per request, easier debug, vast ecosystem. Default for most apps.<br><strong>WebFlux</strong>: high-concurrency I/O bound (many slow downstream calls), reactive sources (Kafka, R2DBC), streaming (SSE). Steeper learning curve, harder to debug.</p><p><strong>Java 21+ caveat</strong>: virtual threads now make MVC scale similarly for blocking workloads — WebFlux's edge has narrowed.</p>`},
            {n:306,t:"What is backpressure?",d:["advanced"],a:`<p>Slow consumer signals upstream to slow down — <em>flow control</em>. Reactor's <code>request(n)</code> tells upstream how many items the consumer can handle. Without backpressure, a fast producer overwhelms slow consumer (OOM).</p>`},
            {n:307,t:"Hot vs cold publishers?",d:["advanced"],a:`<p><strong>Cold</strong>: each subscriber gets the full sequence from the beginning (HTTP response Mono — re-executes for each subscriber).<br><strong>Hot</strong>: subscribers receive only events emitted after they subscribe (button clicks, sensor data). Use <code>publish().refCount()</code> or <code>Sinks</code> to make hot.</p>`},
            {n:308,t:"WebClient — replacement for RestTemplate?",d:["intermediate"],a:`<pre>WebClient client = WebClient.create("https://api.example.com");
Mono&lt;User&gt; user = client.get().uri("/users/{id}", id)
    .retrieve()
    .bodyToMono(User.class);</pre><p>Reactive, but works in MVC apps too (call <code>.block()</code> if needed). RestTemplate is in maintenance mode — prefer WebClient.</p>`},
            {n:309,t:"R2DBC — what is it?",d:["advanced"],a:`<p><strong>Reactive Relational Database Connectivity</strong>. Non-blocking driver for Postgres, MySQL, MS SQL. Returns Mono/Flux. Use only with WebFlux — mixing blocking JDBC defeats the purpose. Spring Data R2DBC supports basic repositories (no full JPA features).</p>`},
            {n:310,t:"Reactor Schedulers?",d:["advanced"],a:`<ul><li><code>Schedulers.parallel()</code>: CPU-bound work (default ≈ # cores)</li><li><code>Schedulers.boundedElastic()</code>: blocking I/O (capped, growing pool)</li><li><code>Schedulers.single()</code>: dedicated thread for single-threaded ops</li></ul><p><code>publishOn(scheduler)</code>: switches threads downstream. <code>subscribeOn(scheduler)</code>: source executes on this scheduler.</p>`},
            {n:311,t:"map vs flatMap in Reactor?",d:["intermediate"],a:`<ul><li><code>map(fn)</code>: synchronous transform per element</li><li><code>flatMap(fn)</code>: async transform returning a Publisher; flattens into the outer stream</li></ul><p>Use flatMap when next step is itself reactive (DB call, HTTP call). Concurrency configurable.</p>`},
            {n:312,t:"Combining publishers?",d:["advanced"],a:`<ul><li><code>Mono.zip(a, b)</code> — combine into Tuple, both run in parallel</li><li><code>Flux.merge(a, b)</code> — interleaved as they emit</li><li><code>Flux.concat(a, b)</code> — sequential: drain a, then b</li><li><code>Mono.then(b)</code> — ignore previous result, run b</li></ul>`},
            {n:313,t:"Error handling in Reactor?",d:["advanced"],a:`<pre>flux
  .onErrorReturn(IOException.class, "default")  // recover with value
  .onErrorResume(t -&gt; fallbackFlux())            // recover with publisher
  .retryWhen(Retry.backoff(3, Duration.ofSeconds(1)))
  .doOnError(t -&gt; log.error("oops", t))         // side effect
  .doFinally(s -&gt; cleanup());</pre>`},
            {n:314,t:"Server-Sent Events with WebFlux?",d:["advanced"],a:`<pre>@GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
public Flux&lt;ServerSentEvent&lt;String&gt;&gt; stream() {
  return Flux.interval(Duration.ofSeconds(1))
      .map(seq -&gt; ServerSentEvent.builder("tick " + seq).build());
}</pre><p>Lighter than WebSocket for one-way streams. Auto-reconnect baked into browsers.</p>`},
            {n:315,t:"Testing reactive code?",d:["advanced"],a:`<pre>StepVerifier.create(myFlux)
    .expectNext("a", "b")
    .expectErrorMatches(t -&gt; t instanceof TimeoutException)
    .verify();</pre><p>From <code>reactor-test</code>. Asserts emission sequence + completion / error.</p>`},
            {n:316,t:"Reactive transactions?",d:["expert"],a:`<p><code>@Transactional</code> works with R2DBC via <code>R2dbcTransactionManager</code>. Context propagated reactively (not via ThreadLocal). Don't mix R2DBC with blocking JDBC inside the same reactive chain — undefined behavior.</p>`},
            {n:317,t:"WebFlux vs Project Loom (virtual threads)?",d:["expert"],a:`<p>Loom (Java 21+) makes blocking code scale via virtual threads — millions of cheap threads instead of OS threads. For new server apps on Java 21+, <strong>Spring MVC + virtual threads</strong> often gives 90% of WebFlux's scalability with 50% of the complexity. WebFlux still wins for: streaming, reactive sources (R2DBC, Kafka reactive), backpressure-aware pipelines.</p>`}
          ]
        },
        {
          id:"distributed", n:23, title:"Distributed Systems Patterns",
          desc:"<strong>Distributed locking, ACL, sidecar, service mesh, strangler fig</strong> — patterns for microservices at scale.",
          questions: [
            {n:318,t:"What is distributed locking and when do you need it?",d:["advanced"],a:`<p>Mutual exclusion across multiple processes/nodes — <code>synchronized</code> doesn't work across JVMs. Use cases: <strong>scheduled job leader</strong> (one instance runs, others skip), <strong>idempotent processing</strong> (only one consumer handles a message), <strong>resource access</strong> (one writer at a time on shared file).</p>`},
            {n:319,t:"Redis-based distributed lock (SETNX)?",d:["expert"],a:`<pre># Acquire (atomic)
SET lock:order:123 &lt;uuid&gt; NX PX 30000

# Release (Lua to ensure we delete OUR lock, not someone else's)
if redis.call("GET", KEYS[1]) == ARGV[1] then
    return redis.call("DEL", KEYS[1])
else return 0 end</pre><p>TTL ensures auto-release on crash. Critical: release script must check ownership.</p>`},
            {n:320,t:"Redisson — why use it?",d:["expert"],a:`<p>Java Redis client with battle-tested distributed primitives: RLock (reentrant), RFairLock, RSemaphore, RReadWriteLock, RCountDownLatch. <strong>Watchdog</strong> auto-extends lock TTL while held. Saves you from writing the SETNX + Lua + retry logic yourself.</p><pre>RLock lock = redisson.getLock("order:123");
lock.tryLock(0, 30, TimeUnit.SECONDS);
try { processOrder(); } finally { lock.unlock(); }</pre>`},
            {n:321,t:"The Redlock algorithm — what's the debate?",d:["expert"],a:`<p>Antirez (Redis author) proposed multi-master Redlock for HA distributed locks. Martin Kleppmann critiqued: <strong>clock drift, GC pauses, network delays</strong> can break safety guarantees. <strong>Practical advice</strong>: use single-Redis SETNX, design idempotent operations, treat the lock as advisory rather than guaranteeing exclusive access. For STRONG correctness use ZooKeeper or etcd.</p>`},
            {n:322,t:"ZooKeeper / etcd for distributed coordination?",d:["expert"],a:`<p>Strongly consistent (CP in CAP) systems. Use cases: leader election, distributed locks, service discovery, config storage, watches. Heavier than Redis but provides linearizable guarantees. Spring Cloud has integrations for both.</p>`},
            {n:323,t:"What is the ACL pattern?",d:["advanced"],a:`<p><strong>Access Control List</strong> — explicit list of (subject, permission) tuples per resource. More fine-grained than RBAC: each resource has its own permissions. Example: \"Alice can EDIT document 42; Bob can READ.\" RBAC: \"Editors can EDIT all documents.\"</p>`},
            {n:324,t:"Spring Security ACL module?",d:["expert"],a:`<p>Domain-object security: which user can do what on which entity. Stores <code>ACL_OBJECT_IDENTITY</code>, <code>ACL_ENTRY</code> tables.</p><pre>@PostAuthorize("hasPermission(returnObject, 'read')")
public Document fetch(Long id) { ... }

@PostFilter("hasPermission(filterObject, 'read')")
public List&lt;Document&gt; allDocs() { ... }</pre><p>Heavy — only adopt when RBAC isn't expressive enough.</p>`},
            {n:325,t:"Sidecar pattern?",d:["advanced"],a:`<p>Helper container deployed alongside main service in the same pod (Kubernetes). Examples: <strong>logging agent</strong> (Fluentd), <strong>service mesh proxy</strong> (Envoy), <strong>secrets fetcher</strong> (Vault Agent), <strong>auth proxy</strong>. Main app doesn't know about cross-cutting concerns — sidecar handles them transparently via localhost.</p>`},
            {n:326,t:"Ambassador pattern?",d:["advanced"],a:`<p>Specialized sidecar for OUTBOUND traffic. Wraps external calls with retries, circuit breakers, monitoring, caching. App talks to localhost; ambassador talks to the real service. Decouples networking concerns from app code.</p>`},
            {n:327,t:"Service mesh (Istio, Linkerd) — what does it do?",d:["expert"],a:`<ul><li><strong>mTLS</strong> between services automatically</li><li><strong>Retries, timeouts, circuit breakers</strong> at platform level</li><li><strong>Traffic shifting</strong> (canary, A/B) without code changes</li><li><strong>Observability</strong>: metrics, traces, logs auto-collected</li><li><strong>Policy</strong>: who can call whom</li></ul><p>App code stays focused on business logic. Trade-off: operational complexity.</p>`},
            {n:328,t:"Strangler fig pattern?",d:["expert"],a:`<p>Gradually replace a legacy system. Route some endpoints to the new microservice; others continue to legacy monolith. Migrate piece by piece behind a facade. The new system slowly \"strangles\" the old (named after the strangler fig tree). Reduces big-bang risk.</p>`},
            {n:329,t:"API Gateway pattern?",d:["advanced"],a:`<p>Single entry for all client traffic — handles auth, rate limit, routing, transformation, response aggregation. Examples: Spring Cloud Gateway (reactive), Kong, Envoy, AWS API Gateway. Avoids each microservice reimplementing auth/throttle.</p>`},
            {n:330,t:"Service discovery — how does it work?",d:["advanced"],a:`<p>Services register themselves at startup; clients look up addresses dynamically. <strong>Client-side</strong> (Eureka): client gets list and load-balances locally. <strong>Server-side</strong> (Kubernetes Service, AWS ELB): infrastructure routes. K8s Service is most common today.</p>`},
            {n:331,t:"Spring Cloud Config Server?",d:["expert"],a:`<p>Centralized config repo (typically Git-backed) for many services. Each service pulls config at startup. <code>@RefreshScope</code> beans can hot-reload via <code>/actuator/refresh</code> + Spring Cloud Bus to fan out. Decouples config changes from redeploys.</p>`},
            {n:332,t:"Backend for Frontend (BFF)?",d:["expert"],a:`<p>Separate backend per client type — web, mobile, IoT. Each BFF aggregates calls to multiple microservices and shapes the response specifically for its client. Reduces over-fetching, simplifies client code, keeps microservices generic.</p>`},
            {n:333,t:"CQRS — beyond the basics?",d:["expert"],a:`<p>Separate models for write (commands) vs read (queries). <strong>Write side</strong>: normalized SQL, validates rules. <strong>Read side</strong>: denormalized, optimized per use case (Elasticsearch for search, Redis for hot reads). Sync via events. Adds complexity (eventual consistency); only adopt when read/write loads or shapes diverge significantly.</p>`},
            {n:334,t:"Saga compensation example?",d:["expert"],a:`<p><strong>Order saga</strong>: PaymentTaken → InventoryReserved → ShipmentCreated. If shipment fails:</p><ol><li>InventoryReserved.compensate → return stock</li><li>PaymentTaken.compensate → refund</li></ol><p>Each step has a compensating action. Choreography (event-driven) or orchestration (saga manager) — Temporal/Camunda are popular orchestrators.</p>`},
            {n:335,t:"Bulkhead pattern in distributed systems?",d:["expert"],a:`<p>Isolate failures by partitioning resources per dependency. Separate thread pools (or semaphores) for each downstream service — if one service slows, it can't drain the pool used by others. Resilience4j has both <code>ThreadPoolBulkhead</code> and <code>SemaphoreBulkhead</code>.</p>`},
            {n:336,t:"Where to put circuit breaker — app or sidecar?",d:["expert"],a:`<p><strong>App-level</strong> (Resilience4j): tied to code, easy per-call tuning, language-coupled.<br><strong>Sidecar/mesh</strong> (Istio): platform-managed, language-agnostic, less code. <strong>Often both</strong>: gateway-level for coarse routing decisions, app-level for granular fallback logic.</p>`},
            {n:337,t:"Distributed tracing essentials?",d:["expert"],a:`<p>Trace ID propagated via request headers (W3C Trace Context: <code>traceparent</code>). Each operation = a span (parent/child relations). Visualizers: Jaeger, Zipkin, Datadog. Spring: <strong>Micrometer Tracing</strong> (modern, Boot 3+) replaces Sleuth. Auto-instruments REST, JDBC, Kafka.</p>`},
            {n:338,t:"Database per Microservice pattern — what and why?",d:["advanced"],a:`<p>Each microservice owns its <strong>private database</strong> — no other service can access it directly. Access is only through the service's API.</p><p><strong>Benefits:</strong></p><ul><li>Services can be developed and deployed <strong>independently</strong> — schema changes don't break other services</li><li>Each DB can <strong>scale independently</strong></li><li>Enables <strong>polyglot persistence</strong>: each service picks the best storage for its use case (e.g., product service → MongoDB for documents, shopping cart → Redis for fast key-value, orders → PostgreSQL for relational data)</li><li>If one DB goes down, only that service is affected</li></ul><p><strong>Challenges:</strong></p><ul><li>No cross-service joins — aggregate queries become more complex</li><li>Distributed transactions (solved with Saga pattern)</li><li>Data consistency across services requires eventual consistency</li></ul><p><strong>Implementation tip:</strong> Do NOT share schemas or database users between services. Use separate DB instances or at minimum separate schemas with distinct credentials.</p>`},
            {n:339,t:"Consumer-Driven Contract Testing (CDCT / Pact) — what is it?",d:["expert"],a:`<p>A testing strategy for microservices where <strong>the consumer</strong> defines what it expects from a provider service, and the provider verifies it meets those expectations.</p><p><strong>How it works:</strong></p><ol><li><strong>Consumer writes a contract</strong>: specifies the exact request it will make and the response shape it expects (usually as a JSON "pact" file)</li><li><strong>Consumer tests pass</strong>: the contract is published to a Pact Broker</li><li><strong>Provider verifies the contract</strong>: the provider runs its own tests against the contract to confirm it fulfills the consumer's expectations</li><li><strong>If provider breaks the contract</strong>: CI fails, preventing the breaking change from being deployed</li></ol><p><strong>Why use it?</strong></p><ul><li>Catches <strong>integration issues early</strong> without running expensive full end-to-end tests</li><li>Both teams collaborate on the contract upfront — fewer surprises</li><li>Replaces fragile, slow integration test environments with fast, isolated tests</li><li>Enables <strong>independent deployment</strong> — teams know they won't break each other</li></ul><p><strong>Tools:</strong> <a href="https://docs.pact.io">Pact</a> (most popular, supports Java via <code>pact-jvm</code>), Spring Cloud Contract (generates stubs from provider-defined contracts).</p><pre>// Consumer test (Pact)
@Pact(provider = "OrderService", consumer = "InventoryService")
RequestResponsePact createPact(PactDslWithProvider builder) {
    return builder
        .given("order 123 exists")
        .uponReceiving("get order 123")
        .path("/orders/123").method("GET")
        .willRespondWith().status(200)
        .body(new PactDslJsonBody().stringType("status", "CONFIRMED"))
        .toPact();
}</pre>`}
          ]
        },
        {
          id:"deploy-strategies", n:24, title:"Deployment Strategies & Soft Delete Deep Dive",
          desc:"<strong>Blue/green, canary, rolling, feature flags, hard vs soft delete patterns</strong>.",
          questions: [
            {n:338,t:"Blue/Green deployment — how it works?",d:["advanced"],a:`<p>Two identical environments: <strong>blue</strong> (current live) and <strong>green</strong> (new version). Deploy to green, smoke test. Switch traffic via load balancer / DNS. Rollback = switch back to blue.</p><p><strong>Pros</strong>: instant rollback, zero downtime. <strong>Cons</strong>: doubles infra during cutover; DB schema changes need to be backward-compatible (both versions run briefly).</p>`},
            {n:339,t:"Canary deployment?",d:["advanced"],a:`<p>Route a small % (e.g., 5%) of traffic to new version. Monitor errors, latency, business metrics. Ramp up gradually if healthy (10% → 25% → 50% → 100%). Roll back instantly if regression. Tools: Argo Rollouts, Flagger, Istio traffic splitting.</p>`},
            {n:340,t:"Rolling deployment?",d:["intermediate"],a:`<p>Replace instances/pods one (or a few) at a time. Default in Kubernetes: <code>maxSurge: 1, maxUnavailable: 0</code>. Old + new run side-by-side briefly — schema and API must be compatible. Slower than blue/green but cheaper (no double infra).</p>`},
            {n:341,t:"Canary vs A/B testing — what's different?",d:["advanced"],a:`<p><strong>Canary</strong>: validate technical health (errors, latency). Random or small % of traffic.<br><strong>A/B test</strong>: optimize a business metric (conversion). Routes by user attribute (logged-in users see variant A; anonymous see B). Different goals — sometimes confused.</p>`},
            {n:342,t:"Feature flags — why?",d:["advanced"],a:`<p>Decouple deploy from release. Code lives in production but disabled until flag flipped. Enables: gradual rollout to user segments, instant kill switch on bugs, A/B testing, dark launches. Tools: <strong>LaunchDarkly</strong>, <strong>Togglz</strong>, <strong>FF4J</strong>, <strong>Unleash</strong>.</p><pre>if (featureFlags.isEnabled("new-checkout", userId)) {
  newCheckout(...);
} else {
  legacyCheckout(...);
}</pre>`},
            {n:343,t:"GitOps — what and how?",d:["expert"],a:`<p>Git repo is the <strong>source of truth</strong> for cluster state. Operator (Argo CD, Flux) reconciles cluster with repo continuously. Every change is a PR — auditable, peer-reviewed, revertable via revert. <strong>Pull-based</strong>: cluster pulls; CI doesn't push to prod directly.</p>`},
            {n:344,t:"Hard delete pattern?",d:["beginner"],a:`<pre>repository.delete(entity);   // SQL: DELETE FROM users WHERE id = ?</pre><p>Frees storage. Irreversible. Triggers cascade if configured. Use when no audit/recovery requirement exists (e.g., test data, ephemeral logs).</p>`},
            {n:345,t:"Soft delete deep dive — implementation?",d:["advanced"],a:`<pre>@Entity
@SQLDelete(sql = "UPDATE users SET deleted_at = NOW(), " +
                 "deleted_by = ? WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")        // Hibernate 6+
@FilterDef(name = "includeSoftDeleted")
public class User {
  @Id Long id;
  Instant deletedAt;
  String deletedBy;
}</pre><p>Hibernate intercepts <code>repo.delete()</code> with the UPDATE. Restriction filters every query. <code>@FilterDef</code> can be toggled to include soft-deleted (admin views).</p>`},
            {n:346,t:"Soft delete with Spring Data Auditing?",d:["expert"],a:`<pre>@SpringBootApplication
@EnableJpaAuditing
class App { ... }

@Component
class AuditorProvider implements AuditorAware&lt;String&gt; {
  public Optional&lt;String&gt; getCurrentAuditor() {
    return Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
        .map(Authentication::getName);
  }
}

@Entity
@EntityListeners(AuditingEntityListener.class)
class User {
  @CreatedBy String createdBy;
  @CreatedDate Instant createdAt;
  @LastModifiedBy String updatedBy;
  @LastModifiedDate Instant updatedAt;
  Instant deletedAt;        // populated by service before delete
  String deletedBy;
}</pre>`},
            {n:347,t:"Cascade soft delete — challenges?",d:["expert"],a:`<p>Hibernate cascade doesn't soft-delete children automatically. Options:</p><ul><li><strong>Service-layer logic</strong>: walk children, soft-delete each (verbose but explicit)</li><li><strong>DB triggers</strong>: ON DELETE for parent updates child <code>deleted_at</code></li><li><strong>@Where on relationships</strong>: filters loaded children only</li></ul><p>Watch out: orphan children may dangle if parent is soft-deleted but children aren't.</p>`},
            {n:348,t:"Restoring from soft delete?",d:["expert"],a:`<pre>// Bypass @Where via native query
@Modifying
@Query(value = "UPDATE users SET deleted_at = NULL WHERE id = ?1",
       nativeQuery = true)
void restore(Long id);</pre><p><strong>Pitfalls</strong>: 1) Unique constraints — if email is unique, restoring fails when another user took the email. Solution: include <code>deleted_at IS NULL</code> in partial unique index. 2) Foreign key references — children may have been soft-deleted too.</p>`},
            {n:349,t:"Soft delete pitfalls + best practices?",d:["expert"],a:`<ul><li>Forgetting <code>@Where</code> on a custom query → data leak</li><li>Cascade deletes don't automatically soft-delete</li><li><strong>Partial unique index</strong>: <code>CREATE UNIQUE INDEX idx_email ON users(email) WHERE deleted_at IS NULL;</code></li><li>Index <code>deleted_at</code> for fast filtering</li><li>Tests: factory should respect soft-delete state</li><li>Provide an admin/super-admin path that includes deleted records</li><li>Plan a periodic <strong>hard purge</strong> for compliance (GDPR right to erasure)</li></ul>`}
          ]
        }
      ]
    },
    {
      label: "PART 6 · DEEP-DIVE ADVANCED",
      sections: [
        {
          id:"deep-webflux", n:25, title:"WebFlux & Async Spring — Deep Dive",
          desc:"<strong>Reactive pipelines, virtual threads vs WebFlux, @Async internals, CompletableFuture composition, event-driven patterns</strong>.",
          questions: [
            {n:350,t:"@Async — how does it work internally?",d:["advanced"],a:`<p>Spring AOP wraps the method in a proxy. The proxy submits the method body to a <code>TaskExecutor</code> and returns immediately. Caller gets <code>void</code> or <code>Future/CompletableFuture</code>. <strong>Caveats</strong>: 1) Self-invocation bypasses the proxy. 2) Bean must be injected, not <code>new</code>. 3) Exception in void async = swallowed unless you set <code>AsyncUncaughtExceptionHandler</code>.</p>`},
            {n:351,t:"Configure @Async thread pool correctly?",d:["advanced"],a:`<pre>@Bean
public Executor asyncExecutor() {
  ThreadPoolTaskExecutor ex = new ThreadPoolTaskExecutor();
  ex.setCorePoolSize(4);
  ex.setMaxPoolSize(20);
  ex.setQueueCapacity(500);
  ex.setThreadNamePrefix("async-");
  ex.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
  ex.initialize();
  return ex;
}</pre><p>Name the bean "taskExecutor" to become the default for @Async. Use multiple named executors via <code>@Async("myExecutor")</code>.</p>`},
            {n:352,t:"CompletableFuture composition patterns?",d:["advanced"],a:`<pre>// Sequential
CompletableFuture&lt;Order&gt; order = fetchUser(id)
    .thenCompose(u -&gt; fetchOrders(u.id()));

// Parallel, combine
CompletableFuture.allOf(f1, f2, f3).thenRun(() -&gt; combine(f1, f2, f3));

// First to complete
CompletableFuture.anyOf(f1, f2).thenAccept(result -&gt; handle(result));

// Error recovery
cf.exceptionally(t -&gt; fallback())
  .handle((val, t) -&gt; t != null ? fallback() : val);</pre>`},
            {n:353,t:"@TransactionalEventListener — why not @EventListener?",d:["advanced"],a:`<p>@EventListener fires <strong>during</strong> the current transaction — DB changes not yet committed. If listener reads those changes, it may not see them (different connection). @TransactionalEventListener fires <strong>AFTER_COMMIT</strong> by default — DB changes are visible. Use for email send, cache eviction, notifications that must not send on rollback.</p>`},
            {n:354,t:"Spring Application Events — custom events?",d:["intermediate"],a:`<pre>// Define
record OrderPlaced(Order order) implements ApplicationEvent {}

// Publish
applicationEventPublisher.publishEvent(new OrderPlaced(order));

// Listen (same JVM, synchronous by default)
@EventListener
public void onOrderPlaced(OrderPlaced event) { ... }

// Make async
@Async @EventListener
public void sendEmail(OrderPlaced event) { ... }</pre>`},
            {n:355,t:"Difference: sync vs async vs event-driven in Spring?",d:["advanced"],a:`<table><tr><th>Style</th><th>How</th><th>Use When</th></tr><tr><td>Sync</td><td>Direct call, same thread</td><td>Simple, low-latency, transactional</td></tr><tr><td>Async (@Async)</td><td>Thread pool, fire-and-forget or Future</td><td>Slow side-effects (email, report), parallel fan-out</td></tr><tr><td>Event-driven</td><td>ApplicationEvent or Kafka/RabbitMQ</td><td>Decoupling, cross-service, durable, replay</td></tr><tr><td>Reactive (WebFlux)</td><td>Mono/Flux, event loop</td><td>I/O bound, streaming, backpressure</td></tr></table>`},
            {n:356,t:"Virtual threads (Project Loom) with Spring Boot?",d:["expert"],a:`<pre># Spring Boot 3.2+ — enable virtual threads globally
spring.threads.virtual.enabled=true</pre><p>Each blocking request gets a cheap virtual thread (not OS thread). DB waits, HTTP calls, sleeps do NOT pin a platform thread. Result: MVC scales like WebFlux for blocking workloads without reactive code. <strong>Gotcha</strong>: synchronized blocks inside virtual threads pin a carrier thread — avoid long synchronized blocks; prefer ReentrantLock.</p>`},
            {n:357,t:"CompletableFuture vs Reactor Mono — when each?",d:["expert"],a:`<ul><li><strong>CompletableFuture</strong>: standard Java, good for composing async operations in MVC apps, simpler to learn, no backpressure.</li><li><strong>Mono/Flux</strong>: richer operators, backpressure, integrates with WebFlux, reactive data sources (R2DBC, Kafka reactive). Steeper curve.</li></ul><p>In Java 21+: CF + virtual threads is simpler and sufficiently scalable for most use cases.</p>`},
            {n:358,t:"Request scoped beans in async context?",d:["expert"],a:`<p>@RequestScope beans are stored in the HTTP request context — unavailable in async threads. Solutions: 1) Pass needed values as method parameters. 2) Use <code>DelegatingSecurityContextExecutor</code> to propagate SecurityContext. 3) <code>RequestContextHolder.setRequestAttributes(..., true)</code> (inheritable=true) for @Async threads — fragile.</p>`}
          ]
        },
        {
          id:"deep-distributed", n:26, title:"Distributed Locking, ACL & Advanced Patterns",
          desc:"<strong>Distributed lock deep-dive, ACL vs RBAC, sidecar advanced, event sourcing, outbox, two-phase commit</strong>.",
          questions: [
            {n:359,t:"Distributed lock — failure modes?",d:["expert"],a:`<ul><li><strong>Lock holder crashes</strong>: TTL expires, lock released automatically.</li><li><strong>Clock drift</strong>: TTL may expire earlier/later than intended — use generous TTLs + idempotent operations.</li><li><strong>GC pause</strong>: holder pauses &gt; TTL → lock expires, another acquires → both work concurrently. Mitigate with fencing token (monotonic counter) checked by resource.</li><li><strong>Network partition</strong>: holder can't talk to Redis; releases lock on its own — another acquires. Brief overlap possible.</li></ul>`},
            {n:360,t:"Fencing token pattern?",d:["expert"],a:`<p>When acquiring a distributed lock, get a <strong>monotonically increasing token</strong> (e.g., Redis INCR). Pass the token with every request to the protected resource. Resource rejects requests with a token lower than the last seen → protects against GC-paused holders acting after lock expired.</p>`},
            {n:361,t:"@SchedulerLock with ShedLock — Spring scheduled job coordination?",d:["expert"],a:`<pre>@Scheduled(cron = "0 0 * * * *")
@SchedulerLock(name = "reportJob", lockAtMostFor = "5m", lockAtLeastFor = "1m")
public void runReport() { ... }</pre><p>ShedLock stores lock in DB table / Redis. Exactly one instance runs across a cluster. <code>lockAtMostFor</code> = TTL (auto-release on crash). <code>lockAtLeastFor</code> = don't release early even if fast (prevents double-runs during node clock skew).</p>`},
            {n:362,t:"ACL vs RBAC vs ABAC?",d:["advanced"],a:`<table><tr><th>Model</th><th>Grant based on</th><th>Example</th><th>Scales?</th></tr><tr><td>RBAC</td><td>Role of user</td><td>ADMIN can edit all docs</td><td>✅ Simple</td></tr><tr><td>ACL</td><td>User × resource tuple</td><td>Alice can edit doc 42</td><td>⚠️ Large ACL tables</td></tr><tr><td>ABAC</td><td>Attributes of user + resource + context</td><td>Owner can edit if status=DRAFT and time=business_hours</td><td>✅ Flexible, complex policy engine</td></tr></table>`},
            {n:363,t:"Implement per-resource ownership check?",d:["advanced"],a:`<pre>@PostAuthorize("returnObject.ownerId == authentication.name")
public Document getDocument(Long id) { ... }

@PreAuthorize("@docSecurity.canEdit(authentication, #id)")
public void updateDocument(Long id, DocumentDto dto) { ... }

@Component
class DocSecurity {
  boolean canEdit(Authentication auth, Long docId) {
    Document doc = repo.findById(docId).orElseThrow();
    return doc.getOwnerId().equals(auth.getName())
        || auth.getAuthorities().stream().anyMatch(a -&gt; a.getAuthority().equals("ROLE_ADMIN"));
  }
}</pre>`},
            {n:364,t:"Outbox pattern — detail?",d:["expert"],a:`<p>Guarantee exactly-once event publish alongside a DB write. Steps: 1) Write entity + event record in SAME DB transaction. 2) Outbox poller (or CDC — Debezium) reads unpublished events. 3) Publishes to Kafka/RabbitMQ. 4) Marks event as published. <strong>If broker down</strong>: retry from outbox. <strong>If poller crashes</strong>: restart and re-publish — consumer must be idempotent.</p>`},
            {n:365,t:"Two-Phase Commit (2PC) vs saga?",d:["expert"],a:`<table><tr><th></th><th>2PC</th><th>Saga</th></tr><tr><td>Consistency</td><td>Strong (ACID across services)</td><td>Eventual</td></tr><tr><td>Coordination</td><td>Coordinator holds all locks</td><td>Each step local ACID</td></tr><tr><td>Failure</td><td>All-or-nothing block</td><td>Compensations (rollback chain)</td></tr><tr><td>Scalability</td><td>Low — blocking locks</td><td>High</td></tr><tr><td>Use today</td><td>XA — rare in microservices</td><td>Preferred for distributed txn</td></tr></table>`},
            {n:366,t:"Event sourcing pros, cons, and when to use?",d:["expert"],a:`<p><strong>Pros</strong>: Full audit log, rebuild state from events, time-travel queries, natural event-driven. <strong>Cons</strong>: Snapshots needed for large streams, eventual consistency, harder to query current state, event schema evolution is hard. <strong>When</strong>: financial transactions, audit-critical domains, complex state machines, where "what happened" is as important as "current state".</p>`},
            {n:367,t:"How to handle long-running sagas?",d:["expert"],a:`<p>Use an <strong>orchestrator</strong> (Temporal, AWS Step Functions, Camunda) rather than pure choreography. Persist saga state, so restarts resume from last known step. Idempotent steps + idempotency keys prevent double-execution on retry. Define timeout/deadline — expired saga can compensate or escalate to human review.</p>`}
          ]
        },
        {
          id:"deep-deployment", n:27, title:"Blue-Green, Canary & Deployment Deep Dive",
          desc:"<strong>Deployment strategies, K8s advanced, DB migration coordination, multi-region, chaos engineering</strong>.",
          questions: [
            {n:368,t:"Blue-green with DB schema changes?",d:["expert"],a:`<p>The hardest part. Both blue and green run against the same DB briefly. Steps:</p><ol><li><strong>Expand</strong>: add new column (nullable, no rename yet). Blue still runs fine.</li><li><strong>Migrate</strong>: dual-write (new code writes both old + new columns).</li><li><strong>Cutover</strong>: green goes live. Green only writes new column.</li><li><strong>Contract</strong>: drop old column in a later release, after blue is decommissioned.</li></ol><p>Never rename/drop in the same deploy as the code change!</p>`},
            {n:369,t:"Canary rollout — implementation in Kubernetes?",d:["expert"],a:`<pre># Two deployments, one Service with label selector weight via Istio
kubectl apply -f app-v1.yaml   # 90 replicas label: version=v1
kubectl apply -f app-v2.yaml   #  10 replicas label: version=v2

# Or Argo Rollouts
spec:
  strategy:
    canary:
      steps:
      - setWeight: 5
      - pause: {duration: 10m}
      - setWeight: 25
      - pause: {}   # manual approval</pre>`},
            {n:370,t:"Zero-downtime DB migration workflow?",d:["expert"],a:`<ol><li>Flyway/Liquibase migration runs on startup (or via CI job before deploy).</li><li>Add column nullable or with default.</li><li>Deploy new code that writes both columns.</li><li>Run data migration job (batch, off-peak).</li><li>Add NOT NULL constraint (if needed).</li><li>Remove old column in next release cycle.</li></ol><p>Key tool: <code>Flyway.baselineOnMigrate=true</code> for existing DBs.</p>`},
            {n:371,t:"Kubernetes rolling update tuning?",d:["advanced"],a:`<pre>spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # extra pod(s) allowed above desired
      maxUnavailable: 0  # no pod goes down before replacement is ready
  minReadySeconds: 10    # pod must be ready 10s before considered stable
  progressDeadlineSeconds: 300</pre><p>Combine with <strong>readinessProbe</strong> — K8s won't send traffic until ready. <strong>preStop hook</strong> + sleep ensures in-flight requests complete before SIGTERM.</p>`},
            {n:372,t:"Graceful shutdown deep dive?",d:["expert"],a:`<p>Spring Boot 2.3+ supports graceful shutdown via <code>server.shutdown=graceful</code> + <code>spring.lifecycle.timeout-per-shutdown-phase=30s</code>. Sequence: SIGTERM → stop accepting new requests → drain in-flight requests → close DB connections → exit. K8s sends SIGTERM on pod termination. Add <code>terminationGracePeriodSeconds: 60</code> in pod spec (≥ graceful timeout). Missing: <code>preStop: exec: sleep 5</code> to delay SIGTERM until iptables routes drain.</p>`},
            {n:373,t:"Multi-region deployment challenges?",d:["expert"],a:`<ul><li><strong>Data locality</strong>: user data in EU region, latency to US DB</li><li><strong>Replication lag</strong>: reads may be stale</li><li><strong>Failover</strong>: active-passive vs active-active</li><li><strong>Global routing</strong>: GeoDNS, Anycast, latency-based routing (AWS Route 53)</li><li><strong>Config differences</strong>: region-specific endpoints, feature flags</li><li><strong>Coordinated deploys</strong>: rolling across regions to avoid version skew</li></ul>`},
            {n:374,t:"Chaos engineering for Spring Boot?",d:["expert"],a:`<p>Deliberately inject failure to verify resilience. Tools: <strong>Chaos Monkey for Spring Boot</strong> (Codecentric): randomly kills beans, adds latency, throws exceptions in @Service/@Repository/@RestController. Config:</p><pre>chaos.monkey.enabled=true
chaos.monkey.assaults.latencyActive=true
chaos.monkey.assaults.latencyRangeStart=1000
chaos.monkey.assaults.exceptionsActive=true</pre><p>Also: Netflix Chaos Kong, AWS Fault Injection Simulator (FIS).</p>`},
            {n:375,t:"Health check types in Kubernetes?",d:["intermediate"],a:`<ul><li><strong>livenessProbe</strong>: is the process alive? Fail → restart pod. Use for deadlock/frozen state detection. Don't fail on downstream dependency outages — will restart-loop.</li><li><strong>readinessProbe</strong>: is it ready to serve traffic? Fail → remove from Service endpoints (no traffic). Use for warming up, dependency not ready yet.</li><li><strong>startupProbe</strong>: slow-start apps (like JVM warmup). Disables liveness until startup passes. Prevents premature kills.</li></ul><p>Spring Actuator: <code>/actuator/health/liveness</code>, <code>/actuator/health/readiness</code>.</p>`},
            {n:376,t:"JVM startup time optimization for containers?",d:["expert"],a:`<ul><li><strong>Tiered compilation</strong>: default — balance startup vs throughput</li><li><strong>CDS (Class Data Sharing)</strong>: <code>java -Xshare:dump</code> then <code>-Xshare:on</code> — share class metadata across JVMs, faster load</li><li><strong>AppCDS</strong>: application-level CDS (Java 12+)</li><li><strong>Spring AOT</strong> (Boot 3+): processes beans at build time, reduces reflection at runtime</li><li><strong>GraalVM native</strong>: sub-100ms startup, low memory — best for serverless; no JIT warmup, longer build</li><li><strong>Checkpoint / Restore</strong> (CRaC): snapshot a warm JVM, restore instantly</li></ul>`}
          ]
        },
        {
          id:"deep-security", n:28, title:"Spring Security Deep Dive",
          desc:"<strong>Filter chain internals, JWT full flow, OAuth2/OIDC, method security, CSRF, security headers</strong>.",
          questions: [
            {n:377,t:"Spring Security filter chain — how it works?",d:["advanced"],a:`<p>Security is a chain of <code>javax.servlet.Filter</code>s (a <code>FilterChainProxy</code>). Each request passes through every filter in order. Key filters: <code>SecurityContextPersistenceFilter</code> → <code>UsernamePasswordAuthenticationFilter</code> / <code>BearerTokenAuthenticationFilter</code> → <code>ExceptionTranslationFilter</code> → <code>FilterSecurityInterceptor</code>. Order matters — earlier filters can short-circuit.</p>`},
            {n:378,t:"Authentication vs Authorization in Spring Security?",d:["intermediate"],a:`<p><strong>Authentication</strong>: WHO are you? → <code>AuthenticationManager.authenticate()</code> → returns <code>Authentication</code> object stored in <code>SecurityContext</code>. Uses <code>UserDetailsService</code> + <code>PasswordEncoder</code>.<br><strong>Authorization</strong>: WHAT can you do? → <code>AccessDecisionManager</code> (or newer <code>AuthorizationManager</code>) checks roles/authorities on the authenticated principal. Can be URL-based or method-level.</p>`},
            {n:379,t:"JWT authentication full flow in Spring Boot?",d:["expert"],a:`<p><strong>Login</strong>: POST /auth/login → validate credentials → sign JWT with secret (HS256) or private key (RS256) → return token.<br><strong>Subsequent requests</strong>: client sends <code>Authorization: Bearer &lt;token&gt;</code> → <code>OncePerRequestFilter</code> extracts + validates JWT → creates <code>UsernamePasswordAuthenticationToken</code> → sets in <code>SecurityContextHolder</code> → continues filter chain.<br><strong>Validation</strong>: signature, expiry, issuer, audience claims.</p>`},
            {n:380,t:"JWT refresh token strategy?",d:["expert"],a:`<p>Short-lived access token (15 min) + long-lived refresh token (7 days) stored in HttpOnly cookie (not localStorage). Flow: access token expires → client sends refresh token → server validates, issues new access token. Refresh token rotation: issue new refresh token on each refresh, invalidate old. Revocation: store refresh token hash in DB/Redis; delete on logout.</p>`},
            {n:381,t:"OAuth2/OIDC flow in Spring Boot?",d:["expert"],a:`<pre>// Resource server (validates JWTs from identity provider)
@Bean
SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
  http.oauth2ResourceServer(oauth2 -&gt; oauth2.jwt(Customizer.withDefaults()));
  return http.build();
}

spring.security.oauth2.resourceserver.jwt.issuer-uri=https://auth.example.com</pre><p>Spring validates JWT signature using JWKS from issuer's <code>/.well-known/jwks.json</code>. For login (Authorization Code): use <code>spring-boot-starter-oauth2-client</code>.</p>`},
            {n:382,t:"CSRF — when to enable/disable?",d:["advanced"],a:`<p><strong>Enable CSRF</strong>: cookie-based session auth (browser apps) — browser auto-sends cookies; CSRF token prevents cross-origin form submissions. <strong>Disable CSRF</strong>: stateless JWT in Authorization header — custom headers can't be sent cross-origin without CORS preflight. Default: enabled. To disable: <code>http.csrf(AbstractHttpConfigurer::disable)</code>. Never disable for session-based apps.</p>`},
            {n:383,t:"Security headers Spring Boot should add?",d:["advanced"],a:`<pre>http.headers(h -&gt; h
  .httpStrictTransportSecurity(hsts -&gt; hsts.maxAgeInSeconds(31536000))
  .frameOptions(fo -&gt; fo.deny())
  .xssProtection(Customizer.withDefaults())
  .contentSecurityPolicy(csp -&gt; csp.policyDirectives(
      "default-src 'self'; script-src 'self'; frame-ancestors 'none'"
  ))
);</pre><p>Also: <code>X-Content-Type-Options: nosniff</code> (Spring adds by default).</p>`},
            {n:384,t:"401 vs 403 — exact semantics?",d:["intermediate","tricky"],a:`<p><strong>401 Unauthorized</strong>: not authenticated — who are you? Client should re-authenticate. Set <code>WWW-Authenticate</code> header. Spring: thrown by <code>AuthenticationEntryPoint</code>.<br><strong>403 Forbidden</strong>: authenticated but not permitted — you ARE known, you just can't do this. No point re-authenticating. Spring: thrown by <code>AccessDeniedHandler</code>.<br><strong>404</strong>: sometimes preferred over 403 to hide resource existence (don't reveal "you're not allowed here" — pretend it doesn't exist).</p>`},
            {n:385,t:"Method security — @PreAuthorize, @PostAuthorize, @Secured?",d:["advanced"],a:`<pre>@EnableMethodSecurity  // Boot 3+ (replaces @EnableGlobalMethodSecurity)
@Configuration class SecurityConfig { }

@PreAuthorize("hasRole('ADMIN') or #userId == authentication.name")
public User getUser(String userId) { ... }

@PostAuthorize("returnObject.ownerId == authentication.name")
public Document get(Long id) { ... }

@Secured("ROLE_ADMIN")  // simpler but no SpEL
public void delete(Long id) { ... }</pre>`}
          ]
        },
        {
          id:"deep-db", n:29, title:"Database Deep Dive — JPA Internals & Advanced",
          desc:"<strong>JPA persistence context, N+1, batch inserts, DB locking strategies, long transactions, PostgreSQL & NoSQL</strong>.",
          questions: [
            {n:386,t:"JPA persistence context — full lifecycle?",d:["expert"],a:`<p><strong>New</strong>: object created, not managed. <strong>Managed</strong>: attached to persistence context — changes tracked automatically (dirty checking). <strong>Detached</strong>: transaction closed, still has ID — use <code>merge()</code> to re-attach. <strong>Removed</strong>: marked for delete, DELETE on flush. The persistence context is a first-level cache — same entity ID within a transaction returns the same object from cache, not DB.</p>`},
            {n:387,t:"How JPA dirty checking works internally?",d:["expert"],a:`<p>On flush (before query, on commit), Hibernate compares current entity state to a <strong>snapshot</strong> taken when entity was loaded. For each changed field, generates UPDATE. Snapshot stored in <code>EntityEntry</code> per entity. Heavy: a transaction loading 1000 objects and dirtying 1 = Hibernate still checks all 1000 snapshots. Fix: <code>@DynamicUpdate</code> (only changed columns), or use <code>StatelessSession</code> for bulk ops.</p>`},
            {n:388,t:"Batch insert with JPA?",d:["expert"],a:`<pre># application.properties
spring.jpa.properties.hibernate.jdbc.batch_size=30
spring.jpa.properties.hibernate.order_inserts=true
spring.jpa.properties.hibernate.order_updates=true
# Spring Data
@Modifying @Query("INSERT INTO ... SELECT ...")  // JPQL doesn't support INSERT SELECT
// Or use JdbcTemplate.batchUpdate() for true batch</pre><p><strong>Gotcha</strong>: IDENTITY strategy disables batching — Hibernate needs the PK from DB after each insert. Use SEQUENCE strategy with <code>allocationSize &gt; 1</code> for batch-friendly ID generation.</p>`},
            {n:389,t:"DB lock types in Spring/JPA?",d:["advanced"],a:`<table><tr><th>Type</th><th>JPA</th><th>SQL</th><th>Use</th></tr><tr><td>Optimistic</td><td>@Version</td><td>None (app-level)</td><td>Low contention, reads outweigh writes</td></tr><tr><td>Pessimistic Read</td><td>PESSIMISTIC_READ</td><td>SELECT ... FOR SHARE</td><td>Prevent dirty writes, allow parallel reads</td></tr><tr><td>Pessimistic Write</td><td>PESSIMISTIC_WRITE</td><td>SELECT ... FOR UPDATE</td><td>Exclusive — no other reads or writes</td></tr><tr><td>Skip Locked</td><td>SKIP_LOCKED hint</td><td>FOR UPDATE SKIP LOCKED</td><td>Queue-like processing — skip already locked rows</td></tr></table>`},
            {n:390,t:"Long transactions — how to handle?",d:["expert"],a:`<p><strong>Problems</strong>: holds DB locks, blocks others, OOM from many managed entities, timeout errors. <strong>Solutions</strong>: 1) Break into smaller transactions via batch processing. 2) Use <code>StatelessSession</code> for bulk reads (no dirty checking, no cache). 3) Process in chunks: <code>@Transactional + paginated queries + flush/clear per batch</code>. 4) Separate read transaction from write transaction. 5) Use <code>SKIP LOCKED</code> for concurrent queue draining.</p>`},
            {n:391,t:"Too many DB operations in one transaction — how to handle?",d:["expert"],a:`<pre>@Transactional
public void processBatch(List&lt;Long&gt; ids) {
  int batchSize = 50;
  for (int i = 0; i &lt; ids.size(); i++) {
    processOne(ids.get(i));          // update/save
    if (i % batchSize == 0) {
      entityManager.flush();         // write to DB
      entityManager.clear();         // detach all — free memory
    }
  }
}
// + configure: hibernate.jdbc.batch_size=50, order_updates=true</pre><p>flush()+clear() periodically frees the first-level cache and triggers batch writes.</p>`},
            {n:392,t:"PostgreSQL-specific features with Spring?",d:["advanced"],a:`<ul><li><code>@Type(PostgreSQLEnumType)</code> — map PG native ENUM</li><li>JSONB column: <code>@Column(columnDefinition = "jsonb")</code> with custom converter</li><li>Array type via <code>@Array</code> (Hibernate 6+)</li><li>Full-text search: <code>nativeQuery = true</code> + <code>to_tsvector</code> / <code>plainto_tsquery</code></li><li>LISTEN/NOTIFY: PostgreSQL pub-sub via JDBC <code>PGConnection</code></li><li>Advisory locks: <code>SELECT pg_try_advisory_lock(key)</code> for application-level mutex</li></ul>`},
            {n:393,t:"Spring Data with NoSQL databases?",d:["advanced"],a:`<table><tr><th>DB</th><th>Spring Data Module</th><th>Key difference</th></tr><tr><td>MongoDB</td><td>spring-data-mongodb</td><td>Document model, flexible schema, @Document, @DBRef</td></tr><tr><td>Redis</td><td>spring-data-redis</td><td>Key-value, ReactiveRedisTemplate, @RedisHash</td></tr><tr><td>Cassandra</td><td>spring-data-cassandra</td><td>Wide-column, partition key design critical, no joins</td></tr><tr><td>Elasticsearch</td><td>spring-data-elasticsearch</td><td>Search engine, @Document, QueryBuilders</td></tr><tr><td>DynamoDB</td><td>Enhanced SDK / community</td><td>AWS managed, partition+sort key, item-based</td></tr></table>`},
            {n:394,t:"Choosing between SQL and NoSQL for a Spring service?",d:["advanced"],a:`<p><strong>Use SQL (PostgreSQL/MySQL)</strong>: complex relationships, ACID transactions, reporting/analytics, structured data with known schema, small-medium scale.<br><strong>Use NoSQL (MongoDB)</strong>: flexible/evolving schema, document-centric data, rapid iteration, nested structures, moderate scale.<br><strong>Use Redis</strong>: cache, sessions, leaderboards, rate limiting, pub-sub.<br><strong>Use Cassandra</strong>: write-heavy, time-series, high availability across regions, massive scale.</p>`}
          ]
        }
      ]
    }
  ]
};
