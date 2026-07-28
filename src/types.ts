export type IdeaStatus = 'pending' | 'rotted' | 'trotted';

export interface Idea {
  id: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: number;
  decayTime: number; // in seconds
  status: IdeaStatus;
  roast?: string;
  trots?: number;
  devsPledged?: number;
}
