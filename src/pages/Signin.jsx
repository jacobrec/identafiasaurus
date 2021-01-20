import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const Frame = (props) => <div className="jframe">
                           {props.children}
                         </div>;

const State = {
  GetEmail: "getting email",
  Signin: "sign in",
  Signup: "sign up",
  Validating: "validating",
  Complete: "done",
}
const bindInputToState = (setter) => (event) => setter(event.target.value);


const checkEmail = (email, setState, history) => {
  axios.get(`/api/checkemail/${email}`)
    .then(() => {
      setState(State.Signin);
      axios.post('/api/signin', {email})
        .then(() => {
          setState(State.Validating);
          pollForUpgrade(setState, history);
        })
        .catch((e) => console.log('Could not start signin', e));
    })
    .catch(() => setState(State.Signup));
};

const signup = (email, username, setState, history) => {
  console.log(email);
  axios.post('/api/signin', {email, username})
    .then(() => {
      setState(State.Validating);
      pollForUpgrade(setState, history);
    })
    .catch(() => console.log('Could not start signup'));
};

const pollForUpgrade = (setState, history) => {
  console.log('Polling');
  axios.get('/api/upgrade')
    .then(() => {
      console.log('polling complete');
      setState(State.Complete);
      history.push('/');
    })
    .catch(() =>
      window.setTimeout(() => {
        console.log('polling contine');
        pollForUpgrade(setState, history);
      }, 5000),
    );
};

const SignIn = () => {
  const [state, setState] = useState(State.GetEmail);
  const [email, setEmail] = useState('jacob@reckhard.ca');
  const [username, setUsername] = useState('');
  const history = useHistory();

  switch (state) {
  case State.GetEmail:
    return (
      <Frame>
        <h1>Getting email</h1>
        <input
          value={email}
          key="emailinput"
          type="email"
          placeholder="email@example.com"
          onChange={bindInputToState(setEmail)}
        />
        <button onClick={() => checkEmail(email, setState, history)}>Next</button>
      </Frame>
    );
  case State.Signin:
    return (
      <Frame>
        <p>Signin</p>
      </Frame>
    );
  case State.Signup:
    return (
      <Frame>
        <h1>Signup</h1>
        <input
          key="nameinput"
          type="text"
          placeholder="Name"
          onChange={bindInputToState(setUsername)}
        />
        <button onClick={() => signup(email, username, setState, history)}>
          Next
        </button>
      </Frame>
    );
  case State.Validating:
    return (
      <Frame>
        <h1>Validating</h1>
      </Frame>
    );
  case State.Complete:
    return (
      <Frame>
        <h1>Done</h1>
      </Frame>
    );
  default:
    return (
      <Frame>
        <h1>An error has occured :(</h1>
      </Frame>
      );
    }
  };

export default SignIn;
