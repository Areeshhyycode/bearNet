/**
 * Static content only — module copy, journey ranks, badge definitions,
 * lab scenarios and daily tips.
 *
 * Notes, categories, XP and progress all live in MongoDB now; see
 * `lib/db/` and the client stores in `lib/*-store.tsx`.
 */

export type BearId = "grizzly" | "panda" | "polar";

/* -------------------------------- Dashboard ------------------------------- */

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
  minLevel: number;
  description: string;
};

export const JOURNEY: JourneyStage[] = [
  {
    id: "beginner",
    emoji: "🌱",
    title: "Beginner",
    minLevel: 1,
    description: "Cables, devices, topologies and the vocabulary of networks.",
  },
  {
    id: "explorer",
    emoji: "🎀",
    title: "Network Explorer",
    minLevel: 2,
    description: "OSI layers, addressing, ports and everyday troubleshooting.",
  },
  {
    id: "learner",
    emoji: "🐻",
    title: "Network Learner",
    minLevel: 4,
    description: "Routing, VLANs, subnet design and packet analysis.",
  },
  {
    id: "defender",
    emoji: "🌸",
    title: "Cyber Defender",
    minLevel: 6,
    description: "Firewalls, hardening, monitoring and incident response.",
  },
  {
    id: "vapt",
    emoji: "🐻‍❄️",
    title: "VAPT Apprentice",
    minLevel: 9,
    description: "Structured vulnerability assessment and ethical testing.",
  },
];

/** Badge definitions — `earned` is computed from live progress. */
export type BadgeDefinition = {
  id: string;
  emoji: string;
  title: string;
  caption: string;
};

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  { id: "first-note", emoji: "🎀", title: "First Note", caption: "Write your first note" },
  { id: "streak-7", emoji: "🔥", title: "7 Day Streak", caption: "Study seven days running" },
  { id: "quiz-5", emoji: "🧠", title: "Quiz Regular", caption: "Finish five quizzes" },
  { id: "sharp-shot", emoji: "✨", title: "Sharp Shot", caption: "Score 100% on any run" },
  { id: "exam-pass", emoji: "🎓", title: "Exam Ready", caption: "Pass an exam at 80%+" },
  { id: "lab-solved", emoji: "🛡️", title: "Packet Guardian", caption: "Solve a lab scenario" },
  { id: "note-collector", emoji: "📚", title: "Note Collector", caption: "Write ten notes" },
  { id: "polar-pro", emoji: "🐻‍❄️", title: "Polar Pro", caption: "Reach VAPT Apprentice" },
];

/* ---------------------------------- Tutor --------------------------------- */

export const TUTOR_QUICK_ACTIONS = [
  { emoji: "✨", label: "Summarize", prompt: "Summarize my notes in a few bullet points." },
  {
    emoji: "🧠",
    label: "Explain Simply",
    prompt: "Explain the topic I last wrote about as simply as you can.",
  },
  { emoji: "❓", label: "Quiz Me", prompt: "Ask me three quick questions from my notes." },
  {
    emoji: "🔄",
    label: "Revise With Me",
    prompt: "Walk me through a short revision of my weakest topic.",
  },
  {
    emoji: "💡",
    label: "Give Me an Example",
    prompt: "Give me a real-world example of the concept in my latest note.",
  },
  {
    emoji: "💻",
    label: "Practical Challenge",
    prompt: "Give me a hands-on troubleshooting challenge based on my notes.",
  },
];

/* ---------------------------------- Quiz ---------------------------------- */

export const QUIZ_TOPIC_CHOICES = [
  { id: "mixed", emoji: "🎀", title: "Mixed Review", caption: "A bit of everything" },
  { id: "OSI Model", emoji: "🌈", title: "OSI Model", caption: "The seven layers" },
  { id: "Subnetting", emoji: "🧮", title: "Subnetting", caption: "Magic number drills" },
  { id: "Ports", emoji: "🚪", title: "Ports", caption: "Memorise the classics" },
  { id: "DNS", emoji: "🌐", title: "DNS", caption: "Names into addresses" },
  { id: "TCP/IP", emoji: "🤝", title: "TCP/IP", caption: "Transport behaviour" },
];

/* ----------------------------------- Lab ---------------------------------- */

export type LabScenario = {
  id: string;
  code: string;
  emoji: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  estimate: string;
  brief: string;
  hints: string[];
  answers: { id: string; emoji: string; title: string; caption: string }[];
  correctId: string;
  /** Commands the simulated shell understands, and what they print. */
  commands: Record<string, { type: "output" | "success" | "error" | "muted"; text: string }[]>;
  debrief: string;
};

