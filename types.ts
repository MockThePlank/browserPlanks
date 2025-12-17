export type Direction = "forward" | "backward";

export type TransitionType = "fade" | "slide" | "zoom" | string;

export interface SlideTransition {
  type: TransitionType;
  duration?: number;
  easing?: string;
  direction?: Direction;
}

export type ImagePosition = "bottom-left" | "bottom-right" | "center";
export type ImageSize = "sm" | "md" | "lg";

export interface ImageConfig {
  src: string;
  alt?: string;
  caption?: string;
  position?: ImagePosition;
   size?: ImageSize;
}

export interface BaseSlide {
  id?: string;
  type?: SlideType;
  title?: string;
  subtitle?: string;
  transition?: SlideTransition;
  body?: string;
  image?: ImageConfig;
  table?: {
    columns?: string[];
    rows?: string[][];
  };
  video?: {
    src?: string;
    autoplay?: boolean;
    controls?: boolean;
    muted?: boolean;
    poster?: string;
  };
}

export type RevealMode = "instant" | "all" | "word" | "char";
export type RevealSpeeds = Partial<Record<"title" | "subtitle" | "body", number>>;

export interface TextSlide extends BaseSlide {
  type?: "text";
  body?: string;
  image?: ImageConfig;
  reveal?: Partial<Record<"title" | "subtitle" | "body", RevealMode>>;
  revealSpeedMs?: RevealSpeeds;
}

export interface TableSlide extends BaseSlide {
  type: "table";
}

export interface VideoSlide extends BaseSlide {
  type: "video";
}

export interface ImageSlide extends BaseSlide {
  type: "image";
  image: ImageConfig;
}

export interface FinaleSlide extends BaseSlide {
  type: "finale";
}

export type Slide = TextSlide | TableSlide | VideoSlide | ImageSlide | FinaleSlide;

export type SlideType = Slide["type"];

export interface ThemeConfig {
  className?: string;
  bodyClassName?: string;
  stylesheets?: string[];
}

export interface PresentationMeta {
  description?: string;
  [key: string]: unknown;
}

export interface Presentation {
  id: string;
  name: string;
  slides: Slide[];
  theme?: ThemeConfig;
  meta?: PresentationMeta;
}
