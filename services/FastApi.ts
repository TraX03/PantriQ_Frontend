const fetchFromApi = async (endpoint: string): Promise<any> => {
  try {
    const res = await fetch(`${FastApi_Config.BASE_URL}${endpoint}`, {
      method: "POST",
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

export const fetchColdStartRecommendations = (userId: string) =>
  fetchFromApi(`/coldstart/${userId}`);

export const fetchHomeFeedRecommendations = (userId: string) =>
  fetchFromApi(`/homeFeed/${userId}`);
