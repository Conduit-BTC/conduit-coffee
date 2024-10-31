class ProtonMailProvider {
    static get CONFIG() {
        return {
            host: 'smtp.protonmail.ch',
            port: 587,
            secure: false,
            tls: {
                ciphers: 'SSLv3',
                rejectUnauthorized: true,
                minVersion: 'TLSv1.2'
            }
        };
    }

    /**
     * @param {EmailConfig} config
     * @returns {import('nodemailer').TransportOptions}
     */
    static createTransportConfig(config) {
        return {
            ...this.CONFIG,
            auth: {
                user: config.username,
                pass: config.token
            }
        };
    }
}

module.exports = { ProtonMailProvider };
