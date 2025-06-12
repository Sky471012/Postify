# 🚀 Postify

**Postify** is a Chrome extension-based fullstack application that enhances your LinkedIn posting experience. It helps users generate high-quality LinkedIn post content using natural language prompts, with a seamless interface and integration.

---

## 🔧 Features

### ✅ Chrome Extension
- Injects a **custom text area** in LinkedIn's post creation section.
- Lets users describe the **topic of the post** in natural language.
- Uses **GROQ AI** to generate a professional LinkedIn post.
- Adds **Bold** and **Italic** formatting buttons for rich-text customization.

### 🌐 Fullstack Web Application
- **Landing Page** with Login via LinkedIn OAuth.
- **Dashboard** showing previously generated posts by the user.
- Fully authenticated and personalized experience.

---

## 🗂️ Project Structure

```bash
postify/
├── client/            # Frontend (React)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json

├── extension/         # Chrome Extension
│   ├── public/
│   ├── src/
│   │   ├── App.css
│   │   ├── content/
│   │   ├── Content.js
│   │   └── Popup.jsx
│   ├── manifest.json
│   ├── Background.js
│   └── package.json

├── server/            # Backend (Node.js + Express + MongoDB)
│   ├── controller/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── services/
│   ├── app.js
│   ├── prompt.js
│   ├── db.js
│   └── package.json

├── README.md
```

---

## 🧠 Tech Stack

- **Frontend**: React, JSX, CSS
- **Extension**: JavaScript, Chrome Extension APIs
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: LinkedIn OAuth 2.0
- **AI Integration**: GROQ (for post generation)

---

## 🚀 Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/your-username/postify.git
cd postify
```

### 2. Install dependencies

#### For client:
```bash
cd client
npm install
```

#### For extension:
```bash
cd ../extension
npm install
```

#### For server:
```bash
cd ../server
npm install
```

### 3. Start development servers

- Run client:
  ```bash
  npm run dev
  ```
- Run server:
  ```bash
  npm start
  ```

### 4. Load extension in Chrome

1. Open `chrome://extensions/`
2. Enable **Developer Mode**
3. Click **Load Unpacked**
4. Select the `extension/` directory

---
