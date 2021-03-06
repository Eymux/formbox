import { Input } from '@angular/core';
import { Logger } from '@nsalaun/ng-logger';

export abstract class FormularGuiBase<T> {
  @Input() control: T;
}
