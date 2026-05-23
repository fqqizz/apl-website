"use client";

import { FormEvent, type MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, type Transition, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import Lenis from "@studio-freight/lenis";
import { load } from "@cashfreepayments/cashfree-js";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  CreditCard,
  Download,
  Lock,
  Mail,
  Menu,
  Pause,
  Play,
  Send,
  Upload,
  X,
  AlertCircle
} from "lucide-react";
import { uploadPlayerPhoto, uploadPlayerID, uploadFranchiseLogo } from "@/lib/uploads";
import { insertPlayer, insertFranchise } from "@/lib/database";
import { savePendingPlayerRegistration } from "@/lib/pendingRegistration";

const navItems = ["Home", "About", "Franchises", "Players", "Media", "Contact"];
const transition: Transition = { duration: 0.76, ease: [0.22, 1, 0.36, 1] };

const reveal = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 }
};

type ErrorMap = Record<string, string>;
type PaymentState = "idle" | "checkout" | "success" | "failed";

function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <p className={`eyebrow ${light ? "text-white/58" : ""}`}>{children}</p>;
}

function AnimatedBlock({
  children,
  className = "",
  delay = 0
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ ...transition, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ImagePanel({
  src,
  label,
  className = "",
  priority = false
}: {
  src: string;
  label: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`image-panel group ${className}`}>
      <img src={src} alt={label} loading={priority ? "eager" : "lazy"} className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/8 to-transparent" />
      <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-5 text-white">
        <span className="text-xs font-medium uppercase tracking-[0.22em] text-white/78">{label}</span>
        <ArrowUpRight size={17} className="opacity-70 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </div>
  );
}

export default function HomeExperience() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.26], [0, 92]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.24], [1, 0.58]);

  const navHref = (item: string) => (item === "Home" ? "#home" : `#${item.toLowerCase()}`);

  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, item: string) => {
    event.preventDefault();
    const sectionId = item === "Home" ? "home" : item.toLowerCase();
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMenuOpen(false);
  };

  const heroDust = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => ({
        id: index,
        left: `${7 + ((index * 31) % 86)}%`,
        top: `${18 + ((index * 23) % 58)}%`,
        delay: index * 0.32
      })),
    []
  );

  useEffect(() => {
    const timer = window.setTimeout(() => setIntroComplete(true), 2300);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (!logoRef.current) return;
    const logoTween = gsap.to(logoRef.current, {
      y: -9,
      duration: 4.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    return () => {
      logoTween.kill();
    };
  }, []);

  const toggleAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.volume = 0.24;
      await audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <main className="overflow-hidden bg-paper text-ink">
      <div className="grain" />
      <audio ref={audioRef} src="/the-sovereign-pitch.mp3" loop preload="none" />

      <AnimatePresence>
        {!introComplete && (
          <motion.div
            className="fixed inset-0 z-[80] grid place-items-center bg-white"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.78, ease: [0.22, 1, 0.36, 1] } }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="grid place-items-center"
            >
              <motion.img
                src="/apl-logo.png"
                alt="APL logo"
                className="h-28 w-auto md:h-36"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="mt-8 h-px w-32 overflow-hidden rounded-full bg-ink/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="h-full bg-apex"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1.7, ease: [0.22, 1, 0.36, 1] }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="fixed left-0 right-0 top-3 z-50 px-3 md:top-5">
        <nav className="mx-auto flex w-full max-w-5xl items-center justify-between rounded-full border border-ink/10 bg-white/70 px-3 py-2 shadow-glass backdrop-blur-2xl">
          <a href="#home" onClick={(event) => handleNavClick(event, "Home")} aria-label="APEX PREMIERE LEAGUE home" className="rounded-full px-2 py-1.5">
            <img src="/apl-logo.png" alt="APL logo" className="h-9 w-auto md:h-10" />
          </a>
          <div className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <a key={item} href={navHref(item)} onClick={(event) => handleNavClick(event, item)} className="nav-link">
                {item}
              </a>
            ))}
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <a href="#players" onClick={(event) => handleNavClick(event, "Players")} className="rounded-full bg-ink px-5 py-3 text-xs font-medium uppercase tracking-[0.12em] text-white transition hover:scale-[1.02] hover:bg-apex">
              Register
            </a>
          </div>
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
            className="grid size-11 place-items-center rounded-full border border-ink/10 bg-white text-ink md:hidden"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={transition}
              className="mx-auto mt-2 w-full max-w-5xl rounded-[1.65rem] border border-ink/10 bg-white/88 p-3 shadow-glass backdrop-blur-2xl md:hidden"
            >
              {navItems.map((item) => (
                <a
                  key={item}
                  href={navHref(item)}
                  onClick={(event) => {
                    handleNavClick(event, item);
                  }}
                  className="block rounded-2xl px-4 py-4 text-sm font-medium uppercase tracking-[0.14em] text-ink/70"
                >
                  {item}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <button
        aria-label={isPlaying ? "Pause soundtrack" : "Play soundtrack"}
        onClick={toggleAudio}
        className="fixed bottom-4 left-4 z-50 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/78 px-3 py-2 text-xs font-medium uppercase tracking-[0.14em] text-ink shadow-glass backdrop-blur-xl transition hover:scale-[1.03] md:bottom-6 md:left-6"
      >
        {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        Sound {isPlaying ? "On" : "Off"}
      </button>

      <section id="home" className="relative min-h-screen overflow-hidden px-4 pb-12 pt-28 md:px-8 md:pt-36">
        <div className="absolute inset-0 bg-[url('/media-white-ball.jpeg')] bg-[length:1200px_auto] bg-center opacity-[0.16] grayscale" />
        <div className="absolute inset-x-4 bottom-5 top-24 rounded-[2rem] bg-white/60 shadow-[0_30px_120px_rgba(17,17,17,0.08)] md:inset-x-8 md:rounded-[3rem]" />
        {heroDust.map((particle) => (
          <motion.span
            key={particle.id}
            className="absolute z-0 size-1 rounded-full bg-ink/12"
            style={{ left: particle.left, top: particle.top }}
            animate={{ y: [0, -12, 0], opacity: [0.05, 0.22, 0.05] }}
            transition={{ duration: 5.8, repeat: Infinity, delay: particle.delay }}
          />
        ))}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-6xl flex-col items-center justify-center text-center"
        >
          <div ref={logoRef} className="mb-7 grid place-items-center">
            <img src="/apl-logo.png" alt="APEX PREMIERE LEAGUE logo" className="h-36 w-auto md:h-52" />
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition}
            className="display max-w-5xl text-[clamp(3.2rem,11vw,10rem)]"
          >
            APEX PREMIERE LEAGUE
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: 0.16 }}
            className="mt-7 flex flex-wrap items-center justify-center gap-3 text-xs font-medium uppercase tracking-[0.28em] text-ink/54"
          >
            <span>Season 1</span>
            <span className="h-px w-10 bg-ink/20" />
            <span>Rise Above.</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: 0.28 }}
            className="mt-10 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center"
          >
            <a href="#players" className="rounded-full bg-ink px-7 py-4 text-sm font-medium text-white transition hover:scale-[1.025] hover:bg-apex">
              I Am A Player
            </a>
            <a href="#franchises" className="rounded-full border border-ink/18 bg-white/68 px-7 py-4 text-sm font-medium text-ink transition hover:scale-[1.025] hover:border-apex hover:text-apex">
              We Are A Franchise
            </a>
          </motion.div>
        </motion.div>
      </section>

      <AboutSection />
      <StructureSection />
      <RegistrationSection />
      <FranchiseSection />
      <RulesSection />
      <PrizeSection />
      <MediaSection />
      <ContactSection />
      <FaqSection />
      <Footer />
    </main>
  );
}

