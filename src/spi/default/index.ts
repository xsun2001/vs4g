import { Spi } from "@/spi";
import LocalizerImpl from "@/spi/default/LocalizerImpl";
import SimpleCodeFonts from "@/spi/default/SimpleCodeFonts";
import RemarkjsMarkdown from "@/spi/default/RemarkjsMarkdown";

const Default: Spi = {
  locale: LocalizerImpl,
  CodeEditor: undefined,
  Markdown: RemarkjsMarkdown,
  codeFontFamily: SimpleCodeFonts,
  codeFontSize: () => 14
};

export default Default;