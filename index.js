/* This is index.js */
var express = require('express'); 
var app = express();
app.set('view engine', 'ejs');
mongo = require('mongodb')

var bodyParser = require('body-parser'); 
app.use(bodyParser.urlencoded({ extended: true }));

var Nome = "Livraria";
var Livro = require('./livro.js');
var Loja = require('./loja.js');
var LivroFormato = require('./livroFormato.js');

app.use('/create', (req, res) => {


	var newLivro = new Livro ({
	  titulo: req.body.titulo, 
	  autor: req.body.autor, 
	  data: req.body.data,
	  editora: req.body.editora, 
	  formato: req.body.formato,
	});

	Loja.livros.push(newLivro);
	
	newLivro.save( (err) => {
		if (err) { 
			res.type('html').status(500); 
			res.send('Error :' + err);
		}
		
		else{ 
			newLivro.save( (err) => {
				if (err) { 
					res.type('html').status(500); 
					res.send('Error :' + err);
				}
				
				else{ 
					res.render('created', {livro: newLivro});
				}
			})	
		}
	})	
});


app.use('/comprar', (req, res) => { 

	Livro.find( (err, allLivro) => 
		{ 
			if (err) { 
				res.type('html').status(500); 
				res.send('Error: ' + err); 
			} 
			else 
				if (allLivro.length == 0) { 
					res.type('html').status(200); 
					res.send('Loja vazia.'); 
				} 
				else { 
					res.render('comprar', { livro: allLivro }); 
				} 
		}  
		); 
	} //end lamda use
);


app.use('/vender', (req, res) => { 

	Livro.find( (err, allLivro) => 
		{ 
			if (err) { 
				res.type('html').status(500); 
				res.send('Error: ' + err); 
			} 
			else 
				if (allLivro.length == 0) { 
					res.type('html').status(200); 
					res.send('Loja vazia.'); 
				} 
				else { 
					res.render('vender', { livro: allLivro }); 
				} 
		}  
		); 
	} //end lamda use
);






app.use('/comprado', (req, res) => { 
	var titulo = req.query.titulo;
	var formato = req.query.formato;
	var precocompra = req.query.precocompra; 
	var precovenda = req.query.precovenda;
	var stock = req.query.stock;

	Livro.findOne( {livro: livro}, (err, livro) => 
		{ 
			if (err) {
				res.type('html').status(500);
				res.send('Error: ' + err);
			}
			else if (!livro) {
				res.type('html').status(200);
				res.send('Não existe album ' + titulo);	
			}
			else {
				LivroFormato.findOne( {titulo: titulo, formato: formato}, (err, livroTitulo) => 
				{ 
					if (err) {
						res.type('html').status(500);
						res.send('Error: ' + err);
					}
					var stock;

					if(!livroTitulo){
						stock = parseInt(req.query.qt);
						var newLivro = new LivroFormato();
						newLivro.stock = stock;
						newLivro.formato = formato;
						newLivro.titulo = titulo;
						newLivro.precovenda = precovenda;
						newLivro.precocompra = precocompra;
								
						newLivro.save( (err) => {
							if (err) {
								res.type('html').status(500);
								res.send('Error: ' + err);
							}
							else {
								res.render('updated', { livro: livro });
							}
						});
					} else{
						stock = parseInt(livroTitulo.stock) + parseInt(req.query.qt);

						livroTitulo.stock = stock;
						livroTitulo.precocompra = precocompra;
						livroTitulo.precovenda = precovenda;

						livroTitulo.save( (err) => {
							if (err) {
								res.type('html').status(500);
								res.send('Error: ' + err);
							}
							else {
								res.render('updated', { livro: livro });
							}
						});
					}

					Loja.findOne({nome: Nome}, (err, loja) => {
						loja.credito = parseInt(loja.credito) - parseFloat(precocompra)*parseInt(stock);

						loja.save();
					})

				
				});
		}  
		}); 
	} //end lamda use
);



