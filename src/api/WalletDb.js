import { openDB } from 'idb';

const _dbContext = {
    _dbName: 'WalletDb',
    _dbVersion: 1,
    _db: null,

    walletCollectionName: 'wallets',
    settingsCollectionName: 'settings',

    async openDb() {
        if (!this._db) {
            this._db = await openDB(this._dbName, this._dbVersion, {
                upgrade: this._migrateDb
            });
        }

        return this._db;
    },

    async getStorage(name) {
        var db = await this.openDb();

        return {
            async getAll() {
                return await db.getAll(name);
            },

            async get(key) {
                return await db.get(name, key);
            },

            async getFromIndex(indexName, key) {
                return await db.getFromIndex(name, indexName, key);
            },

            async add(item) {
                await db.add(name, item);
            },

            async put(item) {
                await db.put(name, item);
            },
            
            async delete(key) {
                await db.delete(name, key);
            }
        };
    },

    _migrateDb(db, oldVersion, newVersion, transaction) {
        // Wallet Store
        db.createObjectStore(_dbContext.walletCollectionName, { keyPath: "id", autoIncrement: true });

        // SettingsStore
        db.createObjectStore(_dbContext.settingsCollectionName, { keyPath: "name" });
    }

};

const WalletDb = {
    async getSettingsStorage() {
        return await _dbContext.getStorage(_dbContext.settingsCollectionName);
    },
    async getWalletStorage() {
        return await _dbContext.getStorage(_dbContext.walletCollectionName);
    }
};

export default WalletDb;