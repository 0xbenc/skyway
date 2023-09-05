import React, { useState } from "react";
//
import { seeds } from "../../utility/seeds";
import { navigate } from "../../utility/navigatePage";
import { decrypt } from "../../utility/encryption";
import { BasicBox, OutlinePaper } from "../../mui/reusable";
import { eGet } from "../../utility/electronStore";
//
import { Typography, FormControl, TextField, Button, Stack } from "@mui/material";
// ----------------------------------------------------------------------

const Recovery = () => {
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordOutput, setPasswordOutput] = useState("");
  const [bad, setBad] = useState("");

  const handlePasswordInput = (event) => {
    setPasswordInput(event.target.value);
  };

  const convertKey = () => {
    const splitKey = String(passwordInput).split(" ");
    const nums = [];
    let key = "";

    for (let i = 0; i < splitKey.length; i++) {
      nums.push(seeds.indexOf(splitKey[i]));
    };

    for (let e = 0; e < nums.length; e++) {
      key += nums[e];
      if (e !== nums.length - 1) {
        key += "x";
      };
    };

    const _recovery = eGet("recovery")
    const _integrity_check = eGet("integrity_check")

    const recovery = decrypt(_recovery, key)
    const integrity_check = decrypt(_integrity_check, recovery)

    if (integrity_check === "skynet") {
      setPasswordOutput(recovery)
      setBad(false)
    } else {
      setBad(true)
      setPasswordOutput("")
    }
  };

  return (
    <BasicBox>
      <Stack direction="column" spacing={1}>
        <OutlinePaper>
          <Typography variant="h2">
            Password Recovery
          </Typography>
        </OutlinePaper>

        <OutlinePaper>
          <Stack direction="column" spacing={1}>
            <Typography>Enter every word of your seed phrase, all lowercase, separated by spaces, no space at the end.</Typography>
            <FormControl>
              <Stack direction="row" spacing={1}>
                <TextField
                  id="user-input"
                  label="Seed Phrase"
                  variant="filled"
                  color="secondary"
                  value={passwordInput}
                  onChange={handlePasswordInput}
                  required={true}
                  autoFocus
                  fullWidth={true}
                />
                <Button
                  color={"secondary"}
                  variant="outlined"
                  disabled={passwordInput === ""}
                  onClick={convertKey}
                  fullWidth={false}
                >
                  Recover Password
                </Button>
              </Stack>
            </FormControl>
          </Stack>
        </OutlinePaper>
        {(bad || passwordOutput !== "") && <OutlinePaper>
          {passwordOutput !== "" && <Typography variant="body">
            Password: {passwordOutput}
          </Typography>}
          {bad && <Typography variant="body">
            Incorrect Seed Phrase
          </Typography>}
        </OutlinePaper>}
        <OutlinePaper>
          <Button
            color={"secondary"}
            variant="outlined"
            onClick={() => {navigate("login")}}
            fullWidth={false}
          >
            Return to Login
          </Button>
        </OutlinePaper>
      </Stack>
    </BasicBox>
  );
};

export default Recovery;