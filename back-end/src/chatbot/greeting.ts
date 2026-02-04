export function getGreetingMessage() {
  return {
    message: "👋 Hello! Welcome to the mLab Virtual Assistant.",
    options: [
      { key: "programmes", label: "📚 Programmes" },
      { key: "applications", label: "📝 Applications" },
      { key: "eligibility", label: "✅ Eligibility" },
      { key: "locations", label: "📍 Locations" },
      { key: "events", label: "📅 Events" }
    ]
  };
}
