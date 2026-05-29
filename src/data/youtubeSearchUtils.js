/** @param {string} query URL-encoded search terms (e.g. Class+6+Fractions) */
export function youtubeSearchUrl(query) {
  return `https://www.youtube.com/results?search_query=${query}`
}
