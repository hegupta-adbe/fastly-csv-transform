import { parse } from 'csv-parse/sync';
import {promises as fs} from 'fs';
import { stringify } from 'csv-stringify/sync';

const infile = process.argv[2];
const outfile = process.argv[3];
const content = await fs.readFile(infile);
const records = parse(content, {
  columns: true,
  skip_empty_lines: true
});
// console.log(records);

const outobj = {};
for (const rec of records) {
  if (rec.org && rec.site) {
    outobj[`${rec.site}--${rec.org}`] = 'false';
  }
}
const outarr = [];
const keyName = "Dictionary Key";
const valName = "Dictionary Value";
outarr.push({[keyName]: '*', [valName]: 'true'});
for (const key of Object.keys(outobj)) {
  outarr.push({[keyName]: key, [valName]: outobj[key]});
}
const outcontent = stringify(outarr, {header: true});
await fs.writeFile(outfile, outcontent);