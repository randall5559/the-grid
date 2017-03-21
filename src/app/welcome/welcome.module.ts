import { NgModule } from '@angular/core';
import { HighlightModule } from '../shared/components/highlight/highlight.module';
import { WelcomeComponent } from './welcome.component';

@NgModule({
  imports: [HighlightModule],
  declarations: [WelcomeComponent],
  exports: [WelcomeComponent]
})
export class WelcomeModule { }
