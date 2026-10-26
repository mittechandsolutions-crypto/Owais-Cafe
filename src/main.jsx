import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { AnimatePresence, animate, motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowDown, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Clock3, Flame, Instagram, MapPin, Menu as MenuIcon, Navigation, Phone, Star, Truck, Utensils, UserRound, X } from 'lucide-react'
import { business, galleryImages, menuCategories, menuItems, reviews, signatures, whatsappLink } from './data'
import AccountPage from './Account'
import './style.css'

const imagePath = (name) => `${import.meta.env.BASE_URL}images/${name}`
const sitePath = (path = '') => `${import.meta.env.BASE_URL}${path}`
const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

function SectionTitle({ eyebrow, children, note, light = false }) {
  return (
    <div className={`section-title ${light ? 'section-title-light' : ''}`} data-reveal>
      <span className="eyebrow"><i />{eyebrow}</span>
      <div className="title-row">
        <h2>{children}</h2>
        {note && <p>{note}</p>}
      </div>
    </div>
  )
}

function OrderLink({ children = 'Order on WhatsApp', message = 'Hi Owais Cafe! I would like to place an order.', className = '' }) {
  return <a className={`button button-orange ${className}`} href={whatsappLink(message)} target="_blank" rel="noreferrer">{children}<ArrowUpRight size={16} /></a>
}

function Preloader({ onDone }) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, 1250)
    return () => window.clearTimeout(timer)
  }, [onDone])
  return <motion.div className="preloader" initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.55 } }} aria-label="Loading Owais Cafe">
    <div className="preloader-mark"><Flame size={35} fill="currentColor" /><span>OWAIS<span className="preloader-dot">.</span></span></div>
    <div className="loader-line"><i /></div>
    <p>FIRE. FLAVOUR. DASKA.</p>
  </motion.div>
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const links = [['Home', '#home'], ['Menu', '#menu'], ['About', '#about'], ['Gallery', '#gallery'], ['Reviews', '#reviews'], ['Contact', '#contact']]
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    document.body.classList.toggle('nav-open', open)
    return () => document.body.classList.remove('nav-open')
  }, [open])
  return <>
    <header className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <a href="#home" className="brand" aria-label="Owais Cafe home" onClick={() => setOpen(false)}>
        <span className="brand-icon"><Flame size={22} fill="currentColor" /></span>
        <span className="brand-copy"><strong>OWAIS<span>.</span></strong><small>CAFE · GRILL · FAST FOOD</small></span>
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {links.map(([name, href]) => <a key={href} href={href}>{name}</a>)}
      </nav>
      <a className="account-link" href={sitePath('account/')}><UserRound size={15} /> <span>My account</span></a>
      <OrderLink className="nav-order">Order on WhatsApp</OrderLink>
      <button className={`menu-toggle ${open ? 'is-open' : ''}`} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? <X /> : <MenuIcon />}
      </button>
    </header>
    <AnimatePresence>
      {open && <motion.nav className="mobile-nav" aria-label="Mobile navigation" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}>
        <span className="eyebrow"><i /> FIND YOUR FAVOURITE</span>
        {links.map(([name, href], index) => <motion.a key={href} href={href} onClick={() => setOpen(false)} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 * index }}>{name}<ArrowUpRight size={20} /></motion.a>)}
        <motion.a href={sitePath('account/')} onClick={() => setOpen(false)} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 * links.length }}>My account<UserRound size={19} /></motion.a>
        <OrderLink className="mobile-order" />
        <p>Flame. Flavour. Daska.</p>
      </motion.nav>}
    </AnimatePresence>
  </>
}

function CursorGlow() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const springX = useSpring(x, { stiffness: 160, damping: 24 })
  const springY = useSpring(y, { stiffness: 160, damping: 24 })
  useEffect(() => {
    const move = (event) => { x.set(event.clientX); y.set(event.clientY) }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [x, y])
  return <motion.div className="cursor-glow" style={{ x: springX, y: springY }} aria-hidden="true" />
}

