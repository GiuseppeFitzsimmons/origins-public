import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './screens/Login';
import Videos from './screens/Videos';
function App() {
    const [token, setToken] = useState('');
    return (_jsx("div", Object.assign({ className: "App" }, { children: _jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Login, { setToken: setToken }, void 0) }, void 0), _jsx(Route, { path: "/login", element: _jsx(Login, { setToken: setToken }, void 0) }, void 0), _jsx(Route, { path: "/videos", element: _jsx(Videos, { token: token }, void 0) }, void 0)] }, void 0) }, void 0) }), void 0));
}
export default App;
