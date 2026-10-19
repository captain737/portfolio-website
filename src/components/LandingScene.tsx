import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import type { PointerEvent, KeyboardEvent } from "react";
import { motion, useMotionValue, animate, useMotionValueEvent } from "motion/react";

interface LandingSceneProps {
  onDial: (num: string) => void;
  onTextStart?: () => void;
}

export interface LandingSceneRef {
  simulateDial: (num: string) => void;
}

const ROTARY_TICK_B64 = "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAFAAAE5ABVVVVVVVVVVVVVVVVVVVVVVVVVf39/f39/f39/f39/f39/f39/f3+qqqqqqqqqqqqqqqqqqqqqqqqqqtXV1dXV1dXV1dXV1dXV1dXV1dXV//////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAMGAAAAAAAABOSh7o+HAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7UMQAAAd8EykkpMABXRupNPMN3gAiAGRZQUAgRk4OmenYIKDDHlz5cHzmIJc+XD8ooMFHYnDHLv+IL/8uf+IAQcD5fE4f05CH/85kMMf/1CXXa2SNtIgEFvceLGas5KTA1RwZyfaQ1bZFJzQkQ7m0jOXllHTZ+RoVc5ZzhV6Xlbv6zzayXKsRcj9sS/9kM2IjyNQg1gPlFOr7+ZnKUU10resX7X9bNCoCa5qslX31sRKDONMDZ+N+JA4h2eHjBEjK8JNF7a34V8jiICIoib7/+1LEE4AKrFtD57Bh4UkKajT0mO7mZsHYLAMcAQAKoDxJIugTCMShN6Bdrg8oUKjTdUIulqb/ubShOx//XoWu5X+1Q3/++2lkbJIHphC5AJQGY+iZtoyBSw6sEUAKiVUKzimxziZrPebf8nkywlz4JHg8IxCGTwlLiJp4kBhODqyJcw8q8LR63palfoVii63k//kK6l0Ft6u8mI3tkaSEbVpNYw/U5NxYTlQ8G5IJIJFF+sDDFGohw6SG2T4oQsFxghQsaHrGsWMTWDYiCyXPkv/7UsQdgEpgXUXnsGchZxIofPMN1DaLA1d3ijhY8f7hWsf9dUZc8gzV/+xjqQmambqpe7agHa0fp7rtKoazRD+isLSW06kDBYKC1OdZ16mZk1lgMqQpWulLzYIO6G1gMiPaI0UhgCImNDK5A3vYBDghHKSxp4CJPUtNe52tpFSUX0jEa/7vpRttt9ZW20iQIiMoHsUrQPDAtKh0JEag5HYkNvrBUCRLGhNZhzuXtHih1AfMBkKFXvE4GBgXAYqFgHAyR7kGjymMUUepDFpyFzbn//tSxCUAirxJNawwwYFVGqb6sFAAe/dc1R+33fZ+w1/WJszO0SpfIEyFkoiQ48MRed+rsPU83TS+T0zqwgCCwMEoGEKWM8WDoxXdUmSy6K10f3egkeXU2ZV0kU6VqRXZTLdJ1bYXNucEEX3tamckT2f7/r/X9qokWB42HQ2KpWCMxhMkkMqLgE0LQF5J1SqaUgxdnUppOxqUuS5L7p2IZ0ZMHNxLBoBAyZr1UqgsAfBMf1tpm8fUaLB44v3Fy6q2617bXVnkb6hJXLW2v9Xc+/L/+1LELQATWSk5uaYAAS0rH8sgUAH17Z445XPtMzvTSmXtK9f7jFvpaZrlrbWv7vSzOVm7N7sLDxfeVlBEFXZ5xJkIxhedaYB8CCIShIGhKd//8b//rgQgwwwAXBKfitFe5DfAUF8BgGFvw6Ijjf4DD0v/4ipRISH//iIiKiQkPL//iLLKJCQsI///iIqEhIeIiLTf///S4iUokJCwiIjjDUxBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==";

let audioCtx: AudioContext | null = null;
let tickBuffer: AudioBuffer | null = null;

const initAudio = async () => {
  if (typeof window === 'undefined') return;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (!tickBuffer) {
    try {
      const response = await fetch(ROTARY_TICK_B64);
      const arrayBuffer = await response.arrayBuffer();
      tickBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    } catch (e) {
      console.error("Failed to decode rotary tick audio", e);
    }
  }
};

