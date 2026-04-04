# New Age Yogi Guru 🧘

AI-powered yoga class builder for aspiring teachers.

## Who It's For

Recent graduates of YTT200, YTT300, and YTT500 yoga teacher training programs who need help building fully composed classes, finding safe transitions, and developing their teaching voice.

## What It Does

- **AI Class Builder** — Compose full yoga sequences for specific outcomes, styles, and body focus areas
- **Pose Library** — Browse poses with images, Sanskrit names, and teaching cues
- **Transition Intelligence** — AI-suggested segues between poses with anatomical safety awareness
- **Teaching Cues** — Key phrases and verbal cues for each pose
- **Class Portfolio** — Save, organize, and manage your class sequences
- **Notes** — Annotate individual poses and full sequences
- **AI Chat** — Ask anything about sequencing, anatomy, modifications, or teaching methodology

## Tech Stack

- **Frontend:** React Native + Expo (iOS & Android)
- **AI:** Anthropic Claude API
- **Language:** TypeScript (strict mode)
- **Navigation:** Expo Router (file-based)

## Setup

```bash
# Clone the repo
git clone <repo-url>
cd New_Age_Yogi_Guru

# Install dependencies
npm install

# Start the dev server
npx expo start
```

Then open in:
- **iOS Simulator:** Press `i`
- **Android Emulator:** Press `a`
- **Expo Go on device:** Scan the QR code

## Project Structure

```
app/
  _layout.tsx              # Root layout (Stack navigator)
  +not-found.tsx           # 404 screen
  (tabs)/
    _layout.tsx            # Bottom tab navigator
    index.tsx              # Home screen
    poses.tsx              # Pose Library
    builder.tsx            # AI Class Builder
    portfolio.tsx          # Saved Classes
assets/
  fonts/                   # Custom fonts
  images/                  # App icons and splash
components/                # Shared UI components
constants/
  Colors.ts                # Yoga-inspired color palette
```

## Development

This project uses GSD (Get Shit Done) for structured development tracking. See `.gsd/` for milestone plans, requirements, and decisions.
