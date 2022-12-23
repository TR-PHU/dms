 /*
 DROP TABLE PAYMENTDETAIL CASCADE;
 DROP TABLE PAYMENT CASCADE;
 DROP TABLE CUSTOMER CASCADE;
 DROP TABLE EMPLOYEE CASCADE;
 DROP TABLE CARIMPORT CASCADE;
 DROP TABLE CAR CASCADE;
 
 
 SELECT * FROM CAR;

 SELECT * FROM CARIMPORT;

 SELECT * FROM CUSTOMER;

 SELECT * FROM EMPLOYEE;

 SELECT * FROM PAYMENT;

 SELECT * FROM PAYMENTDETAIL;

 */
  
  -- DDL
  CREATE TABLE "CAR" 
   (	
    	"ID" VARCHAR(10), 
	"NAME" VARCHAR(50), 
	"VENDOR" VARCHAR(50), 
	"PRICE" BIGINT,
	"QUANTITY" INTEGER,
	CONSTRAINT "CARS_PK" PRIMARY KEY ("ID")
   );

  CREATE TABLE "CUSTOMER" 
   (	
    	"ID" VARCHAR(10) PRIMARY KEY, 
	"NAME" VARCHAR(50), 
	"GENDER" VARCHAR(50), 
	"DOB" DATE, 
	"PHONE" VARCHAR(50), 
	"ADDRESS" VARCHAR(50),
	CONSTRAINT "CUSTOMERS_PK" PRIMARY KEY ("ID")
   );

  CREATE TABLE "EMPLOYEE" 
   (	
    	"ID" VARCHAR(10), 
	"NAME" VARCHAR(50), 
	"GENDER" VARCHAR(50), 
	"DOB" DATE, 
	"ADDRESS" VARCHAR(50), 
	"PHONE" VARCHAR(50), 
	"SALARY" BIGINT,
	"USERNAME" VARCHAR(20),
	"PASSWORD" VARCHAR(50)
	CONSTRAINT "EMPLOYEES_PK" PRIMARY KEY ("ID")
   );

  CREATE TABLE "PAYMENT" 
   (	
    	"ID" VARCHAR(10), 
	"CUSID" VARCHAR(10), 
    	"EMPID" VARCHAR(10), 
	"PAYMENTDATE" DATE, 
	"TOTALPRICE" BIGINT,
	CONSTRAINT "PAYMENTS_PK" PRIMARY KEY ("ID"),
	CONSTRAINT "PAYMENTS_FK" FOREIGN KEY ("CUSID") REFERENCES "CUSTOMER" ("ID"),
	CONSTRAINT "PAYMENTS_FK_2" FOREIGN KEY ("EMPID") REFERENCES "EMPLOYEE" ("ID")
   );

  CREATE TABLE "PAYMENTDETAIL" 
   (	
	"CARID" VARCHAR(10), 
    	"PAYMENTID" VARCHAR(10), 
	"EXPORTQUANTITY" INTEGER, 
	CONSTRAINT "PAYMENT_DETAILS_PK" PRIMARY KEY ("PAYMENTID", "CARID"),
    	CONSTRAINT "PAYMENT_DETAILS_FK_1" FOREIGN KEY ("PAYMENTID") REFERENCES "PAYMENT" ("ID"),
	CONSTRAINT "PAYMENT_DETAILS_FK_2" FOREIGN KEY ("CARID") REFERENCES "CAR" ("ID")
   );

  CREATE TABLE "CARIMPORT" 
   (	
	"CARID" VARCHAR(10), 
	"IMPORTDATE" DATE, 
	"IMPORTQUANTITY" INTEGER,
	CONSTRAINT "WH_IMPORTS_PK" PRIMARY KEY ("CARID", "IMPORTDATE"),
    	CONSTRAINT "WH_IMPORTS_FK_2" FOREIGN KEY ("CARID") REFERENCES "CAR" ("ID")
   );


Insert into CAR values ('1','Mirage','Mitsubishi',24500, 10);
Insert into CAR values ('2','Daytona','Dodge',43600, 7);
Insert into CAR values ('3','Pathfinder','Nissan',18700, 7);
Insert into CAR values ('4','4Runner','Toyota',46800, 6);
Insert into CAR values ('5','300ZX','Nissan',31000, 4);
Insert into CAR values ('6','Jimmy','GMC',34400, 8);
Insert into CAR values ('7','Panamera','Porsche',14700, 10);
Insert into CAR values ('8','Freelander','Land Rover',43100, 5);
Insert into CAR values ('9','Sidekick','Suzuki',42500, 5);
Insert into CAR values ('10','Roadster','Tesla',38300, 2);

Insert into CUSTOMER values ('1','Selene Grieves','Female',DATE('26-APR-92'),'8203058328','03097 Blue Bill Park Court');
Insert into CUSTOMER values ('2','Kasey Haibel','Female',DATE('05-NOV-96'),'4014337973','51165 Paget Plaza');
Insert into CUSTOMER values ('3','Shaughn Guille','Male',DATE('17-AUG-95'),'5633153005','8 Anderson Trail');
Insert into CUSTOMER values ('4','Nikoletta Sponder','Female',DATE('24-SEP-95'),'8581804749','24523 Jenifer Plaza');
Insert into CUSTOMER values ('5','Garrott McCawley','Male',DATE('06-OCT-94'),'2615108932','078 Charing Cross Court');

