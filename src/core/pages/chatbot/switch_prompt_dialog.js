import React from "react";
//
import { useStore } from "../../zustand";
//
import { OutlinePaper } from "../../mui/reusable";
import { chatSelect } from "./chatbot_utility";
//
import {
  Typography,
  Stack,
  Button,
} from "@mui/material";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
// ----------------------------------------------------------------------

const SwitchPromptDialog = () => {
  const switch_prompt_dialog_open = useStore(state => state.switch_prompt_dialog_open);
  const system_prompts_ = useStore.getState().system_prompts;

  const switchPromptClose = () => {
    useStore.setState({ switch_prompt_dialog_open: false })
  };

  return (
    <>
      <Dialog fullWidth onClose={switchPromptClose} open={switch_prompt_dialog_open}>
        <DialogTitle>Choose another prompt</DialogTitle>
        <DialogContent>
          <Stack direction="row" spacing={1}>
            {system_prompts_.map((prompt, key) => {
              return (
                <OutlinePaper key={key} onClick={() => { chatSelect(key, system_prompts_) }}>
                  <Typography variant="h6">{prompt.title}</Typography>
                  <Stack direction="row" spacing={1}>
                    <Typography variant="body2">{prompt.model} |</Typography>
                    <Typography variant="body2">{prompt.engine}</Typography>
                  </Stack>
                </OutlinePaper>
              )
            })}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            variant="text"
            color="secondary"
            onClick={switchPromptClose}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SwitchPromptDialog;
