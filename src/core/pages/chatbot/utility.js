import { useStore } from "../../zustand";
import { eSet } from "../../utility/electronStore";
import { encrypt, encryptPrompts } from "../../utility/encryption";
import { cleanFileTitle } from "../../utility/string";
// ----------------------------------------------------------------------

/**
 * Synchronizes a chat in the zustand store using the provided chat object. Replaces an existing chat if oldUUID exists or adds a new one if "none". Finally, it encrypts and saves the updated chats in electron store.
 *
 * @param {Object} chat - The chat object to be synchronized. It should include 'uuid' property.
 * @param {string} oldUUID - The UUID of the chat to be replaced. If it equals "none", a new chat is added.
 * @param {boolean} chatIsActive - If true, sets the current active chat to the chat being synchronized.
 *
 * @returns {undefined} This function doesn't return anything. It updates application state and local storage.
 */
const chatSync = (chat, oldUUID, chatIsActive) => {
  const { chats, password } = useStore.getState();
  let updatedChats = [...chats];

  if (oldUUID === "none") {
    updatedChats.push(chat);
  } else {
    const index = chats.findIndex((item) => item.uuid === oldUUID);

    if (index !== -1) {
      updatedChats = chats.map((item, i) => (i === index ? chat : item));
    } else {
      updatedChats.push(chat);
    }
  }

  const updatedChatsString = JSON.stringify([...updatedChats]);
  const updatedChatsEncryptedString = encrypt(updatedChatsString, password);

  if (chatIsActive) useStore.setState({ current_chat: chat.uuid });

  useStore.setState({ chats: updatedChats });
  eSet("chats", updatedChatsEncryptedString);
};

const chatDelete = (uuid) => {
  const { chats, password } = useStore.getState();

  const index = chats.findIndex((item) => item.uuid === uuid);
  let updatedChats = [...chats];

  if (index !== -1) {
    updatedChats.splice(index, 1);
  }

  const updatedChatsString = JSON.stringify([...updatedChats]);
  const updatedChatsEncryptedString = encrypt(updatedChatsString, password);

  useStore.setState({ chats: updatedChats });
  eSet("chats", updatedChatsEncryptedString);
};

const promptSelect = (index, system_prompts) => {
  const usedDate = new Date();
  const usedDateISO = String(usedDate.toISOString());

  let systems = [...system_prompts];
  systems[index].usedDate = usedDateISO;

  const password_ = useStore.getState().password;

  const encPrompts = encryptPrompts(systems, password_);

  console.log("NAVIGATION: chatbot", system_prompts[index].title, index);

  eSet("system_prompts", encPrompts); // TODO verify this step is logically needed
  eSet("last_prompt", index);

  useStore.getState().chat_drawer_toggle;

  useStore.setState({
    switch_prompt_dialog_open: false,
    system_prompts: systems,
    active_system_prompt: system_prompts[index],
    chat_drawer_open: false,
    last_prompt: index,
    chat_reset: true,
  });
};

const ImportChat = () => {
  const chats = useStore.getState().chats;

  window.electron.engine
    .dialog_open_filtered_file("", [
      { name: "Skyway Chats", extensions: ["json"] },
    ])
    .then((result) => {
      if (result !== undefined) {
        let base64Data = result.data.split(",")[1];
        let potentialChat = JSON.parse(atob(base64Data));

        let matches = false;

        for (let i = 0; i < chats.length; i++) {
          if (potentialChat.uuid === chats[i].uuid) {
            matches = true;
          }
        }

        if (!matches) {
          chatSync(potentialChat, "none", false);
          useStore.setState({ chat_reset: true });
          useStore.getState().addNotification("Chat added to Library");
        } else {
          useStore.getState().addNotification("Chat already in Library");
        }
      }
    });
};

const ExportChat = (uuid) => {
  const chats = useStore.getState().chats;
  const exporter = async (uuid) => {
    const dir = await window.electron.engine.dialog_choose_directory();
    if (!dir) {
      return; // Cancelled directory choice, exit exporter function
    }

    let indexMatch = -1;

    for (let i = 0; i < chats.length; i++) {
      if (uuid === chats[i].uuid) {
        indexMatch = i;
      }
    }

    if (indexMatch > -1) {
      const chatsCopy = [...chats];

      let chatCopy = chatsCopy[indexMatch];
      chatCopy.skywayType = "chat";

      const jsonstr = JSON.stringify(chatCopy);

      const title = chatCopy.title;
      const cleanTitle = cleanFileTitle(title);

      const args = {
        dir: dir,
        jsonstr: jsonstr,
        filename: cleanTitle,
      };

      window.electron.engine.send("save-json", args);
    }
  };

  exporter(uuid);
};

export { chatSync, promptSelect, chatDelete, ImportChat, ExportChat };
