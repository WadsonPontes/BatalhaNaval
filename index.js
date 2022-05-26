const app = require('./app');
const appWs = require('./app-ws');
 
const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`Servidor online!`);
})
 
appWs(server);