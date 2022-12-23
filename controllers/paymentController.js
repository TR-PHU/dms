const {driver, config} = require('../models/connectDB');
const moment = require('moment');

const index = async (req, res, next)=>{
    try{
        const conn = await driver.connect(config);
        const result = await conn.execute('SELECT * FROM PAYMENT');
        const rows = await result.getRows();

        rows.forEach(row => row['PAYMENTDATE']=moment(row['PAYMENTDATE']).format("YYYY-MM-DD"))
        
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
        const carResult = await conn.execute('SELECT ID, NAME, PRICE FROM CAR');
        const cars = await carResult.getRows();

        const customerResult = await conn.execute('SELECT * FROM CUSTOMER');
        const customers = await customerResult.getRows();
        const customerOptions = customers.map(c => {
            return {
                text: `Id: ${c['ID']} - Name: ${c['NAME']} - Gender: ${c['GENDER']}`, 
                value: c['ID']
            };
        });

        const defaultValues = {
            'ID': 'P'+Math.round(Math.random()*100000).toString().padStart(6, '0'),
            'CUSID': customers[0]['ID'],
            'PAYMENTDATE': moment(Date.now()).format("YYYY-MM-DD"),
        };
    
        const datatypes = {
            'ID': 'text',
            'CUSID': {
                options: customerOptions
            },
            'PAYMENTDATE': 'date',
        };

        const defaultCarSelection = [
            {
                'carid': cars[0]['ID'],
                'quantity': 1
            }
        ];

        return res.render('pages/paymentForm', {
            title: "Payments - Create",
            headerTitle: "Create Payment",
            values: defaultValues,
            fields: Object.keys(datatypes),
            datatypes: datatypes,
            action: `/payments/create`,
            method: "post",
            cars: cars,
            defaultCarSelection: defaultCarSelection
        });
    }
    catch(e){
        return res.status(500).json({ message: e.message });
    }
};

const create = async (req, res, next)=>{
    const body = req.body;
    try{
        const conn = await driver.connect(config);

        const carResult = await conn.execute('SELECT ID, NAME, PRICE FROM CAR');
        const cars = await carResult.getRows();
        
        const carIdList = body['car-id-list'] instanceof Array ? body['car-id-list'] : [body['car-id-list']];
        const quantityList = body['quantity-list'] instanceof Array ? body['quantity-list'] : [body['quantity-list']];

        let totalPrice = 0;
        cars.forEach(car => {
            const index = carIdList.findIndex(carid => carid == car['ID']);
            if(index > -1){
                totalPrice = totalPrice + parseInt(car['PRICE'])*parseInt(quantityList[index]);
            }
        });

        const data = {};
        data['ID'] = body['ID'];
        data['CUSID'] = body['CUSID'];
        data['EMPID'] = '1';
        data['PAYMENTDATE'] = moment(body['PAYMENTDATE']).format("YYYY-MM-DD");
        data['TOTALPRICE'] = totalPrice;
        const fields = Object.keys(data) || [];

        let statement = 'INSERT INTO PAYMENT VALUES (';
        const len = fields.length - 1;
        fields.forEach(function(field, i){
            statement += `'${data[field]}'`;
            statement += i != len ? ',' : '';
        });
        statement += `);`;
        console.log(statement);
        await conn.execute(statement);

        carIdList.forEach(async (carId, i) => {
            try{
                const stm = `INSERT INTO PAYMENTDETAIL VALUES ('${carId}', '${body['ID']}', '${quantityList[i]}')`;
                await conn.execute(stm);
            }
            catch(e){
                console.log(e.message);
                //return res.status(500).json({ message: e.message });
            }
        });

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

        const paymentResult = await conn.execute(`SELECT * FROM PAYMENT WHERE ID='${id}'`);
        const payments = await paymentResult.getRows();
        payments[0]['PAYMENTDATE']=moment(payments[0]['PAYMENTDATE']).format("YYYY-MM-DD");

        const paymentDetailResult = await conn.execute(`SELECT * FROM PAYMENTDETAIL WHERE PAYMENTID='${id}'`);
        const paymentDetails = await paymentDetailResult.getRows();
        const defaultCarSelection = paymentDetails.map(paymentdetail => {
            return {
                'carid': paymentdetail['CARID'],
                'quantity': paymentdetail['EXPORTQUANTITY']
            }
        });

        const carResult = await conn.execute('SELECT ID, NAME, PRICE FROM CAR');
        const cars = await carResult.getRows();

        const customerResult = await conn.execute('SELECT * FROM CUSTOMER');
        const customers = await customerResult.getRows();
        const customerOptions = customers.map(c => {
            return {
                text: `Id: ${c['ID']} - Name: ${c['NAME']} - Gender: ${c['GENDER']}`, 
                value: c['ID']
            };
        });

        const employeeResult = await conn.execute('SELECT * FROM EMPLOYEE');
        const employees = await employeeResult.getRows();
        const employeeOptions = employees.map(e => {
            return {
                text: `Id: ${e['ID']} - Name: ${e['NAME']} - Gender: ${e['GENDER']}`, 
                value: e['ID']
            };
        });
    
        const datatypes = {
            'ID': 'text',
            'CUSID': {
                options: customerOptions
            },
            'EMPID': {
                options: employeeOptions
            },
            'PAYMENTDATE': 'date',
        };

        return res.render('pages/paymentForm', {
            title: "Payments - Update",
            headerTitle: "Update Payment",
            values: payments[0],
            fields: Object.keys(datatypes),
            datatypes: datatypes,
            action: `/payments/${id}/update`,
            method: "post",
            cars: cars,
            defaultCarSelection: defaultCarSelection
        });
    }
    catch(e){
        return res.status(500).json({ message: e.message });
    }
};

