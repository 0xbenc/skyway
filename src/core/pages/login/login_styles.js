import { styled } from '@mui/material/styles';
import Paper from "@mui/material/Paper";

const SeedPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  border: `1px solid ${theme.palette.secondary.main}`,
  padding: theme.spacing(1),
}));

export { SeedPaper }