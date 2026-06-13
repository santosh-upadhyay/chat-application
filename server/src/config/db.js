import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
        console.log('DB Connected');
    })
    console.log('Connecting to MongoDB...');
    // console.log(process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        // const db = mongoose.connection;
        
        // console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    } 
}

export default connectDB;