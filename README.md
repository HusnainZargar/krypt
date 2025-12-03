# Krypt — Password Breach Checker &amp; GPU Crack-Time Estimator

Krypt is a privacy-focused cybersecurity tool that lets users:

✔ Check if their password is leaked using the HaveIBeenPwned (HIBP) API.

✔ Estimate GPU-based brute-force cracking time (RTX 4090, 3090, CPUs, etc.)

✔ Keep everything 100% client-side, ensuring no password ever touches your server

Krypt uses secure SHA-1 k-anonymity, no logging, and local GPU-speed calculations — making it one of the safest free password-intelligence tools available.

[![Live - krypt.hackwithhusnain.com](https://img.shields.io/badge/Krypt-LIVE-brightgreen?style=for-the-badge)](https://krypt.hackwithhusnain.com)

---

# 🚀 Features

## 🔐 1. Pwned Password Checker (1.2+ Billion Breached Passwords)

  - Uses SHA-1 hashing inside the browser
  - Sends ONLY the first 5 characters of the hash (k-anonymity model)
  - Your password never leaves your device
  - Powered by the official HaveIBeenPwned (HIBP) API

Displays:

  - ❌ Leaked password count
  - ⚠️ Risk levels
  - ✔️ No breach found

## ⚡ 2. GPU Brute-Force Time Estimator

Estimate how long it would take to brute-force your password using:

  - ⚙️ RTX 4090 (~300 GH/s)
  - ⚙️ RTX 3090 (~120 GH/s)
  - ⚙️ High-end CPUs
  - ⚙️ Low-end CPUs / mobile hardware

Shows:

  - Total combinations
  - Estimated time
  - Breakdown into seconds, minutes, hours, days, years
  - Fully client-side, zero connections to any server.

## 🛡️ 3. Complete Privacy

  - No password is stored
  - No logs
  - No server processing

Your password never leaves your browser, guaranteed.

---

# 🔧 Installation (Local Setup)
### 1️⃣ Clone the repository

```
git clone https://github.com/HusnainZargar/krypt.git
cd krypt
```

### 2️⃣ Open index.html in your browser

No server needed — it works 100% client-side.

### 🌐 Deployment

You can deploy Krypt on:

- ✔ Cloudflare Pages
- ✔ GitHub Pages
- ✔ Netlify
- ✔ Vercel

Just upload the folder — no backend required.

---

# 🔒 How It Works 

## HIBP Pwned-Check:

- Password is hashed with SHA-1 in your browser
- Only the first 5 SHA-1 chars are sent to HIBP
- HIBP returns a list of hashes with the same prefix
- Your browser checks if your hash suffix exists → locally
- No password or full hash ever leaves your device

## Brute-Force Estimator:

- Detects password length
- Calculates character-set size
- Computes total combinations
- Divides by GPU guessing speed
- Breaks results into human time format

All done locally.

---

# 🧪 Security Notes

- Krypt never sends full hashes or passwords
- Uses industry-standard k-anonymity
- Uses safe HTTPS-only HIBP endpoint
- All sensitive operations happen locally

---

# ❤️ Support

If you find Krypt helpful, consider:

- ⭐ Starring the repo
- 🐞 Reporting bugs
- 🛠 Suggesting features

# 📜 License

MIT License — free to use, modify, and distribute.

# ✨ Creator

Muhammad Husnain Zargar (HackWithHusnain)
Cybersecurity Researcher • Ethical Hacker • CTF Developer

🔗 https://hackwithhusnain.com
