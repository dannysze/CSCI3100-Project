//for getting address for backend
//return local address if true
//return remote address if false
const getaddr = (isLocal=true) => {
    const remote = {address: 'csci3100-proj.cobhjw2xjj8l.us-east-1.rds.amazonaws.com',
              port: 3306,
             }
    const localPort = 5000;
    
    if (isLocal){
        return 'http://localhost:' + localPort + '/';
    }else{
        return 'http://' + remote.address + ':' + remote.port + '/';
    }
}

export default getaddr


