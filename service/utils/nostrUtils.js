const {
    nip04,
    getPublicKey,
    finalizeEvent,
    generateSecretKey
} = require('nostr-tools');

function createRumor(senderPubkey, content, subject = null) {
    const rumor = {
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: content,
        pubkey: senderPubkey
    };
    if (subject) {
        rumor.tags.push(["subject", subject]);
    }
    return rumor;
}

async function createSeal(rumor, senderPrivateKey, receiverPubkey) {
    const twoDaysAgo = Math.floor(Date.now() / 1000) - (2 * 24 * 60 * 60);
    const randomPastTime = twoDaysAgo + Math.floor(Math.random() * (2 * 24 * 60 * 60));
    const encryptedContent = await nip04.encrypt(
        senderPrivateKey,
        receiverPubkey,
        JSON.stringify(rumor)
    );
    const unsignedSeal = {
        kind: 13,
        created_at: randomPastTime,
        tags: [["p", receiverPubkey]],
        content: encryptedContent,
        pubkey: getPublicKey(senderPrivateKey)
    };
    return finalizeEvent(unsignedSeal, senderPrivateKey);
}

async function createGiftWrap(seal, receiverPubkey) {
    const wrapperPrivateKey = generateSecretKey();
    const wrapperPublicKey = getPublicKey(wrapperPrivateKey);
    const twoDaysAgo = Math.floor(Date.now() / 1000) - (2 * 24 * 60 * 60);
    const randomPastTime = twoDaysAgo + Math.floor(Math.random() * (2 * 24 * 60 * 60));
    const encryptedSeal = await nip04.encrypt(
        wrapperPrivateKey,
        receiverPubkey,
        JSON.stringify(seal)
    );
    const unsignedGiftWrap = {
        kind: 1059,
        created_at: randomPastTime,
        tags: [
            ["p", receiverPubkey]
        ],
        content: encryptedSeal,
        pubkey: wrapperPublicKey
    };
    return finalizeEvent(unsignedGiftWrap, wrapperPrivateKey);
}

async function createNip17Dm(senderPrivateKey, receiverPubkey, content, subject = null) {
    try {
        const senderPubkey = getPublicKey(senderPrivateKey);
        const rumor = createRumor.call({ senderPublicKey: senderPubkey }, content, subject);
        const seal = await createSeal(rumor, senderPrivateKey, receiverPubkey);
        const receiverGiftWrap = await createGiftWrap(seal, receiverPubkey);
        const senderGiftWrap = await createGiftWrap(seal, senderPubkey);
        return {
            receiverGiftWrap,
            senderGiftWrap
        };
    } catch (error) {
        console.error('Error creating encrypted DM:', error);
        throw error;
    }
}

async function createNip04Dm(senderPrivateKey, receiverPubkey, content) {
    const senderPubkey = getPublicKey(senderPrivateKey);
    const e = {
        kind: 4,
        created_at: Math.floor(Date.now() / 1000),
        tags: [["p", receiverPubkey]],
        content: await nip04.encrypt(senderPrivateKey, receiverPubkey, content),
        pubkey: senderPubkey
    };
    return finalizeEvent(e, senderPrivateKey);
}

module.exports = {
    createNip17Dm,
    createNip04Dm
};
