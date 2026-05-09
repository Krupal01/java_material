/* =========================================================
   Spring Advanced — Security, AOP, Caching, Async, Testing
   Deeply explained for experienced developers.
   ========================================================= */
window.SPRING_ADV_DATA = {
  parts: [
    {
      label: "PART 1 · SPRING SECURITY — DEEP DIVE",
      sections: [
        {
          id: "security-deep", n: 1, title: "Spring Security — Filter Chain & Authentication",
          desc: "How Spring Security actually works: the <strong>filter chain, authentication pipeline, and JWT implementation</strong> from first principles.",
          questions: [
            {n:1, t:"How does the Spring Security filter chain work? Walk through every step.", d:["intermediate","advanced"], a:`
<p>Spring Security is fundamentally a chain of Servlet Filters that process every HTTP request. Understanding this architecture is essential for debugging security issues.</p>

<h4>The Architecture — Security as a Filter Chain</h4>
<pre>
HTTP Request
     │
     ▼
┌────────────────────────────────────────────────────┐
│  DelegatingFilterProxy (in Servlet container)      │
│  Bridges Servlet filter to Spring context          │
└────────────────────────────────────────────────────┘
     │
     ▼
┌────────────────────────────────────────────────────┐
│  FilterChainProxy (Spring Security's manager)      │
│  Decides WHICH SecurityFilterChain to use          │
│  (You can have multiple chains for different URLs) │
└────────────────────────────────────────────────────┘
     │
     ▼ (delegating to your SecurityFilterChain)
┌────────────────────────────────────────────────────┐
│  Security Filters (ordered, each runs in sequence) │
│                                                    │
│  1. DisableEncodeUrlFilter                         │
│  2. WebAsyncManagerIntegrationFilter               │
│  3. SecurityContextPersistenceFilter               │
│     └─ Loads SecurityContext from session/store    │
│  4. HeaderWriterFilter (adds security headers)     │
│  5. CorsFilter (handles CORS preflight)            │
│  6. CsrfFilter (validates CSRF tokens)             │
│  7. LogoutFilter (processes /logout)               │
│  8. UsernamePasswordAuthenticationFilter           │
│     └─ Processes form login POST requests          │
│  9. BearerTokenAuthenticationFilter (JWT/OAuth2)   │
│     └─ Extracts &amp; validates Bearer tokens         │
│  10. RequestCacheAwareFilter                       │
│  11. SecurityContextHolderAwareRequestFilter       │
│  12. AnonymousAuthenticationFilter                 │
│      └─ Sets "anonymous" if no auth yet            │
│  13. SessionManagementFilter                       │
│  14. ExceptionTranslationFilter                    │
│      ├─ 401 → calls AuthenticationEntryPoint       │
│      └─ 403 → calls AccessDeniedHandler            │
│  15. AuthorizationFilter                           │
│      └─ Checks if current user is allowed          │
│                                                    │
└────────────────────────────────────────────────────┘
     │
     ▼
  DispatcherServlet (your controllers run here)
</pre>

<h4>Configuring the Filter Chain (Spring Boot 3.x)</h4>
<pre>@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    SecurityFilterChain apiSecurityChain(HttpSecurity http) throws Exception {
        return http
            // URL authorization rules:
            .authorizeHttpRequests(auth -&gt; auth
                .requestMatchers("/auth/**", "/public/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/products/**").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/reports/**").hasAnyRole("ADMIN", "ANALYST")
                .anyRequest().authenticated()  // all others need login
            )
            // Stateless API: no sessions, JWT only
            .sessionManagement(s -&gt; s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // JWT validation instead of form login:
            .oauth2ResourceServer(oauth2 -&gt; oauth2.jwt(Customizer.withDefaults()))
            // Disable CSRF for stateless API (JWT in header, not cookie):
            .csrf(AbstractHttpConfigurer::disable)
            // Custom 401/403 handling:
            .exceptionHandling(ex -&gt; ex
                .authenticationEntryPoint((req, res, e) -&gt; {
                    res.setStatus(401);
                    res.setContentType("application/json");
                    res.getWriter().write("{\"error\":\"Authentication required\"}");
                })
                .accessDeniedHandler((req, res, e) -&gt; {
                    res.setStatus(403);
                    res.setContentType("application/json");
                    res.getWriter().write("{\"error\":\"Insufficient privileges\"}");
                })
            )
            .build();
    }

    // You can have MULTIPLE chains — higher @Order runs first
    // If requestMatcher matches, processing stops at that chain
    @Bean
    @Order(1)  // runs BEFORE the main chain above
    SecurityFilterChain actuatorChain(HttpSecurity http) throws Exception {
        return http
            .securityMatcher("/actuator/**")  // only applies to /actuator/**
            .authorizeHttpRequests(auth -&gt; auth
                .requestMatchers("/actuator/health").permitAll()
                .anyRequest().hasRole("OPS")
            )
            .httpBasic(Customizer.withDefaults())  // basic auth for ops tools
            .build();
    }
}</pre>

<h4>SecurityContextHolder — Where the Authenticated User Lives</h4>
<pre>// After successful authentication, Spring stores the Authentication object here:
Authentication auth = SecurityContextHolder.getContext().getAuthentication();
String username = auth.getName();
Collection&lt;GrantedAuthority&gt; roles = auth.getAuthorities();

// In a controller, use @AuthenticationPrincipal for convenience:
@GetMapping("/profile")
public UserDto getProfile(@AuthenticationPrincipal UserDetails user) {
    return userService.findByEmail(user.getUsername());
}

// Or with JWT claims (custom principal):
@GetMapping("/profile")
public UserDto getProfile(@AuthenticationPrincipal Jwt jwt) {
    String userId = jwt.getClaimAsString("sub");
    String email = jwt.getClaimAsString("email");
    return userService.findById(userId);
}

// SecurityContextHolder is ThreadLocal by default:
// - Works fine for traditional servlet stack (one thread per request)
// - Problem with @Async: async threads don't inherit the SecurityContext
// Fix: use DelegatingSecurityContextExecutor or @EnableAsync + proper config</pre>`},

            {n:2, t:"Implement JWT authentication from scratch — the complete flow.", d:["advanced"], a:`
<p>JWT authentication is the standard for stateless REST APIs. Here's the complete, production-ready implementation.</p>

<h4>JWT Structure</h4>
<pre>// A JWT looks like: xxxxx.yyyyy.zzzzz
// Three parts, Base64URL encoded, separated by dots:

// HEADER (algorithm + type):
{
  "alg": "HS256",   // signing algorithm (HS256=HMAC-SHA256, RS256=RSA)
  "typ": "JWT"
}

// PAYLOAD (claims — your data):
{
  "sub": "user-12345",          // subject (user ID)
  "email": "user@example.com",
  "roles": ["ROLE_USER", "ROLE_ADMIN"],
  "iat": 1716000000,            // issued at (Unix timestamp)
  "exp": 1716003600,            // expires at (1 hour from iat)
  "iss": "https://myapp.com"    // issuer
}

// SIGNATURE:
// HMAC-SHA256(base64(header) + "." + base64(payload), secretKey)
// If anyone modifies the payload, signature check fails → rejected</pre>

<h4>Step 1 — Add Dependency</h4>
<pre>&lt;dependency&gt;
    &lt;groupId&gt;io.jsonwebtoken&lt;/groupId&gt;
    &lt;artifactId&gt;jjwt-api&lt;/artifactId&gt;
    &lt;version&gt;0.12.3&lt;/version&gt;
&lt;/dependency&gt;
&lt;dependency&gt;
    &lt;groupId&gt;io.jsonwebtoken&lt;/groupId&gt;
    &lt;artifactId&gt;jjwt-impl&lt;/artifactId&gt;
    &lt;version&gt;0.12.3&lt;/version&gt;
    &lt;scope&gt;runtime&lt;/scope&gt;
&lt;/dependency&gt;</pre>

<h4>Step 2 — JwtService (Token Creation &amp; Validation)</h4>
<pre>@Service
public class JwtService {

    @Value("\${jwt.secret}")  // 256-bit minimum for HS256
    private String secret;

    @Value("\${jwt.expiry-minutes:60}")
    private int expiryMinutes;

    private SecretKey signingKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(UserDetails user) {
        return generateToken(user, Map.of());  // no extra claims
    }

    public String generateToken(UserDetails user, Map&lt;String, Object&gt; extraClaims) {
        Instant now = Instant.now();
        List&lt;String&gt; roles = user.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .toList();

        return Jwts.builder()
            .subject(user.getUsername())
            .issuedAt(Date.from(now))
            .expiration(Date.from(now.plus(expiryMinutes, ChronoUnit.MINUTES)))
            .claim("roles", roles)
            .claims(extraClaims)
            .signWith(signingKey())
            .compact();
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parser()
            .verifyWith(signingKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
        // Throws ExpiredJwtException if expired
        // Throws SignatureException if signature is invalid
        // Throws MalformedJwtException if format is wrong
    }

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public boolean isTokenValid(String token, UserDetails user) {
        try {
            Claims claims = extractAllClaims(token);
            boolean notExpired = claims.getExpiration().after(new Date());
            boolean usernameMatches = claims.getSubject().equals(user.getUsername());
            return notExpired &amp;&amp; usernameMatches;
        } catch (JwtException e) {
            return false;  // expired, invalid signature, malformed, etc.
        }
    }
}</pre>

<h4>Step 3 — JWT Filter (Validates Token on Every Request)</h4>
<pre>@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Extract token from Authorization header
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);  // no token, skip
            return;
        }
        String token = authHeader.substring(7);  // remove "Bearer "

        // 2. Extract username from token
        String username;
        try {
            username = jwtService.extractUsername(token);
        } catch (JwtException e) {
            // Invalid/malformed token — let ExceptionTranslationFilter handle it
            filterChain.doFilter(request, response);
            return;
        }

        // 3. If username found AND not yet authenticated in this request:
        if (username != null &amp;&amp; SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails user = userDetailsService.loadUserByUsername(username);

            if (jwtService.isTokenValid(token, user)) {
                // 4. Create authentication token
                UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                        user,                   // principal
                        null,                   // credentials (not needed after auth)
                        user.getAuthorities()   // roles/permissions
                    );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 5. Set in SecurityContext — user is now authenticated!
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);  // continue filter chain
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // Skip this filter for public endpoints — performance optimization
        String path = request.getServletPath();
        return path.startsWith("/auth/") || path.startsWith("/public/");
    }
}

// Register the filter BEFORE UsernamePasswordAuthenticationFilter:
// In SecurityConfig:
// http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);</pre>

<h4>Step 4 — Auth Controller (Login Endpoint)</h4>
<pre>@RestController
@RequestMapping("/auth")
class AuthController {
    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        // 1. Authenticate (checks username/password against DB)
        try {
            Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.email(),
                    request.password()
                )
            );
        } catch (BadCredentialsException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        // 2. Load user details
        UserDetails user = userDetailsService.loadUserByUsername(request.email());

        // 3. Generate JWT
        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateToken(user,
            Map.of("type", "refresh"),
            Duration.ofDays(7));

        return new AuthResponse(accessToken, refreshToken);
    }
}

public record LoginRequest(@NotBlank @Email String email, @NotBlank String password) {}
public record AuthResponse(String accessToken, String refreshToken) {}</pre>

<h4>Refresh Token Strategy</h4>
<pre>// Why refresh tokens?
// - Access tokens: short-lived (15-60 min), used for API calls
// - Refresh tokens: long-lived (7-30 days), stored securely, used ONLY to get new access tokens
// - If access token is stolen, attacker has limited window
// - Logout = invalidate refresh token in DB (no need to invalidate access token — it'll expire)

// In database: store refresh tokens with hashing
@Entity
class RefreshToken {
    @Id UUID id;
    String tokenHash;           // bcrypt hash, not plaintext!
    String userId;
    Instant expiresAt;
    boolean revoked;
}

@PostMapping("/refresh")
public AuthResponse refresh(@RequestBody RefreshRequest request) {
    // 1. Validate refresh token (check DB, not expired, not revoked)
    RefreshToken storedToken = refreshTokenService.validate(request.refreshToken());

    // 2. Issue new access token
    UserDetails user = userDetailsService.loadUserByUsername(storedToken.getUserId());
    String newAccessToken = jwtService.generateToken(user);

    // 3. Rotate refresh token (invalidate old, create new)
    String newRefreshToken = refreshTokenService.rotate(storedToken);

    return new AuthResponse(newAccessToken, newRefreshToken);
}</pre>`},

            {n:3, t:"Method-level security — @PreAuthorize, @PostAuthorize, and SpEL expressions.", d:["advanced"], a:`
<p>Method security lets you enforce access control at the business logic level, not just at the URL level. This is essential for fine-grained authorization.</p>

<h4>Enabling Method Security</h4>
<pre>@Configuration
@EnableMethodSecurity  // Spring Boot 3+ (replaces @EnableGlobalMethodSecurity)
public class SecurityConfig {
    // prePostEnabled = true by default with @EnableMethodSecurity
    // securedEnabled = false by default (use @Secured annotation)
    // jsr250Enabled = false by default (use @RolesAllowed annotation)
}</pre>

<h4>@PreAuthorize — Check Before Method Executes</h4>
<pre>@Service
public class UserService {

    // Simple role check:
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(Long userId) {
        userRepo.deleteById(userId);
    }

    // Check against method argument:
    @PreAuthorize("#userId == authentication.principal.id or hasRole('ADMIN')")
    // ↑ "You can only access your own data, OR you're an admin"
    public UserProfile getProfile(Long userId) {
        return userRepo.findById(userId).orElseThrow();
    }

    // Check against argument field:
    @PreAuthorize("#request.organizationId == authentication.principal.organizationId")
    public Report generateReport(ReportRequest request) {
        // Only users in the same org can generate reports for that org
    }

    // Multiple conditions:
    @PreAuthorize("hasRole('MANAGER') and #department == authentication.principal.department")
    public List&lt;Employee&gt; getDepartmentEmployees(String department) { ... }

    // SpEL with bean method call:
    @PreAuthorize("@userPermissionEvaluator.canEdit(authentication, #documentId)")
    public void updateDocument(Long documentId, DocumentRequest req) { ... }
}

// Custom permission evaluator bean:
@Component("userPermissionEvaluator")
public class UserPermissionEvaluator {
    public boolean canEdit(Authentication auth, Long documentId) {
        Document doc = documentRepo.findById(documentId).orElseThrow();
        String username = auth.getName();
        return doc.getOwnerId().equals(username)
            || auth.getAuthorities().stream()
                   .anyMatch(a -&gt; a.getAuthority().equals("ROLE_ADMIN"));
    }
}</pre>

<h4>@PostAuthorize — Check After Method Returns (Access Returned Value)</h4>
<pre>// Useful when you need to check properties of the result
// The method RUNS first, then the authorization check happens

@PostAuthorize("returnObject.ownerId == authentication.name")
public Document getDocument(Long id) {
    return documentRepo.findById(id).orElseThrow();
    // Method runs → fetches document → THEN checks if caller owns it
    // If check fails → throws AccessDeniedException (403)
    // ⚠️ Less efficient: runs the method even if will be denied
    // ✅ Necessary when you need the returned object to make the decision
}

// Filtering a list:
@PostFilter("filterObject.ownerId == authentication.name")
public List&lt;Document&gt; getAllDocuments() {
    return documentRepo.findAll();
    // Fetches ALL documents, then FILTERS OUT ones not owned by current user
    // Only returns documents where ownerId matches current user
}</pre>

<h4>@PreFilter — Filter Input Collection Before Method Runs</h4>
<pre>@PreFilter("filterObject.status == 'PENDING'")
public void processOrders(List&lt;Order&gt; orders) {
    // 'orders' only contains PENDING ones — others filtered out before this runs
}</pre>

<h4>Common SpEL Expressions Reference</h4>
<pre>// Authentication object reference:
authentication.name                          // username (principal.username)
authentication.principal                     // full UserDetails object
authentication.principal.id                  // if you have a custom UserDetails with id field
authentication.authorities                   // collection of GrantedAuthority

// Role/authority checks:
hasRole('ADMIN')                            // checks for ROLE_ADMIN (prefix added automatically)
hasAuthority('ROLE_ADMIN')                  // exact authority string
hasAnyRole('ADMIN', 'MANAGER')
hasAnyAuthority('ROLE_ADMIN', 'ROLE_MANAGER')
isAuthenticated()                           // true if not anonymous
isAnonymous()
isFullyAuthenticated()                      // authenticated + not via "remember me"
permitAll()
denyAll()

// Parameter access:
#parameterName                              // value of a method parameter
#parameterName.fieldName                    // field of a parameter object
#parameterName?.fieldName                   // null-safe access

// Return value (in @PostAuthorize):
returnObject                                // the object returned by the method
returnObject.fieldName                      // a field of the returned object</pre>`}
          ]
        }
      ]
    },
    {
      label: "PART 2 · AOP — ASPECT-ORIENTED PROGRAMMING",
      sections: [
        {
          id: "aop-deep", n: 2, title: "AOP — From Concepts to Production Patterns",
          desc: "How AOP works <strong>under the hood</strong>, and how to write production-quality aspects for logging, metrics, security, and more.",
          questions: [
            {n:4, t:"AOP explained from first principles — what problem does it solve?", d:["intermediate"], a:`
<p>AOP solves the problem of <strong>cross-cutting concerns</strong> — functionality that cuts across multiple unrelated modules and can't be cleanly separated using OOP alone.</p>

<h4>The Problem Without AOP</h4>
<pre>// Without AOP: every service method needs the same boilerplate
@Service
class OrderService {
    public Order placeOrder(OrderRequest req) {
        // ❌ Logging (not core business logic)
        log.info("Entering placeOrder with: {}", req);
        long start = System.nanoTime();

        // ❌ Security check (not core business logic)
        if (!currentUser.hasPermission("PLACE_ORDER")) {
            throw new AccessDeniedException("...");
        }

        // ❌ Transaction management (not core business logic)
        transaction.begin();
        try {
            // ✅ ACTUAL business logic — just these 3 lines!
            inventoryService.reserve(req.items());
            paymentService.charge(req.payment());
            Order order = orderRepo.save(new Order(req));

            transaction.commit();
            // ❌ More boilerplate
            log.info("placeOrder completed in {}ms", (System.nanoTime()-start)/1_000_000);
            return order;
        } catch (Exception e) {
            transaction.rollback();
            log.error("placeOrder failed", e);
            throw e;
        }
    }
    // Repeat this boilerplate for every method in every service!
}

// With AOP: your service is clean
@Service
class OrderService {
    @Transactional     // ← AOP handles this
    @Audited           // ← AOP handles this
    @Timed             // ← AOP handles this
    public Order placeOrder(OrderRequest req) {
        // ✅ Pure business logic ONLY
        inventoryService.reserve(req.items());
        paymentService.charge(req.payment());
        return orderRepo.save(new Order(req));
    }
}</pre>

<h4>AOP Terminology — Clear Definitions</h4>
<pre>
JoinPoint:  A point during program execution where an aspect can be applied.
            Spring AOP supports only METHOD EXECUTION join points.
            (AspectJ supports field access, constructor calls, etc. too)

Pointcut:   An expression that matches (selects) a set of join points.
            "Apply this advice to all methods in com.app.service.*"

Advice:     Code that runs at a matched join point.
            @Before, @After, @Around, @AfterReturning, @AfterThrowing

Aspect:     A class that packages pointcuts + advice together.

Weaving:    The process of applying aspects to target code.
            Spring AOP: runtime weaving via proxies
            AspectJ: compile-time or load-time weaving
</pre>

<h4>Types of Advice — When Each Runs</h4>
<pre>@Aspect
@Component
public class OrderAspect {

    // @Before — runs BEFORE the method, can't prevent execution (use @Around for that)
    @Before("execution(* com.app.service.OrderService.*(..))")
    public void logMethodEntry(JoinPoint jp) {
        log.info("Entering: {} with args: {}",
            jp.getSignature().getName(),
            Arrays.toString(jp.getArgs()));
    }

    // @AfterReturning — runs AFTER successful return, can access return value
    @AfterReturning(pointcut = "execution(* com.app.service.OrderService.*(..))",
                    returning = "result")
    public void logMethodReturn(JoinPoint jp, Object result) {
        log.info("Returning from: {} with result: {}", jp.getSignature().getName(), result);
    }

    // @AfterThrowing — runs only when an exception is thrown
    @AfterThrowing(pointcut = "execution(* com.app.service.OrderService.*(..))",
                   throwing = "ex")
    public void logMethodException(JoinPoint jp, Exception ex) {
        log.error("Exception in: {}: {}", jp.getSignature().getName(), ex.getMessage());
    }

    // @After — runs ALWAYS (like finally), regardless of success or exception
    @After("execution(* com.app.service.OrderService.*(..))")
    public void cleanupAfterMethod(JoinPoint jp) {
        // Always runs — cleanup, close resources, etc.
        MDC.remove("requestId");
    }

    // @Around — MOST POWERFUL: wraps the method, you control if/when it runs
    @Around("execution(* com.app.service.OrderService.*(..))")
    public Object measurePerformance(ProceedingJoinPoint pjp) throws Throwable {
        long start = System.nanoTime();
        try {
            Object result = pjp.proceed();  // ← calls the actual method
            // Can modify the result here!
            return result;
        } catch (Exception e) {
            // Can modify/suppress exceptions here!
            throw e;
        } finally {
            long ms = (System.nanoTime() - start) / 1_000_000;
            log.info("{} took {}ms", pjp.getSignature().toShortString(), ms);
        }
    }
}</pre>

<h4>Pointcut Expressions — Full Reference</h4>
<pre>// execution() — most common, matches method execution
execution(modifiers? return-type declaring-type?.method-name(params) throws?)

execution(* com.app.service.*.*(..))         // Any method, any class in service package
execution(public * com.app.*.*(..))          // Any public method in com.app
execution(* com.app..*.*(..))               // Any method in com.app and sub-packages (.. = recursive)
execution(* com.app.OrderService.place*(..)) // Methods starting with "place" in OrderService
execution(* com.app.OrderService.*(Long, ..)) // Methods with Long as first arg

// @annotation() — matches when method HAS this annotation
@annotation(org.springframework.transaction.annotation.Transactional)
@annotation(com.app.annotation.Audited)

// @within() — matches when CLASS has this annotation
@within(org.springframework.stereotype.Service)

// within() — matches all methods in a type
within(com.app.service.OrderService)
within(com.app.service..*)  // all classes in service package and subpackages

// args() — matches based on argument types
args(Long, String)          // methods with exactly (Long, String) args
args(Long, ..)              // methods where first arg is Long

// Combining with logical operators:
@Pointcut("@annotation(com.app.annotation.Retry) &amp;&amp; !@annotation(com.app.annotation.NoRetry)")
public void retryableMethod() {}

@Pointcut("within(com.app.service..*) &amp;&amp; execution(public * *(..))")
public void publicServiceMethod() {}

@Around("publicServiceMethod() &amp;&amp; @annotation(retryConfig)")
public Object withRetry(ProceedingJoinPoint pjp, Retry retryConfig) throws Throwable {
    // retryConfig bound from the annotation — access its attributes directly!
    for (int attempt = 0; attempt &lt;= retryConfig.maxAttempts(); attempt++) {
        try { return pjp.proceed(); }
        catch (Exception e) {
            if (attempt == retryConfig.maxAttempts()) throw e;
            Thread.sleep(retryConfig.delayMs());
        }
    }
    return null;  // never reached
}</pre>

<h4>The Self-Invocation Problem — Must Know for Interviews</h4>
<pre>@Service
public class OrderService {
    @Transactional
    public void processOrder(Long orderId) {
        Order order = orderRepo.findById(orderId).orElseThrow();
        sendNotification(order);   // ❌ @Async on sendNotification is IGNORED!
        // this.sendNotification(order) ← explicit this makes it obvious
        // When you call 'this.method()', you bypass the AOP proxy!
    }

    @Async  // This @Async has NO effect when called from processOrder above
    public void sendNotification(Order order) {
        emailService.send(order.getCustomerEmail(), ...);
    }
}
// WHY: Spring wraps OrderService in a proxy.
// External calls go through the proxy → AOP works.
// Internal this.xxx() calls go DIRECTLY to the class → bypass proxy → AOP ignored.

// FIX 1: Extract sendNotification to a separate @Service
@Service
class NotificationService {
    @Async
    public void sendNotification(Order order) { ... }
}
// Inject NotificationService and call notificationService.sendNotification(order) ✅

// FIX 2: Self-inject (ugly but works)
@Service
class OrderService {
    @Autowired @Lazy
    private OrderService self;  // injected proxy of itself

    public void processOrder(Long orderId) {
        self.sendNotification(order);  // calls through proxy → @Async works!
    }
    @Async
    public void sendNotification(Order order) { ... }
}</pre>`}
          ]
        }
      ]
    },
    {
      label: "PART 3 · CACHING, ASYNC & EVENTS",
      sections: [
        {
          id: "caching-deep", n: 3, title: "Caching — Strategy, Implementation & Pitfalls",
          desc: "Spring Cache abstraction, <strong>when to cache, what to cache, and the subtle bugs</strong> that kill performance.",
          questions: [
            {n:5, t:"Spring Cache — @Cacheable, @CacheEvict, @CachePut — explained deeply.", d:["beginner","intermediate"], a:`
<p>Caching is one of the most impactful performance improvements you can make. Spring's cache abstraction lets you add caching with annotations while keeping your code cache-technology agnostic.</p>

<h4>The Three Core Annotations</h4>
<pre>@Service
@CacheConfig(cacheNames = "users")  // default cache name for all methods in class
public class UserService {

    // @Cacheable — Check cache first; if miss, call method and store result
    @Cacheable(
        value = "users",              // cache name (required)
        key = "#id",                  // cache key (default = all args combined)
        condition = "#id != null",    // only cache if this SpEL is true
        unless = "#result == null"    // don't cache if result is null
    )
    public User findById(Long id) {
        // ⭐ This body ONLY runs on cache MISS
        // On cache HIT: Spring returns the cached value without entering this method
        return userRepo.findById(id).orElse(null);
    }

    // @CachePut — ALWAYS run method AND update cache with result
    // Use for: after creating or updating an entity
    @CachePut(value = "users", key = "#result.id")
    public User save(User user) {
        User saved = userRepo.save(user);
        // ⭐ Method ALWAYS runs, result is stored in cache
        // Different from @Cacheable which skips the method on hit
        return saved;
    }

    // @CacheEvict — Remove entry from cache
    @CacheEvict(value = "users", key = "#id")
    public void delete(Long id) {
        userRepo.deleteById(id);
        // ⭐ After this method runs, users::{id} is removed from cache
    }

    // Clear entire cache:
    @CacheEvict(value = "users", allEntries = true)
    public void deleteAll() {
        userRepo.deleteAll();
        // All entries in "users" cache cleared
    }

    // Evict before method runs (rare, use when method's precondition requires fresh data):
    @CacheEvict(value = "users", key = "#id", beforeInvocation = true)
    public User refresh(Long id) { ... }
}

// ⚠️ Remember: self-invocation problem applies to cache too!
// @Cacheable on a method called from the SAME class won't work.
// The call must come from OUTSIDE the class (through the proxy).</pre>

<h4>Composite Annotation — @Caching</h4>
<pre>// Sometimes you need to evict multiple caches at once:
@Caching(evict = {
    @CacheEvict(value = "users", key = "#user.id"),
    @CacheEvict(value = "user-summaries", allEntries = true),
    @CacheEvict(value = "dashboard-stats", allEntries = true)
})
public User updateUser(User user) {
    return userRepo.save(user);
}</pre>

<h4>Cache Key Strategies</h4>
<pre>// Default key = SimpleKey.EMPTY (if no args) or SimpleKey(all args)
@Cacheable("products")
public Product find(Long id) { ... }  // key: SimpleKey(id)

// Explicit key with SpEL:
@Cacheable(value = "products", key = "#id")
public Product find(Long id) { ... }  // key: just the id value

// Composite key:
@Cacheable(value = "products", key = "#category + ':' + #page")
public List&lt;Product&gt; findByCategory(String category, int page) { ... }
// key: "electronics:0", "electronics:1", etc.

// Key from object field:
@Cacheable(value = "reports", key = "#request.reportType + '_' + #request.from + '_' + #request.to")
public Report generate(ReportRequest request) { ... }

// Custom KeyGenerator bean:
@Component("tenantAwareKeyGenerator")
public class TenantAwareKeyGenerator implements KeyGenerator {
    @Override
    public Object generate(Object target, Method method, Object... params) {
        // Include tenant ID in cache key for multi-tenant apps
        String tenantId = TenantContext.getCurrentTenantId();
        return tenantId + ":" + Arrays.deepHashCode(params);
    }
}

@Cacheable(value = "users", keyGenerator = "tenantAwareKeyGenerator")
public User findById(Long id) { ... }
// key: "tenant-123:42"</pre>

<h4>Cache Providers — Choosing the Right One</h4>
<pre>// 1. Caffeine (in-memory, single JVM — fastest)
spring.cache.type=caffeine
spring.cache.caffeine.spec=maximumSize=1000,expireAfterWrite=10m,recordStats

// Best for: single-instance apps, hot data that rarely changes, read-heavy workloads
// Not for: multi-instance apps (each instance has its own cache — inconsistency risk)

// 2. Redis (distributed — shared across instances)
spring.cache.type=redis
spring.cache.redis.time-to-live=600000  # 10 minutes in milliseconds

// Best for: multi-instance apps, shared session data, rate limiting
// Not for: single-instance apps where Caffeine would be simpler and faster

// Custom per-cache TTL with Redis:
@Bean
CacheManager cacheManager(RedisConnectionFactory connectionFactory) {
    RedisCacheConfiguration defaults = RedisCacheConfiguration.defaultCacheConfig()
        .serializeValuesWith(RedisSerializationContext.SerializationPair
            .fromSerializer(new GenericJackson2JsonRedisSerializer()))
        .entryTtl(Duration.ofMinutes(10));

    Map&lt;String, RedisCacheConfiguration&gt; configs = new HashMap&lt;&gt;();
    configs.put("users", defaults.entryTtl(Duration.ofMinutes(30)));
    configs.put("products", defaults.entryTtl(Duration.ofHours(1)));
    configs.put("sessions", defaults.entryTtl(Duration.ofHours(24)));
    configs.put("feature-flags", defaults.entryTtl(Duration.ofSeconds(30)));

    return RedisCacheManager.builder(connectionFactory)
        .cacheDefaults(defaults)
        .withInitialCacheConfigurations(configs)
        .build();
}</pre>

<h4>Common Cache Pitfalls</h4>
<pre>// Pitfall 1: Caching entities with lazy-loaded collections
@Cacheable("orders")
public Order findOrder(Long id) {
    return orderRepo.findById(id).get();  // ❌ Serializing a lazy proxy!
    // When serializing to Redis, Hibernate lazy proxy may not be initialized
    // → LazyInitializationException or proxy stub serialized to cache
}
// Fix: Use DTOs (not entities) for caching:
@Cacheable("orders")
public OrderDto findOrder(Long id) {
    Order order = orderRepo.findByIdWithItems(id);  // eager fetch
    return OrderDto.from(order);  // convert to plain DTO — safe to serialize
}

// Pitfall 2: Cached null (stale absence)
@Cacheable("products")
public Product findByCode(String code) {
    return productRepo.findByCode(code).orElse(null);  // null stored in cache!
    // Second call with same code: returns null from cache, even if product was added
}
// Fix: use unless="#result == null" or use Optional
@Cacheable(value = "products", unless = "#result == null")
public Product findByCode(String code) { ... }

// Pitfall 3: Cache stampede (thundering herd)
// On cache expiry of a popular key, all threads try to recompute simultaneously
// → DB hammered with 100s of identical queries

// Fix: sync=true (only one thread computes, others wait)
@Cacheable(value = "popular-products", sync = true)
public List&lt;Product&gt; getTopProducts() { ... }  // Only one thread calls DB, rest wait

// Fix for Redis: probabilistic early expiry or Redis locking pattern</pre>`},

            {n:6, t:"@Async internals — how it works, thread pool configuration, and gotchas.", d:["intermediate","advanced"], a:`
<p>@Async makes methods run on a different thread. Understanding the internals prevents the subtle bugs that commonly appear with async code.</p>

<h4>How @Async Works Internally</h4>
<pre>// When you annotate a method with @Async, Spring:
// 1. Creates an AOP proxy for the bean (if not already proxied)
// 2. The proxy intercepts the @Async method call
// 3. Submits the method body to a thread pool
// 4. Returns immediately to the caller (with a Future/void)

// Your @Service:
@Service
public class EmailService {
    @Async
    public CompletableFuture&lt;Void&gt; sendWelcomeEmail(String email) {
        // This runs on a DIFFERENT thread from the caller
        emailClient.send(email, "Welcome!", "...");
        return CompletableFuture.completedFuture(null);
    }
}

// What Spring generates (conceptually):
public class EmailService$$Proxy extends EmailService {
    private final Executor executor;  // the thread pool

    @Override
    public CompletableFuture&lt;Void&gt; sendWelcomeEmail(String email) {
        CompletableFuture&lt;Void&gt; future = new CompletableFuture&lt;&gt;();
        executor.execute(() -&gt; {  // submits to thread pool
            try {
                super.sendWelcomeEmail(email)  // actual logic
                    .whenComplete((v, ex) -&gt; {
                        if (ex != null) future.completeExceptionally(ex);
                        else future.complete(null);
                    });
            } catch (Exception e) {
                future.completeExceptionally(e);
            }
        });
        return future;  // returned to caller IMMEDIATELY
    }
}</pre>

<h4>Configuring the Thread Pool</h4>
<pre>@Configuration
@EnableAsync
public class AsyncConfig implements AsyncConfigurer {

    @Bean("emailExecutor")
    public Executor emailTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();

        // Core threads: always alive, ready to execute
        executor.setCorePoolSize(4);

        // Max threads: created when queue is full
        // More threads = more concurrency but also more memory
        executor.setMaxPoolSize(16);

        // Queue capacity: tasks wait here when all core threads are busy
        // ⚠️ Large queues hide performance problems — keep bounded
        executor.setQueueCapacity(200);

        // What to do when queue is full AND max threads reached:
        // CallerRunsPolicy: caller thread executes the task (backpressure)
        // AbortPolicy: throw RejectedExecutionException (default)
        executor.setRejectedExecutionHandler(new CallerRunsPolicy());

        // Thread naming helps in stack traces and profiling:
        executor.setThreadNamePrefix("email-");

        // Graceful shutdown: wait for tasks to complete on app shutdown
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setAwaitTerminationSeconds(30);

        executor.initialize();
        return executor;
    }

    @Bean("reportExecutor")
    public Executor reportTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);       // reports are slow — fewer threads
        executor.setMaxPoolSize(4);
        executor.setQueueCapacity(50);
        executor.setThreadNamePrefix("report-");
        executor.initialize();
        return executor;
    }

    // Default executor used when @Async has no name specified:
    @Override
    public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(8);
        executor.setMaxPoolSize(32);
        executor.setQueueCapacity(1000);
        executor.setThreadNamePrefix("async-");
        executor.initialize();
        return executor;
    }

    // Handle exceptions in @Async void methods (otherwise swallowed):
    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return (ex, method, args) -&gt; {
            log.error("@Async method {} failed with args {}", method.getName(), args, ex);
            // Could also: alert team, write to dead-letter queue, etc.
        };
    }
}

// Use named executor:
@Async("emailExecutor")
public CompletableFuture&lt;Void&gt; sendEmail(...) { ... }

@Async("reportExecutor")
public CompletableFuture&lt;Report&gt; generateReport(...) { ... }</pre>

<h4>Return Type Options</h4>
<pre>// 1. void — fire-and-forget, exceptions go to AsyncUncaughtExceptionHandler
@Async
public void fireAndForget(String data) { ... }

// 2. Future — traditional, get() blocks
@Async
public Future&lt;Report&gt; generateReport() {
    return new AsyncResult&lt;&gt;(doExpensiveWork());
}
// Caller:
Future&lt;Report&gt; future = service.generateReport();
Report report = future.get(30, TimeUnit.SECONDS);  // blocks up to 30s

// 3. CompletableFuture — composable, non-blocking chains (preferred)
@Async
public CompletableFuture&lt;Order&gt; processOrder(OrderRequest req) {
    Order order = doProcessing(req);
    return CompletableFuture.completedFuture(order);
}

// Caller — compose without blocking:
service.processOrder(req)
    .thenApply(order -&gt; order.getId())
    .thenCompose(id -&gt; notificationService.send(id))
    .exceptionally(ex -&gt; { log.error("Failed", ex); return null; });</pre>

<h4>SecurityContext in @Async Threads</h4>
<pre>// Problem: SecurityContext is ThreadLocal → @Async threads don't have it
@Async
public void sendEmail(String to) {
    // ❌ SecurityContextHolder.getContext().getAuthentication() returns null!
    // The async thread doesn't inherit the calling thread's SecurityContext
}

// Fix: configure Spring Security to propagate SecurityContext
@Bean
public SecurityContextRepository securityContextRepository() {
    return new HttpSessionSecurityContextRepository();
}

// Or configure the executor:
@Bean
public Executor asyncExecutor() {
    return new DelegatingSecurityContextExecutorService(
        Executors.newFixedThreadPool(8)
    );
    // Now async threads inherit SecurityContext from caller
}</pre>`}
          ]
        }
      ]
    },
    {
      label: "PART 4 · TESTING SPRING APPLICATIONS",
      sections: [
        {
          id: "testing-deep", n: 4, title: "Testing — Slices, Mocks, Integration & Best Practices",
          desc: "How to test every layer of your Spring application <strong>efficiently and reliably</strong> — without slow full-context startups for every test.",
          questions: [
            {n:7, t:"@SpringBootTest vs @WebMvcTest vs @DataJpaTest — choose the right one.", d:["intermediate"], a:`
<p>Choosing the wrong test annotation is the most common Spring testing mistake. The wrong choice leads to either slow tests (full context when slice is enough) or false confidence (slice when integration is needed).</p>

<h4>The Testing Pyramid — Why Test Slices Exist</h4>
<pre>
         /\
        /  \  @SpringBootTest — Full integration tests
       /    \  (Slow: 10-30s startup, full context)
      /------\
     /        \  @WebMvcTest / @DataJpaTest — Slice tests
    /          \  (Fast: 1-3s, partial context)
   /------------\
  /              \  Unit tests with Mockito (no Spring)
 /                \  (Very fast: milliseconds)
/__________________\
</pre>

<h4>@SpringBootTest — Full Application Context</h4>
<pre>@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@Transactional  // roll back each test, keep DB clean
class OrderIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;  // real HTTP client

    @Autowired
    private OrderRepository orderRepo;

    @Test
    void createOrder_SavesToDB_And_ReturnsCreatedStatus() {
        // Real HTTP request → real controller → real service → real DB
        ResponseEntity&lt;OrderDto&gt; response = restTemplate.postForEntity(
            "/orders",
            new CreateOrderRequest("customer-1", List.of(...)),
            OrderDto.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(orderRepo.count()).isEqualTo(1);
    }
}

// WebEnvironment options:
// RANDOM_PORT: starts real servlet on random port, use TestRestTemplate
// DEFINED_PORT: uses server.port from application.properties
// MOCK (default): MockMvc servlet, no real HTTP
// NONE: no servlet at all (for non-web tests)</pre>

<h4>@WebMvcTest — Only the Web Layer</h4>
<pre>// Loads ONLY: @Controller, @RestController, @ControllerAdvice, @Filter, etc.
// Does NOT load: @Service, @Repository, @Component (need @MockBean for these)
// Fastest for testing controller behavior in isolation

@WebMvcTest(OrderController.class)  // loads ONLY OrderController (and its deps)
class OrderControllerTest {

    @Autowired
    private MockMvc mvc;  // fake HTTP — no real server

    @MockBean  // creates Mockito mock AND registers as Spring bean
    private OrderService orderService;

    @MockBean
    private JwtService jwtService;  // if security is enabled

    @Test
    void getOrder_Returns200_WithOrderDto() throws Exception {
        // Arrange
        OrderDto dto = new OrderDto(1L, "customer-1", OrderStatus.CONFIRMED, ...);
        when(orderService.findById(1L)).thenReturn(dto);

        // Act + Assert
        mvc.perform(get("/orders/1")
                .header("Authorization", "Bearer test-token")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.status").value("CONFIRMED"))
            .andExpect(jsonPath("$.customerId").value("customer-1"));

        verify(orderService).findById(1L);  // verify service was called
    }

    @Test
    void createOrder_InvalidRequest_Returns400() throws Exception {
        // Request without required fields
        String invalidJson = "{\"customerId\":\"\", \"items\":[]}";

        mvc.perform(post("/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidJson))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.errors.customerId").exists())
            .andExpect(jsonPath("$.errors.items").exists());

        // Service should NOT be called — validation rejected the request
        verifyNoInteractions(orderService);
    }

    @Test
    void getOrder_NotFound_Returns404() throws Exception {
        when(orderService.findById(999L))
            .thenThrow(new OrderNotFoundException("Order not found: 999"));

        mvc.perform(get("/orders/999"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.message").value("Order not found: 999"));
    }
}</pre>

<h4>@DataJpaTest — Only the JPA Layer</h4>
<pre>// Loads ONLY: JPA repos, EntityManager, DataSource
// Uses H2 embedded DB by default (fast, in-memory)
// Auto-rolls back each test (implicit @Transactional)

@DataJpaTest
class OrderRepositoryTest {

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private TestEntityManager em;  // helper for test data setup

    @Test
    void findByCustomerId_ReturnsMatchingOrders() {
        // Arrange: create test data
        Customer customer = em.persistAndFlush(new Customer("customer-1", "alice@example.com"));
        Order order1 = em.persistAndFlush(new Order(customer, OrderStatus.CONFIRMED));
        Order order2 = em.persistAndFlush(new Order(customer, OrderStatus.SHIPPED));
        em.persistAndFlush(new Order(new Customer("customer-2", "bob@example.com"), OrderStatus.PENDING));

        em.clear();  // clear cache — force real DB reads

        // Act
        List&lt;Order&gt; found = orderRepo.findByCustomerId("customer-1");

        // Assert
        assertThat(found).hasSize(2)
            .extracting(Order::getStatus)
            .containsExactlyInAnyOrder(OrderStatus.CONFIRMED, OrderStatus.SHIPPED);
    }

    @Test
    void findTopActiveOrders_WithPagination() {
        // Setup 10 orders
        for (int i = 0; i &lt; 10; i++) {
            em.persistAndFlush(new Order(..., i * 100.0));
        }

        // Test pagination
        Page&lt;Order&gt; page = orderRepo.findAll(PageRequest.of(0, 5, Sort.by("total").descending()));
        assertThat(page.getTotalElements()).isEqualTo(10);
        assertThat(page.getContent()).hasSize(5);
        assertThat(page.getContent().get(0).getTotal()).isEqualTo(900.0);  // highest total first
    }
}

// Use real DB with @DataJpaTest + Testcontainers:
@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.NONE)  // don't replace with H2
@Testcontainers
class OrderRepositoryPostgresTest {

    @Container
    static PostgreSQLContainer&lt;?&gt; postgres = new PostgreSQLContainer&lt;&gt;("postgres:16")
        .withDatabaseName("testdb");

    @DynamicPropertySource
    static void configureDataSource(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired OrderRepository orderRepo;
    // Now tests run against real PostgreSQL!
}</pre>

<h4>@MockBean vs @SpyBean</h4>
<pre>// @MockBean — Complete replacement with a Mockito mock
// All methods return null/0/false by default unless stubbed
@MockBean
private PaymentService paymentService;
when(paymentService.charge(any())).thenReturn(new Receipt(...));

// @SpyBean — Wraps the REAL bean, delegates to real methods unless stubbed
// Use when you want MOST methods to work normally, but override specific ones
@SpyBean
private OrderService orderService;
doReturn(mockOrder).when(orderService).findById(999L);  // stub findById
// all other methods of orderService still run REAL code

// When to use each:
// @MockBean: for services you want to isolate (most tests)
// @SpyBean: for services where most behavior is correct, just override one method</pre>`},

            {n:8, t:"Testcontainers — integration testing with real databases and message brokers.", d:["advanced"], a:`
<p>Testcontainers spins up real Docker containers during tests. This eliminates the "works on my machine" problem and the gap between H2 and real database behavior.</p>

<h4>Basic Setup</h4>
<pre>&lt;dependency&gt;
    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
    &lt;artifactId&gt;spring-boot-testcontainers&lt;/artifactId&gt;
    &lt;scope&gt;test&lt;/scope&gt;
&lt;/dependency&gt;
&lt;dependency&gt;
    &lt;groupId&gt;org.testcontainers&lt;/groupId&gt;
    &lt;artifactId&gt;junit-jupiter&lt;/artifactId&gt;
    &lt;scope&gt;test&lt;/scope&gt;
&lt;/dependency&gt;
&lt;dependency&gt;
    &lt;groupId&gt;org.testcontainers&lt;/groupId&gt;
    &lt;artifactId&gt;postgresql&lt;/artifactId&gt;
    &lt;scope&gt;test&lt;/scope&gt;
&lt;/dependency&gt;</pre>

<h4>Integration Test with PostgreSQL + Kafka</h4>
<pre>@SpringBootTest
@Testcontainers
class OrderIntegrationTest {

    // Static = container shared across ALL tests in this class (faster)
    @Container
    static PostgreSQLContainer&lt;?&gt; postgres = new PostgreSQLContainer&lt;&gt;("postgres:16")
        .withDatabaseName("orderdb")
        .withUsername("testuser")
        .withPassword("testpass");

    @Container
    static KafkaContainer kafka = new KafkaContainer(
        DockerImageName.parse("confluentinc/cp-kafka:7.5.0")
    );

    @Container
    static GenericContainer&lt;?&gt; redis = new GenericContainer&lt;&gt;("redis:7")
        .withExposedPorts(6379);

    // Wire container properties into Spring's configuration:
    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);

        registry.add("spring.kafka.bootstrap-servers", kafka::getBootstrapServers);

        registry.add("spring.data.redis.host", redis::getHost);
        registry.add("spring.data.redis.port", () -&gt; redis.getMappedPort(6379));
    }

    @Autowired private OrderService orderService;
    @Autowired private OrderRepository orderRepo;
    @Autowired private KafkaTemplate&lt;String, String&gt; kafkaTemplate;

    @Test
    @Transactional
    void placeOrder_SavesOrderAndPublishesEvent() throws Exception {
        // Real DB, real Kafka, real Redis — no mocks for infrastructure!
        CreateOrderRequest req = new CreateOrderRequest("customer-1", List.of(...));

        OrderDto result = orderService.placeOrder(req);

        assertThat(result.getId()).isNotNull();
        assertThat(orderRepo.findById(result.getId())).isPresent();

        // Wait for async Kafka event:
        await().atMost(5, SECONDS).untilAsserted(() -&gt; {
            // verify Kafka message was published
        });
    }
}

// Spring Boot 3.1+ shortcut: @ServiceConnection
// (eliminates @DynamicPropertySource boilerplate)
@SpringBootTest
@Testcontainers
class ModernIntegrationTest {

    @Container
    @ServiceConnection  // ← auto-wires the container into Spring properties!
    static PostgreSQLContainer&lt;?&gt; postgres = new PostgreSQLContainer&lt;&gt;("postgres:16");

    @Container
    @ServiceConnection
    static KafkaContainer kafka = new KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:7.5.0"));

    // No @DynamicPropertySource needed! Spring Boot reads from the container automatically
}</pre>

<h4>Reusing Containers Across Tests (Performance)</h4>
<pre>// Problem: each test class starts its own containers = slow!
// Solution: reuse the same container across test classes

// TestcontainersConfiguration.java (shared config):
@TestConfiguration(proxyBeanMethods = false)
class TestcontainersConfiguration {

    @Bean
    @ServiceConnection
    PostgreSQLContainer&lt;?&gt; postgresContainer() {
        return new PostgreSQLContainer&lt;&gt;("postgres:16")
            .withReuse(true);  // ← reuse if already running
    }

    @Bean
    @ServiceConnection
    KafkaContainer kafkaContainer() {
        return new KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:7.5.0"))
            .withReuse(true);
    }
}

// In each test class, import the shared config:
@SpringBootTest
@Import(TestcontainersConfiguration.class)
class OrderIntegrationTest { ... }

@SpringBootTest
@Import(TestcontainersConfiguration.class)
class PaymentIntegrationTest { ... }

// Both tests share the SAME containers — started once, reused!</pre>`}
          ]
        }
      ]
        },
        {
            label: "PART 5 · ENTERPRISE CONCEPTS & PRODUCTION READINESS",
            sections: [
                {
                    id: "enterprise-advanced", n: 5, title: "Enterprise Spring Concepts You Must Know",
                    desc: "Coverage of the concepts that separate <strong>project-level Spring usage</strong> from <strong>production-grade architecture</strong>.",
                    questions: [
                        {n:1, t:"How do observability and monitoring work in Spring Boot production systems?", d:["intermediate","advanced"], a:`
<p>Observability means you can answer: what failed, where, why, and how often.</p>

<h4>Three pillars</h4>
<ul>
    <li><strong>Logs:</strong> structured JSON logs with trace IDs</li>
    <li><strong>Metrics:</strong> latency, error rate, throughput, JVM/DB/thread-pool metrics</li>
    <li><strong>Traces:</strong> request journey across services</li>
</ul>

<h4>Spring stack</h4>
<ul>
    <li>Spring Boot Actuator for health/info/metrics endpoints</li>
    <li>Micrometer for metric instrumentation and export</li>
    <li>OpenTelemetry bridge for distributed tracing</li>
    <li>Prometheus + Grafana dashboards and alerts</li>
</ul>

<h4>Must-have production metrics</h4>
<ul>
    <li>p50/p95/p99 API latency</li>
    <li>5xx and 4xx rates</li>
    <li>DB pool usage and query timings</li>
    <li>Thread pool queue depth and rejection counts</li>
    <li>Kafka consumer lag (if event-driven)</li>
</ul>

<p><strong>Interview depth:</strong> mention SLI/SLO and alerting based on error budget, not just raw CPU usage.</p>`},

                        {n:2, t:"What reliability patterns should advanced Spring developers apply in microservices?", d:["advanced","expert"], a:`
<h4>Core patterns</h4>
<ul>
    <li><strong>Timeout:</strong> every outbound call must have bounded wait time</li>
    <li><strong>Retry with backoff:</strong> retry only idempotent operations</li>
    <li><strong>Circuit breaker:</strong> fail fast when dependency is unstable</li>
    <li><strong>Bulkhead:</strong> isolate resource pools per downstream system</li>
    <li><strong>Rate limiting:</strong> protect your system and neighbors</li>
    <li><strong>Fallback:</strong> degraded mode over total outage</li>
</ul>

<h4>Spring implementation</h4>
<ul>
    <li>Resilience4j with @Retry, @TimeLimiter, @CircuitBreaker, @Bulkhead</li>
    <li>Use separate executor pools for high/low priority tasks</li>
    <li>Combine with idempotency keys for financial/critical operations</li>
</ul>

<h4>Important trade-off</h4>
<p>Retries can amplify load during outages. Tune retry counts and add jitter to avoid synchronized retry storms.</p>`},

                        {n:3, t:"How should event-driven architecture be implemented safely with Spring and Kafka?", d:["advanced"], a:`
<h4>Production-safe event flow</h4>
<ol>
    <li>Write domain change and outbox event in same DB transaction</li>
    <li>Outbox publisher sends events to Kafka</li>
    <li>Consumers process idempotently using event ID deduplication</li>
    <li>Poison messages go to DLQ with failure metadata</li>
</ol>

<h4>Why outbox pattern matters</h4>
<p>Without outbox, you may commit DB write and fail before publishing event, causing inconsistent state between services.</p>

<h4>Consumer design rules</h4>
<ul>
    <li>Idempotent handlers (safe on duplicates)</li>
    <li>No long transactions in listener thread</li>
    <li>Explicit retry policy and DLQ strategy</li>
    <li>Use schema evolution strategy for backward compatibility</li>
</ul>`},

                        {n:4, t:"What are the key performance tuning concepts in advanced Spring applications?", d:["advanced","expert"], a:`
<h4>Application-level tuning</h4>
<ul>
    <li>Right-size thread pools for web, async, scheduler, and messaging separately</li>
    <li>Reduce object allocation in hot paths to lower GC pressure</li>
    <li>Use caching for expensive reads with clear eviction policy</li>
    <li>Profile serialization costs (large JSON payloads are expensive)</li>
</ul>

<h4>Database-level tuning</h4>
<ul>
    <li>Index based on query patterns, not guesses</li>
    <li>Avoid N+1 and over-fetching large object graphs</li>
    <li>Use batch writes for bulk operations</li>
    <li>Monitor slow query logs continuously</li>
</ul>

<h4>JVM and runtime</h4>
<ul>
    <li>Choose suitable GC for workload</li>
    <li>Set memory limits aligned with container limits</li>
    <li>Use load testing to validate p95/p99 under realistic traffic</li>
</ul>

<p><strong>Interview-ready framing:</strong> tune by evidence from metrics and profiles, never by intuition alone.</p>`},

                        {n:5, t:"What is a complete concept matrix from beginner to advanced for Spring interview prep?", d:["beginner","intermediate","advanced"], a:`
<h4>Level 1 (Beginner)</h4>
<ul>
    <li>IoC, DI, bean scopes, configuration</li>
    <li>REST controllers, validation, exception handling</li>
    <li>Basic JPA and repository usage</li>
</ul>

<h4>Level 2 (Intermediate)</h4>
<ul>
    <li>Transactions, propagation, isolation</li>
    <li>Security basics, JWT flow, method authorization</li>
    <li>Testing slices and integration testing</li>
    <li>Caching and async processing</li>
</ul>

<h4>Level 3 (Advanced)</h4>
<ul>
    <li>AOP internals and proxy behavior</li>
    <li>JPA internals and query performance optimization</li>
    <li>Kafka patterns, delivery semantics, DLQ</li>
    <li>Resilience and observability architecture</li>
</ul>

<h4>Level 4 (Senior/Architect)</h4>
<ul>
    <li>System boundaries and service decomposition</li>
    <li>Consistency models and failure strategy</li>
    <li>Deployment strategy, rollback safety, zero-downtime migration</li>
    <li>Operational excellence: alerting, runbooks, incident response</li>
</ul>

<p>Use this matrix as your revision map. If you can explain each point with one real project example, you are interview-ready.</p>`}
                    ]
                }
            ]
        }
    ]
};
