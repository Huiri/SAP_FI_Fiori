using FI_Project.cocd from '../db/cocd';

service  CocdService {

    entity CoCd as projection on cocd.CoCd;

}