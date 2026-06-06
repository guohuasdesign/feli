import { useCallback, useEffect, useRef, useState } from 'react';
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

import {
  DEFAULT_VOICE_ID,
  ElevenLabsError,
  textToSpeechDataUri,
} from '@/lib/elevenlabs';

type Status = 'idle' | 'loading' | 'playing';

// Simple in-memory cache so re-playing the same line is instant and free.
const audioCache = new Map<string, string>();

function cacheKey(text: string, voiceId: string): string {
  return `${voiceId}::${text.trim()}`;
}

/**
 * Voice playback hook backed by ElevenLabs TTS + expo-audio.
 * Tracks which line is currently active so a list can show per-bubble state.
 */
export function useVoice() {
  const playerRef = useRef<AudioPlayer | null>(null);
  const subRef = useRef<{ remove: () => void } | null>(null);
  const tokenRef = useRef(0);

  const [status, setStatus] = useState<Status>('idle');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {
      // Non-fatal: audio still plays with ringer on.
    });
    return () => {
      subRef.current?.remove();
      playerRef.current?.remove();
      playerRef.current = null;
    };
  }, []);

  const stop = useCallback(() => {
    tokenRef.current += 1; // invalidate any in-flight request
    subRef.current?.remove();
    subRef.current = null;
    if (playerRef.current) {
      try {
        playerRef.current.pause();
        playerRef.current.remove();
      } catch {
        // ignore teardown errors
      }
      playerRef.current = null;
    }
    setStatus('idle');
    setActiveId(null);
  }, []);

  const play = useCallback(
    async (id: string, text: string, voiceId: string = DEFAULT_VOICE_ID) => {
      setError(null);

      // Toggle off if the same line is active.
      if (activeId === id && status !== 'idle') {
        stop();
        return;
      }

      stop();
      const token = ++tokenRef.current;
      setActiveId(id);
      setStatus('loading');

      try {
        const key = cacheKey(text, voiceId);
        let uri = audioCache.get(key);
        if (!uri) {
          uri = await textToSpeechDataUri(text, voiceId);
          audioCache.set(key, uri);
        }
        if (token !== tokenRef.current) return; // superseded

        const player = createAudioPlayer({ uri });
        playerRef.current = player;
        subRef.current = player.addListener('playbackStatusUpdate', (s) => {
          if (token !== tokenRef.current) return;
          if (s.didJustFinish) {
            setStatus('idle');
            setActiveId(null);
            subRef.current?.remove();
            subRef.current = null;
            player.remove();
            if (playerRef.current === player) playerRef.current = null;
          } else if (s.playing) {
            setStatus('playing');
          }
        });
        player.play();
        setStatus('playing');
      } catch (e) {
        if (token !== tokenRef.current) return;
        const msg =
          e instanceof ElevenLabsError ? e.message : 'Could not play voice right now.';
        setError(msg);
        setStatus('idle');
        setActiveId(null);
      }
    },
    [activeId, status, stop],
  );

  return { play, stop, status, activeId, error };
}
