import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, getConnectionManager } from 'typeorm';
import * as AWS from 'aws-sdk';

import { User } from '../entity/user.entity';
import { Client } from '../entity/client.entity';
import { ClientProfile } from '../entity/clientProfile.entity';
import { ClientUser } from '../entity/clientUser.entity';
import { Languagepack } from '../entity/languagepack.entity';
import { UserType } from '../entity/userType.entity';
import { Settings } from '../entity/settings.entity';

import { UserDto } from './dto/user.dto';
import { UserDetailDto } from './dto/userDetails.dto';
import { ClientDetailDto } from './dto/clientDetails.dto';

import { redisClient } from '../config/redisClient';
import { tourDismissDto } from './dto/tourDismiss.dto';
import axios from 'axios';
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Client)
        private readonly clientRepository: Repository<Client>,
        @InjectRepository(ClientUser)
        private readonly clientUserRepository: Repository<ClientUser>
    ) { }

    async signUp(signUpdata: UserDto) {
        console.log('signup request payload', signUpdata)
        const connection = getConnectionManager().get();
        let owner = false;
        let generateNewId = Math.floor(Date.now());
        if (signUpdata.superadmin)
            owner = signUpdata.superadmin

        //This will check if user already exist?
        const isUserExist = await connection.getRepository(User)
            .count({ email: signUpdata.individualDetails.email })

        if (isUserExist > 0)
            throw new HttpException('User already exists', HttpStatus.OK);

        //This will check if RCNumber already exist?
        if (signUpdata.organizationDetails && signUpdata.organizationDetails.rcNumber) {
            const isRCNumberExist = await connection.getRepository(ClientProfile)
                .count({ rcnumber: signUpdata.organizationDetails.rcNumber })

            if (isRCNumberExist > 0)
                throw new HttpException('RCNumber already exists', HttpStatus.OK);
        }

        //Check client exist
        let isClientExist;
        let organizationId;
        if(signUpdata.userType == 'ORGANIZATION'){
            isClientExist = await getRepository(Client)
            .createQueryBuilder("client")
            .where('client.organizationbaseid =' + `'${signUpdata.organizationBaseId}'`)
            .getMany()

            organizationId = signUpdata.organizationBaseId;
        }
        else if(signUpdata.userType == 'INDIVIDUAL'){
            isClientExist = await getRepository(Client)
            .createQueryBuilder("client")
            .where('client.organizationbaseid =' + `'${signUpdata.individualDetails.orgId}'`)
            .getMany()

            organizationId = signUpdata.individualDetails.orgId;
        }

        if(signUpdata.userType == 'INDIVIDUAL' && isClientExist.length <= 0){
            throw new HttpException('We were unable to create the user successfully. Contact support with CODE: 101 for resolution', HttpStatus.OK);
        }

        //This will check if userId already exist?
        const isUserIdExist = await connection.getRepository(User)
            .count({ userid: generateNewId.toString() })

        if (isUserIdExist > 0)
            generateNewId = Math.floor(Date.now())

        //This will fetch languagepack and usertype using the lang code and user code name.
        let languageSettings = await connection.getRepository(Settings).findOne({ name: 'LANGUAGE_CODE' });
        let userTypeSettings = await connection.getRepository(Settings).findOne({ name: 'USER_TYPE_CODE' });

        //This will fetch languagepack and usertype using the lang code and user code.
        let languagepack = await connection.getRepository(Languagepack).findOne({ code: languageSettings.value });
        let userType = await connection.getRepository(UserType).findOne({ usertype_code: userTypeSettings.value });

        //Check user exist
        let isBaseUserIdExist = await getRepository(User)
        .createQueryBuilder("user")
        .where('user.base_user_id =' + `'${signUpdata.userBaseId}'`)
        .getMany()

        let createUser;
        let User_PK;
        if(isBaseUserIdExist.length <= 0){
            //Create User
             createUser = await connection.getRepository(User)
            .insert({
                type: signUpdata.userType, deleted: false, createdBy: 0, is_deactivated: false,
                email: signUpdata.individualDetails.email, firstName: signUpdata.individualDetails.firstName,
                phoneno: signUpdata.individualDetails.phoneNumber, reset_password_on_login: false,
                surname: signUpdata.individualDetails.lastName, userid: generateNewId.toString(),
                owner: owner, lang_pack_fk: languagepack.pk, type_fk: userType.pk,
                base_user_id: signUpdata.userBaseId
            })

            User_PK = createUser.identifiers[0].pk;
        }
        else
        {
            //Update User
            await connection.getRepository(User).update({ base_user_id: signUpdata.userBaseId }, {
                type: signUpdata.userType,
                email: signUpdata.individualDetails.email, firstName: signUpdata.individualDetails.firstName,
                phoneno: signUpdata.individualDetails.phoneNumber,
                surname: signUpdata.individualDetails.lastName,
                owner: owner
            });

            User_PK = isBaseUserIdExist[0].pk;
        }
        

        //If client not exist then create
        if (isClientExist.length <= 0){
            //Create Client
            let createClient = await connection.getRepository(Client)
            .insert({
                deleted: false, createdBy: 0,
                activationStatus: signUpdata.organizationDetails?.activation_status,
                dateActivated: signUpdata.organizationDetails?.date_activated,
                logo: signUpdata.organizationDetails?.logo,
                name: signUpdata.organizationDetails?.name || '',
                organizationbaseid: organizationId
            })

            //Create Client Profile
            await connection.getRepository(ClientProfile)
                .insert({
                    deleted: false, createdBy: 0, address: signUpdata.organizationDetails?.address,
                    city: signUpdata.organizationDetails?.city, country: signUpdata.organizationDetails?.country,
                    state: signUpdata.organizationDetails?.state, postalCode: signUpdata.organizationDetails?.postalCode,
                    website: signUpdata.organizationDetails?.website, partner: signUpdata.organizationDetails?.partner,
                    email: signUpdata.organizationDetails?.email, industry: signUpdata.organizationDetails?.industry,
                    phone: signUpdata.organizationDetails?.phoneNumber, rcnumber: signUpdata.organizationDetails?.rcNumber,
                    yearOfRegistration: signUpdata.organizationDetails?.dateOfRegistration,
                    yearfounded: signUpdata.organizationDetails?.yearfounded,
                    zip: signUpdata.organizationDetails?.zip, clientPk: createClient.identifiers[0].pk
                })

            //Create Client_User
            await connection.getRepository(ClientUser).insert({ pk: User_PK, clientFk: createClient.identifiers[0].pk })

        }
        else
        {
            if(signUpdata.userType == 'ORGANIZATION'){
                 //Update Client
                await connection.getRepository(Client).update({ organizationbaseid: organizationId }, {
                    activationStatus: signUpdata.organizationDetails?.activation_status,
                    dateActivated: signUpdata.organizationDetails?.date_activated,
                    logo: signUpdata.organizationDetails?.logo,
                    name: signUpdata.organizationDetails?.name || ''
                });

                //Update Client Profile
                await connection.getRepository(ClientProfile).update({ clientPk: isClientExist[0].pk }, {
                     address: signUpdata.organizationDetails?.address,
                        city: signUpdata.organizationDetails?.city, country: signUpdata.organizationDetails?.country,
                        state: signUpdata.organizationDetails?.state, postalCode: signUpdata.organizationDetails?.postalCode,
                        website: signUpdata.organizationDetails?.website,
                        email: signUpdata.organizationDetails?.email, industry: signUpdata.organizationDetails?.industry,
                        phone: signUpdata.organizationDetails?.phoneNumber,
                        yearOfRegistration: signUpdata.organizationDetails?.dateOfRegistration,
                        yearfounded: signUpdata.organizationDetails?.yearfounded,
                        zip: signUpdata.organizationDetails?.zip
                });
            }
            
            //Create Client_User
            await connection.getRepository(ClientUser).insert({ pk: User_PK, clientFk: isClientExist[0].pk})
        }

        //Return inserted user details.
        let userResult = await connection.getRepository(User).findOne({ pk: User_PK });

        // Send emails
        this.sendEmail(signUpdata.individualDetails.firstName, signUpdata.individualDetails.lastName, signUpdata.organizationDetails?.name || null);
        return userResult;
    }

    sendEmail = async (firstName, surname, companyName) => {
        try {
            const qb0 = await getRepository(Settings)
                .createQueryBuilder("setting")
                .select(["setting.name", "setting.value"])
                .where("setting.name IN (:...name)", {
                    name: [
                        "TATVA S3 ACCESS KEY",
                        "TATVA S3 SECRET KEY",
                        "SIGN_UP_RECIPIENT_LIST",
                        "EMAIL_SENDER",
                        "SIGNUP_EMAIL_SUBJECT",
                        "EMAIL_API_BASE_URL",
                        "SIGN_UP_RECIPIENT"
                    ]
                })
                .getMany();

            const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
            const s3 = new AWS.S3();
            //This will update data in AWS config.
            AWS.config.update({
                accessKeyId: qb0[0].value,
                secretAccessKey: qb0[1].value,
                region: process.env.REGION
            });

            const requestFile = await s3.getObject({ Bucket: BUCKET_NAME, Key: process.env.EMAIL_TEMPLATE_FOLDERE_NAME + "signup.notificaton.ftl" }).promise()
            let requestData = requestFile.Body.toString('utf-8')
            let recipientsAddressList = qb0[4].value.split(',');
            let stringReplaceValue = [
                {
                    key: '${firstName}',
                    value: firstName
                },
                {
                    key: '${surname}',
                    value: surname
                },
                {
                    key: '${companyName}',
                    value: companyName
                }
            ]

            for (let srtValue of stringReplaceValue) {
                requestData = requestData.replace(srtValue.key, srtValue.value);
            }

            const obj = {
                "message": requestData,
                "recipientAddress": qb0[6].value,
                "recipientsAddressList": recipientsAddressList,
                "senderAddress": qb0[5].value,
                "senderName": "seamfix",
                "subject": qb0[2].value
            }
            axios.post(qb0[3].value + '/message/send-email', obj).then((res) => {
                // console.log(res)
            }).catch((error) => {
                console.log(error)
            })
        } catch (error) {
            console.log(error)
        }

    }

    async logout(cacheKey: string) {
        redisClient.get(cacheKey, async (error, result) => {
            if (result) {
                redisClient.del(cacheKey);
            }
        })
        return true;
    }

    async userDetails(data: Partial<UserDetailDto>) {
        const connection = getConnectionManager().get();
        const qb0 = await getRepository(User)
            .createQueryBuilder("user")
            .innerJoin('user.clientUsers', 'clientUsers', 'user.pk = clientUsers.pk')
            .innerJoin('clientUsers.client', 'client', 'client.pk = clientUsers.clientFk')
            .select(["user.userid as userid", "user.email_consent as email_consent", "user.promotion_consent as promotion_consent", "is_dismissed_tour as is_dismissed_tour"])
            .where('user.base_user_id =' + `'${data.baseuserid}'`)

        const userDetails = await qb0.getRawOne();

        let sessionTime = await connection.getRepository(Settings).findOne({ name: 'IDLE_TIMEOUT_SECONDS' });
        let sessionInterval = await connection.getRepository(Settings).findOne({ name: 'SESSION_INTERVAL' });

        return {
            userid: userDetails.userid,
            email_consent: userDetails.email_consent,
            promotion_consent: userDetails.promotion_consent,
            is_dismissed_tour: userDetails.is_dismissed_tour,
            sessionTimeout: sessionTime.value,
            sessionInterval: sessionInterval.value
        }
    }

    async updatedUser(data: Partial<UserDetailDto>) {
        // UPDATE THE USER DETAILS
        const connection = getConnectionManager().get();
        const userDetails = await connection.getRepository(User).findOne({ base_user_id: data.baseuserid });
        let emailConsentDate = null;
        let promotionConsetDate = null;

        //CHECK FOR THE EXISTING VALUE.
        if (data.email_consent) {
            if (userDetails.email_consent_date)
                emailConsentDate = userDetails.email_consent_date;
            else
                emailConsentDate = new Date();
        }

        if (data.promotion_consent) {
            if (userDetails.promotion_consent_date)
                promotionConsetDate = userDetails.promotion_consent_date;
            else
                promotionConsetDate = new Date();
        }

        const updateuserDetails = await connection.getRepository(User)
            .update(userDetails.pk,
                {
                    firstName: data.firstName,
                    surname: data.lastName,
                    phoneno: data.phoneno,
                    email_consent: data.email_consent,
                    promotion_consent: data.promotion_consent,
                    email_consent_date: emailConsentDate,
                    promotion_consent_date: promotionConsetDate
                })

        if (updateuserDetails.affected === 1) {
            return true;
        }
    }

    async updatedClient(data: Partial<ClientDetailDto>) {
        // UPDATE THE CLIENT DETAILS
        const connection = getConnectionManager().get();
        const clientDetails = await connection.getRepository(Client).findOne({ organizationbaseid: data.orgId });
        const updateclientDetails = await connection.getRepository(Client)
            .update(clientDetails.pk, { name: data.name })

        await connection.getRepository(ClientProfile).update({ clientPk: clientDetails.pk }, {
            clientPk: clientDetails.pk,
            website: data.website,
            email: data.email,
            industry: data.industry,
            postalCode: data.postalCode,
            address: data.address,
            yearOfRegistration: data.dateOfRegistration,
            phone: data.phoneNumber
        });

        if (updateclientDetails.affected === 1)
            return true;
    }

    async updateTourDismiss(data: tourDismissDto) {
        const connection = getConnectionManager().get();
        const updateUser = await connection.getRepository(User).update({ base_user_id: data.baseuserid }, {
            is_dismissed_tour: true
        });

        if (updateUser.affected === 1)
            return true;

    }
}


