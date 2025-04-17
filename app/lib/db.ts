import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGODB_URI;

const connect = async () => {
    const connectionState = mongoose.connection.readyState;
    if (connectionState === 1) {
        console.log("already connected");
        return mongoose.connection;
    } else if (connectionState === 2) {
        console.log("connecting");
        return mongoose.connection;
    }
    try {
        const connection = await mongoose.connect(MONGO_URI!, {
            dbName: 'nextapi',
            bufferCommands: true,
        });
        console.log("CONNECTED");
        return connection;
    } catch (err) {
        console.log("error connecting to mongo", err);
        throw err;
    }
};

export default connect;