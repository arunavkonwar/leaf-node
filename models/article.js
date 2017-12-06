
let mongoose = require('mongoose');

// Article Schema
let articleSchema = mongoose.Schema({
  title:{
    type: String
  },
  author:{
    type: String
  },
  body:{
    type: String
  },
  location:{
    type: String
  },
  country:{
    type: String
  },
  photo:{
    type: String
  },
  completed:{
    type: String
  },
  division:{
    type: String,
  },
  season:{
    type: String
  },
  disease:{
    type: String
  },
  description:{
    type: String
  },
  place:{
    type: String
  },
  annotation:{
    type: String
  },
  annote_area:{
    type: String
  },
  single:{
    type: String
  }
});

let Article = module.exports = mongoose.model('Article', articleSchema);
