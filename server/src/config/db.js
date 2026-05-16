import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
        console.log('DB Connected');
    })
         await mongoose.connect(`${process.env.MONGODB_URI}/chatApp`)
        // await mongoose.connect(process.env.MONGODB_URI+process.env.DATABASE_NAME, {
    
        // const db = mongoose.connection;
        
        // console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    } 
}

export default connectDB;