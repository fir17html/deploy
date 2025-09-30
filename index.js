import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// Endpoint validasi
app.post("/validate", async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ valid: false });

  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/fir17html/private/main/tokens.json",
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          "User-Agent": "token-validator",
        },
      }
    );

    if (!response.ok) throw new Error("Gagal ambil token list");

    const json = await response.json();
    const isValid = Array.isArray(json.tokens) && json.tokens.includes(token);

    res.json({ valid: isValid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server jalan di port ${PORT}`));
