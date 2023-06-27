import React, { useState } from "react";
import { Typography, FormControl, TextField, Button, Stack } from "@mui/material";
import { BackPaper, OutPaper } from "../../mui/reusable";
import { navigate } from "../../utility/navigatePage";
import { useStore } from "../../zustand";
import { encrypt } from "../../utility/encryption";

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
    <BackPaper>
      <Stack direction="column" spacing={1}>
        <OutPaper>
          <Typography variant="h2">
            Change API Key
          </Typography>
        </OutPaper>

        <OutPaper>
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
        </OutPaper>
        <OutPaper>
          <Button
            color={"secondary"}
            variant="outlined"
            onClick={() => { navigate("landing") }}
            fullWidth={false}
          >
            Cancel
          </Button>
        </OutPaper>
      </Stack>
    </BackPaper>
  );
};

export default ChangeAPIKey;