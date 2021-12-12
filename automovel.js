
var mongoose = require('mongoose');

uri="mongodb+srv://larissa:ls2021@ls.5gb4u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
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


