import React, { useState, useEffect } from "react";
import { Menu, FormControl, TextField, Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import MenuItem from '@mui/material/MenuItem';
import { BasicBox, OutlinePaper } from "../../mui/reusable";
import { useStore } from "../../zustand";
import { encryptPrompts } from "../../utility/encryption";
import Stack from "@mui/material/Stack";

// ----------------------------------------------------------------------

const NewSystemPrompt = () => {
  const [titleInput, setTitleInput] = useState("")

  const [promptInput, setPromptInput] = useState("")

  const [userInput, setUserInput] = useState("")

  const [model, setModel] = useState("gpt-3.5-turbo")

  const [engine, setEngine] = useState("token limited");

  const [ready, setReady] = useState(false);

  const [limit, setLimit] = useState(4096);

  const [modelAnchor, setModelAnchor] = React.useState(null);
  const modelOpen = Boolean(modelAnchor);

  const [engineAnchor, setEngineAnchor] = React.useState(null);
  const engineOpen = Boolean(engineAnchor);

  const handleTitleInput = (event) => {
    setTitleInput(event.target.value);
  };

  const handlePromptInput = (event) => {
    setPromptInput(event.target.value);
  };

  const handleUserInput = (event) => {
    setUserInput(event.target.value);
  };

  const handleModel = (event) => {
    setModelAnchor(event.currentTarget);
  };

  const handleChooseModel = (event) => {
    setModelAnchor(null);
    setModel(event.target.textContent)
  };

  const handleCloseModel = () => {
    setModelAnchor(null);
  };

  const handleEngine = (event) => {
    setEngineAnchor(event.currentTarget);
  };

  const handleChooseEngine = (event) => {
    setEngineAnchor(null);
    setEngine(event.target.textContent)
    if (event.target.textContent === "token limited") {
      switch (model) {
        case "gpt-3.5-turbo":
          setLimit(4096)
          break;
        case "gpt-4":
          setLimit(8192)
          break;
        case "gpt-4-32k":
          setLimit(32768)
          break;
        default:
          setLimit(4096)
          break;
      }
    } else {
      setLimit(0)
    }
  };

  const handleCloseEngine = () => {
    setEngineAnchor(null);
  };

  const cancel = () => {
    console.log("NAVIGATION: system_prompts")
    useStore.setState({ page: "system_prompts" })
  };

  const addPrompt = () => {
    const system_prompts_ = useStore.getState().system_prompts
    system_prompts_.push({
      title: titleInput,
      prompt: promptInput,
      params: {},
      userInputLabel: userInput,
      model: model,
      engine: engine,
      limit: limit
    });

    const password_ = useStore.getState().password;

    const encPrompts = encryptPrompts(system_prompts_, password_);
    window.electron.store.set("system_prompts", encPrompts);

    useStore.setState({ page: "system_prompts" })

    useStore.setState({
      system_prompts: system_prompts_,
      page: "system_prompts"
    })
  };

  useEffect(() => {
    if (
      titleInput !== "" &&
      promptInput !== "" &&
      userInput !== "" &&
      model !== "" &&
      model !== "NONE" &&
      engine !== "" &&
      engine !== "NONE"
    ) {
      setReady(true)
    } else {
      setReady(false)
    };
  }, [titleInput, promptInput, userInput, model]);

  return (
    <BasicBox>
      <Grid
        spacing={1}
        container
        sx={{
          justifyContent: "left",
          alignItems: "left",
          textAlign: "left",
          verticalAlign: "center",
        }}
        direction={"row"}
      >
        <Grid item sm={12}>
          <OutlinePaper>
            <Typography variant="h2">
              New System Prompt
            </Typography>
          </OutlinePaper>
        </Grid>

        <Grid item sm={12}>
          <OutlinePaper>
            <Grid
              spacing={1}
              container
              sx={{
                justifyContent: "left",
                alignItems: "left",
                textAlign: "left",
                verticalAlign: "center",
              }}
              direction={"row"}
            >
              <Grid item sm={6}>
                <Stack direction="row" spacing={1}>
                  <Typography variant="h4" sx={{ marginTop: 1 }}>
                    Title:
                  </Typography>
                  <FormControl>
                    <TextField
                      id="title-input"
                      label=""
                      variant="filled"
                      color="secondary"
                      value={titleInput}
                      onChange={handleTitleInput}
                      required={true}
                      focused
                      autoFocus
                    />
                  </FormControl>
                </Stack>
              </Grid>
              <Grid item sm={6}>
                <Stack direction="row" spacing={1}>
                  <Typography variant="h4" sx={{ marginTop: 1 }}>
                    User Input Label:
                  </Typography>

                  <FormControl>
                    <TextField
                      id="user-input"
                      label=""
                      variant="filled"
                      color="secondary"
                      value={userInput}
                      onChange={handleUserInput}
                      required={true}
                    />
                  </FormControl>
                </Stack>
              </Grid>
            </Grid>
          </OutlinePaper>
        </Grid>

        <Grid item sm={12}>
          <OutlinePaper>
            <Stack direction="column" spacing={1}>
              <Typography variant="h4">
                Prompt:
              </Typography>

              <FormControl fullWidth>
                <TextField
                  id="prompt-input"
                  label=""
                  variant="filled"
                  color="secondary"
                  value={promptInput}
                  onChange={handlePromptInput}
                  required={true}
                  fullWidth
                  multiline
                  minRows={4}
                />
              </FormControl>
            </Stack>
          </OutlinePaper>
        </Grid>

        <Grid item sm={12}>
          <OutlinePaper>
            <Grid
              spacing={1}
              container
              sx={{
                justifyContent: "left",
                alignItems: "left",
                textAlign: "left",
                verticalAlign: "center",
              }}
              direction={"row"}
            >
              <Grid item sm={6}>
                <Stack direction="row" spacing={1}>
                  <Typography variant="h6">
                    Model: {model}
                  </Typography>

                  <Button
                    id="basic-button"
                    aria-controls={modelOpen ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={modelOpen ? 'true' : undefined}
                    onClick={handleModel}
                    variant="outlined"
                    color="secondary"
                  >
                    Choose Model
                  </Button>
                  <Menu
                    id="basic-menu"
                    anchorEl={modelAnchor}
                    open={modelOpen}
                    onClose={handleCloseModel}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                  >
                    <MenuItem value={"gpt-3.5-turbo"} onClick={handleChooseModel}>gpt-3.5-turbo</MenuItem>
                    <MenuItem value={"gpt-4"} onClick={handleChooseModel}>gpt-4</MenuItem>
                    <MenuItem value={"gpt-4-32k"} onClick={handleChooseModel}>gpt-4-32k</MenuItem>
                  </Menu>
                </Stack>
              </Grid>

              <Grid item sm={6}>
                <Stack direction="row" spacing={1}>
                  <Typography variant="h6">
                    Engine: {engine}
                  </Typography>

                  <Button
                    id="basic-button"
                    aria-controls={engineOpen ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={engineOpen ? 'true' : undefined}
                    onClick={handleEngine}
                    variant="outlined"
                    color="secondary"
                  >
                    Choose Engine
                  </Button>
                  <Menu
                    id="basic-menu"
                    anchorEl={engineAnchor}
                    open={engineOpen}
                    onClose={handleCloseEngine}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                  >
                    <MenuItem value={"token limited"} onClick={handleChooseEngine}>token limited</MenuItem>
                    <MenuItem value={"amnesia"} onClick={handleChooseEngine}>amnesia</MenuItem>
                  </Menu>
                </Stack>
              </Grid>
            </Grid>
          </OutlinePaper>
        </Grid>

        <Grid item sm={12}>
          <OutlinePaper>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                disabled={!ready}
                onClick={addPrompt}
                color="secondary"
              >
                Save Prompt
              </Button>

              <Button
                variant="outlined"
                onClick={cancel}
                color="secondary"
              >
                Cancel
              </Button>
            </Stack>
          </OutlinePaper>
        </Grid>
      </Grid>
    </BasicBox>
  );
};

export default NewSystemPrompt;