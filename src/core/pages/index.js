import React from 'react';
//
import { useStore } from '../zustand';
//
import { LoginPage } from './login';
import { LibraryPage } from './library';
import { ChatbotPage } from './chatbot';
import { RecoveryPage } from './recovery';
import { ChangeAPIKeyPage } from './changeAPIKey';
import { PrecheckPage } from './precheck';
import { SetupPage } from './setup';
import { PromptPage } from './prompt';
import { CreditsPage } from './credits';
// ----------------------------------------------------------------------

const HandlePages = () => {
  const page = useStore((state) => state.page);

  return (
    <>
      {page === 'precheck' && <PrecheckPage />}
      {page === 'setup' && <SetupPage />}
      {page === 'login' && <LoginPage />}
      {page === 'recovery' && <RecoveryPage />}
      {page === 'chatbot' && <ChatbotPage />}
      {page === 'change api key' && <ChangeAPIKeyPage />}
      {page === 'library' && <LibraryPage />}
      {page === 'prompt' && <PromptPage />}
      {page === 'credits' && <CreditsPage />}
    </>
  );
};

export { HandlePages };
