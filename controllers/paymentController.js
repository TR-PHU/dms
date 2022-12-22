const {driver, config} = require('../models/connectDB');

const index = async (req, res, next)=>{
    try{
        const conn = await driver.connect(config);
        const result = await conn.execute('SELECT * FROM PAYMENT');
        const rows = await result.getRows();
        
        return res.render('pages/commonList', {
            title: "Payments",
            headerTitle: "Payment List",
            rows: rows,
            fields: rows.length > 0 ? Object.keys(rows[0]) : [],
            router: "payments"
        });
    }
    catch(e){
        return res.status(500).json({ message: e.message });
    }
};

const createView = async (req, res, next)=>{
    try{
        const conn = await driver.connect(config);
        const result = await conn.execute('SELECT ID, NAME, PRICE FROM CAR');
        const cars = await result.getRows();

        const defaultValues = {
            'ID': 'P'+Math.round(Math.random()*100000).toString().padStart(6, '0'),
            'CUSID': '1',
            'PAYMENTDATE': Date.now(),
        };
    
        const datatypes = {
            'ID': 'text',
            'CUSID': 'text',
            'PAYMENTDATE': 'date',
        };

        return res.render('pages/payment', {
            title: "Payments - Create",
            headerTitle: "Create Payment",
            values: defaultValues,
            fields: Object.keys(datatypes),
            datatypes: datatypes,
            action: `/payments/create`,
            method: "post",
            cars: cars
        });
    }
    catch(e){
        return res.status(500).json({ message: e.message });
    }
};

const create = async (req, res, next)=>{
    const body = req.body;
    console.log(body);
    try{
        fields = Object.keys(body) || [];
        const conn = await driver.connect(config);

        let statement = 'INSERT INTO PAYMENT VALUES (';
        const len = fields.length - 1;
        fields.forEach(function(field, i){
            statement += `'${body[field]}'`;
            statement += i != len ? ',' : '';
        });
        statement += `);`;
        console.log(statement);
        await conn.execute(statement);

        return res.redirect('/payments');
    }
    catch(e){
        return res.status(500).json({ message: e.message });
    }
};

const updateView = async (req, res, next)=>{
    const {id} = req.params;
    try{
        const conn = await driver.connect(config);
        const result = await conn.execute(`SELECT * FROM PAYMENT WHERE ID=${id}`);
        const rows = await result.getRows();
        const values = rows[0];
        const datatypes = {
            'ID': 'text',
            'NAME': 'text',
            'VENDOR': 'text',
            'PRICE': 'number',
            'QUANTITY': 'number',
        };

        return res.render('pages/commonForm', {
            title: "Payments - Update",
            headerTitle: "Update Payment",
            values: values,
            fields: Object.keys(values),
            datatypes: datatypes,
            action: `/payments/${values['ID']}/update`,
            method: "post"
        });
    }
    catch(e){
        return res.status(500).json({ message: e.message });
    }
};

const update = async (req, res, next)=>{
    const body = req.body;
    try{
        fields = Object.keys(body) || [];
        const conn = await driver.connect(config);

        let statement = 'UPDATE PAYMENT SET ';
        const len = fields.length - 1;
        fields.forEach(function(field, i){
            if(field != 'ID'){
                statement += `${field}='${body[field]}'`;

                statement += i != len ? ', ' : ' ';
            }
        });
        statement += `WHERE ID=${body['ID']};`;

        await conn.execute(statement);

        return res.redirect('/payments');
    }
    catch(e){
        return res.status(500).json({ message: e.message });
    }
};

const remove = async (req, res, next)=>{
    const {id} = req.body;
    console.log(id);
    try{
        const conn = await driver.connect(config);
        await conn.execute(`DELETE FROM PAYMENT WHERE ID=${id}`);
        return res.redirect('/payments');
    }
    catch(e){
        return res.status(500).json({ message: e.message });
    }
};

module.exports = {
    index,
    updateView,
    update,
    remove,
    create,
    createView
};