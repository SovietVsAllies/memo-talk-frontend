import './MicroBlogs.css';
import React, {Component, Fragment} from 'react';
import Loading from "../Loading/Loading";

/***
 * blogs: A list of blog
 * blog: name, id, blogID, time, content
 */
class MicroBlogs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            posts: [],
        };

        // Initialize web3.
        if (typeof window.web3 !== 'undefined') {
            window.web3 = new window.Web3(window.web3.currentProvider);
        } else {
            window.web3 = new window.Web3(new window.Web3.providers.HttpProvider("http://localhost:8545"));
        }
        this.web3 = window.web3;
        this.web3.eth.defaultAccount = this.web3.eth.accounts[0];
        this.web3.personal.unlockAccount(this.web3.eth.accounts[0], 'test', 0);
        this.registryContract = this.web3.eth.contract([{
            "constant": false,
            "inputs": [{"name": "name", "type": "string"}, {"name": "addr", "type": "address"}],
            "name": "register",
            "outputs": [{"name": "result", "type": "int256"}],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [{"name": "name", "type": "string"}],
            "name": "getAccountAddress",
            "outputs": [{"name": "addr", "type": "address"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": false,
            "inputs": [{"name": "disabled", "type": "bool"}],
            "name": "setDisabled",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "getAccountCount",
            "outputs": [{"name": "count", "type": "int256"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [{"name": "addr", "type": "address"}],
            "name": "getAccountName",
            "outputs": [{"name": "name", "type": "string"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {"inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor"}]);
        this.accountContract = this.web3.eth.contract([{
            "constant": true,
            "inputs": [{"name": "index", "type": "int256"}],
            "name": "getPost",
            "outputs": [{"name": "timestamp", "type": "uint256"}, {"name": "content", "type": "string"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [{"name": "index", "type": "int256"}],
            "name": "getMessage",
            "outputs": [{"name": "sender", "type": "address"}, {
                "name": "timestamp",
                "type": "uint256"
            }, {"name": "content", "type": "bytes"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "getMessageCount",
            "outputs": [{"name": "count", "type": "int256"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "getRegistrationId",
            "outputs": [{"name": "registrationId", "type": "int256"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": false,
            "inputs": [{"name": "content", "type": "bytes"}],
            "name": "sendMessage",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "constant": false,
            "inputs": [{"name": "content", "type": "string"}],
            "name": "post",
            "outputs": [{"name": "result", "type": "int256"}],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "getIdentityKey",
            "outputs": [{"name": "identityKey", "type": "string"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "getSignedPreKey",
            "outputs": [{"name": "signedPreKey", "type": "string"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "getPostCount",
            "outputs": [{"name": "count", "type": "int256"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "inputs": [{"name": "registrationId", "type": "int256"}, {
                "name": "identityKey",
                "type": "string"
            }, {"name": "signedPreKey", "type": "string"}],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        }]);
        this.accountData = '0x608060405234801561001057600080fd5b50604051610c67380380610c67833981018060405281019080805190602001909291908051820192919060200180518201929190505050336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600060028190555060006004819055508260058190555081600690805190602001906100b49291906100d4565b5080600790805190602001906100cb9291906100d4565b50505050610179565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061011557805160ff1916838001178555610143565b82800160010185558215610143579182015b82811115610142578251825591602001919060010190610127565b5b5090506101509190610154565b5090565b61017691905b8082111561017257600081600090555060010161015a565b5090565b90565b610adf806101886000396000f300608060405260043610610099576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806308c71f2f1461009e578063277c9cb21461014b578063319339161461022b57806358b3236f1461025657806382646a58146102815780638ee93cf3146102ea57806394525b8a146103675780639d068dd0146103f7578063bcc9540714610487575b600080fd5b3480156100aa57600080fd5b506100c9600480360381019080803590602001909291905050506104b2565b6040518083815260200180602001828103825283818151815260200191508051906020019080838360005b8381101561010f5780820151818401526020810190506100f4565b50505050905090810190601f16801561013c5780820380516001836020036101000a031916815260200191505b50935050505060405180910390f35b34801561015757600080fd5b5061017660048036038101908080359060200190929190505050610585565b604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200180602001828103825283818151815260200191508051906020019080838360005b838110156101ee5780820151818401526020810190506101d3565b50505050905090810190601f16801561021b5780820380516001836020036101000a031916815260200191505b5094505050505060405180910390f35b34801561023757600080fd5b50610240610694565b6040518082815260200191505060405180910390f35b34801561026257600080fd5b5061026b61069e565b6040518082815260200191505060405180910390f35b34801561028d57600080fd5b506102e8600480360381019080803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091929192905050506106a8565b005b3480156102f657600080fd5b50610351600480360381019080803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919291929050505061075c565b6040518082815260200191505060405180910390f35b34801561037357600080fd5b5061037c610840565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156103bc5780820151818401526020810190506103a1565b50505050905090810190601f1680156103e95780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561040357600080fd5b5061040c6108e2565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561044c578082015181840152602081019050610431565b50505050905090810190601f1680156104795780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561049357600080fd5b5061049c610984565b6040518082815260200191505060405180910390f35b6000606060016000848152602001908152602001600020600001549150600160008481526020019081526020016000206001018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156105795780601f1061054e57610100808354040283529160200191610579565b820191906000526020600020905b81548152906001019060200180831161055c57829003601f168201915b50505050509050915091565b60008060606003600085815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16925060036000858152602001908152602001600020600101549150600360008581526020019081526020016000206002018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156106865780601f1061065b57610100808354040283529160200191610686565b820191906000526020600020905b81548152906001019060200180831161066957829003601f168201915b505050505090509193909250565b6000600454905090565b6000600554905090565b3360036000600454815260200190815260200160002060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550426003600060045481526020019081526020016000206001018190555080600360006004548152602001908152602001600020600201908051906020019061074892919061098e565b506004600081546001019190508190555050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156107dc577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff905061083b565b4260016000600254815260200190815260200160002060000181905550816001600060025481526020019081526020016000206001019080519060200190610825929190610a0e565b5060026000815460010191905081905550600090505b919050565b606060068054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156108d85780601f106108ad576101008083540402835291602001916108d8565b820191906000526020600020905b8154815290600101906020018083116108bb57829003601f168201915b5050505050905090565b606060078054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561097a5780601f1061094f5761010080835404028352916020019161097a565b820191906000526020600020905b81548152906001019060200180831161095d57829003601f168201915b5050505050905090565b6000600254905090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106109cf57805160ff19168380011785556109fd565b828001600101855582156109fd579182015b828111156109fc5782518255916020019190600101906109e1565b5b509050610a0a9190610a8e565b5090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610a4f57805160ff1916838001178555610a7d565b82800160010185558215610a7d579182015b82811115610a7c578251825591602001919060010190610a61565b5b509050610a8a9190610a8e565b5090565b610ab091905b80821115610aac576000816000905550600101610a94565b5090565b905600a165627a7a72305820cc977d1c0fcf8283dfb1410da209aa239c09897d7df9cbc6af840e2b054995e20029';
        this.registry = this.registryContract.at('0x36b5676bca43cc16005640c2cfb4f26e8413ff30');
    }

    componentDidMount() {
        let accountAddress = localStorage.getItem('account');
        let account = this.accountContract.at(accountAddress);

        let following = [account];
        let followingNames = JSON.parse(localStorage.getItem('following'));
        for (let i in followingNames) {
            following.push(this.accountContract.at(this.registry.getAccountAddress(followingNames[i])));
        }
        let posts = [];
        for (let i in following) {
            let acc = following[i];
            let count = acc.getPostCount().toNumber();
            for (let j = 0; j < count; j++) {
                let post = acc.getPost(j);
                post = {
                    account: acc,
                    accountName: this.registry.getAccountName(acc.address),
                    id: j,
                    timestamp: new Date(post[0].toNumber() * 1000).toLocaleString(),
                    content: post[1]
                };

                // Filter
                // if (filter(post.content)) {
                posts.push(post);
                // }
            }
        }
        posts.sort(function (lhs, rhs) {
            return rhs.timestamp - lhs.timestamp;
        });
        this.setState({
            loaded: true,
            posts: posts,
        })
    }

    render() {
        let blogsContent;
        if (this.state.loaded === false) {
            blogsContent = <Loading/>
        } else {
            blogsContent =
                <div className="container" id="blogs-block">
                    {this.state.posts.map((blog) =>
                        <SingleBlog
                            key={blog.id + blog.account.address}
                            name={blog.accountName}
                            id={blog.id}
                            time={blog.timestamp}
                            content={blog.content}
                        />
                    )}
                </div>
            ;
        }
        return (
            <Fragment>
                <header className='text-center' id='blogs-header'>These are microblogs from every peer:</header>
                {blogsContent}
            </Fragment>
        );
    }
}

class SingleBlog extends Component {
    render() {
        return (
            <div className='blog-block'>
                <div>
                    <div className='sender-info'>
                        <span className='sender-name'>{this.props.name}</span>
                        <span className='sender-id sender-at'>@</span>
                        <span className='sender-id'>{this.props.id}</span>
                    </div>
                    <div className='sent-time'>{this.props.time}</div>
                    <div className='blog-content'>{this.props.content}</div>
                </div>
            </div>
        );
    }
}

class SendBlogBlock extends Component {
    render() {
        return(
            <div>

            </div>
        );
    }
}

export default MicroBlogs;
