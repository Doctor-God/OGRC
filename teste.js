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
        var qual_sala = Computador.findOne({
                ip_addr: ip
        }).select('sala').exec(function(err, record){
                if(err) console.error(err);
                if(record != null){
                        var eh_pcprof = Sala.findOne({
                                _id: record['sala']
                        }).select('nome').exec(function(err, record){
                                if(err) console.error(err);
                                console.log(record['nome']);
                               return record;
                       });
                }
        });

        return null;
}

function main(){
        verify_PCProf('192.168.0.100');
}

main();


