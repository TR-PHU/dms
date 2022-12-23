const {driver, config} = require('../models/connectDB');
const moment = require('moment');

const index = async (req, res, next)=>{
    try{
        const conn = await driver.connect(config);
        const result = await conn.execute('SELECT * FROM CARIMPORT');
        const rows = await result.getRows();
        
        rows.forEach(row => row['IMPORTDATE']=moment(row['IMPORTDATE']).format("YYYY-MM-DD"))

        return res.render('pages/carImportList', {
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
        const carResult = await conn.execute('SELECT NAME, ID FROM CAR');
        const cars = await carResult.getRows();
        const carOptions = [];
        cars.forEach(car => carOptions.push({text: car['NAME'], value: car['ID']}))

        const defaultValues = {
            'CARID': carOptions[0].value,
            'IMPORTDATE': moment(Date.now()).format("YYYY-MM-DD"),
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
    try{
        fields = Object.keys(body) || [];
        const conn = await driver.connect(config);

        body['IMPORTDATE']=moment(body['IMPORTDATE']).format("YYYY-MM-DD")

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
    try{
        console.log(carid, importdate)
        const conn = await driver.connect(config);
        const result = await conn.execute(`SELECT * FROM CARIMPORT WHERE CARID='${carid}' AND IMPORTDATE=DATE('${importdate}')`);
        const rows = await result.getRows();
        const values = rows[0];
        values['IMPORTDATE']=moment(values['IMPORTDATE']).format("YYYY-MM-DD");

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
            title: "Car Imports - Update",
            headerTitle: "Update Car Import",
            values: values,
            fields: Object.keys(values),
            datatypes: datatypes,
            action: `/car-imports/update?carid=${values['CARID']}&importdate=${values['IMPORTDATE']}`,
            method: "post"
        });
    }
    catch(e){
        return res.status(500).json({ message: e.message });
    }
};

const update = async (req, res, next)=>{
    const body = req.body;
    const {carid, importdate} = req.query;
    try{
        fields = Object.keys(body) || [];
        const conn = await driver.connect(config);

        body['IMPORTDATE']=moment(body['IMPORTDATE']).format("YYYY-MM-DD");

        let statement = 'UPDATE CARIMPORT SET ';
        const len = fields.length - 1;
        fields.forEach(function(field, i){
            if(field != 'ID'){
                statement += `${field}='${body[field]}'`;

                statement += i != len ? ', ' : ' ';
            }
        });
        statement += `WHERE CARID='${carid}' AND IMPORTDATE=DATE('${importdate}');`;

        await conn.execute(statement);

        return res.redirect('/car-imports');
    }
    catch(e){
        return res.status(500).json({ message: e.message });
    }
};

const remove = async (req, res, next)=>{
    const {carid, importdate} = req.body;
    try{
        const conn = await driver.connect(config);
        await conn.execute(`DELETE FROM CARIMPORT WHERE CARID='${carid}' AND IMPORTDATE=DATE('${importdate}')`);
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