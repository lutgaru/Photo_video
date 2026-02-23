import "./index.css";
import { Composition } from "remotion";
import { MyVideo as MyComposition} from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={1770}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
