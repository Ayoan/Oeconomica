const showDateJS = (str_flag) => {
    //===============================================================
    // 引数に応じて日付データを返す関数
    //===============================================================
    const dt = new Date();
    var y = dt.getFullYear();
    var m = ('00' + (dt.getMonth()+1)).slice(-2);
    var d = ('00' + dt.getDate()).slice(-2);
    if ( str_flag == "d" ) {
        return (y + '-' + m + '-' + d);
    } else if ( str_flag == "m" ) {
        return (y + '-' + m);
    } else if ( str_flag == "y" ) {
        return (y);
    } else if ( str_flag == "Min" ) {
        return (y + '-' + m + '-01');
    } else if ( str_flag == "Max") {
        var getsumatsu = new Date(dt.getFullYear(), dt.getMonth() + 1, 0);
        var end_date = ('00' + getsumatsu.getDate()).slice(-2);
        return (y + '-' + m + '-' + end_date);
    }
}

const replaceAmount = (amount) =>{
    //===============================================================
    // 1,000のような金額データからカンマを除く関数
    //===============================================================
    count = Math.trunc(amount.length / 4)
    if (count > 0){
        for (let i = 0; i < count; i++){
            if ( amount.match(/,/)) {
                amount = amount.replace(",", "");
            } 
        }
    }
    return amount;
}

const csAmount = (amount) =>{
    //===============================================================
    // 金額にカンマをつける関数
    //===============================================================
    return amount.toLocaleString();
}

const replaceNum = (num) =>{
    // 01のような数字を1のように変換する関数
    if (num.substring(0,1) == 0){
        num = num.slice(-1);
    }
    return num;
}

const getWDay = (varDate) =>{
    //===============================================================
    // yyyy-mm-ddから曜日を導く関数
    //===============================================================
    var WeekChars = [ "日", "月", "火", "水", "木", "金", "土" ];
    var strDateArray = varDate.split("-");
    var strDate = strDateArray[0] + '/' + strDateArray[1] + '/' + strDateArray[2];
    var dObj = new Date(strDate);
    var wDay = dObj.getDay();
    return WeekChars[wDay];
}

const setYearSelects = (MinYear,MaxYear) =>{
    //===============================================================
    // 年を指定するプルダウンの範囲を配列で返す関数
    //===============================================================
    let yearSelects = [];
    for(let year=MinYear; year<=MaxYear; year++){
        yearSelects.push(String(year)+"年");
    }
    return yearSelects;
}

const makeYearDatas = (YearDatas,categoryList,strBalance) => {
    let categoryMonthObj = {};
    for (var i = 1; i <= 12; i++){
        categoryMonthObj[i] = {};
        for (const categoryObj of categoryList) {
            categoryMonthObj[i][categoryObj.category]=0;
        }
        categoryMonthObj[i]['total']=0;
    }
    for (var i=0; i < YearDatas.length; i++){
        if (YearDatas[i]['balance'] == strBalance){
            mm = replaceNum(YearDatas[i]['date'].substring(5,7));
            categoryMonthObj[mm][YearDatas[i]['category']] += Number(replaceAmount(YearDatas[i]['amount']));
        }
    }
    for (var i = 1; i <= 12; i++){
        for (const categoryObj of categoryList) {
            categoryMonthObj[i]['total'] += categoryMonthObj[i][categoryObj.category]  //各月の合計を算出
            categoryMonthObj[i][categoryObj.category] = csAmount(categoryMonthObj[i][categoryObj.category]);  //金額にカンマをつける
        }
        categoryMonthObj[i]['total'] = csAmount(categoryMonthObj[i]['total']);
    }
    return categoryMonthObj;
}

const calcYearTotal = (categoryMonthObj,categoryList) => {
    let categoryTotalObj = {};
    for (const categoryObj of categoryList) {
        let total = 0;
        for (var i = 1; i <= 12; i++){
            total += Number(replaceAmount(categoryMonthObj[i][categoryObj.category]));
        }
        categoryTotalObj[categoryObj.category] = total;
    }
    categoryTotalObj['total'] = 0;
    for (const categoryObj of categoryList) {
        categoryTotalObj['total'] += categoryTotalObj[categoryObj.category];
        categoryTotalObj[categoryObj.category] = csAmount(categoryTotalObj[categoryObj.category]);  //金額にカンマをつける
    }
    categoryTotalObj['total'] = csAmount(categoryTotalObj['total']);
    return categoryTotalObj;s
}

