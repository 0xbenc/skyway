import React from "react";
//
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { materialDark, materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
//
import {
  Box,
} from "@mui/material";
// ----------------------------------------------------------------------

const FormattedLeftResponse = ({ content, color_mode }) => {
  return <Box sx={{ wordWrap: 'break-word', overflowX: "auto", marginY: -1 }}>
    <ReactMarkdown rehypePlugins={[rehypeRaw]}
      children={content}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '')
          return !inline && match ? (
            <SyntaxHighlighter
              {...props}
              children={String(children).replace(/\n$/, '')}
              style={color_mode === "light" ? materialLight : materialDark}
              language={match[1]}
              PreTag="div"
            />
          ) : (
            <code {...props} className={className}>
              {children}
            </code>
          )
        }
      }}
    />
  </Box>
};

const FormattedRightResponse = ({ content, color_mode }) => {
  return <Box sx={{ wordWrap: 'break-word', overflowX: "auto", marginY: -1 }}>
    <ReactMarkdown rehypePlugins={[rehypeRaw]}
      children={content}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '')
          return !inline && match ? (
            <SyntaxHighlighter
              {...props}
              children={String(children).replace(/\n$/, '')}
              style={color_mode === "light" ? materialLight : materialDark}
              language={match[1]}
              PreTag="div"
            />
          ) : (
            <code {...props} className={className}>
              {children}
            </code>
          )
        }
      }}
    />
  </Box>
};

export { FormattedLeftResponse, FormattedRightResponse };