function AboutSection() {
  const pillars = [
    ["Culture", "A league built around matchday identity, visual storytelling, and the ritual of football."],
    ["Development", "A structured stage for young players to be seen, tested, documented, and elevated."],
    ["Competition", "Sixteen franchises competing through a composed season format and playoff finish."],
    ["Ecosystem", "Players, owners, media, supporters, and communities brought into one premium platform."]
  ];

  return (
    <section id="about" className="section bg-white">
      <div className="container grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <AnimatedBlock>
          <SectionLabel>About The League</SectionLabel>
          <h2 className="display mt-6 text-[clamp(3.2rem,7vw,6.8rem)]">Regional football, presented with global intent.</h2>
        </AnimatedBlock>
        <div className="grid gap-7">
          <AnimatedBlock delay={0.08}>
            <p className="max-w-2xl text-xl font-light leading-9 text-ink/66">
              APEX PREMIERE LEAGUE is a modern football platform designed to give regional talent a more
              precise stage: better competition, sharper presentation, stronger media, and a league
              culture that respects the ambition of every player and franchise.
            </p>
          </AnimatedBlock>
          <div className="grid gap-4 sm:grid-cols-2">
            {pillars.map(([title, text], index) => (
              <AnimatedBlock key={title} delay={0.1 + index * 0.04}>
                <div className="min-h-40 border-t border-ink/10 py-6">
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-ink/46">{title}</p>
                  <p className="mt-4 text-base leading-7 text-ink/58">{text}</p>
                </div>
              </AnimatedBlock>
            ))}
          </div>
          <AnimatedBlock delay={0.18}>
            <ImagePanel src="/media-net-training.jpeg" label="Training field atmosphere" className="min-h-[440px]" />
          </AnimatedBlock>
        </div>
      </div>
    </section>
  );
}

