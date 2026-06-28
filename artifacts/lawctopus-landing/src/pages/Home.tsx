import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

/* ─── Config ──────────────────────────────────────────────────── */
const URL_ENROLL = "https://www.lawctopus.com/expert-level-mastering-contract-drafting-freelancing/";
const DEADLINE   = new Date("2026-06-30T23:59:59").getTime();

/* ─── Theme Context ───────────────────────────────────────────── */
interface ThemeCtxType { isDark: boolean; toggleTheme: () => void; }
const ThemeCtx = createContext<ThemeCtxType>({ isDark: true, toggleTheme: () => {} });

/* ─── Theme helpers ───────────────────────────────────────────── */
const D = {
  pageBg:      '#05090f',
  midBg:       '#122B46',
  heading:     '#ffffff',
  subtext:     'rgba(240,237,232,0.42)',
  muted:       'rgba(255,255,255,0.2)',
  dim:         'rgba(255,255,255,0.25)',
  border:      'rgba(255,255,255,0.06)',
  borderMid:   'rgba(255,255,255,0.07)',
  card:        'rgba(255,255,255,0.025)',
  logoFilter:  'brightness(10) saturate(0)',
  navLink:     'rgba(255,255,255,0.35)',
  navBg:       'rgba(5,9,15,0.88)',
  navBorder:   '1px solid rgba(255,156,0,0.07)',
  mobileMenu:  'rgba(5,9,15,0.97)',
  mobileMenuBorder: '1px solid rgba(255,156,0,0.08)',
  mobileLink:  'rgba(255,255,255,0.55)',
  ghostStroke: 'rgba(255,156,0,0.06)',
  ghostFill:   'rgba(255,156,0,0.06)',
  numGhost:    'rgba(255,255,255,0.05)',
  scrollCue:   'rgba(255,255,255,0.15)',
  hoverCard:   'rgba(255,255,255,0.025)',
};
const L = {
  pageBg:      '#faf6f0',
  midBg:       '#e0edf7',
  heading:     '#05090f',
  subtext:     'rgba(5,9,15,0.42)',
  muted:       'rgba(5,9,15,0.28)',
  dim:         'rgba(5,9,15,0.3)',
  border:      'rgba(5,9,15,0.08)',
  borderMid:   'rgba(5,9,15,0.08)',
  card:        'rgba(5,9,15,0.04)',
  logoFilter:  'none',
  navLink:     'rgba(5,9,15,0.5)',
  navBg:       'rgba(250,246,240,0.92)',
  navBorder:   '1px solid rgba(5,9,15,0.08)',
  mobileMenu:  'rgba(250,246,240,0.98)',
  mobileMenuBorder: '1px solid rgba(5,9,15,0.06)',
  mobileLink:  'rgba(5,9,15,0.55)',
  ghostStroke: 'rgba(255,156,0,0.04)',
  ghostFill:   'rgba(255,156,0,0.04)',
  numGhost:    'rgba(5,9,15,0.05)',
  scrollCue:   'rgba(5,9,15,0.2)',
  hoverCard:   'rgba(5,9,15,0.03)',
};

/* ─── Countdown ───────────────────────────────────────────────── */
function useCountdown() {
  const snap = () => { const d = Math.max(0, DEADLINE - Date.now()); return { D: Math.floor(d/86400000), H: Math.floor((d%86400000)/3600000), M: Math.floor((d%3600000)/60000), S: Math.floor((d%60000)/1000) }; };
  const [v, setV] = useState(snap);
  useEffect(() => { const id = setInterval(() => setV(snap()), 1000); return () => clearInterval(id); }, []);
  return v;
}

/* ─── Cursor ──────────────────────────────────────────────────── */
function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const lag = useRef({ x: -200, y: -200 });
  const raw = useRef({ x: -200, y: -200 });
  useEffect(() => {
    const mv = (e: MouseEvent) => { raw.current = { x: e.clientX, y: e.clientY }; if (dot.current) { dot.current.style.left = e.clientX + 'px'; dot.current.style.top = e.clientY + 'px'; } };
    window.addEventListener('mousemove', mv);
    let raf: number;
    const loop = () => {
      lag.current.x += (raw.current.x - lag.current.x) * 0.12;
      lag.current.y += (raw.current.y - lag.current.y) * 0.12;
      if (ring.current) { ring.current.style.left = lag.current.x + 'px'; ring.current.style.top = lag.current.y + 'px'; }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener('mousemove', mv); cancelAnimationFrame(raf); };
  }, []);
  return (
    <>
      <div ref={dot} className="cursor-dot" />
      <div ref={ring} className="cursor-ring" />
    </>
  );
}

