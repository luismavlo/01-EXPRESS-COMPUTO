const express = require('express');
const cors = require('cors');

const { usersRouter } = require('../routes/user.routes');
const { repairsRouter } = require('../routes/repair.routes');
const { db } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        //Path routes
        this.usersPath = '/api/v1/users';
        this.repairsPath = '/api/v1/repairs';

        //Middlewares
        this.middlewares();
        this.app.use(cors())

        //Routes
        this.routes();
    }

    middlewares() {
        this.app.use(express.static('public'));
        this.app.use(express.json());
    }

    routes() {
        this.app.use(this.usersPath, usersRouter);
        this.app.use(this.repairsPath, repairsRouter);
    }

    database() {
        db.authenticate()
            .then(() => console.log('Database authenticated'))
            .catch(err => console.log(err));

        db.sync()
            .then(() => console.log('Database synced'))
            .catch(err => console.log(err));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Server running on port', this.port)
        })
    }

}

module.exports = Server;