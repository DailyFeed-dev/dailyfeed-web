export function matchesQuery(query: string, ...texts: string[]) {
  const keyword = query.trim().toLowerCase();
  return !keyword || texts.some((text) => text.toLowerCase().includes(keyword));
}
