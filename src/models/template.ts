export interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  genre: string;
  icon: string;
}

export const VALID_TEMPLATES: Record<string, TemplateInfo> = {
  topdown: {
    id: "topdown",
    name: "Top-down Adventure",
    description: "2D adventure engine with particle physics, live inspector, dynamic light, and chiptune sound.",
    genre: "Adventure",
    icon: "[TOPDOWN]"
  },
  platformer: {
    id: "platformer",
    name: "Platformer 2D",
    description: "Fluid 2D Platformer with coyote time, jump buffer, particles, and level physics.",
    genre: "Platformer",
    icon: "[PLATFORM]"
  },
  cards: {
    id: "cards",
    name: "Card Battle Engine",
    description: "Interactive card battle system with 3D tilt hover, animation state machine, and battle mechanics.",
    genre: "Card Game",
    icon: "[CARDS]"
  },
  blank: {
    id: "blank",
    name: "Blank Canvas Starter",
    description: "Clean HTML5 Canvas starter with high-DPI scaling, game loop, and input manager.",
    genre: "Starter",
    icon: "[BLANK]"
  }
};
