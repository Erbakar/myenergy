import { AngularEditorConfig } from '@kolkov/angular-editor';

const editorConfig: AngularEditorConfig = {
  editable: true,
  spellcheck: true,
  height: '600px',
  minHeight: '600px',
  maxHeight: 'auto',
  width: 'auto',
  minWidth: '0',
  translate: 'yes',
  enableToolbar: true,
  showToolbar: true,
  placeholder: 'Enter text here...',
  defaultParagraphSeparator: '',
  defaultFontName: '',
  defaultFontSize: '',
  fonts: [{ class: 'aktiv-grotesk', name: 'aktiv-grotesk' }],
  customClasses: [
    {
      name: 'quote',
      class: 'quote',
    },
    {
      name: 'redText',
      class: 'redText',
    },
    {
      name: 'titleText',
      class: 'titleText',
      tag: 'h1',
    },
  ],
  uploadUrl: 'v1/image',
  uploadWithCredentials: false,
  sanitize: true,
  toolbarPosition: 'top',
  toolbarHiddenButtons: [['bold', 'italic'], ['fontSize']],
};

export default editorConfig;
