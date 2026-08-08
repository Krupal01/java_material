window.CT_JAVA_DESIGN = {
  topic: "Java & Design",
  icon: "☕",
  range: "367–396",
  questions: [
    {
      id: 367,
      title: "Thread-safe Singleton (double-checked locking with volatile)",
      tip: "Use volatile + double-checked locking; prefer inner static holder class — simpler and lazily initialized",
      iteration: {
        hint: "Double-checked locking: check null twice, synchronized block in between, volatile field",
        snippet: `private static volatile Singleton inst;\nstatic Singleton get() {\n    if (inst==null) synchronized(Singleton.class) {\n        if (inst==null) inst = new Singleton();\n    }\n    return inst;\n}`,
      },
      recursion: {
        hint: "Bill Pugh holder: JVM loads inner class lazily, giving thread-safe lazy init for free",
        snippet: `class Singleton {\n    private Singleton(){}\n    private static class H { static final Singleton I = new Singleton(); }\n    public static Singleton get() { return H.I; }\n}`,
      },
      stream: {
        hint: "Enum Singleton: serialization-safe and thread-safe with zero boilerplate",
        snippet: `public enum Singleton {\n    INSTANCE;\n    public void doWork() { /* logic */ }\n}`,
      },
    },
    {
      id: 368,
      title: "Producer-consumer (wait/notifyAll then BlockingQueue)",
      tip: "Use BlockingQueue in production; raw wait/notifyAll is educational but error-prone",
      iteration: {
        hint: "Synchronized queue with wait/notifyAll: producer waits when full, consumer waits when empty",
        snippet: `synchronized void produce(int v) throws Exception {\n    while (queue.size()==MAX) wait();\n    queue.add(v);\n    notifyAll();\n}\nsynchronized int consume() throws Exception {\n    while (queue.isEmpty()) wait();\n    int v=queue.poll(); notifyAll(); return v;\n}`,
      },
      recursion: {
        hint: "LinkedBlockingQueue handles synchronization internally; producers and consumers just call put/take",
        snippet: `BlockingQueue<Integer> q = new LinkedBlockingQueue<>(10);\n// Producer\nnew Thread(()-> { try { q.put(item); } catch(Exception e){} }).start();\n// Consumer\nnew Thread(()-> { try { int v=q.take(); } catch(Exception e){} }).start();`,
      },
      stream: {
        hint: "Use ExecutorService with Callable and Future to decouple production and consumption cleanly",
        snippet: `ExecutorService ex = Executors.newFixedThreadPool(2);\nBlockingQueue<Integer> q = new ArrayBlockingQueue<>(10);\nex.submit(()-> q.put(produce()));\nex.submit(()-> consume(q.take()));\nex.shutdown();`,
      },
    },
    {
      id: 369,
      title: "Read-write lock (ReentrantReadWriteLock)",
      tip: "ReadWriteLock allows concurrent reads but exclusive writes; use tryLock with timeout to avoid starvation",
      iteration: {
        hint: "Acquire readLock for reads and writeLock for writes; always unlock in finally block",
        snippet: `ReentrantReadWriteLock rwl = new ReentrantReadWriteLock();\nvoid read() {\n    rwl.readLock().lock();\n    try { /* read data */ }\n    finally { rwl.readLock().unlock(); }\n}\nvoid write(int v) {\n    rwl.writeLock().lock();\n    try { data=v; } finally { rwl.writeLock().unlock(); }\n}`,
      },
      recursion: {
        hint: "StampedLock offers optimistic reading — try without lock, validate stamp, fall back to read lock",
        snippet: `StampedLock sl = new StampedLock();\nint read() {\n    long stamp = sl.tryOptimisticRead();\n    int v = data;\n    if (!sl.validate(stamp)) {\n        stamp=sl.readLock(); try{v=data;}finally{sl.unlock(stamp);}\n    }\n    return v;\n}`,
      },
      stream: {
        hint: "Use ConcurrentHashMap or CopyOnWriteArrayList when reads vastly outnumber writes",
        snippet: `ConcurrentHashMap<String,Integer> map = new ConcurrentHashMap<>();\nmap.put("key", 1);                  // thread-safe write\nmap.computeIfAbsent("k", k->0);    // atomic compute\nint v = map.getOrDefault("key",0); // thread-safe read`,
      },
    },
    {
      id: 370,
      title: "Deadlock detection and resolution via lock ordering",
      tip: "Prevent deadlock by always acquiring locks in a consistent global order; use tryLock for detection",
      iteration: {
        hint: "Order locks by System.identityHashCode so every thread acquires in the same sequence",
        snippet: `void transfer(Account a, Account b, int amt) {\n    Account first = a.id<b.id ? a : b;\n    Account second = a.id<b.id ? b : a;\n    synchronized(first) {\n        synchronized(second) { a.debit(amt); b.credit(amt); }\n    }\n}`,
      },
      recursion: {
        hint: "tryLock with timeout: if second lock times out, release first and retry after a back-off",
        snippet: `boolean transfer(Lock la, Lock lb, int amt) throws Exception {\n    while(true) {\n        if (la.tryLock(50,MILLISECONDS)) {\n            if (lb.tryLock(50,MILLISECONDS)) {\n                try { doTransfer(amt); return true; }\n                finally { lb.unlock(); la.unlock(); }\n            } else la.unlock();\n        }\n    }\n}`,
      },
      stream: {
        hint: "ThreadMXBean can detect deadlocked threads at runtime for monitoring/alerting",
        snippet: `ThreadMXBean tmx = ManagementFactory.getThreadMXBean();\nlong[] ids = tmx.findDeadlockedThreads();\nif (ids!=null) {\n    ThreadInfo[] info = tmx.getThreadInfo(ids);\n    Arrays.stream(info).forEach(i->log.warn("Deadlock: "+i.getThreadName()));\n}`,
      },
    },
    {
      id: 371,
      title: "Rate limiter (token bucket / sliding window)",
      tip: "Token bucket smooths bursts; sliding window log gives precise per-window counts; use Semaphore for simple cases",
      iteration: {
        hint: "Token bucket: refill tokens on each call based on elapsed time, deny if no tokens available",
        snippet: `class TokenBucket {\n    long tokens, last=System.nanoTime();\n    final long cap, rate; // rate = tokens/ns\n    synchronized boolean allow() {\n        long now=System.nanoTime();\n        tokens=Math.min(cap, tokens+(now-last)*rate/1_000_000_000);\n        last=now; return tokens-->0;\n    }\n}`,
      },
      recursion: {
        hint: "Sliding window log: store request timestamps in a deque, evict old entries, count remaining",
        snippet: `class SlidingWindow {\n    Deque<Long> log=new ArrayDeque<>();\n    final int limit; final long window;\n    synchronized boolean allow() {\n        long now=System.currentTimeMillis();\n        while(!log.isEmpty()&&now-log.peek()>window) log.poll();\n        if(log.size()<limit){log.add(now);return true;}\n        return false;\n    }\n}`,
      },
      stream: {
        hint: "Guava RateLimiter or Semaphore.tryAcquire provides production-grade rate limiting in one line",
        snippet: `// Guava\nRateLimiter rl = RateLimiter.create(10.0); // 10 permits/sec\nif (rl.tryAcquire()) process();\n// Semaphore-based\nSemaphore sem = new Semaphore(10);\nif (sem.tryAcquire(100,MILLISECONDS)) { try{process();}finally{sem.release();} }`,
      },
    },
    {
      id: 372,
      title:
        "Custom thread pool (ThreadPoolExecutor with custom RejectedExecutionHandler)",
      tip: "Size core/max pool and queue carefully; custom RejectedExecutionHandler decides what to do when queue is full",
      iteration: {
        hint: "Build ThreadPoolExecutor directly: set coreSize, maxSize, keepAlive, queue, and rejection policy",
        snippet: `ThreadPoolExecutor pool = new ThreadPoolExecutor(\n    4, 8, 60, TimeUnit.SECONDS,\n    new LinkedBlockingQueue<>(100),\n    Executors.defaultThreadFactory(),\n    (r, ex) -> { /* log & retry or throw */ }\n);\npool.submit(task);`,
      },
      recursion: {
        hint: "CallerRunsPolicy slows the producer thread instead of dropping tasks — backpressure by design",
        snippet: `ThreadPoolExecutor pool = new ThreadPoolExecutor(\n    2, 4, 30, SECONDS,\n    new ArrayBlockingQueue<>(50),\n    new ThreadPoolExecutor.CallerRunsPolicy()\n);\n// When queue full, calling thread executes the task itself`,
      },
      stream: {
        hint: "ForkJoinPool suits recursive divide-and-conquer; use commonPool() for parallel streams",
        snippet: `ForkJoinPool custom = new ForkJoinPool(4);\ncustom.submit(()->{\n    LongStream.rangeClosed(1,1_000_000)\n        .parallel()\n        .sum();\n}).get();\ncustom.shutdown();`,
      },
    },
    {
      id: 373,
      title: "Immutable class design (all fields final, defensive copying)",
      tip: "Declare final class, final fields, no setters; defensively copy mutable inputs and outputs",
      iteration: {
        hint: "Copy mutable fields in constructor (in) and in getters (out) to prevent external mutation",
        snippet: `public final class Period {\n    private final Date start, end;\n    public Period(Date s, Date e) {\n        this.start=new Date(s.getTime());\n        this.end=new Date(e.getTime());\n    }\n    public Date start(){return new Date(start.getTime());}\n}`,
      },
      recursion: {
        hint: "Java record automatically provides final fields, canonical constructor, equals, hashCode, and toString",
        snippet: `public record Point(int x, int y) {\n    // compact constructor for validation\n    public Point { if(x<0||y<0) throw new IllegalArgumentException(); }\n}\nPoint p = new Point(3,4);\n// p.x(), p.y() — immutable by default`,
      },
      stream: {
        hint: "Collections.unmodifiableList or List.copyOf wraps mutable collections into immutable views",
        snippet: `public final class Roster {\n    private final List<String> names;\n    public Roster(List<String> ns) { this.names=List.copyOf(ns); }\n    public List<String> names() { return names; } // already unmodifiable\n}`,
      },
    },
    {
      id: 374,
      title: "Parking lot system design",
      tip: "Model ParkingLot → Floor → Spot; use strategy for spot-selection; track availability with a priority queue",
      iteration: {
        hint: "Array of spots per floor; linear scan to find first free spot of matching type",
        snippet: `class ParkingLot {\n    List<Floor> floors;\n    Ticket park(Vehicle v) {\n        for(Floor f:floors)\n            for(Spot s:f.spots)\n                if(s.free&&s.type==v.type){s.free=false;return new Ticket(s);}\n        return null;\n    }\n}`,
      },
      recursion: {
        hint: "Strategy pattern: inject SpotFinder; nearest/cheapest implementations swap without touching ParkingLot",
        snippet: `interface SpotFinder { Spot find(Vehicle v, List<Floor> floors); }\nclass NearestFinder implements SpotFinder {\n    public Spot find(Vehicle v, List<Floor> fs) {\n        return fs.stream().flatMap(f->f.spots.stream())\n            .filter(s->s.free&&s.type==v.type).findFirst().orElse(null);\n    }\n}`,
      },
      stream: {
        hint: "ConcurrentHashMap<SpotId,Vehicle> for O(1) lookup; AtomicInteger per type for fast availability count",
        snippet: `ConcurrentHashMap<String,Vehicle> occupied = new ConcurrentHashMap<>();\nAtomicInteger freeCompact = new AtomicInteger(50);\nboolean park(Vehicle v, String spotId) {\n    if(freeCompact.decrementAndGet()<0){freeCompact.incrementAndGet();return false;}\n    occupied.put(spotId,v); return true;\n}`,
      },
    },
    {
      id: 375,
      title: "URL shortener design",
      tip: "Base62-encode an auto-increment ID for uniqueness; cache hot URLs in Redis; store original in DB",
      iteration: {
        hint: "Encode a long ID to base-62 string; decode by reversing the digit-extraction process",
        snippet: `static final String CHARS="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";\nString encode(long id) {\n    StringBuilder sb=new StringBuilder();\n    while(id>0){sb.append(CHARS.charAt((int)(id%62)));id/=62;}\n    return sb.reverse().toString();\n}`,
      },
      recursion: {
        hint: "MD5/SHA hash the URL, take first 7 chars; handle collision by appending a counter",
        snippet: `String shortCode(String url) throws Exception {\n    byte[] h=MessageDigest.getInstance("MD5").digest(url.getBytes());\n    String code=Base64.getUrlEncoder().encodeToString(h).substring(0,7);\n    return db.containsKey(code) ? shortCode(url+\"_\") : code;\n}`,
      },
      stream: {
        hint: "ConcurrentHashMap as in-memory store; computeIfAbsent atomically generates code on first access",
        snippet: `ConcurrentHashMap<String,String> store=new ConcurrentHashMap<>();\nAtomicLong counter=new AtomicLong();\nString shorten(String url){\n    return store.computeIfAbsent(url,k->encode(counter.incrementAndGet()));\n}`,
      },
    },
    {
      id: 376,
      title: "Cache system design (LRU/LFU from scratch)",
      tip: "LRU: LinkedHashMap with removeEldestEntry; LFU needs freq map + doubly-linked freq buckets for O(1)",
      iteration: {
        hint: "LinkedHashMap with access-order=true and removeEldestEntry evicts LRU automatically",
        snippet: `class LRUCache<K,V> extends LinkedHashMap<K,V> {\n    int cap;\n    LRUCache(int c){super(c,0.75f,true);cap=c;}\n    protected boolean removeEldestEntry(Map.Entry<K,V> e){\n        return size()>cap;\n    }\n}`,
      },
      recursion: {
        hint: "LFU: maintain freq → LinkedHashSet of keys; on access bump key to next freq bucket",
        snippet: `class LFUCache {\n    Map<Integer,Integer> vals=new HashMap<>(), freq=new HashMap<>();\n    Map<Integer,LinkedHashSet<Integer>> fmap=new HashMap<>();\n    int cap, minF;\n    int get(int k){\n        if(!vals.containsKey(k))return -1;\n        int f=freq.merge(k,1,Integer::sum)-1;\n        fmap.computeIfAbsent(f+1,x->new LinkedHashSet<>()).add(k);\n        fmap.get(f).remove(k); if(fmap.get(f).isEmpty())fmap.remove(f);\n        if(minF==f&&fmap.get(f)==null)minF++;\n        return vals.get(k);\n    }\n}`,
      },
      stream: {
        hint: "Caffeine cache (Java library) provides LRU/LFU with async loading and stats in two lines",
        snippet: `Cache<String,String> cache = Caffeine.newBuilder()\n    .maximumSize(1000)\n    .expireAfterWrite(10, TimeUnit.MINUTES)\n    .recordStats()\n    .build();\nString val = cache.get(key, k->loadFromDB(k));`,
      },
    },
    {
      id: 377,
      title: "Message queue simulation (in-memory)",
      tip: "LinkedBlockingQueue per topic; support publish/subscribe with consumer group offset tracking",
      iteration: {
        hint: "Map of topic → LinkedBlockingQueue; producers offer, consumers poll or take",
        snippet: `class MsgQueue {\n    Map<String,BlockingQueue<String>> topics=new ConcurrentHashMap<>();\n    void publish(String topic,String msg){\n        topics.computeIfAbsent(topic,k->new LinkedBlockingQueue<>()).add(msg);\n    }\n    String consume(String topic) throws Exception{\n        return topics.getOrDefault(topic,new LinkedBlockingQueue<>()).take();\n    }\n}`,
      },
      recursion: {
        hint: "Store messages in a list; each consumer group tracks its own offset for independent consumption",
        snippet: `class Topic {\n    List<String> msgs=new CopyOnWriteArrayList<>();\n    Map<String,AtomicInteger> offsets=new ConcurrentHashMap<>();\n    String poll(String group){\n        int idx=offsets.computeIfAbsent(group,g->new AtomicInteger()).getAndIncrement();\n        return idx<msgs.size()?msgs.get(idx):null;\n    }\n}`,
      },
      stream: {
        hint: "Disruptor ring buffer gives lock-free, high-throughput messaging; use for performance-critical queues",
        snippet: `// Concept sketch (Disruptor)\nRingBuffer<Event> rb = disruptor.getRingBuffer();\nlong seq = rb.next();\ntry { rb.get(seq).value = payload; }\nfinally { rb.publish(seq); }`,
      },
    },
    {
      id: 378,
      title: "File system design (in-memory, mkdir/ls/addFile)",
      tip: "Model Dir node with children map and File node; recursive path resolution mirrors real FS",
      iteration: {
        hint: "Split path on '/', walk the tree iteratively, create missing nodes for mkdir",
        snippet: `class Dir {\n    Map<String,Dir> dirs=new HashMap<>();\n    Map<String,String> files=new HashMap<>();\n}\nDir root=new Dir();\nvoid mkdir(String path) {\n    Dir cur=root;\n    for(String p:path.split(\"/\")) if(!p.isEmpty())\n        cur=cur.dirs.computeIfAbsent(p,k->new Dir());\n}`,
      },
      recursion: {
        hint: "Composite pattern: both File and Directory implement FSNode; ls dispatches polymorphically",
        snippet: `interface FSNode { String name(); List<String> ls(); }\nclass Directory implements FSNode {\n    String name; Map<String,FSNode> children=new TreeMap<>();\n    public List<String> ls(){return new ArrayList<>(children.keySet());}\n    void add(FSNode n){children.put(n.name(),n);}\n}`,
      },
      stream: {
        hint: "Java NIO2 Path/Files provides an in-memory FS via Jimfs library for testing",
        snippet: `FileSystem fs = Jimfs.newFileSystem(Configuration.unix());\nPath dir = fs.getPath(\"/tmp/data\");\nFiles.createDirectories(dir);\nFiles.write(dir.resolve(\"a.txt\"), \"hello\".getBytes());\nList<String> ls = Files.list(dir).map(p->p.getFileName().toString()).collect(toList());`,
      },
    },
    {
      id: 379,
      title: "Elevator system design",
      tip: "SCAN/LOOK algorithm minimizes travel; state machine per elevator: IDLE, MOVING_UP, MOVING_DOWN",
      iteration: {
        hint: "Min-heap of pending floors; always serve floors in direction of travel before reversing",
        snippet: `class Elevator {\n    PriorityQueue<Integer> up=new PriorityQueue<>();\n    PriorityQueue<Integer> down=new PriorityQueue<>(Comparator.reverseOrder());\n    int floor=0; boolean goingUp=true;\n    void addRequest(int f){if(f>floor)up.add(f);else down.add(f);}\n    int next(){return goingUp?(!up.isEmpty()?up.poll():down.poll()):(!down.isEmpty()?down.poll():up.poll());}\n}`,
      },
      recursion: {
        hint: "State pattern: each ElevatorState (Idle/MovingUp/MovingDown) handles requests differently",
        snippet: `interface ElevatorState { void handleRequest(Elevator e, int floor); }\nclass MovingUp implements ElevatorState {\n    public void handleRequest(Elevator e, int floor){\n        if(floor>e.currentFloor) e.upQueue.add(floor);\n        else e.downQueue.add(floor);\n    }\n}`,
      },
      stream: {
        hint: "Use PriorityBlockingQueue per direction; a ScheduledExecutorService moves elevator every tick",
        snippet: `PriorityBlockingQueue<Integer> upQ=new PriorityBlockingQueue<>();\nScheduledExecutorService sched=Executors.newSingleThreadScheduledExecutor();\nsched.scheduleAtFixedRate(()->{\n    Integer next=upQ.poll();\n    if(next!=null) moveTo(next);\n},0,1,SECONDS);`,
      },
    },
    {
      id: 380,
      title: "Splitwise (expense-sharing) system design",
      tip: "Build a net-balance map per user; simplify debts with a min-heap/max-heap greedy approach",
      iteration: {
        hint: "For each expense, split amount among participants and update net-balance map",
        snippet: `Map<String,Double> balance=new HashMap<>();\nvoid addExpense(String payer,List<String> members,double amt){\n    double share=amt/members.size();\n    balance.merge(payer,amt,Double::sum);\n    for(String m:members) balance.merge(m,-share,Double::sum);\n}`,
      },
      recursion: {
        hint: "Simplify: two heaps (creditors, debtors); greedily settle largest creditor with largest debtor",
        snippet: `void settle(Map<String,Double> bal){\n    PriorityQueue<double[]> cred=new PriorityQueue<>((a,b)->Double.compare(b[0],a[0]));\n    PriorityQueue<double[]> debt=new PriorityQueue<>((a,b)->Double.compare(a[0],b[0]));\n    bal.forEach((u,v)->{if(v>0)cred.add(new double[]{v});else debt.add(new double[]{v});});\n    // match top creditor with top debtor iteratively\n}`,
      },
      stream: {
        hint: "Collect net balances with streams; group by positive/negative to build settlement list",
        snippet: `Map<Boolean,List<Map.Entry<String,Double>>> split =\n    balance.entrySet().stream()\n        .filter(e->Math.abs(e.getValue())>0.01)\n        .collect(partitioningBy(e->e.getValue()>0));\nList<Map.Entry<String,Double>> creditors=split.get(true);\nList<Map.Entry<String,Double>> debtors=split.get(false);`,
      },
    },
    {
      id: 381,
      title: "Online shopping cart design",
      tip: "Cart holds items + quantities; apply discount strategies at checkout; use Command pattern for undo",
      iteration: {
        hint: "HashMap of product → quantity; compute total by iterating all entries",
        snippet: `class Cart {\n    Map<Product,Integer> items=new LinkedHashMap<>();\n    void add(Product p,int qty){items.merge(p,qty,Integer::sum);}\n    void remove(Product p){items.remove(p);}\n    double total(){return items.entrySet().stream()\n        .mapToDouble(e->e.getKey().price*e.getValue()).sum();}\n}`,
      },
      recursion: {
        hint: "Strategy pattern for discounts: PercentOff, BuyXGetY, FixedOff implement same DiscountStrategy interface",
        snippet: `interface DiscountStrategy { double apply(Cart cart); }\nclass PercentOff implements DiscountStrategy {\n    double pct;\n    public double apply(Cart c){return c.total()*(1-pct/100);}\n}\n// Cart.checkout(DiscountStrategy ds){ return ds.apply(this); }`,
      },
      stream: {
        hint: "Stream reduce with BigDecimal for precision; groupingBy category gives per-section subtotals",
        snippet: `BigDecimal total = cart.items().entrySet().stream()\n    .map(e->e.getKey().price().multiply(BigDecimal.valueOf(e.getValue())))\n    .reduce(BigDecimal.ZERO, BigDecimal::add);\nMap<Category,Double> byCategory = cart.items().entrySet().stream()\n    .collect(groupingBy(e->e.getKey().category(),\n             summingDouble(e->e.getKey().price*e.getValue())));`,
      },
    },
    {
      id: 382,
      title: "Thread-safe bounded blocking queue from scratch",
      tip: "Use ReentrantLock + two Conditions (notFull/notEmpty); circular array avoids linked-list overhead",
      iteration: {
        hint: "Circular array with head/tail pointers; lock on enqueue/dequeue, await conditions when full/empty",
        snippet: `class BoundedQueue<T> {\n    Object[] buf; int head,tail,size,cap;\n    ReentrantLock lock=new ReentrantLock();\n    Condition notFull=lock.newCondition(),notEmpty=lock.newCondition();\n    void put(T v) throws Exception{\n        lock.lock(); try{\n            while(size==cap)notFull.await();\n            buf[tail=(tail+1)%cap]=v; size++; notEmpty.signal();\n        }finally{lock.unlock();}\n    }\n}`,
      },
      recursion: {
        hint: "LinkedBlockingQueue uses two separate locks (putLock/takeLock) for better producer-consumer concurrency",
        snippet: `// LinkedBlockingQueue design pattern:\nReentrantLock putLock=new ReentrantLock();\nReentrantLock takeLock=new ReentrantLock();\nCondition notFull=putLock.newCondition();\nCondition notEmpty=takeLock.newCondition();\n// Producers only contend with each other; consumers only with each other`,
      },
      stream: {
        hint: "ArrayBlockingQueue in java.util.concurrent is a production-ready bounded blocking queue",
        snippet: `BlockingQueue<String> q = new ArrayBlockingQueue<>(100);\nq.put(\"item\");            // blocks if full\nString s = q.take();      // blocks if empty\nq.offer(\"x\",200,MILLISECONDS); // timed offer\nq.poll(200,MILLISECONDS);      // timed poll`,
      },
    },
    {
      id: 383,
      title: "Observer pattern for stock price notification",
      tip: "Subject holds list of observers; push the new value on notify; use weak references to avoid leaks",
      iteration: {
        hint: "StockMarket maintains list of StockObserver; notifyAll iterates and calls each update()",
        snippet: `interface StockObserver { void update(String sym, double price); }\nclass StockMarket {\n    List<StockObserver> obs=new ArrayList<>();\n    void subscribe(StockObserver o){obs.add(o);}\n    void setPrice(String sym,double p){\n        obs.forEach(o->o.update(sym,p));\n    }\n}`,
      },
      recursion: {
        hint: "java.util.Observable (legacy) or PropertyChangeSupport handle observer bookkeeping automatically",
        snippet: `class Stock extends PropertyChangeSupport {\n    double price;\n    Stock(){super(Stock.this);}\n    void setPrice(double p){\n        double old=price; price=p;\n        firePropertyChange(\"price\",old,p);\n    }\n}\nstock.addPropertyChangeListener(evt->System.out.println(evt.getNewValue()));`,
      },
      stream: {
        hint: "RxJava or Java 9 Flow API provide reactive push-based streams with backpressure",
        snippet: `// Java 9 Flow\nSubmissionPublisher<Double> pub=new SubmissionPublisher<>();\npub.subscribe(new Flow.Subscriber<>(){\n    public void onNext(Double p){System.out.println(\"Price: \"+p);}\n    public void onSubscribe(Flow.Subscription s){s.request(Long.MAX_VALUE);}\n    public void onError(Throwable t){} public void onComplete(){}\n});\npub.submit(150.5);`,
      },
    },
    {
      id: 384,
      title: "Builder pattern for complex immutable object",
      tip: "Inner static Builder collects params; build() validates and constructs the immutable outer class",
      iteration: {
        hint: "Builder has same fields as target; each setter returns 'this' for chaining; build() calls private constructor",
        snippet: `class User {\n    final String name,email; final int age;\n    private User(Builder b){name=b.name;email=b.email;age=b.age;}\n    static class Builder{\n        String name,email; int age;\n        Builder name(String n){name=n;return this;}\n        Builder email(String e){email=e;return this;}\n        User build(){return new User(this);}\n    }\n}`,
      },
      recursion: {
        hint: "Generic self-referential builder (CRTP) lets subclass builders chain fluently without casting",
        snippet: `abstract class Base<T extends Base<T>> {\n    String id;\n    @SuppressWarnings(\"unchecked\")\n    T id(String id){this.id=id;return (T)this;}\n}\nclass PersonBuilder extends Base<PersonBuilder>{\n    String name; PersonBuilder name(String n){name=n;return this;}\n}`,
      },
      stream: {
        hint: "Java records with compact constructors serve as immutable value objects with no boilerplate needed",
        snippet: `public record HttpRequest(String url, String method, Map<String,String> headers, String body) {\n    public static Builder builder(){return new Builder();}\n    public record Builder(String url,String method){/*...*/}\n}`,
      },
    },
    {
      id: 385,
      title: "Factory and Abstract Factory patterns for payment gateway",
      tip: "Factory creates one product family member; Abstract Factory creates related families (PayPal, Stripe)",
      iteration: {
        hint: "Static factory method returns correct PaymentProcessor subclass based on provider string",
        snippet: `interface PaymentProcessor { void pay(double amt); }\nclass PaymentFactory {\n    static PaymentProcessor create(String type){\n        return switch(type){\n            case \"PAYPAL\" -> new PayPalProcessor();\n            case \"STRIPE\" -> new StripeProcessor();\n            default -> throw new IllegalArgumentException(type);\n        };\n    }\n}`,
      },
      recursion: {
        hint: "Abstract Factory returns a whole family: both PaymentProcessor and RefundProcessor for a provider",
        snippet: `interface PaymentGatewayFactory {\n    PaymentProcessor createPayment();\n    RefundProcessor createRefund();\n}\nclass StripeFactory implements PaymentGatewayFactory {\n    public PaymentProcessor createPayment(){return new StripePayment();}\n    public RefundProcessor createRefund(){return new StripeRefund();}\n}`,
      },
      stream: {
        hint: "ServiceLoader discovers factory implementations at runtime — factory-as-plugin with zero if/else",
        snippet: `ServiceLoader<PaymentGatewayFactory> loader=ServiceLoader.load(PaymentGatewayFactory.class);\nPaymentGatewayFactory factory=loader.stream()\n    .map(ServiceLoader.Provider::get)\n    .filter(f->f.supports(\"STRIPE\"))\n    .findFirst().orElseThrow();`,
      },
    },
    {
      id: 386,
      title: "Connection pool (fixed size, blocking checkout/checkin)",
      tip: "Pre-create N connections; Semaphore controls access; queue holds idle connections",
      iteration: {
        hint: "Semaphore(N) limits concurrent borrows; LinkedBlockingQueue stores idle connections",
        snippet: `class ConnPool {\n    Semaphore sem; BlockingQueue<Connection> idle;\n    ConnPool(int n){sem=new Semaphore(n);idle=new LinkedBlockingQueue<>();\n        IntStream.range(0,n).forEach(i->idle.add(newConn()));}\n    Connection checkout() throws Exception{\n        sem.acquire(); return idle.take();\n    }\n    void checkin(Connection c){idle.add(c);sem.release();}\n}`,
      },
      recursion: {
        hint: "Use AtomicInteger for active count; park/unpark threads waiting for a free connection",
        snippet: `class ConnPool {\n    int max; AtomicInteger active=new AtomicInteger();\n    Queue<Connection> pool=new ConcurrentLinkedQueue<>();\n    Connection borrow() {\n        Connection c=pool.poll();\n        if(c!=null) return c;\n        if(active.get()<max&&active.incrementAndGet()<=max) return newConn();\n        active.decrementAndGet(); return borrow(); // spin (add LockSupport in prod)\n    }\n}`,
      },
      stream: {
        hint: "HikariCP, c3p0, or Apache DBCP2 are production connection pools; configure via DataSource",
        snippet: `HikariConfig cfg=new HikariConfig();\ncfg.setJdbcUrl(\"jdbc:mysql://host/db\");\ncfg.setMaximumPoolSize(10);\ncfg.setConnectionTimeout(3000);\nHikariDataSource ds=new HikariDataSource(cfg);\ntry(Connection c=ds.getConnection()){/* use c */}`,
      },
    },
    {
      id: 387,
      title: "Distributed ID generator (Snowflake-style)",
      tip: "Combine timestamp + machine ID + sequence into a 64-bit long for globally unique, time-sortable IDs",
      iteration: {
        hint: "Bit-shift timestamp (41 bits), machine ID (10 bits), sequence (12 bits) into one long",
        snippet: `class Snowflake {\n    long epoch=1609459200000L,machineId,seq=0,lastMs=-1;\n    synchronized long next(){\n        long ms=System.currentTimeMillis()-epoch;\n        if(ms==lastMs){if(++seq>4095){while((ms=System.currentTimeMillis()-epoch)==lastMs);seq=0;}}\n        else seq=0;\n        lastMs=ms;\n        return (ms<<22)|(machineId<<12)|seq;\n    }\n}`,
      },
      recursion: {
        hint: "Clock drift: if currentTime < lastTimestamp, wait or throw; never reuse a (timestamp, sequence) pair",
        snippet: `long tilNextMillis(long last){\n    long ms=System.currentTimeMillis();\n    while(ms<=last) ms=System.currentTimeMillis();\n    return ms;\n}\n// In next(): if(ms<lastMs) ms=tilNextMillis(lastMs);`,
      },
      stream: {
        hint: "UUID.randomUUID() is simple but not sortable; ULID (Universally Unique Lexicographically Sortable) is a modern alternative",
        snippet: `// UUID (not time-sortable)\nString id = UUID.randomUUID().toString();\n// ULID (sortable, 128-bit, Crockford base32)\nULID ulid = ULIDFactory.getDefaultFactory().generate();\nString ulidStr = ulid.toString(); // timestamp-prefixed`,
      },
    },
    {
      id: 388,
      title: "Vending machine (state pattern)",
      tip: "State pattern: machine delegates to current state object; transition table replaces giant if/else",
      iteration: {
        hint: "Enum states with transition logic; machine holds currentState and switches on events",
        snippet: `enum State { IDLE, HAS_MONEY, DISPENSING }\nclass VendingMachine {\n    State state=State.IDLE;\n    void insertCoin(){\n        if(state==State.IDLE) state=State.HAS_MONEY;\n    }\n    void selectProduct(){\n        if(state==State.HAS_MONEY){state=State.DISPENSING;dispense();state=State.IDLE;}\n    }\n}`,
      },
      recursion: {
        hint: "Each State class implements the same interface; the machine just calls state.insertCoin(machine)",
        snippet: `interface VMState { void insertCoin(VM m); void select(VM m); void dispense(VM m); }\nclass IdleState implements VMState {\n    public void insertCoin(VM m){m.setState(new HasMoneyState());}\n    public void select(VM m){System.out.println(\"Insert coin first\");}\n    public void dispense(VM m){System.out.println(\"Insert coin first\");}\n}`,
      },
      stream: {
        hint: "Map<State,Map<Event,State>> transition table models FSM declaratively; look up next state in O(1)",
        snippet: `Map<State,Map<Event,State>> fsm=Map.of(\n    IDLE, Map.of(INSERT,HAS_MONEY),\n    HAS_MONEY, Map.of(SELECT,DISPENSING, REFUND,IDLE),\n    DISPENSING, Map.of(DONE,IDLE)\n);\nstate=fsm.getOrDefault(state,Map.of()).getOrDefault(event,state);`,
      },
    },
    {
      id: 389,
      title: "Tic-tac-toe game with clean board abstraction",
      tip: "Separate Board (data), Player, and GameEngine (logic); check win via rows, cols, and two diagonals",
      iteration: {
        hint: "3×3 char array; after each move check row, column, and both diagonals for the mover's symbol",
        snippet: `char[][] board=new char[3][3];\nboolean checkWin(char p){\n    for(int i=0;i<3;i++)\n        if((board[i][0]==p&&board[i][1]==p&&board[i][2]==p)||\n           (board[0][i]==p&&board[1][i]==p&&board[2][i]==p)) return true;\n    return (board[0][0]==p&&board[1][1]==p&&board[2][2]==p)||\n           (board[0][2]==p&&board[1][1]==p&&board[2][0]==p);\n}`,
      },
      recursion: {
        hint: "Minimax algorithm: recursively explore all moves and pick the one with best score for the AI player",
        snippet: `int minimax(char[][] b, boolean maxing){\n    Integer w=winner(b); if(w!=null)return w;\n    if(maxing){\n        int best=-99;\n        for(int[]m:moves(b)){make(b,m,'X');best=Math.max(best,minimax(b,false));undo(b,m);}\n        return best;\n    } else { /* symmetric for min */ return 0; }\n}`,
      },
      stream: {
        hint: "IntStream over 0..8 to flatten the 3x3 board; allMatch/anyMatch for win-condition checking",
        snippet: `boolean rowWin(int row,char p){\n    return IntStream.range(0,3).allMatch(c->board[row][c]==p);\n}\nbooleanfull(){\n    return IntStream.range(0,9).allMatch(i->board[i/3][i%3]!=0);\n}`,
      },
    },
    {
      id: 390,
      title: "Decorator pattern for coffee-order pricing",
      tip: "Wrap a base Beverage with decorators (Milk, Sugar, Syrup); each adds cost/description without subclassing",
      iteration: {
        hint: "Abstract Decorator holds a Beverage reference; cost() delegates to wrapped beverage plus its own cost",
        snippet: `interface Beverage { double cost(); String desc(); }\nclass Milk implements Beverage {\n    Beverage b;\n    Milk(Beverage b){this.b=b;}\n    public double cost(){return b.cost()+0.25;}\n    public String desc(){return b.desc()+\", Milk\";}\n}\n// new Milk(new Syrup(new Espresso())).cost()`,
      },
      recursion: {
        hint: "Functional decorator: apply a list of toppings as a chain of UnaryOperator<Beverage>",
        snippet: `UnaryOperator<Beverage> milk = b -> new AddonBeverage(b,\"Milk\",0.25);\nUnaryOperator<Beverage> sugar= b -> new AddonBeverage(b,\"Sugar\",0.10);\nBeverage order = Stream.of(milk,sugar)\n    .reduce(UnaryOperator.identity(),(a,b)->a.andThen(b))\n    .apply(new Espresso());`,
      },
      stream: {
        hint: "Reduce a list of addons into a final price sum using streams; no class hierarchy needed",
        snippet: `record Addon(String name,double cost){}\nList<Addon> addons=List.of(new Addon(\"Milk\",0.25),new Addon(\"Syrup\",0.50));\ndouble total=addons.stream().mapToDouble(Addon::cost).sum()+basePrice;\nString desc=\"Espresso, \"+addons.stream().map(Addon::name).collect(joining(\", \"));`,
      },
    },
    {
      id: 391,
      title: "In-memory pub/sub event bus",
      tip: "Map topic → list of subscribers; publish dispatches asynchronously via ExecutorService to avoid blocking publishers",
      iteration: {
        hint: "ConcurrentHashMap of topic → List of Consumer handlers; publish iterates and calls each",
        snippet: `class EventBus {\n    Map<String,List<Consumer<Object>>> subs=new ConcurrentHashMap<>();\n    void subscribe(String topic,Consumer<Object> h){\n        subs.computeIfAbsent(topic,k->new CopyOnWriteArrayList<>()).add(h);\n    }\n    void publish(String topic,Object event){\n        subs.getOrDefault(topic,List.of()).forEach(h->h.accept(event));\n    }\n}`,
      },
      recursion: {
        hint: "Guava EventBus uses @Subscribe annotations; handles hierarchy dispatch and dead-event detection",
        snippet: `EventBus bus = new EventBus();\nbus.register(new Object(){\n    @Subscribe public void handle(OrderEvent e){process(e);}\n});\nbus.post(new OrderEvent(orderId));`,
      },
      stream: {
        hint: "Async dispatch with ExecutorService prevents slow subscribers from blocking the publisher",
        snippet: `ExecutorService exec=Executors.newCachedThreadPool();\nvoid publish(String topic,Object event){\n    subs.getOrDefault(topic,List.of())\n        .forEach(h->exec.submit(()->h.accept(event)));\n}\n// Or Guava: new AsyncEventBus(exec)`,
      },
    },
    {
      id: 392,
      title: "Debounce/throttle utility for rate-limiting method calls",
      tip: "Debounce delays execution until quiet period; throttle guarantees minimum gap between executions",
      iteration: {
        hint: "Debounce: cancel pending ScheduledFuture and reschedule on each call",
        snippet: `class Debouncer {\n    ScheduledExecutorService ex=Executors.newSingleThreadScheduledExecutor();\n    ScheduledFuture<?> fut;\n    void debounce(Runnable r, long ms){\n        if(fut!=null) fut.cancel(false);\n        fut=ex.schedule(r,ms,MILLISECONDS);\n    }\n}`,
      },
      recursion: {
        hint: "Throttle: record lastCallTime; skip if called again before the window has elapsed",
        snippet: `class Throttle {\n    AtomicLong last=new AtomicLong();\n    long intervalMs;\n    boolean allow(){\n        long now=System.currentTimeMillis();\n        return last.updateAndGet(l->now-l>=intervalMs?now:l)==now;\n    }\n}`,
      },
      stream: {
        hint: "ScheduledExecutorService.scheduleAtFixedRate provides built-in throttling for periodic work",
        snippet: `ScheduledExecutorService s=Executors.newSingleThreadScheduledExecutor();\ns.scheduleAtFixedRate(\n    ()->processBatch(),    // throttled action\n    0, 500, MILLISECONDS  // at most twice per second\n);`,
      },
    },
    {
      id: 393,
      title: "Job scheduler (one-time and recurring, in-memory)",
      tip: "PriorityQueue of jobs by next-run time; ScheduledExecutorService handles recurring jobs natively",
      iteration: {
        hint: "Min-heap by nextRunTime; background thread polls, runs due jobs, re-queues recurring ones",
        snippet: `PriorityQueue<Job> q=new PriorityQueue<>(Comparator.comparingLong(j->j.nextRun));\nvoid schedule(Job j){q.add(j);}\nvoid tick(){\n    while(!q.isEmpty()&&q.peek().nextRun<=System.currentTimeMillis()){\n        Job j=q.poll(); j.run();\n        if(j.recurring){j.nextRun+=j.interval;q.add(j);}\n    }\n}`,
      },
      recursion: {
        hint: "ScheduledExecutorService.schedule vs scheduleAtFixedRate vs scheduleWithFixedDelay for different recurring semantics",
        snippet: `ScheduledExecutorService s=Executors.newScheduledThreadPool(4);\n// One-time\ns.schedule(task, 5, SECONDS);\n// Fixed rate (period from start)\ns.scheduleAtFixedRate(task, 0, 10, SECONDS);\n// Fixed delay (period from completion)\ns.scheduleWithFixedDelay(task, 0, 10, SECONDS);`,
      },
      stream: {
        hint: "Quartz Scheduler or Spring @Scheduled handle cron expressions, persistence, and clustering",
        snippet: `// Spring @Scheduled\n@Scheduled(cron=\"0 */5 * * * *\")  // every 5 min\npublic void report(){ /* run report */ }\n\n@Scheduled(fixedRate=60_000)       // every 60s\npublic void heartbeat(){ /* ping */ }`,
      },
    },
    {
      id: 394,
      title: "Strategy pattern to select sorting algorithm at runtime",
      tip: "Inject a Sorter strategy; swap BubbleSort/MergeSort/TimSort without changing the client code",
      iteration: {
        hint: "Strategy interface with sort(int[]); client holds a reference and delegates sorting",
        snippet: `interface Sorter { void sort(int[] arr); }\nclass BubbleSorter implements Sorter {\n    public void sort(int[] a){\n        for(int i=0;i<a.length;i++)\n            for(int j=0;j<a.length-i-1;j++)\n                if(a[j]>a[j+1]){int t=a[j];a[j]=a[j+1];a[j+1]=t;}\n    }\n}`,
      },
      recursion: {
        hint: "Pass Comparator as the strategy; Arrays.sort/Collections.sort accept any Comparator at runtime",
        snippet: `List<String> names=new ArrayList<>(List.of(\"Bob\",\"Alice\",\"Charlie\"));\nComparator<String> byLength=Comparator.comparingInt(String::length);\nComparator<String> byAlpha=Comparator.naturalOrder();\nnames.sort(byLength);        // strategy 1\nnames.sort(byAlpha);         // strategy 2`,
      },
      stream: {
        hint: "Store named sort strategies in a Map; select by key at runtime — open/closed without if/else",
        snippet: `Map<String,Sorter> strategies=Map.of(\n    \"bubble\",new BubbleSorter(),\n    \"merge\", new MergeSorter(),\n    \"quick\", new QuickSorter()\n);\nString choice=config.get(\"sort.algorithm\");\nstrategies.getOrDefault(choice,new MergeSorter()).sort(data);`,
      },
    },
    {
      id: 395,
      title: "Notification system (Email/SMS/Push via Chain of Responsibility)",
      tip: "Each handler in the chain decides to handle and/or pass along; user preference determines which fire",
      iteration: {
        hint: "Linked list of NotificationHandler; each checks user preference, sends if match, calls next",
        snippet: `abstract class NotifHandler {\n    NotifHandler next;\n    NotifHandler setNext(NotifHandler n){next=n;return n;}\n    abstract void handle(Notification n);\n    void passOn(Notification n){if(next!=null)next.handle(n);}\n}\nclass EmailHandler extends NotifHandler {\n    public void handle(Notification n){if(n.hasEmail())sendEmail(n);passOn(n);}\n}`,
      },
      recursion: {
        hint: "Chain built fluently: email.setNext(sms).setNext(push); call head.handle(notification)",
        snippet: `NotifHandler chain=new EmailHandler();\nchain.setNext(new SmsHandler()).setNext(new PushHandler());\nchain.handle(new Notification(user,\"Order shipped\"));\n// Each handler independently decides to send and/or forward`,
      },
      stream: {
        hint: "List of channels filtered by user preference; send in parallel via CompletableFuture",
        snippet: `List<NotifChannel> channels=List.of(new EmailChannel(),new SmsChannel(),new PushChannel());\nList<CompletableFuture<Void>> futures=channels.stream()\n    .filter(c->user.prefers(c.type()))\n    .map(c->CompletableFuture.runAsync(()->c.send(notification)))\n    .collect(toList());\nCompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();`,
      },
    },
    {
      id: 396,
      title: "In-memory key-value store with TTL-based expiry",
      tip: "Store value + expiry timestamp; lazy expiry on get; background sweeper for proactive cleanup",
      iteration: {
        hint: "HashMap stores Entry(value, expiryMs); get checks System.currentTimeMillis() and returns null if expired",
        snippet: `class KVStore {\n    record Entry(Object val,long exp){}\n    Map<String,Entry> map=new HashMap<>();\n    void put(String k,Object v,long ttlMs){\n        map.put(k,new Entry(v,System.currentTimeMillis()+ttlMs));\n    }\n    Object get(String k){\n        Entry e=map.get(k);\n        if(e==null||System.currentTimeMillis()>e.exp()){map.remove(k);return null;}\n        return e.val();\n    }\n}`,
      },
      recursion: {
        hint: "ScheduledExecutorService periodically scans and evicts all expired keys proactively",
        snippet: `ScheduledExecutorService sweeper=Executors.newSingleThreadScheduledExecutor();\nsweeper.scheduleAtFixedRate(()->{\n    long now=System.currentTimeMillis();\n    map.entrySet().removeIf(e->now>e.getValue().exp());\n},1,1,SECONDS);`,
      },
      stream: {
        hint: "ConcurrentHashMap + DelayQueue: expired keys self-remove when their delay expires",
        snippet: `ConcurrentHashMap<String,Object> store=new ConcurrentHashMap<>();\nDelayQueue<DelayedKey> expiry=new DelayQueue<>();\nvoid put(String k,Object v,long ttlMs){\n    store.put(k,v);\n    expiry.add(new DelayedKey(k,System.currentTimeMillis()+ttlMs));\n}\n// Sweeper thread: while(true){DelayedKey dk=expiry.take();store.remove(dk.key);}`,
      },
    },
  ],
};
