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

app.listener(PORT, () =>{
    console.log(`Server listening on port ${PORT}`);
});