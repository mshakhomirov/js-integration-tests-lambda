const DEBUG = process.env.DEBUG || 'true';
const NODE_ENV = process.env.NODE_ENV || 'test';
const TESTING = process.env.TESTING || 'true';

const config = require('config');
const bigQueryCreds = require('../../bigquery.json');
const { BigQuery } = require('@google-cloud/bigquery');

// // Test datasets
// const build = require('./buildTestDatasets.sql.js');
// const truncate = require('./cleanupTestDatasets.sql.js');

// const buildDatasets = async() => {
//     for (const table in build) {
//         pr(`Loading test data into ${config.get('bigQuery.projectId')}:${table}`);
//         await executeQuery(build[table]);
//     }
// }
// ;
// const cleanupDatasets = async() => {
//     for (const table in truncate) {
//         console.log(`Truncating test table ${config.get('bigQuery.projectId')}:${table}`);
//         await executeQuery(truncate[table]);
//     }
// }
// ;

// Variables
const bigquery = new BigQuery({
    projectId: config.get('bigQuery.projectId'),
    credentials: {
        client_email: config.gcp.gcpClientEmail,
        private_key: bigQueryCreds.private_key,
    },
});

// Constants
const CLEANUP_TIMEOUT = 50000;

async function executeQuery(sql) {

    const options = {
        query: sql,
        location: 'US',
    };
    const [job] = await bigquery.createQueryJob(options);
    console.log(`Job ${job.id} started.`);
    const [rows] = await job.getQueryResults();

    if (rows.length === 0) {
        return null;
    }

    return rows;
}

(async() => {
    try {
        console.log('creating test datasets in data-tests project');

        // await buildDatasets();
        // run();
    } catch (err) {
        console.log('Problem creating test data in BigQuery: ', err);

        // cleanupDatasets();
    }
}
)();

process.on('SIGINT', () => {
    console.log('Caught interrupt signal');

    // cleanupDatasets();
});
