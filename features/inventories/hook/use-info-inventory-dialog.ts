import { create } from "zustand";

type InfoInvntoryState = {
    id?: string;
    type: "income" | "outcome";
    isOpen: boolean;
    onOpen: (id: string, type: "income" | "outcome") => void;
    onClose: () => void;
}

export const useInfoInventory = create<InfoInvntoryState>((set) => ({
    id: undefined,
    type: "income",
    isOpen: false,
    onOpen: (id: string, type: "income" | "outcome") => set({ isOpen: true, type, id }),
    onClose: () => set({ isOpen: false, id: undefined }),
}));
