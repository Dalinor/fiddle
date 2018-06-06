import * as React from "react";
import { render } from "react-dom";
import * as loader from 'monaco-loader';

import { mainTheme } from './themes';
import { getContent } from './content';
import { Header } from './components/header';

class App {
  public editors: any = {
    main: null,
    renderer: null,
    html: null
  };
  public monaco: any = null;
  public name = 'test';

  constructor() {
    this.getValues = this.getValues.bind(this);

    this.setup();
  }

  async setup() {
    this.monaco = await loader();

    this.createThemes();
    this.editors.html = this.createEditor('html');
    this.editors.main = this.createEditor('main');
    this.editors.renderer = this.createEditor('renderer');

    render(<Header />, document.getElementById('header'));
  }

  createThemes() {
    this.monaco.editor.defineTheme('main', mainTheme);
  }

  createEditor(id) {
    if (!this.monaco) throw new Error('Monaco not ready');

    const element = document.getElementById(`editor-${id}`);
    const language = id === 'html' ? 'html' : 'javascript';
    const value = getContent(id);

    const options = {
      language,
      theme: 'main',
      automaticLayout: true,
      minimap: {
        enabled: false
      },
      value
    };

    return this.monaco.editor.create(element, options);
  }

  getValues() {
    if (!this.editors.html || !this.editors.main || !this.editors.renderer) {
      throw new Error('Editors not ready');
    }

    return {
      html: this.editors.html!.getValue(),
      main: this.editors.main!.getValue(),
      renderer: this.editors.renderer!.getValue(),
      package: JSON.stringify({
        name: this.name,
        main: './main.js',
        version: '1.0.0'
      })
    }
  }
}

(window as any).electronFiddle = new App();