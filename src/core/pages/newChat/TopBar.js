import React from "react";
//
import { useStore } from "../../zustand";
//
import { navigate } from "../../utility/navigatePage";
//
import {
  IconButton,
  Typography,
  Box,
  Stack,
} from "@mui/material";
//
import HomeIcon from "@mui/icons-material/Home"
//
import { Top } from "./newChat_styles";
import { OutlinePaper } from "../../mui/reusable";

const TopBar = () => {
  const active_system_prompt_ = useStore.getState().active_system_prompt;
  const open_ai_api_keys_ = useStore.getState().open_ai_api_keys;
  const open_ai_api_key_ = useStore.getState().open_ai_api_key;

  const token_count = useStore(state => state.token_count);

  return (
    <Top>
      <OutlinePaper>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1} alignItems="center">
            <Box>
              <IconButton
                aria-label="close"
                onClick={() => { navigate("landing") }}
              >
                <HomeIcon />
              </IconButton>
            </Box>
            <Typography variant="h4">
              New Chat
            </Typography>
            <OutlinePaper>
              <Typography variant="h4">
                {active_system_prompt_.title}
              </Typography>
            </OutlinePaper>
            <OutlinePaper>
              <Stack direction="column" spacing={1}>
                <Typography variant="body1">
                  {active_system_prompt_.model}
                </Typography>
                <Typography variant="body1">
                  {active_system_prompt_.engine}
                </Typography>
              </Stack>
            </OutlinePaper>
            <OutlinePaper>
              <Stack direction="column" spacing={1}>
                <Typography variant="body1">
                  API Key:
                </Typography>
                <Typography variant="body1">
                  {open_ai_api_keys_[open_ai_api_key_]?.name}
                </Typography>
              </Stack>
            </OutlinePaper>
          </Stack>
          <OutlinePaper>
            <Stack direction="column" spacing={1}>
              {active_system_prompt_.engine === "token limited" && <Typography variant="body1">
                Total Tokens:
              </Typography>}
              {active_system_prompt_.engine === "token limited" && <Typography variant="body1">
                {token_count}/{active_system_prompt_.limit}
              </Typography>}
              {active_system_prompt_.engine === "amnesia" && <Typography variant="body1">
                Previous Tokens:
              </Typography>}
              {active_system_prompt_.engine === "amnesia" && <Typography variant="body1">
                {token_count}
              </Typography>}
            </Stack>
          </OutlinePaper>
        </Stack>
      </OutlinePaper>
    </Top>
  );
};

export default TopBar;
