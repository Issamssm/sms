import { create } from "zustand";

type EditInvntoryState = {
    id?: string;
    type: "income" | "outcome";
    isOpen: boolean;
    onOpen: (id: string, type: "income" | "outcome") => void;
    onClose: () => void;
}

export const useEditInventory = create<EditInvntoryState>((set) => ({
    id: undefined,
    type: "income",
    isOpen: false,
    onOpen: (id: string, type: "income" | "outcome") => set({ isOpen: true, type, id }),
    onClose: () => set({ isOpen: false, id: undefined }),
}));
