import create from 'zustand';

type ResponsiveStore = {
  isMobile: boolean;
  setIsMobile: (isMobile: boolean) => void;
};

export const useResponsiveStore = create<ResponsiveStore>((set) => ({
  isMobile: false,
  setIsMobile: (isMobile) => set({ isMobile }),
}));
