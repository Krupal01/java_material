/* =========================================================
   Backend Architecture & System Design — Complete MAANG Guide
   Beginner to Expert — Load Balancing, Caching, CDN, API Design,
   Microservices, Messaging, Storage, Consistency, Scalability.
   ========================================================= */
window.BACKEND_ARCH_DATA = {
  parts: [

    /* =====================================================
       PART 1 · SYSTEM DESIGN FUNDAMENTALS
    ===================================================== */
    {
      label: "PART 1 · SYSTEM DESIGN FUNDAMENTALS",
      sections: [
        {
          id: "design-approach", n: 1, title: "How to Approach Any System Design Interview",
          desc: "A structured framework to answer any MAANG system design question in 45 minutes — used at Google, Meta, Amazon, and Netflix.",
          questions: [
            {n:1, t:"What is the step-by-step framework for a system design interview?", d:["beginner","intermediate"], a:`
<p>MAANG interviewers score you on breadth, depth, and trade-off reasoning — not on getting a "right answer". Use this 6-step framework:</p>
<ol>
  <li><strong>Clarify requirements (5 min)</strong><br>
    Ask: How many users? QPS? Read-heavy or write-heavy? What consistency is needed? Any SLA? What geographies?
    <pre>Example: "Design Twitter"
- 300M DAU, 500M tweets/day (write)
- 10x more reads than writes (timeline)
- 99.9% uptime SLA
- eventual consistency is fine for feeds</pre>
  </li>
  <li><strong>Define the API (3 min)</strong><br>
    Write 2-3 core REST or gRPC endpoints. This scopes the problem.
    <pre>POST /tweets  { user_id, content }
GET  /timeline/:user_id?page=1
GET  /user/:user_id/profile</pre>
  </li>
  <li><strong>Estimate scale (3 min)</strong><br>
    Back-of-envelope: storage, bandwidth, QPS, cache hit rate.
    <pre>500M tweets/day = 6000 writes/sec
280 chars avg → 280 bytes/tweet
Storage: 280 * 500M = 140 GB/day</pre>
  </li>
  <li><strong>High-level design (10 min)</strong><br>
    Draw boxes: Client → CDN → API Gateway → Services → DB / Cache / Queue
  </li>
  <li><strong>Deep dive bottlenecks (15 min)</strong><br>
    Pick 2-3 hard areas: DB schema, fan-out strategy, cache eviction, consistency model.
  </li>
  <li><strong>Discuss trade-offs (5 min)</strong><br>
    What would you do differently at 10x scale? What fails first? How do you monitor it?
  </li>
</ol>`},

            {n:2, t:"What are the most important non-functional requirements to clarify?", d:["beginner","intermediate"], a:`
<table>
  <tr><th>Category</th><th>Questions to ask</th></tr>
  <tr><td>Scale</td><td>DAU/MAU? Peak QPS? Data volume per day? Growth rate?</td></tr>
  <tr><td>Latency</td><td>P99 latency target? Real-time or near-real-time?</td></tr>
  <tr><td>Consistency</td><td>Strong (financial) or eventual (social feed)?</td></tr>
  <tr><td>Availability</td><td>99.9% (8.7 h/yr downtime) or 99.99% (52 min/yr)?</td></tr>
  <tr><td>Durability</td><td>Zero data loss or occasional loss acceptable?</td></tr>
  <tr><td>Geography</td><td>Single region or global multi-region?</td></tr>
  <tr><td>Security</td><td>PII data? Compliance (GDPR, HIPAA)?</td></tr>
</table>
<p><strong>Back-of-envelope cheat sheet:</strong></p>
<pre>1 million requests/day = 12 req/sec
1 billion requests/day = 11,500 req/sec (≈ 10K QPS)
1 KB * 1M users = 1 GB storage
1 byte stored = 3x for replication (assume 3 replicas)</pre>`},

            {n:3, t:"How do you estimate QPS, storage, and bandwidth?", d:["intermediate"], a:`
<pre>-- Example: Design a URL shortener
-- Given: 100M new URLs/day, 10:1 read-to-write ratio

-- Write QPS
100M / 86400 seconds = ~1200 writes/sec

-- Read QPS
10 * 1200 = ~12,000 reads/sec

-- Storage per URL
long_url (2KB) + short_code (7 bytes) + metadata (100 bytes) = ~2.2 KB/record
100M URLs/day * 2.2 KB = 220 GB/day
Over 5 years: 220 * 365 * 5 = ~400 TB

-- Bandwidth (read)
12,000 req/sec * 2.2 KB = ~26 MB/sec outbound

-- Cache sizing
Assume 20% of URLs get 80% of traffic (Pareto)
Cache 20% of daily URLs: 100M * 20% * 2.2KB = 44 GB/day
→ A 50 GB Redis cluster handles read cache comfortably</pre>`},

            {n:4, t:"What is the CAP theorem and what does it mean for real systems?", d:["intermediate","advanced"], a:`
<p>In a distributed system that can partition (network split), you can only guarantee <strong>two of three</strong>: Consistency, Availability, Partition Tolerance. Since partitions always happen, the real choice is CP vs AP.</p>
<table>
  <tr><th>Choice</th><th>Behaviour on Partition</th><th>Examples</th></tr>
  <tr><td>CP</td><td>Returns error / rejects writes to stay consistent</td><td>PostgreSQL, ZooKeeper, HBase</td></tr>
  <tr><td>AP</td><td>Returns possibly stale data but stays available</td><td>Cassandra, DynamoDB, CouchDB</td></tr>
</table>
<p><strong>PACELC extension:</strong> Even without a partition, there's a trade-off between latency and consistency. Most real systems choose different points for different operations (e.g., write ledger entry as CP, read social feed as AP).</p>
<pre>-- Real-world mapping
Financial transactions  → CP (strong consistency, tolerate brief unavailability)
Social feed / likes     → AP (eventual consistency, always available)
Shopping cart           → AP (accept writes, merge conflicts later)
Inventory (last item)   → CP (avoid overselling)</pre>`},

            {n:5, t:"Monolith vs Microservices — when to choose which?", d:["beginner","intermediate"], a:`
<table>
  <tr><th>Dimension</th><th>Monolith</th><th>Microservices</th></tr>
  <tr><td>Dev speed (early)</td><td>Fast — one codebase, one deploy</td><td>Slower — service contracts, infra</td></tr>
  <tr><td>Deployments</td><td>All or nothing</td><td>Independent per service</td></tr>
  <tr><td>Ops complexity</td><td>Low</td><td>High (service mesh, tracing)</td></tr>
  <tr><td>Team scaling</td><td>Painful with large teams (merge conflicts, coordination)</td><td>Teams own their service end-to-end</td></tr>
  <tr><td>Technology choice</td><td>One stack</td><td>Each service can use best tool</td></tr>
  <tr><td>Data isolation</td><td>Shared DB</td><td>Service owns its DB</td></tr>
</table>
<p><strong>MAANG interview answer:</strong> "I'd start with a modular monolith — well-separated modules with clean interfaces. When a specific module needs independent scaling or separate deployment cadence, extract it as a service. Don't microservice prematurely."</p>
<p><strong>Signals to split a service:</strong> different scaling profile, different team ownership, different deployment frequency, different reliability requirements.</p>`}
          ]
        }
      ]
    },

    /* =====================================================
       PART 2 · NETWORKING & PROTOCOLS
    ===================================================== */
    {
      label: "PART 2 · NETWORKING & PROTOCOLS",
      sections: [
        {
          id: "networking", n: 2, title: "HTTP, REST, gRPC, WebSockets — Protocols Explained",
          desc: "Every backend system communicates over a protocol. Knowing when to pick each is a system design must-know.",
          questions: [
            {n:1, t:"HTTP/1.1 vs HTTP/2 vs HTTP/3 — key differences", d:["beginner","intermediate"], a:`
<table>
  <tr><th>Feature</th><th>HTTP/1.1</th><th>HTTP/2</th><th>HTTP/3</th></tr>
  <tr><td>Connections</td><td>1 req/connection (keep-alive = reuse)</td><td>Multiplexing — many streams over 1 TCP connection</td><td>Multiplexing over QUIC (UDP-based)</td></tr>
  <tr><td>Header compression</td><td>None (repeated headers every request)</td><td>HPACK compression</td><td>QPACK compression</td></tr>
  <tr><td>Head-of-line blocking</td><td>Yes (request blocks next)</td><td>Yes at TCP layer</td><td>No — per-stream, independent</td></tr>
  <tr><td>Server push</td><td>No</td><td>Yes</td><td>Yes</td></tr>
  <tr><td>TLS</td><td>Optional</td><td>Effectively required</td><td>Built-in (QUIC)</td></tr>
</table>
<pre>-- HTTP/2 allows 100s of concurrent requests on one connection
-- Critical for mobile clients (limited parallel TCP connections)
-- HTTP/3 eliminates TCP handshake — connection setup in 0-1 RTT (QUIC)</pre>`},

            {n:2, t:"REST vs gRPC — when to use each?", d:["intermediate","advanced"], a:`
<table>
  <tr><th>Dimension</th><th>REST (HTTP/JSON)</th><th>gRPC (HTTP/2 + Protobuf)</th></tr>
  <tr><td>Protocol</td><td>HTTP/1.1 or HTTP/2</td><td>HTTP/2 only</td></tr>
  <tr><td>Payload</td><td>JSON (text, human-readable)</td><td>Protocol Buffers (binary, 3-10x smaller)</td></tr>
  <tr><td>Streaming</td><td>Limited (SSE, chunked)</td><td>Native bi-directional streaming</td></tr>
  <tr><td>Type safety</td><td>None (JSON is loose)</td><td>Strong — .proto schema enforced</td></tr>
  <tr><td>Browser support</td><td>Native</td><td>Needs grpc-web proxy</td></tr>
  <tr><td>Best for</td><td>Public APIs, mobile, browser clients</td><td>Internal service-to-service, low-latency, high-throughput</td></tr>
</table>
<pre>// gRPC .proto example
service OrderService {
  rpc CreateOrder (CreateOrderRequest) returns (OrderResponse);
  rpc WatchOrderStatus (OrderId) returns (stream StatusEvent); // server streaming
}

message CreateOrderRequest {
  int64 customer_id = 1;
  repeated OrderItem items = 2;
}</pre>
<p><strong>MAANG pattern:</strong> REST for external/public APIs. gRPC for internal microservice communication (lower latency, type safety, streaming).</p>`},

            {n:3, t:"WebSockets vs Server-Sent Events vs Long Polling — real-time options", d:["intermediate","advanced"], a:`
<table>
  <tr><th>Technique</th><th>Direction</th><th>Protocol</th><th>Best for</th></tr>
  <tr><td>Long Polling</td><td>Server → Client (emulated)</td><td>HTTP</td><td>Simple notifications, legacy systems</td></tr>
  <tr><td>Server-Sent Events (SSE)</td><td>Server → Client only</td><td>HTTP/1.1+</td><td>Live feeds, dashboards, notifications</td></tr>
  <tr><td>WebSocket</td><td>Bi-directional</td><td>WS (upgrade from HTTP)</td><td>Chat, gaming, collaborative editing, trading</td></tr>
</table>
<pre>// WebSocket — server sends AND receives
const ws = new WebSocket('wss://api.example.com/chat');
ws.onmessage = (event) => console.log(event.data);
ws.send(JSON.stringify({ type: 'message', text: 'Hello' }));

// SSE — server pushes only (simpler, auto-reconnect)
const es = new EventSource('/api/feed');
es.onmessage = (event) => updateFeed(event.data);</pre>
<p><strong>MAANG tip:</strong> WebSocket is stateful — requires sticky sessions or a shared message broker (Redis Pub/Sub or Kafka) when scaling horizontally across multiple server instances.</p>`},

            {n:4, t:"What is DNS and how does it affect system design?", d:["beginner","intermediate"], a:`
<p>DNS (Domain Name System) maps domain names to IP addresses. It's the first hop in every request and affects latency, failover, and traffic routing.</p>
<pre>user types api.example.com
  → OS checks local cache / /etc/hosts
  → Recursive resolver (ISP / 8.8.8.8)
  → Root nameserver → TLD (.com) → Authoritative DNS
  → Returns IP (A record for IPv4, AAAA for IPv6)

TTL (Time To Live): how long resolvers cache the record
Low TTL (30s): fast failover but more DNS queries
High TTL (300s): fewer queries but slow failover</pre>
<table>
  <tr><th>DNS Record</th><th>Use</th></tr>
  <tr><td>A</td><td>Domain → IPv4 address</td></tr>
  <tr><td>AAAA</td><td>Domain → IPv6 address</td></tr>
  <tr><td>CNAME</td><td>Alias — domain to another domain</td></tr>
  <tr><td>MX</td><td>Mail server</td></tr>
  <tr><td>TXT</td><td>Verification (SPF, DKIM)</td></tr>
</table>
<p><strong>GeoDNS:</strong> Returns different IPs based on the requester's location — routes US users to US servers, EU users to EU servers. Used by every major CDN and global service.</p>`}
          ]
        }
      ]
    },

    /* =====================================================
       PART 3 · LOAD BALANCING
    ===================================================== */
    {
      label: "PART 3 · LOAD BALANCING",
      sections: [
        {
          id: "load-balancing", n: 3, title: "Load Balancing — Algorithms, Layers, Health Checks, Sticky Sessions",
          desc: "Load balancing is the entry point to every scalable system. Understanding the layers and algorithms is essential for system design rounds.",
          questions: [
            {n:1, t:"What is a load balancer and why is it needed?", d:["beginner"], a:`
<p>A load balancer sits in front of multiple server instances and distributes incoming requests so no single server is overwhelmed.</p>
<pre>Internet → Load Balancer → [Server 1]
                         → [Server 2]
                         → [Server 3]</pre>
<p><strong>Benefits:</strong></p>
<ul>
  <li>Horizontal scaling — add more servers instead of bigger ones</li>
  <li>High availability — if one server dies, traffic goes to healthy ones</li>
  <li>Zero-downtime deployments — take servers out of rotation one at a time</li>
  <li>SSL termination — LB handles TLS, backend uses plain HTTP</li>
  <li>Observability — single point to measure traffic and latency</li>
</ul>`},

            {n:2, t:"Load balancing algorithms — Round Robin, Least Connections, IP Hash, Weighted", d:["intermediate"], a:`
<table>
  <tr><th>Algorithm</th><th>How it works</th><th>Best for</th></tr>
  <tr><td>Round Robin</td><td>Cycle through servers in order (1,2,3,1,2,3...)</td><td>Stateless, homogeneous servers, uniform request cost</td></tr>
  <tr><td>Weighted Round Robin</td><td>Servers with higher weight get more traffic (e.g. 70:30)</td><td>Mixed-capacity servers</td></tr>
  <tr><td>Least Connections</td><td>Send to server with fewest active connections</td><td>Long-lived connections (DB, WebSocket)</td></tr>
  <tr><td>Least Response Time</td><td>Send to server with lowest latency + fewest connections</td><td>Latency-sensitive APIs</td></tr>
  <tr><td>IP Hash</td><td>Hash client IP → always same server</td><td>Sticky sessions (stateful apps)</td></tr>
  <tr><td>Random with 2 choices</td><td>Pick 2 random servers, choose the one with fewer connections</td><td>Better than pure random at scale</td></tr>
  <tr><td>Resource-based</td><td>Route based on server CPU/memory metrics</td><td>Variable-cost requests</td></tr>
</table>
<p><strong>MAANG tip:</strong> For most stateless microservices, Least Connections or Round Robin is fine. IP Hash or consistent hashing when the server holds session/cache state.</p>`},

            {n:3, t:"Layer 4 vs Layer 7 load balancing — what is the difference?", d:["intermediate","advanced"], a:`
<table>
  <tr><th>Feature</th><th>Layer 4 (Transport)</th><th>Layer 7 (Application)</th></tr>
  <tr><td>OSI Layer</td><td>TCP/UDP</td><td>HTTP/HTTPS/gRPC</td></tr>
  <tr><td>Routing based on</td><td>IP address + port only</td><td>URL, headers, cookies, content</td></tr>
  <tr><td>Throughput</td><td>Very high — no packet inspection</td><td>Lower — parses HTTP headers</td></tr>
  <tr><td>SSL termination</td><td>No (passes through)</td><td>Yes</td></tr>
  <tr><td>Examples</td><td>AWS NLB, HAProxy (TCP mode)</td><td>AWS ALB, NGINX, Envoy, HAProxy (HTTP mode)</td></tr>
</table>
<pre>-- Layer 7 routing example (NGINX upstream based on URL path)
upstream api_service  { server api1:8080; server api2:8080; }
upstream auth_service { server auth1:9090; server auth2:9090; }

server {
  location /api/  { proxy_pass http://api_service; }
  location /auth/ { proxy_pass http://auth_service; }
}</pre>
<p><strong>When to use L4:</strong> Raw performance, non-HTTP protocols (DB, SMTP). When to use L7: content-based routing, A/B testing, header injection, auth offload.</p>`},

            {n:4, t:"Health checks — how load balancers detect unhealthy servers", d:["intermediate"], a:`
<p>Load balancers continually probe backends. Failing servers are removed from the pool; recovered ones are added back.</p>
<pre>-- NGINX health check config
upstream backend {
  server app1:8080;
  server app2:8080;
  server app3:8080 backup;  -- only used when others fail

  # Active health check (NGINX Plus)
  health_check interval=5s fails=3 passes=2 uri=/health;
}

-- Spring Boot health endpoint (Actuator)
GET /actuator/health
{"status": "UP", "components": {"db": {"status": "UP"}, "redis": {"status": "UP"}}}

-- Types of health checks:
-- TCP check: can the LB open a TCP connection to the port?
-- HTTP check: does /health return HTTP 200?
-- Deep check: does /health verify DB + cache connectivity?</pre>
<p><strong>Best practice:</strong> Expose a /health endpoint that checks ALL critical dependencies (DB, cache, external APIs). Return 200 only if the instance can actually serve traffic. Include readiness vs liveness separation for Kubernetes.</p>`},

            {n:5, t:"Sticky sessions — what they are and why they create problems", d:["intermediate","advanced"], a:`
<p>Sticky sessions (session affinity) ensure a user always hits the same server — required when session state is stored in memory on the server.</p>
<pre>-- How it works
Client A's request → IP hash → Server 1 (session data stored here)
Client A's next request → IP hash → Server 1 (finds session data)
Client B → Server 2
Client C → Server 3

-- Problem: if Server 1 dies, Client A's session is lost
-- Problem: Server 1 may get more load than others (hot server)
-- Problem: can't do true zero-downtime rolling restart</pre>
<p><strong>The fix — externalise session state:</strong></p>
<pre>-- Store sessions in Redis (shared, fast, TTL-managed)
-- Now any server can handle any client's request
User → LB → Any Server → Redis (fetch session) → process request

-- Spring Session + Redis
@EnableRedisHttpSession
// All HttpSession calls now route to Redis transparently</pre>
<p><strong>MAANG design principle:</strong> Design servers to be stateless. Session/auth state goes in Redis or JWTs. This enables truly elastic horizontal scaling.</p>`},

            {n:6, t:"Global load balancing — Anycast, GeoDNS, multi-region routing", d:["advanced","expert"], a:`
<p>Global LB routes users to the nearest (or best) data centre across regions.</p>
<table>
  <tr><th>Technique</th><th>How</th><th>Pros / Cons</th></tr>
  <tr><td>GeoDNS</td><td>DNS returns different IP per region based on client location</td><td>Simple. TTL-limited failover speed.</td></tr>
  <tr><td>Anycast</td><td>Same IP advertised from multiple regions; BGP routes to nearest</td><td>Fast routing, instant failover. Complex BGP setup.</td></tr>
  <tr><td>Global Server LB (GSLB)</td><td>Layer 7 global LB with health-aware routing</td><td>Route based on health, latency, cost. Requires software LB at global edge.</td></tr>
</table>
<pre>-- AWS Global Accelerator: Anycast entry points at AWS edge
-- Routes to nearest healthy AWS region automatically

-- Cloudflare Load Balancing: GeoDNS + health checks + failover
-- Route 53 Latency Routing: sends to lowest-latency region per user</pre>`}
          ]
        }
      ]
    },

    /* =====================================================
       PART 4 · CACHING
    ===================================================== */
    {
      label: "PART 4 · CACHING",
      sections: [
        {
          id: "caching", n: 4, title: "Caching — Strategies, Redis, Eviction, Cache Stampede",
          desc: "Caching is the #1 scalability tool. Every MAANG system design interview expects you to know where to cache, what to cache, and what can go wrong.",
          questions: [
            {n:1, t:"Where can you cache? All caching layers explained", d:["beginner","intermediate"], a:`
<pre>Browser Cache         → CSS/JS/images stored locally (Cache-Control headers)
CDN Cache             → HTML/assets cached at edge nodes globally
API Gateway Cache     → Cache repeated identical API responses
Application Cache     → In-memory cache in the app (Caffeine, Guava)
Distributed Cache     → Redis / Memcached shared across all app instances
Database Query Cache  → Database caches query result sets (MySQL query cache — deprecated)
OS Page Cache         → OS caches disk reads in RAM</pre>
<p>Each layer reduces load on the layer below it. A CDN cache hit never reaches your servers. An in-process cache hit never reaches Redis. Maximise hit rate at each layer.</p>`},

            {n:2, t:"Cache-aside, Write-through, Write-behind, Read-through — strategies explained", d:["intermediate","advanced"], a:`
<table>
  <tr><th>Strategy</th><th>How it works</th><th>Pros</th><th>Cons</th></tr>
  <tr><td>Cache-aside (lazy loading)</td><td>App checks cache → miss → read DB → populate cache</td><td>Cache only what's actually needed</td><td>Cache miss = 2 trips (slow first read)</td></tr>
  <tr><td>Read-through</td><td>Cache sits in front of DB; cache handles miss automatically</td><td>App logic simpler</td><td>Cache library must understand data access</td></tr>
  <tr><td>Write-through</td><td>Write to cache AND DB synchronously on every update</td><td>Cache always fresh</td><td>Writes are slower; caches data never read again</td></tr>
  <tr><td>Write-behind (write-back)</td><td>Write to cache first; async flush to DB later</td><td>Lowest write latency</td><td>Data loss risk if cache crashes before flush</td></tr>
  <tr><td>Refresh-ahead</td><td>Proactively refresh cache before TTL expires</td><td>No cold start latency spikes</td><td>May refresh data never read again</td></tr>
</table>
<pre>// Cache-aside (most common in practice)
public Product getProduct(String id) {
  Product p = redis.get("product:" + id);
  if (p == null) {
    p = db.findById(id);
    redis.setex("product:" + id, 300, p); // 5 min TTL
  }
  return p;
}

// Write-through (on update)
public void updateProduct(Product p) {
  db.save(p);
  redis.setex("product:" + p.getId(), 300, p); // update cache too
}</pre>`},

            {n:3, t:"Cache eviction policies — LRU, LFU, TTL, FIFO", d:["intermediate"], a:`
<table>
  <tr><th>Policy</th><th>Evicts</th><th>Best for</th></tr>
  <tr><td>LRU (Least Recently Used)</td><td>Key not accessed for longest time</td><td>General use — temporal locality</td></tr>
  <tr><td>LFU (Least Frequently Used)</td><td>Key with fewest accesses over time</td><td>Stable popular items (product catalog)</td></tr>
  <tr><td>TTL (Time To Live)</td><td>Key after fixed time regardless of access</td><td>Data with known staleness window</td></tr>
  <tr><td>FIFO</td><td>Oldest inserted key</td><td>Simple queues, rarely used for cache</td></tr>
  <tr><td>Random</td><td>Random key</td><td>Sometimes surprisingly effective at scale</td></tr>
</table>
<pre>-- Redis eviction policies (set in redis.conf)
maxmemory-policy allkeys-lru     -- LRU across all keys
maxmemory-policy volatile-lru    -- LRU only among keys with TTL set
maxmemory-policy allkeys-lfu     -- LFU across all keys
maxmemory-policy noeviction      -- return error when full (don't evict)

-- Set TTL when writing
SET product:123 "{...}" EX 300    -- expires in 300 seconds</pre>`},

            {n:4, t:"Cache stampede (thundering herd) — what it is and how to prevent it", d:["advanced"], a:`
<p>A cache stampede happens when a popular cache key expires and thousands of requests simultaneously miss the cache, all hitting the database at once.</p>
<pre>-- Scenario
10,000 concurrent requests for product:bestseller
TTL expires at 3:00:00 PM
All 10,000 requests miss cache at the same time → 10,000 DB queries → DB overload</pre>
<p><strong>Prevention strategies:</strong></p>
<pre>-- 1. Mutex / locking: only ONE request fetches from DB, others wait
String value = redis.get(key);
if (value == null) {
  boolean locked = redis.set("lock:" + key, "1", "NX", "EX", 10);
  if (locked) {
    value = db.fetch();
    redis.setex(key, 300, value);
    redis.del("lock:" + key);
  } else {
    Thread.sleep(50);
    value = redis.get(key);  // retry — lock holder populated cache
  }
}

-- 2. Probabilistic early expiration (XFetch):
-- Start refreshing cache slightly before TTL expires, probabilistically
-- Avoids hard expiry cliff

-- 3. Soft + hard TTL:
-- Soft TTL: return stale data + trigger async refresh
-- Hard TTL: actually delete the key
redis.setex(key, 600, serialize(data, softTTL=300));</pre>`},

            {n:5, t:"Redis data structures and when to use each", d:["intermediate","advanced"], a:`
<table>
  <tr><th>Structure</th><th>Commands</th><th>Use case</th></tr>
  <tr><td>String</td><td>GET/SET/INCR/DECR</td><td>Simple key-value, counters, flags, cached JSON</td></tr>
  <tr><td>Hash</td><td>HGET/HSET/HMGET</td><td>User profile fields, session attributes</td></tr>
  <tr><td>List</td><td>LPUSH/RPOP/LRANGE</td><td>Message queues, activity feeds, recent items</td></tr>
  <tr><td>Set</td><td>SADD/SMEMBERS/SINTER</td><td>Unique visitors, tags, friendship sets</td></tr>
  <tr><td>Sorted Set</td><td>ZADD/ZRANGE/ZRANK</td><td>Leaderboards, rate limiting, time-ordered queues</td></tr>
  <tr><td>Bitmap</td><td>SETBIT/GETBIT/BITCOUNT</td><td>Daily active users (1 bit per user per day)</td></tr>
  <tr><td>HyperLogLog</td><td>PFADD/PFCOUNT</td><td>Approximate cardinality (unique page views) — uses only 12 KB</td></tr>
  <tr><td>Stream</td><td>XADD/XREAD/XGROUP</td><td>Event log, message queue with consumer groups</td></tr>
</table>
<pre>-- Leaderboard (Sorted Set)
ZADD leaderboard 1500 "player:alice"
ZADD leaderboard 2200 "player:bob"
ZREVRANGE leaderboard 0 9 WITHSCORES  -- top 10 players
ZRANK leaderboard "player:alice"       -- alice's rank

-- Rate limiting (Sorted Set sliding window)
ZADD ratelimit:user123 (timestamp) (requestId)
ZREMRANGEBYSCORE ratelimit:user123 0 (now - windowMs)
count = ZCARD ratelimit:user123</pre>`},

            {n:6, t:"Cache invalidation — the hardest problem in distributed systems", d:["advanced","expert"], a:`
<p>"There are only two hard things in computer science: cache invalidation and naming things." — Phil Karlton</p>
<p><strong>Invalidation strategies:</strong></p>
<table>
  <tr><th>Strategy</th><th>How</th><th>Problem</th></tr>
  <tr><td>TTL expiry</td><td>Let cache expire naturally</td><td>Stale data until TTL expires</td></tr>
  <tr><td>Explicit delete on write</td><td>DELETE key when DB record updated</td><td>Race: delete then immediate re-cache with old data</td></tr>
  <tr><td>Event-driven invalidation</td><td>DB change → Kafka event → cache service deletes key</td><td>Slight eventual consistency lag</td></tr>
  <tr><td>Cache versioning</td><td>Embed version in key: product:123:v5</td><td>Old versions accumulate, need cleanup</td></tr>
  <tr><td>Write-through</td><td>Always update cache on DB write</td><td>Caches data that may not be read</td></tr>
</table>
<pre>-- Safe delete-on-write pattern (avoids race with write-through alternative)
// Delete AFTER successful DB write
db.update(product);
redis.del("product:" + product.getId());
// Next read will be a miss → re-populate from DB (fresh data)</pre>`}
          ]
        }
      ]
    },

    /* =====================================================
       PART 5 · CDN & EDGE
    ===================================================== */
    {
      label: "PART 5 · CDN & EDGE",
      sections: [
        {
          id: "cdn-edge", n: 5, title: "CDN, Edge Caching, Static vs Dynamic Content",
          desc: "CDNs are the first line of defence against traffic spikes and global latency. Essential for any high-traffic system design.",
          questions: [
            {n:1, t:"What is a CDN and how does it work?", d:["beginner","intermediate"], a:`
<p>A Content Delivery Network (CDN) is a globally distributed network of servers (Points of Presence / PoPs) that cache content closer to users.</p>
<pre>Without CDN:
User in Tokyo → HTTP request to London server → 200ms round trip

With CDN:
User in Tokyo → Tokyo PoP (cache hit) → 5ms
User in Tokyo → Tokyo PoP (cache miss) → London origin → 200ms + cache for next user</pre>
<p><strong>What CDNs accelerate:</strong></p>
<ul>
  <li>Static assets: images, CSS, JavaScript, fonts</li>
  <li>Video/audio streaming (chunked delivery)</li>
  <li>Software downloads</li>
  <li>API responses (with correct Cache-Control headers)</li>
  <li>Dynamic content (edge compute — Cloudflare Workers, Lambda@Edge)</li>
</ul>
<p><strong>Major CDNs:</strong> Cloudflare, Akamai, AWS CloudFront, Fastly, Google Cloud CDN</p>`},

            {n:2, t:"Cache-Control headers — how to control what CDNs and browsers cache", d:["intermediate","advanced"], a:`
<pre>-- Static asset with long cache (fingerprinted filename prevents stale cache)
Cache-Control: public, max-age=31536000, immutable
-- "immutable" = browser won't revalidate even on reload

-- HTML page — short cache, must revalidate
Cache-Control: public, max-age=60, stale-while-revalidate=300
-- Serve stale content for up to 300s while fetching fresh in background

-- Private user data — no CDN caching
Cache-Control: private, no-store

-- API response — cache at CDN, bypass for authenticated users
Cache-Control: public, max-age=30
Vary: Authorization  -- cache separately per auth token

-- ETag / Last-Modified for conditional requests
ETag: "abc123"
If-None-Match: "abc123"  -- browser sends; if unchanged, server returns 304 Not Modified</pre>`},

            {n:3, t:"CDN cache invalidation — how to purge cached content", d:["intermediate","advanced"], a:`
<pre>-- Problem: deployed new version of app.js but CDN still serves old version

-- Solution 1: Content fingerprinting (best practice)
-- Webpack/Vite generates: app.a3f7d8.js (hash changes on content change)
-- CDN URL changes → automatic cache miss → fresh file served
-- Old fingerprinted URL stays cached (but nobody requests it)

-- Solution 2: CDN purge API (for emergencies)
curl -X POST https://api.cloudflare.com/client/v4/zones/:zone_id/purge_cache \
  -d '{"files": ["https://example.com/app.js"]}'

-- Solution 3: Cache version query param (less clean)
app.js?v=20250508   →  app.js?v=20250509  (forces cache miss)

-- Best practice: versioned filenames + long TTL for assets, short TTL for HTML</pre>`},

            {n:4, t:"Edge computing — running logic at CDN PoPs (Cloudflare Workers, Lambda@Edge)", d:["advanced"], a:`
<p>Edge compute runs your code at the CDN PoP closest to the user — reducing latency from 200ms to 5-20ms for logic that previously required a round-trip to origin.</p>
<pre>// Cloudflare Worker example — A/B testing at the edge
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const variant = Math.random() < 0.5 ? 'A' : 'B';
  const url = new URL(request.url);
  url.pathname = '/experiment/' + variant + url.pathname;
  return fetch(url.toString(), request);
}

// Use cases at the edge:
// - Authentication / JWT validation (avoid origin hit for every request)
// - A/B testing and feature flags
// - Geo-based redirects and content personalisation
// - Request deduplication and coalescing
// - Bot detection and WAF rules</pre>`}
          ]
        }
      ]
    },

    /* =====================================================
       PART 6 · API DESIGN
    ===================================================== */
    {
      label: "PART 6 · API DESIGN",
      sections: [
        {
          id: "api-design", n: 6, title: "API Design — REST Best Practices, Versioning, Rate Limiting, Auth",
          desc: "Good API design makes systems easy to consume, evolve, and secure. MAANG interviews test your ability to design APIs that are stable and developer-friendly.",
          questions: [
            {n:1, t:"REST API design best practices — resources, methods, status codes", d:["beginner","intermediate"], a:`
<p>REST resources are nouns. HTTP verbs express the action. Status codes communicate the outcome.</p>
<pre>-- Resources are nouns, not verbs
GET    /users           -- list users
POST   /users           -- create user
GET    /users/123       -- get user 123
PUT    /users/123       -- replace user 123 (full update)
PATCH  /users/123       -- partial update user 123
DELETE /users/123       -- delete user 123
GET    /users/123/orders -- user 123's orders (nested resource)</pre>
<table>
  <tr><th>Status Code</th><th>Meaning</th></tr>
  <tr><td>200 OK</td><td>Success — GET, PUT, PATCH</td></tr>
  <tr><td>201 Created</td><td>Resource created — POST with Location header</td></tr>
  <tr><td>204 No Content</td><td>Success, no body — DELETE</td></tr>
  <tr><td>400 Bad Request</td><td>Invalid request body or params</td></tr>
  <tr><td>401 Unauthorized</td><td>Not authenticated</td></tr>
  <tr><td>403 Forbidden</td><td>Authenticated but no permission</td></tr>
  <tr><td>404 Not Found</td><td>Resource doesn't exist</td></tr>
  <tr><td>409 Conflict</td><td>Duplicate, version conflict</td></tr>
  <tr><td>422 Unprocessable</td><td>Validation errors (semantically invalid)</td></tr>
  <tr><td>429 Too Many Requests</td><td>Rate limit exceeded</td></tr>
  <tr><td>500 Internal Server Error</td><td>Server-side bug</td></tr>
  <tr><td>503 Service Unavailable</td><td>Server down / overloaded</td></tr>
</table>`},

            {n:2, t:"API versioning strategies — URI, header, content negotiation", d:["intermediate","advanced"], a:`
<table>
  <tr><th>Strategy</th><th>Example</th><th>Pros / Cons</th></tr>
  <tr><td>URI versioning</td><td>/api/v1/users</td><td>Simple, visible, cacheable. URI changes on version bump.</td></tr>
  <tr><td>Header versioning</td><td>API-Version: 2</td><td>Clean URIs. Harder to test in browser.</td></tr>
  <tr><td>Content negotiation</td><td>Accept: application/vnd.api+json;version=2</td><td>Most RESTful. Complex to implement.</td></tr>
  <tr><td>Query param</td><td>/api/users?v=2</td><td>Easy but pollutes URIs and breaks caching.</td></tr>
</table>
<pre>-- MAANG recommendation: URI versioning for external APIs
GET /v1/orders   -- old clients still work
GET /v2/orders   -- new clients use v2

-- Version lifecycle
-- Announce deprecation → support old version 12-18 months → sunset
-- Include Deprecation header in responses
Deprecation: true
Sunset: Sat, 01 Jan 2026 00:00:00 GMT
Link: &lt;https://docs.example.com/v2&gt;; rel="successor-version"</pre>`},

            {n:3, t:"Rate limiting — algorithms and implementation", d:["intermediate","advanced"], a:`
<p>Rate limiting protects your API from abuse, DDoS, and runaway clients.</p>
<table>
  <tr><th>Algorithm</th><th>How</th><th>Behaviour</th></tr>
  <tr><td>Fixed Window</td><td>Count requests in a fixed time window (e.g. 100/minute)</td><td>Burst allowed at window boundary (100 at :59, 100 at :00)</td></tr>
  <tr><td>Sliding Window Log</td><td>Record each request timestamp; count in past 60s</td><td>Accurate, no boundary burst. High memory for large limits.</td></tr>
  <tr><td>Sliding Window Counter</td><td>Blend current + previous window with weighting</td><td>Approximate, low memory, good accuracy</td></tr>
  <tr><td>Token Bucket</td><td>Bucket holds N tokens. Each request consumes 1. Tokens refill at rate R/sec.</td><td>Allows burst up to bucket size, then limits to refill rate</td></tr>
  <tr><td>Leaky Bucket</td><td>Requests enter a queue, processed at fixed rate</td><td>Smooth output, absorbs bursts</td></tr>
</table>
<pre>-- Redis token bucket implementation
local tokens = redis.call('GET', key) or capacity
local now = tonumber(ARGV[1])
local last = tonumber(redis.call('GET', key..':ts') or now)
local elapsed = now - last
local refill = elapsed * rate
tokens = math.min(capacity, tokens + refill)
if tokens &gt;= 1 then
  tokens = tokens - 1
  redis.call('SET', key, tokens)
  redis.call('SET', key..':ts', now)
  return 1  -- allowed
else
  return 0  -- rejected
end

-- Response headers (let clients know limits)
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 732
X-RateLimit-Reset: 1715000000
Retry-After: 47</pre>`},

            {n:4, t:"Authentication — API Keys, JWT, OAuth 2.0 — when to use each", d:["intermediate","advanced"], a:`
<table>
  <tr><th>Mechanism</th><th>How</th><th>Best for</th></tr>
  <tr><td>API Key</td><td>Static secret in Authorization header or query param</td><td>Server-to-server, simple M2M, public API access</td></tr>
  <tr><td>JWT (stateless)</td><td>Signed token with claims; server validates signature without DB lookup</td><td>Scalable stateless auth; mobile/SPA clients</td></tr>
  <tr><td>OAuth 2.0</td><td>Delegated auth; user grants app access to their resources</td><td>"Login with Google", third-party app access</td></tr>
  <tr><td>Session Cookie</td><td>Server stores session; client sends session ID cookie</td><td>Traditional web apps, SSR</td></tr>
  <tr><td>mTLS</td><td>Both client and server present certificates</td><td>Internal service-to-service in zero-trust networks</td></tr>
</table>
<pre>// JWT structure: header.payload.signature
// Header: {"alg":"HS256","typ":"JWT"}
// Payload: {"sub":"user123","iat":1715000000,"exp":1715086400,"role":"admin"}
// Signature: HMACSHA256(base64(header)+"."+base64(payload), secret)

// JWT validation — no DB lookup needed (stateless)
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// JWT problem: cannot revoke before expiry
// Solution: short-lived access token (15 min) + refresh token (7 days in DB)
// On logout: delete refresh token from DB</pre>`},

            {n:5, t:"Idempotency — why it matters and how to implement it", d:["intermediate","advanced"], a:`
<p>An operation is <strong>idempotent</strong> if calling it multiple times has the same effect as calling it once. Critical for safe retries in distributed systems.</p>
<pre>-- HTTP idempotency by method
GET    → Idempotent (read only)
DELETE → Idempotent (deleting 2x = deleted)
PUT    → Idempotent (full replacement 2x = same result)
POST   → NOT idempotent by default (creates new resource each time)
PATCH  → Depends on implementation

-- Making POST idempotent: Idempotency Key
POST /payments
Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000

// Server: store (idempotency_key → response) in Redis for 24h
// On retry: if key exists, return stored response (don't charge again)
// If key doesn't exist: process payment, store response</pre>
<p><strong>MAANG use case:</strong> Payment APIs (Stripe uses this pattern), order creation, email sends. If the network drops after you charge but before you respond — the client retries safely.</p>`},

            {n:6, t:"API Gateway — what it does and why every microservice system needs one", d:["intermediate","advanced"], a:`
<pre>Client
  │
  ▼
API Gateway  ─── Auth (JWT/OAuth validation)
              ─── Rate limiting (per user/API key)
              ─── SSL termination
              ─── Request routing (path → service)
              ─── Request/response transformation
              ─── Circuit breaker (protect backends)
              ─── Logging + tracing injection
              ─── Caching (simple GET responses)
  │
  ├──→ User Service
  ├──→ Order Service
  ├──→ Product Service
  └──→ Payment Service

-- Popular API Gateways
Kong          — open source, plugin-based, high performance
AWS API GW    — fully managed, integrates with Lambda, Cognito
NGINX         — high-performance reverse proxy / gateway
Envoy         — L7 proxy, used in service meshes (Istio)
Spring GW     — Java/Spring ecosystem gateway</pre>`}
          ]
        }
      ]
    },

    /* =====================================================
       PART 7 · MESSAGING & ASYNC PATTERNS
    ===================================================== */
    {
      label: "PART 7 · MESSAGING & ASYNC PATTERNS",
      sections: [
        {
          id: "messaging", n: 7, title: "Message Queues, Kafka, Event-Driven Architecture",
          desc: "Async messaging decouples producers from consumers, enables resilience, and handles traffic spikes. Core to every MAANG backend.",
          questions: [
            {n:1, t:"Why use a message queue? Synchronous vs asynchronous patterns", d:["beginner","intermediate"], a:`
<p>Synchronous calls block the caller until the callee responds. For operations that don't need an immediate result, async queues decouple and buffer work.</p>
<pre>-- Synchronous (direct call) — simple but tightly coupled
Order Service → HTTP → Email Service → HTTP → SMS Service
If Email Service is down → Order fails

-- Asynchronous (message queue) — resilient and scalable
Order Service → Kafka "order-created" topic
  Email Service (consumer) reads from topic → sends email (can be slow, can retry)
  SMS Service   (consumer) reads from topic → sends SMS
  Analytics     (consumer) reads from topic → updates dashboard</pre>
<p><strong>When to use a queue:</strong></p>
<ul>
  <li>Work that can be processed later (email, notification, report generation)</li>
  <li>Rate mismatches between producer and consumer</li>
  <li>Fan-out to multiple consumers</li>
  <li>Reliable delivery with retries</li>
  <li>Traffic spike buffering (queue absorbs burst; workers drain at their own pace)</li>
</ul>`},

            {n:2, t:"Kafka vs RabbitMQ vs SQS — key differences and when to choose", d:["intermediate","advanced"], a:`
<table>
  <tr><th>Dimension</th><th>Kafka</th><th>RabbitMQ</th><th>AWS SQS</th></tr>
  <tr><td>Model</td><td>Log-based (topic/partition/offset)</td><td>Queue (push to consumer)</td><td>Queue (pull from queue)</td></tr>
  <tr><td>Message retention</td><td>Configurable (days/forever)</td><td>Until acknowledged</td><td>Up to 14 days</td></tr>
  <tr><td>Replay</td><td>Yes — seek to any offset</td><td>No (consumed = gone)</td><td>No</td></tr>
  <tr><td>Throughput</td><td>Millions/sec</td><td>Thousands/sec</td><td>Thousands/sec (per queue)</td></tr>
  <tr><td>Ordering</td><td>Per partition</td><td>Per queue (FIFO mode)</td><td>FIFO queue option</td></tr>
  <tr><td>Consumer model</td><td>Pull, consumer groups</td><td>Push (competing consumers)</td><td>Pull (competing consumers)</td></tr>
  <tr><td>Ops overhead</td><td>High</td><td>Medium</td><td>Zero (managed)</td></tr>
  <tr><td>Best for</td><td>Event streaming, audit log, CDC, high throughput</td><td>Task queues, RPC, complex routing</td><td>Simple decoupling in AWS ecosystem</td></tr>
</table>`},

            {n:3, t:"Kafka internals — topics, partitions, consumer groups, offsets", d:["intermediate","advanced"], a:`
<pre>-- Kafka topology
Topic "order-events"
  Partition 0: [msg1, msg2, msg5, ...]
  Partition 1: [msg3, msg6, ...]
  Partition 2: [msg4, msg7, ...]

-- Producer sends to partition by key hash (same order_id → same partition)
producer.send(new ProducerRecord("order-events", orderId, event));

-- Consumer group: each partition assigned to exactly one consumer
Consumer Group "email-service":
  Consumer A → Partition 0
  Consumer B → Partition 1
  Consumer C → Partition 2
-- Each consumer tracks its own offset (position in partition)

-- Multiple consumer groups read the SAME topic independently
Consumer Group "email-service"   → reads at offset 1000
Consumer Group "analytics"       → reads at offset 850 (slower, that's fine)
Consumer Group "audit-log"       → reads at offset 1000</pre>
<p><strong>Key design decisions:</strong> Partition count = max parallelism. Choose partition key for ordering guarantees (same entity events on same partition). Consumer group count = number of independent processing pipelines.</p>`},

            {n:4, t:"Exactly-once delivery — at-most-once, at-least-once, exactly-once", d:["advanced","expert"], a:`
<table>
  <tr><th>Guarantee</th><th>Risk</th><th>How</th></tr>
  <tr><td>At-most-once</td><td>Message lost (fire-and-forget)</td><td>Send without waiting for ACK; no retry</td></tr>
  <tr><td>At-least-once</td><td>Duplicate messages (retry on failure)</td><td>Retry until ACK; consumer must be idempotent</td></tr>
  <tr><td>Exactly-once</td><td>Neither lost nor duplicated</td><td>Kafka transactions + idempotent producers + transactional consumers</td></tr>
</table>
<pre>// Exactly-once in Kafka (idempotent producer + transactions)
producer.initTransactions();
producer.beginTransaction();
producer.send(new ProducerRecord("output-topic", key, value));
producer.sendOffsetsToTransaction(offsets, groupMetadata);
producer.commitTransaction();

// Practical alternative: at-least-once + idempotent consumer
// Consumer checks: have I processed this message ID before?
if (!processedIds.contains(msg.id())) {
  process(msg);
  processedIds.add(msg.id());
}</pre>`},

            {n:5, t:"Dead letter queues — handling poison messages", d:["intermediate","advanced"], a:`
<p>A dead letter queue (DLQ) receives messages that failed processing after all retries — preventing one bad message from blocking the entire queue.</p>
<pre>-- Flow
Message arrives → Consumer tries to process → fails
  → Retry 1 (backoff 1s) → fails
  → Retry 2 (backoff 2s) → fails
  → Retry 3 (backoff 4s) → fails
  → Send to Dead Letter Queue → alert on-call

-- SQS DLQ setup
{
  "deadLetterTargetArn": "arn:aws:sqs:us-east-1:123:my-dlq",
  "maxReceiveCount": 3  -- after 3 failures, move to DLQ
}

-- DLQ monitoring
-- Alert if DLQ message count > 0
-- Periodically replay DLQ after fixing the bug:
awslocal sqs receive-message --queue-url http://localhost:4566/queue/my-dlq</pre>`},

            {n:6, t:"Saga pattern — distributed transactions across microservices", d:["advanced","expert"], a:`
<p>When a business transaction spans multiple services, you can't use a DB transaction. The Saga pattern sequences local transactions with compensating actions on failure.</p>
<pre>-- Example: Book flight + hotel + car (each is a separate service)

-- Choreography saga (event-driven, no central coordinator)
OrderService    → publishes "order-created"
PaymentService  → consumes "order-created" → charges card → publishes "payment-done"
InventoryService→ consumes "payment-done" → reserves item → publishes "item-reserved"
ShipService     → consumes "item-reserved" → schedules ship

-- If payment fails:
PaymentService → publishes "payment-failed"
OrderService   → consumes "payment-failed" → cancels order (compensating transaction)

-- Orchestration saga (central coordinator tells each service what to do)
OrderSaga (orchestrator):
  1. Call PaymentService.charge()     → success
  2. Call InventoryService.reserve()  → fails
  3. Call PaymentService.refund()     → compensate step 1

-- Choreography: simpler, more decoupled. Harder to trace/debug.
-- Orchestration: easier to understand flow. Single point of failure risk.</pre>`}
          ]
        }
      ]
    },

    /* =====================================================
       PART 8 · STORAGE & DATABASES
    ===================================================== */
    {
      label: "PART 8 · STORAGE CHOICES",
      sections: [
        {
          id: "storage", n: 8, title: "Choosing the Right Storage — SQL, NoSQL, Object, Search, Time-Series",
          desc: "Picking the right storage engine is a core system design skill. There is no one-size-fits-all — match workload to engine.",
          questions: [
            {n:1, t:"Storage engine decision guide — which database for what use case?", d:["beginner","intermediate"], a:`
<table>
  <tr><th>Engine</th><th>Best for</th><th>Examples</th></tr>
  <tr><td>Relational (SQL)</td><td>Structured data, ACID transactions, complex queries, reporting</td><td>PostgreSQL, MySQL, Oracle</td></tr>
  <tr><td>Document</td><td>Semi-structured, evolving schema, nested objects</td><td>MongoDB, CouchDB, Firestore</td></tr>
  <tr><td>Key-Value</td><td>Cache, sessions, rate limiting, counters</td><td>Redis, DynamoDB (simple access)</td></tr>
  <tr><td>Wide-Column</td><td>High-write, time-series-like, massive scale</td><td>Cassandra, HBase, DynamoDB</td></tr>
  <tr><td>Graph</td><td>Social networks, fraud detection, recommendation</td><td>Neo4j, Amazon Neptune</td></tr>
  <tr><td>Search</td><td>Full-text search, faceted search, log analysis</td><td>Elasticsearch, OpenSearch, Solr</td></tr>
  <tr><td>Time-Series</td><td>Metrics, IoT sensor data, financial ticks</td><td>InfluxDB, TimescaleDB, Prometheus</td></tr>
  <tr><td>Object Storage</td><td>Blobs — images, videos, backups, ML datasets</td><td>S3, GCS, Azure Blob</td></tr>
  <tr><td>In-memory</td><td>Sub-millisecond latency reads, leaderboards, pub-sub</td><td>Redis, Memcached</td></tr>
</table>`},

            {n:2, t:"How does Cassandra handle write-heavy workloads at massive scale?", d:["advanced","expert"], a:`
<p>Cassandra is optimised for write throughput and linear horizontal scale — no master bottleneck.</p>
<pre>-- Architecture
Ring topology: multiple nodes, each responsible for a range of token space
Write path:
  1. Write to commit log (sequential disk write — fast)
  2. Write to in-memory MemTable
  3. Flush MemTable to SSTable on disk (periodic)
  4. Compaction: merge SSTables, remove tombstones

-- Replication factor: 3 means 3 nodes hold a copy
-- Consistency level: QUORUM reads/writes = (3/2)+1 = 2 nodes must agree

-- Partition key (determines which node stores the row)
-- Clustering key (determines sort order within partition)
CREATE TABLE user_events (
  user_id UUID,
  event_time TIMESTAMP,
  event_type TEXT,
  PRIMARY KEY (user_id, event_time)
) WITH CLUSTERING ORDER BY (event_time DESC);</pre>
<p><strong>Cassandra is bad at:</strong> Joins, aggregations, ad-hoc queries. Design your table schema around your access patterns — not around normalisation.</p>`},

            {n:3, t:"Object storage (S3) — how it works and design patterns", d:["intermediate"], a:`
<pre>-- S3 structure
Bucket → Objects (key-value, any size, any format)
Key: "uploads/users/123/profile.jpg"

-- Pre-signed URLs — let clients upload/download directly without going through your server
// Generate pre-signed upload URL (1 hour expiry)
String url = s3.generatePresignedUrl("my-bucket", "uploads/photo.jpg",
    new Date(System.currentTimeMillis() + 3600000), HttpMethod.PUT);
// Client uploads directly to S3 — your server never touches the bytes

-- Design patterns
-- Signed URL for private content (no public access to bucket)
-- CDN (CloudFront) in front of S3 for fast delivery
-- S3 event notifications → Lambda/SQS → thumbnail generation, virus scan
-- Multi-part upload for large files (&gt; 100 MB)
-- S3 Intelligent-Tiering for automatic cost optimisation (moves cold objects to Glacier)</pre>`},

            {n:4, t:"Elasticsearch — how full-text search works internally", d:["advanced"], a:`
<pre>-- Elasticsearch uses inverted index (same concept as book index)
-- "performance" → [doc3, doc7, doc15]
-- "database"    → [doc1, doc3, doc9]
-- Query: "database performance" → intersect → [doc3]

-- Index → Shards → Replicas
-- 1 index with 5 primary shards, 1 replica each = 10 total shards

PUT /products
{
  "settings": { "number_of_shards": 5, "number_of_replicas": 1 },
  "mappings": {
    "properties": {
      "name":        { "type": "text", "analyzer": "english" },
      "price":       { "type": "float" },
      "category_id": { "type": "keyword" }  -- exact match, not analysed
    }
  }
}

GET /products/_search
{
  "query": {
    "bool": {
      "must":   { "match": { "name": "laptop" } },
      "filter": { "range": { "price": { "gte": 500, "lte": 2000 } } }
    }
  },
  "sort": [{ "_score": "desc" }],
  "from": 0, "size": 10
}</pre>
<p><strong>MAANG tip:</strong> Use Elasticsearch alongside a primary DB (PostgreSQL). Write to PostgreSQL; replicate to Elasticsearch for search. Don't use Elasticsearch as your system of record — it's optimised for search, not ACID writes.</p>`}
          ]
        }
      ]
    },

    /* =====================================================
       PART 9 · SCALABILITY PATTERNS
    ===================================================== */
    {
      label: "PART 9 · SCALABILITY PATTERNS",
      sections: [
        {
          id: "scalability", n: 9, title: "Horizontal Scaling, Sharding, Consistent Hashing, CQRS",
          desc: "How to scale from hundreds to millions of users — the core scalability toolkit.",
          questions: [
            {n:1, t:"Vertical vs horizontal scaling — when and how to do each", d:["beginner","intermediate"], a:`
<table>
  <tr><th>Scaling</th><th>How</th><th>Limit</th><th>Best for</th></tr>
  <tr><td>Vertical (scale up)</td><td>Bigger machine (more CPU, RAM, IOPS)</td><td>Hardware ceiling; single point of failure</td><td>Databases, stateful services — do this first</td></tr>
  <tr><td>Horizontal (scale out)</td><td>More machines behind load balancer</td><td>Coordination overhead; stateless required</td><td>Stateless APIs, workers — do this when vertical is insufficient</td></tr>
</table>
<pre>-- Scaling journey for a typical system
Phase 1 (0–10k users): Single server (app + DB on one machine)
Phase 2 (10k–100k):    Separate app server + DB server; add read replica for DB
Phase 3 (100k–1M):     Multiple app servers behind LB; Redis cache; CDN for assets
Phase 4 (1M–10M):      DB sharding OR move to DynamoDB; queue workers; Kafka
Phase 5 (10M+):        Multiple regions; service decomposition; edge compute</pre>
<p><strong>Interview tip:</strong> Always scale the database last — it's the hardest. Add caching, read replicas, and query optimisation before sharding.</p>`},

            {n:2, t:"Consistent hashing — how it solves the resharding problem", d:["advanced","expert"], a:`
<p>Simple hash (key % N servers) means adding/removing a server remaps almost all keys — causing cache misses or data migration at scale.</p>
<pre>-- Problem with simple hash
5 servers: key % 5 → server 0-4
Add 6th server: key % 6 → almost everything remaps (83% of keys move)

-- Consistent hashing solution
Imagine all server positions on a ring (0 to 2^32-1)
Server hashed to a position on the ring
Key hashed to a position on the ring → assigned to next server clockwise

-- Adding a server: only keys between new server and its predecessor move
-- Removing a server: only that server's keys move to its successor

-- Virtual nodes: each physical server gets N virtual nodes on the ring
-- Provides more even load distribution and smoother node removal
-- Used by: Cassandra, Dynamo, Redis Cluster, CDN origin selection</pre>`},

            {n:3, t:"CQRS — Command Query Responsibility Segregation", d:["advanced","expert"], a:`
<p>CQRS separates the write model (Commands) from the read model (Queries). Each is optimised independently.</p>
<pre>-- Traditional: one model serves reads and writes (often suboptimal for both)
-- CQRS: separate models

Write side (Command):
  POST /orders  → OrderService → validates → writes to PostgreSQL (normalised)

Read side (Query):
  GET /orders?userId=123 → Query service → reads from Read DB (denormalised view)
  → The Read DB is a materialized projection, synced via events

-- Event flow
Command → Event ("OrderCreated") → EventBus (Kafka)
  → Read model projector consumes event
  → Writes denormalised view to Read DB (Elasticsearch, MongoDB, Redis)

-- Benefits
Read model can be optimised for specific query patterns (pre-joined, pre-aggregated)
Read and write can scale independently
Multiple read models for different consumers

-- Complexity
Eventual consistency between write and read sides
More moving parts to build and operate</pre>`},

            {n:4, t:"Database read replicas — how to use them and their limitations", d:["intermediate","advanced"], a:`
<pre>-- Setup: one primary (writes), N replicas (reads)
App → Write → Primary PostgreSQL
App → Read  → Replica 1 (sync lag: ~10-100ms typically)
App → Read  → Replica 2
App → Read  → Replica 3

-- Use cases for replicas
Reporting / analytics queries (avoid impacting production primary)
Read-heavy API endpoints (product catalog, search)
Backup / ETL reads

-- Limitations
Replication lag: replica may be 100ms-1s behind primary
"Read-your-writes" violation: you wrote to primary, immediately read from replica → may not see your write
Solution: after a write, read from primary for that user's next request (sticky read window)</pre>
<pre>// Read-your-writes: route reads to primary for 1 second after a write
if (userRecentlyWrote(userId)) {
  return primaryDB.query(sql);
} else {
  return replicaDB.query(sql);
}</pre>`},

            {n:5, t:"Hotspot / hot key problem and how to solve it", d:["advanced","expert"], a:`
<p>A hot key is a single cache key or DB row that gets disproportionate traffic — one shard or server handles all load for it.</p>
<pre>-- Example: trending tweet by a celebrity — 10M reads/sec for one tweet

-- Solution 1: Local in-process cache (scatter the load)
// Each app server caches the tweet locally for 1 second
// 1000 app servers × 10M/1000 = 10K req/sec per server (manageable)

-- Solution 2: Read through multiple Redis replicas
// Round-robin reads across 10 Redis replicas of the same data
// Each replica handles 1M req/sec instead of 10M

-- Solution 3: Key splitting (sharding the key)
// Instead of tweet:12345, use tweet:12345:shard:0 to tweet:12345:shard:9
// Clients randomly pick a shard → distributed reads

-- Solution 4: Fan-out on write (pre-distribute to followers)
// When tweet is posted, push to each follower's timeline cache
// Read becomes local, not hotspot
// Used by Twitter for non-mega-celebrities (100M followers → use pull)</pre>`},

            {n:6, t:"Circuit breaker pattern — preventing cascade failures", d:["advanced"], a:`
<p>Without circuit breakers, a slow/failing downstream service can cause threads to pile up and take down your entire service.</p>
<pre>-- States
CLOSED → requests pass through (normal)
OPEN   → requests fail immediately (no downstream call) — fail fast
HALF_OPEN → one probe request to test if downstream recovered

-- Transition
CLOSED: if error rate &gt; threshold (50%) → OPEN
OPEN: after timeout (30s) → HALF_OPEN
HALF_OPEN: if probe succeeds → CLOSED; if fails → OPEN again

-- Resilience4j (Java)
CircuitBreakerConfig config = CircuitBreakerConfig.custom()
  .failureRateThreshold(50)          // open if 50% of calls fail
  .waitDurationInOpenState(Duration.ofSeconds(30))
  .slidingWindowSize(10)
  .build();

CircuitBreaker cb = CircuitBreakerRegistry.of(config).circuitBreaker("paymentService");

String result = cb.executeSupplier(() -> paymentService.charge(request));

// Fallback
return Failsafe.with(cb, fallback)
  .get(() -> paymentService.charge(request));</pre>`}
          ]
        }
      ]
    },

    /* =====================================================
       PART 10 · RELIABILITY & FAULT TOLERANCE
    ===================================================== */
    {
      label: "PART 10 · RELIABILITY & FAULT TOLERANCE",
      sections: [
        {
          id: "reliability", n: 10, title: "High Availability, Replication, Failover, Disaster Recovery",
          desc: "Reliability engineering separates good systems from great ones. These concepts are tested in every MAANG senior engineering interview.",
          questions: [
            {n:1, t:"What is high availability and how do you design for it?", d:["beginner","intermediate"], a:`
<p>High availability (HA) means the system remains operational despite failures. Availability is measured as uptime percentage.</p>
<table>
  <tr><th>SLA</th><th>Downtime/year</th><th>Downtime/month</th></tr>
  <tr><td>99%</td><td>87.6 hours</td><td>7.3 hours</td></tr>
  <tr><td>99.9% (three nines)</td><td>8.76 hours</td><td>43.8 minutes</td></tr>
  <tr><td>99.99% (four nines)</td><td>52.6 minutes</td><td>4.4 minutes</td></tr>
  <tr><td>99.999% (five nines)</td><td>5.26 minutes</td><td>26 seconds</td></tr>
</table>
<p><strong>HA design principles:</strong></p>
<ul>
  <li>Eliminate single points of failure (redundant LBs, replicated DBs, multi-AZ deployment)</li>
  <li>Graceful degradation (serve reduced functionality when a dependency fails)</li>
  <li>Automatic failover (health checks + LB removes unhealthy instances in seconds)</li>
  <li>Geographic redundancy for regional outages</li>
  <li>Bulkhead isolation (one failing component doesn't cascade to all)</li>
</ul>`},

            {n:2, t:"RTO and RPO — what they mean and how to design for them", d:["intermediate","advanced"], a:`
<table>
  <tr><th>Metric</th><th>Definition</th><th>Design lever</th></tr>
  <tr><td>RTO (Recovery Time Objective)</td><td>Max acceptable downtime after failure — "how fast must we recover?"</td><td>Automated failover, warm standby, hot standby</td></tr>
  <tr><td>RPO (Recovery Point Objective)</td><td>Max acceptable data loss — "how much data can we afford to lose?"</td><td>Replication frequency, synchronous vs async replication, backup interval</td></tr>
</table>
<pre>-- RTO / RPO tiers
Cold standby   → RTO: hours   / RPO: hours   (restore from backup)
Warm standby   → RTO: minutes / RPO: minutes (replica is running, switch is manual)
Hot standby    → RTO: seconds / RPO: seconds (active-active or sync replication + auto failover)
Active-active  → RTO: &lt;1s    / RPO: 0       (all nodes serve traffic; highest cost)</pre>`},

            {n:3, t:"Bulkhead pattern — fault isolation in distributed systems", d:["advanced"], a:`
<p>A bulkhead isolates failures to prevent cascade. Named after ship compartments that contain flooding to one section.</p>
<pre>-- Thread pool bulkhead: separate thread pools per downstream service
// If Payment Service is slow, its thread pool fills up — doesn't affect User Service thread pool
@Bulkhead(name = "paymentService", type = Bulkhead.Type.THREADPOOL)
public CompletableFuture&lt;PaymentResult&gt; charge(PaymentRequest req) { ... }

-- Connection pool bulkhead: separate DB connection pools
DataSource userServicePool  = new HikariPool(maxPoolSize = 20);
DataSource orderServicePool = new HikariPool(maxPoolSize = 20);
// If order queries slow down and exhaust orderServicePool, userServicePool still works

-- Kubernetes bulkhead: separate namespaces with resource quotas
// Orders namespace: max 4 CPU / 8 GB RAM
// Payments namespace: max 8 CPU / 16 GB RAM
// One namespace runaway can't starve the other</pre>`},

            {n:4, t:"Retry patterns — exponential backoff, jitter, retry budget", d:["intermediate","advanced"], a:`
<pre>-- Naive retry is dangerous: all clients retry at the same time → thundering herd
// BAD: fixed retry
for (int i = 0; i &lt; 3; i++) {
  try { return callService(); } catch (Exception e) { Thread.sleep(1000); }
}

// GOOD: exponential backoff with jitter
for (int attempt = 0; attempt &lt; maxAttempts; attempt++) {
  try { return callService(); }
  catch (RetryableException e) {
    long delay = (long)(baseDelay * Math.pow(2, attempt));
    long jitter = (long)(Math.random() * delay);  // spread retries randomly
    Thread.sleep(delay + jitter);
  }
}

-- Full jitter (AWS recommendation):
delay = random(0, min(cap, base * 2^attempt))

-- Retry budget: don't retry more than X% of total requests
// If 50% of requests are retries, you're doubling load on an already stressed service
// Set maxRetries per request AND max retry rate system-wide</pre>`},

            {n:5, t:"Timeout strategy — how to set timeouts correctly", d:["intermediate","advanced"], a:`
<p>Timeouts prevent thread starvation from slow dependencies. Setting them correctly is an art.</p>
<pre>-- Types
Connection timeout: time to establish TCP connection (set low: 100-500ms)
Read timeout: time to receive response after connection established (set by SLA)

-- Setting timeouts
P99 latency of downstream service: 200ms
Read timeout: 2-3x P99 = 400-600ms (room for occasional slow requests)
Circuit breaker threshold: 50% of calls failing or P99 &gt; timeout

// RestTemplate (Spring)
restTemplate.setRequestFactory(factory);
factory.setConnectTimeout(200);    // 200ms to connect
factory.setReadTimeout(500);       // 500ms to read response

// Propagate deadlines in microservices (Google Stubby / gRPC deadline)
// When a user request has 1000ms budget and calls 3 services:
// Service A gets 300ms, B gets 300ms, C gets 300ms (budget propagation)</pre>`}
          ]
        }
      ]
    },

    /* =====================================================
       PART 11 · CONSISTENCY & DISTRIBUTED SYSTEMS
    ===================================================== */
    {
      label: "PART 11 · CONSISTENCY MODELS",
      sections: [
        {
          id: "consistency", n: 11, title: "Consistency Models — Strong, Eventual, Causal, Session",
          desc: "Consistency is the most nuanced topic in distributed systems. These questions separate L5 from L6 at MAANG.",
          questions: [
            {n:1, t:"What are the different consistency models and when do you need each?", d:["advanced","expert"], a:`
<table>
  <tr><th>Model</th><th>Guarantee</th><th>Latency</th><th>Use case</th></tr>
  <tr><td>Linearisability (Strong)</td><td>Every operation appears instantaneous; all clients see same order</td><td>High (sync replication)</td><td>Distributed locks, leader election, financial ledgers</td></tr>
  <tr><td>Sequential</td><td>Operations appear in some total order consistent with each process's order</td><td>Medium</td><td>Multi-player game state</td></tr>
  <tr><td>Causal</td><td>Causally related operations seen in order; concurrent ops may differ</td><td>Low</td><td>Social comments (reply always after post)</td></tr>
  <tr><td>Read-your-writes</td><td>You always see your own writes</td><td>Low</td><td>Profile updates, settings</td></tr>
  <tr><td>Monotonic reads</td><td>Once you see a value, you never see older value</td><td>Low</td><td>Timeline feeds</td></tr>
  <tr><td>Eventual</td><td>All replicas converge eventually with no further updates</td><td>Very low</td><td>DNS, shopping carts, notifications</td></tr>
</table>`},

            {n:2, t:"Distributed locks — how to implement them safely", d:["advanced","expert"], a:`
<pre>-- Distributed lock with Redis (Redlock algorithm)
-- Problem: two instances must not process the same job concurrently

-- Simple Redis lock (SET NX EX)
boolean locked = redis.set("lock:job:456", uniqueId, "NX", "EX", 30);
// NX = only set if Not Exists
// EX 30 = expire after 30 seconds (prevents deadlock if process crashes)
if (locked) {
  try { processJob(456); }
  finally { 
    // Only delete if we still own the lock (check value = our uniqueId)
    if (uniqueId.equals(redis.get("lock:job:456"))) {
      redis.del("lock:job:456");
    }
  }
}

-- Redlock: acquire lock on N/2+1 Redis nodes independently
-- More resilient to single Redis node failure

-- ZooKeeper: use ephemeral znodes for distributed locks
-- ZK is strongly consistent (ZAB consensus) — safer than Redis for critical locks</pre>`},

            {n:3, t:"Two-phase commit (2PC) vs Saga — distributed transaction choices", d:["expert"], a:`
<table>
  <tr><th>Approach</th><th>Atomicity</th><th>Availability</th><th>Latency</th><th>Use when</th></tr>
  <tr><td>2PC (Two-Phase Commit)</td><td>Strong (all-or-nothing)</td><td>Low (blocks on coordinator failure)</td><td>High (2 round trips)</td><td>Same org, controllable services, short transactions</td></tr>
  <tr><td>Saga (choreography)</td><td>Eventual (compensating transactions)</td><td>High</td><td>Low</td><td>Microservices, long-running business transactions</td></tr>
</table>
<pre>-- 2PC phases
Phase 1 (Prepare): Coordinator asks all participants "can you commit?"
  All participants: log prepare record, lock resources, reply YES/NO
Phase 2 (Commit/Abort): If all YES → commit; if any NO → abort
  Participants execute commit or rollback

-- Problem: if coordinator crashes between phases → participants hold locks forever

-- Saga is preferred in microservices because:
-- No distributed lock held across services
-- Services are independently available
-- Compensating transactions handle rollback (may be eventual)</pre>`},

            {n:4, t:"Vector clocks and conflict resolution in eventual consistency", d:["expert"], a:`
<pre>-- Problem: two clients update the same key on different replicas concurrently
-- Replica A: user sets name="Alice" at time T1
-- Replica B: user sets name="Alicia" at time T1 (concurrent, no causal link)
-- Both replicas sync → conflict!

-- Vector clocks track causality
Node A: {A:1}        → update name="Alice"
Node B: {B:1}        → update name="Alicia" (concurrent — neither knows about other)
After sync: {A:1, B:1} → conflict detected (neither dominates)

-- Conflict resolution strategies
Last Write Wins (LWW): use wall clock timestamp → Alice vs Alicia → pick later timestamp
  Problem: clock skew can cause wrong winner
Multi-value register: keep both values, let application merge (DynamoDB, Riak)
CRDTs: data structures that merge automatically without conflicts
  G-Counter: grow-only counter (just take the max per node)
  OR-Set: add-wins set (track unique tags per add operation)</pre>`}
          ]
        }
      ]
    },

    /* =====================================================
       PART 12 · CLASSIC SYSTEM DESIGN PROBLEMS
    ===================================================== */
    {
      label: "PART 12 · CLASSIC MAANG DESIGN PROBLEMS",
      sections: [
        {
          id: "classic-designs", n: 12, title: "Design Twitter, URL Shortener, Rate Limiter, Notification System",
          desc: "These are the most-asked system design problems at MAANG companies. Practice the structure, not just the answer.",
          questions: [
            {n:1, t:"Design a URL shortener (like bit.ly)", d:["intermediate","advanced"], a:`
<pre>-- Requirements
Write: 100M short URLs/day = 1200 writes/sec
Read: 10:1 ratio = 12,000 redirects/sec
URL lifetime: 5 years
Storage: ~400 TB over 5 years (2.2 KB per entry)

-- Short code generation
Base62 (a-z, A-Z, 0-9): 7 chars = 62^7 = 3.5 trillion unique codes
Approach 1: MD5(longURL) → take first 7 chars (collision risk)
Approach 2: Auto-increment ID → encode to Base62 (predictable but simple)
Approach 3: Random 7-char Base62 with DB uniqueness check

-- DB schema
shortcodes: short_code(PK), long_url, user_id, created_at, expires_at, click_count

-- Architecture
POST /shorten → API Server → check cache → write to DB → return short URL
GET /{code}  → API Server → check Redis cache → DB lookup → 302 redirect

-- Caching
Cache top 20% of URLs (Pareto — get 80% hit rate)
TTL: 1 hour for popular URLs
LRU eviction

-- Scale: read replicas for DB, Redis cluster for cache, CDN for redirect latency</pre>`},

            {n:2, t:"Design a Twitter-like timeline (fan-out on write vs read)", d:["advanced","expert"], a:`
<pre>-- The core problem: 300M users, some with 100M followers
-- Fan-out on write: when tweet is posted, push to every follower's timeline cache
-- Fan-out on read: when user opens app, pull tweets from all followees

-- Fan-out on write (push model)
Tweet posted → find all N followers → push to each follower's Redis timeline list
Pros: reads are O(1) — just fetch your list
Cons: Lady Gaga posts → 100M Redis writes in seconds (hotspot write)

-- Fan-out on read (pull model)
User opens app → query all followees → merge → sort by time
Pros: no fan-out cost on write
Cons: expensive read — merge N feeds, each needs a DB/cache query

-- Twitter's hybrid approach
Normal users (few followers): fan-out on write
Celebrity accounts (100M+ followers): fan-out on read
When you open your timeline:
  = your pre-built timeline (from normal followees) + on-demand celebrity tweets merged</pre>
<pre>-- Timeline data model (Redis list per user)
LPUSH timeline:userId tweetId (insert at head = newest first)
LTRIM timeline:userId 0 799   (keep only 800 most recent)
LRANGE timeline:userId 0 49   (fetch page 1 — 50 tweets)</pre>`},

            {n:3, t:"Design a rate limiter service", d:["intermediate","advanced"], a:`
<pre>-- Requirements
Limit: 1000 req/min per user API key
Distributed: works across 100 app servers
Low latency: &lt;5ms per check
Accurate: no double-counting across servers

-- Architecture
Client → API Gateway → Rate Limiter (Redis) → Backend Service

-- Redis sliding window counter (most practical)
Key: ratelimit:{api_key}:{current_minute}
INCR ratelimit:key123:202506011200
EXPIRE ratelimit:key123:202506011200 120  -- 2 minute TTL

-- Token bucket with Lua script (atomic)
-- Single Lua script = atomic check-and-update in Redis
-- See caching section for full Lua implementation

-- Response headers
HTTP 429 Too Many Requests
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1715000060
Retry-After: 47</pre>`},

            {n:4, t:"Design a notification system (push, email, SMS)", d:["intermediate","advanced"], a:`
<pre>-- Requirements
100M notifications/day across push, email, SMS
Priorities: critical (payment, security) vs non-critical (marketing)
Reliability: critical notifications must be delivered at-least-once

-- Architecture
Event producers (Order, Payment, Social) → Kafka "notification-events" topic
Notification Router (consumer):
  reads event → determines channels (push, email, SMS) → routes to channel queues

Push queue → iOS/Android worker → APNs / FCM
Email queue → Email worker → SES / SendGrid
SMS queue   → SMS worker   → Twilio

-- Separate queues per channel + per priority
high-priority-email queue (maxRetries=5, fast workers)
low-priority-email  queue (batch, slower workers)

-- Template service
notification-templates DB: template_id, channel, body_template
worker substitutes variables into template

-- Tracking
notification_log: id, user_id, channel, template_id, status, sent_at, delivered_at
Mark delivered via delivery webhooks (FCM, SES, Twilio all provide them)</pre>`},

            {n:5, t:"Design a search autocomplete system (type-ahead)", d:["advanced","expert"], a:`
<pre>-- Requirements
Latency: &lt;100ms
Scale: 10M searches/day
Top-K suggestions per prefix

-- Data structure: Trie (prefix tree)
-- Precompute top-10 suggestions for every prefix (offline job)
-- Store in Redis: autocomplete:sea → ["search", "seattle", "season", "seal", ...]

-- Architecture
Client types → debounce 100ms → GET /autocomplete?q=sea
  → check Redis (key: autocomplete:sea) → return top 10

-- Building the trie
Offline: aggregate search logs → count query frequencies → build top-10 per prefix
Store in Redis or a purpose-built trie service

-- At scale: Elasticsearch suggest API or Solr EdgeNGram tokeniser
-- Edge NGram creates prefix tokens at index time:
-- "search" → "s", "se", "sea", "sear", "searc", "search"
-- Query: match "sea" → finds "search" via edge ngram

-- Real-time updates: event stream of searches → Kafka → aggregation job → Redis update</pre>`},

            {n:6, t:"Design a distributed job scheduler", d:["advanced","expert"], a:`
<pre>-- Requirements
Schedule millions of jobs at specific times or intervals
At-least-once execution, idempotent jobs preferred
Horizontal scalability, no single point of failure

-- Components
Job Store: PostgreSQL (job definitions, next_run_at, status)
Scheduler: reads jobs where next_run_at &lt;= NOW() in a polling loop
Queue: Kafka or SQS (publishes job_id for workers to consume)
Workers: consume from queue, execute job, update status

-- Leader election for scheduler (only one scheduler fires at a time)
Use Redis SET NX with TTL, or ZooKeeper ephemeral node
Only the leader polls DB and publishes to queue

-- At-least-once safety
Worker acquires distributed lock per job_id before executing
UPDATE jobs SET status='RUNNING', worker_id=:wid
WHERE id=:id AND status='PENDING'
-- Optimistic locking prevents two workers from running same job

-- Handling stuck jobs
If job status='RUNNING' for &gt; 5 min → mark as FAILED → re-enqueue
Worker sends heartbeat every 30s while running</pre>`}
          ]
        }
      ]
    },

    /* =====================================================
       PART 13 · PRODUCTION & MICROSERVICE PATTERNS
    ===================================================== */
    {
      label: "PART 13 · PRODUCTION PATTERNS",
      sections: [
        {
          id: "production-patterns", n: 13, title: "Service Mesh, Observability, Event Sourcing, Strangler Fig",
          desc: "Patterns used daily at MAANG scale — service communication, observability, legacy migration, and data architecture.",
          questions: [
            {n:1, t:"Service mesh — what it is and why you need it at scale", d:["advanced","expert"], a:`
<p>A service mesh is an infrastructure layer that handles service-to-service communication — mTLS, retries, circuit breaking, distributed tracing — without changing application code.</p>
<pre>-- Without service mesh
Each service implements: retries, timeouts, circuit breakers, mTLS, tracing — in code

-- With service mesh (Istio / Linkerd)
Sidecar proxy (Envoy) injected alongside each service pod
Proxy intercepts all inbound/outbound traffic
Control plane configures proxies centrally

-- What service mesh gives you automatically
mTLS between all services (zero-trust network)
Distributed tracing (inject trace IDs, report to Jaeger/Zipkin)
Circuit breaking and retry policies (configured in YAML, no code)
Traffic shaping: canary (10% to v2), A/B routing, fault injection for testing
Observability: per-service latency, error rate, throughput dashboards</pre>`},

            {n:2, t:"Event sourcing — storing state as a sequence of events", d:["advanced","expert"], a:`
<pre>-- Traditional: store current state only
orders table: order_id=1, status=SHIPPED, total=100  (history lost)

-- Event sourcing: store all events, derive state by replaying
events:
  {order_id:1, type:"OrderCreated", amount:100, at:"09:00"}
  {order_id:1, type:"PaymentProcessed", amount:100, at:"09:01"}
  {order_id:1, type:"OrderShipped", tracking:"ABC", at:"09:30"}

Current state = replay all events for order 1

-- Benefits
Full audit trail — every state change recorded
Time travel — replay to any point in time
Event-driven integration — events can be published to Kafka
New read models — replay entire history to build new projections

-- Drawbacks
Query complexity (can't just SELECT current state — must project)
Storage grows indefinitely (snapshots periodically to avoid replaying 10M events)
Schema evolution for old events (version your event schemas)

-- Snapshot pattern: every N events, save a snapshot
-- Replay: load latest snapshot + events after snapshot timestamp</pre>`},

            {n:3, t:"Strangler fig pattern — migrating from monolith to microservices", d:["advanced"], a:`
<pre>-- Named after a vine that gradually surrounds and replaces a host tree

-- Phase 1: Intercept with a facade (reverse proxy / API gateway)
All traffic → API Gateway → Monolith (100% initially)

-- Phase 2: Extract and redirect one feature at a time
All traffic → API Gateway
  /api/payments → Payment Microservice (new)  ← redirected
  /api/*        → Monolith (everything else)

-- Phase 3: Gradually move features
  /api/payments → Payment Service
  /api/users    → User Service
  /api/orders   → Order Service
  /api/*        → Monolith (shrinking)

-- Phase 4: Monolith retired when all features extracted

-- Key rules:
-- Don't share DB between old and new at steady state (temporary bridge OK)
-- Feature flag: route 1% → new service → validate → increase to 100%
-- Keep monolith running until new service is proven in production</pre>`},

            {n:4, t:"Observability — logs, metrics, traces — the three pillars", d:["intermediate","advanced"], a:`
<table>
  <tr><th>Pillar</th><th>What</th><th>Tools</th><th>Use for</th></tr>
  <tr><td>Logs</td><td>Timestamped events with context</td><td>ELK, Loki, CloudWatch</td><td>Debugging specific errors, audit</td></tr>
  <tr><td>Metrics</td><td>Numeric measurements over time</td><td>Prometheus, Datadog, CloudWatch</td><td>Dashboards, alerts, capacity planning</td></tr>
  <tr><td>Traces</td><td>Request path across services with timing</td><td>Jaeger, Zipkin, AWS X-Ray</td><td>Latency debugging in microservices</td></tr>
</table>
<pre>// Structured logging (always log as JSON at scale)
log.info("Order processed",
  kv("order_id", orderId),
  kv("user_id", userId),
  kv("amount", amount),
  kv("duration_ms", elapsed));

// Key metrics to instrument (RED method for services)
// R: Request rate (req/sec)
// E: Error rate (5xx/total)
// D: Duration (P50, P95, P99 latency histograms)

// Distributed tracing (OpenTelemetry)
Span span = tracer.spanBuilder("processOrder").startSpan();
try (Scope s = span.makeCurrent()) {
  // ... business logic
  span.setAttribute("order.id", orderId);
} finally { span.end(); }</pre>`},

            {n:5, t:"Feature flags — safe deployments and A/B testing", d:["intermediate","advanced"], a:`
<pre>-- Feature flags decouple deployment from release
-- Deploy code with feature behind a flag → turn on for 1% → 10% → 100%

// Simple boolean flag
if (featureFlags.isEnabled("new-checkout-flow", userId)) {
  return newCheckoutFlow();
} else {
  return oldCheckoutFlow();
}

-- Use cases
Progressive rollout: 0% → 1% → 5% → 25% → 50% → 100%
A/B testing: 50% see variant A, 50% see variant B, measure conversion
Kill switch: instantly disable a feature without deployment
Beta users: turn on for internal users or early adopters only

-- Tools
LaunchDarkly, Unleash (open-source), Flagsmith, AWS AppConfig
Spring Cloud Config + custom flag evaluation

-- Rules
Clean up flags after rollout is complete — flag debt is real
Always test the OFF path — flags are often only tested ON
Log flag evaluation decisions for reproducibility</pre>`}
          ]
        }
      ]
    }

  ]
};
