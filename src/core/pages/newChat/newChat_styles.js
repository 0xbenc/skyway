import { styled } from '@mui/material/styles';
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

const LeftBox = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'left',
  alignItems: 'left',
  textAlign: 'left'
}));

const RightBox = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'right',
  alignItems: 'right',
  textAlign: 'right'
}));

const LeftChatBox = styled(Paper)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(1),
  backgroundColor: theme.palette.primary.main,
  border: `1px solid ${theme.palette.secondary.main}`,
  maxWidth: "80vw"
}));

const RightChatBox = styled(Paper)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(1),
  backgroundColor: theme.palette.primary.dark,
  border: `1px solid ${theme.palette.secondary.main}`,
  maxWidth: "80vw",
  justifyContent: 'left',
  alignItems: 'left',
  textAlign: 'left'
}));

const ChatsHolder = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.secondary.main}`,
  overflow: "auto",
  maxHeight: "75vh",
  margin: theme.spacing(2)
}));

const LeftCodeBorder = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.secondary.main}`,
  padding: theme.spacing(1),
  backgroundColor: theme.palette.primary.light
}));

const RightCodeBorder = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.secondary.main}`,
  padding: theme.spacing(1),
  backgroundColor: theme.palette.primary.light
}));

export { LeftBox, RightBox, LeftChatBox, RightChatBox, ChatsHolder, LeftCodeBorder, RightCodeBorder }