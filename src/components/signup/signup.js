import { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../UI/Card/Card';
import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';
import classes from './Signup.module.css';
import { Helmet } from 'react-helmet';
import AuthContext from '../../store/auth-context';

const emailReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return { value: action.value, isValid: action.value.includes('@') };
  }

  if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.includes('@') };
  }

  return { value: '', isValid: false };
};

const passwordReducer = (state, action) => {
  const value = action.value || '';
  const isValid = value.trim().length > 6;

  if (action.type === 'USER_INPUT') {
    return { value: value, isValid: isValid };
  }

  if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }

  return { value: '', isValid: false };
};

const confirmPasswordReducer = (state, action) => {
  const value = action.value || '';
  const isValid = value.trim().length > 6;

  if (action.type === 'USER_INPUT') {
    return { value: value, isValid: isValid };
  }

  if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }

  return { value: '', isValid: false };
};

const Signup = () => {
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: '',
    isValid: null,
  });

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: '',
    isValid: null,
  });

  const [confirmPasswordState, dispatchConfirmPassword] = useReducer(confirmPasswordReducer, {
    value: '',
    isValid: null,
  });

  const [usernameState, setUsernameState] = useState({ value: '', isValid: null });

  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;
  const { isValid: confirmPasswordIsValid } = confirmPasswordState;
  const { isValid: usernameIsValid } = usernameState;

  const emailInputRef = useRef();
  const usernameInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();

  useEffect(() => {
    const identifier = setTimeout(() => {
      setFormIsValid(
        emailIsValid &&
        usernameIsValid &&
        passwordIsValid &&
        confirmPasswordIsValid &&
        passwordState.value === confirmPasswordState.value
      );
    }, 100);

    return () => {
      clearTimeout(identifier);
    };
  }, [emailIsValid, usernameIsValid, passwordIsValid, confirmPasswordIsValid, passwordState.value, confirmPasswordState.value]);

  const emailChangeHandler = event => {
    dispatchEmail({ type: 'USER_INPUT', value: event.target.value });
  };

  const passwordChangeHandler = event => {
    dispatchPassword({ type: 'USER_INPUT', value: event.target.value });
  };

  const confirmPasswordChangeHandler = event => {
    dispatchConfirmPassword({ type: 'USER_INPUT', value: event.target.value });
  };

  const usernameChangeHandler = event => {
    const value = event.target.value;
    setUsernameState({ value: value, isValid: value.trim().length >= 4 });
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: 'INPUT_BLUR' });
  };

  const validatePasswordHandler = () => {
    dispatchPassword({ type: 'INPUT_BLUR' });
  };

  const validateConfirmPasswordHandler = () => {
    dispatchConfirmPassword({ type: 'INPUT_BLUR' });
  };

  const validateUsernameHandler = () => {
    setUsernameState(prevState => ({ ...prevState, isValid: prevState.value.trim().length >= 4 }));
  };

  const submitHandler = event => {
    event.preventDefault();
    if (formIsValid) {
      authCtx.onSignup(emailState.value, usernameState.value, passwordState.value);
      navigate('/login');
    } else {
      if (!emailIsValid) {
        alert('Please enter a valid email.');
        emailInputRef.current.focus();
      } else if (!usernameIsValid) {
        alert('Username must be at least 6 characters long.');
        usernameInputRef.current.focus();
      } else if (!passwordIsValid) {
        alert('Password must be at least 7 characters long.');
        passwordInputRef.current.focus();
      } else if (passwordState.value !== confirmPasswordState.value) {
        alert('Passwords do not match.');
        confirmPasswordInputRef.current.focus();
      } else if (!confirmPasswordIsValid) {
        alert('Please confirm your password.');
        confirmPasswordInputRef.current.focus();
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <Card className={classes.signup}>
        <h2 className="title">Sign Up</h2>
        <form onSubmit={submitHandler}>
          <Input
            ref={emailInputRef}
            isValid={emailState.isValid}
            label="Email"
            type="email"
            id="Email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
          <Input
            ref={usernameInputRef}
            isValid={usernameState.isValid}
            label="Username"
            type="text"
            id="username"
            value={usernameState.value}
            onChange={usernameChangeHandler}
            onBlur={validateUsernameHandler}
          />
          <Input
            ref={passwordInputRef}
            isValid={passwordState.isValid}
            label="Password"
            type="password"
            id="password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
          <Input
            ref={confirmPasswordInputRef}
            isValid={confirmPasswordState.isValid}
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            value={confirmPasswordState.value}
            onChange={confirmPasswordChangeHandler}
            onBlur={validateConfirmPasswordHandler}
          />
          <div className={classes.actions}>
            <Button type="submit" className={classes.btn}>
              Submit
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
};

export default Signup;
