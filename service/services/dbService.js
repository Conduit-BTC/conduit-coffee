const { PrismaClient } = require('@prisma/client');

class DbService {
    constructor() {
        this.prismaClient = new PrismaClient();
    }

    getPrismaClient() {
        return this.prismaClient;
    }
}

const dbService = Object.freeze(new DbService());
module.exports = { dbService };
