import { select } from '@angular-redux/store';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Form } from '../../data/forms/form';
import { FormXmlParserService } from '../../services/form-xml-parser.service';
import { TemplateActions } from '../../store/actions/template-actions';
import { FormularGuiActions } from '../../store/actions/formular-gui-actions';
import { FormularGuiService } from '../../services/formular-gui.service';

@Component({
  selector: 'app-formular-gui',
  templateUrl: './formular-gui.component.html',
  styleUrls: ['./formular-gui.component.css']
})
export class FormularGuiComponent implements OnInit {
  @select(['formularEditor', 'form']) form: Observable<Form>;

  constructor(private formularGuiActions: FormularGuiActions, private service: FormularGuiService) { }

  ngOnInit(): void {
    this.formularGuiActions.fillValues();
  }
}
