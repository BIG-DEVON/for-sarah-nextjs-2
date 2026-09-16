"use client";

import {
  AnimatePresence,
  MotionConfig,
  motion,
  useScroll,
  useSpring,
  useTransform
} from "framer-motion";
import { useRef, useState } from "react";
import { bestowedTitles, flow, photoSlots, sonnet, type PhotoSlot } from "./content";

const ease = [0.16, 1, 0.3, 1] as const;

const celebrationTokens = [
  ["🎈", "4%", "-2s", "18s", "2.5rem"],
  ["🎀", "14%", "-11s", "22s", "1.8rem"],
  ["💘", "24%", "-6s", "20s", "2rem"],
  ["🎈", "37%", "-15s", "25s", "2.1rem"],
  ["🎀", "51%", "-4s", "19s", "2.2rem"],
  ["💘", "64%", "-13s", "23s", "1.8rem"],
  ["🎈", "77%", "-8s", "21s", "2.7rem"],
  ["🎀", "88%", "-18s", "26s", "2rem"],
  ["💘", "95%", "-5s", "18s", "2.1rem"]
] as const;

const confettiColors = ["#C9A24C", "#E6C983", "#B4586A", "#4B1524", "#F4EADD"];

function CelebrationField() {
  return (
    <div className="celebration-field" aria-hidden="true">
      {celebrationTokens.map(([glyph, left, delay, duration, size], index) => (
        <span
          className="celebration-token"
          key={index}
          style={{ left, animationDelay: delay, animationDuration: duration, fontSize: size }}
        >
          {glyph}
        </span>
      ))}
      {Array.from({ length: 24 }, (_, index) => (
        <i
          className="ambient-confetti"
          key={"confetti-" + index}
          style={{
            left: `${(index * 37) % 100}%`,
            animationDelay: `${-(index % 12) * 1.7}s`,
            animationDuration: `${14 + (index % 7)}s`,
            backgroundColor: confettiColors[index % confettiColors.length]
          }}
        />
      ))}
    </div>
  );
}

function Soundtrack() {
  const audio = useRef<HTMLAudioElement>(null);
  const [entered, setEntered] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);

  const begin = async () => {
    setEntered(true);
    try {
      await audio.current?.play();
      setPlaying(true);
      setError(false);
    } catch {
      setPlaying(false);
      setError(true);
    }
  };

  const toggle = async () => {
    if (!audio.current) return;
    if (playing) {
      audio.current.pause();
      setPlaying(false);
      return;
    }
    try {
      await audio.current.play();
      setPlaying(true);
      setError(false);
    } catch {
      setError(true);
    }
  };

  return (
    <>
      <audio
        ref={audio}
        src="/audio/Ade1.m4a"
        preload="auto"
        loop
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setError(true)}
      />
      <AnimatePresence>
        {!entered && (
          <motion.div
            className="sound-gate"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(18px)" }}
            transition={{ duration: 0.8, ease }}
          >
            <button className="sound-gate__seal" type="button" onClick={begin}>
              <CrownMark small />
              <span>A song for Ade</span>
              <strong>Open with sound</strong>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {entered && (
        <button className="soundtrack" type="button" onClick={toggle} aria-label={playing ? "Pause Ade1" : "Play Ade1"}>
          <span className={playing ? "soundtrack__bars soundtrack__bars--playing" : "soundtrack__bars"} aria-hidden="true">
            <i /><i /><i />
          </span>
          <span>{error ? "Tap for Ade1" : playing ? "Ade1 · playing" : "Ade1 · paused"}</span>
        </button>
      )}
    </>
  );
}

function CrownMark({ small = false }: { small?: boolean }) {
  return (
    <motion.svg
      className={small ? "crown crown--small" : "crown"}
      viewBox="0 0 120 74"
      aria-hidden={small}
      aria-label={small ? undefined : "Crown"}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
    >
      <motion.path
        d="M10 58 5 18l31 25L60 7l24 36 31-25-5 40Z"
        variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
        transition={{ duration: 1.8, ease }}
      />
      <motion.path
        d="M12 66c21-5 74-5 96 0"
        variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
        transition={{ duration: 1.1, delay: 0.65, ease }}
      />
    </motion.svg>
  );
}

function Flourish() {
  return (
    <motion.svg className="flourish" viewBox="0 0 150 20" aria-hidden="true">
      <motion.path
        d="M1 10c18-10 27 10 45 0s27 10 45 0 27 10 58 0"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 1.15, ease }}
      />
    </motion.svg>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <>
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 42, clipPath: "inset(0 0 100% 0)" }}
        whileInView={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1, ease }}
      >
        {children}
      </motion.h2>
      <Flourish />
    </>
  );
}

