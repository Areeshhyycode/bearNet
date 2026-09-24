/**
 * Static mock data only — no backend, no persistence.
 * Everything here exists so the UI has realistic content to render.
 */

export type BearId = "grizzly" | "panda" | "polar";

export type NoteTopic = {
  id: string;
  title: string;
  emoji: string;
  noteCount: number;
};

export type Note = {
  id: string;
  title: string;
  topicId: string;
  topic: string;
  emoji: string;
  preview: string;
  body: string[];
  updatedAt: string;
  visibility: "private" | "public";
  tags: string[];
  readMinutes: number;
};

export const NOTE_TOPICS: NoteTopic[] = [
  { id: "basics", title: "Networking Basics", emoji: "📘", noteCount: 5 },
  { id: "ip-address", title: "IP Address", emoji: "📘", noteCount: 4 },
  { id: "mac-address", title: "MAC Address", emoji: "📘", noteCount: 2 },
  { id: "osi-model", title: "OSI Model", emoji: "📘", noteCount: 6 },
  { id: "tcp-ip", title: "TCP/IP", emoji: "📘", noteCount: 3 },
  { id: "dns", title: "DNS", emoji: "📘", noteCount: 2 },
  { id: "dhcp", title: "DHCP", emoji: "📘", noteCount: 1 },
  { id: "ports", title: "Ports", emoji: "📘", noteCount: 3 },
  { id: "subnetting", title: "Subnetting", emoji: "📘", noteCount: 4 },
];

