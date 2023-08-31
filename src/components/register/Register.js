import { useState } from "react";
import React from 'react';


const Register = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [fullname, setFullname] = useState('');

    const send = (e) => {
        e.preventDefault();
        console.log('test');

        fetch('http://quhan.site/api/auth/register', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                login, 
                password,
                repeatPassword,
                fullname
            })
        }).then(res => {
            if(res.status === 200) {
                res.json().then(data => {
                    // dispatch(set(data.user));
                    // console.log(data);
                    window.localStorage.setItem('jwt-token', data.jwt);
                    window.localStorage.setItem('id', data.user.id);

                    window.location.href = 'http://quhan.site/';
                })
            }
        })
    }

    return(
        <form className="register" onSubmit={(e) => send(e)}>
            <input value={login} onChange={(e) => setLogin(e.currentTarget.value)} type="text" className="register_login" />
            <input value={password} onChange={(e) => setPassword(e.currentTarget.value)} type="text" className="register_password" />
            <input value={repeatPassword} onChange={(e) => setRepeatPassword(e.currentTarget.value)} type="text" className="register_repeatPassword" />
            <input value={fullname} onChange={(e) => setFullname(e.currentTarget.value)} type="text" className="register_fullname" />
        </form>
    )
}

export default Register;