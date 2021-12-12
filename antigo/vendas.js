
var mongoose = require('mongoose');

uri="mongodb+srv://filipalarissa:filipalarissa44446@cluster0.rnl7x.mongodb.net/filipalarissa?retryWrites=true&w=majority"
mongoose.connect(uri);

var Schema = mongoose.Schema;

var vendasSchema = new Schema( 
{ 
  titulo: {type: String, required: true, unique: true}, 
  dataVenda: {type: Number,required: true }, 
  precoVenda: {type: Number, required: true },
  quantidade: {type: Number, required: true}
});


module.exports = mongoose.model('Vendas', vendasSchema);
