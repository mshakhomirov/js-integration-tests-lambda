/* eslint-disable no-throw-literal */
const NODE_ENV = process.env.NODE_ENV || 'tests';
const TESTING = process.env.TESTING || 'true';

const moment = require('moment');
const config = require('config');
const { BigQuery } = require('@google-cloud/bigquery');

// Constants
const bigQueryCreds = require('./bigquery.json');

// const query = require('./sql/query'); // Ideally our SQL should be here but we will use a hardcoded query for now (below).

// Variables
if (TESTING === 'false') { // When deployed to AWS TESTING must be set to 'false'
    process.env.NODE_CONFIG_DIR = '/var/task/js-lambda-unit-tests/config';
}

const bigquery = new BigQuery({
    projectId: config.get('bigQuery.projectId'),
    credentials: {
        client_email: config.gcp.gcpClientEmail,
        private_key: bigQueryCreds.private_key,
    },
});

exports.handler = async(event, context) => {

    console.log('Now: ', moment());
    try {
        const jobs = event.jobs;
        const successfullJobs = await processEvent(jobs);

        if (successfullJobs.errorCode) {
            throw successfullJobs;
        }

        return {
            'statusCode': 200,
            'data': successfullJobs,
            'context': context ? context.succeed() : null,
        };

    } catch (e) {
        return {
            'statusCode': 400,
            'data': e,
            'context': context ? context.done() : null,

        };

    }
};

const processEvent = async(jobs) => {
    const now = moment.utc();

    const jobList = [];
    for (const job of jobs) {

        try {
            if (typeof job.name === 'undefined') {
                throw { errorCode: 1, message: 'job.name is missing' };
            }
            const jobTime = now.format('YYYY-MM-DD HH:mm');
            const bigQueryData = await executeQuery('SELECT 1 as id;');
            jobList.push({
                name: job.name,
                runTime: jobTime,
                data: bigQueryData,
            });

        } catch (error) {
            return error;
        }

    }
    return jobList;
};

const executeQuery = async(sql) => {

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

    return rows.map((row) => row.id);
};