export const NOTES: Note[] = [
  {
    id: "tcp-3-way-handshake",
    title: "TCP 3-Way Handshake vs UDP",
    topicId: "tcp-ip",
    topic: "TCP/IP",
    emoji: "🤝",
    preview:
      "SYN → SYN-ACK → ACK. TCP builds a reliable, ordered session before sending data; UDP just fires packets and hopes for the best.",
    body: [
      "TCP opens every connection with a three-step greeting. The client sends SYN with its initial sequence number, the server replies SYN-ACK with its own sequence number plus an acknowledgement, and the client closes the loop with ACK.",
      "Because both sides agree on sequence numbers up front, TCP can retransmit anything lost, reorder anything that arrives out of sequence, and throttle itself when the path gets congested.",
      "UDP skips all of it. No handshake, no acknowledgements, no retransmission — which is exactly why DNS lookups, VoIP and game traffic prefer it. Losing one packet beats waiting for one packet.",
      "Remember for the exam: TCP is connection-oriented and reliable, UDP is connectionless and best-effort.",
    ],
    updatedAt: "2026-09-24T09:10:00.000Z",
    visibility: "private",
    tags: ["Layer 4", "Transport", "Net+"],
    readMinutes: 4,
  },
  {
    id: "osi-layer-colors",
    title: "OSI Model — My Colour Code System",
    topicId: "osi-model",
    topic: "OSI Model",
    emoji: "🌈",
    preview:
      "All People Seem To Need Data Processing. I gave each layer a pastel colour so packet captures stop blurring together.",
    body: [
      "Layer 7 Application, 6 Presentation, 5 Session, 4 Transport, 3 Network, 2 Data Link, 1 Physical.",
      "My colour code: Application = blush, Presentation = lavender, Session = cream, Transport = rose, Network = berry, Data Link = mocha, Physical = soft grey.",
      "The trick that finally made it stick: ask what the header on the packet looks like at each layer. Layer 3 carries IP addresses, layer 2 carries MAC addresses, layer 4 carries port numbers.",
    ],
    updatedAt: "2026-09-23T17:45:00.000Z",
    visibility: "public",
    tags: ["OSI", "Fundamentals"],
    readMinutes: 6,
  },
  {
    id: "subnetting-cheatsheet",
    title: "Subnetting Cheat Sheet (/24 to /30)",
    topicId: "subnetting",
    topic: "Subnetting",
    emoji: "🧮",
    preview:
      "Magic number method: 256 − mask octet = block size. Everything else is just counting in blocks.",
    body: [
      "/24 = 256 addresses, 254 usable. /25 = 128. /26 = 64. /27 = 32. /28 = 16. /29 = 8. /30 = 4 (2 usable, perfect for point-to-point links).",
      "Magic number: subtract the interesting octet of the mask from 256. For /26 the mask is 255.255.255.192, so 256 − 192 = 64. Networks land on 0, 64, 128, 192.",
      "Always subtract two from the block size for the network and broadcast address — unless you are on a modern /31 point-to-point link.",
    ],
    updatedAt: "2026-09-22T11:20:00.000Z",
    visibility: "private",
    tags: ["Subnetting", "CIDR", "Maths"],
    readMinutes: 7,
  },
  {
    id: "mac-vs-ip",
    title: "MAC vs IP — Physical vs Logical",
    topicId: "mac-address",
    topic: "MAC Address",
    emoji: "🏷️",
    preview:
      "MAC is burned into the NIC and never leaves the local segment. IP is logical, routable, and changes with the network you join.",
    body: [
      "A MAC address is 48 bits, written as six hex pairs. The first three pairs are the OUI — the vendor. It identifies a device on a single broadcast domain.",
      "An IP address is logical. It describes where you are on the network, not who you are, which is why it changes when you move between Wi-Fi networks.",
      "ARP is the bridge between them: who has 192.168.1.1, tell me your MAC.",
    ],
    updatedAt: "2026-09-21T08:05:00.000Z",
    visibility: "public",
    tags: ["Layer 2", "ARP"],
    readMinutes: 3,
  },
  {
    id: "common-ports",
    title: "Ports I Must Know Cold",
    topicId: "ports",
    topic: "Ports",
    emoji: "🚪",
    preview:
      "20/21 FTP, 22 SSH, 23 Telnet, 25 SMTP, 53 DNS, 67/68 DHCP, 80 HTTP, 443 HTTPS, 3389 RDP.",
    body: [
      "Well-known ports run 0–1023, registered 1024–49151, dynamic/ephemeral 49152–65535.",
      "The ones that show up constantly on practice exams: 22 SSH, 53 DNS (UDP for lookups, TCP for zone transfers), 80 HTTP, 443 HTTPS, 3389 RDP, 161/162 SNMP.",
      "Telnet (23) and FTP (21) send credentials in plaintext. Their secure replacements are SSH (22) and SFTP (22) / FTPS (990).",
    ],
    updatedAt: "2026-09-20T19:30:00.000Z",
    visibility: "private",
    tags: ["Ports", "Memorise"],
    readMinutes: 4,
  },
  {
    id: "dns-resolution",
    title: "How a DNS Lookup Actually Resolves",
    topicId: "dns",
    topic: "DNS",
    emoji: "🌐",
    preview:
      "Recursive resolver → root → TLD → authoritative. Then everyone caches it until the TTL runs out.",
    body: [
      "Your stub resolver asks the recursive resolver. If it has no cached answer, it walks down from the root servers to the TLD servers to the authoritative name server for the zone.",
      "Record types worth knowing: A (IPv4), AAAA (IPv6), CNAME (alias), MX (mail), TXT (verification / SPF), NS (delegation), PTR (reverse lookup).",
      "When a site works on mobile but not on Wi-Fi, suspect DNS or the local resolver cache before you suspect the site.",
    ],
    updatedAt: "2026-09-19T14:00:00.000Z",
    visibility: "public",
    tags: ["DNS", "Layer 7"],
    readMinutes: 5,
  },
  {
    id: "dhcp-dora",
    title: "DHCP DORA Process",
    topicId: "dhcp",
    topic: "DHCP",
    emoji: "📮",
    preview:
      "Discover, Offer, Request, Acknowledge — four broadcasts that hand a client its whole network identity.",
    body: [
      "Discover: the client broadcasts, having no address yet. Offer: the server proposes a lease. Request: the client formally asks for that offer. Acknowledge: the server confirms.",
      "The lease carries more than an address — it also delivers the subnet mask, default gateway and DNS servers.",
      "A 169.254.x.x address means APIPA kicked in: the client never heard from a DHCP server.",
    ],
    updatedAt: "2026-09-18T10:15:00.000Z",
    visibility: "private",
    tags: ["DHCP", "Layer 3"],
    readMinutes: 3,
  },
  {
    id: "ipv4-classes",
    title: "IPv4 Address Classes & Private Ranges",
    topicId: "ip-address",
    topic: "IP Address",
    emoji: "🔢",
    preview:
      "10.0.0.0/8, 172.16.0.0/12 and 192.168.0.0/16 are the private ranges that never route on the public internet.",
    body: [
      "Class A 1–126, Class B 128–191, Class C 192–223. 127 is loopback, and classes D and E are multicast and experimental.",
      "Private ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16. NAT is what lets them reach the internet.",
      "Classful addressing is historical — CIDR replaced it — but exams still ask about the ranges.",
    ],
    updatedAt: "2026-09-17T16:40:00.000Z",
    visibility: "private",
    tags: ["IPv4", "NAT"],
    readMinutes: 5,
  },
  {
    id: "network-devices",
    title: "Hub vs Switch vs Router",
    topicId: "basics",
    topic: "Networking Basics",
    emoji: "🔌",
    preview:
      "A hub repeats blindly, a switch learns MAC addresses, a router moves traffic between different networks.",
    body: [
      "Hub: layer 1, one collision domain, repeats every frame out of every port. Effectively extinct.",
      "Switch: layer 2, builds a MAC address table, each port is its own collision domain.",
      "Router: layer 3, separates broadcast domains and makes forwarding decisions using IP addresses and a routing table.",
    ],
    updatedAt: "2026-09-16T12:00:00.000Z",
    visibility: "public",
    tags: ["Hardware", "Fundamentals"],
    readMinutes: 4,
  },
];

