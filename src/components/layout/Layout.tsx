import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingWhatsApp from './FloatingWhatsApp';

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    return <Outlet />;
  }

  return (
    <div className="flex flex-col min-h-screen font-sans selection:bg-primary-gold selection:text-primary-green">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
