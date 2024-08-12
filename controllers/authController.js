const userDB = {
    users: require("../model/users.json") || [],
    setUsers:  function(data) {this.users = data}
}

const fsPromise = require("fs").promises;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const path = require("path")

const handleLogin = async (req, res) =>{
    const {user, pass} = req.body;
    if(!user || !pass){
        return res.status(400).json({"message": "Username and password are required"});
    }
    const foundUser = userDB.users.find(person => person.username === user)
    if(!foundUser){
        return res.sendStatus(401); //unaurthorized
    }
    const match = await bcrypt.compare(pass, foundUser.password);
    if(match){
        const roles = Object.values(foundUser.roles);
        //create JWT
        const accessToken = jwt.sign(
            {"UserInfo": {
                "username": foundUser.username,
                "roles":roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET, 
            {expiresIn: "1m"}
        );

        const refreshToken = jwt.sign(
            {"username": foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: "1d"}
        );
        //saving refresh token with current user
        const otherUsers = userDB.users.filter(person=> person.username !== foundUser.username);
        const currentUser = {...foundUser, refreshToken};
        userDB.setUsers([...otherUsers, currentUser])
        await fsPromise.writeFile(path.join(__dirname, "..", "model", "users.json"), JSON.stringify(userDB.users))

        //storing in cookie and providing httpOnly arg to "not avaliable to javascript"
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: "None", secure:true,  maxAge: 24* 60* 60 * 1000 })
        res.json({ accessToken })
    } else{
        res.sendStatus(401);
    }
}

module.exports = {handleLogin}