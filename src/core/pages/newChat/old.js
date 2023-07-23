import React, { useState, useRef, useEffect } from "react";
//
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useStore } from "../../zustand";
//
import { fetchChatCompletion } from "../../utility/fetchData";
import { navigate } from "../../utility/navigatePage";
import { isoToHuman, unixToISO } from "../../utility/time";
import error from "../../utility/error";
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
import { LeftBox, RightBox, LeftChatBox, RightChatBox, ChatsHolder } from "./newChat_styles";
import { OutlinePaper } from "../../mui/reusable";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { materialDark, materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

function hasScrollbar(input) {
  return input.scrollHeight > input.clientHeight;
};

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

  const active_system_prompt_ = useStore.getState().active_system_prompt;
  const open_ai_api_keys_ = useStore.getState().open_ai_api_keys;
  const open_ai_api_key_ = useStore.getState().open_ai_api_key;
  const color_mode_ = useStore.getState().color_mode;

  const errorMessage = {
    role: "assistant",
    content: error
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
    return <>
      <ReactMarkdown rehypePlugins={[rehypeRaw]}
        children={content}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <SyntaxHighlighter
                {...props}
                children={String(children).replace(/\n$/, '')}
                style={color_mode_ === "light" ? materialLight : materialDark}
                language={match[1]}
                PreTag="div"
              />
            ) : (
              <code {...props} className={className}>
                {children}
              </code>
            )
          }
        }}
      />
    </>
  };

  const FormattedRightResponse = ({ content }) => {
    return <>
      <Typography style={{ whiteSpace: 'pre-wrap' }}>{content}</Typography>
    </>
  };

  const SubmitPromptAsync = async (sendDateISO) => {
    let upstream = [];

    const conversation_ = [...conversation];
    const activeSystemPrompt_ = { role: "system", content: active_system_prompt_.prompt };
    const userPrompt_ = { role: "user", content: userMessageInput };

    if (active_system_prompt_.engine === "amnesia") {
      conversation_.push(userPrompt_)
      upstream = [activeSystemPrompt_, userPrompt_]
    } else {
      if (!conversation_.length) {
        conversation_.push(activeSystemPrompt_)
      };

      conversation_.push(userPrompt_)
      upstream = [...conversation_]
    };

    const response = await fetchChatCompletion(
      upstream,
      active_system_prompt_.model,
      active_system_prompt_.params
    );

    if (response === "error") {
      conversation_.push(errorMessage);
    } else {
      setNewTokenCount(response.usage.total_tokens)
      conversation_.push(response.choices[0].message);
      setBusyUI(false);

      const oldArr = [...timeStamps];
      oldArr.push(sendDateISO);
      oldArr.push(unixToISO(response.created));

      setTimeStamps(oldArr);
    };

    setConversation(conversation_);
    setUserMessageInput(active_system_prompt_.prefil ? active_system_prompt_.prefil : "");
  };

  const SubmitPrompt = () => {
    const sendDate = new Date();
    const sendDateISO = String(sendDate.toISOString());

    setBusyUI(true);
    setEditMode(false);
    handleModalClose();

    SubmitPromptAsync(sendDateISO);
  };

  const EditMode = () => {
    setEditMode(true)
    const conversation_ = [...conversation]
    conversation_.pop()
    setUserMessageInput(conversation_[conversation_.length - 1].content)
    conversation_.pop()
    setConversation(conversation_)

    let arr = [];

    for (let i = 0; i < timeStamps.length - 2; i++) {
      arr.push(timeStamps[i]);
    };

    setTimeStamps(arr)
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
                {active_system_prompt_.title}
              </Typography>
            </OutlinePaper>
            <Stack direction="column" spacing={1}>
              <Typography variant="body1">
                {active_system_prompt_.model}
              </Typography>
              <Typography variant="body1">
                {active_system_prompt_.engine}
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
                            <Typography>{isoToHuman(timeStamps[key - 1])}</Typography>
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
                            <Typography>{isoToHuman(timeStamps[key - 1])}</Typography>
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
                label={active_system_prompt_.userInputLabel}
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
              {active_system_prompt_.engine === "token limited" && <Typography variant="body1">
                Total Tokens: {newTokenCount}/{active_system_prompt_.limit}
              </Typography>}
              {active_system_prompt_.engine === "amnesia" && <Typography variant="body1">
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
              label={active_system_prompt_.userInputLabel}
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
