import React, { useEffect } from "react";
//
import { useStore } from "../../zustand";
//
import { navigate } from "../../utility/navigatePage";
import { Top } from "./chatbot_styles";
import { OutlinePaper } from "../../mui/reusable";
import { ImportChat, chatDelete, chatSelect } from "./chatbot_utility";
import { cleanFileTitle } from "../../utility/string";
import { isoToHuman } from "../../utility/time";
//
import {
  IconButton,
  Typography,
  Box,
  Stack,
  Button,
} from "@mui/material";
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Divider from "@mui/material/Divider";
import { Tooltip, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
//
import HttpsIcon from '@mui/icons-material/Https';
import ChatIcon from '@mui/icons-material/Chat';
import RateReviewIcon from '@mui/icons-material/RateReview';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IosShareIcon from '@mui/icons-material/IosShare';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import { encryptPrompts } from "../../utility/encryption";
import { eSet } from "../../utility/electronStore";
import RenameDialog from "./renameDialog";
// ----------------------------------------------------------------------

const TopBar = () => {
  const chats = useStore(state => state.chats);
  const token_count = useStore(state => state.token_count);
  const current_chat = useStore(state => state.current_chat);
  const prompt_save_status = useStore(state => state.prompt_save_status);
  const busy_ui = useStore(state => state.busy_ui);
  const chat_drawer_open = useStore(state => state.chat_drawer_open);
  const switch_prompt_dialog_open = useStore(state => state.switch_prompt_dialog_open);

  const active_system_prompt_ = useStore.getState().active_system_prompt;
  const open_ai_api_keys_ = useStore.getState().open_ai_api_keys;
  const open_ai_api_key_ = useStore.getState().open_ai_api_key;
  const system_prompts_ = useStore.getState().system_prompts;
  const version_ = useStore.getState().version;
  const dev_mode_ = useStore.getState().dev_mode;

  const handleRenameDialogOpen = (e, index) => {
    console.log(index, chats[chats.length - index - 1].title)

    e.stopPropagation();

    useStore.setState({
      rename_dialog_index: chats.length - index - 1,
      rename_dialog_input: chats[chats.length - index - 1].title,
      rename_dialog_open: true
    });
  };

  const toggleChatDrawer = (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;

    useStore.getState().chat_drawer_toggle();
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

  const switchPromptOpen = (event) => {
    event.stopPropagation();
    useStore.setState({ switch_prompt_dialog_open: true })
  };

  const switchPromptClose = () => {
    useStore.setState({ switch_prompt_dialog_open: false })
  };

  const ExportChat = (uuid) => {
    const exporter = async (uuid) => {
      const dir = await window.electron.engine.dialog_choose_directory();
      if (!dir) {
        return;  // Cancelled directory choice, exit exporter function
      }

      let indexMatch = -1;

      for (let i = 0; i < chats.length; i++) {
        if (uuid === chats[i].uuid) {
          indexMatch = i
        };
      };

      if (indexMatch > -1) {
        const chatCopy = [...chats];
        const jsonstr = JSON.stringify(chatCopy[indexMatch]);
        const title = chatCopy[indexMatch].title;
        const cleanTitle = cleanFileTitle(title);
        const args = {
          dir: dir,
          jsonstr: jsonstr,
          filename: cleanTitle
        };

        window.electron.engine.send('save-json', args);
      };
    };

    exporter(uuid);
  };

  const DrawerContents = () => (
    <Box
      sx={{
        width: "33vw",
        display: 'flex', // Added: Using Flex container
        flexDirection: 'column', // Added: Flex direction set to column
        overflow: "hidden"
      }}
      role="presentation"
      onClick={toggleChatDrawer}
      onKeyDown={toggleChatDrawer}
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
          <ListItemButton onClick={ImportChat}>
            <ListItemIcon>
              <FileOpenIcon />
            </ListItemIcon>
            <ListItemText primary={"Import Chat"} />
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
                  <Grid item xs={9}>
                    <ListItemButton disabled={chat.uuid === current_chat ? true : false} onClick={() => { useStore.setState({ current_chat: chat.uuid, active_system_prompt: chat.prompt, chat_open: true }) }}>
                      <ListItemText primary={chat.title} secondary={`${isoToHuman(chat.lastActive)} | ${chat.prompt.title}`} />
                    </ListItemButton>
                  </Grid>
                  <Grid item xs={1} container alignItems="center">
                    <Tooltip title="Rename Chat">
                      <IconButton onClick={(e) => { handleRenameDialogOpen(e, index) }}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={1} container alignItems="center">
                    <Tooltip title="Export Chat">
                      <IconButton onClick={() => { ExportChat(chat.uuid) }}>
                        <IosShareIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={1} container alignItems="center">
                    <Tooltip title="Delete Chat">
                      <span>
                        <IconButton disabled={chat.uuid === current_chat ? true : false} onClick={(event) => { event.stopPropagation(); chatDelete(chat.uuid) }}>
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
                    <b>{active_system_prompt_.title}</b>
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

                          let potentialPrompt = active_system_prompt_;

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
        open={chat_drawer_open}
        onClose={toggleChatDrawer}
      >
        <DrawerContents />
      </Drawer>

      <Dialog fullWidth onClose={switchPromptClose} open={switch_prompt_dialog_open}>
        <DialogTitle>Choose another prompt</DialogTitle>
        <DialogContent>
          <Stack direction="row" spacing={1}>
            {system_prompts_.map((prompt, key) => {
              return (
                <OutlinePaper key={key} onClick={() => { chatSelect(key, system_prompts_) }}>
                  <Typography variant="h6">{prompt.title}</Typography>
                  <Stack direction="row" spacing={1}>
                    <Typography variant="body2">{prompt.model} |</Typography>
                    <Typography variant="body2">{prompt.engine}</Typography>
                  </Stack>
                </OutlinePaper>
              )
            })}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            variant="text"
            color="secondary"
            onClick={switchPromptClose}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <RenameDialog />
    </Top>
  );
};

export default TopBar;