function StructureSection() {
  const items = [
    ["16", "Franchises"],
    ["288", "Players"],
    ["12", "Week Season"],
    ["League", "+ Playoffs"]
  ];

  return (
    <section className="section bg-mist">
      <div className="container">
        <AnimatedBlock className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <SectionLabel>League Structure</SectionLabel>
            <h2 className="display mt-5 max-w-3xl text-[clamp(3.3rem,7vw,7.2rem)]">A clear format for serious football.</h2>
          </div>
          <p className="max-w-sm text-lg font-light leading-8 text-ink/62">
            Enough scale to feel elite. Enough clarity to keep every match meaningful.
          </p>
        </AnimatedBlock>
        <div className="mt-16 grid border-t border-ink/10 md:grid-cols-4">
          {items.map(([value, label], index) => (
            <AnimatedBlock key={label} delay={index * 0.05}>
              <div className="border-b border-ink/10 py-8 md:border-r md:px-6 md:last:border-r-0">
                <p className="display text-5xl font-light md:text-7xl">{value}</p>
                <p className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-ink/48">{label}</p>
              </div>
            </AnimatedBlock>
          ))}
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  error
  ,
  inputMode,
  pattern,
  onInput
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  inputMode?: "email" | "url" | "search" | "text" | "none" | "tel" | "numeric" | "decimal";
  pattern?: string;
  onInput?: (event: FormEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[0.68rem] font-medium uppercase tracking-[0.18em] text-ink/48">
        {label} {required && <span className="text-apex">*</span>}
      </span>
      <input
        name={name}
          type={type}
          inputMode={inputMode}
          pattern={pattern}
          onInput={onInput}
        className={`field ${error ? "field-error" : ""}`}
        placeholder={label}
      />
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="mt-2 text-xs text-apex">
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </label>
  );
}

function UploadField({
  label,
  name,
  required = false,
  error,
  fileName,
  onFileChange
}: {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  fileName?: string;
  onFileChange?: (file: File | null) => void;
}) {
  return (
    <label className={`upload-field ${error ? "border-apex/60" : ""}`}>
      <span>
        {label} {required && <span className="text-apex">*</span>}
        {error && <span className="mt-1 block text-xs font-normal normal-case tracking-normal text-apex">{error}</span>}
      </span>
      <Upload size={17} />
      <input
        name={name}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0] ?? null;
          onFileChange?.(file);
        }}
      />
      {fileName && <p className="mt-2 text-xs text-ink/60">{fileName}</p>}
    </label>
  );
}

function validateForm(form: HTMLFormElement, required: string[]) {
  const data = new FormData(form);
  const nextErrors: ErrorMap = {};
  required.forEach((name) => {
    if (name === "termsAcceptance") {
      const checkbox = form.querySelector(`input[name="${name}"]`) as HTMLInputElement;
      if (!checkbox?.checked) {
        nextErrors[name] = "Required";
      }
      return;
    }
    const value = data.get(name);
    if (value instanceof File) {
      if (!value.name) nextErrors[name] = "Required";
      return;
    }
    if (!String(value || "").trim()) nextErrors[name] = "Required";
  });
  const email = String(data.get("email") || "");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "Enter a valid email";
  return nextErrors;
}

