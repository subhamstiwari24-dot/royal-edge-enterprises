import React, { useState, useEffect } from 'react';
import { AnnouncementBar } from '../components/layout/AnnouncementBar';
import { Navbar } from '../components/layout/Navbar';
import { HeroSection } from '../components/layout/HeroSection';
import { CredibilitySection } from '../components/layout/CredibilitySection';
import { ProductCategoriesSection } from '../components/products/ProductCategoriesSection';
import { ProductDetailModal } from '../components/products/ProductDetailModal';
import { WhyChooseUsSection } from '../components/layout/WhyChooseUsSection';
import { AboutSection } from '../components/layout/AboutSection';
import { EnquiryFormSection } from '../components/forms/EnquiryFormSection';
import { ContactSection } from '../components/layout/ContactSection';
import { Footer } from '../components/layout/Footer';
import type { PublicProduct, ProductCategory } from '../types';
import { royalEdgeService } from '../services/api';

export const PublicHomePage: React.FC = () => {
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<PublicProduct | null>(null);
  const [enquiryProduct, setEnquiryProduct] = useState<PublicProduct | null>(null);

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

  const handleSelectCategoryFromFooter = (_cat: ProductCategory) => {
    const el = document.getElementById('products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="website-root">
      {/* 1. ANNOUNCEMENT BAR */}
      <AnnouncementBar />

      {/* 2. PREMIUM NAVBAR */}
      <Navbar onOpenEnquiry={handleOpenEnquiryGeneral} />

      <main>
        {/* 3. HERO SECTION */}
        <HeroSection onOpenEnquiry={handleOpenEnquiryGeneral} />

        {/* 4. COMPANY CREDIBILITY & ASSURANCE */}
        <CredibilitySection />

        {/* 5. APPROVED PRODUCT CATEGORIES (8 CATEGORIES) */}
        <ProductCategoriesSection
          products={products}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onEnquireProduct={handleEnquireSpecificProduct}
        />

        {/* 7. WHY CHOOSE ROYAL EDGE */}
        <WhyChooseUsSection />

        {/* 8. ABOUT ROYAL EDGE ENTERPRISES */}
        <AboutSection onOpenEnquiry={handleOpenEnquiryGeneral} />

        {/* 9. REQUEST A QUOTE / ENQUIRY SECTION */}
        <EnquiryFormSection
          preselectedProduct={enquiryProduct}
          onClearPreselected={() => setEnquiryProduct(null)}
        />

        {/* 10. CONTACT & FACTORY LOCATION */}
        <ContactSection />
      </main>

      {/* 11. PROFESSIONAL FOOTER */}
      <Footer onSelectCategory={handleSelectCategoryFromFooter} />

      {/* 6. PRODUCT DETAIL MODAL */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onEnquire={handleEnquireSpecificProduct}
      />
    </div>
  );
};
