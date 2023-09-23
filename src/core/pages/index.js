import React from "react";
//
import { useStore } from "../zustand";
//
import { LoginPage } from "./login";
import { SystemPromptsPage } from "./systemPrompts";
import { EditSystemPromptPage } from "./systemPrompt";
import { NewSystemPromptPage } from "./newSystemPrompt";
import { ChatbotPage } from "./chatbot";
import { RecoveryPage } from "./recovery";
import { ChangeAPIKeyPage } from "./changeAPIKey";
// ----------------------------------------------------------------------

const HandlePages = () => {
  const page = useStore(state => state.page);

  return (
    <>
      {page === "login" && <LoginPage />}
      {page === "recovery" && <RecoveryPage />}
      {page === "chatbot" && <ChatbotPage />}
      {page === "change api key" && <ChangeAPIKeyPage />}
      {page === "system_prompts" && <SystemPromptsPage />}
      {page === "new_system_prompt" && <NewSystemPromptPage />}
      {page === "system_prompt" && <EditSystemPromptPage />}
    </>
  );
};

export { HandlePages };