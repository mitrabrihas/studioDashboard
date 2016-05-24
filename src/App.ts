//import jQuery from 'jquery';
import "zone.js/dist/zone";
import "zone.js/dist/long-stack-trace-zone";
import "reflect-metadata";
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, Router, RouterLink} from "@angular/router-deprecated";
import {bootstrap} from "@angular/platform-browser-dynamic";
import {Component, provide, ViewEncapsulation, PLATFORM_PIPES, ComponentRef} from "@angular/core";
import * as platform from "platform";
import "jspm_packages/github/twbs/bootstrap@3.3.6";
import "twbs/bootstrap/dist/css/bootstrap.css!";
import "./styles/style.css!";
import {StyleService} from "./styles/StyleService";
import {appInjService} from "./services/AppInjService";
import {LocalStorage} from "./services/LocalStorage";
import {AuthService} from "./services/AuthService";
import {StoreService} from "./services/StoreService";
import {BusinessAction} from "./business/BusinessAction";
import {ResellerAction} from "./reseller/ResellerAction";
import {OrdersAction} from "./orders/OrdersAction";
import {orders} from "./orders/OrdersReducer";
import {StationsAction} from "./stations/StationsAction";
import {CharCount} from "./pipes/CharCount";
import {HTTP_PROVIDERS} from "@angular/http";
import {App1} from "../src/comps/app1/App1";
import {EntryPanel} from "../src/comps/entry/EntryPanel";
import {AppManager} from "../src/comps/appmanager/AppManager";
import {CommBroker} from "../src/services/CommBroker";
import {Filemenu} from "../src/comps/filemenu/Filemenu";
import {FilemenuItem} from "../src/comps/filemenu/FilemenuItem";
import {Logo} from "./comps/logo/Logo";
import {Footer} from "./comps/footer/Footer";
import {Consts} from "../src/Conts";
import {LocationStrategy, HashLocationStrategy} from "@angular/common";
import {AppStore} from "angular2-redux-util";
import {Lib} from "./Lib";
import {Observable} from "rxjs/Observable";
import {CreditService} from "./services/CreditService";
import "rxjs/add/operator/map";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/observable/fromEvent";
import "rxjs/add/observable/forkJoin";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/finally";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/retry";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/merge";
import "rxjs/add/operator/do";
import notify from "./appdb/NotifyReducer";
import appdb from "./appdb/AppdbReducer";
import {business} from "./business/BusinessReducer";
import {reseller} from "./reseller/ResellerReducer";
import {stations} from "./stations/StationsReducer";
import {AppdbAction} from "./appdb/AppdbAction";
import {LogoCompany} from "./comps/logo/LogoCompany";
export enum ServerMode {
    CLOUD,
    PRIVATE,
    HYBRID
}

/**
 Main application bootstrap
 @class App
 **/
@Component({
    selector: 'app',
    encapsulation: ViewEncapsulation.Emulated,
    providers: [StyleService, AppdbAction],
    templateUrl: '/src/App.html',
    directives: [ROUTER_DIRECTIVES, RouterLink, Filemenu, FilemenuItem, Logo, LogoCompany, Footer]
})
@RouteConfig([
    {path: "/", name: "root", redirectTo: ["/EntryPanelNoId/Login"], useAsDefault: true},
    {path: '/AppManager', component: AppManager, as: 'AppManager'},
    {path: '/EntryPanelNoId/...', component: EntryPanel, as: 'EntryPanelNoId'},
    {path: '/EntryPanel/:id/...', component: EntryPanel, as: 'EntryPanel'},
    {path: '/Login/...', component: EntryPanel, as: 'Login'},
    {path: '/ForgotPass/...', component: EntryPanel, as: 'ForgotPass'},
    {path: '/App1/...', component: App1, as: 'App1'},
])
export class App {
    private m_styleService:StyleService;

