import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.supplychain.network{
   export class Trace {
      timestamp: Date;
      location: Address;
      company: Trader;
   }
   export class Commodity extends Asset {
      commodityid: string;
      name: string;
      description: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
      trace: Trace[];
      purchaseOrder: PO;
      owner: Trader;
      issuer: Trader;
   }
   export class PO extends Asset {
      orderid: string;
      itemList: Commodity[];
      orderTotalPrice: number;
      orderStatus: OrderStatus;
      orderer: Trader;
      vendor: Trader;
   }
   export enum OrderStatus {
      INITIATED,
      CONFIRMED,
      DELIVERING,
      DELIVERED,
   }
   export class Address {
      longtitude: number;
      latitude: number;
      city: string;
      country: string;
      locality: string;
      region: string;
      street: string;
      postalCode: string;
      postOfficeBoxNumber: string;
   }
   export abstract class Trader extends Participant {
      companyName: string;
      address: Address;
   }
   export class Supplier extends Trader {
      tradeId: string;
   }
   export class Manufacturer extends Trader {
      tradeId: string;
   }
   export class Distributor extends Trader {
      tradeId: string;
   }
   export class Retailer extends Trader {
      tradeId: string;
   }
   export class Customer extends Trader {
      tradeId: string;
   }
   export class InitiatePO extends Transaction {
      orderId: string;
      itemList: Commodity[];
      orderTotalPrice: number;
      orderer: Trader;
      vendor: Trader;
   }
   export class TransferCommodity extends Transaction {
      commodity: Commodity;
      issuer: Trader;
      newOwner: Trader;
      purchaseOrder: PO;
      shipperLocation: Address;
   }
// }
