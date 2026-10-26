import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, ChevronRight, Flame, Heart, LockKeyhole, LogOut, Mail, PackageOpen, ShieldCheck, ShoppingBag, UserRound, Utensils, X } from 'lucide-react'
import { menuItems } from './data'

const ACCOUNTS_KEY = 'owais-cafe-demo-accounts'
const SESSION_KEY = 'owais-cafe-demo-session'
const sitePath = (path = '') => `${import.meta.env.BASE_URL}${path}`

function readStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}

async function hashPassword(password) {
  if (!window.crypto?.subtle) throw new Error('Password protection is unavailable in this browser context.')
  const data = new TextEncoder().encode(password)
  const digest = await window.crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

function CafeMark({ compact = false }) {
  return <a href={sitePath()} className={`account-brand ${compact ? 'account-brand-compact' : ''}`} aria-label="Owais Cafe home">
    <span className="account-brand-icon"><Flame size={compact ? 19 : 23} fill="currentColor" /></span>
    <span><strong>OWAIS<span>.</span></strong><small>CAFE · GRILL · FAST FOOD</small></span>
  </a>
}

function AuthPage({ onSignIn }) {
  const [mode, setMode] = useState('login')
  const [values, setValues] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const isSignup = mode === 'signup'
  const isReset = mode === 'reset'

  const switchMode = (nextMode) => {
    setMode(nextMode)
    setError('')
    setNotice('')
  }

  const updateValue = (event) => setValues((current) => ({ ...current, [event.target.name]: event.target.value }))

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setNotice('')
    setBusy(true)
    try {
      const accounts = readStorage(ACCOUNTS_KEY, [])
      const email = values.email.trim().toLowerCase()
      const existing = accounts.find((account) => account.email === email)

      if (mode === 'signup') {
        if (existing) throw new Error('An account with this email already exists. Sign in instead.')
        if (values.password.length < 8) throw new Error('Use a password with at least 8 characters.')
        if (values.password !== values.confirm) throw new Error('Those passwords do not match.')
        const account = {
          name: values.name.trim(),
          email,
          phone: values.phone.trim(),
          passwordHash: await hashPassword(values.password),
          favorites: [],
          createdAt: new Date().toISOString(),
        }
        localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([...accounts, account]))
        const session = { name: account.name, email, phone: account.phone, favorites: account.favorites, createdAt: account.createdAt }
        localStorage.setItem(SESSION_KEY, JSON.stringify(session))
        onSignIn(session)
      } else if (mode === 'reset') {
        if (!existing) throw new Error('No demo account was found for that email on this device.')
        if (values.password.length < 8) throw new Error('Use a password with at least 8 characters.')
        if (values.password !== values.confirm) throw new Error('Those passwords do not match.')
        const passwordHash = await hashPassword(values.password)
        localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts.map((account) => account.email === email ? { ...account, passwordHash } : account)))
        setNotice('Password updated on this device. You can sign in now.')
        setValues((current) => ({ ...current, password: '', confirm: '' }))
        setMode('login')
      } else {
        if (!existing || existing.passwordHash !== await hashPassword(values.password)) throw new Error('Email or password is incorrect for this device.')
        const session = { name: existing.name, email, phone: existing.phone, favorites: existing.favorites ?? [], createdAt: existing.createdAt }
        localStorage.setItem(SESSION_KEY, JSON.stringify(session))
        onSignIn(session)
      }
    } catch (submitError) {
      setError(submitError.message || 'Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return <main className="account-shell">
    <div className="account-atmosphere" aria-hidden="true"><i /><i /><i /></div>
    <header className="account-topbar"><CafeMark /><a href={sitePath()} className="back-to-site"><ArrowLeft size={15} /> Back to the cafe</a></header>
    <div className="auth-layout">
      <motion.section className="auth-story" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65 }}>
        <span className="account-eyebrow"><i /> GOOD TO HAVE YOU HERE</span>
        <h1>Your table.<br />Your <span>favourites.</span></h1>
        <p>Sign in to keep your Owais Cafe details and favourite orders close at hand.</p>
        <div className="auth-story-foot"><div className="auth-flame"><Flame size={18} fill="currentColor" /></div><span>FRESH OFF THE GRILL<br /><b>RIGHT HERE IN DASKA</b></span><span className="story-rule" /><span className="story-coordinate">31°42' N<br />DASKA, PK</span></div>
      </motion.section>
      <motion.section className="auth-panel" initial={{ opacity: 0, y: 28, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .7, delay: .12 }}>
        <div className="auth-panel-heading">
          <span className="account-eyebrow"><i /> {isReset ? 'ACCOUNT RECOVERY' : isSignup ? 'MAKE YOURSELF AT HOME' : 'WELCOME BACK'}</span>
          <h2>{isReset ? 'Reset password' : isSignup ? 'Create an account' : 'Sign in'}</h2>
          <p>{isReset ? 'Choose a new password for your local demo account.' : isSignup ? 'A few details, and you’re all set.' : 'Pick up where your cravings left off.'}</p>
        </div>
        <form className="auth-form" onSubmit={submit}>
          {isSignup && <label>Your name<input name="name" autoComplete="name" value={values.name} onChange={updateValue} placeholder="Name you go by" required maxLength={70} /></label>}
          <label>Email address<span className="auth-input-wrap"><Mail size={16} /><input type="email" name="email" autoComplete="email" value={values.email} onChange={updateValue} placeholder="you@example.com" required /></span></label>
          {isSignup && <label>Phone number <span className="optional-label">OPTIONAL</span><input type="tel" name="phone" autoComplete="tel" value={values.phone} onChange={updateValue} placeholder="+92 3XX XXXXXXX" /></label>}
          {!isReset && <label>Password<span className="auth-input-wrap"><LockKeyhole size={16} /><input type="password" name="password" autoComplete={isSignup ? 'new-password' : 'current-password'} value={values.password} onChange={updateValue} placeholder={isSignup ? 'At least 8 characters' : 'Your password'} required minLength={isSignup ? 8 : undefined} /></span></label>}
          {(isSignup || isReset) && <label>Confirm password<input type="password" name="confirm" autoComplete="new-password" value={values.confirm} onChange={updateValue} placeholder="Enter it once more" required minLength={8} /></label>}
          {error && <p className="auth-message auth-error" role="alert"><X size={15} />{error}</p>}
          {notice && <p className="auth-message auth-success" role="status"><Check size={15} />{notice}</p>}
          <button className="account-submit" type="submit" disabled={busy}>{busy ? 'PLEASE WAIT...' : isReset ? 'UPDATE PASSWORD' : isSignup ? 'CREATE ACCOUNT' : 'SIGN IN'}<ArrowRight size={16} /></button>
        </form>
        {!isSignup && !isReset && <button className="text-button forgot-link" onClick={() => switchMode('reset')}>Forgot password?</button>}
        <p className="auth-switch">{isReset ? 'Remember your password?' : isSignup ? 'Already have an account?' : 'New to Owais Cafe?'} <button className="text-button" onClick={() => switchMode(isReset || isSignup ? 'login' : 'signup')}>{isReset || isSignup ? 'Sign in' : 'Create account'}</button></p>
        <div className="demo-note"><ShieldCheck size={15} /><span><b>Local demo account</b><br />Your details stay in this browser. This is not secure production authentication.</span></div>
      </motion.section>
    </div>
    <footer className="account-footer"><span>© {new Date().getFullYear()} OWAIS CAFE</span><span>FIRE · FLAVOUR · DASKA</span></footer>
  </main>
}

