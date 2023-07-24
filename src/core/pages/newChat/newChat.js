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
} from "@mui/material";
//
import HomeIcon from "@mui/icons-material/Home"
import RefreshIcon from '@mui/icons-material/Refresh';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import InputAdornment from '@mui/material/InputAdornment';
//
import { LeftBox, RightBox, LeftChatBox, RightChatBox } from "./newChat_styles";
import { OutlinePaper } from "../../mui/reusable";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { materialDark, materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';

const TopBar = styled(Box)(({ theme }) => ({
  height: theme.spacing(12),
  maxHeight: theme.spacing(12),
  position: "absolute",
  top: 0,
  width: "100vw"
}));

const Middle = styled(Box)(({ theme }) => ({
  width: "100vw",
  top: theme.spacing(12),
  bottom: theme.spacing(16),
  position: "absolute",
  overflowY: "auto",
  overflowX: "hidden"
}));

const BottomBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column-reverse',
  height: theme.spacing(16),
  maxHeight: theme.spacing(16),
  position: "absolute",
  bottom: 0,
  width: "100vw"
}));

const CustomTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    backgroundColor: theme.palette.primary.main,
    border: `1px solid ${theme.palette.secondary.main}`
  },
  '& label.Mui-focused': {
    color: theme.palette.secondary.main
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: theme.palette.secondary.main
  },
}));

const NewChat = () => {
  const theme = useTheme();
  const inputRef = useRef();

  const conversationScrollRef = useRef(null);

  const [userMessageInput, setUserMessageInput] = useState("");

  const [conversation, setConversation] = useState([]);

  const [newTokenCount, setNewTokenCount] = useState(0)

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
  };

  const FormattedLeftResponse = ({ content }) => {
    return <Box sx={{ wordWrap: 'break-word', overflowX: "auto", marginY: -1 }}>
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
    </Box>
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
    SubmitPromptAsync(sendDateISO);
  };

  const EditMode = () => {
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

  const ResubmitPromptAsync = async () => {
    const conversation_ = [...conversation];
    let upstream = [];

    conversation.pop()
    conversation_.pop()

    if (active_system_prompt_.engine === "amnesia") {
      upstream = [{ role: "system", content: active_system_prompt_.prompt }, conversation_[conversation_.length - 1]];
    } else {
      upstream = conversation_;
    }

    const response = await fetchChatCompletion(upstream, active_system_prompt_.model, active_system_prompt_.params)

    if (response === "error") {
      setUserMessageInput("");
      conversation_.push(errorMessage);
    } else {
      setNewTokenCount(response.usage.total_tokens)
      conversation_.push(response.choices[0].message);
      setBusyUI(false);
      let timeArray = [];
      for (let i = 0; i < timeStamps.length - 1; i++) {
        timeArray.push(timeStamps[i])
      };

      timeArray.push(unixToISO(response.created));

      setTimeStamps(timeArray);
    };

    setConversation(conversation_);
  };

  const ReSubmitPrompt = () => {
    setBusyUI(true);
    ResubmitPromptAsync();
  };

  const handleKeyDown = (event) => {
    if (!event.shiftKey && event.key === 'Enter') {
      SubmitPrompt();
      event.preventDefault();
    };
  };

  useEffect(() => {
    if (conversationScrollRef.current) {
      conversationScrollRef.current.scrollIntoView({ behaviour: "smooth" });
    }
  }, [conversation]);

  useEffect(() => {
    if (!busyUI) {
      inputRef.current.focus();
    }
  }, [busyUI]);

  return (
    <>
      <TopBar>
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
                  {newTokenCount}/{active_system_prompt_.limit}
                </Typography>}
                {active_system_prompt_.engine === "amnesia" && <Typography variant="body1">
                  Previous Tokens:
                </Typography>}
                {active_system_prompt_.engine === "amnesia" && <Typography variant="body1">
                  {newTokenCount}
                </Typography>}
              </Stack>
            </OutlinePaper>
          </Stack>
        </OutlinePaper>
      </TopBar>
      <Middle>
        {conversation.length > 0 && conversation.map((chat, key) => {
          return (
            <React.Fragment key={key}>
              {chat.role !== "system" && <>
                {chat.role === "assistant" ? <LeftBox>
                  <LeftChatBox>
                    <Stack direction="column" spacing={0}>
                      <FormattedLeftResponse content={chat.content} />
                      <Box>
                        <Stack direction="row" spacing={1}>
                          <CopyToClipboard text={chat.content}>
                            <IconButton size="small">
                              <ContentCopyIcon />
                            </IconButton>
                          </CopyToClipboard>

                          {key === conversation.length - 1 && <IconButton onClick={ReSubmitPrompt} size="small">
                            <RefreshIcon />
                          </IconButton>}

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

                          {key === conversation.length - 2 && <IconButton size="small" onClick={EditMode}>
                            <EditIcon />
                          </IconButton>}

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
      </Middle>
      <BottomBar>
        <Stack direction="column" spacing={1} alignItems="center">
          <Box sx={{ width: "82%" }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <FormControl fullWidth >
                <Box sx={{ margin: 1 }}>
                  <CustomTextField
                    id="prompt-zone"
                    label={active_system_prompt_.userInputLabel}
                    variant="filled"
                    value={userMessageInput}
                    inputRef={inputRef}
                    onChange={handleUserPromptInput}
                    onKeyDown={handleKeyDown}
                    required={true}
                    disabled={busyUI}
                    fullWidth
                    multiline={true}
                    minRows={1}
                    maxRows={12}
                    autoFocus
                    InputProps={{
                      endAdornment: (
                        <InputAdornment
                          position="end"
                          sx={{
                            position: 'absolute',
                            bottom: theme.spacing(3),
                            right: 0,
                          }}
                        >
                          {!busyUI && <IconButton
                            onClick={SubmitPrompt}
                            position="end"
                          >
                            <SendIcon />
                          </IconButton>}

                          {busyUI && <CircularProgress color="secondary" />}
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>
              </FormControl>
            </Stack>
          </Box>
        </Stack>
      </BottomBar>
    </>
  );
};

export default NewChat;
