import { useEffect } from "react";
//
import { useStore } from "./zustand";
//
import { switchColor } from "./utility/switchColor";
import { eSet } from "./utility/electronStore";
import { encryptPrompts } from "./utility/encryption";
// ----------------------------------------------------------------------

const HandleIPC = () => {
  useEffect(() => {
    window.ipc.on("new chat", () => {
      const system_prompts = useStore.getState().system_prompts;
      const page = useStore.getState().page;
      const password_ = useStore.getState().password;

      if (system_prompts.length) {
        if (page === "chatbot") {
          useStore.setState({ chat_reset: true });
        } else {
          const last_prompt = useStore.getState().last_prompt
          const usedDate = new Date();
          const usedDateISO = String(usedDate.toISOString());

          let systems = [...system_prompts];

          systems[last_prompt].usedDate = usedDateISO;

          const encPrompts = encryptPrompts(systems, password_);

          eSet("system_prompts", encPrompts);

          useStore.setState({
            system_prompts: systems,
            active_system_prompt: system_prompts[last_prompt],
            page: "chatbot"
          });
        }
      }
    });
  }, []);

  useEffect(() => {
    window.ipc.on("toggle color", () => {
      switchColor();
    });
  }, [])

  return null
};

export default HandleIPC;