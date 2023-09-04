import { create } from 'zustand';

export const useStore = create(() => {
  return {
    /* pages:
      login, landing, system_prompts, 
      system_prompt, new_system_prompt, new_chat, 
      recovery, change_api_key
    */
    page: "login",

    // system prompts object from electron-store
    system_prompts: [],

    // used by new_chat page to send API requests
    active_system_prompt: {},

    // stores the index of the system prompt the user is editing
    system_prompt_to_edit: -1,

    // gets the app version from an IPC handler during login page
    version: "-1",

    // MUI 5 theme color mode
    color_mode: "light",

    // decrypted OpenAI API Key
    open_ai_api_key: "missing",
    open_ai_api_keys: [],

    // decrypted password
    password: "missing",

    // current conversation tokens
    token_count: 0,

    // Tracks which prompt was used last
    last_prompt: 1,
    
    // resets the chat if you file -> new while already chatting
    chat_reset: false,

    // placeholder
    chat_open: false,

    // placeholder
    chats: [],

    // uuid
    current_chat: "none",

    //placeholder
    prompt_save_status: true,

    //used outside newchat
    busy_ui: false,

    // true if not a release build
    dev_mode: true
  };
});