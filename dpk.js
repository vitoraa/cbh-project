const crypto = require("crypto");

const createHash = (valueToHash, algorithm = "sha3-512") => crypto.createHash(algorithm).update(valueToHash).digest("hex");

const hashIfTooLong = (value, maxLength) => {
  if (value.length > maxLength) return createHash(value);

  return value;
};

const defineValueToHash = (event) => {
  if (!event) return;

  if (!event.partitionKey) return createHash(JSON.stringify(event));
  
  if (typeof event.partitionKey === "string") return event.partitionKey;
  
  return JSON.stringify(event.partitionKey);
}

exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;

  const valueToHash = defineValueToHash(event) ?? TRIVIAL_PARTITION_KEY;
  
  return hashIfTooLong(valueToHash, MAX_PARTITION_KEY_LENGTH);
};