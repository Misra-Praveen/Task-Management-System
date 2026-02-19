// const BASE_URL = "http://localhost:5051";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;


export const api = async (
  endpoint: string,
  method = "GET",
  body?: any,
  token?: string
): Promise<any> => {
  let accessToken = token || localStorage.getItem("accessToken");

  const makeRequest = async (tokenToUse?: string) => {
    return fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(tokenToUse && {
          Authorization: `Bearer ${tokenToUse}`,
        }),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  };

  let res = await makeRequest(accessToken || undefined);

  // 🔥 If access token expired
  if (res.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      localStorage.clear();
      window.location.assign("/login");
      return;
    }

    const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!refreshRes.ok) {
      localStorage.clear();
      window.location.assign("/login");
      return;
    }

    const refreshData = await refreshRes.json();

    // Save new access token
    localStorage.setItem("accessToken", refreshData.accessToken);

    // Retry original request
    res = await makeRequest(refreshData.accessToken);
  }

  if (!res.ok) {
    throw new Error("API Error");
  }

  return res.json();
};