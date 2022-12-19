sap.ui.define([], function(){
    "use strict";
    return {
        NationStatus : function (sStatus){
            switch(sStatus){
                case "KR" :
                    return "한국";
                case "CN" :
                    return "중국";
                case "DE" :
                    return "독일";
                case "DK" :
                    return "덴마크";
                case "HK" :
                    return "홍콩 특별 행정구";
                case "JP" :
                    return "일본";
                case "NL" :
                    return "네덜란드";
                case "SG" :
                    return "싱가포르";
                case "TW" :
                    return "대만";
                case "US" :
                    return "미국";
                case "BG" :
                    return "벨기에";
                default :
                    return sStatus;
            }
        }

    }
})