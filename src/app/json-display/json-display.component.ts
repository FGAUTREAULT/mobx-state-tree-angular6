import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-json-display',
  templateUrl: './json-display.component.html',
  styleUrls: ['./json-display.component.scss']
})
export class JsonDisplayComponent implements OnInit {

  @Input() updated: Boolean;
  @Input() data: any;

  constructor() { }

  ngOnInit() {

  }

}
