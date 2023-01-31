// const sql =require('mssql/msnodesqlv8');//disable for local dev db
const logger = require('../../logger');
const sql =require('mssql');//enable for local db dev
const {  getDB_NAME, getDB_PWD, getDB_USER, getDB_SERVER } = require('../env');

const DB=getDB_NAME();
const SERVER_NAME =getDB_SERVER();
const sqlConfig = {
       user: getDB_USER(),
        password: getDB_PWD(),
      database: getDB_NAME(),
      server: SERVER_NAME,// "LEARNUELTECHNOL\\SQLEXPRESS", //use instance for local dev
      // driver:"msnodesqlv8", //endable for local dev
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {
    //   encrypt: true, // for azure
       trustedConnection:false,
        trustServerCertificate: false // change to true for local dev / self-signed certs
    }

  }
  const appPool = new sql.ConnectionPool(sqlConfig)
const sqlConnection=async()=>{
    try {
        logger.info(`Connecting to database...`)
        await sql.connect(sqlConfig)
        logger.info(`Database connected...`)
    } catch (error) {
        logger.error(error)
        process.exit(-1);
    }
    
}

module.exports={
    sqlConnection,
    sql,
    appPool,
}