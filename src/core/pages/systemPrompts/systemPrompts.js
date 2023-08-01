import React from "react";
//
import { useStore } from "../../zustand";
//
import { previewText } from "../../utility/string";
import { navigate } from "../../utility/navigatePage";
//
import {
  Grid,
  Typography,
  Button,
  Chip,
  Stack,
} from "@mui/material";
//
import { BasicBox, OutlinePaper } from "../../mui/reusable";
import { deleteSystemPrompt } from "./systemPrompts_utility";
import Title from "../../components/title";
// ----------------------------------------------------------------------

const cleanString = (str) => {
  let cleanedStr = str
    .trim()
    .replace(/\s/g, '_')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_');

  if (cleanedStr.endsWith('_')) {
    cleanedStr = cleanedStr.slice(0, -1);
  };

  return cleanedStr;
};

const SystemPrompts = () => {
  const system_prompts = useStore(state => state.system_prompts)

  const goSystemPromptPage = (index) => {
    console.log("NAVIGATION: system_prompt", system_prompts[index].title)
    useStore.setState({ page: "system_prompt", system_prompt_to_edit: index })
  }

  const ExportPrompt = (index) => {
    const exporter = async (index) => {
      const dir = await window.electron.engine.dialog_choose_directory();
      const jsonstr = JSON.stringify(system_prompts[index]);
      const title = system_prompts[index].title;
      const cleanTitle = cleanString(title);
      const args = {
        dir: dir,
        jsonstr: jsonstr,
        filename: cleanTitle
      };

      window.electron.engine.send('save-json', args);

      return dir;
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
                  Create Prompt
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