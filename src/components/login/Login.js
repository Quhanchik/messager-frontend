import { useState } from 'react';
import './Login.scss';
import { useDispatch } from 'react-redux';

import { set } from '../../slices/userSlice';

const Login = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();

    const submitForm = (e) => {
        e.preventDefault();
        console.log('test');

        fetch('http://localhost:8080/auth/login', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                login, 
                password
            })
        }).then(res => {
            if(res.status === 200) {
                res.json().then(data => {
                    // dispatch(set(data.user));
                    // console.log(data);
                    window.localStorage.setItem('jwt-token', data.jwt);
                    window.localStorage.setItem('id', data.user.id);

                    window.location.href = 'http://localhost:3000/';
                })
            }
        })
    }

    return(
        <div className="login">
            <form 
                className="login_form"
                onSubmit={(e) => submitForm(e)}
            >
                <input 
                    type="text" 
                    className="login_login" 
                    placeholder='login'
                    value={login}
                    onChange={(e) => setLogin(e.currentTarget.value)}
                />
                <input 
                    type="text" 
                    className="login_password" 
                    placeholder='password'
                    value={password}
                    onChange={(e) => setPassword(e.currentTarget.value)}    
                />
                <input type="submit" value="Log in"/>
            </form>
        </div>
    )
}

export default Login;