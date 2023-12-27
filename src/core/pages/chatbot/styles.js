import { styled } from '@mui/material/styles';
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
// ----------------------------------------------------------------------

const ChatField = styled(TextField)(({ theme }) => ({
  "& .MuiFilledInput-root": {
    backgroundColor: theme.palette.primary.main,
  },
  "& .MuiFilledInput-root:hover": {
    backgroundColor: theme.palette.primary.main,
    "@media (hover: none)": {
      backgroundColor: theme.palette.primary.main
    }
  },
  "& .MuiFilledInput-root.Mui-focused": {
    backgroundColor: theme.palette.primary.main,
  },
  "& .MuiFilledInput-root.Mui-disabled": {
    backgroundColor: theme.palette.primary.light,
  },
  '& .MuiInputBase-root': {
    backgroundColor: theme.palette.primary.main,
    border: `1px solid ${theme.palette.secondary.main}`,
  },
  '& label.Mui-focused': {
    color: theme.palette.secondary.main,
  },
}));

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

const Top = styled(Box)(({ theme }) => ({
  width: "100vw",
  height: theme.spacing(12),
  maxHeight: theme.spacing(12),
  position: "absolute",
  top: 0
}));

const Middle = styled(Box)(({ theme }) => ({
  width: "100vw",
  top: theme.spacing(12),
  bottom: theme.spacing(6),
  position: "absolute",
  overflowY: "auto",
  overflowX: "hidden",
  padding: theme.spacing(1)
}));

const Bottom = styled(Box)(({ theme }) => ({
  width: "100vw",
  maxHeight: theme.spacing(6),
  height: theme.spacing(6),
  position: "absolute",
  bottom: 0,
  display: 'flex',
  flexDirection: 'column-reverse'
}));

export { LeftBox, RightBox, LeftChatBox, RightChatBox, ChatsHolder, LeftCodeBorder, RightCodeBorder, ChatField, Top, Middle, Bottom };
