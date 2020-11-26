const express = require('express');
const { MongoClient } = require('mongodb');
const PORT = process.env.PORT;

const {
    createContactOnHubspot,
    updateContactOnHubspot,
    deleteContactOnHubspot,
} = require('./helper');

const app = express();
app.use(express.json());

app.post('/hubspot/batch', async (req, res) => {
    try {
        const messages = req.body;
        const customerIds = [];
        const customersToUpdate = {
            inputs: []
        };

        const customerToCreate = {
            inputs: []
        };
        const customersToDeleteOnHubspot = {
            inputs: []
        };
        const customersToDeleteOnMongoDb = [];

        const connection = await MongoClient.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    
        const db = await connection.db(process.env.MONGO_DATABASE);
        const [contactLightCollection] = await Promise.all(
            ['contact_light'].map(collection => db.collection(collection)),
        );

        if(messages.delete && messages.delete.length) {
            customerIds.push(...messages.delete); 
        }

        if(messages.createOrUpdate && messages.createOrUpdate.length) {
            messages.createOrUpdate.forEach(operation => {
                customerIds.push(operation.id_customer);
            });
        }

        const usersFromMongoDb = await contactLightCollection.find(
            {
                id_customer: {
                    $in: customerIds
                }
            },
            {
                projection: {
                    hubspotCustomerId: 1,
                    id_customer: 1,
                    _id: 0
                }
            }
        ).toArray();

        if(messages.createOrUpdate && messages.createOrUpdate.length) {
            messages.createOrUpdate.forEach((customer) => {
                const user = usersFromMongoDb.find((mongoUser) => 
                    mongoUser.id_customer === customer.id_customer);

                if(user) {
                    return customersToUpdate.inputs.push({
                        id: user.hubspotCustomerId,
                        properties: customer.properties
                    });
                }

                return customerToCreate.inputs.push({
                    properties: customer.properties
                })
            });
        }
          
        if(messages.delete && messages.delete.length) {
            messages.delete.forEach((idCustomer) => {
                const user = usersFromMongoDb.find((mongoUser) => 
                     mongoUser.id_customer === idCustomer);

                if(user) {
                    customersToDeleteOnHubspot.inputs.push({
                        id: user.hubspotCustomerId,
                    });

                    customersToDeleteOnMongoDb.push(idCustomer);
                }
            });
        }

        if(customersToDeleteOnHubspot.inputs.length) {
            await deleteContactOnHubspot(
                customersToDeleteOnHubspot,
                customersToDeleteOnMongoDb,
                contactLightCollection,
            )
        }

        if(customerToCreate.inputs.length) {
            await createContactOnHubspot(customerToCreate)
        }
        
        if(customersToUpdate.inputs.length) {
            await updateContactOnHubspot(customersToUpdate)
        }

        res.send(200);
    } catch (error) {
        console.error(error)
    }
});

app.listen(PORT, () => {
    console.log(`app listen o port ${PORT}`)
})
