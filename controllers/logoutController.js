const userDB = {
    users: require("../model/users.json"),
    setUsers: function(data) {this.users = data},
}

const fsPromise = require("fs").promises;
const path = require("path")

const handleLogout = async (req, res)=>{
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(204); //no content
    const refreshToken = cookies.jwt;
    const foundUser = userDB.users.find(person => person.refreshToken === refreshToken);
    if(!foundUser){
        res.clearCookie('jwt', {httpOnly: true, sameSite: "None", secure:true, maxAge: 24*60*60*1000})
        res.sendStatus(204);
    }
    //delete refresh token in databases
    const otherUsers = userDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    const currentUser = {...foundUser, refreshToken:""};
    userDB.setUsers([...otherUsers, currentUser])
    await fsPromise.writeFile(path.join(__dirname, "..", "model", "users.json"),
        JSON.stringify(userDB.users)
    )

    res.clearCookie("jwt", {httpOnly: true,sameSite: "None", secure:true, maxAge: 24*60*60*1000})
    res.sendStatus(204)
}

module.exports = { handleLogout}