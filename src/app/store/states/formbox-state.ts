import { AbsenderlisteState } from './absender-state';
import { AppState } from './app-state';
import { INITIAL_STATE as EEC_INITIAL_STATE } from './expression-editor-commands-state';
import { ExpressionEditorState } from './expression-editor-state';
import { FormularEditorState, INITIAL_STATE as FE_INITIAL_STATE } from './formular-editor-state';
import { FormularGuiState, INITIAL_STATE as FG_INITIAL_STATE } from './formular-gui-state';
import { INITIAL_STATE as ldapInit, LDAPState } from './ldap-state';
import { INITIAL_STATE as SLV_INITIAL_STATE, SachleitendeverfuegungState } from './sachleitendeverfuegung-state';
import { INITIAL_STATE as TS_INITIAL_STATE, TemplateState } from './template-state';

/**
 * Globales Statusobjekt für FormBox.
 * Dient als Root für untergeordnete Statusobjekte.
 */
export interface FormBoxState {
  appstate: AppState;
  absenderliste: AbsenderlisteState;
  template: TemplateState;
  ldap: LDAPState;
  expressionEditor: ExpressionEditorState;
  formularEditor: FormularEditorState;
  formularGui: FormularGuiState;
  slv: SachleitendeverfuegungState;
}

/**
 * Initialer Status beim Start der Anwendung.
 * Hier können sinnvolle Defaultwerte im Status gesetzt werden.
 */
export const INITIAL_STATE: FormBoxState = {
  appstate: { busy: false },
  absenderliste: { selected: undefined, pal: [] },
  ldap: ldapInit,
  template: TS_INITIAL_STATE,
  expressionEditor: {
    expressionEditorCommands: EEC_INITIAL_STATE,
    expressionEditorOverrideFrags: { overrideFrags: [] }
  },
  formularEditor: FE_INITIAL_STATE,
  formularGui: FG_INITIAL_STATE,
  slv: SLV_INITIAL_STATE
};
