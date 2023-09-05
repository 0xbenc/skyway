import { useStore } from '../../zustand';
import { eSet } from "../../utility/electronStore";
import { encrypt, encryptPrompts } from "../../utility/encryption";
// ----------------------------------------------------------------------

/**
 * Updates an existing chat or appends a new one to the array of chats
 * 
 * @param {Object} chat - The chat item to be synched. 
 * @property {string} chat.uuid - identifies unique chats
 */
const chatSync = (chat) => {
  console.log("here")
  const { chats, password } = useStore.getState();

  const index = chats.findIndex((item) => item.uuid === chat.uuid);
  let updatedChats = chats;

  if (index !== -1) {
    updatedChats = chats.map((item, i) => i === index ? chat : item);
  } else {
    updatedChats.push(chat);
  };

  const copy = JSON.stringify([...updatedChats]);
  const encCopy = encrypt(copy, password)
  
  useStore.setState({ chats: updatedChats, current_chat: chat.uuid });
  eSet('chats', encCopy);
};

const chatSelect = (event, setAnc, system_prompts, setDrawerOpen) => {
  setAnc(null);
  const usedDate = new Date();
  const usedDateISO = String(usedDate.toISOString());

  let systems = [...system_prompts];
  systems[event.target.value].usedDate = usedDateISO;

  const password_ = useStore.getState().password;

  const encPrompts = encryptPrompts(systems, password_);

  console.log("NAVIGATION: chatbot", system_prompts[event.target.value].title, event.target.value);

  eSet('system_prompts', encPrompts); // TODO verify this step is logically needed
  eSet('last_prompt', event.target.value);

  setDrawerOpen(false)

  useStore.setState({
    system_prompts: systems,
    active_system_prompt: system_prompts[event.target.value],
    // page: "chatbot",
    last_prompt: event.target.value,
    chat_reset: true
  });
};


export {chatSync, chatSelect};