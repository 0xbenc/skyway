import { useStore } from "../zustand";
// ----------------------------------------------------------------------

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
    // timestamp here
    return response;
  } catch (error) {
    return "error";
  };
};

const fetchChatCompletionConnectionTest = async () => {
  const messages = [
    {
      "role": "system",
      "content": "Respond Please"
    },
    {
      "role": "user",
      "content": "Connection Test"
    }
  ];

  const model = "gpt-3.5-turbo";

  const params = {};

  const data = {
    messages,
    model,
    ...params
  }

  const key = useStore.getState().open_ai_api_key
  const keys = useStore.getState().open_ai_api_keys

  try {
    await window.electron.engine.chat(data, keys[key].key)
    return "success";
  } catch (error) {
    return "error";
  };
};

export { fetchChatCompletion, fetchChatCompletionConnectionTest };