import { NgReduxModule } from '@angular-redux/store';
import { async, inject, TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { NgLoggerModule } from '@nsalaun/ng-logger';

import { DocumentExpressionsService } from '../../../src/app/services/document-expressions.service';
import { ExpressionService } from '../../../src/app/services/expression.service';
import { OfficeService } from '../../../src/app/services/office.service';
import { TemplateService } from '../../../src/app/services/template.service';
import { TemplateActions } from '../../../src/app/store/actions/template-actions';
import { environment } from '../../../src/environments/environment';
import { TemplateMockService } from './mocks/template-mock.service';

describe('ExpressionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        NgReduxModule,
        NgLoggerModule.forRoot(environment.loglevel)
      ],
      providers: [
        TemplateActions,
        { provide: TemplateService, useClass: TemplateMockService },
        DocumentExpressionsService,
        OfficeService,
        ExpressionService
      ]
    });
  });

  it('should be created', inject([DocumentExpressionsService], (service: DocumentExpressionsService) => {
    expect(service).toBeTruthy();
  }));

  it('evaluate insertFrag', async(inject([DocumentExpressionsService], (service: DocumentExpressionsService) => {
    const spy = spyOn(service.ctx, 'insertFrag').and.callThrough();
    const ret = service.eval('insertFrag(\'Externer_Briefkopf\')', 0);

    expect(typeof (ret.then)).toEqual('function');
    expect(spy).toHaveBeenCalledWith('Externer_Briefkopf');
  })));

  it('evaluate overrideFrag', async(inject([DocumentExpressionsService], (service: DocumentExpressionsService) => {
    const ret = service.eval('overrideFrag([{oldFrag: \'Adresse_Angaben\', newFrag: \'Empfaengerfeld\'}])', 0);

    ret.then(() => expect(service.ctx.overrideFrags).toEqual([{ oldFrag: 'Adresse_Angaben', newFrag: 'Empfaengerfeld' }]));
  })));

  it('evaluate insertFrag with empty override', async(inject([DocumentExpressionsService], (service: DocumentExpressionsService) => {
    const spy = spyOn<any>(service.ctx, 'getOverrideFrag').and.callThrough();
    service.eval('overrideFrag([{oldFrag: \'test\', newFrag: \'\'}])', 0).then(() => {
      const ret = service.eval('insertFrag(\'test\')', 1);

      ret.then(() => expect(spy.calls.first().returnValue).toEqual(''));
    });
  })));
});
