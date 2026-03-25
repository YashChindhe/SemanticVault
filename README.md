# 🗄️ Semantic Vault: Smart Personal Document Search

**Semantic Vault** is a minimalist note-taking application designed with an "industrial zenith" aesthetic and powered by semantic search. Unlike traditional keyword-based search, it understands the **meaning** of your notes using vector embeddings.

---

## 🚀 Key Features

- **Meaning-Based Search**: Retrieve notes based on concepts and context, not just matching words.
- **Industrial UI**: Monospace-driven, minimalist interface inspired by industrial control panels (Zenith theme).
- **RAG (Retrieval-Augmented Generation) Ready**: Built on a solid vector database foundation (pgvector).
- **Light/Dark Mode Ready**: Defaults to a high-contrast industrial dark mode.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 13](https://nextjs.org/) (App Router, React 18)
- **Database**: [Neon Postgres](https://neon.tech/) with `pgvector` extension.
- **ORM**: [Prisma](https://www.prisma.io/) with raw SQL fallback for vector operations.
- **Embeddings**: [Hugging Face Inference API](https://huggingface.co/docs/api-inference/index) (`all-MiniLM-L6-v2`).
- **Styling**: Tailwind CSS & [Lucide React](https://lucide.dev/) icons.
- **Animations**: [Framer Motion](https://www.framer.com/motion/).

---

## 🏗️ Architecture & Methodology

### 1. Vector Extraction
When a note is saved, the content is sent to the Hugging Face Inference API. The `all-MiniLM-L6-v2` model transforms the text into a 384-dimensional vector representing its semantic meaning.

### 2. Storage
The raw note is saved via Prisma, and then the vector is injected into a `vector(384)` column using a raw SQL update command.

### 3. Search (Cosine Similarity)
When searching, the query is also embedded. We then use the `pgvector` cosine similarity operator (`<=>`) to calculate the "distance" between the query and every stored note. Results are ranked by similarity (closer to 1.0 = better match).

---

## ⚙️ How to Setup

### 1. Prerequisites
- **Node.js**: v18.7.0+ (compatible with the current workspace).
- **Neon Database**: Create a Neon project and enable the `pgvector` extension.

### 2. Database Preparation
Run the following SQL in your Neon SQL Editor:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
# Neon Postgres Connection String
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# Hugging Face Access Token (Free)
# Get one at: https://huggingface.co/settings/tokens
HF_TOKEN="your_hugging_face_token_here"
```

### 4. Installation & Build
```bash
# Install dependencies
npm install --legacy-peer-deps

# Generate Prisma Client
npx prisma generate

# Finalize database schema (if not using prisma migrate)
# You might need to manually run the migration SQL provided in prisma/migrations
```

### 5. Running Locally
```bash
npm run dev
```

---

## 📜 Methodology: Why This Tech Stack?

- **Neon Postgres**: Offers serverless scalability and first-class support for `pgvector`, making it the easiest way to add vector search to a standard relational database.
- **Hugging Face Inference API**: Provides a free, high-quality embedding model without needing to run heavy local models.
- **Next.js**: Perfect for Vercel deployment with easy API route handling for the search logic.

---

## 🏭 Industrial Aesthetics (Zenith Style)
Built for focus. The design prioritizes information density and clear structure. Uses "JetBrains Mono" or standard system monospace fonts to maintain a professional, grittier atmosphere.
