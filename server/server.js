const app =require('./src/app')
const { getServerPort } = require('./src/config/env')
const dbConnect = require('./src/config/db.config');
const appRoute = require('./src/routes');
const { errorMiddleWareModule } = require('./src/middlewares');
const { engine } =require ('express-handlebars');
const logger = require('./src/logger');
const PORT = getServerPort() || 3000;
app.engine('.handlebars', engine({extname: '.handlebars'}));
app.set('view engine', '.handlebars');
app.set('views', '../src/views');
 
app.use('/api/v1/',appRoute.routesRouter)

app.all("*",errorMiddleWareModule.notFound );
app.use(errorMiddleWareModule.errorHandler);
app.listen(PORT,async()=>{
try {
  
 await dbConnect.sqlConnection();
   logger.info(`server running on port ${PORT}`)
} catch (error) {
    logger.error(error)
    process.exit(-1)
}
})