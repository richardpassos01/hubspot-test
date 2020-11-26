const { MongoClient } = require('mongodb');

let collection;

const connectToDatabase = async () => {
    const connection = await MongoClient.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    return connection.db(process.env.MONGO_DATABASE);
}

const getCollection = async () => {
    if(collection) {
        return collection;
    }

    const database = await connectToDatabase();

    const [contactLightCollection] = await Promise.all(
        ['contact_light'].map(collection => database.collection(collection)),
    );

    collection = contactLightCollection;
    return collection;
}

module.exports = {
    getCollection
};