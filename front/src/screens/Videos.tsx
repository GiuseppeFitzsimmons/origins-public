
//import {useHistory} from "react-router-dom";
import React, {useCallback, useState, useEffect} from 'react';
import "../App.css";
import getEnvironment from '../environment'
import {CircularProgress} from '@material-ui/core';
import axios from 'axios';
import video from '../../../back/models/video';

export default function Videos(props: any) {
//    const history = useHistory();
  const [status, setStatus] = useState('idle');
  const [tag, setTag] = useState('');
  const [view, setView] = useState('favourites');
  const [videosByTag, setVideosByTag] = useState([]);
  const [videosByFavourite, setVideosByFavourite] = useState([]);
  const getVideosByTag = () => {
    if (status!='idle') {
      return;
    }
    setStatus('busy');
    let env=getEnvironment();
    axios.get(`${env.api}/videotag/${tag}`).then(res=>{
        setVideosByTag(res.data.videos);
        setView('tag');
        setStatus('idle');
    }).catch(err=>{
      alert(err);
      setStatus('idle');
    })
  };
  const getVideosByFavourite = () => {
    if (status!='idle') {
      return;
    }
    setStatus('busy');
    let env=getEnvironment();
    axios.get(`${env.api}/favourite`,
        {headers: {
            'Authorization': `Bearer ${props.token}` 
        }}
        ).then(res=>{
        setVideosByFavourite(res.data.videos);
        setView('favourite');
        setStatus('idle');
    }).catch(err=>{
      alert(err);
      setStatus('idle');
    })
  };
    const displayVideo = (video: any ) => {
        return <div><a href={video.url}>{video.name}</a><br/><i>{video.description}</i><br/>{video.updatedAt}<br/></div>;
    }
    const [videosList, setDisplayVideos] = useState(<></>);
    useEffect(()=>{
        console.log(view)
        var display;
        if (view==='tag') {
            display = videosByTag.map((video) =>
                <>{displayVideo(video)}</>
            );
        } else {
            display = videosByFavourite.map((video) =>
                <>{displayVideo(video)}</>
            );
        }
        console.log(display)
        //@ts-ignore
        setDisplayVideos(display);
    }, [view])
  return (
    <main style={{ padding: 0 }}>
      <CircularProgress style={{display:status==='busy'?'':'none'}} />
      <div className="App">
        <form className="form" onSubmit={() => alert()}>
        <div className="input-group">
          <label htmlFor="tag">Tag</label>
          <input type="text" name="tag" placeholder="noel" onChange={e=>setTag(e.target.value)}/>
        </div>
      </form>
        </div><br />
        <button onClick={() => getVideosByTag()} className="primary">
            Chercher par tag
        </button><br />
        <button onClick={() => getVideosByFavourite()} className="primary">
            Chercher par favori
        </button>
      <div>
         {view}<br/>
        {videosList}
      </div>
    </main>
  );
}