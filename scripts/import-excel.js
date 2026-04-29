#!/usr/bin/env node
/**
 * 将 Excel 文件转换为 Astro 内容集合的 Markdown 文件
 * 用法: node scripts/import-excel.js <path-to-excel>
 */
import * as XLSX from 'xlsx';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, basename, extname } from 'path';

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('用法: node scripts/import-excel.js <path-to-excel>');
  process.exit(1);
}

const excelPath = args[0];
if (!existsSync(excelPath)) {
  console.error(`文件不存在: ${excelPath}`);
  process.exit(1);
}

const workbook = XLSX.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

if (rows.length < 2) {
  console.error('Excel 文件内容不足');
  process.exit(1);
}

const headers = rows[0].map(h => String(h).trim());
const dataRows = rows.slice(1).filter(row => row.some(cell => cell != null && cell !== ''));

console.log(`发现 ${dataRows.length} 条数据`);

const outDir = join(process.cwd(), 'src', 'content', 'events');
mkdirSync(outDir, { recursive: true });

// 列索引映射（根据实际 Excel 调整）
const colMap = {
  title: 0,
  date: 1,
  tags: 2,
  summary: 3,
  background: 4,
  riskPoints: 5,
  guidance: 6,
  deepStrategy: 7,
};

let count = 0;
for (const row of dataRows) {
  const title = String(row[colMap.title] || '').trim();
  const date = String(row[colMap.date] || '').trim();
  const tags = String(row[colMap.tags] || '').trim();
  const summary = String(row[colMap.summary] || '').trim();
  const background = String(row[colMap.background] || '').trim();
  const riskPointsRaw = row[colMap.riskPoints];
  const guidance = String(row[colMap.guidance] || '').trim();
  const deepStrategy = row[colMap.deepStrategy] ? String(row[colMap.deepStrategy]).trim() : '';

  if (!title || !date) {
    console.warn(`跳过空数据行: ${JSON.stringify(row.slice(0, 3))}`);
    continue;
  }

  // 构建 riskPoints
  let riskPointsStr = '';
  if (riskPointsRaw) {
    const points = Array.isArray(riskPointsRaw)
      ? riskPointsRaw
      : String(riskPointsRaw).split(/[;；\n]/).filter(Boolean);
    riskPointsStr = points.map(p => `  - ${String(p).trim()}`).join('\n');
  }

  // 生成 slug
  const slug = date.replace(/\//g, '-') + '-' + title.replace(/[^\w\u4e00-\u9fff]/g, '-').replace(/-+/g, '-').toLowerCase();

  // 标签处理
  const tagList = tags ? tags.split(/[,，;；]/).map(t => t.trim()).filter(Boolean) : [];

  const md = [
    '---',
    `title: ${title}`,
    `date: ${date}`,
    `tags: [${tagList.join(', ')}]`,
    `summary: ${summary}`,
    `background: ${background}`,
    `riskPoints:`,
    riskPointsStr,
    `guidance: ${guidance}`,
    deepStrategy ? `deepStrategy: ${deepStrategy}` : '',
    '---',
  ].filter(l => l !== undefined && l !== '  -').join('\n');

  const filePath = join(outDir, `${slug}.md`);
  writeFileSync(filePath, '\ufeff' + md, 'utf8');
  console.log(`✓ ${slug}.md`);
  count++;
}

console.log(`\n完成，共导入 ${count} 条记录到 ${outDir}`);
