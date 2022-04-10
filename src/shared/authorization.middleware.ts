
import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { getRepository, ILike } from 'typeorm';

import { Settings } from '../entity/settings.entity'
import { redisClient } from '../config/redisClient';
import axios from 'axios';
@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
    constructor() { }

    async use(request: Request, res: Response, next: NextFunction) {

        if (!request.headers.authtoken || !request.headers.product_id || !request.headers.baseuserid || !request.headers.email || !request.headers.expected_privileges) {
            throw new HttpException('Action not allowed please check request headers', HttpStatus.FORBIDDEN);
        }

        let authTokenCachKey: string = request.headers.authtoken + '-' + request.headers.baseuserid;
        redisClient.get(authTokenCachKey, async (error, result) => {
            if (error || result === null) {
                const checkAuth = await this.checkAuthToken(request, redisClient);
                if (checkAuth && checkAuth.isError) {
                    res.status(401).send({
                        "code": checkAuth.error.status ? checkAuth.error.status : 401,
                        "method": request.method,
                        "message": checkAuth.error.message
                    })
                }

                if (checkAuth && !checkAuth.isError) {
                    request['authDetails'] = checkAuth.data;
                    next();
                }
            } else {
                let parseJSON = JSON.parse(result);
                const checkProductId = await this.compareAndCheck(request.headers.product_id, parseJSON.product_id);
                const checkAuth = await this.compareAndCheck(request.headers.authtoken, parseJSON.auth);
                const checkPrivileges = await this.comparePrivileges(request.headers.expected_privileges, parseJSON.privileges);
                if (checkProductId.isError || checkAuth.isError || checkPrivileges.isError) {
                    res.send({
                        "code": checkPrivileges.isError ? checkPrivileges.error.getStatus() : checkProductId.error.getStatus(),
                        "method": request.method,
                        "message": checkPrivileges.isError ? checkPrivileges.error.message : checkProductId.error.message,
                    })
                } else {
                    request['authDetails'] = parseJSON;
                    next();
                }
            }
        })
    }

    // CHECK THE TOKEN IS AUTHENTICATE
    async checkAuthToken(request: any, client) {
        try {
            const obj = { authToken: request.headers.authtoken }
            const checkAuth = await axios.post(process.env.AUTH_BASE_URL + 'login-base/token-resources/validate', obj).then(async res => {
                if(res.status === 200) {
                    if (res.data.valid) {
                        let userData = {
                            id: res.data.user.id,
                            email: res.data.user.email,
                            productRoles: res.data.user.productRoles,
                            organizationProductRoles: res.data.user.organizationProductRoles
                        }
    
                        const index = Object.keys(request.headers).indexOf("product_id");
                        let productData = await this.checkInDatabaseProductId(Object.keys(request.headers)[index], request.headers.product_id);
                        let privilegesList = await this.checkPrivileges(request.headers.expected_privileges, request.headers.product_id, userData);
                        let authTokenCachKey = request.headers.authtoken + '-' + userData.id;
    
                        let cachStoreObj = {
                            auth: request.headers.authtoken,
                            userDetails: userData,
                            product_id: productData.product_id,
                            privileges: privilegesList
                        }
    
                        await client.set(authTokenCachKey, JSON.stringify(cachStoreObj), 'EX', Number(productData.expire_time));
                        return { data: cachStoreObj, isError: false, error: null }
                    } else {
                        return { data: null, isError: true, error: { message: res.data.description } }
                    }
                }
            })
            return checkAuth;
        } catch (error) {
            return { data: null, isError: true, error: error }
        }

    }

    // CHECK THE PRODUCT ID FROM THE DATABASE AND STORE IT TO CACHE
    async checkInDatabaseProductId(productName: string, productValue: string) {
        let reqpayloadCheckProductId = {
            deleted: false,
            name: ILike(`%${productName}%`)
        }

        let reqpayloadCheckExpire = {
            deleted: false,
            name: 'PRIVILEGE_EXPIRY_TIME'
        }

        const checkSettings = await getRepository(Settings)
            .createQueryBuilder("Settings")
            .select(['Settings.name', 'Settings.description', 'Settings.settingstype', 'Settings.value'])
            .where(reqpayloadCheckProductId)
            .getOne()

        const checkPrivilegeExpire = await getRepository(Settings)
            .createQueryBuilder("Settings")
            .select(['Settings.name', 'Settings.description', 'Settings.settingstype', 'Settings.value'])
            .where(reqpayloadCheckExpire)
            .getOne()

        if (checkSettings.value === productValue) {
            return { product_id: productValue, expire_time: checkPrivilegeExpire.value };
        } else {
            throw new HttpException('Invalid product id', HttpStatus.UNAUTHORIZED);
        }
    }

    // CHECK THE USER PRIVILEGES
    async checkPrivileges(privileges: string, checkproduct_id: any, userDetails: any) {
        let pdata = JSON.parse(privileges);
        let hasOrganizationPrivileges = []
        let hasProductPrivileges = []
        let checkuserDetails = userDetails;
        // FIRST CHECK FOR THE ORGANIZATION PRIVILEGES
        let check = checkuserDetails.organizationProductRoles.filter((data) => {
            if (data.productBaseId === checkproduct_id) {
                return data
            }
        })
        if (check.length > 0 && check[0].privileges.length > 0) {
            pdata.map((value) => {
                if (check[0].privileges.includes(value)) {
                    hasOrganizationPrivileges.push(value)
                }
            })
        }
        if (hasOrganizationPrivileges.length > 0) {
            return hasOrganizationPrivileges
        } else {
            // IF ORGANIZATION PRIVILEGES NOT PRESENT CHECK FOR PRODUCT PRIVILIGES
            let checkProductRole = checkuserDetails.productRoles.filter((data) => {
                if (data.id === checkproduct_id) {
                    return data
                }
            })

            if (checkProductRole.length > 0 && checkProductRole[0].privileges.length > 0) {
                if (checkProductRole[0].privileges.includes('PAM')) {
                    pdata.map((value) => {
                        if (checkProductRole[0].privileges.includes(value)) {
                            hasProductPrivileges.push(value)
                        }
                    })
                } else {
                    throw new HttpException('Privileges PAM not found!', HttpStatus.SERVICE_UNAVAILABLE);
                }
            }
            if (hasProductPrivileges.length > 0) {
                return hasProductPrivileges;
            } else {
                throw new HttpException('You do not have privileges to access', HttpStatus.SERVICE_UNAVAILABLE);
            }

        }
    }

    // CAMPARE FROM THE REQUEST HEADER AND MAMCACHED
    async compareAndCheck(headerValue, chachedValue) {
        if (headerValue === chachedValue) {
            return { isError: false, error: null };
        } else {
            return { isError: true, error: new HttpException('Invalid headers', HttpStatus.UNAUTHORIZED) };
        }
    }

    // CAMPARE HEADER VALUES AND MAMCACHED VALUES
    async comparePrivileges(headerValue, chachedValue) {
        let pdata = JSON.parse(headerValue);
        let hasPrivileges = []

        pdata.map((value) => {
            if (chachedValue.includes(value)) {
                hasPrivileges.push(value)
            }
        })

        if (hasPrivileges.length <= 0) {
            return { isError: true, error: new HttpException('You do not have privileges to access', HttpStatus.SERVICE_UNAVAILABLE) };
        } else {
            return { isError: false, error: null };
        }
    }
}
