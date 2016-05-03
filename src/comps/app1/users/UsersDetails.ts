import {Component, Input, ChangeDetectionStrategy, ViewChild} from 'angular2/core'
import {List, Map} from 'immutable';
import {BusinessModel} from "../../../business/BusinessModel";
import {OrderBy} from "../../../pipes/OrderBy";
import {SIMPLEGRID_DIRECTIVES, ISimpleGridEdit} from "../../simplegrid/SimpleGrid";
import {AppStore} from "angular2-redux-util/dist/index";
import {BusinessAction} from "../../../business/BusinessAction";
import {UserInfo} from "./UserInfo";
import {BusinessUser} from "../../../business/BusinessUser";
import {SimpleGridTable} from "../../simplegrid/SimpleGridTable";
import {ISimpleListItem} from "../../simplelist/Simplelist";
import {AddUser} from "./AddUser";
import {ChangePass} from "./ChangePass";
import {SimpleGridRecord} from "../../simplegrid/SimpleGridRecord";
import {Lib} from "../../../Lib";
import {PrivelegesModel} from "../../../reseller/PrivelegesModel";
import {MODAL_DIRECTIVES, ModalResult} from "../../ng2-bs3-modal/ng2-bs3-modal";
let _ = require('underscore');
const bootbox = require('bootbox');

@Component({
    selector: 'UsersDetails',
    changeDetection: ChangeDetectionStrategy.OnPush,
    directives: [SIMPLEGRID_DIRECTIVES, UserInfo, AddUser, ChangePass, MODAL_DIRECTIVES],
    pipes: [OrderBy],
    styleUrls: ['../comps/app1/users/UsersDetails.css'],
    templateUrl: '/src/comps/app1/users/UsersDetails.html'
})

export class UsersDetails {

    constructor(private appStore:AppStore, private businessActions:BusinessAction) {
    }

    @ViewChild(SimpleGridTable)
    simpleGridTable:SimpleGridTable

    // @ViewChild('modalAddUser')
    // modalAddUser:ModalComponent

    @Input()
    showUserInfo:ISimpleListItem = null;

    @Input()
    set businesses(i_businesses) {
        this.m_businesses = i_businesses;
        if (i_businesses && this.simpleGridTable && this.m_businesses.size != this.totalBusinessSelected) {
            this.simpleGridTable.deselect();
            this.totalBusinessSelected = this.m_businesses.size;
        }
    }

    @Input()
    set priveleges(i_priveleges) {
        this.m_priveleges = i_priveleges;
    }

    public sort:{field:string, desc:boolean} = {field: null, desc: false};
    private m_businesses:List<BusinessModel>;
    private m_priveleges:Array<PrivelegesModel>;
    private totalBusinessSelected:number = 0;

    private launchStudio() {
        let businessUser:BusinessUser = this.selectedBusinessUser();
        let businessId = businessUser.getBusinessId();
        let businesses:List<BusinessModel> = this.appStore.getState().business.getIn(['businesses']);
        let index = this.businessActions.findBusinessIndexById(businessId, businesses);
        let businessModel:BusinessModel = this.appStore.getState().business.getIn(['businesses']).get(index);
        var user = businessUser.getName()
        var pass = businessUser.getPassword()
        alert('Feature will be supported soon...');
        // if (businessModel.getKey('studioLite') == '0') {
        //     window.open(`http://galaxy.mediasignage.com/WebService/signagestudio.aspx?user=${user}&pass=${pass}&local=en_US`, '_blank');
        // } else {
        //     window.open('https://secure.digitalsignage.com/_studiolite-dist/studiolite.html', '_blank');
        // }
    }

    private onModalClose(result:ModalResult) {
    }

    private removeBusinessUser() {
        var businessUser:BusinessUser = this.selectedBusinessUser();
        bootbox.confirm(`Are you sure you want to remove the user ${businessUser.getName()}?`, (result) => {
            if (result) {
                this.appStore.dispatch(this.businessActions.removeBusinessUser(businessUser));
            }
        });
    }

    private getBusinessIdSelected():number {
        if (!this.m_businesses || this.m_businesses.size == 0)
            return -1;
        return this.m_businesses.first().getBusinessId();
    }

    private onLabelEdited(event:ISimpleGridEdit, field) {
        var newValue = event.value;
        var businessUser:BusinessUser = event.item as BusinessUser;
        var oldValue = businessUser.getKey('name');
        var businessId = businessUser.getBusinessId();
        this.appStore.dispatch(this.businessActions.setBusinessUserName(businessId, field, {newValue, oldValue}));
    }

    private selectedBusinessUser():BusinessUser {
        if (!this.simpleGridTable)
            return null;
        let selected:SimpleGridRecord = this.simpleGridTable.getSelected();
        return selected ? this.simpleGridTable.getSelected().item : '';
    }

    private setPriveleges(event) {
        let privilegeId = -1;
        let privelegesName:string = event.value;
        var businessUser:BusinessUser = event.item as BusinessUser;
        var businessId = businessUser.getBusinessId();
        var name = businessUser.getName();
        var accessMask = businessUser.getAccessMask();
        var privileges:Array<PrivelegesModel> = this.appStore.getState().reseller.getIn(['privileges']);
        privileges.forEach((privelegesModel:PrivelegesModel)=> {
            if (privelegesModel.getName() == privelegesName) {
                privilegeId = privelegesModel.getPrivelegesId();
            }
        })
        this.appStore.dispatch(this.businessActions.updateBusinessUserAccess(businessId, name, accessMask, privilegeId));
    }

    private selectedPriveleges() {
        return (privelegesModel:PrivelegesModel, businessUser:BusinessUser) => {
            return businessUser.privilegeId() == privelegesModel.getPrivelegesId() ? 'selected' : '';
        }
    }

    private setAccessMask(event) {
        var businessUser:BusinessUser = event.item as BusinessUser;
        var businessId = businessUser.getBusinessId();
        var name = businessUser.getName();
        var privilegeId = businessUser.privilegeId();
        var accessMask = event.value;
        var computedAccessMask = Lib.ComputeAccessMask(accessMask);
        this.appStore.dispatch(this.businessActions.updateBusinessUserAccess(businessId, name, computedAccessMask, privilegeId));
    }

    private getAccessMask(businessUser:BusinessUser) {
        var accessMask = businessUser.getAccessMask();
        return Lib.GetAccessMask(accessMask);
    }
}