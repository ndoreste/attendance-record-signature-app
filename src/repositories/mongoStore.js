import { AttendanceRecord } from '../models/attendanceRecord.model.js';

export function createMongoStore() {
  return {
    async listRecords() {
      return AttendanceRecord.find().sort({ date: -1, createdAt: -1 });
    },
    async getRecord(id) {
      return AttendanceRecord.findById(id);
    },
    async createRecord(payload) {
      return AttendanceRecord.create(payload);
    },
    async deleteRecord(id) {
      return AttendanceRecord.findByIdAndDelete(id);
    }
  };
}
