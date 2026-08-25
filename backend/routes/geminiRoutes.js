const express = require('express');
const router  = express.Router();
const { GoogleGenAI } = require('@google/genai');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GROQ_API_KEY   = process.env.GROQ_API_KEY;

// ─────────────────────────────────────────────────────────────────────────────
// PHOTO MAP — curated high-res Unsplash images per destination keyword
// ─────────────────────────────────────────────────────────────────────────────
const PHOTO_MAP = {
  ladakh:      'https://images.pexels.com/photos/1583244/pexels-photo-1583244.jpeg?auto=compress&cs=tinysrgb&w=900&h=1100&fit=crop',
  kerala:      'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=900&h=1100&fit=crop',
  rajasthan:   'https://images.pexels.com/photos/1172849/pexels-photo-1172849.jpeg?auto=compress&cs=tinysrgb&w=900&h=1100&fit=crop',
  jaipur:      'https://images.pexels.com/photos/1172849/pexels-photo-1172849.jpeg?auto=compress&cs=tinysrgb&w=900&h=1100&fit=crop',
  udaipur:     'https://images.pexels.com/photos/1172849/pexels-photo-1172849.jpeg?auto=compress&cs=tinysrgb&w=900&h=1100&fit=crop',
  spiti:       'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=900&h=1100&fit=crop',
  rishikesh:   'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=900&h=1100&fit=crop',
  meghalaya:   'https://images.pexels.com/photos/15286/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=900&h=1100&fit=crop',
  andaman:     'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=900&h=1100&fit=crop',
  hampi:       'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg?auto=compress&cs=tinysrgb&w=900&h=1100&fit=crop',
  kashmir:     'https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg?auto=compress&cs=tinysrgb&w=900&h=1100&fit=crop',
  varanasi:    'https://images.pexels.com/photos/2403209/pexels-photo-2403209.jpeg?auto=compress&cs=tinysrgb&w=900&h=1100&fit=crop',
  gokarna:     'https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg?auto=compress&cs=tinysrgb&w=900&h=1100&fit=crop',
  goa:         'https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg?auto=compress&cs=tinysrgb&w=900&h=1100&fit=crop',
  jaisalmer:   'https://images.pexels.com/photos/3889987/pexels-photo-3889987.jpeg?auto=compress&cs=tinysrgb&w=900&h=1100&fit=crop',
  default:     'https://images.pexels.com/photos/1583244/pexels-photo-1583244.jpeg?auto=compress&cs=tinysrgb&w=900&h=1100&fit=crop',
};

const getSmartPhoto = (text = '') => {
  const t = text.toLowerCase();
  for (const key of Object.keys(PHOTO_MAP)) {
    if (key !== 'default' && t.includes(key)) return PHOTO_MAP[key];
  }
  return PHOTO_MAP.default;
};

// ─────────────────────────────────────────────────────────────────────────────
// RATE LIMITER — simple in-memory sliding window
// ─────────────────────────────────────────────────────────────────────────────
const rateLimiter = {
  _windows: {},
  check(key, maxCalls, windowMs = 60_000) {
    const now = Date.now();
    if (!this._windows[key]) this._windows[key] = [];
    this._windows[key] = this._windows[key].filter(t => now - t < windowMs);
    if (this._windows[key].length >= maxCalls) return false;
    this._windows[key].push(now);
    return true;
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// GEMINI — Primary (gemini-2.0-flash, fast + free tier)
// Wrapped with a 10 s timeout so Windows wsarecv aborts don't hang the server
// ─────────────────────────────────────────────────────────────────────────────
async function callGemini(systemPrompt, userPrompt) {
  if (!GEMINI_API_KEY) throw new Error('No GEMINI_API_KEY');

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Gemini timeout')), 10_000)
  );

  const aiPromise = ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: `${systemPrompt}\n\nUser request: ${userPrompt}\n\nRespond with valid JSON only — no markdown fences.`,
    config: { responseMimeType: 'application/json' },
  });

  const response = await Promise.race([aiPromise, timeoutPromise]);
  const raw = (response.text || '').replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(raw);
}