function Hero() {
  return <section className="hero" id="home">
    <div className="hero-backdrop" />
    <div className="hero-grid">
      <motion.div className="hero-copy" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 1.18 } } }}>
        <motion.div variants={fadeUp} className="hero-kicker"><span className="live-dot" /> THE GRILL THAT PUT DASKA ON THE MAP</motion.div>
        <motion.h1 variants={fadeUp}>DASKA'S BEST<br /><span>GRILLED</span> BURGERS<span className="headline-period">.</span></motion.h1>
        <motion.p variants={fadeUp} className="hero-description">Real fire. Real flavour. The kind of burger you’ll be thinking about tomorrow.</motion.p>
        <motion.div variants={fadeUp} className="hero-actions">
          <OrderLink>Order Now</OrderLink>
          <a className="button button-ghost" href="#menu">Explore the menu <ArrowDown size={15} /></a>
        </motion.div>
        <motion.div variants={fadeUp} className="hero-proof">
          <div className="rating-badge"><Star size={17} fill="currentColor" /><strong>4.9</strong><span>/ 5</span></div>
          <div className="proof-divider" />
          <div><div className="proof-stars">★★★★★</div><p>LOVED BY DASKA · {business.reviewsCount} GOOGLE REVIEWS</p></div>
        </motion.div>
      </motion.div>
      <div className="hero-visual">
        <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
        <motion.div className="hero-image-wrap" initial={{ opacity: 0, scale: 0.88, rotate: 3 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1.1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}>
          <img src={imagePath('hero-burger.webp')} alt="Owais Cafe's juicy flame-grilled beef burger" width="880" height="880" fetchpriority="high" />
        </motion.div>
        <motion.div className="float-note float-note-top" animate={{ y: [0, -9, 0], rotate: [0, 3, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}><span>100%</span><small>FLAME<br />GRILLED</small></motion.div>
        <motion.div className="float-note float-note-bottom" animate={{ y: [0, 8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}><Flame size={17} fill="currentColor" /><span>THE REAL<br />DEAL</span></motion.div>
        <div className="hero-open"><span className="live-dot" /> OPEN TILL <b>2 AM</b></div>
      </div>
    </div>
    <div className="hero-foot"><span>31°42' N — DASKA, PAKISTAN</span><a href="#signatures">SCROLL TO DISCOVER <ArrowDown size={13} /></a><span>MADE FRESH. EVERY DAY.</span></div>
  </section>
}

function Marquee() {
  const text = 'GRILL · BURGERS · WRAPS · FAST FOOD · OPEN TILL 2 AM · '
  return <div className="marquee" aria-label="Grill, burgers, wraps, fast food, open till 2 AM"><div className="marquee-track">{Array.from({ length: 4 }, (_, index) => <span key={index}>{text}</span>)}</div></div>
}

function Signatures() {
  const container = useRef(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let context
    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      import('gsap').then(({ gsap }) => {
        gsap.registerPlugin(ScrollTrigger)
        context = gsap.context(() => {
          gsap.fromTo('.signature-card', { y: 55, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.16, ease: 'power3.out', scrollTrigger: { trigger: container.current, start: 'top 78%' } })
        }, container)
      })
    })
    return () => context?.revert()
  }, [])
  return <section className="section signature-section" id="signatures" ref={container}>
    <div className="section-inner">
      <SectionTitle eyebrow="THE ONES YOU COME BACK FOR" note="Sourced fresh. Seasoned with love. Finished over real flame.">House<br className="mobile-break" /> signatures<span className="orange">.</span></SectionTitle>
      <div className="signature-grid">
        {signatures.map((dish, index) => <motion.article key={dish.title} className={`signature-card signature-card-${index + 1}`} whileHover={{ y: -8, rotateX: 2, rotateY: index === 1 ? -2 : 2 }} transition={{ type: 'spring', stiffness: 250, damping: 20 }}>
          <div className="signature-image"><img src={imagePath(dish.image)} alt={dish.alt} width="720" height="820" loading="lazy" /><span className="dish-number">0{index + 1}</span><span className="dish-tag">{dish.tag}</span></div>
          <div className="signature-info"><div><h3>{dish.title}</h3><p>{dish.subtitle}</p></div><span>{dish.price}</span></div>
        </motion.article>)}
      </div>
      <div className="center-cta"><a className="text-link" href="#menu">MEET THE WHOLE MENU <ArrowRight size={16} /></a></div>
    </div>
  </section>
}

function Menu() {
  const [active, setActive] = useState(menuCategories[0])
  const [selected, setSelected] = useState(null)
  const filtered = menuItems.filter((item) => item.category === active)
  useEffect(() => {
    if (!selected) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selected])
  return <section className="section menu-section" id="menu">
    <div className="section-inner">
      <SectionTitle eyebrow="SOMETHING FOR EVERY CRAVING" note="Big flavour, honest prices. Made fresh when you order.">Good things<br className="mobile-break" /> on the grill<span className="orange">.</span></SectionTitle>
      <div className="menu-tabs" role="tablist" aria-label="Menu categories">
        {menuCategories.map((category) => <button key={category} role="tab" aria-selected={active === category} className={active === category ? 'active' : ''} onClick={() => setActive(category)}>{category}</button>)}
      </div>
      <motion.div className="menu-grid" layout>
        <AnimatePresence mode="popLayout">
          {filtered.map((item) => <motion.article key={item.id} className="menu-card" layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
            <button className="menu-image" onClick={() => setSelected(item)} aria-label={`View ${item.name}`}><img src={imagePath(item.image)} alt={item.alt} width="520" height="380" loading="lazy" /><span className="image-view"><ArrowUpRight size={17} /></span></button>
            <div className="menu-card-copy"><div className="menu-name-price"><h3>{item.name}</h3><span>₨ {item.price.toLocaleString('en-PK')}</span></div><p>{item.description}</p><a href={whatsappLink(`Hi Owais Cafe! I'd like to order ${item.name}.`)} target="_blank" rel="noreferrer" className="menu-order">ORDER THIS <ArrowUpRight size={13} /></a></div>
          </motion.article>)}
        </AnimatePresence>
      </motion.div>
      <p className="menu-disclaimer">Menu items and prices are illustrative. Please confirm current availability and pricing when ordering.</p>
    </div>
    <AnimatePresence>
      {selected && <motion.div className="dish-modal" role="dialog" aria-modal="true" aria-label={selected.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)}>
        <motion.div className="dish-modal-card" initial={{ y: 20, scale: 0.96 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.96 }} onClick={(event) => event.stopPropagation()}>
          <button className="modal-close" aria-label="Close item details" onClick={() => setSelected(null)}><X size={20} /></button>
          <img src={imagePath(selected.image)} alt={selected.alt} width="640" height="440" />
          <div><span className="eyebrow"><i /> FROM OUR {selected.category.toUpperCase()}</span><h3>{selected.name}</h3><p>{selected.description}</p><div className="modal-bottom"><strong>₨ {selected.price.toLocaleString('en-PK')}</strong><OrderLink message={`Hi Owais Cafe! I'd like to order ${selected.name}.`}>Order this <ArrowUpRight size={16} /></OrderLink></div></div>
        </motion.div>
      </motion.div>}
    </AnimatePresence>
  </section>
}

