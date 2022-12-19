namespace FI_Project.cocd;

entity CoCd{
    key com_code                         : String @title : '회사코드';  //@title : 컬럼의 용도를 작성해줌 / key는 중복 데이터 불가 
        com_code_name                    : String @title : '회사명'; // 
        com_city                         : String @title : '회사도시';
        com_country                      : String @title : '회사국가';
        com_language                     : String @title : '회사언어';
        com_currency                     : String @title : '회사통화';
        com_coa                          : String @title : '회사계정과목표';
        com_fiscal_year_variant          : String @title : '회계연도 object';
        com_fiscal_year_variant_name     : String @title : '회계연도 object 내역';
        com_co_area                      : String @title : '회사 관리회계영역';
        com_co_area_content              : String @title : '내역';
        com_address                      : String @title : '회사주소';
        com_cocd_tax_code                : String @title : '세금코드';
        com_cocd_constructor             : String @title : '생성자';
        com_cocd_date                    : String @title : '생성일';

};