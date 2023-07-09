<template>
    <h3>サブスク</h3>
    <table class="subscriptionTable">
        <tr>
            <th>支払日</th>
            <th>カテゴリ</th>
            <th>サービス名</th>
            <th>金額</th>
            <th style="display:none;background:#EEEEEE">dummy</th>
        </tr>
        <tr id="inputRow">
            <td>
                毎月
                <select name="daySelect" id="daySelect" v-model="day">
                    <option value=""></option>
                    <option v-for="mm in 31">{{ mm }}</option>
                </select>
                日</td>
            <td>
                <select v-model="subCategory">
                    <option>-選択してください-</option>                            
                    <option v-for="(expenceCategory, index) in expenceCategories" :key="expenceCategory.id">{{ expenceCategory.category }}</option>
                </select>
            </td>
            <td><input type="text" v-model="subscription"/></td>
            <td><input type="number" v-model="amount" style="width: 40%;"/>円</td>
            <td>
                <button class="add-button" @click="registSubscription">＋</button> <!-- The + button -->
            </td>
        </tr>
        <tr v-for="(subscription, index) in subscriptions" :key="subscription.id">
            <td>毎月 {{ subscription.day }} 日</td>
            <td>{{ subscription.category }}</td>
            <td>{{ subscription.subscription }}</td>
            <td>{{ subscription.amount }} 円</td>
            <td>
                <button class="del-button" @click="deleteSubscription(subscription.id, index)">ー</button> <!-- The + button -->
            </td>
        </tr>
    </table>

    <h3>カテゴリー</h3>
    <table class="categoryAddTable">
        <tr>
            <td><input type="text" v-model="category" placeholder="カテゴリを入力"/></td>
            <td>
                <select v-model="balance">
                    <option>-選択してください-</option>                            
                    <option>支出</option>
                    <option>収入</option>
                </select>
            </td>
            <td>
                <button class="add-button" @click="registCategory">＋</button> <!-- The + button -->
            </td>
        </tr>
    </table>
    

    <div class="balanceTable-container">
      <table>
        <thead>
          <tr class="IncomeTable">
            <th>{{ income }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(incomeCategory, index) in incomeCategories" :key="incomeCategory.id">
            <td>{{ incomeCategory.category }}</td>
            <td><button class="del-button" @click="deleteCategory(incomeCategory.id,incomeCategory.balance, index)">ー</button></td>
          </tr>
        </tbody>
      </table>

      <table>
        <thead>
          <tr class="expenceTable">
            <th>{{ expence }}</th>
          </tr>
        </thead>
        <tbody>
            <tr v-for="(expenceCategory, index) in expenceCategories" :key="expenceCategory.id">
                <td>{{ expenceCategory.category }}</td>
                <td><button class="del-button" @click="deleteCategory(expenceCategory.id,expenceCategory.balance, index)">ー</button></td>
            </tr>
        </tbody>
      </table>
    </div>

</template>


<script>
import axios from "axios";
import { Chart, registerables } from 'chart.js'; 
Chart.register(...registerables);
export default {
    name: 'Option',
    data () {   
        return {
            subCategory:"-選択してください-",
            balance: "-選択してください-" ,
            income:"収入",
            expence:"支出",
            incomeCategories:[],
            expenceCategories: [],
            subscriptions: [],
            day:"",
            subscription:"",
            category:"",
            amount:"",
        }
    },
    methods: {
        firstAction: function(){
            this.getSubscriptions();
            this.getCategories();
        },
        getSubscriptions: async function() {
            try {
                const result = await axios.get("/subscription/");
                this.subscriptions = result.data;
            } catch (err) {
                console.log(err);
                alert(JSON.stringify(err));
            }
        },
        getCategories: async function() {
            try {
                let result = await axios.get("/category/",{
                    params: {
                        balance: this.income
                    }
                });
                this.incomeCategories = result.data;
                result = await axios.get("/category/",{
                    params: {
                        balance: this.expence
                    }
                });
                this.expenceCategories = result.data;
            } catch (err) {
                console.log(err);
                alert(JSON.stringify(err));
            }
        },
        registSubscription: async function () {
            try {
                if(this.day != "" && this.balance != ""){
                    const result = await axios.post("/subscription/", {
                        day: this.day,
                        category: this.subCategory,
                        subscription: this.subscription,
                        amount: this.amount,
                    });
                    this.subscriptions.push(result.data); //配列の末尾に要素追加
                    this.subscriptions.sort((a, b) => a.day - b.day); //日付順にソート
                    // 入力欄をリセットする
                    this.day = "";
                    this.subCategory = "-選択してください-";
                    this.subscription = "";
                    this.amount = "";
                }
            } catch (err) {
                console.log(err)
                alert(JSON.stringify(err));
            }
        },
        registCategory: async function () {
            try {
                if(this.category != "" && (this.balance == "収入" || this.balance == "支出" )){
                    console.log("start inserting categories")
                    const result = await axios.post("/category/", {
                        category: this.category,
                        balance: this.balance
                    });
                    if (this.balance == "収入"){
                        this.incomeCategories.push(result.data); //配列の末尾に要素追加
                    } else if (this.balance == "支出"){
                        this.expenceCategories.push(result.data); //配列の末尾に要素追加
                    }
                    // 入力欄をリセットする
                    this.category = "";
                    this.balance = "-選択してください-";
                }
            } catch (err) {
                console.log(err)
                alert(JSON.stringify(err));
            }
        },
        deleteSubscription: async function (id, index) {
            try {
                await axios.delete("/subscription/" + id);
                this.subscriptions.splice(index, 1);
            } catch (err) {
                console.log(err)
                alert(JSON.stringify(err));
            }
        },
        deleteCategory: async function (id,balance,index) {
            try {
                await axios.delete("/category/" + id);
                if (balance == "収入"){
                    this.incomeCategories.splice(index, 1);
                } else if (balance == "支出"){
                    this.expenceCategories.splice(index, 1);
                }
            } catch (err) {
                console.log(err)
                alert(JSON.stringify(err));
            }
        },
        
    },
}

</script>