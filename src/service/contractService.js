const {Op} = require('sequelize');
const {CONTRACT_STATUSES} = require('../enums');

/**
 * @returns Promise<Contract>
 */
function getContractById(Contract, id, profileId) {
    return Contract.findOne({where: {id, ContractorId: profileId}});
}

/**
 * @returns Promise<Contract[]>
 */
function getAllNonTerminatedContracts(Contract, profileId) {
    return Contract.findAll({
        where: {
            ContractorId: profileId,
            status: {
                [Op.not] : CONTRACT_STATUSES.TERMINATED,
            },
        }
    });
}

module.exports = {
    getContractById,
    getAllNonTerminatedContracts,
};
