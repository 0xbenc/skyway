import React from "react";
//
import { useStore } from "../../zustand";
//
import { previewText } from "../../utility/string";
import { navigate } from "../../utility/navigatePage";
import { BasicBox, OutlinePaper } from "../../mui/reusable";
import { deleteSystemPrompt } from "./systemPrompts_utility";
import Title from "../../components/title";
import { eSet } from "../../utility/electronStore";
import { encryptPrompts } from "../../utility/encryption";
import { cleanFileTitle } from "../../utility/string";
//
import {
  Grid,
  Typography,
  Button,
  Chip,
  Stack,
} from "@mui/material";
// ----------------------------------------------------------------------

const SystemPrompts = () => {
  const system_prompts = useStore(state => state.system_prompts)

  const goSystemPromptPage = (index) => {
    console.log("NAVIGATION: system_prompt", system_prompts[index].title)
    useStore.setState({ page: "system_prompt", system_prompt_to_edit: index })
  }

  const ImportPrompt = () => {
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

  const ExportPrompt = (index) => {
    const exporter = async (index) => {
      const dir = await window.electron.engine.dialog_choose_directory();
      if (!dir) {
        return;  // Cancelled directory choice, exit exporter function
      }
      const jsonstr = JSON.stringify(system_prompts[index]);
      const title = system_prompts[index].title;
      const cleanTitle = cleanFileTitle(title);
      const args = {
        dir: dir,
        jsonstr: jsonstr,
        filename: cleanTitle
      };

      window.electron.engine.send('save-json', args);
    };

    exporter(index);
  };

  return (
    <BasicBox>
      <Stack spacing={1}>
        <Title value={"System Prompts"} />

        <OutlinePaper>
          <Grid
            spacing={1}
            container sx={{
              justifyContent: "left",
              alignItems: "left",
              textAlign: "left",
              verticalAlign: "center"
            }}
            direction={"row"}
          >
            <Grid item sm={12}>
              <Stack direction={"row"} spacing={1}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => { navigate("new_system_prompt") }}
                >
                  Create
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={ImportPrompt}
                >
                  Import
                </Button>
              </Stack>
            </Grid>

            {system_prompts.map((prompt, key) => {
              return (
                <Grid item sm={6} key={key}>
                  <OutlinePaper>
                    <Grid container>
                      <Grid item sm={12}>
                        <Typography variant="h4">
                          {prompt.title}
                        </Typography>
                      </Grid>

                      <Grid item sm={12}>
                        <Typography variant="body1">
                          {previewText(prompt.prompt, 150)}
                        </Typography>
                      </Grid>

                      <Grid item sm={12}>
                        <Chip label={prompt.model} sx={{ marginBottom: 1 }} />
                        <Chip label={prompt.engine} variant="outlined" sx={{ marginBottom: 1, marginLeft: 1 }} />
                      </Grid>

                      {key > 1 && <Grid item sm={4}>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => { goSystemPromptPage(key) }}
                        >
                          Edit
                        </Button>
                      </Grid>}
                      {key > 1 && <Grid item sm={4}>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => { deleteSystemPrompt(key) }}
                        >
                          Delete
                        </Button>
                      </Grid>}

                      {key > 1 && <Grid item sm={4}>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => { ExportPrompt(key) }}
                        >
                          Export
                        </Button>
                      </Grid>}
                    </Grid>
                  </OutlinePaper>
                </Grid>
              )
            })}
          </Grid>
        </OutlinePaper>
      </Stack>
    </BasicBox>
  );
};

export default SystemPrompts;