function Counter({ value, decimals = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-30px' })
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => decimals ? latest.toFixed(decimals) : Math.round(latest).toString())
  useEffect(() => {
    if (!inView) return
    const controls = animate(count, value, { duration: 1.35, ease: 'easeOut' })
    return controls.stop
  }, [count, inView, value])
  return <motion.span ref={ref} className="counter-number">{rounded}</motion.span>
}

function About() {
  return <section className="section about-section" id="about">
    <div className="section-inner about-grid">
      <div className="about-photo" data-reveal><img src={imagePath('cafe-interior.webp')} alt="Warm lights and a welcoming corner inside Owais Cafe" width="850" height="1050" loading="lazy" /><span className="about-photo-label"><Flame size={17} fill="currentColor" /> BUILT AROUND THE GRILL</span><span className="photo-outline" /></div>
      <div className="about-copy">
        <SectionTitle eyebrow="A LITTLE PLACE WITH A BIG FLAME">Good food.<br />No shortcuts<span className="orange">.</span></SectionTitle>
        <p className="about-lead">Some places just get it right. Owais Cafe is one of them.</p>
        <p className="about-body">We keep the grill hot, the ingredients fresh and the welcome warm. Come in for the beef burger Daska can't stop talking about, stay for a wrap, a chai and one more story.</p>
        <a href="#contact" className="text-link">COME SAY SALAAM <ArrowRight size={16} /></a>
        <div className="stats-grid">
          <div><strong><Counter value={4.9} decimals={1} /><span>★</span></strong><small>GOOGLE RATING</small></div>
          <div><strong><Counter value={69} /><span>+</span></strong><small>GOOGLE REVIEWS</small></div>
          <div><strong><Counter value={2} /><span>AM</span></strong><small>OPEN LATE, DAILY</small></div>
          <div><strong><Flame size={25} /></strong><small>FRESH OFF THE GRILL</small></div>
        </div>
      </div>
    </div>
  </section>
}

