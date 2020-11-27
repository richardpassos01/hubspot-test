const express = require('express');
const PORT = process.env.PORT;

const {
    createContactOnHubspot,
    updateContactOnHubspot,
    deleteContactOnHubspot,
} = require('./helper');

const {
    getCollection,
} = require('./getCollection');

let waitingRateLimitTime = false;

const app = express();
app.use(express.json());

const waitingTimeOutTime = async (milliseconds, message) => {
    setTimeout(function() {
        return processMessage(message);
    }, milliseconds, message);
}

const processMessage = async (messages) => {
    waitingRateLimitTime = false;

    try {
        const contactLightCollection = await getCollection(); 

        const customerIds = [];
        const customersToUpdate = {
            inputs: []
        };
        const customerToCreate = {
            inputs: []
        };
        const customersToDelete = {
            inputs: []
        };

        if(messages.delete && messages.delete.length) {
            customerIds.push(...messages.delete); 
        }

        if(messages.createOrUpdate && messages.createOrUpdate.length) {
            messages.createOrUpdate.forEach(operation => {
                customerIds.push(operation.properties.id_customer);
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
                    mongoUser.id_customer === customer.properties.id_customer);
                
                if(user) {
                    return customersToUpdate.inputs.push({
                        id: user.hubspotCustomerId,
                        properties: customer.properties,
                    });
                }

                return customerToCreate.inputs.push({
                    properties: customer.properties,
                });
            });
        }
          
        if(messages.delete && messages.delete.length) {
            messages.delete.forEach((idCustomer) => {
                const user = usersFromMongoDb.find((mongoUser) => 
                     mongoUser.id_customer === idCustomer);

                if(user) {
                    customersToDelete.inputs.push({
                        id: user.hubspotCustomerId,
                    });
                }
            });
        }

        if(customersToDelete.inputs.length) {
            await deleteContactOnHubspot(
                customersToDelete,
                messages.delete,
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
        waitingRateLimitTime =  true;
        console.error(error)
    }
}

app.post('/hubspot/batch', async (req, res) => {
    const messages = req.body;

    if(waitingRateLimitTime) {
        return waitingTimeOutTime(10000, messages);
    }

    return processMessage(messages);
});

app.listen(PORT, () => {
    console.log(`app listen o port ${PORT}`)
})
