import { parse } from 'csv-parse';
import { Readable } from 'stream';

export function parseCsv(buffer) {
  return new Promise((resolve, reject) => {
    const records = [];
    const parser = parse({
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
    parser.on('readable', () => {
      let record;
      while ((record = parser.read()) !== null) {
        records.push(record);
      }
    });
    parser.on('end', () => resolve(records));
    parser.on('error', reject);
    const stream = Readable.from(buffer);
    stream.pipe(parser);
  });
}