function Services() {
  const serviceCards = [
    { title: 'Dine-in', copy: 'Settle in, bring your people and let us take care of dinner.', icon: Utensils, num: '01' },
    { title: 'Drive-through', copy: 'Your favourite grilled fix, ready for the road.', icon: Navigation, num: '02' },
    { title: 'No-contact delivery', copy: 'Hot, fresh flavour delivered right to your door.', icon: Truck, num: '03' },
  ]
  return <section className="section service-section">
    <div className="section-inner">
      <SectionTitle eyebrow="YOUR TABLE, YOUR WAY" note="However you like to do dinner, we've got you.">Made for the<br className="mobile-break" /> way you roll<span className="orange">.</span></SectionTitle>
      <div className="services-grid">{serviceCards.map(({ title, copy, icon: Icon, num }) => <motion.article key={title} className="service-card" whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}><span className="service-num">{num}</span><div className="service-icon"><Icon size={23} strokeWidth={1.6} /></div><h3>{title}</h3><p>{copy}</p><ArrowUpRight className="service-arrow" size={18} /></motion.article>)}</div>
    </div>
  </section>
}

function Gallery() {
  const [lightbox, setLightbox] = useState(null)
  useEffect(() => {
    const close = (event) => { if (event.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [])
  return <section className="section gallery-section" id="gallery">
    <div className="section-inner">
      <SectionTitle eyebrow="A TASTE BEFORE YOU ARRIVE" note="A few glimpses of the good stuff.">Fresh off<br className="mobile-break" /> the flame<span className="orange">.</span></SectionTitle>
      <div className="gallery-grid">{galleryImages.map((item, index) => <button key={item.image} className={`gallery-item gallery-item-${index + 1}`} onClick={() => setLightbox(item)} aria-label={`Open photo: ${item.alt}`}><img src={imagePath(item.image)} alt={item.alt} width="760" height="650" loading="lazy" /><span>VIEW PHOTO <ArrowUpRight size={14} /></span></button>)}</div>
    </div>
    <AnimatePresence>{lightbox && <motion.div className="lightbox" role="dialog" aria-modal="true" aria-label={lightbox.alt} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightbox(null)}><button aria-label="Close gallery" onClick={() => setLightbox(null)}><X /></button><motion.img src={imagePath(lightbox.image)} alt={lightbox.alt} initial={{ scale: 0.94 }} animate={{ scale: 1 }} /></motion.div>}</AnimatePresence>
  </section>
}

function Reviews() {
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    const timer = window.setInterval(() => setCurrent((index) => (index + 1) % reviews.length), 6000)
    return () => window.clearInterval(timer)
  }, [])
  const change = (direction) => setCurrent((index) => (index + direction + reviews.length) % reviews.length)
  return <section className="reviews-section" id="reviews">
    <div className="review-orb" />
    <div className="section-inner review-inner">
      <div className="review-side"><span className="eyebrow"><i /> WORD ON THE STREET</span><h2>The people<br />have <span>spoken.</span></h2><p>Real words from our neighbours. And honestly? They make our day.</p><div className="review-score"><strong>4.9</strong><span className="score-stars">★★★★★</span><small>BASED ON {business.reviewsCount} GOOGLE REVIEWS</small></div></div>
      <div className="review-card">
        <div className="review-stars" aria-label="5 out of 5 stars">★★★★★</div>
        <div className="quote-mark">“</div>
        <div className="review-quote-frame"><AnimatePresence mode="wait"><motion.blockquote key={current} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>“{reviews[current]}”</motion.blockquote></AnimatePresence></div>
        <div className="review-card-bottom"><div className="google-avatar">G</div><div><strong>Google Reviewer</strong><small>LOCAL GUIDE · DASKA</small></div><span className="review-source">GOOGLE</span></div>
        <div className="review-controls"><span>0{current + 1} <i>/</i> 0{reviews.length}</span><div><button onClick={() => change(-1)} aria-label="Previous review"><ChevronLeft size={18} /></button><button onClick={() => change(1)} aria-label="Next review"><ChevronRight size={18} /></button></div></div>
      </div>
    </div>
  </section>
}

