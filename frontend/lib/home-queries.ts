const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://directus:8055';

export async function getFeaturedServices() {
  try {
    const res = await fetch(`${DIRECTUS_URL}/items/services?filter[is_featured][_eq]=true&limit=6`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export async function getLatestNews(limit = 6) {
  try {
    const res = await fetch(`${DIRECTUS_URL}/items/news_articles?sort=-published_at&limit=${limit}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export async function getLatestEvents(limit = 3) {
  try {
    const now = new Date().toISOString();
    const res = await fetch(`${DIRECTUS_URL}/items/events?filter[start_date][_gte]=${now}&sort=start_date&limit=${limit}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}