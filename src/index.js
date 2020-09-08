if(process.env.NODE.ENV !== 'production'){
    require('dotenv').config();
}


const app = require('./app');

app.listen(app.get('port'), () =>{
    console.log(`en puerto ${app.get('port')}` ); 
});