const calcProfitRate = (yearProfit,inYearTotal) =>{
    // 年間の利益率を算出する関数
    let profitRate = 0;
    if (inYearTotal != 0 && yearProfit != 0) {
        profitRate = Math.round(yearProfit / Number(replaceAmount(inYearTotal)) * 100);
    }
    return profitRate;
}

const calcOutRate = (inYearDataObj,outYearDataObj) =>{
    // 支出率を算出する関数
    let outRateObj = {};
    for (var i = 1; i <= 12; i++){
        let inMonthTotal = 0;
        let outMonthTotal = 0;
        if (inYearDataObj[i]['total'] != 0 && outYearDataObj[i]['total'] != 0) {
            inMonthTotal = Number(replaceAmount(inYearDataObj[i]['total']));
            outMonthTotal = Number(replaceAmount(outYearDataObj[i]['total']));
            outRateObj[i] = Math.round(outMonthTotal / inMonthTotal * 100);
        } else{
            outRateObj[i] = 0;
        }
    }
    outRateObj[13] = ""; //Dummy
    return outRateObj;
}

const checkSubscription = (subscriptions) =>{
    //===============================================================
    // 自動登録させるサブスクリプションを選定する関数
    //===============================================================
    const dt = new Date();
    let yyyy = dt.getFullYear();
    let dd = ('00' + dt.getDate()).slice(-2);
    let mm = ('00' + (dt.getMonth()+1)).slice(-2);
    let last_mm = ('00' + (dt.getMonth())).slice(-2);
    let twLast_mm = ('00' + (dt.getMonth()-1)).slice(-2);
    let paidSubscriptions = [];
    let updatedSubscriptions = [];

    // -------------------------------------
    // 共通処理
    // -------------------------------------
    const setObj = (subscObj,month) =>{
        // 家計簿登録対象を一時的にオブジェクトとしてまとめる
        let tmpObj = {};
        tmpObj.date = yyyy + '-' + month + '-' + ('00' + subscObj.day).slice(-2);
        tmpObj.balance = "支出";
        tmpObj.category = subscObj.category;
        tmpObj.amount = subscObj.amount;
        tmpObj.memo = subscObj.subscription;
        // 登録対象オブジェクトをリストに登録
        paidSubscriptions.push(tmpObj);
        // サブスクの支払日を更新
        subscObj.payday = tmpObj.date;
        // 更新対象のサブスクをリストに登録
        updatedSubscriptions.push(subscObj);
    }
    // -------------------------------------
    // ここから処理開始
    // -------------------------------------
    for (const subscObj of subscriptions) {
        // 同じ年であればサブスク登録の処理を開始する(1年以上前には関わらない)
        if (subscObj.updatedAt.substring(0,4) == yyyy){
            // DBの支払日がNULL場合(サブスクを登録したばかりでまだその月の支払日が来ていないケースを想定)
            if (subscObj.payday == null){
                if (subscObj.day <= dd){
                    setObj(subscObj,mm);
                } else if (subscObj.updatedAt.substring(5,7) != mm){
                    setObj(subscObj,last_mm);
                }
            // 1ヶ月前の登録が済んでいる場合
            } else if (subscObj.payday.substring(5,7) == last_mm){
                // 今日日付がサブスク支払日の当日or支払日経過しているならtrue
                if (subscObj.day <= dd){
                    setObj(subscObj,mm);
                }
            // 1ヶ月前の登録がされてない場合(有り得るのは7/1に6/29の登録漏れを検知したいとき)
            } else if (subscObj.payday.substring(5,7) == twLast_mm){
                // 前回更新が2ヶ月前だったら問答無用で1ヶ月前の更新をする
                setObj(subscObj,last_mm);
                // 先月分だけでなく今月分も更新が必要な場合(有り得るのは7/30に6/29の登録漏れを検知したいとき)
                if (subscObj.day <= dd){
                    setObj(subscObj,mm);
                }
            }            
        }
    }
    return [paidSubscriptions,updatedSubscriptions];
}

const checkChangeParam = (val_balance,val_category,incomeCategories,expenceCategories) =>{
    let checked = false;
    let categories = "";
    if (val_balance == '収入') {
        categories = incomeCategories;
    } else if (val_balance == '支出') {
        categories = expenceCategories;
    }
    for (const cObj of categories) {
        if (val_category == cObj.category) {
            checked = true;
        }
    }
    return checked;
}