function RegistrationSection() {
  const [errors, setErrors] = useState<ErrorMap>({});
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [photoFileName, setPhotoFileName] = useState("");
  const [idFileName, setIdFileName] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCashfreeReady, setIsCashfreeReady] = useState(false);
  const required = ["fullName", "age", "position", "foot", "phone", "email", "area", "photo", "idUpload", "termsAcceptance"];

  useEffect(() => {
    const cashfreeMode = ["TEST", "SANDBOX"].includes(
      (process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT || "").toUpperCase()
    )
      ? "sandbox"
      : "production";

    load({ mode: cashfreeMode })
      .then((instance: any) => {
        if (instance) {
          setIsCashfreeReady(true);
        }
      })
      .catch(() => {
        setIsCashfreeReady(false);
      });
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 4200);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateForm(event.currentTarget, required);
    setErrors(nextErrors);

    if (photoFile && photoFile.size > 5 * 1024 * 1024) {
      nextErrors.photo = "Photo must be 5MB or smaller.";
    }
    if (idFile && idFile.size > 5 * 1024 * 1024) {
      nextErrors.idUpload = "ID upload must be 5MB or smaller.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      const data = new FormData(event.currentTarget);
      const formDataObj: Record<string, any> = {};
      data.forEach((value, key) => {
        formDataObj[key] = value;
      });
      formDataObj.photo = photoFile;
      formDataObj.idUpload = idFile;
      setFormData(formDataObj);
      showToast("Ready to connect to payment gateway...");
      setPaymentState("checkout");
    }
  };

  return (
    <section id="players" className="section bg-white">
      <div className="container grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
        <AnimatedBlock>
          <SectionLabel>Player Registration</SectionLabel>
          <h2 className="display mt-6 text-[clamp(3.2rem,7vw,6.8rem)]">Enter the official player pool.</h2>
          <p className="mt-6 max-w-md text-lg font-light leading-8 text-ink/62">
            Complete the registration, proceed through the secure checkout, and wait for APL Committee review.
          </p>
          <div className="mt-8 inline-flex rounded-full border border-apex/20 bg-white px-5 py-3 text-sm font-medium text-apex shadow-soft">
            ₹249 Official Registration
          </div>
        </AnimatedBlock>
        <AnimatedBlock delay={0.08}>
          <form onSubmit={handleSubmit} noValidate className="glass grid gap-5 rounded-[2rem] p-5 md:grid-cols-2 md:p-8">
            <Field label="Full Name" name="fullName" required error={errors.fullName} />
            <Field label="Age" name="age" type="number" required error={errors.age} />
            <Field label="Position" name="position" required error={errors.position} />
            <Field label="Preferred Foot" name="foot" required error={errors.foot} />
            <Field
              label="Contact Number"
              name="phone"
              type="tel"
              required
              error={errors.phone}
              inputMode="numeric"
              pattern="[0-9]*"
              onInput={(event) => {
                const input = event.currentTarget;
                input.value = input.value.replace(/\D/g, "");
              }}
            />
            <Field label="Email" name="email" type="email" required error={errors.email} />
            <Field label="Instagram" name="instagram" />
            <Field label="Area/District" name="area" required error={errors.area} />
            <UploadField
              label="Upload Photo"
              name="photo"
              required
              error={errors.photo}
              fileName={photoFileName}
              onFileChange={(file) => {
                setPhotoFile(file);
                setPhotoFileName(file?.name || "");
              }}
            />
            <UploadField
              label="Upload ID"
              name="idUpload"
              required
              error={errors.idUpload}
              fileName={idFileName}
              onFileChange={(file) => {
                setIdFile(file);
                setIdFileName(file?.name || "");
              }}
            />
            <label className={`md:col-span-2 flex gap-3 ${errors.termsAcceptance ? "text-apex" : ""}`}>
              <input type="checkbox" name="termsAcceptance" className="mt-1 h-5 w-5 shrink-0" />
              <div>
                <span className="text-sm font-medium">
                  I have read and accepted the{" "}
                  <Link href="/terms-and-conditions" className="font-semibold text-apex hover:underline">
                    terms and conditions
                  </Link>
                  {" "}and{" "}
                  <Link href="/privacy-policy" className="font-semibold text-apex hover:underline">
                    privacy policy
                  </Link>
                  {" "}of APEX PREMIERE LEAGUE{" "}
                  <span className="text-apex">*</span>
                </span>
                <AnimatePresence>
                  {errors.termsAcceptance && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="mt-1 text-xs text-apex">
                      {errors.termsAcceptance}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </label>
            <button className="md:col-span-2 rounded-full bg-ink px-6 py-4 text-sm font-medium text-white transition hover:scale-[1.01] hover:bg-apex">
              Continue To Payment
            </button>
          </form>
        </AnimatedBlock>
      </div>
      <PaymentModal state={paymentState} setState={setPaymentState} formData={formData} />
    </section>
  );
}

