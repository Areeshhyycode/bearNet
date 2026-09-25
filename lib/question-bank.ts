import type { Difficulty, QuizQuestion } from "./quiz-types";

/**
 * Offline fallback used when the AI is unreachable or not configured,
 * so a quiz always works. Written to Network+ foundation level.
 */

type BankEntry = {
  topic: string;
  difficulty: Difficulty;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

const BANK: BankEntry[] = [
  {
    topic: "Ports",
    difficulty: "easy",
    prompt: "Which port does HTTPS use by default?",
    options: ["80", "443", "53", "22"],
    correctIndex: 1,
    explanation: "HTTPS runs over TCP 443. Port 80 is plain HTTP, 53 is DNS and 22 is SSH.",
  },
  {
    topic: "Ports",
    difficulty: "easy",
    prompt: "Which port does SSH use?",
    options: ["21", "22", "23", "25"],
    correctIndex: 1,
    explanation: "SSH uses TCP 22. Telnet (23) is its insecure predecessor.",
  },
  {
    topic: "Ports",
    difficulty: "medium",
    prompt: "DNS uses UDP 53 for lookups. When does it use TCP 53 instead?",
    options: [
      "For every query from a mobile device",
      "For zone transfers and responses too large for UDP",
      "Only when DNSSEC is disabled",
      "When the resolver is on the same subnet",
    ],
    correctIndex: 1,
    explanation:
      "TCP 53 handles zone transfers and any response that will not fit in a single UDP datagram.",
  },
  {
    topic: "OSI Model",
    difficulty: "easy",
    prompt: "At which OSI layer does a router make its forwarding decisions?",
    options: [
      "Layer 2 — Data Link",
      "Layer 3 — Network",
      "Layer 4 — Transport",
      "Layer 7 — Application",
    ],
    correctIndex: 1,
    explanation: "Routers are layer 3 devices — they forward using IP addresses and a routing table.",
  },
  {
    topic: "OSI Model",
    difficulty: "medium",
    prompt: "A switch builds a MAC address table. Which OSI layer does it operate at?",
    options: ["Layer 1", "Layer 2", "Layer 3", "Layer 4"],
    correctIndex: 1,
    explanation: "MAC addresses live at layer 2, the data link layer.",
  },
  {
    topic: "OSI Model",
    difficulty: "hard",
    prompt: "Encryption and character encoding are handled at which OSI layer?",
    options: ["Session", "Presentation", "Application", "Transport"],
    correctIndex: 1,
    explanation:
      "Layer 6, Presentation, deals with translation, encryption and compression of data.",
  },
  {
    topic: "TCP/IP",
    difficulty: "easy",
    prompt: "What is the correct order of the TCP three-way handshake?",
    options: [
      "ACK → SYN → SYN-ACK",
      "SYN → ACK → SYN-ACK",
      "SYN → SYN-ACK → ACK",
      "SYN-ACK → SYN → ACK",
    ],
    correctIndex: 2,
    explanation: "The client sends SYN, the server answers SYN-ACK, the client confirms with ACK.",
  },
  {
    topic: "TCP/IP",
    difficulty: "medium",
    prompt: "Which protocol would a live video call most likely use, and why?",
    options: [
      "TCP, because dropped frames must be retransmitted",
      "UDP, because low latency matters more than perfect delivery",
      "ICMP, because it is the lightest protocol",
      "ARP, because it resolves the peer address",
    ],
    correctIndex: 1,
    explanation:
      "UDP skips handshakes and retransmission — a late packet is worse than a lost one in real-time media.",
  },
  {
    topic: "Subnetting",
    difficulty: "medium",
    prompt: "How many usable host addresses are in a /29 subnet?",
    options: ["4", "6", "8", "14"],
    correctIndex: 1,
    explanation:
      "A /29 has 8 total addresses; removing the network and broadcast addresses leaves 6 usable.",
  },
  {
    topic: "Subnetting",
    difficulty: "hard",
    prompt: "Which subnet does the host 192.168.1.100/26 belong to?",
    options: ["192.168.1.0", "192.168.1.64", "192.168.1.96", "192.168.1.128"],
    correctIndex: 1,
    explanation:
      "A /26 has a block size of 64, so networks start at .0, .64, .128, .192. 100 falls inside the .64 network.",
  },
  {
    topic: "Subnetting",
    difficulty: "easy",
    prompt: "What is the default subnet mask for a /24 network?",
    options: ["255.0.0.0", "255.255.0.0", "255.255.255.0", "255.255.255.128"],
    correctIndex: 2,
    explanation: "A /24 sets the first 24 bits, giving 255.255.255.0.",
  },
  {
    topic: "DHCP",
    difficulty: "medium",
    prompt: "A host shows 169.254.10.4. What most likely happened?",
    options: [
      "It received a static address",
      "DNS resolution failed",
      "No DHCP server responded, so APIPA assigned it",
      "The default gateway is misconfigured",
    ],
    correctIndex: 2,
    explanation:
      "169.254.0.0/16 is the APIPA range — the client self-assigned because DHCP never answered.",
  },
  {
    topic: "DHCP",
    difficulty: "easy",
    prompt: "What does the DORA process stand for?",
    options: [
      "Discover, Offer, Request, Acknowledge",
      "Detect, Open, Resolve, Assign",
      "Deliver, Order, Route, Accept",
      "Discover, Open, Reply, Accept",
    ],
    correctIndex: 0,
    explanation: "DHCP leases are negotiated with Discover, Offer, Request and Acknowledge.",
  },
  {
    topic: "DNS",
    difficulty: "easy",
    prompt: "Which DNS record maps a hostname to an IPv6 address?",
    options: ["A", "AAAA", "CNAME", "MX"],
    correctIndex: 1,
    explanation: "AAAA holds IPv6 addresses; A holds IPv4.",
  },
  {
    topic: "DNS",
    difficulty: "medium",
    prompt:
      "A site loads by IP address but not by name. Which is the most likely cause?",
    options: [
      "The network cable is unplugged",
      "DNS resolution is failing",
      "The firewall blocks all traffic",
      "The subnet mask is wrong",
    ],
    correctIndex: 1,
    explanation:
      "Raw IP traffic working proves routing is fine — only name resolution is broken.",
  },
  {
    topic: "MAC Address",
    difficulty: "easy",
    prompt: "How many bits long is a MAC address?",
    options: ["32", "48", "64", "128"],
    correctIndex: 1,
    explanation: "A MAC address is 48 bits, written as six hexadecimal pairs.",
  },
  {
    topic: "MAC Address",
    difficulty: "medium",
    prompt: "Which protocol maps an IP address to a MAC address on a local network?",
    options: ["DNS", "ARP", "DHCP", "ICMP"],
    correctIndex: 1,
    explanation: "ARP asks 'who has this IP, tell me your MAC' on the local segment.",
  },
  {
    topic: "IP Address",
    difficulty: "easy",
    prompt: "Which of these is a private IPv4 range?",
    options: ["11.0.0.0/8", "10.0.0.0/8", "9.0.0.0/8", "12.0.0.0/8"],
    correctIndex: 1,
    explanation:
      "The private ranges are 10.0.0.0/8, 172.16.0.0/12 and 192.168.0.0/16.",
  },
  {
    topic: "IP Address",
    difficulty: "medium",
    prompt: "What does NAT allow a network to do?",
    options: [
      "Encrypt traffic between two routers",
      "Let many private addresses share one public address",
      "Assign addresses automatically to clients",
      "Resolve hostnames into addresses",
    ],
    correctIndex: 1,
    explanation:
      "Network Address Translation rewrites private source addresses so they can share a public one.",
  },
  {
    topic: "Networking Basics",
    difficulty: "easy",
    prompt: "Which device separates broadcast domains?",
    options: ["Hub", "Switch", "Router", "Repeater"],
    correctIndex: 2,
    explanation:
      "Routers separate broadcast domains; a switch separates collision domains but forwards broadcasts.",
  },
  {
    topic: "Networking Basics",
    difficulty: "medium",
    prompt: "Which command shows each hop between you and a destination?",
    options: ["ping", "traceroute", "nslookup", "netstat"],
    correctIndex: 1,
    explanation:
      "traceroute (tracert on Windows) lists every router hop along the path.",
  },
  {
    topic: "Networking Basics",
    difficulty: "hard",
    prompt:
      "Users on VLAN 20 cannot reach VLAN 30, though both have correct addresses. What is missing?",
    options: [
      "A DHCP relay agent",
      "Inter-VLAN routing on a layer 3 device",
      "A faster switch uplink",
      "A second DNS server",
    ],
    correctIndex: 1,
    explanation:
      "VLANs are separate broadcast domains — traffic between them needs a router or layer 3 switch.",
  },
];

function toQuestion(entry: BankEntry, index: number): QuizQuestion {
  return {
    id: `bank-${index}`,
    topic: entry.topic,
    prompt: entry.prompt,
    options: entry.options.map((text, i) => ({
      id: String.fromCharCode(97 + i),
      text,
    })),
    correctId: String.fromCharCode(97 + entry.correctIndex),
    explanation: entry.explanation,
  };
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Picks questions for a topic and difficulty, widening if too few match. */
export function pickFromBank({
  topicTitle,
  difficulty,
  count,
}: {
  topicTitle?: string | null;
  difficulty: Difficulty;
  count: number;
}): QuizQuestion[] {
  const indexed = BANK.map((entry, index) => ({ entry, index }));

  const matchesTopic = topicTitle
    ? indexed.filter((item) => item.entry.topic === topicTitle)
    : indexed;

  const pool = matchesTopic.length > 0 ? matchesTopic : indexed;

  const exact = pool.filter((item) => item.entry.difficulty === difficulty);
  const chosen = shuffle(exact);

  // Top up from the rest of the pool if the difficulty bucket is thin.
  if (chosen.length < count) {
    const rest = shuffle(pool.filter((item) => item.entry.difficulty !== difficulty));
    chosen.push(...rest);
  }

  return chosen.slice(0, count).map(({ entry, index }) => toQuestion(entry, index));
}
