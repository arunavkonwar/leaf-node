let mongoose = require('mongoose');

// Article Schema
let leafSchema = mongoose.Schema({
  title:{
    type: String
  },
  author:{
    type: String
  },
  leaf_type:{
    type: String
  },
  photo:{
    type: String
  },
  annotate_area:{
    type: String
  }
});

let leaf = module.exports = mongoose.model('leaf', leafSchema);
