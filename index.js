import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token } = req.body;
  if (!token) return res.status(400).json({ valid: false });

  try {
    // === KONFIGURASI ===
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // simpan di Vercel
    const REPO_OWNER = "fir17html";                // ganti sesuai username lu
    const REPO_NAME = "private";                   // repo private yg ada tokens.json
    const FILE_PATH = "tokens.json";               // nama file

    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "User-Agent": "token-validator"
      }
    });

    if (!response.ok) {
      return res.status(500).json({ error: `GitHub API error ${response.status}` });
    }

    const data = await response.json();

    // decode base64 content
    const content = Buffer.from(data.content, "base64").toString("utf-8");
    const tokens = JSON.parse(content).tokens;

    const isValid = Array.isArray(tokens) && tokens.includes(token);

    return res.json({ valid: isValid });
  } catch (err) {
    return res.status(500).json({ error: "Gagal ambil token: " + err.message });
  }
}
