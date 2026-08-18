import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  Truck, 
  MessageSquare, 
  BadgeCheck, 
  TrendingUp, 
  Handshake, 
  Star, 
  Check, 
  ArrowRight, 
  Loader2,
  ExternalLink,
  MapPin,
  Globe,
  ShieldCheck,
  X,
  Info,
  Phone,
  Copy,
  Languages,
  Sparkles,
  AlertCircle,
  Mail,
  ThumbsUp
} from 'lucide-react';
import { generateReview, hasApiKey, injectNaturalTypos, ReviewLanguage } from './services/geminiService';

const COMPANY_DETAILS = {
  name: 'Manshav Impex',
  address: 'D-1, Yogi Nagar, Nr. Silver Business Hub, Simada, Surat, Gujarat - 395006.',
  reviewLink: "https://g.page/r/CSKJ8gzzeF6GEBM/review",
  mapLink: "https://www.google.com/maps/place/Manshav+Impex/@21.2181408,72.8947613,1013m/data=!3m2!1e3!5s0x3be04f6334a1114b:0x88a9313a02f7462e!4m8!3m7!1s0x3be04f5e7f207f3b:0x865e78f30cf28922!8m2!3d21.2181408!4d72.8947613!9m1!1b1!16s%2Fg%2F11s3y6z8pl?entry=ttu&g_ep=EgoyMDI2MDUxMy4wIKXMDSoASAFQAw%3D%3D",
  phone: "+91 9898273226",
  website: "manshavimpex.com",
  email: "info@manshavimpex.com"
};

const PRODUCTS = [
  { name: "Surgical Gloves (Sterile)", icon: BadgeCheck, detail: "ISO Certified cleanroom production" },
  { name: "Medical Apparels & Packs", icon: ShieldCheck, detail: "Surgical drapes, gowns, protective gear" },
  { name: "Orthopedic Implants & Screws", icon: Package, detail: "Titanium osteosynthesis products" },
  { name: "Dental Equipment & Chairs", icon: Star, detail: "Premium clinics and institution systems" },
  { name: "Surgical Instruments", icon: TrendingUp, detail: "Precision instruments in medical-grade steel" }
];

