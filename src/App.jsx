import { useMemo, useState } from 'react'
import { Search, ShoppingBag, Plus, Minus, Clock3, MapPin, ArrowRight, Leaf, Flame, CheckCircle2, X } from 'lucide-react'

const menuItems = [
  { id: 1, name: 'Chicken Katsu Bowl', category: 'Meals', description: 'Ayam katsu renyah, nasi hangat, saus khas.', price: 28000, emoji: '🍗', tag: 'Best seller', color: 'peach' },
  { id: 2, name: 'Creamy Beef Pasta', category: 'Meals', description: 'Pasta creamy dengan beef dan taburan herbs.', price: 32000, emoji: '🍝', tag: 'Comfort food', color: 'yellow' },
  { id: 3, name: 'Classic Cheeseburger', category: 'Meals', description: 'Beef patty, keju, selada, dan burger bun.', price: 30000, emoji: '🍔', tag: 'Popular', color: 'green' },
  { id: 4, name: 'Crispy Chicken', category: 'Meals', description: 'Ayam crispy juicy dengan bumbu gurih.', price: 25000, emoji: '🍟', tag: 'Crunchy!', color: 'pink' },
  { id: 5, name: 'Iced Matcha Latte', category: 'Drinks', description: 'Matcha lembut dengan susu segar.', price: 18000, emoji: '🍵', tag: 'Fresh', color: 'green' },
  { id: 6, name: 'Brown Sugar Coffee', category: 'Drinks', description: 'Kopi susu dengan manis gula aren.', price: 20000, emoji: '🧋', tag: 'Favorite', color: 'peach' },
  { id: 7, name: 'Strawberry Milk', category: 'Drinks', description: 'Susu creamy dengan strawberry.', price: 17000, emoji: '🍓', tag: 'Sweet', color: 'pink' },
  { id: 8, name: 'Chocolate Brownie', category: 'Desserts', description: 'Brownie cokelat lembut, rich, dan fudgy.', price: 16000, emoji: '🍫', tag: 'Treat yourself', color: 'yellow' },
]

const money = n => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)

