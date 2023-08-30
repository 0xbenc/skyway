import { useStore } from "../../zustand";
//
import { eSet } from "../../utility/electronStore";
import { encryptPrompts } from "../../utility/encryption";

// ----------------------------------------------------------------------

const chatSelect = (event, setAnc, system_prompts, setDrawerOpen) => {
  setAnc(null);
  const usedDate = new Date();
  const usedDateISO = String(usedDate.toISOString());

  let systems = [...system_prompts];
  systems[event.target.value].usedDate = usedDateISO;

  const password_ = useStore.getState().password;

  const encPrompts = encryptPrompts(systems, password_);

  console.log("NAVIGATION: new_chat", system_prompts[event.target.value].title, event.target.value);

  eSet('system_prompts', encPrompts);
  eSet('last_prompt', event.target.value);

  setDrawerOpen(false)

  useStore.setState({
    system_prompts: systems,
    active_system_prompt: system_prompts[event.target.value],
    // page: "new_chat",
    last_prompt: event.target.value,
    chat_reset: true
  });
};

export default chatSelect;