const playTring = (isReturn: boolean = false) => {
  if (!audioCtx || !tickBuffer) {
    initAudio();
    return;
  }
  try {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const source = audioCtx.createBufferSource();
    source.buffer = tickBuffer;
    
    // Slightly faster playback rate for the mechanical wind-back spring
    source.playbackRate.value = isReturn ? 1.2 : 0.9;
    
    const gainNode = audioCtx.createGain();
    gainNode.gain.value = isReturn ? 0.04 : 0.05; // Tactile faint volume

    source.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    source.start();
  } catch (e) {
    console.error("Audio playback failed", e);
  }
};

const playTelephoneRing = () => {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const freq1 = 400; 
    const freq2 = 450; 

    const createPulse = (startTime: number, duration: number) => {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const modulator = ctx.createOscillator();
      const modGain = ctx.createGain();
      const masterGain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.value = freq1;
      osc2.frequency.value = freq2;
      
      modulator.type = 'square';
      modulator.frequency.value = 25; // ringer speed
      
      osc1.connect(modGain);
      osc2.connect(modGain);
      
      modGain.gain.value = 0.5;
      
      const modDepth = ctx.createGain();
      modDepth.gain.value = 0.5;
      modulator.connect(modDepth);
      modDepth.connect(modGain.gain);
      
      modGain.connect(masterGain);
      masterGain.connect(ctx.destination);
      
      masterGain.gain.setValueAtTime(0, startTime);
      masterGain.gain.linearRampToValueAtTime(0.02, startTime + 0.05); // Tactile ringing volume
      masterGain.gain.setValueAtTime(0.02, startTime + duration - 0.1);
      masterGain.gain.linearRampToValueAtTime(0, startTime + duration);
      
      osc1.start(startTime);
      osc2.start(startTime);
      modulator.start(startTime);
      
      osc1.stop(startTime + duration);
      osc2.stop(startTime + duration);
      modulator.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    
    // Tring ... Tring
    createPulse(now + 0.05, 0.35);
    createPulse(now + 0.55, 0.35);
    
    // Tring ... Tring
    createPulse(now + 1.45, 0.35);
    createPulse(now + 1.95, 0.35);
    
    setTimeout(() => {
      if (ctx.state !== 'closed') ctx.close();
    }, 2800);
  } catch (e) {
    console.error("Failed to play ring", e);
  }
};

