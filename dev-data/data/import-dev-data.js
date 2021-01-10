const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Tour = require('../../models/tourmodel');



dotenv.config({path: '../../config.env'});

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

// Read data into DB
const tours = JSON.parse(fs.readFileSync('tours-simple.json', 'utf-8'));

// Import data into the database
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Successfully loaded');
        process.exit();
    } catch (error) {
        console.log('Data failed to load', error);
    }
}

//  Delete all data from collection
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('Data successfully deleted');
        process.exit();
    } catch (error) {
        console.log('Failed to delete data');
    }
}

if(process.argv[2] === '--import') {
    importData();

} else if (process.argv[2] === '--delete') {
    deleteData();
}

console.log(process.argv);