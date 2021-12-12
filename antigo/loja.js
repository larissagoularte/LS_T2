
var mongoose = require('mongoose');

uri="mongodb+srv://filipalarissa:filipalarissa44446@cluster0.rnl7x.mongodb.net/filipalarissa?retryWrites=true&w=majority"
mongoose.connect(uri);

var Schema = mongoose.Schema;

var lojaSchema = new Schema( 
{ 
  nome: {type: String, required: true}, 
  credito: {type: Number, required: true }
});


module.exports = mongoose.model('Loja', lojaSchema);


