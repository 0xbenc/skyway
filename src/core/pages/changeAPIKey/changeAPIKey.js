import React, { useState } from "react";
//
import { useStore } from "../../zustand";
//
import { navigate } from "../../utility/navigatePage";
import { encrypt } from "../../utility/encryption";
//
import { Typography, FormControl, TextField, Button, Stack } from "@mui/material";
//
import { BasicBox, OutlinePaper } from "../../mui/reusable";

// ----------------------------------------------------------------------

const ChangeAPIKey = () => {
  const [passwordInput, setPasswordInput] = useState("");

  const handlePasswordInput = (event) => {
    setPasswordInput(event.target.value);
  };

  const changeAPI = () => {
    const password_ = useStore.getState().password;

    useStore.setState({ open_ai_api_key: passwordInput });

    const encPassword = encrypt(passwordInput, password_);

    window.electron.store.set("open_ai_api_key", encPassword);

    navigate("landing");
  };

  return (
    <BasicBox>
      <Stack direction="column" spacing={1}>
        <OutlinePaper>
          <Typography variant="h2">
            Change API Key
          </Typography>
        </OutlinePaper>

        <OutlinePaper>
          <Stack direction="column" spacing={1}>
            <Typography>Enter new OpenAI API key</Typography>
            <FormControl>
              <Stack direction="row" spacing={1}>
                <TextField
                  id="user-input"
                  label="OpanAI API Key"
                  variant="filled"
                  color="secondary"
                  value={passwordInput}
                  onChange={handlePasswordInput}
                  required={true}
                  focused
                  autoFocus
                  fullWidth={true}
                />
                <Button
                  color={"secondary"}
                  variant="outlined"
                  disabled={passwordInput === ""}
                  onClick={changeAPI}
                  fullWidth={false}
                >
                  Change API Key
                </Button>
              </Stack>
            </FormControl>
          </Stack>
        </OutlinePaper>
        <OutlinePaper>
          <Button
            color={"secondary"}
            variant="outlined"
            onClick={() => { navigate("landing") }}
            fullWidth={false}
          >
            Cancel
          </Button>
        </OutlinePaper>
      </Stack>
    </BasicBox>
  );
};

export default ChangeAPIKey;