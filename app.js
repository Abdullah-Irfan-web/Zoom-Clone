const express=require('express');
const app=express();
const server=require('http').Server(app);
const io=require('socket.io')(server);
const path=require('path')
const {v4:uuidv4}=require('uuid');
const {ExpressPeerServer}=require('peer');
const peerServer=ExpressPeerServer(server,{
    debug:true
});

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));


app.use(express.static('public'));


app.use('/peerjs',peerServer);
app.get('/',(req,res)=>{
    res.redirect(`/${uuidv4()}`);
})

app.get('/:id',(req,res)=>{
    res.render('home',{roomid:req.params.id});
})

io.on('connection',socket=>{
    socket.on('join-room',(roomid,userid)=>{
        socket.join(roomid);
        
        socket.broadcast.to(roomid).emit('user-connected',userid);


        socket.on('disconnect',()=>{
            socket.broadcast.to(roomid).emit('user-disconnect',userid)
        })

        socket.on('message',(text,username)=>{

            io.to(roomid).emit('messagesend',text,username);
        })
    })
})



server.listen(3000,()=>{
    console.log("Server started")
});