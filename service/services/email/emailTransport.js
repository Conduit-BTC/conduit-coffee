const nodemailer = require('nodemailer');
const { EventEmitter } = require('events');

class EmailTransport extends EventEmitter {
    constructor(transportConfig) {
        super();
        this.transporter = nodemailer.createTransport(transportConfig);
        this.isVerified = false;
    }

    async verify() {
        try {
            await this.transporter.verify();
            this.isVerified = true;
            this.emit('verified');
            return true;
        } catch (error) {
            this.emit('error', error);
            throw error;
        }
    }

    async sendMail(options) {
        if (!this.isVerified) {
            await this.verify();
        }
        return this.transporter.sendMail(options);
    }
}

module.exports = EmailTransport;
