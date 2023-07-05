import React from "react";
//
import { useStore } from "../zustand";
//
import Login from "./login";
import Landing from "./landing";
import SystemPrompts from "./systemPrompts";
import SystemPrompt from "./systemPrompt";
import NewSystemPrompt from "./newSystemPrompt";
import NewChat from "./newChat";
import Recovery from "./recovery";
import ChangeAPIKey from "./changeAPIKey";

const HandlePages = () => {
  const page = useStore(state => state.page);

  return (
    <>
      {page === "login" && <Login />}
      {page === "landing" && <Landing />}
      {page === "system_prompts" && <SystemPrompts />}
      {page === "system_prompt" && <SystemPrompt />}
      {page === "new_system_prompt" && <NewSystemPrompt />}
      {page === "new_chat" && <NewChat />}
      {page === "recovery" && <Recovery />}
      {page === "change_api_key" && <ChangeAPIKey />}
    </>
  );
};

export default HandlePages;