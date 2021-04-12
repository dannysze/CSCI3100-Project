import React, {useState} from 'react';
import {useLocation} from 'react-router-dom';
import getaddr from '../components/getaddr';

const ResetPassword = () => {
    //from https://www.youtube.com/watch?v=jd6Sz2sDPJc&ab_channel=uidotdev
    const {search} = useLocation();
    const searchParams = new URLSearchParams(search);
    const token = searchParams.get('token');
    const user_id = searchParams.get('user_id');

    const [resetResult, setResetResult] = useState({errormsg:"",alert:false})
    const [valid, setValid] = useState(true);
    const [password, setPassword] = useState('');
    const [doublepassword, setDoublePassword] = useState('');
    const onChangeHandler = event => {
        event.preventDefault();
        setResetResult({errormsg:"",alert:false});
        if(event.target.name=='pw'){
            doublepassword!=event.target.value?setValid(false):setValid(true);
            setPassword(event.target.value);
        }
        else{
            password!=event.target.value?setValid(false):setValid(true);
            setDoublePassword(event.target.value);
        }
    };
    const sendRequest = async event => {
        event.preventDefault();
        if(!password||!valid){
            setResetResult({errormsg:'No fields should be blank', alert:true});
            return;
        };
        let res = await fetch(getaddr()+'reset_password?token='+token+'&user_id='+user_id, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({password:password}),
          });
          let body = await res.json();
          if (!res.ok){
                setResetResult({'errorMsg':body['error'], 'alert':true});
          }else{
            setResetResult({'errorMsg':body['You have successfully changed your password! You can try to login with new password'], 'alert':true});
          }
    };
    return (
        <div>
            {(token&&user_id)&&
            <form>
                <label for='pw'><b>Password</b></label><br/>
                <input type='password' name='pw' id='pw' placeholder='password' onChange={onChangeHandler}></input><br/>
                <label for='doublepw'><b>Input password again</b></label><br/>
                <input type='password' name='doublepw' id='doublepw'  placeholder='Password again' onChange={onChangeHandler}></input><br/>
                {!valid==true&&<div style={{color:'red'}}>Password does not match</div>}
                <button type="submit" style={{marginTop:'15px'}} onClick={sendRequest}>Submit</button>
                {resetResult.alert&&<div style={{color:'red'}}>{resetResult.errorMsg}</div>}
            </form>
            }
        </div>
    )
}

export default ResetPassword
