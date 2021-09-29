import React, { useEffect } from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import Page from '../../components/Page'
import useApproveNFT from '../../hooks/useApproveNFT'
import useCheckApproveNFT from '../../hooks/useCheckApproveNFT'
import useSushi from '../../hooks/useSushi'
import { colorFnc, getColorContract, getColorContractAddress } from '../../sushi/utils'


const Color: React.FC = () => {
    const sushi = useSushi()
    const colorContract = getColorContract(sushi);
    const colorAddress = getColorContractAddress(sushi);
    const { account } = useWallet()
    // console.log('colorContract', colorContract);
    // console.log('colorAddress', colorAddress);
    
    const [colors, setColors] = useState([]);
    const [inputColor, setInputColor] = useState('');

    const isApprovedNFT = useCheckApproveNFT(colorContract, account)
    const { onApproveNFT } = useApproveNFT(colorContract, account)

    console.log('isApprovedNFT', isApprovedNFT);

    useEffect(() => {
       if (colorContract) {
           getTotalSupply();
       }
    }, [colorContract])

    const getTotalSupply = async() => {
        // console.log('colorContract', colorContract);
        const total = await colorFnc.totalColors(colorContract);
        console.log('total', total);
        setColors(total);
    }

    const handleSubmit = async() => {
        console.log(inputColor);
        if (colors.includes(inputColor)) {
            alert('Duplicate color')
        } else {
            await colorFnc.mint(colorContract, inputColor, account);
            getTotalSupply()
        }
        setInputColor('')
    }

    const handleBuyNFT = async(color: string) => {
        console.log(color);   
    }

    const handleApproveNFT = async() => {
        await onApproveNFT();
    }
    
    return (
    <Page>
        <div className="color">
            <div className="color__header">
                <h1>Add Color NFT</h1>
                <div className="group-input">
                    <input onChange={(e) => setInputColor(e.currentTarget.value)} className="input" type="text" placeholder="Add Hex" />
                    <button className="btn-custom" onClick={() => handleSubmit()}>Submit</button>
                </div>
            </div>
            <div className="color__list">
                {
                    colors && !!colors.length && colors.map((color, index) => 
                        <div key={index} className="color__item">
                            <div className="color__bg" style={{backgroundColor: color}}></div>
                            <p className="name">{color}</p>
                            {
                                isApprovedNFT ? 
                                <button onClick={() => handleBuyNFT(color)} className="btn-buy">Buy</button> :
                                <button onClick={() => handleApproveNFT()} className="btn-buy">Approve</button>
                            }
                        </div>
                    )
                }
            </div>
        </div>

    </Page>
  )
}

export default Color
