import { useStore } from "../../zustand";
//
import { encryptPrompts } from "../../utility/encryption";
import { eSet } from "../../utility/electronStore";
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

  eSet("system_prompts", encPrompts);

  useStore.getState().addNotification("System Prompt deleted from Library");
  useStore.setState({ system_prompts: newPrompts })
};

const ImportPrompt = () => {
  const system_prompts = useStore.getState().system_prompts

  window.electron.engine.dialog_open_filtered_file(
    "",
    [{ name: "Skyway Prompts", extensions: ['json'] }]).then(result => {
      if (result !== undefined) {
        let base64Data = result.data.split(",")[1];
        let potentialPrompt = JSON.parse(atob(base64Data));

        let matches = false;

        for (let i = 0; i < system_prompts.length; i++) {
          if (potentialPrompt.uuid === system_prompts[i].uuid) {
            matches = true;
          };
        };

        if (!matches) {
          const importedDate = new Date();
          const importedDateISO = String(importedDate.toISOString());

          let newPrompts = [...system_prompts];

          potentialPrompt.importedDate = importedDateISO;

          newPrompts.push(potentialPrompt);

          const password_ = useStore.getState().password;

          const encPrompts = encryptPrompts(newPrompts, password_);

          eSet("system_prompts", encPrompts);

          useStore.setState({ system_prompts: newPrompts });
          useStore.getState().addNotification("System Prompt added to Library");
        } else {
          useStore.getState().addNotification("System Prompt already in Library");
        }
      }
    });
};

export { deleteSystemPrompt, ImportPrompt }