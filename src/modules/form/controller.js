const constants = require("../../utilities/constants");
const { customResponse } = require("../../utilities/helper");
const client = require("./../../Database/db")
const {generateCreateTableQuery,validateFormData}  = require('./../../utilities/mapper')

module.exports.createForm = async (req, res) => {

    try {
        const {uniqueId,title,name,email,phoneNumber,isGraduate }  = req.body
        
        if (!uniqueId || !title){
            code = constants.HTTP_400_CODE;
            message = "unique identifier or name required";
            success = false;
            const resData = customResponse({
              code,
              message,
              success,
            });
            return res.status(code).send(resData);
        }

        try {

            const data = {
                uniqueId:uniqueId.toLowerCase(),
                name:name.toLowerCase(),
                email:email.toLowerCase(),
                phoneNumber:phoneNumber.toLowerCase(),
                isGraduate:isGraduate.toLowerCase()
            }

            const createTableQuery = generateCreateTableQuery(title, data);
            await client.query(createTableQuery);
            console.log(`Table '${title}' created successfully.`);
            // await client.query('BEGIN');

            // const formResult = await client.query(
            //     'INSERT INTO forms (name) VALUES ($1) RETURNING id',
            //     [formName]
            // );
            // const formId = formResult.rows[0].id;

            // for (const field of fields) {
            //     await client.query(
            //         'INSERT INTO form_fields (form_id, field_name, field_type) VALUES ($1, $2, $3)',
            //         [formId, field.name, field.type]
            //     );
            // }

            // await client.query('COMMIT');
   
            // const data =  { id: formId };
            return res.status(constants.HTTP_201_CODE).send('Table created Succesfully');
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        }


    } catch (error) {

        console.log("error in createForm , form endpoint", error);
        code = error?.code ? error.code : constants.HTTP_400_CODE;
        message = error?.message ? error.message : constants.SOMETHING_WRONG_MSG;
        const resData = customResponse({
            code,
            message,
            err: error.message,
        });
        return res.status(400).send(resData);
    }

}

module.exports.fillFormData = async (req, res) => {

    try {


        const {form_title} = req.query;
        const {uniqueId,name,email,phoneNumber,isGraduate }  = req.body
        if (!form_title){
            code = constants.HTTP_400_CODE;
            message = "form_title is required in params";
            success = false;
            const resData = customResponse({
              code,
              message,
              success,
            });
            return res.status(code).send(resData);

        }
        const validation = validateFormData(req.body);

        if (!validation.valid) {
            code = constants.HTTP_400_CODE;
            message = validation?.message
            success = false;
            const resData = customResponse({
              code,
              message,
              success,
            });
            return res.status(code).send(resData);
        }
        const insertQuery = `
            INSERT INTO ${form_title} (uniqueId, name, email, phoneNumber, isGraduate)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;

  
    const result = await client.query(insertQuery, [uniqueId, name, email, phoneNumber, isGraduate]);
    res.status(201).json({ message: 'Form submitted successfully', data: result.rows[0] });
   
       

    } catch (error) {

        console.log("error in createForm , form endpoint", error);
        code = error?.code ? error.code : constants.HTTP_400_CODE;
        message = error?.message ? error.message : constants.SOMETHING_WRONG_MSG;
        const resData = customResponse({
            code,
            message,
            err: error.message,
        });
        return res.status(400).send(resData);
    }

}


module.exports.getFormData = async (req, res) => {

    try {


        const {form_title} = req.query;
        if (!form_title){
            code = constants.HTTP_400_CODE;
            message = "form_title is required in params";
            success = false;
            const resData = customResponse({
              code,
              message,
              success,
            });
            return res.status(code).send(resData);

        }
        const insertQuery = `
            SELECT * FROM  ${form_title}
        `;

  
    const result = await client.query(insertQuery);
    res.status(201).json({ message: 'Form submitted successfully', data: result.rows });
   
       

    } catch (error) {

        console.log("error in createForm , form endpoint", error);
        code = error?.code ? error.code : constants.HTTP_400_CODE;
        message = error?.message ? error.message : constants.SOMETHING_WRONG_MSG;
        const resData = customResponse({
            code,
            message,
            err: error.message,
        });
        return res.status(400).send(resData);
    }

}