import React from "react";
//
import { useStore } from "../zustand";
//
import Login from "./login";
import SystemPrompts from "./systemPrompts";
import SystemPrompt from "./systemPrompt";
import NewSystemPrompt from "./newSystemPrompt";
import Chatbot from "./chatbot";
import Recovery from "./recovery";
import ChangeAPIKey from "./change_api_key";

const HandlePages = () => {
  const page = useStore(state => state.page);

  return (
    <>
      {page === "login" && <Login />}
      {page === "recovery" && <Recovery />}
      {page === "chatbot" && <Chatbot />}
      {page === "change api key" && <ChangeAPIKey />}
      {page === "system_prompts" && <SystemPrompts />}
      {page === "new_system_prompt" && <NewSystemPrompt />}
      {page === "system_prompt" && <SystemPrompt />}
    </>
  );
};

export default HandlePages;