const { nostrService } = require('../services/nostrService');

exports.sendReceiptViaDm = async (req, res) => {
    const success = await nostrService.publishReceiptEvent(req.body);
    if (success) {
        return res.status(200).json({
            status: 'success',
            message: 'Receipt published successfully',
        });
    } else {
        return res.status(400).json({
            status: 'error',
            message: 'Error publishing to relay'
        });
    }
}
