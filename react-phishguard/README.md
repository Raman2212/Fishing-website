# PhishGuard React Application

AI-Powered Phishing Detection Platform built with React and integrated with a Machine Learning backend.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Python backend running (from infosys.ipynb)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```bash
REACT_APP_API_URL=your_ngrok_url_here
```

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## 🔐 Default Login

- **Username:** admin
- **Password:** password123

## 🎯 Features

### ✅ Authentication System
- Login and Registration
- Session management
- Password visibility toggle
- Secure logout

### ✅ URL Scanner
- Real-time phishing detection using ML model
- Confidence scores
- Detailed scan results
- API status monitoring

### ✅ Dashboard
- **Total Scans** - Track all scans performed
- **Safe Sites** - Count of legitimate URLs
- **Phishing Detected** - Count of malicious URLs
- **Scan History** - Complete log with timestamps
- **Export History** - Download as JSON
- **Clear History** - Remove all records
- **Delete Individual Scans** - Remove specific entries

### ✅ Real-time Features
- Live API status indicator
- Auto-save scan results
- Persistent login sessions
- Local storage for history

## 🔗 Backend Integration

### Setting up the ML Backend

1. Open `infosys.ipynb` in Jupyter/Colab
2. Run all cells up to "Setup FastAPI Application with ngrok"
3. Copy the ngrok public URL from the output
4. Update the `.env` file with your ngrok URL:
   ```
   REACT_APP_API_URL=https://your-ngrok-id.ngrok.io
   ```
5. Restart the React development server

### API Endpoints

The backend provides:
- `GET /` - Root endpoint
- `GET /health` - Health check
- `POST /predict` - URL phishing detection

Request format:
```json
{
  "url": "https://example.com"
}
```

Response format:
```json
{
  "url": "https://example.com",
  "prediction": 0,
  "result": "Legitimate",
  "confidence": "98.75%"
}
```

## 📁 Project Structure

```
react-phishguard/
├── public/
│   └── index.html
├── src/
│   ├── App.js          # Main React component
│   ├── index.js        # Entry point
│   ├── index.css       # Global styles with Tailwind
│   └── api.js          # API service for backend integration
├── package.json
├── tailwind.config.js
└── README.md
```

## 🎨 Features

- ✅ Real-time URL scanning with ML backend
- ✅ Beautiful peach/orange themed UI
- ✅ Live feed simulation
- ✅ API health status indicator
- ✅ Responsive design
- ✅ Smooth animations
- ✅ Detailed scan results

## 🛠️ Technologies

- **React 18** - UI framework
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Axios** - HTTP client
- **FastAPI** (Backend) - ML API
- **XGBoost** (Backend) - ML model

## 📝 Available Scripts

- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## 🔒 Security Note

The API service includes fallback behavior when the backend is unavailable. In production:
- Use proper authentication
- Implement rate limiting
- Use environment variables
- Enable CORS only for specific domains

## 📊 ML Model Details

The backend uses an XGBoost classifier trained on 48 URL features:
- Domain characteristics
- URL structure analysis
- SSL/TLS verification
- Blacklist checking
- Pattern recognition

Accuracy: ~98-99%

## 🤝 Contributing

This project is part of the Infosys internship program.

## 📄 License

Copyright © 2024 PhishGuard Security Inc.
