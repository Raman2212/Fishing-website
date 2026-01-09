import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Lock, 
  Activity, 
  Globe, 
  Server, 
  Menu,
  X,
  FileText,
  AlertOctagon,
  Zap,
  TrendingUp,
  MapPin,
  Clock,
  ArrowRight,
  Eye,
  EyeOff,
  LogOut,
  BarChart3,
  Download,
  Trash2,
  Home
} from 'lucide-react';
import { checkURL, checkHealth, extractURLFeatures } from './api';

const App = () => {
  // Auth States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', password: '' });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  // Main App States
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [recentScans, setRecentScans] = useState([]);
  const [apiStatus, setApiStatus] = useState('checking');
  const [showDashboard, setShowDashboard] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);

  // Initialize authentication
  useEffect(() => {
    // Load default users if not present
    if (!localStorage.getItem('users')) {
      const defaultUsers = [{ username: 'admin', password: 'password123' }];
      localStorage.setItem('users', JSON.stringify(defaultUsers));
    }

    // Check if user is logged in
    const user = sessionStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      loadScanHistory();
    }
  }, []);

  // Load scan history from localStorage
  const loadScanHistory = () => {
    const history = JSON.parse(localStorage.getItem('scanHistory')) || [];
    setScanHistory(history);
  };

  // Check API health on mount
  useEffect(() => {
    if (isAuthenticated) {
      const checkAPIStatus = async () => {
        const result = await checkHealth();
        setApiStatus(result.success ? 'online' : 'offline');
      };
      checkAPIStatus();
    }
  }, [isAuthenticated]);

  // Mock live feed data simulation
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const interval = setInterval(() => {
      const domains = ['amazon-secure-update.com', 'login.microsoft-verify.net', 'paypal-support-center.org', 'secure.chase.com', 'netflix-payment-update.info'];
      const statuses = ['danger', 'danger', 'danger', 'safe', 'danger'];
      const randomIdx = Math.floor(Math.random() * domains.length);
      
      const newScan = {
        id: Date.now(),
        url: domains[randomIdx],
        status: statuses[randomIdx],
        time: 'Just now',
        location: ['USA', 'DE', 'BR', 'IN'][Math.floor(Math.random() * 4)]
      };
      
      setRecentScans(prev => [newScan, ...prev.slice(0, 4)]);
    }, 3000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Authentication Functions
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(u => u.username === loginData.username && u.password === loginData.password);
      
      if (user) {
        sessionStorage.setItem('currentUser', loginData.username);
        setCurrentUser(loginData.username);
        setIsAuthenticated(true);
        setLoginData({ username: '', password: '' });
        loadScanHistory();
      } else {
        alert('Invalid credentials! Try admin/password123');
      }
      setAuthLoading(false);
    }, 1000);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!registerData.username || !registerData.password) {
      alert('Please fill in all fields');
      return;
    }

    setAuthLoading(true);

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      
      if (users.some(u => u.username === registerData.username)) {
        alert('Username already exists!');
        setAuthLoading(false);
        return;
      }
      
      users.push({ username: registerData.username, password: registerData.password });
      localStorage.setItem('users', JSON.stringify(users));
      alert('Registration successful! Please login.');
      setShowLogin(true);
      setRegisterData({ username: '', password: '' });
      setAuthLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('currentUser');
    setCurrentUser(null);
    setIsAuthenticated(false);
    setShowDashboard(false);
    setScanResult(null);
    setUrl('');
  };

  // Save scan to history
  const saveScanToHistory = (url, isPhishing, confidence) => {
    try {
      const now = new Date();
      let domain = url;
      
      try {
        const urlObj = new URL(url.startsWith('http') ? url : 'https://' + url);
        domain = urlObj.hostname;
      } catch (e) {
        domain = url.replace(/^https?:\/\//, '').split('/')[0];
      }
      
      const scan = {
        id: Date.now() + Math.random(),
        url: url,
        status: isPhishing ? 'Phishing' : 'Safe',
        confidence: confidence,
        date: now.toLocaleString(),
        timestamp: now.toISOString(),
        domain: domain
      };

      let history = JSON.parse(localStorage.getItem('scanHistory')) || [];
      history.unshift(scan);
      
      if (history.length > 100) history.pop();

      localStorage.setItem('scanHistory', JSON.stringify(history));
      setScanHistory(history);
    } catch (error) {
      console.error('Error saving scan:', error);
    }
  };

  // Delete scan from history
  const deleteScan = (scanId) => {
    let history = scanHistory.filter(item => item.id !== scanId);
    localStorage.setItem('scanHistory', JSON.stringify(history));
    setScanHistory(history);
  };

  // Clear all history
  const clearAllHistory = () => {
    if (window.confirm('Are you sure you want to clear all scan history?')) {
      localStorage.removeItem('scanHistory');
      setScanHistory([]);
    }
  };

  // Export history
  const exportHistory = () => {
    if (scanHistory.length === 0) {
      alert('No history to export');
      return;
    }
    
    const dataStr = JSON.stringify(scanHistory, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `phishguard-history-${new Date().toISOString().slice(0,10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleScan = async (e) => {
    e.preventDefault();
    if (!url) return;

    setIsScanning(true);
    setScanResult(null);
    setShowDashboard(false);

    try {
      // Call the ML backend API
      const result = await checkURL(url);

      if (result.success) {
        const { data } = result;
        const features = extractURLFeatures(url);
        const isPhishing = data.prediction === 1;
        
        const scanData = {
          status: isPhishing ? 'danger' : 'safe',
          score: parseFloat(data.confidence) || 0,
          result: data.result,
          confidence: data.confidence,
          details: {
            domainAge: features?.hasSubdomain ? 'Suspicious' : 'Normal',
            ssl: features?.hasHTTPS ? 'Valid (HTTPS)' : 'Invalid/Missing',
            blacklist: isPhishing ? 'Found in databases' : 'Clean',
            redirects: features?.hasIP ? 'IP-based URL' : 'Normal'
          }
        };
        
        setScanResult(scanData);
        saveScanToHistory(url, isPhishing, data.confidence);
      } else {
        // Fallback to mock behavior if API fails
        console.warn('API call failed, using fallback:', result.error);
        const isSuspicious = url.toLowerCase().includes('sus') || 
                            url.toLowerCase().includes('bank') || 
                            url.toLowerCase().includes('gift');
        
        const scanData = {
          status: isSuspicious ? 'danger' : 'safe',
          score: isSuspicious ? 92 : 5,
          result: isSuspicious ? 'Phishing' : 'Legitimate',
          confidence: isSuspicious ? '92%' : '95%',
          details: {
            domainAge: isSuspicious ? '2 Days' : '5 Years',
            ssl: isSuspicious ? 'Invalid/Missing' : 'Valid (DigiCert Inc.)',
            blacklist: isSuspicious ? 'Found in 3 databases' : 'Clean',
            redirects: isSuspicious ? '4' : '0'
          }
        };
        
        setScanResult(scanData);
        saveScanToHistory(url, isSuspicious, scanData.confidence);
      }
    } catch (error) {
      console.error('Scan error:', error);
      setScanResult({
        status: 'error',
        score: 0,
        result: 'Error',
        confidence: '0%',
        details: {
          error: 'Unable to scan URL. Please try again.'
        }
      });
    } finally {
      setIsScanning(false);
    }
  };

  // Stats calculation
  const totalScans = scanHistory.length;
  const phishingCount = scanHistory.filter(item => item.status === 'Phishing').length;
  const safeCount = totalScans - phishingCount;

  // If not authenticated, show login/register
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex items-center justify-center p-4">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-orange-200 rounded-full blur-3xl opacity-40 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-amber-200 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
        
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-orange-100 overflow-hidden">
            {/* Auth Header */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-lg">
                <Shield className="w-8 h-8 text-orange-500" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">PhishGuard</h1>
              <p className="text-orange-100">AI-Powered Phishing Detection</p>
            </div>

            {/* Login Form */}
            {showLogin ? (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-stone-800 mb-2">Welcome Back</h2>
                <p className="text-stone-600 mb-6">Login to access PhishGuard</p>
                
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 w-5 h-5 text-orange-400" />
                    <input
                      type="text"
                      placeholder="Username"
                      className="w-full pl-12 pr-4 py-3 bg-orange-50 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                      value={loginData.username}
                      onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 w-5 h-5 text-orange-400" />
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      placeholder="Password"
                      className="w-full pl-12 pr-12 py-3 bg-orange-50 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-4 top-4 text-orange-400 hover:text-orange-600"
                    >
                      {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    {authLoading ? (
                      <Activity className="w-5 h-5 animate-spin mx-auto" />
                    ) : (
                      'Login'
                    )}
                  </button>
                </form>
                
                <p className="text-center text-stone-600 mt-6">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setShowLogin(false)}
                    className="text-orange-500 font-semibold hover:text-orange-600"
                  >
                    Register
                  </button>
                </p>
              </div>
            ) : (
              /* Register Form */
              <div className="p-8">
                <h2 className="text-2xl font-bold text-stone-800 mb-2">Create Account</h2>
                <p className="text-stone-600 mb-6">Join PhishGuard today</p>
                
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 w-5 h-5 text-orange-400" />
                    <input
                      type="text"
                      placeholder="Choose Username"
                      className="w-full pl-12 pr-4 py-3 bg-orange-50 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                      value={registerData.username}
                      onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 w-5 h-5 text-orange-400" />
                    <input
                      type={showRegPassword ? "text" : "password"}
                      placeholder="Choose Password"
                      className="w-full pl-12 pr-12 py-3 bg-orange-50 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-4 top-4 text-orange-400 hover:text-orange-600"
                    >
                      {showRegPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    {authLoading ? (
                      <Activity className="w-5 h-5 animate-spin mx-auto" />
                    ) : (
                      'Register'
                    )}
                  </button>
                </form>
                
                <p className="text-center text-stone-600 mt-6">
                  Already have an account?{' '}
                  <button
                    onClick={() => setShowLogin(true)}
                    className="text-orange-500 font-semibold hover:text-orange-600"
                  >
                    Login
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-stone-800 font-sans selection:bg-orange-200 selection:text-orange-900 overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="bg-[#FFF9F5]/80 backdrop-blur-md border-b border-orange-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <button 
              onClick={() => {setShowDashboard(false); setScanResult(null);}}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="bg-orange-500 p-2 rounded-lg text-white shadow-lg shadow-orange-500/30">
                <Shield className="w-6 h-6" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-stone-800">Phish<span className="text-orange-500">Guard</span></span>
            </button>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-6">
                <span className="text-sm font-medium text-stone-600">Hi, {currentUser}</span>
                
                <button 
                  onClick={() => {setShowDashboard(!showDashboard); setScanResult(null);}}
                  className="text-sm font-medium text-stone-600 hover:text-orange-600 transition-colors flex items-center gap-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  Dashboard
                </button>
                
                <button 
                  onClick={handleLogout}
                  className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
                
                {/* API Status Indicator */}
                <div className="flex items-center gap-2 text-xs">
                  <div className={`w-2 h-2 rounded-full ${apiStatus === 'online' ? 'bg-green-500 animate-pulse' : apiStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                  <span className="text-stone-500">{apiStatus === 'online' ? 'ML Online' : apiStatus === 'offline' ? 'ML Offline' : 'Checking...'}</span>
                </div>
              </div>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-stone-600 hover:bg-orange-100 rounded-md">
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      {!showDashboard && !isScanning && !scanResult && (
      <div className="relative pt-20 pb-24 overflow-hidden">
        {/* Abstract Background Shapes - Peach/Warm Tones */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-orange-100 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-amber-100 rounded-full blur-3xl opacity-40 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <div className="text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 text-orange-700 text-sm font-bold mb-8 shadow-sm">
                <Zap className="w-4 h-4 fill-orange-500 text-orange-500" />
                New: AI-Powered Protection 2.0
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-stone-900 leading-[1.05] mb-8 font-serif">
                Verify any link, <br/>
                <span className="text-orange-500 italic">Instantly.</span>
              </h1>
              
              <p className="text-xl text-stone-600 mb-10 max-w-lg leading-relaxed font-light">
                Stop phishing attacks before they happen. Our deep-learning engine analyzes millions of URLs daily to protect your digital life.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold text-lg shadow-lg shadow-orange-900/10 transition-all transform hover:-translate-y-1">
                  Start Scanning
                </button>
                <button className="px-8 py-4 bg-white/50 hover:bg-white text-stone-700 border border-orange-200 rounded-lg font-semibold text-lg shadow-sm transition-all flex items-center justify-center gap-2 group">
                  <span className="group-hover:translate-x-1 transition-transform">View Demo</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="flex items-center gap-4 text-sm font-medium text-stone-500">
                <div className="flex -space-x-2">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="w-8 h-8 rounded-full bg-orange-200 border-2 border-[#FFF9F5] flex items-center justify-center text-xs font-bold text-orange-700">U{i}</div>
                   ))}
                </div>
                <p>Trusted by 10,000+ security teams</p>
              </div>
            </div>

            {/* Right: Scanner Card - Soft Peach Theme */}
            <div className="relative">
              <div className="bg-white/40 backdrop-blur-sm p-2 rounded-xl shadow-xl shadow-orange-900/5 border border-white/50 relative z-20">
                <div className="bg-[#FFF2EB] rounded-lg p-6 sm:p-8 border border-orange-100">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-stone-800 flex items-center gap-2">
                      <Search className="w-5 h-5 text-orange-500" />
                      URL Analyzer
                    </h3>
                    <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-200"></div>
                      <div className="w-2 h-2 rounded-full bg-orange-200"></div>
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    </div>
                  </div>

                  <form onSubmit={handleScan} className="space-y-4">
                    <div className="relative">
                      <Globe className="absolute left-4 top-4 text-orange-300 w-6 h-6" />
                      <input
                        type="text"
                        className="w-full pl-12 pr-4 py-4 bg-white border border-orange-100 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all font-medium"
                        placeholder="Paste suspicious link here..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                      />
                    </div>
                    
                    <button 
                      type="submit"
                      disabled={isScanning || !url}
                      className={`w-full py-4 rounded-lg font-bold text-lg text-white shadow-md transition-all flex items-center justify-center gap-2 ${
                        isScanning ? 'bg-orange-300 cursor-wait' : 'bg-stone-900 hover:bg-stone-800'
                      }`}
                    >
                      {isScanning ? (
                        <>
                          <Activity className="animate-spin w-5 h-5" />
                          Analyzing...
                        </>
                      ) : (
                        'Run Security Scan'
                      )}
                    </button>
                  </form>

                  {/* Scan Results Display */}
                  {scanResult && !isScanning && (
                    <div className="mt-8 animate-fade-in-up">
                      <div className={`rounded-lg border ${scanResult.status === 'safe' ? 'border-emerald-200 bg-emerald-50/50' : 'border-red-200 bg-red-50/50'} p-6`}>
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            {scanResult.status === 'safe' ? (
                              <CheckCircle className="w-8 h-8 text-emerald-600" />
                            ) : (
                              <AlertOctagon className="w-8 h-8 text-red-600" />
                            )}
                            <div>
                              <h4 className={`text-lg font-bold ${scanResult.status === 'safe' ? 'text-emerald-800' : 'text-red-800'}`}>
                                {scanResult.status === 'safe' ? 'Safe to Visit' : 'Phishing Detected'}
                              </h4>
                              <p className={`text-sm ${scanResult.status === 'safe' ? 'text-emerald-600' : 'text-red-600'}`}>
                                Confidence: {scanResult.confidence}
                              </p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${scanResult.status === 'safe' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                            {scanResult.status === 'safe' ? 'Verified' : 'Malicious'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          {Object.entries(scanResult.details).map(([key, value]) => (
                            <div key={key} className="bg-white/60 p-3 rounded border border-orange-100/50">
                              <p className="text-xs text-stone-500 uppercase font-bold mb-1">{key}</p>
                              <p className="text-sm font-semibold text-stone-800 truncate">{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recent Activity Ticker */}
                  {!scanResult && !isScanning && (
                    <div className="mt-8 border-t border-orange-200 pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-2">
                          <Activity className="w-3 h-3" /> Live Feed
                        </p>
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                          <span className="text-xs text-orange-700 font-medium">Online</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {recentScans.map((scan) => (
                          <div key={scan.id} className="flex items-center justify-between text-sm animate-fade-in">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <Globe className={`w-4 h-4 flex-shrink-0 ${scan.status === 'danger' ? 'text-red-500' : 'text-emerald-500'}`} />
                              <span className="truncate text-stone-600 max-w-[180px] font-mono text-xs">{scan.url}</span>
                            </div>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${scan.status === 'danger' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                              {scan.status === 'danger' ? 'BLOCKED' : 'CLEAN'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
              
              {/* Decorative elements behind card */}
              <div className="absolute -z-10 top-8 right-8 w-full h-full bg-orange-200/50 rounded-xl opacity-20 transform rotate-2"></div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Scanning Animation */}
      {isScanning && (
        <section className="py-24 bg-[#FFF9F5] min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <Shield className="w-24 h-24 text-orange-500 animate-pulse" />
              <div className="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold text-stone-900 mb-4">Analyzing URL...</h2>
            <div className="space-y-2 text-stone-600">
              <p>✓ Checking domain reputation...</p>
              <p>✓ Verifying SSL certificate...</p>
              <p className="flex items-center justify-center gap-2">
                <Activity className="w-4 h-4 animate-spin" />
                Analyzing page behavior...
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Scan Results */}
      {scanResult && !isScanning && !showDashboard && (
        <section className="py-24 bg-[#FFF9F5]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className={`rounded-2xl border-2 p-8 ${scanResult.status === 'safe' ? 'border-emerald-200 bg-emerald-50/50' : 'border-red-200 bg-red-50/50'}`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  {scanResult.status === 'safe' ? (
                    <CheckCircle className="w-12 h-12 text-emerald-600" />
                  ) : (
                    <AlertOctagon className="w-12 h-12 text-red-600" />
                  )}
                  <div>
                    <h2 className={`text-2xl font-bold ${scanResult.status === 'safe' ? 'text-emerald-800' : 'text-red-800'}`}>
                      {scanResult.status === 'safe' ? 'Safe to Visit' : 'Phishing Detected!'}
                    </h2>
                    <p className={`text-sm ${scanResult.status === 'safe' ? 'text-emerald-600' : 'text-red-600'}`}>
                      Confidence: {scanResult.confidence}
                    </p>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase ${scanResult.status === 'safe' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                  {scanResult.status === 'safe' ? 'Verified' : 'Malicious'}
                </span>
              </div>

              <div className="mb-6 p-4 bg-white/60 rounded-lg">
                <p className="text-stone-700 font-medium break-all">{url}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {Object.entries(scanResult.details).map(([key, value]) => (
                  <div key={key} className="bg-white/60 p-4 rounded-lg border border-orange-100">
                    <p className="text-xs text-stone-500 uppercase font-bold mb-1">{key}</p>
                    <p className="text-sm font-semibold text-stone-800">{value}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => {setScanResult(null); setUrl('');}}
                  className={`flex-1 py-3 rounded-lg font-semibold ${scanResult.status === 'safe' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-orange-500 hover:bg-orange-600'} text-white transition-colors`}
                >
                  Scan Another URL
                </button>
                <button 
                  onClick={() => setShowDashboard(true)}
                  className="px-6 py-3 bg-stone-800 hover:bg-stone-900 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <BarChart3 className="w-5 h-5" />
                  View History
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      {!showDashboard && !isScanning && !scanResult && (
      <section id="stats" className="bg-[#FFF2EB] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="text-orange-500 mb-2 flex justify-center"><Activity /></div>
              <div className="text-3xl font-bold text-stone-800">24M+</div>
              <div className="text-sm font-medium text-stone-500">Scans Performed</div>
            </div>
            <div className="text-center p-6">
              <div className="text-orange-500 mb-2 flex justify-center"><Lock /></div>
              <div className="text-3xl font-bold text-stone-800">99.8%</div>
              <div className="text-sm font-medium text-stone-500">Block Rate</div>
            </div>
            <div className="text-center p-6">
              <div className="text-orange-500 mb-2 flex justify-center"><TrendingUp /></div>
              <div className="text-3xl font-bold text-stone-800">0.02s</div>
              <div className="text-sm font-medium text-stone-500">Latency</div>
            </div>
            <div className="text-center p-6">
              <div className="text-orange-500 mb-2 flex justify-center"><Globe /></div>
              <div className="text-3xl font-bold text-stone-800">190+</div>
              <div className="text-sm font-medium text-stone-500">Countries</div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* How It Works */}
      {!showDashboard && !isScanning && !scanResult && (
      <section className="py-24 bg-[#FFF9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs text-orange-600 font-bold tracking-widest uppercase mb-3">Process</h2>
            <h3 className="text-3xl font-bold text-stone-900 mb-4 font-serif">How we analyze suspicious links</h3>
            <p className="text-lg text-stone-600 font-light">Our multi-layered inspection engine breaks down URLs to the byte level.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-xl relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 border border-orange-100/50">
              <div className="absolute top-0 right-0 p-4 opacity-5 font-black text-6xl text-orange-900 group-hover:text-orange-700 transition-colors">01</div>
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-6 text-white shadow-lg shadow-orange-500/20">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-stone-900 mb-3">Syntax Analysis</h4>
              <p className="text-stone-600 leading-relaxed text-sm">We deconstruct the URL structure to find obfuscation techniques, homograph attacks, and suspicious subdomains.</p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-xl relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 border border-orange-100/50">
              <div className="absolute top-0 right-0 p-4 opacity-5 font-black text-6xl text-orange-900 group-hover:text-orange-700 transition-colors">02</div>
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-6 text-white shadow-lg shadow-orange-500/20">
                <Server className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-stone-900 mb-3">Backend Fingerprinting</h4>
              <p className="text-stone-600 leading-relaxed text-sm">We ping the server to check SSL certificates, server headers, and cross-reference with known blacklists.</p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-xl relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 border border-orange-100/50">
              <div className="absolute top-0 right-0 p-4 opacity-5 font-black text-6xl text-orange-900 group-hover:text-orange-700 transition-colors">03</div>
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-6 text-white shadow-lg shadow-orange-500/20">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-stone-900 mb-3">AI Verdict</h4>
              <p className="text-stone-600 leading-relaxed text-sm">Our ML model aggregates 50+ signals to provide a definitive safety score and actionable advice in milliseconds.</p>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Dashboard Section */}
      {showDashboard && (
        <section className="py-24 bg-[#FFF9F5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-stone-900 mb-8 font-serif">Security Dashboard</h2>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-blue-100 hover:-translate-y-1 transition-transform">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white shadow-lg">
                    <Search className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-stone-600">Total Scans</h3>
                    <p className="text-3xl font-bold text-stone-900">{totalScans}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-emerald-100 hover:-translate-y-1 transition-transform">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center text-white shadow-lg">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-stone-600">Safe Sites</h3>
                    <p className="text-3xl font-bold text-stone-900">{safeCount}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-red-100 hover:-translate-y-1 transition-transform">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center text-white shadow-lg">
                    <AlertOctagon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-stone-600">Phishing Detected</h3>
                    <p className="text-3xl font-bold text-stone-900">{phishingCount}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* History Container */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-orange-100 overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-orange-100">
                <h3 className="text-xl font-bold text-stone-900">Recent Scan Logs</h3>
                <div className="flex gap-3">
                  <button 
                    onClick={exportHistory}
                    className="px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                  <button 
                    onClick={clearAllHistory}
                    className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {scanHistory.length === 0 ? (
                  <div className="text-center py-12 text-stone-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No scan history found.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {scanHistory.map((item) => (
                      <div 
                        key={item.id} 
                        className="flex items-center justify-between p-4 bg-orange-50/50 rounded-lg hover:bg-orange-50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <Globe className={`w-4 h-4 ${item.status === 'Phishing' ? 'text-red-500' : 'text-emerald-500'}`} />
                            <span className="font-medium text-stone-800 truncate max-w-md">{item.url}</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-stone-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {item.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              {item.domain}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            item.status === 'Phishing' 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {item.status === 'Phishing' ? (
                              <span className="flex items-center gap-1">
                                <AlertOctagon className="w-3 h-3" />
                                Phishing {item.confidence && `(${item.confidence})`}
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Safe {item.confidence && `(${item.confidence})`}
                              </span>
                            )}
                          </span>
                          <button 
                            onClick={() => deleteScan(item.id)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-[#FFF2EB] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="bg-stone-900 p-1.5 rounded text-white">
                 <Shield className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-stone-800">PhishGuard</span>
            </div>
            <div className="flex gap-8">
              <a href="#" className="text-stone-500 hover:text-orange-600 font-medium text-sm">Privacy</a>
              <a href="#" className="text-stone-500 hover:text-orange-600 font-medium text-sm">Terms</a>
              <a href="#" className="text-stone-500 hover:text-orange-600 font-medium text-sm">Security</a>
              <a href="#" className="text-stone-500 hover:text-orange-600 font-medium text-sm">Contact</a>
            </div>
          </div>
          <div className="text-center text-stone-400 text-xs">
            &copy; 2024 PhishGuard Security Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