// Pristine High-Fidelity Vector Replica of the Real Manshav Brand Logo
// Matching exact olive/forest green color, symmetrical sweeping feather wings, central eagle silhouette, and the integrated M monogram geometry
const ManshavLogo = ({ className = "w-48 h-auto", fill = "#4b6334" }: { className?: string, fill?: string }) => (
  <svg viewBox="0 0 800 550" className={className} xmlns="http://www.w3.org/2000/svg" fill="none">
    {/* Left and Right Symmetrical Wings + Monogram M base */}
    <g fill={fill}>
      {/* Symmetrical Left Wing */}
      <path d="M 400 220 
               L 120 120 
               C 150 155, 185 190, 220 225 
               C 255 260, 290 295, 325 315 
               L 332 290 
               C 285 270, 235 230, 195 180 
               L 345 325 
               Z" />
      
      {/* Accurate White Slit Gaps (Left Wing) */}
      <path d="M 140 150 L 285 210" stroke="#FFFFFF" strokeWidth="15" strokeLinecap="round" />
      <path d="M 170 185 L 315 245" stroke="#FFFFFF" strokeWidth="15" strokeLinecap="round" />
      <path d="M 205 220 L 330 270" stroke="#FFFFFF" strokeWidth="15" strokeLinecap="round" />

      {/* Symmetrical Right Wing */}
      <path d="M 400 220 
               L 680 120 
               C 650 155, 615 190, 580 225 
               C 545 260, 510 295, 475 315 
               L 468 290 
               C 515 270, 565 230, 605 180 
               L 455 325 
               Z" />
      
      {/* Accurate White Slit Gaps (Right Wing) */}
      <path d="M 660 150 L 515 210" stroke="#FFFFFF" strokeWidth="15" strokeLinecap="round" />
      <path d="M 630 185 L 485 245" stroke="#FFFFFF" strokeWidth="15" strokeLinecap="round" />
      <path d="M 595 220 L 470 270" stroke="#FFFFFF" strokeWidth="15" strokeLinecap="round" />

      {/* Central Monogram M Eagle Torso */}
      {/* The green silhouette forms an eagle body where the bottom columns represent the letter M */}
      <path d="M 400 135 
               C 415 135, 423 145, 432 140 
               C 438 135, 442 143, 444 149 
               C 438 157, 430 162, 422 166 
               L 460 215 
               L 490 395 
               L 444 360 
               L 400 225 
               L 356 360 
               L 310 395 
               L 340 215 
               Z" />
      
      {/* Monogram Eagle Tail Structure */}
      <path d="M 374 372 L 400 420 L 426 372 Z" />
    </g>

    {/* Absolute Reproduction of the Custom military stencil-slab typeface block letters "Manshav" */}
    <g transform="translate(180, 480)" fill={fill}>
      {/* M with stencil breaks */}
      <path d="M 0 0 L 14 0 L 21 22 L 28 0 L 42 0 L 42 50 L 30 50 L 30 14 L 24 34 L 18 34 L 12 14 L 12 50 L 0 50 Z" />
      {/* a with neat counters */}
      <path d="M 52 16 C 52 4, 70 4, 70 16 L 70 50 L 59 50 L 59 40 C 55 46, 48 50, 43 44 C 39 38, 43 25, 52 23 C 58 21, 59 17, 59 16 Z M 59 29 C 53 30, 53 40, 59 40 C 63 40, 63 35, 59 29 Z" />
      {/* n */}
      <path d="M 80 8 L 91 8 L 91 16 C 94 6, 106 4, 108 14 L 108 50 L 97 50 L 97 22 C 97 16, 91 16, 91 22 L 91 50 L 80 50 Z" />
      {/* s with split curvature */}
      <path d="M 118 13 C 118 2, 135 2, 135 10 L 124 12 C 124 8, 128 8, 130 9 C 132 10, 126 16, 122 18 C 117 22, 117 27, 120 32 L 133 34 C 137 36, 134 45, 127 45 C 119 45, 118 37, 118 34 L 129 32 C 129 36, 131 37, 133 36 C 135 35, 133 30, 130 27 L 118 23 Z" />
      {/* h with tall stem */}
      <path d="M 144 0 L 155 0 L 155 16 C 158 6, 171 4, 173 14 L 173 50 L 162 50 L 162 22 C 162 16, 155 16, 155 22 L 155 50 L 144 50 Z" />
      {/* a */}
      <path d="M 183 16 C 183 4, 201 4, 201 16 L 201 50 L 190 50 L 190 40 C 186 46, 179 50, 174 44 C 170 38, 174 25, 183 23 C 189 21, 190 17, 190 16 Z M 190 29 C 184 30, 184 40, 190 40 C 194 40, 194 35, 190 29 Z" />
      {/* v */}
      <path d="M 210 8 L 220 8 L 227 34 L 234 8 L 244 8 L 232 50 L 222 50 Z" />
    </g>
  </svg>
);

const CATEGORIES = [
  { id: 'Product Quality', label: 'Medical & Surgical Quality', desc: 'Sterile gloves, instruments, apparels', icon: BadgeCheck },
  { id: 'Packaging & Export', label: 'Export Packaging', desc: 'Moisture-proof container packing', icon: Package },
  { id: 'Delivery & Timeliness', label: 'Global Delivery', desc: 'Timely freight & customs clearance', icon: Truck },
  { id: 'Overall Experience', label: 'B2B Service & Trust', desc: 'Direct factory rates, dependable partner', icon: Handshake },
];

type View = 'selector' | 'generating' | 'review' | 'feedback' | 'error' | 'success-feedback';

