/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { POService } from './PO.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-po',
  templateUrl: './PO.component.html',
  styleUrls: ['./PO.component.css'],
  providers: [POService]
})
export class POComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  orderid = new FormControl('', Validators.required);
  itemList = new FormControl('', Validators.required);
  orderTotalPrice = new FormControl('', Validators.required);
  orderStatus = new FormControl('', Validators.required);
  orderer = new FormControl('', Validators.required);
  vendor = new FormControl('', Validators.required);

  constructor(public servicePO: POService, fb: FormBuilder) {
    this.myForm = fb.group({
      orderid: this.orderid,
      itemList: this.itemList,
      orderTotalPrice: this.orderTotalPrice,
      orderStatus: this.orderStatus,
      orderer: this.orderer,
      vendor: this.vendor
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.servicePO.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.supplychain.network.PO',
      'orderid': this.orderid.value,
      'itemList': this.itemList.value,
      'orderTotalPrice': this.orderTotalPrice.value,
      'orderStatus': this.orderStatus.value,
      'orderer': this.orderer.value,
      'vendor': this.vendor.value
    };

    this.myForm.setValue({
      'orderid': null,
      'itemList': null,
      'orderTotalPrice': null,
      'orderStatus': null,
      'orderer': null,
      'vendor': null
    });

    return this.servicePO.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'orderid': null,
        'itemList': null,
        'orderTotalPrice': null,
        'orderStatus': null,
        'orderer': null,
        'vendor': null
      });
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });
  }


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.supplychain.network.PO',
      'itemList': this.itemList.value,
      'orderTotalPrice': this.orderTotalPrice.value,
      'orderStatus': this.orderStatus.value,
      'orderer': this.orderer.value,
      'vendor': this.vendor.value
    };

    return this.servicePO.updateAsset(form.get('orderid').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteAsset(): Promise<any> {

    return this.servicePO.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.servicePO.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'orderid': null,
        'itemList': null,
        'orderTotalPrice': null,
        'orderStatus': null,
        'orderer': null,
        'vendor': null
      };

      if (result.orderid) {
        formObject.orderid = result.orderid;
      } else {
        formObject.orderid = null;
      }

      if (result.itemList) {
        formObject.itemList = result.itemList;
      } else {
        formObject.itemList = null;
      }

      if (result.orderTotalPrice) {
        formObject.orderTotalPrice = result.orderTotalPrice;
      } else {
        formObject.orderTotalPrice = null;
      }

      if (result.orderStatus) {
        formObject.orderStatus = result.orderStatus;
      } else {
        formObject.orderStatus = null;
      }

      if (result.orderer) {
        formObject.orderer = result.orderer;
      } else {
        formObject.orderer = null;
      }

      if (result.vendor) {
        formObject.vendor = result.vendor;
      } else {
        formObject.vendor = null;
      }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  resetForm(): void {
    this.myForm.setValue({
      'orderid': null,
      'itemList': null,
      'orderTotalPrice': null,
      'orderStatus': null,
      'orderer': null,
      'vendor': null
      });
  }

}