export const RECENT_NOTES = NOTES.slice(0, 4);

/* ---------------------------------- Stats --------------------------------- */

export const LEARNER = {
  name: "Shehryar",
  handle: "@bearnet",
  rank: "Network Explorer",
  level: 4,
  xp: 1420,
  xpToNextLevel: 2000,
  streak: 7,
  notesSaved: 24,
  topicsCompleted: 12,
  topicsTotal: 28,
  quizAccuracy: 92,
  examsCompleted: 6,
  minutesThisWeek: 385,
};

export type ModuleTone = "soft" | "strong";

export const DASHBOARD_MODULES: {
  href: string;
  emoji: string;
  bearEmoji: string;
  title: string;
  description: string;
  cta: string;
  tone: ModuleTone;
}[] = [
  {
    href: "/notes",
    emoji: "📝",
    bearEmoji: "🐻",
    title: "My Notes",
    description: "Write and organize what I learn.",
    cta: "Open Notes",
    tone: "soft",
  },
  {
    href: "/tutor",
    emoji: "🤖",
    bearEmoji: "🐼",
    title: "AI Tutor",
    description: "Ask questions and learn from notes.",
    cta: "Chat with Panda",
    tone: "strong",
  },
  {
    href: "/quiz",
    emoji: "🧠",
    bearEmoji: "💡",
    title: "Quiz Me",
    description: "Test what I actually remember.",
    cta: "Start Quick Quiz",
    tone: "soft",
  },
  {
    href: "/exam",
    emoji: "🎓",
    bearEmoji: "🎀",
    title: "AI Exam",
    description: "Exam simulated on your knowledge.",
    cta: "Enter Exam Room",
    tone: "soft",
  },
  {
    href: "/lab",
    emoji: "💻",
    bearEmoji: "🐻‍❄️",
    title: "Pink Bear Cyber Lab",
    description: "Hands-on networking challenges.",
    cta: "Launch Cyber Lab",
    tone: "strong",
  },
  {
    href: "/progress",
    emoji: "🌱",
    bearEmoji: "📊",
    title: "My Progress",
    description: "See mastery and areas to revise.",
    cta: "View Full Journey",
    tone: "soft",
  },
];

/* --------------------------------- Journey -------------------------------- */

export type JourneyStage = {
  id: string;
  emoji: string;
  title: string;
  caption: string;
  state: "completed" | "current" | "locked";
  percent?: number;
  description: string;
};

export const JOURNEY: JourneyStage[] = [
  {
    id: "beginner",
    emoji: "🌱",
    title: "Beginner",
    caption: "Completed ✓",
    state: "completed",
    description: "Cables, devices, topologies and the vocabulary of networks.",
  },
  {
    id: "explorer",
    emoji: "🎀",
    title: "Network Explorer",
    caption: "Current (75%)",
    state: "current",
    percent: 75,
    description: "OSI layers, addressing, ports and everyday troubleshooting.",
  },
  {
    id: "learner",
    emoji: "🐻",
    title: "Network Learner",
    caption: "Locked",
    state: "locked",
    description: "Routing, VLANs, subnet design and packet analysis.",
  },
  {
    id: "defender",
    emoji: "🌸",
    title: "Cyber Defender",
    caption: "Locked",
    state: "locked",
    description: "Firewalls, hardening, monitoring and incident response.",
  },
  {
    id: "vapt",
    emoji: "🐻‍❄️",
    title: "VAPT Apprentice",
    caption: "Final Goal",
    state: "locked",
    description: "Structured vulnerability assessment and ethical testing.",
  },
];

