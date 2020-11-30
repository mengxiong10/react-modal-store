# react-modal-store

> Centralized management of modal. Manage visible prop and handle onClose event Automatically

[React 弹窗管理的思考](https://github.com/mengxiong10/blog/issues/11)

<a href="https://www.npmjs.com/package/react-modal-store">
  <img src="https://img.shields.io/npm/v/react-modal-store.svg" alt="npm">
</a>
<a href="LICENSE">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT">
</a>

## Install

```bash
$ npm install react-modal-store --save
```

## Usage

```jsx
import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import { Modal } from 'antd';
import { ModalStore, useModal } from 'react-modal-store';

function Modal1({ text, visible, onCancel, afterClose }) {
  return (
    <Modal title="It's m1" visible={visible} onCancel={onCancel} afterClose={afterClose}>
      <div>{text}</div>
    </Modal>
  );
}

function Modal2({ name, visible, onCancel, afterClose }) {
  return (
    <Modal title="It's m2" visible={visible} onCancel={onCancel} afterClose={afterClose}>
      <div>{name}</div>
    </Modal>
  );
}

const modalMap = {
  m1: Modal1,
  m2: Modal2,
};

function App() {
  return (
    <ModalStore modalMap={modalMap} destroyOnClose="afterClose">
      <Content />
    </ModalStore>
  );
}

function Content() {
  const dispatchModal = useModal();

  return (
    <div>
      <button type="button" onClick={() => dispatchModal('m1', { text: 'm1 content' })}>
        show m1
      </button>
      <button type="button" onClick={() => dispatchModal('m2', { name: 'm2 content' })}>
        show m2
      </button>
    </div>
  );
}
```

### ModalStore

| Prop            | Description                                                                                                                     | Type     | Default    |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------- |
| visiblePropName | the prop name that controls the modal display                                                                                   | `string` | 'visible'  |
| onClosePropName | the prop name that closes the modal by set `visible = false`                                                                    | `string` | 'onCancel' |
| destroyOnClose  | Whether to unmount modal on close, if this value is a string, it'll unmount when calling this method instead of onClosePropName | `boolean | string`    | true |
| modalMap        | all the modals by key-value                                                                                                     | `object` |            |

### useModal

The hook return a function to open a new modal.

```jsx
const dispatchModal = useModal();

<button onClick={() => dispatchModal('key', {})}></button>;
```

## License

[MIT](https://github.com/mengxiong10/react-modal-store/blob/master/LICENSE)

Copyright (c) 2020-present xiemengxiong
