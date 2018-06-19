const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const randomstring = require('randomstring');


const port = process.argv[2] || 3001;


const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randStr = length => randomstring.generate({length, charset: 'numeric'});

const getJsonBodyTemplate = () => ({
    success: true,
    errCode: null,
    errMsg: null,
    sysTime: Date.now(),
});

const app = express();

app.use(cors());
app.use(morgan('combined'));
app.use('/static', express.static(path.join(__dirname, 'public')));


app.get('/helloWorld', (req, res) => {
    res.send('Hello World!');
});


app.get('/api/json/sleep', (req, res) => {
    const sleepMs = Number(req.query.ms) || 10;

    setTimeout(() => {
        res.json({
            data: {
                sleep: sleepMs,
            },
            ...getJsonBodyTemplate(),
        });
    }, sleepMs);
});


app.get('/api/json/fixedBodySize', (req, res) => {
    const bodySizeKb = Number(req.query.kb) || 1;
    const randomStrLength = bodySizeKb > 0 ? bodySizeKb * 1024 : 1024;

    res.json({
        data: {
            content: randStr(randomStrLength),
            length: randomStrLength,
        },
        ...getJsonBodyTemplate(),
    });
});


app.get('/api/json/dummy', (req, res) => {
    const minSleepMs = Number(req.query.minMs) || 10;
    const maxSleepMs = Number(req.query.maxMs) || 500;
    const sleepMs = minSleepMs === maxSleepMs ? minSleepMs : randInt(minSleepMs, maxSleepMs);

    const minBodySizeKb = Number(req.query.minKb) || 10;
    const maxBodySizeKb = Number(req.query.maxKb) || 500;
    const bodySizeKb = minBodySizeKb === maxBodySizeKb ? minBodySizeKb : randInt(minBodySizeKb, maxBodySizeKb);
    const randomStrLength = bodySizeKb > 0 ? bodySizeKb * 1024 : 1024;

    setTimeout(() => {
        res.json({
            data: {
                randomResponseTime: {
                    sleep: sleepMs,
                    minSleep: minSleepMs,
                    maxSleep: maxSleepMs,
                },
                randomBodySize: {
                    content: randStr(randomStrLength),
                    length: randomStrLength,
                    minLength: minBodySizeKb * 1024,
                    maxLength: maxBodySizeKb * 1024,
                },
            },
            ...getJsonBodyTemplate(),
        });
    }, sleepMs);
});


app.get('/api/json/longList', (req, res) => {
    const size = Number(req.query.size) || 1000;

    const list = [];
    for (let i = 0; i < size; i += 1) {
        list.push({
            active: 1,
            bizRoleCode: '10005',
            bizRoleConfig: {},
            creator: 100585,
            creatorDate: 1498119886221,
            deptManager: 2,
            drugCompanyId: '594b7ecd44f4203482b9d8f0',
            employeeId: '594b7ece44f4203482b9d8f3',
            entryDate: 1498119885908,
            fullPinYin: 'ce shi',
            headPicUrl: 'http://default.test.file.example.com.cn/user/default.jpg',
            hidePhone: 2,
            id: {
                date: 1498119886000,
                inc: -2101749515,
                machine: 1156849716,
                new: false,
                time: 1498119886000,
                timeSecond: 1498119886,
                timestamp: 1498119886,
            },
            jobType: 1,
            name: `Test${i}`,
            openId: '594b7ece44f4203482b9d8f4',
            orgId: '594b7ecd44f4203482b9d8f2',
            orgName: 'Unassigned',
            pinYin: 'cs',
            pinYinOrderType: 1,
            rootManager: 1,
            status: 1,
            sysManager: 2,
            telephone: '12006220001',
            title: 'Employee',
            treePath: '/594b7ecd44f4203482b9d8f1/594b7ecd44f4203482b9d8f2/',
            updater: 1651271,
            updaterDate: Date.now(),
            userId: 1651271 + i,
            weight: 0,
        });
    }

    res.json({
        data: list,
        ...getJsonBodyTemplate(),
    });
});


let TIMER_START = 0;
app.get('/api/json/coordinatedOmission', (req, res) => {
    const slowAfterSec = Number(req.query.slowAfter) || 100;
    const slowDurationSec = Number(req.query.slowDuration) || 100;
    const sleepSec = Number(req.query.sleep) || 50;

    const ts = Date.now();
    if (ts - TIMER_START > (slowAfterSec + slowDurationSec) * 1000) {
        TIMER_START = ts;
    }

    let sleepMs = 0;
    if (ts - TIMER_START > slowAfterSec * 1000) {
        sleepMs = sleepSec * 1000;
    }

    setTimeout(() => {
        res.json({
            data: {
                description: `Every request will sleep ${sleepSec}s after ${slowAfterSec}s, for ${slowDurationSec}s.`,
                sleep: sleepMs,
            },
            ...getJsonBodyTemplate(),
        });
    }, sleepMs);
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
