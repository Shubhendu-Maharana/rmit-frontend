// Simple interface mirroring MMKV behavior on the web using localStorage
class MMKWMock {
  getString(key: string): string | null {
    return localStorage.getItem(key);
  }
  set(key: string, value: string): void {
    localStorage.setItem(key, value);
  }
  delete(key: string): void {
    localStorage.removeItem(key);
  }
  clearAll(): void {
    localStorage.clear();
  }
}

export const mmkv = new MMKWMock();

// Redux-persist compatible storage adapter
export const reduxPersistStorage = {
  getItem: (key: string): Promise<string | null> => {
    return Promise.resolve(mmkv.getString(key));
  },
  setItem: (key: string, value: string): Promise<void> => {
    mmkv.set(key, value);
    return Promise.resolve();
  },
  removeItem: (key: string): Promise<void> => {
    mmkv.delete(key);
    return Promise.resolve();
  },
};
