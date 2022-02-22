const express = require('express')
const { exec } = require("child_process");
const app = express()
const port = 3000
const SECRET = process.env.APP_SECRET;

app.get('/deploy', (req, res) => {
    const { path } = req.query;
    const headerToken = req.headers['X-Gitlab-Token'];
    if(!path) {
        res.status(422).send({
            message: 'Path not found'
        });
        return;
    }

    // TODO : Secret Validation
    if(SECRET != headerToken) {
        res.status(401).send({
            message: 'Secret not match'
        });
        return;
    }


    let pid = exec(`cd ${path} && dep deploy`, (error, stdout, stderr) => {
        if (error) {
            console.error(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(stdout)
    });
    res.send({
        message: 'success',
        data: {
            pid: pid.pid
        }
    })
})

app.listen(port, () => {
    console.log(`Deployer NodeJS listening on port ${port}`)
})