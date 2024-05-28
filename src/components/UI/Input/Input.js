import { useImperativeHandle, useRef, forwardRef } from 'react';
import cx from './Input.module.css';

const Input = forwardRef((props, ref) => {
  const inputRef = useRef();

  const activate = () => {
    inputRef.current.focus();
  };

  useImperativeHandle(ref, () => ({ focus: activate }));

  return (
    <div
      className={`${cx.control} ${props.isValid === false ? cx.invalid : ''}`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      <input
        ref={inputRef}
        type={props.type}
        id={props.id}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
      />
    </div>
  );
});

export default Input;
