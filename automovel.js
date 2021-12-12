
var mongoose = require('mongoose');

uri="mongodb+srv://scripting:2021@cluster0.iv2p2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
mongoose.connect(uri);

var Schema = mongoose.Schema;

var automovelSchema = new Schema( 
{ 
  matricula: {type: String, required: true, unique: true}, 
  marca: {type: String, required: true}, 
  modelo: {type: String,required: true },
  ano: {type: String,required: true }, 
});


module.exports = mongoose.model('Automovel', automovelSchema);


