import { proxy } from 'valtio'
// import { initialStepMachineContextFormat, initialContractFormState } from './xstate/stepMachine/initialState'
// import { NSP } from '~/utils/httpClient'
// import { TStepMachineContextFormat, TContractForm, EStep } from './xstate/stepMachine/types'
import { TPresonDataResponse } from '~/types'
import pkg from '../../package.json'

class Singleton {
  private static instance: Singleton
  private _common: {
    appVersion: string;
    activeFamilyTree: any;
    personsInfo: {
      [key: string]: TPresonDataResponse;
    };
  }
  // NOTE: Etc. 1/3

  private constructor() {
    this._common = proxy({
      activeFamilyTree: null,
      appVersion: pkg.version,
      personsInfo: {},
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
  
  public setActiveFamilyTree(value: any) {
    this._common.activeFamilyTree = value
  }
  public setSinglePersonData(person: TPresonDataResponse) {
    if (person.data?.id) this._common.personsInfo[person.data.id] = person
  }
}

// NOTE: Valtio Instance (external proxy based multistore)
export const vi = Singleton.getInstance()

// NOTE: Also u can mutate vi.state if necessary
// For example: vi.state.imei.result.state = 'success'
