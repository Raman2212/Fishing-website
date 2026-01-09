# PhishGuard React - Setup Instructions

## 🚀 Quick Start Guide

### Prerequisites
- Node.js installed
- ML Backend running (from infosys.ipynb)

### Step 1: Navigate to Project
```powershell
cd "c:\Users\Raman\Desktop\infosys internship\react-phishguard"
```

### Step 2: Install Dependencies (if not done already)
```powershell
npm install
```

### Step 3: Configure API URL

Create a `.env` file in the project root:
```
REACT_APP_API_URL=your_ngrok_url_here
```

**To get your ngrok URL:**
1. Open `infosys.ipynb` in Jupyter/Google Colab
2. Run all cells until "Setup FastAPI Application with ngrok"
3. Copy the public URL from the output (e.g., `https://abc123.ngrok.io`)
4. Paste it in the `.env` file

Example `.env`:
```
REACT_APP_API_URL=https://abc123.ngrok.io
```

### Step 4: Start the React App
```powershell
npm start
```

The app will open at `http://localhost:3000`

## 🔐 Default Login Credentials

**Username:** admin  
**Password:** password123

## ✨ Features Implemented

### Authentication
- ✅ Login/Register functionality
- ✅ Session management
- ✅ User storage in localStorage
- ✅ Password visibility toggle
- ✅ Logout functionality

### Dashboard
- ✅ Total scans counter
- ✅ Safe sites counter  
- ✅ Phishing detected counter
- ✅ Scan history list with timestamps
- ✅ Export history to JSON
- ✅ Clear all history
- ✅ Delete individual scans

### Scanner
- ✅ Real-time ML predictions via API
- ✅ Fallback mode when API is offline
- ✅ Detailed scan results
- ✅ Confidence scores
- ✅ API status indicator

### Navigation
- Removed: Platform, Solutions, Live Map, Login, Get Protected
- Added: Dashboard button, Logout button, User greeting

## 📱 How to Use

1. **Login** with the default credentials or register a new account
2. **Scan URLs** by entering them in the input field
3. View **detailed results** with confidence scores
4. Check your **Dashboard** to see scan history
5. **Export** your history or **clear** it as needed

## 🔧 Troubleshooting

### API Connection Issues
- Ensure the ML backend is running in Jupyter notebook
- Check that the ngrok URL in `.env` is current (it changes each time)
- Look for the API status indicator in the navigation bar

### Login Not Working
- Default user is `admin` / `password123`
- If you registered a new user, make sure credentials are correct
- Check browser console for errors

### Scan Not Saving to History
- Check browser localStorage is enabled
- Verify scan completed successfully
- Check browser console for errors

## 📊 Data Storage

All data is stored locally in the browser:
- **Users**: `localStorage.getItem('users')`
- **Scan History**: `localStorage.getItem('scanHistory')`
- **Current Session**: `sessionStorage.getItem('currentUser')`

## 🎨 UI Highlights

- Beautiful peach/orange color theme
- Smooth animations and transitions
- Responsive design for mobile/desktop
- Glass morphism effects
- Real-time API status indicator

## 🔄 Updating API URL

If your ngrok URL expires, update the `.env` file:
1. Stop the React server (Ctrl+C)
2. Update `REACT_APP_API_URL` in `.env`
3. Restart: `npm start`

---

**Enjoy using PhishGuard!** 🛡️
