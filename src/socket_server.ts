import { Server } from "socket.io"
import http from 'http';

let usersSockets = new Map();

//Function from Github which helps to do an accurate calculation of the key
//Refernce can be found in the project's report
const modularExponentiation = (a:number, b:number, n:number)=> {
    a = a % n;
    var result = 1;
    var x = a;
  
    while(b > 0){
      var leastSignificantBit = b % 2;
      b = Math.floor(b / 2);
  
      if (leastSignificantBit == 1) {
        result = result * x;
        result = result % n;
      }
  
      x = x * x;
      x = x % n;
    }
    return result;
  };
export = (server: http.Server) => {
    const io = new Server(server, {cors: {
        origin: "http://10.0.2.2:8081",
      },});
    
    io.on('connection', (socket) => {
        console.log('a user connected ' + socket.id);
        socket.join("chatRoom");
        socket.onAny((eventName, args) => {
            console.log("on event: " + eventName)
            socket.emit('echo', args)
        })
        //The server sends the encrypted message to the users in the room "chatRoom"
        socket.on('sendMessage', (message) => {
            io.sockets.to("chatRoom").emit('getMessage', {"content": message.messageContent, "owner": message.owner,"time":message.time});
        })
        // The server calculates its private key and keeps the user's socket in a dictionary.
        socket.on("getPublicKeyServer", (clientKey,callback) => {
            usersSockets.set(socket.id, modularExponentiation(clientKey.key,parseInt(process.env.SERVER_CODE), parseInt(process.env.P_VALUE)))
            callback({key:usersSockets.get(socket.id)})
        })

        //The server calculates its public key and sends to client
        socket.on("setPublicKeyServer", async(callbackFn) => {
                const gValue = parseInt(process.env.G_VALUE)
                const pValue = parseInt(process.env.P_VALUE)
                const sCode = parseInt(process.env.SERVER_CODE)
                const res = modularExponentiation(gValue, sCode,pValue)
                callbackFn({publicKey: [res, pValue, gValue]})
            
        })
        
        //The server sends its dictionary of users
        socket.on("getKeysFromServer", async(callback) => {
            callback({data: Array.from(usersSockets)})
            
        })

        //Remove  socket of a user from the server's dictionary
        socket.on("RemoveSocket", (socket) => {
            usersSockets.delete(socket.socketID)
        })
    })
    return io
}