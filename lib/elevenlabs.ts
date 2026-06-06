// ElevenLabs text-to-speech client for FELI's voice coach.
// Calls the ElevenLabs API directly from the app (no backend). The key is read
// from EXPO_PUBLIC_ELEVENLABS_API_KEY (build-time inlined) with a runtime
// fallback to expo-constants `extra.elevenLabsApiKey` so it survives sandbox
// env injection that happens after the bundler starts.
import Constants from 'expo-constants';

const API_BASE = 'https://api.elevenlabs.io/v1';

/** Warm, encouraging female voice ("Sarah") — FELI's default coach. */
export const DEFAULT_VOICE_ID = 'EXAVITQu4vr4xnSDxMaL';

/** A few curated warm female voices the user can switch between. */
export const VOICE_OPTIONS = [
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', tone: 'Warm & encouraging' },
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', tone: 'Calm & clear' },
  { id: 'XrExE9yKIg1WjnnlVkGX', name: 'Matilda', tone: 'Bright & friendly' },
] as const;

const MODEL_ID = 'eleven_multilingual_v2';

function getApiKey(): string | undefined {
  const fromEnv = process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY;
  if (fromEnv) return fromEnv;
  const fromExtra = (Constants.expoConfig?.extra as { elevenLabsApiKey?: string } | undefined)
    ?.elevenLabsApiKey;
  return fromExtra || undefined;
}

export function hasElevenLabsKey(): boolean {
  return Boolean(getApiKey());
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  // btoa is available in the RN/Hermes + web runtimes used by Expo.
  return globalThis.btoa(binary);
}

export class ElevenLabsError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ElevenLabsError';
    this.status = status;
  }
}

/**
 * Converts text to speech via ElevenLabs and returns a base64 mp3 data URI
 * that expo-audio's createAudioPlayer can play on native and web.
 */
export async function textToSpeechDataUri(
  text: string,
  voiceId: string = DEFAULT_VOICE_ID,
): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new ElevenLabsError('Voice is not configured. Add your ElevenLabs API key.');
  }

  const trimmed = text.trim().slice(0, 2500);
  if (!trimmed) throw new ElevenLabsError('Nothing to read aloud.');

  let res: Response;
  try {
    res = await fetch(`${API_BASE}/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text: trimmed,
        model_id: MODEL_ID,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.25,
          use_speaker_boost: true,
        },
      }),
    });
  } catch {
    throw new ElevenLabsError('Could not reach the voice service. Check your connection.');
  }

  if (!res.ok) {
    let detail = '';
    try {
      detail = await res.text();
    } catch {
      // ignore
    }
    if (res.status === 401) {
      throw new ElevenLabsError('Voice key was rejected. Check your ElevenLabs API key.', 401);
    }
    throw new ElevenLabsError(
      `Voice service error (${res.status}). ${detail.slice(0, 120)}`,
      res.status,
    );
  }

  const buffer = await res.arrayBuffer();
  const base64 = arrayBufferToBase64(buffer);
  return `data:audio/mpeg;base64,${base64}`;
}
