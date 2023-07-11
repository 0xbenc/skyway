import React, { useState } from "react";
//
import { useStore } from "../../zustand";
//
import { encrypt } from "../../utility/encryption";
//
import {
  Typography,
  FormControl,
  TextField,
  Button,
  Stack,
  Box,
  IconButton,
  Chip
} from "@mui/material";
//
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LaunchIcon from '@mui/icons-material/Launch';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
//
import { BasicBox, OutlinePaper } from "../../mui/reusable";
import { eSet } from "../../utility/electronStore";
import Title from "../../components/title";

// ----------------------------------------------------------------------

const ChangeAPIKey = () => {
  const open_ai_api_key = useStore(state => state.open_ai_api_key);
  const open_ai_api_keys = useStore(state => state.open_ai_api_keys);

  const [editKey, setEditKey] = useState(-1);

  const [keyInput, setKeyInput] = useState("");
  const handleKeyInput = (event) => {
    setKeyInput(event.target.value);
  };

  const [nameInput, setNameInput] = useState("");
  const handleNameInput = (event) => {
    setNameInput(event.target.value);
  };

  const [editKeyInput, setEditKeyInput] = useState("");
  const handleEditKeyInput = (event) => {
    setEditKeyInput(event.target.value);
  };

  const [editNameInput, setEditNameInput] = useState("");
  const handleEditNameInput = (event) => {
    setEditNameInput(event.target.value);
  };

  const passwordStyle = (input) => "*".repeat(String(input).length);

  const deleteKey = (key) => {
    const password_ = useStore.getState().password;

    let newArr = [];
    let newArrEnc = [];

    for (let i = 0; i < open_ai_api_keys.length; i++) {
      if (i !== key) {
        newArr.push(open_ai_api_keys[i]);
        newArrEnc.push({
          name: open_ai_api_keys[i].name,
          key: encrypt(open_ai_api_keys[i].key, password_)
        });
      };
    };

    useStore.setState({ open_ai_api_keys: newArr, open_ai_api_key: 0 });
    eSet("open_ai_api_keys", newArrEnc);
    eSet("open_ai_api_key", 0);

    console.log("API KEY: deleted key")
  };

  const selectKey = (key) => {
    useStore.setState({ open_ai_api_key: key })
    eSet("open_ai_api_key", key)
    console.log("API KEY: selected key")
  };

  const addKey = () => {
    const password_ = useStore.getState().password;

    let newArr = [];
    let newArrEnc = [];

    for (let i = 0; i < open_ai_api_keys.length; i++) {
      newArr.push(open_ai_api_keys[i]);
      newArrEnc.push({
        name: open_ai_api_keys[i].name,
        key: encrypt(open_ai_api_keys[i].key, password_)
      })
    };

    newArr.push({ name: nameInput, key: keyInput });
    newArrEnc.push({
      name: nameInput,
      key: encrypt(keyInput, password_)
    });

    useStore.setState({
      open_ai_api_keys: newArr,
      open_ai_api_key: newArr.length - 1
    });

    eSet("open_ai_api_keys", newArrEnc);
    eSet("open_ai_api_key", newArr.length - 1);

    setNameInput("");
    setKeyInput("");
    setEditNameInput("");
    setEditKeyInput("");

    console.log("API KEY: added key")
  };

  const openEditKey = (key) => {
    setEditKey(key);
    setEditNameInput(open_ai_api_keys[key].name)
    setEditKeyInput(open_ai_api_keys[key].key)
  };

  const closeEditKey = () => {
    setEditKey(-1);
    setEditKeyInput("");
    setEditNameInput("");
  };

  const saveEditKey = (key) => {
    const password_ = useStore.getState().password;

    let newArr = [];
    let newArrEnc = [];

    for (let i = 0; i < open_ai_api_keys.length; i++) {
      if (i !== key) {
        newArr.push(open_ai_api_keys[i])
        newArrEnc.push({
          name: open_ai_api_keys[i].name,
          key: encrypt(open_ai_api_keys[i].key, password_)
        })
      } else {
        newArr.push({ name: editNameInput, key: editKeyInput });
        newArrEnc.push({
          name: editNameInput,
          key: encrypt(editKeyInput, password_)
        });
      }
    }

    useStore.setState({ open_ai_api_keys: newArr, });

    eSet("open_ai_api_keys", newArrEnc);

    setNameInput("");
    setKeyInput("");
    setEditNameInput("");
    setEditKeyInput("");
    setEditKey(-1);

    console.log("API KEY: adjusted key")
  };

  return (
    <BasicBox>
      <Stack direction="column" spacing={1}>
        <Title value={"Change API Key"} />

        <OutlinePaper>
          <Stack direction="column" spacing={1}>
            <Typography>New API Key</Typography>
            <FormControl>
              <Stack direction="row" spacing={1}>
                <TextField
                  id="user-input2"
                  label="Preset Name"
                  variant="filled"
                  color="secondary"
                  value={nameInput}
                  onChange={handleNameInput}
                  required={true}
                  autoFocus
                  fullWidth={true}
                />
                <TextField
                  id="user-input"
                  label="OpenAI API Key"
                  variant="filled"
                  color="secondary"
                  value={keyInput}
                  onChange={handleKeyInput}
                  required={true}
                  fullWidth={true}
                />
                <Button
                  color={"secondary"}
                  variant="outlined"
                  disabled={keyInput === "" || nameInput === ""}
                  onClick={addKey}
                  fullWidth={false}
                >
                  Change API Key
                </Button>
              </Stack>
            </FormControl>
          </Stack>
        </OutlinePaper>

        <OutlinePaper>
          <Stack direction="column" spacing={1}>
            <Typography>Stored Keys</Typography>

            {open_ai_api_keys.map((chat, key) => {
              return (
                <OutlinePaper key={key}>
                  <Stack direction="row" spacing={1}>
                    {key !== editKey && <>
                      <Typography variant="h6">{chat.name}</Typography>
                      <OutlinePaper>
                        <Typography variant="body1">{passwordStyle(chat.key)}</Typography>
                      </OutlinePaper>
                      {key > 0 && <Box>
                        <IconButton onClick={() => { deleteKey(key) }}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>}
                      <Box>
                        <IconButton onClick={() => { openEditKey(key) }}>
                          <EditIcon />
                        </IconButton>
                      </Box>
                      {key !== open_ai_api_key && <Box>
                        <IconButton onClick={() => { selectKey(key) }}>
                          <LaunchIcon />
                        </IconButton>
                      </Box>}
                      {key === open_ai_api_key && <Chip label="selected" />}
                    </>}
                    {key === editKey && <>
                      <FormControl>
                        <Stack direction="row" spacing={1}>
                          <TextField
                            id="user-input3"
                            label="Name"
                            variant="filled"
                            color="secondary"
                            value={editNameInput}
                            onChange={handleEditNameInput}
                            required={true}
                            fullWidth={true}
                          />
                          <TextField
                            id="user-input4"
                            label="OpenAI API Key"
                            variant="filled"
                            color="secondary"
                            value={editKeyInput}
                            onChange={handleEditKeyInput}
                            required={true}
                            fullWidth={true}
                          />
                          <IconButton onClick={closeEditKey}>
                            <CancelIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => { saveEditKey(key) }}
                            disabled={editNameInput === "" || editKeyInput === ""}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        </Stack>
                      </FormControl>
                    </>}
                  </Stack>
                </OutlinePaper>
              )
            })}
          </Stack>
        </OutlinePaper>
      </Stack>
    </BasicBox>
  );
};

export default ChangeAPIKey;