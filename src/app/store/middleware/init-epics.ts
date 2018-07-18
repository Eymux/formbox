import 'rxjs/add/observable/concat';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/ignoreElements';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { Injectable } from '@angular/core';
import { Logger } from '@nsalaun/ng-logger';
import { ActionsObservable } from 'redux-observable';

import { SachleitendeVerfuegung } from '../../data/slv/sachleitende-verfuegung';
import { FormularGuiService } from '../../services/formular-gui.service';
import { SachleitendeVerfuegungService } from '../../services/sachleitende-verfuegung.service';
import { InitActions } from '../actions/init-actions';

@Injectable()
export class InitEpics {
  constructor(
    private log: Logger,
    private slv: SachleitendeVerfuegungService,
    private formgui: FormularGuiService
  ) { }

  initialisingSLV = (action: ActionsObservable<any>) => {
    return action.ofType(InitActions.INIT_SLV.started)
      .mergeMap(() => {
        return this.slv.getVerfuegungspunkteInDocument().then(vps => {
          return Promise.all(
            vps.map(it => {
              if (it.verfuegungspunkt1) {
                return { id: it.id, text: it.text, binding: undefined, verfuegungspunkt1: it.verfuegungspunkt1 };
              } else {
                return this.slv.bindVerfuegungspunkt(it.id)
                  .then(binding =>
                    ({
                      id: it.id,
                      text: SachleitendeVerfuegung.splitVerfuegungspunktText(it.text),
                      binding: binding,
                      verfuegungspunkt1: it.verfuegungspunkt1
                    }));
              }
            }));
        }).then(vps => {
          const act = InitActions.INIT_SLV.done({ params: {}, result: vps });

          return act;
        });
      });
  }

  initialisingFormValues = (action: ActionsObservable<any>) => {
    return action.ofType(InitActions.INIT_FORMVALUES.started)
      .mergeMap(() => {
        return this.formgui.readFormValues().then(values => {
          const act = InitActions.INIT_FORMVALUES.done({ params: {}, result: values });

          return act;
        })
      });
  }
}
