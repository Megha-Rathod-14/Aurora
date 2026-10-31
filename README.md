# 🌌 AURORA – Premium Social Media Platform

> **Connect. Create. Inspire.**

AURORA is a next-generation, premium social networking platform engineered for visual creators, artists, futuristic designers, and thinkers. Built with a pure black and dark charcoal interface, neon cyan, electric blue, vivid pink, cosmic purple, and golden accents, AURORA pairs a cyberpunk aesthetic with high-performance modern web technologies.

AURORA incorporates the official Hummingbird logo throughout its design, featuring floating desktop sidebars, center feed, discovery discovery panels, 24-hour stories, short reels with audio sync, direct messaging with glassmorphism styling, Pinterest-inspired masonry exploration, and Supabase integration with full local demo fallback.

---

## ⚡ Key Platform Features

### 1. 🪐 Brand Identity & Aesthetic
* **Official Hummingbird Logo**: Prominently showcased across navigation, headers, stories, and authentication screens with glowing neon auras.
* **Pure Black Theme**:
  * Main Background: `#050505`
  * Sidebar & Panels: `#0B0B0F`
  * Primary Cards: `#121218`
  * Secondary Cards: `#191922`
  * Neon Accents: Cyan (`#00D9FF`), Blue (`#287BFF`), Pink (`#FF258A`), Purple (`#9B59FF`), Gold (`#FFC83D`).
* **Micro-Interactions**: Soft glowing drop shadows, subtle neon borders, glassmorphic blur filters, and fluid animations.

### 2. 📱 Home Feed & Stories
* **Floating Sidebar**: Responsive navigation with real-time badge counts for messages and notifications.
* **Stories Bar**:
  * Circular creator avatars encircled by colorful glowing neon gradient rings.
  * 24-hour expiration indicator and viewed vs unviewed states.
  * **Full-screen Story Viewer**: Segmented progress bars with 5-second auto-transitions, pause on touch-and-hold, viewer counts, direct story replies, and heart reactions.
  * **Story Creator**: Upload personal media or choose aesthetic presets to post instantly to the Aurora story ring.
* **Multi-Format Posts**: Single image, video, and multi-media carousels with smooth pagination.
* **Post Interactions**:
  * Double-tap / double-click to like with a radiant glowing heart explosion effect.
  * Optimistic real-time like counts, comment counts, and share counters.
  * Expandable comment threads with nested replies and emoji triggers.
  * Bookmarking / saving posts to private collections.
* **Discovery Feed Filters**: Seamlessly toggle between **For You**, **Following**, and **Trending**.

### 3. 💬 Direct Messaging & Chat
* **Dark Glassmorphic Messenger**: Clean two-column interface with online indicators and search.
* **Real-time Chat Experience**:
  * Send text messages, photo attachments, and emoji reactions.
  * Instant simulated responses from creators with animated "typing..." indicators.
  * Message timestamps, read receipts (cyan double checkmarks), and unsend/deletion options.

### 4. 🧭 Pinterest-Inspired Explore Grid
* **Masonry Visual Layout**: Dynamic 1-span and 2-span cards with smooth hover overlays.
* **Category Filters**: Cyberpunk, 3D Art, Haute Couture Fashion, Electronic Music, Nocturnal Photography, and Futuristic Architecture.
* **Creator & Tag Search**: Real-time filtering by creator username or `#hashtag`.
* **Post Detail Modal**: Clicking any explore card opens an immersive modal displaying high-res media alongside full discussion threads.

### 5. 🎬 Reels / Short Video Experience
* **Vertical 9:16 Video Player**: Optimized for immersive mobile and desktop viewing.
* **Playback Controls**: Autoplay, mute/unmute audio toggling, and play/pause on tap.
* **Audio Track Attribution**: Marquee track title with rotating vinyl record animation.
* **Right Stack Actions**: Quick like with counter, comment drawer, share link, and bookmark.

### 6. 👤 User Profiles & Customization
* **Creator Banners & Avatars**: High-contrast cover headers, glowing ring profile pictures, and verified badges.
* **Stats Counters**: Dynamic followers, following, and total post metrics.
* **Profile Tabs**:
  * **Posts**: Grid gallery of published images and carousels.
  * **Reels**: Vertical video library.
  * **Saved**: Private bookmarks repository (only visible to the profile owner).
  * **Tagged**: Collaborations and tagged photography.
* **Edit Profile Modal**: Modify display name, biography, website links, geographic location, profile avatar, and banner images.

### 7. 🔔 Notifications Center
* Categorized updates: **All**, **Likes**, **Comments**, **Follows**, and **Mentions**.
* Interactive "Follow Back" actions directly from notification rows.
* One-click "Mark All as Read".

