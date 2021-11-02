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
import { InitiatePOService } from './InitiatePO.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-initiatepo',
  templateUrl: './InitiatePO.component.html',
  styleUrls: ['./InitiatePO.component.css'],
  providers: [InitiatePOService]
})
export class InitiatePOComponent implements OnInit {

  myForm: FormGroup;

  private allTransactions;
  private Transaction;
  private currentId;
  private errorMessage;

  orderId = new FormControl('', Validators.required);
  itemList = new FormControl('', Validators.required);
  orderTotalPrice = new FormControl('', Validators.required);
  orderer = new FormControl('', Validators.required);
  vendor = new FormControl('', Validators.required);
  transactionId = new FormControl('', Validators.required);
  timestamp = new FormControl('', Validators.required);


  constructor(private serviceInitiatePO: InitiatePOService, fb: FormBuilder) {
    this.myForm = fb.group({
      orderId: this.orderId,
      itemList: this.itemList,
      orderTotalPrice: this.orderTotalPrice,
      orderer: this.orderer,
      vendor: this.vendor,
      transactionId: this.transactionId,
      timestamp: this.timestamp
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceInitiatePO.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(transaction => {
        tempList.push(transaction);
      });
      this.allTransactions = tempList;
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
   * @param {String} name - the name of the transaction field to update
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
   * only). This is used for checkboxes in the transaction updateDialog.
   * @param {String} name - the name of the transaction field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified transaction field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addTransaction(form: any): Promise<any> {
    this.Transaction = {
      $class: 'org.supplychain.network.InitiatePO',
      'orderId': this.orderId.value,
      'itemList': this.itemList.value,
      'orderTotalPrice': this.orderTotalPrice.value,
      'orderer': this.orderer.value,
      'vendor': this.vendor.value,
      'transactionId': this.transactionId.value,
      'timestamp': this.timestamp.value
    };

    this.myForm.setValue({
      'orderId': null,
      'itemList': null,
      'orderTotalPrice': null,
      'orderer': null,
      'vendor': null,
      'transactionId': null,
      'timestamp': null
    });

    return this.serviceInitiatePO.addTransaction(this.Transaction)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'orderId': null,
        'itemList': null,
        'orderTotalPrice': null,
        'orderer': null,
        'vendor': null,
        'transactionId': null,
        'timestamp': null
      });
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
        this.errorMessage = error;
      }
    });
  }

  updateTransaction(form: any): Promise<any> {
    this.Transaction = {
      $class: 'org.supplychain.network.InitiatePO',
      'orderId': this.orderId.value,
      'itemList': this.itemList.value,
      'orderTotalPrice': this.orderTotalPrice.value,
      'orderer': this.orderer.value,
      'vendor': this.vendor.value,
      'timestamp': this.timestamp.value
    };

    return this.serviceInitiatePO.updateTransaction(form.get('transactionId').value, this.Transaction)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
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

  deleteTransaction(): Promise<any> {

    return this.serviceInitiatePO.deleteTransaction(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
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

    return this.serviceInitiatePO.getTransaction(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'orderId': null,
        'itemList': null,
        'orderTotalPrice': null,
        'orderer': null,
        'vendor': null,
        'transactionId': null,
        'timestamp': null
      };

      if (result.orderId) {
        formObject.orderId = result.orderId;
      } else {
        formObject.orderId = null;
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

      if (result.transactionId) {
        formObject.transactionId = result.transactionId;
      } else {
        formObject.transactionId = null;
      }

      if (result.timestamp) {
        formObject.timestamp = result.timestamp;
      } else {
        formObject.timestamp = null;
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
      'orderId': null,
      'itemList': null,
      'orderTotalPrice': null,
      'orderer': null,
      'vendor': null,
      'transactionId': null,
      'timestamp': null
    });
  }
}
