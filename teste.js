var mg = require("mongoose")

var salaSchema = new mg.Schema(
    {
        nome: {type: String, required: true, unique: true},
        pc_prof: {type: mg.Schema.Types.ObjectId, ref: "Computadores"}
})

var computadoresSchema = new mg.Schema(
    {
        sala: {type: mg.Schema.Types.ObjectId, ref: "Salas", required: true},
        numero: {type: Number, required: true}, //Número do pc
        
        ip_addr: {type: String, required: true, unique: true}, //Pode ser interessante validar os endereços (é um regex bem grande)
        mac_addr: {type: String, required: true, unique: true},

        switch: {type: mg.Schema.Types.ObjectId, ref: "Switches", required: true},
        porta_switch: {type: Number, required: true}
})

var switchesSchema = new mg.Schema(
    {
        ip_addr: {type: String, required: true, unique: true},
        mac_addr: {type: String, required: true, unique: true},
})

