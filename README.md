# AI Resume Builder 🤖📄

An AI-powered resume builder that helps job seekers and freelancers create professional resumes in minutes. Fill in your details, let Google Gemini write a strong professional summary and achievement-focused experience bullets, then preview and download your resume as a PDF.

**Live Demo:** https://ai-resume-builder-theta-sand.vercel.app/

> Replace the link above with your actual Vercel link.

---

## 📌 The Problem

Many people know their experience well but struggle to describe it in a way that impresses recruiters. Writing a strong summary and achievement-focused bullet points takes time, and most resume templates look outdated.

## ✅ The Solution

- A simple form for personal details, skills, experience and education
- AI-generated professional summary using Google Gemini
- AI-improved experience bullet points (one click per job)
- Live A4 resume preview that updates as you type
- Three templates (Modern, Classic, Minimal), custom accent color and font
- One-click Print / Save as PDF

---

## ✨ Features

- 🤖 **Gemini AI Summary:** Generate a professional summary from your job title and skills
- ✨ **Gemini AI Bullet Improver:** Rewrite each experience's bullet points with strong action verbs
- 🎨 **Templates & Design:** Modern, Classic and Minimal layouts with color and font options
- 🧾 **Live Preview:** See the resume update in real time
- 🖨️ **Print / Save as PDF:** Export a clean resume
- 💾 **Auto-Save:** Data is stored in your browser (LocalStorage)
- 🔐 **Private API Key:** Your Gemini key is stored only in your browser

---

## 🤖 How the Gemini AI Works

This project uses the **Google Gemini API** (free tier) through the `generateContent` endpoint.

1. Get a free API key from [Google AI Studio](https://aistudio.google.com) (click **Get API key**).
2. Open the app and find the **AI Settings (Gemini)** box.
3. Paste your key and click **Save Key**.
4. Fill in your Job Title and Skills, then click **Generate Summary with AI**.
5. In the Experience section, write a few bullet points and click **✨ Improve with AI**.

**Notes:**
- The key is saved only in your browser's LocalStorage. It is never stored in the code or GitHub.
- Free tier has rate limits. If you see a "high demand" message, wait a few minutes and try again.
- Model used: `gemini-2.0-flash` (set in `js/app.js` as `GEMINI_MODEL`). You can change it there if needed.

---

## 🛠️ Tech Stack

- **HTML5** and **CSS3** (Tailwind CSS via CDN, custom styles)
- **Vanilla JavaScript** (no framework)
- **Google Gemini API** for AI text generation
- **Lucide Icons** for the icon set
- **LocalStorage** for data persistence
- **Vercel** for hosting

- 
---

## 🚀 Getting Started

1. Open the live demo link above, or clone this repository.
2. Open `index.html` in a modern browser.
3. Add your free Gemini API key in the AI Settings box.
4. Fill in your details and start building.

---

## 🔭 Future Improvements

- Secure backend (Vercel serverless function) to hide the API key
- Cover letter generator
- Job description matching (ATS score)
- PDF download with one click (without print dialog)

---

## 👨‍💻 Author

**Daniyal Dynihmind**
Vibe Coder and Full-Stack Builder | Karachi, Pakistan

- GitHub: [@Daniyal-Dynihmind](https://github.com/Daniyal-Dynihmind)
- Open for freelance and client projects

If you like this project, give it a ⭐ on GitHub!

---

## 📂 Project Structure
