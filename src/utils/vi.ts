import { proxy } from 'valtio'
// import { initialStepMachineContextFormat, initialContractFormState } from './xstate/stepMachine/initialState'
// import { NSP } from '~/utils/httpClient'
// import { TStepMachineContextFormat, TContractForm, EStep } from './xstate/stepMachine/types'
import { TPresonDataResponse } from '~/types'
import pkg from '../../package.json'
import type { Node } from 'relatives-tree/lib/types';

class Singleton {
  private static instance: Singleton
  private _common: {
    appVersion: string;
    activeFamilyTree: any;
    personsInfo: {
      [key: string]: TPresonDataResponse;
    };
    counters: {
      total: number;
      load: {
        processed: number;
        minimumInfo: {
          success: number;
          errors: number;
        };
        customService: {
          success: number;
          errors: number;
        };
        googleSheets: {
          success: string[];
          errors: number;
        };
      };
    };
  }
  // NOTE: Etc. 1/3

  private constructor() {
    this._common = proxy({
      activeFamilyTree: null,
      appVersion: pkg.version,
      personsInfo: {},
      counters: {
        total: 0,
        load: {
          processed: 0,
          minimumInfo: {
            success: 0,
            errors: 0,
          },
          customService: {
            success: 0,
            errors: 0,
          },
          googleSheets: {
            success: [],
            errors: 0,
          },
        },
      },
    })
    // NOTE: Etc. 2/3
  }
  public static getInstance(): Singleton {
    if (!Singleton.instance) Singleton.instance = new Singleton()
    return Singleton.instance
  }

  get common() {
    return this._common
  }
  // NOTE: Etc. 3/3
  
  public setActiveFamilyTree(value: readonly Readonly<Node>[]) {
    this._common.activeFamilyTree = value
    this._common.counters.total = value.length
  }
  public setSinglePersonData(person: TPresonDataResponse) {
    if (person.data?.id) {
      this._common.personsInfo[person.data.id] = person

      if (person.data.customService?.ok) this._common.counters.load.minimumInfo.success += 1
      else this._common.counters.load.minimumInfo.errors += 1

      if (person.data.customService?.ok) this._common.counters.load.customService.success += 1
      else this._common.counters.load.customService.errors += 1

      if (person.data.googleSheets?.data?.ok) this._common.counters.load.googleSheets.success.push(person.data.googleSheets?.data.id)
      else this._common.counters.load.googleSheets.errors += 1
    } else {
      this._common.counters.load.minimumInfo.errors += 1
    }
    this._common.counters.load.processed += 1
  }
}

// NOTE: Valtio Instance (external proxy based multistore)
export const vi = Singleton.getInstance()

// NOTE: Also u can mutate vi.state if necessary
// For example: vi.state.imei.result.state = 'success'