export const BADGES = [
  { emoji: "🎀", title: "First Note", caption: "Wrote your first note", earned: true },
  { emoji: "🔥", title: "7 Day Streak", caption: "A full cozy week", earned: true },
  { emoji: "🧮", title: "Subnet Sprout", caption: "18 subnetting drills", earned: true },
  { emoji: "🌐", title: "DNS Whisperer", caption: "Aced every DNS quiz", earned: true },
  { emoji: "🛡️", title: "Packet Guardian", caption: "Finish the lab track", earned: false },
  { emoji: "🐻‍❄️", title: "Polar Pro", caption: "Reach VAPT Apprentice", earned: false },
];

export const WEEKLY_ACTIVITY = [
  { day: "Mon", minutes: 45 },
  { day: "Tue", minutes: 70 },
  { day: "Wed", minutes: 30 },
  { day: "Thu", minutes: 85 },
  { day: "Fri", minutes: 55 },
  { day: "Sat", minutes: 60 },
  { day: "Sun", minutes: 40 },
];

export const TOPIC_MASTERY = [
  { title: "Networking Basics", percent: 96 },
  { title: "IP Address", percent: 88 },
  { title: "MAC Address", percent: 92 },
  { title: "OSI Model", percent: 74 },
  { title: "TCP/IP", percent: 81 },
  { title: "DNS", percent: 90 },
  { title: "DHCP", percent: 68 },
  { title: "Ports", percent: 95 },
  { title: "Subnetting", percent: 57 },
];

/* ---------------------------------- Tutor --------------------------------- */

export type ChatMessage = {
  id: string;
  role: "user" | "bear";
  text: string;
  time: string;
  sources?: string[];
};

export const TUTOR_MESSAGES: ChatMessage[] = [
  {
    id: "m1",
    role: "bear",
    text: "Hi! I am Panda 🐼 Your notes are all loaded up — 9 topics, 24 notes. Ask me anything and I will answer using only what you have written down.",
    time: "09:02",
  },
  {
    id: "m2",
    role: "user",
    text: "Explain the difference between MAC and IP addresses simply.",
    time: "09:03",
  },
  {
    id: "m3",
    role: "bear",
    text: "Think of a MAC address as your name and an IP address as your current postal address. Your name never changes and is burned into the network card at the factory. Your postal address depends on where you are living right now — join a different Wi-Fi network and you get a new one.",
    time: "09:03",
    sources: ["MAC vs IP — Physical vs Logical", "OSI Model — My Colour Code System"],
  },
  {
    id: "m4",
    role: "user",
    text: "So which one does a router use to forward traffic?",
    time: "09:05",
  },
  {
    id: "m5",
    role: "bear",
    text: "IP addresses — routers work at layer 3. Switches work at layer 2 with MAC addresses, which is why a MAC address never leaves your local segment. ARP is the little translator that maps one to the other.",
    time: "09:05",
    sources: ["Hub vs Switch vs Router"],
  },
];

export const TUTOR_QUICK_ACTIONS = [
  { emoji: "✨", label: "Summarize" },
  { emoji: "🧠", label: "Explain Simply" },
  { emoji: "❓", label: "Quiz Me" },
  { emoji: "🔄", label: "Revise With Me" },
  { emoji: "💡", label: "Give Me an Example" },
  { emoji: "💻", label: "Practical Challenge" },
];

/* ---------------------------------- Quiz ---------------------------------- */

