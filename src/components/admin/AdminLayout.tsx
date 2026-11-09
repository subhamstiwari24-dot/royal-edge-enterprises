import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Users,
  MessageSquareQuote,
  FileCheck2,
  ShoppingCart,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
  ChevronRight,
} from 'lucide-react';
import { royalEdgeService } from '../../services/api';

export type AdminTab =
  | 'overview'
  | 'products'
  | 'customers'
  | 'enquiries'
  | 'quotations'
  | 'orders';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onLogout: () => void;
  pendingEnquiryCount?: number;
  activeQuoteCount?: number;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onLogout,
  pendingEnquiryCount = 0,
  activeQuoteCount = 0,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems: { tab: AdminTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      tab: 'overview',
      label: 'Dashboard Overview',
      icon: <LayoutDashboard size={18} />,
    },
    {
      tab: 'products',
      label: 'Product Catalogue',
      icon: <Package size={18} />,
    },
    {
      tab: 'enquiries',
      label: 'Customer Enquiries',
      icon: <MessageSquareQuote size={18} />,
      badge: pendingEnquiryCount,
    },
    {
      tab: 'quotations',
      label: 'Private Quotations',
      icon: <FileCheck2 size={18} />,
      badge: activeQuoteCount,
    },
    {
      tab: 'orders',
      label: 'Confirmed Orders',
      icon: <ShoppingCart size={18} />,
    },
    {
      tab: 'customers',
      label: 'Customer Registry',
      icon: <Users size={18} />,
    },
  ];

  const handleTabClick = (tab: AdminTab) => {
    onSelectTab(tab);
    setSidebarOpen(false);
  };

  const getTabTitle = (tab: AdminTab) => {
    switch (tab) {
      case 'overview':
        return 'Operational Overview';
      case 'products':
        return 'Product Catalogue & Internal Costing';
      case 'enquiries':
        return 'Customer Inquiries & Leads';
      case 'quotations':
        return 'Private B2B Quotations';
      case 'orders':
        return 'Confirmed Orders Management';
      case 'customers':
        return 'Customer Database & Accounts';
      default:
        return 'Admin Portal';
    }
  };

  return (
    <div className="admin-root">
      {/* SIDEBAR OVERLAY FOR MOBILE */}
      {sidebarOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-brand">
            <div className="admin-logo-frame">
              <img
                src="/royal-edge-logo.jpg"
                alt="Royal Edge Logo"
                className="admin-logo-img"
              />
            </div>
            <div>
              <span className="admin-brand-title">ROYAL EDGE</span>
              <span className="admin-brand-sub">Admin Operations</span>
            </div>
          </div>
          <button
            type="button"
            className="admin-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="admin-sidebar-nav">
          <span className="admin-nav-category">CORE WORKFLOW</span>
          {navItems.map((item) => (
            <button
              key={item.tab}
              type="button"
              className={`admin-nav-item ${currentTab === item.tab ? 'active' : ''}`}
              onClick={() => handleTabClick(item.tab)}
            >
              <span className="nav-item-icon">{item.icon}</span>
              <span className="nav-item-label">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="admin-badge-count">{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        {/* SIDEBAR FOOTER */}
        <div className="admin-sidebar-footer">
          <a
            href="/"
            className="admin-footer-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink size={15} />
            <span>View Public Website</span>
          </a>

          <button
            type="button"
            className="admin-logout-btn"
            onClick={() => {
              royalEdgeService.adminLogout();
              onLogout();
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN ADMIN AREA */}
      <div className="admin-main-wrap">
        {/* TOPBAR */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              type="button"
              className="admin-menu-toggle"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar menu"
            >
              <Menu size={22} />
            </button>

            <div className="admin-breadcrumbs">
              <span className="crumb-root">Portal</span>
              <ChevronRight size={14} className="crumb-sep" />
              <span className="crumb-active">{getTabTitle(currentTab)}</span>
            </div>
          </div>

          <div className="admin-topbar-right">
            <div className="admin-session-badge">
              <Shield size={14} className="shield-icon" />
              <span>Authorized Administrator</span>
            </div>

            <a
              href="/"
              className="admin-topbar-site-link"
              title="Return to customer website"
            >
              <span>Customer Site</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="admin-page-content">
          {children}
        </main>
      </div>
    </div>
  );
};