export default function App() {
  const [view, setView] = useState<View>('selector');
  const [selectedCategory, setSelectedCategory] = useState<string>('Product Quality');
  const [userRating, setUserRating] = useState<number>(5);
  
  // Fixed to English, Medium length, and auto-humanize with subtle realistic typos
  const language: ReviewLanguage = 'english';
  const length = 'medium';
  const humanize = true;
  
  const [generatedReview, setGeneratedReview] = useState<string>('');
  const [inputFeedback, setInputFeedback] = useState<string>('');
  const [isCopying, setIsCopying] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  // Auto scroll to top of window when view shifts, ensuring perfect view for mobile customers
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [view]);

  // Check if API key is provided
  const isApiConfigured = hasApiKey();

  const handleGenerate = async () => {
    if (!selectedCategory) return;
    
    // If user gives a critical rating (3 stars or under), route them to internal feedback is standard 
    // to safeguard the merchant's rating score on Google! Perfect B2B management feature.
    if (userRating <= 3) {
      setView('feedback');
      return;
    }

    setView('generating');
    try {
      const reviewText = await generateReview({
        category: selectedCategory,
        tone: userRating === 5 ? "excellent" : userRating === 4 ? "great" : "good",
        length: length,
        language: language,
        humanize: humanize
      });
      setGeneratedReview(reviewText);
      setView('review');
    } catch (error) {
      console.error(error);
      setView('error');
    }
  };

  const handlePostOnGoogle = async () => {
    try {
      await navigator.clipboard.writeText(generatedReview);
      setIsCopying(true);
      setTimeout(() => setIsCopying(false), 5000);
      window.open(COMPANY_DETAILS.reviewLink, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error('Failed to copy text: ', err);
      window.open(COMPANY_DETAILS.reviewLink, '_blank', 'noopener,noreferrer');
    }
  };

  const handleInternalFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingFeedback(true);
    setTimeout(() => {
      setIsSubmittingFeedback(false);
      setInputFeedback('');
      setView('success-feedback');
    }, 1500);
  };

  const wordCount = generatedReview ? generatedReview.split(/\s+/).filter(Boolean).length : 0;
  const charCount = generatedReview ? generatedReview.length : 0;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111111] font-sans flex flex-col selection:bg-[#4b6334]/10">
      
      {/* Top Banner Accent */}
      <div className="bg-gradient-to-r from-[#4b6334] via-[#5c7a40] to-[#D3A243] h-1.5 w-full shrink-0" />

      {/* Simplified Elegant Header - displaying ONLY Manshav Impex, with Contact No. */}
      <header className="bg-white border-b border-gray-100 py-3.5 px-4 md:px-8 shrink-0 shadow-sm sticky top-0 z-30">
        <div className="max-w-[1500px] mx-auto flex items-center justify-between gap-4">
          
          {/* Symmetrical Brand Identity - displays ONLY Manshav Impex */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <h1 className="text-lg md:text-xl font-black text-[#4b6334] tracking-tight leading-none uppercase">
                Manshav Impex
              </h1>
              <span className="text-[9px] text-[#D3A243] font-bold tracking-widest uppercase mt-0.5">
                ISO CERTIFIED • GLOBAL EXPORTER
              </span>
            </div>
          </div>

          {/* Quick Contact & Action Port in Header */}
          <div className="flex items-center gap-3">
            {/* Header Contact Us Number */}
            <div className="items-center gap-1.5 text-xs font-bold text-gray-700 bg-gray-50 border border-gray-150 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl flex">
              <Phone className="w-3.5 h-3.5 text-[#4b6334] shrink-0" />
              <span className="hidden sm:inline text-gray-400 font-semibold">Contact:</span>
              <a href={`tel:${COMPANY_DETAILS.phone}`} className="text-[#4b6334] font-black hover:underline">{COMPANY_DETAILS.phone}</a>
            </div>
          </div>

        </div>
      </header>

      {/* Optimized Layout - Wider, Grid System, NO scroll on desktop viewports */}
      <main className="flex-1 max-w-[1500px] w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col justify-stretch">
        
        {/* Responsive Dual-Column Workstation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-1">
          
          {/* COLUMN 1: CONFIGURATION GATEWAY (lg:col-span-7) */}
          <div className={`lg:col-span-7 bg-white rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-5 md:p-6 flex flex-col justify-between space-y-5 ${view !== 'selector' ? 'hidden lg:flex' : 'flex'}`}>
            


            {/* FORM INPUTS */}
            <div className="space-y-5">
              
              {/* Star Rating Score Select */}
              <div className="bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100/80">
                <div className="flex items-center justify-between gap-3 mb-2 px-1">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase text-[#4b6334] tracking-wider block">1. Rating Experience</span>
                    <span className="text-[9px] text-gray-400 block">Select your rating score</span>
                  </div>
                  <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 uppercase">
                    ★ {userRating} Stars
                  </span>
                </div>

                <div className="flex items-center gap-2 justify-center py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      className="p-1 hover:scale-110 active:scale-95 transition-transform focus:outline-none flex flex-col items-center cursor-pointer"
                    >
                      <Star 
                        className={`w-7 h-7 transition-colors ${
                          star <= userRating 
                            ? 'fill-[#D3A243] text-[#D3A243] drop-shadow-sm' 
                            : 'text-gray-250 hover:text-amber-300'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Sourced cargo category segment grid */}
              <div>
                <span className="text-xs font-extrabold uppercase text-[#4b6334] tracking-wider block mb-2.5">
                  2. Review Focus Area
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {CATEGORIES.map((cat) => {
                    const IconComponent = cat.icon;
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-[#4b6334] text-white border-[#4b6334] shadow-md ring-2 ring-[#D3A243]/30' 
                            : 'bg-white border-gray-150 hover:bg-gray-50/80'
                        }`}
                      >
                        <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-white/10 text-amber-300' : 'bg-[#4b6334]/5 text-[#4b6334]'}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-black uppercase tracking-tight block truncate">
                              {cat.label}
                            </span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-amber-300 stroke-[3px] shrink-0" />}
                          </div>
                          <span className={`text-[9px] mt-0.5 leading-tight block ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                            {cat.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Compose Draft Button */}
            <button
              type="button"
              onClick={handleGenerate}
              className="w-full py-4 bg-gradient-to-r from-[#4b6334] to-[#364925] hover:brightness-110 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer mt-4"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              Generate Review Draft
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>

          {/* COLUMN 2: ACTIVE DRAFT TERMINAL & FEEDBACK PREVIEW (lg:col-span-5) */}
          <div className={`lg:col-span-5 bg-white rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-5 md:p-6 flex flex-col justify-stretch relative overflow-hidden ${view === 'selector' ? 'hidden lg:flex' : 'flex'}`}>
            
            <AnimatePresence mode="wait">
              
              {/* STATE 1: IDLE / NOT GENERATED YET */}
              {view === 'selector' && (
                <motion.div 
                  key="idle-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col justify-center items-center text-center p-6 space-y-4"
                >
                  <div className="w-16 h-16 bg-[#4b6334]/5 border border-[#4b6334]/10 rounded-full flex items-center justify-center text-[#4b6334]">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <div className="space-y-1.5 max-w-sm">
                    <h3 className="text-sm font-bold uppercase text-gray-800 tracking-wider">Draft Staging Terminal</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Select review filters on the left and click **Compose** to generate high-performance B2B review drafts. 
                    </p>
                    <p className="text-[10px] text-amber-600 bg-amber-50 px-2.5 py-1.5 rounded-lg font-semibold inline-block border border-amber-200/50">
                      🎯 Medical, Surgical, India-based, Certified, and Long-Term trade keywords are integrated automatically.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* STATE 2: LOADING GENERATION */}
              {view === 'generating' && (
                <motion.div 
                  key="loading-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col justify-center items-center text-center p-6 space-y-4"
                >
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-[#4b6334]/20 rounded-full" />
                    <Loader2 className="w-12 h-12 text-[#4b6334] animate-spin absolute inset-0 stroke-[3px]" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-black uppercase text-gray-800 tracking-wider">Compiling Trade Metadata...</p>
                    <p className="text-[10px] text-gray-400">Embedding certified surgical B2B keywords with custom {language} dialect...</p>
                  </div>
                </motion.div>
              )}

              {/* STATE 3: READY REVIEW DRAFT */}
              {view === 'review' && (
                <motion.div 
                  key="draft-state"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col justify-between space-y-4 h-full"
                >
                  
                  {/* Status header */}
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <button 
                      type="button"
                      onClick={() => setView('selector')} 
                      className="text-[9px] font-extrabold uppercase text-[#4b6334] bg-[#4b6334]/5 border border-[#4b6334]/15 px-2.5 py-1.5 rounded-lg hover:bg-[#4b6334]/10 transition-colors flex items-center gap-1 focus:outline-none cursor-pointer"
                    >
                      ← Back & Configure
                    </button>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] bg-emerald-50 text-emerald-700 font-extrabold px-2 py-0.5 rounded uppercase">
                        ★ {userRating} Stars
                      </span>
                      <span className="text-[9px] bg-amber-50 text-[#D3A243] font-extrabold px-2 py-0.5 rounded uppercase">
                        {language.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Editable workspace area */}
                  <div className="bg-gray-50 rounded-2xl p-3 border border-gray-200/60 flex-1 flex flex-col justify-between relative min-h-[220px]">
                    <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 mb-2">
                      <span className="flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-gray-100 shadow-sm text-[9px] text-[#4b6334]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4b6334] animate-pulse" />
                        Seo Review Completed
                      </span>
                      <span className="flex items-center gap-2 text-[9px]">
                        <span>{charCount} Chars</span>
                        <span>{wordCount} Words</span>
                      </span>
                    </div>

                    <textarea
                      value={generatedReview}
                      onChange={(e) => setGeneratedReview(e.target.value)}
                      className="w-full flex-1 bg-white p-4 rounded-xl focus:ring-1 focus:ring-[#4b6334]/20 focus:outline-none border border-gray-200 font-sans text-xs md:text-sm font-medium leading-relaxed text-gray-800 resize-none shadow-inner animate-fade-in"
                      placeholder="The generated copy is staging here..."
                    />
                  </div>

                  {/* Actions col with Copy Draft CTA */}
                  <div className="space-y-3 pt-1">
                    
                    {/* Big Bold Primary CTA Button */}
                    <button 
                      type="button"
                      onClick={handlePostOnGoogle}
                      className="w-full py-4 bg-gradient-to-r from-[#4b6334] to-[#2c3b1e] hover:brightness-110 active:scale-[0.99] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Copy className="w-4 h-4 text-amber-300" />
                      Copy Review & Go to Google Maps
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>

                  </div>

                </motion.div>
              )}

              {/* STATE 4: PRIVATE INCIDENT DESK LOG */}
              {view === 'feedback' && (
                <motion.div 
                  key="feedback-state"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col justify-between space-y-3 h-full"
                >
                  <form onSubmit={handleInternalFeedback} className="flex flex-col justify-between flex-1 space-y-4">
                    
                    <div className="text-center space-y-1">
                      <div className="w-10 h-10 bg-amber-50 rounded-full mx-auto flex items-center justify-center text-amber-500 border border-amber-200">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <h3 className="text-xs font-black text-gray-800 tracking-tight uppercase">Manshav CEO Resolution Desk</h3>
                      <p className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider">Private Audit Protocol</p>
                    </div>

                    <p className="text-[10px] text-gray-500 leading-relaxed text-center bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      Ratings under 4 stars represent a quality anomaly. Instead of publishing directly, your audit feedback registers securely in our private board so our compliance head can investigate directly.
                    </p>

                    <div className="space-y-2">
                      <div className="space-y-1">
                        <label className="text-[8.5px] uppercase font-black text-gray-400 block">Sourced Segment</label>
                        <div className="bg-gray-50 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 border border-gray-100 flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5 text-[#4b6334]" />
                          {selectedCategory}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8.5px] uppercase font-black text-gray-400 block">Remarks & Concerns</label>
                        <textarea 
                          required 
                          value={inputFeedback}
                          onChange={(e) => setInputFeedback(e.target.value)}
                          className="w-full h-24 p-2.5 bg-gray-50 rounded-lg border border-gray-150 text-xs focus:ring-1 focus:ring-[#4b6334]/20 focus:outline-none text-gray-700 leading-relaxed" 
                          placeholder="Please provide details about glove sizing, certification logs, or customs delay..." 
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <button 
                        type="submit" 
                        disabled={isSubmittingFeedback} 
                        className="w-full py-2.5 bg-neutral-900 hover:bg-black text-white rounded-lg text-xs font-black uppercase tracking-widest disabled:opacity-40 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {isSubmittingFeedback ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Logging Secure Audit...
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            File Private Resolution Audit
                          </>
                        )}
                      </button>
                      
                      <button 
                        type="button" 
                        onClick={() => setView('selector')} 
                        className="w-full text-[9px] font-bold uppercase text-gray-400 hover:text-gray-600 transition-colors py-1 cursor-pointer"
                      >
                        Cancel and review stars
                      </button>
                    </div>

                  </form>
                </motion.div>
              )}

              {/* STATE 4.5: SUCCESS FEEDBACK STAGE */}
              {view === 'success-feedback' && (
                <motion.div 
                  key="success-feedback-state"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col justify-center items-center text-center p-6 space-y-5"
                >
                  <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-200 shadow-inner">
                    <ShieldCheck className="w-7 h-7 stroke-[2.5]" />
                  </div>
                  <div className="space-y-2 max-w-sm">
                    <h3 className="text-sm font-black text-gray-800 tracking-tight uppercase">Audit Lodged Successfully</h3>
                    <p className="text-[9px] text-emerald-700 font-extrabold uppercase tracking-widest bg-emerald-50/80 px-2 py-0.5 rounded inline-block border border-emerald-150">
                      Private Resolution Active
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed pt-1.5">
                      Your feedback has been delivered securely to the Manshav Impex compliance & board of directors. A representative will review your trade logs immediately.
                    </p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      setUserRating(5); 
                      setView('selector');
                    }}
                    className="px-6 py-2.5 bg-neutral-900 hover:bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                  >
                    Back to Generator
                  </button>
                </motion.div>
              )}

              {/* STATE 5: ERROR STAGE */}
              {view === 'error' && (
                <motion.div 
                  key="error-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col justify-center items-center text-center p-6 space-y-4"
                >
                  <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center border border-red-150">
                    <X className="w-6 h-6 text-rose-500" />
                  </div>
                  <div className="space-y-1 max-w-xs">
                    <h3 className="text-xs font-black tracking-tight text-gray-900 uppercase">AI Compilation Fault</h3>
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                      Lacking external connection or the API key expired. Choose parameters and click to use the robust local generator fallback!
                    </p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setView('selector')} 
                    className="px-4 py-2 bg-[#4b6334] hover:bg-[#344624] text-white rounded-lg text-[10px] font-black uppercase tracking-wider"
                  >
                    Back to Form
                  </button>
                </motion.div>
              )}

            </AnimatePresence>

            {/* INTEGRATED MODERN CLIPBOARD NOTIFIER */}
            <AnimatePresence>
              {isCopying && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-[#4b6334]/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-6"
                >
                   <motion.div 
                     initial={{ scale: 0.95, y: 10 }} 
                     animate={{ scale: 1, y: 0 }} 
                     className="space-y-4 max-w-sm bg-white p-6 rounded-2xl shadow-xl border border-gray-100"
                   >
                     <div className="w-10 h-10 bg-amber-50 rounded-full mx-auto flex items-center justify-center text-[#D3A243] border border-amber-200">
                        <Star className="w-5 h-5 fill-[#D3A243]" />
                     </div>
                     
                     <div className="space-y-1">
                       <h2 className="text-sm font-black text-gray-900 uppercase tracking-tight">Draft Copied Automatically!</h2>
                       <p className="text-[10px] text-[#4b6334] font-extrabold uppercase tracking-wide">Clipboard Ready for Paste</p>
                       <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mt-2">
                          <motion.div 
                            initial={{ x: '-100%' }} 
                            animate={{ x: '0%' }} 
                            transition={{ duration: 5, ease: 'linear' }} 
                            className="h-full bg-[#D3A243]" 
                          />
                       </div>
                     </div>

                     <div className="text-left bg-amber-50/50 p-3 rounded-xl border border-amber-100 text-[10px] text-gray-600 leading-relaxed space-y-2">
                       <p className="font-semibold text-amber-900 flex items-center gap-1">
                         <Info className="w-3.5 h-3.5 text-[#D3A243] shrink-0" />
                         Google Security Policy Note:
                       </p>
                       <p>
                         To protect user security, Google does not allow any external website to automatically insert text or choose stars on their page for you.
                       </p>
                       <p>
                         <strong>It takes just 2 simple taps on Google:</strong>
                         <br />
                         1. Select <strong className="text-amber-600">5 Stars</strong>.
                         <br />
                         2. Long-press or right-click the text box and tap <strong className="text-amber-600">Paste</strong>.
                       </p>
                     </div>

                     <div className="flex flex-col gap-1.5 pt-1">
                       <a 
                         href={COMPANY_DETAILS.reviewLink}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="w-full py-2.5 bg-[#4b6334] hover:bg-[#384a26] text-white font-extrabold text-[10px] uppercase rounded-lg shadow flex items-center justify-center gap-1 cursor-pointer"
                       >
                         Open Google & Paste Now
                         <ExternalLink className="w-3 h-3" />
                       </a>
                       <button 
                         type="button"
                         onClick={() => setIsCopying(false)} 
                         className="text-gray-400 text-[8.5px] font-bold uppercase hover:text-gray-600 py-1 cursor-pointer focus:outline-none"
                       >
                         Back to Review Generator
                       </button>
                     </div>
                   </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

      </main>

      {/* Rich Informational Corporate Footer - Expanded Wider, Clean Layout */}
      <footer className="mt-auto bg-white border-t border-gray-100 pt-8 pb-6 px-4 md:px-8 shadow-inner">
        <div className="max-w-[1500px] mx-auto space-y-6">
          
          {/* Main Informational Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-gray-500 leading-relaxed border-b border-gray-50 pb-6">
            
            {/* Column 1: Corporate Profile */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[#4b6334] uppercase tracking-wider text-[11px]">Manshav Export Profile</span>
              </div>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Leading medical and surgical equipment exporter in Surat, Gujarat, India. Standard-compliant, ISO certified sterile shipping and dependable long term global packaging.
              </p>
              <div className="space-y-1.5 pt-1 text-[11px]">
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#4b6334] shrink-0 mt-0.5" />
                  <span className="text-gray-600 leading-tight">{COMPANY_DETAILS.address}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#4b6334] shrink-0" />
                  <a href={`tel:${COMPANY_DETAILS.phone}`} className="text-gray-600 hover:text-[#4b6334] font-bold">{COMPANY_DETAILS.phone}</a>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#4b6334] shrink-0" />
                  <a href={`mailto:${COMPANY_DETAILS.email}`} className="text-gray-600 hover:text-[#4b6334] font-bold">{COMPANY_DETAILS.email}</a>
                </div>
              </div>
            </div>

            {/* Column 2: Export Products & Regulatory Compliance */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-black uppercase text-gray-800 tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#4b6334]" />
                Primary Product Offerings
              </h4>
              <ul className="space-y-1.5 text-[11px]">
                {PRODUCTS.map((prod, idx) => (
                  <li key={idx} className="flex items-center justify-between text-gray-600 border-b border-gray-50 pb-0.5">
                    <span className="font-semibold flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[#4b6334]" />
                      {prod.name}
                    </span>
                    <span className="text-[9px] text-[#D3A243] font-bold">certified quality</span>
                  </li>
                ))}
              </ul>
              <div className="pt-1">
                <span className="inline-block px-2 py-0.5 bg-[#4b6334]/5 text-[#4b6334] font-extrabold text-[9px] rounded border border-[#4b6334]/10">
                  ISO & GMP Standards Active
                </span>
              </div>
            </div>

            {/* Column 3: Logistics Hubs & Local Review Tips */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-black uppercase text-gray-800 tracking-wider flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#4b6334]" />
                Logistics & Search SEO Tips
              </h4>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                <strong>Ports Served:</strong> Mundra Port & Nhava Sheva. Premium sourcing of high-grade surgical components secured globally.
              </p>
              <div className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/40 space-y-1">
                <h5 className="text-[9px] font-extrabold text-[#D3A243] uppercase tracking-wider flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Google Maps SEO Booster
                </h5>
                <p className="text-[9px] text-amber-900 leading-normal">
                  Reviews containing keywords like <strong>Surat</strong>, <strong>medical supplies</strong>, <strong>India based</strong>, <strong>certified</strong>, and <strong>long term partner</strong> are weighted 2.5x higher.
                </p>
              </div>
            </div>

          </div>

          {/* Copyright, Policy & Subtext bar */}
          <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            <div>
              © 2026 {COMPANY_DETAILS.name} Private Limited. All Rights Reserved.
            </div>
            <div className="flex items-center gap-4">
              <a href={`http://${COMPANY_DETAILS.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#4b6334] flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-[#4b6334]" />
                {COMPANY_DETAILS.website}
              </a>
              <span>•</span>
              <span className="text-gray-500 font-extrabold">Surat, Gujarat, India</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
