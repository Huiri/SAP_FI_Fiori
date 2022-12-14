using FI_Project.bp from '../db/bp';

service BPService{
    entity BP as projection on bp.BP;
    entity BP_Nation_Region as projection on bp.BP_Nation_Region;
}
