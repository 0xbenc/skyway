import { create } from 'zustand';
// ----------------------------------------------------------------------

export const useStore = create((set) => {
  return {
    // START SHARED //

    /* pages:
      login, system_prompts, 
      system_prompt, new_system_prompt, chatbot, 
      recovery, change_api_key
    */
    page: "login",

    // system prompts object from electron-store
    system_prompts: [],

    // gets the app version from an IPC handler during login page
    version: "-1",

    // MUI 5 theme color mode
    color_mode: "light",

    // decrypted OpenAI API Key active
    open_ai_api_key: "missing",

    // decrypted password
    password: "missing",

    //used outside newchat to disable UI elements
    busy_ui: false,

    // powers notistack
    notification_alarm: false,
    notification_message: "",
    addNotification: (messageText) => set({ notification_message: messageText, notification_alarm: true }),

    // true if not a release build
    dev_mode: true,

    // END SHARED //


    // START PROMPT LIBRARY //

    // used by chatbot page to send API requests
    active_system_prompt: {},

    // stores the index of the system prompt the user is editing
    system_prompt_to_edit: -1,

    // END PROMPT LIBRARY //


    // START CHANGE API //

    // decrypted OpenAI API Key list 
    open_ai_api_keys: [],

    // END CHANGE API //


    // START CHATBOT //

    // current conversation token count
    token_count: 0,

    // tracks which prompt was used last
    last_prompt: 1,

    // resets the chat if you file -> new while already chatting
    chat_reset: false,

    // this trigger turns to true when the user choose to re-open a previous conversation
    chat_open: false,

    // stores all conversations, includes the system prompt that was used per chat
    // conversation, timeStamps, uuid, title, prompt, total_tokens, lastActive
    chats: [],

    // uuid
    current_chat: "none",

    // true if the prompt of the current conversation is saved in the library
    prompt_save_status: true,

    // END CHATBOT //
  };
});