import dotenv from "dotenv";

dotenv.config();

const BASE_URL = process.env.MLAB_KNOWLEDGE_API_BASE_URL || "https://mlab-knowledge-api.vercel.app/api";

interface ApiResponse<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  meta?: {
    timestamp: string;
    endpoint: string;
  };
}

interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

//getting data from API 
async function fetchFromApi<T>(
  endpoint: string,
  params?: Record<string, string | number>
): Promise<ApiResponse<T>> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      error: "FETCH_ERROR",
      message: `Failed to fetch from ${endpoint}`,
      statusCode: response.status,
    }));
    throw new Error(`API Error: ${error.message} (${error.statusCode})`);
  }

  return response.json();
}

//HANDLE PROGRAMMES
//fetch all programmes
export async function getProgrammes(params?: {
  scope?: "mlab" | "codetribe";
  category?: string;
  limit?: number;
  offset?: number;
  sort?: string;
  order?: "asc" | "desc";
}) {
  return fetchFromApi("/programmes", params);
}

//gwt programme by id
export async function getProgrammeById(id: string) {
  return fetchFromApi(`/programmes/${id}`);
}

//HANDLE FAQs
//fetch FAQs
export async function getFAQs(params?: {
  scope?: "mlab" | "codetribe";
  category?: string;
  source?: "mlab_website" | "codetribe_whatsapp" | "both";
  programme_id?: string;
  limit?: number;
  offset?: number;
}) {
  return fetchFromApi("/faqs", params);
}

//Fetch by query
export async function searchFAQs(
  query: string,
  params?: {
    scope?: "mlab" | "codetribe";
    category?: string;
    source?: "mlab_website" | "codetribe_whatsapp" | "both";
    limit?: number;
    offset?: number;
  }
) {
  return fetchFromApi("/faqs/search", { q: query, ...params });
}

//HANDLE ELIGABILITY
//fetch eligability
export async function getEligibility(
  programmeId: string,
  params?: {
    limit?: number;
    offset?: number;
    sort?: string;
    order?: "asc" | "desc";
  }
) {
  return fetchFromApi(`/eligibility/${programmeId}`, params);
}

//HANDLE APPLICATIONS
//fetch application processes
export async function getApplicationProcess(
  programmeId: string,
  params?: {
    limit?: number;
    offset?: number;
    sort?: string;
    order?: "asc" | "desc";
  }
) {
  return fetchFromApi(`/application-process/${programmeId}`, params);
}

//HANDLE CURRICULUM
//fetch curriculum
export async function getCurriculum(
  programmeId: string,
  params?: {
    limit?: number;
    offset?: number;
    sort?: string;
    order?: "asc" | "desc";
  }
) {
  return fetchFromApi(`/curriculum/${programmeId}`, params);
}

//HANDLE SCHEDULES
//fetch schedules
export async function getSchedules(
  programmeId: string,
  params?: {
    limit?: number;
    offset?: number;
    sort?: string;
    order?: "asc" | "desc";
  }
) {
  return fetchFromApi(`/schedules/${programmeId}`, params);
}

//HANDLE POLICIES
//fetch policies
export async function getPolicies(params?: {
  category?: string;
  limit?: number;
  offset?: number;
  sort?: string;
  order?: "asc" | "desc";
}) {
  return fetchFromApi("/policies", params);
}

//HANDLE LOCATIONS
//fetch locations
export async function getLocations(params?: {
  type?: string;
  city?: string;
  province?: string;
  limit?: number;
  offset?: number;
}) {
  return fetchFromApi("/locations", params);
}

//HANDLE PARTNERS
//fetch partners
export async function getPartners(params?: {
  limit?: number;
  offset?: number;
}) {
  return fetchFromApi("/partners", params);
}

//HANDLE OVERVIEW
//fetching overview
export async function getOverview(params?: {
  scope?: "mlab" | "codetribe";
  limit?: number;
  offset?: number;
}) {
  return fetchFromApi("/overview", params);
}

//HANDLE FINANCES
//fetch finance
export async function getFinancialBreakdown(
  programmeId: string,
  params?: {
    limit?: number;
    offset?: number;
  }
) {
  return fetchFromApi(`/financial-breakdown/${programmeId}`, params);
}

