const mongoose = require('mongoose');

const feedRequestSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  feedName: { 
    type: String, 
    required: true,
    enum: ["starter", "grower", "finisher"]
  },
  feedType: {
    type: String,
    required: true,
    enum: ["mash", "crumble", "pellet"]
  },
  targetAge: {
    type: String,
    required: true,
    enum: ["oneToSeven", "eightToFourteen", "fifteenToThirty"]
  },
  brand: { 
    type: String,
    required: true,
    enum: ["ugachick", "nuvita", "farmersChoice", "kukuFeed"]
  },
  qty: { 
    type: Number, 
    required: true, 
    min: 1,
    max: 2
  },
  unitPrice: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  totalPrice: { 
    type: Number, 
    min: 0 
  },
  expiryDate: { 
    type: Date, 
    required: true 
  },
  status: {
    type: String,
    enum: ["pending", "approved", "dispatched", "rejected", "canceled"],
    default: "pending"
  },
  dateRequested: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Calculate total price before saving
feedRequestSchema.pre('save', function(next) {
  this.totalPrice = this.qty * this.unitPrice;
  next();
});

module.exports = mongoose.model("FeedRequest", feedRequestSchema);



// const mongoose = require('mongoose');

// const feedRequestSchema = new mongoose.Schema({
//   user: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: "User", 
//     required: true 
//   },
//   feedsName: { 
//     type: String, 
//     required: true 
//   },
//   feedType: {
//     type: String,
//     required: true,
//   },
//   targetAge: {
//     type: String,
//     required: true,
//   },
//   brand: { 
//     type: String,
//      required: true },
//   qty: { 
//     type: Number, 
//     required: true, 
//     min: 1
//   },
//   unitPrice: { 
//     type: Number, 
//     required: true, 
//     min: 0 },
//   totalPrice: { type: Number, 
//     min: 0 
//   },
//   expiryDate: { 
//     type: Date, 
//     required: true 
//   },
//   status: {
//     type: String,
//     enum: ["pending", "approved", "dispatched", "rejected", "canceled"],
//     default: "pending"
//   },
//   date: { 
//     type: Date, 
//     default: Date.now 
//   }
// });

// // const feedRequestSchema = new mongoose.Schema({
// //   user: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: "User",
// //     required: [true, 'User reference is required']
// //   },
// //   feedsName: {
// //     type: String,
// //     required: [true, 'Feed name is required'],
// //     trim: true,
// //     maxlength: [100, 'Feed name cannot exceed 100 characters']
// //   },
// //   feedType: {
// //     type: String,
// //     required: [true, 'Feed type is required'],
// //     enum: {
// //       values: ['starter', 'grower', 'finisher', 'layer', 'broiler'],
// //       message: 'Invalid feed type'
// //     }
// //   },
// //   targetAge: {
// //     type: String,
// //     required: [true, 'Target age is required'],
// //     validate: {
// //       validator: function(v) {
// //         return /^[0-9]+(\s*-\s*[0-9]+)?\s*(days|weeks|months)$/i.test(v);
// //       },
// //       message: 'Target age format: "X days/weeks/months" or "X-Y days/weeks/months"'
// //     }
// //   },
// //   brand: {
// //     type: String,
// //     required: [true, 'Brand is required'],
// //     maxlength: [50, 'Brand name cannot exceed 50 characters']
// //   },
// //   qty: {
// //     type: Number,
// //     required: [true, 'Quantity is required'],
// //     min: [1, 'Quantity must be at least 1']
// //   },
// //   unitPrice: {
// //     type: Number,
// //     required: [true, 'Unit price is required'],
// //     min: [0, 'Unit price cannot be negative']
// //   },
// //   totalPrice: {
// //     type: Number,
// //     min: [0, 'Total price cannot be negative']
// //   },
// //   expiryDate: {
// //     type: Date,
// //     required: [true, 'Expiry date is required'],
// //     validate: {
// //       validator: function(v) {
// //         return v > new Date();
// //       },
// //       message: 'Expiry date must be in the future'
// //     }
// //   },
// //   status: {
// //     type: String,
// //     enum: ["pending", "approved", "dispatched", "rejected", "canceled"],
// //     default: "pending"
// //   },
// //   date: {
// //     type: Date,
// //     default: Date.now
// //   }
// // }, {
// //   timestamps: true, // Adds createdAt and updatedAt automatically
// //   toJSON: { virtuals: true },
// //   toObject: { virtuals: true }
// // });

// // // Calculate total price before saving
// // feedRequestSchema.pre('save', function(next) {
// //   if (this.isModified('qty') || this.isModified('unitPrice')) {
// //     this.totalPrice = this.qty * this.unitPrice;
// //   }
// //   next();
// // });

// // module.exports = mongoose.model("FeedRequest", feedRequestSchema);

// // const mongoose = require('mongoose');

// // const feedRequestSchema = new mongoose.Schema({
// //     user: {
// //         type: mongoose.Schema.Types.ObjectId,
// //         ref: "User",
// //         required: true
// //     },
// //     feedsName: {
// //         type: String,
// //         required: true
// //     },
// //     feedType: {
// //         type: String,
// //         required: true
// //     },
// //     targetAge: {
// //         type: String,
// //         required: true
// //     },
// //     brand: {
// //         type: String,
// //         required: true
// //     },
// //     qty: {
// //         type: Number,
        
// //     },
// //     unitPrice: {
// //         type: Number,
        
// //     },
// //     totalPrice: {
// //         type: Number,
        
// //     },
// //     expiryDate: {
// //         type: Date,
// //     },
// //     status: {
// //         type: String,
// //         enum: ["pending", "approved","dispatched","rejected","canceled"],
// //         default: "pending"
// //     },
// //     date: {
// //         type: Date,
// //         default: Date.now
// //     }
// //     }
// //     );
//     module.exports = mongoose.model("feedRequest", feedRequestSchema);