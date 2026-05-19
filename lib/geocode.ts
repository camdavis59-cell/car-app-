export async function geocode(query: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + " Miami FL")}&format=json&limit=1`;
    const res = await fetch(url, { headers: { "Accept-Language": "en", "User-Agent": "Drive59App/1.0" } });
    const data = await res.json();
    if (!data.length) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}
