import React, { useEffect, useState } from "react";
import bcrypt from "bcryptjs-react";
//
import { useStore } from "../../zustand";
//
import { eGet, eSet } from "../../utility/electronStore";
import { decrypt, decryptPrompts } from "../../utility/encryption";
import { BasicBox, OutlinePaper } from "../../mui/reusable";
//
import { FormControl, TextField, Button, Typography, Stack, CircularProgress, IconButton, Tooltip } from "@mui/material";
// ----------------------------------------------------------------------
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
// ----------------------------------------------------------------------

const Login = () => {
  // Zustand
  const version = useStore(state => state.version);
  const dev_mode_ = useStore.getState().dev_mode

  // UI Triggers
  const [badPassword, setBadPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [storeAccessTime, setStoreAccessTime] = useState(false);
  const [passwordCheckTime, setPasswordCheckTime] = useState(false);

  // From electron store
  const [integrityCheck, setIntegrityCheck] = useState("");
  const [hasMigrated, setHasMigrated] = useState(false);

  // Input
  const [passwordInput, setPasswordInput] = useState("");

  // Helpers
  const handlePasswordInput = (event) => {
    setPasswordInput(event.target.value);
  };

  const clickSinglePassword = () => {
    setBadPassword(false);
    setLoading(true);
    setStoreAccessTime(true);
  };

  useEffect(() => {
    if (storeAccessTime) {
      setStoreAccessTime(false);

      const _integrity_check = eGet('integrity_check');
      const _migration_1_3_1_bcrypt = eGet('migration_1_3_1_bcrypt');

      setIntegrityCheck(_integrity_check);
      setHasMigrated(_migration_1_3_1_bcrypt);

      setPasswordCheckTime(true);
    }
  }, [storeAccessTime]);

  useEffect(() => {
    if (passwordCheckTime) {
      let outcome = false;

      // Handles the switch from storing AES check of "skynet" to proper blowfish with salt
      if (hasMigrated) {
        const integrity_check = decrypt(integrityCheck, passwordInput);

        if (integrity_check === "skynet") {
          var salt = bcrypt.genSaltSync(16);
          var hash = bcrypt.hashSync(passwordInput, salt);
          eSet("integrity_check", hash);
          eSet("migration_1_3_1_bcrypt", false);
          outcome = true;
        };
      } else {
        outcome = bcrypt.compareSync(passwordInput, integrityCheck);
      };

      if (outcome) {
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
        setPasswordCheckTime(false);
        setLoading(false);
        setPasswordInput("");
        useStore.getState().addNotification("Incorrect Password");
      };
    }
  }, [passwordCheckTime, integrityCheck, hasMigrated]);

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
              <Stack direction="row" spacing={1} alignItems="center">
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
                    };
                  }}
                  required={true}
                  type={showPassword ? "text" : "password"}
                  autoFocus
                />
                {!loading && <Tooltip title="toggle password visibility">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </Tooltip>}
                {loading && <CircularProgress size="2rem" color="secondary" />}
              </Stack>
              {!loading && <Button
                color={"secondary"}
                variant="outlined"
                disabled={passwordInput === ""}
                onClick={clickSinglePassword}
              >
                Login
              </Button>}
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
