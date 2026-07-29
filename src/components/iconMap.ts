import {
  IconCode, IconLayers, IconDatabase, IconCloud, IconSparkles,
  IconServer, IconCompass, IconRocket, IconGlobe,
} from "./icons";
import type { ReactElement, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const map: Record<string, (p: IconProps) => ReactElement> = {
  code: IconCode,
  layers: IconLayers,
  database: IconDatabase,
  cloud: IconCloud,
  sparkles: IconSparkles,
  server: IconServer,
  compass: IconCompass,
  rocket: IconRocket,
  globe: IconGlobe,
};

export function iconFor(name: string): (p: IconProps) => ReactElement {
  return map[name] ?? IconLayers;
}
