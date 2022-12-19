using FI_Project.cocd from '../db/cocd';

service  CocdService {

    entity CoCd as projection on cocd.CoCd;
    entity CoCd_Fis_Y_Variant as projection on cocd.CoCd_Fis_Y_Variant;
    entity CoCd_Co_Area as projection on cocd.CoCd_Co_Area;

}