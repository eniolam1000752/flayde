import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ButtonComponent } from "./button/button.component";

import { TestServiceService } from "./test-service.service";
import { ToastComponent } from "./toast/toast.component";
import { InputFieldComponent } from "./input-field/input-field.component";
import { NavHeaderComponent } from "./nav-header/nav-header.component";
import { TestDirectiveDirective } from "./test-directive.directive";
import { LayoutComponent } from './layout/layout.component';
import { CardComponent } from './card/card.component';
import { LoaderComponent } from './loader/loader.component';
import { ListComponent } from './list/list.component';
import { ModalComponent } from './modal/modal.component';
import { RendrerComponent } from './rendrer/rendrer.component';
import { TopToastComponent } from './top-toast/top-toast.component';
import { SplashComponent } from './splash/splash.component';
import { HelpScreenComponent } from './help-screen/help-screen.component';

@NgModule({
  declarations: [
    AppComponent,
    ButtonComponent,
    ToastComponent,
    InputFieldComponent,
    NavHeaderComponent,
    TestDirectiveDirective,
    LayoutComponent,
    CardComponent,
    LoaderComponent,
    ListComponent,
    ModalComponent,
    RendrerComponent,
    TopToastComponent,
    SplashComponent,
    HelpScreenComponent
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [TestServiceService],
  bootstrap: [AppComponent]
})
export class AppModule {}
