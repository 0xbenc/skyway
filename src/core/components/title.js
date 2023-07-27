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
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
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
            size="large"
          >
            <ArrowBackIcon fontSize="inheret"/>
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