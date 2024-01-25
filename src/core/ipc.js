import { useEffect } from "react";
//
import { useStore } from "./zustand";
//
import { switchColorMode } from "./utility/color";
import { eSet } from "./utility/electronStore";
import { encryptPrompts } from "./utility/encryption";
// ----------------------------------------------------------------------

const HandleIPC = () => {
  useEffect(() => {
    const newChatListener = () => {
      const { system_prompts, page, password, last_prompt } =
        useStore.getState();

      if (system_prompts.length) {
        if (page === "chatbot") {
          useStore.setState({ chat_reset: true });
        } else {
          const usedDate = new Date();
          const usedDateISO = String(usedDate.toISOString());

          let systems = [...system_prompts];

          systems[last_prompt].usedDate = usedDateISO;

          const encPrompts = encryptPrompts(systems, password);

          eSet("system_prompts", encPrompts);

          useStore.setState({
            system_prompts: systems,
            active_system_prompt: system_prompts[last_prompt],
            page: "chatbot",
          });
        }
      }
    };

    window.ipc.on("new chat", newChatListener);

    return () => {
      window.ipc.off("new chat", newChatListener);
    };
  }, []);

  useEffect(() => {
    const toggleColorListener = () => {
      switchColorMode();
    };

    window.ipc.on("toggle color", toggleColorListener);

    return () => {
      window.ipc.off("toggle color", toggleColorListener);
    };
  }, []);

  return null;
};

export { HandleIPC };