/* ─── Theme Switch ────────────────────────────────────────────── */
function ThemeSwitch() {
  const { isDark, toggleTheme } = useContext(ThemeCtx);
  return (
    <label className="theme-switch" title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
      <input
        type="checkbox"
        className="theme-switch__checkbox"
        checked={isDark}
        onChange={toggleTheme}
        readOnly={false}
      />
      <div className="theme-switch__container">
        <div className="theme-switch__clouds" />
        <div className="theme-switch__stars-container">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144 55" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M135.831 3.00688C135.055 3.85027 134.111 4.29946 133 4.35447C134.111 4.40947 135.055 4.85867 135.831 5.71123C136.607 6.55462 136.996 7.56303 136.996 8.72727C136.996 7.95722 137.172 7.25134 137.525 6.59129C137.886 5.93124 138.372 5.39954 138.98 5.00535C139.598 4.60199 140.268 4.39114 141 4.35447C139.88 4.2903 138.936 3.85027 138.16 3.00688C137.384 2.16348 136.996 1.16425 136.996 0C136.996 1.16425 136.607 2.16348 135.831 3.00688ZM31 23.3545C32.1114 23.2995 33.0551 22.8503 33.8313 22.0069C34.6075 21.1635 34.9956 20.1642 34.9956 19C34.9956 20.1642 35.3837 21.1635 36.1599 22.0069C36.9361 22.8503 37.8798 23.2903 39 23.3545C38.2679 23.3911 37.5976 23.602 36.9802 24.0053C36.3716 24.3995 35.8864 24.9312 35.5248 25.5913C35.172 26.2513 34.9956 26.9572 34.9956 27.7273C34.9956 26.563 34.6075 25.5546 33.8313 24.7112C33.0551 23.8587 32.1114 23.4095 31 23.3545ZM0 36.3545C1.11136 36.2995 2.05513 35.8503 2.83131 35.0069C3.6075 34.1635 3.99559 33.1642 3.99559 32C3.99559 33.1642 4.38368 34.1635 5.15987 35.0069C5.93605 35.8503 6.87982 36.2903 8 36.3545C7.26792 36.3911 6.59757 36.602 5.98015 37.0053C5.37155 37.3995 4.88644 37.9312 4.52481 38.5913C4.172 39.2513 3.99559 39.9572 3.99559 40.7273C3.99559 39.563 3.6075 38.5546 2.83131 37.7112C2.05513 36.8587 1.11136 36.4095 0 36.3545ZM56.8313 24.0069C56.0551 24.8503 55.1114 25.2995 54 25.3545C55.1114 25.4095 56.0551 25.8587 56.8313 26.7112C57.6075 27.5546 57.9956 28.563 57.9956 29.7273C57.9956 28.9572 58.172 28.2513 58.5248 27.5913C58.8864 26.9312 59.3716 26.3995 59.9802 26.0053C60.5976 25.602 61.2679 25.3911 62 25.3545C60.8798 25.2903 59.9361 24.8503 59.1599 24.0069C58.3837 23.1635 57.9956 22.1642 57.9956 21C57.9956 22.1642 57.6075 23.1635 56.8313 24.0069ZM81 25.3545C82.1114 25.2995 83.0551 24.8503 83.8313 24.0069C84.6075 23.1635 84.9956 22.1642 84.9956 21C84.9956 22.1642 85.3837 23.1635 86.1599 24.0069C86.9361 24.8503 87.8798 25.2903 89 25.3545C88.2679 25.3911 87.5976 25.602 86.9802 26.0053C86.3716 26.3995 85.8864 26.9312 85.5248 27.5913C85.172 28.2513 84.9956 28.9572 84.9956 29.7273C84.9956 28.563 84.6075 27.5546 83.8313 26.7112C83.0551 25.8587 82.1114 25.4095 81 25.3545ZM136 36.3545C137.111 36.2995 138.055 35.8503 138.831 35.0069C139.607 34.1635 139.996 33.1642 139.996 32C139.996 33.1642 140.384 34.1635 141.16 35.0069C141.936 35.8503 142.88 36.2903 144 36.3545C143.268 36.3911 142.598 36.602 141.98 37.0053C141.372 37.3995 140.886 37.9312 140.525 38.5913C140.172 39.2513 139.996 39.9572 139.996 40.7273C139.996 39.563 139.607 38.5546 138.831 37.7112C138.055 36.8587 137.111 36.4095 136 36.3545ZM101.831 49.0069C101.055 49.8503 100.111 50.2995 99 50.3545C100.111 50.4095 101.055 50.8587 101.831 51.7112C102.607 52.5546 102.996 53.563 102.996 54.7273C102.996 53.9572 103.172 53.2513 103.525 52.5913C103.886 51.9312 104.372 51.3995 104.98 51.0053C105.598 50.602 106.268 50.3911 107 50.3545C105.88 50.2903 104.936 49.8503 104.16 49.0069C103.384 48.1635 102.996 47.1642 102.996 46C102.996 47.1642 102.607 48.1635 101.831 49.0069Z" fill="currentColor" />
          </svg>
        </div>
        <div className="theme-switch__circle-container">
          <div className="theme-switch__sun-moon-container">
            <div className="theme-switch__moon">
              <div className="theme-switch__spot" />
              <div className="theme-switch__spot" />
              <div className="theme-switch__spot" />
            </div>
          </div>
        </div>
      </div>
    </label>
  );
}

/* ─── Loader ──────────────────────────────────────────────────── */
function Loader({ done }: { done: () => void }) {
  useEffect(() => { const t = setTimeout(done, 1800); return () => clearTimeout(t); }, [done]);
  const letters = 'LAWCTOPUS'.split('');
  return (
    <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-6" style={{ background: '#05090f' }}>
      <div className="flex gap-0.5 overflow-hidden">
        {letters.map((l, i) => (
          <motion.span key={i} initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: i * 0.055, duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="inline-block font-black text-white" style={{ fontSize: 'clamp(2.8rem,8vw,5.5rem)', letterSpacing: '-0.04em', lineHeight: 1 }}
          >{l}</motion.span>
        ))}
      </div>
      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.65, duration: 1, ease: [0.76, 0, 0.24, 1] }}
        className="h-px w-36 origin-left" style={{ background: '#FF9C00' }}
      />
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
        className="text-[10px] uppercase tracking-[0.45em] font-medium" style={{ color: 'rgba(255,255,255,0.2)' }}
      >Law School</motion.p>
    </motion.div>
  );
}

