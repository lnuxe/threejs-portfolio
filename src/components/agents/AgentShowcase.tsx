import { useRef, useState } from "react";
import { Group } from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import Text from "../../base/Text";
import Agent, { ValorantAgentId } from "../../base/Agent";
import CollisionPlate from "../../base/CollisionPlate";
import type { CollisionPayload } from "../../services/CollisionEmitter";
import { SPRITE_STYLES } from "../../constants/spriteStyles";

interface AgentInfo {
  id: ValorantAgentId;
  name: string;
  role: string;
  origin: string;
  signature: string;
  bio: string;
  accent: string;
}

export const AGENTS: AgentInfo[] = [
  {
    id: "jett",
    name: "JETT",
    role: "Duelist",
    origin: "South Korea",
    signature: "Tailwind / Cloudburst / Updraft / Blade Storm",
    bio: "来自韩国的决斗者。迅捷如风，擅长快速切入与撤离，用飞刀在电光石火间终结对手。",
    accent: "#8be9fd",
  },
  {
    id: "phoenix",
    name: "PHOENIX",
    role: "Duelist",
    origin: "United Kingdom",
    signature: "Curveball / Blaze / Hot Hands / Run It Back",
    bio: "来自英国的决斗者。以烈焰为武器，掌控战场节奏，大招可让他无惧死亡冲锋陷阵。",
    accent: "#ff9e64",
  },
  {
    id: "sage",
    name: "SAGE",
    role: "Sentinel",
    origin: "China",
    signature: "Barrier Orb / Slow Orb / Healing Orb / Resurrection",
    bio: "来自中国的守卫。攻守兼备的辅助核心，能治疗队友、筑墙封锁，甚至逆转死亡。",
    accent: "#a6e3a1",
  },
  {
    id: "sova",
    name: "SOVA",
    role: "Initiator",
    origin: "Russia",
    signature: "Shock Bolt / Recon Bolt / Owl Drone / Hunter's Fury",
    bio: "来自俄罗斯的先锋。百步穿杨的弓箭手，用侦察箭为队友照亮战场，猎手之怒横扫全场。",
    accent: "#89dceb",
  },
];

const Pedestal = ({
  info,
  position,
}: {
  info: AgentInfo;
  position: [number, number, number];
}) => {
  const agentRef = useRef<Group>(null);
  const [isColliding, setIsColliding] = useState(false);

  useFrame(({ clock }) => {
    if (agentRef.current) {
      agentRef.current.rotation.y = clock.getElapsedTime() * 0.4;
    }
  });

  return (
    <group position={position}>
      {/* Agent on slowly rotating display */}
      <Agent ref={agentRef} agentId={info.id} scale={3.2} position={[0, 0.1, 0]} />

      {/* Pedestal ring */}
      <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.6, 2.85, 64]} />
        <meshStandardMaterial
          color={info.accent}
          emissive={info.accent}
          emissiveIntensity={1.2}
          side={2}
        />
      </mesh>

      {/* Name text (3D extruded, faces +Z visitors) */}
      <Text
        type="3d"
        position={[0, 8.5, 0]}
        rotation={[0, Math.PI, 0]}
        textOptions={{ size: 2.4, height: 0.5, font: "/fonts/Roboto_Regular.json" }}
      >
        {info.name}
      </Text>

      {/* Role line (2d billboard text, tinted) */}
      <Text
        type="2d"
        position={[0, 6.9, 0]}
        fontSize={1.1}
        color={info.accent}
      >
        {info.role} · {info.origin}
      </Text>

      {/* Trigger plate */}
      <CollisionPlate
        name={`agent-${info.id}-plate`}
        size={[6, 6]}
        position={[0, 0.1, 0]}
        onCollision={({ type }: CollisionPayload) => setIsColliding(type === "enter")}
      />

      {isColliding && (
        <Html style={SPRITE_STYLES} transform rotation={[0, Math.PI, 0]} position={[0, 5, 0]}>
          <div style={{ textAlign: "center", minWidth: 420 }}>
            <h2 style={{ color: info.accent, margin: 0 }}>{info.name}</h2>
            <p style={{ fontSize: 22, opacity: 0.85 }}>{info.role} — {info.origin}</p>
            <p style={{ fontSize: 24 }}>{info.bio}</p>
            <p style={{ fontSize: 20, opacity: 0.75 }}>技能: {info.signature}</p>
            <span style={{ fontSize: 18, opacity: 0.6 }}>走出圆盘关闭面板</span>
          </div>
        </Html>
      )}
    </group>
  );
};

const AgentShowcase = () => {
  return (
    <group position={[0, 0, -140]}>
      {/* Section sign */}
      <Text
        type="3d"
        rotation={[-Math.PI / 2, Math.PI * 2, 0]}
        position={[0, 0.5, 14]}
        textOptions={{ size: 7, height: 1, font: "/fonts/Roboto_Regular.json" }}
      >
        AGENTS
      </Text>

      {/* Section intro (2d text on the floor) */}
      <Text
        type="2d"
        position={[0, 3.2, 6]}
        rotation={[-Math.PI / 2, Math.PI, 0]}
        fontSize={1.3}
        color="#ff4655"
      >
        DEFY THE LIMIT — 无畏契约特工档案
      </Text>

      {/* Four pedestals in a row */}
      {AGENTS.map((info, i) => (
        <Pedestal key={info.id} info={info} position={[(i - 1.5) * 14, 0, -18]} />
      ))}
    </group>
  );
};

export default AgentShowcase;