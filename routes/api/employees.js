const express = require("express");
const router = express.Router();
const employeeController = require("../../controllers/employeesController.js")
const ROLES_LIST  = require("../../config/roles_list.js");
const verifyRoles = require("../../middleware/verifyRoles.js")

router.use(express.json())

router.route("/")
    .get(employeeController.getAllEmployees)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeeController.createNewEmployee)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeeController.updateEmployee)
    .delete(verifyRoles(ROLES_LIST.Admin), employeeController.deleteEmployee)

router.route("/:id")
    .get(employeeController.getEmployee)



module.exports = router;


// app.get("/", (req, res)=>{
//     res.json(data.employees);
// })

// app.post("/", (req, res)=>{
//     res.json({
//         "firstName": req.body.firstName,
//         "lastName": req.body.lastName
//     })
// })

// app.put("/", (req, res)=>{
//     res.json({
//         "firstName":req.body.firstName,
//         "lastName":req.body.lastName
//     })
// })

// app.delete("/",(req,res)=>{
//     res.json({"id": req.body.id})
// })

// app.get("/:id", (req, res)=>{
//     res.json({"id": req.params.id})
// })



// module.exports = app;