/* ─── Marquee ─────────────────────────────────────────────────── */
const CONTRACTS = ['Sale Deed', 'Non-Disclosure Agreement', 'Master Service Agreement', 'Shareholders Agreement', 'Joint Venture', 'Power of Attorney', 'IP License', 'International Agreement', 'Website Terms of Use', 'SaaS Agreement', 'Employment Contract', 'Franchise Agreement', 'Joint Development Agreement', 'e-Contract'];
function Marquee({ flip = false, orange = false }: { flip?: boolean; orange?: boolean }) {
  const { isDark } = useContext(ThemeCtx);
  const t = isDark ? D : L;
  const items = [...CONTRACTS, ...CONTRACTS, ...CONTRACTS];
  const bg = orange ? '#FF9C00' : 'transparent';
  const tc = orange ? 'rgba(5,9,15,0.55)' : t.muted;
  const dc = orange ? 'rgba(5,9,15,0.25)' : 'rgba(255,156,0,0.5)';
  return (
    <div className="overflow-hidden py-3" style={{ background: bg, borderTop: orange ? 'none' : `1px solid ${t.border}`, borderBottom: orange ? 'none' : `1px solid ${t.border}` }}>
      <div className="flex whitespace-nowrap" style={{ animation: `marquee ${flip ? 45 : 38}s linear infinite${flip ? ' reverse' : ''}` }}>
        {items.map((c, i) => (
          <span key={i} className="flex items-center gap-2.5 pr-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: tc }}>{c}</span>
            <span style={{ color: dc, fontSize: 6 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Nav ─────────────────────────────────────────────────────── */
function Nav() {
  const { isDark } = useContext(ThemeCtx);
  const t = isDark ? D : L;
  const [bg, setBg] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => { const fn = () => setBg(window.scrollY > 60); window.addEventListener('scroll', fn, { passive: true }); return () => window.removeEventListener('scroll', fn); }, []);
  const links = [['Curriculum','#curriculum'],['Why Live','#whylive'],['Who For','#whofor'],['FAQ','#faq']];
  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-50 transition-all duration-500"
        style={{ background: bg ? t.navBg : 'transparent', backdropFilter: bg ? 'blur(24px)' : 'none', borderBottom: bg ? t.navBorder : 'none' }}>
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 flex items-center justify-between" style={{ height: '4rem' }}>
          <a href="#">
            <img src="/lawctopus-logo.png" alt="Lawctopus" style={{ height: 30, filter: t.logoFilter }} />
          </a>
          <div className="hidden lg:flex items-center gap-8">
            {links.map(([l,h]) => (
              <a key={l} href={h} className="text-sm font-medium transition-colors hover:text-[#FF9C00]" style={{ color: t.navLink, letterSpacing: '0.01em' }}>{l}</a>
            ))}
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeSwitch />
            <a href={URL_ENROLL} target="_blank" rel="noreferrer"
              className="btn-shine hidden lg:inline-flex items-center gap-2 rounded-full font-bold text-sm"
              style={{ background: '#FF9C00', color: '#05090f', padding: '0.55rem 1.4rem', boxShadow: '0 0 24px rgba(255,156,0,0.3)' }}
            >Enroll Now →</a>
            <button onClick={() => setOpen(v => !v)} className="lg:hidden flex flex-col gap-1.5 p-2.5" aria-label="menu" style={{ minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="block w-5 h-px" style={{ background: t.navLink }} />
              <span className="block h-px" style={{ width: open ? 20 : 14, background: t.navLink }} />
            </button>
          </div>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed inset-x-0 z-40 p-6 flex flex-col gap-2" style={{ top: '4rem', background: t.mobileMenu, borderBottom: t.mobileMenuBorder }}>
            {links.map(([l,h]) => (
              <a key={l} href={h} onClick={() => setOpen(false)} className="py-3 text-base font-medium border-b hover:text-[#FF9C00]" style={{ color: t.mobileLink, borderColor: t.border }}>{l}</a>
            ))}
            <a href={URL_ENROLL} target="_blank" rel="noreferrer" className="btn-shine mt-3 py-3 text-center rounded-full font-bold" style={{ background: '#FF9C00', color: '#05090f' }}>Enroll Now →</a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Hero ────────────────────────────────────────────────────── */
function Hero() {
  const { isDark } = useContext(ThemeCtx);
  const t = isDark ? D : L;
  const cd = useCountdown();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const ghostY = useTransform(scrollYProgress, [0,1], ['0%','-22%']);
  const contentY = useTransform(scrollYProgress, [0,1], ['0%','14%']);
  const contentOpacity = useTransform(scrollYProgress, [0,0.65], [1,0]);
  const words = ['Expert.', 'Drafter.', 'Freelancer.'];
  const [wi, setWi] = useState(0);
  useEffect(() => { const id = setInterval(() => setWi(v => (v + 1) % 3), 2600); return () => clearInterval(id); }, []);

  return (
    <section ref={ref} className="relative min-h-[100svh] flex flex-col overflow-hidden transition-colors duration-500" style={{ background: t.pageBg }}>
      {/* Ambient light */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 55% at 50% -8%, rgba(255,156,0,0.08) 0%, transparent 60%), radial-gradient(ellipse 50% 70% at 95% 95%, rgba(18,43,70,0.45) 0%, transparent 65%)' }} />

      {/* Ghost "54" */}
      <motion.div style={{ y: ghostY }} className="absolute right-[-3%] top-[3%] pointer-events-none select-none" aria-hidden>
        <span style={{ fontSize: 'clamp(18rem,38vw,34rem)', fontWeight: 900, lineHeight: 1, color: 'transparent', WebkitTextStroke: `1.5px ${t.ghostStroke}`, letterSpacing: '-0.06em' }}>54</span>
      </motion.div>

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative z-10 max-w-[1400px] mx-auto w-full px-6 sm:px-10 flex-1 flex flex-col justify-center pt-24 pb-12">
        {/* Live badge */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.55 }} className="mb-7 sm:mb-9">
          <span className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em]"
            style={{ background: 'rgba(255,156,0,0.09)', border: '1px solid rgba(255,156,0,0.22)', color: '#FF9C00' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#FF9C00' }} />
            Registration Open — Closes June 30
          </span>
        </motion.div>

        {/* Main headline */}
        <div className="mb-8 sm:mb-10">
          {['The Year', 'You Become'].map((line, i) => (
            <div key={i} className="overflow-hidden">
              <motion.h1 initial={{ y: '105%' }} animate={{ y: '0%' }} transition={{ delay: 0.28 + i * 0.14, duration: 0.8, ease: [0.76,0,0.24,1] }}
                className="block font-black leading-[0.86] transition-colors duration-500"
                style={{ fontSize: 'clamp(4rem,10.5vw,10.5rem)', letterSpacing: '-0.035em', color: t.heading }}>
                {line}
              </motion.h1>
            </div>
          ))}
          <div style={{ height: 'clamp(3.4rem,9.1vw,9.1rem)', overflow: 'hidden' }}>
            <AnimatePresence mode="wait">
              <motion.h1 key={wi} initial={{ y: '105%' }} animate={{ y: '0%' }} exit={{ y: '-105%' }}
                transition={{ duration: 0.6, ease: [0.76,0,0.24,1] }}
                className="block font-black leading-[0.86]"
                style={{ fontSize: 'clamp(4rem,10.5vw,10.5rem)', letterSpacing: '-0.035em', color: '#FF9C00', fontFamily: 'var(--app-font-serif)', fontStyle: 'italic' }}>
                {words[wi]}
              </motion.h1>
            </AnimatePresence>
          </div>
        </div>

        {/* Description + CTA + countdown */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 0.65 }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-14">
          <div className="max-w-lg">
            <p className="text-base sm:text-lg leading-relaxed mb-7 transition-colors duration-500" style={{ color: t.subtext, fontWeight: 300 }}>
              A 6-month, 100% live course by Lawctopus Law School — 54 sessions, 24+ contracts drafted from scratch, and a freelance practice built alongside the skill.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4 items-center">
              <a href={URL_ENROLL} target="_blank" rel="noreferrer"
                className="btn-shine inline-flex items-center gap-2 rounded-full font-bold text-sm sm:text-base"
                style={{ background: '#FF9C00', color: '#05090f', padding: '0.8rem 2rem', boxShadow: '0 0 32px rgba(255,156,0,0.25)' }}
                data-testid="hero-cta">
                Enroll Before June 30
                <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 17, height: 17 }}><path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" /></svg>
              </a>
              <span className="text-sm flex items-center gap-1.5 transition-colors duration-500" style={{ color: t.dim }}>
                <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 13, height: 13 }}><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
                Money-back guarantee
              </span>
            </div>
          </div>

          {/* Countdown */}
          <div className="rounded-2xl p-5 sm:p-6 flex-shrink-0 transition-colors duration-500" data-testid="countdown"
            style={{ background: t.card, border: '1px solid rgba(255,156,0,0.12)', boxShadow: '0 24px 48px rgba(0,0,0,0.3), 0 0 0 0.5px rgba(255,156,0,0.08)', animation: 'float 4s ease-in-out infinite' }}>
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] mb-4 text-center transition-colors duration-500" style={{ color: t.muted }}>Closes in</p>
            <div className="flex gap-1 sm:gap-2">
              {[{v:cd.D,l:'D'},{v:cd.H,l:'H'},{v:cd.M,l:'M'},{v:cd.S,l:'S'}].map(({v,l},i) => (
                <div key={i} className="flex gap-1 sm:gap-2 items-center">
                  {i > 0 && <span className="transition-colors duration-500" style={{ color: t.muted, fontSize: '1.2rem', fontWeight: 100 }}>:</span>}
                  <div className="text-center px-1">
                    <span className="block font-black tabular-nums transition-colors duration-500" style={{ fontSize: 'clamp(1.6rem,4vw,2.5rem)', lineHeight: 1, color: t.heading }}>{String(v).padStart(2,'0')}</span>
                    <span className="text-[8px] uppercase tracking-[0.18em] mt-0.5 block transition-colors duration-500" style={{ color: t.muted }}>{l}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-colors duration-500" style={{ color: t.scrollCue }}>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 18, height: 18 }}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─── Statement block: "54" ───────────────────────────────────── */
function Statement54() {
  const { isDark } = useContext(ThemeCtx);
  const t = isDark ? D : L;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x1 = useTransform(scrollYProgress, [0,1], ['-4%','4%']);
  const x2 = useTransform(scrollYProgress, [0,1], ['4%','-4%']);

  return (
    <div ref={ref} className="relative overflow-hidden py-16 sm:py-24 transition-colors duration-500" style={{ background: t.pageBg }}>
      <motion.div style={{ x: x1 }} className="overflow-hidden">
        <div className="flex whitespace-nowrap items-center gap-8 sm:gap-14 py-3 sm:py-5">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="flex items-center gap-8 sm:gap-14 flex-shrink-0">
              <span className="font-black" style={{ fontSize: 'clamp(4rem,12vw,11rem)', color: 'transparent', WebkitTextStroke: `1.5px ${t.ghostStroke}`, letterSpacing: '-0.05em', lineHeight: 1 }}>54 LIVE</span>
              <span className="font-black transition-colors duration-500" style={{ fontSize: 'clamp(4rem,12vw,11rem)', color: t.ghostFill, letterSpacing: '-0.05em', lineHeight: 1 }}>SESSIONS</span>
            </span>
          ))}
        </div>
      </motion.div>
      <motion.div style={{ x: x2 }} className="overflow-hidden">
        <div className="flex whitespace-nowrap items-center gap-8 sm:gap-14 py-3 sm:py-5">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="flex items-center gap-8 sm:gap-14 flex-shrink-0">
              <span className="font-black transition-colors duration-500" style={{ fontSize: 'clamp(4rem,12vw,11rem)', color: t.ghostFill, letterSpacing: '-0.05em', lineHeight: 1 }}>24+</span>
              <span className="font-black" style={{ fontSize: 'clamp(4rem,12vw,11rem)', color: 'transparent', WebkitTextStroke: `1.5px ${t.ghostStroke}`, letterSpacing: '-0.05em', lineHeight: 1 }}>CONTRACTS</span>
            </span>
          ))}
        </div>
      </motion.div>

      {/* Centre overlay text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="text-center px-5">
          <p className="text-sm sm:text-base font-medium mb-2" style={{ color: 'rgba(255,156,0,0.7)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>The numbers behind the program</p>
          <p className="text-lg sm:text-2xl font-light transition-colors duration-500" style={{ color: t.subtext, maxWidth: '32ch' }}>
            More live practice hours than most law school electives combined.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Stats ───────────────────────────────────────────────────── */
function Stats() {
  const { isDark } = useContext(ThemeCtx);
  const t = isDark ? D : L;
  const items = [
    { n: '54', s: 'Live Sessions', d: 'All live — real-time Q&A', hl: false },
    { n: '24+', s: 'Contracts Mastered', d: 'Drafted from scratch', hl: true },
    { n: '6', s: 'Months', d: 'July 1 – Dec 31, 2026', hl: false },
    { n: '100%', s: 'Live Format', d: 'No pre-recordings, ever', hl: false },
  ];
  return (
    <section className="transition-colors duration-500" style={{ background: t.midBg }}>
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4" style={{ borderTop: `1px solid ${t.borderMid}` }}>
          {items.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="p-7 sm:p-11 border-r border-b lg:border-b-0" style={{ borderColor: t.borderMid }}>
              <span className="block font-black leading-none mb-3 transition-colors duration-500" style={{ fontSize: 'clamp(2.8rem,6vw,4.5rem)', color: s.hl ? '#FF9C00' : t.heading }}>{s.n}</span>
              <p className="font-semibold text-sm sm:text-base transition-colors duration-500" style={{ color: t.heading }}>{s.s}</p>
              <p className="text-xs mt-0.5 transition-colors duration-500" style={{ color: t.muted }}>{s.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Curriculum ──────────────────────────────────────────────── */
function Curriculum() {
  const { isDark } = useContext(ThemeCtx);
  const t = isDark ? D : L;
  const [active, setActive] = useState<number | null>(0);
  const phases = [
    {
      n: '01', period: 'Months 1–2', tag: 'Foundation Layer',
      title: 'The muscle memory of a drafter',
      body: 'We open with a real Sale Deed — not simplified. You dissect every clause, flag every risk, then redraft the whole thing from scratch. By the end of month two, contract language is a first language.',
      items: ['Sale Deed anatomy & structure', 'Clause identification & purpose', 'Risk flagging in practice', 'Complete redrafting from scratch'],
      accent: '#FF9C00',
    },
    {
      n: '02', period: 'Months 3–6 (7–8 sessions/month)', tag: 'Expert Level',
      title: '24+ agreements. All live. All expert-level.',
      body: 'Real estate, IP, corporate — each domain taught by a practitioner who does this daily. You draft, you get live feedback, you draft again. No passive learning, no recordings.',
      items: ['NDA & Confidentiality Agreements', 'Master Service Agreements & SaaS', 'Shareholders & Joint Venture', 'Power of Attorney', 'IP Licenses', 'International Agreements', 'Website Terms of Use', 'Employment & Franchise'],
      accent: isDark ? '#f0ede8' : '#05090f',
    },
    {
      n: '03', period: 'Running all 6 months', tag: 'Freelance Engine',
      title: 'Build the practice alongside the skill',
      body: "Every month, a dedicated session on making money from what you're learning. Upwork. LinkedIn. Pricing. Proposals. Several students have paying clients by month four.",
      items: ['Upwork profile & proposals', 'LinkedIn lead generation', 'Pricing your work', 'Monthly networking with industry'],
      accent: '#FF9C00',
    },
  ];

  return (
    <section id="curriculum" className="transition-colors duration-500" style={{ background: t.pageBg }}>
      <Marquee />
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 py-20 sm:py-32">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14 sm:mb-20">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.35em] mb-3" style={{ color: '#FF9C00' }}>Curriculum</p>
            <h2 className="font-black leading-[0.88] transition-colors duration-500" style={{ fontSize: 'clamp(2.6rem,6vw,5.5rem)', letterSpacing: '-0.035em', color: t.heading }}>
              Six months.<br />
              <span style={{ fontFamily: 'var(--app-font-serif)', fontStyle: 'italic', color: '#FF9C00' }}>Three phases.</span>
            </h2>
          </div>
          <p className="text-sm max-w-[28ch] transition-colors duration-500" style={{ color: t.muted, lineHeight: 1.7 }}>Click to expand each phase. All sessions are live — no self-paced modules.</p>
        </motion.div>

        <div className="transition-colors duration-500" style={{ border: `1px solid ${t.border}`, borderRadius: 12 }}>
          {phases.map((p, i) => {
            const isOpen = active === i;
            return (
              <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="transition-colors duration-300"
                style={{ borderBottom: i < phases.length - 1 ? `1px solid ${t.border}` : 'none', background: isOpen ? 'rgba(255,156,0,0.03)' : 'transparent', transition: 'background 0.3s' }}>
                <button onClick={() => setActive(isOpen ? null : i)} className="w-full text-left px-6 sm:px-10 py-6 sm:py-8 flex items-center justify-between gap-5">
                  <div className="flex items-start sm:items-center gap-5 sm:gap-8">
                    <span className="font-black leading-none flex-shrink-0 transition-colors duration-500" style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: t.numGhost }}>{p.n}</span>
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-[0.25em] mb-1.5" style={{ color: p.accent }}>{p.tag}</span>
                      <h3 className="font-bold transition-colors duration-500" style={{ fontSize: 'clamp(1rem,2.2vw,1.4rem)', lineHeight: 1.2, color: t.heading }}>{p.title}</h3>
                      <span className="text-xs mt-1 block transition-colors duration-500" style={{ color: t.muted }}>{p.period}</span>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-250"
                    style={{ borderColor: isOpen ? p.accent : t.border, background: isOpen ? p.accent : 'transparent' }}>
                    <span className="text-xl font-light leading-none" style={{ color: isOpen ? '#05090f' : t.muted, marginTop: -2 }}>{isOpen ? '−' : '+'}</span>
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.38, ease: [0.76,0,0.24,1] }} style={{ overflow: 'hidden' }}>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 sm:gap-12 px-6 sm:px-10 pb-8 sm:pb-10 pt-2">
                        <p className="text-sm sm:text-base leading-relaxed transition-colors duration-500" style={{ color: t.subtext }}>{p.body}</p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-4 content-start">
                          {p.items.map((c, j) => (
                            <li key={j} className="flex items-center gap-2 text-sm transition-colors duration-500" style={{ color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(5,9,15,0.65)' }}>
                              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: p.accent }} />{c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Who It's For ────────────────────────────────────────────── */
function WhoFor() {
  const rows = [
    { n: '01', tag: 'Law Student', prob: 'Graduating with theory but nothing real to show for it', outcome: 'A portfolio of 24+ drafted contracts that proves real legal ability — before your first interview.' },
    { n: '02', tag: 'Fresh Graduate', prob: 'The gap between law school and what firms actually need', outcome: 'Bridge it with hands-on drafting and a freelance profile generating income while you job-hunt.' },
    { n: '03', tag: 'Junior Lawyer', prob: 'Stuck in one practice area, dependent on one employer', outcome: 'Build an independent practice — global clients, your hours, your rates.' },
  ];
  return (
    <section id="whofor" style={{ background: '#f0ede8' }}>
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 py-20 sm:py-32">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 sm:mb-20">
          <p className="text-[11px] font-bold uppercase tracking-[0.35em] mb-3" style={{ color: '#FF9C00' }}>Who It's For</p>
          <h2 className="font-black leading-[0.88]" style={{ fontSize: 'clamp(2.8rem,6.5vw,6rem)', letterSpacing: '-0.035em', color: '#05090f' }}>
            Built for the<br /><span style={{ fontFamily: 'var(--app-font-serif)', fontStyle: 'italic' }}>serious ones.</span>
          </h2>
        </motion.div>

        <div style={{ borderTop: '1px solid rgba(5,9,15,0.1)' }}>
          {rows.map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-12 gap-5 sm:gap-8 py-8 sm:py-10 border-b"
              style={{ borderColor: 'rgba(5,9,15,0.1)' }}>
              <div className="sm:col-span-1 flex items-start">
                <span className="font-black" style={{ fontSize: '2.2rem', color: 'rgba(5,9,15,0.07)', lineHeight: 1 }}>{r.n}</span>
              </div>
              <div className="sm:col-span-3 sm:pt-0.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: '#FF9C00' }}>{r.tag}</span>
              </div>
              <div className="sm:col-span-4">
                <p className="text-sm sm:text-[15px] leading-relaxed" style={{ color: 'rgba(5,9,15,0.45)' }}>
                  <span className="font-semibold" style={{ color: 'rgba(5,9,15,0.65)' }}>Problem: </span>{r.prob}
                </p>
              </div>
              <div className="sm:col-span-4">
                <p className="text-sm sm:text-[15px] leading-relaxed font-medium" style={{ color: '#05090f' }}>
                  <span style={{ color: '#FF9C00', fontWeight: 800 }}>→&nbsp;</span>{r.outcome}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-10 sm:mt-14">
          <a href={URL_ENROLL} target="_blank" rel="noreferrer" className="glass-cta" data-testid="whofor-cta">
            <span className="glass-cta-border" />
            Join the Course →
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Why Live ────────────────────────────────────────────────── */
function WhyLive() {
  const { isDark } = useContext(ThemeCtx);
  const t = isDark ? D : L;
  const reasons = [
    { title: 'Real-time feedback on your actual drafts', body: "Experts read your work and tell you what's wrong — live, in front of the class. You learn from your mistakes and from everyone else's simultaneously." },
    { title: 'Ask the practitioner in the room', body: '54 sessions means 54 opportunities to ask "how would a real firm handle this?" and get an honest, experience-backed answer — not a generic one.' },
    { title: 'Accountability recordings never create', body: 'When you are expected on a call, you show up. When you need to draft before the next session, you draft. Passive learners do not finish — cohorts do.' },
    { title: 'Monthly access to the industry', body: 'Professionals join every month. Share your work. Get noticed by people who hire. Build the relationships that open actual doors.' },
  ];
  return (
    <section id="whylive" className="transition-colors duration-500" style={{ background: t.pageBg }}>
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 py-20 sm:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 sm:gap-24">
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:sticky top-24 self-start">
            <p className="text-[11px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: '#FF9C00' }}>Why Live?</p>
            <h2 className="font-black leading-[0.88] mb-7 transition-colors duration-500" style={{ fontSize: 'clamp(2.4rem,5.5vw,4.5rem)', letterSpacing: '-0.03em', color: t.heading }}>
              54 sessions.<br />
              <em style={{ fontFamily: 'var(--app-font-serif)', color: '#FF9C00', fontStyle: 'italic' }}>All live.</em><br />
              No exceptions.
            </h2>
            <p className="text-sm sm:text-base leading-relaxed mb-9 transition-colors duration-500" style={{ color: t.muted, maxWidth: '30ch', lineHeight: 1.75 }}>
              We chose the harder path deliberately. Pre-recorded courses are easy to ship — and easy to forget.
            </p>
            <a href={URL_ENROLL} target="_blank" rel="noreferrer" className="glass-cta" data-testid="whylive-cta">
              <span className="glass-cta-border" />
              Reserve My Seat →
            </a>
          </motion.div>

          <div>
            {reasons.map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group p-7 sm:p-9 transition-colors duration-300 rounded-xl mb-2"
                style={{ background: 'transparent' }}
                onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = t.hoverCard; }}
                onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                <div className="flex gap-5 sm:gap-7">
                  <span className="font-black flex-shrink-0 leading-none transition-colors duration-500" style={{ fontSize: 'clamp(2.2rem,4.5vw,3.2rem)', color: t.numGhost }}>0{i+1}</span>
                  <div>
                    <h3 className="font-bold mb-2 text-sm sm:text-base transition-colors duration-500" style={{ color: t.heading }}>{r.title}</h3>
                    <p className="text-sm leading-relaxed transition-colors duration-500" style={{ color: t.subtext, lineHeight: 1.75 }}>{r.body}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ────────────────────────────────────────────── */
function Testimonials() {
  const { isDark } = useContext(ThemeCtx);
  const t = isDark ? D : L;
  const qs = [
    { q: "Before this course I couldn't distinguish a warranty clause from an indemnity clause. By month two I was redrafting sale deeds for an actual client.", name: "Ananya R.", role: "3rd Year, National Law School" },
    { q: "I got my first Upwork contract during month four. The freelancing sessions were absurdly practical — not the generic advice you find everywhere online.", name: "Siddharth M.", role: "Fresh Graduate, Mumbai" },
    { q: "I've done other drafting workshops. None gave me 54 live sessions. The volume of practice physically changes how you think about contract language.", name: "Priya K.", role: "Junior Associate, Bangalore" },
  ];
  const [i, setI] = useState(0);
  return (
    <section className="transition-colors duration-500" style={{ background: t.midBg, position: 'relative', overflow: 'hidden' }}>
      <div className="absolute -top-6 -left-4 font-serif select-none pointer-events-none" aria-hidden style={{ fontSize: 'clamp(16rem,32vw,28rem)', color: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(5,9,15,0.04)', lineHeight: 1, fontFamily: 'Georgia,serif' }}>"</div>
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 py-20 sm:py-32 relative z-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-14 sm:mb-20 transition-colors duration-500" style={{ color: t.muted }}>From Past Students</p>
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.38 }}>
            <blockquote className="font-black mb-10 sm:mb-14 transition-colors duration-500"
              style={{ fontSize: 'clamp(1.5rem,4vw,3.2rem)', lineHeight: 1.18, letterSpacing: '-0.025em', maxWidth: '22em', color: t.heading }}>
              "{qs[i].q}"
            </blockquote>
            <div>
              <p className="font-semibold transition-colors duration-500" style={{ color: t.heading }}>{qs[i].name}</p>
              <p className="text-sm mt-0.5 transition-colors duration-500" style={{ color: t.muted }}>{qs[i].role}</p>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="flex items-center gap-0 mt-10 sm:mt-14">
          {qs.map((_, j) => (
            <button key={j} onClick={() => setI(j)} aria-label={`Quote ${j+1}`}
              className="flex items-center justify-center transition-all duration-300"
              style={{ minWidth: 44, minHeight: 44, background: 'none', border: 'none', padding: 0 }}>
              <span className="block rounded-full transition-all duration-300"
                style={{ height: 8, width: j === i ? 32 : 8, background: j === i ? '#FF9C00' : (isDark ? 'rgba(255,255,255,0.18)' : 'rgba(5,9,15,0.18)') }} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ─────────────────────────────────────────────────────── */
function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    { q: "Are sessions pre-recorded or live?", a: "100% live. All 54 sessions are conducted live with industry practitioners — real-time Q&A and live feedback on your drafts. This is not a course you buy and forget." },
    { q: "What if I miss a session?", a: "Recordings are available within 24 hours. We strongly encourage live attendance for the interaction, but you won't fall behind if life happens." },
    { q: "How does the money-back guarantee work?", a: "If you attend the initial sessions and feel the course isn't delivering on its promise, we offer a hassle-free refund within the guarantee period. Full details provided at enrollment." },
    { q: "Do I need prior drafting experience?", a: "No. The first two months build your foundation from scratch. You need to be a law student, graduate, or junior lawyer — not an experienced drafter." },
    { q: "Is there placement support?", a: "Yes. Career support, resume reviews, and networking sessions with firms and companies actively looking for contract drafters." },
    { q: "When does the course start?", a: "July 1, 2026 through December 31, 2026. Registration closes June 30, 2026." },
  ];
  return (
    <section id="faq" style={{ background: '#f0ede8' }}>
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 py-20 sm:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 sm:gap-24">
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="lg:col-span-4 lg:sticky top-24 self-start">
            <p className="text-[11px] font-bold uppercase tracking-[0.35em] mb-3" style={{ color: '#FF9C00' }}>FAQ</p>
            <h2 className="font-black leading-[0.88] mb-6" style={{ fontSize: 'clamp(2.2rem,4.5vw,3.8rem)', color: '#05090f', letterSpacing: '-0.03em' }}>
              Questions,<br /><em style={{ fontFamily: 'var(--app-font-serif)', fontStyle: 'italic' }}>answered.</em>
            </h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(5,9,15,0.42)' }}>Still unsure? Visit the course page for complete details and fees.</p>
            <a href={URL_ENROLL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-bold transition-all hover:gap-3" style={{ color: '#FF9C00' }}>
              Course details page
              <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 14, height: 14 }}><path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" /></svg>
            </a>
          </motion.div>

          <div className="lg:col-span-8" style={{ borderTop: '1px solid rgba(5,9,15,0.1)' }}>
            {faqs.map((f, j) => (
              <div key={j} style={{ borderBottom: '1px solid rgba(5,9,15,0.1)' }}>
                <button onClick={() => setOpen(open === j ? null : j)} className="w-full flex items-center justify-between gap-4 py-5 sm:py-6 text-left">
                  <span className="font-semibold text-sm sm:text-base" style={{ color: '#05090f' }}>{f.q}</span>
                  <div className="w-7 h-7 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-200"
                    style={{ background: open === j ? '#FF9C00' : 'transparent', borderColor: open === j ? '#FF9C00' : 'rgba(5,9,15,0.2)' }}>
                    <span className="text-xl font-light leading-none" style={{ color: open === j ? '#05090f' : 'rgba(5,9,15,0.4)', marginTop: -2 }}>{open === j ? '−' : '+'}</span>
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {open === j && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.32, ease: [0.76,0,0.24,1] }} style={{ overflow: 'hidden' }}>
                      <p className="pb-6 text-sm sm:text-[15px] leading-relaxed" style={{ color: 'rgba(5,9,15,0.48)', lineHeight: 1.75 }}>{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Final CTA ───────────────────────────────────────────────── */
function FinalCTA() {
  const cd = useCountdown();
  return (
    <section style={{ background: '#FF9C00', position: 'relative', overflow: 'hidden' }}>
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 pt-16 sm:pt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 sm:gap-20 items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-black leading-[0.86] mb-9 sm:mb-11" style={{ fontSize: 'clamp(4rem,11vw,9.5rem)', color: '#05090f', letterSpacing: '-0.04em' }}>
              Stop<br />
              <em style={{ fontFamily: 'var(--app-font-serif)', fontStyle: 'italic' }}>waiting.</em><br />
              Start<br />drafting.
            </h2>
            <a href={URL_ENROLL} target="_blank" rel="noreferrer"
              className="btn-shine inline-flex items-center gap-2.5 rounded-full font-bold text-base sm:text-lg transition-all duration-200 hover:scale-[1.03]"
              style={{ background: '#05090f', color: 'white', padding: '0.9rem 2.4rem', boxShadow: '0 14px 40px rgba(5,9,15,0.35)' }}
              data-testid="cta-enroll">
              Enroll Before June 30
              <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 17, height: 17 }}><path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" /></svg>
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.12 }}
            className="space-y-3 sm:space-y-4">
            <div className="rounded-2xl p-5 sm:p-7" style={{ background: 'rgba(5,9,15,0.1)', border: '1px solid rgba(5,9,15,0.1)' }}>
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] mb-5" style={{ color: 'rgba(5,9,15,0.4)' }}>Registration closes in</p>
              <div className="flex gap-1 sm:gap-2">
                {[{v:cd.D,l:'Days'},{v:cd.H,l:'Hrs'},{v:cd.M,l:'Min'},{v:cd.S,l:'Sec'}].map(({v,l},idx) => (
                  <div key={idx} className="flex gap-1 sm:gap-2 items-center">
                    {idx > 0 && <span style={{ color: 'rgba(5,9,15,0.2)', fontSize: '1.3rem', fontWeight: 100 }}>:</span>}
                    <div className="text-center">
                      <span className="block font-black tabular-nums leading-none" style={{ fontSize: 'clamp(1.6rem,4vw,2.5rem)', color: '#05090f' }}>{String(v).padStart(2,'0')}</span>
                      <span className="text-[8px] uppercase tracking-[0.15em]" style={{ color: 'rgba(5,9,15,0.38)' }}>{l}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-5 sm:p-6 space-y-2.5" style={{ background: 'rgba(5,9,15,0.07)' }}>
              {['Money-back guarantee', '54 live sessions with practitioners', 'Career & placement support included', 'Cohort community access'].map((item, k) => (
                <div key={k} className="flex items-center gap-2.5 text-sm font-medium" style={{ color: 'rgba(5,9,15,0.62)' }}>
                  <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 14, height: 14, color: '#05090f', flexShrink: 0 }}><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <Marquee orange />
      </div>
    </section>
  );
}

/* ─── Footer ──────────────────────────────────────────────────── */
function Footer() {
  const { isDark } = useContext(ThemeCtx);
  const t = isDark ? D : L;
  return (
    <footer className="transition-colors duration-500" style={{ background: t.pageBg, borderTop: `1px solid ${t.border}` }}>
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 py-10 sm:py-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img src="/lawctopus-logo.png" alt="Lawctopus" style={{ height: 22, filter: t.logoFilter }} />
          <span className="text-xs transition-colors duration-500" style={{ color: t.muted }}>Law School</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 text-xs transition-colors duration-500" style={{ color: t.muted }}>
          <a href={URL_ENROLL} target="_blank" rel="noreferrer" className="hover:text-[#FF9C00] transition-colors">Course Details</a>
          <a href="https://www.lawctopus.com" target="_blank" rel="noreferrer" className="hover:text-[#FF9C00] transition-colors">Lawctopus.com</a>
          <span>© 2026 Lawctopus. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

/* ─── Home (root) ─────────────────────────────────────────────── */
export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const toggleTheme = () => setIsDark(v => !v);

  return (
    <ThemeCtx.Provider value={{ isDark, toggleTheme }}>
      <AnimatePresence>{!loaded && <Loader done={() => setLoaded(true)} />}</AnimatePresence>
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Statement54 />
        <Stats />
        <Curriculum />
        <WhoFor />
        <WhyLive />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </ThemeCtx.Provider>
  );
}
