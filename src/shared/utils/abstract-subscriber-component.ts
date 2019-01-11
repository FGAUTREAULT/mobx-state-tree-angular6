import { OnDestroy } from '@angular/core';
import { IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';

export abstract class SubscriberComponent implements OnDestroy {

  subscriptions: Subscription[];
  reactionDisposers: IReactionDisposer[];

  constructor() {
    this.subscriptions = [];
    this.reactionDisposers = [];
  }

  addSubscription(subscription: Subscription): Subscription {
    this.subscriptions.push(subscription);
    return subscription;
  }

  removeAllSubscriptions() {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.subscriptions = [];
  }

  ngOnDestroy(): void {
    this.removeAllSubscriptions();
  }

}