function PaymentModal({ state, setState, formData }: { state: PaymentState; setState: (state: PaymentState) => void; formData: Record<string, any> }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string>("");

  const handleCashfreePayment = async () => {
    setIsLoading(true);
    setUploadProgress("Connecting to payment gateway...");
    setError(null);
    let paymentData: any = null;

    try {
      const photoFile = formData.photo as File;
      const idFile = formData.idUpload as File;

      if (!photoFile || !idFile) {
        setError("Files missing from form data");
        setIsLoading(false);
        return;
      }

      setUploadProgress("Initiating payment...");
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
        }),
      });

      paymentData = await response.json();

      if (!response.ok) {
        setError("Failed to load payment gateway. Please try again.");
        setIsLoading(false);
        return;
      }

      if (!paymentData.paymentSessionId && !paymentData.paymentLink) {
        setError("Failed to load payment gateway. Please try again.");
        setIsLoading(false);
        return;
      }

      const orderId = paymentData.orderId;
      if (!orderId) {
        setError("Unable to create payment order. Please try again.");
        setIsLoading(false);
        return;
      }

      const pendingRegistration = {
        orderId,
        createdAt: Date.now(),
        fullName: formData.fullName,
        age: parseInt(formData.age, 10),
        position: formData.position,
        preferredFoot: formData.foot,
        contactNumber: formData.phone,
        email: formData.email,
        instagram: formData.instagram || null,
        area: formData.area,
        photoFile,
        idFile,
        photoName: photoFile.name,
        idName: idFile.name,
        photoType: photoFile.type,
        idType: idFile.type,
      };

      await savePendingPlayerRegistration(pendingRegistration);

      const cashfreeMode = ["TEST", "SANDBOX"].includes(
        (process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT || "").toUpperCase()
      )
        ? "sandbox"
        : "production";

      const cashfree = await load({ mode: cashfreeMode });
      setUploadProgress("Opening secure payment...");

      if (paymentData.paymentSessionId && cashfree && typeof cashfree.checkout === "function") {
        await cashfree.checkout({
          paymentSessionId: paymentData.paymentSessionId,
          redirectTarget: "_self",
        });
      } else if (paymentData.paymentLink) {
        window.location.assign(paymentData.paymentLink);
      } else {
        throw new Error("No payment session or link available");
      }
    } catch (err: any) {
      if (paymentData?.paymentLink) {
        window.location.assign(paymentData.paymentLink);
      } else {
        setError("Failed to process payment. Please try again.");
      }
      setUploadProgress("");
      setIsLoading(false);
    }
  };
  return (
    <AnimatePresence>
      {state !== "idle" && (
        <motion.div className="fixed inset-0 z-[70] grid place-items-center bg-ink/24 p-4 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={transition}
            className="w-full max-w-md rounded-[2rem] border border-ink/10 bg-white p-6 shadow-[0_40px_120px_rgba(17,17,17,0.18)]"
          >
            {state === "checkout" && (
              <>
                <div className="flex items-center justify-between">
                  <p className="eyebrow">Secure Checkout</p>
                  <button onClick={() => setState("idle")} aria-label="Close payment" className="grid size-9 place-items-center rounded-full border border-ink/10">
                    <X size={15} />
                  </button>
                </div>
                <h3 className="display mt-6 text-5xl">₹249</h3>
                <p className="mt-4 text-sm leading-7 text-ink/58">
                  Official APL player registration. Secure payment processing via Cashfree.
                </p>
                <div className="mt-6 rounded-3xl border border-ink/10 bg-mist p-4">
                  <div className="flex items-center gap-3">
                    <CreditCard size={18} />
                    <span className="text-sm font-medium">Card / UPI / Wallet</span>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-ink/48">
                    <Lock size={13} />
                    Encrypted checkout handoff
                  </div>
                </div>
                {error && (
                  <div className="mt-6 rounded-lg bg-red-50 border border-red-200 p-4">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
                {uploadProgress && (
                  <div className="mt-6 rounded-3xl border border-ink/10 bg-slate-50 px-4 py-3 text-sm text-ink/70">
                    {uploadProgress}
                  </div>
                )}
                <div className="mt-6 grid gap-3">
                  <button
                    onClick={handleCashfreePayment}
                    disabled={isLoading}
                    className="rounded-full bg-ink px-5 py-4 text-sm font-medium text-white transition hover:bg-apex disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Processing..." : "Proceed to Payment"}
                  </button>
                  <button onClick={() => setState("idle")} className="rounded-full border border-ink/10 px-5 py-4 text-sm font-medium text-ink/64 transition hover:border-apex hover:text-apex">
                    Cancel
                  </button>
                </div>
              </>
            )}
            {state === "success" && (
              <Confirmation
                title="Application submitted"
                message="Your application has been submitted successfully. You will receive an email once your registration has been reviewed and approved by the APL Committee."
                onClose={() => setState("idle")}
              />
            )}
            {state === "failed" && (
              <>
                <h3 className="display text-5xl">Payment not completed.</h3>
                <p className="mt-4 text-sm leading-7 text-ink/58">No registration has been submitted. Please retry the checkout when ready.</p>
                <button onClick={() => setState("checkout")} className="mt-6 rounded-full bg-ink px-5 py-4 text-sm font-medium text-white">
                  Try Again
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Confirmation({ title, message, onClose }: { title: string; message: string; onClose: () => void }) {
  return (
    <div>
      <div className="grid size-12 place-items-center rounded-full bg-apex text-white">
        <Check size={20} />
      </div>
      <h3 className="display mt-6 text-5xl">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-ink/60">{message}</p>
      <button onClick={onClose} className="mt-7 rounded-full bg-ink px-5 py-4 text-sm font-medium text-white">
        Close
      </button>
    </div>
  );
}

function FranchiseSection() {
  const [errors, setErrors] = useState<ErrorMap>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string>("");
  const required = ["ownerName", "phone", "email", "teamArea"];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    const nextErrors = validateForm(event.currentTarget, required);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length !== 0) return;

    setIsSubmitting(true);
    setSubmitMessage("Connecting to Apex...");

    try {
      const data = new FormData(event.currentTarget);
      const logoFile = data.get("logo") as File | null;

      let logoUrl: string | null = null;
      if (logoFile && logoFile.name) {
        setSubmitMessage("Compressing and uploading logo...");
        const upload = await uploadFranchiseLogo(logoFile);
        if (!upload.success) {
          setSubmitError(upload.error || "Failed to upload logo");
          setIsSubmitting(false);
          setSubmitMessage("");
          return;
        }
        logoUrl = upload.url || null;
      }

      const insertPayload = {
        owner_name: String(data.get("ownerName") || ""),
        contact_number: String(data.get("phone") || ""),
        email: String(data.get("email") || ""),
        team_area: String(data.get("teamArea") || ""),
        team_name: String(data.get("teamName") || null),
        team_colors: String(data.get("teamColors") || null),
        squad_estimate: String(data.get("squadEstimate") || null),
        manager_name: String(data.get("managerName") || null),
        instagram: String(data.get("instagram") || null),
        previous_experience: String(data.get("experience") || null),
        logo_url: logoUrl,
        approval_status: "pending",
      };

      setSubmitMessage("Finalizing application...");
      const result = await insertFranchise(insertPayload as any);
      if (!result.success) {
        setSubmitError(result.error || "Failed to save franchise application");
        setIsSubmitting(false);
        setSubmitMessage("");
        return;
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error("Franchise submit error", err);
      setSubmitError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
      setSubmitMessage("");
    }
  };

  return (
    <section id="franchises" className="section bg-mist">
      <div className="container grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <AnimatedBlock>
          <SectionLabel>Franchise Application</SectionLabel>
          <h2 className="display mt-6 text-[clamp(3.2rem,7vw,6.8rem)]">Build a club people can belong to.</h2>
          <p className="mt-6 max-w-md text-lg font-light leading-8 text-ink/62">
            Apply with the essentials now. Brand assets and squad details can mature after committee approval.
          </p>
        </AnimatedBlock>
        <AnimatedBlock delay={0.08}>
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div key="done" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass rounded-[2rem] p-7 md:p-9">
                <Confirmation
                  title="Application received"
                  message="Your franchise application has been received successfully. The APL Committee will review your application and contact you via email regarding the next steps."
                  onClose={() => setSubmitted(false)}
                />
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit} noValidate className="glass grid gap-5 rounded-[2rem] p-5 md:grid-cols-2 md:p-8">
                <Field label="Owner Name" name="ownerName" required error={errors.ownerName} />
                <Field
                  label="Contact Number"
                  name="phone"
                  type="tel"
                  required
                  error={errors.phone}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  onInput={(event) => {
                    const input = event.currentTarget;
                    input.value = input.value.replace(/\D/g, "");
                  }}
                />
                <Field label="Email" name="email" type="email" required error={errors.email} />
                <Field label="Team Area" name="teamArea" required error={errors.teamArea} />
                <div className="md:col-span-2 border-t border-ink/10 pt-5 text-sm leading-7 text-ink/54">
                  Optional details may be submitted later after approval.
                </div>
                <Field label="Team Name" name="teamName" />
                <Field label="Team Colors" name="teamColors" />
                <Field label="Squad Estimate" name="squadEstimate" />
                <Field label="Manager Name" name="managerName" />
                <Field label="Instagram" name="instagram" />
                <Field label="Previous Experience" name="experience" />
                <div className="md:col-span-2">
                  <UploadField label="Logo Upload" name="logo" />
                </div>
                <button disabled={isSubmitting} className="rounded-full bg-ink px-6 py-4 text-sm font-medium text-white transition hover:scale-[1.01] hover:bg-apex md:col-span-2 disabled:opacity-60 disabled:cursor-not-allowed">
                  {isSubmitting ? "Submitting..." : "Submit Franchise Application"}
                </button>
                {submitMessage && (
                  <div className="md:col-span-2 mt-3 rounded-3xl border border-ink/10 bg-slate-50 px-4 py-3 text-sm text-ink/70">
                    {submitMessage}
                    {isSubmitting && (
                      <p className="mt-2 text-xs text-ink/50">Tip: Curate your franchise details carefully while we complete the submission.</p>
                    )}
                  </div>
                )}
                {submitError && (
                  <div className="md:col-span-2 mt-3 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                    {submitError}
                  </div>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </AnimatedBlock>
      </div>
    </section>
  );
}

function RulesSection() {
  return (
    <section className="section bg-white">
      <div className="container grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center md:gap-16">
        <AnimatedBlock>
          <SectionLabel>Rulebook</SectionLabel>
          <h2 className="display mt-6 text-[clamp(3.2rem,7vw,6.7rem)]">The standard, written clearly.</h2>
          <p className="mt-6 max-w-md text-lg font-light leading-8 text-ink/62">
            Download the official APEX PREMIERE LEAGUE rulebook for registration, conduct, format, and league operating policies.
          </p>
          <a href="/apl-rulebook.pdf" download className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-4 text-sm font-medium text-white transition hover:bg-apex">
            <Download size={17} />
            Download APL Rulebook
          </a>
        </AnimatedBlock>
        <AnimatedBlock delay={0.08}>
          <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-ink/10 bg-mist p-6 shadow-soft">
            <img src="/media-goal-graphic.jpeg" alt="football field geometry" className="absolute inset-0 h-full w-full object-cover opacity-20 grayscale" />
            <div className="relative z-10 flex h-full min-h-[360px] flex-col justify-between">
              <p className="eyebrow">Official PDF</p>
              <div>
                <p className="display text-7xl">APL</p>
                <p className="mt-4 max-w-sm text-sm leading-7 text-ink/58">Rules, eligibility, conduct, match structure, media rights, and committee authority.</p>
              </div>
            </div>
          </div>
        </AnimatedBlock>
      </div>
    </section>
  );
}

function PrizeSection() {
  const topLine = [
    "1 Champion",
    "16 Teams",
    "288 Players",
    "Champions",
    "₹1,00,000",
    "APL Trophy",
    "Gold Medals",
    "Champions Photoshoot",
    "Official Media Feature",
    "Social Media Spotlight"
  ];
  const bottomLine = [
    "Runner-Up",
    "₹50,000",
    "Silver Medals",
    "Media Feature",
    "Semi-Finalists",
    "₹10,000 each",
    "Golden Boot ₹5,000",
    "Golden Glove ₹5,000",
    "Player of the Tournament ₹10,000",
    "Young Player Award ₹3,000",
    "Best Goal Award ₹2,000",
    "Every Player of the Match ₹1,000",
    "Franchise Owners Get Kit Sponsors",
    "And Many More Things"
  ];

  return (
    <section className="section bg-mist overflow-hidden">
      <div className="container">
        <AnimatedBlock>
          <SectionLabel>Prize Pool</SectionLabel>
          <div className="mt-6 flex flex-col justify-between gap-7 md:flex-row md:items-end">
            <h2 className="display max-w-4xl text-[clamp(3.2rem,8vw,7.8rem)]">A season worth rising for.</h2>
            <p className="max-w-sm text-lg font-light leading-8 text-ink/62">
              Cash prizes, medals, media features, individual awards, sponsor value, and recognition across the APL ecosystem.
            </p>
          </div>
        </AnimatedBlock>
      </div>
      <div className="mt-14 border-y border-ink/10 bg-white/64 py-6">
        <div className="marquee">
          <div className="marquee-track">
            {[...topLine, ...topLine].map((item, index) => (
              <span key={`${item}-${index}`} className="prize-pill">
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="marquee marquee-reverse mt-4">
          <div className="marquee-track">
            {[...bottomLine, ...bottomLine].map((item, index) => (
              <span key={`${item}-${index}`} className="prize-pill prize-pill-light">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MediaSection() {
  const items = [
    ["/media-stadium-crowd.jpeg", "Matchday visuals", "md:col-span-2 md:min-h-[460px]"],
    ["/media-net-training.jpeg", "Player moments", "md:min-h-[460px]"],
    ["/media-stadium-lights.jpeg", "Reels", "md:min-h-[460px]"],
    ["/media-strategy.jpeg", "Culture details", "md:min-h-[360px]"],
    ["/media-white-ball.jpeg", "Boots / grass / touch", "md:col-span-2 md:min-h-[360px]"],
    ["/apl-hero-stadium.png", "Crowd atmosphere", "md:min-h-[360px]"]
  ];

  return (
    <section id="media" className="section bg-ink text-white">
      <div className="container">
        <AnimatedBlock className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <SectionLabel light>Media</SectionLabel>
            <h2 className="display mt-6 max-w-3xl text-[clamp(3.4rem,7vw,7rem)]">The season, edited like culture.</h2>
          </div>
          <p className="max-w-md text-lg font-light leading-8 text-white/58">
            Matchday images, reels, player studies, and crowd atmosphere composed with restraint.
          </p>
        </AnimatedBlock>
        <div className="mt-14 grid gap-4 md:grid-cols-4">
          {items.map(([src, label, className], index) => (
            <AnimatedBlock key={label} delay={index * 0.04} className={className}>
              <ImagePanel src={src} label={label} className="h-full" />
            </AnimatedBlock>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="section bg-white">
      <div className="container grid gap-10 md:grid-cols-[0.82fr_1.18fr] md:gap-16">
        <AnimatedBlock>
          <SectionLabel>Contact</SectionLabel>
          <h2 className="display mt-6 text-[clamp(3.2rem,7vw,6.8rem)]">Speak with APL.</h2>
          <a href="mailto:contact@apexpremiereleague.in" className="mt-8 inline-flex items-center gap-2 text-lg font-medium text-apex">
            <Mail size={18} />
            contact@apexpremiereleague.in
          </a>
        </AnimatedBlock>
        <AnimatedBlock delay={0.08}>
          <form className="glass grid gap-5 rounded-[2rem] p-5 md:grid-cols-2 md:p-8">
            <Field label="Name" name="name" />
            <Field label="Email" name="email" type="email" />
            <div className="md:col-span-2">
              <Field label="Subject" name="subject" />
            </div>
            <label className="block md:col-span-2">
              <span className="mb-2 block text-[0.68rem] font-medium uppercase tracking-[0.18em] text-ink/48">Message</span>
              <textarea className="field min-h-40 resize-none" placeholder="Message" />
            </label>
            <button className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 text-sm font-medium text-white transition hover:scale-[1.01] hover:bg-apex md:col-span-2">
              <Send size={16} />
              Send Message
            </button>
          </form>
        </AnimatedBlock>
      </div>
    </section>
  );
}

function FaqSection() {
  const faqs = [
    ["How do player registrations work?", "Players complete the official registration form, pay the ₹249 registration fee, and enter the APL review process."],
    ["What is the registration fee?", "The official player registration fee is ₹249."],
    ["How are franchises approved?", "Franchise applications are reviewed by the APL Committee based on owner details, area, communication, and league fit."],
    ["What is the league format?", "Season 1 is structured around 16 franchises, 288 players, a 12 week season, league competition, and playoffs."],
    ["What happens after submission?", "Players and franchise applicants receive email communication after committee review and approval decisions."],
    ["How can players benefit from APL?", "Players receive competitive exposure, professional match experience, media visibility, statistics tracking, and opportunities to build recognition within the football community."],
    ["Can franchises earn through APL?", "Yes. Franchises can build local fanbases, attract sponsors, sell merchandise, grow their brand presence, and gain media exposure through the league ecosystem."],
    ["Will matches be livestreamed and promoted?", "Selected matches, highlights, player moments, interviews, and media content will be featured across APL’s official digital platforms and social media channels."],
    ["What happens after my application is approved?", "Approved players and franchises will receive an official confirmation email with the next steps, registration details, league onboarding instructions, and match-related updates."],
    ["Why was Apex Premiere League created?", "APL was created to bring a modern, professional, and premium football platform to regional football while building a stronger football culture, community, and competitive ecosystem."]
  ];

  return (
    <section className="section bg-mist">
      <div className="container max-w-4xl">
        <AnimatedBlock>
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="display mt-6 text-[clamp(3.3rem,8vw,7rem)]">Questions, answered cleanly.</h2>
        </AnimatedBlock>
        <div className="mt-12 border-t border-ink/10">
          {faqs.map(([question, answer]) => (
            <details key={question} className="group border-b border-ink/10 py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-xl font-light">
                {question}
                <ChevronDown className="shrink-0 transition group-open:rotate-180" size={20} />
              </summary>
              <p className="mt-5 max-w-2xl text-base leading-8 text-ink/62">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 bg-ink px-5 py-12 text-white md:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <img src="/apl-logo.png" alt="APL logo" className="h-16 w-auto brightness-0 invert" />
          <p className="mt-5 max-w-sm text-sm leading-7 text-white/52">APEX PREMIERE LEAGUE. Rise Above.</p>
          <p className="mt-4 text-sm text-white/42">© 2026 APL. All rights reserved.</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-white/64">
          <a href="#about">About</a>
          <a href="#franchises">Franchises</a>
          <a href="#players">Players</a>
          <a href="#media">Media</a>
          <a href="/apl-rulebook.pdf" download>Rulebook</a>
          <a href="https://www.instagram.com/apexpremiereleague/" target="_blank" rel="noreferrer">Instagram</a>
          <a href="mailto:contact@apexpremiereleague.in">Email</a>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms-and-conditions">Terms & Conditions</Link>
        </div>
      </div>
    </footer>
  );
}
