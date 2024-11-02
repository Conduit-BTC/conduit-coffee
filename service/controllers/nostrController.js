const { dbService } = require('../services/dbService');
const { prisma } = dbService.getPrismaClient();

exports.createRelayPool = async (req, res) => {
    const { npub, relays } = req.body;

    if (!npub || !Array.isArray(relays) || relays.length === 0) {
        return res.status(400).json({ error: 'Invalid request body' });
    }

    try {
        const relayPool = await prisma.relayPool.upsert({
            where: {
                npub: npub
            },
            update: {
                relays: relays,
                updated_at: new Date()
            },
            create: {
                npub: npub,
                relays: relays
            }
        });

        res.json(relayPool);
    } catch (error) {
        console.error('Error saving relay pool:', error);
        res.status(500).json({ error: 'Failed to save relay pool' });
    }
}