### 8. 🛡️ Authentication & 1-Click Demo Pass
* Full Sign In, Registration, and Password Reset screens featuring the Hummingbird logo.
* **1-Click Demo Pass**: Instantly switch between 4 diverse pre-configured creators (*Alex Vance*, *Elena Rostova*, *Marcus Chen*, *Maya Lin*) to experience the platform from different perspectives without any setup friction!
* Full Supabase Auth readiness when live credentials are provided.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript |
| **Bundler & Build Tool** | Vite 8 |
| **Styling** | Tailwind CSS v4 + Custom Neon Glow Utilities |
| **Icons** | Lucide React |
| **Effects & Canvas** | Canvas Confetti (celebration bursts) |
| **Backend & Database** | Supabase (PostgreSQL 15+) |
| **Authentication** | Supabase Auth (with Local-First Demo Fallback) |
| **File Storage** | Supabase Storage (`posts`, `avatars`, `stories`, `reels`) |
| **Realtime** | Supabase Realtime Channels |

---

## 📂 Project Directory Structure

```text
aurora-social/
├── public/
│   ├── aurora-logo.png          # Official Hummingbird Application Logo
│   ├── design-reference.jpg     # UI inspiration reference
│   └── favicon.svg              # App favicon
├── src/
│   ├── assets/
│   │   └── aurora-logo.png      # Bundled logo assets
│   ├── components/
│   │   ├── auth/
│   │   │   └── AuthModal.tsx    # Sign In, Sign Up, Reset Password & Demo Switcher
│   │   ├── chat/
│   │   │   └── ChatView.tsx     # Direct Messaging system & conversations list
│   │   ├── common/
│   │   │   ├── Avatar.tsx       # Neon-ringed avatar with online/verified badges
│   │   │   ├── Logo.tsx         # Brand logo with glowing aura & typography
│   │   │   └── ToastContainer.tsx # Floating notification pills
│   │   ├── explore/
│   │   │   └── ExploreView.tsx  # Pinterest-inspired masonry grid & search
│   │   ├── feed/
│   │   │   ├── DoubleTapHeart.tsx # Glowing heart burst animation
│   │   │   ├── HomeFeed.tsx     # Center feed with stories & filter tabs
│   │   │   ├── PostCard.tsx     # Post card with carousel, double-click & comments
│   │   │   ├── RightSidebar.tsx # Suggested creators & trending hashtags
│   │   │   └── SavedPostsView.tsx # Private bookmarked posts gallery
│   │   ├── modals/
│   │   │   ├── CreatePostModal.tsx # Post creation with multi-media & upload simulation
│   │   │   ├── PostDetailModal.tsx # Full post view with comments thread
│   │   │   └── ShareModal.tsx   # Social share & clipboard link generator
│   │   ├── navigation/
│   │   │   ├── MobileHeader.tsx # Mobile top bar
│   │   │   ├── MobileNav.tsx    # Mobile bottom navigation bar
│   │   │   └── Sidebar.tsx      # Desktop floating left sidebar & user menu
│   │   ├── profile/
│   │   │   ├── EditProfileModal.tsx # Edit profile details, avatar & cover
│   │   │   └── ProfileView.tsx  # User profile with banner, stats & tabs
│   │   ├── reels/
│   │   │   └── ReelsView.tsx    # Short video vertical viewer with audio sync
│   │   └── stories/
│   │       ├── CreateStoryModal.tsx # Story creator modal
│   │       ├── StoriesBar.tsx   # Horizontal stories tray with neon rings
│   │       └── StoryViewerModal.tsx # Full-screen 5s auto-transition viewer
│   ├── context/
│   │   ├── AuthContext.tsx      # Session management & demo account switching
│   │   └── SocialContext.tsx    # Feed, comments, likes, chat & notifications state
│   ├── data/
│   │   └── mockData.ts          # Curated demo creators, posts, stories & reels
│   ├── lib/
│   │   └── supabase.ts          # Supabase client & fallback detection
│   ├── types/
│   │   └── index.ts             # TypeScript definitions
│   ├── App.tsx                  # Main application router and layout
│   ├── index.css                # Tailwind CSS v4 imports, colors & animations
│   └── main.tsx                 # React DOM root entry
├── supabase/
│   └── schema.sql               # PostgreSQL schema, RLS policies, triggers & seeds
├── .env.example                 # Environment configuration template
├── package.json                 # Project dependencies & scripts
├── tsconfig.json                # TypeScript root configuration
├── vite.config.ts               # Vite & Tailwind CSS bundler configuration
└── README.md                    # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18.0.0 or later (v20+ recommended)
* **npm**: v9.0.0 or later

### Installation

1. Navigate to the project directory:
   ```bash
   cd C:\Users\megha\.gemini\antigravity\scratch\aurora-social
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```text
   http://localhost:5173
   ```

---

## ⚙️ Supabase Configuration & Database Setup

AURORA includes an integrated **Local-First Fallback Layer**. This means the application runs at 100% functionality out of the box with realistic seed data, local storage persistence, and simulated real-time replies even before connecting a Supabase project.

