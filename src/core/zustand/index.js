import { create } from 'zustand';

export const useStore = create(() => {
  return {
    page: "login",
    system_prompts: [],
    active_system_prompt: {},
    system_prompt_to_edit: -1,
    version: "-1",
    color_mode: "dark",
    open_ai_api_key: "missing",
    password: "missing",
    devMode: false
  };
});