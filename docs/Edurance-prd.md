# Product Requirements Document (PRD)
## Education Web App with Dynamic PPT Lessons

---

## 1. Product Overview

A web-based tuition platform that delivers syllabus-aligned lessons through PPT-style slideshows with integrated doubt-solving. Content is dynamically generated per chapter using AI, ensuring scalability without manual content creation per topic.

**Core Value Proposition:**
- Select class, pay once → instant access to visual lessons
- No pre-recorded videos or static content
- Real-time doubt resolution while learning

---

## 2. User Flow

```
[Login/Signup] 
    ↓
[Class Selection] (5–10)
    ↓
[Payment Screen] → UPI/QR → Payment Success
    ↓
[Unlock Content]
    ↓
[Subject Selection] (based on class)
    ↓
[Chapter List]
    ↓
[Lesson Starts] → PPT Slideshow + Chatbot
    ↓
[Complete/Exit]
```

### Detailed Steps:

1. **Authentication:**
   - User signs up or logs in via Supabase Auth
   - Session persists across visits

2. **Class Selection:**
   - Display: Class 5, 6, 7, 8, 9, 10
   - Store selection in user profile

3. **Payment Gate:**
   - If `payment_status = false` → redirect to payment
   - Show UPI QR / PhonePe link
   - On success → update `payment_status = true` in Supabase
   - Unlock access to content

4. **Subject Selection (Conditional):**
   - **Class 6–9:** Science, Social Studies
   - **Class 10:** Physics, Biology, Social Studies

5. **Chapter Selection:**
   - Fetch chapter list from static config or DB
   - Display as clickable list

6. **Lesson Delivery:**
   - Backend generates lesson content via OpenAI
   - Sends text to Gamma API → receives PPT
   - Frontend displays PPT in slideshow mode
   - Chatbot visible in sidebar for doubts

---

## 3. Tech Stack

### Frontend
- **Framework:** React (Next.js recommended for SSR + routing)
- **Styling:** Tailwind CSS
- **State Management:** React Context or Zustand
- **PPT Display:** Embedded iframe or Gamma's viewer component

### Backend
- **Runtime:** Node.js (Express) or Next.js API routes
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (email/password, social)
- **APIs:** OpenAI LLM (model configurable), Gamma AI API
- **Payment:** PhonePe/GPay webhook or manual QR validation

### Hosting
- **Frontend:** Vercel / Netlify
- **Backend:** Vercel Serverless / Railway / Render
- **Database:** Supabase (managed)

---

## 4. Integrations

### 4.1 Supabase
**Purpose:** Auth, user data, payment status

**Tables:**
```sql
users (
  id UUID PRIMARY KEY,
  email TEXT,
  payment_status BOOLEAN DEFAULT false,
  selected_class INTEGER,
  created_at TIMESTAMP
)

lessons_history (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  class INTEGER,
  subject TEXT,
  chapter TEXT,
  completed BOOLEAN,
  timestamp TIMESTAMP
)
```

**API Usage:**
- `supabase.auth.signUp()`
- `supabase.auth.signInWithPassword()`
- `supabase.from('users').select().eq('id', userId)`
- `supabase.from('users').update({ payment_status: true })`

---

### 4.2 OpenAI API
**Purpose:** Generate lesson content and answer doubts using OpenAI LLM (model configurable)

**Model Configuration:**
- Model is configurable via environment variable: `OPENAI_MODEL`
- Default can be set to any OpenAI model (e.g., "gpt-4", "gpt-4-turbo", "gpt-3.5-turbo")

**Endpoints Used:**
- `POST https://api.openai.com/v1/chat/completions`

**Request Flow:**

**A. Lesson Content Generation**
```javascript
// Backend receives: { class: 10, subject: "Physics", chapter: "Light - Reflection" }

const prompt = `
You are a tutor creating a lesson for Class ${class}, Subject: ${subject}, Chapter: ${chapter}.
Generate a structured lesson with 8-10 slides.
Each slide must have:
- Slide number
- Title
- 2-3 bullet points of content (clear, simple, syllabus-aligned)

Format output as JSON array:
[
  { "slide": 1, "title": "...", "content": ["...", "..."] },
  ...
]
`;

const response = await openai.chat.completions.create({
  model: process.env.OPENAI_MODEL, // configurable via env
  messages: [{ role: "system", content: prompt }],
  temperature: 0.3
});

// Parse response.choices[0].message.content
// Returns: slides[]
```

**B. Doubt Solving**
```javascript
// User asks: "What is refraction?"

const prompt = `
You are a tutor. Student is learning Chapter: ${chapter}.
Question: ${userQuestion}
Provide a short, clear answer (2-3 sentences).
`;

const response = await openai.chat.completions.create({
  model: process.env.OPENAI_MODEL, // configurable via env
  messages: [{ role: "user", content: prompt }],
  temperature: 0.5
});

// Return: answer text
```

---

