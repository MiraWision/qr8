import { getDatabase, openDatabase } from '../storage/db';
import { QRCodeItem, CellShape, EyeShape, QRStyle } from '../types/qr';

const migrateStyle = (style: any): QRStyle => {
  if (style.cellShape && style.eyeShape && typeof style.eyeShape === 'string') {
    return style;
  }

  const newStyle: QRStyle = {
    foregroundColor: style.foregroundColor || '#000000',
    backgroundColor: style.backgroundColor || '#FFFFFF',
    cellShape: style.cellShape || (style.bodyShape === 'rounded' ? CellShape.RoundedSquareSlight : CellShape.Square),
    eyeShape: typeof style.eyeShape === 'string' && Object.values(EyeShape).includes(style.eyeShape as EyeShape) 
      ? style.eyeShape as EyeShape 
      : (style.eyeShape === 'rounded' ? EyeShape.RoundedSquare : EyeShape.Square),
    logoBase64: style.logoBase64,
  };

  return newStyle;
};

class QRStorageService {
  async init() {
    await openDatabase();
    await this.migrateOldData();
  }

  async migrateOldData(): Promise<void> {
    const db = getDatabase();
    const allItems = await db.getAllAsync<{
      id: string;
      style_json: string;
    }>('SELECT id, style_json FROM qr_codes');
    
    for (const item of allItems) {
      try {
        const style = JSON.parse(item.style_json);
        
        if (!style.cellShape || style.bodyShape) {
          const newStyle = migrateStyle(style);
          await db.runAsync(
            'UPDATE qr_codes SET style_json = ? WHERE id = ?',
            [JSON.stringify(newStyle), item.id]
          );
        }
      } catch (error) {
        console.error('Error migrating item:', item.id, error);
      }
    }
  }

  async getAll(): Promise<QRCodeItem[]> {
    const db = getDatabase();
    const result = await db.getAllAsync<{
      id: string;
      name: string;
      type: string;
      data_json: string;
      style_json: string;
      is_pinned: number;
      created_at: number;
    }>('SELECT * FROM qr_codes ORDER BY created_at DESC');

    return result.map(row => ({
      id: row.id,
      name: row.name,
      type: row.type as any,
      data: JSON.parse(row.data_json),
      style: migrateStyle(JSON.parse(row.style_json)),
      isPinned: row.is_pinned === 1,
      createdAt: row.created_at,
    }));
  }

  async getPinned(): Promise<QRCodeItem[]> {
    const db = getDatabase();
    const result = await db.getAllAsync<{
      id: string;
      name: string;
      type: string;
      data_json: string;
      style_json: string;
      is_pinned: number;
      created_at: number;
    }>('SELECT * FROM qr_codes WHERE is_pinned = 1 ORDER BY created_at DESC LIMIT 4');

    return result.map(row => ({
      id: row.id,
      name: row.name,
      type: row.type as any,
      data: JSON.parse(row.data_json),
      style: migrateStyle(JSON.parse(row.style_json)),
      isPinned: row.is_pinned === 1,
      createdAt: row.created_at,
    }));
  }

  async add(item: QRCodeItem): Promise<void> {
    const db = getDatabase();
    await db.runAsync(
      'INSERT INTO qr_codes (id, name, type, data_json, style_json, is_pinned, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        item.id,
        item.name,
        item.type,
        JSON.stringify(item.data),
        JSON.stringify(item.style),
        item.isPinned ? 1 : 0,
        item.createdAt,
      ]
    );
  }

  async remove(id: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync('DELETE FROM qr_codes WHERE id = ?', [id]);
  }

  async pin(id: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync('UPDATE qr_codes SET is_pinned = 1 WHERE id = ?', [id]);
  }

  async unpin(id: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync('UPDATE qr_codes SET is_pinned = 0 WHERE id = ?', [id]);
  }
}

export const qrStorageService = new QRStorageService();