    constructor() {
    // constructor(private localStorage:LocalStorage, private appStore:AppStore, private commBroker:CommBroker, styleService:StyleService, private appdbAction:AppdbAction, private router:Router) {
        // // force logout
        // // this.localStorage.removeItem('remember_me')
        // // todo: add logic to as when on each env
        // // 0 = cloud, 1 = private 2 = hybrid
        // this.checkPlatform();
        // this.commBroker.setValue(Consts.Values().SERVER_MODE, ServerMode.CLOUD);
        // this.m_styleService = styleService;
        // this.commBroker.setService(Consts.Services().App, this);
        // Observable.fromEvent(window, 'resize').debounceTime(250).subscribe(()=> {
        //     this.appResized();
        // });
        // router.subscribe(function (currentRoute) {
        //     console.log(currentRoute);
        // });
    }
    private version = '1.355 beta';

    private checkPlatform(){
        switch (platform.name.toLowerCase()) {
            case 'microsoft edge':
            {
                alert(`${platform.name} browser not supported at this time, please use Google Chrome`);
                break;
            }
            case 'chrome':
            {
                break;
            }
            default:
            {
                alert('for best performance please use Google Chrome');
                break;
            }
        }
    }

    public appResized():void {
        // var appHeight = document.body.clientHeight;
        // var appWidth = document.body.clientWidth;
        // this.commBroker.setValue(Consts.Values().APP_SIZE, {height: appHeight, width: appWidth});
        // this.commBroker.fire({
        //     fromInstance: self,
        //     event: Consts.Events().WIN_SIZED,
        //     context: '',
        //     message: {height: appHeight, width: appWidth}
        // })
    }
}


//bootstrap(App, [ROUTER_PROVIDERS, HTTP_PROVIDERS,
bootstrap(App, [HTTP_PROVIDERS, ROUTER_PROVIDERS, Router,
    provide(AppStore, {useFactory: Lib.StoreFactory({notify, appdb, business, stations, reseller, orders})}),
    provide(StoreService, {useClass: StoreService}),
    provide(BusinessAction, {useClass: BusinessAction}),
    provide(ResellerAction, {useClass: ResellerAction}),
    provide(OrdersAction, {useClass: OrdersAction}),
    provide(StationsAction, {useClass: StationsAction}),
    provide(AppdbAction, {useClass: AppdbAction}),
    provide(CreditService, {useClass: CreditService}),
    provide(AuthService, {useClass: AuthService}),
    provide(LocalStorage, {useClass: LocalStorage}),
    provide(CommBroker, {useClass: CommBroker}),
    provide(Consts, {useClass: Consts}),
    provide("DEV_ENV", {useValue: Lib.DevMode()}),
    provide(PLATFORM_PIPES, {useValue: CharCount, multi: true}),
    provide(LocationStrategy, {useClass: HashLocationStrategy})]).then((appRef:ComponentRef<any>) => {
        appInjService(appRef.injector);
    }
);
// window['hr'] && window['hr'].on('change', (fileName) => {
//     if (fileName.indexOf('html') !== -1) {
//         var newBody = document.createElement('body')
//         newBody.appendChild(document.createElement('app'))
//         document.body = newBody;
//         bootstrap(App, [ROUTER_PROVIDERS, HTTP_PROVIDERS,
//             provide(AppStore, {useFactory: Lib.StoreFactory({notify, appdb, business, stations, reseller, orders})}),
//             provide(StoreService, {useClass: StoreService}),
//             provide(BusinessAction, {useClass: BusinessAction}),
//             provide(ResellerAction, {useClass: ResellerAction}),
//             provide(OrdersAction, {useClass: OrdersAction}),
//             provide(StationsAction, {useClass: StationsAction}),
//             provide(AppdbAction, {useClass: AppdbAction}),
//             provide(CreditService, {useClass: CreditService}),
//             provide(AuthService, {useClass: AuthService}),
//             provide(LocalStorage, {useClass: LocalStorage}),
//             provide(CommBroker, {useClass: CommBroker}),
//             provide(Consts, {useClass: Consts}),
//             provide("DEV_ENV", {useValue: Lib.DevMode()}),
//             provide(PLATFORM_PIPES, {useValue: CharCount, multi: true}),
//             provide(LocationStrategy, {useClass: HashLocationStrategy})]).then((appRef:ComponentRef<any>) => {
//                 appInjService(appRef.injector);
//             }
//         );
//     }
// })