export type QuizQuestion = {
  id: string;
  topic: string;
  prompt: string;
  options: { id: string; text: string }[];
  correctId: string;
  explanation: string;
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    topic: "Ports",
    prompt: "Which port does HTTPS use by default?",
    options: [
      { id: "a", text: "80" },
      { id: "b", text: "443" },
      { id: "c", text: "53" },
      { id: "d", text: "22" },
    ],
    correctId: "b",
    explanation:
      "HTTPS runs over TCP 443. Port 80 is plain HTTP, 53 is DNS and 22 is SSH.",
  },
  {
    id: "q2",
    topic: "OSI Model",
    prompt: "At which OSI layer does a router make its forwarding decisions?",
    options: [
      { id: "a", text: "Layer 2 — Data Link" },
      { id: "b", text: "Layer 3 — Network" },
      { id: "c", text: "Layer 4 — Transport" },
      { id: "d", text: "Layer 7 — Application" },
    ],
    correctId: "b",
    explanation:
      "Routers are layer 3 devices — they forward using IP addresses and a routing table.",
  },
  {
    id: "q3",
    topic: "TCP/IP",
    prompt: "What is the correct order of the TCP three-way handshake?",
    options: [
      { id: "a", text: "ACK → SYN → SYN-ACK" },
      { id: "b", text: "SYN → ACK → SYN-ACK" },
      { id: "c", text: "SYN → SYN-ACK → ACK" },
      { id: "d", text: "SYN-ACK → SYN → ACK" },
    ],
    correctId: "c",
    explanation:
      "The client sends SYN, the server answers SYN-ACK, and the client confirms with ACK.",
  },
  {
    id: "q4",
    topic: "Subnetting",
    prompt: "How many usable host addresses are in a /29 subnet?",
    options: [
      { id: "a", text: "4" },
      { id: "b", text: "6" },
      { id: "c", text: "8" },
      { id: "d", text: "14" },
    ],
    correctId: "b",
    explanation:
      "A /29 gives 8 total addresses; minus the network and broadcast addresses leaves 6 usable.",
  },
  {
    id: "q5",
    topic: "DHCP",
    prompt: "A host shows 169.254.10.4. What most likely happened?",
    options: [
      { id: "a", text: "It received a static address" },
      { id: "b", text: "DNS resolution failed" },
      { id: "c", text: "No DHCP server responded, so APIPA assigned it" },
      { id: "d", text: "The default gateway is misconfigured" },
    ],
    correctId: "c",
    explanation:
      "The 169.254.0.0/16 range is APIPA — the client self-assigned because DHCP never answered.",
  },
];

export const QUIZ_TOPIC_CHOICES = [
  { id: "mixed", emoji: "🎀", title: "Mixed Review", caption: "A bit of everything" },
  { id: "osi-model", emoji: "🌈", title: "OSI Model", caption: "7 layers, 6 notes" },
  { id: "subnetting", emoji: "🧮", title: "Subnetting", caption: "Magic number drills" },
  { id: "ports", emoji: "🚪", title: "Ports", caption: "Memorise the classics" },
  { id: "dns", emoji: "🌐", title: "DNS & DHCP", caption: "Name and address" },
  { id: "tcp-ip", emoji: "🤝", title: "TCP/IP", caption: "Transport behaviour" },
];

/* ---------------------------------- Exam ---------------------------------- */

export const EXAM_RESULT = {
  score: 8,
  total: 10,
  percent: 80,
  passed: true,
  durationLabel: "12 min 40 s",
  strongTopics: [
    { title: "Ports & Protocols", percent: 100 },
    { title: "TCP/IP Basics", percent: 95 },
    { title: "Network Devices", percent: 90 },
  ],
  reviseTopics: [
    { title: "Subnetting", percent: 55 },
    { title: "OSI Layer 5–6", percent: 60 },
  ],
  recommendedNotes: [
    {
      id: "subnetting-cheatsheet",
      title: "Subnetting Cheat Sheet (/24 to /30)",
      emoji: "🧮",
    },
    {
      id: "osi-layer-colors",
      title: "OSI Model — My Colour Code System",
      emoji: "🌈",
    },
  ],
};

/* ----------------------------------- Lab ---------------------------------- */

export const LAB_SCENARIO = {
  code: "SCN-04",
  title: "Something is wrong with the network!",
  difficulty: "Medium",
  estimate: "15 min",
  brief:
    "A user reports that internal file shares still work, but no website loads. Polar has already run the first few commands for you — read the terminal, then pick what you think is happening.",
  hints: [
    "Local traffic works, external traffic does not.",
    "Pinging 8.8.8.8 by raw IP succeeds.",
    "Pinging google.com fails with an unknown-host error.",
  ],
  answers: [
    {
      id: "a",
      emoji: "🔌",
      title: "The network cable is unplugged",
      caption: "Physical layer failure at the workstation",
    },
    {
      id: "b",
      emoji: "🌐",
      title: "DNS resolution is failing",
      caption: "Names do not resolve, raw IPs still route fine",
    },
    {
      id: "c",
      emoji: "🚧",
      title: "The default gateway is down",
      caption: "Nothing would leave the subnet at all",
    },
    {
      id: "d",
      emoji: "🔥",
      title: "The firewall blocks all outbound traffic",
      caption: "Even ICMP to 8.8.8.8 would be dropped",
    },
  ],
  correctId: "b",
};

