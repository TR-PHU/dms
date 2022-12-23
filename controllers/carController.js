const {driver, config} = require('../models/connectDB');

const index = async (req, res, next)=>{
    try{
        const conn = await driver.connect(config);
        const result = await conn.execute('SELECT * FROM CAR');
        const rows = await result.getRows();
        
        return res.render('pages/commonList', {
            title: "Cars",
            headerTitle: "Car List",
            rows: rows,
            fields: rows.length > 0 ? Object.keys(rows[0]) : [],
            router: "cars"
        })
    }
    catch(e){
        return res.status(500).json({ message: e.message });
    }
};

const createView = async (req, res, next)=>{
    const defaultValues = {
        'ID': 'aa',
        'NAME': 'Proaa Car',
        'VENDOR': 'Proaa Vendor',
        'PRICE': 999,
        'QUANTITY': 5,
    };

    const datatypes = {
        'ID': 'text',
        'NAME': 'text',
        'VENDOR': 'text',
        'PRICE': 'number',
        'QUANTITY': 'number',
    };

    return res.render('pages/commonForm', {
        title: "Cars - Create",
        headerTitle: "Create Car",
        values: defaultValues,
        fields: Object.keys(datatypes),
        datatypes: datatypes,
        action: `/cars/create`,
        method: "post",
        editId: true
    });
};

const create = async (req, res, next)=>{
    const body = req.body;
    console.log(body);
    try{
        fields = Object.keys(body) || [];
        const conn = await driver.connect(config);

        let statement = 'INSERT INTO CAR VALUES (';
        const len = fields.length - 1;
        fields.forEach(function(field, i){
            statement += `'${body[field]}'`;
            statement += i != len ? ',' : '';
        });
        statement += `);`;
        console.log(statement);
        await conn.execute(statement);

        return res.redirect('/cars');
    }
    catch(e){
        return res.status(500).json({ message: e.message });
    }
};

const updateView = async (req, res, next)=>{
    const {id} = req.params;
    try{
        const conn = await driver.connect(config);
        const result = await conn.execute(`SELECT * FROM CAR WHERE ID='${id}'`);
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
            title: "Cars - Update",
            headerTitle: "Update Car",
            values: values,
            fields: Object.keys(values),
            datatypes: datatypes,
            action: `/cars/${values['ID']}/update`,
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

        let statement = 'UPDATE CAR SET ';
        const len = fields.length - 1;
        fields.forEach(function(field, i){
            if(field != 'ID'){
                statement += `${field}='${body[field]}'`;

                statement += i != len ? ', ' : ' ';
            }
        });
        statement += `WHERE ID='${body['ID']}';`;

        await conn.execute(statement);

        return res.redirect('/cars');
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
        await conn.execute(`DELETE FROM CAR WHERE ID='${id}'`);
        return res.redirect('/cars');
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