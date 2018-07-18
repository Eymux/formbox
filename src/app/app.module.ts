import { DevToolsExtension, NgRedux, NgReduxModule } from '@angular-redux/store';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgLoggerModule } from '@nsalaun/ng-logger';
import { TreeModule } from 'angular-tree-component';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { NgDragDropModule } from 'ng-drag-drop';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { applyMiddleware, createStore } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { composeWithDevTools } from 'remote-redux-devtools';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { AbsenderAuswahlComponent } from './components/absender-auswahl/absender-auswahl.component';
import { AbsenderVerwaltenComponent } from './components/absender-verwalten/absender-verwalten.component';
import { DebugComponent } from './components/debug-component/debug.component';
import { DocumentCommandEditorComponent } from './components/document-command-editor/document-command-editor.component';
import { DocumentTreeviewComponent } from './components/document-treeview/document-treeview.component';
import { ExpressionEditorComponent } from './components/expression-editor/expression-editor.component';
import { ExpressionInsertFragComponent } from './components/expression-insert-frag/expression-insert-frag.component';
import { ExpressionOverrideFragComponent } from './components/expression-override-frag/expression-override-frag.component';
import { KomfortdruckComponent } from './components/komfortdruck/komfortdruck.component';
import { LDAPSucheComponent } from './components/ldap-suche/ldap-suche.component';
import { ExpressionValidatorDirective } from './directives/expression-validator-directive';
import { LdapFilterValidatorDirective } from './directives/ldap-filter-validator.directive';
import { OnCreateDirective } from './directives/on-create.directive';
import { AbsenderlisteService } from './services/absenderliste.service';
import { BarService } from './services/bar.service';
import { DialogService } from './services/dialog.service';
import { DocumentExpressionsService } from './services/document-expressions.service';
import { ExpressionService } from './services/expression.service';
import { FormDataService } from './services/form-data.service';
import { FormExpressionService } from './services/form-expression.service';
import { FormValuesXmlParserService } from './services/form-values-xml-parser.service';
import { FormXmlParserService } from './services/form-xml-parser.service';
import { FormularEditorService } from './services/formular-editor.service';
import { FormularGuiService } from './services/formular-gui.service';
import { LDAPService } from './services/ldap.service';
import { LocalStorageService } from './services/local-storage.service';
import { LDAPMockService } from './services/mocks/ldap.mock.service';
import { OfficeMockService } from './services/mocks/office.mock.service';
import { OfficeService } from './services/office.service';
import { SachleitendeVerfuegungService } from './services/sachleitende-verfuegung.service';
import { StorageService } from './services/storage.service';
import { TemplateService } from './services/template.service';
import { DexieStorage } from './storage/dexie-storage';
import { AbsenderlisteActions } from './store/actions/absenderliste-actions';
import { DialogActions } from './store/actions/dialog-actions';
import { DocumentTreeViewActions } from './store/actions/document-treeview-actions';
import { FormularEditorActions } from './store/actions/formular-editor-actions';
import { FormularGuiActions } from './store/actions/formular-gui-actions';
import { InitActions } from './store/actions/init-actions';
import { LDAPActions } from './store/actions/ldap-actions';
import { SachleitendeverfuegungActions } from './store/actions/sachleitendeverfuegung-actions';
import { StorageActions } from './store/actions/storage-actions';
import { TemplateActions } from './store/actions/template-actions';
import { AbsenderlisteEpics } from './store/middleware/absenderliste-epics';
import { DialogEpics } from './store/middleware/dialog-epics';
import { DocumentTreeViewEpics } from './store/middleware/document-treeview-epics';
import { ExpressionEditorCommandsEpics } from './store/middleware/expression-editor-commands-epics';
import { FormularEditorEpics } from './store/middleware/formular-editor-epics';
import { FormularGuiEpics } from './store/middleware/formular-gui-epics';
import { InitEpics } from './store/middleware/init-epics';
import { LDAPEpics } from './store/middleware/ldap-epics';
import { RootEpic } from './store/middleware/root-epic';
import { SachleitendeverfuegungEpics } from './store/middleware/sachleitendeverfuegung-epics';
import { StorageEpics } from './store/middleware/storage-epics';
import { TemplateEpics } from './store/middleware/template-epics';
import { rootReducer } from './store/reducers/root-reducer';
import { FormBoxState, INITIAL_STATE } from './store/states/formbox-state';

@NgModule({
  declarations: [
    AppComponent,
    LDAPSucheComponent,
    AbsenderVerwaltenComponent,
    AbsenderAuswahlComponent,
    LdapFilterValidatorDirective,
    ExpressionEditorComponent,
    DocumentCommandEditorComponent,
    ExpressionValidatorDirective,
    ExpressionInsertFragComponent,
    ExpressionOverrideFragComponent,
    DocumentTreeviewComponent,
    DebugComponent,
    KomfortdruckComponent,
    OnCreateDirective
  ],
  imports: [
    AccordionModule.forRoot(),
    NgDragDropModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    NgLoggerModule.forRoot(environment.loglevel),
    TooltipModule.forRoot(),
    HttpModule,
    BrowserModule,
    NgReduxModule,
    FormsModule,
    Angular2FontawesomeModule,
    TreeModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    DexieStorage,
    { provide: StorageService, useClass: LocalStorageService },
    TemplateService,
    TemplateActions,
    AbsenderlisteActions,
    LDAPActions,
    StorageActions,
    DocumentTreeViewActions,
    AbsenderlisteService,
    AbsenderlisteEpics,
    TemplateEpics,
    LDAPEpics,
    StorageEpics,
    RootEpic,
    DialogActions,
    DialogEpics,
    DialogService,
    DocumentTreeViewEpics,
    { provide: LDAPService, useClass: environment.test ? LDAPMockService : LDAPService },
    DocumentExpressionsService,
    ExpressionEditorCommandsEpics,
    { provide: OfficeService, useClass: environment.test ? OfficeMockService : OfficeService },
    FormDataService,
    FormXmlParserService,
    BarService,
    FormularEditorActions,
    FormularEditorEpics,
    FormularEditorService,
    FormularGuiActions,
    FormularGuiEpics,
    FormularGuiService,
    SachleitendeVerfuegungService,
    SachleitendeverfuegungActions,
    SachleitendeverfuegungEpics,
    InitActions,
    InitEpics,
    ExpressionService,
    FormExpressionService,
    FormValuesXmlParserService
  ],
  bootstrap: [AppComponent]
})
// tslint:disable-next-line:no-unnecessary-class
export class AppModule {
  constructor(
    private ngRedux: NgRedux<FormBoxState>,
    private devTools: DevToolsExtension,
    private rootEpic: RootEpic,
    private init: InitActions
  ) {
    const middleware = [
      createEpicMiddleware(this.rootEpic.epics())
    ];

    if (environment.production || environment.test) {
      ngRedux.configureStore(rootReducer, INITIAL_STATE, middleware);
    } else {
      const composeEnhancers = composeWithDevTools({
        realtime: true, maxAge: 999, hostname: environment.reduxRemoteUrl,
        port: environment.reduxRemotePort, secure: environment.reduxRemoteSecure
      });
      ngRedux.provideStore(createStore(rootReducer, INITIAL_STATE, composeEnhancers(applyMiddleware(...middleware))));
    }

    this.init.initSLV();
    this.init.initFormValues();
  }
}
