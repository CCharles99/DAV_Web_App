import { create } from 'zustand';

const useTimerStore = create((set) => ({
  frame: 0,
  isPlaying: false,
  maxFrame: 0,
  start: () => set({ isPlaying: true }),
  stop: () => set({ isPlaying: false }),
  snap: (value) => set({ frame: value }),
  increment: () => set((state) => ({ frame: state.frame + 1 })),
  setMaxFrame: (newMax) => set({ maxFrame: newMax }),
  increment: () => set((state) => {
    if (state.frame < state.maxFrame - 1) {
      return { frame: state.frame + 1 };
    } else {
      return { frame: 0 };
    }
  })
}));

export default useTimerStore;