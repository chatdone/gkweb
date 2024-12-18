import create from 'zustand';

export type PageLoadStoreState = {
  isPageLoading: boolean;
  setIsPageLoading: (payload: boolean) => void;
};

//Page loading is started at true
//This is to prevent the onboardingtooltip to start showing before page is loaded
//HomePage.tsx will
//Cleaner solution needed for future
export const usePageLoadStore = create<PageLoadStoreState>((set) => ({
  isPageLoading: true,
  setIsPageLoading: (payload: boolean) => {
    set((state) => ({ ...state, isPageLoading: payload }));
  },
}));