function AccountDashboard({ user, onUpdate, onSignOut }) {
  const [active, setActive] = useState('overview')
  const [toast, setToast] = useState('')
  const [profile, setProfile] = useState({ name: user.name, phone: user.phone ?? '' })
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' })
  const navigation = [
    { id: 'overview', label: 'Overview', icon: UserRound },
    { id: 'orders', label: 'My orders', icon: ShoppingBag },
    { id: 'favorites', label: 'Favourites', icon: Heart },
    { id: 'profile', label: 'Profile & security', icon: LockKeyhole },
  ]
  const favorites = menuItems.filter((item) => (user.favorites ?? []).includes(item.id))

  const flash = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }

  const saveProfile = (event) => {
    event.preventDefault()
    const updated = { ...user, name: profile.name.trim(), phone: profile.phone.trim() }
    onUpdate(updated)
    flash('Profile details saved on this device.')
  }

  const savePassword = async (event) => {
    event.preventDefault()
    if (passwordForm.next.length < 8) return flash('Use a password with at least 8 characters.')
    if (passwordForm.next !== passwordForm.confirm) return flash('Those passwords do not match.')
    const accounts = readStorage(ACCOUNTS_KEY, [])
    const account = accounts.find((entry) => entry.email === user.email)
    if (!account || account.passwordHash !== await hashPassword(passwordForm.current)) return flash('Current password is incorrect.')
    const passwordHash = await hashPassword(passwordForm.next)
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts.map((entry) => entry.email === user.email ? { ...entry, passwordHash } : entry)))
    setPasswordForm({ current: '', next: '', confirm: '' })
    flash('Password updated on this device.')
  }

  const toggleFavorite = (itemId) => {
    const nextFavorites = (user.favorites ?? []).includes(itemId)
      ? user.favorites.filter((id) => id !== itemId)
      : [...(user.favorites ?? []), itemId]
    onUpdate({ ...user, favorites: nextFavorites })
  }

  return <main className="account-shell dashboard-shell">
    <div className="account-atmosphere" aria-hidden="true"><i /><i /><i /></div>
    <header className="account-topbar"><CafeMark compact /><a href={sitePath()} className="back-to-site"><ArrowLeft size={15} /> Back to the cafe</a></header>
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="sidebar-welcome"><span className="account-avatar">{user.name.trim().charAt(0).toUpperCase()}</span><span><small>YOUR ACCOUNT</small><strong>{user.name}</strong></span></div>
        <nav aria-label="Account navigation">{navigation.map(({ id, label, icon: Icon }) => <button key={id} className={active === id ? 'active' : ''} onClick={() => setActive(id)}><Icon size={17} />{label}{id === 'favorites' && user.favorites?.length > 0 && <span className="sidebar-count">{user.favorites.length}</span>}</button>)}</nav>
        <button className="sidebar-signout" onClick={onSignOut}><LogOut size={16} /> Sign out</button>
        <div className="sidebar-note"><Flame size={16} fill="currentColor" /><span>FRESH FROM THE GRILL<br /><b>OPEN TILL 2 AM</b></span></div>
      </aside>
      <section className="dashboard-content">
        <motion.div key={active} className="dashboard-view" initial={{ opacity: 0, y: 13 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .22 }}>
            {active === 'overview' && <>
              <span className="account-eyebrow"><i /> YOUR CORNER OF THE CAFE</span>
              <div className="dashboard-heading-row"><div><h1>Good to see you, <span>{user.name.split(' ')[0]}.</span></h1><p>Your Owais Cafe account, all in one place.</p></div><a href={sitePath('#menu')} className="account-outline-button"><Utensils size={16} /> Explore menu</a></div>
              <div className="account-stat-row"><article><span className="stat-icon"><ShoppingBag size={17} /></span><small>ORDERS PLACED</small><strong>0</strong><p>Orders placed in-store or on WhatsApp won’t appear here yet.</p></article><article><span className="stat-icon"><Heart size={17} /></span><small>SAVED FAVOURITES</small><strong>{user.favorites?.length ?? 0}</strong><p>Your go-to dishes are easy to find and order.</p></article></div>
              <div className="dashboard-section-heading"><div><span className="account-eyebrow"><i /> MADE FOR YOUR NEXT CRAVING</span><h2>Your favourites</h2></div><button className="text-button arrow-link" onClick={() => setActive('favorites')}>See all <ArrowRight size={15} /></button></div>
              {favorites.length ? <div className="favorite-preview">{favorites.slice(0, 2).map((item) => <article className="favorite-row" key={item.id}><img src={sitePath(`images/${item.image}`)} alt={item.alt} /><div><strong>{item.name}</strong><small>₨ {item.price.toLocaleString('en-PK')}</small></div><a href={`https://wa.me/923177876060?text=${encodeURIComponent(`Hi Owais Cafe! I'd like to order ${item.name}.`)}`} target="_blank" rel="noreferrer" aria-label={`Order ${item.name}`}><ArrowRight size={17} /></a></article>)}</div> : <div className="dashboard-empty compact-empty"><Heart size={20} /><span>Save a dish you love and it’ll show up here.</span><button className="text-button" onClick={() => setActive('favorites')}>Browse dishes</button></div>}
              <div className="account-disclaimer"><ShieldCheck size={16} /><span>Demo account: orders and saved details are stored only in this browser. Online ordering and real account sync are not connected.</span></div>
            </>}
            {active === 'orders' && <>
              <span className="account-eyebrow"><i /> ORDER HISTORY</span><h1 className="simple-dashboard-title">My orders<span>.</span></h1>
              <div className="dashboard-empty order-empty"><span className="empty-icon"><PackageOpen size={26} /></span><h2>No orders yet</h2><p>Orders placed by phone, in person, or through WhatsApp aren’t synced to this demo account.</p><a href={sitePath('#menu')} className="account-outline-button"><Utensils size={16} /> Explore the menu</a></div>
            </>}
            {active === 'favorites' && <>
              <span className="account-eyebrow"><i /> YOUR GO-TO DISHES</span><h1 className="simple-dashboard-title">Favourites<span>.</span></h1>
              <div className="all-favorites">{menuItems.map((item) => {
                const saved = (user.favorites ?? []).includes(item.id)
                return <article className={`favorite-card ${saved ? 'is-saved' : ''}`} key={item.id}><img src={sitePath(`images/${item.image}`)} alt={item.alt} /><div className="favorite-card-copy"><small>{item.category.toUpperCase()}</small><h2>{item.name}</h2><strong>₨ {item.price.toLocaleString('en-PK')}</strong><button className="favorite-toggle" onClick={() => toggleFavorite(item.id)} aria-label={saved ? `Remove ${item.name} from favourites` : `Add ${item.name} to favourites`} title={saved ? 'Remove from favourites' : 'Add to favourites'}><Heart size={17} fill={saved ? 'currentColor' : 'none'} /></button></div></article>
              })}</div>
            </>}
            {active === 'profile' && <>
              <span className="account-eyebrow"><i /> YOUR DETAILS</span><h1 className="simple-dashboard-title">Profile & security<span>.</span></h1>
              <form className="dashboard-form" onSubmit={saveProfile}><h2>Personal details</h2><label>Full name<input value={profile.name} onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))} required maxLength={70} /></label><label>Email address<input type="email" value={user.email} disabled /></label><label>Phone number<input type="tel" value={profile.phone} onChange={(event) => setProfile((current) => ({ ...current, phone: event.target.value }))} placeholder="+92 3XX XXXXXXX" /></label><button className="account-submit profile-save" type="submit">SAVE DETAILS<Check size={16} /></button></form>
              <form className="dashboard-form password-form" onSubmit={savePassword}><h2>Change password</h2><label>Current password<input type="password" autoComplete="current-password" value={passwordForm.current} onChange={(event) => setPasswordForm((current) => ({ ...current, current: event.target.value }))} required /></label><label>New password<input type="password" autoComplete="new-password" minLength={8} value={passwordForm.next} onChange={(event) => setPasswordForm((current) => ({ ...current, next: event.target.value }))} required /></label><label>Confirm new password<input type="password" autoComplete="new-password" minLength={8} value={passwordForm.confirm} onChange={(event) => setPasswordForm((current) => ({ ...current, confirm: event.target.value }))} required /></label><button className="account-outline-button" type="submit"><LockKeyhole size={15} /> Update password</button><p className="security-note"><ShieldCheck size={15} /> This local demo stores account information in your browser only.</p></form>
            </>}
        </motion.div>
      </section>
    </div>
    <AnimatePresence>{toast && <motion.div className="account-toast" role="status" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}><Check size={15} />{toast}</motion.div>}</AnimatePresence>
    <footer className="account-footer"><span>© {new Date().getFullYear()} OWAIS CAFE</span><button className="dashboard-mobile-signout" onClick={onSignOut}><LogOut size={14} /> Sign out</button><span>FIRE · FLAVOUR · DASKA</span></footer>
  </main>
}

export default function AccountPage() {
  const [user, setUser] = useState(() => readStorage(SESSION_KEY, null))

  const updateUser = (updated) => {
    setUser(updated)
    localStorage.setItem(SESSION_KEY, JSON.stringify(updated))
    const accounts = readStorage(ACCOUNTS_KEY, [])
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts.map((account) => account.email === updated.email ? { ...account, ...updated } : account)))
  }

  const signOut = () => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  return user ? <AccountDashboard user={user} onUpdate={updateUser} onSignOut={signOut} /> : <AuthPage onSignIn={setUser} />
}