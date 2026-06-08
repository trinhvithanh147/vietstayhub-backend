const { PayOS } = require("@payos/node");

const {
  PAYOS_CLIENT_ID,
  PAYOS_API_KEY,
  PAYOS_CHECKSUM_KEY,
} = require("../constants/app.constant");

const payOS = new PayOS({
  clientId: PAYOS_CLIENT_ID,
  apiKey: PAYOS_API_KEY,
  checksumKey: PAYOS_CHECKSUM_KEY,
});

module.exports = payOS;
