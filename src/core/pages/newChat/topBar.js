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

import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Divider from "@mui/material/Divider";
import { MenuItem, Menu, Tooltip } from "@mui/material";
//
import HttpsIcon from '@mui/icons-material/Https';
import ChatIcon from '@mui/icons-material/Chat';
import RateReviewIcon from '@mui/icons-material/RateReview';
import SaveIcon from '@mui/icons-material/Save';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
//
import { Top } from "./newChat_styles";
import { OutlinePaper } from "../../mui/reusable";
import chatSelect from "./chatSelect";

const TopBar = () => {
  const active_system_prompt_ = useStore.getState().active_system_prompt;
  const open_ai_api_keys_ = useStore.getState().open_ai_api_keys;
  const open_ai_api_key_ = useStore.getState().open_ai_api_key;
  const system_prompts_ = useStore.getState().system_prompts;
  const version_ = useStore.getState().version;
  const dev_mode_ = useStore.getState().dev_mode;

  const chats = useStore(state => state.chats);
  const token_count = useStore(state => state.token_count);
  const current_chat = useStore(state => state.current_chat);
  const prompt_save_status = useStore(state => state.prompt_save_status);

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleChatDrawer = (tf) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;

    setDrawerOpen(tf);
  };

  const navAPIKey = () => {
    navigate("change_api_key")
  };

  const navSystemPrompts = () => {
    navigate("system_prompts")
  };

  const newChat = () => {
    useStore.setState({ chat_reset: true })
  }

  // Anchor for New Chat select
  const [anc, setAnc] = React.useState(null);
  const chatSelectMenuOpen = Boolean(anc);

  const switchPromptOpen = (event) => {
    event.stopPropagation();
    setAnc(event.currentTarget);
  };

  const switchPromptClose = () => {
    setAnc(null);
  };

  const switchPromptSelect = (e) => {
    chatSelect(e, setAnc, system_prompts_, setDrawerOpen)
  };

  const DrawerContents = () => (
    <Box
      sx={{
        width: 250,
        display: 'flex', // Added: Using Flex container
        flexDirection: 'column', // Added: Flex direction set to column
        overflow: "hidden"
      }}
      role="presentation"
      onClick={toggleChatDrawer(false)}
      onKeyDown={toggleChatDrawer(false)}
    >
      <List>
        <ListItem>
          <ListItemText primary={`Skyway v${version_} ${dev_mode_ ? "pre-release" : ""}`} />
        </ListItem>
        <Divider />
        <ListItem disablePadding>
          <ListItemButton onClick={newChat}>
            <ListItemIcon>
              <ChatIcon />
            </ListItemIcon>
            <ListItemText primary={"New Chat"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={switchPromptOpen}>
            <ListItemIcon>
              <SwapHorizIcon />
            </ListItemIcon>
            <ListItemText primary={"Switch Prompt"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={navSystemPrompts}>
            <ListItemIcon>
              <RateReviewIcon />
            </ListItemIcon>
            <ListItemText primary={"Prompt Editor"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={navAPIKey}>
            <ListItemIcon>
              <HttpsIcon />
            </ListItemIcon>
            <ListItemText primary={"Edit API Keys"} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'auto'
        }}
      >
        <List>
          {chats.slice().reverse().map((text, index) => (
            <ListItem key={index} disablePadding sx={(theme) => ({ backgroundColor: text.uuid === current_chat ? theme.palette.primary.outside : theme.palette.primary.inside })}>
              <ListItemButton disabled={text.uuid === current_chat ? true : false} onClick={() => { useStore.setState({ current_chat: text.uuid, active_system_prompt: text.prompt, chat_open: true }) }}>
                <ListItemText primary={text.title} secondary={text.prompt.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
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
                onClick={toggleChatDrawer(true)}
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
                <Stack direction="row" spacing={1}>
                  <Typography variant="body1">
                    <b>{active_system_prompt_.title}</b>
                  </Typography>
                  {prompt_save_status && <Tooltip title={"Prompt is in your library"}>
                    <SaveIcon size="small" />
                  </Tooltip>}
                  {!prompt_save_status && <Tooltip title={"Click to add prompt to your library"}>
                    <LibraryAddIcon size="small" onClick={() => { useStore.setState({ prompt_save_status: true }) }} />
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
                <b>{String(token_count)}/{active_system_prompt_.limit}</b>
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
        open={drawerOpen}
        onClose={toggleChatDrawer(false)}
      >
        <DrawerContents />
      </Drawer>
      <Menu
        id="basic-menu"
        anchorEl={anc}
        open={chatSelectMenuOpen}
        onClose={switchPromptClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {system_prompts_.map((prompt, key) => {
          return (
            <MenuItem
              key={prompt.uuid}
              value={key}
              onClick={switchPromptSelect}
            >
              {prompt.title}
            </MenuItem>
          )
        })}
      </Menu>
    </Top>
  );
};

export default TopBar;
