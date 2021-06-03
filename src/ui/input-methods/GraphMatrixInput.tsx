import React, { useContext, useState } from "react";
import { Form, Message } from "semantic-ui-react";
import { Spi, SpiContext } from "@/spi";
import { GraphInputComponent } from "@/ui/GraphInputComponent";
import { Graph } from "@/GraphStructure";
import { GraphEditorContext } from "@/GraphEditorContext";
import { GraphFormatter } from "@/ui/input-methods/GraphFormatter";

export interface GraphMatrixInputProps {
  formatters: GraphFormatter[];
  checker: (g: Graph) => Graph;
  description: string;
}

const GraphMatrixInput: GraphInputComponent<GraphMatrixInputProps> = props => {
  const { formatters, description, checker } = props;
  const { graph, controlStep } = useContext(GraphEditorContext);
  const spi = useContext<Spi>(SpiContext);
  const _ = spi.locale;

  const [formatter, setFormatter] = useState<number>(0);
  const [content, setContent] = useState<string>(formatters[0].toMatrix(graph.value).map(line => line.join(" ")).join("\n"));
  const [error, _setError] = useState<string>(null);

  const setError = e => {
    if (e !== error) _setError(e);
  };
  const onTextAreaChange = value => setContent(String(value));
  const onFormSubmit = () => {
    const parseIntWithThrow = v => {
      let n = parseInt(v);
      if (isNaN(n)) throw new Error(".input.error.nan");
      return n;
    };
    try {
      let mat = content
        .trim()
        .split("\n")
        .map(line =>
          line.trim()
            .split(/\s+/)
            .map(s => parseIntWithThrow(s))
        );
      let res = checker(formatters[formatter].fromMatrix(mat));
      graph.set(res);
      controlStep.set(2);
    } catch (e) {
      setError(e.message);
    }
  };
  const onFormatterSelected = (_, { value }) => {
    setFormatter(value);
    setContent(formatters[value].toMatrix(graph.value).map(line => line.join(" ")).join("\n"));
  };

  return (
    <Form onSubmit={onFormSubmit} error={error !== undefined}>
      <Form.Group widths={"equal"}>
        <Form.Select
          fluid
          label="Input Method"
          options={formatters.map((f, idx) => ({ key: f.name, text: f.name, value: idx }))}
          onChange={onFormatterSelected}
          defaultValue={0}
        />
      </Form.Group>
      <Form.Field>
        <label>Matrix</label>
        <spi.CodeEditor
          value={content}
          onChange={onTextAreaChange}
        />
      </Form.Field>
      <Message>{description}</Message>
      {error && <Message error>{_(error)}</Message>}
      <Form.Button positive>Sync</Form.Button>
    </Form>
  );
};

export default GraphMatrixInput;