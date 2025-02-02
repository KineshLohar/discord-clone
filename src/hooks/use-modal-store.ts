


import { Server } from '@prisma/client';
import { create } from 'zustand';

interface ModalData {
    server?: Server
}

export type ModalType = "createServer" | "invite" | 'editServer' | 'members' | 'createChannel' | 'leaveServer' | 'deleteServer';

interface ModalStore {
    type : ModalType | null;
    data: ModalData
    isOpen: boolean;
    onOpen: (type: ModalType, data?: ModalData) => void;
    onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
    type : null,
    isOpen: false,
    data : {},
    onOpen : (type, data = {}) => set({
        isOpen: true,
        type,
        data
    }),
    onClose: () => set({
        type: null,
        isOpen: false,
        data: {}
    })
}))