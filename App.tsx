import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Menu, X, Globe, User as UserIcon, LogOut, Camera, ShoppingBag, 
  BarChart2, Activity, Shirt, CheckCircle, Lock, MessageCircle, Heart, 
  Send, Baby, Ruler, Layers, DollarSign, Users, Briefcase, Smartphone,
  Moon, Sun, TrendingUp, AlertCircle, Shield, Code, ChevronRight,
  Trash2, Edit2, Plus, RefreshCw, Star, Mail, ArrowRight, Zap, PieChart,
  UserPlus, Upload, Image as ImageIcon, Award, Gift, Ticket, XCircle, Save,
  Maximize, RotateCw, Monitor
} from 'lucide-react';
import { translations } from './translations';
import { 
  User, Company, Product, ScanRecord, Role, Language, 
  FitPreference, Gender, SizeLabel, Measurements, LogEntry, Post, Coupon
} from './types';
import { FitMirrorLogo } from './FitMirrorLogo';
import { ScanningIllustration } from './ScanningIllustration';

// --- Constants & Mock Data ---

const JAS_LOGO = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MDAgNTAwIiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjogI0FFQ0ZFMDsiPgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNBRUNGRTAiIC8+CiAgPHRleHQgeD0iNTAlIiB5PSI0NSUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LWZhbWlseT0iR2VvcmdpYSwgJ1RpbWVzIE5ldyBSb21hbicsIHNlcmlmIiBmb250LXdlaWdodD0iMTAwIiBmb250LXNpemU9IjE4MCIgbGV0dGVyLXNwYWNpbmc9IjEwIj5KQVM8L3RleHQ+CiAgPHRleHQgeD0iNTAlIiB5PSI2NSUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LWZhbWlseT0iR2VvcmdpYSwgJ1RpbWVzIE5ldyBSb21hbicsIHNlcmlmIiBmb250LXdlaWdodD0iMTAwIiBmb250LXNpemU9IjQwIiBsZXR0ZXItc3BhY2luZz0iMjAiPktVV0FJVDwvdGV4dD4KPC9zdmc+`;

const AZIRAF_LOGO = 'https://i.imgur.com/WqE6mz3.jpeg';

const MOCK_USERS: User[] = [
  { id: 'u1', username: 'admin', password: 'password', role: 'admin', status: 'active', name: 'System Administrator' },
  { id: 'u2', username: 'jaskuwait', password: 'password', role: 'partner', status: 'active', name: 'JAS Manager', companyId: 'c1' },
  { id: 'u3', username: 'user', password: 'password', role: 'customer', status: 'active', name: 'ZAHRAA', preferences: { gender: 'female', fit: 'regular', isPregnant: false }, coupons: [] },
  { id: 'u4', username: 'aziraf', password: 'password', role: 'partner', status: 'active', name: 'Aziraf Manager', companyId: 'c2' },
];

const MOCK_COMPANIES: Company[] = [
  { id: 'c1', name: 'JAS KUWAIT', logo: JAS_LOGO, status: 'active', isSponsored: true, commissionRate: 0.650, totalMatches: 1240, productViews: 4500, communityEngagement: 320, couponsIssued: 15, couponsRedeemed: 8, tier: 'champion' },
  { id: 'c2', name: 'AZIRAF', logo: AZIRAF_LOGO, status: 'active', isSponsored: false, commissionRate: 0.550, totalMatches: 850, productViews: 2100, communityEngagement: 180, couponsIssued: 5, couponsRedeemed: 1, tier: 'pro' },
];

const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', companyId: 'c1', name: 'JAS Burgundy Dress', image: 'https://i.imgur.com/HbARowb.jpeg', priceKWD: 68.0, gender: 'female', availableSizes: ['S', 'M', 'L'], isSponsored: true, stock: 10 },
  { id: 'p2', companyId: 'c1', name: 'JAS Black Gold Dress', image: 'https://i.imgur.com/mQ9xup8.jpeg', priceKWD: 120.0, gender: 'female', availableSizes: ['M', 'L', 'XL', 'XXL'], isSponsored: false, stock: 6 },
  { id: 'p3', companyId: 'c1', name: 'JAS Royal Purple', image: 'https://i.imgur.com/QwBztaY.jpeg', priceKWD: 92.5, gender: 'female', availableSizes: ['XS', 'S', 'M'], isSponsored: true, stock: 8 },
  { id: 'p4', companyId: 'c2', name: 'AZIRAF Pink Desert', image: 'https://i.imgur.com/iiUDX1F.jpeg', priceKWD: 55.0, gender: 'female', availableSizes: ['S', 'M', 'L', 'XL'], isSponsored: true, stock: 10 },
  { id: 'p5', companyId: 'c2', name: 'AZIRAF Terquoise Striped Heritage', image: 'https://i.imgur.com/vTrwA7O.jpeg', priceKWD: 52.0, gender: 'female', availableSizes: ['M'], isSponsored: false, stock: 4 },
  { id: 'p6', companyId: 'c1', name: 'JAS A R G E N T', image: 'https://i.imgur.com/emrcirI.jpeg', priceKWD: 85.5, gender: 'female', availableSizes: ['XS', 'S', 'M'], isSponsored: true, stock: 11 },
  { id: 'p7', companyId: 'c1', name: 'JAS Olive Evening Gown', image: 'https://i.imgur.com/2rmJRwZ.jpeg', priceKWD: 72.0, gender: 'female', availableSizes: ['XS', 'S', 'M'], isSponsored: true, stock: 6 },
  { id: 'p8', companyId: 'c2', name: 'AZIRAF White Sahara ', image: 'https://i.imgur.com/GIQDHUj.jpeg', priceKWD: 39.5, gender: 'female', availableSizes: ['XS', 'S', 'M'], isSponsored: true, stock: 10 },
];

const MOCK_POSTS: Post[] = [
  { id: 'post1', authorId: 'u3', authorName: 'ZAHRAAx99', content: 'El fit 7daaa khayaaaaaaal i really recommend JAS KUWAIT!.', likes: 361, comments: 54, timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: 'post2', authorId: 'guest', authorName: 'HANEEN.AL.', content: 'AZIRAF 9araa7aaa im amazed! unique & sooo comfyyy :).', likes: 296, comments: 9, timestamp: new Date(Date.now() - 86400000).toISOString() },
];

// --- Helpers ---

const getRandomInRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// New Measurement Helper Logic (Types)
type MeasurementResult = {
  heightCm: number;
  weightKg: number;
  gender: Gender;
  isPregnant: boolean;
  bmi: number;
  chest: number;
  waist: number;
  hips: number;
  shoulder: number;
  inseam: number;
  sleeve: number;
  neck?: number;
  torso?: number;
  sizeLabel: SizeLabel;
  sizeUK: string;
  sizeUS: string;
  sizeEU: string;
  notes?: string;
  timestamp: string;
  confidence: number;
};

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // remove data:image/jpeg;base64, prefix
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const computeFallbackMeasurements = (
  gender: Gender,
  heightCm: number,
  weightKg: number,
  isPregnant: boolean
): MeasurementResult => {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  // Base estimations based on height/BMI
  let chest: number;
  let waist: number;
  let hips: number;
  let shoulder: number;

  if (gender === 'female') {
    chest = heightCm * 0.52 + (bmi - 21) * 1.5;
    waist = heightCm * 0.38 + (bmi - 21) * 1.8;
    hips = heightCm * 0.56 + (bmi - 21) * 1.6;
    shoulder = heightCm * 0.24;
  } else {
    // Male
    chest = heightCm * 0.58 + (bmi - 23) * 1.5;
    waist = heightCm * 0.45 + (bmi - 23) * 1.8;
    hips = heightCm * 0.54 + (bmi - 23) * 1.2;
    shoulder = heightCm * 0.28;
  }

  // Adjust for pregnancy
  if (isPregnant && gender === 'female') {
    waist *= 1.15; // +15%
    hips *= 1.05;  // +5%
  }

  // Clamp values
  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, Math.round(v)));
  chest = clamp(chest, 60, 160);
  waist = clamp(waist, 50, 150);
  hips = clamp(hips, 60, 160);
  shoulder = clamp(shoulder, 30, 60);

  // Estimate derived
  const inseam = Math.round(heightCm * 0.45);
  const sleeve = Math.round(heightCm * 0.35);
  const neck = Math.round(heightCm * 0.22);
  const torso = Math.round(heightCm * 0.30);

  // Determine Size Label based on Chest/Waist avg
  const metric = (chest + waist + hips) / 3;
  let sizeLabel: SizeLabel = 'M';
  let sizeUS = 'M';
  let sizeUK = 'M';
  let sizeEU = '50';

  if (metric < 75) { sizeLabel = 'XS'; sizeUS = 'XS'; sizeUK = 'XS'; sizeEU = '46'; }
  else if (metric < 85) { sizeLabel = 'S'; sizeUS = 'S'; sizeUK = 'S'; sizeEU = '48'; }
  else if (metric < 95) { sizeLabel = 'M'; sizeUS = 'M'; sizeUK = 'M'; sizeEU = '50'; }
  else if (metric < 105) { sizeLabel = 'L'; sizeUS = 'L'; sizeUK = 'L'; sizeEU = '52'; }
  else if (metric < 115) { sizeLabel = 'XL'; sizeUS = 'XL'; sizeUK = 'XL'; sizeEU = '54'; }
  else { sizeLabel = 'XXL'; sizeUS = 'XXL'; sizeUK = 'XXL'; sizeEU = '56'; }

  // Female size chart adjustments
  if (gender === 'female') {
    if (sizeLabel === 'XS') { sizeEU = '34'; sizeUK = '6'; sizeUS = '2'; }
    if (sizeLabel === 'S')  { sizeEU = '36'; sizeUK = '8'; sizeUS = '4'; }
    if (sizeLabel === 'M')  { sizeEU = '38'; sizeUK = '10'; sizeUS = '6'; }
    if (sizeLabel === 'L')  { sizeEU = '40'; sizeUK = '12'; sizeUS = '8'; }
    if (sizeLabel === 'XL') { sizeEU = '42'; sizeUK = '14'; sizeUS = '10'; }
    if (sizeLabel === 'XXL'){ sizeEU = '44'; sizeUK = '16'; sizeUS = '12'; }
  }

  return {
    heightCm,
    weightKg,
    gender,
    isPregnant,
    bmi: Number(bmi.toFixed(1)),
    chest,
    waist,
    hips,
    shoulder,
    inseam,
    sleeve,
    neck,
    torso,
    sizeLabel,
    sizeUK,
    sizeUS,
    sizeEU,
    confidence: 0.85, // Fallback confidence
    timestamp: new Date().toISOString(),
    notes: "Estimated based on body metrics (Backup Mode)."
  };
};

// --- App Component ---

export default function App() {
  // State
  const [lang, setLang] = useState<Language>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  
  // Data Store (In-memory for demo persistence)
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [scanHistory, setScanHistory] = useState<ScanRecord[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([{ id: 'l1', timestamp: new Date().toISOString(), action: 'System Start', details: 'App initialized' }]);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);

  const t = translations[lang];
  const isRTL = lang === 'ar';

  // Effects
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [lang, isRTL, theme]);

  // Actions
  const addLog = (action: string, details: string) => {
    setLogs(prev => [{ id: Date.now().toString(), timestamp: new Date().toISOString(), action, details }, ...prev]);
  };

  const handleLogin = (username: string, pass: string) => {
    const found = users.find(u => u.username === username);
    if (found) {
      if (found.status === 'disabled') {
        alert("Account is disabled. Please contact admin.");
        return;
      }
      if (found.password && found.password !== pass) {
        alert("Incorrect password.");
        return;
      }
      setUser(found);
      const dashboardPage = found.role === 'admin' ? 'admin' : found.role === 'partner' ? 'partner' : 'profile';
      setCurrentPage(dashboardPage);
      addLog('User Login', `User ${username} logged in`);
      setHasEntered(true);
    } else {
      alert("Invalid user.");
    }
  };

  const handleRegister = (name: string, username: string, pass: string, email?: string, gender?: Gender) => {
    const exists = users.find(u => u.username === username);
    if (exists) {
      alert("Username already taken.");
      return;
    }
    const newUser: User = {
      id: Date.now().toString(),
      username,
      password: pass,
      role: 'customer',
      status: 'active',
      name,
      email,
      preferences: {
         gender: gender || 'female',
         fit: 'regular',
         isPregnant: false
      },
      coupons: []
    };
    setUsers(prev => [...prev, newUser]);
    addLog('User Registration', `New user registered: ${username}`);
    setUser(newUser);
    setCurrentPage('profile');
    setHasEntered(true);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
    setHasEntered(false); // Go back to entry screen on logout for demo flow
    addLog('User Logout', `User ${user?.username} logged out`);
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    addLog('Admin Action', `Deleted user ${id}`);
  };
  
  const getDashboardPage = () => {
    if (!user) return 'login';
    if (user.role === 'admin') return 'admin';
    if (user.role === 'partner') return 'partner';
    return 'profile';
  };

  const navLinkClass = (page: string) => 
    `hover:text-primary transition-colors ${currentPage === page ? 'text-primary font-bold' : 'text-slate-600 dark:text-slate-300'}`;
  
  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'ar' ? 'ar-KW' : 'en-US';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

  // --- Components ---

  const EntryPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-black flex items-center justify-center p-4">
       <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-[2rem] shadow-2xl w-full max-w-lg text-center animate-in zoom-in-95 duration-500">
         <FitMirrorLogo className="h-16 mx-auto mb-8 justify-center" />
         <h1 className="text-3xl font-black mb-2">{t.hero.title}</h1>
         <p className="text-gray-500 mb-8">{t.hero.subtitle}</p>

         <div className="space-y-4">
           <button onClick={() => { setCurrentPage('login'); setHasEntered(true); }} className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-primary-dark transition text-lg">
             {t.common.signIn}
           </button>
           <button onClick={() => { setCurrentPage('login'); setHasEntered(true); }} className="w-full py-4 bg-white dark:bg-gray-700 border-2 border-primary text-primary dark:text-white rounded-xl font-bold hover:bg-primary/5 transition text-lg">
             {t.common.signUp}
           </button>
           
           <div className="relative py-4">
             <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-600"></div></div>
             <div className="relative flex justify-center text-sm"><span className="px-2 bg-white dark:bg-gray-800 text-gray-400">{t.common.or}</span></div>
           </div>

           <button onClick={() => alert("Mock Google Login Success")} className="w-full py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-600 transition">
             <span className="text-xl">G</span> {t.common.googleLogin}
           </button>
           <button onClick={() => alert("Mock Apple Login Success")} className="w-full py-3 bg-black text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-gray-800 transition">
             <span className="text-xl"></span> {t.common.appleLogin}
           </button>

           <button onClick={() => setHasEntered(true)} className="mt-4 text-gray-400 hover:text-gray-600 text-sm font-bold underline">
             {t.common.continueGuest}
           </button>
         </div>

         <div className="mt-8 flex justify-center">
            <button onClick={() => setLang(l => l === 'en' ? 'ar' : 'en')} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary">
              <Globe size={16}/> {lang === 'en' ? 'العربية' : 'English'}
            </button>
         </div>
       </div>
    </div>
  );

  const Navbar = () => (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur shadow-sm border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div onClick={() => setCurrentPage('home')} className="cursor-pointer hover:opacity-80 transition">
          <FitMirrorLogo />
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6 font-medium text-sm">
          <button onClick={() => setCurrentPage('home')} className={navLinkClass('home')}>{t.nav.home}</button>
          <button onClick={() => setCurrentPage('scan')} className={navLinkClass('scan')}>{t.nav.scan}</button>
          <button onClick={() => setCurrentPage('stores')} className={navLinkClass('stores')}>{t.nav.stores}</button>
          <button onClick={() => setCurrentPage('pricing')} className={navLinkClass('pricing')}>{t.nav.pricing}</button>
          <button onClick={() => setCurrentPage('community')} className={navLinkClass('community')}>{t.nav.community}</button>
          <button onClick={() => setCurrentPage('about')} className={navLinkClass('about')}>{t.nav.about}</button>
          <button onClick={() => setCurrentPage('contact')} className={navLinkClass('contact')}>{t.nav.contact}</button>
          {(user?.role === 'admin' || user?.role === 'partner') && (
            <button onClick={() => setCurrentPage('api-docs')} className={navLinkClass('api-docs')}>{t.stores.apiDocs}</button>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button onClick={() => setLang(l => l === 'en' ? 'ar' : 'en')} className="p-2 font-bold text-xs flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <span className="text-lg">{lang === 'en' ? '🇰🇼' : '🇺🇸'}</span> {lang === 'en' ? 'AR' : 'EN'}
          </button>
          <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            {theme === 'light' ? <Moon size={18}/> : <Sun size={18}/>}
          </button>
          
          {user ? (
            <div className="flex items-center gap-2 ml-2">
              <button 
                onClick={() => setCurrentPage(getDashboardPage())} 
                className="hidden md:flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-lg font-bold text-sm hover:bg-primary/20 transition"
              >
                <UserIcon size={16}/> {t.nav.dashboard}
              </button>
              <button onClick={handleLogout} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg" title={t.common.signOut}>
                <LogOut size={18}/>
              </button>
            </div>
          ) : (
            <button onClick={() => setCurrentPage('login')} className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-primary-dark transition">
              {t.common.signIn}
            </button>
          )}
          
          {/* Mobile Menu Toggle */}
          <button className="lg:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X/> : <Menu/>}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 p-4 absolute w-full shadow-xl">
          <div className="flex flex-col gap-4">
            <button onClick={() => { setCurrentPage('home'); setIsMenuOpen(false); }} className={navLinkClass('home')}>{t.nav.home}</button>
            <button onClick={() => { setCurrentPage('scan'); setIsMenuOpen(false); }} className={navLinkClass('scan')}>{t.nav.scan}</button>
            <button onClick={() => { setCurrentPage('stores'); setIsMenuOpen(false); }} className={navLinkClass('stores')}>{t.nav.stores}</button>
            <button onClick={() => { setCurrentPage('pricing'); setIsMenuOpen(false); }} className={navLinkClass('pricing')}>{t.nav.pricing}</button>
            <button onClick={() => { setCurrentPage('community'); setIsMenuOpen(false); }} className={navLinkClass('community')}>{t.nav.community}</button>
            <button onClick={() => { setCurrentPage('about'); setIsMenuOpen(false); }} className={navLinkClass('about')}>{t.nav.about}</button>
            <button onClick={() => { setCurrentPage('contact'); setIsMenuOpen(false); }} className={navLinkClass('contact')}>{t.nav.contact}</button>
            {user && (
               <button onClick={() => { setCurrentPage(getDashboardPage()); setIsMenuOpen(false); }} className="text-primary font-bold">{t.nav.dashboard}</button>
            )}
            {!user && (
               <button onClick={() => { setCurrentPage('login'); setIsMenuOpen(false); }} className="text-primary font-bold">{t.common.signIn}</button>
            )}
          </div>
        </div>
      )}
    </nav>
  );

  const HomePage = () => {
    // Mock Chart Data
    const monthlyScans = [120, 180, 250, 310, 450, 600];
    
    // Sort companies for leaderboard
    const sortedCompanies = [...companies].sort((a,b) => {
       const scoreA = (a.totalMatches * 0.5) + (a.productViews * 0.1) + (a.communityEngagement * 2);
       const scoreB = (b.totalMatches * 0.5) + (b.productViews * 0.1) + (b.communityEngagement * 2);
       return scoreB - scoreA;
    }).slice(0, 3); // Top 3

    return (
      <div className="animate-in fade-in duration-500">
        {/* Hero */}
        <section className="py-24 px-4 text-center max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">{t.hero.title}</h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 mb-10 max-w-2xl mx-auto">{t.hero.subtitle}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => setCurrentPage('scan')} className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:scale-105 transition flex items-center justify-center gap-2">
              <Camera size={24} /> {t.hero.ctaScan}
            </button>
            <button onClick={() => setCurrentPage('stores')} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-slate-900 dark:text-white px-8 py-4 rounded-xl font-bold text-lg shadow-sm transition">
              {t.hero.ctaStores}
            </button>
          </div>
        </section>

        {/* Rogers Framework Flow */}
        <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-sm hover:shadow-md transition">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Activity size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">{t.hero.rogers1}</h3>
                <p className="text-gray-500 text-sm">AI vision analyzes your unique body shape in seconds.</p>
              </div>
              <div className="p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-sm hover:shadow-md transition">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">{t.hero.rogers2}</h3>
                <p className="text-gray-500 text-sm">Join 5000+ users reducing returns by up to 70%.</p>
              </div>
              <div className="p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-sm hover:shadow-md transition">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">{t.hero.rogers3}</h3>
                <p className="text-gray-500 text-sm">Get instant confidence. Shop smarter today.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Public Leaderboard */}
        <section className="py-16 max-w-7xl mx-auto px-4">
           <h2 className="text-3xl font-bold text-center mb-2">{t.hero.leaderboardTitle}</h2>
           <p className="text-center text-gray-500 mb-10">{t.hero.rankingNote}</p>
           
           <div className="grid md:grid-cols-3 gap-6">
             {sortedCompanies.map((c, i) => (
               <div key={c.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 font-black text-6xl text-gray-100 dark:text-gray-700 -z-10 group-hover:scale-110 transition">{i + 1}</div>
                  <div className="flex items-center gap-4 mb-4">
                     <img src={c.logo} className="w-16 h-16 object-contain p-2 bg-white rounded-xl shadow-sm" alt={c.name} />
                     <div>
                        <h3 className="font-bold text-lg">{c.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${i===0 ? 'bg-yellow-100 text-yellow-700' : i===1 ? 'bg-gray-100 text-gray-700' : 'bg-orange-100 text-orange-700'}`}>
                           {i===0 ? t.hero.topPartner : i===1 ? t.hero.strongPerformer : t.hero.activePartner}
                        </span>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                     <div>
                        <div className="text-xs text-gray-500 uppercase font-bold">{t.dashboard.matches}</div>
                        <div className="font-bold text-xl">{c.totalMatches}</div>
                     </div>
                     <div>
                        <div className="text-xs text-gray-500 uppercase font-bold">{t.dashboard.score}</div>
                        <div className="font-bold text-xl text-primary">{((c.totalMatches * 0.5) + (c.productViews * 0.1) + (c.communityEngagement * 2)).toFixed(0)}</div>
                     </div>
                  </div>
               </div>
             ))}
           </div>
        </section>

        {/* Featured Partners */}
        <section className="py-16 border-y border-gray-100 dark:border-gray-800">
           <div className="max-w-7xl mx-auto px-4">
             <div className="text-center mb-12">
               <span className="text-xs font-bold tracking-widest text-primary uppercase">Featured Partners</span>
               <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-1">Our Brands</h2>
             </div>
             
             <div className="grid md:grid-cols-2 gap-8">
               <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg flex items-center gap-6">
                 <div className="w-24 h-24 bg-white rounded-xl p-2 shadow-sm flex items-center justify-center">
                   <img src={JAS_LOGO} alt="JAS KUWAIT" className="max-w-full max-h-full object-contain" />
                 </div>
                 <div>
                   <h3 className="text-2xl font-black mb-1">JAS KUWAIT</h3>
                   <p className="text-slate-500 text-sm">Experience the future of fitting with our exclusive partner.</p>
                 </div>
               </div>
               
               <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg flex items-center gap-6">
                 <div className="w-24 h-24 bg-white rounded-xl p-2 shadow-sm flex items-center justify-center">
                   <img src={AZIRAF_LOGO} alt="AZIRAF" className="max-w-full max-h-full object-contain" />
                 </div>
                 <div>
                   <h3 className="text-2xl font-black mb-1">AZIRAF</h3>
                   <p className="text-slate-500 text-sm">Moroccan & Amazigh heritage fashion.</p>
                 </div>
               </div>
             </div>
           </div>
        </section>

        {/* Charts Section */}
        <section className="py-20 max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Impact Metrics</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 mb-4">Monthly Scans</h3>
              <div className="h-32 flex items-end gap-2">
                {monthlyScans.map((v, i) => (
                  <div key={i} style={{height: `${(v/600)*100}%`}} className="flex-1 bg-primary/80 rounded-t-sm"></div>
                ))}
              </div>
              <p className="mt-4 text-2xl font-black">+600 <span className="text-sm font-normal text-green-500">+12%</span></p>
            </div>
            
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
               <h3 className="text-sm font-medium text-gray-500 mb-4">Return Reduction</h3>
               <div className="relative h-32 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                 <div className="absolute top-0 left-0 h-full bg-green-500 w-[70%] flex items-center justify-center text-white font-bold text-xl">70%</div>
               </div>
               <p className="mt-4 text-sm text-gray-500">Partner stores report 70% fewer returns.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
               <h3 className="text-sm font-medium text-gray-500 mb-4">User Satisfaction</h3>
               <div className="flex items-center justify-center h-32">
                 <div className="text-center">
                   <div className="text-5xl font-black text-yellow-400 flex items-center gap-1">5.0 <Star className="fill-current" size={32}/></div>
                   <p className="text-xs text-gray-400 mt-2">Based on 1200 reviews</p>
                 </div>
               </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
               <h3 className="text-sm font-medium text-gray-500 mb-4">Partner Companies</h3>
               <div className="h-32 flex items-center justify-center">
                  <Users size={48} className="text-slate-300"/>
                  <span className="text-4xl font-black ml-4">{companies.length}</span>
               </div>
               <p className="mt-4 text-sm text-gray-500">Brands trusting FitMirror.</p>
            </div>
          </div>
        </section>
      </div>
    );
  };

  const ScanPage = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scanPhase, setScanPhase] = useState<'idle' | 'front' | 'left' | 'back' | 'right' | 'processing' | 'done'>('idle');
    const [measurementResult, setMeasurementResult] = useState<MeasurementResult | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [validationStatus, setValidationStatus] = useState<string>('');
    const [capturedFrames, setCapturedFrames] = useState<{front?: Blob, left?: Blob, back?: Blob, right?: Blob}>({});

    // Form Inputs
    const [gender, setGender] = useState<Gender>('female');
    const [height, setHeight] = useState(170);
    const [weight, setWeight] = useState(65);
    const [isPregnant, setIsPregnant] = useState(false);

    // Camera Init
    useEffect(() => {
       if (scanPhase !== 'idle' && scanPhase !== 'done' && !measurementResult) {
          navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
             .then(stream => { 
                if (videoRef.current) {
                   videoRef.current.srcObject = stream; 
                }
             })
             .catch(err => {
                console.error("Camera Error", err);
                setErrorMsg("Camera access denied.");
             });
       }
       return () => {
          if (videoRef.current && videoRef.current.srcObject) {
             const stream = videoRef.current.srcObject as MediaStream;
             stream.getTracks().forEach(track => track.stop());
          }
       };
    }, [scanPhase, measurementResult]);

    const captureFrame = async (): Promise<Blob | null> => {
       if (!videoRef.current || videoRef.current.readyState < 2) return null;
       if (videoRef.current.videoWidth === 0) return null;
       
       const canvas = document.createElement('canvas');
       canvas.width = videoRef.current.videoWidth;
       canvas.height = videoRef.current.videoHeight;
       const ctx = canvas.getContext('2d');
       if (!ctx) return null;
       
       ctx.drawImage(videoRef.current, 0, 0);
       
       return new Promise<Blob | null>((resolve) => {
         canvas.toBlob((blob) => {
           resolve(blob);
         }, 'image/jpeg', 0.85);
       });
    };

    // Helper for validation (Client-side lightweight check)
    const isFrameValidForBody = (video: HTMLVideoElement | null): boolean => {
      if (!video || video.readyState < 2 || video.videoWidth === 0) return false;
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 64; canvas.height = 64;
        const ctx = canvas.getContext('2d');
        if (!ctx) return false;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        
        // Basic check: Average brightness and variance to ensure not pitch black or flat color
        let sum = 0;
        let sqSum = 0;
        const len = data.length / 4;
        
        for(let i=0; i<len; i++) {
           const avg = (data[i*4] + data[i*4+1] + data[i*4+2]) / 3;
           sum += avg;
           sqSum += avg * avg;
        }
        
        const mean = sum / len;
        const variance = (sqSum / len) - (mean * mean);
        
        // Tunable thresholds: Mean > 15 (not too dark), Variance > 100 (has some detail/contrast)
        return mean > 15 && variance > 100;
      } catch { return true; } // Fail open if canvas issues
    };

    const runStepCapture = async (step: 'front' | 'left' | 'back' | 'right', instructionVoice: string, statusText: string) => {
        setScanPhase(step);
        speak(instructionVoice);
        setValidationStatus("Positioning..."); // User is moving
        
        const MIN_WAIT = 2500; // 2.5s minimum wait
        const start = Date.now();
        let blob: Blob | null = null;
        
        while (!blob) {
           const elapsed = Date.now() - start;
           
           // 1. Minimum Wait Period
           if (elapsed < MIN_WAIT) {
              await wait(200);
              continue;
           }
           
           // 2. Validate Frame
           setValidationStatus("Hold still..."); // Ready to capture
           const isValid = isFrameValidForBody(videoRef.current);
           
           if (isValid) {
              setValidationStatus(t.scan.status.perfect); // "Perfect! Capturing..."
              await wait(500); // Stabilization delay
              blob = await captureFrame();
           } else {
               // Feedback loop
               setValidationStatus(t.scan.status.moveBack); // "Please move back..." generic or specific
               await wait(500);
           }
           
           // Timeout Handling (15s)
           if (elapsed > 15000) {
               console.warn(`Step ${step} timed out, capturing current frame to proceed.`);
               blob = await captureFrame();
           }
        }
        return blob;
    };

    const runFitMirrorScan = async () => {
       if (!height || !weight) {
          setErrorMsg("Please enter valid height and weight.");
          return;
       }
       setErrorMsg(null);
       setIsScanning(true);
       setCapturedFrames({});

       try {
          const localFrames: any = {};
          
          // Front
          localFrames.front = await runStepCapture('front', t.scan.voice.front, t.scan.scanningFront);
          setCapturedFrames(prev => ({...prev, front: localFrames.front}));
          
          // Left
          localFrames.left = await runStepCapture('left', t.scan.voice.left, t.scan.scanningLeft);
          setCapturedFrames(prev => ({...prev, left: localFrames.left}));
          
          // Back
          localFrames.back = await runStepCapture('back', t.scan.voice.back, t.scan.scanningBack);
          setCapturedFrames(prev => ({...prev, back: localFrames.back}));
          
          // Right
          localFrames.right = await runStepCapture('right', t.scan.voice.right, t.scan.scanningRight);
          setCapturedFrames(prev => ({...prev, right: localFrames.right}));

          // Processing
          setScanPhase('processing');
          speak(t.scan.voice.processing);
          
          await perform4StepGeminiScan(localFrames);

       } catch (e) {
          console.error(e);
          // Fallback
          const fallback = computeFallbackMeasurements(gender, height, weight, isPregnant);
          setMeasurementResult(fallback);
          finalizeScan(fallback);
       }
    };

    const perform4StepGeminiScan = async (frames: {front?: Blob, left?: Blob, back?: Blob, right?: Blob}) => {
      try {
        if (!process.env.API_KEY) throw new Error("No API Key");
        
        if (!frames.front || !frames.left || !frames.back || !frames.right) {
           throw new Error("Missing frames");
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const frontB64 = await blobToBase64(frames.front);
        const leftB64 = await blobToBase64(frames.left);
        const backB64 = await blobToBase64(frames.back);
        const rightB64 = await blobToBase64(frames.right);

        const prompt = `
          You are a virtual tailor. Estimate this person's body measurements and clothing sizes.
          Inputs:
          - Gender: ${gender}
          - Height: ${height} cm
          - Weight: ${weight} kg
          - Pregnant: ${isPregnant}

          Analyze the 4 images (Front, Left, Back, Right).
          Return ONLY valid JSON:
          {
            "chest": number, "waist": number, "hips": number, "shoulder": number,
            "neck": number, "inseam": number, "sleeve": number, "torso": number,
            "arm_length": number, "bmi": number,
            "sizeLabel": "XS"|"S"|"M"|"L"|"XL"|"XXL",
            "sizeUK": string, "sizeUS": string, "sizeEU": string,
            "confidence": number, "notes": string
          }
        `;

        const parts = [
          { text: prompt },
          { inlineData: { mimeType: 'image/jpeg', data: frontB64 } },
          { inlineData: { mimeType: 'image/jpeg', data: leftB64 } },
          { inlineData: { mimeType: 'image/jpeg', data: backB64 } },
          { inlineData: { mimeType: 'image/jpeg', data: rightB64 } }
        ];

        const response = await ai.models.generateContent({
           model: 'gemini-2.5-flash',
           contents: { parts },
           config: { responseMimeType: "application/json" }
        });
        
        const text = response.text;
        const parsed = JSON.parse(text);
        
        const result: MeasurementResult = {
           heightCm: height,
           weightKg: weight,
           gender,
           isPregnant,
           bmi: parsed.bmi,
           chest: parsed.chest,
           waist: parsed.waist,
           hips: parsed.hips,
           shoulder: parsed.shoulder,
           neck: parsed.neck,
           inseam: parsed.inseam,
           sleeve: parsed.sleeve,
           torso: parsed.torso,
           sizeLabel: parsed.sizeLabel,
           sizeUK: String(parsed.sizeUK),
           sizeUS: String(parsed.sizeUS),
           sizeEU: String(parsed.sizeEU),
           confidence: parsed.confidence,
           notes: parsed.notes,
           timestamp: new Date().toISOString()
        };

        setMeasurementResult(result);
        finalizeScan(result);

      } catch (e) {
         console.warn("Gemini Scan Failed, using fallback:", e);
         const fallback = computeFallbackMeasurements(gender, height, weight, isPregnant);
         setMeasurementResult(fallback);
         finalizeScan(fallback);
      }
    };
    
    const finalizeScan = (result: MeasurementResult) => {
        setScanPhase('done');
        speak(t.scan.voice.complete);
        setIsScanning(false);

        if (user) {
           const record: ScanRecord = {
              id: Date.now().toString(),
              userId: user.id,
              date: new Date().toLocaleDateString(),
              timestamp: Date.now(),
              gender,
              isPregnant,
              measurements: {
                 chest: result.chest,
                 waist: result.waist,
                 hips: result.hips,
                 shoulder: result.shoulder,
                 height: result.heightCm,
                 inseam: result.inseam,
                 sleeve: result.sleeve,
                 neck: result.neck,
                 torso: result.torso,
                 arm_length: result.torso
              },
              sizeLabel: result.sizeLabel,
              globalSizes: {
                 eu: Number(result.sizeEU) || 0,
                 uk: Number(result.sizeUK) || 0,
                 us: Number(result.sizeUS) || 0,
                 it: Number(result.sizeEU) + 4,
                 fr: Number(result.sizeEU) + 2
              },
              confidenceScore: result.confidence * 100,
              method: result.confidence > 0.8 ? 'Gemini Vision' : 'Fallback Estimation'
           };
           setScanHistory(prev => [record, ...prev]);
        }
    }

    const resetScan = () => {
       setScanPhase('idle');
       setMeasurementResult(null);
       setCapturedFrames({});
       setErrorMsg(null);
       setValidationStatus('');
    };

    return (
       <div className="max-w-4xl mx-auto py-12 px-4">
         {!measurementResult ? (
           <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl text-center shadow-lg animate-in fade-in">
             <div className="mb-8"><ScanningIllustration className="w-64 h-64 mx-auto" /></div>
             <h2 className="text-3xl font-bold mb-4">{t.scan.title}</h2>
             <p className="text-gray-500 mb-8 max-w-lg mx-auto">{t.scan.instruction}</p>
             
             {/* Inputs */}
             <div className="max-w-md mx-auto bg-gray-50 dark:bg-gray-700/50 p-6 rounded-2xl mb-8 text-left">
               <h3 className="font-bold mb-4 text-center">{t.scan.preScanTitle}</h3>
               <div className="grid grid-cols-2 gap-4 mb-4">
                  <button onClick={() => setGender('female')} className={`p-3 rounded-xl border-2 font-bold transition-all ${gender === 'female' ? 'border-primary text-primary bg-primary/5' : 'border-gray-200'}`}>{t.common.female}</button>
                  <button onClick={() => setGender('male')} className={`p-3 rounded-xl border-2 font-bold transition-all ${gender === 'male' ? 'border-primary text-primary bg-primary/5' : 'border-gray-200'}`}>{t.common.male}</button>
               </div>
               <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 block mb-1">{t.common.height}</label>
                    <input type="number" value={height} onChange={e => setHeight(Number(e.target.value))} className="w-full p-3 rounded-xl bg-white dark:bg-gray-800 outline-none border border-gray-200 dark:border-gray-600"/>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 block mb-1">{t.common.weight}</label>
                    <input type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} className="w-full p-3 rounded-xl bg-white dark:bg-gray-800 outline-none border border-gray-200 dark:border-gray-600"/>
                  </div>
               </div>
               {gender === 'female' && (
                 <label className="flex items-center gap-2 cursor-pointer group">
                   <input type="checkbox" checked={isPregnant} onChange={e => setIsPregnant(e.target.checked)} className="rounded text-primary focus:ring-primary" />
                   <span className="font-bold text-gray-700 dark:text-gray-300 group-hover:text-pink-500 transition-colors flex items-center gap-1"><Baby size={18}/> {t.scan.pregnantMode}</span>
                 </label>
               )}
             </div>

             {/* Camera View - Auto Scan */}
             {scanPhase !== 'idle' && (
                <div className="relative bg-black rounded-3xl overflow-hidden shadow-2xl mb-8 max-w-md mx-auto aspect-[3/4]">
                   <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                   
                   <div className="absolute inset-0 bg-black/20 z-10"></div>
                   
                   {/* Overlay Instructions */}
                   <div className="absolute bottom-10 inset-x-0 text-center z-30 space-y-2">
                      <div className="inline-block bg-black/60 backdrop-blur-md px-6 py-3 rounded-full text-white font-bold animate-pulse">
                         {scanPhase === 'front' && t.scan.scanningFront}
                         {scanPhase === 'left' && t.scan.scanningLeft}
                         {scanPhase === 'back' && t.scan.scanningBack}
                         {scanPhase === 'right' && t.scan.scanningRight}
                         {scanPhase === 'processing' && t.scan.analyzing}
                      </div>
                      {validationStatus && scanPhase !== 'processing' && (
                         <div className="inline-block bg-primary/90 px-4 py-2 rounded-lg text-white text-sm font-bold shadow-lg">
                           {validationStatus}
                         </div>
                      )}
                   </div>

                   {/* Scanning animation line */}
                   {scanPhase !== 'processing' && (
                      <div className="absolute top-0 left-0 w-full h-1 bg-primary/80 shadow-[0_0_15px_rgba(60,130,246,0.8)] animate-scan z-20"></div>
                   )}
                </div>
             )}

             {errorMsg && <div className="mb-4 text-red-500 font-bold bg-red-50 p-4 rounded-xl">{errorMsg}</div>}

             {scanPhase === 'idle' && (
               <button 
                  onClick={runFitMirrorScan} 
                  className="bg-primary text-white px-10 py-5 rounded-2xl font-bold text-xl transition shadow-xl w-full max-w-sm flex items-center justify-center gap-3 mx-auto hover:scale-105 hover:bg-primary-dark"
               >
                 <Camera size={24}/> {t.scan.startFitMirrorScan}
               </button>
             )}
             
             {isScanning && scanPhase === 'processing' && (
                <div className="flex justify-center">
                   <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
             )}
           </div>
         ) : (
           // Result View
           <div className="space-y-8 animate-in slide-in-from-bottom-10 fade-in duration-500">
             <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
               <div className="text-center mb-8">
                 <h2 className="text-gray-500 font-medium uppercase tracking-widest text-xs mb-2">{t.scan.recommended}</h2>
                 <div className="text-9xl font-black text-slate-900 dark:text-white tracking-tighter">{measurementResult.sizeLabel}</div>
                 <div className={`text-sm font-bold mt-2 ${measurementResult.confidence > 0.8 ? 'text-green-500' : 'text-orange-500'}`}>
                    {t.scan.confidence}: {(measurementResult.confidence * 100).toFixed(0)}%
                    {measurementResult.confidence <= 0.85 && <span className="ml-2 opacity-80">(Using Backup Estimation)</span>}
                 </div>
                 {measurementResult.isPregnant && (
                    <div className="mt-2 text-sm text-pink-500 font-bold flex items-center justify-center gap-1">
                      <Baby size={16}/> Pregnancy mode active – fit adapted.
                    </div>
                 )}
               </div>
               
               {/* Global Sizes */}
               <div className="flex justify-center gap-4 mb-8 flex-wrap">
                  {[
                    { l: 'EU', v: measurementResult.sizeEU },
                    { l: 'UK', v: measurementResult.sizeUK },
                    { l: 'US', v: measurementResult.sizeUS },
                  ].map((s) => (
                    <div key={s.l} className="text-center px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg min-w-[60px]">
                       <div className="text-xs uppercase text-gray-400 font-bold">{s.l}</div>
                       <div className="font-bold">{s.v}</div>
                    </div>
                  ))}
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  {[
                    { label: t.scan.chest, val: measurementResult.chest },
                    { label: t.scan.waist, val: measurementResult.waist },
                    { label: t.scan.hips, val: measurementResult.hips },
                    { label: t.scan.shoulder, val: measurementResult.shoulder },
                    { label: t.scan.inseam, val: measurementResult.inseam },
                    { label: t.scan.sleeve, val: measurementResult.sleeve },
                    { label: t.scan.neck, val: measurementResult.neck },
                    { label: 'BMI', val: measurementResult.bmi },
                  ].map((m, i) => (
                    m.val ? (
                    <div key={i} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                      <p className="text-xs text-gray-400 uppercase font-bold mb-1">{m.label}</p>
                      <p className="text-2xl font-black">{m.val} {m.label !== 'BMI' && <span className="text-sm font-normal text-gray-400">cm</span>}</p>
                    </div>
                    ) : null
                  ))}
               </div>
               
               {measurementResult.notes && (
                  <p className="mt-6 text-center text-sm text-gray-500 italic">"{measurementResult.notes}"</p>
               )}
             </div>

             {/* Recommended Products */}
             <div>
               <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><ShoppingBag size={20}/> Recommended for You</h3>
               
               {products.filter(p => p.availableSizes.includes(measurementResult.sizeLabel) && (p.gender === 'unisex' || p.gender === measurementResult.gender)).length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   {products
                      .filter(p => p.availableSizes.includes(measurementResult.sizeLabel) && (p.gender === 'unisex' || p.gender === measurementResult.gender))
                      .sort((a,b) => {
                         // Sort by partner tier (Champion > Pro > Starter)
                         const companyA = companies.find(c => c.id === a.companyId);
                         const companyB = companies.find(c => c.id === b.companyId);
                         const tierRank = { 'champion': 3, 'pro': 2, 'starter': 1, undefined: 0 };
                         return (tierRank[companyB?.tier || 'starter'] || 0) - (tierRank[companyA?.tier || 'starter'] || 0);
                      })
                      .map(product => {
                     const company = companies.find(c => c.id === product.companyId);
                     return (
                     <div key={product.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex gap-4 hover:shadow-lg transition cursor-pointer group">
                       <div className="relative">
                          <img src={product.image} className="w-24 h-32 object-cover rounded-lg bg-gray-100" alt={product.name}/>
                       </div>
                       <div className="flex-1 flex flex-col justify-center">
                         <h4 className="font-bold mb-1 group-hover:text-primary transition-colors">{product.name}</h4>
                         <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                            {company && <img src={company.logo} className="w-4 h-4 object-contain rounded-full bg-gray-50"/>}
                            {company?.name}
                         </div>
                         <div className="flex items-center gap-2 mb-3">
                           <span className="text-primary font-black text-lg">{product.priceKWD} KD</span>
                         </div>
                         <button className="mt-auto bg-slate-900 dark:bg-white dark:text-black text-white text-xs py-2 rounded-lg font-bold w-full hover:opacity-90 transition">View Details</button>
                       </div>
                     </div>
                   )})}
                 </div>
               ) : (
                 <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 text-gray-500">
                    No partner products currently match this exact size. Please check back later.
                 </div>
               )}
             </div>

             <div className="flex gap-4">
               <button onClick={resetScan} className="flex-1 py-4 bg-gray-100 dark:bg-gray-700 rounded-xl font-bold text-slate-700 dark:text-white hover:bg-gray-200 transition flex items-center justify-center gap-2">
                 <RefreshCw size={20}/> {t.common.scanAgain}
               </button>
               {user && (
                 <button onClick={() => alert("Saved!")} className="flex-1 py-4 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-primary-dark transition flex items-center justify-center gap-2">
                   <CheckCircle size={20}/> {t.common.saveResults}
                 </button>
               )}
             </div>
           </div>
         )}
       </div>
    );
  };

  const LoginPage = () => {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [formData, setFormData] = useState({ username: '', password: '', name: '', email: '', gender: 'female' as Gender });
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (mode === 'login') {
        handleLogin(formData.username, formData.password);
      } else {
        handleRegister(formData.name, formData.username, formData.password, formData.email, formData.gender);
      }
    };

    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100 dark:border-gray-700 animate-in zoom-in-95">
          <h2 className="text-2xl font-black mb-6 text-center">{mode === 'login' ? t.common.signIn : t.common.createAccount}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <input required placeholder={t.common.fullName} className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-700 outline-none focus:ring-2 focus:ring-primary" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <input type="email" placeholder={t.common.email} className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-700 outline-none focus:ring-2 focus:ring-primary" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                <select className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-700 outline-none" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value as Gender})}>
                   <option value="female">{t.common.female}</option>
                   <option value="male">{t.common.male}</option>
                </select>
              </>
            )}
            <input required placeholder={t.common.username} className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-700 outline-none focus:ring-2 focus:ring-primary" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
            <input required type="password" placeholder={t.common.password} className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-700 outline-none focus:ring-2 focus:ring-primary" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            
            <button type="submit" className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition">{mode === 'login' ? t.common.signIn : t.common.signUp}</button>
          </form>
          <div className="mt-6 text-center">
            <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-sm text-gray-500 hover:text-primary font-bold">
              {mode === 'login' ? t.common.noAccount : t.common.haveAccount}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const AdminDashboard = () => (
    <div className="max-w-7xl mx-auto py-12 px-4 animate-in fade-in">
      <h1 className="text-3xl font-black mb-8 flex items-center gap-3"><Shield size={32} className="text-primary"/> {t.dashboard.adminTitle}</h1>
      
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
           <div className="text-gray-500 text-sm font-bold uppercase mb-2">{t.dashboard.activeUsers}</div>
           <div className="text-3xl font-black">{users.length}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
           <div className="text-gray-500 text-sm font-bold uppercase mb-2">Total Companies</div>
           <div className="text-3xl font-black">{companies.length}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
           <div className="text-gray-500 text-sm font-bold uppercase mb-2">Total Products</div>
           <div className="text-3xl font-black">{products.length}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
           <div className="text-gray-500 text-sm font-bold uppercase mb-2">System Logs</div>
           <div className="text-3xl font-black">{logs.length}</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
           <h3 className="font-bold mb-4 flex items-center gap-2"><Users size={20}/> User Management</h3>
           <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
             {users.map(u => (
               <div key={u.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center font-bold">{u.username[0].toUpperCase()}</div>
                   <div>
                     <div className="font-bold text-sm">{u.username}</div>
                     <div className="text-xs text-gray-500">{u.role} • {u.status}</div>
                   </div>
                 </div>
                 <button onClick={() => deleteUser(u.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash2 size={16}/></button>
               </div>
             ))}
           </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
           <h3 className="font-bold mb-4 flex items-center gap-2"><Activity size={20}/> System Logs</h3>
           <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
             {logs.map(log => (
               <div key={log.id} className="text-sm border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0">
                 <div className="flex justify-between mb-1">
                   <span className="font-bold text-primary">{log.action}</span>
                   <span className="text-xs text-gray-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                 </div>
                 <div className="text-gray-500">{log.details}</div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );

  const PartnerDashboard = () => {
    const myCompany = companies.find(c => c.id === user?.companyId);
    
    // Product Modal State
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [productForm, setProductForm] = useState<Partial<Product>>({
       name: '', priceKWD: 0, gender: 'female', availableSizes: [], image: '', stock: 0
    });

    if (!myCompany) return <div className="p-12 text-center">No company assigned.</div>;
    
    // Calculate Rank
    const sortedCompanies = [...companies].sort((a,b) => {
       const scoreA = (a.totalMatches * 0.5) + (a.productViews * 0.1) + (a.communityEngagement * 2);
       const scoreB = (b.totalMatches * 0.5) + (b.productViews * 0.1) + (b.communityEngagement * 2);
       return scoreB - scoreA;
    });
    const rank = sortedCompanies.findIndex(c => c.id === myCompany.id) + 1;
    const score = (myCompany.totalMatches * 0.5) + (myCompany.productViews * 0.1) + (myCompany.communityEngagement * 2);

    // Product Handlers
    const handleAddProduct = () => {
      setEditingProduct(null);
      setProductForm({ name: '', priceKWD: 0, gender: 'female', availableSizes: [], image: '', stock: 0 });
      setIsProductModalOpen(true);
    };

    const handleEditProduct = (p: Product) => {
      setEditingProduct(p);
      setProductForm({ ...p });
      setIsProductModalOpen(true);
    };

    const handleDeleteProduct = (id: string) => {
      if (confirm(t.common.deleteProductConfirm)) {
        setProducts(prev => prev.filter(p => p.id !== id));
        addLog('Product Deleted', `Product ${id} deleted by ${user?.username}`);
      }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProductForm(prev => ({ ...prev, image: reader.result as string }));
        };
        reader.readAsDataURL(file);
      }
    };

    const toggleSize = (size: SizeLabel) => {
       const sizes = productForm.availableSizes || [];
       if (sizes.includes(size)) {
         setProductForm(prev => ({ ...prev, availableSizes: sizes.filter(s => s !== size) }));
       } else {
         setProductForm(prev => ({ ...prev, availableSizes: [...sizes, size] }));
       }
    };

    const handleSaveProduct = (e: React.FormEvent) => {
       e.preventDefault();
       if (editingProduct) {
          setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...productForm } as Product : p));
          addLog('Product Updated', `Product ${editingProduct.id} updated`);
       } else {
          const newProd: Product = {
             id: Date.now().toString(),
             companyId: myCompany.id,
             name: productForm.name || 'New Product',
             image: productForm.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400',
             priceKWD: Number(productForm.priceKWD),
             gender: productForm.gender || 'female',
             availableSizes: productForm.availableSizes || [],
             isSponsored: false,
             stock: Number(productForm.stock) || 0
          };
          setProducts(prev => [...prev, newProd]);
          addLog('Product Created', `New product created`);
       }
       setIsProductModalOpen(false);
    };

    return (
      <div className="max-w-7xl mx-auto py-12 px-4 animate-in fade-in relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-4">
             <img src={myCompany.logo} className="w-20 h-20 object-contain bg-white rounded-2xl shadow-md p-2" alt={myCompany.name} />
             <div>
               <h1 className="text-3xl font-black">{t.dashboard.partnerTitle}</h1>
               <div className="flex gap-2 mt-2">
                 <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg font-bold text-xs">{myCompany.name}</span>
                 {myCompany.isSponsored && <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg font-bold text-xs flex items-center gap-1"><Star size={12} fill="currentColor"/> Sponsored</span>}
                 {myCompany.tier && <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg font-bold text-xs uppercase">{myCompany.tier}</span>}
               </div>
             </div>
           </div>
           <button onClick={handleAddProduct} className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition">
             <Plus size={20}/> {t.dashboard.addProduct}
           </button>
        </div>

        {/* Detailed Leaderboard Section */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-8 rounded-3xl shadow-xl mb-12 relative overflow-hidden">
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
             <div className="text-center md:text-left">
               <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 justify-center md:justify-start"><Award className="text-yellow-400"/> {t.dashboard.leaderboard}</h2>
               <p className="text-slate-400 text-sm mb-4">Real-time performance ranking based on engagement & sales.</p>
               <div className="inline-block bg-white/10 backdrop-blur rounded-lg px-4 py-2 text-sm">
                 {rank === 1 ? "🏆 You are currently the top FitMirror partner. Keep it up!" : `You are ranked #${rank}. ${sortedCompanies[rank-2]?.name} is just ahead of you!`}
               </div>
             </div>
             
             <div className="flex gap-8 text-center">
                <div>
                   <div className="text-4xl font-black text-yellow-400 mb-1">#{rank}</div>
                   <div className="text-xs uppercase tracking-widest opacity-60 font-bold">{t.dashboard.rank}</div>
                </div>
                <div>
                   <div className="text-4xl font-black text-green-400 mb-1">{score.toFixed(0)}</div>
                   <div className="text-xs uppercase tracking-widest opacity-60 font-bold">{t.dashboard.score}</div>
                </div>
                <div className="hidden sm:block w-px bg-white/20"></div>
                <div className="hidden sm:block">
                   <div className="text-4xl font-black text-blue-400 mb-1">{myCompany.totalMatches}</div>
                   <div className="text-xs uppercase tracking-widest opacity-60 font-bold">{t.dashboard.matches}</div>
                </div>
             </div>
           </div>
           
           {/* Background Decoration */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 opacity-10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
           {[
             { label: t.dashboard.matches, val: myCompany.totalMatches, icon: <ScanningIllustration className="w-6 h-6"/> },
             { label: "Views", val: myCompany.productViews, icon: <Users size={24}/> },
             { label: "Engagement", val: myCompany.communityEngagement, icon: <Heart size={24}/> },
             { label: t.dashboard.couponsIssued, val: myCompany.couponsIssued, icon: <Ticket size={24}/> }
           ].map((s,i) => (
             <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-500 text-xs font-bold uppercase">{s.label}</div>
                  <div className="text-primary opacity-50">{s.icon}</div>
                </div>
                <div className="text-3xl font-black">{s.val}</div>
             </div>
           ))}
        </div>
        
        {/* Products Grid */}
        <div className="flex items-center justify-between mb-6">
           <h2 className="text-xl font-bold flex items-center gap-2"><Briefcase size={20}/> My Products</h2>
           <span className="text-sm text-gray-500">{products.filter(p => p.companyId === myCompany.id).length} Items</span>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.filter(p => p.companyId === myCompany.id).map(p => (
            <div key={p.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden group hover:shadow-lg transition">
               <div className="relative aspect-[3/4]">
                 <img src={p.image} className="w-full h-full object-cover" alt={p.name} />
                 
                 {/* Action Overlay */}
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4">
                   <button onClick={() => handleEditProduct(p)} className="p-3 bg-white rounded-full text-gray-900 hover:bg-gray-100 transition transform hover:scale-110 shadow-lg" title={t.common.edit}>
                     <Edit2 size={20}/>
                   </button>
                   <button onClick={() => handleDeleteProduct(p.id)} className="p-3 bg-red-500 rounded-full text-white hover:bg-red-600 transition transform hover:scale-110 shadow-lg" title={t.common.delete}>
                     <Trash2 size={20}/>
                   </button>
                 </div>
               </div>
               <div className="p-4">
                 <h3 className="font-bold truncate text-lg mb-1">{p.name}</h3>
                 <div className="flex justify-between items-center">
                   <span className="text-primary font-black text-xl">{p.priceKWD} KD</span>
                   <div className="flex gap-1">
                     {p.availableSizes.map(s => <span key={s} className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded font-bold">{s}</span>)}
                   </div>
                 </div>
                 <div className="mt-2 text-xs font-bold text-gray-400">Stock: {p.stock || 0}</div>
               </div>
            </div>
          ))}
          
          <button onClick={handleAddProduct} className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center min-h-[300px] hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-400 hover:text-primary group">
            <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition">
              <Plus size={32}/>
            </div>
            <span className="font-bold text-lg">{t.dashboard.addProduct}</span>
          </button>
        </div>

        {/* Add/Edit Product Modal */}
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-2xl font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                <button onClick={() => setIsProductModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"><X/></button>
              </div>
              
              <form onSubmit={handleSaveProduct} className="p-6 space-y-6">
                <div className="flex gap-6">
                  {/* Image Upload */}
                  <div className="w-1/3">
                    <label className="block text-sm font-bold mb-2">{t.common.productImage}</label>
                    <div className="aspect-[3/4] bg-gray-50 dark:bg-gray-700 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-600 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer">
                      {productForm.image ? (
                        <img src={productForm.image} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-gray-400 flex flex-col items-center">
                          <ImageIcon size={32} className="mb-2"/>
                          <span className="text-xs">{t.common.selectImage}</span>
                        </div>
                      )}
                      <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-bold">
                        <Upload size={24} className="mr-2"/> Change
                      </div>
                    </div>
                  </div>

                  {/* Fields */}
                  <div className="w-2/3 space-y-4">
                     <div>
                       <label className="block text-sm font-bold mb-1">Product Name</label>
                       <input required className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} placeholder="e.g. Summer Floral Dress"/>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                       <div>
                         <label className="block text-sm font-bold mb-1">Price (KWD)</label>
                         <input required type="number" className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700" value={productForm.priceKWD} onChange={e => setProductForm({...productForm, priceKWD: Number(e.target.value)})}/>
                       </div>
                       <div>
                         <label className="block text-sm font-bold mb-1">{t.common.stock}</label>
                         <input type="number" className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: Number(e.target.value)})}/>
                       </div>
                     </div>
                     <div>
                         <label className="block text-sm font-bold mb-1">{t.common.gender}</label>
                         <select className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700" value={productForm.gender} onChange={e => setProductForm({...productForm, gender: e.target.value as Gender})}>
                           <option value="female">Female</option>
                           <option value="male">Male</option>
                           <option value="unisex">Unisex</option>
                         </select>
                       </div>
                     <div>
                       <label className="block text-sm font-bold mb-2">Available Sizes</label>
                       <div className="flex gap-2 flex-wrap">
                         {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                           <button 
                             key={size} 
                             type="button"
                             onClick={() => toggleSize(size as SizeLabel)}
                             className={`px-4 py-2 rounded-lg font-bold text-sm transition ${productForm.availableSizes?.includes(size as SizeLabel) ? 'bg-primary text-white shadow-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200'}`}
                           >
                             {size}
                           </button>
                         ))}
                       </div>
                     </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition">{t.common.cancel}</button>
                  <button type="submit" className="px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-primary-dark transition flex items-center gap-2">
                    <Save size={18}/> {t.common.save}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  const ProfilePage = () => (
    <div className="max-w-5xl mx-auto py-12 px-4 animate-in fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black">{t.dashboard.customerTitle}</h1>
        <div className="flex items-center gap-3">
          <div className="text-right">
             <div className="font-bold">{user?.name}</div>
             <div className="text-xs text-gray-500">@{user?.username}</div>
          </div>
          <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl">
            {user?.name?.[0]}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <section>
            <h2 className="font-bold text-xl mb-4 flex items-center gap-2"><Ruler size={20}/> {t.profile.history}</h2>
            {scanHistory.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl text-center border border-gray-100 dark:border-gray-700">
                <p className="text-gray-500 mb-4">No scans yet.</p>
                <button onClick={() => setCurrentPage('scan')} className="bg-primary text-white px-6 py-2 rounded-lg font-bold text-sm">Start First Scan</button>
              </div>
            ) : (
              <div className="space-y-4">
                {scanHistory.map(scan => (
                  <div key={scan.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <div>
                      <div className="font-black text-lg">{scan.sizeLabel} <span className="text-sm font-normal text-gray-500">({scan.method})</span></div>
                      <div className="text-xs text-gray-400">{scan.date}</div>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <div><span className="text-gray-400 text-xs uppercase">Chest</span> <b>{scan.measurements.chest}</b></div>
                      <div><span className="text-gray-400 text-xs uppercase">Waist</span> <b>{scan.measurements.waist}</b></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
        
        <div className="space-y-8">
           <section>
             <h2 className="font-bold text-xl mb-4 flex items-center gap-2"><Ticket size={20}/> {t.profile.myCoupons}</h2>
             <div className="space-y-4">
               {user?.coupons && user.coupons.length > 0 ? (
                 user.coupons.map(coupon => (
                   <div key={coupon.id} className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-4 rounded-xl shadow-lg relative overflow-hidden">
                     <div className="relative z-10">
                       <div className="font-black text-2xl">{coupon.discount}</div>
                       <div className="text-sm font-medium opacity-90">{coupon.companyName}</div>
                       <div className="mt-4 bg-white/20 p-2 rounded text-center font-mono tracking-widest">{coupon.code}</div>
                     </div>
                     <Ticket className="absolute -bottom-4 -right-4 text-white opacity-20 w-32 h-32" />
                   </div>
                 ))
               ) : (
                 <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl text-center text-sm text-gray-500">
                   Engage with the community to earn coupons!
                 </div>
               )}
             </div>
           </section>
        </div>
      </div>
    </div>
  );

  const CommunityPage = () => (
    <div className="max-w-3xl mx-auto py-12 px-4 animate-in fade-in">
       <div className="text-center mb-10">
         <h1 className="text-3xl font-black mb-2">{t.community.title}</h1>
         <p className="text-gray-500">{t.community.subtitle}</p>
       </div>

       {/* Coupon Banner */}
       <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 mb-12 text-white shadow-xl relative overflow-hidden">
         <div className="relative z-10">
           <h2 className="text-2xl font-black mb-2 flex items-center gap-2"><Gift/> {t.community.couponBannerTitle}</h2>
           <p className="opacity-90 max-w-lg">{t.community.couponBannerText}</p>
         </div>
         <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
       </div>

       {/* Input */}
       <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
         <textarea className="w-full bg-gray-50 dark:bg-gray-900 rounded-xl p-4 outline-none resize-none focus:ring-2 focus:ring-primary mb-4" rows={3} placeholder={t.community.share}></textarea>
         <div className="flex justify-end">
           <button onClick={() => { 
             if (!user) { alert(t.community.loginToPost); return; }
             const newPost = { id: Date.now().toString(), authorId: user.id, authorName: user.name || user.username, content: "Just found my perfect size!", likes: 0, comments: 0, timestamp: new Date().toISOString() };
             setPosts([newPost, ...posts]);
             // Demo coupon logic
             if (Math.random() > 0.5) {
                alert(t.community.couponEarned);
                const coupon: Coupon = { id: Date.now().toString(), code: 'FIT20', discount: '20% OFF', companyName: 'JAS KUWAIT', description: 'Community Reward', expiry: '2025-12-31', isRedeemed: false, status: 'active' };
                setUser(prev => prev ? {...prev, coupons: [...(prev.coupons || []), coupon]} : null);
             }
           }} className="bg-primary text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-primary-dark transition">
             <Send size={16}/> {t.community.postButton}
           </button>
         </div>
       </div>

       {/* Feed */}
       <div className="space-y-6">
         {posts.map(post => (
           <div key={post.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
             <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                 {post.authorName[0]}
               </div>
               <div>
                 <div className="font-bold">{post.authorName}</div>
                 <div className="text-xs text-gray-400">{new Date(post.timestamp).toLocaleDateString()}</div>
               </div>
             </div>
             <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{post.content}</p>
             <div className="flex gap-6 border-t border-gray-100 dark:border-gray-700 pt-4">
               <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition text-sm font-bold"><Heart size={18}/> {post.likes}</button>
               <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition text-sm font-bold"><MessageCircle size={18}/> {post.comments}</button>
             </div>
           </div>
         ))}
       </div>
    </div>
  );

  const AboutPage = () => (
    <div className="max-w-4xl mx-auto py-16 px-4 animate-in fade-in">
      <div className="text-center mb-16">
        <FitMirrorLogo className="h-12 mx-auto mb-6"/>
        <h1 className="text-4xl font-black mb-6">{t.about.title}</h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">{t.about.story}</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
           <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-3xl">
             <h3 className="text-2xl font-bold mb-4 text-blue-800 dark:text-blue-300">Our Mission</h3>
             <p className="text-blue-900/70 dark:text-blue-100/70 leading-relaxed">{t.about.mission}</p>
           </div>
        </div>
        <div>
           <h3 className="text-2xl font-bold mb-4">{t.about.privacy}</h3>
           <p className="text-gray-500 leading-relaxed mb-6">{t.about.privacyText}</p>
           <ul className="space-y-3">
             <li className="flex items-center gap-3"><CheckCircle className="text-green-500"/> No image storage</li>
             <li className="flex items-center gap-3"><CheckCircle className="text-green-500"/> Local processing options</li>
             <li className="flex items-center gap-3"><CheckCircle className="text-green-500"/> GDPR Compliant</li>
           </ul>
        </div>
      </div>
    </div>
  );

  const ContactPage = () => (
    <div className="max-w-xl mx-auto py-16 px-4 animate-in fade-in">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black mb-2">{t.contact.title}</h1>
        <p className="text-gray-500">{t.contact.subtitle}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert(t.common.messageSent); }}>
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-1">{t.contact.name}</label>
            <input required className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-primary"/>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-1">{t.contact.email}</label>
            <input required type="email" className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-primary"/>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-1">{t.contact.message}</label>
            <textarea required rows={4} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-primary"></textarea>
          </div>
          <button className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-dark transition">
            {t.common.submit}
          </button>
        </form>
      </div>
    </div>
  );

  const StoreSolutionsPage = () => (
    <div className="animate-in fade-in">
       <section className="bg-slate-900 text-white py-24 px-4 text-center">
         <div className="max-w-4xl mx-auto">
           <h1 className="text-4xl md:text-6xl font-black mb-6">{t.stores.title}</h1>
           <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">{t.stores.subtitle}</p>
           <div className="flex justify-center gap-4">
             <button onClick={() => setCurrentPage('contact')} className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition">{t.stores.contactSales}</button>
             <button onClick={() => setCurrentPage('pricing')} className="bg-transparent border border-white/20 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition">{t.stores.viewPricing}</button>
           </div>
         </div>
       </section>

       <section className="py-20 max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-8">
              <div className="text-5xl font-black text-primary mb-2">70%</div>
              <div className="font-bold text-xl">{t.stores.metricReturns}</div>
            </div>
            <div className="p-8 border-l border-r border-gray-100 dark:border-gray-800">
              <div className="text-5xl font-black text-primary mb-2">+18%</div>
              <div className="font-bold text-xl">{t.stores.metricConv}</div>
            </div>
            <div className="p-8">
              <div className="text-5xl font-black text-primary mb-2">5.0</div>
              <div className="font-bold text-xl">{t.stores.metricSat}</div>
            </div>
          </div>
       </section>
    </div>
  );

  const ApiDocsPage = () => (
    <div className="max-w-5xl mx-auto py-16 px-4 animate-in fade-in">
      <h1 className="text-4xl font-black mb-8">{t.stores.apiDocs}</h1>
      <p className="text-xl text-gray-500 mb-12">{t.stores.apiIntro}</p>

      <div className="bg-slate-900 text-gray-300 p-8 rounded-3xl font-mono text-sm shadow-xl overflow-x-auto">
        <div className="mb-4 text-green-400">// POST /api/v1/scan/analyze</div>
        <pre>{`{
  "image": "base64_string...",
  "user_gender": "female",
  "height_cm": 170
}`}</pre>
        <div className="my-4 text-green-400">// Response</div>
        <pre>{`{
  "measurements": {
    "chest": 92,
    "waist": 74,
    "hips": 98
  },
  "recommended_size": "M",
  "confidence": 0.95
}`}</pre>
      </div>
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">{t.stores.integrationGuide}</h2>
        <div className="space-y-4">
           {[1,2,3,4].map(s => (
             <div key={s} className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
               <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">{s}</div>
               <div>
                 <h4 className="font-bold">Step {s}</h4>
                 <p className="text-sm text-gray-500">Configure your API keys and webhook endpoints in the partner dashboard.</p>
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );

  const LegalPage = ({ type }: { type: 'privacy' | 'terms' }) => (
    <div className="max-w-4xl mx-auto py-16 px-4 animate-in fade-in">
      <h1 className="text-3xl font-black mb-2">{type === 'privacy' ? t.legal.privacyPolicy : t.legal.terms}</h1>
      <p className="text-gray-500 mb-8">{t.legal.updated}</p>
      <div 
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: type === 'privacy' ? t.legal.privacyContent : t.legal.termsContent }}
      />
    </div>
  );

  const PricingPage = () => {
    const plans = [
       { ...t.pricing.starter, highlight: false },
       { ...t.pricing.pro, highlight: true },
       { ...t.pricing.champion, highlight: false }
    ];

    return (
    <div className="max-w-7xl mx-auto py-16 px-4 animate-in fade-in">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black mb-4">{t.pricing.title}</h1>
        <p className="text-xl text-gray-500">{t.pricing.subtitle}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <div key={i} className={`p-8 rounded-3xl border flex flex-col ${plan.highlight ? 'border-primary shadow-xl bg-white dark:bg-gray-800 scale-105 z-10' : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'}`}>
            <h3 className="text-xl font-bold mb-4">{plan.title}</h3>
            <div className="text-4xl font-black mb-1">{plan.price}</div>
            <div className="text-sm text-gray-400 mb-8">{plan.period}</div>
            <p className="text-sm text-gray-500 mb-6 min-h-[40px]">{plan.desc}</p>
            <ul className="space-y-4 mb-8 flex-1">
              {plan.features.map((f, j) => (
                <li key={j} className="flex items-start gap-2 text-sm">
                  <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0"/> 
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button className={`w-full py-4 rounded-xl font-bold transition shadow-lg ${plan.highlight ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50'}`}>
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
      <p className="text-center mt-12 text-gray-500 italic max-w-2xl mx-auto">{t.pricing.note}</p>
    </div>
  )};

  // ... (Including logic for service worker check)
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // PWA registration logic placeholder
      console.log("PWA Service Worker supported");
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300">
      {!hasEntered ? (
        <EntryPage />
      ) : (
        <>
          <Navbar />
          <main className="min-h-[calc(100vh-20rem)]">
            {currentPage === 'home' && <HomePage />}
            {currentPage === 'scan' && <ScanPage />}
            {currentPage === 'admin' && <AdminDashboard />}
            {currentPage === 'partner' && <PartnerDashboard />}
            {currentPage === 'login' && <LoginPage />}
            {currentPage === 'stores' && <StoreSolutionsPage />}
            {currentPage === 'api-docs' && <ApiDocsPage />}
            {currentPage === 'pricing' && <PricingPage />}
            {currentPage === 'community' && <CommunityPage />}
            {currentPage === 'about' && <AboutPage />}
            {currentPage === 'contact' && <ContactPage />}
            {currentPage === 'privacy' && <LegalPage type="privacy" />}
            {currentPage === 'terms' && <LegalPage type="terms" />}
            {currentPage === 'profile' && <ProfilePage />}
          </main>
          
          <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-12 mt-12">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <FitMirrorLogo className="h-6 mx-auto mb-6 opacity-50 grayscale" />
              <p className="text-sm text-gray-400 mb-2">{t.common.rights}</p>
              <p className="text-xs text-gray-500 mb-6 max-w-2xl mx-auto leading-relaxed">{t.common.builtBy}</p>
              <div className="flex justify-center gap-6 text-xs text-gray-500">
                 <button onClick={() => setCurrentPage('privacy')} className="hover:text-primary transition">{t.legal.privacyPolicy}</button>
                 <button onClick={() => setCurrentPage('terms')} className="hover:text-primary transition">{t.legal.terms}</button>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}