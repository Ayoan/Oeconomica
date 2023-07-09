<template>
    <h3 id="balanceBar">収支データ</h3>
    <table class="balanceTable">
        <tr><th>収入計</th><td class="inTotal">¥ {{ inTotal }}</td></tr>
        <tr><th>支出計</th><td class="outTotal">¥ {{ outTotal }}</td></tr>
        <tr><th>収支計</th><td id="td-profit">¥ {{ profit }}</td></tr>
    </table>
    <div>
        <canvas id="balanceBarChart" width="1400" height="200"></canvas>
    </div>

    <h3 id="categoryData">カテゴリ別</h3>
    <h4>支出</h4>
    <table class="categoryTable">
        <tr v-for="(eCategory, index) in eCategoryList" :key="index" :value="eCategory"> 
            <th>{{ eCategory }}</th><td class="categoryTotal">¥ {{ eCategoryTotals[eCategory] }}</td>
        </tr>
    </table>
    <div class="pChart-container">
        <canvas id="outPieChart" class="pChart"></canvas>
    </div>
    <h4>収入</h4>
    <table class="categoryTable">
        <tr v-for="(iCategory, index) in iCategoryList" :key="index" :value="iCategory"> 
            <th>{{ iCategory }}</th><td class="categoryTotal">¥ {{ iCategoryTotals[iCategory] }}</td>
        </tr>
    </table>
    <div class="pChart-container">
        <canvas id="inPieChart" class="pChart"></canvas>
    </div>
</template>

