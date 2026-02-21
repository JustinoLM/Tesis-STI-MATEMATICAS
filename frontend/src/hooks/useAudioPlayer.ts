/**
 * Hook que gestiona la reproducción de música de fondo del tema activo.
 *
 * Suscribe al themeStore y mantiene un único elemento <audio> durante
 * toda la sesión. Cuando el estudiante:
 *   - Activa el audio → fade in de la canción activa (si hay una)
 *   - Desactiva el audio → fade out y pausa
 *   - Cambia de canción → fade out, carga la nueva, fade in
 *   - Cambia el volumen → ajusta el volumen sin interrumpir la transición
 *   - Cambia de tema → la portabilidad ya la maneja themeStore;
 *     este hook simplemente reacciona al nuevo musicaActivaId
 *
 * Se debe llamar UNA SOLA VEZ en MainLayout para que persista
 * entre navegaciones de página.
 */

import { useEffect, useRef, useCallback } from 'react';
import { useThemeStore } from '@/store/themeStore';
import { MUSICAS } from '@/types/shop';

// Duración del fade en milisegundos
const FADE_DURATION_MS = 1200;
// Frecuencia de actualización del fade (cada N ms)
const FADE_STEP_MS = 30;

export function useAudioPlayer() {
  const audioRef   = useRef<HTMLAudioElement | null>(null);
  // Guardamos el id del intervalo de fade activo para poder cancelarlo
  const fadeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Suscribir a valores primitivos para que el efecto se re-ejecute
  // solo cuando realmente cambian (evita re-renders innecesarios)
  const audioActivado  = useThemeStore(s => s.audioActivado);
  const volumen        = useThemeStore(s => s.volumen);
  const musicaActivaId = useThemeStore(
    s => s.preferenciasPorTema[s.temaActivoId]?.musicaActivaId ?? null
  );

  // Resolver la URL de la música activa
  const urlMusica = musicaActivaId
    ? (MUSICAS.find(m => m.id === musicaActivaId)?.config?.urlAudio ?? null)
    : null;

  /** Cancela cualquier fade en curso */
  const cancelFade = useCallback(() => {
    if (fadeTimerRef.current !== null) {
      clearInterval(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
  }, []);

  /**
   * Fade out: baja el volumen gradualmente de `fromVol` a 0
   * y llama a `onComplete` cuando termina.
   */
  const fadeOut = useCallback((audio: HTMLAudioElement, fromVol: number, onComplete: () => void) => {
    cancelFade();
    if (fromVol <= 0) { onComplete(); return; }

    const steps = Math.ceil(FADE_DURATION_MS / FADE_STEP_MS);
    const decrement = fromVol / steps;
    let current = fromVol;

    fadeTimerRef.current = setInterval(() => {
      current -= decrement;
      if (current <= 0) {
        audio.volume = 0;
        cancelFade();
        onComplete();
      } else {
        audio.volume = current;
      }
    }, FADE_STEP_MS);
  }, [cancelFade]);

  /**
   * Fade in: sube el volumen gradualmente de 0 hasta `targetVol`.
   */
  const fadeIn = useCallback((audio: HTMLAudioElement, targetVol: number) => {
    cancelFade();
    if (targetVol <= 0) return;

    audio.volume = 0;
    const steps = Math.ceil(FADE_DURATION_MS / FADE_STEP_MS);
    const increment = targetVol / steps;
    let current = 0;

    fadeTimerRef.current = setInterval(() => {
      current += increment;
      if (current >= targetVol) {
        audio.volume = targetVol;
        cancelFade();
      } else {
        audio.volume = current;
      }
    }, FADE_STEP_MS);
  }, [cancelFade]);

  // ── Efecto principal: cambio de canción o activación/desactivación ──
  useEffect(() => {
    // Crear elemento <audio> la primera vez
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }

    const audio = audioRef.current;
    const targetVol = volumen / 100;

    if (!audioActivado || !urlMusica) {
      // Desactivar: fade out → pausa
      fadeOut(audio, audio.volume, () => {
        audio.pause();
      });
      return;
    }

    const currentSrc = audio.src
      ? new URL(audio.src, window.location.origin).href
      : '';
    const newSrc = new URL(urlMusica, window.location.origin).href;

    if (currentSrc === newSrc && !audio.paused) {
      // Misma canción ya reproduciendo — no hacer nada
      return;
    }

    if (!audio.paused && currentSrc !== newSrc) {
      // Canción distinta: fade out → cambiar → fade in
      fadeOut(audio, audio.volume, () => {
        audio.src = urlMusica;
        audio.load();
        audio.play()
          .then(() => fadeIn(audio, targetVol))
          .catch(() => { /* autoplay bloqueado */ });
      });
    } else {
      // Sin audio previo o pausado: cargar directamente con fade in
      if (currentSrc !== newSrc) {
        audio.src = urlMusica;
        audio.load();
      }
      audio.play()
        .then(() => fadeIn(audio, targetVol))
        .catch(() => { /* autoplay bloqueado */ });
    }

    return () => {
      // Al desmontar el layout: fade out rápido → pausa
      fadeOut(audio, audio.volume, () => audio.pause());
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioActivado, urlMusica]);

  // ── Efecto separado: cambio de volumen (respeta fade en curso) ──
  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    // Solo ajustamos si no hay un fade activo (para no interferir con la transición)
    if (fadeTimerRef.current === null && !audio.paused) {
      audio.volume = volumen / 100;
    }
  }, [volumen]);

  return audioRef;
}
