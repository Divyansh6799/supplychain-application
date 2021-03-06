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

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { DataService } from './data.service';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { CommodityComponent } from './Commodity/Commodity.component';
import { POComponent } from './PO/PO.component';

import { SupplierComponent } from './Supplier/Supplier.component';
import { ManufacturerComponent } from './Manufacturer/Manufacturer.component';
import { DistributorComponent } from './Distributor/Distributor.component';
import { RetailerComponent } from './Retailer/Retailer.component';
import { CustomerComponent } from './Customer/Customer.component';

import { InitiatePOComponent } from './InitiatePO/InitiatePO.component';
import { TransferCommodityComponent } from './TransferCommodity/TransferCommodity.component';

  @NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CommodityComponent,
    POComponent,
    SupplierComponent,
    ManufacturerComponent,
    DistributorComponent,
    RetailerComponent,
    CustomerComponent,
    InitiatePOComponent,
    TransferCommodityComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
