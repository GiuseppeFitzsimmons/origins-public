import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
//import {useHistory} from "react-router-dom";
import { useState, useEffect } from 'react';
import "../App.css";
import getEnvironment from '../environment';
import { CircularProgress } from '@material-ui/core';
import axios from 'axios';
export default function Videos(props) {
    //    const history = useHistory();
    const [status, setStatus] = useState('idle');
    const [tag, setTag] = useState('');
    const [view, setView] = useState('favourites');
    const [videosByTag, setVideosByTag] = useState([]);
    const [videosByFavourite, setVideosByFavourite] = useState([]);
    const getVideosByTag = () => {
        if (status != 'idle') {
            return;
        }
        setStatus('busy');
        let env = getEnvironment();
        axios.get(`${env.api}/videotag/${tag}`).then(res => {
            setVideosByTag(res.data.videos);
            setView('tag');
            setStatus('idle');
        }).catch(err => {
            alert(err);
            setStatus('idle');
        });
    };
    const getVideosByFavourite = () => {
        if (status != 'idle') {
            return;
        }
        setStatus('busy');
        let env = getEnvironment();
        axios.get(`${env.api}/favourite`, { headers: {
                'Authorization': `Bearer ${props.token}`
            } }).then(res => {
            setVideosByFavourite(res.data.videos);
            setView('favourite');
            setStatus('idle');
        }).catch(err => {
            alert(err);
            setStatus('idle');
        });
    };
    const displayVideo = (video) => {
        return _jsxs("div", { children: [_jsx("a", Object.assign({ href: video.url }, { children: video.name }), void 0), _jsx("br", {}, void 0), _jsx("i", { children: video.description }, void 0), _jsx("br", {}, void 0), video.updatedAt, _jsx("br", {}, void 0)] }, void 0);
    };
    const [videosList, setDisplayVideos] = useState(_jsx(_Fragment, {}, void 0));
    useEffect(() => {
        console.log(view);
        var display;
        if (view === 'tag') {
            display = videosByTag.map((video) => _jsx(_Fragment, { children: displayVideo(video) }, void 0));
        }
        else {
            display = videosByFavourite.map((video) => _jsx(_Fragment, { children: displayVideo(video) }, void 0));
        }
        console.log(display);
        //@ts-ignore
        setDisplayVideos(display);
    }, [view]);
    return (_jsxs("main", Object.assign({ style: { padding: 0 } }, { children: [_jsx(CircularProgress, { style: { display: status === 'busy' ? '' : 'none' } }, void 0), _jsx("div", Object.assign({ className: "App" }, { children: _jsx("form", Object.assign({ className: "form", onSubmit: () => alert() }, { children: _jsxs("div", Object.assign({ className: "input-group" }, { children: [_jsx("label", Object.assign({ htmlFor: "tag" }, { children: "Tag" }), void 0), _jsx("input", { type: "text", name: "tag", placeholder: "noel", onChange: e => setTag(e.target.value) }, void 0)] }), void 0) }), void 0) }), void 0), _jsx("br", {}, void 0), _jsx("button", Object.assign({ onClick: () => getVideosByTag(), className: "primary" }, { children: "Chercher par tag" }), void 0), _jsx("br", {}, void 0), _jsx("button", Object.assign({ onClick: () => getVideosByFavourite(), className: "primary" }, { children: "Chercher par favori" }), void 0), _jsxs("div", { children: [view, _jsx("br", {}, void 0), videosList] }, void 0)] }), void 0));
}
