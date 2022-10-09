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

module.exports = {
    getUnpaidContractJobs,
};
