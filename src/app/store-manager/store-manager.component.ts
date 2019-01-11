import { Component, OnInit } from '@angular/core';
import { SettingsTreeStoreFacade } from '../store/settings-tree-store.facade';
import { ISettings, ISettingsStore } from '../store/settings-tree-store';
import { SubscriberComponent } from 'src/shared/utils/abstract-subscriber-component';
import { StoreManagerService } from './store-manager.service';

@Component({
  selector: 'app-store-manager',
  templateUrl: './store-manager.component.html',
  styleUrls: ['./store-manager.component.scss']
})
export class StoreManagerComponent extends SubscriberComponent implements OnInit {

  updated: Boolean;
  canUndo: boolean;
  canRedo: boolean;
  data: ISettings[];

  constructor(
    private settingsStoreFacade: SettingsTreeStoreFacade,
    public storeManagerService: StoreManagerService
  ) {
    super();
  }

  ngOnInit() {
    const updateFromSnapshot = this.onSnapshotUpdate();
    this.addSubscription(this.settingsStoreFacade.subscribeToSnapshotUpdates(updateFromSnapshot));

    const updateFromChanges = this.onChangesUpdate();
    this.addSubscription(this.settingsStoreFacade.subscribeToChangesUpdates(updateFromChanges));
  }

  onSnapshotUpdate() {
    const that = this;
    function updateFromSnapshot(snapshot: ISettingsStore) {
      if (snapshot) {
        that.data = snapshot.settings;
        that.storeManagerService.initSettings(that.data.length);
      }
    }
    return updateFromSnapshot;
  }

  onChangesUpdate() {
    const that = this;
    // TODO type
    function updateFromChanges(changes) {
      if (changes) {
        that.updated = changes.undoIdx !== 0;
        that.canUndo = that.settingsStoreFacade.canUndo();
        that.canRedo = that.settingsStoreFacade.canRedo();
      }
    }
    return updateFromChanges;
  }

  onAction(action: string) {
    switch (action) {
      case 'refresh':
        this.settingsStoreFacade.refresh();
        break;
      case 'add':
        this.onAdd();
        break;
      case 'remove':
        this.onRemove();
        break;
      case 'undo':
        this.settingsStoreFacade.undo();
        break;
      case 'redo':
        this.settingsStoreFacade.redo();
        break;
      case 'save':
        this.settingsStoreFacade.save();
        break;
      default:
        this.settingsStoreFacade.refresh();
        break;
    }
  }

  onAdd() {
    const _settings: ISettings = {
      id: 'user-settings' + this.storeManagerService.getNextSettingId().toString(),
      version: 43,
      type: 'settings',
      dashboard: {
        defaultId: null
      },
      lang: null,
      actionableOptimizationSettings: {
        mainframeCapacityInfo: 'Medium: 500 - 2000',
        numberOfCpc: 1,
        msuAnnualCost: null,
        currency: 'USD',
        annualCostPerLicense: 0,
        numberOfLicenses: this.storeManagerService.getSettingId(),
        rebate: 0,
        acquisitionDate: '2019-01-09T23:00:00.000Z'
      }
    };

    this.settingsStoreFacade.create(_settings);
  }

  onRemove() {

    const _settings: ISettings = {
      id: 'user-settings' + this.storeManagerService.getSettingId().toString(),
      version: 43,
      type: 'settings',
      dashboard: {
        defaultId: null
      },
      lang: null,
      actionableOptimizationSettings: {
        mainframeCapacityInfo: 'Medium: 500 - 2000',
        numberOfCpc: 1,
        msuAnnualCost: null,
        currency: 'USD',
        annualCostPerLicense: 0,
        numberOfLicenses: this.storeManagerService.getSettingId(),
        rebate: 0,
        acquisitionDate: '2019-01-09T23:00:00.000Z'
      }
    };

    this.settingsStoreFacade.delete(_settings);
  }

}
