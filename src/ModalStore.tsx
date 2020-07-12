import React from 'react';
import { ModalStoreContext, ModalStoreContextValue } from './Context';

export interface ModalConfig {
  key: string;
  component: React.ComponentType<any>;
  destroyOnClose?: boolean;
  visiblePropName?: string;
  closePropName?: string;
}

export interface ModalManagerProps {
  children: React.ReactNode;
  modalConfigs: ModalConfig[];
}

interface ModalItem {
  key: string;
  state: any;
}

interface ModalStoreState {
  modals: ModalItem[];
}

class ModalStore extends React.Component<ModalManagerProps, ModalStoreState> {
  contextValue: ModalStoreContextValue;

  constructor(props: ModalManagerProps) {
    super(props);
    this.state = {
      modals: [],
    };
    this.contextValue = {
      push: this.push.bind(this),
    };
  }

  private setModals(fn: (prev: ModalItem[]) => ModalItem[]) {
    this.setState((prev) => {
      return {
        modals: fn(prev.modals),
      };
    });
  }

  private getCloseFunction(key: string, prop: string, cb?: (...args: any[]) => void) {
    return (...args: any[]) => {
      this.setModals((prev) => {
        return prev.map((v) => {
          if (v.key === key) {
            return { key, state: { ...v.state, [prop]: false } };
          }
          return v;
        });
      });
      if (typeof cb === 'function') {
        cb(...args);
      }
    };
  }

  private push(key: string, state: any) {
    const { modalConfigs } = this.props;
    const config = modalConfigs.find((item) => item.key === key);
    if (!config) {
      return;
    }

    const { visiblePropName = 'visible', closePropName = 'onCancel' } = config;

    this.setModals((prevModals) => {
      const nextModals = prevModals.slice();
      const index = nextModals.findIndex((item) => item.key === key);
      const defaultProps = {
        [visiblePropName]: true,
        [closePropName]: this.getCloseFunction(key, visiblePropName, state[closePropName]),
      };
      const newModal = { key, state: { ...state, ...defaultProps } };

      if (index !== -1 && nextModals[index].state[visiblePropName] === false) {
        nextModals.splice(index, 1);
      }

      nextModals.push(newModal);

      return nextModals;
    });
  }

  private renderModal({ key, state }: { key: string; state: any }) {
    const { modalConfigs } = this.props;
    const config = modalConfigs.find((item) => item.key === key);
    if (!config || !config.component) return null;
    return React.createElement(config.component, { ...state, key });
  }

  render() {
    const { modals } = this.state;
    const { children } = this.props;
    return (
      <ModalStoreContext.Provider value={this.contextValue}>
        {children}
        {modals.map(this.renderModal)}
      </ModalStoreContext.Provider>
    );
  }
}

export default ModalStore;
