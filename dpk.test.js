const crypto = require("crypto");
const { deterministicPartitionKey } = require("./dpk");
const {faker} = require("@faker-js/faker");

const createHash = valueToHash => crypto.createHash("sha3-512").update(valueToHash).digest("hex");

describe("deterministicPartitionKey", () => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;

  describe("Given an event", () => {
    describe("Given a partitionKey", () => {
      describe("Given a string partitionKey", () => {
        it("Returns the partitionKey if it is less or equal than 256 characters", () => {
          const partitionKey = faker.random.alphaNumeric(MAX_PARTITION_KEY_LENGTH);
          const event = { partitionKey };
          const actualPartitionKey = deterministicPartitionKey(event);
          expect(actualPartitionKey).toBe(partitionKey);
        });

        it("Returns a hash of the partitionKey if it is more than 256 characters", () => {
          const partitionKey = faker.random.alphaNumeric(MAX_PARTITION_KEY_LENGTH + 1);
          const event = { partitionKey };
          const expectedPartitionKey = createHash(partitionKey);
          const actualPartitionKey = deterministicPartitionKey(event);
          expect(actualPartitionKey).toBe(expectedPartitionKey);
        });
      });

      describe("Given a non-string partitionKey", () => {
        it("Returns a stringify version of the partitionKey if it is less or equal than 256 characters", () => {
          const partitionKey = Number(faker.random.numeric(MAX_PARTITION_KEY_LENGTH));
          const event = { partitionKey: partitionKey };
          const expectedPartitionKey = JSON.stringify(partitionKey);
          const actualPartitionKey = deterministicPartitionKey(event);
          expect(actualPartitionKey).toBe(expectedPartitionKey);
        });

        it("Returns a hash of the partitionKey if it is more than 256 characters", () => {
          const partitionKey = { object: faker.random.alphaNumeric(MAX_PARTITION_KEY_LENGTH + 1) };
          const event = { partitionKey: partitionKey };
          const expectedPartitionKey = createHash(JSON.stringify(partitionKey));
          const actualPartitionKey = deterministicPartitionKey(event);
          expect(actualPartitionKey).toBe(expectedPartitionKey);
        });
      });
    });

    describe("Given no partitionKey", () => {
      it("Returns a hash of the event object if it is less or equal than 256 characters", () => {
        const event = { [faker.random.word()]: faker.random.word() };
        const expectedPartitionKey = createHash(JSON.stringify(event));
        const actualPartitionKey = deterministicPartitionKey(event);
        expect(actualPartitionKey).toBe(expectedPartitionKey);
      });

      it("Returns a hash of the event object if it is more than 256 characters", () => {
        const event = { [faker.random.word()]: faker.random.alphaNumeric(MAX_PARTITION_KEY_LENGTH + 1) };
        const expectedPartitionKey = createHash(JSON.stringify(event));
        const actualPartitionKey = deterministicPartitionKey(event);
        expect(actualPartitionKey).toBe(expectedPartitionKey);
      });
    });
  });

  describe("Given no event", () => {
    it("Returns the literal '0'", () => {
      const expectedPartitionKey = deterministicPartitionKey();
      expect(expectedPartitionKey).toBe(TRIVIAL_PARTITION_KEY);
    });
  });
});

