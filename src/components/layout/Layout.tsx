import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { VoiceAssistantModal } from '../modals/VoiceAssistantModal';
import { LanguageModal } from '../modals/LanguageModal';

export const Layout: React.FC = () => {
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-surface font-body-md text-on-surface antialiased">
      <Header
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
      />

      <main className="w-full pt-20 flex-1">
        <Outlet context={{ openVoiceModal: () => setIsVoiceModalOpen(true) }} />
      </main>

      <Footer />

      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />

      <LanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
      />
    </div>
  );
};
