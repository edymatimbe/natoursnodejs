const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('Uncaught Reference');

  process.exit(1);
});

dotenv.config({path: './config.env'});

const app = require('./app');


const db = process.env.DATABASE.replace(
  '<PASSWORD>', 
  process.env.DATABASE_PASSWORD
);

mongoose
  //.connect(process.env.DATABASE_LOCAL, {
  .connect(db, {
    useNewUrlParser:true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connect sucessfull'));




// console.log(process.env.NODE_ENV);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}....`);
});

// Hello

process.on('unhandledRejection', (err)=> {
  console.log(err.name, err.message);
  console.log('UnhandledRejection: Shutting down');

  server.close(()=>{
    process.exit(1);
  });  
});

