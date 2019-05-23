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

        chave_pub: {type: String, required: true},
        chave_priv: {type: String, required: true}
})

var Sala = mg.model("Sala", salasSchema);
var Computador = mg.model("Computador", computadoresSchema);
var Switch = mg.model("Switch", switchesSchema);

var f301 = new Sala({
        nome: 'f301'
})

var switch1 = new Switch({
    ip_addr: '10.90.90.90',
    mac_addr: 'oi',

    chave_pub: 'public',
    chave_priv: 'private'

})

var pc1 = new Computador({
        sala: f301['_id'],
        numero: 1,
        ip_addr: '10.0.0.69',
        mac_addr: 'sl',
        switch: switch1['_id'],
        porta_switch: 1
})

f301['pc_prof'] = pc1['_id'];

f301.save(function (err, a) {
    if (err) return console.error(err);
});

pc1.save(function (err, a) {
    if (err) return console.error(err);
});

switch1.save(function (err, a) {
    if (err) return console.error(err);
});
