import mongoose from 'mongoose';

const attendanceRecordSchema = new mongoose.Schema({
  date: { type: Date, required: [true, 'La fecha es obligatoria'] },
  fullName: { type: String, required: [true, 'El nombre es obligatorio'], trim: true },
  scheduleStart: { type: String, required: [true, 'La hora de inicio es obligatoria'] },
  scheduleEnd: { type: String, required: [true, 'La hora de fin es obligatoria'] },
  entryTime: { type: String, required: [true, 'La hora de entrada es obligatoria'] },
  exitTime: { type: String, required: [true, 'La hora de salida es obligatoria'] },
  reason: { type: String, required: [true, 'El motivo es obligatorio'], trim: true },
  observations: { type: String, trim: true, default: '' },
  employeeSignature: { type: String, required: [true, 'La firma de la persona es obligatoria'] },
  supervisorSignature: { type: String, required: [true, 'La firma de supervisión es obligatoria'] }
}, { timestamps: true });

attendanceRecordSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export const AttendanceRecord = mongoose.model('AttendanceRecord', attendanceRecordSchema);
