"use client";

import { createContext, Dispatch, SetStateAction } from "react";
import { UseNewTaskModal } from "./newTask-modal";

type ModalContextType = {
  setShowTaskModal: Dispatch<SetStateAction<boolean>>;
};

export const ModalContext = createContext<ModalContextType>({
  setShowTaskModal: () => {},
});

export default function ModalProviders({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { setShowTaskModal, TaskModal } = UseNewTaskModal();
  return (
    <ModalContext.Provider value={{ setShowTaskModal }}>
      <TaskModal />
      {children}
    </ModalContext.Provider>
  );
}