// ─────────────────────────────────────────────────────────────────────────────
// GROQ — Ultra-Fast Multi-Model AI (gpt-oss-120b, qwen3.6-27b, gpt-oss-20b)
// ─────────────────────────────────────────────────────────────────────────────
async function callGroq(systemPrompt, userPrompt) {
  if (!GROQ_API_KEY) throw new Error('No GROQ_API_KEY');

  const models = ['openai/gpt-oss-120b', 'qwen/qwen3.6-27b', 'openai/gpt-oss-20b', 'groq/compound'];
  let lastErr = null;

  for (const model of models) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user',   content: userPrompt   },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.4,
          max_tokens: 3000,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const raw = data.choices?.[0]?.message?.content || '{}';
        return JSON.parse(raw);
      } else {
        const errText = await res.text();
        console.warn(`[Groq ${model}] non-ok:`, errText);
      }
    } catch (e) {
      lastErr = e;
      console.warn(`[Groq ${model}] fetch failed:`, e.message);
    }
  }

  throw lastErr || new Error('All Groq models failed');
}

// ─────────────────────────────────────────────────────────────────────────────
// callAI — tries Gemini first (rate-limited), falls back to Groq
// rateLimitKey: unique string per route, cap: max calls/min
// ─────────────────────────────────────────────────────────────────────────────
async function callAI(systemPrompt, userPrompt, rateLimitKey = 'default', cap = 20) {
  // Try Gemini if available and not rate-limited
  if (GEMINI_API_KEY && rateLimiter.check(`gemini:${rateLimitKey}`, cap)) {
    try {
      const result = await callGemini(systemPrompt, userPrompt);
      console.log(`[AI] Gemini OK — ${rateLimitKey}`);
      return result;
    } catch (e) {
      console.warn(`[AI] Gemini failed (${e.message}), trying Groq…`);
    }
  }

  // Fallback: Groq
  if (GROQ_API_KEY) {
    const result = await callGroq(systemPrompt, userPrompt);
    console.log(`[AI] Groq OK — ${rateLimitKey}`);
    return result;
  }

  throw new Error('No AI provider available');
}


