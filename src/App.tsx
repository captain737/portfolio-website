import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LandingScene, LandingSceneRef } from './components/LandingScene';
import { Popups } from './components/Popups';
import { ClickSparkle } from './components/ClickSparkle';
import { PopupState } from './types';

const playTypewriterClick = () => {
  if (typeof window === 'undefined') return;
  try {
    if (!(window as any).typewriterCtx) {
      (window as any).typewriterCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = (window as any).typewriterCtx as AudioContext;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    // Noise burst for mechanical clack
    const bufferSize = ctx.sampleRate * 0.04;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 1200 + Math.random() * 500; 
    bandpass.Q.value = 1;
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.02, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0025, ctx.currentTime + 0.03);
    
    noise.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(ctx.destination);
    
    noise.start(ctx.currentTime);

    // Minor low pitched click for body of the key press
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200 + Math.random() * 50, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.03);
    
    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.01, ctx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.0025, ctx.currentTime + 0.03);
    
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.04);
  } catch (e) {
    // ignore
  }
};

export default function App() {
  const landingSceneRef = useRef<LandingSceneRef>(null);
  const [activePopup, setActivePopup] = useState<PopupState>('NONE');
  const [isHungUp, setIsHungUp] = useState(false);
  const [showText, setShowText] = useState(false);
  
  const [typeIndex, setTypeIndex] = useState(0);
  
  const part1 = "Hi, you've reached Pragya. I'm away right now, but feel free to stick around. ";
  const part2 = "Ring 1";
  const part3 = " to learn more about me, ";
  const part4 = "ring 2";
  const part5 = " to look at my personal projects and ";
  const part6 = "ring 3";
  const part7 = " to leave me a message";
  
  const fullTextLength = part1.length + part2.length + part3.length + part4.length + part5.length + part6.length + part7.length;

  const handleTextStart = () => {
    setShowText(true);
  };

  const handleDial = (num: string) => {
    if (num === '0') {
      handleHangUp();
      return;
    }
    
    // Display popup when message is active
    if (showText) {
      if (num === '1') setActivePopup('WHO');
      if (num === '2') setActivePopup('PROJECTS');
      if (num === '3') setActivePopup('CONTACT');
    }
  };

  const handleHangUp = () => {
    setIsHungUp(true);
    setShowText(false);
    setActivePopup('NONE');
  };

  const resetExperience = () => {
    setIsHungUp(false);
    setShowText(false);
    setActivePopup('NONE');
    // Start text again? Or just wait?
    // Let's just show text immediately after picking up again so they don't have to wait.
    setTimeout(() => {
      setShowText(true);
      setTypeIndex(fullTextLength); // Instant text
    }, 500);
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showText && typeIndex < fullTextLength) {
      timeout = setTimeout(() => {
        playTypewriterClick();
        setTypeIndex(prev => prev + 1);
      }, 40);
    }
    return () => clearTimeout(timeout);
  }, [showText, typeIndex, fullTextLength]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (activePopup !== 'NONE') {
        if (e.key === 'Escape') setActivePopup('NONE');
        return;
      }
      const map: Record<string, string> = {
        "1": "1",
        "2": "2",
        "3": "3",
        "5": "5",
        "0": "0"
      };
      if (map[e.key]) {
        landingSceneRef.current?.simulateDial(map[e.key]);
      }
    };
    
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [showText, typeIndex, activePopup]);

  const renderText = () => {
    let remaining = typeIndex;
    const getChunk = (text: string) => {
      const chunk = text.substring(0, remaining);
      remaining = Math.max(0, remaining - text.length);
      return chunk;
    };

    const p1 = getChunk(part1);
    const p2 = getChunk(part2);
    const p3 = getChunk(part3);
    const p4 = getChunk(part4);
    const p5 = getChunk(part5);
    const p6 = getChunk(part6);
    const p7 = getChunk(part7);

    return (
      <>
        {p1}
        {p2 && (
          <span 
            className="text-red-500 underline underline-offset-4 cursor-pointer hover:text-red-700 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              if (activePopup !== 'WHO') {
                landingSceneRef.current?.simulateDial('1');
              }
            }}
          >
            {p2}
          </span>
        )}
        {p3}
        {p4 && (
          <span 
            className="text-red-500 underline underline-offset-4 cursor-pointer hover:text-red-700 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              if (activePopup !== 'PROJECTS') {
                landingSceneRef.current?.simulateDial('2');
              }
            }}
          >
            {p4}
          </span>
        )}
        {p5}
        {p6 && (
          <span 
            className="text-red-500 underline underline-offset-4 cursor-pointer hover:text-red-700 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              if (activePopup !== 'CONTACT') {
                landingSceneRef.current?.simulateDial('3');
              }
            }}
          >
            {p6}
          </span>
        )}
        {p7}
      </>
    );
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-2 sm:p-4 relative overflow-hidden">
      
      {/* Retro 8-Bit HUD Header */}
      <div className="fixed top-2.5 left-2.5 sm:top-4 sm:left-4 z-30 pointer-events-none select-none">
        <a 
          href="https://pragyasilwal.com"
          target="_blank"
          rel="noopener noreferrer"
          className="pixel-btn pointer-events-auto px-2 py-1 sm:px-3 sm:py-1.5 flex items-center gap-2 bg-[#fdfaf6] hover:bg-ink hover:text-paper transition-colors text-ink cursor-pointer no-underline group"
          title="Visit pragyasilwal.com"
        >
          <span className="w-2 h-2 bg-emerald-500 inline-block animate-pulse flex-shrink-0" />
          <span className="font-pixel text-[9px] sm:text-[11px] font-bold tracking-wider text-current">pragyasilwal.com</span>
        </a>
      </div>

      {/* Background overlay for hangup state */}
      <AnimatePresence>
        {isHungUp && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink/90 z-40 flex flex-col items-center justify-center text-paper font-pixel text-lg sm:text-2xl gap-6 sm:gap-8 p-4 text-center"
          >
            <div className="pixel-box bg-[#fdfaf6] text-ink p-6 sm:p-8 max-w-md w-[92vw]">
              <p className="font-pixel text-xs sm:text-sm text-red-500 mb-4 tracking-wider">— CLICK —</p>
              <p className="font-pixel text-sm sm:text-base mb-2">Thanks for calling.</p>
              <p className="font-pixel text-xs sm:text-sm text-ink/70">Talk soon. ♡</p>
              <button 
                onClick={resetExperience}
                className="mt-6 px-4 py-2.5 pixel-btn bg-yellow-200 text-ink text-xs sm:text-sm font-pixel hover:bg-yellow-300 transition-colors cursor-pointer w-full"
              >
                ▶ PICK UP AGAIN
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-[1100px] flex items-center justify-center relative z-10">
        <LandingScene ref={landingSceneRef} onDial={handleDial} onTextStart={handleTextStart} />
      </div>

      {/* 8-Bit RPG Dialogue Box */}
      {showText && (
        <div className="fixed bottom-3 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 z-20 pointer-events-none">
          <div className="pixel-box pointer-events-auto p-3 sm:p-4 max-w-none sm:max-w-[440px] md:max-w-[480px]">
            <div className="flex items-center justify-between mb-1.5 pb-1 border-b-2 border-ink">
              <span className="font-pixel text-[9px] sm:text-[10px] text-ink uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 bg-red-500 inline-block animate-pulse" />
                PHONE MESSAGE
              </span>
              <span className="font-pixel text-[8px] text-ink/60">PRESS 1 / 2 / 3</span>
            </div>
            <p 
              onClick={() => {
                if (typeIndex < fullTextLength) setTypeIndex(fullTextLength);
              }}
              className="font-pixel-body text-sm sm:text-base md:text-lg leading-snug sm:leading-normal font-medium text-ink cursor-pointer"
              title={typeIndex < fullTextLength ? "Click to reveal full text" : undefined}
            >
              {renderText()}
              {typeIndex === fullTextLength && (
                <span className="inline-block ml-1 animate-bounce text-pink-600 font-pixel text-xs">▼</span>
              )}
            </p>
          </div>
        </div>
      )}

      <Popups 
        activePopup={activePopup} 
        onClose={() => setActivePopup('NONE')} 
        onNavigate={setActivePopup}
      />

      <ClickSparkle />
      
    </div>
  );
}
