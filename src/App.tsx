import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { RecordingTab } from './components/RecordingTab';
import { TranscribeTab } from './components/TranscribeTab';
import { SearchTab } from './components/SearchTab';
import { SettingsTab } from './components/SettingsTab';
import { NavigationTab } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('record');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabChange = (tab: NavigationTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'record':
        return <RecordingTab />;
      case 'transcribe':
        return <TranscribeTab />;
      case 'search':
        return <SearchTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <RecordingTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      
      <main className="animate-fade-in">
        {renderActiveTab()}
      </main>
    </div>
  );
}

export default App;