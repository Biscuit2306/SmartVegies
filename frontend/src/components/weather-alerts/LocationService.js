export async function fetchApproxLocationByIp() {
  // Try multiple free IP-based providers for robustness.
  const providers = [
    async () => {
      const res = await fetch("https://ipwho.is/");
      if (!res.ok) throw new Error("ipwho.is failed");
      const data = await res.json();
      if (!data?.success || typeof data?.latitude !== "number" || typeof data?.longitude !== "number") {
        throw new Error("ipwho.is invalid response");
      }
      return {
        lat: data.latitude,
        lon: data.longitude,
        city: data.city || "",
        country: data.country || "",
      };
    },
    async () => {
      const res = await fetch("https://ipapi.co/json/");
      if (!res.ok) throw new Error("ipapi.co failed");
      const data = await res.json();
      if (typeof data?.latitude !== "number" || typeof data?.longitude !== "number") {
        throw new Error("ipapi.co invalid response");
      }
      return {
        lat: data.latitude,
        lon: data.longitude,
        city: data.city || "",
        country: data.country || "",
      };
    },
  ];

  let lastError;
  for (const provider of providers) {
    try {
      const loc = await provider();
      return {
        ...loc,
        accuracy: "approximate",
      };
    } catch (err) {
      lastError = err;
    }
  }

  throw new Error(
    lastError?.message || "Unable to detect approximate location"
  );
}

