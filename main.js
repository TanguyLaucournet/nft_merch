
/* Moralis init code */
const serverUrl = "https://e6rzuxkruyuh.usemoralis.com:2053/server";
const appId = "bCOHmjsWpAg7RDqQVm5M15CqzlF94NDTA61JXKlp";
const ADRESSES = ['0x9619dabDC2eb3679943b51aFbc134dEc31b74Fe8']
Moralis.start({ serverUrl, appId });


/* TODO: Add Moralis Authentication code */


async function loginWC(){
    await Moralis.Web3.enableWeb3({provider: 'walletconnect'});
    const user = await Moralis.Web3.authenticate({provider: 'walletconnect'});
    
    if(user){        
        user.save();        
    }
    
}
  
  async function logOut() {
    
    await Moralis.User.logOut();
   
    console.log("logged out");

  }

  async function getNFT () {
    if (!Moralis.User.current())
      await loginWC()

    document.querySelector('#nft-container').innerHTML = '';
    
  
    const web3 = new Web3(Moralis.provider);
  
    ADRESSES.map(async address => {
      const contract = new web3.eth.Contract(window.abi, address);
      const balance = await contract.methods.balanceOf(Moralis.User.current().attributes.ethAddress).call();
      if (balance > 0) {
        const uri = await contract.methods.tokenURI(1).call();
        const URI = uri.split('/').slice(0, uri.split('/').length - 1).join('/');
      
        const nftImages = [];
        const attributes = [];
      
        for (let i=0; i< balance; i++ ) {
          const ID = await contract.methods.tokenOfOwnerByIndex(Moralis.User.current().attributes.ethAddress,i).call();
          console.log("TEST")
          let url='';
          if (URI.includes('ipfs://')) {
            url = `https://ipfs.io/ipfs/${URI.split('ipfs://')[1]}/${ID}`
          }
          else {
            url = await contract.methods.tokenURI(ID).call();
          }
          
          console.log(url)
          try {
            const json = await (await fetch(url)).json()
            nftImages.push(json.image)
            attributes.push(json.attributes)
          } catch(_) {
            continue;
          }
        }
  
        nftImages.map(image => {
            const container = document.querySelector('#nft-container');
            const nft = document.createElement('img');
            nft.src = image;
            container.appendChild(nft);
        })
    }
    })
  }

  async function getSpecificNFT () {
    document.querySelector('#nft-container').innerHTML = '';
    await Moralis.Web3.enableWeb3({provider: 'walletconnect'});
    const web3 = new Web3(Moralis.provider);
  
    const address = document.querySelector('#contract-address').value;
      const contract = new web3.eth.Contract(window.abi, address);
      const balance = await contract.methods.balanceOf(Moralis.User.current().attributes.ethAddress).call();
      if (balance > 0) {
        const uri = await contract.methods.tokenURI(1).call();
        const URI = uri.split('/').slice(0, uri.split('/').length - 1).join('/');
      
        const nftImages = [];
        const attributes = [];
      
        for (let i=0; i< balance; i++ ) {
          const ID = await contract.methods.tokenOfOwnerByIndex(Moralis.User.current().attributes.ethAddress,i).call();
          console.log("TEST")
          let url='';
          if (URI.includes('ipfs://')) {
            url = `https://ipfs.io/ipfs/${URI.split('ipfs://')[1]}/${ID}`
          }
          else {
            url = await contract.methods.tokenURI(ID).call();
          }
          
          console.log(url)
          try {
            const json = await (await fetch(url)).json()
            nftImages.push(json.image)
            attributes.push(json.attributes)
          } catch(_) {
            continue;
          }
        }
  
        nftImages.map(image => {
            const container = document.querySelector('#nft-container');
            const nft = document.createElement('img');
            nft.src = image;
            container.appendChild(nft);
        })
    }
  }


  
  document.getElementById("btn-login").onclick = loginWC;
  document.getElementById("btn-nft").onclick = getNFT;
  document.getElementById("btn-nft2").onclick = getSpecificNFT;
  document.getElementById("btn-logout").onclick = logOut;
