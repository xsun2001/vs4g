import React from "react";
import ReactMarkdown from "react-markdown";
import Tex from "@matejmazur/react-katex";
import math from "remark-math";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import gfm from "remark-gfm";
import "katex/dist/katex.min.css"; // `react-katex` does not import the CSS for you

const renderers = {
  inlineMath: ({ value }) => <Tex math={value} />,
  math: ({ value }) => <Tex block math={value} />,
  code: ({ language, value }) => {
    return <SyntaxHighlighter style={dark} language={language} children={value} />;
  }
};

const RemarkjsMarkdown: React.FunctionComponent<{ content: string }> = props => (
  <ReactMarkdown
    plugins={[math, gfm]}
    renderers={renderers}
    children={props.content}
  />
);

export default React.memo(RemarkjsMarkdown);