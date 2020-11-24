const express = require('express');

const app = express();

const hubspot = require('@hubspot/api-client');
const fs = require('fs');

const PORT = 3000;
const API_KEY = '';

app.use(express.json());

app.post('/hubspot', async (req, res) => {
    try {
        const contactObj = { 
            properties: {
                firstname: 'richssards',
                lastname: 'ppssp',
                email: 'rickssss@mastercheff.com'
            }
        };
        
        const hubspotClient = new hubspot.Client({ apiKey: API_KEY });
        const createContactResponse = await hubspotClient.crm.contacts.basicApi.create(contactObj)
        
        res.send(200);
    } catch (error) {
        console.error(error)
    }
});

app.put('/hubspot/:customerId', async (req, res) => {
    try {
        const { customerId } = req.params;

        const contactObj = { 
            properties: {
                firstname: 'eduardo',
                lastname: 'semname',
                email: 'exxx@mastercheff.com'
            }
        };

        const hubspotClient = new hubspot.Client({ apiKey: API_KEY });
        const updateResponse = await hubspotClient.crm.contacts.basicApi.update(customerId, contactObj)
            
        res.send(200);
    } catch (error) {
        console.error(error)
    }
});

app.post('/imports', async (req, res) => {
    try {
        const fileName = 'example.csv';

        const file = fs.readFileSync(fileName);
        // console.log(file)
        // const fileToImport = _.get(req, 'files.file')

        if (!file) {
            throw new Error('Cannot get file to import')
        }

        const fileToImportConfig = {
            value: file,
            options: {
                filename: fileName,
                contentType: 'text/csv',
            },
        }

        const importRequest = {
            name: fileName,
            files: [
                {
                    fileName: fileName,
                    fileImportPage: {
                        hasHeader: true,
                        columnMappings: [
                            {
                                columnName: 'First Name',
                                propertyName: 'firstname',
                                columnObjectType: 'CONTACT',
                            },
                            {
                                columnName: 'last Name',
                                propertyName: 'lastname',
                                columnObjectType: 'CONTACT',
                            },
                            {
                                columnName: 'Email',
                                propertyName: 'email',
                                columnObjectType: 'CONTACT',
                            },
                        ],
                    },
                },
            ],
        }

        // Start a new import
        // POST/crm/v3/imports
        // https://developers.hubspot.com/docs/api/crm/imports
        console.log('Calling crm.imports.coreApi.create API method. Starting a new import')
        const hubspotClient = new hubspot.Client({ apiKey: API_KEY });
        const result = await hubspotClient.crm.imports.coreApi.create(JSON.stringify(importRequest), fileToImportConfig)

        // logResponse('Import result', result)
        // res.redirect(`imports/${result.body.id}`)
        res.sendStatus(200);
    } catch (e) {
        console.log(e)
    }
})


app.post('/imports/deal', async (req, res) => {
    try {
        const fileName = 'hub-deals.csv';

        const file = fs.readFileSync(fileName);
        // console.log(file)
        // const fileToImport = _.get(req, 'files.file')

        if (!file) {
            throw new Error('Cannot get file to import')
        }

        const fileToImportConfig = {
            value: file,
            options: {
                filename: fileName,
                contentType: 'text/csv',
            },
        }

        const importRequest = {
            name: fileName,
            files: [
                {
                    fileName: fileName,
                    fileImportPage: {
                        hasHeader: true,
                        columnMappings: [
                            {
                                columnName: 'Deal Name',
                                propertyName: 'Deal Name',
                                columnObjectType: 'DEAL',
                            },
                            {
                                columnName: 'Deal Stage',
                                propertyName: 'Deal Stage',
                                columnObjectType: 'DEAL',
                            },
                            {
                                columnName: 'Amount',
                                propertyName: 'Amount',
                                columnObjectType: 'DEAL',
                            },
                            {
                                columnName: 'Close Date',
                                propertyName: 'Close Date',
                                columnObjectType: 'DEAL',
                            },
                            {
                                columnName: 'Product of Interest',
                                propertyName: 'Product of Interest',
                                columnObjectType: 'DEAL',
                            },
                            {
                                columnName: 'Point of Contact',
                                propertyName: 'Point of Contact',
                                columnObjectType: 'DEAL',
                            }
                        ],
                    },
                },
            ],
        }

        // Start a new import
        // POST/crm/v3/imports
        // https://developers.hubspot.com/docs/api/crm/imports
        console.log('Calling crm.imports.coreApi.create API method. Starting a new import')
        const hubspotClient = new hubspot.Client({ apiKey: API_KEY });
        const result = await hubspotClient.crm.imports.coreApi.create(JSON.stringify(importRequest), fileToImportConfig)

        // logResponse('Import result', result)
        // res.redirect(`imports/${result.body.id}`)
        res.sendStatus(200);
    } catch (e) {
        console.log(e)
    }
})



app.put('/imports', async (req, res) => {
    try {
        const fileName = 'example2.csv';

        const file = fs.readFileSync(fileName);
        // console.log(file)
        // const fileToImport = _.get(req, 'files.file')

        if (!file) {
            throw new Error('Cannot get file to import')
        }

        const fileToImportConfig = {
            value: file,
            options: {
                filename: fileName,
                contentType: 'text/csv',
            },
        }

        const importRequest = {
            name: fileName,
            files: [
                {
                    fileName: fileName,
                    fileImportPage: {
                        hasHeader: true,
                        columnMappings: [
                            {
                                columnName: 'First Name',
                                propertyName: 'firstname',
                                columnObjectType: 'CONTACT',
                            },
                            {
                                columnName: 'Last Name',
                                propertyName: 'lastname',
                                columnObjectType: 'CONTACT',
                            },
                            {
                                columnName: 'Email',
                                propertyName: 'email',
                                columnObjectType: 'CONTACT',
                            },
                        ],
                    },
                },
            ],
        }

        // Start a new import
        // POST/crm/v3/imports
        // https://developers.hubspot.com/docs/api/crm/imports
        console.log('Calling crm.imports.coreApi.create API method. Starting a new import')
        const hubspotClient = new hubspot.Client({ apiKey: API_KEY });
        const result = await hubspotClient.crm.imports.coreApi.create(JSON.stringify(importRequest), fileToImportConfig)

        // logResponse('Import result', result)
        // res.redirect(`imports/${result.body.id}`)
        res.sendStatus(200);
    } catch (e) {
        console.log(e)
    }
})


app.listen(PORT, () => {
    console.log(`app listen o port ${PORT}`)
})
