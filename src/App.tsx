
import {
  Search,
  ShoppingBag,
  Menu,
  ArrowRight,
  ShieldCheck,
  Factory,
  Truck,
  Award,
  MessageCircle,
  Phone,
  MapPin,
  Mail,
} from "lucide-react";

import "./App.css";

const WHATSAPP_NUMBER = "919004904983";

const products = [
  {
    id: 1,
    name: "Embroidered Collar",
    category: "COLLAR",
    description:
      "Premium quality collar materials for garment manufacturing.",
    image:
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800",
  },
  {
    id: 2,
    name: "Embroidered Cuff",
    category: "CUFF",
    description:
      "Quality cuff materials for different garment applications.",
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800",
  },
  {
    id: 3,
    name: "Belt Roll",
    category: "BELT ROLL",
    description:
      "Premium belt roll materials for garment manufacturers.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
  },
  {
    id: 4,
    name: "Embroidery Patti",
    category: "PATTI",
    description:
      "Quality patti products for embroidery applications.",
    image:
      "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=800",
  },
  {
    id: 5,
    name: "Embroidery Backing",
    category: "BACKING",
    description:
      "Backing materials for professional embroidery work.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
  },
];

const getWhatsAppLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

function App() {
  return (
    <div className="website">

      {/* ANNOUNCEMENT BAR */}

      <div className="announcement">
        PREMIUM EMBROIDERY & INTERLINING MANUFACTURER
      </div>

      {/* NAVIGATION BAR */}

      <header className="navbar">

        <a href="#home" className="brand">
          <span>ROYAL EDGE</span>
          <small>ENTERPRISES</small>
        </a>

        <nav>
          <a href="#home">Home</a>
          <a href="#products">Our Products</a>
          <a href="#about">About Us</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="nav-actions">

          <a href="#products" aria-label="Search products">
            <Search />
          </a>

          <a href="#products" aria-label="Shopping">
            <ShoppingBag />
          </a>

          <a
            href="#contact"
            className="mobile-menu"
            aria-label="Contact menu"
          >
            <Menu />
          </a>

        </div>

      </header>

      <main>

        {/* HERO SECTION */}

        <section className="hero" id="home">

          <div className="hero-content">

            <span className="eyebrow">
              THE INTERLINING COMPANY
            </span>

            <h1>
              Excellence in
              <br />
              Every <span>Stitch.</span>
            </h1>

            <p>
              Royal Edge Enterprises is a manufacturer
              and supplier of premium quality Collar,
              Cuff, Belt Roll, Patti and Embroidery
              Backing materials.
            </p>

            <div className="hero-buttons">

              <a href="#products" className="gold-button">
                Explore Products
                <ArrowRight size={18} />
              </a>

              <a
                href={getWhatsAppLink(
                  "Hello Royal Edge Enterprises, I am interested in your wholesale products. Please share your product catalogue."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="outline-button"
              >
                Get Wholesale Quote
              </a>

            </div>

            <div className="hero-note">
              MANUFACTURING · WHOLESALE · RETAIL
            </div>

          </div>

          <div className="hero-image">

            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200"
              alt="Textile manufacturing"
            />

            <div className="image-label">
              <span>ROYAL EDGE</span>
              <small>QUALITY YOU CAN TRUST</small>
            </div>

          </div>

        </section>

        {/* BUSINESS FEATURES */}

        <section className="features">

          <div>
            <Factory />
            <span>Manufacturing Excellence</span>
          </div>

          <div>
            <ShieldCheck />
            <span>Quality Products</span>
          </div>

          <div>
            <Truck />
            <span>Bulk Order Supply</span>
          </div>

          <div>
            <Award />
            <span>Customer Satisfaction</span>
          </div>

        </section>

        {/* PRODUCT COLLECTION */}

        <section className="products-section" id="products">

          <div className="section-heading">

            <span className="eyebrow">
              OUR PRODUCT COLLECTION
            </span>

            <h2>Explore Our Products</h2>

            <p>
              Discover our range of embroidery and
              interlining products manufactured
              for garment businesses.
            </p>

          </div>

          <div className="product-grid">

            {products.map((product) => (

              <article
                className="product-card"
                key={product.id}
              >

                <div className="product-image">

                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                  />

                </div>

                <div className="product-info">

                  <small>{product.category}</small>

                  <h3>{product.name}</h3>

                  <p>{product.description}</p>

                  <a
                    href={getWhatsAppLink(
                      `Hello Royal Edge Enterprises, I am interested in ${product.name}. Please share product details, available designs and pricing.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get Best Price
                    <ArrowRight size={16} />
                  </a>

                </div>

              </article>

            ))}

          </div>

        </section>

        {/* ABOUT COMPANY */}

        <section className="about-section" id="about">

          <span className="eyebrow">
            ABOUT ROYAL EDGE ENTERPRISES
          </span>

          <h2>
            The Interlining Company.
          </h2>

          <p>
            Royal Edge Enterprises specializes in
            manufacturing and supplying Collar, Cuff,
            Belt Roll, Patti and Embroidery Backing.
            We serve businesses looking for quality
            embroidery and interlining materials.
          </p>

          <a
            href={getWhatsAppLink(
              "Hello Royal Edge Enterprises, I want to discuss a bulk order."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="gold-button"
          >
            Discuss Bulk Orders
            <ArrowRight size={18} />
          </a>

        </section>

        {/* CONTACT SECTION */}

        <section className="contact-section" id="contact">

          <span className="eyebrow">
            CONNECT WITH US
          </span>

          <h2>
            Looking for Quality Products?
          </h2>

          <p>
            Contact Royal Edge Enterprises for
            product information, wholesale pricing
            and bulk order enquiries.
          </p>

          <a
            href={getWhatsAppLink(
              "Hello Royal Edge Enterprises, I would like to know more about your products."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="gold-button"
          >
            <MessageCircle size={18} />
            Enquire on WhatsApp
          </a>

        </section>

      </main>

      {/* PROFESSIONAL FOOTER */}

      <footer className="main-footer">

        <div className="footer-container">

          {/* COLUMN 1 - BRAND */}

          <div className="footer-column footer-brand-column">

            <div className="brand footer-brand">
              <span>ROYAL EDGE</span>
              <small>ENTERPRISES</small>
            </div>

            <p className="footer-tagline">
              THE INTERLINING COMPANY
            </p>

            <p className="footer-description">
              Manufacturer of premium Collar, Cuff,
              Belt Roll, Patti and Embroidery Backing.
              Quality products for garment businesses.
            </p>

          </div>

          {/* COLUMN 2 - CONTACT */}

          <div className="footer-column">

            <h3>Contact Information</h3>

            <div className="footer-contact-item">

              <Phone size={18} />

              <div>
                <small>Call / WhatsApp</small>

                <a href="tel:+919004904983">
                  +91 90049 04983
                </a>
              </div>

            </div>

            <div className="footer-contact-item">

              <MapPin size={18} />

              <div>
                <small>Our Location</small>

                <p>
                  Puja Garage, Santosh Nagar,
                  Pestom Sagar, P.L. Lokhande Marg,
                  Chembur, Mumbai - 89
                </p>
              </div>

            </div>

            <div className="footer-contact-item">

              <Mail size={18} />

              <div>
                <small>Business Enquiries</small>

                <p>
                  Contact us for product enquiries
                </p>
              </div>

            </div>

          </div>

          {/* COLUMN 3 - BUSINESS DETAILS */}

          <div className="footer-column">

            <h3>Business Information</h3>

            <div className="footer-business-info">

              <small>GST Registration</small>

              <p>
                27IGJPP0982F1ZY
              </p>

            </div>

            <div className="footer-business-info">

              <small>MSME Registration</small>

              <p>
                UDYAM-MH-18-0485033
              </p>

            </div>

            <a
              href="https://wa.me/919004904983"
              target="_blank"
              rel="noopener noreferrer"
              className="gold-button footer-whatsapp"
            >
              <MessageCircle size={18} />
              Contact on WhatsApp
            </a>

          </div>

        </div>

        {/* FOOTER COPYRIGHT */}

        <div className="footer-bottom">

          <p>
            © 2026 Royal Edge Enterprises. All Rights Reserved.
          </p>

          <p>
            Precision in Every Stitch.
            Excellence in Every Detail.
          </p>

        </div>

      </footer>

    </div>
  );
}

export default App;
