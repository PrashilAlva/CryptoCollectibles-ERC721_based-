App = {
  web3Provider: null,
  contracts: {},
  account:'0x0',
  totCount:0,
  currentAccount:'',
  allColors:[],
  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if(typeof web3!=='undefined'){
      App.web3Provider=web3.currentProvider;
      web3=new Web3(web3.currentProvider);
    }
    else{
      App.web3Provider=new Web3.providers.HttpProvider('http://localhost:7545');
      web3=new web3(web3.App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Color.json", function(color) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Color = TruffleContract(color);
      // Connect provider to interact with contract
      App.contracts.Color.setProvider(App.web3Provider);
      console.log(App.contracts.Color);
    return App.render();
    });
  },
render : function(){
  web3.eth.getCoinbase(function (err, account){
    if(err == null){
      document.getElementById('account').innerHTML='Your Account : '+account;
      App.currentAccount=account
      console.log(account);
      console.log(web3.eth.account);
      App.initialize();
    }
  });
},
addToken:function(){
  App.contracts.Color.deployed().then((i)=>{
    app=i;
    var id=document.getElementById('tokenID').value;
    return app.mint(id);
  }).then((tx)=>{
    if(tx.receipt.status=='0x1'){
      alert("Color Added Successfully!");
      location.reload();
    }
    else{
      alert("Color already in use....");
    }
  })
},
initialize:function(){
  var text="";
  var loopCounter=0;
  var ownerCounter=0;
  App.contracts.Color.deployed().then((i)=>{
    app=i;
    return app.totalSupply();
  }).then((count)=>{
     App.totCount = count.toNumber();
    return app.colors
  }).then((color)=>{
    for(var i=0;i<App.totCount;i++)
    color(i).then((data)=>{
      ownerCounter++;
      app.ownerOf(ownerCounter).then((ownerr)=>{
        if(ownerr==App.currentAccount){
          if(ownerCounter==0){
            text = text +
            "<div class='row'><div class='col-sm'><div style='background-color:"+data+";width:150px;height:150px;border-radius: 50%;display: inline-block;'></div><h3 style='padding-left: 37px;'>"+data+"</h3></div>"
            }
            else if(loopCounter==5){
              loopCounter=0;
              text = text +
            "</div><div class='row'><div class='col-sm'><div style='background-color:"+data+";width:150px;height:150px;border-radius: 50%;display: inline-block;'></div><h3 style='padding-left: 37px;'>"+data+"</h3></div>"
            }
            else{
              text = text +
            "<div class='col-sm'><div style='background-color:"+data+";width:150px;height:150px;border-radius: 50%;display: inline-block;'></div><h3 style='padding-left: 37px;'>"+data+"</h3></div>"
            }
            loopCounter=loopCounter+1;
            document.getElementById('data').innerHTML=text;
            }
      })
    })
  })
}
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
