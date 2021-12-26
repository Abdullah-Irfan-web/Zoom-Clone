
let videogrid=document.getElementById('video-grid');
const myvideo=document.createElement('video')
myvideo.muted=true;

var socket = io('/');

var peer=new Peer(undefined,{
    path:'/peerjs',
    host:'/',
    port:'3000'
});

var username=prompt("Enter your username")


let peers=[];

let myvideostream;

navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream=>{
    myvideostream=stream;
    addvideostream(myvideo,stream)

    peer.on('call',call=>{
        call.answer(stream)
        const video=document.createElement('video');
        call.on('stream',uservideostream=>{
            addvideostream(video,uservideostream)
        })
    })



    socket.on('user-connected',(userid)=>{
        connectToUser(userid,stream)
    })
})

socket.on('user-disconnect',userid=>{
    if(peers[userid]){
        peers[userid].close();
    }
})
   

peer.on('open',id=>{
    socket.emit('join-room',ROOMID,id);

})

    const connectToUser=(userid,stream)=>{
        const call=peer.call(userid,stream)
        const video=document.createElement('video');
        call.on('stream',uservideostream=>{
            addvideostream(video,uservideostream)
        })

        call.on('close',()=>{
            video.remove()
        })
        peers[userid]=call
       }
const addvideostream=(video,stream)=>{
    video.srcObject=stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    })
    videogrid.append(video);
}

let msgdiv=document.querySelector('.msg-input')
console.log(msgdiv)
let text=document.getElementById('inputmsg');
msgdiv.addEventListener('keyup',(e)=>{
    if(e.keyCode===13 && text.value!=''){
        console.log(text.value);
       socket.emit('message',text.value,username)
       text.value=''


    }
})

socket.on('messagesend',(message,user)=>{
    let html=`<span><b>${user}</b></span><br><span>${message}</span>`
 let list=document.createElement('li');
 list.innerHTML=html;
    let msgs=document.querySelector('.msgs');
    msgs.append(list);
})

function muteunmute(){
    const enabled=myvideostream.getAudioTracks()[0].enabled;
    if(enabled){
        myvideostream.getAudioTracks()[0].enabled=false;
        setunmute();
    }
    else{
        setmute();
        myvideostream.getAudioTracks()[0].enabled=true
    }
}

function stopandplay(){
    const enabled=myvideostream.getVideoTracks()[0].enabled;
    if(enabled){
        myvideostream.getVideoTracks()[0].enabled=false;
        setplay();
    }
    else{
        setstop();
        myvideostream.getVideoTracks()[0].enabled=true;
       
    }
}
function setunmute(){
let mainbutton=document.querySelector('.mute');
let html=`<span><i class="unmute fas fa-microphone-slash"></i></span>
<span>Unmute</span>`
mainbutton.innerHTML=html;
}

function setmute(){
    let mainbutton=document.querySelector('.mute');
let html=`<span><i class="fas fa-microphone"></i></span>
<span>Mute</span>`
mainbutton.innerHTML=html;
}

function setplay(){
    let mainbutton=document.querySelector('.stop');
    let html=`<span><i class="fas fa-video-slash"></i></span>
    <span>Play Video</span>`
    mainbutton.innerHTML=html;
}
function setstop(){
    let mainbutton=document.querySelector('.stop');
    let html=`<span><i class="fas fa-video"></i></span>
    <span>Stop Video</span>`
    mainbutton.innerHTML=html;
}