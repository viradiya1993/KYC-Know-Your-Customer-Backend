const redis = require('redis');

const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    connect_timeout: 10000,
});

redisClient.on("error", (err) => {
    // console.log("********* redis error *********",err)
});

export { redisClient };