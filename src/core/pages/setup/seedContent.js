import React from "react";
//
import { OutlinePaper } from "../../mui/reusable";
//
import { Typography, Stack } from "@mui/material";
// ----------------------------------------------------------------------

const SeedContent = () => {
  return (
    <>
      <OutlinePaper>
        <Stack direction="column" spacing={1}>
          <Typography variant="h5">Seed Phrase 101:</Typography>
          <Typography>
            Your Skyway seed phrase serves as a backup in case you forget your
            password. Your seed phrase is specific to the computer you install
            Skyway on. This process does not involve the internet. Safe methods
            to store your seed phrase include writing it down on a piece of
            paper or taking a picture on a secure device.
          </Typography>
        </Stack>
      </OutlinePaper>

      <OutlinePaper>
        <Stack direction="row" spacing={1} alignItems={"center"}>
          <Typography variant="h5">WARNING!</Typography>
          <Typography>
            Once you click away, you will never be able to retrieve this seed
            phrase again.
          </Typography>
        </Stack>
      </OutlinePaper>
    </>
  );
};

export { SeedContent };
