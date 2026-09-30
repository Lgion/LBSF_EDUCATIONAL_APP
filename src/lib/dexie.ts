import Dexie, { type Table } from 'dexie';
import type { IProductionLog, IProduct, IUser } from '../types/bsf';

export class BsfLocalDatabase extends Dexie {
  productionLogs!: Table<IProductionLog, string>;
  productsCache!: Table<IProduct, string>;
  userProfileCache!: Table<IUser, string>;

  constructor() {
    super('bsf_colony_db');
    this.version(1).stores({
      productionLogs: 'idLocalDexie, satelliteId, dateSaisie, isSynced, [satelliteId+dateSaisie]',
      productsCache: '_id, categorie, nom',
      userProfileCache: 'clerkUserId'
    });
  }
}

export const dbLocal = new BsfLocalDatabase();