function Contact() {
  return <section className="section contact-section" id="contact">
    <div className="section-inner">
      <SectionTitle eyebrow="COME HUNGRY, LEAVE HAPPY" note="Your seat at the table is waiting.">Find us in<br className="mobile-break" /> Daska<span className="orange">.</span></SectionTitle>
      <div className="contact-grid">
        <div className="contact-details">
          <a className="contact-line" href={`https://www.google.com/maps/search/?api=1&query=${business.mapQuery}`} target="_blank" rel="noreferrer"><span className="contact-icon"><MapPin size={19} /></span><span><small>THE ADDRESS</small><strong>{business.address}</strong></span><ArrowUpRight size={16} /></a>
          <a className="contact-line" href={`tel:${business.phone.replaceAll(' ', '')}`}><span className="contact-icon"><Phone size={18} /></span><span><small>CALL OR WHATSAPP</small><strong>{business.phone}</strong></span><ArrowUpRight size={16} /></a>
          <div className="contact-line"><span className="contact-icon"><Clock3 size={19} /></span><span><small>WHEN TO FIND US</small><strong>{business.hours}</strong></span><span className="open-status"><i /> OPEN DAILY</span></div>
          <div className="contact-service-note"><Flame size={17} fill="currentColor" /> DINE-IN <i /> DRIVE-THROUGH <i /> DELIVERY</div>
          <a href={`tel:${business.phone.replaceAll(' ', '')}`} className="button button-orange call-mobile"><Phone size={16} /> Call Owais Cafe</a>
        </div>
        <div className="map-frame"><iframe title="Map showing Owais Cafe in Daska, Pakistan" src={`https://maps.google.com/maps?q=${business.mapQuery}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /><a className="map-label" href={`https://www.google.com/maps/search/?api=1&query=${business.mapQuery}`} target="_blank" rel="noreferrer"><span className="map-marker"><MapPin size={17} fill="currentColor" /></span><span><strong>OWAIS CAFE</strong><small>SHOP # 10 · DASKA</small></span><ArrowUpRight size={16} /></a></div>
      </div>
    </div>
  </section>
}

function Footer() {
  return <footer className="footer">
    <div className="section-inner">
      <div className="footer-main"><a href="#home" className="brand footer-brand"><span className="brand-icon"><Flame size={23} fill="currentColor" /></span><span className="brand-copy"><strong>OWAIS<span>.</span></strong><small>CAFE · GRILL · FAST FOOD</small></span></a><p>Real fire. Real flavour.<br />Right here in Daska.</p><OrderLink className="footer-order">Order on WhatsApp</OrderLink></div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} OWAIS CAFE. MADE FRESH IN DASKA.</span><nav aria-label="Footer navigation"><a href="#menu">MENU</a><a href="#about">OUR STORY</a><a href="#contact">FIND US</a></nav><a className="instagram-placeholder" href="https://instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={16} /> FOLLOW ALONG</a></div>
    </div>
  </footer>
}

function App() {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [reduceMotion, setReduceMotion] = useState(false)
  const mainRef = useRef(null)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduceMotion(media.matches)
    update()
    media.addEventListener?.('change', update)
    return () => media.removeEventListener?.('change', update)
  }, [])
  useEffect(() => {
    let lenis
    let frame
    let context
    if (!reduceMotion) {
      import('lenis').then(({ default: Lenis }) => {
        lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 0.9 })
        const raf = (time) => { lenis.raf(time); frame = requestAnimationFrame(raf) }
        frame = requestAnimationFrame(raf)
      })
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        import('gsap').then(({ gsap }) => {
          gsap.registerPlugin(ScrollTrigger)
          context = gsap.context(() => {
            gsap.utils.toArray('[data-reveal]').forEach((element) => gsap.fromTo(element, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 88%', once: true } }))
          }, mainRef)
        })
      })
    }
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      setProgress(scrollable > 0 ? window.scrollY / scrollable : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); lenis?.destroy(); context?.revert() }
  }, [reduceMotion])
  return <>
    <div className="grain" aria-hidden="true" />
    <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
    {!reduceMotion && <CursorGlow />}
    <AnimatePresence>{loading && <Preloader onDone={() => setLoading(false)} />}</AnimatePresence>
    <Navbar />
    <main ref={mainRef}>
      <Hero />
      <Marquee />
      <Signatures />
      <Menu />
      <About />
      <Services />
      <Gallery />
      <Reviews />
      <Contact />
    </main>
    <a className="whatsapp-float" href={whatsappLink('Hi Owais Cafe! I would like to place an order.')} target="_blank" rel="noreferrer" aria-label="Order on WhatsApp"><Phone size={20} /><span>ORDER NOW</span></a>
    <Footer />
  </>
}

const basePath = import.meta.env.BASE_URL.replace(/\/+$/, '')
const currentPath = window.location.pathname.replace(/\/+$/, '') || '/'
createRoot(document.getElementById('root')).render(currentPath === `${basePath}/account` ? <AccountPage /> : <App />)
