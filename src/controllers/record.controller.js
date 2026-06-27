import ExcelJS from 'exceljs';

function getStore(req) {
  return req.app.locals.store;
}

function validateRecord(body) {
  const required = ['date', 'fullName', 'scheduleStart', 'scheduleEnd', 'entryTime', 'exitTime', 'reason', 'employeeSignature', 'supervisorSignature'];
  const missing = required.filter((field) => !body[field]);
  if (missing.length) {
    const error = new Error(`Faltan campos obligatorios: ${missing.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }
}

export async function listRecords(req, res, next) {
  try {
    const records = await getStore(req).listRecords();
    res.json({ success: true, count: records.length, data: records });
  } catch (error) {
    next(error);
  }
}

export async function getRecord(req, res, next) {
  try {
    const record = await getStore(req).getRecord(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    res.json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
}

export async function createRecord(req, res, next) {
  try {
    validateRecord(req.body);
    const record = await getStore(req).createRecord(req.body);
    res.status(201).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
}

export async function deleteRecord(req, res, next) {
  try {
    const record = await getStore(req).deleteRecord(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    res.json({ success: true, message: 'Registro eliminado correctamente', data: record });
  } catch (error) {
    next(error);
  }
}

export async function exportRecordsToExcel(req, res, next) {
  try {
    const records = await getStore(req).listRecords();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Registros');

    worksheet.columns = [
      { header: 'Fecha', key: 'date', width: 16 },
      { header: 'Nombre', key: 'fullName', width: 28 },
      { header: 'Horario inicio', key: 'scheduleStart', width: 16 },
      { header: 'Horario fin', key: 'scheduleEnd', width: 16 },
      { header: 'Entrada', key: 'entryTime', width: 14 },
      { header: 'Salida', key: 'exitTime', width: 14 },
      { header: 'Motivo', key: 'reason', width: 35 },
      { header: 'Observaciones', key: 'observations', width: 40 },
      { header: 'Firma persona', key: 'employeeSignature', width: 20 },
      { header: 'Firma supervisión', key: 'supervisorSignature', width: 20 }
    ];

    records.forEach((record) => {
      worksheet.addRow({
        date: String(record.date).slice(0, 10),
        fullName: record.fullName,
        scheduleStart: record.scheduleStart,
        scheduleEnd: record.scheduleEnd,
        entryTime: record.entryTime,
        exitTime: record.exitTime,
        reason: record.reason,
        observations: record.observations || '',
        employeeSignature: record.employeeSignature ? 'Incluida en base de datos' : 'No incluida',
        supervisorSignature: record.supervisorSignature ? 'Incluida en base de datos' : 'No incluida'
      });
    });

    worksheet.getRow(1).font = { bold: true };
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="registros-asistencia.xlsx"');
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    next(error);
  }
}
