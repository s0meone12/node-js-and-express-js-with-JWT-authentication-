const userDB = {
    users: require("../model/users.json") || [],
    setUsers: function(data) {this.users = data}
}

const fsPromise = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");

const handleUser = async(req, res)=> {
    const {user, pass} = req.body;
    if(!user || !pass){
        return res.status(400).json({"message": "Username and Password are required"})
    }
    const duplicate = userDB.users.find(person => person.username === user)
    if(duplicate){
        return res.sendStatus(409) //conflict error
    }
    try{
        const hashedPass = await bcrypt.hash(pass, 10);
        const newUser = {
            "username": user, 
            "roles":{"User":2001},
            "password": hashedPass
        }
        userDB.setUsers([...userDB.users, newUser])
        await fsPromise.writeFile(
            path.join(__dirname, "..", "model", "users.json"), 
            JSON.stringify(userDB.users)
        );
        console.log(userDB.users);
        res.status(201).json({"sucess": `New user ${user} created!`})

    }catch(err){
        res.status(500).json({"message": err.message})
    }
}

module.exports = {handleUser};