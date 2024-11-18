const odbc = require("odbc");

let kuduInstance = null; // Singleton instance

const connectKudu = async () => {
    if (!kuduInstance) {
        try {
            kuduInstance = await odbc.connect(`DSN=${process.env.DSN};`);
            // Test the connection with a simple query
            console.log('KUDU DATABASE CONNECTED SUCCESSFULLY');
            
        } catch (error) {
            console.error('KUDU DATABASE CONNECTION ERROR:', error);
            throw error;
        }
    }
    return kuduInstance;
};

module.exports = connectKudu;