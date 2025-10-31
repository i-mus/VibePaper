
export interface GeneratedImage {
  src: string;
  prompt: string;
  aspectRatio: string;
}

export type AspectRatio = "9:16" | "16:9" | "1:1" | "4:3" | "3:4";
