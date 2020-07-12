import React from 'react';

export interface ModalStoreContextValue {
  push: (key: string, state: any) => void;
}

export const ModalStoreContext = React.createContext<ModalStoreContextValue | null>(null);
