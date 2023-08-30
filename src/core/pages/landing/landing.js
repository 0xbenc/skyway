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
import newChatSelect from "./landing_utility";

// ----------------------------------------------------------------------

const Landing = () => {
  const system_prompts_ = useStore.getState().system_prompts;
  const version_ = useStore.getState().version;
  const devMode_ = useStore.getState().devMode

  // Anchor for New Chat select
  const [anc, setAnc] = React.useState(null);
  const open = Boolean(anc);

  const newChatClick = (event) => {
    setAnc(event.currentTarget);
  };

  const newChatClose = () => {
    setAnc(null);
  };

  const newChatOpen = (e) => {
    newChatSelect(e, setAnc, system_prompts_)
  }

  const apiKey = () => {
    navigate("change_api_key")
  };

  const systemPrompts = () => {
    navigate("system_prompts")
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
              disabled={!system_prompts_.length}
            >
              New Chat
            </Button>

            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={systemPrompts}
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
                anchorEl={anc}
                open={open}
                onClose={newChatClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                {system_prompts_.map((prompt, key) => {
                  return (
                    <MenuItem
                      key={key}
                      value={key}
                      onClick={newChatOpen}
                    >
                      {prompt.title}
                    </MenuItem>
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