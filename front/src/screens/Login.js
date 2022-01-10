import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
//import {useHistory} from "react-router-dom";
import { useState } from 'react';
import "../App.css";
import getEnvironment from '../environment';
import { CircularProgress } from '@material-ui/core';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
export default function Login(props) {
    const navigate = useNavigate();
    const [status, setStatus] = useState('idle');
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const handleLogin = () => {
        if (status != 'idle') {
            return;
        }
        setStatus('busy');
        let env = getEnvironment();
        axios.post(env.api + '/login', { id, password }).then(res => {
            props.setToken(res.data.access_token);
            setStatus('idle');
            navigate('/videos');
        }).catch(err => {
            alert(err);
            setStatus('idle');
        });
    };
    const handleRegister = () => {
        if (status != 'idle') {
            return;
        }
        setStatus('busy');
        let env = getEnvironment();
        axios.post(env.api + '/user', { id, password }).then(res => {
            props.setToken(res.data.access_token);
            setStatus('idle');
            navigate('/videos');
        }).catch(err => {
            alert(err);
            setStatus('idle');
        });
    };
    return (_jsxs("main", Object.assign({ style: { padding: 0 } }, { children: [_jsx(CircularProgress, { style: { display: status === 'busy' ? '' : 'none' } }, void 0), _jsxs("div", Object.assign({ className: "App" }, { children: [_jsxs("form", Object.assign({ className: "form", onSubmit: () => handleLogin() }, { children: [_jsxs("div", Object.assign({ className: "input-group" }, { children: [_jsx("label", Object.assign({ htmlFor: "email" }, { children: "Email" }), void 0), _jsx("input", { type: "email", name: "email", placeholder: "name@email.com", onChange: e => setId(e.target.value) }, void 0)] }), void 0), _jsxs("div", Object.assign({ className: "input-group" }, { children: [_jsx("label", Object.assign({ htmlFor: "password" }, { children: "Password" }), void 0), _jsx("input", { type: "password", name: "password", onChange: e => setPassword(e.target.value) }, void 0)] }), void 0)] }), void 0), _jsx("button", Object.assign({ className: "secondary", onClick: () => handleLogin() }, { children: "Login" }), void 0)] }), void 0), _jsx("br", {}, void 0), _jsx("button", Object.assign({ onClick: () => handleRegister(), className: "primary" }, { children: "Register" }), void 0)] }), void 0));
}
