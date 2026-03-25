# Semantic Vault: Smart Personal Document Search

**Semantic Vault** is a minimalist note-taking application designed with an "industrial zenith" aesthetic and powered by semantic search (RAG). Unlike traditional keyword-based search, it understands the **meaning** of your notes using state-of-the-art vector embeddings.

---

## The "What"
A secure, single-page "vault" for storing text snippets and markdown. It doesn't just look for words; it looks for **intent**. 

## The "Why"
Traditional search fails when you forget the exact words you used (e.g., searching for "recipe" when you wrote "ingredients for cake"). Semantic Vault solves this by mapping language into a high-dimensional vector space where related concepts are "physically" closer to each other.

---

## Architecture & Tech Stack

### Frameworks & Logic
- **Next.js 13 (App Router)**: Optimized for serverless execution and rapid API handling.
- **React 18**: Utilizing concurrent features for a "Live Search" experience.
- **Hugging Face Inference**: Using the `BAAI/bge-small-en-v1.5` transformer model (384-dimensions) to generate semantic embeddings.

### Data Layer
- **Neon Postgres**: A serverless Postgres database.
- **pgvector**: A specialized extension that allows storing and querying high-dimensional vectors directly inside SQL.
- **Prisma**: Handles the structured metadata, with native `$queryRaw` calls for the mathematical vector similarity operations.

### Aesthetics (Zenith Industrial)
- **UI System**: Custom-built industrial theme using **Tailwind CSS**.
- **Typography**: Heavily features Monospace fonts (**JetBrains Mono**) for a "terminal-grade" look.
- **Animations**: **Framer Motion** for smooth, non-distracting micro-interactions.

---

## Methodology: How it Works

### 1. Vector Injection
When you save a note:
1. The text is sent to the **Hugging Face Router**.
2. A **384-dimension vector** (embedding) is returned.
3. The note is saved to Postgres, and the vector is injected into a `vector` column type.

### 2. Semantic Retrieval
When you search:
1. Your query is vectorized in real-time.
2. We perform a **Cosine Similarity** check (`1 - (embedding <=> query_vector)`).
3. Postgres returns the most "conceptually similar" notes, even if no shared words exist.

---

## Setup & Installation

### 1. Database Preparation
Create a [Neon.tech](https://neon.tech) project and enable the extension:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### 2. Environment Variables (.env)
```env
DATABASE_URL="your_neon_postgres_url"
HF_TOKEN="your_hugging_face_access_token"
```

### 3. Deployment
```bash
npm install --legacy-peer-deps
npx prisma generate
npx prisma db push
npm run dev
```

---

## Testing Scenario (The "Aha!" Moment)
To see the difference, try adding these:

1. **Add Note**: "Instructions for baking a chocolate cake using cocoa and flour."
2. **Add Note**: "How to fix a leaky sink with a wrench."
3. **Search for**: "Dessert recipes"
   - **Result**: Even though "Dessert" isn't in your note, the Cake snippet will appear as a high-percentage match!

---

## Project Purpose
Built as a demonstration of **Minimalist RAG (Retrieval-Augmented Generation)** architecture, proof that powerful AI features don't require complex infrastructure—only a smart vector database and an inference endpoint.
