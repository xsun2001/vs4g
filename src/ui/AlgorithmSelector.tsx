import React, { useContext, useState } from "react";
import { NewGraphAlgorithm } from "@/GraphAlgorithm";
import { newAlgorithms } from "@/algorithms";
import { Form } from "semantic-ui-react";
import { GraphEditorContext } from "@/GraphEditorContext";
import { Spi, SpiContext } from "@/spi";

let AlgorithmSelector: React.FC = props => {
  const spi = useContext<Spi>(SpiContext);
  const _ = spi.locale;
  const { algorithm, controlStep, currentStep } = useContext(GraphEditorContext);
  const categories = new Map<string, Map<string, NewGraphAlgorithm>>();
  newAlgorithms.forEach(algo => {
    const cat = algo.category;
    if (categories.has(cat)) {
      categories.get(cat).set(algo.name, algo);
    } else {
      categories.set(cat, new Map<string, NewGraphAlgorithm>([[algo.name, algo]]));
    }
  });
  const [selectedCategory, setSelectedCategory] = useState<string>(algorithm.value?.category);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>(algorithm.value?.description);

  const onChange: (func: (newValue: string) => void) => ((_, { value: string }) => void)
    = func => ((_, { value }) => func(value));
  const onConfirm = () => {
    algorithm.set(categories.get(selectedCategory).get(selectedAlgorithm));
    currentStep.set(-1);
    controlStep.set(1);
  };

  return (
    <Form>
      <Form.Group widths="equal">
        <Form.Select
          fluid
          clearable
          label="Category"
          options={[...categories.keys()].map(key => ({
            key,
            value: key,
            text: key
          }))}
          onChange={onChange(setSelectedCategory)}
          defaultValue={selectedCategory}
        />
        <Form.Select
          fluid
          clearable
          label="Algorithm"
          options={[...(categories.get(selectedCategory) ?? new Map<string, NewGraphAlgorithm>()).keys()].map(key => ({
            key,
            value: key,
            text: _(`.algo.${key}.name`)
          }))}
          onChange={onChange(setSelectedAlgorithm)}
          defaultValue={selectedAlgorithm}
        />
      </Form.Group>
      <Form.Button
        disabled={categories.get(selectedCategory)?.get(selectedAlgorithm) == null}
        color="green"
        onClick={onConfirm}
      >
        Next Step
      </Form.Button>
    </Form>
  );
};

export default AlgorithmSelector;