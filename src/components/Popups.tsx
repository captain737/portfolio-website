import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, type ReactNode } from "react";
import { PopupState } from "../types";
import { X, ArrowRight, ArrowLeft, ExternalLink, Mail, Linkedin, Github, MapPin, Heart } from "lucide-react";

interface PopupsProps {
  activePopup: PopupState;
  onClose: () => void;
  onNavigate: (state: PopupState) => void;
}

const playBioTypewriterClick = () => {
  if (typeof window === 'undefined') return;
  try {
    if (!(window as any).typewriterCtx) {
      (window as any).typewriterCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = (window as any).typewriterCtx as AudioContext;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const bufferSize = ctx.sampleRate * 0.03;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 1350 + Math.random() * 400;
    bandpass.Q.value = 1.2;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.015, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.002, ctx.currentTime + 0.025);

    noise.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(ctx.destination);
    noise.start(ctx.currentTime);
  } catch (e) {
    // audio failure ignored
  }
};

interface ClosingPiece {
  text: string;
  isLink?: boolean;
  href?: string;
}

const CLOSING_PIECES: ClosingPiece[] = [
  { text: "I love good stories, thoughtful design, and connecting with people who see the world differently. I occasionally " },
  { text: "write on Substack", isLink: true, href: "https://substack.com/@paraguay" },
  { text: " and " },
  { text: "make short videos", isLink: true, href: "https://www.tiktok.com/@captaincool737" },
  { text: " about navigating personal finance as a young adult." }
];

const TOTAL_CLOSING_CHARS = CLOSING_PIECES.reduce((sum, p) => sum + p.text.length, 0);

function ClosingTypewriter() {
  const [typeProgress, setTypeProgress] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (typeProgress < TOTAL_CLOSING_CHARS) {
      timer = setTimeout(() => {
        playBioTypewriterClick();
        setTypeProgress((prev) => Math.min(TOTAL_CLOSING_CHARS, prev + 1));
      }, 22);
    }
    return () => clearTimeout(timer);
  }, [typeProgress]);

  const isTyping = typeProgress < TOTAL_CLOSING_CHARS;

  let charsLeft = typeProgress;
  const renderedPieces = CLOSING_PIECES.map((piece, idx) => {
    if (charsLeft <= 0) return null;
    const sliceLen = Math.min(charsLeft, piece.text.length);
    charsLeft -= sliceLen;
    const currentText = piece.text.substring(0, sliceLen);

    if (piece.isLink) {
      return (
        <a
          key={idx}
          href={piece.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="underline font-bold text-black hover:text-red-600 transition-colors inline-flex items-center gap-0.5"
        >
          {currentText}
          {sliceLen === piece.text.length && (
            <ExternalLink className="w-3.5 h-3.5 text-current inline" />
          )}
        </a>
      );
    }

    return <span key={idx}>{currentText}</span>;
  });

  return (
    <div
      onClick={() => {
        if (isTyping) setTypeProgress(TOTAL_CLOSING_CHARS);
      }}
      className={`relative ${isTyping ? 'cursor-pointer' : ''} text-center`}
      title={isTyping ? 'Click to reveal text' : undefined}
    >
      {/* Invisible placeholder to reserve exact layout dimensions so container height is static */}
      <p className="text-sm sm:text-base md:text-lg font-story leading-relaxed opacity-0 pointer-events-none select-none text-center" aria-hidden="true">
        I love good stories, thoughtful design, and connecting with people who see the world differently. I occasionally{' '}
        <span className="underline font-bold inline-flex items-center gap-0.5">
          write on Substack <ExternalLink className="w-3.5 h-3.5 inline" />
        </span>{' '}
        and{' '}
        <span className="underline font-bold inline-flex items-center gap-0.5">
          make short videos <ExternalLink className="w-3.5 h-3.5 inline" />
        </span>{' '}
        about navigating personal finance as a young adult.
      </p>

      {/* Visible typewriter paragraph */}
      <p className="absolute inset-0 text-sm sm:text-base md:text-lg font-story text-black leading-relaxed text-center">
        {renderedPieces}
      </p>
    </div>
  );
}

