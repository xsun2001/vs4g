import { GraphInputComponent } from "@/ui/input/GraphInputComponent";
import { Form, Message } from "semantic-ui-react";
import React, { useContext, useState } from "react";
import { parseRangedInt } from "@/GraphAlgorithm";
import { Spi, SpiContext } from "@/spi";
import { GraphEditorContext } from "@/GraphEditorContext";
import { GridGraph } from "@/GraphStructure";

const GridGraphInput: GraphInputComponent<any> = props => {
  const spi = useContext<Spi>(SpiContext);
  const _ = spi.locale;
  const { graph, controlStep } = useContext(GraphEditorContext);
  const [widthString, setWidthString] = useState<string>();
  const [heightString, setHeightString] = useState<string>();
  const [error, _setError] = useState<string>(null);
  const setError = e => {
    if (e !== error) _setError(e);
  };
  const onChange: (setter: (str: string) => void) => ((event: any, { value }) => void) = setter => ((_, { value }) => setter(value));
  const onFormSubmit = () => {
    try {
      const width = parseRangedInt(widthString, 0, Infinity), height = parseRangedInt(heightString, 0, Infinity);
      const grids = Array.from({ length: height }, () => Array.from({ length: width }, () => 0));
      graph.set(new GridGraph(grids));
      controlStep.set(2);
    } catch (e) {
      setError(e.message);
    }
  };

  return (<Form onSubmit={onFormSubmit} error={error != null}>
    <Form.Group widths="equal">
      <Form.Input
        fluid
        label="Width"
        value={widthString}
        onChange={onChange(setWidthString)}
      />
      <Form.Input
        fluid
        label="Height"
        value={heightString}
        onChange={onChange(setHeightString)}
      />
    </Form.Group>
    {error && <Message error>{_(error)}</Message>}
    <Form.Button positive>Sync</Form.Button>
  </Form>);
};

export default GridGraphInput;