export default function App() {
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState({})
  const [customerId, setCustomerId] = useState('1')
  const [token, setToken] = useState('demo-token')

  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [orderNote, setOrderNote] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('COD')

  const [showCheckout, setShowCheckout] = useState(false)
  const [notice, setNotice] = useState(null)
  const [loading, setLoading] = useState(false)

  const filtered = useMemo(() => menuItems.filter(item =>
    (category === 'All' || item.category === category) &&
    `${item.name} ${item.description}`.toLowerCase().includes(search.toLowerCase())
  ), [category, search])
  const count = Object.values(cart).reduce((a, b) => a + b, 0)
  const total = menuItems.reduce((sum, item) => sum + item.price * (cart[item.id] || 0), 0)

  function changeQty(id, delta) {
    setCart(old => {
      const next = { ...old }
      const qty = (next[id] || 0) + delta
      if (qty <= 0) delete next[id]
      else next[id] = qty
      return next
    })
    setNotice(null)
  }

  async function checkout() {
    if (!count) {
      setNotice({ type: 'error', text: 'Pilih menu terlebih dahulu sebelum checkout.' })
      return
    }
    setLoading(true)
    setNotice(null)
    const payload = {
      idPelanggan: Number(customerId),
      tokenKartu: token.trim(),
      keranjang: Object.entries(cart).map(([idMenu, qty]) => ({ idMenu: Number(idMenu), qty }))
    }
    try {
      const response = await fetch('http://localhost:8080/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const body = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(body.message || body.error || `Request gagal (${response.status}).`)
      }
      setNotice({ type: 'success', text: `Checkout berhasil! ID pesanan: ${body.idPesanan || 'berhasil dibuat'}${body.total != null ? ` • Total ${money(body.total)}` : ''}` })
      setCart({})
      setShowCheckout(false)
    } catch (error) {
      setNotice({ type: 'error', text: `Belum berhasil mengirim checkout. ${error.message}. Pastikan backend aktif, lalu sesuaikan ID pelanggan/menu dengan data di database.` })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="QuickBite beranda">
          <span className="brand-mark">q<span>.</span></span>
          <span className="brand-name">quick<span>bite</span></span>
        </a>
        <nav className="nav-links"><a className="active" href="#menu">Menu</a><a href="#why-us">Why QuickBite?</a></nav>
        <button className="cart-button" onClick={() => setShowCheckout(true)}><ShoppingBag size={18}/><span>My order</span><b>{count}</b></button>
      </header>

      <main id="home">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot"></span> GOOD FOOD, GOOD MOOD</div>
            <h1>Your cravings,<br/>our <em>priority.</em></h1>
            <p>Comfort food favorites, made with love and delivered to your happy place.</p>
            <a href="#menu" className="primary-link">Explore our menu <ArrowRight size={17}/></a>
            <div className="hero-meta">
              <span><Clock3 size={16}/> 20–35 min</span><i></i><span><MapPin size={16}/> Delivered to you</span>
            </div>
          </div>
          <div className="hero-art">
            <div className="hero-blob"></div>
            <div className="hero-food">🍔</div>
            <div className="float-card float-top"><span className="float-icon">✦</span><div><b>Made fresh</b><small>Every single order</small></div></div>
            <div className="float-card float-bottom"><span className="rating-star">★</span><div><b>Made for cravings</b><small>Your new happy place</small></div></div>
            <span className="spark spark-one">✳</span><span className="spark spark-two">✦</span>
          </div>
        </section>

        <section className="menu-section" id="menu">
          <div className="section-heading">
            <div><div className="eyebrow muted">A LITTLE SOMETHING FOR YOU</div><h2>Find your <em>happy bite.</em></h2></div>
            <label className="search-box"><Search size={18}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search your favorites..." /></label>
          </div>
          <div className="menu-toolbar">
            <div className="categories">
              {['All', 'Meals', 'Drinks', 'Desserts'].map(c => <button key={c} onClick={() => setCategory(c)} className={category === c ? 'category active-category' : 'category'}>{c}</button>)}
            </div>
            <span className="menu-count">{filtered.length} delicious picks</span>
          </div>
          <div className="menu-grid">
            {filtered.map(item => <article className="menu-card" key={item.id}>
              <div className={`food-art ${item.color}`}><span className="food-tag">{item.tag}</span><span className="food-emoji">{item.emoji}</span><span className="food-orbit"></span></div>
              <div className="menu-card-body">
                <div className="food-category">{item.category === 'Meals' ? <Flame size={13}/> : item.category === 'Drinks' ? <Leaf size={13}/> : <span>♡</span>}{item.category}</div>
                <h3>{item.name}</h3><p>{item.description}</p>
                <div className="card-bottom"><strong>{money(item.price)}</strong>
                  {(cart[item.id] || 0) === 0 ? <button className="add-button" aria-label={`Tambah ${item.name}`} onClick={() => changeQty(item.id, 1)}><Plus size={18}/></button> :
                  <div className="quantity"><button onClick={() => changeQty(item.id, -1)} aria-label="Kurangi"><Minus size={14}/></button><b>{cart[item.id]}</b><button onClick={() => changeQty(item.id, 1)} aria-label="Tambah"><Plus size={14}/></button></div>}
                </div>
              </div>
            </article>)}
          </div>
          {filtered.length === 0 && <div className="empty-state">Menu yang kamu cari belum ada. Coba kata kunci lain, ya!</div>}
        </section>

        <section className="bottom-cta" id="why-us"><div className="cta-icon">♡</div><div><h2>Good food. No fuss.</h2><p>Just pick your favorites, and let the good bites begin.</p></div><button onClick={() => document.getElementById('menu').scrollIntoView({behavior:'smooth'})}>Order something <ArrowRight size={16}/></button></section>
      </main>

      <footer><a className="brand footer-brand" href="#home"><span className="brand-mark">q<span>.</span></span><span className="brand-name">quick<span>bite</span></span></a><span>Made with a little extra love. © 2026 QuickBite</span><span className="footer-note">Good food, good mood <span>♥</span></span></footer>

      {showCheckout && <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) setShowCheckout(false) }}>
        <section className="checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
          <div className="modal-heading"><div><div className="eyebrow muted">ALMOST THERE</div><h2 id="checkout-title">Your order<span>.</span></h2></div><button className="close-button" onClick={() => setShowCheckout(false)} aria-label="Tutup"><X size={20}/></button></div>
          {count === 0 ? <div className="empty-cart"><span>🛍️</span><h3>Your bag is waiting</h3><p>Tambahkan menu favoritmu dulu, ya.</p><button className="submit-order" onClick={() => setShowCheckout(false)}>Explore menu</button></div> : <>
            <div className="checkout-items">{menuItems.filter(item => cart[item.id]).map(item => <div className="checkout-item" key={item.id}><span className="checkout-emoji">{item.emoji}</span><div className="checkout-name"><b>{item.name}</b><small>{money(item.price)} each</small></div><div className="quantity"><button onClick={() => changeQty(item.id,-1)}><Minus size={13}/></button><b>{cart[item.id]}</b><button onClick={() => changeQty(item.id,1)}><Plus size={13}/></button></div><strong>{money(item.price * cart[item.id])}</strong></div>)}</div>
            <div className="total-row"><span>Total</span><strong>{money(total)}</strong></div>
            <div className="form-fields">
              <label>
                Nama lengkap
                <input
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                />
              </label>

              <label>
                Nomor WhatsApp
                <input
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  inputMode="tel"
                  placeholder="Contoh: 081234567890"
                />
              </label>

              <label>
                Alamat pengantaran
                <input
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Masukkan alamat pengantaran"
                />
              </label>

              <label>
                Catatan pesanan (opsional)
                <input
                  value={orderNote}
                  onChange={e => setOrderNote(e.target.value)}
                  placeholder="Contoh: jangan terlalu pedas"
                />
              </label>

              <label>
                Metode pembayaran
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value)}
                >
                  <option value="COD">Bayar di tempat (COD)</option>
                  <option value="TRANSFER">Transfer bank</option>
                  <option value="EWALLET">E-wallet</option>
                </select>
              </label>
            </div>
            <p className="demo-note">Catatan: ID pelanggan/menu harus cocok dengan data PostgreSQL. Token ini masih demo; integrasi payment gateway backend perlu dikonfigurasi.</p>
            <button
              className="submit-order"
              disabled={
                loading ||
                !customerName.trim() ||
                !phone.trim() ||
                !address.trim()
              }
              onClick={checkout}
            >
              {loading ? (
                'Mengirim pesanan...'
              ) : (
                <>
                  Checkout now <ArrowRight size={17} />
                </>
              )}
            </button>
            </>}
            </section>
            </div>}

      {notice && <div className={`toast ${notice.type}`} role="status"><span>{notice.type === 'success' ? <CheckCircle2 size={19}/> : <span>!</span>}</span><p>{notice.text}</p><button onClick={() => setNotice(null)} aria-label="Tutup notifikasi"><X size={17}/></button></div>}
    </div>
  )
}