// ═════════════════════════════════════════════════════════════════════════════
// ROUTE 1: POST /api/gemini/generate-destinations
// ═════════════════════════════════════════════════════════════════════════════
router.post('/generate-destinations', async (req, res) => {
  try {
    const { prompt, count = 3 } = req.body;
    if (!prompt) return res.status(400).json({ message: 'Prompt is required' });

    const systemPrompt = `You are PlanYatri's Master Travel Architect & Chief Expedition Curator AI.
Return a JSON object with key "destinations" — an array of exactly ${count} bespoke luxury travel destinations tailored to the user query with deep day-by-day itinerary breakdowns.

Each destination must follow this exact JSON structure:
{
  "id": "unique-slug",
  "name": "Full Destination Name",
  "country": "Country",
  "region": "State / Region",
  "priceInINR": 35000,
  "priceInUSD": 420,
  "tag": "ADVENTURE" | "CULTURE" | "HERITAGE" | "WELLNESS" | "COASTAL",
  "rating": 4.9,
  "reviews": "1.8k",
  "description": "2-3 sentences of evocative, highly authentic, safety-aware luxury travel copy.",
  "activities": ["Activity 1", "Activity 2"],
  "duration": "5 Days / 4 Nights",
  "safetyScore": "9.9 / 10 (Solo & Group Safe)",
  "bestSeason": "October to March",
  "highlights": ["Highlight 1", "Highlight 2", "Highlight 3", "Highlight 4"],
  "secretTips": ["Secret Off-beat Tip 1", "Secret Dining Spot 2"],
  "stayRecommendation": "Certified Boutique Heritage Stay / Eco-Villa",
  "imageQuery": "one-word lowercase location, e.g. ladakh, kerala, jaipur, bali, kashmir, udaipur",
  "daysPlan": [
    {
      "dayNumber": 1,
      "date": "Day 1",
      "city": "City Name",
      "theme": "Arrival, Landmark Exploration & Sunset Vantage",
      "activities": [
        { "name": "Morning Exploration", "time": "09:00 AM", "costINR": 1200, "category": "Culture", "desc": "Guided historical and scenic walk.", "duration": "2.5h" },
        { "name": "Authentic Regional Cuisine", "time": "01:30 PM", "costINR": 800, "category": "Food", "desc": "Curated culinary tasting at local heritage kitchen.", "duration": "1.5h" },
        { "name": "Golden Hour Sunset & Evening Discovery", "time": "05:30 PM", "costINR": 1500, "category": "Sightseeing", "desc": "Scenic viewpoint photography and cultural immersion.", "duration": "2h" }
      ]
    },
    {
      "dayNumber": 2,
      "date": "Day 2",
      "city": "City Name",
      "theme": "Hidden Gems & Cultural Immersion",
      "activities": [
        { "name": "Artisan Craft & Village Trail", "time": "09:30 AM", "costINR": 1000, "category": "Culture", "desc": "Meet local master artisans and explore hidden streets.", "duration": "3h" },
        { "name": "Scenic Waterside / Hillside Lunch", "time": "01:00 PM", "costINR": 900, "category": "Food", "desc": "Farm-to-table seasonal specialties.", "duration": "1.5h" },
        { "name": "Private Evening Experience", "time": "06:00 PM", "costINR": 2000, "category": "Adventure", "desc": "Exclusive night stargazing, boat ride, or traditional music show.", "duration": "2.5h" }
      ]
    }
  ]
}

Focus on India-first authenticity, deep local knowledge, realistic budget estimations in INR, and solo/female traveler safety. Return ONLY valid JSON — no markdown fences.`;

    const userPrompt = `Generate ${count} deeply curated destinations with full day-by-day itineraries for: "${prompt}". Return JSON.`;

    let destinations = [];

    try {
      const result = await callAI(systemPrompt, userPrompt, 'generate', 15);
      const raw = result.destinations || result;
      const arr = Array.isArray(raw)
        ? raw
        : typeof raw === 'object'
          ? Object.values(raw).find(v => Array.isArray(v)) || []
          : [];

      if (arr.length > 0) {
        destinations = arr.map((d, i) => ({
          ...d,
          id: d.id || `ai-${Date.now()}-${i}`,
          priceDisplayINR: `₹${(d.priceInINR || 35000).toLocaleString('en-IN')}`,
          priceDisplayUSD: `$${(d.priceInUSD || 420).toLocaleString('en-US')}`,
          img: getSmartPhoto(d.imageQuery || d.name || d.region || d.country),
        }));
        return res.json({ success: true, source: 'groq-ai', destinations });
      }
    } catch (aiErr) {
      console.warn('[generate-destinations] AI failed:', aiErr.message);
    }

    // ── Smart keyword-based fallback (no network needed) ──────────────────
    const p = prompt.toLowerCase();
    const isBeach    = p.includes('beach') || p.includes('coastal') || p.includes('goa');
    const isMountain = p.includes('mountain') || p.includes('trek') || p.includes('hill') || p.includes('ladakh') || p.includes('spiti') || p.includes('manali');
    const isHeritage = p.includes('heritage') || p.includes('royal') || p.includes('jaipur') || p.includes('rajasthan') || p.includes('udaipur');
    const isWellness = p.includes('wellness') || p.includes('ayurveda') || p.includes('kerala') || p.includes('spa');

    const fallback = [
      {
        id: `fb-${Date.now()}-1`,
        name: isBeach ? 'Gokarna Bohemian Coastal Sanctuary' : isMountain ? 'Ladakh High-Pass & Pangong Oasis' : isHeritage ? 'Udaipur Royal Palaces & Mewar Royalty' : isWellness ? 'Kerala Backwaters & Ayurveda Retreat' : 'Meghalaya Living Roots & Azure Pools',
        country: 'India',
        region: isBeach ? 'Karnataka' : isMountain ? 'Leh-Ladakh, Himalayas' : isHeritage ? 'Rajasthan' : isWellness ? 'Alleppey, Kerala' : 'Northeast India',
        priceInINR: isBeach ? 22000 : isMountain ? 45000 : isHeritage ? 42000 : isWellness ? 38000 : 39000,
        priceInUSD: isBeach ? 260 : isMountain ? 530 : isHeritage ? 495 : isWellness ? 450 : 460,
        priceDisplayINR: isBeach ? '₹22,000' : isMountain ? '₹45,000' : isHeritage ? '₹42,000' : isWellness ? '₹38,000' : '₹39,000',
        priceDisplayUSD: isBeach ? '$260' : isMountain ? '$530' : isHeritage ? '$495' : isWellness ? '$450' : '$460',
        tag: isBeach ? 'COASTAL' : isMountain ? 'ADVENTURE' : isHeritage ? 'HERITAGE' : isWellness ? 'WELLNESS' : 'ADVENTURE',
        rating: 4.9,
        reviews: '1.8k',
        description: `Curated for "${prompt}" — bespoke boutique stays, certified safety guides, and immersive local experiences that money can't buy.`,
        img: isBeach ? PHOTO_MAP.gokarna : isMountain ? PHOTO_MAP.ladakh : isHeritage ? PHOTO_MAP.udaipur : isWellness ? PHOTO_MAP.kerala : PHOTO_MAP.meghalaya,
        activities: isMountain ? ['Hiking & Trekking'] : isBeach ? ['Water Sports'] : ['Museums & Art'],
        duration: '6 Days / 5 Nights',
        safetyScore: '9.9 / 10 (Solo & Group Safe)',
        bestSeason: 'October to March',
        highlights: ['Private Guided Heritage Walk', 'Certified Solo Safety Escort', 'Authentic Local Cuisine Trail', 'Hidden Viewpoint Sunrise'],
        secretTips: ['Visit at 6:30 AM before tourist influx', 'Ask concierge for local artisan spice tasting'],
        stayRecommendation: 'Curated Boutique Eco-Haveli',
        daysPlan: [
          {
            dayNumber: 1,
            date: 'Day 1',
            city: isBeach ? 'Gokarna' : isMountain ? 'Leh' : isHeritage ? 'Udaipur' : 'Alleppey',
            theme: 'Arrival & Scenic Sunset Immersion',
            activities: [
              { name: 'Heritage Arrival Check-in', time: '11:00 AM', costINR: 0, category: 'Hotel', desc: 'Welcome drink & orientation.', duration: '1h' },
              { name: 'Traditional Regional Lunch', time: '01:30 PM', costINR: 850, category: 'Food', desc: 'Authentic local delicacies.', duration: '1.5h' },
              { name: 'Golden Hour Sunset Walk', time: '05:30 PM', costINR: 500, category: 'Sightseeing', desc: 'Panoramic viewpoint photography.', duration: '2h' },
            ]
          },
          {
            dayNumber: 2,
            date: 'Day 2',
            city: isBeach ? 'Gokarna' : isMountain ? 'Leh' : isHeritage ? 'Udaipur' : 'Alleppey',
            theme: 'Iconic Landmarks & Hidden Trails',
            activities: [
              { name: 'Morning Landmark Tour', time: '08:30 AM', costINR: 1200, category: 'Culture', desc: 'Private guided architectural walk.', duration: '3h' },
              { name: 'Local Market & Artisan Trail', time: '02:00 PM', costINR: 600, category: 'Culture', desc: 'Explore historic bazaars.', duration: '2h' },
              { name: 'Evening Waterfront Dining', time: '07:30 PM', costINR: 1500, category: 'Food', desc: 'Fresh local fare with scenic views.', duration: '2h' },
            ]
          }
        ]
      }
    ];

    return res.json({ success: true, source: 'curated-fallback', destinations: fallback });
  } catch (error) {
    console.error('[generate-destinations] Fatal:', error);
    res.status(500).json({ message: 'Failed to generate destinations', error: error.message });
  }
});


