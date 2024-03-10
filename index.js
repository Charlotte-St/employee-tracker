const express = require('express');
const inquirer = require('inquirer');
//const { Pool } = require('pg');

const PORT = 3001;
const app = express();

app.use(express.urlencoded({exprended: false}));
app.use(express.json());

//const pool = new Pool(
  //  {
    //    user: 'postgres',
      //  password: 'tryto1',
       // host: 'localhost',
        //database: 'employee_tracker_db'
    //},
    //console.log('Connected to the employee_tracker_db database')
//)

//pool.connect();

console.log("Employee Tracker");

//Inquirer prompts

//To do! Wrap inquirer prompt in init function

inquirer.prompt([
    {
        type: 'list',
        name: 'activity',
        message: 'What would you like to do?',
        choices: ["View all departments", 
        "View all roles",
        "Add a department",
        "Add a role", 
        "Add an employee",
        "Update an employee role"
    ]
    }
])
.then(
  (choice) => {
     switch (choice.activity){
        case 'View all roles': console.log('View all roles');
        case 'View all employees': console.log('View all employees');
        case 'Add a department': console.log('Add a department');
        case 'Add a role': console.log('Add a role');
        case 'Add an employee': console.log('Add an employee');
        case 'Update an employee role': console.log('Add an employee');
        }
   }
)

//app.listener(PORT, () =>{
  //  console.log(`Server listening on port ${PORT}`);
//});