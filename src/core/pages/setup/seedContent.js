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
    </>
  );
};

export { SeedContent };
