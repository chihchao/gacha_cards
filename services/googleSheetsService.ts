
import { Student } from '../types';

// 擴展偵測關鍵字
const ID_SYNONYMS = ['id', '學號', '編號', '編碼', '學生編號', 'no'];
const SEAT_SYNONYMS = ['seat', '座號', '號碼', '序號', '座次', '座號碼'];
const NAME_SYNONYMS = ['name', '姓名', '學生姓名', '名字', '學生', '姓名欄'];
const AVATAR_SYNONYMS = ['avatar', '照片', '大頭照', '頭像', '圖片', '頭部', '頭像網址', '照片網址', '連結', 'url', 'link', 'photo'];

const STORAGE_MAP_KEY = 'sheets_original_headers';
const STORAGE_INV_KEY = 'sheets_inventory_headers';

/**
 * 處理頭像連結並提供預設
 */
const formatAvatarUrl = (url: string, id: string | number): string => {
  if (!url || url.trim() === '') {
    // 穩定 ID 映射
    const numericId = typeof id === 'number' ? id : (id.length || 0);
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${(numericId % 151) + 1}.png`;
  }

  let formatted = url.trim();
  if (formatted.includes('drive.google.com')) {
    const driveIdMatch = formatted.match(/\/d\/(.+?)\/(view|edit)?/);
    if (driveIdMatch && driveIdMatch[1]) {
      return `https://drive.google.com/uc?export=view&id=${driveIdMatch[1]}`;
    }
  }
  return formatted;
};

export const sheetsService = {
  isValidUrl: (url: string) => {
    return url && url.startsWith('https://script.google.com/macros/s/');
  },

  fetchStudents: async (url: string): Promise<Student[]> => {
    try {
      if (!sheetsService.isValidUrl(url)) throw new Error('Invalid URL');
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const rawData = await response.json();
      
      if (!rawData || rawData.length === 0) return [];

      const firstItem = rawData[0];
      const allOriginalHeaders = Object.keys(firstItem);
      
      const headerMap: Record<string, string> = {};
      const inventoryHeaders: string[] = [];

      allOriginalHeaders.forEach(header => {
        const normalized = header.trim().toLowerCase();
        if (ID_SYNONYMS.includes(normalized)) headerMap['id'] = header;
        else if (SEAT_SYNONYMS.includes(normalized)) headerMap['seat'] = header;
        else if (NAME_SYNONYMS.includes(normalized)) headerMap['name'] = header;
        else if (AVATAR_SYNONYMS.includes(normalized)) headerMap['avatar'] = header;
        else inventoryHeaders.push(header);
      });

      localStorage.setItem(STORAGE_MAP_KEY, JSON.stringify(headerMap));
      localStorage.setItem(STORAGE_INV_KEY, JSON.stringify(inventoryHeaders));

      return rawData.map((item: any) => {
        const rawId = item[headerMap['id']];
        const seat = String(item[headerMap['seat']] || '');
        const name = String(item[headerMap['name']] || '');
        
        // 修正：生成穩定 ID。優先數值 -> 優先原始字串 -> 備選座號 -> 備選姓名
        let finalId: string | number;
        if (rawId !== undefined && rawId !== null && rawId !== '') {
            finalId = isNaN(Number(rawId)) ? String(rawId) : Number(rawId);
        } else {
            finalId = seat || name || `temp-${Math.random()}`;
        }

        const inventory: Record<string, number> = {};
        inventoryHeaders.forEach(h => {
          inventory[h] = Number(item[h]) || 0;
        });

        return {
          id: finalId,
          seat: seat,
          name: name,
          avatar: formatAvatarUrl(String(item[headerMap['avatar']] || ''), finalId),
          inventory
        };
      });
    } catch (error) {
      console.error("Sheets Fetch Error:", error);
      throw error;
    }
  },

  saveStudents: async (url: string, students: Student[]) => {
    try {
      if (!sheetsService.isValidUrl(url)) return false;
      const headerMapStr = localStorage.getItem(STORAGE_MAP_KEY);
      if (!headerMapStr) return false;
      const headerMap = JSON.parse(headerMapStr);
      
      const payload = students.map(s => {
        const row: any = {};
        row[headerMap['id']] = s.id;
        row[headerMap['seat']] = s.seat;
        row[headerMap['name']] = s.name;
        row[headerMap['avatar']] = s.avatar;
        Object.keys(s.inventory).forEach(key => {
          row[key] = s.inventory[key];
        });
        return row;
      });

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      return res.ok;
    } catch (error) {
      console.error("Sheets Save Error:", error);
      throw error;
    }
  }
};
