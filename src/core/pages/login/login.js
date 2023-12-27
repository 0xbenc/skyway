import React, { useState } from "react";
//
import { useStore } from "../../zustand";
//
import { eGet } from "../../utility/electronStore";
import { decrypt, decryptPrompts } from "../../utility/encryption";
import { BasicBox, OutlinePaper } from "../../mui/reusable";
//
import { FormControl, TextField, Button, Typography, Stack } from "@mui/material";
// ----------------------------------------------------------------------

const Login = () => {
  // Zustand
  const version = useStore(state => state.version);
  const dev_mode_ = useStore.getState().dev_mode

  // UI Triggers
  const [badPassword, setBadPassword] = useState(false);

  // Input
  const [passwordInput, setPasswordInput] = useState("");

  // Helpers
  const handlePasswordInput = (event) => {
    setPasswordInput(event.target.value);
  };

  const clickSinglePassword = () => {
    const _integrity_check = eGet('integrity_check')

    const integrity_check = decrypt(_integrity_check, passwordInput);

    if (integrity_check === "skynet") {
      const _system_prompts = eGet("system_prompts")
      const _open_ai_api_key = eGet("open_ai_api_key")
      const _open_ai_api_keys = eGet("open_ai_api_keys")
      const last_prompt = eGet('last_prompt');
      const chats = eGet('chats');

      let dencChats;

      if (chats.length === 0) {
        dencChats = [];
      } else {
        dencChats = JSON.parse(decrypt(chats, passwordInput));
      };

      const dencPrompts = decryptPrompts(_system_prompts, passwordInput);

      let decryptedKeys = [];

      for (let i = 0; i < _open_ai_api_keys.length; i++) {
        decryptedKeys.push({ key: decrypt(_open_ai_api_keys[i].key, passwordInput), name: _open_ai_api_keys[i].name })
      };

      setBadPassword(false)

      useStore.setState({
        system_prompts: dencPrompts,
        open_ai_api_key: _open_ai_api_key,
        open_ai_api_keys: decryptedKeys,
        password: passwordInput,
        last_prompt: last_prompt,
        active_system_prompt: dencPrompts[last_prompt],
        page: "chatbot",
        chats: dencChats ? dencChats : []
      })
    } else {
      console.log("LOGIN: ERROR: password decryption unsuccessful");
      setBadPassword(true);
      useStore.getState().addNotification("Incorrect Password");
    };
  };

  return (
    <BasicBox>
      <Stack direction="column" spacing={1}>
        <OutlinePaper>
          <Typography variant="h1">
            Skyway
          </Typography>
          <Typography variant="body1">
            v{version} {dev_mode_ ? "pre-release" : ""}
          </Typography>
        </OutlinePaper>

        <OutlinePaper>
          <FormControl>
            <Stack direction="column" spacing={1}>
              <Typography variant="h4">
                Enter Password:
              </Typography>
              <Stack direction="row" spacing={1}>
                <TextField
                  id="user-input"
                  label="password"
                  variant="outlined"
                  color="secondary"
                  value={passwordInput}
                  onChange={handlePasswordInput}
                  onKeyDown={(ev) => {
                    if (ev.key === 'Enter' && passwordInput !== "") {
                      clickSinglePassword();
                      ev.preventDefault();
                    }
                  }}
                  required={true}
                  type="password"
                  autoFocus
                />
                <Button
                  color={"secondary"}
                  variant="outlined"
                  disabled={passwordInput === ""}
                  onClick={clickSinglePassword}
                >
                  Login
                </Button>
              </Stack>
              {badPassword && <Button
                color={"secondary"}
                variant="outlined"
                onClick={() => { useStore.setState({ page: "recovery" }) }}
              >
                Recover Password
              </Button>}
            </Stack>
          </FormControl>
        </OutlinePaper>
      </Stack>
    </BasicBox >
  );
};

export { Login };
