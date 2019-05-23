var mg = require("mongoose")
mg.connect('mongodb://localhost/test', {useNewUrlParser: true, useCreateIndex: true});

var salasSchema = new mg.Schema(
    {
        nome: {type: String, required: true, unique: true},
        pc_prof: {type: mg.Schema.Types.ObjectId, ref: "Computador"}
})

var computadoresSchema = new mg.Schema(
    {
        sala: {type: mg.Schema.Types.ObjectId, ref: "Sala", required: true},
        numero: {type: Number, required: true}, //Número do pc
        
        ip_addr: {type: String, required: true, unique: true}, //Pode ser interessante validar os endereços (é um regex bem grande)
        mac_addr: {type: String, required: true, unique: true},

        switch: {type: mg.Schema.Types.ObjectId, ref: "Switch", required: true}, //ip do switch
        porta_switch: {type: Number, required: true}
})

var switchesSchema = new mg.Schema(
    {
        ip_addr: {type: String, required: true, unique: true},
        mac_addr: {type: String, required: true, unique: true},
})

var Sala = mg.model("Sala", salasSchema);
var Computador = mg.model("Computador", computadoresSchema);
var Switch = mg.model("Switch", switchesSchema);




//Recebe um ip e verifica se o pc é um pc de professor, retornando o nome da sala correspondente, NULL se não for pc_prof
function verify_PCProf(ip){
        return Computador.findOne({
                ip_addr: ip
        }).select('sala').exec().then(function(record){
                // if(err) console.error(err);
                if(record != null){
                        return Sala.findOne({
                                _id: record['sala']
                        }).select('nome').exec().then(function(record){
                                // console.log(record['nome']);
                                return new Promise(function(resolve, reject){
                                        resolve(record);
                                });
                        });
                }
                
        });
}


function requireLogin(req, res, next) {
        if (sess.email) {
                next(); // allow the next route to run
        } 
        else {
                // require the user to log in
                res.redirect("/login"); // or render a form, etc.
        }
}


function main(){
        var http = require('http');

        var fs = require('fs');
        
        var express = require('express'); 

        var server = express();
        var session = require('express-session');
        server.use(session({secret: 'ssshhhhh'}));

        
        var sess; //Não pode ficar como global, mas por enquanto ok
        var sala_atual; //Também só para teste, teria que colocar isso na session de alguma forma


        server.use(function(req, res, next){
                res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
                next();
        })

        //Verifica se o pc fazendo o request é um pc professor
        server.get('/', function(req, res){
                sess = req.session;
                var pcprof = verify_PCProf(req.ip);
                // console.log(sala['nome']);
                pcprof.then(function(sala){
                        if(sala == null){
                                //Não autorizado
                                // res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
                                // var myReadStream = fs.createReadStream(__dirname + '/temp.txt', 'utf-8');
                                // myReadStream.pipe(res);
                                // res.end("Não autorizado");
                        } 
                        else{
                                //Autorizado
                                // res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
                                res.end("You did it, champ! Sua sala é " + sala['nome']);
                                sala_atual = sala;
                                res.redirect('/login')
                        } 
                }).catch(function(err){
                        console.error(err);
                });
        })

        //Enquanto não tem front-end (*cof*Leo*cof*) fica assim mesmo
        server.get('/login', function(req, res){
                sess = req.session;
                sess.email = 'fioresi_mito@valzitos.wtf';
                res.redirect('/menu');
        })

        //Fazer outras páginas, com HTML
        server.all("/menu/*", requireLogin, function(req, res, next) {
                next(); // if the middleware allowed us to get here,
                        // just move on to the next route handler
        })

        server.get('/menu', function(req, res){
                res.end("Só testando");
        })

        server.get('*', function(req, res){
                res.end('404!');
        })

        http.createServer(server).listen(3000, 'localhost');
        console.log('Listening!');
}

//ip a add [ip que eu quero]/8 dev enp2s0 

main();


