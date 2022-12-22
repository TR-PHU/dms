const {driver, config} = require('../models/connectDB');

const index = async (req, res, next)=>{
    try{
        const conn = await driver.connect(config);
        const result = await conn.execute('SELECT * FROM CARIMPORT');
        const rows = await result.getRows();
        console.log(rows);
        return res.render('pages/carImport', {
            title: "Car Imports",
            headerTitle: "Car Import List",
            rows: rows,
            fields: rows.length > 0 ? Object.keys(rows[0]) : [],
            router: 'car-imports'
        });
    }
    catch(e){
        return res.status(500).json({ message: e.message });
    }
};

const createView = async (req, res, next)=>{

    try{
        const conn = await driver.connect(config);
        const carResult = await conn.execute('SELECT * FROM CAR');
        const cars = await carResult.getRows();
        const carOptions = [];
        cars.forEach(car => carOptions.push({text: car['NAME'], value: car['ID']}))

        const defaultValues = {
            'CARID': carOptions[0].value,
            'IMPORTDATE': Date.now(),
            'IMPORTQUANTITY': '99',
        };
      
        const datatypes = {
            'CARID': {
                options: carOptions
            },
            'IMPORTDATE': 'date',
            'IMPORTQUANTITY': 'number',
        };
    
        return res.render('pages/commonForm', {
            title: "Car Imports - Create",
            headerTitle: "Create Car Import",
            values: defaultValues,
            fields: Object.keys(datatypes),
            datatypes: datatypes,
            action: `/car-imports/create`,
            method: "post",
            editId: true
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

        const date = new Date(body['IMPORTDATE']).toLocaleDateString();

        body['IMPORTDATE']=date

        let statement = 'INSERT INTO CARIMPORT VALUES (';
        const len = fields.length - 1;
        fields.forEach(function(field, i){
            statement += `'${body[field]}'`;
            statement += i != len ? ',' : '';
        });
        statement += `);`;
        console.log(statement);
        await conn.execute(statement);

        return res.redirect('/car-imports');
    }
    catch(e){
        return res.status(500).json({ message: e.message });
    }
};

const updateView = async (req, res, next)=>{
    let {carid, importdate} = req.query;
    console.log(carid, importdate)
    importdate = new Date(importdate/1000);
    try{
        console.log(carid, importdate)
        const conn = await driver.connect(config);
        const result = await conn.execute(`SELECT * FROM CARIMPORT WHERE CARID=${carid} AND IMPORTDATE='${importdate}'`);
        const rows = await result.getRows();
        const values = rows[0];

        const carResult = await conn.execute('SELECT * FROM CAR');
        const cars = await carResult.getRows();
        const carOptions = [];
        cars.forEach(car => carOptions.push({text: car['NAME'], value: car['ID']}))

        const datatypes = {
            'CARID': {
                options: carOptions
            },
            'IMPORTDATE': 'date',
            'IMPORTQUANTITY': 'number',
        };

        return res.render('pages/commonForm', {
            title: "Car - Update",
            headerTitle: "Update Car",
            values: values,
            fields: Object.keys(values),
            datatypes: datatypes,
            action: `/car-imports/${values['ID']}/update`,
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

        let statement = 'UPDATE CARIMPORT SET ';
        const len = fields.length - 1;
        fields.forEach(function(field, i){
            if(field != 'ID'){
                statement += `${field}='${body[field]}'`;

                statement += i != len ? ', ' : ' ';
            }
        });
        statement += `WHERE ID=${body['ID']};`;

        await conn.execute(statement);

        return res.redirect('/car-imports');
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
        await conn.execute(`DELETE FROM CARIMPORT WHERE ID=${id}`);
        return res.redirect('/car-imports');
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