const update = async (req, res, next)=>{
    const {id} = req.params;
    const body = req.body;
    console.log(body)
    try{
        const conn = await driver.connect(config);

        const carResult = await conn.execute('SELECT ID, NAME, PRICE FROM CAR');
        const cars = await carResult.getRows();
        
        const carIdList = body['car-id-list'] instanceof Array ? body['car-id-list'] : [body['car-id-list']];
        const quantityList = body['quantity-list'] instanceof Array ? body['quantity-list'] : [body['quantity-list']];

        let totalPrice = 0;
        cars.forEach(car => {
            const index = carIdList.findIndex(carid => carid == car['ID']);
            if(index > -1){
                totalPrice = totalPrice + parseInt(car['PRICE'])*parseInt(quantityList[index]);
            }
        });

        const data = {};
        data['ID'] = body['ID'];
        data['CUSID'] = body['CUSID'];
        data['EMPID'] = body['EMPID'];
        data['PAYMENTDATE'] = moment(body['PAYMENTDATE']).format("YYYY-MM-DD");
        data['TOTALPRICE'] = totalPrice;
        const fields = Object.keys(data) || [];

        let statement = 'UPDATE PAYMENT SET ';
        const len = fields.length - 1;
        fields.forEach(function(field, i){
            if(field != 'ID'){
                statement += `${field}='${data[field]}'`;

                statement += i != len ? ', ' : ' ';
            }
        });
        statement += `WHERE ID='${data['ID']}';`;
        console.log(statement);
        await conn.execute(statement);

        await conn.execute(`DELETE FROM PAYMENTDETAIL WHERE PAYMENTID='${id}'`);

        carIdList.forEach(async (carId, i) => {
            try{
                const stm = `INSERT INTO PAYMENTDETAIL VALUES ('${carId}', '${data['ID']}', '${quantityList[i]}')`;
                await conn.execute(stm);
            }
            catch(e){
                console.log(e.message);
                //return res.status(500).json({ message: e.message });
            }
        });

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
        await conn.execute(`EXECUTE prc_payment_delete('${id}')`);
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