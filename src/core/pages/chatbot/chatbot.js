import React, { useState, useRef, useEffect } from "react";
//
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useStore } from "../../zustand";
//
import { fetchChatCompletion } from "../../utility/fetchData";
import { isoToHuman, unixToISO } from "../../utility/time";
import { error } from "../../utility/error";
import { generateKeyV4 } from "../../utility/uuid";
import {
  LeftBox,
  RightBox,
  LeftChatBox,
  RightChatBox,
  Middle,
} from "./styles";
import { FormattedLeftResponse, FormattedRightResponse } from "./components";
import { chatSync } from "./utility";
//
import {
  IconButton,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
//
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Chatfield } from "./chatfield";
// ----------------------------------------------------------------------

const Chatbot = () => {
  const conversationScrollRef = useRef(null);

  const [justOnce, setJustOnce] = useState(false);

  const chat_reset = useStore((state) => state.chat_reset);
  const chat_open = useStore((state) => state.chat_open);
  const active_system_prompt_ = useStore((state) => state.active_system_prompt);
  const conversation = useStore((state) => state.conversation);
  const scroll_time = useStore((state) => state.scroll_time);
  const busy_ui = useStore((state) => state.busy_ui);
  const chat_title = useStore((state) => state.chat_title);
  const timestamps = useStore((state) => state.timestamps);
  const previous_uuid = useStore((state) => state.previous_uuid);
  const color_mode = useStore((state) => state.color_mode);

  const version_ = useStore.getState().version;

  const errorMessage = {
    role: "assistant",
    content: error,
  };

  // rewrite user's last message
  const EditMode = () => {
    const conversation_ = [...conversation];
    conversation_.pop();

    useStore.setState({
      user_message_input: conversation_[conversation_.length - 1].content,
    });

    conversation_.pop();

    useStore.setState({ conversation: conversation_ });

    let arr = [];

    for (let i = 0; i < timestamps.length - 2; i++) {
      arr.push(timestamps[i]);
    }

    useStore.setState({ timestamps: arr });
  };

  // Sends the last message again to get a different response
  const ResubmitPromptAsync = async () => {
    const conversation_ = [...conversation];
    let upstream = [];

    conversation.pop();
    conversation_.pop();

    if (active_system_prompt_.engine === "amnesia") {
      upstream = [
        { role: "system", content: active_system_prompt_.prompt },
        conversation_[conversation_.length - 1],
      ];
    } else {
      upstream = conversation_;
    }

    const response = await fetchChatCompletion(
      upstream,
      active_system_prompt_.model,
      active_system_prompt_.params,
    );

    let timeArray = [];

    if (response === "error") {
      useStore.setState({ user_message_input: "" });

      conversation_.push(errorMessage);
    } else {
      useStore.setState({ token_count: response.usage.total_tokens });
      conversation_.push(response.choices[0].message);
      useStore.setState({ busy_ui: false });
      for (let i = 0; i < timestamps.length - 1; i++) {
        timeArray.push(timestamps[i]);
      }

      timeArray.push(unixToISO(response.created));

      useStore.setState({ timestamps: timeArray });
    }

    const newKey = generateKeyV4();

    const chat = {
      conversation: conversation_,
      timestamps: timeArray,
      uuid: newKey,
      title: chat_title,
      prompt: active_system_prompt_,
      total_tokens: response.usage.total_tokens,
      lastActive: timeArray[timeArray.length - 1],
      skywayVersion: version_,
    };

    chatSync(chat, previous_uuid, true);

    useStore.setState({
      previous_uuid: newKey,
      scroll_time: true,
      conversation: conversation_,
    });
  };

  const ReSubmitPrompt = () => {
    useStore.setState({ busy_ui: true });
    ResubmitPromptAsync();
  };

  // Handles autoscroll
  useEffect(() => {
    if (scroll_time) {
      useStore.setState({ scroll_time: false });
      conversationScrollRef.current.scrollIntoView({ behaviour: "smooth" });
    }
  }, [scroll_time]);

  // Handles initilization
  useEffect(() => {
    if (!justOnce) {
      setJustOnce(true);
      useStore.setState({
        previous_uuid: "none",
        timestamps: [],
        chat_title: "none",
        conversation: [],
        token_count: 0,
        current_chat: "none",
        busy_ui: false,
        user_message_input: active_system_prompt_.prefill
          ? active_system_prompt_.prefill
          : "",
      });
    }
  }, [justOnce]);

  // Handles reset from [File -> New Chat] / [Ctrl + N]
  useEffect(() => {
    if (chat_reset && !busy_ui) {
      setJustOnce(false);
      useStore.setState({ chat_reset: false });
    }
  }, [chat_reset, busy_ui]);

  // Handles the selection of a previous chat
  useEffect(() => {
    if (chat_open && !busy_ui) {
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

          useStore.setState({
            user_message_input: active_system_prompt_.prefill
              ? active_system_prompt_.prefill
              : "",
          });

          useStore.setState({
            previous_uuid: chats_[i].uuid,
            timestamps: chats_[i].timestamps,
            chat_title: chats_[i].title,
            conversation: chats_[i].conversation,
            token_count: chats_[i].total_tokens,
            prompt_save_status: activeChatInLibrary,
            busy_ui: false,
          });
        }
      }
    }
  }, [chat_open, busy_ui, active_system_prompt_]);

  return (
    <>
      <Middle>
        {conversation.length > 0 &&
          conversation.map((chat, key) => {
            return (
              <React.Fragment key={key}>
                {chat.role !== "system" && (
                  <>
                    {chat.role === "assistant" ? (
                      <LeftBox>
                        <LeftChatBox>
                          <FormattedLeftResponse
                            content={chat.content}
                            color_mode={color_mode}
                          />
                          <Divider />
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <Typography>
                              {isoToHuman(timestamps[key])}
                            </Typography>

                            <CopyToClipboard text={chat.content}>
                              <IconButton size="small">
                                <ContentCopyIcon />
                              </IconButton>
                            </CopyToClipboard>

                            {key === conversation.length - 1 && (
                              <IconButton onClick={ReSubmitPrompt} size="small">
                                <RefreshIcon />
                              </IconButton>
                            )}
                          </Stack>
                        </LeftChatBox>
                      </LeftBox>
                    ) : (
                      <RightBox>
                        <RightChatBox>
                          <FormattedRightResponse
                            content={chat.content}
                            color_mode={color_mode}
                          />
                          <Divider />
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <Typography>
                              {isoToHuman(timestamps[key])}
                            </Typography>

                            <CopyToClipboard text={chat.content}>
                              <IconButton size="small">
                                <ContentCopyIcon />
                              </IconButton>
                            </CopyToClipboard>

                            {key === conversation.length - 2 && (
                              <IconButton size="small" onClick={EditMode}>
                                <EditIcon />
                              </IconButton>
                            )}
                          </Stack>
                        </RightChatBox>
                      </RightBox>
                    )}
                  </>
                )}
              </React.Fragment>
            );
          })}

        <div ref={conversationScrollRef} />
      </Middle>

      <Chatfield />
    </>
  );
};

export { Chatbot };
