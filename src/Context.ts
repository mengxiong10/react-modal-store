import React from 'react';
import { ModalConfigMap, ModalConfig } from './ModalStore';

type RetureModalState<T> = T extends ModalConfig<infer P> ? Partial<P> : T;

export type ModalDispatch<T extends ModalConfigMap = any> = <K extends keyof T & string>(
  key: K,
  state: RetureModalState<T[K]>
) => void;

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const ModalContext = React.createContext<ModalDispatch<any>>(() => {});

export const useModal = () => React.useContext(ModalContext);

export function createModalHook<T extends ModalConfigMap>() {
  return () => React.useContext<ModalDispatch<T>>(ModalContext);
}
