import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { createMemoryStore } from '../src/repositories/memoryStore.js';

function app() {
  return createApp({ store: createMemoryStore(), databaseLabel: 'test-memory' });
}

function validPayload() {
  return {
    date: '2026-06-27',
    fullName: 'Nauzet Doreste',
    scheduleStart: '08:00',
    scheduleEnd: '15:00',
    entryTime: '08:03',
    exitTime: '15:01',
    reason: 'Jornada ordinaria',
    observations: 'Sin incidencias',
    employeeSignature: 'data:image/png;base64,AAAA',
    supervisorSignature: 'data:image/png;base64,BBBB'
  };
}

test('GET /api/health funciona', async () => {
  const response = await request(app()).get('/api/health').expect(200);
  assert.equal(response.body.status, 'ok');
});

test('crea y lista registros con firmas', async () => {
  const server = app();
  const created = await request(server).post('/api/records').send(validPayload()).expect(201);
  assert.equal(created.body.data.fullName, 'Nauzet Doreste');
  assert.ok(created.body.data.employeeSignature);
  const list = await request(server).get('/api/records').expect(200);
  assert.equal(list.body.count, 1);
});

test('controla errores de campos obligatorios', async () => {
  const response = await request(app()).post('/api/records').send({ fullName: 'Sin fecha' }).expect(400);
  assert.match(response.body.message, /Faltan campos obligatorios/);
});

test('exporta registros a Excel', async () => {
  const server = app();
  await request(server).post('/api/records').send(validPayload()).expect(201);
  const response = await request(server)
    .get('/api/records/export/excel')
    .buffer(true)
    .parse((res, callback) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => callback(null, Buffer.concat(chunks)));
    })
    .expect(200);
  assert.match(response.headers['content-type'], /spreadsheetml/);
  assert.ok(response.body.length > 1000);
});
