const mongoose= require('mongoose');

const tourSchema= new mongoose.Schema({
    // name: String,
    // rating: Number,
    // price: Number

    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: [true, 'The name is already accquired']
    },
    number: {
        type: Number
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'meidium', 'hard'],
            message: 'Difficulty matches none of Easy, Medium or Hard'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function(val){
                // THIS ONLY POINTS TO CURRENT DOC ON CREATION OF NEW DOC NOT WHILE UPDATING THEM
                return val< this.price
            },
            message: 'The discounted price {VALUE} should be less than or equal to the regular price'
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a summary']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: {
        type: [String]
    }, 
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: {
        type: [Date]
    }
});
const Tour= mongoose.model('Tour', tourSchema);


module.exports= Tour;