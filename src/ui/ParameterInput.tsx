import React, { useContext, useState } from "react";
import { Form } from "semantic-ui-react";
import { GraphEditorContext } from "@/GraphEditorContext";
import { Spi, SpiContext } from "@/spi";

const ParameterInput: React.FC = props => {
  const spi = useContext<Spi>(SpiContext);
  const _ = spi.locale;
  const { graph, algorithm, controlStep, parameters, currentStep } = useContext(GraphEditorContext);
  const descriptors = algorithm.value.parameters;
  const [inputs, setInputs] = useState<string[]>(new Array<string>(descriptors.length));
  const [errors, setErrors] = useState<string[]>(new Array<string>(descriptors.length));
  const onChange = index => (_, { value }) => {
    let newInputs = Array.from(inputs);
    newInputs[index] = value;
    setInputs(newInputs);
  };
  const onConfirm = () => {
    let ok = true;
    let newErrors = new Array<string>(descriptors.length);
    let para = new Array<any>(descriptors.length);
    for (let i = 0; i < descriptors.length; i++) {
      try {
        para[i] = descriptors[i].parser(inputs[i], graph.value);
      } catch (e) {
        newErrors[i] = e.message;
        ok = false;
      }
    }
    setErrors(newErrors);
    if (ok) {
      parameters.set(para);
      currentStep.set(-1);
      controlStep.set(3);
    }
  };
  return (
    <Form>
      <Form.Group widths={"equal"}>
        {descriptors.map(({ name }, i) => (
          <Form.Input
            fluid
            key={name}
            label={_(`.algo.${algorithm.value.name}.para.${name}`)}
            error={errors[i] ? _(errors[i]) : null}
            value={inputs[i]}
            onChange={onChange(i)}
          />
        ))}
      </Form.Group>
      <Form.Button color="green" onClick={onConfirm}>
        Next Step
      </Form.Button>
    </Form>
  );
};

export default ParameterInput;