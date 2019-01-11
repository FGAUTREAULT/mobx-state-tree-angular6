import { Injectable } from '@angular/core';
import { Instance, types, getSnapshot, flow } from 'mobx-state-tree';
import { UndoManager } from 'mst-middlewares';

export const USER_SETTNGS = 'user-settings';
export const ELASTIC_TYPE_SETTINGS = 'settings';

// TODO type
export let undoManager: any;
export const setUndoManager = targetStore => {
  undoManager = UndoManager.create({}, { targetStore });
};

const ActionableOptimizationSettings = types.model('ActionableOptimizationSettings', {
  acquisitionDate: types.maybeNull(types.string),
  annualCostPerLicense: types.optional(types.number, 0),
  currency: types.maybeNull(types.string),
  mainframeCapacityInfo: types.maybeNull(types.string),
  msuAnnualCost: types.maybeNull(types.optional(types.number, 0)),
  numberOfCpc: types.optional(types.number, 0),
  numberOfLicenses: types.optional(types.number, 0),
  rebate: types.optional(types.number, 0),
});
export interface IActionableOptimizationSettings extends Instance<typeof ActionableOptimizationSettings> { }

const DashboardRef = types.model('DashboardRef', {
  defaultId: types.maybeNull(types.string),
});

const SettingsModel = types
  .model('Settings', {
    id: types.identifier,
    actionableOptimizationSettings: ActionableOptimizationSettings,
    dashboard: DashboardRef,
    lang: types.maybeNull(types.string),
    type: types.optional(types.string, ELASTIC_TYPE_SETTINGS),
    version: types.optional(types.number, 0),
  })
  .actions(self => ({
  }));
export interface ISettings extends Instance<typeof SettingsModel> { }


// TODO how to remove synchronized
export const SettingsStore = types.model({
  settings: types.optional(types.array(SettingsModel), []),
  // synchronized: types.optional(types.boolean, false),
})
  .views(self => ({
    get userSettings(): ISettings {
      return getSnapshot(self.settings.find(settings => settings.id === USER_SETTNGS));
    },
    get all(): ISettings[] {
      return getSnapshot(self).settings;
    },
    // get isUpdated(): boolean {
    //   return self.synchronized;
    // }
  }))
  .actions(self => {

    setUndoManager(self);
    function* refresh(_settings: ISettings[]) {
      self.settings.clear();
      _settings.forEach(setting => self.settings.push(setting));
      // self.updated = false;
    }

    return {

      init : flow(function* init(_settings: ISettings[]) {
        self.settings.clear();
        _settings.forEach(setting => self.settings.push(setting));
        // self.updated = false;
      }),

      // No undo redo has retieve from server
      // init: (_settings) => undoManager.withoutUndoFlow(refresh)(),
      refresh(_settings: ISettings[]) {
        undoManager.startGroup(() => {
          self.settings.clear();
          _settings.forEach(setting => self.settings.push(setting));
          // self.synchronized = true;
        });
        undoManager.stopGroup();
        undoManager.clear();
      },
      update(_setting: ISettings) {
        self.settings.filter((setting) => setting.id !== _setting.id).push(_setting);
        // self.synchronized = false;
      },
      create(_setting: ISettings) {
        self.settings.push(_setting);
        // self.synchronized = false;
      },
      delete(_setting: ISettings) {
        const index = self.settings.findIndex((setting) => setting.id === _setting.id);
        if (index !== -1) {
          self.settings.splice(self.settings.indexOf(_setting), 1);
          // self.synchronized = false;
        }
      },
      save() {
        // self.synchronized = true;
        undoManager.clear();
      }
    };

  })
  ;
export interface ISettingsStore extends Instance<typeof SettingsStore> { }

@Injectable({
  providedIn: 'root'
})
export class SettingsTreeStore {

  public static actions = ['refresh', 'update', 'create'];
  private _store: ISettingsStore;

  constructor(
  ) {
    this._store = SettingsStore.create({});
  }

  getStore(): ISettingsStore {
    return this._store;
  }

}
