import {useState} from 'react';
import { useMutation, gql } from '@apollo/client';
import './Login.css';

const LOGIN = gql`
mutation($username: String!, $password: String!) {
    login(username: $username, password: $password) {
        user {
            id                
            username
            password
        }
        token
    }
}
`;

const REGISTER = gql`
mutation($username: String!, $password: String!) {
register(username: $username, password: $password) {                
    username
    password
}
}
`;

function Login ({setToken, updateUsername}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [register] = useMutation(REGISTER);
    const [login] = useMutation(LOGIN);

    const handleRegister = async () => {
        var response = await register({ variables: { username, password } });
        console.log(response)
    };

    const handleLogin = async () => {
        const { data } = await login({ variables: { username, password } });
        console.log(data)
        setToken(data.login.token);
        updateUsername(username)
    };

    return (<div className='login_container'>
                <div className='form_container'>
                    <p className='title'>Chat Up!</p>
                    <input
                        className='input_text'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                    />
                    <input
                        className='input_text'
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                    <div className='form_actions_container'>
                        <button className='action_button' onClick={handleRegister}>Register</button>
                        <button className='action_button' onClick={handleLogin}>Login</button>
                    </div>
                </div>
            </div>)
};

export default Login;