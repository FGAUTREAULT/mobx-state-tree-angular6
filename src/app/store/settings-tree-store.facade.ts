import { Injectable } from '@angular/core';
import { onAction, onSnapshot } from 'mobx-state-tree';
import { SettingsService } from '../rest/settings-crud.service';
import { SettingsTreeStore, ISettings, ISettingsStore, undoManager } from './settings-tree-store';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsTreeStoreFacade {

  private settingsSnapshot$ = new BehaviorSubject<ISettingsStore>(null);
  // TODO type
  private settingsChanges$ = new BehaviorSubject<any>(null);

  constructor(
    private settingsService: SettingsService,
    private settingsStore: SettingsTreeStore
  ) {

    onSnapshot(this.settingsStore.getStore(), (snapshot: ISettingsStore) => {
      console.log(snapshot);
      this.settingsSnapshot$.next(snapshot);
    });

    onAction(this.settingsStore.getStore(), (call) => {
      console.log(call.name);
    });

    onSnapshot(undoManager, (changes) => {
      console.log(changes);
      this.settingsChanges$.next(changes);
    });

  }

  refresh() {
    this.settingsService.getAll().then(settings => {
      this.settingsStore.getStore().init(settings).then(() => {
        undoManager.clear();
      });
      // this.settingsStore.getStore().refresh(settings);
      // applySnapshot(this.settingsStore.getStore(), {settings});
    });
  }

  create(settings: ISettings) {
    this.settingsStore.getStore().create(settings);
  }

  delete(settings: ISettings) {
    this.settingsStore.getStore().delete(settings);
  }

  undo() {
    undoManager.undo();
  }

  redo() {
    undoManager.redo();
  }

  canUndo(): boolean {
    return undoManager.canUndo;
  }

  canRedo(): boolean {
    return undoManager.canRedo;
  }

  save() {
    const _settings = this.settingsStore.getStore().all;
    this.settingsService.update(_settings).then(() => {
      this.settingsStore.getStore().save();
    });
  }

  subscribeToSnapshotUpdates(callback: (snapshot: ISettingsStore) => void) {
    return this.settingsSnapshot$.asObservable().subscribe(callback);
  }

  // TODO type
  subscribeToChangesUpdates(callback: (changes) => void) {
    return this.settingsChanges$.asObservable().subscribe(callback);
  }

}
