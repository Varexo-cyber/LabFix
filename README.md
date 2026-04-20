# LabFix - Setup & Deployment Guide

## ✅ Wat is er klaar

- [x] Logo in navbar vergroot (h-20)
- [x] Alle sample producten verwijderd (database start leeg)
- [x] Neon SQL database schema + 8 API routes
- [x] Nodemailer voor orderbevestigingsmails
- [x] Alle pagina's gebruiken database API
- [x] Klantenportaal werkt volledig met DB
- [x] Smooth animations & transitions
- [x] Nieuw hero design met floating elements
- [x] False claims verwijderd (sterren, "10K+ producten", etc.)
- [x] GitHub + Netlify config (.gitignore, netlify.toml)

## 🚀 Volgende stappen

### 1. Database aanmaken (Neon)

1. Ga naar [neon.tech](https://neon.tech) en maak een gratis account
2. Maak een nieuw project "LabFix"
3. Kopieer de connection string
4. Plak deze in `.env.local` bij `DATABASE_URL`

### 2. Email configureren (Gmail)

1. Zet 2FA aan op je Gmail
2. Ga naar Google Account → Security → App passwords
3. Genereer een app password voor "Mail"
4. Vul in `.env.local`:
   - `SMTP_USER=jouw-email@gmail.com`
   - `SMTP_PASS=jouw-app-password`

### 3. Database initialiseren

1. Start de dev server: `npm run dev`
2. Ga naar `http://localhost:3000/geheim-admin`
3. Log in met wachtwoord: `labfix2024admin`
4. Klik op "Database Initialiseren"
5. Voeg je eerste producten toe

### 4. GitHub koppelen

1. Open GitHub Desktop
2. "Add existing repository" → kies `C:\Users\moham\CascadeProjects\LabFix`
3. Publiceer naar GitHub

### 5. Netlify deployen

1. Ga naar [netlify.com](https://netlify.com)
2. "Add new site" → "Import from GitHub"
3. Selecteer je repo
4. Bij "Build command": `npm run build`
5. Bij "Publish directory": `.next`
6. Voeg environment variables toe (DATABASE_URL, SMTP_USER, SMTP_PASS)
7. Deploy!

## 🔧 Belangrijke URLs

- Homepage: `/`
- Producten: `/products`
- Login: `/account/login`
- Registratie: `/account/register`
- Admin: `/geheim-admin`

## 📧 Email templates

Orderbevestiging wordt automatisch verstuurd bij bestelling.
Email wordt verstuurd naar de klant met bestelnummer.

## 🐛 Troubleshooting

- **Database errors**: Check of DATABASE_URL correct is
- **Email werkt niet**: Check SMTP_USER en SMTP_PASS
- **CSS kapot**: Verwijder `.next` folder en restart dev server