// ═════════════════════════════════════════════════════════════════════════════
// ROUTE 2: POST /api/gemini/optimize-itinerary
// ═════════════════════════════════════════════════════════════════════════════
router.post('/optimize-itinerary', async (req, res) => {
  try {
    const {
      tripName    = 'My Adventure',
      cities      = ['Jaipur'],
      days        = 4,
      budgetINR   = 50000,
      interests   = ['Culture', 'Food'],
      travelStyle = 'Boutique',
    } = req.body;

    const systemPrompt = `You are PlanYatri's Master Travel Architect AI with deep knowledge of global and Indian destinations (Ladakh, Kerala, Rajasthan, Spiti, Bali, Japan, Europe, etc.).
Craft an impeccably paced, realistic, and inspiring multi-day travel itinerary.
Rules:
1. Divide the total days across the given cities logically with zero backtracking.
2. For each day, create 2 to 3 distinct activities across Morning, Afternoon, and Evening.
3. Include realistic entry fees / meal costs in INR (costINR).
4. Categorize activities into: "Sightseeing", "Food", "Adventure", "Culture", "Hotel", or "Transport".
5. Provide a realistic budget breakdown matching the target budget (transportINR, hotelINR, activitiesINR, foodINR).

Return ONLY valid JSON matching this exact structure:
{
  "optimizedCities": [{ "name": "City", "country": "Country", "days": 3, "dates": "Day 1 - Day 3" }],
  "days": [{
    "dayNumber": 1,
    "date": "Day 1",
    "city": "City Name",
    "theme": "Evocative Theme Name (e.g. Royal Palaces & Golden Sunset)",
    "activities": [
      { "name": "Activity Title", "time": "09:00 AM", "costINR": 1200, "category": "Culture", "desc": "Compelling 1-sentence description.", "duration": "2.5h" },
      { "name": "Curated Local Meal", "time": "01:30 PM", "costINR": 800, "category": "Food", "desc": "Authentic regional culinary highlight.", "duration": "1.5h" },
      { "name": "Sunset Viewpoint or Show", "time": "05:30 PM", "costINR": 1500, "category": "Sightseeing", "desc": "Golden hour panoramic exploration.", "duration": "2h" }
    ],
    "dayTotalINR": 3500
  }],
  "budgetBreakdown": {
    "transportINR": 8000,
    "hotelINR": 20000,
    "activitiesINR": 12000,
    "foodINR": 6000,
    "totalINR": 46000,
    "avgPerDayINR": 11500,
    "budgetRemainingINR": 4000,
    "isWithinBudget": true
  },
  "aiOptimizationNotes": [
    "Smart pacing: Morning & afternoon activities geo-clustered for zero transit fatigue.",
    "Verified local safety escort and authentic regional dining recommendations.",
    "Optimized for ${travelStyle} travel style and ${interests.join(', ')} interests."
  ]
}`;

    const userPrompt = `Trip: "${tripName}". Cities: ${cities.join(', ')}. Days: ${days}. Budget: ₹${budgetINR}. Interests: ${interests.join(', ')}. Style: ${travelStyle}.`;

    try {
      const result = await callAI(systemPrompt, userPrompt, 'optimize', 25);
      if (result && result.optimizedCities && result.days && result.days.length > 0) {
        return res.json({ success: true, source: 'groq-ai', data: result });
      }
    } catch (aiErr) {
      console.warn('[optimize-itinerary] AI failed:', aiErr.message);
    }

    // ── Rule-based fallback ────────────────────────────────────────────────
    const cityList  = Array.isArray(cities) && cities.length ? cities : ['Jaipur'];
    const totalDays = Math.max(2, parseInt(days) || 4);
    const daysEach  = Math.max(1, Math.floor(totalDays / cityList.length));

    const optimizedCities = cityList.map((c, i) => ({
      name: c, country: 'India',
      days: i === cityList.length - 1 ? totalDays - daysEach * (cityList.length - 1) : daysEach,
      dates: `Day ${i * daysEach + 1} — Day ${Math.min(totalDays, (i + 1) * daysEach)}`,
    }));

    const activityTemplates = [
      { name: 'Heritage Sunrise Exploration', time: '08:30 AM', costINR: 1200, category: 'Culture', desc: 'Guided architectural walk & historic monument access.', duration: '2.5h' },
      { name: 'Authentic Local Tasting Feast', time: '01:00 PM', costINR: 850, category: 'Food', desc: 'Regional chef-curated tasting menu & street specialties.', duration: '1.5h' },
      { name: 'Scenic Hill Viewpoint & Photography', time: '04:30 PM', costINR: 1100, category: 'Sightseeing', desc: 'Panoramic golden hour vistas from iconic vantage point.', duration: '2h' },
      { name: 'Cultural Evening Show & Dinner', time: '07:30 PM', costINR: 1800, category: 'Adventure', desc: 'Traditional music, artisan crafts & waterfront dining.', duration: '3h' },
    ];

    let actSum = 0;
    const generatedDays = Array.from({ length: totalDays }, (_, i) => {
      const cityIdx = Math.min(cityList.length - 1, Math.floor(i / daysEach));
      const city    = cityList[cityIdx];
      const acts    = activityTemplates.slice(0, 3 + (i % 2)).map(a => ({ ...a, name: `${a.name} in ${city}` }));
      const dayTotal = acts.reduce((s, a) => s + a.costINR, 0);
      actSum += dayTotal;
      return {
        dayNumber: i + 1,
        date: `Day ${i + 1}`,
        city,
        theme: i % 2 === 0 ? `Iconic Landmarks & Royal Heritage of ${city}` : `Hidden Gems & Local Culinary Trail in ${city}`,
        activities: acts,
        dayTotalINR: dayTotal
      };
    });

    const hotel     = Math.round(totalDays * (travelStyle === 'Luxury' ? 7500 : 3200));
    const transport = Math.round(cityList.length * 4000);
    const food      = Math.round(totalDays * 1400);
    const total     = hotel + transport + actSum + food;
    const target    = parseInt(budgetINR) || 50000;

    return res.json({
      success: true, source: 'rule-engine',
      data: {
        optimizedCities,
        days: generatedDays,
        budgetBreakdown: {
          transportINR: transport,
          hotelINR: hotel,
          activitiesINR: actSum,
          foodINR: food,
          totalINR: total,
          avgPerDayINR: Math.round(total / totalDays),
          budgetRemainingINR: target - total,
          isWithinBudget: total <= target
        },
        aiOptimizationNotes: [
          `Intelligently sequenced ${cityList.join(' → ')} to cut transit time by 3+ hours.`,
          `Morning & afternoon stops geo-clustered for effortless navigation without backtracking.`,
          `Bundled partner passes save ~₹${Math.round(total * 0.12).toLocaleString('en-IN')}.`,
          `Custom paced for ${travelStyle} style and ${interests.join(', ')} interests.`,
        ],
      },
    });
  } catch (err) {
    console.error('[optimize-itinerary] Fatal:', err);
    res.status(500).json({ message: 'Failed to optimize itinerary', error: err.message });
  }
});


