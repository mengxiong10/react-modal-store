import React from 'react';
import ReactDOM from 'react-dom';
import { Modal } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { ModalStore, createModalHook } from '../src';
import 'antd/dist/antd.css';

interface M1Props extends ModalProps {
  text: string;
  onCancel: () => void;
}

interface M2Props extends ModalProps {
  name: string;
  onCancel: () => void;
}

function M1({ text, onCancel, ...rest }: M1Props) {
  return (
    <Modal title="m1" onOk={onCancel} onCancel={onCancel} {...rest}>
      <div>{text}</div>
    </Modal>
  );
}

function M2({ name, onCancel, ...rest }: M2Props) {
  return (
    <Modal title="m2" onOk={onCancel} onCancel={onCancel} {...rest}>
      <div>{name}</div>
    </Modal>
  );
}

const modalMap = {
  m1: M1,
  m2: M2,
};

const useModal = createModalHook<typeof modalMap>();

function Content() {
  const dispatchModal = useModal();

  return (
    <div>
      <button type="button" onClick={() => dispatchModal('m1', { text: 'ok' })}>
        show m1
      </button>
      <button type="button" onClick={() => dispatchModal('m2', { name: 'm2' })}>
        show m2
      </button>
    </div>
  );
}

function App() {
  return (
    <ModalStore modalMap={modalMap} destroyOnClose="afterClose">
      <Content />
    </ModalStore>
  );
}

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
