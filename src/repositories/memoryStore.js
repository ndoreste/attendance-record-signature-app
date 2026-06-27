import crypto from 'node:crypto';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function createMemoryStore(initialRecords = []) {
  const records = initialRecords.map((record) => ({
    id: record.id || crypto.randomBytes(12).toString('hex'),
    ...record,
    createdAt: record.createdAt || new Date().toISOString(),
    updatedAt: record.updatedAt || new Date().toISOString()
  }));

  return {
    async listRecords() {
      return clone(records).sort((a, b) => String(b.date).localeCompare(String(a.date)));
    },
    async getRecord(id) {
      return clone(records.find((record) => record.id === id) || null);
    },
    async createRecord(payload) {
      const now = new Date().toISOString();
      const record = { id: crypto.randomBytes(12).toString('hex'), ...payload, createdAt: now, updatedAt: now };
      records.push(record);
      return clone(record);
    },
    async deleteRecord(id) {
      const index = records.findIndex((record) => record.id === id);
      if (index === -1) return null;
      const [deleted] = records.splice(index, 1);
      return clone(deleted);
    }
  };
}
