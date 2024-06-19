const mongoose = require('mongoose');


const dbConnect = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI);
        console.log('DB conectada');
    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de inicializar la base de datos');
    }
}

module.exports = {
    dbConnect
}
