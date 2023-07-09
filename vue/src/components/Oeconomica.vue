<template>
    <header>
        <div id = mymoney>
        <form name="login_form">
            <div class="login_form_top">
                <h1>Oeconomica</h1>
                <p>Simple Account Book made by myself</p>
            </div>
            <div v-show="show == '1' || show == '2'" class="tabcontent-list">
                <div class="login_form_btm">
                    <input type="month" v-model="year_month" v-on:change="setDateRange(year_month)"/><br>
                </div>
            </div>
            <div v-show="show == '3'" class="tabcontent-list">
                <div class="login_form_btm">
                    <select v-model="year" id="year_pulldown" v-on:change="showYearDatas">
                        <option v-for="(yearSelect, index) in yearSelects" :key="index" v-bind:value="yearSelect">{{ yearSelect }}</option>
                    </select>
                </div>
            </div>
        </form>
        <div id="tab-select">
            <div class="tabgroup">
              <ul class="tabnav">
                <li @click="select('1')" v-bind:class="{'active': show == '1'}">
                    入力
                </li>
                <li @click="select('2')" v-bind:class="{'active': show == '2'}">
                    月データ
                </li>
                <li @click="select('3')" v-bind:class="{'active': show == '3'}">
                    年データ
                </li>
                <li @click="select('4')" v-bind:class="{'active': show == '4'}">
                    設定
                </li>
              </ul>
              <div class="tabcontent">
                <div v-show="show == '1'" class="tabcontent-list">
                    <article>
                        <!-- 入力 -->
                        <h2 id="input">入力</h2>
                        <section id="inputSection">
                            <div>
                                <label>収支</label>
                                    <input type="radio" value="支出" v-model="balance" @click="resetSelect"/>支出
                                    <input type="radio" value="収入" v-model="balance" @click="resetSelect"/>収入

                                <label>日付</label>
                                    <input type="date" v-model="date" v-bind:min="min_date" v-bind:max="max_date">
                                <label>カテゴリ</label>
                                <div v-if="balance == '支出'" class="optionGroup">
                                    <select v-model="category">
                                        <option>-選択してください-</option>                            
                                        <option v-for="(expenceCategory, index) in expenceCategories" :key="expenceCategory.id" v-bind:value="expenceCategory.category">{{ expenceCategory.category }}</option>
                                    </select>
                                </div>
                                <div v-else-if="balance == '収入'" class="optionGroup">
                                    <select v-model="category">
                                        <option>-選択してください-</option>
                                        <option v-for="(incomeCategory, index) in incomeCategories" :key="incomeCategory.id" v-bind:value="incomeCategory.category">{{ incomeCategory.category }}</option>
                                    </select>
                                </div>
                                
                            </div>
                            <div>
                                <label>金額</label>
                                    <input type="number" placeholder="金額を記入" v-model="amount">円

                                <label>メモ</label>
                                <input type="text" v-model="memo" placeholder="買ったものを記入">
                            </div>
                        </section>
                        <div class="submit">
                            <input type="button" value="登録する" @click="regist" >
                        </div>
                    </article>

                        <!-- 入出金一覧 -->
                        <h2 id="inOutList">入出金一覧</h2>
                        <section id="list">
                            <!-- ここに入出金一覧を表示します。 -->
                            <table id="inOutTable">
                                <tr>
                                    <th width="38">曜日</th>
                                    <th>日付</th>   
                                    <th cmanFilterBtn>収支</th>
                                    <th cmanFilterBtn>カテゴリ</th>
                                    <th>金額(円)</th>
                                    <th>メモ</th>
                                    <th width="80">変更</th>
                                    <th width="80">削除</th>
                                </tr>
                                <tr v-for="(oeconomica, index) in oeconomicas" :key="oeconomica.id">
                                    <td id="day">{{ oeconomica.day_of_week }}</td>
                                    <td><input type="text" v-model="oeconomica.date"/></td>
                                    <td>
                                        <select v-model="oeconomica.balance">
                                            <option v-bind:value="oeconomica.balance">{{ oeconomica.balance }}</option>
                                            <option v-if="oeconomica.balance == '収入'">支出</option>
                                            <option v-else-if="oeconomica.balance == '支出'">収入</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select v-model="oeconomica.category">
                                            <option v-bind:value="oeconomica.category">{{ oeconomica.category }}</option>
                                            <option v-if="oeconomica.balance == '収入'" v-for="(incomeCategory, index) in incomeCategories" :key="incomeCategory.id">{{ incomeCategory.category }}</option>
                                            <option v-else-if="oeconomica.balance == '支出'" v-for="(expenceCategory, index) in expenceCategories" :key="expenceCategory.id">{{ expenceCategory.category }}</option>
                                        </select>
                                    </td>
                                    <td><input type="text" v-model="oeconomica.amount"/></td>
                                    <td><input type="text" v-model="oeconomica.memo"/></td>
                                    <td><input type="button" value="change" @click="changeData(oeconomica.id, index)"/></td>
                                    <td><input type="button" value="delete" @click="deleteData(oeconomica.id, index)"/></td>
                                </tr>
                            </table>
                        </section>  
                </div>
                <div v-show="show == '2'" class="tabcontent-list">
                    <div class="graph-child">
                        <graph ref="child2"></graph>
                    </div>
                </div>
                <div v-show="show == '3'" class="tabcontent-list">
                    <div class="yTable-child">
                        <YearTable ref="child3"></YearTable>
                    </div>
                </div>
                <div v-show="show == '4'" class="tabcontent-list">
                    <div class="option-child">
                        <Option ref="child4"></Option>
                    </div>
                </div>
              </div>    
            </div>
        </div>
    </div>
    </header>
