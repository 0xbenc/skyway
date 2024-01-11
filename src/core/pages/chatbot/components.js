import React from "react";
//
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  materialDark,
  materialLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import PropTypes from "prop-types";
//
import { Box } from "@mui/material";
// ----------------------------------------------------------------------

const FormattedLeftResponse = ({ content, color_mode }) => {
  return (
    <Box sx={{ wordWrap: "break-word", overflowX: "auto", marginY: -1 }}>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                {...props}
                style={color_mode === "light" ? materialLight : materialDark}
                language={match[1]}
                PreTag="div"
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code {...props} className={className}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
};

const FormattedRightResponse = ({ content, color_mode }) => {
  return (
    <Box sx={{ wordWrap: "break-word", overflowX: "auto", marginY: -1 }}>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                {...props}
                style={color_mode === "light" ? materialLight : materialDark}
                language={match[1]}
                PreTag="div"
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code {...props} className={className}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
};

FormattedLeftResponse.propTypes = {
  content: PropTypes.object.isRequired,
  color_mode: PropTypes.string.isRequired,
};

FormattedRightResponse.propTypes = {
  content: PropTypes.object.isRequired,
  color_mode: PropTypes.string.isRequired,
};

export { FormattedLeftResponse, FormattedRightResponse };
