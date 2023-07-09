import { useStore } from "../zustand";

const fetchChatCompletion = async (messages, model, params) => {
  const data = {
    messages,
    model,
    ...params
  }
  const key = useStore.getState().open_ai_api_key
  const keys = useStore.getState().open_ai_api_keys

  try {
    const response = await window.electron.engine.chat(data, keys[key].key)
    return response;
  } catch (error) {
    return "error";
  };
};

export { fetchChatCompletion };