import { useEffect } from "react";
import { switchColor } from "./utility/switchColor";
import { useStore } from "./zustand";
import { eSet } from "./utility/electronStore";
import { encryptPrompts } from "./utility/encryption";

const HandleIPC = () => {
  const system_prompts = useStore(state => state.system_prompts);
  const page = useStore(state => state.page);
  const password_ = useStore.getState().password;

  useEffect(() => {
    window.ipc.on("new chat", () => {
      if (system_prompts.length) {
        if (page === "new_chat") {
          useStore.setState({ chat_reset: true });
        } else {
          const last_prompt = useStore.getState().last_prompt
          const usedDate = new Date();
          const usedDateISO = String(usedDate.toISOString());

          let systems = [...system_prompts];

          systems[last_prompt].usedDate = usedDateISO;

          const encPrompts = encryptPrompts(systems, password_);

          console.log("NAVIGATION: new_chat", system_prompts[last_prompt].title);

          eSet("system_prompts", encPrompts);

          useStore.setState({ system_prompts: systems });
          useStore.setState({ active_system_prompt: system_prompts[last_prompt], page: "new_chat" });
        }
      }
    });
  }, [system_prompts, page, password_]);

  useEffect(() => {
    window.ipc.on("toggle color", () => {
      switchColor();
    });
  }, [])

  return null
};

export default HandleIPC;