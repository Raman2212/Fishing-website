// API Service for PhishGuard ML Backend
import axios from 'axios';

// IMPORTANT: Replace this with your ngrok URL from the Jupyter notebook
// You'll get this URL when you run the FastAPI server cell in infosys.ipynb
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

/**
 * Check if a URL is phishing or legitimate using the ML model
 * @param {string} url - The URL to check
 * @returns {Promise<Object>} - Prediction result with confidence
 */
export const checkURL = async (url) => {
  try {
    const response = await api.post('/predict', { url });
    return {
      success: true,
      data: response.data,
      // response.data format from backend:
      // {
      //   url: string,
      //   prediction: 0 | 1,  // 0 = Legitimate, 1 = Phishing
      //   result: "Legitimate" | "Phishing",
      //   confidence: string  // e.g., "98.75%"
      // }
    };
  } catch (error) {
    console.error('Error checking URL:', error);
    return {
      success: false,
      error: error.response?.data?.detail || error.message || 'Failed to check URL',
    };
  }
};

/**
 * Check API health status
 * @returns {Promise<Object>} - Health status
 */
export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: 'API is not responding',
    };
  }
};

/**
 * Extract features from a URL (for debugging/display purposes)
 * Note: The actual feature extraction is done server-side
 * This is just for UI display purposes
 */
export const extractURLFeatures = (url) => {
  try {
    const urlObj = new URL(url);
    return {
      domain: urlObj.hostname,
      protocol: urlObj.protocol.replace(':', ''),
      hasHTTPS: urlObj.protocol === 'https:',
      length: url.length,
      hasSubdomain: urlObj.hostname.split('.').length > 2,
      hasIP: /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(urlObj.hostname),
    };
  } catch (error) {
    return null;
  }
};

export default api;
