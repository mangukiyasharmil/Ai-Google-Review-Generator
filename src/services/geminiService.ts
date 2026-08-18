import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

function getAiInstance() {
  if (aiInstance) return aiInstance;

  // Check for environment variable safely
  let apiKey: string | undefined;
  
  // 1. Try VITE_ prefixed env (Standard Vite)
  apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;

  // 2. Try process.env (Vite define fallback)
  if (!apiKey && typeof process !== 'undefined' && process.env) {
    apiKey = (process.env as any).GEMINI_API_KEY;
  }

  if (!apiKey) {
    console.warn("GEMINI_API_KEY / VITE_GEMINI_API_KEY not found.");
    return null;
  }

  try {
    aiInstance = new GoogleGenAI({ apiKey });
    return aiInstance;
  } catch (err) {
    console.error("Failed to initialize GoogleGenAI:", err);
    return null;
  }
}

export function hasApiKey(): boolean {
  // Check standard Vite and process environments
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || 
                 (typeof process !== 'undefined' && process.env && (process.env as any).GEMINI_API_KEY);
  return !!apiKey;
}

export type ReviewLanguage = "english" | "gujinglish" | "hinglish";

export interface ReviewRequest {
  category: string;
  tone: "good" | "great" | "excellent";
  length: "short" | "medium" | "detailed" | "comprehensive";
  language: ReviewLanguage;
  humanize: boolean;
}

// Typo Injector to make writing look authentic, organic, and bypass AI filters
export function injectNaturalTypos(text: string): string {
  const commonTypos: Record<string, string> = {
    "received": "recieved",
    "excellent": "excelent",
    "delivery": "delivry",
    "quality": "quallity",
    "professional": "profesional",
    "recommended": "recomended",
    "exporter": "exportor",
    "products": "prodcuts",
    "equipment": "equitment",
    "surgical": "surgicle",
    "communication": "comunication",
    "instruments": "insturments",
    "partnership": "partnerhip",
    "completely": "completly",
    "impeccable": "impecable",
    "extremely": "extremly",
    "certified": "certfied",
    "supplies": "suplies",
    "hospital": "hospitel",
    "guarantee": "gurantee",
    "definitely": "definatly",
    "service": "sevice",
    "prompt": "promt",
    "schedule": "scheduel",
    "packaging": "packging",
    "material": "materal",
    "medical": "medicle",
    "partner": "partnr",
    "experience": "experiance",
    "international": "internatinal",
    "business": "bussiness",
    "truly": "truely"
  };

  let words = text.split(" ");
  let typoCount = 0;

  let newWords = words.map((word) => {
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, "");
    if (commonTypos[cleanWord] && typoCount < 2) {
      typoCount++;
      const typo = commonTypos[cleanWord];
      const match = word.match(/^([^a-zA-Z]*)(.*?)([^a-zA-Z]*)$/);
      const leading = match ? match[1] : "";
      const trailing = match ? match[3] : "";
      const body = match ? match[2] : word;

      let res = typo;
      if (body.charAt(0) === body.charAt(0).toUpperCase()) {
        res = typo.charAt(0).toUpperCase() + typo.slice(1);
      }
      return leading + res + trailing;
    }
    return word;
  });

  // If no typos from dictionary were injected, introduce 1 subtle character swap
  if (typoCount === 0 && newWords.length > 4) {
    const candidateIndices: number[] = [];
    newWords.forEach((w, idx) => {
      const clean = w.replace(/[^a-zA-Z]/g, "");
      if (clean.length >= 6 && !clean.toLowerCase().includes("manshav") && !clean.toLowerCase().includes("impex")) {
        candidateIndices.push(idx);
      }
    });

    if (candidateIndices.length > 0) {
      const targetIdx = candidateIndices[Math.floor(Math.random() * candidateIndices.length)];
      let wordToModify = newWords[targetIdx];
      let chars = wordToModify.split("");
      for (let j = 2; j < chars.length - 2; j++) {
        if (/[a-zA-Z]/.test(chars[j]) && /[a-zA-Z]/.test(chars[j + 1]) && chars[j] !== chars[j + 1]) {
          let temp = chars[j];
          chars[j] = chars[j + 1];
          chars[j + 1] = temp;
          newWords[targetIdx] = chars.join("");
          break;
        }
      }
    }
  }

  return newWords.join(" ");
}

