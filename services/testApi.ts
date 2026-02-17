/**
 * testApi.ts
 * ─────────────────────────────────────────────────────────
 * HOW TO RUN:
 *
 *   Terminal 1 — start your server (from project root):
 *     npm run server
 *
 *   Terminal 2 — run the tests (from project root):
 *     npx tsx services/testApi.ts
 * ─────────────────────────────────────────────────────────
 */

const KNOWLEDGE_API_BASE = "https://mlab-knowledge-api.vercel.app/api";
const LOCAL_SERVER_BASE  = "http://localhost:3000/api";

const green  = (s: string) => `\x1b[32m${s}\x1b[0m`;
const red    = (s: string) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s: string) => `\x1b[33m${s}\x1b[0m`;
const bold   = (s: string) => `\x1b[1m${s}\x1b[0m`;

// Only confirmed working endpoints
const ENDPOINTS = [
  "programmes",
  "faqs",
  "policies",
  "locations",
  "partners",
  "overview",
];

// ── 1. Test the Knowledge API directly ──────────────────
async function testKnowledgeApi() {
  console.log(bold("\n=== 1. Testing mLab Knowledge API Endpoints ===\n"));
  for (const endpoint of ENDPOINTS) {
    const url = `${KNOWLEDGE_API_BASE}/${endpoint}?limit=5`;
    try {
      const res = await fetch(url);
      if (res.ok) {
        const json = (await res.json()) as any;
        const count = Array.isArray(json?.data) ? json.data.length : json?.data ? 1 : "?";
        console.log(green(`  ✓ /${endpoint}`) + `  →  ${count} item(s) returned`);
      } else {
        console.log(red(`  ✗ /${endpoint}`) + `  →  HTTP ${res.status}`);
      }
    } catch (err: any) {
      console.log(red(`  ✗ /${endpoint}`) + `  →  ${err.message}`);
    }
  }
}

// ── 2. Test /api/chat ────────────────────────────────────
async function testChatEndpoint() {
  console.log(bold("\n=== 2. Testing Local Server: POST /api/chat ===\n"));
  const testMessages = [
    "What is CodeTribe Academy?",
    "What are the application requirements?",
    "Where are the mLab locations?",
  ];
  for (const message of testMessages) {
    try {
      const res = await fetch(`${LOCAL_SERVER_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (res.ok) {
        const json = (await res.json()) as any;
        const preview = json?.reply?.substring(0, 120).replace(/\n/g, " ") + "...";
        console.log(green(`  ✓ "${message}"`));
        console.log(yellow(`    Reply: ${preview}\n`));
      } else {
        console.log(red(`  ✗ "${message}"`) + `  →  HTTP ${res.status}\n`);
      }
    } catch (err: any) {
      console.log(red(`  ✗ "${message}"`) + `  →  ${err.message} (Is the server running?)\n`);
    }
  }
}

// ── 3. Test /api/category ────────────────────────────────
async function testCategoryEndpoint() {
  console.log(bold("\n=== 3. Testing Local Server: POST /api/category ===\n"));
  const testCategories = ["programmes", "faqs", "locations"];
  for (const category of testCategories) {
    try {
      const res = await fetch(`${LOCAL_SERVER_BASE}/category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category }),
      });
      if (res.ok) {
        const json = (await res.json()) as any;
        const preview = json?.reply?.substring(0, 120).replace(/\n/g, " ") + "...";
        console.log(green(`  ✓ category: "${category}"`));
        console.log(yellow(`    Reply: ${preview}\n`));
      } else {
        console.log(red(`  ✗ category: "${category}"`) + `  →  HTTP ${res.status}\n`);
      }
    } catch (err: any) {
      console.log(red(`  ✗ category: "${category}"`) + `  →  ${err.message} (Is the server running?)\n`);
    }
  }
}

(async () => {
  await testKnowledgeApi();
  await testChatEndpoint();
  await testCategoryEndpoint();
  console.log(bold("\n=== Done ===\n"));
})();