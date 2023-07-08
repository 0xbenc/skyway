import { useStore } from "../../zustand";
//
import { encryptPrompts } from "../../utility/encryption";

// ----------------------------------------------------------------------

const deleteSystemPrompt = (index) => {
  const system_prompts = useStore.getState().system_prompts;
  const password_ = useStore.getState().password;

  let newPrompts = []

  for (let i = 0; i < system_prompts.length; i++) {
    if (i !== index) {
      newPrompts.push(system_prompts[i])
    }
  }

  const encPrompts = encryptPrompts(newPrompts, password_)

  window.electron.store.set("system_prompts", encPrompts);

  useStore.setState({ system_prompts: newPrompts })
}

export { deleteSystemPrompt }