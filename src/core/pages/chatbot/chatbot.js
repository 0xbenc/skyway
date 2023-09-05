import React, { useState, useRef, useEffect } from "react";
//
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useStore } from "../../zustand";
//
import { fetchChatCompletion } from "../../utility/fetchData";
import { isoToHuman, unixToISO } from "../../utility/time";
import error from "../../utility/error";
import generateKeyV4 from "../../utility/uuid";
import { LeftBox, RightBox, LeftChatBox, RightChatBox, ChatField, Middle, Bottom } from "./chatbot_styles";
import TopBar from "./chatbot_top_bar";
import { FormattedLeftResponse, FormattedRightResponse } from "./chatbot_components";
import { chatSync } from "./chatbot_utility";
//
import {
  FormControl,
  IconButton,
  Typography,
  CircularProgress,
  Box,
  Stack,
  Divider,
} from "@mui/material";
//
import RefreshIcon from '@mui/icons-material/Refresh';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
// ----------------------------------------------------------------------

const Chatbot = () => {
  const inputRef = useRef();

  const conversationScrollRef = useRef(null);

  const [userMessageInput, setUserMessageInput] = useState("");

  const [conversation, setConversation] = useState([]);

  const [busyUI, setBusyUI] = useState(false);

  const [timeStamps, setTimeStamps] = useState([]);

  const [justOnce, setJustOnce] = useState(false);

  const [chatUUID, setChatUUID] = useState("");
  const [chatTitle, setChatTitle] = useState("");

  // used as a trigger to scroll chat window to the bottom
  const [scrollTime, setScrollTime] = useState(false);

  const chat_reset = useStore(state => state.chat_reset);
  const chat_open = useStore(state => state.chat_open);
  const active_system_prompt_ = useStore(state => state.active_system_prompt);

  const color_mode_ = useStore.getState().color_mode;

  const errorMessage = {
    role: "assistant",
    content: error
  };

  const handleUserPromptInput = (event) => {
    setUserMessageInput(event.target.value);
  };

  const SubmitPromptAsync = async (sendDateISO) => {
    let upstream = [];

    const conversation_ = [...conversation];
    const activeSystemPrompt_ = { role: "system", content: active_system_prompt_.prompt };
    const userPrompt_ = { role: "user", content: userMessageInput };

    const shortChatTitle = userMessageInput.length > 31 ? `${String(userMessageInput).substring(0, 31)}...` : String(userMessageInput).substring(0, 31);

    if (chatTitle === "none") {
      setChatTitle(shortChatTitle);
    };

    const newTimeStamps = [...timeStamps];
    newTimeStamps.push(sendDateISO);

    if (!conversation_.length) {
      conversation_.push(activeSystemPrompt_);
      newTimeStamps.push(sendDateISO);
    };

    conversation_.push(userPrompt_);

    if (active_system_prompt_.engine === "amnesia") {
      upstream = [activeSystemPrompt_, userPrompt_];
    } else {
      upstream = [...conversation_];
    };

    setTimeStamps(newTimeStamps);
    setConversation(conversation_);
    setUserMessageInput(active_system_prompt_.prefill ? active_system_prompt_.prefill : "");
    setScrollTime(true)

    const response = await fetchChatCompletion(
      upstream,
      active_system_prompt_.model,
      active_system_prompt_.params
    );

    if (response === "error") {
      conversation_.push(errorMessage);
    } else {
      useStore.setState({ token_count: response.usage.total_tokens });
      conversation_.push(response.choices[0].message);

      newTimeStamps.push(unixToISO(response.created));

      setTimeStamps(newTimeStamps);
    };

    const chat = {
      conversation: conversation_,
      timeStamps: newTimeStamps,
      uuid: chatUUID,
      title: chatTitle === "none" ? shortChatTitle : chatTitle,
      prompt: active_system_prompt_,
      total_tokens: response.usage.total_tokens,
      lastActive: newTimeStamps[newTimeStamps.length -1]
    };

    chatSync(chat);

    setConversation(conversation_);
    setBusyUI(false);
    setScrollTime(true);
    useStore.setState({ busy_ui: false })
  };

  // sends the user-chat message as a prompt 
  const SubmitPrompt = () => {
    const sendDate = new Date();
    const sendDateISO = String(sendDate.toISOString());

    setBusyUI(true);
    useStore.setState({ busy_ui: true })
    SubmitPromptAsync(sendDateISO);
  };

  // rewrite user's last message 
  const EditMode = () => {
    const conversation_ = [...conversation];
    conversation_.pop();
    setUserMessageInput(conversation_[conversation_.length - 1].content);
    conversation_.pop();
    setConversation(conversation_);

    let arr = [];

    for (let i = 0; i < timeStamps.length - 2; i++) {
      arr.push(timeStamps[i]);
    };

    setTimeStamps(arr);
    inputRef.current.focus();
  };

  // Sends the last message again to get a different response  
  const ResubmitPromptAsync = async () => {
    const conversation_ = [...conversation];
    let upstream = [];

    conversation.pop();
    conversation_.pop();

    if (active_system_prompt_.engine === "amnesia") {
      upstream = [{ role: "system", content: active_system_prompt_.prompt }, conversation_[conversation_.length - 1]];
    } else {
      upstream = conversation_;
    };

    const response = await fetchChatCompletion(upstream, active_system_prompt_.model, active_system_prompt_.params);

    let timeArray = [];

    if (response === "error") {
      setUserMessageInput("");
      conversation_.push(errorMessage);
    } else {
      useStore.setState({ token_count: response.usage.total_tokens });
      conversation_.push(response.choices[0].message);
      setBusyUI(false);
      useStore.setState({ busy_ui: false })
      for (let i = 0; i < timeStamps.length - 1; i++) {
        timeArray.push(timeStamps[i]);
      };

      timeArray.push(unixToISO(response.created));

      setTimeStamps(timeArray);
    };

    const chat = {
      conversation: conversation_,
      timeStamps: timeArray,
      uuid: chatUUID,
      title: chatTitle,
      prompt: active_system_prompt_,
      total_tokens: response.usage.total_tokens,
      lastActive: timeArray[timeArray.length -1]
    };

    chatSync(chat);

    setConversation(conversation_);
    setScrollTime(true);
  };

  const ReSubmitPrompt = () => {
    setBusyUI(true);
    useStore.setState({ busy_ui: true })
    ResubmitPromptAsync();
  };

  // enables pressing 'Enter' to send message 
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();

      if (userMessageInput !== "") SubmitPrompt();
    };
  };

  // Handles autoscroll
  useEffect(() => {
    if (scrollTime) {
      setScrollTime(false);
      conversationScrollRef.current.scrollIntoView({ behaviour: "smooth" });
    };
  }, [scrollTime]);

  // Handles autoscroll
  useEffect(() => {
    if (!busyUI) {
      inputRef.current.focus();
    };
  }, [busyUI]);

  // Handles initilization
  useEffect(() => {
    if (!justOnce) {
      setJustOnce(true);
      setUserMessageInput(active_system_prompt_.prefill ? active_system_prompt_.prefill : "");
      setTimeStamps([]);
      setConversation([]);
      setBusyUI(false);
      const u = generateKeyV4();
      setChatUUID(u);
      setChatTitle("none");
      useStore.setState({ token_count: 0, current_chat: "none", busy_ui: false });
      inputRef.current.focus();
    };
  }, [justOnce]);

  // Handles reset from [File -> New Chat] / [Ctrl + N]
  useEffect(() => {
    if (chat_reset && !busyUI) {
      useStore.setState({ chat_reset: false });
      setJustOnce(false);
    };
  }, [chat_reset, busyUI]);

  // Handles the selection of a previous chat
  useEffect(() => {
    if (chat_open && !busyUI) {
      useStore.setState({ chat_open: false });
      const current_chat_ = useStore.getState().current_chat;
      const chats_ = useStore.getState().chats;

      for (let i = 0; i < chats_.length; i++) {
        if (chats_[i].uuid === current_chat_) {
          const system_prompts_ = useStore.getState().system_prompts;
          let activeChatInLibrary = false;

          for (let e = 0; e < system_prompts_.length; e++) {
            if (system_prompts_[e].uuid === active_system_prompt_.uuid) {
              activeChatInLibrary = true;
            }
          }

          setUserMessageInput(active_system_prompt_.prefill ? active_system_prompt_.prefill : "");
          setTimeStamps(chats_[i].timeStamps);
          setConversation(chats_[i].conversation);
          setBusyUI(false);
          setChatUUID(chats_[i].uuid)
          setChatTitle(chats_[i].title)
          useStore.setState({ token_count: chats_[i].total_tokens, prompt_save_status: activeChatInLibrary, busy_ui: false });
          inputRef.current.focus();
        }
      }
    };
  }, [chat_open, busyUI, active_system_prompt_]);

  return (
    <>
      <TopBar />

      <Middle>
        {conversation.length > 0 && conversation.map((chat, key) => {
          return (
            <React.Fragment key={key}>
              {chat.role !== "system" && <>
                {chat.role === "assistant" ? <LeftBox>
                  <LeftChatBox>
                    <FormattedLeftResponse content={chat.content} color_mode={color_mode_} />
                    <Divider />
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography>{isoToHuman(timeStamps[key])}</Typography>

                      <CopyToClipboard text={chat.content}>
                        <IconButton size="small">
                          <ContentCopyIcon />
                        </IconButton>
                      </CopyToClipboard>

                      {key === conversation.length - 1 && <IconButton onClick={ReSubmitPrompt} size="small">
                        <RefreshIcon />
                      </IconButton>}
                    </Stack>
                  </LeftChatBox>
                </LeftBox> : <RightBox>
                  <RightChatBox>
                    <FormattedRightResponse content={chat.content} color_mode={color_mode_} />
                    <Divider />
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography>{isoToHuman(timeStamps[key])}</Typography>

                      <CopyToClipboard text={chat.content}>
                        <IconButton size="small">
                          <ContentCopyIcon />
                        </IconButton>
                      </CopyToClipboard>

                      {key === conversation.length - 2 && <IconButton size="small" onClick={EditMode}>
                        <EditIcon />
                      </IconButton>}
                    </Stack>
                  </RightChatBox>
                </RightBox>}
              </>}
            </React.Fragment>
          )
        })}

        <div ref={conversationScrollRef} />
      </Middle>

      <Bottom>
        <Stack direction="column" spacing={1} alignItems="center">
          <Box sx={{ width: "82%" }}>
            <Stack direction="row" spacing={1} alignItems="bottom">
              <FormControl fullWidth >
                <ChatField
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
                />
              </FormControl>
              <Box display="flex" flexDirection="column" justifyContent="flex-end">
                <Box margin={1}>
                  {!busyUI &&
                    <IconButton onClick={SubmitPrompt} disabled={!userMessageInput.length}>
                      <SendIcon />
                    </IconButton>
                  }
                  {busyUI && <CircularProgress size="2rem" color="secondary" />}
                </Box>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Bottom>
    </>
  );
};

export default Chatbot;
