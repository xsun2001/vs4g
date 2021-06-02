import React, { useContext, useState } from "react";
import { Form, Message } from "semantic-ui-react";
import { Spi, SpiContext } from "@/spi";
import { GraphInputComponent } from "@/ui/GraphInputComponent";
import { Graph } from "@/GraphStructure";

// TODO: Options are removed in newer version. We will add it back if necessary.
export interface GraphFormatter {
  name: string;
  toMatrix: (g: Graph) => number[][];
  fromMatrix: (m: number[][]) => Graph | string;
}

export function matrixInput(formatters: GraphFormatter[], checker: (g: Graph) => string = () => null, description: string = null): GraphInputComponent {
  const MatrixInputComponent: GraphInputComponent = props => {
    const spi = useContext<Spi>(SpiContext);
    const _ = spi.locale;
    const [formatter, setFormatter] = useState<number>(0);
    const [content, setContent] = useState<string>(formatters[0].toMatrix(props.defaultGraph).map(line => line.join(" ")).join("\n"));
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
              line
                .trim()
                .split(/\s+/)
                .map(s => parseIntWithThrow(s))
            // TODO: Use parser without throw
          );
        let res = formatters[formatter].fromMatrix(mat);
        if (typeof res !== "string") {
          let err = checker(res);
          if (err == null) {
            props.onGraphUpdated(res);
          } else {
            setError(err);
          }
        } else {
          setError(res);
        }
      } catch (e) {
        setError(e.message);
      }
    };
    const onFormatterSelected = (_, { value }) => {
      setFormatter(value);
      setContent(formatters[value].toMatrix(props.defaultGraph).map(line => line.join(" ")).join("\n"));
    };

    return (
      <Form onSubmit={onFormSubmit} error={error !== undefined}>
        <Form.Group>
          <Form.Select
            inline
            label="Input Method"
            options={formatters.map((f, idx) => ({ key: f.name, text: f.name, value: idx }))}
            onChange={onFormatterSelected}
          />
          {description ?? (<p>{description}</p>)}
        </Form.Group>
        <Form.Field>
          <label>Matrix</label>
          <spi.CodeEditor
            value={content}
            onChange={onTextAreaChange}
          />
        </Form.Field>
        {error && <Message error>{_(error)}</Message>}
        <Form.Button positive>Sync</Form.Button>
      </Form>
    );
  };

  return MatrixInputComponent;
}