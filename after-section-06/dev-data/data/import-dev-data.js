const fs= require('fs');
const dotnev= require('dotenv');
const mongoose= require('mongoose');
dotnev.config({path: './config.env'});
const DB = process.env.DATABASE.replace('<PASSWARD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('DB connection successful!!');
}).catch(err => {
  console.log('DB connection error:', err);
});
const tour= require('./../../modals/tourmodal');

// READING THE TOUR-SIMPLE JSON FILE
const tours= JSON.parse(fs.readFileSync(__dirname+ "/tours-simple.json", 'utf-8'));

// IMPORT DATA INTO DATABASE
const importData = async () => {
    try {
        await tour.deleteMany(); // Delete all existing documents
        console.log('Deleted all existing documents');

        await tour.create(tours); // Import new data
        console.log('Documents created successfully');

        const data= tour.find();
        console.log(data);
        // res.send(data);
    } catch (err) {
        console.log(err);
    }
    process.exit();
}


// DELETE ALL THE DATA FROM DATABASE
const deleteData= async ()=> {
    try{
        await tour.deleteMany();
        console.log('All documents are deleted successfully');
        const allTours= tour.find();
        // console.log(allTours);
    } catch(err){
        console.log(err);
    }
    process.exit();
}

// console.log(process.argv);
if(process.argv[2]=== '--import'){
    importData();
}else if(process.argv[2]=== '--delete'){
    deleteData();
}
