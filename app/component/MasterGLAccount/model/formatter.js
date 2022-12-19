sap.ui.define([], function(){
    "use strict";
    return {
        AcctTypeStatus : function (sStatus){
            switch(sStatus){
                case "P" :
                    return "P (1차 원가 또는 수익)";
                case "S" :
                    return  "S (2차 원가)"
                case "X" :
                    return "X (대차대조표 계정)";
                case "N" :
                    return "N (영업외 비용 또는 수익)";
                case "C" :
                    return "C (현금 계정)";
                default :
                    return sStatus;
            }
        },
        PLAccType : function(sStatus){
            switch(sStatus){
                case "S" :
                    return "매출원가";
                case "E" :
                    return "영업외비용"
                case "L" :
                    return "비정상손실";
                case "R" :
                    return "매출";
                case "I" :
                    return "영업외수익";
                case "A" :
                    return "판매 및 일반 관리비";
                case "T" :
                    return "세금";
                default :
                    return sStatus;
            }
        },
        FuncArea : function(sStatus){
            switch(sStatus){
                case "M" :
                    return "제조";
                case "S" :
                    return "영업 및 유통"
                case "P" :
                    return "생산";
                case "A" :
                    return "관리";
                default :
                    return sStatus;
            }
        }
    }
})