// controllers/nostrController.js
const { dbService } = require('../services/dbService');
const prisma = dbService.getPrismaClient();

exports.createRelayPool = async (req, res) => {
    const { npub, relays } = req.body;

    // Input validation
    if (!npub || !Array.isArray(relays) || relays.length === 0) {
        return res.status(400).json({
            error: 'Invalid request body. Required: npub and non-empty relays array'
        });
    }

    try {
        const relayPool = await prisma.relayPool.upsert({
            where: {
                npub: npub
            },
            update: {
                relays: relays
            },
            create: {
                npub: npub,
                relays: relays
            }
        });

        res.json({
            status: 'success',
            data: relayPool
        });
    } catch (error) {
        console.error('Error saving relay pool:', error);
        res.status(500).json({
            error: 'Failed to save relay pool',
            details: error.message
        });
    }
};

exports.getRelayPool = async (req, res) => {
    const { npub } = req.params;

    try {
        const relayPool = await prisma.relayPool.findUnique({
            where: { npub }
        });

        if (!relayPool) {
            return res.status(404).json({
                error: 'No relay pool found for this npub'
            });
        }

        res.json({
            status: 'success',
            data: relayPool
        });
    } catch (error) {
        console.error('Error fetching relay pool:', error);
        res.status(500).json({
            error: 'Failed to fetch relay pool',
            details: error.message
        });
    }
};

exports.deleteRelayPool = async (req, res) => {
    const { npub } = req.params;

    try {
        await prisma.relayPool.delete({
            where: { npub }
        });

        res.json({
            status: 'success',
            message: 'Relay pool deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting relay pool:', error);
        res.status(500).json({
            error: 'Failed to delete relay pool',
            details: error.message
        });
    }
};
