import { describe, it, expect, vi } from 'vitest';
import { formatDuration, debounce, throttle, formatDate, generateUUID } from '../../../src/utils/helpers.js';

describe('helpers', () => {
  describe('formatDuration', () => {
    it('应该格式化小于 60 分钟的时长', () => {
      expect(formatDuration(30)).toBe('30 分钟');
    });
    
    it('应该格式化整小时的时长', () => {
      expect(formatDuration(60)).toBe('1 小时');
      expect(formatDuration(120)).toBe('2 小时');
    });
    
    it('应该格式化包含分钟和小时的时长', () => {
      expect(formatDuration(90)).toBe('1 小时 30 分钟');
    });
  });
  
  describe('formatDate', () => {
    it('应该格式化日期为默认格式', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date)).toBe('2024-01-15');
    });
    
    it('应该格式化日期为自定义格式', () => {
      const date = new Date('2024-01-15 14:30:00');
      expect(formatDate(date, 'YYYY/MM/DD HH:mm')).toBe('2024/01/15 14:30');
    });
  });
  
  describe('generateUUID', () => {
    it('应该生成有效的 UUID', () => {
      const uuid = generateUUID();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(uuid).toMatch(uuidRegex);
    });
    
    it('应该生成唯一的 UUID', () => {
      const uuid1 = generateUUID();
      const uuid2 = generateUUID();
      expect(uuid1).not.toBe(uuid2);
    });
  });
  
  describe('debounce', () => {
    it('应该在延迟后调用函数', () => {
      return new Promise((resolve) => {
        const fn = vi.fn();
        const debouncedFn = debounce(fn, 100);
        
        debouncedFn();
        expect(fn).not.toHaveBeenCalled();
        
        setTimeout(() => {
          expect(fn).toHaveBeenCalledTimes(1);
          resolve();
        }, 150);
      });
    });
    
    it('应该取消之前的调用', () => {
      return new Promise((resolve) => {
        const fn = vi.fn();
        const debouncedFn = debounce(fn, 100);
        
        debouncedFn();
        debouncedFn();
        debouncedFn();
        
        setTimeout(() => {
          expect(fn).toHaveBeenCalledTimes(1);
          resolve();
        }, 150);
      });
    });
  });
  
  describe('throttle', () => {
    it('应该限制函数调用频率', () => {
      const fn = vi.fn();
      const throttledFn = throttle(fn, 100);
      
      // 快速调用多次
      throttledFn();
      throttledFn();
      throttledFn();
      
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });
});
