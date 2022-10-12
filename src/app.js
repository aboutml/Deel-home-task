const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model');
const {getProfile} = require('./middleware/getProfile');
const {getContractById, getAllNonTerminatedContracts} = require('./service/contractService');
const {getUnpaidContractJobs, payJob} = require('./service/jobService');
const {depositMoney} = require('./service/profileService');
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

/*
 * POST
 * Pays for a job if balance >= the amount to pay.
 * Amount is moved from the client balance to the contractor balance
 */
 app.post('/jobs/:job_id/pay', getProfile, async (req, res) => {
    const {job_id} = req.params;

    try {
        await payJob(req.app.get('models'), req.profile, job_id);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

/*
 * POST
 * Deposits money into client balance.
 * Client deposit <= 25% his total jobs to pay
 */
app.post('/balances/deposit/:userId', getProfile, async (req, res) => {
    const {amount} = req.body;

    try {
        await depositMoney(req.app.get('models'), req.profile, amount);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

module.exports = app;
