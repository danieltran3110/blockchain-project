import React, { useEffect } from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import chef from '../../assets/img/chef.png'
import Button from '../../components/Button'
import Container from '../../components/Container'
import Page from '../../components/Page'
import PageHeader from '../../components/PageHeader'
import Spacer from '../../components/Spacer'
import useAllowance from '../../hooks/useAllowance'
import useApprove from '../../hooks/useApprove'
import useSushi from '../../hooks/useSushi'
import useTokenBalance from '../../hooks/useTokenBalance'
import { contractAddresses } from '../../sushi/lib/constants'
import { farm, getFarmAddress, getFarmContract, getToanTokenAddress, getToanTokenContract, stake, toan } from '../../sushi/utils'
import { toTrunc } from '../../utils'
import { getBalanceNumber } from '../../utils/formatBalance'
import Balances from './components/Balances'
import web3 from 'web3';

const Home: React.FC = () => {
    const sushi = useSushi()
    const farmAddress = contractAddresses.farm[1337];
    const tokenBalance = useTokenBalance(getFarmAddress(sushi));
    const toanContract = getToanTokenContract(sushi);
    const farmContract = getFarmContract(sushi);
    const [inputValue, setInputValue] = useState('');
    const [inputValueAddress, setInputValueAddress] = useState('');
    const [inputValueAmountTransfer, setInputValueAmountTransfer] = useState('');
    const { account } = useWallet()
    const [isApproved, setIsApproved] = useState(false);
    const allowance = useAllowance(toanContract, farmContract);
    const { onApprove } = useApprove(toanContract, farmContract);
    console.log(toanContract);
    

    useEffect(() => {
        console.log(allowance);
        
    }, [allowance])

    const handleChangeInput = (e: any) => {
        setInputValue(e.currentTarget.value);
    }

    const handleChangeInputAddress = (e: any) => {
        setInputValueAddress(e.currentTarget.value);
    }

    const handleChangeInputAmountTransfer = (e: any) => {
        setInputValueAmountTransfer(e.currentTarget.value);
    }
    
    const handleDeposit = async(e: any) => {
        // console.log(farmContract);
        e.preventDefault();
        await farm.deposit(farmContract, inputValue.toString(), account);
    }

    const handleTransfer = async(e: any) => {
        e.preventDefault();
        await toan.transfer(toanContract, inputValueAddress, inputValueAmountTransfer, account);
    }

    const handleApprove = async(e: any) => {
        e.preventDefault();
        await onApprove();
        await toan.approveToDeposit(toanContract, account, farmAddress);
    }

    const handleWithdraw = async(e: any) => {
        e.preventDefault();
        await farm.withdraw(farmContract, inputValue.toString(), account);
    }

    return (
    <Page>
        <div id="content" className="mt-3">
            <table className="table table-borderless text-muted text-center">
            <thead>
                <tr>
                <th scope="col">Balance</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td>{toTrunc(getBalanceNumber(tokenBalance), 5)} NHAT</td>
                </tr>
            </tbody>
            </table>

            <div className="card mb-4" >

            <div className="card-body">

                <form className="mb-3">
                <div>
                    <label className="float-left"><b>Stake Tokens</b></label>
                    <span className="float-right text-muted">

                    </span>
                </div>
                <div className="input-group mb-4">
                    <input
                    type="text"
                    // ref={(input) => { this.input = input }}
                    onChange={handleChangeInput} 
                    className="form-control form-control-lg"
                    placeholder="0"
                    required />
                    <div className="input-group-append">
                    <div className="input-group-text">
                        &nbsp;&nbsp;&nbsp; NHAT
                    </div>
                    </div>
                </div>
                {
                    allowance.toNumber() ?
                    <button type="submit" className="btn btn-primary btn-block btn-lg" onClick={(e) => handleDeposit(e)}>Deposit</button>
                    : <button type="submit" className="btn btn-primary btn-block btn-lg" onClick={(e) => handleApprove(e)}>Approve</button>
                }
                </form>
                <button
                type="submit"
                className="btn btn-link btn-block btn-sm"
                onClick={(event) => {handleWithdraw(event)}}>
                    Withdraw
                </button>
            </div>
            </div>

        </div>

        <div id="content" className="mt-3">
            <table className="table table-borderless text-muted text-center">
            <thead>
                <tr>
                <th scope="col">Transfer</th>
                </tr>
            </thead>
            </table>

            <div className="card mb-4" >

            <div className="card-body">

                <form className="mb-3">
                <div className="input-group mb-4">
                    <input
                    type="text"
                    // ref={(input) => { this.input = input }}
                    onChange={handleChangeInputAddress} 
                    className="form-control form-control-lg"
                    placeholder="address"
                    required />
                </div>
                <div className="input-group mb-4">
                    <input
                    type="text"
                    // ref={(input) => { this.input = input }}
                    onChange={handleChangeInputAmountTransfer} 
                    className="form-control form-control-lg"
                    placeholder="0"
                    required />
                    <div className="input-group-append">
                    <div className="input-group-text">
                        &nbsp;&nbsp;&nbsp; TOAN
                    </div>
                    </div>
                </div>
                {
                    allowance.toNumber() ?
                    <button type="submit" className="btn btn-primary btn-block btn-lg" onClick={(e) => handleTransfer(e)}>Transfer</button>
                    : <button type="submit" className="btn btn-primary btn-block btn-lg" onClick={(e) => handleApprove(e)}>Approve</button>
                }
                </form>
            </div>
            </div>

        </div>
    </Page>
  )
}

const StyledInfo = styled.h3`
  color: ${(props) => props.theme.color.grey[500]};
  font-size: 16px;
  font-weight: 400;
  margin: 0;
  padding: 0;
  text-align: center;

  > b {
    color: ${(props) => props.theme.color.grey[600]};
  }
`

export default Home
