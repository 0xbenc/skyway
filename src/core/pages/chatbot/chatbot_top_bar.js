import React, { useEffect } from "react";
//
import { useStore } from "../../zustand";
//
import { Top } from "./chatbot_styles";
import { OutlinePaper } from "../../mui/reusable";
//
import {
  IconButton,
  Typography,
  Box,
  Stack,
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { Tooltip } from "@mui/material";
//
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import { encryptPrompts } from "../../utility/encryption";
import { eSet } from "../../utility/electronStore";
// ----------------------------------------------------------------------

const TopBar = () => {
  const token_count = useStore(state => state.token_count);
  const prompt_save_status = useStore(state => state.prompt_save_status);
  const busy_ui = useStore(state => state.busy_ui);
  const active_system_prompt = useStore(state => state.active_system_prompt);

  const open_ai_api_keys_ = useStore.getState().open_ai_api_keys;
  const open_ai_api_key_ = useStore.getState().open_ai_api_key;
  const system_prompts_ = useStore.getState().system_prompts;

  const toggleChatDrawer = (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;

    useStore.getState().chat_drawer_toggle();
  };

  useEffect(() => {
    if (busy_ui) {
      useStore.setState({ chat_drawer_open: false })
    };
  }, [busy_ui])

  return (
    <Top>
      <OutlinePaper>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1} alignItems="center">
            <Box>
              <IconButton
                aria-label="close"
                onClick={toggleChatDrawer}
                size="large"
                disabled={busy_ui}
              >
                <MenuIcon fontSize="inheret" />
              </IconButton>
            </Box>
            <OutlinePaper>
              <Stack direction="column" spacing={1}>
                <Typography variant="body1">
                  System Prompt
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Typography variant="body1">
                    <b>{active_system_prompt.title}</b>
                  </Typography>
                  {prompt_save_status && <Tooltip title={"Prompt is in your library"}>
                    <BookmarkAddedIcon size="small" />
                  </Tooltip>}
                  {!prompt_save_status && <Tooltip title={"Click to add prompt to your library"}>
                    <span>
                      <BookmarkAddIcon
                        size="small"
                        onClick={() => {
                          const importedDate = new Date();
                          const importedDateISO = String(importedDate.toISOString());

                          let newPrompts = [...system_prompts_];

                          let potentialPrompt = useStore.getState().active_system_prompt;

                          potentialPrompt.importedDate = importedDateISO;

                          newPrompts.push(potentialPrompt);

                          const password_ = useStore.getState().password;
                          const encPrompts = encryptPrompts(newPrompts, password_);

                          eSet("system_prompts", encPrompts);

                          useStore.getState().addNotification("System Prompt added to Library");
                          useStore.setState({ system_prompts: newPrompts, prompt_save_status: true });
                        }} //
                        disabled={busy_ui}
                      />
                    </span>
                  </Tooltip>}
                </Stack>
              </Stack>
            </OutlinePaper>
            <OutlinePaper>
              <Stack direction="column" spacing={1}>
                <Typography variant="body1">
                  Model
                </Typography>
                <Typography variant="body1">
                  <b>{active_system_prompt.model}</b>
                </Typography>
              </Stack>
            </OutlinePaper>
            <OutlinePaper>
              <Stack direction="column" spacing={1}>
                <Typography variant="body1">
                  Engine
                </Typography>
                <Typography variant="body1">
                  <b>{active_system_prompt.engine}</b>
                </Typography>
              </Stack>
            </OutlinePaper>
            <OutlinePaper>
              <Stack direction="column" spacing={1}>
                <Typography variant="body1">
                  API Key
                </Typography>
                <Typography variant="body1">
                  <b>{open_ai_api_keys_[open_ai_api_key_]?.name}</b>
                </Typography>
              </Stack>
            </OutlinePaper>
          </Stack>
          <OutlinePaper>
            <Stack direction="column" spacing={1} textAlign={"right"}>
              {active_system_prompt.engine === "token limited" && <Typography variant="body1">
                Total Tokens
              </Typography>}
              {active_system_prompt.engine === "token limited" && <Typography variant="body1">
                <b>{String(token_count)}/{active_system_prompt.limit}</b>
              </Typography>}
              {active_system_prompt.engine === "amnesia" && <Typography variant="body1">
                Previous Tokens
              </Typography>}
              {active_system_prompt.engine === "amnesia" && <Typography variant="body1">
                <b>{token_count}</b>
              </Typography>}
            </Stack>
          </OutlinePaper>
        </Stack>
      </OutlinePaper>
    </Top>
  );
};

export default TopBar;
