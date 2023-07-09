<template>
    <header>
        <form name="login_form">
            <div class="login_form_top">
                <h1>Oeconomica</h1>
                <p>Simple Kakeibo made by myself</p>
            </div>
            <div class="login_form_btm">
                <input type="month" v-model="year_month"/><br>
                <!-- <input type="password" name="password" placeholder="パスワードを入力してください"> -->
            </div>
            <button type="submit">Show</button>
        </form>

    </header>
</template>

<script>
export default {
    name: 'mymoney',
    data () {
      return {
        year_month: this.showToday(),
      }
    },
    methods: {
        showToday: function () {
            const dt = new Date();
            var y = dt.getFullYear();
            var m = ('00' + (dt.getMonth()+1)).slice(-2);
            // var d = ('00' + dt.getDate()).slice(-2);
            return (y + '-' + m);
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