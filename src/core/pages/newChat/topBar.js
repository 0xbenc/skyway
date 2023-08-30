import React from "react";
//
import { useStore } from "../../zustand";
//
// import { navigate } from "../../utility/navigatePage";
//
import {
  IconButton,
  Typography,
  Box,
  Stack,
} from "@mui/material";

import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Divider from "@mui/material/Divider";
//
import KeyIcon from '@mui/icons-material/Key';
import HttpsIcon from '@mui/icons-material/Https';
import ChatIcon from '@mui/icons-material/Chat';
import RateReviewIcon from '@mui/icons-material/RateReview';
//
import { Top } from "./newChat_styles";
import { OutlinePaper } from "../../mui/reusable";

const TopBar = () => {
  const active_system_prompt_ = useStore.getState().active_system_prompt;
  const open_ai_api_keys_ = useStore.getState().open_ai_api_keys;
  const open_ai_api_key_ = useStore.getState().open_ai_api_key;

  const chats = useStore(state => state.chats);

  const token_count = useStore(state => state.token_count);

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <ChatIcon />
            </ListItemIcon>
            <ListItemText primary={"Switch Prompt"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <RateReviewIcon />
            </ListItemIcon>
            <ListItemText primary={"Prompt Editor"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <KeyIcon />
            </ListItemIcon>
            <ListItemText primary={"Switch API Key"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <HttpsIcon />
            </ListItemIcon>
            <ListItemText primary={"Edit API Keys"} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        {chats.map((text, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton>
              <ListItemText primary={text.title} secondary={text.prompt.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Top>
      <OutlinePaper>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1} alignItems="center">
            <Box>
              <IconButton
                aria-label="close"
                onClick={toggleDrawer('left', true)}
                size="large"
              >
                <MenuIcon fontSize="inheret" />
              </IconButton>
            </Box>
            <OutlinePaper>
              <Stack direction="column" spacing={1}>
                <Typography variant="body1">
                  System Prompt
                </Typography>
                <Typography variant="body1">
                  <b>{active_system_prompt_.title}</b>
                </Typography>
              </Stack>
            </OutlinePaper>
            <OutlinePaper>
              <Stack direction="column" spacing={1}>
                <Typography variant="body1">
                  Model
                </Typography>
                <Typography variant="body1">
                  <b>{active_system_prompt_.model}</b>
                </Typography>
              </Stack>
            </OutlinePaper>
            <OutlinePaper>
              <Stack direction="column" spacing={1}>
                <Typography variant="body1">
                  Engine
                </Typography>
                <Typography variant="body1">
                  <b>{active_system_prompt_.engine}</b>
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
              {active_system_prompt_.engine === "token limited" && <Typography variant="body1">
                Total Tokens
              </Typography>}
              {active_system_prompt_.engine === "token limited" && <Typography variant="body1">
                <b>{token_count}/{active_system_prompt_.limit}</b>
              </Typography>}
              {active_system_prompt_.engine === "amnesia" && <Typography variant="body1">
                Previous Tokens
              </Typography>}
              {active_system_prompt_.engine === "amnesia" && <Typography variant="body1">
                <b>{token_count}</b>
              </Typography>}
            </Stack>
          </OutlinePaper>
        </Stack>
      </OutlinePaper>
      <Drawer
        anchor={'left'}
        open={state['left']}
        onClose={toggleDrawer('left', false)}
      >
        {list('left')}
      </Drawer>
    </Top>
  );
};

export default TopBar;
