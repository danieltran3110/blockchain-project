import React, { useEffect } from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import Page from '../../components/Page'
import useSushi from '../../hooks/useSushi'
import { getColorContract, getColorContractAddress } from '../../sushi/utils'


const MyColor: React.FC = () => {
    const sushi = useSushi()
    const colorContract = getColorContract(sushi);
    const colorAddress = getColorContractAddress(sushi);
    const { account } = useWallet()

    const [colors, setColors] = useState([]);

    useEffect(() => {
        if (colorContract) {
            getMyColors();
        }
     }, [colorContract])

    const getMyColors = () => {
        console.log(123);
    }

    return (
        <Page>
            <div className="color">
                <div className="color__list">
                    {
                        colors && !!colors.length && colors.map(color => 
                            <div className="color__item">
                                <div className="color__bg" style={{backgroundColor: color}}></div>
                                <p className="name">{color}</p>
                                <button className="btn-buy">Buy</button>
                            </div>
                        )
                    }
                </div>
            </div>
        </Page>
  )
}

export default MyColor
