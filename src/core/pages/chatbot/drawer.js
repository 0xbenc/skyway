import React from "react";
//
import { useStore } from "../../zustand";
//
import { navigate } from "../../utility/navigatePage";
import { ExportChat, ImportChat, chatDelete } from "./utility";
import { isoToHuman } from "../../utility/time";
//
import { IconButton, Box, Drawer } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { Tooltip, Grid } from "@mui/material";
//
import HttpsIcon from "@mui/icons-material/Https";
import ChatIcon from "@mui/icons-material/Chat";
import RateReviewIcon from "@mui/icons-material/RateReview";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IosShareIcon from "@mui/icons-material/IosShare";
import FileOpenIcon from "@mui/icons-material/FileOpen";
// ----------------------------------------------------------------------

const ChatDrawer = () => {
  const chats = useStore((state) => state.chats);
  const current_chat = useStore((state) => state.current_chat);
  const chat_drawer_open = useStore((state) => state.chat_drawer_open);
  const version_ = useStore.getState().version;
  const dev_mode_ = useStore.getState().dev_mode;

  const handleRenameDialogOpen = (e, index) => {
    console.log(index, chats[chats.length - index - 1].title);

    e.stopPropagation();

    useStore.setState({
      rename_dialog_index: chats.length - index - 1,
      rename_dialog_input: chats[chats.length - index - 1].title,
      rename_dialog_open: true,
    });
  };

  const toggleChatDrawer = (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    )
      return;

    useStore.getState().chat_drawer_toggle();
  };

  const navAPIKey = () => {
    navigate("change api key");
  };

  const navSystemPrompts = () => {
    navigate("library");
  };

  const newChat = () => {
    useStore.setState({ chat_reset: true });
  };

  const switchPromptOpen = (event) => {
    event.stopPropagation();
    useStore.setState({ switch_prompt_dialog_open: true });
  };

  return (
    <Drawer anchor={"left"} open={chat_drawer_open} onClose={toggleChatDrawer}>
      <Box
        sx={{
          width: "33vw",
          display: "flex", // Added: Using Flex container
          flexDirection: "column", // Added: Flex direction set to column
          overflow: "hidden",
        }}
        role="presentation"
        onClick={toggleChatDrawer}
        onKeyDown={toggleChatDrawer}
      >
        <List>
          <ListItem>
            <ListItemText
              primary={`Skyway v${version_} ${dev_mode_ ? "pre-release" : ""}`}
            />
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
            overflow: "auto",
          }}
        >
          <List sx={{ overflowX: "hidden" }}>
            {chats
              .slice()
              .reverse()
              .map((chat, index) => (
                <ListItem
                  key={index}
                  disablePadding
                  sx={(theme) => ({
                    backgroundColor:
                      chat.uuid === current_chat
                        ? theme.palette.primary.outside
                        : theme.palette.primary.inside,
                  })}
                >
                  <Box sx={{ width: "100%" }} marginRight={1.5}>
                    <Grid container>
                      <Grid item xs={9}>
                        <ListItemButton
                          disabled={chat.uuid === current_chat ? true : false}
                          onClick={() => {
                            useStore.setState({
                              current_chat: chat.uuid,
                              active_system_prompt: chat.prompt,
                              chat_open: true,
                            });
                          }}
                        >
                          <ListItemText
                            primary={chat.title}
                            secondary={`${isoToHuman(chat.lastActive)} | ${
                              chat.prompt.title
                            }`}
                          />
                        </ListItemButton>
                      </Grid>
                      <Grid item xs={1} container alignItems="center">
                        <Tooltip title="Rename Chat">
                          <IconButton
                            onClick={(e) => {
                              handleRenameDialogOpen(e, index);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                      <Grid item xs={1} container alignItems="center">
                        <Tooltip title="Export Chat">
                          <IconButton
                            onClick={() => {
                              ExportChat(chat.uuid);
                            }}
                          >
                            <IosShareIcon />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                      <Grid item xs={1} container alignItems="center">
                        <Tooltip title="Delete Chat">
                          <span>
                            <IconButton
                              disabled={
                                chat.uuid === current_chat ? true : false
                              }
                              onClick={(event) => {
                                event.stopPropagation();
                                chatDelete(chat.uuid);
                              }}
                            >
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
    </Drawer>
  );
};

export { ChatDrawer };
