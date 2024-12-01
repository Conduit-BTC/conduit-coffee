async function getBtcBlockHeight() {
    try {
      const response = await fetch('https://blockchain.info/q/getblockcount');
      const data = await response.text();
      return parseInt(data);
    } catch (error) {
      console.error('Error fetching block height:', error);
    }
  }

  module.exports = {
    getBtcBlockHeight
  };
