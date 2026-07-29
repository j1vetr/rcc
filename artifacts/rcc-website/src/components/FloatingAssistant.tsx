import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, Bot, ChevronRight, MessageCircleQuestion, X } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { useTranslation } from '@/i18n/LanguageContext';
import { assistantCopy, type FaqItem } from '@/data/faqAssistant';

const WHATSAPP_URL = 'https://wa.me/41788803884';
const CATEGORY_ORDER: FaqItem['category'][] = ['services', 'process', 'booking', 'special'];

export function FloatingAssistant() {
  const { lang } = useTranslation();
  const copy = assistantCopy[lang];
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const selected = copy.items.find((item) => item.id === selectedId);

  useEffect(() => {
    if (!isOpen) return;

    const panel = panelRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
    );
    focusable?.[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        return;
      }
      if (event.key !== 'Tab' || !focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedId]);

  useEffect(() => {
    if (!isOpen) launcherRef.current?.focus();
  }, [isOpen]);

  const close = () => setIsOpen(false);
  const goToQuote = () => {
    close();
    document.getElementById('quote')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              type="button"
              aria-label={copy.close}
              className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-[2px] md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
            />
            <motion.div
              ref={panelRef}
              id="rcc-assistant-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="rcc-assistant-title"
              className="fixed inset-x-0 bottom-0 z-[90] flex max-h-[82dvh] flex-col overflow-hidden border-t border-primary/30 bg-[#080808]/98 shadow-[0_-20px_70px_rgba(0,0,0,0.8)] md:inset-auto md:bottom-24 md:left-6 md:h-[min(650px,calc(100vh-8rem))] md:w-[390px] md:rounded-sm md:border"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              data-testid="rcc-assistant-panel"
            >
              <header className="flex shrink-0 items-center justify-between border-b border-white/10 bg-white/[0.025] px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center border border-primary/35 bg-primary/[0.08] text-primary">
                    <Bot className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 id="rcc-assistant-title" className="text-base font-semibold uppercase tracking-[0.08em]">
                      {copy.name}
                    </h2>
                    <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-foreground/45">
                      <i className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      {copy.status}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="flex h-10 w-10 items-center justify-center text-foreground/55 transition-colors hover:bg-white/5 hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  aria-label={copy.close}
                  data-testid="button-close-assistant"
                >
                  <X className="h-5 w-5" />
                </button>
              </header>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5" aria-live="polite">
                {!selected ? (
                  <>
                    <div className="mb-6 border-l border-primary/50 pl-4">
                      <p className="font-serif text-xl font-medium">{copy.greeting}</p>
                      <p className="mt-2 text-sm font-light leading-relaxed text-foreground/50">{copy.prompt}</p>
                    </div>
                    <div className="space-y-6">
                      {CATEGORY_ORDER.map((category) => (
                        <section key={category}>
                          <h3 className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
                            {copy.categories[category]}
                          </h3>
                          <div className="space-y-2">
                            {copy.items.filter((item) => item.category === category).map((item) => (
                              <button
                                type="button"
                                key={item.id}
                                onClick={() => setSelectedId(item.id)}
                                className="group flex w-full items-center gap-3 border border-white/[0.08] bg-white/[0.025] px-3.5 py-3 text-left transition-colors hover:border-primary/35 hover:bg-primary/[0.05] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                                data-testid={`button-faq-${item.id}`}
                              >
                                <span className="w-5 shrink-0 text-[10px] text-primary/65">{String(item.id).padStart(2, '0')}</span>
                                <span className="flex-1 text-[13px] font-light leading-snug text-foreground/75 group-hover:text-foreground">
                                  {item.question}
                                </span>
                                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-foreground/25 group-hover:text-primary" />
                              </button>
                            ))}
                          </div>
                        </section>
                      ))}
                    </div>
                  </>
                ) : (
                  <div>
                    <button
                      type="button"
                      onClick={() => setSelectedId(null)}
                      className="mb-7 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-foreground/45 transition-colors hover:text-primary"
                      data-testid="button-assistant-back"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      {copy.back}
                    </button>
                    <div className="ml-auto max-w-[88%] border border-primary/25 bg-primary/[0.08] p-4 text-sm font-light leading-relaxed text-foreground/80">
                      {selected.question}
                    </div>
                    <motion.div
                      key={`${lang}-${selected.id}`}
                      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 max-w-[92%] border border-white/10 bg-white/[0.035] p-5"
                    >
                      <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-primary">
                        <Bot className="h-3.5 w-3.5" />
                        {copy.name}
                      </div>
                      <p className="text-sm font-light leading-7 text-foreground/75">{selected.answer}</p>
                    </motion.div>
                    <div className="mt-7 grid gap-2">
                      <button
                        type="button"
                        onClick={goToQuote}
                        className="btn-gold-luxury min-h-12 px-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-background"
                      >
                        {copy.quote}
                      </button>
                      <a
                        href={WHATSAPP_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="flex min-h-12 items-center justify-center gap-2 border border-white/10 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/65 transition-colors hover:border-emerald-500/40 hover:text-emerald-400"
                      >
                        <FaWhatsapp className="h-4 w-4" />
                        {copy.whatsapp}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <button
        ref={launcherRef}
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-controls="rcc-assistant-dialog"
        aria-label={copy.open}
        className="fixed bottom-4 left-4 z-[70] flex h-14 w-14 items-center justify-center rounded-full border border-primary/45 bg-[#0a0a0a] text-primary shadow-[0_0_28px_rgba(201,165,83,0.28)] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:bottom-6 md:left-6 md:h-16 md:w-16"
        data-testid="button-open-assistant"
      >
        <MessageCircleQuestion className="h-6 w-6 md:h-7 md:w-7" />
        <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-background">
          {copy.items.length}
        </span>
      </button>

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className="fixed bottom-4 right-4 z-[70] flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/35 bg-[#0a0a0a] text-emerald-400 shadow-[0_0_28px_rgba(52,211,153,0.2)] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 md:bottom-6 md:right-6 md:h-16 md:w-16"
        data-testid="button-floating-whatsapp"
      >
        <FaWhatsapp className="h-7 w-7 md:h-8 md:w-8" />
      </a>
    </>
  );
}