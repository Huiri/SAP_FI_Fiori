using FI_Project.gl from '../db/gl';
service GLService{
    entity GL as projection on gl.GL;
    entity SelectCoA as projection on gl.SelectCoA;
    entity SelectGL as projection on gl.SelectGL;
    entity SelectGLAcctGrp as projection on gl.SelectGLAcctGrp;

}