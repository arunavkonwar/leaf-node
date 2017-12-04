
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
  },
  season:{
    type: String,
    required: true
  },
  disease:{
    type: String,
    required: true
  },
  description:{
    type: String,
    required: true
  },
  place:{
    type: String,
    required: true
  },
  annotation:{
    type: String,
    required: true
  },
  annote_area:{
    type: String,
    required: true
  }
});

let Article = module.exports = mongoose.model('Article', articleSchema);
