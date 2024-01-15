import React, { useState, useRef, useEffect } from "react";
//
import { useStore } from "../../zustand";
//
import { fetchChatCompletion } from "../../utility/fetchData";
import { unixToISO } from "../../utility/time";
import { error } from "../../utility/error";
import { generateKeyV4 } from "../../utility/uuid";
import { ChatField, Bottom } from "./styles";
import { chatSync } from "./utility";
//
import {
  FormControl,
  IconButton,
  CircularProgress,
  Box,
  Stack,
} from "@mui/material";
//
import SendIcon from "@mui/icons-material/Send";
// ----------------------------------------------------------------------

const Chatfield = () => {
  const inputRef = useRef();

  const [justOnce, setJustOnce] = useState(false);

  const busy_ui = useStore((state) => state.busy_ui);
  const active_system_prompt_ = useStore((state) => state.active_system_prompt);
  const user_message_input = useStore((state) => state.user_message_input);
  const timestamps = useStore((state) => state.timestamps);
  const previous_uuid = useStore((state) => state.previous_uuid);

  const version_ = useStore.getState().version;

  const errorMessage = {
    role: "assistant",
    content: error,
  };

  const handleUserPromptInput = (event) => {
    useStore.setState({ user_message_input: event.target.value });
  };

  const SubmitPromptAsync = async (sendDateISO, chatTitle, convo) => {
    let upstream = [];

    const conversation_ = [...convo];
    const activeSystemPrompt_ = {
      role: "system",
      content: active_system_prompt_.prompt,
    };
    const userPrompt_ = { role: "user", content: user_message_input };

    const shortChatTitle =
      user_message_input.length > 31
        ? `${String(user_message_input).substring(0, 31)}...`
        : String(user_message_input).substring(0, 31);

    if (chatTitle === "none") {
      useStore.setState({ chat_title: shortChatTitle });
    }

    const newTimeStamps = [...timestamps];
    newTimeStamps.push(sendDateISO);

    if (!conversation_.length) {
      conversation_.push(activeSystemPrompt_);
      newTimeStamps.push(sendDateISO);
    }

    conversation_.push(userPrompt_);

    if (active_system_prompt_.engine === "amnesia") {
      upstream = [activeSystemPrompt_, userPrompt_];
    } else {
      upstream = [...conversation_];
    }

    useStore.setState({
      timestamps: newTimeStamps,
      conversation: conversation_,
      user_message_input: active_system_prompt_.prefill
        ? active_system_prompt_.prefill
        : "",
    });

    useStore.setState({ scroll_time: true });

    const response = await fetchChatCompletion(
      upstream,
      active_system_prompt_.model,
      active_system_prompt_.params,
    );

    if (response === "error") {
      conversation_.push(errorMessage);
    } else {
      useStore.setState({ token_count: response.usage.total_tokens });
      conversation_.push(response.choices[0].message);

      newTimeStamps.push(unixToISO(response.created));

      useStore.setState({ timestamps: newTimeStamps });
    }

    const newKey = generateKeyV4();

    const chat = {
      conversation: conversation_,
      timestamps: newTimeStamps,
      uuid: newKey,
      title: chatTitle === "none" ? shortChatTitle : chatTitle,
      prompt: active_system_prompt_,
      total_tokens: response.usage.total_tokens,
      lastActive: newTimeStamps[newTimeStamps.length - 1],
      skywayVersion: version_,
    };

    chatSync(chat, previous_uuid, true);

    useStore.setState({
      previous_uuid: newKey,
      scroll_time: true,
      conversation: conversation_,
      busy_ui: false,
    });
  };

  // sends the user-chat message as a prompt
  const SubmitPrompt = () => {
    const sendDate = new Date();
    const sendDateISO = String(sendDate.toISOString());

    const chat_title = useStore.getState().chat_title;
    const conversation = useStore.getState().conversation;

    useStore.setState({ busy_ui: true });
    SubmitPromptAsync(sendDateISO, chat_title, conversation);
  };

  // enables pressing 'Enter' to send message
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (user_message_input !== "") SubmitPrompt();
    }
  };

  // Handles autofocus cursor
  useEffect(() => {
    if (!busy_ui) {
      inputRef.current.focus();
    }
  }, [busy_ui]);

  // Handles initilization
  useEffect(() => {
    if (!justOnce) {
      setJustOnce(true);
      inputRef.current.focus();
    }
  }, [justOnce]);

  return (
    <>
      <Bottom>
        <Stack direction="column" spacing={1} alignItems="center">
          <Box sx={{ width: "82%" }}>
            <Stack direction="row" spacing={1} alignItems="bottom">
              <FormControl fullWidth>
                <ChatField
                  id="prompt-zone"
                  label={active_system_prompt_.userInputLabel}
                  variant="filled"
                  value={user_message_input}
                  inputRef={inputRef}
                  onChange={handleUserPromptInput}
                  onKeyDown={handleKeyDown}
                  required={true}
                  disabled={busy_ui}
                  fullWidth
                  multiline={true}
                  minRows={1}
                  maxRows={12}
                />
              </FormControl>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="flex-end"
              >
                <Box margin={1}>
                  {!busy_ui && (
                    <IconButton
                      onClick={SubmitPrompt}
                      disabled={!user_message_input.length}
                    >
                      <SendIcon />
                    </IconButton>
                  )}
                  {busy_ui && (
                    <CircularProgress size="2rem" color="secondary" />
                  )}
                </Box>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Bottom>
    </>
  );
};

export { Chatfield };
