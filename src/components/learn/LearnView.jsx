import React, { useState, useMemo, useEffect } from 'react';
import { 
  BookOpen, 
  Bookmark, 
  BookmarkCheck, 
  PhoneCall, 
  HelpCircle, 
  CheckCircle2, 
  Search, 
  X, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink 
} from 'lucide-react';
import { ARTICLES_CATALOG, ARTICLE_CATEGORIES } from '../../data/articlesData';
import { useToast } from '../../context/ToastContext';
import { storage } from '../../utils/storage';
import Modal from '../common/Modal';

export default function LearnView() {
  const { showToast } = useToast();
  const [bookmarkedIds, setBookmarkedIds] = useState(() => storage.get('bookmarked_articles', []));
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [readingArticle, setReadingArticle] = useState(null);
  const [quizAnswered, setQuizAnswered] = useState(null);

  // Sync bookmarks to local storage
  useEffect(() => {
    storage.set('bookmarked_articles', bookmarkedIds);
  }, [bookmarkedIds]);

  const verifiedHelplines = [
    {
      name: 'National Emergency Number (ERSS)',
      number: '112',
      authority: 'Ministry of Home Affairs (MHA), Govt. of India',
      description: 'Unified 24/7 all-in-one emergency response for Police, Medical, and Fire.',
      tag: 'Toll-Free 24/7'
    },
    {
      name: 'National Women Helpline',
      number: '181',
      authority: 'Ministry of Women and Child Development (MWCD), Govt. of India',
      description: '24/7 toll-free support for women facing violence, distress, or requiring rescue.',
      tag: 'Toll-Free 24/7'
    },
    {
      name: 'Women in Distress Police Helpline',
      number: '1091',
      authority: 'State Police Departments / ERSS Network (India)',
      description: 'Direct emergency police dispatch for immediate women’s safety and protection.',
      tag: 'Police 24/7'
    },
    {
      name: 'KIRAN Mental Health Helpline',
      number: '1800-599-0019',
      authority: 'Dept. of Empowerment of Persons with Disabilities, MSJE, Govt. of India',
      description: '24/7 psychological support, stress counseling, and mental health rehabilitation.',
      tag: 'Toll-Free 24/7'
    },
    {
      name: 'Tele-MANAS National Mental Health',
      number: '14416',
      authority: 'Ministry of Health and Family Welfare (MoHFW), Govt. of India',
      description: '24/7 comprehensive tele-mental health counseling and maternal psychological care.',
      tag: 'MoHFW 24/7'
    },
    {
      name: 'NCW 24/7 Women Helpline',
      number: '7827170170',
      authority: 'National Commission for Women (NCW), India',
      description: 'Dedicated 24/7 helpline and WhatsApp desk for women in distress.',
      tag: 'Official NCW'
    }
  ];

  // Filter articles
  const filteredArticles = useMemo(() => {
    return ARTICLES_CATALOG.filter((art) => {
      const matchesCat = activeCategory === 'all' || art.category === activeCategory;
      const cleanQ = searchQuery.trim().toLowerCase();
      const matchesSearch = !cleanQ ||
        art.title.toLowerCase().includes(cleanQ) ||
        art.summary.toLowerCase().includes(cleanQ) ||
        art.topic.toLowerCase().includes(cleanQ);
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const toggleBookmark = (id, title) => {
    setBookmarkedIds((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast(`Removed "${title}" from bookmarks`, 'info');
        return prev.filter((item) => item !== id);
      } else {
        showToast(`Saved "${title}" to your bookmarks!`, 'success');
        return [...prev, id];
      }
    });
  };

  return (
    <div className="module-view app-container">
      {/* 1. Hero Section */}
      <section className="module-hero">
        <div className="hero-tag">
          <span className="badge badge-sage">
            <BookOpen size={13} /> Module 4: Learn & Support
          </span>
          <span className="badge badge-plum">Evidence-Based</span>
        </div>
        <h1 className="hero-title">Verified Health Guides & Support</h1>
        <p className="hero-description">
          Medical-reviewed guides spanning menstrual health, pregnancy trimesters, antenatal care, postpartum recovery, and verified 24/7 emergency helplines.
        </p>
      </section>

      {/* 2. Interactive Myth vs Fact Quiz Card */}
      <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-lavender-deep)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.15rem' }}>
          <HelpCircle size={20} color="var(--accent-lavender-deep)" />
          Interactive Myth vs. Fact Mini-Quiz
        </h3>
        <p style={{ fontSize: '0.9rem', margin: '6px 0 12px 0' }}>
          <strong>Statement:</strong> <em>"Eating sour or cold foods during your period causes irregular flow or severe cramps."</em>
        </p>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            className={`btn ${quizAnswered === 'myth' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => {
              setQuizAnswered('myth');
              showToast('Correct! It is a scientific myth.', 'success');
            }}
          >
            🚫 It is a Myth
          </button>
          <button 
            className={`btn ${quizAnswered === 'fact' ? 'btn-danger' : 'btn-outline'}`}
            onClick={() => {
              setQuizAnswered('fact');
              showToast('Not quite! Digestion and uterine lining are separate systems.', 'warning');
            }}
          >
            ✓ It is a Fact
          </button>
        </div>

        {quizAnswered && (
          <div style={{ marginTop: '12px', padding: '12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', fontSize: '0.86rem', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <CheckCircle2 size={18} color="var(--accent-sage)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Scientific Fact:</strong> Dietary temperature or acidity does not directly cause uterine contractions. Menstrual cramping is triggered by prostaglandin release in the endometrium.
            </div>
          </div>
        )}
      </div>

      {/* 3. Toolbar: Search & Category Filter Tabs */}
      <div className="store-toolbar" style={{ marginTop: '6px' }}>
        <div className="store-search-box">
          <Search size={16} className="search-icon-float" />
          <input
            type="text"
            className="store-search-input"
            placeholder="Search pregnancy signs, nutrition, postpartum..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search health guides"
          />
          {searchQuery && (
            <button 
              className="search-clear-btn" 
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="category-filter-bar" role="tablist" aria-label="Article categories">
          {ARTICLE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`category-chip-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory(cat.id);
                showToast(`Viewing ${cat.label}`, 'info');
              }}
              role="tab"
              aria-selected={activeCategory === cat.id}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Health Articles Grid */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <h2>Curated Health Guides ({filteredArticles.length})</h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {bookmarkedIds.length} Saved Bookmarks
        </span>
      </div>

      {filteredArticles.length === 0 ? (
        <div className="solid-card" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
          <BookOpen size={40} style={{ margin: '0 auto 10px', opacity: 0.3 }} />
          <h3>No articles found</h3>
          <p style={{ fontSize: '0.85rem' }}>No guides match "{searchQuery}". Try a different keyword.</p>
          <button 
            className="btn btn-primary" 
            style={{ marginTop: '12px' }}
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
          >
            Reset Search
          </button>
        </div>
      ) : (
        <div className="grid-3">
          {filteredArticles.map((art) => {
            const isSaved = bookmarkedIds.includes(art.id);
            return (
              <div key={art.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge badge-lavender">{art.topic}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>{art.readTime}</span>
                </div>

                <h3 style={{ fontSize: '1.05rem', lineHeight: 1.3 }}>{art.title}</h3>
                <p style={{ fontSize: '0.86rem', flex: 1, color: 'var(--text-secondary)' }}>{art.summary}</p>

                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setReadingArticle(art)}>
                    Read Full Guide
                  </button>
                  <button 
                    className="btn btn-outline btn-icon" 
                    onClick={() => toggleBookmark(art.id, art.title)}
                    title={isSaved ? 'Remove bookmark' : 'Bookmark guide'}
                    aria-label={isSaved ? 'Remove bookmark' : 'Bookmark guide'}
                  >
                    {isSaved ? <BookmarkCheck size={18} color="var(--accent-primary)" /> : <Bookmark size={18} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Verified Helplines Directory (India) */}
      <div style={{ marginTop: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <h2>Official Emergency Helplines (India)</h2>
          <span className="badge badge-plum">Region: India</span>
        </div>
        <p style={{ fontSize: '0.88rem', margin: '4px 0 14px 0' }}>
          Official 24/7 toll-free hotlines for emergency assistance, medical distress, and psychological support.
        </p>

        <div className="grid-2">
          {verifiedHelplines.map((hl) => (
            <div key={hl.number} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <span className="badge badge-rose" style={{ marginBottom: '4px' }}>{hl.tag}</span>
                <h4 style={{ fontSize: '1rem', marginTop: '2px' }}>{hl.name}</h4>
                <div style={{ fontSize: '0.78rem', color: 'var(--accent-primary)', fontWeight: 600, marginTop: '2px' }}>
                  🏛️ {hl.authority}
                </div>
                <p style={{ fontSize: '0.82rem', marginTop: '3px' }}>{hl.description}</p>
              </div>
              <a 
                href={`tel:${hl.number}`} 
                className="btn btn-secondary" 
                style={{ flexShrink: 0 }}
                onClick={() => showToast(`Initiating call to ${hl.name} (${hl.number})`, 'info')}
                aria-label={`Call ${hl.name} at ${hl.number}`}
              >
                <PhoneCall size={15} /> {hl.number}
              </a>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '14px', padding: '10px 14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', fontSize: '0.78rem', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>
          <strong>Source Attribution:</strong> Public emergency directories published by the Ministry of Home Affairs (MHA), Ministry of Women and Child Development (MWCD), National Commission for Women (NCW), and Ministry of Health & Family Welfare (MoHFW), Govt. of India. Users outside India should contact their local national emergency dispatch services.
        </div>
      </div>

      {/* 6. Article Reader Modal with Sources Attribution */}
      {readingArticle && (
        <Modal
          isOpen={true}
          onClose={() => setReadingArticle(null)}
          title={readingArticle.title}
          maxWidth="680px"
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '12px' }}>
              <button 
                type="button"
                className="btn btn-outline" 
                onClick={() => toggleBookmark(readingArticle.id, readingArticle.title)}
              >
                {bookmarkedIds.includes(readingArticle.id) ? (
                  <>
                    <BookmarkCheck size={16} color="var(--accent-primary)" /> Saved to Bookmarks
                  </>
                ) : (
                  <>
                    <Bookmark size={16} /> Bookmark Guide
                  </>
                )}
              </button>
              <button type="button" className="btn btn-primary" onClick={() => setReadingArticle(null)}>
                Done Reading
              </button>
            </div>
          }
        >
          <div style={{ fontSize: '0.92rem', lineHeight: 1.65, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span className="badge badge-lavender">{readingArticle.topic}</span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>{readingArticle.readTime}</span>
            </div>

            <div style={{ whiteSpace: 'pre-line', color: 'var(--text-primary)' }}>
              {readingArticle.fullContent}
            </div>

            {/* Official Source Citations */}
            {readingArticle.sources && readingArticle.sources.length > 0 && (
              <div style={{ background: 'var(--bg-tertiary)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginTop: '8px' }}>
                <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Verified Public Health Sources & Guidelines:
                </h4>
                <ul style={{ paddingLeft: '18px', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {readingArticle.sources.map((src, idx) => (
                    <li key={idx}><strong>{src}</strong></li>
                  ))}
                </ul>
              </div>
            )}

            {/* Educational Disclaimer */}
            <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', background: 'var(--bg-card)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              * <strong>Medical Disclaimer:</strong> This guide provides general educational insights based on official public-health literature. It does not replace individualized clinical evaluation, diagnosis, or treatment by a qualified healthcare professional.
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
