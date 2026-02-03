import React from 'react';
import { GOOGLE_COLORS, TABS } from '../constants';
import { QrCode } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (id: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-50">
                <QrCode className="w-6 h-6" style={{ color: GOOGLE_COLORS.blue }} />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-gray-900">Feed em Foco 360</h1>
                <p className="text-xs text-gray-500">Sistema de Qr Code</p>
              </div>
            </div>
            <div className="hidden md:flex space-x-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: GOOGLE_COLORS.blue }}></span>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: GOOGLE_COLORS.red }}></span>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: GOOGLE_COLORS.yellow }}></span>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: GOOGLE_COLORS.green }}></span>
            </div>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="border-t border-gray-100 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`
                      whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors duration-200
                      ${isActive 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                    `}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Feed em Foco 360. Powered by Google Gemini.
          </p>
        </div>
      </footer>
    </div>
  );
};