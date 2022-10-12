const {sequelize} = require('../model');

/**
 * @returns Promise<void> 
 */
async function depositMoney(models, profile, amount) {
    const {Contract, Job, Profile} = models;

    const t = await sequelize.transaction();

    try {
        let totalJobsToPayAmount = 0;

        const contracts = await Contract.findAll({
            include: Job,
            where: { ContractorId: profile.id },
        }, { transaction: t });

        contracts.Jobs.forEach(job => {
            if (job.paid !== true) {
                totalJobsToPayAmount += job.price;
            }
        });

        if (amount <= 0.25 * totalJobsToPayAmount) {
            Profile.update(
                { balance: sequelize.literal(`balance + ${amount}`) },
                { where: { id : profile.id } },
                { transaction: t },
            )
        } else {
            throw new Error('Deposit amount is more than 25% of total jobs to pay');
        }

        await t.commit();
    } catch (error) {
        await t.rollback();
        throw error;
    }
}

module.exports = {
    depositMoney,
};
