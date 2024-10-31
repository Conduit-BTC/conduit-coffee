class EmailClient {
    constructor(transport, config) {
        this.transport = transport;
        this.config = config;
        this.validateConfig();
    }

    validateConfig() {
        if (!this.config.username || !this.config.token) {
            throw new Error(`Invalid email configuration for ${this.config.username}`);
        }
    }

    async sendMail(to, subject, text) {
        const mailOptions = {
            from: this.config.username,
            to,
            subject,
            text
        };

        return this.transport.sendMail(mailOptions);
    }
}
