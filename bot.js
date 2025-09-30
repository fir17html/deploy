import fetch from "node-fetch";

class TokenValidator {
  #endpoint;

  constructor(endpoint) {
    this.#endpoint = endpoint;
  }

  async validate(token) {
    try {
      const res = await fetch(this.#endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      return json.valid === true;
    } catch (err) {
      console.error("❌ Error validasi:", err.message);
      return false;
    }
  }
}

// === CONFIG ===
const API_VALIDATE = "https://your-app.up.railway.app/validate"; // ganti setelah deploy
const BOT_TOKEN = process.env.BOT_TOKEN;

(async () => {
  const validator = new TokenValidator(API_VALIDATE);
  const isValid = await validator.validate(BOT_TOKEN);

  if (isValid) {
    console.log("✅ Token valid → lanjut jalanin bot");
    // taruh logic bot lu di sini
  } else {
    console.error("❌ Token tidak valid → program dihentikan");
    process.exit(1);
  }
})();