Insert into EMPLOYEE values ('1','Anita Jacomb','Female',DATE('06-JUN-05'),'350 Buell Circle','9378061121',1730, 'NV01', '1');
Insert into EMPLOYEE values ('2','Julita Culter','Female',DATE('04-FEB-03'),'2 Katie Avenue','5046123563',1400, 'NV02', '1');
Insert into EMPLOYEE values ('3','Helenka Dightham','Female',DATE('11-APR-02'),'443 Anhalt Park','9805885367',1680, 'NV03', '1');
Insert into EMPLOYEE values ('4','Taddeo MacKenny','Male',DATE('27-NOV-03'),'71064 Eliot Point','8431092484',1190, 'NV04', '1');
Insert into EMPLOYEE values ('5','Suellen Romke','Female',DATE('03-AUG-00'),'67 Center Terrace','3542337060',1890, 'NV05', '1');

Insert into CARIMPORT values ('10',DATE('22-AUG-10'),8);
Insert into CARIMPORT values ('4',DATE('04-OCT-19'),9);
Insert into CARIMPORT values ('6',DATE('02-APR-22'),10);
Insert into CARIMPORT values ('2',DATE('24-JUN-16'),5);
Insert into CARIMPORT values ('7',DATE('17-JUL-13'),7);
Insert into CARIMPORT values ('9',DATE('02-JUL-19'),4);
Insert into CARIMPORT values ('4',DATE('08-OCT-20'),4);
Insert into CARIMPORT values ('1',DATE('02-JUL-19'),4);
Insert into CARIMPORT values ('3',DATE('08-OCT-20'),4);

Insert into PAYMENT values ('1','2','1',DATE('28-OCT-14'),92200);
Insert into PAYMENT values ('2','3','4',DATE('24-JAN-21'),409500);
Insert into PAYMENT values ('3','4','5',DATE('20-DEC-16'),268800);
Insert into PAYMENT values ('4','2','2',DATE('03-NOV-12'),270600);
Insert into PAYMENT values ('5','5','1',DATE('13-AUG-19'),55000);

Insert into PAYMENTDETAIL values ('2','1',3);
Insert into PAYMENTDETAIL values ('1','1',1);
Insert into PAYMENTDETAIL values ('2','5',5);
Insert into PAYMENTDETAIL values ('6','1',3);
Insert into PAYMENTDETAIL values ('8','2',3);
Insert into PAYMENTDETAIL values ('3','4',3);
Insert into PAYMENTDETAIL values ('1','2',4);
Insert into PAYMENTDETAIL values ('8','3',4);
Insert into PAYMENTDETAIL values ('5','3',2);
Insert into PAYMENTDETAIL values ('10','2',2);
Insert into PAYMENTDETAIL values ('9','5',5);
Insert into PAYMENTDETAIL values ('4','4',1);

commit;


-- PROCEDURE ->> only use this statement in terminal
DROP PROCEDURE IF EXISTS prc_payment_delete;
CREATE PROCEDURE prc_payment_delete (IN p_id VARCHAR(10)) 
AS
      DELETE FROM PAYMENTDETAIL WHERE PAYMENTID=p_id;
      DELETE FROM PAYMENT WHERE ID=p_id;
END_PROCEDURE;
@

-- PROCEDURE 2 ->> only use this statement in terminal
DROP PROCEDURE IF EXISTS prc_paymentdetail_delete;
CREATE PROCEDURE prc_paymentdetail_delete (IN car_id VARCHAR(10), IN p_id VARCHAR(10)) 
AS
      VAR total BIGINT=0;
      
      DELETE FROM PAYMENTDETAIL WHERE PAYMENTID=p_id AND CARID=car_id;
      
      total=calc_total_price(p_id);
      UPDATE PAYMENT
      SET TOTALPRICE=total
      WHERE ID=p_id;
END_PROCEDURE;
@

--EXAMPLE: EXECUTE prc_payment_delete('P041264');

-- FUNCTION ->> only use this statement in terminal
DROP FUNCTION IF EXISTS calc_total_price;
CREATE FUNCTION calc_total_price (p_id VARCHAR(10)) RETURNS BIGINT
AS
      VAR total BIGINT=0;
      total = (SELECT SUM(TONG1LOAIXE)
                FROM (
                        SELECT EXPORTQUANTITY*PRICE AS TONG1LOAIXE
                        FROM PAYMENTDETAIL PD, CAR C
                        WHERE PAYMENTID=p_id AND PD.CARID=C.ID
                     ));
      return total;
END_FUNCTION;
@

-- TRIGGER ->> only use this statement in terminal
CREATE OR REPLACE TRIGGER trg_carimport_insert FOR CARIMPORT 
AFTER INSERT
AS
    UPDATE CAR
    SET QUANTITY=QUANTITY+NEW.IMPORTQUANTITY
    WHERE ID=NEW.CARID;
END_TRIGGER;
@

-- TRIGGER 2 ->> only use this statement in terminal
CREATE OR REPLACE TRIGGER trg_paymentdetail_insert FOR PAYMENTDETAIL 
AFTER INSERT
AS
    VAR total BIGINT=0;
    
    UPDATE CAR
    SET QUANTITY=QUANTITY-NEW.EXPORTQUANTITY
    WHERE ID=NEW.CARID;
    
    total=calc_total_price(NEW.PAYMENTID);
    UPDATE PAYMENT
    SET TOTALPRICE=total
    WHERE ID=NEW.PAYMENTID;
END_TRIGGER;
@