//MATCH MESSAGE TO DATA
export async function fetchRelevantData(userMessage: string, programmeId?: string) {
  const message = userMessage.toLowerCase();
  const relevantData: Record<string, any> = {};
  const defaultProgrammeId = programmeId || "c76a6628-455f-4afa-9fba-6125f6ff7c40";  //falling back to code - for testing

  //Try FAQs 
  try {
    const faqKeywords = ["faq", "question", "answer", "what", "how", "when", "where", "why"];
    if (faqKeywords.some(keyword => message.includes(keyword))) {
      try {
        const faqs = await getFAQs({ scope: "codetribe", limit: 20 });
        relevantData.faqs = faqs.data;
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      }
    }

    // Check for eligibility-related queries
    const eligibilityKeywords = ["eligible", "eligibility", "qualification", "requirement", "age", "citizenship", "qualify"];
    if (eligibilityKeywords.some(keyword => message.includes(keyword))) {
      try {
        const eligibility = await getEligibility(defaultProgrammeId, { limit: 50 });
        relevantData.eligibility = eligibility.data;
      } catch (error) {
        console.error("Error fetching eligibility:", error);
      }
    }

    // Check for application-related queries
    const applicationKeywords = ["apply", "application", "process", "step", "register", "tshepo", "bootcamp", "document"];
    if (applicationKeywords.some(keyword => message.includes(keyword))) {
      try {
        const applicationProcess = await getApplicationProcess(defaultProgrammeId, { limit: 50 });
        relevantData.applicationProcess = applicationProcess.data;
      } catch (error) {
        console.error("Error fetching application process:", error);
      }
    }

    // Check for curriculum-related queries
    const curriculumKeywords = ["curriculum", "course", "module", "learn", "teach", "study", "topic", "subject", "mobile", "web", "cloud", "scrum"];
    if (curriculumKeywords.some(keyword => message.includes(keyword))) {
      try {
        const curriculum = await getCurriculum(defaultProgrammeId, { limit: 50 });
        relevantData.curriculum = curriculum.data;
      } catch (error) {
        console.error("Error fetching curriculum:", error);
      }
    }

    // Check for schedule-related queries
    const scheduleKeywords = ["schedule", "time", "hour", "day", "class", "when", "date", "bootcamp", "graduation"];
    if (scheduleKeywords.some(keyword => message.includes(keyword))) {
      try {
        const schedules = await getSchedules(defaultProgrammeId, { limit: 50 });
        relevantData.schedules = schedules.data;
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    }

    // Check for financial-related queries
    const financialKeywords = ["cost", "price", "fee", "stipend", "financial", "money", "payment", "free", "subsidy"];
    if (financialKeywords.some(keyword => message.includes(keyword))) {
      try {
        const financial = await getFinancialBreakdown(defaultProgrammeId, { limit: 50 });
        relevantData.financialBreakdown = financial.data;
      } catch (error) {
        console.error("Error fetching financial breakdown:", error);
      }
    }

    // Check for policy-related queries
    const policyKeywords = ["policy", "rule", "conduct", "attendance", "assessment", "equipment", "internet"];
    if (policyKeywords.some(keyword => message.includes(keyword))) {
      try {
        const policies = await getPolicies({ limit: 50 });
        relevantData.policies = policies.data;
      } catch (error) {
        console.error("Error fetching policies:", error);
      }
    }

    // Check for location-related queries
    const locationKeywords = ["location", "where", "address", "city", "province", "office", "headquarters"];
    if (locationKeywords.some(keyword => message.includes(keyword))) {
      try {
        const locations = await getLocations({ limit: 50 });
        relevantData.locations = locations.data;
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    }

    // Check for partner-related queries
    const partnerKeywords = ["partner", "sponsor", "collaboration"];
    if (partnerKeywords.some(keyword => message.includes(keyword))) {
      try {
        const partners = await getPartners({ limit: 50 });
        relevantData.partners = partners.data;
      } catch (error) {
        console.error("Error fetching partners:", error);
      }
    }

    // Check for programme/overview queries
    const programmeKeywords = ["programme", "program", "overview", "about", "codetribe", "mlab"];
    if (programmeKeywords.some(keyword => message.includes(keyword)) || Object.keys(relevantData).length === 0) {
      try {
        const programmes = await getProgrammes({ scope: "codetribe", limit: 10 });
        relevantData.programmes = programmes.data;
        
        const overview = await getOverview({ scope: "codetribe", limit: 10 });
        relevantData.overview = overview.data;
      } catch (error) {
        console.error("Error fetching programmes/overview:", error);
      }
    }

    // If no specific data was found, try searching FAQs
    if (Object.keys(relevantData).length === 0 || !relevantData.faqs) {
      try {
        const searchResults = await searchFAQs(userMessage, { scope: "codetribe", limit: 10 });
        if (searchResults.data.length > 0) {
          relevantData.faqs = searchResults.data;
        }
      } catch (error) {
        console.error("Error searching FAQs:", error);
      }
    }

    return relevantData;
  } catch (error) {
    console.error("Error in fetchRelevantData:", error);
    // Return matched fuctions
    return relevantData; 
  }
}

//Get all the data
export async function fetchAllData(programmeId?: string) {
  const defaultProgrammeId = programmeId || "c76a6628-455f-4afa-9fba-6125f6ff7c40";
  
  try {
    const [
      programmes,
      faqs,
      eligibility,
      applicationProcess,
      curriculum,
      schedules,
      policies,
      locations,
      partners,
      overview,
      financialBreakdown,
    ] = await Promise.allSettled([
      getProgrammes(),
      getFAQs(),
      getEligibility(defaultProgrammeId, { limit: 50 }),
      getApplicationProcess(defaultProgrammeId, { limit: 50 }),
      getCurriculum(defaultProgrammeId, { limit: 50 }),
      getSchedules(defaultProgrammeId, { limit: 50 }),
      getPolicies({ limit: 50 }),
      getLocations({ limit: 50 }),
      getPartners({ limit: 50 }),
      getOverview({ scope: "codetribe", limit: 10 }),
      getFinancialBreakdown(defaultProgrammeId, { limit: 50 }),
    ]);

    return {
      programmes: programmes.status === "fulfilled" ? programmes.value.data : [],
      faqs: faqs.status === "fulfilled" ? faqs.value.data : [],
      eligibility: eligibility.status === "fulfilled" ? eligibility.value.data : [],
      applicationProcess: applicationProcess.status === "fulfilled" ? applicationProcess.value.data : [],
      curriculum: curriculum.status === "fulfilled" ? curriculum.value.data : [],
      schedules: schedules.status === "fulfilled" ? schedules.value.data : [],
      policies: policies.status === "fulfilled" ? policies.value.data : [],
      locations: locations.status === "fulfilled" ? locations.value.data : [],
      partners: partners.status === "fulfilled" ? partners.value.data : [],
      overview: overview.status === "fulfilled" ? overview.value.data : [],
      financialBreakdown: financialBreakdown.status === "fulfilled" ? financialBreakdown.value.data : [],
    };
  } catch (error) {
    console.error("Error fetching all data:", error);
    return {};
  }
}

