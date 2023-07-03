import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import { useStore } from "../../zustand";
import { previewText } from "../../utility/string";
import { BasicBox, OutlinePaper } from "../../mui/reusable";
import { deleteSystemPrompt } from "./systemPrompts_utility";
import { navigate } from "../../utility/navigatePage";

// ----------------------------------------------------------------------

const SystemPrompts = () => {
  const system_prompts = useStore(state => state.system_prompts)

  const goSystemPromptPage = (index) => {
    console.log("NAVIGATION: system_prompt", system_prompts[index].title)
    useStore.setState({ page: "system_prompt", system_prompt_to_edit: index })
  }


  return (
    <BasicBox>
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
          <OutlinePaper>
            <Typography variant="h2">
              System Prompts
            </Typography>
          </OutlinePaper>
        </Grid>

        <Grid item sm={12}>
          <OutlinePaper>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {navigate("landing")}}
              >
                Landing Page
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {navigate("new_system_prompt")}}
              >
                Create Prompt
              </Button>
            </Stack>
          </OutlinePaper>
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

                  {key > 1 && <Grid item sm={6}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => { goSystemPromptPage(key) }}
                    >
                      Edit
                    </Button>
                  </Grid>}
                  {key > 1 && <Grid item sm={6}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => { deleteSystemPrompt(key) }}
                    >
                      Delete
                    </Button>
                  </Grid>}
                </Grid>
              </OutlinePaper>
            </Grid>
          )
        })}
      </Grid>
    </BasicBox>
  );
};

export default SystemPrompts;