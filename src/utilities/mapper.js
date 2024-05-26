function generateCreateTableQuery(tableName, fields) {
    console.log(tableName, fields,"==>")
    let query = `CREATE TABLE IF NOT EXISTS ${tableName} (`;

    // Iterate over each field and add it to the query
    for (const fieldName in fields) {
        const fieldType = fields[fieldName];
        let sqlType;
        switch (fieldType) {
            case 'uuid':
                sqlType = 'UUID';
                break;
            case 'string':
                sqlType = 'VARCHAR';
                break;
            case 'email':
                sqlType = 'VARCHAR CHECK (' + fieldName + " ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')";
                break;
            case 'number':
                sqlType = 'NUMERIC';
                break;
            case 'boolean':
                sqlType = 'BOOLEAN';
                break;
            default:
                throw new Error(`Unsupported field type: ${fieldType}`);
        }
        query += `${fieldName} ${sqlType}, `;
    }

    // Add primary key constraint
    query += `PRIMARY KEY (uniqueId));`;

    return query;
}
function validateFormData(data) {
    const { uniqueId, name, email, phoneNumber, isGraduate } = data;

    if (!uniqueId || !name || !email || !phoneNumber || isGraduate === undefined) {
        return { valid: false, message: 'All fields are required' };
    }

    if (typeof uniqueId !== 'string' || !/^[0-9a-fA-F-]{36}$/.test(uniqueId)) {
        return { valid: false, message: 'Invalid UUID' };
    }

    if (typeof name !== 'string') {
        return { valid: false, message: 'Name must be a string' };
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (typeof email !== 'string' || !emailRegex.test(email)) {
        return { valid: false, message: 'Invalid email' };
    }
    if (typeof phoneNumber != 'number' || !/^\d+$/.test(phoneNumber)) {
        console.log(typeof phoneNumber ,'===')
        return { valid: false, message: 'Phone number must be numeric' };
    }

    if (typeof isGraduate !== 'boolean') {
        return { valid: false, message: 'isGraduate must be boolean' };
    }

    return { valid: true };
}
async function tableExists(client, tableName) {
    const query = `
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = $1
        );
    `;
    try {
        const result = await client.query(query, [tableName]);
        return result.rows[0].exists;
    } catch (error) {
        console.error('Error checking table existence:', error);
        throw error;
    }
}
module.exports = {generateCreateTableQuery,validateFormData,tableExists}