import { Component } from '@angular/core';
import { FormBuilder, Validators , FormGroup} from '@angular/forms';
import { io, Socket } from "socket.io-client"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
 title = 'SSEClient';
 
 public myval:string='hello'
 public source:any
  constructor(
   
  )
  { }

  public connect()
  {
    this.source = new EventSource('http://localhost:1234/talk');
    this.source.addEventListener('open', function(e:any) {
    console.log("'Connections to the server established..<br/>'")
    }, false);
    this.source.onmessage = function(e:any) {
    let myval1= e.data;
    console.log("my id: "+myval1)
  };
  
  }

  public disconnect()
  {
    console.log('Listening to server events stopped..<br/>');
    this.source.close();
  }

  public send()
  {
      let peerID=((document.getElementById("peerid") as HTMLInputElement).value)
      let message=((document.getElementById("message") as HTMLInputElement).value)
      console.log("peeriD: "+peerID)
      console.log("message: "+message)
      const socket = io("ws://localhost:1234");

      socket.on("connect", () => {
        // either with send()
      //  socket.send("Hello!");

        // or with emit() and custom event names
        socket.emit("peerData",{ peerID,message} ,(response:any)=>
        {
             if(response.success)
             {
                 console.log("successfully sent message")
             }
        } );
      });


  }
}

