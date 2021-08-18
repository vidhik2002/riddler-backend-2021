const cron = require('node-cron');
const User = require('../models/User');

cron.schedule('0 */12 * * *', async () => {
    await User.updateMany(
        {},
        {
            $set: {
                currentPenaltyPoints: process.env.DEFAULT_PENALTY,
            },
        },
    );
});
