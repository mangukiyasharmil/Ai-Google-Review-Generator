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
  Phone
} from 'lucide-react';
import { generateReview } from './services/geminiService';

const COMPANY_DETAILS = {
  name: 'Manshav Impex',
  address: 'D-1, Yogi Nagar, Nr.Silver Business Hub, Simada, Surat.',
  reviewLink: "https://g.page/r/CSKJ8gzzeF6GEAE/review",
  mapLink: "https://www.google.com/maps?cid=9682334800361228834",
  phone: "9898273226",
  website: "manshavimpex.com"
};

const PRODUCTS = [
  { name: "Surgical Gloves", icon: BadgeCheck },
  { name: "Medical Apparels", icon: ShieldCheck },
  { name: "Orthopedic Implants", icon: Package },
  { name: "Dental Equipment", icon: Star },
  { name: "Surgical Instruments", icon: TrendingUp }
];

// Logo Component: Refined to match eagle logo with stripes and brand text
const ManshavLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 400 400" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Eagle Body & Head */}
    <path 
      d="M200 85C210 75 215 80 220 85L215 100L200 105L185 100L180 85C185 80 190 75 200 85Z" 
      fill="#435d32" 
    />
    {/* Wings */}
    <path 
      d="M200 105L50 55L60 185C120 165 180 145 200 135V105Z" 
      fill="#435d32" 
    />
    <path 
      d="M200 105L350 55L340 185C280 165 220 145 200 135V105Z" 
      fill="#435d32" 
    />
    {/* Stripes on Left Wing (Thick blocky stripes) */}
    <path d="M70 85 L150 105 L145 115 L65 95 Z" fill="white" />
    <path d="M80 115 L160 135 L155 145 L75 125 Z" fill="white" />
    <path d="M90 145 L170 165 L165 175 L85 155 Z" fill="white" />
    
    {/* Stripes on Right Wing (Symmetric) */}
    <path d="M330 85 L250 105 L255 115 L335 95 Z" fill="white" />
    <path d="M320 115 L240 135 L245 145 L325 125 Z" fill="white" />
    <path d="M310 145 L230 165 L235 175 L315 155 Z" fill="white" />

    {/* Tail - V Shape */}
    <path d="M200 135L170 205L200 185L230 205L200 135Z" fill="#435d32" />
    
    {/* Brand Text: Ultra bold sans-serif */}
    <text 
      x="200" 
      y="280" 
      textAnchor="middle" 
      fill="#435d32" 
      style={{ fontSize: '72px', fontWeight: '900', fontFamily: 'Arial Black, sans-serif' }}
    >
      MANSHAV
    </text>
  </svg>
);

const CATEGORIES = [
  { id: 'Product Quality', label: 'Product Quality', icon: BadgeCheck },
  { id: 'Packaging & Export', label: 'Packaging & Export', icon: Package },
  { id: 'Delivery & Timeliness', label: 'Delivery & Timeliness', icon: Truck },
  { id: 'Communication & Support', label: 'Communication & Support', icon: MessageSquare },
  { id: 'Pricing & Value', label: 'Pricing & Value', icon: TrendingUp },
  { id: 'Compliance & Certs', label: 'Compliance & Certs', icon: BadgeCheck },
  { id: 'Long-Term Partnership', label: 'Long-Term Partnership', icon: Handshake },
  { id: 'Overall Experience', label: 'Overall Experience', icon: Star },
];

const EXPERIENCE_LEVELS = [
  { id: 'good', label: 'Good' },
  { id: 'great', label: 'Great' },
  { id: 'excellent', label: 'Excellent' },
] as const;

const LENGTHS = [
  { id: 'short', label: 'Short' },
  { id: 'medium', label: 'Medium' },
  { id: 'detailed', label: 'Detailed' },
] as const;

type View = 'selector' | 'generating' | 'review' | 'feedback' | 'error';

