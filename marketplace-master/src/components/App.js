import React, { Component } from 'react';
import Web3 from 'web3'
import logo from '../logo.png';
import './App.css';
import Marketplace from '../abis/Marketplace.json'
import Navbar from './Navbar'
import Main from './Main'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }
  
  // async componentDidMount(){
  //   this.marketplace.votedEvent().watch(function(error, event) {
  //       console.log("event triggered", event)
  //       // Reload when a new vote is recorded
  //       this.setState({loading:false});
  //     });
  // }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Marketplace.networks[networkId]
    console.log(networkId)
    if(networkData) {
      const marketplace = web3.eth.Contract(Marketplace.abi, networkData.address)
      this.setState({ marketplace })
      const candidatesCount = await marketplace.methods.candidatesCount().call()
      this.setState({ candidatesCount })
      const declared = await marketplace.methods.declared().call()
      this.setState({ declared })
      const votersCount = await marketplace.methods.votersCount().call()
      this.setState({votersCount})
      const img = await marketplace.methods.img().call()
      this.state.img=img;
   //  console.log(this.state.voteCount)
      const winner = await marketplace.methods.winner().call()
      this.state.wname=winner.toString();
      //console.log(this.state.winner.toString());
      const chairperson  = await marketplace.methods.chairperson().call()
      this.setState({chairperson})
      // Load products
      for (var i = 1; i <= candidatesCount; i++) {
        const candidate = await marketplace.methods.candidates(i).call()
        this.setState({
          candidates: [...this.state.candidates, candidate]
        })
      }
      const voter = await marketplace.methods.voters(this.state.account).call()
      this.setState({voter})
      this.setState({ loading: false})
    } else {
      window.alert('Marketplace contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      candidatesCount: 0,
      candidates: [],
      voter: '',
      loading: true,
      wname: '',
      img:''
    }
  
    this.castVote = this.castVote.bind(this)
    this.declareResult = this.declareResult.bind(this)
  }

   

 async castVote(id){
  
    this.setState({ loading: true })
    await this.state.marketplace.methods.vote(id).send({ from: this.state.account })
  
    window.alert('You have successfully voted')
    this.setState({loading:false})
 
  }

async declareResult(){
   
    if(this.state.account == this.state.chairperson)
    {
      var max =0
      var id=0
      var kname = "";
      var wimg = "";
     Object.keys(this.state.candidates).map((keyName, keyIndex)=> {
      var votes = this.state.candidates[keyName].voteCount.toString();
      if(votes>max)
      {
        max=votes;
        id = this.state.candidates[keyName].id.toString() 
        kname = this.state.candidates[keyName].name.toString()
        wimg = this.state.candidates[keyName].img.toString()
      }
    }) 
    this.state.wname=kname;
    this.state.img=wimg;

    window.alert(kname+"is declared as the winner of the elections");
    await this.state.marketplace.methods.declare(kname,wimg).send({ from: this.state.account })
  }
}



  render() {
    return (
    <div className="container">
        <Navbar account={this.state.account} />
        <div className="container mt-5 ml-5" id="bb">
          { !this.state.declared ? 
          <div>
          <div className="row">
            <main role="main" className="flex-center ml-10">
              { (this.state.loading)
                ?   <div id="loader" className="text-center"><p id="load" className="text-center"><b>Loading...</b></p></div>  
                : <Main
                  candidates={this.state.candidates}
                  castVote={this.castVote}
                  voter={this.state.voter}
                  account={this.state.account}
                  chairperson={this.state.chairperson}
                   />
              }
            </main>
          </div>
          <div>
              { (this.state.account == this.state.chairperson && !this.state.loading) 
                ? <button className="btn btn-primary" id="decBut"
                onClick={(event) => {
                  this.declareResult()
                }}
              >
                Declare Result
              </button>
              : null
              }
          </div>
          </div>
          : <div> 
            <h1>Voting is over. Thank you for voting. <b>{this.state.wname}</b> is the winner of the elections.</h1>  
            <img src={this.state.img} height="200px" width="200px"/> 
              </div>
          }
        </div>
            
      </div>
    );
  }
}

export default App;
