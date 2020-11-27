const hubspot = require('@hubspot/api-client');
const API_KEY = process.env.HUBSPOT_API_KEY;

let hubspotClient;

const getHubspotInstance = () => {
    hubspotClient = hubspotClient || new hubspot.Client({ apiKey: API_KEY });
    return hubspotClient;
}

const createContactOnHubspot = async (contacts) => {
    const hubspotClient = getHubspotInstance();

    return hubspotClient.crm.contacts.batchApi.create(contacts)
}

const updateContactOnHubspot = async (contacts) => {
    const hubspotClient = getHubspotInstance();

    return hubspotClient.crm.contacts.batchApi.update(contacts)
}

const deleteContactOnHubspot = async (contactsHubspot, contactsMongo) => {
    const contactLightCollection = await getCollection(); 

    const hubspotClient = getHubspotInstance();

    const archiveContactsOnHub = await hubspotClient.crm.contacts.batchApi.archive(contactsHubspot);

    return contactLightCollection.remove({
        id_customer: { $in: contactsMongo }
    });
}

module.exports = {
    createContactOnHubspot,
    updateContactOnHubspot,
    deleteContactOnHubspot
}