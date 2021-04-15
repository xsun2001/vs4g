import React, { useContext, useState } from "react";
import { Form, Message } from "semantic-ui-react";
import { CheckboxProps } from "semantic-ui-react/dist/commonjs/modules/Checkbox/Checkbox";
import { Spi, SpiContext } from "@/spi";

interface MatrixInputProps {
  initContent: string;
  initError?: string;
  options: [string, boolean][];
  onSync: (mat: number[][], options: boolean[]) => void;
}

let MatrixInputComponent: React.FC<MatrixInputProps> = props => {
  const spi = useContext<Spi>(SpiContext);
  const _ = spi.locale;
  let { initContent, initError, options, onSync } = props;
  const [content, setContent] = useState<string>(initContent);
  const [error, _setError] = useState<string>(initError);
  const setError = e => {
    if (e !== error) _setError(e);
  };
  let optionStates: [string, boolean, (event: any, data: CheckboxProps) => void][] = options
    .map<[any, any, (v: boolean) => void]>(([name, init]) => [name, ...useState<boolean>(init)])
    .map(state => [
      state[0],
      state[1],
      (_, { checked }) => {
        state[2](checked);
        setError(undefined);
      }
    ]);
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
        );
      onSync(
        mat,
        optionStates.map(state => state[1])
      );
      setError(undefined);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Form onSubmit={onFormSubmit} error={error !== undefined}>
      <Form.Field>
        <label>Matrix</label>
        <spi.CodeEditor
          value={content}
          onChange={onTextAreaChange}
        />
      </Form.Field>
      <Form.Group inline>
        {optionStates.map(([name, option, setter]) => (
          <Form.Checkbox key={name} label={_(`.input.props.${name}`)} checked={option} onChange={setter} />
        ))}
      </Form.Group>
      {error && <Message error>{_(error)}</Message>}
      <Form.Button positive>Sync</Form.Button>
    </Form>
  );
};

export default MatrixInputComponent;
