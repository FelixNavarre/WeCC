// Stockage des votes : Supabase si configuré, sinon localStorage (démo locale).
// Un vote = { name, ranking: [id du lieu préféré, ..., id du moins aimé] }

const Store = (() => {
  const remote = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
  const endpoint = `${SUPABASE_URL}/rest/v1/votes`;
  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
  };
  const LOCAL_KEY = "wecc-votes";

  function readLocal() {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_KEY)) || [];
    } catch {
      return [];
    }
  }

  async function list() {
    if (!remote) return readLocal();
    const res = await fetch(`${endpoint}?select=name,ranking`, { headers });
    if (!res.ok) throw new Error(`Lecture des votes impossible (${res.status})`);
    return res.json();
  }

  async function save(name, ranking) {
    if (!remote) {
      const votes = readLocal().filter((v) => v.name !== name);
      votes.push({ name, ranking });
      localStorage.setItem(LOCAL_KEY, JSON.stringify(votes));
      return;
    }
    const res = await fetch(`${endpoint}?on_conflict=name`, {
      method: "POST",
      headers: { ...headers, Prefer: "resolution=merge-duplicates" },
      body: JSON.stringify({ name, ranking, updated_at: new Date().toISOString() }),
    });
    if (!res.ok) throw new Error(`Enregistrement du vote impossible (${res.status})`);
  }

  return { remote, list, save };
})();
