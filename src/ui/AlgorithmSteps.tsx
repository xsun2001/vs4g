import { Accordion, Comment } from "semantic-ui-react";
import React, { useContext, useState } from "react";
import style from "./AlgorithmSteps.module.less";
import { Spi, SpiContext } from "@/spi";
import { codeMap } from "@/algorithms";

interface AlgorithmStepsProps {
  algorithmName: string;
  codeType: string;
  codePosition: number;
}

const AlgorithmSteps: React.FC<AlgorithmStepsProps> = props => {
  const spi = useContext<Spi>(SpiContext);
  const _ = spi.locale;
  const { algorithmName, codeType, codePosition } = props;
  const [active, setActive] = useState<boolean>(false);

  const onAccordionClick = () => setActive(!active);

  const renderCodeLines: (element: (string | string[])[]) => [JSX.Element[], number, string] = React.useCallback((
    element,
    idx = 0
  ) => {
    let ans: JSX.Element[] = [];
    let selected: string;
    for (let line of element) {
      if (typeof line === "string") {
        ans.push(
          <Comment.Text key={idx} className={codePosition === idx ? style.currentStep : style.step}>
            <spi.Markdown content={line} />
          </Comment.Text>
        );
        if (codePosition === idx) {
          selected = line;
        }
        ++idx;
      } else {
        let res = renderCodeLines(line);
        ans.push(<Comment.Group key={idx}>{res[0]}</Comment.Group>);
        idx += res[1];
        if (res[2] != null) {
          selected = res[2];
        }
      }
    }
    return [ans, idx, selected];
  }, [codePosition, spi]);

  const rendered: [JSX.Element[], number, string] = React.useMemo(() => {
    if (algorithmName && codeType)
      return renderCodeLines(codeMap[algorithmName][codeType]);
    else
      return [null, 0, null];
  }, [algorithmName, codeType, renderCodeLines]);

  return (
    <Accordion styled>
      <Accordion.Title
        active={active}
        onClick={onAccordionClick}
      >
        {active ? "Code Display" :
          rendered[2] == null ? "Please select algorithm" :
            (<spi.Markdown content={rendered[2]} />)
        }
      </Accordion.Title>
      <Accordion.Content
        active={active}
      >
        {rendered[0]}
      </Accordion.Content>
    </Accordion>
  );
};

export default React.memo(AlgorithmSteps);
