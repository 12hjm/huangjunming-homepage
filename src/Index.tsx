import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import beihaiHer from "./assets/life/beihai-her.jpg";
import beihaiHim from "./assets/life/beihai-him.jpg";
import beihaiSea from "./assets/life/beihai-sea.jpg";
import nl2sqlPage01 from "./assets/competition/ppt-pages/nl2sql-page-01.png";
import nl2sqlPage02 from "./assets/competition/ppt-pages/nl2sql-page-02.png";
import nl2sqlPage03 from "./assets/competition/ppt-pages/nl2sql-page-03.png";
import nl2sqlPage04 from "./assets/competition/ppt-pages/nl2sql-page-04.png";
import competitionCertificate from "./assets/life/competition-certificate.jpg";
import competitionStage from "./assets/life/competition-stage.jpg";
import fitness01 from "./assets/life/fitness-01.jpg";
import fitness02 from "./assets/life/fitness-02.jpg";
import fitness03 from "./assets/life/fitness-03.jpg";
import friends01 from "./assets/life/friends-01.jpg";
import friends02 from "./assets/life/friends-02.jpg";
import friends03 from "./assets/life/friends-03.jpg";
import special01 from "./assets/life/special-01.jpg";
import special02 from "./assets/life/special-02.jpg";

const hlsSource =
  "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8";

const loadingWords = ["Diagnose", "Automate", "Assist"];

type Language = "en" | "zh";

const copy = {
  en: {
    nav: { home: "Home", work: "Work", contact: "Contact", sayHi: "Say hi" },
    hero: {
      eyebrow: "SHENZHEN / AGENTS / LLM",
      name: "Huang Junming",
      prefix: "A",
      suffix: "from UESTC.",
      roles: ["Agent Developer", "LLM Builder", "SRE Thinker", "Happy Maker"],
      body:
        "Shenzhen does not fear a crooked shadow. I build agent systems and LLM applications with a calm mind, sharp tools, and a little laughter.",
      primary: "See Archive",
      secondary: "Reach out...",
      scroll: "SCROLL",
    },
    archive: {
      kicker: "Life Archive",
      titleA: "Fragments",
      titleAccent: "outside",
      titleB: "the terminal",
      intro: "Sea wind, friends, fitness, a soft chapter, and proof under pressure.",
      button: "Stay a little",
      travelKicker: "Beihai / Travel",
      travelTitle: "Sea wind,\nblue light.",
      travelBody: "Sea wind, blue light, and a quiet kind of freedom.",
      friendsKicker: "Friends",
      friendsTitle: "Louder ordinary days",
      friendsBody: "The people who make ordinary days louder.",
      fitnessKicker: "Fitness",
      fitnessLabels: ["Shadow Work", "Daily Proof", "Lighter Mood"],
      specialKicker: "Someone Special",
      specialTitle: "Kept simple",
      specialBody: "A soft chapter I would rather keep simple.",
      competitionKicker: "Competition Experience",
      competitionTitle: "NL2SQL Assistant",
      competitionBody: "Award photos and presentation pages drift together in one quiet carousel.",
      competitionSlides: "Competition Carousel",
    },
    footer: {
      kicker: "Contact",
      title: "Open to useful ideas, serious builds, and unserious jokes.",
    },
  },
  zh: {
    nav: { home: "首页", work: "档案", contact: "联系", sayHi: "打个招呼" },
    hero: {
      eyebrow: "深圳 / 智能体 / 大模型应用",
      name: "黄俊铭",
      prefix: "一个",
      suffix: "电子科技大学毕业生。",
      roles: ["Agent 开发者", "大模型应用开发者", "SRE 思考者", "嘻嘻哈哈的人"],
      body:
        "深圳不怕影子斜。我喜欢把 Agent 系统和大模型应用做得清晰、可靠，也保留一点轻松的幽默感。",
      primary: "查看生活档案",
      secondary: "联系我...",
      scroll: "向下",
    },
    archive: {
      kicker: "生活档案",
      titleA: "终端之外的",
      titleAccent: "片段",
      titleB: "与现场",
      intro: "海风、朋友、健身、柔软章节，以及压力之下的一点证明。",
      button: "再看一会",
      travelKicker: "北海 / 旅行",
      travelTitle: "海风，\n蓝光。",
      travelBody: "海风、蓝色光线，还有一种安静的自由。",
      friendsKicker: "好朋友",
      friendsTitle: "普通日子热闹一点",
      friendsBody: "让普通日子变得更响亮的人。",
      fitnessKicker: "健身",
      fitnessLabels: ["暗处训练", "日常证明", "轻松一点"],
      specialKicker: "特别的人",
      specialTitle: "简单保留",
      specialBody: "柔软的一章，简单一点就很好。",
      competitionKicker: "竞赛经历",
      competitionTitle: "NL2SQL 智能助手",
      competitionBody: "获奖照片和四页 PPT 放在同一个轮播里，像朋友栏一样横向滚动。",
      competitionSlides: "竞赛轮播",
    },
    footer: {
      kicker: "联系",
      title: "欢迎聊有用的想法、认真的项目，也欢迎不太正经的玩笑。",
    },
  },
} as const;