When you are ready to link your production Supabase database:

### Step 1: Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free project.
2. In your Supabase dashboard, navigate to **Project Settings** > **API**.
3. Copy your **Project URL** and **anon public API Key**.

### Step 2: Configure Environment Variables
Create a `.env` file in the project root:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key
```

### Step 3: Run Database Migrations
Open your Supabase project's **SQL Editor**, paste the contents of `supabase/schema.sql`, and click **Run**.

This script sets up:
1. `public.profiles`: User identities linked with `auth.users` on signup.
2. `public.posts`: Posts with media array, aspect ratio, caption, and hashtags.
3. `public.likes`: Unique `(user_id, post_id)` constraints with automatic counter triggers.
4. `public.comments`: Nested comment hierarchy supporting direct replies.
5. `public.follows`: Follower/following relationships with counter synchronization.
6. `public.stories` & `public.story_views`: 24-hour expiration calculation (`expires_at > now()`).
7. `public.reels`: Short video metadata and music attribution.
8. `public.conversations` & `public.messages`: Direct messaging with participant security.
9. `public.notifications`: Real-time social interaction logs.
10. `public.saved_posts`: Bookmarked posts.
11. **Row Level Security (RLS)**: Enforces that users can only modify their own posts, view allowed conversations, and read active stories.

---

## 💡 How Features Work

### 1. Authentication & Creator Switching
* In Demo Mode, you can click on the bottom-left profile pill at any time to switch instantly between **Alex Vance** (Visual Alchemist), **Elena Rostova** (Cyberpunk Photographer), **Marcus Chen** (3D Motion Designer), and **Maya Lin** (Metaverse Fashion Stylist).
* When Supabase credentials are provided, `src/lib/supabase.ts` connects to Supabase Auth (`supabase.auth.signInWithPassword` and `supabase.auth.signUp`).

### 2. Posts, Likes & Heart Animation
* Clicking the heart icon toggles the post's like status.
* Double-clicking or double-tapping anywhere on a post's photo or carousel triggers a luminous neon heart burst (`DoubleTapHeart.tsx`) with sound/haptic feedback.

### 3. Stories & 24h Expiry
* The `StoriesBar` displays active stories with pulsing neon rings.
* Clicking opens `StoryViewerModal`, which automatically ticks through slides every 5 seconds. Users can click left/right edges to navigate or hold down to pause.

### 4. Direct Messaging & Auto-Reply Simulation
* The Chat view lets you initiate 1-on-1 conversations with any creator on the platform.
* When you send a message, the recipient's typing indicator triggers after a short delay and sends an intelligent response back, simulating real-time activity.

---

## 📦 Production Build & Deployment

To create an optimized production build:

```bash
npm run build
```

The compiled assets will be in the `dist/` directory.

### Deploy to Vercel / Netlify
1. Connect your GitHub repository to Vercel or Netlify.
2. Set the build command to `npm run build` and publish directory to `dist`.
3. Add the `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables in your dashboard settings.

---

## 🎨 Color Tokens Reference

| Variable | Hex Value | Role |
| :--- | :--- | :--- |
| `--aurora-bg` | `#050505` | Canvas background |
| `--aurora-sidebar` | `#0B0B0F` | Sidebar & header navigation |
| `--aurora-card` | `#121218` | Primary card panels |
| `--aurora-card-secondary` | `#191922` | Secondary cards & hover states |
| `--aurora-cyan` | `#00D9FF` | Primary action highlights & story rings |
| `--aurora-blue` | `#287BFF` | Gradient accents & buttons |
| `--aurora-pink` | `#FF258A` | Likes, love reactions & badges |
| `--aurora-purple` | `#9B59FF` | Ambient glow & artistic highlights |
| `--aurora-gold` | `#FFC83D` | Bookmarks & verified accents |

---

*AURORA – Connect. Create. Inspire.*
<img width="1912" height="852" alt="image" src="https://github.com/user-attachments/assets/3dbda86e-45fa-4bef-9715-fe7f02ca803f" />
<img width="1887" height="765" alt="image" src="https://github.com/user-attachments/assets/9c4c4af2-09ed-4440-8c18-baf6a1f1af96" /><img width="460" height="736" alt="image" src="https://github.com/user-attachments/assets/b369ff39-1a09-4e0f-825c-72985bca8cc9" /><img width="1167" height="812" alt="image" src="https://github.com/user-attachments/assets/78901cd2-3448-47a1-8e38-59e96f9a6245" />
<img width="1102" height="762" alt="image" src="https://github.com/user-attachments/assets/4d369984-c1f7-4b4d-9a18-8233d3becb2e" /><img width="1135" height="796" alt="image" src="https://github.com/user-attachments/assets/1dc4e24c-d78e-4472-b36b-a8eca982da95" />




