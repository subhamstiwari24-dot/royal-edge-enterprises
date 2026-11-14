import React, { useState, useEffect } from 'react';
import { AnnouncementBar } from '../components/layout/AnnouncementBar';
import { Navbar } from '../components/layout/Navbar';
import { HeroSection } from '../components/layout/HeroSection';
import { CredibilitySection } from '../components/layout/CredibilitySection';
import { ProductCategoriesSection } from '../components/products/ProductCategoriesSection';
import { FeaturedProductsSection } from '../components/products/FeaturedProductsSection';
import { WholesaleBenefitsSection } from '../components/layout/WholesaleBenefitsSection';
import { WhyChooseUsSection } from '../components/layout/WhyChooseUsSection';
import { AboutSection } from '../components/layout/AboutSection';
import { TestimonialsSection } from '../components/layout/TestimonialsSection';
import { EnquiryFormSection } from '../components/forms/EnquiryFormSection';
import { ContactSection } from '../components/layout/ContactSection';
import { Footer } from '../components/layout/Footer';
import { ProductDetailModal } from '../components/products/ProductDetailModal';
import { CartDrawer } from '../components/cart/CartDrawer';
import { SearchModal } from '../components/modals/SearchModal';
import { CustomerAuthModal } from '../components/modals/CustomerAuthModal';
import { CartProvider } from '../context/CartContext';
import type { PublicProduct } from '../types';
import { royalEdgeService } from '../services/api';

export const PublicHomePage: React.FC = () => {
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<PublicProduct | null>(null);
  const [enquiryProduct, setEnquiryProduct] = useState<PublicProduct | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await royalEdgeService.getPublicProducts();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  const handleOpenEnquiryGeneral = () => {
    setEnquiryProduct(null);
    const el = document.getElementById('enquiry');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleEnquireSpecificProduct = (product: PublicProduct) => {
    setEnquiryProduct(product);
    const el = document.getElementById('enquiry');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCategoryFromFooter = (_cat: string) => {
    const el = document.getElementById('categories');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <CartProvider>
      <div className="website-root">
        {/* 1. ANNOUNCEMENT BAR */}
        <AnnouncementBar />

        {/* 2. RESPONSIVE NAVBAR WITH SEARCH, ACCOUNT, AND CART */}
        <Navbar
          onOpenEnquiry={handleOpenEnquiryGeneral}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenAccount={() => setIsAccountOpen(true)}
        />

        <main>
          {/* 3. LARGE HERO SECTION SHOWCASING INTERLININGS */}
          <HeroSection onOpenEnquiry={handleOpenEnquiryGeneral} />

          {/* 4. PRODUCTION CREDIBILITY BAR */}
          <CredibilitySection />

          {/* 5. SHOP BY CATEGORY SECTION (Collar, Cuff, Belt Roll, Patti, Embroidery Backing) */}
          <ProductCategoriesSection
            products={products}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onEnquireProduct={handleEnquireSpecificProduct}
          />

          {/* 6. FEATURED PRODUCTS SECTION & RETAIL/WHOLESALE PRICING OPTIONS */}
          <FeaturedProductsSection
            products={products}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onEnquireProduct={handleEnquireSpecificProduct}
          />

          {/* 7. WHOLESALE BENEFITS SECTION (Charcoal Background with Gold Icons) */}
          <WholesaleBenefitsSection onOpenEnquiry={handleOpenEnquiryGeneral} />

          {/* 8. INDUSTRIAL MANUFACTURING CAPABILITY */}
          <WhyChooseUsSection />

          {/* 9. COMPANY INTRODUCTION (About Royal Edge Enterprises) */}
          <AboutSection onOpenEnquiry={handleOpenEnquiryGeneral} />

          {/* 10. CUSTOMER TESTIMONIALS (Verified Apparel Exporters & Embroidery Units) */}
          <TestimonialsSection />

          {/* 11. REQUEST A QUOTE / ENQUIRY SECTION (Preserved Business Logic) */}
          <EnquiryFormSection
            preselectedProduct={enquiryProduct}
            onClearPreselected={() => setEnquiryProduct(null)}
          />

          {/* 12. FACTORY LOCATION & DISPATCH DESK */}
          <ContactSection />
        </main>

        {/* 13. PROFESSIONAL FOOTER (Deep Charcoal with Ivory Text and Gold Highlights) */}
        <Footer onSelectCategory={handleSelectCategoryFromFooter} />

        {/* 14. PRODUCT DETAIL & SPECIFICATION MODAL */}
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onEnquire={handleEnquireSpecificProduct}
        />

        {/* 15. INTERACTIVE CART & DRAFT QUOTE DRAWER */}
        <CartDrawer
          onRequestQuote={handleOpenEnquiryGeneral}
        />

        {/* 16. LIVE PRODUCT & SKU SEARCH MODAL */}
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          products={products}
          onSelectProduct={(p) => setSelectedProduct(p)}
        />

        {/* 17. CUSTOMER ACCOUNT & ORDER TRACKING MODAL */}
        <CustomerAuthModal
          isOpen={isAccountOpen}
          onClose={() => setIsAccountOpen(false)}
        />
      </div>
    </CartProvider>
  );
};
