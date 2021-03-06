const net = require('net');
module.exports = async function (ip = 'mc.hypixel.net') {
  const time = new Date();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return new Promise((resolve, reject) => {
    const cli = net.createConnection(25565, ip, () => {
      cli.end();
      resolve((new Date() - time) * 2);
    });
    cli.on('error', () => {
      resolve(NaN);
    });
  });
};
