import React from "react";
//
import { useStore } from "../../zustand";
//
import { navigate } from "../../utility/navigatePage";
//
import { MenuItem, Button, Menu, Typography, Stack } from "@mui/material";
//
import { BasicBox, OutlinePaper } from "../../mui/reusable";
import { switchColor } from "../../utility/switchColor";
import { eSet } from "../../utility/electronStore";
import { encryptPrompts } from "../../utility/encryption";

// ----------------------------------------------------------------------

const Landing = () => {
  const system_prompts = useStore(state => state.system_prompts);
  const version_ = useStore.getState().version;
  const devMode_ = useStore.getState().devMode

  const [newChatAnchor, setNewChatAnchor] = React.useState(null);
  const open = Boolean(newChatAnchor);

  const newChatClick = (event) => {
    setNewChatAnchor(event.currentTarget);
  };

  const newChatSelect = (event) => {
    setNewChatAnchor(null);
    const usedDate = new Date();
    const usedDateISO = String(usedDate.toISOString());

    let systems = [...system_prompts];
    systems[event.target.value].usedDate = usedDateISO;

    const password_ = useStore.getState().password;

    const encPrompts = encryptPrompts(systems, password_);

    console.log("NAVIGATION: new_chat", system_prompts[event.target.value].title, event.target.value);

    eSet('system_prompts', encPrompts);
    eSet('last_prompt', event.target.value);

    useStore.setState({ system_prompts: systems });
    useStore.setState({ active_system_prompt: system_prompts[event.target.value], page: "new_chat", last_prompt: event.target.value });
  };

  const newChatClose = () => {
    setNewChatAnchor(null);
  };

  const apiKey = () => {
    navigate("change_api_key")
  };

  return (
    <BasicBox>
      <Stack direction="column" spacing={1}>
        <OutlinePaper>
          <Typography variant="h1">
            Skyway
          </Typography>
          <Typography variant="body1">
            v{version_} {devMode_ ? "pre-release" : ""}
          </Typography>
        </OutlinePaper>

        <OutlinePaper>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">

            <Button
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={newChatClick}
              variant="outlined"
              color="secondary"
              disabled={!system_prompts.length}
            >
              New Chat
            </Button>

            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => { navigate("system_prompts") }}
              >
                Prompt Editor
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                onClick={apiKey}
              >
                Change API Key
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                onClick={switchColor}
              >
                Toggle Color Theme
              </Button>

              <Menu
                id="basic-menu"
                anchorEl={newChatAnchor}
                open={open}
                onClose={newChatClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                {system_prompts.map((prompt, key) => {
                  return (
                    <MenuItem key={key} value={key} onClick={newChatSelect}>{prompt.title}</MenuItem>
                  )
                })}
              </Menu>
            </Stack>
          </Stack>
        </OutlinePaper>
      </Stack>
    </BasicBox>
  );
};

export default Landing;