const chalk = require('chalk');
const ora = require('ora');
const client = require('../client');

module.exports = async (env) => {
    let { ethAddress, password, apiUrl } = env;

    const spinner = ora({
        color: 'yellow',
        spinner: 'bouncingBar'
    });

    try {
        spinner.start('Authenticating user');

        const mxClient = client.initialize(apiUrl, ethAddress, password);

        await client.authenticate(mxClient);

        spinner.stop();
        console.log(chalk.green('✔ Authentication successful'));

        spinner.start('Retrieving submitted analyses');

        let list = await client.getAnalysesList(mxClient);

        console.log(chalk.green('\n✔ Analyses retrieved'));

        list.analyses.forEach(analysis => {
            console.log('--------------------------------------------');
            console.log(`API Version:		${analysis.apiVersion}`);
            console.log(`UUID:			${analysis.uuid}`);
            console.log(`Status:			${analysis.status}`);
            console.log(`API Version:		${analysis.apiVersion}`);
            console.log(`Submitted by:		${analysis.submittedBy}`);
            console.log(`Submitted at:		${analysis.submittedAt}`);
            console.log('---------------------------------------------');
        });

        spinner.stop();
    } catch (err) {
        if (spinner.isSpinning) {
            spinner.fail();
        }

        console.log(chalk.red(err));

        process.exit(1);
    }
};
