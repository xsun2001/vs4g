import React, { useState } from "react";
import { NewGraphAlgorithm } from "@/GraphAlgorithm";
import { newAlgorithms } from "@/algorithms";
import { Form } from "semantic-ui-react";

let AlgorithmSelector: React.FC = props => {
  const categories = new Map<string, Map<string, NewGraphAlgorithm>>();
  newAlgorithms.forEach(algo => {
    const cat = algo.category;
    if (categories.has(cat)) {
      categories.get(cat).set(algo.name, algo);
    } else {
      categories.set(cat, new Map<string, NewGraphAlgorithm>([[algo.name, algo]]));
    }
  });
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>();

  const onChange: (func: (newValue: string) => void) => ((_, { value: string }) => void)
    = func => ((_, { value }) => func(value));

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
        />
        <Form.Select
          fluid
          clearable
          label="Algorithm"
          options={[...(categories.get(selectedCategory) ?? new Map<string, NewGraphAlgorithm>()).keys()].map(key => ({
            key,
            value: key,
            text: key
          }))}
          onChange={onChange(setSelectedAlgorithm)}
        />
      </Form.Group>
      <Form.Button
        disabled={categories.get(selectedCategory)?.get(selectedAlgorithm) == null}
        color="green"
      >
        Next Step
      </Form.Button>
    </Form>
  );
};

export default AlgorithmSelector;