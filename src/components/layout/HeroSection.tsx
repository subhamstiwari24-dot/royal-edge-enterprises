import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, Factory, Layers } from 'lucide-react';

interface HeroSectionProps {
  onOpenEnquiry?: () => void;
}

interface HeroSlide {
  id: number;
  image: string;
  alt: string;
  title: string;
  badge: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    image: '/images/products/microdot-fusible-interlining.jpg',
    alt: 'Microdot Coated Fusible Interlining Fabric - Computerized High-Bond Adhesive',
    title: 'Microdot Coated Fabric',
    badge: '180-Mesh Microdot Resin',
  },
  {
    id: 2,
    image: '/images/manufacturing-integrity.jpg',
    alt: 'Garment Manufacturing Materials - Computerized Multi-Needle Embroidery & Stabilizer',
    title: 'Garment Manufacturing Materials',
    badge: 'Zero Fabric Distortion',
  },
  {
    id: 3,
    image: '/images/products/spunbond-embroidery-backing.jpg',
    alt: 'Textile Backing Rolls - Spunbond Polypropylene Non-Woven Stabilizer Roll',
    title: 'Textile Backing Rolls',
    badge: 'Spunbond PP Stabilizer',
  },
  {
    id: 4,
    image: '/images/products/collar-interlining.jpg',
    alt: 'Fusible Interlining Fabric - Thermosetting High-Bond Collar & Cuff Fusing',
    title: 'Fusible Interlining Fabric',
    badge: 'Thermosetting Pre-Shrunk',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenEnquiry }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isHovered]);

  const goToPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handleExploreMore = (e: React.MouseEvent) => {
    e.preventDefault();
    const categoriesSection = document.getElementById('categories');
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.hash = '#categories';
    }
  };

  return (
    <section id="home" className="hero-section">
      <div className="section-container hero-container">
        {/* LEFT COLUMN: EDITORIAL TEXTILE MESSAGING */}
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="eyebrow-badge">MANUFACTURER & WHOLESALER</span>
            <span className="hero-location-tag">Chembur, Mumbai</span>
          </div>

          <h1 className="hero-title">
            Precision Fusible Interlining & Backing Materials for Apparel Excellence
          </h1>

          <p className="hero-subtitle">
            Supplying India’s leading garment exporters, uniform manufacturers, and bespoke tailors with premium collar fusing, waistband belt rolls, embroidery patti, and spunbond backing.
          </p>

          {/* KEY PRODUCTION PILLARS */}
          <div className="hero-highlights-grid">
            <div className="hero-highlight-item">
              <CheckCircle2 size={16} className="highlight-icon" />
              <span>Tested Thermal Adhesive Recovery</span>
            </div>
            <div className="hero-highlight-item">
              <CheckCircle2 size={16} className="highlight-icon" />
              <span>Custom Slit Widths (10mm to 150cm)</span>
            </div>
            <div className="hero-highlight-item">
              <CheckCircle2 size={16} className="highlight-icon" />
              <span>Dual B2B Wholesale & Retail Rolls</span>
            </div>
            <div className="hero-highlight-item">
              <CheckCircle2 size={16} className="highlight-icon" />
              <span>Certified GST Invoicing & MSME Assured</span>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="hero-cta-group">
            <a href="#categories" className="btn-primary hero-btn-main">
              <span>Explore Product Catalog</span>
              <ArrowRight size={16} />
            </a>

            <a
              href="#enquiry"
              onClick={onOpenEnquiry}
              className="btn-secondary hero-btn-sub"
            >
              <span>Request Wholesale Quote</span>
            </a>
          </div>

          {/* TRUST BADGE STRIP */}
          <div className="hero-trust-strip">
            <div className="trust-stat">
              <span className="stat-number">25+</span>
              <span className="stat-label">Years Textile Expertise</span>
            </div>
            <div className="trust-stat-divider" />
            <div className="trust-stat">
              <span className="stat-number">50,000+</span>
              <span className="stat-label">Meters Ready Inventory</span>
            </div>
            <div className="trust-stat-divider" />
            <div className="trust-stat">
              <span className="stat-number">48 Hrs</span>
              <span className="stat-label">Dispatch Turnaround</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LUXURY INDUSTRIAL TEXTILE SHOWCASE & SLIDER */}
        <div className="hero-media-wrapper">
          <div
            className="hero-image-card"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
          >
            <div className="hero-image-inner">
              {/* HORIZONTAL SLIDER TRACK */}
              <div
                className="hero-slider-track"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {HERO_SLIDES.map((slide) => (
                  <div key={slide.id} className="hero-slide">
                    <img
                      src={slide.image}
                      alt={slide.alt}
                      className="hero-slide-img"
                    />
                    <div className="hero-slide-overlay" />
                  </div>
                ))}
              </div>

              {/* SINGLE ELEGANT GOLD-ACCENTED LABEL AT TOP-LEFT */}
              <div className="hero-top-badge">
                <span className="gold-accent-dot" />
                <span className="hero-badge-title">{HERO_SLIDES[currentSlide].title}</span>
                <span className="hero-badge-divider">•</span>
                <span className="hero-badge-subtitle">{HERO_SLIDES[currentSlide].badge}</span>
              </div>

              {/* MANUAL NAVIGATION ARROWS */}
              <button
                type="button"
                className="hero-slider-arrow hero-slider-prev"
                onClick={goToPrev}
                aria-label="Previous slide"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                className="hero-slider-arrow hero-slider-next"
                onClick={goToNext}
                aria-label="Next slide"
              >
                <ChevronRight size={18} />
              </button>

              {/* SLIDER DOT INDICATORS */}
              <div
                className="hero-slider-dots"
                role="tablist"
                aria-label="Slider navigation"
              >
                {HERO_SLIDES.map((slide, idx) => (
                  <button
                    key={slide.id}
                    type="button"
                    role="tab"
                    aria-selected={idx === currentSlide}
                    aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
                    className={`hero-slider-dot ${idx === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(idx)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* CLEAN HORIZONTAL MANUFACTURING INFORMATION STRIP BELOW IMAGE */}
          <div className="hero-manufacturing-strip">
            <div className="mfg-strip-item">
              <div className="mfg-strip-icon">
                <Factory size={16} />
              </div>
              <div className="mfg-strip-content">
                <span className="mfg-strip-label">Direct Factory Facility</span>
                <span className="mfg-strip-val">Chembur, Mumbai 400089</span>
              </div>
            </div>

            <div className="mfg-strip-divider" />

            <div className="mfg-strip-item">
              <div className="mfg-strip-icon">
                <Layers size={16} />
              </div>
              <div className="mfg-strip-content">
                <span className="mfg-strip-label">Fusible Technology</span>
                <span className="mfg-strip-val">Microdot Computerized Coating</span>
              </div>
            </div>
          </div>

          {/* ATTRACTIVE EXPLORE MORE BUTTON */}
          <div className="hero-slider-action-bar">
            <button
              type="button"
              className="hero-explore-more-btn"
              onClick={handleExploreMore}
              aria-label="Explore Product Categories"
            >
              <span>Explore More</span>
              <ArrowRight size={16} className="explore-btn-arrow" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
