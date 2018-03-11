Vue.component('stream_list_all', {
  props: ['list'],
  template: '#s_list'
})
Vue.component('stream_list_online', {
  props: ['list'],
  template: '#o_list'
})
Vue.component('stream_list_offline', {
  props: ['list'],
  template: '#f_list'
})


var vm = new Vue({
  el: "#app",
  data:{
  following_list: [],
  user: 'twitch',
  following_listapi: "https://api.twitch.tv/kraken/users/",
  following_listapi_2:"/follows/channels?limit=100",
  stream_api: "https://api.twitch.tv/kraken/streams/",
  stream_check: [],
  C_ID: 'dortyxlz1s65zs36gis67g9iyhgtd4',
  All_check: true,
  Online_check: false,
  Offline_check: false
  },
  created: function(){
    console.log(this.user);
    this.$http.get(this.following_listapi + this.user + this.following_listapi_2,{headers:{'Client-ID': this.C_ID}}).then(response => {
      this.following_list = response.body;
// 不能用 var 迴圈跑過一個非同步的 Promise要用 let 或是 閉包
      for(let i = 0; i < this.following_list.follows.length; i++){
      this.$http.get(this.stream_api+this.following_list.follows[i].channel.name,{headers:{'Client-ID': this.C_ID}}).then(res => {
        // console.log(res.body);
        if(res.body.stream == null){
          //但對於物件而言， Vue不能檢測物件屬性的新增或刪除 。這主要也是由於JavaScript的限制。不過在Vue中，對於已經建立好的例項，可以使用 Vue.set(object, key, value) 原文網址：https://itw01.com/7XSE3WB.html
          Vue.set(this.following_list.follows[i].channel,"stream","OFFline");
       }else{
          Vue.set(this.following_list.follows[i].channel,"stream",res.body.stream.channel.game);
          Vue.set(this.following_list.follows[i].channel,"stream_video",'https://player.twitch.tv/?channel='+res.body.stream.channel.name+'&autoplay=false');
       }
        // console.log(this.following_list.follows[i]);
      });
    };
      
  });
 },
  methods:{
    stream_check_all: function(){
      this.All_check = true;
      this.Online_check = false;
      this.Offline_check = false;
    },
    stream_check_online: function(){
      this.All_check = false;
      this.Online_check = true;
      this.Offline_check = false;
    },
    stream_check_offline: function(){
      this.All_check = false;
      this.Online_check = false;
      this.Offline_check = true;
    },
  }
 
});