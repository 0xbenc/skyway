import { useStore } from '../zustand';
// ----------------------------------------------------------------------

/**
 * Fetches the chat completion using the given messages data and model data using the OpenAI API.
 * @async
 * @param {Object[]} messages - An array of message objects where each object contains data about the role and content of the message.
 * @param {String} model - The model to use for the completion, recommended 'gpt-3.5-turbo'.
 * @param {Object} params - Extra parameters if any.
 * @return {Promise<Object|String>} - The response from the API or "error", if an error occurs.
 */
const fetchChatCompletion = async (messages, model, params) => {
  const data = {
    messages,
    model,
    ...params,
  };
  const key = useStore.getState().open_ai_api_key;
  const keys = useStore.getState().open_ai_api_keys;

  try {
    const response = await window.electron.engine.chat(data, keys[key].key);
    return response;
  } catch (error) {
    return 'error';
  }
};

/**
 * Function to test the chat completion connection. It uses a static set
 * of messages and a fixed model "gpt-3.5-turbo" to test the server connection.
 * @async
 * @return {Promise<String>} - The string "success" if connection test is successful, "error" if an error occurs.
 */
const fetchChatCompletionConnectionTest = async () => {
  const messages = [
    {
      role: 'system',
      content: 'Respond Please',
    },
    {
      role: 'user',
      content: 'Connection Test',
    },
  ];

  const model = 'gpt-3.5-turbo';

  const params = {};

  const data = {
    messages,
    model,
    ...params,
  };

  const key = useStore.getState().open_ai_api_key;
  const keys = useStore.getState().open_ai_api_keys;

  try {
    await window.electron.engine.chat(data, keys[key].key);
    return 'success';
  } catch (error) {
    return 'error';
  }
};

export { fetchChatCompletion, fetchChatCompletionConnectionTest };
