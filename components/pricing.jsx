import React from 'react'
import { Card, CardContent } from './ui/card'
import { PricingTable } from '@clerk/nextjs'

const Pricing = () => {
  return (
    <Card className={"border-emerald-900/30 rounded-2xl shadow-lg bg-gradient-to-b from-emerald-950/50 to-transparent"}>
      <CardContent className={"p-8"}>
        <PricingTable checkoutProps={
            {
                appearance:{
                    elements:{
                        drawerRoot:{
                            zIndex: 50,
                        }
                    }
                }
            }
        }/>
      </CardContent>
    </Card>
  )
}

export default Pricing
