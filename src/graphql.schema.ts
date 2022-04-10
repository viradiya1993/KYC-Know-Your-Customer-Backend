
/*
 * ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class AdminBillingDetails {
    pk: string;
}

export abstract class IQuery {
    abstract getCustomerDetails(): AdminBillingDetails[] | Promise<AdminBillingDetails[]>;

    abstract getBandAndCustomerDetails(): AdminBillingDetails[] | Promise<AdminBillingDetails[]>;

    abstract saveBandDetails(): AdminBillingDetails[] | Promise<AdminBillingDetails[]>;

    abstract getBillingCards(): BillingCardsDetails[] | Promise<BillingCardsDetails[]>;

    abstract getCustomerBillingDetails(): CUstomerBillingDetails[] | Promise<CUstomerBillingDetails[]>;

    abstract getWrapperService(): CUstomerBillingDetails[] | Promise<CUstomerBillingDetails[]>;

    abstract findAllBulkVerifications(): BulkVerification[] | Promise<BulkVerification[]>;

    abstract findAllBulkWiseTransactions(): BulkVerification[] | Promise<BulkVerification[]>;

    abstract findAllBulktransactionStatistics(): BulkVerification[] | Promise<BulkVerification[]>;

    abstract getAllBulkWrapperService(): BulkVerification[] | Promise<BulkVerification[]>;

    abstract verifyBulkUpload(): BulkVerification[] | Promise<BulkVerification[]>;

    abstract createDashboardCards(): Dashboard[] | Promise<Dashboard[]>;

    abstract filterBarCard(): BarCard[] | Promise<BarCard[]>;

    abstract checkUserAction(): Dashboard[] | Promise<Dashboard[]>;

    abstract getAllTransactionHistory(): Transactions[] | Promise<Transactions[]>;

    abstract getAllWrapperService(): Transactions[] | Promise<Transactions[]>;

    abstract signUp(): User[] | Promise<User[]>;

    abstract userDetails(): User[] | Promise<User[]>;

    abstract updateUser(): User[] | Promise<User[]>;

    abstract updateClient(): User[] | Promise<User[]>;

    abstract updateTourDismiss(): User[] | Promise<User[]>;

    abstract findAllWrapper(): Wrapper[] | Promise<Wrapper[]>;

    abstract getAllVerificationService(): VerificationService[] | Promise<VerificationService[]>;

    abstract updateClietKeyLiveTest(): Wrapper[] | Promise<Wrapper[]>;

    abstract createWallet(): Wrapper[] | Promise<Wrapper[]>;

    abstract walletDetails(): Wrapper[] | Promise<Wrapper[]>;
}

export class BillingCardsDetails {
    userid: string;
}

export class CUstomerBillingDetails {
    userid: string;
    serviceName: string;
    wrapperId: string;
    verified_service_provider_id: string;
}

export class BulkVerification {
    pk: string;
}

export class Dashboard {
    baseuserid: string;
    dashboardRequest: string;
}

export class BarCard {
    baseuserid: string;
    dashboardRequest: string;
}

export class Transactions {
    pk: string;
}

export class User {
    id?: string;
}

export class Wrapper {
    description: string;
    name: string;
    clientkeys: Wrapper[];
    WrapperServiceProviders: Wrapper[];
}

export class VerificationService {
    Id: string;
    name: string;
}
