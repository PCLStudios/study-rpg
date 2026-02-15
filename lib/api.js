const ANILIST_URL = 'https://graphql.anilist.co';

export async function fetchAnimeList(query = '', page = 1, perPage = 20) {
  const q = `query ($query: String, $page: Int, $perPage: Int) {\n  Page(page: $page, perPage: $perPage) {\n    media(search: $query, type: ANIME) {\n      id\n      title { romaji english native }\n      coverImage { large medium }\n      episodes\n      genres\n      popularity\n    }\n  }\n}`;

  const res = await fetch(ANILIST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: q, variables: { query, page, perPage } }),
  });
  const data = await res.json();
  return (data?.data?.Page?.media) || [];
}

export async function fetchAnimeDetails(id) {
  const q = `query ($id: Int) {\n  Media(id: $id, type: ANIME) {\n    id\n    title { romaji english native }\n    coverImage { large medium }\n    bannerImage\n    description(asHtml: false)\n    episodes\n    genres\n    popularity\n  }\n}`;
  const res = await fetch(ANILIST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: q, variables: { id } }),
  });
  const data = await res.json();
  return data?.data?.Media || null;
}

