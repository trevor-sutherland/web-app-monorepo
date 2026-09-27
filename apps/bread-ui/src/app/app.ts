import { Component } from '@angular/core';
import { ConvertPage } from './convert/convert-page';

@Component({
  imports: [ConvertPage],
  selector: 'app-root',
  template: '<app-convert-page />',
})
export class App {}
