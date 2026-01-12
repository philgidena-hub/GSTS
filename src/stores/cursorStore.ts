import { create } from 'zustand';

export type CursorVariant = 'default' | 'link' | 'button' | 'text' | 'hidden';

interface CursorState {
  variant: CursorVariant;
  text: string;
  isVisible: boolean;
  setVariant: (variant: CursorVariant) => void;
  setText: (text: string) => void;
  setVisible: (visible: boolean) => void;
  reset: () => void;
}

export const useCursorStore = create<CursorState>((set) => ({
  variant: 'default',
  text: '',
  isVisible: true,
  setVariant: (variant) => set({ variant }),
  setText: (text) => set({ text }),
  setVisible: (visible) => set({ isVisible: visible }),
  reset: () => set({ variant: 'default', text: '' }),
}));
