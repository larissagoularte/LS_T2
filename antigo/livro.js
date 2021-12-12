
var mongoose = require('mongoose');

uri="mongodb+srv://filipalarissa:filipalarissa44446@cluster0.rnl7x.mongodb.net/filipalarissa?retryWrites=true&w=majority"
mongoose.connect(uri);

var Schema = mongoose.Schema;

var livroSchema = new Schema( 
{ 
  titulo: {type: String, required: true, unique: true}, 
  autor: {type: String, required: true}, 
  data: {type: String,required: true },
  editora: {type: String,required: true }, 
});


module.exports = mongoose.model('Livro', livroSchema);


