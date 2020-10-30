import React from 'react';

type ModalStoreContextValue = (key: string, state: any) => void;

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const ModalStoreContext = React.createContext<ModalStoreContextValue>(() => {});