const friendPhotos = [friends01, friends02, friends03];
const fitnessPhotos = [fitness03, fitness02, fitness01];
const competitionSlides = [
  { image: competitionCertificate, label: "Competition certificate" },
  { image: competitionStage, label: "Competition award ceremony" },
  { image: nl2sqlPage01, label: "NL2SQL presentation page 1" },
  { image: nl2sqlPage02, label: "NL2SQL presentation page 2" },
  { image: nl2sqlPage03, label: "NL2SQL presentation page 3" },
  { image: nl2sqlPage04, label: "NL2SQL presentation page 4" },
];

type LoadingScreenProps = {
  onComplete: () => void;
};

function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const completedRef = useRef(false);

  useEffect(() => {
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / 2700, 1);
      const nextCount = Math.round(progress * 100);
      setCount(nextCount);

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else if (!completedRef.current) {
        completedRef.current = true;
        window.setTimeout(onComplete, 400);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [onComplete]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setWordIndex((current) => (current + 1) % loadingWords.length);
    }, 900);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-bg"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <motion.div
        className="absolute left-6 top-6 text-xs uppercase tracking-[0.3em] text-muted md:left-10 md:top-10"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        Personal Site
      </motion.div>

      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={loadingWords[wordIndex]}
            className="font-display text-4xl italic text-text-primary/80 md:text-6xl lg:text-7xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {loadingWords[wordIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-8 right-6 font-display text-6xl tabular-nums text-text-primary md:bottom-10 md:right-10 md:text-8xl lg:text-9xl">
        {String(count).padStart(3, "0")}
      </div>

      <div className="absolute bottom-0 left-0 h-[3px] w-full bg-stroke/50">
        <div
          className="accent-gradient h-full origin-left"
          style={{
            transform: `scaleX(${count / 100})`,
            boxShadow: "0 0 8px rgba(137, 170, 204, 0.35)",
          }}
        />
      </div>
    </motion.div>
  );
}

type LocalizedProps = {
  lang: Language;
};

type AutoCarouselProps = {
  ariaLabel: string;
  children: ReactNode;
  className?: string;
};

