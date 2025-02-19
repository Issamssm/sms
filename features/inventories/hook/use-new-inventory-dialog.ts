import { create } from "zustand";

type NewInvntoryState = {
    type: "income" | "outcome"
    isOpen: boolean;
    onOpen: (type: "income" | "outcome") => void;
    onClose: () => void;
}

export const useNewInventory = create<NewInvntoryState>((set) => ({
    type: "income",
    isOpen: false,
    onOpen: (type: "income" | "outcome") => set({ isOpen: true, type }),
    onClose: () => set({ isOpen: false }),
}));
