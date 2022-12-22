CREATE TABLE
    "CAR" (
        "ID" VARCHAR(10),
        "NAME" VARCHAR(50),
        "VENDOR" VARCHAR(50),
        "PRICE" INTEGER,
        "QUANTITY" INTEGER,
        CONSTRAINT "CARS_PK" PRIMARY KEY ("ID")
    );

CREATE TABLE
    "CUSTOMER" (
        "ID" VARCHAR(10),
        "NAME" VARCHAR(50),
        "GENDER" VARCHAR(50),
        "DOB" DATE,
        "PHONE" VARCHAR(50),
        "ADDRESS" VARCHAR(50),
        CONSTRAINT "CUSTOMERS_PK" PRIMARY KEY ("ID")
    );

CREATE TABLE
    "EMPLOYEE" (
        "ID" VARCHAR(10),
        "NAME" VARCHAR(50),
        "USERNAME" VARCHAR(50),
        "PASSWORD" VARCHAR(255),
        "GENDER" VARCHAR(50),
        "DOB" DATE,
        "ADDRESS" VARCHAR(50),
        "PHONE" VARCHAR(50),
        "SALARY" INTEGER,
        CONSTRAINT "EMPLOYEES_PK" PRIMARY KEY ("ID")
    );

CREATE TABLE
    "PAYMENT" (
        "ID" VARCHAR(10),
        "CUSID" VARCHAR(10),
        "EMPID" VARCHAR(10),
        "PAYMENTDATE" DATE,
        "TOTALPRICE" INTEGER,
        CONSTRAINT "PAYMENTS_PK" PRIMARY KEY ("ID"),
        CONSTRAINT "PAYMENTS_FK" FOREIGN KEY ("CUSID") REFERENCES "CUSTOMER" ("ID"),
        CONSTRAINT "PAYMENTS_FK_2" FOREIGN KEY ("EMPID") REFERENCES "EMPLOYEE" ("ID")
    );

CREATE TABLE
    "PAYMENTDETAIL" (
        "CARID" VARCHAR(10),
        "PAYMENTID" VARCHAR(10),
        "EXPORTQUANTITY" INTEGER,
        CONSTRAINT "PAYMENT_DETAILS_PK" PRIMARY KEY ("PAYMENTID", "CARID"),
        CONSTRAINT "PAYMENT_DETAILS_FK_1" FOREIGN KEY ("PAYMENTID") REFERENCES "PAYMENT" ("ID"),
        CONSTRAINT "PAYMENT_DETAILS_FK_2" FOREIGN KEY ("CARID") REFERENCES "CAR" ("ID")
    );

CREATE TABLE
    "CARIMPORT" (
        "CARID" VARCHAR(10),
        "IMPORTDATE" DATE,
        "IMPORTQUANTITY" INTEGER,
        CONSTRAINT "WH_IMPORTS_PK" PRIMARY KEY ("CARID", "IMPORTDATE"),
        CONSTRAINT "WH_IMPORTS_FK_2" FOREIGN KEY ("CARID") REFERENCES "CAR" ("ID")
    );

INSERT INTO
    EMPLOYEE(
        "ID",
        "NAME",
        "USERNAME",
        "PASSWORD",
        "GENDER",
        "DOB",
        "ADDRESS",
        "PHONE",
        "SALARY"
    )
VALUES (
        'aaltoan01',
        'Thanh Phu',
        'phuchan',
        '123pass',
        'Nam',
        NOW(),
        '70 NDH',
        '0355479700',
        1
    );

INSERT INTO
    EMPLOYEE(
        "ID",
        "NAME",
        "USERNAME",
        "PASSWORD",
        "GENDER",
        "DOB",
        "ADDRESS",
        "PHONE",
        "SALARY"
    )
VALUES (
        'aaltoan02',
        'Kien Nam',
        'kiennam',
        '123pass',
        'Nam',
        NOW(),
        '70 NDH',
        '0355479700',
        999
    );

INSERT INTO
    CUSTOMER(
        "ID",
        "NAME",
        "GENDER",
        "DOB",
        "PHONE",
        "ADDRESS"
    )
VALUES (
        '1',
        'thanh phu',
        'Nam',
        NOW(),
        '0355479700',
        '70 NDH'
    );

INSERT INTO
    CUSTOMER(
        "ID",
        "NAME",
        "GENDER",
        "DOB",
        "PHONE",
        "ADDRESS"
    )
VALUES (
        '2',
        'kien nam',
        'Nam',
        NOW(),
        '123456789',
        'Tran Nao'
    );

INSERT INTO
    CUSTOMER(
        "ID",
        "NAME",
        "GENDER",
        "DOB",
        "PHONE",
        "ADDRESS"
    )
VALUES (
        '3',
        'thu le',
        'Nu',
        NOW(),
        '123456789',
        'KTX Khu A'
    );

INSERT INTO
    CUSTOMER(
        "ID",
        "NAME",
        "GENDER",
        "DOB",
        "PHONE",
        "ADDRESS"
    )
VALUES (
        '4',
        'ngoc son',
        'Nam',
        NOW(),
        '123456789',
        'Le Duc Tho, Go Vap'
    );