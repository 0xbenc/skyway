import { styled } from '@mui/material/styles';
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

const BackPaper = styled(Box)(({ theme }) => ({
  margin: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  border: `1px solid ${theme.palette.secondary.main}`,
}));

const OutPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  border: `1px solid ${theme.palette.secondary.main}`,
  padding: theme.spacing(1),
}));

export { BackPaper, OutPaper }