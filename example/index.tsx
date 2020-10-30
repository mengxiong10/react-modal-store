import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import { Modal } from 'antd';
import { ModalStore, ModalStoreContext } from '../src';
import 'antd/dist/antd.css';

function M1({ text, ...rest }: any) {
  return (
    <Modal title="m1" {...rest}>
      <div>{text}</div>
    </Modal>
  );
}

function M2({ name, ...rest }: any) {
  return (
    <Modal title="m2" {...rest}>
      <div>{name}</div>
    </Modal>
  );
}

function Content() {
  const dispatchModal = useContext(ModalStoreContext);

  console.log('render content');

  return (
    <div>
      <button type="button" onClick={() => dispatchModal('m1', { text: '我是m1' })}>
        show m1
      </button>
      <button type="button" onClick={() => dispatchModal('m2', { name: '我是m2' })}>
        show m2
      </button>
    </div>
  );
}

const modals = {
  m1: M1,
  m2: M2,
};

function App() {
  return (
    <ModalStore modals={modals} destroyOnClose="afterClose">
      <Content />
    </ModalStore>
  );
}

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
