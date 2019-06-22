import React from "react";
import { graphqlOperation } from 'aws-amplify';
import { Connect } from 'aws-amplify-react';
import { listMarkets } from '../graphql/queries';
import { onCreateMarket } from '../graphql/subscriptions';
import Error from './Error';
import { Loading, Card, Icon, Tag } from "element-react";
import {Link} from "react-router-dom";

const MarketList = ({ searchResults}) => {
  const onNewMarket = (prevQuery, newData) => {
      let updateQuery = { ...prevQuery };
      const updateMarketList = [
        newData.onCreateMarket,
        ...prevQuery.listMarkets.items,
      ]
      console.log("this is the list" + updateMarketList);
      updateQuery.listMarkets.item = updateMarketList;
      return updateQuery;
  }

  return (
    <Connect
      query={graphqlOperation(listMarkets)}
      subscription={graphqlOperation(onCreateMarket)}
      onSubscriptionMsg={onNewMarket}
    >
  {({ data, loading, errors }) => {
      if(errors.length > 0) return <Error errors={errors}></Error>
      if(loading || !data.listMarkets) return <Loading fullscreen={true}></Loading>
      const markets = searchResults.length > 0 ? searchResults : data.listMarkets.items;
      return(
        <>
        {
          searchResults.length > 0 ? (
            <h2 className="text-green">
              <Icon type="success" name="check" className="icon"></Icon>
                {searchResults.length} Results
            </h2>
          ):(

        <h2 className="header">
          <img src="https://icon.now.sh/store_mall_directory/527FFF" 
                alt="Store Icon" className="large-icon">
          </img>
          Markets
          </h2>)}
        {markets.map( market => (
          <div key={market.id} className="my-2">
            <Card bodyStyle={{
              padding: "0.7em",
              display:'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span className="flex">
                  <Link className="link" to={`/markets/${market.id}`}>
                    {market.name}
                  </Link>
                  <span style={{ color: "var(--darkAmazonOrange)" }}>
                    {/*market.products.items.length*/}
                  </span>
                  <img src="https://icon.now.sh/add_shopping_cart/f60" 
                    alt="Shopping Cart"></img>
                </span>
                <div style= {{ color : "var(--lightSquidInk)" }}>
                  {market.owner}
                </div>
              </div>
              <div>
                {market.tags && market.tags.map(tag => (
                    <Tag key={tag} type="danger" className="mx-1">
                        {tag}  
                    </Tag>
                  ))}
              </div>
            </Card> 
          </div>    
        ))}
        </>
      )
  }}
    </Connect>
  )
};

export default MarketList;