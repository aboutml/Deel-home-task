const {sequelize} = require('../model');

/**
 * @returns Promise<Contract[]>
 */
 async function getUnpaidContractJobs(Contract, Job, profileId) {
    const contracts = await Contract.findAll({
        include: Job,
        where: { ContractorId: profileId },
    });

    return contracts.flatMap(contract => contract.Jobs.filter(job => job.paid !== true));
}

/**
 * @returns Promise<void> 
 */
async function payJob(models, profile, jobId) {
    const {Contract, Job, Profile} = models;

    const t = await sequelize.transaction();

    try {
        const contracts = await Contract.findAll({
            include: Job,
            where: { ContractorId: profile.id },
        }, { transaction: t });

        const contract = contracts.find(
            contract => contract.Jobs.filter(job => job.id === jobId).length > 0
        );
        const job = contract.Jobs.find(job => job.id === jobId);

        if (profile.balance >= job.price) {
            const client = await Profile.findOne({ where: {id: contract.ClientId }});
            await Promise.all([
                Profile.update(
                    { balance: profile.balance - job.price },
                    { where: { id : profile.id } },
                    { transaction: t },
                ),
                Profile.update(
                    { balance: sequelize.literal(`balance + ${job.price}`) },
                    { where: { id : client.id } },
                    { transaction: t },
                ),
                Job.update(
                    { paid: true, paymentDate: new Date() },
                    { where: { id : jobId } },
                    { transaction: t },
                )
            ]);
        } else {
            throw new Error('Not enough balance.');
        }

        await t.commit();
    } catch (error) {
        await t.rollback();
        throw error;
    }
}

module.exports = {
    getUnpaidContractJobs,
    payJob,
};
