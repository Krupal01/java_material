/* =========================================================
   Cloud & Deployment — AWS, Azure, Kubernetes, Docker, End-to-End Workflows
   ========================================================= */
window.BACKEND_CLOUD_DEPLOY_DATA = {
  parts: [
    {
      label: "PART 1 · CLOUD FUNDAMENTALS",
      sections: [
        {
          id: "cloud-models",
          n: 1,
          title: "Cloud Service Models & Architecture",
          desc: "IaaS, PaaS, SaaS, FaaS — when to use each.",
          questions: [
            {
              n: 1,
              t: "What are the main cloud service models and their tradeoffs?",
              d: ["beginner", "intermediate"],
              a: `
<table>
  <tr><th>Model</th><th>What Cloud Manages</th><th>You Manage</th><th>Example</th><th>Ops Overhead</th></tr>
  <tr><td>IaaS</td><td>Hardware, network, virtualization</td><td>OS, runtime, app, data</td><td>EC2, Azure VM</td><td>High</td></tr>
  <tr><td>PaaS</td><td>IaaS + OS, runtime, middleware</td><td>App, data, config</td><td>Heroku, App Service</td><td>Medium</td></tr>
  <tr><td>SaaS</td><td>Everything</td><td>User config only</td><td>Salesforce, Slack</td><td>Low</td></tr>
  <tr><td>FaaS</td><td>IaaS + PaaS + orchestration</td><td>Code, config</td><td>Lambda, Azure Functions</td><td>Very low (event-driven)</td></tr>
</table>
<p><strong>Rule:</strong> Choose the highest abstraction level your app can tolerate; it reduces ops burden.</p>`,
            },
            {
              n: 2,
              t: "Containers vs VMs vs Serverless — when to use each?",
              d: ["intermediate", "advanced"],
              a: `
<table>
  <tr><th>Option</th><th>Best For</th><th>Overhead</th><th>Tradeoff</th></tr>
  <tr><td>VMs</td><td>Legacy apps, custom kernels, stateful workloads</td><td>High (OS per app)</td><td>Slow scaling, more cost</td></tr>
  <tr><td>Containers</td><td>Microservices, portable across clouds, consistent envs</td><td>Low (shared kernel)</td><td>Need orchestration (Kubernetes)</td></tr>
  <tr><td>Serverless</td><td>Event-driven, unpredictable demand, stateless code</td><td>None (pay per invocation)</td><td>Cold starts, vendor lock-in, platform limits</td></tr>
</table>`,
            },
            {
              n: 3,
              t: "Regions, Availability Zones, and geo-redundancy tradeoffs?",
              d: ["intermediate"],
              a: `
<ul>
  <li><strong>Region:</strong> Independent geographic location (AWS us-east-1).</li>
  <li><strong>AZ:</strong> Isolated data center within region; high-speed private link.</li>
  <li><strong>Single-region deployment:</strong> Fast, low latency for local users; no failover if entire region fails.</li>
  <li><strong>Multi-AZ (same region):</strong> Protects against data center failure, ~1ms replication latency, same billing region.</li>
  <li><strong>Multi-region:</strong> Protects against entire region failure; higher latency, replication delays, higher cost.</li>
  <li><strong>Rule:</strong> For 99.9% uptime: multi-AZ same region. For 99.99%+: add passive standby in another region.</li>
</ul>`,
            },
            {
              n: 4,
              t: "On-premises vs cloud TCO — what does the business need to know?",
              d: ["advanced"],
              a: `
<ul>
  <li><strong>On-prem costs:</strong> CapEx (servers, infra), OpEx (staff, power, cooling, upgrades).</li>
  <li><strong>Cloud costs:</strong> OpEx only; scales with usage; no CapEx.</li>
  <li><strong>Cloud wins when:</strong> Demand is spiky/unpredictable, rapid scaling needed, team lacks infra expertise.</li>
  <li><strong>On-prem wins when:</strong> Stable, high-volume baseline; compliance forbids cloud; custom hardware needed.</li>
  <li><strong>Hybrid:</strong> Baseline on-prem, burst to cloud (or multi-cloud for redundancy).</li>
</ul>`,
            },
            {
              n: 5,
              t: "What is the Shared Responsibility Model in cloud?",
              d: ["intermediate", "advanced"],
              a: `
<ul>
  <li><strong>IaaS:</strong> Cloud handles physical, network infra. You: OS, runtime, app, security group rules, firewall.</li>
  <li><strong>PaaS:</strong> Cloud handles infra + OS + runtime. You: app, data, who has access.</li>
  <li><strong>Key insight:</strong> Security is <em>always shared</em>; misconfiguration on your side can expose everything.</li>
  <li><strong>Common mistakes:</strong> Open security groups (0.0.0.0/0), public database access, plaintext secrets, no encryption.</li>
</ul>`,
            },
            {
              n: 6,
              t: "Cloud-native vs lift-and-shift — when to refactor?",
              d: ["advanced"],
              a: `
<ul>
  <li><strong>Lift-and-shift:</strong> Deploy existing app to VMs as-is. Fast, low effort, keeps tech debt.</li>
  <li><strong>Cloud-native:</strong> Refactor to microservices, containers, managed services. More effort, much better scalability and ops.</li>
  <li><strong>When to refactor:</strong> App is business-critical, demand scaling high, tech debt blocking new features.</li>
  <li><strong>When to keep monolith:</strong> Low traffic, small team, minimal scaling needs, legacy codebase too entangled.</li>
</ul>`,
            },
          ],
        },
      ],
    },
    {
      label: "PART 2 · AWS SERVICES DEEP-DIVE",
      sections: [
        {
          id: "aws-compute",
          n: 2,
          title: "AWS Compute — EC2, ECS, EKS, Lambda",
          desc: "When to use each and how they differ.",
          questions: [
            {
              n: 7,
              t: "EC2 — instance types, lifecycle, and cost optimization?",
              d: ["intermediate", "advanced"],
              a: `
<ul>
  <li><strong>Instance families:</strong> M (general), C (compute), R (memory), I (storage), P (GPU), G (graphics).</li>
  <li><strong>Lifecycle:</strong> launched → running → stopped → terminated (unrecoverable).</li>
  <li><strong>Pricing models:</strong>
    <ul>
      <li>On-demand: pay per hour, most expensive.</li>
      <li>Reserved (1y/3y): up to 72% discount, must commit.</li>
      <li>Spot: up to 90% discount, can be interrupted (good for batch jobs).</li>
      <li>Savings Plans: flexible compute savings.</li>
    </ul>
  </li>
  <li><strong>Optimization:</strong> Mix on-demand baseline + spot for burst; use autoscaling groups.</li>
</ul>`,
            },
            {
              n: 8,
              t: "ECS vs EKS — when to use each container orchestrator?",
              d: ["intermediate", "advanced"],
              a: `
<table>
  <tr><th>ECS</th><th>EKS</th></tr>
  <tr><td>AWS-only, simpler setup</td><td>Kubernetes, multi-cloud portable</td></tr>
  <tr><td>Task definitions (JSON)</td><td>Kubernetes manifests (YAML)</td></tr>
  <tr><td>Good for monolith containers</td><td>Good for microservices, complex apps</td></tr>
  <tr><td>Lower ops learning curve</td><td>Steeper learning, more powerful</td></tr>
  <tr><td>Fargate (serverless) available</td><td>Fargate also available (EKS on Fargate)</td></tr>
</table>
<p><strong>Rule:</strong> Use ECS if you're AWS-only and want simplicity. Use EKS if you want Kubernetes portability.</p>`,
            },
            {
              n: 9,
              t: "Lambda cold start problem and mitigation strategies?",
              d: ["advanced", "expert"],
              a: `
<ul>
  <li><strong>Cold start:</strong> First invocation after deploy/idle period; container and runtime initialization adds 100-1000ms+.</li>
  <li><strong>Why it happens:</strong> Lambda runs your code in a container on shared infra; container creation takes time.</li>
  <li><strong>Mitigation:</strong>
    <ul>
      <li>Use compiled languages (Go, Java with GraalVM for faster startup).</li>
      <li>Keep deployment package small.</li>
      <li>Use reserved concurrency to keep containers warm.</li>
      <li>Use Lambda SnapStart (Java 11+): instant resume from saved checkpoint.</li>
      <li>For latency-sensitive APIs, use API Gateway caching or warm-up invocations.</li>
      <li>Consider ECS/Fargate if cold start is unacceptable.</li>
    </ul>
  </li>
</ul>`,
            },
            {
              n: 10,
              t: "How to design Lambda for long-running workloads vs API requests?",
              d: ["advanced"],
              a: `
<ul>
  <li><strong>API requests (< 15 min):</strong> Ideal; trigger via API Gateway, CloudFront, ALB.</li>
  <li><strong>Long-running (> 15 min):</strong> Lambda has 15-min timeout; split into smaller steps with SQS/EventBridge.</li>
  <li><strong>Pattern:</strong> API request → Lambda enqueues SQS → separate workers process queue.</li>
  <li><strong>Batch jobs:</strong> Use Batch or Glue instead of Lambda for hour-long tasks.</li>
</ul>`,
            },
            {
              n: 11,
              t: "Fargate vs EC2 for container workloads — tradeoffs?",
              d: ["advanced"],
              a: `
<table>
  <tr><th>Fargate</th><th>EC2</th></tr>
  <tr><td>Serverless, no VM management</td><td>Manage instances</td></tr>
  <tr><td>Pay per container per second</td><td>Pay per instance per hour</td></tr>
  <tr><td>Higher per-unit cost</td><td>Lower cost at scale</td></tr>
  <tr><td>Faster to scale (no AMI spin time)</td><td>Slower to scale</td></tr>
  <tr><td>Limited customization</td><td>Full OS control</td></tr>
</table>
<p><strong>Rule:</strong> Use Fargate for microservices with bursty traffic. Use EC2 for stable, high-volume workloads.</p>`,
            },
          ],
        },
        {
          id: "aws-storage",
          n: 3,
          title: "AWS Storage — S3, EBS, RDS, DynamoDB",
          desc: "Storage choices and when to use each.",
          questions: [
            {
              n: 12,
              t: "S3 object storage — tiers, lifecycle, and cost optimization?",
              d: ["intermediate", "advanced"],
              a: `
<ul>
  <li><strong>Tiers by access pattern:</strong>
    <ul>
      <li>S3 Standard: frequently accessed, immediate retrieval.</li>
      <li>S3-IA (Infrequent Access): low cost, retrieval fee, 30-day min storage.</li>
      <li>S3 Glacier: archival, retrieval in hours, very cheap.</li>
      <li>S3 Glacier Deep Archive: rare access, retrieval in 12h, cheapest.</li>
    </ul>
  </li>
  <li><strong>Lifecycle policies:</strong> Auto-transition old objects to cheaper tiers (e.g., Standard → IA after 30d → Glacier after 90d).</li>
  <li><strong>Versioning:</strong> Keep multiple versions; delete old versions to save cost.</li>
  <li><strong>Replication:</strong> Same-region for durability, cross-region for disaster recovery.</li>
</ul>`,
            },
            {
              n: 13,
              t: "EBS volumes — types, snapshots, and replication?",
              d: ["intermediate", "advanced"],
              a: `
<ul>
  <li><strong>Types:</strong>
    <ul>
      <li>gp3: general purpose, most workloads, lowest cost/perf.</li>
      <li>io2: high-IOPS, databases.</li>
      <li>st1: throughput-optimized, streaming, big data.</li>
    </ul>
  </li>
  <li><strong>Snapshots:</strong> Point-in-time backups to S3 (incremental).</li>
  <li><strong>Multi-AZ:</strong> Replicate snapshots across AZs for HA.</li>
  <li><strong>Encryption:</strong> All data at rest, integrated with KMS.</li>
</ul>`,
            },
            {
              n: 14,
              t: "RDS Multi-AZ vs Read Replicas — HA and scaling strategy?",
              d: ["intermediate", "advanced"],
              a: `
<table>
  <tr><th>Multi-AZ</th><th>Read Replicas</th></tr>
  <tr><td>Synchronous failover to standby</td><td>Asynchronous replication</td></tr>
  <tr><td>Same availability zone failover</td><td>Can span regions</td></tr>
  <tr><td>Automatic failover in ~2 min</td><td>Manual promotion to primary</td></tr>
  <tr><td>Higher cost (double DB)</td><td>Scales read throughput</td></tr>
  <tr><td>For <strong>HA</strong></td><td>For <strong>scaling reads</strong></td></tr>
</table>
<p><strong>Best practice:</strong> Multi-AZ primary + read replicas for analytical queries + DynamoDB cache for hot data.</p>`,
            },
            {
              n: 15,
              t: "DynamoDB vs RDS — when to choose NoSQL?",
              d: ["advanced"],
              a: `
<ul>
  <li><strong>Use DynamoDB when:</strong>
    <ul>
      <li>Key-value or semi-structured queries only.</li>
      <li>Need massive throughput (1M+ WPS).</li>
      <li>Schemaless or rapid schema evolution.</li>
      <li>Don't need complex joins or transactions.</li>
    </ul>
  </li>
  <li><strong>Use RDS when:</strong>
    <ul>
      <li>Complex queries with multiple joins.</li>
      <li>Strong consistency and ACID transactions.</li>
      <li>Reporting and analytics.</li>
      <li>Moderate throughput, simpler scaling.</li>
    </ul>
  </li>
  <li><strong>DynamoDB pitfalls:</strong> Hot partitions cause throttling; must pre-warm capacity or use autoscaling.</li>
</ul>`,
            },
            {
              n: 16,
              t: "ElastiCache (Redis/Memcached) — when to cache and eviction policies?",
              d: ["advanced"],
              a: `
<ul>
  <li><strong>Redis:</strong> In-memory data structure store; supports strings, lists, sets, sorted sets, streams.</li>
  <li><strong>Memcached:</strong> Simple key-value cache; distributed by client.</li>
  <li><strong>When to use:</strong> Reduce database load, session store, rate limiting, leaderboards.</li>
  <li><strong>Eviction policies:</strong> maxmemory-policy (LRU, LFU, TTL).</li>
  <li><strong>Replication:</strong> Single-node vs cluster (for HA and throughput).</li>
</ul>`,
            },
          ],
        },
        {
          id: "aws-networking",
          n: 4,
          title: "AWS Networking — VPC, Load Balancing, CDN",
          desc: "Networking architecture and traffic routing.",
          questions: [
            {
              n: 17,
              t: "VPC design — subnets, public vs private, NAT Gateway?",
              d: ["intermediate", "advanced"],
              a: `
<ul>
  <li><strong>VPC:</strong> Isolated network with customizable IP ranges (CIDR blocks).</li>
  <li><strong>Public subnet:</strong> Has route to Internet Gateway; instances get public IPs; exposed to internet.</li>
  <li><strong>Private subnet:</strong> No IGW route; instances communicate via NAT Gateway (outbound only).</li>
  <li><strong>Common architecture:</strong>
    <ul>
      <li>ALB in public subnet, forwards to app servers in private subnet.</li>
      <li>App servers in private subnet, call RDS in isolated private subnet.</li>
    </ul>
  </li>
  <li><strong>Multi-AZ:</strong> Replicate subnets across AZs; use NLB/ALB for cross-AZ failover.</li>
</ul>`,
            },
            {
              n: 18,
              t: "ALB vs NLB vs Classic LB — which to choose?",
              d: ["intermediate", "advanced"],
              a: `
<table>
  <tr><th>ALB (Application)</th><th>NLB (Network)</th><th>Classic</th></tr>
  <tr><td>Layer 7 (HTTP/HTTPS)</td><td>Layer 4 (TCP/UDP)</td><td>Layer 4 (TCP/UDP)</td></tr>
  <tr><td>Routing by path, host, hostname</td><td>Extreme throughput (millions/s)</td><td>Legacy</td></tr>
  <tr><td>1M req/s, good for microservices</td><td>Ultra-low latency, gaming/IoT</td><td>Avoid</td></tr>
  <tr><td>Can route to ECS tasks</td><td>Can route to IPs (for k8s)</td><td></td></tr>
</table>
<p><strong>Rule:</strong> ALB for web apps/APIs. NLB for extreme throughput or non-HTTP protocols.</p>`,
            },
            {
              n: 19,
              t: "CloudFront CDN — edge caching and origins?",
              d: ["intermediate", "advanced"],
              a: `
<ul>
  <li><strong>What it does:</strong> Caches content at 200+ edge locations globally; routes requests to nearest edge.</li>
  <li><strong>Origins:</strong> S3, ALB, EC2, custom HTTP server.</li>
  <li><strong>Cache-Control headers:</strong> Control TTL at edge and browser.</li>
  <li><strong>Behaviors:</strong> Different caching rules per path (e.g., /api/* no cache, /static/* 1 year TTL).</li>
  <li><strong>Cost:</strong> Pay for data transfer out per region; much cheaper than ALB bandwidth.</li>
  <li><strong>Geo-restriction:</strong> Whitelist/blacklist countries.</li>
</ul>`,
            },
            {
              n: 20,
              t: "Route 53 DNS — health checks and failover?",
              d: ["advanced"],
              a: `
<ul>
  <li><strong>Health checks:</strong> Probes endpoint; if unhealthy, route to failover.</li>
  <li><strong>Routing policies:</strong>
    <ul>
      <li>Simple: single record, no health checks.</li>
      <li>Weighted: distribute traffic by percentage (canary).</li>
      <li>Failover: active-passive, switch on health check failure.</li>
      <li>Geolocation: route by geographic source (user location).</li>
      <li>Geoproximity: route by resource location and bias.</li>
    </ul>
  </li>
  <li><strong>Multi-region failover:</strong> Route 53 monitors primary region health; if down, redirects to secondary.</li>
</ul>`,
            },
          ],
        },
        {
          id: "aws-devops",
          n: 5,
          title: "AWS DevOps & Orchestration — CodePipeline, CodeDeploy",
          desc: "CI/CD and infrastructure automation.",
          questions: [
            {
              n: 21,
              t: "CodePipeline, CodeBuild, CodeDeploy — how they integrate?",
              d: ["intermediate", "advanced"],
              a: `
<ul>
  <li><strong>CodePipeline:</strong> Orchestrates stages (source → build → deploy).</li>
  <li><strong>CodeBuild:</strong> Runs build commands (compile, test, package) in managed container.</li>
  <li><strong>CodeDeploy:</strong> Deploys to EC2/on-prem/Lambda; supports blue-green and rolling.</li>
  <li><strong>Flow:</strong> GitHub/CodeCommit push → CodePipeline trigger → CodeBuild compile/test → CodeDeploy rolling to ASG.</li>
</ul>`,
            },
            {
              n: 22,
              t: "Blue-green deployment on AWS — how to implement with CodeDeploy?",
              d: ["advanced"],
              a: `
<ul>
  <li><strong>Setup:</strong> Two identical ASGs (blue active, green standby); ALB target group points to blue.</li>
  <li><strong>Deploy:</strong> Deploy new version to green ASG; wait for health checks.</li>
  <li><strong>Test:</strong> Canary traffic to green; monitor error rates.</li>
  <li><strong>Switch:</strong> Update ALB target group to green; old blue sits idle.</li>
  <li><strong>Rollback:</strong> Switch target group back to blue (instant).</li>
  <li><strong>Cost:</strong> Two ASGs = 2x compute (mitigated if green auto-scales down after deploy).</li>
</ul>`,
            },
            {
              n: 23,
              t: "CloudFormation vs Terraform — IaC comparison?",
              d: ["advanced"],
              a: `
<table>
  <tr><th>CloudFormation</th><th>Terraform</th></tr>
  <tr><td>AWS-only</td><td>Multi-cloud (AWS, Azure, GCP)</td></tr>
  <tr><td>JSON/YAML templates</td><td>HCL (terraform language)</td></tr>
  <tr><td>Native AWS features first</td><td>Community providers, slower updates</td></tr>
  <tr><td>State managed by AWS</td><td>Manual state file management</td></tr>
  <tr><td>Drift detection built-in</td><td>Need separate drift checks</td></tr>
</table>
<p><strong>Rule:</strong> CloudFormation if AWS-only. Terraform if multi-cloud or team prefers HCL.</p>`,
            },
            {
              n: 24,
              t: "Autoscaling strategies — target tracking vs step scaling?",
              d: ["advanced"],
              a: `
<ul>
  <li><strong>Target tracking:</strong> Maintain target metric (e.g., 70% CPU). ASG auto-adjusts capacity. Simple, predictable.</li>
  <li><strong>Step scaling:</strong> Custom rules (if CPU > 80%, add 2 instances; if < 30%, remove 1). Fine-grained control.</li>
  <li><strong>Predictive scaling:</strong> ML model predicts demand; pre-scales before spike.</li>
  <li><strong>Best practice:</strong> Use target tracking for stable workloads; step scaling for spiky patterns.</li>
</ul>`,
            },
            {
              n: 25,
              t: "Systems Manager Session Manager — secure server access without SSH?",
              d: ["advanced"],
              a: `
<ul>
  <li><strong>Problem:</strong> SSH keys are hard to rotate; bastion hosts add complexity.</li>
  <li><strong>Solution:</strong> Session Manager uses IAM roles; encrypted tunnels through AWS backbone.</li>
  <li><strong>Benefit:</strong> No inbound security group rules; centralized audit logs; MFA support.</li>
  <li><strong>Prerequisite:</strong> EC2 instance must have IAM role with Systems Manager policy + VPC endpoint.</li>
</ul>`,
            },
          ],
        },
      ],
    },
    {
      label: "PART 3 · AZURE SERVICES DEEP-DIVE",
      sections: [
        {
          id: "azure-compute",
          n: 6,
          title: "Azure Compute — VMs, App Service, AKS, Functions",
          desc: "Azure compute equivalents and when to use.",
          questions: [
            {
              n: 26,
              t: "Azure VMs vs App Service vs Functions — architecture comparison?",
              d: ["intermediate", "advanced"],
              a: `
<table>
  <tr><th>Azure VMs</th><th>App Service</th><th>Functions</th></tr>
  <tr><td>Full OS control</td><td>Managed web hosting (PaaS)</td><td>Event-driven serverless</td></tr>
  <tr><td>IaaS</td><td>PaaS</td><td>FaaS</td></tr>
  <tr><td>Manual scaling</td><td>Auto-scaling built-in</td><td>Auto-scale to zero</td></tr>
  <tr><td>Billing: per hour</td><td>Billing: per App Service Plan</td><td>Billing: per invocation</td></tr>
  <tr><td>For complex workloads</td><td>For web apps/APIs</td><td>For event processing</td></tr>
</table>`,
            },
            {
              n: 27,
              t: "AKS (Azure Kubernetes Service) vs EKS — differences?",
              d: ["advanced"],
              a: `
<ul>
  <li><strong>AKS:</strong> Azure-native Kubernetes; tight Azure integrations (ACR for images, Key Vault for secrets).</li>
  <li><strong>EKS:</strong> AWS-managed Kubernetes; ECR for images, Secrets Manager for secrets.</li>
  <li><strong>Node management:</strong>
    <ul>
      <li>AKS: Virtual node sets (VMSS) for autoscaling.</li>
      <li>EKS: Auto Scaling Groups (ASG).</li>
    </ul>
  </li>
  <li><strong>Cost:</strong> Both charge similar rates; AKS slightly cheaper if in Azure already.</li>
  <li><strong>Networking:</strong> AKS uses Azure CNI; EKS uses AWS VPC CNI or third-party.</li>
</ul>`,
            },
            {
              n: 28,
              t: "Azure Functions — runtime, triggers, and bindings?",
              d: ["intermediate", "advanced"],
              a: `
<ul>
  <li><strong>Runtimes:</strong> C#, Java, JavaScript, Python, PowerShell.</li>
  <li><strong>Triggers:</strong> HTTP, Timer, Blob Storage, Queue, Event Hub, Service Bus, Cosmos DB.</li>
  <li><strong>Bindings:</strong> Input (read data) and output (write data) without boilerplate; e.g., read from Blob, write to Queue.</li>
  <li><strong>Plans:</strong>
    <ul>
      <li>Consumption: pay-per-execution, scale to zero.</li>
      <li>Premium: pre-warmed instances, reduce cold starts.</li>
      <li>App Service: dedicated compute, most predictable.</li>
    </ul>
  </li>
  <li><strong>Cold start:</strong> Consumption plan has higher cold start; Premium mitigates.</li>
</ul>`,
            },
            {
              n: 29,
              t: "Container Instances (ACI) — when to use instead of AKS?",
              d: ["advanced"],
              a: `
<ul>
  <li><strong>ACI:</strong> Serverless containers; instant startup, pay per second.</li>
  <li><strong>Use when:</strong> Single container job, no orchestration needed, need instant scale.</li>
  <li><strong>Limitations:</strong> No multi-container scaling; no service discovery; good for dev/test or batch.</li>
  <li><strong>AKS:</strong> Full orchestration for microservices; more complex, more powerful.</li>
</ul>`,
            },
            {
              n: 30,
              t: "Azure Virtual Machine Scale Sets (VMSS) — autoscaling and cost?",
              d: ["advanced"],
              a: `
<ul>
  <li><strong>What it is:</strong> Group of identical VMs that autoscale based on metrics (CPU, memory, custom).</li>
  <li><strong>Orchestration modes:</strong>
    <ul>
      <li>Uniform: all VMs identical, simple scaling.</li>
      <li>Flexible: varied VMs, mixed sizes and SKUs.</li>
    </ul>
  </li>
  <li><strong>Auto-scaling:</strong> Rules based on metric thresholds or schedules.</li>
  <li><strong>Cost optimization:</strong> Use low-priority VMs (spot equivalent) for 60-80% discount.</li>
</ul>`,
            },
          ],
        },
        {
          id: "azure-storage",
          n: 7,
          title: "Azure Storage — Blob, SQL Database, Cosmos DB",
          desc: "Storage solutions and replicas.",
          questions: [
            {
              n: 31,
              t: "Azure Blob Storage tiers and lifecycle management?",
              d: ["intermediate", "advanced"],
              a: `
<ul>
  <li><strong>Tiers:</strong>
    <ul>
      <li>Hot: frequently accessed, immediate retrieval.</li>
      <li>Cool: infrequent access, retrieval fee, 30-day min storage.</li>
      <li>Archive: rare access, retrieval in hours, 90-day min, very cheap.</li>
    </ul>
  </li>
  <li><strong>Lifecycle policies:</strong> Auto-transition to cooler tiers (Hot → Cool after 30d → Archive after 90d).</li>
  <li><strong>Replication options:</strong>
    <ul>
      <li>LRS (Local Redundant): 3 copies same zone.</li>
      <li>GRS (Geo-Redundant): LRS + copy to another region.</li>
      <li>ZRS (Zone-Redundant): 3 zones same region.</li>
    </ul>
  </li>
</ul>`,
            },
            {
              n: 32,
              t: "Azure SQL Database — Single vs Elastic Pool vs Managed Instance?",
              d: ["advanced"],
              a: `
<table>
  <tr><th>Single Database</th><th>Elastic Pool</th><th>Managed Instance</th></tr>
  <tr><td>Single DB in shared pool</td><td>Multiple DBs share compute</td><td>Full SQL Server instance</td></tr>
  <tr><td>Highest abstraction</td><td>Medium abstraction</td><td>Most features, most ops</td></tr>
  <tr><td>Cheap for small DBs</td><td>Cost-effective for many DBs</td><td>For complex apps needing Server features</td></tr>
  <tr><td>Auto-backup, geo-replication</td><td>Shared geo-replication</td><td>More customization</td></tr>
</table>
<p><strong>Rule:</strong> Single DB for SaaS. Elastic Pool for multi-tenant. Managed Instance for legacy SQL Server apps.</p>`,
            },
            {
              n: 33,
              t: "Cosmos DB — global distribution and consistency tradeoffs?",
              d: ["advanced", "expert"],
              a: `
<ul>
  <li><strong>Global distribution:</strong> Multi-region, automatic replication, <10ms latency globally.</li>
  <li><strong>Consistency levels:</strong>
    <ul>
      <li>Strong: wait for all replicas (highest latency).</li>
      <li>Bounded staleness: max version/time lag.</li>
      <li>Session: within session consistency (most common).</li>
      <li>Eventual: lowest latency, highest throughput.</li>
    </ul>
  </li>
  <li><strong>Use when:</strong> Multi-region writes, global user base, can tolerate eventual consistency.</li>
  <li><strong>Cost:</strong> High (RU per second); index all fields by default.</li>
</ul>`,
            },
            {
              n: 34,
              t: "Azure Storage redundancy — LRS vs GRS vs ZRS vs GZRS?",
              d: ["advanced"],
              a: `
<ul>
  <li><strong>LRS:</strong> 3 copies same zone; fails if entire zone down (99.9% uptime).</li>
  <li><strong>ZRS:</strong> 3 copies across zones; zone failure → no problem (99.95% uptime).</li>
  <li><strong>GRS:</strong> LRS + replica to another region; geo-disaster protected but higher latency.</li>
  <li><strong>GZRS:</strong> ZRS + geo-replica; highest protection (99.99999999% uptime!).</li>
  <li><strong>Rule:</strong> LRS for dev. ZRS for production. GRS/GZRS for critical + multi-region.</li>
</ul>`,
            },
            {
              n: 35,
              t: "When to use Azure Synapse Analytics vs Power BI vs Data Lake?",
              d: ["advanced"],
              a: `
<ul>
  <li><strong>Data Lake (ADLS):</strong> Raw data storage (Hadoop-compatible filesystem).</li>
  <li><strong>Synapse:</strong> Analytics engine (SQL + Spark); query data lake.</li>
  <li><strong>Power BI:</strong> Visualization layer; connect to any data source.</li>
  <li><strong>Pattern:</strong> Ingest → Data Lake → Synapse (transform) → Power BI (visualize).</li>
</ul>`,
            },
          ],
        },
        {
          id: "azure-networking",
          n: 8,
          title:
            "Azure Networking — VNet, Application Gateway, Traffic Manager",
          desc: "Network architecture in Azure.",
          questions: [
            {
              n: 36,
              t: "Azure VNet subnets and network security groups (NSG)?",
              d: ["intermediate", "advanced"],
              a: `
<ul>
  <li><strong>VNet:</strong> Isolated network; define address space (CIDR) and subnets.</li>
  <li><strong>NSG:</strong> Stateful firewall; inbound/outbound rules by protocol/port/CIDR.</li>
  <li><strong>Best practice:</strong>
    <ul>
      <li>Public subnet: NSG allows HTTP/HTTPS from internet, SSH from admin IPs.</li>
      <li>Private subnet: NSG allows only from public subnet (ALB), denies internet.</li>
    </ul>
  </li>
  <li><strong>Service Endpoints:</strong> Route traffic to Azure services (Storage, SQL) via private path (no internet).</li>
</ul>`,
            },
            {
              n: 37,
              t: "Azure Application Gateway vs Load Balancer vs Traffic Manager?",
              d: ["advanced"],
              a: `
<table>
  <tr><th>Application Gateway</th><th>Load Balancer</th><th>Traffic Manager</th></tr>
  <tr><td>Layer 7 (HTTP/HTTPS)</td><td>Layer 4 (TCP/UDP)</td><td>Layer 3 (DNS-based)</td></tr>
  <tr><td>Path-based routing, SSL termination</td><td>High throughput, lower latency</td><td>Global, geo-routing</td></tr>
  <tr><td>For web apps</td><td>For non-HTTP, extreme throughput</td><td>Multi-region failover</td></tr>
</table>`,
            },
            {
              n: 38,
              t: "Azure Traffic Manager — DNS routing and failover across regions?",
              d: ["advanced"],
              a: `
<ul>
  <li><strong>How it works:</strong> Returns different IP based on routing policy (geographic, priority, weighted).</li>
  <li><strong>Health checks:</strong> Probe each endpoint; return endpoint IP only if healthy.</li>
  <li><strong>Routing policies:</strong>
    <ul>
      <li>Priority: active-passive (primary, then failover).</li>
      <li>Weighted: percentage-based traffic split (canary).</li>
      <li>Geographic: route by source IP location.</li>
      <li>Performance: route to nearest endpoint (lowest latency).</li>
    </ul>
  </li>
  <li><strong>Use case:</strong> Multi-region application with automatic failover.</li>
</ul>`,
            },
            {
              n: 39,
              t: "Azure CDN — integration with Blob Storage and caching?",
              d: ["advanced"],
              a: `
<ul>
  <li><strong>Origin:</strong> Blob Storage, App Service, custom HTTP.</li>
  <li><strong>Caching:</strong> Cache-Control headers determine TTL at edge and browser.</li>
  <li><strong>Profiles:</strong> Standard (Verizon/Akamai), Premium (Verizon only, more features).</li>
  <li><strong>Compression:</strong> Auto-compress responses (gzip) if > 1KB.</li>
  <li><strong>Geo-filtering:</strong> Whitelist/blacklist by country.</li>
</ul>`,
            },
            {
              n: 40,
              t: "Azure Virtual Network Peering and service connectivity?",
              d: ["advanced"],
              a: `
<ul>
  <li><strong>VNet Peering:</strong> Connect two VNets directly; low latency, private.</li>
  <li><strong>Types:</strong>
    <ul>
      <li>Regional: same region.</li>
      <li>Global: different regions.</li>
    </ul>
  </li>
  <li><strong>Service Endpoints:</strong> Route to Azure services without internet (e.g., SQL, Storage).</li>
  <li><strong>Private Endpoints:</strong> Individual private IP for service; traffic never leaves Azure backbone.</li>
</ul>`,
            },
          ],
        },
      ],
    },
    {
      label: "PART 4 · DOCKER & CONTAINERIZATION",
      sections: [
        {
          id: "docker-fundamentals",
          n: 9,
          title: "Docker Concepts — Images, Containers, Registries",
          desc: "Core Docker knowledge and best practices.",
          questions: [
            {
              n: 41,
              t: "Dockerfile best practices — layers, caching, and optimization?",
              d: ["intermediate", "advanced"],
              a: `
<ul>
  <li><strong>Layers:</strong> Each instruction creates a layer; cached for reuse on rebuild.</li>
  <li><strong>Optimization:</strong>
    <ul>
      <li>Put frequently-changing instructions last (build cache miss restarts from there).</li>
      <li>Use .dockerignore to exclude unnecessary files.</li>
      <li>Combine RUN commands: <code>RUN apt-get update && apt-get install -y pkg && rm -rf /var/lib/apt/lists/*</code></li>
      <li>Use multi-stage builds to reduce final image size.</li>
    </ul>
  </li>
  <li><strong>Multi-stage example:</strong>
<pre>
FROM golang:1.20 AS builder
WORKDIR /build
COPY . .
RUN go build -o app

FROM alpine:3.18
COPY --from=builder /build/app /app
CMD ["/app"]
</pre>
  Reduces image from 900MB (with Go SDK) to 20MB (just alpine + binary).</li>
</ul>`,
            },
            {
              n: 42,
              t: "Docker image tagging and registry management?",
              d: ["intermediate", "advanced"],
              a: `
<ul>
  <li><strong>Tag format:</strong> <code>[registry]/[namespace]/[repo]:[tag]</code></li>
  <li><strong>Examples:</strong>
    <ul>
      <li><code>docker.io/library/nginx:latest</code> (default public Docker Hub)</li>
      <li><code>gcr.io/my-project/myapp:v1.2.0</code> (Google Container Registry)</li>
      <li><code>myregistry.azurecr.io/backend:prod-sha256abcd</code> (Azure Container Registry)</li>
    </ul>
  </li>
  <li><strong>Best practice:</strong> Tag with commit SHA or semantic version; never use "latest" in prod.</li>
  <li><strong>Image signing:</strong> Sign images with Docker Content Trust or Cosign for supply chain security.</li>
</ul>`,
            },
            {
              n: 43,
              t: "Docker layer caching and build performance?",
              d: ["advanced"],
              a: `
<ul>
  <li><strong>Problem:</strong> <code>docker build</code> can be slow if layers rebuild.</li>
  <li><strong>Cache hit strategy:</strong>
    <ul>
      <li>Order instructions: immutable → frequently-changing.</li>
      <li><code>COPY go.mod go.sum ./</code> then <code>RUN go mod download</code> then <code>COPY . .</code> separates dependency install from code.</li>
      <li>If code changes, only final COPY and app build layers rebuild; go mod download cached.</li>
    </ul>
  </li>
  <li><strong>BuildKit:</strong> Modern Docker builder with better cache and parallelization; enable with <code>DOCKER_BUILDKIT=1 docker build</code></li>
</ul>`,
            },
            {
              n: 44,
              t: "Image scanning for vulnerabilities and supply chain security?",
              d: ["advanced"],
              a: `
<ul>
  <li><strong>Tools:</strong> Trivy, Grype, Snyk, Docker Scout.</li>
  <li><strong>Scanning:</strong> Check base image and dependencies for known CVEs.</li>
  <li><strong>Registry integration:</strong> Most cloud registries (ECR, ACR, GCR) scan on push automatically.</li>
  <li><strong>Signing:</strong> Use Docker Content Trust or Cosign to sign images; verify signature on pull.</li>
  <li><strong>Policy:</strong> Fail deployment if image has critical/high CVEs.</li>
</ul>`,
            },
            {
              n: 45,
              t: "Container runtime — Docker vs containerd vs CRI-O?",
              d: ["advanced", "expert"],
              a: `
<table>
  <tr><th>Docker</th><th>containerd</th><th>CRI-O</th></tr>
  <tr><td>Full suite (build, run, push)</td><td>Lightweight runtime only</td><td>Lightweight runtime, Kubernetes-focused</td></tr>
  <tr><td>CLI, API</td><td>API-only (no CLI)</td><td>Kubernetes CRI interface</td></tr>
  <tr><td>Most adoption</td><td>Kubernetes default</td><td>RedHat focus</td></tr>
  <tr><td>Higher overhead</td><td>Minimal resource use</td><td>Minimal resource use</td></tr>
</table>
<p><strong>Rule:</strong> Use Docker for dev/build. Use containerd/CRI-O for Kubernetes production.</p>`,
            },
          ],
        },
        {
          id: "docker-compose",
          n: 10,
          title: "Docker Compose — Multi-Container Development",
          desc: "Local development environment with Docker Compose.",
          questions: [
            {
              n: 46,
              t: "Docker Compose setup — services, volumes, networks?",
              d: ["intermediate", "advanced"],
              a: `
<pre>
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      DB_HOST: postgres
      REDIS_URL: redis://redis:6379
    volumes:
      - ./src:/app/src:cached
    networks:
      - backend

  postgres:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - pgdata:/var/lib/postgresql/data
    networks:
      - backend

  redis:
    image: redis:7
    networks:
      - backend

volumes:
  pgdata:

networks:
  backend:
    driver: bridge
</pre>
<ul>
  <li><code>docker-compose up</code> starts all services; <code>docker-compose down</code> stops and removes.</li>
  <li><code>volumes:</code> persist data between restarts.</li>
  <li><code>networks:</code> service-to-service communication by hostname.</li>
</ul>`,
            },
            {
              n: 47,
              t: "Docker Compose override and environment variables?",
              d: ["intermediate", "advanced"],
              a: `
<ul>
  <li><strong>Base file:</strong> <code>docker-compose.yml</code></li>
  <li><strong>Override:</strong> <code>docker-compose.override.yml</code> (auto-loaded, dev overrides)</li>
  <li><strong>Environment:</strong> Load from <code>.env</code> file or command line.</li>
  <li><strong>Example:</strong>
<pre>
# .env
DB_PASSWORD=dev123
REDIS_URL=redis://redis:6379
</pre>
    Then in compose: <code>POSTGRES_PASSWORD: \${DB_PASSWORD}</code> expands from .env.
  </li>
</ul>`,
            },
            {
              n: 48,
              t: "Differences between docker run and docker-compose for local dev?",
              d: ["intermediate"],
              a: `
<ul>
  <li><strong>docker run:</strong> Single container; must manually link containers with <code>--link</code> or network.</li>
  <li><strong>docker-compose:</strong> Multiple containers; automatic network, volumes, env management.</li>
  <li><strong>docker-compose advantages:</strong> Reproducible dev environment, shared with team, CI can use same compose file.</li>
  <li><strong>Best practice:</strong> Always use docker-compose for multi-service apps.</li>
</ul>`,
            },
          ],
        },
      ],
    },
    {
      label: "PART 5 · KUBERNETES ARCHITECTURE & CONCEPTS",
      sections: [
        {
          id: "k8s-architecture",
          n: 11,
          title: "Kubernetes Cluster Architecture and Objects",
          desc: "Core K8s concepts and architecture.",
          questions: [
            {
              n: 49,
              t: "Kubernetes cluster components — Master vs Worker nodes?",
              d: ["intermediate", "advanced"],
              a: `
<ul>
  <li><strong>Master (Control Plane):</strong>
    <ul>
      <li>API Server: REST API for cluster management.</li>
      <li>Scheduler: assigns Pods to Nodes based on resource requests.</li>
      <li>Controller Manager: runs controllers (Deployment, Service, etc.).</li>
      <li>etcd: distributed database for cluster state.</li>
    </ul>
  </li>
  <li><strong>Worker Node:</strong>
    <ul>
      <li>kubelet: agent ensuring Pods run as specified.</li>
      <li>kube-proxy: network proxy, handles service routing.</li>
      <li>Container runtime (Docker, containerd).</li>
    </ul>
  </li>
  <li><strong>High Availability:</strong> Multiple master nodes replicate state via etcd quorum.</li>
</ul>`,
            },
            {
              n: 50,
              t: "Pod — the smallest deployable unit in Kubernetes?",
              d: ["intermediate"],
              a: `
<ul>
  <li><strong>What is a Pod:</strong> Wrapper around one or more containers; usually one container per Pod.</li>
  <li><strong>Shared resources:</strong> Network namespace (shared IP, localhost), storage volumes.</li>
  <li><strong>Lifecycle:</strong> Pending → Running → Succeeded/Failed → Terminated.</li>
  <li><strong>Multi-container Pod example:</strong> App container + logging sidecar (both share IP, both can write to /var/log).</li>
  <li><strong>Best practice:</strong> One container per Pod unless tightly coupled; use sidecar pattern sparingly.</li>
</ul>`,
            },
            {
              n: 51,
              t: "Deployment vs StatefulSet vs DaemonSet vs Job?",
              d: ["intermediate", "advanced"],
              a: `
<table>
  <tr><th>Deployment</th><th>StatefulSet</th><th>DaemonSet</th><th>Job</th></tr>
  <tr><td>Stateless app replicas</td><td>Stateful app (DB, Redis)</td><td>Run on every node</td><td>One-time tasks</td></tr>
  <tr><td>Replicas interchangeable</td><td>Stable hostname, persistent volume</td><td>Logging agent, monitoring</td><td>Batch processing</td></tr>
  <tr><td>Rolling update</td><td>Rolling update with ordering</td><td>Auto-scales to node count</td><td>Retry on failure</td></tr>
  <tr><td>Example: backend API</td><td>Example: PostgreSQL</td><td>Example: Prometheus node-exporter</td><td>Example: data migration</td></tr>
</table>`,
            },
            {
              n: 52,
              t: "Service types — ClusterIP vs NodePort vs LoadBalancer?",
              d: ["intermediate", "advanced"],
              a: `
<table>
  <tr><th>ClusterIP</th><th>NodePort</th><th>LoadBalancer</th></tr>
  <tr><td>Internal cluster-only</td><td>Each node opens port</td><td>Cloud LB (ALB, NLB)</td></tr>
  <tr><td>Service discoverable by DNS</td><td>Access via node-ip:port</td><td>Assigns cloud LB IP</td></tr>
  <tr><td>For microservice-to-microservice</td><td>For testing, minimal setup</td><td>For production external access</td></tr>
  <tr><td><code>app.default.svc.cluster.local</code></td><td>Each node gets port 30000+</td><td>Cloud-managed, auto-health-check</td></tr>
</table>`,
            },
            {
              n: 53,
              t: "Ingress — HTTP routing and SSL termination?",
              d: ["advanced"],
              a: `
<ul>
  <li><strong>What it is:</strong> Kubernetes object for HTTP/HTTPS routing to Services.</li>
  <li><strong>Example:</strong>
<pre>
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp-ingress
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - example.com
    secretName: tls-cert
  rules:
  - host: example.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: backend-svc
            port:
              number: 8080
</pre>
  </li>
  <li><strong>Ingress Controller:</strong> Nginx-Ingress, AWS ALB Controller, GCP Ingress, etc. watches Ingress objects and configures router.</li>
</ul>`,
            },
          ],
        },
        {
          id: "k8s-resource-mgmt",
          n: 12,
          title: "Resource Management — Requests, Limits, HPA, Autoscaling",
          desc: "Scaling and resource allocation.",
          questions: [
            {
              n: 54,
              t: "Resource requests vs limits — how scheduler uses them?",
              d: ["intermediate", "advanced"],
              a: `
<ul>
  <li><strong>Requests:</strong> Minimum guaranteed resources; scheduler finds node with enough free capacity.</li>
  <li><strong>Limits:</strong> Maximum allowed; process killed if exceeded.</li>
  <li><strong>Example:</strong>
<pre>
resources:
  requests:
    cpu: "500m"      # 0.5 core guaranteed
    memory: "256Mi"  # 256MB guaranteed
  limits:
    cpu: "1000m"     # Max 1 core
    memory: "512Mi"  # Max 512MB, OOMKilled if exceeded
</pre>
  </li>
  <li><strong>QoS Class:</strong> Guaranteed (request=limit), Burstable (request<limit), BestEffort (no request).</li>
  <li><strong>Best practice:</strong> Always set requests; set limits to prevent runaway processes.</li>
</ul>`,
            },
            {
              n: 55,
              t: "HPA (Horizontal Pod Autoscaler) — metrics and scaling policy?",
              d: ["advanced"],
              a: `
<ul>
  <li><strong>Metrics:</strong> CPU, memory, custom (latency, requests/sec).</li>
  <li><strong>Example:</strong>
<pre>
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api
  minReplicas: 2
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
</pre>
  </li>
  <li><strong>Scale down delay:</strong> 5 min default; prevents thrashing.</li>
</ul>`,
            },
            {
              n: 56,
              t: "Pod Disruption Budgets (PDB) — ensuring reliability during upgrades?",
              d: ["advanced"],
              a: `
<ul>
  <li><strong>What it is:</strong> Minimum Pods that must remain running during voluntary disruptions.</li>
  <li><strong>Voluntary disruptions:</strong> Node drain, cluster upgrade, pod eviction.</li>
  <li><strong>Example:</strong>
<pre>
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: api-pdb
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: api
</pre>
    At least 2 replicas must stay running during upgrades.
  </li>
  <li><strong>Alternative:</strong> <code>maxUnavailable: 1</code> (max 1 can be disrupted).</li>
</ul>`,
            },
            {
              n: 57,
              t: "Cluster Autoscaler vs HPA — how they interact?",
              d: ["advanced"],
              a: `
<ul>
  <li><strong>HPA:</strong> Scales Pod replicas based on metrics (CPU, memory).</li>
  <li><strong>Cluster Autoscaler:</strong> Scales underlying worker nodes if Pods can't schedule.</li>
  <li><strong>Flow:</strong> High load → HPA creates more Pods → no node capacity → Cluster Autoscaler adds nodes.</li>
  <li><strong>Scale down:</strong> Low load → HPA removes Pods → unused nodes removed by Cluster Autoscaler (5-10 min delay).</li>
</ul>`,
            },
            {
              n: 58,
              t: "Vertical Pod Autoscaler (VPA) — automatic resource tuning?",
              d: ["advanced", "expert"],
              a: `
<ul>
  <li><strong>What it does:</strong> Analyzes actual CPU/memory usage; recommends and auto-adjusts requests/limits.</li>
  <li><strong>Modes:</strong>
    <ul>
      <li>Off: recommendations only.</li>
      <li>DryRun: log recommendations, no changes.</li>
      <li>Recreate: apply and restart Pods.</li>
      <li>Auto: same as Recreate (default).</li>
    </ul>
  </li>
  <li><strong>Use case:</strong> Apps with unpredictable resource patterns; avoid manual tuning.</li>
  <li><strong>Note:</strong> Don't combine VPA + HPA on same metrics (can cause thrashing).</li>
</ul>`,
            },
          ],
        },
      ],
    },
    {
      label: "PART 6 · KUBERNETES OPERATIONS & DEBUGGING",
      sections: [
        {
          id: "k8s-debugging",
          n: 13,
          title: "Kubernetes Debugging, Monitoring, Observability",
          desc: "Troubleshooting and observability in Kubernetes.",
          questions: [
            {
              n: 59,
              t: "Liveness vs Readiness vs Startup probes — when pod is healthy?",
              d: ["intermediate", "advanced"],
              a: `
<ul>
  <li><strong>Liveness:</strong> Is pod alive? If fails, kubelet restarts container.</li>
  <li><strong>Readiness:</strong> Can pod handle traffic? If fails, removed from Service endpoints.</li>
  <li><strong>Startup:</strong> Has app started up? Prevents liveness checks during slow startup.</li>
  <li><strong>Example:</strong>
<pre>
livenessProbe:
  httpGet:
    path: /health
    port: 8080
  initialDelaySeconds: 10
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 5

startupProbe:
  httpGet:
    path: /startup
    port: 8080
  failureThreshold: 30  # 30 * 10s = 5 min max startup
</pre>
  </li>
</ul>`,
            },
            {
              n: 60,
              t: "kubectl debugging tools — logs, exec, port-forward, describe?",
              d: ["intermediate", "advanced"],
              a: `
<ul>
  <li><code>kubectl logs &lt;pod&gt;</code>: View stdout/stderr.</li>
  <li><code>kubectl logs -f &lt;pod&gt; -c &lt;container&gt;</code>: Tail logs from specific container.</li>
  <li><code>kubectl exec -it &lt;pod&gt; -- /bin/sh</code>: Shell into pod for debugging.</li>
  <li><code>kubectl port-forward &lt;pod&gt; 8080:8080</code>: Local port → pod port (test without exposing).</li>
  <li><code>kubectl describe pod &lt;pod&gt;</code>: Pod spec, events, why pending/not starting.</li>
  <li><code>kubectl get events --sort-by='.lastTimestamp'</code>: Cluster events (pod scheduling failures, errors).</li>
</ul>`,
            },
            {
              n: 61,
              t: "Common pod failure states — Pending, CrashLoopBackOff, ImagePullBackOff?",
              d: ["intermediate", "advanced"],
              a: `
<ul>
  <li><strong>Pending:</strong> Pod can't schedule; check: resource requests, node selectors, taints.</li>
  <li><strong>CrashLoopBackOff:</strong> App crashes on startup; check logs, readiness probe too aggressive.</li>
  <li><strong>ImagePullBackOff:</strong> Can't pull image; check: image name, registry credentials, network.</li>
  <li><strong>OOMKilled:</strong> Process exceeded memory limit; increase limit or optimize app.</li>
  <li><strong>Evicted:</strong> Node out of disk/memory; add nodes or limit pod requests.</li>
</ul>`,
            },
            {
              n: 62,
              t: "Network policies — restricting traffic between pods?",
              d: ["advanced"],
              a: `
<ul>
  <li><strong>Default:</strong> All pods can talk to all pods (flat network).</li>
  <li><strong>Network Policy:</strong> Restrict ingress/egress by pod labels, namespace, IP CIDR.</li>
  <li><strong>Example:</strong>
<pre>
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-netpol
spec:
  podSelector:
    matchLabels:
      tier: backend
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          tier: frontend
    ports:
    - protocol: TCP
      port: 8080
</pre>
    Only frontend pods can access backend:8080; all other traffic denied.
  </li>
  <li><strong>Note:</strong> Requires CNI plugin support (Calico, Cilium, Weave).</li>
</ul>`,
            },
            {
              n: 63,
              t: "RBAC (Role-Based Access Control) — least-privilege cluster access?",
              d: ["advanced"],
              a: `
<ul>
  <li><strong>Role:</strong> Rules for what actions allowed on which resources.</li>
  <li><strong>RoleBinding:</strong> Links Role to user/service account.</li>
  <li><strong>Example:</strong>
<pre>
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-reader
rules:
- apiGroups: [""]
  resources: ["pods", "pods/logs"]
  verbs: ["get", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: pod-reader
subjects:
- kind: User
  name: alice@example.com
  apiGroup: rbac.authorization.k8s.io
</pre>
    User alice can only read pods and logs.
  </li>
</ul>`,
            },
          ],
        },
      ],
    },
    {
      label: "PART 7 · DEPLOYMENT STRATEGIES & WORKFLOWS",
      sections: [
        {
          id: "deploy-strategies",
          n: 14,
          title: "Zero-Downtime Deployments — Blue-Green, Canary, Rolling",
          desc: "Production deployment strategies.",
          questions: [
            {
              n: 64,
              t: "Blue-Green deployment — how to implement and rollback instantly?",
              d: ["advanced", "expert"],
              a: `
<ul>
  <li><strong>Setup:</strong> Two identical environments (blue active, green standby); traffic router points to blue.</li>
  <li><strong>Deploy:</strong>
    <ol>
      <li>Deploy new version to green (no traffic).</li>
      <li>Run full test suite against green.</li>
      <li>Health checks on green.</li>
      <li>Smoke tests and manual validation.</li>
      <li>Switch traffic router to green.</li>
      <li>Monitor green; if OK, keep. If issues, switch back to blue (instant).</li>
    </ol>
  </li>
  <li><strong>Advantages:</strong> Instant rollback, full test environment.</li>
  <li><strong>Disadvantages:</strong> 2x infrastructure cost, database state sync (if not read-only green).</li>
  <li><strong>In Kubernetes:</strong> Two Deployments + Service selector switch.</li>
</ul>`,
            },
            {
              n: 65,
              t: "Canary deployment — gradual traffic shift with monitoring?",
              d: ["advanced", "expert"],
              a: `
<ul>
  <li><strong>Approach:</strong> Route small % traffic to new version; gradually increase if metrics good.</li>
  <li><strong>Flow:</strong>
    <ol>
      <li>Deploy new version (0% traffic).</li>
      <li>Route 1% traffic to new version; monitor error rate, latency, business metrics.</li>
      <li>If metrics OK, increase 5%, 10%, 25%, 50%, 100%.</li>
      <li>Rollback threshold: if error rate spikes, redirect all back to old version.</li>
    </ol>
  </li>
  <li><strong>In Kubernetes:</strong> Use Istio/Flagger with traffic splitting (HTTPRoute or VirtualService).</li>
  <li><strong>Advantages:</strong> Low risk, real-world data, single environment.</li>
  <li><strong>Disadvantages:</strong> Slower rollout, requires monitoring setup.</li>
</ul>`,
            },
            {
              n: 66,
              t: "Rolling update — default Kubernetes deployment strategy?",
              d: ["intermediate", "advanced"],
              a: `
<ul>
  <li><strong>How it works:</strong>
    <ol>
      <li>Create new Pod with new version.</li>
      <li>Wait for readiness probe pass.</li>
      <li>Add to Service load balancing.</li>
      <li>Remove old Pod.</li>
      <li>Repeat until all old Pods replaced.</li>
    </ol>
  </li>
  <li><strong>Configuration:</strong>
<pre>
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1          # max 1 extra pod during update
      maxUnavailable: 0    # max 0 unavailable (all running)
</pre>
  </li>
  <li><strong>Example:</strong> 3 replicas, maxSurge=1, maxUnavailable=0 → peak 4 pods during update.</li>
  <li><strong>Advantages:</strong> No extra infrastructure, simple, built-in.</li>
  <li><strong>Disadvantages:</strong> Mixed versions briefly, if new version has bugs, users see bad version.</li>
</ul>`,
            },
            {
              n: 67,
              t: "Shadow traffic deployment — test new version without user impact?",
              d: ["advanced", "expert"],
              a: `
<ul>
  <li><strong>Concept:</strong> Send copy of production traffic to new version; responses discarded, don't affect users.</li>
  <li><strong>Setup:</strong>
    <ul>
      <li>Request interceptor at API Gateway duplicates request to new version.</li>
      <li>Response from old version returned to user.</li>
      <li>Response from new version logged/analyzed but discarded.</li>
    </ul>
  </li>
  <li><strong>In Kubernetes:</strong> Use service mesh (Istio) for traffic mirroring.</li>
  <li><strong>Example Istio:</strong>
<pre>
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: api
spec:
  hosts:
  - api
  http:
  - match:
    - uri:
        prefix: /
    route:
    - destination:
        host: api
        subset: v1
      weight: 100
    mirror:
      host: api
      subset: v2
    mirrorPercent: 100
</pre>
  </li>
</ul>`,
            },
            {
              n: 68,
              t: "Zero-downtime deployment checklist for production systems?",
              d: ["expert"],
              a: `
<ul>
  <li><strong>Before deployment:</strong>
    <ul>
      <li>Backward-compatible DB schema changes first (expand schema, support old and new code).</li>
      <li>Feature flags for risky features (can disable without redeploy).</li>
      <li>Run full test suite including integration tests.</li>
      <li>Load tests to confirm performance.</li>
    </ul>
  </li>
  <li><strong>During deployment:</strong>
    <ul>
      <li>Monitor error rate, latency, saturation (golden signals).</li>
      <li>Canary or blue-green with automated rollback trigger (e.g., if error rate > 0.5%).</li>
      <li>Gradual traffic shift, not all-at-once.</li>
      <li>On-call engineer watching metrics, ready to rollback.</li>
    </ul>
  </li>
  <li><strong>After deployment:</strong>
    <ul>
      <li>Monitor for 30 min to 1 hour (catch subtle bugs).</li>
      <li>Run smoke tests on production endpoints.</li>
      <li>Clean up old code/schema after confirmation (contract phase).</li>
    </ul>
  </li>
</ul>`,
            },
          ],
        },
      ],
    },
    {
      label: "PART 8 · INFRASTRUCTURE-AS-CODE & GITOPS",
      sections: [
        {
          id: "iac-gitops",
          n: 15,
          title: "Terraform, Helm, ArgoCD — Modern Infrastructure",
          desc: "IaC tools and GitOps workflows.",
          questions: [
            {
              n: 69,
              t: "Terraform fundamentals — state, providers, modules?",
              d: ["intermediate", "advanced"],
              a: `
<ul>
  <li><strong>State file:</strong> JSON file tracking resources; must be versioned in git or remote backend.</li>
  <li><strong>Providers:</strong> Plugins for cloud (AWS, Azure, GCP) and third-party (Kubernetes, Helm).</li>
  <li><strong>Resources:</strong> Infrastructure objects (EC2 instance, VPC, database).</li>
  <li><strong>Example:</strong>
<pre>
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "app" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.micro"
  tags = {
    Name = "myapp"
  }
}

output "instance_ip" {
  value = aws_instance.app.public_ip
}
</pre>
  </li>
  <li><strong>Commands:</strong> <code>terraform plan</code> (preview), <code>terraform apply</code> (create), <code>terraform destroy</code> (teardown).</li>
</ul>`,
            },
            {
              n: 70,
              t: "Terraform modules — reusable infrastructure components?",
              d: ["advanced"],
              a: `
<ul>
  <li><strong>Module:</strong> Reusable set of resources; input variables and outputs.</li>
  <li><strong>Example:</strong>
<pre>
# modules/vpc/main.tf
resource "aws_vpc" "main" {
  cidr_block = var.cidr_block
  tags = {
    Name = var.name
  }
}

resource "aws_subnet" "public" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.public_subnet
  availability_zone = var.az
}

output "vpc_id" {
  value = aws_vpc.main.id
}

# root/main.tf
module "vpc" {
  source = "./modules/vpc"
  cidr_block = "10.0.0.0/16"
  public_subnet = "10.0.1.0/24"
  name = "prod-vpc"
}
</pre>
  </li>
  <li><strong>Module registry:</strong> Terraform Registry has pre-built modules (AWS, Azure, GCP).</li>
</ul>`,
            },
            {
              n: 71,
              t: "Helm — Kubernetes package manager for templating and deployment?",
              d: ["intermediate", "advanced"],
              a: `
<ul>
  <li><strong>What it does:</strong> Templating engine for Kubernetes manifests; package management for charts.</li>
  <li><strong>Helm Chart:</strong> Directory with templates, values.yaml (defaults), Chart.yaml (metadata).</li>
  <li><strong>Example:</strong>
<pre>
# Chart.yaml
apiVersion: v2
name: myapp
version: 1.0.0
appVersion: "1.2.3"

# values.yaml
replicaCount: 3
image:
  repository: myapp
  tag: "1.2.3"
  port: 8080

# templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Release.Name }}
spec:
  replicas: {{ .Values.replicaCount }}
  template:
    spec:
      containers:
      - name: app
        image: {{ .Values.image.repository }}:{{ .Values.image.tag }}
        ports:
        - containerPort: {{ .Values.image.port }}
</pre>
  </li>
  <li><code>helm install myrelease ./chart -f values-prod.yaml</code> deploys with overrides.</li>
</ul>`,
            },
            {
              n: 72,
              t: "ArgoCD — GitOps continuous deployment for Kubernetes?",
              d: ["advanced", "expert"],
              a: `
<ul>
  <li><strong>Concept:</strong> Declarative Kubernetes state stored in Git; ArgoCD syncs cluster to Git state.</li>
  <li><strong>Benefits:</strong> Git is source of truth, easy rollback (git revert), audit trail, diff before apply.</li>
  <li><strong>Setup:</strong>
    <ol>
      <li>Git repo with Kubernetes manifests (YAML) or Kustomize/Helm.</li>
      <li>ArgoCD watches repo; detects changes.</li>
      <li>Compares cluster state to repo; auto-syncs or notifies.</li>
      <li>If Pod crashes, ArgoCD re-applies manifest (healing).</li>
    </ol>
  </li>
  <li><strong>Example:</strong>
<pre>
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: myapp
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/myorg/myapp
    targetRevision: main
    path: k8s/
  destination:
    server: https://kubernetes.default.svc
    namespace: default
  syncPolicy:
    automated:
      prune: true      # remove resources not in repo
      selfHeal: true   # re-sync if cluster drifts
</pre>
  </li>
</ul>`,
            },
          ],
        },
      ],
    },
    {
      label: "PART 9 · MULTI-REGION & DISASTER RECOVERY",
      sections: [
        {
          id: "multiregion-dr",
          n: 16,
          title: "Multi-Region Architecture, RTO/RPO, Failover",
          desc: "High availability across regions and disaster recovery.",
          questions: [
            {
              n: 73,
              t: "Active-Active vs Active-Passive multi-region deployments?",
              d: ["advanced", "expert"],
              a: `
<table>
  <tr><th>Active-Active</th><th>Active-Passive</th></tr>
  <tr><td>Both regions serve traffic</td><td>Primary serves traffic, secondary standby</td></tr>
  <tr><td>Traffic split (weighted routing)</td><td>Failover only if primary down</td></tr>
  <tr><td>Both regions need full capacity</td><td>Secondary lower capacity (less cost)</td></tr>
  <tr><td>Data sync bidirectional (complex)</td><td>One-way replication simpler</td></tr>
  <tr><td>No downtime during region failure</td><td>Brief downtime during failover</td></tr>
  <tr><td>For 99.99%+ uptime</td><td>For 99.9-99.95% uptime</td></tr>
</table>`,
            },
            {
              n: 74,
              t: "RTO and RPO — defining disaster recovery targets?",
              d: ["advanced"],
              a: `
<ul>
  <li><strong>RTO (Recovery Time Objective):</strong> Max acceptable downtime. E.g., 1 hour.</li>
  <li><strong>RPO (Recovery Point Objective):</strong> Max acceptable data loss. E.g., 15 minutes.</li>
  <li><strong>Relationship:</strong> Tighter targets (RTO < 15 min, RPO < 5 min) require active replication, higher cost.</li>
  <li><strong>Example strategy for 99.99% uptime + 1-hour RTO + 15-min RPO:</strong>
    <ul>
      <li>Active-Active with real-time replication (cross-region).</li>
      <li>Automated failover via Route 53 health checks.</li>
      <li>Continuous backup to S3 every 5 min.</li>
    </ul>
  </li>
</ul>`,
            },
            {
              n: 75,
              t: "Backup strategies — snapshots, WAL archiving, incremental backups?",
              d: ["advanced"],
              a: `
<ul>
  <li><strong>Snapshots:</strong> Point-in-time filesystem copy; fast, incremental, but need consistent state.</li>
  <li><strong>WAL (Write-Ahead Logging):</strong> Database writes to log file first; replay log to recover point-in-time.</li>
  <li><strong>Incremental backups:</strong> Only changes since last backup; saves storage.</li>
  <li><strong>3-2-1 rule:</strong> 3 copies (2 onsite media types, 1 offsite).</li>
  <li><strong>Backup frequency:</strong> Balance RPO (data loss limit) vs storage cost.</li>
</ul>`,
            },
            {
              n: 76,
              t: "DNS failover and traffic steering — Route 53 and Traffic Manager?",
              d: ["advanced"],
              a: `
<ul>
  <li><strong>Route 53:</strong> DNS health checks; if primary unhealthy, return secondary IP.</li>
  <li><strong>Azure Traffic Manager:</strong> DNS-based routing by health, priority, weighted, geographic.</li>
  <li><strong>Failover detection:</strong> HTTP/TCP probes every 30 sec; declare unhealthy after 3 failures (90 sec).</li>
  <li><strong>TTL strategy:</strong> Low TTL (30-60 sec) for critical services; clients don't cache stale DNS.</li>
</ul>`,
            },
            {
              n: 77,
              t: "Cross-region replication lag and consistency challenges?",
              d: ["advanced", "expert"],
              a: `
<ul>
  <li><strong>Problem:</strong> Network latency between regions (100-200ms); writes replicate asynchronously.</li>
  <li><strong>Consistency issues:</strong>
    <ul>
      <li>Read-after-write: read from secondary, miss recent writes from primary.</li>
      <li>Write conflicts: simultaneous writes to primary and secondary (active-active).</li>
    </ul>
  </li>
  <li><strong>Solutions:</strong>
    <ul>
      <li>Sticky routing: route user to same region (all reads/writes consistent).</li>
      <li>Eventual consistency with conflict resolution (Last-Write-Wins, CRDTs).</li>
      <li>Globally unique IDs (UUID or snowflake IDs) to avoid conflicts.</li>
      <li>Event sourcing with idempotent events.</li>
    </ul>
  </li>
</ul>`,
            },
          ],
        },
      ],
    },
    {
      label: "PART 10 · OBSERVABILITY & MONITORING IN CLOUD",
      sections: [
        {
          id: "cloud-observability",
          n: 17,
          title: "Logs, Metrics, Traces, Alerts — Production Visibility",
          desc: "Observability stack for cloud applications.",
          questions: [
            {
              n: 78,
              t: "Logs vs Metrics vs Traces — three pillars of observability?",
              d: ["intermediate", "advanced"],
              a: `
<ul>
  <li><strong>Logs:</strong> Discrete events (unstructured text or structured JSON). E.g., "user login from IP 1.2.3.4".</li>
  <li><strong>Metrics:</strong> Time-series data (CPU, error rate, latency). E.g., "p99 latency 150ms at 10:30am".</li>
  <li><strong>Traces:</strong> Request journey across services (distributed tracing). E.g., "Request A → Service X → DB → Cache → Service Y".</li>
  <li><strong>Tools:</strong>
    <ul>
      <li>Logs: CloudWatch Logs, ELK Stack (Elasticsearch), Datadog, Splunk.</li>
      <li>Metrics: CloudWatch Metrics, Prometheus, Datadog, New Relic.</li>
      <li>Traces: X-Ray, Jaeger, Zipkin, Datadog APM.</li>
    </ul>
  </li>
</ul>`,
            },
            {
              n: 79,
              t: "CloudWatch vs Azure Monitor vs Prometheus — cloud monitoring comparison?",
              d: ["advanced"],
              a: `
<table>
  <tr><th>CloudWatch</th><th>Azure Monitor</th><th>Prometheus</th></tr>
  <tr><td>AWS-native</td><td>Azure-native</td><td>Open-source, any cloud</td></tr>
  <tr><td>Logs, Metrics, Alarms</td><td>Logs, Metrics, Application Insights</td><td>Metrics only (pull-based)</td></tr>
  <tr><td>Push model</td><td>Push model</td><td>Pull model (scrape)</td></tr>
  <tr><td>Higher cost for large volume</td><td>Higher cost for large volume</td><td>Free (self-hosted)</td></tr>
  <tr><td>Better AWS integration</td><td>Better Azure integration</td><td>Best portability</td></tr>
</table>
<p><strong>Pattern:</strong> Use CloudWatch for AWS-only, Prometheus for multi-cloud, Datadog for comprehensive SaaS observability.</p>`,
            },
            {
              n: 80,
              t: "SLI, SLO, SLA — defining and measuring service health?",
              d: ["advanced", "expert"],
              a: `
<ul>
  <li><strong>SLI (Service Level Indicator):</strong> Quantitative metric. E.g., "99.5% requests < 100ms latency".</li>
  <li><strong>SLO (Service Level Objective):</strong> Target for SLI. E.g., "SLO: 99.5% latency SLI".</li>
  <li><strong>SLA (Service Level Agreement):</strong> Contractual commitment + penalty. E.g., "if SLI < 99%, refund $1000".</li>
  <li><strong>Error budget:</strong> Allowed failures within SLO window. E.g., 99.9% uptime SLO → 43 min downtime/month.</li>
  <li><strong>Example:</strong>
    <ul>
      <li>SLI: % of API requests completing in < 200ms.</li>
      <li>SLO: SLI ≥ 99%.</li>
      <li>SLA: If SLO violated, credit customer 10% monthly fee.</li>
      <li>Error budget: 1% failures = ~7 hours downtime/month.</li>
    </ul>
  </li>
</ul>`,
            },
            {
              n: 81,
              t: "Distributed tracing — tracing requests across microservices?",
              d: ["advanced"],
              a: `
<ul>
  <li><strong>Problem:</strong> Single user request spans multiple services; debugging latency/errors hard.</li>
  <li><strong>Solution:</strong> Trace ID propagated through request; each service logs trace ID.</li>
  <li><strong>Implementation:</strong>
    <ul>
      <li>API Gateway generates or propagates trace ID (X-Trace-ID header).</li>
      <li>Each service logs trace ID + local timing.</li>
      <li>Backend collects logs and reconstructs full trace.</li>
    </ul>
  </li>
  <li><strong>Tools:</strong> Jaeger, Zipkin, AWS X-Ray, DataDog APM.</li>
  <li><strong>Example trace:</strong> User request → API Gateway (1ms) → Service A (50ms) → Cache (5ms) → Service B (100ms) → DB (200ms) → total 356ms.</li>
</ul>`,
            },
            {
              n: 82,
              t: "Alert thresholds and on-call rotation — avoiding alert fatigue?",
              d: ["advanced"],
              a: `
<ul>
  <li><strong>Alert quality:</strong>
    <ul>
      <li><strong>Good alert:</strong> Actionable, low false positive, alerts human only if action needed.</li>
      <li><strong>Bad alert:</strong> Fires constantly, no clear action, "too noisy".</li>
    </ul>
  </li>
  <li><strong>Threshold setting:</strong> Use SLO to define alert triggers. E.g., error rate > 1% (SLO 99%).</li>
  <li><strong>Multi-level escalation:</strong>
    <ul>
      <li>Warning (80% of SLO): page team (30 min response).</li>
      <li>Critical (50% of SLO): wake on-call engineer (5 min response).</li>
    </ul>
  </li>
  <li><strong>On-call rotation:</strong> Weekly or bi-weekly; cover all timezones; on-call gets pager.</li>
</ul>`,
            },
          ],
        },
      ],
    },
    {
      label: "PART 11 · SECURITY & COMPLIANCE IN CLOUD",
      sections: [
        {
          id: "cloud-security",
          n: 18,
          title: "Cloud Security — IAM, Encryption, Secrets, Compliance",
          desc: "Securing cloud workloads and data.",
          questions: [
            {
              n: 83,
              t: "IAM (Identity and Access Management) — least privilege principle?",
              d: ["intermediate", "advanced"],
              a: `
<ul>
  <li><strong>Principle:</strong> Grant minimum permissions needed; remove unnecessary access.</li>
  <li><strong>AWS IAM:</strong>
    <ul>
      <li>Policies: JSON defining allowed actions on resources.</li>
      <li>Roles: Assume role, get temporary credentials (better than static keys).</li>
      <li>Example: EC2 instance with role to read S3 bucket only (not write, not other buckets).</li>
    </ul>
  </li>
  <li><strong>Azure RBAC:</strong>
    <ul>
      <li>Roles: Reader, Contributor, Owner.</li>
      <li>Scope: Management group, subscription, resource group, resource.</li>
      <li>Example: Reader on resource group (can view, not modify).</li>
    </ul>
  </li>
  <li><strong>MFA:</strong> Always enable for production access.</li>
</ul>`,
            },
            {
              n: 84,
              t: "Secrets management — where to store DB passwords, API keys, certs?",
              d: ["intermediate", "advanced"],
              a: `
<ul>
  <li><strong>Never hardcode in code or environment variables; use dedicated secret manager.</strong></li>
  <li><strong>AWS Secrets Manager:</strong>
    <ul>
      <li>Store secrets (DB password, API key).</li>
      <li>Automatic rotation.</li>
      <li>Audit logs of who accessed.</li>
      <li>Encryption with KMS.</li>
    </ul>
  </li>
  <li><strong>Azure Key Vault:</strong>
    <ul>
      <li>Secrets, keys, certificates storage.</li>
      <li>Managed identity for apps (no credential needed).</li>
    </ul>
  </li>
  <li><strong>In Kubernetes:</strong> Use External Secrets Operator or CSI driver to sync cloud secrets to k8s Secrets.</li>
</ul>`,
            },
            {
              n: 85,
              t: "Encryption at rest vs in transit — when to encrypt?",
              d: ["advanced"],
              a: `
<ul>
  <li><strong>At rest:</strong> Encrypt data on disk/database.</li>
  <li><strong>In transit:</strong> Encrypt data over network (TLS/HTTPS).</li>
  <li><strong>Both needed:</strong>
    <ul>
      <li>At rest: Protect if storage compromised.</li>
      <li>In transit: Protect if network sniffed.</li>
    </ul>
  </li>
  <li><strong>Key management:</strong> Use cloud KMS (AWS KMS, Azure Key Vault) not self-managed.</li>
  <li><strong>TLS certificates:</strong> Use Let's Encrypt (free) or cloud provider cert service.</li>
</ul>`,
            },
            {
              n: 86,
              t: "WAF (Web Application Firewall) — protecting web apps from attacks?",
              d: ["advanced"],
              a: `
<ul>
  <li><strong>What it does:</strong> Inspects HTTP requests; blocks malicious patterns.</li>
  <li><strong>Rules:</strong>
    <ul>
      <li>SQL injection: detect \` ' or 1=1 -- patterns.</li>
      <li>XSS: detect <script> tags.</li>
      <li>Rate limiting: block if > 1000 req/min from IP.</li>
      <li>Geo-blocking: block traffic from certain countries.</li>
    </ul>
  </li>
  <li><strong>Deployment:</strong> In front of ALB, CloudFront, or API Gateway.</li>
</ul>`,
            },
            {
              n: 87,
              t: "Compliance frameworks — SOC 2, HIPAA, PCI-DSS in cloud deployments?",
              d: ["advanced", "expert"],
              a: `
<ul>
  <li><strong>SOC 2:</strong> Security, availability, integrity, confidentiality audit.</li>
  <li><strong>HIPAA:</strong> Healthcare data protection (US).</li>
  <li><strong>PCI-DSS:</strong> Payment card data protection (Visa, Mastercard).</li>
  <li><strong>Common requirements:</strong>
    <ul>
      <li>Encryption at rest and in transit.</li>
      <li>Audit logging (who accessed what, when).</li>
      <li>Access controls (MFA, least privilege).</li>
      <li>Data retention and deletion policies.</li>
      <li>Incident response plan.</li>
      <li>Regular penetration testing.</li>
    </ul>
  </li>
  <li><strong>Cloud provider shared responsibility:</strong> Cloud handles infrastructure compliance; you handle app/data compliance.</li>
</ul>`,
            },
          ],
        },
      ],
    },
    {
      label: "PART 12 · COST OPTIMIZATION & MAANG INTERVIEW QUESTIONS",
      sections: [
        {
          id: "cost-optimization",
          n: 19,
          title: "Cost Optimization and Cloud Architecture Decisions",
          desc: "Reducing cloud spend and real-world decisions.",
          questions: [
            {
              n: 88,
              t: "Cost optimization strategies — reserved instances, spot, autoscaling, tiering?",
              d: ["advanced", "expert"],
              a: `
<ul>
  <li><strong>Reserved Instances (AWS) / Reservations (Azure):</strong> Commit 1y/3y for 30-70% discount; good for stable baseline.</li>
  <li><strong>Spot Instances (AWS) / Spot VMs (Azure):</strong> Up to 90% discount; can be interrupted; good for batch, non-critical.</li>
  <li><strong>Savings Plans (AWS):</strong> Flexible compute savings; covers on-demand, reserved, spot.</li>
  <li><strong>Autoscaling:</strong> Scale to zero during low-traffic periods (nights, weekends).</li>
  <li><strong>Storage tiering:</strong> Hot → Cool → Archive lifecycle; older data moves to cheaper tiers.</li>
  <li><strong>Right-sizing:</strong> Analyze usage, trim over-provisioned resources.</li>
  <li><strong>Caching:</strong> Reduce database/network calls; ElastiCache, CloudFront, Redis.</li>
  <li><strong>Multi-cloud:</strong> Use cheapest provider per workload (AWS Lambda cheap for spiky, GCP best for ML).</li>
</ul>`,
            },
            {
              n: 89,
              t: "MAANG question: Design autoscaling for 10K requests/sec spike?",
              d: ["expert"],
              a: `
<ul>
  <li><strong>Requirements:</strong> Peak 10K RPS, baseline 100 RPS, max latency 200ms.</li>
  <li><strong>Architecture:</strong>
    <ul>
      <li>API Gateway (auto-scales, no config needed).</li>
      <li>ALB → Autoscaling Group (ASG) with ECS Fargate.</li>
      <li>ElastiCache (Redis) for session/cache; reduces database load.</li>
      <li>RDS Multi-AZ with read replicas for read-heavy queries.</li>
      <li>CloudFront CDN for static assets.</li>
    </ul>
  </li>
  <li><strong>Scaling strategy:</strong>
    <ul>
      <li>Target tracking: CPU 70%; ASG adds 5 instances if CPU > 70%, removes if < 30%.</li>
      <li>Predictive scaling: ML model predicts spike times; pre-scale.</li>
      <li>Connection draining: 30-sec graceful shutdown; no request loss during scale-down.</li>
    </ul>
  </li>
  <li><strong>Testing:</strong> Load test to 10K RPS; measure latency, cost, scaling speed.</li>
</ul>`,
            },
            {
              n: 90,
              t: "MAANG question: Multi-region deployment for 99.99% uptime SLA?",
              d: ["expert"],
              a: `
<ul>
  <li><strong>Target:</strong> 99.99% uptime (52 min downtime/year), RTO < 1 min, RPO < 5 min.</li>
  <li><strong>Architecture:</strong>
    <ul>
      <li>Active-Active in us-east-1 and eu-west-1.</li>
      <li>Route 53 geo-proximity routing; health check every 30 sec.</li>
      <li>DynamoDB global tables for multi-region replication.</li>
      <li>S3 cross-region replication for data durability.</li>
      <li>CloudFront CDN in front; geo-local caching.</li>
    </ul>
  </li>
  <li><strong>Failover:</strong> If us-east-1 health check fails 3x (90 sec), Route 53 routes all traffic to eu-west-1.</li>
  <li><strong>Data sync:</strong> DynamoDB eventual consistency (< 1 sec latency); acceptable for most apps.</li>
  <li><strong>Cost:</strong> 2x infrastructure, ~200K/month for startup.</li>
</ul>`,
            },
            {
              n: 91,
              t: "MAANG question: Zero-downtime migration from monolith to microservices on cloud?",
              d: ["expert"],
              a: `
<ul>
  <li><strong>Challenge:</strong> Monolith tightly coupled; can't just redeploy; risk downtime and data loss.</li>
  <li><strong>Strangler Fig pattern:</strong>
    <ol>
      <li>Deploy microservice alongside monolith (e.g., payment service extracted first).</li>
      <li>API Gateway routes payment calls to new service; other calls still to monolith.</li>
      <li>Gradually extract more services (user, order, etc.).</li>
      <li>Monolith becomes just data-access layer.</li>
      <li>Eventually monolith removed.</li>
    </ol>
  </li>
  <li><strong>Data migration:</strong>
    <ul>
      <li>Dual-write: new code writes to both old and new databases.</li>
      <li>Verify consistency; when confident, switch read to new DB.</li>
      <li>Rollback: if issues, switch back to old DB (fast).</li>
    </ul>
  </li>
  <li><strong>Timeline:</strong> 3-6 months for gradual migration; zero downtime; safe rollback.</li>
</ul>`,
            },
            {
              n: 92,
              t: "MAANG question: Cost optimization for a startup vs enterprise cloud deployment?",
              d: ["expert"],
              a: `
<ul>
  <li><strong>Startup (low budget, high scaling uncertainty):</strong>
    <ul>
      <li>Single region (us-east-1, lowest cost).</li>
      <li>Serverless: Lambda, Fargate, DynamoDB (pay-per-use, scale to zero).</li>
      <li>On-demand instances initially; switch to reserved when stable (3-6 months).</li>
      <li>Free tier: CloudFront, Route 53, some ECS usage.</li>
      <li>Cost: ~5K/month for MVP.</li>
    </ul>
  </li>
  <li><strong>Enterprise (large budget, stable traffic):</strong>
    <ul>
      <li>Multi-region (redundancy, compliance).</li>
      <li>Reserved instances + savings plans for 50-60% discount on baseline.</li>
      <li>Mix: EC2 (stable) + Lambda (bursty).</li>
      <li>Spot instances for batch jobs (ML training, log processing).</li>
      <li>Cost: 500K+/month; ROI justifies investment in optimization.</li>
    </ul>
  </li>
</ul>`,
            },
            {
              n: 93,
              t: "MAANG question: Disaster recovery plan for a fintech application?",
              d: ["expert"],
              a: `
<ul>
  <li><strong>Constraints:</strong> PCI-DSS compliance, zero data loss, max 15 min downtime, audit trail required.</li>
  <li><strong>RTO/RPO targets:</strong> RTO < 15 min, RPO = 0 (no data loss).</li>
  <li><strong>Architecture:</strong>
    <ul>
      <li>Multi-region active-active (us-east-1, eu-west-1).</li>
      <li>DynamoDB global tables (replicates writes instantly).</li>
      <li>RDS with cross-region read replicas; failover to replica on primary failure.</li>
      <li>S3 versioning + cross-region replication for all data.</li>
      <li>Event sourcing: immutable transaction log; replay to recover state.</li>
    </ul>
  </li>
  <li><strong>Failover process:</strong>
    <ol>
      <li>Health check detects primary region down.</li>
      <li>Route 53 redirects traffic to secondary (< 1 min).</li>
      <li>Database failover (RDS automatic).</li>
      <li>App replays transaction log if needed.</li>
    </ol>
  </li>
  <li><strong>Testing:</strong> Monthly disaster recovery drill (simulate complete region failure).</li>
</ul>`,
            },
            {
              n: 94,
              t: "MAANG question: Kubernetes cluster design for production workloads?",
              d: ["expert"],
              a: `
<ul>
  <li><strong>Cluster size:</strong> 3+ master nodes (quorum), 20-50+ worker nodes depending on workload.</li>
  <li><strong>Node placement:</strong> Spread across AZs (zone affinity rules).</li>
  <li><strong>Networking:</strong>
    <ul>
      <li>VPC with public/private subnets.</li>
      <li>API server in private subnet + VPN for access.</li>
      <li>Worker nodes in private subnets; NAT gateway for outbound.</li>
      <li>Network policies to restrict pod-to-pod traffic.</li>
    </ul>
  </li>
  <li><strong>Security:</strong>
    <ul>
      <li>RBAC for all service accounts (no default admin).</li>
      <li>Pod security policies (or Pod Security Standards).</li>
      <li>Secret management with sealed-secrets or external-secrets.</li>
    </ul>
  </li>
  <li><strong>Scalability:</strong>
    <ul>
      <li>Cluster autoscaler for node scaling.</li>
      <li>HPA for pod replicas.</li>
      <li>Monitoring + alerts.</li>
    </ul>
  </li>
</ul>`,
            },
            {
              n: 95,
              t: "MAANG question: Canary deployment strategy and metrics for rollback?",
              d: ["expert"],
              a: `
<ul>
  <li><strong>Deployment stages:</strong>
    <ol>
      <li>Deploy new version to cluster; 0% traffic.</li>
      <li>Route 1% traffic; monitor for 5 min (SLOs: error rate < 0.5%, p99 latency < 300ms).</li>
      <li>If OK, 5% traffic; monitor 5 min.</li>
      <li>Gradually: 10%, 25%, 50%, 100%.</li>
      <li>Keep old version ready; rollback via route switch (instant).</li>
    </ol>
  </li>
  <li><strong>Rollback triggers:</strong>
    <ul>
      <li>Error rate spike (> 1%).</li>
      <li>Latency spike (p99 > 500ms).</li>
      <li>Memory leak detected (gradual OOM).</li>
      <li>Manual rollback button.</li>
    </ul>
  </li>
  <li><strong>Tools:</strong> Istio/Flagger for automated canary; ArgoCD for progressive delivery.</li>
</ul>`,
            },
          ],
        },
      ],
    },
  ],
};
