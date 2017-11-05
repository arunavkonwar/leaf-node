
let mongoose = require('mongoose');

// Article Schema
let articleSchema = mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  author:{
    type: String,
    required: true
  },
  body:{
    type: String,
    required: true
  },
  location:{
    type: String,
    required: true
  },
  country:{
    type: String,
    required: true
  },
  photo:{
    type: String,
    required: true
  },
  completed:{
    type: String,
    required: true
  },
  division:{
    type: String,
    required: true
  }
});

let Article = module.exports = mongoose.model('Article', articleSchema);
