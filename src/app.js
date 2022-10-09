const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model');
const {getProfile} = require('./middleware/getProfile');
const {getContractById, getAllNonTerminatedContracts} = require('./service/contractService');
const {getUnpaidContractJobs} = require('./service/jobService');
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

/**
 * GET
 * @returns contract by id
 */
app.get('/contracts/:id', getProfile, async (req, res) => {
    const {Contract} = req.app.get('models');
    const {id} = req.params;
    const contract = await getContractById(Contract, id, req.profile.id);
    if(!contract) return res.status(404).end();
    res.json(contract);
});

/**
 * GET
 * @returns list of non terminated contracts by used
 */
 app.get('/contracts', getProfile, async (req, res) => {
    const {Contract} = req.app.get('models');
    const contracts = await getAllNonTerminatedContracts(Contract, req.profile.id);
    if(!contracts) return res.status(404).end();
    res.json(contracts);
});

/**
 * GET
 * @returns unpaid jobs for a user, for active contractors only
 */
 app.get('/jobs/unpaid', getProfile, async (req, res) => {
    const {Contract, Job} = req.app.get('models');
    const unpaidContractJobs = await getUnpaidContractJobs(Contract, Job, req.profile.id);
    res.json(unpaidContractJobs);
});

module.exports = app;
