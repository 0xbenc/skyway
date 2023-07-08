import React, { useState, useEffect } from "react";
//
import { useStore } from "../../zustand";
//
import Prompts from "../../utility/defaultSystemPrompts";
import { seeds } from "../../utility/seeds";
import { generateRandomNumbers } from "../../utility/number";
import { decrypt, decryptPrompts, encryptPrompts, encrypt } from "../../utility/encryption";
//
import { FormControl, TextField, Button, Typography, Box, Stack } from "@mui/material";
//
import { BasicBox, OutlinePaper } from "../../mui/reusable";
import { SeedPaper } from "./login_styles";

// ----------------------------------------------------------------------

const Login = () => {
  // Zustand
  const version = useStore(state => state.version);
  const devMode_ = useStore.getState().devMode

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
    const _integrity_check = window.electron.store.get('integrity_check')

    const integrity_check = decrypt(_integrity_check, passwordInput);

    if (integrity_check === "skynet") {
      const _system_prompts = window.electron.store.get("system_prompts")
      const _open_ai_api_key = window.electron.store.get("open_ai_api_key")

      const dencPrompts = decryptPrompts(_system_prompts, passwordInput)
      const open_ai_api_key = decrypt(_open_ai_api_key, passwordInput)

      setBadPassword(false)

      useStore.setState({
        system_prompts: dencPrompts,
        open_ai_api_key: open_ai_api_key,
        page: "landing",
        password: passwordInput
      })

      console.log("NAVIGATION: landing")
    } else {
      console.log("LOGIN: ERROR: password decryption unsuccessful");
      setBadPassword(true)
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

    window.electron.store.set("recovery", encPass)
    window.electron.store.set('password_set', true);
    window.electron.store.set("integrity_check", ciphertext)
    window.electron.store.set("system_prompts", encPrompts)
    window.electron.store.set("color_mode", "light")
    window.electron.store.set('open_ai_api_key', cipherAPI)

    useStore.setState({
      password: passwordInput,
      system_prompts: Prompts,
      color_mode: "light",
      page: "landing",
      open_ai_api_key: apiInput
    });
  };

  //

  useEffect(() => {
    const getVersion = async () => {
      const version = await window.electron.engine.version();
      useStore.setState({ version: version })
    }

    if (!storePasswordCheck) {
      const _password_set = window.electron.store.get('password_set');
      getVersion();

      if (_password_set) {
        console.log("LOGIN: user has logged in before")
        const _color_mode = window.electron.store.get("color_mode")
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
            v{version} {devMode_ ? "pre-release" : ""}
          </Typography>
        </OutlinePaper>

        {showKnownPassword && <OutlinePaper>
          <FormControl>
            <Stack direction="column" spacing={1}>
              <Typography variant="h4">
                Enter Password:
              </Typography>
              {badPassword && <Typography variant="h6">
                Incorrect Password, Try Again:
              </Typography>}
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
                  focused
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
                  focused
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
                focused
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