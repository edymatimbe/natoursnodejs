const mongoose = require('mongoose');
const slugify = require('slugify');


const tourSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Must have a name'],
      trim:true,
      unique: true,
      maxlength: [40, 'A tour name must have a limit of 40 characters'],
      minlength: [10, 'A tour name must have a least 10 characters'],
    //   validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    slug: String,
    maxGroupSize: {
        type: Number,
        required: [true, 'A Tour must have a number of people']
    },
    duration: {
        type: Number,
        required: [true, 'A Tour must have a duration']
    },
    difficulty:{
        type: String,
        required: [true, 'A Tour must have a level'],
        enum: {
            values: ['easy', 'medium', 'difficulty'],
            message: "Difficulty ie eithher: easy, medium, difficult"
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1'],
        max: [5, 'A rating must be bellow or equal to 5']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
      type: Number, 
      required: [true, 'Must have a price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function(val){
                // This validator works only in create
                // No work with Update 
                return val < this.price 
            },
            message: 'Discount cant be done because ({VALUE}) higher than then price'
        }

    },
    summary: {
        type: String,
        trim: [true, 'A tour must have a description']
    },
    secretTour:{
        type: Boolean,
        default: false
    },
    
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select:false
    },    
    startDates: [Date],
}, 
{        
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
  
tourSchema.virtual('durationWeeks').get(function(){
    return this.duration / 7;
});

// doc middleware run for save and create, update not
tourSchema.pre('save', function(next){
    this.slug = slugify(this.name, { lower: true });
    next();
});

// tourSchema.pre('save', function(next){
//     console.log('Process on the way');
//     next();
// })

// tourSchema.post('save', function(doc, next){
//     console.log(doc);
//     next();
// });


// Query Middleware
// tourSchema.pre('find', function(next){
tourSchema.pre(/^find/, function(next){
    this.find({ secretTour: { $ne:true }});

    this.start = Date.now();
    next();
});

tourSchema.post(/^find/, function(docs, next){
    console.log(`Query date ${Date.now() - this.start} miliseconds`);
    console.log(docs);
    next();
});

// Aggregation Middleware
tourSchema.pre('aggregate', function(next){
    this.pipeline().unshift( {$match: {secretTour: {$ne: true}}} );
    next();
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;