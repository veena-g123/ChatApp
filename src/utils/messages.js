export const generateMessageObject = (username,message)=>{
    return {username,message,createdAt:new Date()}
}
export const generateLocationObject =(username,location)=>{
    return {username,location,createdAt:new Date()}
}