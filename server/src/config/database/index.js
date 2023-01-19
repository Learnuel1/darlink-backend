const sql =require('mssql/msnodesqlv8');
const {  getDB_NAME, getDB_PWD, getDB_USER, getDB_SERVER } = require('../env');

const DB=getDB_NAME();
const SERVER_NAME =getDB_SERVER();
const sqlConfig = {
     user: getDB_USER(),
    password: getDB_PWD(),
    database: getDB_NAME(),
    server:SERVER_NAME,// "LEARNUELTECHNOL\\SQLEXPRESS", //use instance for local dev
    // driver:"msnodesqlv8", //endable for local dev
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {
    //   encrypt: true, // for azure
      // trustedConnection:true,
      trustServerCertificate: true // change to true for local dev / self-signed certs
    }

  }
  const appPool = new sql.ConnectionPool(sqlConfig)
const sqlConnection=async()=>{
    try {
        console.log(`Connecting to database...`)
        await sql.connect(sqlConfig)
        console.log(`Database connected...`)
    } catch (error) {
        console.log(error)
        process.exit(-1);
    }
}

module.exports={
    sqlConnection,
    sql,
    appPool,
}