<template>
    <h3 id="YearSummary">サマリー</h3>
    <table class="balanceTable">
        <tr><th>収入合計</th><td class="inTotal">¥ {{ inYearTotalObj['total'] }}</td></tr>
        <tr><th>支出合計</th><td class="outTotal">¥ {{ outYearTotalObj['total'] }}</td></tr>
        <tr><th>年間収支</th><td id="td-profit">¥ {{ yearProfit }}</td></tr>
        <tr><th>利益率</th><td id="td-profit">{{ profitRate }}%</td></tr>
    </table>

    <h3>収入内訳</h3>
    <table id="YearTable" v-if="inYearDataObj">
    <thead>
        <tr>
            <td class="non"></td>
            <th v-for="mm in 12">{{ mm }}月</th>
            <th scope="col">計</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="iCategoryObj in incomeCategories">
            <th>{{ iCategoryObj.category }}</th>
            <td v-for="mm in 12" class="incomeAll">{{ inYearDataObj[mm][iCategoryObj.category] }}</td>
            <td>{{ inYearTotalObj[iCategoryObj.category] }}</td>
        </tr>
        <tr class="YearTotal">
            <th>合計</th>
            <td v-for="mm in 12">{{ inYearDataObj[mm]['total'] }}</td>
            <td>{{ inYearTotalObj['total'] }}</td>
        </tr>
    </tbody>
    </table>

    <h3>支出内訳</h3>
    <table id="YearTable" v-if="outYearDataObj">
    <thead>
        <tr>
            <td class="non"></td>
            <th v-for="mm in 12">{{ mm }}月</th>
            <th scope="col">計</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="eCategoryObj in expenceCategories">
            <th>{{ eCategoryObj.category }}</th>
            <td v-for="mm in 12" class="outcomeAll">{{ outYearDataObj[mm][eCategoryObj.category] }}</td>
            <td class="outcomeAll">{{ outYearTotalObj[eCategoryObj.category] }}</td>
        </tr>
        <tr class="YearTotal">
            <th>合計</th>
            <td v-for="mm in 12">{{ outYearDataObj[mm]['total'] }}</td>
            <td>{{ outYearTotalObj['total'] }}</td>
        </tr>
    </tbody>
    </table>
    <table id="outRateTable">
        <thead>
            <tr class="outRateHead">
                <td class="non"></td>
                <th v-for="mm in 13"></th>
            </tr>
        </thead>
        <tbody>
            <tr class="outRate">
                <th>支出率</th>
                <td v-for="mm in 13">{{ outRateObj[mm] }}</td>
            </tr>
        </tbody>
    </table>
</template>


<script>
import axios from "axios";
import { Chart, registerables } from 'chart.js'; 
Chart.register(...registerables);
export default {
    name: 'YearTable',
    data () {   
        return {
            YearDatas: [],
            incomeCategories: [],
            expenceCategories: [],
            inYearDataObj: this.initializeData("in"),
            outYearDataObj: this.initializeData("out"),
            inYearTotalObj:{},
            outYearTotalObj:{},
            yearProfit: 0,
            profitRate: 0,
            outRateObj: {},
        }
    },
    methods: {
        initializeData: function(strFlag) {
            let data = {};
            let CategoryList = [];
            if (strFlag == "in"){
                CategoryList = ["給与", "投資収入","その他"];
            } else if (strFlag == "out"){
                CategoryList = ["食費","酒代","日用品","交際費","交通費","美容費","衣服費","医療費","書籍","サブスク","家賃","水道光熱費","通信費","税金","家具・家電","サウナ・銭湯","車代","旅行","その他"];
            }
            for (let i = 1; i <= 12; i++) {
                data[i] = {};
                for (let category of CategoryList) {
                    data[i][category] = 0;
                }
            }
            return data;
        },
        setCategories: function(incomeCategories,expenceCategories){
            this.incomeCategories = incomeCategories;
            this.expenceCategories = expenceCategories;
        },
        getYearDatas: async function(yyyy) {
            try {
                const result = await axios.get("/oeconomica/Yeardatas",{
                    params: {
                        year: yyyy
                    }
                });
                // カテゴリ別の月間収支を算出
                this.inYearDataObj = makeYearDatas(result.data,this.incomeCategories,"収入");
                this.inYearTotalObj = calcYearTotal(this.inYearDataObj,this.incomeCategories);
                this.outYearDataObj = makeYearDatas(result.data,this.expenceCategories,"支出");
                this.outYearTotalObj = calcYearTotal(this.outYearDataObj,this.expenceCategories);
                // 年間の収支合計
                this.yearProfit = Number(replaceAmount(this.inYearTotalObj['total'])) - Number(replaceAmount(this.outYearTotalObj['total']));
                // 利益率
                this.profitRate = calcProfitRate(this.yearProfit,this.inYearTotalObj['total']);
                this.yearProfit = csAmount(this.yearProfit);
                // 支出率
                this.outRateObj = calcOutRate(this.inYearDataObj,this.outYearDataObj);
            } catch (err) {
                console.log(err);
                alert(JSON.stringify(err));
            }
        },
    },
}

</script>