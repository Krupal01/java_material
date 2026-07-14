/* =========================================================
   Observability & Analytics — Logging, Health, Traffic, Tracing, Reliability
   ========================================================= */
window.BACKEND_OBS_ANALYTICS_DATA = {
  parts: [
    {
      label: "PART 1 · OBSERVABILITY FOUNDATIONS",
      sections: [
        {
          id: "obs-foundations",
          n: 1,
          title: "Logs, Metrics, Traces, Events, and Why They Matter",
          desc: "Core observability concepts from beginner to advanced.",
          questions: [
            {
              n: 1,
              t: "What is observability and how is it different from monitoring?",
              d: ["beginner", "intermediate"],
              a: `
<ul>
  <li><strong>Monitoring:</strong> You watch known signals (CPU, memory, error rate) and alert when thresholds break.</li>
  <li><strong>Observability:</strong> You can ask new questions about unknown failures using telemetry (logs, metrics, traces).</li>
  <li><strong>Rule:</strong> Monitoring tells you <em>something is wrong</em>; observability helps you find <em>why</em>.</li>
</ul>`,
            },
            {
              n: 2,
              t: "What are logs, metrics, traces, and events in backend systems?",
              d: ["beginner", "intermediate"],
              a: `
<table>
  <tr><th>Signal</th><th>What It Captures</th><th>Best For</th><th>Tradeoff</th></tr>
  <tr><td>Logs</td><td>Detailed event context</td><td>Debugging edge-case failures</td><td>High storage cost</td></tr>
  <tr><td>Metrics</td><td>Numeric time-series</td><td>Dashboards, alerting, trends</td><td>Less context</td></tr>
  <tr><td>Traces</td><td>Request path across services</td><td>Latency root-cause analysis</td><td>Instrumentation overhead</td></tr>
  <tr><td>Events</td><td>Business/system lifecycle events</td><td>Audit and analytics</td><td>Schema governance needed</td></tr>
</table>`,
            },
            {
              n: 3,
              t: "What is telemetry and what should be instrumented first?",
              d: ["intermediate"],
              a: `
<ul>
  <li><strong>Telemetry:</strong> Data emitted by services about behavior and performance.</li>
  <li><strong>Instrument first:</strong>
    <ul>
      <li>HTTP request count, latency, errors.</li>
      <li>Database query latency and errors.</li>
      <li>Queue depth and processing lag.</li>
      <li>External dependency success/failure.</li>
    </ul>
  </li>
  <li><strong>Golden start:</strong> RED metrics per service + structured logs + distributed tracing.</li>
</ul>`,
            },
            {
              n: 4,
              t: "What are RED and USE methodologies?",
              d: ["intermediate", "advanced"],
              a: `
<ul>
  <li><strong>RED (service-level):</strong> Rate, Errors, Duration.</li>
  <li><strong>USE (resource-level):</strong> Utilization, Saturation, Errors.</li>
  <li><strong>Together:</strong> RED tells user impact, USE helps locate infra bottlenecks.</li>
</ul>
<pre>
If API latency spikes:
1) RED says duration up and errors up
2) USE may show DB saturation 95% and queue backlog rising
</pre>`,
            },
            {
              n: 5,
              t: "How should a backend team define telemetry ownership?",
              d: ["advanced"],
              a: `
<ul>
  <li>Each service must own dashboards, alerts, and runbooks.</li>
  <li>Each metric should have clear meaning and owner.</li>
  <li>Each log schema should be documented and versioned.</li>
  <li>Each SLO should map to user-facing outcomes.</li>
</ul>`,
            },
            {
              n: 6,
              t: "What are common observability anti-patterns?",
              d: ["advanced"],
              a: `
<ul>
  <li>Logging everything at INFO in production (cost explosion).</li>
  <li>No correlation ID, making cross-service debugging impossible.</li>
  <li>Alerting on CPU only, not user impact.</li>
  <li>No runbooks linked in alerts.</li>
  <li>High-cardinality metric labels (userId, requestId) causing TSDB overload.</li>
</ul>`,
            },
          ],
        },
      ],
    },
    {
      label: "PART 2 · CENTRALIZED LOGGING",
      sections: [
        {
          id: "centralized-logging",
          n: 2,
          title: "Central Log Pipeline Design and Best Practices",
          desc: "How to collect, parse, enrich, store, and query logs at scale.",
          questions: [
            {
              n: 7,
              t: "Why centralized logging is mandatory in microservices?",
              d: ["beginner", "intermediate"],
              a: `
<ul>
  <li>Each service runs on different nodes/containers; local logs are fragmented.</li>
  <li>Incidents span multiple services; centralized search is essential.</li>
  <li>Audit/compliance requires retention and access control.</li>
  <li>Security incidents need cross-service correlation.</li>
</ul>`,
            },
            {
              n: 8,
              t: "What is a typical centralized logging architecture?",
              d: ["intermediate", "advanced"],
              a: `
<pre>
Application -> stdout/file -> log agent (Fluent Bit/Filebeat/Vector) ->
log pipeline (Kafka/Logstash) -> storage/index (OpenSearch/Elasticsearch/Loki/Cloud Logging) ->
query/dashboard (Kibana/Grafana)
</pre>
<ul>
  <li><strong>Agent:</strong> Collects logs from nodes/pods.</li>
  <li><strong>Pipeline:</strong> Parses JSON, enriches metadata, filters noise.</li>
  <li><strong>Storage:</strong> Hot index for recent, cold archive for long-term retention.</li>
</ul>`,
            },
            {
              n: 9,
              t: "Structured logging vs plain text logs?",
              d: ["intermediate", "advanced"],
              a: `
<ul>
  <li><strong>Plain text:</strong> Human-readable, poor machine parsing.</li>
  <li><strong>Structured JSON:</strong> Queryable fields, easier aggregation and alerts.</li>
</ul>
<p><strong>Recommended JSON fields:</strong> timestamp, level, service, env, traceId, spanId, requestId, userId (if safe), message, errorCode, durationMs.</p>
<pre>
{
  "timestamp":"2026-05-08T10:22:11Z",
  "level":"ERROR",
  "service":"payment-service",
  "traceId":"4bf92f3577b34da6",
  "requestId":"req-7812",
  "errorCode":"PAYMENT_GATEWAY_TIMEOUT",
  "durationMs":1240,
  "message":"Payment provider timeout"
}
</pre>`,
            },
            {
              n: 10,
              t: "How to avoid logging sensitive data (PII/secrets)?",
              d: ["advanced"],
              a: `
<ul>
  <li>Never log passwords, tokens, card numbers, personal IDs.</li>
  <li>Mask/redact sensitive fields at application and pipeline layers.</li>
  <li>Use allow-list logging (log only approved fields).</li>
  <li>Add automated scanners for PII and secrets in logs.</li>
</ul>
<pre>
Before: "card=4111111111111111 token=sk_live_abc..."
After : "card=************1111 token=[REDACTED]"
</pre>`,
            },
            {
              n: 11,
              t: "Log levels and sampling strategy for production?",
              d: ["advanced"],
              a: `
<ul>
  <li><strong>DEBUG:</strong> disabled by default in prod; enable temporarily by feature flag.</li>
  <li><strong>INFO:</strong> business lifecycle events (order created, payment approved).</li>
  <li><strong>WARN:</strong> recoverable anomalies (retry, fallback triggered).</li>
  <li><strong>ERROR:</strong> request failures, exceptions affecting users.</li>
  <li><strong>Sampling:</strong> sample repetitive INFO logs (e.g., 10%), keep all ERROR logs.</li>
</ul>`,
            },
            {
              n: 12,
              t: "Log retention and tiering policy — hot/warm/cold storage?",
              d: ["advanced"],
              a: `
<ul>
  <li><strong>Hot tier (7-14 days):</strong> Fast indexed search for active incidents.</li>
  <li><strong>Warm tier (30-90 days):</strong> Slower search, lower cost.</li>
  <li><strong>Cold/archive (6-24 months):</strong> Compliance and audits, object storage.</li>
  <li>Set retention by log class (debug shortest, security/audit longest).</li>
</ul>`,
            },
            {
              n: 13,
              t: "How to handle logging cost explosion at scale?",
              d: ["advanced", "expert"],
              a: `
<ul>
  <li>Switch high-volume logs to sampling.</li>
  <li>Drop low-value noise at edge agents.</li>
  <li>Use compact JSON and avoid stack traces for known business errors.</li>
  <li>Index only searchable fields; keep raw logs in cheap object storage.</li>
  <li>Create log volume budgets per team/service.</li>
</ul>`,
            },
          ],
        },
      ],
    },
    {
      label: "PART 3 · HEALTH CHECKING & READINESS",
      sections: [
        {
          id: "health-checking",
          n: 3,
          title: "Health Endpoints, Probes, and Dependency Checks",
          desc: "Designing reliable health checks without creating false failures.",
          questions: [
            {
              n: 14,
              t: "What is the difference between liveness, readiness, and startup checks?",
              d: ["beginner", "intermediate"],
              a: `
<ul>
  <li><strong>Liveness:</strong> Is the process alive? If fail, restart container.</li>
  <li><strong>Readiness:</strong> Can this instance serve traffic now? If fail, remove from load balancer.</li>
  <li><strong>Startup:</strong> Has app finished bootstrapping? Prevents early restarts on slow startup.</li>
</ul>`,
            },
            {
              n: 15,
              t: "How should a production health endpoint be designed?",
              d: ["intermediate", "advanced"],
              a: `
<ul>
  <li><strong>/live:</strong> lightweight, no external calls.</li>
  <li><strong>/ready:</strong> checks critical dependencies with strict timeout.</li>
  <li><strong>/health/details:</strong> deep diagnostic endpoint for internal use only.</li>
  <li>Never expose deep internals publicly; protect with auth/network policy.</li>
</ul>`,
            },
            {
              n: 16,
              t: "Spring Boot Actuator health checks best practices?",
              d: ["intermediate", "advanced"],
              a: `
<pre>
management.endpoints.web.exposure.include=health,info,metrics,prometheus
management.endpoint.health.probes.enabled=true
management.endpoint.health.show-details=when_authorized

# liveness/readiness groups
management.endpoint.health.group.liveness.include=ping
management.endpoint.health.group.readiness.include=db,redis,diskSpace
</pre>
<ul>
  <li>Use separate readiness/liveness groups.</li>
  <li>Set timeouts for DB/Redis checks to avoid cascading delays.</li>
</ul>`,
            },
            {
              n: 17,
              t: "Why external dependency checks can break liveness endpoints?",
              d: ["advanced"],
              a: `
<ul>
  <li>If liveness checks DB and DB is slow, kubelet may restart healthy pods unnecessarily.</li>
  <li>This causes restart storms and amplifies incidents.</li>
  <li>Keep liveness minimal; put dependency checks in readiness.</li>
</ul>`,
            },
            {
              n: 18,
              t: "Health-check timeout and threshold tuning in Kubernetes?",
              d: ["advanced"],
              a: `
<pre>
livenessProbe:
  httpGet: { path: /live, port: 8080 }
  initialDelaySeconds: 20
  periodSeconds: 10
  timeoutSeconds: 2
  failureThreshold: 3

readinessProbe:
  httpGet: { path: /ready, port: 8080 }
  periodSeconds: 5
  timeoutSeconds: 2
  failureThreshold: 2

startupProbe:
  httpGet: { path: /startup, port: 8080 }
  failureThreshold: 30
  periodSeconds: 10
</pre>
<ul>
  <li>Tune for actual startup time and traffic behavior.</li>
</ul>`,
            },
            {
              n: 19,
              t: "Graceful shutdown and connection draining with health checks?",
              d: ["advanced"],
              a: `
<ul>
  <li>Mark pod unready before termination.</li>
  <li>Stop accepting new requests.</li>
  <li>Drain in-flight requests with timeout.</li>
  <li>Close DB/queue connections cleanly.</li>
</ul>
<pre>
SIGTERM -> set readiness=false -> wait 20s -> shutdown
</pre>`,
            },
          ],
        },
      ],
    },
    {
      label: "PART 4 · TRAFFIC CHECKING & API PERFORMANCE",
      sections: [
        {
          id: "traffic-checking",
          n: 4,
          title: "Traffic Monitoring, Latency, Error Rate, Throughput",
          desc: "How to observe real user traffic and detect production regressions.",
          questions: [
            {
              n: 20,
              t: "What traffic metrics should every API dashboard have?",
              d: ["intermediate", "advanced"],
              a: `
<ul>
  <li>Request rate (RPS).</li>
  <li>Error rate (4xx/5xx split).</li>
  <li>Latency percentiles (p50, p95, p99).</li>
  <li>Saturation (thread pool, queue length, DB pool usage).</li>
  <li>Success rate by endpoint and region.</li>
</ul>`,
            },
            {
              n: 21,
              t: "Why percentile latency (p95/p99) matters more than average?",
              d: ["intermediate"],
              a: `
<ul>
  <li>Average hides tail latency spikes.</li>
  <li>Users feel p95/p99 delays, not the average.</li>
</ul>
<pre>
100 requests:
99 requests = 100ms
1 request  = 5000ms
Average = 149ms (looks good)
p99 = 5000ms (bad user experience)
</pre>`,
            },
            {
              n: 22,
              t: "Traffic anomaly detection — static thresholds vs dynamic baselines?",
              d: ["advanced"],
              a: `
<ul>
  <li><strong>Static threshold:</strong> alert if RPS > X; simple, many false positives.</li>
  <li><strong>Dynamic baseline:</strong> compare to historical pattern (day/time aware).</li>
  <li>Use both: hard safety limits + anomaly models.</li>
</ul>`,
            },
            {
              n: 23,
              t: "How to separate bot traffic from user traffic in monitoring?",
              d: ["advanced"],
              a: `
<ul>
  <li>Tag traffic by user-agent/IP reputation/API key class.</li>
  <li>Create separate dashboards: human traffic vs automation.</li>
  <li>Apply bot-specific rate limits and WAF rules.</li>
  <li>Don’t let bot spikes hide user-impact signals.</li>
</ul>`,
            },
            {
              n: 24,
              t: "Traffic checking during deployments — what to compare?",
              d: ["advanced", "expert"],
              a: `
<ul>
  <li>Compare canary vs stable: error rate, p95 latency, CPU/memory, GC pauses.</li>
  <li>Compare business metrics: checkout success, sign-in success, conversion.</li>
  <li>Abort rollout automatically if canary degrades beyond thresholds.</li>
</ul>`,
            },
            {
              n: 25,
              t: "North-south vs east-west traffic monitoring in microservices?",
              d: ["advanced"],
              a: `
<ul>
  <li><strong>North-south:</strong> User-to-edge traffic (CDN, gateway, LB).</li>
  <li><strong>East-west:</strong> Service-to-service internal calls.</li>
  <li>Incidents often start east-west and surface north-south.</li>
  <li>Instrument both layers for complete diagnosis.</li>
</ul>`,
            },
          ],
        },
      ],
    },
    {
      label: "PART 5 · METRICS, DASHBOARDS, AND ALERTING",
      sections: [
        {
          id: "metrics-alerting",
          n: 5,
          title: "Prometheus, Grafana, Alert Rules, Noise Reduction",
          desc: "Designing actionable dashboards and alert systems.",
          questions: [
            {
              n: 26,
              t: "What makes a good production dashboard?",
              d: ["intermediate", "advanced"],
              a: `
<ul>
  <li>Shows user impact first: availability, latency, errors.</li>
  <li>Links service-level to dependency-level metrics.</li>
  <li>Includes deploy markers and incident annotations.</li>
  <li>Has drill-down by endpoint, region, and version.</li>
</ul>`,
            },
            {
              n: 27,
              t: "How to design actionable alerts and reduce alert fatigue?",
              d: ["advanced"],
              a: `
<ul>
  <li>Alert only on symptoms requiring human action.</li>
  <li>Use severity levels and runbook links.</li>
  <li>Aggregate duplicate alerts into one incident.</li>
  <li>Auto-resolve when condition clears.</li>
  <li>Review noisy alerts weekly and tune thresholds.</li>
</ul>`,
            },
            {
              n: 28,
              t: "SLO-based multi-window burn-rate alerting explained?",
              d: ["advanced", "expert"],
              a: `
<ul>
  <li>Burn-rate alerting detects how fast error budget is consumed.</li>
  <li>Use short + long windows to catch fast outages and slow burns.</li>
</ul>
<pre>
Example SLO: 99.9% (0.1% error budget)
Alert 1: 5m burn-rate > 14 AND 1h burn-rate > 14 (critical)
Alert 2: 30m burn-rate > 6 AND 6h burn-rate > 6 (warning)
</pre>`,
            },
            {
              n: 29,
              t: "Prometheus metric naming and label standards?",
              d: ["advanced"],
              a: `
<ul>
  <li>Use units in names: <code>http_request_duration_seconds</code>.</li>
  <li>Use total counters: <code>http_requests_total</code>.</li>
  <li>Use bounded labels only: method, status, route (not userId/requestId).</li>
  <li>Document metric meanings and owners.</li>
</ul>`,
            },
            {
              n: 30,
              t: "Cardinality explosion in metrics — how to prevent?",
              d: ["advanced", "expert"],
              a: `
<ul>
  <li>Never use unbounded labels: userId, sessionId, traceId.</li>
  <li>Normalize URLs to route templates (/users/:id).</li>
  <li>Use exemplars linking metrics to traces for deep drill-down.</li>
  <li>Set TSDB cardinality budgets and alerts.</li>
</ul>`,
            },
            {
              n: 31,
              t: "Golden signals and alerts for a payment API?",
              d: ["advanced"],
              a: `
<ul>
  <li><strong>Rate:</strong> payment_requests_total by status.</li>
  <li><strong>Errors:</strong> payment_failures_total by reason.</li>
  <li><strong>Duration:</strong> p95/p99 payment latency.</li>
  <li><strong>Saturation:</strong> queue depth, DB connections, thread pool usage.</li>
  <li><strong>Business:</strong> payment success ratio and revenue/minute.</li>
</ul>`,
            },
          ],
        },
      ],
    },
    {
      label: "PART 6 · DISTRIBUTED TRACING & CONTEXT PROPAGATION",
      sections: [
        {
          id: "distributed-tracing",
          n: 6,
          title: "OpenTelemetry, Trace IDs, Span Analysis",
          desc: "Tracing requests end-to-end across microservices.",
          questions: [
            {
              n: 32,
              t: "How does distributed tracing work across services?",
              d: ["intermediate", "advanced"],
              a: `
<ul>
  <li>Incoming request gets trace ID and root span.</li>
  <li>Each downstream call creates child spans.</li>
  <li>Trace context is propagated via headers.</li>
  <li>Trace viewer reconstructs full call graph.</li>
</ul>
<pre>
Client -> API Gateway -> Order Service -> Payment Service -> DB
Trace ID remains same across all spans
</pre>`,
            },
            {
              n: 33,
              t: "W3C Trace Context headers and why they matter?",
              d: ["advanced"],
              a: `
<ul>
  <li><code>traceparent</code>: carries trace-id, span-id, flags.</li>
  <li><code>tracestate</code>: vendor-specific trace state.</li>
  <li>Standardized propagation across languages and vendors.</li>
</ul>
<pre>
traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
</pre>`,
            },
            {
              n: 34,
              t: "OpenTelemetry instrumentation in Java Spring services?",
              d: ["advanced"],
              a: `
<ul>
  <li>Use OpenTelemetry Java agent for auto-instrumentation.</li>
  <li>Capture HTTP spans, DB spans, Kafka spans by default.</li>
  <li>Add custom spans for business-critical operations.</li>
</ul>
<pre>
java -javaagent:opentelemetry-javaagent.jar \
  -Dotel.service.name=order-service \
  -Dotel.exporter.otlp.endpoint=http://otel-collector:4317 \
  -jar app.jar
</pre>`,
            },
            {
              n: 35,
              t: "Sampling strategies for tracing — head vs tail sampling?",
              d: ["advanced", "expert"],
              a: `
<ul>
  <li><strong>Head sampling:</strong> decide at request start; low cost, may miss rare failures.</li>
  <li><strong>Tail sampling:</strong> decide after request finishes; keep slow/errors, more compute cost.</li>
  <li><strong>Best practice:</strong> Keep 100% errors + high-latency traces; sample healthy traces lower.</li>
</ul>`,
            },
            {
              n: 36,
              t: "How to correlate traces with logs and metrics effectively?",
              d: ["advanced"],
              a: `
<ul>
  <li>Inject traceId and spanId into log context (MDC).</li>
  <li>Attach trace exemplars to latency metrics.</li>
  <li>From alert -> dashboard -> trace -> related logs should be one-click path.</li>
</ul>
<pre>
MDC.put("traceId", currentSpan.getSpanContext().getTraceId());
</pre>`,
            },
          ],
        },
      ],
    },
    {
      label: "PART 7 · SERVICE MESH & TRAFFIC OBSERVABILITY",
      sections: [
        {
          id: "mesh-observability",
          n: 7,
          title: "Istio/Linkerd Telemetry, Policy, and Traffic Insights",
          desc: "Observability for east-west traffic and progressive delivery.",
          questions: [
            {
              n: 37,
              t: "How does service mesh improve observability?",
              d: ["advanced"],
              a: `
<ul>
  <li>Captures service-to-service telemetry without changing app code.</li>
  <li>Provides traffic-level metrics (retries, mTLS, policy denials).</li>
  <li>Enables canary traffic split with real-time metrics.</li>
</ul>`,
            },
            {
              n: 38,
              t: "Istio telemetry signals important for production?",
              d: ["advanced"],
              a: `
<ul>
  <li>Request volume by workload and response code.</li>
  <li>Latency percentiles by source-destination pair.</li>
  <li>Retry and timeout rates.</li>
  <li>mTLS handshake failures and policy denials.</li>
</ul>`,
            },
            {
              n: 39,
              t: "Traffic shadowing/mirroring for safe release validation?",
              d: ["advanced", "expert"],
              a: `
<ul>
  <li>Mirror production traffic to new version without user impact.</li>
  <li>Compare latency/errors between stable and candidate service.</li>
  <li>Use for schema migration confidence and performance profiling.</li>
</ul>`,
            },
            {
              n: 40,
              t: "Canary analysis with automated rollback in mesh environments?",
              d: ["expert"],
              a: `
<ul>
  <li>Set canary steps: 1% -> 5% -> 25% -> 50% -> 100%.</li>
  <li>At each step evaluate SLO metrics and business KPIs.</li>
  <li>If thresholds fail, route traffic back to stable automatically.</li>
  <li>Keep old version warm for instant rollback.</li>
</ul>`,
            },
            {
              n: 41,
              t: "Observing retries/timeouts and hidden latency in service mesh?",
              d: ["advanced"],
              a: `
<ul>
  <li>Retries can improve success but increase total latency and load.</li>
  <li>Track retry budgets, timeout rates, and circuit breaker opens.</li>
  <li>Look for retry storms when dependency is degraded.</li>
</ul>`,
            },
          ],
        },
      ],
    },
    {
      label: "PART 8 · CLOUD OBSERVABILITY (AWS & AZURE)",
      sections: [
        {
          id: "cloud-observability",
          n: 8,
          title: "Cloud-Native Monitoring, Logging, and Tracing",
          desc: "How observability stacks differ across cloud providers.",
          questions: [
            {
              n: 42,
              t: "AWS observability stack — CloudWatch, X-Ray, OpenSearch?",
              d: ["intermediate", "advanced"],
              a: `
<ul>
  <li><strong>CloudWatch Metrics/Alarms:</strong> infra and custom app metrics.</li>
  <li><strong>CloudWatch Logs:</strong> centralized logs from Lambda/ECS/EKS/EC2.</li>
  <li><strong>X-Ray:</strong> distributed traces for AWS services and applications.</li>
  <li><strong>OpenSearch:</strong> advanced log search and analytics.</li>
</ul>
<p>Common pattern: app metrics + logs in CloudWatch, traces in X-Ray, long-term/search-heavy logs in OpenSearch.</p>`,
            },
            {
              n: 43,
              t: "Azure observability stack — Azure Monitor, Application Insights, Log Analytics?",
              d: ["intermediate", "advanced"],
              a: `
<ul>
  <li><strong>Azure Monitor:</strong> metrics and alerts for resources/apps.</li>
  <li><strong>Application Insights:</strong> APM, request tracing, dependency maps.</li>
  <li><strong>Log Analytics Workspace:</strong> centralized logs and KQL queries.</li>
  <li><strong>Workbooks:</strong> dashboards for service and business telemetry.</li>
</ul>`,
            },
            {
              n: 44,
              t: "CloudWatch vs Azure Monitor — practical differences?",
              d: ["advanced"],
              a: `
<table>
  <tr><th>Feature</th><th>AWS</th><th>Azure</th></tr>
  <tr><td>Metrics</td><td>CloudWatch Metrics</td><td>Azure Monitor Metrics</td></tr>
  <tr><td>Logs Query</td><td>Logs Insights</td><td>KQL in Log Analytics</td></tr>
  <tr><td>Tracing</td><td>X-Ray</td><td>Application Insights</td></tr>
  <tr><td>Dashboards</td><td>CloudWatch Dashboards</td><td>Workbooks</td></tr>
</table>`,
            },
            {
              n: 45,
              t: "Observability for Kubernetes on cloud (EKS/AKS)?",
              d: ["advanced"],
              a: `
<ul>
  <li>Collect node, pod, and control-plane metrics.</li>
  <li>Aggregate container logs with namespace/pod labels.</li>
  <li>Trace inter-service requests across pods.</li>
  <li>Monitor cluster autoscaler and HPA behavior.</li>
</ul>
<p>Avoid blind spots: app-only telemetry is not enough without cluster telemetry.</p>`,
            },
            {
              n: 46,
              t: "Cost optimization for cloud observability data?",
              d: ["advanced", "expert"],
              a: `
<ul>
  <li>Reduce log verbosity and sample high-volume logs.</li>
  <li>Use shorter retention for debug logs, longer for audit logs.</li>
  <li>Aggregate metrics at appropriate resolution (1m vs 10s).</li>
  <li>Use tiered storage for old logs/traces.</li>
  <li>Budget alerts for telemetry spend per team.</li>
</ul>`,
            },
          ],
        },
      ],
    },
    {
      label: "PART 9 · INCIDENT RESPONSE WITH OBSERVABILITY",
      sections: [
        {
          id: "incident-observability",
          n: 9,
          title: "Using Telemetry to Detect, Triage, and Recover Fast",
          desc: "End-to-end incident workflow powered by observability.",
          questions: [
            {
              n: 47,
              t: "How should incident triage start using observability signals?",
              d: ["advanced"],
              a: `
<ol>
  <li>Confirm user impact (error rate, latency, availability).</li>
  <li>Identify blast radius (which regions/services/endpoints affected).</li>
  <li>Correlate with recent deploy/config/infrastructure change.</li>
  <li>Use traces to isolate failing dependency.</li>
  <li>Check logs for concrete error signatures.</li>
  <li>Mitigate (rollback, failover, throttle, feature flag off).</li>
</ol>`,
            },
            {
              n: 48,
              t: "How to build incident dashboards for on-call engineers?",
              d: ["advanced"],
              a: `
<ul>
  <li>Single pane: service health, dependency health, deploy events.</li>
  <li>Top 5 failing endpoints and top exceptions.</li>
  <li>Current error budget burn rate.</li>
  <li>Runbook shortcuts and rollback commands.</li>
</ul>`,
            },
            {
              n: 49,
              t: "Root-cause analysis flow with logs + metrics + traces?",
              d: ["advanced", "expert"],
              a: `
<pre>
Alert: p99 latency spike
-> Check RED metrics (which endpoint?)
-> Open recent traces (which span is slow?)
-> Inspect logs for that traceId (what exact error?)
-> Confirm dependency saturation (DB pool, queue lag)
-> Apply mitigation and verify SLO recovery
</pre>`,
            },
            {
              n: 50,
              t: "Post-incident observability improvements — what to add?",
              d: ["advanced"],
              a: `
<ul>
  <li>Add missing metrics that delayed diagnosis.</li>
  <li>Add structured log fields for key context.</li>
  <li>Add trace instrumentation for blind spans.</li>
  <li>Tune alert thresholds and suppression rules.</li>
  <li>Update runbooks with validated recovery steps.</li>
</ul>`,
            },
            {
              n: 51,
              t: "What should be included in incident runbooks?",
              d: ["advanced"],
              a: `
<ul>
  <li>Symptom signature and scope checks.</li>
  <li>Dashboards and log queries to run first.</li>
  <li>Known causes and verified mitigations.</li>
  <li>Escalation path and ownership matrix.</li>
  <li>Rollback/failover procedures and safety checks.</li>
</ul>`,
            },
          ],
        },
      ],
    },
    {
      label: "PART 10 · SLI, SLO, SLA, ERROR BUDGETS",
      sections: [
        {
          id: "slo-engineering",
          n: 10,
          title: "Reliability Objectives and Release Governance",
          desc: "Turning observability into reliability decisions.",
          questions: [
            {
              n: 52,
              t: "How to define good SLIs for APIs and background jobs?",
              d: ["intermediate", "advanced"],
              a: `
<ul>
  <li><strong>API SLIs:</strong> availability, request success rate, latency percentiles.</li>
  <li><strong>Async job SLIs:</strong> success rate, processing delay, queue lag.</li>
  <li><strong>Data SLIs:</strong> freshness, completeness, correctness.</li>
  <li>SLIs must represent what users/business actually experience.</li>
</ul>`,
            },
            {
              n: 53,
              t: "How to choose realistic SLO targets?",
              d: ["advanced"],
              a: `
<ul>
  <li>Start from business criticality and user expectations.</li>
  <li>Use historical baseline to set achievable initial targets.</li>
  <li>Tighten incrementally as system maturity improves.</li>
  <li>Avoid impossible targets that create alert fatigue.</li>
</ul>`,
            },
            {
              n: 54,
              t: "Error budget policy for release decisions?",
              d: ["advanced", "expert"],
              a: `
<ul>
  <li>If error budget burn is low: continue planned releases.</li>
  <li>If burn is moderate: increase canary duration and guardrails.</li>
  <li>If burn is high: freeze risky releases and prioritize reliability work.</li>
  <li>Define policy before incidents to avoid emotional decisions.</li>
</ul>`,
            },
            {
              n: 55,
              t: "SLA reporting and executive communication with telemetry?",
              d: ["advanced"],
              a: `
<ul>
  <li>Map SLIs to customer-facing SLA terms clearly.</li>
  <li>Provide monthly reliability reports with incident summaries.</li>
  <li>Show downtime minutes, breach windows, and remediation actions.</li>
  <li>Keep evidence trail from metrics and incident timelines.</li>
</ul>`,
            },
            {
              n: 56,
              t: "How to avoid gaming SLOs with bad metric design?",
              d: ["expert"],
              a: `
<ul>
  <li>Don’t exclude hard endpoints from SLI calculations.</li>
  <li>Don’t hide 5xx by retrying endlessly without latency accounting.</li>
  <li>Include user-visible failures, not just backend internal statuses.</li>
  <li>Review SLI definitions cross-functionally (engineering + product + SRE).</li>
</ul>`,
            },
          ],
        },
      ],
    },
    {
      label: "PART 11 · ANALYTICS, DATA QUALITY, AND OBSERVABILITY",
      sections: [
        {
          id: "analytics-observability",
          n: 11,
          title: "Event Pipelines, Data Freshness, and Trustworthy Insights",
          desc: "Observability patterns for data and analytics systems.",
          questions: [
            {
              n: 57,
              t: "How should event schemas be managed for analytics reliability?",
              d: ["intermediate", "advanced"],
              a: `
<ul>
  <li>Define event contracts with versioning and ownership.</li>
  <li>Use schema registry and compatibility checks in CI.</li>
  <li>Treat schema-breaking changes as production risks.</li>
</ul>`,
            },
            {
              n: 58,
              t: "Data pipeline observability metrics — what to track?",
              d: ["advanced"],
              a: `
<ul>
  <li>Ingestion throughput and lag.</li>
  <li>Transformation success/failure counts.</li>
  <li>Data freshness (event time vs processing time).</li>
  <li>Dead-letter queue volume and retry rates.</li>
  <li>Data quality checks: nulls, duplicates, out-of-range.</li>
</ul>`,
            },
            {
              n: 59,
              t: "Batch vs streaming observability differences?",
              d: ["advanced"],
              a: `
<ul>
  <li><strong>Batch:</strong> monitor job duration, completion SLA, partition completeness.</li>
  <li><strong>Streaming:</strong> monitor consumer lag, watermark delay, out-of-order rates.</li>
  <li>Use separate on-call playbooks for batch delays vs streaming backlog incidents.</li>
</ul>`,
            },
            {
              n: 60,
              t: "How to ensure BI dashboards are trustworthy?",
              d: ["advanced"],
              a: `
<ul>
  <li>Define metric lineage and owner for each dashboard KPI.</li>
  <li>Version SQL logic and review changes like production code.</li>
  <li>Add freshness and anomaly alerts for key business metrics.</li>
  <li>Create reconciliation checks against source systems.</li>
</ul>`,
            },
          ],
        },
      ],
    },
    {
      label: "PART 12 · MAANG INTERVIEW QUESTIONS (OBSERVABILITY)",
      sections: [
        {
          id: "maang-observability",
          n: 12,
          title: "Expert Interview Scenarios on Monitoring and Reliability",
          desc: "High-level interview answers with practical architecture thinking.",
          questions: [
            {
              n: 61,
              t: "Design centralized logging for 200 microservices at 1M logs/sec.",
              d: ["expert"],
              a: `
<ul>
  <li><strong>Ingestion:</strong> Fluent Bit agents on each node -> Kafka buffer cluster.</li>
  <li><strong>Processing:</strong> Stream processors parse JSON, redact PII, enrich metadata.</li>
  <li><strong>Storage:</strong> OpenSearch hot (7 days), warm (30 days), S3 archive (1 year).</li>
  <li><strong>Query:</strong> Kibana + role-based access controls.</li>
  <li><strong>Cost control:</strong> sampling non-critical logs, drop debug logs in prod.</li>
  <li><strong>Reliability:</strong> at-least-once ingestion with idempotent dedupe keys.</li>
</ul>`,
            },
            {
              n: 62,
              t: "How would you design health checks to avoid cascading restarts?",
              d: ["expert"],
              a: `
<ul>
  <li>Use lightweight liveness checks with no external dependencies.</li>
  <li>Use readiness checks for dependency health with strict timeouts.</li>
  <li>Add startup probes for slow-boot apps to avoid early kill loops.</li>
  <li>Introduce circuit breakers and graceful degradation when downstream is down.</li>
  <li>Use pod disruption budgets and controlled rollouts.</li>
</ul>`,
            },
            {
              n: 63,
              t: "Design traffic monitoring for a global API (50K RPS) with fast anomaly detection.",
              d: ["expert"],
              a: `
<ul>
  <li>Collect RPS, p95/p99 latency, error rates by region and endpoint.</li>
  <li>Use static safety thresholds + dynamic baselines per region/time-of-day.</li>
  <li>Separate bot and human traffic classes.</li>
  <li>Trigger auto-mitigation: rate limiting, traffic shift, canary rollback.</li>
  <li>Provide global NOC dashboard and per-service deep-dive views.</li>
</ul>`,
            },
            {
              n: 64,
              t: "How to implement full observability for Kubernetes microservices platform?",
              d: ["expert"],
              a: `
<ul>
  <li><strong>Metrics:</strong> Prometheus + kube-state-metrics + node-exporter + app Micrometer metrics.</li>
  <li><strong>Logs:</strong> Fluent Bit -> Loki/OpenSearch with namespace/pod labels.</li>
  <li><strong>Traces:</strong> OpenTelemetry Collector -> Jaeger/Tempo/APM backend.</li>
  <li><strong>Dashboards:</strong> Grafana service templates + SLO dashboards.</li>
  <li><strong>Alerting:</strong> Alertmanager with on-call routing, dedupe, silence windows.</li>
  <li><strong>Governance:</strong> metric naming standards, cardinality budgets, retention policies.</li>
</ul>`,
            },
            {
              n: 65,
              t: "How do you reduce MTTR from 45 minutes to under 10 minutes?",
              d: ["expert"],
              a: `
<ul>
  <li>Build service-centric incident dashboards with immediate drill-down links.</li>
  <li>Enforce correlation IDs across logs and traces.</li>
  <li>Create top-incident runbooks with one-command mitigations.</li>
  <li>Automate rollback triggers on canary SLO breaches.</li>
  <li>Run weekly incident drills and postmortem action tracking.</li>
</ul>`,
            },
            {
              n: 66,
              t: "Observability strategy for regulated fintech (audit + privacy + reliability).",
              d: ["expert"],
              a: `
<ul>
  <li>Centralized immutable audit logs with strict RBAC and retention.</li>
  <li>PII tokenization/redaction in logs and traces.</li>
  <li>SLOs for payment success, settlement latency, fraud decision latency.</li>
  <li>SIEM integration for security alerts and compliance evidence.</li>
  <li>Multi-region telemetry backup and disaster recovery for observability stack itself.</li>
</ul>`,
            },
          ],
        },
      ],
    },
  ],
};
