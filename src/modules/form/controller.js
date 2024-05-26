const constants = require("../../utilities/constants");
const { customResponse } = require("../../utilities/helper");
const client = require("./../../Database/db")
const {generateCreateTableQuery,validateFormData,tableExists}  = require('./../../utilities/mapper')
const executeQuery = require('./../../Database/query')
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
            const exists = await tableExists(client, title);
            if (exists) {
                code = constants.HTTP_400_CODE;
                message = `Table '${title}' already exists.`;
                success = false;
                const resData = customResponse({
                    code,
                    message,
                    success,
                });
                return res.status(code).send(resData);
                
            }        

            const createTableQuery = generateCreateTableQuery(title, data);
            const result = await executeQuery(createTableQuery);
            console.log(`Table '${title}' created successfully.`);

            code = constants.HTTP_201_CODE;
            message = `Table '${title}' created successfully.`
            success = true;
            const resData = customResponse({
                code,
                message,
                success,
                data:result
            });
            return res.status(code).send(resData);  
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

  
    const result = await executeQuery(insertQuery, [uniqueId, name, email, phoneNumber, isGraduate]);
    code = constants.HTTP_201_CODE;
    message = 'Form submitted successfully'
    success = true;
    const resData = customResponse({
        code,
        message,
        success,
        data:result
    });
    return res.status(code).send(resData);   
       

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
        const insertQuery = `SELECT * FROM  ${form_title}`;
  
        const result = await executeQuery(insertQuery);
        code = constants.HTTP_200_CODE;
        message = 'Form data fetched successfully'
        success = true;
        const resData = customResponse({
            code,
            message,
            success,
            data:result
        });
        return res.status(code).send(resData);   
   
       

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