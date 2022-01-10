import React, { Component } from 'react'
import Navbar from './Navbar';
import Web3 from 'web3';
import Tether from '../truffle_abis/Tether.json';
import RWD from '../truffle_abis/RWD.json';
import DecentralBank from '../truffle_abis/DecentralBank.json';

class App extends Component {
    async UNSAFE_componentWillMount(){
        this.loadWeb3()
        this.loadBlockChainData();
    }
    async loadWeb3(){
        if(window.ethereum){
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enabled();
        }else if(window.web3){
            window.web3 = new Web3(window.web3.currentProvider)
        }else{
            window.alert('No ethereum wallet is connected');
        }
        
    }
    async loadBlockChainData(){
        let web3 = window.web3;
        const account = await web3.eth.getAccounts();
        this.setState({
            account:account[0]
        })
        const networkId =await web3.eth.net.getId();
        const tetherData = await Tether.networks[networkId];

        if(tetherData){
            let tether = new web3.eth.Contract(Tether.abi,tetherData.address);
            this.setState({tether});
            let tetherBalance = await tether.methods.balanceOf(this.state.account).call();
            this.setState({tetherBalance:tetherBalance.toString()});
        }else{
            window.alert('Tether contract not deployed, network not detected')
        }


        const rwdData = await RWD.networks[networkId];
        if(rwdData){
            let rwd = new web3.eth.Contract(RWD.abi,rwdData.address);
            this.setState({rwd});
            let rwdBalance = await rwd.methods.balanceOf(this.state.account).call();
            this.setState({rwdBalance:rwdBalance.toString()});
        }else{
            window.alert('RWD contract not deployed, network not detected')
        }


        const decentralData = await DecentralBank.networks[networkId];
        if(decentralData){
            let decentralBank = new web3.eth.Contract(DecentralBank.abi,decentralData.address);
            this.setState({decentralBank})
            let stakingBalance = await decentralBank.methods.stakingBalance(this.state.account).call();
            this.setState({stakingBalance: stakingBalance.toString()});
        }else{
            window.alert('DecentralBank contract not deployed, network not detected')
        }
        this.setState({loading:false})
    }

    constructor(props){
        super(props)
        this.state = {
            account:'0.0',
            tether:{},
            rwd:{},
            decentralBank:{},
            tetherBalance :'0',
            rwdBalance:'0',
            stakingBalance:'0',
            loading:true
        }
    }
   
    render() {
        return (
            <div>
                <Navbar accounts = {this.state.account}/>
                
            </div>
        )
    }
}
export default App;