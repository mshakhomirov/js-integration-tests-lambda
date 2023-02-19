/* eslint-disable no-throw-literal */
const moment = require('moment');

exports.handler = async(event, context) => {

    console.log('Now: ', moment());
    try {
        const jobs = event.jobs;
        const successfullJobs = await processEvent(jobs);

        if (successfullJobs.errorCode) {
            throw successfullJobs;
        }
        // console.log(successfullJobs);

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
            jobList.push({
                name: job.name,
                runTime: jobTime,
            });

        } catch (error) {
            return error;
        }

    }
    return jobList;
};
