import { forwardRef, useRef, RefObject } from "react";
import { Group } from "three";
import { ThreeElements } from "@react-three/fiber";
import Agent, { ValorantAgentId } from "./Agent";

export type CharacterAnimationType = "Idle" | "Walk" | "Run";

type PlayerCharacterProps = ThreeElements["group"] & {
  animation?: CharacterAnimationType;
  agentId?: ValorantAgentId;
};

/**
 * Player avatar backed by a Valorant agent GLB.
 * The agent GLBs only ship one idle clip, so all animation states map to it.
 */
const PlayerCharacter = forwardRef<Group, PlayerCharacterProps>(
  function PlayerCharacter(
    { animation: _animation, agentId = "jett", ...props },
    forwardedRef
  ) {
    const internalRef = useRef<Group>(null);
    const group = (forwardedRef ?? internalRef) as RefObject<Group>;

    return (
      <group ref={group} {...props} dispose={null}>
        <Agent agentId={agentId} scale={1} position={[0, 0, 0]} />
      </group>
    );
  }
);

export default PlayerCharacter;