# Task description

Spent time: 5 hours 15 mins.

Tasks that were done:
1. Refactored code style.
2. Added service layer.
3. Added enums abstraction.
4. Implemented following APIs:

    4.1. ***GET*** `/contracts/:id` - This API is broken 😵! it should return the contract only if it belongs to the profile calling. better fix that!

    4.2. ***GET*** `/contracts` - Returns a list of contracts belonging to a user (client or contractor), the list should only contain non terminated contracts.

    4.3. ***GET*** `/jobs/unpaid` -  Get all unpaid jobs for a user (***either*** a client or contractor), for ***active contracts only***.

    4.4. ***POST*** `/jobs/:job_id/pay` - Pay for a job, a client can only pay if his balance >= the amount to pay. The amount should be moved from the client's balance to the contractor balance.

    4.5. ***POST*** `/balances/deposit/:userId` - Deposits money into the the the balance of a client, a client can't deposit more than 25% his total of jobs to pay. (at the deposit moment)

Future plans:

1. Finish other endpoints.
2. Write unit, integration, api tests.
3. Add es-lint for code quality.