function PhotoSurface({ slot }: { slot: PhotoSlot }) {
  const [failed, setFailed] = useState(false);
  const number = slot.label.match(/\d+/)?.[0] ?? "00";

  return (
    <div className="photo-surface">
      {!failed && (
        <img
          className="photo-image photo-image--loaded"
          src={slot.src}
          alt={slot.alt}
          style={{ objectPosition: slot.position ?? "50% 50%" }}
          onError={() => setFailed(true)}
        />
      )}
      {failed && (
        <div className="photo-empty" aria-label={"Reserved for " + slot.label}>
          <span className="photo-empty__number">{number}</span>
          <span className="photo-empty__label">Drop {number}.jpg into public/photos</span>
        </div>
      )}
    </div>
  );
}

function Vitals() {
  const items = [
    ["Origin", "a blue tick, no scheduled meeting"],
    ["Distance", "two roofs, one city"],
    ["Output", "more than either of us signed up for"],
    ["Status", "irreversible"]
  ];

  return (
    <section className="section vitals">
      <div className="section__inner">
        <motion.dl
          className="vitals-card"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
          {items.map(([label, value]) => (
            <motion.div
              className="vital"
              key={label}
              variants={{
                hidden: { opacity: 0, x: -32 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease } }
              }}
            >
              <dt className="meta">{label}</dt>
              <dd>{value}</dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}

function MemoryTheatre() {
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.6 });
  const mainScale = useTransform(progress, [0, 0.45, 1], [0.72, 1, 0.82]);
  const mainRotate = useTransform(progress, [0, 0.45, 1], [-8, 0, 5]);
  const mainY = useTransform(progress, [0, 1], [150, -100]);
  const leftX = useTransform(progress, [0, 0.45, 1], ["-62vw", "-31vw", "-18vw"]);
  const leftRotate = useTransform(progress, [0, 1], [-22, -7]);
  const rightX = useTransform(progress, [0, 0.45, 1], ["62vw", "31vw", "18vw"]);
  const rightRotate = useTransform(progress, [0, 1], [20, 6]);
  const copyOpacity = useTransform(progress, [0, 0.18, 0.72, 1], [0, 1, 1, 0]);

  return (
    <section className="memory" ref={section}>
      <div className="memory__sticky">
        <p className="mood memory__mood" aria-hidden="true">Seen.</p>
        <motion.div className="memory__copy" style={{ opacity: copyOpacity }}>
          <span className="meta">Photograph one — the evidence</span>
          <h2>The mirror kept the proof.</h2>
          <p>You were there. I was there. The phone tried its best to interrupt.</p>
        </motion.div>

        <motion.figure className="memory-card memory-card--left" style={{ x: leftX, rotate: leftRotate }}>
          <PhotoSurface slot={photoSlots[1]} />
          <figcaption className="meta">{photoSlots[1].label}</figcaption>
        </motion.figure>

        <motion.figure
          className="memory-card memory-card--main"
          style={{ scale: mainScale, rotate: mainRotate, y: mainY }}
        >
          <PhotoSurface slot={photoSlots[0]} />
          <figcaption className="meta">{photoSlots[0].label}</figcaption>
        </motion.figure>

        <motion.figure className="memory-card memory-card--right" style={{ x: rightX, rotate: rightRotate }}>
          <PhotoSurface slot={photoSlots[2]} />
          <figcaption className="meta">{photoSlots[2].label}</figcaption>
        </motion.figure>
      </div>
    </section>
  );
}

function Story() {
  const paragraphs = [
    "Before there was an us, there was Apple Music. You asked for my account number; I sent it; a small transfer followed. I replied ‘Seeen, thanks’ with no idea I had just answered the opening message of the rest of my life.",
    "No thunder. No perfect opening line. Just WhatsApp, two practical people, and one ordinary conversation quietly becoming the beginning of everything that matters to me now.",
    "Today, Abuja keeps us beneath two different roofs while we keep choosing the same future: one home, our names beside each other, quiet Sundays, and a family made gentle by the way we love. The first message was small. My Ade, look what it grew into."
  ];

  return (
    <section className="section story">
      <p className="mood story__mood" aria-hidden="true">Origin</p>
      <div className="section__inner story__copy">
        {paragraphs.map((paragraph, index) => (
          <motion.p
            key={paragraph}
            initial={{ opacity: 0.16, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.95, delay: index * 0.08, ease }}
          >
            {paragraph}
          </motion.p>
        ))}
        <motion.figure
          className="origin-proof"
          initial={{ opacity: 0, y: 70, rotate: -2 }}
          whileInView={{ opacity: 1, y: 0, rotate: -1 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 1, ease }}
        >
          <div className="origin-proof__image">
            <img src="/story/origin-chat-redacted.png" alt="The privacy-redacted chat that started Devon and Sarah's story" />
          </div>
          <figcaption>
            <span className="meta">Exhibit 01</span>
            <strong>The chat that started it all.</strong>
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}

function Sonnet() {
  return (
    <section className="section sonnet-section">
      <p className="mood sonnet__mood" aria-hidden="true">Light</p>
      <div className="section__inner">
        <SectionHeading>A Sonnet, Because You Deserve the Old Forms Too</SectionHeading>
        <div className="sonnet">
          {sonnet.map((line, index) => (
            <motion.span
              key={line}
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.85 }}
              transition={{ duration: 0.7, delay: (index % 4) * 0.055, ease }}
              className={(index + 1) % 4 === 0 ? "sonnet__line sonnet__line--stanza" : "sonnet__line"}
            >
              {line}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Flow() {
  return (
    <section className="section flow-section">
      <p className="mood flow__mood" aria-hidden="true">Flow</p>
      <div className="section__inner">
        <SectionHeading>Her Verse — Not a Poem, a Flow</SectionHeading>
        <div className="flow">
          {flow.map((line, index) => (
            <motion.p
              key={line}
              initial={{ opacity: 0, x: index % 2 === 0 ? -90 : 90 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.8, ease }}
              className={(index + 1) % 4 === 0 ? "flow__line flow__line--break" : "flow__line"}
            >
              {line}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}

function WritingCards() {
  const tags = ["Saved, 2:14am", "Kept, immediately", "Still thinking about it"];
  const images = [
    { src: "/writing/01.jpg", alt: "Sarah taking a mirror photograph in a burgundy patterned blouse" },
    { src: "/writing/02.jpg", alt: "Sarah taking a mirror photograph in a striped skirt" },
    { src: "/writing/03.jpg", alt: "Sarah taking a mirror photograph in a white top and black trousers" }
  ];

  return (
    <section className="section writing">
      <div className="section__inner">
        <SectionHeading>Frames of Hers I Kept</SectionHeading>
        <motion.div
          className="writing__cards"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.22 }}
          variants={{ visible: { transition: { staggerChildren: 0.13 } } }}
        >
          {tags.map((tag, index) => (
            <motion.article
              className={"writing-card writing-card--" + (index + 1)}
              key={tag}
              variants={{
                hidden: { opacity: 0, y: 70, rotate: 0 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease } }
              }}
            >
              <div className="writing-card__meta">
                <span className="meta writing-card__tag">{tag}</span>
                <span className="meta writing-card__number">0{index + 1} / 03</span>
              </div>
              <div className="writing-card__image">
                <img src={images[index].src} alt={images[index].alt} />
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Titles() {
  return (
    <section className="section titles-section">
      <p className="mood titles__mood" aria-hidden="true">Crown</p>
      <div className="section__inner">
        <SectionHeading>Titles I Bestow, Since Someone Should</SectionHeading>
        <ol className="titles">
          {bestowedTitles.map((title, index) => (
            <motion.li
              key={title}
              initial={{ opacity: 0, x: -52 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.9 }}
              transition={{ duration: 0.8, delay: index * 0.04, ease }}
            >
              <CrownMark small />
              <span>{title}</span>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function PhotoRail() {
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["4vw", "-44vw"]);
  const wordX = useTransform(scrollYProgress, [0, 1], ["18vw", "-18vw"]);

  return (
    <section className="photo-rail" ref={section}>
      <div className="photo-rail__sticky">
        <motion.p className="photo-rail__word" style={{ x: wordX }} aria-hidden="true">SARAH, IN BLUE.</motion.p>
        <motion.div className="photo-rail__track" style={{ x }}>
          {photoSlots.slice(3).map((slot, index) => (
            <figure className={"rail-card rail-card--" + (index + 1)} key={slot.src}>
              <PhotoSurface slot={slot} />
              <figcaption className="meta">{slot.label}</figcaption>
            </figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Vow() {
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.86, 1, 0.9]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [12, 0, -8]);

  return (
    <section className="section vow" ref={section}>
      <p className="mood vow__mood" aria-hidden="true">Promise</p>
      <motion.div className="section__inner vow__inner" style={{ scale, rotateX }}>
        <SectionHeading>What I'm Building Toward</SectionHeading>
        <p className="vow__copy">
          I think about the apartment we don't have yet — the one with your books on one shelf and my mess on another. I think about bank accounts that answer to both our names, and a Sunday that's boring in the way only safety can be boring. I think about a family that argues gently and forgives quickly, because that's what we're already practicing on each other. None of that is a plan yet. All of it is a promise.
        </p>
      </motion.div>
    </section>
  );
}

function CandleClosing() {
  const [blown, setBlown] = useState(false);

  return (
    <section className="section closing">
      <p className="mood closing__mood" aria-hidden="true">Wish.</p>
      <div className="section__inner closing__inner">
        <SectionHeading>Happy Birthday My Darling Bubbles 💘</SectionHeading>
        <p className="closing__subhead">Make a wish. I already made mine.</p>
        {blown && (
          <div className="confetti-burst" aria-hidden="true">
            {Array.from({ length: 54 }, (_, index) => (
              <i
                key={index}
                style={{
                  left: `${50 + ((index * 29) % 46) - 23}%`,
                  backgroundColor: confettiColors[index % confettiColors.length],
                  animationDelay: `${(index % 9) * 0.035}s`,
                  rotate: `${(index * 47) % 180}deg`
                }}
              />
            ))}
          </div>
        )}
        <div className={blown ? "candle-stage candle-stage--out" : "candle-stage"} aria-hidden="true">
          <span className="flame-aura" />
          <span className="flame" />
          <span className="flame-core" />
          <span className="smoke smoke--1" />
          <span className="smoke smoke--2" />
          <span className="smoke smoke--3" />
          <span className="candle"><span className="wax" /></span>
        </div>
        <button className="blow" type="button" onClick={() => setBlown(true)} disabled={blown}>
          {blown ? "Wish made" : "Blow out the candle"}
        </button>
        <AnimatePresence>
          {blown && (
            <motion.p
              className="wish"
              initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.65, delay: 0.45, ease }}
            >
              Wish made. Here's mine, already true: you, for as long as you'll have me.
            </motion.p>
          )}
        </AnimatePresence>
        <p className="meta closing__signature">— Devon</p>
      </div>
    </section>
  );
}

export default function Home() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 26, mass: 0.45 });
  const heroScale = useTransform(progress, [0, 0.12], [1, 0.88]);
  const heroOpacity = useTransform(progress, [0, 0.1], [1, 0]);

  return (
    <MotionConfig reducedMotion="user">
      <main>
        <Soundtrack />
        <CelebrationField />
        <motion.div className="progress" style={{ scaleX: progress }} />
        <section className="hero">
          <p className="mood hero__mood" aria-hidden="true">Ade</p>
          <motion.div className="hero__inner" style={{ scale: heroScale, opacity: heroOpacity }}>
            <div className="hero__copy">
              <CrownMark />
              <motion.p
                className="meta hero__date"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                16 September
              </motion.p>
              <h1 aria-label="Happy Birthday My Darling Bubbles.">
                <span><motion.i initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1.05, delay: 0.15, ease }}>Happy</motion.i></span>
                <span><motion.i initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1.05, delay: 0.28, ease }}>Birthday</motion.i></span>
                <span><motion.i initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1.05, delay: 0.41, ease }}>My Darling</motion.i></span>
                <span className="hero__name"><motion.i initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1.05, delay: 0.54, ease }}>Bubbles <b aria-hidden="true">💘</b></motion.i></span>
              </h1>
              <motion.p
                className="hero__letter-title"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: .9 }}
              >
                For the Crown I Never Asked to Wear
              </motion.p>
              <motion.p
                className="hero__subhead"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 1.05 }}
              >
                A birthday letter for my Ade — my sugar bomb, my queen, my Bubbles.
              </motion.p>
            </div>
            <motion.div
              className="hero-cake"
              initial={{ opacity: 0, y: 220, scale: .42, rotate: 10 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              transition={{ duration: 1.5, delay: .55, ease }}
            >
              <span className="hero-cake__halo" aria-hidden="true" />
              <span className="hero-cake__orbit hero-cake__orbit--1" aria-hidden="true" />
              <span className="hero-cake__orbit hero-cake__orbit--2" aria-hidden="true" />
              <img className="hero-cake__image" src="/cake/birthday-cake.png" alt="A monumental ivory, burgundy, blue and gold birthday cake for Bubbles" />
              {Array.from({ length: 9 }, (_, index) => (
                <i className={"hero-cake__spark hero-cake__spark--" + (index + 1)} key={index} aria-hidden="true" />
              ))}
            </motion.div>
          </motion.div>
          <motion.span className="hero__scroll meta" initial={{ opacity: 0 }} animate={{ opacity: 0.62 }} transition={{ delay: 1.35 }}>
            Unseal slowly
          </motion.span>
        </section>

        <Vitals />
        <MemoryTheatre />
        <Story />
        <Sonnet />
        <Flow />
        <WritingCards />
        <Titles />
        <PhotoRail />
        <Vow />
        <CandleClosing />
      </main>
    </MotionConfig>
  );
}