export type TerminalLine = {
  type: "command" | "output" | "muted" | "success" | "error";
  text: string;
};

export const LAB_TERMINAL_LINES: TerminalLine[] = [
  { type: "command", text: "ping 8.8.8.8" },
  { type: "muted", text: "PING 8.8.8.8 (8.8.8.8): 56 data bytes" },
  { type: "output", text: "64 bytes from 8.8.8.8: icmp_seq=0 ttl=117 time=18.4 ms" },
  { type: "output", text: "64 bytes from 8.8.8.8: icmp_seq=1 ttl=117 time=17.9 ms" },
  { type: "output", text: "64 bytes from 8.8.8.8: icmp_seq=2 ttl=117 time=18.2 ms" },
  { type: "success", text: "--- 3 packets transmitted, 3 received, 0% packet loss ---" },
  { type: "muted", text: "" },
  { type: "command", text: "ping google.com" },
  { type: "error", text: "ping: cannot resolve google.com: Unknown host" },
  { type: "muted", text: "" },
  { type: "command", text: "cat /etc/resolv.conf" },
  { type: "output", text: "nameserver 10.0.0.53   # unreachable" },
];

export const LAB_CHALLENGES = [
  {
    id: "unreachable",
    emoji: "🌐",
    title: "Web Server Unreachable",
    caption: "Trace the path, find the break",
    difficulty: "Medium",
    status: "In progress" as const,
    progress: 60,
  },
  {
    id: "rogue-dhcp",
    emoji: "📮",
    title: "The Rogue DHCP Server",
    caption: "Two servers, one very confused subnet",
    difficulty: "Hard",
    status: "Locked" as const,
    progress: 0,
  },
  {
    id: "port-sweep",
    emoji: "🚪",
    title: "Which Ports Are Open?",
    caption: "Read a port scan report like a story",
    difficulty: "Easy",
    status: "Completed" as const,
    progress: 100,
  },
  {
    id: "packet-peek",
    emoji: "📦",
    title: "Cozy Packet Inspector",
    caption: "Wireshark-style capture, pastel edition",
    difficulty: "Medium",
    status: "Locked" as const,
    progress: 0,
  },
];

export const PACKET_ROWS = [
  {
    no: 1,
    time: "0.000",
    source: "192.168.1.24",
    dest: "10.0.0.53",
    proto: "DNS",
    info: "Standard query A google.com",
  },
  {
    no: 2,
    time: "5.001",
    source: "192.168.1.24",
    dest: "10.0.0.53",
    proto: "DNS",
    info: "Retransmission — no response",
  },
  {
    no: 3,
    time: "0.012",
    source: "192.168.1.24",
    dest: "8.8.8.8",
    proto: "ICMP",
    info: "Echo (ping) request id=0x1a",
  },
  {
    no: 4,
    time: "0.030",
    source: "8.8.8.8",
    dest: "192.168.1.24",
    proto: "ICMP",
    info: "Echo (ping) reply id=0x1a",
  },
  {
    no: 5,
    time: "0.044",
    source: "192.168.1.24",
    dest: "192.168.1.1",
    proto: "ARP",
    info: "Who has 192.168.1.1? Tell 192.168.1.24",
  },
];

/* -------------------------------- Dashboard ------------------------------- */

export const TODAY_CHALLENGE = {
  emoji: "🎯",
  title: "Understanding the OSI Model & TCP Handshakes",
  percent: 65,
  nextMilestone: "Layer 4 Transport",
};

export const TIP_OF_THE_DAY = {
  helpfulCount: 34,
  text: "A MAC address is physical and burned into the Network Interface Card (NIC), while an IP address is logical and can change depending on your connected network. Keep those packet headers tidy! ✨",
};

export const SCHEDULED_EXAM = {
  title: "Network+ N10-008",
  daysLeft: 18,
  hoursLeft: 14,
  prepared: 84,
  pace: "45 min/day",
};