function AutoCarousel({ ariaLabel, children, className = "" }: AutoCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);
  const scrollPositionRef = useRef(0);
  const resumeAtRef = useRef(0);

  useEffect(() => {
    let frame = 0;
    let lastTime = performance.now();
    const speed = 12;

    const tick = (now: number) => {
      const scroller = scrollerRef.current;
      const delta = Math.min(now - lastTime, 40) / 1000;
      lastTime = now;

      if (scroller && !isDraggingRef.current && now >= resumeAtRef.current) {
        const loopWidth = scroller.scrollWidth / 2;
        scrollPositionRef.current += speed * delta;

        if (loopWidth > 0 && scrollPositionRef.current >= loopWidth) {
          scrollPositionRef.current -= loopWidth;
        }

        scroller.scrollLeft = scrollPositionRef.current;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const normalizeScroll = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const loopWidth = scroller.scrollWidth / 2;
    if (loopWidth <= 0) return;

    if (scroller.scrollLeft >= loopWidth) {
      scroller.scrollLeft -= loopWidth;
    } else if (scroller.scrollLeft <= 0) {
      scroller.scrollLeft += loopWidth;
    }

    scrollPositionRef.current = scroller.scrollLeft;
  };

  return (
    <div
      ref={scrollerRef}
      aria-label={ariaLabel}
      className={`auto-carousel ${className}`}
      onPointerDown={(event) => {
        const scroller = scrollerRef.current;
        if (!scroller) return;
        if (event.pointerType === "mouse" && event.button !== 0) return;

        isDraggingRef.current = true;
        dragStartXRef.current = event.clientX;
        dragStartScrollRef.current = scroller.scrollLeft;
        scrollPositionRef.current = scroller.scrollLeft;
        resumeAtRef.current = Number.POSITIVE_INFINITY;
        scroller.setPointerCapture(event.pointerId);
        scroller.classList.add("is-dragging");
      }}
      onPointerMove={(event) => {
        const scroller = scrollerRef.current;
        if (!scroller || !isDraggingRef.current) return;

        event.preventDefault();
        scroller.scrollLeft = dragStartScrollRef.current - (event.clientX - dragStartXRef.current);
        normalizeScroll();
        scrollPositionRef.current = scroller.scrollLeft;
      }}
      onPointerUp={(event) => {
        const scroller = scrollerRef.current;
        if (!scroller) return;

        isDraggingRef.current = false;
        resumeAtRef.current = performance.now() + 700;
        scroller.classList.remove("is-dragging");
        if (scroller.hasPointerCapture(event.pointerId)) {
          scroller.releasePointerCapture(event.pointerId);
        }
        normalizeScroll();
      }}
      onPointerCancel={(event) => {
        const scroller = scrollerRef.current;
        isDraggingRef.current = false;
        resumeAtRef.current = performance.now() + 700;
        scroller?.classList.remove("is-dragging");
        if (scroller?.hasPointerCapture(event.pointerId)) {
          scroller.releasePointerCapture(event.pointerId);
        }
      }}
    >
      <div className="auto-carousel-track">{children}</div>
    </div>
  );
}

function Navbar({
  lang,
  onToggleLanguage,
}: LocalizedProps & { onToggleLanguage: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const t = copy[lang];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 flex justify-center px-4 pt-4 md:pt-6">
      <div
        className={`inline-flex max-w-full items-center rounded-full border border-white/10 bg-surface px-2 py-2 backdrop-blur-md transition-shadow duration-300 ${
          scrolled ? "shadow-md shadow-black/10" : ""
        }`}
      >
        <a
          href="#home"
          aria-label="Huang Junming home"
          className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-full p-[2px] transition-transform duration-300 hover:scale-110"
        >
          <span className="logo-gradient absolute h-9 w-9 rounded-full" />
          <span className="relative flex h-[32px] w-[32px] items-center justify-center rounded-full bg-bg font-display text-[13px] italic text-text-primary">
            HJ
          </span>
        </a>
        <div className="mx-1 hidden h-5 w-px bg-stroke sm:block" />
        <div className="flex items-center">
          {[
            { label: t.nav.home, href: "#home", active: true },
            { label: t.nav.work, href: "#work", active: false },
            { label: t.nav.contact, href: "#resume", active: false },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`rounded-full px-3 py-1.5 text-xs transition-colors duration-300 sm:px-4 sm:py-2 sm:text-sm ${
                item.active
                  ? "bg-stroke/50 text-text-primary"
                  : "text-muted hover:bg-stroke/50 hover:text-text-primary"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
        <button
          type="button"
          onClick={onToggleLanguage}
          className="mx-1 rounded-full px-3 py-1.5 text-xs text-muted transition-colors duration-300 hover:bg-stroke/50 hover:text-text-primary sm:px-4 sm:py-2 sm:text-sm"
          aria-label={lang === "en" ? "Switch to Chinese" : "切换到英文"}
        >
          {lang === "en" ? "中文" : "EN"}
        </button>
        <div className="mx-1 hidden h-5 w-px bg-stroke sm:block" />
        <a
          href="mailto:2309501679@qq.com"
          className="group relative rounded-full p-[2px] text-xs transition-transform duration-300 hover:scale-105 sm:text-sm"
        >
          <span className="animated-gradient-border absolute -inset-[2px] rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="relative flex items-center gap-1 rounded-full bg-surface px-3 py-1.5 text-text-primary backdrop-blur-md sm:px-4 sm:py-2">
            {t.nav.sayHi} <span aria-hidden="true">-&gt;</span>
          </span>
        </a>
      </div>
    </nav>
  );
}

function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | undefined;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(hlsSource);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = hlsSource;
    }

    return () => hls?.destroy();
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        className="absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg to-transparent" />
    </>
  );
}

function Hero({ lang }: LocalizedProps) {
  const [roleIndex, setRoleIndex] = useState(0);
  const t = copy[lang];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRoleIndex((current) => (current + 1) % t.hero.roles.length);
    }, 2000);

    return () => window.clearInterval(timer);
  }, [t.hero.roles.length]);

  useEffect(() => {
    setRoleIndex(0);
  }, [lang]);

  useEffect(() => {
    const context = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(
          ".name-reveal",
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1.2, delay: 0.1 },
        )
        .fromTo(
          ".blur-in",
          { opacity: 0, filter: "blur(10px)", y: 20 },
          {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            duration: 1,
            stagger: 0.1,
            delay: 0.3,
          },
          0,
        );
    });

    return () => context.revert();
  }, []);

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-24 text-center"
    >
      <BackgroundVideo />
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center">
        <p className="blur-in mb-8 text-xs uppercase tracking-[0.3em] text-muted">
          {t.hero.eyebrow}
        </p>
        <h1 className="name-reveal mb-6 font-display text-6xl italic leading-[0.9] tracking-tight text-text-primary md:text-8xl lg:text-9xl">
          {t.hero.name}
        </h1>
        <p className="blur-in mb-5 text-lg text-text-primary/85 md:text-xl">
          {t.hero.prefix}{" "}
          <span
            key={roleIndex}
            className="inline-block animate-role-fade-in font-display italic text-text-primary"
          >
            {t.hero.roles[roleIndex]}
          </span>{" "}
          {t.hero.suffix}
        </p>
        <p className="blur-in mb-12 max-w-md text-sm leading-7 text-muted md:text-base">
          {t.hero.body}
        </p>
        <div className="blur-in inline-flex flex-wrap justify-center gap-4">
          <a
            href="#work"
            className="group relative rounded-full p-[2px] text-sm transition-transform duration-300 hover:scale-105"
          >
            <span className="animated-gradient-border absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="relative block rounded-full bg-text-primary px-7 py-3.5 text-bg transition-colors duration-300 group-hover:bg-bg group-hover:text-text-primary">
              {t.hero.primary}
            </span>
          </a>
          <a
            href="mailto:2309501679@qq.com"
            className="group relative rounded-full p-[2px] text-sm transition-transform duration-300 hover:scale-105"
          >
            <span className="animated-gradient-border absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="relative block rounded-full border-2 border-stroke bg-bg px-7 py-3.5 text-text-primary transition-colors duration-300 group-hover:border-transparent">
              {t.hero.secondary}
            </span>
          </a>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3">
        <span className="text-xs uppercase tracking-[0.2em] text-muted">{t.hero.scroll}</span>
        <span className="relative h-10 w-px overflow-hidden bg-stroke">
          <span className="accent-gradient absolute left-0 top-0 h-1/2 w-px animate-scroll-down" />
        </span>
      </div>
    </section>
  );
}

function GradientButton({ children }: { children: string }) {
  return (
    <a
      href="#work"
      className="group relative hidden rounded-full p-[2px] text-sm transition-transform duration-300 hover:scale-105 md:inline-flex"
    >
      <span className="animated-gradient-border absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <span className="relative rounded-full bg-bg px-5 py-3 text-text-primary">
        {children} <span aria-hidden="true">-&gt;</span>
      </span>
    </a>
  );
}

function SelectedWorks({ lang }: LocalizedProps) {
  const t = copy[lang];

  return (
    <section id="work" className="bg-bg py-12 md:py-20">
      <div className="mx-auto max-w-[1380px] px-5 md:px-8 lg:px-12">
        <motion.div
          className="mb-10 flex flex-col gap-8 md:mb-12 md:flex-row md:items-end md:justify-between"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div>
            <div className="mb-5 flex items-center gap-4">
              <span className="h-px w-8 bg-stroke" />
              <span className="text-xs uppercase tracking-[0.3em] text-muted">
                {t.archive.kicker}
              </span>
            </div>
            <h2 className="mb-4 text-4xl font-medium leading-tight text-text-primary md:text-6xl">
              {t.archive.titleA}{" "}
              <span className="font-display italic text-text-primary">{t.archive.titleAccent}</span>
              <br className="hidden md:block" /> {t.archive.titleB}
            </h2>
            <p className="max-w-md text-sm leading-7 text-muted md:text-base">
              {t.archive.intro}
            </p>
          </div>
          <GradientButton>{t.archive.button}</GradientButton>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-6">
          <motion.article
            className="archive-panel relative overflow-hidden rounded-[8px] bg-surface/70 p-3 md:col-span-12 md:p-6"
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.08, ease: [0.25, 0.1, 0.25, 1] }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <div className="absolute inset-0 opacity-45">
              <img src={beihaiSea} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/30" />
            </div>
            <div className="relative">
              <div className="mb-6 flex flex-col justify-between gap-4 p-2 md:flex-row md:items-end md:p-4">
                <div>
                <div className="mb-5 flex items-center gap-4">
                  <span className="h-px w-8 bg-stroke" />
                  <span className="text-xs uppercase tracking-[0.3em] text-text-primary/65">
                    {t.archive.travelKicker}
                  </span>
                </div>
                <h3 className="font-display text-5xl italic leading-none text-text-primary md:text-7xl">
                  {t.archive.travelTitle.split("\n")[0]}
                  <br /> {t.archive.travelTitle.split("\n")[1]}
                </h3>
                </div>
                <p className="mt-6 max-w-sm text-sm leading-7 text-text-primary/70">
                  {t.archive.travelBody}
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
              {[beihaiHim, beihaiHer].map((image, index) => (
                <motion.div
                  key={image}
                  className="project-card group overflow-hidden rounded-[8px] bg-black/20 p-1.5"
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.35 }}
                >
                  <img
                    src={image}
                    alt={index === 0 ? "Beihai portrait" : "Beihai companion portrait"}
                    className="archive-photo aspect-[1991/1141] h-full w-full rounded-[6px] object-contain"
                  />
                </motion.div>
              ))}
              </div>
            </div>
          </motion.article>

          <motion.article
            className="archive-panel overflow-hidden rounded-[8px] bg-surface/70 py-6 md:col-span-12"
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.08, ease: [0.25, 0.1, 0.25, 1] }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <div className="mb-5 flex items-center justify-between px-6">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted">{t.archive.friendsKicker}</p>
                <h3 className="mt-2 font-display text-4xl italic leading-none text-text-primary">
                  {t.archive.friendsTitle}
                </h3>
              </div>
              <p className="hidden max-w-xs text-right text-sm leading-7 text-muted md:block">
                {t.archive.friendsBody}
              </p>
            </div>
            <AutoCarousel ariaLabel={t.archive.friendsKicker} className="px-6">
              {[...friendPhotos, ...friendPhotos].map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="project-card group relative h-72 w-[430px] shrink-0 overflow-hidden rounded-[8px] bg-black/20"
                >
                  <img
                    src={image}
                    alt="Friends archive"
                    className="archive-photo h-full w-full object-contain"
                    draggable={false}
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-[8px] border border-white/0 transition-colors duration-300 group-hover:border-white/25" />
                </div>
              ))}
            </AutoCarousel>
          </motion.article>

          <motion.article
            className="archive-panel rounded-[8px] bg-surface/70 p-5 md:col-span-12"
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.08, ease: [0.25, 0.1, 0.25, 1] }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted">{t.archive.fitnessKicker}</p>
                <h3 className="mt-2 font-display text-5xl italic leading-none text-text-primary md:text-6xl">
                  {t.archive.fitnessLabels[1]}
                </h3>
              </div>
              <p className="max-w-xs text-sm leading-7 text-muted">
                Discipline, but with better lighting.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_1.35fr_1fr] md:items-stretch">
              {fitnessPhotos.map((image, index) => (
                <motion.div
                  key={t.archive.fitnessLabels[index]}
                  className={`project-card group overflow-hidden rounded-[8px] bg-black/25 p-2 ${
                    index === 1 ? "md:scale-[1.03]" : ""
                  }`}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="flex min-h-[360px] items-center justify-center md:min-h-[520px]">
                    <img
                      src={image}
                      alt={t.archive.fitnessLabels[index]}
                      className="archive-photo max-h-[500px] w-full rounded-[6px] object-contain"
                    />
                  </div>
                  <div className="px-3 pb-3 pt-2">
                  <p className="mb-3 text-xs uppercase tracking-[0.2em] text-text-primary/60">
                    {t.archive.fitnessKicker}
                  </p>
                  <h3 className="font-display text-3xl italic leading-none text-text-primary">
                    {t.archive.fitnessLabels[index]}
                  </h3>
                </div>
                </motion.div>
              ))}
            </div>
          </motion.article>

          <motion.article
            className="archive-panel rounded-[8px] bg-surface/70 p-5 md:col-span-12"
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.08, ease: [0.25, 0.1, 0.25, 1] }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted">{t.archive.specialKicker}</p>
                <h3 className="mt-2 font-display text-4xl italic leading-none text-text-primary">
                  {t.archive.specialTitle}
                </h3>
              </div>
              <span className="text-text-primary/60" aria-hidden="true">
                -&gt;
              </span>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {[special01, special02].map((image, index) => (
                <motion.div
                  key={image}
                  className="project-card overflow-hidden rounded-[8px] bg-black/25 p-2"
                  whileHover={{ y: index === 0 ? -6 : 6, rotate: index === 0 ? -1 : 1 }}
                  transition={{ duration: 0.35 }}
                >
                  <img
                    src={image}
                    alt="Someone special"
                    className="archive-photo max-h-[720px] w-full rounded-[6px] object-contain"
                  />
                </motion.div>
              ))}
            </div>
            <p className="mt-5 text-sm leading-7 text-muted">
              {t.archive.specialBody}
            </p>
          </motion.article>

          <motion.article
            className="competition-showcase archive-panel scroll-mt-28 overflow-hidden rounded-[8px] bg-surface/70 py-6 md:col-span-12 md:py-8"
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.08, ease: [0.25, 0.1, 0.25, 1] }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <div className="mb-7 flex flex-col justify-between gap-5 px-6 md:flex-row md:items-end md:px-8">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted">
                  {t.archive.competitionKicker}
                </p>
                <h3 className="mt-2 font-display text-4xl italic leading-none text-text-primary md:text-6xl">
                  {t.archive.competitionTitle}
                </h3>
              </div>
              <p className="max-w-sm text-sm leading-7 text-muted md:text-right">
                {t.archive.competitionBody}
              </p>
            </div>

            <div className="mb-5 flex items-center justify-between px-6 md:px-8">
              <p className="text-xs uppercase tracking-[0.3em] text-muted">
                {t.archive.competitionSlides}
              </p>
              <span className="text-text-primary/55" aria-hidden="true">
                -&gt;
              </span>
            </div>

            <AutoCarousel ariaLabel={t.archive.competitionSlides} className="px-6 md:px-8">
              {[...competitionSlides, ...competitionSlides].map((item, index) => (
                <motion.figure
                  key={`${item.image}-${index}`}
                  className="competition-slide-card project-card shrink-0 overflow-hidden rounded-[8px]"
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.35 }}
                >
                  <img
                    src={item.image}
                    alt={item.label}
                    className="archive-photo h-full w-auto rounded-[8px] object-contain"
                    draggable={false}
                  />
                </motion.figure>
              ))}
            </AutoCarousel>
          </motion.article>
        </div>
      </div>
    </section>
  );
}

function ResumeFooter({ lang }: LocalizedProps) {
  const t = copy[lang];

  return (
    <section id="resume" className="border-t border-stroke bg-bg px-6 py-16 md:px-10">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-muted">{t.footer.kicker}</p>
          <h2 className="font-display text-4xl italic leading-tight text-text-primary md:text-6xl">
            {t.footer.title}
          </h2>
        </div>
        <a
          href="mailto:2309501679@qq.com"
          className="group relative w-fit rounded-full p-[2px] text-sm transition-transform duration-300 hover:scale-105"
        >
          <span className="animated-gradient-border absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="relative block rounded-full bg-text-primary px-7 py-3.5 text-bg transition-colors duration-300 group-hover:bg-bg group-hover:text-text-primary">
            2309501679@qq.com
          </span>
        </a>
      </div>
    </section>
  );
}

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [lang, setLang] = useState<Language>("en");
  const [previewImage, setPreviewImage] = useState<{ alt: string; src: string } | null>(null);

  useEffect(() => {
    if (!previewImage) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPreviewImage(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [previewImage]);

  const handleImageDoubleClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target;

    if (!(target instanceof HTMLImageElement)) return;

    setPreviewImage({
      alt: target.alt || "Preview image",
      src: target.currentSrc || target.src,
    });
  };

  return (
    <div
      data-lang={lang}
      className="min-h-screen bg-bg text-text-primary"
      onDoubleClick={handleImageDoubleClick}
    >
      <AnimatePresence>{isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}</AnimatePresence>
      <Navbar lang={lang} onToggleLanguage={() => setLang((current) => (current === "en" ? "zh" : "en"))} />
      <main>
        <Hero lang={lang} />
        <SelectedWorks lang={lang} />
        <ResumeFooter lang={lang} />
      </main>
      <AnimatePresence>
        {previewImage && (
          <motion.div
            className="image-preview fixed inset-0 z-[10000] flex items-center justify-center bg-black/88 p-4 backdrop-blur-md md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            role="dialog"
            aria-modal="true"
            aria-label={previewImage.alt}
            onClick={() => setPreviewImage(null)}
          >
            <button
              type="button"
              className="absolute right-5 top-5 rounded-full bg-white/10 px-4 py-2 text-sm text-text-primary backdrop-blur-md transition-colors duration-300 hover:bg-white/18"
              onClick={() => setPreviewImage(null)}
              aria-label="Close image preview"
            >
              Close
            </button>
            <motion.img
              src={previewImage.src}
              alt={previewImage.alt}
              className="max-h-[88vh] max-w-[94vw] rounded-[8px] object-contain shadow-2xl shadow-black/60"
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
              onClick={(event) => event.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
