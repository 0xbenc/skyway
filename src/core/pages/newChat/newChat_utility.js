import { useStore } from '../../zustand';

/**
 * Updates an existing chat or appends a new one to the array of chats
 * 
 * @param {Object} chat - The chat item to be synched. 
 * @property {string} chat.uuid - identifies unique chats
 */
const chatSync = (chat) => {
  const { chats } = useStore.getState();

  const index = chats.findIndex((item) => item.uuid === chat.uuid);
  let updatedChats = chats;

  if (index !== -1) {
    updatedChats = chats.map((item, i) => i === index ? chat : item);
  } else {
    updatedChats.push(chat);
  };

  useStore.setState({ chats: updatedChats, current_chat: chat.uuid });
};

export default chatSync;