export default function App() {
  const [view, setView] = useState<View>('selector');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [experience, setExperience] = useState<"good" | "great" | "excellent">('excellent');
  const [length, setLength] = useState<"short" | "medium" | "detailed">('medium');
  const [generatedReview, setGeneratedReview] = useState<string>('');
  const [isCopying, setIsCopying] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const currentReviewLink = COMPANY_DETAILS.reviewLink;

  const handleGenerate = async () => {
    if (!selectedCategory) return;
    if (experience === 'good') {
      setView('feedback');
      return;
    }

    setView('generating');
    try {
      const reviewText = await generateReview({
        category: selectedCategory,
        tone: experience,
        length: length
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
      window.open(currentReviewLink, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error('Failed to copy text: ', err);
      window.open(currentReviewLink, '_blank', 'noopener,noreferrer');
    }
  };

  const handleInternalFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingFeedback(true);
    setTimeout(() => {
      setIsSubmittingFeedback(false);
      alert("Feedback submitted!");
      setView('selector');
    }, 1500);
  };

  return (
    <div className="h-screen bg-manshav-cream text-manshav-ink font-sans overflow-hidden flex flex-col selection:bg-manshav-green/10">
      {/* Header (Compact) */}
      <header className="py-2 px-6 bg-white border-b border-manshav-ink/5 shrink-0 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <ManshavLogo className="w-10 h-10" />
          <div className="leading-tight">
            <h1 className="font-serif font-black text-lg tracking-tight text-manshav-green">Manshav Review Generator</h1>
            <p className="text-[9px] text-manshav-ink/40 font-black uppercase tracking-widest italic">Export SEO Optimizer</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-manshav-ink/60">
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3 text-manshav-green" />
            <span>Surat, Gujarat, India</span>
          </div>
          <a 
            href={`http://${COMPANY_DETAILS.website}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-manshav-green transition-colors"
          >
            <Globe className="w-3 h-3 text-manshav-green" />
            <span>{COMPANY_DETAILS.website}</span>
          </a>
          <a 
            href={`tel:${COMPANY_DETAILS.phone}`}
            className="flex items-center gap-2 hover:text-manshav-green transition-colors"
          >
            <Phone className="w-3 h-3 text-manshav-green" />
            <span>{COMPANY_DETAILS.phone}</span>
          </a>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex flex-col lg:flex-row shadow-inner">
        {/* Left Sidebar (Addresses & Info) */}
        <aside className="w-full lg:w-64 bg-white border-r border-manshav-ink/5 p-5 flex flex-col shrink-0 gap-6 overflow-y-auto">
          <section className="space-y-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-manshav-green">Our Headquarters</h3>
            <p className="text-[11px] leading-relaxed text-manshav-ink font-semibold bg-manshav-cream/30 p-3 rounded-xl border border-manshav-ink/10 shadow-sm">
              {COMPANY_DETAILS.address}
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-manshav-green">Contact Details</h3>
            <div className="space-y-2">
              <a 
                href={`tel:${COMPANY_DETAILS.phone}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-manshav-green/5 hover:bg-manshav-green/10 transition-all border border-manshav-green/10 group"
              >
                <Phone className="w-4 h-4 text-manshav-green group-hover:scale-110 transition-transform" />
                <span className="text-sm font-black text-manshav-ink">{COMPANY_DETAILS.phone}</span>
              </a>
              <a 
                href={`http://${COMPANY_DETAILS.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-manshav-green/5 hover:bg-manshav-green/10 transition-all border border-manshav-green/10 group"
              >
                <Globe className="w-4 h-4 text-manshav-green group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-manshav-ink">{COMPANY_DETAILS.website}</span>
              </a>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-manshav-green">Our Products</h3>
            <div className="grid grid-cols-1 gap-1.5">
              {PRODUCTS.map((prod, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100 transition-all hover:bg-manshav-green/5">
                  <prod.icon className="w-3 h-3 text-manshav-green" />
                  <span className="text-[10px] font-bold text-manshav-ink/80">{prod.name}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-auto pt-6 border-t border-manshav-ink/5">
            <div className="p-4 bg-manshav-ink text-white rounded-2xl shadow-xl shadow-manshav-ink/20 relative overflow-hidden group">
              <div className="relative z-10 space-y-1">
                <p className="text-[10px] font-black leading-tight uppercase tracking-widest text-manshav-green">Certified Exporter</p>
                <p className="text-[9px] text-white/50 leading-tight">Trusted by global healthcare leaders.</p>
              </div>
              <ShieldCheck className="w-12 h-12 absolute -right-4 -bottom-4 text-white/5 group-hover:scale-110 transition-transform" />
            </div>
          </div>
        </aside>

        {/* Dashboard Center */}
        <div className="flex-1 overflow-hidden flex flex-col bg-[#F9F7F4] relative">
          <AnimatePresence mode="wait">
            {view === 'selector' && (
              <motion.div 
                key="selector"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-6 p-6"
              >
                {/* Gen Options */}
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-xl font-serif font-black tracking-tight">Generate Endorsement</h2>
                    <p className="text-[10px] text-manshav-ink/40 font-bold uppercase tracking-widest">Select context from your recent shipment</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all gap-2 relative group overflow-hidden ${
                          selectedCategory === cat.id 
                            ? 'bg-manshav-ink text-white border-manshav-ink shadow-xl ring-2 ring-manshav-green' 
                            : 'bg-white border-manshav-ink/5 text-manshav-ink/60 hover:border-manshav-green/40'
                        }`}
                      >
                        <cat.icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${selectedCategory === cat.id ? 'text-manshav-green' : 'text-manshav-ink/20'}`} />
                        <span className="text-[9px] font-black uppercase tracking-tighter text-center leading-none">{cat.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-manshav-green uppercase tracking-[0.2em] ml-1">Service Rank</label>
                       <div className="flex bg-white p-1 rounded-xl border border-manshav-ink/5">
                          {EXPERIENCE_LEVELS.map(lvl => (
                            <button 
                              key={lvl.id}
                              onClick={() => setExperience(lvl.id)}
                              className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${experience === lvl.id ? 'bg-manshav-green text-white shadow-sm' : 'text-manshav-ink/30 hover:text-manshav-ink/60'}`}
                            >
                              {lvl.label}
                            </button>
                          ))}
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-manshav-green uppercase tracking-[0.2em] ml-1">Draft Depth</label>
                       <div className="flex bg-white p-1 rounded-xl border border-manshav-ink/5">
                          {LENGTHS.map(ln => (
                            <button 
                              key={ln.id}
                              onClick={() => setLength(ln.id)}
                              className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${length === ln.id ? 'bg-manshav-green text-white shadow-sm' : 'text-manshav-ink/30 hover:text-manshav-ink/60'}`}
                            >
                              {ln.label}
                            </button>
                          ))}
                       </div>
                    </div>
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={!selectedCategory}
                    className="w-full py-4 md:py-5 bg-manshav-ink text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl relative overflow-hidden group disabled:opacity-30 active:scale-[0.98] transition-all"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Initialize AI Drafter <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-manshav-green translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                  </button>
                </div>

                {/* Right Panel Placeholder */}
                <div className="bg-white rounded-3xl border border-manshav-ink/5 p-6 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                  <div className="w-12 h-12 bg-manshav-cream rounded-full flex items-center justify-center">
                    <Info className="w-6 h-6 text-manshav-ink/20" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
                    Once generated,<br/>your draft will appear here<br/>for final verification.
                  </p>
                </div>
              </motion.div>
            )}

            {view === 'generating' && (
              <motion.div key="gen" className="flex-1 flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <div className="w-12 h-12 border-2 border-manshav-green/10 rounded-full" />
                  <Loader2 className="w-12 h-12 text-manshav-green animate-spin absolute inset-0" />
                </div>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-manshav-ink/30 animate-pulse">Processing Export Data...</p>
              </motion.div>
            )}

            {view === 'review' && (
              <motion.div 
                key="review"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 p-6 md:p-8 flex flex-col max-w-2xl mx-auto w-full gap-6 overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <button onClick={() => setView('selector')} className="text-[9px] font-black uppercase tracking-widest text-manshav-ink/30 hover:text-manshav-green transition-colors">← Back to Options</button>
                  <p className="text-[9px] font-black uppercase tracking-widest text-manshav-green">Draft Ready</p>
                </div>

                <div className="flex-1 bg-white rounded-3xl p-6 shadow-2xl shadow-manshav-ink/5 border border-manshav-ink/10 relative group flex flex-col transition-all hover:shadow-manshav-green/5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-3 bg-manshav-green rounded-full" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-manshav-green">Professional Review Draft</span>
                  </div>
                  <textarea 
                    value={generatedReview}
                    onChange={(e) => setGeneratedReview(e.target.value)}
                    className="flex-1 w-full bg-slate-50 p-6 rounded-2xl focus:outline-none font-sans text-sm font-semibold leading-relaxed text-manshav-ink shadow-inner border border-slate-100"
                  />
                  <div className="absolute top-6 right-8 opacity-[0.03]">
                    <ManshavLogo className="w-24 h-24" />
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={handlePostOnGoogle}
                    className="w-full py-5 bg-manshav-green scale-100 hover:scale-[1.01] active:scale-[0.98] text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-manshav-green/30 hover:brightness-110 transition-all flex items-center justify-center gap-3"
                  >
                    100% AUTO COPY & OPEN GOOGLE
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <p className="text-[9px] text-center text-manshav-ink underline font-bold uppercase tracking-tighter">
                    Note: Google requires a final 'Paste' (Ctrl+V) for user security.
                  </p>
                </div>
              </motion.div>
            )}

            {view === 'feedback' && (
              <motion.div key="feed" className="flex-1 flex items-center justify-center p-6">
                <form onSubmit={handleInternalFeedback} className="bg-white p-8 rounded-3xl border border-manshav-ink/5 shadow-2xl max-w-sm w-full space-y-6">
                   <div className="text-center space-y-2">
                     <h3 className="text-xl font-serif font-black">Help Us Improve</h3>
                     <p className="text-[10px] text-manshav-ink/40 font-bold uppercase tracking-widest">Share your feedback privately</p>
                   </div>
                   <textarea required className="w-full h-32 p-4 bg-manshav-cream/20 rounded-xl border border-manshav-ink/5 text-xs focus:outline-none focus:border-manshav-green" placeholder="Tell us more about your experience..." />
                   <button type="submit" disabled={isSubmittingFeedback} className="w-full py-3 bg-manshav-ink text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-manshav-green">
                     {isSubmittingFeedback ? 'Submitting...' : 'Submit to Management'}
                   </button>
                   <button type="button" onClick={() => setView('selector')} className="w-full text-[9px] font-black uppercase text-manshav-ink/20">Nevermind</button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* PASTE OVERLAY */}
          <AnimatePresence>
            {isCopying && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-manshav-green flex flex-col items-center justify-center text-center p-8 lg:p-12"
              >
                 <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="space-y-8 max-w-sm">
                   <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center text-manshav-green">
                      <Check className="w-10 h-10 stroke-[3px]" />
                   </div>
                   <div className="space-y-2">
                     <h2 className="text-3xl font-serif font-black text-white italic tracking-tighter uppercase whitespace-nowrap">Text Copied!</h2>
                     <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                        <motion.div initial={{ x: '-100%' }} animate={{ x: '0%' }} transition={{ duration: 5 }} className="h-full bg-white" />
                     </div>
                   </div>
                   <div className="p-6 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-sm">
                      <p className="text-white text-base font-bold leading-tight">
                        The Google Review page is open. Just <span className="bg-white text-manshav-green px-2 rounded">Paste</span> (Ctrl + V) your draft there.
                      </p>
                   </div>
                   <button onClick={() => setIsCopying(false)} className="text-white/40 text-[9px] font-black uppercase tracking-widest hover:text-white transition-colors">Dismiss Message</button>
                 </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer (Bar) */}
      <footer className="py-2 px-6 bg-white border-t border-manshav-ink/5 flex items-center justify-between shrink-0">
         <p className="text-[8px] font-black text-manshav-ink/20 uppercase tracking-[0.4em]">© 2026 Manshav Impex | Precision Handling</p>
         <div className="flex gap-4 opacity-10 grayscale scale-75">
            <Package className="w-4 h-4" />
            <Truck className="w-4 h-4" />
            <Handshake className="w-4 h-4" />
         </div>
      </footer>
    </div>
  );
}
