import { useEffect, useState } from 'react'
import { ArrowLeft, Check, Flame, LogOut, Mail, PackageOpen, RefreshCw, ShieldCheck, Utensils, X } from 'lucide-react'
import { getSupabaseClient, OWNER_EMAIL, isSupabaseConfigured } from './supabase'

const sitePath = (path = '') => `${import.meta.env.BASE_URL}${path}`
const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled']

function CafeMark() {
  return <a href={sitePath()} className="account-brand" aria-label="Owais Cafe home">
    <span className="account-brand-icon"><Flame size={22} fill="currentColor" /></span>
    <span><strong>OWAIS<span>.</span></strong><small>CAFE · GRILL · FAST FOOD</small></span>
  </a>
}

function AdminAuth({ onMessage, initialMode = 'login', onPasswordUpdated }) {
  const [mode, setMode] = useState(initialMode)
  const [email, setEmail] = useState(OWNER_EMAIL)
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    onMessage('', '')
    setBusy(true)
    try {
      const client = await getSupabaseClient()
      if (mode === 'signup') {
        if (email.trim().toLowerCase() !== OWNER_EMAIL) throw new Error(`Owner setup is restricted to ${OWNER_EMAIL}.`)
        if (password.length < 8) throw new Error('Use a password with at least 8 characters.')
        const { data, error } = await client.auth.signUp({
          email: OWNER_EMAIL,
          password,
          options: { emailRedirectTo: `${window.location.origin}${sitePath('admin/')}` },
        })
        if (error) throw error
        if (data.session) {
          onMessage('Your owner account is ready.', '')
        } else {
          onMessage(`Check ${OWNER_EMAIL} for the verification link, then return here to sign in.`, '')
        }
      } else if (mode === 'reset') {
        if (email.trim().toLowerCase() !== OWNER_EMAIL) throw new Error(`Password recovery is restricted to ${OWNER_EMAIL}.`)
        const { error } = await client.auth.resetPasswordForEmail(OWNER_EMAIL, {
          redirectTo: `${window.location.origin}${sitePath('admin/')}`,
        })
        if (error) throw error
        onMessage(`If the owner account exists, a password reset link was sent to ${OWNER_EMAIL}.`, '')
      } else if (mode === 'password') {
        if (password.length < 8) throw new Error('Use a password with at least 8 characters.')
        const { error } = await client.auth.updateUser({ password })
        if (error) throw error
        setMode('login')
        setPassword('')
        onPasswordUpdated()
        onMessage('Owner password updated successfully.', '')
      } else {
        const { error } = await client.auth.signInWithPassword({ email: email.trim(), password })
        if (error) throw error
      }
    } catch (authError) {
      onMessage('', authError.message || 'Authentication failed. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const title = mode === 'signup' ? 'Create owner account' : mode === 'reset' ? 'Reset password' : mode === 'password' ? 'Choose a new password' : 'Owner sign in'

  return <div className="admin-auth-layout">
    <section className="auth-story">
      <span className="account-eyebrow"><i /> PRIVATE BUSINESS ACCESS</span>
      <h1>Your cafe.<br />Your <span>control.</span></h1>
      <p>Update your menu and prices, and manage website orders from one secure place.</p>
      <div className="auth-story-foot"><div className="auth-flame"><ShieldCheck size={18} /></div><span>OWNER ACCESS<br /><b>VERIFIED EMAIL REQUIRED</b></span></div>
    </section>
    <section className="auth-panel">
      <div className="auth-panel-heading">
        <span className="account-eyebrow"><i /> OWAIS CAFE ADMIN</span>
        <h2>{title}</h2>
        <p>{mode === 'signup' ? 'Create the owner login using the authorized email below.' : mode === 'reset' ? 'We’ll send a secure recovery link to the owner email.' : mode === 'password' ? 'Set a new password for the verified owner account.' : 'Sign in with your verified owner email.'}</p>
      </div>
      <form className="auth-form" onSubmit={submit}>
        {mode !== 'password' && <label>Owner email<span className="auth-input-wrap"><Mail size={16} /><input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></span></label>}
        {mode !== 'reset' && <label>{mode === 'password' ? 'New password' : 'Password'}<input type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required placeholder="At least 8 characters" /></label>}
        <button className="account-submit" type="submit" disabled={busy}>{busy ? 'PLEASE WAIT...' : mode === 'signup' ? 'CREATE OWNER ACCOUNT' : mode === 'reset' ? 'SEND RESET LINK' : mode === 'password' ? 'UPDATE PASSWORD' : 'SIGN IN'}<Check size={16} /></button>
      </form>
      {mode === 'login' && <div className="admin-auth-links"><button className="text-button" onClick={() => setMode('signup')}>First time? Set up owner account</button><button className="text-button" onClick={() => setMode('reset')}>Forgot password?</button></div>}
      {mode !== 'login' && <button className="text-button admin-back-link" onClick={() => setMode('login')}>Back to owner sign in</button>}
      <div className="demo-note"><ShieldCheck size={15} /><span>Owner access is checked by Supabase database policies. The browser never receives an admin secret.</span></div>
    </section>
  </div>
}

function AdminDashboard({ session, onSignOut, onMessage }) {
  const [active, setActive] = useState('menu')
  const [items, setItems] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState('')

  const refresh = async () => {
    setLoading(true)
    onMessage('', '')
    try {
      const client = await getSupabaseClient()
      const [menuResult, orderResult] = await Promise.all([
        client.from('menu_items').select('id,category,name,description,price,image,alt,is_available,sort_order').order('sort_order'),
        client.from('orders')
          .select('id,order_number,customer_name,phone,fulfillment,delivery_address,notes,total,status,created_at,order_items(item_name,quantity,unit_price,line_total)')
          .order('created_at', { ascending: false })
          .limit(100),
      ])
      if (menuResult.error) throw new Error(`Could not load menu: ${menuResult.error.message}`)
      if (orderResult.error) throw new Error(`Could not load orders: ${orderResult.error.message}`)
      setItems(menuResult.data ?? [])
      setOrders(orderResult.data ?? [])
    } catch (loadError) {
      onMessage('', loadError.message || 'Could not load owner data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { refresh() }, [session.access_token])

  const saveItem = async (item) => {
    setSaving(item.id)
    onMessage('', '')
    try {
      const client = await getSupabaseClient()
      const { error } = await client.from('menu_items').update({
        name: item.name.trim(),
        category: item.category.trim(),
        description: item.description.trim(),
        price: Number(item.price),
        is_available: item.is_available,
      }).eq('id', item.id)
      if (error) onMessage('', `Could not save ${item.name}: ${error.message}`)
      else onMessage(`${item.name} saved. The public menu will show the updated details.`, '')
    } catch (saveError) {
      onMessage('', saveError.message || `Could not save ${item.name}.`)
    } finally {
      setSaving('')
    }
  }

  const updateOrderStatus = async (orderId, status) => {
    setSaving(orderId)
    onMessage('', '')
    try {
      const client = await getSupabaseClient()
      const { error } = await client.from('orders').update({ status }).eq('id', orderId)
      if (error) onMessage('', `Could not update order: ${error.message}`)
      else {
        setOrders((current) => current.map((order) => order.id === orderId ? { ...order, status } : order))
        onMessage('Order status updated.', '')
      }
    } catch (updateError) {
      onMessage('', updateError.message || 'Could not update order status.')
    } finally {
      setSaving('')
    }
  }

  const setItem = (itemId, field, value) => setItems((current) => current.map((item) => item.id === itemId ? { ...item, [field]: value } : item))
  const pendingCount = orders.filter((order) => !['completed', 'cancelled'].includes(order.status)).length

  return <div className="admin-dashboard-layout">
    <aside className="admin-sidebar">
      <div className="sidebar-welcome"><span className="account-avatar"><ShieldCheck size={18} /></span><span><small>VERIFIED OWNER</small><strong>{session.user.email}</strong></span></div>
      <nav aria-label="Admin navigation">
        <button className={active === 'menu' ? 'active' : ''} onClick={() => setActive('menu')}><Utensils size={17} />Menu & prices</button>
        <button className={active === 'orders' ? 'active' : ''} onClick={() => setActive('orders')}><PackageOpen size={17} />Website orders{pendingCount > 0 && <span className="sidebar-count">{pendingCount}</span>}</button>
      </nav>
      <button className="sidebar-signout" onClick={onSignOut}><LogOut size={16} /> Sign out</button>
    </aside>
    <section className="admin-content">
      <div className="admin-heading-row">
        <div><span className="account-eyebrow"><i /> OWNER DASHBOARD</span><h1>{active === 'menu' ? 'Menu & prices' : 'Website orders'}<span>.</span></h1><p>{active === 'menu' ? 'Saved changes appear on the public menu.' : 'Orders placed through the website checkout. WhatsApp conversations are not tracked here.'}</p></div>
        <button className="account-outline-button" onClick={refresh} disabled={loading}><RefreshCw size={15} /> Refresh</button>
      </div>
      {loading ? <p className="admin-empty">Loading owner data…</p> : active === 'menu' ? <div className="admin-menu-list">
        {items.map((item) => <form className="admin-menu-item" key={item.id} onSubmit={(event) => { event.preventDefault(); saveItem(item) }}>
          <div className="admin-menu-item-heading"><div><small>{item.category}</small><h2>{item.name}</h2></div><label className="admin-availability"><input type="checkbox" checked={item.is_available} onChange={(event) => setItem(item.id, 'is_available', event.target.checked)} /> Available</label></div>
          <label className="admin-field">Item name<input value={item.name} maxLength={120} required onChange={(event) => setItem(item.id, 'name', event.target.value)} /></label>
          <label className="admin-field">Description<textarea value={item.description} onChange={(event) => setItem(item.id, 'description', event.target.value)} rows={2} /></label>
          <div className="admin-menu-item-footer"><label className="admin-field">Price (PKR)<input type="number" min="1" max="1000000" step="1" value={item.price} required onChange={(event) => setItem(item.id, 'price', event.target.value)} /></label><button className="account-submit" type="submit" disabled={saving === item.id}>{saving === item.id ? 'SAVING...' : 'SAVE CHANGES'}<Check size={15} /></button></div>
        </form>)}
        {!items.length && <p className="admin-empty">No menu items were returned. Run the Supabase schema setup and refresh.</p>}
      </div> : <div className="admin-order-list">
        {orders.map((order) => <article className="admin-order-card" key={order.id}>
          <div className="admin-order-heading"><div><small>{order.order_number} · {new Date(order.created_at).toLocaleString()}</small><h2>{order.customer_name}</h2><a href={`tel:${order.phone.replaceAll(' ', '')}`}>{order.phone}</a></div><strong>₨ {Number(order.total).toLocaleString('en-PK')}</strong></div>
          <p className="admin-order-fulfillment">{order.fulfillment.toUpperCase()}{order.delivery_address ? ` · ${order.delivery_address}` : ''}</p>
          <ul>{order.order_items.map((line) => <li key={line.item_name}>{line.quantity} × {line.item_name} <span>₨ {Number(line.line_total).toLocaleString('en-PK')}</span></li>)}</ul>
          {order.notes && <p className="admin-order-notes">Note: {order.notes}</p>}
          <label className="admin-status">Order status<select value={order.status} disabled={saving === order.id} onChange={(event) => updateOrderStatus(order.id, event.target.value)}>{statuses.map((status) => <option value={status} key={status}>{status.toUpperCase()}</option>)}</select></label>
        </article>)}
        {!orders.length && <div className="admin-empty"><PackageOpen size={30} /><h2>No website orders yet</h2><p>Orders submitted through the website checkout will appear here. WhatsApp orders have to be handled in WhatsApp.</p></div>}
      </div>}
    </section>
  </div>
}

export default function AdminPage() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [passwordRecovery, setPasswordRecovery] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined
    let active = true
    let subscription
    getSupabaseClient().then(async (client) => {
      if (!active) return
      const { data, error: sessionError } = await client.auth.getSession()
      if (sessionError) setError(`Could not check the owner session: ${sessionError.message}`)
      setSession(data?.session ?? null)
      setLoading(false)
      const { data: { subscription: authSubscription } } = client.auth.onAuthStateChange((event, nextSession) => {
        setSession(nextSession)
        if (event === 'PASSWORD_RECOVERY') {
          setPasswordRecovery(true)
          setNotice('Choose your new owner password below.')
        }
      })
      subscription = authSubscription
    }).catch((sessionError) => {
      if (!active) return
      setError(sessionError.message || 'Could not check the owner session.')
      setLoading(false)
    })
    return () => { active = false; subscription?.unsubscribe() }
  }, [])

  const setMessage = (nextNotice, nextError) => {
    setNotice(nextNotice)
    setError(nextError)
  }

  const signOut = async () => {
    try {
      const client = await getSupabaseClient()
      const { error: signOutError } = await client.auth.signOut()
      if (signOutError) setMessage('', `Could not sign out: ${signOutError.message}`)
      else setMessage('', '')
    } catch (signOutError) {
      setMessage('', signOutError.message || 'Could not sign out.')
    }
  }

  const isOwner = session?.user?.email?.toLowerCase() === OWNER_EMAIL
    && Boolean(session?.user?.email_confirmed_at)

  return <main className="account-shell admin-shell">
    <div className="account-atmosphere" aria-hidden="true"><i /><i /><i /></div>
    <header className="account-topbar"><CafeMark /><a href={sitePath()} className="back-to-site"><ArrowLeft size={15} /> Back to the cafe</a></header>
    {!isSupabaseConfigured ? <section className="admin-setup-notice">
      <ShieldCheck size={35} />
      <span className="account-eyebrow"><i /> OWNER PANEL SETUP REQUIRED</span>
      <h1>One last secure setup<span>.</span></h1>
      <p>The admin dashboard is ready, but it needs its private Supabase project configuration before sign-in, price updates, or saved orders can work.</p>
      <ol><li>Create a free Supabase project.</li><li>Run the SQL setup in <code>supabase/schema.sql</code>.</li><li>Add the project URL and public anon key to the GitHub Actions variables.</li></ol>
      <p>Only the owner email <strong>{OWNER_EMAIL}</strong> is authorized. Create your own password from the secure setup link—no password is stored in this website’s source code.</p>
      <a className="account-outline-button" href={sitePath()}>Back to the cafe</a>
    </section> : loading ? <p className="admin-loading">Checking secure owner session…</p> : passwordRecovery
      ? <AdminAuth initialMode="password" onMessage={setMessage} onPasswordUpdated={() => setPasswordRecovery(false)} />
      : isOwner
      ? <AdminDashboard session={session} onSignOut={signOut} onMessage={setMessage} />
      : session
        ? <section className="admin-setup-notice"><ShieldCheck size={35} /><h1>Owner access required<span>.</span></h1><p>This verified account does not have permission to manage Owais Cafe. Sign out and use {OWNER_EMAIL}.</p><button className="account-outline-button" onClick={signOut}>Sign out</button></section>
        : <AdminAuth onMessage={setMessage} />}
    <div className="admin-message-area" aria-live="polite">
      {notice && <p className="auth-message auth-success"><Check size={15} />{notice}</p>}
      {error && <p className="auth-message auth-error" role="alert"><X size={15} />{error}</p>}
    </div>
    <footer className="account-footer"><span>© {new Date().getFullYear()} OWAIS CAFE ADMIN</span><span>VERIFIED OWNER ACCESS</span></footer>
  </main>
}
