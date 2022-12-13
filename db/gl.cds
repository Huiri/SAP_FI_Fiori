namespace FI_Project.gl;

entity GL {
    key gl_acct	                    :	String	 @title : 'GL 계정';
        gl_acct_content	            :	String	 @title : 'G/L 계정 내역';
        gl_coa	                    :	String	 @title : '계정과목표';
        gl_coa_content	            :	String	 @title : '계정과목표 내역';
        gl_acct_type	            :	String	 @title : 'G/L 계정 유형';
        gl_acct_group	            :	String	 @title : '계정 그룹 ';
        gl_acct_group_mean	        :	String	 @title : '계정 그룹 의미';
        gl_ps_acct_type	            :	String	 @title : '손익계산서 계정 유형';
        gl_func_area	            :	String	 @title : '기능 영역';
        gl_acct_descript	        :	String	 @title : 'G/L 계정 설명';
        gl_related_corp_number	    :	String	 @title : '관계사 번호';
        gl_co_area	                :	String	 @title : '관리회계 영역';
        gl_company_code	            :	String	 @title : '회사 코드';
        gl_corp_name	            :	String	 @title : '회사 이름';
        gl_acct_currency	        :	String	 @title : '계정 통화';
        gl_recon_account		    :   String   @title : '조정 계정';
        gl_blocked                  :   Boolean	 @title : 'G/L 활성화';

}