</template>

<script>
import axios from "axios";
import Graph from './Graph.vue';
import YearTable from './YearTable.vue';
import Option from './Option.vue';
export default {
    name: 'MyMoney',
    components: {
        Graph,
        YearTable,
        Option,
    },
    data () {
      return {
        year: showDateJS("y")+"年",
        yearSelects: setYearSelects(2020,2030),
        year_month: showDateJS("m"), 
        date: showDateJS("d"),
        min_date: showDateJS("Min"),
        max_date: showDateJS("Max"),
        balance: '支出',
        show: "1",
        category: "-選択してください-" ,
        incomeCategories: [],
        expenceCategories: [],
        amount: "",
        memo: "",
        oeconomicas: [],
        subscriptions:[],
        graphFinished: 0,
      }
    },
    created: async function () {
        try {
            const oResult = await axios.get("/oeconomica/",{
                params: {
                    year_month: this.year_month
                }
            });
            this.oeconomicas = oResult.data;
            this.registSubscription(); // サブスク自動登録
            this.getCategoryDatas();
            tFilterInit(this.oeconomicas);
        } catch (err) {
            console.log(err);
            alert(JSON.stringify(err));
        }
    },
    mounted(){
        this.$refs.child2.firstAction(this.oeconomicas,[this.expenceCategories,this.incomeCategories]);
    },
    methods: {
        select: function (num) {
            if (num == 2) {
                this.$refs.child2.firstAction(this.oeconomicas,[this.expenceCategories,this.incomeCategories]);
            } else if(num == 3) {
                this.$refs.child3.setCategories(this.incomeCategories,this.expenceCategories);
                this.$refs.child3.getYearDatas(this.year.substring(0,4));
            } else if(num == 4) {
                this.$refs.child4.firstAction([this.incomeCategories,this.expenceCategories]);
            }
            this.show = num;
        },
        showYearDatas: function() {
            this.$refs.child3.getYearDatas(this.year.substring(0,4));
        },
        resetSelect: function() {
            this.category = "-選択してください-";
        },
        getCategoryDatas: async function() {
            try {
                let result = await axios.get("/category/",{
                    params: {
                        balance: "収入"
                    }
                });
                this.incomeCategories = result.data;
                result = await axios.get("/category/",{
                    params: {
                        balance: "支出"
                    }
                });
                this.expenceCategories = result.data;
            } catch (err) {
                console.log(err);
                alert(JSON.stringify(err));
            }
        },
        setDateRange: async function(year_month) {
            try {
                var min_date = year_month + '-01';
                const dt = new Date();
                var getsumatsu = new Date(dt.getFullYear(), dt.getMonth(), 0);
                var end_date = ('00' + getsumatsu.getDate()).slice(-2);
                var max_date = year_month + '-' + end_date;
                this.min_date = min_date;
                this.max_date = max_date;
                const result = await axios.get("/oeconomica/",{
                    params: {
                        year_month: this.year_month
                    }
                });
            this.oeconomicas = result.data;
            this.$refs.child2.firstAction(this.oeconomicas,[this.expenceCategories,this.incomeCategories]);
            tFilterReset();
            tFilterInit(this.oeconomicas);
            } catch (err) {
                console.log(err);
                alert(JSON.stringify(err));
            }
        },
        regist: async function () {
            try {
                const result = await axios.post("/oeconomica/", {
                    date: this.date,
                    balance: this.balance,
                    category: this.category,
                    amount: this.amount,
                    memo: this.memo
                });
                this.oeconomicas.unshift(result.data); //配列の先頭に要素追加
                this.modifyNewRecord();
                return result;
            } catch (err) {
                alert(JSON.stringify(err));
            }
        },
        registSubscription: async function () {
            try {
                const sResult = await axios.get("/subscription/");
                let result = checkSubscription(sResult.data);
                // サブスクリプションのテーブルを更新
                for (let subscObj of result[1]) {
                    let id = subscObj.id;
                    await axios.put("/subscription/" + id, {
                        payday: subscObj.payday,
                    });
                }
                // 家計簿に登録する
                for (let paidSubsription of result[0]) {
                    this.date = paidSubsription.date;
                    this.balance = paidSubsription.balance;
                    this.category = paidSubsription.category;
                    this.amount = paidSubsription.amount;
                    this.memo = paidSubsription.memo;
                    await this.regist();
                }
                this.resetInputs();
            } catch (err) {
                console.log(err);
                alert(JSON.stringify(err));
            }
        },
        deleteData: async function (id, index) {
            try {
                await axios.delete("/oeconomica/" + id);
                this.oeconomicas.splice(index, 1);
            } catch (err) {
                alert(JSON.stringify(err));
            }
        },
        changeData: async function (id, index) {
            let val_date = this.oeconomicas[index]['date'];
            let val_balance = this.oeconomicas[index]['balance'];
            let val_category = this.oeconomicas[index]['category'];
            let val_amount = replaceAmount(this.oeconomicas[index]['amount']);
            let val_memo = this.oeconomicas[index]['memo'];
            if (checkChangeParam(val_balance,val_category,this.incomeCategories,this.expenceCategories))
                try { // データ更新
                    await axios.put("/oeconomica/" + id, {
                        date: val_date,
                        balance: val_balance,
                        category: val_category,
                        amount: val_amount,
                        memo: val_memo
                    });
                    let wDay = getWDay(val_date);  // 曜日も更新する
                    this.oeconomicas[index]['day_of_week'] = wDay;
                    alert("データを変更しました");
                } catch (err) {
                    alert(JSON.stringify(err));
                }
            else {
                alert(JSON.stringify(val_balance + "のカテゴリを指定してください"));
            }
        },
        modifyNewRecord: function() {
            // 新規登録したデータの画面表記を修正する
            var wDay = getWDay(this.date);    // 日付から曜日を特定
            var strAmount = csAmount(this.amount);  // 金額にカンマをつける
            // 画面反映
            this.oeconomicas[0].day_of_week = wDay;
            this.oeconomicas[0]['amount'] = strAmount;
        },
        resetInputs: function() {
            this.date = showDateJS("d");
            this.balance = '支出';
            this.category = "-選択してください-";
            this.amount = "";
            this.memo = "";
        },
    }
}
</script>
<style>
form {
    text-align: center;
}

.login_form_btm {
    padding: 10px 0;
    background-color: #F7F7F7;
    margin: 10px 0;
}
</style>