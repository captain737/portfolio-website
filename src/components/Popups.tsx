import { motion, AnimatePresence } from "motion/react";
import type { ReactNode } from "react";
import { PopupState } from "../types";
import { X, ArrowRight, ArrowLeft, ExternalLink, Mail, Linkedin, Github, MapPin, Heart } from "lucide-react";

interface PopupsProps {
  activePopup: PopupState;
  onClose: () => void;
  onNavigate: (state: PopupState) => void;
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
        transition={{ duration: 0.18 }}
        className="fixed inset-0 bg-ink/50 backdrop-blur-[2px] pointer-events-auto"
        onClick={onClose}
      />

      {/* Centered Modal Window */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.82 }}
        animate={{ 
          opacity: 1, 
          scale: [0.82, 1.035, 0.985, 1],
          transition: {
            duration: 0.32,
            times: [0, 0.58, 0.82, 1],
            ease: ["easeOut", "easeInOut", "easeOut"]
          }
        }}
        exit={{ 
          opacity: 0, 
          scale: 0.88, 
          transition: { duration: 0.16, ease: "easeIn" } 
        }}
        className={`relative pointer-events-auto w-full ${maxWidthClass} max-h-[min(86vh,740px)] flex flex-col pixel-box p-3.5 sm:p-5 md:p-6 bg-[#fdfaf6] z-10 overflow-hidden ${className}`}
      >
        <div className="flex justify-between items-center mb-3 sm:mb-4 pb-2 sm:pb-3 border-b-2 border-ink flex-shrink-0">
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
              <h2 className="font-pixel text-[11px] sm:text-sm md:text-base font-bold tracking-wide m-0 leading-tight truncate text-ink">{title}</h2>
            )}
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="pixel-btn w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center bg-white hover:bg-red-500 hover:text-white transition-colors text-ink cursor-pointer flex-shrink-0 font-pixel text-[11px]"
            aria-label="Close popup"
          >
            ✕
          </button>
        </div>
        <div className="font-pixel-body text-sm sm:text-base md:text-lg leading-relaxed overflow-y-auto flex-1 custom-scrollbar pr-1">
          {children}
        </div>
      </motion.div>
    </div>
  );

  return (
    <AnimatePresence>
      {activePopup === 'WHO' && (
        <Window key="popup-who" title="W — WHO?">
          <p className="mb-4 text-base sm:text-lg md:text-xl font-pixel-body font-medium">
            <strong className="font-pixel text-sm sm:text-base block mb-2 text-ink">Pragya Silwal</strong>
            Product person. Builder. Curious about why people do what they do — and how to make products they actually want to use.
          </p>
          <hr className="border-t-2 border-ink my-4" />
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="border-2 border-ink px-2 py-0.5 text-[9px] tracking-wider uppercase font-pixel bg-pink-100 font-bold text-ink">Product</span>
            <span className="border-2 border-ink px-2 py-0.5 text-[9px] tracking-wider uppercase font-pixel bg-yellow-100 font-bold text-ink">Growth</span>
            <span className="border-2 border-ink px-2 py-0.5 text-[9px] tracking-wider uppercase font-pixel bg-sky-100 font-bold text-ink">Experimentation</span>
            <span className="border-2 border-ink px-2 py-0.5 text-[9px] tracking-wider uppercase font-pixel bg-emerald-100 font-bold text-ink">AI</span>
            <span className="border-2 border-ink px-2 py-0.5 text-[9px] tracking-wider uppercase font-pixel bg-purple-100 font-bold text-ink">Consumer</span>
          </div>
          
          <div className="flex flex-wrap gap-3 pt-3">
            <button onClick={() => onNavigate('PROJECTS')} className="px-3.5 py-2 pixel-btn bg-white hover:bg-ink hover:text-paper transition-colors uppercase font-bold tracking-wider font-pixel text-[9px] sm:text-xs cursor-pointer">
              ▶ PROJECTS
            </button>
            <button onClick={() => onNavigate('EXPERIENCE')} className="px-3.5 py-2 pixel-btn bg-white hover:bg-ink hover:text-paper transition-colors uppercase font-bold tracking-wider font-pixel text-[9px] sm:text-xs cursor-pointer">
              ▶ EXPERIENCE
            </button>
            <button onClick={() => onNavigate('CONTACT')} className="px-3.5 py-2 pixel-btn bg-white hover:bg-ink hover:text-paper transition-colors uppercase font-bold tracking-wider font-pixel text-[9px] sm:text-xs cursor-pointer">
              ▶ CONTACT
            </button>
          </div>
        </Window>
      )}

      {activePopup === 'PROJECTS' && (
        <Window key="popup-projects" title="A — WHAT HAVE YOU BUILT?" maxWidthClass="max-w-[1300px] w-full sm:w-[94vw] lg:w-[92vw]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5 items-stretch">
            {/* CardFit */}
            <div className="p-3 sm:p-4 pixel-box bg-[#fbf9f2] flex flex-col justify-between hover:bg-white transition-colors group">
              <div>
                <div 
                  onClick={() => onNavigate('PROJECT_CARDFIT')}
                  className="cursor-pointer"
                >
                  <div className="w-full h-20 sm:h-24 md:h-28 bg-[#d9d1ef] border-2 border-ink flex items-center justify-center mb-2.5 group-hover:scale-[1.02] transition-transform overflow-hidden p-1.5 sm:p-2">
                    <img 
                      src="/cardfit_preview.jpg" 
                      alt="CardFit - Credit Card Discovery" 
                      className="w-full h-full object-cover shadow-xs"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                    <a 
                      href="https://cardfit.me" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="font-pixel text-xs sm:text-sm font-bold hover:underline flex items-center gap-1 text-ink"
                    >
                      CardFit <ExternalLink className="w-3 h-3 text-ink/70" />
                    </a>
                    <span className="text-[9px] uppercase font-pixel px-1.5 py-0.5 border-2 border-ink bg-purple-100 font-bold">FinTech</span>
                    <a 
                      href="https://cardfit.me" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={(e) => e.stopPropagation()}
                      className="text-[9px] font-pixel text-ink/80 hover:text-ink underline"
                    >
                      cardfit.me
                    </a>
                  </div>
                  <p className="text-xs sm:text-sm font-story leading-relaxed text-ink/85 mb-3 line-clamp-3">
                    Credit card discovery platform that uses live card data and a personalized ranking engine to help users find the right card.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t-2 border-ink/20">
                <button 
                  onClick={() => onNavigate('PROJECT_CARDFIT')}
                  className="flex-1 py-1.5 px-2 pixel-btn text-[9px] font-pixel font-bold text-ink bg-yellow-100 hover:bg-yellow-200 transition-colors text-center cursor-pointer"
                >
                  STORY →
                </button>
                <a 
                  href="https://cardfit.me" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 px-2 pixel-btn bg-white hover:bg-ink hover:text-paper transition-colors text-[9px] font-pixel font-bold text-ink flex items-center justify-center gap-1 cursor-pointer"
                  title="Visit cardfit.me in new tab"
                >
                  <span>VISIT</span>
                  <ExternalLink className="w-2.5 h-2.5 text-current" />
                </a>
              </div>
            </div>

            {/* Noor Azaan */}
            <div className="p-3 sm:p-4 pixel-box bg-[#fbf9f2] flex flex-col justify-between hover:bg-white transition-colors group">
              <div>
                <div 
                  onClick={() => onNavigate('PROJECT_NOOR')}
                  className="cursor-pointer"
                >
                  <div className="w-full h-20 sm:h-24 md:h-28 bg-[#cbddd5] border-2 border-ink flex items-center justify-center mb-2.5 group-hover:scale-[1.02] transition-transform overflow-hidden p-1.5 sm:p-2">
                    <img 
                      src="/noor_azaan_icon.jpg" 
                      alt="Noor Azaan - Islamic Prayer App" 
                      className="h-full object-contain shadow-xs"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                    <a 
                      href="https://apps.apple.com/us/app/noor-azaan/id6759352271" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="font-pixel text-xs sm:text-sm font-bold hover:underline flex items-center gap-1 text-ink"
                    >
                      Noor Azaan <ExternalLink className="w-3 h-3 text-ink/70" />
                    </a>
                    <span className="text-[9px] uppercase font-pixel px-1.5 py-0.5 border-2 border-ink bg-emerald-100 font-bold">FaithTech</span>
                    <span className="text-[8px] font-pixel text-ink/70">iOS</span>
                  </div>
                  <p className="text-xs sm:text-sm font-story leading-relaxed text-ink/85 mb-3 line-clamp-3">
                    A modern lifestyle & prayer app for Gen Z Muslims designed for everyday routines. Currently live on the App Store!
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t-2 border-ink/20">
                <button 
                  onClick={() => onNavigate('PROJECT_NOOR')}
                  className="flex-1 py-1.5 px-2 pixel-btn text-[9px] font-pixel font-bold text-ink bg-yellow-100 hover:bg-yellow-200 transition-colors text-center cursor-pointer"
                >
                  STORY →
                </button>
                <a 
                  href="https://apps.apple.com/us/app/noor-azaan/id6759352271" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 px-2 pixel-btn bg-white hover:bg-ink hover:text-paper transition-colors text-[9px] font-pixel font-bold text-ink flex items-center justify-center gap-1 cursor-pointer"
                  title="View on App Store"
                >
                  <span>APP STORE</span>
                  <ExternalLink className="w-2.5 h-2.5 text-current" />
                </a>
              </div>
            </div>

            {/* RateMySemesterAbroad */}
            <div className="p-3 sm:p-4 pixel-box bg-[#fbf9f2] flex flex-col justify-between hover:bg-white transition-colors group">
              <div>
                <div 
                  onClick={() => onNavigate('PROJECT_RMSA')}
                  className="cursor-pointer"
                >
                  <div className="w-full h-20 sm:h-24 md:h-28 bg-[#e3dec9] border-2 border-ink flex items-center justify-center mb-2.5 group-hover:scale-[1.02] transition-transform overflow-hidden p-1.5 sm:p-2">
                    <img 
                      src="/ratemy_preview.jpg" 
                      alt="RateMySemesterAbroad - Looking Beyond the Brochure" 
                      className="w-full h-full object-cover shadow-xs"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                    <a 
                      href="https://www.haverford.edu/marketing-and-communications/news/looking-beyond-brochure" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="font-pixel text-[11px] sm:text-xs font-bold hover:underline flex items-center gap-1 text-ink"
                    >
                      RateMySemesterAbroad <ExternalLink className="w-3 h-3 text-ink/70" />
                    </a>
                    <span className="text-[9px] uppercase font-pixel px-1.5 py-0.5 border-2 border-ink bg-sky-100 font-bold">EdTech</span>
                  </div>
                  <p className="text-xs sm:text-sm font-story leading-relaxed text-ink/85 mb-3 line-clamp-3">
                    Built a platform that helps students compare study abroad programs through verified reviews and first-hand experiences.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t-2 border-ink/20">
                <button 
                  onClick={() => onNavigate('PROJECT_RMSA')}
                  className="flex-1 py-1.5 px-2 pixel-btn text-[9px] font-pixel font-bold text-ink bg-yellow-100 hover:bg-yellow-200 transition-colors text-center cursor-pointer"
                >
                  STORY →
                </button>
                <a 
                  href="https://www.haverford.edu/marketing-and-communications/news/looking-beyond-brochure" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 px-2 pixel-btn bg-white hover:bg-ink hover:text-paper transition-colors text-[9px] font-pixel font-bold text-ink flex items-center justify-center gap-1 cursor-pointer"
                  title="Read Haverford Feature"
                >
                  <span>FEATURE</span>
                  <ExternalLink className="w-2.5 h-2.5 text-current" />
                </a>
              </div>
            </div>
          </div>
        </Window>
      )}

      {activePopup === 'PROJECT_CARDFIT' && (
        <Window key="popup-cardfit" onBack={() => onNavigate('PROJECTS')} maxWidthClass="max-w-4xl sm:w-[90vw] lg:w-[82vw] max-w-[920px]">
          <div className="mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4">
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
            <div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold leading-tight text-ink font-pixel">
                CardFit
              </h3>
              <p className="opacity-85 text-xs sm:text-sm font-story mt-1.5 leading-relaxed">
                <strong>Website:</strong> <a href="https://cardfit.me" target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-ink">cardfit.me</a> · <strong>Industry:</strong> FinTech · <strong>Timeline:</strong> Live<br/>
                <strong>Role:</strong> Founder, Product Manager & Product Designer
              </p>
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
            <a 
              href="https://cardfit.me" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-4 py-2 text-[9px] sm:text-[11px] pixel-btn bg-yellow-200 text-ink hover:bg-yellow-300 transition-colors uppercase font-bold tracking-wider font-pixel flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>VISIT CARDFIT.ME</span>
              <ExternalLink className="w-3 h-3 text-current" />
            </a>
          </div>
        </Window>
      )}

      {activePopup === 'PROJECT_NOOR' && (
        <Window key="popup-noor" onBack={() => onNavigate('PROJECTS')} maxWidthClass="max-w-4xl sm:w-[90vw] lg:w-[82vw] max-w-[920px]">
          <div className="mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4">
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
            <div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold leading-tight text-ink font-pixel">
                Noor Azaan
              </h3>
              <p className="opacity-85 text-xs sm:text-sm font-story mt-1.5 leading-relaxed">
                <strong>Platform:</strong> <a href="https://apps.apple.com/us/app/noor-azaan/id6759352271" target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-ink">iOS App Store</a> · <strong>Industry:</strong> Consumer Mobile · <strong>Timeline:</strong> Live<br/>
                <strong>Role:</strong> Founder, Product Manager & Product Designer
              </p>
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
            <a 
              href="https://apps.apple.com/us/app/noor-azaan/id6759352271" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-4 py-2 text-[9px] sm:text-[11px] pixel-btn bg-emerald-200 text-ink hover:bg-emerald-300 transition-colors uppercase font-bold tracking-wider font-pixel flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>VIEW ON APP STORE</span>
              <ExternalLink className="w-3 h-3 text-current" />
            </a>
          </div>
        </Window>
      )}

      {activePopup === 'PROJECT_RMSA' && (
        <Window key="popup-rmsa" onBack={() => onNavigate('PROJECTS')} maxWidthClass="max-w-4xl sm:w-[90vw] lg:w-[82vw] max-w-[920px]">
          <div className="mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4">
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
            <div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold leading-tight text-ink font-pixel">
                RateMySemesterAbroad
              </h3>
              <p className="opacity-85 text-xs sm:text-sm font-story mt-1.5 leading-relaxed">
                <strong>Publication:</strong> <a href="https://www.haverford.edu/marketing-and-communications/news/looking-beyond-brochure" target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-ink">Haverford College News</a> · <strong>Industry:</strong> EdTech, Travel · <strong>Timeline:</strong> 2025<br/>
                <strong>Role:</strong> Founder & Product Manager
              </p>
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
            <a 
              href="https://www.haverford.edu/marketing-and-communications/news/looking-beyond-brochure" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-4 py-2 text-[9px] sm:text-[11px] pixel-btn bg-sky-200 text-ink hover:bg-sky-300 transition-colors uppercase font-bold tracking-wider font-pixel flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>READ FEATURE</span>
              <ExternalLink className="w-3 h-3 text-current" />
            </a>
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
        <Window key="popup-contact" title="2 — HOW DO I CONTACT YOU?">
          <div className="space-y-0">
            
            <div className="flex items-center gap-3 py-3 border-b-2 border-ink/20">
              <div className="w-8 h-8 pixel-btn flex items-center justify-center font-pixel text-xs bg-yellow-200 text-ink">✉</div>
              <div>
                <strong className="block text-[10px] font-pixel mb-0.5 text-ink uppercase">Email</strong>
                <a href="mailto:pragyasilwal@gmail.com" className="text-sm font-pixel-body hover:underline text-ink font-semibold">pragyasilwal@gmail.com</a>
              </div>
            </div>

            <div className="flex items-center gap-3 py-3 border-b-2 border-ink/20">
              <div className="w-8 h-8 pixel-btn flex items-center justify-center font-pixel text-xs bg-sky-200 text-ink">in</div>
              <div>
                <strong className="block text-[10px] font-pixel mb-0.5 text-ink uppercase">LinkedIn</strong>
                <a href="https://linkedin.com/in/psilwal" target="_blank" rel="noreferrer" className="text-sm font-pixel-body hover:underline text-ink font-semibold">linkedin.com/in/psilwal</a>
              </div>
            </div>

            <div className="flex items-center gap-3 py-3 border-b-2 border-ink/20">
              <div className="w-8 h-8 pixel-btn flex items-center justify-center font-pixel text-xs bg-emerald-200 text-ink">🌐</div>
              <div>
                <strong className="block text-[10px] font-pixel mb-0.5 text-ink uppercase">Website</strong>
                <a href="https://pragyasilwal.com" target="_blank" rel="noreferrer" className="text-sm font-pixel-body hover:underline text-ink font-semibold">pragyasilwal.com</a>
              </div>
            </div>

            <div className="flex items-center gap-3 py-3 border-b-2 border-ink/20">
              <div className="w-8 h-8 pixel-btn flex items-center justify-center font-pixel text-xs bg-purple-200 text-ink">●</div>
              <div>
                <strong className="block text-[10px] font-pixel mb-0.5 text-ink uppercase">GitHub</strong>
                <a href="https://github.com/captain737" target="_blank" rel="noreferrer" className="text-sm font-pixel-body hover:underline text-ink font-semibold">github.com/captain737</a>
              </div>
            </div>

            <div className="mt-6 p-3 pixel-box bg-yellow-50 text-center">
              <p className="font-pixel text-[10px] sm:text-xs text-ink leading-relaxed">
                ★ THANKS FOR CALLING ★<br/>
                <span className="text-ink/70">TALK SOON. ♡</span>
              </p>
            </div>

          </div>
        </Window>
      )}

    </AnimatePresence>
  );
}