export const LAB_SCENARIOS: LabScenario[] = [
  {
    id: "unreachable",
    code: "SCN-04",
    emoji: "🌐",
    title: "Something is wrong with the network!",
    difficulty: "Medium",
    estimate: "15 min",
    brief:
      "A user reports that internal file shares still work, but no website loads. Run some commands in the terminal below, read the output, then pick what you think is happening.",
    hints: [
      "Try pinging a raw IP address.",
      "Then try pinging a hostname.",
      "Check what name server the machine is using.",
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
    commands: {
      "ping 8.8.8.8": [
        { type: "muted", text: "PING 8.8.8.8 (8.8.8.8): 56 data bytes" },
        { type: "output", text: "64 bytes from 8.8.8.8: icmp_seq=0 ttl=117 time=18.4 ms" },
        { type: "output", text: "64 bytes from 8.8.8.8: icmp_seq=1 ttl=117 time=17.9 ms" },
        { type: "output", text: "64 bytes from 8.8.8.8: icmp_seq=2 ttl=117 time=18.2 ms" },
        { type: "success", text: "--- 3 packets transmitted, 3 received, 0% packet loss ---" },
      ],
      "ping google.com": [
        { type: "error", text: "ping: cannot resolve google.com: Unknown host" },
      ],
      "ping 192.168.1.1": [
        { type: "output", text: "64 bytes from 192.168.1.1: icmp_seq=0 ttl=64 time=0.8 ms" },
        { type: "success", text: "--- 1 packets transmitted, 1 received, 0% packet loss ---" },
      ],
      "cat /etc/resolv.conf": [
        { type: "output", text: "nameserver 10.0.0.53   # configured DNS server" },
        { type: "muted", text: "search bearnet.local" },
      ],
      "ping 10.0.0.53": [
        { type: "error", text: "Request timeout for icmp_seq 0" },
        { type: "error", text: "Request timeout for icmp_seq 1" },
        { type: "error", text: "--- 2 packets transmitted, 0 received, 100% packet loss ---" },
      ],
      "nslookup google.com": [
        { type: "muted", text: "Server:  10.0.0.53" },
        { type: "error", text: ";; connection timed out; no servers could be reached" },
      ],
      traceroute: [
        { type: "output", text: " 1  192.168.1.1   0.9 ms" },
        { type: "output", text: " 2  10.20.0.1     6.1 ms" },
        { type: "output", text: " 3  8.8.8.8      18.0 ms" },
        { type: "success", text: "Path to the internet is healthy." },
      ],
      ipconfig: [
        { type: "output", text: "IPv4 Address . . . : 192.168.1.24" },
        { type: "output", text: "Subnet Mask  . . . : 255.255.255.0" },
        { type: "output", text: "Default Gateway. . : 192.168.1.1" },
        { type: "output", text: "DNS Servers  . . . : 10.0.0.53" },
      ],
    },
    debrief:
      "Raw IP traffic works and traceroute reaches the internet, so routing is fine. Only name lookups fail, and the configured resolver 10.0.0.53 never answers. That is a DNS failure — point the client at a reachable resolver and everything returns.",
  },
  {
    id: "rogue-dhcp",
    code: "SCN-07",
    emoji: "📮",
    title: "Two servers, one very confused subnet",
    difficulty: "Hard",
    estimate: "20 min",
    brief:
      "Half the office is online, half is not. The ones that fail have addresses nobody recognises. Investigate the address the client received.",
    hints: [
      "Check the client's address and gateway.",
      "Ask which server handed out the lease.",
      "Compare it against the real DHCP server.",
    ],
    answers: [
      {
        id: "a",
        emoji: "📮",
        title: "A rogue DHCP server is leasing bad addresses",
        caption: "Clients get a gateway that does not route",
      },
      {
        id: "b",
        emoji: "🌐",
        title: "The DNS server is overloaded",
        caption: "Would not change the assigned address",
      },
      {
        id: "c",
        emoji: "🔌",
        title: "A switch port is faulty",
        caption: "Would affect one machine, not half the floor",
      },
      {
        id: "d",
        emoji: "🧮",
        title: "The subnet mask is too small",
        caption: "Plausible, but the lease source is the clue",
      },
    ],
    correctId: "a",
    commands: {
      ipconfig: [
        { type: "output", text: "IPv4 Address . . . : 192.168.50.14" },
        { type: "output", text: "Subnet Mask  . . . : 255.255.255.0" },
        { type: "error", text: "Default Gateway. . : 192.168.50.1  (unreachable)" },
      ],
      "ipconfig /all": [
        { type: "output", text: "DHCP Enabled . . . : Yes" },
        { type: "error", text: "DHCP Server  . . . : 192.168.50.99  (unexpected)" },
        { type: "muted", text: "Expected DHCP Server: 192.168.1.10" },
      ],
      "ping 192.168.50.1": [
        { type: "error", text: "Request timeout for icmp_seq 0" },
        { type: "error", text: "--- 1 packets transmitted, 0 received, 100% packet loss ---" },
      ],
      "ping 192.168.1.10": [
        { type: "error", text: "ping: sendto: Network is unreachable" },
      ],
    },
    debrief:
      "The client took a lease from 192.168.50.99 instead of the real server at 192.168.1.10, landing it on a subnet with a gateway that does not route. That is a rogue DHCP server — find the port it sits on and enable DHCP snooping.",
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

/* ------------------------------- Daily copy ------------------------------- */

export const DAILY_TIPS = [
  "A MAC address is physical and burned into the Network Interface Card, while an IP address is logical and changes with the network you join.",
  "Troubleshoot bottom-up: link, address, gateway, name resolution, then the application. You will rarely have to guess.",
  "A /30 gives you exactly two usable addresses — perfect for a point-to-point link between two routers.",
  "TCP is a phone call: you say hello first. UDP is a postcard: you write it and hope it arrives.",
  "169.254.x.x means APIPA stepped in — the client never heard back from a DHCP server.",
  "Port 22 is SSH, 53 is DNS, 80 is HTTP, 443 is HTTPS. Those four cover most exam questions.",
  "Switches separate collision domains. Routers separate broadcast domains. That one line explains a lot of exam answers.",
];

/** Rotates daily without any randomness that could differ between renders. */
export function tipForToday(date = new Date()) {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000,
  );
  return DAILY_TIPS[dayOfYear % DAILY_TIPS.length];
}

export const TODAY_CHALLENGE = {
  emoji: "🎯",
  title: "Understanding the OSI Model & TCP Handshakes",
  nextMilestone: "Layer 4 Transport",
};
