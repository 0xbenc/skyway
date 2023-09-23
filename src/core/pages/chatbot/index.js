import React from "react";
//
import { Chatbot } from "./chatbot";
import { RenameDialog } from "./renameDialog";
import { SwitchPromptDialog } from "./switchPromptDialog";
import { ChatDrawer } from "./drawer";
import { TopBar } from "./topBar";
// ----------------------------------------------------------------------

const ChatbotPage = () => {
  return (
    <>
      <TopBar />

      <Chatbot />

      <ChatDrawer />
      <SwitchPromptDialog />
      <RenameDialog />
    </>
  );
};

export { ChatbotPage };
