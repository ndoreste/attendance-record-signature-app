# Attendance Record Signature App

Aplicación web completa para registrar fecha, nombre, horarios, entradas y salidas, motivos y firmas digitales dibujadas en pantalla. Los datos se guardan en MongoDB y se pueden consultar desde la web o exportar a Excel.

## Tecnologías

- Node.js
- Express
- MongoDB
- Mongoose
- HTML
- CSS
- JavaScript
- Canvas API para firmas digitales
- ExcelJS para exportar `.xlsx`

## Instalación

```bash
npm install
cp .env.example .env
```

Edita `.env` si quieres usar MongoDB real:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/attendance_records_signature_app
```

## Arranque con MongoDB

Asegúrate de tener MongoDB arrancado y ejecuta:

```bash
npm start
```

Abre:

```text
http://localhost:3000
```

## Modo de prueba sin MongoDB

Si solo quieres probar la aplicación rápido:

```bash
USE_MEMORY_STORE=true PORT=3000 npm start
```

Este modo guarda los datos en memoria mientras el servidor está encendido.

## Rutas principales

### Frontend

```text
GET /
```

### API

```text
GET    /api/health
GET    /api/records
GET    /api/records/:id
POST   /api/records
DELETE /api/records/:id
GET    /api/records/export/excel
```

## Ejemplo de body JSON

```json
{
  "date": "2026-06-27",
  "fullName": "Nauzet Doreste",
  "scheduleStart": "08:00",
  "scheduleEnd": "15:00",
  "entryTime": "08:03",
  "exitTime": "15:01",
  "reason": "Jornada ordinaria",
  "observations": "Sin incidencias",
  "employeeSignature": "data:image/png;base64,...",
  "supervisorSignature": "data:image/png;base64,..."
}
```

## Exportar a Excel

Desde la interfaz web, pulsa **Exportar Excel**.

También puedes descargarlo directamente:

```bash
curl -L http://localhost:3000/api/records/export/excel -o registros-asistencia.xlsx
```

## Pruebas

```bash
npm test
npm run lint
```

## Estructura

```text
public/
  index.html
  styles.css
  app.js
src/
  app.js
  server.js
  config/database.js
  controllers/record.controller.js
  middleware/errorHandler.js
  models/attendanceRecord.model.js
  repositories/memoryStore.js
  repositories/mongoStore.js
  routes/record.routes.js
tests/
  records.test.js
```

## Uso recomendado

1. Abre `http://localhost:3000`.
2. Rellena fecha, nombre, horarios, entrada, salida y motivo.
3. Dibuja la firma de la persona y la firma de supervisión.
4. Pulsa **Guardar registro**.
5. Revisa los registros en la tabla.
6. Exporta a Excel cuando necesites entregar o archivar los datos.
