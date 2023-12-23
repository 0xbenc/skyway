import React, { useState, useEffect } from "react";
//
import { useStore } from "../../zustand";
//
import { Prompts } from "../../utility/defaultSystemPrompts";
import { seeds } from "../../utility/seeds";
import { generateRandomNumbers } from "../../utility/number";
import { eSet } from "../../utility/electronStore";
import { encryptPrompts, encrypt } from "../../utility/encryption";
import { BasicBox, OutlinePaper, SeedPaper } from "../../mui/reusable";
import { fetchChatCompletionConnectionTest } from "../../utility/fetchData";
//
import {
  FormControl,
  TextField,
  Button,
  Typography,
  Box,
  Stack,
  Tooltip
} from "@mui/material";
//
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
// ----------------------------------------------------------------------

const Setup = () => {
  // Zustand
  const version = useStore(state => state.version);
  const dev_mode_ = useStore.getState().dev_mode

  // UI Triggers
  const [showNewPassword, setShowNewPassword] = useState(true);
  const [showAPI, setShowAPIInput] = useState(false);
  const [showSeed, setShowSeed] = useState(false);
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

  const clickNewPassword = () => {
    console.log("LOGIN: user has created a password")
    useStore.setState({ password: passwordInput });
    setShowNewPassword(false)
    setShowAPIInput(true)
  }

  const clickAPI = async () => {
    console.log("LOGIN: user has entered OpenAI API key")

    const randArray = generateRandomNumbers(0, 2047, 8);

    const key = String(
      randArray[0] + "x" + randArray[1] + "x" + randArray[2] + "x" +
      randArray[3] + "x" + randArray[4] + "x" + randArray[5] + "x" +
      randArray[6] + "x" + randArray[7]
    )

    console.log("LOGIN: random numbers", randArray)
    console.log("LOGIN: KEY", key)

    console.log(
      "LOGIN: seeds", seeds[randArray[0]], seeds[randArray[1]],
      seeds[randArray[2]], seeds[randArray[3]], seeds[randArray[4]],
      seeds[randArray[5]], seeds[randArray[6]], seeds[randArray[7]]
    );

    useStore.setState({
      open_ai_api_keys: [{ key: apiInput, name: "default" }],
      open_ai_api_key: 0
    });

    const resultValue = await fetchChatCompletionConnectionTest();

    if (resultValue === "success") {
      setSeedKey(key);
      setSeedArray(randArray);
      setShowAPIInput(false);
      setShowSeed(true);
    } else {
      setAPIInput("");
      useStore.getState().addNotification("Please enter a valid OpenAI API key");
    };
  };

  const clickSeedPhrase = () => {
    console.log("LOGIN: user has finished seed")
    console.log("NAVIGATION: landing")

    const ciphertext = encrypt("skynet", passwordInput).toString();
    const cipherAPI = encrypt(apiInput, passwordInput).toString();
    const encPrompts = encryptPrompts(Prompts, passwordInput)
    const encPass = encrypt(passwordInput, seedKey).toString();
    const currColor = useStore.getState().color_mode;
    console.log(currColor)

    eSet("recovery", encPass); //
    eSet('password_set', true); //
    eSet("integrity_check", ciphertext) //
    eSet("system_prompts", encPrompts) //
    eSet("chats", []);
    eSet('open_ai_api_keys', [{ key: cipherAPI, name: "default" }]) //
    eSet('color_mode', currColor)

    useStore.setState({
      password: passwordInput,
      system_prompts: Prompts,
      color_mode: "currColor",
      active_system_prompt: Prompts[0],
      last_prompt: 0,
      page: "chatbot",
      color_mode: currColor
    });
  };

  //
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

        {showNewPassword && <OutlinePaper>
          <Stack direction="column" spacing={1}>
            <Stack direction="row" spacing={1}>
              <Typography variant="h5">
                Welcome! Create a password to begin.
              </Typography>
              <Tooltip title="The password you create is used to encrypt your local chat data. It is never sent to the internet, or stored in plaintext.">
                <HelpOutlineIcon size="small" />
              </Tooltip>
            </Stack>

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
                  onKeyDown={(ev) => {
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
                  onKeyDown={(ev) => {
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
          <Stack direction="column" spacing={3} >
            <Stack direction="row" justifyContent="flex-start" alignItems="center">
              <Typography variant="h5">
                If you need an OpenAI API Key
              </Typography>
              <Tooltip
                title='Sign up for an account with OpenAI. Add a form of payment.
                Got to the user settings page and select the "API keys" section.
                Create a new API key, copy and paste.'
              >
                <HelpOutlineIcon size="small" />
              </Tooltip>
            </Stack>
            <FormControl>
              <Stack direction="row" spacing={3} >
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
                  Save
                </Button>
              </Stack>
            </FormControl>
          </Stack>
        </OutlinePaper>}

        {showSeed && <>
          <OutlinePaper>
            <Stack direction="column" spacing={1}>
              <Typography variant="h5">
                Seed Phrase 101:
              </Typography>
              <Typography>
                A seed phrase is a series of words that unlocks your Skyway data
                and Skyway password. It works like a master password that
                can help you recover your app and password if you ever forget.
                To safely store your seed phrase, you should write it down on a
                piece of paper and keep it in a secure place that only you know.
              </Typography>
            </Stack>
          </OutlinePaper>

          <OutlinePaper>
            <Stack direction="row" spacing={1} alignItems={"center"}>
              <Typography variant="h5">
                WARNING!
              </Typography>
              <Typography>
                Once you click away, you will never be able to retrieve this
                seed phrase again.
              </Typography>
            </Stack>
          </OutlinePaper>

          <OutlinePaper>
            <Stack direction="row" spacing={1} alignItems={"center"}>
              <Typography variant="h5">Your Seed Phrase:</Typography>
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

export { Setup };
