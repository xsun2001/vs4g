import React, { createContext } from "react";
import Default from "@/spi/default";

export interface Spi {
  locale: (message: string) => string,
  codeFontFamily: () => string,
  codeFontSize: () => number,
  Markdown: React.FC<{ content: string }>,
  CodeEditor: React.FC<{ value: string, onChange: (value: string) => void }>
}

export const SpiContext = createContext<Spi>(Default);