app.use('/vendido', (req, res) => { 
	var titulo = req.query.album;
	var formato = req.query.formato; 
	var quantidade = req.query.qt;

	Livro.findOne( {titulo: titulo}, (err, livro) => 
		{ 
			if (err) {
				res.type('html').status(500);
				res.send('Error: ' + err);
			}
			else if (!livro) {
				res.type('html').status(200);
				res.send('Não existe livro ' + titulo);	
			}
			else {
				LivroFormato.findOne( {titulo: titulo, formato: formato}, (err, livroTitulo) => 
				{ 
					if (err) {
						res.type('html').status(500);
						res.send('Error: ' + err);
					}
					
					var stock;

					if(!livroTitulo){
						res.send('Formato indisponível. ');	
					} else{
						
						if(quantidade <= livroTitulo.stock){

						stock = parseInt(livroTitulo.stock) - parseInt(quantidade);

						livroTitulo.stock = stock;

						livroTitulo.save( (err) => {
							if (err) {
								res.type('html').status(500);
								res.send('Error: ' + err);
							}
							else {
								res.render('updated', { livro: livro });
							}
						});

					}

					else{

						res.send('Limite máximo de stock atingido: ' + livroTitulo.stock)
					}

					}

					Loja.findOne({nome: Nome}, (err, loja) => {
						loja.credito = parseInt(loja.credito) - parseFloat(livroTitulo.precovenda)*parseInt(stock);

						loja.save();
					})

				
				});
		}  
		}); 
	} //end lamda use
);





app.use('/delete', (req, res) =>{
  var titulo = req.body.titulo;
  
  Livro.deleteOne({ titulo: titulo }, function (err, results) {
  	  res.json({ success: titulo })
  });

});



app.use('/pesquisa', (req, res) => {
	var searchTitulo = req.query.titulo;
	Livro.findOne( { id: searchTitulo }, (err, livro) => {
		if (err) {
			res.type('html').status(500);
			res.send('Error: ' + err);
		}
		else if (!livro) {
			res.type('html').status(200);
			res.send('Não existe o Livro ' + searchTitulo);
		}
		else {
			res.render('livroInfo', { livro : livro });
		}
	});
});


app.use('/update', (req, res) => {
	var updateTitulo = req.body.titulo;
	Livro.findOne( { titulo: updateTitulo }, (err, livro) => {
		if (err) {
			res.type('html').status(500);
			res.send('Error: ' + err);
		}
		else if (!livro) {
			res.type('html').status(200);
			res.send('Não existe o Livro ' + titulo);
		}
		else {
			livro.autor = req.body.autor;	
			livro.data = req.body.data;	
			livro.editora = req.body.editora;		
			livro.save( (err) => {
				if (err) {
					res.type('html').status(500);
					res.send('Error: ' + err);
				}
				else {
					res.render('updated', { livro: livro });
				}
		});
		}
	});
});




app.use('/all', (req, res) => { 
	Livro.find( (err, allLivro) => 
		{ 
			if (err) { 
				res.type('html').status(500); 
				res.send('Error: ' + err); 
			} 
			else 
				if (allLivro.length == 0) { 
					res.type('html').status(200); 
					res.send('Loja vazia.'); 
				} 
				else { 
					res.render('showAll', { livro: allLivro }); 
				} 
		}  
		); 
	} //end lamda use
);



app.use('/info', (req, res) => { 
	Loja.find( (err, allLoja) => 
		{ 
			if (err) { 
				res.type('html').status(500); 
				res.send('Error: ' + err); 
			} 
			else 
				if (allLoja.length == 0) { 
					res.type('html').status(200); 
					res.send('Sem informações.'); 
				} 
				else { 
					res.render('info', { loja: allLoja }); 
				} 
		}  
		); 
	} //end lamda use
);



app.use('/', express.static(__dirname +'/files'));  ;

app.use('/index', (req, res) => { res.redirect('/index.html'); } );

app.use('/created', (req, res) => { res.render('created', {qs:req.query}) } );

app.use('/adicionar', (req, res) => { res.redirect('/adicionar.html'); } );

app.use('/eliminar', (req, res) => { res.render('delete', {qs:req.query}) } );


app.listen(3000,  () => { console.log('Listening on port 3000'); } )