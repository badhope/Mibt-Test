import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StorageService } from '../../../src/services/StorageService.js';

describe('StorageService', () => {
  let storage;
  
  beforeEach(() => {
    vi.clearAllMocks();
    storage = new StorageService('test_');
    storage.clear();
  });
  
  describe('constructor', () => {
    it('应该正确初始化', () => {
      expect(storage).toBeDefined();
      expect(storage.prefix).toBe('test_');
    });
  });
  
  describe('set 和 get', () => {
    it('应该正确存储和获取字符串值', () => {
      storage.set('name', 'John');
      expect(storage.get('name')).toBe('John');
    });
    
    it('应该正确存储和获取对象', () => {
      const obj = { name: 'John', age: 30 };
      storage.set('user', obj);
      expect(storage.get('user')).toEqual(obj);
    });
    
    it('获取不存在的键应该返回 null', () => {
      expect(storage.get('nonexistent')).toBeNull();
    });
  });
  
  describe('remove', () => {
    it('应该正确删除存储项', () => {
      storage.set('key', 'value');
      expect(storage.get('key')).toBe('value');
      
      storage.remove('key');
      expect(storage.get('key')).toBeNull();
    });
  });
  
  describe('clear', () => {
    it('应该清空所有带前缀的存储项', () => {
      storage.set('key1', 'value1');
      storage.set('key2', 'value2');
      
      storage.clear();
      
      expect(storage.get('key1')).toBeNull();
      expect(storage.get('key2')).toBeNull();
    });
    
    it('不应该清除其他前缀的存储项', () => {
      storage.set('key', 'value');
      localStorage.setItem('other_key', 'other_value');
      
      storage.clear();
      
      expect(storage.get('key')).toBeNull();
      expect(localStorage.getItem('other_key')).toBe('other_value');
      
      // 清理
      localStorage.removeItem('other_key');
    });
  });
  
  describe('saveTestProgress', () => {
    it('应该保存测试进度', () => {
      const progress = {
        testId: 'test-123',
        currentQuestion: 5,
        answers: [{ dimension: 'EI', value: 1 }],
      };
      
      storage.saveTestProgress('test-123', progress);
      
      const saved = storage.getTestProgress('test-123');
      expect(saved.currentQuestion).toBe(5);
      expect(saved.savedAt).toBeDefined();
    });
  });
  
  describe('saveTestResult', () => {
    it('应该保存测试结果', () => {
      const result = {
        testId: 'test-123',
        type: 'ENFP',
        dimensions: { E: 80, N: 60, F: 70, P: 90 },
      };
      
      storage.saveTestResult('test-123', result);
      
      const results = storage.getAllTestResults();
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].type).toBe('ENFP');
    });
  });
  
  describe('isSupported', () => {
    it('应该返回 true（在支持 localStorage 的环境中）', () => {
      expect(StorageService.isSupported()).toBe(true);
    });
  });
});
