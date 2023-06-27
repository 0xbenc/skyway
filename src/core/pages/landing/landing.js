import React from "react";
import Typography from "@mui/material/Typography";
import { useStore } from "../../zustand";
import { MenuItem, Button, Menu } from "@mui/material";
import { BackPaper, OutPaper } from "../../mui/reusable";
import Stack from "@mui/material/Stack";
import { switchColor } from "./landing_utility";
import { navigate } from "../../utility/navigatePage";

// ----------------------------------------------------------------------

const Landing = () => {
  const system_prompts = useStore.getState().system_prompts;
  const version_ = useStore.getState().version;
  const devMode_ = useStore.getState().devMode

  const [newChatAnchor, setNewChatAnchor] = React.useState(null);
  const open = Boolean(newChatAnchor);

  const newChatClick = (event) => {
    setNewChatAnchor(event.currentTarget);
  };

  const newChatSelect = (event) => {
    setNewChatAnchor(null);
    console.log("NAVIGATION: new_chat", system_prompts[event.target.value].title);
    useStore.setState({ active_system_prompt: system_prompts[event.target.value], page: "new_chat" });
  };

  const newChatClose = () => {
    setNewChatAnchor(null);
  };

  const apiKey = () => {
    navigate("change_api_key")
  };

  return (
    <BackPaper>
      <Stack direction="column" spacing={1}>
        <OutPaper>
          <Typography variant="h1">
            Skyway
          </Typography>
          <Typography variant="body1">
            v{version_} {devMode_ ? "dev" : ""}
          </Typography>
        </OutPaper>

        <OutPaper>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={switchColor}
            >
              Toggle Color Theme
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
              onClick={() => { navigate("system_prompts") }}
            >
              Prompt Editor
            </Button>

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
        </OutPaper>
      </Stack>
    </BackPaper>
  );
};

export default Landing;