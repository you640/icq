import { useCallback } from 'react';

// In a real app, these would be imports to .wav files
// Since we can't load external assets easily in this prompt constraint without URL, 
// we will just log the action or use very short oscillators if user interaction allowed (browser restriction usually blocks auto-audio).
// We will use console logs to demonstrate the logic hookup.

export const useSound = () => {
  const playUhOh = useCallback(() => {
    // console.log("🔊 Playing: Uh-Oh!");
    // Logic to play sound would go here: new Audio('/uhoh.wav').play();
  }, []);

  const playTypewriter = useCallback(() => {
    // console.log("🔊 Playing: Typewriter click");
  }, []);

  const playIncomingMessage = useCallback(() => {
    // console.log("🔊 Playing: Cuccoo!");
  }, []);

  return { playUhOh, playTypewriter, playIncomingMessage };
};