export function Popups({ activePopup, onClose, onNavigate }: PopupsProps) {
  
  const Window = ({ 
    children, 
    title, 
    className = "",
    onBack,
    maxWidthClass = "max-w-4xl"
  }: { 
    children: ReactNode, 
    title?: string, 
    className?: string,
    onBack?: () => void,
    maxWidthClass?: string,
    key?: string
  }) => (
    <div className="fixed inset-0 z-[9500] flex items-center justify-center p-2.5 sm:p-4 md:p-6 pointer-events-none">
      {/* Backdrop overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.16 }}
        className="fixed inset-0 bg-ink/50 backdrop-blur-[2px] pointer-events-auto"
        onClick={onClose}
      />

      {/* Centered Modal Window with smooth, non-bouncing transition */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          y: 0,
          transition: {
            duration: 0.22,
            ease: [0.16, 1, 0.3, 1]
          }
        }}
        exit={{ 
          opacity: 0, 
          scale: 0.95, 
          y: 6,
          transition: { duration: 0.15, ease: "easeIn" } 
        }}
        className={`relative pointer-events-auto w-full ${maxWidthClass} max-h-[min(73vh,630px)] flex flex-col pixel-box p-3 sm:p-4 md:p-5 bg-[#fdfaf6] z-10 overflow-hidden ${className}`}
      >
        <div className="flex justify-between items-center mb-2.5 sm:mb-3 pb-2 sm:pb-2.5 border-b-2 border-ink flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {onBack && (
              <button 
                type="button"
                onClick={onBack}
                className="pixel-btn flex items-center gap-1 font-pixel text-[9px] sm:text-[11px] font-bold px-2 py-1 bg-yellow-200 hover:bg-yellow-300 text-ink cursor-pointer focus:outline-none flex-shrink-0"
                aria-label="Back to projects"
              >
                <span>◄ BACK</span>
              </button>
            )}
            {title && (
              <h2 className="font-pixel text-[11px] sm:text-sm md:text-base font-bold tracking-wide m-0 leading-tight truncate text-ink uppercase">{title}</h2>
            )}
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="pixel-btn w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center bg-white hover:bg-red-500 hover:text-white transition-colors text-ink cursor-pointer flex-shrink-0 font-pixel text-[11px] ml-auto"
            aria-label="Close popup"
          >
            ✕
          </button>
        </div>
        <div className="font-pixel-body text-sm sm:text-base md:text-lg leading-relaxed overflow-y-auto flex-1 custom-scrollbar pr-1 flex flex-col">
          {children}
        </div>
      </motion.div>
    </div>
  );

  return (
    <AnimatePresence>
      {activePopup === 'WHO' && (
        <Window 
          key="popup-who" 
          maxWidthClass="max-w-3xl w-full sm:w-[80vw] lg:w-[75vw]"
          className="h-auto min-h-[min(72vh,460px)]"
        >
          <div className="space-y-3.5 sm:space-y-4 text-black text-center max-w-2xl mx-auto my-auto py-2.5 px-2 sm:px-5">
            {/* Red bold greeting line - centered */}
            <p className="font-bold text-base sm:text-lg md:text-xl text-red-600 font-story text-center">
              Hey, I'm Pragya! I'm an Economics and Data Science student at Bryn Mawr College.
            </p>

            <p className="text-sm sm:text-base md:text-lg font-story text-black leading-relaxed text-center">
              My background sits at the intersection of technology, product, and people. I've built AI-powered tools, launched consumer apps, worked on economic research, and helped turn early-stage ideas into real products. I'm drawn to ideas that make everyday life a little easier, more interesting, or simply more fun.
            </p>

            <p className="text-sm sm:text-base md:text-lg font-story text-black leading-relaxed text-center">
              After high school, I took a gap year and worked with a nonprofit teaching storytelling in the remote hills of Nepal. Since then, I've trekked through mountains, ridden motorcycles across countries, and learned just as much from unexpected conversations as I have from classrooms.
            </p>

            {/* Closing paragraph with typewriter effect and interactive links - centered */}
            <ClosingTypewriter />
          </div>
        </Window>
      )}

      {activePopup === 'PROJECTS' && (
        <Window key="popup-projects" title="Personal Projects" maxWidthClass="max-w-3xl w-full sm:w-[80vw] lg:w-[75vw]">
          <div className="flex flex-col gap-3 sm:gap-3.5">
            {/* CardFit */}
            <div className="p-2.5 sm:p-3 pixel-box bg-[#fbf9f2] flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 hover:bg-white transition-colors group">
              {/* Thumbnail */}
              <div 
                onClick={() => onNavigate('PROJECT_CARDFIT')}
                className="w-full sm:w-44 md:w-52 h-24 sm:h-24 bg-[#d9d1ef] border-2 border-ink flex items-center justify-center flex-shrink-0 group-hover:scale-[1.02] transition-transform overflow-hidden p-1.5 cursor-pointer"
                title="View CardFit story"
              >
                <img 
                  src="/cardfit_preview.jpg" 
                  alt="CardFit - Credit Card Discovery" 
                  className="w-full h-full object-cover shadow-xs"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Info / Description */}
              <div 
                onClick={() => onNavigate('PROJECT_CARDFIT')}
                className="flex-1 min-w-0 cursor-pointer flex flex-col justify-center"
              >
                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                  <a 
                    href="https://cardfit.me" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="font-pixel text-xs sm:text-sm font-bold hover:underline flex items-center gap-1 text-ink"
                  >
                    CardFit <ExternalLink className="w-3 h-3 text-ink/70" />
                  </a>
                </div>
                <p className="text-xs sm:text-sm font-story leading-snug sm:leading-relaxed text-ink/85 line-clamp-2">
                  Credit card discovery platform that uses live card data and a personalized ranking engine to help users find the right card.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center sm:w-28 flex-shrink-0 border-t-2 sm:border-t-0 sm:border-l-2 border-ink/20 pt-2 sm:pt-0 sm:pl-3">
                <button 
                  onClick={() => onNavigate('PROJECT_CARDFIT')}
                  className="w-full py-1.5 px-2 pixel-btn text-[9px] font-pixel font-bold text-ink bg-yellow-100 hover:bg-yellow-200 transition-colors text-center cursor-pointer"
                >
                  STORY →
                </button>
              </div>
            </div>

            {/* Noor Azaan */}
            <div className="p-2.5 sm:p-3 pixel-box bg-[#fbf9f2] flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 hover:bg-white transition-colors group">
              {/* Thumbnail */}
              <div 
                onClick={() => onNavigate('PROJECT_NOOR')}
                className="w-full sm:w-44 md:w-52 h-24 sm:h-24 bg-[#cbddd5] border-2 border-ink flex items-center justify-center flex-shrink-0 group-hover:scale-[1.02] transition-transform overflow-hidden p-1.5 cursor-pointer"
                title="View Noor Azaan story"
              >
                <img 
                  src="/noor_azaan_icon.jpg" 
                  alt="Noor Azaan - Islamic Prayer App" 
                  className="h-full object-contain shadow-xs"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Info / Description */}
              <div 
                onClick={() => onNavigate('PROJECT_NOOR')}
                className="flex-1 min-w-0 cursor-pointer flex flex-col justify-center"
              >
                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                  <a 
                    href="https://apps.apple.com/us/app/noor-azaan/id6759352271" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="font-pixel text-xs sm:text-sm font-bold hover:underline flex items-center gap-1 text-ink"
                  >
                    Noor Azaan <ExternalLink className="w-3 h-3 text-ink/70" />
                  </a>
                </div>
                <p className="text-xs sm:text-sm font-story leading-snug sm:leading-relaxed text-ink/85 line-clamp-2">
                  A modern lifestyle & prayer app for Gen Z Muslims designed for everyday routines. Currently live on the App Store!
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center sm:w-28 flex-shrink-0 border-t-2 sm:border-t-0 sm:border-l-2 border-ink/20 pt-2 sm:pt-0 sm:pl-3">
                <button 
                  onClick={() => onNavigate('PROJECT_NOOR')}
                  className="w-full py-1.5 px-2 pixel-btn text-[9px] font-pixel font-bold text-ink bg-yellow-100 hover:bg-yellow-200 transition-colors text-center cursor-pointer"
                >
                  STORY →
                </button>
              </div>
            </div>

            {/* RateMySemesterAbroad */}
            <div className="p-2.5 sm:p-3 pixel-box bg-[#fbf9f2] flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 hover:bg-white transition-colors group">
              {/* Thumbnail */}
              <div 
                onClick={() => onNavigate('PROJECT_RMSA')}
                className="w-full sm:w-44 md:w-52 h-24 sm:h-24 bg-[#e3dec9] border-2 border-ink flex items-center justify-center flex-shrink-0 group-hover:scale-[1.02] transition-transform overflow-hidden p-1.5 cursor-pointer"
                title="View RateMySemesterAbroad story"
              >
                <img 
                  src="/ratemy_preview.jpg" 
                  alt="RateMySemesterAbroad - Looking Beyond the Brochure" 
                  className="w-full h-full object-cover shadow-xs"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Info / Description */}
              <div 
                onClick={() => onNavigate('PROJECT_RMSA')}
                className="flex-1 min-w-0 cursor-pointer flex flex-col justify-center"
              >
                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                  <a 
                    href="https://www.haverford.edu/marketing-and-communications/news/looking-beyond-brochure" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="font-pixel text-[11px] sm:text-xs font-bold hover:underline flex items-center gap-1 text-ink"
                  >
                    RateMySemesterAbroad <ExternalLink className="w-3 h-3 text-ink/70" />
                  </a>
                </div>
                <p className="text-xs sm:text-sm font-story leading-snug sm:leading-relaxed text-ink/85 line-clamp-2">
                  Built a platform that helps students compare study abroad programs through verified reviews and first-hand experiences.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center sm:w-28 flex-shrink-0 border-t-2 sm:border-t-0 sm:border-l-2 border-ink/20 pt-2 sm:pt-0 sm:pl-3">
                <button 
                  onClick={() => onNavigate('PROJECT_RMSA')}
                  className="w-full py-1.5 px-2 pixel-btn text-[9px] font-pixel font-bold text-ink bg-yellow-100 hover:bg-yellow-200 transition-colors text-center cursor-pointer"
                >
                  STORY →
                </button>
              </div>
            </div>
          </div>
        </Window>
      )}

      {activePopup === 'PROJECT_CARDFIT' && (
        <Window key="popup-cardfit" maxWidthClass="max-w-4xl sm:w-[90vw] lg:w-[82vw] max-w-[920px]">
          <div className="mb-4 sm:mb-5 pb-3 border-b-2 border-ink/20">
            <div className="flex items-center gap-3 sm:gap-4 mb-3">
              <a 
                href="https://cardfit.me" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 sm:w-16 sm:h-16 pixel-box bg-[#d9d1ef] border-2 border-ink flex items-center justify-center flex-shrink-0 overflow-hidden p-0.5 shadow-xs hover:scale-105 transition-transform"
                title="Open cardfit.me"
              >
                <img 
                  src="/cardfit_preview.jpg" 
                  alt="CardFit" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </a>
              <h3 className="text-base sm:text-lg md:text-xl font-bold leading-tight text-ink font-pixel">
                CardFit
              </h3>
            </div>

            {/* Listed vertically below the logo, before the story */}
            <div className="text-xs sm:text-sm font-story space-y-1 text-ink/85">
              <p><strong>Website:</strong> <a href="https://cardfit.me" target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-ink">cardfit.me</a></p>
              <p><strong>Timeline:</strong> Live</p>
            </div>
          </div>
          
          <div className="text-xs sm:text-sm md:text-base font-story space-y-3 sm:space-y-4 mb-6 leading-relaxed text-ink/90">
            <p>Choosing a credit card is still surprisingly difficult. Most comparison sites rely on long lists, generic filters, and rankings that don't reflect individual needs.</p>
            <p>I built <a href="https://cardfit.me" target="_blank" rel="noopener noreferrer" className="underline font-bold text-ink hover:opacity-80">CardFit (cardfit.me)</a> to make the process more intuitive by combining a searchable credit card directory with a ranking engine that adapts to different spending habits and preferences.</p>
            <p>I led the product end-to-end, defining the MVP, designing the user experience, building a web scraping pipeline to keep card data up to date, and developing the logic behind personalized card recommendations.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-4 border-t-2 border-ink/20">
            <button 
              type="button"
              onClick={() => onNavigate('PROJECTS')}
              className="w-full sm:w-auto px-4 py-2 text-[9px] sm:text-[11px] pixel-btn bg-[#fbf9f2] text-ink hover:bg-ink/10 transition-colors uppercase font-bold tracking-wider font-pixel flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>◄ BACK TO PROJECTS</span>
            </button>
            <button 
              type="button"
              onClick={() => onNavigate('PROJECT_NOOR')}
              className="w-full sm:w-auto px-5 py-2 text-[9px] sm:text-[11px] pixel-btn bg-yellow-200 text-ink hover:bg-yellow-300 transition-colors uppercase font-bold tracking-wider font-pixel flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>NEXT PROJECT →</span>
            </button>
          </div>
        </Window>
      )}

      {activePopup === 'PROJECT_NOOR' && (
        <Window key="popup-noor" maxWidthClass="max-w-4xl sm:w-[90vw] lg:w-[82vw] max-w-[920px]">
          <div className="mb-4 sm:mb-5 pb-3 border-b-2 border-ink/20">
            <div className="flex items-center gap-3 sm:gap-4 mb-3">
              <a 
                href="https://apps.apple.com/us/app/noor-azaan/id6759352271" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 sm:w-16 sm:h-16 pixel-box bg-[#cbddd5] border-2 border-ink flex items-center justify-center flex-shrink-0 overflow-hidden p-1 shadow-xs hover:scale-105 transition-transform"
                title="View Noor Azaan on the App Store"
              >
                <img 
                  src="/noor_azaan_icon.jpg" 
                  alt="Noor Azaan Icon" 
                  className="w-full h-full object-contain" 
                  referrerPolicy="no-referrer"
                />
              </a>
              <h3 className="text-base sm:text-lg md:text-xl font-bold leading-tight text-ink font-pixel">
                Noor Azaan
              </h3>
            </div>

            {/* Listed vertically below the logo, before the story */}
            <div className="text-xs sm:text-sm font-story space-y-1 text-ink/85">
              <p><strong>Platform:</strong> <a href="https://apps.apple.com/us/app/noor-azaan/id6759352271" target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-ink">iOS App Store</a></p>
              <p><strong>Timeline:</strong> Live</p>
            </div>
          </div>
          
          <div className="text-xs sm:text-sm md:text-base font-story space-y-3 sm:space-y-4 mb-6 leading-relaxed text-ink/90">
            <p>After seeing friends interact with multiple Islamic apps, I noticed the same complaints kept coming up: the apps felt dated, cluttered, and weren't designed with younger users in mind.</p>
            <p>Most solved the functional problem of prayer times and Quran access, but not the experience of using them every day, especially for 20-something year old women. I experimented with building a modern, design-first app that fit naturally into people's daily routines.</p>
            <p>I led the product from concept to App Store launch - conducting user interviews, defining the MVP, designing the UI/UX, prioritizing features based on feedback, and integrating live APIs for prayer times, Quran, audio recitations, and Qibla.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-4 border-t-2 border-ink/20">
            <button 
              type="button"
              onClick={() => onNavigate('PROJECTS')}
              className="w-full sm:w-auto px-4 py-2 text-[9px] sm:text-[11px] pixel-btn bg-[#fbf9f2] text-ink hover:bg-ink/10 transition-colors uppercase font-bold tracking-wider font-pixel flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>◄ BACK TO PROJECTS</span>
            </button>
            <button 
              type="button"
              onClick={() => onNavigate('PROJECT_RMSA')}
              className="w-full sm:w-auto px-5 py-2 text-[9px] sm:text-[11px] pixel-btn bg-emerald-200 text-ink hover:bg-emerald-300 transition-colors uppercase font-bold tracking-wider font-pixel flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>NEXT PROJECT →</span>
            </button>
          </div>
        </Window>
      )}

      {activePopup === 'PROJECT_RMSA' && (
        <Window key="popup-rmsa" maxWidthClass="max-w-4xl sm:w-[90vw] lg:w-[82vw] max-w-[920px]">
          <div className="mb-4 sm:mb-5 pb-3 border-b-2 border-ink/20">
            <div className="flex items-center gap-3 sm:gap-4 mb-3">
              <a 
                href="https://www.haverford.edu/marketing-and-communications/news/looking-beyond-brochure" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 sm:w-16 sm:h-16 pixel-box bg-[#e3dec9] border-2 border-ink flex items-center justify-center flex-shrink-0 overflow-hidden p-0.5 shadow-xs hover:scale-105 transition-transform"
                title="Read Haverford Feature Article"
              >
                <img 
                  src="/ratemy_preview.jpg" 
                  alt="RateMySemesterAbroad Feature" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </a>
              <h3 className="text-base sm:text-lg md:text-xl font-bold leading-tight text-ink font-pixel">
                RateMySemesterAbroad
              </h3>
            </div>

            {/* Listed vertically below the logo, before the story */}
            <div className="text-xs sm:text-sm font-story space-y-1 text-ink/85">
              <p><strong>Publication:</strong> <a href="https://www.haverford.edu/marketing-and-communications/news/looking-beyond-brochure" target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-ink">Haverford College News</a></p>
              <p><strong>Timeline:</strong> 2025</p>
            </div>
          </div>
          
          <div className="text-xs sm:text-sm md:text-base font-story space-y-3 sm:space-y-4 mb-6 leading-relaxed text-ink/90">
            <p>While planning to study abroad, I found that most university resources focused on logistics rather than the student experience. Information about academics, housing, cost of living, and campus culture was scattered across forums and social media, making it difficult to compare programs.</p>
            <p>I designed Rate My Semester Abroad as a centralized review platform where students can make informed decisions through authentic, structured insights from past participants.</p>
            <p>The project received $10,000 in venture funding and placed 2nd at the TriCo ProtoThon hosted by Girls Who Code which led to my selection as a Haverford Entrepreneurship Fellow.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-4 border-t-2 border-ink/20">
            <button 
              type="button"
              onClick={() => onNavigate('PROJECTS')}
              className="w-full sm:w-auto px-4 py-2 text-[9px] sm:text-[11px] pixel-btn bg-[#fbf9f2] text-ink hover:bg-ink/10 transition-colors uppercase font-bold tracking-wider font-pixel flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>◄ BACK TO PROJECTS</span>
            </button>
            <button 
              type="button"
              onClick={() => onNavigate('PROJECT_CARDFIT')}
              className="w-full sm:w-auto px-5 py-2 text-[9px] sm:text-[11px] pixel-btn bg-sky-200 text-ink hover:bg-sky-300 transition-colors uppercase font-bold tracking-wider font-pixel flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>NEXT PROJECT →</span>
            </button>
          </div>
        </Window>
      )}

      {activePopup === 'EXPERIENCE' && (
        <Window key="popup-experience" title="B — WHERE HAVE YOU WORKED?" maxWidthClass="max-w-2xl">
          <div className="divide-y-2 divide-ink/20">
            {[
              {
                role: 'AI Product Intern',
                company: 'Bryn Mawr Digital Technology Services',
                date: 'May 2026 – Jul 2026',
                badge: 'AI & Tech'
              },
              {
                role: 'Research Assistant',
                company: 'Econsult Solutions',
                date: 'Jan 2025 – May 2025',
                badge: 'Research'
              },
              {
                role: 'Strategy Intern',
                company: 'Paradigm Forum GmbH',
                date: 'Jun 2024 – Aug 2024',
                badge: 'Strategy'
              },
              {
                role: 'Program & Evaluation Lead',
                company: 'AfterSchool Programs',
                date: 'Jun 2025 – Present',
                badge: 'Leadership'
              },
              {
                role: 'President',
                company: 'South Asian Students',
                date: '2024 – 2025',
                badge: 'Community'
              }
            ].map((exp, i) => (
              <div 
                key={i} 
                className="py-3 px-2 hover:bg-yellow-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-pixel text-[9px] text-red-500 font-bold">0{i + 1}</span>
                    <strong className="text-xs sm:text-sm font-bold font-pixel text-ink truncate">{exp.company}</strong>
                    <span className="text-[8px] uppercase font-pixel px-1.5 py-0.5 border-2 border-ink bg-white font-bold text-ink">
                      {exp.badge}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-pixel-body text-ink/80 mt-1 pl-4 sm:pl-5 font-medium">{exp.role}</p>
                </div>
                <time className="text-[9px] sm:text-[10px] font-pixel text-ink/60 whitespace-nowrap pl-4 sm:pl-0 self-start sm:self-center font-normal">
                  {exp.date}
                </time>
              </div>
            ))}
          </div>
        </Window>
      )}

      {activePopup === 'CONTACT' && (
        <Window key="popup-contact" maxWidthClass="max-w-sm sm:max-w-md w-full">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 py-1">
            
            {/* Big Email Logo Box */}
            <a 
              href="mailto:pragyasilwal@gmail.com"
              className="pixel-box bg-yellow-200 hover:bg-yellow-300 border-2 border-ink aspect-square flex items-center justify-center text-amber-950 hover:scale-[1.04] active:scale-95 transition-all cursor-pointer shadow-sm group no-underline"
              aria-label="Email: pragyasilwal@gmail.com"
              title="Email: pragyasilwal@gmail.com"
            >
              <svg className="w-12 h-12 sm:w-14 sm:h-14 stroke-ink transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </a>

            {/* Big LinkedIn Logo Box */}
            <a 
              href="https://linkedin.com/in/psilwal"
              target="_blank"
              rel="noopener noreferrer"
              className="pixel-box bg-sky-200 hover:bg-sky-300 border-2 border-ink aspect-square flex items-center justify-center text-[#0a66c2] hover:scale-[1.04] active:scale-95 transition-all cursor-pointer shadow-sm group no-underline"
              aria-label="LinkedIn: linkedin.com/in/psilwal"
              title="LinkedIn: linkedin.com/in/psilwal"
            >
              <svg className="w-12 h-12 sm:w-14 sm:h-14 fill-current transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
            </a>

            {/* Big Website Logo Box */}
            <a 
              href="https://pragyasilwal.com"
              target="_blank"
              rel="noopener noreferrer"
              className="pixel-box bg-emerald-200 hover:bg-emerald-300 border-2 border-ink aspect-square flex items-center justify-center text-emerald-950 hover:scale-[1.04] active:scale-95 transition-all cursor-pointer shadow-sm group no-underline"
              aria-label="Website: pragyasilwal.com"
              title="Website: pragyasilwal.com"
            >
              <svg className="w-12 h-12 sm:w-14 sm:h-14 stroke-ink transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </a>

            {/* Big GitHub Logo Box */}
            <a 
              href="https://github.com/captain737"
              target="_blank"
              rel="noopener noreferrer"
              className="pixel-box bg-purple-200 hover:bg-purple-300 border-2 border-ink aspect-square flex items-center justify-center text-ink hover:scale-[1.04] active:scale-95 transition-all cursor-pointer shadow-sm group no-underline"
              aria-label="GitHub: github.com/captain737"
              title="GitHub: github.com/captain737"
            >
              <svg className="w-12 h-12 sm:w-14 sm:h-14 fill-current transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
            </a>

          </div>
        </Window>
      )}

    </AnimatePresence>
  );
}