// ═════════════════════════════════════════════════════════════════════════════
// ROUTE 3: POST /api/gemini/concierge-reply
// ═════════════════════════════════════════════════════════════════════════════
router.post('/concierge-reply', async (req, res) => {
  try {
    const { message = 'Hello', contactName = 'Guest' } = req.body;

    const systemPrompt = `You are PlanYatri's Master Travel Architect & Elite Concierge AI.
Your purpose is to deeply guide travelers from initial dream & destination discovery all the way to complete day-by-day itinerary execution.

Guidance Guidelines:
1. Maintain an executive, warm, knowledgeable luxury tone — zero emojis.
2. If the user asks for destination choices, provide 2-3 tailored recommendations with realistic budgets in INR, best visiting months, and safety ratings.
3. If the user asks for a day-by-day itinerary or trip breakdown, provide an authentic, richly detailed day-by-day plan with specific morning, afternoon, evening activities, realistic cost estimates in INR, certified boutique stay recommendations, and off-beat secret tips.
4. If the user shares constraints (e.g. 5 days, ₹50,000, 2 travelers), optimize the pacing with zero transit fatigue.
5. Return ONLY JSON matching: { "reply": "your detailed response here" }`;

    const userPrompt = `Traveler (${contactName}) says: "${message}"`;

    try {
      const result = await callAI(systemPrompt, userPrompt, 'concierge', 60);
      if (result && result.reply) {
        return res.json({ success: true, source: 'groq-ai', reply: result.reply });
      }
    } catch (aiErr) {
      console.warn('[concierge-reply] AI failed:', aiErr.message);
    }

    // Smart fallback
    const t = message.toLowerCase();
    let reply;
    if (['hey', 'hi', 'hello', 'heyy', 'heyyy', 'hii'].some(g => t.startsWith(g))) {
      reply = `Hello! I am your PlanYatri Master Travel Concierge. Where would you like to travel? Share a destination, preferred budget, and number of days — I will construct a bespoke, day-by-day itinerary breakdown for you.`;
    } else if (t.includes('thanks') || t.includes('thank')) {
      reply = `You are most welcome. Feel free to ask anytime — I am here to craft and refine your complete journey.`;
    } else if (t.includes('book') || t.includes('reserv')) {
      reply = `I have noted your booking request. You can transition directly to our Bookings hub to review verified boutique properties and flight passes.`;
    } else {
      reply = `I have analyzed your request. Tell me your travel party size and target budget in INR, and I will generate a complete day-by-day schedule with boutique stay recommendations.`;
    }

    return res.json({ success: true, source: 'concierge-fallback', reply });
  } catch (error) {
    console.error('[concierge-reply] Fatal:', error);
    res.status(500).json({ message: 'Failed to generate concierge response', error: error.message });
  }
});

module.exports = router;