const OFFLINE_DB: Record<string, Record<ReviewLanguage, { starters: string[]; middles: string[]; endings: string[] }>> = {
  'Product Quality': {
    english: {
      starters: [
        "We received our shipment of medical supplies, and the standard of product quality is absolutely stunning.",
        "If you're seeking a high-quality medical equipment exporter, Manshav Impex is undoubtedly the premium choice in Gujarat.",
        "Our hospital has been sourcing surgical instruments and premium gloves from Manshav Impex with impeccable results."
      ],
      middles: [
        "Every single item meets the strict regulatory standards we require for overseas distribution.",
        "Their production precision is unmatched—every package of gloves and apparel is perfectly sterile and durable.",
        "It is rare to find a supplier that combines rigorous ISO compliance with immaculate durability so consistently."
      ],
      endings: [
        "This is the Best Manshav Impex Review we can write for their exceptional manufacturing standards!",
        "They have officially earned our complete trust as a trusted international trading partner Surat.",
        "Highly recommended for any B2B buyers looking for superior quality medical gear."
      ]
    },
    gujinglish: {
      starters: [
        "Manshav Impex ni medical product quality kharekhar bov j saras chhe, original material chhe.",
        "Surat ma surgical instruments ane gloves export mate direct manufacturer shodhta hoy to aahi j javu.",
        "Glove ni quality ane durable packaging ekdam premium level ni chhe, hospital mate heavy chalya."
      ],
      middles: [
        "Koipani item ma break ke defect nathi malti, ISO standards barabar maintain thaya chhe.",
        "Production accuracy no koi jawab nathi, sterile items ekdam safe packing ma aave chhe.",
        "Aakhha Gujarat ma aavu genuine quality medical gear badhe nathi maltu, proper quality chhe."
      ],
      endings: [
        "Best Manshav Impex Review badhi premium materials mate, full rating chhe mara tarf thi!",
        "Surat no ekdam trusted international trading partner, reliable deal thai.",
        "Highly recommended chhe badha B2B buyers ane healthcare clinics mate."
      ]
    },
    hinglish: {
      starters: [
        "Manshav Impex se surgical supplies receive hui hai, quality such me bahut hi zabardast hai.",
        "Agar aap ek top medical products exporter in Surat dhoond rahe hain, toh Manshav Impex best choice hai.",
        "Humare hospital ke liye surgical instruments and premium gloves inke paas se bulk me mangwaye hain."
      ],
      middles: [
        "Sari items international standard ke mutabik hain, durability ki koi shikayat nahi hai.",
        " Gloves and apparel ki packing fully sterile aur strong hai, long cargo travel me bhi damage nahi hua.",
        "Puri team bohot professional hai aur production standard bilkul top level ka rakhte hain."
      ],
      endings: [
        "This is the Best Manshav Impex Review for their supreme quality and genuine dealings.",
        "Surat ka trusted international trading partner hai, aankh band karke deal kar sakte hain.",
        "Har ek B2B medical buyer ko inke sath zarur business karna chahiye."
      ]
    }
  },
  'Packaging & Export': {
    english: {
      starters: [
        "The logistics and container packing provided by Manshav Impex are absolutely flawless and secure.",
        "Manshav Impex is a highly reliable export company in India that sets the bar for cleanroom packaging.",
        "Excellent B2B packing! Our consignment arrived with sterile barriers completely pristine and intact."
      ],
      middles: [
        "They provide premium double-walled cartons with reliable moisture barriers, ensuring products survive long ocean transits.",
        "From custom-labeled boxes to detailed packing sheets, their custom export documentation is always impeccable.",
        "Their specialized handling of sensitive orthopedic implants and surgical gear is incredibly secure."
      ],
      endings: [
        "Clearly, their commitment to bespoke healthcare logistics is what makes them stand out globally.",
        "This is the Best Manshav Impex Review for any importer wanting secure, hassle-free shipping.",
        "A fantastic partner that makes international shipping completely seamless and safe."
      ]
    },
    gujinglish: {
      starters: [
        "Export packaging ane transport handling Manshav Impex nu khub j strong chhe.",
        "Container packaging barabar double layer packing sathe aave chhe, moist moisture barrier perfect rakhyu hatu.",
        "Impex goods perfectly box packing ma deliver thaya, single wrap pan toote-lo nahto."
      ],
      middles: [
        "Surgical items ane orthopedic goods ni sterile custom labeling perfect hatu custom clearance mate.",
        "Cargo clearance na documents ane certification transparently time par forward kare chhe.",
        "Surat thi export handling full safely manage thay chhe, worry karvani jarur nathi rehti."
      ],
      endings: [
        "Bespoke Healthcare Logistics and packaging mate aana thi best company aakhha Surat ma nathi.",
        "Best Manshav Impex Review for super safe export shipping work! Fully satisfied.",
        "Global trade na badha normal rules complete follow kare chhe, trusted partner chhe."
      ]
    },
    hinglish: {
      starters: [
        "Packaging aur shipping logistics to Manshav Impex ka sach me ekdam expert quality ka hai.",
        "Cleanroom certification aur double carton packaging dekhkar hume bohot khushi hui.",
        "B2B order ka logistics and container sealing ekdam clean aur securely packed tha."
      ],
      middles: [
        "Inki export packing moisture proof aur sturdy hoti hai, maritime transits me bhi safe rehti hai.",
        "Export related custom matching documents sab perfect thayar karke dete hain, tension bilkul nahi hota.",
        "Surgical and orthopedic equipments securely bubble wrapped and custom padded rehte hain."
      ],
      endings: [
        "International standards of custom packaging is what makes them the best exporter in Surat.",
        "Best Manshav Impex Review for hassle-free shipping and secure export consignments.",
        "Highly recommended for overseas bulk shipping of medical supplies."
      ]
    }
  },
  'Delivery & Timeliness': {
    english: {
      starters: [
        "We were on a tight schedule for our hospital bidding, and Manshav Impex excelled in shipping speed.",
        "When it comes to speed and schedule adherence, Manshav Impex is the top medical products exporter in Surat.",
        "Punctual delivery and real-time tracking from Surat all the way to our port."
      ],
      middles: [
        "They synchronized air cargo routes seamlessly to get our surgical instruments delivered ahead of schedule.",
        "For prompt service and zero customs hassle, they have proven themselves to be incredibly professional.",
        "Their freight management team kept us updated at every customs milestone, presenting true transparency."
      ],
      endings: [
        "They have proven themselves as a highly reliable export company in India.",
        "Truly the most reliable global medical trade partner we have ever collaborated with.",
        "If you need medical gear on a strict timeline, they are the vendor to trust."
      ]
    },
    gujinglish: {
      starters: [
        "Delivery timing ni baabat ma Manshav Impex Surat ma sauthi fast exporter chhe.",
        "Tension free deal rahi, timely shipment dispatch and perfect transshipment clearance thaye.",
        "Amne urgent order hti surgical accessories ni, but aemne proper time par deliver kari didhi."
      ],
      middles: [
        "Air freight routes proper plan kare chhe and customized cargo fast clear thai chhe.",
        "Local trade milestones map thaya and accurate location guidance instant mali jaty.",
        "Direct Surat thi port loading smooth speed ma thay chhe vagar delay."
      ],
      endings: [
        "Fari bulk order karishu, timing mate full trusting company chhe safe transport.",
        "Best Manshav Impex Review for prompt time tracking in custom delivery solutions.",
        "Best global medical trade partner chhe for zero delivery delays."
      ]
    },
    hinglish: {
      starters: [
        "Humara order tight timeline par tha aur Manshav Impex ne super fast shipping ensure ki.",
        "On-time packaging dispatch and clear tracking support is what they are famous for.",
        "Delivery schedule committed date se pehle hi complete ho gaya, exceptional service!"
      ],
      middles: [
        "Surgical gear ko fast-track air route se rawana kiya taki custom delays bypass ho sake.",
        "Har custom custom clearance update real time me diya jata hai, safe logistics.",
        "B2B supply tracking transparent hai, port transit time bilkul perfect schedule tha."
      ],
      endings: [
        "Truly a highly reliable export company in India with strict delivery standards.",
        "Time management dekh kar hum inke fans ho gaye hain, Surat exporter gold standard.",
        "Highly recommended for time-critical global healthcare delivery."
      ]
    }
  },
  'Communication & Support': {
    english: {
      starters: [
        "The corporate customer success representatives at Manshav Impex provide truly world-class support.",
        "Outstanding customer care! Sourcing from a medical equipment supplier Surat has never been this simple.",
        "From the initial quotation to the final Bill of Lading, communication was fast and highly professional."
      ],
      middles: [
        "They assign a dedicated export manager who is available 24/7 to solve our inquiries and custom order updates.",
        "Their team handles complex product specification sheets with outstanding clarity and professional courtesy.",
        "We received transparent price lists, video inspections, and instant feedback at every step of our negotiation."
      ],
      endings: [
        "They are much more than a dealer—they are an exceptional global medical trade partner.",
        "Their communication alone makes this the Best Manshav Impex Review we've ever composed.",
        "An incredibly polite and dependable team that values long-term client relations."
      ]
    },
    gujinglish: {
      starters: [
        "Manshav Impex na managers sathe negotiation karvu safe and easy chhe, quick response aape chhe.",
        "Khub j polite and active client support chhe, call up par badhi specifications clear kare chhe.",
        "B2B service response instant chhe, export query ane technical sheets khub j sasti clear kari."
      ],
      middles: [
        "Every dispatch process, custom video inspecting, ane production live updates WhatsApp & mail par aape chhe.",
        "Technical support team aakhi regulatory document setup ma support kare chhe direct Surat thi.",
        "Rates proper and clean breakdown sathe explain kare chhe, clear terms."
      ],
      endings: [
        "Commercial medical trading partner ni aavi support service khub j ochi dekhva male chhe.",
        "Best Manshav Impex Review for corporate relationship ane sweet communication!",
        "Thanks team for always cooperating with our bulk demands."
      ]
    },
    hinglish: {
      starters: [
        "Inki customer service aur corporate management sach me aala darje ki hai.",
        "Manshav Impex me dedicated professional support milta hai, response time bohot tez hai.",
        "Bulk orders ka quotation aur specifications clarify karne me inki sales team bohot madad karti hai."
      ],
      middles: [
        "Har buyer ko personalized attention milti hai, dispatch se lekar delivery tak guide kiya.",
        "Koi bhi compliance verification hoto immediate detailed reports and documents share karte hain.",
        "Unyielding support during customs processes, standard professionalism in communications."
      ],
      endings: [
        "This is the Best Manshav Impex Review to appreciate their friendly and supportive staff.",
        "Surat ke top exporter banne ki vajah inka premium management and customer loyalty focus hai.",
        "Will definitely work again, outstanding communication support overall!"
      ]
    }
  },
  'Pricing & Value': {
    english: {
      starters: [
        "Manshav Impex offers highly competitive direct-from-factory pricing for premium medical exports.",
        "For premium medical apparatus, their value proposition is absolutely unmatched in the Indian market.",
        "Combining reasonable wholesale costs with superb product durability is where they truly excel."
      ],
      middles: [
        "They offer highly volume-flexible rates that allow our global distribution agency to maintain healthy margins.",
        "There are no hidden clearance fees or surprise surcharges—just clean, honest pricing from day one.",
        "Sourcing high-quality medical equipment exporter supplies at these rates saves our medical network significant funds."
      ],
      endings: [
        "A supreme medical equipment supplier Surat that respects both your budget and standard requirements.",
        "This is the Best Manshav Impex Review for any clinic looking for great global trade value.",
        "They prove that high B2B standards don't have to carry exorbitant price tags."
      ]
    },
    gujinglish: {
      starters: [
        "Factory direct rates chhe aemna, heavy wholesale discount male chhe margins khali thaya vagar.",
        "India na medical apparatus exporters ma inka pricing structure best value option aape chhe.",
        "High durability gloves ane masks reasonable pricing par madi jaya, solid profit mado."
      ],
      middles: [
        "Surat thi safe pricing ane clear quotations direct invoice par aave chhe, transparent deal.",
        "Volume order par extra flexibility aalelu, hidden cost logic nathi aemna ma.",
        "B2B medical supplies na rates international players thi ghana lower ane stable rakhe chhe."
      ],
      endings: [
        "Lowest rate and best quality medical equipment supplier Surat ma to aa j chhe.",
        "Best Manshav Impex Review for low direct factory price points and honest dealings.",
        "Aankho bandh karine bulk medical orders aapi shako chhe, budget safe raheshe."
      ]
    },
    hinglish: {
      starters: [
        "Bulk wholesale operations ke liye Manshav Impex ke factory rates sach me best hain.",
        "Premium quality standards aur itna pocket-friendly direct pricing milna bohot mushkil hai.",
        "Surat ke exporter markets me value and rates ke mamle me ye log best option provide karte hain."
      ],
      middles: [
        "Surgical apparels and gloves ke items par inka bulk volume discount behtareen hai.",
        "Koi hidden charge ya clearance agent commissions nahi jode jate, transparent invoicing hai.",
        "Hume bulk import me safe profit margin mila inke competitive global supply contract se."
      ],
      endings: [
        "Excellent medical equipment supplier Surat that balances price and elite cleanroom standards.",
        "Best Manshav Impex Review for highly affordable rates with superior medical grading.",
        "B2B trading me pricing and honesty ka perfect combination."
      ]
    }
  },
  'Compliance & Certs': {
    english: {
      starters: [
        "All our import audits require total certification, and Manshav Impex passed every check with flying colors.",
        "They are a fully certified, compliant, and trusted international trading partner Surat.",
        "Their rigorous adherence to CE, ISO, and FDA-equivalent export certs is highly reassuring."
      ],
      middles: [
        "Every box of gloves and surgical wraps carries exact batch tracing IDs and cleanroom documentation.",
        "Their export team provides certified lab testing credentials transparently upon request.",
        "Choosing a certified medical supplier in Surat that takes global hygiene mandates seriously is key."
      ],
      endings: [
        "They are easily the most compliant and reliable export company in India.",
        "This is the Best Manshav Impex Review we can give for regulatory and trade compliance.",
        "You can trust them completely for smooth clearance in any European or American port."
      ]
    },
    gujinglish: {
      starters: [
        "Amara import audit ma badha CE, ISO ane GMP certificates Manshav Impex ae direct verify karavya.",
        "Export licenses and sanitary compliance checking ma inka setup perfect chhe.",
        "Sourcing and customs mate proper legal certifications constant check up thay chhe."
      ],
      middles: [
        "Batch traceability codes labels par properly mark karela hoy chhe cleanroom standards pramane.",
        "Surat base registered exporter chhe, global trade and health regulations pure-pura follow kare chhe.",
        "Documents custom approval mate fast prepare kari aape chhe, zero legal hurdle."
      ],
      endings: [
        "Regulatory compliance mate clean and professional working, top rating in Gujarat.",
        "Best Manshav Impex Review for standard healthcare compliance metrics! Impeccable verification.",
        "Truly a certified exporter that lets you sleep peacefully while cargo travels."
      ]
    },
    hinglish: {
      starters: [
        "Humare international import standards CE and ISO compliance requirements inke certificates se match ho gaye.",
        "Surgical hygiene and cleanroom guidelines ko Manshav Impex bohot seriously implement karta hai.",
        "Compliance documentation is smooth, clear records and regulatory approvals Surat customs level par active hain."
      ],
      middles: [
        "Batch trace codes aur sterile lab tests transparent tarike se packaging boxes par clear diye hote hain.",
        "Surgical apparel standards pure raw material level par fully certified hain.",
        "International logistics clearance aur certifications ke liye export team fully trained aur helpful hai."
      ],
      endings: [
        "Surat me inke jesa genuine legal standards and hygiene focused certified exporter nahi milega.",
        "Best Manshav Impex Review for standard custom certificates and certified safety clearance.",
        "100% compliant partnership guarantees smooth operations in B2B supply chains."
      ]
    }
  },
  'Long-Term Partnership': {
    english: {
      starters: [
        "We have been sourcing and distributing medical goods with Manshav Impex for over three years now.",
        "Establishing a relationship with Manshav Impex was the best trade choice our medical supply firm has made.",
        "For a consistent year-round inventory, they are our absolute favorite export partner."
      ],
      middles: [
        "They sustain consistent product standards from the first batch to the hundredth, which keeps our customers loyal.",
        "As we expand our distribution, they scale up their production timelines without compromising on export detail.",
        "Their trust, integrity, and operational transparency form the bedrock of our stable supply line."
      ],
      endings: [
        "We look forward to many more years of working with our premier global medical trade partner.",
        "They have earned this Best Manshav Impex Review through years of unbroken reliability.",
        "A business built on genuine integrity and mutual growth."
      ]
    },
    gujinglish: {
      starters: [
        "Amne transition mate constant surgical delivery ni help madi, 3 varas thi relation chhe.",
        "Manshav Impex sathe working relation bandhvu ae amaro commercial medical trade mate perfect decision hatu.",
        "Regular medical stock, stable prices state ane trust reliable exporter chhe Surat ma."
      ],
      middles: [
        "Regular inventory management barabar timely supply ensure thay chhe, single slot fill up missing nathi thatu.",
        "Aemni transparent policy ane pricing consistency badhe level par same rehti aavi chhe.",
        "Surat thi non-stop logistics support ane custom loading capacity reliable partnership built kare chhe."
      ],
      endings: [
        "Bhoat j upstanding business ethics chhe aemna, continuous business badhavishu.",
        "Best Manshav Impex Review for outstanding long term supplier partnership standards Surat ma.",
        "Always happy with their consistent B2B export contracts, high recommend!"
      ]
    },
    hinglish: {
      starters: [
        "Hum pichle 3 saalon se Manshav Impex ke sath judey hue hain aur business bohot smooth chal raha hai.",
        "Inke sath long term supply contract sign karna humari medical procurement team ka sabse accha faisla tha.",
        "Consistent inventory levels and loyal buyer agreements humare business ko bohot safe feel karwati hain."
      ],
      middles: [
        "Har mahine bulk shipments aati hain aur material ki finishing and standards hamesha consistent rehti hain.",
        "Inke values aur corporate integrity me kabhi koi kami nahi dikhi, reliable relationships.",
        "Production capacity humari expanding healthcare market demands ke sath scale hoti rehti hai."
      ],
      endings: [
        "Great global trade partner for hospital network supply and consistent material standard.",
        "Best Manshav Impex Review for exceptional trust and steady supply lines for years.",
        "Surat's absolute best medical export partner to grow your business together."
      ]
    }
  },
  'Overall Experience': {
    english: {
      starters: [
        "Choosing Manshav Impex as our global trade partner has been a truly flawless five-star experience.",
        "They are the absolute gold standard when searching for a medical equipment supplier Surat.",
        "An excellent company from the top management to the export logistics staff."
      ],
      middles: [
        "From their state-of-the-art Surat manufacturing to their prompt maritime delivery, everything runs like clockwork.",
        "They combine premium surgical apparel, robust logistics, and transparent B2B communication beautifully.",
        "Their helpful staff makes bulk importing into different countries incredibly straightforward and predictable."
      ],
      endings: [
        "Undoubtedly the top medical products exporter in Surat and India as a whole.",
        "Easily the Best Manshav Impex Review we can write for an exceptional export brand.",
        "Highly recommended to anyone requiring reliable healthcare manufacturing exports."
      ]
    },
    gujinglish: {
      starters: [
        "Manshav Impex sathe kaam karvanu experience kharekhar bov j simple ane flawless hatu.",
        "Aakhi team dhandhadari chhe, surgical business mate highly helpful and standard log chhe.",
        "Gujarat base medical products exporter ma aa company level extreme global class chhe."
      ],
      middles: [
        "Surgical gloves, apparels and medical supply ni wholesale pricing perfect, loading fast.",
        "Import operation full systematic and clean handling sathe clear thai jaske.",
        "Surat office ane custom clearing representatives timing and paperwork full correct rakhe chhe."
      ],
      endings: [
        "Five-star work work! Top medical products exporter in Surat, barabar response.",
        "Best Manshav Impex Review from overseas happy buyer, highly recommended standard!",
        "Future bulk supply mate perfect certified dealer in India."
      ]
    },
    hinglish: {
      starters: [
        "Overall inka service model aur surgical distribution process bohot hi outstanding hai.",
        "Hum inko five-star rating dete hain inke quality products aur prompt processing ke liye.",
        "Surat se lekar pure international logistics routes tak inka processing bohot smooth raha."
      ],
      middles: [
        "Professional customer support, hygienic manufacturing unit and robust export containers.",
        "Bulk medical procurement me inke sath kaam karke double compliance and clear business transparent mila.",
        "Quality maintain rakhne me Surat medical market me kafi high standard rakhte hain."
      ],
      endings: [
        "Easily the Top medical products exporter in Surat Gujarat. Highly impressed!",
        "Best Manshav Impex Review for exceptional B2B services, definitely trustable exporter.",
        "Excellent partner for global B2B medical buyers."
      ]
    }
  }
};

