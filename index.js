// For non-background page

if (typeof vAPI === 'object' && vAPI.randomToken instanceof Function === false) {

    vAPI.randomToken = function() {
        const n = Math.random();
        return String.fromCharCode(n * 25 + 97) +
            Math.floor(
                (0.25 + n * 0.75) * Number.MAX_SAFE_INTEGER
            ).toString(36).slice(-8);
    };

    vAPI.sessionId = vAPI.randomToken();
    vAPI.setTimeout = vAPI.setTimeout || self.setTimeout.bind(self);

    vAPI.shutdown = {
        jobs: [],
        add: function(job) {
            this.jobs.push(job);
        },
        exec: function() {
            self.requestIdleCallback(() => {
                const jobs = this.jobs.slice();
                this.jobs.length = 0;
                while (jobs.length !== 0) {
                    (jobs.pop())();
                }
            });
        },
        remove: function(job) {
            let pos;
            while ((pos = this.jobs.indexOf(job)) !== -1) {
                this.jobs.splice(pos, 1);
            }
        }
    };

    vAPI.messaging = {
        port: null,
        portTimer: null,
        portTimerDelay: 10000,
        msgIdGenerator: 1,
        pending: new Map(),
        waitStartTime: 0,
        shuttingDown: false,

        shutdown: function() {
            this.shuttingDown = true;
            this.destroyPort();
        },

        disconnectListener: function() {
            void browser.runtime.lastError;
            this.port = null;
            if (window !== window.top) {
                vAPI.shutdown.exec();
            } else {
                this.destroyPort();
            }
        },
        disconnectListenerBound: null,

        messageListener: function(details) {
            if (typeof details !== 'object' || details === null) { return; }
            if (details.msgId === undefined) { return; }
            const resolver = this.pending.get(details.msgId);
            if (resolver === undefined) { return; }
            this.pending.delete(details.msgId);
            resolver(details.msg);
        },
        messageListenerBound: null,

        canDestroyPort: function() {
            return this.pending.size === 0;
        },

        portPoller: function() {
            this.portTimer = null;
            if (this.port !== null && this.canDestroyPort()) {
                return this.destroyPort();
            }
            this.portTimer = vAPI.setTimeout(this.portPollerBound, this.portTimerDelay);
            this.portTimerDelay = Math.min(this.portTimerDelay * 2, 60 * 60 * 1000);
        },
        portPollerBound: null,

        destroyPort: function() {
            if (this.portTimer !== null) {
                clearTimeout(this.portTimer);
                this.portTimer = null;
            }
            const port = this.port;
            if (port !== null) {
                port.disconnect();
                port.onMessage.removeListener(this.messageListenerBound);
                port.onDisconnect.removeListener(this.disconnectListenerBound);
                this.port = null;
            }
            if (this.pending.size !== 0) {
                const pending = this.pending;
                this.pending = new Map();
                for (const resolver of pending.values()) {
                    resolver();
                }
            }
        },

        createPort: function() {
            if (this.shuttingDown) { return null; }
            if (this.messageListenerBound === null) {
                this.messageListenerBound = this.messageListener.bind(this);
                this.disconnectListenerBound = this.disconnectListener.bind(this);
                this.portPollerBound = this.portPoller.bind(this);
            }
            try {
                this.port = browser.runtime.connect({ name: vAPI.sessionId }) || null;
            } catch (ex) {
                this.port = null;
            }
            if (this.port === null) {
                vAPI.shutdown.exec();
                return null;
            }
            this.port.onMessage.addListener(this.messageListenerBound);
            this.port.onDisconnect.addListener(this.disconnectListenerBound);
            this.portTimerDelay = 10000;
            if (this.portTimer === null) {
                this.portTimer = vAPI.setTimeout(this.portPollerBound, this.portTimerDelay);
            }
            return this.port;
        },

        getPort: function() {
            return this.port !== null ? this.port : this.createPort();
        },

        send: function(channel, msg) {
            if (this.pending.size > 64) {
                if ((Date.now() - this.waitStartTime) > 60000) {
                    vAPI.shutdown.exec();
                }
            }
            const port = this.getPort();
            if (port === null) {
                return Promise.resolve();
            }
            if (this.pending.size === 0) {
                this.waitStartTime = Date.now();
            }
            const msgId = this.msgIdGenerator++;
            const promise = new Promise(resolve => {
                this.pending.set(msgId, resolve);
            });
            port.postMessage({ channel, msgId, msg });
            return promise;
        },
    };

    vAPI.shutdown.add(() => {
        vAPI.messaging.shutdown();
        window.vAPI = undefined;
    });

}

void 0;
