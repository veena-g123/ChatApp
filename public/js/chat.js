
const socket = io()
const $messageform = document.querySelector('#message-form')
const $messageforminput = $messageform.querySelector("input")
const $messageformbutton = $messageform.querySelector("button")
const $messages = document.querySelector("#messages")
const messageTemplate = document.querySelector("#message-template").innerHTML
const sendLocTemplate = document.querySelector("#location-message-template").innerHTML
const roomTemplate=document.querySelector("#sidebar-template").innerHTML
// socket.on('countupdated',(count)=>{//server to client
//     console.log("count has been updated to => "+count)
// })
const $sendLocation = document.querySelector('#send-location')
const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix:true})
const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}
socket.on("message",(message)=>{
    console.log("14>>"+message)
    const html = Mustache.render(messageTemplate,{username:message.username,
        message : message.message,createdAt:moment(message.createdAt).format("h:mm a")
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})
socket.on("roomInfo",({room,users})=>{
    const html = Mustache.render(roomTemplate,{room,users})
    document.querySelector('#sidebar').innerHTML = html


})

socket.on("locationMessage",(message)=>{
    console.log(message)
    const html = Mustache.render(sendLocTemplate,{username:message.username,location:message.location,createdAt:moment(message.createdAt).format("h:mm a")})
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})
// document.querySelector("#increment").addEventListener('click',()=>{
//     console.log("clicked")
//     socket.emit('increment')
// })
$messageform.addEventListener('submit', (e) => {
    e.preventDefault()
    $messageformbutton.setAttribute("disabled","disabled")
    const message = e.target.elements.message.value

    socket.emit('sendMessage', message,(msg)=>{
        $messageformbutton.removeAttribute("disabled")
        $messageforminput.value = ""
        $messageforminput.focus()

        console.log(msg)
    })
})

document.querySelector("#send-location").addEventListener("click",()=>{
    if(!navigator.geolocation)
        return alert("Geo location is nt supported by ypur browser")
    $sendLocation.setAttribute("disabled","disabled")
    navigator.geolocation.getCurrentPosition((position)=>{
        console.log(position.coords.latitude)
        socket.emit("sendLocation",{latitude:position.coords.latitude,longitude:position.coords.longitude},(msg)=>{
            console.log(msg)
            $sendLocation.removeAttribute("disabled")
        })
    })
})

socket.emit("join",{username,room},(error)=>{
    if(error){
 alert(error)
    location.href = "/"
    }
       
})