function selectRandom<T>(arr: T[]): T {
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

export function generateOfflineReview(request: ReviewRequest): string {
  const { category, tone, length, language, humanize } = request;
  const dbKey = OFFLINE_DB[category] ? category : 'Overall Experience';
  const langKey = language || "english";
  
  const data = OFFLINE_DB[dbKey][langKey];

  const starter = selectRandom(data.starters);
  const middle1 = selectRandom(data.middles);
  
  // Pick a second middle that is not the same as middle1
  let middle2 = selectRandom(data.middles);
  if (middle2 === middle1 && data.middles.length > 1) {
    middle2 = data.middles.find(m => m !== middle1) || middle2;
  }
  
  const ending = selectRandom(data.endings);

  let paragraphs: string[] = [];

  if (length === "short") {
    paragraphs = [starter, ending];
  } else if (length === "medium") {
    paragraphs = [starter, middle1, ending];
  } else if (length === "detailed") {
    paragraphs = [starter, middle1, middle2, ending];
  } else {
    // comprehensive / ultra-long
    paragraphs = [
      starter, 
      middle1, 
      "Sourcing top standard materials from a verified medical equipment exporter like " + 
      (langKey === "english" ? "Manshav Impex" : "Manshav Impex group") + 
      " ensures total patient safety. " + middle2, 
      ending
    ];
  }

  // Join sentences
  let text = paragraphs.join(" ");

  // Customizations for tone if needed
  if (langKey === "english") {
    if (tone === "excellent") {
      text = "Flawless FDA-standard medical surgical products. " + text;
    } else if (tone === "great") {
      text = "Highly satisfied with this certified India based medical exporter. " + text;
    }
    // Deeply integrate the requested keywords
    if (!text.toLowerCase().includes("certified")) {
      text += " Their cleanroom is fully ISO certified.";
    }
    if (!text.toLowerCase().includes("surgical") && !text.toLowerCase().includes("medical")) {
      text += " Excellent surgical supplies and hospital medical gear.";
    }
    if (!text.toLowerCase().includes("india based") && !text.toLowerCase().includes("in india")) {
      text += " The absolute best India based export firm.";
    }
    if (!text.toLowerCase().includes("long term") && !text.toLowerCase().includes("long-term")) {
      text += " They are highly recommended for any long term global procurement.";
    }
  } else if (langKey === "gujinglish") {
    if (tone === "excellent") {
      text = "Saras medical surgical service! " + text;
    } else if (tone === "great") {
      text = "Superb rating for this certified India based exporter. " + text;
    }
    if (!text.toLowerCase().includes("certified")) {
      text += " Full quality certified manufacturing chhe.";
    }
    if (!text.toLowerCase().includes("surgical") && !text.toLowerCase().includes("medical")) {
      text += " Professional surgical instruments and medical consumables chhe.";
    }
    if (!text.toLowerCase().includes("india based")) {
      text += " India based medical supplier ma direct trust kare shake badha.";
    }
    if (!text.toLowerCase().includes("long term")) {
      text += " Regular long term partner banva mate best organization chhe.";
    }
  } else if (langKey === "hinglish") {
    if (tone === "excellent") {
      text = "Shandar certified surgical supplies. " + text;
    } else if (tone === "great") {
      text = "Bahut badiya response and long term corporate partnership. " + text;
    }
    if (!text.toLowerCase().includes("certified")) {
      text += " Inki factory structure fully certified standards follow karti hai.";
    }
    if (!text.toLowerCase().includes("surgical") && !text.toLowerCase().includes("medical")) {
      text += " Surgical components aur primary medical machinery quality top notch hai.";
    }
    if (!text.toLowerCase().includes("india based")) {
      text += " India based trusted exporter me inka naam sabse upar hai.";
    }
    if (!text.toLowerCase().includes("long term")) {
      text += " Sourcing logistics and long term supply contracts are very safe here.";
    }
  }

  // Inject spelling mistakes if requested to bypass detection filters
  if (humanize) {
    text = injectNaturalTypos(text);
  }

  return text;
}

export async function generateReview(request: ReviewRequest): Promise<string> {
  const { category, tone, length, language, humanize } = request;
  const ai = getAiInstance();

  if (!ai) {
    console.log("No API key configured. Generating natural SEO-optimized review offline.");
    return generateOfflineReview(request);
  }

  let languageInstruction = "";
  if (language === "gujinglish") {
    languageInstruction = `
- Write the review in "Gujinglish" (Gujarati language written in Latin script/English alphabet).
- Mix English business terms with natural conversational Gujarati words (e.g. use "saras chhe", "bov saari service", "Surat thi delivery timing perfect", "heavy quality", "direct exporter sauthi trusted").
- It must sound like an authentic B2B client from Gujarat/India who is very impressed but writes in casual Latin-script message style.
`;
  } else if (language === "hinglish") {
    languageInstruction = `
- Write the review in "Hinglish" (Hindi language written in Latin script/English alphabet).
- Mix English business terms with natural conversational Hindi words (e.g. use "bohot badiya service", "durability shandar hai", "Surat se cargo safely deliver hua", "kam rate me badiya deal", "trusted logo").
- It must sound like an authentic B2B client from India who is happy and writes in standard Hinglish.
`;
  } else {
    languageInstruction = `- Write in standard professional B2B English language.`;
  }

  let humanizeInstruction = "";
  if (humanize) {
    humanizeInstruction = `
- CRITICAL: Add 2-3 minor, natural, human-like spelling mistakes or casual grammatical inconsistencies (e.g., "recieved" instead of "received", "excelent" for "excellent", "recomended" for "recommended", typos on double letters, or missing a letter) so it looks 100% human-written and completely bypasses AI detectors. Do not overdo it, just keep it very minor and realistic.
`;
  } else {
    humanizeInstruction = `- Ensure flawless typography and perfect corporate spelling.`;
  }

  let lengthInstruction = "";
  if (length === "short") {
    lengthInstruction = `Keep it very short and crisp (max 2 sentences, 25-45 words).`;
  } else if (length === "medium") {
    lengthInstruction = `Keep it medium length (3-4 sentences, 50-80 words).`;
  } else if (length === "detailed") {
    lengthInstruction = `Keep it detailed (80-120 words), describing exact logistics, container packing, or standard details.`;
  } else {
    // comprehensive / ultra-long
    lengthInstruction = `Write a comprehensive, longer, and highly specific review (120-200+ words) detailing multiple aspects of working with Manshav Impex, like cleanroom compliance certificates, ISO standards, container durability, timely dispatch from Surat port, direct factory wholesale pricing, and long term relations. Make it feel extensive and rich.`;
  }

  const prompt = `
You are a highly professional local SEO copywriter representing a global medical trade partner writing a highly authentic B2B Google review for "Manshav Impex", the premier medical equipment supplier and exporter in Surat, Gujarat, India.

Your goal is to write a review that highlights B2B sourcing quality, is rich in relevant industry terminology, and naturally integrates core target keywords to maximize SEO value for search indexing.

MANDATORY SEO KEYWORDS TO INTEGRATE (You MUST integrate at least 3 or 4 of these in every single review organically):
- "medical" or "medical equipment supplies"
- "surgical" or "surgical instruments/gloves"
- "India based" or "India based medical exporter"
- "certified" or "ISO certified quality setup"
- "long term" or "long term B2B partner / long term relationship"
- "Best Manshav Impex Review"
- "Top medical products exporter in Surat"
- "Trusted international trading partner Surat"

INPUT PARAMETERS:
Category Segment: ${category}
Review Service Rating / Level: ${tone === "excellent" ? "Highly professional and impressed" : tone === "great" ? "Positive and highly reliable" : "Completely satisfied"}
Length Mode: ${length}
Language Style: ${language}

LANGUAGE SPECIFICATION:
${languageInstruction}

HUMANIZER & TYPO DETECTION-BYPASS DIRECTIVES:
${humanizeInstruction}

REVIEW LENGTH DIRECTIVE:
${lengthInstruction}

ADDITIONAL CRUCIAL REQUIREMENTS:
- Interweave words like "medical", "surgical", "India based", "certified", and "long term" to make the trade endorsement look extremely professional and detailed.
- Start with a strong, highly natural hook of verification.
- Always include "Manshav Impex" explicitly.
- Keep the style matching Indian B2B trade partners (clear, honest, practical, no flowery marketing buzzwords or generic AI phrases like "nestled in the heart of", "delve", "testament to", "elevating healthcare", "beacon of").
- Strictly do not place any quotation marks around the output. 
- Only return the pure review text itself. No intros, no greetings, no markdown bullet lists (unless asked for long format details), and absolutely no brackets or meta-commentary.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    let resText = response.text || generateOfflineReview(request);
    
    // Clean any surrounding quotes
    resText = resText.trim().replace(/^"(.*)"$/, '$1');

    // Double check humanizer as a post-processor if enabled to ensure typos are introduced even if AI was too perfect
    if (humanize && !resText.includes(" recieved") && !resText.includes(" excelent") && !resText.includes(" recomended")) {
      resText = injectNaturalTypos(resText);
    }

    return resText;
  } catch (error) {
    console.error("Error generating review via Gemini:", error);
    // Fallback to offline generator instead of crashing!
    return generateOfflineReview(request);
  }
}
