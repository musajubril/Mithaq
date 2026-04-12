# Mithaq (مِيثَاق) — The Sacred Sanctuary

![Mithaq Hero](public/images/serene_couple_hero_1775507565933.png)

> **"A quiet digital sanctuary for intentional connection."**

Mithaq is a premium relationship reflection platform designed for couples who seek to move beyond surface-level interaction. Built with a focus on "Editorial Romance" and intentionality, it provides a sacred space for shared growth, honest transparency, and collective vision.

## ✨ The Mithaq Aesthetic

Mithaq follows a strict **"Modern Epistolary"** design system, rooted in the following principles:

*   **The No-Line Rule**: We avoid harsh borders and dividers. Hierarchy is established through subtle tonal shifts (`surface-container-low` vs `surface-container-lowest`) and intentional whitespace.
*   **Editorial Romance**: Combining serif typography (`Noto Serif`) with a minimalist interface that feels like a high-end art journal.
*   **Sacred Sanctuary**: A serene, distraction-free environment that prioritizes the user's emotional state.

![Editorial Connection](public/images/editorial_connection_hands_1775507431855.png)

## 🚀 Key Features

*   **Intelligent Questionnaire**: A multi-path reflection journey that resumes exactly where you left off, navigating the depths of finance, family, values, and more.
*   **Partner Sync & Reveal**: Answers are hidden until both partners have reflected, creating a powerful "reveal" moment that encourages honest vulnerability.
*   **Category Summary Hubs**: Editorial-style dashboards for each category, featuring AI-generated "Shared Sanctuary" syntheses of your connection.
*   **Daily Intentions**: AI-powered daily prompts designed to spark meaningful conversation in under 5 minutes.
*   **The Mithaq Covenant**: A dynamically generated, printable "Charter of Intention" to formalize your shared path (Currently in Beta).

![Reflection Journal](public/images/editorial_journal_flowers_1775511760732.png)

## 🛠️ Tech Stack

*   **Framework**: Next.js 14 (App Router)
*   **Real-time**: Socket.io for live typing and presence indicators
*   **AI**: Google Gemini Pro & Flash (via `@google/genai`)
*   **Animations**: Framer Motion
*   **Database**: MongoDB with Mongoose
*   **Authentication**: NextAuth.js

---

## 🏗️ Getting Started

### Prerequisites

*   Node.js 18+
*   MongoDB Instance
*   Gemini API Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/musa/mithaq.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment:
   Create a `.env.local` file with the following:
   ```env
   MONGODB_URI=your_mongodb_uri
   NEXTAUTH_SECRET=your_secret
   GEMINI_API_KEY=your_key
   ```

4. Run Development:
   ```bash
   npm run dev
   ```

---

*“Connection is the art of being seen without being judged.”* — **Mithaq**
