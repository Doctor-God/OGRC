var snmp = require("net-snmp");
var session = snmp.createSession ("10.90.90.90", "private");

var oids = ["1.3.6.1.2.1.2.2.1.6.12", "1.3.6.1.2.1.3.1.1.2.13"];

var desligarBruno = [{
	oid: "1.3.6.1.2.1.2.2.1.7.12",
	type: snmp.ObjectType.Integer32,
	value: 2
}];

session.get (oids, function (error, varbinds) {
    if (error) {
        console.error (error);
    } else {
        for (var i = 0; i < varbinds.length; i++)
            if (snmp.isVarbindError (varbinds[i]))
                console.error (snmp.varbindError (varbinds[i]))
            else
                console.log (varbinds[i].oid + " = " + varbinds[i].value);
    }

    // If done, close the session
    //session.close ();
});

session.set(desligarBruno, (error, varbinds) => {
	if (error) {
		console.error(error);
	} else {
		console.log(varbinds);
	}
});
	

session.trap (snmp.TrapType.LinkDown, function (error) {
    if (error)
        console.error (error);
});