<script>
import { Chart, registerables } from 'chart.js'; 
Chart.register(...registerables);
export default {
    name: 'Graph',
    // props: ['oeconomicas','year_month'],
    data () {
        return {
            balanceBarChart: null,
            outPieChart: null,
            balanceBarData: [],
            inPieData: [],
            outPieData: [],
            inTotal: 0,
            outTotal: 0,
            profit: 0,
            barData: {},
            eCategoryList: [],
            eCategoryTotals: {},
            iCategoryList: [],
            iCategoryTotals: {},
            eCategoryColors: {},
            iCategoryColors: {},
            options: {
                responsive: false,
                plugins: {
                    legend: {
                        display: false,
                    }
                },
                indexAxis: 'y',
                maintainAspectRatio: false,
            },
            outPieOptions: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: '支出カテゴリ別',
                        // fontSize: 120,
                    },
                    legend: {
                        position: 'top',
                        display: false
                    },
                },
            },
            inPieOptions: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: '収入カテゴリ別',
                    },
                    legend: {
                        position: 'top',
                        display: false
                    },
                },
            }
        }
    },
    methods: {
        firstAction: function(data,categories){
            this.oeconomicas = data;
            this.eCategoryList = this.sortCategoryName(categories[0]);
            this.eCategoryTotals = this.calcCategoryData(this.eCategoryList,'支出');
            this.eCategoryColors = this.setCategoryColors(this.eCategoryList,'支出');
            this.iCategoryList = this.sortCategoryName(categories[1]);
            this.iCategoryTotals = this.calcCategoryData(this.iCategoryList,'収入');
            this.iCategoryColors = this.setCategoryColors(this.iCategoryList,'収入');
            this.updateBarGraph(this.oeconomicas);
            this.updatePieGraph();
        },
        updateBarGraph: function(data) {
            if (this.balanceBarChart) {
                this.balanceBarChart.destroy();    // Destroy the existing chart instance
            }
            this.calcBalance(data);    // Recalculate amount of each balance.
            this.createBarGraph();    // Create a new chart instance
        },
        updatePieGraph: function() {
            if (this.outPieChart) {
                this.outPieChart.destroy();    // Destroy the existing chart instance
            }
            if (this.inPieChart) {
                this.inPieChart.destroy();    // Destroy the existing chart instance
            }
            this.setPieData();
            this.createPieGraph();
        },
        calcBalance: function(data) {
            var outAmount = 0;
            var inAmount = 0;
            for(var index=0; index < data.length; index++) {
                var amount = replaceAmount(data[index]['amount']);
                if ( data[index]['balance'] == "支出" ) {
                    outAmount = outAmount + Number(amount);
                } else if ( data[index]['balance'] == "収入" ) {
                    inAmount = inAmount + Number(amount);
                }
            }
            this.balanceBarData = [inAmount, outAmount];
            this.setBarData();

            // 金額にカンマをつける
            this.inTotal = this.csAmount(this.balanceBarData[0]);
            this.outTotal = this.csAmount(this.balanceBarData[1]);
            this.profit = this.csAmount(this.balanceBarData[0] - this.balanceBarData[1]);

            // 収支計の金額のフォントの色を黒字か赤字かで変更する。
            var objProfit = document.getElementById("td-profit");
            if ( (this.balanceBarData[0] - this.balanceBarData[1]) > 0 ) {
                objProfit.style.color = '#0000FF'; 
            } else if ( (this.balanceBarData[0] - this.balanceBarData[1]) < 0 ) {
                objProfit.style.color = '#FF0000';
            }
        },
        setBarData: function(){
            this.barData = {
                labels: ['収入', '支出'],
                datasets: [{
                    data: this.balanceBarData,
                    backgroundColor:['#4169e1','#f87979'],
                }]
            };
        },
        setPieData: function(){
            var eCategoryDatas = [];
            var iCategoryDatas = [];
            for(var i=0; i < this.eCategoryList.length; i++){
                eCategoryDatas.push(replaceAmount(this.eCategoryTotals[this.eCategoryList[i]]));
            }
            for(i=0; i < this.iCategoryList.length; i++){
                iCategoryDatas.push(replaceAmount(this.iCategoryTotals[this.iCategoryList[i]]));
            }
            this.outPieData = {
                labels: this.eCategoryList,
                datasets: [{
                    data: eCategoryDatas,
                    backgroundColor: [],
                    // hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
                }]
            }
            this.inPieData = {
                labels: this.iCategoryList,
                datasets: [{
                    data: iCategoryDatas,
                    backgroundColor: [],
                }]
            }
            // 色の生成
            // const getRandomColor = () => {
            //     const r = Math.floor(Math.random() * 256);
            //     const g = Math.floor(Math.random() * 256);
            //     const b = Math.floor(Math.random() * 256);
            //     return `rgba(${r}, ${g}, ${b}, 0.8)`;
            // };
            // 背景色の設定
            this.outPieData.datasets[0].backgroundColor = this.outPieData.labels.map((category) => this.eCategoryColors[category]);
            this.inPieData.datasets[0].backgroundColor = this.inPieData.labels.map((category) => this.iCategoryColors[category]);
            // this.outPieData.datasets[0].backgroundColor = this.outPieData.labels.map(() => getRandomColor());
            // this.inPieData.datasets[0].backgroundColor = this.inPieData.labels.map(() => getRandomColor());
            // console.log(this.outPieData.datasets[0].backgroundColor);
            // console.log(this.inPieData.datasets[0].backgroundColor);
        },
        createBarGraph: function() {
            const ctx = document.getElementById('balanceBarChart').getContext('2d');
            this.balanceBarChart = new Chart(ctx, {
                type: 'bar',
                data: this.barData,
                options: this.options,
            });
        },
        createPieGraph: function() {
            const ctx1 = document.getElementById('outPieChart').getContext('2d');
            const ctx2 = document.getElementById('inPieChart').getContext('2d');
            this.outPieChart = new Chart(ctx1, {
                type: 'pie',
                data: this.outPieData,
                options: this.outPieOptions,
            });
            this.inPieChart = new Chart(ctx2, {
                type: 'pie',
                data: this.inPieData,
                options: this.inPieOptions,
            });
    
        },
        csAmount: function(amount) {
            return amount.toLocaleString();
        },
        sortCategoryName: function(Categories) {
            // 登録されているカテゴリを抽出
            var categoryArray = [];
            for(var i=0; i < this.oeconomicas.length; i++) {
                categoryArray.push(this.oeconomicas[i]['category']);
            }
            // 重複排除
            const categoryList = Array.from(new Set(categoryArray));
            // ソート
            var categoryList2 = [];
            for(var index=0; index < Categories.length; index++) {
                for(var j=0; j < categoryList.length; j++) {
                    if ( Categories[index]['category'] == categoryList[j] ) {
                        categoryList2.push(categoryList[j]);
                    }
                }
            }
            return categoryList2;
        },
        calcCategoryData: function(categoryList,strBalance) {
            var categoryTotals = {};
            // オブジェクトにプロパティを追加,初期化
            for(var i=0; i < categoryList.length; i++) {
                categoryTotals[categoryList[i]] = "";
            }
            // カテゴリ別の金額合計を算出
            for(const category in categoryTotals) {
                var total = 0;
                for(var j=0; j < this.oeconomicas.length; j++) {
                    if ( category == this.oeconomicas[j]['category'] && strBalance == this.oeconomicas[j]['balance']) {
                        var amount = replaceAmount(this.oeconomicas[j]['amount']);
                        total = total + Number(amount);
                    }
                }
                categoryTotals[category] = this.csAmount(total);
            }
            return categoryTotals;
        },
        setCategoryColors: function(categoryList,strBalance){
            var categoryColors = {};
            for(var i=0; i < categoryList.length; i++) {
                categoryColors[categoryList[i]] = "";
            }
            var j = 0;
            var colorCodes = [];
            for(const category in categoryColors) {
                if ( strBalance == '収入') {
                    colorCodes = ["rgba(0, 255, 255, 0.8)","rgba(255, 235, 205, 0.8)","rgba(240, 255, 240, 0.8)"];
                } else if ( strBalance == '支出') {
                    colorCodes = ["rgba(0, 128, 0, 0.8)","rgba(58, 255, 86, 0.8)","rgba(154, 77, 177, 0.8)","rgba(77, 124, 221, 0.8)","rgba(102, 65, 85, 0.8)","rgba(12, 203, 195, 0.8)","rgba(230, 36, 92, 0.8)","rgba(187, 240, 120, 0.8)","rgba(6, 186, 225, 0.8)","rgba(202, 5, 7, 0.8)","rgba(226, 195, 121, 0.8)","rgba(113, 160, 39, 0.8)","rgba(207, 183, 50, 0.8)"];
                }
                categoryColors[category] = colorCodes[j];
                j = j + 1;
            }
            return categoryColors;
        }
    }
}
</script>