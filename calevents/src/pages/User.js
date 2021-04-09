import React from 'react';
import {useState, useEffect} from 'react';
import useToken from '../useToken';
import getaddr from '../components/getaddr'


//example for getting user info, update profile pic and potentially other info
const User = () => {
    const {token, setToken} = useToken();
    const [user, setUser] = useState({});
    const [reload, setReload] = useState(false);
    //this gets the user info by token, change to /userinfo/:uid for general user
    const getUser = async () => {
        try{
          //change getaddr() to getaddr(isLocal=false) to make it use remote address
          //basically passing the token by the header
          let res = await fetch(getaddr()+'user', {
            method: 'GET',
            headers: {
              'auth': token,
              'Content-Type': 'application/json',
            },
            //body: JSON.stringify({token:token}),
          });
          let body = await res.json();
          setUser(body);
        }catch(err){
          console.log(err);
        }
      }

    useEffect(() => {
      getUser();
      console.log(user)
    },[token,reload]);

    var pfp;
    const fileSelectedHandler = event => {
      pfp = event.target.files[0];
    }

    const fileUploadHandler = async event => {
      event.preventDefault();
      let data = new FormData();
      if(!pfp) return;
      data.append('pfp', pfp);
      await fetch(getaddr()+'updatepfp', {
        method: 'POST',
        headers: {
          'auth': token,
          //'Content-Type': 'multipart/form-data',
        },
        body: data,
      });
      setReload(!reload);
    }

    return (
        <div>
            {Object.entries(user).map(([key, val])=>((key=='img_loc')?(<img src={val} style={{width:"150px"}}/>):<p>{key} : {val}</p>))}
            <form>
                <input type="file" accept="image/*" onChange={fileSelectedHandler}></input>
                <button type="submit" onClick={fileUploadHandler}></button>
            </form>

        </div>
    )
}

export default User
