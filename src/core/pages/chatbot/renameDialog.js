import React from "react";
//
import { useStore } from "../../zustand";
//
import { chatSync } from "./chatbot_utility";
//
import { Button } from "@mui/material";
import { Dialog, DialogTitle, FormControl, TextField, DialogContent, DialogActions } from "@mui/material";
// ----------------------------------------------------------------------

const RenameDialog = () => {
  const chats = useStore(state => state.chats);
  const rename_dialog_open = useStore(state => state.rename_dialog_open);
  const rename_dialog_input = useStore(state => state.rename_dialog_input);
  const rename_dialog_index = useStore(state => state.rename_dialog_index);

  const handleRenameDialogCloseOut = () => {
    useStore.setState({
      rename_dialog_input: "",
      rename_dialog_open: false
    });
  };

  const handleRenameDialogSave = () => {
    let newChats = [...chats];

    newChats[rename_dialog_index].title = rename_dialog_input;

    chatSync(
      newChats[rename_dialog_index],
      newChats[rename_dialog_index].uuid,
      false
    );

    useStore.setState({ rename_dialog_open: false });
  };

  const handleRenameDialogInput = (e) => {
    useStore.setState({ rename_dialog_input: e.target.value })
  };

  return (
    <Dialog fullWidth onClose={handleRenameDialogCloseOut} open={rename_dialog_open}>
      <DialogTitle>Rename your chat</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <TextField
            id="rename-zone"
            label="Chat Title"
            variant="filled"
            value={rename_dialog_input}
            onChange={handleRenameDialogInput}
            required={true}
            fullWidth
          >
          </TextField>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          variant="text"
          color="secondary"
          onClick={handleRenameDialogCloseOut}
        >
          Cancel
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleRenameDialogSave}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export { RenameDialog };
