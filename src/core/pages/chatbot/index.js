import React from "react";
//
import Chatbot from "./chatbot";
import RenameDialog from "./renameDialog";
import SwitchPromptDialog from "./switch_prompt_dialog";
import ChatDrawer from "./chat_drawer";
import TopBar from "./chatbot_top_bar";
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

export default ChatbotPage;
