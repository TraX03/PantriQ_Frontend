const fetchFromApi = async (endpoint: string, data?: any): Promise<any> => {
  try {
    const res = await fetch(`${FastApi_Config.BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`API Error ${res.status}: ${errorText}`);
    }

    return await res.json();
  } catch (err) {
    console.error(`Request to ${endpoint} failed:`, err);
    throw err;
  }
};

export const fetchColdstartRecommendations = (userId: string) =>
  fetchFromApi(`/onboarding/coldstart/${userId}`);

export const fetchHomeFeedRecommendations = (userId: string) =>
  fetchFromApi(`/recommendation/homeFeed/${userId}`);

export const logUserView = (
  userId: string,
  itemId: string,
  source = "homeFeed"
) =>
  fetchFromApi("/interactions/logView", {
    user_id: userId,
    item_id: itemId,
    source,
  });
