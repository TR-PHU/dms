const {driver, config} = require('../models/connectDB');
const moment = require('moment');

const index = async (req, res, next)=>{
    try{
        const conn = await driver.connect(config);
        const result = await conn.execute('SELECT * FROM PAYMENTDETAIL');
        const rows = await result.getRows();
        
        return res.render('pages/paymentDetailList', {
            title: "Payment Details",
            headerTitle: "Payment Detail List",
            rows: rows,
            fields: rows.length > 0 ? Object.keys(rows[0]) : [],
            router: 'payment-details'
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
        const carOptions = cars.map(car => {
            return {
                text: `Id: ${car['ID']} - Name: ${car['NAME']}`, 
                value: car['ID']
            };
        });

        const paymentResult = await conn.execute('SELECT ID, PAYMENTDATE, TOTALPRICE FROM PAYMENT');
        const payments = await paymentResult.getRows();
        const paymentOptions = payments.map(p => {
            p['PAYMENTDATE']=moment(p['PAYMENTDATE']).format("YYYY-MM-DD");

            return{
                text: `Id: ${p['ID']} - Date: ${p['PAYMENTDATE']} - Total: ${p['TOTALPRICE']}`, 
                value: p['ID']
            };
        });

        const defaultValues = {
            'CARID': carOptions[0].value,
            'PAYMENTID': paymentOptions[0].value,
            'EXPORTQUANTITY': '1',
        };
      
        const datatypes = {
            'CARID': {
                options: carOptions
            },
            'PAYMENTID': {
                options: paymentOptions
            },
            'EXPORTQUANTITY': 'number',
        };
    
        return res.render('pages/commonForm', {
            title: "Payment Details - Create",
            headerTitle: "Create Payment Detail",
            values: defaultValues,
            fields: Object.keys(datatypes),
            datatypes: datatypes,
            action: `/payment-details/create`,
            method: "post"
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

        let statement = 'INSERT INTO PAYMENTDETAIL VALUES (';
        const len = fields.length - 1;
        fields.forEach(function(field, i){
            statement += `'${body[field]}'`;
            statement += i != len ? ',' : '';
        });
        statement += `);`;
        console.log(statement);
        await conn.execute(statement);

        return res.redirect('/payment-details');
    }
    catch(e){
        return res.status(500).json({ message: e.message });
    }
};

const updateView = async (req, res, next)=>{
    let {carid, paymentid} = req.query;
    try{
        const conn = await driver.connect(config);
        const result = await conn.execute(`SELECT * FROM PAYMENTDETAIL WHERE CARID='${carid}' AND PAYMENTID='${paymentid}';`);
        const rows = await result.getRows();
        const values = rows[0];

        const carResult = await conn.execute('SELECT * FROM CAR');
        const cars = await carResult.getRows();
        const carOptions = cars.map(car => {
            return {
                text: `Id: ${car['ID']} - Name: ${car['NAME']}`, 
                value: car['ID']
            };
        });

        const paymentResult = await conn.execute('SELECT ID, PAYMENTDATE, TOTALPRICE FROM PAYMENT');
        const payments = await paymentResult.getRows();
        const paymentOptions = payments.map(p => {
            p['PAYMENTDATE']=moment(p['PAYMENTDATE']).format("YYYY-MM-DD");

            return{
                text: `Id: ${p['ID']} - Date: ${p['PAYMENTDATE']} - Total: ${p['TOTALPRICE']}`, 
                value: p['ID']
            };
        });

        const datatypes = {
            'CARID': {
                options: carOptions
            },
            'PAYMENTID': {
                options: paymentOptions
            },
            'EXPORTQUANTITY': 'number',
        };

        return res.render('pages/commonForm', {
            title: "Payment Details - Update",
            headerTitle: "Update Payment Detail",
            values: values,
            fields: Object.keys(values),
            datatypes: datatypes,
            action: `/payment-details/update?carid=${values['CARID']}&paymentid=${values['PAYMENTID']}`,
            method: "post"
        });
    }
    catch(e){
        return res.status(500).json({ message: e.message });
    }
};

const update = async (req, res, next)=>{
    const body = req.body;
    const {carid, paymentid} = req.query;
    try{
        fields = Object.keys(body) || [];
        const conn = await driver.connect(config);

        let statement = 'UPDATE PAYMENTDETAIL SET ';
        const len = fields.length - 1;
        fields.forEach(function(field, i){
            if(field != 'ID'){
                statement += `${field}='${body[field]}'`;

                statement += i != len ? ', ' : ' ';
            }
        });
        statement += `WHERE CARID='${carid}' AND PAYMENTID='${paymentid}';`;

        await conn.execute(statement);

        return res.redirect('/payment-details');
    }
    catch(e){
        return res.status(500).json({ message: e.message });
    }
};

const remove = async (req, res, next)=>{
    const {carid, paymentid} = req.body;
    try{
        const conn = await driver.connect(config);
        await conn.execute(`EXECUTE prc_paymentdetail_delete('${carid}', '${paymentid}');`);
        return res.redirect('/payment-details');
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