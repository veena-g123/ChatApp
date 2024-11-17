const users = []
export const addUser = ({ id, username, room }) => {
    console.log(username)

    console.log(room)
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    if (!username || !room)
        return { error: "Name / room are required field" }
     // Check for existing user
     const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate username
    if (existingUser) {
        return {
            error: 'Username is in use!'
        }
    }
    const user = { id, username, room };
    users.push(user)
    console.log(users)
    return {user}

}
export const removeUser = (id) => {
    const index = users.findIndex((user) => { return user.id === id })
    if (index !== -1)
        return users.splice(index, 1)[0]
}
export const getUser = (id)=>{
    const u =  users.find((user)=>{return user.id === id});
    console.log(u


    )

    return u
}
export const getUsersInRoom=(room)=>{
    return users.filter((user)=>user.room === room)
}


// addUser({
//     id:22,
//     name:"v",
//     room:"r1"
// })
// addUser({
//     id:2,
//     name:"v1",
//     room:"r"
// })
// // console.log(users)
// let user = getUser(2)
//  user = getUsersInRoom("r1")

// console.log(user)
// removeUser(22)
// // console.log(users)