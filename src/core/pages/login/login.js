import React, { useState, useEffect } from "react";
//
import { useStore } from "../../zustand";
//
import Prompts from "../../utility/defaultSystemPrompts";
import { seeds } from "../../utility/seeds";
import { generateRandomNumbers } from "../../utility/number";
import { eGet, eSet } from "../../utility/electronStore";
import { decrypt, decryptPrompts, encryptPrompts, encrypt } from "../../utility/encryption";
import { BasicBox, OutlinePaper } from "../../mui/reusable";
import { SeedPaper } from "./login_styles";
//
import { FormControl, TextField, Button, Typography, Box, Stack } from "@mui/material";
// ----------------------------------------------------------------------

const Login = () => {
  // Zustand
  const version = useStore(state => state.version);
  const dev_mode_ = useStore.getState().dev_mode

  // UI Triggers
  const [storePasswordCheck, setStorePasswordCheck] = useState(false);
  const [showKnownPassword, setShowKnownPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showAPI, setShowAPIInput] = useState(false);
  const [showSeed, setShowSeed] = useState(false);
  const [badPassword, setBadPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(false);

  // Input
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordMatchInput, setPasswordMatchInput] = useState("")
  const [apiInput, setAPIInput] = useState("")

  const [seedKey, setSeedKey] = useState("")
  const [seedArray, setSeedArray] = useState("")

  // Helpers
  const handlePasswordInput = (event) => {
    setPasswordInput(event.target.value);
  };

  const handlePasswordMatchInput = (event) => {
    setPasswordMatchInput(event.target.value);
  };

  const handleAPIInput = (event) => {
    setAPIInput(event.target.value);
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

  const clickNewPassword = () => {
    console.log("LOGIN: user has created a password")
    useStore.setState({ password: passwordInput });
    setShowNewPassword(false)
    setShowAPIInput(true)
  }

  const clickAPI = () => {
    console.log("LOGIN: user has entered OpenAI API key")
    const randArray = generateRandomNumbers(0, 2047, 8);
    const key = String(randArray[0] + "x" + randArray[1] + "x" + randArray[2] + "x" + randArray[3] + "x" + randArray[4] + "x" + randArray[5] + "x" + randArray[6] + "x" + randArray[7])
    console.log("LOGIN: random numbers", randArray)
    console.log("LOGIN: KEY", key)
    console.log("LOGIN: seeds", seeds[randArray[0]], seeds[randArray[1]], seeds[randArray[2]], seeds[randArray[3]], seeds[randArray[4]], seeds[randArray[5]], seeds[randArray[6]], seeds[randArray[7]]);

    setSeedKey(key)
    setSeedArray(randArray)
    setShowAPIInput(false)
    setShowSeed(true)
  }

  const clickSeedPhrase = () => {
    console.log("LOGIN: user has finished seed")
    console.log("NAVIGATION: landing")

    const ciphertext = encrypt("skynet", passwordInput).toString();
    const cipherAPI = encrypt(apiInput, passwordInput).toString();
    const encPrompts = encryptPrompts(Prompts, passwordInput)
    const encPass = encrypt(passwordInput, seedKey).toString();

    eSet("recovery", encPass); //
    eSet('password_set', true); //
    eSet("integrity_check", ciphertext) //
    eSet("system_prompts", encPrompts) //
    eSet("chats", []);
    eSet('open_ai_api_keys', [{ key: cipherAPI, name: "default" }]) //

    useStore.setState({
      password: passwordInput,
      system_prompts: Prompts,
      color_mode: "light",
      open_ai_api_keys: [{ key: apiInput, name: "default" }],
      open_ai_api_key: 0,
      active_system_prompt: Prompts[0],
      last_prompt: 0,
      page: "chatbot",
    });
  };

  //

  useEffect(() => {
    const getVersion = async () => {
      const version = await window.electron.engine.version();
      useStore.setState({ version: version })
    }

    if (!storePasswordCheck) {
      const _password_set = eGet('password_set');
      getVersion();

      if (_password_set) {
        console.log("LOGIN: user has logged in before")
        const _color_mode = eGet("color_mode")
        useStore.setState({ color_mode: _color_mode === "light" ? "light" : "dark" })
        setShowKnownPassword(true)
      } else {
        console.log("LOGIN: user has not logged in before")
        setShowNewPassword(true)
      };

      setStorePasswordCheck(true)
    }
  }, [storePasswordCheck])

  useEffect(() => {
    if (passwordInput !== "" && passwordMatchInput !== "" && passwordInput === passwordMatchInput) {
      setPasswordMatch(true)
    } else {
      setPasswordMatch(false)
    }
  }, [passwordInput, passwordMatchInput])

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

        {showKnownPassword && <OutlinePaper>
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
                  onKeyPress={(ev) => {
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
        </OutlinePaper>}

        {showNewPassword && <OutlinePaper>
          <Stack direction="column" spacing={1}>
            <Typography variant="h4">
              Welcome! Create a Password to begin:
            </Typography>
            <Box>
              <FormControl>
                <TextField
                  id="user-input"
                  label="password"
                  variant="filled"
                  color="secondary"
                  value={passwordInput}
                  onChange={handlePasswordInput}
                  required={true}
                  type="password"
                  autoFocus
                  onKeyPress={(ev) => {
                    if (ev.key === 'Enter' && passwordMatch) {
                      clickNewPassword();
                      ev.preventDefault();
                    }
                  }}
                />
                <TextField
                  id="user-input2"
                  label="confirm password"
                  variant="filled"
                  color="secondary"
                  value={passwordMatchInput}
                  onChange={handlePasswordMatchInput}
                  required={true}
                  type="password"
                  onKeyPress={(ev) => {
                    if (ev.key === 'Enter' && passwordMatch) {
                      clickNewPassword();
                      ev.preventDefault();
                    }
                  }}
                />
                <Button
                  color={"secondary"}
                  variant="outlined"
                  disabled={!passwordMatch}
                  onClick={clickNewPassword}
                >
                  Save Password
                </Button>
              </FormControl>
            </Box>
          </Stack>
        </OutlinePaper>}

        {showAPI && <OutlinePaper>
          <Typography variant="h6">
            If you need an OpenAI API Key:
          </Typography>
          <Typography variant="body1">
            Sign up for an account with OpenAI.
            Add a form of payment.
            Got to the user settings page and select the "API keys" section.
            Create a new API key, and copy and paste it to someplace safe.
            After you have saved the key somewhere, you are ready to paste it here and continue.
          </Typography>
        </OutlinePaper>}

        {showAPI && <OutlinePaper>
          <FormControl>
            <Stack direction="row" spacing={1}>
              <TextField
                id="user-input3"
                label="Paste OpenAI API Key"
                variant="filled"
                color="secondary"
                value={apiInput}
                onChange={handleAPIInput}
                required={true}
                type="password"
                autoFocus
                fullWidth
                onKeyPress={(ev) => {
                  if (ev.key === 'Enter' && apiInput !== "") {
                    clickAPI();
                    ev.preventDefault();
                  }
                }}
              />
              <Button
                color={"secondary"}
                variant="outlined"
                disabled={apiInput === ""}
                onClick={clickAPI}
              >
                Save OpenAI API Key
              </Button>
            </Stack>
          </FormControl>
        </OutlinePaper>}

        {showSeed && <>
          <OutlinePaper>
            <Stack direction="column" spacing={1}>
              <Typography variant="h4">
                Seed Phrase 101:
              </Typography>
              <Typography>
                A seed phrase is a series of words that unlocks your Skyway data and Skyway password. It works like a master password that can help you recover your app and password if you ever forget them or lose your device.
              </Typography>
              <Typography>
                To safely store your seed phrase, you should write it down on a piece of paper and keep it in a secure place that only you know. You should not share your seed phrase with anyone or store it online, as this could expose your app and password to hackers or thieves.
              </Typography>
            </Stack>
          </OutlinePaper>


          <OutlinePaper>
            <Stack direction="row" spacing={1}>
              <Typography variant="h4">
                WARNING:
              </Typography>
              <Typography>
                Once you click away, you will never be able to retrieve this seed phrase again. Please store it safely before clicking CONTINUE.
              </Typography>
            </Stack>

          </OutlinePaper>

          <OutlinePaper>
            <Stack direction="row" spacing={1}>
              <Typography variant="h4">Your Seed Phrase:</Typography>
              <SeedPaper>
                <Typography>
                  {seeds[seedArray[0]]} {seeds[seedArray[1]]} {seeds[seedArray[2]]} {seeds[seedArray[3]]} {seeds[seedArray[4]]} {seeds[seedArray[5]]} {seeds[seedArray[6]]} {seeds[seedArray[7]]}
                </Typography>
              </SeedPaper>
              <Button
                color={"secondary"}
                variant="outlined"
                onClick={clickSeedPhrase}
              >
                Continue
              </Button>
            </Stack>
          </OutlinePaper>
        </>}

      </Stack>
    </BasicBox >
  );
};

export default Login;