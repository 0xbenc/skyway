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

const convertUnixTimeToISOString = (unixTime) => {
  const date = new Date(unixTime * 1000); // Convert unixTime to milliseconds

  return date.toISOString();
};

const convertToHumanReadableTime = (isoTimeString) => {
  const date = new Date(isoTimeString);
  const humanReadableDate = date.toLocaleDateString('en-US',
    { year: '2-digit', month: '2-digit', day: 'numeric' });
  const humanReadableTime = date.toLocaleTimeString('en-US',
    { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return `${humanReadableDate}, ${humanReadableTime}`;
}

const NewChat = () => {
  const inputRef = useRef();

  const conversationScrollRef = useRef(null);

  const [scrollCount, setScrollCount] = useState(0);
  const [autoModalOpen, setAutoModalOpen] = useState(false);

  const [userMessageInput, setUserMessageInput] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const [conversation, setConversation] = useState([]);

  const [newTokenCount, setNewTokenCount] = useState(0)

  const [editMode, setEditMode] = useState(false)

  const [busyUI, setBusyUI] = useState(false);

  const [timeStamps, setTimeStamps] = useState([]);

  const activeSystemPrompt = useStore.getState().active_system_prompt;
  const open_ai_api_keys_ = useStore.getState().open_ai_api_keys;
  const open_ai_api_key_ = useStore.getState().open_ai_api_key;

  const errorMessage = {
    role: "assistant",
    content: "t̷h̴i̴s̸ ̷i̷s̷ ̴n̵o̴t̷ ̷a̶i̸. Critical Error, please check your connection, refresh, and try again. If the problem persists, you may need a new API key."
  }

  const handleUserPromptInput = (event) => {
    setUserMessageInput(event.target.value);

    const input = inputRef.current;
    if (hasScrollbar(input)) {
      setScrollCount(scrollCount + 1)
    }
    if (scrollCount > 1 && !autoModalOpen) {
      setAutoModalOpen(true)
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

  const SubmitPromptAsync = async (sendDateISO) => {
    let upstream = [];

    const conversation_ = [...conversation];
    const activeSystemPrompt_ = { role: "system", content: activeSystemPrompt.prompt };
    const userPrompt_ = { role: "user", content: userMessageInput };

    if (activeSystemPrompt.engine === "amnesia") {
      conversation_.push(userPrompt_)
      upstream = [activeSystemPrompt_, userPrompt_]
    } else {
      if (!conversation_.length) {
        conversation_.push(activeSystemPrompt_)
      };

      conversation_.push(userPrompt_)
      upstream = [...conversation_]
    };

    const response = await fetchChatCompletion(upstream, activeSystemPrompt.model, activeSystemPrompt.params)

    if (response === "error") {
      conversation_.push(errorMessage);
    } else {
      setNewTokenCount(response.usage.total_tokens)
      conversation_.push(response.choices[0].message);
      setBusyUI(false);

      const oldArr = [...timeStamps];
      oldArr.push(sendDateISO);
      oldArr.push(convertUnixTimeToISOString(response.created));

      setTimeStamps(oldArr);
    };

    setUserMessageInput("");
    setConversation(conversation_);
  };

  const SubmitPrompt = () => {
    const sendDate = new Date();
    const sendDateISO = String(sendDate.toISOString());

    setBusyUI(true);
    setEditMode(false);
    handleModalClose();

    SubmitPromptAsync(sendDateISO);
  };

  const ReSubmitPrompt = async () => {
    setBusyUI(true);
    setEditMode(false);

    const conversation_ = [...conversation];
    let upstream = [];

    conversation.pop()
    conversation_.pop()

    if (activeSystemPrompt.engine === "amnesia") {
      upstream = [{ role: "system", content: activeSystemPrompt.prompt }, conversation_[conversation_.length - 1]];
    } else {
      upstream = conversation_;
    }

    const response = await fetchChatCompletion(upstream, activeSystemPrompt.model, activeSystemPrompt.params)

    if (response === "error") {
      setUserMessageInput("");
      conversation_.push(errorMessage);
    } else {
      setNewTokenCount(response.usage.total_tokens)
      conversation_.push(response.choices[0].message);
      setBusyUI(false);
    };

    setConversation(conversation_);
  };

  const EditMode = () => {
    setEditMode(true)
    const conversation_ = [...conversation]
    conversation_.pop()
    setUserMessageInput(conversation_[conversation_.length - 1].content)
    conversation_.pop()
    setConversation(conversation_)
  };

  useEffect(() => {
    if (conversationScrollRef.current) {
      conversationScrollRef.current.scrollIntoView({ behaviour: "smooth" });
    }
  }, [conversation]);

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
            <OutlinePaper>
              <Typography variant="body1">
                API Key: {open_ai_api_keys_[open_ai_api_key_]?.name}
              </Typography>
            </OutlinePaper>
          </Stack>
        </OutlinePaper>
        <ChatsHolder>
          {conversation.length > 0 && conversation.map((chat, key) => {
            return (
              <React.Fragment key={key}>
                {chat.role !== "system" && <>
                  {chat.role === "assistant" ? <LeftBox>
                    <LeftChatBox>
                      <Stack direction="column" spacing={1}>
                        <FormattedLeftResponse content={chat.content} />
                        <Box>
                          <Stack direction="row" spacing={1}>
                            <CopyToClipboard text={chat.content}>
                              <IconButton size="small">
                                <ContentCopyIcon />
                              </IconButton>
                            </CopyToClipboard>
                            <Typography>{convertToHumanReadableTime(timeStamps[key - 1])}</Typography>
                          </Stack>
                        </Box>
                      </Stack>
                    </LeftChatBox>
                  </LeftBox> : <RightBox>
                    <RightChatBox>
                      <Stack direction="column" spacing={1}>
                        <FormattedRightResponse content={chat.content} />
                        <Box>
                          <Stack direction="row" spacing={1}>
                            <CopyToClipboard text={chat.content}>
                              <IconButton size="small">
                                <ContentCopyIcon />
                              </IconButton>
                            </CopyToClipboard>
                            <Typography>{convertToHumanReadableTime(timeStamps[key - 1])}</Typography>
                          </Stack>
                        </Box>
                      </Stack>
                    </RightChatBox>
                  </RightBox>}
                </>}
              </React.Fragment>
            )
          })}

          {conversation.length > 0 && <CopyToClipboard text={JSON.stringify(conversation)}>
            <IconButton size="small">
              <ContentCopyIcon />
            </IconButton>
          </CopyToClipboard>}

          <div ref={conversationScrollRef} />
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
                    disabled={busyUI || !conversation.length}
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
                    disabled={busyUI || !conversation.length || editMode}
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
                value={userMessageInput}
                inputRef={inputRef}
                onChange={handleUserPromptInput}
                onKeyPress={(ev) => {
                  if (ev.key === 'Enter' && userMessageInput !== "") {
                    SubmitPrompt();
                    ev.preventDefault();
                  }
                }}
                required={true}
                disabled={busyUI}
                fullWidth
                multiline={true}
                maxRows={2}
                autoFocus
              />
            </Box>
          </FormControl>

          <Tooltip title="expand typing area">
            <span>
              <IconButton
                onClick={handleModalOpen}
                size="large"
                disabled={userMessageInput === "" || busyUI || modalOpen}
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
                disabled={userMessageInput === "" || busyUI}
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
              value={userMessageInput}
              onChange={handleUserPromptInput}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter' && userMessageInput !== "") {
                  SubmitPrompt();
                  ev.preventDefault();
                };
              }}
              required={true}
              disabled={busyUI}
              fullWidth
              multiline={true}
              rows={30}
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
                  disabled={userMessageInput === "" || busyUI}
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
