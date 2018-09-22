const
    _ = require('lodash'),
    logger = require('./logger'),
    socketIo = require('socket.io'),
    socketioJwt = require('socketio-jwt'),
    Web3 = require('web3')

// todo: review & cleanup

class WebSocketServer {

    constructor (owner, db) {
        this.owner = owner;
/*        this.db = db;*/
        this.running = false;
        this.authenticatedSockets = {}
        this.web3 = {}
    }

    start (options) {
        if (this.running)
            return;

        // for dispatcher
        this.eventFns = {
            'pong': this.pong,
            'initConnection': this.initConnection,
            'runCommand': this.runCommand,
        };

        var self = this;
        
        logger.debug("✔ socket.io server listening on port %d", options.rc_port);

        // create

        var io = socketIo.listen(options.rc_port);

        this.io = io;

        // run

        this.running = true;

        io.sockets.on('connection', socketioJwt.authorize({
            secret: options.remoteControl.jwt.secret,
            timeout: options.remoteControl.jwt.timeout * 1000
        })).on('authenticated', function (socket) {
            logger.debug('Client', socket.handshake.address, 'token:', JSON.stringify(socket.decoded_token));

            self.authenticatedSockets[socket.id] = socket;

            // audit action authenticated

/*            self.db.addAction({
                name: 'Client authenticated',
                ip: socket.handshake.address,
                user: 'ui',
                date: new Date()
            });
*/
            socket.on('disconnect', () => {

                // audit action disconnected

  /*              self.db.addAction({
                    name: 'Client disconnected',
                    ip: socket.handshake.address,
                    user: 'ui',
                    date: new Date()
                });
*/
                delete self.authenticatedSockets[socket.id];
            });

            socket.emit('ping', {payload:'123'});
            
            socket.on('message', msg => self.dispachMessage(socket, msg));       
        }).on('unauthorized', function (err) {

            logger.err(err)

            // audit action unathorized
/*
            self.db.addAction({
                name: `Client unathorized ${err.message}`,
                ip: 'undefined',
                user: 'ui',
                date: new Date()
            });*/
        });
    }

    stop () {
        if (this.running) {
            this.io.close();
            this.running = false;
            this.authenticatedSockets = {};
        }
    }

    dispachMessage (socket, msg) {
        logger.debug('ws_msg:', msg);

        var eventFns = this.eventFns[msg.event];
        eventFns && eventFns.call(this, socket, msg);
    }

    pong (socket, msg) {
        // for testing purposes
    }

    initConnection (socket, msg) {
        // startup
        console.log('init connection')
    }

    getWeb3 (url) {
        let web3 = this.web3[url]
        if (!web3) {
          web3 = new Web3(new Web3.providers.HttpProvider(url))
          this.web3[url] = web3
        }
        return web3
    }

    runCommand (socket, msg) {
    }
}

module.exports = WebSocketServer;
