import React, { useEffect } from "react";
//
import { useStore } from "../../zustand";
//
import { navigate } from "../../utility/navigatePage";
import { Top } from "./chatbot_styles";
import { OutlinePaper } from "../../mui/reusable";
import { chatDelete, chatSelect } from "./chatbot_utility";
import { isoToHuman } from "../../utility/time";
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
import { MenuItem, Menu, Tooltip, Grid } from "@mui/material";
//
import HttpsIcon from '@mui/icons-material/Https';
import ChatIcon from '@mui/icons-material/Chat';
import RateReviewIcon from '@mui/icons-material/RateReview';
import SaveIcon from '@mui/icons-material/Save';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
// ----------------------------------------------------------------------

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
  const busy_ui = useStore(state => state.busy_ui);

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleChatDrawer = (tf) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;

    setDrawerOpen(tf);
  };

  const navAPIKey = () => {
    navigate("change api key")
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
        width: "25vw",
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
            <ListItemText primary={"Change Prompt"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={navSystemPrompts}>
            <ListItemIcon>
              <RateReviewIcon />
            </ListItemIcon>
            <ListItemText primary={"Prompt Library"} />
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
        <List sx={{ overflowX: "hidden" }}>
          {chats.slice().reverse().map((chat, index) => (
            <ListItem key={index} disablePadding sx={(theme) => ({ backgroundColor: chat.uuid === current_chat ? theme.palette.primary.outside : theme.palette.primary.inside })}>
              <Box sx={{ width: "100%" }} marginRight={1.5}>
                <Grid container>
                  <Grid item xs={10}>
                    <ListItemButton disabled={chat.uuid === current_chat ? true : false} onClick={() => { useStore.setState({ current_chat: chat.uuid, active_system_prompt: chat.prompt, chat_open: true }) }}>
                      <ListItemText primary={chat.title} secondary={`${isoToHuman(chat.lastActive)} | ${chat.prompt.title}`} />
                    </ListItemButton>
                  </Grid>
                  <Grid item xs={1} container alignItems="center">
                    <Tooltip title="Rename Chat">
                      <IconButton>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={1} container alignItems="center">
                    <Tooltip title="Delete Chat">
                      <span>
                        <IconButton disabled={chat.uuid === current_chat ? true : false} onClick={(event) => {event.stopPropagation(); chatDelete(chat.uuid)}}>
                          <DeleteIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Grid>
                </Grid>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );

  useEffect(() => {
    if (busy_ui) {
      setDrawerOpen(false);
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
                onClick={toggleChatDrawer(true)}
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
                    <b>{active_system_prompt_.title}</b>
                  </Typography>
                  {prompt_save_status && <Tooltip title={"Prompt is in your library"}>
                    <SaveIcon size="small" />
                  </Tooltip>}
                  {!prompt_save_status && <Tooltip title={"Click to add prompt to your library"}>
                    <span>
                      <LibraryAddIcon
                        size="small"
                        onClick={() => { useStore.setState({ prompt_save_status: true }) }}
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
