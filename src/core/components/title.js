import React from "react";
//
import { navigate } from "../utility/navigatePage";
//
import {
  Typography,
  Stack,
  Box,
  IconButton
} from "@mui/material";
//
import HomeIcon from "@mui/icons-material/Home"
//
import { OutlinePaper } from "../mui/reusable";

// ----------------------------------------------------------------------

const Title = ({ value }) => {
  return (
    <OutlinePaper>
      <Stack direction="row" spacing={1} alignItems="center">
        <Box display="flex" alignItems="center">
          <IconButton
            aria-label="close"
            onClick={() => { navigate("landing") }}
          >
            <HomeIcon />
          </IconButton>
        </Box>
        <Typography variant="h2">
          {value}
        </Typography>
      </Stack>
    </OutlinePaper>
  );
};

export default Title;