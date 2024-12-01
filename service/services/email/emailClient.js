class EmailClient {
    constructor(transport, config) {
        this.transport = transport;
        this.config = config;
        this.validateConfig();
    }

    validateConfig() {
        if (!this.config.address || !this.config.token) {
            console.log(this.config);

            throw new Error(`Invalid email configuration for ${this.config.address}`);
        }
    }

    async sendMail(to, subject, text) {
        const mailOptions = {
            from: this.config.address,
            to,
            subject,
            text
        };

        return this.transport.sendMail(mailOptions);
    }

    async sendMailWithAttachment(to, subject, text, attachmentsArray) {
        const mailOptions = {
            from: this.config.address,
            to,
            subject,
            text,
            attachments: attachmentsArray
        };

        return this.transport.sendMail(mailOptions);
    }
}

module.exports = EmailClient;
