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
    color_mode: "dark",

    // decrypted OpenAI API Key
    open_ai_api_key: "missing",

    // decrypted password
    password: "missing",

    // true if not a release build
    devMode: true
  };
});