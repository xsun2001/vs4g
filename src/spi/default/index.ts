import { Spi } from "@/spi";
import LocalizerImpl from "@/spi/default/LocalizerImpl";
import SimpleCodeFonts from "@/spi/default/SimpleCodeFonts";
import RemarkjsMarkdown from "@/spi/default/RemarkjsMarkdown";
import MonacoCodeEditor from "@/spi/default/MonacoCodeEditor";

const Default: Spi = {
  locale: LocalizerImpl,
  CodeEditor: MonacoCodeEditor,
  Markdown: RemarkjsMarkdown,
  codeFontFamily: SimpleCodeFonts,
  codeFontSize: () => 14
};

export default Default;