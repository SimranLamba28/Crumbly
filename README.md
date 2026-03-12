<div align="center">

#  Crumbly

**Discover, cook, and create — your personal recipe space.**

[![Next.js](https://img.shields.io/badge/Next.js_15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

[Live Demo](https://crumbly-app.vercel.app) · [Report Bug](https://github.com/SimranLamba28/crumbly/issues)

</div>

---

## 📖 About

Crumbly is a full-stack recipe discovery and management app. Search thousands of recipes by name or ingredient via the Spoonacular API, save your favourites to MongoDB, export any recipe as a formatted PDF or JPEG, and build your own private collection — complete with Cloudinary image uploads. An integrated AI cooking assistant (powered by OpenRouter) answers context-aware questions as you cook.

---


##  Features

| Feature | Description |
|---|---|
| 🔐 **Google Auth** | Seamless sign-in via NextAuth with Google OAuth |
| 🔍 **Smart Search** | Search recipes by name or ingredient using the Spoonacular API |
| ❤️ **Favourites** | Save and revisit your favourite recipes across sessions |
| 📄 **Export Recipes** | Download any recipe as a formatted **PDF** or **JPEG** |
| 🤖 **AI Cooking Assistant** | Context-aware cooking tips and Q&A via OpenRouter |
| 🍳 **Personal Recipes** | Create, manage, and store your own private recipes |
| ☁️ **Cloud Image Uploads** | Recipe images stored securely via Cloudinary |
| 📱 **Responsive Design** | Mobile-first layout built with React Bootstrap |

---

##  Tech Stack

### Frontend
- **Next.js 15** (App Router)
- **React 19**
- **React Bootstrap 2** + custom CSS
- **React Icons**, **React Markdown**
- **html2canvas** + **jsPDF** — client-side recipe export

### Backend & APIs
- **NextAuth 4** — Google OAuth provider
- **MongoDB + Mongoose** — user, recipe, and favourites data
- **Cloudinary** — image upload and hosting
- **Spoonacular API** — recipe search and data
- **OpenRouter API** — AI assistant completions

### Infrastructure
- **Vercel** — deployment and analytics

---

## 📂 Project Structure

```
crumbly/
├── public/
│   └── images/                   # Static assets
└── src/
    ├── app/
    │   ├── page.js                # Home / Search
    │   ├── favourites/            # Saved recipes page
    │   ├── your-recipes/          # User's personal recipes
    │   ├── add/                   # Add new recipe
    │   └── api/
    │       ├── auth/[...nextauth] # Authentication
    │       ├── spoonacular/       # Recipe search proxy
    │       ├── recipes/           # CRUD for personal recipes
    │       ├── favorites/         # Favourites management
    │       └── ai/                # AI assistant endpoint
    ├── components/
    │   ├── AIChatBox/             # Chat UI (input, bubbles, typing indicator)
    │   ├── Navbar/
    │   ├── Recipe/                # Cards, modals, forms, action buttons
    │   ├── RecipeExport/          # Export dialog + printable template
    │   └── Footer.jsx
    ├── hooks/                     # Custom React hooks
    ├── lib/                       # Utilities & helpers
    ├── models/                    # Mongoose schemas
    └── styles/                    # Component & global CSS
```

---

## 🚀 Running Locally

```bash
git clone https://github.com/SimranLamba28/crumbly.git
cd crumbly
npm install
```

> Requires a `.env.local` file with the following keys:

```env
NEXTAUTH_URL=
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
MONGODB_URI=
SPOONACULAR_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
OPENROUTER_API_KEY=
```
---

## 🧑‍💻 Author

**Simran Lamba** — Frontend Developer

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/simranlamba28)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/SimranLamba28)

