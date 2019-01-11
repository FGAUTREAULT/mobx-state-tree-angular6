import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-action-side-panel',
  templateUrl: './action-side-panel.component.html',
  styleUrls: ['./action-side-panel.component.scss']
})
export class ActionSidePanelComponent implements OnInit {

  @Input() updated: Boolean;
  @Input() canUndo: boolean;
  @Input() canRedo: boolean;
  @Output() action: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onAction(_action: string) {
    this.action.emit(_action);
  }

}
