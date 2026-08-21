export interface RevisionNote {
  title: string;
  badge: string;
  items: { label: string; detail: string }[];
}

export const quickRevisionNotes: RevisionNote[] = [
  {
    title: "OSI Model (Top → Bottom)",
    badge: "Networks",
    items: [
      { label: "Application (Layer 7)", detail: "HTTP, HTTPS, DNS, FTP, SMTP, SSH, WebSockets" },
      { label: "Presentation (Layer 6)", detail: "Data formats, compression, encryption (TLS/SSL, JSON)" },
      { label: "Session (Layer 5)", detail: "Session establishment, token management, RPC" },
      { label: "Transport (Layer 4)", detail: "TCP (reliable, segments), UDP (fast, datagrams), Ports" },
      { label: "Network (Layer 3)", detail: "IP routing, Packets, Subnets, Routers, ICMP" },
      { label: "Data Link (Layer 2)", detail: "MAC addressing, Frames, Switches, Ethernet, ARP" },
      { label: "Physical (Layer 1)", detail: "Raw bits, cables, optical fiber, radio frequencies (Wi-Fi), Hubs" }
    ]
  },
  {
    title: "ACID Database Properties",
    badge: "DBMS",
    items: [
      { label: "Atomicity", detail: "All-or-nothing execution; transaction fully commits or completely rolls back." },
      { label: "Consistency", detail: "Database transitions only between valid states satisfying all constraints." },
      { label: "Isolation", detail: "Concurrent transactions don't interfere (Read Committed, Serializable)." },
      { label: "Durability", detail: "Committed changes permanently survive hardware crashes via WAL." }
    ]
  },
  {
    title: "SOLID Object-Oriented Principles",
    badge: "OOP",
    items: [
      { label: "S - Single Responsibility", detail: "A class should have only one reason to change (one focused job)." },
      { label: "O - Open/Closed", detail: "Open for extension, closed for modification (use polymorphism/interfaces)." },
      { label: "L - Liskov Substitution", detail: "Subclasses must be substitutable for base classes without breaking behavior." },
      { label: "I - Interface Segregation", detail: "Many small, client-specific interfaces over one large bloated one." },
      { label: "D - Dependency Inversion", detail: "Depend on abstractions (interfaces), not concrete implementations." }
    ]
  },
  {
    title: "Coffman Deadlock Conditions",
    badge: "Operating Systems",
    items: [
      { label: "1. Mutual Exclusion", detail: "Resources are non-shareable (only one process can use at a time)." },
      { label: "2. Hold and Wait", detail: "A process holds a resource while actively requesting another." },
      { label: "3. No Preemption", detail: "Resources cannot be forcibly confiscated from a running process." },
      { label: "4. Circular Wait", detail: "A circular chain of processes where each waits for a resource held by next." }
    ]
  },
  {
    title: "CAP Theorem (Distributed Systems)",
    badge: "Distributed / NoSQL",
    items: [
      { label: "Consistency (C)", detail: "Every read receives the most recent write or an error." },
      { label: "Availability (A)", detail: "Every non-failing node returns a response (without guarantee it's latest)." },
      { label: "Partition Tolerance (P)", detail: "System continues operating despite network message loss/delays." },
      { label: "Key Rule", detail: "Since network partitions (P) are unavoidable, choose CP (MongoDB) or AP (Cassandra)." }
    ]
  },
  {
    title: "Database Normal Forms",
    badge: "DBMS",
    items: [
      { label: "1NF (Atomic Values)", detail: "No repeating groups, every cell holds a single indivisible atomic value." },
      { label: "2NF (No Partial Dependency)", detail: "In 1NF + non-key attributes depend on entire primary key (composite key)." },
      { label: "3NF (No Transitive Dependency)", detail: "In 2NF + non-key attributes depend only on the primary key, not other non-keys." },
      { label: "BCNF", detail: "Stricter 3NF: for every functional dependency X → Y, X must be a Super Key." }
    ]
  },
  {
    title: "Essential Default Network Ports",
    badge: "Networks",
    items: [
      { label: "HTTP / HTTPS", detail: "Port 80 (HTTP) / Port 443 (HTTPS)" },
      { label: "SSH / Telnet", detail: "Port 22 (SSH) / Port 23 (Telnet)" },
      { label: "DNS / DHCP", detail: "Port 53 (DNS) / Port 67 & 68 (DHCP)" },
      { label: "Databases", detail: "MySQL: 3306 | PostgreSQL: 5432 | MongoDB: 27017 | Redis: 6379" }
    ]
  }
];

export const commonInterviewMistakes = [
  {
    mistake: "Reciting a memorized definition with no real-world example",
    fix: "Always follow the golden 3-part structure: Clear definition → Concrete real-world example → Architectural tradeoff.",
  },
  {
    mistake: "Confusing Method Overloading with Method Overriding under pressure",
    fix: "Say the word 'class' out loud: Overloading = SAME class; Overriding = PARENT & CHILD classes.",
  },
  {
    mistake: "Claiming 'WHERE and HAVING are the same thing'",
    fix: "Clarify: WHERE filters individual rows before grouping; HAVING filters aggregated groups after GROUP BY.",
  },
  {
    mistake: "Using 'process' and 'thread' interchangeably",
    fix: "State memory boundaries: Processes have isolated virtual address spaces; Threads share heap & memory within one process.",
  },
  {
    mistake: "Treating 'Composition over Inheritance' as an absolute rule instead of a guideline",
    fix: "Highlight when inheritance is still correct: when there is a genuine, permanent, unchanging 'is-a' hierarchy (e.g. Circle is-a Shape).",
  },
  {
    mistake: "Going silent when unsure about a scenario prompt",
    fix: "Narrate your thought process out loud: State your assumptions, mention adjacent concepts you know, and walk through diagnostic steps.",
  }
];

export const companyHiringComparison = {
  productBased: {
    title: "Product-Based Companies",
    examples: "Google, Amazon, Microsoft, Adobe, Uber, Atlassian, Meta",
    focus: "Deep understanding, architectural trade-offs, system design & code optimization.",
    keyTopics: [
      "CAP theorem & Distributed Systems tradeoffs",
      "Transaction Isolation levels & Read anomalies",
      "SOLID principles with real refactoring scenarios",
      "CPU Scheduling algorithm tracing & Thread synchronization",
      "Design a Class hierarchy & Object design patterns",
      "AI/LLM integration & Real-time Full Stack latency handling"
    ]
  },
  serviceBased: {
    title: "Service-Based Companies",
    examples: "TCS, Infosys, Wipro, Cognizant, Capgemini, Accenture",
    focus: "Breadth, fundamental definitions, rapid-fire terminology, and practical syntax.",
    keyTopics: [
      "OSI vs TCP/IP layer functions & protocols",
      "SQL joins, Primary/Foreign keys, and DDL vs DML commands",
      "Process vs Thread & Linux basic terminal commands",
      "Four pillars of OOP (Encapsulation, Abstraction, Inheritance, Polymorphism)",
      "Standard status codes (200, 301, 404, 500) and port numbers",
      "REST API basics and CRUD database handling"
    ]
  }
};
