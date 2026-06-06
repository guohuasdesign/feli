# FELI

FELI is a mobile-first financial learning app built with Expo, React Native, and TypeScript. It includes guided lessons, a voice coach, glossary content, and investment learning flows.

## Tech Stack

- Expo
- React Native
- TypeScript
- Expo Router
- NativeWind / Tailwind CSS
- Zustand
- ElevenLabs text-to-speech

## Setup

Install dependencies:

```sh
npm install
```

Create a local environment file:

```sh
cp .env.example .env.local
```

Add your ElevenLabs API key:

```env
EXPO_PUBLIC_ELEVENLABS_API_KEY=your_key_here
```

Do not commit `.env.local`.

## Run Locally

Start the Expo dev server:

```sh
npx expo start -c
```

Then choose one option:

- Scan the QR code with Expo Go
- Press `a` for Android
- Press `i` for iOS
- Press `w` for web

For sharing a temporary dev preview:

```sh
npx expo start --tunnel
```

## Web Build

Export the web version:

```sh
npm run build
```

The static web output is generated in:

```sh
dist/
```

## Vercel Deploy

Vercel uses:

```sh
npm run build
```

Output directory:

```sh
dist
```

Add this environment variable in Vercel if voice should work on web:

```env
EXPO_PUBLIC_ELEVENLABS_API_KEY=your_key_here
```

## EAS Preview Build

Android preview build:

```sh
npx eas-cli build --platform android --profile preview
```

iOS preview build:

```sh
npx eas-cli build --platform ios --profile preview
```

## Notes

`EXPO_PUBLIC_` variables are exposed to the client. For production, move ElevenLabs calls behind a backend API so the API key is not public.
