const constants = require("../../utilities/constants");
const { customResponse } = require("../../utilities/helper");
const client = require("./../../Database/db")
const { generateCreateTableQuery, validateFormData, generateDynamicModel, checkTableExists } = require('./../../utilities/mapper')
const executeQuery = require('./../../Database/query')
const { v4: uuidv4 } = require('uuid');


module.exports.createForm = async (req, res) => {

    try {
        const { uniqueId, title, name, email, phoneNumber, isGraduate } = req.body

        if (!uniqueId || !title) {
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
                uniqueId: uniqueId.toLowerCase(),
                name: name.toLowerCase(),
                email: email.toLowerCase(),
                phoneNumber: phoneNumber.toLowerCase(),
                isGraduate: isGraduate.toLowerCase()
            }

            // const createTableQuery = generateCreateTableQuery(title, data);
            // const result = await executeQuery(createTableQuery);
            // console.log(`Table '${title}' created successfully.`);

            const tableExists = await checkTableExists(title);

            if (tableExists) {
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

            const model = generateDynamicModel(title, data);
            console.log("dara,,,,,,")
            await model.sync({ force: true }); // { force: true } will drop the table if it already exists

            code = constants.HTTP_201_CODE;
            message = `Table '${title}' created successfully.`
            success = true;
            const resData = customResponse({
                code,
                message,
                success,
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
        const { form_title } = req.query;
        const data = req.body
        if (!form_title) {
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
        const validation = validateFormData(data);

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
       
        const uniqueID = uuidv4(); // Generate a unique ID
        // data.uniqueId = uniqueID; // we can add uniqueId to the data object

        const model = generateDynamicModel(form_title, {
            uniqueId: 'uuid',
            ...Object.fromEntries(Object.entries(data).map(([key, value]) => [key, typeof value]))
        });
        await model.sync();

        const result = await model.create(data);
        code = constants.HTTP_201_CODE;
        message = 'Form submitted successfully'
        success = true;
        const resData = customResponse({
            code,
            message,
            success,
            data: result
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


        const { form_title } = req.query;
        if (!form_title) {
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
       
        const model = generateDynamicModel(form_title, {
            uniqueId: 'uuid',
            name: 'string',
            email: 'email',
            phoneNumber: 'string',
            isGraduate: 'boolean'
        });

        const result = await model.findAll();
        code = constants.HTTP_200_CODE;
        message = 'Form data fetched successfully'
        success = true;
        const resData = customResponse({
            code,
            message,
            success,
            data: result
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