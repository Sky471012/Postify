postify/
├── client/                  # React Frontend (Web Dashboard)
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── utils/
│       ├── services/        # API calls
│       └── App.jsx
├── extension/               # Chrome Extension Code
│   ├── public/
│   └── src/
│       ├── popup/           # React popup UI
│       ├── content/         # Content script (optional)
│       ├── utils/
│       └── manifest.json
├── server/                  # Backend (Express.js)
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── services/            # LinkedIn, AI integration
│   └── app.js
├── .env                     # Environment variables
├── README.md
├── package.json             # Root (can use workspaces or split npm init)
