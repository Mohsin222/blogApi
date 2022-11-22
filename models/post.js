const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: {
      type: String,
    //  required: true
    },
    imageUrl: {
      type: String,
  //    required: true
    },
    content: {
      type: String,
      required: true
    },
    email:{
      type:String,
    },

    creator: {
      // type: Object,
      // required: String
      type:Schema.Types.ObjectId,
      ref:'User',
      required:true
    },
 comments:{
  type:Array,
  id:{
    type:String
  },
  text:{
    type:String
  },
  email:{
    type:String
  }
 
 }

    
  },
  { timestamps: true },


);

module.exports = mongoose.model('Post', postSchema);
