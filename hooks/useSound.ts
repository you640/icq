import { useCallback } from 'react';

// Simple synth to generate retro sounds without external assets
const playTone = (freq: number, type: OscillatorType, duration: number, delay: number = 0) => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;
  
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
  
  gain.gain.setValueAtTime(0.1, ctx.currentTime + delay);
  gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + delay + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration);
};

export const useSound = () => {
  const playUhOh = useCallback(() => {
    // Classic ICQ "Uh-Oh" is a high-low siren
    playTone(800, 'square', 0.2, 0);
    playTone(300, 'sawtooth', 0.4, 0.2);
  }, []);

  const playTypewriter = useCallback(() => {
    // Short mechanical click
    playTone(800, 'square', 0.03, 0);
    // Add a tiny bit of noise simulation if possible, but a short square blip works for retro keypress
  }, []);

  const playIncomingMessage = useCallback(() => {
    // "Cu-Coo!"
    playTone(1200, 'sine', 0.1, 0);
    playTone(800, 'sine', 0.3, 0.1);
  }, []);

  return { playUhOh, playTypewriter, playIncomingMessage };
};