const AnimatedCord = ({ isWobbling }: { isWobbling: boolean }) => {
  return (
    <motion.path
      d="M 235,530 C 120,470 120,640 150,600 C 180,560 210,690 140,660 C 70,630 80,770 140,730 C 200,690 170,820 90,790 C 10,760 10,880 70,850 C 130,820 200,880 250,840 C 300,800 340,860 380,820"
      stroke="#2c2a26"
      strokeWidth="4.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      filter="url(#rough)"
      animate={
        isWobbling
          ? {
              scaleY: [1, 1.2, 0.8, 1.15, 0.85, 1.1, 0.9, 1.05, 0.95, 1.02, 0.98, 1],
              scaleX: [1, 0.8, 1.2, 0.85, 1.15, 0.9, 1.1, 0.95, 1.05, 0.98, 1.02, 1],
              rotate: [0, -6, 6, -5, 5, -4, 4, -2, 2, -1, 1, 0],
            }
          : { scaleX: 1, scaleY: 1, rotate: 0 }
      }
      transition={{ duration: isWobbling ? 2.6 : 4.0, ease: "easeInOut" }}
      style={{ transformOrigin: "235px 530px" }}
    />
  );
};

export const LandingScene = forwardRef<LandingSceneRef, LandingSceneProps>(({ onDial, onTextStart }, ref) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const rotation = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isWobbling, setIsWobbling] = useState(false);
  const lastTickAngle = useRef(0);
  const [hasBeenPoked, setHasBeenPoked] = useState(false);
  const hasAutoTurned = useRef(false);
  const [isLaptop, setIsLaptop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  );

  useEffect(() => {
    const handleResize = () => {
      setIsLaptop(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Pre-load audio & unlock on first user gesture
  useEffect(() => {
    initAudio();

    const unlockAudio = () => {
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }
      if ((window as any).typewriterCtx && (window as any).typewriterCtx.state === 'suspended') {
        (window as any).typewriterCtx.resume().catch(() => {});
      }
    };

    window.addEventListener('pointerdown', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });

    // On initial page landing, turn the dialpad automatically to reveal the phone message
    const autoTurnTimer = setTimeout(async () => {
      if (hasAutoTurned.current || hasBeenPoked) return;
      hasAutoTurned.current = true;

      // Hole index 1 (number '2') gives a prominent, tactile ~101 degree sweep
      const holeIndex = 1;
      const maxRot = 40 - (-35 - (holeIndex * 26));

      try {
        // Smoothly wind dial to finger stop
        await animate(rotation, maxRot, { duration: 0.65, ease: [0.25, 0.1, 0.25, 1] });
        await new Promise(r => setTimeout(r, 120));
        // Spring recoil return
        await animate(rotation, 0, { type: "spring", stiffness: 85, damping: 14 });
        
        // Trigger phone ringing wobble & reveal message
        triggerRing();
      } catch (e) {
        triggerRing();
      }
    }, 850);

    return () => {
      clearTimeout(autoTurnTimer);
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, []);
  
  useMotionValueEvent(rotation, "change", (latest) => {
    if (Math.abs(latest - lastTickAngle.current) > 15) {
      const isReturn = latest < lastTickAngle.current;
      playTring(isReturn);
      lastTickAngle.current = latest;
    }
  });

  const activeDragInfo = useRef({ holeIndex: -1, startAngle: 0, maxRotation: 0, action: '', dialCx: 0, dialCy: 0 });
  const isDialingRef = useRef(false);
  const pointerStartPos = useRef({ x: 0, y: 0, time: 0 });

  const triggerRing = () => {
    if (hasBeenPoked) return;
    
    // Resume typewriter context early on user interaction so it's ready for text
    if (typeof window !== 'undefined') {
      try {
        if (!(window as any).typewriterCtx) {
          (window as any).typewriterCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const ctx = (window as any).typewriterCtx as AudioContext;
        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
      } catch (e) {
        // ignore
      }
    }

    setHasBeenPoked(true);
    setIsWobbling(true);
    playTelephoneRing();
    const timer = setTimeout(() => {
      setIsWobbling(false);
      if (onTextStart) onTextStart();
    }, 2600);
  };

  const holesData = [
    { id: '1', num: '1', action: '1' },
    { id: '2', num: '2', action: '2' },
    { id: '3', num: '3', action: '3' },
    { id: '4', num: '4', action: '4' },
    { id: '5', num: '5', action: '5' },
    { id: '6', num: '6', action: '6' },
    { id: '7', num: '7', action: '7' },
    { id: '8', num: '8', action: '8' },
    { id: '9', num: '9', action: '9' },
    { id: '0', num: '0', action: '0', label: 'END' },
  ];

  useImperativeHandle(ref, () => ({
    simulateDial: async (num: string) => {
      if (isDragging || isWobbling || isDialingRef.current) return;
      isDialingRef.current = true;
      try {
        const holeIndex = holesData.findIndex(h => h.num === num);
        if (holeIndex === -1) return;
        
        const maxRot = 40 - (-35 - (holeIndex * 26));
        // Snappy smooth rotation: wind up with smooth ease
        await animate(rotation, maxRot, { duration: Math.max(0.14, Math.min(0.25, maxRot * 0.0025)), ease: [0.25, 0.1, 0.25, 1] });
        await new Promise(r => setTimeout(r, 60));
        // Spring return back to home position
        await animate(rotation, 0, { type: "spring", stiffness: 120, damping: 14 });
        onDial(num);
      } finally {
        isDialingRef.current = false;
      }
    }
  }));

  const handlePointerDown = (e: PointerEvent<SVGGElement>, index: number, action: string) => {
    if (!svgRef.current || isWobbling || isDialingRef.current) return;
    hasAutoTurned.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    
    const rect = svgRef.current.getBoundingClientRect();
    const dialCx = rect.left + rect.width * (440 / 800);
    const dialCy = rect.top + rect.height * (580 / 900);
    
    const angle = Math.atan2(e.clientY - dialCy, e.clientX - dialCx) * (180 / Math.PI);
    
    pointerStartPos.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    activeDragInfo.current = { holeIndex: index, startAngle: angle, maxRotation: 40 - (-35 - (index * 26)), action, dialCx, dialCy };
    setIsDragging(true);
  };

  const handlePointerMove = (e: PointerEvent<SVGGElement>) => {
    if (!isDragging) return;
    const { startAngle, maxRotation, dialCx, dialCy } = activeDragInfo.current;
    
    const currentAngle = Math.atan2(e.clientY - dialCy, e.clientX - dialCx) * (180 / Math.PI);
    let diff = currentAngle - startAngle;
    
    if (diff < -180) diff += 360;
    if (diff > 180) diff -= 360;
    
    rotation.set(Math.max(0, Math.min(diff, maxRotation)));
  };

  const handlePointerUp = async (e: PointerEvent<SVGGElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
    
    const { maxRotation, action } = activeDragInfo.current;
    const currentRot = rotation.get();
    const dx = e.clientX - pointerStartPos.current.x;
    const dy = e.clientY - pointerStartPos.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const dt = Date.now() - pointerStartPos.current.time;

    // Direct tap on the hole
    if (dist < 14 && dt < 350 && currentRot < 15) {
      if (!isDialingRef.current) {
        if (!hasBeenPoked) {
          triggerRing();
        } else {
          isDialingRef.current = true;
          try {
            await animate(rotation, maxRotation, { duration: Math.max(0.14, Math.min(0.25, maxRotation * 0.0025)), ease: [0.25, 0.1, 0.25, 1] });
            await new Promise(r => setTimeout(r, 60));
            await animate(rotation, 0, { type: "spring", stiffness: 120, damping: 14 });
            onDial(action);
          } finally {
            isDialingRef.current = false;
          }
        }
      }
      return;
    }
    
    if (currentRot > maxRotation * 0.85) {
      await animate(rotation, 0, { type: "spring", stiffness: 90, damping: 14, mass: 1 });
      
      // Trigger ring ONLY if it hasn't been poked yet
      if (!hasBeenPoked) {
        triggerRing();
      } else {
        onDial(action);
      }
    } else {
      animate(rotation, 0, { type: "spring", stiffness: 150, damping: 15 });
    }
  };

  const handleKeyDown = async (e: KeyboardEvent<SVGGElement>, index: number, action: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (isDragging || isDialingRef.current) return;
      hasAutoTurned.current = true;
      const maxRotation = 40 - (-35 - (index * 26));
      isDialingRef.current = true;
      try {
        await animate(rotation, maxRotation, { duration: Math.max(0.14, Math.min(0.25, maxRotation * 0.0025)), ease: [0.25, 0.1, 0.25, 1] });
        await new Promise(r => setTimeout(r, 60));
        await animate(rotation, 0, { type: "spring", stiffness: 120, damping: 14 });
        
        if (!hasBeenPoked) {
          triggerRing();
        } else {
          onDial(action);
        }
      } finally {
        isDialingRef.current = false;
      }
    }
  };

  const receiverAnimation = isWobbling
    ? {
        y: [0, -90, -10, -70, -5, -40, 0, -15, 0],
        rotate: [0, -18, 12, -15, 10, -8, 5, -2, 0],
        scaleX: [1, 0.9, 1.1, 0.95, 1.05, 0.98, 1.02, 0.99, 1],
        scaleY: [1, 1.1, 0.9, 1.05, 0.95, 1.02, 0.98, 1.01, 1],
        transition: { duration: 2.6, ease: "easeInOut" }
      }
    : !isDragging
    ? {
        y: [0, -4, 0],
        rotate: [0, -1, 1, 0],
        transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
      }
    : {
        y: 0,
        rotate: 0,
        scaleX: 1,
        scaleY: 1,
        transition: { duration: 0.3 }
      };

  return (
    <div className="w-[min(88vw,calc(72vh*800/900))] max-w-[680px] aspect-[800/900] relative overflow-visible flex items-center justify-center select-none my-auto">
      <svg ref={svgRef} className="w-full h-full relative z-[1] block overflow-visible" viewBox="0 0 800 900" role="img" aria-label="Interactive retro telephone and desk scene">

        <defs>
          <filter id="rough" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="rough-light" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <linearGradient id="metallic" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e0e4ec"/>
            <stop offset="25%" stopColor="#ffffff"/>
            <stop offset="50%" stopColor="#878b94"/>
            <stop offset="75%" stopColor="#b8c6db"/>
            <stop offset="100%" stopColor="#e0e4ec"/>
          </linearGradient>
          <linearGradient id="blue-velvet" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a2042"/>
            <stop offset="50%" stopColor="#25356e"/>
            <stop offset="100%" stopColor="#141830"/>
          </linearGradient>
          <linearGradient id="beam-fade" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffeb3b" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#ffeb3b" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ffeb3b" stopOpacity="0" />
          </linearGradient>
          <pattern id="pixel-mesh" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="4" fill="none" />
            <rect x="0" y="0" width="1" height="1" fill="#2c2a26" opacity="0.12" />
          </pattern>
        </defs>

        {/* Window */}
        <g className="window" transform="translate(-450, 20)">
          {/* Mountains/Outside View - 8-Bit Pixel Stepped Mountains */}
          <rect x="0" y="0" width="260" height="360" fill="#bae6fd" />
          <polygon points="0,360 0,260 40,260 40,220 80,220 80,180 120,180 120,220 160,220 160,260 200,260 200,210 230,210 230,240 260,240 260,360" fill="#94a3b8" />
          <polygon points="0,360 0,290 60,290 60,250 110,250 110,220 150,220 150,260 190,260 190,280 260,280 260,360" fill="#64748b" />
          
          {/* 8-Bit Pixel Sun */}
          <g transform="translate(180, 60)" fill="#fde047">
            <rect x="8" y="0" width="16" height="32" />
            <rect x="0" y="8" width="32" height="16" />
            <rect x="4" y="4" width="24" height="24" />
          </g>

          {/* Inner Glass */}
          <rect x="0" y="0" width="260" height="360" fill="#ffffff" opacity="0.3" />
          
          {/* Window Outer Frame */}
          <rect x="0" y="0" width="260" height="360" fill="none" stroke="#2c2a26" strokeWidth="8" strokeLinejoin="round" />
          <rect x="-10" y="-10" width="280" height="380" fill="none" stroke="#2c2a26" strokeWidth="3" strokeLinejoin="round" opacity="0.7" />
          
          {/* Mullions */}
          <line x1="0" y1="180" x2="260" y2="180" stroke="#2c2a26" strokeWidth="6" strokeLinecap="round" />
          <line x1="130" y1="0" x2="130" y2="360" stroke="#2c2a26" strokeWidth="6" strokeLinecap="round" />
          
          {/* Window Sill */}
          <path d="M -20,380 L 280,380 L 280,395 L -20,395 Z" fill="#ffffff" stroke="#2c2a26" strokeWidth="6" strokeLinejoin="round" />
          <path d="M -10,395 L 270,395 L 270,405 L -10,405 Z" fill="#ffffff" stroke="#2c2a26" strokeWidth="4" strokeLinejoin="round" opacity="0.6" />
        </g>

        {/* Pennant Flag */}
        <g 
          className="pennant-flag" 
          transform={isLaptop ? "translate(1000, 48) scale(0.85) rotate(-8)" : "translate(530, 110) scale(0.58) rotate(-8)"}
        >
          {/* Pink Scallops - using a dashed stroke on a duplicate polygon */}
          <polygon points="0,-90 0,90 340,0" fill="none" stroke="#ea7684" strokeWidth="55" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="0 45" />
          
          {/* Otter Back/Body */}
          <g className="otter-back">
            {/* Tail */}
            <path d="M 220,70 Q 215,130 195,140" fill="none" stroke="#403028" strokeWidth="10" strokeLinecap="round" />
            {/* Bottom Legs */}
            <path d="M 205,65 L 195,110 M 235,65 L 240,110" stroke="#403028" strokeWidth="8" strokeLinecap="round" />
            {/* Body */}
            <rect x="200" y="-70" width="40" height="150" rx="4" fill="#403028" />
            {/* Ears */}
            <rect x="195" y="-80" width="10" height="10" fill="#403028" />
            <rect x="235" y="-80" width="10" height="10" fill="#403028" />
            {/* Belly/Face */}
            <rect x="210" y="-30" width="20" height="100" fill="#fdfaf6" />
            <rect x="208" y="-68" width="24" height="24" fill="#fdfaf6" />
            {/* Eyes & Nose - Pixel Blocks */}
            <rect x="210" y="-65" width="4" height="4" fill="#2c2a26" />
            <rect x="226" y="-65" width="4" height="4" fill="#2c2a26" />
            <rect x="218" y="-58" width="6" height="4" fill="#2c2a26" />
            <rect x="209" y="-70" width="2" height="2" fill="#fdfaf6" />
            <rect x="225" y="-70" width="2" height="2" fill="#fdfaf6" />
          </g>

          {/* Blue Velvet Triangle */}
          <polygon points="0,-90 0,90 340,0" fill="url(#blue-velvet)" />
          
          {/* Otter Front Paws */}
          <g className="otter-front">
            <rect x="204" y="-30" width="10" height="12" fill="#403028" transform="rotate(-15, 208, -25)" />
            <rect x="228" y="-30" width="10" height="12" fill="#403028" transform="rotate(15, 232, -28)" />
          </g>

          {/* Letters in Retro 8-Bit Pixel Font */}
          <g className="pennant-text" fontFamily="'Press Start 2P', monospace" fontWeight="bold" fill="#fdfaf6" stroke="#2c2a26" strokeWidth="2">
            <text x="25" y="30" fontSize="56">P</text>
            <text x="82" y="27" fontSize="48" transform="rotate(-4, 82, 27)">R</text>
            <text x="135" y="24" fontSize="40" transform="rotate(3, 135, 24)">A</text>
            <text x="182" y="21" fontSize="34" transform="rotate(-2, 182, 21)">G</text>
            <text x="225" y="18" fontSize="28" transform="rotate(5, 225, 18)">Y</text>
            <text x="260" y="15" fontSize="22" transform="rotate(-3, 260, 15)">A</text>
          </g>

          {/* 8-Bit Pixel Sparkles */}
          <g className="sparkles">
            <g transform="translate(30, 60)">
              <rect x="-4" y="-12" width="8" height="24" fill="#f2c94c" />
              <rect x="-12" y="-4" width="24" height="8" fill="#f2c94c" />
              <rect x="-4" y="-4" width="8" height="8" fill="#ffffff" />
            </g>
            <g transform="translate(90, -35)">
              <rect x="-3" y="-9" width="6" height="18" fill="#ea7684" />
              <rect x="-9" y="-3" width="18" height="6" fill="#ea7684" />
              <rect x="-3" y="-3" width="6" height="6" fill="#ffffff" />
            </g>
            <g transform="translate(140, 45)">
              <rect x="-3" y="-8" width="6" height="16" fill="#f2c94c" />
              <rect x="-8" y="-3" width="16" height="6" fill="#f2c94c" />
            </g>
            <g transform="translate(180, -25)">
              <rect x="-2" y="-6" width="4" height="12" fill="#f2994a" />
              <rect x="-6" y="-2" width="12" height="4" fill="#f2994a" />
            </g>
            <g transform="translate(230, 35)">
              <rect x="-2" y="-5" width="4" height="10" fill="#f2c94c" />
              <rect x="-5" y="-2" width="10" height="4" fill="#f2c94c" />
            </g>
            <g transform="translate(265, -10)">
              <rect x="-2" y="-4" width="4" height="8" fill="#f2994a" />
              <rect x="-4" y="-2" width="8" height="4" fill="#f2994a" />
            </g>
            <g transform="translate(295, 15)">
              <rect x="-2" y="-5" width="4" height="10" fill="#f2c94c" />
              <rect x="-5" y="-2" width="10" height="4" fill="#f2c94c" />
            </g>
          </g>
        </g>

        {/* Lamp */}
        <g className="lamp" transform="translate(-160, 0)">
          {/* Light Beam */}
          <g opacity="0.6" style={{ mixBlendMode: 'normal' }} fill="url(#beam-fade)">
            <polygon points="387,331 477,224 1000,800 300,800" />
            <ellipse cx="650" cy="800" rx="350" ry="120" />
          </g>

          <path d="M 321,177 C 270,110 210,150 240,240 C 270,330 200,380 145,440" fill="none" stroke="#2c2a26" strokeWidth="3" filter="url(#rough)" />
          
          <rect x="75" y="730" width="150" height="20" rx="3" fill="none" stroke="#2c2a26" strokeWidth="8" filter="url(#rough)" />
          <rect x="85" y="736" width="130" height="8" rx="2" fill="none" stroke="#2c2a26" strokeWidth="2" opacity="0.5" filter="url(#rough)" />
          <rect x="141" y="431" width="18" height="308" rx="9" fill="#2c2a26" filter="url(#rough)" />
          <line x1="150" y1="440" x2="340" y2="200" stroke="#2c2a26" strokeWidth="14" strokeLinecap="round" filter="url(#rough)" />
          <circle cx="150" cy="440" r="14" fill="#2c2a26" filter="url(#rough)" />
          
          {/* Lamp shade */}
          <g transform="translate(340, 200) rotate(-50)" filter="url(#rough)">
            <path d="M 70,120 C 70,135 -70,135 -70,120 Z" fill="#fdfaf6" />
            <path d="M -30,0 C -30,-30 30,-30 30,0 L 70,120 C 70,130 -70,130 -70,120 Z" fill="#2c2a26" stroke="#2c2a26" strokeWidth="4" strokeLinejoin="round" />
            <circle cx="-15" cy="40" r="3" fill="#fdfaf6" />
            <circle cx="25" cy="80" r="2.5" fill="#fdfaf6" />
            <circle cx="10" cy="30" r="2" fill="#fdfaf6" />
            <circle cx="-35" cy="90" r="3" fill="#fdfaf6" />
            <circle cx="35" cy="50" r="2" fill="#fdfaf6" />
            <circle cx="-5" cy="100" r="1.5" fill="#fdfaf6" />
            <path d="M -25,65 L -15,55" stroke="#fdfaf6" strokeWidth="3" strokeLinecap="round" />
            <path d="M 5,85 L 15,95" stroke="#fdfaf6" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M -15,10 C -5,20 -10,30 -20,25" fill="none" stroke="#fdfaf6" strokeWidth="1.5" />
          </g>
        </g>

        <g transform="translate(100, 0)">
          {/* Pink Marker Fills */}
          <g fill="#ea7684">
          <motion.g animate={receiverAnimation} style={{ transformOrigin: "440px 390px" }}>
            <path d="M 230,420 C 230,370 290,350 330,350 L 350,450 C 270,460 240,460 230,420 Z" />
            <path d="M 640,420 C 640,370 580,350 540,350 L 520,450 C 600,460 630,460 640,420 Z" />
            <path d="M 320,380 C 400,330 480,330 560,380 L 540,430 C 480,390 400,390 340,430 Z" />
          </motion.g>
          <path d="M 360,450 C 350,550 260,650 250,680 L 620,680 C 610,650 520,550 510,450 Z" />
          <path d="M 240,680 L 630,680 L 620,730 L 250,730 Z" />
        </g>

        {/* Ink Lines (with rough filter) */}
        <g stroke="#2c2a26" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="url(#rough)">
          
          <motion.g animate={receiverAnimation} style={{ transformOrigin: "440px 390px" }}>
            {/* Left Earpiece */}
            <path d="M 240,450 C 220,360 330,340 350,360" />
            <path d="M 215,445 L 375,435" />
            <path d="M 225,460 L 365,450" />

            {/* Handle */}
            <path d="M 330,365 C 420,330 500,330 550,365" />
            <path d="M 335,420 C 420,380 500,380 535,420" />

            {/* Right Earpiece */}
            <path d="M 530,360 C 550,340 660,360 640,450" />
            <path d="M 505,435 L 665,445" />
            <path d="M 515,450 L 655,460" />
          </motion.g>

          {/* Cradle Posts */}
          <path d="M 390,405 L 380,450" />
          <path d="M 425,405 L 415,450" />
          <path d="M 375,450 L 425,450" />

          <path d="M 455,405 L 465,450" />
          <path d="M 490,405 L 500,450" />
          <path d="M 455,450 L 505,450" />

          {/* White block in middle of cradle */}
          <rect x="420" y="420" width="40" height="30" fill="#fdfaf6" />
          <path d="M 410,420 L 470,420 L 470,460 L 410,460 Z" />

          {/* Base Body */}
          <path d="M 360,450 C 340,550 250,650 240,680" />
          <path d="M 370,455 C 350,555 260,655 250,685" />

          <path d="M 510,450 C 530,550 620,650 630,680" />
          <path d="M 500,455 C 520,555 610,655 620,685" />

          <path d="M 225,680 L 645,680" />
          <path d="M 235,730 L 635,730" />
          <path d="M 240,675 L 240,735" />
          <path d="M 630,675 L 630,735" />

          {/* Corner sketch lines */}
          <path d="M 230,655 L 265,715" />
          <path d="M 640,655 L 605,715" />

          {/* Feet */}
          <path d="M 290,730 L 285,760 L 315,760 L 310,730" fill="#fdfaf6" />
          <path d="M 560,730 L 555,760 L 585,760 L 580,730" fill="#fdfaf6" />

        </g>

        {/* Animated Coiled Cord */}
        <AnimatedCord isWobbling={isWobbling} />

        <g transform="translate(440, 580) scale(0.65) translate(-440, -580)">
          {/* Base Plate & Numbers */}
          <g className="base-plate">
            {holesData.map((h, i) => {
              const a = -35 - (i * 26);
              const rad = a * Math.PI / 180;
              const tx = 440 + 88 * Math.cos(rad);
              const ty = 580 + 88 * Math.sin(rad);
              const lx = 440 + 107 * Math.cos(rad);
              const ly = 580 + 107 * Math.sin(rad);

              return (
                <g key={`base-${h.id}`}>
                  <circle cx={440 + 60 * Math.cos(rad)} cy={580 + 60 * Math.sin(rad)} r="4" fill="#2c2a26" />
                  <text x={tx} y={ty} textAnchor="middle" alignmentBaseline="middle" fontFamily="'Press Start 2P', monospace" fontSize="13" fontWeight="bold" fill="#2c2a26">
                    {h.num}
                  </text>
                  {h.label && (
                    <text x={lx} y={ly} textAnchor="middle" alignmentBaseline="middle" fontFamily="'Press Start 2P', monospace" fontSize="8" fontWeight="bold" fill="#2c2a26">
                      {h.label}
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* Rotating Wheel */}
          <motion.g 
            className="rotating-wheel"
            style={{ rotate: rotation, transformOrigin: "440px 580px" }}
          >
            <circle cx="440" cy="580" r="120" fill="transparent" stroke="#2c2a26" strokeWidth="3" filter="url(#rough)" />
            
            {holesData.map((h, i) => {
              const a = -35 - (i * 26);
              const rad = a * Math.PI / 180;
              const cx = 440 + 60 * Math.cos(rad);
              const cy = 580 + 60 * Math.sin(rad);

              return (
                <g 
                  key={`hole-${h.id}`}
                  className="hole cursor-pointer"
                  onPointerDown={(e) => handlePointerDown(e, i, h.action)}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  onKeyDown={(e) => handleKeyDown(e, i, h.action)}
                  tabIndex={isDragging ? -1 : 0}
                  style={{ cursor: isDragging ? 'grabbing' : 'grab', outline: 'none', transformOrigin: `${cx}px ${cy}px`, touchAction: 'none' }}
                >
                  <title>{h.num === '0' ? 'Dial 0 (Hang Up)' : `Dial ${h.num}`}</title>
                  <circle cx={cx} cy={cy} r="13" fill="#ffffff" stroke="#2c2a26" strokeWidth="5" filter="url(#rough-light)" />
                  <circle cx={cx} cy={cy} r="12.5" fill="transparent" stroke="url(#metallic)" strokeWidth="3" filter="url(#rough-light)" className="transition-all duration-150" />
                  <circle cx={cx} cy={cy} r="11" fill="transparent" stroke="#2c2a26" strokeWidth="1" filter="url(#rough-light)" />
                </g>
              );
            })}

            {/* Center Cap */}
            <circle cx="440" cy="580" r="32" fill="#fdfaf6" stroke="#2c2a26" strokeWidth="3.5" filter="url(#rough)" />
          </motion.g>

          {/* Finger Stop */}
          <g className="finger-stop" filter="url(#rough)">
            <path d="M 532 660 L 482 615 Q 490 645 505 665 Z" fill="#fdfaf6" stroke="#2c2a26" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
        </g>

        {/* Global Pixel Grid Mesh across entire scene */}
        <rect x="-500" y="-100" width="1800" height="1200" fill="url(#pixel-mesh)" pointerEvents="none" opacity="0.4" />
      </svg>
    </div>
  );
});
