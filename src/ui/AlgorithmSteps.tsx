import { Accordion, Comment, Header, Segment } from "semantic-ui-react";
import React, { useContext, useState } from "react";
import style from "./AlgorithmSteps.module.less";
import { Spi, SpiContext } from "@/spi";
import { codeMap } from "@/algorithms";
import { GraphEditorContext } from "@/GraphEditorContext";

const AlgorithmSteps: React.FC = props => {
  const spi = useContext<Spi>(SpiContext);
  const _ = spi.locale;
  const { algorithm, codePosition } = useContext(GraphEditorContext);
  const [active, setActive] = useState<boolean>(false);

  const onAccordionClick = () => setActive(!active);

  const renderCodeLines: (element: (string | string[])[]) => [JSX.Element[], number, string] = React.useCallback((
    element,
    idx = 0
  ) => {
    let ans: JSX.Element[] = [];
    let selected: string;
    let cp = codePosition.value;
    for (let line of element) {
      if (typeof line === "string") {
        ans.push(
          <Comment.Text key={idx} className={cp === idx ? style.currentStep : style.step}>
            <spi.Markdown content={line} />
          </Comment.Text>
        );
        if (cp === idx) {
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
  }, [codePosition.value, spi]);

  const rendered: [JSX.Element[], number, string] = React.useMemo(() => {
    if (algorithm.value)
      return renderCodeLines(codeMap[algorithm.value.name]["pseudo"]);
    else
      return [null, 0, null];
  }, [algorithm.value, renderCodeLines]);

  return (
    <div style={{
      position: "absolute",
      width: "100%",
      bottom: "0px",
      padding: "20px"
    }}>
      {(algorithm.value == null || codePosition.value < 0) ? (
        <Segment>
          <Header>
            Waiting for algorithm start
          </Header>
        </Segment>
      ) : (
        <Accordion fluid styled>
          <Accordion.Title
            active={active}
            onClick={onAccordionClick}
            className={style.title}
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
      )}
    </div>
  );
};

export default React.memo(AlgorithmSteps);