### 4.3 Gamma AI API
**Purpose:** Convert text content into visual PPT slides

**API Call Sequence:**

```javascript
// Step 1: Backend receives slides[] from OpenAI

// Step 2: Format slides into Gamma-compatible text
const formattedText = slides.map(s => 
  `## ${s.title}\n${s.content.join('\n')}`
).join('\n\n');

// Step 3: Call Gamma API
const gammaResponse = await fetch('https://api.gamma.app/api/presentations', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${GAMMA_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: formattedText,
    theme: "educational", // or default
    autoFormat: true
  })
});

// Step 4: Gamma returns presentation URL or embed code
const { presentationUrl } = await gammaResponse.json();

// Step 5: Send presentationUrl to frontend
```

**Critical Rule:**
- Gamma ONLY receives pre-generated text from OpenAI
- Gamma does NOT generate lesson content
- Gamma's role = visual formatting + layout

---

### 4.4 Payment Integration
**Purpose:** Simple one-time payment to unlock access

**Options:**

**Option A: Manual QR Code**
1. Generate static UPI QR (PhonePe/GPay)
2. User uploads payment screenshot
3. Admin manually verifies and updates `payment_status = true`

**Option B: Automated (PhonePe SDK)**
1. Integrate PhonePe Payment Gateway
2. Backend initiates payment → receives callback
3. On success → auto-update `payment_status = true`

**Recommended:** Start with Option A (MVP), migrate to Option B later.

---

## 5. API Call Sequence (Full Flow)

```
User clicks Chapter → Frontend sends request to Backend

Backend:
  ↓
  1. Extract: class, subject, chapter
  ↓
  2. Call OpenAI API
     - Send: prompt with class/subject/chapter
     - Receive: slides[] (JSON)
  ↓
  3. Format slides[] into text
  ↓
  4. Call Gamma API
     - Send: formatted text
     - Receive: presentationUrl
  ↓
  5. Return to Frontend: { presentationUrl, slides[] }

Frontend:
  ↓
  6. Display PPT in iframe/viewer
  ↓
  7. Show chatbot sidebar
  ↓
  8. On doubt → send question to Backend → OpenAI → return answer
```

---

## 6. Data Models (High-Level)

### User Model
```javascript
{
  id: "uuid",
  email: "student@example.com",
  payment_status: true,
  selected_class: 10,
  created_at: "2026-02-13T10:00:00Z"
}
```

### Lesson Request
```javascript
{
  class: 10,
  subject: "Physics",
  chapter: "Light - Reflection and Refraction"
}
```

### OpenAI Response (Slides)
```javascript
[
  {
    slide: 1,
    title: "Introduction to Light",
    content: [
      "Light is a form of energy",
      "It travels in straight lines",
      "Speed: 3 × 10^8 m/s"
    ]
  },
  ...
]
```

### Gamma API Response
```javascript
{
  presentationUrl: "https://gamma.app/docs/abc123",
  embedCode: "<iframe src='...'></iframe>"
}
```

### Doubt Request/Response
```javascript
// Request
{
  chapter: "Light - Reflection",
  question: "What is the law of reflection?"
}

// Response
{
  answer: "The law of reflection states that the angle of incidence equals the angle of reflection, and both rays lie in the same plane."
}
```

---

## 7. Non-Goals (Critical)

❌ **What we are NOT building:**

1. **No multi-tier subscription plans** (initially)
   - Single payment unlocks everything
   
2. **No admin dashboard for content management**
   - All content is dynamically generated
   
3. **No video lessons or animations**
   - Only PPT slideshows
   
4. **No quiz or assessment features** (v1)
   - Focus on lesson delivery + doubts only
   
5. **No offline mode**
   - Web-only, requires internet
   
6. **No complex analytics or progress tracking** (v1)
   - Basic completion status only
   
7. **No manual content creation per chapter**
   - Must be fully automated via OpenAI
   
8. **No Gamma-generated educational content**
   - Gamma is ONLY for visualization
   - OpenAI owns all knowledge generation

---

## 8. Success Criteria

✅ User can:
1. Sign up and log in
2. Complete payment via UPI
3. Select class → subject → chapter
4. View AI-generated PPT lesson
5. Ask doubts and get instant answers
6. Access all subjects for their class

✅ System can:
1. Generate lessons for any chapter dynamically (no hardcoding)
2. Handle 100+ concurrent users
3. Respond to doubts in <3 seconds

---

## 9. Open Questions / Decisions Needed

1. **Payment Amount:** Fixed ₹X per user?
2. **Content Scope:** All NCERT chapters or custom syllabus?
3. **PPT Caching:** Store generated PPTs or regenerate each time?
4. **Doubt History:** Save conversation or session-only?
5. **Mobile App:** Web-only initially, or responsive design for mobile web?

---

**Version:** 1.0  
**Last Updated:** Feb 13, 2026  
**Owner:** Engineering Team
