<template>
    <header>
        <h1 id="home">MyMoney</h1>
        <div id="tab-select">
            <div class="tabgroup">
              <ul class="tabnav">
                <li @click="select('1')" v-bind:class="{'active': show == '1'}">
                    入力
                </li>
                <li @click="select('2')" v-bind:class="{'active': show == '2'}">
                    データ
                </li>
              </ul>
              <div class="tabcontent">
                <div v-if="show == '1'" class="tabcontent-list">
                    <article>
                        <!-- 入力 -->
                        <h2 id="input">入力</h2>
                        <section id="inputSection">
                            <div>
                                <label>収支</label>
                                    <input type="radio" value="支出" v-model="balance" @click="resetSelect"/>支出
                                    <input type="radio" value="収入" v-model="balance" @click="resetSelect"/>収入

                                <label>日付</label>
                                    <input type="date" v-model="date">
                                <label>カテゴリ</label>
                
                                <div v-if="balance == '支出'" class="optionGroup">
                                    <select v-model="category">
                                        <option>-選択してください-</option>                            
                                        <option v-for="cg in expenceCategories" v-bind:value="cg">{{ cg }}</option>
                                    </select>
                                </div>
                                <div v-else-if="balance == '収入'" class="optionGroup">
                                    <select v-model="category">
                                        <option>-選択してください-</option>
                                        <option v-for="cg in incomeCategories" v-bind:value="cg">{{ cg }}</option>
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
                            <table class="inOutTable">
                                <tr>
                                    <th>日付</th>
                                    <th>収支</th>
                                    <th>カテゴリ</th>
                                    <th>金額(円)</th>
                                    <th>メモ</th>
                                    <th>削除</th>
                                </tr>
                                <tr v-for="(oeconomica, index) in oeconomicas" :key="oeconomica.id">
                                    <td><input type="text" v-model="oeconomica.date" /></td>
                                    <td><input type="text" v-model="oeconomica.balance" /></td>
                                    <td><input type="text" v-model="oeconomica.category" /></td>
                                    <td><input type="text" v-model="oeconomica.amount" /></td>
                                    <td><input type="text" v-model="oeconomica.memo" /></td>
                                    <td><input type="button" value="delete" @click="deleteData(oeconomica.id, index)"/></td>
                                </tr>
                            </table>
                        </section>
                </div>

                <div v-else-if="show == '2'" class="tabcontent-list">
                    <p>タブ2の内容</p>
                    <p>{{ date }}</p>
                    <p>{{ balance }}</p>
                    <p>{{ category }}</p>
                    <p>{{ amount }}</p>
                    <p>{{ memo }}</p>
                    <p>{{ oeconomicas }}</p>
                </div>
              </div>
            </div>
        </div>
    </header>

</template>

<script>
import axios from "axios";
export default {
    name: 'mymoney',
    data () {
      return {
        balance: '支出',
        show: "1",
        date: this.showToday(),
        category: "-選択してください-" ,
        expenceCategories: ["食費","酒代","日用品","交際費","交通費","美容費","衣服費","医療費","書籍","サブスク","家賃","水道光熱費","通信費","税金","家具・家電","サウナ・銭湯","車代","旅行","その他"],
        incomeCategories: ["給与", "投資収入","その他"],
        amount: "",
        memo: "",
        oeconomicas: [],
      }
    },
    created: async function () {
        try {
            const result = await axios.get("/oeconomica");
            this.oeconomicas = result.data;
            console.log("res", res)
        } catch (err) {
            console.log("error cathch")
            console.log("error", error)
            alert(JSON.stringify(err));
        }
    },
    methods: {
        select: function (num) {
            this.show = num;
        },
        resetSelect: function() {
            this.category = "-選択してください-"
        },
        showToday: function () {
            const dt = new Date();
            var y = dt.getFullYear();
            var m = ('00' + (dt.getMonth()+1)).slice(-2);
            var d = ('00' + dt.getDate()).slice(-2);
            return (y + '-' + m + '-' + d);
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
                this.oeconomicas.push(result.data);
                // this.date = this.showToday();
                this.balance = "支出";
                this.category = "-選択してください-";
                this.amount = "";
                this.memo = "";
            } catch (err) {
                alert(JSON.stringify(err));
            }
        },
        deleteData: async function (id, index) {
            try {
                await axios.delete("/oeconomica/" + id);
                this.date = "";
                this.balance = "";
                this.category = "";
                this.amount = "";
                this.memo = ""
                this.oeconomicas.splice(index, 1);
            } catch (err) {
                alert(JSON.stringify(err));
            }
        },
    }
}
</script>

<style scoped>
#main {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin-top: 60px;
}
</style>