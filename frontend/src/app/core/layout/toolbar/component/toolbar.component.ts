import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import {LanguageSwitcherComponent} from "../../../../language-switcher/components/language-switcher.component";

@Component({
  selector: 'app-toolbar',
  imports: [
    MatToolbar,
    LanguageSwitcherComponent,
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
}
