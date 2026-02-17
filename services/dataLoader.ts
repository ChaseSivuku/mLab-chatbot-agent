const BASE_URL = "https://mlab-knowledge-api.vercel.app/api";

// Only endpoints confirmed to exist on the API
const ENDPOINTS = [
  "programmes",
  "faqs",
  "policies",
  "locations",
  "partners",
  "overview",
];

const fetchEndpoint = async (endpoint: string): Promise<any> => {
  let allData: any[] = [];
  let offset = 0;
  const limit = 100;
  let hasMore = true;

  while (hasMore) {
    const url = `${BASE_URL}/${endpoint}?limit=${limit}&offset=${offset}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} from /${endpoint}`);
    }

    const json = (await response.json()) as any;

    if (Array.isArray(json?.data)) {
      allData = allData.concat(json.data);
      hasMore = json?.pagination?.hasMore ?? false;
      offset += limit;
    } else if (json?.data) {
      // Single object response (e.g. overview)
      return json.data;
    } else {
      return json;
    }
  }

  return allData;
};

const fetchAllData = async (): Promise<Record<string, any>> => {
  console.log("Fetching mLab data from Knowledge API...");

  const results = await Promise.allSettled(
    ENDPOINTS.map(async (endpoint) => {
      const data = await fetchEndpoint(endpoint);
      return { endpoint, data };
    })
  );

  const combinedData: Record<string, any> = {};

  for (const result of results) {
    if (result.status === "fulfilled") {
      const { endpoint, data } = result.value;
      const key = endpoint.replace(/-([a-z])/g, (_: string, c: string) => c.toUpperCase());
      combinedData[key] = data;
      console.log(`  ✓ Loaded: ${endpoint}`);
    } else {
      console.warn(`  ✗ Failed:`, result.reason);
    }
  }

  console.log("mLab data fetch complete.");
  return combinedData;
};

// Single shared promise — guarantees fetch runs exactly once
// even if multiple files import this module simultaneously
let dataPromise: Promise<Record<string, any>> | null = null;

export const getMlabData = (): Promise<Record<string, any>> => {
  if (!dataPromise) {
    dataPromise = fetchAllData();
  }
  return dataPromise;
};

// Legacy export for backward compatibility
export let jsonMlabData: Record<string, any> = {};

getMlabData()
  .then((data) => { jsonMlabData = data; })
  .catch((err) => { console.error("Failed to pre-load mLab data:", err); });