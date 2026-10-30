import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowDown, ArrowDownWideNarrow, ArrowLeftRight, ArrowRight, ArrowUpRight,
  BookOpen, Check, ChevronDown, Clock3, Coffee, Compass,
  Headphones, Heart, Lightbulb,
  MapPin, Menu, Monitor, Navigation, Plus, Search, SlidersHorizontal, Sparkles,
  Star, UserRound, Users, Wifi, X, Zap,
} from 'lucide-react'
import {
  Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from 'recharts'

type Space = {
  id: number
  name: string
  building: string
  floor: string
  type: 'Library' | 'Laboratory' | 'Quiet zone' | 'Group study' | 'Research'
  hours: string
  quietness: number
  occupancy: number
  seats: number
  totalSeats: number
  rating: number
  facilities: string[]
  image: string
  position: { x: number; y: number }
  description: string
}

const initialSpaces: Space[] = [
  { id: 1, name: 'Central Library', building: 'Knowledge Commons', floor: 'Floors 1–4', type: 'Library', hours: 'Open until 11 PM', quietness: 5, occupancy: 38, seats: 186, totalSeats: 300, rating: 4.9, facilities: ['Wi-Fi', 'Power outlets', 'AC', 'Silent zone'], image: 'photo-1507842217343-583bb7270b66', position: { x: 43, y: 33 }, description: 'Four thoughtfully designed floors, from silent solo-study nooks to light-filled reading rooms.' },
  { id: 2, name: 'Digital Library', building: 'Innovation Block', floor: 'Floor 2', type: 'Library', hours: 'Open until 10 PM', quietness: 4, occupancy: 52, seats: 64, totalSeats: 130, rating: 4.8, facilities: ['Wi-Fi', 'Power outlets', 'AC', 'Computers'], image: 'photo-1497366754035-f200968a6e72', position: { x: 68, y: 25 }, description: 'A modern digital-first library with collaborative screens, research terminals, and plenty of outlets.' },
  { id: 3, name: 'Computer Science Lab', building: 'Tech Building', floor: 'Floor 3', type: 'Laboratory', hours: 'Open 24 hours', quietness: 3, occupancy: 74, seats: 42, totalSeats: 160, rating: 4.7, facilities: ['Wi-Fi', 'Power outlets', 'AC', 'Computers'], image: 'photo-1519389950473-47ba0277781c', position: { x: 73, y: 58 }, description: 'Powerful workstations, dual monitors, and the ideal atmosphere for a late-night coding session.' },
  { id: 4, name: 'Electronics Lab', building: 'Engineering Hall', floor: 'Floor 1', type: 'Laboratory', hours: 'Open until 9 PM', quietness: 3, occupancy: 61, seats: 28, totalSeats: 72, rating: 4.6, facilities: ['Wi-Fi', 'Power outlets', 'AC', 'Computers'], image: 'photo-1581092921461-eab62e97a780', position: { x: 29, y: 62 }, description: 'An equipped lab with bench space, component kits, and the tools to take your ideas further.' },
  { id: 5, name: 'Silent Reading Room', building: 'Heritage Hall', floor: 'Floor 2', type: 'Quiet zone', hours: 'Open until 10 PM', quietness: 5, occupancy: 21, seats: 52, totalSeats: 66, rating: 4.9, facilities: ['Wi-Fi', 'Power outlets', 'AC', 'Silent zone'], image: 'photo-1506880018603-83d5b814b5a6', position: { x: 25, y: 31 }, description: 'Soft light, wide desks, and a shared commitment to making space for deep concentration.' },
  { id: 6, name: 'Garden Study Area', building: 'Botanical Courtyard', floor: 'Ground floor', type: 'Quiet zone', hours: 'Open until 7 PM', quietness: 4, occupancy: 27, seats: 36, totalSeats: 50, rating: 4.8, facilities: ['Wi-Fi', 'Power outlets', 'Outdoor', 'Coffee nearby'], image: 'photo-1441974231531-c6227db76b6e', position: { x: 49, y: 72 }, description: 'A leafy little hideaway for sunny afternoons, fresh thinking, and the occasional visiting butterfly.' },
  { id: 7, name: 'Student Collaboration Hub', building: 'Student Union', floor: 'Floor 1', type: 'Group study', hours: 'Open until 12 AM', quietness: 2, occupancy: 68, seats: 48, totalSeats: 150, rating: 4.7, facilities: ['Wi-Fi', 'Power outlets', 'AC', 'Group rooms'], image: 'photo-1521737711867-e3b97375f902', position: { x: 55, y: 50 }, description: 'Flexible group rooms, writable walls, and plenty of room to turn a brainstorm into a breakthrough.' },
  { id: 8, name: 'Research Centre', building: 'Discovery Wing', floor: 'Floor 3', type: 'Research', hours: 'Open until 9 PM', quietness: 4, occupancy: 44, seats: 72, totalSeats: 130, rating: 4.9, facilities: ['Wi-Fi', 'Power outlets', 'AC', 'Computers'], image: 'photo-1532094349884-543bc11b234d', position: { x: 38, y: 49 }, description: 'A calm, resource-rich home base for big questions and the research that helps answer them.' },
]

const categories = ['All spaces', 'Libraries', 'Laboratories', 'Silent zones', 'Group study']
const imageUrl = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=82`
const occupancyLabel = (value: number) => value < 40 ? 'Plenty of room' : value < 70 ? 'Filling up' : 'Almost full'

function CountUp({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let frame = 0
    const start = performance.now()
    const animate = (now: number) => {
      const progress = Math.min((now - start) / 1100, 1)
      setCount(Math.round(value * (1 - (1 - progress) ** 3)))
      if (progress < 1) frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [value])
  return <>{count}{suffix}</>
}

function App() {
  const [spaces] = useState(initialSpaces)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All spaces')
  const [sort, setSort] = useState('Recommended')
  const [filters, setFilters] = useState<string[]>([])
  const [showSaved, setShowSaved] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])
  const [recentlyViewed, setRecentlyViewed] = useState<number[]>([])
  const [compare, setCompare] = useState<number[]>([])
  const [selected, setSelected] = useState<Space | null>(null)
  const [mapSelected, setMapSelected] = useState<Space | null>(null)
  const [showCompare, setShowCompare] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showAccount, setShowAccount] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [accountMode, setAccountMode] = useState<'login' | 'signup'>('login')
  const [accountName, setAccountName] = useState('')
  const [accountEmail, setAccountEmail] = useState('')
  const [accountPassword, setAccountPassword] = useState('')
  const [accountError, setAccountError] = useState('')
  const [recommendationNeed, setRecommendationNeed] = useState('Complete silence')
  const [recommended, setRecommended] = useState<Space | null>(null)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [activeSection, setActiveSection] = useState('explore')

  const filteredSpaces = useMemo(() => {
    const query = search.trim().toLowerCase()
    const result = spaces.filter(space => {
      const matchesSearch = !query || [space.name, space.building, space.type, ...space.facilities].join(' ').toLowerCase().includes(query)
      const matchesCategory = category === 'All spaces' ||
        (category === 'Libraries' && space.type === 'Library') ||
        (category === 'Laboratories' && space.type === 'Laboratory') ||
        (category === 'Silent zones' && space.facilities.includes('Silent zone')) ||
        (category === 'Group study' && space.type === 'Group study')
      const matchesFilters = filters.every(filter => {
        if (filter === 'Air conditioning') return space.facilities.includes('AC')
        if (filter === 'Wi-Fi') return space.facilities.includes('Wi-Fi')
        if (filter === 'Power outlets') return space.facilities.includes('Power outlets')
        if (filter === 'Least crowded') return space.occupancy < 50
        return true
      })
      return matchesSearch && matchesCategory && matchesFilters && (!showSaved || favorites.includes(space.id))
    })
    return result.sort((a, b) => {
      if (sort === 'Most seats') return b.seats - a.seats
      if (sort === 'Quietest') return b.quietness - a.quietness || a.occupancy - b.occupancy
      if (sort === 'Top rated') return b.rating - a.rating
      if (sort === 'Lowest occupancy') return a.occupancy - b.occupancy
      return a.id - b.id
    })
  }, [spaces, search, category, filters, sort, showSaved, favorites])

  const comparedSpaces = compare.map(id => spaces.find(space => space.id === id)).filter((space): space is Space => Boolean(space))
  const recentSpaces = recentlyViewed.map(id => spaces.find(space => space.id === id)).filter((space): space is Space => Boolean(space))

  const toggleFavorite = (id: number) => setFavorites(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id])
  const toggleCompare = (id: number) => setCompare(current => current.includes(id) ? current.filter(item => item !== id) : current.length < 3 ? [...current, id] : current)
  const toggleFilter = (filter: string) => setFilters(current => current.includes(filter) ? current.filter(item => item !== filter) : [...current, filter])
  const openSpace = (space: Space) => {
    setSelected(space)
    setRecentlyViewed(current => [space.id, ...current.filter(id => id !== space.id)].slice(0, 4))
  }
  const scrollTo = (id: string) => {
    setActiveSection(id)
    setMobileMenu(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }
  const getRecommendation = () => {
    const recommendedSpace = [...spaces].sort((a, b) => {
      const score = (space: Space) => {
        if (recommendationNeed === 'Complete silence') return space.quietness * 3 - space.occupancy / 25 + (space.facilities.includes('Silent zone') ? 3 : 0)
        if (recommendationNeed === 'Group discussion') return (space.type === 'Group study' ? 8 : 0) + (space.facilities.includes('Group rooms') ? 4 : 0) + space.seats / 30
        if (recommendationNeed === 'Coding & programming') return (space.facilities.includes('Computers') ? 6 : 0) + (space.hours.includes('24') ? 5 : 0) + space.quietness
        if (recommendationNeed === 'Research work') return (space.type === 'Research' ? 8 : 0) + (space.type === 'Library' ? 5 : 0) + space.quietness
        if (recommendationNeed === 'Comfortable reading') return (space.type === 'Library' ? 6 : 0) + space.quietness + space.rating
        return space.seats / 10 - space.occupancy / 20
      }
      return score(b) - score(a)
    })[0]
    setRecommended(recommendedSpace)
  }
  const submitAccount = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAccountError('')
    if (accountMode === 'signup' && accountName.trim().length < 2) {
      setAccountError('Please enter your name (at least 2 characters).')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(accountEmail)) {
      setAccountError('Enter a valid email address.')
      return
    }
    if (accountPassword.length < 8) {
      setAccountError('Your password must be at least 8 characters.')
      return
    }
    setAccountError('Demo mode: account services are not configured yet.')
  }
  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        document.getElementById('space-search')?.focus()
        document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' })
      }
      if (event.key === 'Escape') {
        setSelected(null)
        setShowCompare(false)
        setShowAccount(false)
        setShowProfile(false)
        setMapSelected(null)
      }
    }
    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => scrollTo('home')} aria-label="Quietspace home">
          <span className="brand-symbol"><span /><span /><span /><span /></span>
          <span>quietspace<span className="brand-period">.</span></span>
        </button>
        <nav className={`main-nav ${mobileMenu ? 'nav-open' : ''}`}>
          {[['explore', 'Explore'], ['campus-map', 'Campus map'], ['insights', 'Insights']].map(([id, label]) => (
            <button key={id} className={activeSection === id ? 'nav-link active' : 'nav-link'} onClick={() => scrollTo(id)}>{label}</button>
          ))}
          <button className="nav-cta mobile-account" onClick={() => setShowAccount(true)}>Sign in <ArrowUpRight size={15} /></button>
        </nav>
        <div className="topbar-actions">
          <button className="saved-link" onClick={() => { setCategory('All spaces'); setSearch(''); setFilters([]); setShowSaved(!showSaved); scrollTo('explore') }}>
            <Heart size={16} /> <span>{showSaved ? 'All spaces' : 'Saved'}</span>{favorites.length > 0 && <span className="saved-count">{favorites.length}</span>}
          </button>
          <button className="profile-link" onClick={() => setShowProfile(true)}><UserRound size={15} /> <span>Profile</span></button>
          <button className="nav-cta" onClick={() => setShowAccount(true)}>Sign in <ArrowUpRight size={15} /></button>
          <button className="mobile-menu" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle navigation">{mobileMenu ? <X size={21} /> : <Menu size={21} />}</button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-orb hero-orb-one" /><div className="hero-orb hero-orb-two" />
          <div className="hero-inner">
            <motion.div className="hero-copy" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
              <div className="hero-eyebrow"><span className="eyebrow-dot" /> YOUR CAMPUS, IN A DIFFERENT LIGHT</div>
              <h1>Your perfect study<br />space is <span>just one click away.</span></h1>
              <p className="hero-subtitle">Discover peaceful libraries, productive labs and inspiring study zones across your campus.</p>
              <div className="hero-actions">
                <button className="hero-button primary-button" onClick={() => scrollTo('explore')}>Explore spaces <ArrowRight size={17} /></button>
                <button className="hero-button secondary-button" onClick={() => scrollTo('campus-map')}><MapPin size={16} /> View campus map</button>
              </div>
              <div className="hero-social-proof">
                <div className="avatar-stack"><span>J</span><span>M</span><span>A</span><span>S</span></div>
                <div><div className="social-stars">★★★★★</div><small>Loved by <strong>2,400+</strong> focused students</small></div>
              </div>
            </motion.div>
            <motion.div className="hero-visual" initial={{ opacity: 0, scale: .94, x: 12 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: .8, delay: .12 }}>
              <div className="visual-halo" />
              <div className="hero-photo-wrap"><img src={imageUrl('photo-1497366216548-37526070297c')} alt="Sunlit modern university library" /></div>
              <div className="floating-card focus-card"><span className="focus-icon"><Sparkles size={16} /></span><div><strong>Your focus looks good</strong><small>Silent Reading Room · 21% full</small></div><span className="live-dot" /></div>
              <div className="floating-card seat-card"><div className="seat-glyph"><Users size={15} /></div><div><strong>482 seats</strong><small>waiting for you</small></div></div>
              <div className="floating-card pin-card"><MapPin size={15} /><span>Right around the corner</span></div>
              <span className="visual-sparkle sparkle-one">✳</span><span className="visual-sparkle sparkle-two">✦</span>
            </motion.div>
          </div>
          <div className="hero-bottom">
            <span className="hero-bottom-label"><span className="live-dot" /> THE CAMPUS, LESS CROWDED</span>
            <div className="hero-stats">
              <div className="hero-stat"><strong><CountUp value={8} suffix="+" /></strong><small>spaces to discover</small></div>
              <div className="hero-stat"><strong><CountUp value={528} /></strong><small>seats available</small></div>
              <div className="hero-stat"><strong><CountUp value={3} /></strong><small>peaceful quiet zones</small></div>
              <div className="hero-stat"><strong><CountUp value={8} /></strong><small>buildings explored</small></div>
            </div>
          </div>
        </section>

        <section className="explore-section page-section" id="explore">
          <div className="section-heading">
            <div><span className="section-kicker">A BETTER PLACE TO BEGIN</span><h2>Find your kind of focus<span className="heading-period">.</span></h2><p>Eight campus spaces. A whole lot of potential. Find the one that feels right.</p></div>
            <button className="map-shortcut" onClick={() => scrollTo('campus-map')}><Compass size={17} /> Explore the map <ArrowUpRight size={15} /></button>
          </div>
          <div className="search-panel">
            <div className="search-field"><Search size={19} /><input id="space-search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search a space, building, or even a power outlet..." aria-label="Search spaces" />{search && <button className="clear-search" onClick={() => setSearch('')} aria-label="Clear search"><X size={15} /></button>}<span className="search-shortcut">⌘ K</span></div>
            <button className={`filter-button ${showFilters || filters.length ? 'filter-active' : ''}`} onClick={() => setShowFilters(!showFilters)}><SlidersHorizontal size={16} /> Filters {filters.length > 0 && <span className="filter-count">{filters.length}</span>}</button>
          </div>
          <AnimatePresence>
            {showFilters && <motion.div className="filter-drawer" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
              <div className="filter-drawer-inner"><span className="filter-label">Only show spaces with</span>{['Air conditioning', 'Wi-Fi', 'Power outlets', 'Least crowded'].map(filter => <button key={filter} onClick={() => toggleFilter(filter)} className={`filter-chip ${filters.includes(filter) ? 'selected' : ''}`}>{filters.includes(filter) && <Check size={13} />}{filter}</button>)}{filters.length > 0 && <button className="reset-filters" onClick={() => setFilters([])}>Clear all</button>}</div>
            </motion.div>}
          </AnimatePresence>
          <div className="discovery-toolbar">
            <div className="category-pills">{categories.map(item => <button key={item} className={category === item ? 'category-pill selected' : 'category-pill'} onClick={() => setCategory(item)}>{item}</button>)}</div>
            <label className="sort-control"><ArrowDownWideNarrow size={15} /><span>Sort by</span><select value={sort} onChange={event => setSort(event.target.value)} aria-label="Sort spaces"><option>Recommended</option><option>Most seats</option><option>Quietest</option><option>Top rated</option><option>Lowest occupancy</option></select><ChevronDown size={14} /></label>
          </div>

          {compare.length > 0 && <motion.div className="compare-tray" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <span className="compare-tray-icon"><ArrowLeftRight size={17} /></span><div className="compare-tray-copy"><strong>{compare.length} of 3 spaces selected</strong><span>Make your shortlist a little shorter.</span></div>
            <div className="compare-avatars">{comparedSpaces.map(space => <button key={space.id} title={`Remove ${space.name}`} onClick={() => toggleCompare(space.id)}><img src={imageUrl(space.image)} alt="" /><span><X size={10} /></span></button>)}</div>
            <button className="compare-now" disabled={compare.length < 2} onClick={() => setShowCompare(true)}>Compare now <ArrowRight size={15} /></button>
            <button className="tray-dismiss" onClick={() => setCompare([])} aria-label="Clear comparison"><X size={16} /></button>
          </motion.div>}

          <div className="space-grid">
            <AnimatePresence mode="popLayout">
              {filteredSpaces.map((space, index) => <motion.article className="space-card" key={space.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: .97 }} transition={{ duration: .34, delay: Math.min(index * .045, .28) }}>
                <button className="card-image" onClick={() => openSpace(space)} aria-label={`View ${space.name} details`}><img src={imageUrl(space.image)} alt={space.name} loading={index > 3 ? 'lazy' : 'eager'} /><span className={`availability-badge ${space.occupancy < 40 ? 'available' : space.occupancy < 70 ? 'moderate' : 'busy'}`}><span />{occupancyLabel(space.occupancy)}</span></button>
                <button className={`favorite-button ${favorites.includes(space.id) ? 'favorited' : ''}`} onClick={() => toggleFavorite(space.id)} aria-label={favorites.includes(space.id) ? 'Remove from saved spaces' : 'Save space'}><Heart size={17} fill={favorites.includes(space.id) ? 'currentColor' : 'none'} /></button>
                <div className="card-body">
                  <div className="card-meta"><span>{space.type}</span><span className="rating"><Star size={13} fill="currentColor" /> {space.rating.toFixed(1)}</span></div>
                  <button className="card-title-button" onClick={() => openSpace(space)}><h3>{space.name}</h3><ArrowUpRight size={15} /></button>
                  <div className="card-location"><MapPin size={13} /> {space.building} <span>·</span> {space.floor}</div>
                  <div className="card-details"><div className="seats-detail"><Users size={15} /><strong>{space.seats}</strong><span>seats open</span></div><div className="quiet-detail"><Headphones size={14} /><span>Quietness</span><strong>{space.quietness}.0</strong></div></div>
                  <div className="occupancy-row"><div className="occupancy-label"><span>Current occupancy</span><strong>{space.occupancy}%</strong></div><div className="occupancy-track"><span style={{ width: `${space.occupancy}%` }} className={space.occupancy >= 70 ? 'high' : ''} /></div></div>
                  <div className="card-footer"><span><Clock3 size={13} /> {space.hours}</span><button className={`add-compare ${compare.includes(space.id) ? 'is-added' : ''} ${compare.length === 3 && !compare.includes(space.id) ? 'is-disabled' : ''}`} onClick={() => toggleCompare(space.id)} disabled={compare.length === 3 && !compare.includes(space.id)}>{compare.includes(space.id) ? <><Check size={13} /> Added</> : <><Plus size={14} /> Compare</>}</button></div>
                </div>
              </motion.article>)}
            </AnimatePresence>
          </div>
          {filteredSpaces.length === 0 && <div className="empty-state"><span><Search size={21} /></span><h3>No spaces found</h3><p>Try a different search or remove a filter.</p><button onClick={() => { setSearch(''); setCategory('All spaces'); setFilters([]) }}>Clear all filters</button></div>}
          <div className="demo-note"><span className="demo-note-dot" /> Occupancy and seat counts are simulated for this demo. Not live campus data.</div>
        </section>

        <section className="map-section page-section" id="campus-map">
          <div className="section-heading map-section-heading">
            <div><span className="section-kicker">A LITTLE LESS WANDERING</span><h2>Every good spot, on the map<span className="heading-period">.</span></h2><p>Get a feel for the campus before you ever leave your seat.</p></div>
            <div className="map-legend"><span><i className="legend-dot green" /> Room to breathe</span><span><i className="legend-dot amber" /> Getting lively</span><span><i className="legend-dot red" /> Nearly full</span></div>
          </div>
          <div className="campus-map">
            <div className="map-grid-pattern" /><div className="map-park"><span>THE QUAD</span><span className="tree tree-one">♧</span><span className="tree tree-two">♧</span><span className="tree tree-three">♧</span><span className="tree tree-four">♧</span><span className="tree tree-five">♧</span></div>
            <div className="map-road road-horizontal" /><div className="map-road road-vertical" /><div className="map-road road-diagonal" />
            <div className="map-water"><span>Reflection pond</span></div>
            {[
              { name: 'Knowledge Commons', x: 39, y: 18, type: 'main' }, { name: 'Innovation Block', x: 68, y: 22, type: '' },
              { name: 'Tech Building', x: 77, y: 52, type: '' }, { name: 'Engineering Hall', x: 22, y: 59, type: '' },
              { name: 'Heritage Hall', x: 22, y: 26, type: '' }, { name: 'Student Union', x: 57, y: 49, type: 'main' },
              { name: 'Discovery Wing', x: 37, y: 48, type: '' },
            ].map(building => <div key={building.name} className={`map-building ${building.type}`} style={{ left: `${building.x}%`, top: `${building.y}%` }}><span />{building.name}</div>)}
            <div className="map-path-label path-north">NORTH WALK</div><div className="map-path-label path-east">ARTS LANE</div>
            {spaces.map(space => <button key={space.id} aria-label={`Show ${space.name} on map`} title={space.name} className={`map-marker ${space.occupancy < 40 ? 'marker-green' : space.occupancy < 70 ? 'marker-amber' : 'marker-red'} ${mapSelected?.id === space.id ? 'marker-selected' : ''}`} style={{ left: `${space.position.x}%`, top: `${space.position.y}%` }} onClick={() => setMapSelected(space)}><span className="marker-pulse" /><MapPin size={16} fill="currentColor" /></button>)}
            <div className="map-compass"><Navigation size={17} fill="currentColor" /><span>N</span></div>
            <div className="map-zoom"><button onClick={event => { const el = event.currentTarget.closest('.campus-map'); el?.classList.toggle('map-zoomed') }} aria-label="Zoom in">+</button><button onClick={event => { const el = event.currentTarget.closest('.campus-map'); el?.classList.remove('map-zoomed') }} aria-label="Reset map zoom">−</button></div>
            <AnimatePresence>{mapSelected && <motion.div className="map-popup" key={mapSelected.id} initial={{ opacity: 0, y: 8, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8 }} style={{ left: `${Math.min(mapSelected.position.x + 2, 73)}%`, top: `${Math.max(mapSelected.position.y - 17, 7)}%` }}>
              <button className="popup-close" onClick={() => setMapSelected(null)} aria-label="Close location popup"><X size={14} /></button><span className="popup-kicker">STUDY SPACE</span><strong>{mapSelected.name}</strong><span className="popup-location"><MapPin size={12} />{mapSelected.building}</span><div className="popup-stats"><span><Users size={13} /> {mapSelected.seats} seats</span><span><Headphones size={13} /> {mapSelected.quietness}/5 quiet</span></div><div className="popup-occupancy"><span>Occupancy</span><strong>{mapSelected.occupancy}%</strong></div><div className="popup-track"><span style={{ width: `${mapSelected.occupancy}%` }} /></div><button className="popup-detail-button" onClick={() => openSpace(mapSelected)}>View details <ArrowRight size={13} /></button>
            </motion.div>}</AnimatePresence>
            <div className="map-footer">✳ &nbsp;Illustrated campus map <span>·</span> Select a marker to explore a spot</div>
          </div>
        </section>

        <section className="recommender-section page-section">
          <div className="recommender-card">
            <div className="recommend-decoration decoration-one" /><div className="recommend-decoration decoration-two" />
            <div className="recommend-copy"><span className="section-kicker light-kicker"><Sparkles size={13} /> A LITTLE HELP FROM THE ALGORITHM</span><h2>Find my perfect<br />study spot<span>.</span></h2><p>Tell us what kind of session you have in mind. We'll match you with the right space using real demo campus data.</p>
              <div className="preference-label">TODAY, I'M LOOKING FOR</div><div className="preference-options">{['Complete silence', 'Group discussion', 'Coding & programming', 'Research work', 'Comfortable reading', 'Maximum open seats'].map(need => <button key={need} className={recommendationNeed === need ? 'preference-chip chosen' : 'preference-chip'} onClick={() => { setRecommendationNeed(need); setRecommended(null) }}>{recommendationNeed === need && <Check size={13} />}{need}</button>)}</div>
              <button className="recommend-button" onClick={getRecommendation}><Sparkles size={15} /> Find my space <ArrowRight size={15} /></button><span className="recommend-footnote"><Lightbulb size={12} /> A transparent match from simulated campus information</span>
            </div>
            <div className="recommend-result-area">
              <AnimatePresence mode="wait">{recommended ? <motion.div key={recommended.id} className="recommend-result" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="result-image"><img src={imageUrl(recommended.image)} alt={recommended.name} /><span><Sparkles size={13} /> YOUR BEST MATCH</span></div><div className="result-content"><span className="result-label">A SPACE THAT GETS YOUR SESSION</span><h3>{recommended.name}</h3><span className="result-location"><MapPin size={13} />{recommended.building} · {recommended.floor}</span><p>{recommendationNeed === 'Complete silence' ? `A quietness score of ${recommended.quietness}/5 and just ${recommended.occupancy}% occupancy make this a lovely place to settle in.` : recommendationNeed === 'Maximum open seats' ? `${recommended.seats} seats available right now in our simulated demo data, with room for you to spread out.` : `Well suited to ${recommendationNeed.toLowerCase()}, with ${recommended.quietness}/5 quietness and ${recommended.seats} seats available.`}</p><div className="result-metrics"><span><Headphones size={15} /><strong>{recommended.quietness}/5</strong><small>Quietness</small></span><span><Users size={15} /><strong>{recommended.seats}</strong><small>Seats open</small></span><span><Zap size={15} /><strong>{recommended.occupancy}%</strong><small>Occupied</small></span></div><button onClick={() => openSpace(recommended)}>Explore this space <ArrowRight size={14} /></button></div>
              </motion.div> : <motion.div className="recommend-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><div className="recommend-orb"><Sparkles size={25} /></div><span className="empty-overline">YOUR NEXT GREAT SESSION</span><h3>A good space changes<br />everything.</h3><p>Choose your vibe and we'll do the thoughtful matching.</p><div className="recommend-swatches"><span /><span /><span /><span /><span /></div></motion.div>}</AnimatePresence>
            </div>
          </div>
        </section>

        <section className="insights-section page-section" id="insights">
          <div className="section-heading">
            <div><span className="section-kicker">A FEEL FOR THE FLOW</span><h2>Campus, in the moment<span className="heading-period">.</span></h2><p>Little insights to help you find a space that feels just right.</p></div>
            <span className="simulation-pill"><span /> SIMULATED DEMO DATA</span>
          </div>
          <div className="insights-grid">
            <div className="insight-card occupancy-chart-card"><div className="insight-card-head"><div><span className="insight-label">CAMPUS OCCUPANCY</span><h3>Finding its rhythm</h3></div><span className="chart-period"><span /> Today <ChevronDown size={13} /></span></div><div className="chart-summary"><strong>46<span>%</span></strong><span className="chart-change"><ArrowDown size={13} /> 8%<small>vs. last week</small></span></div><div className="area-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={[{ time: '8 am', occupancy: 22 }, { time: '10 am', occupancy: 39 }, { time: '12 pm', occupancy: 61 }, { time: '2 pm', occupancy: 72 }, { time: '4 pm', occupancy: 55 }, { time: '6 pm', occupancy: 42 }, { time: '8 pm', occupancy: 28 }]} margin={{ top: 8, right: 4, bottom: 0, left: -25 }}><defs><linearGradient id="occupancyFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8e79f9" stopOpacity={.3} /><stop offset="98%" stopColor="#8e79f9" stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke="#eeeef5" strokeDasharray="3 5" vertical={false} /><XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#9999ac', fontSize: 10 }} dy={8} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#9999ac', fontSize: 10 }} ticks={[0, 25, 50, 75]} tickFormatter={value => `${value}%`} /><Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #efedf7', boxShadow: '0 6px 24px #29214d12', fontFamily: 'DM Sans', fontSize: 12 }} /><Area type="monotone" dataKey="occupancy" stroke="#8870ed" strokeWidth={2.5} fill="url(#occupancyFill)" activeDot={{ r: 5, fill: '#8870ed', stroke: '#fff', strokeWidth: 3 }} /></AreaChart></ResponsiveContainer></div><div className="chart-caption"><span><i className="caption-dot" /> Estimated campus occupancy</span><span>Updated for demo · hourly</span></div></div>
            <div className="insight-card seats-card"><div className="insight-card-head"><div><span className="insight-label">ROOM TO SPREAD OUT</span><h3>Seats at a glance</h3></div><span className="circle-icon mint-circle"><Users size={16} /></span></div><div className="seat-total"><strong>528</strong><span>open seats<br />across campus</span></div><div className="seats-breakdown">{[{ label: 'Library spaces', seats: 250, color: '#8972ee' }, { label: 'Labs & research', seats: 142, color: '#5ac3ac' }, { label: 'Study & social', seats: 136, color: '#f0b765' }].map(item => <div className="seat-row" key={item.label}><span className="seat-color" style={{ background: item.color }} />{item.label}<strong>{item.seats}</strong></div>)}</div><div className="seats-bar">{[250, 142, 136].map((val, i) => <span key={val} style={{ width: `${val / 528 * 100}%`, background: ['#8972ee', '#5ac3ac', '#f0b765'][i] }} />)}</div><span className="insight-footnote">Across 8 campus spaces · simulated demo data</span></div>
            <div className="insight-card quiet-card"><div className="insight-card-head"><div><span className="insight-label">SHHH. THE GOOD SPOTS.</span><h3>Your quiet shortlist</h3></div><span className="circle-icon lavender-circle"><Headphones size={16} /></span></div><div className="quiet-list">{[...spaces].sort((a, b) => b.quietness - a.quietness || a.occupancy - b.occupancy).slice(0, 4).map((space, i) => <button className="quiet-row" key={space.id} onClick={() => openSpace(space)}><span className="quiet-rank">0{i + 1}</span><span className="quiet-info"><strong>{space.name}</strong><small>{space.building}</small></span><span className="quiet-score"><span>{'★'.repeat(space.quietness)}<i>{'★'.repeat(5 - space.quietness)}</i></span><strong>{space.quietness}.0</strong></span></button>)}</div><div className="insight-footnote">Ranked by quietness, then lower occupancy</div></div>
            <div className="insight-card busy-card"><div className="insight-card-head"><div><span className="insight-label">WHEN THE CAMPUS WAKES UP</span><h3>Finding a quieter hour</h3></div><span className="circle-icon peach-circle"><Clock3 size={16} /></span></div><div className="hours-chart"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={[{ name: 'Morning · 8–11am', value: 25, color: '#68c8ad' }, { name: 'Midday · 11am–2pm', value: 35, color: '#f2be74' }, { name: 'Afternoon · 2–5pm', value: 25, color: '#9885f5' }, { name: 'Evening · 5–9pm', value: 15, color: '#d3c9f8' }]} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={4} stroke="none">{[{ color: '#68c8ad' }, { color: '#f2be74' }, { color: '#9885f5' }, { color: '#d3c9f8' }].map(item => <Cell key={item.color} fill={item.color} />)}</Pie><Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #efedf7', fontFamily: 'DM Sans', fontSize: 12 }} formatter={value => [`${value}% of visits`, 'Typical traffic']} /></PieChart></ResponsiveContainer><div className="donut-label"><strong>2–5</strong><span>QUIETEST</span></div></div><div className="hours-legend">{[['Morning', '#68c8ad'], ['Midday', '#f2be74'], ['Afternoon', '#9885f5'], ['Evening', '#d3c9f8']].map(([label, color]) => <span key={label}><i style={{ background: color }} />{label}</span>)}</div><div className="insight-footnote">Typical campus patterns · simulated demo data</div></div>
          </div>
        </section>

        <section className="final-cta page-section"><div className="cta-pattern" /><div className="cta-copy"><span className="section-kicker">YOUR NEXT FAVORITE PLACE IS OUT THERE</span><h2>Stop searching.<br /><span>Start focusing.</span></h2><p>Somewhere on campus, there's a spot that feels like it was made for you. Let's find it.</p><button className="cta-button" onClick={() => scrollTo('explore')}>Discover your study space <ArrowRight size={17} /></button></div><div className="cta-art" aria-label="An illustrated cup of coffee, book, and study essentials"><div className="art-glow" /><div className="art-book art-book-one" /><div className="art-book art-book-two" /><div className="art-table" /><div className="art-plant"><i /><i /><i /><i /><span /></div><div className="art-coffee"><div className="coffee-steam steam-one" /><div className="coffee-steam steam-two" /><span>q.</span></div><div className="art-pencil" /><div className="art-star star-a">✦</div><div className="art-star star-b">✳</div><div className="art-caption"><span /> MADE FOR YOUR NEXT BIG IDEA</div></div></section>
      </main>

      <footer className="footer"><button className="brand footer-brand" onClick={() => scrollTo('home')}><span className="brand-symbol"><span /><span /><span /><span /></span><span>quietspace<span className="brand-period">.</span></span></button><span className="footer-note">Made for a more focused campus.</span><span className="footer-demo"><span /> Simulated demo · Not live data</span><span className="footer-copy">A little more focus, a little less finding.</span></footer>

      <AnimatePresence>
        {selected && <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setSelected(null) }}><motion.div className="detail-modal" role="dialog" aria-modal="true" aria-label={`${selected.name} details`} initial={{ opacity: 0, y: 22, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .98 }} transition={{ duration: .2 }}>
          <button className="modal-close" onClick={() => setSelected(null)} aria-label="Close details"><X size={18} /></button><div className="detail-image"><img src={imageUrl(selected.image)} alt={selected.name} /><span className={`availability-badge ${selected.occupancy < 40 ? 'available' : selected.occupancy < 70 ? 'moderate' : 'busy'}`}><span />{occupancyLabel(selected.occupancy)}</span></div><div className="detail-body"><span className="section-kicker">{selected.type.toUpperCase()} · {selected.building.toUpperCase()}</span><h2>{selected.name}</h2><p>{selected.description}</p><div className="detail-meta"><span><MapPin size={15} /> {selected.building}, {selected.floor}</span><span><Clock3 size={15} /> {selected.hours}</span></div><div className="detail-metrics"><div><Headphones size={16} /><strong>{selected.quietness}/5</strong><small>Quietness</small></div><div><Users size={16} /><strong>{selected.seats}</strong><small>Open seats</small></div><div><Star size={16} /><strong>{selected.rating}</strong><small>Student rating</small></div><div><Zap size={16} /><strong>{selected.occupancy}%</strong><small>Occupancy</small></div></div><h4 className="facilities-title">A few thoughtful touches</h4><div className="facility-list">{selected.facilities.map(facility => <span key={facility}>{facility.includes('Wi-Fi') ? <Wifi size={13} /> : facility.includes('Computers') ? <Monitor size={13} /> : facility.includes('Coffee') ? <Coffee size={13} /> : facility.includes('Library') ? <BookOpen size={13} /> : <Zap size={13} />}{facility}</span>)}</div><div className="detail-actions"><button className="detail-primary" onClick={() => { toggleFavorite(selected.id) }}><Heart size={15} fill={favorites.includes(selected.id) ? 'currentColor' : 'none'} />{favorites.includes(selected.id) ? 'Saved to your spaces' : 'Save this space'}</button><button className="detail-secondary" onClick={() => toggleCompare(selected.id)}><ArrowLeftRight size={15} />{compare.includes(selected.id) ? 'Remove from compare' : 'Add to compare'}</button></div><div className="detail-demo"><span className="demo-note-dot" /> Occupancy and availability shown are simulated demo data.</div></div>
        </motion.div></div>}

        {showCompare && <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setShowCompare(false) }}><motion.div className="compare-modal" role="dialog" aria-modal="true" aria-label="Compare study spaces" initial={{ opacity: 0, y: 22, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .98 }}><button className="modal-close" onClick={() => setShowCompare(false)} aria-label="Close comparison"><X size={18} /></button><span className="section-kicker">A BETTER WAY TO CHOOSE</span><h2>Side by side<span className="heading-period">.</span></h2><p className="compare-modal-subtitle">A little perspective makes a big difference.</p><div className="comparison-table"><div className="compare-table-row table-head"><div className="comparison-label">AT A GLANCE</div>{comparedSpaces.map(space => <div className="compare-heading-cell" key={space.id}><img src={imageUrl(space.image)} alt="" /><strong>{space.name}</strong><span>{space.building}</span></div>)}</div>
            {[['Quietness', (space: Space) => `${space.quietness}/5`, (space: Space) => space.quietness * 20], ['Available seats', (space: Space) => `${space.seats} seats`, (space: Space) => Math.min(space.seats / 2, 100)], ['Student rating', (space: Space) => `${space.rating} / 5`, (space: Space) => space.rating * 20], ['Occupancy', (space: Space) => `${space.occupancy}%`, (space: Space) => space.occupancy], ['Opening hours', (space: Space) => space.hours, null], ['Location', (space: Space) => `${space.building} · ${space.floor}`, null], ['Facilities', (space: Space) => space.facilities.join(', '), null]].map(([label, render, progress]) => <div className="comparison-row" key={label as string}><div className="comparison-label">{label as string}</div>{comparedSpaces.map(space => { const value = (render as (space: Space) => string)(space); const amount = progress ? (progress as (space: Space) => number)(space) : 0; const best = (label === 'Quietness' ? space.quietness === Math.max(...comparedSpaces.map(item => item.quietness)) : label === 'Available seats' ? space.seats === Math.max(...comparedSpaces.map(item => item.seats)) : label === 'Student rating' ? space.rating === Math.max(...comparedSpaces.map(item => item.rating)) : label === 'Occupancy' ? space.occupancy === Math.min(...comparedSpaces.map(item => item.occupancy)) : false); return <div className={`comparison-value ${best ? 'comparison-best' : ''}`} key={space.id}><span>{value}</span>{progress && <div className="comparison-progress"><i style={{ width: `${amount}%` }} /></div>}</div>})}</div>)}</div><div className="best-match-grid">{[{ title: 'For a little quiet', space: comparedSpaces.reduce((best, space) => space.quietness > best.quietness || (space.quietness === best.quietness && space.occupancy < best.occupancy) ? space : best) }, { title: 'For your study group', space: comparedSpaces.reduce((best, space) => space.type === 'Group study' || space.facilities.includes('Group rooms') ? space : best) }, { title: 'For elbow room', space: comparedSpaces.reduce((best, space) => space.seats > best.seats ? space : best) }].map(item => <div className="best-match" key={item.title}><span><Sparkles size={13} /> {item.title.toUpperCase()}</span><strong>{item.space.name}</strong></div>)}</div><span className="detail-demo"><i className="demo-note-dot" /> All information is simulated for demo purposes.</span></motion.div></div>}

        {showAccount && <div className="modal-backdrop account-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setShowAccount(false) }}><motion.div className="account-modal" role="dialog" aria-modal="true" aria-label="Student account" initial={{ opacity: 0, y: 18, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }}><button className="modal-close" onClick={() => setShowAccount(false)} aria-label="Close"><X size={18} /></button><div className="account-logo"><span className="brand-symbol"><span /><span /><span /><span /></span></div><span className="section-kicker">A LITTLE SPACE, JUST FOR YOU</span><h2>{accountMode === 'login' ? 'Welcome back.' : 'Make room for focus.'}</h2><p>{accountMode === 'login' ? 'Sign in to pick up where you left off.' : 'Create your student account to save the spaces you love.'}</p><form onSubmit={submitAccount} noValidate>{accountMode === 'signup' && <label>Your name<input value={accountName} onChange={event => setAccountName(event.target.value)} placeholder="Jordan Lee" autoComplete="name" /></label>}<label>Student email<input type="email" value={accountEmail} onChange={event => setAccountEmail(event.target.value)} placeholder="you@university.edu" autoComplete="email" /></label><label>Password<input type="password" value={accountPassword} onChange={event => setAccountPassword(event.target.value)} placeholder="At least 8 characters" autoComplete={accountMode === 'login' ? 'current-password' : 'new-password'} /></label>{accountError && <div className={`account-message ${accountError.startsWith('Demo') ? 'info' : 'error'}`}>{accountError.startsWith('Demo') && <Lightbulb size={14} />}{accountError}</div>}<button className="account-submit" type="submit">{accountMode === 'login' ? 'Sign in' : 'Create your account'} <ArrowRight size={15} /></button></form><div className="account-switch">{accountMode === 'login' ? "New to Quietspace? " : 'Already have a spot here? '}<button onClick={() => { setAccountMode(accountMode === 'login' ? 'signup' : 'login'); setAccountError('') }}>{accountMode === 'login' ? 'Create an account' : 'Sign in'}</button></div><span className="account-demo-note">Demo UI · Authentication is not connected yet</span></motion.div></div>}

        {showProfile && <div className="modal-backdrop account-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setShowProfile(false) }}><motion.div className="account-modal profile-modal" role="dialog" aria-modal="true" aria-label="Student profile" initial={{ opacity: 0, y: 18, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }}><button className="modal-close" onClick={() => setShowProfile(false)} aria-label="Close profile"><X size={18} /></button><div className="profile-header"><span className="profile-avatar"><UserRound size={21} /></span><div><span className="section-kicker">YOUR LITTLE CORNER OF CAMPUS</span><h2>Your study profile</h2><p>Guest profile · Activity is saved for this session</p></div></div><div className="profile-section"><div className="profile-section-heading"><strong>Saved spaces</strong><span>{favorites.length} saved</span></div>{favorites.length ? <div className="profile-space-list">{spaces.filter(space => favorites.includes(space.id)).map(space => <button key={space.id} className="profile-space-row" onClick={() => { setShowProfile(false); openSpace(space) }}><img src={imageUrl(space.image)} alt="" /><span><strong>{space.name}</strong><small>{space.building}</small></span><ArrowUpRight size={14} /></button>)}</div> : <p className="profile-empty">Save a space you love and it will be waiting here.</p>}</div><div className="profile-section"><div className="profile-section-heading"><strong>Recently viewed</strong><span>{recentSpaces.length} spaces</span></div>{recentSpaces.length ? <div className="profile-space-list">{recentSpaces.map(space => <button key={space.id} className="profile-space-row" onClick={() => { setShowProfile(false); openSpace(space) }}><img src={imageUrl(space.image)} alt="" /><span><strong>{space.name}</strong><small>{space.building} · {space.seats} seats open</small></span><ArrowUpRight size={14} /></button>)}</div> : <p className="profile-empty">Spaces you explore will show up here.</p>}</div><div className="profile-section profile-preferences"><div className="profile-section-heading"><strong>Your study vibe</strong><span>Personal preference</span></div><div className="profile-preference-options">{['Complete silence', 'Group discussion', 'Coding & programming', 'Research work', 'Comfortable reading', 'Maximum open seats'].map(need => <button key={need} className={recommendationNeed === need ? 'selected' : ''} onClick={() => setRecommendationNeed(need)}>{recommendationNeed === need && <Check size={12} />}{need}</button>)}</div><span className="profile-demo-note">Preferences and activity are session-only in this demo.</span></div><button className="account-submit profile-signin" onClick={() => { setShowProfile(false); setShowAccount(true) }}>Sign in to Quietspace <ArrowRight size={15} /></button></motion.div></div>}
      </AnimatePresence>
      <div className="mobile-bottom-nav"><button onClick={() => scrollTo('home')} className={activeSection === 'home' ? 'bottom-active' : ''}><Compass size={18} />Home</button><button onClick={() => scrollTo('explore')} className={activeSection === 'explore' ? 'bottom-active' : ''}><Search size={18} />Explore</button><button onClick={() => scrollTo('campus-map')} className={activeSection === 'campus-map' ? 'bottom-active' : ''}><MapPin size={18} />Map</button><button onClick={() => setShowProfile(true)}><UserRound size={18} />Profile</button></div>
    </div>
  )
}

export default App
