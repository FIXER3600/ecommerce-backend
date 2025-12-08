import { parse } from 'csv-parse';

export async function parseCsv(buffer) {
  return new Promise((resolve, reject) => {
    parse(buffer, { columns: true, trim: true }, (err, records) => {
      if (err) reject(err);
      else resolve(records);
    });
  });
}
