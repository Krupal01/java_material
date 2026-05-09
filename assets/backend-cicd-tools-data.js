/* =========================================================
   CI/CD & DevOps — Pipeline Design, Tools, Testing, Deployment, Incident Response
   ========================================================= */
window.BACKEND_CICD_TOOLS_DATA = {
  parts: [
    {
      label: "PART 1 · CI/CD FUNDAMENTALS & PIPELINE ARCHITECTURE",
      sections: [
        {
          id: "cicd-fundamentals", n: 1, title: "Continuous Integration & Continuous Deployment Concepts",
          desc: "Core concepts every backend engineer must know.",
          questions: [
            {n:1, t:"What is CI (Continuous Integration) and why does it matter?", d:["beginner","intermediate"], a:`
<ul>
  <li><strong>CI:</strong> Automatically build, test, and validate code changes on every commit.</li>
  <li><strong>Benefits:</strong>
    <ul>
      <li>Catch bugs early before merge.</li>
      <li>Prevent integration hell (merge conflicts stay small).</li>
      <li>Fast feedback loop (minutes, not days).</li>
      <li>Team confidence to commit frequently.</li>
    </ul>
  </li>
  <li><strong>Pipeline stages:</strong> Checkout → Lint → Build → Unit Test → Integration Test → Artifact Publish.</li>
</ul>`},
            {n:2, t:"What is CD (Continuous Deployment) vs Continuous Delivery?", d:["beginner","intermediate"], a:`
<ul>
  <li><strong>Continuous Delivery (CD):</strong> Automated deployment to production-ready state; manual trigger for final release.</li>
  <li><strong>Continuous Deployment (CD):</strong> Automated deployment all the way to production; no manual gate.</li>
  <li><strong>When to use each:</strong>
    <ul>
      <li>Continuous Delivery: Most enterprises; safety gate via human review.</li>
      <li>Continuous Deployment: High-trust teams, feature flags protect users.</li>
    </ul>
  </li>
</ul>`},
            {n:3, t:"Pipeline architecture — stages, gates, and feedback loops?", d:["intermediate","advanced"], a:`
<ul>
  <li><strong>Stage 1: Source Trigger</strong> — PR opened or commit pushed to branch.</li>
  <li><strong>Stage 2: Lint & Build</strong> — Code format, compile, fast checks (< 2 min).</li>
  <li><strong>Stage 3: Unit & Integration Tests</strong> — Run with mock/real DB, message queues (< 10 min).</li>
  <li><strong>Stage 4: Security & Quality Scans</strong> — SAST, dependency vulnerabilities, code coverage (< 5 min).</li>
  <li><strong>Stage 5: Artifact Creation</strong> — Build Docker image, publish to registry, tag with commit SHA.</li>
  <li><strong>Stage 6: Deploy to Staging</strong> — Run smoke tests, e2e tests (< 15 min).</li>
  <li><strong>Stage 7: Deploy to Production</strong> — Canary or blue-green, health checks, traffic shift.</li>
</ul>`},
            {n:4, t:"Fast feedback vs comprehensive tests — how to balance in CI?", d:["intermediate","advanced"], a:`
<ul>
  <li><strong>Fast feedback (goal < 5 min):</strong> Lint, unit tests, quick builds. Catch 80% of issues quickly.</li>
  <li><strong>Comprehensive (15-30 min):</strong> Integration tests, e2e tests, performance tests. Run in parallel or after approval.</li>
  <li><strong>Pattern:</strong>
    <ul>
      <li>PR stage: fast tests only; fail fast.</li>
      <li>Post-merge/staging: full test suite; no blocker if already merged.</li>
      <li>Pre-prod: canary smoke tests; rollback if issues.</li>
    </ul>
  </li>
</ul>`},
            {n:5, t:"Immutable artifacts — why rebuild defeats the purpose?", d:["intermediate","advanced"], a:`
<ul>
  <li><strong>Problem:</strong> If you rebuild the same code later, you get different bits (dependencies changed, compiler version, etc.).</li>
  <li><strong>Solution:</strong> Build once during CI; promote the same binary/image through staging → prod.</li>
  <li><strong>Benefits:</strong>
    <ul>
      <li>What you tested is what you deploy (repeatability).</li>
      <li>Fast deployments (no build time).</li>
      <li>Easier rollback (image already exists).</li>
    </ul>
  </li>
  <li><strong>Versioning:</strong> Tag with commit SHA or semantic version + build timestamp (e.g., v1.2.3-build.2026050812).</li>
</ul>`},
            {n:6, t:"How to measure CI/CD pipeline health?", d:["advanced"], a:`
<ul>
  <li><strong>Metrics:</strong>
    <ul>
      <li>Build time: should be < 10 min (fast feedback).</li>
      <li>Test pass rate: should be > 95% (flaky tests erode trust).</li>
      <li>Deployment frequency: how often can we safely deploy (daily for healthy pipeline).</li>
      <li>Lead time: time from commit to production (hours for mature teams).</li>
      <li>Mean time to recovery (MTTR): how fast can we rollback (< 5 min).</li>
    </ul>
  </li>
</ul>`}
          ]
        }
      ]
    },
    {
      label: "PART 2 · GITHUB ACTIONS, GITLAB CI, JENKINS",
      sections: [
        {
          id: "ci-tools", n: 2, title: "Popular CI/CD Tools and Platforms",
          desc: "When to use each tool.",
          questions: [
            {n:7, t:"GitHub Actions — workflow syntax and when to use?", d:["intermediate","advanced"], a:`
<ul>
  <li><strong>Workflow file:</strong> YAML in .github/workflows/ directory; triggered on events (push, PR, schedule).</li>
  <li><strong>Example:</strong>
<pre>
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: secret
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v3
        with:
          java-version: '17'
      - run: mvn clean test
      - name: Upload coverage
        uses: codecov/codecov-action@v3
</pre>
  </li>
  <li><strong>Strengths:</strong> Free for public repos, native GitHub integration, abundant actions marketplace.</li>
  <li><strong>Limitations:</strong> Limited concurrency on free tier, GitHub-only (not multi-cloud).</li>
</ul>`},
            {n:8, t:"GitLab CI — pipeline YAML and advantages over GitHub Actions?", d:["intermediate","advanced"], a:`
<ul>
  <li><strong>Pipeline file:</strong> .gitlab-ci.yml in repo root; triggers on push/merge requests.</li>
  <li><strong>Example:</strong>
<pre>
stages:
  - build
  - test
  - deploy

variables:
  DOCKER_IMAGE: \${CI_REGISTRY_IMAGE}:\${CI_COMMIT_SHA}

build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t \${DOCKER_IMAGE} .
    - docker push \${DOCKER_IMAGE}
  only:
    - main

test:
  stage: test
  image: maven:3.9-eclipse-temurin-17
  script:
    - mvn clean test
  coverage: '/Coverage: \d+\.\d+%/'

deploy:
  stage: deploy
  image: bitnami/kubectl:latest
  script:
    - kubectl set image deployment/api api=\${DOCKER_IMAGE} -n prod
  only:
    - main
</pre>
  </li>
  <li><strong>Strengths:</strong> Powerful matrix builds, GitLab Runner (self-hosted), built-in container registry, better enterprise features.</li>
</ul>`},
            {n:9, t:"Jenkins — distributed builds and declarative pipelines?", d:["advanced"], a:`
<ul>
  <li><strong>Architecture:</strong> Master node orchestrates; agents/executors run jobs in parallel.</li>
  <li><strong>Declarative Pipeline Example:</strong>
<pre>
pipeline {
  agent any
  
  stages {
    stage('Checkout') {
      steps {
        git 'https://github.com/myorg/myapp.git'
      }
    }
    stage('Build') {
      steps {
        sh 'mvn clean package'
      }
    }
    stage('Test') {
      parallel {
        stage('Unit Tests') {
          steps {
            sh 'mvn test'
          }
        }
        stage('Integration Tests') {
          steps {
            sh 'mvn verify'
          }
        }
      }
    }
    stage('Deploy Staging') {
      steps {
        sh './deploy-staging.sh'
      }
    }
    stage('Deploy Prod') {
      when {
        branch 'main'
      }
      input 'Approve deployment?'
      steps {
        sh './deploy-prod.sh'
      }
    }
  }
}
</pre>
  </li>
  <li><strong>Strengths:</strong> Mature, extensible, self-hosted control, powerful for complex pipelines.</li>
  <li><strong>Limitations:</strong> Higher operational overhead; less polished than GitHub Actions.</li>
</ul>`},
            {n:10, t:"GitHub Actions vs GitLab CI vs Jenkins — comparison?", d:["advanced"], a:`
<table>
  <tr><th>Feature</th><th>GitHub Actions</th><th>GitLab CI</th><th>Jenkins</th></tr>
  <tr><td>Setup</td><td>Easiest (SaaS)</td><td>Easy (SaaS + self-hosted)</td><td>Hardest (self-hosted)</td></tr>
  <tr><td>Scalability</td><td>Shared runners + self-hosted</td><td>GitLab Runner (flexible)</td><td>Distributed agents</td></tr>
  <tr><td>Cost</td><td>Free for public, $ for private</td><td>$ per runner</td><td>Free (infra cost)</td></tr>
  <tr><td>Enterprise features</td><td>Growing</td><td>Strong</td><td>Mature</td></tr>
  <tr><td>Multi-cloud support</td><td>Yes (self-hosted)</td><td>Yes (self-hosted)</td><td>Yes</td></tr>
</table>
<p><strong>Rule:</strong> GitHub Actions if GitHub + simple pipelines. GitLab CI for enterprise. Jenkins if on-prem required.</p>`},
            {n:11, t:"Self-hosted vs managed runners — when to self-host?", d:["advanced"], a:`
<ul>
  <li><strong>Managed (GitHub Actions, GitLab.com runners):</strong> Easy, no ops, but limited customization.</li>
  <li><strong>Self-hosted (GitHub Actions runners, GitLab Runner, Jenkins agents):</strong> Full control, can run Docker, access private networks.</li>
  <li><strong>When to self-host:</strong>
    <ul>
      <li>Access private database/registry (no internet egress).</li>
      <li>Need specific hardware (GPU, large memory).</li>
      <li>High volume jobs (save costs).</li>
      <li>Compliance requires air-gap or on-prem.</li>
    </ul>
  </li>
</ul>`}
          ]
        }
      ]
    },
    {
      label: "PART 3 · TESTING & QUALITY GATES",
      sections: [
        {
          id: "testing-quality", n: 3, title: "Testing Strategies and Quality Assurance in CI",
          desc: "Comprehensive testing for confidence.",
          questions: [
            {n:12, t:"Test pyramid — unit, integration, e2e distribution?", d:["intermediate","advanced"], a:`
<ul>
  <li><strong>Test Pyramid:</strong>
    <ul>
      <li>Bottom (50%): Unit tests — fast, isolated, mock external dependencies.</li>
      <li>Middle (30%): Integration tests — real DB, message queues, other services; slower.</li>
      <li>Top (20%): E2E tests — full app stack, user workflows; slowest.</li>
    </ul>
  </li>
  <li><strong>Why this distribution:</strong>
    <ul>
      <li>Unit tests fast feedback (< 1 sec); run on every commit.</li>
      <li>Integration tests catch data layer bugs; run on PR/merge.</li>
      <li>E2E tests catch real user flows; run pre-prod/prod.</li>
    </ul>
  </li>
  <li><strong>Anti-pattern:</strong> Too many e2e tests (slow CI); too many mocks (miss real bugs).</li>
</ul>`},
            {n:13, t:"Unit tests in Java — JUnit, Mockito, AssertJ?", d:["intermediate","advanced"], a:`
<ul>
  <li><strong>JUnit5 example:</strong>
<pre>
@DisplayName("UserService")
class UserServiceTest {
  private UserService userService;
  private UserRepository userRepository;
  
  @BeforeEach
  void setup() {
    userRepository = Mockito.mock(UserRepository.class);
    userService = new UserService(userRepository);
  }
  
  @Test
  @DisplayName("should get user by ID")
  void testGetUserById() {
    User user = new User(1L, "Alice");
    Mockito.when(userRepository.findById(1L)).thenReturn(Optional.of(user));
    
    User result = userService.getUserById(1L);
    
    Assertions.assertEquals("Alice", result.getName());
    Mockito.verify(userRepository).findById(1L);
  }
  
  @Test
  @DisplayName("should throw when user not found")
  void testUserNotFound() {
    Mockito.when(userRepository.findById(999L)).thenReturn(Optional.empty());
    
    Assertions.assertThrows(UserNotFoundException.class, () -> {
      userService.getUserById(999L);
    });
  }
}
</pre>
  </li>
</ul>`},
            {n:14, t:"Integration tests with testcontainers?", d:["intermediate","advanced"], a:`
<ul>
  <li><strong>Problem:</strong> Manual Docker setup for integration tests; brittle tests.</li>
  <li><strong>Solution:</strong> Testcontainers spins up containers programmatically.</li>
  <li><strong>Example:</strong>
<pre>
@DataJpaTest
@Testcontainers
class UserRepositoryTest {
  @Container
  static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15");
  
  @Test
  void testFindByEmail() {
    DynamicPropertyRegistry.register("spring.datasource.url", postgres::getJdbcUrl);
    DynamicPropertyRegistry.register("spring.datasource.username", postgres::getUsername);
    DynamicPropertyRegistry.register("spring.datasource.password", postgres::getPassword);
    
    User user = new User("alice@example.com", "Alice");
    userRepository.save(user);
    
    User found = userRepository.findByEmail("alice@example.com");
    Assertions.assertNotNull(found);
    Assertions.assertEquals("Alice", found.getName());
  }
}
</pre>
  </li>
  <li><strong>Benefits:</strong> Real database, no mocks, runs in CI easily (Docker required).</li>
</ul>`},
            {n:15, t:"Contract testing and API mocking in CI?", d:["advanced"], a:`
<ul>
  <li><strong>Problem:</strong> Service A depends on Service B's API; Service B not always available in test.</li>
  <li><strong>Solution:</strong> Contract tests verify API contract; mock service for integration tests.</li>
  <li><strong>Tools:</strong> Pact, Spring Cloud Contract.</li>
  <li><strong>Example with WireMock:</strong>
<pre>
@ExtendWith(WireMockExtension.class)
class PaymentServiceTest {
  @Test
  void testProcessPayment(WireMock wireMock) {
    wireMock.stubFor(post(urlEqualTo("/api/payments"))
      .withRequestBody(matchingJsonSchema(someSchema))
      .willReturn(aResponse()
        .withStatus(200)
        .withHeader("Content-Type", "application/json")
        .withBody("{\\"id\\": 123}")));
    
    PaymentResponse response = paymentService.process(new Payment(...));
    Assertions.assertEquals(123L, response.getId());
  }
}
</pre>
  </li>
</ul>`},
            {n:16, t:"Code coverage metrics and thresholds in CI?", d:["intermediate","advanced"], a:`
<ul>
  <li><strong>Coverage tools:</strong> JaCoCo, Cobertura, Clover.</li>
  <li><strong>Metrics:</strong>
    <ul>
      <li>Line coverage: % of lines executed.</li>
      <li>Branch coverage: % of if/else paths taken.</li>
      <li>Method coverage: % of methods called.</li>
    </ul>
  </li>
  <li><strong>Thresholds:</strong> Set minimum (e.g., 80% overall, 70% new code); fail build if below.</li>
  <li><strong>Example in Maven:</strong>
<pre>
<plugin>
  <groupId>org.jacoco</groupId>
  <artifactId>jacoco-maven-plugin</artifactId>
  <executions>
    <execution>
      <goals>
        <goal>check</goal>
      </goals>
      <configuration>
        <rules>
          <rule>
            <element>PACKAGE</element>
            <limit>
              <counter>LINE</counter>
              <value>COVEREDRATIO</value>
              <minimum>0.80</minimum>
            </limit>
          </rule>
        </rules>
      </configuration>
    </execution>
  </executions>
</plugin>
</pre>
  </li>
</ul>`},
            {n:17, t:"Static analysis and SAST — SonarQube, SpotBugs, PMD?", d:["advanced"], a:`
<ul>
  <li><strong>SonarQube:</strong> Central hub; code quality, security vulnerabilities, technical debt.</li>
  <li><strong>SpotBugs:</strong> Detects common Java bugs (null dereference, resource leaks).</li>
  <li><strong>PMD:</strong> Code style violations and potential bugs.</li>
  <li><strong>CI integration:</strong> Fail build if SonarQube quality gate fails (new vulnerabilities, coverage drops).</li>
  <li><strong>Example:</strong>
<pre>
# SonarQube analysis in CI
mvn clean verify sonar:sonar \
  -Dsonar.projectKey=myapp \
  -Dsonar.host.url=https://sonarqube.example.com \
  -Dsonar.login=\${SONAR_TOKEN}

# Fails if quality gate doesn't pass
</pre>
  </li>
</ul>`}
          ]
        }
      ]
    },
    {
      label: "PART 4 · ARTIFACT MANAGEMENT & VERSIONING",
      sections: [
        {
          id: "artifacts-versioning", n: 4, title: "Building, Versioning, and Publishing Artifacts",
          desc: "Creating immutable, reproducible builds.",
          questions: [
            {n:18, t:"Docker image build — best practices for size and security?", d:["intermediate","advanced"], a:`
<ul>
  <li><strong>Base image:</strong> Use minimal base (alpine, distroless) instead of ubuntu/centos.</li>
  <li><strong>Multi-stage build:</strong> Separate compile stage from runtime stage.</li>
  <li><strong>Example:</strong>
<pre>
# Stage 1: Build
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /build
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src src
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /build/target/app.jar .
EXPOSE 8080
CMD ["java", "-Xmx256m", "-jar", "app.jar"]
</pre>
    Result: ~200MB instead of 1GB.
  </li>
  <li><strong>Security:</strong> Scan for CVEs, use distroless (no shell, no package manager), don't run as root.</li>
</ul>`},
            {n:19, t:"Semantic versioning and tag strategy?", d:["intermediate","advanced"], a:`
<ul>
  <li><strong>Semantic Versioning (semver):</strong> MAJOR.MINOR.PATCH (e.g., 1.2.3)</li>
  <li><strong>MAJOR:</strong> Breaking changes.</li>
  <li><strong>MINOR:</strong> New features, backward-compatible.</li>
  <li><strong>PATCH:</strong> Bug fixes.</li>
  <li><strong>Pre-release:</strong> 1.2.3-rc.1, 1.2.3-beta.1 (not for production).</li>
  <li><strong>Image tagging:</strong>
    <ul>
      <li>Commit-based: gcr.io/myapp:sha-a1b2c3 (immutable).</li>
      <li>Release-based: gcr.io/myapp:v1.2.3 (semantic).</li>
      <li>Branch-based: gcr.io/myapp:main-latest (mutable, for dev).</li>
    </ul>
  </li>
  <li><strong>Best practice:</strong> Always push with commit SHA; also tag release versions for easy rollback.</li>
</ul>`},
            {n:20, t:"Container registries — Docker Hub, ECR, GCR, ACR?", d:["intermediate","advanced"], a:`
<table>
  <tr><th>Registry</th><th>Cloud</th><th>Cost</th><th>Features</th></tr>
  <tr><td>Docker Hub</td><td>Public</td><td>Free (public) / $ (private)</td><td>Simple, good for open-source</td></tr>
  <tr><td>ECR</td><td>AWS</td><td>$ (per GB stored/transferred)</td><td>IAM integration, image scanning</td></tr>
  <tr><td>GCR</td><td>GCP</td><td>$ (Cloud Storage)</td><td>Good GCP integration</td></tr>
  <tr><td>ACR</td><td>Azure</td><td>$ (per SKU)</td><td>Managed identity support</td></tr>
</table>
<p><strong>Rule:</strong> Use cloud-native registry (ECR, GCR, ACR) for private images; push only after CI passes.</p>`},
            {n:21, t:"Image scanning and vulnerability management in CI?", d:["advanced"], a:`
<ul>
  <li><strong>Scanning tools:</strong> Trivy, Grype, Anchore, Docker Scout.</li>
  <li><strong>CI integration:</strong> Scan after build; fail if critical/high vulnerabilities found.</li>
  <li><strong>Example:</strong>
<pre>
# GitHub Actions
- uses: aquasecurity/trivy-action@master
  with:
    image-ref: 'myapp:latest'
    format: 'sarif'
    output: 'trivy-results.sarif'
    severity: 'HIGH,CRITICAL'
    exit-code: '1'  # Fail if vulnerabilities found
</pre>
  </li>
  <li><strong>Policy:</strong> No image deploys to prod with critical CVEs; low/medium OK if documented.</li>
</ul>`},
            {n:22, t:"SBOM (Software Bill of Materials) and provenance?", d:["advanced","expert"], a:`
<ul>
  <li><strong>SBOM:</strong> List of all dependencies and versions in artifact (for audit, compliance, CVE tracking).</li>
  <li><strong>Provenance:</strong> Metadata: who built it, when, from what source, what tests passed.</li>
  <li><strong>Tools:</strong> Syft (SBOM generation), SLSA framework (provenance).</li>
  <li><strong>Example:</strong>
<pre>
# Generate SBOM
syft myapp:v1.2.3 -o json > sbom.json

# Attest provenance
cosign attest --predicate sbom.json --key cosign.key myapp:v1.2.3
</pre>
  </li>
  <li><strong>Benefits:</strong> CVE tracking, license compliance, secure supply chain, audit trail.</li>
</ul>`}
          ]
        }
      ]
    },
    {
      label: "PART 5 · DEPLOYMENT STRATEGIES & ORCHESTRATION",
      sections: [
        {
          id: "deploy-strategies", n: 5, title: "Safe Deployment Strategies and Progressive Rollout",
          desc: "Zero-downtime deployments.",
          questions: [
            {n:23, t:"Rolling deployment — how Kubernetes handles progressive rollout?", d:["intermediate","advanced"], a:`
<ul>
  <li><strong>Process:</strong>
    <ol>
      <li>New Pod created with new image.</li>
      <li>Readiness probe passes; Pod added to Service.</li>
      <li>Old Pod removed.</li>
      <li>Repeat until all Pods updated.</li>
    </ol>
  </li>
  <li><strong>Configuration:</strong>
<pre>
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1          # Max 1 extra pod during update
      maxUnavailable: 0    # Keep all available
  minReadySeconds: 10     # Wait 10s after ready before next pod
</pre>
  </li>
  <li><strong>Advantage:</strong> No extra infrastructure, simple.</li>
  <li><strong>Disadvantage:</strong> Mixed versions briefly; if bugs, users see them.</li>
</ul>`},
            {n:24, t:"Blue-Green deployment — instant switchover and rollback?", d:["advanced","expert"], a:`
<ul>
  <li><strong>Setup:</strong> Two identical environments (blue active, green idle); traffic router points to blue.</li>
  <li><strong>Process:</strong>
    <ol>
      <li>Deploy new version to green (no traffic).</li>
      <li>Full test suite on green.</li>
      <li>Health checks pass.</li>
      <li>Smoke tests succeed.</li>
      <li>Switch router to green (instant).</li>
      <li>If issues, switch back to blue (instant rollback).</li>
      <li>Old blue kept 24h for quick rollback.</li>
    </ol>
  </li>
  <li><strong>Advantages:</strong> Instant rollback, zero mixed versions, full test environment.</li>
  <li><strong>Cost:</strong> 2x infrastructure (mitigated if green scales down after deploy).</li>
</ul>`},
            {n:25, t:"Canary deployment — controlled risk with monitoring?", d:["advanced","expert"], a:`
<ul>
  <li><strong>Process:</strong>
    <ol>
      <li>Deploy new version (0% traffic).</li>
      <li>Send 1% traffic to new version; monitor metrics (error rate, latency, business KPIs).</li>
      <li>If healthy, shift 5%, 10%, 25%, 50%.</li>
      <li>Rollback thresholds: error rate > 0.5%, p99 latency > 300ms.</li>
      <li>Automated or manual approval at each step.</li>
    </ol>
  </li>
  <li><strong>Metrics to monitor:</strong>
    <ul>
      <li>Error rate (vs baseline).</li>
      <li>Response latency (p50, p99).</li>
      <li>Resource usage (CPU, memory).</li>
      <li>Business metrics (conversion, revenue, transaction success).</li>
    </ul>
  </li>
  <li><strong>Tools:</strong> Istio/Flagger for automated canary; ArgoCD for progressive delivery.</li>
</ul>`},
            {n:26, t:"Feature flags — enabling/disabling code without redeploy?", d:["advanced","expert"], a:`
<ul>
  <li><strong>Purpose:</strong> Toggle risky features on/off without deployment; kill switch for bugs.</li>
  <li><strong>Types:</strong>
    <ul>
      <li>Release flags: feature on/off during rollout.</li>
      <li>Ops flags: infrastructure decision (cache on/off, batch size).</li>
      <li>Permission flags: canary to percentage of users (10% Google employees, then 100% users).</li>
    </ul>
  </li>
  <li><strong>Example:</strong>
<pre>
public String processPayment(Payment payment) {
  if (featureFlags.isEnabled("new-payment-processor", payment.getUserId())) {
    return newPaymentProcessor.process(payment);  // Canary: 10% of users
  } else {
    return legacyPaymentProcessor.process(payment);  // Stable: 90%
  }
}
</pre>
  </li>
  <li><strong>Tools:</strong> LaunchDarkly, Unleash, custom Redis-based flags.</li>
</ul>`},
            {n:27, t:"Deployment validation — smoke tests and health checks?", d:["intermediate","advanced"], a:`
<ul>
  <li><strong>Smoke tests (immediate, 2-5 sec each):</strong>
    <ul>
      <li>Can app start up (no critical errors)?</li>
      <li>Are critical endpoints responding?</li>
      <li>Can we connect to required databases?</li>
    </ul>
  </li>
  <li><strong>Health checks (continuous):</strong>
    <ul>
      <li>Liveness: should pod be restarted?</li>
      <li>Readiness: can pod take traffic now?</li>
      <li>Startup: app finished initializing?</li>
    </ul>
  </li>
  <li><strong>Example health check:</strong>
<pre>
@GetMapping("/health")
public ResponseEntity<Health> health() {
  return ResponseEntity.ok(Health.up()
    .withDetail("database", checkDB() ? "connected" : "failed")
    .withDetail("cache", checkCache() ? "connected" : "failed")
    .build());
}
</pre>
  </li>
</ul>`}
          ]
        }
      ]
    },
    {
      label: "PART 6 · GITOPS & INFRASTRUCTURE-AS-CODE",
      sections: [
        {
          id: "gitops-iac", n: 6, title: "GitOps, ArgoCD, Terraform, Helm",
          desc: "Declarative infrastructure and deployment.",
          questions: [
            {n:28, t:"GitOps principles — Git as single source of truth?", d:["intermediate","advanced"], a:`
<ul>
  <li><strong>Principle:</strong> Desired state stored in Git; controllers reconcile cluster to Git state.</li>
  <li><strong>Workflow:</strong>
    <ol>
      <li>Engineer commits Kubernetes manifest to Git.</li>
      <li>ArgoCD/Flux detects change.</li>
      <li>Compares Git state to cluster state.</li>
      <li>Applies diff if mismatch (auto-sync).</li>
    </ol>
  </li>
  <li><strong>Benefits:</strong>
    <ul>
      <li>All changes auditable in Git (rollback via git revert).</li>
      <li>No manual <code>kubectl apply</code> (avoid ops errors).</li>
      <li>Self-healing: if pod crashes, controller re-applies manifest.</li>
      <li>Disaster recovery: clone Git repo, re-apply to new cluster.</li>
    </ul>
  </li>
</ul>`},
            {n:29, t:"ArgoCD — declarative GitOps for Kubernetes?", d:["advanced"], a:`
<ul>
  <li><strong>What it does:</strong> Watches Git repo for manifests; syncs Kubernetes cluster to Git state.</li>
  <li><strong>Setup:</strong>
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
      prune: true      # Delete resources not in Git
      selfHeal: true   # Re-sync if cluster drifts
    syncOptions:
    - CreateNamespace=true
</pre>
  </li>
  <li><strong>Workflow:</strong> PR changes manifests → review/merge → ArgoCD auto-syncs (or manual sync).</li>
  <li><strong>Multi-env example:</strong> Separate apps for dev, staging, prod; each points to different branch or overlay.</li>
</ul>`},
            {n:30, t:"Terraform — infrastructure as code for cloud resources?", d:["intermediate","advanced"], a:`
<ul>
  <li><strong>What it does:</strong> Declare infrastructure (VPC, DB, LB) in HCL; Terraform manages lifecycle.</li>
  <li><strong>Example:</strong>
<pre>
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket = "myapp-terraform"
    key    = "prod/terraform.tfstate"
    region = "us-east-1"
  }
}

variable "instance_count" {
  type    = number
  default = 3
}

resource "aws_instance" "app" {
  count           = var.instance_count
  ami             = data.aws_ami.ubuntu.id
  instance_type   = "t3.micro"
  security_groups = [aws_security_group.app.name]
  
  tags = {
    Name = "app-\${count.index + 1}"
  }
}

resource "aws_security_group" "app" {
  name = "app-sg"
  
  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

output "app_ips" {
  value = aws_instance.app[*].public_ip
}
</pre>
  </li>
  <li><strong>Commands:</strong> <code>terraform plan</code> (preview), <code>terraform apply</code> (execute), <code>terraform destroy</code> (teardown).</li>
</ul>`},
            {n:31, t:"Helm — Kubernetes package manager and templating?", d:["intermediate","advanced"], a:`
<ul>
  <li><strong>What it does:</strong> Templates for Kubernetes manifests; packages called Charts.</li>
  <li><strong>Chart structure:</strong>
<pre>
my-app/
  Chart.yaml         # Metadata
  values.yaml        # Default values
  values-prod.yaml   # Production overrides
  templates/
    deployment.yaml
    service.yaml
    configmap.yaml
</pre>
  </li>
  <li><strong>Template example (templates/deployment.yaml):</strong>
<pre>
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Release.Name }}-app
spec:
  replicas: {{ .Values.replicaCount }}
  template:
    spec:
      containers:
      - name: app
        image: {{ .Values.image.repository }}:{{ .Values.image.tag }}
        ports:
        - containerPort: {{ .Values.port }}
        env:
        - name: LOG_LEVEL
          value: {{ .Values.logLevel | quote }}
</pre>
  </li>
  <li><code>helm install myapp ./chart -f values-prod.yaml</code> deploys with overrides.</li>
</ul>`},
            {n:32, t:"Kustomize — alternative to Helm for overlays?", d:["advanced"], a:`
<ul>
  <li><strong>vs Helm:</strong> Simpler (no templating engine), pure YAML, git-friendly.</li>
  <li><strong>Structure:</strong>
<pre>
base/
  kustomization.yaml   # Lists base resources
  deployment.yaml
  service.yaml
overlays/
  dev/
    kustomization.yaml  # Patch base for dev
  prod/
    kustomization.yaml  # Patch base for prod
</pre>
  </li>
  <li><strong>Example (overlays/prod/kustomization.yaml):</strong>
<pre>
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

bases:
- ../../base

replicas:
- name: api
  count: 5

patchesStrategicMerge:
- deployment-patch.yaml

configMapGenerator:
- name: app-config
  behavior: merge
  literals:
  - LOG_LEVEL=INFO
  - ENVIRONMENT=prod
</pre>
  </li>
  <li><strong>When to use:</strong> Simpler apps without complex templating; git-native.</li>
</ul>`}
          ]
        }
      ]
    },
    {
      label: "PART 7 · SECURITY IN CI/CD PIPELINES",
      sections: [
        {
          id: "cicd-security", n: 7, title: "Secrets, Credentials, and Supply Chain Security",
          desc: "Protecting sensitive data in pipelines.",
          questions: [
            {n:33, t:"Secret management in CI/CD — never hardcode?", d:["intermediate","advanced"], a:`
<ul>
  <li><strong>Problem:</strong> DB passwords, API keys, deploy tokens must be available in pipeline; can't commit to Git.</li>
  <li><strong>Solution:</strong> Use secret manager; pipeline fetches at runtime.</li>
  <li><strong>GitHub Actions example:</strong>
<pre>
- name: Deploy
  env:
    DB_PASSWORD: \${{ secrets.DB_PASSWORD }}
    API_KEY: \${{ secrets.API_KEY }}
  run: |
    export DB_PASSWORD
    export API_KEY
    ./deploy.sh
</pre>
    Secrets masked in logs; accessible only to workflows.
  </li>
  <li><strong>Jenkins example:</strong>
<pre>
pipeline {
  environment {
    DB_CREDS = credentials('db-credentials')
  }
  stages {
    stage('Deploy') {
      steps {
        sh '''
          export DB_USER=\${DB_CREDS_USR}
          export DB_PASS=\${DB_CREDS_PSW}
          ./deploy.sh
        '''
      }
    }
  }
}
</pre>
  </li>
  <li><strong>Best practice:</strong> Rotate secrets every 90 days; limit who can read; audit access.</li>
</ul>`},
            {n:34, t:"Short-lived credentials vs long-lived API keys?", d:["advanced"], a:`
<ul>
  <li><strong>Short-lived (recommended):</strong>
    <ul>
      <li>Assume IAM role, get temporary credentials (valid < 1 hour).</li>
      <li>Leak has limited window; no reissue needed if rotated.</li>
      <li>Audit logs show which principal acted.</li>
    </ul>
  </li>
  <li><strong>Long-lived (avoid for CI/CD):</strong>
    <ul>
      <li>Static API key/token; valid months/years.</li>
      <li>If leaked, attacker has long window.</li>
      <li>Must actively rotate and track keys.</li>
    </ul>
  </li>
  <li><strong>In AWS:</strong> Use OIDC provider (GitHub Actions, GitLab CI) to assume role directly; no static key needed.</li>
</ul>`},
            {n:35, t:"SBOM and software supply chain security (SLSA)?", d:["advanced","expert"], a:`
<ul>
  <li><strong>SLSA (Supply Chain Levels for Software Artifacts):</strong> Framework to track artifact provenance.</li>
  <li><strong>Levels:</strong>
    <ul>
      <li>L1: Source control (Git commit).</li>
      <li>L2: Provenance file (who built, when, what tests passed).</li>
      <li>L3: Hardened CI (no injected secrets, signed).</li>
      <li>L4: Hermetic build (bit-for-bit reproducible).</li>
    </ul>
  </li>
  <li><strong>Tools:</strong> in-toto (provenance), cosign (image signing), syft (SBOM).</li>
  <li><strong>Example:</strong>
<pre>
# Generate and sign artifact
cosign sign-blob --key cosign.key artifact.tar.gz > artifact.tar.gz.sig
cosign attach sbom artifact.tar.gz

# Verify on deploy
cosign verify-blob --key cosign.pub artifact.tar.gz --signature artifact.tar.gz.sig
</pre>
  </li>
</ul>`},
            {n:36, t:"Dependency scanning and vulnerability management?", d:["advanced"], a:`
<ul>
  <li><strong>Problem:</strong> Dependencies (Maven, npm, Go) have CVEs; must detect and update.</li>
  <li><strong>Tools:</strong> Snyk, Dependabot, WhiteSource, npm audit.</li>
  <li><strong>CI integration:</strong>
    <ul>
      <li>Scan dependencies on every commit; fail if critical CVE found.</li>
      <li>Auto-create PRs with updates (Dependabot).</li>
      <li>Policy: no critical/high CVEs in prod; low/medium requires exception.</li>
    </ul>
  </li>
  <li><strong>Example:</strong>
<pre>
# GitHub Actions with Dependabot
- uses: snyk/snyk-action@master
  env:
    SNYK_TOKEN: \${{ secrets.SNYK_TOKEN }}
  with:
    args: --severity-threshold=high --fail-on=upgraded
</pre>
  </li>
</ul>`},
            {n:37, t:"Scanning for secrets in source code?", d:["advanced"], a:`
<ul>
  <li><strong>Problem:</strong> Developer accidentally commits API key, password, etc. to Git.</li>
  <li><strong>Prevention:</strong> Pre-commit hooks scan for secrets before commit (local).</li>
  <li><strong>Detection:</strong> CI scans after commit (catch slips).</li>
  <li><strong>Tools:</strong> git-secrets, detect-secrets, TruffleHog (GitHub, GitLab).</li>
  <li><strong>Example:</strong>
<pre>
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.4.0
    hooks:
    - id: detect-secrets
      args: ['--baseline', '.secrets.baseline']

# GitHub Actions
- uses: gitleaks/gitleaks-action@v2
  with:
    fail: true
</pre>
  </li>
</ul>`}
          ]
        }
      ]
    },
    {
      label: "PART 8 · MONITORING PIPELINES & METRICS",
      sections: [
        {
          id: "pipeline-monitoring", n: 8, title: "Pipeline Performance, Observability, and DORA Metrics",
          desc: "Measuring delivery health.",
          questions: [
            {n:38, t:"DORA metrics — measuring software delivery performance?", d:["intermediate","advanced"], a:`
<ul>
  <li><strong>4 Key Metrics (DORA):</strong>
    <ul>
      <li><strong>Deployment Frequency:</strong> How often deployed to prod (multiple times/day = excellent).</li>
      <li><strong>Lead Time for Changes:</strong> Time from commit to production (< 1 hour = excellent).</li>
      <li><strong>Mean Time to Recovery (MTTR):</strong> Time to fix production incident (< 1 hour = excellent).</li>
      <li><strong>Change Failure Rate:</strong> % of changes causing incidents (0-15% = excellent).</li>
    </ul>
  </li>
  <li><strong>Why they matter:</strong> Predict team performance, business value delivery, stability.</li>
  <li><strong>Measurement:</strong> Track in CI/CD tool; publish dashboards; use as guide for improvement.</li>
</ul>`},
            {n:39, t:"Build time and test execution time — optimizing pipeline speed?", d:["intermediate","advanced"], a:`
<ul>
  <li><strong>Goal:</strong> Feedback in < 5-10 minutes (fast enough to not context-switch).</li>
  <li><strong>Optimization strategies:</strong>
    <ul>
      <li><strong>Parallelize:</strong> Run lint, unit tests, security scan in parallel stages.</li>
      <li><strong>Cache dependencies:</strong> Maven ~/.m2, npm node_modules (Docker layers cache too).</li>
      <li><strong>Skip slow tests in CI:</strong> Run unit tests in CI; integration/e2e on merge or nightly.</li>
      <li><strong>Fail fast:</strong> Lint before compile; unit before integration.</li>
      <li><strong>Distribute:</strong> Split test suite across multiple machines; merge results.</li>
    </ul>
  </li>
  <li><strong>Example matrix in GitHub Actions:</strong>
<pre>
strategy:
  matrix:
    javaVersion: [17, 21]
    testType: [unit, integration, e2e]
</pre>
    Runs 6 combinations in parallel.
  </li>
</ul>`},
            {n:40, t:"Flaky tests and test reliability — building trust in CI?", d:["intermediate","advanced"], a:`
<ul>
  <li><strong>Problem:</strong> Tests that fail randomly; teams ignore failures or retry blindly.</li>
  <li><strong>Solutions:</strong>
    <ul>
      <li>Identify flaky tests (run test N times; log passes/failures).</li>
      <li>Quarantine flaky tests (mark as skipped, fix later).</li>
      <li>Root causes: timing issues (race conditions), random test data, external service flakiness.</li>
      <li>Fix: Deterministic tests, proper synchronization, mock unreliable services, retry in test.</li>
    </ul>
  </li>
  <li><strong>Tools:</strong> Gradle Testretry plugin, flaky-tests-detector.</li>
  <li><strong>Policy:</strong> Never skip tests to make pipeline pass; fix or quarantine.</li>
</ul>`},
            {n:41, t:"Pipeline metrics and observability — what to track?", d:["advanced"], a:`
<ul>
  <li><strong>Metrics to track:</strong>
    <ul>
      <li>Build time (each stage and total).</li>
      <li>Test pass rate (% of runs pass vs fail).</li>
      <li>Deployment success rate (% of prod deploys succeed).</li>
      <li>Rollback frequency (how often rolled back after deploy).</li>
      <li>Security gate pass rate (% of vulnerabilities found).</li>
    </ul>
  </li>
  <li><strong>Alerting:</strong> If build time > 15 min or flake rate > 10%, investigate.</li>
  <li><strong>Tools:</strong> Datadog, CloudWatch, Prometheus; most CI tools have built-in metrics.</li>
</ul>`}
          ]
        }
      ]
    },
    {
      label: "PART 9 · INCIDENT RESPONSE & ON-CALL READINESS",
      sections: [
        {
          id: "incident-response", n: 9, title: "On-Call Rotations, Runbooks, Postmortems, Game Days",
          desc: "Operational excellence beyond coding.",
          questions: [
            {n:42, t:"On-call rotation structure — fairness and coverage?", d:["advanced"], a:`
<ul>
  <li><strong>Rotation models:</strong>
    <ul>
      <li>Weekly: same person on-call Mon-Sun; rotates every Sunday.</li>
      <li>Bi-weekly: longer coverage per person; more stable.</li>
      <li>Split (day/night): reduce burnout; cover different time zones.</li>
    </ul>
  </li>
  <li><strong>Primary + secondary:</strong> Primary responds first; secondary backup if primary unresponsive.</li>
  <li><strong>Coverage for timezones:</strong> Multiple regions → on-call in each region (24/7 coverage).</li>
  <li><strong>Fairness:</strong> Track on-call frequency; rotations should be equal over time.</li>
  <li><strong>Tools:</strong> PagerDuty, OpsGenie, VictorOps.</li>
</ul>`},
            {n:43, t:"Alert routing and escalation — severity-based response?", d:["advanced"], a:`
<ul>
  <li><strong>Severity levels:</strong>
    <ul>
      <li>S1 (Critical): Service down, data loss risk; wake on-call immediately, CEO notified.</li>
      <li>S2 (Major): Significant functionality degraded; page on-call in 5 min.</li>
      <li>S3 (Minor): Isolated feature broken; ticket, no pages.</li>
      <li>S4 (Trivial): Cosmetic, docs issue; log and fix in sprint.</li>
    </ul>
  </li>
  <li><strong>Response times:</strong>
    <ul>
      <li>S1: ACK < 5 min, status page update < 15 min, fix < 30 min.</li>
      <li>S2: ACK < 15 min, fix < 2 hour.</li>
      <li>S3: ACK < 1 hour.</li>
    </ul>
  </li>
  <li><strong>Escalation:</strong> If primary doesn't ACK in 5 min, alert secondary. If secondary doesn't ACK in 5 min, alert manager.</li>
</ul>`},
            {n:44, t:"Runbooks and incident response procedures?", d:["advanced"], a:`
<ul>
  <li><strong>Runbook contents:</strong>
    <ul>
      <li>Quick diagnosis: symptoms, immediate checks.</li>
      <li>Common causes and fixes (80% of incidents have known fixes).</li>
      <li>Step-by-step recovery procedures.</li>
      <li>Escalation path (who to contact next).</li>
      <li>Rollback procedure (if recent deploy caused it).</li>
    </ul>
  </li>
  <li><strong>Example: Database Connection Pool Exhausted</strong>
<pre>
Symptoms:
- API returns 503 "too many connections"
- Slow response times
- Pod logs show "HikariPool connection timeout"

Diagnosis:
1. Check active connections: SELECT count(*) FROM pg_stat_activity;
2. Check CPU/memory on DB: see if high load
3. Check recent deploys: did new version deploy in last 30min?

Quick Fixes (70% success):
1. Restart app pods: kubectl rollout restart deployment/api
2. Check app logs for connection leaks: grep "connection" logs | tail -100
3. Kill long-running queries: SELECT pg_terminate_backend(pid) ...

If not fixed in 5 min:
1. Rollback to previous version: argocd app rollback myapp
2. Scale down pods to reduce load: kubectl scale deployment/api --replicas=1
3. Page on-call database engineer
</pre>
  </li>
</ul>`},
            {n:45, t:"Postmortems — learning from failures without blame?", d:["advanced"], a:`
<ul>
  <li><strong>Blameless culture:</strong> Goal is learning, not punishment; no finger-pointing.</li>
  <li><strong>Postmortem structure:</strong>
    <ol>
      <li><strong>Timeline:</strong> When did incident start? When detected? When fixed?</li>
      <li><strong>Impact:</strong> How many users affected? Revenue loss? SLO miss?</li>
      <li><strong>Root cause:</strong> Why did it happen (not "human error"; deeper causes).</li>
      <li><strong>Why it wasn't caught:</strong> Why did monitoring/tests miss this?</li>
      <li><strong>Action items:</strong> What to fix? Who? When?</li>
    </ol>
  </li>
  <li><strong>Template:</strong>
<pre>
Incident: Payment service returned 500 errors for 30 min
Impact: 10K transactions failed, $50K revenue lost, SLO missed (99.9% → 98%)

Timeline:
- 10:00am: New version deployed (canary 10%)
- 10:05am: Error rate spike detected, canary rolled back
- 10:35am: Root cause: new DB query had N+1 problem, timeout under load

Root Cause Analysis:
- Code review didn't catch query, no integration test checked
- Canary detected issue, but took 5 min to trigger alert

Actions:
1. Add integration test for payment batch processing [@alice by Fri]
2. Lower canary error rate threshold (0.1% → 0.05%) [@bob by Wed]
3. Add DB query performance profiling to CI [@charlie by next sprint]
</pre>
  </li>
</ul>`},
            {n:46, t:"Game days — practicing disaster recovery and incident response?", d:["advanced","expert"], a:`
<ul>
  <li><strong>What it is:</strong> Simulated incident; team practices response without affecting real users.</li>
  <li><strong>Example scenario:</strong>
    <ol>
      <li>Inject failure: kill database pod in prod-like environment.</li>
      <li>Team executes runbook: diagnose, failover to replica, update DNS.</li>
      <li>Measure: How long to restore service? Were runbooks accurate? Did comms work?</li>
      <li>Debrief: What went well? What to improve?</li>
    </ol>
  </li>
  <li><strong>Benefits:</strong> Team confidence, identify runbook gaps, practice under pressure.</li>
  <li><strong>Frequency:</strong> Monthly for critical systems; quarterly for others.</li>
</ul>`}
          ]
        }
      ]
    },
    {
      label: "PART 10 · BEST PRACTICES & ANTI-PATTERNS",
      sections: [
        {
          id: "best-practices", n: 10, title: "CI/CD Excellence and Common Pitfalls",
          desc: "What separates good teams from great ones.",
          questions: [
            {n:47, t:"Fast feedback loop — why 10+ min pipeline is too slow?", d:["intermediate","advanced"], a:`
<ul>
  <li><strong>Problem:</strong> Developer commits; waits 15 min for pipeline; context-switched to something else; result comes back → confused.</li>
  <li><strong>Solution:</strong> Keep pipeline < 5-10 min; developers stay engaged.</li>
  <li><strong>Techniques:</strong>
    <ul>
      <li>Parallelize stages (lint, unit, security scans all at once).</li>
      <li>Cache aggressively (Maven, npm, Docker layers).</li>
      <li>Split tests: fast (unit) vs slow (e2e); gating decision on fast tests.</li>
      <li>Use matrix jobs to distribute work.</li>
    </ul>
  </li>
</ul>`},
            {n:48, t:"Promote same artifact across environments — why rebuild is risky?", d:["intermediate","advanced"], a:`
<ul>
  <li><strong>Anti-pattern:</strong> Rebuild from source at each deploy (dev → staging → prod).</li>
  <li><strong>Problem:</strong> Different bits each build; testing cert doesn't apply to prod version.</li>
  <li><strong>Best practice:</strong> Build once; tag with commit SHA; promote same image/jar.</li>
  <li><strong>Workflow:</strong>
    <ul>
      <li>CI: Build myapp:sha-a1b2c3 and myapp:v1.2.3</li>
      <li>Staging deploy: Use myapp:sha-a1b2c3</li>
      <li>Prod deploy: Same image myapp:sha-a1b2c3</li>
    </ul>
  </li>
</ul>`},
            {n:49, t:"Gating decisions on fast tests, not slow tests?", d:["intermediate","advanced"], a:`
<ul>
  <li><strong>Pattern:</strong>
    <ul>
      <li>PR/commit stage: Fast tests only (lint, unit, compile); blocks merge if fail.</li>
      <li>Post-merge stage: Full suite (integration, e2e); no blocker; publish results for visibility.</li>
      <li>Pre-prod stage: Canary smoke tests; rollback if fail.</li>
    </ul>
  </li>
  <li><strong>Why:</strong> Fast feedback for developers. Comprehensive tests detect issues earlier but don't block shipping.</li>
</ul>`},
            {n:50, t:"Never skip tests to make pipeline pass — anti-pattern?", d:["intermediate","advanced"], a:`
<ul>
  <li><strong>Anti-pattern:</strong> Team marks tests as @Ignore or skips them to speed up pipeline.</li>
  <li><strong>Consequence:</strong> Unknown bugs slip to prod; team loses confidence in tests.</li>
  <li><strong>Right approach:</strong>
    <ul>
      <li>If test is flaky: quarantine (skip) and fix root cause; don't leave broken.</li>
      <li>If test is slow: make it faster or move to nightly suite; don't remove.</li>
      <li>If test is wrong: fix or delete; don't leave confusing test.</li>
    </ul>
  </li>
</ul>`},
            {n:51, t:"Rollback is not always safe — when forward fix is better?", d:["advanced","expert"], a:`
<ul>
  <li><strong>Rollback scenario:</strong> New version breaks reporting; revert to old version.</li>
  <li><strong>Problem:</strong> Data created with new version might be incompatible with old version.</li>
  <li><strong>Forward fix (better):</strong> Fix bug in new version; deploy immediately; old data handled gracefully.</li>
  <li><strong>When to rollback:</strong>
    <ul>
      <li>App crashes on startup (can't start at all).</li>
      <li>Fundamental logic broken (all requests fail).</li>
      <li>Security breach (need to stop immediately).</li>
    </ul>
  </li>
  <li><strong>When to forward fix:</strong>
    <ul>
      <li>Limited features broken (feature flag off).</li>
      <li>Data layer issue (migration issue).</li>
      <li>Most bugs (fix better than rollback).</li>
    </ul>
  </li>
</ul>`},
            {n:52, t:"Zero-downtime deployment checklist — what not to forget?", d:["advanced","expert"], a:`
<ul>
  <li><strong>Before deployment:</strong>
    <ul>
      <li>Backward-compatible DB schema (expand schema, support old + new code).</li>
      <li>Feature flags for risky changes (kill switch).</li>
      <li>Run full test suite; load test.</li>
      <li>Prepare rollback plan.</li>
    </ul>
  </li>
  <li><strong>During deployment:</strong>
    <ul>
      <li>Monitor golden signals: error rate, latency, CPU, memory.</li>
      <li>Progressive rollout (canary or blue-green).</li>
      <li>On-call engineer watching metrics; ready to rollback.</li>
      <li>Update status page (users should know if issues).</li>
    </ul>
  </li>
  <li><strong>After deployment:</strong>
    <ul>
      <li>Monitor for 30-60 min (catch subtle bugs).</li>
      <li>Run smoke tests on prod endpoints.</li>
      <li>Clean up old code/schema after confirmation (contract phase).</li>
    </ul>
  </li>
</ul>`}
          ]
        }
      ]
    },
    {
      label: "PART 11 · MAANG INTERVIEW QUESTIONS ON CI/CD",
      sections: [
        {
          id: "maang-cicd", n: 11, title: "Expert-Level Interview Questions on Deployment and DevOps",
          desc: "What MAANG interviews expect.",
          questions: [
            {n:53, t:"Design a CI/CD pipeline for a microservices system with 50+ services?", d:["expert"], a:`
<ul>
  <li><strong>Challenge:</strong> Each service has its own repo, deploy schedule, rollback policy.</li>
  <li><strong>Architecture:</strong>
    <ul>
      <li>Monorepo or multi-repo: Each service has .github/workflows/ci.yml.</li>
      <li>Shared infra: Terraform repo for cloud resources, Helm charts repo for deployments.</li>
      <li>Artifact registry: Central Docker registry (ECR, GCR); all services push there.</li>
      <li>GitOps: ArgoCD watches service repos; auto-deploys on merge to main.</li>
    </ul>
  </li>
  <li><strong>Pipeline per service:</strong>
    <ol>
      <li>Lint, unit test, SAST scan (< 5 min).</li>
      <li>Build Docker image; push to registry with commit SHA.</li>
      <li>Deploy to staging (manual or auto); run e2e tests.</li>
      <li>Tag image as "ready-for-prod".</li>
      <li>Merge auto-triggers ArgoCD; deploys to prod (canary 10% → 100%).</li>
    </ol>
  </li>
  <li><strong>Cross-service testing:</strong> Contract tests (Pact) verify API contracts between services.</li>
  <li><strong>Observability:</strong> DORA metrics per service; dashboard for visibility.</li>
</ul>`},
            {n:54, t:"How to implement progressive deployment (canary) for a service?", d:["expert"], a:`
<ul>
  <li><strong>Requirements:</strong> 99.99% SLA; canary detects bugs before 100% rollout.</li>
  <li><strong>Setup:</strong>
    <ul>
      <li>Traffic split via service mesh (Istio) or load balancer (ALB weighted target groups).</li>
      <li>Monitoring: Compare error rate, latency between stable (90%) and canary (10%) versions.</li>
    </ul>
  </li>
  <li><strong>Canary stages:</strong>
<pre>
Stage 1: Deploy new version (0% traffic)
- Health checks pass
- Smoke tests pass

Stage 2: 1% traffic (1% canary, 99% stable)
- Monitor 5 min: error rate, p99 latency, CPU/memory
- Rollback threshold: error rate > 0.5%, latency spike > 50%

Stage 3: 5% traffic (if stage 2 healthy)
- Monitor 5 min
- Same rollback checks

Stage 4-5: 10%, 25% (if stage 3 healthy)

Final: 100% traffic
- Keep stable version running 24h for quick rollback
</pre>
  </li>
  <li><strong>Automation:</strong> Use Flagger + Prometheus or ArgoCD with Argo Rollouts.</li>
</ul>`},
            {n:55, t:"Database migration strategy for zero-downtime deployments?", d:["expert"], a:`
<ul>
  <li><strong>Problem:</strong> Schema changes incompatible with old code; downtime if not careful.</li>
  <li><strong>Strategy: Expand → Deploy → Contract</strong>
    <ol>
      <li><strong>Expand (Phase 1):</strong> Add new column/table; keep old schema intact; old and new code can run.</li>
      <li><strong>Deploy (Phase 2):</strong> Deploy new app version (uses new schema).</li>
      <li><strong>Contract (Phase 3):</strong> After few days, remove old schema; no rollback risk.</li>
    </ol>
  </li>
  <li><strong>Example: Rename column (status → order_status)</strong>
<pre>
Phase 1 (Expand):
ALTER TABLE orders ADD COLUMN order_status VARCHAR;
UPDATE orders SET order_status = status WHERE status IS NOT NULL;
-- Old code still reads/writes to 'status'
-- New code reads/writes to 'order_status'

Phase 2 (Deploy):
-- Deploy new app version that uses 'order_status'
-- Canary 10% traffic; monitor

Phase 3 (Contract, after 24h):
ALTER TABLE orders DROP COLUMN status;
-- Can rollback to old version if needed (but schema mismatch); rare
</pre>
  </li>
  <li><strong>Tools:</strong> Flyway, Liquibase, gh-ost (GitHub's online schema migration).</li>
</ul>`},
            {n:56, t:"How to handle secrets rotation in CI/CD without re-deploys?", d:["expert"], a:`
<ul>
  <li><strong>Problem:</strong> DB password rotated monthly; redeploy every app to use new password?</li>
  <li><strong>Solution:</strong> Apps read secrets at runtime, not build time.</li>
  <li><strong>Pattern:</strong>
    <ul>
      <li>Store secret in AWS Secrets Manager / Azure Key Vault.</li>
      <li>App fetches secret on startup and periodically (e.g., every 5 min).</li>
      <li>Rotate secret in manager; app picks up new value automatically.</li>
    </ul>
  </li>
  <li><strong>Example in Java:</strong>
<pre>
@Configuration
public class SecretsConfig {
  private SecretsManagerClient secretsClient;
  private String dbPassword;
  
  @Scheduled(fixedDelay = 300000)  // Every 5 min
  public void refreshSecrets() {
    GetSecretValueRequest request = GetSecretValueRequest.builder()
      .secretId("db-password")
      .build();
    GetSecretValueResponse response = secretsClient.getSecretValue(request);
    dbPassword = response.secretString();
  }
  
  @Bean
  public HikariConfig hikariConfig() {
    HikariConfig config = new HikariConfig();
    config.setPassword(dbPassword);  // Uses refreshed password
    return config;
  }
}
</pre>
  </li>
</ul>`},
            {n:57, t:"Incident response: service down, unknown cause — debugging in prod?", d:["expert"], a:`
<ul>
  <li><strong>Steps (under 5-min pressure):</strong>
    <ol>
      <li><strong>Verify impact:</strong> Is it really down? Check status page, user reports, monitoring.</li>
      <li><strong>Check recent changes:</strong> Any deploys in last 30 min? Database migrations? Config changes?</li>
      <li><strong>Check logs:</strong> Error patterns? Exceptions? Slow queries?</li>
      <li><strong>Check metrics:</strong> CPU/memory spikes? Error rate? Latency? Connections?</li>
      <li><strong>Check dependencies:</strong> Database up? Cache up? External API responding?</li>
    </ol>
  </li>
  <li><strong>Quick fixes (80% of incidents have known solution):</strong>
    <ul>
      <li>Recent deploy? Rollback immediately.</li>
      <li>Connection pool exhausted? Restart app pods or increase pool size.</li>
      <li>Database slow? Kill long-running queries or failover to replica.</li>
      <li>Memory leak? Restart pods; schedule deeper investigation.</li>
    </ul>
  </li>
  <li><strong>If can't fix in 5 min:</strong> Page senior engineer / database team; escalate severity.</li>
</ul>`},
            {n:58, t:"Building confidence in deployment process — how do you prevent bugs?", d:["expert"], a:`
<ul>
  <li><strong>Multi-layer defense:</strong>
    <ul>
      <li><strong>Development:</strong> Code review, static analysis, unit tests.</li>
      <li><strong>Build:</strong> Integration tests, SAST scan, dependency vulnerabilities.</li>
      <li><strong>Staging:</strong> E2E tests, load tests, chaos engineering (inject failures).</li>
      <li><strong>Canary:</strong> Real traffic, real data; automated rollback if metrics bad.</li>
      <li><strong>Production:</strong> Monitoring, feature flags (kill switch if needed).</li>
    </ul>
  </li>
  <li><strong>Metrics:</strong>
    <ul>
      <li>Deployment success rate: > 95%.</li>
      <li>Deployment frequency: multiple/day (confidence to deploy often).</li>
      <li>Change failure rate: < 15% (most changes don't cause incidents).</li>
      <li>MTTR: < 1 hour (can recover quickly if incident).</li>
    </ul>
  </li>
  <li><strong>Culture:</strong> Blameless postmortems, psychological safety to deploy, ownership mindset.</li>
</ul>`}
          ]
        }
      ]
    },
    {
      label: "PART 12 · DEVOPS CULTURE & TEAM DYNAMICS",
      sections: [
        {
          id: "devops-culture", n: 12, title: "Building High-Performance DevOps Teams",
          desc: "Beyond tools: culture and practices.",
          questions: [
            {n:59, t:"Shared on-call responsibility vs dedicated ops team?", d:["advanced","expert"], a:`
<ul>
  <li><strong>Shared model (DevOps, you build it you run it):</strong>
    <ul>
      <li>Backend engineers on-call for their services.</li>
      <li>Benefits: Engineers fix issues they caused; faster resolution; ownership mindset.</li>
      <li>Cost: Burnout if 24/7 on-call without rest periods.</li>
      <li>Mitigation: Shorter rotations (weekly), blameless culture, on-call prep (runbooks, tooling).</li>
    </ul>
  </li>
  <li><strong>Dedicated ops team:</strong>
    <ul>
      <li>SRE (Site Reliability Engineering) team owns infrastructure and runbooks.</li>
      <li>Backend engineers write code; SRE handles deployments.</li>
      <li>Benefits: Specialization; ops team experts on infrastructure.</li>
      <li>Drawback: Slower feedback (engineers not on-call); operations overhead.</li>
    </ul>
  </li>
  <li><strong>Hybrid:</strong> Engineers on-call with SRE backup; SRE handles complexity (database failover, multi-region issues).</li>
</ul>`},
            {n:60, t:"Scaling CI/CD for growing team — shared vs dedicated infrastructure?", d:["advanced","expert"], a:`
<ul>
  <li><strong>Early stage (< 20 engineers):</strong>
    <ul>
      <li>Shared GitHub Actions runners (managed service).</li>
      <li>Single Kubernetes cluster for all services.</li>
      <li>Central secrets manager (AWS Secrets Manager).</li>
    </ul>
  </li>
  <li><strong>Growing stage (20-100 engineers):</strong>
    <ul>
      <li>Self-hosted runners for CI/CD (better control, caching, security).</li>
      <li>Multiple Kubernetes clusters (dev, staging, prod for isolation).</li>
      <li>Platform team manages CI/CD infrastructure; product teams consume.</li>
    </ul>
  </li>
  <li><strong>Enterprise (100+ engineers):</strong>
    <ul>
      <li>Multi-region Kubernetes; teams own their namespace/cluster.</li>
      <li>Platform team: CI/CD, observability, disaster recovery; product teams focus on features.</li>
      <li>Self-service: teams can provision infra via Terraform + GitOps.</li>
    </ul>
  </li>
</ul>`}
          ]
        }
      ]
    }
  ]
};
