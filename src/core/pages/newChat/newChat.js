import React, { useState, useRef, useEffect } from "react";
//
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useStore } from "../../zustand";
//
import { fetchChatCompletion } from "../../utility/fetchData";
import { navigate } from "../../utility/navigatePage";
//
import {
  FormControl,
  TextField,
  IconButton,
  Typography,
  CircularProgress,
  Box,
  Stack,
  Tooltip,
  Backdrop
} from "@mui/material";
//
import HomeIcon from "@mui/icons-material/Home"
import RefreshIcon from '@mui/icons-material/Refresh';
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
//
import { formatResponse } from "./newChat_utility";
import { LeftBox, RightBox, LeftChatBox, RightChatBox, ChatsHolder, LeftCodeBorder, RightCodeBorder } from "./newChat_styles";
import { OutlinePaper } from "../../mui/reusable";

function hasScrollbar(input) {
  return input.scrollHeight > input.clientHeight;
}

const NewChat = () => {
  const inputRef = useRef();

  const scrollRef = useRef(null);

  const [scrollCount, setScrollCount] = useState(0);
  const [autoScroll, setAutoScroll] = useState(false);

  const [userPromptInput, setUserPromptInput] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const [displayedChats, setDisplayedChats] = useState([]);

  const [newTokenCount, setNewTokenCount] = useState(0)

  const [editMode, setEditMode] = useState(false)

  const [busyUI, setBusyUI] = useState(false);

  const activeSystemPrompt = useStore.getState().active_system_prompt

  const errorMessage = {
    role: "assistant",
    content: "t̷h̴i̴s̸ ̷i̷s̷ ̴n̵o̴t̷ ̷a̶i̸. Critical Error, please check your connection, refresh, and try again. If the problem persists, you may need a new API key."
  }

  const handleUserPromptInput = (event) => {
    setUserPromptInput(event.target.value);

    const input = inputRef.current;
    if (hasScrollbar(input)) {
      setScrollCount(scrollCount + 1)
    }
    if (scrollCount > 1 && !autoScroll) {
      setAutoScroll(true)
      handleModalOpen()
    }
  };

  const FormattedLeftResponse = ({ content }) => {
    const array = formatResponse(content);

    return <>
      {array.map((chat, key) => {
        return (
          <Box key={key}>
            {
              chat.type === "code" ? <CopyToClipboard text={chat.text}>
                <LeftCodeBorder>
                  <Typography style={{ whiteSpace: 'pre-wrap' }}>{chat.text}</Typography>
                </LeftCodeBorder>
              </CopyToClipboard> : <Box>
                <Typography style={{ whiteSpace: 'pre-wrap' }}>{chat.text}</Typography>
              </Box>
            }
          </Box>
        )
      })}
    </>
  };

  const FormattedRightResponse = ({ content }) => {
    const array = formatResponse(content);

    return <>
      {array.map((chat, key) => {
        return (
          <Box key={key}>
            {
              chat.type === "code" ? <CopyToClipboard text={chat.text}>
                <RightCodeBorder>
                  <Typography style={{ whiteSpace: 'pre-wrap' }}>{chat.text}</Typography>
                </RightCodeBorder>
              </CopyToClipboard> : <Box>
                <Typography style={{ whiteSpace: 'pre-wrap' }}>{chat.text}</Typography>
              </Box>
            }
          </Box>
        )
      })}
    </>
  };

  const SubmitPrompt = async () => {
    setBusyUI(true);
    setEditMode(false);
    handleModalClose();

    let upstream = [];

    const displayedChats_ = [...displayedChats];
    const activeSystemPrompt_ = { role: "system", content: activeSystemPrompt.prompt };
    const userPrompt_ = { role: "user", content: userPromptInput };

    if (activeSystemPrompt.engine === "amnesia") {
      displayedChats_.push(userPrompt_)
      upstream = [activeSystemPrompt_, userPrompt_]
    } else {
      if (!displayedChats_.length) {
        displayedChats_.push(activeSystemPrompt_)
      };

      displayedChats_.push(userPrompt_)
      upstream = [...displayedChats_]
    };

    const response = await fetchChatCompletion(upstream, activeSystemPrompt.model, activeSystemPrompt.params)

    if (response === "error") {
      displayedChats_.push(errorMessage);
    } else {
      setNewTokenCount(response.usage.total_tokens)
      displayedChats_.push(response.choices[0].message);
      setBusyUI(false);
    };

    setUserPromptInput("");
    setDisplayedChats(displayedChats_);
  };

  const ReSubmitPrompt = async () => {
    setBusyUI(true);
    setEditMode(false);

    const displayedChats_ = [...displayedChats];
    let upstream = [];

    displayedChats.pop()
    displayedChats_.pop()

    if (activeSystemPrompt.engine === "amnesia") {
      upstream = [{ role: "system", content: activeSystemPrompt.prompt }, displayedChats_[displayedChats_.length - 1]];
    } else {
      upstream = displayedChats_;
    }

    const response = await fetchChatCompletion(upstream, activeSystemPrompt.model, activeSystemPrompt.params)

    if (response === "error") {
      setUserPromptInput("");
      displayedChats_.push(errorMessage);
    } else {
      setNewTokenCount(response.usage.total_tokens)
      displayedChats_.push(response.choices[0].message);
      setBusyUI(false);
    };

    setDisplayedChats(displayedChats_);
  };

  const EditMode = () => {
    setEditMode(true)
    const displayedChats_ = [...displayedChats]
    displayedChats_.pop()
    setUserPromptInput(displayedChats_[displayedChats_.length - 1].content)
    displayedChats_.pop()
    setDisplayedChats(displayedChats_)
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behaviour: "smooth" });
    }
  }, [displayedChats]);

  return (
    <>
      <Stack direction="column" spacing={1}>
        <OutlinePaper>
          <Stack direction="row" spacing={1}>
            <Box>
              <IconButton
                aria-label="close"
                onClick={() => { navigate("landing") }}
              >
                <HomeIcon />
              </IconButton>
            </Box>
            <Typography variant="h3">
              New Chat:
            </Typography>
            <OutlinePaper>
              <Typography variant="h4">
                {activeSystemPrompt.title}
              </Typography>
            </OutlinePaper>
            <Stack direction="column" spacing={1}>
              <Typography variant="body1">
                {activeSystemPrompt.model}
              </Typography>
              <Typography variant="body1">
                {activeSystemPrompt.engine}
              </Typography>
            </Stack>
          </Stack>
        </OutlinePaper>
        <ChatsHolder>
          {displayedChats.length > 0 && displayedChats.map((chat, key) => {
            return (
              <React.Fragment key={key}>
                {chat.role !== "system" && <>
                  {chat.role === "assistant" ? <LeftBox>
                    <LeftChatBox>
                      <Stack direction="column" spacing={1}>
                        <FormattedLeftResponse content={chat.content} />
                        <Box>
                          <CopyToClipboard text={chat.content}>
                            <IconButton size="small">
                              <ContentCopyIcon />
                            </IconButton>
                          </CopyToClipboard>
                        </Box>
                      </Stack>
                    </LeftChatBox>
                  </LeftBox> : <RightBox>
                    <RightChatBox>
                      <Stack direction="column" spacing={1}>
                        <FormattedRightResponse content={chat.content} />
                        <Box>
                          <CopyToClipboard text={chat.content}>
                            <IconButton size="small">
                              <ContentCopyIcon />
                            </IconButton>
                          </CopyToClipboard>
                        </Box>
                      </Stack>
                    </RightChatBox>
                  </RightBox>}
                </>}
              </React.Fragment>
            )
          })}

          {displayedChats.length > 0 && <CopyToClipboard text={JSON.stringify(displayedChats)}>
            <IconButton size="small">
              <ContentCopyIcon />
            </IconButton>
          </CopyToClipboard>}

          <div ref={scrollRef} />
        </ChatsHolder>
      </Stack>

      <Box sx={{ position: "absolute", bottom: 0, width: "100%" }}>
        <Stack direction="row" spacing={1}>
          <OutlinePaper>
            <Stack direction="row" spacing={1}>
              <Tooltip title="resubmit last message">
                <span>
                  <IconButton
                    onClick={() => { ReSubmitPrompt() }}
                    size="large"
                    disabled={busyUI || !displayedChats.length}
                  >
                    <RefreshIcon />
                  </IconButton>
                </span>
              </Tooltip>

              <Tooltip title="adjust last message">
                <span>
                  <IconButton
                    onClick={() => { EditMode() }}
                    size="large"
                    disabled={busyUI || !displayedChats.length || editMode}
                  >
                    <EditIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
          </OutlinePaper>

          <FormControl fullWidth >
            <Box sx={{ margin: 1 }}>
              <TextField
                id="prompt-zone"
                label={activeSystemPrompt.userInputLabel}
                variant="filled"
                color="secondary"
                value={userPromptInput}
                inputRef={inputRef}
                onChange={handleUserPromptInput}
                onKeyPress={(ev) => {
                  if (ev.key === 'Enter' && userPromptInput !== "") {
                    SubmitPrompt();
                    ev.preventDefault();
                  }
                }}
                required={true}
                disabled={busyUI}
                fullWidth
                multiline={true}
                maxRows={2}
                focused
                autoFocus
              />
            </Box>
          </FormControl>

          <Tooltip title="expand typing area">
            <span>
              <IconButton
                onClick={handleModalOpen}
                size="large"
                disabled={userPromptInput === "" || busyUI || modalOpen}
                variant="outlined"
              >
                <AspectRatioIcon />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="submit message">
            <span>
              <IconButton
                onClick={() => { SubmitPrompt() }}
                size="large"
                disabled={userPromptInput === "" || busyUI}
                variant="outlined"
              >
                <DoneIcon />
              </IconButton>
            </span>
          </Tooltip>

          {busyUI && <CircularProgress color="secondary" />}

          <OutlinePaper>
            <Stack direction="row" spacing={1}>
              {activeSystemPrompt.engine === "token limited" && <Typography variant="body1">
                Total Tokens: {newTokenCount}/{activeSystemPrompt.limit}
              </Typography>}
              {activeSystemPrompt.engine === "amnesia" && <Typography variant="body1">
                Previous Tokens: {newTokenCount}
              </Typography>}
            </Stack>
          </OutlinePaper>
        </Stack>
      </Box>

      <Backdrop
        sx={{
          color: '#fff',
          backgroundColor: (theme) => theme.palette.primary.outside,
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
        open={modalOpen}
      >
        <FormControl
          fullWidth
          sx={{ backgroundColor: (theme) => theme.palette.primary.main }}
        >
          <Box sx={{ margin: 1 }}>
            <TextField
              id="prompt-zone"
              label={activeSystemPrompt.userInputLabel}
              variant="filled"
              color="secondary"
              value={userPromptInput}
              onChange={handleUserPromptInput}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter' && userPromptInput !== "") {
                  SubmitPrompt();
                  ev.preventDefault();
                };
              }}

              required={true}
              disabled={busyUI}
              fullWidth
              multiline={true}
              rows={30}
              focused
              autoFocus
            />
          </Box>
          <Stack direction="row" spacing={1}>
            <Tooltip title="minimize typing area">
              <span>
                <IconButton
                  onClick={handleModalClose}
                  size="large"
                  variant="outlined"
                >
                  <CloseFullscreenIcon />
                </IconButton>
              </span>
            </Tooltip>

            <Tooltip title="submit message">
              <span>
                <IconButton
                  onClick={() => { SubmitPrompt() }}
                  size="large"
                  disabled={userPromptInput === "" || busyUI}
                  variant="outlined"
                >
                  <DoneIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        </FormControl>
      </Backdrop>
    </>
  );
};

export default NewChat;
