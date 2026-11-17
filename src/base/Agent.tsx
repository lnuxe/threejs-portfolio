import { useEffect, useRef, forwardRef, RefObject } from "react";
import { Group } from "three";
import { useGLTF, useAnimations } from "@react-three/drei";
import { ThreeElements } from "@react-three/fiber";

export type ValorantAgentId = "jett" | "phoenix" | "sage" | "sova";

export const AGENT_MODEL_PATHS: Record<ValorantAgentId, string> = {
  jett: "/models/agents/jett_animated.glb",
  phoenix: "/models/agents/phoenix_animated.glb",
  sage: "/models/agents/sage_animated.glb",
  sova: "/models/agents/sova_animated.glb",
};

type AgentProps = ThreeElements["group"] & {
  agentId?: ValorantAgentId;
  autoPlay?: boolean;
};

/**
 * A Valorant agent GLB with its idle ("kamae") clip auto-playing.
 * Sketchfab exports are ~1.9 world-units tall at scale 1.
 */
const Agent = forwardRef<Group, AgentProps>(function Agent(
  { agentId = "jett", autoPlay = true, ...props },
  forwardedRef
) {
  const internalRef = useRef<Group>(null);
  const group = (forwardedRef ?? internalRef) as RefObject<Group>;
  const modelPath = AGENT_MODEL_PATHS[agentId];
  const { scene, animations } = useGLTF(modelPath);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (!autoPlay) return;
    const first = Object.keys(actions)[0];
    const action = first && actions[first];
    if (action) {
      action.reset().fadeIn(0.3).play();
    }
    return () => {
      if (action) action.fadeOut(0.3);
    };
  }, [actions, agentId, autoPlay]);

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={scene} />
    </group>
  );
});

Object.values(AGENT_MODEL_PATHS).forEach((path) => useGLTF.preload(path));

export default Agent;
