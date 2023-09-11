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

const chatDelete = (uuid) => {
  const { chats, password } = useStore.getState();

  const index = chats.findIndex((item) => item.uuid === uuid);
  let updatedChats = [...chats];

  if (index !== -1) {
    updatedChats.splice(index, 1);
  };

  const copy = JSON.stringify([...updatedChats]);
  const encCopy = encrypt(copy, password);
  
  useStore.setState({ chats: updatedChats });
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
    last_prompt: event.target.value,
    chat_reset: true
  });
};

const ImportChat = () => {
  const chats = useStore.getState().chats

  window.electron.engine.dialog_open_filtered_file(
    "",
    [{ name: "Skyway Chats", extensions: ['json'] }]).then(result => {
      if (result !== undefined) {
        let base64Data = result.data.split(",")[1];
        let potentialChat = JSON.parse(atob(base64Data));

        let matches = false;

        for (let i = 0; i < chats.length; i++) {
          if (potentialChat.uuid === chats[i].uuid) {
            matches = true;
          };
        };

        if (!matches) {
          chatSync(potentialChat);
          useStore.setState({chat_reset: true})
          useStore.getState().addNotification("Chat added to Library");
        } else {
          useStore.getState().addNotification("Chat already in Library");
        }
      }
    });
};

export {chatSync, chatSelect, chatDelete, ImportChat};