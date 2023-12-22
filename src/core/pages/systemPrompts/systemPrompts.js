import React from "react";
//
import { useStore } from "../../zustand";
//
import { previewText } from "../../utility/string";
import { navigate } from "../../utility/navigatePage";
import { BasicBox, OutlinePaper } from "../../mui/reusable";
import { ExportPrompt, deleteSystemPrompt, ImportPrompt } from "./utility";
import { Title } from "../../components/title";
//
import {
  Grid,
  Typography,
  Button,
  Chip,
  Stack,
  Tooltip,
  IconButton
} from "@mui/material";
//
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IosShareIcon from '@mui/icons-material/IosShare';
// ----------------------------------------------------------------------

const SystemPrompts = () => {
  const system_prompts = useStore(state => state.system_prompts)

  const goSystemPromptPage = (index) => {
    console.log("NAVIGATION: system_prompt", system_prompts[index].title)
    useStore.setState({ page: "system_prompt", system_prompt_to_edit: index })
  }

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
                  <b>Create</b>
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={ImportPrompt}
                >
                  <b>Import</b>
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
                        <Tooltip title={prompt.prompt}>
                          <Typography variant="body1">
                            {previewText(prompt.prompt, 150)}
                          </Typography>
                        </Tooltip>
                      </Grid>

                      <Grid item sm={12}>
                        <Chip label={prompt.model} sx={{ marginBottom: 1 }} />
                        <Chip label={prompt.engine} variant="outlined" sx={{ marginBottom: 1, marginLeft: 1 }} />
                      </Grid>

                      {key > 1 && <Grid item sm={12}>
                        <Stack direction="row">
                          <Tooltip title="Edit System Prompt">
                            <IconButton onClick={() => { goSystemPromptPage(key) }}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Export System Prompt">
                            <IconButton onClick={() => { ExportPrompt(key) }}>
                              <IosShareIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete System Prompt">
                            <IconButton onClick={() => { deleteSystemPrompt(key) }}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
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

export { SystemPrompts };
