# Task description

Spent time: 2 hours 45 mins.

Tasks that were done:
1. Refactored code style.
2. Added service layer.
3. Added enums abstraction.
4. Implemented following APIs:

    4.1. ***GET*** `/contracts/:id` - This API is broken 😵! it should return the contract only if it belongs to the profile calling. better fix that!

    4.2. ***GET*** `/contracts` - Returns a list of contracts belonging to a user (client or contractor), the list should only contain non terminated contracts.

    4.3. ***GET*** `/jobs/unpaid` -  Get all unpaid jobs for a user (***either*** a client or contractor), for ***active contracts only***.

Future plans:

1. Finish other endpoints.
2. Write unit, integration, api tests.
3. Add es-lint for code quality.