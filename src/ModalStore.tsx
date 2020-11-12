import React from 'react';
import { ModalContext } from './Context';

export interface ModalFullConfig<T = any> {
  destroyOnClose?: boolean | string;
  visiblePropName?: string;
  onClosePropName?: string;
  component: React.ComponentType<T>;
}

export type ModalConfig<T = any> = ModalFullConfig<T> | React.ComponentType<T>;

export type ModalConfigMap = Record<string, ModalConfig>;

export interface ModalStoreProps extends Omit<ModalFullConfig, 'component'> {
  children: React.ReactNode;
  modalMap: ModalConfigMap;
}

export interface ModalItem extends Record<string, any> {
  key: string;
}

export interface ModalStoreState {
  currentModal: ModalItem[];
}

class ModalStore extends React.Component<ModalStoreProps, ModalStoreState> {
  constructor(props: ModalStoreProps) {
    super(props);
    this.state = {
      currentModal: [],
    };
  }

  private getModalConfig(key: string) {
    const {
      modalMap = {},
      visiblePropName = 'visible',
      onClosePropName = 'onCancel',
      destroyOnClose = true,
    } = this.props;
    let config = modalMap[key];
    if (typeof config === 'function') {
      config = { component: config };
    }
    return { visiblePropName, onClosePropName, destroyOnClose, ...config };
  }

  private setModalsState(fn: (prev: ModalItem[]) => ModalItem[]) {
    this.setState((prev) => ({ currentModal: fn(prev.currentModal) }));
  }

  private getCloseFunction(key: string, cb?: (...args: any[]) => void) {
    return (...args: any[]) => {
      const { visiblePropName } = this.getModalConfig(key);
      this.setModalsState((prev) => {
        return prev.map((v) => {
          if (v.key === key) {
            return { ...v, [visiblePropName]: false };
          }
          return v;
        });
      });
      if (typeof cb === 'function') {
        cb(...args);
      }
    };
  }

  private getDestroyFunction(key: string, cb?: (...args: any[]) => void) {
    return (...args: any[]) => {
      this.setModalsState((prev) => prev.filter((v) => v.key !== key));
      if (typeof cb === 'function') {
        cb(...args);
      }
    };
  }

  private push = (key: string, state: any) => {
    const { visiblePropName, onClosePropName, destroyOnClose } = this.getModalConfig(key);

    this.setModalsState((prevModals) => {
      const defaultProps: any = {
        [visiblePropName]: true,
        [onClosePropName]: this.getCloseFunction(key, state[onClosePropName]),
      };
      if (destroyOnClose) {
        const prop = typeof destroyOnClose === 'string' ? destroyOnClose : onClosePropName;
        defaultProps[prop] = this.getDestroyFunction(key);
      }

      const newModal = { ...state, ...defaultProps, key };

      const nextModals = prevModals.slice();
      const index = nextModals.findIndex((item) => item.key === key);
      if (index !== -1) {
        nextModals.splice(index, 1);
      }
      nextModals.push(newModal);

      return nextModals;
    });
  };

  private renderModal = (item: ModalItem) => {
    const { component } = this.getModalConfig(item.key);
    if (!component) return null;
    return React.createElement(component, item);
  };

  render() {
    const { currentModal } = this.state;
    const { children } = this.props;
    return (
      <ModalContext.Provider value={this.push}>
        {children}
        {currentModal.map(this.renderModal)}
      </ModalContext.Provider>
    );
  }
}

export default ModalStore;
