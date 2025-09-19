import mongoose from "mongoose";

const connectionDB = async() => {
    try {
        mongoose.connection.on('connected', () => {
            console.log("database connected");
        })
                   await mongoose.connect(`${process.env.MONGODB}/authdb`);

        
    } catch (error) {
        console.log(error.message);
    }
}

export default connectionDB;