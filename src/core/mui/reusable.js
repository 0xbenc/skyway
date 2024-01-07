import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
// ----------------------------------------------------------------------

const BasicBox = styled(Box)(({ theme }) => ({
  margin: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  border: `1px solid ${theme.palette.secondary.main}`,
}));

const OutlinePaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.primary.outside,
  border: `1px solid ${theme.palette.secondary.main}`,
  padding: theme.spacing(1),
}));

const SeedPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  border: `1px solid ${theme.palette.secondary.outside}`,
  color: theme.palette.primary.main,
  padding: theme.spacing(1),
}));

export { BasicBox, OutlinePaper, SeedPaper };
