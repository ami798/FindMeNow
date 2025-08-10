import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab?: 'list' | 'report' | 'home';
  onNavigate?: (tab: 'home' | 'list' | 'report') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab = 'home', onNavigate }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white/90 backdrop-blur border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button onClick={() => onNavigate?.('home')} className="text-left">
              <div className="flex items-baseline gap-2 whitespace-nowrap">
                <span className="text-2xl font-extrabold text-brand leading-none">FindMeNow</span>
                <span className="hidden sm:inline text-xs text-gray-500 leading-none">Missing Persons Finder</span>
              </div>
            </button>
            <nav className="hidden md:flex space-x-6">
              <button onClick={() => onNavigate?.('home')} className={`px-2 py-2 text-sm font-medium transition-colors ${activeTab === 'home' ? 'text-brand' : 'text-gray-700 hover:text-brand'}`}>Home</button>
              <button onClick={() => onNavigate?.('list')} className={`px-2 py-2 text-sm font-medium transition-colors ${activeTab === 'list' ? 'text-brand' : 'text-gray-700 hover:text-brand'}`}>Missing</button>
              <button onClick={() => onNavigate?.('report')} className={`px-2 py-2 text-sm font-medium transition-colors ${activeTab === 'report' ? 'text-brand' : 'text-gray-700 hover:text-brand'}`}>Report Missing</button>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
      </main>

      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-2xl font-extrabold text-brand">FindMeNow</div>
              <p className="text-sm text-gray-600 mt-2">Every second counts. Together, we can bring them home.</p>
            </div>
            <div>
              <div className="font-semibold text-gray-900">Contact</div>
              <p className="text-sm text-gray-600 mt-2">Email: contact@findmenow.org</p>
              <p className="text-sm text-gray-600">Phone: +251 900 000 000</p>
            </div>
            <div>
              <div className="font-semibold text-gray-900">Follow</div>
              <div className="mt-2 flex items-center gap-3 text-gray-600">
                <a className="hover:text-brand" href="#" aria-label="Twitter">Twitter</a>
                <span>·</span>
                <a className="hover:text-brand" href="#" aria-label="Facebook">Facebook</a>
                <span>·</span>
                <a className="hover:text-brand" href="#" aria-label="Instagram">Instagram</a>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center text-xs text-gray-400">© {new Date().getFullYear()} FindMeNow. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 