// const fs = require('fs');
const Tour = require('./../modals/tourmodal');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// export function checkID(req, res, next, val) {
//   console.log(`Tour id is: ${val}`);

//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID'
//     });
//   }
//   next();
// }

// export function checkBody(req, res, next) {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price'
//     });
//   }
//   next();
// }

exports.topTours= async (req, res, next) => {
    req.query.limit= 5;
    req.query.sort= '-ratingsAverage,-price';
    next();
};

exports.getAllTours= async (req, res) => {
    // console.log(req.requestTime);
    try {
        // THIS BASICALLY GIVES US ALL THE QUERY'S ASKED BY THE USER SO THAT WE CAN RESPOND ACCORDINGLY
        // console.log(req.query);

        // BUILD QUERY AND BASIC FILTERING
        const queryObj= { ...req.query };
        const excludedFields= ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj [el]);
        // console.log(queryObj);

        // ADVANCED FILTERING
        let queryStr= JSON.stringify(queryObj);
        queryStr= queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match=> `$${match}`);
        // console.log(JSON.parse(queryStr));

        // console.log(queryObj);
        queryStr = JSON.parse(JSON.stringify(queryObj));
        let query= Tour.find(queryStr);
        
        //SORTING
        if(req.query.sort){
            const sortBy= req.query.sort.split(',').join(' ');
            query= query.sort(sortBy);
        }else{
            query= query.sort('-createdAt');
        }

        //FEILD LIMITING
        if(req.query.fields){
            const fields= req.query.fields.split(',').join(' ');
            query= query.select(fields);
        }else{
            query= query.select('-__v');
        }

        //PAGINATION
        const page= req.query.page* 1 || 1;
        const limit= req.query.limit* 1 || 100;
        const skip= (page- 1)* limit;
        query= query.skip(skip).limit(limit);

        if(req.query.page){
            const totalTours= await Tour.countDocuments();
            if(skip>= totalTours) throw new Error('This page does not exits');
        }
        // const query= await Tour.find()
        //     .where('duration')
        //     .equals(5)
        //     .where('difficulty')
        //     .equals('easy');
        
        //EXECUTE QUERY
        const tours= await query;
        // THIS IS THE MOST BASIC WAY TO GET ALL THE TOURS AND THE ABOVE ONE IS THE ADVANCED WAY TO GET ALL THE TOURS
        // const tours= await Tour.find();
        // console.log(tours);
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours: tours
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error
        })
        console.log(error);
    }
}

exports.getTour= async function (req, res) {
    // console.log(req.params);
    try {
        // const id = req.params.id * 1;

        const tour= await Tour.findById(req.params.id);

        // const tour = tours.find(el => el.id === id);
        res.status(200).json({
        status: 'success',
        data: {
            tour: tour
        }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error
        })
    }
}

exports.createTour = async function (req, res) {
    try{
        // const newTour= new Tour({});
        // newTour.save();

        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    }catch(err){
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
    // console.log(req.body);
    // const newId = tours[tours.length - 1].id + 1;
    // const newTour = Object.assign({ id: newId }, req.body);
    // tours.push(newTour);
    // fs.writeFile(
    //   `${__dirname}/dev-data/data/tours-simple.json`,
    //   JSON.stringify(tours),
    //   err => {
    //     res.status(201).json({
    //       status: 'success',
    //       data: {
    //         tour: newTour
    //       }
    //     });
    //   }
    // );
}

exports.updateTour= async (req, res)=> {
    try{
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    }catch(err){
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

exports.deleteTour= async (req, res) =>{
    const del= await Tour.findByIdAndRemove(body.params.id)
    try{
        res.status(204).json({
            status: 'success',
            data: null
        });
    }catch(err){
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}
