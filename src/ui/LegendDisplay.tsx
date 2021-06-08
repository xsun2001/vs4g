import React, { useContext, useState } from "react";
import { Button, Segment } from "semantic-ui-react";
import { GraphEditorContext } from "@/GraphEditorContext";
import { Spi, SpiContext } from "@/spi";
import legends from "@/algorithms/legends";


const LegendDisplay: React.FC = props => {
  const [folded, setFolded] = useState<boolean>(true);
  const { algorithm } = useContext(GraphEditorContext);
  const { Markdown } = useContext<Spi>(SpiContext);

  return (<div style={{
      position: "absolute",
      right: 20,
      top: 300
    }}>
      {
        folded ?
          (<Button
            circular
            icon="question circle outline"
            onClick={() => setFolded(false)} />) :
          (<>
            <Button
              content="Legend"
              icon="question circle outline"
              attached="top"
              onClick={() => setFolded(true)} />
            <Segment attached="bottom">
              {algorithm.value ?
                (<Markdown content={legends[algorithm.value.name]} />) :
                (<p>Please select an algorithm first.</p>)
              }
            </Segment>
          </>)
      }
    </div>
  );
};

export default LegendDisplay;