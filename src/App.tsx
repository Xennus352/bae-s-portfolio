import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Background3D from './three/Background3D'
import { t, type Lang } from './i18n'

gsap.registerPlugin(ScrollTrigger)

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-2.31-2.84V9.2a6.37 6.37 0 1 0 5.76 6.3V8.72a8.16 8.16 0 0 0 4.77 1.52V6.79a4.85 4.85 0 0 1-1-.1z"/></svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.49h-2.8V24C19.61 23.09 24 18.1 24 12.07z"/></svg>
  )
}

export default function App() {
  const root = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [lang, setLang] = useState<Lang>('my')
  const tr = t[lang]

  useEffect(() => {
    gsap.to('.load-dot', { y: -18, duration: 0.5, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 0.12 })
    gsap.to('.load-heart', { scale: 1.5, rotation: 15, duration: 0.7, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    const t = setTimeout(() => {
      gsap.to('.loader', { opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: () => setLoading(false) })
    }, 2200)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (loading) return
    const ctx = gsap.context(() => {
      gsap.from('.hero-line', { y: 70, opacity: 0, duration: 1, stagger: 0.15, ease: 'back.out(1.4)' })
      gsap.from('.hero-sub', { y: 30, opacity: 0, duration: 0.8, delay: 0.6, ease: 'power3.out' })

      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
        gsap.from(el, { y: 50, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play reverse play reverse' } })
      })

      gsap.utils.toArray<HTMLElement>('.project-card').forEach((el, i) => {
        gsap.from(el, { y: 60, opacity: 0, scale: 0.9, duration: 0.7, delay: (i % 3) * 0.08, ease: 'back.out(1.5)', scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play reverse play reverse' } })
      })

      gsap.to('.float-emoji', { y: -14, rotation: 6, duration: 1.4, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 0.15 })
      gsap.to('.hero-sparkle', { scale: 1.4, opacity: 0.5, duration: 1, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 0.3 })

      // 3D tilt on the business card — follows the mouse, always wobbling slightly
      const card = document.querySelector<HTMLElement>('.business-card')
      if (card) {
        gsap.to(card, { y: -10, duration: 1.6, ease: 'sine.inOut', yoyo: true, repeat: -1 })
        card.addEventListener('mousemove', (e) => {
          const r = card.getBoundingClientRect()
          const rx = ((e.clientY - r.top) / r.height - 0.5) * -18
          const ry = ((e.clientX - r.left) / r.width - 0.5) * 18
          gsap.to(card, { rotateX: rx, rotateY: ry, transformPerspective: 800, duration: 0.4, ease: 'power2.out' })
        })
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' })
        })
      }
    }, root)
    return () => ctx.revert()
  }, [loading, lang])

  const navLinks = [
    { href: '#about', label: tr.navAbout },
    { href: '#services', label: tr.navServices },
    { href: '#location', label: tr.navLocation },
    { href: '#contact', label: tr.navContact },
  ]

  return (
    <div ref={root} className="min-h-screen text-violet-950 antialiased">
      {loading && (
        <div className="loader fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-violet-100 via-purple-100 to-fuchsia-100">
          <span className="load-heart text-6xl">💜</span>
          <p className="mt-6 text-lg font-bold tracking-[0.3em] text-violet-500 uppercase">Hayman Oo</p>
          <div className="mt-6 flex gap-2">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="load-dot h-3 w-3 rounded-full bg-violet-400" />
            ))}
          </div>
        </div>
      )}

      <Background3D />

      <nav className="fixed top-0 z-50 flex w-full flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-violet-200/50 bg-white/50 px-3 py-3 backdrop-blur-xl sm:px-10 sm:py-5">
        <a href="#home" className="nav-item text-base font-extrabold tracking-widest text-violet-600 sm:text-xl">HAYMAN<span className="text-fuchsia-400">♡</span></a>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold text-violet-900/60 sm:gap-8 sm:text-sm">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="nav-item transition hover:text-violet-500">{l.label}</a>
          ))}
          <button
            onClick={() => setLang(lang === 'my' ? 'en' : 'my')}
            className="nav-item rounded-full hover:cursor-pointer border border-violet-300 bg-white/70 px-3 py-1 text-violet-600 transition hover:bg-violet-100"
          >
            {lang === 'my' ? 'EN' : 'မြန်မာ'}
          </button>
        </div>
      </nav>

      <section id="home" className="relative flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <p className="hero-sub mb-4 text-xs font-bold tracking-[0.35em] text-violet-400 uppercase sm:text-sm">{tr.welcome}</p>
        <span className="hero-sparkle absolute left-[12%] top-[20%] text-3xl">✨</span>
        <span className="hero-sparkle absolute right-[12%] top-[24%] text-2xl">🎀</span>
        <span className="hero-sparkle absolute bottom-[20%] left-[18%] text-2xl">💜</span>
        <span className="hero-sparkle absolute right-[16%] bottom-[18%] text-3xl">🎁</span>
        <h1 className="text-4xl font-extrabold leading-tight sm:text-6xl md:text-7xl">
          <span className="hero-line block">{tr.greeting} <span className="bg-gradient-to-r from-violet-500 to-fuchsia-400 bg-clip-text text-transparent">{tr.name}</span></span>
          <span className="hero-line block">{tr.role}</span>
        </h1>
        <p className="hero-sub mt-6 max-w-xl text-sm text-violet-900/60 sm:text-base">{tr.tagline}</p>
        <a href="#services" className="hero-sub mt-10 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400 px-8 py-3 text-sm font-bold tracking-widest text-white uppercase shadow-xl shadow-violet-300/60 transition hover:scale-105">
          {tr.cta}
        </a>
      </section>

      <div className="overflow-hidden border-y border-violet-200/60 bg-white/50 py-4 backdrop-blur">
        <div className="marquee flex w-max gap-10 whitespace-nowrap text-sm font-bold tracking-widest text-violet-400 uppercase">
          {[...Array(2)].map((_, k) => (
            <span key={k} className="flex gap-10">
              {tr.marquee.map((m) => <span key={m}>{m}</span>)}
            </span>
          ))}
        </div>
      </div>

      <section id="about" className="mx-auto max-w-3xl px-5 py-20 text-center sm:py-24">
        <h2 className="reveal bg-gradient-to-r from-violet-500 to-fuchsia-400 bg-clip-text text-2xl font-extrabold text-transparent sm:text-4xl">{tr.aboutTitle}</h2>
        <p className="reveal mt-6 text-base leading-relaxed text-violet-900/70 sm:text-lg">{tr.about}</p>
      </section>

      <section id="services" className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
        <h2 className="reveal text-center text-2xl font-extrabold text-violet-500 sm:text-4xl">{tr.servicesTitle}</h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tr.services.map((p) => (
            <div key={p.title} className="project-card rounded-3xl border border-violet-200/70 bg-white/60 p-6 shadow-lg shadow-violet-100 backdrop-blur-md transition duration-300 hover:-translate-y-2 hover:border-violet-300 hover:shadow-2xl hover:shadow-violet-200/60">
              <span className="float-emoji inline-block text-3xl">{p.emoji}</span>
              <span className="ml-3 text-xs font-bold tracking-widest text-violet-400 uppercase">{p.tag}</span>
              <h3 className="mt-2 text-lg font-extrabold text-violet-950 sm:text-xl">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-violet-900/60">{p.desc}</p>
              {p.link && (
                <a href={p.link} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-violet-500 transition hover:text-fuchsia-500">
                  TikTok →
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <section id="location" className="mx-auto max-w-4xl px-5 py-20 text-center sm:py-24">
        <h2 className="reveal text-2xl font-extrabold text-violet-500 sm:text-4xl">{tr.locationTitle}</h2>
        <p className="reveal mt-5 text-violet-900/70">{tr.locationName}</p>
        <p className="reveal mt-2 inline-block rounded-full border border-violet-200 bg-white/60 px-5 py-2 text-sm font-bold text-violet-600 backdrop-blur">{tr.hours}</p>
        <div className="reveal mx-auto mt-10 max-w-3xl overflow-hidden rounded-3xl border border-violet-200/70 shadow-2xl shadow-violet-200/50">
          <iframe
            title="Hayman Oo Gift Shop location"
            src="https://www.google.com/maps?q=Hayman+Oo+Gift+Shop,+Butar+Street,+Waw+08070&output=embed"
            className="h-80 w-full sm:h-96"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <a href="https://maps.app.goo.gl/WXVszpRpf3hBMzFcA" target="_blank" rel="noreferrer" className="reveal mt-8 inline-block rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400 px-8 py-3 text-sm font-bold tracking-widest text-white uppercase shadow-xl shadow-violet-300/60 transition hover:scale-105">
          {tr.openMap}
        </a>
      </section>

      <section id="contact" className="mx-auto max-w-3xl px-5 py-20 text-center sm:py-24">
        <h2 className="reveal text-2xl font-extrabold text-violet-500 sm:text-4xl">{tr.contactTitle}</h2>
        <p className="reveal mt-5 text-violet-900/60">{tr.contactSub}</p>
        <div className="reveal mx-auto mt-10 w-full max-w-sm" style={{ perspective: '1000px' }}>
          <img
            src="/business-card.jpg"
            alt="Hayman Oo business card"
            className="business-card w-full rounded-3xl border border-violet-200/70 shadow-2xl shadow-violet-300/50"
            style={{ transformStyle: 'preserve-3d' }}
          />
        </div>
        <div className="reveal mt-10 flex flex-wrap justify-center gap-4">
          <a href="https://www.tiktok.com/@mochi_s.era?_r=1&_t=ZS-9ADgm3tVUQh" target="_blank" rel="noreferrer" aria-label="TikTok" className="contact-btn flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400 px-8 py-3 text-sm font-bold tracking-widest text-white uppercase shadow-xl shadow-violet-300/50 transition hover:scale-105">
            <TikTokIcon /> TikTok
          </a>
          <a href="https://www.facebook.com/share/14rxomJwUuk/" target="_blank" rel="noreferrer" aria-label="Facebook" className="contact-btn flex items-center gap-2 rounded-full bg-white/70 border border-violet-300 px-8 py-3 text-sm font-bold tracking-widest text-violet-600 uppercase shadow-xl shadow-violet-200/50 backdrop-blur transition hover:scale-105">
            <FacebookIcon /> Facebook
          </a>
        </div>
      </section>

      <footer className="border-t border-violet-200/60 py-8 text-center text-xs text-violet-900/40 sm:text-sm">
        © 2026 Hayman Oo ♡ Made with love <a href="https://github.com/Xennus352" target="_blank" rel="noreferrer" className="font-bold text-violet-500 hover:underline">SMK</a>
      </footer>
    </div>
  )
}
