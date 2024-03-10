const express = require('express');
const { Pool } = require('pg');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const pool = new Pool(
  {
    user: 'postgres',
    password: 'tryto1',
    host: 'localhost',
    database: 'employee_tracker_db'
},
console.log('Connected to the employee_tracker_db database!')
)

pool.connect();


app.get('/api/department', (req, res) => {
        pool.query('SELECT * FROM department', function (err, {rows}) {
            res.status(200).json({rows});
          });
        console.log('Success');
        });
    
app.get('/api/role', (req, res) => {
    pool.query('SELECT * FROM role', function (err, {rows}) {
        res.status(200).json({rows});
      });
    console.log('Success');
    });

app.get('/api/employee', (req, res) => {
    pool.query('SELECT * FROM employee', function (err, {rows}) {
        res.status(200).json({rows});
        });
    console.log('Success');
    });
    

//app.delete('/api//:id', (req, res) => {
  //  const id = req.params.id;
    //pool.query(`DELETE FROM movies WHERE id = $1`, [id], function (err, {rows}) {
      //  res.status(200).json({rows});
     // });
   // });


app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
