import React from 'react';

const Modal = (props) => {
  return (
    <div
      onClick={props.onDismiss}
      className="ui dimmer modals visible active"
      style={{ position: 'fixed' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="ui standard modal visible active"
        style={{ position: 'fixed' }}
      >
        <div className="header">{props.title}</div>
        <div className="content">{props.content}</div>
        <div className="actions">{props.actions}</div>
      </div>
    </div>
  );
};

export default Modal;
