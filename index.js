const express = require('express');
const inquirer = require('inquirer');
const { Pool } = require('pg');

const PORT = 3001;
const app = express();

app.use(express.urlencoded({exprended: false}));
app.use(express.json());

const pool = new Pool(
    {
        user: 'postgres',
        password: 'tryto1',
        host: 'localhost',
        database: 'employee_tracker_db'
    },
    console.log('Connected to the employee_tracker_db database')
)

pool.connect();

//Inquirer prompts

//To do! Wrap inquirer prompt in init function

inquirer.prompt([
    {
        type: 'list',
        name: 'activity',
        message: 'What would you like to do?',
        choices: ['View all departments', 
        'View all roles', 
        'View all employees', 
        'Add a department', 
        'Add a role', 
        'Add an employee', 
        'Update an employee role']
    }
]).then(
//Add switch case for each choice
)

app.listener(PORT, () =>{
    console.log(`Server listening on port ${PORT}`);
});