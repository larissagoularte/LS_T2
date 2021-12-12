var mongoose = require('mongoose');

uri="mongodb+srv://filipalarissa:filipalarissa44446@cluster0.rnl7x.mongodb.net/filipalarissa?retryWrites=true&w=majority"

mongoose.connect(uri);

var Schema = mongoose.Schema;

var livroFormatoSchema = new Schema( 
{ 
  titulo: {type: String, ref: "Livro"}, 
  precocompra: {type: Number, required: true },
  precovenda: {type: Number, required: true },
  stock: {type: Number, required: true},
  formato: {type: String, required: true}
});


module.exports = mongoose.model('LivroFormato', livroFormatoSchema);