using FI_Project.bp from '../db/bp';

service BPService{
    entity BP as projection on bp.BP;
}
