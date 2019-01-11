import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgZorroAntdModule } from 'ng-zorro-antd';

import { HomePage } from './home.page';
import { RulesButton } from './rules/rules.button';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ]),
    NgZorroAntdModule
  ],
  declarations: [ HomePage, RulesButton ]
})
export class HomePageModule {}
