import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PayPalModal } from './components/PayPalModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { PricesPage } from './pages/PricesPage';
import { BookAppointmentPage } from './pages/BookAppointmentPage';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { LoyaltyPage } from './pages/LoyaltyPage';
import { ReferralsPage } from './pages/ReferralsPage';
import { WashHistoryPage } from './pages/WashHistoryPage';
import { MessagesPage } from './pages/MessagesPage';
import { QuestionsPage } from './pages/QuestionsPage';
import { StaffCheckInPage } from './pages/StaffCheckInPage';
import { PlateLookupPage } from './pages/PlateLookupPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ServiceManagementPage } from './pages/ServiceManagementPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

const AppContent: React.FC = () => {
  const { currentPage, payPalModalState, closePayPal, currentUser } = useApp();

  const renderCurrentPage = () => {
    const protectedPages = new Set(['staff-checkin','plate-lookup','admin-dashboard','service-management','staff-management']);
    if (protectedPages.has(currentPage) && !currentUser) return <LoginPage />;
    if (['admin-dashboard','service-management','staff-management'].includes(currentPage) && currentUser?.role !== 'admin') return <LandingPage />;
    if (['staff-checkin','plate-lookup'].includes(currentPage) && !['staff','admin'].includes(currentUser?.role || '')) return <LandingPage />;
    switch (currentPage) {
      case 'landing':
        return <LandingPage />;
      case 'prices':
        return <PricesPage />;
      case 'book':
        return <BookAppointmentPage />;
      case 'customer-dashboard':
        return <CustomerDashboard />;
      case 'loyalty':
        return <LoyaltyPage />;
      case 'referrals':
        return <ReferralsPage />;
      case 'history':
        return <WashHistoryPage />;
      case 'messages':
        return <MessagesPage />;
      case 'questions':
        return <QuestionsPage />;
      case 'staff-checkin':
        return <StaffCheckInPage />;
      case 'plate-lookup':
        return <PlateLookupPage />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'service-management':
        return <ServiceManagementPage />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-red-600 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      <Footer />

      {/* Global PayPal modal if opened via context */}
      <PayPalModal
        isOpen={payPalModalState.isOpen}
        onClose={closePayPal}
        amountZAR={payPalModalState.amount}
        description={payPalModalState.description}
        onPaymentSuccess={() => {
          if (payPalModalState.onSuccess) {
            payPalModalState.onSuccess();
          }
          closePayPal();
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
